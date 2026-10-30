import { useState } from 'react';
import { useNavigate } from 'react-router';
import { append, balanceOf } from '../../engine/economy/ledger';
import {
  applyKintsugi,
  buy,
  kintsugiAvailable,
  priceOf,
  today,
  type PurchaseError,
} from '../../engine/game';
import { publishedOdds, pull } from '../../engine/gacha';
import { buyCharm, cardIdsFor } from '../../engine/game';
import { shopWordItem, useGame } from '../../foundations/store/gameStore';
import { avatarParts, economy, shop } from '../../foundations/world';
import { KobanIcon } from '../../foundations/art/icons';
import { JaText, SpeakableJa } from '../../foundations/japanese/Ja';
import { playSfx } from '../../foundations/audio/sfx';
import { useSave, useStats } from '../hooks';
import { ToyView } from '../../foundations/toy/ToyView';
import { toy } from '../../foundations/toy/toy';
import { centerOf, fx } from '../../foundations/fx/fx';
import type { ConsumableId } from '../../schema/world';

const ERR: Record<PurchaseError, string> = {
  'not-enough-koban': 'Not enough koban. Learn more to earn more.',
  'max-held': 'You already hold the maximum.',
  'unknown-item': 'Unknown item.',
  'not-allowed': 'Not allowed in this difficulty.',
  'no-broken-streak': 'Kintsugi mends a broken streak; yours is intact.',
  'window-closed': `Kintsugi only works within ${economy.penalties.kintsugiWindowHours} hours of the break.`,
  'hearts-full': 'Your hearts are already full.',
  'already-owned': 'You already own this.',
};

export function ShopScreen() {
  const save = useSave();
  const stats = useStats();
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  const scheduler = useGame((s) => s.scheduler)!;
  const navigate = useNavigate();
  const [msg, setMsg] = useState<string | null>(null);
  const [prize, setPrize] = useState<string | null>(null);
  const rules = economy.difficulty[save.settings.difficulty]!;

  const [opening, setOpening] = useState(false);

  /** Every purchase is a moment: the toy leaps out of its card under a gold ring. */
  const celebrate = (id: string, from: Element | null) => {
    fx.slot('purchase', from);
    void toy.reveal(id, centerOf(from));
  };

  const purchase = (id: ConsumableId, from: Element | null) => {
    const r = buy(useGame.getState().save!, gctx(), shop, id);
    if ('error' in r) return setMsg(ERR[r.error]);
    // The item's Japanese name joins your reviews as a new word.
    const word = shopWordItem(id);
    let next = r.save;
    if (word && !Object.keys(next.cards).some((k) => k.startsWith(`${word.id}#`))) {
      const cards = { ...next.cards };
      for (const cid of cardIdsFor(word)) cards[cid] = scheduler.newCard(gctx().now);
      next = { ...next, cards };
    }
    if (id === 'kintsugi' && !rules.kintsugiTrial)
      next = applyKintsugi(next, gctx(), false) ?? next;
    commit(next);
    playSfx('coin');
    celebrate(id, from);
    setMsg(
      id === 'kintsugi' && rules.kintsugiTrial
        ? 'Kintsugi bought. Pass the Redemption Trial to mend your streak.'
        : 'Bought!',
    );
    if (id === 'kintsugi' && rules.kintsugiTrial) navigate('/trial');
  };

  const charm = (id: string, from: Element | null) => {
    const r = buyCharm(useGame.getState().save!, gctx(), shop, id);
    if ('error' in r) return setMsg(ERR[r.error]);
    commit(r.save);
    playSfx('coin');
    celebrate(id, from);
    setMsg('Charm bought. Equip it on the Avatar screen.');
  };

  const spin = () => {
    const c = gctx();
    const s = useGame.getState().save!;
    if (balanceOf(s.ledger, 'token') < economy.gachapon.cost)
      return setMsg(
        'Capsule tokens come from boss wins, perfect lessons and clearing review debt.',
      );
    const r = pull(economy, avatarParts, s.gacha.owned, s.gacha.rngState, s.gacha.pity);
    commit({
      ...s,
      ledger: append(s.ledger, c.now, today(s, c), [
        {
          asset: 'token',
          amount: -economy.gachapon.cost,
          reason: 'gacha',
          ...(r.prize ? { ref: r.prize.id } : {}),
        },
      ]),
      gacha: {
        rngState: r.rngState,
        pity: r.pity,
        owned:
          r.prize && !s.gacha.owned.includes(r.prize.id)
            ? [...s.gacha.owned, r.prize.id]
            : s.gacha.owned,
      },
    });
    // The pull is already saved; the capsule only decides when the player gets to see it.
    const text = r.prize
      ? `${r.prize.name}|${r.prize.en}|${r.prize.gacha}|${r.duplicate ? 'dup' : ''}`
      : null;
    setPrize(null);
    setOpening(true);
    playSfx('tap');
    void toy.capsule(r.prize?.gacha ?? 'common', () => {
      playSfx('kiai');
      fx.slot('gacha.open');
      setPrize(text);
      setOpening(false);
    });
  };

  return (
    <div className="stack">
      <div className="row spread">
        <h1>Shop</h1>
        <span className="stat stat-koban">
          <KobanIcon size={18} /> {stats.koban}
        </span>
      </div>
      <p className="muted small">
        Everything is bought with koban earned by learning. Each item's name joins your reviews.
      </p>
      {msg && (
        <p className="banner" role="status">
          {msg}
        </p>
      )}
      {save.streak.broken &&
        kintsugiAvailable(save, gctx()) &&
        stats.inventory('kintsugi') > 0 &&
        rules.kintsugiTrial && (
          <button className="btn btn-gold btn-block" onClick={() => navigate('/trial')}>
            Take the Redemption Trial to mend your {save.streak.broken.length}-day streak
          </button>
        )}
      <section className="stack">
        <h2>Consumables</h2>
        <div className="grid-2">
          {shop.consumables.map((c) => {
            const price = priceOf(save, shop, c.id) ?? c.price;
            const held = stats.inventory(c.id);
            const disabled =
              (c.id === 'onigiri' && !rules.onigiri) ||
              (c.id === 'kintsugi' && !kintsugiAvailable(save, gctx()));
            return (
              <div key={c.id} className="card card-tight stack" style={{ gap: 'var(--sp-2)' }}>
                <ToyView item={c.id} size={88} />
                <div className="row spread">
                  <span className="big-ja">
                    <SpeakableJa text={c.name} />
                  </span>
                  {held > 0 && <span className="pill">×{held}</span>}
                </div>
                <strong>{c.en}</strong>
                <span className="small muted">{c.effect}</span>
                <button
                  className="btn btn-small btn-gold"
                  disabled={disabled || stats.koban < price}
                  onClick={(e) => purchase(c.id, e.currentTarget.closest('.card'))}
                  aria-label={`Buy ${c.en} for ${price} koban`}
                >
                  <KobanIcon size={18} /> {price}
                </button>
              </div>
            );
          })}
        </div>
      </section>
      <section className="stack">
        <h2>Charms</h2>
        <div className="grid-2">
          {shop.charms.map((c) => (
            <div key={c.id} className="card card-tight stack" style={{ gap: 'var(--sp-2)' }}>
              <ToyView item={c.id} size={88} />
              <span className="big-ja">
                <SpeakableJa text={c.name} />
              </span>
              <strong>{c.en}</strong>
              <span className="small muted">{c.perk}</span>
              {save.charms.owned.includes(c.id) ? (
                <span className="pill pill-success">Owned</span>
              ) : c.price !== undefined ? (
                <button
                  className="btn btn-small btn-gold"
                  disabled={stats.koban < c.price}
                  onClick={(e) => charm(c.id, e.currentTarget.closest('.card'))}
                >
                  <KobanIcon size={18} /> {c.price}
                </button>
              ) : (
                <span className="muted tiny">{c.unlock}</span>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="card stack" aria-label="Gachapon">
        <div className="row spread">
          <h2>
            <JaText text="ガチャポン" /> Gachapon
          </h2>
          <span className="pill pill-gold">{stats.tokens} token(s)</span>
        </div>
        <p className="small muted">
          Odds:{' '}
          {publishedOdds(economy)
            .map((o) => `${o.rarity} ${o.percent}%`)
            .join(' · ')}
          . Never a duplicate while new prizes remain; a rare is guaranteed within{' '}
          {economy.gachapon.pityAfter} spins. Never costs koban or money.
        </p>
        <button
          className="btn btn-indigo"
          disabled={stats.tokens < economy.gachapon.cost || opening}
          onClick={spin}
        >
          Spin ({economy.gachapon.cost} token)
        </button>
        {opening && (
          <p className="center small muted" role="status">
            Tap the capsule to open it!
          </p>
        )}
        {prize && (
          <p className="card card-accent card-tight center" role="status">
            <span className="big-ja">
              <JaText text={prize.split('|')[0]!} />
            </span>
            <br />
            {prize.split('|')[1]} · {prize.split('|')[2]}
            {prize.split('|')[3] ? ' (duplicate)' : ' · new! Equip it on the Avatar screen.'}
          </p>
        )}
      </section>
    </div>
  );
}
