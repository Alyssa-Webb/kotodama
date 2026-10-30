/**
 * Toy-style 2D SVG illustrations for every consumable and charm in world/shop.json, plus a
 * fallback for unknown item IDs. Chunky rounded forms, darker bottom lips, soft top-left
 * highlights, and compositor-friendly idle animations (transform/opacity only).
 */
import type { ReactNode } from 'react';
import './art.css';

export function ItemArt({ id, size = 72 }: { id: string; size?: number }) {
  let art: ReactNode;
  switch (id) {
    case 'kotatsu':
      art = (
        <g className="item-bob">
          {/* Warm under-glow & wooden table legs */}
          <ellipse cx="40" cy="60" rx="22" ry="6" fill="var(--c-glow)" opacity="0.55" />
          <rect
            x="18"
            y="52"
            width="7"
            height="14"
            rx="3.5"
            fill="color-mix(in srgb, var(--c-gold) 65%, var(--c-hud-bg))"
          />
          <rect
            x="55"
            y="52"
            width="7"
            height="14"
            rx="3.5"
            fill="color-mix(in srgb, var(--c-gold) 65%, var(--c-hud-bg))"
          />
          {/* Quilted futon blanket (lip + main + highlight) */}
          <path
            d="M10 56 C10 38 22 31 40 31 C58 31 70 38 70 56 C70 63 62 65 55 62 C48 66 32 66 25 62 C18 65 10 63 10 56Z"
            fill="var(--c-lacquer)"
          />
          <path
            d="M10 52 C10 35 22 29 40 29 C58 29 70 35 70 52 C70 59 62 61 55 58 C48 62 32 62 25 58 C18 61 10 59 10 52Z"
            fill="var(--c-accent)"
          />
          <circle cx="24" cy="49" r="2.2" fill="var(--c-glow)" opacity="0.85" />
          <circle cx="40" cy="52" r="2.2" fill="var(--c-glow)" opacity="0.85" />
          <circle cx="56" cy="49" r="2.2" fill="var(--c-glow)" opacity="0.85" />
          {/* Wooden tabletop */}
          <rect
            x="19"
            y="25"
            width="42"
            height="12"
            rx="6"
            fill="color-mix(in srgb, var(--c-gold) 68%, var(--c-hud-bg))"
          />
          <rect x="19" y="22" width="42" height="11" rx="5.5" fill="var(--c-panel-edge)" />
          <path
            d="M25 25 H38"
            stroke="var(--c-coin-shine)"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.65"
          />
          {/* Cute mikan tangerine on top */}
          <ellipse
            cx="40"
            cy="21"
            rx="6.5"
            ry="5"
            fill="color-mix(in srgb, var(--c-accent) 55%, var(--c-glow))"
          />
          <ellipse cx="40" cy="19.5" rx="6.2" ry="4.6" fill="var(--c-glow)" />
          <circle cx="38" cy="18" r="1.4" fill="var(--c-coin-shine)" opacity="0.8" />
          <path d="M40 15 C41 12 45 12 46 15 C44 16 41 16 40 15Z" fill="var(--c-success)" />
        </g>
      );
      break;

    case 'kintsugi':
      art = (
        <g className="item-bob">
          {/* Foot ring of chawan tea bowl */}
          <rect
            x="29"
            y="58"
            width="22"
            height="8"
            rx="4"
            fill="color-mix(in srgb, var(--c-secondary) 50%, var(--c-hud-bg))"
          />
          {/* Bowl body (lip + main) */}
          <path
            d="M13 30 C13 52 24 62 40 62 C56 62 67 52 67 30 Z"
            fill="color-mix(in srgb, var(--c-secondary) 62%, var(--c-hud-bg))"
          />
          <path d="M13 26 C13 48 24 58 40 58 C56 58 67 48 67 26 Z" fill="var(--c-secondary)" />
          {/* Bowl rim */}
          <ellipse cx="40" cy="26" rx="27" ry="7.5" fill="var(--c-secondary-soft)" />
          <ellipse
            cx="40"
            cy="27"
            rx="22"
            ry="5"
            fill="color-mix(in srgb, var(--c-secondary) 75%, var(--c-hud-bg))"
          />
          {/* Ceramic gloss highlight */}
          <path
            d="M19 34 Q21 44 28 49"
            stroke="var(--c-hud-ink)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          />
          {/* Luminous Kintsugi gold seams */}
          <path
            d="M34 22 L38 35 L31 45 L39 57 M38 35 L49 41 L55 51"
            stroke="var(--c-gold)"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M34 22 L38 35 L31 45 L39 57 M38 35 L49 41 L55 51"
            stroke="var(--c-glow)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Twinkling gold glints */}
          <g className="item-glint" fill="var(--c-coin-shine)">
            <path d="M56 14 l2 4.5 4.5 2 -4.5 2 -2 4.5 -2 -4.5 -4.5 -2 4.5 -2Z" />
            <path d="M20 14 l1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 3 -1.5Z" />
            <circle cx="48" cy="39" r="2" />
          </g>
        </g>
      );
      break;

    case 'chochin':
      art = (
        <g className="item-sway">
          {/* Hanging cord & top cap */}
          <path d="M40 8 V16" stroke="var(--c-gold)" strokeWidth="3" strokeLinecap="round" />
          <rect x="29" y="14" width="22" height="6" rx="3" fill="var(--c-hud-bg)" />
          {/* Lantern body (lip + main + warm inner glow) */}
          <ellipse cx="40" cy="40" rx="22" ry="20" fill="var(--c-lacquer)" />
          <ellipse cx="40" cy="37" rx="22" ry="19" fill="var(--c-accent)" />
          <ellipse cx="40" cy="37" rx="13" ry="12" fill="var(--c-glow)" opacity="0.88" />
          <ellipse cx="40" cy="37" rx="7" ry="6.5" fill="var(--c-coin-shine)" opacity="0.75" />
          {/* Rib bands */}
          <path
            d="M20 31 Q40 26 60 31 M20 43 Q40 48 60 43"
            stroke="var(--c-lacquer)"
            strokeWidth="2.2"
            fill="none"
            opacity="0.55"
          />
          {/* Top-left gloss highlight */}
          <ellipse
            cx="29"
            cy="26"
            rx="5.5"
            ry="2.6"
            transform="rotate(-28 29 26)"
            fill="var(--c-coin-shine)"
            opacity="0.7"
          />
          {/* Bottom cap & tassel */}
          <rect x="29" y="54" width="22" height="6" rx="3" fill="var(--c-hud-bg)" />
          <path d="M40 60 V68" stroke="var(--c-glow)" strokeWidth="3.6" strokeLinecap="round" />
          <circle cx="40" cy="61" r="2.6" fill="var(--c-gold)" />
        </g>
      );
      break;

    case 'onigiri':
      art = (
        <g className="item-bob">
          {/* Rice triangle (bottom lip + main body) */}
          <path
            d="M40 16 C51 16 67 43 65 56 C63 65 52 66 40 66 C28 66 17 65 15 56 C13 43 29 16 40 16Z"
            fill="var(--c-border)"
          />
          <path
            d="M40 13 C51 13 67 40 65 52 C63 61 52 62 40 62 C28 62 17 61 15 52 C13 40 29 13 40 13Z"
            fill="var(--c-hud-ink)"
          />
          {/* Soft top-left highlight */}
          <path
            d="M28 31 Q33 21 39 19"
            stroke="var(--c-coin-shine)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          {/* Cute face */}
          <circle cx="33" cy="38" r="2.4" fill="var(--c-hud-bg)" />
          <circle cx="47" cy="38" r="2.4" fill="var(--c-hud-bg)" />
          <circle cx="32.2" cy="37.2" r="0.9" fill="var(--c-hud-ink)" />
          <circle cx="46.2" cy="37.2" r="0.9" fill="var(--c-hud-ink)" />
          <ellipse cx="29" cy="41.5" rx="3.2" ry="1.8" fill="var(--c-petal)" opacity="0.8" />
          <ellipse cx="51" cy="41.5" rx="3.2" ry="1.8" fill="var(--c-petal)" opacity="0.8" />
          <path
            d="M37.5 41 Q40 43.5 42.5 41"
            stroke="var(--c-hud-bg)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Crisp nori seaweed band at bottom */}
          <rect x="27" y="46" width="26" height="20" rx="5" fill="var(--c-hud-bg)" />
          <rect
            x="27"
            y="45"
            width="26"
            height="18"
            rx="5"
            fill="color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-success))"
          />
          <path
            d="M31 49 V58"
            stroke="var(--c-hud-ink)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
          />
        </g>
      );
      break;

    case 'taiko':
      art = (
        <g className="item-bob">
          {/* Wooden stand legs */}
          <path
            d="M24 52 L18 66 M56 52 L62 66 M24 62 H56"
            stroke="color-mix(in srgb, var(--c-gold) 68%, var(--c-hud-bg))"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path
            d="M24 50 L18 64 M56 50 L62 64"
            stroke="var(--c-panel-edge)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Drum barrel (lip + body) */}
          <ellipse cx="40" cy="41" rx="24" ry="20" fill="var(--c-lacquer)" />
          <ellipse cx="40" cy="38" rx="24" ry="19" fill="var(--c-accent)" />
          {/* Taut cream drumhead */}
          <ellipse
            cx="40"
            cy="35"
            rx="19"
            ry="15"
            fill="color-mix(in srgb, var(--c-gold) 55%, var(--c-coin-shine))"
          />
          <ellipse cx="40" cy="33.5" rx="18.5" ry="14" fill="var(--c-coin-shine)" />
          {/* Ring of gold tacks */}
          {[-14, -8, 0, 8, 14].map((dx, i) => (
            <circle
              key={i}
              cx={40 + dx}
              cy={48 + (14 - Math.abs(dx)) * 0.22}
              r="1.8"
              fill="var(--c-glow)"
            />
          ))}
          {/* Mitsudomoe drum crest */}
          <circle cx="40" cy="33" r="6.5" fill="var(--c-accent)" />
          <circle cx="40" cy="33" r="2.5" fill="var(--c-coin-shine)" />
          {/* Bachi drumsticks */}
          <rect
            x="14"
            y="16"
            width="6"
            height="22"
            rx="3"
            transform="rotate(-35 17 27)"
            fill="var(--c-glow)"
          />
          <rect
            x="60"
            y="16"
            width="6"
            height="22"
            rx="3"
            transform="rotate(35 63 27)"
            fill="var(--c-glow)"
          />
        </g>
      );
      break;

    case 'maneki':
      art = (
        <g className="item-wobble">
          {/* Body (bottom lip + main) */}
          <rect x="21" y="36" width="38" height="29" rx="15" fill="var(--c-border)" />
          <rect x="21" y="33" width="38" height="28" rx="14" fill="var(--c-hud-ink)" />
          {/* Ears */}
          <path d="M22 30 L24 13 L36 22 Z M58 30 L56 13 L44 22 Z" fill="var(--c-hud-ink)" />
          <path d="M25 27 L26 17 L33 23 Z M55 27 L54 17 L47 23 Z" fill="var(--c-accent)" />
          {/* Head (lip + main) */}
          <rect x="20" y="21" width="40" height="26" rx="13" fill="var(--c-border)" />
          <rect x="20" y="19" width="40" height="25" rx="12.5" fill="var(--c-hud-ink)" />
          {/* Red collar + gold bell */}
          <rect x="23" y="41" width="34" height="5.5" rx="2.75" fill="var(--c-accent)" />
          <circle cx="40" cy="45" r="4" fill="var(--c-gold)" />
          <circle cx="40" cy="44" r="3.6" fill="var(--c-glow)" />
          {/* Beckoning left paw */}
          <rect x="13" y="24" width="11" height="17" rx="5.5" fill="var(--c-border)" />
          <rect x="13" y="22" width="11" height="16" rx="5.5" fill="var(--c-hud-ink)" />
          <circle cx="18.5" cy="27" r="2.5" fill="var(--c-petal)" />
          {/* Golden koban coin on belly */}
          <ellipse cx="43" cy="55" rx="8" ry="10.5" fill="var(--c-gold)" />
          <ellipse cx="43" cy="54" rx="7.5" ry="9.5" fill="var(--c-glow)" />
          <rect x="40.5" y="50" width="5" height="8" rx="1" fill="var(--c-gold)" />
          {/* Face */}
          <path
            d="M29 31 Q32 27.5 35 31 M45 31 Q48 27.5 51 31"
            stroke="var(--c-hud-bg)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="40" cy="33.5" rx="2.2" ry="1.6" fill="var(--c-accent)" />
          <ellipse cx="27" cy="34.5" rx="3" ry="1.6" fill="var(--c-petal)" opacity="0.8" />
          <ellipse cx="53" cy="34.5" rx="3" ry="1.6" fill="var(--c-petal)" opacity="0.8" />
        </g>
      );
      break;

    case 'daruma':
      art = (
        <g className="item-wobble">
          {/* Roly-poly scarlet body (lip + main) */}
          <rect x="15" y="18" width="50" height="48" rx="24" fill="var(--c-lacquer)" />
          <rect x="15" y="14" width="50" height="48" rx="24" fill="var(--c-accent)" />
          {/* Top-left gloss highlight */}
          <ellipse
            cx="28"
            cy="23"
            rx="7"
            ry="3"
            transform="rotate(-25 28 23)"
            fill="var(--c-coin-shine)"
            opacity="0.6"
          />
          {/* Golden belly stripes */}
          <path
            d="M32 51 Q40 55 48 51 M29 56 Q40 60 51 56"
            stroke="var(--c-glow)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Recessed cream face */}
          <rect x="23" y="23" width="34" height="23" rx="11.5" fill="var(--c-gold)" />
          <rect x="23" y="22" width="34" height="22" rx="11" fill="var(--c-coin-shine)" />
          {/* Bold brows, eyes & cheeks */}
          <path
            d="M27 29 Q32 25 37 28 M53 29 Q48 25 43 28"
            stroke="var(--c-hud-bg)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="32.5" cy="34" r="4" fill="var(--c-hud-ink)" />
          <circle cx="32.5" cy="34" r="2.8" fill="var(--c-hud-bg)" />
          <circle cx="31.5" cy="33" r="1" fill="var(--c-hud-ink)" />
          <circle cx="47.5" cy="34" r="4" fill="var(--c-hud-ink)" />
          <circle cx="47.5" cy="34" r="2.8" fill="var(--c-hud-bg)" />
          <circle cx="46.5" cy="33" r="1" fill="var(--c-hud-ink)" />
          <path
            d="M35 40 Q40 38 45 40"
            stroke="var(--c-hud-bg)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="27" cy="38" rx="3" ry="1.8" fill="var(--c-petal)" opacity="0.85" />
          <ellipse cx="53" cy="38" rx="3" ry="1.8" fill="var(--c-petal)" opacity="0.85" />
        </g>
      );
      break;

    case 'sunadokei':
      art = (
        <g className="item-bob">
          {/* Side frame pillars */}
          <rect x="21" y="16" width="4" height="46" rx="2" fill="var(--c-panel-edge)" />
          <rect x="55" y="16" width="4" height="46" rx="2" fill="var(--c-panel-edge)" />
          {/* Glass bulbs */}
          <path
            d="M25 18 H55 C55 31 44 36 42 39 C44 42 55 47 55 60 H25 C25 47 36 42 38 39 C36 36 25 31 25 18Z"
            fill="var(--c-secondary-soft)"
          />
          {/* Golden sand in top & bottom bulbs + trickling stream */}
          <path d="M29 27 H51 C49 33 43 36 40 38 C37 36 31 33 29 27Z" fill="var(--c-glow)" />
          <line
            x1="40"
            y1="37"
            x2="40"
            y2="55"
            stroke="var(--c-glow)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path d="M27 59 C29 51 35 48 40 48 C45 48 51 51 53 59 Z" fill="var(--c-glow)" />
          {/* Glass highlights */}
          <path
            d="M29 22 Q29 29 34 33 M29 54 Q29 48 34 44"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
          {/* Top & bottom wooden/gold caps */}
          <rect
            x="17"
            y="14"
            width="46"
            height="7"
            rx="3.5"
            fill="color-mix(in srgb, var(--c-gold) 65%, var(--c-hud-bg))"
          />
          <rect x="17" y="12" width="46" height="6.5" rx="3.2" fill="var(--c-glow)" />
          <rect
            x="17"
            y="59"
            width="46"
            height="7"
            rx="3.5"
            fill="color-mix(in srgb, var(--c-gold) 65%, var(--c-hud-bg))"
          />
          <rect x="17" y="57" width="46" height="6.5" rx="3.2" fill="var(--c-glow)" />
          <g className="item-glint" fill="var(--c-coin-shine)">
            <path d="M62 24 l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8Z" />
          </g>
        </g>
      );
      break;

    case 'omamori':
      art = (
        <g className="item-sway">
          {/* Hanging cord loop */}
          <circle cx="40" cy="14" r="5" stroke="var(--c-accent)" strokeWidth="3" fill="none" />
          {/* Brocade pouch (bottom lip + main body) */}
          <path
            d="M30 20 H50 L58 31 V59 C58 63 55 66 51 66 H29 C25 66 22 63 22 59 V31 Z"
            fill="color-mix(in srgb, var(--c-secondary) 58%, var(--c-hud-bg))"
          />
          <path
            d="M30 17 H50 L58 28 V55 C58 59 55 62 51 62 H29 C25 62 22 59 22 55 V28 Z"
            fill="var(--c-secondary)"
          />
          {/* Top-left gloss highlight */}
          <path
            d="M26 30 L32 22"
            stroke="var(--c-hud-ink)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.45"
          />
          {/* Agemaki bow knot at neck */}
          <path
            d="M31 25 C25 21 25 29 33 27 L40 25 L47 27 C55 29 55 21 49 25"
            stroke="var(--c-glow)"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="40" cy="25" r="3.4" fill="var(--c-accent)" />
          {/* Central emblem strip & sakura dots */}
          <rect x="34" y="32" width="12" height="23" rx="3" fill="var(--c-glow)" />
          <rect x="35.5" y="33.5" width="9" height="20" rx="2" fill="var(--c-hud-ink)" />
          <circle cx="40" cy="43.5" r="3" fill="var(--c-accent)" />
          <circle cx="28" cy="42" r="2.2" fill="var(--c-petal)" />
          <circle cx="52" cy="48" r="2.2" fill="var(--c-petal)" />
        </g>
      );
      break;

    case 'ema':
      art = (
        <g className="item-sway">
          {/* Hanging red cord */}
          <path
            d="M33 22 L40 11 L47 22"
            stroke="var(--c-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Pentagon wooden plaque (bottom lip + wood face) */}
          <path
            d="M40 19 L66 33 V59 C66 62 63 65 60 65 H20 C17 65 14 62 14 59 V33 Z"
            fill="color-mix(in srgb, var(--c-gold) 70%, var(--c-hud-bg))"
          />
          <path
            d="M40 16 L66 30 V55 C66 58 63 61 60 61 H20 C17 61 14 58 14 55 V30 Z"
            fill="var(--c-coin-shine)"
          />
          {/* Pitched dark roof eaves */}
          <path d="M11 32 L40 15 L69 32 L66 36 L40 21 L14 36 Z" fill="var(--c-lacquer)" />
          {/* Painted sakura blossom & rising sun motif */}
          <circle cx="48" cy="45" r="8" fill="var(--c-accent)" opacity="0.88" />
          <circle cx="31" cy="44" r="5.5" fill="var(--c-petal)" />
          <circle cx="31" cy="44" r="2.2" fill="var(--c-glow)" />
          <path
            d="M23 53 Q40 49 57 53"
            stroke="var(--c-gold)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
      break;

    case 'gakugyo':
      art = (
        <g className="item-sway">
          <circle cx="40" cy="13" r="4.5" stroke="var(--c-glow)" strokeWidth="3" fill="none" />
          <path
            d="M29 19 H51 L59 30 V59 C59 63 56 66 52 66 H28 C24 66 21 63 21 59 V30 Z"
            fill="color-mix(in srgb, var(--c-secondary) 55%, var(--c-hud-bg))"
          />
          <path
            d="M29 16 H51 L59 27 V55 C59 59 56 62 52 62 H28 C24 62 21 59 21 55 V27 Z"
            fill="var(--c-secondary)"
          />
          <path
            d="M31 20 H49 L55 28 V53 H25 V28 Z"
            stroke="var(--c-glow)"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
          <circle cx="40" cy="24" r="3.5" fill="var(--c-glow)" />
          {/* Golden open book / scroll emblem */}
          <path
            d="M29 36 Q34.5 33 40 36 Q45.5 33 51 36 V49 Q45.5 46 40 49 Q34.5 46 29 49 Z"
            fill="var(--c-coin-shine)"
          />
          <line x1="40" y1="36" x2="40" y2="49" stroke="var(--c-gold)" strokeWidth="2.2" />
          <g className="item-glint" fill="var(--c-glow)">
            <path d="M62 18 l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8Z" />
          </g>
        </g>
      );
      break;

    case 'goukaku':
      art = (
        <g className="item-bob">
          <circle cx="40" cy="13" r="4.5" stroke="var(--c-glow)" strokeWidth="3" fill="none" />
          {/* Five-sided (Gokaku) crimson & gold victory charm */}
          <path d="M40 18 L61 32 L53 64 H27 L19 32 Z" fill="var(--c-lacquer)" />
          <path d="M40 15 L61 29 L53 60 H27 L19 29 Z" fill="var(--c-accent)" />
          <path
            d="M40 20 L56 31 L50 55 H30 L24 31 Z"
            stroke="var(--c-glow)"
            strokeWidth="2.4"
            fill="none"
          />
          {/* Golden victory star / sakura crest */}
          <path
            d="M40 28 l3.2 6.6 7.2 1 -5.2 5 1.2 7.2 -6.4 -3.4 -6.4 3.4 1.2 -7.2 -5.2 -5 7.2 -1 Z"
            fill="var(--c-glow)"
          />
          <circle cx="40" cy="39" r="3" fill="var(--c-coin-shine)" />
          <g className="item-glint" fill="var(--c-coin-shine)">
            <path d="M16 16 l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8Z" />
          </g>
        </g>
      );
      break;

    case 'mimi':
      art = (
        <g className="item-sway">
          <circle cx="40" cy="13" r="4.5" stroke="var(--c-accent)" strokeWidth="3" fill="none" />
          <path
            d="M29 19 H51 L59 30 V59 C59 63 56 66 52 66 H28 C24 66 21 63 21 59 V30 Z"
            fill="color-mix(in srgb, var(--c-success) 55%, var(--c-hud-bg))"
          />
          <path
            d="M29 16 H51 L59 27 V55 C59 59 56 62 52 62 H28 C24 62 21 59 21 55 V27 Z"
            fill="var(--c-success)"
          />
          <circle cx="40" cy="24" r="3.5" fill="var(--c-accent)" />
          {/* Golden suzu bell & sound waves */}
          <circle cx="40" cy="43" r="8" fill="var(--c-gold)" />
          <circle cx="40" cy="41.5" r="7.5" fill="var(--c-glow)" />
          <rect x="35" y="43" width="10" height="2.4" rx="1.2" fill="var(--c-hud-bg)" />
          <circle cx="40" cy="46" r="2" fill="var(--c-hud-bg)" />
          <path
            d="M27 36 Q23 42 27 48 M53 36 Q57 42 53 48"
            stroke="var(--c-coin-shine)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
      break;

    case 'fude':
      art = (
        <g className="item-sway">
          <circle cx="40" cy="13" r="4.5" stroke="var(--c-glow)" strokeWidth="3" fill="none" />
          <path
            d="M29 19 H51 L59 30 V59 C59 63 56 66 52 66 H28 C24 66 21 63 21 59 V30 Z"
            fill="var(--c-hud-bg)"
          />
          <path
            d="M29 16 H51 L59 27 V55 C59 59 56 62 52 62 H28 C24 62 21 59 21 55 V27 Z"
            fill="color-mix(in srgb, var(--c-lacquer) 65%, var(--c-secondary))"
          />
          <path
            d="M31 20 H49 L55 28 V53 H25 V28 Z"
            stroke="var(--c-glow)"
            strokeWidth="2"
            fill="none"
            opacity="0.65"
          />
          {/* Crossed golden brush & vermilion seal */}
          <circle cx="40" cy="42" r="9" fill="var(--c-accent)" />
          <g transform="rotate(30 40 42)">
            <rect x="37.5" y="26" width="5" height="22" rx="2.5" fill="var(--c-glow)" />
            <path d="M36.5 47 C36 53 38 57 40 59 C42 57 44 53 43.5 47 Z" fill="var(--c-hud-ink)" />
            <path
              d="M37.5 52 C37.5 56 39 58 40 59 C41 58 42.5 56 42.5 52 Z"
              fill="var(--c-hud-bg)"
            />
          </g>
          <g className="item-glint" fill="var(--c-coin-shine)">
            <path d="M62 18 l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8Z" />
          </g>
        </g>
      );
      break;

    default:
      art = (
        <g className="item-bob">
          {/* Fallback furoshiki wrapped treasure bundle */}
          <path d="M26 24 C20 14 32 12 38 22 M54 24 C60 14 48 12 42 22" fill="var(--c-accent)" />
          <rect x="18" y="28" width="44" height="36" rx="16" fill="var(--c-lacquer)" />
          <rect x="18" y="24" width="44" height="36" rx="16" fill="var(--c-accent)" />
          <circle cx="40" cy="24" r="5" fill="var(--c-glow)" />
          <circle cx="30" cy="40" r="3" fill="var(--c-coin-shine)" opacity="0.85" />
          <circle cx="50" cy="42" r="3" fill="var(--c-coin-shine)" opacity="0.85" />
          <circle cx="40" cy="51" r="3" fill="var(--c-coin-shine)" opacity="0.85" />
        </g>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className="item-art"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="40" cy="71" rx="22" ry="4.5" fill="var(--c-shadow)" />
      {art}
    </svg>
  );
}
