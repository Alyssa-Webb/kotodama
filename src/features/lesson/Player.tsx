/**
 * The exercise player shared by lessons, Dojo reviews, boss fights and rush modes: progress bar,
 * hearts, Kiai meter, instant feedback and the shape components.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { grade } from '../../engine/exercises/grade';
import type { Answer, GradeResult, Question } from '../../engine/exercises/types';
import {
  answer,
  currentQuestion,
  kiaiActive,
  progress,
  startSession,
  type SessionConfig,
  type SessionState,
} from '../../engine/lesson/session';
import { JaText, SpeakableJa, useJa, RichText } from '../../foundations/japanese/Ja';
import { playSfx } from '../../foundations/audio/sfx';
import { Slot } from '../../foundations/slots/Slot';
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
}

export function Player({
  questions,
  config,
  onFinish,
  onQuit,
  lanterns,
  onUseLantern,
  header,
  onAnswered,
}: PlayerProps) {
  const { speak } = useJa();
  const [state, setState] = useState(() => startSession(questions, config));
  const [feedback, setFeedback] = useState<{
    result: GradeResult;
    picked: string | null;
    question: Question;
    auto: boolean;
  } | null>(null);
  const [hints, setHints] = useState(0);
  const [showAudioText, setShowAudioText] = useState(false);
  const [fx, setFx] = useState(0);
  const started = useRef(0);
  const submitRef = useRef<(() => void) | null>(null);
  // While feedback shows, keep rendering the question just answered (the session may already be over).
  const q = feedback ? feedback.question : currentQuestion(state);

  // A new question starts when the position advances and no feedback is showing (retries reuse objects).
  const questionKey = feedback ? -1 : state.position;
  useEffect(() => {
    if (questionKey < 0) return;
    started.current = performance.now();
    setHints(0);
    setShowAudioText(false);
    const audio = currentQuestion(state)?.prompt.audio;
    if (audio) speak(audio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionKey, speak]);

  const submit = useCallback(
    (a: Answer) => {
      if (!q || feedback) return;
      const result = grade(q, a);
      const ms = performance.now() - started.current;
      let next = answer(state, config, result, ms, hints + (showAudioText ? 1 : 0));
      const override = onAnswered?.(next, result);
      if (override) next = override;
      playSfx(result.correct ? 'correct' : 'wrong');
      if (result.correct && !kiaiActive(state) && kiaiActive(next)) playSfx('kiai');
      if ('ja' in q.solution && q.shape !== 'match' && q.shape !== 'dialogue') speak(q.solution.ja);
      setFx((n) => (result.correct ? Math.abs(n) + 1 : -(Math.abs(n) + 1)));
      const auto = (q.shape === 'match' || q.shape === 'dialogue') && result.correct;
      setFeedback({ result, picked: a.kind === 'choose' ? a.optionId : null, question: q, auto });
      setState(next);
      // Match and dialogue already gave feedback inline; move straight on when correct.
      if ((q.shape === 'match' || q.shape === 'dialogue') && result.correct) {
        window.setTimeout(() => {
          setFeedback(null);
          if (next.status !== 'playing') onFinish(next);
        }, 650);
      }
    },
    [q, feedback, state, config, hints, showAudioText, onAnswered, speak, onFinish],
  );

  const next = useCallback(() => {
    setFeedback(null);
    if (state.status !== 'playing') onFinish(state);
  }, [state, onFinish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && feedback) {
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

  if (!q) return null;
  const kiai = kiaiActive(state);
  const charge = kiai ? 1 : state.kiaiCharge / config.economy.kiai.fillAt;
  const canCheck = q.shape === 'tiles' || q.shape === 'type';

  return (
    <div className={`player ${kiai ? 'kiai' : ''}`}>
      <div className="player-top">
        <button className="btn btn-ghost icon-btn" onClick={onQuit} aria-label="Quit">
          ✕
        </button>
        <div
          className="bar"
          style={{ flex: 1 }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress(state) * 100)}
          aria-label="Lesson progress"
        >
          <span style={{ width: `${progress(state) * 100}%` }} />
        </div>
        {state.hearts !== null && (
          <span className="stat stat-hearts" aria-label={`${state.hearts} hearts left`}>
            <span aria-hidden="true">♥</span> {state.hearts}
          </span>
        )}
      </div>
      <div
        className="kiai-row"
        aria-label={
          kiai ? 'Kiai active: double rewards' : `Kiai meter ${Math.round(charge * 100)}%`
        }
      >
        <div className="bar bar-gold kiai-bar">
          <span style={{ width: `${charge * 100}%` }} />
        </div>
        <span className={`kiai-label ${kiai ? 'on' : ''}`} lang="ja">
          {kiai ? '気合！×2' : '気合'}
        </span>
        {state.combo >= 2 && <span className="pill pill-accent">{state.combo} combo</span>}
      </div>
      {header}

      <Slot
        slot={fx > 0 ? 'answer.correct' : 'answer.incorrect'}
        fire={fx || undefined}
        className="card question"
      >
        <p className="eyebrow">{q.prompt.instruction}</p>
        {q.prompt.scene && <p className="scene">{q.prompt.scene}</p>}
        {q.prompt.audio && !q.prompt.ja && (
          <div className="row" style={{ justifyContent: 'center' }}>
            <button
              className="btn btn-indigo audio-btn"
              onClick={() => speak(q.prompt.audio!)}
              aria-label="Play audio"
            >
              ▶︎ Play
            </button>
            <button
              className="btn btn-ghost btn-small"
              onClick={() => speak(q.prompt.audio!, { slow: true })}
              aria-label="Play slowly"
            >
              Slow
            </button>
          </div>
        )}
        {q.prompt.audio && !q.prompt.ja && q.shape !== 'trace' && (
          <div className="center">
            {showAudioText ? (
              <span className="big-ja">
                <JaText text={q.prompt.audio} />
              </span>
            ) : (
              <button className="btn btn-ghost btn-small" onClick={() => setShowAudioText(true)}>
                Can't listen now? Show text
              </button>
            )}
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
      </Slot>

      {feedback?.auto ? null : feedback ? (
        <div className={`feedback ${feedback.result.correct ? 'good' : 'bad'}`} role="alert">
          <div className="stack" style={{ gap: 'var(--sp-1)', flex: 1, minWidth: 0 }}>
            <strong>
              {feedback.result.correct
                ? feedback.result.typo
                  ? 'Close enough: watch the spelling'
                  : pickPraise(state.combo)
                : 'Not quite'}
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
          <button
            className="btn btn-ghost btn-small"
            disabled={
              lanterns <= 0 || q.shape === 'match' || q.shape === 'dialogue' || q.shape === 'trace'
            }
            onClick={() => {
              onUseLantern();
              setHints((h) => h + 1);
            }}
            title="Chōchin lantern: a hint (counts as a hard recall)"
          >
            <span lang="ja" aria-hidden="true">
              提灯
            </span>{' '}
            Hint ({lanterns})
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

const PRAISE = ['Nice!', 'Correct!', 'Great!', 'Sharp!', 'Excellent!'];
function pickPraise(combo: number) {
  return PRAISE[combo % PRAISE.length]!;
}
