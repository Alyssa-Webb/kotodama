/**
 * Animation slots. The engine fires named events (answer.correct, lesson.complete...); the
 * theme decides how each looks. A slot with a Lottie file in design/animations.json plays it
 * (lottie-web is lazy-loaded); otherwise a built-in Motion fallback runs. Durations come from
 * design tokens; reduced-motion users get no movement.
 */
import { useEffect, useRef, type ReactNode } from 'react';
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type TargetAndTransition,
} from 'motion/react';
import type { AnimationSlot, FallbackAnimation } from '../../schema/theme';
import { animations } from '../world';
import { tokens } from '../theme/theme';

const lottieUrls = import.meta.glob('../../../design/animations/*.json', {
  query: '?url',
  import: 'default',
}) as Record<string, () => Promise<string>>;

const sec = (ms: number) => ms / 1000;

function fallbackFrames(kind: FallbackAnimation): TargetAndTransition {
  const m = tokens.motion;
  switch (kind) {
    case 'pulse':
      return { scale: [1, 1.04, 1], transition: { duration: sec(m.slow) } };
    case 'shake':
      return { x: [0, -10, 10, -6, 6, 0], transition: { duration: sec(m.slow) } };
    case 'pop':
      return { scale: [0.8, 1.15, 1], transition: { duration: sec(m.base) } };
    case 'rise':
      return { y: [24, 0], opacity: [0, 1], transition: { duration: sec(m.celebrate) } };
    case 'float':
      return { y: [0, -4, 0], transition: { duration: sec(m.celebrate) * 3, repeat: Infinity } };
    case 'none':
      return {};
  }
}

interface SlotProps {
  slot: AnimationSlot;
  /** Changing this value fires the slot again. */
  fire: unknown;
  children: ReactNode;
  className?: string;
}

export function Slot({ slot, fire, children, className }: SlotProps) {
  const controls = useAnimationControls();
  const reduced = useReducedMotion();
  const lottieHost = useRef<HTMLDivElement>(null);
  const def = animations.slots[slot];

  useEffect(() => {
    if (fire === undefined || fire === null || fire === false || reduced) return;
    const file = def?.lottie
      ? Object.entries(lottieUrls).find(([k]) => k.endsWith(`/${def.lottie}`))?.[1]
      : undefined;
    if (file && lottieHost.current) {
      const host = lottieHost.current;
      let anim: { destroy(): void } | undefined;
      void Promise.all([import('lottie-web'), file()]).then(([lottie, url]) => {
        anim = lottie.default.loadAnimation({
          container: host,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          path: url,
        });
      });
      return () => anim?.destroy();
    }
    void controls.start(fallbackFrames(def?.fallback ?? 'none'));
    return undefined;
  }, [fire, reduced, controls, def]);

  return (
    <motion.div className={className} animate={controls} style={{ position: 'relative' }}>
      {children}
      <div
        ref={lottieHost}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
    </motion.div>
  );
}
