import { describe, expect, it } from 'vitest';
import economyJson from '../../../design/economy.json';
import { EconomySchema } from '../../schema/economy';
import type { Question } from '../exercises/types';
import { lessonReward } from '../economy/rewards';
import {
  answer,
  kiaiActive,
  progress,
  startSession,
  summarize,
  type SessionConfig,
} from './session';

const economy = EconomySchema.parse(economyJson);
const q = (i: number): Question => ({
  exerciseId: `e${i}`,
  type: 'choice',
  prompt: { instruction: 'x' },
  targets: [{ itemId: `w.x${i}`, facet: 'main' }],
  skill: 'vocabulary',
  solution: { en: 'x' },
  shape: 'choose',
  options: [],
  correctId: 'a',
});
const ok = { correct: true, typo: false, given: '' };
const bad = { correct: false, typo: false, given: 'nope' };
const config = (hearts: number | null = 5): SessionConfig => ({
  hearts,
  economy,
  xpMultiplier: 1,
  requeueMistakes: true,
});

describe('session', () => {
  it('awards XP per correct answer with combo bonus and completes', () => {
    const c = config();
    let s = startSession([q(1), q(2), q(3), q(4), q(5)], c);
    for (let i = 0; i < 5; i++) s = answer(s, c, ok, 1000);
    expect(s.status).toBe('complete');
    expect(s.xp).toBe(5 * 10 + economy.xp.comboBonusXp);
    expect(summarize(s, c).stars).toBe(3);
  });

  it('Kiai fills after 5 correct and doubles the next 5 answers', () => {
    const c = config();
    let s = startSession(
      Array.from({ length: 12 }, (_, i) => q(i)),
      c,
    );
    for (let i = 0; i < 5; i++) s = answer(s, c, ok, 1000);
    expect(kiaiActive(s)).toBe(true);
    expect(s.kiaiTriggers).toBe(1);
    const before = s.xp;
    s = answer(s, c, ok, 1000);
    expect(s.xp - before).toBe(20);
    for (let i = 0; i < 4; i++) s = answer(s, c, ok, 1000);
    expect(kiaiActive(s)).toBe(false);
    expect(summarize(s, c).kiaiCorrect).toBe(5);
  });

  it('a mistake costs a heart, resets the combo and comes back at the end', () => {
    const c = config();
    let s = startSession([q(1), q(2)], c);
    s = answer(s, c, bad, 1000);
    expect(s.hearts).toBe(4);
    expect(s.combo).toBe(0);
    expect(s.queue).toHaveLength(3);
    s = answer(s, c, ok, 1000);
    expect(progress(s)).toBe(1);
    s = answer(s, c, ok, 1000); // the retry
    expect(s.status).toBe('complete');
    const sum = summarize(s, c);
    expect(sum.mistakes).toHaveLength(1);
    expect(sum.stars).toBe(2);
    expect(sum.outcomes.find((o) => o.target.itemId === 'w.x1')?.correct).toBe(false);
  });

  it('fails at zero hearts and the lesson XP is lost', () => {
    const c = config(2);
    let s = startSession([q(1), q(2), q(3)], c);
    s = answer(s, c, ok, 1000);
    s = answer(s, c, bad, 1000);
    s = answer(s, c, bad, 1000);
    expect(s.status).toBe('failed');
    expect(summarize(s, c).xp).toBe(0);
    expect(summarize(s, c).stars).toBe(0);
  });

  it('casual mode (no hearts) never fails', () => {
    const c = config(null);
    let s = startSession([q(1)], c);
    for (let i = 0; i < 3; i++) s = answer(s, c, bad, 1000);
    expect(s.status).not.toBe('failed');
  });
});

describe('lessonReward', () => {
  const base = {
    economy,
    completed: true,
    stars: 1,
    xp: 100,
    kiaiCorrect: 0,
    totalQuestions: 10,
    reviewDebt: false,
    manekiActive: false,
    nodeKey: 'p/n',
  };
  it('pays 10, +5 for three stars', () => {
    expect(lessonReward(base).koban).toBe(10);
    expect(lessonReward({ ...base, stars: 3 }).koban).toBe(15);
  });
  it('Kiai doubles the share answered during Kiai; review debt halves; maneki adds 25%', () => {
    expect(lessonReward({ ...base, kiaiCorrect: 5 }).koban).toBe(15);
    expect(lessonReward({ ...base, reviewDebt: true }).koban).toBe(5);
    expect(lessonReward({ ...base, manekiActive: true }).koban).toBe(13);
  });
  it('a failed lesson earns nothing', () => {
    expect(lessonReward({ ...base, completed: false })).toMatchObject({
      xp: 0,
      koban: 0,
      events: [],
    });
  });
});
