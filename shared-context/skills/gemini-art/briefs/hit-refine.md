# Brief: refine the battle hits (GPT action animator)

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

You made the battle attack animations (`src/features/lesson/BattleFx.tsx`, `src/features/lesson/battle-fx.css`). The owner wants them more cutting-edge and refined:

1. **Smaller, sharper slashes:** scale every slash, jab and finisher trail down to roughly 55–65% of the current size, centred on the enemy (about 58% left, 34 px from the top of the 156 px `.battle` strip). Make them thinner and crisper, like a precise blade flick. The KO's full-screen impact frame stays big; only its slash and burst shrink.
2. **A damage blink on the enemy:** when the enemy is hit (`Enemy` gets `state="hit"`, from `src/foundations/art/Enemy.tsx`, styled in the enemy section of `src/foundations/art/art.css`), it blinks very briefly: 2–3 quick flashes, alternating white and red, over about 180 ms, like classic game damage frames. Build it as an overlay of the enemy's own silhouette (for example a copy of its SVG shapes, or a mask) whose opacity flashes, so the art keeps its colors otherwise. On the `defeat` (KO) state, give a longer white flash before it bursts. **Exception to the rules for this feature only:** you may also use a very short `filter: brightness()` keyframe if a silhouette overlay isn't possible, but prefer the overlay.
3. **Hurt eyes:** while `state="hit"`, each yokai's eyes change to a damage expression: squeezed `> <` eyes, or spirals for the KO. Swap the eye shapes in `Enemy.tsx` by state, keeping each yokai's design.
4. Add a tiny knockback on hit (the enemy slides back and recovers) and a few small hit sparks that fly from the contact point.

## Files you may change

- `src/features/lesson/BattleFx.tsx`, `src/features/lesson/battle-fx.css`
- `src/foundations/art/Enemy.tsx` (hit and defeat eyes, and the flash overlay)
- `src/foundations/art/art.css` (the enemy section only)

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
