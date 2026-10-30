# 0005 — Voice reading check: surface → kana query → AquesTalk kana

- Context: KICKOFF says rebuild misread lines via /accent_phrases?is_kana=true, which needs AquesTalk notation (katakana, accent marks, phrase breaks) that packs don't carry.
- Decision: query the surface text; if the moras differ from the furigana reading, query the plain kana reading (VOICEVOX assigns natural accents); only if that still differs, use /accent_phrases with generated AquesTalk kana (accent after the first mora).
- Alternatives: always use is_kana (correct reading but flat, unnatural accents).
- Consequences: readings always match the furigana; accents stay natural in the common case. Per-line overrides can come later as pack data.
