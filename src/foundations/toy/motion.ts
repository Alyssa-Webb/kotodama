/**
 * Motion curves for the toy stage. Time-based (seconds or 0–1 progress), never frame-based, so
 * every animation looks identical at 60, 90 or 120 Hz and recovers cleanly from a dropped frame.
 */

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Progress of `t` through the window [a, b], clamped. */
export const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

export const easeOutCubic = (x: number) => 1 - (1 - clamp01(x)) ** 3;
export const easeInCubic = (x: number) => clamp01(x) ** 3;
export const easeInOutCubic = (x: number) => {
  const c = clamp01(x);
  return c < 0.5 ? 4 * c * c * c : 1 - (-2 * c + 2) ** 3 / 2;
};

/**
 * Damped spring settling from 0 to 1: overshoots once, then rests. `bounce` 0 is critically
 * damped; 0.5 is a lively toy bounce. Closed form, so it is exact at any frame time.
 */
export function spring(x: number, bounce = 0.35): number {
  const t = Math.max(0, x);
  if (t >= 1) return 1;
  const zeta = 1 - bounce * 0.9;
  const omega = 9;
  if (zeta >= 1) return 1 - (1 + omega * t) * Math.exp(-omega * t);
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  const decay = Math.exp(-zeta * omega * t);
  const v = 1 - decay * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t));
  // Blend into exactly 1 at the end so the last frame never pops.
  const tail = span(t, 0.8, 1);
  return v * (1 - tail) + tail;
}

/** Squash-and-stretch for an impact at progress x (volume preserving). */
export function squash(x: number, amount = 0.35): { xz: number; y: number } {
  const c = clamp01(x);
  const s = Math.sin(c * Math.PI) * Math.exp(-c * 2.5) * amount;
  return { y: 1 - s, xz: 1 / Math.sqrt(Math.max(0.2, 1 - s)) };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
