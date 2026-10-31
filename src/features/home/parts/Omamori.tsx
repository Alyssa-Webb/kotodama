/** A side destination drawn as an omamori charm: Arcade and Spirits, which the tab bar doesn't reach. */
import { Link } from 'react-router';
import './ema.css';

function OmamoriArt({ kind }: { kind: 'arcade' | 'spirits' }) {
  const isArcade = kind === 'arcade';
  const pouchLip = isArcade
    ? 'color-mix(in srgb, var(--c-lacquer) 68%, var(--c-hud-bg))'
    : 'color-mix(in srgb, var(--c-secondary) 44%, var(--c-hud-bg))';
  const pouchMain = isArcade
    ? 'color-mix(in srgb, var(--c-accent) 72%, var(--c-lacquer))'
    : 'color-mix(in srgb, var(--c-secondary) 74%, var(--c-hud-bg))';
  const bandBg = isArcade
    ? 'color-mix(in srgb, var(--c-lacquer) 82%, var(--c-hud-bg))'
    : 'color-mix(in srgb, var(--c-secondary) 52%, var(--c-hud-bg))';

  return (
    <svg viewBox="0 0 52 68" width={26} height={34} aria-hidden="true" focusable="false">
      <ellipse cx="26" cy="65.5" rx="17" ry="2.4" fill="var(--c-shadow)" />

      {/* Top hanging cord loop */}
      <circle
        cx="26"
        cy="9"
        r="4.8"
        stroke="color-mix(in srgb, var(--c-gold) 58%, var(--c-hud-bg))"
        strokeWidth="3.2"
        fill="none"
      />
      <circle cx="26" cy="7.5" r="4.8" stroke="var(--c-glow)" strokeWidth="3" fill="none" />

      {/* Brocade pouch (+4 shade lip + main body + soft top-left highlight) */}
      <path
        d="M15 15.5 H37 L46 26.5 V59 C46 63 43 66 39 66 H13 C9 66 6 63 6 59 V26.5 Z"
        fill={pouchLip}
      />
      <path
        d="M15 11.5 H37 L46 22.5 V55 C46 59 43 62 39 62 H13 C9 62 6 59 6 55 V22.5 Z"
        fill={pouchMain}
      />
      <ellipse
        cx="13.5"
        cy="21"
        rx="5.2"
        ry="2.2"
        transform="rotate(-48 13.5 21)"
        fill="var(--c-hud-ink)"
        opacity="0.4"
      />

      {/* Woven gold brocade pattern band */}
      <rect x="6" y="50" width="40" height="6.5" fill={bandBg} />
      <path d="M6 50 H46 M6 56.5 H46" stroke="var(--c-glow)" strokeWidth="1.2" opacity="0.85" />
      <path
        d="M8 54.8 L12.5 51.6 L17 54.8 L21.5 51.6 L26 54.8 L30.5 51.6 L35 54.8 L39.5 51.6 L44 54.8"
        stroke="var(--c-coin-shine)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Center symbol: spinning-top (koma) for Arcade, tiny wisp for Spirits */}
      {isArcade ? (
        <g transform="rotate(-14 26 35.5)">
          <path d="M23.2 42.5 L26 47.8 L28.8 42.5 Z" fill="var(--c-hud-bg)" />
          <path d="M23.2 40.8 L26 46 L28.8 40.8 Z" fill="var(--c-glow)" />
          <path
            d="M13.5 34.8 C14.5 40.8 20.2 43.8 26 43.8 C31.8 43.8 37.5 40.8 38.5 34.8 Z"
            fill="var(--c-hud-bg)"
          />
          <path
            d="M13.5 32.5 C14.5 38.5 20.2 41.5 26 41.5 C31.8 41.5 37.5 38.5 38.5 32.5 Z"
            fill="color-mix(in srgb, var(--c-secondary) 78%, var(--c-hud-bg))"
          />
          <ellipse cx="26" cy="32.5" rx="12.8" ry="5.2" fill="var(--c-glow)" />
          <ellipse cx="26" cy="32.2" rx="9.6" ry="3.8" fill="var(--c-coin-shine)" />
          <ellipse cx="26" cy="32.2" rx="5.2" ry="2" fill="var(--c-accent)" />
          <rect x="24" y="25.2" width="4" height="8" rx="2" fill="var(--c-hud-bg)" />
          <rect x="24" y="23.8" width="4" height="7.8" rx="2" fill="var(--c-hud-ink)" />
        </g>
      ) : (
        <g>
          <circle cx="37.5" cy="26.5" r="2" fill="var(--c-glow)" opacity="0.85" />
          <circle cx="15" cy="27.5" r="1.4" fill="var(--c-firefly)" opacity="0.65" />
          <path
            d="M26.5 25.8 C33 25.8 37.2 30.2 37.2 35.8 C37.2 42 31.8 46.2 24.2 47.6 C20.8 48.2 17.8 47 16.5 44.6 C19.2 44.6 20.8 42.8 20.2 40.5 C17 39 15.6 36 15.6 33 C15.6 28.6 20.2 25.8 26.5 25.8 Z"
            fill="var(--c-hud-bg)"
          />
          <path
            d="M26.5 23.2 C33 23.2 37.2 27.6 37.2 33.2 C37.2 39.4 31.8 43.6 24.2 45 C20.8 45.6 17.8 44.4 16.5 42 C19.2 42 20.8 40.2 20.2 37.9 C17 36.4 15.6 33.4 15.6 30.4 C15.6 26 20.2 23.2 26.5 23.2 Z"
            fill="var(--c-firefly)"
          />
          <ellipse cx="26.8" cy="32.5" rx="7.2" ry="6.2" fill="var(--c-hud-ink)" />
          <ellipse cx="24" cy="33" rx="1.6" ry="1.9" fill="var(--c-hud-bg)" />
          <circle cx="23.4" cy="32.3" r="0.65" fill="var(--c-hud-ink)" />
          <circle cx="24.5" cy="33.6" r="0.35" fill="var(--c-hud-ink)" />
          <ellipse cx="29.8" cy="33" rx="1.6" ry="1.9" fill="var(--c-hud-bg)" />
          <circle cx="29.2" cy="32.3" r="0.65" fill="var(--c-hud-ink)" />
          <circle cx="30.3" cy="33.6" r="0.35" fill="var(--c-hud-ink)" />
          <ellipse cx="21.5" cy="35" rx="2" ry="1.1" fill="var(--c-petal)" opacity="0.78" />
          <ellipse cx="32.2" cy="35" rx="2" ry="1.1" fill="var(--c-petal)" opacity="0.78" />
        </g>
      )}

      {/* Knotted agemaki cord bow at the neck */}
      <path
        d="M18 18.2 C12 14.2 12 22.2 19.5 20.2 L26 18.2 L32.5 20.2 C40 22.2 40 14.2 34 18.2"
        stroke="color-mix(in srgb, var(--c-gold) 55%, var(--c-hud-bg))"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18 16.5 C12 12.5 12 20.5 19.5 18.5 L26 16.5 L32.5 18.5 C40 20.5 40 12.5 34 16.5"
        stroke="var(--c-glow)"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M23.5 17.5 L20.8 22 M28.5 17.5 L31.2 22"
        stroke="var(--c-glow)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="26" cy="17.8" r="3.3" fill="var(--c-gold)" />
      <circle cx="26" cy="16.5" r="3" fill="var(--c-coin-shine)" />
    </svg>
  );
}

export function Omamori({
  to,
  kind,
  label,
}: {
  to: string;
  kind: 'arcade' | 'spirits';
  label: string;
}) {
  return (
    <Link className={`omamori omamori-${kind}`} to={to}>
      <span className="omamori-charm" aria-hidden="true">
        <OmamoriArt kind={kind} />
      </span>
      <span className="omamori-label">{label}</span>
    </Link>
  );
}
