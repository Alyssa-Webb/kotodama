"""Draws the same subjects in several candidate art styles, one sheet per style, so looks can be compared fairly: style is the only
thing that changes between sheets. Runs inside the kotodama-art container, in /w/art."""
import json, os, time
import torch
from diffusers import StableDiffusionXLPipeline
from PIL import Image

cfg = json.load(open("/w/art/explore.json", encoding="utf-8"))
out = "/w/art/out/explore"
os.makedirs(out, exist_ok=True)
print("== loading", time.ctime(), flush=True)
pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16,
    variant="fp16",
    use_safetensors=True,
).to("cuda")
print("== loaded", time.ctime(), flush=True)
CELL = 320
subjects = cfg["subjects"]
for style, words in cfg["styles"].items():
    sheet = Image.new("RGB", (CELL * cfg["seeds"], CELL * len(subjects)), "white")
    for row, (subject, text) in enumerate(subjects.items()):
        for seed in range(cfg["seeds"]):
            path = f"{out}/{style}-{subject}-s{seed}.png"
            t = time.time()
            if os.path.exists(path):
                img = Image.open(path)
            else:
                img = pipe(
                    f"{words}, {text}",
                    num_inference_steps=cfg["steps"],
                    guidance_scale=6.5,
                    negative_prompt=cfg["negative"],
                    height=cfg["size"],
                    width=cfg["size"],
                    generator=torch.Generator("cpu").manual_seed(seed),
                ).images[0]
                img.save(path)
            print(f"{style} {subject} {seed}: {time.time() - t:.0f}s", flush=True)
            sheet.paste(img.convert("RGB").resize((CELL, CELL)), (CELL * seed, CELL * row))
    sheet.save(f"{out}/sheet-{style}.jpg", quality=85)
print("== done", time.ctime(), flush=True)
