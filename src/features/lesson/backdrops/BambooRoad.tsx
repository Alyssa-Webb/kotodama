/**
 * The Bamboo Thicket battle backdrop in Hiroshige ukiyo-e woodblock print style
 * (`0 0 400 156`, vanishing point at (248, 44), horizon at y = 56).
 */
import '../battle-backdrops.css';
import './bamboo-ukiyoe.css';

const SUMI = 'color-mix(in srgb, var(--c-hud-bg) 90%, var(--c-secondary))';
const WASHI = 'color-mix(in srgb, var(--c-hud-ink) 86%, var(--c-gold-soft))';
const WASHI_WARM = 'color-mix(in srgb, var(--c-glow) 62%, var(--c-hud-ink))';
const WASHI_LIP = 'color-mix(in srgb, var(--c-border) 56%, var(--c-hud-ink))';
const FUJI_BODY = 'color-mix(in srgb, var(--c-secondary) 64%, var(--c-mountain-far))';
const FUJI_BASE = 'color-mix(in srgb, var(--c-mountain-near) 68%, var(--c-hud-bg))';
const RIDGE_FAR = 'color-mix(in srgb, var(--c-mountain-far) 78%, var(--c-secondary))';
const RIDGE_MID = 'color-mix(in srgb, var(--c-mountain-near) 82%, var(--c-hud-bg))';
const CEDAR_DARK = 'color-mix(in srgb, var(--c-mountain-near) 54%, var(--c-hud-bg))';
const CEDAR_MID = 'color-mix(in srgb, var(--c-success) 38%, var(--c-mountain-near))';
const BAMBOO_DARK = 'color-mix(in srgb, var(--c-success) 48%, var(--c-hud-bg))';
const BAMBOO_MID = 'color-mix(in srgb, var(--c-success) 76%, var(--c-hud-bg))';
const BAMBOO_LIGHT = 'color-mix(in srgb, var(--c-success) 74%, var(--c-gold-soft))';
const STONE_LIP = 'color-mix(in srgb, var(--c-border) 48%, var(--c-hud-bg))';
const STONE_MID = 'color-mix(in srgb, var(--c-border) 76%, var(--c-hud-bg))';
const VERGE_DARK = 'color-mix(in srgb, var(--c-success) 44%, var(--c-hud-bg))';
const VERGE_MID = 'color-mix(in srgb, var(--c-success) 62%, var(--c-mountain-near))';
const ROAD_CURB = 'color-mix(in srgb, var(--c-gold) 48%, var(--c-hud-bg))';
const ROAD_FLAT = 'color-mix(in srgb, var(--c-panel-edge) 66%, var(--c-surface-alt))';
const ROAD_CENTER = 'color-mix(in srgb, var(--c-gold-soft) 58%, var(--c-panel-edge))';

export function BambooRoadBackdrop({ className }: { className?: string }) {
  const cls =
    className && className !== 'battle-backdrop'
      ? `battle-backdrop ${className}`
      : 'battle-backdrop';
  return (
    <svg viewBox="0 0 400 156" preserveAspectRatio="xMidYMid slice" className={cls}>
      <defs>
        {/* Hand-wiped ichimonji bokashi sky (the only gradient in the woodblock print) */}
        <linearGradient id="bamboo-bokashi-sky" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="color-mix(in srgb, var(--c-secondary) 52%, var(--c-sky-top))"
          />
          <stop
            offset="32%"
            stopColor="color-mix(in srgb, var(--c-sky-top) 74%, var(--c-sky-mid))"
          />
          <stop
            offset="68%"
            stopColor="color-mix(in srgb, var(--c-sky-mid) 78%, var(--c-sky-bottom))"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in srgb, var(--c-sky-bottom) 82%, var(--c-hud-ink))"
          />
        </linearGradient>
      </defs>

      {/* Bokashi sky block & top woodblock ink wipe */}
      <rect width="400" height="72" fill="url(#bamboo-bokashi-sky)" />
      <rect width="400" height="5" fill="var(--c-secondary)" opacity="0.2" />

      {/* Night stars (dark theme) */}
      <g className="only-dark" fill="var(--c-firefly)" stroke={SUMI} strokeWidth="0.35">
        <circle cx="34" cy="14" r="1.3" className="battle-star" />
        <circle cx="78" cy="24" r="1" className="battle-star battle-star-delay" />
        <circle cx="128" cy="11" r="1.4" className="battle-star" />
        <circle cx="174" cy="20" r="1" className="battle-star battle-star-delay" />
        <circle cx="222" cy="12" r="1.2" className="battle-star" />
        <circle cx="304" cy="15" r="1.4" className="battle-star battle-star-delay" />
        <circle cx="358" cy="22" r="1.1" className="battle-star" />
      </g>

      {/* Printed woodblock Sun by day / Moon by night (flat fills, no radial gradient) */}
      <circle cx="292" cy="26" r="18" fill={WASHI_WARM} opacity="0.28" />
      <g className="only-light">
        <circle
          cx="292"
          cy="27.2"
          r="11.5"
          fill="color-mix(in srgb, var(--c-accent) 52%, var(--c-glow))"
        />
        <circle cx="292" cy="26" r="11.5" fill="var(--c-glow)" stroke={SUMI} strokeWidth="1.1" />
      </g>
      <g className="only-dark">
        <circle cx="292" cy="27" r="10.8" fill={WASHI_LIP} />
        <circle cx="292" cy="26" r="10.8" fill="var(--c-firefly)" stroke={SUMI} strokeWidth="1.1" />
        <circle cx="288.5" cy="23.5" r="2.3" fill="var(--c-hud-ink)" opacity="0.55" />
      </g>

      {/* Stylized Edo suyari-gasumi horizontal woodblock cloud bands */}
      <g
        className="battle-clouds"
        fill={WASHI}
        stroke={SUMI}
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity="0.84"
      >
        <path
          d="M36 22 H86 C91 22 94 24.5 94 27 C94 29.5 90 31 84 31 H64 C69 31 72 33 72 35.5 C72 38 68 39.5 62 39.5 H36 Z"
          fill={WASHI_LIP}
          transform="translate(0 1.4)"
          stroke="none"
        />
        <path d="M36 22 H86 C91 22 94 24.5 94 27 C94 29.5 90 31 84 31 H64 C69 31 72 33 72 35.5 C72 38 68 39.5 62 39.5 H36 Z" />
        <path d="M164 13 H208 C213 13 216 15 216 17.5 C216 20 212 21.5 206 21.5 H164 Z" />
        <path d="M370 18 H320 C315 18 312 20.5 312 23 C312 25.5 316 27 322 27 H340 C335 27 332 29 332 31.5 C332 34 336 35.5 342 35.5 H370 Z" />
      </g>

      {/* Parallax Layer 1: Mount Fuji woodblock print, far ridge & hillside pagoda */}
      <g className="battle-parallax-far">
        {/* Mt. Fuji flat woodblock silhouette with concave slopes & white printed snow cap */}
        <path
          d="M64 68 C94 55 116 35 131 16 C136 14.5 144 14.5 149 16 C164 35 186 55 216 68 Z"
          fill={FUJI_BODY}
          stroke={SUMI}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M78 68 C98 58 114 46 126 36 C136 42 146 42 156 36 C168 46 184 58 202 68 Z"
          fill={FUJI_BASE}
          opacity="0.55"
        />
        <path
          d="M111 35.5 C120 28 126 22 131 16 C136 14.5 144 14.5 149 16 C154 22 160 28 169 35.5 L161 40 L153 32.5 L146 42 L140 31.5 L133 41 L126 32.5 L119 39.5 Z"
          fill={WASHI_LIP}
        />
        <path
          d="M112 34 C120 27 126 21 131 16 C136 14.5 144 14.5 149 16 C154 21 160 27 168 34 L160 38.5 L153 31 L146 40.5 L140 30 L133 39.5 L126 31 L119 38 Z"
          fill={WASHI}
          stroke={SUMI}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M135 32 L123 52 M145 32 L157 50 M140 34 V49"
          stroke={SUMI}
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Rolling far mountain range with carved woodblock ridge lines */}
        <path
          d="M-20 70 C30 42 75 40 120 52 C165 36 215 38 260 50 C310 32 365 34 420 56 V84 H-20 Z"
          fill={RIDGE_FAR}
          stroke={SUMI}
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
        <path
          d="M38 45 L18 62 M74 44 L92 58 M194 40 L176 56 M332 35 L312 54 M352 36 L372 54"
          stroke={SUMI}
          strokeWidth="0.85"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Distant hillside pagoda in carved woodblock silhouette */}
        <g transform="translate(82 34) scale(0.75)" stroke={SUMI} strokeLinejoin="round">
          <line x1="10" y1="-7" x2="10" y2="3" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="4" y="4" width="12" height="21" fill={FUJI_BASE} strokeWidth="1.2" />
          <rect x="6" y="6" width="8" height="16" fill={WASHI_WARM} strokeWidth="0.9" />
          <path d="M-2 4 Q10 -1.5 22 4 L19 7 H1 Z" fill={RIDGE_MID} strokeWidth="1.2" />
          <path d="M-4 11 Q10 5.5 24 11 L21 14 H-1 Z" fill={RIDGE_MID} strokeWidth="1.2" />
          <path d="M-6 18 Q10 12.5 26 18 L23 21 H-3 Z" fill={RIDGE_MID} strokeWidth="1.2" />
        </g>
      </g>

      {/* Flat woodblock ground & perspective road in the lower part (y = 56..156, VP at 248, 44) */}
      <g>
        <rect x="0" y="56" width="400" height="100" fill={VERGE_MID} />
        <path
          d="M0 78 Q88 70 176 82 L96 142 L0 132 Z M268 76 Q336 68 400 78 V136 Q332 124 276 126 Z"
          fill={VERGE_DARK}
          stroke={SUMI}
          strokeWidth="0.9"
          opacity="0.72"
        />
        <path
          d="M218.5 56 L2 156 L298 156 L256.5 56 Z"
          fill={ROAD_CURB}
          stroke={SUMI}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M222.8 56 L12.8 156 L288.3 156 L252.3 56 Z"
          fill={ROAD_FLAT}
          stroke={SUMI}
          strokeWidth="1.1"
        />
        <path d="M230.5 56 L62 156 L242 156 L246 56 Z" fill={ROAD_CENTER} opacity="0.68" />
        <path
          d="M0 56 H400 M198 68 H262 M162 84 H268 M116 106 H276 M58 134 H284"
          stroke={SUMI}
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.38"
        />
        {/* Small mossy roadside Jizō statue with flat vermilion bib on the right verge */}
        <g transform="translate(324 72)" stroke={SUMI} strokeWidth="1.2" strokeLinejoin="round">
          <ellipse cx="0" cy="15" rx="8" ry="2.6" fill={STONE_LIP} />
          <path d="M-5 14 L-4 5 C-4 1 4 1 4 5 L5 14 Z" fill={STONE_MID} />
          <circle cx="0" cy="1.5" r="4.2" fill={STONE_MID} />
          <path d="M-4.5 5 Q0 9.5 4.5 5 L3.5 9.5 Q0 11.5 -3.5 9.5 Z" fill="var(--c-accent)" />
        </g>
      </g>

      {/* Parallax Layer 2: Midground hills, cedar & bamboo groves, vermilion torii & lanterns */}
      <g className="battle-parallax-mid">
        {/* Midground forested hills */}
        <path
          d="M-20 62 C40 46 104 44 168 55 C216 49 258 50 302 55 C348 43 388 45 420 58 V62 H-20 Z"
          fill={RIDGE_MID}
          stroke={SUMI}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Left cedar (sugi) woodblock silhouettes */}
        <g stroke={SUMI} strokeWidth="1.15" strokeLinejoin="round">
          <path d="M18 12 L5 33 H11 L2 50 H9 L0 62 H36 L27 50 H34 L25 33 H31 Z" fill={CEDAR_DARK} />
          <path
            d="M48 18 L37 36 H42 L34 51 H40 L32 62 H64 L56 51 H62 L54 36 H59 Z"
            fill={CEDAR_MID}
          />
          <path
            d="M76 24 L67 39 H72 L64 52 H70 L62 62 H90 L82 52 H88 L80 39 H85 Z"
            fill={CEDAR_DARK}
          />
        </g>

        {/* Left swaying bamboo stalks with ink-line nodes & flat green leaf blades */}
        <g
          className="battle-bamboo-sway"
          style={{ transformOrigin: '132px 68px' }}
          stroke={SUMI}
          strokeLinejoin="round"
        >
          {/* Flat green bamboo culms (stalks) */}
          <path
            d="M106 60 L110 12 L113.5 12 L110 60 Z M120 60 L117 8 L120.8 8 L124 60 Z M133 60 L136 14 L139.5 14 L136.5 60 Z M146 60 L151 20 L154.2 20 L149.2 60 Z"
            fill={BAMBOO_MID}
            strokeWidth="1.05"
          />
          {/* Ink-line bamboo culm nodes with pale highlight rings */}
          <path
            d="M106.5 46 H111.5 M108 32 H112.5 M109 19 H113.5 M119 42 H123.5 M118 27 H122.5 M117.2 15 H121.5 M133.5 45 H138 M134.5 31 H139 M147 46 H151.5 M149 33 H153.5"
            stroke={SUMI}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M106.5 47.3 H111.5 M108 33.3 H112.5 M119 43.3 H123.5 M118 28.3 H122.5 M133.5 46.3 H138 M134.5 32.3 H139"
            stroke={WASHI}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Flat green bamboo leaf blade fans (shade copy + bright blade + sumi contour) */}
          <g fill={BAMBOO_DARK} strokeWidth="0.9">
            <path d="M111 14 Q100 10 93 15 Q102 18 111 14 Z M111 14 Q101 18 96 24 Q105 22 111 14 Z" />
            <path d="M120 10 Q131 5 139 9 Q130 13 120 10 Z M120 10 Q132 12 138 18 Q128 17 120 10 Z" />
            <path d="M138 17 Q149 13 157 17 Q148 21 138 17 Z M138 17 Q149 20 155 26 Q145 24 138 17 Z" />
          </g>
          <g fill={BAMBOO_LIGHT} strokeWidth="0.95">
            <path d="M111 12.5 Q100 8.5 93 13.5 Q102 16.5 111 12.5 Z M111 12.5 Q101 16.5 96 22.5 Q105 20.5 111 12.5 Z M119 9 Q109 4 102 8 Q111 12 119 9 Z" />
            <path d="M120 8.5 Q131 3.5 139 7.5 Q130 11.5 120 8.5 Z M120 8.5 Q132 10.5 138 16.5 Q128 15.5 120 8.5 Z" />
            <path d="M138 15.5 Q149 11.5 157 15.5 Q148 19.5 138 15.5 Z M138 15.5 Q149 18.5 155 24.5 Q145 22.5 138 15.5 Z M152 22 Q162 19 168 24 Q159 26 152 22 Z" />
          </g>
        </g>

        {/* Right cedar (sugi) woodblock silhouettes */}
        <g stroke={SUMI} strokeWidth="1.15" strokeLinejoin="round">
          <path
            d="M344 20 L333 38 H338 L330 52 H336 L328 62 H360 L352 52 H358 L350 38 H355 Z"
            fill={CEDAR_MID}
          />
          <path
            d="M374 10 L360 32 H366 L356 49 H363 L353 62 H394 L384 49 H391 L381 32 H387 Z"
            fill={CEDAR_DARK}
          />
        </g>

        {/* Right swaying bamboo stalks with ink-line nodes & flat green leaf blades */}
        <g
          className="battle-bamboo-sway"
          style={{ transformOrigin: '306px 68px' }}
          stroke={SUMI}
          strokeLinejoin="round"
        >
          <path
            d="M292 60 L296 16 L299.5 16 L295.5 60 Z M306 60 L303 9 L306.8 9 L310 60 Z M319 60 L324 15 L327.5 15 L322.5 60 Z"
            fill={BAMBOO_MID}
            strokeWidth="1.05"
          />
          <path
            d="M292.5 45 H297 M294 31 H298.5 M305 41 H309.5 M304 26 H308.5 M303.2 15 H307.5 M319.5 44 H324 M321.5 30 H326"
            stroke={SUMI}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M292.5 46.3 H297 M294 32.3 H298.5 M305 42.3 H309.5 M304 27.3 H308.5 M319.5 45.3 H324"
            stroke={WASHI}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.7"
          />
          <g fill={BAMBOO_DARK} strokeWidth="0.9">
            <path d="M297 18 Q286 14 279 19 Q288 22 297 18 Z M297 18 Q287 22 282 28 Q291 26 297 18 Z" />
            <path d="M305 11 Q316 6 324 10 Q315 14 305 11 Z M305 11 Q294 7 287 12 Q296 15 305 11 Z" />
            <path d="M325 17 Q336 13 344 18 Q335 21 325 17 Z M325 17 Q335 21 341 27 Q331 25 325 17 Z" />
          </g>
          <g fill={BAMBOO_LIGHT} strokeWidth="0.95">
            <path d="M297 16.5 Q286 12.5 279 17.5 Q288 20.5 297 16.5 Z M297 16.5 Q287 20.5 282 26.5 Q291 24.5 297 16.5 Z" />
            <path d="M305 9.5 Q316 4.5 324 8.5 Q315 12.5 305 9.5 Z M305 9.5 Q294 5.5 287 10.5 Q296 13.5 305 9.5 Z M306 14 Q317 16 322 22 Q313 21 306 14 Z" />
            <path d="M325 15.5 Q336 11.5 344 16.5 Q335 19.5 325 15.5 Z M325 15.5 Q335 19.5 341 25.5 Q331 23.5 325 15.5 Z" />
          </g>
        </g>

        {/* Vermilion shrine Torii gate straddling the upper path entrance */}
        <g transform="translate(216 24)" stroke={SUMI} strokeLinejoin="round">
          {/* Pillars with lacquer shade & black base shoes (negane) */}
          <rect x="8" y="8" width="5" height="28" rx="1" fill="var(--c-lacquer)" stroke="none" />
          <rect
            x="7.5"
            y="8"
            width="4.5"
            height="28"
            rx="1"
            fill="var(--c-accent)"
            strokeWidth="1.25"
          />
          <rect x="31.5" y="8" width="5" height="28" rx="1" fill="var(--c-lacquer)" stroke="none" />
          <rect
            x="31"
            y="8"
            width="4.5"
            height="28"
            rx="1"
            fill="var(--c-accent)"
            strokeWidth="1.25"
          />
          <rect x="6.5" y="31" width="6.5" height="5.5" rx="1" fill={SUMI} strokeWidth="1" />
          <rect x="30" y="31" width="6.5" height="5.5" rx="1" fill={SUMI} strokeWidth="1" />
          {/* Lower tie beam (nuki) */}
          <rect
            x="3"
            y="13.2"
            width="38"
            height="3.6"
            rx="1"
            fill="var(--c-lacquer)"
            stroke="none"
          />
          <rect
            x="3"
            y="11.8"
            width="38"
            height="3.4"
            rx="1"
            fill="var(--c-accent)"
            strokeWidth="1.2"
          />
          {/* Curved top lintel (kasagi) with sumi cap & +2 lacquer lip */}
          <path
            d="M-2 5.2 Q22 0.2 46 5.2 L44 9.6 Q22 5.6 0 9.6 Z"
            fill="var(--c-lacquer)"
            stroke="none"
          />
          <path
            d="M-2 3.5 Q22 -1.5 46 3.5 L44 8 Q22 4 0 8 Z"
            fill="var(--c-accent)"
            strokeWidth="1.35"
          />
          <path
            d="M-2.5 2.8 Q22 -2.2 46.5 2.8"
            fill="none"
            stroke={SUMI}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Golden gakuzuka tablet */}
          <rect x="19.2" y="5.8" width="5.6" height="6.8" rx="0.8" fill={SUMI} strokeWidth="1" />
          <rect
            x="20.4"
            y="7"
            width="3.2"
            height="4.4"
            rx="0.4"
            fill="var(--c-glow)"
            stroke="none"
          />
          {/* Top-left woodblock highlight */}
          <ellipse
            cx="11"
            cy="5.2"
            rx="4.5"
            ry="0.9"
            fill="var(--c-hud-ink)"
            stroke="none"
            opacity="0.4"
          />
        </g>

        {/* Carved stone lantern (tōrō) left of torii */}
        <g transform="translate(200 40)" stroke={SUMI} strokeWidth="1.15" strokeLinejoin="round">
          <circle
            cx="6"
            cy="9"
            r="7.5"
            fill={WASHI_WARM}
            stroke="none"
            opacity="0.34"
            className="battle-lantern-glow"
          />
          <rect x="2" y="17.5" width="8" height="3" rx="0.8" fill={STONE_LIP} />
          <rect x="3.2" y="12" width="5.6" height="6" rx="0.8" fill={STONE_MID} />
          <rect x="2.2" y="6.2" width="7.6" height="6" rx="1" fill={STONE_MID} />
          <rect
            x="3.8"
            y="7.4"
            width="4.4"
            height="3.4"
            rx="0.6"
            fill="var(--c-glow)"
            strokeWidth="0.85"
            className="battle-lantern-glow"
          />
          <path d="M-0.5 6.8 L6 1.8 L12.5 6.8 Z" fill={STONE_LIP} />
          <path d="M-0.5 5.8 L6 1 L12.5 5.8 Z" fill={STONE_MID} />
        </g>

        {/* Hanging vermilion chōchin lantern right of torii */}
        <g transform="translate(268 35)" stroke={SUMI} strokeLinejoin="round">
          <path d="M8 24 V4 H0" stroke={SUMI} strokeWidth="2.1" strokeLinecap="round" fill="none" />
          <circle
            cx="0"
            cy="11"
            r="8.5"
            fill={WASHI_WARM}
            stroke="none"
            opacity="0.34"
            className="battle-lantern-glow"
          />
          <ellipse cx="0" cy="11.8" rx="4.8" ry="5.6" fill="var(--c-lacquer)" stroke="none" />
          <ellipse cx="0" cy="10.4" rx="4.8" ry="5.2" fill="var(--c-accent)" strokeWidth="1.25" />
          <path
            d="M-4.3 8.8 Q0 9.8 4.3 8.8 M-4.3 12 Q0 13 4.3 12"
            stroke="var(--c-lacquer)"
            strokeWidth="0.9"
            fill="none"
          />
          <rect x="-2.6" y="4.5" width="5.2" height="1.8" rx="0.6" fill={SUMI} stroke="none" />
          <rect x="-2.6" y="14.8" width="5.2" height="1.8" rx="0.6" fill={SUMI} stroke="none" />
          <ellipse
            cx="0"
            cy="10.4"
            rx="2.1"
            ry="2.6"
            fill="var(--c-glow)"
            stroke="none"
            className="battle-lantern-glow"
          />
        </g>
      </g>

      {/* Upper-left ukiyo-e red title cartouche (tanzaku) with single kanji 竹 (bamboo) */}
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
        {/* Carved vector strokes for 竹 (bamboo) */}
        <path
          d="M5.4 6.2 L3.8 10.2 M4.8 8.2 H7.6 M6.2 8.2 V19.8 M9.6 5.8 L8.2 9.8 M9 7.8 H12.2 M10.6 7.8 V19.2 Q10.6 20.4 9.3 19.6"
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
