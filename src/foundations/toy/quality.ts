/**
 * Device quality tiers and the frame-time governor. Smoothness is the contract: when frames run
 * long the governor sheds resolution first, then effects (a lower tier), and only climbs back
 * after a sustained run of fast frames. Pure functions so the policy is unit-tested; the stage
 * feeds it real frame times. The learned tier is per device (localStorage), never in the save:
 * restoring an iPhone backup on a Mac must not drag the Mac down to phone settings.
 */

export type Tier = 0 | 1 | 2 | 3;
export const TIER_NAMES = ['low', 'medium', 'high', 'ultra'] as const;

export interface TierSettings {
  /** Upper bound on the device pixel ratio used for the 3D canvas. */
  dprCap: number;
  /** Clearcoat physical plastic (true) or the cheaper standard material. */
  physical: boolean;
  /** Real-time contact shadows. */
  shadows: boolean;
  /** Multiplier on particle and instance counts. */
  particles: number;
  /** Noise-shader fog (true) or plain fading sprites. */
  shaderFog: boolean;
  /** Whether long 3D sequences play at all (low tier gets short 2D-feeling versions). */
  fullSequences: boolean;
}

export const TIERS: Record<Tier, TierSettings> = {
  0: {
    dprCap: 1,
    physical: false,
    shadows: false,
    particles: 0.35,
    shaderFog: false,
    fullSequences: false,
  },
  1: {
    dprCap: 1.5,
    physical: false,
    shadows: false,
    particles: 0.6,
    shaderFog: true,
    fullSequences: true,
  },
  2: {
    dprCap: 2,
    physical: true,
    shadows: true,
    particles: 1,
    shaderFog: true,
    fullSequences: true,
  },
  3: {
    dprCap: 3,
    physical: true,
    shadows: true,
    particles: 1.4,
    shaderFog: true,
    fullSequences: true,
  },
};

export interface DeviceHints {
  gpu: string;
  cores: number;
  memoryGb: number | undefined;
  mobile: boolean;
}

/** First guess before any frame has been measured. The governor corrects it within seconds. */
export function guessTier(h: DeviceHints): Tier {
  const gpu = h.gpu.toLowerCase();
  if (/swiftshader|llvmpipe|software|basic render/.test(gpu)) return 0;
  if (h.memoryGb !== undefined && h.memoryGb <= 2) return 0;
  if (/apple/.test(gpu)) return h.mobile ? 2 : 3;
  if (/nvidia|radeon|rtx|gtx|arc/.test(gpu) && !h.mobile) return 3;
  if (/adreno \(tm\) [5-6]\d\d|mali-g[5-7]\d|powervr/.test(gpu)) return 1;
  if (h.mobile) return h.cores >= 8 ? 2 : 1;
  return 2;
}

export interface GovernorState {
  tier: Tier;
  /** Highest tier this device may climb back to. */
  ceiling: Tier;
  /** Resolution scale within the tier, 0.6–1. */
  scale: number;
  /** Frame budget in ms, from the display's measured refresh rate. */
  budget: number;
  slowWindows: number;
  fastWindows: number;
}

export function initialGovernor(tier: Tier, ceiling: Tier = 3): GovernorState {
  return { tier, ceiling, scale: 1, budget: 1000 / 60, slowWindows: 0, fastWindows: 0 };
}

const SCALE_STEPS = [1, 0.85, 0.7, 0.6];

export function percentile(samples: readonly number[], p: number): number {
  if (!samples.length) return 0;
  const sorted = [...samples].sort((a, b) => a - b);
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[i]!;
}

/** Refresh interval from the fastest steady frames (60, 90, 120 Hz all snap correctly). */
export function measureBudget(samples: readonly number[]): number {
  const fast = percentile(samples, 20);
  let best = 1000 / 60;
  for (const hz of [144, 120, 90, 60, 30])
    if (Math.abs(fast - 1000 / hz) < Math.abs(fast - best)) best = 1000 / hz;
  return best;
}

/**
 * One governor step per window of ~60 frames. A frame "misses" when it takes more than 1.5
 * budgets (a visible stutter). Two slow windows in a row step down; eight fast windows step up,
 * so quality never oscillates.
 */
export function govern(s: GovernorState, windowMs: readonly number[]): GovernorState {
  if (windowMs.length < 20) return s;
  const p95 = percentile(windowMs, 95);
  const slow = p95 > s.budget * 1.5;
  const fast = p95 < s.budget * 1.15;
  if (slow) {
    const slowWindows = s.slowWindows + 1;
    if (slowWindows < 2) return { ...s, slowWindows, fastWindows: 0 };
    const si = SCALE_STEPS.indexOf(s.scale);
    if (si >= 0 && si < SCALE_STEPS.length - 1)
      return { ...s, scale: SCALE_STEPS[si + 1]!, slowWindows: 0, fastWindows: 0 };
    if (s.tier > 0)
      return { ...s, tier: (s.tier - 1) as Tier, scale: 1, slowWindows: 0, fastWindows: 0 };
    return { ...s, slowWindows: 0, fastWindows: 0 };
  }
  if (fast) {
    const fastWindows = s.fastWindows + 1;
    if (fastWindows < 8) return { ...s, fastWindows, slowWindows: 0 };
    const si = SCALE_STEPS.indexOf(s.scale);
    if (si > 0) return { ...s, scale: SCALE_STEPS[si - 1]!, slowWindows: 0, fastWindows: 0 };
    if (s.tier < s.ceiling)
      return { ...s, tier: (s.tier + 1) as Tier, scale: 0.85, slowWindows: 0, fastWindows: 0 };
    return { ...s, slowWindows: 0, fastWindows: 0 };
  }
  return { ...s, slowWindows: 0, fastWindows: 0 };
}

const KEY = 'kotodama.quality.v1';

export interface StoredQuality {
  tier: Tier;
  ceiling: Tier;
  /** Player override: 'auto' lets the governor decide. */
  mode: 'auto' | Tier;
}

export function loadQuality(): StoredQuality | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<StoredQuality>;
    const isTier = (t: unknown): t is Tier => t === 0 || t === 1 || t === 2 || t === 3;
    if (!isTier(v.tier) || !isTier(v.ceiling)) return null;
    return { tier: v.tier, ceiling: v.ceiling, mode: isTier(v.mode) ? v.mode : 'auto' };
  } catch {
    return null;
  }
}

export function storeQuality(q: StoredQuality) {
  try {
    localStorage.setItem(KEY, JSON.stringify(q));
  } catch {
    /* private mode or blocked storage: the governor re-learns next launch */
  }
}
