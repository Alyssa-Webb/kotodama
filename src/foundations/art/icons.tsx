/** Game icons drawn as SVG (theme colors via CSS variables), so they stay crisp and themeable. */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 22, rest: SVGProps<SVGSVGElement> = {}) => ({
  width: size,
  height: size,
  'aria-hidden': true,
  focusable: false,
  ...rest,
});

export function HeartIcon({ size, empty, ...rest }: P & { empty?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" {...base(size, rest)}>
      <path
        d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.2 0 3.6 1.3 4.4 2.6.8-1.3 2.2-2.6 4.4-2.6 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z"
        fill={empty ? 'var(--c-surface-alt)' : 'var(--c-danger)'}
        stroke={empty ? 'var(--c-border)' : 'color-mix(in srgb, var(--c-danger) 60%, var(--c-ink))'}
        strokeWidth="1.4"
      />
      {!empty && (
        <path
          d="M6.5 7.5c-1.4.3-2.2 1.7-1.9 3.1"
          stroke="var(--c-panel)"
          strokeOpacity=".7"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function KobanIcon({ size, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" {...base(size, rest)}>
      <ellipse
        cx="12"
        cy="12"
        rx="7.5"
        ry="10"
        fill="var(--c-gold)"
        stroke="color-mix(in srgb, var(--c-gold) 55%, var(--c-ink))"
        strokeWidth="1.3"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="5.4"
        ry="7.8"
        fill="none"
        stroke="var(--c-glow)"
        strokeOpacity=".8"
        strokeWidth="0.9"
      />
      {[7, 9.5, 14.5, 17].map((y) => (
        <path
          key={y}
          d={`M8.6 ${y}h6.8`}
          stroke="color-mix(in srgb, var(--c-gold) 60%, var(--c-ink))"
          strokeWidth="0.8"
        />
      ))}
      <rect
        x="10"
        y="10.4"
        width="4"
        height="3.2"
        rx="0.6"
        fill="color-mix(in srgb, var(--c-gold) 60%, var(--c-ink))"
      />
      <path
        d="M8 6.5c.6-1.2 1.6-2 2.8-2.3"
        stroke="var(--c-panel)"
        strokeOpacity=".8"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FlameIcon({ size, lit = true, ...rest }: P & { lit?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" {...base(size, rest)} className={lit ? 'flame-lit' : undefined}>
      <path
        d="M12 22c-4.4 0-7-2.9-7-6.6 0-3.4 2.4-5.4 3.6-8.4.4 1.6 1.3 2.6 2.2 3C10.6 6.5 12.6 3.7 15 2c-.3 3 1.3 5 2.6 6.9 1 1.5 1.4 3 1.4 4.5C19 18.9 16.4 22 12 22Z"
        fill={lit ? 'var(--c-accent)' : 'var(--c-fog)'}
      />
      <path
        d="M12 21c-2.2 0-3.6-1.5-3.6-3.4 0-2 1.6-3.2 2.4-5 .4 1 1 1.6 1.6 1.8.2-1.6 1.2-3 2.3-3.8 0 1.8.9 3 1.6 4.2.4.7.6 1.5.6 2.3 0 2.3-1.6 3.9-4.9 3.9Z"
        fill={lit ? 'var(--c-glow)' : 'var(--c-surface-alt)'}
      />
    </svg>
  );
}

export function CapsuleIcon({ size, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" {...base(size, rest)}>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="var(--c-panel)"
        stroke="var(--c-border)"
        strokeWidth="1.2"
      />
      <path d="M3 12a9 9 0 0 1 18 0Z" fill="var(--c-secondary)" />
      <rect x="2.6" y="11" width="18.8" height="2" fill="var(--c-panel-edge)" />
      <circle
        cx="12"
        cy="12"
        r="2.4"
        fill="var(--c-panel)"
        stroke="var(--c-panel-edge)"
        strokeWidth="1.2"
      />
      <path
        d="M7 7.5c1-1.2 2.4-2 4-2.2"
        stroke="var(--c-panel)"
        strokeOpacity=".7"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LanternIcon({ size, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" {...base(size, rest)}>
      <path d="M12 1v3" stroke="var(--c-ink)" strokeWidth="1.2" />
      <rect x="8.5" y="3.5" width="7" height="2" rx=".6" fill="var(--c-ink)" />
      <ellipse cx="12" cy="12" rx="7" ry="6.8" fill="var(--c-accent)" />
      {[-4, 0, 4].map((dx) => (
        <path
          key={dx}
          d={`M${12 + dx} 5.4q${dx * 0.6} 6.6 0 13.2`}
          stroke="color-mix(in srgb, var(--c-accent) 50%, var(--c-ink))"
          strokeWidth=".7"
          fill="none"
        />
      ))}
      <ellipse cx="12" cy="12" rx="3.6" ry="4.6" fill="var(--c-glow)" opacity=".55" />
      <rect x="8.5" y="18.6" width="7" height="2" rx=".6" fill="var(--c-ink)" />
    </svg>
  );
}

export function StarIcon({ size, on = true, ...rest }: P & { on?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" {...base(size, rest)}>
      <path
        d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9Z"
        fill={on ? 'var(--c-gold)' : 'var(--c-surface-alt)'}
        stroke={on ? 'color-mix(in srgb, var(--c-gold) 55%, var(--c-ink))' : 'var(--c-border)'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {on && (
        <path d="M9 9.6 12 4.8" stroke="var(--c-glow)" strokeWidth="1.3" strokeLinecap="round" />
      )}
    </svg>
  );
}

// ---- tab bar icons (24x24, stroke style)
const tab = (size = 26) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export const TabHome = () => (
  <svg {...tab()}>
    <path d="M2.5 11.5 12 4l9.5 7.5" />
    <path d="M4 10.2c2.6-.2 4.8-1.4 8-4.6 3.2 3.2 5.4 4.4 8 4.6" />
    <path d="M5.5 11v9h13v-9" />
    <path d="M10 20v-5h4v5" />
  </svg>
);
export const TabPath = () => (
  <svg {...tab()}>
    <path d="M3 6.5c6-1.5 12-1.5 18 0" />
    <path d="M5 9.5h14" />
    <path d="M7 6v15M17 6v15" />
  </svg>
);
export const TabDojo = () => (
  <svg {...tab()}>
    <path d="m4 20 16-16M20 20 4 4" />
    <path d="m3 17 4 4M17 21l4-4" />
  </svg>
);
export const TabShop = () => (
  <svg {...tab()}>
    <path d="M3 5h18" />
    <path d="M4 5v6c1.2 1 2.4 1 3.6 0V5M7.6 5v6c1.2 1 2.4 1 3.6 0V5M11.2 5v6c1.2 1 2.4 1 3.6 0V5M14.8 5v6c1.2 1 2.4 1 3.6 0V5M18.4 5v6c.6.5 1.1.7 1.6.6" />
    <path d="M5 13v7h14v-7" />
  </svg>
);
export const TabMore = () => (
  <svg {...tab()}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
  </svg>
);
