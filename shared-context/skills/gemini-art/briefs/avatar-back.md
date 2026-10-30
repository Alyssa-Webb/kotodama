# Brief: the avatar redesign, the back view and a real walk

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

Advance the player avatar's design in the house chibi style, and give it a back view.

1. **Redesign** every part in `world/avatar.json` (field `svg`, a `0 0 100 120` box layered base → outfit → headgear → held → companion) so it is more charming and polished: a bigger head, expressive eyes, soft shading and tidy silhouettes. Keep every `id`, `slot`, `name`, `en`, `price`, `unlock`, `free` and `gacha` value. If you move the face, update the base part's `face` object (`skin`, `cx`, `eyeY`, `eyeDx`, `mouthY`) to match, and update the mood faces in `src/features/avatar/Avatar.tsx` (`Face`) to the new style.
2. **Back view:** add a `back` field to every part. It is an SVG fragment in the same box, drawn when `facing="back"` (battle lessons show the avatar from behind, walking up a road toward enemies): the back of the head and hair, the back of the clothes, a hat from behind, a held item peeking out at the side, and a companion from behind. No face.
3. **Walk and battle motion** in `src/features/avatar/avatar.css`:
   - `[data-mood='walk']`: a proper chibi walk cycle with alternating steps, weight shift, a bob on each step, a slight forward lean, and the shadow squashing on each footfall.
   - `[data-mood='strike']`: an attack seen from behind, with a wind-up, a swing with a motion smear, follow-through and recovery.
   - `[data-mood='worried']`: a hit reaction (knocked back, then a recover).
   - `[data-facing='back']` variants wherever they read better.

## Files you may change

- `world/avatar.json`
- `src/features/avatar/Avatar.tsx` (the `Face` function only)
- `src/features/avatar/avatar.css`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
