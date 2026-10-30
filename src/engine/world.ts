/** World state derived from memory: spirit stages, district restoration, bonsai, dojo ranks. */
import type { Item } from '../schema/pack';
import type { SaveState, StoredCard } from '../schema/save';
import type { District, SpiritSpecies } from '../schema/world';
import type { PackIndex } from './pack/index';
import type { Scheduler } from './memory/scheduler';

export type SpiritStage = 'egg' | 'sprite' | 'guardian' | 'fading' | 'lost';

export const GUARDIAN_STABILITY_DAYS = 21;
const DAY = 86_400_000;

/** Stage of an item's spirit from its cards (the weakest card decides). */
export function spiritStage(
  cards: StoredCard[],
  now: number,
  scheduler: Pick<Scheduler, 'retrievability'>,
  protectedUntil = 0,
): SpiritStage {
  if (!cards.length) return 'egg';
  if (cards.every((c) => c.reps <= 1 && c.lastReviewAt !== null && c.dueAt > now))
    return cards.some((c) => c.reps === 0) ? 'egg' : 'sprite';
  const overdue = cards.filter((c) => c.dueAt < now);
  if (overdue.length && protectedUntil <= now) {
    const worst = Math.min(...overdue.map((c) => scheduler.retrievability(c, now)));
    const overdueDays = Math.max(...overdue.map((c) => (now - c.dueAt) / DAY));
    return worst < 0.7 || overdueDays > 14 ? 'lost' : 'fading';
  }
  return cards.every((c) => c.stability >= GUARDIAN_STABILITY_DAYS) ? 'guardian' : 'sprite';
}

export function cardsOf(save: SaveState, itemId: string): StoredCard[] {
  return Object.entries(save.cards)
    .filter(([k]) => k.startsWith(`${itemId}#`))
    .map(([, c]) => c);
}

export function speciesFor(item: Item, species: SpiritSpecies[]): SpiritSpecies | undefined {
  const tagged = species.find(
    (s) => s.kinds.includes(item.kind) && s.tags?.some((t) => item.tags?.includes(t)),
  );
  return tagged ?? species.find((s) => s.kinds.includes(item.kind) && !s.tags);
}

export interface DistrictState {
  district: District;
  restored: boolean;
  /** Share of the restoring unit completed (0..1). */
  progress: number;
  lit: boolean;
}

export function districtStates(
  save: SaveState,
  index: PackIndex,
  districts: District[],
  daysAway: number,
): DistrictState[] {
  return districts.map((d) => {
    if (!d.restoredBy) return { district: d, restored: false, progress: 0, lit: false };
    const path = index.paths.find((p) => p.pack.pack.id === d.restoredBy!.packId);
    const nodes = path?.nodes.filter((n) => n.unit.id === d.restoredBy!.unitId) ?? [];
    const done = nodes.filter((n) => save.nodes[n.key]).length;
    const restored = nodes.length > 0 && done === nodes.length;
    // Lanterns go dark after a missed day.
    return {
      district: d,
      restored,
      progress: nodes.length ? done / nodes.length : 0,
      lit: restored && daysAway === 0,
    };
  });
}

/** Bonsai health: grows with learned items, drops leaves per missed day, bare after three. */
export function bonsai(learned: number, daysAway: number): { size: number; leaves: number } {
  const size = Math.min(5, 1 + Math.floor(learned / 10));
  const leaves = daysAway >= 3 ? 0 : Math.max(0, 1 - daysAway / 3);
  return { size, leaves };
}

/** Dojo rank from an Elo-style rating: 10-kyū at 800, one step per 100, shodan at 1800. */
export function dojoRank(rating: number): string {
  const step = Math.floor((rating - 800) / 100);
  if (step < 10) return `${10 - Math.max(0, step)}-kyū`;
  const dan = step - 9;
  return dan === 1 ? 'Shodan' : `${dan}-dan`;
}

/** Elo update for a skill rating against an item difficulty (K = 24). */
export function eloUpdate(rating: number, difficulty: number, correct: boolean, k = 24): number {
  const expected = 1 / (1 + 10 ** ((difficulty - rating) / 400));
  return Math.round(rating + k * ((correct ? 1 : 0) - expected));
}
