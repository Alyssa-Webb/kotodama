/**
 * Checkout as practice: pay the exact price by tapping real Japanese coins and notes into the
 * tray (1, 5, 10, 50, 100, 500 yen coins; 1,000, 5,000, 10,000 yen notes). Each piece says its
 * Japanese name as it lands, the price is shown and spoken in Japanese, and "Show me" lays out
 * the fewest pieces when you are stuck. Pieces you can't afford are disabled.
 */
import { useState } from 'react';
import {
  fewestPieces,
  yenFurigana,
  YEN_DENOMINATIONS,
  type YenDenomination,
} from '../../engine/text/yen';
import { JaText, useJa } from '../../foundations/japanese/Ja';
import { haptic } from '../../foundations/haptics/haptics';
import { playSfx } from '../../foundations/audio/sfx';
import { Mascot } from '../../foundations/art/Mascot';
import './pay.css';

const isNote = (d: number) => d >= 1000;

export function YenPiece({ value }: { value: YenDenomination }) {
  return (
    <span className={`yen-piece ${isNote(value) ? 'yen-note' : 'yen-coin'} yen-${value}`}>
      <span className="yen-piece-value">{value.toLocaleString('en-US')}</span>
      {(value === 5 || value === 50) && <span className="yen-hole" />}
    </span>
  );
}

export function PayCounter({
  price,
  balance,
  item,
  onPaid,
  onCancel,
}: {
  price: number;
  balance: number;
  item: string;
  onPaid: () => void;
  onCancel: () => void;
}) {
  const [tray, setTray] = useState<YenDenomination[]>([]);
  const [done, setDone] = useState(false);
  const { speak } = useJa();
  const sum = tray.reduce((a, b) => a + b, 0);
  const over = sum > price;

  const settle = (next: YenDenomination[]) => {
    setTray(next);
    if (next.reduce((a, b) => a + b, 0) === price) {
      setDone(true);
      haptic('pop');
      playSfx('coin');
      speak('ありがとうございます', { role: 'koto' });
      window.setTimeout(onPaid, 700);
    }
  };
  const add = (d: YenDenomination) => {
    if (done || sum + d > balance) return;
    haptic('tick');
    playSfx('tap');
    speak(yenFurigana(d), { role: 'koto' });
    settle([...tray, d]);
  };

  return (
    <div className="pay" role="dialog" aria-modal="true" aria-label={`Pay for ${item}`}>
      <div className="pay-card">
        <div className="pay-head">
          <Mascot
            outfit="shopkeeper"
            pose={done ? 'cheer' : over ? 'surprised' : 'talk'}
            size={72}
          />
          <div>
            <p className="eyebrow">{item}</p>
            <button
              className="pay-price"
              onClick={() => speak(yenFurigana(price), { role: 'koto' })}
              aria-label={`Price ${price} yen, tap to hear it`}
            >
              ¥{price.toLocaleString('en-US')}
            </button>
            <p className="pay-ja" lang="ja">
              <JaText text={yenFurigana(price)} />
            </p>
          </div>
        </div>

        <div
          className={`pay-tray ${done ? 'pay-done' : ''} ${over ? 'pay-over' : ''}`}
          aria-live="polite"
        >
          {tray.length === 0 && <span className="muted small">Tap coins and notes to pay</span>}
          {tray.map((d, i) => (
            <button
              key={i}
              className="pay-tray-piece"
              onClick={() => !done && setTray(tray.filter((_, j) => j !== i))}
              aria-label={`Take back ${d} yen`}
            >
              <YenPiece value={d} />
            </button>
          ))}
        </div>
        <p className={`pay-total ${over ? 'bad' : ''}`}>
          {done
            ? 'Exactly right! ありがとうございます！'
            : over
              ? `That's ¥${(sum - price).toLocaleString('en-US')} too much: tap a piece to take it back.`
              : `¥${sum.toLocaleString('en-US')} of ¥${price.toLocaleString('en-US')}`}
        </p>

        <div className="pay-wallet" aria-label="Your coins and notes">
          {YEN_DENOMINATIONS.map((d) => (
            <button
              key={d}
              className="pay-wallet-piece"
              onClick={() => add(d)}
              disabled={done || sum + d > balance}
              aria-label={`${d} yen`}
            >
              <YenPiece value={d} />
              <span className="pay-wallet-ja" lang="ja">
                <JaText text={yenFurigana(d)} />
              </span>
            </button>
          ))}
        </div>

        <div className="row">
          <button className="btn btn-ghost" onClick={onCancel} disabled={done}>
            Cancel
          </button>
          <button className="btn" onClick={() => settle(fewestPieces(price))} disabled={done}>
            Show me
          </button>
        </div>
      </div>
    </div>
  );
}
