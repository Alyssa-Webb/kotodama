/**
 * Mounted around every full-screen training (lessons, Dojo reviews, rushes, bosses, trials).
 * Picks the world for the route, plays the gate and keeps that world alive behind the UI.
 * While the gate plays, <body> carries `toy-entering`; removing it is the UI's cue to drop in.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import type { ToyScene } from '../../schema/toys';
import { nodeKey } from '../../engine/pack/index';
import { useGame } from '../store/gameStore';
import { toys } from '../world';
import { useTrainingGate } from './useTrainingGate';
import { worldFor } from './scenes';
import './toy.css';

function useWorldKind(): ToyScene {
  const { pathname } = useLocation();
  const index = useGame((s) => s.index);
  const [, root, a, b] = pathname.split('/');
  if (root === 'lesson' && a && b) {
    const unitIndex =
      index.node(nodeKey(decodeURIComponent(a), decodeURIComponent(b)))?.unitIndex ?? 0;
    return worldFor(toys.scenes, 'lesson', unitIndex);
  }
  if (root === 'boss') return worldFor(toys.scenes, 'boss');
  if (root === 'rush') return worldFor(toys.scenes, 'rush');
  return worldFor(toys.scenes, 'dojo');
}

function Gate({ kind }: { kind: ToyScene }) {
  const phase = useTrainingGate(kind);
  useEffect(() => {
    if (phase === 'ready') {
      document.body.classList.remove('toy-entering');
      return;
    }
    document.body.classList.add('toy-entering');
    // Never leave the UI hidden, whatever happens to the 3D layer.
    const t = window.setTimeout(() => document.body.classList.remove('toy-entering'), 3000);
    return () => {
      window.clearTimeout(t);
      document.body.classList.remove('toy-entering');
    };
  }, [phase]);
  return null;
}

export function TrainingWorld() {
  const kind = useWorldKind();
  const { pathname } = useLocation();
  return <Gate key={`${pathname}|${kind}`} kind={kind} />;
}
