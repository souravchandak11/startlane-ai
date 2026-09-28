"""Compose the reel's music bed procedurally (royalty-free, synced to the VO).

Structure (driven by src/timeline.json + scripts/script.json "music" markers):
  PAIN   0 → drop      A-minor, half-time heartbeat kick, 1 Hz clock tick,
                       music-box plucks, dark pad. Tense, empty.
  RISER  drop-1.8 → drop   noise riser, then a tape-stop + ~0.25 s of silence
  DROP   drop → end    124 BPM four-on-the-floor, claps, off-beat hats,
                       sub bass, bright plucks on C-G-Am-F, side-chained pad.
  OUTRO  last bar      final chord ring-out + fade.

    python3 scripts/make_music.py
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

ROOT = Path(__file__).resolve().parent.parent
SR = 44100
BPM = 124
BEAT = 60 / BPM
rng = np.random.default_rng(11)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def env(n, a, d):
    x = np.arange(n) / SR
    return np.clip(x / max(a, 1e-5), 0, 1) * np.exp(-np.maximum(x - a, 0) / d)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def place(buf, s_sec, sig, gain=1.0):
    s = int(round(s_sec * SR))
    if s >= len(buf) or s + len(sig) <= 0:
        return
    if s < 0:
        sig = sig[-s:]
        s = 0
    e = min(len(buf), s + len(sig))
    buf[s:e] += gain * sig[: e - s]


def reverb(x, secs=1.4, mix=0.3):
    n = int(SR * secs)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * secs / 6))
    ir = lp(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = np.convolve(x, ir)[: len(x)] if len(x) < 400000 else fft_conv(x, ir)
    return (1 - mix) * x + mix * wet


def fft_conv(x, ir):
    n = len(x) + len(ir)
    N = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[: len(x)]


# ---------------------------------------------------------------- instruments
def kick(dur=0.45, hard=True):
    x = np.arange(int(SR * dur)) / SR
    f = 140 * np.exp(-x * 30) + 46
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.001, 0.22)
    click = hp(rng.standard_normal(len(x)), 2000) * env(len(x), 0.0003, 0.004)
    return np.tanh((body + (0.4 if hard else 0.1) * click) * 1.6)


def clap():
    n = int(SR * 0.35)
    y = np.zeros(n)
    for off in (0, 0.011, 0.022):
        s = int(off * SR)
        y[s:] += bp(rng.standard_normal(n - s), 900, 3200) * env(n - s, 0.0005, 0.012)
    y += bp(rng.standard_normal(n), 900, 2800) * env(n, 0.001, 0.11) * 0.5
    return reverb(y, 0.6, 0.25)


def hat(open_=False):
    n = int(SR * (0.22 if open_ else 0.06))
    return hp(rng.standard_normal(n), 7500) * env(n, 0.0005, 0.08 if open_ else 0.018)


def additive(freq, dur, harmonics=10, bright_decay=0.35, amp_decay=0.5, detune=0.0):
    x = np.arange(int(SR * dur)) / SR
    y = np.zeros(len(x))
    for k in range(1, harmonics + 1):
        hd = bright_decay / (1 + 0.6 * (k - 1))
        y += np.sin(2 * np.pi * freq * k * (1 + detune) * x) / k * np.exp(-x / hd)
    return y * env(len(x), 0.003, amp_decay)


def pluck(freq, dur=0.4):
    return additive(freq, dur, 12, 0.12, 0.3) + 0.5 * additive(freq, dur, 12, 0.12, 0.3, detune=0.004)


def bell(freq, dur=2.2):
    x = np.arange(int(SR * dur)) / SR
    y = (np.sin(2 * np.pi * freq * x) + 0.35 * np.sin(2 * np.pi * freq * 3.01 * x) * np.exp(-x / 0.3)
         + 0.15 * np.sin(2 * np.pi * freq * 4.2 * x) * np.exp(-x / 0.15))
    return y * env(len(x), 0.002, 0.8)


def pad(freqs, dur, attack=0.6):
    x = np.arange(int(SR * dur)) / SR
    y = np.zeros(len(x))
    for f in freqs:
        for dt in (-0.006, 0.0, 0.007):
            for k in range(1, 7):
                y += np.sin(2 * np.pi * f * (1 + dt) * k * x + rng.uniform(0, 6)) / (k * 1.3)
    y = lp(y, 1800)
    a = np.clip(x / attack, 0, 1)
    r = np.clip((dur - x) / 0.4, 0, 1)
    return y * a * r


def sub(freq, dur):
    x = np.arange(int(SR * dur)) / SR
    y = np.tanh(1.8 * np.sin(2 * np.pi * freq * x))
    return lp(y, 400) * env(len(x), 0.004, dur * 0.9) * np.clip((dur - x) / 0.02, 0, 1)


def noise_riser(dur):
    n = int(SR * dur)
    x = np.arange(n) / SR
    y = np.zeros(n)
    block = 512
    noise = rng.standard_normal(n)
    for i in range(0, n, block):
        fc = 300 * (40 ** (i / n))
        chunk = noise[i: i + block]
        seg = bp(noise[max(0, i - 2048): i + block], fc * 0.7, min(fc * 1.4, SR / 2 - 200))
        y[i: i + len(chunk)] = seg[-len(chunk):]
    return y * (x / dur) ** 2


def tape_stop(sig, dur):
    """Pitch-slide a signal down to a halt over `dur` seconds."""
    n = int(SR * dur)
    rate = np.linspace(1, 0.02, n) ** 1.4
    pos = np.cumsum(rate)
    pos = pos[pos < len(sig) - 1]
    return np.interp(pos, np.arange(len(sig)), sig) * np.linspace(1, 0.3, len(pos))


# ----------------------------------------------------------------- sections
def compose(total, drop, cta):
    L = int(total * SR) + SR
    drums = np.zeros(L)
    bass = np.zeros(L)
    keys = np.zeros(L)
    pads = np.zeros(L)
    fx = np.zeros(L)
    side = np.ones(L)  # side-chain gain curve

    # ---------- PAIN: A minor, tense and empty
    pain_end = drop - 0.28
    # heartbeat kick: "lub-dub" every 2 beats
    t = 0.0
    while t < pain_end - 0.6:
        place(drums, t, kick(0.35, hard=False), 0.55)
        place(drums, t + 0.2, kick(0.3, hard=False), 0.32)
        t += BEAT * 2
    # clock tick at exactly 1 Hz (time slipping away)
    t = 0.5
    while t < pain_end - 0.3:
        n = int(SR * 0.05)
        tick = bp(rng.standard_normal(n), 2500, 6500) * env(n, 0.0004, 0.009)
        place(fx, t, tick, 0.35 if int(t) % 2 else 0.25)
        t += 1.0
    # dark pad Am -> F -> Am -> E
    prog = [[57, 60, 64], [53, 57, 60], [57, 60, 64], [52, 56, 59]]
    bar = BEAT * 4
    t, i = 0.0, 0
    while t < pain_end:
        d = min(bar, pain_end - t)
        place(pads, t, pad([midi(m) for m in prog[i % 4]], d + 0.3, 0.8), 0.07)
        t += bar
        i += 1
    # music-box melody (sparse, minor)
    melody = [76, 72, 71, 69, 72, 71, 67, 69]
    t, i = BEAT, 0
    while t < pain_end - 0.8:
        place(keys, t, bell(midi(melody[i % len(melody)])), 0.16)
        t += BEAT * 2
        i += 1

    # riser into the drop + tape stop of the pain bed
    place(fx, drop - 1.9, noise_riser(1.6), 0.5)

    # ---------- DROP: C major lift, 124 BPM
    chords = [[60, 64, 67], [55, 59, 62, 67], [57, 60, 64], [53, 57, 60, 65]]  # C G Am F
    roots = [36, 43, 45, 41]
    t = drop
    beat_i = 0
    while t < total - 0.05:
        bar_i = beat_i // 4
        chord = chords[bar_i % 4]
        in_cta = t >= cta
        # kick + side-chain dip
        place(drums, t, kick(), 0.9)
        s = int(t * SR)
        dip = 1 - 0.65 * np.exp(-np.arange(int(BEAT * SR)) / (SR * 0.09))
        side[s: s + len(dip)] = np.minimum(side[s: s + len(dip)], dip[: max(0, min(len(dip), L - s))])
        if beat_i % 2 == 1:
            place(drums, t, clap(), 0.5)
        place(drums, t + BEAT / 2, hat(open_=(beat_i % 4 == 3)), 0.22)
        place(drums, t + BEAT / 4, hat(), 0.09)
        place(drums, t + 3 * BEAT / 4, hat(), 0.09)
        # bass on the off-8ths (pumping)
        place(bass, t + BEAT / 2, sub(midi(roots[bar_i % 4]), BEAT / 2 - 0.02), 0.5)
        place(bass, t, sub(midi(roots[bar_i % 4]), BEAT / 2 - 0.02), 0.28)
        # pluck arp: 8ths through the chord, one octave up
        if not in_cta or beat_i % 2 == 0:
            for k in range(2):
                note = chord[(beat_i * 2 + k) % len(chord)] + 12
                place(keys, t + k * BEAT / 2, pluck(midi(note)), 0.2 if not in_cta else 0.12)
        # pad once per bar
        if beat_i % 4 == 0:
            place(pads, t, pad([midi(m) for m in chord], BEAT * 4 + 0.2, 0.08), 0.06)
        t += BEAT
        beat_i += 1

    # final ring-out chord on the last downbeat
    place(keys, total - 1.2, bell(midi(72)), 0.15)
    place(keys, total - 1.2, bell(midi(76)), 0.12)

    # tape-stop the pain bed right before the drop
    pain_mix = drums + bass + keys + pads
    s0, s1 = int((pain_end - 0.55) * SR), int(pain_end * SR)
    stopped = tape_stop(pain_mix[s0: s0 + int(SR * 1.2)], 0.55)
    pain_mix[s0: s1] = 0
    pain_mix[s0: s0 + len(stopped)] += stopped[: max(0, min(len(stopped), s1 - s0))]
    # hard silence between pain end and the drop (the "gasp")
    pain_mix[s1: int(drop * SR)] = 0

    mix = pain_mix.copy()
    # side-chain only the melodic parts after the drop
    d0 = int(drop * SR)
    melodic = (bass + keys + pads)
    mix[d0:] = drums[d0:] + melodic[d0:] * side[d0:]
    mix = reverb(mix, 1.2, 0.12) + fx
    mix = mix[: int(total * SR)]

    # fade in 40 ms, fade out last 1.0 s
    fi = int(0.04 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)
    fo = int(1.0 * SR)
    mix[-fo:] *= np.linspace(1, 0, fo) ** 1.5
    mix = np.tanh(mix / (np.max(np.abs(mix)) + 1e-9) * 1.4)
    mix *= 0.89 / np.max(np.abs(mix))
    return mix


def main():
    tl = json.loads((ROOT / "src" / "timeline.json").read_text())
    spec = json.loads((ROOT / "scripts" / "script.json").read_text())
    by_id = {l["id"]: l for l in tl["lines"]}
    drop = by_id[spec["music"]["dropAt"]]["start"] - spec["music"].get("dropLead", 0.0)
    cta = by_id[spec["music"]["ctaAt"]]["start"]
    mix = compose(tl["total"], drop, cta)
    left = mix
    right = np.concatenate([np.zeros(int(0.008 * SR)), mix])[: len(mix)] * 0.35 + mix * 0.65
    out = ROOT / "public" / "audio" / "music.wav"
    sf.write(out, np.stack([left, right], axis=1), SR, subtype="PCM_16")
    print(f"music.wav {len(mix)/SR:.2f}s  drop@{drop:.2f}s  cta@{cta:.2f}s")


if __name__ == "__main__":
    main()
