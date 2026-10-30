/**
 * Bamboo Thicket forest yokai that haunt travellers along the woodland road.
 * Pure 2D inline SVG + CSS animations (transform/opacity only), using theme tokens.
 */
import type { ReactNode } from 'react';
import {
  CREAM,
  type EnemyState,
  INK,
  SHINE,
  spiralEyePath,
  YokaiDamageFlash,
  YokaiEyes,
} from '../Enemy';
import './forest.css';

/**
 * 木霊 (こだま, Kodama): ancient tree spirit residing in old-growth forest trees, whose voice
 * answers travellers' calls across mountain valleys as echoes. Folklore warns that felling a tree
 * inhabited by a kodama brings misfortune upon the village (Toriyama Sekien, Gazu Hyakki Yagyō).
 */
export function KodamaArt({ state }: { state: EnemyState }): ReactNode {
  const spiritShade = 'color-mix(in srgb, var(--c-success) 56%, var(--c-hud-bg))';
  const spiritMid = 'color-mix(in srgb, var(--c-success-soft) 72%, var(--c-success))';
  const spiritFill = 'color-mix(in srgb, var(--c-hud-ink) 88%, var(--c-success-soft))';
  const mossShade = 'color-mix(in srgb, var(--c-success) 62%, var(--c-hud-bg))';
  const socketRing = 'color-mix(in srgb, var(--c-success) 38%, var(--c-hud-bg))';

  return (
    <g className={`kodama kodama-${state}`}>
      {/* Grounded shadow on the bamboo forest path */}
      <g className="enemy-shadow kodama-shadow">
        <ellipse cx="50" cy="92" rx="22" ry="5" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="13" ry="2.8" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body kodama-body">
        {/* Drifting forest-spirit light motes */}
        <g className="kodama-orb-1">
          <circle cx="16" cy="35.5" r="4" fill={mossShade} />
          <circle cx="16" cy="34" r="3.8" fill="var(--c-firefly)" />
          <circle cx="14.8" cy="32.8" r="1.3" fill={SHINE} />
        </g>
        <g className="kodama-orb-2">
          <circle cx="84" cy="29.5" r="3.4" fill={mossShade} />
          <circle cx="84" cy="28" r="3.2" fill="var(--c-success-soft)" />
          <circle cx="83" cy="27" r="1.1" fill={SHINE} />
        </g>

        {/* Stubby root-feet planted at y ~ 88 */}
        <ellipse cx="40" cy="89" rx="7.5" ry="4" fill={spiritShade} />
        <ellipse cx="40" cy="87" rx="7.5" ry="3.8" fill={spiritFill} />
        <ellipse cx="60" cy="89" rx="7.5" ry="4" fill={spiritShade} />
        <ellipse cx="60" cy="87" rx="7.5" ry="3.8" fill={spiritFill} />

        {/* Small pear-shaped pale wood-spirit torso (+3 shade lip + main) */}
        <rect x="33" y="59" width="34" height="29" rx="15" fill={spiritShade} />
        <rect
          x="33"
          y="56"
          width="34"
          height="28"
          rx="14.5"
          fill={spiritFill}
          stroke={spiritMid}
          strokeWidth="1.2"
        />
        {/* Soft celadon inner wood-heart glow & tree-ring whorl */}
        <ellipse cx="50" cy="71" rx="11" ry="9" fill={spiritMid} opacity="0.55" />
        <path
          d={spiralEyePath(50, 71, 1)}
          stroke={spiritShade}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.38"
        />
        {/* Top-left torso highlight */}
        <ellipse
          cx="41"
          cy="63"
          rx="5"
          ry="2.2"
          transform="rotate(-20 41 63)"
          fill={SHINE}
          opacity="0.65"
        />

        {/* Stubby pale arms */}
        <g className="kodama-arm-l">
          <ellipse cx="28" cy="68" rx="6" ry="4.8" fill={spiritShade} />
          <ellipse cx="28" cy="65.5" rx="6" ry="4.5" fill={spiritFill} />
        </g>
        <g className="kodama-arm-r">
          <ellipse cx="72" cy="68" rx="6" ry="4.8" fill={spiritShade} />
          <ellipse cx="72" cy="65.5" rx="6" ry="4.5" fill={spiritFill} />
        </g>

        {/* Oversized tilting & rattling gourd-round chibi head */}
        <g className="kodama-head">
          {/* Tiny twin-leaf sapling sprout on crown */}
          <g className="kodama-sapling">
            <path
              d="M50 20 V11"
              stroke={mossShade}
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M50 14 C42 13 38 8 44 6 C48 5 50 9 50 14 Z" fill={mossShade} />
            <path
              d="M50 12.5 C42 11.5 38 6.5 44 4.5 C48 3.5 50 7.5 50 12.5 Z"
              fill="var(--c-success)"
            />
            <path d="M50 14 C57 13 61 8 56 6 C52 5 50 9 50 14 Z" fill={mossShade} />
            <path
              d="M50 12.5 C57 11.5 61 6.5 56 4.5 C52 3.5 50 7.5 50 12.5 Z"
              fill="var(--c-success)"
            />
            <ellipse
              cx="45"
              cy="7.5"
              rx="2.4"
              ry="1"
              transform="rotate(-18 45 7.5)"
              fill={SHINE}
              opacity="0.55"
            />
          </g>

          {/* Slightly asymmetrical pebble-round kodama head (+3 shade lip + main) */}
          <path
            d="M20 42 C19 25 32 18 51 18 C69 18 81 26 80 43 C79 56 68 62 50 62 C31 62 21 56 20 42 Z"
            fill={spiritShade}
          />
          <path
            d="M20 39 C19 22 32 15 51 15 C69 15 81 23 80 40 C79 53 68 59 50 59 C31 59 21 53 20 39 Z"
            fill={spiritFill}
            stroke={spiritMid}
            strokeWidth="1.5"
          />

          {/* Subtle moss patches on upper-right brow */}
          <ellipse cx="67" cy="24" rx="5.5" ry="2.6" fill={spiritMid} opacity="0.75" />
          <circle cx="72" cy="27" r="2.2" fill="var(--c-success)" opacity="0.65" />

          {/* Soft top-left highlight */}
          <ellipse
            cx="35"
            cy="24"
            rx="9.5"
            ry="3.8"
            transform="rotate(-18 35 24)"
            fill={SHINE}
            opacity="0.75"
          />

          {/* Hollow dark eye sockets */}
          <ellipse cx="36" cy="41.5" rx="7.6" ry="8.2" fill={socketRing} opacity="0.55" />
          <ellipse cx="64" cy="40.5" rx="7.2" ry="7.8" fill={socketRing} opacity="0.55" />

          {/* Eyes via shared YokaiEyes: hollow dark in idle/attack, > < in hit, spirals in defeat */}
          <YokaiEyes state={state} x1={36} x2={64} y={41} iris={INK} pupil={INK} hurtStroke={INK} />

          {/* Soft forest blush */}
          <ellipse cx="26.5" cy="47.5" rx="4" ry="2.2" fill="var(--c-success)" opacity="0.45" />
          <ellipse cx="73.5" cy="47.5" rx="4" ry="2.2" fill="var(--c-success)" opacity="0.45" />

          {/* Tiny hollow O-mouth (widens when rattling out an echo in attack) */}
          <ellipse
            cx="50"
            cy="51.5"
            rx={state === 'attack' ? '5.4' : '3.2'}
            ry={state === 'attack' ? '6.2' : '3.8'}
            fill={socketRing}
          />
          <ellipse
            cx="50"
            cy="50.5"
            rx={state === 'attack' ? '4.6' : '2.6'}
            ry={state === 'attack' ? '5.4' : '3.2'}
            fill={INK}
          />
        </g>

        {/* Signature attack: concentric ripple of echo rings expanding toward lower-left */}
        <g className="kodama-echo-ring kodama-echo-ring-1">
          <ellipse
            cx="46"
            cy="50"
            rx="14"
            ry="11"
            transform="rotate(-24 46 50)"
            fill="none"
            stroke="var(--c-firefly)"
            strokeWidth="3"
          />
        </g>
        <g className="kodama-echo-ring kodama-echo-ring-2">
          <ellipse
            cx="43"
            cy="52"
            rx="20"
            ry="15.5"
            transform="rotate(-24 43 52)"
            fill="none"
            stroke="var(--c-success)"
            strokeWidth="2.6"
          />
        </g>
        <g className="kodama-echo-ring kodama-echo-ring-3">
          <ellipse
            cx="40"
            cy="54"
            rx="26"
            ry="20"
            transform="rotate(-24 40 54)"
            fill="none"
            stroke={CREAM}
            strokeWidth="2.2"
          />
        </g>
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <>
            <ellipse cx="40" cy="88" rx="7.5" ry="4.5" fill={fill} />
            <ellipse cx="60" cy="88" rx="7.5" ry="4.5" fill={fill} />
            <rect x="33" y="56" width="34" height="32" rx="15" fill={fill} />
            <g className="kodama-arm-l">
              <ellipse cx="28" cy="67" rx="6" ry="5.5" fill={fill} />
            </g>
            <g className="kodama-arm-r">
              <ellipse cx="72" cy="67" rx="6" ry="5.5" fill={fill} />
            </g>
            <g className="kodama-head">
              <path d="M50 14 C42 13 38 8 44 6 C48 5 50 9 50 14 Z" fill={fill} />
              <path d="M50 14 C57 13 61 8 56 6 C52 5 50 9 50 14 Z" fill={fill} />
              <path
                d="M20 42 C19 25 32 18 51 18 C69 18 81 26 80 43 C79 56 68 62 50 62 C31 62 21 56 20 42 Z"
                fill={fill}
              />
              <path
                d="M20 39 C19 22 32 15 51 15 C69 15 81 23 80 40 C79 53 68 59 50 59 C31 59 21 53 20 39 Z"
                fill={fill}
              />
            </g>
          </>
        )}
      />
    </g>
  );
}

/**
 * 化け狸 (ばけだぬき, Bake-danuki): the shape-shifting raccoon dog of Japanese folklore (such as
 * Sado's Danzaburō-danuki and the tanuki of Shikoku), wearing a straw kasa hat and a magic
 * transformation leaf on its head, carrying a tokkuri sake flask and kayoi-chō promissory note,
 * and drumming its round belly (hara-tsuzumi) in a puff of smoke.
 */
export function BakeDanukiArt({ state }: { state: EnemyState }): ReactNode {
  const furShade = 'color-mix(in srgb, var(--c-gold) 54%, var(--c-hud-bg))';
  const furMain = 'color-mix(in srgb, var(--c-gold) 82%, var(--c-accent))';
  const maskDark = 'color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-gold))';
  const bellyShade = 'color-mix(in srgb, var(--c-panel-edge) 68%, var(--c-hud-bg))';
  const bellyCream = 'color-mix(in srgb, var(--c-hud-ink) 90%, var(--c-gold-soft))';
  const leafShade = 'color-mix(in srgb, var(--c-success) 58%, var(--c-hud-bg))';
  const smokeShade = 'color-mix(in srgb, var(--c-fog) 65%, var(--c-hud-bg))';

  return (
    <g className={`bake-danuki bake-danuki-${state}`}>
      {/* Grounded shadow on the path */}
      <g className="enemy-shadow bake-danuki-shadow">
        <ellipse cx="50" cy="92" rx="26" ry="5.5" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="16" ry="3.2" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body bake-danuki-body">
        {/* Wide woven straw kasa hat slung behind the head (+3 shade lip + woven dome) */}
        <g>
          <ellipse cx="50" cy="27" rx="34" ry="13" fill={furShade} />
          <ellipse cx="50" cy="24" rx="34" ry="12.5" fill="var(--c-panel-edge)" />
          <ellipse cx="50" cy="22.5" rx="31" ry="10.5" fill="var(--c-glow)" />
          {/* Woven sedge radial ribs */}
          <path
            d="M21 24 Q50 15 79 24 M28 18 Q50 12 72 18"
            stroke="var(--c-gold)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        </g>

        {/* Plump striped raccoon-dog tail on the right */}
        <g className="bake-danuki-tail">
          <path
            d="M62 83 C80 85 93 73 90 57 C88 47 77 46 73 54 C69 61 65 70 60 77 Z"
            fill={furShade}
          />
          <path
            d="M62 80 C80 82 92 70 89 54 C87 44 76 43 72 51 C68 58 65 67 60 74 Z"
            fill={furMain}
          />
          {/* Dark tanuki tail tip & stripe bands */}
          <path
            d="M89 54 C87 44 76 43 72 51 C70 55 69 58 68 61 C76 64 84 61 89 54 Z"
            fill={maskDark}
          />
          <path
            d="M66 67 Q75 71 84 65"
            stroke={maskDark}
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Dark-pawed feet planted on the ground around y 88 */}
        <ellipse cx="37" cy="89" rx="9" ry="4.5" fill={INK} />
        <ellipse cx="37" cy="87.5" rx="8.5" ry="4" fill={maskDark} />
        <ellipse cx="63" cy="89" rx="9" ry="4.5" fill={INK} />
        <ellipse cx="63" cy="87.5" rx="8.5" ry="4" fill={maskDark} />

        {/* Wide chubby tanuki torso (+3 shade lip + main fur) */}
        <rect x="26" y="56" width="48" height="33" rx="18" fill={furShade} />
        <rect x="26" y="53" width="48" height="32" rx="17.5" fill={furMain} />

        {/* Big round belly-drum (hara-tsuzumi) */}
        <g className="bake-danuki-belly">
          <ellipse cx="50" cy="73.5" rx="18.5" ry="13.5" fill={bellyShade} />
          <ellipse cx="50" cy="70.5" rx="18.5" ry="13" fill={bellyCream} />
          {/* Cute X belly-button mark & top-left belly highlight */}
          <path
            d="M48 73 L52 77 M52 73 L48 77"
            stroke="var(--c-panel-edge)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <ellipse
            cx="42"
            cy="64"
            rx="5.5"
            ry="2.4"
            transform="rotate(-18 42 64)"
            fill={SHINE}
            opacity="0.7"
          />
        </g>

        {/* Red kasa hat cord tied under the chin */}
        <path
          d="M36 56 Q50 62 64 56"
          stroke="var(--c-lacquer)"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M36 55 Q50 61 64 55"
          stroke="var(--c-accent)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="50" cy="59" r="2.4" fill="var(--c-accent)" />

        {/* Left paw holding a ceramic sake flask (tokkuri) */}
        <g className="bake-danuki-arm-l">
          {/* Tokkuri sake bottle */}
          <g transform="rotate(-14 16 68)">
            <rect x="13" y="53" width="6" height="7" rx="2" fill={bellyShade} />
            <rect x="13" y="51.5" width="6" height="6" rx="2" fill={CREAM} />
            <ellipse cx="16" cy="70" rx="8.5" ry="10" fill={INK} />
            <ellipse cx="16" cy="67.5" rx="8.5" ry="9.5" fill="var(--c-secondary)" />
            {/* Cream upper ceramic glaze & red neck cord */}
            <path d="M8.5 64 C10 58 22 58 23.5 64 Q16 67 8.5 64 Z" fill={CREAM} />
            <rect x="12.5" y="56.5" width="7" height="2.4" rx="1.2" fill="var(--c-accent)" />
            <circle cx="16" cy="70.5" r="4.2" fill={CREAM} />
            <path
              d="M14.5 69 H17.5 M16 68.5 V72.5"
              stroke="var(--c-accent)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <ellipse
              cx="12.5"
              cy="64.5"
              rx="2.6"
              ry="1.1"
              transform="rotate(-22 12.5 64.5)"
              fill={SHINE}
              opacity="0.65"
            />
          </g>
          {/* Left tanuki paw */}
          <ellipse cx="25" cy="66" rx="6.5" ry="5" fill={INK} />
          <ellipse cx="25" cy="64" rx="6.5" ry="4.8" fill={maskDark} />
        </g>

        {/* Right paw holding a promissory credit ledger (kayoi-chō) */}
        <g className="bake-danuki-arm-r">
          {/* Kayoi-chō bound ledger book */}
          <g transform="rotate(14 84 67)">
            <rect x="75" y="56" width="16" height="22" rx="3" fill={INK} />
            <rect x="75" y="53.5" width="16" height="21" rx="3" fill={CREAM} />
            {/* Indigo spine binding & vertical brush ledger markings */}
            <rect x="87.5" y="53.5" width="3.5" height="21" rx="1.2" fill="var(--c-secondary)" />
            <path
              d="M80 58 V69 M84 58 V67 M78.5 61 H81.5 M78.5 65 H81.5"
              stroke={INK}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="80" cy="71" r="1.8" fill="var(--c-accent)" />
          </g>
          {/* Right tanuki paw */}
          <ellipse cx="75" cy="66" rx="6.5" ry="5" fill={INK} />
          <ellipse cx="75" cy="64" rx="6.5" ry="4.8" fill={maskDark} />
        </g>

        {/* Round tanuki ears with dark tips */}
        <circle cx="26" cy="26" r="8.5" fill={furShade} />
        <circle cx="26" cy="24" r="8.5" fill={maskDark} />
        <circle cx="27" cy="25.5" r="5" fill="var(--c-petal)" opacity="0.85" />

        <circle cx="74" cy="26" r="8.5" fill={furShade} />
        <circle cx="74" cy="24" r="8.5" fill={maskDark} />
        <circle cx="73" cy="25.5" r="5" fill="var(--c-petal)" opacity="0.85" />

        {/* Big round cheek-puffed chibi tanuki head (+3 shade lip + main) */}
        <path
          d="M18 45 C18 28 31 20 50 20 C69 20 82 28 82 45 C82 56 70 61 50 61 C30 61 18 56 18 45 Z"
          fill={furShade}
        />
        <path
          d="M18 42 C18 25 31 17 50 17 C69 17 82 25 82 42 C82 53 70 58 50 58 C30 58 18 53 18 42 Z"
          fill={furMain}
        />

        {/* Cream lower cheek muffs */}
        <path
          d="M19 44 C24 40 33 42 40 48 C45 52 55 52 60 48 C67 42 76 40 81 44 C78 53 67 58 50 58 C33 58 22 53 19 44 Z"
          fill={bellyCream}
        />

        {/* Top-left head highlight */}
        <ellipse
          cx="34"
          cy="25"
          rx="8.5"
          ry="3.4"
          transform="rotate(-18 34 25)"
          fill={SHINE}
          opacity="0.65"
        />

        {/* Signature dark raccoon-dog eye mask patches */}
        <ellipse
          cx="36"
          cy="41.5"
          rx="10.5"
          ry="8.8"
          transform="rotate(-10 36 41.5)"
          fill={maskDark}
        />
        <ellipse
          cx="64"
          cy="41.5"
          rx="10.5"
          ry="8.8"
          transform="rotate(10 64 41.5)"
          fill={maskDark}
        />

        {/* Magic transformation leaf resting on top of the forehead */}
        <g className="bake-danuki-leaf">
          <path d="M37 20 C41 11 55 9 63 17 C56 23 44 24 37 20 Z" fill={leafShade} />
          <path
            d="M37 17.5 C41 8.5 55 6.5 63 14.5 C56 20.5 44 21.5 37 17.5 Z"
            fill="var(--c-success)"
          />
          {/* Leaf stem & central vein */}
          <path
            d="M35 19 Q49 14.5 61 14.5"
            stroke="var(--c-firefly)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx="47"
            cy="12.5"
            rx="4"
            ry="1.4"
            transform="rotate(-14 47 12.5)"
            fill={SHINE}
            opacity="0.6"
          />
        </g>

        {/* Rosy cheeks, expressive brows & YokaiEyes */}
        <ellipse cx="26" cy="48.5" rx="4.5" ry="2.4" fill="var(--c-petal)" opacity="0.8" />
        <ellipse cx="74" cy="48.5" rx="4.5" ry="2.4" fill="var(--c-petal)" opacity="0.8" />
        <path
          d={
            state === 'hit' || state === 'defeat'
              ? 'M29 34 L41 31 M71 34 L59 31'
              : 'M29 32 Q36 29 42 33 M71 32 Q64 29 58 33'
          }
          stroke={bellyCream}
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        <YokaiEyes
          state={state}
          x1={36}
          x2={64}
          y={41.5}
          iris="var(--c-glow)"
          pupil={INK}
          hurtStroke={CREAM}
        />

        {/* Plump muzzle, dark button nose & cheeky grin */}
        <ellipse cx="50" cy="49" rx="8.5" ry="5.5" fill={bellyCream} />
        <ellipse cx="50" cy="46.5" rx="3.4" ry="2.3" fill={INK} />
        <circle cx="49" cy="45.8" r="0.9" fill={SHINE} />
        <path
          d={
            state === 'attack'
              ? 'M44 50.5 C45 55.5 55 55.5 56 50.5 Z'
              : 'M44 50.5 Q47 53.5 50 50.5 Q53 53.5 56 50.5'
          }
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill={state === 'attack' ? 'var(--c-lacquer)' : 'none'}
        />

        {/* Signature attack FX: belly-drum shockwaves & billowing transformation smoke puffs */}
        <g className="bake-danuki-drum-wave">
          <path
            d="M34 64 C27 70 29 81 38 84 M28 60 C19 68 22 83 33 88"
            stroke="var(--c-glow)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <g className="bake-danuki-smoke bake-danuki-smoke-1">
          <circle cx="34" cy="73" r="8" fill={smokeShade} />
          <circle cx="41" cy="76" r="6.5" fill={smokeShade} />
          <circle cx="34" cy="70.5" r="8" fill={CREAM} />
          <circle cx="41" cy="73.5" r="6.5" fill={CREAM} />
          <path
            d={spiralEyePath(34, 70.5, 1)}
            stroke="var(--c-fog)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <g className="bake-danuki-smoke bake-danuki-smoke-2">
          <circle cx="46" cy="80" r="7" fill={smokeShade} />
          <circle cx="46" cy="77.5" r="7" fill="var(--c-gold-soft)" />
        </g>
        <g className="bake-danuki-smoke bake-danuki-smoke-3">
          <circle cx="28" cy="63" r="6" fill={smokeShade} />
          <circle cx="28" cy="60.5" r="6" fill={CREAM} />
        </g>
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <>
            <ellipse cx="50" cy="25.5" rx="34" ry="14" fill={fill} />
            <g className="bake-danuki-tail">
              <path
                d="M62 83 C80 85 93 73 90 57 C88 47 77 46 73 54 C69 61 65 70 60 77 Z"
                fill={fill}
              />
              <path
                d="M62 80 C80 82 92 70 89 54 C87 44 76 43 72 51 C68 58 65 67 60 74 Z"
                fill={fill}
              />
            </g>
            <ellipse cx="37" cy="88.5" rx="9" ry="5" fill={fill} />
            <ellipse cx="63" cy="88.5" rx="9" ry="5" fill={fill} />
            <rect x="26" y="53" width="48" height="36" rx="18" fill={fill} />
            <g className="bake-danuki-arm-l">
              <ellipse cx="16" cy="68" rx="9" ry="11" fill={fill} />
              <ellipse cx="25" cy="65" rx="6.5" ry="5.5" fill={fill} />
            </g>
            <g className="bake-danuki-arm-r">
              <rect x="75" y="53.5" width="16" height="23.5" rx="3" fill={fill} />
              <ellipse cx="75" cy="65" rx="6.5" ry="5.5" fill={fill} />
            </g>
            <circle cx="26" cy="25" r="9" fill={fill} />
            <circle cx="74" cy="25" r="9" fill={fill} />
            <path
              d="M18 45 C18 28 31 20 50 20 C69 20 82 28 82 45 C82 56 70 61 50 61 C30 61 18 56 18 45 Z"
              fill={fill}
            />
            <path
              d="M18 42 C18 25 31 17 50 17 C69 17 82 25 82 42 C82 53 70 58 50 58 C30 58 18 53 18 42 Z"
              fill={fill}
            />
            <path d="M37 17.5 C41 8.5 55 6.5 63 14.5 C56 20.5 44 21.5 37 17.5 Z" fill={fill} />
          </>
        )}
      />
    </g>
  );
}

/**
 * 烏天狗 (からすてんぐ, Karasu-tengu): the crow-beaked mountain tengu of Japanese folklore (such as
 * the Kurama-tengu who trained young Minamoto no Yoshitsune), clad as a Shugendō yamabushi ascetic
 * with black feathered wings, a forehead tokin pillbox cap, a yuigesa pom-pom sash, a hauchiwa
 * feather fan that summons gales, and single-toothed ippon-ba geta.
 */
export function KarasuTenguArt({ state }: { state: EnemyState }): ReactNode {
  const featherShade = INK;
  const featherMain = 'color-mix(in srgb, var(--c-hud-bg) 70%, var(--c-secondary))';
  const featherHi = 'color-mix(in srgb, var(--c-secondary) 72%, var(--c-hud-ink))';
  const robeShade = 'color-mix(in srgb, var(--c-accent) 62%, var(--c-hud-bg))';
  const hakamaShade = 'color-mix(in srgb, var(--c-panel-edge) 65%, var(--c-hud-bg))';

  return (
    <g className={`karasu-tengu karasu-tengu-${state}`}>
      {/* Hovering ground shadow (shrinks in sync with wing hover) */}
      <g className="enemy-shadow karasu-tengu-shadow">
        <ellipse cx="50" cy="92" rx="24" ry="5.2" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="14" ry="2.8" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body karasu-tengu-body">
        {/* Spread black feathered crow wings behind shoulders */}
        <g className="karasu-tengu-wing-l">
          <path
            d="M35 58 C18 55 6 43 5 28 C12 28 20 32 25 37 C15 39 9 45 9 52 C16 51 22 53 26 56 C18 58 14 63 15 68 C22 66 29 64 35 61 Z"
            fill={featherShade}
          />
          <path
            d="M35 55 C18 52 6 40 5 25 C12 25 20 29 25 34 C15 36 9 42 9 49 C16 48 22 50 26 53 C18 55 14 60 15 65 C22 63 29 61 35 58 Z"
            fill={featherMain}
            stroke="var(--c-secondary)"
            strokeWidth="1.2"
          />
          <path
            d="M11 32 Q19 36 27 44 M14 45 Q21 48 28 53"
            stroke={featherHi}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
        </g>

        <g className="karasu-tengu-wing-r">
          <path
            d="M65 58 C82 55 94 43 95 28 C88 28 80 32 75 37 C85 39 91 45 91 52 C84 51 78 53 74 56 C82 58 86 63 85 68 C78 66 71 64 65 61 Z"
            fill={featherShade}
          />
          <path
            d="M65 55 C82 52 94 40 95 25 C88 25 80 29 75 34 C85 36 91 42 91 49 C84 48 78 50 74 53 C82 55 86 60 85 65 C78 63 71 61 65 58 Z"
            fill={featherMain}
            stroke="var(--c-secondary)"
            strokeWidth="1.2"
          />
          <path
            d="M89 32 Q81 36 73 44 M86 45 Q79 48 72 53"
            stroke={featherHi}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
        </g>

        {/* Hovering feet in single-toothed geta (ippon-ba geta) */}
        <g className="karasu-tengu-feet">
          {/* Left foot & one-toothed geta */}
          <rect x="35" y="74" width="8" height="7" rx="3.5" fill={featherMain} />
          {/* Single central wooden geta tooth */}
          <rect x="36.5" y="82" width="5" height="6.5" rx="1.2" fill="var(--c-lacquer)" />
          {/* Geta platform (+3 shade + top) */}
          <rect x="31" y="80.5" width="16" height="4" rx="1.8" fill="var(--c-gold)" />
          <rect x="31" y="79" width="16" height="3.5" rx="1.6" fill="var(--c-panel-edge)" />
          <path
            d="M34 79.5 Q39 76 44 79.5"
            stroke="var(--c-accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right foot & one-toothed geta */}
          <rect x="57" y="74" width="8" height="7" rx="3.5" fill={featherMain} />
          {/* Single central wooden geta tooth */}
          <rect x="58.5" y="82" width="5" height="6.5" rx="1.2" fill="var(--c-lacquer)" />
          {/* Geta platform (+3 shade + top) */}
          <rect x="53" y="80.5" width="16" height="4" rx="1.8" fill="var(--c-gold)" />
          <rect x="53" y="79" width="16" height="3.5" rx="1.6" fill="var(--c-panel-edge)" />
          <path
            d="M56 79.5 Q61 76 66 79.5"
            stroke="var(--c-accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Cream yamabushi hakama trousers & saffron suzukake tunic */}
        <rect x="32" y="66" width="36" height="12" rx="6" fill={hakamaShade} />
        <rect x="32" y="63.5" width="36" height="11.5" rx="5.5" fill={CREAM} />

        <rect x="30" y="52" width="40" height="19" rx="10" fill={robeShade} />
        <rect x="30" y="49" width="40" height="18" rx="9.5" fill="var(--c-accent)" />
        {/* Crossed collar & dark obi sash */}
        <path
          d="M42 50 L50 61 L58 50"
          stroke={CREAM}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <rect x="31" y="61.5" width="38" height="4.5" rx="2.2" fill={featherShade} />

        {/* Yamabushi pom-pom sash (yuigesa) with 4 golden-cream tufted pom-poms */}
        <path
          d="M36 52 L42 64 M64 52 L58 64"
          stroke="var(--c-gold)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="37" cy="57" r="4" fill="var(--c-gold)" />
        <circle cx="37" cy="55.2" r="3.8" fill="var(--c-glow)" />
        <circle cx="44" cy="63" r="4" fill="var(--c-gold)" />
        <circle cx="44" cy="61.2" r="3.8" fill={CREAM} />
        <circle cx="56" cy="63" r="4" fill="var(--c-gold)" />
        <circle cx="56" cy="61.2" r="3.8" fill={CREAM} />
        <circle cx="63" cy="57" r="4" fill="var(--c-gold)" />
        <circle cx="63" cy="55.2" r="3.8" fill="var(--c-glow)" />

        {/* Left feathered wing-hand */}
        <ellipse cx="27" cy="60" rx="5.5" ry="4.5" fill={featherShade} />
        <ellipse cx="27" cy="58" rx="5.5" ry="4.2" fill={featherMain} />

        {/* Right hand brandishing the multi-lobed hauchiwa feather fan */}
        <g className="karasu-tengu-fan">
          {/* Fan handle */}
          <path d="M70 63 L80 51" stroke={INK} strokeWidth="4.2" strokeLinecap="round" />
          {/* Scalloped vermilion hauchiwa feather fan (+3 shade + main lobes) */}
          <path
            d="M74 58 C69 49 74 37 83 37 C86 33 93 35 93 42 C98 44 97 52 91 55 C92 61 84 64 79 60 Z"
            fill="var(--c-lacquer)"
          />
          <path
            d="M74 55.5 C69 46.5 74 34.5 83 34.5 C86 30.5 93 32.5 93 39.5 C98 41.5 97 49.5 91 52.5 C92 58.5 84 61.5 79 57.5 Z"
            fill="var(--c-accent)"
          />
          {/* Golden sun-disc & feather veins on fan */}
          <circle cx="84.5" cy="47.5" r="4" fill="var(--c-glow)" />
          <path
            d="M77 53 L89 41 M81 55 L91 48 M76 47 L85 38"
            stroke="var(--c-glow)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <ellipse cx="73" cy="59" rx="5.5" ry="4.5" fill={featherShade} />
          <ellipse cx="73" cy="57" rx="5.5" ry="4.2" fill={featherMain} />
        </g>

        {/* Big chibi crow-tengu head with swept cheek-feather ruffs */}
        <path
          d="M16 41 C18 24 31 17 50 17 C69 17 82 24 84 41 C79 44 77 48 81 51 C73 56 63 58 50 58 C37 58 27 56 19 51 C23 48 21 44 16 41 Z"
          fill={featherShade}
        />
        <path
          d="M16 38 C18 21 31 14 50 14 C69 14 82 21 84 38 C79 41 77 45 81 48 C73 53 63 55 50 55 C37 55 27 53 19 48 C23 45 21 41 16 38 Z"
          fill={featherMain}
          stroke="var(--c-secondary)"
          strokeWidth="1.3"
        />

        {/* Top-left iridescent crow-feather highlight */}
        <ellipse
          cx="34"
          cy="24"
          rx="9"
          ry="3.6"
          transform="rotate(-20 34 24)"
          fill={featherHi}
          opacity="0.7"
        />

        {/* Forehead cord & small black yamabushi tokin pillbox cap */}
        <path
          d="M21 28 Q50 33 79 28"
          stroke="var(--c-accent)"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <g>
          {/* Tokin pillbox base (+3 shade + faceted black box + gold pleats) */}
          <polygon points="41,22 44,10 56,10 59,22" fill={featherShade} />
          <polygon
            points="41,19.5 44,8 56,8 59,19.5"
            fill={featherMain}
            stroke="var(--c-gold)"
            strokeWidth="1.4"
          />
          <path
            d="M46 9 L48 19 M54 9 L52 19 M50 8.5 V19"
            stroke="var(--c-glow)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <ellipse cx="50" cy="8.5" rx="6" ry="2" fill="var(--c-gold)" />
          <circle cx="50" cy="8.5" r="2.2" fill="var(--c-glow)" />
        </g>

        {/* Fierce white/gold feathered tengu brows & piercing YokaiEyes */}
        <path
          d={
            state === 'hit' || state === 'defeat'
              ? 'M26 36 L42 31 M74 36 L58 31'
              : 'M25 31 L42 36 M75 31 L58 36'
          }
          stroke={CREAM}
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />
        <YokaiEyes
          state={state}
          x1={35}
          x2={65}
          y={41}
          iris="var(--c-glow)"
          pupil={INK}
          hurtStroke={CREAM}
        />

        {/* Sculpted hooked crow beak in center of face (+3 shade + upper/lower mandibles) */}
        <g>
          {/* Lower beak / open squawk in attack */}
          <path
            d={state === 'attack' ? 'M41 46 L50 58 L59 46 Z' : 'M42 45 L50 54.5 L58 45 Z'}
            fill="var(--c-gold)"
          />
          {state === 'attack' && <path d="M44 46.5 L50 54 L56 46.5 Z" fill="var(--c-lacquer)" />}
          {/* Upper hooked crow beak */}
          <path d="M40 44 C43 37 57 37 60 44 L50 52.5 Z" fill="var(--c-glow)" />
          {/* Central beak ridge & top-left highlight */}
          <path d="M50 38.5 V51.5" stroke="var(--c-gold)" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse
            cx="46.5"
            cy="42"
            rx="3.2"
            ry="1.3"
            transform="rotate(-22 46.5 42)"
            fill={SHINE}
            opacity="0.85"
          />
        </g>

        {/* Signature attack FX: sweeping wind-gust arcs from the hauchiwa fan toward lower-left */}
        <g className="karasu-tengu-gust karasu-tengu-gust-1">
          <path
            d="M62 50 C44 54 28 66 20 82"
            stroke={CREAM}
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M56 44 C40 48 25 58 16 73"
            stroke="var(--c-secondary-soft)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <g className="karasu-tengu-gust karasu-tengu-gust-2">
          <path
            d="M66 58 C48 64 32 75 22 89"
            stroke="var(--c-firefly)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={spiralEyePath(26, 76, -1)}
            stroke={CREAM}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <g className="karasu-tengu-gust karasu-tengu-gust-3">
          <path
            d="M50 38 C34 44 20 55 11 69"
            stroke="var(--c-glow)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <>
            <g className="karasu-tengu-wing-l">
              <path
                d="M35 58 C18 55 6 43 5 28 C12 28 20 32 25 37 C15 39 9 45 9 52 C16 51 22 53 26 56 C18 58 14 63 15 68 C22 66 29 64 35 61 Z"
                fill={fill}
              />
              <path
                d="M35 55 C18 52 6 40 5 25 C12 25 20 29 25 34 C15 36 9 42 9 49 C16 48 22 50 26 53 C18 55 14 60 15 65 C22 63 29 61 35 58 Z"
                fill={fill}
              />
            </g>
            <g className="karasu-tengu-wing-r">
              <path
                d="M65 58 C82 55 94 43 95 28 C88 28 80 32 75 37 C85 39 91 45 91 52 C84 51 78 53 74 56 C82 58 86 63 85 68 C78 66 71 64 65 61 Z"
                fill={fill}
              />
              <path
                d="M65 55 C82 52 94 40 95 25 C88 25 80 29 75 34 C85 36 91 42 91 49 C84 48 78 50 74 53 C82 55 86 60 85 65 C78 63 71 61 65 58 Z"
                fill={fill}
              />
            </g>
            <g className="karasu-tengu-feet">
              <rect x="31" y="74" width="16" height="14.5" rx="2" fill={fill} />
              <rect x="53" y="74" width="16" height="14.5" rx="2" fill={fill} />
            </g>
            <rect x="30" y="49" width="40" height="29" rx="10" fill={fill} />
            <ellipse cx="27" cy="59" rx="5.5" ry="5" fill={fill} />
            <g className="karasu-tengu-fan">
              <path
                d="M74 58 C69 49 74 37 83 37 C86 33 93 35 93 42 C98 44 97 52 91 55 C92 61 84 64 79 60 Z"
                fill={fill}
              />
              <ellipse cx="73" cy="58" rx="5.5" ry="5" fill={fill} />
            </g>
            <polygon points="41,22 44,8 56,8 59,22" fill={fill} />
            <path
              d="M16 41 C18 24 31 17 50 17 C69 17 82 24 84 41 C79 44 77 48 81 51 C73 56 63 58 50 58 C37 58 27 56 19 51 C23 48 21 44 16 41 Z"
              fill={fill}
            />
            <path
              d="M16 38 C18 21 31 14 50 14 C69 14 82 21 84 38 C79 41 77 45 81 48 C73 53 63 55 50 55 C37 55 27 53 19 48 C23 45 21 41 16 38 Z"
              fill={fill}
            />
          </>
        )}
      />
    </g>
  );
}
