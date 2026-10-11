import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export const M = {
  navy: '#1C3054',
  gold: '#F0D993',
  ivory: '#FFFDF7',
  red: '#ED1C24',
  paper: '#F1EBDF',
  ink: '#16181D',
  black: '#0B0C10',
  slam: '"Barlow Condensed", sans-serif',
  small: 'Inter, sans-serif',
  mono: '"JetBrains Mono", monospace',
} as const;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FPS = 30;
export const VO_START = 3;

export type Narration = {duration: number; words: {w: string; t: number; end: number}[]};
export const timing = (n: Narration) => ({
  w: (i: number) => VO_START + Math.round(n.words[i].t * FPS),
  voEnd: VO_START + Math.round(n.duration * FPS),
});

export type Part = string | {img: string};
export type Item =
  | {k: 'spread'; from: number; to: number; y: number; color?: string; size?: number}
  | {k: 'slam'; at: number; lines: Part[][]; y: number; size: number; colors?: string[]; lineAt?: number[]}
  | {k: 'polaroid'; at: number; src: string; x: number; y: number; w: number; h: number; rot: number; label?: string}
  | {k: 'string'; at: number; pts: [number, number][]}
  | {k: 'quote'; from: number; to: number; x: number; y: number; w: number; rot: number; source: string; size?: number; enterAt?: number}
  | {k: 'source'; at: number; text: string; dark?: boolean}
  | {k: 'counter'; at: number; dur: number; from: number; to: number; prefix?: string; suffix?: string; y: number; size: number; color: string}
  | {k: 'dots'; at: number; n: number; cols: number; y: number; dot: number; color: string; dim: string; lit?: number}
  | {k: 'clipping'; at: number; x: number; y: number; w: number; rot: number; masthead: string; meta: string; title: string; byline: string; excerpt: string; hiAt: number}
  | {k: 'tiles'; at: number; tiles: string[]; y: number; stagger?: number; size?: number}
  | {k: 'ring'; at: number; cx: number; cy: number; rx: number; ry: number}
  | {k: 'stamp'; at: number; text: string; x: number; y: number; rot: number; color: string; size: number}
  | {k: 'invoice'; at: number; x: number; y: number; w: number; title: string; rows: {label: string; value: string; at: number; red?: boolean}[]}
  | {k: 'photo'; at: number; src: string; x: number; y: number; w: number; h: number; rot?: number; video?: boolean; bw?: boolean; border?: boolean}
  | {k: 'vhs'; left: string; right: string}
  | {k: 'label'; at: number; text: string; x: number; y: number; color: string; size?: number; align?: 'left' | 'center' | 'right'};

export type SceneDef = {
  from: number;
  canvas: 'screen' | 'paper' | 'navy' | 'black';
  media?: {src: string; video?: boolean; bw?: boolean; startFrom?: number; rate?: number; bandY?: number; bandH?: number};
  flash?: boolean;
  power?: boolean;
  sfx?: string;
  items: Item[];
};

export type EndPanel = {
  from: number;
  photo: string;
  lines: [string, string];
  info: [string, string][];
  cta: string;
};

export type MetroVideo = {
  vo: string;
  narration: Narration;
  rail: {left: string; right: string};
  display?: Record<string, string>;
  scenes: SceneDef[];
  end: EndPanel;
  extraSfx?: [number, string, number][];
};

export const useFonts = () => {
  const [h] = useState(() => delayRender('metro fonts'));
  useEffect(() => {
    const faces = ['700 100px "Barlow Condensed"', '800 100px "Barlow Condensed"', '500 100px Inter', '600 100px Inter', '800 100px Inter', '500 100px "JetBrains Mono"', '700 100px "JetBrains Mono"'];
    Promise.all(faces.map((f) => document.fonts.load(f))).then(() => continueRender(h));
  }, [h]);
};

const isDark = (c: SceneDef['canvas']) => c !== 'paper';
const media = (src: string) => staticFile(src);
const isVideo = (src: string) => src.endsWith('.mp4');
const grade = (bw?: boolean) => (bw ? 'grayscale(1) contrast(1.15) brightness(0.9)' : 'sepia(0.16) saturate(0.95) contrast(1.06) brightness(0.97)');

// ── textures ──────────────────────────────────────────────────────────
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.11, pointerEvents: 'none'}}>
      <Img src={staticFile('img/grain.png')} style={{width: 1180, height: 2020, transform: `translate(${((f * 73) % 61) - 80}px, ${((f * 37) % 53) - 76}px)`}} />
    </AbsoluteFill>
  );
};

const LightLeak: React.FC<{strength?: number}> = ({strength = 1}) => {
  const f = useCurrentFrame();
  const a = 0.22 + 0.1 * Math.sin(f / 23);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: a * strength,
        background: `radial-gradient(600px 900px at ${-60 + 40 * Math.sin(f / 40)}px ${300 + 80 * Math.cos(f / 50)}px, rgba(255,140,60,0.9), transparent 70%), radial-gradient(500px 700px at ${1160 - 30 * Math.sin(f / 35)}px 1500px, rgba(237,28,36,0.55), transparent 70%)`,
      }}
    />
  );
};

const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${strength}) 100%)`}} />
);

const Halftone: React.FC<{color: string}> = ({color}) => (
  <AbsoluteFill style={{opacity: 0.22}}>
    <svg width={1080} height={1920}>
      <defs>
        <pattern id="ht" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx="9" cy="9" r="3.2" fill={color} />
        </pattern>
        <radialGradient id="htm" cx="0.85" cy="0.15" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="htmask">
          <rect width="1080" height="1920" fill="url(#htm)" />
        </mask>
      </defs>
      <rect width="1080" height="1920" fill="url(#ht)" mask="url(#htmask)" />
    </svg>
  </AbsoluteFill>
);

const Stars: React.FC = () => {
  const f = useCurrentFrame();
  const stars = Array.from({length: 120}, (_, i) => ({x: (i * 397) % 1080, y: (i * 733) % 1920, r: 1 + ((i * 7) % 3), p: i * 1.7}));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.25 + 0.35 * Math.abs(Math.sin(f / 18 + s.p))} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Paper: React.FC = () => (
  <AbsoluteFill style={{background: M.paper}}>
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.35, mixBlendMode: 'multiply'}}>
      <filter id="fib">
        <feTurbulence type="fractalNoise" baseFrequency="0.9 0.08" numOctaves="3" seed="4" />
        <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 0.35 0" />
      </filter>
      <rect width="1080" height="1920" filter="url(#fib)" />
    </svg>
    <Vignette strength={0.22} />
  </AbsoluteFill>
);

const Scanlines: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.22, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 2px, transparent 2px, transparent 5px)'}} />
);

// ── media "screen" canvas: blurred bed + crisp CRT band ───────────────
const MediaEl: React.FC<{src: string; bw?: boolean; startFrom?: number; rate?: number; style?: React.CSSProperties; fringe?: boolean}> = ({src, bw, startFrom, rate, style, fringe}) => {
  const s: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', filter: `${grade(bw)}${fringe ? ' drop-shadow(3px 0 0 rgba(255,0,40,0.35)) drop-shadow(-3px 0 0 rgba(0,170,255,0.35))' : ''}`, ...style};
  return isVideo(src) ? <OffthreadVideo src={media(src)} muted startFrom={startFrom} playbackRate={rate ?? 1} style={s} /> : <Img src={media(src)} style={s} />;
};

const Screen: React.FC<{m: NonNullable<SceneDef['media']>; local: number}> = ({m, local}) => {
  const bandH = m.bandH ?? 760;
  const bandY = m.bandY ?? 640;
  const push = interpolate(local, [0, 90], [1, 1.07], clamp);
  return (
    <AbsoluteFill style={{background: M.black}}>
      <AbsoluteFill style={{filter: 'blur(38px) brightness(0.45)', transform: 'scale(1.2)'}}>
        <MediaEl src={m.src} bw={m.bw} startFrom={m.startFrom} rate={m.rate} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: bandY, width: 1080, height: bandH, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
        <div style={{width: '100%', height: '100%', transform: `scale(${push})`}}>
          <MediaEl src={m.src} bw={m.bw} startFrom={m.startFrom} rate={m.rate} fringe />
        </div>
        <Scanlines />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)'}} />
      </div>
    </AbsoluteFill>
  );
};

// ── typography ────────────────────────────────────────────────────────
const appear = (f: number, at: number) => (f < at ? 0 : 1);
const settle = (f: number, at: number) => interpolate(f - at, [0, 3], [1.07, 1], clamp);

const Spread: React.FC<{words: string[]; ats: number[]; y: number; color: string; size: number; shadow: boolean}> = ({words, ats, y, color, size, shadow}) => {
  const f = useCurrentFrame();
  return (
    <>
      {words.map((w, k) => {
        const row = Math.floor(k / 3);
        const col = k % 3;
        const align = col === 0 ? 'left' : col === 1 ? 'center' : 'right';
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              top: y + row * (size * 1.5),
              left: 80,
              right: 80,
              textAlign: align,
              fontFamily: M.small,
              fontWeight: 600,
              fontSize: size,
              color,
              opacity: appear(f, ats[k]),
              textShadow: shadow ? '0 2px 16px rgba(0,0,0,0.7)' : undefined,
            }}
          >
            {w}
          </div>
        );
      })}
    </>
  );
};

const Chip: React.FC<{src: string; h: number}> = ({src, h}) => (
  <span style={{display: 'inline-block', width: h * 1.3, height: h, margin: `0 ${h * 0.12}px`, verticalAlign: 'middle', borderRadius: h * 0.16, overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.35)', position: 'relative', top: -h * 0.06}}>
    <MediaEl src={src} />
  </span>
);

const Slam: React.FC<{item: Extract<Item, {k: 'slam'}>; dark: boolean}> = ({item, dark}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top: item.y, left: 50, right: 50, textAlign: 'center'}}>
      {item.lines.map((line, li) => {
        const at = item.lineAt?.[li] ?? item.at;
        const color = item.colors?.[li] ?? (dark ? M.ivory : M.ink);
        return (
          <div
            key={li}
            style={{
              fontFamily: M.slam,
              fontWeight: 800,
              fontSize: item.size,
              lineHeight: 0.95,
              letterSpacing: -1,
              textTransform: 'uppercase',
              color,
              opacity: appear(f, at),
              transform: `scale(${settle(f, at)})`,
              textShadow: dark ? '0 4px 30px rgba(0,0,0,0.45)' : undefined,
              whiteSpace: 'nowrap',
            }}
          >
            {line.map((p, pi) => (typeof p === 'string' ? <span key={pi}>{p}</span> : <Chip key={pi} src={p.img} h={item.size * 0.72} />))}
          </div>
        );
      })}
    </div>
  );
};

// ── paper props ───────────────────────────────────────────────────────
const Pin: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <div style={{position: 'absolute', left: x - 17, top: y - 17, width: 34, height: 34, borderRadius: 17, background: `radial-gradient(circle at 35% 30%, #ff8a8a, ${M.red} 45%, #8c0b10)`, boxShadow: '2px 5px 6px rgba(0,0,0,0.35)', transform: `scale(${s})`}} />
);

const Polaroid: React.FC<{item: Extract<Item, {k: 'polaroid'}>}> = ({item}) => {
  const f = useCurrentFrame();
  if (f < item.at) return null;
  const p = interpolate(f - item.at, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const pin = interpolate(f - item.at, [7, 10], [0, 1], {...clamp, easing: Easing.out(Easing.back(3))});
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: item.x,
          top: item.y,
          width: item.w,
          padding: '16px 16px 64px',
          background: '#fbfaf5',
          boxShadow: `0 ${8 + (1 - p) * 40}px ${18 + (1 - p) * 50}px rgba(0,0,0,${0.28 + (1 - p) * 0.1})`,
          transform: `translateY(${(1 - p) * -150}px) scale(${1 + (1 - p) * 0.14}) rotate(${item.rot + (1 - p) * 6}deg)`,
          opacity: Math.min(1, p * 2.5),
        }}
      >
        <div style={{width: '100%', height: item.h, overflow: 'hidden', background: '#222'}}>
          <MediaEl src={item.src} />
        </div>
        {item.label && <div style={{position: 'absolute', left: 18, bottom: 16, fontFamily: M.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: M.ink}}>{item.label}</div>}
      </div>
      <Pin x={item.x + item.w / 2} y={item.y + 6} s={pin} />
    </>
  );
};

const StringLine: React.FC<{item: Extract<Item, {k: 'string'}>}> = ({item}) => {
  const f = useCurrentFrame();
  if (f < item.at) return null;
  const p = interpolate(f - item.at, [0, 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  let d = `M ${item.pts[0][0]} ${item.pts[0][1]}`;
  let len = 0;
  for (let i = 1; i < item.pts.length; i++) {
    const [x0, y0] = item.pts[i - 1];
    const [x1, y1] = item.pts[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2 + 26;
    d += ` Q ${mx} ${my} ${x1} ${y1}`;
    len += Math.hypot(x1 - x0, y1 - y0) * 1.05;
  }
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      <path d={d} fill="none" stroke="#B0141B" strokeWidth={4} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} style={{filter: 'drop-shadow(1px 3px 2px rgba(0,0,0,0.3))'}} />
    </svg>
  );
};

const Quote: React.FC<{item: Extract<Item, {k: 'quote'}>; words: string[]; ats: number[]}> = ({item, words, ats}) => {
  const f = useCurrentFrame();
  const start = item.enterAt ?? ats[0] - 8;
  if (f < start) return null;
  const p = interpolate(f - start, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const pin = interpolate(f - start, [7, 10], [0, 1], {...clamp, easing: Easing.out(Easing.back(3))});
  const size = item.size ?? 44;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: item.x,
          top: item.y,
          width: item.w,
          padding: '56px 52px 40px',
          background: '#FFFDF5',
          boxShadow: '0 14px 34px rgba(0,0,0,0.22)',
          transform: `translateY(${(1 - p) * -120}px) rotate(${item.rot}deg)`,
          opacity: Math.min(1, p * 2.5),
          backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 61px, rgba(28,48,84,0.12) 62px)',
        }}
      >
        <div style={{position: 'absolute', left: 30, top: -10, fontFamily: M.slam, fontWeight: 800, fontSize: 150, color: M.red, lineHeight: 1}}>“</div>
        <div style={{fontFamily: M.mono, fontWeight: 500, fontSize: size, lineHeight: 1.42, color: M.ink}}>
          …
          {words.map((w, k) => (
            <span key={k} style={{opacity: f >= ats[k] ? 1 : 0.12}}>
              {w}{' '}
            </span>
          ))}
        </div>
        <div style={{marginTop: 26, fontFamily: M.mono, fontWeight: 700, fontSize: 21, letterSpacing: 2, color: M.red}}>{item.source}</div>
      </div>
      <Pin x={item.x + item.w / 2} y={item.y + 8} s={pin} />
    </>
  );
};

const Invoice: React.FC<{item: Extract<Item, {k: 'invoice'}>}> = ({item}) => {
  const f = useCurrentFrame();
  if (f < item.at) return null;
  const p = interpolate(f - item.at, [0, 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: item.x, top: item.y, width: item.w, transform: `translateY(${(1 - p) * 260}px) rotate(-1.5deg)`, filter: 'drop-shadow(0 16px 26px rgba(0,0,0,0.25))'}}>
      <div style={{background: '#FFFEFA', padding: '40px 44px 30px'}}>
        <div style={{fontFamily: M.mono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: M.ink, textAlign: 'center'}}>{item.title}</div>
        <div style={{borderTop: '3px dashed rgba(22,24,29,0.35)', margin: '22px 0 12px'}} />
        {item.rows.map((r) => (
          <div key={r.label} style={{display: 'flex', justifyContent: 'space-between', fontFamily: M.mono, fontWeight: r.red ? 700 : 500, fontSize: 30, lineHeight: 2, color: r.red ? M.red : M.ink, opacity: f >= r.at ? 1 : 0}}>
            <span>{r.label}</span>
            <span>{r.value}</span>
          </div>
        ))}
      </div>
      <svg width={item.w} height={22} style={{display: 'block'}}>
        <path d={`M0 0 ${Array.from({length: Math.ceil(item.w / 22)}, (_, i) => `L${i * 22 + 11} 18 L${i * 22 + 22} 0`).join(' ')} Z`} fill="#FFFEFA" />
      </svg>
    </div>
  );
};

const Ring: React.FC<{item: Extract<Item, {k: 'ring'}>}> = ({item}) => {
  const f = useCurrentFrame();
  if (f < item.at) return null;
  const p = interpolate(f - item.at, [0, 9], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const len = 2 * Math.PI * Math.sqrt((item.rx ** 2 + item.ry ** 2) / 2) * 1.15;
  const d = `M ${item.cx - item.rx} ${item.cy} a ${item.rx} ${item.ry} -8 1 1 ${item.rx * 2} 6 a ${item.rx} ${item.ry} -8 1 1 ${-item.rx * 2.05} -14`;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={d} fill="none" stroke={M.red} strokeWidth={9} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
    </svg>
  );
};

const Dots: React.FC<{item: Extract<Item, {k: 'dots'}>}> = ({item}) => {
  const f = useCurrentFrame();
  if (f < item.at) return null;
  const gap = item.dot * 0.5;
  const rows = Math.ceil(item.n / item.cols);
  const width = item.cols * item.dot + (item.cols - 1) * gap;
  const shown = Math.floor(interpolate(f - item.at, [0, 12], [0, item.n], clamp));
  return (
    <div style={{position: 'absolute', top: item.y, left: (1080 - width) / 2, width, display: 'grid', gridTemplateColumns: `repeat(${item.cols}, ${item.dot}px)`, gap}}>
      {Array.from({length: item.n}, (_, i) => (
        <div key={i} style={{width: item.dot, height: item.dot, borderRadius: item.dot / 2, background: i < (item.lit ?? 1) ? item.color : 'transparent', border: `${Math.max(2, item.dot * 0.12)}px solid ${i < (item.lit ?? 1) ? item.color : item.dim}`, opacity: i < shown || i === 0 ? 1 : 0, transform: i === 0 && (item.lit ?? 1) === 1 ? `scale(${1 + 0.15 * Math.abs(Math.sin(f / 6))})` : undefined}} />
      ))}
      {rows > 0 ? null : null}
    </div>
  );
};

const Tiles: React.FC<{item: Extract<Item, {k: 'tiles'}>}> = ({item}) => {
  const f = useCurrentFrame();
  const size = item.size ?? 170;
  return (
    <div style={{position: 'absolute', top: item.y, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18}}>
      {item.tiles.map((t, i) => {
        const at = item.at + i * (item.stagger ?? 4);
        const flip = interpolate(f - at, [0, 4], [90, 0], clamp);
        const sep = t === '→' || t === ':';
        return sep ? (
          <div key={i} style={{fontFamily: M.slam, fontWeight: 800, fontSize: size * 0.7, color: M.gold, alignSelf: 'center', opacity: f >= at ? 1 : 0}}>
            {t}
          </div>
        ) : (
          <div key={i} style={{position: 'relative', padding: `0 ${size * 0.14}px`, minWidth: size * 0.75, height: size * 1.12, borderRadius: 16, background: 'linear-gradient(180deg, #2a3e66 0%, #22355a 49%, #16233e 51%, #1c2d4f 100%)', boxShadow: '0 12px 30px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `perspective(600px) rotateX(${flip}deg)`, opacity: f >= at ? 1 : 0}}>
            <div style={{fontFamily: M.slam, fontWeight: 800, fontSize: size, color: M.ivory, lineHeight: 1}}>{t}</div>
            <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 3, background: 'rgba(0,0,0,0.5)'}} />
          </div>
        );
      })}
    </div>
  );
};

const Counter: React.FC<{item: Extract<Item, {k: 'counter'}>}> = ({item}) => {
  const f = useCurrentFrame();
  if (f < item.at) return null;
  const v = Math.round(interpolate(f - item.at, [0, item.dur], [item.from, item.to], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <div style={{position: 'absolute', top: item.y, left: 0, right: 0, textAlign: 'center', fontFamily: M.slam, fontWeight: 800, fontSize: item.size, color: item.color, lineHeight: 0.95, letterSpacing: -2}}>
      {item.prefix}
      {v.toLocaleString('en-US')}
      {item.suffix}
    </div>
  );
};

const Stamp: React.FC<{item: Extract<Item, {k: 'stamp'}>; dark: boolean}> = ({item, dark}) => {
  const f = useCurrentFrame();
  if (f < item.at) return null;
  const s = interpolate(f - item.at, [0, 4], [1.8, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: item.x, top: item.y, transform: `scale(${s}) rotate(${item.rot}deg)`, border: `7px solid ${item.color}`, borderRadius: 12, padding: '6px 26px 0', fontFamily: M.slam, fontWeight: 800, fontSize: item.size, color: item.color, opacity: 0.92, letterSpacing: 1, mixBlendMode: dark ? 'normal' : 'multiply', background: dark ? 'rgba(11,12,16,0.55)' : undefined}}>
      {item.text}
    </div>
  );
};

const PhotoCard: React.FC<{item: Extract<Item, {k: 'photo'}>}> = ({item}) => {
  const f = useCurrentFrame();
  if (f < item.at) return null;
  return (
    <div style={{position: 'absolute', left: item.x, top: item.y, width: item.w, height: item.h, overflow: 'hidden', transform: `rotate(${item.rot ?? 0}deg) scale(${settle(f, item.at)})`, border: item.border === false ? undefined : '10px solid #fff', boxShadow: '0 16px 36px rgba(0,0,0,0.35)'}}>
      {item.video ? (
        <Sequence from={item.at}>
          <MediaEl src={item.src} bw={item.bw} />
        </Sequence>
      ) : (
        <MediaEl src={item.src} bw={item.bw} />
      )}
    </div>
  );
};

const Vhs: React.FC<{left: string; right: string}> = ({left, right}) => {
  const f = useCurrentFrame();
  const st: React.CSSProperties = {fontFamily: M.mono, fontWeight: 700, fontSize: 30, color: '#fff', letterSpacing: 3, textShadow: '0 0 10px rgba(255,255,255,0.6), 2px 0 0 rgba(255,0,60,0.6), -2px 0 0 rgba(0,180,255,0.6)'};
  return (
    <div style={{position: 'absolute', top: 410, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', opacity: f % 40 < 37 ? 1 : 0.6}}>
      <div style={st}>{left}</div>
      <div style={st}>{right}</div>
    </div>
  );
};

const SourceTag: React.FC<{text: string; dark: boolean; at: number}> = ({text, dark, at}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top: 1418, left: 70, right: 150, fontFamily: M.mono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: dark ? 'rgba(255,253,247,0.75)' : 'rgba(22,24,29,0.65)', opacity: f >= at ? 1 : 0}}>
      SOURCE · {text}
    </div>
  );
};

const Clipping: React.FC<{item: Extract<Item, {k: 'clipping'}>}> = ({item}) => {
  const f = useCurrentFrame();
  if (f < item.at) return null;
  const p = interpolate(f - item.at, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const pin = interpolate(f - item.at, [7, 10], [0, 1], {...clamp, easing: Easing.out(Easing.back(3))});
  const hi = interpolate(f - item.hiAt, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <>
      <div style={{position: 'absolute', left: item.x, top: item.y, width: item.w, padding: '44px 48px 40px', background: '#FBF8F0', boxShadow: '0 16px 36px rgba(0,0,0,0.24)', transform: `translateY(${(1 - p) * -140}px) rotate(${item.rot}deg)`, opacity: Math.min(1, p * 2.5)}}>
        <div style={{fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 64, letterSpacing: 6, color: M.ink, borderBottom: `3px solid ${M.ink}`, paddingBottom: 10}}>{item.masthead}</div>
        <div style={{fontFamily: M.mono, fontWeight: 500, fontSize: 19, letterSpacing: 2, color: 'rgba(22,24,29,0.65)', marginTop: 12}}>{item.meta}</div>
        <div style={{fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 54, lineHeight: 1.15, color: M.ink, marginTop: 22}}>{item.title}</div>
        <div style={{fontFamily: M.mono, fontWeight: 500, fontSize: 19, letterSpacing: 1.5, color: 'rgba(22,24,29,0.65)', marginTop: 14}}>{item.byline}</div>
        <div style={{fontFamily: 'Georgia, serif', fontSize: 46, lineHeight: 1.4, color: M.ink, marginTop: 30, position: 'relative'}}>
          <span style={{backgroundImage: `linear-gradient(transparent 55%, rgba(240,217,147,0.95) 55%)`, backgroundSize: `${hi * 100}% 100%`, backgroundRepeat: 'no-repeat', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>“{item.excerpt}”</span>
        </div>
      </div>
      <Pin x={item.x + item.w / 2} y={item.y + 8} s={pin} />
    </>
  );
};

// ── scene renderer ────────────────────────────────────────────────────
const SceneView: React.FC<{s: SceneDef; to: number; words: string[]; w: (i: number) => number}> = ({s, to, words, w}) => {
  const f = useCurrentFrame();
  if (f < s.from || f >= to) return null;
  const local = f - s.from;
  const dark = isDark(s.canvas);
  return (
    <AbsoluteFill>
      {s.canvas === 'paper' && <Paper />}
      {s.canvas === 'navy' && (
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 70% 25%, #2a4472 0%, ${M.navy} 55%, #121f38 100%)`}}>
          <Halftone color={M.gold} />
        </AbsoluteFill>
      )}
      {s.canvas === 'black' && (
        <AbsoluteFill style={{background: M.black}}>
          <Stars />
        </AbsoluteFill>
      )}
      {s.canvas === 'screen' && s.media && (
        <Sequence from={s.from}>
          <Screen m={s.media} local={local} />
        </Sequence>
      )}
      {s.items.map((it, i) => {
        switch (it.k) {
          case 'spread': {
            const idx = Array.from({length: it.to - it.from + 1}, (_, k) => it.from + k);
            return <Spread key={i} words={idx.map((k) => words[k])} ats={idx.map(w)} y={it.y} color={it.color ?? (dark ? M.ivory : M.ink)} size={it.size ?? 44} shadow={dark} />;
          }
          case 'slam':
            return <Slam key={i} item={it} dark={dark} />;
          case 'polaroid':
            return <Polaroid key={i} item={it} />;
          case 'string':
            return <StringLine key={i} item={it} />;
          case 'quote': {
            const idx = Array.from({length: it.to - it.from + 1}, (_, k) => it.from + k);
            return <Quote key={i} item={it} words={idx.map((k) => words[k])} ats={idx.map(w)} />;
          }
          case 'source':
            return <SourceTag key={i} text={it.text} dark={it.dark ?? dark} at={it.at} />;
          case 'counter':
            return <Counter key={i} item={it} />;
          case 'dots':
            return <Dots key={i} item={it} />;
          case 'tiles':
            return <Tiles key={i} item={it} />;
          case 'ring':
            return <Ring key={i} item={it} />;
          case 'stamp':
            return <Stamp key={i} item={it} dark={dark} />;
          case 'invoice':
            return <Invoice key={i} item={it} />;
          case 'photo':
            return <PhotoCard key={i} item={it} />;
          case 'clipping':
            return <Clipping key={i} item={it} />;
          case 'vhs':
            return <Vhs key={i} left={it.left} right={it.right} />;
          case 'label':
            return (
              <div key={i} style={{position: 'absolute', top: it.y, left: it.align === 'right' ? undefined : it.x, right: it.align === 'right' ? 1080 - it.x : undefined, width: it.align === 'center' ? 1080 - 2 * it.x : undefined, textAlign: it.align ?? 'left', fontFamily: M.mono, fontWeight: 700, fontSize: it.size ?? 24, letterSpacing: 3, color: it.color, opacity: f >= it.at ? 1 : 0, textShadow: dark ? '0 2px 6px rgba(0,0,0,0.95), 0 0 18px rgba(0,0,0,0.8)' : undefined}}>
                {it.text}
              </div>
            );
          default:
            return null;
        }
      })}
      {s.canvas !== 'paper' && <LightLeak strength={s.canvas === 'screen' ? 0.8 : 1} />}
      {s.flash && <AbsoluteFill style={{background: '#fff', opacity: interpolate(local, [0, 3], [0.9, 0], clamp)}} />}
      {s.power && (
        <AbsoluteFill style={{background: '#000', clipPath: `inset(${interpolate(local, [0, 5], [49.6, 0], clamp)}% 0 ${interpolate(local, [0, 5], [49.6, 0], clamp)}% 0)`, opacity: interpolate(local, [5, 8], [0, 0], clamp)}} />
      )}
      {s.power && local < 6 && <AbsoluteFill style={{background: '#000', clipPath: `polygon(0 0, 100% 0, 100% ${50 - local * 10}%, 0 ${50 - local * 10}%, 0 ${50 + local * 10}%, 100% ${50 + local * 10}%, 100% 100%, 0 100%)`}} />}
      {s.power && local < 4 && <AbsoluteFill style={{background: `rgba(255,255,255,${0.8 - local * 0.2})`}} />}
    </AbsoluteFill>
  );
};

// ── persistent chrome ─────────────────────────────────────────────────
const Chrome: React.FC<{rail: MetroVideo['rail']; railFrom: number; railTo: number}> = ({rail, railFrom, railTo}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [railFrom, railTo], [0, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: 54, top: 232, width: 96, height: 96, borderRadius: 22, background: 'rgba(255,253,247,0.95)', padding: 10, boxShadow: '0 6px 20px rgba(0,0,0,0.25)'}}>
        <Img src={staticFile('img/esu_logo.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      </div>
      <Img src={staticFile('img/sponsor_badge.png')} style={{position: 'absolute', right: 54, top: 246, width: 252, height: 73, borderRadius: 14, boxShadow: '0 6px 20px rgba(0,0,0,0.25)'}} />
      <div style={{position: 'absolute', top: 352, left: 54, right: 54, display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{fontFamily: M.mono, fontWeight: 700, fontSize: 19, letterSpacing: 2, color: '#fff', mixBlendMode: 'difference'}}>{rail.left}</div>
        <div style={{flex: 1, height: 6, borderRadius: 3, background: 'rgba(128,128,128,0.45)', position: 'relative'}}>
          <div style={{width: `${p * 100}%`, height: '100%', borderRadius: 3, background: M.red}} />
          <div style={{position: 'absolute', left: `calc(${p * 100}% - 9px)`, top: -6, width: 18, height: 18, borderRadius: 9, background: '#fff', boxShadow: '0 0 0 4px rgba(237,28,36,0.6)'}} />
        </div>
        <div style={{fontFamily: M.mono, fontWeight: 700, fontSize: 19, letterSpacing: 2, color: '#fff', mixBlendMode: 'difference'}}>{rail.right}</div>
      </div>
    </>
  );
};

const End: React.FC<{e: EndPanel}> = ({e}) => {
  const f = useCurrentFrame();
  if (f < e.from) return null;
  const l = f - e.from;
  const head = interpolate(l, [0, 3], [1.06, 1], clamp);
  const info = l >= 8 ? 1 : 0;
  const cta = l >= 14 ? 1 : 0;
  const pulse = 1 + 0.03 * Math.max(0, Math.sin((l - 14) / 5));
  return (
    <AbsoluteFill style={{background: M.navy}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1080, overflow: 'hidden'}}>
        <div style={{width: '100%', height: '100%', transform: `scale(${interpolate(l, [0, 120], [1.08, 1.0], clamp)})`}}>
          <MediaEl src={e.photo} />
        </div>
        <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(28,48,84,0.15) 0%, rgba(28,48,84,0) 45%, ${M.navy} 100%)`}} />
      </div>
      <Halftone color={M.gold} />
      <div style={{position: 'absolute', top: 905, left: 60, right: 60, textAlign: 'center', transform: `scale(${head})`}}>
        <div style={{fontFamily: M.slam, fontWeight: 800, fontSize: 132, lineHeight: 0.92, color: M.ivory, textTransform: 'uppercase', letterSpacing: -1, textShadow: '0 6px 30px rgba(0,0,0,0.4)'}}>{e.lines[0]}</div>
        <div style={{fontFamily: M.slam, fontWeight: 800, fontSize: 132, lineHeight: 0.92, color: M.red, textTransform: 'uppercase', letterSpacing: -1}}>{e.lines[1]}</div>
      </div>
      <div style={{position: 'absolute', top: 1180, left: 70, right: 70, background: M.ivory, borderRadius: 8, display: 'flex', opacity: info, boxShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>
        {e.info.map(([a, b], i) => (
          <div key={i} style={{flex: 1, padding: '20px 24px', borderLeft: i ? '2px solid rgba(28,48,84,0.15)' : undefined}}>
            <div style={{fontFamily: M.mono, fontWeight: 700, fontSize: 21, letterSpacing: 1.5, color: M.navy}}>{a}</div>
            <div style={{fontFamily: M.mono, fontWeight: 700, fontSize: 21, letterSpacing: 1.5, color: M.red, marginTop: 8}}>{b}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 1330, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: cta}}>
        <div style={{background: M.red, borderRadius: 10, padding: '20px 46px', fontFamily: M.small, fontWeight: 800, fontSize: 36, color: '#fff', letterSpacing: 1, transform: `scale(${pulse})`, boxShadow: '0 12px 30px rgba(237,28,36,0.4)'}}>{e.cta}</div>
      </div>
      <div style={{position: 'absolute', top: 1438, left: 0, right: 0, textAlign: 'center', fontFamily: M.mono, fontWeight: 500, fontSize: 24, letterSpacing: 2, color: 'rgba(255,253,247,0.8)', opacity: cta}}>eurosoccerusa.com</div>
      <LightLeak strength={0.7} />
    </AbsoluteFill>
  );
};

const BASE_SFX: Record<string, number> = {shutter: 0.55, paper: 0.45, pin: 0.5, crt_on: 0.7, tape_start: 0.45, stab: 0.5, type: 0.35};

export const MetroReel: React.FC<{v: MetroVideo; duration: number}> = ({v, duration}) => {
  useFonts();
  const {w, voEnd} = timing(v.narration);
  const words = v.narration.words.map((x) => v.display?.[x.w] ?? x.w);
  const scenes = v.scenes;
  const sfx: [number, string, number][] = [[0, 'crt_on', 0.75], [1, 'tape_start', 0.4], [3, 'stab', 0.45]];
  scenes.forEach((s, i) => {
    if (i > 0) sfx.push([s.from, s.sfx ?? (s.canvas === 'paper' ? 'paper' : 'shutter'), BASE_SFX[s.sfx ?? 'shutter'] ?? 0.5]);
    s.items.forEach((it) => {
      if (it.k === 'slam') (it.lineAt ?? [it.at]).forEach((a) => sfx.push([a, 'type', 0.4]));
      if (it.k === 'polaroid') sfx.push([it.at + 7, 'pin', 0.45]);
      if (it.k === 'stamp' || it.k === 'counter') sfx.push([it.at, 'shutter', 0.4]);
    });
  });
  sfx.push([v.end.from, 'shutter', 0.5]);
  (v.extraSfx ?? []).forEach((x) => sfx.push(x));
  return (
    <AbsoluteFill style={{background: M.black}}>
      {scenes.map((s, i) => (
        <SceneView key={i} s={s} to={i + 1 < scenes.length ? scenes[i + 1].from : v.end.from} words={words} w={w} />
      ))}
      <End e={v.end} />
      <Vignette strength={0.35} />
      <Grain />
      <Chrome rail={v.rail} railFrom={scenes[0].from} railTo={v.end.from} />
      <Sequence from={VO_START}>
        <Audio src={staticFile(`audio/metro/vo_${v.vo}.mp3`)} />
      </Sequence>
      <Audio
        src={staticFile('audio/metro/bed.mp3')}
        volume={(f) => interpolate(f, [0, 12, duration - 30, duration], [0, 0.17, 0.17, 0], clamp) * (f >= voEnd ? 1.4 : 1)}
      />
      {sfx.map(([at, name, vol], i) => (
        <Sequence key={`${i}-${at}-${name}`} from={at}>
          <Audio src={staticFile(`audio/metro/${name}.mp3`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
