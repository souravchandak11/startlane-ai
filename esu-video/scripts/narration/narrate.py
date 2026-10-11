"""Synthesize narration sentence by sentence with Kokoro and emit word timings.

Word boundaries are first allotted by phoneme count, then snapped to the
quietest 10 ms frame within +/-70 ms so caption highlights land on real gaps.
"""
import json, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

model_dir, out_wav, out_json, voice, speed = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5])
SENTENCES = json.load(sys.stdin)  # [[text, gap_after_seconds], ...]

k = Kokoro(f"{model_dir}/kokoro-v1.0.onnx", f"{model_dir}/voices-v1.0.bin")
SR = 24000
HOP = SR // 100


def trim(x, thresh=0.012):
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x, 0
    a = max(0, idx[0] - int(0.02 * SR))
    b = min(len(x), idx[-1] + int(0.06 * SR))
    return x[a:b], a


def weights(words):
    out = []
    for w in words:
        ph = k.tokenizer.phonemize(w.strip(".,!?"), "en-us")
        n = max(1, len([c for c in ph if c.strip()]))
        if w.endswith((",",)):
            n += 3
        if w.endswith((".", "?", "!")):
            n += 4
        out.append(n)
    return out


audio, words_out, t = [], [], 0.0
for text, gap in SENTENCES:
    x, _ = k.create(text, voice=voice, speed=speed, lang="en-us")
    x, _ = trim(np.asarray(x, dtype=np.float32))
    dur = len(x) / SR
    words = text.split()
    w = np.array(weights(words), dtype=float)
    bounds = np.concatenate([[0], np.cumsum(w) / w.sum() * dur])
    env = np.array([np.sqrt(np.mean(x[i:i + HOP] ** 2)) for i in range(0, len(x), HOP)])
    for j in range(1, len(bounds) - 1):
        c = int(bounds[j] * 100)
        lo, hi = max(0, c - 7), min(len(env) - 1, c + 7)
        bounds[j] = (lo + int(np.argmin(env[lo:hi + 1]))) / 100
    for j in range(1, len(bounds)):
        bounds[j] = max(bounds[j], bounds[j - 1] + 0.06)
    bounds = np.minimum(bounds, dur)
    for j, word in enumerate(words):
        words_out.append({"w": word, "t": round(t + bounds[j], 3), "end": round(t + bounds[j + 1], 3)})
    audio.append(x)
    audio.append(np.zeros(int(gap * SR), dtype=np.float32))
    t += dur + gap

y = np.concatenate(audio)
y = y / max(1e-6, np.max(np.abs(y))) * 0.89
sf.write(out_wav, y, SR)
json.dump({"duration": round(len(y) / SR, 3), "words": words_out}, open(out_json, "w"), indent=1)
print("duration", round(len(y) / SR, 2), "words", len(words_out))
