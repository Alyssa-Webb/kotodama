import { Link } from 'react-router';
import { useGame } from '../../foundations/store/gameStore';
import { isUnlocked } from '../../engine/game';
import { bosses } from '../../foundations/world';
import { useSave } from '../hooks';
import { Stars } from '../lesson/common';
import { Avatar } from '../avatar/Avatar';
import './path.css';

interface RegionInfo {
  id: 'dojo' | 'bamboo' | 'village' | 'castle' | 'shrine' | 'capital';
  en: string;
  ja: string;
  rt: string;
}

const REGIONS: readonly RegionInfo[] = [
  { id: 'dojo', en: 'The Dojo', ja: '道場', rt: 'どうじょう' },
  { id: 'bamboo', en: 'Bamboo Forest Road', ja: '竹林の道', rt: 'ちくりんのみち' },
  { id: 'village', en: 'Rice Fields & Village', ja: '棚田と里', rt: 'たなだとさと' },
  { id: 'castle', en: 'Castle Town', ja: '城下町', rt: 'じょうかまち' },
  { id: 'shrine', en: 'Mountain Shrines', ja: '山の社', rt: 'やまのやしろ' },
  { id: 'capital', en: 'The Capital', ja: '都', rt: 'みやこ' },
];

function regionFor(unitIndex: number): RegionInfo {
  return REGIONS[Math.abs(unitIndex) % REGIONS.length]!;
}

/** Chibi cloud puff with +3 shade lip and soft top-left highlight. */
function ChibiCloud({
  x,
  y,
  scale = 1,
  className,
}: {
  x: number;
  y: number;
  scale?: number;
  className?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={className}>
        <path
          d="M-38 11 H38 C46 11 52 5 52 -2 C52 -9 46 -14 39 -14 C36 -25 24 -32 11 -30 C3 -38 -12 -38 -20 -29 C-31 -29 -40 -21 -40 -10 C-46 -9 -50 -4 -50 2 C-50 7 -45 11 -38 11 Z"
          fill="color-mix(in srgb, var(--c-fog) 65%, var(--c-hud-bg))"
        />
        <path
          d="M-38 8 H38 C46 8 52 2 52 -5 C52 -12 46 -17 39 -17 C36 -28 24 -35 11 -33 C3 -41 -12 -41 -20 -32 C-31 -32 -40 -24 -40 -13 C-46 -12 -50 -7 -50 -1 C-50 4 -45 8 -38 8 Z"
          fill="color-mix(in srgb, var(--c-panel) 84%, var(--c-fog))"
        />
        <ellipse
          cx="-14"
          cy="-24"
          rx="12"
          ry="4.5"
          transform="rotate(-14 -14 -24)"
          fill="var(--c-hud-ink)"
          opacity="0.42"
        />
      </g>
    </g>
  );
}

/** Chibi rounded tree (pine, sakura or cedar) with +3 shade lip and top-left highlight. */
function ChibiTree({
  x,
  y,
  kind = 'green',
  scale = 1,
}: {
  x: number;
  y: number;
  kind?: 'green' | 'sakura' | 'autumn';
  scale?: number;
}) {
  const crown =
    kind === 'sakura'
      ? 'var(--c-petal)'
      : kind === 'autumn'
        ? 'var(--c-accent)'
        : 'var(--c-success)';
  const lip = `color-mix(in srgb, ${crown} 60%, var(--c-hud-bg))`;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="30" rx="22" ry="6" fill="var(--c-shadow)" />
      {/* Trunk with dark lip */}
      <rect
        x="-6"
        y="4"
        width="12"
        height="26"
        rx="5"
        fill="color-mix(in srgb, var(--c-gold) 48%, var(--c-hud-bg))"
      />
      <rect x="-4" y="6" width="4" height="20" rx="2" fill="var(--c-panel-edge)" opacity="0.55" />
      {/* Back left & right puffs (lip + main) */}
      <circle cx="-15" cy="3" r="16" fill={lip} />
      <circle cx="-15" cy="0" r="16" fill={crown} />
      <circle cx="15" cy="3" r="15" fill={lip} />
      <circle cx="15" cy="0" r="15" fill={crown} />
      {/* Main top puff (lip + main + top-left highlight) */}
      <ellipse cx="0" cy="-9" rx="22" ry="19" fill={lip} />
      <ellipse cx="0" cy="-12" rx="22" ry="19" fill={crown} />
      <ellipse
        cx="-8"
        cy="-21"
        rx="8.5"
        ry="3.6"
        transform="rotate(-16 -8 -21)"
        fill="var(--c-hud-ink)"
        opacity="0.4"
      />
    </g>
  );
}

/** Chibi stone tōrō lantern that glows when the region is unlocked. */
function StoneLantern({ x, y, lit }: { x: number; y: number; lit: boolean }) {
  const stoneMain = 'color-mix(in srgb, var(--c-hud-ink) 74%, var(--c-fog))';
  const stoneLight = 'color-mix(in srgb, var(--c-hud-ink) 84%, var(--c-fog))';
  const stoneLip = 'color-mix(in srgb, var(--c-fog) 62%, var(--c-hud-bg))';
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="26" rx="14" ry="4.5" fill="var(--c-shadow)" />
      {lit && (
        <circle
          cx="0"
          cy="-2"
          r="20"
          fill="var(--c-glow)"
          opacity="0.32"
          className="path-lantern-glow"
        />
      )}
      {/* Base & pedestal (lip + main) */}
      <rect x="-11" y="19" width="22" height="7" rx="3.5" fill={stoneLip} />
      <rect x="-11" y="16" width="22" height="7" rx="3.5" fill={stoneMain} />
      <rect x="-5" y="6" width="10" height="13" rx="3" fill={stoneLip} />
      <rect x="-5" y="4" width="10" height="12" rx="3" fill={stoneLight} />
      {/* Firebox window */}
      <rect x="-8" y="-7" width="16" height="13" rx="4" fill={stoneLip} />
      <rect
        x="-6"
        y="-5"
        width="12"
        height="9"
        rx="2.5"
        fill={lit ? 'var(--c-glow)' : 'color-mix(in srgb, var(--c-fog) 55%, var(--c-hud-bg))'}
      />
      {lit && <circle cx="0" cy="-0.5" r="3.2" fill="var(--c-coin-shine)" />}
      {/* Curved kasa roof (lip + main + highlight) */}
      <path d="M-15 -5 Q0 -18 15 -5 L12 -1 H-12 Z" fill={stoneLip} />
      <path d="M-15 -8 Q0 -21 15 -8 L12 -4 H-12 Z" fill={stoneMain} />
      <ellipse
        cx="-4"
        cy="-12"
        rx="4.5"
        ry="1.8"
        transform="rotate(-18 -4 -12)"
        fill="var(--c-hud-ink)"
        opacity="0.45"
      />
      <circle cx="0" cy="-16" r="3" fill={stoneMain} />
    </g>
  );
}

/** Chibi vermilion torii gate for scenic placement. */
function MiniTorii({
  x,
  y,
  scale = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <ellipse cx="0" cy="28" rx="22" ry="5" fill="var(--c-shadow)" />
      {/* Pillars + dark shoes */}
      <rect x="-15" y="-12" width="6.5" height="38" rx="3" fill="var(--c-lacquer)" />
      <rect x="-15" y="-14" width="6.5" height="36" rx="3" fill="var(--c-accent)" />
      <rect x="8.5" y="-12" width="6.5" height="38" rx="3" fill="var(--c-lacquer)" />
      <rect x="8.5" y="-14" width="6.5" height="36" rx="3" fill="var(--c-accent)" />
      <rect x="-16" y="19" width="8.5" height="8" rx="2.5" fill="var(--c-hud-bg)" />
      <rect x="7.5" y="19" width="8.5" height="8" rx="2.5" fill="var(--c-hud-bg)" />
      {/* Nuki tie-beam */}
      <rect x="-20" y="-5" width="40" height="5.5" rx="2.5" fill="var(--c-lacquer)" />
      <rect x="-20" y="-7" width="40" height="5" rx="2.5" fill="var(--c-accent)" />
      {/* Curved kasagi lintel (lip + main + highlight) */}
      <path d="M-25 -13 Q0 -20 25 -13 L23 -7 Q0 -13 -23 -7 Z" fill="var(--c-hud-bg)" />
      <path d="M-25 -16 Q0 -23 25 -16 L23 -10 Q0 -16 -23 -10 Z" fill="var(--c-accent)" />
      <ellipse
        cx="-9"
        cy="-16"
        rx="6"
        ry="1.6"
        transform="rotate(-10 -9 -16)"
        fill="var(--c-coin-shine)"
        opacity="0.45"
      />
    </g>
  );
}

/** Decorative region diorama SVG behind each unit's stretch of the pilgrimage trail. */
function RegionScene({ region, lit }: { region: RegionInfo; lit: boolean }) {
  const trailD =
    'M 192 -8 L 192 0 C 192 62, 260 94, 260 162 C 260 226, 192 246, 192 280 C 192 314, 134 334, 134 402 C 134 466, 192 498, 192 560 L 192 568';
  const stoneMain = 'color-mix(in srgb, var(--c-hud-ink) 74%, var(--c-fog))';
  const stoneLight = 'color-mix(in srgb, var(--c-hud-ink) 84%, var(--c-fog))';
  const stoneLip = 'color-mix(in srgb, var(--c-fog) 62%, var(--c-hud-bg))';
  return (
    <>
      {/* Continuous full-height terrain & unbroken pilgrimage trail (y=0..560 maps 1:1 to unit top..bottom) */}
      <svg
        viewBox="0 0 400 560"
        preserveAspectRatio="none"
        className={`region-trail-svg region-trail-${region.id}`}
        aria-hidden="true"
      >
        {/* Soft organic terrain patches for depth & cross-region blending */}
        <ellipse
          cx="76"
          cy="115"
          rx="96"
          ry="48"
          fill="color-mix(in srgb, var(--c-success-soft) 72%, var(--c-surface-alt))"
          opacity="0.65"
        />
        <ellipse
          cx="328"
          cy="295"
          rx="98"
          ry="52"
          fill="color-mix(in srgb, var(--c-success-soft) 68%, var(--c-surface-alt))"
          opacity="0.6"
        />
        <ellipse
          cx="82"
          cy="465"
          rx="92"
          ry="46"
          fill="color-mix(in srgb, var(--c-gold-soft) 62%, var(--c-surface-alt))"
          opacity="0.6"
        />

        {/* Region 3 (Village) & Region 4 (Castle): Winding river under the trail */}
        {(region.id === 'village' || region.id === 'castle') && (
          <g>
            <path
              d="M-20 258 C95 242, 145 288, 192 280 C248 272, 315 312, 420 296"
              stroke="color-mix(in srgb, var(--c-secondary) 58%, var(--c-hud-bg))"
              strokeWidth="48"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M-20 253 C95 237, 145 283, 192 275 C248 267, 315 307, 420 291"
              stroke="var(--c-secondary)"
              strokeWidth="42"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M-20 251 C95 235, 145 281, 192 273 C248 265, 315 305, 420 289"
              stroke="var(--c-secondary-soft)"
              strokeWidth="12"
              strokeDasharray="18 28"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
              className="path-river-shimmer"
            />
          </g>
        )}

        {/* Continuous winding pilgrimage trail (lip + curb + packed earth + stepping pebbles) */}
        <path
          d={trailD}
          transform="translate(0 5)"
          stroke="color-mix(in srgb, var(--c-panel-edge) 56%, var(--c-hud-bg))"
          strokeWidth="66"
          strokeLinecap="butt"
          fill="none"
        />
        <path
          d={trailD}
          stroke="var(--c-panel-edge)"
          strokeWidth="58"
          strokeLinecap="butt"
          fill="none"
        />
        <path
          d={trailD}
          stroke="color-mix(in srgb, var(--c-hud-ink) 78%, var(--c-gold-soft))"
          strokeWidth="46"
          strokeLinecap="butt"
          fill="none"
        />
        <path
          d={trailD}
          stroke="color-mix(in srgb, var(--c-panel-edge) 58%, var(--c-gold))"
          strokeWidth="18"
          strokeDasharray="4 28"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* 1:1 aspect-ratio chibi landmarks & transitional foliage */}
      <svg
        viewBox="0 0 400 560"
        preserveAspectRatio="xMidYMid slice"
        className={`region-scene region-scene-${region.id} ${lit ? 'is-lit' : 'is-locked'}`}
        aria-hidden="true"
      >
        {/* Arched wooden Taiko Bridge where the trail crosses the river */}
        {(region.id === 'village' || region.id === 'castle') && (
          <g transform="translate(192 276)">
            <rect x="-36" y="-22" width="72" height="48" rx="16" fill="var(--c-lacquer)" />
            <rect x="-36" y="-26" width="72" height="46" rx="16" fill="var(--c-accent)" />
            <rect
              x="-26"
              y="-26"
              width="52"
              height="46"
              rx="8"
              fill="color-mix(in srgb, var(--c-hud-ink) 72%, var(--c-panel-edge))"
            />
            {/* Bridge plank lines */}
            <path
              d="M-24 -14 H24 M-24 -2 H24 M-24 10 H24"
              stroke="var(--c-panel-edge)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Golden giboshi rail caps */}
            <circle cx="-31" cy="-21" r="4.5" fill="var(--c-glow)" />
            <circle cx="31" cy="-21" r="4.5" fill="var(--c-glow)" />
            <circle cx="-31" cy="14" r="4.5" fill="var(--c-glow)" />
            <circle cx="31" cy="14" r="4.5" fill="var(--c-glow)" />
          </g>
        )}

        {/* ---------------- REGION 1: THE DOJO ---------------- */}
        {region.id === 'dojo' && (
          <g>
            {/* Chibi Dojo Hall (top-right beside the trail) */}
            <g transform="translate(322 108)">
              <ellipse cx="0" cy="42" rx="58" ry="12" fill="var(--c-shadow)" />
              {/* Stone base + wooden veranda */}
              <rect x="-48" y="26" width="96" height="14" rx="6" fill={stoneLip} />
              <rect x="-48" y="23" width="96" height="13" rx="6" fill={stoneMain} />
              <rect
                x="-42"
                y="-8"
                width="84"
                height="34"
                rx="6"
                fill="color-mix(in srgb, var(--c-gold) 55%, var(--c-hud-bg))"
              />
              <rect
                x="-42"
                y="-11"
                width="84"
                height="33"
                rx="6"
                fill="color-mix(in srgb, var(--c-hud-ink) 88%, var(--c-gold-soft))"
              />
              {/* Warm glowing shoji doors */}
              <rect
                x="-26"
                y="-5"
                width="24"
                height="25"
                rx="3"
                fill={lit ? 'var(--c-glow)' : stoneLight}
              />
              <rect
                x="2"
                y="-5"
                width="24"
                height="25"
                rx="3"
                fill={lit ? 'var(--c-glow)' : stoneLight}
              />
              <path
                d="M-14 -5 V20 M14 -5 V20 M-26 7 H26"
                stroke="var(--c-panel-edge)"
                strokeWidth="2.4"
              />
              {/* Sweeping tiled dojo roof (lip + main + highlight) */}
              <path d="M-60 -6 Q0 -44 60 -6 L52 4 Q0 -26 -52 4 Z" fill="var(--c-hud-bg)" />
              <path d="M-60 -10 Q0 -48 60 -10 L52 0 Q0 -30 -52 0 Z" fill="var(--c-lacquer)" />
              <ellipse
                cx="-20"
                cy="-22"
                rx="14"
                ry="4"
                transform="rotate(-22 -20 -22)"
                fill="var(--c-coin-shine)"
                opacity="0.38"
              />
              {/* Golden ridge ornament */}
              <circle cx="0" cy="-31" r="6" fill="var(--c-gold)" />
              <circle cx="0" cy="-33" r="5.5" fill="var(--c-glow)" />
            </g>

            {/* Makiwara practice post & bokken target (mid-right) */}
            <g transform="translate(336 254)">
              <ellipse cx="0" cy="34" rx="38" ry="10" fill="var(--c-gold-soft)" />
              <ellipse cx="-10" cy="30" rx="14" ry="4.5" fill="var(--c-shadow)" />
              <rect
                x="-18"
                y="-22"
                width="16"
                height="52"
                rx="6"
                fill="color-mix(in srgb, var(--c-gold) 55%, var(--c-hud-bg))"
              />
              <rect x="-18" y="-25" width="16" height="50" rx="6" fill="var(--c-panel-edge)" />
              <rect x="-20" y="-12" width="20" height="22" rx="5" fill="var(--c-gold)" />
              <rect x="-20" y="-14" width="20" height="20" rx="5" fill="var(--c-glow)" />
              <path
                d="M-18 -8 H-2 M-18 -2 H-2 M-18 4 H-2"
                stroke="var(--c-gold)"
                strokeWidth="2.2"
              />
              <g transform="translate(14 4) rotate(18)">
                <rect
                  x="-3"
                  y="-26"
                  width="6"
                  height="48"
                  rx="3"
                  fill="color-mix(in srgb, var(--c-gold) 58%, var(--c-hud-bg))"
                />
                <rect x="-3" y="-28" width="6" height="46" rx="3" fill="var(--c-panel-edge)" />
                <rect x="-7" y="4" width="14" height="4.5" rx="2" fill="var(--c-lacquer)" />
              </g>
            </g>

            {/* Blooming Sakura Tree, Lantern & young bamboo shoots blending into Bamboo Forest */}
            <ChibiTree x={58} y={392} kind="sakura" scale={1.1} />
            <StoneLantern x={324} y={428} lit={lit} />
            <ChibiTree x={346} y={505} kind="green" scale={0.92} />
            <g transform="translate(46 490) scale(0.78)">
              <rect
                x="-6"
                y="0"
                width="12"
                height="70"
                rx="5"
                fill="color-mix(in srgb, var(--c-success) 58%, var(--c-hud-bg))"
              />
              <rect x="-6" y="-3" width="12" height="70" rx="5" fill="var(--c-success)" />
            </g>
          </g>
        )}

        {/* ---------------- REGION 2: BAMBOO FOREST ROAD ---------------- */}
        {region.id === 'bamboo' && (
          <g>
            {/* Bamboo grove stalks left & right */}
            {[
              { x: 34, y: 120, h: 130, s: 1 },
              { x: 58, y: 135, h: 115, s: 0.88 },
              { x: 356, y: 195, h: 140, s: 1 },
              { x: 332, y: 215, h: 118, s: 0.86 },
              { x: 46, y: 390, h: 135, s: 0.95 },
            ].map((b, i) => (
              <g key={i} transform={`translate(${b.x} ${b.y}) scale(${b.s})`}>
                <rect
                  x="-7"
                  y="0"
                  width="14"
                  height={b.h}
                  rx="6"
                  fill="color-mix(in srgb, var(--c-success) 58%, var(--c-hud-bg))"
                />
                <rect x="-7" y="-3" width="14" height={b.h} rx="6" fill="var(--c-success)" />
                <rect
                  x="-4"
                  y="2"
                  width="3.5"
                  height={b.h - 10}
                  rx="1.7"
                  fill="var(--c-coin-shine)"
                  opacity="0.38"
                />
                {[28, 62, 96].map((ny) => (
                  <rect
                    key={ny}
                    x="-8.5"
                    y={ny}
                    width="17"
                    height="4.5"
                    rx="2.2"
                    fill="color-mix(in srgb, var(--c-success) 48%, var(--c-hud-bg))"
                  />
                ))}
                <g className="path-sway">
                  <ellipse
                    cx="14"
                    cy="18"
                    rx="11"
                    ry="4.5"
                    transform="rotate(-24 14 18)"
                    fill="var(--c-success)"
                  />
                  <ellipse
                    cx="-14"
                    cy="44"
                    rx="11"
                    ry="4.5"
                    transform="rotate(22 -14 44)"
                    fill="var(--c-success)"
                  />
                </g>
              </g>
            ))}

            {/* Roadside Chibi Jizō Statue (top-right, light stone for dark-mode contrast) */}
            <g transform="translate(332 118)">
              <ellipse cx="0" cy="30" rx="22" ry="6" fill="var(--c-shadow)" />
              <rect x="-16" y="20" width="32" height="9" rx="4.5" fill={stoneLip} />
              <rect x="-16" y="17" width="32" height="9" rx="4.5" fill={stoneMain} />
              <path d="M-12 19 C-13 2, 13 2, 12 19 Z" fill={stoneLip} />
              <path d="M-12 16 C-13 -1, 13 -1, 12 16 Z" fill={stoneLight} />
              <path d="M-10 5 Q0 14 10 5 Q8 15 0 15 Q-8 15 -10 5 Z" fill="var(--c-accent)" />
              <circle cx="0" cy="-4" r="12.5" fill={stoneLip} />
              <circle cx="0" cy="-7" r="12.5" fill={stoneLight} />
              <ellipse
                cx="-4"
                cy="-13"
                rx="4.5"
                ry="2"
                transform="rotate(-18 -4 -13)"
                fill="var(--c-hud-ink)"
                opacity="0.48"
              />
              <path
                d="M-6 -6 Q-4 -8 -2 -6 M2 -6 Q4 -8 6 -6"
                stroke="var(--c-hud-bg)"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="-6.5" cy="-3.5" rx="2.4" ry="1.4" fill="var(--c-petal)" opacity="0.8" />
              <ellipse cx="6.5" cy="-3.5" rx="2.4" ry="1.4" fill="var(--c-petal)" opacity="0.8" />
            </g>

            {/* Forest Tea Stop with Red Bangasa Umbrella (mid-left) */}
            <g transform="translate(68 282)">
              <ellipse cx="0" cy="34" rx="34" ry="8" fill="var(--c-shadow)" />
              <rect
                x="-24"
                y="18"
                width="48"
                height="10"
                rx="4"
                fill="color-mix(in srgb, var(--c-gold) 55%, var(--c-hud-bg))"
              />
              <rect x="-24" y="15" width="48" height="9" rx="4" fill="var(--c-panel-edge)" />
              <rect
                x="-2.5"
                y="-28"
                width="5"
                height="46"
                fill="color-mix(in srgb, var(--c-gold) 52%, var(--c-hud-bg))"
              />
              <path d="M-36 -10 Q0 -38 36 -10 Z" fill="var(--c-lacquer)" />
              <path d="M-36 -13 Q0 -41 36 -13 Z" fill="var(--c-accent)" />
              <ellipse
                cx="-12"
                cy="-24"
                rx="9"
                ry="3"
                transform="rotate(-22 -12 -24)"
                fill="var(--c-coin-shine)"
                opacity="0.42"
              />
            </g>

            {/* Kitsune mini-torii & paddy terrace preview blending into Rice Fields */}
            <MiniTorii x={332} y={442} scale={1.06} rotate={-4} />
            <ellipse
              cx="88"
              cy="528"
              rx="52"
              ry="20"
              fill="color-mix(in srgb, var(--c-secondary-soft) 72%, var(--c-success-soft))"
            />
            {lit && (
              <g className="path-bob">
                <circle cx="292" cy="432" r="7" fill="var(--c-glow)" opacity="0.45" />
                <circle cx="292" cy="432" r="4" fill="var(--c-coin-shine)" />
              </g>
            )}
          </g>
        )}

        {/* ---------------- REGION 3: RICE FIELDS & VILLAGE ---------------- */}
        {region.id === 'village' && (
          <g>
            {/* Terraced Rice Paddies (left) */}
            <g transform="translate(68 188)">
              <ellipse
                cx="0"
                cy="18"
                rx="58"
                ry="24"
                fill="color-mix(in srgb, var(--c-gold) 58%, var(--c-hud-bg))"
              />
              <ellipse cx="0" cy="14" rx="58" ry="23" fill="var(--c-success)" />
              <ellipse cx="0" cy="12" rx="48" ry="17" fill="var(--c-secondary-soft)" />
              <ellipse
                cx="-8"
                cy="-12"
                rx="46"
                ry="19"
                fill="color-mix(in srgb, var(--c-gold) 58%, var(--c-hud-bg))"
              />
              <ellipse cx="-8" cy="-16" rx="46" ry="18" fill="var(--c-success)" />
              <ellipse cx="-8" cy="-18" rx="37" ry="13" fill="var(--c-secondary-soft)" />
              {[-24, -8, 8, 22].map((rx) => (
                <path
                  key={rx}
                  d={`M${rx - 3} 14 Q${rx} 4 ${rx + 3} 14 M${rx} 14 V5`}
                  stroke="var(--c-success)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />
              ))}
            </g>

            {/* Thatched Gasshō Farmhouse (top-right) */}
            <g transform="translate(332 138)">
              <ellipse cx="0" cy="36" rx="46" ry="10" fill="var(--c-shadow)" />
              <rect
                x="-32"
                y="4"
                width="64"
                height="28"
                rx="5"
                fill="color-mix(in srgb, var(--c-gold) 52%, var(--c-hud-bg))"
              />
              <rect
                x="-32"
                y="1"
                width="64"
                height="27"
                rx="5"
                fill="color-mix(in srgb, var(--c-hud-ink) 86%, var(--c-gold-soft))"
              />
              <rect
                x="-10"
                y="9"
                width="20"
                height="16"
                rx="3"
                fill={lit ? 'var(--c-glow)' : stoneLight}
              />
              <path
                d="M-44 8 L0 -36 L44 8 Z"
                fill="color-mix(in srgb, var(--c-gold) 55%, var(--c-hud-bg))"
              />
              <path d="M-44 4 L0 -40 L44 4 Z" fill="var(--c-panel-edge)" />
              <ellipse
                cx="-12"
                cy="-16"
                rx="10"
                ry="3.5"
                transform="rotate(-42 -12 -16)"
                fill="var(--c-coin-shine)"
                opacity="0.4"
              />
            </g>

            <ChibiTree x={64} y={425} kind="autumn" scale={1.05} />
            <StoneLantern x={334} y={448} lit={lit} />
          </g>
        )}

        {/* ---------------- REGION 4: CASTLE TOWN ---------------- */}
        {region.id === 'castle' && (
          <g>
            {/* Chibi Tenshu Castle Keep (top-right) */}
            <g transform="translate(326 138)">
              <ellipse cx="0" cy="46" rx="52" ry="11" fill="var(--c-shadow)" />
              {/* Stone rampart base */}
              <path d="M-42 42 L-34 14 H34 L42 42 Z" fill={stoneLip} />
              <path d="M-42 39 L-34 11 H34 L42 39 Z" fill={stoneMain} />
              {/* Lower & upper white plaster stories */}
              <rect
                x="-30"
                y="-12"
                width="60"
                height="25"
                rx="4"
                fill="color-mix(in srgb, var(--c-hud-ink) 90%, var(--c-secondary-soft))"
              />
              <path d="M-44 -8 Q0 -26 44 -8 L38 -1 Q0 -16 -38 -1 Z" fill="var(--c-hud-bg)" />
              <path d="M-44 -11 Q0 -29 44 -11 L38 -4 Q0 -19 -38 -4 Z" fill="var(--c-secondary)" />
              <rect
                x="-20"
                y="-34"
                width="40"
                height="18"
                rx="3"
                fill="color-mix(in srgb, var(--c-hud-ink) 90%, var(--c-secondary-soft))"
              />
              <path d="M-32 -30 Q0 -48 32 -30 L27 -23 Q0 -38 -27 -23 Z" fill="var(--c-hud-bg)" />
              <path d="M-32 -33 Q0 -51 32 -33 L27 -26 Q0 -41 -27 -26 Z" fill="var(--c-secondary)" />
              <circle cx="-22" cy="-35" r="4" fill="var(--c-glow)" />
              <circle cx="22" cy="-35" r="4" fill="var(--c-glow)" />
            </g>

            <StoneLantern x={62} y={208} lit={lit} />
            <ChibiTree x={68} y={425} kind="sakura" scale={1.08} />
            <ChibiTree x={336} y={442} kind="green" scale={0.96} />
          </g>
        )}

        {/* ---------------- REGION 5: MOUNTAIN SHRINES ---------------- */}
        {region.id === 'shrine' && (
          <g>
            {/* Twin Alpine Peaks */}
            <path
              d="M220 205 L296 82 C302 72, 314 72, 320 82 L392 205 Z"
              fill="var(--c-mountain-near)"
            />
            <path
              d="M275 116 L296 82 C302 72, 314 72, 320 82 L341 116 Q324 108 308 118 Q292 108 275 116 Z"
              fill="var(--c-hud-ink)"
              opacity="0.85"
            />
            {/* Thousand Torii Gates marching up the mountain */}
            <MiniTorii x={334} y={228} scale={1.12} rotate={6} />
            <MiniTorii x={68} y={295} scale={1.05} rotate={-6} />
            <MiniTorii x={330} y={432} scale={1.12} rotate={4} />
            <StoneLantern x={76} y={448} lit={lit} />
            <ChibiCloud x={315} y={96} scale={0.62} className="path-cloud-drift" />
          </g>
        )}

        {/* ---------------- REGION 6: THE CAPITAL ---------------- */}
        {region.id === 'capital' && (
          <g>
            {/* Five-Story Crimson & Gold Pagoda (top-right) */}
            <g transform="translate(328 158)">
              <ellipse cx="0" cy="48" rx="44" ry="10" fill="var(--c-shadow)" />
              <rect x="-3" y="-68" width="6" height="24" rx="3" fill="var(--c-glow)" />
              {[0, 1, 2, 3].map((tier) => {
                const y = 18 - tier * 18;
                const w = 38 - tier * 4.5;
                return (
                  <g key={tier} transform={`translate(0 ${y})`}>
                    <rect
                      x={-w * 0.55}
                      y="-4"
                      width={w * 1.1}
                      height="14"
                      rx="2"
                      fill="color-mix(in srgb, var(--c-hud-ink) 88%, var(--c-gold-soft))"
                    />
                    <path
                      d={`M${-w} -2 Q0 -15 ${w} -2 L${w - 5} 4 Q0 -7 ${-w + 5} 4 Z`}
                      fill="var(--c-lacquer)"
                    />
                    <path
                      d={`M${-w} -5 Q0 -18 ${w} -5 L${w - 5} 1 Q0 -10 ${-w + 5} 1 Z`}
                      fill="var(--c-accent)"
                    />
                  </g>
                );
              })}
            </g>
            <ChibiTree x={66} y={210} kind="sakura" scale={1.12} />
            <MiniTorii x={74} y={425} scale={1.15} />
            <StoneLantern x={332} y={440} lit={lit} />
          </g>
        )}
      </svg>
    </>
  );
}

/** Soft drifting chibi fog banks rendered over locked regions. */
function RegionMist() {
  return (
    <svg
      viewBox="0 0 400 560"
      preserveAspectRatio="none"
      className="region-mist"
      aria-hidden="true"
    >
      <ChibiCloud x={95} y={135} scale={1.35} className="path-cloud-drift" />
      <ChibiCloud x={305} y={245} scale={1.45} className="path-cloud-drift-reverse" />
      <ChibiCloud x={115} y={385} scale={1.3} className="path-cloud-drift" />
      <ChibiCloud x={295} y={485} scale={1.25} className="path-cloud-drift-reverse" />
    </svg>
  );
}

/** Chibi padlock badge rendered on locked trail markers so "not yet" reads in light & dark. */
function LockedPadlock({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Shackle (shade lip + bright rim) */}
      <path
        d="M-6.5 -2 V-8.5 C-6.5 -13.5, 6.5 -13.5, 6.5 -8.5 V-2"
        stroke="color-mix(in srgb, var(--c-fog) 58%, var(--c-hud-bg))"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M-6.5 -3.5 V-9.5 C-6.5 -14.5, 6.5 -14.5, 6.5 -9.5 V-3.5"
        stroke="color-mix(in srgb, var(--c-hud-ink) 88%, var(--c-coin-shine))"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lock body (+3 lip + warm stone/brass plate + top-left highlight) */}
      <rect
        x="-10.5"
        y="-2"
        width="21"
        height="16"
        rx="5"
        fill="color-mix(in srgb, var(--c-fog) 52%, var(--c-hud-bg))"
      />
      <rect
        x="-10.5"
        y="-4.5"
        width="21"
        height="15.5"
        rx="5"
        fill="color-mix(in srgb, var(--c-fog) 74%, var(--c-hud-ink))"
        stroke="color-mix(in srgb, var(--c-hud-ink) 85%, var(--c-coin-shine))"
        strokeWidth="1.6"
      />
      <ellipse
        cx="-4.5"
        cy="-1"
        rx="3.8"
        ry="1.5"
        transform="rotate(-18 -4.5 -1)"
        fill="var(--c-hud-ink)"
        opacity="0.55"
      />
    </g>
  );
}

/** Stepping-stone, shrine-lantern or stone/vermilion torii marker drawn inside .path-dot. */
function NodeMarker({
  kind,
  done,
  open,
  current,
}: {
  kind: 'lesson' | 'story' | 'checkpoint';
  done: boolean;
  open: boolean;
  current: boolean;
}) {
  const locked = !open && !done;
  const lockedStone = 'color-mix(in srgb, var(--c-hud-ink) 80%, var(--c-fog))';
  const lockedParchment = 'color-mix(in srgb, var(--c-hud-ink) 90%, var(--c-fog))';
  const lockedLip = 'color-mix(in srgb, var(--c-fog) 60%, var(--c-hud-bg))';
  const lockedRim = 'color-mix(in srgb, var(--c-hud-ink) 92%, var(--c-coin-shine))';

  if (kind === 'checkpoint') {
    const gateFill = done ? 'var(--c-glow)' : open ? 'var(--c-accent)' : lockedStone;
    const gateLip = done ? 'var(--c-gold)' : open ? 'var(--c-lacquer)' : lockedLip;
    return (
      <svg viewBox="0 0 96 96" className="node-marker-svg" aria-hidden="true">
        {current && <circle cx="48" cy="50" r="44" fill="var(--c-glow)" className="node-halo" />}
        {locked && (
          <circle
            cx="48"
            cy="49"
            r="43"
            fill={lockedRim}
            opacity="0.24"
            stroke={lockedRim}
            strokeWidth="2"
          />
        )}
        <ellipse cx="48" cy="84" rx="34" ry="8" fill="var(--c-shadow)" />
        {/* Stepped stone plinth (lip + top) */}
        <rect x="14" y="72" width="68" height="11" rx="5.5" fill={lockedLip} />
        <rect x="14" y="69" width="68" height="10" rx="5" fill={lockedParchment} />
        {/* Torii pillars */}
        <rect x="21" y="25" width="11" height="48" rx="4" fill={gateLip} />
        <rect
          x="21"
          y="22"
          width="11"
          height="47"
          rx="4"
          fill={gateFill}
          stroke={locked ? lockedRim : 'none'}
          strokeWidth={locked ? 1.8 : 0}
        />
        <rect x="64" y="25" width="11" height="48" rx="4" fill={gateLip} />
        <rect
          x="64"
          y="22"
          width="11"
          height="47"
          rx="4"
          fill={gateFill}
          stroke={locked ? lockedRim : 'none'}
          strokeWidth={locked ? 1.8 : 0}
        />
        <rect
          x="19.5"
          y="62"
          width="14"
          height="9"
          rx="3"
          fill={locked ? lockedLip : 'var(--c-hud-bg)'}
        />
        <rect
          x="62.5"
          y="62"
          width="14"
          height="9"
          rx="3"
          fill={locked ? lockedLip : 'var(--c-hud-bg)'}
        />
        {/* Nuki lower tie beam */}
        <rect x="14" y="34" width="68" height="8" rx="3.5" fill={gateLip} />
        <rect x="14" y="31" width="68" height="7.5" rx="3.5" fill={gateFill} />
        {/* Sweeping kasagi top lintel (lip + main + highlight) */}
        <path
          d="M8 23 Q48 11 88 23 L84 32 Q48 22 12 32 Z"
          fill={locked ? lockedLip : 'var(--c-hud-bg)'}
        />
        <path
          d="M8 19 Q48 7 88 19 L84 28 Q48 18 12 28 Z"
          fill={gateFill}
          stroke={locked ? lockedRim : 'none'}
          strokeWidth={locked ? 2.2 : 0}
        />
        <ellipse
          cx="30"
          cy="18"
          rx="12"
          ry="3"
          transform="rotate(-10 30 18)"
          fill="var(--c-coin-shine)"
          opacity="0.55"
        />
        {/* Sacred shide paper lightning tassels */}
        <path
          d="M35 31 L33 38 L37 38 L35 45 M61 31 L59 38 L63 38 L61 45"
          stroke="var(--c-hud-ink)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Center boss medallion */}
        <circle
          cx="48"
          cy="54"
          r="18.5"
          fill={done ? 'var(--c-gold)' : open ? 'var(--c-hud-bg)' : lockedLip}
        />
        <circle
          cx="48"
          cy="51.5"
          r="18"
          fill={
            done
              ? 'var(--c-glow)'
              : open
                ? 'color-mix(in srgb, var(--c-lacquer) 78%, var(--c-hud-bg))'
                : lockedParchment
          }
          stroke={locked ? lockedRim : 'none'}
          strokeWidth={locked ? 2.2 : 0}
        />
        {locked && <LockedPadlock x={48} y={53} />}
      </svg>
    );
  }

  if (kind === 'story') {
    const roofFill = done ? 'var(--c-gold)' : open ? 'var(--c-secondary)' : lockedStone;
    const roofLip = done || open ? `color-mix(in srgb, ${roofFill} 58%, var(--c-hud-bg))` : lockedLip;
    return (
      <svg viewBox="0 0 88 88" className="node-marker-svg" aria-hidden="true">
        {current && <circle cx="44" cy="46" r="40" fill="var(--c-glow)" className="node-halo" />}
        {locked && (
          <circle
            cx="44"
            cy="46"
            r="39"
            fill={lockedRim}
            opacity="0.24"
            stroke={lockedRim}
            strokeWidth="2"
          />
        )}
        <ellipse cx="44" cy="79" rx="28" ry="6.5" fill="var(--c-shadow)" />
        {/* Stone lantern base */}
        <rect x="22" y="68" width="44" height="10" rx="5" fill={roofLip} />
        <rect
          x="22"
          y="65"
          width="44"
          height="9.5"
          rx="4.8"
          fill={roofFill}
          stroke={locked ? lockedRim : 'none'}
          strokeWidth={locked ? 1.8 : 0}
        />
        {/* Glowing lantern chamber */}
        <rect x="23" y="30" width="42" height="38" rx="12" fill={roofLip} />
        <rect
          x="23"
          y="27"
          width="42"
          height="37"
          rx="12"
          fill={
            done
              ? 'var(--c-glow)'
              : open
                ? 'color-mix(in srgb, var(--c-hud-ink) 92%, var(--c-gold-soft))'
                : lockedParchment
          }
          stroke={locked ? lockedRim : 'none'}
          strokeWidth={locked ? 2.2 : 0}
        />
        {/* Pagoda lantern roof (lip + main + highlight) */}
        <path d="M13 31 Q44 12 75 31 L69 37 H19 Z" fill={roofLip} />
        <path
          d="M13 27 Q44 8 75 27 L69 33 H19 Z"
          fill={roofFill}
          stroke={locked ? lockedRim : 'none'}
          strokeWidth={locked ? 2.2 : 0}
        />
        <circle cx="44" cy="14" r="4.5" fill={locked ? lockedParchment : 'var(--c-glow)'} />
        <ellipse
          cx="33"
          cy="23"
          rx="8"
          ry="2.6"
          transform="rotate(-18 33 23)"
          fill="var(--c-coin-shine)"
          opacity="0.54"
        />
        {locked && <LockedPadlock x={44} y={48} />}
      </svg>
    );
  }

  const stoneFill = done ? 'var(--c-glow)' : open ? 'var(--c-accent)' : lockedParchment;
  const stoneLip = done ? 'var(--c-gold)' : open ? 'var(--c-lacquer)' : lockedLip;
  const rimFill = done
    ? 'var(--c-coin-shine)'
    : open
      ? 'color-mix(in srgb, var(--c-accent) 72%, var(--c-glow))'
      : lockedStone;

  return (
    <svg viewBox="0 0 88 88" className="node-marker-svg" aria-hidden="true">
      {current && <circle cx="44" cy="46" r="40" fill="var(--c-glow)" className="node-halo" />}
      {locked && (
        <ellipse
          cx="44"
          cy="45"
          rx="39"
          ry="32"
          fill={lockedRim}
          opacity="0.26"
          stroke={lockedRim}
          strokeWidth="2"
        />
      )}
      <ellipse cx="44" cy="76" rx="31" ry="8" fill="var(--c-shadow)" />
      {/* Chunky 3D stepping-stone pebble (shade lip + main body + inner medallion + top-left shine) */}
      <ellipse cx="44" cy="49" rx="34" ry="27" fill={stoneLip} />
      <ellipse
        cx="44"
        cy="43"
        rx="34"
        ry="27"
        fill={stoneFill}
        stroke={locked ? lockedRim : 'none'}
        strokeWidth={locked ? 2.6 : 0}
      />
      <ellipse cx="44" cy="42" rx="26" ry="20" fill={rimFill} opacity={locked ? '0.62' : '0.38'} />
      <ellipse
        cx="31"
        cy="29"
        rx="10"
        ry="4.2"
        transform="rotate(-20 31 29)"
        fill="var(--c-coin-shine)"
        opacity={open || done ? '0.58' : '0.65'}
      />
      {locked && <LockedPadlock x={44} y={44} />}
      {/* Mini shrine flame jewel on completed or current stones */}
      {(done || current) && (
        <g transform="translate(68 22)">
          <circle cx="0" cy="2" r="7" fill="var(--c-gold)" />
          <circle cx="0" cy="0" r="6.5" fill="var(--c-glow)" />
          <circle cx="-1.8" cy="-1.8" r="2.2" fill="var(--c-coin-shine)" />
        </g>
      )}
    </svg>
  );
}

export function PathScreen() {
  const index = useGame((s) => s.index);
  const save = useSave();
  return (
    <div className="stack path-screen">
      <h1>Path</h1>
      {index.paths
        .filter((p) => p.pack.pack.id !== 'shop-words')
        .map(({ pack, nodes }) => {
          const keys = nodes.map((n) => n.key);
          const current = nodes.find(
            (n) => !save.nodes[n.key] && isUnlocked(save, keys, n.key),
          )?.key;
          return (
            <section key={pack.pack.id} className="stack journey-pack">
              <p className="eyebrow pack-eyebrow">
                {pack.pack.title} · {pack.pack.level}
              </p>
              <div className="journey-map">
                {pack.units.map((unit, unitIdx) => {
                  const region = regionFor(unitIdx);
                  const unitNodes = nodes.filter((n) => n.unit.id === unit.id);
                  const unitOpen = unitNodes.some(
                    (n) => Boolean(save.nodes[n.key]) || isUnlocked(save, keys, n.key),
                  );
                  const unitDone =
                    unitNodes.length > 0 && unitNodes.every((n) => Boolean(save.nodes[n.key]));
                  return (
                    <div
                      key={unit.id}
                      className={`unit region-${region.id} ${unitOpen ? 'unit-open' : 'unit-locked'} ${unitDone ? 'unit-done' : ''}`}
                    >
                      <div className="unit-stage">
                        <RegionScene region={region} lit={unitOpen} />
                        {!unitOpen && <RegionMist />}

                        {/* Roadside wooden region signboard hanging beside the trail where the region begins */}
                        <div className="unit-banner">
                          <div className="unit-noren" aria-hidden="true">
                            <span className="noren-flap" />
                            <span className="noren-flap" />
                            <span className="noren-flap" />
                            <span className="noren-flap" />
                          </div>
                          <div className="unit-signboard">
                            <span className="eyebrow">
                              Unit {unitIdx + 1} · {region.en}
                            </span>
                            <h2>{unit.title}</h2>
                            <span className="unit-banner-ja" lang="ja">
                              <ruby>
                                {region.ja}
                                <rt>{region.rt}</rt>
                              </ruby>
                            </span>
                          </div>
                        </div>

                        <ol className="path-list">
                          {unitNodes.map((n, i) => {
                            const done = save.nodes[n.key];
                            const open = isUnlocked(save, keys, n.key);
                            const boss =
                              n.node.kind === 'checkpoint'
                                ? bosses.find(
                                    (b) =>
                                      b.checkpoint?.packId === n.packId &&
                                      b.checkpoint.nodeId === n.node.id,
                                  )
                                : undefined;
                            const href = boss
                              ? `/boss/${boss.id}`
                              : `/lesson/${n.packId}/${n.node.id}`;
                            const icon =
                              n.node.kind === 'checkpoint'
                                ? '⚔'
                                : n.node.kind === 'story'
                                  ? '✦'
                                  : done
                                    ? '✓'
                                    : String(i + 1);
                            return (
                              <li
                                key={n.key}
                                className={`path-node kind-${n.node.kind} ${done ? 'done' : ''} ${open ? 'open' : 'locked'} ${n.key === current ? 'current' : ''} ${n.node.kind === 'checkpoint' ? 'boss' : ''} pos-${i % 4}`}
                              >
                                {n.key === current && (
                                  <span className="path-avatar" aria-hidden="true">
                                    <Avatar size={46} />
                                  </span>
                                )}
                                {open ? (
                                  <Link
                                    to={href}
                                    className="path-dot"
                                    aria-label={`${n.node.title}${done ? ', completed' : ''}`}
                                  >
                                    <NodeMarker
                                      kind={n.node.kind}
                                      done={Boolean(done)}
                                      open={open}
                                      current={n.key === current}
                                    />
                                    <span className="path-dot-glyph" lang="ja" aria-hidden="true">
                                      {icon}
                                    </span>
                                  </Link>
                                ) : (
                                  <span className="path-dot" aria-label={`${n.node.title}, locked`}>
                                    <NodeMarker
                                      kind={n.node.kind}
                                      done={false}
                                      open={false}
                                      current={false}
                                    />
                                    <span className="path-dot-glyph" aria-hidden="true">
                                      ·
                                    </span>
                                  </span>
                                )}
                                <div className="stack path-node-card" style={{ gap: 0 }}>
                                  <strong>{n.node.title}</strong>
                                  <span className="muted tiny">
                                    {n.node.kind === 'checkpoint'
                                      ? boss
                                        ? `Boss · ${boss.en}`
                                        : 'Checkpoint'
                                      : n.node.kind === 'story'
                                        ? 'Story'
                                        : `${n.node.exercises.length} exercises`}
                                  </span>
                                  {done && <Stars n={done.stars} />}
                                </div>
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      <Link className="btn btn-block" to="/packs">
        Add lessons from ChatGPT
      </Link>
    </div>
  );
}
