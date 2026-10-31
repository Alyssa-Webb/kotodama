#!/usr/bin/env bash
# Creates the collaboration labels (see ../COLLABORATION.md). Run once, when the rule goes live:
#   bash shared-context/chat/setup-labels.sh
# Safe to re-run: --force updates a label that already exists.
set -euo pipefail
R=Alyssa-Webb/kotodama
mk() { gh label create "$1" -R "$R" --color "$2" --description "$3" --force >/dev/null && echo "  $1"; }

mk 'ai:claude' 'D97757' 'Proposed or built by Claude (Ken)'
mk 'ai:alyssa-ai' '8957E5' "Proposed or built by Alyssa's AI"
mk 'status:proposal' 'C5DEF5' 'Proposed; waiting for votes'
mk 'status:approved' '0E8A16' 'Ken and Alyssa both assigned (or the area owner)'
mk 'status:in-progress' 'FBCA04' 'Claimed and being built'
mk 'status:review' '1D76DB' 'Built; waiting for review or merge'
mk 'status:declined' 'B60205' 'Declined by a human'
mk 'priority:urgent' 'E11D21' 'Live site broken: one vote can merge'
for a in dojo battle path town shop home content voice art infra; do
  mk "area:$a" 'EDEDED' "Touches the $a area"
done
echo 'Labels ready.'
