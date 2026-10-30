import { describe, expect, it } from 'vitest';
import economyJson from '../../design/economy.json';
import buildingsJson from '../../world/buildings.json';
import spiritsJson from '../../world/spirits.json';
import starter from '../../content/packs/kotodama-starter.json';
import { EconomySchema } from '../schema/economy';
import { BuildingsSchema } from '../schema/town';
import { SpiritsSchema } from '../schema/world';
import { LessonPackSchema } from '../schema/pack';
import { balanceOf, append } from './economy/ledger';
import { newSave, type Ctx } from './game';
import {
  assign,
  buildingState,
  collect,
  pendingYen,
  ratePerHour,
  rarityOf,
  resident,
  staffSlots,
  upgrade,
  upgradeCost,
} from './town';

const economy = EconomySchema.parse(economyJson);
const data = BuildingsSchema.parse(buildingsJson);
const species = SpiritsSchema.parse(spiritsJson).species;
const pack = LessonPackSchema.parse(starter);
const T0 = Date.UTC(2026, 9, 30, 12);
const HOUR = 3_600_000;
const ctx = (now: number): Ctx => ({ now, timeZone: 'UTC', economy });
const station = data.buildings.find((b) => b.district === 'station')!;
const cafe = data.buildings.find((b) => b.district === 'cafe')!;
const item = (id: string) => pack.items.find((i) => i.id === id)!;
const yen = (s: ReturnType<typeof newSave>) => balanceOf(s.ledger, 'yen');

describe('town tycoon', () => {
  it('rolls each spirit a stable rarity per save, close to the published weights', () => {
    const s = newSave(T0, 'UTC', 1, economy);
    expect(rarityOf(s, 'w.mizu', data)).toBe(rarityOf(s, 'w.mizu', data));
    const counts: Record<string, number> = {};
    for (let i = 0; i < 4000; i++) {
      const r = rarityOf(s, `item-${i}`, data);
      counts[r] = (counts[r] ?? 0) + 1;
    }
    expect(counts.common! / 4000).toBeGreaterThan(0.5);
    expect(counts.common! / 4000).toBeLessThan(0.7);
    expect(counts.legendary ?? 0).toBeGreaterThan(0);
  });

  it('a forgotten word works worse than a remembered one', () => {
    const s = newSave(T0, 'UTC', 1, economy);
    const strong = resident(s, item('w.mizu'), 'guardian', data, species);
    const weak = resident(s, item('w.mizu'), 'lost', data, species);
    expect(strong.power).toBeGreaterThan(weak.power * 5);
  });

  it('matching species earn the affinity bonus', () => {
    const s = newSave(T0, 'UTC', 1, economy);
    const food = resident(s, item('w.mizu'), 'guardian', data, species);
    expect(food.species?.id).toBe('food-spirit');
    expect(ratePerHour(cafe, 1, [food], data)).toBe(
      Math.round(cafe.yenPerHour * food.power * data.affinityBonus),
    );
    expect(ratePerHour(station, 1, [food], data)).toBe(Math.round(station.yenPerHour * food.power));
  });

  it('income piles up in real time, capped, and collecting banks it as yen', () => {
    expect(pendingYen(100, T0, T0 + 2 * HOUR, data)).toBe(200);
    expect(pendingYen(100, T0, T0 + 100 * HOUR, data)).toBe(100 * data.capHours);
    expect(pendingYen(0, T0, T0 + HOUR, data)).toBe(0);
    let s = newSave(T0, 'UTC', 1, economy);
    s = {
      ...s,
      town: { buildings: { station: { level: 1, staff: [null, null], collectedAt: T0 } } },
    };
    const r = collect(s, ctx(T0 + 3 * HOUR), station, 50, data);
    expect(r.yen).toBe(150);
    expect(yen(r.save)).toBe(150);
    expect(buildingState(r.save, station, data).collectedAt).toBe(T0 + 3 * HOUR);
  });

  it('a spirit works in one building at a time, and restaffing banks income first', () => {
    let s = newSave(T0, 'UTC', 1, economy);
    const a = assign(s, ctx(T0), station, 0, 0, 'p.konnichiwa', data);
    if ('error' in a) throw new Error(a.error);
    s = a.save;
    expect(buildingState(s, station, data).staff).toEqual(['p.konnichiwa', null]);
    expect(assign(s, ctx(T0), cafe, 0, 0, 'p.konnichiwa', data)).toEqual({ error: 'busy' });
    const b = assign(s, ctx(T0 + HOUR), station, 80, 1, 'p.sumimasen', data);
    if ('error' in b) throw new Error(b.error);
    expect(b.yen).toBe(80);
    expect(assign(s, ctx(T0), station, 0, 9, 'w.mizu', data)).toEqual({ error: 'slot' });
  });

  it('upgrading costs yen, adds a staff slot and stops at the max level', () => {
    let s = newSave(T0, 'UTC', 1, economy);
    expect(upgrade(s, ctx(T0), station, 0, data, yen)).toEqual({ error: 'not-enough-yen' });
    s = {
      ...s,
      ledger: append(s.ledger, T0, '2026-10-30', [
        { asset: 'yen', amount: 100000, reason: 'test' },
      ]),
    };
    const r = upgrade(s, ctx(T0), station, 0, data, yen);
    if ('error' in r) throw new Error(r.error);
    expect(r.cost).toBe(upgradeCost(station, 1));
    expect(yen(r.save)).toBe(100000 - r.cost);
    expect(buildingState(r.save, station, data).staff).toHaveLength(staffSlots(2, data));
    let t = r.save;
    for (let i = 2; i < station.maxLevel; i++) {
      const u = upgrade(t, ctx(T0), station, 0, data, yen);
      if ('error' in u) throw new Error(u.error);
      t = u.save;
    }
    expect(upgrade(t, ctx(T0), station, 0, data, yen)).toEqual({ error: 'max-level' });
  });
});
