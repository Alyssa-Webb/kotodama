# 0003 — Exercise plugins render through five shared shapes

- Context: 14 exercise types, each needing schema + UI + grader; many share the same interaction.
- Decision: each type is an engine plugin (Zod schema in schema/pack.ts, pure `prepare` + `grade`) that produces a Question in one of a few shapes: choose, match, tiles, type, trace, dialogue. React renders shapes, not types.
- Alternatives: one bespoke component per type (14 components, duplicated logic).
- Consequences: adding a type = one engine module; a new interaction = one new shape component. Unknown types are skipped at runtime.
