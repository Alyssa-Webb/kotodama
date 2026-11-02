# 0009 — A traditional Japanese art style per area

> Partly replaced by ADR 0010: hariko is out. Sumi-e and ukiyo-e stand.

- Context: the owner found the chibi house style too generic ("we need our own style a bit more, maybe a more traditional Japanese style"). A Koto style study by Gemini 4 Argon (`design/reference/style-study/`) drew him as an Edo hariko folk toy, an ukiyo-e woodblock print and a sumi-e ink painting. The owner liked all three and chose to give each area its own style, so the change of art tells the player where they are.
- Decision: each area takes the style that suits it.
  - **Home, Town, Shop and gachapon: hariko folk toy (張り子).** The cozy home base of shops and prizes; hariko are the toys sold there, and Koto is a maneki-neko.
  - **The Dojo and Musashi: sumi-e ink.** Brush discipline for the place where you learn to write kana; the historical Musashi was an ink painter.
  - **The road and the city (Bamboo Thicket, City Market, later Castle Town): ukiyo-e woodblock.** Hiroshige's travellers on the Tōkaidō and Edo street life; each region looks like a print you have walked into.
- What stays shared, so it is one game: the header, tab bar and buttons keep one style everywhere; all three styles draw from one palette (vermilion, indigo, gold, washi cream) in `design/tokens.json`; crossing between areas plays a transition (a brush stroke or an unrolling scroll).
- Open: whether characters (the avatar, Koto, Akari, Tetsu) stay hariko everywhere ("hand-painted toys travelling through the paintings of Japan") or are redrawn in each area's style. To be decided after the animated avatar study (`design/reference/style-study/avatar-*`).
- How art is made: designs stay with Gemini 4 Argon (owner rule). 3D models from Tripo are **reference only** (turnarounds and poses rendered to images under `design/reference/`); no 3D ships in the app, so ADR 0007/0008 stand. Animation moves toward frame-by-frame (several drawn poses swapped by opacity at about 12 fps) instead of transform-only tweens, still touching only transform and opacity.
- Consequences: art is redrawn area by area, not all at once; each area's brief names its style. Accessibility rules are unchanged: every style must read at phone size in light and dark, and text never sits on busy art.
