import { beforeAll, describe, expect, it } from 'vitest';
import economyJson from '../../design/economy.json';
import shopJson from '../../world/shop.json';
import starter from '../../content/packs/kotodama-starter.json';
import { EconomySchema } from '../schema/economy';
import { LessonPackSchema } from '../schema/pack';
import { ShopSchema } from '../schema/world';
import type { SaveState } from '../schema/save';
import { balanceOf } from './economy/ledger';
import { createScheduler, type Scheduler } from './memory/scheduler';
import { PackIndex } from './pack/index';
import { prepareExercise } from './exercises/plugins';
import { grade } from './exercises/grade';
import { Rng } from './rng';
import { answer, startSession, summarize, type SessionConfig } from './lesson/session';
import {
  applyKintsugi,
  applyTestGrant,
  buy,
  buyCharm,
  damageFor,
  loseHearts,
  maxHearts,
  playerLevel,
  changeDifficulty,
  completeLesson,
  completeReviews,
  dueCards,
  heartsNow,
  isUnlocked,
  newSave,
  settleDay,
  type Ctx,
} from './game';
import { append } from './economy/ledger';

const economy = EconomySchema.parse(economyJson);
const shop = ShopSchema.parse(shopJson);
const pack = LessonPackSchema.parse(starter);
const index = new PackIndex([pack]);
const H = 3_600_000;
const T0 = Date.parse('2026-03-02T10:00:00Z'); // a Monday, 10:00 UTC
const ctx = (now: number, timeZone = 'UTC'): Ctx => ({ now, timeZone, economy });

let scheduler: Scheduler;
beforeAll(async () => {
  scheduler = await createScheduler();
});

/** Gives `n` old-koban units of money, i.e. ¥(n × 10), matching the ×10 yen economy. */
const giveYen = (s: SaveState, n: number, now = T0): SaveState => ({
  ...s,
  ledger: append(s.ledger, now, '2026-03-02', [{ asset: 'yen', amount: n * 10, reason: 'test' }]),
});

/** Meets the daily goal on the given instant by finishing a lesson worth enough XP. */
function playLesson(
  s: SaveState,
  now: number,
  nodeId = 'u01.n01',
  correct = true,
  tz = 'UTC',
): SaveState {
  const node = pack.units.flatMap((u) => u.nodes).find((n) => n.id === nodeId)!;
  const rng = new Rng(1);
  const qs = node.exercises.map((e) =>
    prepareExercise(e, { index, rng, isAvailable: () => true })!,
  );
  const config: SessionConfig = {
    hearts: heartsNow(s, ctx(now, tz)),
    damage: damageFor(economy, 0),
    economy,
    xpMultiplier: 1,
    requeueMistakes: true,
  };
  let st = startSession(qs, config);
  while (st.status === 'playing') {
    const q = st.queue[st.position]!;
    const r = correct
      ? grade(
          q,
          q.shape === 'choose'
            ? { kind: 'choose', optionId: q.correctId }
            : q.shape === 'type'
              ? { kind: 'type', text: 'ja' in q.solution ? q.solution.ja : q.solution.en }
              : { kind: 'trace', selfCorrect: true },
        )
      : { correct: false, typo: false, given: 'x' };
    const fixed =
      q.shape === 'match'
        ? { correct, typo: false, given: '' }
        : q.shape === 'tiles' || q.shape === 'dialogue'
          ? { correct, typo: false, given: '' }
          : r;
    st = answer(st, config, fixed, 3000);
  }
  const summary = summarize(st, config);
  return completeLesson(
    s,
    ctx(now, tz),
    {
      nodeKey: `kotodama-starter/${nodeId}`,
      summary,
      heartsLost: st.heartsLost,
      completed: st.status === 'complete',
      introduces: node.introduces.map((id) => index.item(id)!),
      totalQuestions: st.total,
    },
    scheduler,
  ).save;
}

describe('new save', () => {
  it('starts in Hardcore with full level-1 health (100 HP) and no streak', () => {
    const s = newSave(T0, 'UTC', 42, economy);
    expect(s.settings.difficulty).toBe('hardcore');
    expect(heartsNow(s, ctx(T0))).toBe(economy.hp.base);
    expect(s.streak.current).toBe(0);
  });
});

describe('lesson completion', () => {
  it('awards XP and yen, creates cards for introduced items, extends the streak', () => {
    let s = newSave(T0, 'UTC', 1, economy, { dailyGoalXp: 50 });
    s = playLesson(s, T0);
    expect(balanceOf(s.ledger, 'xp')).toBeGreaterThanOrEqual(130);
    expect(balanceOf(s.ledger, 'yen')).toBeGreaterThanOrEqual(15); // 10 + 5 for three stars (+ Kiai)
    expect(Object.keys(s.cards)).toEqual(expect.arrayContaining(['k.a#main', 'k.o#main']));
    expect(s.streak.current).toBe(1);
    expect(s.nodes['kotodama-starter/u01.n01']!.stars).toBe(3);
  });

  it('a lesson failed at zero hearts loses its XP and costs the hearts', () => {
    let s = newSave(T0, 'UTC', 1, economy);
    s = playLesson(s, T0, 'u01.n01', false);
    expect(heartsNow(s, ctx(T0))).toBe(0);
    expect(balanceOf(s.ledger, 'xp')).toBe(0);
    expect(s.nodes['kotodama-starter/u01.n01']).toBeUndefined();
    expect(s.mistakes.length).toBeGreaterThan(0);
  });

  it('unlocks nodes in order', () => {
    let s = newSave(T0, 'UTC', 1, economy);
    const keys = ['p/a', 'p/b', 'p/c'];
    expect(isUnlocked(s, keys, 'p/a')).toBe(true);
    expect(isUnlocked(s, keys, 'p/b')).toBe(false);
    s = { ...s, nodes: { 'p/a': { completedAt: T0, stars: 3, bestXp: 1, plays: 1 } } };
    expect(isUnlocked(s, keys, 'p/b')).toBe(true);
  });
});

describe('health (HP)', () => {
  const lose = (s: SaveState, n: number) => loseHearts(s, ctx(T0), n, 'test');

  it('never refills by itself: only food heals', () => {
    let s = lose(newSave(T0, 'UTC', 1, economy), 40);
    expect(heartsNow(s, ctx(T0 + 48 * H))).toBe(60);
    s = settleDay(s, ctx(T0 + 24 * H)).save;
    expect(heartsNow(s, ctx(T0 + 24 * H))).toBe(60);
    s = lose(newSave(T0, 'UTC', 1, economy, { difficulty: 'standard' }), 40);
    s = settleDay(s, ctx(T0 + 24 * H)).save;
    expect(heartsNow(s, ctx(T0 + 24 * H))).toBe(60);
    expect(heartsNow(newSave(T0, 'UTC', 1, economy, { difficulty: 'casual' }), ctx(T0))).toBeNull();
  });

  it('Dojo reviews no longer heal', () => {
    const s = lose(newSave(T0, 'UTC', 1, economy), 40);
    const summary = {
      firstPassCorrect: 10,
      mistakes: [],
      stars: 3 as const,
      accuracy: 1,
      kiaiCorrect: 0,
      xp: 100,
      outcomes: [],
    };
    const r = completeReviews(
      s,
      ctx(T0 + 60_000),
      { summary, heartsLost: 0, reviewed: 10 },
      scheduler,
    );
    expect(r.heartsEarned).toBe(0);
    expect(heartsNow(r.save, ctx(T0 + 60_000))).toBe(60);
  });

  it('max HP grows with level and is scaled by difficulty', () => {
    const s = newSave(T0, 'UTC', 1, economy);
    expect(maxHearts(s, economy)).toBe(100);
    const leveled = {
      ...s,
      ledger: append(s.ledger, T0, '2026-03-02', [
        { asset: 'xp', amount: economy.hp.xpPerLevel * 2, reason: 'test' },
      ]),
    };
    expect(playerLevel(leveled, economy)).toBe(3);
    expect(maxHearts(leveled, economy)).toBe(100 + 2 * economy.hp.perLevel);
    const iron = { ...s, settings: { ...s.settings, difficulty: 'ironman' as const } };
    expect(maxHearts(iron, economy)).toBe(60);
  });

  it('mistakes hit harder further along the story', () => {
    expect(damageFor(economy, 0)).toBe(economy.hp.damageBase);
    expect(damageFor(economy, 3)).toBe(economy.hp.damageBase + 3 * economy.hp.damagePerUnit);
  });
});

describe('streak, freezes and spoil', () => {
  const day = (n: number, hour = 10) => T0 + n * 24 * H + (hour - 10) * H;

  it('consecutive days extend the streak; the 04:00 rollover keeps a late-night lesson on the same day', () => {
    let s = newSave(T0, 'UTC', 1, economy, { dailyGoalXp: 50 });
    s = playLesson(s, day(0));
    s = settleDay(s, ctx(day(1))).save;
    s = playLesson(s, day(1));
    expect(s.streak.current).toBe(2);
    // 02:00 on day 3 (calendar) is still game day 2
    s = settleDay(s, ctx(day(2, 26))).save;
    s = playLesson(s, day(2, 26));
    expect(s.streak.current).toBe(3);
    expect(s.streak.lastGoalDay).toBe('2026-03-04');
  });

  it('a missed day breaks the streak and spoils 10% yen in Hardcore', () => {
    let s = giveYen(newSave(T0, 'UTC', 1, economy, { dailyGoalXp: 50 }), 200);
    s = playLesson(s, day(0));
    const before = balanceOf(s.ledger, 'yen');
    const r = settleDay(s, ctx(day(2))); // day 1 missed
    expect(r.save.streak.current).toBe(0);
    expect(r.save.streak.broken?.length).toBe(1);
    expect(balanceOf(r.save.ledger, 'yen')).toBe(before - Math.floor(before * 0.1));
    expect(r.notices.map((n) => n.kind)).toEqual(
      expect.arrayContaining(['streak-lost', 'yen-spoiled']),
    );
    // idempotent within the day
    expect(settleDay(r.save, ctx(day(2) + H)).save.ledger).toHaveLength(r.save.ledger.length);
  });

  it('a kotatsu is used automatically and prevents both streak loss and spoil', () => {
    let s = giveYen(newSave(T0, 'UTC', 1, economy, { dailyGoalXp: 50 }), 200);
    s = playLesson(s, day(0));
    const bought = buy(s, ctx(day(0)), shop, 'kotatsu');
    if ('error' in bought) throw new Error(bought.error);
    s = bought.save;
    const yen = balanceOf(s.ledger, 'yen');
    const r = settleDay(s, ctx(day(2)));
    expect(r.save.streak.current).toBe(1);
    expect(balanceOf(r.save.ledger, 'item:kotatsu')).toBe(0);
    expect(balanceOf(r.save.ledger, 'yen')).toBe(yen);
    s = playLesson(r.save, day(2));
    expect(s.streak.current).toBe(2);
  });

  it('Standard mode never spoils yen', () => {
    const s = giveYen(newSave(T0, 'UTC', 1, economy, { difficulty: 'standard' }), 200);
    const r = settleDay(s, ctx(day(3)));
    expect(balanceOf(r.save.ledger, 'yen')).toBe(2000);
  });

  it('changing time zone mid-streak never double-counts or goes backwards', () => {
    let s = newSave(T0, 'America/Los_Angeles', 1, economy, { dailyGoalXp: 50 });
    s = settleDay(s, ctx(day(0) + 8 * H, 'America/Los_Angeles')).save;
    s = playLesson(s, day(0) + 8 * H, 'u01.n01', true, 'America/Los_Angeles'); // 10:00 in LA
    // fly to Tokyo: it is already "tomorrow" there; the streak is intact and can extend
    const tokyo = ctx(day(0) + 10 * H, 'Asia/Tokyo'); // 05:00 next calendar day in Tokyo
    s = settleDay(s, tokyo).save;
    expect(s.streak.current).toBe(1);
    expect(s.streak.lastProcessedDay).toBe('2026-03-03');
    // fly back west the same instant: game day goes "backwards" → ignored
    const back = settleDay(s, ctx(day(0) + 11 * H, 'America/Los_Angeles'));
    expect(back.save.streak.current).toBe(1);
    expect(back.notices).toEqual([]);
  });
});

describe('shop', () => {
  it('rejects purchases without enough yen and respects max held', () => {
    let s = newSave(T0, 'UTC', 1, economy);
    expect(buy(s, ctx(T0), shop, 'kotatsu')).toEqual({ error: 'not-enough-yen' });
    s = giveYen(s, 1000);
    for (let i = 0; i < 2; i++) {
      const r = buy(s, ctx(T0), shop, 'kotatsu');
      if ('error' in r) throw new Error(r.error);
      s = r.save;
    }
    expect(buy(s, ctx(T0), shop, 'kotatsu')).toEqual({ error: 'max-held' });
    expect(balanceOf(s.ledger, 'yen')).toBe(10000 - 1200);
    expect(s.collection.shopWords).toContain('kotatsu');
  });

  it('onigiri restores some HP; Ironman forbids it', () => {
    const s = giveYen(playLesson(newSave(T0, 'UTC', 1, economy), T0, 'u01.n01', false), 100);
    const r = buy(s, ctx(T0), shop, 'onigiri');
    if ('error' in r) throw new Error(r.error);
    expect(heartsNow(r.save, ctx(T0))).toBe(economy.hp.onigiriHeal);
    const iron = giveYen(newSave(T0, 'UTC', 1, economy, { difficulty: 'ironman' }), 100);
    expect(buy(iron, ctx(T0), shop, 'onigiri')).toEqual({ error: 'not-allowed' });
  });

  it('kintsugi mends a broken streak within 48h, only after the trial in Hardcore', () => {
    let s = giveYen(newSave(T0, 'UTC', 1, economy, { dailyGoalXp: 50 }), 1000);
    s = playLesson(s, T0);
    s = settleDay(s, ctx(T0 + 48 * H)).save;
    expect(s.streak.current).toBe(0);
    expect(buy(s, ctx(T0 + 49 * H + 50 * H), shop, 'kintsugi')).toEqual({ error: 'window-closed' });
    const r = buy(s, ctx(T0 + 49 * H), shop, 'kintsugi');
    if ('error' in r) throw new Error(r.error);
    expect(applyKintsugi(r.save, ctx(T0 + 49 * H), false)).toBeNull();
    const mended = applyKintsugi(r.save, ctx(T0 + 49 * H), true)!;
    expect(mended.streak.current).toBe(1);
    expect(mended.streak.broken).toBeNull();
  });
});

describe('reviews', () => {
  it('cards come due and clearing them all pays the bonus', () => {
    const s = playLesson(newSave(T0, 'UTC', 1, economy), T0);
    const later = T0 + 10 * 24 * H;
    const due = dueCards(s, later);
    expect(due.length).toBeGreaterThan(0);
    const outcomes = due.map((id) => ({
      target: { itemId: id.split('#')[0]!, facet: 'main' as const },
      correct: true,
      typo: false,
      hints: 0,
      ms: 3000,
      shape: 'choose' as const,
      skill: 'vocabulary' as const,
    }));
    const summary = {
      firstPassCorrect: due.length,
      mistakes: [],
      stars: 3 as const,
      accuracy: 1,
      kiaiCorrect: 0,
      xp: 50,
      outcomes,
    };
    const r = completeReviews(
      s,
      ctx(later),
      { summary, heartsLost: 0, reviewed: due.length },
      scheduler,
    );
    expect(r.clearedAll).toBe(true);
    expect(r.yen).toBe(economy.earn.clearAllReviews);
    expect(dueCards(r.save, later)).toEqual([]);
  });
});

describe('Elo skill ratings', () => {
  it('rise with correct answers and fall with mistakes', () => {
    const up = playLesson(newSave(T0, 'UTC', 1, economy), T0);
    expect(up.elo.kana).toBeGreaterThan(800);
    const down = playLesson(newSave(T0, 'UTC', 1, economy), T0, 'u01.n01', false);
    expect(down.elo.kana).toBeLessThan(800);
  });
});

describe('review fixes (regressions)', () => {
  const day = (n: number) => T0 + n * 24 * H;

  it('lowering the daily goal mid-day still lets today count', () => {
    let s = newSave(T0, 'UTC', 1, economy, { dailyGoalXp: 200 });
    s = playLesson(s, T0); // ~150 XP, below 200
    expect(s.streak.current).toBe(0);
    s = { ...s, settings: { ...s.settings, dailyGoalXp: 50 } };
    s = playLesson(s, T0 + H, 'u01.n01');
    expect(s.streak.current).toBe(1);
  });

  it('kotatsu are kept when they cannot save the streak, or when there is no streak', () => {
    let s = giveYen(newSave(T0, 'UTC', 1, economy, { dailyGoalXp: 50 }), 500);
    const r1 = buy(s, ctx(T0), shop, 'kotatsu');
    if ('error' in r1) throw new Error(r1.error);
    expect(balanceOf(settleDay(r1.save, ctx(day(3))).save.ledger, 'item:kotatsu')).toBe(1); // no streak
    s = playLesson(r1.save, T0);
    const r = settleDay(s, ctx(day(4))); // 3 missed days, 1 kotatsu
    expect(r.save.streak.current).toBe(0);
    expect(balanceOf(r.save.ledger, 'item:kotatsu')).toBe(1);
  });

  it('kintsugi cannot be applied after its window, even if held', () => {
    let s = giveYen(
      newSave(T0, 'UTC', 1, economy, { dailyGoalXp: 50, difficulty: 'standard' }),
      1000,
    );
    s = playLesson(s, T0);
    s = settleDay(s, ctx(day(2))).save;
    const r = buy(s, ctx(day(2)), shop, 'kintsugi');
    if ('error' in r) throw new Error(r.error);
    expect(applyKintsugi(r.save, ctx(day(30)), true)).toBeNull();
  });

  it('a streak broken under Hardcore still needs the trial after switching to Standard', () => {
    let s = giveYen(newSave(T0, 'UTC', 1, economy, { dailyGoalXp: 50 }), 1000);
    s = playLesson(s, T0);
    s = settleDay(s, ctx(day(2))).save;
    const r = buy(s, ctx(day(2)), shop, 'kintsugi');
    if ('error' in r) throw new Error(r.error);
    const switched = {
      ...r.save,
      settings: { ...r.save.settings, difficulty: 'standard' as const },
    };
    expect(applyKintsugi(switched, ctx(day(2)), false)).toBeNull();
    expect(applyKintsugi(switched, ctx(day(2)), true)).not.toBeNull();
  });

  it('changing difficulty clamps hearts, never refills them, and locks for a week', () => {
    let s = playLesson(newSave(T0, 'UTC', 1, economy), T0, 'u01.n01', false); // 0 hearts
    const toCasual = changeDifficulty(s, ctx(T0), 'casual');
    if ('error' in toCasual) throw new Error('locked');
    expect(changeDifficulty(toCasual.save, ctx(T0 + H), 'hardcore')).toMatchObject({
      error: 'locked',
    });
    const unlocked = {
      ...toCasual.save,
      settings: { ...toCasual.save.settings, difficultyLockedUntil: '' },
    };
    const back = changeDifficulty(unlocked, ctx(T0 + 60_000), 'hardcore');
    if ('error' in back) throw new Error('locked');
    expect(heartsNow(back.save, ctx(T0 + 60_000))).toBe(0);
    s = newSave(T0, 'UTC', 1, economy);
    const iron = changeDifficulty(s, ctx(T0), 'ironman');
    if ('error' in iron) throw new Error('locked');
    expect(balanceOf(iron.save.ledger, 'heart')).toBe(60);
  });

  it('onigiri cannot be bought at full hearts or without hearts', () => {
    const s = giveYen(newSave(T0, 'UTC', 1, economy), 100);
    expect(buy(s, ctx(T0), shop, 'onigiri')).toEqual({ error: 'hearts-full' });
    const casual = giveYen(newSave(T0, 'UTC', 1, economy, { difficulty: 'casual' }), 100);
    expect(buy(casual, ctx(T0), shop, 'onigiri')).toEqual({ error: 'not-allowed' });
  });

  it('charms are bought once, only when buyable', () => {
    let s = giveYen(newSave(T0, 'UTC', 1, economy), 1000);
    const r = buyCharm(s, ctx(T0), shop, 'gakugyo');
    if ('error' in r) throw new Error(r.error);
    s = r.save;
    expect(buyCharm(s, ctx(T0), shop, 'gakugyo')).toEqual({ error: 'already-owned' });
    expect(buyCharm(s, ctx(T0), shop, 'goukaku')).toEqual({ error: 'not-allowed' });
  });

  it('a quick first answer does not schedule a new card as easy', () => {
    const s = playLesson(newSave(T0, 'UTC', 1, economy), T0);
    const card = s.cards['k.a#main']!;
    expect(card.dueAt - T0).toBeLessThan(3 * 24 * H);
  });
});

describe('testing token grant', () => {
  it('grants the configured tokens exactly once, to new and existing saves', () => {
    const c = { ...ctx(T0), economy: { ...economy, testing: { grantTokens: 5 } } };
    const s0 = newSave(T0, 'UTC', 1, economy);
    const s1 = applyTestGrant(s0, c);
    expect(balanceOf(s1.ledger, 'token')).toBe(balanceOf(s0.ledger, 'token') + 5);
    expect(applyTestGrant(s1, c)).toBe(s1);
  });
  it('does nothing once the grant is set to 0 for launch', () => {
    const c = { ...ctx(T0), economy: { ...economy, testing: { grantTokens: 0 } } };
    const s0 = newSave(T0, 'UTC', 1, economy);
    expect(applyTestGrant(s0, c)).toBe(s0);
  });
});

describe('save migration v1 → v2 (koban → yen)', () => {
  it('converts every koban ledger event to yen at ¥10 each and leaves other assets alone', async () => {
    const { migrateSave } = await import('./save/migrate');
    const v2 = newSave(T0, 'UTC', 1, economy);
    const v1 = {
      ...v2,
      saveVersion: 1,
      ledger: [
        ...v2.ledger,
        { id: 90, at: T0, day: '2026-03-02', asset: 'koban', amount: 42, reason: 'lesson' },
        { id: 91, at: T0, day: '2026-03-02', asset: 'token', amount: 2, reason: 'boss' },
      ],
    };
    const r = migrateSave(v1);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.save.saveVersion).toBe(2);
    expect(balanceOf(r.save.ledger, 'yen')).toBe(420);
    expect(balanceOf(r.save.ledger, 'token')).toBe(2);
  });
});
