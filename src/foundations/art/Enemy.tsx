/**
 * Road enemies for battle lessons: mischievous chibi yokai that garble words along the woodland
 * path. Pure 2D inline SVG + CSS animations (transform/opacity only), driven by theme tokens.
 */
import type { ReactNode } from 'react';
import './art.css';

export const ENEMY_KINDS = ['inkling', 'glitchling', 'kasa-obake', 'kitsune', 'kappa'] as const;
export type EnemyKind = (typeof ENEMY_KINDS)[number];
export type EnemyState = 'idle' | 'hit' | 'attack' | 'defeat' | 'enter';

const INK = 'var(--c-hud-bg)';
const CREAM = 'var(--c-hud-ink)';
const SHINE = 'var(--c-coin-shine)';

/** Shared two-eye expression helper for two-eyed yokai (inkling, kitsune, kappa). */
function spiralEyePath(cx: number, cy: number, dir: 1 | -1 = 1): string {
  return [
    `M ${cx} ${cy}`,
    `C ${cx + dir * 1.8} ${cy - 1.8}, ${cx + dir * 3} ${cy + 1.2}, ${cx} ${cy + 2.6}`,
    `C ${cx - dir * 3.2} ${cy + 2.8}, ${cx - dir * 4.4} ${cy - 2}, ${cx} ${cy - 4.2}`,
    `C ${cx + dir * 4.6} ${cy - 4.4}, ${cx + dir * 6} ${cy + 2.4}, ${cx + dir * 1.2} ${cy + 5.8}`,
    `C ${cx - dir * 3.8} ${cy + 6.4}, ${cx - dir * 6.5} ${cy + 0.5}, ${cx - dir * 4.8} ${cy - 4}`,
  ].join(' ');
}

/** Shared two-row damage flash wrapper (white surface flash + red danger flash). */
function YokaiDamageFlash({ renderSilhouette }: { renderSilhouette: (fill: string) => ReactNode }) {
  return (
    <>
      <g className="enemy-damage-flash enemy-damage-flash-white" fill="var(--c-surface)">
        {renderSilhouette('var(--c-surface)')}
      </g>
      <g className="enemy-damage-flash enemy-damage-flash-red" fill="var(--c-danger)">
        {renderSilhouette('var(--c-danger)')}
      </g>
    </>
  );
}

function YokaiEyes({
  state,
  x1,
  x2,
  y,
  iris = 'var(--c-glow)',
  pupil = INK,
  hurtStroke = CREAM,
}: {
  state: EnemyState;
  x1: number;
  x2: number;
  y: number;
  iris?: string;
  pupil?: string;
  hurtStroke?: string;
}) {
  if (state === 'hit') {
    return (
      <g>
        {/* Squeezed > < wince eyes */}
        <g
          stroke={hurtStroke}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d={`M${x1 - 5.5} ${y - 4.2} L${x1 + 4} ${y} L${x1 - 5.5} ${y + 4.2}`} />
          <path d={`M${x2 + 5.5} ${y - 4.2} L${x2 - 4} ${y} L${x2 + 5.5} ${y + 4.2}`} />
        </g>
        {/* Chibi sweat drop near temple */}
        <path
          d={`M${x2 + 9.5} ${y - 9} C${x2 + 12} ${y - 5} ${x2 + 12} ${y - 2} ${x2 + 9.5} ${y - 2} C${x2 + 7} ${y - 2} ${x2 + 7} ${y - 5} ${x2 + 9.5} ${y - 9} Z`}
          fill="var(--c-secondary-soft)"
          stroke="var(--c-secondary)"
          strokeWidth="1"
        />
        <circle cx={x2 + 8.8} cy={y - 4.2} r="0.9" fill={SHINE} />
      </g>
    );
  }
  if (state === 'defeat') {
    return (
      <g>
        {/* Swirly spiral KO eyes */}
        <circle cx={x1} cy={y} r="6.6" fill={CREAM} opacity="0.92" />
        <circle cx={x2} cy={y} r="6.6" fill={CREAM} opacity="0.92" />
        <path
          d={spiralEyePath(x1, y, 1)}
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={spiralEyePath(x2, y, -1)}
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }
  return (
    <g className="enemy-blink" style={{ transformOrigin: `50px ${y}px` }}>
      {/* Left eye */}
      <ellipse cx={x1} cy={y} rx="6.2" ry="6.8" fill={iris} />
      <ellipse cx={x1 + 0.5} cy={y + 0.4} rx="3.4" ry="4.4" fill={pupil} />
      <circle cx={x1 - 1.8} cy={y - 2} r="2" fill={SHINE} />
      <circle cx={x1 + 2} cy={y + 2.2} r="1" fill={SHINE} opacity="0.8" />

      {/* Right eye */}
      <ellipse cx={x2} cy={y} rx="6.2" ry="6.8" fill={iris} />
      <ellipse cx={x2 - 0.5} cy={y + 0.4} rx="3.4" ry="4.4" fill={pupil} />
      <circle cx={x2 - 1.8} cy={y - 2} r="2" fill={SHINE} />
      <circle cx={x2 + 2} cy={y + 2.2} r="1" fill={SHINE} opacity="0.8" />
    </g>
  );
}

/** 1. INKLING (墨霊): hovering sumi ink-drop spirit with a calligraphy brush tail & forehead ofuda. */
function InklingArt({ state }: { state: EnemyState }) {
  const bodyShade = INK;
  const bodyFill = 'color-mix(in srgb, var(--c-hud-bg) 72%, var(--c-secondary))';
  const bodyInner = 'color-mix(in srgb, var(--c-secondary) 52%, var(--c-mountain-near))';
  const rimHi = 'color-mix(in srgb, var(--c-secondary) 75%, var(--c-hud-ink))';

  return (
    <>
      {/* Soft hovering ground shadow on the path */}
      <g className="enemy-shadow enemy-shadow-float">
        <ellipse cx="50" cy="92" rx="25" ry="5.5" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="14" ry="3" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body">
        {/* Orbiting sumi ink droplets */}
        <g className="enemy-orb-1">
          <path d="M13 35 C17 41 17 46 13 46 C9 46 9 41 13 35 Z" fill={bodyShade} />
          <path
            d="M13 33 C16.5 38.5 16.5 43.5 13 43.5 C9.5 43.5 9.5 38.5 13 33 Z"
            fill="var(--c-secondary)"
          />
          <circle cx="11.8" cy="39.5" r="1.3" fill={SHINE} />
        </g>
        <g className="enemy-orb-2">
          <path
            d="M87 24 C90.5 29 90.5 33.5 87 33.5 C83.5 33.5 83.5 29 87 24 Z"
            fill="var(--c-lacquer)"
          />
          <path
            d="M87 22.5 C90 27 90 31.5 87 31.5 C84 31.5 84 27 87 22.5 Z"
            fill="var(--c-accent)"
          />
          <circle cx="86" cy="28" r="1.2" fill={SHINE} />
        </g>

        {/* Sweeping calligraphy brush (fude) tail */}
        <g className="enemy-part-tail" style={{ transformOrigin: '64px 66px' }}>
          {/* Bamboo brush shaft */}
          <path
            d="M62 67 L82 32"
            stroke="color-mix(in srgb, var(--c-gold) 65%, var(--c-hud-bg))"
            strokeWidth="8.5"
            strokeLinecap="round"
          />
          <path
            d="M62 65 L82 30"
            stroke="var(--c-panel-edge)"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          {/* Lacquer ferrule collar */}
          <path
            d="M77 38 L83 28"
            stroke="var(--c-lacquer)"
            strokeWidth="9.5"
            strokeLinecap="round"
          />
          <path
            d="M78 36 L83 28"
            stroke="var(--c-accent)"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          <path d="M77 38 L80 33" stroke="var(--c-glow)" strokeWidth="2.4" strokeLinecap="round" />
          {/* Plump ink-dipped brush hair tuft */}
          <path d="M82 30 C75 22 79 10 91 9 C93 19 91 29 82 30 Z" fill={CREAM} />
          <path d="M84 26 C79 19 82 11 91 9 C92.5 17 90 24 84 26 Z" fill="var(--c-secondary)" />
          <path d="M86 21 C83 16 85 10 91 9 C92 14 90 19 86 21 Z" fill={bodyShade} />
          <circle cx="91" cy="11" r="2.2" fill="var(--c-accent)" />
        </g>

        {/* Dripping sumi globules under the hovering skirt */}
        <g className="enemy-drip">
          <circle cx="35" cy="81" r="3" fill={bodyShade} />
          <circle cx="63" cy="80" r="2.5" fill={bodyShade} />
        </g>

        {/* Big chibi teardrop body: darker bottom shade lip */}
        <path
          d="M50 15 C54 15 57 19 54 24 C69 29 79 44 79 62 C79 73 73 79 66 79 C62 79 60 75 56 75 C53 75 52 79 48 79 C44 79 43 75 40 75 C36 75 34 79 30 79 C23 79 19 73 19 62 C19 44 31 28 45 22 C44 17 47 15 50 15 Z"
          fill={bodyShade}
        />
        {/* Main glossy sumi-drop body */}
        <path
          d="M50 11 C54 11 57 15 54 20 C69 25 79 40 79 58 C79 69 73 75 66 75 C62 75 60 71 56 71 C53 71 52 75 48 75 C44 75 43 71 40 71 C36 71 34 75 30 75 C23 75 19 69 19 58 C19 40 31 24 45 18 C44 13 47 11 50 11 Z"
          fill={bodyFill}
          stroke="var(--c-secondary)"
          strokeWidth="1.5"
        />
        {/* Saturated inner belly glow */}
        <ellipse cx="49" cy="54" rx="22" ry="17" fill={bodyInner} opacity="0.7" />
        {/* Soft top-left highlight */}
        <ellipse
          cx="34"
          cy="35"
          rx="9.5"
          ry="4.2"
          transform="rotate(-28 34 35)"
          fill={rimHi}
          opacity="0.7"
        />

        {/* Crooked forehead ofuda talisman */}
        <g transform="rotate(-7 49 24)">
          <rect x="43" y="16" width="12" height="17" rx="2.5" fill="var(--c-border)" />
          <rect x="43" y="14.5" width="12" height="16" rx="2.5" fill={CREAM} />
          <rect x="45" y="16.5" width="8" height="2.2" rx="1" fill="var(--c-accent)" />
          <path
            d="M49 20.5 V27.5 M46.5 23 L51.5 25"
            stroke="var(--c-accent)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Stubby inky paws */}
        <g className="enemy-part-arm-l" style={{ transformOrigin: '24px 56px' }}>
          <ellipse cx="18" cy="58" rx="6.5" ry="5.5" fill={bodyShade} />
          <ellipse cx="18" cy="56" rx="6.5" ry="5" fill={bodyFill} />
        </g>
        <g className="enemy-part-arm-r" style={{ transformOrigin: '74px 56px' }}>
          <ellipse cx="78" cy="58" rx="6.5" ry="5.5" fill={bodyShade} />
          <ellipse cx="78" cy="56" rx="6.5" ry="5" fill={bodyFill} />
        </g>

        {/* Cute-menacing face */}
        <ellipse cx="29" cy="56" rx="4.5" ry="2.6" fill="var(--c-petal)" opacity="0.75" />
        <ellipse cx="69" cy="56" rx="4.5" ry="2.6" fill="var(--c-petal)" opacity="0.75" />
        {/* Furrowed / pained golden brows */}
        <path
          d={
            state === 'hit' || state === 'defeat'
              ? 'M31 44 L43 40 M67 44 L55 40'
              : 'M31 41 L43 45 M67 41 L55 45'
          }
          stroke="var(--c-glow)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <YokaiEyes
          state={state}
          x1={37}
          x2={61}
          y={50}
          iris="var(--c-glow)"
          pupil={INK}
          hurtStroke={CREAM}
        />
        {/* Cheeky fanged imp grin */}
        <path
          d={state === 'attack' ? 'M37 59 C37 69 61 69 61 59 Z' : 'M39 60 C39 67 59 67 59 60 Z'}
          fill="var(--c-lacquer)"
        />
        <ellipse cx="49" cy="64" rx="5.5" ry="2.6" fill="var(--c-accent)" />
        <path d="M41.5 60 L43.5 63.5 L45.5 60 Z M52.5 60 L54.5 63.5 L56.5 60 Z" fill={CREAM} />
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <>
            <g className="enemy-part-tail" style={{ transformOrigin: '64px 66px' }}>
              <path
                d="M62 67 L82 32"
                stroke={fill}
                strokeWidth="8.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M77 38 L83 28"
                stroke={fill}
                strokeWidth="9.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M82 30 C75 22 79 10 91 9 C93 19 91 29 82 30 Z" fill={fill} />
            </g>
            <path
              d="M50 15 C54 15 57 19 54 24 C69 29 79 44 79 62 C79 73 73 79 66 79 C62 79 60 75 56 75 C53 75 52 79 48 79 C44 79 43 75 40 75 C36 75 34 79 30 79 C23 79 19 73 19 62 C19 44 31 28 45 22 C44 17 47 15 50 15 Z"
              fill={fill}
            />
            <path
              d="M50 11 C54 11 57 15 54 20 C69 25 79 40 79 58 C79 69 73 75 66 75 C62 75 60 71 56 71 C53 71 52 75 48 75 C44 75 43 71 40 71 C36 71 34 75 30 75 C23 75 19 69 19 58 C19 40 31 24 45 18 C44 13 47 11 50 11 Z"
              fill={fill}
              stroke={fill}
              strokeWidth="1.5"
            />
            <g className="enemy-part-arm-l" style={{ transformOrigin: '24px 56px' }}>
              <ellipse cx="18" cy="58" rx="6.5" ry="5.5" fill={fill} />
              <ellipse cx="18" cy="56" rx="6.5" ry="5" fill={fill} />
            </g>
            <g className="enemy-part-arm-r" style={{ transformOrigin: '74px 56px' }}>
              <ellipse cx="78" cy="58" rx="6.5" ry="5.5" fill={fill} />
              <ellipse cx="78" cy="56" rx="6.5" ry="5" fill={fill} />
            </g>
          </>
        )}
      />
    </>
  );
}

/** 2. GLITCHLING (文字化け子): hovering spirit of scrambled kana tiles with bracket horns. */
function GlitchlingArt({ state }: { state: EnemyState }) {
  return (
    <>
      {/* Soft hovering ground shadow on the path */}
      <g className="enemy-shadow enemy-shadow-float">
        <ellipse cx="50" cy="92" rx="26" ry="5.5" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="15" ry="3" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body">
        {/* Chromatic glitch ghost slabs behind main tile */}
        <rect
          className="enemy-glitch-r"
          x="18"
          y="22"
          width="56"
          height="50"
          rx="14"
          fill="var(--c-accent)"
          opacity="0.55"
        />
        <rect
          className="enemy-glitch-c"
          x="26"
          y="20"
          width="56"
          height="50"
          rx="14"
          fill="var(--c-secondary)"
          opacity="0.55"
        />

        {/* Orbiting mini kana tiles */}
        <g className="enemy-orb-1" transform="rotate(-16 14 31)">
          <rect x="5" y="23" width="18" height="21" rx="5" fill="var(--c-lacquer)" />
          <rect x="5" y="20.5" width="18" height="20.5" rx="5" fill={CREAM} />
          <rect
            x="6.5"
            y="22"
            width="15"
            height="17.5"
            rx="3.5"
            fill="none"
            stroke="var(--c-panel-edge)"
            strokeWidth="1.5"
          />
          {/* Geometric katakana ア stroke */}
          <path
            d="M9.5 26.5 H18.5 L15 31 M14 29.5 C14 33.5 12.5 36 10.5 37.5"
            stroke="var(--c-accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        <g className="enemy-orb-2" transform="rotate(18 86 62)">
          <rect x="77" y="53" width="18" height="21" rx="5" fill="var(--c-secondary)" />
          <rect x="77" y="50.5" width="18" height="20.5" rx="5" fill={CREAM} />
          <rect
            x="78.5"
            y="52"
            width="15"
            height="17.5"
            rx="3.5"
            fill="none"
            stroke="var(--c-panel-edge)"
            strokeWidth="1.5"
          />
          {/* Geometric katakana カ stroke */}
          <path
            d="M81 58 H90.5 L89 65.5 M86 55 V61 C86 64 84 66 82 67"
            stroke="var(--c-secondary)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Dangling lower tile tassets */}
        <g className="enemy-part-foot">
          <rect x="29" y="71" width="17" height="11" rx="4.5" fill="var(--c-lacquer)" />
          <rect x="29" y="68.5" width="17" height="10.5" rx="4.5" fill="var(--c-panel-edge)" />
          <rect x="54" y="71" width="17" height="11" rx="4.5" fill="var(--c-lacquer)" />
          <rect x="54" y="68.5" width="17" height="10.5" rx="4.5" fill="var(--c-panel-edge)" />
        </g>

        {/* Molded bracket horns { } on top */}
        <g className="enemy-part-horns">
          {/* Left { horn */}
          <path
            d="M36 23 L30 17 L34 13 L28 9"
            stroke={INK}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M36 21.5 L30 15.5 L34 11.5 L28 7.5"
            stroke="var(--c-secondary)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Right } horn */}
          <path
            d="M64 23 L70 17 L66 13 L72 9"
            stroke={INK}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M64 21.5 L70 15.5 L66 11.5 L72 7.5"
            stroke="var(--c-accent)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Main chunky karuta/mahjong kana tile head/body */}
        <g transform="rotate(-2 50 47)">
          {/* Darker 3D bottom lip & wooden bevel */}
          <rect x="21" y="25" width="58" height="51" rx="15" fill="var(--c-lacquer)" />
          <rect x="21" y="22" width="58" height="50" rx="15" fill="var(--c-panel-edge)" />
          {/* Cream tile face */}
          <rect x="21" y="19" width="58" height="49" rx="14" fill={CREAM} />
          {/* Inner recessed frame */}
          <rect
            x="25"
            y="23"
            width="50"
            height="41"
            rx="10"
            fill="none"
            stroke="var(--c-border)"
            strokeWidth="2.5"
          />
          {/* Top-left gloss highlight */}
          <ellipse
            cx="34"
            cy="27"
            rx="9"
            ry="3.5"
            transform="rotate(-18 34 27)"
            fill={SHINE}
            opacity="0.85"
          />
          {/* Vermilion hanko seal stamp & scrambled background strokes */}
          <circle cx="67" cy="30" r="4.5" fill="var(--c-accent)" />
          <circle cx="67" cy="30" r="2" fill={CREAM} />
          <path
            d="M32 31 H56 M44 26 V37"
            stroke="var(--c-border)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Dark spirit visor band */}
          <rect x="26" y="39" width="48" height="25" rx="10" fill="var(--c-secondary)" />
          <rect x="26" y="37" width="48" height="24" rx="10" fill={INK} />

          {/* Glitching eyes inside visor */}
          {state === 'hit' ? (
            <g>
              {/* Pained digital brows + squeezed > < pixel visor eyes */}
              <path
                d="M32 40.5 L41 42.5 M68 40.5 L59 42.5"
                stroke="var(--c-accent)"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M32 43.5 L42 47.5 L32 51.5"
                stroke="var(--c-glow)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M68 43.5 L58 47.5 L68 51.5"
                stroke="var(--c-accent)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Tiny sweat drop at right temple */}
              <path
                d="M74 37 C76.5 41 76.5 44 74 44 C71.5 44 71.5 41 74 37 Z"
                fill="var(--c-secondary-soft)"
                stroke="var(--c-secondary)"
                strokeWidth="1"
              />
            </g>
          ) : state === 'defeat' ? (
            <g>
              {/* Swirly spiral KO eyes inside visor */}
              <path
                d={spiralEyePath(37.5, 46.8, 1)}
                stroke="var(--c-glow)"
                strokeWidth="2.3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={spiralEyePath(62, 46.8, -1)}
                stroke="var(--c-accent)"
                strokeWidth="2.3"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : (
            <g className="enemy-blink" style={{ transformOrigin: '50px 47px' }}>
              {/* Left square pixel-spirit eye */}
              <rect x="32" y="42" width="11" height="9" rx="2.5" fill="var(--c-glow)" />
              <rect x="35" y="44" width="5" height="5" rx="1" fill={INK} />
              <circle cx="34" cy="44" r="1.5" fill={SHINE} />
              {/* Right mismatched round/ring glitch eye */}
              <circle cx="62" cy="46.5" r="6" fill="var(--c-accent)" />
              <circle cx="62" cy="46.5" r="3.2" fill="var(--c-glow)" />
              <circle cx="60.5" cy="45" r="1.5" fill={SHINE} />
            </g>
          )}

          {/* Jagged pixel-wave mouth */}
          <path
            d="M35 56 L40 53 L45 56.5 L50 53 L55 56.5 L60 53 L65 56"
            stroke="var(--c-glow)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <>
            <g className="enemy-orb-1" transform="rotate(-16 14 31)">
              <rect x="5" y="20.5" width="18" height="23.5" rx="5" fill={fill} />
            </g>
            <g className="enemy-orb-2" transform="rotate(18 86 62)">
              <rect x="77" y="50.5" width="18" height="23.5" rx="5" fill={fill} />
            </g>
            <g className="enemy-part-foot">
              <rect x="29" y="68.5" width="17" height="13.5" rx="4.5" fill={fill} />
              <rect x="54" y="68.5" width="17" height="13.5" rx="4.5" fill={fill} />
            </g>
            <g className="enemy-part-horns">
              <path
                d="M36 23 L30 17 L34 13 L28 9"
                stroke={fill}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M64 23 L70 17 L66 13 L72 9"
                stroke={fill}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
            <g transform="rotate(-2 50 47)">
              <rect x="21" y="19" width="58" height="57" rx="15" fill={fill} />
            </g>
          </>
        )}
      />
    </>
  );
}

/** 3. KASA-OBAKE (傘お化け): one-eyed hopping wagasa umbrella spirit on a wooden geta sandal. */
function KasaObakeArt({ state }: { state: EnemyState }) {
  const skinShade = 'color-mix(in srgb, var(--c-skin) 70%, var(--c-hud-bg))';
  const indigoShade = 'color-mix(in srgb, var(--c-secondary) 64%, var(--c-hud-bg))';

  return (
    <>
      {/* Crisp grounded shadow on the path */}
      <g className="enemy-shadow enemy-shadow-hop">
        <ellipse cx="50" cy="92" rx="23" ry="5.5" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="13" ry="3" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body">
        {/* Single hopping leg & traditional two-tooth wooden geta sandal */}
        <g className="enemy-part-foot" style={{ transformOrigin: '50px 72px' }}>
          {/* Chibi ankle */}
          <rect x="44" y="67" width="12" height="19" rx="6" fill={skinShade} />
          <rect x="44" y="65" width="12" height="17" rx="6" fill="var(--c-skin)" />
          {/* Geta wooden teeth touching the ground */}
          <rect x="39" y="86" width="5" height="6" rx="1.5" fill={INK} />
          <rect x="56" y="86" width="5" height="6" rx="1.5" fill={INK} />
          {/* Geta wooden platform (bottom shade + top) */}
          <rect x="35" y="84" width="30" height="5.5" rx="2.75" fill="var(--c-gold)" />
          <rect x="35" y="82" width="30" height="5" rx="2.5" fill="var(--c-panel-edge)" />
          {/* Vermilion hanao strap */}
          <path
            d="M40 83 Q50 77 60 83"
            stroke="var(--c-lacquer)"
            strokeWidth="4.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M40 82 Q50 76 60 82"
            stroke="var(--c-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="50" cy="79.5" r="2.2" fill="var(--c-glow)" />
        </g>

        {/* Little side hands peeking from umbrella ribs */}
        <g className="enemy-part-arm-l" style={{ transformOrigin: '20px 58px' }}>
          <circle cx="14" cy="59" r="5.5" fill={skinShade} />
          <circle cx="14" cy="57.5" r="5.5" fill="var(--c-skin)" />
        </g>
        <g className="enemy-part-arm-r" style={{ transformOrigin: '80px 58px' }}>
          <circle cx="86" cy="59" r="5.5" fill={skinShade} />
          <circle cx="86" cy="57.5" r="5.5" fill="var(--c-skin)" />
        </g>

        {/* Top bamboo finial & rain cap */}
        <rect x="46.5" y="7" width="7" height="11" rx="3.5" fill="var(--c-gold)" />
        <rect x="47" y="6" width="6" height="9" rx="3" fill="var(--c-glow)" />
        <path d="M39 18 C43 12 57 12 61 18 Z" fill={INK} />

        {/* Umbrella canopy darker bottom shade lip */}
        <path
          d="M13 66 C15 31 30 16 50 16 C70 16 85 31 87 66 C81 62 75 63 72 68 C66 63 59 63 56 69 C52 64 48 64 44 69 C41 63 34 63 28 68 C25 63 19 62 13 66 Z"
          fill="var(--c-lacquer)"
        />
        {/* Outer vermilion umbrella dome */}
        <path
          d="M13 62 C15 28 30 14 50 14 C70 14 85 28 87 62 C81 58 75 59 72 64 C66 59 59 59 56 65 C52 60 48 60 44 65 C41 59 34 59 28 64 C25 59 19 58 13 62 Z"
          fill="var(--c-accent)"
        />
        {/* Alternating indigo pleated panels for 3D wagasa volume */}
        <path
          d="M50 14 C39 24 31 41 28 64 C34 59 41 59 44 65 C45 42 47 26 50 14 Z"
          fill={indigoShade}
        />
        <path
          d="M50 14 C39 24 31 40 28 61.5 C34 57 41 57 44 62.5 C45 40 47 25 50 14 Z"
          fill="var(--c-secondary)"
        />
        <path
          d="M50 14 C61 24 69 41 72 64 C66 59 59 59 56 65 C55 42 53 26 50 14 Z"
          fill={indigoShade}
        />
        <path
          d="M50 14 C61 24 69 40 72 61.5 C66 57 59 57 56 62.5 C55 40 53 25 50 14 Z"
          fill="var(--c-secondary)"
        />
        {/* Classic janome cream & gold ring stripe across upper dome */}
        <path
          d="M23 35 Q50 43 77 35"
          stroke={CREAM}
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.88"
        />
        <path
          d="M27 28 Q50 34 73 28"
          stroke="var(--c-glow)"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Soft top-left highlight */}
        <ellipse
          cx="30"
          cy="29"
          rx="8.5"
          ry="3.6"
          transform="rotate(-32 30 29)"
          fill={SHINE}
          opacity="0.7"
        />

        {/* Giant Cyclops Eye */}
        <path
          d={
            state === 'hit' || state === 'defeat'
              ? 'M36 26 L50 32 L64 26'
              : 'M36 28 Q50 34 64 28'
          }
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {state === 'hit' ? (
          <g>
            <circle cx="50" cy="42" r="12.5" fill="var(--c-lacquer)" />
            <circle cx="50" cy="40.5" r="12" fill={CREAM} />
            {/* Squeezed > < pinch inside giant cyclops eye */}
            <path
              d="M40 35.5 L48 40.5 L40 45.5 M60 35.5 L52 40.5 L60 45.5 M47 40.5 H53"
              stroke={INK}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Flying sweat drop */}
            <path
              d="M67 28 C69.8 32.5 69.8 36 67 36 C64.2 36 64.2 32.5 67 28 Z"
              fill="var(--c-secondary-soft)"
              stroke="var(--c-secondary)"
              strokeWidth="1.2"
            />
            <circle cx="66.2" cy="33.5" r="1" fill={SHINE} />
          </g>
        ) : state === 'defeat' ? (
          <g>
            <circle cx="50" cy="42" r="12.5" fill="var(--c-lacquer)" />
            <circle cx="50" cy="40.5" r="12" fill={CREAM} />
            {/* Giant swirly spiral KO cyclops eye */}
            <path
              d="M50 40.5 C52.5 38 54.5 42 50 44 C45 44.5 43.5 37.5 50 34.5 C56.5 34 58.5 43.5 51.5 48 C44 49 40 39.5 43.5 33.5 C47.5 29.5 56 30.5 59.5 36.5"
              stroke={INK}
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          <g className="enemy-blink" style={{ transformOrigin: '50px 41px' }}>
            <circle cx="50" cy="42.5" r="13" fill="var(--c-lacquer)" />
            <circle cx="50" cy="40.5" r="12.5" fill={CREAM} />
            <circle cx="50" cy="41" r="7.8" fill="var(--c-glow)" />
            <circle cx="50" cy="41" r="5.2" fill="var(--c-accent)" />
            <circle cx="50" cy="41" r="3" fill={INK} />
            <circle cx="46.8" cy="37.8" r="2.6" fill={SHINE} />
            <circle cx="53" cy="43.5" r="1.2" fill={SHINE} />
          </g>
        )}

        {/* Grinning mouth & long curling yokai tongue */}
        <path d="M37 55 C39 65 61 65 63 55 Z" fill={INK} />
        <path d="M40 55 L42.5 59 L45 55 Z M55 55 L57.5 59 L60 55 Z" fill={CREAM} />
        <g className="enemy-part-tongue" style={{ transformOrigin: '50px 58px' }}>
          <path
            d="M45 57 C45 73 61 78 69 70 C74 65 70 58 64 62 C61 64 56 64 55 57 Z"
            fill="var(--c-lacquer)"
          />
          <path
            d="M45 56 C45 71 61 75 68 68 C73 63 69 57 64 60.5 C61 62.5 56 62.5 55 56 Z"
            fill="var(--c-petal)"
          />
          <path
            d="M49 60 C50 67 59 70 64 66"
            stroke={SHINE}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        </g>
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <>
            <g className="enemy-part-foot" style={{ transformOrigin: '50px 72px' }}>
              <rect x="44" y="65" width="12" height="21" rx="6" fill={fill} />
              <rect x="39" y="86" width="5" height="6" rx="1.5" fill={fill} />
              <rect x="56" y="86" width="5" height="6" rx="1.5" fill={fill} />
              <rect x="35" y="82" width="30" height="7.5" rx="2.75" fill={fill} />
            </g>
            <g className="enemy-part-arm-l" style={{ transformOrigin: '20px 58px' }}>
              <circle cx="14" cy="58.2" r="6" fill={fill} />
            </g>
            <g className="enemy-part-arm-r" style={{ transformOrigin: '80px 58px' }}>
              <circle cx="86" cy="58.2" r="6" fill={fill} />
            </g>
            <rect x="46.5" y="6" width="7" height="12" rx="3.5" fill={fill} />
            <path d="M39 18 C43 12 57 12 61 18 Z" fill={fill} />
            <path
              d="M13 66 C15 31 30 16 50 16 C70 16 85 31 87 66 C81 62 75 63 72 68 C66 63 59 63 56 69 C52 64 48 64 44 69 C41 63 34 63 28 68 C25 63 19 62 13 66 Z"
              fill={fill}
            />
            <path
              d="M13 62 C15 28 30 14 50 14 C70 14 85 28 87 62 C81 58 75 59 72 64 C66 59 59 59 56 65 C52 60 48 60 44 65 C41 59 34 59 28 64 C25 59 19 58 13 62 Z"
              fill={fill}
            />
          </>
        )}
      />
    </>
  );
}

/** 4. KITSUNE (妖狐): mischievous chibi fox yokai with shrine bell & dancing kitsunebi fox-fire. */
function KitsuneArt({ state }: { state: EnemyState }) {
  const furShade = 'var(--c-gold)';
  const furMain = 'color-mix(in srgb, var(--c-glow) 82%, var(--c-accent))';

  return (
    <>
      {/* Grounded shadow on the path */}
      <g className="enemy-shadow">
        <ellipse cx="50" cy="92" rx="25" ry="5.5" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="15" ry="3" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body">
        {/* Dancing kitsunebi (fox-fire) spirit wisps */}
        <g className="enemy-orb-1">
          <path d="M12 32 C18 39 18 47 12 49 C6 47 6 39 12 32 Z" fill="var(--c-secondary)" />
          <path d="M12 36 C16 41 16 46 12 47.5 C8 46 8 41 12 36 Z" fill="var(--c-glow)" />
          <circle cx="12" cy="43.5" r="2.2" fill={SHINE} />
        </g>
        <g className="enemy-orb-2">
          <path
            d="M88 22 C93.5 28 93.5 35 88 37 C82.5 35 82.5 28 88 22 Z"
            fill="var(--c-secondary)"
          />
          <path d="M88 25.5 C92 30 92 34.5 88 35.8 C84 34.5 84 30 88 25.5 Z" fill="var(--c-glow)" />
          <circle cx="88" cy="32" r="2" fill={SHINE} />
        </g>

        {/* Big fluffy swirling fox tail */}
        <g className="enemy-part-tail" style={{ transformOrigin: '60px 78px' }}>
          <path
            d="M58 82 C78 84 93 69 90 50 C88 40 78 38 74 45 C70 52 62 64 56 74 Z"
            fill={furShade}
          />
          <path
            d="M58 79 C77 81 92 66 89 48 C87 38 77 36 73 43 C69 50 62 62 56 72 Z"
            fill={furMain}
          />
          {/* Cream tail tip & vermilion flame swirl */}
          <path
            d="M89 48 C87 38 77 36 73 43 C71 47 69 51 67 55 C75 58 84 55 89 48 Z"
            fill={CREAM}
          />
          <path
            d="M72 56 Q80 52 85 57"
            stroke="var(--c-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Chibi fox torso & dark-socked paws planted on the path */}
        <ellipse cx="38" cy="89" rx="8.5" ry="4.5" fill={INK} />
        <ellipse cx="62" cy="89" rx="8.5" ry="4.5" fill={INK} />
        <rect x="31" y="62" width="38" height="27" rx="15" fill={furShade} />
        <rect x="31" y="59" width="38" height="26" rx="14.5" fill={furMain} />
        {/* Fluffy cream chest tuft */}
        <path d="M40 64 C40 77 60 77 60 64 Z" fill={CREAM} />
        {/* Vermilion shrine bib collar & golden suzu bell */}
        <rect x="33" y="60" width="34" height="6.5" rx="3.2" fill="var(--c-lacquer)" />
        <rect x="33" y="58.5" width="34" height="5.5" rx="2.75" fill="var(--c-accent)" />
        <circle cx="50" cy="65.5" r="5.5" fill="var(--c-gold)" />
        <circle cx="50" cy="64" r="5.2" fill="var(--c-glow)" />
        <circle cx="50" cy="65.2" r="1.6" fill={INK} />

        {/* Left & right pointed fox ears */}
        <path d="M22 38 C16 22 20 9 29 9 C37 9 43 20 45 34 Z" fill={furShade} />
        <path d="M22 36 C16 20 20 7 29 7 C37 7 43 18 45 32 Z" fill={furMain} />
        <path d="M20 20 C21 12 24 7 29 7 C34 7 38 12 40 19 Q29 23 20 20 Z" fill="var(--c-accent)" />
        <path d="M26 32 C24 23 26 16 30 16 C34 16 37 22 38 30 Z" fill="var(--c-petal)" />

        <path d="M78 38 C84 22 80 9 71 9 C63 9 57 20 55 34 Z" fill={furShade} />
        <path d="M78 36 C84 20 80 7 71 7 C63 7 57 18 55 32 Z" fill={furMain} />
        <path d="M80 20 C79 12 76 7 71 7 C66 7 62 12 60 19 Q71 23 80 20 Z" fill="var(--c-accent)" />
        <path d="M74 32 C76 23 74 16 70 16 C66 16 63 22 62 30 Z" fill="var(--c-petal)" />

        {/* Wide cheek-ruffed fox head (bottom shade + main + cream cheek masks) */}
        <path
          d="M17 48 C17 31 30 24 50 24 C70 24 83 31 83 48 C83 59 71 65 50 65 C29 65 17 59 17 48 Z"
          fill={furShade}
        />
        <path
          d="M17 45 C17 28 30 21 50 21 C70 21 83 28 83 45 C83 56 71 62 50 62 C29 62 17 56 17 45 Z"
          fill={furMain}
        />
        {/* Cream lower cheek ruffs */}
        <path
          d="M18 47 C23 43 33 45 40 52 C45 56 55 56 60 52 C67 45 77 43 82 47 C79 57 67 62 50 62 C33 62 21 57 18 47 Z"
          fill={CREAM}
        />
        {/* Soft top-left highlight */}
        <ellipse
          cx="35"
          cy="29"
          rx="9.5"
          ry="3.8"
          transform="rotate(-18 35 29)"
          fill={SHINE}
          opacity="0.7"
        />
        {/* Vermilion kitsune forehead flame mark & kabuki eye stripes */}
        <path d="M50 25 C53 30 53 35 50 37 C47 35 47 30 50 25 Z" fill="var(--c-accent)" />
        <path
          d="M23 41 Q28 39 32 42 M77 41 Q72 39 68 42"
          stroke="var(--c-accent)"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sly fox face */}
        <ellipse cx="29" cy="52" rx="4.5" ry="2.4" fill="var(--c-petal)" opacity="0.8" />
        <ellipse cx="71" cy="52" rx="4.5" ry="2.4" fill="var(--c-petal)" opacity="0.8" />
        <path
          d={
            state === 'hit' || state === 'defeat'
              ? 'M31 39 L43 35 M69 39 L57 35'
              : 'M31 37 Q37 35 43 39 M69 37 Q63 35 57 39'
          }
          stroke={INK}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <YokaiEyes
          state={state}
          x1={37}
          x2={63}
          y={45}
          iris={INK}
          pupil="var(--c-glow)"
          hurtStroke={INK}
        />
        {/* Button nose & fanged smirk */}
        <ellipse cx="50" cy="50" rx="3" ry="2" fill={INK} />
        <path d="M42 54 C44 60 56 60 58 54 Z" fill="var(--c-lacquer)" />
        <path d="M52 54 L54.2 58 L56.2 54 Z" fill={CREAM} />
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <>
            <g className="enemy-part-tail" style={{ transformOrigin: '60px 78px' }}>
              <path
                d="M58 82 C78 84 93 69 90 50 C88 40 78 38 74 45 C70 52 62 64 56 74 Z"
                fill={fill}
              />
              <path
                d="M58 79 C77 81 92 66 89 48 C87 38 77 36 73 43 C69 50 62 62 56 72 Z"
                fill={fill}
              />
            </g>
            <ellipse cx="38" cy="89" rx="8.5" ry="4.5" fill={fill} />
            <ellipse cx="62" cy="89" rx="8.5" ry="4.5" fill={fill} />
            <rect x="31" y="59" width="38" height="30" rx="15" fill={fill} />
            <path d="M22 38 C16 22 20 9 29 9 C37 9 43 20 45 34 Z" fill={fill} />
            <path d="M22 36 C16 20 20 7 29 7 C37 7 43 18 45 32 Z" fill={fill} />
            <path d="M78 38 C84 22 80 9 71 9 C63 9 57 20 55 34 Z" fill={fill} />
            <path d="M78 36 C84 20 80 7 71 7 C63 7 57 18 55 32 Z" fill={fill} />
            <path
              d="M17 48 C17 31 30 24 50 24 C70 24 83 31 83 48 C83 59 71 65 50 65 C29 65 17 59 17 48 Z"
              fill={fill}
            />
            <path
              d="M17 45 C17 28 30 21 50 21 C70 21 83 28 83 45 C83 56 71 62 50 62 C29 62 17 56 17 45 Z"
              fill={fill}
            />
          </>
        )}
      />
    </>
  );
}

/** 5. KAPPA (河童): chibi river imp yokai with crown water dish, tortoise shell & cucumber club. */
function KappaArt({ state }: { state: EnemyState }) {
  const greenShade = 'color-mix(in srgb, var(--c-success) 56%, var(--c-hud-bg))';
  const kelpShade = 'color-mix(in srgb, var(--c-success) 42%, var(--c-hud-bg))';
  const shellFill = 'color-mix(in srgb, var(--c-gold) 70%, var(--c-hud-bg))';

  return (
    <>
      {/* Grounded shadow on the path */}
      <g className="enemy-shadow">
        <ellipse cx="50" cy="92" rx="25" ry="5.5" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="15" ry="3" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body">
        {/* Tortoise carapace shell behind torso */}
        <rect x="22" y="54" width="56" height="33" rx="16.5" fill={INK} />
        <rect x="22" y="52" width="56" height="31" rx="15.5" fill={shellFill} />

        {/* Webbed green feet planted on the path */}
        <ellipse cx="37" cy="89" rx="10" ry="4.5" fill={greenShade} />
        <ellipse cx="37" cy="87.5" rx="9.5" ry="4" fill="var(--c-success)" />
        <ellipse cx="63" cy="89" rx="10" ry="4.5" fill={greenShade} />
        <ellipse cx="63" cy="87.5" rx="9.5" ry="4" fill="var(--c-success)" />

        {/* Chibi torso & tortoise plastron belly */}
        <rect x="28" y="58" width="44" height="30" rx="16" fill={greenShade} />
        <rect x="28" y="55" width="44" height="29" rx="15" fill="var(--c-success)" />
        <rect x="34" y="61" width="32" height="22" rx="10" fill="var(--c-gold)" />
        <rect x="34" y="59" width="32" height="21" rx="10" fill="var(--c-glow)" />
        <path
          d="M50 60 V79 M36 69 H64"
          stroke="var(--c-gold)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Left stubby arm */}
        <g className="enemy-part-arm-l" style={{ transformOrigin: '28px 64px' }}>
          <ellipse cx="22" cy="67" rx="7" ry="5.5" fill={greenShade} />
          <ellipse cx="22" cy="65" rx="7" ry="5" fill="var(--c-success)" />
        </g>

        {/* Right arm brandishing a prized cucumber (kyuri) club */}
        <g className="enemy-part-arm-r" style={{ transformOrigin: '72px 64px' }}>
          <g transform="rotate(18 82 54)">
            <rect x="76" y="34" width="12" height="34" rx="6" fill={kelpShade} />
            <rect x="76" y="32" width="12" height="32" rx="6" fill="var(--c-success)" />
            <circle cx="82" cy="34" r="3" fill="var(--c-glow)" />
            <circle cx="80" cy="42" r="1.3" fill={SHINE} />
            <circle cx="84" cy="49" r="1.3" fill={SHINE} />
            <circle cx="80" cy="55" r="1.3" fill={SHINE} />
          </g>
          <ellipse cx="76" cy="66" rx="7" ry="5.5" fill={greenShade} />
          <ellipse cx="76" cy="64" rx="7" ry="5" fill="var(--c-success)" />
        </g>

        {/* Big round chibi kappa head */}
        <rect x="19" y="25" width="62" height="41" rx="20.5" fill={greenShade} />
        <rect x="19" y="22" width="62" height="40" rx="20" fill="var(--c-success)" />
        {/* Soft top-left highlight */}
        <ellipse
          cx="32"
          cy="31"
          rx="8.5"
          ry="3.5"
          transform="rotate(-20 32 31)"
          fill={SHINE}
          opacity="0.65"
        />

        {/* Leafy kelp crown fringe & shimmering water dish (sara) */}
        <path
          d="M23 24 C23 16 35 13 50 13 C65 13 77 16 77 24 C73 28 68 25 65 28 C60 25 55 26 50 29 C45 26 40 25 35 28 C32 25 27 28 23 24 Z"
          fill={kelpShade}
        />
        <ellipse cx="50" cy="20" rx="20" ry="6" fill="var(--c-border)" />
        <ellipse cx="50" cy="19" rx="20" ry="5.5" fill={CREAM} />
        <ellipse cx="50" cy="19" rx="16.5" ry="4.2" fill="var(--c-secondary)" />
        <ellipse cx="47" cy="18.2" rx="10" ry="2.2" fill="var(--c-secondary-soft)" />
        <ellipse cx="42" cy="17.8" rx="4" ry="1" fill={SHINE} />

        {/* Splashing water droplet orb above the dish */}
        <g className="enemy-orb-1">
          <path d="M68 7 C71 11 71 15 68 15 C65 15 65 11 68 7 Z" fill="var(--c-secondary)" />
          <circle cx="67.2" cy="12" r="1.2" fill={SHINE} />
        </g>

        {/* Expressive face & plump golden beak */}
        <ellipse cx="28" cy="49" rx="4.5" ry="2.5" fill="var(--c-petal)" opacity="0.8" />
        <ellipse cx="72" cy="49" rx="4.5" ry="2.5" fill="var(--c-petal)" opacity="0.8" />
        <path
          d={
            state === 'hit' || state === 'defeat'
              ? 'M30 37 L42 33 M70 37 L58 33'
              : 'M30 35 L42 38 M70 35 L58 38'
          }
          stroke={kelpShade}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <YokaiEyes
          state={state}
          x1={36}
          x2={64}
          y={43}
          iris={CREAM}
          pupil={INK}
          hurtStroke={INK}
        />

        {/* Chibi duck beak */}
        <ellipse cx="50" cy="53" rx="11" ry="6.5" fill="var(--c-gold)" />
        <path d="M42 52 C44 58 56 58 58 52 Z" fill="var(--c-lacquer)" />
        <ellipse cx="50" cy="49.5" rx="11" ry="5" fill="var(--c-glow)" />
        <ellipse cx="47" cy="48" rx="4.5" ry="1.6" fill={SHINE} opacity="0.8" />
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <>
            <rect x="22" y="52" width="56" height="35" rx="16.5" fill={fill} />
            <ellipse cx="37" cy="88.5" rx="10" ry="5" fill={fill} />
            <ellipse cx="63" cy="88.5" rx="10" ry="5" fill={fill} />
            <rect x="28" y="55" width="44" height="33" rx="16" fill={fill} />
            <g className="enemy-part-arm-l" style={{ transformOrigin: '28px 64px' }}>
              <ellipse cx="22" cy="66" rx="7" ry="6" fill={fill} />
            </g>
            <g className="enemy-part-arm-r" style={{ transformOrigin: '72px 64px' }}>
              <g transform="rotate(18 82 54)">
                <rect x="76" y="32" width="12" height="36" rx="6" fill={fill} />
              </g>
              <ellipse cx="76" cy="65" rx="7" ry="6" fill={fill} />
            </g>
            <rect x="19" y="22" width="62" height="44" rx="20.5" fill={fill} />
            <path
              d="M23 24 C23 16 35 13 50 13 C65 13 77 16 77 24 C73 28 68 25 65 28 C60 25 55 26 50 29 C45 26 40 25 35 28 C32 25 27 28 23 24 Z"
              fill={fill}
            />
            <ellipse cx="50" cy="19.5" rx="20" ry="6.5" fill={fill} />
          </>
        )}
      />
    </>
  );
}

export function Enemy({
  kind,
  state = 'idle',
  size = 96,
}: {
  kind: EnemyKind;
  state?: EnemyState;
  size?: number;
}) {
  let content: ReactNode;
  switch (kind) {
    case 'inkling':
      content = <InklingArt state={state} />;
      break;
    case 'glitchling':
      content = <GlitchlingArt state={state} />;
      break;
    case 'kasa-obake':
      content = <KasaObakeArt state={state} />;
      break;
    case 'kitsune':
      content = <KitsuneArt state={state} />;
      break;
    case 'kappa':
      content = <KappaArt state={state} />;
      break;
  }

  return (
    <div
      className={`enemy enemy-${kind} enemy-${state}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {content}
      </svg>
    </div>
  );
}
