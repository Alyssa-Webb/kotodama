import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

/**
 * Update flow: the app checks for a new version every minute and whenever it comes back to the
 * foreground (an installed PWA otherwise keeps running an old build for days). Outside a lesson
 * or boss fight the update applies at once; mid-battle it waits for the player to tap "Update",
 * so a lesson is never reloaded out from under them.
 */
const inBattle = () => /^#\/(lesson|boss|trial)\b/.test(window.location.hash);

export function UpdatePrompt() {
  const [update, setUpdate] = useState<null | ((reload?: boolean) => Promise<void>)>(null);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    const updateSW = registerSW({
      onNeedRefresh: () => (inBattle() ? setUpdate(() => updateSW) : void updateSW(true)),
      onOfflineReady: () => setOfflineReady(true),
      onRegisteredSW: (_url, reg) => {
        if (!reg) return;
        const check = () => {
          if (navigator.onLine) void reg.update().catch(() => undefined);
        };
        window.setInterval(check, 60_000);
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') check();
        });
      },
    });
  }, []);

  useEffect(() => {
    if (!offlineReady) return;
    const t = window.setTimeout(() => setOfflineReady(false), 4000);
    return () => window.clearTimeout(t);
  }, [offlineReady]);

  if (update) {
    return (
      <div className="toast" role="status">
        <span>Update ready</span>
        <button className="btn btn-small btn-accent" onClick={() => void update(true)}>
          Update
        </button>
        <button className="btn btn-small btn-ghost" onClick={() => setUpdate(null)}>
          Later
        </button>
      </div>
    );
  }
  if (offlineReady) {
    return (
      <div className="toast" role="status">
        Ready to play offline
      </div>
    );
  }
  return null;
}
