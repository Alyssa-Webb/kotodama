import { z } from 'zod';

export const GateSceneSchema = z.enum(['grove', 'shrine', 'dojo']);
export type GateScene = z.infer<typeof GateSceneSchema>;

/** Timings and choices for the full-screen 2D moments (design/moments.json). */
export const MomentsSchema = z.object({
  version: z.number().int().positive(),
  /** Training start: bushes part, mist clears, the avatar walks in. */
  gate: z.object({
    duration: z.number().int().positive(),
    fadeOut: z.number().int().nonnegative(),
  }),
  /** Training finished: noren curtains drop, 完 is brushed on, curtains lift onto the results. */
  finish: z.object({ duration: z.number().int().positive() }),
  /** Battle lessons: correct answers needed to defeat each road enemy. */
  battle: z.object({ hitsPerEnemy: z.number().int().positive() }).default({ hitsPerEnemy: 3 }),
  /** Gachapon capsule opens by itself after this long if nobody taps it. */
  capsule: z.object({ autoOpen: z.number().int().positive() }),
  /** Which scene each kind of training opens into. Lessons rotate by unit. */
  scenes: z.object({
    lesson: z.array(GateSceneSchema).min(1),
    dojo: GateSceneSchema,
    boss: GateSceneSchema,
    rush: GateSceneSchema,
  }),
});
export type Moments = z.infer<typeof MomentsSchema>;
