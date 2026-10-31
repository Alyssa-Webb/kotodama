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
  OBI,
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
        d="M73 84.8 Q83 93.5 93.5 99.5"
        stroke={INK}
        strokeWidth="6.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M73 82.5 Q83 91.2 93.5 97.2"
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
        d="M74 79 Q89 89.5 106.5 96.5"
        stroke={INK}
        strokeWidth="6.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M74 76.5 Q89 87 106.5 94"
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

      {/* Sageo cord wrap & kurikata knot when sheathed; omitted in ready so scabbards read purely as empty black saya */}
      {!isReady && (
        <g>
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
        </g>
      )}

      {/* Outer obi hip strap holding the two scabbards at his left hip */}
      <rect x="70.5" y="74.2" width="10.5" height="6.8" rx="3.2" fill={OBI} />

      {/* Empty scabbard mouths (koiguchi) flush with the obi edge when blades are drawn */}
      {isReady && (
        <g className="musashi-scabbard-mouths">
          <ellipse
            cx="74.2"
            cy="76.6"
            rx="1.6"
            ry="2.6"
            transform="rotate(34 74.2 76.6)"
            fill={INK}
            stroke={CREAM}
            strokeWidth="0.6"
            strokeOpacity="0.3"
          />
          <ellipse
            cx="73.2"
            cy="82.6"
            rx="1.4"
            ry="2.3"
            transform="rotate(34 73.2 82.6)"
            fill={INK}
            stroke={CREAM}
            strokeWidth="0.6"
            strokeOpacity="0.28"
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

/** Drawn shorter wakizashi held forward in Musashi's left hand (Niten Ichi-ryu seigan guard). */
export function DrawnWakizashi(): JSX.Element {
  return (
    <g>
      {/* Clearly shorter curved steel blade (~23u long, held forward clear of the hip scabbards) */}
      <path
        d="M94.5 60.5 Q106.5 57.2 118.2 51.8 L116.8 55.8 Q106.5 61.2 95.2 64.5 Z"
        fill={STEEL_SHADE}
      />
      <path d="M94.5 59.2 Q106.5 55.8 118.5 50.8 L117.1 54.5 Q106.5 59.8 95.2 63 Z" fill={STEEL} />
      {/* Razor upper cutting edge */}
      <path
        d="M95.5 59.4 Q106.8 56 117.9 51.2"
        stroke={CREAM}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Traveling glint along the shorter wakizashi blade */}
      <g transform="translate(96 60.5) rotate(-21.5)">
        <g className="musashi-glint-wakizashi">
          <ellipse cx="0" cy="0" rx="4.5" ry="1.3" fill={SHINE} />
          <path
            d="M0 -3.5 L0.9 -0.9 L3.5 0 L0.9 0.9 L0 3.5 L-0.9 0.9 L-3.5 0 L-0.9 -0.9 Z"
            fill={CREAM}
          />
        </g>
      </g>

      {/* Golden habaki collar & small round guard */}
      <path d="M92.5 62.5 L96.2 61" stroke={CORD_GOLD} strokeWidth="3.8" strokeLinecap="round" />
      <ellipse cx="93.5" cy="63.2" rx="2.6" ry="4.8" transform="rotate(-20 93.5 63.2)" fill={INK} />
      <ellipse
        cx="93.5"
        cy="61.8"
        rx="2.6"
        ry="4.8"
        transform="rotate(-20 93.5 61.8)"
        fill={TSUBA_RIM}
      />

      {/* Shorter wrapped tsuka hilt */}
      <path d="M83.5 66.8 L92.8 63.2" stroke={INK} strokeWidth="5.6" strokeLinecap="round" />
      <path d="M83.5 65.3 L92.8 61.7" stroke={SAYA} strokeWidth="4.8" strokeLinecap="round" />
      <circle cx="86.2" cy="64.3" r="1.1" fill={CORD_GOLD} />
      <circle cx="90" cy="62.8" r="1.1" fill={CORD_GOLD} />
    </g>
  );
}
