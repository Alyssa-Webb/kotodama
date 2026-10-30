import { z } from 'zod';

const color = z.string().min(1);

export const ColorSetSchema = z.object({
  bg: color,
  surface: color,
  surfaceAlt: color,
  ink: color,
  inkMuted: color,
  border: color,
  accent: color,
  accentInk: color,
  accentSoft: color,
  secondary: color,
  secondaryInk: color,
  secondarySoft: color,
  gold: color,
  goldSoft: color,
  success: color,
  successSoft: color,
  danger: color,
  dangerSoft: color,
  fog: color,
  focus: color,
  shadow: color,
});

export const ThemeTokensSchema = z.object({
  name: z.string(),
  version: z.number().int().positive(),
  colors: z.object({ light: ColorSetSchema, dark: ColorSetSchema }),
  fonts: z.object({ ui: z.string(), display: z.string(), mono: z.string() }),
  typeScale: z.record(z.string(), z.string()),
  spacing: z.record(z.string(), z.string()),
  radii: z.record(z.string(), z.string()),
  motion: z.object({
    fast: z.number().nonnegative(),
    base: z.number().nonnegative(),
    slow: z.number().nonnegative(),
    celebrate: z.number().nonnegative(),
    easing: z.string(),
  }),
});
export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;
export type ColorSet = z.infer<typeof ColorSetSchema>;

export const ANIMATION_SLOTS = [
  'answer.correct',
  'answer.incorrect',
  'combo.up',
  'lesson.complete',
  'node.unlock',
  'streak.extend',
  'level.up',
  'mascot.idle',
] as const;
export type AnimationSlot = (typeof ANIMATION_SLOTS)[number];

export const FallbackAnimationSchema = z.enum(['pulse', 'shake', 'pop', 'rise', 'float', 'none']);
export type FallbackAnimation = z.infer<typeof FallbackAnimationSchema>;

export const AnimationsSchema = z.object({
  version: z.number().int().positive(),
  slots: z.partialRecord(
    z.enum(ANIMATION_SLOTS),
    z.object({
      /** Path under design/animations/ to a Lottie JSON file (optional). */
      lottie: z.string().optional(),
      fallback: FallbackAnimationSchema,
    }),
  ),
});
export type Animations = z.infer<typeof AnimationsSchema>;
