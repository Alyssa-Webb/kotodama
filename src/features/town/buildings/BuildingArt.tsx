import './buildings.css';
import { Bathhouse } from './Bathhouse';
import { Cafe } from './Cafe';
import { PaperLantern } from './hariko';
import { School } from './School';
import { Shopping } from './Shopping';
import { Shrine } from './Shrine';
import { Station } from './Station';

export { PaperLantern };

/**
 * The six Town districts drawn as Edo hariko folk-toy (張り子) buildings on the map
 * (Station, Café, Shrine, Shopping Street, Bathhouse, School). `lit` is true once restored.
 */
export function BuildingArt({ id, lit }: { id: string; lit: boolean }) {
  const renderBuilding = () => {
    switch (id) {
      case 'station':
        return <Station lit={lit} />;
      case 'cafe':
        return <Cafe lit={lit} />;
      case 'shrine':
        return <Shrine lit={lit} />;
      case 'shopping':
        return <Shopping lit={lit} />;
      case 'bathhouse':
        return <Bathhouse lit={lit} />;
      case 'school':
      default:
        return <School lit={lit} />;
    }
  };

  return (
    <svg viewBox="0 0 120 96" className="town-spot-art" aria-hidden="true">
      {/* The low-poly station draws its own shadow to match its island. */}
      {id !== 'station' && <ellipse cx="60" cy="81" rx="48" ry="11" fill="var(--c-shadow)" />}
      {renderBuilding()}
    </svg>
  );
}
