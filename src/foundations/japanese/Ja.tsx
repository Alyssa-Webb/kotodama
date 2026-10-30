/**
 * Renders Japanese text with furigana at the player's script level, always with lang="ja",
 * and makes it speakable. Script levels: romaji (kana + romaji above), kana, furigana, kanji.
 */
import { createContext, useContext, type ReactNode } from 'react';
import type { ScriptLevel } from '../../schema/save';
import { parseFurigana, toReading } from '../../engine/text/furigana';
import { hiraganaToKatakana, kanaToRomaji } from '../../engine/text/kana';

export interface JaSettings {
  scriptLevel: ScriptLevel;
  /** 'katakana' shows katakana wherever hiragana would appear (furigana included). */
  kana?: 'hiragana' | 'katakana';
  speak: (text: string, opts?: { role?: string; slow?: boolean }) => void;
}

export const JaContext = createContext<JaSettings>({
  scriptLevel: 'furigana',
  speak: () => undefined,
});
export const useJa = () => useContext(JaContext);

interface JaProps {
  text: string;
  /** Force a level (e.g. hide furigana on reading questions). */
  level?: ScriptLevel;
  className?: string;
}

export function JaText({ text, level, className }: JaProps) {
  const ctx = useJa();
  const lv = level ?? ctx.scriptLevel;
  const k = ctx.kana === 'katakana' ? hiraganaToKatakana : (x: string) => x;
  const { tokens } = parseFurigana(text);
  let content: ReactNode;
  if (lv === 'romaji') {
    const kana = k(toReading(text));
    content = (
      <ruby>
        {kana}
        <rt>{kanaToRomaji(kana)}</rt>
      </ruby>
    );
  } else if (lv === 'kana') {
    content = k(toReading(text));
  } else {
    content = tokens.map((t, i) => {
      if (t.kind === 'text') return <span key={i}>{k(t.text)}</span>;
      if (t.kind === 'slot') return <span key={i}>＿＿</span>;
      return lv === 'furigana' ? (
        <ruby key={i}>
          {t.base}
          <rt>{k(t.reading)}</rt>
        </ruby>
      ) : (
        <span key={i}>{t.base}</span>
      );
    });
  }
  return (
    <span lang="ja" className={className}>
      {content}
    </span>
  );
}

/** A Japanese UI label (furigana, centred by its card); tapping it says the Japanese. */
export function UiJa({ text, className }: { text: string; className?: string }) {
  const { speak } = useJa();
  return (
    <button
      type="button"
      className={`speakable ui-ja ${className ?? ''}`}
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      aria-label={`Play: ${toReading(text)}`}
    >
      <JaText text={text} />
    </button>
  );
}

/** Japanese text that speaks when tapped. */
export function SpeakableJa({
  text,
  level,
  className,
  role,
  label,
}: JaProps & { role?: string; label?: string }) {
  const { speak } = useJa();
  return (
    <button
      type="button"
      className={`speakable ${className ?? ''}`}
      onClick={(e) => {
        e.stopPropagation();
        speak(text, role ? { role } : {});
      }}
      aria-label={label ?? `Play: ${toReading(text)}`}
    >
      <JaText text={text} {...(level ? { level } : {})} />
    </button>
  );
}

/** Mixed English/Japanese prose (teaching notes): renders {漢字|かな} markup inside English text. */
export function RichText({ text }: { text: string }) {
  const { tokens } = parseFurigana(text);
  return (
    <>
      {tokens.map((t, i) =>
        t.kind === 'ruby' ? (
          <JaText key={i} text={`{${t.base}|${t.reading}}`} />
        ) : t.kind === 'text' && /[぀-ヿ]/.test(t.text) ? (
          <span key={i}>
            {t.text.split(/([぀-ヿー]+)/).map((part, j) =>
              /[぀-ヿ]/.test(part) ? (
                <span lang="ja" key={j}>
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </span>
        ) : (
          <span key={i}>{t.kind === 'text' ? t.text : ''}</span>
        ),
      )}
    </>
  );
}
