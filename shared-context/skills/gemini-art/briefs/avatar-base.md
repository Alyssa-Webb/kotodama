# Brief: in-depth avatar (base and outfits, front and back)

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Colour notes

`var(--c-ink)` and `var(--c-ink-muted)` flip to light colours in dark mode, so never use them for hair or anything that must stay dark; use `var(--c-hud-bg)` (dark in both themes) mixed with a hue. Theme variable names are kebab-case (`--c-surface-alt`, not `--c-surfaceAlt`).

## Task

The owner wants an in-depth, polished player character. The avatar is layered SVG in `world/avatar.json` (field `svg`, in a `0 0 100 120` box, drawn base → outfit → headgear → held → companion). This brief covers ONLY the `base` part (`base-traveler`). Outfits come in later briefs. Keep the SVG compact (reuse paths, no needless decimals) so you can finish in one pass:

1. **Redesign** the base (body, head, hair, face) and every outfit as a detailed, charming chibi character: a big expressive head with layered hair strands and a highlight, eyes with irises and shine, cheeks, little hands and feet, and outfits with folds, trims, patterns (asanoha, kasuri), belts and sleeves, all with shade bands and highlights. Keep every `id`, `slot`, `name`, `en`, `price`, `unlock`, `free` and `gacha` value. If the face moves, update the base's `face` object (`skin`, `cx`, `eyeY`, `eyeDx`, `mouthY`) to match.
2. **Back view:** add a `back` field (an SVG fragment in the same box) to the base and to each outfit: the back of the head and hair, the nape, the back of the clothes (an obi bow, the back of the haori, and so on), and feet. No face. It is drawn when the avatar is seen from behind walking into battle.

## Files you may change

- `world/avatar.json`: only `base-traveler`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
