/**
 * Dojo sparring opponents: fellow chibi samurai trainees in white keikogi and pleated hakama.
 * Pure 2D inline SVG + CSS animations (transform/opacity only), using theme tokens + avatar skin hex.
 */
import './dojo.css';
import {
  YokaiEyes,
  YokaiDamageFlash,
  spiralEyePath,
  INK,
  CREAM,
  SHINE,
  type EnemyState,
} from '../Enemy';

const SKIN = '#f1d3b6';
const SKIN_SHADE = 'color-mix(in srgb, #f1d3b6 72%, var(--c-hud-bg))';
const SKIN_WARM = 'color-mix(in srgb, #f1d3b6 66%, var(--c-accent))';
const GI_SHADE = 'color-mix(in srgb, var(--c-hud-ink) 74%, var(--c-hud-bg))';
const HAIR_BACK = 'color-mix(in srgb, var(--c-hud-bg) 90%, var(--c-secondary))';
const HAIR_FRONT = 'color-mix(in srgb, var(--c-hud-bg) 80%, var(--c-secondary))';
const HAIR_SHINE = 'color-mix(in srgb, var(--c-secondary) 52%, var(--c-hud-ink))';
const OAK_SHADE = 'color-mix(in srgb, var(--c-gold) 58%, var(--c-hud-bg))';

/**
 * 1. TRAINEE BOKKEN (木剣門下生 · ぼっけんもんかせい): first-year dojo kohai in white keikogi,
 * indigo hakama, bare feet & hinomaru hachimaki. Holds an oak bokken in chūdan-no-kamae
 * (中段の構え, centre guard) and strikes with an overhead men (面) cut; bows on one knee (礼) when bested.
 */
export function TraineeBokkenArt({ state }: { state: EnemyState }) {
  const isDefeat = state === 'defeat';
  const hakamaMain = 'var(--c-secondary)';
  const hakamaShade = 'color-mix(in srgb, var(--c-secondary) 60%, var(--c-hud-bg))';
  const hakamaPleat = 'color-mix(in srgb, var(--c-secondary) 44%, var(--c-hud-bg))';

  return (
    <>
      {/* Grounded shadow on the dojo floorboards */}
      <g className={`trainee-bokken-shadow trainee-bokken-shadow-${state}`}>
        <ellipse cx="50" cy="91" rx="26" ry="5.2" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="91" rx="15" ry="2.8" fill="var(--c-shadow)" />
      </g>

      <g className={`trainee-bokken-root trainee-bokken-${state}`}>
        <g className="trainee-bokken-body">
          {/* Bare feet: kneeling on right knee in defeat (rei), planted stance otherwise */}
          {isDefeat ? (
            <g>
              <rect x="31" y="85.5" width="12" height="6.5" rx="3.2" fill={SKIN_SHADE} />
              <rect x="31" y="83.5" width="12" height="6" rx="3" fill={SKIN} />
              <ellipse cx="64" cy="87.5" rx="8" ry="4" fill={SKIN_SHADE} />
              <ellipse cx="64" cy="85.8" rx="8" ry="3.8" fill={SKIN} />
            </g>
          ) : (
            <g>
              <rect x="33" y="83.5" width="11.5" height="7" rx="3.5" fill={SKIN_SHADE} />
              <rect x="33" y="81.2" width="11.5" height="6.8" rx="3.4" fill={SKIN} />
              <rect x="55.5" y="83.5" width="11.5" height="7" rx="3.5" fill={SKIN_SHADE} />
              <rect x="55.5" y="81.2" width="11.5" height="6.8" rx="3.4" fill={SKIN} />
            </g>
          )}

          {/* Wide pleated indigo hakama (with +3 bottom shade lip & 5 traditional folds) */}
          <path
            d={
              isDefeat
                ? 'M30 68 L70 68 L76 87 Q50 91 26 86 Z'
                : 'M31 66 L69 66 L74 85.5 Q50 89.5 26 85.5 Z'
            }
            fill={hakamaShade}
          />
          <path
            d={
              isDefeat
                ? 'M30 65.5 L70 65.5 L76 84.5 Q50 88.5 26 83.5 Z'
                : 'M31 63.5 L69 63.5 L74 83 Q50 87 26 83 Z'
            }
            fill={hakamaMain}
          />
          <path
            d="M40 67 L37 83 M46.5 67 L45.5 84 M53.5 67 L54.5 84 M60 67 L63 83"
            stroke={hakamaPleat}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <ellipse
            cx="37"
            cy="72"
            rx="5.5"
            ry="2"
            transform="rotate(-15 37 72)"
            fill={CREAM}
            opacity="0.38"
          />

          {/* Upper torso, head & bokken (bows forward on defeat) */}
          <g className="trainee-bokken-upper">
            {/* White keikogi training jacket (+3 shade lip + crisp white body) */}
            <path
              d="M24 64 C24 53 33 48 50 48 C67 48 76 53 76 64 C76 68 71 69 67 67 L68 70 L32 70 L33 67 C29 69 24 68 24 64 Z"
              fill={GI_SHADE}
            />
            <path
              d="M24 61 C24 50.5 33 46 50 46 C67 46 76 50.5 76 61 C76 65 71 66 67 64 L68 67.5 L32 67.5 L33 64 C29 66 24 65 24 61 Z"
              fill={CREAM}
            />
            {/* Indigo undershirt & crossed keikogi lapels */}
            <path d="M42 46.5 L50 61 L58 46.5 Z" fill={INK} />
            <path
              d="M41 46.5 L53 63.5 M59 46.5 L48.5 58"
              stroke={GI_SHADE}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Hakama himo waist sash & knot */}
            <rect x="31" y="64" width="38" height="5" rx="2.5" fill={INK} />
            <rect x="31" y="62.2" width="38" height="4.6" rx="2.3" fill={hakamaShade} />
            <path
              d="M46 62 L54 67 M54 62 L46 67"
              stroke={CREAM}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Neck & ears */}
            <rect x="44" y="42" width="12" height="9" rx="4.5" fill={SKIN_SHADE} />
            <rect x="44.5" y="40.5" width="11" height="8" rx="4" fill={SKIN} />
            <circle cx="27" cy="35.5" r="5" fill={SKIN_SHADE} />
            <circle cx="27" cy="34" r="5" fill={SKIN} />
            <circle cx="27.5" cy="34.4" r="2.2" fill={SKIN_WARM} />
            <circle cx="73" cy="35.5" r="5" fill={SKIN_SHADE} />
            <circle cx="73" cy="34" r="5" fill={SKIN} />
            <circle cx="72.5" cy="34.4" r="2.2" fill={SKIN_WARM} />

            {/* Big chibi head (+3 shade lip + skin + top-left highlight) */}
            <rect x="27" y="16" width="46" height="34" rx="17" fill={SKIN_SHADE} />
            <rect x="27" y="13" width="46" height="34" rx="17" fill={SKIN} />
            <ellipse
              cx="37"
              cy="21"
              rx="7.5"
              ry="3"
              transform="rotate(-15 37 21)"
              fill={CREAM}
              opacity="0.42"
            />

            {/* Short spiky kohai hair with scalloped bangs */}
            <path
              d="M24 28 C24 13 34 8.5 50 8.5 C66 8.5 76 13 76 28 L74 35 C72 32 71 29 70 25 C67 22 64 25 61 27 C58 22 55 25 52 27 C49 22 46 22 43 27 C40 25 37 22 34 25 C31 29 30 32 26 35 Z"
              fill={HAIR_BACK}
            />
            <path
              d="M24.5 25.5 C24.5 11.5 34.5 7 50 7 C65.5 7 75.5 11.5 75.5 25.5 L73.5 32.5 C71.5 29.5 70.5 27 69.5 23 C66.5 20 63.5 23 60.5 25 C57.5 20 54.5 23 51.5 25 C48.5 20 45.5 20 42.5 25 C39.5 23 36.5 20 33.5 23 C30.5 27 29.5 29.5 26.5 32.5 Z"
              fill={HAIR_FRONT}
            />
            <path
              d="M32 16 C40 10.5 53 10 63 14"
              stroke={HAIR_SHINE}
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
            />

            {/* Fluttering hachimaki headband & hinomaru sun disc */}
            <g className="trainee-bokken-ties">
              <path d="M71 22 L85 16 L83 23 Z M71 24.5 L86 27 L81 32 Z" fill={GI_SHADE} />
              <path d="M71 20 L84 14.5 L82 21.5 Z M71 22.8 L85 25 L80 30 Z" fill={CREAM} />
            </g>
            <rect x="26" y="20.5" width="48" height="6.8" rx="3.4" fill={GI_SHADE} />
            <rect x="26" y="18.5" width="48" height="6.4" rx="3.2" fill={CREAM} />
            <circle cx="50" cy="22.2" r="4.2" fill="var(--c-lacquer)" />
            <circle cx="50" cy="21.4" r="4" fill="var(--c-accent)" />
            <circle cx="48.8" cy="20.2" r="1.2" fill={SHINE} opacity="0.7" />

            {/* Determined face & expressions */}
            <ellipse cx="34.5" cy="39.5" rx="4.2" ry="2.4" fill="var(--c-petal)" opacity="0.75" />
            <ellipse cx="65.5" cy="39.5" rx="4.2" ry="2.4" fill="var(--c-petal)" opacity="0.75" />
            <path
              d={
                state === 'hit' || isDefeat
                  ? 'M35 28.5 L44 26 M65 28.5 L56 26'
                  : 'M35 26.5 L44.5 29 M65 26.5 L55.5 29'
              }
              stroke={INK}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {isDefeat ? (
              <g>
                {/* Respectful closed eyes in rei bow + tiny daze swirl */}
                <path
                  d="M36 35.5 Q41 38.8 45.5 35.5 M54.5 35.5 Q59 38.8 64 35.5"
                  stroke={INK}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={spiralEyePath(22, 16, 1)}
                  stroke="var(--c-secondary)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.75"
                />
              </g>
            ) : (
              <YokaiEyes
                state={state}
                x1={41}
                x2={59}
                y={35}
                iris={INK}
                pupil="var(--c-secondary)"
                hurtStroke={INK}
              />
            )}
            <ellipse cx="50" cy="39" rx="1.2" ry="0.8" fill={SKIN_WARM} />
            {state === 'attack' ? (
              <path d="M45.5 41.5 C45.5 46.5 54.5 46.5 54.5 41.5 Z" fill="var(--c-lacquer)" />
            ) : (
              <path
                d={isDefeat ? 'M47 43.2 Q50 42 53 43.2' : 'M46 42.2 Q50 45 54 42.2'}
                stroke={INK}
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Defeat sweat drop during respectful bow */}
            {isDefeat && (
              <g className="trainee-bokken-sweat">
                <path
                  d="M72 28 C74.8 32.5 74.8 36 72 36 C69.2 36 69.2 32.5 72 28 Z"
                  fill="var(--c-secondary-soft)"
                  stroke="var(--c-secondary)"
                  strokeWidth="1.1"
                />
                <circle cx="71.2" cy="33.5" r="1" fill={SHINE} />
              </g>
            )}

            {/* Oak bokken in chūdan-no-kamae (centre guard) or lowered at side in rei */}
            <g className="trainee-bokken-weapon">
              {isDefeat ? (
                <g>
                  <path
                    d="M44 68 L14 78"
                    stroke={OAK_SHADE}
                    strokeWidth="6.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M44 66.2 L14 76.2"
                    stroke="var(--c-glow)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <circle cx="32" cy="70.5" r="5" fill={SKIN_SHADE} />
                  <circle cx="32" cy="69" r="5" fill={SKIN} />
                </g>
              ) : (
                <g>
                  {/* Oak bokken blade & tsuka hilt (+3 shade lip + warm oak fill + shine) */}
                  <path
                    d="M52 68 L11 33"
                    stroke={OAK_SHADE}
                    strokeWidth="7.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M52 65.5 L11 30.5"
                    stroke="var(--c-glow)"
                    strokeWidth="5.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M36 51 L15 33"
                    stroke={SHINE}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                  {/* Wrapped white tsuka handle */}
                  <path
                    d="M52 66.5 L40 56.5"
                    stroke={CREAM}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  {/* Leather tsuba handguard */}
                  <ellipse
                    cx="39"
                    cy="55.5"
                    rx="3.2"
                    ry="6.5"
                    transform="rotate(40 39 55.5)"
                    fill="var(--c-lacquer)"
                  />
                  <ellipse
                    cx="39"
                    cy="54.2"
                    rx="2.8"
                    ry="6"
                    transform="rotate(40 39 54.2)"
                    fill="var(--c-accent)"
                  />
                  {/* Both chibi hands gripping hilt in chūdan guard */}
                  <circle cx="43" cy="60.5" r="5" fill={SKIN_SHADE} />
                  <circle cx="43" cy="59" r="5" fill={SKIN} />
                  <circle cx="49" cy="65" r="4.8" fill={SKIN_SHADE} />
                  <circle cx="49" cy="63.5" r="4.8" fill={SKIN} />
                </g>
              )}
            </g>
          </g>

          {/* Overhead men-strike slash arc toward lower-left player */}
          <g className="trainee-bokken-slash-arc">
            <path d="M28 20 C6 36 5 66 26 84 C14 64 15 40 28 20 Z" fill="var(--c-glow)" />
            <path
              d="M24 26 C9 40 9 62 23 78"
              stroke={SHINE}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>

        <YokaiDamageFlash
          renderSilhouette={(fill) => (
            <g className="trainee-bokken-body">
              <path d="M31 63.5 L69 63.5 L74 88 Q50 91 26 88 Z" fill={fill} />
              <path
                d="M24 61 C24 50.5 33 46 50 46 C67 46 76 50.5 76 61 L68 69 L32 69 Z"
                fill={fill}
              />
              <rect x="24" y="8" width="52" height="42" rx="18" fill={fill} />
              <path
                d="M52 67 L11 31"
                stroke={fill}
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}
        />
      </g>
    </>
  );
}

/**
 * 2. TRAINEE SENPAI (先輩剣士 · せんぱいけんし): senior dojo student with a samurai chonmage
 * (丁髷) topknot, dark hakama, white keikogi & confident smirk. Rests a seasoned oak bokken on
 * the shoulder before unleashing a rapid nidan-waza (二段技) double strike; bows on one knee when bested.
 */
export function TraineeSenpaiArt({ state }: { state: EnemyState }) {
  const isDefeat = state === 'defeat';
  const hakamaDark = 'color-mix(in srgb, var(--c-hud-bg) 78%, var(--c-secondary))';
  const hakamaPleat = 'color-mix(in srgb, var(--c-secondary) 48%, var(--c-hud-bg))';

  return (
    <>
      {/* Grounded shadow on the dojo floorboards */}
      <g className={`trainee-senpai-shadow trainee-senpai-shadow-${state}`}>
        <ellipse cx="50" cy="91" rx="27" ry="5.4" fill="var(--c-shadow)" />
        <ellipse cx="50" cy="91" rx="16" ry="3" fill="var(--c-shadow)" />
      </g>

      <g className={`trainee-senpai-root trainee-senpai-${state}`}>
        <g className="trainee-senpai-body">
          {/* Bare feet: kneeling on one knee in defeat (rei), composed wide stance otherwise */}
          {isDefeat ? (
            <g>
              <rect x="31" y="85.5" width="12" height="6.5" rx="3.2" fill={SKIN_SHADE} />
              <rect x="31" y="83.5" width="12" height="6" rx="3" fill={SKIN} />
              <ellipse cx="64" cy="87.5" rx="8" ry="4" fill={SKIN_SHADE} />
              <ellipse cx="64" cy="85.8" rx="8" ry="3.8" fill={SKIN} />
            </g>
          ) : (
            <g>
              <rect x="32" y="83.5" width="12" height="7" rx="3.5" fill={SKIN_SHADE} />
              <rect x="32" y="81.2" width="12" height="6.8" rx="3.4" fill={SKIN} />
              <rect x="56" y="83.5" width="12" height="7" rx="3.5" fill={SKIN_SHADE} />
              <rect x="56" y="81.2" width="12" height="6.8" rx="3.4" fill={SKIN} />
            </g>
          )}

          {/* Darker senior hakama (+3 shade lip in INK + deep indigo-black pleats) */}
          <path
            d={
              isDefeat
                ? 'M29 68 L71 68 L77 87 Q50 91 25 86 Z'
                : 'M30 66 L70 66 L75 85.5 Q50 89.5 25 85.5 Z'
            }
            fill={INK}
          />
          <path
            d={
              isDefeat
                ? 'M29 65.5 L71 65.5 L77 84.5 Q50 88.5 25 83.5 Z'
                : 'M30 63.5 L70 63.5 L75 83 Q50 87 25 83 Z'
            }
            fill={hakamaDark}
          />
          <path
            d="M39 67 L36 83 M46 67 L45 84 M54 67 L55 84 M61 67 L64 83"
            stroke={hakamaPleat}
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          <ellipse
            cx="37"
            cy="72"
            rx="5.5"
            ry="2"
            transform="rotate(-15 37 72)"
            fill={CREAM}
            opacity="0.34"
          />

          {/* Upper torso, chonmage head & shouldered bokken */}
          <g className="trainee-senpai-upper">
            {/* White keikogi jacket with senior vermilion inner襟 (eri) trim */}
            <path
              d="M23 64 C23 52.5 33 48 50 48 C67 48 77 52.5 77 64 C77 68 72 69 68 67 L69 70 L31 70 L32 67 C28 69 23 68 23 64 Z"
              fill={GI_SHADE}
            />
            <path
              d="M23 61 C23 50 33 46 50 46 C67 46 77 50 77 61 C77 65 72 66 68 64 L69 67.5 L31 67.5 L32 64 C28 66 23 65 23 61 Z"
              fill={CREAM}
            />
            <path d="M41.5 46.5 L50 61.5 L58.5 46.5 Z" fill="var(--c-lacquer)" />
            <path
              d="M40.5 46.5 L53 63.5 M59.5 46.5 L48.5 58"
              stroke={GI_SHADE}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Senior dark obi sash with gold-and-vermilion cord knot */}
            <rect x="30" y="64" width="40" height="5.2" rx="2.6" fill={INK} />
            <rect x="30" y="62" width="40" height="4.8" rx="2.4" fill="var(--c-lacquer)" />
            <circle cx="50" cy="64.4" r="3.2" fill="var(--c-gold)" />
            <circle cx="50" cy="63.6" r="2.8" fill="var(--c-glow)" />

            {/* Left hand poised calmly on hip */}
            <circle cx="27" cy="64.5" r="5" fill={SKIN_SHADE} />
            <circle cx="27" cy="63" r="5" fill={SKIN} />

            {/* Neck & ears */}
            <rect x="44" y="42" width="12" height="9" rx="4.5" fill={SKIN_SHADE} />
            <rect x="44.5" y="40.5" width="11" height="8" rx="4" fill={SKIN} />
            <circle cx="27" cy="35.5" r="5" fill={SKIN_SHADE} />
            <circle cx="27" cy="34" r="5" fill={SKIN} />
            <circle cx="27.5" cy="34.4" r="2.2" fill={SKIN_WARM} />
            <circle cx="73" cy="35.5" r="5" fill={SKIN_SHADE} />
            <circle cx="73" cy="34" r="5" fill={SKIN} />
            <circle cx="72.5" cy="34.4" r="2.2" fill={SKIN_WARM} />

            {/* Big chibi head (+3 shade lip + skin + top-left highlight) */}
            <rect x="27" y="16" width="46" height="34" rx="17" fill={SKIN_SHADE} />
            <rect x="27" y="13" width="46" height="34" rx="17" fill={SKIN} />
            <ellipse
              cx="37"
              cy="21"
              rx="7.5"
              ry="3"
              transform="rotate(-15 37 21)"
              fill={CREAM}
              opacity="0.42"
            />

            {/* Swept-back samurai hair & sculpted chonmage (丁髷) topknot */}
            <path
              d="M24.5 28 C24.5 13.5 34.5 9.5 50 9.5 C65.5 9.5 75.5 13.5 75.5 28 L74 35 C72 31 71 27 69 23 C65 20 61 22 57 24 C53 20 47 20 43 24 C39 22 35 20 31 23 C29 27 28 31 26 35 Z"
              fill={HAIR_BACK}
            />
            <path
              d="M25 25.5 C25 12 35 8 50 8 C65 8 75 12 75 25.5 L73.5 32.5 C71.5 28.5 70.5 25 68.5 21.5 C64.5 18.5 60.5 20.5 56.5 22.5 C52.5 18.5 47.5 18.5 43.5 22.5 C39.5 20.5 35.5 18.5 31.5 21.5 C29.5 25 28.5 28.5 26.5 32.5 Z"
              fill={HAIR_FRONT}
            />
            <g className="trainee-senpai-chonmage">
              {/* Motoyui white paper cord wrap */}
              <rect x="45.5" y="9" width="9" height="5.5" rx="2.5" fill={GI_SHADE} />
              <rect x="45.5" y="7.8" width="9" height="4.8" rx="2.4" fill={CREAM} />
              {/* Forward-folded chonmage topknot fan */}
              <path d="M43 9.5 C43 3.5 57 3.5 57 9.5 C55 12 45 12 43 9.5 Z" fill={HAIR_BACK} />
              <path
                d="M42.5 7.5 C42.5 1.8 57.5 1.8 57.5 7.5 C55.5 10.2 44.5 10.2 42.5 7.5 Z"
                fill={HAIR_FRONT}
              />
              <path
                d="M45.5 5.2 Q50 3.5 54.5 5.2"
                stroke={HAIR_SHINE}
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />
            </g>

            {/* Senior hachimaki headband & fluttering ties */}
            <g className="trainee-senpai-ties">
              <path
                d="M72 21.5 L86 15.5 L84 22.5 Z M72 24 L87 26.5 L82 31.5 Z"
                fill="var(--c-lacquer)"
              />
              <path
                d="M72 19.5 L85 14 L83 21 Z M72 22.2 L86 24.5 L81 29.5 Z"
                fill="var(--c-accent)"
              />
            </g>
            <rect x="26" y="20" width="48" height="6.4" rx="3.2" fill="var(--c-lacquer)" />
            <rect x="26" y="18.2" width="48" height="6" rx="3" fill="var(--c-accent)" />
            <circle cx="50" cy="21.2" r="3.4" fill="var(--c-gold)" />
            <circle cx="50" cy="20.6" r="2.8" fill="var(--c-glow)" />

            {/* Composed senpai face with confident smirk */}
            <ellipse cx="34.5" cy="39.5" rx="4.2" ry="2.4" fill="var(--c-petal)" opacity="0.72" />
            <ellipse cx="65.5" cy="39.5" rx="4.2" ry="2.4" fill="var(--c-petal)" opacity="0.72" />
            <path
              d={
                state === 'hit' || isDefeat
                  ? 'M34.5 28.5 L44 25.5 M65.5 28.5 L56 25.5'
                  : 'M34.5 26.5 L44.5 28.5 M65.5 25.5 L55.5 28.5'
              }
              stroke={INK}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            {isDefeat ? (
              <g>
                <path
                  d="M36 35.5 Q41 38.8 45.5 35.5 M54.5 35.5 Q59 38.8 64 35.5"
                  stroke={INK}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={spiralEyePath(22, 16, -1)}
                  stroke="var(--c-secondary)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.75"
                />
              </g>
            ) : (
              <YokaiEyes
                state={state}
                x1={41}
                x2={59}
                y={35}
                iris={INK}
                pupil="var(--c-secondary)"
                hurtStroke={INK}
              />
            )}
            <ellipse cx="50" cy="39" rx="1.2" ry="0.8" fill={SKIN_WARM} />
            {state === 'attack' ? (
              <path d="M45 41.5 C46 46.5 55 46.5 56 41.5 Z" fill="var(--c-lacquer)" />
            ) : (
              <path
                d={isDefeat ? 'M46.5 43 Q50 44.2 53.5 43' : 'M45.5 42.8 Q50.5 45.2 55.5 41.2'}
                stroke={INK}
                strokeWidth="2.3"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Defeat sweat drop during respectful rei bow */}
            {isDefeat && (
              <g className="trainee-senpai-sweat">
                <path
                  d="M72 28 C74.8 32.5 74.8 36 72 36 C69.2 36 69.2 32.5 72 28 Z"
                  fill="var(--c-secondary-soft)"
                  stroke="var(--c-secondary)"
                  strokeWidth="1.1"
                />
                <circle cx="71.2" cy="33.5" r="1" fill={SHINE} />
              </g>
            )}

            {/* Bokken resting confidently on the right shoulder (or lowered in rei) */}
            <g className="trainee-senpai-weapon">
              {isDefeat ? (
                <g>
                  <path
                    d="M56 68 L86 78"
                    stroke={OAK_SHADE}
                    strokeWidth="6.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M56 66.2 L86 76.2"
                    stroke="var(--c-glow)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <circle cx="68" cy="70.5" r="5" fill={SKIN_SHADE} />
                  <circle cx="68" cy="69" r="5" fill={SKIN} />
                </g>
              ) : (
                <g>
                  {/* Seasoned oak bokken blade resting diagonally up over right shoulder */}
                  <path
                    d="M62 62 L91 18"
                    stroke={OAK_SHADE}
                    strokeWidth="7.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M62 59.5 L91 15.5"
                    stroke="var(--c-glow)"
                    strokeWidth="5.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M71 45 L88 19"
                    stroke={SHINE}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    opacity="0.78"
                  />
                  {/* Wrapped dark tsuka handle & gold-rimmed tsuba */}
                  <path d="M62 61 L69 50.5" stroke={INK} strokeWidth="6" strokeLinecap="round" />
                  <ellipse
                    cx="70"
                    cy="49"
                    rx="6.2"
                    ry="3"
                    transform="rotate(34 70 49)"
                    fill="var(--c-gold)"
                  />
                  <ellipse
                    cx="70"
                    cy="48"
                    rx="5.6"
                    ry="2.6"
                    transform="rotate(34 70 48)"
                    fill="var(--c-glow)"
                  />
                  {/* Right chibi hand gripping shouldered bokken */}
                  <circle cx="65" cy="57.5" r="5.2" fill={SKIN_SHADE} />
                  <circle cx="65" cy="56" r="5.2" fill={SKIN} />
                </g>
              )}
            </g>
          </g>

          {/* Fast double strike (nidan-waza) twin slash arcs toward lower-left */}
          <g className="trainee-senpai-slash-1">
            <path d="M32 24 C10 38 8 64 26 82 C16 62 18 42 32 24 Z" fill="var(--c-glow)" />
            <path
              d="M27 30 C13 42 12 60 24 75"
              stroke={SHINE}
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
          <g className="trainee-senpai-slash-2">
            <path d="M10 42 C24 30 48 38 56 62 C42 46 24 42 10 42 Z" fill="var(--c-accent)" />
            <path
              d="M15 43 C27 35 44 41 51 57"
              stroke={SHINE}
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>

        <YokaiDamageFlash
          renderSilhouette={(fill) => (
            <g className="trainee-senpai-body">
              <path d="M30 63.5 L70 63.5 L75 88 Q50 91 25 88 Z" fill={fill} />
              <path d="M23 61 C23 50 33 46 50 46 C67 46 77 50 77 61 L69 69 L31 69 Z" fill={fill} />
              <rect x="24" y="8" width="52" height="42" rx="18" fill={fill} />
              <ellipse cx="50" cy="6" rx="8" ry="5" fill={fill} />
              <path
                d="M62 61 L91 16"
                stroke={fill}
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}
        />
      </g>
    </>
  );
}
