// Render review stills: node scripts/stills.mjs 0 30 60 ...  → $STILLS_DIR (default out/stills)/f<frame>.jpg
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const frames = process.argv.slice(2).map(Number);
const browserExecutable = process.env.REMOTION_CHROME || null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'ESU-FallLaunch', browserExecutable});
for (const frame of frames) {
  await renderStill({
    composition, serveUrl, frame, browserExecutable,
    output: `${process.env.STILLS_DIR || 'out/stills'}/f${String(frame).padStart(4, '0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 70, scale: 0.4,
  });
  process.stdout.write(`${frame} `);
}
console.log('\ndone');
