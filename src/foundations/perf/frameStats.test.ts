import { describe, expect, it } from 'vitest';
import { frameStats } from './frameStats';

describe('frameStats', () => {
  it('reports a steady 60 fps with nothing slow', () => {
    expect(frameStats(Array<number>(120).fill(1000 / 60))).toEqual({
      fps: 60,
      low: 60,
      worstMs: 17,
      slowPercent: 0,
    });
  });

  it('shows stutter in the low and the worst frame, even when the average looks fine', () => {
    const intervals = [...Array<number>(198).fill(1000 / 60), 100, 100];
    const stats = frameStats(intervals);
    expect(stats?.fps).toBe(57);
    expect(stats?.low).toBe(10);
    expect(stats?.worstMs).toBe(100);
    expect(stats?.slowPercent).toBe(1);
  });

  it('ignores a pause from a hidden tab', () => {
    expect(frameStats([1000 / 60, 5000, 1000 / 60])?.worstMs).toBe(17);
  });

  it('returns null with nothing to measure', () => {
    expect(frameStats([])).toBeNull();
    expect(frameStats([5000])).toBeNull();
  });
});
