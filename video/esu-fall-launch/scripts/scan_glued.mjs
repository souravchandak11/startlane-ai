// Finds the real Weekend Academy clips for the "Glued to your leg" reel and writes
// src/glued/media.json. Drop clips in public/footage/glued/ with the slot word in the
// file name (leg, watch, run, coach, alone, group, ball), e.g. "run_take2.mov".
// Missing slots render as labelled placeholders, so the reel always builds.
//   node scripts/scan_glued.mjs
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ffprobe = path.join(root, 'node_modules/@remotion/compositor-linux-x64-gnu/ffprobe');
const bin = fs.existsSync(ffprobe) ? ffprobe : 'ffprobe';
const probe = (file) => {
  const j = JSON.parse(
    execFileSync(bin, ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate:format=duration', '-of', 'json', file]).toString(),
  );
  const v = j.streams.find((s) => s.codec_type === 'video');
  const [n, d] = v.r_frame_rate.split('/').map(Number);
  return {w: v.width, h: v.height, fps: n / d, duration: Number(j.format.duration), audio: j.streams.some((s) => s.codec_type === 'audio')};
};

const SLOTS = ['leg', 'watch', 'run', 'coach', 'alone', 'group', 'ball'];
const dir = path.join(root, 'public/footage/glued');
const media = {};
for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []) {
  if (!/\.(mp4|mov|m4v|webm)$/i.test(f)) continue;
  const slot = SLOTS.find((s) => f.toLowerCase().includes(s) && !media[s]);
  if (slot) media[slot] = {file: `footage/glued/${f}`, ...probe(path.join(dir, f))};
}
fs.writeFileSync(path.join(root, 'src/glued/media.json'), JSON.stringify(media, null, 1) + '\n');
console.log('glued footage:', SLOTS.map((s) => `${s}=${media[s] ? media[s].file : 'PLACEHOLDER'}`).join('  '));
