/** Pieces shared by lesson-like screens: out-of-hearts gate, results, lesson review. */
import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Attempt } from '../../engine/lesson/session';
import { DisplayText } from './shapes';
import { JaText } from '../../foundations/japanese/Ja';
import { Slot } from '../../foundations/slots/Slot';
import { useStats } from '../hooks';

export function OutOfHearts({ onBack }: { onBack: () => void }) {
  const s = useStats();
  return (
    <div className="stack center" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="card stack">
        <p className="display-ja" lang="ja" aria-hidden="true">
          ♡
        </p>
        <h1>Out of hearts</h1>
        <p className="muted">Hardcore rules: hearts are shared across lessons.</p>
        {s.nextHeartMin !== null && <p>Next heart in {s.nextHeartMin} min.</p>}
        <Link className="btn btn-indigo btn-block" to="/reviews">
          Earn hearts in the Dojo (10 reviews = 1 heart)
        </Link>
        <Link className="btn btn-block" to="/shop">
          Buy an onigiri (restores 1 heart)
        </Link>
        <button className="btn btn-ghost" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}

export function Stars({ n }: { n: number }) {
  return (
    <p className="stars" aria-label={`${n} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? '' : 'off'} aria-hidden="true">
          ★
        </span>
      ))}
    </p>
  );
}

export function ResultCard({
  title,
  children,
  failed,
}: {
  title: string;
  children: ReactNode;
  failed?: boolean;
}) {
  // Results replace a long, scrolled lesson screen: start at the top.
  useEffect(() => window.scrollTo(0, 0), []);
  return (
    <Slot
      slot="lesson.complete"
      fire={true}
      className={`card result-hero stack ${failed ? '' : 'card-accent'}`}
    >
      <p className="eyebrow">{failed ? 'Lesson failed' : 'Complete'}</p>
      <h1>{title}</h1>
      {children}
    </Slot>
  );
}

export function RewardRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: 'gold' | 'accent' | 'success';
}) {
  return (
    <div className="row spread">
      <span>{label}</span>
      <span className={`pill ${tone ? `pill-${tone}` : ''}`}>{value}</span>
    </div>
  );
}

/** Lesson review (Chess.com-style): every mistake with the right answer. */
export function MistakeReview({ mistakes }: { mistakes: Attempt[] }) {
  if (!mistakes.length) return <p className="muted center">No mistakes. Flawless.</p>;
  return (
    <ol className="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {mistakes.map((m, i) => (
        <li key={i} className="card card-tight stack" style={{ gap: 'var(--sp-1)' }}>
          <span className="eyebrow">{m.question.prompt.instruction}</span>
          {m.question.prompt.ja && (
            <span className="big-ja">
              <JaText text={m.question.prompt.ja} />
            </span>
          )}
          {m.question.prompt.en && <span>{m.question.prompt.en}</span>}
          {m.question.prompt.audio && !m.question.prompt.ja && (
            <span className="muted small">
              Heard: <JaText text={m.question.prompt.audio} />
            </span>
          )}
          <span className="bad-text small">You: {m.result.given || '—'}</span>
          <span className="small">
            Right: <DisplayText d={m.question.solution} speak />
          </span>
          {m.question.note && <span className="muted small">{m.question.note}</span>}
        </li>
      ))}
    </ol>
  );
}
