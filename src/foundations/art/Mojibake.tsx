/**
 * Mojibake (文字化け), the first boss: an ink beast made of garbled text, with a chromatic
 * glitch, glowing eyes and states for idle, hit and attack. Placeholder art in code.
 */
import './art.css';

// Classic mojibake glyphs (UTF-8 read as Shift_JIS); purely decorative.
const GLYPHS = ['縺', '繧', '譁', '蟄', '蛹', '縲', '�', '繝', 'ｦ', '驕'];

export function Mojibake({
  state = 'idle',
  hp = 1,
  size = 200,
}: {
  state?: 'idle' | 'hit' | 'attack' | 'defeated';
  hp?: number;
  size?: number;
}) {
  const rage = hp < 0.3;
  return (
    <div
      className={`boss boss-${state} ${rage ? 'boss-rage' : ''}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {['r', 'c', 'base'].map((layer) => (
        <svg key={layer} viewBox="0 0 200 200" className={`boss-layer boss-layer-${layer}`}>
          <defs>
            <radialGradient id={`bossbody-${layer}`} cx=".45" cy=".35" r=".7">
              <stop offset="0" stopColor="var(--c-secondary)" />
              <stop offset=".6" stopColor="var(--c-ink)" />
              <stop offset="1" stopColor="var(--c-ink)" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="186" rx="60" ry="8" fill="var(--c-shadow)" />
          <path
            d="M100 22c34 0 60 24 64 56 3 22-4 34 4 50 6 12 4 30-10 40-12 8-22 2-30 10-8 8-20 8-28 0-8-8-18-2-30-10-14-10-16-28-10-40 8-16 1-28 4-50 4-32 30-56 64-56Z"
            fill={layer === 'base' ? `url(#bossbody-${layer})` : 'currentColor'}
          />
          {layer === 'base' && (
            <>
              {/* drips */}
              <path
                d="M58 160c-2 8 2 14 6 14s6-6 4-12M138 158c0 10 4 16 8 14s2-10-2-16"
                fill="var(--c-ink)"
              />
              {/* garbled glyphs crawling over the body */}
              {GLYPHS.map((g, i) => (
                <text
                  key={i}
                  x={52 + ((i * 37) % 100)}
                  y={70 + ((i * 29) % 90)}
                  fontSize={10 + (i % 3) * 5}
                  fill="var(--c-firefly)"
                  opacity={0.25 + (i % 4) * 0.12}
                  className="glyph"
                  style={{ animationDelay: `${i * 0.23}s` }}
                >
                  {g}
                </text>
              ))}
              {/* eyes */}
              <g className="boss-eyes">
                <path
                  d="M62 84l26 8-4 12-24-6Z"
                  fill={rage ? 'var(--c-danger)' : 'var(--c-glow)'}
                />
                <path
                  d="M138 84l-26 8 4 12 24-6Z"
                  fill={rage ? 'var(--c-danger)' : 'var(--c-glow)'}
                />
                <circle cx="76" cy="94" r="3" fill="var(--c-ink)" />
                <circle cx="124" cy="94" r="3" fill="var(--c-ink)" />
              </g>
              {/* jagged mouth */}
              <path
                d="M70 124l8 10 8-8 8 10 6-8 8 10 8-10 8 8 6-12c-20 14-46 14-60 0Z"
                fill="var(--c-lacquer)"
                stroke="var(--c-firefly)"
                strokeWidth="1"
              />
              {/* horns made of brackets */}
              <text x="46" y="44" fontSize="30" fill="var(--c-ink)" fontWeight="900">
                {'{'}
              </text>
              <text x="140" y="44" fontSize="30" fill="var(--c-ink)" fontWeight="900">
                {'}'}
              </text>
            </>
          )}
        </svg>
      ))}
    </div>
  );
}
