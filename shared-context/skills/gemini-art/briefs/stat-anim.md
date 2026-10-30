# Brief: every number the player cares about animates

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

The owner wants every change the player should notice to be dynamically animated and incredibly polished. Make these animate beautifully:

- **The HP bar** (`.hp-bar`, `.hp-track` and `.hp-fill` in `src/features/lesson/lesson.css`, rendered in `src/features/lesson/Player.tsx`). The fill is driven by `transform: scaleX(...)`. When HP drops, add a lagging "damage chip" layer that drains after the fill with a delay, a red flash and a shake on the bar, and a small heart crack. When HP rises (healing), add a green-gold shimmer sweeping in, a pulse, and floating sparkles. At low HP (under 25%), add a slow heartbeat pulse. You may add decorative spans inside `.hp-bar` in `Player.tsx`, but keep its props and logic.
- **The top-bar counters** (`.stat`, `.stat-yen`, `.stat-hearts`, `.stat-streak`, `.bump` in `src/app/global.css`; the `Stat` component in `src/app/Shell.tsx` adds `.bump` when a value goes up). Make the rise a juicy count-up pop with a glint. Add a matching "drop" style when a value goes down, using a `.dip` class: add it in `Stat` the same way `bump` is added when the value decreases.
- **The XP and goal bars** (`.bar`, `.bar span`, and `.ring` in `global.css` and `home.css`): give them a smooth fill with a leading shine.

## Files you may change

- `src/features/lesson/lesson.css` (HP bar rules only)
- `src/features/lesson/Player.tsx` (decorative markup inside `.hp-bar` only)
- `src/app/global.css` (`.stat*`, `.bump`, `.dip`, `.bar*` rules only)
- `src/app/Shell.tsx` (the `Stat` component only: add the `.dip` class when the value decreases)
- `src/features/home/home.css` (`.ring` rules only)

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
