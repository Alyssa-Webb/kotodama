import { z } from 'zod';

/** One human verdict on a piece of art, so briefs can point at real examples rather than prose. */
export const ArtVerdict = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  verdict: z.enum(['approved', 'rejected']),
  // Only people judge taste here: an AI's opinion of its own art doesn't count.
  by: z.enum(['Ken', 'Alyssa']),
  date: z.iso.date(),
  /** Their words, verbatim, when we have them. */
  quote: z.string().min(1).optional(),
  why: z.string().min(1),
  /** Where the verdict is recorded, when it isn't from a direct quote. */
  source: z.string().min(1).optional(),
  /** Paths in this repository; a test checks that they exist. */
  files: z.array(z.string().min(1)).default([]),
  /** Git branches holding art that was never merged. */
  branches: z.array(z.string().min(1)).default([]),
});

export const ArtLedger = z.object({ entries: z.array(ArtVerdict) });

export type ArtVerdict = z.infer<typeof ArtVerdict>;
export type ArtLedger = z.infer<typeof ArtLedger>;
