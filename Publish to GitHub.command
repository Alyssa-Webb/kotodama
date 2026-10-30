#!/bin/bash
# Publishes Kotodama to your GitHub account and turns on free hosting (GitHub Pages).
# Double-click this file in Finder. It is safe to run more than once.
set -euo pipefail
cd "$(dirname "$0")"

say() { printf '\n\033[1m%s\033[0m\n' "$1"; }

if ! command -v gh >/dev/null 2>&1; then
  say "The GitHub CLI is not installed."
  echo "Install it from https://cli.github.com (or run: brew install gh), then double-click this file again."
  read -r -p "Press Return to close." _; exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  say "Step 1/4: Sign in to GitHub (a browser window will open)."
  gh auth login --web --git-protocol https
fi

USER_NAME="$(gh api user -q .login)"
say "Signed in as $USER_NAME."

if gh repo view "$USER_NAME/kotodama" >/dev/null 2>&1; then
  say "Step 2/4: The kotodama repository already exists; pushing the latest code."
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$USER_NAME/kotodama.git"
  git push -u origin main
else
  say "Step 2/4: Creating the public repository kotodama and pushing the code."
  gh repo create kotodama --public --source . --push \
    --description "Kotodama 言霊 — learn Japanese as a hardcore game. Free, offline-first PWA."
fi

say "Step 3/4: Turning on GitHub Pages (Source: GitHub Actions)."
gh api -X POST "repos/$USER_NAME/kotodama/pages" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/$USER_NAME/kotodama/pages" -f build_type=workflow >/dev/null 2>&1 \
  || echo "Could not set it automatically. Open https://github.com/$USER_NAME/kotodama/settings/pages and set Source to GitHub Actions."

say "Step 4/4: Starting the first deploy."
gh workflow run deploy.yml >/dev/null 2>&1 || true
echo "Watch it here: https://github.com/$USER_NAME/kotodama/actions"
echo
echo "In about 2 minutes Kotodama will be live at:"
echo "    https://$(echo "$USER_NAME" | tr '[:upper:]' '[:lower:]').github.io/kotodama/"
echo
read -r -p "Done. Press Return to close." _
