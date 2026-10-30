/** World content (ChatGPT designs it later): shop, districts, spirits, bosses, avatar parts. */
import { z } from 'zod';
import { FuriganaSchema } from './pack';

export const ConsumableIdSchema = z.enum([
  'kotatsu',
  'kintsugi',
  'chochin',
  'onigiri',
  'taiko',
  'maneki',
  'daruma',
  'sunadokei',
  'omamori',
  'ema',
]);
export type ConsumableId = z.infer<typeof ConsumableIdSchema>;

export const ShopSchema = z.object({
  version: z.number().int(),
  consumables: z.array(
    z.object({
      id: ConsumableIdSchema,
      name: FuriganaSchema,
      en: z.string(),
      /** What the word means, used when the name joins your reviews. */
      meaning: z.string(),
      effect: z.string(),
      price: z.number().int().nonnegative(),
      pricePerStreakDay: z.number().int().nonnegative().optional(),
      max: z.number().int().positive().optional(),
    }),
  ),
  charms: z.array(
    z.object({
      id: z.string(),
      name: FuriganaSchema,
      en: z.string(),
      perk: z.string(),
      price: z.number().int().nonnegative().optional(),
      unlock: z.string().optional(),
    }),
  ),
});
export type Shop = z.infer<typeof ShopSchema>;

export const DistrictSchema = z.object({
  id: z.string(),
  name: FuriganaSchema,
  en: z.string(),
  /** Which pack unit restores this district. */
  restoredBy: z.object({ packId: z.string(), unitId: z.string() }).optional(),
  /** Placeholder art: emoji-free SVG icon key, and map position (0-100). */
  icon: z.string(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});
export const DistrictsSchema = z.object({
  version: z.number().int(),
  districts: z.array(DistrictSchema).min(1),
});
export type District = z.infer<typeof DistrictSchema>;

export const SpiritSpeciesSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** Which items wake this species. */
  kinds: z.array(z.enum(['kana', 'word', 'phrase', 'pattern', 'sentence'])),
  tags: z.array(z.string()).optional(),
  hue: z.number().min(0).max(360),
});
export const SpiritsSchema = z.object({
  version: z.number().int(),
  species: z.array(SpiritSpeciesSchema).min(1),
});
export type SpiritSpecies = z.infer<typeof SpiritSpeciesSchema>;

export const BossSchema = z.object({
  id: z.string(),
  name: FuriganaSchema,
  en: z.string(),
  description: z.string(),
  hp: z.number().int().positive(),
  /** Phases switch the exercise style as HP drops (threshold = fraction of HP remaining). */
  phases: z
    .array(
      z.object({
        below: z.number().min(0).max(1),
        name: z.string(),
        types: z.array(z.string()).min(1),
        taunt: FuriganaSchema,
        tauntEn: z.string(),
      }),
    )
    .min(1),
  checkpoint: z.object({ packId: z.string(), nodeId: z.string() }).optional(),
  loot: z.object({ title: z.string().optional(), cosmetic: z.string().optional() }),
});
export const BossesSchema = z.object({ version: z.number().int(), bosses: z.array(BossSchema) });
export type Boss = z.infer<typeof BossSchema>;

export const AVATAR_SLOTS = [
  'base',
  'outfit',
  // Hair is its own slot (drawn over the outfit collar, under headgear) so players can restyle.
  'hair',
  'headgear',
  'held',
  'companion',
  'belt',
  'title',
  'charm',
] as const;
export const AvatarSlotSchema = z.enum(AVATAR_SLOTS);
export type AvatarSlot = z.infer<typeof AvatarSlotSchema>;

export const AvatarPartSchema = z.object({
  id: z.string(),
  slot: AvatarSlotSchema,
  name: FuriganaSchema,
  en: z.string(),
  price: z.number().int().nonnegative().optional(),
  /** How it is earned when it can't be bought. */
  unlock: z.string().optional(),
  /** Placeholder art: inline SVG fragment drawn in a 0 0 100 120 box, using currentColor and CSS vars. */
  svg: z.string(),
  /** The same part seen from behind (battle walks); falls back to `svg` when missing. */
  back: z.string().optional(),
  free: z.boolean().optional(),
  /** Present when the part can drop from the gachapon. */
  gacha: z.enum(['common', 'rare', 'legendary']).optional(),
  /**
   * Base parts only: where the face sits, so the avatar can change expression (happy, worried,
   * cheering) by drawing a mood face over the neutral one.
   */
  face: z
    .object({
      skin: z.string(),
      cx: z.number(),
      eyeY: z.number(),
      eyeDx: z.number(),
      mouthY: z.number(),
    })
    .optional(),
});
export const AvatarSchema = z.object({
  version: z.number().int(),
  parts: z.array(AvatarPartSchema),
});
export type AvatarPart = z.infer<typeof AvatarPartSchema>;
