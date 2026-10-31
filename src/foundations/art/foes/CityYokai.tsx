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

/**
 * 3. ROKUROKUBI — ろくろ首 (ろくろくび)
 * Folklore: From Edo-period kaidan and Toriyama Sekien's Gazu Hyakki Yagyō. By day she appears
 * as an ordinary woman in a kimono with a Shimada mage coiffure and ornamental kanzashi; by night
 * her neck stretches in a long serpentine loop while she sleeps or haunts the lantern-lit streets.
 */
export function RokurokubiArt({ state }: { state: EnemyState }): ReactNode {
  const skin = '#f1d3b6';
  const skinShade = 'color-mix(in srgb, #f1d3b6 72%, var(--c-hud-bg))';
  const skinWarm = 'color-mix(in srgb, #f1d3b6 66%, var(--c-accent))';
  const kimonoShade = 'var(--c-lacquer)';
  const kimonoMain = 'var(--c-accent)';
  const hairBack = 'color-mix(in srgb, var(--c-hud-bg) 90%, var(--c-secondary))';
  const hairFront = 'color-mix(in srgb, var(--c-hud-bg) 80%, var(--c-secondary))';

  return (
    <g className={`rokurokubi-root rokurokubi-${state}`}>
      {/* Grounded shadow on the market street */}
      <g className="enemy-shadow rokurokubi-shadow">
        <ellipse cx="64" cy="94.5" rx="21" ry="4.2" fill="var(--c-shadow)" />
        <ellipse cx="64" cy="94.5" rx="12.5" ry="2.3" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body rokurokubi-body">
        {/* Floating night-lantern spirit wisp */}
        <g className="rokurokubi-wisp">
          <path d="M88 22 C92 27 92 33 88 35 C84 33 84 27 88 22 Z" fill={kimonoShade} />
          <path
            d="M88 20 C91.5 25 91.5 30.5 88 32.5 C84.5 30.5 84.5 25 88 20 Z"
            fill="var(--c-glow)"
          />
          <circle cx="88" cy="28" r="1.8" fill={SHINE} />
        </g>

        {/* Tabi feet & lacquered zōri sandals on the ground line */}
        <rect x="53" y="86.5" width="9.5" height="7.5" rx="3.8" fill={INK} />
        <rect x="53" y="84.5" width="9.5" height="6.8" rx="3.4" fill="var(--c-lacquer)" />
        <rect x="54" y="83" width="7.5" height="6.5" rx="3.2" fill={CREAM} />
        <rect x="65.5" y="86.5" width="9.5" height="7.5" rx="3.8" fill={INK} />
        <rect x="65.5" y="84.5" width="9.5" height="6.8" rx="3.4" fill="var(--c-lacquer)" />
        <rect x="66.5" y="83" width="7.5" height="6.5" rx="3.2" fill={CREAM} />

        {/* Compact chibi kimono torso planted low (+3 shade lip + main fill) */}
        <path
          d="M48 79 C48 71 54 68 64 68 C74 68 80 71 80 79 L77 89 Q64 93 51 89 Z"
          fill={kimonoShade}
        />
        <path
          d="M48 76 C48 68 54 65 64 65 C74 65 80 68 80 76 L77 86 Q64 90 51 86 Z"
          fill={kimonoMain}
        />
        {/* White juban collar, golden brocade obi & obijime cord */}
        <path d="M56 65 L64 75 L72 65 Z" fill={CREAM} />
        <path
          d="M55 65 L65 76 M73 65 L63 74"
          stroke={kimonoShade}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <rect x="50" y="76.5" width="28" height="7" rx="3.4" fill="var(--c-gold)" />
        <rect x="50" y="74.5" width="28" height="6.2" rx="3.1" fill="var(--c-glow)" />
        <rect x="52" y="77" width="24" height="2" rx="1" fill={kimonoShade} />
        <ellipse
          cx="55"
          cy="71"
          rx="4.8"
          ry="1.8"
          transform="rotate(-16 55 71)"
          fill="var(--c-hud-ink)"
          opacity="0.38"
        />
        {/* Left & right furisode sleeves with both arms tucked cleanly inside (no hands visible) */}
        <path d="M41 78 C41 71 45 67 52 69 L53 83 C46 85 41 82 41 78 Z" fill={kimonoShade} />
        <path d="M41 75 C41 68 45 64 52 66 L53 80 C46 82 41 79 41 75 Z" fill={kimonoMain} />
        <path
          d="M44 74 Q48 76 51 73"
          stroke="var(--c-gold)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M87 78 C87 71 83 67 76 69 L75 83 C82 85 87 82 87 78 Z" fill={kimonoShade} />
        <path d="M87 75 C87 68 83 64 76 66 L75 80 C82 82 87 79 87 75 Z" fill={kimonoMain} />
        <path
          d="M84 74 Q80 76 77 73"
          stroke="var(--c-gold)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Long serpentine S-loop neck & floating head (pivots at collar 64,69) */}
        <g className="rokurokubi-neck">
          {/* Two-S-loop thin neck (+3 shade lip + flat skin fill + top-left highlight) */}
          <path
            d="M64 71.8 C50 71.8 33 67.8 34 58.8 C35 49.8 68 55.8 67 45.8 C66 37.8 36 43.8 36 34.8"
            stroke={skinShade}
            strokeWidth="6.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M64 69 C50 69 33 65 34 56 C35 47 68 53 67 43 C66 35 36 41 36 32"
            stroke={skin}
            strokeWidth="6.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M49 67.6 C39 66 35 61.5 35.5 56 M42 49.5 C51 48.8 61 48 65.5 43.5"
            stroke="var(--c-hud-ink)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.42"
          />

          {/* Floating chibi head (~1 head-height above body) with Shimada mage & kanzashi */}
          <g className="rokurokubi-head">
            {/* Back hair & arched Edo mage topknot with vermilion tegara ribbon */}
            <ellipse cx="36" cy="10.5" rx="9.5" ry="5" fill={hairBack} />
            <ellipse cx="36" cy="8.5" rx="9.5" ry="4.8" fill={hairFront} />
            <rect x="30" y="11" width="12" height="3" rx="1.5" fill="var(--c-accent)" />
            <path
              d="M15 27 C14 13 22 8 36 8 C50 8 58 13 57 27 C57 32 54 36 50 37.5 L22 37.5 C18 36 15 32 15 27 Z"
              fill={hairBack}
            />

            {/* Golden blossom kanzashi hairpin with dangling shidare drops */}
            <g className="rokurokubi-kanzashi">
              <path
                d="M42 15 L56 6.5"
                stroke="var(--c-gold)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M42 14 L56 5.5"
                stroke="var(--c-glow)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="54.5" cy="8" r="3.8" fill={kimonoShade} />
              <circle cx="54.5" cy="6.5" r="3.8" fill="var(--c-petal)" />
              <circle cx="54.5" cy="6.5" r="1.5" fill="var(--c-glow)" />
              <circle cx="58" cy="11.5" r="1.7" fill="var(--c-accent)" />
              <circle cx="58" cy="15.5" r="1.5" fill="var(--c-petal)" />
            </g>

            {/* Ears & chibi face (+3 shade lip + main skin) */}
            <circle cx="16.5" cy="28" r="4.2" fill={skinShade} />
            <circle cx="16.5" cy="26.5" r="4.2" fill={skin} />
            <circle cx="17" cy="27" r="1.9" fill={skinWarm} />
            <circle cx="55.5" cy="28" r="4.2" fill={skinShade} />
            <circle cx="55.5" cy="26.5" r="4.2" fill={skin} />
            <circle cx="55" cy="27" r="1.9" fill={skinWarm} />

            <rect x="17" y="13" width="38" height="25" rx="13.5" fill={skinShade} />
            <rect x="17" y="10" width="38" height="25" rx="13.5" fill={skin} />

            {/* Swept Edo bangs & hair shine */}
            <path
              d="M15.5 24 C15.5 12 23.5 8 36 8 C48.5 8 56.5 12 56.5 24 C53.5 19 48.5 16 43.5 18.5 C40 14.5 32 14.5 28.5 18.5 C23.5 16 18.5 19 15.5 24 Z"
              fill={hairFront}
            />
            <path
              d="M23 14 C30 10.5 42 10.5 49 13.5"
              stroke="color-mix(in srgb, var(--c-secondary) 52%, var(--c-hud-ink))"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
            />
            <ellipse
              cx="26"
              cy="18.5"
              rx="6.5"
              ry="2.6"
              transform="rotate(-16 26 18.5)"
              fill="var(--c-hud-ink)"
              opacity="0.42"
            />

            {/* Blush, brows, eyes & mischievous smile */}
            <ellipse cx="23" cy="30.5" rx="3.6" ry="2" fill="var(--c-petal)" opacity="0.78" />
            <ellipse cx="49" cy="30.5" rx="3.6" ry="2" fill="var(--c-petal)" opacity="0.78" />
            <path
              d={
                state === 'hit' || state === 'defeat'
                  ? 'M23.5 20.5 L31.5 18 M48.5 20.5 L40.5 18'
                  : 'M23.5 19 Q28 17 31.5 20 M48.5 19 Q44 17 40.5 20'
              }
              stroke={INK}
              strokeWidth="2.3"
              strokeLinecap="round"
              fill="none"
            />
            <YokaiEyes
              state={state}
              x1={28}
              x2={44}
              y={26}
              iris="var(--c-secondary)"
              pupil={INK}
              hurtStroke={INK}
            />
            <ellipse cx="36" cy="29.5" rx="1.1" ry="0.75" fill={skinWarm} />
            {state === 'attack' ? (
              <path d="M31.5 31.2 C31.5 36 40.5 36 40.5 31.2 Z" fill={kimonoShade} />
            ) : (
              <path
                d="M32.5 31.8 Q36 34.4 39.5 31.8"
                stroke={INK}
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>
        </g>
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <g className="enemy-body rokurokubi-body">
            <rect x="53" y="83" width="9.5" height="11" rx="3.8" fill={fill} />
            <rect x="65.5" y="83" width="9.5" height="11" rx="3.8" fill={fill} />
            <path
              d="M41 78 C41 66 51 65 64 65 C77 65 87 66 87 78 L77 89 Q64 93 51 89 Z"
              fill={fill}
            />
            <g className="rokurokubi-neck">
              <path
                d="M64 70.4 C50 70.4 33 66.4 34 57.4 C35 48.4 68 54.4 67 44.4 C66 36.4 36 42.4 36 33.4"
                stroke={fill}
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <g className="rokurokubi-head">
                <ellipse cx="36" cy="9.5" rx="9.5" ry="5.5" fill={fill} />
                <rect x="15" y="8" width="42" height="30" rx="15" fill={fill} />
              </g>
            </g>
          </g>
        )}
      />
    </g>
  );
}

/**
 * 4. BAKENEKO — 化け猫 (ばけねこ)
 * Folklore: An aged housecat that transforms into a yokai (famous from the Nabeshima kaidan and
 * Edo ukiyo-e). In folklore it stands on its hind legs with a knotted tenugui towel on its head,
 * splits its tail in two (nekomata-style), and steals into rooms at night to lick lamp oil.
 */
export function BakenekoArt({ state }: { state: EnemyState }): ReactNode {
  const furShade = 'color-mix(in srgb, var(--c-gold) 58%, var(--c-hud-bg))';
  const furMain = 'color-mix(in srgb, var(--c-glow) 78%, var(--c-accent))';
  const spotDark = 'color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-secondary))';
  const haoriShade = 'color-mix(in srgb, var(--c-secondary) 60%, var(--c-hud-bg))';

  return (
    <g className={`bakeneko-root bakeneko-${state}`}>
      {/* Grounded shadow on the market street */}
      <g className="enemy-shadow bakeneko-shadow">
        <ellipse cx="50" cy="92" rx="24" ry="5.2" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="92" rx="14" ry="2.8" fill="var(--c-shadow)" />
      </g>

      <g className="enemy-body bakeneko-body">
        {/* Forked twin cat tail (nekomata-style) behind torso */}
        <g className="bakeneko-tail">
          <path
            d="M58 78 C74 79 89 67 89 48 C89 41 81 40 79 47 C77 55 71 66 58 72 Z"
            fill={furShade}
          />
          <path
            d="M58 75 C74 76 89 64 89 45 C89 38 81 37 79 44 C77 52 71 63 58 69 Z"
            fill={furMain}
          />
          <path
            d="M60 80 C77 85 95 77 95 61 C95 54 87 54 85 60 C82 67 74 74 60 74 Z"
            fill={furShade}
          />
          <path
            d="M60 77 C77 82 95 74 95 58 C95 51 87 51 85 57 C82 64 74 71 60 71 Z"
            fill={furMain}
          />
          <circle cx="84" cy="43" r="4" fill={CREAM} />
          <circle cx="90" cy="57" r="4" fill={spotDark} />
        </g>

        {/* Dancing hind legs & white-socked cat paws on the ground line (y ≈ 88) */}
        <ellipse cx="39" cy="89" rx="8" ry="4.2" fill={furShade} />
        <ellipse cx="39" cy="87" rx="8" ry="4" fill={CREAM} />
        <ellipse cx="61" cy="89" rx="8" ry="4.2" fill={furShade} />
        <ellipse cx="61" cy="87" rx="8" ry="4" fill={CREAM} />

        {/* Upright cat torso in an Edo chōnin haori vest & red suzu bell collar */}
        <rect x="31" y="57" width="38" height="29" rx="15" fill={furShade} />
        <rect x="31" y="54" width="38" height="28" rx="14.5" fill={furMain} />
        <path d="M40 58 C40 74 60 74 60 58 Z" fill={CREAM} />
        <path
          d="M31 61 C31 54 38 53 42 54 L41 78 L31 76 Z M69 61 C69 54 62 53 58 54 L59 78 L69 76 Z"
          fill={haoriShade}
        />
        <path
          d="M31 58.5 C31 52 38 51 42 52 L41 75.5 L31 73.5 Z M69 58.5 C69 52 62 51 58 52 L59 75.5 L69 73.5 Z"
          fill="var(--c-secondary)"
        />
        <rect x="34" y="55" width="32" height="5.5" rx="2.75" fill="var(--c-lacquer)" />
        <rect x="34" y="53.5" width="32" height="5" rx="2.5" fill="var(--c-accent)" />
        <circle cx="50" cy="60" r="5" fill="var(--c-gold)" />
        <circle cx="50" cy="58.5" r="4.8" fill="var(--c-glow)" />
        <circle cx="50" cy="59.8" r="1.5" fill={INK} />

        {/* Left beckoning/swiping cat paw with sharp claws */}
        <g className="bakeneko-arm-l">
          <ellipse cx="23" cy="60" rx="7.5" ry="5.5" fill={furShade} />
          <ellipse cx="23" cy="57.5" rx="7.5" ry="5.2" fill={CREAM} />
          <circle cx="22" cy="58" r="2.4" fill="var(--c-petal)" />
          <path
            d="M16 55 L13 53 M16 58 L12.5 57.5 M17 61 L14 62"
            stroke={CREAM}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* Right paw balancing a ceramic lamp-oil dish (abura-zara) with flickering flame */}
        <g className="bakeneko-arm-r">
          <ellipse cx="75" cy="60" rx="7" ry="5.2" fill={furShade} />
          <ellipse cx="75" cy="57.5" rx="7" ry="5" fill={CREAM} />
          <ellipse cx="83" cy="56" rx="10.5" ry="4.2" fill="var(--c-lacquer)" />
          <ellipse cx="83" cy="54" rx="10.5" ry="4" fill="var(--c-accent)" />
          <ellipse cx="83" cy="53.5" rx="7.5" ry="2.5" fill="var(--c-glow)" />
          <g className="bakeneko-flame">
            <path
              d="M83 41 C87.5 46.5 87.5 52 83 53 C78.5 52 78.5 46.5 83 41 Z"
              fill="var(--c-glow)"
            />
            <circle cx="83" cy="49" r="2.3" fill={SHINE} />
          </g>
        </g>

        {/* Pointed cat ears with calico patches */}
        <path d="M21 34 C16 19 20 8 29 9 C36 10 41 19 43 31 Z" fill={furShade} />
        <path d="M21 31.5 C16 17 20 6 29 7 C36 8 41 17 43 29 Z" fill={furMain} />
        <path d="M25 29 C23 21 25 14 29 14 C33 14 36 20 37 27 Z" fill="var(--c-petal)" />
        <path d="M79 34 C84 19 80 8 71 9 C64 10 59 19 57 31 Z" fill={furShade} />
        <path d="M79 31.5 C84 17 80 6 71 7 C64 8 59 17 57 29 Z" fill={spotDark} />
        <path d="M75 29 C77 21 75 14 71 14 C67 14 64 20 63 27 Z" fill="var(--c-petal)" />

        {/* Big chibi calico cat head (+3 shade lip + main fur + cream cheeks + calico spot) */}
        <path
          d="M18 45 C18 28 30 20 50 20 C70 20 82 28 82 45 C82 56 70 61 50 61 C30 61 18 56 18 45 Z"
          fill={furShade}
        />
        <path
          d="M18 42 C18 25 30 17 50 17 C70 17 82 25 82 42 C82 53 70 58 50 58 C30 58 18 53 18 42 Z"
          fill={furMain}
        />
        <path d="M54 18 C68 19 79 26 81 38 C73 40 62 35 54 18 Z" fill={spotDark} />
        <path
          d="M19 44 C24 40 33 42 40 48 C45 52 55 52 60 48 C67 42 76 40 81 44 C78 53 67 58 50 58 C33 58 22 53 19 44 Z"
          fill={CREAM}
        />
        <ellipse
          cx="34"
          cy="27"
          rx="8.5"
          ry="3.4"
          transform="rotate(-18 34 27)"
          fill={SHINE}
          opacity="0.65"
        />

        {/* Edo tenugui cotton towel draped on head with knotted ends on the right */}
        <path d="M25 27 C27 17 37 13 50 13 C63 13 73 17 75 27 Q50 23 25 27 Z" fill={haoriShade} />
        <path
          d="M25 24.5 C27 15 37 11 50 11 C63 11 73 15 75 24.5 Q50 20.5 25 24.5 Z"
          fill={CREAM}
        />
        <circle cx="38" cy="18" r="2" fill="var(--c-secondary)" />
        <circle cx="50" cy="16.5" r="2" fill="var(--c-secondary)" />
        <circle cx="62" cy="18" r="2" fill="var(--c-secondary)" />
        <g className="bakeneko-tenugui-knot">
          <path d="M71 22 L84 17 L82 24 Z M71 24 L85 27 L80 32 Z" fill={haoriShade} />
          <path d="M71 20 L84 15 L82 22 Z M71 22.5 L85 25 L80 30 Z" fill={CREAM} />
          <circle cx="72" cy="22" r="3.5" fill="var(--c-secondary)" />
        </g>

        {/* Cat face: blush, whiskers, brows, YokaiEyes & fanged oil-licking grin */}
        <ellipse cx="27" cy="48.5" rx="4.2" ry="2.3" fill="var(--c-petal)" opacity="0.8" />
        <ellipse cx="73" cy="48.5" rx="4.2" ry="2.3" fill="var(--c-petal)" opacity="0.8" />
        <path
          d="M15 43 L24 44.5 M15 48 L24 47.5 M85 43 L76 44.5 M85 48 L76 47.5"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d={
            state === 'hit' || state === 'defeat'
              ? 'M30 34 L42 30.5 M70 34 L58 30.5'
              : 'M30 31.5 Q36 29 42 33 M70 31.5 Q64 29 58 33'
          }
          stroke={INK}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <YokaiEyes
          state={state}
          x1={36}
          x2={64}
          y={41}
          iris="var(--c-glow)"
          pupil={INK}
          hurtStroke={INK}
        />
        <polygon points="47,46 53,46 50,49.5" fill="var(--c-petal)" />
        <path d="M42 50.5 C44 56.5 56 56.5 58 50.5 Z" fill="var(--c-lacquer)" />
        <path d="M44 50.5 L46 54 L48 50.5 Z M52 50.5 L54 54 L56 50.5 Z" fill={CREAM} />
        <ellipse cx="50" cy="54" rx="4" ry="2.2" fill="var(--c-petal)" />

        {/* Signature attack FX: glowing claw slash arcs toward the lower-left player */}
        <g className="bakeneko-claws">
          <path
            d="M32 46 C20 54 12 66 8 78 M38 52 C26 60 18 72 14 84 M44 58 C32 66 24 78 20 90"
            stroke="var(--c-glow)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M32 46 C20 54 12 66 8 78 M38 52 C26 60 18 72 14 84 M44 58 C32 66 24 78 20 90"
            stroke={SHINE}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>

      <YokaiDamageFlash
        renderSilhouette={(fill) => (
          <g className="enemy-body bakeneko-body">
            <g className="bakeneko-tail">
              <path
                d="M58 78 C74 79 89 67 89 45 C89 38 81 37 79 44 C77 52 71 63 58 69 Z"
                fill={fill}
              />
              <path
                d="M60 80 C77 85 95 77 95 58 C95 51 87 51 85 57 C82 64 74 71 60 71 Z"
                fill={fill}
              />
            </g>
            <ellipse cx="39" cy="88" rx="8" ry="4.5" fill={fill} />
            <ellipse cx="61" cy="88" rx="8" ry="4.5" fill={fill} />
            <rect x="31" y="53" width="38" height="33" rx="15" fill={fill} />
            <g className="bakeneko-arm-l">
              <ellipse cx="23" cy="58.5" rx="8" ry="6" fill={fill} />
            </g>
            <g className="bakeneko-arm-r">
              <ellipse cx="75" cy="58.5" rx="7.5" ry="6" fill={fill} />
              <ellipse cx="83" cy="55" rx="10.5" ry="4.5" fill={fill} />
            </g>
            <path d="M21 34 C16 17 20 6 29 7 C36 8 41 17 43 31 Z" fill={fill} />
            <path d="M79 34 C84 17 80 6 71 7 C64 8 59 17 57 31 Z" fill={fill} />
            <rect x="18" y="11" width="64" height="50" rx="22" fill={fill} />
          </g>
        )}
      />
    </g>
  );
}
