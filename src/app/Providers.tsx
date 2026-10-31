import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { JaContext } from '../foundations/japanese/Ja';
import { pickGuide, resolveGuide, speak } from '../foundations/audio/voice';
import { setRespectSilentSwitch, setSoundEffects } from '../foundations/audio/sfx';
import { applyThemePreference } from '../foundations/theme/theme';
import { setHaptics } from '../foundations/haptics/haptics';
import { useGame } from '../foundations/store/gameStore';

let lineCounter = 0;

/** Wires settings into the Japanese renderer, the voice player, sound and theme. */
export function Providers({ children }: { children: ReactNode }) {
  const settings = useGame((s) => s.save?.settings);
  const lessonCount = useGame((s) => s.save?.lessonCount ?? 0);
  // Japanese is shown as kanji with hiragana furigana for now; the only switch is the kana.
  const scriptLevel = 'furigana' as const;
  const kana = settings?.kana ?? 'hiragana';
  const voiceMode = settings?.voiceMode ?? 'alternate-lesson';
  const slow = settings?.slowAudio ?? false;

  useEffect(() => {
    if (!settings) return;
    applyThemePreference(settings.theme);
    setSoundEffects(settings.soundEffects);
    setRespectSilentSwitch(settings.respectSilentSwitch);
    setHaptics(settings.haptics);
  }, [settings]);

  const say = useCallback(
    (
      text: string,
      opts?: { role?: string; slow?: boolean; guide?: 'akari' | 'tetsu' | 'koto' },
    ) => {
      // A screen that shows a guide pins the voice to them (so Tetsu sounds like Tetsu); Koto always
      // speaks in his own voice; everything else follows the Voice setting.
      const guide = resolveGuide(opts, () =>
        pickGuide(voiceMode, {
          lessonIndex: lessonCount,
          lineIndex: lineCounter++,
          ...(opts?.role ? { role: opts.role } : { role: 'quiz' }),
        }),
      );
      void speak(text, { guide, slow: opts?.slow ?? slow });
    },
    [voiceMode, lessonCount, slow],
  );
  const value = useMemo(() => ({ scriptLevel, kana, speak: say }), [scriptLevel, kana, say]);
  return <JaContext.Provider value={value}>{children}</JaContext.Provider>;
}
