/**
 * Dojo review composer: turns due FSRS cards into exercises. Recognition (understand) cards get
 * pick-the-meaning or listening questions; production cards get typing or tile building; the
 * exercise gets harder as the card matures (reps).
 */
import type { Exercise, Item } from '../schema/pack';
import type { SaveState } from '../schema/save';
import { prepareExercise } from './exercises/plugins';
import type { Question } from './exercises/types';
import type { PackIndex } from './pack/index';
import type { Rng } from './rng';

function distractors(item: Item, index: PackIndex, rng: Rng, n = 2): string[] {
  const pool = index
    .itemsOfKind(item.kind)
    .filter((i) => i.id !== item.id && i.meanings[0] !== item.meanings[0]);
  return rng
    .shuffle(pool)
    .slice(0, n)
    .map((i) => i.id);
}

export function reviewExercise(
  cardKey: string,
  reps: number,
  index: PackIndex,
  rng: Rng,
): Exercise | null {
  const [itemId, facet] = cardKey.split('#') as [string, string];
  const item = index.item(itemId);
  if (!item) return null;
  const id = `review.${cardKey}`;
  const ds = distractors(item, index, rng);
  const hasTiles = item.kind === 'sentence' || (item.kind === 'phrase' && !!item.tiles);
  if (item.kind === 'pattern')
    return {
      id,
      type: 'pattern',
      item: itemId,
      direction: facet === 'produce' ? 'toJapanese' : 'toEnglish',
    };
  if (facet === 'produce') {
    return hasTiles && reps < 3
      ? { id, type: 'tiles', item: itemId }
      : { id, type: 'type', item: itemId, ask: 'japanese' };
  }
  if (facet === 'understand') {
    if (!ds.length) return { id, type: 'translate', item: itemId, direction: 'toEnglish' };
    return reps % 2 === 0
      ? { id, type: 'choice', item: itemId, ask: 'meaning', distractors: ds }
      : { id, type: 'listen', item: itemId, distractors: ds };
  }
  // single-card items (kana, words) climb from recognition to recall
  if (!ds.length)
    return {
      id,
      type: item.kind === 'kana' ? 'dictation' : 'type',
      item: itemId,
      ...(item.kind === 'kana' ? {} : { ask: 'japanese' as const }),
    } as Exercise;
  const stage = reps % 4;
  if (stage === 0) return { id, type: 'choice', item: itemId, ask: 'meaning', distractors: ds };
  if (stage === 1) return { id, type: 'listen', item: itemId, distractors: ds };
  if (stage === 2)
    return item.kind === 'kana'
      ? { id, type: 'dictation', item: itemId }
      : { id, type: 'type', item: itemId, ask: 'japanese' };
  return { id, type: 'dictation', item: itemId };
}

export function reviewQuestions(
  save: SaveState,
  cardKeys: readonly string[],
  index: PackIndex,
  rng: Rng,
  max = 15,
): Question[] {
  const out: Question[] = [];
  for (const key of cardKeys) {
    if (out.length >= max) break;
    const ex = reviewExercise(key, save.cards[key]?.reps ?? 0, index, rng);
    const q =
      ex &&
      prepareExercise(ex, {
        index,
        rng,
        isAvailable: (id) => Object.keys(save.cards).some((k) => k.startsWith(`${id}#`)),
      });
    // A review question must schedule exactly the card it was built for.
    if (q)
      out.push({
        ...q,
        targets: [
          {
            itemId: key.split('#')[0]!,
            facet: key.split('#')[1] as 'main' | 'understand' | 'produce',
          },
        ],
      });
  }
  return out;
}
