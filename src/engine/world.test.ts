import { describe, expect, it } from 'vitest';
import economyJson from '../../design/economy.json';
import avatarJson from '../../world/avatar.json';
import bossesJson from '../../world/bosses.json';
import { EconomySchema } from '../schema/economy';
import { AvatarSchema, BossesSchema } from '../schema/world';
import { bonsai, dojoRank, eloUpdate, spiritStage } from './world';
import { publishedOdds, pull } from './gacha';
import { canChallenge, hit, phaseFor, startBoss } from './boss';

const economy = EconomySchema.parse(economyJson);
const parts = AvatarSchema.parse(avatarJson).parts;
const mojibake = BossesSchema.parse(bossesJson).bosses[0]!;
const DAY = 86_400_000;
const r = {
  retrievability: (c: { dueAt: number }, now: number) => (now - c.dueAt > 10 * DAY ? 0.5 : 0.85),
};
const card = (
  o: Partial<{ dueAt: number; lastReviewAt: number | null; stability: number; reps: number }>,
) => ({
  dueAt: 10 * DAY,
  lastReviewAt: 0,
  stability: 3,
  difficulty: 5,
  state: 2,
  reps: 3,
  lapses: 0,
  ...o,
});

describe('spirit stages', () => {
  it('egg → sprite → guardian, fading when overdue, lost when badly overdue', () => {
    expect(spiritStage([], 0, r)).toBe('egg');
    expect(spiritStage([card({ reps: 0, lastReviewAt: null })], 0, r)).toBe('sprite');
    expect(spiritStage([card({})], DAY, r)).toBe('sprite');
    expect(spiritStage([card({ stability: 30 })], DAY, r)).toBe('guardian');
    expect(spiritStage([card({})], 12 * DAY, r)).toBe('fading');
    expect(spiritStage([card({})], 25 * DAY, r)).toBe('lost');
    expect(spiritStage([card({})], 12 * DAY, r, 13 * DAY)).toBe('sprite'); // omamori shield
  });
  it('bonsai drops leaves per missed day and is bare after three', () => {
    expect(bonsai(25, 0)).toEqual({ size: 3, leaves: 1 });
    expect(bonsai(25, 3).leaves).toBe(0);
  });
  it('dojo ranks and Elo', () => {
    expect(dojoRank(800)).toBe('10-kyū');
    expect(dojoRank(1650)).toBe('2-kyū');
    expect(dojoRank(1750)).toBe('1-kyū');
    expect(dojoRank(1800)).toBe('Shodan');
    expect(eloUpdate(800, 800, true)).toBe(812);
    expect(eloUpdate(800, 800, false)).toBe(788);
  });
});

describe('gachapon', () => {
  it('publishes odds that sum to 100%', () => {
    expect(publishedOdds(economy).reduce((s, o) => s + o.percent, 0)).toBeCloseTo(100);
  });
  it('is deterministic for a seed and never drops a duplicate while new prizes remain', () => {
    expect(pull(economy, parts, [], 99, 0)).toEqual(pull(economy, parts, [], 99, 0));
    let state = 1;
    let pity = 0;
    const owned: string[] = [];
    const pool = parts.filter((p) => p.gacha);
    for (let i = 0; i < pool.length; i++) {
      const res = pull(economy, parts, owned, state, pity);
      expect(res.duplicate).toBe(false);
      owned.push(res.prize!.id);
      state = res.rngState;
      pity = res.pity;
    }
    expect(new Set(owned).size).toBe(pool.length);
    expect(pull(economy, parts, owned, state, pity).duplicate).toBe(true);
  });
  it('pity guarantees a rare or better', () => {
    for (let seed = 0; seed < 50; seed++) {
      const res = pull(economy, parts, [], seed, economy.gachapon.pityAfter - 1);
      expect(['rare', 'legendary']).toContain(res.prize!.gacha);
    }
  });
});

describe('boss', () => {
  it('changes phase as HP drops and hits harder with a combo', () => {
    let s = startBoss(mojibake);
    expect(s.phase).toBe(0);
    for (let i = 0; i < 5; i++) s = hit(mojibake, s, 0);
    expect(s.hp).toBe(7);
    expect(s.phase).toBe(1);
    s = hit(mojibake, s, 5);
    expect(s.hp).toBe(5);
    expect(phaseFor(mojibake, 3)).toBe(2);
  });
  it('once per day in Hardcore', () => {
    expect(canChallenge('2026-03-02', '2026-03-02', true)).toBe(false);
    expect(canChallenge('2026-03-01', '2026-03-02', true)).toBe(true);
    expect(canChallenge('2026-03-02', '2026-03-02', false)).toBe(true);
  });
});
