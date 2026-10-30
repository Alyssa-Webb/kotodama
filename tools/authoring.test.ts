import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LessonPackSchema } from '../src/schema/pack';
import { validatePack } from '../src/engine/pack/validate';

/** The prompt in AUTHORING.md is tested like code: its example must validate. */
function exampleFromAuthoring(): unknown {
  const md = readFileSync('AUTHORING.md', 'utf8');
  const m = md.match(/<example>\s*([\s\S]*?)\s*<\/example>/);
  if (!m) throw new Error('no <example> block in AUTHORING.md');
  return JSON.parse(m[1]!);
}

describe('AUTHORING.md', () => {
  it('contains the plan prompt verbatim', () => {
    const plan = readFileSync('PLAN.md', 'utf8');
    const start = plan.indexOf('# Role\nYou write lesson packs');
    const end = plan.indexOf('</example>', start) + '</example>'.length;
    expect(start).toBeGreaterThan(0);
    expect(readFileSync('AUTHORING.md', 'utf8')).toContain(plan.slice(start, end));
  });

  it('its example pack matches the schema', () => {
    const r = LessonPackSchema.safeParse(exampleFromAuthoring());
    expect(r.success, JSON.stringify(!r.success && r.error.issues)).toBe(true);
  });

  it('its example only breaks the rules it admits to (shortened nodes, external ja-core items)', () => {
    const r = validatePack(exampleFromAuthoring());
    const unexpected = r.errors.filter(
      (e) => !/exercises \(has|exercise types \(has/.test(e.message),
    );
    expect(unexpected).toEqual([]);
  });
});
