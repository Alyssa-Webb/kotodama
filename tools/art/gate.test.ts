import { describe, expect, it } from 'vitest';
import {
  findNonComposited,
  findOutsideBrief,
  findRawColors,
  parseAddedLines,
  parseAllowlist,
} from './gate';

const added = (...lines: string[]) => lines.map((text, i) => ({ line: i + 1, text }));

describe('parseAllowlist', () => {
  it('reads paths and ignores what a note in brackets mentions', () => {
    const brief = [
      '# Brief',
      '## Task',
      '- `src/not-this.tsx`',
      '## Files you may change',
      '',
      '- `src/features/path/RegionGate.tsx`',
      '- `src/features/path/path.css` (only `.region-gate*` rules, appended at the end)',
      '* `src/a.tsx` and `src/b.css`',
      '## Rules',
      '- `src/nor-this.tsx`',
    ].join('\r\n');
    expect(parseAllowlist(brief)).toEqual([
      'src/features/path/RegionGate.tsx',
      'src/features/path/path.css',
      'src/a.tsx',
      'src/b.css',
    ]);
  });

  it('returns nothing when the section is missing', () => {
    expect(parseAllowlist('# Brief\n## Task\nDraw it.')).toEqual([]);
  });

  it('reads the section when it is the last one', () => {
    expect(parseAllowlist('## Files you may change\n- `a.tsx`\n')).toEqual(['a.tsx']);
  });
});

describe('findOutsideBrief', () => {
  it('flags only files no pattern covers', () => {
    const changed = ['src/a/one.tsx', 'src/a/deep/two.tsx', 'src/b/three.css', 'src/c.ts'];
    const found = findOutsideBrief(changed, ['src/a/**', 'src/b/*.css']);
    expect(found.map((f) => f.file)).toEqual(['src/c.ts']);
  });

  it('treats a trailing slash as a folder and never lets a dot act as a wildcard', () => {
    expect(findOutsideBrief(['src/a/one.tsx'], ['src/a/'])).toEqual([]);
    expect(findOutsideBrief(['srcXa.tsx'], ['src.a.tsx'])).toHaveLength(1);
  });
});

describe('findRawColors', () => {
  it('flags hex, functional and named colors', () => {
    const found = findRawColors(
      'a.tsx',
      added(
        '<path fill="#fff" />',
        'color: rgba(0, 0, 0, 0.5);',
        '<path fill="white" />',
        'const a = { background: "red" };',
      ),
    );
    expect(found.map((f) => f.line)).toEqual([1, 2, 3, 4]);
  });

  it('allows theme variables, SVG references, entities and comments', () => {
    const found = findRawColors(
      'a.tsx',
      added(
        '<path fill="var(--c-accent)" stroke="none" />',
        '<path fill="url(#fade)" />',
        `<path fill="url('#fade')" />`,
        '<use href="#abc" />',
        '<use href={"#abc"} />',
        'const copy = "&#123;";',
        '// was #ffffff',
        '{/* was #ffffff */}',
      ),
    );
    expect(found).toEqual([]);
  });
});

describe('findNonComposited', () => {
  const css = [
    '@keyframes good {',
    '  from { transform: scale(1); opacity: 0; animation-timing-function: linear; }',
    '  to { transform: scale(2); opacity: 1; }',
    '}',
    '@keyframes bad {',
    '  50% { width: 10px; box-shadow: 0 0 1px var(--c-ink); }',
    '}',
    '.a { transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1s; }',
    '.b { transition: all 1s; }',
    '.c { transition: width 1s; }',
  ].join('\n');

  it('flags layout and paint properties in added keyframes', () => {
    const found = findNonComposited('a.css', css, new Set([6]));
    expect(found.map((f) => f.detail)).toEqual([
      '@keyframes bad animates "width"',
      '@keyframes bad animates "box-shadow"',
    ]);
    expect(found[0]?.line).toBe(6);
  });

  it('ignores blocks and transitions the run did not touch', () => {
    expect(findNonComposited('a.css', css, new Set([2, 8]))).toEqual([]);
  });

  it('flags transitions that aren\'t composited, including "all"', () => {
    const found = findNonComposited('a.css', css, new Set([9, 10]));
    expect(found.map((f) => f.detail)).toEqual(['transition on "all"', 'transition on "width"']);
  });

  it('finds transitions in inline styles', () => {
    const found = findNonComposited(
      'a.tsx',
      `<a style={{ transition: 'height 1s' }} />`,
      new Set([1]),
    );
    expect(found.map((f) => f.detail)).toEqual(['transition on "height"']);
  });
});

describe('parseAddedLines', () => {
  it('numbers added lines per file from a zero-context diff', () => {
    const diff = [
      'diff --git a/a.css b/a.css',
      '--- a/a.css',
      '+++ b/a.css',
      '@@ -1 +1,2 @@',
      '-old',
      '+one',
      '+two',
      '@@ -9,0 +11 @@',
      '+three',
      'diff --git a/b.css b/b.css',
      '--- /dev/null',
      '+++ b/b.css',
      '@@ -0,0 +1 @@',
      '+new',
    ].join('\n');
    const files = parseAddedLines(diff);
    expect(files.get('a.css')).toEqual([
      { line: 1, text: 'one' },
      { line: 2, text: 'two' },
      { line: 11, text: 'three' },
    ]);
    expect(files.get('b.css')).toEqual([{ line: 1, text: 'new' }]);
  });
});
