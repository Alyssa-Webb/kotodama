#!/usr/bin/env bash
# Copies this folder to the server and starts the kotodama-art container (image concepts).
# Run from the repo root: bash tools/server3d/art/start.sh
# It uses only ~/kotodama3d and its own model cache; it never touches other containers.
set -euo pipefail
H=admin1@100.114.218.255
ssh "$H" 'mkdir -p ~/kotodama3d/art ~/kotodama3d/hf'
scp -q tools/server3d/art/prompts.json tools/server3d/art/generate.py tools/server3d/art/inner.sh design/reference/hariko-toy/hariko-toy-front.png "$H":kotodama3d/art/
ssh "$H" 'docker rm -f kotodama-art >/dev/null 2>&1 || true; docker run -d --name kotodama-art --gpus all --ipc=host -v "$HOME/kotodama3d:/w" -e HF_HOME=/w/hf nvcr.io/nvidia/pytorch:25.09-py3 bash /w/art/inner.sh'
