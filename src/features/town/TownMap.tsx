import type { JSX } from 'react';
import './town-map.css';
import { BuildingArt } from './buildings/BuildingArt';

export interface TownMapSpot {
  id: string; // district id: station | cafe | shrine | shopping | bathhouse | school
  en: string; // English name, e.g. "The Station"
  restored: boolean; // open for business
  lit: boolean; // lanterns lit (the player kept their streak)
  pending: number; // yen waiting to be collected (0 = none)
}

const LOT_COORDS: Record<string, { x: number; y: number }> = {
  school: { x: 25, y: 21 },
  shrine: { x: 74, y: 18 },
  cafe: { x: 27, y: 50 },
  bathhouse: { x: 75, y: 47 },
  station: { x: 26, y: 80 },
  shopping: { x: 74, y: 78 },
};

const FALLBACK_COORDS = [
  { x: 25, y: 21 },
  { x: 74, y: 18 },
  { x: 27, y: 50 },
  { x: 75, y: 47 },
  { x: 26, y: 80 },
  { x: 74, y: 78 },
];

const yenFmt = (n: number) => `¥${Math.floor(n).toLocaleString('en-US')}`;

function ChibiWalker({ robe, hair }: { robe: string; hair: string }) {
  return (
    <g>
      <ellipse cx="0" cy="11" rx="6.5" ry="2.6" fill="var(--c-shadow)" />
      <path d="M-5 3 C-6 9 6 9 5 3 Z" fill={`color-mix(in srgb, ${robe} 64%, var(--c-hud-bg))`} />
      <path d="M-5 1 C-6 7 6 7 5 1 C4 -2 -4 -2 -5 1 Z" fill={robe} />
      <circle cx="0" cy="-4.5" r="5.5" fill="color-mix(in srgb, #f1d3b6 72%, var(--c-hud-bg))" />
      <circle cx="0" cy="-6" r="5.5" fill="#f1d3b6" />
      <path d="M-5.5 -6.5 C-5.5 -13 5.5 -13 5.5 -6.5 C3 -9 -3 -9 -5.5 -6.5 Z" fill={hair} />
      <circle cx="-2" cy="-5.2" r="0.9" fill="var(--c-hud-bg)" />
      <circle cx="2" cy="-5.2" r="0.9" fill="var(--c-hud-bg)" />
      <ellipse
        cx="-2"
        cy="-9.2"
        rx="2.2"
        ry="1"
        transform="rotate(-15 -2 -9.2)"
        fill="var(--c-hud-ink)"
        opacity="0.4"
      />
    </g>
  );
}

/** Fenced construction lot under a tarp with scaffolding and a chunky padlock when !restored. */
function LockedLot() {
  const woodShade = 'color-mix(in srgb, var(--c-gold) 58%, var(--c-hud-bg))';
  const tarpShade = 'color-mix(in srgb, var(--c-fog) 62%, var(--c-hud-bg))';
  const tarpBase = 'color-mix(in srgb, var(--c-surface-alt) 55%, var(--c-fog))';
  return (
    <svg viewBox="0 0 120 96" className="town-spot-art" aria-hidden="true">
      <ellipse cx="60" cy="80" rx="46" ry="11" fill="var(--c-shadow)" />
      {/* Bamboo scaffolding poles behind tarp */}
      <rect x="24" y="24" width="4" height="52" rx="2" fill={woodShade} />
      <rect x="92" y="24" width="4" height="52" rx="2" fill={woodShade} />
      <rect x="18" y="34" width="84" height="3.5" rx="1.7" fill="var(--c-panel-edge)" />
      {/* Draped cloth cover (+3 lip + base + highlight) */}
      <path
        d="M26 75 C24 50 34 31 60 31 C86 31 96 50 94 75 C82 79 38 79 26 75 Z"
        fill={tarpShade}
      />
      <path d="M26 72 C24 47 34 28 60 28 C86 28 96 47 94 72 C82 76 38 76 26 72 Z" fill={tarpBase} />
      <path
        d="M34 52 Q60 60 86 52"
        fill="none"
        stroke={tarpShade}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="46"
        cy="40"
        rx="11"
        ry="4.2"
        transform="rotate(-16 46 40)"
        fill="var(--c-hud-ink)"
        opacity="0.38"
      />
      {/* Wooden picket fence across front */}
      {[22, 36, 50, 64, 78, 92].map((x) => (
        <g key={x}>
          <rect x={x} y="59" width="6" height="20" rx="2" fill={woodShade} />
          <rect x={x} y="56" width="6" height="20" rx="2" fill="var(--c-panel-edge)" />
        </g>
      ))}
      <rect x="18" y="63" width="84" height="4" rx="2" fill={woodShade} />
      <rect x="18" y="61" width="84" height="4" rx="2" fill="var(--c-gold-soft)" />
      {/* Chunky padlock emblem */}
      <path
        d="M53 46 V39 C53 33.5 67 33.5 67 39 V46"
        fill="none"
        stroke="var(--c-hud-bg)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M53 45 V39 C53 33.5 67 33.5 67 39 V45"
        fill="none"
        stroke="var(--c-coin-shine)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="48" y="47" width="24" height="20" rx="6" fill={woodShade} />
      <rect x="48" y="44" width="24" height="20" rx="6" fill="var(--c-glow)" />
      <circle cx="60" cy="52.5" r="2.6" fill="var(--c-hud-bg)" />
      <rect x="58.7" y="53" width="2.6" height="5" rx="1.2" fill="var(--c-hud-bg)" />
    </svg>
  );
}

export function TownMap({
  spots,
  onOpen,
}: {
  spots: TownMapSpot[];
  onOpen: (id: string) => void;
}): JSX.Element {
  return (
    <div className="town-map-stage" role="region" aria-label="Kotodama Town map">
      <svg
        viewBox="0 0 375 414"
        preserveAspectRatio="none"
        className="town-map-backdrop"
        aria-hidden="true"
      >
        {/* Grassy town blocks & soft hillside patches */}
        <ellipse
          cx="85"
          cy="78"
          rx="95"
          ry="56"
          fill="color-mix(in srgb, var(--c-success-soft) 78%, var(--c-surface-alt))"
        />
        <ellipse
          cx="295"
          cy="72"
          rx="92"
          ry="54"
          fill="color-mix(in srgb, var(--c-success-soft) 74%, var(--c-surface-alt))"
        />
        <ellipse
          cx="78"
          cy="345"
          rx="98"
          ry="60"
          fill="color-mix(in srgb, var(--c-success-soft) 76%, var(--c-surface-alt))"
        />
        <ellipse
          cx="300"
          cy="340"
          rx="95"
          ry="58"
          fill="color-mix(in srgb, var(--c-success-soft) 72%, var(--c-surface-alt))"
        />

        {/* Winding Edo canal with stone embankments */}
        <path
          d="M-15 148 C85 132 165 182 225 232 C275 274 330 264 395 252"
          fill="none"
          stroke="color-mix(in srgb, var(--c-fog) 68%, var(--c-hud-bg))"
          strokeWidth="36"
          strokeLinecap="round"
        />
        <path
          d="M-15 145 C85 129 165 179 225 229 C275 271 330 261 395 249"
          fill="none"
          stroke="color-mix(in srgb, var(--c-secondary) 72%, var(--c-secondary-soft))"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d="M15 143 C85 133 145 162 195 202 M245 243 C290 266 335 258 370 251"
          fill="none"
          stroke="var(--c-hud-ink)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="10 14"
          opacity="0.45"
        />

        {/* Cobblestone & sandy Edo streets connecting all 6 districts */}
        <path
          d="M95 82 V338 M278 74 V328 M95 82 Q188 94 278 74 M95 206 Q188 214 278 196 M95 332 Q188 342 278 324"
          fill="none"
          stroke="color-mix(in srgb, var(--c-gold) 55%, var(--c-hud-bg))"
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M95 79 V335 M278 71 V325 M95 79 Q188 91 278 71 M95 203 Q188 211 278 193 M95 329 Q188 339 278 321"
          fill="none"
          stroke="color-mix(in srgb, var(--c-gold-soft) 82%, var(--c-panel))"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Red-lacquered wooden drum bridges over the canal */}
        {[
          { x: 95, y: 152 },
          { x: 278, y: 256 },
        ].map((b, i) => (
          <g key={i} transform={`translate(${b.x} ${b.y})`}>
            <rect x="-18" y="-14" width="36" height="30" rx="8" fill="var(--c-lacquer)" />
            <rect x="-18" y="-17" width="36" height="30" rx="8" fill="var(--c-accent)" />
            <rect x="-13" y="-17" width="26" height="30" rx="4" fill="var(--c-panel-edge)" />
          </g>
        ))}

        {/* Town square trees & sakura puffs */}
        {[
          { x: 186, y: 122, c: 'var(--c-petal)' },
          { x: 36, y: 268, c: 'var(--c-success)' },
          { x: 338, y: 132, c: 'var(--c-petal)' },
          { x: 188, y: 286, c: 'var(--c-success)' },
        ].map((t, i) => (
          <g key={i} transform={`translate(${t.x} ${t.y})`}>
            <ellipse cx="0" cy="12" rx="14" ry="5" fill="var(--c-shadow)" />
            <rect x="-3" y="0" width="6" height="12" rx="2" fill="var(--c-gold)" />
            <circle
              cx="0"
              cy="-3"
              r="13"
              fill={`color-mix(in srgb, ${t.c} 64%, var(--c-hud-bg))`}
            />
            <circle cx="0" cy="-6" r="13" fill={t.c} />
            <ellipse
              cx="-4"
              cy="-11"
              rx="5"
              ry="2.2"
              transform="rotate(-16 -4 -11)"
              fill="var(--c-hud-ink)"
              opacity="0.4"
            />
          </g>
        ))}

        {/* Ambient life: two tiny walking townsfolk and one drifting cloud shadow */}
        <g transform="translate(95 232)">
          <g className="town-walker-west">
            <ChibiWalker robe="var(--c-secondary)" hair="var(--c-hud-bg)" />
          </g>
        </g>
        <g transform="translate(188 206)">
          <g className="town-walker-bridge">
            <ChibiWalker robe="var(--c-accent)" hair="var(--c-hud-bg)" />
          </g>
        </g>
        <g transform="translate(188 52)">
          <g className="town-cloud-drift">
            <ellipse cx="0" cy="6" rx="34" ry="11" fill="var(--c-shadow)" />
            <path
              d="M-24 4 H24 C30 4 34 0 34 -5 C34 -10 29 -14 23 -14 C20 -21 11 -25 2 -23 C-5 -28 -16 -26 -20 -19 C-27 -19 -33 -13 -33 -6 C-33 0 -29 4 -24 4 Z"
              fill="var(--c-hud-ink)"
              opacity="0.75"
            />
          </g>
        </g>
      </svg>

      {spots.map((spot, idx) => {
        const pos = LOT_COORDS[spot.id] ?? FALLBACK_COORDS[idx % FALLBACK_COORDS.length]!;
        const stateParts = [
          spot.restored ? (spot.lit ? 'open, lanterns lit' : 'open') : 'locked',
          spot.pending > 0 ? `${yenFmt(spot.pending)} ready to collect` : '',
        ].filter(Boolean);
        return (
          <button
            key={spot.id}
            type="button"
            className={`town-spot ${spot.restored ? 'is-restored' : 'is-locked'} ${spot.lit ? 'is-lit' : ''}`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onOpen(spot.id)}
            aria-label={`${spot.en} (${stateParts.join(', ')})`}
          >
            {spot.pending > 0 && (
              <span className="town-spot-badge">
                <svg viewBox="0 0 16 16" className="town-spot-badge-coin" aria-hidden="true">
                  <circle
                    cx="8"
                    cy="8.8"
                    r="6.5"
                    fill="color-mix(in srgb, var(--c-gold) 70%, var(--c-hud-bg))"
                  />
                  <circle cx="8" cy="7.5" r="6.5" fill="var(--c-glow)" />
                  <rect x="6.2" y="5.7" width="3.6" height="3.6" rx="0.8" fill="var(--c-hud-bg)" />
                  <ellipse
                    cx="5.8"
                    cy="4.8"
                    rx="2.2"
                    ry="1"
                    transform="rotate(-18 5.8 4.8)"
                    fill="var(--c-coin-shine)"
                  />
                </svg>
                {yenFmt(spot.pending)}
              </span>
            )}
            {spot.restored ? <BuildingArt id={spot.id} lit={spot.lit} /> : <LockedLot />}
            <span className="town-spot-sign">{spot.en}</span>
          </button>
        );
      })}
    </div>
  );
}
