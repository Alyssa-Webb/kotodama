import { Link } from 'react-router';

const LINKS = [
  { to: '/town', label: 'Town', sub: 'Districts you have woken', icon: '⌂' },
  { to: '/collection', label: 'Spirits', sub: 'Your collection', icon: '✦' },
  { to: '/avatar', label: 'Avatar', sub: 'Outfits, charms, titles', icon: '☺' },
  { to: '/modes', label: 'Game modes', sub: 'Kana Rush, Listening Rush', icon: '⚡' },
  {
    to: '/packs',
    label: 'Packs & Backup',
    sub: 'Import lessons, Learner Report, backups',
    icon: '▤',
  },
  { to: '/settings', label: 'Settings', sub: 'Difficulty, voice, script, theme', icon: '⚙' },
  { to: '/credits', label: 'Credits', sub: 'Voices, data and licenses', icon: '♥' },
];

export function MoreScreen() {
  return (
    <div className="stack">
      <h1>More</h1>
      <div className="grid-2">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="card card-tight card-link row"
            style={{ flexWrap: 'nowrap' }}
          >
            <span className="big-ja" aria-hidden="true">
              {l.icon}
            </span>
            <span className="stack" style={{ gap: 0 }}>
              <strong>{l.label}</strong>
              <span className="muted small">{l.sub}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
