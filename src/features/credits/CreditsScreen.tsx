import { bundledVoiceCredits } from '../../foundations/audio/voice';
import { useGame } from '../../foundations/store/gameStore';

export function CreditsScreen() {
  const packs = useGame((s) => s.packs);
  const voiceCredits = [
    ...new Set([...packs.flatMap((p) => p.voice?.credits ?? []), ...bundledVoiceCredits()]),
  ];
  return (
    <div className="stack">
      <h1>Credits</h1>
      <section className="card stack">
        <h2>Voices</h2>
        <p>
          Pack audio is generated with VOICEVOX, a free Japanese voice engine. Required credit
          lines:
        </p>
        <ul>
          {(voiceCredits.length ? voiceCredits : ['VOICEVOX:冥鳴ひまり', 'VOICEVOX:青山龍星']).map(
            (c) => (
              <li key={c} lang="ja">
                {c}
              </li>
            ),
          )}
        </ul>
        {!voiceCredits.length && (
          <p className="muted small">
            No voiced packs installed yet; your device's Japanese voice is used.
          </p>
        )}
      </section>
      <section className="card stack">
        <h2>Data and libraries</h2>
        <ul className="small">
          <li>
            Spaced repetition: FSRS-6 via ts-fsrs (MIT), by the Open Spaced Repetition project.
          </li>
          <li>Romaji conversion: WanaKana (MIT).</li>
          <li>
            Stroke-order data: KanjiVG by Ulrich Apel, CC BY-SA 3.0 (used when tracing data is
            installed).
          </li>
          <li>React, Vite, Dexie, Zustand, Zod, Motion, lottie-web, fflate (MIT / Apache-2.0).</li>
        </ul>
      </section>
      <section className="card stack">
        <h2>Privacy</h2>
        <p className="small">
          No accounts, no analytics, no ads. Your progress and packs never leave this device unless
          you export them.
        </p>
      </section>
    </div>
  );
}
