/** Thin VOICEVOX HTTP client (the engine runs locally at 127.0.0.1:50021). */
import type { AudioQuery, Speaker } from './lib';

export const ENGINE = process.env.VOICEVOX_URL ?? 'http://127.0.0.1:50021';

export async function engineVersion(): Promise<string | null> {
  try {
    const r = await fetch(`${ENGINE}/version`, { signal: AbortSignal.timeout(2000) });
    return r.ok ? ((await r.json()) as string) : null;
  } catch {
    return null;
  }
}

export async function speakers(): Promise<Speaker[]> {
  return (await (await fetch(`${ENGINE}/speakers`)).json()) as Speaker[];
}

export async function audioQuery(text: string, speaker: number): Promise<AudioQuery> {
  const r = await fetch(
    `${ENGINE}/audio_query?text=${encodeURIComponent(text)}&speaker=${speaker}`,
    { method: 'POST' },
  );
  if (!r.ok) throw new Error(`audio_query failed (${r.status}) for ${text}`);
  return (await r.json()) as AudioQuery;
}

export async function accentPhrasesFromKana(
  kana: string,
  speaker: number,
): Promise<AudioQuery['accent_phrases']> {
  const r = await fetch(
    `${ENGINE}/accent_phrases?text=${encodeURIComponent(kana)}&speaker=${speaker}&is_kana=true`,
    { method: 'POST' },
  );
  if (!r.ok) throw new Error(`accent_phrases failed (${r.status}) for ${kana}`);
  return (await r.json()) as AudioQuery['accent_phrases'];
}

export async function synthesis(query: AudioQuery, speaker: number): Promise<Uint8Array> {
  const r = await fetch(`${ENGINE}/synthesis?speaker=${speaker}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  if (!r.ok) throw new Error(`synthesis failed (${r.status})`);
  return new Uint8Array(await r.arrayBuffer());
}
