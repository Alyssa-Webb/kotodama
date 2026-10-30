import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { applyKintsugi, weakestItems } from '../../engine/game';
import { reviewQuestions } from '../../engine/review';
import { Rng } from '../../engine/rng';
import type { SessionConfig } from '../../engine/lesson/session';
import { useGame } from '../../foundations/store/gameStore';
import { economy } from '../../foundations/world';
import { freshSeed, useSave } from '../hooks';
import { Player } from '../lesson/Player';
import { ResultCard } from '../lesson/common';

/** Redemption Trial: 20 questions from your weakest items, at most 2 mistakes, to mend a streak with Kintsugi. */
export function TrialScreen() {
  const save = useSave();
  const index = useGame((s) => s.index);
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  const navigate = useNavigate();
  const [result, setResult] = useState<'passed' | 'failed' | null>(null);
  const { questions: n, maxMistakes } = economy.redemptionTrial;
  const questions = useMemo(() => {
    const items = weakestItems(save, n);
    const keys = items.flatMap((id) =>
      Object.keys(save.cards).filter((k) => k.startsWith(`${id}#`)),
    );
    const qs = reviewQuestions(save, keys, index, new Rng(freshSeed()), n);
    return qs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // The trial uses its own mistake budget instead of hearts.
  const config: SessionConfig = {
    hearts: maxMistakes + 1,
    economy,
    xpMultiplier: 1,
    requeueMistakes: false,
  };
  if (!save.streak.broken) return <div className="card">No broken streak to mend.</div>;
  if (questions.length < Math.min(10, n))
    return (
      <div className="card stack" style={{ maxWidth: 520, margin: '0 auto' }}>
        <h1>Not enough to test yet</h1>
        <p>
          The Redemption Trial draws from your weakest items, and you have learned too few so far.
          Your Kintsugi is kept.
        </p>
        <button className="btn btn-accent" onClick={() => navigate('/shop')}>
          Back to the shop
        </button>
      </div>
    );
  if (result)
    return (
      <div className="stack" style={{ maxWidth: 560, margin: '0 auto' }}>
        <ResultCard
          title={result === 'passed' ? 'Mended with gold' : 'The trial was too much today'}
          failed={result === 'failed'}
        >
          <p>
            {result === 'passed'
              ? `Your streak is back: ${useGame.getState().save!.streak.current} days.`
              : 'Your Kintsugi is kept. Study, then try again before the repair window closes.'}
          </p>
        </ResultCard>
        <button className="btn btn-accent" onClick={() => navigate('/')}>
          Home
        </button>
      </div>
    );
  return (
    <Player
      questions={questions}
      config={config}
      lanterns={0}
      onUseLantern={() => undefined}
      header={
        <p className="small muted">
          Redemption Trial: {questions.length} questions, at most {maxMistakes} mistakes. Hearts are
          not used.
        </p>
      }
      onQuit={() => navigate('/shop')}
      onFinish={(state) => {
        const passed = state.status === 'complete' && state.heartsLost <= maxMistakes;
        if (passed) {
          const next = applyKintsugi(useGame.getState().save!, gctx(), true);
          if (next) commit(next);
        }
        setResult(passed ? 'passed' : 'failed');
      }}
    />
  );
}
