/**
 * Seeded RNG (mulberry32). The whole state is one 32-bit integer, so it can be stored in the
 * save file (gachapon, distractor shuffles) and replayed exactly in tests.
 */
export class Rng {
  constructor(private s: number) {
    this.s = s >>> 0;
  }
  get state(): number {
    return this.s;
  }
  /** Float in [0, 1). */
  next(): number {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(maxExclusive: number): number {
    return Math.floor(this.next() * maxExclusive);
  }
  pick<T>(xs: readonly T[]): T {
    if (!xs.length) throw new Error('pick from empty list');
    return xs[this.int(xs.length)]!;
  }
  shuffle<T>(xs: readonly T[]): T[] {
    const a = [...xs];
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.int(i + 1);
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
    return a;
  }
}

/** Derives a seed from a string (FNV-1a), e.g. for per-exercise deterministic shuffles. */
export function seedFrom(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
