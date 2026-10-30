import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { JaContext } from '../foundations/japanese/Ja';
import { pickGuide, speak } from '../foundations/audio/voice';
import { setRespectSilentSwitch, setSoundEffects } from '../foundations/audio/sfx';
import { applyThemePreference } from '../foundations/theme/theme';
import { setHaptics } from '../foundations/haptics/haptics';
import { useGame } from '../foundations/store/gameStore';

let lineCounter = 0;

/** Wires settings into the Japanese renderer, the voice player, sound and theme. */
export function Providers({ children }: { children: ReactNode }) {
  const settings = useGame((s) => s.save?.settings);
  const lessonCount = useGame((s) => s.save?.lessonCount ?? 0);
  const scriptLevel = settings?.scriptLevel ?? 'furigana';
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
    (text: string, opts?: { role?: string; slow?: boolean }) => {
      // Koto always speaks in his own voice; everything else follows the Voice setting.
      const guide =
        opts?.role === 'koto'
          ? 'koto'
          : pickGuide(voiceMode, {
              lessonIndex: lessonCount,
              lineIndex: lineCounter++,
              ...(opts?.role ? { role: opts.role } : { role: 'quiz' }),
            });
      void speak(text, { guide, slow: opts?.slow ?? slow });
    },
    [voiceMode, lessonCount, slow],
  );
  const value = useMemo(() => ({ scriptLevel, speak: say }), [scriptLevel, say]);
  return <JaContext.Provider value={value}>{children}</JaContext.Provider>;
}
