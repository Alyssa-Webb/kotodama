# Brief: Home redesign A: the scene is the UI

You are the art and animation specialist on Kotodama, an offline-first PWA (React + TypeScript + Vite) that teaches Japanese as a game. Claude owns the code and will review, test and merge your work.

## House style

Chibi and cute, the direction you set earlier: big heads, small bodies, round chunky shapes, flat saturated fills, a darker bottom shade band under every form, one soft top-left highlight, no thin outlines. Japanese-themed, original (not Duolingo's characters). It must read at 40–120 px, in light and dark themes. Match the established techniques in `shared-context/design/chibi-style-guide.md`: proportions, the +3 shade lip, one top-left highlight, two-catchlight eyes and the colour recipes. Read its section 10, **Rejected styles**, and avoid every item on it.

## Task

The owner, about the current Home (`src/features/home/HomeScreen.tsx` and `home.css`):

> "I don't think the home screen needed an edit, it needed a redesign. I love the content itself, just not the format. It looks like any regular plain old Home Screen. I dislike it because of how simple it is, it's the first thing our users see. It should be stylized. Creative. It should take risks."

**Redesign the format from scratch.** Keep the _content_ (every piece below) and your existing art pieces where they fit (the camp diorama, Koto, the goal lantern, the signpost, the tile emblems), but throw away the stacked-cards-and-rows dashboard layout. This must not look like a normal app home screen.

**Content that must stay, with its data and links unchanged** (read the current `HomeScreen.tsx` for exact props and logic):

- The time-of-day greeting from Koto (`hello.ja` speakable, with `hello.en`) and the tour button (`<TourButton />`)
- Today's goal (`s.todayXp / s.goal`, the goal-met state), the streak (`s.streak`, with the flame lit when active), yen (`s.yen`), koban (`s.tokens` when > 0), reviews due (`s.due`)
- The next lesson: title, unit and the start link (`next.href`; "Continue" or "Start your first lesson"), the avatar, and the Packs link when there's no next lesson
- Food Street when HP is low (`lowHp`, `/food`, HP x / max)
- Dojo (`/dojo` when reviews are due, else `/reviews`; "N spirits fading"), Town (`/town`, districts awake), Arcade (`/modes`), Spirits (`/collection`, spirits awake)

**The management desk (required, the heart of Home).** The owner: "There needs to be a central place the user can see all of the notifications, daily status, the coins the town has, like a management desk." Build it into your concept as a real in-world object, not a plain panel: for example a traveller's writing desk or a merchant's counter with an abacus, ledger, coin pouch and a stack of letters or notes. It must show, with its data from the ready-made hook `useDesk()` in `src/features/home/desk.ts` (read it; don't change it):

- **Notifications** (`desk.notes`, most important first): each is a short line with an optional control (`to` → a `<Link>`; `act` → a `<button>`; `cta` is its label; `tone` is `urgent`, `reward` or `info`, so style them distinctly). Show them as letters, tags or notes on the desk; with none, show a calm "All quiet today" state.
- **Daily status** (`desk.status`): goal progress (`todayXp/goal`, `goalPct`, `goalMet`), streak, HP (`hp/maxHp`, may be null in casual mode), yen, koban, reviews due.
- **The town's coins** (`desk.town`): `pending` yen waiting, `perHour`, `open/total` districts, and a **Collect** control that calls `desk.town.collectAll()` (it returns the yen collected; show a little coin burst). Also a link to the Town.

Use the desk's data rather than duplicating it; you may remove the old separate status bits that the desk now covers.

**Hard rules:**

- Every action is a real, focusable control (`<Link>` or `<button>`) with an accessible name; tap targets at least 44 px.
- Works at 375 px wide, light and dark, large text and reduced motion.
- **Performance** (the owner's phone lags on heavy scenes): animate only transform and opacity, at most about 6 looping animations, no filters, and no entrance animations that scale whole sections. A full-screen scene is fine if it's one SVG with few animated parts.
- Read `shared-context/design/chibi-style-guide.md` §10 **Rejected styles** and avoid all of it: no heavy outlines, no boxy cards, no 3D slab buttons.
- Change only presentation and layout; keep the game logic, hooks and data as they are.

### Your concept: "The scene is the UI"

Home is **one illustrated, full-bleed scene, with no cards or panels at all.** The player stands at the traveller's camp at a crossroads at the head of the road, and every piece of content is _something in the world_:

- the **signpost** is the next-lesson control (the lesson's name is painted on its arm and tapping the arrow starts it)
- the **dojo gate** is Dojo reviews (spirits fading show as dim wisps at the gate)
- the **town on the hill** is the Town (its lit windows show how many districts are awake)
- a **festival game stall** is the Arcade
- **fireflies** are your Spirits (their count in a little jar)
- the **goal lantern** fills with today's XP, and the **campfire** is the streak (burning when alive)
- when HP is low, **a steaming food cart** rolls into the scene (Food Street)
- Koto greets you in a speech bubble from the scene

Labels are small painted wooden tags or ink brush lettering on the objects, not UI text blocks. The time of day (from the current greeting logic) changes the sky and lighting. The **management desk** sits at the camp as the hero's travel desk (a low writing desk with ledger, abacus, coin pouch and letters), and it's where the notifications, status and town coins live. The scene should fill the screen (break out of the page gutter) and may be taller than the screen, with a gentle vertical layout so everything is reachable by scrolling a little.

## How to work (important)

Long single responses get cut off by the connection. **Build in small pieces and save each file as soon as it's written:** put the scene art in its own new files of under about 300 lines each (for example `src/features/home/scene/Sky.tsx`, `Camp.tsx`, `Desk.tsx`, `Landmarks.tsx`), write each file immediately, then wire them into `HomeScreen.tsx` last. Never compose the whole screen before writing anything.

## Files you may change

- `src/features/home/HomeScreen.tsx`
- `src/features/home/home.css`
- new files under `src/features/home/scene/`

## Rules (keep verbatim)

- 2D only: inline SVG + CSS. No 3D, canvas engines, images, fonts, network downloads or new npm dependencies.
- Animate ONLY `transform` and `opacity` (no `filter`, `box-shadow`, layout properties). Respect `prefers-reduced-motion`.
- Colors: theme CSS variables only (`var(--c-*)` from `design/tokens.json`). The avatar base's skin hex in `world/avatar.json` is the one exception.
- Keep every exported name, prop, data id and timing value unless the task says otherwise. Do not touch `src/engine/`, `src/schema/`, storage, the store or game logic.
- Do not run `git commit`, `git push` or install anything.
- When done, run `npx tsc -p tsconfig.json`, `npx eslint src` and `npm test` and fix what you broke (`tools/authoring.test.ts` already fails on this Windows checkout: ignore it).
- Finish with a short summary: every file you changed and what you did.
