import { harikoPalette, MaruCluster, PaperLantern, PlumBlossom } from './hariko';

/** The Bathhouse: Edo hariko sentō with karahafu roof, noren, and clay-doll chimney & motifs. */
export function Bathhouse({ lit }: { lit: boolean }) {
  const c = harikoPalette(lit);

  return (
    <g>
      {/* Rising steam puffs from the tall red-capped chimney */}
      {lit && (
        <g>
          <circle
            cx="93"
            cy="6"
            r="3.8"
            fill={c.highlight}
            opacity="0.72"
            className="hariko-bathhouse-steam-1"
          />
          <circle
            cx="97"
            cy="3"
            r="4.6"
            fill={c.highlight}
            opacity="0.56"
            className="hariko-bathhouse-steam-2"
          />
        </g>
      )}

      {/* Tall cylindrical gofun-white hariko chimney with vermilion mushroom cap */}
      <g>
        <path
          d="M87 14 C87 12 99 12 99 14 L100 72 C100 75 86 75 86 72 Z"
          fill={c.gofunShade}
        />
        <path
          d="M87 12 C87 10 99 10 99 12 L100 69 C100 72 86 72 86 69 Z"
          fill={c.gofun}
        />
        {/* Hand-painted indigo splash & vertical row of sumi dots on chimney shaft */}
        <path
          d="M87.5 34 C91 32 96 33 98.5 36 C96 39 91 39 87.5 37 Z"
          fill={c.indigo}
        />
        {[18, 22.5, 27, 31.5].map((cy) => (
          <circle key={cy} cx="93" cy={cy} r="1.2" fill={c.sumi} />
        ))}
        {/* Mushroom-like vermilion chimney cap (+3 lip + cap) */}
        <ellipse cx="93" cy="12.8" rx="8.2" ry="3.2" fill={c.vermilionShade} />
        <ellipse cx="93" cy="10.8" rx="8.2" ry="3.2" fill={c.vermilion} />
        <ellipse
          cx="90.5"
          cy="9.8"
          rx="3.4"
          ry="1.2"
          transform="rotate(-12 90.5 9.8)"
          fill={c.highlight}
          opacity="0.4"
        />
      </g>

      {/* Rounded stone & indigo foundation base (+3 lip + base) */}
      <path
        d="M12 75 C12 71 21 69 56 69 C91 69 102 71 102 75 C102 79 91 81 56 81 C21 81 12 79 12 75 Z"
        fill={c.indigoShade}
      />
      <path
        d="M12 72.5 C12 68.5 21 66.5 56 66.5 C91 66.5 102 68.5 102 72.5 C102 76.5 91 78.5 56 78.5 C21 78.5 12 76.5 12 72.5 Z"
        fill={c.indigo}
      />

      {/* Plump hand-molded gofun-white sentō bathhouse body (+3 shade lip + main wall) */}
      <path
        d="M16 39 C15 33 27 31 53 31 C79 31 90 33 89 39 L88 71 C88 75 78 76 53 76 C28 76 17 75 17 71 Z"
        fill={c.gofunShade}
      />
      <path
        d="M16 36 C15 30 27 28 53 28 C79 28 90 30 89 36 L88 68 C88 72 78 73 53 73 C28 73 17 72 17 68 Z"
        fill={c.gofun}
      />

      {/* Painted vermilion rope belt with gold & sumi studs across mid-wall */}
      <path
        d="M16.5 44.5 Q53 47 88.5 44.5"
        fill="none"
        stroke={c.vermilion}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {[24, 34, 72, 82].map((sx) => (
        <circle key={sx} cx={sx} cy="45.2" r="1.2" fill={c.goldLeaf} />
      ))}

      {/* Left & right glowing bathhouse transom windows */}
      {[21, 71].map((wx) => (
        <g key={wx} transform={`translate(${wx} 34.5)`}>
          <rect x="0" y="1.2" width="13" height="8.5" rx="2.5" fill={c.indigoShade} />
          <rect x="0" y="0" width="13" height="8.5" rx="2.5" fill={c.indigo} />
          <rect x="1.8" y="1.6" width="9.4" height="5.3" rx="1.4" fill={c.winFill} />
          <line x1="6.5" y1="1.6" x2="6.5" y2="6.9" stroke={c.indigo} strokeWidth="1.2" />
        </g>
      ))}

      {/* Clay-doll inspired folk floral circles, indigo splashes & gold droplets on walls */}
      <g>
        {/* Left wall vermilion flower circle with white & gold dots */}
        <circle cx="27" cy="58" r="6.2" fill={c.vermilionShade} />
        <circle cx="27" cy="56.8" r="6.2" fill={c.vermilion} />
        <PlumBlossom x={27} y={56.8} scale={0.95} petalFill={c.gofun} centerFill={c.goldLeaf} />
        <circle cx="20" cy="64" r="2" fill={c.goldLeaf} />
        <circle cx="34" cy="64.5" r="1.6" fill={c.indigo} />

        {/* Right wall indigo folk patch with white dots & gold flower */}
        <ellipse cx="78" cy="57.5" rx="6.5" ry="5.2" fill={c.indigoShade} />
        <ellipse cx="78" cy="56.2" rx="6.5" ry="5.2" fill={c.indigo} />
        <MaruCluster x={78} y={56.2} fill={c.gofun} r={1.25} />
        <PlumBlossom x={77} y={65} scale={0.85} petalFill={c.goldLeaf} centerFill={c.vermilion} />
      </g>

      {/* Arched dark sentō doorway & warm interior glow at bottom center */}
      <path
        d="M39 72 V51 C39 45 67 45 67 51 V72 Z"
        fill={c.sumi}
      />
      <path
        d="M42 72 V53 C42 48 64 48 64 53 V72 Z"
        fill={c.winFill}
        opacity={lit ? 0.88 : 0.45}
      />

      {/* Scalloped two-panel vermilion & indigo noren curtain with onsen ♨ mark */}
      <g>
        <path
          d="M37 46 H69 V61 C69 64 62 64.5 53.5 61.5 L53 56 L52.5 61.5 C44 64.5 37 64 37 61 Z"
          fill={c.vermilionShade}
        />
        <path
          d="M37 44 H69 V59 C69 62 62 62.5 53.5 59.5 L53 54 L52.5 59.5 C44 62.5 37 62 37 59 Z"
          fill={c.vermilion}
        />
        {/* White & gold folk dots along top of noren */}
        <circle cx="42" cy="47.5" r="1.2" fill={c.goldLeaf} />
        <circle cx="64" cy="47.5" r="1.2" fill={c.goldLeaf} />
        {/* Drawn onsen ♨ symbol in gofun white */}
        <ellipse
          cx="53"
          cy="55"
          rx="5.2"
          ry="3.2"
          fill="none"
          stroke={c.gofun}
          strokeWidth="1.7"
        />
        <path
          d="M49.5 52.5 Q50.3 49.5 49.5 47.5 M53 52 Q53.8 49 53 47 M56.5 52.5 Q57.3 49.5 56.5 47.5"
          fill="none"
          stroke={c.gofun}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Sweeping karahafu curved gable roof in deep indigo & gold ridge (+3 lip + base) */}
      <path
        d="M9 39 Q53 8 95 39 C91 42 81 41 53 35 C25 41 13 42 9 39 Z"
        fill={c.indigoShade}
      />
      <path
        d="M9 36 Q53 5 95 36 C91 39 81 38 53 32 C25 38 13 39 9 36 Z"
        fill={c.indigo}
      />
      {/* Gold-leaf bargeboard ornament under karahafu peak */}
      <path d="M44 29 Q53 21 62 29 Q53 27 44 29 Z" fill={c.goldLeaf} />
      <circle cx="53" cy="25.5" r="2.2" fill={c.vermilion} />

      {/* Soft top-left highlight on karahafu roof */}
      <ellipse
        cx="35"
        cy="24"
        rx="11.5"
        ry="3.4"
        transform="rotate(-21 35 24)"
        fill={c.highlight}
        opacity="0.4"
      />

      {/* Hanging paper lanterns */}
      <PaperLantern x={18} y={37} lit={lit} />
      <PaperLantern x={86} y={37} lit={lit} />
    </g>
  );
}
