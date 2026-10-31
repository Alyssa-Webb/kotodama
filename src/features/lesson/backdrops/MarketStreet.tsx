/**
 * Self-contained SVG battle backdrops per story region (`0 0 400 156`, vanishing point at (248, 44),
 * horizon at y = 56). Each backdrop draws its own floor/street so it also works standalone.
 */
import '../battle-backdrops.css';
import './market-ukiyoe.css';

const SUMI = 'color-mix(in srgb, var(--c-hud-bg) 90%, var(--c-secondary))';
const WASHI = 'color-mix(in srgb, var(--c-hud-ink) 86%, var(--c-gold-soft))';
const WASHI_WARM = 'color-mix(in srgb, var(--c-glow) 62%, var(--c-hud-ink))';
const TIMBER_DARK = 'color-mix(in srgb, var(--c-panel-edge) 40%, var(--c-hud-bg))';
const TIMBER_MID = 'color-mix(in srgb, var(--c-panel-edge) 64%, var(--c-hud-bg))';
const TIMBER_GRAIN = 'color-mix(in srgb, var(--c-panel-edge) 26%, var(--c-hud-bg))';
const ROOF_TILE = 'color-mix(in srgb, var(--c-mountain-near) 68%, var(--c-hud-bg))';
const ROOF_LIP = 'color-mix(in srgb, var(--c-mountain-near) 42%, var(--c-hud-bg))';
const CEDAR_LIP = 'color-mix(in srgb, var(--c-success) 54%, var(--c-hud-bg))';
const INDIGO_LIP = 'color-mix(in srgb, var(--c-secondary) 56%, var(--c-hud-bg))';
const EARTH_VERGE = 'color-mix(in srgb, var(--c-mountain-near) 52%, var(--c-hud-bg))';
const STONE_CURB = 'color-mix(in srgb, var(--c-border) 54%, var(--c-hud-bg))';
const STREET_FLAT = 'color-mix(in srgb, var(--c-panel-edge) 44%, var(--c-surface-alt))';
const STREET_CENTER = 'color-mix(in srgb, var(--c-gold-soft) 56%, var(--c-surface-alt))';

/**
 * An Edo market street at dusk in Hiroshige ukiyo-e woodblock print style: bokashi indigo-to-peach
 * sky, flat carved colour blocks, varying-weight sumi contour lines, printed wood-grain lines on
 * the machiya and yatai stalls, flat vermilion chōchin lanterns, and an upper-corner red cartouche
 * bearing 市 (market).
 */
export function MarketStreetBackdrop({ className }: { className?: string }) {
  const cls =
    className && className !== 'battle-backdrop'
      ? `battle-backdrop ${className}`
      : 'battle-backdrop';
  return (
    <svg viewBox="0 0 400 156" preserveAspectRatio="xMidYMid slice" className={cls}>
      <defs>
        {/* Hand-wiped ichimonji bokashi dusk sky (the only gradient in the woodblock print) */}
        <linearGradient id="market-bokashi-sky" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="color-mix(in srgb, var(--c-secondary) 74%, var(--c-sky-top))"
          />
          <stop
            offset="34%"
            stopColor="color-mix(in srgb, var(--c-secondary) 46%, var(--c-sky-mid))"
          />
          <stop
            offset="68%"
            stopColor="color-mix(in srgb, var(--c-sky-mid) 74%, var(--c-sky-bottom))"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in srgb, var(--c-accent) 36%, var(--c-sky-bottom))"
          />
        </linearGradient>
      </defs>

      {/* Bokashi dusk sky block */}
      <rect width="400" height="58" fill="url(#market-bokashi-sky)" />

      {/* Stylized Edo suyari-gasumi horizontal woodblock cloud bands */}
      <g
        fill="color-mix(in srgb, var(--c-sky-bottom) 76%, var(--c-hud-ink))"
        stroke={SUMI}
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity="0.82"
      >
        <path d="M108 16 H184 C190 16 193 19 193 22 C193 25 189 27 182 27 H156 C162 27 165 30 165 33 C165 36 160 38 153 38 H108 Z" />
        <path d="M356 18 H266 C260 18 257 21 257 24 C257 27 261 29 268 29 H292 C286 29 283 32 283 35 C283 38 288 40 295 40 H356 Z" />
      </g>

      {/* Distant Edo skyline & hinomi-yagura watchtower silhouette at vanishing point (248, 44) */}
      <path
        d="M170 58 V42 L188 34 L208 40 V32 L226 26 L246 32 V40 L268 33 L292 42 V58 Z"
        fill="var(--c-mountain-far)"
        stroke={SUMI}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M214 32 Q237 25 260 32 L256 36 H218 Z M218 40 Q237 34 256 40 L253 44 H221 Z"
        fill="var(--c-mountain-near)"
        stroke={SUMI}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Flat woodblock market street running into the distance (y = 56..156, no gradients) */}
      <rect x="0" y="56" width="400" height="100" fill={EARTH_VERGE} />
      <path
        d="M218.5 56 L2 156 L298 156 L256.5 56 Z"
        fill={STONE_CURB}
        stroke={SUMI}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M222.8 56 L12.8 156 L288.3 156 L252.3 56 Z"
        fill={STREET_FLAT}
        stroke={SUMI}
        strokeWidth="1.1"
      />
      <path d="M230.5 56 L62 156 L242 156 L246 56 Z" fill={STREET_CENTER} opacity="0.68" />
      {/* Carved woodblock ground contours & perspective flagstone seams */}
      <path
        d="M0 56 H400 M198 68 H262 M162 84 H268 M116 106 H276 M58 134 H284"
        stroke={SUMI}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.38"
      />

      {/* Left wooden machiya fronts receding in perspective & sake shop sugidama ball */}
      <g>
        {/* Mid-distance left machiya with white-plaster (shikkui) upper storehouse wall */}
        <path
          d="M92 22 L214 36 V58 L92 84 Z"
          fill={TIMBER_DARK}
          stroke={SUMI}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M142 29 L198 35 V48 L142 54 Z"
          fill={WASHI}
          stroke={SUMI}
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <rect
          x="156"
          y="35"
          width="22"
          height="9"
          rx="1"
          fill={WASHI_WARM}
          stroke={SUMI}
          strokeWidth="1"
        />
        <path d="M163 35 V44 M171 35 V44" stroke={SUMI} strokeWidth="0.9" />
        <path d="M88 20 L218 35 L214 41 L84 28 Z" fill={ROOF_LIP} />
        <path
          d="M88 17.5 L218 33 L214 38.5 L84 25.5 Z"
          fill={ROOF_TILE}
          stroke={SUMI}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M112 20.5 L108 28 M142 24 L138 31 M172 27.5 L168 34.5 M198 30.5 L194 37"
          stroke={SUMI}
          strokeWidth="0.9"
          opacity="0.65"
        />

        {/* Foreground left two-story sake shop machiya */}
        <path d="M0 8 L104 22 V88 L0 124 Z" fill={TIMBER_DARK} />
        <path
          d="M0 10 L100 23 V84 L0 118 Z"
          fill={TIMBER_MID}
          stroke={SUMI}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Printed wood-grain lines on the machiya timber facade */}
        <path
          d="M6 52 L94 61 M6 66 L94 73 M12 80 L88 85 M28 45 V106 M56 48 V98 M82 51 V89"
          stroke={TIMBER_GRAIN}
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.78"
        />
        {/* Flat warm washi kōshi lattice windows */}
        <rect
          x="16"
          y="24"
          width="28"
          height="13"
          rx="1.5"
          fill={WASHI_WARM}
          stroke={SUMI}
          strokeWidth="1.3"
        />
        <rect
          x="54"
          y="28"
          width="24"
          height="12"
          rx="1.5"
          fill={WASHI_WARM}
          stroke={SUMI}
          strokeWidth="1.3"
        />
        <path
          d="M23 24 V37 M30 24 V37 M37 24 V37 M16 30.5 H44 M62 28 V40 M70 28 V40 M54 34 H78"
          stroke={SUMI}
          strokeWidth="1.1"
        />
        {/* Stepped clay-tile kawara eaves with +3 shade lip, carved ridges & top-left highlight */}
        <path d="M-4 4 L110 20 L104 28 L-4 14 Z" fill={ROOF_LIP} />
        <path
          d="M-4 1 L110 17 L104 25 L-4 11 Z"
          fill={ROOF_TILE}
          stroke={SUMI}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M-4 36 L108 48 L102 55 L-4 45 Z" fill={ROOF_LIP} />
        <path
          d="M-4 33 L108 45 L102 52 L-4 42 Z"
          fill={ROOF_TILE}
          stroke={SUMI}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M18 4 L14 13 M44 8 L40 17 M70 11.5 L66 20 M94 15 L90 23 M22 36 L18 44 M52 39 L48 47 M82 42 L78 50"
          stroke={SUMI}
          strokeWidth="1"
          opacity="0.7"
        />
        <ellipse
          cx="38"
          cy="39"
          rx="14"
          ry="1.8"
          transform="rotate(6 38 39)"
          fill="var(--c-hud-ink)"
          opacity="0.38"
        />

        {/* Stacked straw-wrapped sake barrels (kazaridaru) by the left shopfront */}
        <g transform="translate(10 82)">
          <rect x="0" y="3" width="22" height="22" rx="4" fill={TIMBER_DARK} />
          <rect
            x="0"
            y="0"
            width="22"
            height="22"
            rx="4"
            fill="var(--c-gold-soft)"
            stroke={SUMI}
            strokeWidth="1.6"
          />
          <path
            d="M2 7 H20 M2 15 H20 M6 1 V21 M16 1 V21"
            stroke="var(--c-panel-edge)"
            strokeWidth="1.5"
          />
          <circle cx="11" cy="11" r="4" fill="var(--c-accent)" stroke={SUMI} strokeWidth="1.2" />
        </g>

        {/* Sake shop's sugidama (cedar ball) hanging under the machiya eaves */}
        <g
          className="market-ukiyoe-sway"
          style={{ transformOrigin: '76px 46px' }}
          transform="translate(76 46)"
        >
          <rect x="-1" y="0" width="2" height="7" fill={SUMI} />
          <circle cx="0" cy="16" r="10.5" fill={CEDAR_LIP} />
          <circle
            cx="0"
            cy="13.5"
            r="10.5"
            fill="var(--c-success)"
            stroke={SUMI}
            strokeWidth="1.6"
          />
          <path
            d="M-6 6 L0 2.5 L6 6 Z"
            fill="var(--c-panel-edge)"
            stroke={SUMI}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M-5 13 Q0 11 5 13 M-6 17 Q0 15 6 17"
            stroke={CEDAR_LIP}
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx="-3.5"
            cy="10"
            rx="3.8"
            ry="1.7"
            transform="rotate(-16 -3.5 10)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
        </g>
      </g>

      {/* Left yatai food stall with bero-ai indigo noren (positioned left of the street edge) */}
      <g transform="translate(96 36)">
        <ellipse cx="32" cy="48" rx="30" ry="5" fill="var(--c-shadow)" />
        <rect
          x="6"
          y="12"
          width="52"
          height="34"
          rx="2"
          fill={TIMBER_DARK}
          stroke={SUMI}
          strokeWidth="1.5"
        />
        <rect
          x="10"
          y="15"
          width="44"
          height="19"
          rx="1.5"
          fill={WASHI_WARM}
          stroke={SUMI}
          strokeWidth="1.1"
        />
        {/* Wooden counter with +2.5 shade lip, printed wood grain & tri-color dango skewers */}
        <rect x="4" y="31.5" width="56" height="6" rx="2" fill={TIMBER_DARK} />
        <rect
          x="4"
          y="29"
          width="56"
          height="5.5"
          rx="2"
          fill="var(--c-panel-edge)"
          stroke={SUMI}
          strokeWidth="1.4"
        />
        <path
          d="M10 31.8 H34 M40 31.8 H54 M12 39 H52 M12 43 H52"
          stroke={TIMBER_GRAIN}
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="20" cy="26.5" r="2.1" fill="var(--c-petal)" stroke={SUMI} strokeWidth="0.9" />
        <circle cx="24" cy="26.5" r="2.1" fill={WASHI} stroke={SUMI} strokeWidth="0.9" />
        <circle cx="28" cy="26.5" r="2.1" fill="var(--c-success)" stroke={SUMI} strokeWidth="0.9" />
        {/* Split bero-ai indigo noren curtains */}
        {[10, 25, 40].map((nx) => (
          <g key={nx} transform={`translate(${nx} 13)`}>
            <rect x="0" y="2" width="13" height="10" rx="1.2" fill={INDIGO_LIP} />
            <rect
              x="0"
              y="0"
              width="13"
              height="9.5"
              rx="1.2"
              fill="var(--c-secondary)"
              stroke={SUMI}
              strokeWidth="1.2"
            />
            <circle cx="6.5" cy="4.8" r="2.3" stroke={WASHI} strokeWidth="1.2" fill="none" />
          </g>
        ))}
        {/* Shingled yatai roof with +3 shade lip, carved shingle lines & top-left highlight */}
        <path d="M0 13 L32 3 L64 13 L61 16.5 H3 Z" fill={TIMBER_DARK} />
        <path
          d="M0 10.5 L32 0.5 L64 10.5 L61 14 H3 Z"
          fill="var(--c-panel-edge)"
          stroke={SUMI}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M16 5.5 L12 13.5 M32 0.8 V14 M48 5.5 L52 13.5"
          stroke={TIMBER_GRAIN}
          strokeWidth="1"
        />
        <ellipse
          cx="22"
          cy="7.5"
          rx="8"
          ry="1.4"
          transform="rotate(-15 22 7.5)"
          fill="var(--c-hud-ink)"
          opacity="0.4"
        />
      </g>

      {/* Right wooden machiya fronts, red wagasa umbrella & right yatai stall */}
      <g>
        {/* Right machiya row receding toward the horizon */}
        <path d="M400 8 L256 34 V62 L400 136 Z" fill={TIMBER_DARK} />
        <path
          d="M400 11 L260 35 V58 L400 128 Z"
          fill={TIMBER_MID}
          stroke={SUMI}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Printed wood-grain texture lines on right machiya timber */}
        <path
          d="M272 52 L396 86 M284 62 L396 98 M316 47 V88 M352 44 V104 M382 41 V118"
          stroke={TIMBER_GRAIN}
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.78"
        />
        <rect
          x="338"
          y="26"
          width="24"
          height="12"
          rx="1.5"
          fill={WASHI_WARM}
          stroke={SUMI}
          strokeWidth="1.3"
        />
        <rect
          x="370"
          y="21"
          width="22"
          height="13"
          rx="1.5"
          fill={WASHI_WARM}
          stroke={SUMI}
          strokeWidth="1.3"
        />
        <path
          d="M346 26 V38 M354 26 V38 M338 32 H362 M377 21 V34 M384 21 V34 M370 27.5 H392"
          stroke={SUMI}
          strokeWidth="1.1"
        />
        <path d="M404 6 L252 33 L256 39 L404 15 Z" fill={ROOF_LIP} />
        <path
          d="M404 3 L252 30 L256 36 L404 12 Z"
          fill={ROOF_TILE}
          stroke={SUMI}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M404 38 L256 50 L260 56 L404 46 Z" fill={ROOF_LIP} />
        <path
          d="M404 35 L256 47 L260 53 L404 43 Z"
          fill={ROOF_TILE}
          stroke={SUMI}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M286 24 L290 31 M322 18 L326 25 M362 11 L366 18 M292 44 L296 51 M336 40 L340 48 M378 37 L382 45"
          stroke={SUMI}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Red shop parasol (wagasa) tucked beside the right stall (from Tripo reference) */}
        <g transform="translate(268 48)">
          <rect x="-1" y="4" width="2.2" height="18" fill={SUMI} />
          <path d="M-14 7 Q0 -2 14 7 Z" fill="var(--c-lacquer)" />
          <path
            d="M-14 5 Q0 -4 14 5 Z"
            fill="var(--c-accent)"
            stroke={SUMI}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M0 -1 V5 M-6 1 L-9 5 M6 1 L9 5" stroke={SUMI} strokeWidth="0.9" />
        </g>

        {/* Right yatai food stall with vermilion noren & spoked wooden cart wheel */}
        <g transform="translate(278 42)">
          <ellipse cx="38" cy="54" rx="34" ry="5.5" fill="var(--c-shadow)" />
          <rect
            x="6"
            y="13"
            width="62"
            height="38"
            rx="2.5"
            fill={TIMBER_DARK}
            stroke={SUMI}
            strokeWidth="1.6"
          />
          <rect
            x="11"
            y="16"
            width="52"
            height="21"
            rx="1.5"
            fill={WASHI_WARM}
            stroke={SUMI}
            strokeWidth="1.2"
          />
          <rect x="4" y="34.5" width="66" height="6.5" rx="2" fill={TIMBER_DARK} />
          <rect
            x="4"
            y="32"
            width="66"
            height="6"
            rx="2"
            fill="var(--c-panel-edge)"
            stroke={SUMI}
            strokeWidth="1.5"
          />
          <path
            d="M10 35 H42 M48 35 H64 M12 43 H44 M12 47 H42"
            stroke={TIMBER_GRAIN}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          {/* Vermilion noren curtains */}
          {[11, 29, 47].map((nx) => (
            <g key={nx} transform={`translate(${nx} 14)`}>
              <rect x="0" y="2" width="15" height="11" rx="1.2" fill="var(--c-lacquer)" />
              <rect
                x="0"
                y="0"
                width="15"
                height="10.5"
                rx="1.2"
                fill="var(--c-accent)"
                stroke={SUMI}
                strokeWidth="1.2"
              />
              <circle cx="7.5" cy="5.2" r="2.4" fill={WASHI} stroke={SUMI} strokeWidth="0.9" />
            </g>
          ))}
          {/* Yatai roof & spoked wooden wheel */}
          <path d="M0 14 L37 3 L74 14 L71 18 H3 Z" fill={TIMBER_DARK} />
          <path
            d="M0 11 L37 0 L74 11 L71 15 H3 Z"
            fill="var(--c-panel-edge)"
            stroke={SUMI}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M18 5.5 L14 14.5 M37 0.5 V15 M56 5.5 L60 14.5"
            stroke={TIMBER_GRAIN}
            strokeWidth="1"
          />
          <ellipse
            cx="24"
            cy="8"
            rx="9"
            ry="1.5"
            transform="rotate(-15 24 8)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
          <circle cx="56" cy="50" r="7.5" fill={TIMBER_DARK} />
          <circle
            cx="56"
            cy="48.5"
            r="7.5"
            fill="var(--c-panel-edge)"
            stroke={SUMI}
            strokeWidth="1.5"
          />
          <path
            d="M49 48.5 H63 M56 41.5 V55.5 M51 43.5 L61 53.5 M61 43.5 L51 53.5"
            stroke={SUMI}
            strokeWidth="1.1"
          />
          <circle cx="56" cy="48.5" r="2.6" fill={TIMBER_DARK} stroke={SUMI} strokeWidth="1" />
        </g>
      </g>

      {/* Red chōchin lanterns strung overhead as flat vermilion woodblock shapes */}
      <path
        d="M36 9 Q212 31 384 8 M112 22 Q236 37 336 20"
        stroke={SUMI}
        strokeWidth="1.5"
        fill="none"
      />
      {[
        { x: 76, y: 15, s: 1 },
        { x: 138, y: 20, s: 0.94 },
        { x: 202, y: 22, s: 0.9 },
        { x: 266, y: 20, s: 0.94 },
        { x: 332, y: 15, s: 1 },
      ].map(({ x, y, s }) => (
        <g
          key={x}
          className="market-ukiyoe-sway"
          style={{ transformOrigin: `${x}px ${y}px` }}
          transform={`translate(${x} ${y}) scale(${s})`}
        >
          <ellipse cx="0" cy="10.5" rx="6.5" ry="7.2" fill="var(--c-lacquer)" />
          <ellipse
            cx="0"
            cy="8.2"
            rx="6.5"
            ry="7"
            fill="var(--c-accent)"
            stroke={SUMI}
            strokeWidth="1.4"
          />
          <path
            d="M-5.8 6.2 Q0 7.4 5.8 6.2 M-5.8 10.2 Q0 11.4 5.8 10.2"
            stroke="var(--c-lacquer)"
            strokeWidth="1"
            fill="none"
          />
          <rect x="-3.6" y="0.4" width="7.2" height="2.2" rx="0.8" fill={SUMI} />
          <rect x="-3.6" y="14" width="7.2" height="2.2" rx="0.8" fill={SUMI} />
          <ellipse
            cx="-2.2"
            cy="5.4"
            rx="2.3"
            ry="1"
            transform="rotate(-16 -2.2 5.4)"
            fill="var(--c-hud-ink)"
            opacity="0.42"
          />
        </g>
      ))}

      {/* Upper-left ukiyo-e red title cartouche (tanzaku) with single kanji 市 (market) */}
      <g transform="translate(10 6)">
        <rect
          x="0"
          y="0"
          width="16"
          height="26"
          rx="1"
          fill="var(--c-accent)"
          stroke={SUMI}
          strokeWidth="1.4"
        />
        <rect x="0.7" y="0.7" width="14.6" height="6" fill="var(--c-lacquer)" />
        <rect x="2" y="2" width="12" height="22" fill="none" stroke={WASHI} strokeWidth="0.8" />
        {/* Carved vector strokes for 市 (market) */}
        <path
          d="M8 5.2 V7.4 M4.2 7.8 H11.8 M5.2 11.2 V16.8 M5.2 11.2 H10.8 V16.2 Q10.8 17 9.6 16.4 M8 8 V20.5"
          fill="none"
          stroke={WASHI}
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
