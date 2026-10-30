import { describe, expect, it } from 'vitest';
import { aquesKana, clipName, queryKana, readingMatches, resolveStyle, toKatakana } from './lib';

const q = (...phrases: string[][]) => ({
  accent_phrases: phrases.map((ms) => ({ moras: ms.map((text) => ({ text })) })),
});

describe('voice lib', () => {
  it('compares the engine moras with the furigana reading', () => {
    const good = q(['ミ', 'ズ', 'ヲ'], ['ク', 'ダ', 'サ', 'イ']);
    expect(queryKana(good)).toBe('ミズヲクダサイ');
    expect(readingMatches(good, '{水|みず}をください。')).toBe(true);
    expect(readingMatches(q(['ス', 'イ']), '{水|みず}')).toBe(false); // misread as すい
  });
  it('builds AquesTalk-style kana with accent marks and phrase breaks', () => {
    expect(toKatakana('みず')).toBe('ミズ');
    expect(aquesKana('{水|みず}をください。')).toBe("ミ'ズヲクダサイ");
    expect(aquesKana('はい、どうぞ。')).toBe("ハ'イ/ド'ウゾ");
    expect(aquesKana('ジュース')).toBe("ジュ'ース");
  });
  it('hashes clip names from text, reading, voice, style and speed', () => {
    const a = clipName('{水|みず}', 'akari', 'ノーマル', 1);
    expect(a).toMatch(/^[0-9a-f]{20}\.m4a$/);
    expect(clipName('{水|みず}', 'akari', 'ノーマル', 0.75)).not.toBe(a);
    expect(clipName('{水|みず}', 'tetsu', 'ノーマル', 1)).not.toBe(a);
    expect(clipName('{水|みず}', 'akari', 'ノーマル', 1)).toBe(a);
  });
  it('resolves styles by name, never by number', () => {
    const speakers = [
      { name: '冥鳴ひまり', styles: [{ name: 'ノーマル', id: 14 }] },
      {
        name: '青山龍星',
        styles: [
          { name: '熱血', id: 81 },
          { name: 'ノーマル', id: 13 },
        ],
      },
    ];
    expect(resolveStyle(speakers, { speaker: '青山龍星', style: 'ノーマル' })).toEqual({
      id: 13,
      style: 'ノーマル',
    });
    expect(resolveStyle(speakers, { speaker: '冥鳴ひまり', style: '囁き' })).toEqual({
      id: 14,
      style: 'ノーマル',
    });
    expect(resolveStyle(speakers, { speaker: 'nobody', style: 'x' })).toBeNull();
  });
});
