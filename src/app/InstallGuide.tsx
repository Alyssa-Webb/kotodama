import { useState } from 'react';
import { isIOS, isMacSafari, isStandalone } from '../foundations/platform';
import { useGame } from '../foundations/store/gameStore';
import { useSave } from '../features/hooks';

/**
 * Installed apps keep their own storage, separate from Safari tabs (and exempt from the 7-day
 * purge), so in a browser tab we gently steer the player to install before progress builds up.
 */
export function InstallGuide() {
  const save = useSave();
  const commit = useGame((s) => s.commit);
  const [open, setOpen] = useState(false);
  if (isStandalone() || save.settings.installGuideDismissed) return null;
  const ios = isIOS();
  const mac = isMacSafari();
  return (
    <section
      className="card card-indigo card-tight"
      style={{ marginBottom: 'var(--sp-4)' }}
      aria-label="Install Kotodama"
    >
      <div className="row spread">
        <p style={{ fontWeight: 700 }}>Install Kotodama to keep your progress safe</p>
        <button
          className="btn btn-small btn-ghost"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? 'Hide' : 'How?'}
        </button>
      </div>
      {open && (
        <div className="stack small" style={{ marginTop: 'var(--sp-3)', gap: 'var(--sp-2)' }}>
          {ios && (
            <ol style={{ margin: 0, paddingLeft: '1.2em' }}>
              <li>Tap the Share button in Safari's toolbar.</li>
              <li>Scroll and tap “Add to Home Screen”.</li>
              <li>Always open Kotodama from its icon. A Safari tab keeps separate progress.</li>
            </ol>
          )}
          {mac && (
            <p>
              In Safari's menu bar choose File → Add to Dock. Kotodama then opens in its own window.
            </p>
          )}
          {!ios && !mac && (
            <p>
              Open this page in Safari on iPhone or Mac, or use your browser's “Install app” option.
            </p>
          )}
          <button
            className="btn btn-small"
            onClick={() =>
              commit({ ...save, settings: { ...save.settings, installGuideDismissed: true } })
            }
          >
            Don't show again
          </button>
        </div>
      )}
    </section>
  );
}
