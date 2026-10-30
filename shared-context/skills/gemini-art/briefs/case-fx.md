# Brief: spectacular rarity effects for the gachapon case opening

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes.

## Task

Claude built a case-opening reel for the gachapon (`src/foundations/moments/CaseOpening.tsx`, styles in `src/foundations/moments/case.css`). It works mechanically. The capsule pops, then a strip of prize cards races past a gold marker, decelerates and stops on the prize. Then the reveal plays by rarity through the classes `.m-case-common`, `.m-case-rare` and `.m-case-legendary`, combined with `.m-case-spin` or `.m-case-reveal`. Make it look and feel like a premium case opening, with major effects that escalate by rarity:

- **The reel:** a lavish lacquer-and-gold frame, rarity-colored card backs with a subtle pattern (asanoha or seigaiha), and a glossy marker. While a legendary crawls toward its stop, the frame and marker should start glowing gold, before the player knows why.
- **Common reveal:** a satisfying pop, a soft ring and a sprinkle of sparkles.
- **Rare reveal:** a blue light pillar, rotating rays, two shockwave rings, floating blue sparkles, and the card flipping or bouncing to the front.
- **Legendary reveal:** the screen drops to near black, then a burst: gold rays spinning up, a huge double shockwave, a falling shower of gold petals and coins, a screen shake, a big brushed "伝説" or "LEGENDARY" title slam, and a lingering shimmer on the prize card.
- Add any decorative elements you need inside `CaseReel`'s JSX: extra spans or SVG for sparkles, petals or patterns. Keep its props, state, timers, the strip and marker logic, the `onReveal` and `onCollect` calls, and the tick loop exactly as they are.

## Files you may change

- `src/foundations/moments/case.css`
- `src/foundations/moments/CaseOpening.tsx`: JSX markup and decorative elements only, no logic changes

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
