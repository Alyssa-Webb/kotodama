/**
 * Renders moments from the bus. Each moment is a small SVG/DOM scene animated by CSS keyframes
 * (moments.css) or the Web Animations API, touching only transform and opacity. Timings come from
 * design/moments.json; colors from theme tokens, so light, dark and future art direction all apply.
 */
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import type { GateScene } from '../../schema/moments';
import type { Rarity } from '../../engine/gacha';
import { momentsConfig } from '../world';
import { haptic } from '../haptics/haptics';
import { onMoment, type MomentEvent, type Point } from './moments';
import { CaseReel } from './CaseOpening';
import type { Reel } from '../../engine/gachaReel';
import { cutFromSwipe, DEFAULT_SWIPE, isSwipe, type Cut, type Pt } from './cut';

/** The blade's impact frame in the gate timeline (design: 10–22% of --gate-ms is the stroke). */
const CUT_AT = 0.2;
/** How long the bushes wait for a swipe before the blade cuts by itself. */
const CUT_WAIT_MS = 4500;
import './moments.css';

export type ActorPose = 'walk' | 'happy' | 'cheer' | 'idle';
type Item = MomentEvent & { id: number };
let nextId = 1;

export function MomentsLayer({
  actor,
  part,
}: {
  actor: (pose: ActorPose) => ReactNode;
  /** Draws a gacha prize (an avatar part) for the case reel. */
  part: (id: string) => ReactNode;
}) {
  const [items, setItems] = useState<Item[]>([]);
  // A layout effect subscribes before any screen's effects run, so a training opened directly
  // by URL still gets its gate.
  useLayoutEffect(
    () =>
      onMoment((e) => {
        const item = { ...e, id: nextId++ } as Item;
        setItems((xs) => [
          ...xs.filter((x) => !(x.kind === item.kind && item.kind !== 'slot')),
          item,
        ]);
      }),
    [],
  );
  const remove = (id: number) => setItems((xs) => xs.filter((x) => x.id !== id));
  return (
    <div className="moments-layer">
      {items.map((m) => {
        const end = () => remove(m.id);
        switch (m.kind) {
          case 'slot':
            return <SlotMoment key={m.id} name={m.name} at={m.at} onEnd={end} />;
          case 'gate':
            return <Gate key={m.id} scene={m.scene} actor={actor} done={m.done} onEnd={end} />;
          case 'finish':
            return <Finish key={m.id} done={m.done} onEnd={end} />;
          case 'case':
            return (
              <CaseMoment
                key={m.id}
                reel={m.reel}
                part={part}
                onReveal={m.onReveal}
                done={m.done}
                onEnd={end}
              />
            );
          case 'purchase':
            return <Purchase key={m.id} label={m.label} from={m.from} done={m.done} onEnd={end} />;
        }
      })}
    </div>
  );
}

// ---------- small moments ----------

function SlotMoment({ name, at, onEnd }: { name: string; at: Point; onEnd: () => void }) {
  switch (name) {
    case 'maru':
      return <Maru at={at} onEnd={onEnd} />;
    case 'batsu':
      return <Batsu at={at} onEnd={onEnd} />;
    case 'sweep':
      return <div className="m-sweep" onAnimationEnd={onEnd} />;
    case 'sunburst':
      return <Sunburst at={at} onEnd={onEnd} />;
    case 'coins':
      return <Coins from={at} to={targetOf('.stat-koban')} onEnd={onEnd} />;
    case 'slash':
      return <Slash at={at} onEnd={onEnd} />;
    default:
      return null;
  }
}

const place = (at: Point, size: number): CSSProperties => ({
  left: at.x - size / 2,
  top: at.y - size / 2,
  width: size,
  height: size,
});

/** The teacher's red 〇: a glossy, chunky brushed circle that overlaps itself where the brush lifts. */
function Maru({ at, onEnd }: { at: Point; onEnd: () => void }) {
  return (
    <svg
      className="m-maru"
      style={place(at, 156)}
      viewBox="0 0 100 100"
      onAnimationEnd={(e) => e.target === e.currentTarget && onEnd()}
    >
      <path
        className="m-stroke m-stroke-lip"
        pathLength={1}
        d="M58 15 C 84 19, 92 47, 84 67 C 74 91, 38 95, 20 77 C 4 61, 10 29, 34 18 C 44 14, 54 14, 62 17"
      />
      <path
        className="m-stroke"
        pathLength={1}
        d="M58 12 C 84 16, 92 44, 84 64 C 74 88, 38 92, 20 74 C 4 58, 10 26, 34 15 C 44 11, 54 11, 62 14"
      />
      <path
        className="m-stroke m-stroke-dry"
        pathLength={1}
        d="M60 15 C 82 20, 88 44, 81 62 C 72 84, 40 88, 23 72"
      />
      <path className="m-stroke m-stroke-hi" pathLength={1} d="M16 42 C 18 25, 32 14, 50 13" />
      <circle cx="69" cy="11" r="3" className="m-splat" />
      <circle cx="76" cy="16" r="1.8" className="m-splat" />
    </svg>
  );
}

/** The teacher's ✕, two quick glossy strokes. Firm, not punishing. */
function Batsu({ at, onEnd }: { at: Point; onEnd: () => void }) {
  return (
    <svg
      className="m-batsu"
      style={place(at, 128)}
      viewBox="0 0 100 100"
      onAnimationEnd={(e) => e.target === e.currentTarget && onEnd()}
    >
      <path className="m-stroke m-stroke-lip" pathLength={1} d="M22 23 C 40 43, 60 63, 80 85" />
      <path className="m-stroke" pathLength={1} d="M22 20 C 40 40, 60 60, 80 82" />
      <path className="m-stroke m-stroke-hi" pathLength={1} d="M24 21 C 35 33, 45 43, 52 51" />
      <path
        className="m-stroke m-stroke-lip m-stroke-2"
        pathLength={1}
        d="M80 21 C 62 41, 42 63, 20 87"
      />
      <path className="m-stroke m-stroke-2" pathLength={1} d="M80 18 C 62 38, 42 60, 20 84" />
      <path
        className="m-stroke m-stroke-hi m-stroke-2"
        pathLength={1}
        d="M78 19 C 67 31, 57 42, 48 52"
      />
    </svg>
  );
}

function Sunburst({ at, onEnd }: { at: Point; onEnd: () => void }) {
  const size = Math.max(window.innerWidth, window.innerHeight) * 1.4;
  return (
    <div
      className="m-sunburst"
      style={place(at, size)}
      onAnimationEnd={(e) => e.target === e.currentTarget && onEnd()}
    >
      <div className="m-sunburst-core" />
      <div className="m-rays" />
      <div className="m-rays m-rays-2" />
    </div>
  );
}

/** Katana slash for a boss finish: a hairline cut across the screen, then the cut flares. */
function Slash({ at, onEnd }: { at: Point; onEnd: () => void }) {
  return (
    <div
      className="m-slash"
      style={{ top: at.y }}
      onAnimationEnd={(e) => e.target === e.currentTarget && onEnd()}
    >
      <div className="m-slash-glow" />
      <div className="m-slash-edge" />
      <div className="m-slash-line" />
      <div className="m-slash-spark" />
    </div>
  );
}

function targetOf(selector: string): Point | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!r.width) return null;
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** Koban fly in arcs from `from` to `to` (the koban counter), each landing with a tick. */
function Coins({
  from,
  to,
  onEnd,
  count = 9,
  reverse = false,
}: {
  from: Point;
  to: Point | null;
  onEnd: () => void;
  count?: number;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const target = to ?? { x: from.x, y: -40 };
    const a = reverse ? target : from;
    const b = reverse ? from : target;
    const nodes = [...(ref.current?.children ?? [])] as HTMLElement[];
    let left = nodes.length;
    const anims = nodes.map((n, i) => {
      const spread = (i - (nodes.length - 1) / 2) * 22;
      const tilt = (i % 2 === 0 ? 1 : -1) * (14 + (i % 3) * 8);
      const mid = {
        x: (a.x + b.x) / 2 + spread * 2.2,
        y: Math.min(a.y, b.y) - 90 - Math.abs(spread),
      };
      const anim = n.animate(
        [
          {
            transform: `translate(${a.x}px, ${a.y}px) scale(0.3) rotate(${-tilt}deg)`,
            opacity: 0,
          },
          {
            transform: `translate(${a.x + spread}px, ${a.y - 30}px) scale(1.15) rotate(${tilt}deg)`,
            opacity: 1,
            offset: 0.2,
          },
          {
            transform: `translate(${mid.x}px, ${mid.y}px) scale(1.02) rotate(${-tilt * 0.5}deg)`,
            opacity: 1,
            offset: 0.55,
          },
          {
            transform: `translate(${b.x}px, ${b.y}px) scale(0.55) rotate(0deg)`,
            opacity: 0.9,
          },
        ],
        { duration: 720, delay: i * 45, easing: 'cubic-bezier(.45,.05,.55,.95)', fill: 'forwards' },
      );
      anim.onfinish = () => {
        if (i % 3 === 0) haptic('tick');
        if (--left === 0) onEnd();
      };
      return anim;
    });
    return () => anims.forEach((x) => x.cancel());
    // runs once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={ref} className="m-coins">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="m-coin">
          <svg viewBox="0 0 28 20" width="28" height="20" aria-hidden="true">
            <ellipse
              cx="14"
              cy="11"
              rx="12.5"
              ry="8.2"
              fill="color-mix(in srgb, var(--c-gold) 65%, var(--c-hud-bg))"
            />
            <ellipse cx="14" cy="9.2" rx="12.5" ry="8.2" fill="var(--c-glow)" />
            <ellipse
              cx="14"
              cy="9.2"
              rx="9.5"
              ry="5.8"
              fill="none"
              stroke="var(--c-gold)"
              strokeWidth="1.2"
              opacity="0.7"
            />
            <rect x="11" y="7.2" width="6" height="4" rx="1" fill="var(--c-gold)" />
            <ellipse
              cx="9.5"
              cy="5.8"
              rx="3.8"
              ry="1.6"
              transform="rotate(-18 9.5 5.8)"
              fill="var(--c-coin-shine)"
              opacity="0.85"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

// ---------- training gate ----------

interface ScrapSpec {
  x: number;
  y: number;
  dx: number;
  dy: number;
  rot: number;
  delay: number;
  kind: 'sprig' | 'leaf' | 'petal';
}

const SCRAP_KINDS: ScrapSpec['kind'][] = [
  'leaf',
  'sprig',
  'petal',
  'leaf',
  'sprig',
  'leaf',
  'sprig',
  'petal',
  'leaf',
];

function GateSlice({ cut }: { cut: Cut }) {
  const path = cut.points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ');
  const scraps = cut.scraps.map((sc, i) => ({ ...sc, kind: SCRAP_KINDS[i % SCRAP_KINDS.length]! }));
  return (
    <div className="m-gate-slice" aria-hidden="true">
      <svg className="m-blade-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Jagged organic cut seam that flares along the exact polygon split */}
        <g
          className="m-cut-seam-group"
          style={{ transformOrigin: `${cut.center[0]}% ${cut.center[1]}%` }}
        >
          <path d={path} className="m-cut-glow-outer" />
          <path d={path} className="m-cut-glow-mid" />
          <path d={path} className="m-cut-seam" />
        </g>

        {/* Blade corridor aligned to the player's swipe */}
        <g transform={`translate(${cut.center[0]} ${cut.center[1]}) rotate(${cut.angle})`}>
          {/* Soft trailing glow band */}
          <g className="m-blade-trail">
            <ellipse cx="0" cy="0" rx="68" ry="6.2" className="m-blade-wake-outer" />
            <path
              d="M-66 0 Q-18 -4.2 64 -0.6 L66 0.6 Q-18 4.2 -66 0 Z"
              className="m-blade-wake-mid"
            />
            <path
              d="M-64 0.3 L-48 -1.2 L-39 0.9 L-24 -1.4 L-14 0.8 L-2 -1.5 L8 1.1 L22 -1.3 L31 0.8 L46 -1.1 L64 0"
              className="m-blade-wake-jagged"
            />
          </g>

          {/* Fast bright blade streak sweeping across */}
          <g className="m-blade-streak">
            <ellipse cx="-6" cy="0" rx="34" ry="2.8" className="m-blade-streak-glow" />
            <path d="M-42 0 Q-4 -2.1 30 0 Q-4 2.1 -42 0 Z" className="m-blade-streak-core" />
            <ellipse cx="14" cy="-0.4" rx="12" ry="0.9" className="m-blade-streak-tip" />
          </g>
        </g>
      </svg>

      {/* Flying leaf scraps, cut sprigs, and petals sheared off along the jagged cut */}
      {scraps.map((s, i) => (
        <span
          key={i}
          className="m-leaf-scrap"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              '--dx': `${s.dx}px`,
              '--dy': `${s.dy}px`,
              '--rot': `${s.rot}deg`,
              '--scrap-delay': s.delay,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 36 36" width="34" height="34">
            {s.kind === 'sprig' && (
              <g>
                {/* Sheared bamboo sprig stem with diagonal cut nick */}
                <path d="M6 26 L27 11 L29 14 L9 29 Z" className="stalk-node" />
                <path d="M6 25 L26 10 L28 12.5 L8 27.5 Z" className="stalk-a" />
                {/* Two plump leaves attached to the cut sprig */}
                <path d="M17 17 C15 7 23 2 31 5 C28 13 22 17 17 17 Z" className="leaf-lip" />
                <path d="M17 15.5 C15 6 23 1 31 4 C28 12 22 15.5 17 15.5 Z" className="leaf-a" />
                <ellipse
                  cx="23"
                  cy="8.5"
                  rx="4.2"
                  ry="1.8"
                  transform="rotate(-28 23 8.5)"
                  className="leaf-hi"
                />
                <path d="M12 22 C4 20 1 13 6 7 C12 11 14 17 12 22 Z" className="leaf-b" />
              </g>
            )}
            {s.kind === 'leaf' && (
              <g>
                {/* Plump leaf sheared cleanly along a jagged diagonal edge */}
                <path d="M6 24 C6 11 18 4 31 8 L25 20 L19 18 L14 26 Z" className="leaf-lip" />
                <path d="M6 22 C6 9 18 2 31 6 L25 18 L19 16 L14 24 Z" className="leaf-a" />
                <ellipse
                  cx="17"
                  cy="11"
                  rx="5.5"
                  ry="2.4"
                  transform="rotate(-22 17 11)"
                  className="leaf-hi"
                />
              </g>
            )}
            {s.kind === 'petal' && (
              <g>
                {/* Sheared camellia petal */}
                <path
                  d="M9 22 C8 12 17 6 27 10 C27 20 19 26 9 22 Z"
                  fill="var(--c-lacquer)"
                  opacity="0.5"
                />
                <path d="M9 20 C8 10 17 4 27 8 C27 18 19 24 9 20 Z" fill="var(--c-petal)" />
                <ellipse
                  cx="17"
                  cy="12"
                  rx="4.2"
                  ry="1.8"
                  transform="rotate(-20 17 12)"
                  fill="var(--c-coin-shine)"
                  opacity="0.75"
                />
              </g>
            )}
          </svg>
        </span>
      ))}
    </div>
  );
}

function serratedCrown(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  lobes: number,
  seed: number,
): string {
  const pts: string[] = [];
  for (let i = 0; i < lobes; i++) {
    const a0 = (i / lobes) * Math.PI * 2;
    const aMid = ((i + 0.5) / lobes) * Math.PI * 2;
    const a1 = ((i + 1) / lobes) * Math.PI * 2;
    const wobble = 1 + Math.sin(seed * 3.7 + i * 2.3) * 0.08;
    const tipR = (i % 2 === 0 ? 1.12 : 1.04) * wobble;
    const valR = 0.8 * (1 + Math.cos(seed * 2.1 + i * 1.7) * 0.05);

    const vx0 = cx + Math.cos(a0) * rx * valR;
    const vy0 = cy + Math.sin(a0) * ry * valR;
    const tx = cx + Math.cos(aMid) * rx * tipR;
    const ty = cy + Math.sin(aMid) * ry * tipR - 3;
    const vx1 = cx + Math.cos(a1) * rx * valR;
    const vy1 = cy + Math.sin(a1) * ry * valR;

    const c1x = cx + Math.cos(a0 + 0.22 / lobes * Math.PI * 2) * rx * (tipR * 0.98);
    const c1y = cy + Math.sin(a0 + 0.22 / lobes * Math.PI * 2) * ry * (tipR * 0.98) - 2;
    const c2x = cx + Math.cos(aMid + 0.28 / lobes * Math.PI * 2) * rx * (tipR * 0.96);
    const c2y = cy + Math.sin(aMid + 0.28 / lobes * Math.PI * 2) * ry * (tipR * 0.96) - 2;

    if (i === 0) pts.push(`M${vx0.toFixed(1)} ${vy0.toFixed(1)}`);
    pts.push(
      `Q${c1x.toFixed(1)} ${c1y.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`,
      `Q${c2x.toFixed(1)} ${c2y.toFixed(1)} ${vx1.toFixed(1)} ${vy1.toFixed(1)}`,
    );
  }
  pts.push('Z');
  return pts.join(' ');
}

function PointedLeaf({
  x,
  y,
  len,
  w,
  angle,
  tone,
}: {
  x: number;
  y: number;
  len: number;
  w: number;
  angle: number;
  tone: string;
}) {
  const blade = `M0 0 C${-w * 0.95} ${-len * 0.28} ${-w * 1.05} ${-len * 0.62} ${-w * 0.42} ${-len * 0.78} L${-w * 0.58} ${-len * 0.76} C${-w * 0.28} ${-len * 0.9} -1.2 ${-len * 0.97} 0 ${-len} C1.2 ${-len * 0.97} ${w * 0.28} ${-len * 0.9} ${w * 0.58} ${-len * 0.76} L${w * 0.42} ${-len * 0.78} C${w * 1.05} ${-len * 0.62} ${w * 0.95} ${-len * 0.28} 0 0 Z`;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)})`}>
      <path d={blade} transform="translate(0 3.5)" className="leaf-lip" />
      <path d={blade} className={tone} />
      <path
        d={`M0 -3 L0 ${(-len * 0.82).toFixed(1)}`}
        className="leaf-vein"
      />
      <ellipse
        cx={(-w * 0.24).toFixed(1)}
        cy={(-len * 0.52).toFixed(1)}
        rx={(w * 0.26).toFixed(1)}
        ry={(len * 0.18).toFixed(1)}
        transform={`rotate(-12 ${(-w * 0.24).toFixed(1)} ${(-len * 0.52).toFixed(1)})`}
        className="leaf-hi"
      />
    </g>
  );
}

function LeafFan({
  cx,
  cy,
  scale,
  tilt,
  tones,
}: {
  cx: number;
  cy: number;
  scale: number;
  tilt: number;
  tones: readonly [string, string, string];
}) {
  const angles = [-64, -34, -6, 24, 54];
  const lengths = [38, 46, 52, 45, 36];
  const widths = [12, 14, 15.5, 14, 12];
  return (
    <g>
      {angles.map((a, i) => (
        <PointedLeaf
          key={i}
          x={cx + (i - 2) * 5 * scale}
          y={cy + Math.abs(i - 2) * 2.5 * scale}
          len={lengths[i]! * scale}
          w={widths[i]! * scale}
          angle={tilt + a}
          tone={tones[i % 3]!}
        />
      ))}
    </g>
  );
}

function Bushes({ side, depth }: { side: 'l' | 'r'; depth: 'near' | 'mid' }) {
  const mounds: [number, number, number, number, number, string, string][] =
    depth === 'near'
      ? [
          [56, 336, 92, 76, 11, 'leaf-b', 'leaf-a'],
          [178, 378, 98, 82, 12, 'leaf-a', 'leaf-fresh'],
          [226, 456, 86, 72, 10, 'leaf-b', 'leaf-a'],
          [66, 492, 108, 88, 12, 'leaf-a', 'leaf-fresh'],
          [164, 584, 116, 94, 13, 'leaf-b', 'leaf-a'],
          [44, 668, 124, 98, 13, 'leaf-a', 'leaf-fresh'],
          [194, 716, 112, 92, 12, 'leaf-b', 'leaf-a'],
          [110, 796, 136, 106, 14, 'leaf-a', 'leaf-fresh'],
        ]
      : [
          [70, 268, 88, 70, 10, 'leaf-deep', 'leaf-mid'],
          [182, 316, 92, 74, 11, 'leaf-mid', 'leaf-b'],
          [82, 392, 90, 74, 11, 'leaf-deep', 'leaf-mid'],
          [176, 458, 98, 80, 12, 'leaf-mid', 'leaf-b'],
          [58, 544, 102, 82, 12, 'leaf-deep', 'leaf-mid'],
          [202, 578, 92, 76, 11, 'leaf-mid', 'leaf-b'],
          [124, 648, 104, 86, 12, 'leaf-deep', 'leaf-mid'],
          [168, 742, 108, 88, 12, 'leaf-mid', 'leaf-b'],
        ];
  const mx = (x: number) => (side === 'l' ? x : 260 - x);
  const dir = side === 'l' ? 1 : -1;
  const fanTones: readonly [string, string, string] =
    depth === 'near'
      ? ['leaf-b', 'leaf-a', 'leaf-fresh']
      : ['leaf-deep', 'leaf-mid', 'leaf-b'];

  return (
    <svg
      className={`m-bush m-bush-${side} m-bush-${depth}`}
      viewBox="0 0 260 844"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* Serrated outer bamboo-grass (sasa) & fern sprays jutting from the edge */}
      {mounds.map(([x, y, rx, ry], i) => {
        const cx = mx(x!) + dir * (rx! * 0.68);
        const cy = y! - ry! * 0.28;
        return (
          <g key={`frond-${i}`}>
            <PointedLeaf
              x={cx}
              y={cy}
              len={54}
              w={13}
              angle={dir * (48 + (i % 3) * 8)}
              tone={depth === 'near' ? 'leaf-b' : 'leaf-mid'}
            />
            <PointedLeaf
              x={cx - dir * 8}
              y={cy + 18}
              len={46}
              w={12}
              angle={dir * (68 + (i % 2) * 7)}
              tone={depth === 'near' ? 'leaf-a' : 'leaf-b'}
            />
            <PointedLeaf
              x={cx - dir * 16}
              y={cy - 14}
              len={42}
              w={11}
              angle={dir * (26 + (i % 3) * 6)}
              tone={depth === 'near' ? 'leaf-fresh' : 'leaf-mid'}
            />
          </g>
        );
      })}

      {/* Woody branch stems peeking in lower crevices */}
      {[
        [94, 540, 132, 488],
        [146, 675, 192, 622],
        [72, 765, 118, 708],
      ].map(([x1, y1, x2, y2], i) => (
        <path
          key={`twig-${i}`}
          d={`M${mx(x1!)} ${y1} Q${mx((x1! + x2!) / 2)} ${y2! + 14} ${mx(x2!)} ${y2}`}
          className="bush-twig"
        />
      ))}

      {/* Layered serrated shrub crowns + clustered pointed leaf fans */}
      {mounds.map(([x, y, rx, ry, lobes, baseTone, topTone], i) => {
        const cx = mx(x!);
        const cy = y!;
        const seed = i + (side === 'l' ? 1 : 7) + (depth === 'near' ? 0 : 13);
        const mainPath = serratedCrown(cx, cy, rx!, ry!, lobes!, seed);
        const crownCx = cx - rx! * 0.14;
        const crownCy = cy - ry! * 0.18;
        const innerPath = serratedCrown(
          crownCx,
          crownCy,
          rx! * 0.68,
          ry! * 0.62,
          Math.max(8, lobes! - 2),
          seed + 3,
        );
        return (
          <g key={`mound-${i}`}>
            {/* Deep bottom shade band */}
            <path d={mainPath} transform="translate(0 13)" className="leaf-lip" />
            {/* Main serrated foliage mass */}
            <path d={mainPath} className={baseTone} />
            {/* Second tiered foliage crown */}
            <path d={innerPath} transform="translate(0 8)" className="leaf-lip" opacity="0.55" />
            <path d={innerPath} className={topTone} />
            {/* Soft top-left highlight */}
            <path
              d={`M${(cx - rx! * 0.56).toFixed(1)} ${(cy - ry! * 0.24).toFixed(1)} Q${(cx - rx! * 0.24).toFixed(1)} ${(cy - ry! * 0.62).toFixed(1)} ${(cx + rx! * 0.12).toFixed(1)} ${(cy - ry! * 0.44).toFixed(1)}`}
              className="leaf-hi-arc"
            />
            {/* Clustered leaf fan crowning the shrub */}
            <LeafFan
              cx={cx + dir * (rx! * 0.08)}
              cy={cy - ry! * 0.22}
              scale={depth === 'near' ? 0.96 : 0.8}
              tilt={dir * (i % 2 === 0 ? 12 : -8)}
              tones={fanTones}
            />
            <LeafFan
              cx={cx - dir * (rx! * 0.28)}
              cy={cy + ry! * 0.18}
              scale={depth === 'near' ? 0.82 : 0.68}
              tilt={-dir * 18}
              tones={fanTones}
            />
          </g>
        );
      })}

      {/* Mid-layer buds & distant berry clusters for depth */}
      {depth === 'mid' &&
        [
          [126, 338],
          [148, 492],
          [96, 608],
        ].map(([x, y], i) => {
          const cx = mx(x!);
          return (
            <g key={`bud-${i}`}>
              <circle cx={cx} cy={y! + 2} r="6.5" fill="var(--c-lacquer)" opacity="0.55" />
              <circle cx={cx} cy={y} r="6" fill="var(--c-petal)" opacity="0.85" />
              <circle cx={cx - 1.8} cy={y! - 1.8} r="2" fill="var(--c-coin-shine)" opacity="0.7" />
            </g>
          );
        })}

      {/* Near-layer camellia/sakura blossoms + glossy red nanten berry clusters */}
      {depth === 'near' && (
        <>
          {[
            [134, 388],
            [152, 548],
            [88, 658],
            [188, 704],
          ].map(([x, y], i) => {
            const cx = mx(x!);
            const cy = y!;
            return (
              <g key={`fl-${i}`}>
                {/* Dark blossom under-shadow */}
                <circle cx={cx} cy={cy + 3.5} r="15" fill="var(--c-lacquer)" opacity="0.5" />
                {/* Five notched sakura/tsubaki petals */}
                {[0, 72, 144, 216, 288].map((deg) => (
                  <path
                    key={deg}
                    d="M0 -2 C-6 -5 -8 -13 -3 -16 L0 -13 L3 -16 C8 -13 6 -5 0 -2 Z"
                    transform={`translate(${cx} ${cy}) rotate(${deg})`}
                    fill="var(--c-petal)"
                  />
                ))}
                {/* Top-left petal highlight */}
                <ellipse
                  cx={cx - 5}
                  cy={cy - 6}
                  rx="4.2"
                  ry="2"
                  transform={`rotate(-28 ${cx - 5} ${cy - 6})`}
                  fill="var(--c-coin-shine)"
                  opacity="0.75"
                />
                {/* Golden stamen center */}
                <circle cx={cx} cy={cy + 1} r="5.5" fill="var(--c-gold)" />
                <circle cx={cx} cy={cy} r="5" fill="var(--c-glow)" />
                <circle cx={cx - 1.6} cy={cy - 1.6} r="1.8" fill="var(--c-coin-shine)" />
              </g>
            );
          })}

          {/* Glossy red nanten berry clusters nestled among the leaves */}
          {[
            [82, 434],
            [196, 512],
            [132, 624],
            [74, 748],
            [162, 782],
          ].map(([x, y], i) => {
            const cx = mx(x!);
            const cy = y!;
            return (
              <g key={`berry-${i}`}>
                {[
                  [-6, 2, 5.2],
                  [5, 3, 5],
                  [0, -4, 5.5],
                  [-2, 6, 4.6],
                ].map(([bx, by, br], j) => (
                  <g key={j}>
                    <circle
                      cx={cx + bx!}
                      cy={cy + by! + 2}
                      r={br}
                      fill="var(--c-lacquer)"
                    />
                    <circle
                      cx={cx + bx!}
                      cy={cy + by!}
                      r={br}
                      fill="var(--c-accent)"
                    />
                    <circle
                      cx={cx + bx! - 1.5}
                      cy={cy + by! - 1.5}
                      r={br! * 0.34}
                      fill="var(--c-coin-shine)"
                      opacity="0.85"
                    />
                  </g>
                ))}
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}

function SceneArt({ scene }: { scene: GateScene }) {
  const bamboo = (x: number, h: number, w: number, k: number) => (
    <g
      key={`b${x}-${k}`}
      className="m-bamboo"
      style={{ animationDelay: `${-k * 0.7}s`, transformOrigin: `${x}px 700px` }}
    >
      {/* Stalk cylinder with right/bottom shade + left gloss highlight */}
      <rect x={x} y={700 - h} width={w + 2} height={h} rx={(w + 2) / 2} className="stalk-node" />
      <rect
        x={x}
        y={700 - h}
        width={w}
        height={h}
        rx={w / 2}
        className={k % 2 ? 'stalk-a' : 'stalk-b'}
      />
      <rect
        x={x + 2}
        y={700 - h + 8}
        width={Math.max(2.5, w * 0.24)}
        height={h - 16}
        rx={1.5}
        fill="var(--c-coin-shine)"
        opacity="0.38"
      />
      {/* Molded bamboo nodes */}
      {Array.from({ length: Math.floor(h / 68) }, (_, i) => (
        <g key={i}>
          <rect
            x={x - 2}
            y={700 - h + 38 + i * 68}
            width={w + 5}
            height="6.5"
            rx="3.2"
            className="stalk-node"
          />
          <rect
            x={x - 2}
            y={700 - h + 36 + i * 68}
            width={w + 4}
            height="4.5"
            rx="2.2"
            className="stalk-a"
          />
        </g>
      ))}
      {/* Plump bamboo leaf clusters */}
      <path
        d={`M${x + w / 2} ${725 - h} C${x + w / 2 + 24} ${705 - h} ${x + w / 2 + 48} ${712 - h} ${x + w / 2 + 58} ${730 - h} C${x + w / 2 + 34} ${734 - h} ${x + w / 2 + 14} ${730 - h} ${x + w / 2} ${725 - h}Z`}
        className="leaf-b"
      />
      <path
        d={`M${x + w / 2} ${720 - h} C${x + w / 2 + 24} ${700 - h} ${x + w / 2 + 46} ${707 - h} ${x + w / 2 + 56} ${724 - h} C${x + w / 2 + 32} ${728 - h} ${x + w / 2 + 14} ${725 - h} ${x + w / 2} ${720 - h}Z`}
        className="leaf-a"
      />
      <path
        d={`M${x + w / 2} ${746 - h} C${x + w / 2 - 24} ${730 - h} ${x + w / 2 - 44} ${738 - h} ${x + w / 2 - 54} ${756 - h} C${x + w / 2 - 30} ${758 - h} ${x + w / 2 - 12} ${752 - h} ${x + w / 2} ${746 - h}Z`}
        className="leaf-a"
      />
    </g>
  );

  const stoneLantern = (cx: number, y: number) => (
    <g key={`toro-${cx}`} className="m-toro">
      <rect
        x={cx - 14}
        y={y + 42}
        width="28"
        height="8"
        rx="4"
        fill="var(--c-hud-bg)"
        opacity="0.4"
      />
      <rect x={cx - 13} y={y + 39} width="26" height="8" rx="4" fill="var(--c-fog)" />
      <rect x={cx - 6} y={y + 22} width="12" height="19" rx="3" fill="var(--c-fog)" />
      <rect x={cx - 11} y={y + 18} width="22" height="6" rx="3" fill="var(--c-fog)" />
      <rect x={cx - 9} y={y + 6} width="18" height="13" rx="3" fill="var(--c-hud-bg)" />
      <rect x={cx - 5.5} y={y + 8.5} width="11" height="8" rx="2" fill="var(--c-glow)" />
      <path
        d={`M${cx - 18} ${y + 8} Q${cx} ${y - 6} ${cx + 18} ${y + 8} Z`}
        fill="color-mix(in srgb, var(--c-fog) 70%, var(--c-hud-bg))"
      />
      <path d={`M${cx - 17} ${y + 6} Q${cx} ${y - 7} ${cx + 17} ${y + 6} Z`} fill="var(--c-fog)" />
      <circle cx={cx} cy={y - 5} r="3.5" fill="var(--c-fog)" />
    </g>
  );

  return (
    <svg className="m-scene" viewBox="0 0 390 844" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="m-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--c-sky-top)' }} />
          <stop offset="0.55" style={{ stopColor: 'var(--c-sky-mid)' }} />
          <stop offset="1" style={{ stopColor: 'var(--c-sky-bottom)' }} />
        </linearGradient>
      </defs>
      <rect width="390" height="844" fill="url(#m-sky)" />

      {/* Sun / Moon with outer toy halo rings & top-left shine */}
      <circle cx="276" cy="224" r="92" className="m-sun-halo" />
      <circle cx="276" cy="224" r="68" className="m-sun-halo" />
      <circle cx="276" cy="224" r="50" className="m-sun" />
      <ellipse
        cx="258"
        cy="204"
        rx="16"
        ry="8"
        transform="rotate(-25 258 204)"
        fill="var(--c-coin-shine)"
        opacity="0.65"
      />

      {/* Molded toy clouds with bottom lips */}
      <g className="m-cloud">
        <path
          d="M36 202 C36 188 50 182 62 188 C68 176 88 176 96 188 C108 184 120 190 120 202 Z"
          fill="var(--c-sky-mid)"
          opacity="0.55"
        />
        <path
          d="M36 198 C36 184 50 178 62 184 C68 172 88 172 96 184 C108 180 120 186 120 198 Z"
          fill="var(--c-hud-ink)"
          opacity="0.75"
        />
        <path
          d="M270 318 C270 306 282 302 292 306 C298 296 314 296 320 306 C330 304 340 308 340 318 Z"
          fill="var(--c-hud-ink)"
          opacity="0.6"
        />
      </g>

      {/* Distant Mt. Fuji & rolling mountain ridges */}
      <path
        d="M55 540 C105 470 142 382 162 362 C172 354 184 354 194 362 C214 382 251 470 301 540 Z"
        className="m-mtn-far"
      />
      <path
        d="M137 404 C148 384 156 368 162 362 C172 354 184 354 194 362 C200 368 208 384 219 404 C209 409 202 401 195 407 C188 400 182 409 178 404 C172 409 166 400 159 407 C152 401 145 409 137 404 Z"
        fill="var(--c-hud-ink)"
        opacity="0.88"
      />
      <path
        d="M0 560 C48 495 95 488 138 518 C178 462 238 452 292 506 C330 472 364 468 390 486 V844 H0 Z"
        className="m-mtn-far"
        opacity="0.85"
      />
      <path
        d="M0 622 C65 568 128 572 178 602 C228 552 298 548 390 596 V844 H0 Z"
        className="m-mtn-near"
      />

      {/* Side framing bamboo stalks */}
      {[10, 48, 312, 346, 372].map((x, k) => bamboo(x, 430 + (k % 3) * 85, 14 + (k % 2) * 4, k))}

      {/* Ground clearing + perspective stepping-stone path */}
      <path d="M0 684 Q195 658 390 684 V844 H0 Z" className="m-ground-lip" />
      <path d="M0 692 Q195 666 390 692 V844 H0 Z" className="m-ground" />
      <path d="M166 676 Q195 672 224 676 L286 844 H104 Z" className="m-path" />
      {[
        [195, 706, 22, 7],
        [186, 732, 26, 8],
        [204, 760, 30, 9],
        [192, 792, 34, 10],
      ].map(([cx, cy, rx, ry], i) => (
        <g key={`st-${i}`}>
          <ellipse cx={cx} cy={cy! + 3} rx={rx} ry={ry} fill="var(--c-hud-bg)" opacity="0.35" />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="var(--c-surface-alt)" />
          <ellipse
            cx={cx! - 5}
            cy={cy! - 2}
            rx={rx! * 0.45}
            ry={ry! * 0.4}
            fill="var(--c-hud-ink)"
            opacity="0.45"
          />
        </g>
      ))}

      {/* SHRINE SCENE */}
      {scene === 'shrine' && (
        <g className="m-torii">
          {/* Stone steps */}
          {[0, 1, 2].map((i) => (
            <g key={`step-${i}`}>
              <rect
                x={124 - i * 8}
                y={668 + i * 10}
                width={142 + i * 16}
                height="9"
                rx="4"
                fill="color-mix(in srgb, var(--c-fog) 65%, var(--c-hud-bg))"
              />
              <rect
                x={124 - i * 8}
                y={665 + i * 10}
                width={142 + i * 16}
                height="7"
                rx="3.5"
                fill="var(--c-surface-alt)"
              />
            </g>
          ))}
          {stoneLantern(84, 628)}
          {stoneLantern(306, 628)}
          {/* Pillar stone pedestals */}
          <rect x="117" y="660" width="28" height="22" rx="6" fill="var(--c-hud-bg)" />
          <rect x="245" y="660" width="28" height="22" rx="6" fill="var(--c-hud-bg)" />
          {/* Main vermilion pillars with shade + gloss */}
          <rect x="122" y="458" width="20" height="210" rx="8" fill="var(--c-lacquer)" />
          <rect x="122" y="458" width="17" height="208" rx="7" fill="var(--c-accent)" />
          <rect
            x="125"
            y="468"
            width="4"
            height="186"
            rx="2"
            fill="var(--c-coin-shine)"
            opacity="0.38"
          />
          <rect x="248" y="458" width="20" height="210" rx="8" fill="var(--c-lacquer)" />
          <rect x="248" y="458" width="17" height="208" rx="7" fill="var(--c-accent)" />
          <rect
            x="251"
            y="468"
            width="4"
            height="186"
            rx="2"
            fill="var(--c-coin-shine)"
            opacity="0.38"
          />
          {/* Lower crossbeam (nuki) */}
          <rect x="102" y="497" width="186" height="17" rx="7" fill="var(--c-lacquer)" />
          <rect x="102" y="493" width="186" height="14" rx="6" fill="var(--c-accent)" />
          {/* Shimenawa sacred rope + paper shide */}
          <path
            d="M126 514 Q195 526 264 514"
            stroke="color-mix(in srgb, var(--c-gold) 70%, var(--c-hud-bg))"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M126 512 Q195 524 264 512"
            stroke="var(--c-glow)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeDasharray="8 6"
            fill="none"
          />
          {[152, 180, 210, 238].map((sx, i) => (
            <path
              key={i}
              d={`M${sx} 516 l-4 8 h6 l-4 9 l7 -7 h-6 l4 -10Z`}
              fill="var(--c-hud-ink)"
            />
          ))}
          {/* Center shrine plaque */}
          <rect x="181" y="466" width="28" height="36" rx="5" fill="var(--c-glow)" />
          <rect x="184" y="469" width="22" height="30" rx="3.5" fill="var(--c-hud-bg)" />
          <text
            x="195"
            y="490"
            textAnchor="middle"
            fill="var(--c-glow)"
            fontSize="16"
            fontWeight="900"
            lang="ja"
          >
            言
          </text>
          {/* Curved kasagi top lintel */}
          <path d="M88 456 Q195 436 302 456 L296 476 Q195 458 94 476 Z" fill="var(--c-lacquer)" />
          <path d="M88 452 Q195 432 302 452 L297 468 Q195 450 93 468 Z" fill="var(--c-accent)" />
          <path d="M84 446 Q195 424 306 446 L301 457 Q195 437 89 457 Z" className="m-torii-top" />
          <path
            d="M104 444 Q152 435 198 435"
            stroke="var(--c-coin-shine)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          />
        </g>
      )}

      {/* DOJO SCENE */}
      {scene === 'dojo' && (
        <g className="m-dojo">
          {/* Stone foundation & wooden engawa veranda */}
          <rect
            x="74"
            y="676"
            width="242"
            height="16"
            rx="6"
            fill="var(--c-hud-bg)"
            opacity="0.55"
          />
          <rect
            x="78"
            y="666"
            width="234"
            height="14"
            rx="5"
            fill="color-mix(in srgb, var(--c-gold) 65%, var(--c-hud-bg))"
          />
          <rect x="78" y="663" width="234" height="10" rx="4" fill="var(--c-panel-edge)" />
          {/* Main lacquered hall wall */}
          <rect x="86" y="552" width="218" height="116" rx="6" className="m-dojo-wall" />
          {/* Glowing shoji screens with lattice bars */}
          {[0, 1, 2, 3, 4].map((i) => {
            const sx = 98 + i * 40;
            return (
              <g key={i}>
                <rect x={sx} y="568" width="34" height="96" rx="4" fill="var(--c-hud-bg)" />
                <rect x={sx + 2} y="570" width="30" height="92" rx="3" className="m-shoji" />
                <rect
                  x={sx + 2}
                  y="626"
                  width="30"
                  height="36"
                  rx="3"
                  fill="var(--c-glow)"
                  opacity="0.35"
                />
                <path
                  d={`M${sx + 17} 570 V662 M${sx + 2} 600 H${sx + 32} M${sx + 2} 630 H${sx + 32}`}
                  stroke="var(--c-panel-edge)"
                  strokeWidth="1.6"
                  opacity="0.65"
                />
              </g>
            );
          })}
          {/* Sweeping tiled roof + upper gable */}
          <path
            d="M46 566 Q110 532 120 496 H270 Q280 532 344 566 Q195 554 46 566 Z"
            fill="var(--c-hud-bg)"
          />
          <path
            d="M48 560 Q112 528 122 494 H268 Q278 528 342 560 Q195 548 48 560 Z"
            className="m-dojo-roof"
          />
          <path d="M126 502 Q158 470 195 462 Q232 470 264 502 Z" className="m-dojo-roof" />
          <rect x="142" y="476" width="106" height="22" rx="8" fill="var(--c-hud-bg)" />
          <rect x="142" y="473" width="106" height="19" rx="8" className="m-dojo-roof" />
          {/* Golden roof finials (shachihoko) & ridge trim */}
          <circle cx="146" cy="470" r="6" fill="var(--c-glow)" />
          <circle cx="244" cy="470" r="6" fill="var(--c-glow)" />
          <rect x="164" y="471" width="62" height="4" rx="2" fill="var(--c-gold)" />
          <path
            d="M78 548 Q120 526 144 502"
            stroke="var(--c-coin-shine)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
          {/* Ceremonial Dojo banner */}
          <rect x="171" y="584" width="48" height="66" rx="6" fill="var(--c-gold)" />
          <rect x="174" y="586" width="42" height="60" rx="4" className="m-banner" />
          <text x="195" y="628" className="m-banner-ja" textAnchor="middle" lang="ja">
            道
          </text>
        </g>
      )}

      {/* GROVE SCENE */}
      {scene === 'grove' && (
        <g>
          {/* Deeper background bamboo stalks & stone lantern */}
          {[96, 152, 228, 276].map((x, k) => (
            <g key={`bg-b-${k}`} opacity="0.55">
              {bamboo(x, 380 + (k % 3) * 45, 10, k + 6)}
            </g>
          ))}
          {[132, 200, 248].map((x, k) => bamboo(x, 370 + k * 52, 13, k + 3))}
          {stoneLantern(108, 632)}
          {/* Golden firefly motes */}
          {[
            [156, 540, 3.5],
            [232, 515, 2.8],
            [182, 470, 3.2],
            [254, 590, 2.6],
          ].map(([cx, cy, r], i) => (
            <circle key={`ff-${i}`} cx={cx} cy={cy} r={r} fill="var(--c-firefly)" opacity="0.85" />
          ))}
        </g>
      )}

      {/* Overhead festooned lantern cord & glowing chōchin lanterns */}
      <path d="M0 280 Q195 335 390 280" className="m-string" fill="none" />
      {[0, 1, 2, 3, 4].map((i) => {
        const lx = 76 + i * 59;
        const ly = 316 + (i % 2) * 22;
        return (
          <g key={i} className="m-lantern" style={{ animationDelay: `${0.75 + i * 0.08}s` }}>
            <line x1={lx} y1="0" x2={lx} y2={ly - 18} className="m-string" />
            <circle cx={lx} cy={ly} r="28" className="m-lantern-halo" />
            <ellipse cx={lx} cy={ly + 3} rx="16" ry="19" fill="var(--c-lacquer)" />
            <ellipse cx={lx} cy={ly} rx="16" ry="19" className="m-lantern-body" />
            <ellipse cx={lx} cy={ly} rx="9" ry="12" className="m-lantern-core" />
            <ellipse
              cx={lx - 6}
              cy={ly - 7}
              rx="4"
              ry="2"
              transform={`rotate(-25 ${lx - 6} ${ly - 7})`}
              fill="var(--c-coin-shine)"
              opacity="0.65"
            />
            <rect x={lx - 8} y={ly - 20} width="16" height="4.5" rx="2.2" fill="var(--c-hud-bg)" />
            <rect x={lx - 8} y={ly + 17} width="16" height="4.5" rx="2.2" fill="var(--c-hud-bg)" />
            <line
              x1={lx}
              y1={ly + 21.5}
              x2={lx}
              y2={ly + 29}
              stroke="var(--c-glow)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </svg>
  );
}

function Gate({
  scene,
  actor,
  done,
  onEnd,
}: {
  scene: GateScene;
  actor: (p: ActorPose) => ReactNode;
  done: () => void;
  onEnd: () => void;
}) {
  const { duration, fadeOut } = momentsConfig.gate;
  const root = useRef<HTMLDivElement>(null);
  const [cut, setCut] = useState<Cut | null>(null);
  const [out, setOut] = useState(false);
  const [trail, setTrail] = useState<Pt[]>([]);
  const swipe = useRef<Pt[] | null>(null);
  const handed = useRef(false);
  const handOver = () => {
    if (handed.current) return;
    handed.current = true;
    setOut(true);
    done();
    window.setTimeout(onEnd, fadeOut + 40);
  };
  const pct = (e: { clientX: number; clientY: number }): Pt => [
    (e.clientX / window.innerWidth) * 100,
    (e.clientY / window.innerHeight) * 100,
  ];
  /** The blade lands: split the bushes along this stroke and play the rest of the gate. */
  const slice = (from: Pt, to: Pt) => {
    if (cut) return;
    haptic('thud');
    setCut(cutFromSwipe(from, to, from[0] * 31 + to[1]));
    setTrail([]);
  };
  // Waiting for the swipe: if nobody swipes, the blade cuts on its own so the gate never stalls.
  useEffect(() => {
    haptic('rise');
    const t = window.setTimeout(() => slice(...DEFAULT_SWIPE), CUT_WAIT_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // After the cut, every gate animation starts from the blade's impact frame together.
  useLayoutEffect(() => {
    if (!cut || !root.current) return;
    const from = duration * CUT_AT;
    for (const anim of root.current.getAnimations({ subtree: true })) {
      if ((anim as CSSAnimation).animationName === 'm-sway') continue;
      anim.currentTime = from;
      anim.play();
    }
    const t = window.setTimeout(handOver, duration - from);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cut]);
  return (
    <div
      ref={root}
      className={`m-gate ${cut ? 'm-cutting' : 'm-waiting'} ${out ? 'm-out' : ''}`}
      style={{ '--gate-ms': `${duration}ms`, '--fade-ms': `${fadeOut}ms` } as CSSProperties}
      onPointerDown={(e) => {
        if (cut) return handOver();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        swipe.current = [pct(e)];
      }}
      onPointerMove={(e) => {
        if (!swipe.current || cut) return;
        const p = pct(e);
        swipe.current.push(p);
        setTrail(swipe.current.slice(-12));
      }}
      onPointerUp={(e) => {
        if (!swipe.current || cut) return;
        const from = swipe.current[0]!;
        const to = pct(e);
        swipe.current = null;
        if (isSwipe(from, to, window.innerWidth, window.innerHeight)) slice(from, to);
        else slice(...DEFAULT_SWIPE);
      }}
      aria-hidden="true"
    >
      <div className="m-world">
        <SceneArt scene={scene} />
      </div>
      <div className="m-mist m-mist-1" />
      <div className="m-mist m-mist-2" />
      <div className="m-actor">{actor('walk')}</div>
      {(['mid', 'near'] as const).map((depth) =>
        (['upper', 'lower'] as const).map((half) => (
          <div
            key={`${depth}-${half}`}
            className={`m-bush-piece m-bush-${depth} m-bush-${half}`}
            style={
              cut
                ? ({
                    clipPath: `polygon(${half === 'upper' ? cut.sideA : cut.sideB})`,
                    '--nx': cut.normal[0],
                    '--ny': cut.normal[1],
                    '--spin': cut.angle > 0 ? 1 : -1,
                  } as CSSProperties)
                : { clipPath: 'none' }
            }
          >
            <Bushes side="l" depth={depth} />
            <Bushes side="r" depth={depth} />
          </div>
        )),
      )}
      {cut && <GateSlice cut={cut} />}
      {!cut && trail.length > 1 && (
        <svg className="m-swipe-trail" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points={trail.map(([x, y]) => `${x},${y}`).join(' ')} />
        </svg>
      )}
      {!cut && (
        <div className="m-swipe-hint">
          <span className="m-swipe-arrow" />
          <span className="m-swipe-label">Swipe to cut through!</span>
        </div>
      )}
    </div>
  );
}

// ---------- training finished ----------

function Finish({ done, onEnd }: { done: () => void; onEnd: () => void }) {
  const { duration } = momentsConfig.finish;
  useEffect(() => {
    haptic('rise');
    const t1 = window.setTimeout(() => haptic('thud'), duration * 0.33);
    const t2 = window.setTimeout(done, duration * 0.62);
    const t3 = window.setTimeout(onEnd, duration + 60);
    return () => [t1, t2, t3].forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className="m-finish"
      style={{ '--finish-ms': `${duration}ms` } as CSSProperties}
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="m-noren" style={{ '--i': i } as CSSProperties}>
          <span className="m-noren-crest" />
        </div>
      ))}
      <div className="m-finish-ja" lang="ja">
        完
      </div>
    </div>
  );
}

// ---------- gachapon ----------

/** The capsule drops and pops (tap), then the case reel spins and reveals the prize. */
function CaseMoment({
  reel,
  part,
  onReveal,
  done,
  onEnd,
}: {
  reel: Reel;
  part: (id: string) => ReactNode;
  onReveal: (rarity: Rarity) => void;
  done: () => void;
  onEnd: () => void;
}) {
  const [stage, setStage] = useState<'capsule' | 'reel'>('capsule');
  return stage === 'capsule' ? (
    // The capsule never shows the rarity: that is the reel's job.
    <Capsule
      rarity="common"
      onOpen={() => window.setTimeout(() => setStage('reel'), 450)}
      done={() => undefined}
      onEnd={() => undefined}
    />
  ) : (
    <CaseReel
      reel={reel}
      part={part}
      onReveal={onReveal}
      onCollect={() => {
        done();
        onEnd();
      }}
    />
  );
}

function Capsule({
  rarity,
  onOpen,
  done,
  onEnd,
}: {
  rarity: Rarity;
  onOpen: () => void;
  done: () => void;
  onEnd: () => void;
}) {
  const [open, setOpen] = useState(false);
  const opened = useRef(false);
  const pop = () => {
    if (opened.current) return;
    opened.current = true;
    setOpen(true);
    haptic('pop');
    onOpen();
    window.setTimeout(() => {
      done();
      onEnd();
    }, 1100);
  };
  useEffect(() => {
    const t = window.setTimeout(pop, momentsConfig.capsule.autoOpen);
    const land = window.setTimeout(() => haptic('thud'), 420);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(land);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={`m-capsule m-${rarity} ${open ? 'm-open' : ''}`}
      onPointerDown={pop}
      role="button"
      aria-label="Open the capsule"
    >
      <div className="m-capsule-rays" />
      <div className="m-capsule-body">
        <span className="m-cap-shadow" />
        <span className="m-cap-bottom" />
        <span className="m-cap-top" />
        <span className="m-cap-band" />
        <span className="m-cap-btn" />
        <span className="m-cap-shine" />
        <span className="m-cap-shine-2" />
      </div>
      {!open && <p className="m-capsule-hint">Tap to open!</p>}
    </div>
  );
}

// ---------- purchase ----------

function Purchase({
  label,
  from,
  done,
  onEnd,
}: {
  label: string;
  from: Point;
  done: () => void;
  onEnd: () => void;
}) {
  const badge = useRef<HTMLDivElement>(null);
  const [coinsDone, setCoinsDone] = useState(false);
  useLayoutEffect(() => {
    const to = targetOf('.shop-avatar') ?? { x: window.innerWidth / 2, y: 80 };
    const anim = badge.current!.animate(
      [
        { transform: `translate(${from.x}px, ${from.y}px) scale(0.2) rotate(-20deg)`, opacity: 0 },
        {
          transform: `translate(${from.x}px, ${from.y - 70}px) scale(1.25) rotate(6deg)`,
          opacity: 1,
          offset: 0.3,
        },
        {
          transform: `translate(${from.x}px, ${from.y - 60}px) scale(1) rotate(0deg)`,
          opacity: 1,
          offset: 0.5,
        },
        { transform: `translate(${to.x}px, ${to.y}px) scale(0.35)`, opacity: 0.2 },
      ],
      { duration: 1000, easing: 'cubic-bezier(.3,.7,.4,1)', fill: 'forwards' },
    );
    anim.onfinish = () => {
      haptic('pop');
      done();
    };
    return () => anim.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {!coinsDone && (
        <Coins
          from={from}
          to={targetOf('.stat-koban')}
          count={6}
          reverse
          onEnd={() => setCoinsDone(true)}
        />
      )}
      <div ref={badge} className="m-badge" onAnimationEnd={undefined}>
        <span lang="ja">{label}</span>
      </div>
      <EndAfter ms={1100} onEnd={onEnd} />
    </>
  );
}

function EndAfter({ ms, onEnd }: { ms: number; onEnd: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onEnd, ms);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
