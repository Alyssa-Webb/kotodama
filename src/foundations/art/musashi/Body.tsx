/**
 * Musashi's garments and pose choreography:
 * dark indigo kimono with white under-collar, rust-orange obi with hanging tail,
 * dark brown hakama, white tabi & zori sandals, plus folded/bow/ready arms.
 */
import type { JSX } from 'react';
import { BackHair, Head } from './Head';
import {
  CORD_GOLD,
  CREAM,
  CREAM_SHADE,
  HAKAMA,
  HAKAMA_PLEAT,
  HAKAMA_SHADE,
  INK,
  KIMONO,
  KIMONO_FOLD,
  KIMONO_SHADE,
  type MusashiPose,
  OBI,
  OBI_SHADE,
  SKIN,
  SKIN_SHADE,
} from './palette';
import { DaishoHilts, DaishoScabbards, DrawnKatana, DrawnWakizashi } from './Swords';

/** Single white tabi sock + dark-soled zori sandal with brown hanao V-straps. */
function TabiZoriFoot({ x }: { x: number }): JSX.Element {
  const cx = x + 7;
  return (
    <g>
      {/* Zori sandal sole (+2 ink lip + warm straw-lacquer footbed) */}
      <rect x={x - 0.5} y="106.5" width="15" height="6" rx="3" fill={INK} />
      <rect x={x} y="105" width="14" height="5" rx="2.5" fill={CORD_GOLD} />
      {/* White tabi split-toe sock (+2.5 shade lip + cream upper) */}
      <rect x={x + 1} y="100.5" width="12" height="9.2" rx="4.6" fill={CREAM_SHADE} />
      <rect x={x + 1} y="98.5" width="12" height="8.8" rx="4.4" fill={CREAM} />
      {/* Subtle split-toe cleft & dark brown hanao straps */}
      <path
        d={`M${cx} 105.5 V107.6`}
        stroke={INK}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d={`M${x + 2} 107.2 L${cx} 102.8 L${x + 12} 107.2`}
        stroke={HAKAMA_SHADE}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx={cx} cy="103" r="1.3" fill="var(--c-lacquer)" />
    </g>
  );
}

/** Grounded lower body: white tabi & zori plus puffy dark-brown hakama trousers. */
function LowerBody({ pose }: { pose: MusashiPose }): JSX.Element {
  const isReady = pose === 'ready';
  const isBow = pose === 'bow';
  const leftFootX = isReady ? 36 : isBow ? 43.5 : 41;
  const rightFootX = isReady ? 70 : isBow ? 62.5 : 65;

  const hakamaPath = isReady
    ? 'M37 85 H83 L86.5 99.5 C86.5 103.5 81.5 105 74 104.5 H62.5 L60 95 L57.5 104.5 H46 C38.5 105 33.5 103.5 33.5 99.5 Z'
    : 'M39 85 H81 L83.5 99.5 C83.5 103.5 79 105 72 104.5 H62 L60 95.5 L58 104.5 H48 C41 105 36.5 103.5 36.5 99.5 Z';

  return (
    <g className="musashi-lower">
      <TabiZoriFoot x={leftFootX} />
      <TabiZoriFoot x={rightFootX} />

      {/* Puffy dark-brown hakama (+3 shade lip + flat base + pleats + top-left highlight) */}
      <g transform="translate(0 3)">
        <path d={hakamaPath} fill={HAKAMA_SHADE} />
      </g>
      <path d={hakamaPath} fill={HAKAMA} />
      <path
        d={
          isReady
            ? 'M45 87.5 L42.5 101.5 M52.5 87.5 L51.5 102 M67.5 87.5 L68.5 102 M75 87.5 L77.5 101.5'
            : 'M46.5 87.5 L44.5 101.5 M53 87.5 L52.5 102 M67 87.5 L67.5 102 M73.5 87.5 L75.5 101.5'
        }
        stroke={HAKAMA_PLEAT}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="45"
        cy="91.5"
        rx="5"
        ry="1.8"
        transform="rotate(-14 45 91.5)"
        fill={CREAM}
        opacity="0.32"
      />
    </g>
  );
}

/** Pose-specific sleeves, arms, and sword placement. */
function PoseArms({ pose }: { pose: MusashiPose }): JSX.Element {
  if (pose === 'ready') {
    return (
      <g>
        {/* Raised right kimono sleeve, chibi fist & long katana (jodan high stance) */}
        <g className="musashi-sword-arm-r">
          <DrawnKatana />
          <path
            d="M42 56.5 C34 54.5 26 51.5 19 47.5 C16.5 52.5 16.5 60 20 65.5 C27 66.5 35 64 42 61 Z"
            fill={KIMONO_SHADE}
            transform="translate(0 3)"
          />
          <path
            d="M42 56.5 C34 54.5 26 51.5 19 47.5 C16.5 52.5 16.5 60 20 65.5 C27 66.5 35 64 42 61 Z"
            fill={KIMONO}
          />
          {/* Open dark kimono sleeve cuff & white inner juban edge */}
          <ellipse cx="19.5" cy="56.5" rx="2.8" ry="7.2" fill={INK} />
          <path d="M18.8 50.2 V55.5" stroke={CREAM} strokeWidth="1.8" strokeLinecap="round" />
          {/* Right chibi hand gripping the raised katana hilt */}
          <circle cx="15.2" cy="53" r="5" fill={SKIN_SHADE} />
          <circle cx="15.2" cy="50.8" r="5" fill={SKIN} />
          <circle cx="18.2" cy="49.5" r="2.1" fill={SKIN} />
        </g>

        {/* Forward-low left kimono sleeve, chibi fist & shorter wakizashi (gedan/seigan guard) */}
        <g className="musashi-sword-arm-l">
          <path
            d="M78 57 C83 59.5 87.5 64 89 69.5 C88 76 83 79.5 77 77.5 L75 65 Z"
            fill={KIMONO_SHADE}
            transform="translate(0 3)"
          />
          <path
            d="M78 57 C83 59.5 87.5 64 89 69.5 C88 76 83 79.5 77 77.5 L75 65 Z"
            fill={KIMONO}
          />
          <DrawnWakizashi />
          {/* Left chibi hand gripping the forward-low wakizashi hilt */}
          <circle cx="86" cy="74.2" r="4.8" fill={SKIN_SHADE} />
          <circle cx="86" cy="72" r="4.8" fill={SKIN} />
          <circle cx="88.5" cy="70.2" r="2" fill={SKIN} />
        </g>
      </g>
    );
  }

  if (pose === 'bow') {
    return (
      <g>
        {/* Respectful ritsurei sleeves & hands resting flat along the front of the thighs */}
        <path
          d="M40 56 C33 58 29.5 64 30.5 73 C31.5 78 36 80 43 79 L45 66 Z"
          fill={KIMONO_SHADE}
          transform="translate(0 3)"
        />
        <path
          d="M40 56 C33 58 29.5 64 30.5 73 C31.5 78 36 80 43 79 L45 66 Z"
          fill={KIMONO}
        />
        <path
          d="M80 56 C87 58 90.5 64 89.5 73 C88.5 78 84 80 77 79 L75 66 Z"
          fill={KIMONO_SHADE}
          transform="translate(0 3)"
        />
        <path
          d="M80 56 C87 58 90.5 64 89.5 73 C88.5 78 84 80 77 79 L75 66 Z"
          fill={KIMONO}
        />
        <ellipse cx="42.5" cy="81.8" rx="5" ry="4" fill={SKIN_SHADE} />
        <ellipse cx="42.5" cy="79.8" rx="5" ry="3.8" fill={SKIN} />
        <ellipse cx="77.5" cy="81.8" rx="5" ry="4" fill={SKIN_SHADE} />
        <ellipse cx="77.5" cy="79.8" rx="5" ry="3.8" fill={SKIN} />
        <DaishoHilts />
      </g>
    );
  }

  // Idle: calm Zen swordmaster posture with arms folded neatly into his wide kimono sleeves.
  return (
    <g>
      {/* Left kimono sleeve (viewer's right) tucked calmly inward */}
      <path
        d="M79 56 C86.5 58 91 64 90 71.5 C89.2 76.2 84 77.5 76 75.5 L63 73.5 L64 65.5 Z"
        fill={KIMONO_SHADE}
        transform="translate(0 3)"
      />
      <path
        d="M79 56 C86.5 58 91 64 90 71.5 C89.2 76.2 84 77.5 76 75.5 L63 73.5 L64 65.5 Z"
        fill={KIMONO}
      />

      {/* Right kimono sleeve (viewer's left) folded serenely across the front */}
      <path
        d="M41 56 C33.5 58 29 64 30 71.5 C30.8 76.5 36.5 77.5 45 76 L58.5 73.5 C61 73 61.5 66.5 58 65.5 L44 64.5 Z"
        fill={KIMONO_SHADE}
        transform="translate(0 3)"
      />
      <path
        d="M41 56 C33.5 58 29 64 30 71.5 C30.8 76.5 36.5 77.5 45 76 L58.5 73.5 C61 73 61.5 66.5 58 65.5 L44 64.5 Z"
        fill={KIMONO}
      />
      {/* Tucked sleeve fold crease & subtle white inner cuff peek */}
      <path
        d="M36 66.5 Q47 68.5 57.5 67"
        stroke={KIMONO_FOLD}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M58.8 67.2 V71.8" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />

      {/* Paired katana & wakizashi hilts resting plainly visible at his left hip */}
      <DaishoHilts />
    </g>
  );
}

/** Complete Musashi figure body + head assembly. */
export function Body({ pose }: { pose: MusashiPose }): JSX.Element {
  const isBow = pose === 'bow';
  const isReady = pose === 'ready';
  const upperPoseTransform = isBow
    ? 'translate(1.5 6.5) rotate(6 60 85)'
    : isReady
      ? 'translate(0 1.5)'
      : undefined;

  return (
    <g className="musashi-figure">
      <LowerBody pose={pose} />

      {/* Upper torso, obi, swords & head (hinges from the hips at y=85 during bow) */}
      <g className="musashi-upper">
        <g transform={upperPoseTransform}>
          <BackHair />

          {/* Dark-indigo kimono lower skirt below obi (+3 shade lip + center overlap panel) */}
          <path d="M40 79 H80 L83 90.5 Q60 93 37 90.5 Z" fill={KIMONO_SHADE} />
          <path d="M40 77.5 H80 L83 88 Q60 90.5 37 88 Z" fill={KIMONO} />
          <path d="M51 78.5 H69 L70.5 88.8 Q60 89.8 49.5 88.8 Z" fill={KIMONO_SHADE} />

          {/* Dark-indigo kimono chest torso & white under-collar (juban) */}
          <path
            d="M39 58 C39 54.5 47 53.5 60 53.5 C73 53.5 81 54.5 81 58 L80 78 H40 Z"
            fill={KIMONO_SHADE}
          />
          <path
            d="M39 56.5 C39 53.5 47 52.5 60 52.5 C73 52.5 81 53.5 81 56.5 L80 76 H40 Z"
            fill={KIMONO}
          />
          <path d="M51 53.5 L60 68.5 L69 53.5 Z" fill={CREAM_SHADE} />
          <path d="M52 53 L60 66.8 L68 53 Z" fill={CREAM} />
          {/* Crossed kimono lapels (left over right) & shoulder highlight */}
          <path
            d="M49.5 53.5 L63.5 74 M70.5 53.5 L59.8 68"
            stroke={KIMONO_SHADE}
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx="45.5"
            cy="58.8"
            rx="5.2"
            ry="1.9"
            transform="rotate(-18 45.5 58.8)"
            fill={CREAM}
            opacity="0.38"
          />

          {/* Rust-orange obi sash & hanging tail */}
          <rect x="38.5" y="75.8" width="43" height="8.5" rx="4.2" fill={OBI_SHADE} />
          <rect x="38.5" y="73.2" width="43" height="8.2" rx="4.1" fill={OBI} />
          <path
            d="M41.5 77.4 H78.5"
            stroke={OBI_SHADE}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.65"
          />
          <ellipse
            cx="47"
            cy="75.2"
            rx="4.8"
            ry="1.3"
            transform="rotate(-8 47 75.2)"
            fill={CREAM}
            opacity="0.35"
          />
          <g className="musashi-obi-tail">
            <path d="M63.5 80.5 L68.5 80 L70.2 91.5 L64.8 92 Z" fill={OBI_SHADE} />
            <path d="M63.5 78.8 L68.5 78.3 L70.2 89.5 L64.8 90 Z" fill={OBI} />
          </g>

          {/* Paired daisho scabbards tucked through the outer obi wrap on his left hip */}
          <DaishoScabbards pose={pose} />
          <rect x="70.5" y="74.2" width="10.5" height="6.8" rx="3.2" fill={OBI} />

          {/* Pose-specific arms, sleeves & daisho swords */}
          <PoseArms pose={pose} />

          {/* Oversized chibi head & wild front locks */}
          <Head pose={pose} />
        </g>
      </g>
    </g>
  );
}
