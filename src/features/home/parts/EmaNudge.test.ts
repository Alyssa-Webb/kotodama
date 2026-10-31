import { describe, expect, it } from 'vitest';
import { emaSymbol } from './EmaNudge';

describe('ema symbols', () => {
  it('draws the symbol that matches each reminder', () => {
    expect(emaSymbol('hp-low')).toBe('meal');
    expect(emaSymbol('hp-out')).toBe('meal');
    expect(emaSymbol('streak')).toBe('flame');
    expect(emaSymbol('reviews')).toBe('spirit');
    expect(emaSymbol('town')).toBe('coins');
    expect(emaSymbol('koban')).toBe('capsule');
    expect(emaSymbol('goal')).toBe('check');
    expect(emaSymbol('notice-0')).toBe('scroll');
  });
});
