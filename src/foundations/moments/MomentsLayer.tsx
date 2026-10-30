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
import './moments.css';

export type ActorPose = 'walk' | 'happy' | 'cheer' | 'idle';
type Item = MomentEvent & { id: number };
let nextId = 1;

export function MomentsLayer({ actor }: { actor: (pose: ActorPose) => ReactNode }) {
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
          case 'capsule':
            return (
              <Capsule key={m.id} rarity={m.rarity} onOpen={m.onOpen} done={m.done} onEnd={end} />
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

/** The teacher's red 〇: a brushed circle that overlaps itself where the brush lifts. */
function Maru({ at, onEnd }: { at: Point; onEnd: () => void }) {
  return (
    <svg
      className="m-maru"
      style={place(at, 150)}
      viewBox="0 0 100 100"
      onAnimationEnd={(e) => e.target === e.currentTarget && onEnd()}
    >
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
    </svg>
  );
}

/** The teacher's ✕, two quick strokes. Firm, not punishing. */
function Batsu({ at, onEnd }: { at: Point; onEnd: () => void }) {
  return (
    <svg
      className="m-batsu"
      style={place(at, 120)}
      viewBox="0 0 100 100"
      onAnimationEnd={(e) => e.target === e.currentTarget && onEnd()}
    >
      <path className="m-stroke" pathLength={1} d="M22 20 C 40 40, 60 60, 80 82" />
      <path className="m-stroke m-stroke-2" pathLength={1} d="M80 18 C 62 38, 42 60, 20 84" />
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
      <div className="m-slash-line" />
      <div className="m-slash-glow" />
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
      const mid = {
        x: (a.x + b.x) / 2 + spread * 2.2,
        y: Math.min(a.y, b.y) - 90 - Math.abs(spread),
      };
      const anim = n.animate(
        [
          { transform: `translate(${a.x}px, ${a.y}px) scale(0.3)`, opacity: 0 },
          {
            transform: `translate(${a.x + spread}px, ${a.y - 30}px) scale(1.1)`,
            opacity: 1,
            offset: 0.2,
          },
          { transform: `translate(${mid.x}px, ${mid.y}px) scale(1)`, opacity: 1, offset: 0.55 },
          { transform: `translate(${b.x}px, ${b.y}px) scale(0.55)`, opacity: 0.9 },
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
        <span key={i} className="m-coin" />
      ))}
    </div>
  );
}

// ---------- training gate ----------

function Bushes({ side, depth }: { side: 'l' | 'r'; depth: 'near' | 'mid' }) {
  const blobs =
    depth === 'near'
      ? [
          [70, 520, 120],
          [160, 610, 130],
          [40, 690, 140],
          [190, 730, 120],
          [110, 800, 150],
          [230, 470, 90],
        ]
      : [
          [80, 420, 90],
          [170, 480, 100],
          [60, 560, 100],
          [200, 590, 90],
        ];
  return (
    <svg
      className={`m-bush m-bush-${side} m-bush-${depth}`}
      viewBox="0 0 260 844"
      preserveAspectRatio="xMidYMax slice"
    >
      {blobs.map(([x, y, r], i) => (
        <g key={i}>
          <circle
            cx={side === 'l' ? x : 260 - x!}
            cy={y}
            r={r}
            className={i % 2 ? 'leaf-a' : 'leaf-b'}
          />
          <circle
            cx={(side === 'l' ? x! : 260 - x!) - r! * 0.3}
            cy={y! - r! * 0.35}
            r={r! * 0.45}
            className="leaf-hi"
          />
        </g>
      ))}
    </svg>
  );
}

function SceneArt({ scene }: { scene: GateScene }) {
  const bamboo = (x: number, h: number, w: number, k: number) => (
    <g
      key={`b${x}`}
      className="m-bamboo"
      style={{ animationDelay: `${-k * 0.7}s`, transformOrigin: `${x}px 700px` }}
    >
      <rect
        x={x}
        y={700 - h}
        width={w}
        height={h}
        rx={w / 2}
        className={k % 2 ? 'stalk-a' : 'stalk-b'}
      />
      {Array.from({ length: Math.floor(h / 70) }, (_, i) => (
        <rect
          key={i}
          x={x - 1}
          y={700 - h + 40 + i * 70}
          width={w + 2}
          height={4}
          rx={2}
          className="stalk-node"
        />
      ))}
      <path
        d={`M${x + w / 2} ${720 - h} q 30 -10 52 6 q -30 2 -52 -6 z M${x + w / 2} ${740 - h} q -34 -6 -50 12 q 30 -2 50 -12 z`}
        className="leaf-a"
      />
    </g>
  );
  return (
    <svg className="m-scene" viewBox="0 0 390 844" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="m-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--c-sky-top)' }} />
          <stop offset="0.6" style={{ stopColor: 'var(--c-sky-mid)' }} />
          <stop offset="1" style={{ stopColor: 'var(--c-sky-bottom)' }} />
        </linearGradient>
      </defs>
      <rect width="390" height="844" fill="url(#m-sky)" />
      <circle cx="270" cy="250" r="56" className="m-sun" />
      <path
        d="M0 560 L70 470 L130 520 L210 420 L300 510 L390 450 L390 844 L0 844Z"
        className="m-mtn-far"
      />
      <path d="M0 620 L90 560 L170 600 L260 540 L390 600 L390 844 L0 844Z" className="m-mtn-near" />
      {[12, 58, 300, 352, 330].map((x, k) => bamboo(x, 420 + (k % 3) * 90, 14 + (k % 2) * 4, k))}
      {scene === 'shrine' && (
        <g className="m-torii">
          <rect x="128" y="470" width="14" height="230" rx="5" />
          <rect x="248" y="470" width="14" height="230" rx="5" />
          <rect x="112" y="500" width="166" height="13" rx="5" />
          <path d="M96 462 Q195 444 294 462 L290 478 Q195 462 100 478Z" className="m-torii-top" />
        </g>
      )}
      {scene === 'dojo' && (
        <g className="m-dojo">
          <rect x="92" y="560" width="206" height="140" className="m-dojo-wall" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={104 + i * 38} y="578" width="30" height="104" className="m-shoji" />
          ))}
          <path d="M60 570 L120 500 L270 500 L330 570Z" className="m-dojo-roof" />
          <rect x="150" y="482" width="90" height="22" rx="6" className="m-dojo-roof" />
          <rect x="176" y="596" width="38" height="56" className="m-banner" />
          <text x="195" y="634" className="m-banner-ja" textAnchor="middle" lang="ja">
            道
          </text>
        </g>
      )}
      {scene === 'grove' && [140, 196, 238].map((x, k) => bamboo(x, 360 + k * 50, 12, k + 3))}
      <rect x="0" y="690" width="390" height="160" className="m-ground" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} className="m-lantern" style={{ animationDelay: `${0.75 + i * 0.08}s` }}>
          <line
            x1={80 + i * 58}
            y1="0"
            x2={80 + i * 58}
            y2={300 + (i % 2) * 24}
            className="m-string"
          />
          <ellipse
            cx={80 + i * 58}
            cy={318 + (i % 2) * 24}
            rx="15"
            ry="19"
            className="m-lantern-body"
          />
        </g>
      ))}
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
  const [out, setOut] = useState(false);
  const handed = useRef(false);
  const handOver = () => {
    if (handed.current) return;
    handed.current = true;
    setOut(true);
    done();
    window.setTimeout(onEnd, fadeOut + 40);
  };
  useEffect(() => {
    haptic('rise');
    const t = window.setTimeout(handOver, duration);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={`m-gate ${out ? 'm-out' : ''}`}
      style={{ '--gate-ms': `${duration}ms`, '--fade-ms': `${fadeOut}ms` } as CSSProperties}
      onPointerDown={handOver}
      aria-hidden="true"
    >
      <div className="m-world">
        <SceneArt scene={scene} />
      </div>
      <div className="m-mist m-mist-1" />
      <div className="m-mist m-mist-2" />
      <div className="m-actor">{actor('walk')}</div>
      <Bushes side="l" depth="mid" />
      <Bushes side="r" depth="mid" />
      <Bushes side="l" depth="near" />
      <Bushes side="r" depth="near" />
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
        <span className="m-cap-top" />
        <span className="m-cap-bottom" />
        <span className="m-cap-shine" />
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
