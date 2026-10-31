/**
 * Musashi's chibi head, wild loose shoulder-length black mane, thick brows,
 * half-lidded two-catchlight eyes, and small knowing smirk.
 */
import type { JSX } from 'react';
import {
  CREAM,
  HAIR_BACK,
  HAIR_FRONT,
  HAIR_MID,
  HAIR_SHINE,
  INK,
  type MusashiPose,
  SKIN,
  SKIN_SHADE,
  SKIN_WARM,
} from './palette';

/** Wild loose shoulder-length back mane & spiky side flares (rendered behind neck/collar). */
export function BackHair(): JSX.Element {
  const silhouette = [
    'M60 11',
    'C76 11 90 15.5 97 23',
    'L102 24.5 L96.5 29',
    'C100.5 32 103 35.5 103.5 38.5',
    'L97.5 39.5',
    'C100 42.5 101.5 45.5 100.5 48',
    'L94.5 47.5',
    'C96.5 51.5 96.5 55.5 94 58.5',
    'L88.5 54.5 L87 59.5 L81.5 55.5 L78.5 59.5',
    'L41.5 59.5 L38.5 55.5 L33 59.5 L31.5 54.5 L26 58.5',
    'C23.5 55.5 23.5 51.5 25.5 47.5',
    'L19.5 48',
    'C18.5 45.5 20 42.5 22.5 39.5',
    'L16.5 38.5',
    'C17 35.5 19.5 32 23.5 29',
    'L18 24.5 L23 23',
    'C30 15.5 44 11 60 11 Z',
  ].join(' ');

  return (
    <g className="musashi-hair-back">
      {/* +3 bottom shade lip in pure ink */}
      <g transform="translate(0 3)">
        <path d={silhouette} fill={INK} />
      </g>
      <path d={silhouette} fill={HAIR_BACK} />
    </g>
  );
}

/** Single half-lidded chibi eye with two catchlights (retains Musashi's calm narrowed gaze). */
function HalfLiddedEye({
  cx,
  gazeX,
  sharp,
}: {
  cx: number;
  gazeX: number;
  sharp: boolean;
}): JSX.Element {
  const ix = cx + gazeX;
  const lidY = sharp ? 39 : 38.5;

  return (
    <g>
      {/* 1. Outer dark chibi eye ellipse */}
      <ellipse cx={cx} cy="41.2" rx="4.7" ry="4.3" fill={INK} />
      {/* 2. Deep indigo iris nudged down */}
      <ellipse cx={ix} cy="42.3" rx="3.4" ry="2.9" fill="var(--c-secondary)" />
      {/* 3. Dark ink pupil */}
      <circle cx={ix} cy="41.3" r="1.85" fill={INK} />
      {/* 4. Two catchlights (large top-left, small bottom-right) */}
      <circle cx={ix - 1.55} cy="40.2" r="1.35" fill={CREAM} />
      <circle cx={ix + 1.55} cy="42.9" r="0.72" fill={CREAM} />
      {/* 5. Flat skin upper-lid hood to narrow the eye */}
      <rect x={cx - 5.4} y="35.5" width="10.8" height={lidY - 35.5} fill={SKIN} />
    </g>
  );
}

/** Musashi's neck, ears, face, and center-parted front hair locks. */
export function Head({ pose }: { pose: MusashiPose }): JSX.Element {
  const isBow = pose === 'bow';
  const isReady = pose === 'ready';
  const gazeX = isReady ? 1.3 : 0;

  return (
    <g className="musashi-head-group">
      {/* Neck (+3 shade lip + base skin) */}
      <rect x="53" y="50" width="14" height="11" rx="5.5" fill={SKIN_SHADE} />
      <rect x="53.5" y="48.5" width="13" height="9.5" rx="4.8" fill={SKIN} />

      {/* Ears (+2.5 shade lip + base skin + warm inner hollow) */}
      <circle cx="32" cy="43.5" r="6" fill={SKIN_SHADE} />
      <circle cx="32" cy="41.2" r="6" fill={SKIN} />
      <circle cx="32.8" cy="41.6" r="2.7" fill={SKIN_WARM} />

      <circle cx="88" cy="43.5" r="6" fill={SKIN_SHADE} />
      <circle cx="88" cy="41.2" r="6" fill={SKIN} />
      <circle cx="87.2" cy="41.6" r="2.7" fill={SKIN_WARM} />

      {/* Oversized chibi head (+3 molded-toy bottom shade band + skin + top-left highlight) */}
      <rect x="35" y="21" width="50" height="36" rx="18" fill={SKIN_SHADE} />
      <rect x="35" y="18" width="50" height="36" rx="18" fill={SKIN} />
      <ellipse
        cx="48"
        cy="25"
        rx="7.2"
        ry="2.6"
        transform="rotate(-14 48 25)"
        fill={CREAM}
        opacity="0.4"
      />

      {/* Facial expression (dips gently forward during the respectful rei bow) */}
      <g transform={isBow ? 'translate(0 2.4)' : undefined}>
        {/* Subtle warm cheek blush */}
        <ellipse cx="42" cy="45.8" rx="4.2" ry="2.2" fill="var(--c-petal)" opacity="0.38" />
        <ellipse cx="78" cy="45.8" rx="4.2" ry="2.2" fill="var(--c-petal)" opacity="0.38" />

        {/* Eyes: respectfully closed in bow, calm & blinking in idle, sharp & unblinking in ready */}
        {isBow ? (
          <g stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M43.2 41.2 Q48.5 44.2 53.8 41.2" />
            <path d="M66.2 41.2 Q71.5 44.2 76.8 41.2" />
          </g>
        ) : (
          <g className={pose === 'idle' ? 'musashi-blink' : undefined}>
            <HalfLiddedEye cx={48.5} gazeX={gazeX} sharp={isReady} />
            <HalfLiddedEye cx={71.5} gazeX={gazeX} sharp={isReady} />
            {/* Confident heavy upper-lash bars */}
            <path
              d={
                isReady
                  ? 'M42.8 38.2 Q48.5 38.2 54.2 39.6 M65.8 39.6 Q71.5 38.2 77.2 38.2'
                  : 'M42.8 38.6 Q48.5 37.8 54 38.9 M66 38.9 Q71.5 37.8 77.2 38.6'
              }
              stroke={INK}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* Thick, sculpted confident samurai eyebrows */}
        {isBow ? (
          <g fill={INK}>
            <path d="M40.5 32.5 C41 30.2 44 29.8 53.5 32.8 C54.2 34 53.4 35.2 52 35 L41 34 Z" />
            <path d="M79.5 32.5 C79 30.2 76 29.8 66.5 32.8 C65.8 34 66.6 35.2 68 35 L79 34 Z" />
          </g>
        ) : (
          <g fill={INK} transform={isReady ? 'translate(0 0.8)' : undefined}>
            <path d="M39.8 31.6 C40.2 28.8 43 28.4 54.2 33.4 C54.8 34.6 54 36 52.4 35.8 L40.4 33.4 Z" />
            <path d="M80.2 31.6 C79.8 28.8 77 28.4 65.8 33.4 C65.2 34.6 66 36 67.6 35.8 L79.6 33.4 Z" />
          </g>
        )}

        {/* Tiny chibi nose & small knowing smirk */}
        <ellipse cx="60" cy="45.2" rx="1.4" ry="0.95" fill={SKIN_WARM} />
        <path
          d={
            isBow
              ? 'M56.5 49 Q60 50.2 63.5 49'
              : isReady
                ? 'M56 49.2 Q60.5 48 64.8 48.2'
                : 'M55.8 48.8 Q60.2 50.8 64.8 47.6'
          }
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Untamed crown tufts & center-parted curtain bangs framing the temples & cheeks */}
      <g className="musashi-hair-front">
        {/* +2.5 bottom shade lip under the front curtain locks */}
        <path
          d="M60 24.5 C53 19.5 43 21.5 39.5 31 C38.8 37 38.8 43 37.2 48 C34.5 47 33.5 42.5 34 36 C30 37.5 26 40 23.5 41.5 C24.5 34 28 24 35 18 C42 12.5 51 11 60 12.5 C69 11 78 12.5 85 18 C92 24 95.5 34 96.5 41.5 C94 40 90 37.5 86 36 C86.5 42.5 85.5 47 82.8 48 C81.2 43 81.2 37 80.5 31 C77 21.5 67 19.5 60 24.5 Z"
          fill={INK}
        />
        {/* Main front curtain locks & crown */}
        <path
          d="M60 22.2 C53 17.5 43 19.5 39.5 28.8 C38.8 35 38.8 41 37.2 46 C34.5 45 33.5 40.5 34 34 C30 35.5 26 38 23.5 39.5 C24.5 32 28 22 35 16 C42 10.5 51 9.2 60 10.8 C69 9.2 78 10.5 85 16 C92 22 95.5 32 96.5 39.5 C94 38 90 35.5 86 34 C86.5 40.5 85.5 45 82.8 46 C81.2 41 81.2 35 80.5 28.8 C77 19.5 67 17.5 60 22.2 Z"
          fill={HAIR_FRONT}
        />

        {/* Spiky top-crown strands */}
        <g className="musashi-hair-tufts">
          <path
            d="M55 12 C52 7.5 56 6.5 60 10.2 C63 6.2 69 6.8 67 11.2 Z"
            fill={INK}
            transform="translate(0 1.8)"
          />
          <path d="M55 12 C52 7.5 56 6.5 60 10.2 C63 6.2 69 6.8 67 11.2 Z" fill={HAIR_MID} />
        </g>

        {/* Sculpted strand creases, shine strokes & one top-left highlight */}
        <path
          d="M60 11.5 V21.5 M45 14 C39 19 36 26 36 35 M75 14 C81 19 84 26 84 35"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
        <path
          d="M35 21 C42 14.5 51 13.5 57.5 16.5 M63 16.5 C70 13.8 78 15 84 21"
          stroke={HAIR_SHINE}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.58"
        />
        <ellipse
          cx="44"
          cy="17"
          rx="6.2"
          ry="2.2"
          transform="rotate(-16 44 17)"
          fill={CREAM}
          opacity="0.38"
        />
      </g>
    </g>
  );
}
