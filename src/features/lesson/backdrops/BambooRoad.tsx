/**
 * The Bamboo Thicket battle backdrop: parallax sky, distant mountains, cedar and bamboo groves,
 * a shrine torii and lanterns (`0 0 400 156`, same geometry as the other region backdrops).
 */
const STONE_LIP = 'color-mix(in srgb, var(--c-border) 52%, var(--c-hud-bg))';

export function BambooRoadBackdrop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 156"
      preserveAspectRatio="xMidYMid slice"
      className={className ?? 'battle-backdrop'}
    >
      <defs>
        <linearGradient id="battle-sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--c-sky-top)" />
          <stop offset="0.52" stopColor="var(--c-sky-mid)" />
          <stop offset="1" stopColor="var(--c-sky-bottom)" />
        </linearGradient>
        <radialGradient id="battle-orb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--c-glow)" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="var(--c-glow)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--c-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft sky base */}
      <rect width="400" height="90" fill="url(#battle-sky-grad)" />

      {/* Night stars (dark theme) */}
      <g className="only-dark" fill="var(--c-firefly)">
        <circle cx="34" cy="14" r="1.2" className="battle-star" />
        <circle cx="78" cy="24" r="0.9" className="battle-star battle-star-delay" />
        <circle cx="128" cy="11" r="1.3" className="battle-star" />
        <circle cx="174" cy="20" r="0.9" className="battle-star battle-star-delay" />
        <circle cx="222" cy="12" r="1.1" className="battle-star" />
        <circle cx="304" cy="15" r="1.3" className="battle-star battle-star-delay" />
        <circle cx="358" cy="22" r="1" className="battle-star" />
      </g>

      {/* Sun by day / Moon by night */}
      <circle cx="292" cy="28" r="32" fill="url(#battle-orb-glow)" />
      <circle cx="292" cy="28" r="12" fill="var(--c-glow)" className="only-light" />
      <g className="only-dark">
        <circle cx="292" cy="28" r="11" fill="var(--c-firefly)" />
        <circle cx="288" cy="25" r="2.2" fill="var(--c-glow)" opacity="0.5" />
      </g>

      {/* Soft drifting clouds */}
      <g className="battle-clouds" fill="var(--c-panel)" opacity="0.55">
        <path d="M42 30 C47 22 61 22 66 28 C71 23 82 25 84 32 H42 Z" />
        <path d="M168 19 C172 13 184 13 188 18 C193 14 202 15 204 21 H168 Z" />
        <path d="M322 25 C326 19 338 19 342 24 C346 20 355 21 357 27 H322 Z" />
      </g>

      {/* Parallax Layer 1: Far mountains, Mt. Fuji peak & distant ridge pagoda */}
      <g className="battle-parallax-far">
        {/* Mt. Fuji silhouette in the distance */}
        <path d="M68 68 L132 18 C137 14 143 14 148 18 L212 68 Z" fill="var(--c-mountain-far)" />
        <path
          d="M115 31 L132 18 C137 14 143 14 148 18 L165 31 C160 33 156 29 152 33 C148 29 144 33 140 30 C136 33 132 29 128 33 C124 29 120 33 115 31 Z"
          fill="var(--c-panel)"
          opacity="0.9"
        />
        {/* Rolling far mountain range */}
        <path
          d="M-20 70 C30 42 75 40 120 52 C165 36 215 38 260 50 C310 32 365 34 420 56 V84 H-20 Z"
          fill="var(--c-mountain-far)"
          opacity="0.82"
        />
        {/* Distant hillside pagoda silhouette */}
        <g fill="var(--c-mountain-near)" opacity="0.75" transform="translate(82 34) scale(0.75)">
          <rect x="9" y="-6" width="2" height="8" />
          <path d="M-2 4 Q10 -1 22 4 L19 7 H1 Z" />
          <path d="M-4 11 Q10 6 24 11 L21 14 H-1 Z" />
          <path d="M-6 18 Q10 13 26 18 L23 21 H-3 Z" />
          <rect x="4" y="4" width="12" height="22" />
        </g>
      </g>

      {/* Parallax Layer 2: Midground woodland hills, cedar & bamboo groves, distant torii & lanterns */}
      <g className="battle-parallax-mid">
        {/* Midground forested hills */}
        <path
          d="M-20 74 C40 48 104 46 168 58 C216 50 258 52 302 58 C348 44 388 46 420 62 V88 H-20 Z"
          fill="var(--c-mountain-near)"
        />

        {/* Left cedar (sugi) & bamboo grove silhouettes */}
        <g fill="color-mix(in srgb, var(--c-mountain-near) 75%, var(--c-hud-bg))">
          <path d="M18 14 L6 36 H12 L3 54 H10 L0 70 H36 L26 54 H33 L24 36 H30 Z" />
          <path d="M48 20 L38 39 H43 L35 55 H41 L33 70 H63 L55 55 H61 L53 39 H58 Z" />
          <path d="M76 26 L68 42 H72 L65 56 H70 L63 70 H89 L82 56 H87 L80 42 H84 Z" />
        </g>
        {/* Left swaying bamboo stalks & feathery leaves */}
        <g
          className="battle-bamboo-sway"
          style={{ transformOrigin: '132px 68px' }}
          stroke="color-mix(in srgb, var(--c-success) 68%, var(--c-hud-bg))"
          fill="color-mix(in srgb, var(--c-success) 68%, var(--c-hud-bg))"
        >
          <path
            d="M116 68 Q114 40 120 14 M130 68 Q131 42 127 18 M144 68 Q146 44 140 22"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M113 36 H119 M115 24 H121 M127 42 H133 M142 38 H148"
            stroke="var(--c-coin-shine)"
            strokeWidth="1.2"
            opacity="0.55"
          />
          <ellipse cx="125" cy="16" rx="7" ry="2.2" transform="rotate(-22 125 16)" stroke="none" />
          <ellipse cx="113" cy="21" rx="6.5" ry="2" transform="rotate(18 113 21)" stroke="none" />
          <ellipse cx="136" cy="22" rx="6.5" ry="2" transform="rotate(-18 136 22)" stroke="none" />
          <ellipse cx="147" cy="28" rx="6" ry="1.8" transform="rotate(24 147 28)" stroke="none" />
        </g>

        {/* Right cedar & bamboo grove silhouettes */}
        <g fill="color-mix(in srgb, var(--c-mountain-near) 75%, var(--c-hud-bg))">
          <path d="M342 22 L332 40 H337 L329 56 H335 L327 70 H357 L349 56 H355 L347 40 H352 Z" />
          <path d="M372 12 L359 34 H365 L355 52 H362 L352 70 H392 L382 52 H389 L379 34 H385 Z" />
        </g>
        <g
          className="battle-bamboo-sway"
          style={{ transformOrigin: '306px 68px' }}
          stroke="color-mix(in srgb, var(--c-success) 68%, var(--c-hud-bg))"
          fill="color-mix(in srgb, var(--c-success) 68%, var(--c-hud-bg))"
        >
          <path
            d="M294 68 Q292 44 298 20 M308 68 Q310 40 304 14 M320 68 Q322 46 317 24"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M291 40 H297 M305 32 H311 M318 42 H324"
            stroke="var(--c-coin-shine)"
            strokeWidth="1.2"
            opacity="0.55"
          />
          <ellipse cx="300" cy="18" rx="6.5" ry="2" transform="rotate(-20 300 18)" stroke="none" />
          <ellipse cx="312" cy="16" rx="7" ry="2.2" transform="rotate(22 312 16)" stroke="none" />
          <ellipse cx="324" cy="26" rx="6" ry="1.8" transform="rotate(18 324 26)" stroke="none" />
        </g>

        {/* Distant vermilion Torii gate straddling the upper path entrance */}
        <g transform="translate(216 24)">
          <circle cx="22" cy="22" r="24" fill="url(#battle-orb-glow)" opacity="0.65" />
          {/* Pillars */}
          <rect x="8" y="8" width="4.5" height="28" rx="1.5" fill="var(--c-lacquer)" />
          <rect x="8" y="8" width="3.5" height="28" rx="1.2" fill="var(--c-accent)" />
          <rect x="31.5" y="8" width="4.5" height="28" rx="1.5" fill="var(--c-lacquer)" />
          <rect x="31.5" y="8" width="3.5" height="28" rx="1.2" fill="var(--c-accent)" />
          <rect x="6.5" y="31" width="7.5" height="5" rx="1.5" fill="var(--c-hud-bg)" />
          <rect x="30" y="31" width="7.5" height="5" rx="1.5" fill="var(--c-hud-bg)" />
          {/* Lower tie beam (nuki) */}
          <rect x="3" y="13" width="38" height="3.5" rx="1.5" fill="var(--c-lacquer)" />
          <rect x="3" y="12" width="38" height="3" rx="1.5" fill="var(--c-accent)" />
          {/* Curved top lintel (kasagi) */}
          <path d="M-2 5 Q22 0 46 5 L44 9.5 Q22 5.5 0 9.5 Z" fill="var(--c-lacquer)" />
          <path d="M-2 3.5 Q22 -1.5 46 3.5 L44 7.5 Q22 3.5 0 7.5 Z" fill="var(--c-accent)" />
          {/* Golden額束 (gakuzuka) tablet */}
          <rect x="19.5" y="6" width="5" height="6.5" rx="1" fill="var(--c-hud-bg)" />
          <rect x="20.5" y="7" width="3" height="4.5" rx="0.6" fill="var(--c-glow)" />
        </g>

        {/* Distant stone lantern (left of torii) & hanging chochin lantern (right of torii) */}
        <g transform="translate(200 40)">
          <rect x="3" y="12" width="6" height="8" rx="1.5" fill={STONE_LIP} />
          <rect x="2" y="6" width="8" height="6" rx="1.5" fill="var(--c-border)" />
          <circle
            cx="6"
            cy="9"
            r="8"
            fill="url(#battle-orb-glow)"
            className="battle-lantern-glow"
          />
          <rect
            x="4"
            y="7.5"
            width="4"
            height="3"
            rx="1"
            fill="var(--c-glow)"
            className="battle-lantern-glow"
          />
          <path d="M0 6.5 L6 2 L12 6.5 Z" fill={STONE_LIP} />
        </g>
        <g transform="translate(268 35)">
          <path
            d="M8 24 V4 L0 4"
            stroke="var(--c-hud-bg)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <circle
            cx="0"
            cy="11"
            r="10"
            fill="url(#battle-orb-glow)"
            className="battle-lantern-glow"
          />
          <ellipse cx="0" cy="11.5" rx="4.5" ry="5.5" fill="var(--c-lacquer)" />
          <ellipse cx="0" cy="10.5" rx="4.5" ry="5" fill="var(--c-accent)" />
          <ellipse
            cx="0"
            cy="10.5"
            rx="2.4"
            ry="3"
            fill="var(--c-glow)"
            className="battle-lantern-glow"
          />
        </g>
      </g>
    </svg>
  );
}
