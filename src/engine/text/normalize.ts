/**
 * Answer normalization for graders. Japanese and English answers are normalized differently:
 * - Japanese: NFKC (full/half width), drop spaces and punctuation, optional katakana→hiragana
 *   fold, long-vowel expansion (コーヒー ≡ こおひい when folded).
 * - English: NFKC, lowercase, strip punctuation and leading articles, collapse whitespace.
 */
import { expandLongVowels, katakanaToHiragana } from './kana';

const JA_PUNCT = /[\s\u3000。、．，,.!！?？「」『』（）()・…~〜]/gu;
const EN_PUNCT = /[.,!?;:"“”'‘’()\-–—…]/g;

export interface JaNormalizeOptions {
  /** Treat hiragana and katakana as equal (default true). */
  foldKana?: boolean;
}

export function normalizeJapanese(input: string, opts: JaNormalizeOptions = {}): string {
  const foldKana = opts.foldKana ?? true;
  let s = input.normalize('NFKC').replace(JA_PUNCT, '');
  s = s.toLowerCase();
  if (foldKana) s = expandLongVowels(katakanaToHiragana(s));
  return s;
}

export function normalizeEnglish(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/\p{M}/gu, '') // café → cafe, chōchin → chochin
    .normalize('NFKC')
    .toLowerCase()
    .replace(EN_PUNCT, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(?:a|an|the|to) /, '');
}

/** Levenshtein distance (iterative, O(n·m) with two rows). */
export function editDistance(a: string, b: string): number {
  const A = [...a];
  const B = [...b];
  let prev = Array.from({ length: B.length + 1 }, (_, j) => j);
  for (let i = 1; i <= A.length; i++) {
    const cur = [i];
    for (let j = 1; j <= B.length; j++) {
      cur[j] = Math.min(
        prev[j]! + 1,
        cur[j - 1]! + 1,
        prev[j - 1]! + (A[i - 1] === B[j - 1] ? 0 : 1),
      );
    }
    prev = cur;
  }
  return prev[B.length]!;
}

export type TextMatch = 'exact' | 'typo' | 'wrong';

/**
 * Compares a typed answer with accepted answers (already normalized by the caller's choice of
 * normalizer). With allowTypo, answers of 5+ characters tolerate one edit, reported as "typo".
 * Japanese answers pass allowTypo=false: one kana is often a different particle or word.
 */
export function matchText(given: string, accepted: readonly string[], allowTypo = true): TextMatch {
  if (!given) return 'wrong';
  if (accepted.includes(given)) return 'exact';
  const len = [...given].length;
  if (allowTypo && len >= 5 && accepted.some((a) => editDistance(given, a) <= 1)) return 'typo';
  return 'wrong';
}
