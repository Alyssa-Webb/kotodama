# Brief: dynamic attack effects in battle lessons

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

Battle lessons (`src/features/lesson/BattleStage.tsx`) play effects through these classes in `src/features/lesson/battle.css`: `.battle-fx-slash` (a correct answer hits), `.battle-fx-finisher` (the KO blow), `.battle-arc` (an SVG with one or two `path`s drawn by `stroke-dashoffset`), `.battle-dmg` (the damage number) and `.battle-fx-impact` (the enemy hits the player). Make them spectacular and dynamic, not just squash and stretch: layered slash arcs with motion smears, impact sparks and starbursts built from pseudo-elements, a hit-stop feel, damage numbers that punch in and float away, a big KO finisher (a double slash, a flash ring and a burst), and an enemy hit on the player with a red edge vignette and a jolt. CSS only: keep the existing class names and markup.

## Files you may change

- `src/features/lesson/battle.css` (the attack effect rules only)

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
