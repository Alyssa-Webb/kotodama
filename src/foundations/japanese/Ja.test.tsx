// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { JaContext, JaText } from './Ja';
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

describe('katakana switch', () => {
  it('shows katakana in place of hiragana, furigana included', () => {
    const { container } = render(
      <JaContext.Provider value={{ scriptLevel: 'furigana', kana: 'katakana', speak: () => {} }}>
        <JaText text="{水|みず}をください" />
      </JaContext.Provider>,
    );
    expect(container.textContent).toBe('水ミズヲクダサイ');
  });
});
