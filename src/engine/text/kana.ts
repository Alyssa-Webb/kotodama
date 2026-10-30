import { toHiragana, toRomaji } from 'wanakana';

const HAN = /\p{Script=Han}/u;
const KANA_ONLY = /^[\p{Script=Hiragana}\p{Script=Katakana}ー・゛゜]+$/u;
const JAPANESE = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー]/u;

export const hasKanji = (s: string): boolean => HAN.test(s);
export const isKanaOnly = (s: string): boolean => KANA_ONLY.test(s);
export const hasJapanese = (s: string): boolean => JAPANESE.test(s);

/** Katakana → hiragana, leaving everything else alone (ー is kept). */
export function katakanaToHiragana(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

const VOWEL_OF: Record<string, string> = {};
const ROWS: [string, string][] = [
  ['あかさたなはまやらわがざだばぱぁゃゎ', 'あ'],
  ['いきしちにひみりぎじぢびぴぃ', 'い'],
  ['うくすつぬふむゆるぐずづぶぷぅゅっ', 'う'],
  ['えけせてねへめれげぜでべぺぇ', 'え'],
  ['おこそとのほもよろをごぞどぼぽぉょ', 'お'],
];
for (const [chars, v] of ROWS) for (const c of chars) VOWEL_OF[c] = v;

/** Expands the long-vowel mark after hiragana into the vowel it stands for (こーひー → こおひい). */
export function expandLongVowels(hiragana: string): string {
  let out = '';
  for (const ch of hiragana) {
    if (ch === 'ー') {
      const prev = out.at(-1);
      out += (prev && VOWEL_OF[prev]) || ch;
    } else out += ch;
  }
  return out;
}

/** Romaji for display at the "romaji" script level. */
export const kanaToRomaji = (kana: string): string => toRomaji(kana);

/** Converts typed romaji to hiragana (IME-free typing). Already-Japanese text passes through. */
export const romajiToKana = (s: string): string => toHiragana(s, { passRomaji: false });
