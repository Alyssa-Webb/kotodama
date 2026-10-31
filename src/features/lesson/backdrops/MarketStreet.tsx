/**
 * Self-contained SVG battle backdrops per story region (`0 0 400 156`, vanishing point at (248, 44),
 * horizon at y = 56). Each backdrop draws its own floor/street so it also works standalone.
 */
import '../battle-backdrops.css';

const TIMBER_DARK = 'color-mix(in srgb, var(--c-panel-edge) 42%, var(--c-hud-bg))';
const TIMBER_MID = 'color-mix(in srgb, var(--c-panel-edge) 66%, var(--c-hud-bg))';
const ROOF_TILE = 'color-mix(in srgb, var(--c-mountain-near) 68%, var(--c-hud-bg))';
const ROOF_LIP = 'color-mix(in srgb, var(--c-mountain-near) 42%, var(--c-hud-bg))';
const CEDAR_LIP = 'color-mix(in srgb, var(--c-success) 54%, var(--c-hud-bg))';
const INDIGO_LIP = 'color-mix(in srgb, var(--c-secondary) 56%, var(--c-hud-bg))';

/**
 * Inside a wooden dojo hall: polished floorboards running toward the far wall, a kamiza alcove
 * with a hanging scroll at the back, a weapon rack of bokken, paper lanterns, and warm sunlight
 * streaming through shoji screens.
 */

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
          <circle cx="0" cy="9" r="14" fill="url(#market-orb-glow)" className="backdrop-glow" />
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
