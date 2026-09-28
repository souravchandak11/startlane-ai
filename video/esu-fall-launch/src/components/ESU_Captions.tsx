import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ESU} from '../presets/brand';
import {FONT} from '../presets/fonts';
import timeline from '../timeline.json';

type Word = {w: string; start: number; end: number};

export type CaptionStyle = {
  /** words (lower-case, letters/digits only) that jump to a huge italic serif, on their own line */
  emphasis?: string[];
  /** vertical center of the caption block, as a fraction of frame height */
  y?: number;
  /** max words per caption chunk (Metro Media House uses 1–4) */
  maxWords?: number;
  /** body size in px */
  size?: number;
  /** line ids with no captions (the words are already on screen as a type card) */
  hide?: string[];
  /** hide individual chunks, keyed "lineId:firstWordIndex" */
  hidePages?: string[];
  /** hide captions inside these absolute frame ranges [from, to) */
  hideRanges?: [number, number][];
  /** per-line vertical override */
  yByLine?: Record<string, number>;
};

const key = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Words that keep their capitalisation; everything else is set lower-case. */
const KEEP_CASE = new Set(['LA', 'USA', "USA's", 'AM', 'iPad', 'Euro', 'Soccer', 'Fall', 'Academy', 'European-trained', 'I', "I'm"]);

const displayWord = (raw: string) => {
  const w = raw.replace(/["“”—]/g, '').replace(/[.,;:…!]+$/g, '');
  if (KEEP_CASE.has(w)) return w;
  return w.toLowerCase();
};

const buildPages = (maxWords: number, emphasis: Set<string>) => {
  const pages: {line: string; first: number; words: Word[]}[] = [];
  for (const line of timeline.lines) {
    let cur: Word[] = [];
    let first = 0;
    const flush = () => {
      if (cur.length) pages.push({line: line.id, first, words: cur});
      cur = [];
    };
    line.words.forEach((w, i) => {
      if (w.w === '—') return;
      // an emphasis word always gets a chunk of its own
      if (emphasis.has(key(w.w)) && cur.length) flush();
      if (cur.length === 0) first = i;
      cur.push(w);
      const punct = /[,.;:!?…"]$/.test(w.w);
      const next = line.words[i + 1];
      if (cur.length >= maxWords || punct || !next || emphasis.has(key(w.w)) || emphasis.has(key(next.w))) flush();
    });
    flush();
  }
  return pages;
};

/**
 * Metro-Media-House caption system: plain white grotesk, mostly lower-case,
 * 1–4 word chunks that fade up word-by-word with the VO, no colored boxes.
 * Emphasis comes from scale alone: key words jump to a huge italic serif.
 */
export const ESUCaptions: React.FC<CaptionStyle> = ({
  emphasis = [],
  y = 0.66,
  maxWords = 3,
  size = 66,
  hide = [],
  hidePages = [],
  hideRanges = [],
  yByLine = {},
}) => {
  const frame = useCurrentFrame();
  const {fps, height, width} = useVideoConfig();
  const t = frame / fps;
  const emph = React.useMemo(() => new Set(emphasis.map(key)), [emphasis]);
  const pages = React.useMemo(() => buildPages(maxWords, emph), [maxWords, emph]);

  if (hideRanges.some(([a, b]) => frame >= a && frame < b)) return null;
  const idx = pages.findIndex((p, i) => {
    const s = p.words[0].start;
    const nextStart = pages[i + 1]?.words[0].start ?? Infinity;
    const e = Math.min(p.words[p.words.length - 1].end + 0.3, nextStart);
    return t >= s - 0.03 && t < e;
  });
  if (idx === -1) return null;
  const page = pages[idx];
  if (hide.includes(page.line) || hidePages.includes(`${page.line}:${page.first}`)) return null;
  const isEmph = page.words.length === 1 && emph.has(key(page.words[0].w));

  return (
    <div
      style={{
        position: 'absolute',
        left: 50,
        right: 50,
        top: height * (yByLine[page.line] ?? y),
        transform: 'translateY(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: '0 18px',
        textAlign: 'center',
      }}
    >
      {page.words.map((w, i) => {
        const wf = Math.round(w.start * fps);
        const d = frame - wf;
        const op = interpolate(d, [-1, 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const rise = interpolate(d, [-1, 6], [10, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const text = displayWord(w.w);
        const emphSize = Math.min(230, ((width - 100) / Math.max(4, text.length)) * 1.9);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontFamily: isEmph ? FONT.serif : FONT.ui,
              fontStyle: isEmph ? 'italic' : 'normal',
              fontWeight: isEmph ? 400 : 600,
              fontSize: isEmph ? emphSize : size,
              letterSpacing: isEmph ? -1 : -0.5,
              lineHeight: isEmph ? 1 : 1.18,
              color: ESU.white,
              opacity: op,
              transform: `translateY(${rise}px)`,
              textShadow: '0 4px 24px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.55)',
            }}
          >
            {text}
          </span>
        );
      })}
    </div>
  );
};
