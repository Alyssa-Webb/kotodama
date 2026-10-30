import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  completeReviews,
  consumeItem,
  dueCards,
  heartsNow,
  xpMultiplier,
  type ReviewResult,
} from '../../engine/game';
import { reviewQuestions } from '../../engine/review';
import { summarize, type SessionConfig, type SessionSummary } from '../../engine/lesson/session';
import { Rng } from '../../engine/rng';
import { useGame } from '../../foundations/store/gameStore';
import { economy } from '../../foundations/world';
import { playSfx } from '../../foundations/audio/sfx';
import { freshSeed, useSave, useStats } from '../hooks';
import { Player } from '../lesson/Player';
import { MistakeReview, ResultCard, RewardRow } from '../lesson/common';
import { cardsOf, spiritStage } from '../../engine/world';
import { itemOfCard } from '../../engine/memory/scheduler';

export function ReviewsScreen({ session = false }: { session?: boolean }) {
  const save = useSave();
  const stats = useStats();
  const navigate = useNavigate();
  const index = useGame((s) => s.index);
  const scheduler = useGame((s) => s.scheduler)!;
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  const [done, setDone] = useState<{ r: ReviewResult; summary: SessionSummary } | null>(null);
  const [practice] = useState(() => session && dueCards(save, gctx().now).length === 0);

  const questions = useMemo(() => {
    if (!session) return [];
    const now = gctx().now;
    let keys = dueCards(save, now);
    // Nothing due: a practice round from the weakest-looking cards so hearts can still be earned.
    if (!keys.length)
      keys = Object.entries(save.cards)
        .sort((a, b) => a[1].stability - b[1].stability)
        .map(([k]) => k);
    return reviewQuestions(save, keys, index, new Rng(freshSeed()), 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  const config = useMemo<SessionConfig>(
    () => ({
      hearts: heartsNow(save, gctx()),
      economy,
      xpMultiplier: xpMultiplier(save, gctx(), true),
      requeueMistakes: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session],
  );

  if (!session) {
    const now = stats.now;
    const items = [...new Set(Object.keys(save.cards).map(itemOfCard))];
    const stages = items.map((id) =>
      spiritStage(cardsOf(save, id), now, scheduler, save.boosts.omamori[id] ?? 0),
    );
    const count = (s: string) => stages.filter((x) => x === s).length;
    return (
      <div className="stack">
        <h1>Dojo</h1>
        <section className="card stack">
          <p className="eyebrow">Fog-clearing expedition</p>
          <h2>{stats.due ? `${stats.due} reviews due` : 'All clear'}</h2>
          <div className="row">
            <span className="pill pill-success">{count('guardian')} guardians</span>
            <span className="pill">{count('sprite') + count('egg')} sprites</span>
            <span className="pill pill-accent">{count('fading')} fading</span>
            <span className="pill">{count('lost')} lost in fog</span>
          </div>
          <p className="muted small">
            Every 10 reviews earn back a heart. Clearing every due review pays{' '}
            {economy.earn.clearAllReviews} koban and a capsule token.
          </p>
          <Link className="btn btn-indigo btn-block" to="/dojo" aria-disabled={!items.length}>
            {stats.due
              ? 'Start rescue'
              : items.length
                ? 'Practice anyway'
                : 'Finish a lesson first'}
          </Link>
        </section>
      </div>
    );
  }

  if (!questions.length)
    return (
      <div className="card stack" style={{ maxWidth: 520, margin: '0 auto' }}>
        <h1>Nothing to review yet</h1>
        <p>Finish a lesson and its words join your reviews.</p>
        <button className="btn btn-accent" onClick={() => navigate('/')}>
          Home
        </button>
      </div>
    );

  if (done)
    return (
      <div className="stack" style={{ maxWidth: 640, margin: '0 auto' }}>
        <ResultCard
          title={
            practice ? 'Practice done' : done.r.clearedAll ? 'The fog lifts' : 'Spirits rescued'
          }
        >
          <div className="stack" style={{ gap: 'var(--sp-2)', textAlign: 'left' }}>
            <RewardRow label="XP" value={`+${done.r.xp}`} tone="accent" />
            {done.r.koban > 0 && (
              <RewardRow label="All reviews cleared" value={`+${done.r.koban} koban`} tone="gold" />
            )}
            {done.r.tokens > 0 && (
              <RewardRow label="Capsule token" value={`+${done.r.tokens}`} tone="gold" />
            )}
            {done.r.heartsEarned > 0 && (
              <RewardRow
                label="Hearts earned back"
                value={`+${done.r.heartsEarned}`}
                tone="success"
              />
            )}
            <RewardRow label="Accuracy" value={`${Math.round(done.summary.accuracy * 100)}%`} />
          </div>
        </ResultCard>
        <MistakeReview mistakes={done.summary.mistakes} />
        <button className="btn btn-accent" onClick={() => navigate('/reviews')} autoFocus>
          Continue
        </button>
      </div>
    );

  return (
    <Player
      questions={questions}
      config={config}
      lanterns={stats.inventory('chochin')}
      onUseLantern={() => commit(consumeItem(useGame.getState().save!, gctx(), 'chochin'))}
      onQuit={() => navigate('/reviews')}
      onFinish={(state) => {
        const summary = summarize(state, config);
        const answered = state.attempts.filter((a) => !a.retry).length;
        const r = completeReviews(
          useGame.getState().save!,
          gctx(),
          { summary, heartsLost: state.heartsLost, reviewed: answered },
          scheduler,
        );
        commit(r.save);
        playSfx('complete');
        setDone({ r, summary });
      }}
    />
  );
}
