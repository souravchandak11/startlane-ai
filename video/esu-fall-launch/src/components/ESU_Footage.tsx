import React from 'react';
import {AbsoluteFill, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import media from '../media.json';
import {ESU} from '../presets/brand';
import {FONT} from '../presets/fonts';
import {LOGO_ASPECT, LOGO_SRC} from './ESU_Logo';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type Slot = 'sofa' | 'kick' | 'match' | 'winning' | 'prep';
const FOOTAGE = media.footage as Partial<Record<Slot, {file: string; duration: number; fps: number; w: number; h: number}>>;
export const PHOTOS = media.photos as {file: string; w: number; h: number}[];

export const hasClip = (slot: Slot) => Boolean(FOOTAGE[slot]);
export const photo = (i: number) => (PHOTOS.length ? PHOTOS[((i % PHOTOS.length) + PHOTOS.length) % PHOTOS.length] : null);

/** Grades used on live footage: MMH warm/red-leaning colour, or high-contrast B&W. */
const GRADE = {
  warm: 'contrast(1.07) saturate(1.1) sepia(0.07) brightness(0.98)',
  mono: 'grayscale(1) contrast(1.2) brightness(0.92)',
  none: 'none',
};

/**
 * A real clip from public/footage, cut in at `inSec` (seconds into the source).
 * Frames inside are relative to the parent Sequence, like everything else.
 */
export const Clip: React.FC<{
  slot: Slot;
  inSec: number;
  rate?: number;
  grade?: keyof typeof GRADE;
  /** darken towards the top/bottom so type and corner logos stay readable */
  scrim?: 'top' | 'bottom' | 'both' | 'none';
  objectPosition?: string;
}> = ({slot, inSec, rate = 1, grade = 'warm', scrim = 'both', objectPosition = '50% 50%'}) => {
  const {fps} = useVideoConfig();
  const clip = FOOTAGE[slot];
  if (!clip) return null;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <OffthreadVideo
        src={staticFile(clip.file)}
        startFrom={Math.round(inSec * fps)}
        playbackRate={rate}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition, filter: GRADE[grade]}}
      />
      {(scrim === 'top' || scrim === 'both') && (
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%)'}} />
      )}
      {(scrim === 'bottom' || scrim === 'both') && (
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0) 48%)'}} />
      )}
    </AbsoluteFill>
  );
};

/** Full-bleed still photo with a slow Ken Burns drift (direction alternates by index). */
export const PhotoBg: React.FC<{i: number; dim?: number; mono?: boolean; blur?: number; drift?: number}> = ({
  i,
  dim = 0.35,
  mono = false,
  blur = 0,
  drift = 1,
}) => {
  const frame = useCurrentFrame();
  const p = photo(i);
  if (!p) return null;
  const dir = i % 2 ? 1 : -1;
  const s = 1.08 + frame * 0.0009 * drift;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Img
        src={staticFile(p.file)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${s}) translateX(${dir * frame * 0.35 * drift}px)`,
          filter: `${mono ? GRADE.mono : GRADE.warm}${blur ? ` blur(${blur}px)` : ''}`,
        }}
      />
      <AbsoluteFill style={{background: `rgba(5,5,10,${dim})`}} />
    </AbsoluteFill>
  );
};

/** A real photo as a bordered print (MMH), popping in at `at`. */
export const PhotoPrint: React.FC<{i: number; w: number; h: number; at?: number; rotate?: number; mono?: boolean}> = ({
  i,
  w,
  h,
  at = 0,
  rotate = -4,
  mono = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = photo(i);
  if (!p || frame < at) return null;
  const s = spring({frame: frame - at, fps, config: {stiffness: 260, damping: 20}});
  return (
    <div
      style={{
        padding: 12,
        background: '#fafafa',
        boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
        transform: `scale(${interpolate(s, [0, 1], [1.25, 1])}) rotate(${interpolate(s, [0, 1], [0, rotate])}deg)`,
        opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
      }}
    >
      <Img src={staticFile(p.file)} style={{width: w, height: h, objectFit: 'cover', display: 'block', filter: mono ? GRADE.mono : GRADE.warm}} />
    </div>
  );
};

/**
 * Persistent corner branding: ESU crest top-left, Wateria "official sponsor" badge top-right.
 * Sits below the Reels header safe area. `hideCrest` ranges fade the corner crest out while
 * the big crest is on screen.
 */
export const CornerLogos: React.FC<{hideCrest?: [number, number][]; hideAll?: [number, number][]}> = ({
  hideCrest = [],
  hideAll = [],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inRange = (r: [number, number][]) =>
    r.reduce((acc, [a, b]) => Math.max(acc, interpolate(frame, [a - 5, a, b, b + 5], [0, 1, 1, 0], clamp)), 0);
  const all = 1 - inRange(hideAll);
  const crestO = all * (1 - inRange(hideCrest));
  const enter = spring({frame: frame - 6, fps, config: {stiffness: 160, damping: 18}});
  // shine sweep every 8 s across both marks
  const cycle = frame % 240;
  const sweep = interpolate(cycle, [0, 22], [-60, 160], clamp);
  const crestW = 128;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 150,
          width: crestW,
          height: crestW / LOGO_ASPECT,
          opacity: crestO * enter,
          transform: `translateX(${(1 - enter) * -60}px)`,
          filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.5))',
        }}
      >
        <Img src={staticFile(LOGO_SRC)} style={{width: '100%', height: '100%'}} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            WebkitMaskImage: `url(${staticFile(LOGO_SRC)})`,
            WebkitMaskSize: '100% 100%',
            mixBlendMode: 'screen',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              bottom: '-20%',
              width: '26%',
              left: `${sweep}%`,
              transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0))',
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: 168,
          opacity: all * enter,
          transform: `translateX(${(1 - enter) * 60}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 6,
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.96)',
            borderRadius: 16,
            padding: '12px 18px',
            boxShadow: '0 8px 22px rgba(0,0,0,0.35)',
          }}
        >
          <Img src={staticFile('logos/wateria-navy.svg')} style={{width: 200, height: 200 * (462 / 1800), display: 'block'}} />
          <div
            style={{
              position: 'absolute',
              top: -10,
              bottom: -10,
              width: '30%',
              left: `${sweep}%`,
              transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.8), rgba(255,255,255,0))',
            }}
          />
        </div>
        <div
          style={{
            fontFamily: FONT.ui,
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 3,
            color: ESU.white,
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
          }}
        >
          OFFICIAL SPONSOR
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** End-card sponsor lockup: "Proudly sponsored by [Wateria]". */
export const SponsorLockup: React.FC<{at?: number; dark?: boolean}> = ({at = 0, dark = true}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - at, [0, 8], [0, 1], clamp);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: o}}>
      <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 26, letterSpacing: 6, color: dark ? 'rgba(255,255,255,0.75)' : '#333'}}>
        PROUDLY SPONSORED BY
      </div>
      <Img src={staticFile(dark ? 'logos/wateria-white.svg' : 'logos/wateria-navy.svg')} style={{width: 300, height: 300 * (462 / 1800)}} />
    </div>
  );
};
