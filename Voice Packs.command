#!/bin/bash
# Voice Packs for Kotodama. Double-click in Finder.
cd "$(dirname "$0")"
say() { printf '\n\033[1m%s\033[0m\n' "$1"; }

if ! command -v node >/dev/null 2>&1; then
  say "Node.js is not installed."
  echo "Install the LTS version from https://nodejs.org, then double-click this file again."
  read -r -p "Press Return to close." _; exit 1
fi

if ! curl -s -m 2 http://127.0.0.1:50021/version >/dev/null; then
  say "VOICEVOX is not running."
  echo "1. If you don't have it: download VOICEVOX for Mac from https://voicevox.hiroshiba.jp/ and install it."
  echo "2. Open the VOICEVOX app and leave it open (it can stay in the background)."
  echo "3. Double-click this file again."
  open -a VOICEVOX 2>/dev/null && echo "(Trying to open VOICEVOX for you now… wait 20 seconds, then run this again.)"
  read -r -p "Press Return to close." _; exit 1
fi

[ -d node_modules ] || { say "First run: installing tools (about a minute)…"; npm install --no-fund --no-audit; }

say "Voice Packs: starting."
npm run voice:build
read -r -p "Done. Press Return to close." _
