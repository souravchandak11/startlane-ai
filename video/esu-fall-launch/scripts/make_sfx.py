"""Synthesize the reel's sound-effect kit (royalty-free, generated from scratch).

Writes 44.1 kHz WAV files into public/sfx/. Every effect is built from
oscillators + filtered noise so there are no licensing questions.

    python3 scripts/make_sfx.py
"""
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 44100
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
rng = np.random.default_rng(7)


def t(dur):
    return np.arange(int(SR * dur)) / SR


def env_exp(n, attack=0.002, decay=0.2):
    x = np.arange(n) / SR
    a = np.clip(x / max(attack, 1e-6), 0, 1)
    return a * np.exp(-np.maximum(x - attack, 0) / decay)


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lowpass(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def highpass(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def sweep_filter(noise, f0, f1, q=3.0, block=256):
    """Time-varying band-pass by processing short blocks (cheap 'moving filter')."""
    out = np.zeros_like(noise)
    n = len(noise)
    for i in range(0, n, block):
        frac = i / n
        fc = f0 * (f1 / f0) ** frac
        lo, hi = fc / (1 + 1 / q), min(fc * (1 + 1 / q), SR / 2 - 100)
        seg = noise[max(0, i - 2048): i + block]
        y = bandpass(seg, lo, hi)
        out[i: i + block] = y[-len(noise[i: i + block]):]
    return out


def simple_reverb(x, seconds=0.6, mix=0.25):
    n = int(SR * seconds)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * seconds / 5))
    ir = lowpass(ir, 6000)
    dry = np.concatenate([x, np.zeros(n)])
    wet = np.convolve(x, ir)[: len(dry)]
    wet = np.pad(wet, (0, len(dry) - len(wet)))
    wet /= np.max(np.abs(wet)) + 1e-9
    return (1 - mix) * dry + mix * wet * np.max(np.abs(x))


def stereo(x, width=0.0):
    if width == 0:
        return np.stack([x, x], axis=1)
    d = int(SR * 0.012 * width)
    r = np.concatenate([np.zeros(d), x])[: len(x)]
    return np.stack([x, 0.7 * x + 0.3 * r], axis=1)


def norm(x, peak=0.89):
    return x * (peak / (np.max(np.abs(x)) + 1e-9))


def save(name, x, width=0.0, peak=0.89):
    x = norm(x, peak)
    # 3 ms fade out to kill clicks
    f = min(len(x), int(SR * 0.003))
    x[-f:] *= np.linspace(1, 0, f)
    sf.write(OUT / f"{name}.wav", stereo(x, width), SR, subtype="PCM_16")
    print(f"{name:14s} {len(x)/SR:5.2f}s")


def whoosh(dur=0.42, up=True):
    n = int(SR * dur)
    noise = rng.standard_normal(n)
    y = sweep_filter(noise, 300 if up else 5000, 5000 if up else 300, q=2.2)
    shape = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.6
    return y * shape


def pop():
    x = t(0.11)
    f = 900 * np.exp(-x * 38) + 380
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env_exp(len(x), 0.001, 0.035)


def click():
    x = t(0.04)
    tick = np.sin(2 * np.pi * 2400 * x) * env_exp(len(x), 0.0005, 0.006)
    nz = highpass(rng.standard_normal(len(x)), 3000) * env_exp(len(x), 0.0003, 0.004)
    return tick + 0.6 * nz


def boom():
    x = t(1.6)
    f = 120 * np.exp(-x * 9) + 38
    ph = 2 * np.pi * np.cumsum(f) / SR
    sub = np.tanh(2.2 * np.sin(ph)) * env_exp(len(x), 0.002, 0.55)
    hit = lowpass(rng.standard_normal(len(x)), 2500) * env_exp(len(x), 0.001, 0.05)
    return simple_reverb(sub + 0.45 * hit, 1.0, 0.18)


def kick_ball():
    """Punchy 'thwack' of a foot hitting a ball."""
    x = t(0.35)
    f = 210 * np.exp(-x * 45) + 70
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env_exp(len(x), 0.0008, 0.08)
    slap = bandpass(rng.standard_normal(len(x)), 900, 4500) * env_exp(len(x), 0.0003, 0.012)
    return body + 0.9 * slap


def riser(dur=1.8):
    x = t(dur)
    n = len(x)
    noise = sweep_filter(rng.standard_normal(n), 400, 9000, q=1.6)
    f = 180 * (8 ** (x / dur))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    shape = (x / dur) ** 2.2
    return (noise + tone) * shape


def ding():
    """Soft two-tone notification chime (original, not a platform sound)."""
    x = t(0.9)
    y = np.zeros(len(x))
    for start, fr in ((0.0, 1318.5), (0.09, 1975.5)):
        s = int(start * SR)
        seg = x[: len(x) - s]
        tone = np.sin(2 * np.pi * fr * seg) + 0.3 * np.sin(2 * np.pi * fr * 2.01 * seg)
        y[s:] += tone * env_exp(len(seg), 0.002, 0.22)
    return simple_reverb(y, 0.5, 0.2)


def typing(dur=1.4, cps=11):
    n = int(SR * dur)
    y = np.zeros(n)
    k = click()
    tt = 0.0
    while tt < dur - 0.05:
        s = int(tt * SR)
        amp = 0.5 + 0.5 * rng.random()
        y[s: s + len(k)] += amp * k[: n - s]
        tt += (1 / cps) * (0.6 + 0.8 * rng.random())
    return y


def glitch():
    n = int(SR * 0.28)
    y = np.zeros(n)
    seg = int(SR * 0.018)
    for i in range(0, n, seg):
        if rng.random() < 0.7:
            fr = rng.choice([220, 440, 880, 1760, 3520])
            s = t(seg / SR)
            sq = np.sign(np.sin(2 * np.pi * fr * s))
            y[i: i + seg] = (sq if rng.random() < 0.5 else rng.standard_normal(seg))[: n - i] * rng.random()
    return lowpass(y, 7000)


def tape_stop(dur=0.7):
    """Descending pitch 'power-down' used as the pain -> solution pattern interrupt."""
    x = t(dur)
    f = 220 * (1 - x / dur) ** 1.7 + 25
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sign(np.sin(ph)) * 0.4 + np.sin(ph * 2)
    return lowpass(tone, 1800) * np.linspace(1, 0.2, len(x))


def tick():
    x = t(0.06)
    return bandpass(rng.standard_normal(len(x)), 2500, 6000) * env_exp(len(x), 0.0004, 0.008) + \
        0.5 * np.sin(2 * np.pi * 1800 * x) * env_exp(len(x), 0.0004, 0.01)


def swipe():
    return whoosh(0.22, up=False) * 0.8


def shutter():
    a = bandpass(rng.standard_normal(int(SR * 0.05)), 1500, 8000) * env_exp(int(SR * 0.05), 0.0005, 0.01)
    b = bandpass(rng.standard_normal(int(SR * 0.07)), 1000, 6000) * env_exp(int(SR * 0.07), 0.0005, 0.015)
    return np.concatenate([a, np.zeros(int(SR * 0.06)), b])


def crowd(dur=2.6):
    """Stadium 'roar' bed: many band-limited noise voices with slow swells."""
    n = int(SR * dur)
    x = t(dur)
    y = np.zeros(n)
    for _ in range(14):
        c = rng.uniform(400, 2400)
        v = bandpass(rng.standard_normal(n), c * 0.8, c * 1.25)
        lfo = 0.6 + 0.4 * np.sin(2 * np.pi * rng.uniform(1.5, 5) * x + rng.uniform(0, 6))
        y += v * lfo
    shape = np.minimum(1, x / 0.25) * np.minimum(1, (dur - x) / 1.2)
    return simple_reverb(y * shape, 0.9, 0.35)


def sparkle():
    x = t(1.0)
    y = np.zeros(len(x))
    for i, fr in enumerate((2093, 2637, 3136, 4186)):
        s = int(i * 0.06 * SR)
        seg = x[: len(x) - s]
        y[s:] += np.sin(2 * np.pi * fr * seg) * env_exp(len(seg), 0.001, 0.18)
    return simple_reverb(y, 0.6, 0.3)


def whistle():
    """Referee-style pea whistle: ~2.9 kHz tone with fast trill."""
    x = t(0.7)
    trill = 1 + 0.035 * np.sign(np.sin(2 * np.pi * 28 * x))
    tone = np.sin(2 * np.pi * np.cumsum(2900 * trill) / SR)
    breath = bandpass(rng.standard_normal(len(x)), 2400, 3600) * 0.25
    shape = np.minimum(1, x / 0.02) * np.minimum(1, (0.7 - x) / 0.08)
    return (tone + breath) * shape


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    save("whoosh", whoosh(), width=1)
    save("whoosh_long", whoosh(0.7), width=1)
    save("swipe", swipe(), width=1)
    save("pop", pop(), peak=0.7)
    save("click", click(), peak=0.6)
    save("boom", boom(), width=1)
    save("kick", kick_ball())
    save("riser", riser(), width=1)
    save("ding", ding(), width=1, peak=0.6)
    save("typing", typing(), peak=0.5)
    save("glitch", glitch(), peak=0.55)
    save("tape_stop", tape_stop(), peak=0.7)
    save("tick", tick(), peak=0.5)
    save("shutter", shutter(), peak=0.6)
    save("crowd", crowd(), width=1, peak=0.5)
    save("sparkle", sparkle(), width=1, peak=0.55)
    save("whistle", whistle(), peak=0.45)
