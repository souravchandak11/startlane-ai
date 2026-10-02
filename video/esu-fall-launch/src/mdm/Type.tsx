/**
 * Kinetic type for the Mommy, Daddy & Me video: stickers, bouncy letters, serif emotion
 * lines and word-synced captions.
 */
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {FPS} from '../presets/brand';
import {FONT} from '../presets/fonts';
import {backOut, C, clamp, easeOut, timeline} from './theme';

/** rounded sticker with a thick white die-cut border + soft drop shadow, pops in at `at` */
export const Sticker: React.FC<{
  at: number;
  out?: number;
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  rot?: number;
  x?: number;
  y?: number;
  pad?: string;
  font?: string;
  weight?: number;
  radius?: number;
  wobble?: boolean;
  style?: React.CSSProperties;
}> = ({at, out, children, bg = C.sun, color = C.ink, size = 80, rot = -3, x = 540, y = 600, pad = '0.12em 0.5em 0.16em', font, weight = 700, radius = 999, wobble = true, style}) => {
  const frame = useCurrentFrame();
  if (frame < at || (out !== undefined && frame > out + 8)) return null;
  const k = backOut((frame - at) / 11, 2.6);
  const o = out !== undefined ? interpolate(frame, [out, out + 8], [1, 0], clamp) : 1;
  const so = out !== undefined ? interpolate(frame, [out, out + 8], [1, 0.6], clamp) : 1;
  const w = wobble ? Math.sin((frame - at) / 9) * 1.6 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${k * so}) rotate(${rot + w + (1 - k) * -12}deg)`,
        opacity: o,
        background: bg,
        color,
        fontFamily: font ?? FONT.round,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1,
        padding: pad,
        borderRadius: radius,
        border: `${Math.max(6, size * 0.1)}px solid #fff`,
        boxShadow: '0 14px 30px rgba(30,23,72,0.22)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** letters drop in one by one with squash/stretch; each letter can take its own colour */
export const BounceText: React.FC<{
  text: string;
  at: number;
  x?: number;
  y?: number;
  size?: number;
  colors?: string[];
  stagger?: number;
  font?: string;
  weight?: number;
  stroke?: string;
  idle?: boolean;
  out?: number;
  letterSpacing?: number;
  replace?: Record<number, React.ReactNode>;
}> = ({text, at, x = 540, y = 800, size = 180, colors = [C.ink], stagger = 2, font, weight = 700, stroke = '#fff', idle = true, out, letterSpacing = 0, replace = {}}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const o = out !== undefined ? interpolate(frame, [out, out + 6], [1, 0], clamp) : 1;
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'flex-end',
        opacity: o,
        letterSpacing,
      }}
    >
      {text.split('').map((ch, i) => {
        const d = frame - at - i * stagger;
        if (d < 0) return <span key={i} style={{fontSize: size, opacity: 0, fontFamily: font ?? FONT.round, fontWeight: weight}}>{ch === ' ' ? ' ' : ch}</span>;
        const fall = interpolate(d, [0, 6], [-size * 0.9, 0], {...clamp, easing: (t) => t * t});
        const sq = d >= 6 && d < 14 ? 1 - 0.22 * Math.sin(((d - 6) / 8) * Math.PI) : 1;
        const bob = idle && d > 14 ? Math.sin((frame + i * 6) / 7) * size * 0.03 : 0;
        const node = replace[i];
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontFamily: font ?? FONT.round,
              fontWeight: weight,
              fontSize: size,
              lineHeight: 1,
              color: colors[i % colors.length],
              WebkitTextStroke: stroke ? `${size * 0.075}px ${stroke}` : undefined,
              paintOrder: 'stroke fill',
              textShadow: stroke ? `0 ${size * 0.06}px 0 rgba(30,23,72,0.18)` : undefined,
              transform: `translateY(${fall + bob}px) scale(${1 / sq}, ${sq})`,
              transformOrigin: '50% 100%',
            }}
          >
            {node ?? (ch === ' ' ? ' ' : ch)}
          </span>
        );
      })}
    </div>
  );
};

/** elegant serif italic line, words rise in on their own frames */
export const SerifWords: React.FC<{
  words: {t: string; at: number; style?: React.CSSProperties}[];
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  out?: number;
  width?: number;
}> = ({words, x = 540, y = 600, size = 110, color = C.ink, out, width = 940}) => {
  const frame = useCurrentFrame();
  const o = out !== undefined ? interpolate(frame, [out, out + 8], [1, 0], clamp) : 1;
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y,
        width,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: FONT.serif,
        fontStyle: 'italic',
        fontSize: size,
        lineHeight: 1.02,
        color,
        opacity: o,
      }}
    >
      {words.map((w, i) => {
        const d = frame - w.at;
        const k = easeOut(d / 10);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.22em',
              opacity: d < 0 ? 0 : k,
              transform: `translateY(${(1 - k) * 40}px)`,
              filter: `blur(${(1 - k) * 8}px)`,
              ...w.style,
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ captions
type Emph = 'serif' | 'pop' | {sticker: string; color?: string} | {color: string};
export type CapLine = {
  y: number;
  dark?: boolean;
  size?: number;
  emph?: Record<number, Emph>;
  maxWords?: number;
  /** stop captioning from this word index on (big type takes over) */
  hideFrom?: number;
  /** words carried by on-screen graphics instead of captions */
  hideWords?: number[];
};

/**
 * Word-synced captions (lowercase, rounded, die-cut white outline). Words appear as spoken,
 * the active word lifts + scales; emphasis words swap to serif / sticker / accent colour.
 */
export const Captions: React.FC<{lines: Partial<Record<string, CapLine>>}> = ({lines}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ln = timeline.lines.find((l) => t >= l.start - 0.05 && t <= l.end + 0.35);
  if (!ln) return null;
  const cfg = lines[ln.id];
  if (!cfg) return null;
  // paginate on punctuation / max words
  const max = cfg.maxWords ?? 4;
  const pages: number[][] = [];
  let cur: number[] = [];
  const hidden = (i: number) => (cfg.hideFrom !== undefined && i >= cfg.hideFrom) || (cfg.hideWords ?? []).includes(i);
  ln.words.forEach((w, i) => {
    if (hidden(i)) {
      if (cur.length) pages.push(cur);
      cur = [];
      pages.push([i]);
      return;
    }
    cur.push(i);
    if (cur.length >= max || /[,.…!?]$/.test(w.w)) {
      pages.push(cur);
      cur = [];
    }
  });
  if (cur.length) pages.push(cur);
  let page = pages[0];
  for (const p of pages) if (t >= ln.words[p[0]].start - 0.04) page = p;
  if (page.every(hidden)) return null;
  const size = cfg.size ?? 74;
  const fill = cfg.dark ? '#fff' : C.ink;
  const outline = cfg.dark ? C.ink : '#fff';
  const lineOut = interpolate(t, [ln.end + 0.22, ln.end + 0.35], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: cfg.y,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: size * 0.26,
        rowGap: size * 0.1,
        opacity: lineOut,
      }}
    >
      {page.map((i) => {
        const w = ln.words[i];
        const d = (t - w.start) * FPS;
        if (d < -1) return null;
        const k = backOut(d / 7, 2.2);
        const active = t >= w.start && t < w.end + 0.08;
        const e = cfg.emph?.[i];
        const text = w.w.toLowerCase().replace(/[“”"]/g, '');
        const base: React.CSSProperties = {
          display: 'inline-block',
          fontFamily: FONT.round,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.05,
          color: fill,
          WebkitTextStroke: `${size * 0.16}px ${outline}`,
          paintOrder: 'stroke fill',
          transform: `translateY(${(1 - k) * 30 - (active ? 6 : 0)}px) scale(${k * (active ? 1.08 : 1)})`,
          transition: 'none',
        };
        if (e === 'serif') {
          return (
            <span
              key={i}
              style={{...base, fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 400, fontSize: size * 1.55, color: C.red, WebkitTextStroke: `${size * 0.12}px ${outline}`}}
            >
              {text}
            </span>
          );
        }
        if (e === 'pop') {
          return (
            <span key={i} style={{...base, fontSize: size * 1.3, color: C.red}}>
              {text}
            </span>
          );
        }
        if (e && 'sticker' in e) {
          return (
            <span
              key={i}
              style={{
                ...base,
                WebkitTextStroke: undefined,
                background: e.sticker,
                color: e.color ?? C.ink,
                padding: '0.04em 0.36em 0.1em',
                borderRadius: 999,
                border: `${size * 0.1}px solid #fff`,
                boxShadow: '0 10px 24px rgba(30,23,72,0.22)',
                margin: `0 ${size * 0.12}px`,
                transform: `${base.transform} rotate(-3deg)`,
              }}
            >
              {text}
            </span>
          );
        }
        if (e && 'color' in e) return <span key={i} style={{...base, color: e.color}}>{text}</span>;
        return (
          <span key={i} style={base}>
            {text}
          </span>
        );
      })}
    </div>
  );
};
