"""Synthesize the playful SFX kit for the Mommy, Daddy & Me video.

Adds toy-like sounds to public/sfx/ next to the Fall reel kit:
ball_bounce, boing, slide_up, slide_down, squeak, glock, xylo_up, xylo_down,
tada, bloop, net, scratch, clap1, kiss.

    python3 scripts/make_sfx_mdm.py
"""
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 44100
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
rng = np.random.default_rng(23)


def t(dur):
    return np.arange(int(SR * dur)) / SR


def env(n, a=0.002, d=0.2):
    x = np.arange(n) / SR
    return np.clip(x / max(a, 1e-6), 0, 1) * np.exp(-np.maximum(x - a, 0) / d)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def verb(x, secs=0.5, mix=0.2):
    n = int(SR * secs)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * secs / 5))
    ir = lp(ir, 6000)
    ir /= np.sqrt(np.sum(ir ** 2))
    y = np.concatenate([x, np.zeros(n)])
    wet = np.convolve(x, ir)[: len(y)]
    wet = np.pad(wet, (0, len(y) - len(wet)))
    return (1 - mix) * y + mix * wet


def fm(freq_curve, index=1.0, ratio=1.0):
    ph = 2 * np.pi * np.cumsum(freq_curve) / SR
    return np.sin(ph + index * np.sin(ph * ratio))


def save(name, x, peak=0.89, width=0.0):
    x = x * (peak / (np.max(np.abs(x)) + 1e-9))
    f = min(len(x), int(0.004 * SR))
    x[-f:] *= np.linspace(1, 0, f)
    if width:
        d = int(SR * 0.01 * width)
        r = np.concatenate([np.zeros(d), x])[: len(x)]
        st = np.stack([x, 0.7 * x + 0.3 * r], axis=1)
    else:
        st = np.stack([x, x], axis=1)
    sf.write(OUT / f"{name}.wav", st, SR, subtype="PCM_16")
    print(f"{name:12s} {len(x)/SR:.2f}s")


def ball_bounce():
    # rubber playground ball: low thump with a pitch drop + hollow body ring
    x = t(0.32)
    f = 210 * np.exp(-x * 18) + 95
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.001, 0.07)
    ring = np.sin(2 * np.pi * 420 * x) * env(len(x), 0.001, 0.03) * 0.25
    slap = bp(rng.standard_normal(len(x)), 600, 3000) * env(len(x), 0.0003, 0.006) * 0.6
    return np.tanh(1.6 * (body + ring + slap))


def boing():
    x = t(0.7)
    f = 180 + 160 * np.exp(-x * 4) * (1 + 0.5 * np.sin(2 * np.pi * 14 * x))
    f = f * (1 + 0.9 * np.exp(-x * 9))
    y = fm(f, 1.4, 2.0) * env(len(x), 0.002, 0.28)
    return verb(y, 0.3, 0.12)


def slide(up=True, dur=0.55):
    x = t(dur)
    k = x / dur
    f = 500 * (2.6 ** (k if up else 1 - k))
    vib = 1 + 0.012 * np.sin(2 * np.pi * 6 * x)
    tone = np.sin(2 * np.pi * np.cumsum(f * vib) / SR)
    breath = bp(rng.standard_normal(len(x)), 900, 4500) * 0.08
    a = np.clip(x / 0.03, 0, 1) * np.clip((dur - x) / 0.06, 0, 1)
    return verb((tone + 0.25 * np.sin(2 * 2 * np.pi * np.cumsum(f) / SR) + breath) * a, 0.3, 0.15)


def squeak():
    x = t(0.22)
    f = 1500 + 900 * np.sin(np.pi * x / 0.22)
    y = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.4 + np.sin(2 * np.pi * np.cumsum(f) / SR)
    y = bp(y, 900, 6000) * np.clip(x / 0.01, 0, 1) * np.clip((0.22 - x) / 0.04, 0, 1)
    return y


def glock_note(freq, dur=1.1):
    x = t(dur)
    y = (np.sin(2 * np.pi * freq * x) + 0.4 * np.sin(2 * np.pi * freq * 2.76 * x) * np.exp(-x / 0.12)
         + 0.2 * np.sin(2 * np.pi * freq * 5.4 * x) * np.exp(-x / 0.05))
    return y * env(len(x), 0.001, 0.35)


def glock():
    return verb(glock_note(1568.0), 0.6, 0.25)


def xylo(freqs, step=0.06):
    out = np.zeros(int(SR * (step * len(freqs) + 0.9)))
    for i, f in enumerate(freqs):
        x = t(0.5)
        n = (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 3.9 * x) * np.exp(-x / 0.03)) * env(len(x), 0.0008, 0.1)
        s = int(i * step * SR)
        out[s: s + len(n)] += n * (0.7 + 0.3 * i / len(freqs))
    return verb(out, 0.5, 0.2)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tada():
    out = np.zeros(int(SR * 2.2))
    for i, m in enumerate([72, 76, 79, 84]):
        n = glock_note(midi(m), 1.8)
        s = int(i * 0.045 * SR)
        out[s: s + len(n)] += n
    for m in (60, 64, 67):
        x = t(1.6)
        out[: len(x)] += 0.35 * np.sin(2 * np.pi * midi(m) * x) * env(len(x), 0.01, 0.6)
    return verb(out, 1.0, 0.3)


def bloop():
    x = t(0.18)
    f = 300 * (3.2 ** (x / 0.18))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.002, 0.06)


def net():
    # ball into a net: soft thud + rustling swish
    x = t(0.9)
    thud = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-x * 10) + 60) / SR) * env(len(x), 0.001, 0.08)
    sw = bp(rng.standard_normal(len(x)), 1500, 7000) * env(len(x), 0.02, 0.25)
    sw *= 1 + 0.6 * np.sin(2 * np.pi * 23 * x)
    return thud * 0.9 + sw * 0.6


def scratch():
    # quick vinyl-style "wait!" scratch
    x = t(0.42)
    seg = rng.standard_normal(len(x))
    fc = np.where(x < 0.18, 400 + 3000 * x / 0.18, 3400 - 3000 * (x - 0.18) / 0.24)
    y = np.zeros(len(x))
    blk = 256
    for i in range(0, len(x), blk):
        c = fc[i]
        y[i: i + blk] = bp(seg[max(0, i - 2048): i + blk], c * 0.6, min(c * 1.6, 20000))[-len(seg[i: i + blk]):]
    tone = np.sin(2 * np.pi * np.cumsum(fc * 0.25) / SR) * 0.4
    a = np.clip(x / 0.01, 0, 1) * np.clip((0.42 - x) / 0.05, 0, 1)
    return (y + tone) * a


def clap1():
    n = int(SR * 0.3)
    y = np.zeros(n)
    for off in (0, 0.01, 0.019):
        s = int(off * SR)
        y[s:] += bp(rng.standard_normal(n - s), 900, 3500) * env(n - s, 0.0004, 0.01)
    y += bp(rng.standard_normal(n), 900, 2800) * env(n, 0.001, 0.08) * 0.5
    return verb(y, 0.4, 0.2)


def kiss():
    x = t(0.16)
    f = 900 + 2200 * (x / 0.16)
    return bp(np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.6 * rng.standard_normal(len(x)), 700, 5000) * env(len(x), 0.004, 0.03)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    save("ball_bounce", ball_bounce())
    save("boing", boing())
    save("slide_up", slide(True), width=0.5)
    save("slide_down", slide(False), width=0.5)
    save("squeak", squeak(), peak=0.7)
    save("glock", glock(), width=0.6)
    save("xylo_up", xylo([midi(m) for m in (72, 74, 76, 79, 81, 84)]), width=0.6)
    save("xylo_down", xylo([midi(m) for m in (84, 81, 79, 76, 74, 72)]), width=0.6)
    save("tada", tada(), width=1.0)
    save("bloop", bloop(), peak=0.8)
    save("net", net(), width=0.8)
    save("scratch", scratch())
    save("clap1", clap1(), width=0.5)
    save("kiss", kiss(), peak=0.6)
