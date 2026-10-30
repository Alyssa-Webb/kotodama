import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import economyJson from '../../design/economy.json';
import avatarJson from '../../world/avatar.json';
import { EconomySchema } from '../schema/economy';
import { AvatarSchema } from '../schema/world';
import { buildReel } from './gachaReel';

const economy = EconomySchema.parse(economyJson);
const pool = AvatarSchema.parse(avatarJson).parts.filter((p) => p.gacha);

describe('buildReel', () => {
  it('always stops on the prize the pull decided', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1e9 }),
        fc.integer({ min: 0, max: pool.length - 1 }),
        (seed, i) => {
          const prize = pool[i]!;
          const r = buildReel(economy, pool, prize, seed);
          return (
            r.items[r.win]!.id === prize.id &&
            r.items[r.win]!.rarity === prize.gacha &&
            r.landing >= 0.2 &&
            r.landing <= 0.8
          );
        },
      ),
    );
  });

  it('only shows real gacha prizes, and is the same for the same seed', () => {
    const prize = pool[0]!;
    const a = buildReel(economy, pool, prize, 42);
    expect(a).toEqual(buildReel(economy, pool, prize, 42));
    for (const it of a.items) expect(pool.some((p) => p.id === it.id)).toBe(true);
  });

  it('fills the strip roughly by the published odds (commons are the bulk)', () => {
    const prize = pool.find((p) => p.gacha === 'common')!;
    let common = 0;
    let n = 0;
    for (let s = 1; s <= 60; s++) {
      for (const it of buildReel(economy, pool, prize, s).items) {
        n++;
        if (it.rarity === 'common') common++;
      }
    }
    expect(common / n).toBeGreaterThan(0.5);
  });
});
