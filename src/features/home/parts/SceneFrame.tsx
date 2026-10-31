/** Dressing for the Home scene: a tiled eave along its top and a hanging signboard naming the place. */
import { useId } from 'react';
import './noren.css';

export function SceneEave() {
  const rawId = useId();
  const patId = `kawara-${rawId.replace(/:/g, '')}`;
  return (
    <span className="scene-eave" aria-hidden="true">
      <svg className="scene-eave-svg" aria-hidden="true">
        <defs>
          <pattern id={patId} x="0" y="0" width="36" height="22" patternUnits="userSpaceOnUse">
            {/* Curved hiragawara pan tile (+2.6 shade lip + main + concave trough) */}
            <path
              d="M-4 0 H25 V14 Q10.5 18 -4 14 Z M32 0 H61 V14 Q46.5 18 32 14 Z"
              fill="var(--c-hud-bg)"
            />
            <path
              d="M-4 0 H25 V11.5 Q10.5 15.5 -4 11.5 Z M32 0 H61 V11.5 Q46.5 15.5 32 11.5 Z"
              fill="var(--eave-tile-pan)"
            />
            <path d="M0 0 H21 V7.2 Q10.5 10.2 0 7.2 Z" fill="var(--eave-tile-trough)" />
            <ellipse
              cx="6.5"
              cy="4.2"
              rx="4.2"
              ry="1.4"
              transform="rotate(-10 6.5 4.2)"
              fill="var(--c-hud-ink)"
              opacity="0.24"
            />
            {/* Plump round nokimarugawara end-cap tile (+2.8 shade lip + medallion + highlight) */}
            <rect x="21.7" y="0" width="13.6" height="10.2" fill="var(--eave-tile-cap)" />
            <circle cx="28.5" cy="12.6" r="6.8" fill="var(--c-hud-bg)" />
            <circle cx="28.5" cy="9.8" r="6.8" fill="var(--eave-tile-cap)" />
            <circle cx="28.5" cy="10" r="4.1" fill="var(--eave-tile-trough)" />
            <circle cx="28.5" cy="10" r="1.8" fill="var(--c-hud-ink)" opacity="0.45" />
            <ellipse
              cx="26"
              cy="6.6"
              rx="2.7"
              ry="1.25"
              transform="rotate(-20 26 6.6)"
              fill="var(--c-hud-ink)"
              opacity="0.4"
            />
          </pattern>
        </defs>
        {/* Wooden eave beam under the overhanging clay roof tiles */}
        <rect x="0" y="19.2" width="100%" height="2.8" fill="var(--c-hud-bg)" opacity="0.28" />
        <rect x="0" y="16" width="100%" height="3.6" fill="var(--eave-beam-lip)" />
        <rect x="0" y="11.5" width="100%" height="5.2" fill="var(--eave-beam)" />
        <rect x="0" y="12.4" width="100%" height="1.2" fill="var(--c-hud-ink)" opacity="0.2" />
        <rect x="0" y="0" width="100%" height="22" fill={`url(#${patId})`} />
      </svg>
    </span>
  );
}

export function PlaceSign({ place }: { place: string }) {
  return (
    <p className="home-place place-sign">
      <span className="place-sign-decor" aria-hidden="true">
        <svg className="place-sign-cord place-sign-cord-l" viewBox="0 0 10 15" aria-hidden="true">
          <rect x="3.5" y="0" width="3" height="10.5" rx="1.5" fill="var(--c-hud-bg)" />
          <rect x="4.1" y="0" width="1.6" height="9.8" rx="0.8" fill="var(--c-panel-edge)" />
          <circle cx="5" cy="11.6" r="2.8" fill="var(--c-hud-bg)" />
          <circle cx="5" cy="10.8" r="2.5" fill="var(--c-panel-edge)" />
          <circle cx="4.3" cy="10.1" r="0.85" fill="var(--c-coin-shine)" opacity="0.75" />
        </svg>
        <svg className="place-sign-cord place-sign-cord-r" viewBox="0 0 10 15" aria-hidden="true">
          <rect x="3.5" y="0" width="3" height="10.5" rx="1.5" fill="var(--c-hud-bg)" />
          <rect x="4.1" y="0" width="1.6" height="9.8" rx="0.8" fill="var(--c-panel-edge)" />
          <circle cx="5" cy="11.6" r="2.8" fill="var(--c-hud-bg)" />
          <circle cx="5" cy="10.8" r="2.5" fill="var(--c-panel-edge)" />
          <circle cx="4.3" cy="10.1" r="0.85" fill="var(--c-coin-shine)" opacity="0.75" />
        </svg>
        <span className="place-sign-shine" />
      </span>
      {place}
    </p>
  );
}
