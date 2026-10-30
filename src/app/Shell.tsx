import { NavLink, Outlet, useLocation } from 'react-router';
import { UpdatePrompt } from './UpdatePrompt';
import { InstallGuide } from './InstallGuide';
import { Notices } from './Notices';
import { useStats } from '../features/hooks';

const TABS = [
  { to: '/', label: 'Home', icon: '家' },
  { to: '/path', label: 'Path', icon: '道' },
  { to: '/reviews', label: 'Dojo', icon: '練' },
  { to: '/shop', label: 'Shop', icon: '店' },
  { to: '/more', label: 'More', icon: '他' },
];

export function TopStats() {
  const s = useStats();
  return (
    <div className="row" style={{ gap: 'var(--sp-2)' }}>
      <span className="stat stat-streak" aria-label={`Streak ${s.streak} days`} title="Streak">
        <span aria-hidden="true">炎</span> {s.streak}
      </span>
      {s.hearts !== null && (
        <span
          className="stat stat-hearts"
          aria-label={`${s.hearts} of ${s.maxHearts} hearts`}
          title={s.nextHeartMin ? `Next heart in ${s.nextHeartMin} min` : 'Hearts'}
        >
          <span aria-hidden="true">♥</span> {s.hearts}
        </span>
      )}
      <span className="stat stat-koban" aria-label={`${s.koban} koban`} title="Koban">
        <span aria-hidden="true">◎</span> {s.koban}
      </span>
    </div>
  );
}

export function Shell() {
  const loc = useLocation();
  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#/">
          <img src={`${import.meta.env.BASE_URL}icons/seal.svg`} alt="" />
          <span>Kotodama</span>
        </a>
        <TopStats />
      </header>
      <main className="main" key={loc.pathname}>
        <InstallGuide />
        <Notices />
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Main">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) => `tab${isActive ? ' active' : ''}`}
          >
            <span className="tab-icon" lang="ja" aria-hidden="true">
              {t.icon}
            </span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
      <UpdatePrompt />
    </div>
  );
}
