import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ESU} from '../presets/brand';
import {FONT} from '../presets/fonts';
import timeline from '../timeline.json';

type Word = {w: string; start: number; end: number};

export type CaptionStyle = {
  /** words (lower-case, no punctuation) that get the highlight treatment */
  highlight?: string[];
  /** words that get the serif-italic accent instead of the heavy sans */
  serif?: string[];
  /** vertical position of the caption block's center, as a fraction of height */
  y?: number;
  /** max words shown per caption page */
  maxWords?: number;
  color?: string;
  highlightColor?: string;
  size?: number;
  /** line ids to hide captions for (e.g. when the words are already on screen as a graphic) */
  hide?: string[];
  /** hide individual pages, keyed "lineId:firstWordIndex" */
  hidePages?: string[];
  /** per-line vertical position override */
  yByLine?: Record<string, number>;
};

const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

/** Break every VO line into short caption "pages" of 1–3 words, splitting on punctuation. */
const buildPages = (maxWords: number) => {
  const pages: {line: string; first: number; words: Word[]}[] = [];
  for (const line of timeline.lines) {
    let cur: Word[] = [];
    let first = 0;
    line.words.forEach((w, i) => {
      if (cur.length === 0) first = i;
      cur.push(w);
      const punct = /[,.;:!?…—"]$/.test(w.w);
      const next = line.words[i + 1];
      if (cur.length >= maxWords || punct || !next) {
        pages.push({line: line.id, first, words: cur});
        cur = [];
      }
    });
  }
  return pages;
};

/**
 * Metro-Media-style word-by-word captions: short pages that pop on with a spring,
 * the active word lights up, keywords get a colored block or an italic serif swap.
 */
export const ESUCaptions: React.FC<CaptionStyle> = ({
  highlight = [],
  serif = [],
  y = 0.7,
  maxWords = 3,
  color = ESU.white,
  highlightColor = ESU.gold,
  size = 92,
  hide = [],
  hidePages = [],
  yByLine = {},
}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const t = frame / fps;
  const pages = React.useMemo(() => buildPages(maxWords), [maxWords]);
  const hl = new Set(highlight.map(clean));
  const sf = new Set(serif.map(clean));

  const idx = pages.findIndex((p, i) => {
    const s = p.words[0].start;
    const nextStart = pages[i + 1]?.words[0].start ?? Infinity;
    const e = Math.min(p.words[p.words.length - 1].end + 0.35, nextStart);
    return t >= s - 0.03 && t < e;
  });
  if (idx === -1) return null;
  const page = pages[idx];
  if (hide.includes(page.line) || hidePages.includes(`${page.line}:${page.first}`)) return null;

  const pageStart = Math.round(page.words[0].start * fps);
  const pop = spring({frame: frame - pageStart + 1, fps, config: {stiffness: 380, damping: 18, mass: 0.6}});

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: height * (yByLine[page.line] ?? y),
        transform: `translateY(-50%) scale(${interpolate(pop, [0, 1], [0.7, 1])})`,
        opacity: interpolate(pop, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: '0 22px',
        textAlign: 'center',
      }}
    >
      {page.words.map((w, i) => {
        const key = clean(w.w);
        const active = t >= w.start - 0.02;
        const isHl = hl.has(key);
        const isSerif = sf.has(key);
        const wf = Math.round(w.start * fps);
        const wPop = spring({frame: frame - wf + 1, fps, config: {stiffness: 420, damping: 16, mass: 0.5}});
        const display = w.w.replace(/["“”—]/g, '').replace(/[.,;:…]+$/g, '');
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              fontFamily: isSerif ? FONT.serif : FONT.caption,
              fontStyle: isSerif ? 'italic' : 'normal',
              fontWeight: isSerif ? 400 : 800,
              fontSize: isSerif ? size * 1.28 : size,
              lineHeight: 1.08,
              letterSpacing: isSerif ? 0 : -1.5,
              textTransform: isSerif ? 'none' : 'uppercase',
              color: isHl && !isSerif ? ESU.navyDeep : isSerif ? highlightColor : color,
              opacity: active ? 1 : 0.0,
              transform: `scale(${active ? interpolate(wPop, [0, 1], [1.35, 1]) : 1})`,
              display: 'inline-block',
              padding: isHl && !isSerif ? '2px 16px 0' : 0,
              textShadow: isHl && !isSerif ? 'none' : '0 6px 28px rgba(0,0,0,0.75), 0 2px 4px rgba(0,0,0,0.6)',
              WebkitTextStroke: isHl || isSerif ? undefined : '2px rgba(0,0,0,0.35)',
            }}
          >
            {isHl && !isSerif && (
              <span
                style={{
                  position: 'absolute',
                  inset: '8% 0 4% 0',
                  background: highlightColor,
                  borderRadius: 14,
                  transform: 'rotate(-1.5deg)',
                  zIndex: -1,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                }}
              />
            )}
            {display}
          </span>
        );
      })}
    </div>
  );
};
