# Brief: Battle: walk along the road, and a backdrop per region

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

Lessons are battles (`src/features/lesson/BattleStage.tsx`, `src/features/lesson/battle.css`): the avatar, seen from behind, walks a road and meets foes. The owner has two problems with it:

1. **The walk moves the screen, not the path.** While walking between foes (`.battle-walking`), the far and mid parallax layers and the road slide sideways, so the **sky** and the whole scene appear to move. That looks wrong. **The sky stays still.** The motion must happen along the road: the road surface (stones, markings, edges) flows toward the viewer down the trail's perspective, roadside props pass by on either side and grow as they near, and the avatar walks up the path toward the next foe. Keep the existing walk timing and class hooks (`battle-walking`), and keep the rule that scenery loops pause while a question is up (`.battle:not(.battle-walking)` rules at the end of battle.css).
2. **Every region looks like the same bamboo wood.** Add a prop `region?: 'dojo' | 'bamboo' | 'market'` to `BattleStage` (default `'bamboo'`) and draw three backdrops:
   - **dojo**: inside a wooden dojo hall: polished floor boards running toward the far wall, a kamiza alcove with a hanging scroll, a weapon rack of bokken, paper lanterns, sunlight through shoji. (The "road" here is the floor's training lane.)
   - **bamboo**: the existing bamboo forest road (keep it, apply fix 1).
   - **market**: an Edo market street at dusk: wooden machiya fronts, yatai food stalls with noren, red chōchin lanterns strung overhead, a sake shop's sugidama ball, the street running into the distance.

Keep `BattleStage`'s other props, exports, timing, sound and game logic exactly as they are (Claude passes `region` in from the lesson). Animate only transform and opacity; few loops; no filters.

## Files you may change

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
