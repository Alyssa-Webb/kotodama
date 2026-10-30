import { z } from 'zod';

const color = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'a #rrggbb color');

/** Named colors every procedural toy model paints with (light and dark variants). */
export const ToyPaletteSchema = z.object({
  skyTop: color,
  skyBottom: color,
  fog: color,
  ground: color,
  groundEdge: color,
  bambooLight: color,
  bambooDark: color,
  leaf: color,
  leafDeep: color,
  bush: color,
  bushDeep: color,
  vermilion: color,
  wood: color,
  woodDark: color,
  roof: color,
  paper: color,
  ink: color,
  gold: color,
  stone: color,
  lanternGlow: color,
  white: color,
  matcha: color,
  indigo: color,
  sakura: color,
});
export type ToyPalette = z.infer<typeof ToyPaletteSchema>;
export type PaletteColor = keyof ToyPalette;

export const ToyScenesSchema = z.enum(['grove', 'dojo', 'shrine']);
export type ToyScene = z.infer<typeof ToyScenesSchema>;

export const ToysSchema = z.object({
  version: z.number().int().positive(),
  palette: z.object({ light: ToyPaletteSchema, dark: ToyPaletteSchema }),
  /** The plastic look: shared by every model. */
  plastic: z.object({
    roughness: z.number().min(0).max(1),
    clearcoat: z.number().min(0).max(1),
    clearcoatRoughness: z.number().min(0).max(1),
    envIntensity: z.number().min(0).max(4),
  }),
  /** Training-start sequence timings in ms (full tier; low tier runs at `lowTierSpeed`×). */
  gate: z.object({
    duration: z.number().int().positive(),
    fadeOut: z.number().int().nonnegative(),
    lowTierSpeed: z.number().positive(),
  }),
  /** Which scene each kind of training opens into. */
  scenes: z.object({
    lesson: z.array(ToyScenesSchema).min(1),
    dojo: ToyScenesSchema,
    boss: ToyScenesSchema,
    rush: ToyScenesSchema,
  }),
  rarity: z.object({ common: color, rare: color, legendary: color }),
});
export type Toys = z.infer<typeof ToysSchema>;
