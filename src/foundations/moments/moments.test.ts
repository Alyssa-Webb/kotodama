// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { moments, onMoment, type MomentEvent } from './moments';
import { sceneFor } from './TrainingGate';
import { momentsConfig, animations } from '../world';

const noMotion = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: reduce && q.includes('reduce') }));

describe('moments bus', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('never makes game logic wait when nothing is mounted', async () => {
    noMotion(false);
    await expect(moments.gate('grove')).resolves.toBeUndefined();
    const opened = vi.fn();
    await moments.capsule('rare', opened);
    expect(opened).toHaveBeenCalledOnce();
  });

  it('skips every moment for reduced motion, but still opens the capsule', async () => {
    noMotion(true);
    const seen: MomentEvent[] = [];
    const off = onMoment((e) => seen.push(e));
    await moments.finish();
    moments.play('maru', { x: 0, y: 0 });
    const opened = vi.fn();
    await moments.capsule('common', opened);
    off();
    expect(seen).toEqual([]);
    expect(opened).toHaveBeenCalledOnce();
  });

  it('delivers moments to the layer and resolves when the layer says done', async () => {
    noMotion(false);
    const off = onMoment((e) => {
      if (e.kind === 'gate') e.done();
    });
    await expect(moments.gate('dojo')).resolves.toBeUndefined();
    off();
  });
});

describe('scenes and slots', () => {
  it('rotates lesson scenes by unit and maps other trainings from data', () => {
    const s = momentsConfig.scenes;
    expect(sceneFor(s, 'lesson', 0)).toBe(s.lesson[0]);
    expect(sceneFor(s, 'lesson', s.lesson.length)).toBe(s.lesson[0]);
    expect(sceneFor(s, 'boss')).toBe(s.boss);
  });
  it('grades answers with the red-ink marks and finishes bosses with the slash', () => {
    expect(animations.slots['answer.correct']?.moment).toBe('maru');
    expect(animations.slots['answer.incorrect']?.moment).toBe('batsu');
    expect(animations.slots['boss.defeat']?.moment).toBe('slash');
  });
});
