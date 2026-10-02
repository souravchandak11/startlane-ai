import timeline from '../timeline_mdm.json';
import {FPS} from '../presets/brand';

/** Mommy, Daddy & Me palette: warm nursery pastels + ESU navy/red for brand moments. */
export const C = {
  cream: '#FFF4E4',
  paper: '#FFFBF4',
  butter: '#FFE59A',
  sun: '#FFC233',
  orange: '#FF9F43',
  sky: '#8ED1FF',
  skyDeep: '#3FA2F0',
  grass: '#7BD66A',
  grassDeep: '#45B04A',
  pink: '#FF8FB4',
  coral: '#FF7461',
  lilac: '#B8A4FF',
  mint: '#8FE3C4',
  navy: '#181145',
  navySoft: '#2B2370',
  red: '#ED1C24',
  ink: '#1E1748',
  white: '#FFFFFF',
  // muted "same old Saturday" palette
  dullBg: '#D9DCE3',
  dull1: '#B8BDC9',
  dull2: '#9AA0AF',
  dull3: '#6F7584',
  night: '#1B1A4A',
  nightSoft: '#2E2C6E',
};

export const SKIN = {toddler: '#F3C29B', mom: '#E9AE86', dad: '#C68A60'};
export const HAIR = {toddler: '#5A3A22', mom: '#3B2418', dad: '#2A1C14'};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type LineId = (typeof timeline.lines)[number]['id'];
export const line = (id: LineId) => timeline.lines.find((l) => l.id === id)!;
/** line start / end / word start, in frames */
export const L = (id: LineId) => Math.round(line(id).start * FPS);
export const E = (id: LineId) => Math.round(line(id).end * FPS);
export const W = (id: LineId, n: number) =>
  Math.round(line(id).words[Math.min(n, line(id).words.length - 1)].start * FPS);
export const TOTAL = Math.round(timeline.total * FPS);
export {timeline};

/** easeOutBack-ish pop used everywhere for sticker entrances */
export const backOut = (t: number, s = 1.70158) => {
  const x = Math.min(1, Math.max(0, t)) - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
};
export const easeOut = (t: number, p = 3) => 1 - (1 - Math.min(1, Math.max(0, t))) ** p;
export const easeInOut = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};
