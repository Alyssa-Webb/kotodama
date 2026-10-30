import { useState, type ReactNode } from 'react';
import { changeDifficulty, DIFFICULTY_LOCK_DAYS } from '../../engine/game';
import { DIFFICULTIES } from '../../schema/economy';
import type { Settings } from '../../schema/save';
import { useGame } from '../../foundations/store/gameStore';
import { economy } from '../../foundations/world';
import { JaText, useJa } from '../../foundations/japanese/Ja';
import { useSave } from '../hooks';

function Seg<T extends string | number | boolean>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { v: T; label: ReactNode }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o.v)}
          className="btn btn-small"
          aria-pressed={o.v === value}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsScreen() {
  const save = useSave();
  const commit = useGame((s) => s.commit);
  const gctx = useGame((s) => s.ctx);
  const [lockMsg, setLockMsg] = useState<string | null>(null);
  const { speak } = useJa();
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    commit({
      ...useGame.getState().save!,
      settings: { ...useGame.getState().save!.settings, [k]: v },
    });
  const st = save.settings;
  const rules = economy.difficulty[st.difficulty]!;
  return (
    <div className="stack">
      <h1>Settings</h1>
      <section className="card stack">
        <h2>Difficulty</h2>
        {lockMsg && (
          <p className="bad-text small" role="status">
            {lockMsg}
          </p>
        )}
        <Seg
          label="Difficulty"
          value={st.difficulty}
          onChange={(v) => {
            const r = changeDifficulty(useGame.getState().save!, gctx(), v);
            if ('error' in r)
              return setLockMsg(
                `Difficulty is locked until ${r.until} (changes lock for ${DIFFICULTY_LOCK_DAYS} days).`,
              );
            setLockMsg(null);
            commit(r.save);
          }}
          options={DIFFICULTIES.map((d) => ({ v: d, label: d[0]!.toUpperCase() + d.slice(1) }))}
        />
        <p className="muted small">
          {rules.hearts === null
            ? 'No hearts: mistakes cost combo and stars.'
            : `${rules.hearts} hearts, ${rules.refill === 'daily' ? 'refilled each day' : 'refill 1 per hour or 10 Dojo reviews'}.`}{' '}
          {rules.spoil ? 'Missed days spoil 10% of your koban.' : 'No koban spoil.'}{' '}
          {rules.kintsugi
            ? rules.kintsugiTrial
              ? 'Streak repair needs a Redemption Trial.'
              : 'Kintsugi repairs streaks.'
            : 'No streak repair, ever.'}
        </p>
      </section>
      <section className="card stack">
        <h2>Daily goal</h2>
        <Seg
          label="Daily goal"
          value={st.dailyGoalXp}
          onChange={(v) => set('dailyGoalXp', v)}
          options={economy.xp.dailyGoalOptions.map((o) => ({
            v: o.xp,
            label: `${o.minutes} min (${o.xp} XP)`,
          }))}
        />
      </section>
      <section className="card stack">
        <h2>Script</h2>
        <Seg
          label="Script level"
          value={st.scriptLevel}
          onChange={(v) => set('scriptLevel', v)}
          options={[
            { v: 'romaji', label: 'Romaji' },
            { v: 'kana', label: 'Kana' },
            { v: 'furigana', label: 'Furigana' },
            { v: 'kanji', label: 'Kanji' },
          ]}
        />
        <p className="big-ja center">
          <JaText text="{水|みず}をください。" />
        </p>
      </section>
      <section className="card stack">
        <h2>Voice</h2>
        <Seg
          label="Voice"
          value={st.voiceMode}
          onChange={(v) => set('voiceMode', v)}
          options={[
            { v: 'akari', label: 'Akari' },
            { v: 'tetsu', label: 'Tetsu' },
            { v: 'alternate-lesson', label: 'Alternate by lesson' },
            { v: 'alternate-line', label: 'Alternate by line' },
            { v: 'duet', label: 'Duet' },
          ]}
        />
        <div className="row">
          <button
            className="btn btn-small"
            onClick={() => speak('いらっしゃいませ。', { role: 'teach' })}
          >
            ▶︎ Akari
          </button>
          <button
            className="btn btn-small"
            onClick={() => speak('いらっしゃいませ。', { role: 'quiz' })}
          >
            ▶︎ Tetsu
          </button>
        </div>
        <label className="row">
          <input
            type="checkbox"
            style={{ width: 24, minHeight: 24 }}
            checked={st.slowAudio}
            onChange={(e) => set('slowAudio', e.target.checked)}
          />{' '}
          Slow audio by default
        </label>
        <label className="row">
          <input
            type="checkbox"
            style={{ width: 24, minHeight: 24 }}
            checked={st.respectSilentSwitch}
            onChange={(e) => set('respectSilentSwitch', e.target.checked)}
          />{' '}
          Respect the silent switch
        </label>
        <label className="row">
          <input
            type="checkbox"
            style={{ width: 24, minHeight: 24 }}
            checked={st.soundEffects}
            onChange={(e) => set('soundEffects', e.target.checked)}
          />{' '}
          Sound effects
        </label>
        <label className="row">
          <input
            type="checkbox"
            style={{ width: 24, minHeight: 24 }}
            checked={st.haptics}
            onChange={(e) => set('haptics', e.target.checked)}
          />{' '}
          Haptics
        </label>
        <p className="muted small">
          Until a pack is voiced on the Mac, your device's Japanese voice reads every line.
        </p>
      </section>
      <section className="card stack">
        <h2>Theme</h2>
        <Seg
          label="Theme"
          value={st.theme}
          onChange={(v) => set('theme', v)}
          options={[
            { v: 'system', label: 'System' },
            { v: 'light', label: 'Light' },
            { v: 'dark', label: 'Dark' },
          ]}
        />
      </section>
      <section className="card stack">
        <h2>Day starts at</h2>
        <Seg
          label="Day rollover"
          value={st.rolloverHour}
          onChange={(v) => set('rolloverHour', v)}
          options={[0, 2, 4, 6].map((h) => ({ v: h, label: `${String(h).padStart(2, '0')}:00` }))}
        />
        <p className="muted small">
          A late-night session before this hour still counts for the previous day.
        </p>
      </section>
    </div>
  );
}
