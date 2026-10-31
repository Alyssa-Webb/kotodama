/**
 * One reminder, drawn as a wooden ema plaque hanging on a cord, with a drawn symbol for what it is
 * about. A link when it goes somewhere, a button when it acts in place.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { DeskNote } from '../desk';
import './ema.css';

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

const INK = 'var(--c-hud-bg)';
const CREAM = 'var(--c-hud-ink)';
const SHINE = 'var(--c-coin-shine)';
const VERMILION = 'color-mix(in srgb, var(--c-accent) 70%, var(--c-lacquer))';
const INDIGO = 'color-mix(in srgb, var(--c-secondary) 78%, var(--c-hud-bg))';
const INDIGO_LIP = 'color-mix(in srgb, var(--c-secondary) 52%, var(--c-hud-bg))';
const WOOD_LIP = 'color-mix(in srgb, var(--c-panel-edge) 48%, var(--c-hud-bg))';
const COIN_LIP = 'color-mix(in srgb, var(--c-panel-edge) 42%, var(--c-hud-bg))';
const LACQUER_DARK = 'color-mix(in srgb, var(--c-lacquer) 66%, var(--c-hud-bg))';
const NORI = 'color-mix(in srgb, var(--c-hud-bg) 78%, var(--c-success))';

const BRUSH_RING_PATH = [
  'M16 4.4 C22.8 4.4 27.8 9.2 27.8 15.8 C27.8 22.8 22.4 27.6 15.6 27.6',
  'C8.8 27.6 4.2 22.6 4.2 15.8 C4.2 9.4 9.2 4.4 16 4.4 Z',
  'M16.2 9.2 C12.2 9.2 9.5 12 9.5 15.8 C9.5 19.6 12.2 22.4 15.8 22.4',
  'C19.8 22.4 22.6 19.6 22.6 15.8 C22.6 12 19.8 9.2 16.2 9.2 Z',
].join(' ');

export function EmaSymbolArt({ symbol }: { symbol: EmaSymbol }) {
  let art: ReactNode;
  switch (symbol) {
    case 'meal':
      art = (
        <>
          <path
            d="M16 7 C21.8 7 29.5 19.2 28.4 25.5 C27.5 29.2 22 29.8 16 29.8 C10 29.8 4.5 29.2 3.6 25.5 C2.5 19.2 10.2 7 16 7 Z"
            fill={WOOD_LIP}
          />
          <path
            d="M16 4.2 C21.8 4.2 29.5 16.4 28.4 22.7 C27.5 26.4 22 27 16 27 C10 27 4.5 26.4 3.6 22.7 C2.5 16.4 10.2 4.2 16 4.2 Z"
            fill={CREAM}
          />
          <ellipse
            cx="11.5"
            cy="11.5"
            rx="3.8"
            ry="1.6"
            transform="rotate(-48 11.5 11.5)"
            fill={SHINE}
            opacity="0.85"
          />
          <ellipse cx="11.8" cy="15.2" rx="1.5" ry="1.7" fill={INK} />
          <circle cx="11.3" cy="14.6" r="0.65" fill={CREAM} />
          <circle cx="12.3" cy="15.8" r="0.35" fill={CREAM} />
          <ellipse cx="20.2" cy="15.2" rx="1.5" ry="1.7" fill={INK} />
          <circle cx="19.7" cy="14.6" r="0.65" fill={CREAM} />
          <circle cx="20.7" cy="15.8" r="0.35" fill={CREAM} />
          <ellipse cx="9.2" cy="17" rx="2" ry="1.1" fill="var(--c-petal)" opacity="0.78" />
          <ellipse cx="22.8" cy="17" rx="2" ry="1.1" fill="var(--c-petal)" opacity="0.78" />
          <rect x="10.5" y="19.5" width="11" height="10" rx="2.6" fill={INK} />
          <rect x="10.5" y="17.8" width="11" height="9.5" rx="2.6" fill={NORI} />
          <ellipse
            cx="13.2"
            cy="19.8"
            rx="1.8"
            ry="0.9"
            transform="rotate(-14 13.2 19.8)"
            fill={CREAM}
            opacity="0.35"
          />
        </>
      );
      break;

    case 'flame':
      art = (
        <>
          <path
            d="M16.5 5.6 C21 10.6 27.5 14.8 27.5 21.4 C27.5 26.8 22.6 30 16 30 C9.4 30 4.5 26.8 4.5 21.4 C4.5 16.2 8 12.8 10.4 10.2 C10.3 12.8 11.8 13.8 12.8 12.4 C13.4 9.5 14.8 7.2 16.5 5.6 Z"
            fill="var(--c-lacquer)"
          />
          <path
            d="M16.5 2.8 C21 7.8 27.5 12 27.5 18.6 C27.5 24 22.6 27.2 16 27.2 C9.4 27.2 4.5 24 4.5 18.6 C4.5 13.4 8 10 10.4 7.4 C10.3 10 11.8 11 12.8 9.6 C13.4 6.7 14.8 4.4 16.5 2.8 Z"
            fill={VERMILION}
          />
          <path
            d="M16.2 10.2 C19.5 13.6 22.4 16.8 22.4 20.4 C22.4 23.8 19.6 25.8 16 25.8 C12.4 25.8 9.6 23.8 9.6 20.4 C9.6 16.8 12.8 13.6 16.2 10.2 Z"
            fill="var(--c-glow)"
          />
          <ellipse cx="16" cy="21.4" rx="3.8" ry="3.8" fill={SHINE} />
          <ellipse
            cx="11.2"
            cy="14.2"
            rx="3.2"
            ry="1.5"
            transform="rotate(-38 11.2 14.2)"
            fill={CREAM}
            opacity="0.42"
          />
        </>
      );
      break;

    case 'spirit':
      art = (
        <>
          <circle cx="26.5" cy="8.5" r="2.3" fill="var(--c-secondary)" opacity="0.65" />
          <circle cx="29" cy="14" r="1.5" fill="var(--c-secondary)" opacity="0.38" />
          <path
            d="M14.8 7.2 C21.2 7.2 25.6 11.8 25.6 17.6 C25.6 23.8 20.5 28 13.2 29.6 C9.8 30.2 6.5 29 5.2 26.5 C7.8 26.5 9.6 24.8 9 22.4 C5.8 20.8 4.4 17.8 4.4 14.8 C4.4 10.2 8.8 7.2 14.8 7.2 Z"
            fill={INDIGO_LIP}
          />
          <path
            d="M14.8 4.4 C21.2 4.4 25.6 9 25.6 14.8 C25.6 21 20.5 25.2 13.2 26.8 C9.8 27.4 6.5 26.2 5.2 23.7 C7.8 23.7 9.6 22 9 19.6 C5.8 18 4.4 15 4.4 12 C4.4 7.4 8.8 4.4 14.8 4.4 Z"
            fill={INDIGO}
          />
          <ellipse
            cx="15.2"
            cy="14.2"
            rx="7.6"
            ry="6.8"
            fill="color-mix(in srgb, var(--c-secondary-soft) 72%, var(--c-hud-ink))"
            opacity="0.88"
          />
          <ellipse
            cx="11"
            cy="8.8"
            rx="3.8"
            ry="1.6"
            transform="rotate(-22 11 8.8)"
            fill={CREAM}
            opacity="0.45"
          />
          <ellipse cx="12.2" cy="14.6" rx="1.6" ry="1.9" fill={INK} />
          <circle cx="11.6" cy="13.9" r="0.7" fill={CREAM} />
          <circle cx="12.8" cy="15.3" r="0.35" fill={CREAM} />
          <ellipse cx="18.2" cy="14.6" rx="1.6" ry="1.9" fill={INK} />
          <circle cx="17.6" cy="13.9" r="0.7" fill={CREAM} />
          <circle cx="18.8" cy="15.3" r="0.35" fill={CREAM} />
          <ellipse cx="9.8" cy="16.5" rx="2" ry="1.1" fill="var(--c-petal)" opacity="0.75" />
          <ellipse cx="20.6" cy="16.5" rx="2" ry="1.1" fill="var(--c-petal)" opacity="0.75" />
        </>
      );
      break;

    case 'coins':
      art = (
        <>
          <circle cx="11.8" cy="21" r="8.8" fill={COIN_LIP} />
          <circle
            cx="11.8"
            cy="18.2"
            r="8.8"
            fill="color-mix(in srgb, var(--c-glow) 76%, var(--c-panel-edge))"
          />
          <ellipse
            cx="8.2"
            cy="14.2"
            rx="3"
            ry="1.3"
            transform="rotate(-28 8.2 14.2)"
            fill={SHINE}
            opacity="0.55"
          />
          <rect x="9.1" y="15.5" width="5.4" height="5.4" rx="0.9" fill={INK} />
          <circle cx="20.2" cy="15.6" r="9.2" fill={COIN_LIP} />
          <circle cx="20.2" cy="12.8" r="9.2" fill="var(--c-glow)" />
          <ellipse
            cx="16.4"
            cy="8.4"
            rx="3.6"
            ry="1.5"
            transform="rotate(-26 16.4 8.4)"
            fill={SHINE}
            opacity="0.72"
          />
          <rect x="16.8" y="9.4" width="6.8" height="6.8" rx="1.2" fill={WOOD_LIP} />
          <rect x="17.4" y="10" width="5.6" height="5.6" rx="0.9" fill={INK} />
        </>
      );
      break;

    case 'capsule':
      art = (
        <g transform="rotate(-14 16 16)">
          <circle cx="16" cy="18.6" r="10.8" fill={WOOD_LIP} />
          <path d="M5.2 15.8 A10.8 10.8 0 0 0 26.8 15.8 Z" fill={CREAM} />
          <path d="M5.2 15.8 A10.8 10.8 0 0 1 26.8 15.8 Z" fill={VERMILION} />
          <rect x="4.6" y="14.2" width="22.8" height="3.2" rx="1.6" fill={LACQUER_DARK} />
          <circle cx="16" cy="16.5" r="3.4" fill={INK} />
          <circle cx="16" cy="15.6" r="2.8" fill="var(--c-glow)" />
          <ellipse
            cx="11.6"
            cy="9.8"
            rx="4.2"
            ry="1.8"
            transform="rotate(-24 11.6 9.8)"
            fill={CREAM}
            opacity="0.46"
          />
        </g>
      );
      break;

    case 'scroll':
      art = (
        <g transform="rotate(-26 16 16)">
          <rect x="3" y="15.2" width="26" height="5" rx="2.5" fill={INK} />
          <rect x="3" y="12.8" width="26" height="4.8" rx="2.4" fill={LACQUER_DARK} />
          <circle cx="5.2" cy="15.2" r="2.2" fill="var(--c-glow)" />
          <circle cx="26.8" cy="15.2" r="2.2" fill="var(--c-glow)" />
          <rect x="7" y="11.8" width="18" height="10.8" rx="3.4" fill={WOOD_LIP} />
          <rect x="7" y="9.2" width="18" height="10.6" rx="3.4" fill={CREAM} />
          <rect x="7" y="9.2" width="5.8" height="10.6" rx="2.8" fill={INDIGO} />
          <rect x="15" y="8.8" width="3.2" height="11.4" rx="1.4" fill={VERMILION} />
          <circle cx="16.6" cy="14.5" r="2.5" fill="var(--c-lacquer)" />
          <circle cx="16.6" cy="13.8" r="2.2" fill="var(--c-accent)" />
          <ellipse cx="20.5" cy="11.6" rx="2.8" ry="1.1" fill={SHINE} opacity="0.75" />
        </g>
      );
      break;

    case 'check':
      art = (
        <>
          <g transform="translate(0 2.4)" fill="var(--c-lacquer)">
            <path d={BRUSH_RING_PATH} fillRule="evenodd" />
            <circle cx="26.4" cy="7.2" r="1.5" />
          </g>
          <g fill="color-mix(in srgb, var(--c-accent) 62%, var(--c-lacquer))">
            <path d={BRUSH_RING_PATH} fillRule="evenodd" />
            <circle cx="26.4" cy="7.2" r="1.5" />
          </g>
          <ellipse
            cx="10.4"
            cy="9.2"
            rx="3.2"
            ry="1.3"
            transform="rotate(-38 10.4 9.2)"
            fill={CREAM}
            opacity="0.38"
          />
        </>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 32 32"
      width={22}
      height={22}
      className={`ema-symbol ema-symbol-${symbol}`}
      aria-hidden="true"
      focusable="false"
    >
      {art}
    </svg>
  );
}

function EmaPlaqueBoard() {
  return (
    <svg viewBox="0 0 46 44" className="ema-plaque-board" aria-hidden="true" focusable="false">
      <ellipse cx="23" cy="41.5" rx="16" ry="2.2" fill="var(--c-shadow)" />
      {/* Short tone-coloured hanging cord & wooden peg */}
      <path
        d="M16.5 11.4 L23 3.9 L29.5 11.4"
        stroke="color-mix(in srgb, var(--ema-cord) 56%, var(--c-hud-bg))"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M16.5 10 L23 2.5 L29.5 10"
        stroke="var(--ema-cord)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="23" cy="3.5" r="2.2" fill={WOOD_LIP} />
      <circle cx="23" cy="2.6" r="2.1" fill="var(--c-panel-edge)" />
      {/* Pentagon wooden plaque (+3 shade lip + warm wood rim + hinoki face) */}
      <path
        d="M23 10.5 L42 20.5 V37.5 C42 40 40 42 37.5 42 H8.5 C6 42 4 40 4 37.5 V20.5 Z"
        fill={WOOD_LIP}
      />
      <path
        d="M23 7.5 L42 17.5 V34.5 C42 37 40 39 37.5 39 H8.5 C6 39 4 37 4 34.5 V17.5 Z"
        fill="var(--c-panel-edge)"
      />
      <path
        d="M23 9.5 L40 18.5 V34 C40 35.8 38.6 37.2 36.8 37.2 H9.2 C7.4 37.2 6 35.8 6 34 V18.5 Z"
        fill="color-mix(in srgb, var(--c-panel-edge) 44%, var(--c-coin-shine))"
      />
      {/* Peaked roof edge along the gable */}
      <path d="M2.2 19.2 L23 8.2 L43.8 19.2 L41.8 21.8 L23 12.2 L4.2 21.8 Z" fill={COIN_LIP} />
      <path
        d="M2.2 17.2 L23 6.2 L43.8 17.2 L41.8 19.8 L23 10.2 L4.2 19.8 Z"
        fill="color-mix(in srgb, var(--c-panel-edge) 68%, var(--c-lacquer))"
      />
      <path
        d="M8 15.2 L19.5 9.2"
        stroke={CREAM}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Cord eyelet & knot */}
      <circle cx="23" cy="13.4" r="1.7" fill={INK} />
      <path d="M23 9.5 V13.4" stroke="var(--ema-cord)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="23" cy="11.2" r="1.8" fill="var(--ema-cord)" />
    </svg>
  );
}

export function EmaNudge({ note }: { note: DeskNote }) {
  const body = (
    <>
      <span className="ema-plaque" aria-hidden="true">
        <EmaPlaqueBoard />
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
