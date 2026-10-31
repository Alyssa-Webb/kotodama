/**
 * Self-contained SVG battle backdrops per story region (`0 0 400 156`, vanishing point at (248, 44),
 * horizon at y = 56). Each backdrop draws its own floor/street so it also works standalone.
 */
import './battle-backdrops.css';

const TIMBER_DARK = 'color-mix(in srgb, var(--c-panel-edge) 42%, var(--c-hud-bg))';
const TIMBER_MID = 'color-mix(in srgb, var(--c-panel-edge) 66%, var(--c-hud-bg))';
const TIMBER_LIGHT = 'color-mix(in srgb, var(--c-panel-edge) 82%, var(--c-gold-soft))';
const ROOF_TILE = 'color-mix(in srgb, var(--c-mountain-near) 68%, var(--c-hud-bg))';
const ROOF_LIP = 'color-mix(in srgb, var(--c-mountain-near) 42%, var(--c-hud-bg))';
const CEDAR_LIP = 'color-mix(in srgb, var(--c-success) 54%, var(--c-hud-bg))';
const INDIGO_LIP = 'color-mix(in srgb, var(--c-secondary) 56%, var(--c-hud-bg))';

/**
 * Inside a wooden dojo hall: polished floorboards running toward the far wall, a kamiza alcove
 * with a hanging scroll at the back, a weapon rack of bokken, paper lanterns, and warm sunlight
 * streaming through shoji screens.
 */
export function DojoHallBackdrop({ className }: { className?: string }) {
  const cls =
    className && className !== 'battle-backdrop'
      ? `battle-backdrop ${className}`
      : 'battle-backdrop';
  return (
    <svg viewBox="0 0 400 156" preserveAspectRatio="xMidYMid slice" className={cls}>
      <defs>
        <linearGradient id="dojo-wall-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TIMBER_DARK} />
          <stop
            offset="0.38"
            stopColor="color-mix(in srgb, var(--c-panel-edge) 58%, var(--c-surface-alt))"
          />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--c-panel-edge) 64%, var(--c-hud-bg))"
          />
        </linearGradient>
        <linearGradient id="dojo-floor-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TIMBER_MID} />
          <stop
            offset="0.5"
            stopColor="color-mix(in srgb, var(--c-panel-edge) 76%, var(--c-surface-alt))"
          />
          <stop offset="1" stopColor={TIMBER_LIGHT} />
        </linearGradient>
        <linearGradient id="dojo-shoji-grad" x1="0" y1="0" x2="1" y2="1">
          <stop
            offset="0"
            stopColor="color-mix(in srgb, var(--c-glow) 52%, var(--c-hud-ink))"
          />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--c-gold-soft) 72%, var(--c-panel))"
          />
        </linearGradient>
        <linearGradient id="dojo-sun-grad" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="var(--c-glow)" stopOpacity="0.42" />
          <stop offset="0.6" stopColor="var(--c-coin-shine)" stopOpacity="0.18" />
          <stop offset="1" stopColor="var(--c-glow)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="dojo-lantern-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--c-glow)" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="var(--c-glow)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--c-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Far wall base & upper plaster frieze */}
      <rect width="400" height="58" fill="url(#dojo-wall-grad)" />
      <rect
        x="0"
        y="10"
        width="400"
        height="13"
        fill="color-mix(in srgb, var(--c-hud-ink) 72%, var(--c-panel-edge))"
        opacity="0.78"
      />
      <rect x="0" y="22.5" width="400" height="3.5" fill="var(--c-hud-bg)" opacity="0.55" />
      <rect x="0" y="21" width="400" height="3" fill={TIMBER_MID} />

      {/* Polished wooden floorboards running toward the far wall (y = 56..156) */}
      <rect x="0" y="56" width="400" height="100" fill="url(#dojo-floor-grad)" />
      {/* Side floor shading flanking the central training lane */}
      <path
        d="M0 56 H222.8 L12.8 156 H0 Z M252.3 56 H400 V156 H288.3 Z"
        fill="var(--c-hud-bg)"
        opacity="0.18"
      />
      {/* Central training lane ("road") with inlaid court boundary lines & plank seams */}
      <path
        d="M218.5 56 L2 156 L298 156 L256.5 56 Z"
        fill="color-mix(in srgb, var(--c-hud-ink) 58%, var(--c-gold-soft))"
        opacity="0.55"
      />
      <path d="M222.8 56 L12.8 156 L288.3 156 L252.3 56 Z" fill="url(#dojo-floor-grad)" />
      <path
        d="M192 56 L0 98 M208 56 L0 132 M230 56 L62 156 M238 56 L132 156 M245 56 L208 156 M266 56 L354 156 M284 56 L400 122 M0 70 H400 M0 88 H400 M0 112 H400 M0 140 H400"
        stroke={TIMBER_DARK}
        strokeWidth="1.1"
        opacity="0.42"
        fill="none"
      />
      {/* Far wall wooden baseboard (machi-ita) */}
      <rect x="0" y="53.5" width="400" height="3.5" fill="var(--c-hud-bg)" opacity="0.65" />
      <rect x="0" y="52" width="400" height="3" fill={TIMBER_MID} />

      {/* Left shoji screens glowing with warm morning/afternoon sunlight */}
      <g>
        {[14, 62, 110, 156].map((x) => (
          <g key={x} transform={`translate(${x} 24)`}>
            <rect x="0" y="2" width="42" height="29" rx="2" fill={TIMBER_DARK} />
            <rect x="0" y="0" width="42" height="28.5" rx="2" fill={TIMBER_MID} />
            <rect x="2.5" y="2.2" width="37" height="19.5" rx="1" fill="url(#dojo-shoji-grad)" />
            {/* Soft exterior bamboo leaf silhouettes through translucent rice paper */}
            <ellipse
              cx="14"
              cy="10"
              rx="6"
              ry="1.8"
              transform="rotate(-22 14 10)"
              fill="var(--c-success)"
              opacity="0.22"
            />
            <ellipse
              cx="22"
              cy="14"
              rx="5.5"
              ry="1.6"
              transform="rotate(18 22 14)"
              fill="var(--c-success)"
              opacity="0.18"
            />
            {/* Shoji kumiko lattice bars & lower wooden kick-panel */}
            <path
              d="M14.8 2.2 V21.7 M27.2 2.2 V21.7 M2.5 8.7 H39.5 M2.5 15.2 H39.5"
              stroke={TIMBER_MID}
              strokeWidth="1.1"
            />
            <rect x="2.5" y="22.5" width="37" height="4.2" rx="0.8" fill={TIMBER_DARK} />
            <ellipse
              cx="11"
              cy="5.2"
              rx="5.5"
              ry="1.5"
              transform="rotate(-14 11 5.2)"
              fill="var(--c-hud-ink)"
              opacity="0.42"
            />
          </g>
        ))}
        {/* Perspective left-side shoji screen angled toward the viewer */}
        <path d="M0 14 L12 24 V66 L0 82 Z" fill={TIMBER_DARK} />
        <path d="M0 16 L10 25 V62 L0 76 Z" fill="url(#dojo-shoji-grad)" />
        <path d="M0 32 L10 38 M0 48 L10 51 M5 20 V68" stroke={TIMBER_MID} strokeWidth="1.2" />
      </g>

      {/* Kamiza alcove with a hanging scroll at the back wall (head of the training lane) */}
      <g transform="translate(206 14)">
        {/* Recessed alcove back & timber frame */}
        <rect x="4" y="4" width="54" height="38" rx="2.5" fill="var(--c-hud-bg)" opacity="0.52" />
        <rect
          x="6"
          y="5"
          width="50"
          height="35"
          rx="2"
          fill="color-mix(in srgb, var(--c-surface-alt) 62%, var(--c-hud-bg))"
        />
        {/* Pillars on either side of the kamiza */}
        <rect x="2" y="3" width="5.5" height="39" rx="1.5" fill={TIMBER_DARK} />
        <rect x="2" y="3" width="4" height="38" rx="1.2" fill="var(--c-panel-edge)" />
        <rect x="54.5" y="3" width="5.5" height="39" rx="1.5" fill={TIMBER_DARK} />
        <rect x="54.5" y="3" width="4" height="38" rx="1.2" fill="var(--c-panel-edge)" />
        {/* Kamiza lintel beam & ceremonial gold cord */}
        <path d="M-2 3 Q31 -1.5 64 3 L62 7.5 Q31 4 0 7.5 Z" fill={TIMBER_DARK} />
        <path d="M-2 1.2 Q31 -3 64 1.2 L62 5.5 Q31 2 0 5.5 Z" fill="var(--c-panel-edge)" />
        <circle cx="31" cy="5.5" r="2.4" fill="var(--c-gold)" />
        <circle cx="30.4" cy="4.9" r="1" fill="var(--c-coin-shine)" />
        {/* Hanging scroll (kakejiku) */}
        <rect x="20" y="9.5" width="22" height="27" rx="1.5" fill={INDIGO_LIP} />
        <rect x="20" y="7.5" width="22" height="26.5" rx="1.5" fill="var(--c-secondary)" />
        <rect x="22.5" y="10" width="17" height="21" rx="1" fill="var(--c-hud-ink)" />
        {/* Top & bottom wooden scroll rollers with gold end caps */}
        <rect x="18" y="6.8" width="26" height="2.4" rx="1.2" fill="var(--c-gold)" />
        <rect x="17.5" y="33.5" width="27" height="3" rx="1.4" fill={TIMBER_DARK} />
        <rect x="17.5" y="32.2" width="27" height="2.6" rx="1.3" fill="var(--c-gold)" />
        <ellipse
          cx="26"
          cy="12.2"
          rx="3.8"
          ry="1.2"
          transform="rotate(-15 26 12.2)"
          fill="var(--c-coin-shine)"
          opacity="0.45"
        />
        {/* Brush calligraphy strokes & vermilion hanko seal */}
        <path
          d="M31 13.5 V26.5 M26.5 17.5 Q31 15.5 35.5 17.5 M27.5 22.5 Q31 21 34.5 22.5"
          stroke="var(--c-hud-bg)"
          strokeWidth="2.1"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="34.5" y="25.5" width="3" height="3" rx="0.6" fill="var(--c-accent)" />
        {/* Raised lacquered kamiza dais */}
        <rect x="0" y="38.5" width="62" height="6" rx="2" fill="var(--c-hud-bg)" />
        <rect x="0" y="36.5" width="62" height="5.5" rx="2" fill="var(--c-lacquer)" />
        <ellipse
          cx="14"
          cy="38.2"
          rx="8"
          ry="1.1"
          fill="var(--c-hud-ink)"
          opacity="0.38"
        />
      </g>

      {/* Right wall paneling, framed calligraphy plaque & weapon rack of bokken */}
      <g>
        {/* Framed dojo plaque on the right back wall */}
        <rect x="284" y="25.5" width="44" height="15" rx="2.5" fill={TIMBER_DARK} />
        <rect x="284" y="23.5" width="44" height="14.5" rx="2.5" fill="var(--c-panel-edge)" />
        <rect x="287" y="26" width="38" height="9.5" rx="1.2" fill="var(--c-hud-ink)" />
        <path
          d="M296 30.8 H316 M302 28 V33.5 M310 28 V33.5"
          stroke="var(--c-hud-bg)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Weapon rack of bokken on the right dojo floor (strictly right of the training lane) */}
        <g transform="translate(296 52)">
          <ellipse cx="38" cy="48" rx="38" ry="6.5" fill="var(--c-shadow)" />
          {/* Rack side posts & base feet with +3 shade lips */}
          <rect x="6" y="42" width="16" height="5.5" rx="2.5" fill={TIMBER_DARK} />
          <rect x="6" y="40" width="16" height="5" rx="2.5" fill="var(--c-panel-edge)" />
          <rect x="54" y="42" width="16" height="5.5" rx="2.5" fill={TIMBER_DARK} />
          <rect x="54" y="40" width="16" height="5" rx="2.5" fill="var(--c-panel-edge)" />
          <rect x="11" y="4" width="6" height="38" rx="2" fill={TIMBER_DARK} />
          <rect x="11" y="4" width="4.5" height="37" rx="1.8" fill="var(--c-panel-edge)" />
          <rect x="59" y="4" width="6" height="38" rx="2" fill={TIMBER_DARK} />
          <rect x="59" y="4" width="4.5" height="37" rx="1.8" fill="var(--c-panel-edge)" />
          <rect x="12" y="34" width="52" height="4" rx="1.5" fill={TIMBER_DARK} />

          {/* Three tiered wooden bokken (training swords) with +2.5 shade lips & highlights */}
          {[9, 19, 29].map((y, idx) => (
            <g key={y} transform={`translate(0 ${y})`}>
              <path
                d="M2 3.2 Q38 6.2 74 1.4"
                stroke={TIMBER_DARK}
                strokeWidth="4.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M2 1.2 Q38 4.2 74 -0.6"
                stroke={idx === 1 ? 'var(--c-panel-edge)' : TIMBER_LIGHT}
                strokeWidth="3.8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Wrapped tsuka handle & round tsuba guard */}
              <path
                d="M2 1.2 L19 2.3"
                stroke={idx === 0 ? 'var(--c-accent)' : 'var(--c-secondary)'}
                strokeWidth="4.2"
                strokeLinecap="round"
              />
              <rect x="18.5" y="-2.2" width="3.2" height="8" rx="1.4" fill="var(--c-lacquer)" />
              <ellipse
                cx="34"
                cy="1.2"
                rx="7"
                ry="0.9"
                fill="var(--c-hud-ink)"
                opacity="0.42"
              />
            </g>
          ))}
        </g>
      </g>

      {/* Warm sunlight beams slanting from the left shoji screens across the floor */}
      <g className="backdrop-sunbeam">
        <path d="M18 26 L56 26 L128 118 L52 118 Z" fill="url(#dojo-sun-grad)" />
        <path d="M68 26 L108 26 L192 126 L126 126 Z" fill="url(#dojo-sun-grad)" />
        <path d="M118 26 L166 26 L254 132 L194 132 Z" fill="url(#dojo-sun-grad)" />
      </g>

      {/* Overhead timber tie-beam & hanging paper lanterns */}
      <rect x="0" y="0" width="400" height="11.5" fill="var(--c-hud-bg)" opacity="0.72" />
      <rect x="0" y="0" width="400" height="9" fill={TIMBER_DARK} />
      <ellipse cx="90" cy="3.5" rx="42" ry="1.6" fill="var(--c-hud-ink)" opacity="0.32" />
      {[88, 178, 312].map((x, idx) => (
        <g
          key={x}
          className={idx % 2 === 0 ? 'backdrop-sway' : 'backdrop-sway-alt'}
          style={{ transformOrigin: `${x}px 9px` }}
        >
          <circle
            cx={x}
            cy="23"
            r="18"
            fill="url(#dojo-lantern-glow)"
            className="backdrop-glow"
          />
          <rect x={x - 1} y="8" width="2" height="6" fill="var(--c-hud-bg)" />
          <ellipse
            cx={x}
            cy="24.5"
            rx="8.5"
            ry="7.5"
            fill="color-mix(in srgb, var(--c-gold) 66%, var(--c-hud-bg))"
          />
          <ellipse
            cx={x}
            cy="22"
            rx="8.5"
            ry="7.5"
            fill="color-mix(in srgb, var(--c-glow) 68%, var(--c-hud-ink))"
          />
          <rect x={x - 4.5} y="13.5" width="9" height="2.4" rx="1" fill="var(--c-hud-bg)" />
          <rect x={x - 4.5} y="28.8" width="9" height="2.6" rx="1" fill="var(--c-hud-bg)" />
          <ellipse
            cx={x - 2.6}
            cy="19.2"
            rx="3.2"
            ry="1.5"
            transform={`rotate(-16 ${x - 2.6} 19.2)`}
            fill="var(--c-hud-ink)"
            opacity="0.45"
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * An Edo market street at dusk: wooden machiya fronts on both sides, yatai food stalls with noren,
 * red chōchin lanterns strung overhead, a sake shop's sugidama ball, and the street running into
 * the distance.
 */
export function MarketStreetBackdrop({ className }: { className?: string }) {
  const cls =
    className && className !== 'battle-backdrop'
      ? `battle-backdrop ${className}`
      : 'battle-backdrop';
  return (
    <svg viewBox="0 0 400 156" preserveAspectRatio="xMidYMid slice" className={cls}>
      <defs>
        <linearGradient id="market-dusk-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--c-sky-top)" />
          <stop offset="0.45" stopColor="var(--c-sky-mid)" />
          <stop
            offset="0.82"
            stopColor="color-mix(in srgb, var(--c-accent) 44%, var(--c-sky-bottom))"
          />
          <stop offset="1" stopColor="var(--c-glow)" />
        </linearGradient>
        <linearGradient id="market-street-grad" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            stopColor="color-mix(in srgb, var(--c-mountain-near) 66%, var(--c-hud-bg))"
          />
          <stop
            offset="0.52"
            stopColor="color-mix(in srgb, var(--c-fog) 62%, var(--c-surface-alt))"
          />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--c-border) 68%, var(--c-surface-alt))"
          />
        </linearGradient>
        <radialGradient id="market-orb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--c-glow)" stopOpacity="0.9" />
          <stop offset="0.48" stopColor="var(--c-accent)" stopOpacity="0.32" />
          <stop offset="1" stopColor="var(--c-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dusk sky & warm sunset glow at the end of the street */}
      <rect width="400" height="64" fill="url(#market-dusk-grad)" />
      <circle cx="238" cy="44" r="38" fill="url(#market-orb-glow)" />
      <g className="only-dark" fill="var(--c-firefly)">
        <circle cx="152" cy="12" r="1.1" />
        <circle cx="198" cy="9" r="1.3" />
        <circle cx="264" cy="11" r="1" />
        <circle cx="308" cy="14" r="1.2" />
      </g>

      {/* Distant Edo skyline & watchtower silhouette at the street vanishing point */}
      <path
        d="M170 58 V42 L188 34 L208 40 V32 L226 26 L246 32 V40 L268 33 L292 42 V58 Z"
        fill="var(--c-mountain-far)"
      />
      <path
        d="M214 32 Q237 25 260 32 L256 36 H218 Z M218 40 Q237 34 256 40 L253 44 H221 Z"
        fill="var(--c-mountain-near)"
      />

      {/* Cobblestone market street running into the distance (y = 56..156) */}
      <rect
        x="0"
        y="56"
        width="400"
        height="100"
        fill="color-mix(in srgb, var(--c-mountain-near) 54%, var(--c-hud-bg))"
      />
      <path
        d="M218.5 56 L2 156 L298 156 L256.5 56 Z"
        fill="color-mix(in srgb, var(--c-border) 54%, var(--c-hud-bg))"
      />
      <path d="M222.8 56 L12.8 156 L288.3 156 L252.3 56 Z" fill="url(#market-street-grad)" />
      <path
        d="M230.5 56 L62 156 L242 156 L246 56 Z"
        fill="color-mix(in srgb, var(--c-glow) 34%, var(--c-surface-alt))"
        opacity="0.55"
      />

      {/* Left wooden machiya fronts receding in perspective & sake shop sugidama ball */}
      <g>
        {/* Mid-distance left machiya */}
        <path d="M92 22 L214 36 V58 L92 84 Z" fill={TIMBER_DARK} />
        <path d="M88 20 L218 35 L214 41 L84 28 Z" fill={ROOF_LIP} />
        <path d="M88 17.5 L218 33 L214 38.5 L84 25.5 Z" fill={ROOF_TILE} />
        {/* Foreground left two-story sake shop machiya */}
        <path d="M0 8 L104 22 V88 L0 124 Z" fill={TIMBER_DARK} />
        <path d="M0 10 L100 23 V84 L0 118 Z" fill={TIMBER_MID} />
        {/* Glowing upper-story kōshi lattice windows */}
        <rect x="16" y="24" width="28" height="13" rx="1.5" fill="var(--c-glow)" opacity="0.88" />
        <rect x="54" y="28" width="24" height="12" rx="1.5" fill="var(--c-glow)" opacity="0.82" />
        <path
          d="M23 24 V37 M30 24 V37 M37 24 V37 M62 28 V40 M70 28 V40"
          stroke={TIMBER_DARK}
          strokeWidth="1.4"
        />
        {/* Stepped clay-tile kawara eaves with +3 shade lip & top-left highlight */}
        <path d="M-4 4 L110 20 L104 28 L-4 14 Z" fill={ROOF_LIP} />
        <path d="M-4 1 L110 17 L104 25 L-4 11 Z" fill={ROOF_TILE} />
        <path d="M-4 36 L108 48 L102 55 L-4 45 Z" fill={ROOF_LIP} />
        <path d="M-4 33 L108 45 L102 52 L-4 42 Z" fill={ROOF_TILE} />
        <ellipse
          cx="34"
          cy="39"
          rx="14"
          ry="1.8"
          transform="rotate(6 34 39)"
          fill="var(--c-hud-ink)"
          opacity="0.38"
        />

        {/* Stacked sake barrels (komodaru) by the left shopfront */}
        <g transform="translate(10 82)">
          <rect x="0" y="3" width="22" height="22" rx="4" fill={TIMBER_DARK} />
          <rect x="0" y="0" width="22" height="22" rx="4" fill="var(--c-gold-soft)" />
          <path d="M2 7 H20 M2 15 H20" stroke="var(--c-panel-edge)" strokeWidth="2.2" />
          <circle cx="11" cy="11" r="3.5" fill="var(--c-accent)" />
        </g>

        {/* Sake shop's sugidama (cedar ball) hanging under the machiya eaves */}
        <g
          className="backdrop-sway"
          style={{ transformOrigin: '76px 46px' }}
          transform="translate(76 46)"
        >
          <rect x="-1" y="0" width="2" height="7" fill="var(--c-hud-bg)" />
          <circle cx="0" cy="16" r="10.5" fill={CEDAR_LIP} />
          <circle cx="0" cy="13.5" r="10.5" fill="var(--c-success)" />
          <path d="M-6 6 L0 2.5 L6 6 Z" fill="var(--c-panel-edge)" />
          <ellipse
            cx="-3.5"
            cy="10"
            rx="3.8"
            ry="1.7"
            transform="rotate(-16 -3.5 10)"
            fill="var(--c-hud-ink)"
            opacity="0.42"
          />
        </g>
      </g>

      {/* Left yatai food stall with indigo noren (positioned left of the street edge) */}
      <g transform="translate(96 36)">
        <ellipse cx="32" cy="48" rx="30" ry="5" fill="var(--c-shadow)" />
        <rect x="6" y="12" width="52" height="34" rx="2" fill={TIMBER_DARK} />
        <rect x="10" y="15" width="44" height="19" rx="1.5" fill="var(--c-glow)" opacity="0.72" />
        {/* Wooden counter with +2.5 shade lip & tri-color dango skewers */}
        <rect x="4" y="31.5" width="56" height="6" rx="2" fill={TIMBER_DARK} />
        <rect x="4" y="29" width="56" height="5.5" rx="2" fill="var(--c-panel-edge)" />
        <circle cx="20" cy="26.5" r="2.1" fill="var(--c-petal)" />
        <circle cx="24" cy="26.5" r="2.1" fill="var(--c-hud-ink)" />
        <circle cx="28" cy="26.5" r="2.1" fill="var(--c-success)" />
        {/* Split indigo noren curtains */}
        <g className="backdrop-sway-alt" style={{ transformOrigin: '32px 13px' }}>
          {[10, 25, 40].map((nx) => (
            <g key={nx} transform={`translate(${nx} 13)`}>
              <rect x="0" y="2" width="13" height="10" rx="1.5" fill={INDIGO_LIP} />
              <rect x="0" y="0" width="13" height="9.5" rx="1.5" fill="var(--c-secondary)" />
              <circle
                cx="6.5"
                cy="4.8"
                r="2.4"
                stroke="var(--c-hud-ink)"
                strokeWidth="1.2"
                fill="none"
              />
            </g>
          ))}
        </g>
        {/* Shingled yatai roof with +3 shade lip & highlight */}
        <path d="M0 13 L32 3 L64 13 L61 16.5 H3 Z" fill={TIMBER_DARK} />
        <path d="M0 10.5 L32 0.5 L64 10.5 L61 14 H3 Z" fill="var(--c-panel-edge)" />
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

      {/* Right wooden machiya fronts & right yatai stall with vermilion noren */}
      <g>
        {/* Right machiya row receding toward the horizon */}
        <path d="M400 8 L256 34 V62 L400 136 Z" fill={TIMBER_DARK} />
        <path d="M400 11 L260 35 V58 L400 128 Z" fill={TIMBER_MID} />
        <rect x="338" y="26" width="24" height="12" rx="1.5" fill="var(--c-glow)" opacity="0.85" />
        <rect x="370" y="21" width="22" height="13" rx="1.5" fill="var(--c-glow)" opacity="0.88" />
        <path d="M404 6 L252 33 L256 39 L404 15 Z" fill={ROOF_LIP} />
        <path d="M404 3 L252 30 L256 36 L404 12 Z" fill={ROOF_TILE} />
        <path d="M404 38 L256 50 L260 56 L404 46 Z" fill={ROOF_LIP} />
        <path d="M404 35 L256 47 L260 53 L404 43 Z" fill={ROOF_TILE} />

        {/* Right yatai food stall with vermilion noren & cart wheel */}
        <g transform="translate(278 42)">
          <ellipse cx="38" cy="54" rx="34" ry="5.5" fill="var(--c-shadow)" />
          <rect x="6" y="13" width="62" height="38" rx="2.5" fill={TIMBER_DARK} />
          <rect x="11" y="16" width="52" height="21" rx="1.5" fill="var(--c-glow)" opacity="0.76" />
          <rect x="4" y="34.5" width="66" height="6.5" rx="2" fill={TIMBER_DARK} />
          <rect x="4" y="32" width="66" height="6" rx="2" fill="var(--c-panel-edge)" />
          {/* Vermilion noren curtains */}
          <g className="backdrop-sway" style={{ transformOrigin: '37px 14px' }}>
            {[11, 29, 47].map((nx) => (
              <g key={nx} transform={`translate(${nx} 14)`}>
                <rect x="0" y="2" width="15" height="11" rx="1.5" fill="var(--c-lacquer)" />
                <rect x="0" y="0" width="15" height="10.5" rx="1.5" fill="var(--c-accent)" />
                <circle cx="7.5" cy="5.2" r="2.5" fill="var(--c-hud-ink)" opacity="0.88" />
              </g>
            ))}
          </g>
          {/* Yatai roof & spoked wooden wheel */}
          <path d="M0 14 L37 3 L74 14 L71 18 H3 Z" fill={TIMBER_DARK} />
          <path d="M0 11 L37 0 L74 11 L71 15 H3 Z" fill="var(--c-panel-edge)" />
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
          <circle cx="56" cy="48.5" r="7.5" fill="var(--c-panel-edge)" />
          <circle cx="56" cy="48.5" r="3" fill={TIMBER_DARK} />
        </g>
      </g>

      {/* Red chōchin lanterns strung overhead across the market street */}
      <path
        d="M36 9 Q212 31 384 8 M112 22 Q236 37 336 20"
        stroke="var(--c-hud-bg)"
        strokeWidth="1.6"
        fill="none"
      />
      {[
        { x: 76, y: 15, s: 1 },
        { x: 138, y: 20, s: 0.94 },
        { x: 202, y: 22, s: 0.9 },
        { x: 266, y: 20, s: 0.94 },
        { x: 332, y: 15, s: 1 },
      ].map(({ x, y, s }, idx) => (
        <g
          key={x}
          className={idx % 2 === 0 ? 'backdrop-sway' : 'backdrop-sway-alt'}
          style={{ transformOrigin: `${x}px ${y}px` }}
          transform={`translate(${x} ${y}) scale(${s})`}
        >
          <circle
            cx="0"
            cy="9"
            r="14"
            fill="url(#market-orb-glow)"
            className="backdrop-glow"
          />
          <ellipse cx="0" cy="10.5" rx="6.5" ry="7.2" fill="var(--c-lacquer)" />
          <ellipse cx="0" cy="8.2" rx="6.5" ry="7" fill="var(--c-accent)" />
          <ellipse cx="0" cy="8.2" rx="3.2" ry="4.2" fill="var(--c-glow)" opacity="0.88" />
          <rect x="-3.5" y="0.5" width="7" height="2.2" rx="1" fill="var(--c-hud-bg)" />
          <rect x="-3.5" y="14.2" width="7" height="2.2" rx="1" fill="var(--c-hud-bg)" />
          <ellipse
            cx="-2.2"
            cy="5.4"
            rx="2.4"
            ry="1.1"
            transform="rotate(-16 -2.2 5.4)"
            fill="var(--c-hud-ink)"
            opacity="0.42"
          />
        </g>
      ))}
    </svg>
  );
}
