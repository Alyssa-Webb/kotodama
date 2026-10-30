/**
 * Geometry for the swipe-to-slice gate. Turns the player's swipe (two points in viewport %) into
 * a jagged cut across the whole screen, the two clip-path polygons that split the bush wall
 * along exactly that cut, the blade's centre and angle, and where leaf scraps fly off. Pure, so
 * it is unit-tested; the gate only renders what this returns.
 */

export type Pt = readonly [number, number];

export interface Cut {
  /** Jagged cut vertices in viewport %, from one screen edge to the other. */
  points: Pt[];
  /** clip-path polygon() bodies for the two halves (side A lies along the normal). */
  sideA: string;
  sideB: string;
  /** Unit normal in % space pointing to side A, for the halves' push-apart motion. */
  normal: Pt;
  center: Pt;
  /** Blade angle in degrees (SVG rotate). */
  angle: number;
  scraps: { x: number; y: number; dx: number; dy: number; rot: number; delay: number }[];
}

/** Default stroke when the player taps or lets the hint time out: low-left to high-right. */
export const DEFAULT_SWIPE: [Pt, Pt] = [
  [-10, 70.5],
  [110, 38.2],
];

const BOX: Pt[] = [
  [-15, -15],
  [115, -15],
  [115, 115],
  [-15, 115],
];

function rng(seed: number) {
  let s = Math.floor(seed * 9301 + 49297) >>> 0 || 7;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/** Where the infinite line through `a` and `b` leaves the box, in order a→b. */
function clipToBox(a: Pt, b: Pt): [Pt, Pt] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const ts: number[] = [];
  const [x0, y0] = BOX[0]!;
  const [x1, y1] = BOX[2]!;
  if (Math.abs(dx) > 1e-9) ts.push((x0 - a[0]) / dx, (x1 - a[0]) / dx);
  if (Math.abs(dy) > 1e-9) ts.push((y0 - a[1]) / dy, (y1 - a[1]) / dy);
  const inside = ts
    .map((t) => [t, a[0] + dx * t, a[1] + dy * t] as const)
    .filter(([, x, y]) => x >= x0 - 1e-6 && x <= x1 + 1e-6 && y >= y0 - 1e-6 && y <= y1 + 1e-6)
    .sort((p, q) => p[0] - q[0]);
  const first = inside[0]!;
  const last = inside[inside.length - 1]!;
  return [
    [first[1], first[2]],
    [last[1], last[2]],
  ];
}

const side = (p: Pt, a: Pt, n: Pt) => (p[0] - a[0]) * n[0] + (p[1] - a[1]) * n[1];
const fmt = (p: Pt) => `${p[0].toFixed(2)}% ${p[1].toFixed(2)}%`;

/** One half: the jagged edge, then the box corners on that side walked back to the start. */
function half(points: Pt[], n: Pt, sign: 1 | -1, center: Pt): string {
  const start = points[0]!;
  const end = points[points.length - 1]!;
  const angleOf = (p: Pt) => Math.atan2(p[1] - center[1], p[0] - center[0]);
  const corners = BOX.filter((c) => sign * side(c, start, n) > 0);
  // Walk from the cut's end around that side's corners back to its start.
  const a0 = angleOf(end);
  const turn = (p: Pt) => {
    const d = angleOf(p) - a0;
    const t = sign * (d < 0 ? d + Math.PI * 2 : d);
    return t < 0 ? t + Math.PI * 2 : t;
  };
  corners.sort((p, q) => turn(p) - turn(q));
  return [...points, ...corners].map(fmt).join(', ');
}

export function cutFromSwipe(from: Pt, to: Pt, seed = 1): Cut {
  let a = from;
  let b = to;
  // Keep the cut running left to right so "side A" is consistently the upper half.
  if (b[0] < a[0]) [a, b] = [b, a];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (len < 1e-6) [a, b] = DEFAULT_SWIPE;
  const [p0, p1] = clipToBox(a, b);
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const total = Math.hypot(dx, dy);
  const ux = dx / total;
  const uy = dy / total;
  // Normal pointing "up" the screen (smaller y) is side A.
  let normal: Pt = [uy, -ux];
  if (normal[1] > 0) normal = [-uy, ux];
  const r = rng(seed);
  const steps = Math.max(10, Math.round(total / 5));
  const points: Pt[] = [p0];
  for (let i = 1; i < steps; i++) {
    const t = i / steps + (r() - 0.5) * (0.6 / steps);
    // Small irregular nicks: mostly gentle, the odd deeper notch, alternating sides.
    const amp = (i % 2 ? 1 : -1) * (0.8 + r() * 1.6) * (r() < 0.18 ? 1.8 : 1);
    points.push([p0[0] + dx * t + normal[0] * amp, p0[1] + dy * t + normal[1] * amp]);
  }
  points.push(p1);
  const center: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const mid: Pt = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
  const scraps = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 0.6) / 9.4;
    const out = i % 2 ? -1 : 1;
    const push = 50 + r() * 40;
    return {
      x: p0[0] + dx * t,
      y: p0[1] + dy * t,
      dx: (normal[0] * out * push + ux * (r() - 0.5) * 30) * 1.1,
      dy: normal[1] * out * push + uy * (r() - 0.5) * 30,
      rot: out * (130 + r() * 80),
      delay: 0.01 + i * 0.012,
    };
  });
  return {
    points,
    sideA: half(points, normal, 1, mid),
    sideB: half(points, normal, -1, mid),
    normal,
    center,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    scraps,
  };
}

/** A swipe counts when it travels far enough; shorter touches are taps. */
export function isSwipe(from: Pt, to: Pt, widthPx: number, heightPx: number): boolean {
  const dx = ((to[0] - from[0]) / 100) * widthPx;
  const dy = ((to[1] - from[1]) / 100) * heightPx;
  return Math.hypot(dx, dy) >= 60;
}
