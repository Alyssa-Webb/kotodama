---
name: gemini-art
description: Delegate Kotodama sprites, illustrations and animations to Gemini 4 Argon through the Cursor CLI. Use for any art or motion work (avatar parts, guides, scene art, item art, icons, CSS/SVG animation, moments). Claude keeps code, logic, data, tests and integration.
---

# Gemini art pipeline (Cursor CLI)

Division of labour, set by the owner:

- **Gemini 4 Argon (via Cursor)** draws and animates: SVG sprites, avatar parts, guides, scene art, item art, icons, and the CSS/SVG keyframes that move them.
- **Claude** writes the briefs, owns code and logic (engine, store, audio, layout, routing, data plumbing), reviews every Gemini change, runs the checks and merges.

Gemini's chibi direction is the house style (ADR 0008 follow-up): big heads, small bodies, round shapes, flat saturated fills, a darker bottom shade band, one top-left highlight, no thin outlines, cute at 40–120 px.

## Steps

1. **Commit first.** Gemini works on a fresh git worktree cut from a branch, so whatever it should build on must be committed.
2. **Write the brief** at `.claude/skills/gemini-art/briefs/<name>.md`. Start from `brief-template.md` in this folder: keep its Rules section verbatim and fill in the task. List the exact files Gemini may touch, and keep them disjoint from the files Claude is editing at the same time.
3. **Run it in the background:**

   ```bash
   bash .claude/skills/gemini-art/run.sh <name> <base-branch>
   ```

   The script creates `.claude/worktrees/<name>` on a new branch `art/<name>` from `<base-branch>`, links `node_modules`, runs `agent -p --force --trust --model gemini-4-argon-high` in that worktree with the brief, then commits Gemini's changes on `art/<name>`. The log goes to `.claude/skills/gemini-art/logs/<name>.log`. Use the Bash tool's `run_in_background` and wait for the completion notification; never poll.

4. **Review** with `git diff <base-branch>..art/<name> --stat`, then read the diff. Reject or fix anything outside the brief's file list, any logic or schema change, hard-coded colors (theme CSS variables only), or animation of anything but `transform` and `opacity`.
5. **Verify on the art branch's worktree:** `npx tsc -p tsconfig.json`, `npx eslint src e2e tools`, `npm test` (the CRLF `tools/authoring.test.ts` failure is known on Windows), and a phone-size look in the browser.
6. **Merge** `art/<name>` into the working branch, then run `bash .claude/skills/gemini-art/cleanup.sh <name>`. Never `rm -rf` a worktree folder directly: its `node_modules` is a junction to the main checkout's.

## Notes

- Needs Cursor's CLI agent installed and signed in (`agent login`; on Windows `agent.cmd login`). `run.sh` finds `%LOCALAPPDATA%/cursor-agent/agent.cmd` on Windows or `agent` on PATH; set `CURSOR_AGENT` to override. Never change the machine's PowerShell execution policy to run it.
- Gemini 4 Argon's model id in Cursor is `gemini-4-argon-high` (`agent --list-models` lists all).
- The junction step in `run.sh` uses Windows `mklink /J`; on macOS/Linux replace it with `ln -s "$root/node_modules" "$wt/node_modules"`.
- Several runs may go in parallel when their file lists don't overlap.
- Cursor's provider sometimes drops mid-run (`NonRetriableError: Provider Error`). The runner still commits whatever was finished, so check the diff against the brief, merge any complete parts, and rerun a brief trimmed to what's left.
- If Gemini fails or stalls, the log says why. Rerun with a narrower brief rather than doing the art yourself, unless the owner says otherwise.
