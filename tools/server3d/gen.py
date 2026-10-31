"""Turn each input image into several 3D shape variants with Hunyuan3D 2 (and optionally textures)."""
import glob, os, sys, time, traceback
import torch
from PIL import Image
texture = '--texture' in sys.argv
os.makedirs('out', exist_ok=True)
from hy3dgen.rembg import BackgroundRemover
from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline
pipe = Hunyuan3DDiTFlowMatchingPipeline.from_pretrained('tencent/Hunyuan3D-2', subfolder='hunyuan3d-dit-v2-0')
paint = None
if texture:
    from hy3dgen.texgen import Hunyuan3DPaintPipeline
    paint = Hunyuan3DPaintPipeline.from_pretrained('tencent/Hunyuan3D-2')
rembg = BackgroundRemover()
seeds = [0, 1, 2, 3, 4, 5, 6, 7]
for path in sorted(glob.glob('inputs/*.png')):
    name = os.path.splitext(os.path.basename(path))[0]
    img = rembg(Image.open(path).convert('RGB'))
    for seed in seeds:
        out = f'out/{name}-s{seed}{"-tex" if texture else ""}.glb'
        if os.path.exists(out):
            continue
        t = time.time()
        try:
            mesh = pipe(image=img, num_inference_steps=50, octree_resolution=380, generator=torch.manual_seed(seed))[0]
            if paint:
                mesh = paint(mesh, image=img)
            mesh.export(out)
            print(f'== {out} {time.time()-t:.0f}s faces={len(mesh.faces)}', flush=True)
        except Exception:
            print(f'!! {out} failed', flush=True); traceback.print_exc()
        if texture:
            break  # one textured variant per image is enough for a first test
