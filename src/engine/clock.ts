/** Time is injected so streaks, hearts and reviews are testable. Apps pass the real clock. */
export interface Clock {
  /** Milliseconds since the Unix epoch. */
  now(): number;
  /** IANA time zone of the device, e.g. "Asia/Tokyo". */
  timeZone(): string;
}

export function fixedClock(
  ms: number,
  timeZone = 'UTC',
): Clock & { set(ms: number): void; tz(z: string): void } {
  let t = ms;
  let zone = timeZone;
  return {
    now: () => t,
    timeZone: () => zone,
    set: (v: number) => (t = v),
    tz: (z: string) => (zone = z),
  };
}
