/**
 * The two guides as animated SVG busts. They breathe, blink and react: happy (correct), worried
 * (wrong), cheer (Kiai / completion), idle. Placeholder art until ChatGPT's character art arrives.
 */
import './art.css';

export type Mood = 'idle' | 'happy' | 'worried' | 'cheer';

interface GuideProps {
  who: 'akari' | 'tetsu';
  mood?: Mood;
  size?: number;
}

function Eyes({ mood, x1, x2, y }: { mood: Mood; x1: number; x2: number; y: number }) {
  if (mood === 'happy' || mood === 'cheer')
    return (
      <g stroke="var(--c-ink)" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d={`M${x1 - 4} ${y + 1}q4 -5 8 0`} />
        <path d={`M${x2 - 4} ${y + 1}q4 -5 8 0`} />
      </g>
    );
  return (
    <g className="blink" style={{ transformOrigin: `60px ${y}px` }}>
      <ellipse cx={x1} cy={y} rx="2.6" ry="3.4" fill="var(--c-ink)" />
      <ellipse cx={x2} cy={y} rx="2.6" ry="3.4" fill="var(--c-ink)" />
      <circle cx={x1 + 0.9} cy={y - 1.2} r=".9" fill="var(--c-panel)" />
      <circle cx={x2 + 0.9} cy={y - 1.2} r=".9" fill="var(--c-panel)" />
    </g>
  );
}

function Brows({ mood, x1, x2, y }: { mood: Mood; x1: number; x2: number; y: number }) {
  const t = mood === 'worried' ? 3 : mood === 'cheer' ? -1.5 : 0;
  return (
    <g stroke="var(--c-ink)" strokeWidth="1.8" strokeLinecap="round">
      <path d={`M${x1 - 5} ${y - t}L${x1 + 4} ${y + t * 0.3}`} />
      <path d={`M${x2 + 5} ${y - t}L${x2 - 4} ${y + t * 0.3}`} />
    </g>
  );
}

function Mouth({ mood, y }: { mood: Mood; y: number }) {
  if (mood === 'cheer')
    return (
      <path
        d={`M53 ${y}q7 9 14 0Z`}
        fill="var(--c-lacquer)"
        stroke="var(--c-ink)"
        strokeWidth="1.2"
      />
    );
  if (mood === 'happy')
    return (
      <path
        d={`M54 ${y}q6 5 12 0`}
        stroke="var(--c-ink)"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    );
  if (mood === 'worried')
    return (
      <path
        d={`M55 ${y + 3}q5 -4 10 0`}
        stroke="var(--c-ink)"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    );
  return (
    <path
      d={`M56 ${y + 1}q4 2 8 0`}
      stroke="var(--c-ink)"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
  );
}

export function Guide({ who, mood = 'idle', size = 96 }: GuideProps) {
  const skin = 'var(--c-skin)';
  return (
    <svg
      viewBox="0 0 120 130"
      width={size}
      height={(size * 130) / 120}
      className={`guide guide-${mood}`}
      role="img"
      aria-label={`${who === 'akari' ? 'Akari' : 'Tetsu'} looks ${mood}`}
    >
      <g className="breathe" style={{ transformOrigin: '60px 130px' }}>
        {who === 'akari' ? (
          <>
            {/* hair back + bun */}
            <circle cx="60" cy="22" r="13" fill="var(--c-ink)" />
            <path d="M58 12 L84 2" stroke="var(--c-gold)" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="84" cy="2.5" r="3.4" fill="var(--c-accent)" />
            <path
              d="M30 62c0-26 12-40 30-40s30 14 30 40c0 10-4 18-6 22H36c-2-4-6-12-6-22Z"
              fill="var(--c-ink)"
            />
            {/* kimono */}
            <path d="M18 130c2-26 16-40 42-40s40 14 42 40Z" fill="var(--c-secondary)" />
            <path d="M44 92 60 118 76 92" fill="var(--c-panel)" />
            <path d="M47 92 60 112 73 92" fill="var(--c-accent)" />
            <path d="M22 122q18-6 38-4t38 4" stroke="var(--c-gold)" strokeWidth="2" fill="none" />
            {[30, 86, 40, 78].map((x, i) => (
              <circle key={i} cx={x} cy={104 + (i % 2) * 12} r="2.2" fill="var(--c-petal)" />
            ))}
            {/* neck + face */}
            <rect x="53" y="76" width="14" height="16" rx="5" fill={skin} />
            <ellipse cx="60" cy="58" rx="22" ry="25" fill={skin} />
            {/* fringe */}
            <path
              d="M37 52c3-18 12-26 23-26s20 8 23 26c-6-8-12-12-16-12-3 5-8 8-14 8-6 0-11-2-16 4Z"
              fill="var(--c-ink)"
            />
            <Brows mood={mood} x1={51} x2={69} y={51} />
            <Eyes mood={mood} x1={51} x2={69} y={59} />
            <ellipse
              cx="46"
              cy="67"
              rx="4"
              ry="2.2"
              fill="var(--c-petal)"
              opacity={mood === 'happy' || mood === 'cheer' ? 0.85 : 0.4}
            />
            <ellipse
              cx="74"
              cy="67"
              rx="4"
              ry="2.2"
              fill="var(--c-petal)"
              opacity={mood === 'happy' || mood === 'cheer' ? 0.85 : 0.4}
            />
            <Mouth mood={mood} y={71} />
            {/* lantern in hand */}
            <g className="sway" style={{ transformOrigin: '98px 86px' }}>
              <path d="M98 80v6" stroke="var(--c-ink)" strokeWidth="1.2" />
              <ellipse cx="98" cy="96" rx="9" ry="10" fill="var(--c-accent)" />
              <ellipse
                cx="98"
                cy="96"
                rx="4.5"
                ry="6"
                fill="var(--c-glow)"
                opacity=".7"
                className="lantern-glow"
              />
              <rect x="93" y="85" width="10" height="2.4" fill="var(--c-ink)" />
              <rect x="93" y="105" width="10" height="2.4" fill="var(--c-ink)" />
            </g>
          </>
        ) : (
          <>
            {/* straw hat on the back */}
            <path d="M8 40 60 14l52 26c-20 6-84 6-104 0Z" fill="var(--c-gold)" opacity=".85" />
            <path
              d="M8 40c20 6 84 6 104 0"
              stroke="color-mix(in srgb, var(--c-gold) 50%, var(--c-ink))"
              strokeWidth="1.2"
              fill="none"
            />
            {/* haori */}
            <path d="M14 130c3-28 18-42 46-42s43 14 46 42Z" fill="var(--c-ink)" />
            <path d="M44 90 60 122 76 90" fill="var(--c-surface-alt)" />
            <path d="M48 90 60 114 72 90" fill="var(--c-ink-muted)" />
            <path d="M24 98q36 14 72 0" stroke="var(--c-lacquer)" strokeWidth="6" fill="none" />
            {/* sword hilt over shoulder */}
            <path d="M92 76 106 56" stroke="var(--c-ink)" strokeWidth="5" strokeLinecap="round" />
            <path d="M88 82 96 72" stroke="var(--c-gold)" strokeWidth="3" />
            {/* neck + face */}
            <rect x="52" y="74" width="16" height="18" rx="5" fill={skin} />
            <path
              d="M37 56c0-16 10-28 23-28s23 12 23 28c0 16-10 28-23 28S37 72 37 56Z"
              fill={skin}
            />
            {/* hair + topknot */}
            <path
              d="M36 54c0-18 10-28 24-28s24 10 24 28c-4-8-10-13-24-13s-20 5-24 13Z"
              fill="var(--c-ink)"
            />
            <path d="M56 26c0-6 8-6 8 0l-1 4h-6Z" fill="var(--c-ink)" />
            {/* stubble */}
            <path
              d="M42 66c4 14 32 14 36 0-2 12-8 18-18 18s-16-6-18-18Z"
              fill="var(--c-ink)"
              opacity=".18"
            />
            <Brows mood={mood} x1={51} x2={69} y={50} />
            <Eyes mood={mood} x1={51} x2={69} y={57} />
            {/* scar */}
            <path d="M72 50l4 10" stroke="var(--c-lacquer)" strokeWidth="1.2" opacity=".6" />
            <Mouth mood={mood} y={70} />
          </>
        )}
        {mood === 'worried' && (
          <path
            d="M84 40q4 6 0 9q-4-3 0-9Z"
            fill="var(--c-secondary-soft)"
            stroke="var(--c-secondary)"
            strokeWidth=".8"
            className="drip"
          />
        )}
        {mood === 'cheer' && (
          <g fill="var(--c-glow)" className="twinkle">
            <path d="M14 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
            <path d="M104 24l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" />
          </g>
        )}
      </g>
    </svg>
  );
}
