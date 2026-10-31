# Brief: Battle backdrops per region

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

Lessons are battles in `src/features/lesson/BattleStage.tsx` (with `battle.css`). You just rebuilt its walk: the sky stays still and the road flows toward the viewer. Every story region still fights in the same bamboo wood. Add one backdrop per region:

1. Create `src/features/lesson/BattleBackdrops.tsx` (styles in `src/features/lesson/battle-backdrops.css`) exporting two self-contained SVG backdrop components that fill the battle window behind the road and the actors, same viewBox and coordinate system as the current bamboo backdrop in `BattleStage`:
   - `DojoHallBackdrop`: **inside a wooden dojo hall.** Polished floorboards running toward the far wall (the training lane is the "road"), a kamiza alcove with a hanging scroll at the back, a weapon rack of bokken, paper lanterns, warm sunlight through shoji screens. Alyssa will reuse this component for the Dojo interior, so keep it self-contained (no props needed beyond an optional `className`).
   - `MarketStreetBackdrop`: **an Edo market street at dusk.** Wooden machiya fronts on both sides, yatai food stalls with noren, red chōchin lanterns strung overhead, a sake shop's sugidama ball, the street running into the distance.
2. In `BattleStage`, add a prop `region?: 'dojo' | 'bamboo' | 'market'` (default `'bamboo'`) and render the matching backdrop in place of the bamboo sky and scenery layers (keep bamboo exactly as it is for `'bamboo'`). In the dojo and market, the road and walk you built should read as the hall's floor lane or the street; adjust road colours per region if needed.
3. Keep the walk choreography: the sky or ceiling stays still and only the floor or road moves. Keep the rule that scenery loops pause while a question is up (`.battle:not(.battle-walking)`), and keep every other prop, export, timing, sound and piece of logic exactly as it is.

Animate only transform and opacity, few loops, no filters. Keep each backdrop compact (about 200 lines of SVG).

## Files you may change

- `src/features/lesson/BattleBackdrops.tsx` (new)
- `src/features/lesson/battle-backdrops.css` (new)
- `src/features/lesson/BattleStage.tsx`
- `src/features/lesson/battle.css`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
