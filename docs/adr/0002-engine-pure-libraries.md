# 0002 — The engine may import pure third-party libraries

- Context: KICKOFF says "engine imports only schema", but the scheduler needs ts-fsrs and graders need WanaKana.
- Decision: "only schema" applies to project layers. src/engine may import src/schema plus pure, DOM-free libraries (zod, ts-fsrs, wanakana); React, Dexie, Zustand, Motion, Lottie, Workbox and browser globals are banned by ESLint.
- Alternatives: wrap ts-fsrs/wanakana behind injected interfaces (more code, no added safety).
- Consequences: engine stays unit-testable in Node; the lint rule lists the banned packages explicitly.
