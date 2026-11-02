# Kotodama: one Town building in a new look (a single test)

You are the art specialist on **Kotodama**, a free, offline-first web app (React + TypeScript) that teaches Japanese as a game. Claude reviews and merges your work.

## Why this exists

The owner rejected the painted toy (hariko) look completely: "I hate the toy aesthetic completely." The Town now moves to **faceted, isometric low-poly shapes**, inspired by the feel of Kingdoms and Castles, which the owner praises for its "simplicity yet complexity in design." Don't copy that game's art. This one building decides whether the look works as inline SVG, so make it your best work.

## Task

Redraw **`src/features/town/buildings/Station.tsx`**: a small **present-day Japanese train station**, seen from an isometric angle, on a small faceted patch of ground.

- Present-day, not Edo: a simple station house with a flat or low modern roof, a platform with a canopy, tracks with a short commuter train, overhead wires and one or two poles, a vending machine or bench.
- **Simple overall shapes, rich detail placed on purpose.** It must read as "station" at 120 px wide, and reward a closer look: window rows, the train's stripe, the platform edge line, a small sign shape.
- Every surface is flat facets. Light it consistently from the top left: each block gets three tones (top lightest, left middle, right darkest). Trees or shrubs, if any, are faceted too.
- No text or fake Japanese writing anywhere. Use blank sign shapes.

## Technical rules

- Keep the export and props exactly: `export function Station({ lit }: { lit: boolean })`, returning a single `<g>`. `src/features/town/buildings/BuildingArt.tsx` wraps it in `<svg viewBox="0 0 120 96">` and draws a shadow ellipse. Stay inside that viewBox with nothing cut off, sitting on the shadow around y=81.
- `lit` is true once the player has restored the building, and false before. Same shapes; unlit is dimmer and greyer.
- Remove the import from `./hariko` and don't use any helper from it. Define a small palette at the top of the file.
- Colors are **only** theme variables: `var(--c-*)` from `design/tokens.json`, using the names under `colors` (`surfaceAlt` becomes `--c-surfaceAlt`). `color-mix(in srgb, var(--c-a) 70%, var(--c-b))` is fine for tones. No hex, `rgb()` or named colors. It must look right in both light and dark, and the owner especially likes the light palette.
- Inline SVG only: no images, filters, gradients, fonts or new dependencies. No outlines; forms are defined by their tones.
- Animation is optional. At most one small touch, using only `transform` and `opacity`, in a `<style>` tag inside the group.
- Aim for 60 to 150 shapes.

## Avoid

- Anything that looks like a painted toy: chalky white bodies, rounded molded lips, red, white and blue folk patterns, thick soft shapes.
- Old-style tiled, curved or pagoda roofs. Earlier attempts kept drifting back to these.
- Busy clutter that turns to noise at 120 px.

## References

Read these first. Match the approved ones; stay away from the rejected ones. Verdicts come from `design/library/ledger.json`.

- Approved direction: `design/reference/server-art/explore/sheet-tiny-blocks.jpg`, top row. Concept images of the faceted look. Take the lighting and facets. They're rural and not modern, so don't copy the buildings. They are not art to ship.
- Rejected: the current `src/features/town/buildings/Station.tsx` and `hariko.tsx` (the toy look). Use Station.tsx only for its props and export.

## Files you may change

- `src/features/town/buildings/Station.tsx`

## How to work (keep verbatim)

Long single responses get cut off by the connection ("Provider Error"). **Build in small pieces and save each file as soon as it's written:** split big art into several files of under about 300 lines, write each one immediately, and wire everything together last. Never compose a whole screen before writing anything.

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
