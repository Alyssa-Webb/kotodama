import type { AnimationEvent } from 'react';
import './battle-fx.css';

type BattleFxState = {
  id: number;
  kind: 'slash' | 'finisher' | 'impact';
};

type BattleFxProps = {
  fx: BattleFxState;
  onDone: () => void;
};

const slashVariants = ['horizontal', 'rising', 'jab'] as const;

function SpeedLines() {
  return (
    <svg className="battle-fx-speed-lines" viewBox="0 0 160 100" aria-hidden="true">
      <path d="M8 71 L76 45" />
      <path d="M19 86 L82 56" />
      <path d="M35 94 L88 67" />
    </svg>
  );
}

function HitBurst() {
  return (
    <svg className="battle-fx-hit-burst" viewBox="0 0 100 100" aria-hidden="true">
      <path
        className="battle-fx-star"
        d="M50 5 L58 36 L89 20 L66 44 L98 51 L65 58 L86 85 L57 67 L49 98 L42 67 L13 84 L34 58 L2 50 L35 43 L14 17 L43 35Z"
      />
      <g className="battle-fx-sparks">
        <path d="M17 25 L25 31 L18 35 L12 30Z" />
        <path d="M78 14 L83 22 L76 25 L72 18Z" />
        <path d="M87 68 L94 72 L88 79 L82 74Z" />
        <path d="M22 76 L28 82 L21 88 L16 81Z" />
      </g>
    </svg>
  );
}

function SlashFx({ variant }: { variant: (typeof slashVariants)[number] }) {
  const isJab = variant === 'jab';
  return (
    <>
      <SpeedLines />
      <div className="battle-fx-slash-field">
        {isJab ? (
          <svg className="battle-fx-jabs" viewBox="0 0 150 100" aria-hidden="true">
            <g className="battle-fx-jab battle-fx-jab-a">
              <path className="battle-fx-jab-smear" d="M8 72 L112 38 L124 42 L15 80Z" />
              <path className="battle-fx-jab-core" d="M16 75 L122 40" />
              <circle cx="122" cy="40" r="12" />
            </g>
            <g className="battle-fx-jab battle-fx-jab-b">
              <path className="battle-fx-jab-smear" d="M15 85 L117 52 L131 57 L22 92Z" />
              <path className="battle-fx-jab-core" d="M22 87 L129 55" />
              <circle cx="129" cy="55" r="9" />
            </g>
          </svg>
        ) : (
          <>
            <svg
              className="battle-fx-crescent battle-fx-crescent-glow"
              viewBox="0 0 140 110"
              aria-hidden="true"
            >
              <path d="M9 87 Q45 16 130 22 Q62 34 18 96Z" />
            </svg>
            <svg
              className="battle-fx-crescent battle-fx-crescent-main"
              viewBox="0 0 140 110"
              aria-hidden="true"
            >
              <path d="M9 87 Q45 16 130 22 Q62 34 18 96Z" />
              <path className="battle-fx-crescent-shine" d="M18 82 Q52 28 119 27 Q61 38 25 88Z" />
            </svg>
            <svg
              className="battle-fx-crescent battle-fx-crescent-after"
              viewBox="0 0 140 110"
              aria-hidden="true"
            >
              <path d="M9 87 Q45 16 130 22 Q62 34 18 96Z" />
            </svg>
          </>
        )}
      </div>
      <HitBurst />
      <span className="battle-fx-number">−1</span>
    </>
  );
}

function FinisherFx() {
  return (
    <>
      <div className="battle-fx-impact-frame">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <g className="battle-fx-radial-lines">
            <path d="M0 0 L61 29 M22 0 L62 28 M48 0 L63 27 M100 0 L67 28 M100 18 L68 30 M100 48 L69 33 M100 78 L67 36 M100 100 L65 37 M68 100 L64 38 M35 100 L62 37 M0 100 L61 35 M0 72 L60 34 M0 40 L60 32" />
          </g>
          <path
            className="battle-fx-enemy-ink"
            d="M64 17 C57 17 53 23 54 30 C50 33 51 40 56 42 L55 50 L72 50 L71 42 C76 39 76 32 73 29 C74 22 70 17 64 17Z"
          />
        </svg>
      </div>
      <div className="battle-fx-ko-stage">
        <svg
          className="battle-fx-cross battle-fx-cross-after-a"
          viewBox="0 0 180 130"
          aria-hidden="true"
        >
          <path d="M20 105 Q79 19 161 20 Q91 39 30 114Z" />
          <path d="M24 22 Q105 31 158 112 Q92 60 17 31Z" />
        </svg>
        <svg
          className="battle-fx-cross battle-fx-cross-after-b"
          viewBox="0 0 180 130"
          aria-hidden="true"
        >
          <path d="M20 105 Q79 19 161 20 Q91 39 30 114Z" />
          <path d="M24 22 Q105 31 158 112 Q92 60 17 31Z" />
        </svg>
        <svg
          className="battle-fx-cross battle-fx-cross-main"
          viewBox="0 0 180 130"
          aria-hidden="true"
        >
          <path d="M20 105 Q79 19 161 20 Q91 39 30 114Z" />
          <path d="M24 22 Q105 31 158 112 Q92 60 17 31Z" />
        </svg>
        <div className="battle-fx-shockwave battle-fx-shockwave-a" />
        <div className="battle-fx-shockwave battle-fx-shockwave-b" />
        <svg className="battle-fx-ko-debris" viewBox="0 0 180 150" aria-hidden="true">
          <g className="battle-fx-ink-rays">
            <path d="M90 72 L88 4 L96 44Z M98 70 L155 17 L119 59Z M101 77 L176 70 L125 83Z M97 84 L157 137 L116 98Z M88 86 L83 148 L79 104Z M80 82 L19 133 L62 93Z M78 74 L4 66 L57 68Z M83 69 L27 13 L68 55Z" />
          </g>
          <g className="battle-fx-paper">
            <path d="M43 39 L54 34 L58 46 L47 49Z" />
            <path d="M135 40 L146 45 L139 56 L129 50Z" />
            <path d="M143 102 L153 110 L142 119 L135 109Z" />
            <path d="M39 101 L50 96 L55 108 L43 115Z" />
            <path d="M87 18 L96 23 L90 34 L82 27Z" />
          </g>
        </svg>
        <span className="battle-fx-ko-stamp">KO!</span>
      </div>
    </>
  );
}

function ImpactFx() {
  return (
    <>
      <div className="battle-fx-vignette" />
      <div className="battle-fx-hero-jolt">
        <svg className="battle-fx-claws" viewBox="0 0 110 100" aria-hidden="true">
          <path d="M17 20 Q48 43 89 77 L80 88 Q49 54 11 31Z" />
          <path d="M35 12 Q59 40 98 67 L91 79 Q57 51 29 23Z" />
          <path d="M7 39 Q38 57 72 91 L61 97 Q34 68 3 50Z" />
        </svg>
        <svg className="battle-fx-impact-sparks" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 3 L58 38 L86 17 L66 45 L99 51 L65 59 L84 88 L57 68 L49 99 L42 68 L14 86 L34 58 L2 50 L36 43 L15 16 L43 36Z" />
        </svg>
      </div>
      <span className="battle-fx-number battle-fx-hp-number">−1 HP</span>
    </>
  );
}

export function BattleFx({ fx, onDone }: BattleFxProps) {
  const variant = slashVariants[fx.id % slashVariants.length]!;
  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) onDone();
  };

  return (
    <div
      key={fx.id}
      className={`battle-fx battle-fx-${fx.kind}`}
      data-variant={fx.kind === 'slash' ? variant : undefined}
      onAnimationEnd={handleAnimationEnd}
      aria-hidden="true"
    >
      {fx.kind === 'slash' && <SlashFx variant={variant} />}
      {fx.kind === 'finisher' && <FinisherFx />}
      {fx.kind === 'impact' && <ImpactFx />}
    </div>
  );
}
