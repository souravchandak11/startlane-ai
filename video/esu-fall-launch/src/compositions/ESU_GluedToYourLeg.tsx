/**
 * Euro Soccer USA — "Glued to your leg" (Fall season, 32 s, text-carried, no voiceover).
 *
 * Goal: book the full fall season this weekend, not a drop-in.
 * Pain (clinging) → outcome (runs ahead) → why the season works (same coach, same group)
 * → price card → FALL15 → hard CTA (class is tomorrow) → EARLYBIRD25 for 2 s.
 *
 * Real Weekend Academy footage only. Clips live in public/footage/glued/ and are found by
 * scripts/scan_glued.mjs; trims/framing in src/glued/cuts.json. A missing clip renders as a
 * labelled placeholder slate so the reel always builds.
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
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ESU, FPS} from '../presets/brand';
import {loadAllFonts} from '../presets/fonts';
import {CornerLogos} from '../components/ESU_Footage';
import {LOGO_ASPECT, LOGO_SRC} from '../components/ESU_Logo';
import mediaJson from '../glued/media.json';
import cutsJson from '../glued/cuts.json';

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

// ------------------------------------------------------------------ timeline (brief)
const T = {
  leg: [0, S(3)],
  watch: [S(3), S(6)],
  run: [S(6), S(10)],
  coach: [S(10), S(14)],
  split: [S(14), S(19)],
  price: [S(19), S(23)],
  coupon: [S(23), S(27)],
  cta: [S(27), S(30)],
  end: [S(30), S(32)],
} as const;

type Slot = 'leg' | 'watch' | 'run' | 'coach' | 'alone' | 'group' | 'ball';
type Media = {file: string; duration: number; fps: number; w: number; h: number; audio: boolean};
const MEDIA = mediaJson as Partial<Record<Slot, Media>>;
const CUTS = cutsJson as Record<Slot, {in: number; focus: string; rate: number}>;

const SLOT_INFO: Record<Slot, {n: number; what: string}> = {
  leg: {n: 1, what: "Kid holding a parent's leg or hand at the edge of the field"},
  watch: {n: 2, what: 'Same kid watching the others, not joining'},
  run: {n: 3, what: 'Kid running onto the field ahead of the parent'},
  coach: {n: 4, what: "Coach crouched at the kid's level: high five or fist bump"},
  alone: {n: 5, what: 'One kid alone (DROP-IN side)'},
  group: {n: 6, what: 'The group together (SEASON side)'},
  ball: {n: 7, what: 'Kid smiling with the ball'},
};

/** field audio sits under the light track */
const FIELD_VOL = 0.32;

// ------------------------------------------------------------------ footage
const Placeholder: React.FC<{slot: Slot; compact?: boolean}> = ({slot, compact}) => {
  const info = SLOT_INFO[slot];
  return (
    <AbsoluteFill
      style={{
        background: `repeating-linear-gradient(135deg, #141a3d 0 26px, #10153300 26px 52px), linear-gradient(180deg, #1b2150, #0c1030)`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{position: 'absolute', inset: compact ? 18 : 28, border: '4px dashed rgba(255,255,255,0.28)', borderRadius: 26}} />
      <div style={{position: 'absolute', top: compact ? 700 : 1020, left: 40, right: 40, textAlign: 'center'}}>
        <svg width={compact ? 70 : 96} height={compact ? 52 : 70} viewBox="0 0 96 70">
          <rect x={4} y={14} width={66} height={50} rx={10} fill="none" stroke={YELLOW} strokeWidth={5} />
          <path d="M70 30 L92 18 L92 60 L70 48 Z" fill="none" stroke={YELLOW} strokeWidth={5} strokeLinejoin="round" />
        </svg>
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: compact ? 24 : 28, letterSpacing: 4, color: YELLOW, marginTop: 10}}>
          PLACEHOLDER · REAL FOOTAGE {info.n}
        </div>
        <div style={{fontFamily: BODY, fontWeight: 600, fontSize: compact ? 28 : 36, color: 'rgba(255,255,255,0.82)', marginTop: 10, lineHeight: 1.25}}>
          {info.what}
        </div>
        <div style={{fontFamily: BODY, fontWeight: 500, fontSize: compact ? 22 : 26, color: 'rgba(255,255,255,0.5)', marginTop: 10}}>
          public/footage/glued/{slot}.mp4
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** A real clip for one slot, trimmed by cuts.json, slowed (min 0.5×) or held if it's short. */
const Shot: React.FC<{slot: Slot; frames: number; grade?: string; push?: number; compact?: boolean}> = ({
  slot,
  frames,
  grade = 'saturate(1.08) contrast(1.04)',
  push = 0.06,
  compact,
}) => {
  const frame = useCurrentFrame();
  const m = MEDIA[slot];
  const scale = interpolate(frame, [0, frames], [1, 1 + push], clamp);
  if (!m) return <Placeholder slot={slot} compact={compact} />;
  const cut = CUTS[slot];
  const avail = Math.max(1, Math.floor((m.duration - cut.in) * FPS) - 1);
  const rate = Math.max(0.5, Math.min(cut.rate, avail / frames));
  const playFrames = Math.min(frames, Math.floor(avail / rate));
  const fade = (f: number) => interpolate(f, [0, 3, frames - 3, frames], [0, 1, 1, 0], clamp) * FIELD_VOL;
  const video = (
    <OffthreadVideo
      src={staticFile(m.file)}
      startFrom={Math.round(cut.in * FPS)}
      playbackRate={rate}
      volume={m.audio ? fade : 0}
      muted={!m.audio}
      style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: cut.focus, filter: grade}}
    />
  );
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        <Sequence durationInFrames={playFrames} layout="none">
          {video}
        </Sequence>
        {playFrames < frames && (
          <Sequence from={playFrames} layout="none">
            <Freeze frame={playFrames - 1}>{video}</Freeze>
          </Sequence>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** legibility scrims: navy at the top (headlines) and bottom */
const Scrim: React.FC<{top?: number; bottom?: number}> = ({top = 0.7, bottom = 0.55}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(11,8,38,${top}) 0%, rgba(11,8,38,${top * 0.6}) 30%, rgba(11,8,38,0) 48%, rgba(11,8,38,0) 62%, rgba(11,8,38,${bottom}) 100%)`,
    }}
  />
);

// ------------------------------------------------------------------ type
const useIn = (at: number, cfg: {stiffness: number; damping: number} = ESU.spring.headline) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame < at ? 0 : spring({frame: frame - at, fps, config: cfg});
};

/** Oswald uppercase headline line: slides up 60px + fades in (instant when at<=0) */
const Head: React.FC<{at: number; size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
  at,
  size = 112,
  color = '#fff',
  children,
  style,
}) => {
  const k = useIn(at);
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
        opacity: Math.min(1, shown * 1.4),
        transform: `translateY(${(1 - shown) * 60}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Montserrat sentence-case line */
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
        transform: `translateY(${(1 - k) * 40}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Hi: React.FC<{children: React.ReactNode; bg?: string; color?: string}> = ({children, bg = YELLOW, color = NAVY}) => (
  <span style={{background: bg, color, padding: '0 0.16em', borderRadius: 6, textShadow: 'none', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>
    {children}
  </span>
);

const Block: React.FC<{top: number; children: React.ReactNode; align?: 'center' | 'left'; gap?: number}> = ({top, children, align = 'center', gap = 18}) => (
  <div style={{position: 'absolute', left: 60, right: 60, top, textAlign: align, display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap}}>
    {children}
  </div>
);

// ------------------------------------------------------------------ scenes
const Scene: React.FC<{range: readonly [number, number]; children: React.ReactNode}> = ({range, children}) => (
  <Sequence from={range[0]} durationInFrames={range[1] - range[0]}>
    {children}
  </Sequence>
);

const MUTED = 'saturate(0.55) contrast(1.02) brightness(0.96)';

const Leg: React.FC = () => (
  <AbsoluteFill>
    <Shot slot="leg" frames={T.leg[1] - T.leg[0]} grade={MUTED} />
    <Scrim />
    <Block top={340} gap={16}>
      <Head at={0} size={100} style={{whiteSpace: 'nowrap'}}>
        Every new thing,
      </Head>
      <Head at={0} size={86} style={{whiteSpace: 'nowrap'}}>
        the first <Hi>20 minutes</Hi>
      </Head>
      <Head at={0} size={100} style={{whiteSpace: 'nowrap'}}>
        look like this.
      </Head>
    </Block>
  </AbsoluteFill>
);

const Watch: React.FC = () => {
  const lines: [string, number][] = [
    ['New coach.', 4],
    ['New kids.', 18],
    ['Start over.', 34],
  ];
  return (
    <AbsoluteFill>
      <Shot slot="watch" frames={T.watch[1] - T.watch[0]} grade={MUTED} />
      <Scrim />
      <Block top={360}>
        <div style={{display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center'}}>
          {lines.slice(0, 2).map(([t, at]) => (
            <Sub key={t} at={at} size={78}>
              {t}
            </Sub>
          ))}
        </div>
        <div style={{display: 'flex', gap: 22, alignItems: 'center', justifyContent: 'center'}}>
          <Sub at={lines[2][1]} size={78}>
            {lines[2][0]}
          </Sub>
          <Sub at={54} size={78} style={{background: RED, padding: '0 0.3em 0.06em', borderRadius: 14, textShadow: 'none', transform: undefined}}>
            Again.
          </Sub>
        </div>
      </Block>
    </AbsoluteFill>
  );
};

const Run: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 1, 6], [0, 0.85, 0], clamp);
  return (
    <AbsoluteFill>
      <Shot slot="run" frames={T.run[1] - T.run[0]} push={0.08} />
      <Scrim top={0.62} />
      <Block top={350}>
        <Head at={6} size={62} color={YELLOW} style={{letterSpacing: 3}}>
          A few weeks later:
        </Head>
        <Head at={14} size={124}>
          They run
        </Head>
        <Head at={20} size={124}>
          <Hi>ahead</Hi> of you.
        </Head>
      </Block>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

const Coach: React.FC = () => (
  <AbsoluteFill>
    <Shot slot="coach" frames={T.coach[1] - T.coach[0]} />
    <Scrim />
    <Block top={350}>
      <Sub at={4} size={66}>
        What changed?
      </Sub>
      <Head at={24} size={116}>
        The same coach.
      </Head>
      <Head at={46} size={116}>
        <Hi bg={RED} color="#fff">
          Every week.
        </Hi>
      </Head>
    </Block>
  </AbsoluteFill>
);

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
        filter: left ? `saturate(${1 - 0.6 * pick}) brightness(${1 - 0.18 * pick})` : undefined,
      }}
    >
      <Shot slot={left ? 'alone' : 'group'} frames={frames} compact />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,8,38,0.65) 0%, rgba(11,8,38,0) 30%, rgba(11,8,38,0) 55%, rgba(11,8,38,0.85) 100%)'}} />
      <div style={{position: 'absolute', top: 340, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 74,
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
      {!left && pick > 0 && <AbsoluteFill style={{boxShadow: `inset 0 0 0 ${10 * pick}px ${YELLOW}`}} />}
    </div>
  );
};

const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const frames = T.split[1] - T.split[0];
  const l = interpolate(frame, [0, 10], [0, 100], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const r = interpolate(frame, [8, 18], [0, 100], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const pick = interpolate(frame, [96, 106], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: NAVY_DEEP}}>
      <Half side="l" frames={frames} reveal={l} pick={pick} />
      <Half side="r" frames={frames} reveal={r} pick={pick} />
      <div style={{position: 'absolute', left: 535, top: 0, bottom: 0, width: 10, background: '#fff', opacity: Math.min(l, r) / 100}} />
      <div style={{position: 'absolute', left: 50, width: 450, top: 1150}}>
        <Sub at={34} size={46}>
          <span style={{color: '#FF8A8F'}}>Drop-in:</span> a new start each time.
        </Sub>
      </div>
      <div style={{position: 'absolute', left: 590, width: 450, top: 1150}}>
        <Sub at={54} size={46}>
          <span style={{color: YELLOW}}>Season:</span> same coach, same group, 8 weeks.
        </Sub>
      </div>
    </AbsoluteFill>
  );
};

/** navy card background: soft stripes + slow gradient drift */
const NavyCard: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(${160 + frame * 0.5}deg, #221a5e 0%, ${NAVY} 45%, ${NAVY_DEEP} 100%)`}}>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 18px, rgba(255,255,255,0) 18px 36px)'}} />
      {children}
    </AbsoluteFill>
  );
};

/** number that springs from `from` to `to` (drop-in rises from the season price) */
const Count: React.FC<{at: number; from: number; to: number; decimals?: number}> = ({at, from, to, decimals = 0}) => {
  const k = useIn(at, ESU.spring.stat);
  return <>{(from + (to - from) * Math.min(1, k)).toFixed(decimals)}</>;
};

const Price: React.FC = () => {
  const a = useIn(4, ESU.spring.photo);
  const b = useIn(28, ESU.spring.photo);
  const monday = useIn(56, ESU.spring.stat);
  const tile = (k: number, border: string): React.CSSProperties => ({
    position: 'absolute',
    left: 80,
    right: 80,
    borderRadius: 34,
    border: `5px solid ${border}`,
    background: 'rgba(255,255,255,0.04)',
    padding: '34px 46px',
    opacity: Math.min(1, k * 1.5),
    transform: `translateY(${(1 - k) * 80}px)`,
  });
  return (
    <NavyCard>
      <div style={{...tile(a, YELLOW), top: 420}}>
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 66, color: YELLOW, letterSpacing: 2}}>SEASON:</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
          <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 230, color: '#fff', lineHeight: 1}}>
            $32
          </div>
          <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 72, color: '#fff'}}>A CLASS.</div>
        </div>
      </div>
      <div style={{...tile(b, 'rgba(255,255,255,0.55)'), top: 900}}>
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 66, color: 'rgba(255,255,255,0.8)', letterSpacing: 2}}>DROP-IN:</div>
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 170, color: '#fff', lineHeight: 1}}>
          $<Count at={30} from={32} to={37.5} decimals={2} />,
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 18,
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 64,
            color: '#fff',
            background: RED,
            padding: '2px 26px 6px',
            borderRadius: 14,
            transform: `scale(${monday})`,
            transformOrigin: '0% 50%',
          }}
        >
          <svg width={44} height={50} viewBox="0 0 44 50">
            <path d="M22 4 L40 26 H29 V46 H15 V26 H4 Z" fill="#fff" />
          </svg>
          AND $39 FROM MONDAY.
        </div>
      </div>
    </NavyCard>
  );
};

const Coupon: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 2});
  const code = 'FALL15';
  const typed = Math.floor(interpolate(frame, [8, 22], [0, code.length], clamp));
  const strike = interpolate(frame, [48, 56], [0, 1], clamp);
  const W = 860;
  const H = 300;
  const per = 2 * (W + H);
  const pulse = frame > 30 ? 1 + Math.sin((frame - 30) / 5) * 0.012 : 1;
  const was = useIn(40);
  return (
    <NavyCard>
      <div style={{position: 'absolute', left: (1080 - W) / 2, top: 400, width: W, height: H, transform: `scale(${pulse})`}}>
        <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <rect
            x={4}
            y={4}
            width={W - 8}
            height={H - 8}
            rx={30}
            fill="rgba(255,215,0,0.08)"
            stroke={YELLOW}
            strokeWidth={8}
            strokeDasharray="30 18"
            strokeDashoffset={0}
            style={{clipPath: `inset(0 ${100 - draw * 100}% 0 0)`}}
          />
          {/* coupon notches */}
          <circle cx={4} cy={H / 2} r={30} fill={NAVY} />
          <circle cx={W - 4} cy={H / 2} r={30} fill={NAVY} />
          {/* scissors */}
          <g transform={`translate(${70 + draw * 120} 4)`} opacity={draw < 1 ? 1 : 0}>
            <circle cx={-10} cy={-12} r={10} fill="none" stroke={YELLOW} strokeWidth={5} />
            <circle cx={-10} cy={14} r={10} fill="none" stroke={YELLOW} strokeWidth={5} />
            <path d="M-2 -6 L26 8 M-2 8 L26 -6" stroke={YELLOW} strokeWidth={5} strokeLinecap="round" />
          </g>
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 200,
            letterSpacing: 10,
            color: YELLOW,
            lineHeight: 1,
          }}
        >
          {code.slice(0, typed)}
          <span style={{opacity: typed < code.length && frame % 10 < 5 ? 1 : 0}}>|</span>
        </div>
      </div>
      <Block top={760}>
        <Head at={24} size={76}>
          = 15% off the full season.
        </Head>
      </Block>
      <div style={{position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 24}}>
        <div style={{position: 'relative', fontFamily: HEAD, fontWeight: 700, fontSize: 88, color: 'rgba(255,255,255,0.55)', opacity: Math.min(1, was * 1.5)}}>
          $32
          <div style={{position: 'absolute', left: -6, right: -6, top: '52%', height: 9, background: RED, transform: `scaleX(${strike})`, transformOrigin: '0% 50%', borderRadius: 4}} />
        </div>
        <Head at={52} size={156} color={YELLOW}>
          $27.20
        </Head>
        <Sub at={58} size={54}>
          a class.
        </Sub>
      </div>
      <Block top={1215}>
        <Sub at={66} size={38} color="rgba(255,255,255,0.85)" style={{fontWeight: 600}}>
          Expires Sunday, October 4, 2026
          <br />
          at 11:59 PM PT.
        </Sub>
      </Block>
    </NavyCard>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const bar = useIn(4, ESU.spring.photo);
  const pulse = frame > 34 ? 1 + Math.sin((frame - 34) / 4) * 0.035 : 1;
  const arrow = Math.sin(frame / 4) * 8;
  const arrowIn = useIn(26);
  return (
    <AbsoluteFill>
      <Shot slot="ball" frames={T.cta[1] - T.cta[0]} push={0.05} />
      <Scrim top={0.45} bottom={0.3} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1040,
          padding: '34px 50px 40px',
          background: RED,
          boxShadow: '0 -10px 40px rgba(0,0,0,0.35)',
          transform: `translateY(${(1 - bar) * 520}px)`,
          textAlign: 'center',
        }}
      >
        <Head at={10} size={58} style={{textShadow: 'none', whiteSpace: 'nowrap'}}>
          First class is tomorrow morning.
        </Head>
        <div style={{transform: `scale(${pulse})`}}>
          <Head at={18} size={150} color={YELLOW} style={{textShadow: '0 6px 0 rgba(0,0,0,0.18)'}}>
            Book tonight.
          </Head>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
          <Head at={26} size={62} style={{textShadow: 'none'}}>
            Link in bio.
          </Head>
          <svg width={46} height={52} viewBox="0 0 44 50" style={{transform: `translateY(${-arrow}px)`, opacity: Math.min(1, arrowIn * 1.4)}}>
            <path d="M22 4 L40 26 H29 V46 H15 V26 H4 Z" fill="#fff" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const k = useIn(0, ESU.spring.photo);
  const ballFrames = T.cta[1] - T.cta[0];
  return (
    <AbsoluteFill>
      {/* last frame of the CTA shot, blurred, under the card */}
      <AbsoluteFill style={{filter: 'blur(14px) brightness(0.55)', transform: 'scale(1.08)'}}>
        <Freeze frame={ballFrames - 1}>
          <Shot slot="ball" frames={ballFrames} push={0.05} />
        </Freeze>
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 520,
          padding: '40px 46px 46px',
          borderRadius: 36,
          background: NAVY,
          border: '4px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
          textAlign: 'center',
          opacity: Math.min(1, k * 1.6),
          transform: `scale(${0.9 + 0.1 * k})`,
        }}
      >
        <Img src={staticFile(LOGO_SRC)} style={{width: 120, height: 120 / LOGO_ASPECT, marginBottom: 14}} />
        <div style={{fontFamily: BODY, fontWeight: 800, fontSize: 44, color: YELLOW}}>Also ending Sunday:</div>
        <div
          style={{
            display: 'inline-block',
            margin: '18px 0 16px',
            padding: '4px 34px 10px',
            border: `6px dashed ${YELLOW}`,
            borderRadius: 22,
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 110,
            letterSpacing: 6,
            color: '#fff',
            lineHeight: 1.05,
          }}
        >
          EARLYBIRD25
        </div>
        <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 42, color: '#fff', lineHeight: 1.25}}>
          25% off Thanksgiving
          <br />
          and Winter Camps.
        </div>
        <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 36, color: 'rgba(255,255,255,0.78)', marginTop: 16, lineHeight: 1.3}}>
          Expires Sunday, October 4, 2026
          <br />
          at 11:59 PM PT.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ sound
const SFX_GAIN = 0.5;
const Sfx: React.FC<{at: number; name: string; v?: number}> = ({at, name, v = 0.4}) => (
  <Sequence from={at} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v * SFX_GAIN} />
  </Sequence>
);

const musicVolume = (f: number) => interpolate(f, [0, 4, GLUED_TOTAL - 30, GLUED_TOTAL], [0, 0.5, 0.5, 0], clamp);

// ------------------------------------------------------------------ the reel
export const ESU_GluedToYourLeg: React.FC = () => {
  const [handle] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    loadAllFonts().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{background: NAVY_DEEP}}>
      <Scene range={T.leg}>
        <Leg />
      </Scene>
      <Scene range={T.watch}>
        <Watch />
      </Scene>
      <Scene range={T.run}>
        <Run />
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
      <Scene range={T.coupon}>
        <Coupon />
      </Scene>
      <Scene range={T.cta}>
        <Cta />
      </Scene>
      <Scene range={T.end}>
        <EndCard />
      </Scene>
      <CornerLogos hideCrest={[[T.end[0], T.end[1] + 10]]} />
      <Audio src={staticFile('audio/music_glued.wav')} volume={musicVolume} />
      <Sfx at={T.run[0]} name="whoosh" v={0.45} />
      <Sfx at={T.split[0]} name="swipe" v={0.35} />
      <Sfx at={T.price[0] + 4} name="pop" v={0.3} />
      <Sfx at={T.price[0] + 28} name="pop" v={0.3} />
      <Sfx at={T.price[0] + 56} name="tick" v={0.4} />
      <Sfx at={T.coupon[0] + 22} name="ding" v={0.35} />
      <Sfx at={T.cta[0] + 4} name="whoosh" v={0.3} />
      <Sfx at={T.cta[0] + 18} name="click" v={0.45} />
      <Sfx at={T.end[0]} name="swipe" v={0.3} />
    </AbsoluteFill>
  );
};
