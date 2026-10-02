/**
 * Euro Soccer USA — "Glued to your leg" (Fall season, 32 s, text-carried, no voiceover).
 *
 * Goal: book the full fall season tonight (class is tomorrow morning), not a drop-in.
 *  0–3     HOOK (animated): a kid literally glued to a parent's leg, stopwatch races to 20:00
 *  3–5.5   New coach. New kids. Start over. Again. (real footage, muted, rewinds on "Again.")
 *  5.5–9.5 TURN: colour + music lift, "A few weeks later: they run ahead of you."
 *  9.5–13.5 What changed? The same coach. Every week. (coach circle + 8 identical weeks)
 *  13.5–18 DROP-IN vs SEASON split
 *  18–22   Price card: $32 a class vs $37.50 ($39 from Monday) → save $56
 *  22–26   Hard CTA: first class is tomorrow morning. Book tonight. Link in bio.
 *  26–30.5 EARLYBIRD25: 25% off Thanksgiving and Winter Camps (ends Sunday)
 *  30.5–32 Logo lockup
 *
 * Footage: real Weekend Academy clips (public/footage/glued/*.mp4, gitignored; pulled from the
 * ESU Drive and screened against the opt-out list). No AI people. FALL15 intentionally removed.
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Freeze,
  Img,
  interpolate,
  OffthreadVideo,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ESU, FPS} from '../presets/brand';
import {loadAllFonts} from '../presets/fonts';
import {CornerLogos} from '../components/ESU_Footage';
import {Grain} from '../components/ESU_Fx';
import {LOGO_ASPECT, LOGO_SRC} from '../components/ESU_Logo';
import {Parent, Toddler} from '../mdm/Characters';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const S = (sec: number) => Math.round(sec * FPS);

export const GLUED_TOTAL = S(32);

const NAVY = ESU.navy;
const NAVY_DEEP = ESU.navyDeep;
const RED = ESU.red;
const YELLOW = ESU.gold;
const HEAD = 'Oswald, sans-serif';
const BODY = 'Montserrat, Poppins, sans-serif';
const SHADOW = '0 4px 26px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.5)';
const MUTED = 'saturate(0.35) contrast(1.05) brightness(0.9)';
const WARM = 'saturate(1.15) contrast(1.06) brightness(1.02)';

const T = {
  hook: [0, S(3)],
  again: [S(3), S(5.5)],
  turn: [S(5.5), S(9.5)],
  coach: [S(9.5), S(13.5)],
  split: [S(13.5), S(18)],
  price: [S(18), S(22)],
  cta: [S(22), S(26)],
  early: [S(26), S(30.5)],
  end: [S(30.5), S(32)],
} as const;

const F = (name: string) => staticFile(`footage/glued/${name}.mp4`);
const STILL = (name: string) => staticFile(`footage/glued/stills/${name}.jpg`);
const DUR: Record<string, number> = {
  kids_meet: 1.0,
  alone_ladder: 1.71,
  run_ahead: 1.74,
  run_ball: 1.81,
  coach_circle: 8.0,
  group_play: 1.98,
  ball_smile: 3.0,
};
const FIELD_VOL = 0.3;

// ------------------------------------------------------------------ helpers
const useIn = (at: number, cfg: {stiffness: number; damping: number} = ESU.spring.headline) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame < at ? 0 : spring({frame: frame - at, fps, config: cfg});
};

/** real clip, full-bleed cover, slow push; slowed by `rate`, holds its last frame if short */
const Clip: React.FC<{
  name: string;
  frames: number;
  from?: number;
  rate?: number;
  focus?: string;
  grade?: string;
  push?: number;
  audio?: boolean;
  reverseAt?: number; // local frame at which playback rewinds fast
}> = ({name, frames, from = 0, rate = 1, focus = '50% 50%', grade = WARM, push = 0.06, audio = true, reverseAt}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, frames], [1, 1 + push], clamp);
  const avail = Math.max(1, Math.floor((DUR[name] - from) * FPS) - 2);
  const playFrames = Math.min(frames, Math.floor(avail / rate));
  const vol = (f: number) => interpolate(f, [0, 3, frames - 3, frames], [0, 1, 1, 0], clamp) * FIELD_VOL;
  const video = (
    <OffthreadVideo
      src={F(name)}
      startFrom={Math.round(from * FPS)}
      playbackRate={rate}
      volume={audio ? vol : 0}
      muted={!audio}
      style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, filter: grade}}
    />
  );
  let body: React.ReactNode;
  if (reverseAt !== undefined && frame >= reverseAt) {
    // rewind: step back through the source fast
    const back = Math.max(0, Math.min(playFrames - 1, reverseAt) - (frame - reverseAt) * 3);
    body = <Freeze frame={back}>{video}</Freeze>;
  } else if (frame >= playFrames) {
    body = <Freeze frame={playFrames - 1}>{video}</Freeze>;
  } else {
    body = video;
  }
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>{body}</AbsoluteFill>
    </AbsoluteFill>
  );
};

const Scrim: React.FC<{top?: number; bottom?: number}> = ({top = 0.72, bottom = 0.5}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(11,8,38,${top}) 0%, rgba(11,8,38,${top * 0.55}) 30%, rgba(11,8,38,0) 47%, rgba(11,8,38,0) 64%, rgba(11,8,38,${bottom}) 100%)`,
    }}
  />
);

const Head: React.FC<{at: number; size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
  at,
  size = 112,
  color = '#fff',
  children,
  style,
}) => {
  const k = useIn(Math.max(at, 0));
  const shown = at <= 0 ? 1 : k;
  return (
    <div
      style={{
        fontFamily: HEAD,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color,
        textShadow: SHADOW,
        whiteSpace: 'nowrap',
        opacity: Math.min(1, shown * 1.4),
        transform: `translateY(${(1 - shown) * 60}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Sub: React.FC<{at: number; size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
  at,
  size = 64,
  color = '#fff',
  children,
  style,
}) => {
  const k = useIn(at);
  return (
    <div
      style={{
        fontFamily: BODY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.15,
        color,
        textShadow: SHADOW,
        opacity: Math.min(1, k * 1.4),
        transform: `translateY(${(1 - k) * 40}px) scale(${0.9 + 0.1 * Math.min(1, k)})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Hi: React.FC<{children: React.ReactNode; bg?: string; color?: string}> = ({children, bg = YELLOW, color = NAVY}) => (
  <span style={{background: bg, color, padding: '0 0.16em', borderRadius: 8, textShadow: 'none'}}>{children}</span>
);

const Block: React.FC<{top: number; children: React.ReactNode; gap?: number}> = ({top, children, gap = 16}) => (
  <div style={{position: 'absolute', left: 50, right: 50, top, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap}}>
    {children}
  </div>
);

const Flash: React.FC<{at?: number; len?: number}> = ({at = 0, len = 6}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + len], [0, 0.9, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{background: '#fff', opacity: o}} /> : null;
};

const NavyBg: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(${160 + frame * 0.4}deg, #241b63 0%, ${NAVY} 45%, ${NAVY_DEEP} 100%)`}}>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 18px, rgba(255,255,255,0) 18px 36px)'}} />
      {children}
    </AbsoluteFill>
  );
};

const Scene: React.FC<{range: readonly [number, number]; children: React.ReactNode}> = ({range, children}) => (
  <Sequence from={range[0]} durationInFrames={range[1] - range[0]}>
    {children}
  </Sequence>
);

// ================================================================== 1 · HOOK (animated)
const Stopwatch: React.FC<{x: number; y: number; r: number; minutes: number}> = ({x, y, r, minutes}) => {
  const frame = useCurrentFrame();
  const ang = (minutes / 60) * 360 * 6; // sweep hand spins fast
  const shake = Math.sin(frame * 2.2) * 2.5;
  const mm = String(Math.floor(minutes)).padStart(2, '0');
  const ss = String(Math.floor((minutes % 1) * 60)).padStart(2, '0');
  return (
    <g transform={`translate(${x + shake} ${y}) rotate(${shake})`}>
      <rect x={-22} y={-r - 46} width={44} height={34} rx={8} fill={YELLOW} />
      <rect x={-10} y={-r - 16} width={20} height={20} fill={YELLOW} />
      <rect x={r * 0.62} y={-r * 0.92} width={30} height={22} rx={6} fill={YELLOW} transform={`rotate(40 ${r * 0.62} ${-r * 0.92})`} />
      <circle r={r + 14} fill={NAVY_DEEP} stroke={YELLOW} strokeWidth={10} />
      <circle r={r} fill="#fff" />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={-3} y={-r + 8} width={6} height={i % 3 === 0 ? 22 : 12} fill={NAVY} transform={`rotate(${i * 30})`} />
      ))}
      <path d={`M0 0 L0 ${-r * 0.82}`} stroke={RED} strokeWidth={8} strokeLinecap="round" transform={`rotate(${ang})`} />
      <circle r={12} fill={RED} />
      <g transform={`translate(0 ${r + 74})`}>
        <rect x={-122} y={-46} width={244} height={74} rx={16} fill={RED} />
        <text x={0} y={14} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={56} fill="#fff" letterSpacing={2}>
          {mm}:{ss}
        </text>
      </g>
    </g>
  );
};

const GlueBottle: React.FC<{x: number; y: number; s: number; squeeze: number}> = ({x, y, s, squeeze}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-24)`}>
    <path d="M-8 -150 L8 -150 L14 -110 L-14 -110 Z" fill={YELLOW} />
    <rect x={-28} y={-112} width={56} height={26} rx={8} fill={YELLOW} />
    <rect x={-58} y={-88} width={116} height={160} rx={30} fill="#fff" transform={`scale(${1 + squeeze * 0.06} ${1 - squeeze * 0.08})`} />
    <rect x={-58} y={-40} width={116} height={64} fill={RED} />
    <text x={0} y={6} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={44} fill="#fff" letterSpacing={3}>
      GLUE
    </text>
  </g>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  // two attempts to step forward; the kid comes along, glued to the leg
  const lift = (a: number, b: number) => {
    const u = interpolate(frame, [a, a + 8, b - 6, b], [0, 1, 1, 0], {...clamp, easing: (t) => t * t * (3 - 2 * t)});
    return u;
  };
  const k = Math.max(lift(14, 40), lift(52, 78));
  const ms = 1.15;
  const mx = 640;
  const floor = 1660;
  // mom's left leg (viewer's left) is the one the kid is glued to
  const footL: [number, number] = [-50 + 70 * k, -120 * k];
  const kidDX = 60 * k * 0.55;
  const kidDY = -120 * k * ms * 0.5;
  const squash = 1 - 0.08 * Math.sin(Math.min(1, k) * Math.PI);
  const minutes = interpolate(frame, [0, 82], [0, 20], clamp);
  const glueK = interpolate(frame, [4, 12], [0, 1], clamp);
  const push = interpolate(frame, [0, 90], [1, 1.07], clamp);
  return (
    <AbsoluteFill>
      <NavyBg />
      {/* spotlight */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 22% at 56% 86%, rgba(255,215,0,0.32) 0%, rgba(255,215,0,0) 70%)'}} />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '55% 75%'}}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <filter id="sticker" x="-20%" y="-20%" width="140%" height="140%">
              <feMorphology operator="dilate" radius="9" in="SourceAlpha" result="d" />
              <feFlood floodColor="#ffffff" />
              <feComposite in2="d" operator="in" result="o" />
              <feGaussianBlur in="d" stdDeviation="14" result="b" />
              <feOffset in="b" dy="18" result="sh" />
              <feFlood floodColor="rgba(0,0,0,0.45)" />
              <feComposite in2="sh" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="o" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <ellipse cx={600} cy={floor + 6} rx={300} ry={34} fill="rgba(0,0,0,0.35)" />
          <Stopwatch x={235} y={930} r={118} minutes={minutes} />
          <g filter="url(#sticker)">
            <Parent
              kind="mom"
              x={mx}
              y={floor}
              scale={ms}
              footL={footL}
              footR={[50, 0]}
              handL={[-170, 120 - 60 * k]}
              handR={[190, 40 - 30 * k]}
              lean={-4 * k}
              mouth={k > 0.3 ? 'o' : 'open'}
              look={-1}
              headTilt={-6 * k}
              shadow={false}
            />
            <g transform={`translate(${kidDX} ${kidDY})`}>
              <Toddler
                x={520}
                y={floor}
                scale={1.05}
                handL={[70, 12]}
                handR={[78, 34]}
                footL={[-10, 92 - 30 * k]}
                footR={[22, 92 - 40 * k]}
                lean={9}
                headTilt={14}
                squash={squash}
                blink={1}
                mouth="flat"
                shadow={false}
              />
            </g>
            {/* glue globs where the kid holds on */}
            <g transform={`translate(${590 + kidDX} ${1450 + kidDY}) scale(${glueK})`}>
              <ellipse cx={0} cy={0} rx={30} ry={18} fill={YELLOW} />
              <path d={`M-14 8 Q-16 ${36 + 20 * k} -8 ${46 + 30 * k} Q0 ${36 + 20 * k} -2 8 Z`} fill={YELLOW} />
              <path d={`M10 10 Q8 ${28 + 12 * k} 14 ${36 + 18 * k} Q22 ${28 + 12 * k} 18 8 Z`} fill={YELLOW} />
              <ellipse cx={-8} cy={-4} rx={8} ry={4} fill="#fff" opacity={0.6} />
            </g>
          </g>
          <g filter="url(#sticker)" opacity={glueK}>
            <GlueBottle x={300} y={1450} s={0.9 * (0.6 + 0.4 * glueK)} squeeze={frame < 14 ? Math.sin(frame / 2) : 0} />
          </g>
        </svg>
      </AbsoluteFill>
      <Block top={330} gap={14}>
        <Head at={0} size={100}>
          Every new thing,
        </Head>
        <Head at={0} size={86}>
          the first <Hi>20 minutes</Hi>
        </Head>
        <Head at={0} size={100}>
          look like this.
        </Head>
      </Block>
    </AbsoluteFill>
  );
};

// ================================================================== 2 · NEW COACH. NEW KIDS. START OVER. AGAIN.
const Again: React.FC = () => {
  const frame = useCurrentFrame();
  const c1 = 22;
  const c2 = 44;
  const again = 60;
  const spin = frame >= again ? (frame - again) * -24 : 0;
  const ring = frame >= again ? Math.min(1, (frame - again) / 6) : 0;
  return (
    <AbsoluteFill>
      {frame < c1 && <Clip name="kids_meet" frames={c1} focus="92% 50%" grade={MUTED} push={0.1} />}
      {frame >= c1 && frame < c2 && (
        <Sequence from={c1} layout="none">
          <Clip name="kids_meet" frames={c2 - c1} from={0.3} focus="40% 50%" grade={MUTED} push={0.1} />
        </Sequence>
      )}
      {frame >= c2 && (
        <Sequence from={c2} layout="none">
          <Clip name="alone_ladder" frames={75 - c2} rate={0.6} focus="86% 50%" grade={MUTED} push={0.05} reverseAt={again - c2} />
        </Sequence>
      )}
      <Scrim />
      {/* rewind lines on "Again." */}
      {frame >= again &&
        new Array(5).fill(0).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: (random(`rw${frame}${i}`) * 1920) | 0, height: 6 + random(`rh${frame}${i}`) * 16, background: 'rgba(255,255,255,0.4)'}} />
        ))}
      {frame >= again && (
        <div style={{position: 'absolute', left: 540, top: 1040, transform: `translate(-50%, -50%) scale(${ring})`, opacity: 0.92}}>
          <svg width={300} height={300} viewBox="-150 -150 300 300" style={{transform: `rotate(${spin}deg)`}}>
            <path d="M0 -100 A100 100 0 1 1 -100 0" stroke="#fff" strokeWidth={26} fill="none" strokeLinecap="round" />
            <path d="M-100 -56 L-100 22 L-26 -18 Z" fill="#fff" transform="rotate(-6)" />
          </svg>
        </div>
      )}
      <Block top={360} gap={18}>
        <div style={{display: 'flex', gap: 22, justifyContent: 'center'}}>
          <Sub at={2} size={80}>
            New coach.
          </Sub>
          <Sub at={c1 + 2} size={80}>
            New kids.
          </Sub>
        </div>
        <div style={{display: 'flex', gap: 22, alignItems: 'center', justifyContent: 'center'}}>
          <Sub at={c2 + 2} size={80}>
            Start over.
          </Sub>
          <Sub at={again} size={80} style={{background: RED, padding: '0 0.3em 0.06em', borderRadius: 14, textShadow: 'none'}}>
            Again.
          </Sub>
        </div>
      </Block>
    </AbsoluteFill>
  );
};

// ================================================================== 3 · THE TURN
const Turn: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = 85;
  const sweep = interpolate(frame, [4, 26], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  return (
    <AbsoluteFill>
      {frame < cut ? (
        <Clip name="run_ahead" frames={cut} rate={0.6} focus="80% 50%" push={0.12} />
      ) : (
        <Sequence from={cut} layout="none">
          <Clip name="run_ball" frames={120 - cut} from={0.25} rate={0.8} focus="92% 50%" push={0.08} />
        </Sequence>
      )}
      <Scrim top={0.35} bottom={0.8} />
      {/* speed streaks */}
      {frame < 40 &&
        new Array(9).fill(0).map((_, i) => {
          const y = 760 + random(`sy${i}`) * 900;
          const x = interpolate(frame, [0, 40], [-500, 1400], clamp) + random(`sx${i}`) * 400 - 200;
          return <div key={i} style={{position: 'absolute', left: x, top: y, width: 260 + random(`sw${i}`) * 200, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.55)', opacity: 1 - frame / 40}} />;
        })}
      {/* yellow arrow swoosh behind the headline */}
      <svg width={1080} height={420} style={{position: 'absolute', left: 0, top: 1170}}>
        <path
          d="M90 300 C 300 330, 640 300, 940 180"
          stroke={YELLOW}
          strokeWidth={22}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={1000}
          strokeDashoffset={1000 * (1 - sweep)}
          opacity={0.9}
        />
        {sweep > 0.95 && <path d="M900 140 L975 165 L925 225 Z" fill={YELLOW} />}
      </svg>
      <Block top={1120} gap={14}>
        <Head at={6} size={64} color={YELLOW} style={{letterSpacing: 3}}>
          A few weeks later:
        </Head>
        <Head at={14} size={128}>
          They run
        </Head>
        <Head at={21} size={128}>
          <Hi>ahead</Hi> of you.
        </Head>
      </Block>
      <Flash at={0} len={7} />
    </AbsoluteFill>
  );
};

// ================================================================== 4 · THE SAME COACH. EVERY WEEK.
const Coach: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(6, ESU.spring.photo);
  const tilesAt = 46;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: 'blur(22px) brightness(0.42) saturate(1.2)', transform: 'scale(1.15)'}}>
        <Clip name="coach_circle" frames={120} from={1} audio={false} push={0} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,8,38,0.55), rgba(11,8,38,0.2) 40%, rgba(11,8,38,0.7))'}} />
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 700,
          height: 540,
          borderRadius: 30,
          overflow: 'hidden',
          border: '8px solid #fff',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          transform: `translateY(${(1 - card) * 300}px) rotate(${(1 - card) * -6}deg)`,
          opacity: Math.min(1, card * 1.5),
        }}
      >
        <Clip name="coach_circle" frames={120} from={1} focus="45% 40%" push={0.06} />
      </div>
      {/* 8 identical weeks: same coach, same group */}
      <div style={{position: 'absolute', left: 51, top: 1290, display: 'flex', gap: 14}}>
        {new Array(8).fill(0).map((_, i) => {
          const at = tilesAt + i * 7;
          const k = frame >= at ? spring({frame: frame - at, fps: FPS, config: ESU.spring.stat}) : 0;
          return (
            <div key={i} style={{width: 110, textAlign: 'center', opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 30}px)`}}>
              <div style={{position: 'relative', width: 110, height: 110, borderRadius: 18, overflow: 'hidden', border: `5px solid ${YELLOW}`}}>
                <Img src={STILL('coach_circle')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '45% 40%'}} />
                <div style={{position: 'absolute', right: 4, bottom: 4, width: 34, height: 34, borderRadius: '50%', background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width={22} height={22} viewBox="-11 -11 22 22">
                    <path d="M-6 0 L-2 5 L7 -5" stroke={NAVY} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 26, color: '#fff', marginTop: 6, letterSpacing: 1}}>WEEK {i + 1}</div>
            </div>
          );
        })}
      </div>
      <Block top={330} gap={14}>
        <Sub at={2} size={68}>
          What changed?
        </Sub>
        <Head at={16} size={118}>
          The same coach.
        </Head>
        <Head at={tilesAt - 6} size={118}>
          <Hi bg={RED} color="#fff">
            Every week.
          </Hi>
        </Head>
      </Block>
    </AbsoluteFill>
  );
};

// ================================================================== 5 · DROP-IN vs SEASON
const Half: React.FC<{side: 'l' | 'r'; frames: number; reveal: number; pick: number}> = ({side, frames, reveal, pick}) => {
  const left = side === 'l';
  const k = useIn(left ? 14 : 24, ESU.spring.stat);
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        height: 1920,
        left: left ? 0 : 545,
        width: 535,
        overflow: 'hidden',
        clipPath: left ? `inset(0 ${100 - reveal}% 0 0)` : `inset(0 0 0 ${100 - reveal}%)`,
        filter: left ? `saturate(${1 - 0.75 * pick}) brightness(${1 - 0.25 * pick})` : undefined,
      }}
    >
      {left ? (
        <Clip name="alone_ladder" frames={frames} rate={0.5} focus="66% 50%" push={0.08} />
      ) : (
        <Clip name="group_play" frames={frames} rate={0.6} focus="50% 30%" push={0.08} />
      )}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,8,38,0.65) 0%, rgba(11,8,38,0) 30%, rgba(11,8,38,0) 55%, rgba(11,8,38,0.88) 100%)'}} />
      <div style={{position: 'absolute', top: 340, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 78,
            letterSpacing: 2,
            color: left ? '#fff' : NAVY,
            background: left ? RED : YELLOW,
            padding: '4px 30px 8px',
            borderRadius: 14,
            transform: `scale(${k})`,
            boxShadow: '0 10px 26px rgba(0,0,0,0.35)',
          }}
        >
          {left ? 'DROP-IN' : 'SEASON'}
        </div>
      </div>
      {!left && pick > 0 && <AbsoluteFill style={{boxShadow: `inset 0 0 0 ${12 * pick}px ${YELLOW}`}} />}
    </div>
  );
};

const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const frames = T.split[1] - T.split[0];
  const l = interpolate(frame, [0, 10], [0, 100], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const r = interpolate(frame, [8, 18], [0, 100], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const pick = interpolate(frame, [92, 102], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: NAVY_DEEP}}>
      <Half side="l" frames={frames} reveal={l} pick={pick} />
      <Half side="r" frames={frames} reveal={r} pick={pick} />
      <div style={{position: 'absolute', left: 535, top: 0, bottom: 0, width: 10, background: '#fff', opacity: Math.min(l, r) / 100}} />
      <div style={{position: 'absolute', left: 50, width: 450, top: 1150}}>
        <Sub at={34} size={48}>
          <span style={{color: '#FF8A8F'}}>Drop-in:</span> a new start each time.
        </Sub>
      </div>
      <div style={{position: 'absolute', left: 590, width: 450, top: 1150}}>
        <Sub at={56} size={48}>
          <span style={{color: YELLOW}}>Season:</span> same coach, same group, 8 weeks.
        </Sub>
      </div>
    </AbsoluteFill>
  );
};

// ================================================================== 6 · PRICE
const Count: React.FC<{at: number; from: number; to: number; decimals?: number}> = ({at, from, to, decimals = 0}) => {
  const k = useIn(at, ESU.spring.stat);
  return <>{(from + (to - from) * Math.min(1, k)).toFixed(decimals)}</>;
};

const Price: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useIn(4, ESU.spring.photo);
  const b = useIn(26, ESU.spring.photo);
  const monday = useIn(50, ESU.spring.stat);
  const save = useIn(72, {stiffness: 160, damping: 11});
  const tile = (k: number, border: string): React.CSSProperties => ({
    position: 'absolute',
    left: 80,
    right: 80,
    borderRadius: 34,
    border: `5px solid ${border}`,
    background: 'rgba(255,255,255,0.05)',
    padding: '30px 46px',
    opacity: Math.min(1, k * 1.5),
    transform: `translateY(${(1 - k) * 80}px)`,
  });
  const burst = frame * 0.8;
  return (
    <NavyBg>
      <div style={{...tile(a, YELLOW), top: 340}}>
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: YELLOW, letterSpacing: 2}}>SEASON:</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
          <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 210, color: '#fff', lineHeight: 1}}>$32</div>
          <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 70, color: '#fff'}}>A CLASS.</div>
        </div>
      </div>
      <div style={{...tile(b, 'rgba(255,255,255,0.55)'), top: 760}}>
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: 'rgba(255,255,255,0.8)', letterSpacing: 2}}>DROP-IN:</div>
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 160, color: '#fff', lineHeight: 1}}>
          $<Count at={28} from={32} to={37.5} decimals={2} />,
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 16,
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 60,
            color: '#fff',
            background: RED,
            padding: '2px 24px 6px',
            borderRadius: 14,
            transform: `scale(${monday})`,
            transformOrigin: '0% 50%',
          }}
        >
          <svg width={40} height={46} viewBox="0 0 44 50">
            <path d="M22 4 L40 26 H29 V46 H15 V26 H4 Z" fill="#fff" />
          </svg>
          AND $39 FROM MONDAY.
        </div>
      </div>
      {/* the season saves money: 8 x $39 = $312 vs $256 */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1200, display: 'flex', justifyContent: 'center', opacity: Math.min(1, save * 1.4)}}>
        <div style={{position: 'relative', transform: `scale(${0.6 + 0.4 * save}) rotate(-3deg)`}}>
          <svg width={760} height={250} style={{position: 'absolute', left: -40, top: -36, overflow: 'visible'}}>
            {new Array(16).fill(0).map((_, i) => (
              <rect key={i} x={378} y={60} width={8} height={120} rx={4} fill={YELLOW} opacity={0.25} transform={`rotate(${i * 22.5 + burst} 380 125)`} />
            ))}
          </svg>
          <div style={{position: 'relative', background: YELLOW, color: NAVY, borderRadius: 24, padding: '14px 40px 18px', textAlign: 'center', boxShadow: '0 16px 40px rgba(0,0,0,0.4)'}}>
            <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 92, lineHeight: 1}}>SAVE $56</div>
            <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, marginTop: 6}}>8 weeks: $256 season vs. $312 in drop-ins</div>
          </div>
        </div>
      </div>
    </NavyBg>
  );
};

// ================================================================== 7 · HARD CTA
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const bar = useIn(4, ESU.spring.photo);
  const pill = useIn(10, ESU.spring.stat);
  const pulse = frame > 34 ? 1 + Math.sin((frame - 34) / 4) * 0.035 : 1;
  const arrowIn = useIn(26);
  return (
    <AbsoluteFill>
      <Clip name="ball_smile" frames={120} from={0.5} rate={0.45} focus="100% 45%" push={0.07} />
      <Scrim top={0.5} bottom={0.25} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 350, display: 'flex', justifyContent: 'center'}}>
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 46, letterSpacing: 3, color: '#fff', background: 'rgba(24,17,69,0.88)', border: `3px solid ${YELLOW}`, padding: '8px 28px 10px', borderRadius: 999, transform: `scale(${pill})`}}>
          8 WEEKS · SAME COACH · SAME GROUP
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1040,
          padding: '34px 40px 40px',
          background: RED,
          boxShadow: '0 -10px 40px rgba(0,0,0,0.35)',
          transform: `translateY(${(1 - bar) * 560}px)`,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Head at={10} size={58} style={{textShadow: 'none'}}>
          First class is tomorrow morning.
        </Head>
        <div style={{transform: `scale(${pulse})`}}>
          <Head at={18} size={156} color={YELLOW} style={{textShadow: '0 6px 0 rgba(0,0,0,0.18)'}}>
            Book tonight.
          </Head>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
          <Head at={26} size={62} style={{textShadow: 'none'}}>
            Link in bio.
          </Head>
          <svg width={46} height={52} viewBox="0 0 44 50" style={{transform: `translateY(${-Math.sin(frame / 4) * 8}px)`, opacity: Math.min(1, arrowIn * 1.4)}}>
            <path d="M22 4 L40 26 H29 V46 H15 V26 H4 Z" fill="#fff" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ================================================================== 8 · EARLYBIRD25 (extended)
const Polaroids: React.FC<{dim?: number}> = ({dim = 1}) => {
  const frame = useCurrentFrame();
  const items = [
    {s: 'run_ball', x: -60, y: 250, r: -12, w: 330},
    {s: 'group_play', x: 800, y: 300, r: 10, w: 300},
    {s: 'coach_circle', x: -80, y: 1370, r: 8, w: 360},
    {s: 'run_ahead', x: 790, y: 1360, r: -9, w: 330},
    {s: 'ball_smile', x: 700, y: 820, r: 14, w: 280},
  ];
  return (
    <AbsoluteFill style={{opacity: dim}}>
      {items.map((p, i) => {
        const dy = Math.sin(frame / 30 + i) * 14;
        const dr = Math.sin(frame / 40 + i * 2) * 2;
        return (
          <div
            key={p.s}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y + dy,
              width: p.w,
              padding: '14px 14px 46px',
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
              transform: `rotate(${p.r + dr}deg)`,
              filter: i === 4 ? 'blur(3px)' : undefined,
              opacity: 0.85,
            }}
          >
            <Img src={STILL(p.s)} style={{width: '100%', height: p.w * 0.8, objectFit: 'cover', display: 'block'}} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Leaf: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <path d="M0 -44 L10 -18 L34 -28 L24 -4 L44 6 L18 14 L22 38 L0 24 L-22 38 L-18 14 L-44 6 L-24 -4 L-34 -28 L-10 -18 Z" fill="#FF8A1F" />
    <path d="M0 -30 L0 46" stroke="#8A3D00" strokeWidth={5} strokeLinecap="round" />
  </svg>
);
const Snowflake: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    {[0, 60, 120].map((a) => (
      <g key={a} transform={`rotate(${a})`} stroke="#9ED8FF" strokeWidth={7} strokeLinecap="round">
        <path d="M0 -44 L0 44" />
        <path d="M0 -30 L-12 -40 M0 -30 L12 -40 M0 30 L-12 40 M0 30 L12 40" />
      </g>
    ))}
  </svg>
);

const Early: React.FC = () => {
  const frame = useCurrentFrame();
  const big = useIn(8, {stiffness: 170, damping: 12});
  const ticket = useIn(26, ESU.spring.photo);
  const draw = interpolate(frame, [28, 50], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 2});
  const code = 'EARLYBIRD25';
  const typed = Math.floor(interpolate(frame, [34, 58], [0, code.length], clamp));
  const ends = useIn(66, ESU.spring.stat);
  const W = 900;
  const H = 230;
  const tick = frame > 70 ? 1 + Math.sin((frame - 70) / 3.5) * 0.04 : 1;
  const leafIn = useIn(16, ESU.spring.stat);
  const snowIn = useIn(20, ESU.spring.stat);
  return (
    <NavyBg>
      <Polaroids dim={0.55} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 45% at 50% 48%, rgba(11,8,38,0.92) 0%, rgba(11,8,38,0.55) 60%, rgba(11,8,38,0.15) 100%)'}} />
      <Block top={330} gap={6}>
        <Head at={2} size={62} color={YELLOW} style={{letterSpacing: 4}}>
          Also ending Sunday:
        </Head>
      </Block>
      <div style={{position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', transform: `scale(${big})`}}>
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 250, lineHeight: 1, color: '#fff', textShadow: SHADOW}}>
          <span style={{color: YELLOW}}>25%</span> OFF
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18}}>
        <div style={{transform: `scale(${leafIn}) rotate(${Math.sin(frame / 8) * 8}deg)`}}>
          <Leaf size={84} />
        </div>
        <Sub at={14} size={50}>
          Thanksgiving and Winter Camps.
        </Sub>
        <div style={{transform: `scale(${snowIn}) rotate(${frame * 2}deg)`}}>
          <Snowflake size={80} />
        </div>
      </div>
      {/* coupon ticket */}
      <div style={{position: 'absolute', left: (1080 - W) / 2, top: 860, width: W, height: H, opacity: Math.min(1, ticket * 1.5), transform: `translateY(${(1 - ticket) * 80}px) scale(${tick})`}}>
        <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <rect x={4} y={4} width={W - 8} height={H - 8} rx={28} fill="rgba(255,215,0,0.1)" stroke={YELLOW} strokeWidth={8} strokeDasharray="28 16" style={{clipPath: `inset(0 ${100 - draw * 100}% 0 0)`}} />
          <circle cx={4} cy={H / 2} r={28} fill={NAVY_DEEP} />
          <circle cx={W - 4} cy={H / 2} r={28} fill={NAVY_DEEP} />
          <g transform={`translate(${60 + draw * (W - 140)} 4)`} opacity={draw < 1 ? 1 : 0}>
            <circle cx={-10} cy={-12} r={10} fill="none" stroke={YELLOW} strokeWidth={5} />
            <circle cx={-10} cy={14} r={10} fill="none" stroke={YELLOW} strokeWidth={5} />
            <path d="M-2 -6 L26 8 M-2 8 L26 -6" stroke={YELLOW} strokeWidth={5} strokeLinecap="round" />
          </g>
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 140, letterSpacing: 6, color: '#fff', lineHeight: 1}}>
          {code.slice(0, typed)}
          <span style={{opacity: typed < code.length && frame % 10 < 5 ? 1 : 0, color: YELLOW}}>|</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            background: RED,
            color: '#fff',
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 50,
            letterSpacing: 2,
            padding: '6px 28px 10px',
            borderRadius: 14,
            transform: `scale(${ends})`,
          }}
        >
          <svg width={44} height={44} viewBox="-22 -22 44 44">
            <circle r={18} fill="none" stroke="#fff" strokeWidth={4} />
            <path d={`M0 0 L0 -12`} stroke="#fff" strokeWidth={4} strokeLinecap="round" transform={`rotate(${frame * 12})`} />
            <path d="M0 0 L8 4" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
          </svg>
          ENDS SUNDAY
        </div>
      </div>
      <Block top={1250} gap={4}>
        <Sub at={72} size={38} color="rgba(255,255,255,0.9)" style={{fontWeight: 600}}>
          Expires Sunday, October 4, 2026
          <br />
          at 11:59 PM PT.
        </Sub>
      </Block>
    </NavyBg>
  );
};

// ================================================================== 9 · END LOCKUP
const End: React.FC = () => {
  const frame = useCurrentFrame();
  const k = useIn(0, {stiffness: 200, damping: 16});
  const t = useIn(8, ESU.spring.headline);
  return (
    <NavyBg>
      <Polaroids dim={0.35} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, rgba(11,8,38,0.92) 0%, rgba(11,8,38,0.4) 70%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        <Img src={staticFile(LOGO_SRC)} style={{width: 300, height: 300 / LOGO_ASPECT, transform: `scale(${interpolate(k, [0, 1], [2.2, 1])})`, opacity: Math.min(1, frame / 3), filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))'}} />
        <div style={{opacity: Math.min(1, t * 1.4), transform: `translateY(${(1 - t) * 40}px)`, textAlign: 'center'}}>
          <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 92, color: '#fff', lineHeight: 1.05}}>BOOK TONIGHT</div>
          <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 56, color: YELLOW, letterSpacing: 3, marginTop: 6}}>LINK IN BIO ↑</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 30, opacity: Math.min(1, t)}}>
          <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: 'rgba(255,255,255,0.75)'}}>PROUDLY SPONSORED BY</div>
          <Img src={staticFile('logos/wateria-white.svg')} style={{width: 220, height: 220 * (462 / 1800)}} />
        </div>
      </div>
    </NavyBg>
  );
};

// ------------------------------------------------------------------ sound
const SFX_GAIN = 0.5;
const Sfx: React.FC<{at: number; name: string; v?: number}> = ({at, name, v = 0.4}) => (
  <Sequence from={at} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v * SFX_GAIN} />
  </Sequence>
);

const musicVolume = (f: number) => interpolate(f, [0, 3, GLUED_TOTAL - 24, GLUED_TOTAL], [0, 0.5, 0.5, 0], clamp);

const SoundDesign: React.FC = () => (
  <>
    {/* the audio hook: stopwatch racing + the sticky tug of war */}
    {new Array(14).fill(0).map((_, i) => (
      <Sfx key={i} at={i * 6} name="tick" v={0.55} />
    ))}
    <Sfx at={6} name="bloop" v={0.5} />
    <Sfx at={18} name="squeak" v={0.6} />
    <Sfx at={36} name="boing" v={0.5} />
    <Sfx at={56} name="squeak" v={0.6} />
    <Sfx at={74} name="boing" v={0.5} />
    {/* again */}
    <Sfx at={T.again[0]} name="whoosh" v={0.35} />
    <Sfx at={T.again[0] + 22} name="click" v={0.4} />
    <Sfx at={T.again[0] + 44} name="click" v={0.4} />
    <Sfx at={T.again[0] + 60} name="scratch" v={0.6} />
    {/* turn */}
    <Sfx at={T.turn[0]} name="whoosh_long" v={0.5} />
    <Sfx at={T.turn[0] + 21} name="xylo_up" v={0.4} />
    {/* coach */}
    <Sfx at={T.coach[0] + 6} name="swipe" v={0.35} />
    {new Array(8).fill(0).map((_, i) => (
      <Sfx key={`w${i}`} at={T.coach[0] + 46 + i * 7} name="tick" v={0.45} />
    ))}
    {/* split */}
    <Sfx at={T.split[0]} name="swipe" v={0.4} />
    <Sfx at={T.split[0] + 92} name="ding" v={0.35} />
    {/* price */}
    <Sfx at={T.price[0] + 4} name="pop" v={0.35} />
    <Sfx at={T.price[0] + 26} name="pop" v={0.35} />
    <Sfx at={T.price[0] + 50} name="tick" v={0.45} />
    <Sfx at={T.price[0] + 72} name="tada" v={0.4} />
    {/* cta */}
    <Sfx at={T.cta[0] + 4} name="whoosh" v={0.35} />
    <Sfx at={T.cta[0] + 18} name="click" v={0.5} />
    {/* earlybird */}
    <Sfx at={T.early[0]} name="whoosh_long" v={0.4} />
    <Sfx at={T.early[0] + 8} name="boom" v={0.35} />
    <Sfx at={T.early[0] + 34} name="typing" v={0.3} />
    <Sfx at={T.early[0] + 66} name="ding" v={0.4} />
    {/* end */}
    <Sfx at={T.end[0]} name="boom" v={0.45} />
  </>
);

// ------------------------------------------------------------------ the reel
export const ESU_GluedToYourLeg: React.FC = () => {
  const [handle] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    loadAllFonts().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{background: NAVY_DEEP}}>
      <Scene range={T.hook}>
        <Hook />
      </Scene>
      <Scene range={T.again}>
        <Again />
      </Scene>
      <Scene range={T.turn}>
        <Turn />
      </Scene>
      <Scene range={T.coach}>
        <Coach />
      </Scene>
      <Scene range={T.split}>
        <Split />
      </Scene>
      <Scene range={T.price}>
        <Price />
      </Scene>
      <Scene range={T.cta}>
        <Cta />
      </Scene>
      <Scene range={T.early}>
        <Early />
      </Scene>
      <Scene range={T.end}>
        <End />
      </Scene>
      <CornerLogos hideCrest={[[T.end[0], T.end[1] + 10]]} />
      <Grain opacity={0.05} />
      <Audio src={staticFile('audio/music_glued.wav')} volume={musicVolume} />
      <SoundDesign />
    </AbsoluteFill>
  );
};
