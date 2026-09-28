"""Tile review stills into contact sheets: python3 scripts/sheet.py out/stills out/sheet"""
import sys, glob
from PIL import Image, ImageDraw
src, dst = sys.argv[1], sys.argv[2]
files = sorted(glob.glob(f"{src}/f*.jpg"))
per, cols = 12, 6
for k in range(0, len(files), per):
    chunk = files[k:k + per]
    ims = [Image.open(f) for f in chunk]
    w, h = ims[0].size
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * w, rows * (h + 30)), "white")
    d = ImageDraw.Draw(sheet)
    for i, (f, im) in enumerate(zip(chunk, ims)):
        x, y = (i % cols) * w, (i // cols) * (h + 30)
        sheet.paste(im, (x, y + 30))
        d.text((x + 8, y + 8), f.split("/")[-1], fill="black")
    sheet.save(f"{dst}_{k // per}.jpg", quality=80)
    print(f"{dst}_{k // per}.jpg")
