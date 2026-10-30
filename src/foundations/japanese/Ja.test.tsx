// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { JaContext, JaText, romajiOf } from './Ja';
import type { ScriptLevel } from '../../schema/save';

const html = (text: string, scriptLevel: ScriptLevel) =>
  render(
    <JaContext.Provider value={{ scriptLevel, speak: () => undefined }}>
      <JaText text={text} />
    </JaContext.Provider>,
  ).container.innerHTML;

describe('JaText', () => {
  it('always carries lang="ja"', () => {
    expect(html('{水|みず}', 'kanji')).toContain('lang="ja"');
  });
  it('renders ruby at the furigana level and hides it at the kanji level', () => {
    expect(html('{水|みず}をください', 'furigana')).toContain('<ruby>水<rt>みず</rt></ruby>');
    const k = html('{水|みず}をください', 'kanji');
    expect(k).not.toContain('<rt>');
    expect(k).toContain('水');
  });
  it('shows kana only at the kana level and romaji ruby at the romaji level', () => {
    expect(html('{水|みず}をください', 'kana')).toContain('みずをください');
    expect(html('{水|みず}', 'kana')).not.toContain('水');
    expect(html('{水|みず}', 'romaji')).toContain('<rt>mizu</rt>');
  });
});

describe('romajiOf', () => {
  it('spaces kanji words but keeps the honorific お/ご attached', () => {
    expect(romajiOf('{長|なが}い{髪|かみ}')).toBe('nagai kami');
    expect(romajiOf('お{守|まも}り')).toBe('omamori');
    expect(romajiOf('おにぎり')).toBe('onigiri');
  });
});
