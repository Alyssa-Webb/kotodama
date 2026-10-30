import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { easeInOutCubic, span, spring, squash } from './motion';
import { worldFor } from './scenes';

describe('spring', () => {
  it('starts at 0, ends exactly at 1, and overshoots when bouncy', () => {
    expect(spring(0)).toBeCloseTo(0);
    expect(spring(1)).toBe(1);
    expect(spring(2)).toBe(1);
    const peak = Math.max(...Array.from({ length: 100 }, (_, i) => spring(i / 100, 0.5)));
    expect(peak).toBeGreaterThan(1);
  });
  it('never overshoots when critically damped', () => {
    for (let i = 0; i <= 100; i++) expect(spring(i / 100, 0)).toBeLessThanOrEqual(1.0001);
  });
  it('is continuous: no frame jumps more than a small step (property)', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.99, noNaN: true }),
        fc.double({ min: 0, max: 0.6, noNaN: true }),
        (x, b) => Math.abs(spring(x + 0.01, b) - spring(x, b)) < 0.2,
      ),
    );
  });
});

describe('squash', () => {
  it('rests at 1 before and after the impact and preserves volume', () => {
    expect(squash(0).y).toBeCloseTo(1);
    expect(squash(1).y).toBeCloseTo(1, 1);
    const mid = squash(0.2);
    expect(mid.y).toBeLessThan(1);
    expect(mid.xz * mid.xz * mid.y).toBeCloseTo(1, 5);
  });
});

describe('curves', () => {
  it('span clamps to its window', () => {
    expect(span(0, 0.2, 0.4)).toBe(0);
    expect(span(0.3, 0.2, 0.4)).toBeCloseTo(0.5);
    expect(span(1, 0.2, 0.4)).toBe(1);
  });
  it('easeInOutCubic is symmetric', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1);
  });
});

describe('worldFor', () => {
  const scenes = {
    lesson: ['grove', 'shrine', 'dojo'] as const,
    dojo: 'dojo',
    boss: 'dojo',
    rush: 'shrine',
  } as const;
  it('rotates lesson worlds by unit and maps other trainings directly', () => {
    const s = { ...scenes, lesson: [...scenes.lesson] };
    expect(worldFor(s, 'lesson', 0)).toBe('grove');
    expect(worldFor(s, 'lesson', 4)).toBe('shrine');
    expect(worldFor(s, 'boss')).toBe('dojo');
    expect(worldFor(s, 'rush')).toBe('shrine');
  });
});
