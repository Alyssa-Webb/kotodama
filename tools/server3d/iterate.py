"""
Iterate-and-polish test for Hunyuan3D 2 on the EdgeXpert, run inside the NVIDIA PyTorch container.

Stills (inputs/*.png): several rounds of candidates per image. Each candidate is scored by how well
its front silhouette matches the original art (IoU of the two masks), so "upholding the original
art style" is measured, not guessed. Each round mutates the best settings so far; every score is
logged to out/scores.csv so the morning review can see whether iterating actually helps.

Animation (anim/*.png): one model per frame of a 2D clip with the best avatar settings and a fixed
seed, to test whether frame-by-frame poses stay consistent enough for stop-motion.
"""
import csv, glob, os, random, time, traceback
import numpy as np
import torch
from PIL import Image, ImageDraw
from hy3dgen.rembg import BackgroundRemover
from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline

ROUNDS, PER_ROUND, S = 6, 4, 256
os.makedirs('out/iter', exist_ok=True)
os.makedirs('out/anim', exist_ok=True)
pipe = Hunyuan3DDiTFlowMatchingPipeline.from_pretrained('tencent/Hunyuan3D-2', subfolder='hunyuan3d-dit-v2-0')
rembg = BackgroundRemover()
log = open('out/scores.csv', 'a', newline='')
w = csv.writer(log)


def norm_mask(m):
    """Crop a boolean mask to its bounding box and fit it, centred, in an S×S square."""
    ys, xs = np.nonzero(m)
    if len(xs) == 0:
        return np.zeros((S, S), bool)
    crop = Image.fromarray((m[ys.min():ys.max() + 1, xs.min():xs.max() + 1] * 255).astype(np.uint8))
    k = (S - 8) / max(crop.size)
    crop = crop.resize((max(1, int(crop.width * k)), max(1, int(crop.height * k))))
    out = Image.new('L', (S, S))
    out.paste(crop, ((S - crop.width) // 2, (S - crop.height) // 2))
    return np.array(out) > 127


def art_mask(img_rgba):
    return norm_mask(np.array(img_rgba)[:, :, 3] > 127)


def mesh_mask(mesh):
    """Front silhouette: project faces onto x/y and fill them."""
    v = np.asarray(mesh.vertices)[:, :2].copy()
    v[:, 1] = -v[:, 1]
    v -= v.min(0)
    v *= (1023 / max(v.max(), 1e-6))
    im = Image.new('L', (1024, 1024))
    d = ImageDraw.Draw(im)
    f = np.asarray(mesh.faces)
    step = max(1, len(f) // 120000)  # enough faces for a solid silhouette, fast enough
    for tri in f[::step]:
        d.polygon([tuple(v[i]) for i in tri], fill=255)
    return norm_mask(np.array(im) > 127)


def iou(a, b):
    return float((a & b).sum()) / max(1, float((a | b).sum()))


def simplify(mesh, target=60000):
    try:
        return mesh.simplify_quadric_decimation(face_count=target)
    except Exception:
        return mesh


def run(img, p):
    return pipe(image=img, num_inference_steps=p['steps'], guidance_scale=p['cfg'],
                octree_resolution=p['octree'], generator=torch.manual_seed(p['seed']))[0]


def mutate(p):
    q = dict(p)
    q['seed'] = random.randint(0, 10**6)
    q['steps'] = int(np.clip(p['steps'] + random.choice([-10, 0, 10, 20]), 30, 80))
    q['cfg'] = float(np.clip(p['cfg'] + random.uniform(-1.5, 1.5), 3.0, 10.0))
    q['octree'] = int(random.choice([256, 320, 380, 448]))
    return q


best_avatar = None
for path in sorted(glob.glob('inputs/*.png')):
    name = os.path.splitext(os.path.basename(path))[0]
    img = rembg(Image.open(path).convert('RGB'))
    target = art_mask(img)
    best, best_p, best_mesh = -1.0, {'seed': 0, 'steps': 50, 'cfg': 5.5, 'octree': 380}, None
    for r in range(ROUNDS):
        cands = [best_p] if r == 0 else []
        while len(cands) < PER_ROUND:
            cands.append(mutate(best_p))
        for p in cands:
            t = time.time()
            try:
                mesh = run(img, p)
                score = iou(target, mesh_mask(mesh))
            except Exception:
                traceback.print_exc()
                continue
            w.writerow([name, r, p['seed'], p['steps'], round(p['cfg'], 2), p['octree'], round(score, 4), round(time.time() - t)])
            log.flush()
            print(f'== {name} round {r} iou={score:.4f} {p}', flush=True)
            if score > best:
                best, best_p, best_mesh = score, p, mesh
        if best_mesh is not None:
            simplify(best_mesh).export(f'out/iter/{name}-best-r{r}.glb')
            print(f'== {name} best after round {r}: {best:.4f}', flush=True)
    if name == 'avatar':
        best_avatar = best_p

# Animation: the same settings and seed for every frame, so only the pose should change.
p = best_avatar or {'seed': 0, 'steps': 50, 'cfg': 5.5, 'octree': 380}
for path in sorted(glob.glob('anim/*.png')):
    name = os.path.splitext(os.path.basename(path))[0]
    try:
        img = rembg(Image.open(path).convert('RGB'))
        mesh = run(img, p)
        simplify(mesh).export(f'out/anim/{name}.glb')
        print(f'== anim {name} iou={iou(art_mask(img), mesh_mask(mesh)):.4f}', flush=True)
    except Exception:
        traceback.print_exc()
print('== iterate done', flush=True)
