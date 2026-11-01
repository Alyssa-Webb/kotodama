#!/usr/bin/env bash
# Inside the NVIDIA PyTorch container: same setup as inner.sh, then the iterate-and-polish test.
set -u
cd /w
apt-get update -qq >/dev/null 2>&1 && apt-get install -y -qq libgl1 libglib2.0-0 >/dev/null 2>&1 || true
pip install -q diffusers "transformers>=4.46,<4.50" accelerate einops omegaconf trimesh pygltflib rembg onnxruntime opencv-python-headless scikit-image tqdm fast_simplification 2>&1 | tail -2
pip install -q -e Hunyuan3D-2 --no-deps 2>&1 | tail -1
if ! python -c "import pymeshlab" 2>/dev/null; then
  pip uninstall -y -q pymeshlab 2>/dev/null || true
  mkdir -p /w/stub/pymeshlab
  printf 'class _Any:\n    def __init__(self, *a, **k): pass\n    def __getattr__(self, n): return _Any()\n    def __call__(self, *a, **k): return _Any()\ndef __getattr__(n): return _Any\n' > /w/stub/pymeshlab/__init__.py
  export PYTHONPATH="/w/stub:${PYTHONPATH:-}"
fi
python iterate.py
echo "== iterate end $(date)"
