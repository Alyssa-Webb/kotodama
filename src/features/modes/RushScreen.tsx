import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { append, balanceOf } from '../../engine/economy/ledger';
import { today } from '../../engine/game';
import { prepareExercise } from '../../engine/exercises/plugins';
import type { Question } from '../../engine/exercises/types';
import type { SessionConfig, SessionState } from '../../engine/lesson/session';
import { Rng } from '../../engine/rng';
import type { Exercise, Item } from '../../schema/pack';
import { useGame } from '../../foundations/store/gameStore';
import { economy } from '../../foundations/world';
import { playSfx } from '../../foundations/audio/sfx';
import { freshSeed, useSave } from '../hooks';
import { Player } from '../lesson/Player';
import { ResultCard, RewardRow } from '../lesson/common';

const SECONDS = economy.rush.seconds;
type Mode = 'kana' | 'listening' | 'dictation';

export function RushScreen() {
  const mode = (useParams().mode ?? 'kana') as Mode;
  const save = useSave();
  const index = useGame((s) => s.index);
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'ready' | 'play' | 'done'>('ready');
  const [extras, setExtras] = useState({ daruma: false, hourglass: false });
  const [left, setLeft] = useState(SECONDS);
  const [score, setScore] = useState(0);
  const times = useRef<number[]>([]);
  const t0 = useRef(0);
  const [pb, setPb] = useState(false);

  const known = useMemo(
    () => new Set(Object.keys(save.cards).map((k) => k.split('#')[0]!)),
    [save.cards],
  );
  const pool = useMemo(() => {
    const all =
      mode === 'kana'
        ? index.itemsOfKind('kana')
        : index.allItems().filter((i) => i.kind !== 'pattern');
    const k = all.filter((i) => known.has(i.id));
    return k.length >= 3 ? k : all;
  }, [mode, index, known]);

  const questions = useMemo<Question[]>(() => {
    if (phase !== 'play') return [];
    const rng = new Rng(freshSeed());
    const out: Question[] = [];
    for (let i = 0; i < 300 && pool.length >= 3; i++) {
      const item = rng.pick(pool);
      const ds = rng
        .shuffle(pool.filter((p: Item) => p.id !== item.id && p.kind === item.kind))
        .slice(0, 3)
        .map((p) => p.id);
      const ex: Exercise =
        mode === 'kana'
          ? {
              id: `rush.${i}`,
              type: 'choice',
              item: item.id,
              ask: 'meaning',
              distractors: ds.length
                ? ds
                : pool
                    .filter((p) => p.id !== item.id)
                    .slice(0, 2)
                    .map((p) => p.id),
            }
          : mode === 'listening'
            ? {
                id: `rush.${i}`,
                type: 'listen',
                item: item.id,
                distractors: ds.length
                  ? ds
                  : pool
                      .filter((p) => p.id !== item.id)
                      .slice(0, 2)
                      .map((p) => p.id),
              }
            : { id: `rush.${i}`, type: 'dictation', item: item.id };
      const q = prepareExercise(ex, { index, rng, isAvailable: () => true });
      if (q) out.push({ ...q, targets: [] });
    }
    return out;
  }, [phase, pool, index, mode]);

  const misses = economy.rush.misses + (extras.daruma ? economy.rush.darumaLives : 0);
  const config: SessionConfig = {
    hearts: misses,
    economy,
    xpMultiplier: 1,
    requeueMistakes: false,
  };

  useEffect(() => {
    if (phase !== 'play') return;
    t0.current = performance.now();
    const t = window.setInterval(() => setLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [phase]);

  const finish = (final: number) => {
    if (phase === 'done') return;
    const c = gctx();
    const s = useGame.getState().save!;
    const prev = s.rush[mode];
    const isPb = final > (prev?.best ?? 0);
    setPb(isPb);
    commit({
      ...s,
      rush: {
        ...s.rush,
        [mode]: isPb
          ? { best: final, ghost: { score: final, times: times.current } }
          : (prev ?? { best: 0 }),
      },
      ledger:
        isPb && final > 0
          ? append(s.ledger, c.now, today(s, c), [
              {
                asset: 'koban',
                amount: economy.earn.rushPersonalBest,
                reason: 'rush-best',
                ref: mode,
              },
            ])
          : s.ledger,
    });
    playSfx(isPb ? 'complete' : 'fail');
    setPhase('done');
  };

  useEffect(() => {
    if (phase === 'play' && left === 0) finish(score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, phase]);

  const ghost = save.rush[mode]?.ghost;
  const elapsed = (SECONDS + (extras.hourglass ? economy.rush.hourglassSeconds : 0) - left) * 1000;
  const ghostScore = ghost ? ghost.times.filter((t) => t <= elapsed).length : 0;
  const title =
    mode === 'kana' ? 'Kana Rush' : mode === 'listening' ? 'Listening Rush' : 'Dictation drill';

  if (phase === 'ready') {
    const inv = (id: string) => balanceOf(save.ledger, `item:${id}`);
    return (
      <div className="stack" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="card stack center">
          <h1>{title}</h1>
          <p className="muted">
            {SECONDS} seconds. {misses} misses and you're out. Best: {save.rush[mode]?.best ?? 0}.
          </p>
          {pool.length < 3 && <p className="bad-text">Learn a few items first.</p>}
          <label className="row" style={{ justifyContent: 'center' }}>
            <input
              type="checkbox"
              style={{ width: 24, minHeight: 24 }}
              disabled={!inv('daruma')}
              checked={extras.daruma}
              onChange={(e) => setExtras({ ...extras, daruma: e.target.checked })}
            />{' '}
            Use a daruma (+{economy.rush.darumaLives} life, have {inv('daruma')})
          </label>
          <label className="row" style={{ justifyContent: 'center' }}>
            <input
              type="checkbox"
              style={{ width: 24, minHeight: 24 }}
              disabled={!inv('sunadokei')}
              checked={extras.hourglass}
              onChange={(e) => setExtras({ ...extras, hourglass: e.target.checked })}
            />{' '}
            Use an hourglass (+{economy.rush.hourglassSeconds} s, have {inv('sunadokei')})
          </label>
          <button
            className="btn btn-accent btn-block"
            disabled={pool.length < 3}
            onClick={() => {
              const c = gctx();
              const used = [extras.daruma && 'daruma', extras.hourglass && 'sunadokei'].filter(
                Boolean,
              ) as string[];
              if (used.length)
                commit({
                  ...save,
                  ledger: append(
                    save.ledger,
                    c.now,
                    today(save, c),
                    used.map((id) => ({
                      asset: `item:${id}` as const,
                      amount: -1,
                      reason: 'used',
                    })),
                  ),
                });
              setLeft(SECONDS + (extras.hourglass ? economy.rush.hourglassSeconds : 0));
              times.current = [];
              setScore(0);
              setPhase('play');
            }}
          >
            Start
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/modes')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'done')
    return (
      <div className="stack" style={{ maxWidth: 560, margin: '0 auto' }}>
        <ResultCard title={pb ? 'New personal best!' : title}>
          <RewardRow label="Score" value={score} tone="accent" />
          {ghost && <RewardRow label="Ghost (previous best)" value={ghost.score} />}
          {pb && score > 0 && (
            <RewardRow label="Koban" value={`+${economy.earn.rushPersonalBest}`} tone="gold" />
          )}
        </ResultCard>
        <div className="row">
          <button className="btn" style={{ flex: 1 }} onClick={() => setPhase('ready')}>
            Again
          </button>
          <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => navigate('/modes')}>
            Done
          </button>
        </div>
      </div>
    );

  return (
    <Player
      questions={questions}
      config={config}
      lanterns={0}
      onUseLantern={() => undefined}
      header={
        <div className="row spread">
          <span className="pill pill-accent" aria-live="polite">
            ⏱ {left}s
          </span>
          <span className="pill pill-gold">Score {score}</span>
          {ghost && <span className="pill">Ghost {ghostScore}</span>}
        </div>
      }
      onAnswered={(s: SessionState, r) => {
        if (r.correct) {
          times.current.push(performance.now() - t0.current);
          setScore((n) => n + 1);
        }
        return s;
      }}
      onQuit={() => finish(score)}
      onFinish={(s) => finish(s.attempts.filter((a) => a.result.correct).length)}
    />
  );
}
