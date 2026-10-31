/**
 * The town's businesses: each restored district runs one, staffed by the spirits of words you've
 * learned. Shows income piling up live, lets you collect it, assign spirits to staff slots and
 * upgrade. All rules live in engine/town; this only renders and commits.
 */
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { balanceOf } from '../../engine/economy/ledger';
import { itemJapanese, itemMeaning } from '../../engine/pack/index';
import {
  assign,
  buildingState,
  collect,
  pendingYen,
  ratePerHour,
  resident,
  staffPower,
  upgrade,
  upgradeCost,
  type Resident,
} from '../../engine/town';
import { cardsOf, spiritStage, type DistrictState } from '../../engine/world';
import type { Building } from '../../schema/town';
import { useGame } from '../../foundations/store/gameStore';
import { districts, spirits, townData } from '../../foundations/world';
import { JaText, useJa } from '../../foundations/japanese/Ja';
import { haptic } from '../../foundations/haptics/haptics';
import { playSfx } from '../../foundations/audio/sfx';
import { fx } from '../../foundations/fx/fx';
import { SpiritArt, STAGE_LABEL } from '../collection/CollectionScreen';
import { useNow, useSave } from '../hooks';
import { TownMap, type TownMapSpot } from './TownMap';

const RARITY_CLASS = { common: '', rare: 'r-rare', epic: 'r-epic', legendary: 'r-legendary' };
const yenFmt = (n: number) => `¥${n.toLocaleString('en-US')}`;

/** Every learned word as a town resident (memory stage, rarity, power), strongest first. */
function useResidents(now: number): Map<string, Resident> {
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

interface Business {
  b: Building;
  level: number;
  staff: (Resident | undefined)[];
  staffIds: (string | null)[];
  rate: number;
  pending: number;
}

function useBusinesses(states: DistrictState[], now: number) {
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

export function Tycoon({ states }: { states: DistrictState[] }) {
  const save = useSave();
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  // A one-second tick so the waiting yen visibly counts up.
  const now = useNow(1000);
  const { list, residents } = useBusinesses(states, now);
  const [picking, setPicking] = useState<{ biz: Business; slot: number } | null>(null);
  // The district whose business sheet is open (tapped on the map).
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const total = list.reduce((a, x) => a + x.pending, 0);

  const collectOne = (biz: Business, el: Element | null) => {
    const r = collect(useGame.getState().save!, gctx(), biz.b, biz.rate, townData);
    commit(r.save);
    if (r.yen > 0) {
      haptic('pop');
      playSfx('coin');
      fx.text(`+${yenFmt(r.yen)}`, el, 'gold');
    }
  };
  const collectAll = (el: Element | null) => {
    let s = useGame.getState().save!;
    let got = 0;
    for (const biz of list) {
      const r = collect(s, gctx(), biz.b, biz.rate, townData);
      s = r.save;
      got += r.yen;
    }
    commit(s);
    if (got > 0) {
      haptic('rise');
      playSfx('complete');
      fx.text(`+${yenFmt(got)}`, el, 'gold');
    }
  };
  const doUpgrade = (biz: Business, el: Element | null) => {
    const r = upgrade(useGame.getState().save!, gctx(), biz.b, biz.rate, townData, (s) =>
      balanceOf(s.ledger, 'yen'),
    );
    if ('error' in r)
      return setMsg(
        r.error === 'max-level'
          ? `${biz.b.en} is fully upgraded.`
          : `Upgrading costs ${yenFmt(upgradeCost(biz.b, biz.level))}. Earn more in lessons or here.`,
      );
    commit(r.save);
    setMsg(null);
    haptic('rise');
    playSfx('complete');
    fx.text(`Level ${biz.level + 1}!`, el, 'gold');
  };

  const spots: TownMapSpot[] = states.map((st) => ({
    id: st.district.id,
    en: st.district.en,
    restored: st.restored,
    lit: st.lit,
    pending: list.find((x) => x.b.district === st.district.id)?.pending ?? 0,
  }));
  const openBiz = list.find((x) => x.b.district === open);
  const openState = states.find((st) => st.district.id === open);

  return (
    <section className="stack tycoon" aria-label="Town businesses">
      <div className="tycoon-bar">
        <p className="small muted">
          {list.length
            ? 'Tap a building to staff it with your word-spirits and collect what it earns.'
            : "Finish the Dojo on the Path to open the Station's ticket office."}
        </p>
        <button
          className="btn btn-gold btn-small"
          disabled={total <= 0}
          onClick={(e) => collectAll(e.currentTarget)}
        >
          Collect all {yenFmt(total)}
        </button>
      </div>
      <TownMap spots={spots} onOpen={setOpen} />
      {open &&
        createPortal(
          <div
            className="pay biz-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={openBiz?.b.en ?? openState?.district.en ?? 'District'}
            onClick={(e) => e.target === e.currentTarget && setOpen(null)}
          >
            <div className="pay-card stack">
              {msg && (
                <p className="banner" role="status">
                  {msg}
                </p>
              )}
              {openBiz ? (
                <BusinessCard
                  biz={openBiz}
                  onCollect={collectOne}
                  onUpgrade={doUpgrade}
                  onPick={(slot) => setPicking({ biz: openBiz, slot })}
                />
              ) : (
                <p>
                  {openState?.district.en} is still closed.{' '}
                  {openState?.district.restoredBy
                    ? `It opens when you finish its part of the story (${Math.round((openState.progress ?? 0) * 100)}% done).`
                    : 'It opens in a later chapter.'}
                </p>
              )}
              <p className="tiny muted">
                Words you remember well work hardest; a spirit whose type suits the trade gets a
                bonus. Income piles up for up to {townData.capHours} hours.
              </p>
              <button className="btn" onClick={() => setOpen(null)}>
                Close
              </button>
            </div>
          </div>,
          document.body,
        )}
      {picking && (
        <StaffPicker
          biz={picking.biz}
          slot={picking.slot}
          residents={residents}
          onClose={() => setPicking(null)}
          onPick={(itemId) => {
            const r = assign(
              useGame.getState().save!,
              gctx(),
              picking.biz.b,
              picking.biz.rate,
              picking.slot,
              itemId,
              townData,
            );
            if ('error' in r) return setMsg('That spirit already works somewhere else.');
            commit(r.save);
            haptic('pop');
            playSfx('tap');
            setPicking(null);
          }}
          busy={
            new Map(
              Object.entries(save.town.buildings).flatMap(([d, s]) =>
                s.staff.filter((x): x is string => !!x).map((x) => [x, d] as const),
              ),
            )
          }
        />
      )}
    </section>
  );
}

/** One business in its sheet: earnings, the staff slots and the upgrade. */
function BusinessCard({
  biz,
  onCollect,
  onUpgrade,
  onPick,
}: {
  biz: Business;
  onCollect: (biz: Business, el: Element | null) => void;
  onUpgrade: (biz: Business, el: Element | null) => void;
  onPick: (slot: number) => void;
}) {
  return (
    <article className="biz">
      <header className="biz-head">
        <div>
          <h3>
            {biz.b.en} <span className="pill">Lv {biz.level}</span>
          </h3>
          <p className="small muted">
            {districts.find((d) => d.id === biz.b.district)?.en.replace(/^The /, '')} · makes{' '}
            {biz.b.product.en} (<JaText text={biz.b.product.ja} />)
          </p>
        </div>
        <div className="biz-earn">
          <span className="biz-rate">{yenFmt(biz.rate)}/h</span>
          <button
            className="btn btn-gold btn-small"
            disabled={biz.pending <= 0}
            onClick={(e) => onCollect(biz, e.currentTarget)}
            aria-label={`Collect ${biz.pending} yen from ${biz.b.en}`}
          >
            {yenFmt(biz.pending)}
          </button>
        </div>
      </header>
      <div className="biz-staff">
        {biz.staffIds.map((id, slot) => {
          const r = biz.staff[slot];
          return (
            <button
              key={slot}
              className={`biz-slot ${r ? RARITY_CLASS[r.rarity] : 'empty'}`}
              onClick={() => onPick(slot)}
              aria-label={
                r
                  ? `${biz.b.roles[slot] ?? 'Staff'}: ${itemMeaning(r.item)}. Tap to change.`
                  : `Empty ${biz.b.roles[slot] ?? 'staff'} slot. Tap to assign a spirit.`
              }
            >
              <span className="biz-role">{biz.b.roles[slot] ?? 'Staff'}</span>
              {r && id ? (
                <>
                  <span className="biz-spirit">
                    <SpiritArt stage={r.stage} hue={r.species?.hue ?? 0} />
                  </span>
                  <span className="biz-word">
                    <JaText text={itemJapanese(r.item)} />
                  </span>
                  <span className="tiny muted">
                    {r.rarity} · {STAGE_LABEL[r.stage]}
                  </span>
                </>
              ) : (
                <span className="biz-plus" aria-hidden="true">
                  +
                </span>
              )}
            </button>
          );
        })}
      </div>
      <button
        className="btn btn-small biz-upgrade"
        disabled={biz.level >= biz.b.maxLevel}
        onClick={(e) => onUpgrade(biz, e.currentTarget)}
      >
        {biz.level >= biz.b.maxLevel
          ? 'Fully upgraded'
          : `Upgrade to Lv ${biz.level + 1} · ${yenFmt(upgradeCost(biz.b, biz.level))}`}
      </button>
    </article>
  );
}

function StaffPicker({
  biz,
  slot,
  residents,
  busy,
  onPick,
  onClose,
}: {
  biz: Business;
  slot: number;
  residents: Map<string, Resident>;
  busy: Map<string, string>;
  onPick: (itemId: string | null) => void;
  onClose: () => void;
}) {
  const { speak } = useJa();
  const current = biz.staffIds[slot];
  const rows = [...residents.entries()]
    .map(([id, r]) => ({ id, r, out: staffPower(r, biz.b, townData) }))
    .sort((a, b) => b.out - a.out);
  // Portalled so no transformed ancestor can pull the sheet off-screen.
  return createPortal(
    <div className="pay biz-picker" role="dialog" aria-modal="true" aria-label="Choose a spirit">
      <div className="pay-card stack">
        <p className="eyebrow">
          {biz.b.en} · {biz.b.roles[slot] ?? 'Staff'}
        </p>
        <p className="small muted">
          Best fits first. A spirit's output is its rarity times how well you remember its word.
        </p>
        {!rows.length && <p>Learn some words in a lesson to wake your first spirits.</p>}
        <div className="biz-list">
          {rows.map(({ id, r, out }) => {
            const where = busy.get(id);
            const elsewhere = where && !(where === biz.b.district && id === current);
            const fits = r.species && biz.b.affinity.includes(r.species.id);
            return (
              <button
                key={id}
                className={`biz-row ${RARITY_CLASS[r.rarity]} ${id === current ? 'on' : ''}`}
                disabled={!!elsewhere}
                onClick={() => {
                  speak(itemJapanese(r.item));
                  onPick(id);
                }}
              >
                <span className="biz-spirit">
                  <SpiritArt stage={r.stage} hue={r.species?.hue ?? 0} />
                </span>
                <span className="biz-row-main">
                  <JaText text={itemJapanese(r.item)} />
                  <span className="tiny muted">
                    {itemMeaning(r.item)} · {r.rarity} · {STAGE_LABEL[r.stage]}
                    {fits ? ' · good fit' : ''}
                    {elsewhere
                      ? ` · works at ${townData.buildings.find((b) => b.district === where)?.en}`
                      : ''}
                  </span>
                </span>
                <span className="biz-row-out">
                  {yenFmt(Math.round(biz.b.yenPerHour * (1 + 0.5 * (biz.level - 1)) * out))}/h
                </span>
              </button>
            );
          })}
        </div>
        <div className="row">
          {current && (
            <button className="btn btn-ghost" onClick={() => onPick(null)}>
              Empty this slot
            </button>
          )}
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
