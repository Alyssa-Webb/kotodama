import { describe, expect, it } from 'vitest';
import starter from '../../content/packs/kotodama-starter.json';
import economyJson from '../../design/economy.json';
import { LessonPackSchema } from '../schema/pack';
import { EconomySchema } from '../schema/economy';
import { PackIndex } from './pack/index';
import { Rng } from './rng';
import { newSave } from './game';
import { reviewQuestions } from './review';

const index = new PackIndex([LessonPackSchema.parse(starter)]);
const economy = EconomySchema.parse(economyJson);

describe('reviewQuestions', () => {
  it('builds one question per due card, targeting exactly that card', () => {
    const save = newSave(0, 'UTC', 1, economy);
    const card = {
      dueAt: 0,
      lastReviewAt: null,
      stability: 0,
      difficulty: 0,
      state: 0,
      reps: 0,
      lapses: 0,
    };
    const keys = [
      'w.mizu#main',
      's.okaikei#understand',
      's.okaikei#produce',
      'g.o-kudasai#produce',
      'k.a#main',
    ];
    const s = { ...save, cards: Object.fromEntries(keys.map((k) => [k, card])) };
    const qs = reviewQuestions(s, keys, index, new Rng(5));
    expect(qs).toHaveLength(5);
    expect(qs.map((q) => `${q.targets[0]!.itemId}#${q.targets[0]!.facet}`)).toEqual(keys);
    expect(qs[2]!.shape).toBe('tiles'); // produce for a sentence with tiles
    expect(qs[3]!.type).toBe('pattern');
  });
  it('caps the session length', () => {
    const save = newSave(0, 'UTC', 1, economy);
    const keys = index.itemsOfKind('word').map((w) => `${w.id}#main`);
    expect(reviewQuestions(save, keys, index, new Rng(1), 4)).toHaveLength(4);
  });
});
