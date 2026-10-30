/**
 * Pack import: pasted JSON, .json or .jlpack files (zip: pack.json + voice.json + audio), or a URL.
 * Untrusted input: size caps, no path traversal, allowlisted audio types only.
 */
import { unzipSync } from 'fflate';
import { VoiceManifestSchema, type VoiceManifest } from '../schema/pack';

export const MAX_PACK_BYTES = 60 * 1024 * 1024;
export const MAX_JSON_BYTES = 5 * 1024 * 1024;
const AUDIO_TYPES: Record<string, string> = {
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
};

export interface ImportPayload {
  json: unknown;
  voice?: { manifest: VoiceManifest; files: Record<string, Blob> };
}

/** Accepts ChatGPT's reply as-is: strips a ```json fence and any text around the object. */
export function parsePastedJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = (fenced ? fenced[1]! : text).trim();
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start < 0 || end < start)
    throw new Error('No JSON object found. Paste the whole reply from ChatGPT.');
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch (e) {
    throw new Error(`The JSON does not parse: ${e instanceof Error ? e.message : String(e)}`, {
      cause: e,
    });
  }
}

export function safeEntryName(name: string): string | null {
  if (
    name.includes('\\') ||
    name.startsWith('/') ||
    name.split('/').some((p) => p === '..' || p === '')
  )
    return null;
  return name;
}

export function readJlpack(bytes: Uint8Array): ImportPayload {
  if (bytes.byteLength > MAX_PACK_BYTES) throw new Error('This pack is larger than 60 MB.');
  const entries = unzipSync(bytes);
  const files: Record<string, Blob> = {};
  let packJson: unknown;
  let manifest: VoiceManifest | undefined;
  let total = 0;
  for (const [rawName, data] of Object.entries(entries)) {
    if (rawName.endsWith('/')) continue;
    const name = safeEntryName(rawName);
    if (!name) throw new Error(`Unsafe file path in pack: ${rawName}`);
    total += data.byteLength;
    if (total > MAX_PACK_BYTES) throw new Error('This pack unpacks to more than 60 MB.');
    if (name === 'pack.json') {
      if (data.byteLength > MAX_JSON_BYTES) throw new Error('pack.json is too large.');
      packJson = JSON.parse(new TextDecoder().decode(data));
    } else if (name === 'voice.json') {
      manifest = VoiceManifestSchema.parse(JSON.parse(new TextDecoder().decode(data)));
    } else {
      const ext = name.split('.').pop()?.toLowerCase() ?? '';
      const type = AUDIO_TYPES[ext];
      if (!type || !name.startsWith('audio/'))
        throw new Error(`File type not allowed in a pack: ${name}`);
      files[name.slice('audio/'.length)] = new Blob([data as BlobPart], { type });
    }
  }
  if (packJson === undefined) throw new Error('The .jlpack has no pack.json.');
  if (manifest) {
    for (const clips of Object.values(manifest.lines))
      for (const c of Object.values(clips))
        for (const f of [c.normal, c.slow])
          if (f && !files[f]) throw new Error(`Voice manifest points to a missing file: ${f}`);
  }
  return manifest ? { json: packJson, voice: { manifest, files } } : { json: packJson };
}

export async function readFile(file: File): Promise<ImportPayload> {
  if (file.size > MAX_PACK_BYTES) throw new Error('That file is larger than 60 MB.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  // zip files start with "PK"
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return readJlpack(bytes);
  if (file.size > MAX_JSON_BYTES) throw new Error('That JSON file is too large.');
  return { json: parsePastedJson(new TextDecoder().decode(bytes)) };
}

export async function readUrl(url: string): Promise<ImportPayload> {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    throw new Error('That is not a valid link.');
  }
  if (u.protocol !== 'https:') throw new Error('Only https links are allowed.');
  // Gist page links → raw content.
  if (u.hostname === 'gist.github.com' && !u.pathname.endsWith('/raw'))
    u = new URL(`${u.href.replace(/\/$/, '')}/raw`);
  const res = await fetch(u.href);
  if (!res.ok) throw new Error(`Download failed (${res.status}).`);
  const len = Number(res.headers.get('content-length') ?? 0);
  if (len > MAX_PACK_BYTES) throw new Error('That pack is larger than 60 MB.');
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return readJlpack(bytes);
  return { json: parsePastedJson(new TextDecoder().decode(bytes)) };
}
