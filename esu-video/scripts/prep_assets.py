import sys, json, wave, struct, math
import numpy as np
from PIL import Image, ImageDraw
S, P = sys.argv[1], sys.argv[2]
SR = 48000
rng = np.random.default_rng(7)

def write(name, x):
    x = np.clip(x, -1, 1)
    st = np.stack([x, x], 1)
    with wave.open(f"{P}/audio/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype("<i2").tobytes())

def t(d): return np.arange(int(SR * d)) / SR
def lp(x, a):  # one-pole lowpass, a may be array
    y = np.zeros_like(x); prev = 0.0
    a = np.broadcast_to(a, x.shape)
    for i in range(len(x)):
        prev = prev + a[i] * (x[i] - prev); y[i] = prev
    return y

# boom: pitched sub drop + click
tt = t(0.9); f = 70 * np.exp(-tt * 3) + 32
ph = 2 * np.pi * np.cumsum(f) / SR
boom = np.sin(ph) * np.exp(-tt * 4.2) * 0.95
click = rng.standard_normal(len(tt)) * np.exp(-tt * 180) * 0.5
write("boom", boom + lp(click, 0.25))

# whoosh: noise through sweeping lowpass with swell
tt = t(0.42); n = rng.standard_normal(len(tt))
env = np.sin(np.pi * np.clip(tt / 0.42, 0, 1)) ** 2
a = 0.02 + 0.35 * (tt / 0.42)
write("whoosh", lp(n, a) * env * 0.9)

# pop: quick pitch-drop blip
tt = t(0.12); f = 900 * np.exp(-tt * 18) + 280
write("pop", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 38) * 0.7)

# tick: short bright click
tt = t(0.05)
write("tick", (np.sin(2 * np.pi * 2200 * tt) * 0.5 + rng.standard_normal(len(tt)) * 0.3) * np.exp(-tt * 140) * 0.6)

# stamp: short thud + paper slap
tt = t(0.35); f = 120 * np.exp(-tt * 12) + 45
th = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 11)
slap = lp(rng.standard_normal(len(tt)), 0.5) * np.exp(-tt * 60)
write("stamp", th * 0.85 + slap * 0.6)

# ding: message chime
tt = t(0.9)
ding = (np.sin(2*np.pi*1318.5*tt) * np.exp(-tt*5) + 0.6*np.sin(2*np.pi*1975.5*tt) * np.exp(-tt*6)) * 0.35
ding[int(SR*0.09):] += (np.sin(2*np.pi*1975.5*tt[:len(tt)-int(SR*0.09)]) * np.exp(-tt[:len(tt)-int(SR*0.09)]*5)) * 0.3
write("ding", ding)

# per-frame voice envelopes (30fps) for the waveform badge
env = {}
for name in ("vo1", "vo2"):
    with wave.open(f"{P}/audio/{name}.wav") as w:
        n = w.getnframes(); ch = w.getnchannels()
        d = np.frombuffer(w.readframes(n), "<i2").reshape(-1, ch)[:, 0] / 32768
    hop = SR // 30
    r = [float(np.sqrt(np.mean(d[i:i+hop] ** 2))) for i in range(0, len(d), hop)]
    m = max(r); env[name] = [round(min(1, v / m * 1.15), 3) for v in r]
json.dump(env, open(f"{S}/esu-video/src/data/voEnvelope.json", "w"))

# transparent logo: flood-fill white background from the corners
im = Image.open(f"{S}/frames/logo_profile.jpg").convert("RGBA")
for c in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]:
    ImageDraw.floodfill(im, c, (255, 255, 255, 0), thresh=40)
a = np.asarray(im).copy()
bb = Image.fromarray(a).getbbox()
Image.fromarray(a).crop(bb).save(f"{P}/img/esu_logo.png")

# film grain tile
g = (rng.standard_normal((960, 540)) * 40 + 128).clip(0, 255).astype(np.uint8)
Image.fromarray(g, "L").resize((1080, 1920), Image.NEAREST).save(f"{P}/img/grain.png")
print("ok", {k: len(v) for k, v in env.items()}, bb)
