# Brief: the battle scene, path and enemies

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

The battle lesson scene is "incredibly bare bones" (owner). It's the strip above every lesson question: `src/features/lesson/BattleStage.tsx`, styled by `.battle`, `.battle-road`, `.battle-verge`, `.battle-foe` and `.battle-hero` in `src/features/lesson/battle.css`. The player's avatar is seen from behind at the bottom, walking up a woodland path toward a yokai enemy. Make it a rich little diorama:

1. **Scene:** a parallax background with layered hills or mountains, bamboo and cedar silhouettes, distant torii and lanterns and a soft sky; a winding dirt path with perspective (wider near the bottom, narrowing up the road) that has stones, ruts, grass tufts, flowers and pebbles; and foreground leaves at the edges. While `.battle-walking` is set, the verges, tufts and stones scroll toward the viewer to show walking (pause, don't remove, when it's off). You may add decorative elements inside `BattleStage.tsx`'s JSX. Keep its props, state, effects and existing class names.
2. **Enemies:** redraw `src/foundations/art/Enemy.tsx` (keep `ENEMY_KINDS`, `Enemy({ kind, state, size })` and the states `idle`, `enter`, `hit`, `attack` and `defeat`). Draw distinct, detailed, cute-menacing chibi yokai: `inkling` (an ink drop with a brush tail), `glitchling` (scrambled kana tiles) and `kasa-obake` (a one-eyed hopping umbrella), each with a ground shadow so they clearly stand ON the path. The ghostly ones hover a little above it with a soft shadow. Add `kitsune` and `kappa` too if you have room. `enter` is a ghostly fade-in.
3. **Placement:** the enemy must sit on the path at a believable depth, smaller further up the road (adjust `.battle-foe`). The hero stands on the path near the bottom.

Animate dynamically (secondary motion, particles from spans, parallax), transform and opacity only.

## Files you may change

- `src/features/lesson/BattleStage.tsx` (decorative JSX only)
- `src/features/lesson/battle.css` (scene, path and placement rules; leave the attack-effect rules)
- `src/foundations/art/Enemy.tsx`
- `src/foundations/art/art.css` (the enemy section only)

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
