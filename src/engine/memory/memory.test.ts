import { describe, expect, it } from 'vitest';
import { addDays, dayDiff, gameDay } from './day';
import { createScheduler, gradeFor, isDue } from './scheduler';

const at = (iso: string) => Date.parse(iso);

describe('gameDay', () => {
  it('rolls over at 04:00 local time, not midnight', () => {
    expect(gameDay(at('2026-03-10T23:59:00Z'), 'UTC')).toBe('2026-03-10');
    expect(gameDay(at('2026-03-11T00:30:00Z'), 'UTC')).toBe('2026-03-10');
    expect(gameDay(at('2026-03-11T03:59:00Z'), 'UTC')).toBe('2026-03-10');
    expect(gameDay(at('2026-03-11T04:01:00Z'), 'UTC')).toBe('2026-03-11');
  });
  it('honors a configurable rollover hour, including midnight', () => {
    expect(gameDay(at('2026-03-11T00:30:00Z'), 'UTC', 0)).toBe('2026-03-11');
    expect(gameDay(at('2026-03-11T05:30:00Z'), 'UTC', 6)).toBe('2026-03-10');
  });
  it('uses the device time zone', () => {
    // 2026-03-10 20:00 UTC = 2026-03-11 05:00 in Tokyo
    expect(gameDay(at('2026-03-10T20:00:00Z'), 'Asia/Tokyo')).toBe('2026-03-11');
    expect(gameDay(at('2026-03-10T20:00:00Z'), 'America/New_York')).toBe('2026-03-10');
  });
  it('survives DST spring-forward (US: 2026-03-08, 02:00 → 03:00)', () => {
    const tz = 'America/New_York';
    // 03:59 EDT on the DST day is still the previous game day; 04:01 EDT is the new one
    expect(gameDay(at('2026-03-08T07:59:00Z'), tz)).toBe('2026-03-07');
    expect(gameDay(at('2026-03-08T08:01:00Z'), tz)).toBe('2026-03-08');
  });
  it('survives DST fall-back (US: 2026-11-01, 02:00 → 01:00)', () => {
    const tz = 'America/New_York';
    // 01:30 happens twice; both belong to the previous game day; 04:01 EST is the new day
    expect(gameDay(at('2026-11-01T05:30:00Z'), tz)).toBe('2026-10-31');
    expect(gameDay(at('2026-11-01T06:30:00Z'), tz)).toBe('2026-10-31');
    expect(gameDay(at('2026-11-01T09:01:00Z'), tz)).toBe('2026-11-01');
    expect(gameDay(at('2026-11-01T08:59:00Z'), tz)).toBe('2026-10-31');
  });
  it('day arithmetic', () => {
    expect(dayDiff('2026-02-27', '2026-03-01')).toBe(2);
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(dayDiff('2026-03-07', '2026-03-09')).toBe(2); // across DST is still whole days
  });
});

describe('gradeFor', () => {
  it('maps correctness, hints and time to FSRS grades', () => {
    const base = { correct: true, typo: false, hints: 0, ms: 4000, shape: 'choose' as const };
    expect(gradeFor({ ...base, correct: false })).toBe('again');
    expect(gradeFor({ ...base, hints: 1 })).toBe('hard');
    expect(gradeFor({ ...base, typo: true })).toBe('hard');
    expect(gradeFor({ ...base, ms: 20_000 })).toBe('hard');
    expect(gradeFor({ ...base, ms: 1000 })).toBe('easy');
    expect(gradeFor(base)).toBe('good');
  });
});

describe('scheduler (FSRS-6)', () => {
  it('schedules a correct card later than a failed one and survives JSON round-trips', async () => {
    const s = await createScheduler();
    const t0 = at('2026-01-01T00:00:00Z');
    const good = s.review(undefined, 'good', t0);
    const again = s.review(undefined, 'again', t0);
    expect(good.dueAt).toBeGreaterThan(again.dueAt);
    const roundTrip = JSON.parse(JSON.stringify(good));
    const next = s.review(roundTrip, 'good', good.dueAt);
    expect(next.dueAt).toBeGreaterThan(good.dueAt);
    expect(next.reps).toBe(2);
    expect(isDue(next, next.dueAt)).toBe(true);
    expect(isDue(next, next.dueAt - 1)).toBe(false);
  });
  it('retrievability decays over time', async () => {
    const s = await createScheduler();
    const t0 = at('2026-01-01T00:00:00Z');
    let c = s.review(undefined, 'good', t0);
    c = s.review(c, 'good', c.dueAt);
    const soon = s.retrievability(c, c.lastReviewAt! + 86_400_000);
    const later = s.retrievability(c, c.lastReviewAt! + 30 * 86_400_000);
    expect(soon).toBeGreaterThan(later);
    expect(later).toBeGreaterThan(0);
  });
});
