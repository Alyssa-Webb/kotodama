import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  govern,
  guessTier,
  initialGovernor,
  measureBudget,
  percentile,
  type Tier,
} from './quality';

const frames = (ms: number, n = 60) => Array.from({ length: n }, () => ms);

describe('guessTier', () => {
  it('puts software renderers and 2 GB devices on low', () => {
    expect(guessTier({ gpu: 'Google SwiftShader', cores: 8, memoryGb: 8, mobile: false })).toBe(0);
    expect(guessTier({ gpu: 'Adreno (TM) 740', cores: 8, memoryGb: 2, mobile: true })).toBe(0);
  });
  it('starts iPhones on high and Macs on ultra', () => {
    expect(guessTier({ gpu: 'Apple GPU', cores: 6, memoryGb: undefined, mobile: true })).toBe(2);
    expect(guessTier({ gpu: 'Apple M3', cores: 8, memoryGb: 8, mobile: false })).toBe(3);
  });
  it('starts older Android GPUs on medium', () => {
    expect(guessTier({ gpu: 'Mali-G57 MC2', cores: 8, memoryGb: 4, mobile: true })).toBe(1);
  });
});

describe('measureBudget', () => {
  it('snaps to the display refresh rate', () => {
    expect(measureBudget(frames(16.7))).toBeCloseTo(1000 / 60);
    expect(measureBudget(frames(8.4))).toBeCloseTo(1000 / 120);
    expect(measureBudget([...frames(8.3, 40), ...frames(30, 10)])).toBeCloseTo(1000 / 120);
  });
});

describe('govern', () => {
  it('ignores tiny windows', () => {
    const s = initialGovernor(2);
    expect(govern(s, frames(100, 5))).toBe(s);
  });

  it('needs two slow windows before shedding, and sheds resolution before effects', () => {
    let s = initialGovernor(2);
    s = govern(s, frames(40));
    expect(s.scale).toBe(1);
    s = govern(s, frames(40));
    expect(s).toMatchObject({ tier: 2, scale: 0.85 });
    for (let i = 0; i < 6; i++) s = govern(s, frames(40));
    expect(s.tier).toBe(1);
  });

  it('climbs back only after sustained fast frames and never above the ceiling', () => {
    let s = initialGovernor(1, 2);
    for (let i = 0; i < 7; i++) s = govern(s, frames(16.7));
    expect(s.tier).toBe(1);
    s = govern(s, frames(16.7));
    expect(s.tier).toBe(2);
    for (let i = 0; i < 100; i++) s = govern(s, frames(10));
    expect(s.tier).toBe(2);
    expect(s.scale).toBe(1);
  });

  it('one stutter does not reset good behavior into a downgrade', () => {
    let s = initialGovernor(3);
    s = govern(s, [...frames(16.7, 59), 200]);
    expect(s).toMatchObject({ tier: 3, scale: 1, slowWindows: 0 });
  });

  it('always stays inside the valid range (property)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 3 }),
        fc.array(
          fc.array(fc.double({ min: 1, max: 200, noNaN: true }), { minLength: 20, maxLength: 80 }),
          {
            maxLength: 40,
          },
        ),
        (tier, windows) => {
          let s = initialGovernor(tier as Tier);
          for (const w of windows) s = govern(s, w);
          return s.tier >= 0 && s.tier <= s.ceiling && s.scale >= 0.6 && s.scale <= 1;
        },
      ),
    );
  });
});

describe('percentile', () => {
  it('handles empty input and picks the right rank', () => {
    expect(percentile([], 95)).toBe(0);
    expect(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 90)).toBe(9);
  });
});
