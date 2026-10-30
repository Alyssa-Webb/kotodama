/**
 * Koto's guided tour: the ? button on Home starts it. Each stop (world/koto.json "tour") puts a
 * spotlight on part of the app while Koto, in the costume that fits that place, points at it
 * and explains it in a speech bubble (Japanese line, voiced, plus English). Back, Next, Skip;
 * Escape closes. The tour reads the live layout, so it follows the UI as it changes.
 */
import { useCallback, useEffect, useLayoutEffect, useState, type CSSProperties } from 'react';
import { Mascot } from '../../foundations/art/Mascot';
import { JaText, useJa } from '../../foundations/japanese/Ja';
import { haptic } from '../../foundations/haptics/haptics';
import { koto } from '../../foundations/world';
import './tour.css';

type Listener = (open: boolean) => void;
const listeners = new Set<Listener>();
export const startTour = () => listeners.forEach((l) => l(true));

interface Spot {
  x: number;
  y: number;
  w: number;
  h: number;
}

function measure(selector: string): Spot | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const pad = 8;
  return { x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 };
}

export function Tour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [spot, setSpot] = useState<Spot | null>(null);
  const { speak } = useJa();
  const stops = koto.tour;
  const stop = stops[step]!;

  useEffect(() => {
    const l: Listener = (o) => {
      setStep(0);
      setOpen(o);
    };
    listeners.add(l);
    return () => void listeners.delete(l);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const go = useCallback(
    (d: 1 | -1) => {
      haptic('tick');
      if (step + d >= stops.length) return close();
      setStep(Math.max(0, step + d));
    },
    [step, stops.length, close],
  );

  // Bring the target into view, then measure it (and keep it measured while the page moves).
  useLayoutEffect(() => {
    if (!open) return;
    document.querySelector(stop.target)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    let raf = 0;
    const track = () => {
      setSpot(measure(stop.target));
      raf = requestAnimationFrame(track);
    };
    const t = window.setTimeout(() => (raf = requestAnimationFrame(track)), 60);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [open, stop.target]);

  useEffect(() => {
    if (!open) return;
    speak(stop.ja, { role: 'teach' });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step, stop.ja, speak, close, go]);

  if (!open) return null;
  const vh = window.innerHeight;
  // Koto and his bubble sit on whichever side of the spotlight has more room.
  const below = !spot || spot.y + spot.h / 2 < vh / 2;
  const guideStyle: CSSProperties = below
    ? { top: Math.min(vh - 260, (spot ? spot.y + spot.h : 80) + 12) }
    : { bottom: Math.min(vh - 260, vh - (spot ? spot.y : vh - 80) + 12) };
  return (
    <div className="tour" role="dialog" aria-modal="true" aria-label="Koto's tour">
      <div
        className="tour-spot"
        style={
          spot
            ? { width: spot.w, height: spot.h, transform: `translate(${spot.x}px, ${spot.y}px)` }
            : { width: 0, height: 0, transform: 'translate(50vw, 40vh)' }
        }
      />
      <div className={`tour-guide ${below ? 'tour-below' : 'tour-above'}`} style={guideStyle}>
        <div key={step} className="tour-koto">
          <Mascot pose={stop.pose} outfit={stop.outfit} size={104} facing="right" />
        </div>
        <div key={`b${step}`} className="tour-bubble">
          <p className="tour-ja" lang="ja">
            <JaText text={stop.ja} />
          </p>
          <p className="tour-en">{stop.en}</p>
          <div className="tour-nav">
            <span className="tour-dots" aria-label={`Step ${step + 1} of ${stops.length}`}>
              {stops.map((_, i) => (
                <i key={i} className={i === step ? 'on' : ''} />
              ))}
            </span>
            <button className="btn btn-ghost btn-small" onClick={close}>
              Skip
            </button>
            {step > 0 && (
              <button className="btn btn-small" onClick={() => go(-1)}>
                Back
              </button>
            )}
            <button className="btn btn-accent btn-small" onClick={() => go(1)} autoFocus>
              {step + 1 < stops.length ? 'Next' : 'Done!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The ? button: Koto peeks out and offers the tour. */
export function TourButton() {
  return (
    <button className="tour-btn" onClick={startTour} aria-label="Tour the app with Koto">
      ?
    </button>
  );
}
