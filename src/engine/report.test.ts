import { describe, expect, it } from 'vitest';
import starter from '../../content/packs/kotodama-starter.json';
import economyJson from '../../design/economy.json';
import { LessonPackSchema } from '../schema/pack';
import { EconomySchema } from '../schema/economy';
import { PackIndex } from './pack/index';
import { newSave } from './game';
import { buildReport, REPORT_INSTRUCTION, reportMarkdown } from './report';

const index = new PackIndex([LessonPackSchema.parse(starter)]);
const economy = EconomySchema.parse(economyJson);

describe('Learner Report', () => {
  it('lists known items by kind, weak items and mistakes, prefixed with the ChatGPT instruction', () => {
    const card = {
      dueAt: 0,
      lastReviewAt: 0,
      stability: 1,
      difficulty: 5,
      state: 2,
      reps: 2,
      lapses: 1,
    };
    const save = {
      ...newSave(0, 'UTC', 1, economy),
      cards: { 'w.mizu#main': card, 'p.sumimasen#understand': card, 'p.sumimasen#produce': card },
      itemStats: { 'w.mizu': { seen: 4, correct: 1, wrong: 3 } },
      mistakes: [
        {
          at: 0,
          exerciseId: 'u02.n01.e08',
          itemId: 'w.mizu',
          given: 'みす',
          expected: '{水|みず}',
        },
      ],
      notes: 'More food words please',
    };
    const r = buildReport(save, index, [{ id: 'kotodama-starter', version: 1 }], 0);
    expect(r.known.word.map((w) => w.id)).toEqual(['w.mizu']);
    expect(r.known.phrase.map((w) => w.id)).toEqual(['p.sumimasen']);
    expect(r.weak[0]).toMatchObject({ id: 'w.mizu', wrong: 3 });
    const md = reportMarkdown(r);
    expect(md.startsWith(REPORT_INSTRUCTION)).toBe(true);
    expect(md).toContain('w.mizu (水 = water)');
    expect(md).toContain('expected "水"');
    expect(md).toContain('More food words please');
  });
});
