/** Collects every Japanese line in a pack that must be voiced (used by voice-build and preload). */
import type { LessonPack } from '../../schema/pack';
import { fillSlots } from '../text/furigana';

export interface VoiceLine {
  /** Canonical key = the furigana text itself, trimmed and NFC-normalized. */
  key: string;
  text: string;
  /** Dialogue role, when the line belongs to a speaker. */
  role?: string;
}

export const lineKey = (furigana: string): string => furigana.normalize('NFC').trim();

/** Max pattern combinations pre-voiced per pattern (plan: up to 50; beyond that the device voice fills in). */
export const MAX_PATTERN_COMBOS = 50;

export function collectVoiceLines(pack: LessonPack): VoiceLine[] {
  const out = new Map<string, VoiceLine>();
  const add = (text: string | undefined, role?: string) => {
    if (!text) return;
    const key = lineKey(text);
    if (!out.has(key)) out.set(key, role ? { key, text, role } : { key, text });
  };
  const byId = new Map(pack.items.map((i) => [i.id, i]));
  for (const item of pack.items) {
    switch (item.kind) {
      case 'kana':
        add(item.text);
        break;
      case 'word':
        add(item.text);
        Object.values(item.forms ?? {}).forEach((f) => add(f));
        add(item.example?.text);
        break;
      case 'phrase':
        add(item.text);
        item.variants?.forEach((v) => add(v.text));
        item.tiles?.forEach((t) => add(t));
        break;
      case 'sentence':
        add(item.text);
        item.tiles.forEach((t) => add(t));
        break;
      case 'pattern': {
        item.examples.forEach((e) => add(e.text));
        const [slot, ids] = Object.entries(item.slots)[0] ?? [];
        if (slot && ids) {
          for (const id of ids.slice(0, MAX_PATTERN_COMBOS)) {
            const filler = byId.get(id);
            if (filler && filler.kind !== 'pattern')
              add(fillSlots(item.pattern, { [slot]: filler.text }));
          }
        }
        break;
      }
    }
  }
  for (const d of pack.dialogues ?? []) {
    for (const line of d.lines) {
      add(line.text, line.speaker);
      line.choices?.forEach((c) => add(c.text, line.speaker));
    }
  }
  for (const unit of pack.units)
    for (const node of unit.nodes)
      for (const ex of node.exercises) {
        if (ex.type === 'fill') {
          add(ex.text.replace(/＿＿/g, ex.answer));
          ex.options.forEach((o) => add(o));
        }
        if (ex.type === 'tiles') ex.extraTiles?.forEach((t) => add(t));
      }
  return [...out.values()];
}
