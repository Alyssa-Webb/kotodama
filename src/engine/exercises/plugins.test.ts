import { describe, expect, it } from 'vitest';
import starter from '../../../content/packs/kotodama-starter.json';
import { LessonPackSchema, type Exercise } from '../../schema/pack';
import { PackIndex } from '../pack/index';
import { Rng } from '../rng';
import { toReading, toSurface } from '../text/furigana';
import { grade } from './grade';
import { prepareExercise } from './plugins';
import type { Answer, PrepareContext, Question } from './types';

const pack = LessonPackSchema.parse(starter);
const index = new PackIndex([pack]);
const ctx = (seed = 7): PrepareContext => ({ index, rng: new Rng(seed), isAvailable: () => true });
const exercise = (id: string): Exercise => {
  for (const u of pack.units)
    for (const n of u.nodes) for (const e of n.exercises) if (e.id === id) return e;
  throw new Error(id);
};
const prep = (id: string, seed?: number) => prepareExercise(exercise(id), ctx(seed))!;

/** Answer-key bot: produces the right answer for any question from its own data. */
export function solve(q: Question): Answer {
  switch (q.shape) {
    case 'choose':
      return { kind: 'choose', optionId: q.correctId };
    case 'match':
      return { kind: 'match', wrongAttempts: 0 };
    case 'tiles': {
      const want = 'ja' in q.solution ? toReading(q.solution.ja) : '';
      // greedy: pick tiles whose readings consume the target from the left
      let rest = want.replace(/[。、！？]$/, '');
      const ids: string[] = [];
      const pool = [...q.tiles];
      while (rest) {
        const i = pool.findIndex((t) => rest.startsWith(toReading(t.text)));
        if (i < 0) break;
        ids.push(pool[i]!.id);
        rest = rest.slice(toReading(pool[i]!.text).length);
        pool.splice(i, 1);
      }
      return { kind: 'tiles', tileIds: ids };
    }
    case 'type':
      return { kind: 'type', text: 'ja' in q.solution ? toSurface(q.solution.ja) : q.solution.en };
    case 'trace':
      return { kind: 'trace', selfCorrect: true };
    case 'dialogue':
      return { kind: 'dialogue', wrongChoices: 0 };
  }
}

describe('answer-key bot', () => {
  it('prepares and solves every exercise in the starter pack', () => {
    let count = 0;
    for (const u of pack.units)
      for (const n of u.nodes)
        for (const e of n.exercises) {
          const q = prepareExercise(e, ctx());
          expect(q, e.id).not.toBeNull();
          expect(grade(q!, solve(q!)).correct, `${e.id} (${e.type})`).toBe(true);
          count++;
        }
    expect(count).toBe(133);
  });
});

describe('graders', () => {
  it('choice: only the answer option is correct; meaning prompt shows the word', () => {
    const q = prep('u02.n01.e01');
    if (q.shape !== 'choose') throw new Error('shape');
    expect(q.prompt.ja).toBe('{水|みず}');
    expect(q.options).toHaveLength(3);
    for (const o of q.options)
      expect(grade(q, { kind: 'choose', optionId: o.id }).correct).toBe(o.id === 'w.mizu');
  });

  it('choice/listen shuffles deterministically with the seed', () => {
    expect(prep('u02.n01.e02', 1)).toEqual(prep('u02.n01.e02', 1));
  });

  it('type (japanese): accepts kana, katakana, romaji and kanji; rejects other words', () => {
    const q = prep('u02.n01.e08'); // type w.mizu japanese
    const g = (text: string) => grade(q, { kind: 'type', text }).correct;
    expect(g('みず')).toBe(true);
    expect(g('ミズ')).toBe(true);
    expect(g('mizu')).toBe(true);
    expect(g('水')).toBe(true);
    expect(g('おちゃ')).toBe(false);
    expect(g('')).toBe(false);
  });

  it('type (japanese) handles long vowels: こーひー, こおひい, koohii all equal コーヒー', () => {
    const q = prep('u02.n07.e08');
    for (const t of ['コーヒー', 'こーひー', 'こおひい', 'koohii', 'ko-hi-'])
      expect(grade(q, { kind: 'type', text: t }).correct, t).toBe(true);
  });

  it('Japanese answers get no typo pass: a wrong particle is wrong', () => {
    const q = prepareExercise(
      { id: 'w', type: 'type', item: 's.mizu-o-kudasai', ask: 'japanese' },
      ctx(),
    )!;
    expect(grade(q, { kind: 'type', text: 'みずをください' }).correct).toBe(true);
    expect(grade(q, { kind: 'type', text: 'みずがください' }).correct).toBe(false);
  });

  it('romaji particles (wa, o, e) are exact, not typos', () => {
    const q = prepareExercise(
      { id: 'x', type: 'type', item: 's.kore-wa-nan-desu-ka', ask: 'japanese' },
      ctx(),
    )!;
    expect(grade(q, { kind: 'type', text: 'kore wa nan desu ka' })).toMatchObject({
      correct: true,
      typo: false,
    });
    const m = prepareExercise(
      { id: 'y', type: 'type', item: 's.mizu-o-kudasai', ask: 'japanese' },
      ctx(),
    )!;
    expect(grade(m, { kind: 'type', text: 'mizu o kudasai' })).toMatchObject({
      correct: true,
      typo: false,
    });
  });

  it('English answers ignore accents: cafe = café', () => {
    const q = prepareExercise(
      { id: 'z', type: 'type', item: 'w.kissaten', ask: 'meaning' },
      ctx(),
    )!;
    expect(grade(q, { kind: 'type', text: 'cafe' }).correct).toBe(true);
  });

  it('type (meaning) for kana takes the romaji sound', () => {
    const q = prep('u01.n03.e06'); // type k.ka meaning
    expect(grade(q, { kind: 'type', text: 'ka' }).correct).toBe(true);
    expect(grade(q, { kind: 'type', text: 'ki' }).correct).toBe(false);
  });

  it('translate toEnglish accepts any listed meaning and tolerates one typo', () => {
    const q = prep('u02.n04.e06');
    const g = (text: string) => grade(q, { kind: 'type', text });
    expect(g('One coffee, please.').correct).toBe(true);
    expect(g('a coffee please').correct).toBe(true);
    expect(g('one cofee please')).toMatchObject({ correct: true, typo: true });
    expect(g('two coffees please').correct).toBe(false);
  });

  it('tiles: the right order is correct, a wrong order or extra tile is not', () => {
    const q = prep('u02.n04.e09'); // tiles s.koohii-o-hitotsu with extra 二つ
    if (q.shape !== 'tiles') throw new Error('shape');
    expect(q.suffix).toBe('。');
    expect(q.tiles).toHaveLength(5);
    const id = (t: string) => q.tiles.find((x) => toSurface(x.text) === t)!.id;
    const ok = ['コーヒー', 'を', '一つ', 'ください'].map(id);
    expect(grade(q, { kind: 'tiles', tileIds: ok }).correct).toBe(true);
    expect(
      grade(q, { kind: 'tiles', tileIds: ['を', 'コーヒー', '一つ', 'ください'].map(id) }).correct,
    ).toBe(false);
    expect(
      grade(q, { kind: 'tiles', tileIds: ['コーヒー', 'を', '二つ', 'ください'].map(id) }).correct,
    ).toBe(false);
  });

  it('register: polite → casual expects the casual variant', () => {
    const q = prep('u02.n02.e09');
    expect(q.prompt.ja).toBe('お{願|ねが}いします');
    expect(grade(q, { kind: 'type', text: 'おねがい' }).correct).toBe(true);
    expect(grade(q, { kind: 'type', text: 'おねがいします' }).correct).toBe(false);
  });

  it('pattern: fills the slot with an available word', () => {
    const only = (id: string): PrepareContext => ({
      index,
      rng: new Rng(3),
      isAvailable: (x) => x === id,
    });
    const q = prepareExercise(exercise('u02.n01.e10'), only('w.koohii'))!;
    expect(q.solution).toEqual({ ja: 'コーヒーをください' });
    expect(q.prompt.en).toBe('Coffee, please');
    expect(grade(q, { kind: 'type', text: 'こーひーをください' }).correct).toBe(true);
  });

  it('pattern toEnglish offers other fillers as distractors', () => {
    const q = prep('u02.n01.e07');
    if (q.shape !== 'choose') throw new Error('shape');
    expect(q.options.length).toBe(3);
    expect(new Set(q.options.map((o) => JSON.stringify(o.display))).size).toBe(3);
  });

  it('fill: only the particle を is correct', () => {
    const q = prep('u02.n01.e13');
    if (q.shape !== 'choose') throw new Error('shape');
    const right = q.options.find((o) => 'ja' in o.display && o.display.ja === 'を')!;
    expect(grade(q, { kind: 'choose', optionId: right.id }).correct).toBe(true);
    const wrong = q.options.find((o) => o.id !== right.id)!;
    expect(grade(q, { kind: 'choose', optionId: wrong.id }).correct).toBe(false);
    expect(q.targets).toEqual([]);
  });

  it('match, trace and dialogue grade by mistakes', () => {
    const m = prep('u01.n01.e06');
    expect(grade(m, { kind: 'match', wrongAttempts: 1 }).correct).toBe(false);
    const t = prep('u01.n01.e08');
    expect(t.shape === 'trace' && t.glyph).toBe('い');
    const d = prep('u02.n06.e01');
    if (d.shape !== 'dialogue') throw new Error('shape');
    expect(d.steps.filter((s) => s.choices).length).toBe(4);
    expect(grade(d, { kind: 'dialogue', wrongChoices: 1 }).correct).toBe(false);
  });

  it('reading questions hide furigana and use kana options', () => {
    const q = prepareExercise(
      { id: 'x', type: 'choice', item: 'w.mizu', ask: 'reading', distractors: ['w.ocha'] },
      ctx(),
    )!;
    expect(q.prompt.hideFurigana).toBe(true);
    if (q.shape !== 'choose') throw new Error('shape');
    expect(q.options.map((o) => o.display)).toContainEqual({ ja: 'みず' });
  });

  it('unknown items are skipped safely', () => {
    expect(prepareExercise({ id: 'x', type: 'dictation', item: 'w.nope' }, ctx())).toBeNull();
  });
});
