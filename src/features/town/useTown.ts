/**
 * The town's businesses as data, shared by the Town (Tycoon) and the Home management desk:
 * every learned word as a resident, and each open business's staff, rate and waiting yen.
 */
import { useMemo } from 'react';
import {
  buildingState,
  collect,
  pendingYen,
  ratePerHour,
  resident,
  type Resident,
} from '../../engine/town';
import { daysAway } from '../../engine/game';
import { cardsOf, districtStates, spiritStage, type DistrictState } from '../../engine/world';
import type { Building } from '../../schema/town';
import type { SaveState } from '../../schema/save';
import type { Ctx } from '../../engine/game';
import { useGame } from '../../foundations/store/gameStore';
import { districts, spirits, townData } from '../../foundations/world';
import { useSave } from '../hooks';

/** Every learned word as a town resident (memory stage, rarity, power), strongest first. */
export function useResidents(now: number): Map<string, Resident> {
  const save = useSave();
  const index = useGame((s) => s.index);
  const scheduler = useGame((s) => s.scheduler)!;
  // Stages change slowly: recompute once a minute, not on every one-second tick.
  const minute = Math.floor(now / 60_000);
  return useMemo(() => {
    const at = minute * 60_000;
    const ids = [...new Set(Object.keys(save.cards).map((k) => k.split('#')[0]!))];
    const out = new Map<string, Resident>();
    for (const id of ids) {
      const item = index.item(id);
      if (!item) continue;
      const stage = spiritStage(cardsOf(save, id), at, scheduler, save.boosts.omamori[id] ?? 0);
      out.set(id, resident(save, item, stage, townData, spirits));
    }
    return out;
  }, [save, index, scheduler, minute]);
}

export interface Business {
  b: Building;
  level: number;
  staff: (Resident | undefined)[];
  staffIds: (string | null)[];
  rate: number;
  pending: number;
}

export function useBusinesses(states: DistrictState[], now: number) {
  const save = useSave();
  const residents = useResidents(now);
  const open = new Set(states.filter((s) => s.restored).map((s) => s.district.id));
  const list: Business[] = townData.buildings
    .filter((b) => open.has(b.district))
    .map((b) => {
      const st = buildingState(save, b, townData);
      const staff = st.staff.map((id) => (id ? residents.get(id) : undefined));
      const rate = ratePerHour(b, st.level, staff, townData);
      return {
        b,
        level: st.level,
        staff,
        staffIds: st.staff,
        rate,
        pending: pendingYen(rate, st.collectedAt, now, townData),
      };
    });
  return { list, residents };
}

/** District states (restored, lit) for the current save and time. */
export function useDistrictStates(now: number): DistrictState[] {
  const save = useSave();
  const index = useGame((s) => s.index);
  const clock = useGame((s) => s.clock);
  const away = daysAway(save, { now, timeZone: clock.timeZone() });
  return districtStates(save, index, districts, away);
}

/** Banks every open business's waiting yen; returns the new save and the yen collected. */
export function collectAllTown(save: SaveState, c: Ctx, list: Business[]) {
  let s = save;
  let yen = 0;
  for (const biz of list) {
    const r = collect(s, c, biz.b, biz.rate, townData);
    s = r.save;
    yen += r.yen;
  }
  return { save: s, yen };
}
