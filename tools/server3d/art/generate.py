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
NEGATIVE = "text, letters, kanji, seal stamp, watermark, signature, blurry, deformed, photo of a real person"
print("== loaded", time.ctime(), flush=True)
adapter_loaded = False
for slug, entry in cfg["prompts"].items():
    # An entry is a prompt, or {prompt, negative} when a brief needs to rule things out.
    prompt = entry if isinstance(entry, str) else entry["prompt"]
    negative = NEGATIVE if isinstance(entry, str) else entry["negative"]
    style = None if isinstance(entry, str) else entry.get("style")
    extra = {}
    # Keeps a look from one of our own images. Once loaded, every call needs an image, so briefs with a style go last.
    if style:
        if not adapter_loaded:
            pipe.load_ip_adapter("h94/IP-Adapter", subfolder="sdxl_models", weight_name="ip-adapter_sdxl.bin")
            pipe.set_ip_adapter_scale(0.6)
            adapter_loaded = True
        extra["ip_adapter_image"] = Image.open(f"/w/art/{style}").convert("RGB")
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
                negative_prompt=negative,
                **extra,
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
