import { useEffect, useRef, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { UpdatePrompt } from './UpdatePrompt';
import { InstallGuide } from './InstallGuide';
import { Notices } from './Notices';
import { useStats } from '../features/hooks';
import {
  FlameIcon,
  HeartIcon,
  KobanIcon,
  TabDojo,
  TabHome,
  TabMore,
  TabPath,
  TabShop,
} from '../foundations/art/icons';

const TABS = [
  { to: '/', label: 'Home', icon: <TabHome /> },
  { to: '/path', label: 'Path', icon: <TabPath /> },
  { to: '/reviews', label: 'Dojo', icon: <TabDojo /> },
  { to: '/shop', label: 'Shop', icon: <TabShop /> },
  { to: '/more', label: 'More', icon: <TabMore /> },
];

/** A HUD counter that bumps when its value goes up. */
function Stat({
  value,
  className,
  label,
  title,
  children,
}: {
  value: number;
  className: string;
  label: string;
  title: string;
  children: ReactNode;
}) {
  const prev = useRef(value);
  const [bump, setBump] = useState(0);
  useEffect(() => {
    if (value > prev.current) setBump((b) => b + 1);
    prev.current = value;
  }, [value]);
  return (
    <span
      key={bump}
      className={`stat ${className} ${bump ? 'bump' : ''}`}
      aria-label={label}
      title={title}
    >
      {children} {value}
    </span>
  );
}

export function TopStats() {
  const s = useStats();
  return (
    <div className="row" style={{ gap: 'var(--sp-2)', flexWrap: 'nowrap' }}>
      <Stat
        value={s.streak}
        className="stat-streak"
        label={`Streak ${s.streak} days`}
        title="Streak"
      >
        <FlameIcon size={20} lit={s.streak > 0} />
      </Stat>
      {s.hearts !== null && (
        <Stat
          value={s.hearts}
          className="stat-hearts"
          label={`${s.hearts} of ${s.maxHearts} hearts`}
          title={s.nextHeartMin ? `Next heart in ${s.nextHeartMin} min` : 'Hearts'}
        >
          <HeartIcon size={20} empty={s.hearts === 0} />
        </Stat>
      )}
      <Stat value={s.koban} className="stat-koban" label={`${s.koban} koban`} title="Koban">
        <KobanIcon size={20} />
      </Stat>
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
            {t.icon}
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
      <UpdatePrompt />
    </div>
  );
}
