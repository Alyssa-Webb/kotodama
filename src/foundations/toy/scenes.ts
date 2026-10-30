/** Which world each training opens into. three.js-free so screens can import it eagerly. */
import type { ToyScene } from '../../schema/toys';

/** Training kind → world, from design/toys.json. Lessons rotate by unit so units feel distinct. */
export function worldFor(
  scenes: { lesson: ToyScene[]; dojo: ToyScene; boss: ToyScene; rush: ToyScene },
  kind: 'lesson' | 'dojo' | 'boss' | 'rush',
  unitIndex = 0,
): ToyScene {
  if (kind !== 'lesson') return scenes[kind];
  return scenes.lesson[Math.abs(unitIndex) % scenes.lesson.length]!;
}
