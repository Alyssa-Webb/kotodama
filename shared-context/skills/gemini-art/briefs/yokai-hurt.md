# Brief: yokai damage reactions (hurt eyes and flash silhouettes)

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

Your yokai in `src/foundations/art/Enemy.tsx` need damage reactions. The animations already exist in the enemy section of `src/foundations/art/art.css` (written by the animation specialist; do NOT change those rules). Add the art they animate:

1. **Damage-flash silhouettes:** inside each yokai's SVG, after its body art, add two layers: `<g className="enemy-damage-flash enemy-damage-flash-white">` and `<g className="enemy-damage-flash enemy-damage-flash-red">`. Each holds a copy of that yokai's main body silhouette shapes (body, head, limbs, tail; no eyes or details), filled solid: `var(--c-surface)` for the white layer, `var(--c-danger)` for the red. They're invisible by default; the CSS flashes them on `hit` and `defeat`.
2. **Hurt eyes:** while `state === 'hit'`, swap each yokai's eyes for squeezed `> <` eyes (with a tiny sweat drop or a pained brow if it suits the character). While `state === 'defeat'`, use spiral, swirly KO eyes. Keep each yokai's own style and eye placement; idle, enter and attack keep their normal eyes.

Keep `ENEMY_KINDS`, the props and the states unchanged.

## Files you may change

- `src/foundations/art/Enemy.tsx`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
