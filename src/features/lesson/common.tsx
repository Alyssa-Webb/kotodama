/** Pieces shared by lesson-like screens: out-of-hearts gate, results, lesson review. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Attempt } from '../../engine/lesson/session';
import { DisplayText } from './shapes';
import { JaText } from '../../foundations/japanese/Ja';
import { Slot } from '../../foundations/slots/Slot';
import { Scene } from '../../foundations/art/Scene';
import { Guide } from '../../foundations/art/Guide';
import { CapsuleIcon, HeartIcon, YenIcon, StarIcon } from '../../foundations/art/icons';
import { fx } from '../../foundations/fx/fx';
import { moments } from '../../foundations/moments/moments';
import { AvatarActor } from '../avatar/AvatarActor';
import { tokens } from '../../foundations/theme/theme';
import { prefersReducedMotion } from '../../foundations/platform';
import { playSfx } from '../../foundations/audio/sfx';
import { useStats } from '../hooks';

export function OutOfHearts({ onBack }: { onBack: () => void }) {
  const s = useStats();
  return (
    <div className="stack center" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="card stack">
        <div style={{ margin: '0 auto' }}>
          <Guide who="tetsu" mood="worried" size={110} />
        </div>
        <div className="row" style={{ justifyContent: 'center', gap: 2 }} aria-hidden="true">
          {Array.from({ length: s.maxHearts ?? 0 }, (_, i) => (
            <HeartIcon key={i} size={28} empty />
          ))}
        </div>
        <h1>Out of hearts</h1>
        <p className="muted">
          Hearts are shared across lessons. Rest, or train in the Dojo to earn them back.
        </p>
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

export function Stars({
  n,
  size = 44,
  celebrate,
}: {
  n: number;
  size?: number;
  celebrate?: boolean;
}) {
  const els = useRef<(HTMLSpanElement | null)[]>([]);
  // Each earned star thuds in the same frame its stamp animation lands (lesson.css `stamp`).
  useEffect(() => {
    if (!celebrate) return;
    const timers = [1, 2, 3]
      .filter((i) => i <= n)
      .map((i) =>
        window.setTimeout(
          () => {
            fx.slot('star.earn', els.current[i - 1]);
            playSfx('tap');
          },
          tokens.motion.stamp * (0.6 * (i - 1) + 0.55),
        ),
      );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [celebrate, n]);
  return (
    <div className="stars" aria-label={`${n} of 3 stars`} role="img">
      {[1, 2, 3].map((i) => (
        <span key={i} className="star" ref={(el) => void (els.current[i - 1] = el)}>
          <StarIcon size={size} on={i <= n} />
        </span>
      ))}
    </div>
  );
}

/** Counts up from 0 to `to` (instant with reduced motion). */
export function CountUp({ to, prefix = '' }: { to: number; prefix?: string }) {
  const [v, setV] = useState(prefersReducedMotion() ? to : 0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / tokens.motion.countUp);
      setV(Math.round(to * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <>
      {prefix}
      {v}
    </>
  );
}

const GRADE = { 3: '優', 2: '良', 1: '可', 0: '' } as const;

export function ResultCard({
  title,
  children,
  failed,
  stars,
}: {
  title: string;
  children: ReactNode;
  failed?: boolean;
  stars?: number;
}) {
  const card = useRef<HTMLDivElement>(null);
  // Wins open behind the noren curtains; the celebration starts as they lift.
  const [revealed, setRevealed] = useState(!!failed);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (failed) return;
    let live = true;
    let t = 0;
    void moments.finish().then(() => {
      if (!live) return;
      setRevealed(true);
      fx.slot('lesson.complete', card.current);
      t = window.setTimeout(() => {
        fx.slot('coin.earned', card.current);
        playSfx('coin');
      }, tokens.motion.stamp * 1.5);
    });
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [failed]);
  return (
    <div ref={card}>
      <Slot
        slot="lesson.complete"
        fire={revealed}
        className={`card result-hero stack ${failed ? '' : 'card-accent'}`}
      >
        <Scene
          className="result-scene"
          height={120}
          awake={failed ? 0.1 : 1}
          ambient={failed ? 'none' : 'petals'}
        />
        <div className="result-avatar">
          <AvatarActor mood={failed ? 'worried' : revealed ? 'cheer' : 'idle'} size={76} />
        </div>
        <p className="eyebrow">{failed ? 'Lesson failed' : 'Complete'}</p>
        <h1>{title}</h1>
        {stars !== undefined && !failed && revealed && <Stars n={stars} celebrate />}
        {stars !== undefined && !failed && revealed && GRADE[stars as 0 | 1 | 2 | 3] && (
          <span className="hanko" lang="ja" aria-label={`Grade ${GRADE[stars as 0 | 1 | 2 | 3]}`}>
            {GRADE[stars as 0 | 1 | 2 | 3]}
          </span>
        )}
        {children}
      </Slot>
    </div>
  );
}

const ICON = {
  xp: null,
  yen: <YenIcon size={22} />,
  token: <CapsuleIcon size={22} />,
  heart: <HeartIcon size={22} />,
} as const;

export function RewardRow({
  label,
  value,
  tone,
  icon,
  count,
}: {
  label: string;
  value: string | number;
  tone?: 'gold' | 'accent' | 'success';
  icon?: keyof typeof ICON;
  count?: number;
}) {
  return (
    <div className="reward-row">
      <span>{label}</span>
      <span className={`reward-value ${tone ?? ''}`}>
        {icon && ICON[icon]}
        {count !== undefined ? <CountUp to={count} prefix="+" /> : value}
      </span>
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
