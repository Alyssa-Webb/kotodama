# Brief: Home: softer, kinder, more useful controls

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes.

## Task

The Home tab (`src/features/home/HomeScreen.tsx`, `src/features/home/home.css`) is your camp diorama with Koto, the goal lantern and the next-lesson signpost. The owner's request, in his words:

> "Remember what we said about the big outlines and buttons on the main and town pages? Those are important to remove and replace with something smoother, kinder, and much more functionally useful for the user."

Earlier feedback: "too blocky", "boxes inside boxes", low clutter, compact, easy to scroll; the audience skews young.

Make Home **smoother and kinder**:

- **Remove the heavy outlines.** No thick bordered cards, no chunky outlined buttons, no 3D button slabs. Use soft, light surfaces (gentle tinted backgrounds or none, no borders or hairline ones), generous rounded shapes, and plenty of breathing room.
- **Fewer, clearer actions that do something useful right there.** The primary action is one obvious, friendly "continue your journey" control for the next lesson. Secondary actions read as light text-and-icon rows or chips, not big buttons. If the screen already shows data for them, surface what's useful at a glance, such as today's goal progress, streak, reviews due, or a nudge to Food Street when HP is low.
- **Keep the diorama, Koto, the goal lantern and the signpost.** They're liked. Just let them breathe, without frames around them.
- Keep every link, button, label, piece of game logic and data the screen shows today; change only presentation and layout. Tap targets at least 44 px. Light and dark themes, large text, reduced motion.
- **Performance:** animate only transform and opacity, few loops, no filters, and no entrance animations that scale whole sections.

## Files you may change

- `src/features/home/HomeScreen.tsx`
- `src/features/home/home.css`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
