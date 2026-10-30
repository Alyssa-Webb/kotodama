# Brief: a more detailed avatar, building on your current one

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Colour notes

`var(--c-ink)` and `var(--c-ink-muted)` flip to light colours in dark mode, so never use them for hair or anything that must stay dark; use `var(--c-hud-bg)` mixed with a hue. Theme variable names are kebab-case (`--c-surface-alt`).

## Task

You drew the current base avatar (`base-traveler` in `world/avatar.json`, front `svg` and `back`). The owner likes its chibi layout and build. **Build on it, without starting over:** keep the same proportions, head and body positions, pose, silhouette, and the `face` coordinates (`cx` 50, `eyeY` 39, `eyeDx` 8, `mouthY` 48, so mood faces still line up). Add depth and detail on top:

- **Hair:** more strand groups and clumps with an inner shade layer, a glossy highlight band, flyaway strands and a subtle ahoge.
- **Face:** softer cheek blush gradients, eyelashes, a lower lash line and a tiny nose shadow.
- **Body:** finger hints on the hands, a neck shadow under the chin, and knee and ankle shading.
- **Sandals:** proper tabi socks with a split toe, and zōri straps with a little knot.
- **Shading:** a consistent soft light from the top-left, a rim light on the shadow side, and ambient occlusion where parts meet.
- **The back view gets the same treatment:** layered hair from behind, the nape shading and the back of the sandals.

Keep the SVG efficient (paths, not hundreds of tiny shapes) so it renders smoothly on phones.

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
