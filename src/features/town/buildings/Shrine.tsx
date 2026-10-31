import { harikoPalette, MaruCluster, PaperLantern, PlumBlossom } from './hariko';

/** The Shrine: Edo hariko folk-toy hokora sanctuary framed by a chunky vermilion & indigo torii. */
export function Shrine({ lit }: { lit: boolean }) {
  const c = harikoPalette(lit);

  return (
    <g>
      {/* Three-tiered stone kidan base under sanctuary (+3 lip + stone steps) */}
      <path
        d="M20 76 C20 72 28 70 60 70 C92 70 100 72 100 76 C100 80 92 82 60 82 C28 82 20 80 20 76 Z"
        fill={c.stoneShade}
      />
      <path
        d="M20 73.5 C20 69.5 28 67.5 60 67.5 C92 67.5 100 69.5 100 73.5 C100 77.5 92 79.5 60 79.5 C28 79.5 20 77.5 20 73.5 Z"
        fill={c.stone}
      />
      <path
        d="M31 68 C31 65 38 64 60 64 C82 64 89 65 89 68 C89 71 82 72 60 72 C38 72 31 71 31 68 Z"
        fill={c.stoneShade}
      />
      <path
        d="M31 66 C31 63 38 62 60 62 C82 62 89 63 89 66 C89 69 82 70 60 70 C38 70 31 69 31 66 Z"
        fill={c.gofunWarm}
      />

      {/* Honden sanctuary behind the torii gate */}
      <g>
        {/* White gofun sanctuary walls with vermilion framing (+3 lip + base) */}
        <path
          d="M35 36 C35 33 42 32 60 32 C78 32 85 33 85 36 L84 65 C84 68 78 69 60 69 C42 69 36 68 36 65 Z"
          fill={c.gofunShade}
        />
        <path
          d="M35 33 C35 30 42 29 60 29 C78 29 85 30 85 33 L84 62 C84 65 78 66 60 66 C42 66 36 65 36 62 Z"
          fill={c.gofun}
        />
        {/* Vermilion corner pillars & wall trim */}
        <rect x="36" y="33" width="5" height="31" rx="2" fill={c.vermilion} />
        <rect x="79" y="33" width="5" height="31" rx="2" fill={c.vermilion} />
        <rect x="36" y="58" width="48" height="6" rx="2" fill={c.vermilion} />

        {/* Glowing golden sanctuary window / inner doors */}
        <rect x="49" y="38" width="22" height="22" rx="3.5" fill={c.goldShade} />
        <rect x="49" y="36.5" width="22" height="22" rx="3.5" fill={c.goldLeaf} />
        <rect x="52" y="39.5" width="16" height="16" rx="2" fill={c.winFill} />
        <line x1="60" y1="39.5" x2="60" y2="55.5" stroke={c.sumi} strokeWidth="1.6" />
        <line x1="52" y1="47.5" x2="68" y2="47.5" stroke={c.goldShade} strokeWidth="1.3" />

        {/* Folk plum blossoms painted on white sanctuary panels */}
        <PlumBlossom x={44.5} y={46} scale={0.8} petalFill={c.vermilion} centerFill={c.goldLeaf} />
        <PlumBlossom x={75.5} y={46} scale={0.8} petalFill={c.vermilion} centerFill={c.goldLeaf} />

        {/* Swept navy-indigo honden roof with vermilion under-eave & gold finial */}
        <path
          d="M26 36 Q60 14 94 36 C91 39 83 39 60 39 C37 39 29 39 26 36 Z"
          fill={c.vermilionShade}
        />
        <path
          d="M26 34 Q60 12 94 34 C91 37 83 37 60 37 C37 37 29 37 26 34 Z"
          fill={c.vermilion}
        />
        <path
          d="M24 33 Q60 9 96 33 C92 36 82 35 60 35 C38 35 28 36 24 33 Z"
          fill={c.indigoShade}
        />
        <path
          d="M24 30.5 Q60 6.5 96 30.5 C92 33.5 82 32.5 60 32.5 C38 32.5 28 33.5 24 30.5 Z"
          fill={c.indigo}
        />
        {/* Roof top knot / giboshi finial */}
        <circle cx="60" cy="15.5" r="4.2" fill={c.sumi} />
        <circle cx="60" cy="14.5" r="2.6" fill={c.goldLeaf} />
        <ellipse
          cx="46"
          cy="22"
          rx="9.5"
          ry="2.8"
          transform="rotate(-22 46 22)"
          fill={c.highlight}
          opacity="0.38"
        />
      </g>

      {/* Flanking hariko lanterns (tōrō) on left and right */}
      {[15, 105].map((lx) => (
        <g key={lx} transform={`translate(${lx} 0)`}>
          {/* Indigo boulder base */}
          <ellipse cx="0" cy="75.5" rx="6.2" ry="3.4" fill={c.indigoShade} />
          <ellipse cx="0" cy="73.8" rx="6.2" ry="3.4" fill={c.indigo} />
          {/* Vermilion post */}
          <rect x="-2.6" y="56" width="5.2" height="18" rx="2.2" fill={c.vermilionShade} />
          <rect x="-2.6" y="54.5" width="5.2" height="18" rx="2.2" fill={c.vermilion} />
          {/* Glowing firebox chamber */}
          <rect x="-4" y="48.5" width="8" height="7" rx="2" fill={c.goldShade} />
          <rect x="-3" y="49.5" width="6" height="5" rx="1.4" fill={c.winFill} />
          {/* Indigo umbrella cap & golden giboshi orb */}
          <path d="M-7.5 50 Q0 42 7.5 50 Z" fill={c.indigoShade} />
          <path d="M-7.5 48.2 Q0 40.2 7.5 48.2 Z" fill={c.indigo} />
          <circle cx="0" cy="43.2" r="2" fill={c.goldLeaf} />
        </g>
      ))}

      {/* Large foreground hariko Torii gate framing the shrine */}
      <g>
        {/* Heavy boulder-like indigo pillar bases (kamebara) */}
        <ellipse cx="29" cy="76.5" rx="7.8" ry="4.2" fill={c.indigoShade} />
        <ellipse cx="29" cy="74.2" rx="7.8" ry="4.2" fill={c.indigo} />
        <ellipse cx="91" cy="76.5" rx="7.8" ry="4.2" fill={c.indigoShade} />
        <ellipse cx="91" cy="74.2" rx="7.8" ry="4.2" fill={c.indigo} />

        {/* Thick hand-molded vermilion pillars (hashira) */}
        <path
          d="M25.5 28 C25.5 26 33.5 26 33.5 28 L34.5 74 C34.5 76 24.5 76 24.5 74 Z"
          fill={c.vermilionShade}
        />
        <path
          d="M25.5 26 C25.5 24 33.5 24 33.5 26 L34.2 72.5 C34.2 74.5 24.8 74.5 24.8 72.5 Z"
          fill={c.vermilion}
        />
        <path
          d="M86.5 28 C86.5 26 94.5 26 94.5 28 L95.5 74 C95.5 76 85.5 76 85.5 74 Z"
          fill={c.vermilionShade}
        />
        <path
          d="M86.5 26 C86.5 24 94.5 24 94.5 26 L95.2 72.5 C95.2 74.5 85.8 74.5 85.8 72.5 Z"
          fill={c.vermilion}
        />
        {/* Maru gold dots painted on pillars */}
        <MaruCluster x={29.5} y={62} fill={c.goldLeaf} r={1.15} />
        <MaruCluster x={90.5} y={62} fill={c.goldLeaf} r={1.15} />

        {/* Secondary red crossbeam (nuki) */}
        <path
          d="M19 36.5 C19 34 25 33.5 60 33.5 C95 33.5 101 34 101 36.5 C101 39 95 39.5 60 39.5 C25 39.5 19 39 19 36.5 Z"
          fill={c.vermilionShade}
        />
        <path
          d="M19 34.5 C19 32 25 31.5 60 31.5 C95 31.5 101 32 101 34.5 C101 37 95 37.5 60 37.5 C25 37.5 19 37 19 34.5 Z"
          fill={c.vermilion}
        />

        {/* Swaying suzu bell & shide paper zigzags under nuki beam */}
        <g className={lit ? 'hariko-shrine-rope' : undefined}>
          <path d="M51 36.5 L49 42 L52 42 L50 47" stroke={c.gofun} strokeWidth="2" fill="none" />
          <path d="M69 36.5 L71 42 L68 42 L70 47" stroke={c.gofun} strokeWidth="2" fill="none" />
          <circle cx="60" cy="40.5" r="3.6" fill={c.goldShade} />
          <circle cx="60" cy="39.5" r="3.6" fill={c.goldLeaf} />
          <circle cx="60" cy="41" r="1.1" fill={c.sumi} />
        </g>

        {/* Curved top lintel: vermilion sub-beam + deep indigo kasagi cap */}
        <path
          d="M13 26.5 Q60 31 107 26.5 C106 31 96 32.5 60 32.5 C24 32.5 14 31 13 26.5 Z"
          fill={c.vermilionShade}
        />
        <path
          d="M13 24.5 Q60 29 107 24.5 C106 29 96 30.5 60 30.5 C24 30.5 14 29 13 24.5 Z"
          fill={c.vermilion}
        />
        <path
          d="M11 22.5 Q60 27.5 109 22.5 C108 27.5 96 29 60 29 C24 29 12 27.5 11 22.5 Z"
          fill={c.indigoShade}
        />
        <path
          d="M11 20 Q60 25 109 20 C108 25 96 26.5 60 26.5 C24 26.5 12 25 11 20 Z"
          fill={c.indigo}
        />

        {/* Center gakuzuka plaque with gold trim & vertical emblem */}
        <rect x="55" y="24.5" width="10" height="11" rx="2.2" fill={c.goldLeaf} />
        <rect x="56.5" y="26" width="7" height="8" rx="1.4" fill={c.sumi} />
        <rect x="59" y="27.5" width="2" height="5" rx="1" fill={c.goldLeaf} />

        {/* Soft top-left highlight on torii kasagi */}
        <ellipse
          cx="31"
          cy="23"
          rx="11"
          ry="2.5"
          transform="rotate(-6 31 23)"
          fill={c.highlight}
          opacity="0.4"
        />
      </g>

      {/* Hanging paper lanterns under torii crossbeam */}
      <PaperLantern x={40} y={37} lit={lit} />
      <PaperLantern x={80} y={37} lit={lit} />
    </g>
  );
}
