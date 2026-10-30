import { Link } from 'react-router';
import { useSave } from '../hooks';

export function ModesScreen() {
  const save = useSave();
  return (
    <div className="stack">
      <h1>Game modes</h1>
      <div className="grid-2">
        <Link to="/rush/kana" className="card stack card-link">
          <p className="eyebrow">Survival</p>
          <h2>
            <span lang="ja">かな</span> Kana Rush
          </h2>
          <p className="muted small">
            Name each kana before the clock runs out. Three misses and you're done.
          </p>
          <span className="pill pill-gold">Best: {save.rush.kana?.best ?? 0}</span>
        </Link>
        <Link to="/rush/listening" className="card stack card-link">
          <p className="eyebrow">By ear only</p>
          <h2>Listening Rush</h2>
          <p className="muted small">Hear it, pick it. Race the ghost of your best run.</p>
          <span className="pill pill-gold">Best: {save.rush.listening?.best ?? 0}</span>
        </Link>
        <Link to="/rush/dictation" className="card stack card-link">
          <p className="eyebrow">Write what you hear</p>
          <h2>Dictation drill</h2>
          <p className="muted small">
            Type each word you hear in kana. Builds your ear and your spelling.
          </p>
          <span className="pill pill-gold">Best: {save.rush.dictation?.best ?? 0}</span>
        </Link>
        <Link to="/reviews" className="card stack card-link">
          <p className="eyebrow">Lesson review</p>
          <h2>Dojo</h2>
          <p className="muted small">Your due reviews and your recent mistakes, replayed.</p>
        </Link>
      </div>
    </div>
  );
}
