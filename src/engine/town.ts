/**
 * Town tycoon: each restored district runs a business staffed by your word-spirits. A spirit's
 * power is its rarity (rolled once per save) times its work skill, which comes from how well you
 * remember the word, so a forgotten word slows its shop down until you review it. Income piles
 * up in real time (capped), and you bank it by collecting, restaffing or upgrading.
 */
import type { Item } from '../schema/pack';
import type { SaveState } from '../schema/save';
import type { Building, Buildings, RarityId } from '../schema/town';
import type { SpiritSpecies } from '../schema/world';
import { append } from './economy/ledger';
import { today, type Ctx } from './game';
import type { SpiritStage } from './world';
import { speciesFor } from './world';

const HOUR = 3_600_000;

/** Stable per-save rarity for a spirit: an FNV-1a hash of the save's birth and the item id. */
export function rarityOf(save: SaveState, itemId: string, data: Buildings): RarityId {
  let h = 0x811c9dc5 ^ (save.createdAt % 0xffffffff);
  for (const ch of itemId) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  const total = data.rarities.reduce((a, r) => a + r.weight, 0);
  let roll = ((h >>> 0) / 0x100000000) * total;
  for (const r of data.rarities) {
    if ((roll -= r.weight) < 0) return r.id;
  }
  return 'common';
}

export interface Resident {
  item: Item;
  stage: SpiritStage;
  rarity: RarityId;
  species: SpiritSpecies | undefined;
  /** Rarity power × memory skill (before the building's affinity bonus). */
  power: number;
}

export function resident(
  save: SaveState,
  item: Item,
  stage: SpiritStage,
  data: Buildings,
  species: SpiritSpecies[],
): Resident {
  const rarity = rarityOf(save, item.id, data);
  const power = data.rarities.find((r) => r.id === rarity)!.power * data.skill[stage];
  return { item, stage, rarity, species: speciesFor(item, species), power };
}

export interface BuildingState {
  level: number;
  staff: (string | null)[];
  collectedAt: number;
}

export function buildingState(save: SaveState, b: Building, data: Buildings): BuildingState {
  const s = save.town.buildings[b.district];
  const slots = staffSlots(s?.level ?? 1, data);
  const staff = Array.from({ length: slots }, (_, i) => s?.staff[i] ?? null);
  return { level: s?.level ?? 1, staff, collectedAt: s?.collectedAt ?? 0 };
}

/** Staff slots grow with the building: 2 at level 1, one more per level, up to maxStaff. */
export const staffSlots = (level: number, data: Buildings) => Math.min(data.maxStaff, level + 1);

/** A spirit's output in this building: its power, boosted when its species fits the trade. */
export function staffPower(r: Resident, b: Building, data: Buildings): number {
  return r.power * (r.species && b.affinity.includes(r.species.id) ? data.affinityBonus : 1);
}

/** Yen per hour: the building's base rate × level growth × its staff's combined power. */
export function ratePerHour(
  b: Building,
  level: number,
  staff: (Resident | undefined)[],
  data: Buildings,
): number {
  const power = staff.reduce((a, r) => a + (r ? staffPower(r, b, data) : 0), 0);
  return Math.round(b.yenPerHour * (1 + 0.5 * (level - 1)) * power);
}

/** Yen waiting to be collected (capped at capHours of production). */
export function pendingYen(rate: number, collectedAt: number, now: number, data: Buildings) {
  if (rate <= 0 || collectedAt <= 0) return 0;
  const hours = Math.min(data.capHours, Math.max(0, now - collectedAt) / HOUR);
  return Math.floor(rate * hours);
}

export const upgradeCost = (b: Building, level: number) =>
  Math.round(b.upgradeBase * b.upgradeGrowth ** (level - 1));

function put(save: SaveState, district: string, st: BuildingState): SaveState {
  return {
    ...save,
    town: { buildings: { ...save.town.buildings, [district]: { ...st } } },
  };
}

/** Banks a building's pending income into the yen ledger and restarts its clock. */
export function collect(save: SaveState, c: Ctx, b: Building, rate: number, data: Buildings) {
  const st = buildingState(save, b, data);
  const yen = pendingYen(rate, st.collectedAt, c.now, data);
  let next = put(save, b.district, { ...st, collectedAt: c.now });
  if (yen > 0)
    next = {
      ...next,
      ledger: append(next.ledger, c.now, today(save, c), [
        { asset: 'yen', amount: yen, reason: 'town', ref: b.district },
      ]),
    };
  return { save: next, yen };
}

export type StaffError = 'slot' | 'busy';

/**
 * Puts a spirit in a staff slot (or empties it with null). Income so far is banked first at the
 * old rate. A spirit works in one building at a time.
 */
export function assign(
  save: SaveState,
  c: Ctx,
  b: Building,
  rate: number,
  slot: number,
  itemId: string | null,
  data: Buildings,
): { save: SaveState; yen: number } | { error: StaffError } {
  const st = buildingState(save, b, data);
  if (slot < 0 || slot >= st.staff.length) return { error: 'slot' };
  if (
    itemId &&
    Object.entries(save.town.buildings).some(
      ([d, s]) => s.staff.includes(itemId) && !(d === b.district && st.staff[slot] === itemId),
    )
  )
    return { error: 'busy' };
  const banked = collect(save, c, b, rate, data);
  const staff = [...st.staff];
  staff[slot] = itemId;
  return {
    save: put(banked.save, b.district, { ...st, staff, collectedAt: c.now }),
    yen: banked.yen,
  };
}

export type UpgradeError = 'max-level' | 'not-enough-yen';

export function upgrade(
  save: SaveState,
  c: Ctx,
  b: Building,
  rate: number,
  data: Buildings,
  yenBalance: (s: SaveState) => number,
): { save: SaveState; cost: number } | { error: UpgradeError } {
  const st = buildingState(save, b, data);
  if (st.level >= b.maxLevel) return { error: 'max-level' };
  const banked = collect(save, c, b, rate, data).save;
  const cost = upgradeCost(b, st.level);
  if (yenBalance(banked) < cost) return { error: 'not-enough-yen' };
  const level = st.level + 1;
  const staff = Array.from({ length: staffSlots(level, data) }, (_, i) => st.staff[i] ?? null);
  const paid = {
    ...banked,
    ledger: append(banked.ledger, c.now, today(save, c), [
      { asset: 'yen', amount: -cost, reason: 'town-upgrade', ref: b.district },
    ]),
  };
  return { save: put(paid, b.district, { level, staff, collectedAt: c.now }), cost };
}
