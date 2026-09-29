// Scans public/footage (*.mp4) and public/photos (*.jpg|png) and writes
// src/media.json so the composition knows which real clips/photos exist.
// Footage files are mapped to story slots by keywords in their file names.
//   node scripts/scan_media.mjs
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ffprobe = path.join(root, 'node_modules/@remotion/compositor-linux-x64-gnu/ffprobe');
const probe = (file) => {
  const out = execFileSync(fs.existsSync(ffprobe) ? ffprobe : 'ffprobe', [
    '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate:format=duration', '-of', 'json', file,
  ]).toString();
  const j = JSON.parse(out);
  const [n, d] = j.streams[0].r_frame_rate.split('/').map(Number);
  return {w: j.streams[0].width, h: j.streams[0].height, fps: n / d, duration: Number(j.format.duration)};
};

const SLOTS = {
  sofa: /sofa|tablet/i, // boy on sofa with tablet  (hook + pain)
  kick: /kick/i, // boy kicking the ball      (the colour drop)
  match: /match/i, // youth soccer match        (a team / a coach)
  winning: /winning|win/i, // playing and winning       (outcomes)
  prep: /prep|preparing|mom_boy/i, // boy & mom getting ready (payoff + CTA)
};

const footage = {};
const fdir = path.join(root, 'public/footage');
for (const f of fs.existsSync(fdir) ? fs.readdirSync(fdir).sort() : []) {
  if (!/\.(mp4|mov|webm)$/i.test(f)) continue;
  const slot = Object.keys(SLOTS).find((k) => SLOTS[k].test(f) && !footage[k]);
  if (slot) footage[slot] = {file: `footage/${f}`, ...probe(path.join(fdir, f))};
}
const photos = [];
const pdir = path.join(root, 'public/photos');
for (const f of fs.existsSync(pdir) ? fs.readdirSync(pdir).sort() : []) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const p = probe(path.join(pdir, f));
  photos.push({file: `photos/${f}`, w: p.w, h: p.h});
}
fs.writeFileSync(path.join(root, 'src/media.json'), JSON.stringify({footage, photos}, null, 1));
console.log('footage:', Object.fromEntries(Object.entries(footage).map(([k, v]) => [k, v.file])), '| photos:', photos.length);
