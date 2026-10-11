import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {ESU, clamp} from '../presets/brand';

export const useFontsReady = () => {
  const [handle] = useState(() => delayRender('Loading ESU fonts'));
  useEffect(() => {
    const faces = [
      '400 100px Anton',
      '400 100px "Bebas Neue"',
      '600 100px Montserrat',
      '800 100px Montserrat',
      '500 100px "JetBrains Mono"',
      '700 100px "JetBrains Mono"',
    ];
    Promise.all(faces.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);
};

export const pop = (frame: number, fps: number, delay: number, config: {stiffness: number; damping: number} = ESU.spring.headline) =>
  spring({frame: frame - delay, fps, config});

export const shake = (frame: number, start: number, dur = 10, amp = 12): [number, number] => {
  const t = frame - start;
  if (t < 0 || t > dur) return [0, 0];
  const decay = 1 - t / dur;
  return [Math.sin(t * 2.7) * amp * decay, Math.cos(t * 3.3) * amp * 0.7 * decay];
};

export const Scene: React.FC<{bg: string; enter?: 'push' | 'flash' | 'cut'; children: React.ReactNode}> = ({bg, enter = 'push', children}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 6], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const push = enter === 'push';
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: push ? `translateX(${p * 160}px) scale(${1 + p * 0.06})` : undefined,
          filter: push && p > 0.01 ? `blur(${p * 14}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
      {enter === 'flash' && <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [0, 5], [0.85, 0], clamp)}} />}
    </AbsoluteFill>
  );
};

type VideoTextProps = {
  id: string;
  text: string;
  src: string;
  width: number;
  height: number;
  fontSize: number;
  baseline: number;
  letterSpacing?: number;
  playbackRate?: number;
  startFrom?: number;
  stroke?: string;
};

export const VideoText: React.FC<VideoTextProps> = (p) => (
  <div style={{position: 'relative', width: p.width, height: p.height}}>
    <svg width={p.width} height={p.height} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <clipPath id={p.id}>
          <text x={p.width / 2} y={p.baseline} textAnchor="middle" fontFamily="Anton" fontSize={p.fontSize} letterSpacing={p.letterSpacing ?? 0}>
            {p.text}
          </text>
        </clipPath>
      </defs>
    </svg>
    <div style={{position: 'absolute', inset: 0, clipPath: `url(#${p.id})`, background: ESU.navy}}>
      <OffthreadVideo
        src={staticFile(p.src)}
        muted
        playbackRate={p.playbackRate ?? 1}
        startFrom={p.startFrom}
        style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.12) saturate(1.25)'}}
      />
    </div>
    {p.stroke && (
      <svg width={p.width} height={p.height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <text
          x={p.width / 2}
          y={p.baseline}
          textAnchor="middle"
          fontFamily="Anton"
          fontSize={p.fontSize}
          letterSpacing={p.letterSpacing ?? 0}
          fill="none"
          stroke={p.stroke}
          strokeWidth={6}
        >
          {p.text}
        </text>
      </svg>
    )}
  </div>
);

export type Word = {w: string; t: number};
export type CaptionPage = {words: Word[]; start: number; end: number};

export const buildPages = (words: Word[], pageStarts: number[], end: number): CaptionPage[] =>
  pageStarts.map((s, i) => {
    const e = i + 1 < pageStarts.length ? pageStarts[i + 1] : words.length;
    const ws = words.slice(s, e);
    const next = i + 1 < pageStarts.length ? words[pageStarts[i + 1]].t - 0.06 : end;
    return {words: ws, start: ws[0].t - 0.06, end: next};
  });

export const Captions: React.FC<{pages: CaptionPage[]; theme: 'light' | 'dark'; top?: number}> = ({pages, theme, top = 1405}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const page = pages.find((p) => time >= p.start && time < p.end);
  if (!page) return null;
  const local = frame - Math.round(page.start * fps);
  const s = spring({frame: local, fps, config: {stiffness: 320, damping: 22}});
  let active = -1;
  page.words.forEach((w, i) => {
    if (time >= w.t - 0.03) active = i;
  });
  const base = theme === 'dark' ? ESU.white : ESU.navy;
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 70,
        right: 150,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        transform: `scale(${0.9 + s * 0.1})`,
        opacity: s,
      }}
    >
      {page.words.map((w, i) => (
        <span
          key={i}
          style={{
            fontFamily: ESU.font.body,
            fontWeight: 800,
            fontSize: 58,
            lineHeight: 1.25,
            padding: '2px 14px',
            margin: '0 2px',
            borderRadius: 12,
            color: i === active ? ESU.white : base,
            background: i === active ? ESU.red : 'transparent',
            textShadow: theme === 'dark' && i !== active ? '0 3px 14px rgba(0,0,0,0.7)' : undefined,
            transform: i === active ? 'scale(1.06)' : undefined,
          }}
        >
          {w.w}
        </span>
      ))}
    </div>
  );
};

export const AudioBadge: React.FC<{
  level: (frame: number) => number;
  showFrom: number;
  revealAt: number;
  compactAt: number;
  hideAt: number;
}> = ({level, showFrom, revealAt, compactAt, hideAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < showFrom || frame >= hideAt) return null;
  const inS = spring({frame: frame - showFrom, fps, config: {stiffness: 220, damping: 18}});
  const out = interpolate(frame, [hideAt - 6, hideAt], [1, 0], clamp);
  const r = spring({frame: frame - revealAt, fps, config: {stiffness: 160, damping: 15}});
  const c = spring({frame: frame - compactAt, fps, config: {stiffness: 140, damping: 18}});
  const lv = level(frame);
  const avatar = 140 * r * (1 - 0.4 * c);
  const barScale = 1 - 0.35 * c;
  const bars = Array.from({length: 16}, (_, i) => {
    const l = level(frame - i);
    return (8 + 46 * l * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.9 + frame * 0.35)))) * barScale;
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 56,
        top: 236,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: `${10 + r * 6 * (1 - c)}px 34px ${10 + r * 6 * (1 - c)}px ${18 - r * 6}px`,
        background: 'rgba(10,31,63,0.94)',
        borderRadius: 999,
        boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
        transform: `translateX(${(1 - inS) * -420}px)`,
        opacity: out,
      }}
    >
      {r > 0.02 && (
        <div
          style={{
            width: avatar,
            height: avatar,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '5px solid #fff',
            boxShadow: `0 0 0 ${3 + lv * 14 * (1 - 0.5 * c)}px rgba(200,16,46,0.55)`,
            flexShrink: 0,
          }}
        >
          <Img src={staticFile('img/denver_avatar.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      )}
      <div style={{display: 'flex', flexDirection: 'column', gap: 6 * (1 - c)}}>
        {r > 0.02 && (
          <div style={{opacity: r, transform: `translateY(${(1 - r) * 16}px)`}}>
            <div style={{fontFamily: ESU.font.head, fontSize: 56 - 14 * c, color: ESU.white, lineHeight: 0.95, letterSpacing: 1}}>COACH DENVER NEWTON</div>
            {c < 0.97 && (
              <div style={{fontFamily: ESU.font.mono, fontWeight: 700, fontSize: 19, color: ESU.gold, letterSpacing: 2, marginTop: 4 * (1 - c), opacity: 1 - c, height: 24 * (1 - c), overflow: 'hidden'}}>
                FOUNDER · EURO SOCCER USA · EST. 2005
              </div>
            )}
          </div>
        )}
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 12, height: 12, borderRadius: 6, background: ESU.red, opacity: 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.2))}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 4, height: 56 * barScale}}>
            {bars.map((h, i) => (
              <div key={i} style={{width: 6, height: h, borderRadius: 3, background: i % 3 === 0 ? ESU.gold : ESU.white}} />
            ))}
          </div>
          <div style={{fontFamily: ESU.font.mono, fontWeight: 700, fontSize: 20, color: 'rgba(255,255,255,0.75)', letterSpacing: 3}}>REAL AUDIO</div>
        </div>
      </div>
    </div>
  );
};

export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const x = ((f * 73) % 61) - 30;
  const y = ((f * 37) % 53) - 26;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.09}}>
      <Img src={staticFile('img/grain.png')} style={{width: 1180, height: 2020, transform: `translate(${x - 50}px, ${y - 50}px)`}} />
    </AbsoluteFill>
  );
};

export const Mono: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 26, color = ESU.navy, style}) => (
  <div style={{fontFamily: ESU.font.mono, fontWeight: 700, fontSize: size, letterSpacing: 3, color, ...style}}>{children}</div>
);
