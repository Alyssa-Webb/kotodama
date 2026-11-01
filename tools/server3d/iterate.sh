#!/usr/bin/env bash
# Waits for the overnight shape run to finish, then runs the iterate-and-polish test in the container.
# Usage (on the server): nohup bash ~/kotodama3d/iterate.sh > ~/kotodama3d/iterate-log.txt 2>&1 &
set -u
W="$HOME/kotodama3d"; cd "$W" || exit 1
echo "== waiting for the shape run to finish $(date)"
until grep -q "^== end" log.txt 2>/dev/null; do sleep 60; done
echo "== starting iterate $(date)"
docker run --rm --gpus all --ipc=host -v "$W:/w" -v "$HOME/.cache/huggingface:/root/.cache/huggingface" -w /w nvcr.io/nvidia/pytorch:25.09-py3 bash /w/iterate_inner.sh
