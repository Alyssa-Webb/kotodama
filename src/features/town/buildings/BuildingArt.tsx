/**
 * The six Town districts drawn as buildings on the map (Station, Café, Shrine, Shopping Street,
 * Bathhouse, School). `lit` is true once the district is restored.
 */
/** District illustrations: Station, Café, Shrine, Shopping Street, Bathhouse, School. */
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

export function BuildingArt({ id, lit }: { id: string; lit: boolean }) {
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
