#!/usr/bin/env bash
# Overnight image-to-3D on the EdgeXpert: Hunyuan3D 2 turns Kotodama's 2D art into 3D reference
# models (several seeds per image) for Gemini 4 Argon to draw from. Never touches the running vLLM.
# Usage (on the server): nohup bash ~/kotodama3d/run_overnight.sh > ~/kotodama3d/log.txt 2>&1 &
set -u
W="$HOME/kotodama3d"; cd "$W" || exit 1
echo "== start $(date) on $(uname -m)"; nvidia-smi --query-gpu=name,memory.total,memory.used --format=csv 2>&1; free -g
IMG="nvcr.io/nvidia/pytorch:25.09-py3"
if command -v docker >/dev/null && docker info >/dev/null 2>&1; then
  echo "== using docker $IMG"
  docker pull "$IMG" || { echo "!! docker pull failed"; }
  exec docker run --rm --gpus all --ipc=host -v "$W:/w" -v "$HOME/.cache/huggingface:/root/.cache/huggingface" -w /w "$IMG" bash /w/inner.sh
else
  echo "== no docker: using a venv"
  python3 -m venv "$W/venv" && . "$W/venv/bin/activate"
  pip install -q --upgrade pip
  pip install -q torch torchvision --index-url https://download.pytorch.org/whl/cu130 || pip install -q torch torchvision --index-url https://download.pytorch.org/whl/cu128
  exec bash "$W/inner.sh"
fi
