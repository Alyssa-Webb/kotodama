# Brief: attack animations and a yokai bestiary

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

Battle lessons (`src/features/lesson/BattleStage.tsx`) show a road with an enemy. A correct answer is the player's strike, and a wrong answer is the enemy's attack.

1. **Enemies:** `src/foundations/art/Enemy.tsx` exports `ENEMY_KINDS` and `Enemy({ kind, state, size })` with states `'idle'`, `'enter'`, `'hit'`, `'attack'` and `'defeat'`. Its art is a placeholder blob. Draw distinct, cute-menacing chibi yokai from Japanese folklore, each with its own silhouette: `inkling` (an ink drop), `glitchling` (scrambled kana tiles), `kasa-obake` (a one-eyed hopping umbrella), `kitsune` (a fox with an illusion flame), `kodama` (a tree spirit), `kappa` (a water-dish head and a cucumber), `tanuki` (a leaf on its head and transformation smoke), `chochin-obake` (a lantern ghost), `tengu` (a red face, long nose and fan), `oni` (horns and a club) and `noppera-bo` (the faceless one). Put them all in `ENEMY_KINDS`.
   - Animate every state with personality. `enter` must be a ghostly fade-in from the air, never a pop. `attack` is a clear attack toward the player: a lunge, a projectile, a breath or a fan gust.
   - Styles go in the enemy section at the end of `src/foundations/art/art.css`.
2. **Attack effects** in `src/features/lesson/battle.css`: restyle `.battle-fx-slash`, `.battle-fx-finisher`, `.battle-arc`, `.battle-dmg` and `.battle-fx-impact` into polished slash arcs with motion smears, impact sparks and damage numbers, plus a big KO finisher. Use transform and opacity only.

## Dynamic, not just squash

The owner wants animation that is more dynamic than squash and stretch: layered secondary motion (tails, ears and cloth that lag and settle), particles (sparks, ink droplets, leaves, smoke puffs, as small absolutely positioned spans or SVG shapes animated individually), motion trails and smears, anticipation holds, hit-stop (a brief freeze on impact), and camera-like punches (a quick scale on the whole battle scene, done through the effect layers). Keep to transform and opacity.

## Files you may change

- `src/foundations/art/Enemy.tsx`
- `src/foundations/art/art.css` (the enemy section only)
- `src/features/lesson/battle.css` (the attack effect rules only)

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
