/**
 * The two guides as animated SVG busts. They breathe, blink and react: happy (correct), worried
 * (wrong), cheer (Kiai / completion), idle. Molded-toy illustration style driven by theme tokens.
 */
import './art.css';

export type Mood = 'idle' | 'happy' | 'worried' | 'cheer';

interface GuideProps {
  who: 'akari' | 'tetsu';
  mood?: Mood;
  size?: number;
}

function Eyes({ mood, x1, x2, y }: { mood: Mood; x1: number; x2: number; y: number }) {
  if (mood === 'happy' || mood === 'cheer') {
    return (
      <g stroke="var(--c-hud-bg)" strokeWidth="3.2" fill="none" strokeLinecap="round">
        <path d={`M${x1 - 4.8} ${y + 1.5} Q${x1} ${y - 4.8} ${x1 + 4.8} ${y + 1.5}`} />
        <path d={`M${x2 - 4.8} ${y + 1.5} Q${x2} ${y - 4.8} ${x2 + 4.8} ${y + 1.5}`} />
      </g>
    );
  }
  return (
    <g className="blink" style={{ transformOrigin: `60px ${y}px` }}>
      <ellipse cx={x1} cy={y + 0.8} rx="4" ry="4.6" fill="var(--c-hud-bg)" />
      <ellipse cx={x2} cy={y + 0.8} rx="4" ry="4.6" fill="var(--c-hud-bg)" />
      <circle cx={x1 - 1.2} cy={y - 1.1} r="1.5" fill="var(--c-hud-ink)" />
      <circle cx={x2 - 1.2} cy={y - 1.1} r="1.5" fill="var(--c-hud-ink)" />
      <circle cx={x1 + 1.4} cy={y + 2} r="0.7" fill="var(--c-hud-ink)" opacity="0.75" />
      <circle cx={x2 + 1.4} cy={y + 2} r="0.7" fill="var(--c-hud-ink)" opacity="0.75" />
    </g>
  );
}

function Brows({
  mood,
  x1,
  x2,
  y,
  thick = false,
}: {
  mood: Mood;
  x1: number;
  x2: number;
  y: number;
  thick?: boolean;
}) {
  const t = mood === 'worried' ? 3.4 : mood === 'cheer' ? -2 : mood === 'happy' ? -1.2 : 0.6;
  return (
    <g
      stroke="var(--c-hud-bg)"
      strokeWidth={thick ? '3.6' : '2.6'}
      strokeLinecap="round"
      fill="none"
    >
      <path d={`M${x1 - 5.5} ${y - t} Q${x1} ${y - 1.8 - t * 0.4} ${x1 + 4.8} ${y + t * 0.4}`} />
      <path d={`M${x2 + 5.5} ${y - t} Q${x2} ${y - 1.8 - t * 0.4} ${x2 - 4.8} ${y + t * 0.4}`} />
    </g>
  );
}

function Mouth({ mood, y }: { mood: Mood; y: number }) {
  if (mood === 'cheer') {
    return (
      <g>
        <path
          d={`M51.5 ${y - 1.5} C51.5 ${y + 9.5} 68.5 ${y + 9.5} 68.5 ${y - 1.5} Z`}
          fill="var(--c-lacquer)"
        />
        <path
          d={`M53.5 ${y - 1.2} H66.5`}
          stroke="var(--c-hud-ink)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse cx="60" cy={y + 4.2} rx="4.8" ry="2.6" fill="var(--c-accent)" />
      </g>
    );
  }
  if (mood === 'happy') {
    return (
      <g>
        <path
          d={`M53 ${y - 0.5} C53 ${y + 7} 67 ${y + 7} 67 ${y - 0.5} Z`}
          fill="var(--c-hud-bg)"
        />
        <ellipse cx="60" cy={y + 3.2} rx="3.8" ry="2" fill="var(--c-accent)" />
      </g>
    );
  }
  if (mood === 'worried') {
    return (
      <path
        d={`M54 ${y + 3} Q57 ${y - 0.5} 60 ${y + 2.2} T66 ${y + 2.5}`}
        stroke="var(--c-hud-bg)"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  return (
    <path
      d={`M55.5 ${y + 0.5} Q60 ${y + 4} 64.5 ${y + 0.5}`}
      stroke="var(--c-hud-bg)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
  );
}

export function Guide({ who, mood = 'idle', size = 96 }: GuideProps) {
  const skin = 'var(--c-skin)';
  const skinShade = 'color-mix(in srgb, var(--c-skin) 72%, var(--c-hud-bg))';
  const hair = 'color-mix(in srgb, var(--c-hud-bg) 84%, var(--c-secondary))';
  const hairShade = 'var(--c-hud-bg)';
  const hairHi = 'color-mix(in srgb, var(--c-secondary) 55%, var(--c-hud-ink))';

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
            {/* Hair bun + ornamental kanzashi hairpin */}
            <path
              d="M54 16 L85 3"
              stroke="color-mix(in srgb, var(--c-gold) 70%, var(--c-hud-bg))"
              strokeWidth="4.4"
              strokeLinecap="round"
            />
            <path d="M54 15 L85 2" stroke="var(--c-glow)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="86" cy="4.5" r="4.5" fill="var(--c-lacquer)" />
            <circle cx="86" cy="3" r="4.5" fill="var(--c-accent)" />
            <circle cx="84.6" cy="1.8" r="1.4" fill="var(--c-coin-shine)" opacity="0.8" />
            <circle cx="60" cy="22" r="15.5" fill={hairShade} />
            <circle cx="60" cy="19.5" r="15" fill={hair} />
            <path
              d="M51 12 Q58 8 66 11"
              stroke={hairHi}
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
            />
            <rect x="48" y="27" width="24" height="5" rx="2.5" fill="var(--c-accent)" />
            <circle cx="48" cy="29" r="4" fill="var(--c-petal)" />
            <circle cx="48" cy="29" r="1.6" fill="var(--c-glow)" />

            {/* Back hair */}
            <path
              d="M25 60 C25 32 38 22 60 22 C82 22 95 32 95 60 C95 75 89 87 82 91 H38 C31 87 25 75 25 60Z"
              fill={hairShade}
            />
            <path
              d="M25 57 C25 30 38 20 60 20 C82 20 95 30 95 57 C95 72 89 84 82 88 H38 C31 84 25 72 25 57Z"
              fill={hair}
            />

            {/* Kimono shoulders + obi */}
            <path
              d="M14 130 C16 99 32 87 60 87 C88 87 104 99 106 130 Z"
              fill="color-mix(in srgb, var(--c-secondary) 60%, var(--c-hud-bg))"
            />
            <path
              d="M16 130 C18 101 33 89 60 89 C87 89 102 101 104 130 Z"
              fill="var(--c-secondary)"
            />
            <path
              d="M27 100 Q37 93 46 94"
              stroke="var(--c-hud-ink)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.35"
            />
            {/* Layered kimono collars */}
            <path d="M40 88 L60 122 L80 88 Z" fill="var(--c-border)" />
            <path d="M42 88 L60 118 L78 88 Z" fill="var(--c-hud-ink)" />
            <path d="M46 88 L60 112 L74 88 Z" fill="var(--c-lacquer)" />
            <path d="M47.5 88 L60 109 L72.5 88 Z" fill="var(--c-accent)" />
            {/* Obi sash at base */}
            <path d="M20 120 Q60 115 100 120 L103 130 H17 Z" fill="var(--c-lacquer)" />
            <path d="M21 118 Q60 113 99 118 L101 127 H19 Z" fill="var(--c-accent)" />
            <path
              d="M22 122 Q60 117 98 122"
              stroke="var(--c-glow)"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Sleeve sakura blossoms */}
            {[
              [31, 107],
              [87, 106],
              [39, 115],
              [79, 114],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="3.4" fill="var(--c-petal)" />
                <circle cx={x} cy={y} r="1.3" fill="var(--c-glow)" />
              </g>
            ))}

            {/* Neck */}
            <rect x="51" y="75" width="18" height="19" rx="8" fill={skinShade} />
            <rect x="52" y="73" width="16" height="16" rx="7" fill={skin} />

            {/* Ears + earrings */}
            <circle cx="33" cy="60" r="6" fill={skinShade} />
            <circle cx="33" cy="58.5" r="6" fill={skin} />
            <circle cx="33" cy="64.5" r="2.4" fill="var(--c-accent)" />
            <circle cx="87" cy="60" r="6" fill={skinShade} />
            <circle cx="87" cy="58.5" r="6" fill={skin} />
            <circle cx="87" cy="64.5" r="2.4" fill="var(--c-accent)" />

            {/* Face / head with bottom lip & top-left highlight */}
            <rect x="34" y="34" width="52" height="48" rx="24" fill={skinShade} />
            <rect x="34" y="31" width="52" height="47" rx="23.5" fill={skin} />
            <ellipse
              cx="47"
              cy="41"
              rx="9"
              ry="4"
              transform="rotate(-15 47 41)"
              fill="var(--c-hud-ink)"
              opacity="0.42"
            />

            {/* Hime-cut side locks & bangs */}
            <path
              d="M31 48 C31 28 43 22 60 22 C77 22 89 28 89 48 C89 60 87 72 83 76 C81 68 82 56 81 49 C74 41 68 39 63 45 C58 38 51 39 46 45 C42 40 38 42 39 49 C38 56 39 68 37 76 C33 72 31 60 31 48Z"
              fill={hair}
            />
            <path
              d="M41 31 Q54 25 69 29"
              stroke={hairHi}
              strokeWidth="3.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
            />

            {/* Face features */}
            <Brows mood={mood} x1={49} x2={71} y={50} />
            <Eyes mood={mood} x1={49} x2={71} y={58} />
            <ellipse
              cx="43"
              cy="65.5"
              rx="5.2"
              ry="2.8"
              fill="var(--c-petal)"
              opacity={mood === 'happy' || mood === 'cheer' ? 0.88 : 0.55}
            />
            <ellipse
              cx="77"
              cy="65.5"
              rx="5.2"
              ry="2.8"
              fill="var(--c-petal)"
              opacity={mood === 'happy' || mood === 'cheer' ? 0.88 : 0.55}
            />
            <Mouth mood={mood} y={68.5} />

            {/* Molded toy lantern in hand */}
            <g className="sway" style={{ transformOrigin: '100px 82px' }}>
              <path
                d="M100 78 V85"
                stroke="var(--c-gold)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <ellipse cx="100" cy="99" rx="11.5" ry="12" fill="var(--c-lacquer)" />
              <ellipse cx="100" cy="96.5" rx="11.5" ry="11.5" fill="var(--c-accent)" />
              <ellipse
                cx="100"
                cy="96.5"
                rx="6.5"
                ry="7.5"
                fill="var(--c-glow)"
                opacity="0.88"
                className="lantern-glow"
              />
              <ellipse
                cx="95.5"
                cy="91"
                rx="3"
                ry="1.6"
                transform="rotate(-25 95.5 91)"
                fill="var(--c-coin-shine)"
                opacity="0.7"
              />
              <rect x="93.5" y="83.5" width="13" height="3.5" rx="1.7" fill="var(--c-hud-bg)" />
              <rect x="93.5" y="107" width="13" height="3.5" rx="1.7" fill="var(--c-hud-bg)" />
              <path
                d="M100 110.5 V115"
                stroke="var(--c-glow)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </g>
          </>
        ) : (
          <>
            {/* Straw kasa slung on the back */}
            <path
              d="M6 43 C10 31 35 12 60 12 C85 12 110 31 114 43 C96 51 24 51 6 43Z"
              fill="color-mix(in srgb, var(--c-gold) 62%, var(--c-hud-bg))"
            />
            <path
              d="M8 40 C12 28 36 10 60 10 C84 10 108 28 112 40 C94 48 26 48 8 40Z"
              fill="var(--c-glow)"
            />
            <path
              d="M22 33 Q40 19 57 14"
              stroke="var(--c-coin-shine)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />

            {/* Katana hilt over right shoulder */}
            <g>
              <path
                d="M90 80 L108 52"
                stroke="var(--c-hud-bg)"
                strokeWidth="8.5"
                strokeLinecap="round"
              />
              <path
                d="M90 79 L108 51"
                stroke="var(--c-accent)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray="3 4"
              />
              <path
                d="M84 82 L97 72"
                stroke="color-mix(in srgb, var(--c-gold) 65%, var(--c-hud-bg))"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M84 81 L97 71"
                stroke="var(--c-glow)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </g>

            {/* Haori + shoulders */}
            <path d="M10 130 C13 96 31 85 60 85 C89 85 107 96 110 130 Z" fill="var(--c-hud-bg)" />
            <path
              d="M12 130 C15 98 32 87 60 87 C88 87 105 98 108 130 Z"
              fill="color-mix(in srgb, var(--c-hud-bg) 76%, var(--c-secondary))"
            />
            <path
              d="M24 99 Q35 91 46 92"
              stroke="var(--c-secondary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.45"
            />
            {/* Inner dogi + lacquer haori lapels */}
            <path d="M41 86 L60 124 L79 86 Z" fill="var(--c-border)" />
            <path d="M43 86 L60 120 L77 86 Z" fill="var(--c-hud-ink)" />
            <path d="M48 86 L60 112 L72 86 Z" fill="var(--c-ink-muted)" />
            <path
              d="M36 88 L49 130 H40 L29 92 Z M84 88 L71 130 H80 L91 92 Z"
              fill="var(--c-lacquer)"
            />
            <path
              d="M37 87 L50 130 H43 L31 91 Z M83 87 L70 130 H77 L89 91 Z"
              fill="var(--c-accent)"
            />
            {/* Haori himo tie cord & gold crests */}
            <path
              d="M44 114 Q60 120 76 114"
              stroke="var(--c-glow)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="60" cy="116" r="3.6" fill="var(--c-glow)" />
            <circle cx="31" cy="112" r="3.5" fill="var(--c-glow)" opacity="0.85" />
            <circle cx="89" cy="112" r="3.5" fill="var(--c-glow)" opacity="0.85" />

            {/* Neck */}
            <rect x="49" y="73" width="22" height="20" rx="8" fill={skinShade} />
            <rect x="50" y="71" width="20" height="17" rx="7" fill={skin} />

            {/* Ears */}
            <circle cx="33" cy="58" r="6.5" fill={skinShade} />
            <circle cx="33" cy="56.5" r="6.5" fill={skin} />
            <circle cx="87" cy="58" r="6.5" fill={skinShade} />
            <circle cx="87" cy="56.5" r="6.5" fill={skin} />

            {/* Topknot (chonmage) */}
            <rect x="52" y="13" width="16" height="15" rx="7" fill={hairShade} />
            <rect x="52" y="11" width="16" height="14" rx="7" fill={hair} />
            <rect x="53" y="22" width="14" height="3.8" rx="1.9" fill="var(--c-hud-ink)" />

            {/* Sturdy molded head */}
            <rect x="34" y="31" width="52" height="51" rx="21" fill={skinShade} />
            <rect x="34" y="28" width="52" height="50" rx="21" fill={skin} />
            <ellipse
              cx="47"
              cy="39"
              rx="9"
              ry="3.8"
              transform="rotate(-14 47 39)"
              fill="var(--c-hud-ink)"
              opacity="0.38"
            />

            {/* Samurai hair */}
            <path
              d="M32 52 C32 31 43 23 60 23 C77 23 88 31 88 52 C84 41 75 36 60 36 C45 36 36 41 32 52Z"
              fill={hair}
            />
            <path
              d="M42 29 Q55 24 68 27"
              stroke={hairHi}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />

            {/* Molded jaw stubble */}
            <path
              d="M37 62 C39 74 48 79 60 79 C72 79 81 74 83 62 C80 70 72 74 60 74 C48 74 40 70 37 62Z"
              fill="var(--c-hud-bg)"
              opacity="0.22"
            />

            {/* Face features + cheek scar */}
            <Brows mood={mood} x1={49} x2={71} y={48.5} thick />
            <Eyes mood={mood} x1={49} x2={71} y={56.5} />
            <path
              d="M73 49 L77 61"
              stroke="var(--c-lacquer)"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.75"
            />
            {(mood === 'happy' || mood === 'cheer') && (
              <>
                <ellipse cx="42" cy="64" rx="4.5" ry="2.4" fill="var(--c-petal)" opacity="0.65" />
                <ellipse cx="78" cy="64" rx="4.5" ry="2.4" fill="var(--c-petal)" opacity="0.65" />
              </>
            )}
            <Mouth mood={mood} y={67.5} />
          </>
        )}

        {/* Worried sweat drop */}
        {mood === 'worried' && (
          <g className="drip">
            <path d="M88 36 C93 43 92.5 48 88 48 C83.5 48 83 43 88 36Z" fill="var(--c-secondary)" />
            <path
              d="M88 37.5 C91.5 43 91 46.5 88 46.5 C85 46.5 84.5 43 88 37.5Z"
              fill="var(--c-secondary-soft)"
            />
            <circle cx="86.8" cy="43.5" r="1.1" fill="var(--c-hud-ink)" />
          </g>
        )}

        {/* Cheer sparkles */}
        {mood === 'cheer' && (
          <g fill="var(--c-glow)" className="twinkle">
            <path d="M14 28 l2.5 5.5 5.5 2.5 -5.5 2.5 -2.5 5.5 -2.5 -5.5 -5.5 -2.5 5.5 -2.5Z" />
            <path d="M105 22 l2 4.5 4.5 2 -4.5 2 -2 4.5 -2 -4.5 -4.5 -2 4.5 -2Z" />
            <circle cx="20" cy="46" r="2.2" fill="var(--c-coin-shine)" />
            <circle cx="100" cy="39" r="2" fill="var(--c-coin-shine)" />
          </g>
        )}
      </g>
    </svg>
  );
}
