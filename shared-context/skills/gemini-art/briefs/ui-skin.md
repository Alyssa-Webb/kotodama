# Brief: make the UI feel like a game, not a stack of boxes

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

The owner says the UI feels "blocky": a column of rectangular cards and buttons, like a quiz website, not a creative, playful, interactive game. Restyle the whole UI skin so it feels like a hand-made game world, using CSS only (plus small inline SVG data URIs if needed):

- **Organic shapes instead of boxes:** cards become things in the world (wooden signboards, paper scrolls, lacquer trays, cloth noren, ema plaques) with uneven, hand-cut silhouettes (for example `border-radius` with varied corner radii, `clip-path` notches, tabs, pins, stitched or rope edges as pseudo-elements). Not every card the same: vary them by role (`.home-hero`, `.next-card`, `.question`, `.result-hero`, shop item cards, path units).
- **Buttons as toys:** chunky, glossy, squishy pill and pebble shapes with a thick darker bottom lip that compresses on press (the existing `.btn:active` press), slight playful tilt on some, icon bubbles. The primary button should feel like a big candy-like "play" button.
- **The tab bar** becomes a floating wooden or lacquer dock with the active tab popping up into a round badge.
- **Motion:** subtle idle life (a gentle sway on hanging signs, shimmer on primary buttons), springy entrances, hover and press feedback. Lists should not look like spreadsheets: stagger and slightly offset them.
- **Backgrounds:** a richer, textured page background (layered gradients and soft shapes) rather than flat panels.
- Keep everything readable and accessible: contrast, focus rings (`:focus-visible`), tap targets of at least 44 px, large-text friendly. No layout that breaks at 390 px wide.

## Files you may change

- `src/app/global.css`
- `src/features/home/home.css`, `src/features/path/path.css`, `src/features/town/town.css`, `src/features/lesson/lesson.css`, `src/features/avatar/avatar.css` (only the `.avatar-stage` part), `src/foundations/art/art.css`

Do NOT change any `.tsx`/`.ts` file, class names used by components, `src/foundations/moments/*`, or `src/foundations/fx/*`. Restyle existing class names only.

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
