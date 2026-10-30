import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { haptic } from '../foundations/haptics/haptics';
import { UpdatePrompt } from './UpdatePrompt';
import { Tour } from '../features/tour/Tour';
import { InstallGuide } from './InstallGuide';
import { Notices } from './Notices';
import { useStats } from '../features/hooks';
import {
  FlameIcon,
  HeartIcon,
  YenIcon,
  TabDojo,
  TabHome,
  TabMore,
  TabPath,
  TabShop,
  TabTown,
} from '../foundations/art/icons';
import { Avatar } from '../features/avatar/Avatar';

/** The avatar tab shows your own chibi avatar's head and shoulders. */
function TabAvatar() {
  return (
    <span className="tab-avatar" aria-hidden="true">
      <Avatar size={26} mood="happy" />
    </span>
  );
}

const TABS = [
  { to: '/', label: 'Home', icon: <TabHome /> },
  { to: '/town', label: 'Town', icon: <TabTown /> },
  { to: '/path', label: 'Path', icon: <TabPath /> },
  { to: '/reviews', label: 'Dojo', icon: <TabDojo /> },
  { to: '/shop', label: 'Shop', icon: <TabShop /> },
  { to: '/avatar', label: 'Me', icon: <TabAvatar /> },
];

/** A HUD counter that bumps when its value goes up and dips when it goes down. */
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
  const [dip, setDip] = useState(0);
  useEffect(() => {
    if (value > prev.current) {
      setBump((b) => b + 1);
      setDip(0);
    } else if (value < prev.current) {
      setDip((d) => d + 1);
      setBump(0);
    }
    prev.current = value;
  }, [value]);
  return (
    <span
      key={`${bump}-${dip}`}
      className={`stat ${className} ${bump ? 'bump' : dip ? 'dip' : ''}`}
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
      <Stat value={s.yen} className="stat-yen" label={`${s.yen} yen`} title="Yen">
        <YenIcon size={20} />
      </Stat>
    </div>
  );
}

/**
 * Swipe left or right on the main tabs to move between them, like a pager: the page follows the
 * finger, slides off when released past the threshold (or springs back), and the next tab slides
 * in from the matching side. Tapping a tab slides the same way. Only clear, mostly-horizontal
 * drags count, never ones that start on inputs, sliders or scrollable rows. Motion is written to
 * the element's style directly (transform/opacity only), so dragging never re-renders React.
 */
function useTabSwipe() {
  const loc = useLocation();
  const navigate = useNavigate();
  const main = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number; t: number; on: boolean } | null>(null);
  const index = TABS.findIndex((t) => t.to === loc.pathname);
  // Which side the new page enters from: by tab order, for swipes and taps alike.
  // (React's "adjust state while rendering" pattern: remember the last tab in state.)
  const [prev, setPrev] = useState(index);
  const [dir, setDir] = useState<'left' | 'right' | null>(null);
  if (index >= 0 && index !== prev) {
    setPrev(index);
    setDir(prev >= 0 ? (index > prev ? 'left' : 'right') : null);
  }

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const place = (dx: number) => {
    const el = main.current;
    if (!el) return;
    el.style.transform = dx ? `translate3d(${dx}px,0,0)` : '';
    el.style.opacity = dx ? String(1 - Math.min(0.35, Math.abs(dx) / window.innerWidth)) : '';
  };
  const onTouchStart = (e: React.TouchEvent) => {
    const el = e.target as HTMLElement;
    if (index < 0 || el.closest('input, textarea, select, canvas, [data-no-swipe], .pay, .tour'))
      return;
    const t = e.touches[0]!;
    drag.current = { x: t.clientX, y: t.clientY, t: performance.now(), on: false };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const d = drag.current;
    if (!d || reduced()) return;
    const t = e.touches[0]!;
    const dx = t.clientX - d.x;
    const dy = t.clientY - d.y;
    if (!d.on) {
      if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) return void (drag.current = null);
      if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
      d.on = true;
    }
    // Resist at the first and last tab.
    const edge = (dx > 0 && index === 0) || (dx < 0 && index === TABS.length - 1);
    place(edge ? dx * 0.25 : dx);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || index < 0) return;
    const dx = e.changedTouches[0]!.clientX - d.x;
    const dy = e.changedTouches[0]!.clientY - d.y;
    const fast = performance.now() - d.t < 300 && Math.abs(dx) > 40;
    const next = index + (dx < 0 ? 1 : -1);
    const go =
      (Math.abs(dx) > window.innerWidth * 0.28 || fast) &&
      Math.abs(dx) > Math.abs(dy) * 1.2 &&
      next >= 0 &&
      next < TABS.length;
    const el = main.current;
    if (!go) {
      if (el && d.on)
        el.animate(
          [
            { transform: el.style.transform, opacity: el.style.opacity || '1' },
            { transform: 'none', opacity: 1 },
          ],
          { duration: 220, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' },
        );
      place(0);
      return;
    }
    haptic('tick');
    if (!el || reduced()) return void navigate(TABS[next]!.to);
    // Finish the slide off-screen, then swap pages; the new one enters from the other side.
    const out = el.animate(
      [
        { transform: el.style.transform || 'none', opacity: el.style.opacity || '1' },
        { transform: `translate3d(${dx < 0 ? '-100%' : '100%'},0,0)`, opacity: 0.6 },
      ],
      { duration: 140, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
    );
    out.onfinish = () => navigate(TABS[next]!.to);
  };
  // A tab slide brings the page in whole: every one-shot entrance inside it (ring pops, badge
  // springs, card drops) jumps to its last frame so nothing shrinks or grows mid-slide, while
  // idle loops (bobbing, swaying) keep running.
  useLayoutEffect(() => {
    const el = main.current;
    if (!dir || !el) return;
    for (const a of el.getAnimations({ subtree: true })) {
      if (a.effect?.getComputedTiming().iterations === Infinity) continue;
      if (a instanceof CSSAnimation && a.effect instanceof KeyframeEffect && a.effect.target === el)
        continue;
      a.finish();
    }
  }, [loc.pathname, dir]);
  return { main, onTouchStart, onTouchMove, onTouchEnd, dir };
}

export function Shell() {
  const loc = useLocation();
  const { main, onTouchStart, onTouchMove, onTouchEnd, dir } = useTabSwipe();
  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#/">
          <img src={`${import.meta.env.BASE_URL}icons/seal.svg`} alt="" />
          <span>Kotodama</span>
        </a>
        <TopStats />
        <NavLink className="btn btn-ghost icon-btn top-more" to="/more" aria-label="More">
          <TabMore />
        </NavLink>
      </header>
      <main
        ref={main}
        className={`main ${dir ? `main-from-${dir}` : ''}`}
        key={loc.pathname}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
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
      <Tour />
    </div>
  );
}
