#!/usr/bin/env bash
set -u
cd /w 2>/dev/null || cd "$HOME/kotodama3d"
python -c "import torch;print('== torch',torch.__version__,'cuda',torch.cuda.is_available(),torch.cuda.get_device_name(0) if torch.cuda.is_available() else '')"
[ -d Hunyuan3D-2 ] || git clone --depth 1 https://github.com/Tencent/Hunyuan3D-2
cd Hunyuan3D-2
pip install -q diffusers "transformers>=4.46,<4.50" accelerate einops omegaconf trimesh pygltflib rembg onnxruntime opencv-python-headless scikit-image tqdm ninja pybind11 2>&1 | tail -3
pip install -q -e . --no-deps 2>&1 | tail -2
# pymeshlab (mesh clean-up) often has no ARM wheel. Shape generation only imports it, so fall back
# to a tiny stand-in module when it can't be installed.
apt-get update -qq >/dev/null 2>&1 && apt-get install -y -qq libgl1 libglib2.0-0 >/dev/null 2>&1 || true
pip install -q pymeshlab 2>/dev/null || true
if ! python -c "import pymeshlab" 2>/dev/null; then
  echo "== pymeshlab won't import on $(uname -m): using a stand-in"
  pip uninstall -y -q pymeshlab 2>/dev/null || true
  mkdir -p /w/stub/pymeshlab
  printf 'class _Any:
    def __init__(self, *a, **k): pass
    def __getattr__(self, n): return _Any()
    def __call__(self, *a, **k): return _Any()
def __getattr__(n): return _Any
' > /w/stub/pymeshlab/__init__.py
  export PYTHONPATH="/w/stub:${PYTHONPATH:-}"
fi
cd ..
python gen.py
echo "== shapes done $(date)"
# Textures need a compiled CUDA rasterizer; try it, but don't fail the run over it.
( cd Hunyuan3D-2/hy3dgen/texgen/custom_rasterizer && pip install -q . --no-build-isolation ) && ( cd Hunyuan3D-2/hy3dgen/texgen/differentiable_renderer && python setup.py install -q ) && python gen.py --texture || echo "!! texture step failed (shapes are still there)"
echo "== end $(date)"
