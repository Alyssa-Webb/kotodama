import { useGame } from '../foundations/store/gameStore';

const TEXT: Record<string, (n?: number) => string> = {
  'streak-frozen': (n) =>
    `Your kotatsu kept your streak warm through ${n} missed day${n === 1 ? '' : 's'}.`,
  'streak-lost': () => 'Your streak went cold. Kintsugi can mend it within 48 hours (Shop).',
  'yen-spoiled': (n) => `Hardcore: ${n} yen spoiled while you were away.`,
  'hearts-refilled': () => 'A new day: your hearts are full again.',
};

export function Notices() {
  const notices = useGame((s) => s.notices);
  const dismiss = useGame((s) => s.dismissNotices);
  if (!notices.length) return null;
  return (
    <div className="banner" role="status" style={{ marginBottom: 'var(--sp-4)' }}>
      <div className="stack" style={{ gap: 'var(--sp-1)', flex: 1 }}>
        {notices.map((n, i) => (
          <p key={i}>{TEXT[n.kind]?.(n.amount)}</p>
        ))}
      </div>
      <button className="btn btn-small btn-ghost" onClick={dismiss}>
        OK
      </button>
    </div>
  );
}
