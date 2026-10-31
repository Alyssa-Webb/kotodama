/**
 * One reminder, drawn as a wooden ema plaque hanging on a cord, with a drawn symbol for what it is
 * about. A link when it goes somewhere, a button when it acts in place.
 */
import { Link } from 'react-router';
import type { DeskNote } from '../desk';
import './parts.css';

/** Which symbol an ema shows, from the desk note's id. */
export type EmaSymbol = 'meal' | 'flame' | 'spirit' | 'coins' | 'capsule' | 'scroll' | 'check';

export function emaSymbol(id: string): EmaSymbol {
  if (id.startsWith('hp')) return 'meal';
  if (id === 'streak') return 'flame';
  if (id === 'reviews') return 'spirit';
  if (id === 'town') return 'coins';
  if (id === 'koban') return 'capsule';
  if (id === 'goal') return 'check';
  return 'scroll';
}

export function EmaSymbolArt({ symbol }: { symbol: EmaSymbol }) {
  return <span className={`ema-symbol ema-symbol-${symbol}`} aria-hidden="true" />;
}

export function EmaNudge({ note }: { note: DeskNote }) {
  const body = (
    <>
      <span className="ema-plaque" aria-hidden="true">
        <EmaSymbolArt symbol={emaSymbol(note.id)} />
      </span>
      <span className="home-nudge-text">{note.text}</span>
      {note.cta && <span className="home-nudge-cta">{note.cta}</span>}
    </>
  );
  const cls = `home-nudge ema tone-${note.tone}`;
  if (note.to)
    return (
      <Link className={cls} to={note.to} onClick={note.act}>
        {body}
      </Link>
    );
  if (note.act)
    return (
      <button type="button" className={cls} onClick={note.act}>
        {body}
      </button>
    );
  return <div className={cls}>{body}</div>;
}
