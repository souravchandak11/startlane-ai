#!/usr/bin/env bash
# Full pipeline: render the reel, master the audio to -14 LUFS / -1.5 dBTP
# (Instagram/TikTok loudness norm), and export a cover frame.
#
#   bash scripts/render.sh            # uses Remotion's own Chrome download
#   REMOTION_CHROME=/path/to/chrome bash scripts/render.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
BROWSER=()
[[ -n "${REMOTION_CHROME:-}" ]] && BROWSER=(--browser-executable "$REMOTION_CHROME")
FFMPEG=node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg
[[ -x "$FFMPEG" ]] || FFMPEG=ffmpeg

# COMP / NAME / COVER pick the composition (defaults: the Fall Academy reel)
COMP=${COMP:-ESU-FallLaunch}
NAME=${NAME:-esu-fall-launch-reel}
COVER=${COVER:-26}
RAW=out/raw-$NAME.mp4

node scripts/scan_media.mjs   # detect real clips in public/footage + photos in public/photos
npx remotion render src/index.ts "$COMP" "$RAW" "${BROWSER[@]}" --crf 18 --audio-bitrate 320k
npx remotion still src/index.ts "$COMP" "out/cover-$NAME.jpg" --frame "$COVER" --image-format jpeg "${BROWSER[@]}"

# two-pass loudnorm
STATS=$("$FFMPEG" -hide_banner -i "$RAW" -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$STATS" | sed -n "s/.*\"$1\" : \"\(.*\)\".*/\1/p"; }
# video: full-range JPEG frames -> standard limited-range yuv420p (what phones expect)
"$FFMPEG" -hide_banner -y -i "$RAW" \
  -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 17 -profile:v high \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 320k -movflags +faststart "out/$NAME.mp4"
echo "✓ out/$NAME.mp4"
