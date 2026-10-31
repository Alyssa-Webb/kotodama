/**
 * Miyamoto Musashi (宮本武蔵) — the Dojo Master and Dojo mascot.
 * Flat 2D inline SVG + CSS animations (transform & opacity only), driven by theme tokens.
 */
import type { JSX } from 'react';
import { Body } from './Body';
import './musashi.css';
import type { MusashiPose } from './palette';

export type { MusashiPose };

export function Musashi({
  pose = 'idle',
  size = 120,
  facing = 'right',
  className,
}: {
  pose?: MusashiPose;
  size?: number;
  facing?: 'left' | 'right';
  className?: string;
}): JSX.Element {
  const classes = ['musashi', `musashi-pose-${pose}`, className].filter(Boolean).join(' ');
  const shadowRx = pose === 'ready' ? 34 : 28;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={classes}
      role="img"
      aria-label="Musashi, the Dojo Master"
    >
      <g transform={facing === 'left' ? 'translate(120 0) scale(-1 1)' : undefined}>
        {/* Grounded tatami shadow */}
        <ellipse
          className="musashi-shadow"
          cx="60"
          cy="112"
          rx={shadowRx}
          ry="5"
          fill="var(--c-shadow)"
        />

        {/* Main animated character group */}
        <g className="musashi-breathe">
          <Body pose={pose} />
        </g>
      </g>
    </svg>
  );
}
