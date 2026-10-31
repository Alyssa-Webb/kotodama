# Working together: Ken, Alyssa and their AIs

> **Status: INACTIVE.** Ken will say when this goes live. Until then, the AIs keep working as before (Claude takes tasks from Ken, Alyssa's AI from Alyssa) and nothing is posted to GitHub Issues. When it goes live, change this line to `Status: ACTIVE since <date>` in a commit of its own.

Two humans steer: **Ken** (`KenLinz`) and **Alyssa** (`Alyssa-Webb`). Two AIs build: **Claude** (Claude Code, Ken's machine) and **Alyssa's AI** (whatever model she runs). The AIs coordinate with each other directly. The humans decide by voting with GitHub issue assignees.

## 1. GitHub Issues are the source of truth

Every piece of work that changes the game is a GitHub issue on `Alyssa-Webb/kotodama`, created from the **AI proposal** template (`.github/ISSUE_TEMPLATE/ai-proposal.yml`). A proposal says what changes, why, which files and areas it touches, how it will be verified, and which AI would build it.

### Voting with assignees

The **assignees are the vote**. Each human agrees by assigning themselves; removing yourself withdraws your vote.

| Assignees          | Meaning                         | What the AIs may do                                                                                   |
| ------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Nobody             | Proposed, not agreed            | Discuss and refine only. No code                                                                      |
| Ken **or** Alyssa  | One yes, the other hasn't voted | Discuss, prototype on a branch if asked, **no merge to `main`**. Exception: the area-owner rule below |
| Ken **and** Alyssa | **Approved**                    | Build it, verify it, merge to `main`, close the issue with a summary                                  |

- **Area owners can approve alone in their area:** Alyssa for the **Dojo** (`area:dojo`, see `design/dojo.md`), Ken for anything else he names as his. An area owner's single assignment counts as approval for an issue labelled only with their area. Anything that crosses areas needs both votes.
- **Urgent fixes** (`priority:urgent`: the live site is broken, data loss, a crash) can be merged by an AI with one human vote. It must be announced in the chat room and the issue right away, and the other human can revert.
- **A rejection is a comment plus the `status:declined` label** by either human. The AIs never reopen or rework a declined issue unless a human asks.
- **The AIs never assign or unassign humans.** They may assign themselves via the `ai:claude` and `ai:alyssa-ai` labels (bots can't be assignees).

### Labels

| Label                                                                                                                                  | Use                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `ai:claude`, `ai:alyssa-ai`                                                                                                            | Which AI proposed or is building it (one builder at a time)                                     |
| `status:proposal`, `status:approved`, `status:in-progress`, `status:review`, `status:declined`                                         | Lifecycle; the builder moves it along. `status:approved` mirrors the vote, it never replaces it |
| `area:dojo`, `area:battle`, `area:path`, `area:town`, `area:shop`, `area:home`, `area:content`, `area:voice`, `area:art`, `area:infra` | What it touches, for ownership and conflict checks                                              |
| `priority:urgent`                                                                                                                      | Live breakage; see the urgent rule above                                                        |
| `accessibility`, `bug`, `enhancement`, `documentation` (existing)                                                                      | Kind of work                                                                                    |

The labels are created when the rule goes live (`shared-context/chat/setup-labels.sh`).

## 2. How the two AIs work together

- **Claim before you build, on the claims board.** `shared-context/chat/claims.md` is the lock that stops both AIs coding the same thing at once: pull, check that no active claim lists your files, add your row, push **before** writing any code. A rejected push means the other AI claimed first, so pull and re-check. On GitHub, also add your `ai:` label and `status:in-progress` to the issue, and say so in the chat room. One builder per issue, and never edit files another AI has claimed. **The claims board is in use now,** even while the rest of this rule is inactive.
- **One writer per file at a time.** Before starting, check open `status:in-progress` issues for overlapping files. If two issues touch the same files, negotiate in the chat room: who goes first, or split the work.
- **Branches and merges:** work on a branch named `<ai>/<issue-number>-<slug>` (for example `claude/42-town-map`). Open a pull request that links the issue (`Closes #42`). Merge to `main` only when the issue is approved, the checks pass (`npm run check`, and `npx prettier --check .`), and the change was looked at on a phone-sized WebKit render. Never force-push `main`.
- **Review each other.** For anything non-trivial, the other AI reviews the pull request (a short comment is enough) before merge. Humans can review too.
- **Art goes to Gemini 4 Argon** (owner rule, see `README.md`), whichever AI drives it. Run at most two Argon runs at once across both machines; say in the chat room when you start or finish one.
- **Content and save rules:** bump the starter pack `version` with every content change. Never break existing saves (add fields with defaults). Keep ids stable.
- **Disagreements between the AIs** that can't be settled in a couple of messages go to the humans: a comment on the issue, tagging both, with each side's case in two sentences. The humans decide by vote.

## 3. The chat room

`shared-context/chat/room.md` is an append-only log the two AIs use to talk between commits: claims, hand-offs, questions, negotiation and status. Rules:

- Append at the bottom, never edit or delete earlier entries. Pull before writing, so you append to the latest version.
- One entry per message:

  ```
  ### 2026-10-31 14:05 · Claude → Alyssa's AI
  Claiming #42 (town map). Touches src/features/town/*. Starting an Argon run now (1 of 2).
  ```

- Keep it short. Decisions and specs belong in the issue; the room is for coordination.
- Humans can read and write there too; a human message overrides an AI one.

## 4. What goes where

| Thing                                     | Where                                                             |
| ----------------------------------------- | ----------------------------------------------------------------- |
| Work items, proposals, votes              | GitHub Issues (this file's rules)                                 |
| AI-to-AI coordination                     | `shared-context/chat/room.md`                                     |
| Design direction                          | `shared-context/design/*.md` (the Dojo is `design/dojo.md`)       |
| Current state, traps, in-flight work      | `shared-context/HANDOFF.md`                                       |
| Proposals drafted before the rule is live | `shared-context/chat/queued-issues.md` (posted when it goes live) |
