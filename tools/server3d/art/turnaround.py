"""Paints looks onto one chibi body from every angle: the edges of the server's clay renders lock the shape (ControlNet), a fixed seed
and prompt keep the look, and an optional image of ours sets the style (IP-Adapter). Tests whether back views, clothes and poses can
stay consistent. Runs inside the kotodama-art container, in /w/art."""
import json, os, time
import cv2
import numpy as np
import torch
from diffusers import ControlNetModel, StableDiffusionXLControlNetPipeline
from PIL import Image

cfg = json.load(open("/w/art/turnarounds.json", encoding="utf-8"))
out = "/w/art/out"
os.makedirs(out, exist_ok=True)
print("== loading", time.ctime(), flush=True)
controlnet = ControlNetModel.from_pretrained("diffusers/controlnet-canny-sdxl-1.0", torch_dtype=torch.float16, variant="fp16")
pipe = StableDiffusionXLControlNetPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    controlnet=controlnet,
    torch_dtype=torch.float16,
    variant="fp16",
    use_safetensors=True,
).to("cuda")
pipe.load_ip_adapter("h94/IP-Adapter", subfolder="sdxl_models", weight_name="ip-adapter_sdxl.bin")
print("== loaded", time.ctime(), flush=True)


def edges(path):
    img = cv2.resize(cv2.imread(path), (cfg["size"], cfg["size"]))
    found = cv2.Canny(img, 40, 120)
    return Image.fromarray(np.stack([found] * 3, axis=2))


controls = {view: edges(f"/w/art/control/avatar-s0-{view}.png") for view in cfg["views"]}
for slug, look in cfg["looks"].items():
    style = look.get("style", cfg["blankStyle"])
    pipe.set_ip_adapter_scale(look.get("styleScale", 0.0))
    style_image = Image.open(f"/w/art/{style}").convert("RGB")
    thumbs = []
    for view, words in cfg["views"].items():
        path = f"{out}/{slug}-{view}.png"
        t = time.time()
        if os.path.exists(path):
            img = Image.open(path)
        else:
            negative = cfg["negative"] + (", face, eyes" if "back" in view else "")
            img = pipe(
                f"{look['prompt']}, {words}",
                image=controls[view],
                ip_adapter_image=style_image,
                controlnet_conditioning_scale=cfg["control"],
                num_inference_steps=cfg["steps"],
                guidance_scale=6.5,
                negative_prompt=negative,
                height=cfg["size"],
                width=cfg["size"],
                generator=torch.Generator("cpu").manual_seed(cfg["seed"]),
            ).images[0]
            img.save(path)
        print(f"{slug} {view}: {time.time() - t:.0f}s", flush=True)
        thumbs.append(img.convert("RGB").resize((320, 320)))
    sheet = Image.new("RGB", (320 * 5, 320 * 2), "white")
    for i, th in enumerate(thumbs):
        sheet.paste(th, (320 * (i % 5), 320 * (i // 5)))
    sheet.save(f"{out}/sheet-{slug}.jpg", quality=85)
print("== done", time.ctime(), flush=True)
