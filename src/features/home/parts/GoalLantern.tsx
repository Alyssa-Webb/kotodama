/** Today's goal as a paper lantern: its light fills from the bottom as XP comes in. */
import './noren.css';

export function GoalLantern({ pct }: { pct: number }) {
  const p = Math.max(0, Math.min(100, pct));
  const full = p >= 100;
  return (
    <span
      className={`goal-lantern${full ? ' goal-lantern-full' : ''}`}
      role="img"
      aria-label={`Daily goal ${p}%`}
    >
      <span className="goal-lantern-halo" aria-hidden="true" />
      <svg className="goal-lantern-svg" viewBox="0 0 30 40" aria-hidden="true">
        <ellipse
          cx="15"
          cy="22.2"
          rx="12.5"
          ry="11.2"
          fill={
            full ? 'var(--c-gold)' : 'color-mix(in srgb, var(--c-panel-edge) 54%, var(--c-hud-bg))'
          }
        />
        <ellipse
          cx="15"
          cy="19.8"
          rx="12.5"
          ry="11.2"
          fill="color-mix(in srgb, var(--c-hud-ink) 80%, var(--c-panel-edge))"
        />
      </svg>
      <span className="goal-lantern-chamber" aria-hidden="true">
        <span className="goal-lantern-fill" style={{ transform: `scaleY(${p / 100})` }} />
      </span>
      <svg className="goal-lantern-svg" viewBox="0 0 30 40" aria-hidden="true">
        {/* Hanging cord from the noren rod & brass loop */}
        <rect x="13.8" y="0" width="2.4" height="7" rx="1.2" fill="var(--c-hud-bg)" />
        <circle cx="15" cy="5.8" r="2" fill="var(--c-panel-edge)" />
        {/* Curved horizontal chōchin ribs */}
        <path
          d="M4.2 15.2 Q15 12.6 25.8 15.2 M2.8 19.8 Q15 18 27.2 19.8 M4.4 24.6 Q15 27 25.6 24.6"
          stroke="var(--c-hud-bg)"
          strokeWidth="1.25"
          strokeLinecap="round"
          fill="none"
          opacity="0.34"
        />
        {/* Top black lacquer cap */}
        <rect x="7.5" y="7.4" width="15" height="3.8" rx="1.9" fill="var(--c-hud-bg)" />
        <rect
          x="7.5"
          y="6.1"
          width="15"
          height="3.6"
          rx="1.8"
          fill="color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-secondary))"
        />
        <rect
          x="9.6"
          y="6.9"
          width="4.8"
          height="1.1"
          rx="0.55"
          fill="var(--c-hud-ink)"
          opacity="0.36"
        />
        {/* Bottom black lacquer cap & tassel */}
        <rect x="8" y="30.6" width="14" height="3.8" rx="1.9" fill="var(--c-hud-bg)" />
        <rect
          x="8"
          y="29.3"
          width="14"
          height="3.6"
          rx="1.8"
          fill="color-mix(in srgb, var(--c-hud-bg) 82%, var(--c-secondary))"
        />
        <circle cx="15" cy="34.1" r="1.7" fill="var(--c-panel-edge)" />
        <path
          d="M15 35 C17.1 36.1 17.5 39.1 15 39.6 C12.5 39.1 12.9 36.1 15 35 Z"
          fill="var(--c-accent)"
        />
        {/* Soft top-left highlight */}
        <ellipse
          cx="10.2"
          cy="14"
          rx="4.2"
          ry="1.9"
          transform="rotate(-24 10.2 14)"
          fill="var(--c-hud-ink)"
          opacity="0.44"
        />
      </svg>
    </span>
  );
}
