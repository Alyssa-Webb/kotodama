/**
 * Every training screen opens through the gate: bushes part, fog clears, and the screen's world
 * stays alive behind the questions. Returns 'entering' until the gate hands over, so the UI can
 * make its entrance on the exact frame the camera lands.
 */
import { useEffect, useState } from 'react';
import type { ToyScene } from '../../schema/toys';
import { fx } from '../fx/fx';
import { toy } from './toy';

export function useTrainingGate(kind: ToyScene): 'entering' | 'ready' {
  const [phase, setPhase] = useState<'entering' | 'ready'>('entering');
  useEffect(() => {
    let live = true;
    fx.slot('lesson.start');
    toy.backdrop(kind);
    void toy.gate(kind).then(() => live && setPhase('ready'));
    return () => {
      live = false;
      toy.backdrop(null);
    };
  }, [kind]);
  return phase;
}
