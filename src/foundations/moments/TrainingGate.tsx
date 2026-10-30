/**
 * Mounted around every full-screen training (lessons, Dojo reviews, rushes, bosses, trials):
 * plays the gate for the route's scene, hides the UI while it plays (`m-entering` on <body>),
 * then lets it drop in (`m-entered`) on the frame the gate hands over.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import type { GateScene, Moments } from '../../schema/moments';
import { nodeKey } from '../../engine/pack/index';
import { useGame } from '../store/gameStore';
import { fx } from '../fx/fx';
import { momentsConfig } from '../world';
import { moments } from './moments';

export function sceneFor(
  scenes: Moments['scenes'],
  kind: 'lesson' | 'dojo' | 'boss' | 'rush',
  unitIndex = 0,
): GateScene {
  if (kind !== 'lesson') return scenes[kind];
  return scenes.lesson[Math.abs(unitIndex) % scenes.lesson.length]!;
}

function useScene(): GateScene {
  const { pathname } = useLocation();
  const index = useGame((s) => s.index);
  const [, root, a, b] = pathname.split('/');
  const s = momentsConfig.scenes;
  if (root === 'lesson' && a && b)
    return sceneFor(
      s,
      'lesson',
      index.node(nodeKey(decodeURIComponent(a), decodeURIComponent(b)))?.unitIndex ?? 0,
    );
  if (root === 'boss') return sceneFor(s, 'boss');
  if (root === 'rush') return sceneFor(s, 'rush');
  return sceneFor(s, 'dojo');
}

function Gate({ scene }: { scene: GateScene }) {
  useEffect(() => {
    const body = document.body.classList;
    let live = true;
    let settle = 0;
    body.add('m-entering');
    fx.slot('lesson.start');
    const enter = () => {
      if (!live) return;
      body.remove('m-entering');
      body.add('m-entered');
      settle = window.setTimeout(() => body.remove('m-entered'), 800);
    };
    void moments.gate(scene).then(enter);
    // Never leave the UI hidden, whatever happens to the animation.
    const safety = window.setTimeout(enter, momentsConfig.gate.duration + 1500);
    return () => {
      live = false;
      window.clearTimeout(safety);
      window.clearTimeout(settle);
      body.remove('m-entering', 'm-entered');
    };
  }, [scene]);
  return null;
}

export function TrainingGate() {
  const scene = useScene();
  const { pathname } = useLocation();
  return <Gate key={`${pathname}|${scene}`} scene={scene} />;
}
