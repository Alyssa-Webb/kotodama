/** Browser/platform detection and storage durability. Thin wrappers so features stay testable. */

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export function isStandalone(): boolean {
  const nav = navigator as NavigatorStandalone;
  return nav.standalone === true || matchMedia('(display-mode: standalone)').matches;
}

export function isIOS(): boolean {
  const ua = navigator.userAgent;
  // iPadOS reports itself as Mac; touch points tell them apart.
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

export function isMacSafari(): boolean {
  const ua = navigator.userAgent;
  return (
    /Macintosh/.test(ua) &&
    navigator.maxTouchPoints <= 1 &&
    /Safari/.test(ua) &&
    !/Chrome|Chromium|Edg/.test(ua)
  );
}

let persistRequested = false;
/** Asks the browser to keep our storage (call after the first meaningful save). */
export async function requestPersistentStorage(): Promise<boolean> {
  if (persistRequested) return false;
  persistRequested = true;
  try {
    if (navigator.storage?.persisted && (await navigator.storage.persisted())) return true;
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
