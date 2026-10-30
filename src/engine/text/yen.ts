/**
 * Japanese numbers for money: kanji (百五十), kana reading with the sound changes learners trip
 * on (さんびゃく, ろっぴゃく, はっぴゃく, さんぜん, はっせん, いちまん), and the yen ending (よえん
 * for a final 4). Pure, so prices anywhere in the app can teach how money is said in Japan.
 */

const DIGIT_KANJI = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const DIGIT_KANA = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
const HUNDREDS = [
  '',
  'ひゃく',
  'にひゃく',
  'さんびゃく',
  'よんひゃく',
  'ごひゃく',
  'ろっぴゃく',
  'ななひゃく',
  'はっぴゃく',
  'きゅうひゃく',
];
const THOUSANDS = [
  '',
  'せん',
  'にせん',
  'さんぜん',
  'よんせん',
  'ごせん',
  'ろくせん',
  'ななせん',
  'はっせん',
  'きゅうせん',
];

/** 0–9999 in kanji (no leading 一 before 十, 百, 千). */
function kanji4(n: number): string {
  const [th, h, t, o] = [
    Math.floor(n / 1000),
    Math.floor(n / 100) % 10,
    Math.floor(n / 10) % 10,
    n % 10,
  ];
  const unit = (d: number, u: string) => (d === 0 ? '' : d === 1 ? u : DIGIT_KANJI[d] + u);
  return unit(th, '千') + unit(h, '百') + unit(t, '十') + DIGIT_KANJI[o];
}

function kana4(n: number): string {
  const [th, h, t, o] = [
    Math.floor(n / 1000),
    Math.floor(n / 100) % 10,
    Math.floor(n / 10) % 10,
    n % 10,
  ];
  const tens = t === 0 ? '' : t === 1 ? 'じゅう' : DIGIT_KANA[t] + 'じゅう';
  return THOUSANDS[th]! + HUNDREDS[h]! + tens + DIGIT_KANA[o];
}

export function toKanjiNumber(n: number): string {
  const v = Math.floor(Math.abs(n));
  if (v === 0) return '〇';
  const man = Math.floor(v / 10000);
  const rest = v % 10000;
  return (man ? kanji4(man) + '万' : '') + kanji4(rest);
}

export function toKanaNumber(n: number): string {
  const v = Math.floor(Math.abs(n));
  if (v === 0) return 'ゼロ';
  const man = Math.floor(v / 10000);
  const rest = v % 10000;
  // 10,000 is いちまん (always with いち), unlike 十, 百 and 千.
  const manPart = man ? (man === 1 ? 'いち' : kana4(man)) + 'まん' : '';
  return manPart + kana4(rest);
}

/** "百五十円" read "ひゃくごじゅうえん". A final 4 becomes よ before 円 (よえん). */
export function yenReading(n: number): { kanji: string; kana: string } {
  const v = Math.floor(Math.abs(n));
  let kana = toKanaNumber(v);
  if (v % 10 === 4) kana = kana.replace(/よん$/, 'よ');
  if (v === 0) kana = 'ゼロ';
  return { kanji: `${toKanjiNumber(v)}円`, kana: `${kana}えん` };
}

/** Furigana markup for a price, ready for <JaText>: {百五十円|ひゃくごじゅうえん}. */
export function yenFurigana(n: number): string {
  const r = yenReading(n);
  return `{${r.kanji}|${r.kana}}`;
}

/** Japan's coins and notes, smallest first. */
export const YEN_DENOMINATIONS = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000] as const;
export type YenDenomination = (typeof YEN_DENOMINATIONS)[number];

/** The fewest coins and notes that make `amount` exactly (greedy is optimal for yen). */
export function fewestPieces(amount: number): YenDenomination[] {
  const out: YenDenomination[] = [];
  let left = Math.max(0, Math.floor(amount));
  for (const d of [...YEN_DENOMINATIONS].reverse()) {
    while (left >= d) {
      out.push(d);
      left -= d;
    }
  }
  return out;
}
