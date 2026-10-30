/**
 * Gachapon: paid only with capsule tokens (earned by learning). Seeded RNG stored in the save,
 * published odds, duplicate protection (never drops something you own while new prizes remain),
 * and pity (a guaranteed rare-or-better after `pityAfter` pulls without one).
 */
import type { Economy } from '../schema/economy';
import type { AvatarPart } from '../schema/world';
import { Rng } from './rng';

export type Rarity = 'common' | 'rare' | 'legendary';
const RANK: Record<Rarity, number> = { common: 0, rare: 1, legendary: 2 };

export interface PullResult {
  prize: AvatarPart | null;
  rngState: number;
  pity: number;
  duplicate: boolean;
}

export function publishedOdds(e: Economy): { rarity: Rarity; percent: number }[] {
  const total = e.gachapon.odds.reduce((s, o) => s + o.weight, 0);
  return e.gachapon.odds.map((o) => ({
    rarity: o.rarity,
    percent: Math.round((o.weight / total) * 1000) / 10,
  }));
}

export function pull(
  e: Economy,
  pool: AvatarPart[],
  owned: readonly string[],
  rngState: number,
  pity: number,
): PullResult {
  const rng = new Rng(rngState);
  const total = e.gachapon.odds.reduce((s, o) => s + o.weight, 0);
  let roll = rng.next() * total;
  let rarity: Rarity = 'common';
  for (const o of e.gachapon.odds) {
    if ((roll -= o.weight) < 0) {
      rarity = o.rarity;
      break;
    }
  }
  if (pity + 1 >= e.gachapon.pityAfter && RANK[rarity] < RANK.rare) rarity = 'rare';
  const candidates = (r: Rarity) => pool.filter((p) => p.gacha === r);
  const unowned = (r: Rarity) => candidates(r).filter((p) => !owned.includes(p.id));
  // Duplicate protection: unowned prizes of the rolled rarity, then lower rarities, then higher ones.
  const all: Rarity[] = ['legendary', 'rare', 'common'];
  const order: Rarity[] = [
    ...all.filter((r) => RANK[r] <= RANK[rarity]),
    ...all.filter((r) => RANK[r] > RANK[rarity]).reverse(),
  ];
  let choices = order.map(unowned).find((l) => l.length) ?? [];
  let duplicate = false;
  if (!choices.length) {
    choices = candidates(rarity).length ? candidates(rarity) : pool.filter((p) => p.gacha);
    duplicate = true;
  }
  const prize = choices.length ? rng.pick(choices) : null;
  const gotRare = prize ? RANK[prize.gacha ?? 'common'] >= RANK.rare : false;
  return { prize, rngState: rng.state, pity: gotRare ? 0 : pity + 1, duplicate };
}
