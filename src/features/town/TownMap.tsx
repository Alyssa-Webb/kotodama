import type { JSX } from 'react';
import './town-map.css';

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

/** Reusable paper lantern that glows warmly when the player's streak is active. */
function PaperLantern({ x, y, lit }: { x: number; y: number; lit: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {lit && <circle cx="0" cy="4" r="11" fill="var(--c-glow)" className="town-lantern-glow" />}
      <line x1="0" y1="-3" x2="0" y2="1" stroke="var(--c-hud-bg)" strokeWidth="1.6" />
      <ellipse
        cx="0"
        cy="6.5"
        rx="4.2"
        ry="5"
        fill="color-mix(in srgb, var(--c-lacquer) 72%, var(--c-hud-bg))"
      />
      <ellipse
        cx="0"
        cy="4.5"
        rx="4.2"
        ry="5"
        fill={lit ? 'var(--c-glow)' : 'color-mix(in srgb, var(--c-panel) 70%, var(--c-fog))'}
      />
      <rect x="-2.4" y="-0.8" width="4.8" height="1.8" rx="0.9" fill="var(--c-hud-bg)" />
      <rect x="-2.2" y="8.4" width="4.4" height="1.8" rx="0.9" fill="var(--c-hud-bg)" />
    </g>
  );
}

/** Tiny 2-head chibi townsfolk walking the streets. */
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

/** District illustrations: Station, Café, Shrine, Shopping Street, Bathhouse, School. */
function BuildingArt({ id, lit }: { id: string; lit: boolean }) {
  const wallShade = 'color-mix(in srgb, var(--c-panel) 66%, var(--c-hud-bg))';
  const woodShade = 'color-mix(in srgb, var(--c-gold) 60%, var(--c-hud-bg))';
  const roofBlueShade = 'color-mix(in srgb, var(--c-secondary) 58%, var(--c-hud-bg))';
  const redShade = 'color-mix(in srgb, var(--c-accent) 62%, var(--c-hud-bg))';
  const winFill = lit
    ? 'var(--c-glow)'
    : 'color-mix(in srgb, var(--c-secondary-soft) 75%, var(--c-hud-bg))';

  return (
    <svg viewBox="0 0 120 96" className="town-spot-art" aria-hidden="true">
      <ellipse cx="60" cy="81" rx="48" ry="11" fill="var(--c-shadow)" />

      {id === 'station' && (
        <g>
          {/* Wooden platform & track */}
          <rect x="10" y="73" width="100" height="8" rx="4" fill={woodShade} />
          <rect x="10" y="70" width="100" height="7" rx="3.5" fill="var(--c-panel-edge)" />
          <line x1="12" y1="82" x2="108" y2="82" stroke="var(--c-hud-bg)" strokeWidth="2.5" />
          {/* Cute chibi train car on right */}
          <rect
            x="68"
            y="45"
            width="40"
            height="25"
            rx="8"
            fill="color-mix(in srgb, var(--c-success) 62%, var(--c-hud-bg))"
          />
          <rect x="68" y="42" width="40" height="25" rx="8" fill="var(--c-success)" />
          <rect x="68" y="54" width="40" height="5" fill="var(--c-glow)" />
          <rect x="74" y="46" width="11" height="8" rx="2.5" fill={winFill} />
          <rect x="89" y="46" width="11" height="8" rx="2.5" fill={winFill} />
          <circle cx="77" cy="69" r="4" fill="var(--c-hud-bg)" />
          <circle cx="98" cy="69" r="4" fill="var(--c-hud-bg)" />
          {/* Wooden rural station house */}
          <rect x="18" y="40" width="54" height="32" rx="6" fill={wallShade} />
          <rect x="18" y="37" width="54" height="32" rx="6" fill="var(--c-panel)" />
          <rect x="37" y="51" width="14" height="18" rx="3" fill={woodShade} />
          <rect x="23" y="47" width="10" height="9" rx="2" fill={winFill} />
          <rect x="56" y="47" width="10" height="9" rx="2" fill={winFill} />
          {/* Gabled station roof & clock gable */}
          <path d="M11 42 L45 19 L79 42 Z" fill={roofBlueShade} />
          <path d="M11 39 L45 16 L79 39 Z" fill="var(--c-secondary)" />
          <circle cx="45" cy="31" r="6.5" fill={woodShade} />
          <circle cx="45" cy="29.5" r="5.5" fill="var(--c-hud-ink)" />
          <path
            d="M45 26.5 V29.5 L47.5 31"
            stroke="var(--c-hud-bg)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Platform station sign */}
          <rect x="78" y="27" width="24" height="9" rx="3" fill="var(--c-hud-ink)" />
          <rect x="80" y="30" width="20" height="3" rx="1.5" fill="var(--c-secondary)" />
          <ellipse
            cx="34"
            cy="28"
            rx="9"
            ry="3"
            transform="rotate(-18 34 28)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
          <PaperLantern x={20} y={40} lit={lit} />
          <PaperLantern x={68} y={40} lit={lit} />
        </g>
      )}

      {id === 'cafe' && (
        <g>
          {/* Kissaten timber body */}
          <rect x="22" y="39" width="76" height="38" rx="8" fill={wallShade} />
          <rect x="22" y="36" width="76" height="38" rx="8" fill="var(--c-panel)" />
          <rect x="22" y="64" width="76" height="10" rx="4" fill={woodShade} />
          {/* Warm café window & door */}
          <rect x="29" y="49" width="22" height="15" rx="3.5" fill="var(--c-hud-bg)" />
          <rect x="31" y="51" width="18" height="11" rx="2.5" fill={winFill} />
          {/* Noren curtains over entrance */}
          {[56, 66, 76].map((x) => (
            <g key={x}>
              <rect x={x} y="47" width="8" height="15" rx="2" fill={redShade} />
              <rect x={x} y="45" width="8" height="15" rx="2" fill="var(--c-accent)" />
            </g>
          ))}
          {/* Striped awning & warm tile roof */}
          <path d="M15 41 L25 22 H95 L105 41 Z" fill={redShade} />
          <path d="M15 38 L25 19 H95 L105 38 Z" fill="var(--c-accent)" />
          <ellipse
            cx="42"
            cy="27"
            rx="12"
            ry="3.8"
            transform="rotate(-14 42 27)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
          {/* Steaming teacup roof sign */}
          <ellipse cx="60" cy="21" rx="13" ry="3.5" fill={woodShade} />
          <path d="M51 11 H69 C69 21 51 21 51 11 Z" fill="var(--c-hud-ink)" />
          <path
            d="M69 13 C73 13 73 18 68 18"
            fill="none"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M56 7 Q58 3 56 1 M63 7 Q65 3 63 1"
            fill="none"
            stroke="var(--c-hud-ink)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <PaperLantern x={24} y={40} lit={lit} />
          <PaperLantern x={94} y={40} lit={lit} />
        </g>
      )}

      {id === 'shrine' && (
        <g>
          {/* Stone steps */}
          <rect
            x="24"
            y="71"
            width="72"
            height="7"
            rx="3.5"
            fill="color-mix(in srgb, var(--c-fog) 65%, var(--c-hud-bg))"
          />
          <rect x="28" y="68" width="64" height="6" rx="3" fill="var(--c-fog)" />
          {/* Honden sanctuary */}
          <rect x="34" y="38" width="52" height="32" rx="6" fill={wallShade} />
          <rect x="34" y="35" width="52" height="32" rx="6" fill="var(--c-panel)" />
          <rect x="52" y="47" width="16" height="20" rx="3" fill={woodShade} />
          <circle cx="60" cy="44" r="4" fill={lit ? 'var(--c-glow)' : 'var(--c-gold-soft)'} />
          {/* Swept curved shrine roof */}
          <path d="M18 40 Q60 15 102 40 L96 44 Q60 24 24 44 Z" fill="var(--c-lacquer)" />
          <path d="M18 37 Q60 12 102 37 L96 41 Q60 21 24 41 Z" fill="var(--c-accent)" />
          <rect x="48" y="19" width="24" height="4" rx="2" fill="var(--c-glow)" />
          <ellipse
            cx="45"
            cy="28"
            rx="10"
            ry="3.2"
            transform="rotate(-16 45 28)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
          {/* Stone lantern (tōrō) on right */}
          <rect
            x="92"
            y="58"
            width="8"
            height="14"
            rx="2"
            fill="color-mix(in srgb, var(--c-fog) 70%, var(--c-hud-bg))"
          />
          <rect
            x="91"
            y="50"
            width="10"
            height="8"
            rx="2"
            fill={lit ? 'var(--c-glow)' : 'var(--c-surface-alt)'}
          />
          <path
            d="M88 51 L96 44 L104 51 Z"
            fill="color-mix(in srgb, var(--c-fog) 65%, var(--c-hud-bg))"
          />
          {/* Red Torii gate in foreground left */}
          <rect x="21" y="45" width="5" height="30" rx="2" fill="var(--c-accent)" />
          <rect x="42" y="45" width="5" height="30" rx="2" fill="var(--c-accent)" />
          <rect x="16" y="43" width="36" height="5" rx="2.5" fill="var(--c-lacquer)" />
          <rect x="16" y="41" width="36" height="5" rx="2.5" fill="var(--c-accent)" />
          <rect x="20" y="50" width="28" height="3.5" rx="1.7" fill="var(--c-accent)" />
          <PaperLantern x={34} y={45} lit={lit} />
          <PaperLantern x={82} y={40} lit={lit} />
        </g>
      )}

      {id === 'shopping' && (
        <g>
          {/* Twin shopfronts flanking the shōtengai arcade arch */}
          <rect x="14" y="38" width="92" height="39" rx="7" fill={wallShade} />
          <rect x="14" y="35" width="92" height="39" rx="7" fill="var(--c-panel)" />
          {/* Glazed arcade arch in center */}
          <path d="M44 74 V34 C44 19 76 19 76 34 V74 Z" fill={roofBlueShade} />
          <path d="M47 74 V35 C47 22 73 22 73 35 V74 Z" fill={winFill} />
          {/* Left & right shop awnings */}
          <path d="M11 43 L18 30 H45 V43 Z" fill={redShade} />
          <path d="M11 40 L18 27 H45 V40 Z" fill="var(--c-accent)" />
          <path d="M75 43 H102 L109 43 L102 30 H75 Z" fill={woodShade} />
          <path d="M75 40 H109 L102 27 H75 Z" fill="var(--c-gold)" />
          {/* Hanging festival banners */}
          <rect x="21" y="46" width="9" height="19" rx="2" fill="var(--c-accent)" />
          <rect x="33" y="46" width="9" height="19" rx="2" fill="var(--c-secondary)" />
          <rect x="78" y="46" width="9" height="19" rx="2" fill="var(--c-success)" />
          <rect x="90" y="46" width="9" height="19" rx="2" fill="var(--c-accent)" />
          {/* Overhead arcade plaque */}
          <rect x="42" y="19" width="36" height="10" rx="5" fill="var(--c-glow)" />
          <ellipse
            cx="54"
            cy="23"
            rx="8"
            ry="2.5"
            transform="rotate(-12 54 23)"
            fill="var(--c-hud-ink)"
            opacity="0.42"
          />
          <PaperLantern x={45} y={36} lit={lit} />
          <PaperLantern x={75} y={36} lit={lit} />
        </g>
      )}

      {id === 'bathhouse' && (
        <g>
          {/* Tall sentō chimney on right with steam puffs */}
          <rect
            x="88"
            y="12"
            width="11"
            height="62"
            rx="4"
            fill="color-mix(in srgb, var(--c-fog) 60%, var(--c-hud-bg))"
          />
          <rect x="88" y="10" width="11" height="60" rx="4" fill="var(--c-fog)" />
          <rect x="86" y="9" width="15" height="4" rx="2" fill="var(--c-lacquer)" />
          <circle cx="94" cy="4" r="3.5" fill="var(--c-hud-ink)" opacity="0.65" />
          {/* Sentō bathhouse hall */}
          <rect x="18" y="39" width="72" height="38" rx="8" fill={wallShade} />
          <rect x="18" y="36" width="72" height="38" rx="8" fill="var(--c-panel)" />
          <rect x="24" y="44" width="14" height="10" rx="3" fill={winFill} />
          <rect x="70" y="44" width="14" height="10" rx="3" fill={winFill} />
          {/* Karahafu curved gable roof */}
          <path d="M10 41 Q54 13 96 41 Z" fill={roofBlueShade} />
          <path d="M10 38 Q54 10 96 38 Z" fill="var(--c-secondary)" />
          <ellipse
            cx="40"
            cy="27"
            rx="11"
            ry="3.5"
            transform="rotate(-16 40 27)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
          {/* Indigo noren with warm onsen ♨ symbol */}
          <rect x="38" y="47" width="32" height="22" rx="4" fill={roofBlueShade} />
          <rect x="38" y="44" width="32" height="22" rx="4" fill="var(--c-secondary)" />
          <circle cx="54" cy="57" r="5.5" fill="none" stroke="var(--c-hud-ink)" strokeWidth="2" />
          <path
            d="M50 54 V49 M54 53 V48 M58 54 V49"
            stroke="var(--c-hud-ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <PaperLantern x={21} y={40} lit={lit} />
          <PaperLantern x={85} y={40} lit={lit} />
        </g>
      )}

      {(id === 'school' ||
        !['station', 'cafe', 'shrine', 'shopping', 'bathhouse'].includes(id)) && (
        <g>
          {/* Terakoya wooden schoolhouse */}
          <rect x="20" y="40" width="80" height="37" rx="8" fill={wallShade} />
          <rect x="20" y="37" width="80" height="37" rx="8" fill="var(--c-panel)" />
          <rect x="20" y="64" width="80" height="10" rx="4" fill={woodShade} />
          {/* Shoji classroom windows & sliding door */}
          <rect x="27" y="46" width="18" height="14" rx="3" fill={winFill} />
          <rect x="75" y="46" width="18" height="14" rx="3" fill={winFill} />
          <rect x="51" y="48" width="18" height="24" rx="3" fill={woodShade} />
          {/* Roof + belfry turret with golden bell */}
          <path d="M12 42 L60 19 L108 42 Z" fill={woodShade} />
          <path d="M12 39 L60 16 L108 39 Z" fill="var(--c-gold)" />
          <rect x="49" y="10" width="22" height="15" rx="4" fill={woodShade} />
          <path d="M44 12 L60 3 L76 12 Z" fill="var(--c-secondary)" />
          <path d="M55 22 C55 15 65 15 65 22 Z" fill="var(--c-glow)" />
          <circle cx="60" cy="23" r="2" fill="var(--c-coin-shine)" />
          <ellipse
            cx="42"
            cy="29"
            rx="10"
            ry="3.2"
            transform="rotate(-16 42 29)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
          <PaperLantern x={23} y={41} lit={lit} />
          <PaperLantern x={97} y={41} lit={lit} />
        </g>
      )}
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
