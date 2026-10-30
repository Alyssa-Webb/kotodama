/**
 * validatePack: the single validator shared by content-lint (CLI) and the app's import screen.
 * Zod checks the shape; the rules below check meaning (references, furigana, node rules...).
 */
import { LessonPackSchema, type Exercise, type Item, type LessonPack } from '../../schema/pack';
import { parseFurigana, slotNames, toReading, toSurface } from '../text/furigana';
import { isKanaOnly } from '../text/kana';
import { collectVoiceLines } from './lines';

export interface Issue {
  path: string;
  message: string;
}

export interface PackStats {
  items: Record<Item['kind'], number>;
  dialogues: number;
  units: number;
  nodes: number;
  exercises: number;
  voiceLines: number;
  voicedLines: number;
}

export interface ValidationResult {
  ok: boolean;
  pack?: LessonPack;
  errors: Issue[];
  warnings: Issue[];
  stats?: PackStats;
}

export interface ValidateOptions {
  /** Item kinds already known from installed packs or the Learner Report, by ID. */
  knownItems?: ReadonlyMap<string, Item['kind']>;
  knownDialogues?: ReadonlySet<string>;
  /** Line keys that already have audio (from a voice manifest). */
  voicedKeys?: ReadonlySet<string>;
}

const PREFIX_KIND: Record<string, Item['kind']> = {
  k: 'kana',
  w: 'word',
  p: 'phrase',
  g: 'pattern',
  s: 'sentence',
};

const LESSON_MIN = 10;
const LESSON_MAX = 15;
const CHECKPOINT_MIN = 15;
const CHECKPOINT_MAX = 20;
const MIN_TYPES = 4;
const MAX_NEW = 6;

/** Item IDs an exercise practices (targets), and IDs it only mentions (distractors). */
export function exerciseRefs(ex: Exercise): { targets: string[]; others: string[] } {
  switch (ex.type) {
    case 'choice':
    case 'listen':
      return { targets: [ex.item], others: ex.distractors };
    case 'match':
      return { targets: ex.items, others: [] };
    case 'situation':
      return { targets: [ex.answer], others: ex.distractors };
    case 'fill':
    case 'reply':
      return { targets: [], others: [] };
    default:
      return { targets: [ex.item], others: [] };
  }
}

export function validatePack(input: unknown, opts: ValidateOptions = {}): ValidationResult {
  const parsed = LessonPackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => ({
        path: i.path.map(String).join('.') || '(root)',
        message: i.message,
      })),
      warnings: [],
    };
  }
  const pack = parsed.data;
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const err = (path: string, message: string) => errors.push({ path, message });
  const warn = (path: string, message: string) => warnings.push({ path, message });

  const furi = (path: string, text: string | undefined, allowSlots = false) => {
    if (text === undefined) return;
    const { tokens, errors: es } = parseFurigana(text);
    es.forEach((e) => err(path, e));
    if (!allowSlots && tokens.some((t) => t.kind === 'slot'))
      err(path, 'Slots {{...}} are only allowed in patterns');
  };

  // ---- items
  const items = new Map<string, Item>();
  const kindOf = (id: string): Item['kind'] | undefined =>
    items.get(id)?.kind ?? opts.knownItems?.get(id);
  pack.items.forEach((item, i) => {
    const p = `items[${i}] (${item.id})`;
    if (items.has(item.id)) err(p, `Duplicate item ID "${item.id}"`);
    items.set(item.id, item);
    if (opts.knownItems?.has(item.id))
      warn(p, `"${item.id}" is already defined in an installed pack; it will be updated`);
    const expected = PREFIX_KIND[item.id[0]!];
    if (expected !== item.kind)
      err(p, `ID prefix "${item.id.split('.')[0]}." does not match kind "${item.kind}"`);
    switch (item.kind) {
      case 'kana':
        if (!isKanaOnly(item.text)) err(p, `Kana item text "${item.text}" must be kana only`);
        break;
      case 'word':
        furi(`${p}.text`, item.text);
        Object.entries(item.forms ?? {}).forEach(([k, v]) => furi(`${p}.forms.${k}`, v));
        furi(`${p}.example.text`, item.example?.text);
        break;
      case 'phrase':
        furi(`${p}.text`, item.text);
        item.variants?.forEach((v, j) => furi(`${p}.variants[${j}]`, v.text));
        item.accept?.forEach((v, j) => furi(`${p}.accept[${j}]`, v));
        item.tiles?.forEach((v, j) => furi(`${p}.tiles[${j}]`, v));
        if (item.tiles) checkTiles(p, item.text, item.tiles);
        break;
      case 'sentence':
        furi(`${p}.text`, item.text);
        item.accept?.forEach((v, j) => furi(`${p}.accept[${j}]`, v));
        item.tiles.forEach((v, j) => furi(`${p}.tiles[${j}]`, v));
        checkTiles(p, item.text, item.tiles);
        break;
      case 'pattern': {
        furi(`${p}.pattern`, item.pattern, true);
        item.examples.forEach((e, j) => furi(`${p}.examples[${j}]`, e.text));
        const used = new Set(slotNames(item.pattern));
        const declared = new Set(Object.keys(item.slots));
        used.forEach((s) => declared.has(s) || err(p, `Slot "{{${s}}}" has no entry in "slots"`));
        declared.forEach(
          (s) => used.has(s) || err(p, `Slot "${s}" is declared but not used in the pattern`),
        );
        if (used.size !== 1)
          warn(
            p,
            'Patterns with exactly one slot are filled automatically; others are shown as examples only',
          );
        for (const s of slotNames(item.meaningPattern))
          if (!declared.has(s)) err(p, `meaningPattern uses unknown slot "{{${s}}}"`);
        break;
      }
    }
  });

  function checkTiles(p: string, text: string, tiles: string[]) {
    const strip = (s: string) => s.replace(/\s+/g, '');
    if (strip(toSurface(tiles.join(''))) !== strip(toSurface(text)))
      err(
        `${p}.tiles`,
        `Tiles join to "${toSurface(tiles.join(''))}", not the text "${toSurface(text)}"`,
      );
    else if (strip(toReading(tiles.join(''))) !== strip(toReading(text)))
      err(`${p}.tiles`, 'Tiles carry different readings than the text');
  }

  // pattern slot references (after all items are known)
  pack.items.forEach((item, i) => {
    if (item.kind !== 'pattern') return;
    for (const [slot, ids] of Object.entries(item.slots))
      for (const id of ids) {
        const k = kindOf(id);
        if (!k) err(`items[${i}].slots.${slot}`, `Unknown item "${id}"`);
        else if (k === 'pattern')
          err(`items[${i}].slots.${slot}`, `"${id}" is a pattern and cannot fill a slot`);
      }
  });

  // ---- dialogues
  const dialogues = new Map((pack.dialogues ?? []).map((d) => [d.id, d]));
  const seenDialogue = new Set<string>();
  (pack.dialogues ?? []).forEach((d, i) => {
    const p = `dialogues[${i}] (${d.id})`;
    if (seenDialogue.has(d.id)) err(p, `Duplicate dialogue ID "${d.id}"`);
    seenDialogue.add(d.id);
    if (!d.id.startsWith('d.')) err(p, 'Dialogue IDs start with "d."');
    d.lines.forEach((line, j) => {
      furi(`${p}.lines[${j}].text`, line.text);
      if (line.choices) {
        if (line.speaker !== 'player')
          err(`${p}.lines[${j}]`, 'Only "player" lines may have choices');
        const correct = line.choices.filter((c) => c.correct).length;
        if (correct !== 1)
          err(`${p}.lines[${j}]`, `Exactly one choice must be correct (found ${correct})`);
        line.choices.forEach((c, k) => furi(`${p}.lines[${j}].choices[${k}]`, c.text));
      }
    });
  });
  const hasDialogue = (id: string) => dialogues.has(id) || !!opts.knownDialogues?.has(id);

  // ---- units, nodes, exercises
  const ids = { unit: new Set<string>(), node: new Set<string>(), ex: new Set<string>() };
  const introducedAt = new Map<string, string>();
  const available = new Set<string>(opts.knownItems?.keys() ?? []);
  let exerciseCount = 0;
  let nodeCount = 0;

  for (const [ui, unit] of pack.units.entries()) {
    const up = `units[${ui}] (${unit.id})`;
    if (ids.unit.has(unit.id)) err(up, `Duplicate unit ID "${unit.id}"`);
    ids.unit.add(unit.id);
    const last = unit.nodes.at(-1);
    if (last && last.kind !== 'checkpoint') warn(up, 'A unit should end with a "checkpoint" node');
    if (!unit.nodes.some((n) => n.kind === 'story'))
      warn(up, 'A unit should include a "story" node with a dialogue');

    for (const [ni, node] of unit.nodes.entries()) {
      nodeCount++;
      const np = `${up}.nodes[${ni}] (${node.id})`;
      if (ids.node.has(node.id)) err(np, `Duplicate node ID "${node.id}"`);
      ids.node.add(node.id);

      for (const id of node.introduces) {
        if (!items.has(id)) err(np, `introduces "${id}", which is not a new item in this pack`);
        if (introducedAt.has(id))
          err(np, `"${id}" is introduced more than once (also in ${introducedAt.get(id)})`);
        introducedAt.set(id, node.id);
        available.add(id);
      }
      node.teach?.forEach((t, ti) => {
        if ('item' in t && !kindOf(t.item)) err(`${np}.teach[${ti}]`, `Unknown item "${t.item}"`);
      });

      const n = node.exercises.length;
      const types = new Set(node.exercises.map((e) => e.type));
      if (node.kind === 'lesson') {
        if (n < LESSON_MIN || n > LESSON_MAX)
          err(np, `Lesson nodes need ${LESSON_MIN}–${LESSON_MAX} exercises (has ${n})`);
        if (types.size < MIN_TYPES)
          err(np, `Lesson nodes need at least ${MIN_TYPES} exercise types (has ${types.size})`);
        if (node.introduces.length > MAX_NEW)
          err(np, `At most ${MAX_NEW} new items per lesson (has ${node.introduces.length})`);
      }
      if (node.kind === 'checkpoint') {
        if (n < CHECKPOINT_MIN || n > CHECKPOINT_MAX)
          err(np, `Checkpoint nodes need ${CHECKPOINT_MIN}–${CHECKPOINT_MAX} exercises (has ${n})`);
        if (node.introduces.length) err(np, 'Checkpoint nodes introduce no new items');
      }
      if (node.kind === 'story' && !node.exercises.some((e) => e.type === 'reply'))
        warn(np, 'Story nodes should include a "reply" exercise');

      const practice = new Map<string, { count: number; types: Set<string> }>();
      for (const [ei, ex] of node.exercises.entries()) {
        exerciseCount++;
        const ep = `${np}.exercises[${ei}] (${ex.id})`;
        if (ids.ex.has(ex.id)) err(ep, `Duplicate exercise ID "${ex.id}"`);
        ids.ex.add(ex.id);
        const { targets, others } = exerciseRefs(ex);
        for (const id of targets) {
          if (!kindOf(id)) err(ep, `Unknown item "${id}"`);
          else if (!available.has(id))
            err(ep, `"${id}" is used before the node that introduces it`);
          const pr = practice.get(id) ?? { count: 0, types: new Set() };
          pr.count++;
          // Directions are distinct skills (understand vs produce), so they count as distinct types.
          pr.types.add('direction' in ex ? `${ex.type}:${ex.direction}` : ex.type);
          practice.set(id, pr);
        }
        for (const id of others) {
          if (!kindOf(id)) err(ep, `Unknown distractor "${id}"`);
          if (targets.includes(id)) err(ep, `"${id}" is both the answer and a distractor`);
          const tk = targets[0] ? kindOf(targets[0]) : undefined;
          if (ex.type !== 'situation' && tk && kindOf(id) && kindOf(id) !== tk)
            warn(ep, `Distractor "${id}" is a ${kindOf(id)}, the answer is a ${tk}`);
        }
        checkExercise(ep, ex);
      }
      for (const id of node.introduces) {
        const pr = practice.get(id);
        if (node.kind === 'lesson' && (!pr || pr.count < 3 || pr.types.size < 2))
          warn(
            np,
            `New item "${id}" should be practiced 3+ times across 2+ types (has ${pr?.count ?? 0})`,
          );
      }
    }
  }

  for (const id of items.keys())
    if (!introducedAt.has(id)) err(`items (${id})`, `"${id}" is never introduced by any node`);

  function checkExercise(ep: string, ex: Exercise) {
    const item = 'item' in ex ? items.get(ex.item) : undefined;
    switch (ex.type) {
      case 'tiles':
        if (item && item.kind !== 'sentence' && !(item.kind === 'phrase' && item.tiles))
          err(ep, `"${ex.item}" has no tiles`);
        ex.extraTiles?.forEach((t, i) => furi(`${ep}.extraTiles[${i}]`, t));
        break;
      case 'trace':
        if (
          item &&
          !(
            item.kind === 'kana' ||
            (item.kind === 'word' && [...toSurface(item.text)].length === 1)
          )
        )
          err(ep, 'trace works on kana or one-kanji words only');
        break;
      case 'register':
        if (item) {
          if (item.kind !== 'phrase') err(ep, 'register exercises need a phrase');
          else {
            const regs = new Set([item.register, ...(item.variants ?? []).map((v) => v.register)]);
            if (!regs.has(ex.from) || !regs.has(ex.to))
              err(ep, `"${ex.item}" has no ${ex.from}→${ex.to} variants`);
            if (ex.from === ex.to) err(ep, '"from" and "to" must differ');
          }
        }
        break;
      case 'pattern':
        if (item && item.kind !== 'pattern') err(ep, 'pattern exercises need a pattern item');
        break;
      case 'conjugate':
        if (item && (item.kind !== 'word' || !item.forms?.[ex.form]))
          err(ep, `"${ex.item}" has no form "${ex.form}"`);
        break;
      case 'fill':
        furi(`${ep}.text`, ex.text);
        furi(`${ep}.answer`, ex.answer);
        ex.options.forEach((o, i) => furi(`${ep}.options[${i}]`, o));
        if (!ex.text.includes('＿＿')) err(ep, 'fill text needs a ＿＿ blank');
        if (!ex.options.includes(ex.answer)) err(ep, 'fill options must include the answer');
        if (new Set(ex.options).size !== ex.options.length) err(ep, 'fill options must be unique');
        break;
      case 'match':
        if (new Set(ex.items).size !== ex.items.length) err(ep, 'match items must be unique');
        break;
      case 'reply': {
        if (!hasDialogue(ex.dialogue)) err(ep, `Unknown dialogue "${ex.dialogue}"`);
        const d = dialogues.get(ex.dialogue);
        if (d && !d.lines.some((l) => l.choices))
          err(ep, `Dialogue "${ex.dialogue}" has no player choices`);
        break;
      }
      case 'situation':
        if (kindOf(ex.answer) === 'pattern')
          err(ep, 'situation answers must be sayable items (not patterns)');
        break;
      default:
        break;
    }
  }

  const voiceLines = collectVoiceLines(pack);
  const voicedLines = opts.voicedKeys
    ? voiceLines.filter((l) => opts.voicedKeys!.has(l.key)).length
    : 0;
  const stats: PackStats = {
    items: { kana: 0, word: 0, phrase: 0, pattern: 0, sentence: 0 },
    dialogues: dialogues.size,
    units: pack.units.length,
    nodes: nodeCount,
    exercises: exerciseCount,
    voiceLines: voiceLines.length,
    voicedLines,
  };
  for (const item of pack.items) stats.items[item.kind]++;
  if (voicedLines < voiceLines.length)
    warnings.push({
      path: '(voice)',
      message: `Voice pending for ${voiceLines.length - voicedLines} of ${voiceLines.length} lines (device voice will be used)`,
    });

  return { ok: errors.length === 0, pack, errors, warnings, stats };
}

/** Paste-ready error list for ChatGPT. */
export function formatErrorsForChatGPT(result: ValidationResult, packTitle?: string): string {
  const head = `Kotodama rejected ${packTitle ? `the pack "${packTitle}"` : 'your pack'}. Fix every error below and resend the whole LessonPack as one json code block.`;
  const lines = result.errors.map((e, i) => `${i + 1}. ${e.path}: ${e.message}`);
  const warn = result.warnings
    .filter((w) => w.path !== '(voice)')
    .map((w) => `- ${w.path}: ${w.message}`);
  return [
    head,
    '',
    'Errors:',
    ...lines,
    ...(warn.length ? ['', 'Warnings (fix if you can):', ...warn] : []),
  ].join('\n');
}
