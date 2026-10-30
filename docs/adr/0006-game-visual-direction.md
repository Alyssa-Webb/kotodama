# 0006 — Owner asked for a game-grade look before ChatGPT's design arrives

- Context: CLAUDE.md assigns final visual design to ChatGPT, but the owner reviewed the first build and asked for a far more lifelike, video-game feel now.
- Decision: build a full placeholder art kit in code (living SVG scene, animated guides, boss, buildings, icons), a canvas FX layer and a game UI skin, all driven by design/tokens.json and design/animations.json (new slots: kiai.start, heart.lost, coin.earned, boss.hit, boss.attack; per-slot particles, flash, shake).
- Alternatives: wait for ChatGPT's art (owner explicitly did not want that).
- Consequences: ChatGPT can still replace every color, duration and effect as data; illustrated art can replace the SVG components behind the same props.
