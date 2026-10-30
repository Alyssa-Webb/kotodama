import { z } from 'zod';

const nonneg = z.number().nonnegative();
const DifficultyRules = z.object({
  hearts: z.number().int().positive().nullable(),
  refill: z.enum(['none', 'daily', 'hourly']),
  spoil: z.boolean(),
  kintsugi: z.boolean(),
  kintsugiTrial: z.boolean(),
  onigiri: z.boolean(),
  bossOncePerDay: z.boolean(),
});

export const DIFFICULTIES = ['casual', 'standard', 'hardcore', 'ironman'] as const;
export const DifficultySchema = z.enum(DIFFICULTIES);
export type Difficulty = z.infer<typeof DifficultySchema>;

/** Every reward, price, penalty and odd in the game (design/economy.json). */
export const EconomySchema = z.object({
  version: z.number().int(),
  xp: z.object({
    perCorrect: nonneg,
    comboBonusEvery: z.number().int().positive(),
    comboBonusXp: nonneg,
    dailyGoalOptions: z
      .array(z.object({ minutes: z.number().int().positive(), xp: z.number().int().positive() }))
      .min(1),
    defaultDailyGoalXp: z.number().int().positive(),
  }),
  kiai: z.object({
    fillAt: z.number().int().positive(),
    answers: z.number().int().positive(),
    multiplier: nonneg,
  }),
  stars: z.object({
    threeStarMaxMistakes: z.number().int().nonnegative(),
    twoStarMaxMistakes: z.number().int().nonnegative(),
  }),
  earn: z.object({
    lessonComplete: nonneg,
    lessonThreeStarBonus: nonneg,
    clearAllReviews: nonneg,
    dailyQuest: z.object({ min: nonneg, max: nonneg }),
    omikuji: z.record(z.string(), nonneg),
    rushPersonalBest: nonneg,
    bossDefeat: nonneg,
    bossDefeatTokens: nonneg,
    perfectLessonTokens: nonneg,
    clearReviewDebtTokens: nonneg,
    streakMilestones: z.array(z.object({ days: z.number().int().positive(), yen: nonneg })),
    guardianDailyYen: nonneg,
  }),
  penalties: z.object({
    reviewDebtYenFactor: z.number().min(0).max(1),
    hardcoreSpoilPerMissedDay: z.number().min(0).max(1),
    kintsugiWindowHours: nonneg,
  }),
  difficulty: z.record(DifficultySchema, DifficultyRules),
  /**
   * Persistent health (HP). Max HP grows with level; each mistake deals more damage the further
   * along the story the lesson is; HP only comes back from food (meals in town, onigiri).
   * The difficulty's `hearts` value scales max HP relative to 5 (Standard), so Ironman's 3 = 60%.
   */
  hp: z
    .object({
      base: z.number().int().positive(),
      perLevel: z.number().int().nonnegative(),
      xpPerLevel: z.number().int().positive(),
      damageBase: z.number().int().positive(),
      damagePerUnit: z.number().int().nonnegative(),
      onigiriHeal: z.number().int().positive(),
    })
    .default({
      base: 100,
      perLevel: 10,
      xpPerLevel: 300,
      damageBase: 10,
      damagePerUnit: 5,
      onigiriHeal: 15,
    }),
  hearts: z.object({
    refillMinutes: z.number().positive(),
    /** Dojo reviews per heart regained; 0 turns review healing off (food heals instead). */
    dojoReviewsPerHeart: z.number().int().nonnegative(),
  }),
  redemptionTrial: z.object({
    questions: z.number().int().positive(),
    maxMistakes: z.number().int().nonnegative(),
  }),
  boosts: z.object({
    taikoMinutes: nonneg,
    taikoXpMultiplier: nonneg,
    manekiLessons: z.number().int().nonnegative(),
    manekiYenBonus: nonneg,
  }),
  streakFreezeMax: z.number().int().nonnegative(),
  rush: z.object({
    seconds: z.number().int().positive(),
    misses: z.number().int().positive(),
    hourglassSeconds: z.number().int().nonnegative(),
    darumaLives: z.number().int().nonnegative(),
  }),
  boss: z.object({
    comboForDoubleHit: z.number().int().positive(),
    doubleHitDamage: z.number().int().positive(),
    hitDamage: z.number().int().positive(),
  }),
  charms: z.object({ gakugyoReviewXp: z.number().positive(), mimiListeningYen: nonneg }),
  /**
   * Testing only: a one-time grant added to every save (new or existing) on load. Set to 0
   * before launch.
   */
  testing: z.object({ grantTokens: z.number().int().nonnegative() }).default({ grantTokens: 0 }),
  gachapon: z.object({
    cost: z.number().int().positive(),
    pityAfter: z.number().int().positive(),
    odds: z
      .array(
        z.object({
          rarity: z.enum(['common', 'rare', 'legendary']),
          weight: z.number().positive(),
        }),
      )
      .min(1),
  }),
});
export type Economy = z.infer<typeof EconomySchema>;
export type DifficultyRules = z.infer<typeof DifficultyRules>;
