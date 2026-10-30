import { describe, expect, it } from 'vitest';
import { strToU8, zipSync } from 'fflate';
import { parsePastedJson, readJlpack, safeEntryName } from './importer';

describe('importer', () => {
  it('parses a ChatGPT reply with a fenced json block and surrounding text', () => {
    expect(parsePastedJson('Here you go:\n```json\n{"a": 1}\n```\nEnjoy!')).toEqual({ a: 1 });
    expect(parsePastedJson('{"a": 2}')).toEqual({ a: 2 });
    expect(() => parsePastedJson('no json here')).toThrow(/No JSON/);
    expect(() => parsePastedJson('{"a": 1,}')).toThrow(/does not parse/);
  });
  it('rejects path traversal', () => {
    expect(safeEntryName('../evil.json')).toBeNull();
    expect(safeEntryName('/etc/passwd')).toBeNull();
    expect(safeEntryName('audio/../../x')).toBeNull();
    expect(safeEntryName('audio/a.m4a')).toBe('audio/a.m4a');
    const zip = zipSync({ 'pack.json': strToU8('{}'), '../x.m4a': new Uint8Array([1]) });
    expect(() => readJlpack(zip)).toThrow(/Unsafe/);
  });
  it('rejects non-allowlisted media types and missing audio', () => {
    expect(() =>
      readJlpack(zipSync({ 'pack.json': strToU8('{}'), 'audio/x.exe': new Uint8Array([1]) })),
    ).toThrow(/not allowed/);
    const manifest = {
      version: 1,
      credits: [],
      voices: {},
      lines: { みず: { akari: { normal: 'a.m4a' } } },
    };
    expect(() =>
      readJlpack(
        zipSync({ 'pack.json': strToU8('{}'), 'voice.json': strToU8(JSON.stringify(manifest)) }),
      ),
    ).toThrow(/missing file/);
  });
  it('reads pack.json, voice.json and audio files', () => {
    const manifest = {
      version: 1,
      credits: ['VOICEVOX:冥鳴ひまり'],
      voices: {},
      lines: { みず: { akari: { normal: 'a.m4a' } } },
    };
    const r = readJlpack(
      zipSync({
        'pack.json': strToU8('{"x":1}'),
        'voice.json': strToU8(JSON.stringify(manifest)),
        'audio/a.m4a': new Uint8Array([1, 2]),
      }),
    );
    expect(r.json).toEqual({ x: 1 });
    expect(Object.keys(r.voice!.files)).toEqual(['a.m4a']);
  });
});
