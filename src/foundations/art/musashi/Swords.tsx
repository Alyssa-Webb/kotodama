/**
 * Miyamoto Musashi's paired daisho (大小): long katana and clearly shorter wakizashi.
 * Worn edge-up through the left obi in idle/bow, or both drawn in Niten Ichi-ryu stance in ready.
 */
import type { JSX } from 'react';
import {
  CORD_GOLD,
  CORD_SHADE,
  CREAM,
  INK,
  type MusashiPose,
  SAYA,
  SHINE,
  STEEL,
  STEEL_SHADE,
  TSUBA_RIM,
} from './palette';

/** Black-lacquer katana & wakizashi scabbards tucked edge-up through the left hip of the obi. */
export function DaishoScabbards({ pose }: { pose: MusashiPose }): JSX.Element {
  const isReady = pose === 'ready';

  return (
    <g className="musashi-scabbards">
      {/* 1. Clearly shorter wakizashi scabbard (lower/inner, ~14u visible past hip) */}
      <path
        d="M71 84.5 Q82 93.5 93.5 99.5"
        stroke={INK}
        strokeWidth="6.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M71 82.2 Q82 91.2 93.5 97.2"
        stroke={SAYA}
        strokeWidth="5.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M78 86.8 Q85 92 91.5 95.6"
        stroke={CREAM}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.28"
      />

      {/* 2. Long katana scabbard (upper/outer, ~27u visible past hip, edge concave-up) */}
      <path
        d="M72 78.5 Q88 89.5 106.5 96.5"
        stroke={INK}
        strokeWidth="6.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M72 76 Q88 87 106.5 94"
        stroke={SAYA}
        strokeWidth="5.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M80 80.6 Q92 88 104 92.6"
        stroke={CREAM}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.34"
      />

      {/* Golden sageo cord wrap & kurikata knot on the scabbards just below the obi */}
      <path
        d="M75 77.5 L80 81 M74 82.5 L78.5 85.5"
        stroke={CORD_SHADE}
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      <path
        d="M75 76 L80 79.5 M74 81 L78.5 84"
        stroke={CORD_GOLD}
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      {/* Open koiguchi scabbard mouths visible on the hip when both blades are drawn */}
      {isReady && (
        <g>
          <ellipse
            cx="69.5"
            cy="74.5"
            rx="2.6"
            ry="3.6"
            transform="rotate(34 69.5 74.5)"
            fill={TSUBA_RIM}
          />
          <ellipse
            cx="69.5"
            cy="74.5"
            rx="1.4"
            ry="2.2"
            transform="rotate(34 69.5 74.5)"
            fill={INK}
          />
          <ellipse
            cx="68.5"
            cy="81"
            rx="2.3"
            ry="3.2"
            transform="rotate(34 68.5 81)"
            fill={TSUBA_RIM}
          />
          <ellipse
            cx="68.5"
            cy="81"
            rx="1.2"
            ry="1.9"
            transform="rotate(34 68.5 81)"
            fill={INK}
          />
        </g>
      )}
    </g>
  );
}

/** Sheathed hilts & small round guards in front of the obi (both swords plainly visible). */
export function DaishoHilts(): JSX.Element {
  return (
    <g className="musashi-hilts">
      {/* --- Shorter Wakizashi hilt & small round tsuba (lower companion sword) --- */}
      <path
        d="M67.5 83 L58.5 75.5"
        stroke={INK}
        strokeWidth="5.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M67.5 81 L58.5 73.5"
        stroke={SAYA}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Wakizashi diamond tsukamaki wrap */}
      <circle cx="61" cy="75.6" r="1.15" fill={CORD_GOLD} />
      <circle cx="64.2" cy="78.3" r="1.15" fill={CORD_GOLD} />
      {/* Wakizashi small round guard */}
      <ellipse cx="68" cy="82.8" rx="4.4" ry="3.2" transform="rotate(-40 68 82.8)" fill={INK} />
      <ellipse
        cx="68"
        cy="81.3"
        rx="4.4"
        ry="3.2"
        transform="rotate(-40 68 81.3)"
        fill={TSUBA_RIM}
      />
      <ellipse cx="68" cy="81.3" rx="2.6" ry="1.8" transform="rotate(-40 68 81.3)" fill={INK} />

      {/* --- Long Katana hilt & small round tsuba (upper main sword) --- */}
      <path
        d="M69.5 75.2 L55 62.5"
        stroke={INK}
        strokeWidth="6.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M69.5 73 L55 60.3"
        stroke={SAYA}
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Katana diamond tsukamaki wrap */}
      <circle cx="57.8" cy="62.8" r="1.3" fill={CORD_GOLD} />
      <circle cx="61.6" cy="66.1" r="1.3" fill={CORD_GOLD} />
      <circle cx="65.4" cy="69.4" r="1.3" fill={CORD_GOLD} />
      {/* Katana small round guard */}
      <ellipse cx="70" cy="75" rx="5.2" ry="3.7" transform="rotate(-40 70 75)" fill={INK} />
      <ellipse
        cx="70"
        cy="73.3"
        rx="5.2"
        ry="3.7"
        transform="rotate(-40 70 73.3)"
        fill={TSUBA_RIM}
      />
      <ellipse cx="70" cy="73.3" rx="3.1" ry="2.1" transform="rotate(-40 70 73.3)" fill={INK} />
      <circle cx="68.3" cy="71.8" r="0.9" fill={SHINE} opacity="0.7" />
    </g>
  );
}

/** Drawn long katana held high in Musashi's right hand (Niten Ichi-ryu jodan guard). */
export function DrawnKatana(): JSX.Element {
  return (
    <g>
      {/* Long curved steel blade (~39u long, raised high in clean upper-left negative space) */}
      <path
        d="M14.2 42.5 C15.8 29 18.8 15.5 24.5 4.2 L27.2 6.4 C22.2 17.5 19.4 30 18.4 43.2 Z"
        fill={STEEL_SHADE}
      />
      <path
        d="M14.6 41.5 C16.2 28 19.2 14.8 25 3.8 L27.5 5.9 C22.5 16.8 19.8 29.2 18.7 42.2 Z"
        fill={STEEL}
      />
      {/* Razor forward-facing cutting edge */}
      <path
        d="M27 5.5 C22.2 16.5 19.5 28.8 18.4 41.5"
        stroke={CREAM}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Traveling glint along the long katana blade */}
      <g transform="translate(16.8 41) rotate(-76)">
        <g className="musashi-glint-katana">
          <ellipse cx="0" cy="0" rx="5.5" ry="1.4" fill={SHINE} />
          <path
            d="M0 -4.2 L1.1 -1.1 L4.2 0 L1.1 1.1 L0 4.2 L-1.1 1.1 L-4.2 0 L-1.1 -1.1 Z"
            fill={CREAM}
          />
        </g>
      </g>

      {/* Golden habaki collar & small round guard */}
      <path d="M16.2 44.2 L17.4 39.8" stroke={CORD_GOLD} strokeWidth="4.2" strokeLinecap="round" />
      <ellipse cx="16.5" cy="44.6" rx="5.4" ry="2.6" transform="rotate(14 16.5 44.6)" fill={INK} />
      <ellipse
        cx="16.5"
        cy="43.2"
        rx="5.4"
        ry="2.6"
        transform="rotate(14 16.5 43.2)"
        fill={TSUBA_RIM}
      />

      {/* Wrapped tsuka hilt below guard */}
      <path d="M16.2 45.2 L13 59" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M16.2 44 L13 57.8" stroke={SAYA} strokeWidth="5.2" strokeLinecap="round" />
      <circle cx="14.1" cy="54" r="1.2" fill={CORD_GOLD} />
      <circle cx="15.4" cy="47.8" r="1.2" fill={CORD_GOLD} />
    </g>
  );
}

/** Drawn shorter wakizashi held forward low in Musashi's left hand (Niten Ichi-ryu gedan/seigan). */
export function DrawnWakizashi(): JSX.Element {
  return (
    <g>
      {/* Clearly shorter curved steel blade (~23u long, held forward low) */}
      <path
        d="M92.5 68.5 Q104.5 65.2 116.5 59.8 L115.2 63.8 Q104.5 69.2 93.2 72.5 Z"
        fill={STEEL_SHADE}
      />
      <path
        d="M92.5 67.2 Q104.5 63.8 116.8 58.8 L115.4 62.5 Q104.5 67.8 93.2 71 Z"
        fill={STEEL}
      />
      {/* Razor upper cutting edge */}
      <path
        d="M93.5 67.4 Q104.8 64 116.2 59.2"
        stroke={CREAM}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Traveling glint along the shorter wakizashi blade */}
      <g transform="translate(94 68.5) rotate(-21.5)">
        <g className="musashi-glint-wakizashi">
          <ellipse cx="0" cy="0" rx="4.5" ry="1.3" fill={SHINE} />
          <path
            d="M0 -3.5 L0.9 -0.9 L3.5 0 L0.9 0.9 L0 3.5 L-0.9 0.9 L-3.5 0 L-0.9 -0.9 Z"
            fill={CREAM}
          />
        </g>
      </g>

      {/* Golden habaki collar & small round guard */}
      <path d="M90.5 70.5 L94.2 69" stroke={CORD_GOLD} strokeWidth="3.8" strokeLinecap="round" />
      <ellipse
        cx="91.5"
        cy="71.2"
        rx="2.6"
        ry="4.8"
        transform="rotate(-20 91.5 71.2)"
        fill={INK}
      />
      <ellipse
        cx="91.5"
        cy="69.8"
        rx="2.6"
        ry="4.8"
        transform="rotate(-20 91.5 69.8)"
        fill={TSUBA_RIM}
      />

      {/* Shorter wrapped tsuka hilt */}
      <path d="M81.5 74.8 L90.8 71.2" stroke={INK} strokeWidth="5.6" strokeLinecap="round" />
      <path d="M81.5 73.3 L90.8 69.7" stroke={SAYA} strokeWidth="4.8" strokeLinecap="round" />
      <circle cx="84.2" cy="72.3" r="1.1" fill={CORD_GOLD} />
      <circle cx="88" cy="70.8" r="1.1" fill={CORD_GOLD} />
    </g>
  );
}
