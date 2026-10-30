import { Link } from 'react-router';
import { bonsai, districtStates } from '../../engine/world';
import { daysAway } from '../../engine/game';
import { useGame } from '../../foundations/store/gameStore';
import { districts } from '../../foundations/world';
import { JaText } from '../../foundations/japanese/Ja';
import { useSave, useStats } from '../hooks';
import './town.css';

const ICON: Record<string, string> = {
  station: '駅',
  cafe: '茶',
  shrine: '社',
  shop: '店',
  bath: '湯',
  school: '学',
};

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
      <h1>
        <JaText text="{言霊町|ことだまちょう}" /> Kotodama Town
      </h1>
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
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
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
            <span className="district-icon" lang="ja" aria-hidden="true">
              {ICON[s.district.icon] ?? '家'}
            </span>
            <span className="district-name">{s.district.en}</span>
          </div>
        ))}
      </div>
      <div className="grid-2">
        {states.map((s) => (
          <div key={s.district.id} className="card card-tight stack" style={{ gap: 'var(--sp-1)' }}>
            <strong>
              <JaText text={s.district.name} /> {s.district.en}
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
