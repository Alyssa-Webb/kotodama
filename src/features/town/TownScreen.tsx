import { Link } from 'react-router';
import { districtStates } from '../../engine/world';
import { daysAway } from '../../engine/game';
import { useGame } from '../../foundations/store/gameStore';
import { districts, koto } from '../../foundations/world';
import { KotoSays } from '../tour/KotoSays';
import { useSave, useStats } from '../hooks';
import { Tycoon } from './Tycoon';
import './town.css';

/**
 * Kotodama Town: its own place, an illustrated map where every district is a building you can
 * tap to run its business. Food Street (healing) sits just off the main street.
 */
export function TownScreen() {
  const save = useSave();
  const stats = useStats();
  const index = useGame((s) => s.index);
  const clock = useGame((s) => s.clock);
  const away = daysAway(save, { now: stats.now, timeZone: clock.timeZone() });
  const states = districtStates(save, index, districts, away);
  const hurt = stats.hearts !== null && stats.maxHearts !== null && stats.hearts < stats.maxHearts;
  return (
    <div className="stack">
      <h1>Kotodama Town</h1>
      <KotoSays lines={koto.town} outfit="mayor" role="town" />
      {away > 0 && (
        <p className="town-note">
          You were away {away} day(s), so the lanterns went dark. Meet today's goal to light them
          again.
        </p>
      )}
      <Tycoon states={states} />
      <Link className={`town-food ${hurt ? 'hurt' : ''}`} to="/food">
        <span className="town-food-icon" aria-hidden="true">
          🍙
        </span>
        <span className="town-food-text">
          <strong>Food Street</strong>
          <span className="small muted">
            {hurt
              ? `HP ${stats.hearts}/${stats.maxHearts}: eat to heal`
              : 'Order a meal in Japanese when you need to heal'}
          </span>
        </span>
        <span className="town-food-go" aria-hidden="true">
          ›
        </span>
      </Link>
    </div>
  );
}
