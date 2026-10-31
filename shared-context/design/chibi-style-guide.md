# Kotodama chibi style guide (reverse-engineered from Gemini 4 Argon's art)

How Argon builds Kotodama's chibi art, written down so any model, or a human, can reproduce it and new assets match. Every rule below is taken from the shipped SVG (`world/avatar.json` `base-traveler`, `src/foundations/art/Mascot.tsx`, `Enemy.tsx`, `ItemArt.tsx`) and its CSS. **Designs still go to Argon** (see `../README.md`); this guide is for briefing it precisely, reviewing its output, and making small fixes that match its hand.

## 1. Proportions (the 2-head chibi)

- The avatar uses a `0 0 100 120` box. The figure runs from y ≈ 10 (top of the hair) to y ≈ 113 (the ground shadow).
- **The head is about 45% of the figure's height** (y 10 → 55) and **about 46% of the box width** (x 27 → 73). This oversized head is the main thing that makes it chibi. Don't shrink it.
- The body is short and wide (y 55 → 100), with stubby limbs and no visible elbows or knees. The feet are two rounded blocks (about 12 × 11) tucked under the body.
- The face sits in the lower half of the head. The eyes are at y ≈ 39 with centres about 8 apart either side of x = 50, wide apart and low. The mouth sits only about 9 below the eyes.
- Koto (the mascot) has the same head-heavy ratio in a `0 0 400 400` box: a round head, a tiny body, big ears.

## 2. The "molded toy" lip: every form drawn twice

Argon's signature technique. Each shape is painted **twice**:

1. A **shade copy** shifted **+3 units down** (about 2.5% of the box), filled with the base colour darkened toward `--c-hud-bg`, for example `color-mix(in srgb, #f1d3b6 72%, var(--c-hud-bg))` for skin, or `color-mix(in srgb, var(--c-secondary) 62%, var(--c-hud-bg))` for clothes.
2. The **main shape** on top in the flat base colour.

The 3-unit sliver of the shade copy showing underneath reads as the darker bottom band of a moulded plastic toy. There are **no outlines** on the avatar, items or yokai; edges come from the colour contrast and that bottom band. Koto is the one exception: he uses a thick ink outline (`strokeWidth` 8 at 400-unit scale) because he's a mascot sticker.

## 3. Light: one soft top-left highlight

- Light always comes from the **top-left**.
- Add **one highlight per major form**: an ellipse in `var(--c-hud-ink)` at **opacity 0.38–0.42**, **rotated -14° to -18°**, placed on the top-left of the form (for example `rx` 8, `ry` 3.2 on the head).
- Hair adds 1–2 curved shine strokes: `stroke-width` ~3.2, round caps, a `color-mix` of `--c-secondary` toward `--c-hud-ink`, opacity ~0.65.
- No gradients on bodies. Flat fills plus the lip plus one highlight is the whole look. Gradients are only for glows, skies and lacquer UI.

## 4. Faces

- **Eyes, built in layers:**
  1. An outer ellipse in `--c-hud-bg` (`rx` 3.8, `ry` 4.2: slightly tall).
  2. The iris, in `--c-secondary`, nudged **down** (cy +1.2; `rx` 2.8, `ry` 2.6).
  3. The pupil, a circle in `--c-hud-bg` (`r` 1.6).
  4. **Two catchlights** in `--c-hud-ink`: a big one top-left (`r` 1.4, offset −1.5/−1.7) and a small one bottom-right (`r` 0.7, offset +1.4/+1.8). The double catchlight is what makes them sparkle.
- **Brows:** short quadratic strokes, `stroke-width` ~2.1, round caps, set about 6 above the eyes.
- **Mouth:** one quadratic smile stroke, `stroke-width` ~2.3, round caps, about 7 wide. Mood faces swap only the mouth and brows (`Avatar.tsx` `Face`).
- **Blush:** a `--c-petal` ellipse (`rx` 4.5, `ry` 2.6) at opacity ~0.75, below and slightly outside each eye.
- **Nose:** a tiny skin-to-accent ellipse (`rx` 1.2, `ry` 0.8). Barely there.
- **Ears:** a circle (`r` 5.5) on the head's sides with an inner circle in skin mixed with accent.

## 5. Hair

- Two stacked paths, each with its own lip: back hair at `color-mix(in srgb, var(--c-hud-bg) 90%, var(--c-secondary))`, front hair at `… 80% …`. That gives dark hair with a blue cast in both themes.
- **Scalloped bangs:** the hairline is a chain of `C` curves dipping to about y 31 between peaks. Side locks come down to about y 45.
- Then the shine strokes and the highlight ellipse from section 3.

## 6. Colour recipes (theme-safe)

| Use                                                   | Recipe                                                                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Skin                                                  | `#f1d3b6`, with its lip at `color-mix(in srgb, #f1d3b6 72%, var(--c-hud-bg))`. This is the only hex allowed              |
| Shading any colour                                    | `color-mix(in srgb, <base> 58–72%, var(--c-hud-bg))`                                                                     |
| Warm skin tints (ears, nose)                          | `color-mix(in srgb, #f1d3b6 64–68%, var(--c-accent))`                                                                    |
| Anything that must stay dark (hair, pupils, outlines) | `var(--c-hud-bg)`, optionally mixed with a hue. **Never** `--c-ink` or `--c-ink-muted`, which flip to light in dark mode |
| Highlights and catchlights                            | `var(--c-hud-ink)` or `var(--c-coin-shine)`                                                                              |
| Ground shadow                                         | an ellipse in `var(--c-shadow)` under the feet (`rx` ≈ half the body width, `ry` ≈ 5)                                    |

Theme variable names are kebab-case: it's `--c-surface-alt`, not `--c-surfaceAlt` (Argon got this wrong once).

## 7. Motion conventions

- **Part-based animation:** every moving part has its own class and keyframes (`koto-blink`, `koto-ear-twitch-l/r`, `koto-flame-flicker`, `koto-mouth-flap`, `koto-mustache-wobble`). Idle life comes from a few of these overlapping at different periods, so it never looks looped.
- **Durations come from tokens**, for example `calc(var(--dur-celebrate, 900ms) * 4.8)` for a blink cycle, so the whole game's tempo can be tuned in one place.
- **Characters pivot at the feet** (`transform-origin: 50% 92–100%`). Squash and stretch preserve volume (scale X up when Y goes down).
- **Poses are classes** (`koto-pose-wave`, `koto-pose-talk` and so on) that swap silhouettes and the active part animations. React only changes the class.
- **Yokai:** grounded kinds bob and their shadow stays put. Floating kinds hover a few units up, and their shadow shrinks and fades in sync (`enemy-shadow-float`). `enter` is always a ghostly fade-in, never a pop.
- Animate **only `transform` and `opacity`**, always with a `prefers-reduced-motion` fallback.

## 8. Back views

- These are the same silhouette as the front, with the face replaced by more hair: layered nape locks, a crown whorl and the same highlight.
- They show the back of the clothes (collar, centre seam, the obi bow) and the soles and heel straps of the sandals.
- They live in the part's `back` field and are drawn when `facing="back"` (battle walks).

## 9. Checklist for reviewing a new asset

- [ ] A head-heavy chibi ratio (head ≈ 45% of height)
- [ ] Every form has the +3 shade lip; no outlines (except Koto)
- [ ] One top-left highlight per form, opacity about 0.4
- [ ] Eyes have two catchlights; the face sits low on the head
- [ ] Only theme variables (plus skin hex); dark parts use `--c-hud-bg`; kebab-case names
- [ ] Still reads at 40 px; checked in light **and** dark
- [ ] Motion uses only transform and opacity, pivots sensibly, respects reduced motion

## 10. Rejected styles: don't repeat these

Everything the owner has turned down, so a fresh run starts knowing it. Each was tried and rejected.

- **3D or three.js.** It lagged on phones and looked worse; the game is 2D only.
- **Heavy outlines and boxy UI:** thick bordered cards, chunky outlined or 3D-slab buttons, boxes inside boxes. He wants soft surfaces, breathing room and few, clear actions.
- **Flashy effects:** big glowing slashes, multi-flash strobes, zigzag glow wakes. He wants a thin white slice, a brief hit flash, then hurt and KO animations.
- **Motion that moves the whole scene:** the sky or backdrop sliding when the hero walks. Only the road or floor moves, along the path's perspective.
- **Placeholder backdrops that don't fit the place:** the town on a mountain backdrop. Every location is its own illustrated place.
- **Japanese as UI labels a beginner can't read,** or romaji in place of furigana. Use English UI, with Japanese as furigana-annotated learning hints.
- **Kanji badges or emoji as icons** where a drawn symbol fits.
- **Dark parts in `--c-ink` or `--c-ink-muted`:** they turn light in dark mode (grey hair). Use `--c-hud-bg`.
- **Invented theme variable names** (`--c-surfaceAlt`): names are kebab-case and must exist in `design/tokens.json`.
- **Text overlapping controls,** such as furigana running into a button. Give ruby text its own line height.
- **Lag:** many looping animations inside big SVGs, `filter` or `box-shadow` animation, or entrance animations that scale whole pages.
- **Content that doesn't read at phone size,** or that breaks out of its frame: check at 375 px in light and dark.
- **A design part that reads as something else,** like the first rokurokubi's neck looking like an arm. Make the key feature unmistakable.
