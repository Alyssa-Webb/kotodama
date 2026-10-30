/**
 * FX bus. Screens fire named animation slots (design/animations.json); the FX layer turns each
 * into particles, a screen flash and a shake. Kept outside React so any handler can fire it.
 */
import type { AnimationSlot, ParticlesKind } from '../../schema/theme';
import { animations } from '../world';
import { haptic } from '../haptics/haptics';
import { moments } from '../moments/moments';

export interface Point {
  x: number;
  y: number;
}

export type FxEvent =
  | { kind: 'burst'; particles: ParticlesKind; at: Point; count?: number }
  | { kind: 'flash'; color: 'gold' | 'red' | 'white' }
  | { kind: 'shake' }
  | { kind: 'text'; text: string; at: Point; tone: 'xp' | 'gold' | 'bad' | 'dmg' }
  | { kind: 'banner'; text: string; sub?: string; tone: 'gold' | 'red' | 'ink' };

type Listener = (e: FxEvent) => void;
const listeners = new Set<Listener>();

export function onFx(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

function emit(e: FxEvent) {
  listeners.forEach((l) => l(e));
}

/** Center of an element, or of the viewport. */
export function centerOf(el?: Element | null): Point {
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export const fx = {
  /** Plays a slot's haptic, 2D moment, particles, flash and shake from its data definition. */
  slot(slot: AnimationSlot, at?: Point | Element | null, count?: number) {
    const def = animations.slots[slot];
    if (!def) return;
    const point =
      at && 'getBoundingClientRect' in at
        ? centerOf(at)
        : ((at as Point | undefined) ?? centerOf());
    // Haptic first: it lands in the same frame as the tap that caused it.
    haptic(def.haptic);
    moments.play(def.moment, point);
    if (def.particles !== 'none')
      emit({ kind: 'burst', particles: def.particles, at: point, ...(count ? { count } : {}) });
    if (def.flash !== 'none') emit({ kind: 'flash', color: def.flash });
    if (def.shake) emit({ kind: 'shake' });
  },
  text(text: string, at: Point | Element | null, tone: 'xp' | 'gold' | 'bad' | 'dmg' = 'xp') {
    emit({
      kind: 'text',
      text,
      at: at && 'getBoundingClientRect' in at ? centerOf(at) : ((at as Point | null) ?? centerOf()),
      tone,
    });
  },
  banner(text: string, tone: 'gold' | 'red' | 'ink' = 'gold', sub?: string) {
    emit({ kind: 'banner', text, tone, ...(sub ? { sub } : {}) });
  },
  burst(particles: ParticlesKind, at: Point | Element | null, count?: number) {
    emit({
      kind: 'burst',
      particles,
      at: at && 'getBoundingClientRect' in at ? centerOf(at) : ((at as Point | null) ?? centerOf()),
      ...(count ? { count } : {}),
    });
  },
};
