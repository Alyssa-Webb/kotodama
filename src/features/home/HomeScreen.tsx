import { TourButton } from '../tour/Tour';
import { useGame } from '../../foundations/store/gameStore';
import { isUnlocked } from '../../engine/game';
import { regionForUnit, regions } from '../../foundations/world';
import { useSave, useStats } from '../hooks';
import { Avatar } from '../avatar/Avatar';
import { SpeakableJa } from '../../foundations/japanese/Ja';
import { Mascot } from '../../foundations/art/Mascot';
import { DojoHallBackdrop, MarketStreetBackdrop } from '../lesson/BattleBackdrops';
import { useDesk } from './desk';
import { NorenContinue } from './parts/NorenContinue';
import { EmaNudge } from './parts/EmaNudge';
import { Omamori } from './parts/Omamori';
import { PlaceSign, SceneEave } from './parts/SceneFrame';
import './home.css';

function greeting(hour: number): { ja: string; en: string } {
  if (hour < 4 || hour >= 18) return { ja: 'こんばんは！', en: 'Good evening, traveler.' };
  if (hour < 11) return { ja: 'おはようございます！', en: 'Good morning, traveler.' };
  return { ja: 'こんにちは！', en: 'Hello, traveler.' };
}

/** Chibi cloud puff with +3 shade lip and soft top-left highlight. */
function ChibiCloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M-34 9 H34 C41 9 46 4 46 -2 C46 -8 41 -13 35 -13 C32 -22 22 -28 10 -26 C3 -33 -10 -33 -18 -25 C-27 -25 -35 -18 -35 -9 C-41 -8 -44 -4 -44 1 C-44 6 -40 9 -34 9 Z"
        fill="color-mix(in srgb, var(--c-fog) 64%, var(--c-hud-bg))"
      />
      <path
        d="M-34 6 H34 C41 6 46 1 46 -5 C46 -11 41 -16 35 -16 C32 -25 22 -31 10 -29 C3 -36 -10 -36 -18 -28 C-27 -28 -35 -21 -35 -12 C-41 -11 -44 -7 -44 -2 C-44 3 -40 6 -34 6 Z"
        fill="color-mix(in srgb, var(--c-panel) 86%, var(--c-fog))"
      />
      <ellipse
        cx="-12"
        cy="-21"
        rx="10"
        ry="3.8"
        transform="rotate(-14 -12 -21)"
        fill="var(--c-hud-ink)"
        opacity="0.42"
      />
    </g>
  );
}

/**
 * Chibi Dojo Gate & Traveler's Camp diorama at the head of the road:
 * Left: Dojo training gate with swaying indigo noren & sakura tree.
 * Center-right: Winding road through the Bamboo Thicket (with roadside Jizō) toward the distant City Market.
 * Foreground right: Traveler's campfire & makiwara post.
 * Shifts between dawn/day (sun + sakura petals) and dusk/night (crescent moon + fireflies) by local hour.
 */
function HomeCampDiorama({
  hour,
  awake,
  litFire,
}: {
  hour: number;
  awake: number;
  litFire: boolean;
}) {
  const isDusk = hour < 5 || hour >= 17;
  const isDawn = hour >= 5 && hour < 11;
  const stoneMain = 'color-mix(in srgb, var(--c-hud-ink) 74%, var(--c-fog))';
  const stoneLight = 'color-mix(in srgb, var(--c-hud-ink) 84%, var(--c-fog))';
  const stoneLip = 'color-mix(in srgb, var(--c-fog) 62%, var(--c-hud-bg))';
  const woodMain = 'var(--c-panel-edge)';
  const woodLip = 'color-mix(in srgb, var(--c-gold) 52%, var(--c-hud-bg))';
  const bambooMain = 'var(--c-success)';
  const bambooLip = 'color-mix(in srgb, var(--c-success) 56%, var(--c-hud-bg))';
  const sakuraMain = 'var(--c-petal)';
  const sakuraLip = 'color-mix(in srgb, var(--c-petal) 60%, var(--c-hud-bg))';
  const marketLit = awake >= 0.25 || isDusk;

  return (
    <svg
      viewBox="0 0 420 168"
      preserveAspectRatio="xMidYMax slice"
      className={`home-diorama home-diorama-${isDusk ? 'dusk' : isDawn ? 'dawn' : 'day'}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="home-sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--c-sky-top)" />
          <stop offset="56%" stopColor="var(--c-sky-mid)" />
          <stop offset="100%" stopColor="var(--c-sky-bottom)" />
        </linearGradient>
        <radialGradient id="home-sun-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--c-glow)" stopOpacity="0.65" />
          <stop offset="55%" stopColor="var(--c-glow)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--c-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky backdrop */}
      <rect width="420" height="168" fill="url(#home-sky-grad)" />

      {/* Dusk/night stars (static crisp dots, no filter) */}
      <g className={isDusk ? '' : 'only-dark'}>
        {[
          [44, 22, 1.5],
          [118, 16, 1.2],
          [168, 30, 1.6],
          [224, 18, 1.1],
          [278, 26, 1.5],
          [388, 20, 1.3],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="var(--c-firefly)" opacity="0.85" />
        ))}
      </g>

      {/* Celestial orb: Dawn/Day chibi sun or Dusk/Night crescent moon */}
      <g transform={`translate(322 ${isDawn ? 54 : 38})`}>
        <circle cx="0" cy="0" r="44" fill="url(#home-sun-halo)" />
        {isDusk ? (
          <g>
            <circle cx="0" cy="3" r="16" fill="var(--c-gold)" />
            <circle cx="0" cy="0" r="16" fill="var(--c-firefly)" />
            <circle cx="6" cy="-4" r="12" fill="var(--c-sky-top)" />
            <ellipse
              cx="-6"
              cy="-5"
              rx="4.2"
              ry="2"
              transform="rotate(-24 -6 -5)"
              fill="var(--c-coin-shine)"
              opacity="0.6"
            />
          </g>
        ) : (
          <g>
            <circle cx="0" cy="3" r="18" fill="var(--c-gold)" />
            <circle cx="0" cy="0" r="18" fill="var(--c-glow)" />
            <ellipse
              cx="-6"
              cy="-7"
              rx="6.5"
              ry="3"
              transform="rotate(-18 -6 -7)"
              fill="var(--c-coin-shine)"
              opacity="0.65"
            />
          </g>
        )}
      </g>

      {/* Chibi clouds */}
      <ChibiCloud x={148} y={38} scale={0.72} />
      <ChibiCloud x={256} y={28} scale={0.56} />

      {/* Far mountain ridge + distant Mount Fuji silhouette */}
      <path d="M152 118 L206 58 C212 52 222 52 228 58 L282 118 Z" fill="var(--c-mountain-far)" />
      <path
        d="M191 75 L206 58 C212 52 222 52 228 58 L243 75 Q232 71 224 76 Q217 70 209 76 Q201 71 191 75 Z"
        fill="var(--c-hud-ink)"
        opacity="0.88"
      />
      <path
        d="M-10 122 C52 94 118 96 176 112 C234 94 312 90 430 114 V168 H-10 Z"
        fill="var(--c-mountain-far)"
        opacity="0.82"
      />

      {/* Midground hills + distant Edo City Market rooftops */}
      <path
        d="M-10 132 C68 112 142 116 214 126 C276 110 348 110 430 126 V168 H-10 Z"
        fill="var(--c-mountain-near)"
      />

      {/* Distant City Market (Chapter 3) wooden roofs & glowing dusk windows on the hill */}
      <g transform="translate(268 102)">
        {/* Market stall 1 */}
        <rect x="-24" y="6" width="26" height="14" rx="2" fill="var(--c-hud-bg)" />
        <path d="M-28 8 Q-11 -3 6 8 Z" fill="var(--c-lacquer)" />
        <rect
          x="-19"
          y="10"
          width="6"
          height="6"
          rx="1.5"
          fill={marketLit ? 'var(--c-glow)' : 'var(--c-fog)'}
        />
        <rect
          x="-9"
          y="10"
          width="6"
          height="6"
          rx="1.5"
          fill={marketLit ? 'var(--c-glow)' : 'var(--c-fog)'}
        />
        {/* Market tower / yagura */}
        <rect x="6" y="0" width="28" height="20" rx="2" fill="var(--c-hud-bg)" />
        <path d="M1 3 Q20 -9 39 3 Z" fill="var(--c-secondary)" />
        <rect
          x="12"
          y="6"
          width="7"
          height="8"
          rx="1.5"
          fill={marketLit ? 'var(--c-glow)' : 'var(--c-fog)'}
        />
        <rect
          x="22"
          y="6"
          width="7"
          height="8"
          rx="1.5"
          fill={marketLit ? 'var(--c-glow)' : 'var(--c-fog)'}
        />
        {/* Tiny market lantern dots */}
        {marketLit && (
          <g fill="var(--c-accent)">
            <circle cx="-22" cy="9" r="2.2" />
            <circle cx="2" cy="9" r="2.2" />
            <circle cx="34" cy="5" r="2.2" />
          </g>
        )}
      </g>

      {/* Rolling chibi meadow ground (+3 shade lip + main turf) */}
      <path
        d="M-10 134 C90 120 198 122 292 128 C348 124 392 126 430 132 V168 H-10 Z"
        fill="color-mix(in srgb, var(--c-success) 52%, var(--c-hud-bg))"
      />
      <path
        d="M-10 131 C90 117 198 119 292 125 C348 121 392 123 430 129 V168 H-10 Z"
        fill="color-mix(in srgb, var(--c-success-soft) 72%, var(--c-surface-alt))"
      />

      {/* Winding traveler's road from the Dojo Gate through the Bamboo Thicket to the Market */}
      <path
        d="M172 170 C186 150 226 144 246 130 C264 118 268 110 278 104"
        transform="translate(0 3)"
        stroke={woodLip}
        strokeWidth="36"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M172 170 C186 150 226 144 246 130 C264 118 268 110 278 104"
        stroke={woodMain}
        strokeWidth="32"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M172 170 C186 150 226 144 246 130 C264 118 268 110 278 104"
        stroke="color-mix(in srgb, var(--c-hud-ink) 80%, var(--c-gold-soft))"
        strokeWidth="24"
        strokeLinecap="round"
        fill="none"
      />
      {/* Stepping stones along the road */}
      {[
        [198, 154, 7, 3.5],
        [224, 142, 6, 3],
        [246, 130, 5, 2.5],
      ].map(([cx, cy, rx, ry], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy! + 2} rx={rx} ry={ry} fill={stoneLip} />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={stoneMain} />
        </g>
      ))}

      {/* Blooming Sakura Tree on the left behind the Dojo Gate */}
      <g transform="translate(22 96)">
        <rect x="-5" y="6" width="10" height="32" rx="4" fill={woodLip} />
        <rect x="-3" y="8" width="3.5" height="24" rx="1.7" fill={woodMain} opacity="0.6" />
        <circle cx="-12" cy="4" r="15" fill={sakuraLip} />
        <circle cx="-12" cy="1" r="15" fill={sakuraMain} />
        <circle cx="14" cy="5" r="14" fill={sakuraLip} />
        <circle cx="14" cy="2" r="14" fill={sakuraMain} />
        <ellipse cx="0" cy="-8" rx="20" ry="17" fill={sakuraLip} />
        <ellipse cx="0" cy="-11" rx="20" ry="17" fill={sakuraMain} />
        <ellipse
          cx="-7"
          cy="-19"
          rx="8"
          ry="3.2"
          transform="rotate(-16 -7 -19)"
          fill="var(--c-hud-ink)"
          opacity="0.42"
        />
      </g>

      {/* Chapter 2: Bamboo Thicket stalks on the right side of the road */}
      {[
        { x: 366, y: 26, h: 112, s: 0.92 },
        { x: 386, y: 18, h: 124, s: 1 },
        { x: 404, y: 34, h: 108, s: 0.86 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) scale(${b.s})`}>
          <rect x="-6" y="3" width="12" height={b.h} rx="5" fill={bambooLip} />
          <rect x="-6" y="0" width="12" height={b.h} rx="5" fill={bambooMain} />
          <rect
            x="-3.5"
            y="4"
            width="3"
            height={b.h - 10}
            rx="1.5"
            fill="var(--c-coin-shine)"
            opacity="0.38"
          />
          {[28, 60, 90].map((ny) => (
            <rect key={ny} x="-7.5" y={ny} width="15" height="4" rx="2" fill={bambooLip} />
          ))}
          <ellipse
            cx="-12"
            cy="24"
            rx="9"
            ry="3.8"
            transform="rotate(22 -12 24)"
            fill={bambooMain}
          />
          <ellipse
            cx="12"
            cy="48"
            rx="9"
            ry="3.8"
            transform="rotate(-22 12 48)"
            fill={bambooMain}
          />
        </g>
      ))}

      {/* Roadside Chibi Jizō Guardian by the Bamboo Thicket entrance */}
      <g transform="translate(342 118) scale(0.82)">
        <ellipse cx="0" cy="24" rx="16" ry="4.5" fill="var(--c-shadow)" />
        <rect x="-12" y="16" width="24" height="7" rx="3.5" fill={stoneLip} />
        <rect x="-12" y="13" width="24" height="7" rx="3.5" fill={stoneMain} />
        <path d="M-9 15 C-10 2 10 2 9 15 Z" fill={stoneLip} />
        <path d="M-9 12 C-10 -1 10 -1 9 12 Z" fill={stoneLight} />
        {/* Red Jizō bib */}
        <path d="M-8 3 Q0 11 8 3 Q6 11 0 11 Q-6 11 -8 3 Z" fill="var(--c-accent)" />
        <circle cx="0" cy="-3" r="10" fill={stoneLip} />
        <circle cx="0" cy="-6" r="10" fill={stoneLight} />
        <ellipse
          cx="-3.5"
          cy="-11"
          rx="3.6"
          ry="1.6"
          transform="rotate(-16 -3.5 -11)"
          fill="var(--c-hud-ink)"
          opacity="0.45"
        />
        <path
          d="M-5 -5 Q-3 -7 -1.5 -5 M1.5 -5 Q3 -7 5 -5"
          stroke="var(--c-hud-bg)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="-5.5" cy="-3" rx="2" ry="1.2" fill="var(--c-petal)" opacity="0.8" />
        <ellipse cx="5.5" cy="-3" rx="2" ry="1.2" fill="var(--c-petal)" opacity="0.8" />
      </g>

      {/* Chapter 1: The Dojo Gate (Left-center, framing Koto) */}
      <g transform="translate(88 74)">
        <ellipse cx="0" cy="78" rx="58" ry="8" fill="var(--c-shadow)" />
        {/* Stone plinths */}
        <rect x="-46" y="66" width="18" height="10" rx="4" fill={stoneLip} />
        <rect x="-46" y="63" width="18" height="9" rx="4" fill={stoneMain} />
        <rect x="28" y="66" width="18" height="10" rx="4" fill={stoneLip} />
        <rect x="28" y="63" width="18" height="9" rx="4" fill={stoneMain} />
        {/* Gate pillars (+3 shade lip + vermilion/lacquer timber) */}
        <rect x="-42" y="-12" width="10" height="78" rx="4" fill="var(--c-lacquer)" />
        <rect x="-42" y="-15" width="10" height="78" rx="4" fill="var(--c-accent)" />
        <rect x="32" y="-12" width="10" height="78" rx="4" fill="var(--c-lacquer)" />
        <rect x="32" y="-15" width="10" height="78" rx="4" fill="var(--c-accent)" />
        {/* Crossbeam (nuki) */}
        <rect x="-50" y="-4" width="100" height="8" rx="3.5" fill="var(--c-lacquer)" />
        <rect x="-50" y="-7" width="100" height="7.5" rx="3.5" fill="var(--c-accent)" />
        {/* Swaying Indigo Dojo Noren Curtains */}
        <g className="home-noren-sway">
          {[-26, -7, 12].map((nx, i) => (
            <g key={i} transform={`translate(${nx} -1)`}>
              <rect
                x="0"
                y="3"
                width="15"
                height="24"
                rx="3.5"
                fill="color-mix(in srgb, var(--c-secondary) 60%, var(--c-hud-bg))"
              />
              <rect x="0" y="0" width="15" height="23" rx="3.5" fill="var(--c-secondary)" />
              <circle cx="7.5" cy="11.5" r="4.2" fill="var(--c-hud-ink)" opacity="0.88" />
              <circle cx="7.5" cy="11.5" r="2" fill="var(--c-secondary)" />
            </g>
          ))}
        </g>
        {/* Hanging Dojo Paper Lantern (right eave) */}
        <g transform="translate(44 2)">
          <rect x="-1" y="-4" width="2" height="6" fill="var(--c-hud-bg)" />
          <ellipse cx="0" cy="11" rx="7.5" ry="8.5" fill="var(--c-lacquer)" />
          <ellipse cx="0" cy="8.5" rx="7.5" ry="8" fill="var(--c-accent)" />
          <ellipse cx="0" cy="8.5" rx="4.2" ry="5" fill="var(--c-glow)" opacity="0.9" />
          <rect x="-4.5" y="0" width="9" height="2.6" rx="1.3" fill="var(--c-hud-bg)" />
          <rect x="-4.5" y="15.5" width="9" height="2.6" rx="1.3" fill="var(--c-hud-bg)" />
        </g>
        {/* Sweeping Tiled Dojo Roof (+3 shade lip + main + highlight + golden ridge ornament) */}
        <path d="M-60 -10 Q0 -42 60 -10 L52 -1 Q0 -26 -52 -1 Z" fill="var(--c-hud-bg)" />
        <path
          d="M-60 -14 Q0 -46 60 -14 L52 -5 Q0 -30 -52 -5 Z"
          fill="color-mix(in srgb, var(--c-hud-bg) 74%, var(--c-secondary))"
        />
        <ellipse
          cx="-20"
          cy="-24"
          rx="14"
          ry="3.6"
          transform="rotate(-18 -20 -24)"
          fill="var(--c-hud-ink)"
          opacity="0.38"
        />
        <circle cx="0" cy="-31" r="5.5" fill="var(--c-gold)" />
        <circle cx="0" cy="-33" r="5" fill="var(--c-glow)" />
      </g>

      {/* Foreground Right: Traveler's Campfire & Dojo Makiwara Post */}
      <g transform="translate(298 144)">
        <ellipse cx="0" cy="10" rx="28" ry="6.5" fill="var(--c-shadow)" />
        {/* Crossed firewood logs */}
        <g transform="rotate(-18)">
          <rect x="-16" y="-1" width="32" height="6" rx="3" fill={woodLip} />
          <rect x="-16" y="-3" width="32" height="5.5" rx="2.8" fill={woodMain} />
        </g>
        <g transform="rotate(18)">
          <rect x="-16" y="-1" width="32" height="6" rx="3" fill={woodLip} />
          <rect x="-16" y="-3" width="32" height="5.5" rx="2.8" fill={woodMain} />
        </g>
        {/* Campfire flame (flickers gently with transform + opacity) */}
        {litFire ? (
          <g className="home-flame-flicker">
            <circle cx="0" cy="-8" r="18" fill="var(--c-glow)" opacity="0.28" />
            <path d="M0 -26 C11 -16 14 -4 0 2 C-14 -4 -11 -16 0 -26 Z" fill="var(--c-lacquer)" />
            <path d="M0 -29 C11 -18 14 -6 0 0 C-14 -6 -11 -18 0 -29 Z" fill="var(--c-accent)" />
            <path d="M0 -21 C7 -13 8 -5 0 -1 C-8 -5 -7 -13 0 -21 Z" fill="var(--c-glow)" />
            <ellipse cx="-2" cy="-9" rx="3" ry="4.5" fill="var(--c-coin-shine)" />
          </g>
        ) : (
          <circle cx="0" cy="-4" r="4" fill="var(--c-fog)" />
        )}
        {/* Ring of chunky river stones (+3 lip + stone top + highlight) */}
        {[
          [-16, 4, 6.5, 4.2],
          [-6, 7, 7, 4.5],
          [6, 7, 7, 4.5],
          [16, 4, 6.5, 4.2],
        ].map(([cx, cy, rx, ry], i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy! + 2.5} rx={rx} ry={ry} fill={stoneLip} />
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={stoneMain} />
            <ellipse
              cx={cx! - 2}
              cy={cy! - 1.2}
              rx={rx! * 0.42}
              ry={ry! * 0.36}
              fill="var(--c-hud-ink)"
              opacity="0.4"
            />
          </g>
        ))}
      </g>

      {/* Ambient life: 3 drifting sakura petals (dawn/day) or glowing fireflies (dusk) */}
      {[
        { x: 162, y: 56, cls: 'home-ambient-1' },
        { x: 248, y: 74, cls: 'home-ambient-2' },
        { x: 334, y: 62, cls: 'home-ambient-3' },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <g className={p.cls}>
            {isDusk ? (
              <>
                <circle cx="0" cy="0" r="5.5" fill="var(--c-glow)" opacity="0.38" />
                <circle cx="0" cy="0" r="2.6" fill="var(--c-firefly)" />
              </>
            ) : (
              <path
                d="M0 -4 C4 -4 6 0 0 5 C-6 0 -4 -4 0 -4 Z"
                fill="var(--c-petal)"
                transform="rotate(24)"
              />
            )}
          </g>
        </g>
      ))}
    </svg>
  );
}

/**
 * Today's goal as a Chibi Shrine Chōchin Lantern that fills with warm golden spirit fire
 * as `pct` rises from 0% to 100%. Pure inline SVG with +3 shade lips and top-left highlight.
 */
/**
 * Home is one screen with one job: a scene of where you are in the story, one button to keep
 * going, and at most three reminders that only appear when something needs you. Stats live in
 * the header and places live in the tab bar, so Home repeats neither.
 */
export function HomeScreen() {
  const s = useStats();
  const save = useSave();
  const index = useGame((st) => st.index);
  const desk = useDesk();
  const goalPct = desk.status.goalPct;
  const hour = new Date(s.now).getHours();
  const hello = greeting(hour);
  let next: { title: string; unit: string; href: string; kind: string; unitIndex: number } | null =
    null;
  for (const p of index.paths) {
    const keys = p.nodes.map((n) => n.key);
    const n = p.nodes.find((x) => !save.nodes[x.key] && isUnlocked(save, keys, x.key));
    if (n) {
      next = {
        title: n.node.title,
        unit: n.unit.title,
        href: `/lesson/${n.packId}/${n.node.id}`,
        kind: n.node.kind,
        unitIndex: n.unitIndex,
      };
      break;
    }
  }
  // The scene is the region of the next lesson; with everything done, the furthest region.
  const region = next ? regionForUnit(next.unitIndex) : regions[regions.length - 1]!;
  const spiritCount = new Set(Object.keys(save.cards).map((k) => k.split('#')[0])).size;
  const awake = desk.town.total ? Math.max(0.15, desk.town.open / desk.town.total) : 0.15;
  const notes = desk.notes.slice(0, 3);
  const met = desk.status.goalMet;

  return (
    <div className="stack home-screen">
      <section className={`home-hero home-scene home-scene-${region.id}`} aria-label="Today">
        {region.id === 'dojo' ? (
          <DojoHallBackdrop className="home-backdrop" />
        ) : region.id === 'market' ? (
          <MarketStreetBackdrop className="home-backdrop" />
        ) : (
          <HomeCampDiorama
            hour={hour}
            awake={save.lessonCount ? awake : 0.2}
            litFire={s.streak > 0 || s.todayXp > 0 || save.lessonCount > 0}
          />
        )}
        <div className="home-scene-floor" aria-hidden="true" />
        <SceneEave />
        <PlaceSign place={region.en} />
        <TourButton />
        <div className="home-koto">
          <Mascot
            outfit={save.lessonCount === 0 ? 'guide' : 'sensei'}
            pose={met ? 'cheer' : 'wave'}
            size={92}
            facing="right"
          />
        </div>
        <div className="speech">
          <SpeakableJa text={hello.ja} role="teach" className="speech-ja" />
          <span className="small">{hello.en}</span>
        </div>
        <div className="home-hero-avatar">
          <Avatar size={88} mood={met ? 'happy' : 'idle'} />
        </div>
      </section>

      {next ? (
        <NorenContinue
          to={next.href}
          label={`${save.lessonCount ? 'Continue' : 'Start your first lesson'}: ${next.title}`}
          eyebrow={next.kind === 'checkpoint' ? 'Boss ahead' : 'Next lesson'}
          title={next.title}
          cta={save.lessonCount ? 'Continue' : 'Start'}
          goalPct={goalPct}
          goalText={
            met ? 'Goal met today' : `${desk.status.todayXp} / ${desk.status.goal} XP today`
          }
          goalFire={save.streak.lastGoalDay}
        />
      ) : (
        <NorenContinue
          to="/packs"
          label="Add a lesson pack"
          eyebrow="All caught up"
          title="Every lesson is done"
          cta="Add a pack"
          goalPct={null}
          goalText=""
        />
      )}

      {notes.length > 0 && (
        <div className="home-nudges" role="list" aria-label="Needs you">
          {notes.map((n) => (
            <div role="listitem" key={n.id}>
              <EmaNudge note={n} />
            </div>
          ))}
        </div>
      )}

      <nav className="home-more" aria-label="More to play">
        <Omamori to="/modes" kind="arcade" label="Arcade" />
        <Omamori
          to="/collection"
          kind="spirits"
          label={`Spirits${spiritCount ? ` · ${spiritCount} awake` : ''}`}
        />
      </nav>
    </div>
  );
}
