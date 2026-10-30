/**
 * Gachapon case opening, in the spirit of a case-opening reel: the capsule pops, a strip of
 * prizes races past a gold marker, decelerates, crawls and stops on the prize the pull already
 * decided. Every card that crosses the marker ticks (sound and haptic). The reveal escalates by
 * rarity: a crisp pop for common, a light pillar and shockwave for rare, and for legendary a
 * slow-motion crawl, a dimmed screen, gold rays, a double shockwave, a shake and fireworks.
 */
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import type { Reel } from '../../engine/gachaReel';
import type { Rarity } from '../../engine/gacha';
import { haptic } from '../haptics/haptics';
import { playSfx } from '../audio/sfx';
import { fx } from '../fx/fx';
import './case.css';

const CARD = 104;
const GAP = 10;
const SPIN_MS: Record<Rarity, number> = { common: 5200, rare: 5800, legendary: 7000 };
const REVEAL_HAPTIC = { common: 'pop', rare: 'rise', legendary: 'heartbeat' } as const;

export function CaseReel({
  reel,
  part,
  onReveal,
  onCollect,
}: {
  reel: Reel;
  part: (id: string) => ReactNode;
  onReveal: (rarity: Rarity) => void;
  onCollect: () => void;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const anim = useRef<Animation | null>(null);
  const [phase, setPhase] = useState<'spin' | 'reveal'>('spin');
  const rarity = reel.items[reel.win]?.rarity ?? 'common';
  const revealed = useRef(false);

  const reveal = () => {
    if (revealed.current) return;
    revealed.current = true;
    setPhase('reveal');
    haptic(REVEAL_HAPTIC[rarity]);
    playSfx(rarity === 'common' ? 'coin' : 'complete');
    if (rarity === 'legendary') {
      fx.slot('boss.defeat');
      window.setTimeout(() => fx.slot('level.up'), 250);
    } else if (rarity === 'rare') fx.slot('gacha.open');
    onReveal(rarity);
  };

  useLayoutEffect(() => {
    const el = strip.current!;
    const w = window.innerWidth;
    const step = CARD + GAP;
    const end = w / 2 - (reel.win * step + reel.landing * CARD);
    const start = w / 2 - step * 1.5;
    const duration = SPIN_MS[rarity];
    // Fast launch, long deceleration, and a final crawl that is slower still for legendaries.
    const easing =
      rarity === 'legendary'
        ? 'cubic-bezier(0.06, 0.62, 0.04, 1)'
        : 'cubic-bezier(0.1, 0.6, 0.12, 1)';
    const a = el.animate(
      [{ transform: `translateX(${start}px)` }, { transform: `translateX(${end}px)` }],
      {
        duration,
        easing,
        fill: 'forwards',
      },
    );
    anim.current = a;
    a.onfinish = reveal;

    // One tick per card crossing the marker, read from the live transform (never frame counts).
    let raf = 0;
    let lastIndex = -1;
    let lastTick = 0;
    const loop = (t: number) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      const index = Math.floor((w / 2 - m.m41) / step);
      if (index !== lastIndex) {
        lastIndex = index;
        if (t - lastTick > 45) {
          lastTick = t;
          playSfx('tap');
          haptic('tick');
        }
      }
      if (!revealed.current) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      a.cancel();
    };
    // the reel is fixed for this opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [collectable, setCollectable] = useState(false);
  useEffect(() => {
    if (phase !== 'reveal') return;
    const t = window.setTimeout(() => setCollectable(true), rarity === 'legendary' ? 1400 : 700);
    return () => window.clearTimeout(t);
  }, [phase, rarity]);

  return (
    <div
      className={`m-case m-case-${phase} m-case-${rarity}`}
      style={{ '--card': `${CARD}px`, '--gap': `${GAP}px` } as CSSProperties}
      onPointerDown={() => {
        // Tap while spinning: jump to the stop. Tap after the reveal: collect.
        if (phase === 'spin' && anim.current) anim.current.finish();
        else if (collectable) onCollect();
      }}
      role="dialog"
      aria-label="Opening a capsule"
    >
      <div className="m-case-dim" />
      <div className="m-case-rays" />
      <div className="m-case-window">
        <div ref={strip} className="m-case-strip">
          {reel.items.map((it, i) => (
            <div
              key={i}
              className={`m-case-card m-r-${it.rarity} ${i === reel.win ? 'm-case-win' : ''}`}
            >
              <span className="m-case-art">{part(it.id)}</span>
              <span className="m-case-bar" />
            </div>
          ))}
        </div>
        <span className="m-case-marker" />
      </div>
      <div className="m-case-shock m-case-shock-1" />
      <div className="m-case-shock m-case-shock-2" />
      <p className="m-case-title" aria-live="polite">
        {phase === 'spin'
          ? 'Tap to skip'
          : rarity === 'legendary'
            ? 'LEGENDARY!'
            : rarity === 'rare'
              ? 'Rare!'
              : 'Common'}
      </p>
      {collectable && <p className="m-case-collect">Tap to collect</p>}
    </div>
  );
}
