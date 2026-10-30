/**
 * City Market yokai (part 1 of 2): Edo-period ghost-story (kaidan) and Toriyama Sekien yokai
 * that haunt the lantern-lit market streets at dusk. Pure 2D inline SVG + CSS animations
 * (transform/opacity only), driven by theme tokens.
 */
import type { ReactNode } from 'react';
import {
  CREAM,
  INK,
  SHINE,
  YokaiDamageFlash,
  YokaiEyes,
  spiralEyePath,
  type EnemyState,
} from '../Enemy';
import './city.css';

/**
 * 1. CHOCHIN-OBAKE — 提灯お化け (ちょうちんおばけ)
 * Folklore: A tsukumogami (hundred-year household spirit) born from an old bura-chōchin paper
 * lantern, famous from Edo kaidan, kabuki ghost plays (Tōkaidō Yotsuya Kaidan), and Toriyama
 * Sekien's yokai catalogues. Its bamboo-ribbed paper body splits horizontally into a grinning
 * maw with a long lolling tongue while a supernatural candle flame flickers inside.
 */
export function ChochinObakeArt({ state }: { state: EnemyState }): ReactNode {
  const paperShade = 'var(--c-lacquer)';
  const paperMain = 'var(--c-accent)';
  const paperGlow = 'color-mix(in srgb, var(--c-glow) 42%, var(--c-accent))';
  const rimShade = INK;
  const rimMain = 'color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-secondary))';

  return (
    <g className={`chochin-obake-root chochin-obake-${state}`}>
      {/* Hovering ground shadow on the market street */}
      <g className="enemy-shadow chochin-obake-shadow">
        <ellipse cx="50" cy="92" rx="24" ry="5.5" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="13" ry="3" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body chochin-obake-body">
        {/* Eerie floating lantern-fire wisps */}
        <g className="chochin-obake-wisp-1">
          <path d="M14 27 C19 33 19 40 14 42 C9 40 9 33 14 27 Z" fill={paperShade} />
          <path
            d="M14 25 C18.5 31 18.5 37.5 14 39.5 C9.5 37.5 9.5 31 14 25 Z"
            fill="var(--c-glow)"
          />
          <circle cx="14" cy="34.5" r="2" fill={SHINE} />
        </g>
        <g className="chochin-obake-wisp-2">
          <path
            d="M86 21 C90.5 26.5 90.5 32.5 86 34.5 C81.5 32.5 81.5 26.5 86 21 Z"
            fill={paperShade}
          />
          <path d="M86 19 C90 24.5 90 30.5 86 32 C82 30.5 82 24.5 86 19 Z" fill="var(--c-glow)" />
          <circle cx="86" cy="27.5" r="1.8" fill={SHINE} />
        </g>

        {/* Wire hanging bail & top wooden/lacquer rim (火袋の上輪) */}
        <path
          d="M41 15 C41 8 59 8 59 15"
          stroke="var(--c-panel-edge)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="31" y="15" width="38" height="8" rx="4" fill={rimShade} />
        <rect x="31" y="13" width="38" height="7" rx="3.5" fill={rimMain} />
        <rect
          x="36"
          y="14.5"
          width="28"
          height="2"
          rx="1"
          fill="var(--c-panel-edge)"
          opacity="0.75"
        />

        {/* Upper lantern paper dome (+3 shade lip + main vermilion wash + inner candle glow) */}
        <path
          d="M19 48 C18 28 29 19 50 19 C71 19 82 28 81 48 C72 54 61 55 50 55 C39 55 28 54 19 48 Z"
          fill={paperShade}
        />
        <path
          d="M19 45 C18 25 29 16 50 16 C71 16 82 25 81 45 C72 51 61 52 50 52 C39 52 28 51 19 45 Z"
          fill={paperMain}
        />
        <ellipse cx="50" cy="38" rx="23" ry="13" fill={paperGlow} opacity="0.65" />

        {/* Bamboo ribs (竹ひご) across upper lantern paper */}
        <path
          d="M23 29 Q50 35 77 29 M20 39 Q50 46 80 39"
          stroke={paperShade}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
        {/* Soft top-left highlight */}
        <ellipse
          cx="33"
          cy="26"
          rx="9"
          ry="3.6"
          transform="rotate(-20 33 26)"
          fill="var(--c-hud-ink)"
          opacity="0.42"
        />

        {/* Split gaping lantern mouth interior & flickering wax candle inside */}
        <path
          d="M21 46 C31 52 69 52 79 46 C81 56 72 64 50 64 C28 64 19 56 21 46 Z"
          fill={rimShade}
        />
        <ellipse cx="50" cy="55" rx="20" ry="7" fill={paperShade} />
        {/* Wax candle & flame inside the split lantern */}
        <rect x="47" y="54" width="6" height="8" rx="2" fill={CREAM} />
        <g className="chochin-obake-flame">
          <path d="M50 43 C55 49 55 55 50 56 C45 55 45 49 50 43 Z" fill="var(--c-glow)" />
          <circle cx="50" cy="52" r="2.6" fill={SHINE} />
        </g>
        {/* Jagged torn-washi upper teeth */}
        <path
          d="M27 47 L31 53 L35 48 Z M41 49 L44 54 L47 49 Z M53 49 L56 54 L59 49 Z M65 48 L69 53 L73 47 Z"
          fill={CREAM}
        />

        {/* Lower lantern jaw, bottom lacquer rim, tassel & lolling tongue */}
        <g className="chochin-obake-jaw">
          {/* Dangling silk tassel under the lantern */}
          <g className="chochin-obake-tassel">
            <rect x="48" y="75" width="4" height="5" rx="2" fill="var(--c-gold)" />
            <path d="M45 87 C45 79 55 79 55 87 Z" fill={paperShade} />
            <path d="M45 85 C45 78 55 78 55 85 Z" fill={paperMain} />
            <circle cx="50" cy="78" r="2.6" fill="var(--c-glow)" />
          </g>

          {/* Lower split paper jaw (+3 shade lip + main vermilion wash + bamboo rib) */}
          <path
            d="M21 56 C29 63 71 63 79 56 C77 69 66 75 50 75 C34 75 23 69 21 56 Z"
            fill={paperShade}
          />
          <path
            d="M21 53 C29 60 71 60 79 53 C77 66 66 72 50 72 C34 72 23 66 21 53 Z"
            fill={paperMain}
          />
          <path
            d="M25 62 Q50 69 75 62"
            stroke={paperShade}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
          {/* Lower torn-washi teeth */}
          <path d="M33 57 L36 52 L39 58 Z M61 58 L64 52 L67 57 Z" fill={CREAM} />

          {/* Black lacquer bottom rim (下輪) */}
          <rect x="32" y="71" width="36" height="7.5" rx="3.75" fill={rimShade} />
          <rect x="32" y="69" width="36" height="6.5" rx="3.25" fill={rimMain} />

          {/* Long curling tsukumogami tongue */}
          <g className="chochin-obake-tongue">
            <path
              d="M44 57 C41 72 25 77 20 69 C16 63 23 57 28 61 C32 64 38 63 41 56 Z"
              fill={paperShade}
            />
            <path
              d="M44 55 C41 70 25 74 20 66.5 C16 61 23 55.5 28 59.5 C32 62.5 38 61.5 41 54.5 Z"
              fill="var(--c-petal)"
            />
            <path
              d="M39 59 C36 66 27 69 23 65"
              stroke={SHINE}
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
          </g>
        </g>

        {/* Expressive eyes in the upper paper & rosy cheeks */}
        <ellipse cx="26" cy="42" rx="4.2" ry="2.4" fill="var(--c-petal)" opacity="0.8" />
        <ellipse cx="74" cy="42" rx="4.2" ry="2.4" fill="var(--c-petal)" opacity="0.8" />
        <path
          d={
            state === 'hit' || state === 'defeat'
              ? 'M29 30 L41 26 M71 30 L59 26'
              : 'M29 27 L41 31 M71 27 L59 31'
          }
          stroke={INK}
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <YokaiEyes
          state={state}
          x1={36}
          x2={64}
          y={36}
          iris="var(--c-glow)"
          pupil={INK}
          hurtStroke={CREAM}
        />
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <g className="enemy-body chochin-obake-body">
            <rect x="31" y="13" width="38" height="9" rx="4" fill={fill} />
            <path
              d="M19 48 C18 25 29 16 50 16 C71 16 82 25 81 48 C81 62 69 75 50 75 C31 75 19 62 19 48 Z"
              fill={fill}
            />
            <rect x="32" y="69" width="36" height="9.5" rx="3.75" fill={fill} />
            <path d="M45 87 C45 78 55 78 55 87 Z" fill={fill} />
            <path
              d="M44 57 C41 72 25 77 20 69 C16 63 23 57 28 61 C32 64 38 63 41 56 Z"
              fill={fill}
            />
          </g>
        )}
      />
    </g>
  );
}

/**
 * 2. NOPPERABO — のっぺらぼう
 * Folklore: The faceless ghost of Edo kaidan, immortalised in Lafcadio Hearn's "Mujina" on the
 * Akasaka moat road in Edo and Toriyama Sekien's catalogues. Dressed as an ordinary townsperson
 * in a plain kimono, it lowers its sleeves to reveal a smooth, featureless egg-like face.
 */
export function NopperaboArt({ state }: { state: EnemyState }): ReactNode {
  const skin = '#f1d3b6';
  const skinShade = 'color-mix(in srgb, #f1d3b6 72%, var(--c-hud-bg))';
  const skinWarm = 'color-mix(in srgb, #f1d3b6 66%, var(--c-accent))';
  const kimonoShade = 'color-mix(in srgb, var(--c-secondary) 60%, var(--c-hud-bg))';
  const kimonoMain = 'var(--c-secondary)';
  const hairBack = 'color-mix(in srgb, var(--c-hud-bg) 90%, var(--c-secondary))';
  const hairFront = 'color-mix(in srgb, var(--c-hud-bg) 80%, var(--c-secondary))';

  return (
    <g className={`nopperabo-root nopperabo-${state}`}>
      {/* Grounded shadow on the dusk road */}
      <g className="enemy-shadow nopperabo-shadow">
        <ellipse cx="50" cy="92" rx="24" ry="5" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="14" ry="2.8" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body nopperabo-body">
        {/* Ghostly twilight spirit wisps */}
        <g className="nopperabo-wisp-1">
          <path d="M15 32 C19 37 19 42 15 44 C11 42 11 37 15 32 Z" fill={kimonoShade} />
          <path
            d="M15 30 C18.5 34.5 18.5 39.5 15 41 C11.5 39.5 11.5 34.5 15 30 Z"
            fill="var(--c-secondary-soft)"
          />
          <circle cx="15" cy="37" r="1.6" fill={SHINE} />
        </g>
        <g className="nopperabo-wisp-2">
          <path d="M85 24 C89 29 89 34 85 36 C81 34 81 29 85 24 Z" fill={kimonoShade} />
          <path
            d="M85 22 C88.5 26.5 88.5 31.5 85 33 C81.5 31.5 81.5 26.5 85 22 Z"
            fill="var(--c-secondary-soft)"
          />
          <circle cx="85" cy="29" r="1.5" fill={SHINE} />
        </g>

        {/* Tabi-socked feet & straw zōri sandals on the ground line (y ≈ 88) */}
        <rect x="35" y="82" width="11" height="9" rx="4.5" fill="var(--c-gold)" />
        <rect x="35" y="80" width="11" height="8" rx="4" fill="var(--c-panel-edge)" />
        <rect x="36" y="78" width="9" height="8" rx="4" fill={CREAM} />
        <path
          d="M37 85 L40.5 82 L44 85"
          stroke="var(--c-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        <rect x="54" y="82" width="11" height="9" rx="4.5" fill="var(--c-gold)" />
        <rect x="54" y="80" width="11" height="8" rx="4" fill="var(--c-panel-edge)" />
        <rect x="55" y="78" width="9" height="8" rx="4" fill={CREAM} />
        <path
          d="M56 85 L59.5 82 L63 85"
          stroke="var(--c-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Plain Edo townsperson kimono torso (+3 shade lip + main fill) */}
        <path
          d="M27 65 C27 54 35 49 50 49 C65 49 73 54 73 65 L70 84 Q50 89 30 84 Z"
          fill={kimonoShade}
        />
        <path
          d="M27 62 C27 52 35 47 50 47 C65 47 73 52 73 62 L70 81 Q50 86 30 81 Z"
          fill={kimonoMain}
        />
        {/* Crisp white juban under-collar & overlapping kimono lapels */}
        <path d="M41 47 L50 62 L59 47 Z" fill={CREAM} />
        <path
          d="M40 47 L52 65 M60 47 L49 60"
          stroke={kimonoShade}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* Woven obi sash & obijime cord */}
        <rect x="31" y="67" width="38" height="8.5" rx="3.8" fill="var(--c-gold)" />
        <rect x="31" y="65" width="38" height="7.5" rx="3.5" fill="var(--c-panel-edge)" />
        <rect x="33" y="68" width="34" height="2.2" rx="1.1" fill="var(--c-lacquer)" />
        {/* Soft top-left kimono highlight */}
        <ellipse
          cx="37"
          cy="55"
          rx="6"
          ry="2.2"
          transform="rotate(-16 37 55)"
          fill="var(--c-hud-ink)"
          opacity="0.38"
        />

        {/* Left & right wide kimono sleeves with chibi hands (wiping / revealing the blank face) */}
        <g className="nopperabo-sleeve-l">
          <path d="M18 65 C18 55 24 50 34 52 L36 71 C26 74 18 71 18 65 Z" fill={kimonoShade} />
          <path d="M18 62 C18 53 24 48 34 50 L36 68 C26 71 18 68 18 62 Z" fill={kimonoMain} />
          <circle cx="29" cy="57.5" r="5" fill={skinShade} />
          <circle cx="29" cy="56" r="5" fill={skin} />
        </g>
        <g className="nopperabo-sleeve-r">
          <path d="M82 65 C82 55 76 50 66 52 L64 71 C74 74 82 71 82 65 Z" fill={kimonoShade} />
          <path d="M82 62 C82 53 76 48 66 50 L64 68 C74 71 82 68 82 62 Z" fill={kimonoMain} />
          <circle cx="71" cy="57.5" r="5" fill={skinShade} />
          <circle cx="71" cy="56" r="5" fill={skin} />
        </g>

        {/* Oversized chibi head: smooth blank egg face with Edo townsperson hair */}
        <g className="nopperabo-head">
          {/* Neck */}
          <rect x="44" y="43" width="12" height="10" rx="5" fill={skinShade} />
          <rect x="44" y="41" width="12" height="9" rx="4.5" fill={skin} />

          {/* Back hair & Edo chōnin topknot bun (mage) */}
          <ellipse cx="50" cy="11.5" rx="10" ry="6.5" fill={hairBack} />
          <ellipse cx="50" cy="9.5" rx="10" ry="6.2" fill={hairFront} />
          <rect x="44" y="12.5" width="12" height="3.5" rx="1.75" fill="var(--c-panel-edge)" />
          <path
            d="M24 34 C23 16 34 10 50 10 C66 10 77 16 76 34 C76 41 73 46 69 48 L31 48 C27 46 24 41 24 34 Z"
            fill={hairBack}
          />

          {/* Side ears */}
          <circle cx="26.5" cy="36.5" r="5.2" fill={skinShade} />
          <circle cx="26.5" cy="35" r="5.2" fill={skin} />
          <circle cx="27" cy="35.5" r="2.3" fill={skinWarm} />
          <circle cx="73.5" cy="36.5" r="5.2" fill={skinShade} />
          <circle cx="73.5" cy="35" r="5.2" fill={skin} />
          <circle cx="73" cy="35.5" r="2.3" fill={skinWarm} />

          {/* Smooth blank egg face (+3 shade lip + flat skin fill — no eyes, nose, or mouth!) */}
          <rect x="27" y="17" width="46" height="36" rx="21" fill={skinShade} />
          <rect x="27" y="14" width="46" height="36" rx="21" fill={skin} />

          {/* Parted side hair framing the completely blank face */}
          <path
            d="M25 31 C25 15 35 10 50 10 C65 10 75 15 75 31 C73 25 67 19 59 17 C54 15.5 46 15.5 41 17 C33 19 27 25 25 31 Z"
            fill={hairFront}
          />
          <path
            d="M33 17 C42 12.5 55 12.5 64 16.5"
            stroke="color-mix(in srgb, var(--c-secondary) 52%, var(--c-hud-ink))"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />

          {/* Soft top-left egg-face highlight & cute rosy cheeks on the uncanny blank skin */}
          <ellipse
            cx="38"
            cy="24"
            rx="8.5"
            ry="3.4"
            transform="rotate(-16 38 24)"
            fill="var(--c-hud-ink)"
            opacity="0.45"
          />
          <ellipse cx="35.5" cy="40" rx="4.5" ry="2.5" fill="var(--c-petal)" opacity="0.72" />
          <ellipse cx="64.5" cy="40" rx="4.5" ry="2.5" fill="var(--c-petal)" opacity="0.72" />

          {/* Hit state: no eyes to hurt, so show hurt with a squash (via CSS) and a large sweat drop */}
          {state === 'hit' && (
            <g className="nopperabo-sweat">
              <path
                d="M68 21 C72 27 72 31.5 68 31.5 C64 31.5 64 27 68 21 Z"
                fill="var(--c-secondary)"
              />
              <path
                d="M68 19.5 C71.5 25 71.5 29.5 68 29.5 C64.5 29.5 64.5 25 68 19.5 Z"
                fill="var(--c-secondary-soft)"
              />
              <circle cx="66.8" cy="26.5" r="1.2" fill={SHINE} />
            </g>
          )}

          {/* Defeat state: dizzy KO spiral above the faceless head */}
          {state === 'defeat' && (
            <g className="nopperabo-ko-swirl">
              <path
                d={spiralEyePath(50, 7, 1)}
                stroke="var(--c-glow)"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}
        </g>
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <g className="enemy-body nopperabo-body">
            <rect x="35" y="78" width="11" height="13" rx="4.5" fill={fill} />
            <rect x="54" y="78" width="11" height="13" rx="4.5" fill={fill} />
            <path
              d="M27 65 C27 52 35 47 50 47 C65 47 73 52 73 65 L70 84 Q50 89 30 84 Z"
              fill={fill}
            />
            <g className="nopperabo-sleeve-l">
              <path d="M18 65 C18 53 24 48 34 50 L36 71 C26 74 18 71 18 65 Z" fill={fill} />
            </g>
            <g className="nopperabo-sleeve-r">
              <path d="M82 65 C82 53 76 48 66 50 L64 71 C74 74 82 71 82 65 Z" fill={fill} />
            </g>
            <g className="nopperabo-head">
              <ellipse cx="50" cy="10.5" rx="10" ry="7" fill={fill} />
              <circle cx="26.5" cy="35.8" r="5.5" fill={fill} />
              <circle cx="73.5" cy="35.8" r="5.5" fill={fill} />
              <rect x="25" y="10" width="50" height="43" rx="22" fill={fill} />
            </g>
          </g>
        )}
      />
    </g>
  );
}
