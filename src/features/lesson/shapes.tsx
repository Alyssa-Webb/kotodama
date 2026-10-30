/**
 * One component per question shape (see docs/adr/0003-exercise-shapes.md). Each renders a
 * Question and reports an Answer; grading happens in the engine.
 */
import { useEffect, useMemo, useRef, useState, type CompositionEvent, type FormEvent } from 'react';
import { toKana } from 'wanakana';
import type { Answer, Display, Question } from '../../engine/exercises/types';
import { toSurface } from '../../engine/text/furigana';
import { JaText, SpeakableJa, useJa } from '../../foundations/japanese/Ja';
import { playSfx } from '../../foundations/audio/sfx';

type Q<S extends Question['shape']> = Extract<Question, { shape: S }>;

export interface ShapeProps<S extends Question['shape']> {
  q: Q<S>;
  locked: boolean;
  onAnswer: (a: Answer) => void;
  /** Hint request from the lantern button; bumps the hint counter in the player. */
  hintSignal: number;
}

export function DisplayText({ d, speak = false }: { d: Display; speak?: boolean }) {
  if ('en' in d) return <span>{d.en}</span>;
  const level = d.hideFurigana ? 'kanji' : undefined;
  return speak ? (
    <SpeakableJa text={d.ja} {...(level ? { level } : {})} />
  ) : (
    <JaText text={d.ja} {...(level ? { level } : {})} />
  );
}

// ------------------------------------------------------------------ choose

export function ChooseShape({
  q,
  locked,
  onAnswer,
  hintSignal,
  picked,
}: ShapeProps<'choose'> & { picked: string | null }) {
  const { speak } = useJa();
  const [hidden, setHidden] = useState<string[]>([]);
  useEffect(() => {
    if (!hintSignal) return;
    // Lantern: remove one wrong option.
    setHidden((h) => {
      const wrong = q.options.find((o) => o.id !== q.correctId && !h.includes(o.id));
      return wrong ? [...h, wrong.id] : h;
    });
  }, [hintSignal, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (locked) return;
      const n = Number(e.key);
      const opt = q.options.filter((o) => !hidden.includes(o.id))[n - 1];
      if (opt) onAnswer({ kind: 'choose', optionId: opt.id });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, locked, hidden, onAnswer]);

  const visible = q.options.filter((o) => !hidden.includes(o.id));
  return (
    <div className="options" role="group" aria-label="Answers">
      {visible.map((o, i) => {
        const state = locked
          ? o.id === q.correctId
            ? 'right'
            : o.id === picked
              ? 'wrong'
              : ''
          : '';
        return (
          <button
            key={o.id}
            className={`option ${state}`}
            disabled={locked}
            onClick={() => {
              if ('ja' in o.display) speak(o.display.ja);
              onAnswer({ kind: 'choose', optionId: o.id });
            }}
          >
            <span className="option-key" aria-hidden="true">
              {i + 1}
            </span>
            <span className={'ja' in o.display ? 'option-ja' : ''}>
              <DisplayText d={o.display} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ------------------------------------------------------------------ match

export function MatchShape({ q, locked, onAnswer }: ShapeProps<'match'>) {
  const { speak } = useJa();
  const [left, setLeft] = useState<string | null>(null);
  const [right, setRight] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [bad, setBad] = useState<string[]>([]);
  const wrong = useRef(0);

  useEffect(() => {
    if (!left || !right) return;
    if (q.pairs[left] === right) {
      const next = [...done, left, right];
      setDone(next);
      playSfx('tap');
      if (next.length === q.left.length * 2)
        onAnswer({ kind: 'match', wrongAttempts: wrong.current });
    } else {
      wrong.current++;
      setBad([left, right]);
      playSfx('wrong');
      window.setTimeout(() => setBad([]), 450);
    }
    setLeft(null);
    setRight(null);
  }, [left, right, q, done, onAnswer]);

  const cls = (id: string, sel: string | null) =>
    `option match ${done.includes(id) ? 'matched' : ''} ${sel === id ? 'selected' : ''} ${bad.includes(id) ? 'wrong shake' : ''}`;
  return (
    <div className="match-grid">
      <div className="options">
        {q.left.map((o) => (
          <button
            key={o.id}
            className={cls(o.id, left)}
            disabled={locked || done.includes(o.id)}
            onClick={() => {
              if ('ja' in o.display) speak(o.display.ja);
              setLeft(o.id);
            }}
          >
            <span className="option-ja">
              <DisplayText d={o.display} />
            </span>
          </button>
        ))}
      </div>
      <div className="options">
        {q.right.map((o) => (
          <button
            key={o.id}
            className={cls(o.id, right)}
            disabled={locked || done.includes(o.id)}
            onClick={() => setRight(o.id)}
          >
            <DisplayText d={o.display} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ tiles

export function TilesShape({
  q,
  locked,
  onAnswer,
  hintSignal,
  submitRef,
}: ShapeProps<'tiles'> & { submitRef: { current: (() => void) | null } }) {
  const { speak } = useJa();
  const [chosen, setChosen] = useState<string[]>([]);
  const solution = 'ja' in q.solution ? toSurface(q.solution.ja) : '';
  useEffect(() => {
    if (!hintSignal) return;
    // Lantern: place the next correct tile.
    setChosen((c) => {
      const built = c.map((id) => toSurface(q.tiles.find((t) => t.id === id)!.text)).join('');
      const next = q.tiles.find(
        (t) => !c.includes(t.id) && solution.startsWith(built + toSurface(t.text)),
      );
      return next ? [...c, next.id] : c;
    });
  }, [hintSignal, q, solution]);
  useEffect(() => {
    submitRef.current = chosen.length ? () => onAnswer({ kind: 'tiles', tileIds: chosen }) : null;
  });
  const tile = (id: string) => q.tiles.find((t) => t.id === id)!;
  return (
    <div className="stack">
      <div className="tile-line" aria-label="Your sentence">
        {chosen.map((id) => (
          <button
            key={id}
            className="tile"
            disabled={locked}
            onClick={() => setChosen((c) => c.filter((x) => x !== id))}
          >
            <JaText text={tile(id).text} />
          </button>
        ))}
        {q.suffix && (
          <span lang="ja" className="tile-suffix">
            {q.suffix}
          </span>
        )}
      </div>
      <div className="tile-pool" aria-label="Tiles">
        {q.tiles.map((t) => (
          <button
            key={t.id}
            className={`tile ${chosen.includes(t.id) ? 'used' : ''}`}
            disabled={locked || chosen.includes(t.id)}
            onClick={() => {
              speak(t.text);
              setChosen((c) => [...c, t.id]);
            }}
          >
            <JaText text={t.text} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ type

export function TypeShape({
  q,
  locked,
  onAnswer,
  hintSignal,
  submitRef,
}: ShapeProps<'type'> & { submitRef: { current: (() => void) | null } }) {
  const [value, setValue] = useState('');
  const composing = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const solution = 'ja' in q.solution ? toSurface(q.solution.ja) : q.solution.en;
  useEffect(() => input.current?.focus(), []);
  useEffect(() => {
    if (!hintSignal) return;
    // Lantern: reveal the next character of the preferred answer.
    setValue((v) =>
      solution.slice(0, Math.min(solution.length, Math.max(0, commonPrefix(v, solution)) + 1)),
    );
  }, [hintSignal, solution]);
  useEffect(() => {
    submitRef.current = value.trim() ? () => onAnswer({ kind: 'type', text: value }) : null;
  });

  const convert = (v: string) =>
    q.answerLang === 'ja' && !composing.current ? toKana(v, { IMEMode: true }) : v;
  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        if (!locked && value.trim()) onAnswer({ kind: 'type', text: value });
      }}
    >
      <label className="sr-only" htmlFor="answer">
        Your answer
      </label>
      <input
        id="answer"
        ref={input}
        className="answer-input"
        lang={q.answerLang === 'ja' ? 'ja' : 'en'}
        value={value}
        disabled={locked}
        placeholder={q.answerLang === 'ja' ? 'Type in romaji or kana' : 'Type in English'}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        onCompositionStart={() => (composing.current = true)}
        onCompositionEnd={(e: CompositionEvent<HTMLInputElement>) => {
          composing.current = false;
          setValue(e.currentTarget.value);
        }}
        onChange={(e) => setValue(convert(e.target.value))}
      />
    </form>
  );
}

const commonPrefix = (a: string, b: string) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
};

// ------------------------------------------------------------------ trace

export function TraceShape({ q, locked, onAnswer }: ShapeProps<'trace'>) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState(0);
  const [reveal, setReveal] = useState(false);
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const r = c.getBoundingClientRect();
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    const g = c.getContext('2d')!;
    g.scale(dpr, dpr);
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.lineWidth = Math.max(8, r.width / 28);
    g.strokeStyle = getComputedStyle(c).color;
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };
  return (
    <div className="stack center">
      <div className="trace-box">
        <span lang="ja" className="trace-guide" aria-hidden="true">
          {q.glyph}
        </span>
        <canvas
          ref={canvas}
          className="trace-canvas"
          aria-label={`Drawing area: write ${q.glyph}`}
          onPointerDown={(e) => {
            if (locked) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            drawing.current = true;
            const g = e.currentTarget.getContext('2d')!;
            const [x, y] = pos(e);
            g.beginPath();
            g.moveTo(x, y);
            g.lineTo(x + 0.1, y + 0.1);
            g.stroke();
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const g = e.currentTarget.getContext('2d')!;
            const [x, y] = pos(e);
            g.lineTo(x, y);
            g.stroke();
          }}
          onPointerUp={() => {
            if (drawing.current) setStrokes((s) => s + 1);
            drawing.current = false;
          }}
        />
      </div>
      {!reveal ? (
        <div className="row" style={{ justifyContent: 'center' }}>
          <button
            className="btn btn-small"
            onClick={() => {
              const c = canvas.current!;
              c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
              setStrokes(0);
            }}
          >
            Clear
          </button>
          <button
            className="btn btn-small btn-indigo"
            disabled={locked}
            onClick={() => setReveal(true)}
          >
            {strokes ? 'Compare' : 'I wrote it on paper'}
          </button>
        </div>
      ) : (
        <div className="stack">
          <p className="muted small">
            Compare with the model. Be honest: it only helps your memory.
          </p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button
              className="btn btn-small"
              disabled={locked}
              onClick={() => onAnswer({ kind: 'trace', selfCorrect: false })}
            >
              Not quite
            </button>
            <button
              className="btn btn-small btn-accent"
              disabled={locked}
              onClick={() => onAnswer({ kind: 'trace', selfCorrect: true })}
            >
              I got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ dialogue

export function DialogueShape({ q, locked, onAnswer }: ShapeProps<'dialogue'>) {
  const { speak } = useJa();
  const [shown, setShown] = useState(1);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const step = q.steps[shown - 1];
  const awaitingChoice = !!step?.choices && !feedback?.ok;
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = q.steps[shown - 1];
    if (s && !s.choices) speak(s.text, { role: s.speaker });
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [shown, q, speak]);

  const visible = useMemo(() => q.steps.slice(0, shown), [q, shown]);
  const advance = () => {
    setFeedback(null);
    if (shown >= q.steps.length) onAnswer({ kind: 'dialogue', wrongChoices: wrong });
    else setShown((n) => n + 1);
  };

  return (
    <div className="stack">
      <p className="muted small">{q.setting}</p>
      <div className="dialogue">
        {visible.map((s, i) => {
          const pending = i === shown - 1 && s.choices && !feedback?.ok;
          if (pending) return null;
          return (
            <div key={i} className={`bubble ${s.speaker === 'player' ? 'me' : ''}`}>
              <span className="eyebrow">{s.speaker === 'player' ? 'You' : s.speaker}</span>
              <SpeakableJa text={s.text} role={s.speaker} className="bubble-ja" />
              <span className="muted small">{s.en}</span>
            </div>
          );
        })}
        <div ref={end} />
      </div>
      {awaitingChoice && step?.choices && (
        <div className="options" role="group" aria-label="Your reply">
          {step.choices.map((c) => (
            <button
              key={c.id}
              className="option"
              disabled={locked}
              onClick={() => {
                speak(c.text, { role: 'player' });
                if (c.correct) {
                  playSfx('correct');
                  setFeedback({ text: c.feedback, ok: true });
                } else {
                  playSfx('wrong');
                  setWrong((w) => w + 1);
                  setFeedback({ text: c.feedback, ok: false });
                }
              }}
            >
              <span className="option-ja">
                <JaText text={c.text} />
              </span>
            </button>
          ))}
        </div>
      )}
      {feedback && <p className={feedback.ok ? 'ok-text' : 'bad-text'}>{feedback.text}</p>}
      {(!step?.choices || feedback?.ok) && (
        <button className="btn btn-indigo btn-block" disabled={locked} onClick={advance} autoFocus>
          {shown >= q.steps.length ? 'Finish' : 'Next'}
        </button>
      )}
    </div>
  );
}
