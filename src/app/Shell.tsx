import { NavLink, Outlet } from 'react-router';
import { UpdatePrompt } from './UpdatePrompt';

const TABS = [
  { to: '/', label: 'Home', icon: '家' },
  { to: '/path', label: 'Path', icon: '道' },
  { to: '/reviews', label: 'Dojo', icon: '道場' },
  { to: '/shop', label: 'Shop', icon: '店' },
  { to: '/more', label: 'More', icon: '…' },
];

export function Shell() {
  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#/">
          <img src={`${import.meta.env.BASE_URL}icons/seal.svg`} alt="" />
          <span>Kotodama</span>
        </a>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Main">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end
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
