"""Compose the playful score for the Mommy, Daddy & Me video (royalty-free, synced to the VO).

Driven by src/timeline_mdm.json + the "music" block of scripts/script_mdm.json:
  INTRO   0 → hook1            ukulele + glock pickup on the ball bounces, then a
                               record-scratch stop on "Wait…" (the audio hook)
  BOUNCE  hook2 → pain1        the groove peeks back in on "Yep."
  SAME    pain1 → pain3        sleepy music box stuck on the same three notes
                               ("same playground, same swings…") + clock tick
  TENDER  pain3                soft pad + falling music-box line
  BUILD   turn1 → drop         pizzicato 8ths → 16ths, snare roll, riser
  DROP    "goal" → end         120 BPM ukulele strums, glockenspiel hook,
                               claps, soft kick, shaker, round bass; lighter
                               under the CTA, ta-da on the last downbeat

    python3 scripts/make_music_mdm.py
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))
from make_music import (SR, bell, bp, clap, env, hat, hp, kick, lp, midi, noise_riser,  # noqa: E402
                        pad, place, reverb)

ROOT = Path(__file__).resolve().parent.parent
BPM = 120
BEAT = 60 / BPM
rng = np.random.default_rng(5)
_ks_cache = {}


def ks(freq, dur=0.9, bright=0.5, decay=0.996):
    """Karplus-Strong plucked string (ukulele-ish nylon), cached per pitch."""
    key = (round(freq, 2), dur, bright, decay)
    if key in _ks_cache:
        return _ks_cache[key]
    N = max(2, int(round(SR / freq)))
    n = int(SR * dur)
    y = np.zeros(n + N)
    burst = rng.uniform(-1, 1, N)
    burst = lp(burst, 1500 + 6000 * bright)
    y[:N] = burst
    k = 1
    while k * N < len(y):
        a = y[(k - 1) * N: k * N]
        b = np.concatenate([[y[(k - 1) * N - 1] if k > 1 else 0.0], a[:-1]])
        seg = decay * 0.5 * (a + b)
        y[k * N: (k + 1) * N] = seg[: len(y[k * N: (k + 1) * N])]
        k += 1
    y = y[N: N + n]
    y = hp(y, 120) * np.clip((dur - np.arange(n) / SR) / 0.05, 0, 1)
    _ks_cache[key] = y
    return y


UKE = {  # re-entrant G-C-E-A voicings (midi)
    "C": [67, 60, 64, 72], "F": [69, 65, 69, 72], "G": [67, 62, 67, 71],
    "Am": [69, 60, 64, 69], "Dm": [69, 62, 65, 69], "E": [68, 64, 71, 71],
}
ROOT_NOTE = {"C": 36, "F": 41, "G": 43, "Am": 45, "Dm": 38, "E": 40}


def strum(buf, t, chord, gain=0.5, down=True, spread=0.012):
    notes = UKE[chord] if down else UKE[chord][::-1]
    for i, m in enumerate(notes):
        place(buf, t + i * spread, ks(midi(m), 0.7), gain * (1.0 - 0.08 * i))


def glock(freq, dur=1.0):
    x = np.arange(int(SR * dur)) / SR
    y = (np.sin(2 * np.pi * freq * x) + 0.35 * np.sin(2 * np.pi * freq * 2.76 * x) * np.exp(-x / 0.1)
         + 0.15 * np.sin(2 * np.pi * freq * 5.4 * x) * np.exp(-x / 0.04))
    return y * env(len(x), 0.001, 0.4)


def musicbox(freq, dur=1.6, wobble=0.0):
    x = np.arange(int(SR * dur)) / SR
    f = freq * (1 + wobble * np.sin(2 * np.pi * 0.9 * x))
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) + 0.5 * np.sin(2 * ph) * np.exp(-x / 0.2) + 0.25 * np.sin(3.98 * ph) * np.exp(-x / 0.08)
    return y * env(len(x), 0.001, 0.55)


def bass(freq, dur):
    x = np.arange(int(SR * dur)) / SR
    y = np.sin(2 * np.pi * freq * x) + 0.3 * np.sin(4 * np.pi * freq * x)
    return lp(y, 600) * env(len(x), 0.005, dur * 0.7) * np.clip((dur - x) / 0.03, 0, 1)


def shaker():
    n = int(SR * 0.07)
    return bp(rng.standard_normal(n), 5000, 12000) * env(n, 0.008, 0.02)


def snare_soft():
    n = int(SR * 0.18)
    x = np.arange(n) / SR
    body = np.sin(2 * np.pi * 190 * x) * env(n, 0.001, 0.04)
    nz = bp(rng.standard_normal(n), 1500, 8000) * env(n, 0.001, 0.06)
    return body * 0.5 + nz


def tick():
    n = int(SR * 0.05)
    return bp(rng.standard_normal(n), 2500, 6500) * env(n, 0.0004, 0.009)


def scratch_stop(sig, dur):
    n = int(SR * dur)
    rate = np.linspace(1, 0.02, n) ** 1.2
    pos = np.cumsum(rate)
    pos = pos[pos < len(sig) - 1]
    return np.interp(pos, np.arange(len(sig)), sig)


def groove(drums, keys, low, t0, t1, chords, light=False, melody=True, start_beat=0):
    """120 BPM bouncy kids-pop groove from t0 to t1. Returns list of downbeat times."""
    hook = [  # glock hook, one note per 8th (None = rest): 2 bars
        76, None, 79, None, 84, None, 79, 76, 77, None, 76, None, 74, None, None, None,
        74, None, 77, None, 81, None, 77, 74, 76, None, 74, None, 72, None, None, None,
    ]
    t, b = t0, start_beat
    downs = []
    while t < t1 - 0.05:
        bar = b // 4
        ch = chords[bar % len(chords)]
        if b % 4 == 0:
            downs.append(t)
        # drums
        if b % 2 == 0:
            place(drums, t, kick(0.35, hard=False), 0.55 if not light else 0.35)
        else:
            place(drums, t, clap(), 0.42 if not light else 0.25)
        for k in range(4):
            place(drums, t + k * BEAT / 4, shaker(), (0.22 if k % 2 else 0.12) * (0.6 if light else 1))
        # ukulele: down on the beat, up on the "and"
        strum(keys, t, ch, 0.34 if not light else 0.22, True)
        if not light or b % 2 == 1:
            strum(keys, t + BEAT / 2, ch, 0.22 if not light else 0.14, False)
        # bass: root on 1 and 3, fifth pickup on 4-and
        r = ROOT_NOTE[ch]
        if b % 2 == 0:
            place(low, t, bass(midi(r), BEAT * 0.95), 0.6)
        if b % 4 == 3:
            place(low, t + BEAT / 2, bass(midi(r + 7), BEAT * 0.45), 0.35)
        # glock hook
        if melody:
            for k in range(2):
                n = hook[((b * 2 + k)) % len(hook)]
                if n is not None:
                    place(keys, t + k * BEAT / 2, glock(midi(n)), 0.16 if not light else 0.1)
        t += BEAT
        b += 1
    return downs


def compose(total, marks):
    L = int(total * SR) + SR
    drums, keys, low, pads, fx = (np.zeros(L) for _ in range(5))
    hook1, hook2, pain1, pain3, turn1, drop, cta = (marks[k] for k in
                                                   ("hook1", "hook2", "pain1", "pain3", "turn1", "drop", "cta"))

    # ---------- INTRO: pickup groove that the ball bounces ride on, then a scratch stop on "Wait…"
    intro = np.zeros(L)
    groove(intro, intro, intro, 0.0, hook1 + 0.3, ["C"], light=False, melody=True, start_beat=0)
    s0 = int(max(0.0, hook1 - 0.34) * SR)
    seg = intro[s0: s0 + int(SR * 1.0)].copy()
    intro[s0:] = 0
    stopped = scratch_stop(seg, 0.34)
    intro[s0: s0 + len(stopped)] += stopped * np.linspace(1, 0.2, len(stopped))
    fi = int(0.02 * SR)
    intro[:fi] *= np.linspace(0, 1, fi)

    # ---------- BOUNCE: "Yep." the groove peeks back in (2 bars, light)
    peek = np.zeros(L)
    groove(peek, peek, peek, hook2, pain1 - 0.15, ["C", "F"], light=True, melody=True)
    e = int((pain1 - 0.15) * SR)
    peek[e - int(0.25 * SR): e] *= np.linspace(1, 0, int(0.25 * SR))
    peek[e:] = 0

    # ---------- SAME: sleepy music box stuck on three notes + clock tick
    t = pain1
    i = 0
    same = [64, 62, 60]
    while t < pain3 - 0.3:
        place(keys, t, musicbox(midi(same[i % 3] + 12), 1.4, wobble=0.004), 0.11)
        if i % 3 == 0:
            place(low, t, bass(midi(48), BEAT * 2.6), 0.18)
        t += BEAT * 0.75 if i % 3 != 2 else BEAT * 1.5
        i += 1
    t = pain1 + 0.25
    while t < pain3 - 0.2:
        place(fx, t, tick(), 0.18)
        t += 0.5
    place(pads, pain1, pad([midi(m) for m in (48, 55, 64)], pain3 - pain1 + 0.2, 1.0), 0.05)

    # ---------- TENDER: "only this little once"
    tender_end = turn1 - 0.05
    place(pads, pain3 - 0.15, pad([midi(m) for m in (53, 57, 60, 64)], tender_end - pain3 + 0.8, 0.5), 0.07)
    for k, m in enumerate([84, 81, 79, 76, 77]):
        place(keys, pain3 + k * 0.32, musicbox(midi(m), 1.8), 0.17)

    # ---------- BUILD: pizzicato + snare roll + riser into the drop
    build = drop - turn1
    t = turn1
    while t < drop - 0.04:
        frac = (t - turn1) / max(build, 0.1)
        step = BEAT / 2 if frac < 0.55 else BEAT / 4
        place(keys, t, ks(midi(60 if int((t - turn1) / step) % 2 == 0 else 67), 0.3, 0.8), 0.22 + 0.25 * frac)
        place(drums, t, snare_soft(), 0.05 + 0.3 * frac ** 2)
        t += step
    place(fx, drop - min(build, 2.4), noise_riser(min(build, 2.4)), 0.32)
    place(pads, turn1, pad([midi(m) for m in (55, 62, 67, 71)], build + 0.1, build * 0.8), 0.06)
    # a breath of silence right before the drop
    for buf in (keys, drums, fx, pads):
        s = int((drop - 0.09) * SR)
        buf[s: int(drop * SR)] *= np.linspace(1, 0, int(drop * SR) - s)

    # ---------- DROP: full groove, lighter under the CTA
    prog = ["C", "G", "Am", "F"]
    main_end = cta
    downs = groove(drums, keys, low, drop, main_end, prog, light=False, melody=True)
    nb = int(round((main_end - drop) / BEAT))
    groove(drums, keys, low, drop + nb * BEAT, total - 1.6, prog, light=True, melody=True, start_beat=nb)
    # crash-ish shimmer + chord stab on the drop
    n = int(SR * 1.6)
    crash = hp(rng.standard_normal(n), 5000) * env(n, 0.001, 0.5)
    place(fx, drop, crash, 0.18)
    for m in (72, 76, 79, 84):
        place(keys, drop, glock(midi(m), 1.6), 0.13)
    # final ta-da
    end = total - 1.55
    for k, m in enumerate((72, 76, 79, 84)):
        place(keys, end + k * 0.045, glock(midi(m), 1.6), 0.18)
    strum(keys, end, "C", 0.5)
    place(low, end, bass(midi(36), 1.4), 0.6)
    place(pads, end, pad([midi(m) for m in (60, 64, 67, 72)], 1.5, 0.05), 0.06)

    mix = intro + peek + drums + keys + low * 0.9 + pads
    mix = reverb(mix, 1.0, 0.14) + fx
    mix = mix[: int(total * SR)]
    fo = int(0.5 * SR)
    mix[-fo:] *= np.linspace(1, 0, fo) ** 1.5
    mix = np.tanh(mix / (np.max(np.abs(mix)) + 1e-9) * 1.3)
    mix *= 0.89 / np.max(np.abs(mix))
    return mix, downs


def main():
    tl = json.loads((ROOT / "src" / "timeline_mdm.json").read_text())
    spec = json.loads((ROOT / "scripts" / "script_mdm.json").read_text())
    by_id = {l["id"]: l for l in tl["lines"]}
    m = spec["music"]
    lid, wi = m["dropAtWord"]
    marks = {
        "hook1": by_id["hook1"]["start"],
        "hook2": by_id["hook2"]["start"],
        "pain1": by_id["pain1"]["start"],
        "pain3": by_id["pain3"]["start"],
        "turn1": by_id["turn1"]["start"],
        "drop": by_id[lid]["words"][wi]["start"],
        "cta": by_id[m["ctaAt"]]["start"],
    }
    mix, downs = compose(tl["total"], marks)
    right = np.concatenate([np.zeros(int(0.009 * SR)), mix])[: len(mix)] * 0.35 + mix * 0.65
    out = ROOT / "public" / "audio" / "music_mdm.wav"
    sf.write(out, np.stack([mix, right], axis=1), SR, subtype="PCM_16")
    (ROOT / "src" / "beats_mdm.json").write_text(json.dumps(
        {"bpm": BPM, "drop": round(marks["drop"], 3), "downbeats": [round(d, 3) for d in downs]}))
    print("music_mdm.wav", f"{len(mix)/SR:.2f}s", {k: round(v, 2) for k, v in marks.items()})


if __name__ == "__main__":
    main()
