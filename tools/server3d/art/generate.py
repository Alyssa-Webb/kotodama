"""Generates new concept art on the EdgeXpert with Stable Diffusion XL (CreativeML Open RAIL++-M, no login needed): several seeds per
prompt, plus a contact sheet per prompt. Runs inside the kotodama-art container, in /w/art."""
import json, os, time
import torch
from diffusers import StableDiffusionXLPipeline
from PIL import Image

cfg = json.load(open("/w/art/prompts.json", encoding="utf-8"))
out = "/w/art/out"
os.makedirs(out, exist_ok=True)
print("== loading", time.ctime(), flush=True)
pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16,
    variant="fp16",
    use_safetensors=True,
).to("cuda")
NEGATIVE = "text, letters, watermark, signature, blurry, deformed, photo of a real person"
print("== loaded", time.ctime(), flush=True)
for slug, prompt in cfg["prompts"].items():
    thumbs = []
    for seed in range(cfg["seeds"]):
        path = f"{out}/{slug}-s{seed}.png"
        t = time.time()
        if os.path.exists(path):
            img = Image.open(path)
        else:
            img = pipe(
                prompt,
                num_inference_steps=cfg["steps"],
                guidance_scale=6.5,
                negative_prompt=NEGATIVE,
                height=cfg["size"],
                width=cfg["size"],
                generator=torch.Generator("cpu").manual_seed(seed),
            ).images[0]
            img.save(path)
        print(f"{slug} seed {seed}: {time.time() - t:.0f}s", flush=True)
        thumbs.append(img.convert("RGB").resize((384, 384)))
    sheet = Image.new("RGB", (384 * 4, 384 * ((len(thumbs) + 3) // 4)), "white")
    for i, th in enumerate(thumbs):
        sheet.paste(th, (384 * (i % 4), 384 * (i // 4)))
    sheet.save(f"{out}/sheet-{slug}.jpg", quality=85)
print("== done", time.ctime(), flush=True)
