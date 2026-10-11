"""Original retro bed (Rhodes-style chords, vinyl crackle) and mechanical SFX for the metro-style reels."""
import sys, wave
import numpy as np

OUT = sys.argv[1]
SR = 48000
rng = np.random.default_rng(11)


def write(name, x, stereo=None):
    if stereo is None:
        x = x / max(1e-9, np.max(np.abs(x))) * 0.7
    st = stereo if stereo is not None else np.stack([x, x], 1)
    with wave.open(f"{OUT}/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype("<i2").tobytes())


def t(d):
    return np.arange(int(SR * d)) / SR


def lp(x, a):
    a = np.broadcast_to(np.asarray(a, dtype=float), x.shape)
    y = np.empty_like(x); p = 0.0
    for i in range(len(x)):
        p += a[i] * (x[i] - p); y[i] = p
    return y


def rhodes(freq, dur, vel=1.0):
    tt = t(dur)
    mod = np.sin(2 * np.pi * freq * tt) * 1.6 * np.exp(-tt * 6)
    car = np.sin(2 * np.pi * freq * tt + mod)
    tine = 0.25 * np.sin(2 * np.pi * freq * 4.02 * tt) * np.exp(-tt * 14)
    env = np.minimum(1, tt / 0.004) * np.exp(-tt * 1.15)
    trem = 1 + 0.18 * np.sin(2 * np.pi * 4.6 * tt)
    return (car + tine) * env * trem * vel


def note(n):
    return 440 * 2 ** ((n - 69) / 12)


# --- bed: 90 BPM, Am9 - Fmaj7 - Cmaj7/E - G6, two bars each -----------------
bpm = 90; beat = 60 / bpm; bar = 4 * beat
chords = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 69], [52, 55, 60, 64, 67], [55, 59, 62, 64, 67]]
roots = [45, 41, 40, 43]
length = 44.0
L = int(SR * length)
bed = np.zeros((L, 2))
pos = 0.0; k = 0
while pos < length:
    ch = chords[k % 4]
    for hit in (0, 1.5, 2.5, 4, 5.5, 6.5):
        start = pos + hit * beat
        if start >= length:
            break
        dur = min(3.2, length - start)
        vel = 0.9 if hit in (0, 4) else 0.55
        for j, n in enumerate(ch):
            s = rhodes(note(n), dur, vel) * 0.11
            pan = 0.35 + 0.3 * (j / (len(ch) - 1))
            a = int(SR * start); b = min(L, a + len(s))
            bed[a:b, 0] += s[: b - a] * (1 - pan); bed[a:b, 1] += s[: b - a] * pan
    # soft sub on the root
    sd = min(2 * bar, length - pos); tt = t(sd)
    sub = np.sin(2 * np.pi * note(roots[k % 4] - 12) * tt) * np.minimum(1, tt / 0.05) * np.exp(-tt * 0.6) * 0.16
    a = int(SR * pos); b = min(L, a + len(sub)); bed[a:b] += sub[: b - a, None]
    pos += 2 * bar; k += 1
# brushed hats + vinyl crackle + tape hiss
for i in range(int(length / (beat / 2))):
    st = int(SR * i * beat / 2)
    hh = rng.standard_normal(int(SR * 0.05)) * np.exp(-t(0.05) * 90) * (0.05 if i % 2 else 0.03)
    hh = hh - lp(hh, 0.3)
    b = min(L, st + len(hh)); bed[st:b] += hh[: b - st, None]
crackle = (rng.random(L) < 0.0009) * rng.standard_normal(L) * 0.25
bed += lp(crackle, 0.6)[:, None] * 0.5
bed += lp(rng.standard_normal(L), 0.08)[:, None] * 0.012
bed /= np.max(np.abs(bed)) / 0.5
write("bed", None, bed)

# --- mechanical SFX --------------------------------------------------------
def click(d=0.012, ring=(3200, 5100)):
    tt = t(0.06)
    n = rng.standard_normal(len(tt)) * np.exp(-tt / d * 4)
    r = sum(np.sin(2 * np.pi * f * tt) for f in ring) * np.exp(-tt * 70) * 0.25
    return (n - lp(n, 0.25)) * 0.8 + r

sh = np.zeros(int(SR * 0.16)); c1 = click(); c2 = click(0.018, (2600, 4300))
sh[: len(c1)] += c1; o = int(SR * 0.045); sh[o: o + len(c2)] += c2 * 0.85
write("shutter", sh * 0.9)

tt = t(0.6)
thunk = np.sin(2 * np.pi * (70 * np.exp(-tt * 5) + 38) * tt) * np.exp(-tt * 7) * 0.9
static = rng.standard_normal(len(tt)) * np.exp(-tt * 9) * 0.25
whine = np.sin(2 * np.pi * (9000 + 5000 * tt) * tt) * np.exp(-tt * 4) * 0.03
write("crt_on", thunk + static - lp(static, 0.2) + whine)

tt = t(0.55)
motor = np.sin(2 * np.pi * np.cumsum(40 + 90 * np.minimum(1, tt / 0.45)) / SR) * 0.35 * np.minimum(1, tt / 0.03) * np.exp(-np.maximum(0, tt - 0.4) * 12)
write("tape_start", motor + lp(rng.standard_normal(len(tt)), 0.1) * 0.15 * np.exp(-tt * 3))

tt = t(0.18)
pin = np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 40) * 0.7 + (lambda n: n - lp(n, 0.3))(rng.standard_normal(len(tt))) * np.exp(-tt * 160) * 0.5
write("pin", pin)

tt = t(0.32)
sw = lp(rng.standard_normal(len(tt)), 0.12 + 0.2 * np.sin(np.pi * tt / 0.32)) * np.sin(np.pi * tt / 0.32) ** 2 * 0.7
write("paper", sw)

stab = sum(rhodes(note(n), 1.6, 1.0) for n in [57, 60, 64, 67, 71]) * 0.16
write("stab", stab)

tt = t(0.035)
write("type", (rng.standard_normal(len(tt)) * np.exp(-tt * 200) + np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 120) * 0.4) * 0.5)
print("ok")
