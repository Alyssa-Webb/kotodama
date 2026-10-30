/**
 * Chibi 2D SVG dish symbols for every stall on Food Street (world/meals.json), plus a covered-bowl
 * fallback for unknown meal IDs. Built to match ItemArt: 0 0 80 80 viewBox, +3 darker bottom shade
 * lips, soft top-left highlights, theme CSS variables only, and transform/opacity idle motion.
 */
import type { ReactNode } from 'react';
import './art.css';

export function MealArt({ id, size = 72 }: { id: string; size?: number }) {
  let art: ReactNode;
  switch (id) {
    case 'onigiri':
      art = (
        <g className="item-bob">
          {/* Plump rice ball triangle (bottom +3 lip + main rice body) */}
          <path
            d="M40 15 C52 15 68 42 66 56 C64 65 52 66 40 66 C28 66 16 65 14 56 C12 42 28 15 40 15Z"
            fill="color-mix(in srgb, var(--c-hud-ink) 70%, var(--c-hud-bg))"
          />
          <path
            d="M40 12 C52 12 68 39 66 53 C64 62 52 63 40 63 C28 63 16 62 14 53 C12 39 28 12 40 12Z"
            fill="var(--c-hud-ink)"
          />
          {/* Top-left soft highlight */}
          <ellipse
            cx="31"
            cy="24"
            rx="7.5"
            ry="3"
            transform="rotate(-24 31 24)"
            fill="var(--c-coin-shine)"
            opacity="0.42"
          />
          {/* Pickled umeboshi plum peek at the crown */}
          <ellipse cx="40" cy="21" rx="5.2" ry="3.8" fill="var(--c-lacquer)" />
          <ellipse cx="40" cy="19.5" rx="5" ry="3.5" fill="var(--c-accent)" />
          <circle cx="38.5" cy="18.5" r="1.2" fill="var(--c-coin-shine)" opacity="0.65" />
          {/* Toasted golden sesame flecks */}
          <ellipse
            cx="26"
            cy="35"
            rx="1.6"
            ry="1"
            transform="rotate(-20 26 35)"
            fill="var(--c-glow)"
          />
          <ellipse
            cx="53"
            cy="33"
            rx="1.6"
            ry="1"
            transform="rotate(25 53 33)"
            fill="var(--c-glow)"
          />
          {/* Chibi two-catchlight eyes, blush & smile */}
          <ellipse cx="32.5" cy="37.5" rx="2.8" ry="3.1" fill="var(--c-hud-bg)" />
          <circle cx="31.5" cy="36.3" r="1.1" fill="var(--c-hud-ink)" />
          <circle cx="33.5" cy="38.8" r="0.55" fill="var(--c-hud-ink)" />
          <ellipse cx="47.5" cy="37.5" rx="2.8" ry="3.1" fill="var(--c-hud-bg)" />
          <circle cx="46.5" cy="36.3" r="1.1" fill="var(--c-hud-ink)" />
          <circle cx="48.5" cy="38.8" r="0.55" fill="var(--c-hud-ink)" />
          <ellipse cx="27.5" cy="40.5" rx="3.4" ry="1.9" fill="var(--c-petal)" opacity="0.78" />
          <ellipse cx="52.5" cy="40.5" rx="3.4" ry="1.9" fill="var(--c-petal)" opacity="0.78" />
          <path
            d="M37.5 40.2 Q40 42.8 42.5 40.2"
            stroke="var(--c-hud-bg)"
            strokeWidth="2.1"
            strokeLinecap="round"
            fill="none"
          />
          {/* Crisp nori seaweed band (+3 lip + main + highlight) */}
          <rect x="26" y="46" width="28" height="20" rx="5.5" fill="var(--c-hud-bg)" />
          <rect
            x="26"
            y="43"
            width="28"
            height="20"
            rx="5.5"
            fill="color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-success))"
          />
          <ellipse
            cx="32"
            cy="48"
            rx="4.5"
            ry="1.8"
            transform="rotate(-15 32 48)"
            fill="var(--c-hud-ink)"
            opacity="0.38"
          />
        </g>
      );
      break;

    case 'misoshiru':
      art = (
        <g className="item-bob">
          {/* Rising steam wisps */}
          <path
            className="meal-steam"
            d="M32 22 C29 17 35 13 32 8"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            className="meal-steam meal-steam-2"
            d="M48 20 C45 15 51 11 48 6"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Bowl foot ring (+3 lip + main) */}
          <rect
            x="27"
            y="59"
            width="26"
            height="8"
            rx="4"
            fill="color-mix(in srgb, var(--c-lacquer) 65%, var(--c-hud-bg))"
          />
          <rect x="27" y="56" width="26" height="8" rx="4" fill="var(--c-lacquer)" />
          {/* Lacquer bowl body (+3 lip + main) */}
          <path
            d="M12 35 C12 55 23 63 40 63 C57 63 68 55 68 35 Z"
            fill="color-mix(in srgb, var(--c-lacquer) 72%, var(--c-hud-bg))"
          />
          <path d="M12 32 C12 52 23 60 40 60 C57 60 68 52 68 32 Z" fill="var(--c-accent)" />
          {/* Gold lacquer rim stripe & wave motif */}
          <path
            d="M31 51 Q40 47 49 51"
            stroke="var(--c-glow)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="40" cy="46" r="2.2" fill="var(--c-glow)" />
          {/* Top-left bowl highlight */}
          <ellipse
            cx="23"
            cy="43"
            rx="6.5"
            ry="2.6"
            transform="rotate(24 23 43)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
          {/* Dark lacquer rim & warm miso broth */}
          <ellipse cx="40" cy="32" rx="28" ry="10.5" fill="var(--c-lacquer)" />
          <ellipse
            cx="40"
            cy="32.5"
            rx="25"
            ry="8.5"
            fill="color-mix(in srgb, var(--c-gold) 68%, var(--c-glow))"
          />
          <ellipse cx="38" cy="31.5" rx="18" ry="5.5" fill="var(--c-glow)" opacity="0.55" />
          {/* Wakame seaweed ribbons */}
          <path
            d="M22 33 C25 29 30 31 32 35 C28 37 24 36 22 33Z M47 35 C50 31 56 31 58 34 C54 37 50 37 47 35Z"
            fill="color-mix(in srgb, var(--c-success) 62%, var(--c-hud-bg))"
          />
          <path
            d="M22 31.5 C25 27.5 30 29.5 32 33.5 C28 35.5 24 34.5 22 31.5Z M47 33.5 C50 29.5 56 29.5 58 32.5 C54 35.5 50 35.5 47 33.5Z"
            fill="var(--c-success)"
          />
          {/* Chibi white tofu cubes (+3 lip + main) */}
          <rect
            x="29"
            y="28.5"
            width="9.5"
            height="7.5"
            rx="2.4"
            transform="rotate(-8 33.5 32)"
            fill="color-mix(in srgb, var(--c-hud-ink) 70%, var(--c-gold))"
          />
          <rect
            x="29"
            y="26.5"
            width="9.5"
            height="7.5"
            rx="2.4"
            transform="rotate(-8 33.5 30)"
            fill="var(--c-hud-ink)"
          />
          <rect
            x="42"
            y="27.5"
            width="8.5"
            height="7"
            rx="2.2"
            transform="rotate(10 46 31)"
            fill="color-mix(in srgb, var(--c-hud-ink) 70%, var(--c-gold))"
          />
          <rect
            x="42"
            y="25.5"
            width="8.5"
            height="7"
            rx="2.2"
            transform="rotate(10 46 29)"
            fill="var(--c-hud-ink)"
          />
          {/* Scallion rings */}
          <circle cx="38" cy="36" r="2.2" fill="var(--c-success)" />
          <circle cx="38" cy="36" r="0.9" fill="var(--c-coin-shine)" />
        </g>
      );
      break;

    case 'dango':
      art = (
        <g className="item-bob">
          {/* Bamboo skewer stick (+3 lip + main) */}
          <path
            d="M14 65 L64 15"
            stroke="color-mix(in srgb, var(--c-gold) 62%, var(--c-hud-bg))"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M14 63 L64 13"
            stroke="var(--c-panel-edge)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Green yomogi dango at bottom-left (+3 lip + main + highlight) */}
          <circle
            cx="26"
            cy="55"
            r="11.5"
            fill="color-mix(in srgb, var(--c-success) 60%, var(--c-hud-bg))"
          />
          <circle cx="26" cy="52" r="11.5" fill="var(--c-success)" />
          <ellipse
            cx="21.5"
            cy="47"
            rx="4.2"
            ry="2"
            transform="rotate(-24 21.5 47)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
          {/* White sweet-rice dango in middle (+3 lip + main + highlight + chibi face) */}
          <circle
            cx="39"
            cy="42"
            r="12"
            fill="color-mix(in srgb, var(--c-hud-ink) 72%, var(--c-hud-bg))"
          />
          <circle cx="39" cy="39" r="12" fill="var(--c-hud-ink)" />
          <ellipse
            cx="34"
            cy="33.5"
            rx="4.5"
            ry="2.1"
            transform="rotate(-24 34 33.5)"
            fill="var(--c-coin-shine)"
            opacity="0.45"
          />
          <circle cx="35" cy="39.5" r="1.9" fill="var(--c-hud-bg)" />
          <circle cx="34.4" cy="38.8" r="0.75" fill="var(--c-hud-ink)" />
          <circle cx="43" cy="39.5" r="1.9" fill="var(--c-hud-bg)" />
          <circle cx="42.4" cy="38.8" r="0.75" fill="var(--c-hud-ink)" />
          <ellipse cx="32" cy="41.8" rx="2.2" ry="1.2" fill="var(--c-petal)" opacity="0.8" />
          <ellipse cx="46" cy="41.8" rx="2.2" ry="1.2" fill="var(--c-petal)" opacity="0.8" />
          <path
            d="M37 41.5 Q39 43.3 41 41.5"
            stroke="var(--c-hud-bg)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Pink sakura dango at top-right (+3 lip + main + highlight) */}
          <circle
            cx="52"
            cy="29"
            r="11.5"
            fill="color-mix(in srgb, var(--c-petal) 64%, var(--c-hud-bg))"
          />
          <circle cx="52" cy="26" r="11.5" fill="var(--c-petal)" />
          <ellipse
            cx="47.5"
            cy="21"
            rx="4.2"
            ry="2"
            transform="rotate(-24 47.5 21)"
            fill="var(--c-hud-ink)"
            opacity="0.42"
          />
        </g>
      );
      break;

    case 'gyudon':
      art = (
        <g className="item-bob">
          {/* Steam wisps */}
          <path
            className="meal-steam"
            d="M31 19 C28 14 34 10 31 5"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            className="meal-steam meal-steam-2"
            d="M49 18 C46 13 52 9 49 4"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Donburi foot ring */}
          <rect
            x="26"
            y="59"
            width="28"
            height="8"
            rx="4"
            fill="color-mix(in srgb, var(--c-secondary) 55%, var(--c-hud-bg))"
          />
          <rect x="26" y="56" width="28" height="8" rx="4" fill="var(--c-secondary)" />
          {/* Porcelain donburi bowl (+3 lip + main) */}
          <path
            d="M10 36 C10 56 22 63 40 63 C58 63 70 56 70 36 Z"
            fill="color-mix(in srgb, var(--c-secondary) 62%, var(--c-hud-bg))"
          />
          <path d="M10 33 C10 53 22 60 40 60 C58 60 70 53 70 33 Z" fill="var(--c-secondary)" />
          {/* Gold decorative band & top-left highlight */}
          <path
            d="M15 43 Q40 49 65 43"
            stroke="var(--c-glow)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx="22"
            cy="46"
            rx="6"
            ry="2.5"
            transform="rotate(24 22 46)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
          {/* Bowl rim & fluffy white rice bed */}
          <ellipse cx="40" cy="33" rx="30" ry="11" fill="var(--c-hud-ink)" />
          <ellipse
            cx="40"
            cy="33"
            rx="27"
            ry="9"
            fill="color-mix(in srgb, var(--c-hud-ink) 80%, var(--c-gold))"
          />
          <circle cx="23" cy="31" r="6" fill="var(--c-hud-ink)" />
          {/* Simmered beef ribbons (+3 lip + main) */}
          <path
            d="M18 35 C18 25 29 22 42 22 C56 22 65 26 64 35 C63 41 52 43 40 43 C27 43 18 40 18 35Z"
            fill="color-mix(in srgb, var(--c-lacquer) 68%, var(--c-hud-bg))"
          />
          <path
            d="M18 32 C18 22 29 19 42 19 C56 19 65 23 64 32 C63 38 52 40 40 40 C27 40 18 37 18 32Z"
            fill="color-mix(in srgb, var(--c-gold) 70%, var(--c-lacquer))"
          />
          {/* Savoury beef folds & caramelized onion crescents */}
          <path
            d="M24 31 Q31 26 38 32 M42 28 Q50 24 58 31 M29 36 Q40 32 52 36"
            stroke="color-mix(in srgb, var(--c-lacquer) 65%, var(--c-hud-bg))"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M26 28 Q32 24 37 28 M45 33 Q51 29 56 33"
            stroke="var(--c-glow)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Bright red beni-shoga pickled ginger crown (+3 lip + main) */}
          <ellipse cx="40" cy="27.5" rx="7.5" ry="5" fill="var(--c-lacquer)" />
          <ellipse cx="40" cy="25" rx="7.5" ry="5" fill="var(--c-accent)" />
          <path
            d="M36 24 L41 22 M38 27 L44 25"
            stroke="var(--c-petal)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Green scallion flecks */}
          <circle cx="30" cy="33" r="2.2" fill="var(--c-success)" />
          <circle cx="51" cy="28" r="2.2" fill="var(--c-success)" />
        </g>
      );
      break;

    case 'udon':
      art = (
        <g className="item-bob">
          {/* Steam wisps */}
          <path
            className="meal-steam"
            d="M30 20 C27 15 33 11 30 6"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            className="meal-steam meal-steam-2"
            d="M50 19 C47 14 53 10 50 5"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Foot ring */}
          <rect x="26" y="59" width="28" height="8" rx="4" fill="var(--c-hud-bg)" />
          <rect
            x="26"
            y="56"
            width="28"
            height="8"
            rx="4"
            fill="color-mix(in srgb, var(--c-hud-bg) 80%, var(--c-lacquer))"
          />
          {/* Thick ceramic bowl (+3 lip + main) */}
          <path d="M10 35 C10 56 22 63 40 63 C58 63 70 56 70 35 Z" fill="var(--c-hud-bg)" />
          <path
            d="M10 32 C10 53 22 60 40 60 C58 60 70 53 70 32 Z"
            fill="color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-lacquer))"
          />
          <ellipse
            cx="23"
            cy="45"
            rx="6.5"
            ry="2.5"
            transform="rotate(24 23 45)"
            fill="var(--c-hud-ink)"
            opacity="0.38"
          />
          {/* Vermilion inner rim & golden dashi broth */}
          <ellipse cx="40" cy="32" rx="30" ry="11.5" fill="var(--c-accent)" />
          <ellipse
            cx="40"
            cy="32.5"
            rx="26.5"
            ry="9.2"
            fill="color-mix(in srgb, var(--c-gold) 62%, var(--c-glow))"
          />
          {/* Thick chewy white udon noodles (+3 lip + main) */}
          <path
            d="M20 34 Q30 28 40 34 T60 33 M23 38 Q35 33 48 38"
            stroke="color-mix(in srgb, var(--c-hud-ink) 70%, var(--c-gold))"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M20 31.5 Q30 25.5 40 31.5 T60 30.5 M23 35.5 Q35 30.5 48 35.5"
            stroke="var(--c-hud-ink)"
            strokeWidth="5.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Pink-rimmed kamaboko fish cake slice (+3 lip + pink arch + white center) */}
          <path
            d="M36 29 C36 19 54 19 54 29 Z"
            fill="color-mix(in srgb, var(--c-petal) 65%, var(--c-hud-bg))"
          />
          <path d="M36 26.5 C36 16.5 54 16.5 54 26.5 Z" fill="var(--c-petal)" />
          <path d="M39 26.5 C39 20 51 20 51 26.5 Z" fill="var(--c-hud-ink)" />
          {/* Golden tempura puff & green scallions */}
          <circle cx="27" cy="27" r="4.5" fill="var(--c-gold)" />
          <circle cx="27" cy="25.5" r="4.5" fill="var(--c-glow)" />
          <circle cx="33" cy="35" r="2.6" fill="var(--c-success)" />
          <circle cx="48" cy="34" r="2.4" fill="var(--c-success)" />
          <circle cx="42" cy="30" r="2.2" fill="var(--c-success)" />
        </g>
      );
      break;

    case 'ramen':
      art = (
        <g className="item-bob">
          {/* Steam wisps */}
          <path
            className="meal-steam"
            d="M26 18 C23 13 29 9 26 4"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            className="meal-steam meal-steam-2"
            d="M42 16 C39 11 45 7 42 2"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Upright nori sheet tucked at back-right (+3 lip + main) */}
          <rect
            x="47"
            y="14"
            width="16"
            height="20"
            rx="3.5"
            transform="rotate(12 55 24)"
            fill="var(--c-hud-bg)"
          />
          <rect
            x="47"
            y="12"
            width="16"
            height="20"
            rx="3.5"
            transform="rotate(12 55 22)"
            fill="color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-success))"
          />
          {/* Foot ring */}
          <rect
            x="26"
            y="59"
            width="28"
            height="8"
            rx="4"
            fill="color-mix(in srgb, var(--c-lacquer) 65%, var(--c-hud-bg))"
          />
          <rect x="26" y="56" width="28" height="8" rx="4" fill="var(--c-lacquer)" />
          {/* Classic red chuka ramen bowl (+3 lip + main) */}
          <path
            d="M9 36 C9 56 22 63 40 63 C58 63 71 56 71 36 Z"
            fill="color-mix(in srgb, var(--c-lacquer) 72%, var(--c-hud-bg))"
          />
          <path d="M9 33 C9 53 22 60 40 60 C58 60 71 53 71 33 Z" fill="var(--c-accent)" />
          {/* Golden thunder-scroll rim band & highlight */}
          <path
            d="M14 42 Q40 48 66 42"
            stroke="var(--c-glow)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx="22"
            cy="46"
            rx="6.5"
            ry="2.6"
            transform="rotate(24 22 46)"
            fill="var(--c-hud-ink)"
            opacity="0.4"
          />
          {/* Bowl rim & rich golden broth */}
          <ellipse cx="40" cy="33" rx="31" ry="11.5" fill="var(--c-hud-ink)" />
          <ellipse
            cx="40"
            cy="33.5"
            rx="28"
            ry="9.5"
            fill="color-mix(in srgb, var(--c-gold) 65%, var(--c-glow))"
          />
          {/* Wavy golden ramen noodles */}
          <path
            d="M20 35 Q26 31 32 35 T44 35 T56 34 M25 38 Q33 35 41 38 T55 37"
            stroke="var(--c-glow)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Braised chashu pork slice on left (+3 lip + main + spiral) */}
          <ellipse
            cx="25"
            cy="32"
            rx="9.5"
            ry="6.5"
            fill="color-mix(in srgb, var(--c-lacquer) 70%, var(--c-hud-bg))"
          />
          <ellipse
            cx="25"
            cy="29.5"
            rx="9.5"
            ry="6.5"
            fill="color-mix(in srgb, var(--c-accent) 62%, var(--c-gold))"
          />
          <path
            d="M21 29.5 C21 26.5 29 26.5 29 29.5 C29 31.5 23 31.5 23 29.5"
            stroke="var(--c-petal)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Ajitama soft-boiled egg half on right (+3 lip + white + jammy yolk) */}
          <ellipse
            cx="52"
            cy="33"
            rx="7.5"
            ry="5.8"
            fill="color-mix(in srgb, var(--c-hud-ink) 70%, var(--c-gold))"
          />
          <ellipse cx="52" cy="30.5" rx="7.5" ry="5.8" fill="var(--c-hud-ink)" />
          <ellipse cx="52" cy="30.5" rx="4.2" ry="3.2" fill="var(--c-accent)" />
          <circle cx="50.8" cy="29.5" r="1.2" fill="var(--c-glow)" />
          {/* Naruto fish cake in center (+3 lip + white disc + pink swirl) */}
          <circle
            cx="38"
            cy="29.5"
            r="6"
            fill="color-mix(in srgb, var(--c-hud-ink) 72%, var(--c-gold))"
          />
          <circle cx="38" cy="27.5" r="6" fill="var(--c-hud-ink)" />
          <path
            d="M38 27.5 C39.8 27.5 40.5 25.5 38.5 25 C36 24.5 35 27.5 37.5 29.5 C39.5 31 41.5 29 41.5 27.5"
            stroke="var(--c-accent)"
            strokeWidth="1.9"
            strokeLinecap="round"
            fill="none"
          />
          {/* Green scallions */}
          <circle cx="35" cy="37" r="2.2" fill="var(--c-success)" />
          <circle cx="43" cy="36" r="2" fill="var(--c-success)" />
        </g>
      );
      break;

    case 'tonkatsu':
      art = (
        <g className="item-bob">
          {/* Wisp of steam over the miso cup */}
          <path
            className="meal-steam"
            d="M60 19 C58 15 62 12 60 8"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Wooden teishoku tray (+3 lip + outer frame + inner mat) */}
          <rect x="7" y="25" width="66" height="42" rx="9" fill="var(--c-hud-bg)" />
          <rect x="7" y="22" width="66" height="42" rx="9" fill="var(--c-lacquer)" />
          <rect
            x="11"
            y="26"
            width="58"
            height="34"
            rx="6"
            fill="color-mix(in srgb, var(--c-hud-bg) 86%, var(--c-gold))"
          />
          {/* Main ceramic plate on left (+3 lip + plate) */}
          <ellipse
            cx="31"
            cy="43"
            rx="18.5"
            ry="13.5"
            fill="color-mix(in srgb, var(--c-hud-ink) 68%, var(--c-hud-bg))"
          />
          <ellipse cx="31" cy="40.5" rx="18.5" ry="13.5" fill="var(--c-hud-ink)" />
          {/* Shredded green cabbage mound (+3 lip + main) */}
          <ellipse
            cx="24"
            cy="36"
            rx="9"
            ry="6"
            fill="color-mix(in srgb, var(--c-success) 62%, var(--c-hud-bg))"
          />
          <ellipse cx="24" cy="34" rx="9" ry="6" fill="var(--c-success)" />
          <path
            d="M19 33 Q24 30 29 34"
            stroke="var(--c-success-soft)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Sliced golden tonkatsu cutlet (+3 lip + crispy panko crust + sauce) */}
          <ellipse
            cx="33"
            cy="44.5"
            rx="13.5"
            ry="7.5"
            fill="color-mix(in srgb, var(--c-gold) 65%, var(--c-hud-bg))"
          />
          <ellipse cx="33" cy="42" rx="13.5" ry="7.5" fill="var(--c-glow)" />
          {/* Cutlet slice dividers */}
          <path
            d="M26 35.5 L24 48.5 M31 34.5 L29.5 49 M36 34.5 L35 49 M41 35.5 L40 48.5"
            stroke="color-mix(in srgb, var(--c-gold) 70%, var(--c-hud-bg))"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Rich tonkatsu sauce ribbon & highlight */}
          <path
            d="M22 41 Q28 44 33 41 T43 42"
            stroke="var(--c-lacquer)"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx="26"
            cy="39"
            rx="4"
            ry="1.4"
            transform="rotate(-14 26 39)"
            fill="var(--c-coin-shine)"
            opacity="0.55"
          />
          {/* Top-right miso soup cup (+3 lip + red cup + broth) */}
          <ellipse
            cx="59"
            cy="34.5"
            rx="7.5"
            ry="6"
            fill="color-mix(in srgb, var(--c-lacquer) 68%, var(--c-hud-bg))"
          />
          <ellipse cx="59" cy="32" rx="7.5" ry="6" fill="var(--c-accent)" />
          <ellipse
            cx="59"
            cy="30.5"
            rx="5.8"
            ry="4"
            fill="color-mix(in srgb, var(--c-gold) 65%, var(--c-glow))"
          />
          <circle cx="58" cy="30.5" r="1.4" fill="var(--c-success)" />
          {/* Bottom-right fluffy rice bowl (+3 lip + blue bowl + white rice dome) */}
          <ellipse
            cx="58"
            cy="51.5"
            rx="8.5"
            ry="6.5"
            fill="color-mix(in srgb, var(--c-secondary) 60%, var(--c-hud-bg))"
          />
          <ellipse cx="58" cy="49" rx="8.5" ry="6.5" fill="var(--c-secondary)" />
          <ellipse cx="58" cy="46.5" rx="7" ry="5" fill="var(--c-hud-ink)" />
          <ellipse cx="56" cy="45" rx="3" ry="1.3" fill="var(--c-coin-shine)" opacity="0.6" />
        </g>
      );
      break;

    case 'sushi':
      art = (
        <g className="item-bob">
          {/* Wooden geta feet (+3 lip + main) */}
          <rect
            x="16"
            y="53"
            width="9"
            height="12"
            rx="3"
            fill="color-mix(in srgb, var(--c-gold) 55%, var(--c-hud-bg))"
          />
          <rect
            x="55"
            y="53"
            width="9"
            height="12"
            rx="3"
            fill="color-mix(in srgb, var(--c-gold) 55%, var(--c-hud-bg))"
          />
          <rect x="16" y="51" width="9" height="11" rx="3" fill="var(--c-panel-edge)" />
          <rect x="55" y="51" width="9" height="11" rx="3" fill="var(--c-panel-edge)" />
          {/* Wooden geta board (+3 lip + main + highlight) */}
          <rect
            x="7"
            y="43"
            width="66"
            height="13"
            rx="5"
            fill="color-mix(in srgb, var(--c-gold) 62%, var(--c-hud-bg))"
          />
          <rect
            x="7"
            y="40"
            width="66"
            height="13"
            rx="5"
            fill="color-mix(in srgb, var(--c-glow) 65%, var(--c-panel-edge))"
          />
          <path
            d="M13 44 H32"
            stroke="var(--c-coin-shine)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.55"
          />
          {/* Decorative green baran grass divider */}
          <path
            d="M46 42 L48 33 L51 40 L54 32 L56 42 Z"
            fill="color-mix(in srgb, var(--c-success) 65%, var(--c-hud-bg))"
          />
          <path d="M46 40 L48 31 L51 38 L54 30 L56 40 Z" fill="var(--c-success)" />
          {/* 1. Tuna (maguro) nigiri on left: rice base + ruby tuna topping */}
          <rect
            x="11"
            y="34"
            width="15"
            height="10"
            rx="5"
            fill="color-mix(in srgb, var(--c-hud-ink) 72%, var(--c-hud-bg))"
          />
          <rect x="11" y="32" width="15" height="9" rx="4.5" fill="var(--c-hud-ink)" />
          <rect x="9.5" y="29" width="18" height="8" rx="4" fill="var(--c-lacquer)" />
          <rect x="9.5" y="26.5" width="18" height="8" rx="4" fill="var(--c-accent)" />
          <ellipse
            cx="15"
            cy="29.5"
            rx="4"
            ry="1.4"
            transform="rotate(-12 15 29.5)"
            fill="var(--c-hud-ink)"
            opacity="0.42"
          />
          {/* 2. Salmon (sake) nigiri in middle: rice base + coral salmon with white stripes */}
          <rect
            x="29"
            y="34"
            width="15"
            height="10"
            rx="5"
            fill="color-mix(in srgb, var(--c-hud-ink) 72%, var(--c-hud-bg))"
          />
          <rect x="29" y="32" width="15" height="9" rx="4.5" fill="var(--c-hud-ink)" />
          <rect
            x="27.5"
            y="29"
            width="18"
            height="8"
            rx="4"
            fill="color-mix(in srgb, var(--c-accent) 68%, var(--c-hud-bg))"
          />
          <rect
            x="27.5"
            y="26.5"
            width="18"
            height="8"
            rx="4"
            fill="color-mix(in srgb, var(--c-accent) 52%, var(--c-glow))"
          />
          <path
            d="M32 27.5 L35 33.5 M38 27.5 L41 33.5"
            stroke="var(--c-coin-shine)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* 3. Egg (tamago) nigiri at back-center: golden egg + nori belt */}
          <rect
            x="21"
            y="21"
            width="16"
            height="8"
            rx="4"
            fill="color-mix(in srgb, var(--c-gold) 65%, var(--c-hud-bg))"
          />
          <rect x="21" y="18.5" width="16" height="8" rx="4" fill="var(--c-glow)" />
          <rect
            x="26.5"
            y="18.5"
            width="5"
            height="9.5"
            rx="1.5"
            fill="color-mix(in srgb, var(--c-hud-bg) 84%, var(--c-success))"
          />
          <ellipse
            cx="25"
            cy="21"
            rx="3.2"
            ry="1.2"
            transform="rotate(-12 25 21)"
            fill="var(--c-coin-shine)"
            opacity="0.6"
          />
          {/* 4. Maki roll on right: dark nori cylinder + white rice ring + tuna/cucumber core */}
          <rect x="54" y="26" width="15" height="17" rx="4.5" fill="var(--c-hud-bg)" />
          <rect
            x="54"
            y="23.5"
            width="15"
            height="17"
            rx="4.5"
            fill="color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-success))"
          />
          <ellipse cx="61.5" cy="24.5" rx="7.5" ry="4" fill="var(--c-hud-bg)" />
          <ellipse cx="61.5" cy="24" rx="6.2" ry="3.2" fill="var(--c-hud-ink)" />
          <circle cx="60" cy="24" r="1.9" fill="var(--c-accent)" />
          <circle cx="63.2" cy="24" r="1.6" fill="var(--c-success)" />
        </g>
      );
      break;

    case 'kaiseki':
      art = (
        <g className="item-bob">
          {/* Gentle steam rising from the covered lacquer soup wan */}
          <path
            className="meal-steam"
            d="M55 17 C53 13 57 10 55 6"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Grand red-and-gold lacquer banquet tray (+3 lip + outer body + gold trim + dark mat) */}
          <rect x="6" y="23" width="68" height="44" rx="10" fill="var(--c-hud-bg)" />
          <rect x="6" y="20" width="68" height="44" rx="10" fill="var(--c-lacquer)" />
          <rect
            x="9"
            y="22.5"
            width="62"
            height="39"
            rx="8"
            stroke="var(--c-glow)"
            strokeWidth="2"
            fill="color-mix(in srgb, var(--c-hud-bg) 88%, var(--c-lacquer))"
          />
          {/* 1. Top-left cobalt sashimi kobachi dish (+3 lip + blue bowl + ruby sashimi) */}
          <ellipse
            cx="24"
            cy="33.5"
            rx="10"
            ry="7"
            fill="color-mix(in srgb, var(--c-secondary) 58%, var(--c-hud-bg))"
          />
          <ellipse cx="24" cy="31" rx="10" ry="7" fill="var(--c-secondary)" />
          <ellipse cx="24" cy="30" rx="7.5" ry="4.8" fill="var(--c-secondary-soft)" />
          <rect x="19.5" y="27.5" width="6" height="4" rx="2" fill="var(--c-accent)" />
          <rect x="23.5" y="28.5" width="6" height="4" rx="2" fill="var(--c-petal)" />
          <circle cx="22" cy="27.5" r="1.3" fill="var(--c-glow)" />
          {/* 2. Top-right covered vermilion & gold soup wan (+3 lip + dome + knob) */}
          <ellipse
            cx="54"
            cy="34"
            rx="10.5"
            ry="7.5"
            fill="color-mix(in srgb, var(--c-lacquer) 68%, var(--c-hud-bg))"
          />
          <ellipse cx="54" cy="31.5" rx="10.5" ry="7.5" fill="var(--c-accent)" />
          <path d="M44 31.5 C44 23.5 64 23.5 64 31.5 Z" fill="var(--c-accent)" />
          <path
            d="M44.5 31.5 Q54 35 63.5 31.5"
            stroke="var(--c-glow)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="50.5" y="22.5" width="7" height="3.5" rx="1.75" fill="var(--c-glow)" />
          <ellipse
            cx="49.5"
            cy="27"
            rx="3.5"
            ry="1.3"
            transform="rotate(-18 49.5 27)"
            fill="var(--c-hud-ink)"
            opacity="0.42"
          />
          {/* 3. Bottom-left golden seasonal hassun plate (+3 lip + gold plate + delicacies) */}
          <rect
            x="14"
            y="44.5"
            width="22"
            height="13"
            rx="4.5"
            fill="color-mix(in srgb, var(--c-gold) 62%, var(--c-hud-bg))"
          />
          <rect x="14" y="42" width="22" height="13" rx="4.5" fill="var(--c-panel-edge)" />
          <circle cx="20.5" cy="48" r="3.8" fill="var(--c-petal)" />
          <circle cx="20.5" cy="48" r="1.4" fill="var(--c-glow)" />
          <rect x="26" y="45" width="7" height="6.5" rx="2.5" fill="var(--c-glow)" />
          <circle cx="25" cy="51" r="2.2" fill="var(--c-success)" />
          {/* 4. Bottom-right jade rice bowl (+3 lip + green bowl + fluffy rice) */}
          <ellipse
            cx="53"
            cy="50.5"
            rx="9.5"
            ry="6.8"
            fill="color-mix(in srgb, var(--c-success) 58%, var(--c-hud-bg))"
          />
          <ellipse cx="53" cy="48" rx="9.5" ry="6.8" fill="var(--c-success)" />
          <ellipse cx="53" cy="45.5" rx="7.5" ry="5" fill="var(--c-hud-ink)" />
          <ellipse cx="51" cy="44" rx="3" ry="1.2" fill="var(--c-coin-shine)" opacity="0.6" />
          {/* Festive chopsticks along the front edge */}
          <path
            d="M24 58.5 H56"
            stroke="var(--c-coin-shine)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <rect x="28" y="56.5" width="5" height="4" rx="1.5" fill="var(--c-accent)" />
          {/* Luxurious twinkling gold sparkles */}
          <g className="item-glint" fill="var(--c-coin-shine)">
            <path d="M68 12 l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8Z" />
            <path d="M12 13 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4Z" />
          </g>
        </g>
      );
      break;

    default:
      art = (
        <g className="item-bob">
          {/* Gentle steam wisp */}
          <path
            className="meal-steam"
            d="M40 16 C37 11 43 7 40 3"
            stroke="var(--c-hud-ink)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Foot ring (+3 lip + main) */}
          <rect
            x="27"
            y="59"
            width="26"
            height="8"
            rx="4"
            fill="color-mix(in srgb, var(--c-lacquer) 65%, var(--c-hud-bg))"
          />
          <rect x="27" y="56" width="26" height="8" rx="4" fill="var(--c-lacquer)" />
          {/* Lower bowl body (+3 lip + main) */}
          <path
            d="M12 40 C12 57 23 63 40 63 C57 63 68 57 68 40 Z"
            fill="color-mix(in srgb, var(--c-lacquer) 72%, var(--c-hud-bg))"
          />
          <path d="M12 37 C12 54 23 60 40 60 C57 60 68 54 68 37 Z" fill="var(--c-accent)" />
          {/* Lid crown handle (+3 lip + main + gold rim) */}
          <rect x="31" y="19" width="18" height="7" rx="3.5" fill="var(--c-lacquer)" />
          <rect x="31" y="17" width="18" height="7" rx="3.5" fill="var(--c-accent)" />
          <rect x="33" y="17" width="14" height="2.6" rx="1.3" fill="var(--c-glow)" />
          {/* Domed bowl lid (+3 lip + main) */}
          <path
            d="M11 39 C11 23 24 21 40 21 C56 21 69 23 69 39 Z"
            fill="color-mix(in srgb, var(--c-lacquer) 75%, var(--c-hud-bg))"
          />
          <path
            d="M11 36 C11 21 24 19 40 19 C56 19 69 21 69 36 Z"
            fill="color-mix(in srgb, var(--c-accent) 88%, var(--c-lacquer))"
          />
          {/* Golden seam band between lid and bowl */}
          <rect x="10" y="35" width="60" height="5" rx="2.5" fill="var(--c-gold)" />
          <rect x="10" y="33.5" width="60" height="4.5" rx="2.25" fill="var(--c-glow)" />
          {/* Top-left gloss highlight on lid & bowl */}
          <ellipse
            cx="26"
            cy="26.5"
            rx="7.5"
            ry="2.8"
            transform="rotate(-18 26 26.5)"
            fill="var(--c-hud-ink)"
            opacity="0.42"
          />
          <ellipse
            cx="24"
            cy="47"
            rx="6"
            ry="2.3"
            transform="rotate(22 24 47)"
            fill="var(--c-hud-ink)"
            opacity="0.38"
          />
        </g>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className="item-art meal-art"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="40" cy="71" rx="22" ry="4.5" fill="var(--c-shadow)" />
      {art}
    </svg>
  );
}
