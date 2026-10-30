/**
 * The exercise player shared by lessons, Dojo reviews, boss fights and rush modes: HUD (progress,
 * hearts, Kiai meter, combo), the guide who reacts to every answer, game FX and the shape components.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { grade } from '../../engine/exercises/grade';
import { maxHearts as engineMaxHp } from '../../engine/game';
import { economy } from '../../foundations/world';
import type { Answer, GradeResult, Question } from '../../engine/exercises/types';
import {
  answer,
  currentQuestion,
  kiaiActive,
  progress,
  skip,
  startSession,
  type SessionConfig,
  type SessionState,
} from '../../engine/lesson/session';
import { SpeakableJa, useJa, RichText } from '../../foundations/japanese/Ja';
import { playSfx } from '../../foundations/audio/sfx';
import { fx } from '../../foundations/fx/fx';
import { Guide, type Mood } from '../../foundations/art/Guide';
import { AvatarActor } from '../avatar/AvatarActor';
import { BattleStage } from './BattleStage';
import { FlameIcon, HeartIcon, LanternIcon } from '../../foundations/art/icons';
import { useGame } from '../../foundations/store/gameStore';
import { tokens } from '../../foundations/theme/theme';
import {
  ChooseShape,
  DialogueShape,
  DisplayText,
  MatchShape,
  TilesShape,
  TraceShape,
  TypeShape,
} from './shapes';
import './lesson.css';

export interface PlayerProps {
  questions: Question[];
  config: SessionConfig;
  onFinish: (state: SessionState) => void;
  onQuit: () => void;
  /** Lantern hints available (consumes one per use). */
  lanterns: number;
  onUseLantern: () => void;
  /** Extra header content (boss HP, rush timer). */
  header?: ReactNode;
  /** Called after each answer (boss damage, rush scoring). Return a new state to override. */
  onAnswered?: (s: SessionState, r: GradeResult) => SessionState | undefined;
  /** Hides the guide portrait (boss fights show the boss instead). */
  hideGuide?: boolean;
  /** Boss fights: the avatar lunges at the boss on a correct answer instead of hopping. */
  fighter?: boolean;
  /** Show the battle road (lessons and Dojo reviews; off for bosses and rushes). */
  battle?: boolean;
}

const PRAISE = ['Nice!', 'Correct!', 'Great!', 'Sharp!', 'Excellent!'];
const CHEER = [
  'That one is tricky.',
  'Shake it off.',
  'You will get it next time.',
  'Remember this one.',
];

export function Player({
  questions,
  config,
  onFinish,
  onQuit,
  lanterns,
  onUseLantern,
  header,
  onAnswered,
  hideGuide,
  fighter,
  battle = !hideGuide && !header,
}: PlayerProps) {
  const { speak } = useJa();
  const voiceMode = useGame((s) => s.save?.settings.voiceMode ?? 'alternate-lesson');
  const lessonCount = useGame((s) => s.save?.lessonCount ?? 0);
  // The bar shows HP against your true max (it doesn't refill between lessons).
  const hpMax = useGame((st) => (st.save ? engineMaxHp(st.save, economy) : null));
  const [state, setState] = useState(() => startSession(questions, config));
  const [feedback, setFeedback] = useState<{
    result: GradeResult;
    picked: string | null;
    question: Question;
    auto: boolean;
  } | null>(null);
  const [hints, setHints] = useState(0);
  const [mood, setMood] = useState<Mood>('idle');
  const started = useRef(0);
  const submitRef = useRef<(() => void) | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const heartsEl = useRef<HTMLDivElement>(null);
  // While feedback shows, keep rendering the question just answered (the session may already be over).
  const q = feedback ? feedback.question : currentQuestion(state);

  const guide: 'akari' | 'tetsu' =
    voiceMode === 'akari'
      ? 'akari'
      : voiceMode === 'tetsu' || voiceMode === 'duet'
        ? 'tetsu'
        : voiceMode === 'alternate-line'
          ? state.position % 2
            ? 'tetsu'
            : 'akari'
          : lessonCount % 2
            ? 'tetsu'
            : 'akari';

  // A new question starts when the position advances and no feedback is showing (retries reuse objects).
  const questionKey = feedback ? -1 : state.position;
  useEffect(() => {
    if (questionKey < 0) return;
    started.current = performance.now();
    setHints(0);
    setMood('idle');
    const audio = currentQuestion(state)?.prompt.audio;
    if (audio) speak(audio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionKey, speak]);

  const submit = useCallback(
    (a: Answer) => {
      if (!q || feedback) return;
      const result = grade(q, a);
      const ms = performance.now() - started.current;
      let next = answer(state, config, result, ms, hints);
      const override = onAnswered?.(next, result);
      if (override) next = override;
      const kiaiStarted = result.correct && !kiaiActive(state) && kiaiActive(next);
      if (result.correct) {
        playSfx('correct');
        fx.slot('answer.correct', card.current);
        const gained = next.xp - state.xp;
        if (gained > 0) fx.text(`+${gained} XP`, card.current, 'xp');
        if (next.combo > 0 && next.combo % config.economy.xp.comboBonusEvery === 0)
          fx.slot('combo.up', card.current);
        setMood(kiaiStarted ? 'cheer' : 'happy');
      } else {
        playSfx('wrong');
        fx.slot('answer.incorrect', card.current);
        if (next.hearts !== null && next.hearts < (state.hearts ?? 0)) {
          fx.slot('heart.lost', heartsEl.current);
          fx.text('−1', heartsEl.current, 'bad');
        }
        setMood('worried');
      }
      if (kiaiStarted) {
        playSfx('kiai');
        fx.slot('kiai.start', card.current);
        fx.banner('FOCUS!', 'gold', '気合 (kiai) · double XP');
      } else if ('ja' in q.solution && q.shape !== 'match' && q.shape !== 'dialogue')
        speak(q.solution.ja);
      const auto = (q.shape === 'match' || q.shape === 'dialogue') && result.correct;
      setFeedback({ result, picked: a.kind === 'choose' ? a.optionId : null, question: q, auto });
      setState(next);
      // Match and dialogue already gave feedback inline; move straight on when correct.
      if (auto) {
        window.setTimeout(() => {
          setFeedback(null);
          if (next.status !== 'playing') onFinish(next);
        }, tokens.motion.slow * 1.5);
      }
    },
    [q, feedback, state, config, hints, onAnswered, speak, onFinish],
  );

  const skipQuestion = useCallback(() => {
    if (feedback) return;
    const s = skip(state);
    setState(s);
    if (s.status !== 'playing') onFinish(s);
  }, [feedback, state, onFinish]);

  const next = useCallback(() => {
    setFeedback(null);
    if (state.status !== 'playing') onFinish(state);
  }, [state, onFinish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && feedback && !feedback.auto) {
        e.preventDefault();
        next();
      } else if (
        e.key === ' ' &&
        q?.prompt.audio &&
        (e.target as HTMLElement).tagName !== 'INPUT'
      ) {
        e.preventDefault();
        speak(q.prompt.audio);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [feedback, next, q, speak]);

  if (!q)
    return (
      <div className="card stack center">
        <p>No questions could be built for this session.</p>
        <button className="btn btn-accent" onClick={() => onQuit()}>
          Back
        </button>
      </div>
    );
  const kiai = kiaiActive(state);
  const charge = kiai ? 1 : state.kiaiCharge / config.economy.kiai.fillAt;
  const canCheck = q.shape === 'tiles' || q.shape === 'type';
  const maxHearts = config.hearts;

  return (
    <div className={`player ${kiai ? 'kiai' : ''}`}>
      <div className="player-top">
        <button className="btn btn-ghost icon-btn quit" onClick={onQuit} aria-label="Quit">
          ✕
        </button>
        <div
          className="bar progress"
          style={{ flex: 1 }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress(state) * 100)}
          aria-label="Lesson progress"
        >
          <span style={{ width: `${Math.max(4, progress(state) * 100)}%` }} />
        </div>
        {state.hearts !== null && (
          <div
            className="hearts"
            ref={heartsEl}
            aria-label={`${state.hearts} hearts left`}
            role="img"
          >
            {maxHearts !== null && maxHearts <= 6 ? (
              Array.from({ length: maxHearts }, (_, i) => (
                <span key={i} className={`heart ${i < state.hearts! ? '' : 'lost'}`}>
                  <HeartIcon size={22} empty={i >= state.hearts!} />
                </span>
              ))
            ) : (
              <span
                className={`hp-bar${
                  (hpMax ? state.hearts! / hpMax : 1) < 0.25 ? ' hp-low' : ''
                }${
                  state.hearts! < (config.hearts ?? state.hearts!) &&
                  (!feedback || !feedback.result.correct)
                    ? ` hp-drop ${state.hearts! % 2 ? 'hp-odd' : 'hp-even'}`
                    : state.hearts! > (config.hearts ?? state.hearts!) - state.heartsLost
                      ? ' hp-heal'
                      : ''
                }`}
                title={`${state.hearts} / ${hpMax ?? state.hearts} HP`}
              >
                <HeartIcon size={18} />
                <span key={`crack-${state.hearts}`} className="hp-heart-crack" aria-hidden="true">
                  <svg viewBox="0 0 18 18" width="18" height="18">
                    <path
                      d="M9.5 2.2 L7.1 7.2 L10.7 9.2 L6.7 15.4"
                      fill="none"
                      stroke="var(--c-hud-bg)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.5 2.2 L7.1 7.2 L10.7 9.2 L6.7 15.4"
                      fill="none"
                      stroke="var(--c-coin-shine)"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="hp-track">
                  <span
                    className="hp-chip"
                    style={{ transform: `scaleX(${hpMax ? state.hearts! / hpMax : 1})` }}
                    aria-hidden="true"
                  />
                  <span
                    className="hp-fill"
                    style={{ transform: `scaleX(${hpMax ? state.hearts! / hpMax : 1})` }}
                  />
                  <span key={`fx-${state.hearts}`} className="hp-track-fx" aria-hidden="true">
                    <span className="hp-flash" />
                    <span className="hp-shimmer" />
                  </span>
                </span>
                <span key={`sp-${state.hearts}`} className="hp-sparkles" aria-hidden="true">
                  <span className="hp-sparkle hp-s1" />
                  <span className="hp-sparkle hp-s2" />
                  <span className="hp-sparkle hp-s3" />
                </span>
                <b>{state.hearts}</b>
              </span>
            )}
          </div>
        )}
      </div>
      <div
        className="kiai-row"
        aria-label={
          kiai ? 'Kiai active: double rewards' : `Kiai meter ${Math.round(charge * 100)}%`
        }
      >
        <FlameIcon size={22} lit={kiai || charge > 0} />
        <div className="bar bar-gold kiai-bar">
          <span style={{ width: `${charge * 100}%` }} />
        </div>
        <span className={`kiai-label ${kiai ? 'on' : ''}`} lang="ja">
          {kiai ? 'Focus ×2 XP' : 'Focus'}
        </span>
        {state.combo >= 2 && (
          <span key={state.combo} className="combo-chip">
            {state.combo}
            <small>combo</small>
          </span>
        )}
      </div>
      {header}
      {battle && <BattleStage state={state} />}

      <div className="stage">
        {!hideGuide && (
          <div className="guide-col">
            <Guide who={guide} mood={mood} size={88} />
          </div>
        )}
        <div
          ref={card}
          key={state.position}
          className={`card question ${feedback ? (feedback.result.correct ? 'is-right' : 'is-wrong') : ''}`}
        >
          <span className="corner tl" aria-hidden="true" />
          <span className="corner br" aria-hidden="true" />
          <p className="eyebrow">{q.prompt.instruction}</p>
          {q.prompt.scene && <p className="scene-text">{q.prompt.scene}</p>}
          {q.prompt.audio && !q.prompt.ja && (
            <div className="row" style={{ justifyContent: 'center' }}>
              <button
                className="btn btn-indigo audio-btn"
                onClick={() => speak(q.prompt.audio!)}
                aria-label="Play audio"
              >
                <span className="audio-waves" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                Play
              </button>
              <button
                className="btn btn-small"
                onClick={() => speak(q.prompt.audio!, { slow: true })}
                aria-label="Play slowly"
              >
                Slow
              </button>
            </div>
          )}
          {/* Showing the text would give a listening answer away, so this skips the question
              instead (ungraded; rush and boss rounds can't skip). */}
          {q.prompt.audio && !q.prompt.ja && q.shape !== 'trace' && !hideGuide && !header && (
            <div className="center">
              <button
                className="btn btn-ghost btn-small"
                onClick={skipQuestion}
                disabled={!!feedback}
              >
                Can't listen now? Skip
              </button>
            </div>
          )}
          {q.prompt.ja && (
            <div className="prompt-ja">
              <SpeakableJa
                text={q.prompt.ja}
                {...(q.prompt.hideFurigana ? { level: 'kanji' as const } : {})}
                className="display-ja"
              />
            </div>
          )}
          {q.prompt.en && <p className="prompt-en">{q.prompt.en}</p>}

          <div className="answer-area">
            {q.shape === 'choose' && (
              <ChooseShape
                q={q}
                locked={!!feedback}
                onAnswer={submit}
                hintSignal={hints}
                picked={feedback?.picked ?? null}
              />
            )}
            {q.shape === 'match' && (
              <MatchShape
                key={q.exerciseId + state.position}
                q={q}
                locked={!!feedback}
                onAnswer={submit}
                hintSignal={hints}
              />
            )}
            {q.shape === 'tiles' && (
              <TilesShape
                key={q.exerciseId + state.position}
                q={q}
                locked={!!feedback}
                onAnswer={submit}
                hintSignal={hints}
                submitRef={submitRef}
              />
            )}
            {q.shape === 'type' && (
              <TypeShape
                key={q.exerciseId + state.position}
                q={q}
                locked={!!feedback}
                onAnswer={submit}
                hintSignal={hints}
                submitRef={submitRef}
              />
            )}
            {q.shape === 'trace' && (
              <TraceShape
                key={q.exerciseId + state.position}
                q={q}
                locked={!!feedback}
                onAnswer={submit}
                hintSignal={hints}
              />
            )}
            {q.shape === 'dialogue' && (
              <DialogueShape
                key={q.exerciseId + state.position}
                q={q}
                locked={!!feedback}
                onAnswer={submit}
                hintSignal={hints}
              />
            )}
          </div>
        </div>
      </div>

      {feedback?.auto ? null : feedback ? (
        <div className={`feedback ${feedback.result.correct ? 'good' : 'bad'}`} role="alert">
          <span className="feedback-guide" aria-hidden="true">
            <AvatarActor
              mood={feedback.result.correct ? (fighter ? 'strike' : 'happy') : 'worried'}
              size={52}
            />
          </span>
          <div className="stack" style={{ gap: 'var(--sp-1)', flex: 1, minWidth: 0 }}>
            <strong className="feedback-title">
              {feedback.result.correct
                ? feedback.result.typo
                  ? 'Close enough: watch the spelling'
                  : PRAISE[state.combo % PRAISE.length]
                : CHEER[state.position % CHEER.length]}
            </strong>
            {(!feedback.result.correct || feedback.result.typo) && (
              <span>
                Answer: <DisplayText d={q.solution} speak />
              </span>
            )}
            {q.note && (
              <span className="small">
                <RichText text={q.note} />
              </span>
            )}
          </div>
          <button
            className={`btn ${feedback.result.correct ? 'btn-accent' : 'btn-indigo'}`}
            onClick={next}
            autoFocus
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="player-actions">
          <span className="player-avatar" aria-hidden="true">
            <AvatarActor mood={kiai ? 'cheer' : 'idle'} size={46} />
          </span>
          <button
            className="btn btn-small hint-btn"
            disabled={
              lanterns <= 0 || q.shape === 'match' || q.shape === 'dialogue' || q.shape === 'trace'
            }
            onClick={() => {
              onUseLantern();
              setHints((h) => h + 1);
              fx.burst('embers', card.current, 12);
            }}
            title="Chōchin lantern: a hint (counts as a hard recall)"
          >
            <LanternIcon size={20} />
            <span>Hint ({lanterns})</span>
          </button>
          {canCheck && (
            <button
              className="btn btn-accent"
              style={{ flex: 1 }}
              onClick={() => submitRef.current?.()}
            >
              Check
            </button>
          )}
        </div>
      )}
    </div>
  );
}
