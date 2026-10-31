/** Today's goal as a paper lantern: its light fills from the bottom as XP comes in. */
export function GoalLantern({ pct }: { pct: number }) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <span className="goal-lantern" role="img" aria-label={`Daily goal ${p}%`}>
      <span className="goal-lantern-fill" style={{ transform: `scaleY(${p / 100})` }} />
    </span>
  );
}
