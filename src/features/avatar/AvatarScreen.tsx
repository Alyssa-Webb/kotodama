import { useState } from 'react';
import { append, balanceOf } from '../../engine/economy/ledger';
import { today } from '../../engine/game';
import { AVATAR_SLOTS, type AvatarSlot } from '../../schema/world';
import { useGame } from '../../foundations/store/gameStore';
import { avatarParts, shop } from '../../foundations/world';
import { YenIcon } from '../../foundations/art/icons';
import { JaText } from '../../foundations/japanese/Ja';
import { AvatarActor } from './AvatarActor';
import { useSave } from '../hooks';

const LABEL: Record<AvatarSlot, string> = {
  base: 'Base',
  outfit: 'Outfit',
  headgear: 'Headgear',
  held: 'Held item',
  companion: 'Companion',
  belt: 'Belt',
  title: 'Title',
  charm: 'Charm',
};

export function AvatarScreen() {
  const save = useSave();
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  const [slot, setSlot] = useState<AvatarSlot>('outfit');
  const [poke, setPoke] = useState(0);
  const yen = balanceOf(save.ledger, 'yen');
  const parts = avatarParts.filter((p) => p.slot === slot);
  const title = avatarParts.find((p) => p.id === save.avatar.equipped.title);

  const buyPart = (id: string, price: number) => {
    const c = gctx();
    commit({
      ...save,
      ledger: append(save.ledger, c.now, today(save, c), [
        { asset: 'yen', amount: -price, reason: 'purchase', ref: id },
      ]),
      avatar: { ...save.avatar, owned: [...save.avatar.owned, id] },
    });
  };
  const equip = (s: AvatarSlot, id: string | undefined) => {
    const eq = Object.fromEntries(Object.entries(save.avatar.equipped).filter(([k]) => k !== s));
    if (id) eq[s] = id;
    commit({ ...save, avatar: { ...save.avatar, equipped: eq } });
  };

  return (
    <div className="stack">
      <h1>Avatar</h1>
      <section className="card stack center avatar-stage">
        <button
          className="avatar-stage-actor"
          onClick={() => setPoke((n) => n + 1)}
          aria-label="Your avatar (tap to wave)"
        >
          <AvatarActor mood={poke ? 'happy' : 'idle'} reaction={poke} size={150} />
        </button>
        {title && (
          <p className="pill pill-gold" style={{ alignSelf: 'center' }}>
            <JaText text={title.name} /> · {title.en}
          </p>
        )}
      </section>
      <div className="seg" role="tablist" aria-label="Slots">
        {AVATAR_SLOTS.filter((s) => s !== 'belt' && s !== 'base').map((s) => (
          <button
            key={s}
            role="tab"
            className="btn btn-small"
            aria-pressed={slot === s}
            aria-selected={slot === s}
            onClick={() => setSlot(s)}
          >
            {LABEL[s]}
          </button>
        ))}
      </div>
      {slot === 'charm' ? (
        <div className="shop-grid">
          {shop.charms.map((c) => {
            const owned = save.charms.owned.includes(c.id);
            return (
              <div key={c.id} className="card card-tight stack">
                <strong>{c.en}</strong>
                <span className="big-ja" lang="ja">
                  <JaText text={c.name} />
                </span>
                <span className="small">{c.perk}</span>
                {owned ? (
                  <button
                    className="btn btn-small"
                    aria-pressed={save.charms.equipped === c.id}
                    onClick={() =>
                      commit({
                        ...save,
                        charms: {
                          ...save.charms,
                          equipped: save.charms.equipped === c.id ? null : c.id,
                        },
                      })
                    }
                  >
                    {save.charms.equipped === c.id ? 'Equipped' : 'Equip'}
                  </button>
                ) : (
                  <span className="muted tiny">{c.price ? 'Buy in the Shop' : c.unlock}</span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="shop-grid">
          {slot !== 'outfit' && (
            <button className="card card-tight" onClick={() => equip(slot, undefined)}>
              None
            </button>
          )}
          {parts.map((p) => {
            const owned =
              save.avatar.owned.includes(p.id) || p.free || save.gacha.owned.includes(p.id);
            const on = save.avatar.equipped[slot] === p.id;
            return (
              <div key={p.id} className="card card-tight stack" style={{ gap: 'var(--sp-2)' }}>
                {p.svg && (
                  <svg
                    viewBox="0 0 100 120"
                    width="52"
                    height="62"
                    aria-hidden="true"
                    style={{ alignSelf: 'center' }}
                  >
                    <g dangerouslySetInnerHTML={{ __html: p.svg }} />
                  </svg>
                )}
                <strong>{p.en}</strong>
                <span className="big-ja" lang="ja">
                  <JaText text={p.name} />
                </span>
                {owned ? (
                  <button
                    className="btn btn-small"
                    aria-pressed={on}
                    onClick={() => equip(slot, p.id)}
                  >
                    {on ? 'Equipped' : 'Equip'}
                  </button>
                ) : p.price !== undefined ? (
                  <button
                    className="btn btn-small btn-gold"
                    disabled={yen < p.price}
                    onClick={() => buyPart(p.id, p.price!)}
                  >
                    <YenIcon size={18} /> {p.price}
                  </button>
                ) : (
                  <span className="muted tiny">{p.gacha ? 'Gachapon' : p.unlock}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
