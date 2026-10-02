"""Light track for the "Glued to your leg" reel (32 s, royalty-free, procedural).

Sits on top of the field audio, so it stays light: plucked strings, shaker, soft kick.
  0–6 s    hesitant: sparse plucks on Am–F, soft pad, a little held breath before the turn
  6 s      THE TURN (kid runs ahead): groove lifts to C–G–Am–F, 100 BPM
  19–27 s  price + coupon cards: groove thins so the numbers get the attention
  27–30 s  CTA: claps + glockenspiel hook come in
  30–32 s  end card: final strum and glock, fade out

    python3 scripts/make_music_glued.py
"""
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))
from make_music import SR, clap, env, kick, midi, noise_riser, pad, place, reverb  # noqa: E402
from make_music_mdm import ROOT_NOTE, bass, glock, ks, shaker, strum  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TOTAL = 32.0
TURN = 6.0
CARDS = 19.0
CTA = 27.0
END = 30.0
BEAT = 60 / 100


def compose():
    L = int(TOTAL * SR) + SR
    keys, drums, low, pads, fx = (np.zeros(L) for _ in range(5))

    # ---- hesitant intro: one pluck at a time, like a kid testing the water
    intro = [(0.0, 69), (0.9, 72), (1.5, 76), (2.4, 74), (3.0, 72), (3.9, 69), (4.5, 72), (5.1, 77)]
    for t, m in intro:
        place(keys, t, ks(midi(m), 1.2, 0.35, 0.997), 0.32)
    place(pads, 0.0, pad([midi(m) for m in (57, 60, 64)], 3.0, 0.6), 0.05)
    place(pads, 3.0, pad([midi(m) for m in (53, 57, 60)], 2.9, 0.4), 0.05)
    place(low, 0.0, bass(midi(45), 2.8), 0.25)
    place(low, 3.0, bass(midi(41), 2.8), 0.25)
    place(fx, TURN - 1.2, noise_riser(1.15), 0.18)

    # ---- groove from the turn
    prog = ["C", "G", "Am", "F"]
    hook = [76, None, 79, 76, 74, None, 72, None, 74, None, 76, 74, 72, None, None, None]
    t, b = TURN, 0
    while t < END - 0.02:
        ch = prog[(b // 4) % 4]
        thin = CARDS <= t < CTA
        lift = t >= CTA
        if b % 2 == 0:
            place(drums, t, kick(0.3, hard=False), 0.2 if thin else 0.28)
        elif lift:
            place(drums, t, clap(), 0.3)
        for k in range(2):
            place(drums, t + k * BEAT / 2, shaker(), 0.1 if k else 0.16)
        strum(keys, t, ch, 0.26 if thin else 0.34, True)
        if not thin:
            strum(keys, t + BEAT / 2, ch, 0.22, False)
        if b % 2 == 0:
            place(low, t, bass(midi(ROOT_NOTE[ch]), BEAT * 1.8), 0.32)
        if lift or b < 8:
            n = hook[(b * 2) % len(hook)]
            if n is not None:
                place(keys, t, glock(midi(n)), 0.1)
        t += BEAT
        b += 1
    # the turn: a bright chord stab + shimmer
    for m in (72, 76, 79):
        place(keys, TURN, glock(midi(m), 1.4), 0.1)

    # ---- end card
    strum(keys, END, "C", 0.4)
    for k, m in enumerate((72, 76, 79, 84)):
        place(keys, END + 0.05 + k * 0.05, glock(midi(m), 1.6), 0.12)
    place(low, END, bass(midi(36), 1.8), 0.5)
    place(pads, END, pad([midi(m) for m in (60, 64, 67)], 2.0, 0.05), 0.05)

    # a held breath right before the turn
    s = int((TURN - 0.12) * SR)
    for buf in (keys, pads, low):
        buf[s: int(TURN * SR)] *= np.linspace(1, 0, int(TURN * SR) - s)

    mix = reverb(keys + drums + low + pads, 1.0, 0.16) + fx
    mix = mix[: int(TOTAL * SR)]
    fo = int(1.2 * SR)
    mix[-fo:] *= np.linspace(1, 0, fo) ** 1.4
    mix[: int(0.01 * SR)] *= np.linspace(0, 1, int(0.01 * SR))
    mix = np.tanh(mix / (np.max(np.abs(mix)) + 1e-9) * 1.2)
    return mix * 0.89 / np.max(np.abs(mix))


if __name__ == "__main__":
    mix = compose()
    right = np.concatenate([np.zeros(int(0.009 * SR)), mix])[: len(mix)] * 0.35 + mix * 0.65
    out = ROOT / "public" / "audio" / "music_glued.wav"
    sf.write(out, np.stack([mix, right], axis=1), SR, subtype="PCM_16")
    x = mix
    print("music_glued.wav", f"{len(x)/SR:.2f}s", " ".join(f"{20*np.log10(np.sqrt(np.mean(x[int(s*SR):int((s+1)*SR)]**2))+1e-9):.0f}" for s in range(32)))
