import { harikoPalette, MaruCluster, PaperLantern, PlumBlossom } from './hariko';

/** The Café (Teahouse): Edo hariko folk-toy teahouse with indigo noren, gourd crest and bench. */
export function Cafe({ lit }: { lit: boolean }) {
  const c = harikoPalette(lit);

  return (
    <g>
      {/* Rounded dark wooden platform base (+3 shade lip + base) */}
      <path
        d="M14 75 C14 71 23 69 60 69 C97 69 106 71 106 75 C106 80 96 82 60 82 C24 82 14 80 14 75 Z"
        fill={c.sumi}
      />
      <path
        d="M14 72.5 C14 68.5 23 66.5 60 66.5 C97 66.5 106 68.5 106 72.5 C106 77.5 96 79.5 60 79.5 C24 79.5 14 77.5 14 72.5 Z"
        fill={c.goldShade}
      />

      {/* Stout rounded hariko body in matte gofun white (+3 shade lip + main form) */}
      <path
        d="M19 42 C18 35 28 33 60 33 C92 33 102 35 101 42 L100 69 C100 74 90 76 60 76 C30 76 20 74 20 69 Z"
        fill={c.gofunShade}
      />
      <path
        d="M19 39 C18 32 28 30 60 30 C92 30 102 32 101 39 L100 66 C100 71 90 73 60 73 C30 73 20 71 20 66 Z"
        fill={c.gofun}
      />

      {/* Hand-painted thick vermilion band wrapping the lower wall */}
      <path
        d="M19.8 60 Q60 62.5 100.2 60 L100 66.5 C100 71 90 73 60 73 C30 73 20 71 20 66.5 Z"
        fill={c.vermilionShade}
      />
      <path
        d="M19.8 58 Q60 60.5 100.2 58 L100 64.5 C100 69 90 71 60 71 C30 71 20 69 20 64.5 Z"
        fill={c.vermilion}
      />

      {/* Left round shoji window & gold-leaf medallion on right wall */}
      <circle cx="33" cy="50" r="8" fill={c.goldShade} />
      <circle cx="33" cy="48.5" r="8" fill={c.vermilion} />
      <circle cx="33" cy="48.5" r="6" fill={c.winFill} />
      <path
        d="M30 43.2 V53.8 M36 43.2 V53.8 M27.5 48.5 H38.5"
        stroke={c.goldShade}
        strokeWidth="1.2"
      />
      {/* Gold-leaf gourd & plum folk motif on right wall */}
      <circle cx="90" cy="47" r="3.4" fill={c.goldShade} />
      <circle cx="90" cy="45.8" r="3.4" fill={c.goldLeaf} />
      <circle cx="90" cy="51.8" r="4.6" fill={c.goldShade} />
      <circle cx="90" cy="50.5" r="4.6" fill={c.goldLeaf} />
      <PlumBlossom x={90} y={50.5} scale={0.75} petalFill={c.vermilion} centerFill={c.gofun} />

      {/* Entrance timber frame & warm glowing teahouse interior */}
      <rect x="46" y="40" width="34" height="30" rx="4" fill={c.goldShade} />
      <rect x="46" y="38" width="34" height="30" rx="4" fill={c.gold} />
      <rect x="49.5" y="41" width="27" height="26" rx="2.5" fill={c.winFill} />
      {/* Interior tatami / wood floor sill */}
      <rect x="48.5" y="63" width="29" height="4.5" rx="2" fill={c.goldLeaf} />

      {/* Split deep-indigo noren curtain with gold & vermilion leaf motifs */}
      <g className={lit ? 'hariko-cafe-noren' : undefined}>
        {/* Left noren panel (+3 lip + indigo cloth) */}
        <path
          d="M49 41 H62 V57 C62 59 59 59.5 55.5 59.5 C52 59.5 49 59 49 57 Z"
          fill={c.indigoShade}
        />
        <path
          d="M49 39.5 H62 V55 C62 57 59 57.5 55.5 57.5 C52 57.5 49 57 49 55 Z"
          fill={c.indigo}
        />
        {/* Right noren panel (+3 lip + indigo cloth) */}
        <path
          d="M64 41 H77 V57 C77 59 74 59.5 70.5 59.5 C67 59.5 64 59 64 57 Z"
          fill={c.indigoShade}
        />
        <path
          d="M64 39.5 H77 V55 C77 57 74 57.5 70.5 57.5 C67 57.5 64 57 64 55 Z"
          fill={c.indigo}
        />
        {/* Scattered gold & vermilion folk leaves/blossoms on noren */}
        <PlumBlossom
          x={55.5}
          y={47.5}
          scale={0.85}
          petalFill={c.goldLeaf}
          centerFill={c.vermilion}
        />
        <PlumBlossom
          x={70.5}
          y={47.5}
          scale={0.85}
          petalFill={c.goldLeaf}
          centerFill={c.vermilion}
        />
        <MaruCluster x={55.5} y={53.5} fill={c.gofun} r={1} />
        <MaruCluster x={70.5} y={53.5} fill={c.gofun} r={1} />
      </g>

      {/* Thick rounded overhanging shu-vermilion hariko roof cap (+3 lip + base) */}
      <path
        d="M12 36 C11 24 27 18 60 18 C93 18 109 24 108 36 C107 42 94 44 60 44 C26 44 13 42 12 36 Z"
        fill={c.vermilionShade}
      />
      <path
        d="M12 33 C11 21 27 15 60 15 C93 15 109 21 108 33 C107 39 94 41 60 41 C26 41 13 39 12 33 Z"
        fill={c.vermilion}
      />

      {/* Embossed kinpaku gold-leaf gourd (hyōtan) & scattered foil flecks on roof */}
      <g>
        <ellipse cx="60" cy="24.5" rx="6.5" ry="4.2" fill={c.goldShade} />
        <ellipse cx="60" cy="23" rx="6.5" ry="4.2" fill={c.goldLeaf} />
        <ellipse cx="60" cy="31.5" rx="9.5" ry="5.5" fill={c.goldShade} />
        <ellipse cx="60" cy="30" rx="9.5" ry="5.5" fill={c.goldLeaf} />
        <ellipse cx="57" cy="28.5" rx="3.2" ry="1.6" fill={c.winShine} opacity="0.65" />
        {/* Scattered gold-leaf flecks along roof edges */}
        <circle cx="31" cy="29" r="2.1" fill={c.goldLeaf} />
        <circle cx="37" cy="33" r="1.5" fill={c.goldLeaf} />
        <circle cx="84" cy="27" r="2.2" fill={c.goldLeaf} />
        <circle cx="90" cy="32" r="1.6" fill={c.goldLeaf} />
        <circle cx="78" cy="34" r="1.4" fill={c.goldLeaf} />
      </g>

      {/* Soft top-left highlight on rounded roof */}
      <ellipse
        cx="35"
        cy="24"
        rx="12.5"
        ry="3.8"
        transform="rotate(-14 35 24)"
        fill={c.highlight}
        opacity="0.4"
      />

      {/* Dark ceramic tea jar / water pot on left of porch */}
      <ellipse cx="36" cy="71" rx="5.6" ry="5.2" fill={c.sumi} />
      <ellipse cx="36" cy="66.5" rx="4.2" ry="1.8" fill={c.stoneShade} />
      <ellipse
        cx="34.2"
        cy="69.2"
        rx="1.8"
        ry="1.1"
        transform="rotate(-18 34.2 69.2)"
        fill={c.highlight}
        opacity="0.38"
      />

      {/* Light-wood outdoor bench in front of entrance (+3 lip + top plank) */}
      <rect x="49" y="70" width="4.2" height="6.5" rx="1.5" fill={c.sumi} />
      <rect x="75" y="70" width="4.2" height="6.5" rx="1.5" fill={c.sumi} />
      <path
        d="M45 69.5 C45 67.5 51 67 64 67 C77 67 83 67.5 83 69.5 C83 71.5 77 72 64 72 C51 72 45 71.5 45 69.5 Z"
        fill={c.goldShade}
      />
      <path
        d="M45 67.5 C45 65.5 51 65 64 65 C77 65 83 65.5 83 67.5 C83 69.5 77 70 64 70 C51 70 45 69.5 45 67.5 Z"
        fill={c.goldLeaf}
      />

      {/* Hanging paper lanterns */}
      <PaperLantern x={22} y={38} lit={lit} />
      <PaperLantern x={98} y={38} lit={lit} />
    </g>
  );
}
