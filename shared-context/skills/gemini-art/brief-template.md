# Brief: <title>

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

<what to draw or animate, where it appears, timings, references to existing components>

## Files you may change

<exact list; anything else is off-limits>

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
