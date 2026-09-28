import React from 'react';
import {AbsoluteFill, Freeze, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ESU} from '../presets/brand';
import {FONT} from '../presets/fonts';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Stepped motion: children only update every `step` frames (≈15 fps at step 2),
 * the choppy "posterize time" feel of Metro Media House graphic segments.
 */
export const Stepped: React.FC<{step?: number; children: React.ReactNode}> = ({step = 2, children}) => {
  const frame = useCurrentFrame();
  return <Freeze frame={Math.floor(frame / step) * step}>{children}</Freeze>;
};

/** Monochrome grade for the "problem" half: B&W, a touch of contrast. */
export const Mono: React.FC<{children: React.ReactNode; amount?: number}> = ({children, amount = 1}) => (
  <AbsoluteFill style={{filter: `grayscale(${amount}) contrast(1.12) brightness(0.96)`}}>{children}</AbsoluteFill>
);

type Word = {t: string; at: number; big?: boolean; /** frames after `at` when the word flips to brand red */ flip?: number};

/**
 * Full-screen type card: white italic serif on black, or black on white.
 * Words appear on their frames (relative to the card's Sequence).
 */
export const TypeCard: React.FC<{
  words: Word[];
  tone?: 'dark' | 'light';
  size?: number;
  serif?: boolean;
  align?: 'center' | 'left';
}> = ({words, tone = 'dark', size = 150, serif = true, align = 'center'}) => {
  const frame = useCurrentFrame();
  const fg = tone === 'dark' ? ESU.white : '#0b0b0b';
  const bg = tone === 'dark' ? '#050505' : '#F4F1EC';
  const drift = interpolate(frame, [0, 60], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{background: bg, alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          width: 940,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          alignItems: 'baseline',
          gap: '0 26px',
          transform: `scale(${drift})`,
          textAlign: align,
        }}
      >
        {words.map((w, i) => {
          const d = frame - w.at;
          const op = interpolate(d, [-1, 4], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{
                fontFamily: serif ? FONT.serif : FONT.ui,
                fontStyle: serif ? 'italic' : 'normal',
                fontWeight: serif ? 400 : 600,
                fontSize: w.big ? size * 1.9 : size,
                lineHeight: 1.02,
                // tracking tightens as the word lands — a subtle "settle"
                letterSpacing: interpolate(d, [-1, 10], [serif ? 10 : 14, serif ? -1 : -2], clamp),
                color: w.flip !== undefined && d >= w.flip ? ESU.red : fg,
                textShadow: tone === 'dark' && serif ? '0 0 30px rgba(255,255,255,0.45)' : 'none',
                opacity: op,
                transform: `translateY(${interpolate(d, [-1, 6], [12, 0], clamp)}px)`,
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Newspaper clipping with a yellow highlighter swipe on the key phrase. */
export const NewsClip: React.FC<{
  kicker: string;
  before: string;
  highlight: string;
  after: string;
  source: string;
  highlightAt: number;
}> = ({kicker, before, highlight, after, source, highlightAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {stiffness: 140, damping: 20}});
  const wipe = interpolate(frame - highlightAt, [0, 8], [0, 100], clamp);
  return (
    <div
      style={{
        width: 920,
        padding: '56px 60px 50px',
        background: '#f3efe6',
        boxShadow: '0 40px 90px rgba(0,0,0,0.6)',
        transform: `rotate(${interpolate(s, [0, 1], [-5, -1.5])}deg) scale(${interpolate(s, [0, 1], [1.15, 1])})`,
        color: '#111',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 4,
          textTransform: 'uppercase',
          borderBottom: '4px solid #111',
          paddingBottom: 16,
          marginBottom: 26,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{kicker}</span>
        <span style={{fontWeight: 500, letterSpacing: 1}}>HEALTH · FAMILY</span>
      </div>
      <div style={{fontFamily: FONT.serif, fontSize: 92, lineHeight: 1.04, letterSpacing: -1}}>
        {before}{' '}
        <span style={{position: 'relative', whiteSpace: 'nowrap'}}>
          <span
            style={{
              position: 'absolute',
              left: -8,
              top: '12%',
              height: '82%',
              width: `calc(${wipe}% + 16px)`,
              background: 'rgba(255,225,77,0.85)',
              zIndex: 0,
              transform: 'skewX(-6deg)',
            }}
          />
          <span style={{position: 'relative', zIndex: 1}}>{highlight}</span>
        </span>{' '}
        {after}
      </div>
      <div style={{fontFamily: FONT.ui, fontSize: 28, marginTop: 28, color: '#555'}}>{source}</div>
      {/* paper grain */}
      <AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.015) 0 2px, rgba(0,0,0,0) 2px 5px)', pointerEvents: 'none'}} />
    </div>
  );
};

/** White pop-up card (Metro Media House "stacked notification" insert). */
export const WhiteCard: React.FC<{
  at: number;
  title: string;
  body?: string;
  icon?: React.ReactNode;
  width?: number;
}> = ({at, title, body, icon, width = 900}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {stiffness: 420, damping: 24}});
  return (
    <div
      style={{
        width,
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '28px 34px',
        borderRadius: 30,
        background: '#ffffff',
        boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
        transform: `translateY(${(1 - p) * 40}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
        opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
        fontFamily: FONT.ui,
        color: '#111',
      }}
    >
      {icon && (
        <div style={{width: 84, height: 84, borderRadius: 20, background: '#f1f1f3', display: 'grid', placeItems: 'center', flexShrink: 0}}>
          {icon}
        </div>
      )}
      <div>
        <div style={{fontSize: 46, fontWeight: 700, letterSpacing: -0.8, lineHeight: 1.1}}>{title}</div>
        {body && <div style={{fontSize: 34, color: '#555', marginTop: 6}}>{body}</div>}
      </div>
    </div>
  );
};

/**
 * Glitch cut overlay: 3 frames of difference-inverted image, RGB-offset slices
 * and static noise. Place it over everything at an absolute frame.
 */
export const GlitchCut: React.FC<{at: number; length?: number}> = ({at, length = 4}) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < -1 || d >= length) return null;
  const slices = new Array(7).fill(0).map((_, i) => ({
    top: random(`gt${at}-${d}-${i}`) * 1920,
    h: 20 + random(`gh${at}-${d}-${i}`) * 140,
    x: (random(`gx${at}-${d}-${i}`) - 0.5) * 160,
    c: i % 2 ? 'rgba(255,0,60,0.55)' : 'rgba(0,240,255,0.5)',
  }));
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {d % 2 === 0 && <AbsoluteFill style={{background: '#fff', mixBlendMode: 'difference'}} />}
      {slices.map((s, i) => (
        <div
          key={i}
          style={{position: 'absolute', left: 0, right: 0, top: s.top, height: s.h, background: s.c, transform: `translateX(${s.x}px)`, mixBlendMode: 'screen'}}
        />
      ))}
      <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.35, mixBlendMode: 'overlay'}}>
        <filter id={`st${at}${d}`}>
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed={at + d} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter={`url(#st${at}${d})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Tablet showing an autoplay "next episode" countdown – the Saturday-morning trap. */
export const TabletAutoplay: React.FC<{countFrom?: number}> = ({countFrom = 5}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = Math.max(1, countFrom - Math.floor(frame / fps));
  const ring = (frame % fps) / fps;
  return (
    <div
      style={{
        width: 980,
        height: 700,
        borderRadius: 60,
        background: '#0c0c0c',
        padding: 26,
        boxShadow: '0 60px 140px rgba(0,0,0,0.75), 0 0 160px rgba(90,140,255,0.35)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 38,
          overflow: 'hidden',
          background: 'radial-gradient(circle at 30% 30%, #ffb347 0%, #ff5e62 40%, #6a3de8 100%)',
        }}
      >
        {/* cartoon-ish blobs = generic kids' show thumbnail */}
        <div style={{position: 'absolute', left: 120, top: 150, width: 260, height: 260, borderRadius: '50%', background: '#ffe066', boxShadow: 'inset -20px -20px 0 rgba(0,0,0,0.12)'}} />
        <div style={{position: 'absolute', left: 190, top: 230, width: 36, height: 36, borderRadius: '50%', background: '#222'}} />
        <div style={{position: 'absolute', left: 280, top: 230, width: 36, height: 36, borderRadius: '50%', background: '#222'}} />
        <div style={{position: 'absolute', right: 110, top: 120, width: 300, height: 300, borderRadius: 60, background: '#55d6be', transform: 'rotate(12deg)'}} />
        <AbsoluteFill style={{background: 'rgba(0,0,0,0.45)'}} />
        <div style={{position: 'absolute', left: 60, bottom: 60, right: 60, display: 'flex', alignItems: 'center', gap: 34, fontFamily: FONT.ui, color: 'white'}}>
          <svg width="150" height="150" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.25)" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeDasharray={276}
              strokeDashoffset={276 * ring}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="64" textAnchor="middle" fontSize="42" fontWeight="700" fill="white" fontFamily="Inter">
              {n}
            </text>
          </svg>
          <div>
            <div style={{fontSize: 34, opacity: 0.8, fontWeight: 600}}>Next episode in {n}…</div>
            <div style={{fontSize: 52, fontWeight: 800, letterSpacing: -1}}>Episode 14 · Season 3</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: '100%', background: 'rgba(255,255,255,0.2)'}}>
          <div style={{height: '100%', width: '97%', background: '#ff3b3b'}} />
        </div>
      </div>
    </div>
  );
};
