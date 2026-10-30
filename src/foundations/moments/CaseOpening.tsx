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

interface SparkleSpec {
  dx: number;
  dy: number;
  scale: number;
  delay: number;
  rot: number;
}

const SPARKLES: SparkleSpec[] = [
  { dx: -74, dy: -62, scale: 1.05, delay: 0, rot: -18 },
  { dx: 78, dy: -56, scale: 0.95, delay: 40, rot: 22 },
  { dx: -86, dy: 14, scale: 0.85, delay: 80, rot: 15 },
  { dx: 88, dy: 18, scale: 1.1, delay: 60, rot: -24 },
  { dx: -52, dy: 68, scale: 0.9, delay: 110, rot: 28 },
  { dx: 56, dy: 64, scale: 0.95, delay: 90, rot: -14 },
  { dx: 0, dy: -88, scale: 1.2, delay: 30, rot: 12 },
  { dx: -112, dy: -28, scale: 0.8, delay: 130, rot: -30 },
  { dx: 114, dy: -24, scale: 0.85, delay: 150, rot: 26 },
  { dx: -36, dy: -82, scale: 0.78, delay: 170, rot: -10 },
  { dx: 40, dy: -80, scale: 0.82, delay: 190, rot: 18 },
  { dx: 0, dy: 84, scale: 1.0, delay: 120, rot: -20 },
];

interface ShowerSpec {
  kind: 'petal' | 'coin';
  left: number;
  dx: number;
  rot: number;
  delay: number;
  dur: number;
  scale: number;
}

const SHOWER: ShowerSpec[] = [
  { kind: 'petal', left: 7, dx: 28, rot: 220, delay: 0, dur: 1850, scale: 0.95 },
  { kind: 'coin', left: 14, dx: -18, rot: -190, delay: 90, dur: 1650, scale: 1.0 },
  { kind: 'petal', left: 22, dx: 36, rot: 260, delay: 40, dur: 1950, scale: 1.1 },
  { kind: 'coin', left: 29, dx: 14, rot: 175, delay: 180, dur: 1720, scale: 0.9 },
  { kind: 'petal', left: 36, dx: -26, rot: -240, delay: 120, dur: 1800, scale: 0.85 },
  { kind: 'coin', left: 43, dx: 20, rot: 210, delay: 30, dur: 1600, scale: 1.08 },
  { kind: 'petal', left: 50, dx: -32, rot: 280, delay: 220, dur: 1900, scale: 1.0 },
  { kind: 'coin', left: 57, dx: -16, rot: -205, delay: 70, dur: 1680, scale: 0.96 },
  { kind: 'petal', left: 64, dx: 30, rot: 235, delay: 150, dur: 1860, scale: 1.05 },
  { kind: 'coin', left: 71, dx: -22, rot: 195, delay: 250, dur: 1740, scale: 0.92 },
  { kind: 'petal', left: 78, dx: 24, rot: -250, delay: 60, dur: 1920, scale: 0.88 },
  { kind: 'coin', left: 85, dx: -14, rot: -180, delay: 140, dur: 1640, scale: 1.04 },
  { kind: 'petal', left: 92, dx: -28, rot: 215, delay: 200, dur: 1880, scale: 0.94 },
  { kind: 'petal', left: 18, dx: 22, rot: -210, delay: 340, dur: 1820, scale: 0.9 },
  { kind: 'coin', left: 48, dx: -20, rot: 230, delay: 380, dur: 1700, scale: 1.0 },
  { kind: 'petal', left: 82, dx: -24, rot: 245, delay: 310, dur: 1860, scale: 1.02 },
];

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
      <svg className="m-case-defs" width="0" height="0" aria-hidden="true">
        <defs>
          {/* Seigaiha (青海波) concentric wave pattern for common & rare card backs */}
          <pattern id="m-pat-seigaiha" width="28" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M0 16 A14 14 0 0 1 28 16 M4 16 A10 10 0 0 1 24 16 M8 16 A6 6 0 0 1 20 16 M-14 8 A14 14 0 0 1 14 8 M-10 8 A10 10 0 0 1 10 8 M14 8 A14 14 0 0 1 42 8 M18 8 A10 10 0 0 1 38 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          </pattern>
          {/* Asanoha (麻の葉) geometric star lattice for legendary card backs & lacquer */}
          <pattern id="m-pat-asanoha" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M12 0 L24 12 L12 24 L0 12 Z M0 0 L24 24 M24 0 L0 24 M12 0 V24 M0 12 H24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.15"
              strokeLinejoin="round"
            />
          </pattern>
        </defs>
      </svg>

      <div className="m-case-dim">
        <div className="m-case-blackout" />
      </div>
      <div className="m-case-flash" aria-hidden="true" />
      <div className="m-case-rays" />
      <div className="m-case-rays m-case-rays-2" />
      <div className="m-case-pillar" aria-hidden="true">
        <span className="m-case-pillar-core" />
      </div>

      <div className="m-case-window">
        <span className="m-case-frame-glow" aria-hidden="true" />
        <span className="m-case-rail m-case-rail-top" aria-hidden="true" />
        <span className="m-case-rail m-case-rail-bot" aria-hidden="true" />
        <div ref={strip} className="m-case-strip">
          {reel.items.map((it, i) => (
            <div
              key={i}
              className={`m-case-card m-r-${it.rarity} ${i === reel.win ? 'm-case-win' : ''}`}
            >
              <svg className="m-case-card-pat" aria-hidden="true">
                <rect
                  width="100%"
                  height="100%"
                  fill={it.rarity === 'legendary' ? 'url(#m-pat-asanoha)' : 'url(#m-pat-seigaiha)'}
                />
              </svg>
              <span className="m-case-card-rim" aria-hidden="true" />
              <span className="m-case-card-shine" aria-hidden="true" />
              <span className="m-case-win-halo" aria-hidden="true" />
              <span className="m-case-art">{part(it.id)}</span>
              <span className="m-case-bar" />
              <span className="m-case-shimmer" aria-hidden="true" />
            </div>
          ))}
        </div>
        <span className="m-case-marker">
          <span className="m-case-marker-glow" />
          <span className="m-case-marker-core" />
          <span className="m-case-marker-gem m-case-marker-gem-top" />
          <span className="m-case-marker-gem m-case-marker-gem-bot" />
        </span>
      </div>

      <div className="m-case-shock m-case-shock-1" />
      <div className="m-case-shock m-case-shock-2" />

      {/* Sparkles for Common (sprinkle), Rare (floating blue) and Legendary (golden burst) */}
      <div className="m-case-sparkles" aria-hidden="true">
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className={`m-case-sparkle ${i < 6 ? 'm-sparkle-common' : 'm-sparkle-extra'}`}
            style={
              {
                '--sx': `${s.dx}px`,
                '--sy': `${s.dy}px`,
                '--s-scale': s.scale,
                '--s-delay': `${s.delay}ms`,
                '--s-rot': `${s.rot}deg`,
              } as CSSProperties
            }
          >
            <svg viewBox="0 0 28 28" width="26" height="26">
              <path
                className="m-sparkle-lip"
                d="M14 3.5 C15.8 10.5 19.5 14.2 26.5 16 C19.5 17.8 15.8 21.5 14 27.5 C12.2 21.5 8.5 17.8 1.5 16 C8.5 14.2 12.2 10.5 14 3.5 Z"
              />
              <path
                className="m-sparkle-body"
                d="M14 1.5 C15.8 8.5 19.5 12.2 26.5 14 C19.5 15.8 15.8 19.5 14 25.5 C12.2 19.5 8.5 15.8 1.5 14 C8.5 12.2 12.2 8.5 14 1.5 Z"
              />
              <ellipse
                className="m-sparkle-hi"
                cx="11.5"
                cy="10.5"
                rx="3.2"
                ry="1.8"
                transform="rotate(-28 11.5 10.5)"
              />
            </svg>
          </span>
        ))}
      </div>

      {/* Falling shower of gold petals and koban coins for Legendary reveal */}
      <div className="m-case-shower" aria-hidden="true">
        {SHOWER.map((item, i) => (
          <span
            key={i}
            className={`m-case-drop m-case-drop-${item.kind}`}
            style={
              {
                left: `${item.left}%`,
                '--dx': `${item.dx}px`,
                '--rot': `${item.rot}deg`,
                '--delay': `${item.delay}ms`,
                '--dur': `${item.dur}ms`,
                '--sc': item.scale,
              } as CSSProperties
            }
          >
            {item.kind === 'coin' ? (
              <svg viewBox="0 0 28 20" width="26" height="19">
                <ellipse
                  cx="14"
                  cy="11.2"
                  rx="12.5"
                  ry="8"
                  fill="color-mix(in srgb, var(--c-gold) 68%, var(--c-hud-bg))"
                />
                <ellipse cx="14" cy="9" rx="12.5" ry="8" fill="var(--c-glow)" />
                <ellipse
                  cx="14"
                  cy="9"
                  rx="9.4"
                  ry="5.6"
                  fill="none"
                  stroke="var(--c-gold)"
                  strokeWidth="1.3"
                  opacity="0.78"
                />
                <rect x="11" y="7" width="6" height="4" rx="1" fill="var(--c-gold)" />
                <ellipse
                  cx="9.5"
                  cy="5.6"
                  rx="3.8"
                  ry="1.6"
                  transform="rotate(-18 9.5 5.6)"
                  fill="var(--c-coin-shine)"
                  opacity="0.88"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 26 26" width="24" height="24">
                <path
                  d="M5 17.5 C4 9.5 11 4.5 21 7.5 L18.5 12 L22 14.5 C17 21.5 9.5 22.5 5 17.5 Z"
                  fill="color-mix(in srgb, var(--c-gold) 70%, var(--c-lacquer))"
                />
                <path
                  d="M5 15.5 C4 7.5 11 2.5 21 5.5 L18.5 10 L22 12.5 C17 19.5 9.5 20.5 5 15.5 Z"
                  fill="color-mix(in srgb, var(--c-glow) 82%, var(--c-petal))"
                />
                <ellipse
                  cx="11.5"
                  cy="9.2"
                  rx="4"
                  ry="1.8"
                  transform="rotate(-24 11.5 9.2)"
                  fill="var(--c-coin-shine)"
                  opacity="0.85"
                />
              </svg>
            )}
          </span>
        ))}
      </div>

      {/* Brushed calligraphy seal for Legendary reveal */}
      <div className="m-case-stamp" aria-hidden="true">
        <span className="m-case-stamp-ja" lang="ja">
          伝説
        </span>
      </div>

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
