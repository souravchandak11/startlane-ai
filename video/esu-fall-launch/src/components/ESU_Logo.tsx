import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ESU} from '../presets/brand';
import {FONT} from '../presets/fonts';

/**
 * Set to e.g. 'logos/esu-logo.png' once the official navy/red shield artwork is
 * dropped into public/logos/. Until then a brand-colored vector shield is drawn.
 */
export const OFFICIAL_LOGO: string | null = null;

const Shield: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size * 1.18} viewBox="0 0 200 236">
    <defs>
      <linearGradient id="sh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1A3A6B" />
        <stop offset="1" stopColor={ESU.navy} />
      </linearGradient>
    </defs>
    <path d="M100 6 L188 34 V112 C188 170 148 208 100 230 C52 208 12 170 12 112 V34 Z" fill={ESU.white} />
    <path d="M100 18 L176 42 V112 C176 162 142 196 100 216 C58 196 24 162 24 112 V42 Z" fill={ESU.red} />
    <path d="M100 30 L164 50 V112 C164 155 136 184 100 202 C64 184 36 155 36 112 V50 Z" fill="url(#sh)" />
    <text x="100" y="98" textAnchor="middle" fontFamily="Bebas Neue" fontSize="58" fill={ESU.white} letterSpacing="2">
      ESU
    </text>
    <g transform="translate(100 140)">
      <circle r="28" fill={ESU.white} />
      <path d="M0 -12 L11 -4 L7 10 L-7 10 L-11 -4 Z" fill={ESU.navy} />
      <path d="M0 -28 L0 -12 M11 -4 L26 -10 M7 10 L16 24 M-7 10 L-16 24 M-11 -4 L-26 -10" stroke={ESU.navy} strokeWidth="3" />
    </g>
    <path d="M52 64 H148" stroke={ESU.gold} strokeWidth="3" />
  </svg>
);

export const ESULogo: React.FC<{size?: number; at?: number; shimmer?: boolean}> = ({
  size = 260,
  at = 0,
  shimmer = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: ESU.spring.logo});
  const sweep = interpolate(frame - at, [10, 40], [-120, 220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size * 1.18,
        transform: `scale(${interpolate(s, [0, 1], [0.2, 1])}) rotate(${interpolate(s, [0, 1], [-25, 0])}deg)`,
        opacity: interpolate(s, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
        filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.55))',
      }}
    >
      {OFFICIAL_LOGO ? (
        <Img src={staticFile(OFFICIAL_LOGO)} style={{width: size, height: size * 1.18, objectFit: 'contain'}} />
      ) : (
        <Shield size={size} />
      )}
      {shimmer && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            clipPath: 'polygon(50% 0, 94% 12%, 94% 48%, 50% 98%, 6% 48%, 6% 12%)',
            mixBlendMode: 'screen',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -40,
              bottom: -40,
              width: 70,
              left: `${sweep}%`,
              transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, rgba(255,215,0,0), rgba(255,240,170,0.85), rgba(255,215,0,0))',
            }}
          />
        </div>
      )}
    </div>
  );
};

export const Wordmark: React.FC<{at?: number; scale?: number}> = ({at = 0, scale = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: ESU.spring.headline});
  return (
    <div style={{textAlign: 'center', transform: `translateY(${(1 - s) * 60}px) scale(${scale})`, opacity: s}}>
      <div style={{fontFamily: FONT.display, fontSize: 120, color: ESU.white, letterSpacing: 6, lineHeight: 0.95}}>
        EURO SOCCER <span style={{color: ESU.red}}>USA</span>
      </div>
    </div>
  );
};
