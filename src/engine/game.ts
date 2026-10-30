/**
 * Game rules over the SaveState (pure). Every function takes the current time explicitly and
 * returns a new state; nothing here touches storage, the DOM or the wall clock.
 */
import type { Economy } from '../schema/economy';
import type { Item } from '../schema/pack';
import { SAVE_VERSION, SettingsSchema, type SaveState, type Settings } from '../schema/save';
import type { ConsumableId, Shop } from '../schema/world';
import { append, balanceOf, balances, type NewEvent } from './economy/ledger';
import { lessonReward, type LessonReward } from './economy/rewards';
import type { SessionSummary } from './lesson/session';
import { addDays, dayDiff, gameDay } from './memory/day';
import { cardId, gradeFor, isDue, type Scheduler } from './memory/scheduler';
import { facetFor } from './exercises/plugins';

export interface Ctx {
  now: number;
  timeZone: string;
  economy: Economy;
}

export const today = (s: SaveState, c: Pick<Ctx, 'now' | 'timeZone'>) =>
  gameDay(c.now, c.timeZone, s.settings.rolloverHour);

export function newSave(
  now: number,
  timeZone: string,
  seed: number,
  economy: Economy,
  settings: Partial<Settings> = {},
): SaveState {
  const st = SettingsSchema.parse(settings);
  const day = gameDay(now, timeZone, st.rolloverHour);
  const maxHearts = economy.difficulty[st.difficulty]?.hearts ?? 0;
  return {
    saveVersion: SAVE_VERSION,
    createdAt: now,
    settings: { ...st, dailyGoalXp: settings.dailyGoalXp ?? economy.xp.defaultDailyGoalXp },
    cards: {},
    itemStats: {},
    nodes: {},
    ledger: append([], now, day, [{ asset: 'heart', amount: maxHearts, reason: 'start' }]),
    streak: {
      current: 0,
      best: 0,
      lastGoalDay: null,
      lastProcessedDay: day,
      broken: null,
      missedDays: 0,
    },
    daily: { day, xp: 0, lessons: 0, reviews: 0, chestClaimed: false },
    hearts: { updatedAt: now, dojoProgress: 0 },
    boosts: { taikoUntil: 0, manekiLessons: 0, omamori: {} },
    charms: { owned: [], equipped: null },
    collection: { shopWords: [] },
    avatar: {
      equipped: { base: 'base-traveler', outfit: 'outfit-travel' },
      owned: ['base-traveler', 'outfit-travel'],
    },
    gacha: { rngState: seed >>> 0, pity: 0, owned: [] },
    bosses: {},
    rush: {},
    mistakes: [],
    elo: { kana: 800, vocabulary: 800, grammar: 800, listening: 800 },
    archivedItems: [],
    notes: '',
    lessonCount: 0,
    lastBackupAt: null,
  };
}

// ---------------------------------------------------------------- hearts

export function maxHearts(s: SaveState, e: Economy): number | null {
  return e.difficulty[s.settings.difficulty]?.hearts ?? null;
}

/** Hearts right now, including hourly refills not yet written to the ledger. */
export function heartsNow(s: SaveState, c: Ctx): number | null {
  const max = maxHearts(s, c.economy);
  if (max === null) return null;
  const stored = Math.min(max, balanceOf(s.ledger, 'heart'));
  const rules = c.economy.difficulty[s.settings.difficulty]!;
  if (rules.refill !== 'hourly') return stored;
  const earned = Math.floor(
    (c.now - s.hearts.updatedAt) / (c.economy.hearts.refillMinutes * 60_000),
  );
  return Math.min(max, stored + Math.max(0, earned));
}

/** Writes pending refills to the ledger (call before spending hearts). */
export function settleHearts(s: SaveState, c: Ctx): SaveState {
  const max = maxHearts(s, c.economy);
  if (max === null) return s;
  const stored = balanceOf(s.ledger, 'heart');
  const rules = c.economy.difficulty[s.settings.difficulty]!;
  const day = today(s, c);
  if (rules.refill === 'hourly') {
    const period = c.economy.hearts.refillMinutes * 60_000;
    const earned = Math.floor((c.now - s.hearts.updatedAt) / period);
    if (stored >= max) return { ...s, hearts: { ...s.hearts, updatedAt: c.now } };
    if (earned <= 0) return s;
    const add = Math.min(max - stored, earned);
    return {
      ...s,
      ledger: append(s.ledger, c.now, day, [
        { asset: 'heart', amount: add, reason: 'heart-refill' },
      ]),
      hearts: {
        ...s.hearts,
        updatedAt: stored + add >= max ? c.now : s.hearts.updatedAt + earned * period,
      },
    };
  }
  return s;
}

/** Minutes until the next hourly heart, or null when full / not hourly. */
export function minutesToNextHeart(s: SaveState, c: Ctx): number | null {
  const max = maxHearts(s, c.economy);
  const h = heartsNow(s, c);
  if (max === null || h === null || h >= max) return null;
  if (c.economy.difficulty[s.settings.difficulty]!.refill !== 'hourly') return null;
  const period = c.economy.hearts.refillMinutes * 60_000;
  return Math.ceil((period - ((c.now - s.hearts.updatedAt) % period)) / 60_000);
}

function loseHearts(s: SaveState, c: Ctx, n: number, ref: string): SaveState {
  if (n <= 0 || maxHearts(s, c.economy) === null) return s;
  const settled = settleHearts(s, c);
  const have = Math.max(0, balanceOf(settled.ledger, 'heart'));
  const lose = Math.min(have, n);
  const wasFull = have >= (maxHearts(s, c.economy) ?? 0);
  return {
    ...settled,
    ledger: append(settled.ledger, c.now, today(s, c), [
      { asset: 'heart', amount: -lose, reason: 'heart-lost', ref },
    ]),
    // the refill clock starts when you drop below full
    hearts: wasFull ? { ...settled.hearts, updatedAt: c.now } : settled.hearts,
  };
}

function gainHearts(s: SaveState, c: Ctx, n: number, reason: string): SaveState {
  const max = maxHearts(s, c.economy);
  if (max === null || n <= 0) return s;
  const settled = settleHearts(s, c);
  const add = Math.min(n, max - balanceOf(settled.ledger, 'heart'));
  return {
    ...settled,
    ledger: append(settled.ledger, c.now, today(s, c), [{ asset: 'heart', amount: add, reason }]),
  };
}

// ---------------------------------------------------------------- day rollover

export interface SettleNotice {
  kind: 'streak-frozen' | 'streak-lost' | 'koban-spoiled' | 'hearts-refilled' | 'new-day';
  amount?: number;
}

/**
 * Processes every game day between the last visit and today: kotatsu freezes, streak loss,
 * Hardcore koban spoil, daily heart refills and the daily counters. Idempotent within a day;
 * a clock that moves backwards (time-zone change westward) is ignored.
 */
export function settleDay(s: SaveState, c: Ctx): { save: SaveState; notices: SettleNotice[] } {
  const day = today(s, c);
  const last = s.streak.lastProcessedDay ?? day;
  if (dayDiff(last, day) <= 0) return { save: settleHearts(s, c), notices: [] };

  const notices: SettleNotice[] = [{ kind: 'new-day' }];
  const rules = c.economy.difficulty[s.settings.difficulty]!;
  let ledger = s.ledger;
  let streak = { ...s.streak };
  const events: NewEvent[] = [];

  // Days that ended without meeting the goal: from the last processed day up to yesterday.
  const missed: string[] = [];
  for (let d = last; dayDiff(d, day) > 0; d = addDays(d, 1)) {
    // Days on or before the last goal day were already settled by the streak chain itself.
    if (streak.lastGoalDay === null || dayDiff(streak.lastGoalDay, d) > 0) missed.push(d);
  }

  let kotatsu = balanceOf(ledger, 'item:kotatsu');
  let uncovered = 0;
  for (const d of missed) {
    if (kotatsu > 0) {
      kotatsu--;
      events.push({ asset: 'item:kotatsu', amount: -1, reason: 'kotatsu-used', ref: d });
      streak.lastGoalDay = d; // a frozen day keeps the chain unbroken but does not extend it
    } else uncovered++;
  }
  const frozen = missed.length - uncovered;
  if (frozen) notices.push({ kind: 'streak-frozen', amount: frozen });

  if (uncovered > 0) {
    if (streak.current > 0) {
      streak = { ...streak, broken: { day, length: streak.current, at: c.now }, current: 0 };
      notices.push({ kind: 'streak-lost' });
    }
    streak.missedDays = s.streak.missedDays + uncovered;
    if (rules.spoil) {
      let koban = balanceOf(ledger, 'koban');
      let spoiled = 0;
      for (let i = 0; i < uncovered; i++) {
        const lose = Math.floor(koban * c.economy.penalties.hardcoreSpoilPerMissedDay);
        koban -= lose;
        spoiled += lose;
      }
      if (spoiled) {
        events.push({ asset: 'koban', amount: -spoiled, reason: 'spoil' });
        notices.push({ kind: 'koban-spoiled', amount: spoiled });
      }
    }
  }
  ledger = append(ledger, c.now, day, events);

  let next: SaveState = {
    ...s,
    ledger,
    streak: { ...streak, lastProcessedDay: day },
    daily: { day, xp: 0, lessons: 0, reviews: 0, chestClaimed: false },
  };
  if (rules.refill === 'daily') {
    const max = rules.hearts ?? 0;
    const add = max - balanceOf(next.ledger, 'heart');
    if (add > 0) {
      next = {
        ...next,
        ledger: append(next.ledger, c.now, day, [
          { asset: 'heart', amount: add, reason: 'heart-refill' },
        ]),
      };
      notices.push({ kind: 'hearts-refilled', amount: add });
    }
  }
  return { save: settleHearts(next, c), notices };
}

/** Days since the daily goal was last met (0 = met today or yesterday's chain intact). Drives the town dimming. */
export function daysAway(s: SaveState, c: Pick<Ctx, 'now' | 'timeZone'>): number {
  if (!s.streak.lastGoalDay) return 0;
  return Math.max(0, dayDiff(s.streak.lastGoalDay, today(s, c)) - 1);
}

// ---------------------------------------------------------------- XP, goal and streak

function addXp(
  s: SaveState,
  c: Ctx,
  xp: number,
): { save: SaveState; streakExtended: boolean; milestone?: number } {
  const day = today(s, c);
  const before = s.daily.xp;
  const after = before + xp;
  let streak = s.streak;
  let ledger = s.ledger;
  let extended = false;
  let milestone: number | undefined;
  if (
    before < s.settings.dailyGoalXp &&
    after >= s.settings.dailyGoalXp &&
    streak.lastGoalDay !== day
  ) {
    const chained = streak.lastGoalDay !== null && dayDiff(streak.lastGoalDay, day) === 1;
    const current = chained ? streak.current + 1 : 1;
    streak = { ...streak, current, best: Math.max(streak.best, current), lastGoalDay: day };
    extended = true;
    const m = c.economy.earn.streakMilestones.find((x) => x.days === current);
    if (m) {
      milestone = m.days;
      ledger = append(ledger, c.now, day, [
        { asset: 'koban', amount: m.koban, reason: 'streak-milestone', ref: String(m.days) },
      ]);
    }
  }
  return {
    save: { ...s, ledger, streak, daily: { ...s.daily, xp: after } },
    streakExtended: extended,
    ...(milestone ? { milestone } : {}),
  };
}

// ---------------------------------------------------------------- reviews and cards

export function dueCards(
  s: SaveState,
  now: number,
  archived: ReadonlySet<string> = new Set(s.archivedItems),
): string[] {
  return Object.entries(s.cards)
    .filter(([id, c]) => isDue(c, now) && !archived.has(id.split('#')[0]!))
    .sort((a, b) => a[1].dueAt - b[1].dueAt)
    .map(([id]) => id);
}

/** Cards for an item: two for phrases, patterns and sentences, one for kana and words. */
export function cardIdsFor(item: Item): string[] {
  const facets = new Set([facetFor(item, 'understand'), facetFor(item, 'produce')]);
  return [...facets].map((f) => cardId(item.id, f));
}

function applyOutcomes(
  s: SaveState,
  outcomes: SessionSummary['outcomes'],
  scheduler: Scheduler,
  now: number,
): SaveState {
  const cards = { ...s.cards };
  const itemStats = { ...s.itemStats };
  for (const o of outcomes) {
    const id = cardId(o.target.itemId, o.target.facet);
    cards[id] = scheduler.review(cards[id], gradeFor(o), now);
    const st = itemStats[o.target.itemId] ?? { seen: 0, correct: 0, wrong: 0 };
    itemStats[o.target.itemId] = {
      seen: st.seen + 1,
      correct: st.correct + (o.correct ? 1 : 0),
      wrong: st.wrong + (o.correct ? 0 : 1),
    };
  }
  return { ...s, cards, itemStats };
}

function recordMistakes(s: SaveState, summary: SessionSummary, now: number): SaveState {
  const fresh = summary.mistakes.map((m) => ({
    at: now,
    exerciseId: m.question.exerciseId,
    ...(m.question.targets[0] ? { itemId: m.question.targets[0].itemId } : {}),
    given: m.result.given,
    expected: 'ja' in m.question.solution ? m.question.solution.ja : m.question.solution.en,
  }));
  return { ...s, mistakes: [...fresh, ...s.mistakes].slice(0, 50) };
}

export const xpMultiplier = (s: SaveState, c: Ctx, review = false): number =>
  (s.boosts.taikoUntil > c.now ? c.economy.boosts.taikoXpMultiplier : 1) *
  (review && s.charms.equipped === 'gakugyo' ? 1.1 : 1);

export interface LessonResult {
  save: SaveState;
  reward: LessonReward;
  streakExtended: boolean;
  milestone?: number;
  newItems: string[];
}

/**
 * Applies a finished (or failed) lesson: hearts, XP, koban, stars, new cards for introduced items,
 * FSRS reviews for every practiced card, and the mistake log.
 */
export function completeLesson(
  s: SaveState,
  c: Ctx,
  input: {
    nodeKey: string;
    summary: SessionSummary;
    heartsLost: number;
    completed: boolean;
    introduces: Item[];
    totalQuestions: number;
  },
  scheduler: Scheduler,
): LessonResult {
  let save = loseHearts(s, c, input.heartsLost, input.nodeKey);
  save = recordMistakes(save, input.summary, c.now);
  if (!input.completed) {
    return {
      save,
      reward: lessonReward({
        economy: c.economy,
        completed: false,
        stars: 0,
        xp: 0,
        kiaiCorrect: 0,
        totalQuestions: 0,
        reviewDebt: false,
        manekiActive: false,
        nodeKey: input.nodeKey,
      }),
      streakExtended: false,
      newItems: [],
    };
  }
  const reviewDebt = dueCards(save, c.now).length > 0;
  const manekiActive = save.boosts.manekiLessons > 0;
  const reward = lessonReward({
    economy: c.economy,
    completed: true,
    stars: input.summary.stars,
    xp: input.summary.xp,
    kiaiCorrect: input.summary.kiaiCorrect,
    totalQuestions: input.totalQuestions,
    reviewDebt,
    manekiActive,
    nodeKey: input.nodeKey,
  });
  const day = today(save, c);
  save = { ...save, ledger: append(save.ledger, c.now, day, reward.events) };

  // New items get their cards; the lesson's answers then count as their first review.
  const cards = { ...save.cards };
  const newItems: string[] = [];
  for (const item of input.introduces) {
    for (const id of cardIdsFor(item)) if (!cards[id]) cards[id] = scheduler.newCard(c.now);
    newItems.push(item.id);
  }
  save = applyOutcomes({ ...save, cards }, input.summary.outcomes, scheduler, c.now);

  const prev = save.nodes[input.nodeKey];
  save = {
    ...save,
    nodes: {
      ...save.nodes,
      [input.nodeKey]: {
        completedAt: c.now,
        stars: Math.max(prev?.stars ?? 0, input.summary.stars),
        bestXp: Math.max(prev?.bestXp ?? 0, input.summary.xp),
        plays: (prev?.plays ?? 0) + 1,
      },
    },
    boosts: {
      ...save.boosts,
      manekiLessons: Math.max(0, save.boosts.manekiLessons - (manekiActive ? 1 : 0)),
    },
    daily: { ...save.daily, lessons: save.daily.lessons + 1 },
    lessonCount: save.lessonCount + 1,
  };
  const x = addXp(save, c, reward.xp);
  return {
    save: x.save,
    reward,
    streakExtended: x.streakExtended,
    ...(x.milestone ? { milestone: x.milestone } : {}),
    newItems,
  };
}

export interface ReviewResult {
  save: SaveState;
  xp: number;
  koban: number;
  tokens: number;
  heartsEarned: number;
  clearedAll: boolean;
  streakExtended: boolean;
}

/** Applies a Dojo review session: FSRS updates, XP, hearts earned back (1 per 10 reviews), clear-all bonus. */
export function completeReviews(
  s: SaveState,
  c: Ctx,
  input: { summary: SessionSummary; heartsLost: number; reviewed: number },
  scheduler: Scheduler,
): ReviewResult {
  const hadDebt = dueCards(s, c.now).length > 0;
  let save = loseHearts(s, c, input.heartsLost, 'dojo');
  save = recordMistakes(save, input.summary, c.now);
  save = applyOutcomes(save, input.summary.outcomes, scheduler, c.now);
  const day = today(save, c);

  const progress = save.hearts.dojoProgress + input.reviewed;
  const per = c.economy.hearts.dojoReviewsPerHeart;
  const heartsEarned = Math.floor(progress / per);
  save = { ...save, hearts: { ...save.hearts, dojoProgress: progress % per } };
  const before = heartsNow(save, c) ?? 0;
  save = gainHearts(save, c, heartsEarned, 'heart-dojo');
  const gained = (heartsNow(save, c) ?? 0) - before;

  const clearedAll = hadDebt && dueCards(save, c.now).length === 0;
  const events: NewEvent[] = [{ asset: 'xp', amount: input.summary.xp, reason: 'reviews' }];
  if (clearedAll) {
    events.push({
      asset: 'koban',
      amount: c.economy.earn.clearAllReviews,
      reason: 'reviews-cleared',
    });
    events.push({
      asset: 'token',
      amount: c.economy.earn.clearReviewDebtTokens,
      reason: 'reviews-cleared',
    });
  }
  save = {
    ...save,
    ledger: append(save.ledger, c.now, day, events),
    daily: { ...save.daily, reviews: save.daily.reviews + input.reviewed },
  };
  const x = addXp(save, c, input.summary.xp);
  return {
    save: x.save,
    xp: input.summary.xp,
    koban: clearedAll ? c.economy.earn.clearAllReviews : 0,
    tokens: clearedAll ? c.economy.earn.clearReviewDebtTokens : 0,
    heartsEarned: gained,
    clearedAll,
    streakExtended: x.streakExtended,
  };
}

// ---------------------------------------------------------------- unlocking

/** A node is unlocked when every earlier node in its pack is complete. */
export function isUnlocked(s: SaveState, orderedKeys: readonly string[], key: string): boolean {
  const i = orderedKeys.indexOf(key);
  if (i <= 0) return i === 0;
  return orderedKeys.slice(0, i).every((k) => !!s.nodes[k]);
}

// ---------------------------------------------------------------- shop

export type PurchaseError =
  | 'not-enough-koban'
  | 'max-held'
  | 'unknown-item'
  | 'not-allowed'
  | 'no-broken-streak'
  | 'window-closed';

export function kintsugiPrice(s: SaveState, shop: Shop): number {
  const k = shop.consumables.find((x) => x.id === 'kintsugi');
  return (k?.price ?? 0) + (k?.pricePerStreakDay ?? 0) * (s.streak.broken?.length ?? 0);
}

export function priceOf(s: SaveState, shop: Shop, id: ConsumableId): number | undefined {
  if (id === 'kintsugi') return kintsugiPrice(s, shop);
  return shop.consumables.find((x) => x.id === id)?.price;
}

export function kintsugiAvailable(s: SaveState, c: Ctx): boolean {
  const b = s.streak.broken;
  if (!b || !c.economy.difficulty[s.settings.difficulty]!.kintsugi) return false;
  return c.now - b.at <= c.economy.penalties.kintsugiWindowHours * 3_600_000;
}

/** Buys a consumable with koban; its Japanese name joins the collection as a word to learn. */
export function buy(
  s: SaveState,
  c: Ctx,
  shop: Shop,
  id: ConsumableId,
): { save: SaveState } | { error: PurchaseError } {
  const item = shop.consumables.find((x) => x.id === id);
  if (!item) return { error: 'unknown-item' };
  const rules = c.economy.difficulty[s.settings.difficulty]!;
  if (id === 'onigiri' && !rules.onigiri) return { error: 'not-allowed' };
  if (id === 'kintsugi' && !kintsugiAvailable(s, c))
    return { error: s.streak.broken ? 'window-closed' : 'no-broken-streak' };
  const price = priceOf(s, shop, id) ?? item.price;
  const bal = balances(s.ledger);
  if ((bal.koban ?? 0) < price) return { error: 'not-enough-koban' };
  const max = id === 'kotatsu' ? c.economy.streakFreezeMax : item.max;
  if (max !== undefined && (bal[`item:${id}`] ?? 0) >= max) return { error: 'max-held' };
  const day = today(s, c);
  let save: SaveState = {
    ...s,
    ledger: append(s.ledger, c.now, day, [
      { asset: 'koban', amount: -price, reason: 'purchase', ref: id },
      { asset: `item:${id}`, amount: 1, reason: 'purchase' },
    ]),
    collection: s.collection.shopWords.includes(id)
      ? s.collection
      : { shopWords: [...s.collection.shopWords, id] },
  };
  // Instant-use items apply immediately.
  if (id === 'onigiri') save = consumeItem(save, c, 'onigiri');
  if (id === 'taiko') save = consumeItem(save, c, 'taiko');
  if (id === 'maneki') save = consumeItem(save, c, 'maneki');
  return { save };
}

export function consumeItem(s: SaveState, c: Ctx, id: ConsumableId): SaveState {
  if (balanceOf(s.ledger, `item:${id}`) <= 0) return s;
  const day = today(s, c);
  const spend = (st: SaveState) => ({
    ...st,
    ledger: append(st.ledger, c.now, day, [{ asset: `item:${id}`, amount: -1, reason: 'used' }]),
  });
  switch (id) {
    case 'onigiri':
      return gainHearts(spend(s), c, 1, 'heart-onigiri');
    case 'taiko':
      return {
        ...spend(s),
        boosts: {
          ...s.boosts,
          taikoUntil: Math.max(c.now, s.boosts.taikoUntil) + c.economy.boosts.taikoMinutes * 60_000,
        },
      };
    case 'maneki':
      return {
        ...spend(s),
        boosts: {
          ...s.boosts,
          manekiLessons: s.boosts.manekiLessons + c.economy.boosts.manekiLessons,
        },
      };
    default:
      return spend(s);
  }
}

/**
 * Kintsugi repair: restores the broken streak. In Hardcore it is applied only after passing the
 * Redemption Trial (the caller runs the trial, then calls this with passed=true).
 */
export function applyKintsugi(s: SaveState, c: Ctx, trialPassed: boolean): SaveState | null {
  const rules = c.economy.difficulty[s.settings.difficulty]!;
  if (!s.streak.broken || balanceOf(s.ledger, 'item:kintsugi') <= 0) return null;
  if (rules.kintsugiTrial && !trialPassed) return null;
  const day = today(s, c);
  const restored = s.streak.broken.length + s.streak.current;
  return {
    ...s,
    ledger: append(s.ledger, c.now, day, [{ asset: 'item:kintsugi', amount: -1, reason: 'used' }]),
    streak: {
      ...s.streak,
      current: restored,
      best: Math.max(s.streak.best, restored),
      broken: null,
      // the chain continues from yesterday, so meeting today's goal extends it
      lastGoalDay: s.streak.lastGoalDay === day ? day : addDays(day, -1),
    },
  };
}

/** Items for the Redemption Trial: the player's weakest items by error rate, then by lapses. */
export function weakestItems(s: SaveState, n: number): string[] {
  const score = (id: string) => {
    const st = s.itemStats[id];
    const lapses = Object.entries(s.cards)
      .filter(([k]) => k.startsWith(`${id}#`))
      .reduce((sum, [, card]) => sum + card.lapses, 0);
    return (st ? st.wrong / Math.max(1, st.seen) : 0) * 10 + lapses;
  };
  const ids = [...new Set(Object.keys(s.cards).map((k) => k.split('#')[0]!))];
  return ids.sort((a, b) => score(b) - score(a)).slice(0, n);
}
