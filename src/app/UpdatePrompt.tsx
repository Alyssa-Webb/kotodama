import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

/**
 * Prompt-to-update flow: a new service worker waits until the player taps "Update",
 * so a lesson is never reloaded out from under them.
 */
export function UpdatePrompt() {
  const [update, setUpdate] = useState<null | ((reload?: boolean) => Promise<void>)>(null);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    const updateSW = registerSW({
      onNeedRefresh: () => setUpdate(() => updateSW),
      onOfflineReady: () => setOfflineReady(true),
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
