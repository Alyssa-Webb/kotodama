import { useEffect } from 'react';
import { createHashRouter, Outlet, RouterProvider } from 'react-router';
import { Shell } from './Shell';
import { Providers } from './Providers';
import { useGame } from '../foundations/store/gameStore';
import { dexieRepos } from '../foundations/storage/dexie';
import { initVoices } from '../foundations/audio/voice';
import { installAudioUnlock } from '../foundations/audio/sfx';
import { HomeScreen } from '../features/home/HomeScreen';
import { PathScreen } from '../features/path/PathScreen';
import { LessonScreen } from '../features/lesson/LessonScreen';
import { ReviewsScreen } from '../features/reviews/ReviewsScreen';
import { MoreScreen } from '../features/more/MoreScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { PacksScreen } from '../features/packs/PacksScreen';
import { ShopScreen } from '../features/shop/ShopScreen';
import { TownScreen } from '../features/town/TownScreen';
import { CollectionScreen } from '../features/collection/CollectionScreen';
import { AvatarScreen } from '../features/avatar/AvatarScreen';
import { CreditsScreen } from '../features/credits/CreditsScreen';
import { ModesScreen } from '../features/modes/ModesScreen';
import { RushScreen } from '../features/modes/RushScreen';
import { BossScreen } from '../features/boss/BossScreen';
import { TrialScreen } from '../features/shop/TrialScreen';
import { FxLayer } from '../foundations/fx/FxLayer';
import { TrainingGate } from '../foundations/moments/TrainingGate';
import { MomentsLayer } from '../foundations/moments/MomentsLayer';
import { AvatarActor } from '../features/avatar/AvatarActor';
import { PartPreview } from '../features/avatar/PartPreview';
import { haptic } from '../foundations/haptics/haptics';

/** Every plastic button answers a press with a tick, in the same frame it squashes. */
function installPressTicks() {
  window.addEventListener(
    'pointerdown',
    (e) => {
      const el = (e.target as Element | null)?.closest?.('.btn, .tab, .card-link');
      if (el && !(el as HTMLButtonElement).disabled) haptic('tick');
    },
    { capture: true, passive: true },
  );
}

function FullScreen() {
  return (
    <div className="full-screen">
      <TrainingGate />
      <Outlet />
    </div>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: 'path', element: <PathScreen /> },
      { path: 'reviews', element: <ReviewsScreen /> },
      { path: 'shop', element: <ShopScreen /> },
      { path: 'more', element: <MoreScreen /> },
      { path: 'settings', element: <SettingsScreen /> },
      { path: 'packs', element: <PacksScreen /> },
      { path: 'town', element: <TownScreen /> },
      { path: 'collection', element: <CollectionScreen /> },
      { path: 'avatar', element: <AvatarScreen /> },
      { path: 'credits', element: <CreditsScreen /> },
      { path: 'modes', element: <ModesScreen /> },
    ],
  },
  {
    element: <FullScreen />,
    children: [
      { path: '/lesson/:packId/:nodeId', element: <LessonScreen /> },
      { path: '/dojo', element: <ReviewsScreen session /> },
      { path: '/rush/:mode', element: <RushScreen /> },
      { path: '/boss/:bossId', element: <BossScreen /> },
      { path: '/trial', element: <TrialScreen /> },
    ],
  },
]);

export function App() {
  const ready = useGame((s) => s.ready);
  const error = useGame((s) => s.error);
  const init = useGame((s) => s.init);
  const settle = useGame((s) => s.settle);
  const flush = useGame((s) => s.flush);

  useEffect(() => {
    initVoices();
    installAudioUnlock();
    installPressTicks();
    void init(dexieRepos());
  }, [init]);

  useEffect(() => {
    if (!ready) return;
    // Day rollover while the app stays open, and save before the app is backgrounded.
    const tick = window.setInterval(settle, 60_000);
    const onVis = () => (document.visibilityState === 'hidden' ? void flush() : settle());
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', () => void flush());
    return () => {
      window.clearInterval(tick);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [ready, settle, flush]);

  if (error)
    return (
      <div className="main">
        <div className="card stack">
          <h1>Something went wrong</h1>
          <p>{error}</p>
          <p className="muted small">
            Your data has not been changed. Try reloading; if this persists, restore a backup from
            More → Packs & Backup.
          </p>
        </div>
      </div>
    );
  if (!ready)
    return (
      <div className="main center" aria-busy="true">
        <p className="display-ja" lang="ja">
          言霊
        </p>
        <p className="muted">Waking the town…</p>
      </div>
    );
  return (
    <Providers>
      <RouterProvider router={router} />
      <MomentsLayer
        actor={(pose) => <AvatarActor mood={pose} size={120} />}
        part={(id) => <PartPreview id={id} />}
      />
      <FxLayer />
    </Providers>
  );
}
