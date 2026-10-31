import { harikoPalette, MaruCluster, PaperLantern, PlumBlossom } from './hariko';

/** The Station: Edo hariko folk-toy rural station house and chunky toy steam locomotive. */
export function Station({ lit }: { lit: boolean }) {
  const c = harikoPalette(lit);

  return (
    <g>
      {/* Hand-molded stone platform base (+3 shade lip + base) */}
      <path
        d="M9 76 C9 72 15 70 60 70 C105 70 111 72 111 76 C111 81 104 83 60 83 C16 83 9 81 9 76 Z"
        fill={c.stoneShade}
      />
      <path
        d="M9 73 C9 69 15 67 60 67 C105 67 111 69 111 73 C111 78 104 80 60 80 C16 80 9 78 9 73 Z"
        fill={c.stone}
      />
      {/* Chunky railway sleepers & rail under the toy train */}
      {[70, 80, 90, 100].map((sx) => (
        <rect key={sx} x={sx} y="73.5" width="5.5" height="3.2" rx="1.4" fill={c.goldShade} />
      ))}
      <path d="M66 73.2 Q88 73.8 109 73" stroke={c.sumi} strokeWidth="2" strokeLinecap="round" />

      {/* Rising steam puffs from locomotive funnel */}
      {lit && (
        <g>
          <circle
            cx="97"
            cy="27"
            r="4.2"
            fill={c.highlight}
            opacity="0.72"
            className="hariko-station-steam-1"
          />
          <circle
            cx="93"
            cy="21"
            r="5.4"
            fill={c.highlight}
            opacity="0.58"
            className="hariko-station-steam-2"
          />
        </g>
      )}

      {/* Hariko toy steam locomotive on right */}
      <g>
        {/* Smokestack funnel (+3 shade lip + indigo shaft + vermilion cap) */}
        <path d="M93.5 34 C93.5 32 100.5 32 100.5 34 L101.5 47 L92.5 47 Z" fill={c.indigoShade} />
        <path d="M93.5 32 C93.5 30 100.5 30 100.5 32 L101.5 45 L92.5 45 Z" fill={c.indigo} />
        <ellipse cx="97" cy="32.5" rx="4.8" ry="2.3" fill={c.vermilionShade} />
        <ellipse cx="97" cy="31" rx="4.8" ry="2.3" fill={c.vermilion} />

        {/* Cab & boiler body (+3 shade lip + main molded shape) */}
        <path
          d="M66 44 C66 39 70 37 78 37 C85 37 87 39 87 44 L103 44 C107 44 109 48 109 57 C109 66 106 69 101 69 L68 69 C66 69 65 66 66 57 Z"
          fill={c.indigoShade}
        />
        <path
          d="M66 41 C66 36 70 34 78 34 C85 34 87 36 87 41 L103 41 C107 41 109 45 109 54 C109 63 106 66 101 66 L68 66 C66 66 65 63 66 54 Z"
          fill={c.indigo}
        />
        {/* Cab vermilion roof cap */}
        <path
          d="M64 38 C64 34 71 33 77 33 C84 33 89 34 89 38 C83 39 70 39 64 38 Z"
          fill={c.vermilionShade}
        />
        <path
          d="M64 36 C64 32 71 31 77 31 C84 31 89 32 89 36 C83 37 70 37 64 36 Z"
          fill={c.vermilion}
        />

        {/* Vermilion front boiler drum & cowcatcher */}
        <path
          d="M88 46 C88 42 93 41 101 41 C107 41 109 45 109 54 C109 62 106 66 100 66 L88 66 Z"
          fill={c.vermilionShade}
        />
        <path
          d="M88 43 C88 39 93 38 101 38 C107 38 109 42 109 51 C109 59 106 63 100 63 L88 63 Z"
          fill={c.vermilion}
        />
        {/* Painted gold band & folk heart/crest on boiler front */}
        <rect x="87" y="42" width="3" height="21" rx="1.4" fill={c.goldLeaf} />
        <circle cx="101" cy="52" r="5" fill={c.goldShade} />
        <circle cx="101" cy="50.5" r="5" fill={c.goldLeaf} />
        <circle cx="101" cy="50.5" r="2.2" fill={c.vermilion} />
        {/* Cowcatcher wedge */}
        <path d="M104 61 L112 68 L103 68 Z" fill={c.vermilionShade} />
        <path d="M104 59 L112 66 L103 66 Z" fill={c.vermilion} />

        {/* Cab glowing window */}
        <rect x="70" y="42" width="12" height="10" rx="3" fill={c.sumi} />
        <rect x="71.4" y="43.4" width="9.2" height="7.2" rx="2" fill={c.winFill} />
        {/* Hand-painted maru dots on cab side */}
        <MaruCluster x={76} y={59} fill={c.gofun} r={1.2} />

        {/* Toy locomotive wheels */}
        <circle cx="75" cy="68" r="5.2" fill={c.sumi} />
        <circle cx="75" cy="68" r="2.1" fill={c.goldLeaf} />
        <circle cx="94" cy="68" r="5.2" fill={c.sumi} />
        <circle cx="94" cy="68" r="2.1" fill={c.goldLeaf} />
      </g>

      {/* Station house: chunky hand-molded gofun white walls (+3 shade lip + base) */}
      <path
        d="M16 39 C15 35 24 33 43 33 C62 33 70 35 69 39 L70 68 C70 72 64 74 43 74 C22 74 15 72 15 68 Z"
        fill={c.gofunShade}
      />
      <path
        d="M16 36 C15 32 24 30 43 30 C62 30 70 32 69 36 L70 65 C70 69 64 71 43 71 C22 71 15 69 15 65 Z"
        fill={c.gofun}
      />

      {/* Indigo & gold painted folk band along lower station wall */}
      <path
        d="M15.5 63 Q43 65 69.5 63 L69.8 67.5 C69.8 70 63 71 43 71 C23 71 15.2 70 15.2 67.5 Z"
        fill={c.indigo}
      />
      <path
        d="M16 62.5 Q43 64.5 69 62.5"
        stroke={c.goldLeaf}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Hand-painted folk motifs on gofun walls */}
      <PlumBlossom x={24} y={45} scale={0.95} petalFill={c.vermilion} centerFill={c.goldLeaf} />
      <PlumBlossom x={61} y={45} scale={0.95} petalFill={c.vermilion} centerFill={c.goldLeaf} />
      <MaruCluster x={23} y={56} fill={c.indigo} r={1.25} />
      <MaruCluster x={62} y={56} fill={c.indigo} r={1.25} />

      {/* Entrance golden-wood post frame & vermilion double door */}
      <rect x="33" y="47" width="20" height="24" rx="3.5" fill={c.goldShade} />
      <rect x="33" y="45" width="20" height="24" rx="3.5" fill={c.goldLeaf} />
      <rect x="35.5" y="47.5" width="15" height="21.5" rx="2.5" fill={c.vermilionShade} />
      <rect x="35.5" y="46.5" width="15" height="20.5" rx="2.5" fill={c.vermilion} />
      {/* Double door center seam, small glowing transoms & gold handles */}
      <line x1="43" y1="47" x2="43" y2="67" stroke={c.sumi} strokeWidth="1.3" />
      <rect x="37.5" y="49" width="4" height="4.5" rx="1" fill={c.winFill} />
      <rect x="44.5" y="49" width="4" height="4.5" rx="1" fill={c.winFill} />
      <circle cx="41" cy="58" r="1.1" fill={c.goldLeaf} />
      <circle cx="45" cy="58" r="1.1" fill={c.goldLeaf} />

      {/* Chunky vermilion entrance overhang awning (+3 lip + base) */}
      <path
        d="M29 47 C29 43 35 42 43 42 C51 42 57 43 57 47 C51 48.5 35 48.5 29 47 Z"
        fill={c.vermilionShade}
      />
      <path
        d="M29 45 C29 41 35 40 43 40 C51 40 57 41 57 45 C51 46.5 35 46.5 29 45 Z"
        fill={c.vermilion}
      />

      {/* Sculpted shu-vermilion gabled roof (+3 shade lip + base) */}
      <path
        d="M9 40 C8 37 26 20 43 15 C60 20 78 37 77 40 C75 43 68 43 62 39 L43 25 L24 39 C18 43 11 43 9 40 Z"
        fill={c.vermilionShade}
      />
      <path
        d="M9 37 C8 34 26 17 43 12 C60 17 78 34 77 37 C75 40 68 40 62 36 L43 22 L24 36 C18 40 11 40 9 37 Z"
        fill={c.vermilion}
      />
      {/* Gable fill under roof peak */}
      <path d="M21 37 L43 21 L65 37 Z" fill={c.gofun} />

      {/* Upper gable 4-pane window with vermilion frame */}
      <rect x="37.5" y="26.5" width="11" height="10" rx="2.5" fill={c.vermilionShade} />
      <rect x="37.5" y="25.5" width="11" height="10" rx="2.5" fill={c.vermilion} />
      <rect x="39.3" y="27.3" width="7.4" height="6.4" rx="1.4" fill={c.winFill} />
      <path
        d="M43 27.3 V33.7 M39.3 30.5 H46.7"
        stroke={c.vermilion}
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Soft top-left highlight on roof & locomotive */}
      <ellipse
        cx="30"
        cy="24"
        rx="10.5"
        ry="3.2"
        transform="rotate(-28 30 24)"
        fill={c.highlight}
        opacity="0.4"
      />
      <ellipse
        cx="95"
        cy="43"
        rx="6"
        ry="2"
        transform="rotate(-14 95 43)"
        fill={c.highlight}
        opacity="0.38"
      />

      {/* Vintage black hariko lamp post on left of station door */}
      <rect x="18" y="49" width="2.8" height="22" rx="1.4" fill={c.sumi} />
      <rect x="16" y="69" width="6.8" height="3" rx="1.5" fill={c.sumi} />
      <circle cx="19.4" cy="47" r="4.2" fill={c.sumi} />
      <circle cx="19.4" cy="46.5" r="3" fill={lit ? 'var(--c-glow)' : c.gofun} />

      {/* Hanging paper lanterns */}
      <PaperLantern x={28} y={39} lit={lit} />
      <PaperLantern x={58} y={39} lit={lit} />
    </g>
  );
}
