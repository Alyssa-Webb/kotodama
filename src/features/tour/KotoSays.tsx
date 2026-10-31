/**
 * Koto in a role, on his own little stage: behind the shop counter with his wares (shopkeeper),
 * or at the town podium (mayor). Like the guide on Home, the counter cuts him off at the waist.
 * He waves hello when you arrive, then talks; tap him for another line (spoken aloud).
 */
import { useEffect, useRef, useState } from 'react';
import { Mascot, type MascotOutfit, type MascotPose } from '../../foundations/art/Mascot';
import { ItemArt } from '../../foundations/art/ItemArt';
import { JaText, useJa } from '../../foundations/japanese/Ja';
import { haptic } from '../../foundations/haptics/haptics';
import type { KotoLine } from '../../schema/koto';
import './tour.css';

const WARES = ['chochin', 'daruma', 'taiko', 'maneki'];

export function KotoSays({
  lines,
  outfit,
  role,
}: {
  lines: KotoLine[];
  outfit: MascotOutfit;
  role: 'shop' | 'town';
}) {
  const [i, setI] = useState(() => Math.floor(Math.random() * lines.length));
  const [pose, setPose] = useState<MascotPose>('wave');
  const { speak } = useJa();
  const line = lines[i % lines.length]!;

  // Talking lasts about as long as the line takes to read, then he settles back to idle.
  const talkMs = (l: KotoLine) => Math.min(4500, 1200 + l.en.length * 45);
  const timer = useRef(0);
  const talk = (l: KotoLine) => {
    window.clearTimeout(timer.current);
    setPose('talk');
    timer.current = window.setTimeout(() => setPose('idle'), talkMs(l));
  };

  // On arrival: wave hello, then say the first line, then idle.
  useEffect(() => {
    const t = window.setTimeout(() => {
      talk(line);
      speak(line.ja, { role: 'koto' });
    }, 1500);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(timer.current);
    };
    // once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Tap Koto or his bubble: the next line, spoken, with his talking animation. */
  const next = () => {
    const n = (i + 1) % lines.length;
    setI(n);
    talk(lines[n]!);
    haptic('tick');
    speak(lines[n]!.ja, { role: 'koto' });
  };

  return (
    <section className={`koto-stage koto-stage-${role}`} aria-label="Koto">
      <div className="koto-stage-back" aria-hidden="true">
        {role === 'shop' ? (
          <>
            <span className="koto-awning" />
            <span className="koto-noren">¥</span>
          </>
        ) : (
          <>
            <span className="koto-hall" />
            <span className="koto-lanterns" />
          </>
        )}
      </div>
      <button className="koto-stage-koto" onClick={next} aria-label="Talk to Koto">
        <Mascot outfit={outfit} pose={pose} size={108} facing="right" />
      </button>
      <div className="koto-counter" aria-hidden="true">
        {role === 'shop' &&
          WARES.map((id, k) => (
            <span key={id} className="koto-ware" style={{ animationDelay: `${k * 0.4}s` }}>
              <ItemArt id={id} size={40} />
            </span>
          ))}
      </div>
      <button
        key={i}
        className="koto-stage-bubble"
        onClick={next}
        aria-label="Tap for Koto's next line"
      >
        <p className="tour-ja" lang="ja">
          <JaText text={line.ja} />
        </p>
        <p className="tour-en">{line.en}</p>
        <span className="koto-more" aria-hidden="true">
          ▸
        </span>
      </button>
    </section>
  );
}
