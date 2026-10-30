import { Link } from 'react-router';
import { bonsai, districtStates } from '../../engine/world';
import { daysAway } from '../../engine/game';
import { useGame } from '../../foundations/store/gameStore';
import { districts, koto } from '../../foundations/world';
import { KotoSays } from '../tour/KotoSays';
import { useSave, useStats } from '../hooks';
import { Scene } from '../../foundations/art/Scene';
import { Tycoon } from './Tycoon';
import './town.css';

/** A placeholder building per district: roof style varies, windows glow when the district is lit. */
function Building({ kind, lit, restored }: { kind: string; lit: boolean; restored: boolean }) {
  const wall = restored ? 'var(--c-panel)' : 'var(--c-fog)';
  const roof = restored
    ? kind === 'shrine'
      ? 'var(--c-lacquer)'
      : kind === 'bath'
        ? 'var(--c-secondary)'
        : 'var(--c-ink)'
    : 'var(--c-ink-muted)';
  const win = lit ? 'var(--c-glow)' : 'var(--c-surface-alt)';
  return (
    <svg viewBox="0 0 64 64" className="building" aria-hidden="true">
      {lit && (
        <circle
          cx="32"
          cy="40"
          r="30"
          fill="var(--c-glow)"
          opacity=".18"
          className="lantern-glow"
        />
      )}
      <rect
        x="12"
        y="30"
        width="40"
        height="26"
        fill={wall}
        stroke="var(--c-ink)"
        strokeWidth="1.5"
      />
      {kind === 'shrine' ? (
        <>
          <path d="M4 30q28-14 56 0l-4 4q-24-10-48 0Z" fill={roof} />
          <path d="M18 22q14-8 28 0l-2 3q-12-6-24 0Z" fill={roof} />
        </>
      ) : kind === 'station' ? (
        <>
          <path d="M6 30h52l-6-10H12Z" fill={roof} />
          <rect
            x="22"
            y="12"
            width="20"
            height="8"
            rx="2"
            fill={wall}
            stroke="var(--c-ink)"
            strokeWidth="1.2"
          />
          <circle cx="32" cy="16" r="2.5" fill="var(--c-ink)" />
        </>
      ) : kind === 'bath' ? (
        <>
          <path d="M8 30q24-18 48 0Z" fill={roof} />
          <path
            d="M44 14v-8M48 14v-8"
            stroke="var(--c-fog)"
            strokeWidth="2"
            strokeLinecap="round"
            className="drift"
          />
        </>
      ) : (
        <path d="M6 31 32 16l26 15Z" fill={roof} />
      )}
      <rect x="27" y="42" width="10" height="14" fill="var(--c-ink)" opacity=".8" />
      <rect x="16" y="36" width="8" height="7" fill={win} stroke="var(--c-ink)" strokeWidth=".8" />
      <rect x="40" y="36" width="8" height="7" fill={win} stroke="var(--c-ink)" strokeWidth=".8" />
      {kind === 'cafe' && (
        <path d="M14 46h36" stroke="var(--c-accent)" strokeWidth="3" strokeDasharray="4 2" />
      )}
      {lit && (
        <ellipse
          cx="32"
          cy="34"
          rx="3"
          ry="3.6"
          fill="var(--c-accent)"
          className="sway"
          style={{ transformOrigin: '32px 30px' }}
        />
      )}
    </svg>
  );
}

/** Map symbols: instantly readable, no kanji a beginner can't read yet. */
const ICON: Record<string, string> = {
  station: '🚉',
  cafe: '☕',
  shrine: '⛩️',
  shop: '🛍️',
  bath: '♨️',
  school: '🏫',
};
/** Short map labels ("The Station" → "Station", "Shopping Street" → "Shops"). */
const SHORT: Record<string, string> = { 'Shopping Street': 'Shops', 'Shrine Garden': 'Shrine' };
const shortName = (en: string) => SHORT[en] ?? en.replace(/^The /, '');

/** Placeholder town map (SVG): districts light up as their units are finished and dim when you miss days. */
export function TownScreen() {
  const save = useSave();
  const stats = useStats();
  const index = useGame((s) => s.index);
  const clock = useGame((s) => s.clock);
  const away = daysAway(save, { now: stats.now, timeZone: clock.timeZone() });
  const states = districtStates(save, index, districts, away);
  const learned = new Set(Object.keys(save.cards).map((k) => k.split('#')[0])).size;
  const tree = bonsai(learned, away);
  return (
    <div className="stack">
      <h1>Kotodama Town</h1>
      <KotoSays lines={koto.town} outfit="mayor" role="town" />
      <Link className="btn btn-accent btn-block" to="/food">
        Food Street: order a meal to heal
      </Link>
      {away > 0 && (
        <p className="banner">
          You were away {away} day(s): the lanterns went dark. Meet today's goal to light them
          again.
        </p>
      )}
      <div
        className="card town-map"
        role="img"
        aria-label={`Town map: ${states.filter((s) => s.restored).length} of ${states.length} districts restored`}
      >
        <Scene
          className="town-scene"
          height="100%"
          awake={states.filter((d) => d.lit).length / Math.max(1, states.length)}
          ambient={away === 0 && states.some((d) => d.lit) ? 'fireflies' : 'none'}
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="town-svg"
          aria-hidden="true"
        >
          <path
            d="M18 70 Q30 60 42 52 T52 22 M42 52 Q60 58 76 60 T84 30 M20 30 Q36 40 42 52"
            className="town-road"
          />
          <g transform="translate(50 45)">
            <rect x="-1" y="0" width="2" height="7" className="bonsai-trunk" />
            {Array.from({ length: tree.size }, (_, i) => (
              <circle
                key={i}
                cx={(i % 2 ? 1 : -1) * (i * 1.4)}
                cy={-i * 1.6}
                r={3 - i * 0.2}
                className="bonsai-leaf"
                style={{ opacity: 0.25 + 0.75 * tree.leaves }}
              />
            ))}
          </g>
        </svg>
        {states.map((s) => (
          <div
            key={s.district.id}
            className={`district ${s.restored ? 'restored' : ''} ${s.lit ? 'lit' : ''} ${!s.district.restoredBy ? 'locked' : ''}`}
            style={{ left: `${s.district.x}%`, top: `${s.district.y}%` }}
          >
            <Building kind={s.district.icon} lit={s.lit} restored={s.restored} />
            <span className="district-sign" aria-hidden="true">
              {ICON[s.district.icon] ?? '🏠'}
            </span>
            <span className="district-name">{shortName(s.district.en)}</span>
          </div>
        ))}
      </div>
      <Tycoon states={states} />
      <div className="grid-2">
        {states.map((s) => (
          <div key={s.district.id} className="card card-tight stack" style={{ gap: 'var(--sp-1)' }}>
            <strong>
              <span aria-hidden="true">{ICON[s.district.icon] ?? '🏠'}</span>{' '}
              {shortName(s.district.en)}
            </strong>
            <div className="bar bar-gold">
              <span style={{ width: `${s.progress * 100}%` }} />
            </div>
            <span className="muted tiny">
              {s.restored
                ? s.lit
                  ? 'Restored · lanterns lit'
                  : 'Restored · lanterns dark'
                : s.district.restoredBy
                  ? `${Math.round(s.progress * 100)}% restored`
                  : 'Waits for a future pack'}
            </span>
          </div>
        ))}
      </div>
      <p className="muted small">
        Bonsai: size {tree.size}/5{tree.leaves < 1 ? ', dropping leaves' : ''}.{' '}
        <Link to="/collection">See your spirits</Link>
      </p>
    </div>
  );
}
