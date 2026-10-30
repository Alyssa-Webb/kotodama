/**
 * Koto (言霊の精) — Kotodama's chibi word-spirit mascot.
 * Pure 2D inline SVG + CSS animations (transform & opacity only), driven by theme tokens.
 */
import type { JSX } from 'react';
import './mascot.css';

export type MascotPose =
  'idle' | 'wave' | 'point' | 'talk' | 'cheer' | 'think' | 'surprised' | 'sleep';

export type MascotOutfit = 'guide' | 'shopkeeper' | 'mayor' | 'sensei';

const FUR = 'var(--c-hud-ink)';
const FUR_MID = 'color-mix(in srgb, var(--c-hud-ink) 88%, var(--c-panel-edge))';
const FUR_SHADE = 'color-mix(in srgb, var(--c-hud-ink) 74%, var(--c-panel-edge))';
const INK = 'var(--c-hud-bg)';
const INDIGO = 'var(--c-secondary)';
const INDIGO_SHADE = 'color-mix(in srgb, var(--c-secondary) 64%, var(--c-hud-bg))';

/** Crisp geometric 言 seal block (no font dependency, reads cleanly down to 40px). */
function KotodamaSeal({ compact = false }: { compact?: boolean }) {
  return (
    <g transform={compact ? 'translate(0 18) scale(1 0.88)' : undefined}>
      <rect x="112" y="220" width="176" height="158" rx="34" fill="var(--c-lacquer)" />
      <rect x="112" y="206" width="176" height="154" rx="34" fill="var(--c-accent)" />
      <ellipse
        cx="154"
        cy="226"
        rx="26"
        ry="9"
        transform="rotate(-16 154 226)"
        fill="var(--c-coin-shine)"
        opacity="0.5"
      />
      <rect
        x="126"
        y="220"
        width="148"
        height="126"
        rx="22"
        fill="none"
        stroke={FUR}
        strokeWidth="8.5"
      />
      {/* Darker bottom shade of 言 */}
      <g fill="var(--c-lacquer)">
        <rect x="174" y="236" width="52" height="12" rx="6" />
        <rect x="146" y="253" width="108" height="13" rx="6.5" />
        <rect x="163" y="272" width="74" height="11.5" rx="5.75" />
        <rect x="163" y="289" width="74" height="11.5" rx="5.75" />
        <rect x="158" y="306" width="84" height="32" rx="10" />
      </g>
      {/* Crisp cream strokes of 言 */}
      <g fill={FUR}>
        <rect x="174" y="232" width="52" height="12" rx="6" />
        <rect x="146" y="249" width="108" height="13" rx="6.5" />
        <rect x="163" y="268" width="74" height="11.5" rx="5.75" />
        <rect x="163" y="285" width="74" height="11.5" rx="5.75" />
        <path
          fillRule="evenodd"
          d="M168 302 H232 A10 10 0 0 1 242 312 V324 A10 10 0 0 1 232 334 H168 A10 10 0 0 1 158 324 V312 A10 10 0 0 1 168 302 Z M172 313 V323 H228 V313 Z"
        />
      </g>
    </g>
  );
}

/** Outfit body overlays drawn over Koto's shared torso. */
function OutfitBody({ outfit, openArms }: { outfit: MascotOutfit; openArms: boolean }) {
  switch (outfit) {
    case 'guide':
      return <KotodamaSeal compact={openArms} />;

    case 'shopkeeper':
      return (
        <g>
          {/* Indigo festival happi coat with vermilion collar lapels */}
          <path
            d="M104 244 C104 228 124 222 152 222 L200 268 L248 222 C276 222 296 228 296 244 L302 328 C302 340 288 346 272 346 H128 C112 346 98 340 98 328 Z"
            fill={INDIGO_SHADE}
          />
          <path
            d="M104 238 C104 224 124 218 152 218 L200 264 L248 218 C276 218 296 224 296 238 L302 320 C302 332 288 338 272 338 H128 C112 338 98 332 98 320 Z"
            fill={INDIGO}
          />
          {/* Happi coat lapels */}
          <path
            d="M150 218 L200 274 L250 218 L234 218 L200 256 L166 218 Z"
            fill="var(--c-lacquer)"
          />
          <path
            d="M153 218 L200 268 L247 218 L236 218 L200 254 L164 218 Z"
            fill="var(--c-accent)"
          />
          {/* Little cream merchant apron (maekake) */}
          <rect x="130" y="274" width="140" height="90" rx="22" fill={FUR_SHADE} />
          <rect x="130" y="266" width="140" height="88" rx="22" fill={FUR} />
          <rect x="122" y="262" width="156" height="14" rx="7" fill="var(--c-lacquer)" />
          <rect x="122" y="258" width="156" height="12" rx="6" fill="var(--c-accent)" />
          {/* Golden koban badge on apron */}
          <ellipse cx="200" cy="316" rx="22" ry="27" fill="var(--c-gold)" />
          <ellipse cx="200" cy="312" rx="22" ry="26" fill="var(--c-glow)" />
          <rect x="192" y="298" width="16" height="28" rx="4" fill="var(--c-gold)" />
          <ellipse
            cx="191"
            cy="298"
            rx="6"
            ry="3.5"
            transform="rotate(-25 191 298)"
            fill="var(--c-coin-shine)"
          />
        </g>
      );

    case 'mayor':
      return (
        <g>
          {/* Formal dark-lacquer haori coat over indigo */}
          <rect x="110" y="232" width="180" height="132" rx="54" fill={INK} />
          <rect
            x="110"
            y="224"
            width="180"
            height="128"
            rx="54"
            fill="color-mix(in srgb, var(--c-hud-bg) 72%, var(--c-secondary))"
          />
          <path d="M160 222 L200 272 L240 222 Z" fill={FUR} />
          {/* Diagonal crimson & gold ceremonial mayor sash */}
          <path d="M134 226 L278 344 L252 358 L116 246 Z" fill="var(--c-lacquer)" />
          <path d="M138 222 L280 338 L258 352 L120 240 Z" fill="var(--c-accent)" />
          <path
            d="M138 222 L280 338 M120 240 L258 352"
            stroke="var(--c-glow)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Gold rosette ribbon on chest */}
          <circle cx="166" cy="264" r="18" fill="var(--c-gold)" />
          <circle cx="166" cy="260" r="18" fill="var(--c-glow)" />
          <circle cx="166" cy="260" r="9" fill="var(--c-accent)" />
          <circle cx="163" cy="257" r="3.5" fill="var(--c-coin-shine)" />
          {/* Ceremonial folding fan (sensu) held at left side */}
          <g transform="translate(88 268) rotate(-18)">
            <path d="M0 44 L-44 -12 C-18 -36 26 -36 52 -12 Z" fill="var(--c-gold)" />
            <path d="M0 38 L-42 -14 C-16 -36 24 -36 50 -14 Z" fill="var(--c-glow)" />
            <path d="M0 38 L-32 -8 C-10 -24 18 -24 40 -8 Z" fill={FUR} />
            <circle cx="4" cy="-2" r="10" fill="var(--c-accent)" />
            <path
              d="M0 38 L-24 -12 M0 38 L4 -22 M0 38 L30 -12"
              stroke="var(--c-gold)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </g>
      );

    case 'sensei':
      return (
        <g>
          {/* Wooden training bokken slung across the back/left shoulder */}
          <g transform="rotate(-28 136 246)">
            <rect x="44" y="232" width="150" height="16" rx="8" fill="var(--c-gold)" />
            <rect x="44" y="228" width="150" height="14" rx="7" fill="var(--c-panel-edge)" />
            <path
              d="M56 232 H140"
              stroke="var(--c-coin-shine)"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.7"
            />
            {/* Tsuba guard & wrapped tsuka hilt */}
            <rect x="92" y="218" width="11" height="36" rx="5" fill={INK} />
            <rect x="42" y="227" width="52" height="16" rx="7" fill="var(--c-lacquer)" />
            <path
              d="M52 229 L60 241 M66 229 L74 241 M80 229 L88 241"
              stroke="var(--c-glow)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
          {/* Crisp cream keikogi jacket */}
          <rect x="114" y="226" width="172" height="78" rx="34" fill={FUR_SHADE} />
          <rect x="114" y="220" width="172" height="72" rx="32" fill={FUR} />
          <path
            d="M158 220 L200 268 L242 220"
            fill="none"
            stroke={INDIGO}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pleated indigo hakama trousers */}
          <path
            d="M108 286 H292 L302 356 C302 366 288 370 268 370 H210 L200 338 L190 370 H132 C112 370 98 366 98 356 Z"
            fill={INDIGO_SHADE}
          />
          <path
            d="M108 280 H292 L302 348 C302 358 288 362 268 362 H210 L200 332 L190 362 H132 C112 362 98 358 98 348 Z"
            fill={INDIGO}
          />
          {/* Hakama pleats */}
          <path
            d="M148 294 V352 M176 294 V344 M224 294 V344 M252 294 V352"
            stroke={INDIGO_SHADE}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Golden-vermilion obi belt & knot */}
          <rect x="110" y="274" width="180" height="20" rx="10" fill="var(--c-lacquer)" />
          <rect x="110" y="270" width="180" height="17" rx="8.5" fill="var(--c-accent)" />
          <rect x="182" y="266" width="36" height="26" rx="10" fill="var(--c-gold)" />
          <rect x="182" y="263" width="36" height="23" rx="10" fill="var(--c-glow)" />
        </g>
      );
  }
}

/** Outfit headgear & facial accessories drawn on Koto's head. */
function OutfitHead({ outfit }: { outfit: MascotOutfit }) {
  switch (outfit) {
    case 'guide':
      return (
        <g>
          {/* Festive vermilion shimenawa headband & golden suzu bell */}
          <path
            d="M84 108 Q200 126 316 108"
            stroke="var(--c-lacquer)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M84 103 Q200 121 316 103"
            stroke="var(--c-accent)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="200" cy="116" r="16" fill="var(--c-gold)" />
          <circle cx="200" cy="111" r="16" fill="var(--c-glow)" />
          <ellipse
            cx="194"
            cy="105"
            rx="6"
            ry="4"
            transform="rotate(-20 194 105)"
            fill="var(--c-coin-shine)"
          />
          <circle cx="200" cy="116" r="4" fill={INK} />
        </g>
      );

    case 'shopkeeper':
      return (
        <g>
          {/* Twisted festival hachimaki headband */}
          <path
            d="M82 104 Q200 120 318 104"
            stroke="var(--c-lacquer)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M82 100 Q200 116 318 100"
            stroke="var(--c-accent)"
            strokeWidth="13"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M86 100 Q200 116 314 100"
            stroke={FUR}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray="18 20"
            fill="none"
          />
          {/* Comically oversized fake handlebar mustache (wobbles when talking) */}
          <g className="koto-mustache">
            <path
              d="M200 182 C180 182 156 198 118 196 C82 194 56 178 60 160 C63 148 78 150 80 162 C82 172 98 178 122 176 C152 174 178 164 200 170 C222 164 248 174 278 176 C302 178 318 172 320 162 C322 150 337 148 340 160 C344 178 318 194 282 196 C244 198 220 182 200 182 Z"
              fill={INK}
            />
            <path
              d="M200 176 C180 176 156 192 118 190 C82 188 56 172 60 154 C63 142 78 144 80 156 C82 166 98 172 122 170 C152 168 178 158 200 164 C222 158 248 168 278 170 C302 172 318 166 320 156 C322 144 337 142 340 154 C344 172 318 188 282 190 C244 192 220 176 200 176 Z"
              fill="color-mix(in srgb, var(--c-hud-bg) 76%, var(--c-gold))"
            />
            <ellipse cx="144" cy="171" rx="18" ry="4.5" fill="var(--c-coin-shine)" opacity="0.3" />
            <ellipse cx="256" cy="171" rx="18" ry="4.5" fill="var(--c-coin-shine)" opacity="0.3" />
          </g>
        </g>
      );

    case 'mayor':
      return (
        <g>
          {/* Tiny ceremonial silk top-hat / eboshi perched between the ears */}
          <ellipse cx="200" cy="64" rx="64" ry="15" fill={INK} />
          <ellipse
            cx="200"
            cy="60"
            rx="64"
            ry="14"
            fill="color-mix(in srgb, var(--c-hud-bg) 78%, var(--c-secondary))"
          />
          <path
            d="M156 60 L164 12 C166 2 234 2 236 12 L244 60 Z"
            fill="color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-secondary))"
          />
          <path d="M158 58 L165 14 C167 5 233 5 235 14 L242 58 Z" fill={INK} />
          {/* Hat highlight & gold ribbon band */}
          <ellipse
            cx="184"
            cy="24"
            rx="16"
            ry="6"
            transform="rotate(-14 184 24)"
            fill="var(--c-coin-shine)"
            opacity="0.32"
          />
          <rect x="157" y="45" width="86" height="12" rx="6" fill="var(--c-gold)" />
          <rect x="157" y="43" width="86" height="10" rx="5" fill="var(--c-glow)" />
          <circle cx="200" cy="48" r="8" fill="var(--c-accent)" />
          <circle cx="198" cy="46" r="2.8" fill="var(--c-coin-shine)" />
        </g>
      );

    case 'sensei':
      return (
        <g>
          {/* Trailing hachimaki knot tails at left side of head */}
          <path d="M84 102 C56 92 42 104 38 122 C56 122 72 114 86 106 Z" fill={FUR_SHADE} />
          <path d="M84 98 C56 88 42 100 38 118 C56 118 72 110 86 102 Z" fill={FUR} />
          <path d="M86 108 C62 112 48 126 48 142 C64 138 78 126 88 112 Z" fill="var(--c-accent)" />
          {/* Crisp white dojo hachimaki headband with vermilion hinomaru */}
          <path
            d="M80 108 Q200 126 320 108"
            stroke={FUR_SHADE}
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M80 103 Q200 121 320 103"
            stroke={FUR}
            strokeWidth="17"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="200" cy="112" r="13" fill="var(--c-lacquer)" />
          <circle cx="200" cy="109" r="13" fill="var(--c-accent)" />
          <circle cx="196" cy="105" r="4" fill="var(--c-coin-shine)" opacity="0.75" />
        </g>
      );
  }
}

/** Facial expression per pose. */
function Face({ pose }: { pose: MascotPose }) {
  return (
    <g>
      {/* Rosy cheeks */}
      <ellipse
        cx="110"
        cy="176"
        rx={pose === 'cheer' ? 26 : 23}
        ry={pose === 'cheer' ? 15 : 13.5}
        fill="var(--c-petal)"
      />
      <ellipse
        cx="290"
        cy="176"
        rx={pose === 'cheer' ? 26 : 23}
        ry={pose === 'cheer' ? 15 : 13.5}
        fill="var(--c-petal)"
      />

      {/* Eyebrows for expressive poses */}
      {pose === 'think' && (
        <g stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M122 126 Q142 132 160 128" />
          <path d="M238 122 Q258 112 278 120" />
        </g>
      )}
      {pose === 'surprised' && (
        <g stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M120 120 Q142 106 164 118" />
          <path d="M236 118 Q258 106 280 120" />
        </g>
      )}
      {(pose === 'wave' || pose === 'point') && (
        <g stroke={INK} strokeWidth="6.5" strokeLinecap="round" fill="none">
          <path d="M122 124 Q142 114 162 122" />
          <path d="M238 122 Q258 114 278 124" />
        </g>
      )}

      {/* Eyes */}
      {pose === 'cheer' ? (
        <g stroke={INK} strokeWidth="10" strokeLinecap="round" fill="none">
          <path d="M120 162 Q142 134 164 162" />
          <path d="M236 162 Q258 134 280 162" />
        </g>
      ) : pose === 'sleep' ? (
        <g stroke={INK} strokeWidth="9" strokeLinecap="round" fill="none">
          <path d="M120 154 Q142 174 164 154" />
          <path d="M236 154 Q258 174 280 154" />
        </g>
      ) : pose === 'surprised' ? (
        <g>
          <ellipse cx="142" cy="154" rx="25" ry="28" fill={FUR} stroke={INK} strokeWidth="8" />
          <circle cx="142" cy="154" r="10" fill={INK} />
          <circle cx="138" cy="149" r="4" fill={FUR} />
          <ellipse cx="258" cy="154" rx="25" ry="28" fill={FUR} stroke={INK} strokeWidth="8" />
          <circle cx="258" cy="154" r="10" fill={INK} />
          <circle cx="254" cy="149" r="4" fill={FUR} />
        </g>
      ) : (
        <g className="koto-blink">
          <g
            transform={
              pose === 'think' ? 'translate(5 -5)' : pose === 'point' ? 'translate(6 0)' : undefined
            }
          >
            <ellipse cx="142" cy="156" rx="21" ry="24" fill={INK} />
            <circle cx="134" cy="146" r="8.5" fill={FUR} />
            <circle cx="149" cy="165" r="4.2" fill={FUR} />

            <ellipse cx="258" cy="156" rx="21" ry="24" fill={INK} />
            <circle cx="250" cy="146" r="8.5" fill={FUR} />
            <circle cx="265" cy="165" r="4.2" fill={FUR} />
          </g>
        </g>
      )}

      {/* Mouth */}
      {pose === 'talk' ? (
        <g className="koto-talk-mouth">
          <path d="M174 164 C174 202 226 202 226 164 Z" fill="var(--c-lacquer)" />
          <ellipse cx="200" cy="184" rx="16" ry="10" fill="var(--c-petal)" />
        </g>
      ) : pose === 'cheer' ? (
        <g>
          <path d="M170 162 C170 204 230 204 230 162 Z" fill="var(--c-lacquer)" />
          <ellipse cx="200" cy="184" rx="18" ry="11" fill="var(--c-petal)" />
        </g>
      ) : pose === 'surprised' ? (
        <ellipse
          cx="200"
          cy="178"
          rx="14"
          ry="17"
          fill="var(--c-lacquer)"
          stroke={INK}
          strokeWidth="4"
        />
      ) : pose === 'think' ? (
        <path
          d="M184 176 Q194 168 202 176 T218 174"
          stroke={INK}
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : pose === 'sleep' ? (
        <g>
          <ellipse cx="200" cy="176" rx="9" ry="7" fill="var(--c-lacquer)" />
          {/* Sleepy snot bubble */}
          <g className="koto-snot-bubble">
            <circle
              cx="236"
              cy="168"
              r="22"
              fill="var(--c-secondary-soft)"
              stroke={INDIGO}
              strokeWidth="4"
            />
            <ellipse cx="228" cy="158" rx="7" ry="4" transform="rotate(-24 228 158)" fill={FUR} />
          </g>
        </g>
      ) : (
        <g>
          <path d="M178 166 C178 196 222 196 222 166 Z" fill="var(--c-lacquer)" />
          <ellipse cx="200" cy="182" rx="14" ry="8.5" fill="var(--c-petal)" />
        </g>
      )}
    </g>
  );
}

/** Paws & pose-specific silhouette limbs. */
function Paws({ pose }: { pose: MascotPose }) {
  switch (pose) {
    case 'wave':
      return (
        <g>
          {/* Left paw resting on front */}
          <ellipse cx="106" cy="296" rx="26" ry="22" fill={FUR_SHADE} />
          <ellipse cx="106" cy="288" rx="26" ry="21" fill={FUR} />
          <ellipse
            cx="98"
            cy="280"
            rx="10"
            ry="5.5"
            transform="rotate(-20 98 280)"
            fill="var(--c-coin-shine)"
          />
          {/* Raised waving right arm + paw */}
          <g className="koto-wave-arm">
            <path
              d="M272 262 C298 250 326 218 338 178"
              stroke={FUR_SHADE}
              strokeWidth="48"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M272 256 C298 244 326 212 338 172"
              stroke={FUR}
              strokeWidth="44"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="342" cy="168" r="24" fill={FUR} />
            <ellipse cx="342" cy="172" rx="11" ry="8" fill="var(--c-petal)" />
            <circle cx="330" cy="156" r="4.5" fill="var(--c-petal)" />
            <circle cx="342" cy="152" r="4.5" fill="var(--c-petal)" />
            <circle cx="354" cy="156" r="4.5" fill="var(--c-petal)" />
            {/* Wave motion arcs */}
            <path
              d="M368 142 Q382 162 372 184 M382 148 Q394 164 386 180"
              stroke="var(--c-glow)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      );

    case 'point':
      return (
        <g>
          {/* Left paw tucked at waist */}
          <ellipse cx="106" cy="296" rx="26" ry="22" fill={FUR_SHADE} />
          <ellipse cx="106" cy="288" rx="26" ry="21" fill={FUR} />
          {/* Outstretched right arm pointing toward facing side */}
          <g className="koto-point-arm">
            <rect x="258" y="232" width="96" height="44" rx="22" fill={FUR_SHADE} />
            <rect x="258" y="224" width="96" height="42" rx="21" fill={FUR} />
            {/* Extended pointing digit */}
            <rect x="334" y="226" width="34" height="22" rx="11" fill={FUR_SHADE} />
            <rect x="334" y="222" width="34" height="20" rx="10" fill={FUR} />
            <ellipse cx="300" cy="234" rx="14" ry="5" fill="var(--c-coin-shine)" />
          </g>
          {/* Target sparkle at fingertip */}
          <g className="koto-point-spark">
            <path
              d="M374 204 L380 220 L396 226 L380 232 L374 248 L368 232 L352 226 L368 220 Z"
              fill="var(--c-glow)"
            />
            <circle cx="374" cy="226" r="5" fill="var(--c-coin-shine)" />
          </g>
        </g>
      );

    case 'talk':
      return (
        <g>
          <ellipse cx="106" cy="296" rx="26" ry="22" fill={FUR_SHADE} />
          <ellipse cx="106" cy="288" rx="26" ry="21" fill={FUR} />
          {/* Expressive gesturing right paw + speech arcs */}
          <g className="koto-talk-gesture">
            <path
              d="M276 272 C304 266 322 248 332 228"
              stroke={FUR_SHADE}
              strokeWidth="44"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M276 266 C304 260 322 242 332 222"
              stroke={FUR}
              strokeWidth="40"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="336" cy="220" rx="10" ry="7" fill="var(--c-petal)" />
          </g>
          <path
            d="M338 148 Q356 160 344 178 M354 138 Q376 156 360 184"
            stroke="var(--c-glow)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );

    case 'cheer':
      return (
        <g>
          {/* Both arms thrown high in a V celebration silhouette */}
          <path
            d="M124 256 C94 236 72 204 60 166"
            stroke={FUR_SHADE}
            strokeWidth="46"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M124 250 C94 230 72 198 60 160"
            stroke={FUR}
            strokeWidth="42"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="58" cy="158" r="22" fill={FUR} />
          <ellipse cx="58" cy="160" rx="10" ry="7.5" fill="var(--c-petal)" />

          <path
            d="M276 256 C306 236 328 204 340 166"
            stroke={FUR_SHADE}
            strokeWidth="46"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M276 250 C306 230 328 198 340 160"
            stroke={FUR}
            strokeWidth="42"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="342" cy="158" r="22" fill={FUR} />
          <ellipse cx="342" cy="160" rx="10" ry="7.5" fill="var(--c-petal)" />
        </g>
      );

    case 'think':
      return (
        <g>
          {/* Left paw crossed thoughtfully */}
          <ellipse cx="118" cy="292" rx="28" ry="22" fill={FUR_SHADE} />
          <ellipse cx="118" cy="284" rx="28" ry="21" fill={FUR} />
          {/* Right paw raised to chin */}
          <g className="koto-think-paw">
            <path
              d="M274 268 C272 238 252 214 226 204"
              stroke={FUR_SHADE}
              strokeWidth="42"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M274 262 C272 232 252 208 226 198"
              stroke={FUR}
              strokeWidth="38"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="222" cy="198" r="22" fill={FUR} />
            <ellipse
              cx="216"
              cy="192"
              rx="9"
              ry="5"
              transform="rotate(-18 216 192)"
              fill="var(--c-coin-shine)"
            />
          </g>
        </g>
      );

    case 'surprised':
      return (
        <g>
          {/* Both paws flung wide outward in shock */}
          <g transform="rotate(-24 72 258)">
            <ellipse cx="64" cy="264" rx="30" ry="22" fill={FUR_SHADE} />
            <ellipse cx="64" cy="256" rx="30" ry="21" fill={FUR} />
            <ellipse cx="64" cy="258" rx="11" ry="8" fill="var(--c-petal)" />
          </g>
          <g transform="rotate(24 328 258)">
            <ellipse cx="336" cy="264" rx="30" ry="22" fill={FUR_SHADE} />
            <ellipse cx="336" cy="256" rx="30" ry="21" fill={FUR} />
            <ellipse cx="336" cy="258" rx="11" ry="8" fill="var(--c-petal)" />
          </g>
        </g>
      );

    case 'sleep':
      return (
        <g>
          {/* Relaxed droopy paws resting low */}
          <ellipse cx="118" cy="316" rx="28" ry="20" fill={FUR_SHADE} />
          <ellipse cx="118" cy="308" rx="28" ry="19" fill={FUR} />
          <ellipse cx="282" cy="316" rx="28" ry="20" fill={FUR_SHADE} />
          <ellipse cx="282" cy="308" rx="28" ry="19" fill={FUR} />
        </g>
      );

    case 'idle':
    default:
      return (
        <g>
          <ellipse cx="106" cy="296" rx="26" ry="22" fill={FUR_SHADE} />
          <ellipse cx="106" cy="288" rx="26" ry="21" fill={FUR} />
          <ellipse
            cx="98"
            cy="280"
            rx="10"
            ry="5.5"
            transform="rotate(-20 98 280)"
            fill="var(--c-coin-shine)"
          />

          <ellipse cx="294" cy="296" rx="26" ry="22" fill={FUR_SHADE} />
          <ellipse cx="294" cy="288" rx="26" ry="21" fill={FUR} />
          <ellipse
            cx="286"
            cy="280"
            rx="10"
            ry="5.5"
            transform="rotate(-20 286 280)"
            fill="var(--c-coin-shine)"
          />
        </g>
      );
  }
}

/** Pose-specific ambient overlays (sparkles, thought "..." bubble, shock rays, sleep "Z" bubble). */
function PoseFX({ pose, facing }: { pose: MascotPose; facing: 'left' | 'right' }) {
  if (pose === 'cheer') {
    return (
      <g className="koto-cheer-sparkles">
        <path
          d="M52 78 L58 94 L74 100 L58 106 L52 122 L46 106 L30 100 L46 94 Z"
          fill="var(--c-glow)"
        />
        <path
          d="M348 72 L354 88 L370 94 L354 100 L348 116 L342 100 L326 94 L342 88 Z"
          fill="var(--c-glow)"
        />
        <circle cx="84" cy="48" r="7" fill="var(--c-accent)" />
        <circle cx="316" cy="44" r="7" fill="var(--c-petal)" />
        <circle cx="42" cy="142" r="5.5" fill="var(--c-coin-shine)" />
        <circle cx="358" cy="138" r="5.5" fill="var(--c-coin-shine)" />
      </g>
    );
  }

  if (pose === 'think') {
    return (
      <g className="koto-think-bubble">
        {/* Trail puffs */}
        <circle cx="278" cy="112" r="8" fill={FUR_SHADE} />
        <circle cx="278" cy="109" r="8" fill={FUR} />
        <circle cx="296" cy="92" r="12" fill={FUR_SHADE} />
        <circle cx="296" cy="89" r="12" fill={FUR} />
        {/* Cloud thought bubble */}
        <rect x="282" y="28" width="100" height="62" rx="31" fill={FUR_SHADE} />
        <rect
          x="282"
          y="22"
          width="100"
          height="60"
          rx="30"
          fill={FUR}
          stroke="var(--c-panel-edge)"
          strokeWidth="4"
        />
        {/* Animated "..." dots */}
        <circle className="koto-dot-1" cx="314" cy="52" r="6.5" fill={INDIGO} />
        <circle className="koto-dot-2" cx="332" cy="52" r="6.5" fill={INDIGO} />
        <circle className="koto-dot-3" cx="350" cy="52" r="6.5" fill={INDIGO} />
      </g>
    );
  }

  if (pose === 'surprised') {
    return (
      <g className="koto-surprised-rays">
        <path
          d="M144 38 L128 12 M256 38 L272 12 M96 58 L72 38 M304 58 L328 38"
          stroke="var(--c-glow)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M144 38 L128 12 M256 38 L272 12"
          stroke="var(--c-accent)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (pose === 'sleep') {
    // Keep the Z glyphs un-mirrored even when Koto faces left.
    const unflipMain = facing === 'left' ? 'translate(660 0) scale(-1 1)' : undefined;
    const unflipTrail = facing === 'left' ? 'translate(584 0) scale(-1 1)' : undefined;
    return (
      <g>
        <g className="koto-z-trail">
          <circle cx="292" cy="112" r="22" fill={FUR_SHADE} />
          <circle
            cx="292"
            cy="108"
            r="22"
            fill={FUR}
            stroke="var(--c-panel-edge)"
            strokeWidth="3.5"
          />
          <g transform={unflipTrail}>
            <path
              d="M283 100 H301 L283 116 H301"
              fill="none"
              stroke={INDIGO}
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <g className="koto-z-bubble">
          <rect x="292" y="36" width="76" height="64" rx="28" fill={FUR_SHADE} />
          <rect
            x="292"
            y="30"
            width="76"
            height="62"
            rx="28"
            fill={FUR}
            stroke="var(--c-panel-edge)"
            strokeWidth="4"
          />
          <g transform={unflipMain}>
            <path
              d="M316 48 H344 L316 74 H344"
              fill="none"
              stroke="var(--c-accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
    );
  }

  return null;
}

export function Mascot({
  pose = 'idle',
  outfit = 'guide',
  size = 120,
  facing = 'right',
  className,
}: {
  pose?: MascotPose;
  outfit?: MascotOutfit;
  size?: number;
  facing?: 'left' | 'right';
  className?: string;
}): JSX.Element {
  const classes = ['koto-mascot', `koto-pose-${pose}`, `koto-outfit-${outfit}`, className]
    .filter(Boolean)
    .join(' ');

  const openArms = pose === 'cheer' || pose === 'surprised';
  const headTilt =
    pose === 'think' ? 'rotate(-5 200 218)' : pose === 'wave' ? 'rotate(3 200 218)' : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={classes}
      role="img"
      aria-label={`Koto (${outfit}, ${pose})`}
    >
      <g transform={facing === 'left' ? 'translate(400 0) scale(-1 1)' : undefined}>
        {/* Soft ground shadow */}
        <ellipse
          className="koto-ground-shadow"
          cx="200"
          cy="384"
          rx="108"
          ry="12"
          fill="var(--c-shadow)"
        />

        {/* Floating kotodama spirit orbs */}
        <g className="koto-orb-l">
          <circle cx="54" cy="184" r="12" fill="var(--c-panel-edge)" />
          <circle cx="54" cy="180" r="12" fill="var(--c-glow)" />
          <circle cx="50" cy="176" r="4.8" fill="var(--c-coin-shine)" />
        </g>
        <g className="koto-orb-r">
          <circle cx="346" cy="172" r="10" fill="var(--c-panel-edge)" />
          <circle cx="346" cy="168" r="10" fill="var(--c-glow)" />
          <circle cx="343" cy="165" r="4" fill="var(--c-coin-shine)" />
        </g>

        {/* Main breathing character group */}
        <g className="koto-breathe">
          {/* Stubby chibi feet */}
          <g transform={pose === 'cheer' ? 'translate(0 -8)' : undefined}>
            <ellipse cx="150" cy="376" rx="28" ry="15" fill={FUR_SHADE} />
            <ellipse cx="150" cy="370" rx="28" ry="14" fill={FUR} />
            <ellipse cx="250" cy="376" rx="28" ry="15" fill={FUR_SHADE} />
            <ellipse cx="250" cy="370" rx="28" ry="14" fill={FUR} />
          </g>

          {/* Shared chibi torso */}
          <rect x="114" y="236" width="172" height="134" rx="60" fill={INDIGO_SHADE} />
          <rect x="114" y="228" width="172" height="130" rx="58" fill={INDIGO} />
          <path d="M162 228 L200 272 L238 228 Z" fill={FUR} />

          {/* Outfit torso overlay */}
          <OutfitBody outfit={outfit} openArms={openArms} />

          {/* Head + ears + spirit flame tuft */}
          <g className={pose === 'talk' ? 'koto-talk-head' : undefined}>
            <g transform={headTilt}>
              {/* Left kitsune/kotodama spirit ear */}
              <g className="koto-ear-l">
                <g transform={pose === 'sleep' ? 'rotate(-20 124 112)' : undefined}>
                  <path d="M78 134 C66 78 82 36 108 34 C132 32 156 66 162 114 Z" fill={FUR_SHADE} />
                  <path d="M78 126 C66 70 82 28 108 26 C132 24 156 58 162 106 Z" fill={FUR} />
                  <path
                    d="M76 76 C79 45 91 27 108 26 C123 25 139 42 148 70 Q112 84 76 76 Z"
                    fill="var(--c-lacquer)"
                  />
                  <path
                    d="M76 71 C79 42 91 27 108 26 C123 25 138 40 147 66 Q112 79 76 71 Z"
                    fill="var(--c-accent)"
                  />
                  <path
                    d="M96 112 C90 86 98 64 110 63 C121 62 132 80 135 104 Z"
                    fill="var(--c-petal)"
                  />
                </g>
              </g>

              {/* Right kitsune/kotodama spirit ear */}
              <g className="koto-ear-r">
                <g transform={pose === 'sleep' ? 'rotate(20 276 112)' : undefined}>
                  <path
                    d="M322 134 C334 78 318 36 292 34 C268 32 244 66 238 114 Z"
                    fill={FUR_SHADE}
                  />
                  <path d="M322 126 C334 70 318 28 292 26 C268 24 244 58 238 106 Z" fill={FUR} />
                  <path
                    d="M324 76 C321 45 309 27 292 26 C277 25 261 42 252 70 Q288 84 324 76 Z"
                    fill="var(--c-lacquer)"
                  />
                  <path
                    d="M324 71 C321 42 309 27 292 26 C277 25 262 40 253 66 Q288 79 324 71 Z"
                    fill="var(--c-accent)"
                  />
                  <path
                    d="M304 112 C310 86 302 64 290 63 C279 62 268 80 265 104 Z"
                    fill="var(--c-petal)"
                  />
                </g>
              </g>

              {/* Big round chibi mochi-spirit head with darker bottom shade bands & top-left highlight */}
              <rect x="68" y="68" width="264" height="188" rx="92" fill={FUR_SHADE} />
              <rect x="68" y="60" width="264" height="184" rx="92" fill={FUR_MID} />
              <rect x="68" y="52" width="264" height="176" rx="88" fill={FUR} />
              <ellipse
                cx="136"
                cy="84"
                rx="46"
                ry="20"
                transform="rotate(-16 136 84)"
                fill="var(--c-coin-shine)"
              />

              {/* Expressive face */}
              <Face pose={pose} />

              {/* Outfit headgear & mustache */}
              <OutfitHead outfit={outfit} />

              {/* Golden kotodama spirit flame tuft (always alive, crowns the head/hat) */}
              <g className="koto-flame">
                <path
                  d="M200 18 C226 40 230 68 200 76 C170 68 174 40 200 18 Z"
                  fill="var(--c-gold)"
                />
                <path
                  d="M200 12 C226 34 230 62 200 70 C170 62 174 34 200 12 Z"
                  fill="var(--c-glow)"
                />
                <ellipse
                  cx="195"
                  cy="44"
                  rx="9"
                  ry="14"
                  transform="rotate(-12 195 44)"
                  fill="var(--c-coin-shine)"
                />
              </g>
            </g>
          </g>

          {/* Paws & pose-specific arms */}
          <Paws pose={pose} />
        </g>

        {/* Pose-specific floating FX (sparkles, thought bubble, shock rays, Z bubble) */}
        <PoseFX pose={pose} facing={facing} />
      </g>
    </svg>
  );
}
