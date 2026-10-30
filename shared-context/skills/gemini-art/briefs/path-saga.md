# Brief: Path: one continuous full-bleed journey map

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

You made the Path tab's journey map (`src/features/path/PathScreen.tsx`, `src/features/path/path.css`). The owner likes the direction, but wants three changes:

1. **Full bleed, no frames.** The map must reach the left and right edges of the screen so you feel you are _on_ the path, not looking at a card. Remove the unit cards' borders, rounded frames and panel backgrounds, and break the map out of the page's side padding (for example `margin-inline: calc(-1 * var(--sp-4))` or whatever the page gutter is; check `src/app/global.css`). Keep text readable with soft scene shading, not boxes.
2. **One continuous trail, top to bottom, like a mobile saga map.** The trail must run unbroken from the very top of the first region to the bottom of the last, flowing through every region; no gaps or restarts between units. Regions blend into each other (bamboo fades into rice fields and so on) instead of sitting in separate blocks. The region signboard can hang beside the trail where a region begins.
3. **Locked nodes must contrast.** The locked shrines, lanterns and stones are dark on a dark background ("black on black"). Give locked markers a light stone or parchment silhouette with a soft lighter outline glow or rim and a padlock or dim dot, so they read clearly as "not yet" in light and dark themes, while open and done nodes stay the brightest.

Keep every link, `aria-label`, lock rule, the current-node avatar, region names (furigana `<ruby>`), and node kinds exactly as they work now. Check it at 375 px wide.

## Files you may change

- `src/features/path/PathScreen.tsx`
- `src/features/path/path.css`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
