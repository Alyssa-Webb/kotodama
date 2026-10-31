/**
 * Self-contained SVG battle backdrop for the Dojo (`0 0 400 156`, vanishing point at (248, 44),
 * horizon at y = 56), rendered as a traditional sumi-e (水墨画) ink painting on warm washi paper.
 *
 * Palette flips naturally between light and dark themes via `--c-surface` / `--c-panel` / `--c-bg`
 * (washi paper) and `--c-ink` / `--c-ink-muted` (sumi ink & dry-brush kasure), with a single
 * vermilion accent (`--c-accent`) on the hanging scroll's hanko seal.
 */
import '../battle-backdrops.css';
import './dojo-sumie.css';

const PAPER_BASE = 'var(--c-surface)';
const PAPER_WARM = 'color-mix(in srgb, var(--c-surface) 74%, var(--c-bg))';
const PAPER_EDGE = 'color-mix(in srgb, var(--c-surface-alt) 82%, var(--c-border))';
const SUMI_DEEP = 'var(--c-ink)';
const SUMI_DARK = 'color-mix(in srgb, var(--c-ink) 82%, var(--c-ink-muted))';
const SUMI_MID = 'var(--c-ink-muted)';
const SUMI_WASH = 'color-mix(in srgb, var(--c-ink) 16%, var(--c-surface))';
const SUMI_PALE = 'color-mix(in srgb, var(--c-ink) 8%, var(--c-surface))';

/**
 * Inside a wooden dojo hall painted in sumi-e ink: expressive wet and dry brush strokes for the
 * overhead beams, floorboards, shoji lattice, kamiza alcove and bokken rack; grey ink washes
 * (tanboku nijimi) for shadow and depth; plenty of open washi paper; a pale soft light wash
 * through the shoji; and one vermilion hanko seal on the hanging scroll.
 */
export function DojoHallBackdrop({ className }: { className?: string }) {
  const cls =
    className && className !== 'battle-backdrop'
      ? `battle-backdrop ${className}`
      : 'battle-backdrop';
  return (
    <svg viewBox="0 0 400 156" preserveAspectRatio="xMidYMid slice" className={cls}>
      <defs>
        {/* Warm handmade gasenshi washi paper with subtle edge toning */}
        <radialGradient id="dojo-washi-paper" cx="52%" cy="44%" r="68%">
          <stop offset="0%" stopColor={PAPER_BASE} />
          <stop offset="72%" stopColor={PAPER_WARM} />
          <stop offset="100%" stopColor={PAPER_EDGE} />
        </radialGradient>

        {/* Soft grey sumi ink wash (tanboku) for the upper wall & alcove depth */}
        <linearGradient id="dojo-wall-wash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SUMI_DEEP} stopOpacity="0.16" />
          <stop offset="38%" stopColor={SUMI_MID} stopOpacity="0.06" />
          <stop offset="86%" stopColor={SUMI_MID} stopOpacity="0.02" />
          <stop offset="100%" stopColor={SUMI_DEEP} stopOpacity="0.11" />
        </linearGradient>

        {/* Outer floor ink wash flanking the open washi training lane */}
        <linearGradient id="dojo-floor-wash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SUMI_DEEP} stopOpacity="0.14" />
          <stop offset="32%" stopColor={SUMI_MID} stopOpacity="0.06" />
          <stop offset="100%" stopColor={SUMI_DEEP} stopOpacity="0.18" />
        </linearGradient>

        {/* Pale, soft wash of daylight filtering through the translucent shoji */}
        <linearGradient id="dojo-shoji-light" x1="0" y1="0" x2="0.65" y2="1">
          <stop offset="0%" stopColor={PAPER_BASE} stopOpacity="0.88" />
          <stop offset="55%" stopColor={PAPER_BASE} stopOpacity="0.46" />
          <stop offset="100%" stopColor={PAPER_BASE} stopOpacity="0" />
        </linearGradient>

        {/* Soft paper lantern wash halo */}
        <radialGradient id="dojo-lantern-wash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={PAPER_BASE} stopOpacity="0.78" />
          <stop offset="55%" stopColor={SUMI_PALE} stopOpacity="0.28" />
          <stop offset="100%" stopColor={PAPER_BASE} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Open warm washi paper ground across the entire canvas */}
      <rect width="400" height="156" fill="url(#dojo-washi-paper)" />

      {/* Subtle handmade washi paper fibre whispers in the negative space */}
      <path
        d="M28 16 Q38 14 46 17 M142 15 Q152 18 160 15 M346 18 Q356 15 364 19 M84 96 Q96 93 106 97 M212 118 Q224 115 232 119 M146 144 Q158 141 168 145"
        fill="none"
        stroke="var(--c-border)"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Far wall atmospheric tanboku ink wash & upper plaster frieze shadow */}
      <rect width="400" height="56" fill="url(#dojo-wall-wash)" />
      <path
        d="M0 10 C92 9.2 214 10.6 400 9.5 L400 22 C268 23.2 128 21.6 0 22.5 Z"
        fill={SUMI_DEEP}
        opacity="0.06"
      />

      {/* Confident horizontal brush stroke for the upper wall beam (nageshi, y ≈ 22) */}
      <path
        d="M-2 21.4 C78 20.2 196 21.8 312 20.8 C348 20.5 378 21.1 402 21.8 C374 23.1 336 22.9 296 23.2 C184 23.8 76 23.1 -2 23.6 Z"
        fill={SUMI_DARK}
      />
      {/* Dry-brush kasure bristle tail along the nageshi beam */}
      <path
        d="M44 22.2 H118 M182 22.1 H258 M318 22.3 H388"
        stroke={PAPER_BASE}
        strokeWidth="0.65"
        strokeLinecap="round"
        opacity="0.48"
      />

      {/* Dojo floor (y = 56..156): mostly open washi paper with grey ink washes on the side wings */}
      <path
        d="M0 56 H222.8 L12.8 156 H0 Z M252.3 56 H400 V156 H288.3 Z"
        fill="url(#dojo-floor-wash)"
      />
      {/* Soft wet-ink pooling (nijimi) in the far left and right floor corners */}
      <path
        d="M0 56 C48 56 96 62 128 74 C72 86 28 112 0 138 Z M400 56 C352 56 312 62 284 72 C332 84 374 108 400 132 Z"
        fill={SUMI_DEEP}
        opacity="0.08"
      />

      {/* Central training lane: left in luminous open washi paper so characters pop */}
      <path
        d="M222.8 56 L12.8 156 L288.3 156 L252.3 56 Z"
        fill={PAPER_BASE}
        opacity="0.52"
      />
      {/* Faint sumi wash ring on the upper-mid lane where the opponent stands (228, 88) */}
      <ellipse cx="228" cy="88" rx="34" ry="8" fill={SUMI_DEEP} opacity="0.055" />
      <path
        d="M196 88 C206 82 248 82 260 88 C248 84.5 208 84.5 196 88 Z"
        fill={SUMI_MID}
        opacity="0.28"
      />

      {/* Calligraphic perspective brush strokes framing the central training lane boundaries */}
      <path
        d="M222.8 56 C168 82 94 117 10 156 L15.8 156 C98 117 170 82 224.2 56 Z"
        fill={SUMI_DARK}
        opacity="0.72"
      />
      <path
        d="M252.3 56 C262 83 274 118 286.8 156 L290.4 156 C277 118 264 83 253.7 56 Z"
        fill={SUMI_DARK}
        opacity="0.72"
      />
      {/* Dry-brush outer court boundary whisper */}
      <path
        d="M219.5 56 L4 156 M255.5 56 L295.5 156"
        stroke={SUMI_MID}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeDasharray="18 6 9 5"
        opacity="0.45"
        fill="none"
      />

      {/* Receding floorboard plank seams & transverse joints brushed in tapered sumi strokes */}
      <g fill="none" strokeLinecap="round">
        {/* Perspective seams converging toward vanishing point (248, 44) */}
        <path
          d="M192 56 L0 98 M208 56 L0 132 M230 56 L62 156 M238 56 L132 156 M245 56 L208 156 M266 56 L354 156 M284 56 L400 122"
          stroke={SUMI_MID}
          strokeWidth="0.95"
          opacity="0.38"
        />
        {/* Wet-brush accents where plank seams meet the horizon */}
        <path
          d="M192 56 L124 71 M208 56 L138 79 M230 56 L176 88 M238 56 L206 96 M245 56 L232 98 M266 56 L298 92 M284 56 L338 87"
          stroke={SUMI_DEEP}
          strokeWidth="1.25"
          opacity="0.34"
        />
        {/* Transverse plank joints with organic dry-brush gaps so the floor stays calm */}
        <path
          d="M0 70 H188 M204 70 H264 M282 70 H400 M0 88 H142 M168 88 H246 M268 88 H400 M0 112 H96 M124 112 H222 M254 112 H376 M0 140 H62 M94 140 H198 M236 140 H348"
          stroke={SUMI_MID}
          strokeWidth="0.9"
          opacity="0.34"
        />
      </g>

      {/* Far wall wooden baseboard (machi-ita) at horizon y = 56: bold wet-to-dry brush stroke */}
      <path
        d="M-2 53.2 C96 52.4 218 53.6 402 52.8 L402 56.4 C248 56.9 112 55.8 -2 56.5 Z"
        fill={SUMI_DEEP}
      />
      <path
        d="M24 54.6 H136 M218 54.5 H342"
        stroke={PAPER_BASE}
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.42"
      />

      {/* Left shoji screens: crisp sumi brushwork, translucent paper wash & ink bamboo silhouettes */}
      <g>
        {[14, 62, 110, 156].map((x, i) => (
          <g key={x} transform={`translate(${x} 24)`}>
            {/* Translucent shoji rice paper reserve */}
            <rect x="2" y="1.8" width="38" height="20.5" fill={PAPER_BASE} opacity="0.86" />
            {/* Faint grey ink wash at top-right of each shoji pane */}
            <path d="M2 1.8 H40 V11 C28 8 14 5 2 6 Z" fill={SUMI_DEEP} opacity="0.05" />

            {/* Exterior sumi-e bamboo stalk & flicked ink bamboo leaves seen through the paper */}
            <path
              d={i % 2 === 0 ? 'M11 21 Q14 11 18 2' : 'M27 21 Q25 11 29 2'}
              stroke={SUMI_MID}
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              opacity="0.22"
            />
            <path
              d={
                i % 2 === 0
                  ? 'M14 9 C19 6 24 6 27 8 C22 9 17 10 14 9 Z M15 13 C20 12 24 14 27 17 C22 16 18 15 15 13 Z M13 11 C9 9 6 10 4 12 C7 12 10 12 13 11 Z'
                  : 'M26 8 C21 5 16 6 13 8 C18 9 23 9 26 8 Z M26 13 C30 11 34 12 36 15 C32 14 29 14 26 13 Z'
              }
              fill={SUMI_DEEP}
              opacity="0.2"
            />

            {/* Fine menso-brush kumiko lattice bars */}
            <path
              d="M14.8 2 V22 M27.2 2 V22 M2.2 8.6 H39.8 M2.2 15.2 H39.8"
              stroke={SUMI_MID}
              strokeWidth="0.95"
              strokeLinecap="round"
              opacity="0.72"
            />

            {/* Lower wooden kick-panel (koshi-ita) brushed in medium-dark sumi wash */}
            <rect x="2" y="22.2" width="38" height="5.6" fill={SUMI_WASH} />
            <path
              d="M2.5 23.2 C14 22.6 28 22.8 39.5 23.4 L39.5 27.4 C27 27.8 14 27.6 2.5 27.2 Z"
              fill={SUMI_DEEP}
              opacity="0.32"
            />
            {/* Dry-brush wood grain whisper on kick-panel */}
            <path
              d="M6 25.2 Q21 24.4 36 25.4"
              stroke={PAPER_BASE}
              strokeWidth="0.65"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />

            {/* Outer shoji timber frame brushed with variable-weight sumi strokes */}
            <path
              d="M0.8 0.6 C14 0.2 28 0.2 41.2 0.6 L41.4 28.4 C28 28.8 14 28.8 0.6 28.4 Z M2.4 2.1 V26.9 H39.6 V2.1 Z"
              fill={SUMI_DEEP}
              fillRule="evenodd"
            />
            <path d="M2.2 22.1 H39.8" stroke={SUMI_DEEP} strokeWidth="1.3" strokeLinecap="round" />
          </g>
        ))}

        {/* Perspective left-side shoji screen angled toward the viewer */}
        <path d="M0 15 L11.5 24.5 V64.5 L0 80 Z" fill={PAPER_BASE} opacity="0.9" />
        <path d="M0 52 L11.5 55.5 V64.5 L0 80 Z" fill={SUMI_DEEP} opacity="0.28" />
        <path
          d="M0 32 L11 38 M0 46 L11 50.5 M5.5 20 V68"
          stroke={SUMI_MID}
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        <path
          d="M0 13.5 L12.5 24 V65.5 L0 82.5 L0 79 L10.6 64 V25 L0 16.5 Z"
          fill={SUMI_DEEP}
        />
      </g>

      {/* Kamiza alcove with hanging scroll at the back wall (head of the training lane) */}
      <g transform="translate(206 14)">
        {/* Recessed alcove wash (tanboku nijimi) */}
        <rect x="4.5" y="3.5" width="53" height="36" rx="1.5" fill={SUMI_WASH} />
        <path
          d="M5 4 H57 V16 C42 12 20 12 5 17 Z"
          fill={SUMI_DEEP}
          opacity="0.12"
        />

        {/* Strong vertical sumi pillar brush strokes on either side of the kamiza */}
        <path
          d="M2.2 2.5 C4.2 2 5.8 2 7.2 2.8 L6.8 39.5 C5 40 3.4 40 2 39.2 Z"
          fill={SUMI_DEEP}
        />
        <path
          d="M3.6 5.5 V34"
          stroke={PAPER_BASE}
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.48"
        />
        <path
          d="M54.8 2.8 C56.2 2 57.8 2 59.8 2.5 L60 39.2 C58.6 40 57 40 55.2 39.5 Z"
          fill={SUMI_DEEP}
        />
        <path
          d="M56.4 5.5 V34"
          stroke={PAPER_BASE}
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.48"
        />

        {/* Curved overhanging kamiza lintel beam brushed in one sweeping stroke */}
        <path
          d="M-2.5 2.4 Q31 -2.4 64.5 2.4 L62.5 6.8 Q31 2.8 -0.5 6.8 Z"
          fill={SUMI_DEEP}
        />
        <path
          d="M6 3.6 Q31 0.8 56 3.6"
          stroke={PAPER_BASE}
          strokeWidth="0.75"
          strokeLinecap="round"
          fill="none"
          opacity="0.45"
        />
        {/* Brushed ink cord & tassel knot at lintel center */}
        <circle cx="31" cy="5.4" r="2.1" fill={SUMI_DARK} />
        <circle cx="30.5" cy="4.9" r="0.8" fill={PAPER_BASE} opacity="0.7" />

        {/* Hanging scroll (kakejiku) in sumi mounting & warm washi reserve */}
        <path d="M31 5.8 L25 8.2 M31 5.8 L37 8.2" stroke={SUMI_MID} strokeWidth="0.85" />
        {/* Silk brocade mounting in medium grey sumi wash */}
        <rect
          x="19.5"
          y="8"
          width="23"
          height="26.5"
          rx="1"
          fill={SUMI_MID}
          opacity="0.28"
        />
        <rect
          x="19.5"
          y="8"
          width="23"
          height="26.5"
          rx="1"
          fill="none"
          stroke={SUMI_DARK}
          strokeWidth="1.15"
        />
        {/* Honshi (inner paper of the scroll) */}
        <rect x="22" y="10.2" width="18" height="21" rx="0.6" fill={PAPER_BASE} />
        {/* Top & bottom wooden scroll rollers (jiku) with ink end caps */}
        <path d="M17.5 7.4 H44.5" stroke={SUMI_DEEP} strokeWidth="2.1" strokeLinecap="round" />
        <path d="M16.5 34.4 H45.5" stroke={SUMI_DEEP} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M18.5 34.1 H43.5" stroke={PAPER_BASE} strokeWidth="0.65" opacity="0.5" />

        {/* Bold calligraphic brush strokes on the hanging scroll */}
        <path
          d="M31 12.6 C31.6 16.5 30.6 21.5 31 26.2 M26.2 16.8 C29.2 15.4 32.8 15.4 35.8 16.8 M27.2 21.8 C29.8 20.8 32.4 20.8 34.8 21.8"
          stroke={SUMI_DEEP}
          strokeWidth="2.1"
          strokeLinecap="round"
          fill="none"
        />

        {/* THE SINGLE VERMILION ACCENT: carved hanko seal stamp on the scroll */}
        <rect x="34.2" y="25.2" width="3.8" height="3.8" rx="0.5" fill="var(--c-accent)" />
        <path
          d="M35.1 26.3 H37.1 M36.1 26.3 V28.1"
          stroke={PAPER_BASE}
          strokeWidth="0.65"
          strokeLinecap="round"
        />

        {/* Raised kamiza dais brushed in deep sumi ink with dry-brush highlight */}
        <path
          d="M-0.5 37.2 C18 36.5 44 36.5 62.5 37.2 L62 43.2 C42 43.8 20 43.8 0 43.2 Z"
          fill={SUMI_DEEP}
        />
        <path
          d="M5 38.6 Q24 38 46 38.7"
          stroke={PAPER_BASE}
          strokeWidth="0.85"
          strokeLinecap="round"
          fill="none"
          opacity="0.48"
        />
      </g>

      {/* Right wall framed calligraphy plaque & weapon rack of bokken in sumi brushwork */}
      <g>
        {/* Framed dojo plaque (gaku) on the right back wall */}
        <rect x="285" y="24.5" width="42" height="13" rx="1" fill={PAPER_BASE} />
        <rect x="285" y="24.5" width="42" height="13" rx="1" fill={SUMI_PALE} />
        <path
          d="M283.5 23.8 C298 23.2 314 23.2 328.5 23.8 L328 38.4 C314 38.9 298 38.9 284 38.4 Z M286.2 25.6 V36.6 H325.8 V25.6 Z"
          fill={SUMI_DEEP}
          fillRule="evenodd"
        />
        {/* Brisk horizontal calligraphy strokes inside the plaque */}
        <path
          d="M294 31 H318 M301 28 V34.2 M311 28 V34.2"
          stroke={SUMI_DEEP}
          strokeWidth="1.9"
          strokeLinecap="round"
          fill="none"
        />

        {/* Weapon rack of bokken on the right dojo floor (strictly right of the training lane) */}
        <g transform="translate(296 52)">
          {/* Soft wet ink ground shadow under the rack */}
          <ellipse cx="38" cy="47.5" rx="37" ry="5.8" fill={SUMI_DEEP} opacity="0.15" />
          <path
            d="M8 47.5 C24 44.5 52 44.5 68 47.5 C52 49.5 24 49.5 8 47.5 Z"
            fill={SUMI_DEEP}
            opacity="0.18"
          />

          {/* Rack base feet & upright side posts brushed in deep sumi ink */}
          <path
            d="M5.5 41.2 C10 40.2 17 40.2 22 41.2 L21.5 46.2 C16.5 46.8 10.5 46.8 6 46.2 Z"
            fill={SUMI_DEEP}
          />
          <path
            d="M53.5 41.2 C58 40.2 65 40.2 70 41.2 L69.5 46.2 C64.5 46.8 58.5 46.8 54 46.2 Z"
            fill={SUMI_DEEP}
          />
          <path
            d="M11.2 4 C13 3.4 14.8 3.4 16.5 4 L16.2 42.5 H11.5 Z"
            fill={SUMI_DEEP}
          />
          <path
            d="M59.2 4 C61 3.4 62.8 3.4 64.5 4 L64.2 42.5 H59.5 Z"
            fill={SUMI_DEEP}
          />
          {/* Dry-brush flying white highlight on rack uprights & lower tie bar */}
          <path
            d="M12.8 7 V38 M60.8 7 V38"
            stroke={PAPER_BASE}
            strokeWidth="0.75"
            strokeLinecap="round"
            opacity="0.46"
          />
          <path
            d="M12 34.2 C28 33.6 48 33.6 64 34.2 L64 37.4 C48 37.9 28 37.9 12 37.4 Z"
            fill={SUMI_DARK}
          />

          {/* Three tiered wooden bokken brushed with tapering calligraphic blades */}
          {[9, 19, 29].map((y, idx) => (
            <g key={y} transform={`translate(0 ${y})`}>
              {/* Tapering sumi brush stroke for the curved bokken blade & handle */}
              <path
                d="M1.5 1.8 C24 4.8 50 3.6 74.8 -0.6 C75.6 -0.2 75.2 1.2 73.2 1.8 C49 6.2 24 7.2 1.8 4.4 C0.4 4.1 0.4 1.9 1.5 1.8 Z"
                fill={idx === 1 ? SUMI_DARK : SUMI_DEEP}
              />
              {/* Reserved paper highlight along the upper ridge (shinogi) of the blade */}
              <path
                d="M22 2.8 Q48 3.6 71 0.3"
                stroke={PAPER_BASE}
                strokeWidth="0.8"
                strokeLinecap="round"
                fill="none"
                opacity="0.58"
              />
              {/* Tsuka handle cord wrap texture in crisp ink ticks */}
              <path
                d="M5 1.8 L6.5 4.2 M9.5 2.1 L11 4.5 M14 2.4 L15.5 4.7"
                stroke={PAPER_BASE}
                strokeWidth="0.65"
                strokeLinecap="round"
                opacity="0.55"
              />
              {/* Round tsuba handguard brushed in solid sumi ink */}
              <rect x="18.2" y="-1.8" width="3" height="7.6" rx="1.2" fill={SUMI_DEEP} />
            </g>
          ))}
        </g>
      </g>

      {/* Pale, soft light wash slanting from the left shoji across the floorboards (1 gentle loop) */}
      <g className="dojo-sumie-wash-breathe">
        <path d="M18 26 L56 26 L128 118 L52 118 Z" fill="url(#dojo-shoji-light)" />
        <path d="M68 26 L108 26 L192 126 L126 126 Z" fill="url(#dojo-shoji-light)" />
        <path d="M118 26 L166 26 L254 132 L194 132 Z" fill="url(#dojo-shoji-light)" />
      </g>

      {/* Overhead timber tie-beam brushed across y = 0..10 with wet ink & dry-brush streaks */}
      <path
        d="M-2 0 H402 V8.8 C308 10.2 184 8.6 68 9.8 C34 10.1 12 9.6 -2 9.2 Z"
        fill={SUMI_DEEP}
      />
      <path
        d="M18 4.2 C86 3.4 168 4.6 254 3.8 M288 4.4 C332 3.8 368 4.5 392 4.1 M64 7.2 H176 M244 7.1 H352"
        stroke={PAPER_BASE}
        strokeWidth="0.75"
        strokeLinecap="round"
        fill="none"
        opacity="0.38"
      />

      {/* Hanging paper lanterns (chochin) brushed in delicate sumi ink & pale paper wash */}
      {[88, 178, 312].map((x) => (
        <g key={x}>
          {/* Soft pale wash halo around the lantern */}
          <circle cx={x} cy="22.5" r="16" fill="url(#dojo-lantern-wash)" />
          {/* Hanging cord stroke */}
          <path
            d={`M${x} 8.5 V14.2`}
            stroke={SUMI_DEEP}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Washi paper lantern body with subtle side ink shading */}
          <ellipse cx={x} cy="22.2" rx="8.2" ry="7.4" fill={PAPER_BASE} />
          <path
            d={`M${x + 2} 15.2 C${x + 6.8} 16.5 ${x + 8.4} 20.5 ${x + 7.2} 25.2 C${x + 5.8} 28.2 ${x + 2.2} 29.5 ${x - 2} 29.2 C${x + 3.2} 28.2 ${x + 5.6} 24.5 ${x + 5.2} 20.2 C${x + 4.8} 17.4 ${x + 3.5} 15.8 ${x + 2} 15.2 Z`}
            fill={SUMI_DEEP}
            opacity="0.14"
          />
          {/* Expressive curved sumi brush contour & fine bamboo rib lines */}
          <ellipse
            cx={x}
            cy="22.2"
            rx="8.2"
            ry="7.4"
            fill="none"
            stroke={SUMI_DEEP}
            strokeWidth="1.35"
          />
          <path
            d={`M${x - 7.4} 19.8 Q${x} 18.6 ${x + 7.4} 19.8 M${x - 7.6} 22.4 Q${x} 21.3 ${x + 7.6} 22.4 M${x - 7.2} 25 Q${x} 24 ${x + 7.2} 25`}
            stroke={SUMI_MID}
            strokeWidth="0.65"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />
          {/* Top & bottom black sumi rims */}
          <rect x={x - 4.4} y="13.6" width="8.8" height="2.2" rx="0.9" fill={SUMI_DEEP} />
          <rect x={x - 4.4} y="28.6" width="8.8" height="2.3" rx="0.9" fill={SUMI_DEEP} />
        </g>
      ))}
    </svg>
  );
}
