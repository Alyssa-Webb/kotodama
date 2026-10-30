/**
 * Exercise plugins: one `prepare` per exercise type, turning authored JSON into a Question.
 * Shuffles use the injected seeded RNG so a lesson replays identically in tests.
 */
import type { Exercise, ExerciseType, Item, Pattern, Phrase } from '../../schema/pack';
import { itemJapanese, itemMeaning } from '../pack/index';
import { fillSlots, slotNames, toReading, toSurface } from '../text/furigana';
import { enAccepted, jaAccepted } from './grade';
import type {
  Display,
  ExercisePlugin,
  Facet,
  Option,
  PrepareContext,
  Question,
  Skill,
  Target,
} from './types';

const ja = (text: string, hideFurigana = false): Display =>
  hideFurigana ? { ja: text, hideFurigana } : { ja: text };
const en = (text: string): Display => ({ en: text });

export function facetFor(item: Item, mode: 'understand' | 'produce'): Facet {
  return item.kind === 'kana' || item.kind === 'word' ? 'main' : mode;
}

const target = (item: Item, mode: 'understand' | 'produce'): Target => ({
  itemId: item.id,
  facet: facetFor(item, mode),
});

function skillOf(item: Item | undefined, listening = false): Skill {
  if (listening) return 'listening';
  if (!item) return 'grammar';
  if (item.kind === 'kana') return 'kana';
  if (item.kind === 'pattern') return 'grammar';
  return 'vocabulary';
}

function noteOf(item: Item): string | undefined {
  if (item.kind === 'phrase')
    return item.literal ? `${item.usage} Literally: “${item.literal}”` : item.usage;
  return item.notes;
}

/** Japanese reading as an answer option: kana for words, romaji sound for kana items. */
function readingDisplay(item: Item): Display {
  return item.kind === 'kana' ? en(item.meanings[0]!) : ja(toReading(itemJapanese(item)));
}

function meaningDisplay(item: Item): Display {
  return en(itemMeaning(item));
}

function lookup(ctx: PrepareContext, ids: readonly string[]): Item[] {
  return ids.map((id) => ctx.index.item(id)).filter((x): x is Item => !!x);
}

function options(
  ctx: PrepareContext,
  answer: Item,
  distractors: Item[],
  show: (i: Item) => Display,
): { options: Option[]; correctId: string } {
  const seen = new Set<string>();
  const all = [answer, ...distractors].filter((i) => {
    const key = JSON.stringify(show(i));
    if (seen.has(key)) return false; // never show two identical options
    seen.add(key);
    return true;
  });
  return {
    options: ctx.rng.shuffle(all.map((i) => ({ id: i.id, display: show(i) }))),
    correctId: answer.id,
  };
}

/** Splits tiles into the shuffled pool and a punctuation suffix that is shown fixed at the end. */
function tilePool(ctx: PrepareContext, tiles: string[], extra: string[] = []) {
  const punct = /^[。、！？!?.,]+$/;
  let end = tiles.length;
  while (end > 0 && punct.test(toSurface(tiles[end - 1]!))) end--;
  const core = tiles.slice(0, end);
  const suffix = tiles.slice(end).map(toSurface).join('');
  return {
    tiles: ctx.rng.shuffle([...core, ...extra].map((text, i) => ({ id: `t${i}`, text }))),
    suffix,
  };
}

function tilesOf(item: Item): string[] | undefined {
  if (item.kind === 'sentence') return item.tiles;
  if (item.kind === 'phrase') return item.tiles;
  return undefined;
}

function jaAnswers(item: Item): string[] {
  if (item.kind === 'phrase' || item.kind === 'sentence')
    return [item.text, ...(item.accept ?? [])];
  return [itemJapanese(item)];
}

function enAnswers(item: Item): string[] {
  return item.kind === 'phrase' && item.literal ? [...item.meanings, item.literal] : item.meanings;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Picks a filler for a one-slot pattern and builds the sentence and its meaning. */
export function fillPattern(p: Pattern, filler: Item): { text: string; meaning: string } {
  const slot = slotNames(p.pattern)[0]!;
  return {
    text: fillSlots(p.pattern, { [slot]: itemJapanese(filler) }),
    meaning: capitalize(
      p.meaningPattern.replace(/\{\{\s*[\w-]+\s*\}\}/g, filler.meanings[0] ?? ''),
    ),
  };
}

function patternFillers(p: Pattern, ctx: PrepareContext): Item[] {
  const slot = slotNames(p.pattern)[0];
  if (!slot) return [];
  const all = lookup(ctx, p.slots[slot] ?? []).filter((i) => i.kind !== 'pattern');
  const avail = all.filter((i) => ctx.isAvailable(i.id));
  return avail.length ? avail : all;
}

function registerText(item: Phrase, reg: string): string[] {
  const out = [];
  if (item.register === reg) out.push(item.text);
  for (const v of item.variants ?? []) if (v.register === reg) out.push(v.text);
  return out;
}

const REGISTER_ASK: Record<string, string> = {
  casual: 'Say it casually, as to a friend',
  polite: 'Make it polite',
  formal: 'Make it formal',
};

const FORM_LABEL: Record<string, string> = {
  masu: 'polite ます form',
  te: 'て form',
  nai: 'negative ない form',
  past: 'past form',
};

type Plugins = { [T in ExerciseType]: ExercisePlugin<T> };

export const plugins: Plugins = {
  choice: {
    type: 'choice',
    prepare(ex, ctx) {
      const item = ctx.index.item(ex.item);
      if (!item) return null;
      const ds = lookup(ctx, ex.distractors);
      const base = {
        exerciseId: ex.id,
        type: ex.type,
        skill: skillOf(item),
        targets: [target(item, 'understand')],
      };
      if (ex.ask === 'meaning') {
        return {
          ...base,
          shape: 'choose',
          prompt: {
            instruction: item.kind === 'kana' ? 'What sound is this?' : 'What does this mean?',
            ja: itemJapanese(item),
          },
          ...options(ctx, item, ds, meaningDisplay),
          solution: meaningDisplay(item),
          note: noteOf(item),
        };
      }
      if (ex.ask === 'reading') {
        return {
          ...base,
          shape: 'choose',
          prompt: { instruction: 'How is this read?', ja: itemJapanese(item), hideFurigana: true },
          ...options(ctx, item, ds, readingDisplay),
          solution: readingDisplay(item),
        };
      }
      return {
        ...base,
        shape: 'choose',
        prompt: { instruction: 'Which one is it in Japanese?', en: itemMeaning(item) },
        ...options(ctx, item, ds, (i) => ja(itemJapanese(i))),
        solution: ja(itemJapanese(item)),
        note: noteOf(item),
      };
    },
  },

  match: {
    type: 'match',
    prepare(ex, ctx) {
      const items = lookup(ctx, ex.items);
      if (items.length < 2) return null;
      const left = ctx.rng.shuffle(items.map((i) => ({ id: i.id, display: ja(itemJapanese(i)) })));
      const right = ctx.rng.shuffle(
        items.map((i) => ({ id: `m:${i.id}`, display: meaningDisplay(i) })),
      );
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: skillOf(items[0]),
        targets: items.map((i) => target(i, 'understand')),
        shape: 'match',
        prompt: { instruction: 'Match the pairs' },
        left,
        right,
        pairs: Object.fromEntries(items.map((i) => [i.id, `m:${i.id}`])),
        solution: en(
          items.map((i) => `${toSurface(itemJapanese(i))} = ${itemMeaning(i)}`).join(' · '),
        ),
      };
    },
  },

  listen: {
    type: 'listen',
    prepare(ex, ctx) {
      const item = ctx.index.item(ex.item);
      if (!item) return null;
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: 'listening',
        targets: [target(item, 'understand')],
        shape: 'choose',
        prompt: { instruction: 'What did you hear?', audio: itemJapanese(item) },
        ...options(ctx, item, lookup(ctx, ex.distractors), (i) => ja(itemJapanese(i))),
        solution: ja(itemJapanese(item)),
      };
    },
  },

  dictation: {
    type: 'dictation',
    prepare(ex, ctx) {
      const item = ctx.index.item(ex.item);
      if (!item) return null;
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: 'listening',
        targets: [target(item, 'produce')],
        shape: 'type',
        answerLang: 'ja',
        accepted: jaAccepted(jaAnswers(item)),
        prompt: { instruction: 'Type what you hear', audio: itemJapanese(item) },
        solution: ja(itemJapanese(item)),
      };
    },
  },

  tiles: {
    type: 'tiles',
    prepare(ex, ctx) {
      const item = ctx.index.item(ex.item);
      const tiles = item && tilesOf(item);
      if (!item || !tiles) return null;
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: skillOf(item),
        targets: [target(item, 'produce')],
        shape: 'tiles',
        ...tilePool(ctx, tiles, ex.extraTiles),
        accepted: jaAccepted(jaAnswers(item)).filter((a) => /^[\p{Script=Hiragana}ー]*$/u.test(a)),
        prompt: { instruction: 'Build the sentence', en: itemMeaning(item) },
        solution: ja(itemJapanese(item)),
        note: noteOf(item),
      };
    },
  },

  type: {
    type: 'type',
    prepare(ex, ctx) {
      const item = ctx.index.item(ex.item);
      if (!item) return null;
      const base = { exerciseId: ex.id, type: ex.type, skill: skillOf(item) };
      if (ex.ask === 'japanese') {
        return {
          ...base,
          targets: [target(item, 'produce')],
          shape: 'type',
          answerLang: 'ja',
          accepted: jaAccepted(jaAnswers(item)),
          prompt: { instruction: 'Write this in Japanese', en: itemMeaning(item) },
          solution: ja(itemJapanese(item)),
        };
      }
      return {
        ...base,
        targets: [target(item, 'understand')],
        shape: 'type',
        answerLang: 'en',
        accepted: enAccepted(enAnswers(item)),
        prompt: {
          instruction:
            item.kind === 'kana' ? 'Type the sound in romaji' : 'Type the meaning in English',
          ja: itemJapanese(item),
        },
        solution: meaningDisplay(item),
      };
    },
  },

  fill: {
    type: 'fill',
    prepare(ex, ctx) {
      const opts = ctx.rng.shuffle(ex.options.map((o, i) => ({ id: `o${i}`, display: ja(o) })));
      const correct = opts.find((o) => 'ja' in o.display && o.display.ja === ex.answer)!;
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: 'grammar',
        targets: [],
        shape: 'choose',
        options: opts,
        correctId: correct.id,
        prompt: { instruction: 'Fill in the blank', ja: ex.text, en: ex.en },
        solution: ja(ex.text.replace(/＿＿/g, ex.answer)),
      };
    },
  },

  trace: {
    type: 'trace',
    prepare(ex, ctx) {
      const item = ctx.index.item(ex.item);
      if (!item) return null;
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: skillOf(item),
        targets: [target(item, 'produce')],
        shape: 'trace',
        glyph: toSurface(itemJapanese(item)),
        prompt: { instruction: `Write it: ${itemMeaning(item)}`, audio: itemJapanese(item) },
        solution: ja(itemJapanese(item)),
      };
    },
  },

  situation: {
    type: 'situation',
    prepare(ex, ctx) {
      const item = ctx.index.item(ex.answer);
      if (!item) return null;
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: skillOf(item),
        targets: [target(item, 'produce')],
        shape: 'choose',
        prompt: { instruction: 'What do you say?', scene: ex.scene },
        ...options(ctx, item, lookup(ctx, ex.distractors), (i) => ja(itemJapanese(i))),
        solution: ja(itemJapanese(item)),
        note: noteOf(item),
      };
    },
  },

  translate: {
    type: 'translate',
    prepare(ex, ctx) {
      const item = ctx.index.item(ex.item);
      if (!item) return null;
      if (ex.direction === 'toJapanese') {
        const tiles = tilesOf(item);
        if (tiles) {
          return {
            exerciseId: ex.id,
            type: ex.type,
            skill: skillOf(item),
            targets: [target(item, 'produce')],
            shape: 'tiles',
            ...tilePool(ctx, tiles),
            accepted: jaAccepted(jaAnswers(item)).filter((a) =>
              /^[\p{Script=Hiragana}ー]*$/u.test(a),
            ),
            prompt: { instruction: 'Translate into Japanese', en: itemMeaning(item) },
            solution: ja(itemJapanese(item)),
          };
        }
        return plugins.type.prepare(
          { id: ex.id, type: 'type', item: ex.item, ask: 'japanese' },
          ctx,
        );
      }
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: skillOf(item),
        targets: [target(item, 'understand')],
        shape: 'type',
        answerLang: 'en',
        accepted: enAccepted(enAnswers(item)),
        prompt: {
          instruction: 'Translate into English',
          ja: itemJapanese(item),
          audio: itemJapanese(item),
        },
        solution: meaningDisplay(item),
      };
    },
  },

  register: {
    type: 'register',
    prepare(ex, ctx) {
      const item = ctx.index.item(ex.item);
      if (!item || item.kind !== 'phrase') return null;
      const from = registerText(item, ex.from)[0];
      const to = registerText(item, ex.to);
      if (!from || !to.length) return null;
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: 'grammar',
        targets: [target(item, 'produce')],
        shape: 'type',
        answerLang: 'ja',
        accepted: jaAccepted(to),
        prompt: { instruction: REGISTER_ASK[ex.to] ?? `Make it ${ex.to}`, ja: from },
        solution: ja(to[0]!),
        note: item.usage,
      };
    },
  },

  pattern: {
    type: 'pattern',
    prepare(ex, ctx) {
      const p = ctx.index.item(ex.item);
      if (!p || p.kind !== 'pattern') return null;
      const fillers = patternFillers(p, ctx);
      if (!fillers.length) return null;
      const filler = ctx.rng.pick(fillers);
      const { text, meaning } = fillPattern(p, filler);
      const base = { exerciseId: ex.id, type: ex.type, skill: 'grammar' as const, note: p.notes };
      if (ex.direction === 'toJapanese') {
        return {
          ...base,
          targets: [target(p, 'produce')],
          shape: 'type',
          answerLang: 'ja',
          accepted: jaAccepted([text]),
          prompt: { instruction: 'Say it in Japanese', en: meaning },
          solution: ja(text),
        };
      }
      const others = ctx.rng.shuffle(fillers.filter((f) => f.id !== filler.id)).slice(0, 2);
      if (others.length) {
        const opts = ctx.rng.shuffle(
          [filler, ...others].map((f) => ({ id: f.id, display: en(fillPattern(p, f).meaning) })),
        );
        return {
          ...base,
          targets: [target(p, 'understand')],
          shape: 'choose',
          options: opts,
          correctId: filler.id,
          prompt: { instruction: 'What does this mean?', ja: text, audio: text },
          solution: en(meaning),
        };
      }
      return {
        ...base,
        targets: [target(p, 'understand')],
        shape: 'type',
        answerLang: 'en',
        accepted: enAccepted([meaning]),
        prompt: { instruction: 'Translate into English', ja: text, audio: text },
        solution: en(meaning),
      };
    },
  },

  conjugate: {
    type: 'conjugate',
    prepare(ex, ctx) {
      const item = ctx.index.item(ex.item);
      const form = item?.kind === 'word' ? item.forms?.[ex.form] : undefined;
      if (!item || !form) return null;
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: 'grammar',
        targets: [target(item, 'produce')],
        shape: 'type',
        answerLang: 'ja',
        accepted: jaAccepted([form]),
        prompt: {
          instruction: `Give the ${FORM_LABEL[ex.form] ?? ex.form}`,
          ja: itemJapanese(item),
          en: itemMeaning(item),
        },
        solution: ja(form),
      };
    },
  },

  reply: {
    type: 'reply',
    prepare(ex, ctx) {
      const d = ctx.index.dialogue(ex.dialogue);
      if (!d) return null;
      return {
        exerciseId: ex.id,
        type: ex.type,
        skill: 'listening',
        targets: [],
        shape: 'dialogue',
        dialogueId: d.id,
        title: d.title,
        setting: d.setting,
        steps: d.lines.map((l, i) => ({
          speaker: l.speaker,
          text: l.text,
          en: l.en,
          ...(l.choices
            ? { choices: ctx.rng.shuffle(l.choices.map((c, j) => ({ id: `l${i}c${j}`, ...c }))) }
            : {}),
        })),
        prompt: { instruction: d.title, scene: d.setting },
        solution: en('Every reply chosen correctly'),
      };
    },
  },
};

/** Prepares any exercise; unknown or broken exercises return null and are skipped safely. */
export function prepareExercise(ex: Exercise, ctx: PrepareContext): Question | null {
  const plugin = plugins[ex.type] as ExercisePlugin | undefined;
  if (!plugin) return null;
  try {
    return plugin.prepare(ex as never, ctx);
  } catch {
    return null;
  }
}

export type { Question };
