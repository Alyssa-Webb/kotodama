/**
 * Food Street: the only place to heal. Pick a stall, order in Japanese from the townsperson
 * running it (choose the right phrase), hear the price in Japanese, count out the yen, and eat.
 * Better meals unlock as you level up; prices are what they cost in Japan.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { eatMeal, heartsNow, maxHearts, playerLevel, type EatError } from '../../engine/game';
import { yenFurigana } from '../../engine/text/yen';
import type { Meal } from '../../schema/meals';
import { useGame } from '../../foundations/store/gameStore';
import { economy, meals } from '../../foundations/world';
import { Guide } from '../../foundations/art/Guide';
import { JaText, useJa } from '../../foundations/japanese/Ja';
import { haptic } from '../../foundations/haptics/haptics';
import { playSfx } from '../../foundations/audio/sfx';
import { fx } from '../../foundations/fx/fx';
import { PayCounter } from '../shop/PayCounter';
import { useSave, useStats } from '../hooks';
import './food.css';

type Step = 'order' | 'price' | 'pay' | 'eat' | 'oops';

const ERR: Record<EatError, string> = {
  locked: 'You need a higher level for this.',
  'not-enough-yen': "You don't have enough yen. Win battles in lessons to earn more!",
  'hp-full': "You're already at full health!",
  'no-hp': 'Casual mode has no health to heal.',
};

function shuffle<T>(xs: T[]): T[] {
  return xs
    .map((x) => [Math.random(), x] as const)
    .sort((a, b) => a[0] - b[0])
    .map(([, x]) => x);
}

function Order({ meal, onClose }: { meal: Meal; onClose: () => void }) {
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  const stats = useStats();
  const save = useSave();
  const { speak } = useJa();
  const [step, setStep] = useState<Step>('order');
  const [said, setSaid] = useState<{ ja: string; en: string }>({
    ja: 'いらっしゃいませ！ご{注文|ちゅうもん}は？',
    en: 'Welcome! What would you like?',
  });
  const [healed, setHealed] = useState(0);
  const vendor = meal.price % 2 ? 'tetsu' : 'akari';
  const other = meals.find((m) => m.id !== meal.id)!;
  const choices = useMemo(
    () =>
      shuffle([
        { ja: `${meal.name}をください。`, ok: true, why: '' },
        {
          ja: `${meal.name}がください。`,
          ok: false,
          why: 'Use を (the object marker) before ください.',
        },
        {
          ja: `${other.name}をください。`,
          ok: false,
          why: `That orders ${other.en}, not ${meal.en}.`,
        },
      ]),
    [meal, other],
  );
  const say = (ja: string, en: string) => {
    setSaid({ ja, en });
    speak(ja, { role: 'teach' });
  };
  const eat = () => {
    const r = eatMeal(useGame.getState().save!, gctx(), meal);
    if ('error' in r) {
      setStep('oops');
      return say('すみません…', ERR[r.error]);
    }
    commit(r.save);
    setHealed(r.healed);
    setStep('eat');
    haptic('rise');
    playSfx('complete');
    fx.text(`+${r.healed} HP`, null, 'gold');
    say('ありがとうございました！', 'Thank you very much! Enjoy your meal.');
  };

  return (
    <div className="food-order" role="dialog" aria-modal="true" aria-label={`Ordering ${meal.en}`}>
      <div className="food-order-card">
        <div className="food-vendor">
          <Guide
            who={vendor}
            mood={step === 'eat' ? 'cheer' : step === 'oops' ? 'worried' : 'happy'}
            size={96}
          />
          <div className="food-say">
            <p className="food-say-ja" lang="ja">
              <JaText text={said.ja} />
            </p>
            <p className="food-say-en">{said.en}</p>
          </div>
        </div>

        {step === 'order' && (
          <div className="stack" style={{ gap: 'var(--sp-2)' }}>
            <p className="eyebrow">Order {meal.en} in Japanese</p>
            {choices.map((c) => (
              <button
                key={c.ja}
                className="btn food-choice"
                lang="ja"
                onClick={() => {
                  if (c.ok) {
                    haptic('pop');
                    setStep('price');
                    say(
                      `${yenFurigana(meal.price)}です。`,
                      `That's ¥${meal.price.toLocaleString('en-US')}.`,
                    );
                  } else {
                    haptic('double');
                    say('えっ？', c.why);
                  }
                }}
              >
                <JaText text={c.ja} />
              </button>
            ))}
          </div>
        )}
        {step === 'price' && (
          <button
            className="btn btn-accent btn-block"
            onClick={() =>
              save.settings.countYen && stats.yen >= meal.price ? setStep('pay') : eat()
            }
          >
            Pay ¥{meal.price.toLocaleString('en-US')}
          </button>
        )}
        {step === 'eat' && (
          <div className="food-eaten">
            <span className="food-plate" aria-hidden="true" />
            <p>
              You ate {meal.en} and healed <b>{healed} HP</b>.
            </p>
          </div>
        )}
        <button className="btn btn-ghost" onClick={onClose}>
          {step === 'eat' ? 'Done' : 'Leave'}
        </button>
      </div>
      {step === 'pay' && (
        <PayCounter
          item={meal.en}
          price={meal.price}
          balance={stats.yen}
          onCancel={() => setStep('price')}
          onPaid={eat}
        />
      )}
    </div>
  );
}

export function FoodScreen() {
  const save = useSave();
  const stats = useStats();
  const gctx = useGame((s) => s.ctx);
  const [meal, setMeal] = useState<Meal | null>(null);
  const level = playerLevel(save, economy);
  const hp = heartsNow(save, gctx());
  const max = maxHearts(save, economy);
  return (
    <div className="stack">
      <div className="row spread">
        <h1>
          <JaText text="{食|く}いだおれ{横丁|よこちょう}" /> Food Street
        </h1>
        <Link className="btn btn-small" to="/town">
          Town
        </Link>
      </div>
      <p className="muted small">
        Only food heals your HP ({hp ?? '—'}/{max ?? '—'}). Order in Japanese, pay in yen (you have
        ¥{stats.yen.toLocaleString('en-US')}). Level {level}: bigger meals unlock as you grow.
      </p>
      <div className="food-grid">
        {meals.map((m) => {
          const locked = level < m.level;
          return (
            <button
              key={m.id}
              className={`card card-tight food-stall ${locked ? 'locked' : ''}`}
              disabled={locked}
              onClick={() => setMeal(m)}
            >
              <span className="food-stall-vendor">{m.vendor}</span>
              <span className="big-ja" lang="ja">
                <JaText text={m.name} />
              </span>
              <strong>{m.en}</strong>
              <span className="food-stall-heal">+{m.heal} HP</span>
              <span className="food-stall-price">
                ¥{m.price.toLocaleString('en-US')}{' '}
                <small lang="ja">
                  <JaText text={yenFurigana(m.price)} />
                </small>
              </span>
              {locked && <span className="pill">Level {m.level}</span>}
            </button>
          );
        })}
      </div>
      {meal && <Order meal={meal} onClose={() => setMeal(null)} />}
    </div>
  );
}
