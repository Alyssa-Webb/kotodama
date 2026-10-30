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
import { avatarParts, economy, koto, shop } from '../../foundations/world';
import { YenIcon } from '../../foundations/art/icons';
import { ItemArt } from '../../foundations/art/ItemArt';
import { JaText, SpeakableJa } from '../../foundations/japanese/Ja';
import { playSfx } from '../../foundations/audio/sfx';
import { useSave, useStats } from '../hooks';
import { centerOf, fx } from '../../foundations/fx/fx';
import { moments } from '../../foundations/moments/moments';
import { buildReel } from '../../engine/gachaReel';
import { toSurface } from '../../engine/text/furigana';
import { AvatarActor } from '../avatar/AvatarActor';
import { KotoSays } from '../tour/KotoSays';
import { PayCounter } from './PayCounter';
import { yenFurigana } from '../../engine/text/yen';
import type { AvatarPart } from '../../schema/world';
import type { ConsumableId } from '../../schema/world';

const ERR: Record<PurchaseError, string> = {
  'not-enough-yen': 'Not enough yen. Learn more to earn more.',
  'max-held': 'You already hold the maximum.',
  'unknown-item': 'Unknown item.',
  'not-allowed': 'Not allowed in this difficulty.',
  'no-broken-streak': 'Kintsugi mends a broken streak; yours is intact.',
  'window-closed': `Kintsugi only works within ${economy.penalties.kintsugiWindowHours} hours of the break.`,
  'hearts-full': 'Your hearts are already full.',
  'already-owned': 'You already own this.',
};

const gachaPool = avatarParts.filter((p) => p.gacha);

export function ShopScreen() {
  const save = useSave();
  const stats = useStats();
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  const scheduler = useGame((s) => s.scheduler)!;
  const navigate = useNavigate();
  const [msg, setMsg] = useState<string | null>(null);
  const [prize, setPrize] = useState<{ part: AvatarPart; duplicate: boolean } | null>(null);
  const [, setAvatarMood] = useState<'idle' | 'happy' | 'cheer'>('idle');
  const [, setReaction] = useState(0);
  const rules = economy.difficulty[save.settings.difficulty]!;

  const [opening, setOpening] = useState(false);
  // Checkout: count out the exact yen before a purchase goes through (setting: countYen).
  const [paying, setPaying] = useState<{
    item: string;
    price: number;
    pay: () => void;
  } | null>(null);
  const checkout = (item: string, price: number, pay: () => void) => {
    if (!save.settings.countYen || stats.yen < price) return pay();
    setPaying({ item, price, pay });
  };

  /** Every purchase is a moment: yen leave your purse, the item's badge flies to your avatar. */
  const celebrate = (name: string, from: Element | null) => {
    fx.slot('purchase', from);
    void moments.purchase(toSurface(name), centerOf(from)).then(() => {
      setAvatarMood('happy');
      setReaction((n) => n + 1);
    });
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
    celebrate(shop.consumables.find((c) => c.id === id)?.name ?? id, from);
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
    celebrate(shop.charms.find((c) => c.id === id)?.name ?? id, from);
    setMsg('Charm bought. Equip it on the Avatar screen.');
  };

  const spin = () => {
    const c = gctx();
    const s = useGame.getState().save!;
    if (balanceOf(s.ledger, 'token') < economy.gachapon.cost)
      return setMsg(
        'Koban, the gold gacha coins, come from boss wins, perfect lessons and clearing review debt.',
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
    const won = r.prize ? { part: r.prize, duplicate: r.duplicate } : null;
    setPrize(null);
    setOpening(true);
    playSfx('tap');
    // The case reel plays the reveal's sound and FX; the shop just shows what you won.
    const reveal = () => {
      setPrize(won);
      setOpening(false);
      setAvatarMood('cheer');
      setReaction((n) => n + 1);
    };
    if (!r.prize) return reveal();
    void moments.openCase(buildReel(economy, gachaPool, r.prize, r.rngState), reveal);
  };

  return (
    <div className="stack">
      {paying && (
        <PayCounter
          item={paying.item}
          price={paying.price}
          balance={stats.yen}
          onCancel={() => setPaying(null)}
          onPaid={() => {
            const pay = paying.pay;
            setPaying(null);
            pay();
          }}
        />
      )}
      <div className="row spread">
        <h1>Shop</h1>
        <span className="stat stat-yen">
          <YenIcon size={18} /> {stats.yen}
        </span>
      </div>
      <KotoSays lines={koto.shop} outfit="shopkeeper" role="shop" />
      <p className="muted small">
        Everything is bought with yen earned by learning. Each item's name joins your reviews.
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
                <ItemArt id={c.id} size={72} />
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
                  disabled={disabled || stats.yen < price}
                  onClick={(e) => {
                    const card = e.currentTarget.closest('.card');
                    checkout(c.en, price, () => purchase(c.id, card));
                  }}
                  aria-label={`Buy ${c.en} for ${price} yen`}
                >
                  ¥{price.toLocaleString('en-US')}
                </button>
                <span className="small price-ja" lang="ja">
                  <JaText text={yenFurigana(price)} />
                </span>
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
              <ItemArt id={c.id} size={72} />
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
                  disabled={stats.yen < c.price}
                  onClick={(e) => {
                    const card = e.currentTarget.closest('.card');
                    checkout(c.en, c.price!, () => charm(c.id, card));
                  }}
                >
                  ¥{c.price.toLocaleString('en-US')}
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
          <span className="pill pill-gold">{stats.tokens} koban</span>
        </div>
        <p className="small muted">
          Odds:{' '}
          {publishedOdds(economy)
            .map((o) => `${o.rarity} ${o.percent}%`)
            .join(' · ')}
          . Never a duplicate while new prizes remain; a rare is guaranteed within{' '}
          {economy.gachapon.pityAfter} spins. Never costs yen or money.
        </p>
        <button
          className="btn btn-indigo"
          disabled={stats.tokens < economy.gachapon.cost || opening}
          onClick={spin}
        >
          Spin ({economy.gachapon.cost} koban)
        </button>
        {opening && (
          <p className="center small muted" role="status">
            Tap the capsule to open it!
          </p>
        )}
        {prize && (
          <div className="card card-accent card-tight stack center" role="status">
            <AvatarActor
              mood="cheer"
              size={96}
              equipped={{ ...save.avatar.equipped, [prize.part.slot]: prize.part.id }}
            />
            <span className="big-ja">
              <JaText text={prize.part.name} />
            </span>
            <span>
              {prize.part.en} · {prize.part.gacha}
              {prize.duplicate ? ' (duplicate)' : ' · new!'}
            </span>
            {!prize.duplicate && save.avatar.equipped[prize.part.slot] !== prize.part.id && (
              <button
                className="btn btn-small btn-accent"
                onClick={() =>
                  commit({
                    ...useGame.getState().save!,
                    avatar: {
                      ...save.avatar,
                      equipped: { ...save.avatar.equipped, [prize.part.slot]: prize.part.id },
                    },
                  })
                }
              >
                Wear it
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
