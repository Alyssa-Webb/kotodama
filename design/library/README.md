# Art library

What Ken and Alyssa actually think of our art, so briefs can point at real examples instead of describing a style from scratch. The record is `ledger.json`, checked by `tools/art/ledger.test.ts` against `src/schema/library.ts`.

## Rules

- **Only Ken and Alyssa give verdicts.** An AI can't approve art, including its own. If they haven't said it, it doesn't go in.
- **Use their words.** Quote them exactly, or name where the verdict is recorded.
- **Rejected art stays listed,** with the reason, so nobody repeats it.
- Point at the real files instead of copying them.

## Using it in a brief

Fill in the "References" section of the brief template with one or two approved entries that fit the task, plus any rejected entries it could drift towards. Argon reads those files directly. For a Gemini chat zip, put copies of them in the zip.

## Upgrade briefs

Ken's idea: besides drawing new art, a brief can ask Argon to "add complexity to the current design". Keep the existing art's shapes and identity, name exactly what to deepen (such as eyes, hair texture or an animation), and use Musashi as the detail target. Check the result with `npm run art:sheet`, whose frame strip shows animation problems.

## Adding a verdict

When Ken or Alyssa reacts to art, add an entry in the same session. Run `npm test` to check it.

## Review tools

- `npm run art:gate -- <brief-name>` checks an Argon branch without rendering it. It flags files outside the brief, raw colors, and `@keyframes` or transitions on anything but `transform` and `opacity`. It only checks lines the run added.
- `npm run art:sheet -- --name <name> --module <path> --export <Component> [--prop key=value] [--css <path>]` renders one component into `art-sheets/<name>.png`: phone and desktop, light and dark, plus animation frames at 0, 25, 50, 75 and 100%. Use `--route town` for a whole screen, or `--route home` for Home.
- The sheet also flags shapes cut off by their SVG's edge, animations set from code that aren't composited, and browser console errors. A backdrop that runs past its edge on purpose gets flagged too, so read the flags rather than treating them as failures.

What they can't do: judge taste, step motion driven by JavaScript, or measure real frame rate, which still needs a phone. A screen is captured as a new player sees it, with no save data.
