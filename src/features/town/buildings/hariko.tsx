/**
 * Shared Edo hariko (張り子) folk-toy palette and painted motifs for Town buildings.
 * Uses only theme CSS variables from design/tokens.json.
 */

export interface HarikoPalette {
  /** Matte chalky gofun white body (--c-surface / --c-panel family) */
  gofun: string;
  /** Secondary warm gofun cream */
  gofunWarm: string;
  /** +3 bottom shade lip under gofun forms */
  gofunShade: string;
  /** Hand-painted shu-vermilion (--c-accent) */
  vermilion: string;
  /** +3 bottom shade lip under vermilion forms */
  vermilionShade: string;
  /** Hand-painted ai-indigo (--c-secondary) */
  indigo: string;
  /** +3 bottom shade lip under indigo forms */
  indigoShade: string;
  /** Hand-painted kinpaku gold / warm wood (--c-gold) */
  gold: string;
  /** Bright gold-leaf accent (--c-panel-edge / --c-glow) */
  goldLeaf: string;
  /** +3 bottom shade lip under gold/wood forms */
  goldShade: string;
  /** Hand-painted matsu pine green (--c-success) */
  pine: string;
  /** +3 bottom shade lip under pine forms */
  pineShade: string;
  /** Sculpted stone / clay base (--c-fog family) */
  stone: string;
  /** +3 bottom shade lip under stone forms */
  stoneShade: string;
  /** Window interior fill (glowing when lit, dark when unlit) */
  winFill: string;
  /** Window inner warm shine */
  winShine: string;
  /** Always-dark sumi ink for eyes/crevices/panes (--c-hud-bg) */
  sumi: string;
  /** Always-light highlight & catchlight (--c-hud-ink) */
  highlight: string;
}

export function harikoPalette(lit: boolean): HarikoPalette {
  if (lit) {
    return {
      gofun: 'color-mix(in srgb, var(--c-surface) 80%, var(--c-hud-ink))',
      gofunWarm: 'color-mix(in srgb, var(--c-panel) 84%, var(--c-hud-ink))',
      gofunShade: 'color-mix(in srgb, var(--c-panel) 60%, var(--c-hud-bg))',
      vermilion: 'var(--c-accent)',
      vermilionShade: 'color-mix(in srgb, var(--c-accent) 60%, var(--c-hud-bg))',
      indigo: 'var(--c-secondary)',
      indigoShade: 'color-mix(in srgb, var(--c-secondary) 58%, var(--c-hud-bg))',
      gold: 'var(--c-gold)',
      goldLeaf: 'var(--c-panel-edge)',
      goldShade: 'color-mix(in srgb, var(--c-gold) 58%, var(--c-hud-bg))',
      pine: 'var(--c-success)',
      pineShade: 'color-mix(in srgb, var(--c-success) 58%, var(--c-hud-bg))',
      stone: 'color-mix(in srgb, var(--c-fog) 78%, var(--c-surface-alt))',
      stoneShade: 'color-mix(in srgb, var(--c-fog) 58%, var(--c-hud-bg))',
      winFill: 'var(--c-glow)',
      winShine: 'var(--c-coin-shine)',
      sumi: 'var(--c-hud-bg)',
      highlight: 'var(--c-hud-ink)',
    };
  }
  return {
    gofun: 'color-mix(in srgb, var(--c-panel) 78%, var(--c-fog))',
    gofunWarm: 'color-mix(in srgb, var(--c-surface-alt) 78%, var(--c-fog))',
    gofunShade: 'color-mix(in srgb, var(--c-panel) 54%, var(--c-hud-bg))',
    vermilion: 'color-mix(in srgb, var(--c-accent) 72%, var(--c-fog))',
    vermilionShade: 'color-mix(in srgb, var(--c-accent) 50%, var(--c-hud-bg))',
    indigo: 'color-mix(in srgb, var(--c-secondary) 72%, var(--c-fog))',
    indigoShade: 'color-mix(in srgb, var(--c-secondary) 48%, var(--c-hud-bg))',
    gold: 'color-mix(in srgb, var(--c-gold) 72%, var(--c-fog))',
    goldLeaf: 'color-mix(in srgb, var(--c-panel-edge) 72%, var(--c-fog))',
    goldShade: 'color-mix(in srgb, var(--c-gold) 50%, var(--c-hud-bg))',
    pine: 'color-mix(in srgb, var(--c-success) 70%, var(--c-fog))',
    pineShade: 'color-mix(in srgb, var(--c-success) 48%, var(--c-hud-bg))',
    stone: 'color-mix(in srgb, var(--c-fog) 70%, var(--c-surface-alt))',
    stoneShade: 'color-mix(in srgb, var(--c-fog) 50%, var(--c-hud-bg))',
    winFill: 'color-mix(in srgb, var(--c-secondary-soft) 55%, var(--c-hud-bg))',
    winShine: 'color-mix(in srgb, var(--c-fog) 48%, var(--c-hud-bg))',
    sumi: 'var(--c-hud-bg)',
    highlight: 'var(--c-hud-ink)',
  };
}

/** Reusable hariko paper lantern that glows warmly when the district is lit. */
export function PaperLantern({ x, y, lit }: { x: number; y: number; lit: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {lit && <circle cx="0" cy="4.5" r="10.5" fill="var(--c-glow)" className="town-lantern-glow" />}
      <rect x="-0.8" y="-3" width="1.6" height="4" rx="0.8" fill="var(--c-hud-bg)" />
      {/* +3 shade lip */}
      <ellipse
        cx="0"
        cy="6.8"
        rx="4.3"
        ry="5"
        fill="color-mix(in srgb, var(--c-lacquer) 72%, var(--c-hud-bg))"
      />
      {/* Main lantern body */}
      <ellipse
        cx="0"
        cy="4.6"
        rx="4.3"
        ry="5"
        fill={lit ? 'var(--c-glow)' : 'color-mix(in srgb, var(--c-panel) 68%, var(--c-fog))'}
      />
      {/* Hand-painted vermilion band across lantern belly */}
      <path
        d="M-3.8 4.4 Q0 5.6 3.8 4.4"
        fill="none"
        stroke="var(--c-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={lit ? 0.85 : 0.55}
      />
      {/* Top & bottom sumi caps */}
      <rect x="-2.5" y="-0.8" width="5" height="1.8" rx="0.9" fill="var(--c-hud-bg)" />
      <rect x="-2.2" y="8.4" width="4.4" height="1.8" rx="0.9" fill="var(--c-hud-bg)" />
    </g>
  );
}

/** Hand-painted five-petal hariko ume (plum blossom) motif. */
export function PlumBlossom({
  x,
  y,
  scale = 1,
  petalFill,
  centerFill,
}: {
  x: number;
  y: number;
  scale?: number;
  petalFill: string;
  centerFill: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="-2.4" r="1.45" fill={petalFill} />
      <circle cx="2.3" cy="-0.7" r="1.45" fill={petalFill} />
      <circle cx="1.4" cy="2" r="1.45" fill={petalFill} />
      <circle cx="-1.4" cy="2" r="1.45" fill={petalFill} />
      <circle cx="-2.3" cy="-0.7" r="1.45" fill={petalFill} />
      <circle cx="0" cy="0" r="1.05" fill={centerFill} />
    </g>
  );
}

/** Trio of hand-daubed maru dots used on Edo hariko toys. */
export function MaruCluster({
  x,
  y,
  fill,
  r = 1.35,
}: {
  x: number;
  y: number;
  fill: string;
  r?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`} fill={fill}>
      <circle cx="-1.8" cy="1" r={r} />
      <circle cx="1.8" cy="1" r={r} />
      <circle cx="0" cy="-1.6" r={r} />
    </g>
  );
}
