# 0001 — Project lives in ~/Downloads/kotodama

- Context: the session started in ~/Downloads, which holds unrelated files; CLAUDE.md says "project root".
- Decision: create a dedicated `kotodama/` folder there and treat it as the project root and git repo.
- Alternatives: use ~/Downloads itself (would sweep unrelated personal files into a public repo).
- Consequences: all paths in docs are relative to this folder; it can be moved anywhere later.
