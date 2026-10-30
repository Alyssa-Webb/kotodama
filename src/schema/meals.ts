import { z } from 'zod';
import { FuriganaSchema } from './pack';

/** Town meals (world/meals.json): the only way to heal HP. Prices are realistic yen. */
export const MealSchema = z.object({
  id: z.string().min(1),
  name: FuriganaSchema,
  en: z.string().min(1),
  price: z.number().int().positive(),
  heal: z.number().int().positive(),
  /** Player level that unlocks it. */
  level: z.number().int().positive(),
  vendor: z.string().min(1),
});
export type Meal = z.infer<typeof MealSchema>;

export const MealsSchema = z.object({
  version: z.number().int().positive(),
  meals: z.array(MealSchema).min(1),
});
