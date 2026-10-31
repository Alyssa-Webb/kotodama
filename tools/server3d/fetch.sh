#!/usr/bin/env bash
# Pulls the overnight log and finished models back into design/reference/server3d/.
set -euo pipefail
H=admin1@100.114.218.255
mkdir -p ../../design/reference/server3d
scp -q "$H":kotodama3d/log.txt ../../design/reference/server3d/log.txt
scp -q "$H":'kotodama3d/out/*.glb' ../../design/reference/server3d/ || echo "no models yet"
tail -15 ../../design/reference/server3d/log.txt
