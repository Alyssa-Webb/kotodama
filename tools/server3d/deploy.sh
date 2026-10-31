#!/usr/bin/env bash
# Copies the overnight image-to-3D job to the EdgeXpert and starts it in the background there.
# Run from this folder once NetBird shows edgexpert-26d0 as Connected: bash deploy.sh
set -euo pipefail
H=admin1@100.114.218.255
ssh -o ConnectTimeout=15 "$H" 'mkdir -p ~/kotodama3d/inputs ~/.cache/huggingface'
scp -q run_overnight.sh inner.sh gen.py "$H":kotodama3d/
scp -q inputs/*.png "$H":kotodama3d/inputs/
ssh "$H" 'cd ~/kotodama3d && nohup bash run_overnight.sh > log.txt 2>&1 < /dev/null & echo started; sleep 20; tail -5 ~/kotodama3d/log.txt'
