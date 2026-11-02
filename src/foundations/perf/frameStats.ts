/** A frame slower than this is visibly late on a 60 Hz screen, which would take 16.7 ms. */
export const SLOW_FRAME_MS = 25;
/** A gap longer than this means the tab was hidden or the phone paused it, not that a frame stuttered. */
export const PAUSE_MS = 1000;

export interface FrameStats {
  fps: number;
  /** Average fps across the slowest 1% of frames: what stutter feels like. */
  low: number;
  worstMs: number;
  /** Percent of frames slower than SLOW_FRAME_MS. */
  slowPercent: number;
}

/** Summarizes the time between frames, in milliseconds. Returns null with nothing to measure. */
export function frameStats(intervals: readonly number[]): FrameStats | null {
  const frames = intervals.filter((ms) => ms > 0 && ms < PAUSE_MS);
  if (frames.length === 0) return null;
  const sorted = [...frames].sort((a, b) => b - a);
  const total = sum(frames);
  const slowest = sorted.slice(0, Math.max(1, Math.ceil(frames.length / 100)));
  return {
    fps: Math.round((frames.length * 1000) / total),
    low: Math.round((slowest.length * 1000) / sum(slowest)),
    worstMs: Math.round(sorted[0]!),
    slowPercent: Math.round(
      (frames.filter((ms) => ms > SLOW_FRAME_MS).length * 100) / frames.length,
    ),
  };
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
