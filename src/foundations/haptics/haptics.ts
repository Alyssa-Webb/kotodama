/**
 * Haptics: one named vocabulary (design/animations.json "haptics"), two backends.
 * - Android and other browsers with navigator.vibrate play the on/off pattern as written.
 * - iPhone Safari has no vibration API. Toggling a native <input switch> plays the system's
 *   light "selection" tick (Safari 18+), so each "on" segment of a pattern becomes one tick.
 *   That is the most a web app can do on iOS; it is documented in docs/adr/0007.
 * Called from tap handlers, so the first pulse lands in the same frame as the visual.
 */
import type { HapticName } from '../../schema/theme';
import { animations } from '../world';
import { isIOS, prefersReducedMotion } from '../platform';

export interface Pulse {
  /** ms after the call. */
  at: number;
  /** ms of vibration (Android); iOS ticks ignore length. */
  ms: number;
}

/** Turns an on/off pattern into pulses; iOS merges pulses closer than 45 ms (one tick each). */
export function pulses(pattern: readonly number[], ios: boolean): Pulse[] {
  const out: Pulse[] = [];
  let t = 0;
  pattern.forEach((ms, i) => {
    if (i % 2 === 0 && ms > 0) {
      const last = out[out.length - 1];
      if (!ios || !last || t - last.at >= 45) out.push({ at: t, ms });
    }
    t += ms;
  });
  return out;
}

let enabled = true;
let iosSwitch: HTMLLabelElement | null = null;

export function setHaptics(on: boolean) {
  enabled = on;
}

function iosTick() {
  if (!iosSwitch) {
    const label = document.createElement('label');
    label.setAttribute('aria-hidden', 'true');
    label.style.cssText =
      'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    input.tabIndex = -1;
    label.appendChild(input);
    document.body.appendChild(label);
    iosSwitch = label;
  }
  iosSwitch.click();
}

function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/** Plays a named pattern. Safe to call anywhere: unsupported devices simply do nothing. */
export function haptic(name: HapticName | 'none') {
  if (!enabled || name === 'none' || typeof document === 'undefined') return;
  const pattern = animations.haptics?.[name];
  if (!pattern) return;
  if (canVibrate() && !isIOS()) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* blocked until the first user gesture */
    }
    return;
  }
  if (!isIOS()) return;
  // Reduced-motion players asked for calm: one tick instead of a rhythm.
  const list = pulses(pattern, true);
  for (const p of prefersReducedMotion() ? list.slice(0, 1) : list) {
    if (p.at === 0) iosTick();
    else window.setTimeout(iosTick, p.at);
  }
}
