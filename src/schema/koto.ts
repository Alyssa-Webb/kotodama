import { z } from 'zod';
import { FuriganaSchema } from './pack';

/** Koto the mascot's lines (world/koto.json): Japanese with furigana, plus English. */
export const KotoLineSchema = z.object({ ja: FuriganaSchema, en: z.string().min(1) });

export const KotoSchema = z.object({
  version: z.number().int().positive(),
  shop: z.array(KotoLineSchema).min(1),
  town: z.array(KotoLineSchema).min(1),
  tour: z
    .array(
      KotoLineSchema.extend({
        /** CSS selector of what Koto points at. */
        target: z.string().min(1),
        outfit: z.enum(['guide', 'shopkeeper', 'mayor', 'sensei']),
        pose: z.enum(['idle', 'wave', 'point', 'talk', 'cheer', 'think', 'surprised', 'sleep']),
      }),
    )
    .min(1),
});
export type Koto = z.infer<typeof KotoSchema>;
export type KotoLine = z.infer<typeof KotoLineSchema>;
