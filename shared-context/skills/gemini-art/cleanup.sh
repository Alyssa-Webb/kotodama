#!/usr/bin/env bash
# Removes a finished Gemini worktree safely. Its node_modules is a junction to the main
# checkout's: unlink that first, or a recursive delete would follow it and wipe the real one.
# Usage: bash .claude/skills/gemini-art/cleanup.sh <name>
set -euo pipefail
name="$1"
root="$(git rev-parse --show-toplevel)"
wt="$root/.claude/worktrees/$name"
if [ -e "$wt/node_modules" ]; then
  MSYS2_ARG_CONV_EXCL="*" cmd /c rmdir "$(cygpath -w "$wt/node_modules")"
fi
git -C "$root" worktree remove --force "$wt" 2>/dev/null || rm -rf "$wt"
git -C "$root" worktree prune
echo "removed $wt (branch art/$name kept)"
