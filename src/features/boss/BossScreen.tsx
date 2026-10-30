import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { canChallenge, hit, phasePools, startBoss, type BossState } from '../../engine/boss';
import { append } from '../../engine/economy/ledger';
import { completeLesson, heartsNow, isUnlocked, today, xpMultiplier } from '../../engine/game';
import { prepareExercise } from '../../engine/exercises/plugins';
import type { Question } from '../../engine/exercises/types';
import {
  startSession,
  summarize,
  type SessionConfig,
  type SessionState,
} from '../../engine/lesson/session';
import { nodeKey } from '../../engine/pack/index';
import { Rng } from '../../engine/rng';
import { useGame } from '../../foundations/store/gameStore';
import { bosses, economy } from '../../foundations/world';
import { SpeakableJa, useJa } from '../../foundations/japanese/Ja';
import { playSfx } from '../../foundations/audio/sfx';
import { commitHeartLoss, freshSeed, useSave, useStats } from '../hooks';
import { Player } from '../lesson/Player';
import { OutOfHearts, ResultCard, RewardRow } from '../lesson/common';
import { Mojibake } from '../../foundations/art/Mojibake';
import { fx } from '../../foundations/fx/fx';
import { tokens } from '../../foundations/theme/theme';

export function BossScreen() {
  const { bossId = '' } = useParams();
  const boss = bosses.find((b) => b.id === bossId);
  const save = useSave();
  const stats = useStats();
  const index = useGame((s) => s.index);
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  const scheduler = useGame((s) => s.scheduler)!;
  const { speak } = useJa();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'intro' | 'fight' | 'won' | 'lost'>('intro');
  const [bossFx, setBossFx] = useState<'idle' | 'hit' | 'attack'>('idle');
  const bossEl = useRef<HTMLDivElement>(null);
  const react = (st: 'hit' | 'attack') => {
    setBossFx(st);
    window.setTimeout(() => setBossFx('idle'), tokens.motion.slow);
  };
  const [bs, setBs] = useState<BossState | null>(boss ? startBoss(boss) : null);
  const bsRef = useRef(bs);
  const exam = useRef(false);
  const last = useRef<SessionState | null>(null);
  const rng = useMemo(() => new Rng(freshSeed()), []);

  const ref = boss?.checkpoint
    ? index.node(nodeKey(boss.checkpoint.packId, boss.checkpoint.nodeId))
    : undefined;
  const pools = useMemo(
    () => (boss && ref ? phasePools(boss, ref.node.exercises) : []),
    [boss, ref],
  );
  const build = (phaseIdx: number, n: number): Question[] => {
    const pool = pools[phaseIdx] ?? [];
    const out: Question[] = [];
    for (let i = 0; i < n && pool.length; i++) {
      const q = prepareExercise(rng.pick(pool), { index, rng, isAvailable: () => true });
      if (q) out.push({ ...q, exerciseId: `${q.exerciseId}#${phaseIdx}.${i}` });
    }
    return out;
  };
  const [questions, setQuestions] = useState<Question[]>([]);
  const [config] = useState<SessionConfig>(() => ({
    hearts: heartsNow(save, gctx()),
    economy,
    xpMultiplier: xpMultiplier(save, gctx()),
    requeueMistakes: false,
  }));

  if (!boss || !ref || !bs) return <div className="card">This boss has no battle yet.</div>;
  const key = ref.key;
  const ordered =
    index.paths.find((p) => p.pack.pack.id === ref.packId)?.nodes.map((n) => n.key) ?? [];
  const rules = economy.difficulty[save.settings.difficulty]!;
  const day = today(save, gctx());
  const record = save.bosses[boss.id];
  const allowed = canChallenge(record?.lastAttemptDay, day, rules.bossOncePerDay);

  const end = (state: SessionState, won: boolean) => {
    const summary = summarize({ ...state, status: won ? 'complete' : 'failed' }, config);
    const s0 = useGame.getState().save!;
    const c = gctx();
    const r = completeLesson(
      s0,
      c,
      {
        nodeKey: key,
        summary: { ...summary, stars: won ? summary.stars || 1 : 0 },
        heartsLost: 0, // committed answer by answer
        completed: won,
        introduces: [],
        totalQuestions: state.attempts.length,
      },
      scheduler,
    );
    let s = {
      ...r.save,
      bosses: {
        ...r.save.bosses,
        [boss.id]: {
          wins: (record?.wins ?? 0) + (won ? 1 : 0),
          lastAttemptDay: day,
          ...(won
            ? { defeatedAt: c.now }
            : record?.defeatedAt
              ? { defeatedAt: record.defeatedAt }
              : {}),
        },
      },
    };
    if (won) {
      const loot = [boss.loot.title, boss.loot.cosmetic].filter((x): x is string => !!x);
      s = {
        ...s,
        ledger: append(s.ledger, c.now, day, [
          { asset: 'koban', amount: economy.earn.bossDefeat, reason: 'boss', ref: boss.id },
          { asset: 'token', amount: economy.earn.bossDefeatTokens, reason: 'boss', ref: boss.id },
        ]),
        avatar: { ...s.avatar, owned: [...new Set([...s.avatar.owned, ...loot])] },
      };
    }
    commit(s);
    playSfx(won ? 'complete' : 'fail');
    // The boss bursts into plastic shards where it stood, then the sky fills with hanabi.
    if (won) {
      fx.slot('boss.defeat', bossEl.current);
      window.setTimeout(() => fx.slot('level.up'), 450);
    }
    fx.banner(
      won ? 'やった！' : '…',
      won ? 'gold' : 'red',
      won ? `${boss.en} defeated` : 'Retreat',
    );
    setPhase(won ? 'won' : 'lost');
  };

  if (!isUnlocked(save, ordered, key))
    return <div className="card">Finish the unit's lessons to face {boss.en}.</div>;
  if (phase === 'intro' && stats.hearts === 0)
    return <OutOfHearts onBack={() => navigate('/path')} />;

  const current = boss.phases[bs.phase]!;
  if (phase === 'intro')
    return (
      <div className="stack" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="card stack center boss-card">
          <p className="eyebrow">Checkpoint boss</p>
          <Mojibake size={180} />
          <SpeakableJa text={boss.name} className="display-ja" />
          <h1>{boss.en}</h1>
          <p className="muted">{boss.description}</p>
          <p className="small">
            {boss.hp} HP · {boss.phases.length} phases · each mistake costs a heart
            {rules.bossOncePerDay ? ' · one attempt per day' : ''}
          </p>
          {record?.defeatedAt && (
            <span className="pill pill-success" style={{ alignSelf: 'center' }}>
              Defeated before
            </span>
          )}
          {!allowed && (
            <p className="bad-text">
              You already fought today. Come back tomorrow, better prepared.
            </p>
          )}
          <button
            className="btn btn-accent btn-block"
            disabled={!allowed}
            onClick={() => {
              speak(boss.phases[0]!.taunt, { role: 'quiz' });
              setQuestions(build(0, 30));
              setPhase('fight');
            }}
          >
            Fight
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/path')}>
            Not yet
          </button>
        </div>
      </div>
    );

  if (phase === 'won' || phase === 'lost')
    return (
      <div className="stack" style={{ maxWidth: 560, margin: '0 auto' }}>
        <ResultCard
          title={phase === 'won' ? `${boss.en} defeated!` : `${boss.en} wins this time`}
          failed={phase === 'lost'}
        >
          {phase === 'won' ? (
            <>
              <RewardRow label="Koban" value={`+${economy.earn.bossDefeat}`} tone="gold" />
              <RewardRow
                label="Capsule token"
                value={`+${economy.earn.bossDefeatTokens}`}
                tone="gold"
              />
              {boss.loot.cosmetic && (
                <RewardRow label="Loot" value="new companion & title (Avatar)" tone="success" />
              )}
              <p className="small">The district wakes up. Check the Town.</p>
            </>
          ) : (
            <p className="small">
              {rules.bossOncePerDay
                ? 'Train in the Dojo and come back tomorrow.'
                : 'Train and try again.'}
            </p>
          )}
        </ResultCard>
        <button
          className="btn btn-accent"
          onClick={() => navigate(phase === 'won' ? '/town' : '/reviews')}
        >
          {phase === 'won' ? 'See the town' : 'To the Dojo'}
        </button>
      </div>
    );

  return (
    <Player
      hideGuide
      questions={questions}
      config={config}
      lanterns={0}
      onUseLantern={() => undefined}
      header={
        <div className="card card-tight row boss-hud" style={{ flexWrap: 'nowrap' }}>
          <div ref={bossEl}>
            <Mojibake size={96} state={bossFx} hp={bs.hp / bs.max} />
          </div>
          <div className="stack" style={{ flex: 1, gap: 'var(--sp-1)' }}>
            <div className="row spread">
              <strong>
                {boss.en} · {current.name}
              </strong>
              <span className="pill pill-accent">
                {bs.hp}/{bs.max} HP
              </span>
            </div>
            <div
              className="bar"
              role="progressbar"
              aria-label="Boss HP"
              aria-valuemin={0}
              aria-valuemax={bs.max}
              aria-valuenow={bs.hp}
            >
              <span style={{ width: `${(bs.hp / bs.max) * 100}%` }} />
            </div>
            <span className="small">
              <SpeakableJa text={current.taunt} />{' '}
              <span className="muted">“{current.tauntEn}”</span>
            </span>
          </div>
        </div>
      }
      onAnswered={(s, r) => {
        let next = s;
        const prev = bsRef.current!;
        if (r.correct) {
          const nb = hit(boss, prev, s.combo, economy.boss);
          bsRef.current = nb;
          setBs(nb);
          react('hit');
          fx.slot('boss.hit', bossEl.current);
          fx.text(`−${prev.hp - nb.hp}`, bossEl.current, 'dmg');
          if (nb.hp === 0) return { ...next, status: 'complete' };
          if (nb.phase !== prev.phase) {
            speak(boss.phases[nb.phase]!.taunt, { role: 'quiz' });
            // New phase, new exercise style: swap the rest of the queue.
            next = {
              ...next,
              queue: [...next.queue.slice(0, next.position), ...build(nb.phase, 30)],
            };
          }
        }
        if (!r.correct) {
          react('attack');
          fx.slot('boss.attack', bossEl.current);
        }
        if (
          !r.correct &&
          save.charms.equipped === 'goukaku' &&
          !exam.current &&
          next.hearts !== null
        ) {
          exam.current = true; // Exam charm: the first mistake costs no heart
          next = {
            ...next,
            hearts: next.hearts + 1,
            heartsLost: next.heartsLost - 1,
            status: 'playing',
          };
        }
        if (next.status === 'complete' && (bsRef.current?.hp ?? 1) > 0)
          next = { ...next, status: 'failed' };
        commitHeartLoss(last.current?.heartsLost ?? 0, next.heartsLost, key);
        last.current = next;
        return next;
      }}
      onQuit={() => {
        if (window.confirm('Retreat? This counts as your attempt.'))
          end(last.current ?? startSession([], config), false);
      }}
      onFinish={(s) => end(s, (bsRef.current?.hp ?? 1) === 0)}
    />
  );
}
