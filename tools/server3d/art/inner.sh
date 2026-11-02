#!/usr/bin/env bash
# Inside the kotodama-art container. The model cache stays in ~/kotodama3d/hf, apart from anything else.
set -u
cd /w/art
pip install -q diffusers "transformers>=4.46,<4.50" accelerate sentencepiece protobuf 2>&1 | tail -2
python generate.py
echo "== art end $(date)"
