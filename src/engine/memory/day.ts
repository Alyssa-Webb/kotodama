/**
 * Game-day logic. The game day rolls over at `rolloverHour` local time (default 04:00), so a
 * late-night session still counts for "today". Computed on wall-clock fields in the device time
 * zone, which makes DST changes harmless (a 23- or 25-hour day is still one day).
 */
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
    formatters.set(timeZone, f);
  }
  return f;
}

/** Local wall-clock fields of an instant in a time zone. */
export function wallClock(
  ms: number,
  timeZone: string,
): { y: number; m: number; d: number; h: number; min: number } {
  const parts = Object.fromEntries(
    formatter(timeZone)
      .formatToParts(new Date(ms))
      .map((p) => [p.type, p.value]),
  );
  return {
    y: +parts.year!,
    m: +parts.month!,
    d: +parts.day!,
    h: +parts.hour! % 24,
    min: +parts.minute!,
  };
}

/** The game day ("YYYY-MM-DD") an instant belongs to. */
export function gameDay(ms: number, timeZone: string, rolloverHour = 4): string {
  const w = wallClock(ms, timeZone);
  const shifted = Date.UTC(w.y, w.m - 1, w.d, w.h, w.min) - rolloverHour * 3_600_000;
  return new Date(shifted).toISOString().slice(0, 10);
}

const dayMs = (day: string) => Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10));

/** Whole days from a to b (b − a). */
export function dayDiff(a: string, b: string): number {
  return Math.round((dayMs(b) - dayMs(a)) / 86_400_000);
}

export function addDays(day: string, n: number): string {
  return new Date(dayMs(day) + n * 86_400_000).toISOString().slice(0, 10);
}
