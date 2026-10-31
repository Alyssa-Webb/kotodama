/**
 * The gate where the trail crosses from one story region into the next, so the Path reads as one
 * connected road (reference: the owner's Tripo road diorama). A torii leads from the Dojo into the
 * Bamboo Thicket; a wooden kido town gate leads from the Thicket into the City Market.
 * Art by Gemini 4 Argon.
 */
export type GateKind = 'torii' | 'kido';

/** Which gate stands at the start of a region, if any (the first region has none). */
export function gateFor(regionId: string): GateKind | null {
  if (regionId === 'bamboo') return 'torii';
  if (regionId === 'market') return 'kido';
  return null;
}

export function RegionGate({ kind, lit }: { kind: GateKind; lit: boolean }) {
  const stoneMain = 'color-mix(in srgb, var(--c-hud-ink) 74%, var(--c-fog))';
  const stoneLight = 'color-mix(in srgb, var(--c-hud-ink) 86%, var(--c-fog))';
  const stoneLip = 'color-mix(in srgb, var(--c-fog) 62%, var(--c-hud-bg))';
  const woodLight = 'color-mix(in srgb, var(--c-hud-ink) 78%, var(--c-gold-soft))';
  const woodMid = 'var(--c-panel-edge)';
  const woodLip = 'color-mix(in srgb, var(--c-gold) 58%, var(--c-hud-bg))';
  const woodDark = 'color-mix(in srgb, var(--c-gold) 38%, var(--c-hud-bg))';
  const woodDeep = 'color-mix(in srgb, var(--c-gold) 22%, var(--c-hud-bg))';
  const tileMain = 'color-mix(in srgb, var(--c-secondary) 42%, var(--c-hud-bg))';
  const tileLight = 'color-mix(in srgb, var(--c-secondary) 58%, var(--c-fog))';
  const tileLip = 'color-mix(in srgb, var(--c-secondary) 22%, var(--c-hud-bg))';
  const vermilion = 'var(--c-accent)';
  const vermilionLip = 'color-mix(in srgb, var(--c-accent) 60%, var(--c-hud-bg))';
  const lacquer = 'var(--c-lacquer)';
  const bambooMain = 'var(--c-success)';
  const bambooLight = 'color-mix(in srgb, var(--c-success) 76%, var(--c-hud-ink))';
  const bambooLip = 'color-mix(in srgb, var(--c-success) 58%, var(--c-hud-bg))';
  const wallMain = 'var(--c-surface-alt)';
  const wallLip = 'color-mix(in srgb, var(--c-border) 68%, var(--c-hud-bg))';

  return (
    <div
      className={`region-gate region-gate-${kind} ${lit ? 'is-lit' : 'is-locked'}`}
      aria-hidden="true"
    >
      {kind === 'torii' ? (
        <svg viewBox="0 0 140 116" className="region-gate-svg">
          {/* Ground shadows & mossy verges flanking the trail (trail passes through x=42..94) */}
          <ellipse cx="26" cy="104" rx="22" ry="6" fill="var(--c-shadow)" />
          <ellipse cx="110" cy="104" rx="26" ry="6.5" fill="var(--c-shadow)" />
          <ellipse cx="27" cy="101" rx="18" ry="5" fill={bambooLip} />
          <ellipse cx="27" cy="98" rx="18" ry="5" fill={bambooMain} />
          <ellipse cx="111" cy="101" rx="22" ry="5.5" fill={bambooLip} />
          <ellipse cx="111" cy="98" rx="22" ry="5.5" fill={bambooMain} />

          {/* Left young bamboo shoot */}
          <rect x="8" y="65" width="5.5" height="33" rx="2.7" fill={bambooLip} />
          <rect x="8" y="62" width="5.5" height="33" rx="2.7" fill={bambooMain} />
          <rect x="7" y="77" width="7.5" height="2.4" rx="1.2" fill={bambooLip} />
          <path d="M 8 66 C 1 62, 0 56, 7 55 C 10 55, 11 60, 8 66 Z" fill={bambooLip} />
          <path d="M 8 63 C 1 59, 0 53, 7 52 C 10 52, 11 57, 8 63 Z" fill={bambooLight} />

          {/* Right bamboo thicket cluster (3 segmented culms + node rings + layered leaf fans) */}
          <g className="region-gate-bamboo">
            <rect x="115" y="17" width="7.5" height="81" rx="3.7" fill={bambooLip} />
            <rect x="115" y="14" width="7.5" height="81" rx="3.7" fill={bambooMain} />
            <rect x="116.5" y="17" width="2" height="74" rx="1" fill={bambooLight} opacity="0.55" />
            <rect x="114" y="34" width="9.5" height="2.8" rx="1.4" fill={bambooLip} />
            <rect x="114" y="55" width="9.5" height="2.8" rx="1.4" fill={bambooLip} />
            <rect x="114" y="76" width="9.5" height="2.8" rx="1.4" fill={bambooLip} />

            <rect x="105" y="31" width="7" height="68" rx="3.5" fill={bambooLip} />
            <rect x="105" y="28" width="7" height="68" rx="3.5" fill={bambooLight} />
            <rect
              x="106.5"
              y="31"
              width="1.8"
              height="62"
              rx="0.9"
              fill="var(--c-hud-ink)"
              opacity="0.38"
            />
            <rect x="104" y="47" width="9" height="2.6" rx="1.3" fill={bambooLip} />
            <rect x="104" y="68" width="9" height="2.6" rx="1.3" fill={bambooLip} />
            <rect x="104" y="86" width="9" height="2.6" rx="1.3" fill={bambooLip} />

            <rect x="125" y="43" width="6.5" height="55" rx="3.2" fill={bambooLip} />
            <rect x="125" y="40" width="6.5" height="55" rx="3.2" fill={bambooMain} />
            <rect x="124" y="59" width="8.5" height="2.5" rx="1.2" fill={bambooLip} />
            <rect x="124" y="79" width="8.5" height="2.5" rx="1.2" fill={bambooLip} />

            <path d="M 106 32 C 94 27, 90 19, 101 18 C 106 18, 108 25, 106 32 Z" fill={bambooLip} />
            <path
              d="M 106 29 C 94 24, 90 16, 101 15 C 106 15, 108 22, 106 29 Z"
              fill={bambooLight}
            />
            <path d="M 118 20 C 107 14, 105 6, 115 6 C 120 6, 121 13, 118 20 Z" fill={bambooLip} />
            <path d="M 118 17 C 107 11, 105 3, 115 3 C 120 3, 121 10, 118 17 Z" fill={bambooMain} />
            <path d="M 121 23 C 132 17, 137 9, 127 8 C 122 8, 120 15, 121 23 Z" fill={bambooLip} />
            <path
              d="M 121 20 C 132 14, 137 6, 127 5 C 122 5, 120 12, 121 20 Z"
              fill={bambooLight}
            />
            <path
              d="M 129 45 C 138 40, 140 32, 132 31 C 128 31, 127 38, 129 45 Z"
              fill={bambooLip}
            />
            <path
              d="M 129 42 C 138 37, 140 29, 132 28 C 128 28, 127 35, 129 42 Z"
              fill={bambooMain}
            />
            <ellipse
              cx="114"
              cy="10"
              rx="3.5"
              ry="1.2"
              transform="rotate(-18 114 10)"
              fill="var(--c-hud-ink)"
              opacity="0.4"
            />
          </g>

          {/* Mossy stepping stones at right base */}
          <ellipse cx="122" cy="99" rx="9" ry="4.5" fill={stoneLip} />
          <ellipse cx="122" cy="96" rx="9" ry="4.5" fill={stoneMain} />
          <ellipse
            cx="120"
            cy="94.5"
            rx="3.5"
            ry="1.3"
            transform="rotate(-14 120 94.5)"
            fill="var(--c-hud-ink)"
            opacity="0.38"
          />

          {/* Lower tie beam (nuki) & kusabi wedges */}
          <rect x="20" y="42" width="96" height="8.5" rx="4" fill={vermilionLip} />
          <rect x="20" y="39" width="96" height="8.5" rx="4" fill={vermilion} />
          <path d="M 27 36 L 32 38 L 32 42 L 27 42 Z" fill={woodDark} />
          <path d="M 109 36 L 104 38 L 104 42 L 109 42 Z" fill={woodDark} />

          {/* Paper shide hanging under the nuki (the swaying element) */}
          <g className="region-gate-lantern">
            <path d="M 41 49 L 38 54 L 41 54 L 39 60 L 44 53 L 41 53 L 44 49 Z" fill={stoneLip} />
            <path
              d="M 41 47 L 38 52 L 41 52 L 39 58 L 44 51 L 41 51 L 44 47 Z"
              fill="var(--c-hud-ink)"
            />
            <path d="M 67 50 L 64 55 L 67 55 L 65 61 L 70 54 L 67 54 L 70 50 Z" fill={stoneLip} />
            <path
              d="M 67 48 L 64 53 L 67 53 L 65 59 L 70 52 L 67 52 L 70 48 Z"
              fill="var(--c-hud-ink)"
            />
            <path d="M 93 49 L 90 54 L 93 54 L 91 60 L 96 53 L 93 53 L 96 49 Z" fill={stoneLip} />
            <path
              d="M 93 47 L 90 52 L 93 52 L 91 58 L 96 51 L 93 51 L 96 47 Z"
              fill="var(--c-hud-ink)"
            />
          </g>

          {/* Torii pillars (hashira) with inward cant, vertical sheen & top daiwa collars */}
          <path d="M 32 25 L 42 25 L 40 96 L 29 96 Z" fill={vermilionLip} />
          <path d="M 32 22 L 42 22 L 40 93 L 29 93 Z" fill={vermilion} />
          <path d="M 33.5 26 L 36 26 L 34.5 88 L 32 88 Z" fill="var(--c-hud-ink)" opacity="0.3" />
          <rect x="31" y="23" width="12" height="4.5" rx="2" fill={lacquer} />

          <path d="M 94 25 L 104 25 L 107 96 L 96 96 Z" fill={vermilionLip} />
          <path d="M 94 22 L 104 22 L 107 93 L 96 93 Z" fill={vermilion} />
          <path d="M 96 26 L 98.5 26 L 100.5 88 L 98 88 Z" fill="var(--c-hud-ink)" opacity="0.3" />
          <rect x="93" y="23" width="12" height="4.5" rx="2" fill={lacquer} />

          {/* Two-tier carved stone pillar bases (kamebara) */}
          <rect x="26" y="92" width="17" height="8" rx="3.5" fill={stoneLip} />
          <rect x="26" y="89" width="17" height="8" rx="3.5" fill={stoneMain} />
          <rect x="28" y="87" width="13" height="4" rx="2" fill={stoneLight} />
          <ellipse
            cx="31"
            cy="91"
            rx="3.5"
            ry="1.2"
            transform="rotate(-14 31 91)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />

          <rect x="93" y="92" width="17" height="8" rx="3.5" fill={stoneLip} />
          <rect x="93" y="89" width="17" height="8" rx="3.5" fill={stoneMain} />
          <rect x="95" y="87" width="13" height="4" rx="2" fill={stoneLight} />
          <ellipse
            cx="98"
            cy="91"
            rx="3.5"
            ry="1.2"
            transform="rotate(-14 98 91)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />

          {/* Center framed tablet (gakuzuka) */}
          <rect x="59" y="25" width="18" height="21" rx="3.5" fill={woodLip} />
          <rect x="59" y="22" width="18" height="21" rx="3.5" fill={woodMid} />
          <rect x="62" y="25" width="12" height="15" rx="2" fill="var(--c-hud-bg)" />
          <circle cx="68" cy="29.5" r="1.3" fill={woodMid} />
          <rect x="66.8" y="32.5" width="2.4" height="4.5" rx="1.2" fill={woodMid} />
          <ellipse
            cx="63"
            cy="24"
            rx="3"
            ry="1"
            transform="rotate(-15 63 24)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />

          {/* Curved lower sub-lintel (shimaki) & winged upper lintel (kasagi) */}
          <path d="M 15 21 Q 68 30 121 21 L 117 30 Q 68 38 19 30 Z" fill={vermilionLip} />
          <path d="M 15 18 Q 68 27 121 18 L 117 27 Q 68 35 19 27 Z" fill={vermilion} />
          <path d="M 9 14 Q 68 26 127 14 L 123 23 Q 68 33 13 23 Z" fill={vermilionLip} />
          <path d="M 9 11 Q 68 23 127 11 L 123 20 Q 68 30 13 20 Z" fill={vermilion} />
          <path d="M 8 10 Q 68 22 128 10 L 125 15 Q 68 26 11 15 Z" fill={tileLip} />
          <path d="M 8 8 Q 68 20 128 8 L 125 13 Q 68 24 11 13 Z" fill={lacquer} />
          <ellipse
            cx="36"
            cy="17"
            rx="14"
            ry="2.4"
            transform="rotate(-6 36 17)"
            fill="var(--c-hud-ink)"
            opacity="0.42"
          />

          {/* Carved stone lantern (ishidōrō) at left foot */}
          <g className="region-gate-toro">
            <rect x="9" y="96" width="20" height="7" rx="3.5" fill={stoneLip} />
            <rect x="9" y="93" width="20" height="7" rx="3.5" fill={stoneMain} />
            <rect x="15" y="79" width="8" height="16" rx="2.5" fill={stoneLip} />
            <rect x="15" y="76" width="8" height="16" rx="2.5" fill={stoneMain} />
            <rect x="13.5" y="83" width="11" height="3.5" rx="1.7" fill={stoneLight} />
            <rect x="11" y="74" width="16" height="6" rx="3" fill={stoneLip} />
            <rect x="11" y="71" width="16" height="6" rx="3" fill={stoneLight} />
            <rect x="12.5" y="62" width="13" height="11" rx="2.5" fill={stoneLip} />
            <rect x="12.5" y="59" width="13" height="11" rx="2.5" fill={stoneMain} />
            {lit && <circle cx="19" cy="64.5" r="9.5" fill="var(--c-firefly)" opacity="0.34" />}
            <rect
              x="15.5"
              y="61.5"
              width="7"
              height="6"
              rx="1.8"
              fill={lit ? 'var(--c-glow)' : 'var(--c-hud-bg)'}
            />
            {lit && <circle cx="19" cy="64.5" r="2.2" fill="var(--c-coin-shine)" />}
            <path d="M 6 63 Q 19 49 32 63 Q 19 66 6 63 Z" fill={stoneLip} />
            <path d="M 6 60 Q 19 46 32 60 Q 19 63 6 60 Z" fill={stoneMain} />
            <circle cx="19" cy="50" r="3" fill={stoneLip} />
            <circle cx="19" cy="48" r="3" fill={stoneLight} />
            <ellipse
              cx="15"
              cy="55"
              rx="4.5"
              ry="1.5"
              transform="rotate(-18 15 55)"
              fill="var(--c-hud-ink)"
              opacity="0.42"
            />
          </g>

          {/* Locked state: layered mist pillows across the torii opening */}
          {!lit && (
            <g className="region-gate-mist" opacity="0.92">
              <rect x="18" y="62" width="82" height="17" rx="8.5" fill={stoneLip} />
              <rect x="18" y="59" width="82" height="17" rx="8.5" fill="var(--c-fog)" />
              <circle cx="42" cy="57" r="10" fill="var(--c-fog)" />
              <circle cx="68" cy="55" r="12" fill={stoneMain} />
              <rect x="34" y="76" width="84" height="16" rx="8" fill={stoneLip} />
              <rect x="34" y="73" width="84" height="16" rx="8" fill={stoneMain} />
              <ellipse
                cx="42"
                cy="55"
                rx="9"
                ry="2.6"
                transform="rotate(-12 42 55)"
                fill="var(--c-hud-ink)"
                opacity="0.4"
              />
            </g>
          )}
        </svg>
      ) : (
        <svg viewBox="0 0 140 116" className="region-gate-svg">
          {/* Ground shadows flanking the trail */}
          <ellipse cx="26" cy="104" rx="22" ry="6" fill="var(--c-shadow)" />
          <ellipse cx="108" cy="104" rx="28" ry="6.5" fill="var(--c-shadow)" />

          {/* Corner of a 2-story machiya townhouse peeking behind the right gatepost */}
          <g className="region-gate-machiya">
            <rect x="92" y="31" width="42" height="34" rx="3" fill={wallLip} />
            <rect x="92" y="28" width="42" height="34" rx="3" fill={wallMain} />
            <rect x="105" y="37" width="18" height="13" rx="2" fill={woodLip} />
            <rect x="105" y="35" width="18" height="13" rx="2" fill={woodDark} />
            <rect x="108" y="37" width="2.2" height="9" rx="1" fill={wallMain} />
            <rect x="113" y="37" width="2.2" height="9" rx="1" fill={wallMain} />
            <rect x="118" y="37" width="2.2" height="9" rx="1" fill={wallMain} />

            <path d="M 86 30 Q 112 17 138 22 L 138 33 Q 112 28 88 36 Z" fill={tileLip} />
            <path d="M 86 27 Q 112 14 138 19 L 138 30 Q 112 25 88 33 Z" fill={tileMain} />
            <rect x="94" y="16" width="42" height="5" rx="2.5" fill={stoneLip} />
            <rect x="94" y="14" width="42" height="5" rx="2.5" fill={stoneMain} />
            <ellipse
              cx="104"
              cy="23"
              rx="8"
              ry="2"
              transform="rotate(-12 104 23)"
              fill="var(--c-hud-ink)"
              opacity="0.38"
            />

            <rect x="92" y="61" width="42" height="39" rx="3" fill={woodDeep} />
            <rect x="92" y="58" width="42" height="39" rx="3" fill={woodDark} />
            <rect x="107" y="70" width="22" height="22" rx="2.5" fill={woodDeep} />
            <rect
              x="109"
              y="72"
              width="18"
              height="18"
              rx="1.5"
              fill={lit ? 'var(--c-glow)' : 'var(--c-hud-bg)'}
              opacity={lit ? '0.75' : '0.9'}
            />
            <rect x="113" y="72" width="2" height="18" fill={woodDark} />
            <rect x="119" y="72" width="2" height="18" fill={woodDark} />
            <rect x="109" y="80" width="18" height="2" fill={woodDark} />

            <rect x="97" y="63" width="10" height="14" rx="2" fill={vermilionLip} />
            <rect x="97" y="60" width="10" height="14" rx="2" fill={vermilion} />
            <rect x="108.5" y="63" width="10" height="14" rx="2" fill={vermilionLip} />
            <rect x="108.5" y="60" width="10" height="14" rx="2" fill={vermilion} />
            <circle cx="102" cy="67" r="2.2" fill="var(--c-hud-ink)" opacity="0.85" />
            <circle cx="113.5" cy="67" r="2.2" fill="var(--c-hud-ink)" opacity="0.85" />

            <path d="M 88 55 L 138 49 L 139 60 L 88 63 Z" fill={tileLip} />
            <path d="M 88 52 L 138 46 L 139 57 L 88 60 Z" fill={tileMain} />
            <circle cx="96" cy="59" r="3" fill={tileLight} />
            <circle cx="108" cy="58" r="3" fill={tileLight} />
            <circle cx="120" cy="57" r="3" fill={tileLight} />
            <circle cx="132" cy="56" r="3" fill={tileLight} />
          </g>

          {/* Left sode-bei wing wall (plaster, cedar wainscoting, stone base & mini tiled coping) */}
          <g className="region-gate-wingwall">
            <rect x="5" y="92" width="26" height="9" rx="3" fill={stoneLip} />
            <rect x="5" y="89" width="26" height="9" rx="3" fill={stoneMain} />
            <rect x="6" y="49" width="24" height="42" rx="3" fill={wallLip} />
            <rect x="6" y="46" width="24" height="42" rx="3" fill={wallMain} />
            <rect x="6" y="68" width="24" height="23" rx="2" fill={woodDeep} />
            <rect x="6" y="65" width="24" height="23" rx="2" fill={woodDark} />
            <rect x="6" y="74" width="24" height="2.5" fill={woodMid} />
            <path d="M 3 45 L 31 41 L 31 49 L 3 51 Z" fill={tileLip} />
            <path d="M 3 42 L 31 38 L 31 46 L 3 48 Z" fill={tileMain} />
          </g>

          {/* Kido gate doors: swung open in perspective when lit, shut & barred when locked */}
          {lit ? (
            <g className="region-gate-doors-open">
              <path d="M 38 41 L 51 47 L 51 94 L 38 98 Z" fill={woodDeep} />
              <path d="M 38 38 L 51 44 L 51 91 L 38 95 Z" fill={woodMid} />
              <path d="M 40 43 L 49 47 L 49 87 L 40 90 Z" fill={woodDark} />
              <rect x="39" y="56" width="11" height="3" rx="1" fill={woodMid} />
              <rect x="39" y="73" width="11" height="3" rx="1" fill={woodMid} />
              <circle cx="47" cy="64" r="1.6" fill="var(--c-gold)" />

              <path d="M 90 41 L 77 47 L 77 94 L 90 98 Z" fill={woodDeep} />
              <path d="M 90 38 L 77 44 L 77 91 L 90 95 Z" fill={woodMid} />
              <path d="M 88 43 L 79 47 L 79 87 L 88 90 Z" fill={woodDark} />
              <rect x="78" y="56" width="11" height="3" rx="1" fill={woodMid} />
              <rect x="78" y="73" width="11" height="3" rx="1" fill={woodMid} />
              <circle cx="81" cy="64" r="1.6" fill="var(--c-gold)" />
            </g>
          ) : (
            <g className="region-gate-doors-closed">
              <rect x="38" y="42" width="25.5" height="54" rx="2.5" fill={woodDeep} />
              <rect x="38" y="39" width="25.5" height="54" rx="2.5" fill={woodMid} />
              <rect x="41" y="43" width="19.5" height="46" rx="1.5" fill={woodDark} />
              <rect x="64.5" y="42" width="25.5" height="54" rx="2.5" fill={woodDeep} />
              <rect x="64.5" y="39" width="25.5" height="54" rx="2.5" fill={woodMid} />
              <rect x="67.5" y="43" width="19.5" height="46" rx="1.5" fill={woodDark} />
              <rect x="33" y="65" width="62" height="7.5" rx="3" fill={woodDeep} />
              <rect x="33" y="62" width="62" height="7.5" rx="3" fill={woodLight} />
              <rect x="39" y="61" width="5" height="9.5" rx="1.5" fill="var(--c-hud-bg)" />
              <rect x="84" y="61" width="5" height="9.5" rx="1.5" fill="var(--c-hud-bg)" />
            </g>
          )}

          {/* Main kido timber gateposts (kagami-bashira) */}
          <rect x="28" y="27" width="11" height="70" rx="3.5" fill={woodDeep} />
          <rect x="28" y="24" width="11" height="70" rx="3.5" fill={woodDark} />
          <rect x="30" y="28" width="2.2" height="60" rx="1" fill={woodLight} opacity="0.32" />
          <rect x="89" y="27" width="11" height="70" rx="3.5" fill={woodDeep} />
          <rect x="89" y="24" width="11" height="70" rx="3.5" fill={woodDark} />
          <rect x="91" y="28" width="2.2" height="60" rx="1" fill={woodLight} opacity="0.32" />

          {/* Stone post foundations */}
          <rect x="26" y="93" width="15" height="8" rx="3.5" fill={stoneLip} />
          <rect x="26" y="90" width="15" height="8" rx="3.5" fill={stoneMain} />
          <rect x="87" y="93" width="15" height="8" rx="3.5" fill={stoneLip} />
          <rect x="87" y="90" width="15" height="8" rx="3.5" fill={stoneMain} />

          {/* Horizontal lintel beam & metal end-plates */}
          <rect x="21" y="34" width="86" height="9" rx="3.5" fill={woodLip} />
          <rect x="21" y="31" width="86" height="9" rx="3.5" fill={woodMid} />
          <rect x="27" y="32" width="13" height="7" rx="2" fill="var(--c-hud-bg)" />
          <circle cx="33.5" cy="35.5" r="1.8" fill="var(--c-gold)" />
          <rect x="88" y="32" width="13" height="7" rx="2" fill="var(--c-hud-bg)" />
          <circle cx="94.5" cy="35.5" r="1.8" fill="var(--c-gold)" />

          {/* Main tiled kido roof (kawara-yane) with ridge cap & round eave tiles */}
          <path d="M 11 30 Q 64 11 117 30 L 111 38 Q 64 23 17 38 Z" fill={tileLip} />
          <path d="M 11 27 Q 64 8 117 27 L 111 35 Q 64 20 17 35 Z" fill={tileMain} />
          {[22, 36, 50, 64, 78, 92, 106].map((x) => {
            const y =
              x === 64 ? 29 : x === 50 || x === 78 ? 29.5 : x === 36 || x === 92 ? 31.5 : 34;
            return (
              <g key={x}>
                <circle cx={x} cy={y} r="3.6" fill={tileLip} />
                <circle cx={x} cy={y - 1} r="2.2" fill={tileLight} />
              </g>
            );
          })}

          {/* Roof ridgebeam & onigawara end caps */}
          <rect x="36" y="14" width="56" height="7" rx="3.5" fill={stoneLip} />
          <rect x="36" y="11" width="56" height="7" rx="3.5" fill={stoneMain} />
          <rect x="33" y="10" width="7" height="9" rx="3" fill={tileLip} />
          <rect x="33" y="8" width="7" height="9" rx="3" fill={stoneLight} />
          <rect x="88" y="10" width="7" height="9" rx="3" fill={tileLip} />
          <rect x="88" y="8" width="7" height="9" rx="3" fill={stoneLight} />
          <ellipse
            cx="44"
            cy="21"
            rx="14"
            ry="2.8"
            transform="rotate(-14 44 21)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />

          {/* Swaying red chōchin lantern hanging from the kido eave */}
          <g className="region-gate-lantern">
            <rect x="79" y="34" width="2.2" height="7" fill="var(--c-hud-bg)" />
            {lit && <circle cx="80" cy="50" r="14" fill="var(--c-firefly)" opacity="0.34" />}
            <ellipse cx="80" cy="52" rx="9" ry="10.5" fill={vermilionLip} />
            <ellipse cx="80" cy="49" rx="9" ry="10.5" fill={vermilion} />
            {lit && (
              <ellipse cx="80" cy="49" rx="5.5" ry="6.5" fill="var(--c-glow)" opacity="0.9" />
            )}
            {lit && <circle cx="80" cy="49" r="2.6" fill="var(--c-coin-shine)" />}
            <path
              d="M 71.5 46 Q 80 49 88.5 46"
              stroke={vermilionLip}
              strokeWidth="1.6"
              fill="none"
            />
            <path
              d="M 71.5 52 Q 80 55 88.5 52"
              stroke={vermilionLip}
              strokeWidth="1.6"
              fill="none"
            />
            <rect x="75" y="38" width="10" height="3.5" rx="1.7" fill="var(--c-hud-bg)" />
            <rect x="75" y="57.5" width="10" height="3.5" rx="1.7" fill="var(--c-hud-bg)" />
            <rect x="78.5" y="61" width="3" height="4.5" rx="1.5" fill={vermilion} />
            <ellipse
              cx="76.5"
              cy="44.5"
              rx="3.2"
              ry="1.6"
              transform="rotate(-18 76.5 44.5)"
              fill="var(--c-hud-ink)"
              opacity="0.42"
            />
          </g>
        </svg>
      )}
    </div>
  );
}
