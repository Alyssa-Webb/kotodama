#!/usr/bin/env bash
# Runs one Gemini art brief through the Cursor CLI in its own worktree and commits the result.
# Usage: bash .claude/skills/gemini-art/run.sh <name> <base-branch>
set -euo pipefail
name="$1"
base="$2"
root="$(git rev-parse --show-toplevel)"
skill="$root/.claude/skills/gemini-art"
brief="$skill/briefs/$name.md"
wt="$root/.claude/worktrees/$name"
log="$skill/logs/$name.log"
# Cursor's CLI agent: on Windows the .cmd launcher (PowerShell script execution is usually
# disabled, and must not be changed); elsewhere `agent` on PATH. Override with CURSOR_AGENT.
agent="${CURSOR_AGENT:-}"
if [ -z "$agent" ]; then
  if [ -n "${LOCALAPPDATA:-}" ] && [ -f "$LOCALAPPDATA/cursor-agent/agent.cmd" ]; then
    agent="$(cygpath -w "$LOCALAPPDATA/cursor-agent/agent.cmd")"
  else
    agent="agent"
  fi
fi
mkdir -p "$skill/logs"
[ -f "$brief" ] || { echo "missing brief: $brief" >&2; exit 1; }

git -C "$root" worktree add -q -b "art/$name" "$wt" "$base"
# Dependencies come from the main checkout (a junction, so nothing is reinstalled).
MSYS2_ARG_CONV_EXCL="*" cmd /c mklink /J "$(cygpath -w "$wt/node_modules")" "$(cygpath -w "$root/node_modules")" >/dev/null

brief_win="$(cygpath -w "$brief")"
(
  cd "$wt"
  cmd //c "$agent -p --force --trust --model gemini-4-argon-high --add-dir $(cygpath -w "$skill") --output-format text \"Read the brief at $brief_win and carry out everything it asks, following its rules exactly. Edit files only inside the current workspace.\""
) >"$log" 2>&1 || echo "agent exited non-zero; see $log" >&2

cd "$wt"
git add -A
if git diff --cached --quiet; then
  echo "Gemini made no changes; see $log"
  exit 2
fi
git commit -q -m "art($name): Gemini 4 Argon via Cursor

Brief: .claude/skills/gemini-art/briefs/$name.md

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git log --oneline -1
git diff --stat "$base"..HEAD | tail -1
