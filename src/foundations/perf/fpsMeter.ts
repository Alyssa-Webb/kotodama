import { frameStats } from './frameStats';

const WINDOW = 300;
const REFRESH_MS = 500;

/**
 * Shows live frame rates, for testing on a real phone: open the site with ?fps in the address.
 * Plain DOM rather than React, so measuring adds as little work per frame as possible.
 */
export function installFpsMeter(): void {
  const el = document.createElement('div');
  el.className = 'fps-meter';
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = [
    'position:fixed',
    'top:calc(env(safe-area-inset-top) + 2px)',
    'left:50%',
    'transform:translateX(-50%)',
    'z-index:9999',
    'padding:2px 8px',
    'border-radius:var(--r-pill)',
    'background:var(--c-hud-bg)',
    'color:var(--c-hud-ink)',
    'font:var(--fs-xs) var(--font-mono)',
    'white-space:nowrap',
    'pointer-events:none',
  ].join(';');
  el.textContent = 'measuring…';
  document.body.append(el);

  const intervals: number[] = [];
  let last = performance.now();
  let lastDrawn = last;
  const tick = (now: number) => {
    intervals.push(now - last);
    if (intervals.length > WINDOW) intervals.shift();
    last = now;
    if (now - lastDrawn >= REFRESH_MS) {
      lastDrawn = now;
      const stats = frameStats(intervals);
      if (stats) {
        el.textContent = `${stats.fps} fps · low ${stats.low} · worst ${stats.worstMs} ms · ${stats.slowPercent}% slow`;
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
