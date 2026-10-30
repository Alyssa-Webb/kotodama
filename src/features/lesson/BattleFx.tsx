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

function SlashFx() {
  return (
    <>
      <svg className="battle-fx-slash-mark" viewBox="0 0 100 70" aria-hidden="true">
        <path d="M7 57 Q42 8 94 17" />
      </svg>
      <span className="battle-fx-damage-number">−1</span>
    </>
  );
}

function FinisherFx() {
  return (
    <>
      <svg
        className="battle-fx-impact-frame"
        viewBox="0 0 400 156"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M0 0H400V156H0Z M207 5Q232 -4 263 7Q283 28 270 70Q239 86 205 65Q192 31 207 5Z"
        />
      </svg>
      <svg className="battle-fx-cross-slash" viewBox="0 0 100 70" aria-hidden="true">
        <path d="M12 58 L89 11" />
        <path d="M14 12 L88 57" />
      </svg>
      <div className="battle-fx-smoke" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </>
  );
}

function ImpactFx() {
  return <div className="battle-fx-impact-edge" />;
}

export function BattleFx({ fx, onDone }: BattleFxProps) {
  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) onDone();
  };

  return (
    <div
      key={fx.id}
      className={`battle-fx battle-fx-${fx.kind}`}
      onAnimationEnd={handleAnimationEnd}
      aria-hidden="true"
    >
      {fx.kind === 'slash' && <SlashFx />}
      {fx.kind === 'finisher' && <FinisherFx />}
      {fx.kind === 'impact' && <ImpactFx />}
    </div>
  );
}
