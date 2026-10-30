/**
 * Moments bus: full-screen 2D animations (SVG + CSS, transform/opacity only, so they stay on the
 * compositor and hold 60–120 fps on phones). Screens fire moments; <MomentsLayer> renders them.
 * Every call resolves at once when nothing is mounted or the player prefers reduced motion, so
 * game logic never waits on an animation.
 */
import type { MomentName } from '../../schema/theme';
import type { GateScene } from '../../schema/moments';
import type { Rarity } from '../../engine/gacha';
import type { Reel } from '../../engine/gachaReel';
import { prefersReducedMotion } from '../platform';

export interface Point {
  x: number;
  y: number;
}

export type MomentEvent =
  | { kind: 'slot'; name: Exclude<MomentName, 'none'>; at: Point }
  | { kind: 'gate'; scene: GateScene; done: () => void }
  | { kind: 'finish'; done: () => void }
  | { kind: 'case'; reel: Reel; onReveal: (rarity: Rarity) => void; done: () => void }
  | { kind: 'purchase'; label: string; from: Point; done: () => void };

type Listener = (e: MomentEvent) => void;
const listeners = new Set<Listener>();

export function onMoment(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

function canPlay() {
  return listeners.size > 0 && !prefersReducedMotion();
}

function emit(e: MomentEvent) {
  listeners.forEach((l) => l(e));
}

function waitFor(make: (done: () => void) => MomentEvent): Promise<void> {
  if (!canPlay()) return Promise.resolve();
  return new Promise((resolve) => emit(make(resolve)));
}

export const moments = {
  play(name: MomentName, at: Point) {
    if (name !== 'none' && canPlay()) emit({ kind: 'slot', name, at });
  },
  /** Training start. Resolves when the UI should make its entrance. */
  gate: (scene: GateScene) => waitFor((done) => ({ kind: 'gate', scene, done })),
  /** Training finished: curtains over the results, then lifted away. */
  finish: () => waitFor((done) => ({ kind: 'finish', done })),
  /** Purchase: the item's badge pops out of its card and flies to your avatar. */
  purchase: (label: string, from: Point) =>
    waitFor((done) => ({ kind: 'purchase', label, from, done })),
  /**
   * Case opening: the reel spins past the marker and stops on the prize. `onReveal` fires as
   * the prize is revealed (immediately when animations are off).
   */
  openCase(reel: Reel, onReveal: (rarity: Rarity) => void): Promise<void> {
    const rarity = reel.items[reel.win]?.rarity ?? 'common';
    if (!canPlay()) {
      onReveal(rarity);
      return Promise.resolve();
    }
    return new Promise((resolve) => emit({ kind: 'case', reel, onReveal, done: resolve }));
  },
};
