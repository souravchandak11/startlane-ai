/**
 * Illustrated world for the Mommy, Daddy & Me video: pastel skies, grass, playground,
 * toddler goal, confetti, calendar, gauges and transitions. All SVG/CSS, frame-driven.
 */
import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {backOut, C, clamp, easeOut} from './theme';

export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}>
    {children}
  </svg>
);

/** soft paper background with drifting pastel blobs + polka dots */
export const PastelBg: React.FC<{base?: string; blobs?: string[]; dots?: string; seed?: number}> = ({
  base = C.cream,
  blobs = [C.butter, C.pink, C.sky],
  dots = 'rgba(30,23,72,0.05)',
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: base, overflow: 'hidden'}}>
      {blobs.map((c, i) => {
        const x = 150 + random(`bx${seed}${i}`) * 780 + Math.sin(frame / 50 + i * 2) * 40;
        const y = 250 + random(`by${seed}${i}`) * 1400 + Math.cos(frame / 60 + i) * 50;
        const r = 260 + random(`br${seed}${i}`) * 200;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: c,
              opacity: 0.55,
              filter: 'blur(70px)',
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${dots} 4px, transparent 4.5px)`,
          backgroundSize: '54px 54px',
          backgroundPosition: `${(frame * 0.4) % 54}px ${(frame * 0.6) % 54}px`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SkyBg: React.FC<{top?: string; bottom?: string}> = ({top = '#7CCBFF', bottom = '#E9F7FF'}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${bottom} 72%)`}} />
);

export const Sun: React.FC<{x: number; y: number; r?: number; color?: string; face?: boolean}> = ({x, y, r = 110, color = C.sun, face = true}) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`rotate(${frame * 0.6})`}>
        {new Array(12).fill(0).map((_, i) => (
          <rect key={i} x={-10} y={-r - 62} width={20} height={44} rx={10} fill={color} opacity={0.85} transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle r={r} fill={color} />
      <circle r={r * 0.8} fill="#FFD45C" />
      {face && (
        <g>
          <circle cx={-r * 0.3} cy={-r * 0.08} r={8} fill={C.ink} />
          <circle cx={r * 0.3} cy={-r * 0.08} r={8} fill={C.ink} />
          <path d={`M${-r * 0.28} ${r * 0.2} Q0 ${r * 0.45} ${r * 0.28} ${r * 0.2}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
          <circle cx={-r * 0.5} cy={r * 0.18} r={14} fill={C.coral} opacity={0.5} />
          <circle cx={r * 0.5} cy={r * 0.18} r={14} fill={C.coral} opacity={0.5} />
        </g>
      )}
    </g>
  );
};

export const Cloud: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 1, color = '#fff'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.95}>
    <ellipse cx={0} cy={20} rx={120} ry={46} fill={color} />
    <circle cx={-50} cy={0} r={50} fill={color} />
    <circle cx={20} cy={-20} r={66} fill={color} />
    <circle cx={80} cy={10} r={44} fill={color} />
  </g>
);

/** rolling grass hill with tufts; y = top of the grass at centre */
export const Grass: React.FC<{y: number; color?: string; dark?: string; flowers?: boolean}> = ({y, color = C.grass, dark = C.grassDeep, flowers = true}) => (
  <g>
    <path d={`M-100 ${y + 40} Q270 ${y - 50} 540 ${y} Q810 ${y + 50} 1180 ${y - 20} L1180 2100 L-100 2100 Z`} fill={color} />
    <path d={`M-100 ${y + 120} Q300 ${y + 60} 600 ${y + 110} Q900 ${y + 160} 1180 ${y + 90} L1180 2100 L-100 2100 Z`} fill={dark} opacity={0.45} />
    {new Array(14).fill(0).map((_, i) => {
      const gx = 40 + i * 78 + random(`gt${i}`) * 30;
      const gy = y + 30 + random(`gy${i}`) * 220;
      return <path key={i} d={`M${gx} ${gy} l8 -22 l6 22 l8 -18 l4 18`} stroke={dark} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    })}
    {flowers &&
      new Array(7).fill(0).map((_, i) => {
        const fx = 80 + i * 150 + random(`fx${i}`) * 50;
        const fy = y + 70 + random(`fy${i}`) * 260;
        const col = [C.pink, '#fff', C.sun, C.lilac][i % 4];
        return (
          <g key={`f${i}`} transform={`translate(${fx} ${fy})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 9} cy={Math.sin((a * Math.PI) / 180) * 9} r={8} fill={col} />
            ))}
            <circle r={6} fill={C.sun} />
          </g>
        );
      })}
  </g>
);

/** soccer ball as an SVG <g> (centre origin) */
export const BallG: React.FC<{x: number; y: number; r: number; rot?: number; squash?: number; shadowY?: number}> = ({x, y, r, rot = 0, squash = 1, shadowY}) => (
  <g>
    {shadowY !== undefined && <ellipse cx={x} cy={shadowY} rx={r * 0.9} ry={r * 0.18} fill="rgba(30,23,72,0.18)" />}
    <g transform={`translate(${x} ${y}) scale(${1 / Math.sqrt(squash)} ${squash}) scale(${r / 48})`}>
      <circle r={48} fill="#fff" stroke={C.ink} strokeWidth={3.5} />
      <g transform={`rotate(${rot})`} fill={C.ink}>
        <path d="M0 -16 L15 -5 L9 13 L-9 13 L-15 -5 Z" />
        <path d="M0 -48 L-9 -40 L-5 -30 L5 -30 L9 -40 Z" />
        <path d="M44 -14 L34 -18 L27 -8 L32 3 L44 4 Z" />
        <path d="M-44 -14 L-34 -18 L-27 -8 L-32 3 L-44 4 Z" />
        <path d="M26 38 L28 26 L17 22 L10 32 L16 42 Z" />
        <path d="M-26 38 L-28 26 L-17 22 L-10 32 L-16 42 Z" />
        <g stroke={C.ink} strokeWidth={2.4} fill="none">
          <path d="M0 -16 L0 -30 M15 -5 L27 -8 M9 13 L17 22 M-9 13 L-17 22 M-15 -5 L-27 -8" />
        </g>
      </g>
      <ellipse cx={-16} cy={-20} rx={14} ry={9} fill="#fff" opacity={0.7} transform="rotate(-30 -16 -20)" />
    </g>
  </g>
);

/** small toddler goal (front view). bulge 0..1 pushes the net back */
export const Goal: React.FC<{x: number; y: number; w?: number; h?: number; bulge?: number; dull?: boolean}> = ({x, y, w = 360, h = 230, bulge = 0, dull = false}) => {
  const post = dull ? '#E7E8EC' : '#fff';
  const netC = dull ? 'rgba(90,95,110,0.35)' : 'rgba(30,23,72,0.28)';
  const lines = [];
  const bx = bulge * 26;
  for (let i = 0; i <= 10; i++) {
    const lx = -w / 2 + (w * i) / 10;
    lines.push(<path key={`v${i}`} d={`M${lx} ${-h} Q${lx * 0.9} ${-h / 2 + bx} ${lx} 0`} stroke={netC} strokeWidth={3} fill="none" />);
  }
  for (let j = 0; j <= 6; j++) {
    const ly = -h + (h * j) / 6;
    lines.push(<path key={`h${j}`} d={`M${-w / 2} ${ly} Q0 ${ly + bx * 1.4} ${w / 2} ${ly}`} stroke={netC} strokeWidth={3} fill="none" />);
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={6} rx={w * 0.6} ry={18} fill="rgba(30,23,72,0.12)" />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={dull ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.45)'} />
      {lines}
      <path d={`M${-w / 2} 0 L${-w / 2} ${-h} L${w / 2} ${-h} L${w / 2} 0`} stroke={post} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${-w / 2} 0 L${-w / 2} ${-h} L${w / 2} ${-h} L${w / 2} 0`} stroke={dull ? '#C9CBD3' : C.red} strokeWidth={5} fill="none" strokeDasharray="22 22" strokeLinecap="round" />
    </g>
  );
};

/** confetti shower from the top (or a burst at x,y when `burst`) */
export const Confetti: React.FC<{at: number; count?: number; burst?: {x: number; y: number}; dur?: number; colors?: string[]}> = ({
  at,
  count = 90,
  burst,
  dur = 70,
  colors = [C.red, C.sun, C.skyDeep, C.pink, C.grass, C.lilac, C.orange],
}) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < 0 || d > dur) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const r1 = random(`c1${at}${i}`);
        const r2 = random(`c2${at}${i}`);
        const r3 = random(`c3${at}${i}`);
        let x: number;
        let y: number;
        if (burst) {
          const ang = -Math.PI / 2 + (r1 - 0.5) * Math.PI * 1.5;
          const v = 26 + r2 * 34;
          const t = d;
          x = burst.x + Math.cos(ang) * v * t * 0.9 * Math.exp(-t / 40) * 1.6;
          y = burst.y + Math.sin(ang) * v * t * Math.exp(-t / 30) * 1.2 + 0.45 * t * t;
        } else {
          x = r1 * 1080 + Math.sin(d / 8 + i) * 30;
          y = -60 + (d + r2 * 30) * (10 + r3 * 8);
        }
        const w = 14 + r3 * 14;
        const shape = i % 3;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: shape === 0 ? w : w * 0.45,
              borderRadius: shape === 0 ? '50%' : 4,
              background: colors[i % colors.length],
              transform: `rotate(${d * (8 + r1 * 14) + i * 40}deg) scaleX(${Math.cos(d / 4 + i)})`,
              opacity: interpolate(d, [dur - 15, dur], [1, 0], clamp),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** 4-point twinkle sparkles around a point */
export const Sparkles: React.FC<{at: number; x: number; y: number; spread?: number; count?: number; color?: string; dur?: number}> = ({
  at,
  x,
  y,
  spread = 260,
  count = 7,
  color = C.sun,
  dur = 30,
}) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < 0 || d > dur) return null;
  return (
    <g>
      {new Array(count).fill(0).map((_, i) => {
        const delay = random(`sd${at}${i}`) * 10;
        const k = (d - delay) / (dur - 10);
        if (k < 0 || k > 1) return null;
        const s = Math.sin(k * Math.PI) * (18 + random(`ss${at}${i}`) * 26);
        const px = x + (random(`sx${at}${i}`) - 0.5) * spread * 2;
        const py = y + (random(`sy${at}${i}`) - 0.5) * spread * 1.4;
        return (
          <path
            key={i}
            d={`M${px} ${py - s} Q${px} ${py} ${px + s} ${py} Q${px} ${py} ${px} ${py + s} Q${px} ${py} ${px - s} ${py} Q${px} ${py} ${px} ${py - s} Z`}
            fill={i % 2 ? color : '#fff'}
          />
        );
      })}
    </g>
  );
};

export const Heart: React.FC<{x: number; y: number; s?: number; color?: string; rot?: number}> = ({x, y, s = 1, color = C.red, rot = 0}) => (
  <path
    transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
    d="M0 30 C-40 0 -52 -26 -30 -42 C-14 -54 0 -42 0 -30 C0 -42 14 -54 30 -42 C52 -26 40 0 0 30 Z"
    fill={color}
  />
);

export const Star: React.FC<{x: number; y: number; r?: number; color?: string; rot?: number; stroke?: string}> = ({x, y, r = 40, color = C.sun, rot = 0, stroke}) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.46 : r;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${Math.cos(a) * rr},${Math.sin(a) * rr}`);
  }
  return (
    <polygon
      points={pts.join(' ')}
      transform={`translate(${x} ${y}) rotate(${rot})`}
      fill={color}
      stroke={stroke}
      strokeWidth={stroke ? 6 : 0}
      strokeLinejoin="round"
    />
  );
};

/** playground pieces (muted when dull) */
export const Slide: React.FC<{x: number; y: number; s?: number; dull?: boolean}> = ({x, y, s = 1, dull}) => {
  const a = dull ? '#A8AEBB' : C.red;
  const b = dull ? '#8C93A1' : C.sun;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-120} y={-420} width={16} height={420} fill={b} />
      <rect x={-40} y={-420} width={16} height={420} fill={b} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={-120} y={-380 + i * 64} width={96} height={12} rx={6} fill={b} />
      ))}
      <rect x={-130} y={-440} width={120} height={26} rx={10} fill={a} />
      <path d="M-24 -430 Q60 -330 120 -120 Q150 -20 260 -10 L260 20 Q120 20 90 -100 Q40 -300 -24 -380 Z" fill={a} />
    </g>
  );
};

export const SwingSet: React.FC<{x: number; y: number; s?: number; angle?: number; dull?: boolean; children?: React.ReactNode}> = ({
  x,
  y,
  s = 1,
  angle = 0,
  dull,
  children,
}) => {
  const frame = b(dull);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-230 0 L-170 -470 L-110 0 M230 0 L170 -470 L110 0" stroke={frame} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={-190} y={-484} width={380} height={26} rx={13} fill={frame} />
      <g transform={`rotate(${angle} 0 -470)`}>
        <path d="M-50 -470 L-50 -120 M50 -470 L50 -120" stroke={dull ? '#7A8090' : '#5A5A6A'} strokeWidth={6} />
        <rect x={-70} y={-128} width={140} height={22} rx={8} fill={dull ? '#9AA0AF' : C.skyDeep} />
        {children}
      </g>
    </g>
  );
};
const b = (dull?: boolean) => (dull ? '#9AA0AF' : C.skyDeep);

export const Bench: React.FC<{x: number; y: number; s?: number; dull?: boolean}> = ({x, y, s = 1, dull}) => {
  const wood = dull ? '#A39B92' : '#D9A066';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-170} y={-200} width={340} height={26} rx={8} fill={wood} />
      <rect x={-170} y={-160} width={340} height={26} rx={8} fill={wood} />
      <rect x={-180} y={-110} width={360} height={30} rx={8} fill={wood} />
      <rect x={-150} y={-90} width={18} height={90} fill={dull ? '#6F7584' : '#5A4A3A'} />
      <rect x={132} y={-90} width={18} height={90} fill={dull ? '#6F7584' : '#5A4A3A'} />
    </g>
  );
};

export const Tree: React.FC<{x: number; y: number; s?: number; dull?: boolean}> = ({x, y, s = 1, dull}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-22} y={-260} width={44} height={260} rx={14} fill={dull ? '#8C8580' : '#A0703E'} />
    <circle cx={0} cy={-330} r={130} fill={dull ? '#9DA79F' : C.grassDeep} />
    <circle cx={-90} cy={-260} r={90} fill={dull ? '#A7B0A9' : C.grass} />
    <circle cx={90} cy={-270} r={95} fill={dull ? '#A7B0A9' : C.grass} />
  </g>
);

/** tear-off calendar block. `flip` (0..n) = how many pages have flipped; label of current page */
export const Calendar: React.FC<{x: number; y: number; s?: number; pages: {top: string; big: string; small?: string; color?: string}[]; flip: number}> = ({
  x,
  y,
  s = 1,
  pages,
  flip,
}) => {
  const idx = Math.min(pages.length - 1, Math.floor(flip));
  const frac = flip - Math.floor(flip);
  const cur = pages[idx];
  const next = pages[Math.min(pages.length - 1, idx + 1)];
  const Page: React.FC<{p: typeof cur}> = ({p}) => (
    <g>
      <rect x={-200} y={-230} width={400} height={460} rx={34} fill="#fff" />
      <path d="M-200 -196 Q-200 -230 -166 -230 L166 -230 Q200 -230 200 -196 L200 -100 L-200 -100 Z" fill={p.color ?? C.red} />
      <text x={0} y={-140} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={p.top.length > 9 ? 46 : 64} fill="#fff" letterSpacing={p.top.length > 9 ? 3 : 6}>
        {p.top}
      </text>
      <text x={0} y={70} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={p.big.length > 3 ? 120 : 190} fill={C.ink}>
        {p.big}
      </text>
      {p.small && (
        <text x={0} y={170} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={44} fill={C.dull3}>
          {p.small}
        </text>
      )}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-196} y={-218} width={400} height={460} rx={34} fill="rgba(30,23,72,0.18)" transform="translate(10 14)" />
      {/* next page underneath */}
      <Page p={frac > 0 ? next : cur} />
      {frac > 0 && (
        <g transform={`translate(0 ${-230}) scale(1 ${Math.cos(frac * Math.PI * 0.5)}) translate(0 ${230})`} opacity={1 - frac * 0.6}>
          <Page p={cur} />
        </g>
      )}
      {/* binder rings */}
      {[-110, 0, 110].map((rx) => (
        <rect key={rx} x={rx - 10} y={-262} width={20} height={58} rx={10} fill={C.dull3} />
      ))}
    </g>
  );
};

/** battery-style energy meter. level 0..>1 (overflow glows) */
export const EnergyMeter: React.FC<{x: number; y: number; level: number; label: string}> = ({x, y, level, label}) => {
  const frame = useCurrentFrame();
  const segs = 8;
  const over = level > 1;
  return (
    <g transform={`translate(${x} ${y})`}>
      <text x={0} y={-70} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={44} fill={C.ink} letterSpacing={4}>
        {label}
      </text>
      <rect x={-300} y={-50} width={580} height={110} rx={28} fill="#fff" stroke={C.ink} strokeWidth={10} />
      <rect x={284} y={-18} width={30} height={46} rx={8} fill={C.ink} />
      {new Array(segs).fill(0).map((_, i) => {
        const on = level * segs > i;
        const col = i < 3 ? C.grass : i < 6 ? C.sun : C.red;
        return <rect key={i} x={-284 + i * 70} y={-34} width={60} height={78} rx={12} fill={on ? col : '#EEE'} opacity={on && over && frame % 4 < 2 ? 0.7 : 1} />;
      })}
      <text x={0} y={150} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={over ? 110 : 90} fill={over ? C.red : C.ink}>
        {Math.round(level * 100)}%
      </text>
    </g>
  );
};

/** semicircle "pressure" gauge, value 0..1 */
export const Gauge: React.FC<{x: number; y: number; value: number; r?: number}> = ({x, y, value, r = 260}) => {
  const arc = (a0: number, a1: number, col: string) => {
    const p = (a: number) => [Math.cos(Math.PI + a * Math.PI) * r, Math.sin(Math.PI + a * Math.PI) * r];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return <path d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`} stroke={col} strokeWidth={56} fill="none" />;
  };
  const ang = Math.PI + value * Math.PI;
  return (
    <g transform={`translate(${x} ${y})`}>
      {arc(0, 0.34, C.grass)}
      {arc(0.34, 0.67, C.sun)}
      {arc(0.67, 1, C.red)}
      <line x1={0} y1={0} x2={Math.cos(ang) * (r - 40)} y2={Math.sin(ang) * (r - 40)} stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
      <circle r={30} fill={C.ink} />
    </g>
  );
};

/** circular iris reveal of children, growing from (x,y) between at → at+dur */
export const Iris: React.FC<{at: number; x: number; y: number; dur?: number; children: React.ReactNode}> = ({at, x, y, dur = 12, children}) => {
  const frame = useCurrentFrame();
  const k = easeOut((frame - at) / dur, 3);
  if (frame < at) return null;
  const r = k * 2300;
  return <AbsoluteFill style={{clipPath: k >= 1 ? undefined : `circle(${r}px at ${x}px ${y}px)`}}>{children}</AbsoluteFill>;
};

/** pop-in scale helper for SVG groups */
export const popScale = (frame: number, at: number, dur = 10, s = 2.2) => (frame < at ? 0 : backOut((frame - at) / dur, s));
