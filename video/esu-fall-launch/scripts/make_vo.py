"""Generate the voiceover + word-level caption timeline from scripts/script.json.

Uses Kokoro (Apache-2.0, runs fully offline) so the VO is royalty-free.
Outputs:
  public/audio/vo.wav     – the assembled voiceover track
  src/timeline.json       – line + word timings (seconds) that drive every cut,
                            caption and SFX hit in the Remotion composition

    KOKORO_DIR=/path/to/model python3 scripts/make_vo.py

KOKORO_DIR must contain kokoro-v1.0.onnx and voices-v1.0.bin from
https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
"""
import json
import os
import re
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = Path(os.environ.get("SCRIPT", ROOT / "scripts" / "script.json"))
OUT_WAV = Path(os.environ.get("OUT_WAV", ROOT / "public" / "audio" / "vo.wav"))
OUT_JSON = Path(os.environ.get("OUT_JSON", ROOT / "src" / "timeline.json"))
MODEL_DIR = Path(os.environ.get("KOKORO_DIR", ROOT / "scripts" / ".kokoro"))

SR_OUT = 44100


def trim(x, sr, thresh_db=-42, pad=0.03):
    """Trim leading/trailing silence, keep a small pad so consonants aren't clipped."""
    frame = int(sr * 0.01)
    rms = np.array([np.sqrt(np.mean(x[i: i + frame] ** 2) + 1e-12) for i in range(0, len(x), frame)])
    db = 20 * np.log10(rms + 1e-12)
    voiced = np.where(db > thresh_db)[0]
    if len(voiced) == 0:
        return x
    s = max(0, voiced[0] * frame - int(pad * sr))
    e = min(len(x), (voiced[-1] + 1) * frame + int(pad * sr))
    return x[s:e]


def resample(x, sr_in, sr_out):
    if sr_in == sr_out:
        return x
    n = int(round(len(x) * sr_out / sr_in))
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)


def silent_gaps(x, sr, min_gap=0.07, thresh_db=-38):
    """Return [(start, end)] seconds of internal pauses – used to anchor punctuation."""
    frame = int(sr * 0.01)
    db = np.array([20 * np.log10(np.sqrt(np.mean(x[i: i + frame] ** 2) + 1e-12) + 1e-12)
                   for i in range(0, len(x), frame)])
    quiet = db < thresh_db
    gaps, start = [], None
    for i, q in enumerate(quiet):
        if q and start is None:
            start = i
        elif not q and start is not None:
            if (i - start) * 0.01 >= min_gap and start > 0:
                gaps.append((start * 0.01, i * 0.01))
            start = None
    return gaps


def word_weights(kokoro, words):
    ws = []
    for w in words:
        core = re.sub(r"[^\w'’%$-]", "", w)
        try:
            ph = kokoro.tokenizer.phonemize(core or w, "en-us")
        except Exception:
            ph = core
        ws.append(max(2, len(ph.replace(" ", ""))))
    return ws


def time_words(kokoro, text, audio, sr):
    """Distribute word timings across the clip, snapping punctuation to real pauses."""
    words = text.split()
    weights = word_weights(kokoro, words)
    dur = len(audio) / sr
    gaps = silent_gaps(audio, sr)
    # split into segments at punctuation that likely produced a pause
    seg_breaks = [i for i, w in enumerate(words[:-1]) if re.search(r"[,.;:!?…—]$", w)]
    segments, prev = [], 0
    for b in seg_breaks:
        segments.append((prev, b + 1))
        prev = b + 1
    segments.append((prev, len(words)))

    # choose anchor times: gaps matched to breaks in order (fallback: proportional)
    total_w = sum(weights)
    anchors = [0.0]
    cum = 0
    for (a, b) in segments[:-1]:
        cum += sum(weights[a:b])
        guess = dur * cum / total_w
        best = min(gaps, key=lambda g: abs((g[0] + g[1]) / 2 - guess), default=None)
        if best and abs((best[0] + best[1]) / 2 - guess) < 0.45:
            anchors.append(best)
        else:
            anchors.append((guess, guess))
    out = []
    for si, (a, b) in enumerate(segments):
        s0 = anchors[si][1] if si > 0 else 0.0
        s1 = anchors[si + 1][0] if si + 1 < len(anchors) else dur
        seg_w = sum(weights[a:b])
        t = s0
        for i in range(a, b):
            d = (s1 - s0) * weights[i] / seg_w
            out.append({"w": words[i], "start": round(t, 3), "end": round(t + d, 3)})
            t += d
    return out


def main():
    spec = json.loads(SCRIPT.read_text())
    kokoro = Kokoro(str(MODEL_DIR / "kokoro-v1.0.onnx"), str(MODEL_DIR / "voices-v1.0.bin"))
    voice, speed = spec.get("voice", "af_heart"), spec.get("speed", 1.0)
    cursor = spec.get("leadIn", 0.0)
    track = []
    lines = []
    for line in spec["lines"]:
        cursor += line.get("pauseBefore", 0.0)
        audio, sr = kokoro.create(line.get("say", line["text"]), voice=line.get("voice", voice),
                                  speed=line.get("speed", speed), lang="en-us")
        audio = trim(np.asarray(audio, dtype=np.float32), sr)
        words = time_words(kokoro, line["text"], audio, sr)
        audio = resample(audio, sr, SR_OUT)
        start = cursor
        end = start + len(audio) / SR_OUT
        track.append((start, audio))
        lines.append({
            "id": line["id"],
            "text": line["text"],
            "start": round(start, 3),
            "end": round(end, 3),
            "words": [{**w, "start": round(start + w["start"], 3), "end": round(start + w["end"], 3)}
                      for w in words],
        })
        print(f"{line['id']:12s} {start:6.2f} → {end:6.2f}  {line['text']}")
        cursor = end + line.get("pauseAfter", spec.get("gap", 0.12))

    total = cursor + spec.get("tail", 0.0)
    mix = np.zeros(int(total * SR_OUT) + SR_OUT)
    for start, audio in track:
        s = int(start * SR_OUT)
        mix[s: s + len(audio)] += audio
    mix = mix[: int(total * SR_OUT)]
    mix *= 0.95 / (np.max(np.abs(mix)) + 1e-9)
    OUT_WAV.parent.mkdir(parents=True, exist_ok=True)
    sf.write(OUT_WAV, np.stack([mix, mix], axis=1), SR_OUT, subtype="PCM_16")
    OUT_JSON.write_text(json.dumps({"voEnd": round(cursor, 3), "total": round(total, 3), "lines": lines}, indent=1))
    print(f"VO length {cursor:.2f}s, total {total:.2f}s")


if __name__ == "__main__":
    main()
