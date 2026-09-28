import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ESU} from '../presets/brand';
import {FONT} from '../presets/fonts';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Top-down pitch with mowing stripes; the white lines draw themselves in. */
export const Pitch: React.FC<{at?: number; dim?: number; tilt?: boolean}> = ({at = 0, dim = 0.35, tilt = true}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame - at, [0, 24], [0, 1], {...clamp, easing: (x) => 1 - (1 - x) ** 3});
  const L = 5200;
  return (
    <AbsoluteFill style={{background: '#12502f', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: tilt ? `perspective(1600px) rotateX(38deg) scale(1.5) translateY(${-80 + (frame - at) * 0.6}px)` : undefined,
          transformOrigin: '50% 30%',
        }}
      >
        <AbsoluteFill
          style={{
            background:
              'repeating-linear-gradient(0deg, #1b7a45 0px, #1b7a45 160px, #176b3c 160px, #176b3c 320px)',
          }}
        />
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
          <g fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="8" strokeDasharray={L} strokeDashoffset={L * (1 - draw)}>
            <rect x="80" y="120" width="920" height="1680" />
            <line x1="80" y1="960" x2="1000" y2="960" />
            <circle cx="540" cy="960" r="170" />
            <rect x="290" y="120" width="500" height="260" />
            <rect x="290" y="1540" width="500" height="260" />
            <rect x="410" y="120" width="260" height="100" />
            <rect x="410" y="1700" width="260" height="100" />
          </g>
          <circle cx="540" cy="960" r="12" fill="white" opacity={draw} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(6,20,43,${dim})`}} />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,230,0.35) 0%, rgba(0,0,0,0) 55%)',
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};

/** Classic black/white ball drawn as SVG (so it can spin cleanly). */
export const Ball: React.FC<{size: number; rotation?: number}> = ({size, rotation = 0}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{filter: 'drop-shadow(0 20px 26px rgba(0,0,0,0.5))'}}>
    <defs>
      <radialGradient id="ballShade" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.7" stopColor="#e8e8e8" />
        <stop offset="1" stopColor="#9a9a9a" />
      </radialGradient>
    </defs>
    <circle r="48" fill="url(#ballShade)" />
    <g transform={`rotate(${rotation})`} fill="#141414">
      <path d="M0 -16 L15 -5 L9 13 L-9 13 L-15 -5 Z" />
      <path d="M0 -48 L-9 -40 L-5 -30 L5 -30 L9 -40 Z" opacity="0.95" />
      <path d="M44 -14 L34 -18 L27 -8 L32 3 L44 4 Z" />
      <path d="M-44 -14 L-34 -18 L-27 -8 L-32 3 L-44 4 Z" />
      <path d="M26 38 L28 26 L17 22 L10 32 L16 42 Z" />
      <path d="M-26 38 L-28 26 L-17 22 L-10 32 L-16 42 Z" />
      <g stroke="#141414" strokeWidth="2.2" fill="none">
        <path d="M0 -16 L0 -30 M15 -5 L27 -8 M9 13 L17 22 M-9 13 L-17 22 M-15 -5 L-27 -8" />
      </g>
    </g>
    <circle r="48" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
  </svg>
);

/** Ball that drops in from above and bounces with real gravity + a brief squash on contact. */
export const BouncingBall: React.FC<{at: number; x: number; floorY: number; size?: number}> = ({
  at,
  x,
  floorY,
  size = 300,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - at;
  if (f < 0) return null;
  const g = 9000; // px/s²
  const drop = 1100; // start this far above the floor
  let t = f / fps;
  let v0 = 0;
  let h0 = drop;
  let y = 0;
  let contact = 99;
  // walk through bounces (restitution 0.45)
  for (let i = 0; i < 6; i++) {
    const tFall = (v0 + Math.sqrt(v0 * v0 + 2 * g * h0)) / g;
    if (t <= tFall) {
      y = h0 + v0 * t - 0.5 * g * t * t;
      contact = Math.min(contact, tFall - t);
      break;
    }
    t -= tFall;
    contact = t;
    v0 = Math.sqrt(2 * g * h0 + v0 * v0) * 0.45;
    h0 = 0;
    y = 0;
  }
  const squash = contact < 0.05 ? 1 + 0.18 * (1 - contact / 0.05) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: floorY - size - Math.max(0, y),
        transform: `scaleY(${1 / squash}) scaleX(${squash})`,
        transformOrigin: '50% 100%',
      }}
    >
      <Ball size={size} rotation={f * 9} />
    </div>
  );
};

export const Jersey: React.FC<{num: number; color?: string; trim?: string; size?: number}> = ({
  num,
  color = ESU.navy,
  trim = ESU.red,
  size = 170,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.45))'}}>
    <path d="M32 8 L42 4 Q50 12 58 4 L68 8 L94 22 L84 42 L74 36 L74 94 L26 94 L26 36 L16 42 L6 22 Z" fill={color} stroke={trim} strokeWidth="3" strokeLinejoin="round" />
    <path d="M42 4 Q50 12 58 4" fill="none" stroke={ESU.white} strokeWidth="3" />
    <text x="50" y="72" textAnchor="middle" fontFamily="Bebas Neue" fontSize="38" fill={ESU.white}>
      {num}
    </text>
  </svg>
);

/** Tactics board: players (dots) pass the ball along drawn lanes – "the European way". */
export const TacticBoard: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - at;
  const pts = [
    [220, 760],
    [470, 560],
    [760, 690],
    [620, 380],
    [860, 230],
  ];
  const seg = 11;
  const board = spring({frame: f, fps, config: ESU.spring.photo});
  const legs = pts.slice(1).map((p, i) => ({from: pts[i], to: p, t0: 8 + i * seg}));
  let ball = pts[0];
  for (const l of legs) {
    const k = interpolate(f, [l.t0, l.t0 + seg], [0, 1], clamp);
    if (k > 0) ball = [l.from[0] + (l.to[0] - l.from[0]) * k, l.from[1] + (l.to[1] - l.from[1]) * k];
  }
  return (
    <div
      style={{
        position: 'relative',
        width: 1000,
        height: 940,
        borderRadius: 48,
        background: 'linear-gradient(180deg,#1b7a45,#12502f)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.55), inset 0 0 0 6px rgba(255,255,255,0.8)',
        overflow: 'hidden',
        transform: `perspective(1400px) rotateX(${interpolate(board, [0, 1], [50, 14])}deg) scale(${interpolate(board, [0, 1], [0.7, 1])})`,
        opacity: board,
      }}
    >
      <svg width="1000" height="940" style={{position: 'absolute'}}>
        <g stroke="rgba(255,255,255,0.35)" strokeWidth="5" fill="none">
          <line x1="0" y1="470" x2="1000" y2="470" />
          <circle cx="500" cy="470" r="120" />
          <rect x="300" y="0" width="400" height="150" />
        </g>
        {legs.map((l, i) => {
          const k = interpolate(f, [l.t0, l.t0 + seg], [0, 1], clamp);
          const len = Math.hypot(l.to[0] - l.from[0], l.to[1] - l.from[1]);
          return (
            <line
              key={i}
              x1={l.from[0]}
              y1={l.from[1]}
              x2={l.to[0]}
              y2={l.to[1]}
              stroke={ESU.gold}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${len} ${len}`}
              strokeDashoffset={len * (1 - k)}
            />
          );
        })}
        {pts.map((p, i) => {
          const s = spring({frame: f - 2 - i * 2, fps, config: {stiffness: 300, damping: 14}});
          return (
            <g key={i} transform={`translate(${p[0]} ${p[1]}) scale(${s})`}>
              <circle r="44" fill={ESU.red} stroke="white" strokeWidth="7" />
              <text y="15" textAnchor="middle" fontFamily="Bebas Neue" fontSize="44" fill="white">
                {[7, 8, 10, 9, 11][i]}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: ball[0] - 30, top: ball[1] - 30 - 50}}>
        <Ball size={60} rotation={f * 20} />
      </div>
    </div>
  );
};

/** Game-style player card: the kid's "stats" upgrade over the season. */
export const PlayerCard: React.FC<{
  at: number;
  stats: {label: string; from: number; to: number; at: number; invert?: boolean; suffix?: string}[];
}> = ({at, stats}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - at;
  const s = spring({frame: f, fps, config: {stiffness: 110, damping: 14}});
  const ovr = Math.round(
    interpolate(frame, [stats[0].at, stats[stats.length - 1].at + 18], [61, 89], clamp),
  );
  const shine = interpolate(f % 60, [0, 30], [-60, 160], clamp);
  return (
    <div
      style={{
        position: 'relative',
        width: 760,
        padding: '48px 56px 54px',
        borderRadius: '60px 60px 90px 90px',
        background: 'linear-gradient(160deg,#fff3b0 0%,#FFD700 30%,#e0a800 70%,#b88400 100%)',
        boxShadow: '0 50px 120px rgba(0,0,0,0.6), inset 0 0 0 8px rgba(255,255,255,0.55)',
        transform: `perspective(1200px) rotateY(${interpolate(s, [0, 1], [-70, 0])}deg) scale(${interpolate(s, [0, 1], [0.6, 1])})`,
        opacity: interpolate(s, [0, 0.2], [0, 1], clamp),
        overflow: 'hidden',
        color: ESU.navyDeep,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -100,
          bottom: -100,
          width: 120,
          left: `${shine}%`,
          transform: 'skewX(-18deg)',
          background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.65), rgba(255,255,255,0))',
        }}
      />
      <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        <div>
          <div style={{fontFamily: FONT.stat, fontWeight: 700, fontSize: 150, lineHeight: 0.9}}>{ovr}</div>
          <div style={{fontFamily: FONT.display, fontSize: 56, letterSpacing: 3}}>FALL ’26</div>
        </div>
        <Jersey num={10} size={220} />
      </div>
      <div style={{fontFamily: FONT.display, fontSize: 96, letterSpacing: 4, marginTop: 12, lineHeight: 1}}>
        YOUR KID
      </div>
      <div style={{height: 4, background: 'rgba(10,31,63,0.3)', margin: '18px 0 26px'}} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
        {stats.map((st, i) => {
          const k = interpolate(frame, [st.at, st.at + 16], [0, 1], {...clamp, easing: (x) => 1 - (1 - x) ** 3});
          const val = st.from + (st.to - st.from) * k;
          const pct = st.invert ? 1 - val / Math.max(st.from, st.to) : val / 99;
          const good = k > 0.5;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{fontFamily: FONT.caption, fontWeight: 800, fontSize: 40, width: 330}}>{st.label}</div>
              <div style={{flex: 1, height: 26, borderRadius: 13, background: 'rgba(10,31,63,0.2)', overflow: 'hidden'}}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.max(4, pct * 100)}%`,
                    background: st.invert ? (good ? ESU.green : ESU.red) : ESU.navy,
                    borderRadius: 13,
                  }}
                />
              </div>
              <div style={{fontFamily: FONT.stat, fontWeight: 700, fontSize: 54, width: 130, textAlign: 'right'}}>
                {st.suffix ? `${val.toFixed(1)}${st.suffix}` : Math.round(val)}
              </div>
              <div style={{fontSize: 40, width: 40, color: st.invert ? ESU.green : ESU.green, opacity: k}}>
                {st.invert ? '▼' : '▲'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Falling autumn leaves – subtle "fall season" cue for the solution half. */
export const Leaves: React.FC<{count?: number; seed?: number}> = ({count = 9, seed = 3}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: number) => {
          const x = Math.sin((i + 1) * 999 * (k + seed)) * 10000;
          return x - Math.floor(x);
        };
        const speed = 2.2 + r(1) * 2.5;
        const y = ((frame * speed + r(2) * 2200) % 2300) - 200;
        const x = r(3) * 1080 + Math.sin((frame + i * 20) / 22) * 60;
        const size = 50 + r(4) * 60;
        const colors = ['#E9731E', '#C8102E', '#F2A541', '#B5451B'];
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 40 40"
            style={{position: 'absolute', left: x, top: y, transform: `rotate(${frame * (2 + r(5) * 3) + i * 40}deg)`, opacity: 0.85}}
          >
            <path d="M20 2 C30 10 36 20 20 38 C4 20 10 10 20 2 Z" fill={colors[i % 4]} />
            <path d="M20 6 L20 36" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};
