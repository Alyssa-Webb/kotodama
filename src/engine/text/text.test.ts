import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { fillSlots, parseFurigana, slotNames, toReading, toSurface } from './furigana';
import { editDistance, matchText, normalizeEnglish, normalizeJapanese } from './normalize';
import { expandLongVowels, isKanaOnly, katakanaToHiragana, romajiToKana } from './kana';

describe('parseFurigana', () => {
  it('splits text and ruby', () => {
    const { tokens, errors } = parseFurigana('{猫|ねこ}が{好|す}きです。');
    expect(errors).toEqual([]);
    expect(tokens).toEqual([
      { kind: 'ruby', base: '猫', reading: 'ねこ' },
      { kind: 'text', text: 'が' },
      { kind: 'ruby', base: '好', reading: 'す' },
      { kind: 'text', text: 'きです。' },
    ]);
  });
  it('reports unbalanced braces, missing readings and bare kanji', () => {
    expect(parseFurigana('{水|みず').errors.length).toBeGreaterThan(0);
    expect(parseFurigana('水|みず}').errors.length).toBeGreaterThan(0);
    expect(parseFurigana('{水}').errors[0]).toMatch(/missing/);
    expect(parseFurigana('水をください').errors[0]).toMatch(/without furigana/);
    expect(parseFurigana('{水|mizu}').errors[0]).toMatch(/kana only/);
  });
  it('handles pattern slots', () => {
    const p = '{{drink}}をください';
    expect(parseFurigana(p).errors).toEqual([]);
    expect(slotNames(p)).toEqual(['drink']);
    expect(fillSlots(p, { drink: '{水|みず}' })).toBe('{水|みず}をください');
  });
  it('derives surface and reading', () => {
    expect(toSurface('お{願|ねが}いします')).toBe('お願いします');
    expect(toReading('お{願|ねが}いします')).toBe('おねがいします');
  });
  it('never throws and round-trips plain kana', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const r = parseFurigana(s);
        expect(Array.isArray(r.tokens)).toBe(true);
      }),
    );
    fc.assert(
      fc.property(fc.stringMatching(/^[ぁ-ゖ]{1,12}$/), (kana) => {
        expect(toSurface(kana)).toBe(kana);
        expect(toReading(kana)).toBe(kana);
      }),
    );
  });
});

describe('kana helpers', () => {
  it('folds katakana and expands long vowels', () => {
    expect(katakanaToHiragana('コーヒー')).toBe('こーひー');
    expect(expandLongVowels('こーひー')).toBe('こおひい');
    expect(isKanaOnly('かんじ')).toBe(true);
    expect(isKanaOnly('漢字')).toBe(false);
  });
  it('converts romaji to kana', () => {
    expect(romajiToKana('mizuwokudasai')).toBe('みずをください');
    expect(romajiToKana('koohii')).toBe('こおひい');
  });
});

describe('normalizeJapanese', () => {
  it('treats full/half width, punctuation, katakana and long vowels as equal', () => {
    const target = normalizeJapanese('コーヒーをください。');
    expect(normalizeJapanese('こーひーをください')).toBe(target);
    expect(normalizeJapanese('こおひいをください！')).toBe(target);
    expect(normalizeJapanese('ｺｰﾋｰをください')).toBe(target);
    expect(normalizeJapanese('コーヒー を ください')).toBe(target);
  });
  it('keeps katakana distinct when folding is off', () => {
    expect(normalizeJapanese('コーヒー', { foldKana: false })).not.toBe(
      normalizeJapanese('こーひー', { foldKana: false }),
    );
  });
  it('is idempotent and never throws', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const once = normalizeJapanese(s);
        expect(normalizeJapanese(once)).toBe(once);
      }),
    );
  });
  it('folds any katakana word to its hiragana form', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[ァ-ヶ]{1,10}$/), (kata) => {
        expect(normalizeJapanese(kata)).toBe(normalizeJapanese(katakanaToHiragana(kata)));
      }),
    );
  });
});

describe('normalizeEnglish and matching', () => {
  it('ignores case, punctuation and leading articles', () => {
    expect(normalizeEnglish('  The Water! ')).toBe('water');
    expect(normalizeEnglish('Water, please.')).toBe('water please');
    expect(normalizeEnglish('to eat')).toBe('eat');
  });
  it('accepts one typo on longer answers only', () => {
    expect(matchText('coffe', ['coffee'])).toBe('typo');
    expect(matchText('cofee', ['coffee'])).toBe('typo');
    expect(matchText('tea', ['tea'])).toBe('exact');
    expect(matchText('sea', ['tea'])).toBe('wrong');
    expect(matchText('', ['tea'])).toBe('wrong');
  });
  it('editDistance is a metric on small strings', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 8 }), fc.string({ maxLength: 8 }), (a, b) => {
        expect(editDistance(a, b)).toBe(editDistance(b, a));
        expect(editDistance(a, a)).toBe(0);
        expect(editDistance(a, b)).toBeLessThanOrEqual(Math.max([...a].length, [...b].length));
      }),
    );
  });
});
