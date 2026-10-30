import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { fewestPieces, toKanjiNumber, yenFurigana, yenReading } from './yen';

describe('yen readings', () => {
  it.each([
    [150, '百五十円', 'ひゃくごじゅうえん'],
    [300, '三百円', 'さんびゃくえん'],
    [600, '六百円', 'ろっぴゃくえん'],
    [800, '八百円', 'はっぴゃくえん'],
    [1000, '千円', 'せんえん'],
    [3000, '三千円', 'さんぜんえん'],
    [8000, '八千円', 'はっせんえん'],
    [10000, '一万円', 'いちまんえん'],
    [15000, '一万五千円', 'いちまんごせんえん'],
    [4, '四円', 'よえん'],
    [14, '十四円', 'じゅうよえん'],
    [9, '九円', 'きゅうえん'],
    [480, '四百八十円', 'よんひゃくはちじゅうえん'],
    [1250, '千二百五十円', 'せんにひゃくごじゅうえん'],
  ])('¥%i is %s (%s)', (n, kanji, kana) => {
    expect(yenReading(n)).toEqual({ kanji, kana });
  });

  it('makes furigana markup for the app', () => {
    expect(yenFurigana(500)).toBe('{五百円|ごひゃくえん}');
  });

  it('never writes 一 before 十, 百 or 千', () => {
    expect(toKanjiNumber(111)).toBe('百十一');
    expect(toKanjiNumber(1110)).toBe('千百十');
  });
});

describe('fewestPieces', () => {
  it('pays exactly with the fewest coins and notes (property)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 99999 }),
        (n) => fewestPieces(n).reduce((a, b) => a + b, 0) === n,
      ),
    );
    expect(fewestPieces(1480)).toEqual([1000, 100, 100, 100, 100, 50, 10, 10, 10]);
  });
});
