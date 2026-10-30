import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { cutFromSwipe, DEFAULT_SWIPE, isSwipe, type Pt } from './cut';

const parse = (poly: string): Pt[] =>
  poly.split(', ').map((p) => p.split(' ').map((v) => parseFloat(v)) as unknown as Pt);

describe('cutFromSwipe', () => {
  it('spans the whole screen and follows the swipe direction', () => {
    const c = cutFromSwipe([20, 80], [80, 20]);
    const first = c.points[0]!;
    const last = c.points[c.points.length - 1]!;
    expect(first[0]).toBeLessThan(0);
    expect(last[0]).toBeGreaterThan(100);
    expect(c.angle).toBeCloseTo(-45, 0);
  });

  it('is jagged, not a straight line', () => {
    const c = cutFromSwipe(...DEFAULT_SWIPE);
    const [a, b] = [c.points[0]!, c.points[c.points.length - 1]!];
    const offLine = c.points.slice(1, -1).map((p) => {
      const cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
      return Math.abs(cross) / Math.hypot(b[0] - a[0], b[1] - a[1]);
    });
    expect(Math.max(...offLine)).toBeGreaterThan(0.5);
    expect(Math.max(...offLine)).toBeLessThan(6);
  });

  it('shares the exact jagged edge between both halves', () => {
    const c = cutFromSwipe([10, 30], [90, 60]);
    const a = parse(c.sideA);
    const b = parse(c.sideB);
    const edge = c.points.length;
    expect(a.slice(0, edge)).toEqual(b.slice(0, edge));
    expect(a.length).toBeGreaterThan(edge);
    expect(b.length).toBeGreaterThan(edge);
  });

  it('points side A up the screen whichever way the player swipes (property)', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.double({ min: 0, max: 100, noNaN: true }),
          fc.double({ min: 0, max: 100, noNaN: true }),
        ),
        fc.tuple(
          fc.double({ min: 0, max: 100, noNaN: true }),
          fc.double({ min: 0, max: 100, noNaN: true }),
        ),
        (from, to) => {
          const c = cutFromSwipe(from, to);
          return c.normal[1] <= 1e-9 && Math.abs(Math.hypot(...c.normal) - 1) < 1e-6;
        },
      ),
    );
  });

  it('falls back to the default stroke for a zero-length swipe', () => {
    expect(cutFromSwipe([50, 50], [50, 50]).angle).toBeCloseTo(
      cutFromSwipe(...DEFAULT_SWIPE).angle,
    );
  });
});

describe('isSwipe', () => {
  it('treats short touches as taps', () => {
    expect(isSwipe([50, 50], [51, 51], 390, 844)).toBe(false);
    expect(isSwipe([10, 60], [80, 40], 390, 844)).toBe(true);
  });
});
