/** Pure graders, one per question shape. */
import { toReading, toSurface } from '../text/furigana';
import { hasJapanese, romajiToKana } from '../text/kana';
import { matchText, normalizeEnglish, normalizeJapanese } from '../text/normalize';
import type { Answer, GradeResult, Question } from './types';

/** Normalized forms accepted for a Japanese answer (surface and kana reading). */
export function jaAccepted(texts: readonly string[]): string[] {
  const out = new Set<string>();
  for (const t of texts) {
    out.add(normalizeJapanese(toSurface(t)));
    const reading = normalizeJapanese(toReading(t));
    out.add(reading);
    // Typed romaji spells the particles は, を, へ as wa, o, e.
    out.add(reading.replace(/は/g, 'わ').replace(/を/g, 'お').replace(/へ/g, 'え'));
  }
  return [...out];
}

/** Normalized forms accepted for an English answer; "one (thing)" also accepts "one" and "one thing". */
export function enAccepted(texts: readonly string[]): string[] {
  const out = new Set<string>();
  for (const t of texts) {
    out.add(normalizeEnglish(t));
    out.add(normalizeEnglish(t.replace(/\([^)]*\)/g, ' ')));
    out.add(normalizeEnglish(t.replace(/[()]/g, ' ')));
    if (t.includes('/')) t.split('/').forEach((p) => out.add(normalizeEnglish(p)));
  }
  out.delete('');
  return [...out];
}

/** Normalizes typed Japanese: romaji typed without an IME is converted to kana first. */
export function normalizeTypedJapanese(input: string): string {
  const s = input.trim();
  const converted = /[a-z]/i.test(s) && !hasJapanese(s) ? romajiToKana(s.toLowerCase()) : s;
  return normalizeJapanese(converted);
}

export function grade(q: Question, a: Answer): GradeResult {
  switch (q.shape) {
    case 'choose': {
      if (a.kind !== 'choose') break;
      const opt = q.options.find((o) => o.id === a.optionId);
      const given = opt ? ('ja' in opt.display ? toSurface(opt.display.ja) : opt.display.en) : '';
      return { correct: a.optionId === q.correctId, typo: false, given };
    }
    case 'match':
      if (a.kind !== 'match') break;
      return {
        correct: a.wrongAttempts === 0,
        typo: false,
        given: a.wrongAttempts ? `${a.wrongAttempts} wrong pair(s)` : 'all pairs',
      };
    case 'tiles': {
      if (a.kind !== 'tiles') break;
      const text =
        a.tileIds.map((id) => q.tiles.find((t) => t.id === id)?.text ?? '').join('') + q.suffix;
      const n = normalizeJapanese(toReading(text));
      return { correct: q.accepted.includes(n), typo: false, given: toSurface(text) };
    }
    case 'type': {
      if (a.kind !== 'type') break;
      const given = a.text.trim();
      const norm = q.answerLang === 'ja' ? normalizeTypedJapanese(given) : normalizeEnglish(given);
      const m = matchText(norm, q.accepted, q.answerLang === 'en');
      return { correct: m !== 'wrong', typo: m === 'typo', given };
    }
    case 'trace':
      if (a.kind !== 'trace') break;
      return {
        correct: a.selfCorrect,
        typo: false,
        given: a.selfCorrect ? 'traced' : 'needs practice',
      };
    case 'dialogue':
      if (a.kind !== 'dialogue') break;
      return {
        correct: a.wrongChoices === 0,
        typo: false,
        given: a.wrongChoices ? `${a.wrongChoices} wrong reply` : 'all replies right',
      };
  }
  return { correct: false, typo: false, given: '' };
}
