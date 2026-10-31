import { harikoPalette, MaruCluster, PaperLantern, PlumBlossom } from './hariko';

/** The School: Edo hariko folk-toy two-part schoolhouse with painted floral roof and bell post. */
export function School({ lit }: { lit: boolean }) {
  const c = harikoPalette(lit);

  return (
    <g>
      {/* Thick navy-indigo hariko foundation base under both wings (+3 lip + base) */}
      <path
        d="M10 75 C10 71 19 69 52 69 C85 69 93 71 93 75 C93 79 84 81 52 81 C20 81 10 79 10 75 Z"
        fill={c.indigoShade}
      />
      <path
        d="M10 72.5 C10 68.5 19 66.5 52 66.5 C85 66.5 93 68.5 93 72.5 C93 76.5 84 78.5 52 78.5 C20 78.5 10 76.5 10 72.5 Z"
        fill={c.indigo}
      />

      {/* Left shorter classroom wing (one-story gofun body + vermilion roof) */}
      <g>
        <path
          d="M13 44 C13 40 20 38 31 38 C42 38 47 40 47 44 L47 71 C47 74 41 75 30 75 C19 75 13 74 13 71 Z"
          fill={c.gofunShade}
        />
        <path
          d="M13 41 C13 37 20 35 31 35 C42 35 47 37 47 41 L47 68 C47 71 41 72 30 72 C19 72 13 71 13 68 Z"
          fill={c.gofun}
        />
        {/* Indigo base band on left wing */}
        <path d="M13 65 H47 V70 C47 72 41 73 30 73 C19 73 13 72 13 70 Z" fill={c.indigo} />

        {/* Painted indigo wave motif & gold flower on left wall */}
        <path
          d="M14 59 Q18 55 22 59 Q26 63 30 59 L30 65 L14 65 Z"
          fill={c.indigo}
          opacity="0.88"
        />
        <PlumBlossom x={18.5} y={50} scale={0.85} petalFill={c.goldLeaf} centerFill={c.vermilion} />

        {/* Left wing red-framed 4-pane window */}
        <rect x="24.5" y="47.5" width="13" height="12" rx="2.5" fill={c.vermilionShade} />
        <rect x="24.5" y="46" width="13" height="12" rx="2.5" fill={c.vermilion} />
        <rect x="26.5" y="48" width="9" height="8" rx="1.4" fill={c.winFill} />
        <path d="M31 48 V56 M26.5 52 H35.5" stroke={c.vermilion} strokeWidth="1.3" />

        {/* Left wing shu-vermilion gabled roof with indigo ridge & white petal dots */}
        <path
          d="M9 44 L29 27 L48 44 C44 46 39 46 29 37 C19 46 13 46 9 44 Z"
          fill={c.vermilionShade}
        />
        <path
          d="M9 41.5 L29 24.5 L48 41.5 C44 43.5 39 43.5 29 34.5 C19 43.5 13 43.5 9 41.5 Z"
          fill={c.vermilion}
        />
        <path d="M21 31 L29 24 L37 31" stroke={c.indigo} strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <MaruCluster x={22} y={35.5} fill={c.gofun} r={1.1} />
        <PlumBlossom x={31} y={40} scale={0.75} petalFill={c.goldLeaf} centerFill={c.vermilion} />
      </g>

      {/* Main two-story gabled schoolhouse (center-right) */}
      <g>
        {/* Main gofun-white body (+3 lip + wall) */}
        <path
          d="M42 32 C42 26 52 24 66 24 C80 24 89 26 89 32 L89 71 C89 74 81 75 65.5 75 C50 75 42 74 42 71 Z"
          fill={c.gofunShade}
        />
        <path
          d="M42 29 C42 23 52 21 66 21 C80 21 89 23 89 29 L89 68 C89 71 81 72 65.5 72 C50 72 42 71 42 68 Z"
          fill={c.gofun}
        />
        {/* Indigo foundation band along bottom of main house */}
        <path d="M42 65 H89 V70 C89 72 81 73 65.5 73 C50 73 42 72 42 70 Z" fill={c.indigo} />

        {/* Upper gable fill & painted floral motif under roof peak */}
        <path d="M44 33 L65.5 14 L87 33 Z" fill={c.gofun} />
        <PlumBlossom x={65.5} y={20.5} scale={0.9} petalFill={c.vermilion} centerFill={c.goldLeaf} />

        {/* Second-floor red-framed 4-pane window & painted blue swag underneath */}
        <rect x="59" y="26.5" width="13" height="11.5" rx="2.5" fill={c.vermilionShade} />
        <rect x="59" y="25" width="13" height="11.5" rx="2.5" fill={c.vermilion} />
        <rect x="61" y="27" width="9" height="7.5" rx="1.4" fill={c.winFill} />
        <path d="M65.5 27 V34.5 M61 30.8 H70" stroke={c.vermilion} strokeWidth="1.3" />
        <path
          d="M57 38.5 Q65.5 42.5 74 38.5"
          fill="none"
          stroke={c.indigo}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Thick dark sumi mid-floor beam decorated with gold & white folk dots */}
        <path
          d="M40 44.5 C40 42.5 48 42 65.5 42 C83 42 91 42.5 91 44.5 C91 46.5 83 47 65.5 47 C48 47 40 46.5 40 44.5 Z"
          fill={c.sumi}
        />
        <circle cx="51" cy="44.5" r="1.6" fill={c.goldLeaf} />
        <circle cx="58" cy="44.5" r="1.4" fill={c.gofun} />
        <circle cx="73" cy="44.5" r="1.4" fill={c.gofun} />
        <circle cx="80" cy="44.5" r="1.6" fill={c.goldLeaf} />

        {/* First floor: left red-framed window */}
        <rect x="45.5" y="51" width="11" height="11" rx="2.2" fill={c.vermilionShade} />
        <rect x="45.5" y="49.5" width="11" height="11" rx="2.2" fill={c.vermilion} />
        <rect x="47.3" y="51.3" width="7.4" height="7.4" rx="1.2" fill={c.winFill} />
        <path d="M51 51.3 V58.7 M47.3 55 H54.7" stroke={c.vermilion} strokeWidth="1.2" />

        {/* First floor: central vermilion double door & tan threshold step */}
        <rect x="60" y="50" width="13" height="19" rx="2.5" fill={c.vermilionShade} />
        <rect x="60" y="48.5" width="13" height="19" rx="2.5" fill={c.vermilion} />
        <line x1="66.5" y1="49" x2="66.5" y2="67" stroke={c.sumi} strokeWidth="1.2" />
        <circle cx="64.5" cy="58" r="1.1" fill={c.gofun} />
        <circle cx="68.5" cy="58" r="1.1" fill={c.gofun} />
        <rect x="58.5" y="67.5" width="16" height="3.5" rx="1.5" fill={c.goldLeaf} />

        {/* First floor: green potted plant in a vermilion pot on right of door */}
        <path d="M77.5 61 H84.5 L83.5 67.5 H78.5 Z" fill={c.vermilion} />
        <circle cx="81" cy="57.5" r="4.2" fill={c.pineShade} />
        <circle cx="81" cy="56" r="4.2" fill={c.pine} />
        <circle cx="81" cy="54.5" r="1.3" fill={c.vermilion} />

        {/* Thick hand-molded gofun & indigo gabled roof with floral trim (+3 lip + base) */}
        <path
          d="M36 35 L65.5 11 L95 35 C91 38 85 37 65.5 21 C46 37 40 38 36 35 Z"
          fill={c.gofunShade}
        />
        <path
          d="M36 32 L65.5 8 L95 32 C91 35 85 34 65.5 18 C46 34 40 35 36 32 Z"
          fill={c.gofunWarm}
        />
        <path
          d="M38 31 L65.5 8.5 L93 31"
          fill="none"
          stroke={c.vermilion}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse
          cx="52"
          cy="20"
          rx="9.5"
          ry="2.6"
          transform="rotate(-36 52 20)"
          fill={c.highlight}
          opacity="0.42"
        />
      </g>

      {/* Freestanding wooden T-post with hanging school bell on far right */}
      <g>
        {/* Flared circular base & vertical wooden post */}
        <ellipse cx="101" cy="76.5" rx="7.5" ry="3.2" fill={c.sumi} />
        <ellipse cx="101" cy="75" rx="7" ry="2.8" fill={c.goldShade} />
        <rect x="98.8" y="28" width="4.4" height="47" rx="2" fill={c.sumi} />
        <rect x="98.8" y="27" width="3.4" height="47" rx="1.6" fill={c.goldShade} />
        {/* T-crossbar at top */}
        <rect x="93" y="29" width="18" height="4.2" rx="2" fill={c.sumi} />
        <rect x="93" y="27.8" width="18" height="3.8" rx="1.8" fill={c.goldShade} />

        {/* Hanging golden-bronze school bell (gentle swing when lit) */}
        <g className={lit ? 'hariko-school-bell' : undefined}>
          <rect x="105.2" y="31.5" width="2" height="4.5" rx="0.9" fill={c.sumi} />
          <path
            d="M101.5 46 C101.5 36.5 111 36.5 111 46 L112.5 48.5 H100 Z"
            fill={c.goldShade}
          />
          <path
            d="M101.5 44.5 C101.5 35 111 35 111 44.5 L112.5 47 H100 Z"
            fill={lit ? 'var(--c-glow)' : c.goldLeaf}
          />
          <circle cx="106.2" cy="48.2" r="2" fill={c.vermilion} />
        </g>
      </g>

      {/* Hanging paper lanterns */}
      <PaperLantern x={41} y={37} lit={lit} />
      <PaperLantern x={90} y={37} lit={lit} />
    </g>
  );
}
