# Brief: avatar walk, attack and hit motion

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

Battle lessons show the player's avatar walking up a road and fighting. Its motion lives in `src/features/avatar/avatar.css`: `.avatar-actor[data-mood=...]` and `[data-facing='back']`, animating `.avatar-motion` and `.avatar-shadow`. Make it dynamic and full of character (anticipation, follow-through, secondary motion, hit-stop), not just squash and stretch:

- `walk`: a chibi walk cycle with alternating step tilts, weight shift, a bob on each footfall, a slight forward lean, and the shadow squashing on each step.
- `strike`: an attack seen from behind, with a wind-up crouch, a fast lunge up the road with a motion smear (a pseudo-element streak), a hit-stop hold, follow-through and recovery.
- `worried`: a hit reaction: knocked back with a quick shake, a stagger, then a recovery.
- `cheer`: a victory hop, twice, with a spin.

Keep every `data-mood` value and the class names. CSS only.

## Files you may change

- `src/features/avatar/avatar.css`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
