import { useMemo, useRef, useState } from 'react';
import { foesOf } from '../../foundations/art/Enemy';
import { useNavigate, useParams } from 'react-router';
import {
  completeLesson,
  consumeItem,
  damageFor,
  heartsNow,
  isUnlocked,
  xpMultiplier,
  type LessonResult,
} from '../../engine/game';
import { prepareExercise } from '../../engine/exercises/plugins';
import {
  summarize,
  type SessionConfig,
  type SessionState,
  type SessionSummary,
} from '../../engine/lesson/session';
import { itemJapanese, itemMeaning, nodeKey } from '../../engine/pack/index';
import { Rng } from '../../engine/rng';
import type { Question } from '../../engine/exercises/types';
import { useGame } from '../../foundations/store/gameStore';
import { economy, regionForUnit } from '../../foundations/world';
import { SpeakableJa, RichText } from '../../foundations/japanese/Ja';
import { playSfx } from '../../foundations/audio/sfx';
import { commitHeartLoss, freshSeed, useSave, useStats } from '../hooks';
import { Player } from './Player';
import { MistakeReview, OutOfHearts, ResultCard, RewardRow } from './common';

export function LessonScreen() {
  const { packId = '', nodeId = '' } = useParams();
  const navigate = useNavigate();
  const index = useGame((s) => s.index);
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  const scheduler = useGame((s) => s.scheduler);
  const save = useSave();
  const stats = useStats();
  const key = nodeKey(packId, nodeId);
  const ref = index.node(key);
  const [phase, setPhase] = useState<'teach' | 'play' | 'results'>(
    ref?.node.teach?.length ? 'teach' : 'play',
  );
  const [teachStep, setTeachStep] = useState(0);
  const [outcome, setOutcome] = useState<{
    result: LessonResult;
    summary: SessionSummary;
    state: SessionState;
  } | null>(null);
  const [showReview, setShowReview] = useState(false);
  const lost = useRef(0);

  const introducedSoFar = useMemo(() => {
    const ids = new Set<string>();
    for (const n of index.nodesThrough(key)) n.node.introduces.forEach((i) => ids.add(i));
    for (const c of Object.keys(save.cards)) ids.add(c.split('#')[0]!);
    return ids;
    // the lesson's question set is fixed when it starts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, index]);

  const questions = useMemo<Question[]>(() => {
    if (!ref) return [];
    const rng = new Rng(freshSeed());
    return ref.node.exercises
      .map((e) => prepareExercise(e, { index, rng, isAvailable: (id) => introducedSoFar.has(id) }))
      .filter((q): q is Question => !!q);
  }, [ref, index, introducedSoFar]);

  // Fixed when the lesson opens: hearts and boosts at the start of the lesson.
  const [config] = useState<SessionConfig>(() => ({
    hearts: heartsNow(save, gctx()),
    // Mistakes hurt more the further along the story this lesson's unit is.
    damage: damageFor(economy, ref?.unitIndex ?? 0),
    economy,
    xpMultiplier: xpMultiplier(save, gctx()),
    requeueMistakes: true,
  }));

  if (!ref)
    return (
      <div className="card">
        That lesson is not installed. <a href="#/path">Back to the path</a>
      </div>
    );
  const ordered = index.paths.find((p) => p.pack.pack.id === packId)?.nodes.map((n) => n.key) ?? [];
  if (!isUnlocked(save, ordered, key))
    return (
      <div className="card">
        Finish the earlier lessons first. <a href="#/path">Back to the path</a>
      </div>
    );
  if (phase !== 'results' && stats.hearts === 0)
    return <OutOfHearts onBack={() => navigate('/path')} />;

  if (phase === 'teach') {
    const teach = ref.node.teach ?? [];
    const t = teach[teachStep]!;
    const item = 'item' in t ? index.item(t.item) : undefined;
    return (
      <div className="stack" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="row spread">
          <span className="eyebrow">
            {ref.unit.title} · {ref.node.title}
          </span>
          <span className="muted small">
            {teachStep + 1} / {teach.length}
          </span>
        </div>
        <div className="card teach-card stack" key={teachStep}>
          {item ? (
            <>
              <span className="pill pill-accent" style={{ alignSelf: 'center' }}>
                New {item.kind}
              </span>
              <SpeakableJa text={itemJapanese(item)} className="display-ja" role="teach" />
              {item.romaji && item.romaji !== item.meanings[0] && (
                <p className="muted">{item.romaji}</p>
              )}
              <h2>{itemMeaning(item)}</h2>
              {item.meanings.length > 1 && (
                <p className="muted small">Also: {item.meanings.slice(1).join(', ')}</p>
              )}
              {item.kind === 'phrase' && <p className="small">{item.usage}</p>}
              {item.kind === 'pattern' && (
                <div className="stack small">
                  {item.examples.map((ex, i) => (
                    <p key={i}>
                      <SpeakableJa text={ex.text} /> — {ex.en}
                    </p>
                  ))}
                </div>
              )}
              {item.notes && (
                <p className="small muted">
                  <RichText text={item.notes} />
                </p>
              )}
            </>
          ) : 'note' in t ? (
            <>
              <h2>{t.note.title}</h2>
              <p style={{ textAlign: 'left' }}>
                <RichText text={t.note.body} />
              </p>
            </>
          ) : null}
        </div>
        <div className="row">
          <button className="btn btn-ghost" onClick={() => navigate('/path')}>
            Leave
          </button>
          <button
            className="btn btn-accent"
            style={{ flex: 1 }}
            autoFocus
            onClick={() =>
              teachStep + 1 < teach.length ? setTeachStep(teachStep + 1) : setPhase('play')
            }
          >
            {teachStep + 1 < teach.length ? 'Next' : 'Start lesson'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'play') {
    return (
      <Player
        questions={questions}
        config={config}
        foes={foesOf(regionForUnit(ref?.unitIndex ?? 0).foes)}
        lanterns={stats.inventory('chochin')}
        onUseLantern={() => commit(consumeItem(useGame.getState().save!, gctx(), 'chochin'))}
        onAnswered={(st) => {
          commitHeartLoss(lost.current, st.heartsLost, key);
          lost.current = st.heartsLost;
          return st;
        }}
        onQuit={() => {
          if (
            window.confirm(
              'Quit this lesson? Its XP is lost, and hearts you already lost stay lost.',
            )
          )
            navigate('/path');
        }}
        onFinish={(state) => {
          const summary = summarize(state, config);
          const result = completeLesson(
            useGame.getState().save!,
            gctx(),
            {
              nodeKey: key,
              summary,
              heartsLost: 0, // already committed answer by answer
              completed: state.status === 'complete',
              introduces: ref.node.introduces.map((id) => index.item(id)).filter((x) => !!x),
              totalQuestions: state.total,
            },
            scheduler!,
          );
          commit(result.save);
          playSfx(state.status === 'complete' ? 'complete' : 'fail');
          setOutcome({ result, summary, state });
          setPhase('results');
        }}
      />
    );
  }

  if (!outcome) return null;
  const { result, summary, state } = outcome;
  const failed = state.status !== 'complete';
  return (
    <div className="stack" style={{ maxWidth: 640, margin: '0 auto' }}>
      <ResultCard
        title={failed ? 'Out of hearts' : ref.node.title}
        failed={failed}
        stars={summary.stars}
      >
        <div className="stack" style={{ gap: 'var(--sp-2)', textAlign: 'left' }}>
          <RewardRow
            label="XP"
            value={`+${result.reward.xp}`}
            count={result.reward.xp}
            tone="accent"
          />
          <RewardRow
            label="Yen"
            value={`+${result.reward.yen}`}
            count={result.reward.yen}
            icon="yen"
            tone="gold"
          />
          {result.reward.tokens > 0 && (
            <RewardRow
              label="Koban (gacha coin)"
              value={`+${result.reward.tokens}`}
              icon="token"
              tone="gold"
            />
          )}
          <RewardRow label="Accuracy" value={`${Math.round(summary.accuracy * 100)}%`} />
          <RewardRow label="Best combo" value={state.maxCombo} />
          {result.streakExtended && (
            <RewardRow
              label="Streak"
              value={`${result.save.streak.current} day${result.save.streak.current === 1 ? '' : 's'}`}
              tone="success"
            />
          )}
          {result.milestone && (
            <RewardRow label={`${result.milestone}-day milestone!`} value="bonus yen" tone="gold" />
          )}
          {result.newItems.length > 0 && (
            <RewardRow label="New spirits woken" value={result.newItems.length} tone="success" />
          )}
          <p className="muted small">{result.reward.breakdown.join(' · ')}</p>
        </div>
      </ResultCard>
      {result.newItems.length > 0 && (
        <section className="card card-tight stack">
          <h2>Added to your reviews</h2>
          <div className="row">
            {result.newItems.map((id) => {
              const it = index.item(id);
              return it ? <SpeakableJa key={id} text={itemJapanese(it)} className="pill" /> : null;
            })}
          </div>
        </section>
      )}
      <div className="row">
        <button
          className="btn"
          style={{ flex: 1 }}
          onClick={() => setShowReview((v) => !v)}
          aria-expanded={showReview}
        >
          {showReview ? 'Hide review' : `Review mistakes (${summary.mistakes.length})`}
        </button>
        <button
          className="btn btn-accent"
          style={{ flex: 1 }}
          onClick={() => navigate('/path')}
          autoFocus
        >
          Continue
        </button>
      </div>
      {showReview && <MistakeReview mistakes={summary.mistakes} />}
    </div>
  );
}
