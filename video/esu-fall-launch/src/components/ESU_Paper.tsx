import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ESU} from '../presets/brand';
import {FONT} from '../presets/fonts';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Metro-Media-House "paper stage": pale grey field, soft vignette, faint fibre texture. */
export const PaperStage: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: '#e5e2e6'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #f4f1f5 0%, #e8e5e9 55%, #cfcacb 100%)'}} />
    <AbsoluteFill
      style={{
        opacity: 0.35,
        background:
          'repeating-linear-gradient(12deg, rgba(0,0,0,0.018) 0 1px, rgba(0,0,0,0) 1px 4px), repeating-linear-gradient(-70deg, rgba(255,255,255,0.05) 0 2px, rgba(0,0,0,0) 2px 6px)',
      }}
    />
    {children}
  </AbsoluteFill>
);

/**
 * A "print": content inside a thin white border with a soft shadow, slightly rotated.
 * `pullFrom` > 1 starts it full-bleed and springs it back down to print size (MMH pull-back reveal).
 */
export const Print: React.FC<{
  children: React.ReactNode;
  rotate?: number;
  at?: number;
  pullFrom?: number;
  border?: number;
  bg?: string;
}> = ({children, rotate = -4, at = 0, pullFrom = 1, border = 14, bg = '#fafafa'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {stiffness: 170, damping: 22}});
  const scale = interpolate(p, [0, 1], [pullFrom, 1]);
  const rot = interpolate(p, [0, 1], [0, rotate]);
  return (
    <div
      style={{
        padding: border,
        background: bg,
        boxShadow: '0 14px 34px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.18)',
        transform: `scale(${scale}) rotate(${rot}deg)`,
        opacity: frame < at ? 0 : 1,
      }}
    >
      {children}
    </div>
  );
};

/** Words sitting on one baseline either side of a card ("The names [photo] from"). */
export const InlineSentence: React.FC<{
  left: {t: string; at: number}[];
  right: {t: string; at: number}[];
  card: React.ReactNode;
  cardAt: number;
  size?: number;
  color?: string;
}> = ({left, right, card, cardAt, size = 58, color = '#111'}) => {
  const frame = useCurrentFrame();
  const word = (w: {t: string; at: number}, i: number) => (
    <span
      key={i}
      style={{
        fontFamily: FONT.ui,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: -1,
        color,
        opacity: interpolate(frame - w.at, [-1, 4], [0, 1], clamp),
        transform: `translateY(${interpolate(frame - w.at, [-1, 6], [10, 0], clamp)}px)`,
        display: 'inline-block',
      }}
    >
      {w.t}
    </span>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: -160}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, width: 250}}>{left.map(word)}</div>
        <div style={{opacity: frame >= cardAt ? 1 : 0}}>{card}</div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, width: 250}}>{right.map(word)}</div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Card cloud around a glowing serif headline ("Every / founder"):
 * cards pop in every few frames, back-row cards are smaller and blurred, all drift slowly.
 */
export const CardCloud: React.FC<{
  cards: {icon: string; bg: string}[];
  lead: string;
  big: React.ReactNode;
  at?: number;
  every?: number;
}> = ({cards, lead, big, at = 0, every = 3}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // fixed slots around the centre (x,y in px, depth 0 = front, 1 = back)
  // kept clear of the centre band (x 150–930, y 600–1030) where the headline sits
  const slots = [
    [200, 380, 1], [540, 250, 1], [880, 360, 0], [140, 540, 0], [940, 520, 1], [100, 830, 1],
    [980, 830, 1], [170, 1160, 0], [420, 1250, 1], [690, 1190, 0], [930, 1150, 1], [540, 1430, 1],
  ];
  const t = spring({frame: frame - at - 2, fps, config: {stiffness: 140, damping: 16}});
  return (
    <AbsoluteFill style={{background: '#07080a', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, rgba(255,190,90,0.14) 0%, rgba(0,0,0,0) 55%)'}} />
      {cards.slice(0, slots.length).map((c, i) => {
        const [x, y, depth] = slots[i];
        const f = frame - at - i * every;
        if (f < 0) return null;
        const p = spring({frame: f, fps, config: {stiffness: 300, damping: 18}});
        const size = depth ? 150 : 200;
        const driftX = Math.sin((frame + i * 30) / 40) * (depth ? 8 : 14);
        const driftY = (frame - at) * (depth ? -0.25 : -0.5);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - size / 2 + driftX,
              top: y - size / 2 + driftY,
              width: size,
              height: size * 1.15,
              borderRadius: 10,
              background: c.bg,
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              filter: depth ? 'blur(3px) brightness(0.75)' : 'none',
              transform: `scale(${p * (depth ? 0.85 : 1)}) rotate(${(random(`cc${i}`) - 0.5) * 10}deg)`,
              opacity: p,
            }}
          >
            <Img src={staticFile(`emoji/${c.icon}.svg`)} style={{width: size * 0.62, height: size * 0.62}} />
          </div>
        );
      })}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', marginTop: -140, opacity: t, transform: `scale(${interpolate(t, [0, 1], [1.08, 1])})`}}>
          <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 84, color: ESU.white, textShadow: '0 0 26px rgba(255,255,255,0.55)'}}>{lead}</div>
          <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 250, lineHeight: 0.95, color: ESU.white, textShadow: '0 0 34px rgba(255,255,255,0.5)'}}>
            {big}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Chalk tactics board: pitch lines, X's and O's and curved runs drawn on in white chalk. */
export const ChalkBoard: React.FC<{at?: number}> = ({at = 0}) => {
  const frame = useCurrentFrame();
  const f = frame - at;
  const draw = (start: number, len: number) => interpolate(f, [start, start + len], [1, 0], clamp);
  const chalk = {stroke: 'rgba(245,245,240,0.92)', strokeWidth: 7, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const path = (d: string, start: number, len: number, L = 1400, extra: React.SVGProps<SVGPathElement> = {}) => (
    <path d={d} {...chalk} strokeDasharray={L} strokeDashoffset={L * draw(start, len)} {...extra} />
  );
  const os = [[300, 1180], [520, 1040], [760, 1190], [420, 800], [690, 760]];
  const xs = [[340, 560], [560, 470], [780, 560], [540, 330]];
  return (
    <AbsoluteFill style={{background: '#1d2a23'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.35) 100%)'}} />
      {/* chalk dust smears */}
      <AbsoluteFill
        style={{
          opacity: 0.25,
          background:
            'repeating-linear-gradient(8deg, rgba(255,255,255,0.05) 0 3px, rgba(0,0,0,0) 3px 11px), repeating-linear-gradient(-30deg, rgba(255,255,255,0.03) 0 2px, rgba(0,0,0,0) 2px 9px)',
        }}
      />
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <g filter="url(#rough)">
          {path('M120 220 H960 V1500 H120 Z', 0, 14, 4300)}
          {path('M120 860 H960', 4, 10, 900)}
          {path('M540 860 m-150 0 a150 150 0 1 0 300 0 a150 150 0 1 0 -300 0', 6, 12, 1000)}
          {path('M330 220 V400 H750 V220', 8, 10, 800)}
        </g>
        {os.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={34} {...chalk} strokeDasharray={220} strokeDashoffset={220 * draw(14 + i * 3, 6)} />
        ))}
        {xs.map(([x, y], i) => (
          <g key={i} opacity={f >= 24 + i * 3 ? 1 : 0}>
            <path d={`M${x - 28} ${y - 28} L${x + 28} ${y + 28} M${x + 28} ${y - 28} L${x - 28} ${y + 28}`} stroke={ESU.red} strokeWidth={9} strokeLinecap="round" />
          </g>
        ))}
        {path('M300 1180 C 300 1000, 420 900, 520 1040', 34, 10, 500, {stroke: '#FFE14D'})}
        {path('M520 1040 C 620 980, 700 900, 690 760', 42, 10, 420, {stroke: '#FFE14D'})}
        {path('M690 760 C 680 600, 620 480, 560 420', 50, 10, 420, {stroke: '#FFE14D'})}
        {/* arrow head at the end of the run */}
        <path d="M560 420 l14 44 M560 420 l42 20" stroke="#FFE14D" strokeWidth={8} strokeLinecap="round" opacity={f >= 60 ? 1 : 0} />
        <defs>
          <filter id="rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={3} />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};

/** White block wipe across a cut (MMH): frames relative to parent. */
export const BlockWipe: React.FC<{at: number; dir?: 1 | -1}> = ({at, dir = 1}) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < -2 || d > 2) return null;
  // -2: sliver, -1: half, 0: full, 1: half (other side), 2: sliver
  const cover = [0.25, 0.6, 1, 0.55, 0.2][d + 2];
  const fromLeft = d <= 0 ? dir === 1 : dir !== 1;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: `${cover * 100}%`,
        [fromLeft ? 'left' : 'right']: 0,
        background: '#f4f5f5',
      }}
    />
  );
};

/** One-frame solarised / inverted flash. */
export const InvertFlash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  if (frame !== at && frame !== at + 1) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: '#fff', mixBlendMode: 'difference'}} />
      <AbsoluteFill style={{background: 'rgba(27,225,234,0.35)', mixBlendMode: 'color'}} />
    </AbsoluteFill>
  );
};
