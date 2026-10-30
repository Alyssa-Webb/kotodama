/** Town tycoon data: each restored district runs a business staffed by your word-spirits. */
import { z } from 'zod';
import { FuriganaSchema } from './pack';

export const RarityIdSchema = z.enum(['common', 'rare', 'epic', 'legendary']);
export type RarityId = z.infer<typeof RarityIdSchema>;

export const BuildingSchema = z.object({
  /** The district (world/districts.json) this business stands in. */
  district: z.string(),
  en: z.string(),
  product: z.object({ en: z.string(), ja: FuriganaSchema }),
  /** Yen per hour per unit of staff power at level 1. */
  yenPerHour: z.number().positive(),
  /** Spirit species (world/spirits.json) that work here best. */
  affinity: z.array(z.string()),
  /** Names for the staff slots, in order. */
  roles: z.array(z.string()).min(1),
  upgradeBase: z.number().int().positive(),
  upgradeGrowth: z.number().min(1),
  maxLevel: z.number().int().min(1),
});
export type Building = z.infer<typeof BuildingSchema>;

export const BuildingsSchema = z.object({
  version: z.number().int(),
  /** Income piles up while you are away, up to this many hours. */
  capHours: z.number().positive(),
  /** Output multiplier for a spirit whose species matches the building. */
  affinityBonus: z.number().min(1),
  maxStaff: z.number().int().min(1),
  rarities: z
    .array(
      z.object({
        id: RarityIdSchema,
        en: z.string(),
        weight: z.number().nonnegative(),
        power: z.number().positive(),
      }),
    )
    .length(4),
  /** Work skill by memory stage: a word you're forgetting works badly. */
  skill: z.object({
    egg: z.number(),
    sprite: z.number(),
    guardian: z.number(),
    fading: z.number(),
    lost: z.number(),
  }),
  buildings: z.array(BuildingSchema).min(1),
});
export type Buildings = z.infer<typeof BuildingsSchema>;

/** Per-save state of the town's businesses. */
export const TownStateSchema = z.object({
  buildings: z.record(
    z.string(),
    z.object({
      level: z.number().int().min(1),
      /** Item ids of the spirits staffing each slot (null = empty). */
      staff: z.array(z.string().nullable()),
      /** When income was last banked (collected, restaffed or upgraded). */
      collectedAt: z.number(),
    }),
  ),
});
export type TownState = z.infer<typeof TownStateSchema>;
