#!/usr/bin/env bash
set -u
cd /w 2>/dev/null || cd "$HOME/kotodama3d"
python -c "import torch;print('== torch',torch.__version__,'cuda',torch.cuda.is_available(),torch.cuda.get_device_name(0) if torch.cuda.is_available() else '')"
[ -d Hunyuan3D-2 ] || git clone --depth 1 https://github.com/Tencent/Hunyuan3D-2
cd Hunyuan3D-2
pip install -q diffusers transformers accelerate einops omegaconf trimesh pygltflib rembg onnxruntime opencv-python-headless scikit-image tqdm ninja pybind11 2>&1 | tail -3
pip install -q -e . --no-deps 2>&1 | tail -2
cd ..
python gen.py
echo "== shapes done $(date)"
# Textures need a compiled CUDA rasterizer; try it, but don't fail the run over it.
( cd Hunyuan3D-2/hy3dgen/texgen/custom_rasterizer && pip install -q . --no-build-isolation ) && ( cd Hunyuan3D-2/hy3dgen/texgen/differentiable_renderer && python setup.py install -q ) && python gen.py --texture || echo "!! texture step failed (shapes are still there)"
echo "== end $(date)"
