// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { animations } from '../world';
import { HAPTICS } from '../../schema/theme';
import { haptic, pulses, setHaptics } from './haptics';

describe('pulses', () => {
  it('keeps every on segment for vibrate patterns', () => {
    expect(pulses([10, 30, 18], false)).toEqual([
      { at: 0, ms: 10 },
      { at: 40, ms: 18 },
    ]);
  });
  it('merges pulses closer than 45 ms into one iPhone tick', () => {
    expect(pulses([6, 20, 6, 60, 6], true).map((p) => p.at)).toEqual([0, 92]);
  });
});

describe('haptic vocabulary', () => {
  it('defines every named pattern in design/animations.json', () => {
    for (const name of HAPTICS) expect(animations.haptics?.[name]?.length).toBeGreaterThan(0);
  });
  it('keeps every pattern short enough to never outlast its moment', () => {
    for (const name of HAPTICS) {
      const total = animations.haptics![name]!.reduce((a, b) => a + b, 0);
      expect(total).toBeLessThanOrEqual(400);
    }
  });
});

describe('haptic()', () => {
  afterEach(() => {
    setHaptics(true);
    vi.restoreAllMocks();
  });
  it('plays the pattern through navigator.vibrate on Android', () => {
    const vibrate = vi.fn(() => true);
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true });
    haptic('thud');
    expect(vibrate).toHaveBeenCalledWith(animations.haptics!.thud);
  });
  it('does nothing when the player turned haptics off', () => {
    const vibrate = vi.fn(() => true);
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true });
    setHaptics(false);
    haptic('thud');
    expect(vibrate).not.toHaveBeenCalled();
  });
});
