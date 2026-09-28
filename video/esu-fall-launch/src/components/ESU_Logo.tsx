import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ESU} from '../presets/brand';

/**
 * Official Euro Soccer USA crest (navy/red shield, ball, "EST 2005").
 * public/logos/esu-logo.svg is a clean vector trace of the brand PNG
 * (public/logos/esu-logo-source.png), quantised to the three brand colors.
 */
export const LOGO_SRC = 'logos/esu-logo.svg';
export const LOGO_ASPECT = 1800 / 1698; // width / height

export const ESULogo: React.FC<{
  size?: number;
  at?: number;
  shimmer?: boolean;
  /** 'pop' = scale/rotate spring (default), 'wipe' = vertical mask reveal + settle */
  enter?: 'pop' | 'wipe' | 'slam' | 'none';
  glow?: boolean;
}> = ({size = 260, at = 0, shimmer = true, enter = 'pop', glow = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - at;
  const s = spring({frame: f, fps, config: ESU.spring.logo});
  const w = size;
  const h = size / LOGO_ASPECT;
  const src = staticFile(LOGO_SRC);

  let transform = 'none';
  let clip = 'none';
  let opacity = 1;
  if (enter === 'pop') {
    transform = `scale(${interpolate(s, [0, 1], [0.35, 1])}) rotate(${interpolate(s, [0, 1], [-18, 0])}deg)`;
    opacity = interpolate(s, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'});
  } else if (enter === 'slam') {
    // drops in oversized and lands hard on ~frame 6 (pair with Shockwave/Burst + shake)
    const k = spring({frame: f, fps, config: {stiffness: 260, damping: 20, mass: 0.8}});
    transform = `scale(${interpolate(k, [0, 1], [2.6, 1])})`;
    opacity = interpolate(f, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  } else if (enter === 'wipe') {
    const k = interpolate(f, [0, 14], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - (1 - x) ** 3});
    clip = `inset(${100 - k}% 0 0 0)`;
    transform = `scale(${interpolate(s, [0, 1], [1.12, 1])})`;
  }
  const sweep = interpolate(f, [12, 36], [-40, 140], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        transform,
        opacity,
        clipPath: clip,
        filter: `drop-shadow(0 26px 50px rgba(0,0,0,0.55))${glow ? ' drop-shadow(0 0 60px rgba(237,28,36,0.35))' : ''}`,
      }}
    >
      <Img src={src} style={{width: w, height: h}} />
      {shimmer && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            WebkitMaskImage: `url(${src})`,
            WebkitMaskSize: '100% 100%',
            maskImage: `url(${src})`,
            maskSize: '100% 100%',
            mixBlendMode: 'screen',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              bottom: '-20%',
              width: '22%',
              left: `${sweep}%`,
              transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))',
            }}
          />
        </div>
      )}
    </div>
  );
};
