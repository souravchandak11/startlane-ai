import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ESU} from '../presets/brand';

/** Film grain + vignette that sits over everything (the "premium agency" finish). */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.09}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" style={{position: 'absolute', opacity, mixBlendMode: 'overlay'}}>
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.32) 100%)'}}
      />
    </AbsoluteFill>
  );
};

/**
 * Camera wrapper: constant slow push-in, optional punch-in zooms on given frames
 * (relative to the wrapper's Sequence) and ±px shake on impact frames.
 */
export const Camera: React.FC<{
  children: React.ReactNode;
  push?: number;
  punches?: {at: number; amount?: number}[];
  shakes?: number[];
  /** hard "crop cuts": from `at`, jump to `scale`× around origin (x%, y%) — a new shot without new footage */
  cuts?: {at: number; scale: number; x?: number; y?: number}[];
  durationInFrames: number;
}> = ({children, push = 0.06, punches = [], shakes = [], cuts = [], durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let scale = interpolate(frame, [0, durationInFrames], [1, 1 + push], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  for (const p of punches) {
    if (frame >= p.at) {
      const s = spring({frame: frame - p.at, fps, config: {stiffness: 260, damping: 22}});
      scale += (p.amount ?? 0.1) * s;
    }
  }
  let x = 0;
  let y = 0;
  for (const s of shakes) {
    const d = frame - s;
    if (d >= 0 && d < 10) {
      const k = (1 - d / 10) * 14;
      x += (random(`sx${s}-${d}`) - 0.5) * k;
      y += (random(`sy${s}-${d}`) - 0.5) * k;
    }
  }
  const cut = [...cuts].reverse().find((c) => frame >= c.at);
  const cutScale = cut ? cut.scale : 1;
  const origin = cut ? `${cut.x ?? 50}% ${cut.y ?? 45}%` : '50% 45%';
  return (
    <AbsoluteFill style={{transform: `translate(${x}px, ${y}px)`}}>
      <AbsoluteFill style={{transform: `scale(${scale * cutScale})`, transformOrigin: origin}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** White/brand flash frame used on hard cuts. */
export const Flash: React.FC<{at: number; color?: string; length?: number; peak?: number}> = ({
  at,
  color = '#fff',
  length = 6,
  peak = 0.85,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + length], [0, peak, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none'}} />;
};

/** Global trim for every sound effect relative to the voiceover. */
const SFX_GAIN = 0.5;

/** One-shot sound effect at a frame (relative to the parent Sequence). */
export const Sfx: React.FC<{at: number; name: string; volume?: number}> = ({at, name, volume = 0.5}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume * SFX_GAIN} />
  </Sequence>
);

/** Twemoji icon that pops in with overshoot and idles with a gentle float. */
export const Emoji: React.FC<{
  code: string;
  size: number;
  x: number;
  y: number;
  at?: number;
  rotate?: number;
  float?: number;
}> = ({code, size, x, y, at = 0, rotate = 0, float = 10}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {stiffness: 300, damping: 12}});
  if (frame < at) return null;
  const bob = Math.sin((frame - at) / 9) * float;
  return (
    <Img
      src={staticFile(`emoji/${code}.svg`)}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2 + bob,
        width: size,
        height: size,
        transform: `scale(${s}) rotate(${rotate + (1 - s) * -40}deg)`,
        filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.45))',
      }}
    />
  );
};

/** Thin progress bar at the very top – a retention cue viewers subconsciously track. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 10, background: 'rgba(255,255,255,0.12)'}}>
      <div
        style={{
          width: `${(frame / durationInFrames) * 100}%`,
          height: '100%',
          background: ESU.gradient.gold,
          boxShadow: '0 0 18px rgba(255,215,0,0.7)',
        }}
      />
    </div>
  );
};

/** Soft animated glow blobs used as a moving background layer. */
export const GlowBg: React.FC<{colors?: string[]; base?: string}> = ({
  colors = ['rgba(200,16,46,0.35)', 'rgba(26,58,107,0.9)', 'rgba(255,215,0,0.12)'],
  base = ESU.navyDeep,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: base, overflow: 'hidden'}}>
      {colors.map((c, i) => {
        const a = frame / (70 + i * 23) + i * 2.1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 1300,
              height: 1300,
              left: 540 - 650 + Math.cos(a) * 260,
              top: 700 - 650 + i * 380 + Math.sin(a * 1.3) * 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${c} 0%, rgba(0,0,0,0) 65%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
