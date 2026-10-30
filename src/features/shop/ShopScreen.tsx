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
import { cardIdsFor } from '../../engine/game';
import { shopWordItem, useGame } from '../../foundations/store/gameStore';
import { avatarParts, economy, shop } from '../../foundations/world';
import { JaText, SpeakableJa } from '../../foundations/japanese/Ja';
import { playSfx } from '../../foundations/audio/sfx';
import { useSave, useStats } from '../hooks';
import type { ConsumableId } from '../../schema/world';

const ERR: Record<PurchaseError, string> = {
  'not-enough-koban': 'Not enough koban. Learn more to earn more.',
  'max-held': 'You already hold the maximum.',
  'unknown-item': 'Unknown item.',
  'not-allowed': 'Not allowed in this difficulty.',
  'no-broken-streak': 'Kintsugi mends a broken streak; yours is intact.',
  'window-closed': 'Kintsugi only works within 48 hours of the break.',
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

  const purchase = (id: ConsumableId) => {
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
    setMsg(
      id === 'kintsugi' && rules.kintsugiTrial
        ? 'Kintsugi bought. Pass the Redemption Trial to mend your streak.'
        : 'Bought!',
    );
    if (id === 'kintsugi' && rules.kintsugiTrial) navigate('/trial');
  };

  const buyCharm = (id: string, price: number) => {
    const c = gctx();
    if (balanceOf(save.ledger, 'koban') < price) return setMsg(ERR['not-enough-koban']);
    commit({
      ...save,
      ledger: append(save.ledger, c.now, today(save, c), [
        { asset: 'koban', amount: -price, reason: 'purchase', ref: `charm:${id}` },
      ]),
      charms: { ...save.charms, owned: [...save.charms.owned, id] },
    });
    playSfx('coin');
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
    playSfx('kiai');
    setPrize(
      r.prize ? `${r.prize.name}|${r.prize.en}|${r.prize.gacha}|${r.duplicate ? 'dup' : ''}` : null,
    );
  };

  return (
    <div className="stack">
      <div className="row spread">
        <h1>Shop</h1>
        <span className="stat stat-koban">◎ {stats.koban}</span>
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
                  onClick={() => purchase(c.id)}
                  aria-label={`Buy ${c.en} for ${price} koban`}
                >
                  ◎ {price}
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
                  onClick={() => buyCharm(c.id, c.price!)}
                >
                  ◎ {c.price}
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
          disabled={stats.tokens < economy.gachapon.cost}
          onClick={spin}
        >
          Spin ({economy.gachapon.cost} token)
        </button>
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
