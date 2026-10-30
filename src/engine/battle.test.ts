import { describe, expect, it } from 'vitest';
import economyJson from '../../design/economy.json';
import { EconomySchema } from '../schema/economy';
import type { Question } from './exercises/types';
import { answer, startSession, type SessionConfig } from './lesson/session';
import { battleView } from './battle';

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
const bad = { correct: false, typo: false, given: 'no' };
const config: SessionConfig = { hearts: 5, economy, xpMultiplier: 1, requeueMistakes: true };

describe('battleView', () => {
  it('splits the lesson into enemies and counts hits down', () => {
    let s = startSession([1, 2, 3, 4, 5, 6, 7].map(q), config);
    expect(battleView(s, 3)).toMatchObject({ enemy: 0, enemies: 3, hp: 3, last: 'none' });
    s = answer(s, config, ok, 900);
    expect(battleView(s, 3)).toMatchObject({ enemy: 0, hp: 2, last: 'hit' });
    s = answer(s, config, ok, 900);
    s = answer(s, config, ok, 900);
    expect(battleView(s, 3)).toMatchObject({ enemy: 1, hp: 3, defeated: 1, last: 'finish' });
  });

  it('sizes the last enemy to the questions left, so every enemy can be beaten', () => {
    let s = startSession([1, 2, 3, 4].map(q), config);
    for (let i = 0; i < 3; i++) s = answer(s, config, ok, 900);
    expect(battleView(s, 3)).toMatchObject({ enemy: 1, hp: 1, maxHp: 1 });
    s = answer(s, config, ok, 900);
    expect(battleView(s, 3)).toMatchObject({ defeated: 2, hp: 0, last: 'finish' });
  });

  it('a wrong answer is the enemy attacking and deals no damage', () => {
    let s = startSession([1, 2, 3].map(q), config);
    s = answer(s, config, ok, 900);
    s = answer(s, config, bad, 900);
    expect(battleView(s, 3)).toMatchObject({ hp: 2, last: 'attacked' });
  });

  it('fixing a mistake on its retry still lands the blow that finishes the enemy', () => {
    let s = startSession([1, 2, 3].map(q), config);
    s = answer(s, config, ok, 900);
    s = answer(s, config, bad, 900);
    s = answer(s, config, ok, 900);
    s = answer(s, config, ok, 900); // the retry of question 2
    expect(battleView(s, 3)).toMatchObject({ hp: 0, defeated: 1, last: 'finish' });
  });
});
