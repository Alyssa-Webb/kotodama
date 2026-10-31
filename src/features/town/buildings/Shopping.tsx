import { harikoPalette, MaruCluster, PaperLantern, PlumBlossom } from './hariko';

/** The Shopping Street: Three joined Edo hariko shopfronts with scalloped indigo cloth awnings. */
export function Shopping({ lit }: { lit: boolean }) {
  const c = harikoPalette(lit);

  return (
    <g>
      {/* Hariko toy foot nubs & thick shu-vermilion base border (+3 lip + base) */}
      <ellipse cx="22" cy="79" rx="5.5" ry="2.8" fill={c.sumi} />
      <ellipse cx="98" cy="79" rx="5.5" ry="2.8" fill={c.sumi} />
      <path
        d="M11 73 C11 69 20 68 60 68 C100 68 109 69 109 73 C109 77 100 79 60 79 C20 79 11 77 11 73 Z"
        fill={c.vermilionShade}
      />
      <path
        d="M11 70.5 C11 66.5 20 65.5 60 65.5 C100 65.5 109 66.5 109 70.5 C109 74.5 100 76.5 60 76.5 C20 76.5 11 74.5 11 70.5 Z"
        fill={c.vermilion}
      />

      {/* Three joined gofun-white hariko shopfront walls (+3 shade lip + main wall) */}
      <path
        d="M13 31 C13 26 24 25 60 25 C96 25 107 26 107 31 L106 70 C106 73 96 74 60 74 C24 74 14 73 14 70 Z"
        fill={c.gofunShade}
      />
      <path
        d="M13 28 C13 23 24 22 60 22 C96 22 107 23 107 28 L106 67 C106 70 96 71 60 71 C24 71 14 70 14 67 Z"
        fill={c.gofun}
      />
      {/* Re-affirm vermilion bottom band over wall base */}
      <path
        d="M14 66 Q60 67.8 106 66 L106 69.8 C106 72.5 96 73.8 60 73.8 C24 73.8 14 72.5 14 69.8 Z"
        fill={c.vermilion}
      />

      {/* Subtle vertical division seams between the 3 shopfronts */}
      <line x1="43" y1="26" x2="43" y2="68" stroke={c.gofunShade} strokeWidth="1.6" />
      <line x1="77" y1="26" x2="77" y2="68" stroke={c.gofunShade} strokeWidth="1.6" />

      {/* Upper-floor 4-pane windows in Left and Right bays */}
      {[21.5, 84.5].map((wx) => (
        <g key={wx} transform={`translate(${wx} 29.5)`}>
          <rect x="0" y="1.5" width="14" height="12" rx="2.6" fill={c.vermilionShade} />
          <rect x="0" y="0" width="14" height="12" rx="2.6" fill={c.vermilion} />
          <rect x="2" y="2" width="10" height="8" rx="1.5" fill={c.winFill} />
          <path d="M7 2 V10 M2 6 H12" stroke={c.vermilion} strokeWidth="1.3" />
        </g>
      ))}

      {/* Center bay mid-level vermilion tiled awning & folk crest plaque (no fake text) */}
      <path
        d="M42 34 C42 30 49 29 60 29 C71 29 78 30 78 34 C72 36 48 36 42 34 Z"
        fill={c.vermilionShade}
      />
      <path
        d="M42 32 C42 28 49 27 60 27 C71 27 78 28 78 32 C72 34 48 34 42 32 Z"
        fill={c.vermilion}
      />
      {/* Wooden decorative plaque with gold wave & maru dots */}
      <rect x="46" y="36" width="28" height="7.5" rx="2.2" fill={c.goldShade} />
      <rect x="46" y="34.8" width="28" height="7.5" rx="2.2" fill={c.goldLeaf} />
      <path
        d="M50 38.6 Q55 36.2 60 38.6 T70 38.6"
        fill="none"
        stroke={c.sumi}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="51" cy="38.5" r="1.3" fill={c.vermilion} />
      <circle cx="69" cy="38.5" r="1.3" fill={c.vermilion} />

      {/* Ground floor: Left shopfront display window (hariko toy stand) */}
      <rect x="18" y="49.5" width="21" height="16.5" rx="3" fill={c.vermilionShade} />
      <rect x="18" y="48" width="21" height="16.5" rx="3" fill={c.vermilion} />
      <rect x="20.2" y="50.2" width="16.6" height="12.1" rx="1.8" fill={c.winFill} />
      {/* Tiny hariko daruma/toy silhouette in left shop window */}
      <ellipse cx="28.5" cy="60.2" rx="5.2" ry="1.6" fill={c.goldShade} />
      <circle cx="28.5" cy="56.8" r="3.4" fill={c.vermilion} />
      <circle cx="28.5" cy="55.8" r="1.9" fill={c.gofun} />

      {/* Ground floor: Center shopfront door & gold chrysanthemum crest panel */}
      <rect x="46.5" y="48.5" width="15" height="20" rx="2.5" fill={c.goldShade} />
      <rect x="46.5" y="47" width="15" height="20" rx="2.5" fill={c.gold} />
      <rect x="48.8" y="49.5" width="10.4" height="11" rx="1.6" fill={c.winFill} />
      {/* Radial gold chrysanthemum crest (kiku) on panel beside door */}
      <PlumBlossom x={69} y={56.5} scale={1.35} petalFill={c.goldLeaf} centerFill={c.vermilion} />

      {/* Ground floor: Right shopfront display window (three mochi/dango sweets on red tray) */}
      <rect x="81" y="49.5" width="21" height="16.5" rx="3" fill={c.vermilionShade} />
      <rect x="81" y="48" width="21" height="16.5" rx="3" fill={c.vermilion} />
      <rect x="83.2" y="50.2" width="16.6" height="12.1" rx="1.8" fill={c.winFill} />
      <rect x="85.5" y="59" width="12" height="2.2" rx="1" fill={c.vermilion} />
      <circle cx="88" cy="57.4" r="2" fill={c.gofun} />
      <circle cx="91.5" cy="56.8" r="2" fill="var(--c-petal)" />
      <circle cx="95" cy="57.4" r="2" fill={c.pine} />

      {/* Three scalloped indigo cloth awnings across the three shopfronts */}
      <g className={lit ? 'hariko-shopping-awning' : undefined}>
        {[
          { x1: 15, x2: 42 },
          { x1: 44, x2: 76 },
          { x1: 78, x2: 105 },
        ].map((b, idx) => {
          const w = b.x2 - b.x1;
          const s = w / 3;
          const dShade = `M${b.x1} 45.5 H${b.x2} V49.5 Q${b.x2 - s * 0.5} 53 ${b.x2 - s} 49.5 Q${b.x1 + s * 1.5} 53 ${b.x1 + s} 49.5 Q${b.x1 + s * 0.5} 53 ${b.x1} 49.5 Z`;
          const dMain = `M${b.x1} 43.5 H${b.x2} V47.5 Q${b.x2 - s * 0.5} 51 ${b.x2 - s} 47.5 Q${b.x1 + s * 1.5} 51 ${b.x1 + s} 47.5 Q${b.x1 + s * 0.5} 51 ${b.x1} 47.5 Z`;
          return (
            <g key={idx}>
              <path d={dShade} fill={c.indigoShade} />
              <path d={dMain} fill={c.indigo} />
              <line
                x1={b.x1 + s}
                y1="43.5"
                x2={b.x1 + s}
                y2="48"
                stroke={c.gofun}
                strokeWidth="1.1"
                opacity="0.7"
              />
              <line
                x1={b.x1 + s * 2}
                y1="43.5"
                x2={b.x1 + s * 2}
                y2="48"
                stroke={c.gofun}
                strokeWidth="1.1"
                opacity="0.7"
              />
            </g>
          );
        })}
      </g>

      {/* Bulbous hand-sculpted shu-vermilion roof tiles across the top (+3 lip + base) */}
      <path
        d="M10 27 C10 19 23 16 44 18 C52 16 68 16 76 18 C97 16 110 19 110 27 C102 30 84 29 76 27 C66 29 54 29 44 27 C36 29 18 30 10 27 Z"
        fill={c.vermilionShade}
      />
      <path
        d="M10 24 C10 16 23 13 44 15 C52 13 68 13 76 15 C97 13 110 16 110 24 C102 27 84 26 76 24 C66 26 54 26 44 24 C36 26 18 27 10 24 Z"
        fill={c.vermilion}
      />
      {/* Gold sun/maru spots painted on right roof slope */}
      <MaruCluster x={93} y={20} fill={c.goldLeaf} r={1.4} />
      <circle cx="83" cy="19.5" r="1.8" fill={c.goldLeaf} />

      {/* Center top indigo crest sign (drawn flower emblem instead of text) */}
      <rect x="51" y="10.5" width="18" height="14" rx="3.5" fill={c.indigoShade} />
      <rect x="51" y="8.5" width="18" height="14" rx="3.5" fill={c.indigo} />
      <PlumBlossom x={60} y={15.5} scale={1.15} petalFill={c.goldLeaf} centerFill={c.vermilion} />

      {/* Soft top-left highlight on roof */}
      <ellipse
        cx="28"
        cy="19.5"
        rx="11"
        ry="3"
        transform="rotate(-10 28 19.5)"
        fill={c.highlight}
        opacity="0.4"
      />

      {/* Hanging paper lanterns flanking the center shopfront */}
      <PaperLantern x={43} y={33} lit={lit} />
      <PaperLantern x={77} y={33} lit={lit} />
    </g>
  );
}
