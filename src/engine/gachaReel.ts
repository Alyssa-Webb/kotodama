/**
 * The case-opening reel: a long strip of prizes that spins past a marker and stops on the
 * prize the pull already decided (engine/gacha.ts). Filler is drawn by the published odds, so
 * what scrolls by honestly reflects how often each rarity drops; it never changes the result.
 */
import type { Economy } from '../schema/economy';
import type { AvatarPart } from '../schema/world';
import type { Rarity } from './gacha';
import { Rng } from './rng';

export interface ReelItem {
  id: string;
  rarity: Rarity;
}

export interface Reel {
  items: ReelItem[];
  /** Index of the prize; the strip stops with this item under the marker. */
  win: number;
  /** Where inside the winning card it lands (0–1), so it doesn't stop dead centre every time. */
  landing: number;
}

export function buildReel(
  e: Economy,
  pool: readonly AvatarPart[],
  prize: AvatarPart,
  seed: number,
  length = 48,
): Reel {
  const rng = new Rng(seed);
  const byRarity = (r: Rarity) => pool.filter((p) => p.gacha === r);
  const total = e.gachapon.odds.reduce((s, o) => s + o.weight, 0);
  const rollRarity = (): Rarity => {
    let roll = rng.next() * total;
    for (const o of e.gachapon.odds) if ((roll -= o.weight) < 0) return o.rarity;
    return 'common';
  };
  const filler = (): ReelItem => {
    let r = rollRarity();
    let choices = byRarity(r);
    if (!choices.length) {
      r = 'common';
      choices = pool.filter((p) => p.gacha);
    }
    const p = rng.pick(choices);
    return { id: p.id, rarity: p.gacha ?? r };
  };
  const win = length - 6;
  const items = Array.from({ length }, (_, i) =>
    i === win ? { id: prize.id, rarity: prize.gacha ?? 'common' } : filler(),
  );
  // A near miss right after the prize: a rarer item one card past makes the stop feel tense.
  const rarer = byRarity('legendary');
  if (prize.gacha !== 'legendary' && rarer.length && rng.next() < 0.5)
    items[win + 1] = { id: rng.pick(rarer).id, rarity: 'legendary' };
  return { items, win, landing: 0.2 + rng.next() * 0.6 };
}
