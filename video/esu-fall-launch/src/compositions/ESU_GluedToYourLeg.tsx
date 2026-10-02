/**
 * Euro Soccer USA — fall season reel (≈40 s, voiceover + SFX, no music bed: custom music is added later).
 *
 * Goal: book the full fall season tonight (class is tomorrow morning), not a drop-in.
 *  HOOK    whistle + "How old is your kid?" poll (1–3 / 4–7 / 8–12) over a youngest→oldest montage,
 *          every option fills, ALL OF THEM stamp, 12 MONTHS TO 12 YEARS. Every scene below is cut to the VO.
 *  AGAIN   New coach. New kids. Start over… again. (real footage, muted, rewinds on "again")
 *  TURN    colour back: "A few weeks later: they run ahead of you."
 *  COACH   What changed? The same coach. Every week. (coach circle + 8 identical weeks)
 *  SPLIT   DROP-IN vs SEASON
 *  PRICE   $32 a class vs $37.50 ($39 from Monday) → save $56 (+ toddler prices)
 *  CTA     First class is tomorrow morning. Book tonight. Link in bio.
 *  EARLY   EARLYBIRD25: 25% off Thanksgiving and Winter Camps (ends Sunday)
 *  END     Logo lockup + 12 MONTHS – 12 YEARS
 * Narration: scripts/script_glued.json → public/audio/vo_glued.wav + src/timeline_glued.json (scripts/make_vo.py).
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
import tl from '../timeline_glued.json';
import {LOGO_ASPECT, LOGO_SRC} from '../components/ESU_Logo';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const NAVY = ESU.navy;
const NAVY_DEEP = ESU.navyDeep;
const RED = ESU.red;
const YELLOW = ESU.gold;
const HEAD = 'Oswald, sans-serif';
const BODY = 'Montserrat, Poppins, sans-serif';
const SHADOW = '0 4px 26px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.5)';
const MUTED = 'saturate(0.35) contrast(1.05) brightness(0.9)';
const WARM = 'saturate(1.15) contrast(1.06) brightness(1.02)';

// ------------------------------------------------------------------ timeline (driven by the voiceover)
type LineId = (typeof tl.lines)[number]['id'];
const ln = (id: LineId) => tl.lines.find((l) => l.id === id)!;
const Ls = (id: LineId) => Math.round(ln(id).start * FPS);
const Le = (id: LineId) => Math.round(ln(id).end * FPS);
const Wd = (id: LineId, n: number) => Math.round(ln(id).words[Math.min(n, ln(id).words.length - 1)].start * FPS);
const PRE = 6; // picture cuts land just before each narration line

export const GLUED_TOTAL = Math.round(tl.total * FPS);

const T = {
  hook: [0, Ls('again') - PRE],
  again: [Ls('again') - PRE, Ls('turn') - PRE],
  turn: [Ls('turn') - PRE, Ls('coach') - PRE],
  coach: [Ls('coach') - PRE, Ls('split') - PRE],
  split: [Ls('split') - PRE, Ls('price') - PRE],
  price: [Ls('price') - PRE, Ls('cta') - PRE],
  cta: [Ls('cta') - PRE, Ls('early') - PRE],
  early: [Ls('early') - PRE, Ls('end') - PRE],
  end: [Ls('end') - PRE, GLUED_TOTAL],
} as const;
type Seg = keyof typeof T;
const loc = (seg: Seg, abs: number) => abs - T[seg][0];
const LEN = (seg: Seg) => T[seg][1] - T[seg][0];

/** reveal frames, local to each scene, keyed to spoken words */
const V = {
  hook: {o1: Ls('h1'), o2: Ls('h5'), o3: Ls('h12'), stamp: Ls('hookb'), holds: Wd('hookb', 2), end: Le('hookb')},
  again: {coach: loc('again', Wd('again', 0)), kids: loc('again', Wd('again', 2)), start: loc('again', Wd('again', 4)), again: loc('again', Wd('again', 6))},
  turn: {later: loc('turn', Wd('turn', 1)), run: loc('turn', Wd('turn', 5)), ahead: loc('turn', Wd('turn', 7))},
  coach: {what: loc('coach', Wd('coach', 0)), same: loc('coach', Wd('coach', 2)), every: loc('coach', Wd('coach', 5))},
  split: {drop: loc('split', Wd('split', 0)), season: loc('split', Wd('split', 6)), pick: loc('split', Wd('split', 11))},
  price: {drop: loc('price', Wd('price', 6)), monday: loc('price', Wd('price', 9)), save: loc('price', Wd('price', 10))},
  cta: {first: loc('cta', Wd('cta', 0)), book: loc('cta', Wd('cta', 5)), link: loc('cta', Wd('cta', 7))},
  early: {head: loc('early', Wd('early', 0)), off: loc('early', Wd('early', 3)), camps: loc('early', Wd('early', 5)), code: loc('early', Wd('early', 10))},
  end: {tag: loc('end', Wd('end', 3))},
};

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
const FIELD_VOL = 0; // clean bed: no field audio under the VO (custom music goes on top)

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

// ================================================================== 1 · HOOK: "How old is your kid?" (12 months to 12 years)
const AGES = ['1–3 YRS', '4–7 YRS', '8–12 YRS'];
const HOOK = {
  taps: [V.hook.o1 - 2, V.hook.o2 - 2, V.hook.o3 - 2], // a tap per spoken age: "One?" "Five?" "Twelve?"
  fill: V.hook.o3 + 7, // every option lights up
  stamp: V.hook.stamp - 2, // ALL OF THEM
  kicker: V.hook.holds - 2,
  out: T.hook[1] - 10,
};
const CARD_X = 110; // poll card left edge (and right margin)
const CARD_PAD = 34;
const TAP_X = [600, 470, 650]; // where the finger lands on each row (frame x)
/** youngest → oldest under the poll, then the whole group on "all of them" */
const HOOK_SHOTS = [
  {name: 'group_play', from: 0, focus: '50% 40%', to: HOOK.taps[0]},
  {name: 'run_ahead', from: 0.6, focus: '68% 50%', to: HOOK.taps[1]},
  {name: 'alone_ladder', from: 0.5, focus: '62% 50%', to: HOOK.taps[2]},
  {name: 'run_ball', from: 0.2, focus: '88% 50%', to: HOOK.stamp},
  {name: 'coach_circle', from: 1.5, focus: '45% 40%', to: T.hook[1]},
];

const PollRow: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const tap = HOOK.taps[i];
  const ease = (t: number) => 1 - (1 - t) ** 3;
  const sel = interpolate(frame, [tap, tap + 7], [0, 100], {...clamp, easing: ease});
  const all = interpolate(frame, [HOOK.fill + i * 2, HOOK.fill + i * 2 + 6], [0, 100], {...clamp, easing: ease});
  const check = useIn(HOOK.fill + i * 2 + 2, {stiffness: 260, damping: 13});
  const bump = frame >= tap ? 1 + 0.05 * Math.sin(Math.min(1, (frame - tap) / 8) * Math.PI) : 1;
  const ripple = (frame - tap) / 14;
  const finger = interpolate(frame, [tap - 5, tap - 1, tap, tap + 2, tap + 9], [0, 1, 0.8, 1, 0], clamp);
  const rx = TAP_X[i] - CARD_X - CARD_PAD;
  const labelColor = all > 12 ? NAVY : sel > 12 ? '#fff' : NAVY;
  return (
    <div style={{position: 'relative', height: 108, transform: `scale(${bump})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 54, background: '#EEF0F7', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${sel}%`, background: NAVY}} />
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${all}%`, background: YELLOW}} />
        {frame >= tap && ripple < 1 && (
          <div
            style={{
              position: 'absolute',
              left: rx - (40 + 520 * ripple) / 2,
              top: 54 - (40 + 520 * ripple) / 2,
              width: 40 + 520 * ripple,
              height: 40 + 520 * ripple,
              borderRadius: '50%',
              background: `rgba(255,255,255,${0.5 * (1 - ripple)})`,
            }}
          />
        )}
        <div style={{position: 'absolute', left: 44, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: HEAD, fontWeight: 700, fontSize: 60, letterSpacing: 2, color: labelColor}}>
          {AGES[i]}
        </div>
        <div style={{position: 'absolute', right: 20, top: 19, width: 70, height: 70, borderRadius: '50%', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${check})`}}>
          <svg width={40} height={40} viewBox="-20 -20 40 40">
            <path d="M-11 0 L-3 8 L12 -9" stroke={YELLOW} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {finger > 0 && (
        <div
          style={{
            position: 'absolute',
            left: rx - 38,
            top: 54 - 38 + (1 - Math.min(1, finger)) * 40,
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            border: '5px solid rgba(24,17,69,0.25)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
            transform: `scale(${finger})`,
            opacity: Math.min(1, finger * 1.5),
          }}
        />
      )}
    </div>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cuts = [0, ...HOOK.taps, HOOK.stamp];
  const last = cuts.filter((c) => c <= frame).pop() ?? 0;
  const punch = interpolate(frame - last, [0, 6], [1.08, 1], clamp);
  const sat = interpolate(frame, [HOOK.out - 16, T.hook[1]], [1, 0.45], clamp);
  const out = interpolate(frame, [HOOK.out, T.hook[1]], [0, 1], {...clamp, easing: (t) => t * t});
  const slam = interpolate(frame, [0, 5], [1.22, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const card = spring({frame: frame + 9, fps: FPS, config: ESU.spring.photo}); // nearly landed on frame 0
  const st = frame < HOOK.stamp ? 0 : spring({frame: frame - HOOK.stamp, fps: FPS, config: {stiffness: 320, damping: 18}});
  const shake = frame >= HOOK.stamp ? Math.max(0, 1 - (frame - HOOK.stamp) / 10) : 0;
  const sx = (random(`hx${frame}`) - 0.5) * 36 * shake;
  const sy = (random(`hy${frame}`) - 0.5) * 36 * shake;
  const label = useIn(HOOK.stamp + 7, ESU.spring.stat);
  const glow = interpolate(frame, [HOOK.fill, HOOK.fill + 6, HOOK.fill + 16], [0, 1, 0.35], clamp);
  return (
    <AbsoluteFill style={{background: NAVY_DEEP}}>
      <AbsoluteFill style={{transform: `scale(${1.32 * punch})`, transformOrigin: '50% 0%', filter: `saturate(${sat})`}}>
        {HOOK_SHOTS.map((shot, i) => {
          const start = i === 0 ? 0 : HOOK_SHOTS[i - 1].to;
          return (
            <Sequence key={shot.name} from={start} durationInFrames={shot.to - start} layout="none">
              <Clip name={shot.name} frames={shot.to - start} from={shot.from} focus={shot.focus} push={0.1} audio={false} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Scrim top={0.66} bottom={0.6} />
      {cuts.slice(1).map((c) => (
        <Flash key={c} at={c} len={4} />
      ))}
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) translateY(${-out * 260}px) scale(${1 - out * 0.15})`, opacity: 1 - out}}>
        {/* the question, on screen from frame 0 */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 270, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: `scale(${slam})`, fontFamily: HEAD, fontWeight: 700, textTransform: 'uppercase', color: '#fff', textShadow: SHADOW, lineHeight: 1}}>
          <div style={{fontSize: 112}}>How old is</div>
          <div style={{fontSize: 150}}>
            your{' '}
            <span style={{display: 'inline-block', lineHeight: 1.1, background: YELLOW, color: NAVY, padding: '0 0.14em', borderRadius: 12, textShadow: 'none'}}>kid?</span>
          </div>
        </div>
        {/* IG-style poll */}
        <div
          style={{
            position: 'absolute',
            left: CARD_X,
            right: CARD_X,
            top: 640,
            padding: `28px ${CARD_PAD}px ${CARD_PAD}px`,
            background: '#fff',
            borderRadius: 40,
            boxShadow: `0 26px 60px rgba(0,0,0,0.45), 0 0 0 ${10 * glow}px ${YELLOW}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            opacity: Math.min(1, card * 1.6),
            transform: `translateY(${(1 - card) * 220}px) rotate(${(1 - card) * 4}deg)`,
          }}
        >
          <div style={{textAlign: 'center', fontFamily: BODY, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: '#6E7290'}}>TAP YOUR KID'S AGE</div>
          {AGES.map((_, i) => (
            <PollRow key={i} i={i} />
          ))}
        </div>
        {/* ALL OF THEM */}
        {st > 0 && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center'}}>
            <div
              style={{
                fontFamily: HEAD,
                fontWeight: 700,
                fontSize: 150,
                lineHeight: 1,
                letterSpacing: 4,
                color: '#fff',
                background: RED,
                padding: '14px 46px 22px',
                borderRadius: 22,
                outline: '6px solid #fff',
                outlineOffset: -18,
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                transform: `scale(${interpolate(st, [0, 1], [2.6, 1])}) rotate(-8deg)`,
                opacity: Math.min(1, st * 3),
              }}
            >
              ALL OF THEM
            </div>
          </div>
        )}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1160, display: 'flex', justifyContent: 'center'}}>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 56,
              letterSpacing: 3,
              color: YELLOW,
              background: 'rgba(24,17,69,0.92)',
              border: `4px solid ${YELLOW}`,
              padding: '6px 32px 10px',
              borderRadius: 999,
              transform: `scale(${label})`,
            }}
          >
            12 MONTHS TO 12 YEARS
          </div>
        </div>
        <Block top={1290}>
          <Sub at={HOOK.kicker} size={50}>
            Here's what holds them <Hi>all</Hi> back. ↓
          </Sub>
        </Block>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ================================================================== 2 · NEW COACH. NEW KIDS. START OVER. AGAIN.
const Again: React.FC = () => {
  const frame = useCurrentFrame();
  const c1 = V.again.kids - 2;
  const c2 = V.again.start - 2;
  const again = V.again.again + 2; // the rewind lands just after the word
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
          <Clip name="alone_ladder" frames={LEN('again') - c2} rate={0.6} focus="86% 50%" grade={MUTED} push={0.05} reverseAt={again - c2} />
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
          <Sub at={V.again.coach - 2} size={80}>
            New coach.
          </Sub>
          <Sub at={c1} size={80}>
            New kids.
          </Sub>
        </div>
        <div style={{display: 'flex', gap: 22, alignItems: 'center', justifyContent: 'center'}}>
          <Sub at={c2} size={80}>
            Start over.
          </Sub>
          <Sub at={V.again.again - 2} size={80} style={{background: RED, padding: '0 0.3em 0.06em', borderRadius: 14, textShadow: 'none'}}>
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
  const cut = V.turn.ahead + 16; // stay on the run-ahead shot through the line
  const sweep = interpolate(frame, [4, 26], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  return (
    <AbsoluteFill>
      {frame < cut ? (
        <Clip name="run_ahead" frames={cut} rate={0.6} focus="80% 50%" push={0.12} />
      ) : (
        <Sequence from={cut} layout="none">
          <Clip name="run_ball" frames={LEN('turn') - cut} from={0.25} rate={0.8} focus="92% 50%" push={0.08} />
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
      <svg width={1080} height={420} style={{position: 'absolute', left: 0, top: 1290}}>
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
        <Head at={V.turn.later - 2} size={64} color={YELLOW} style={{letterSpacing: 3}}>
          A few weeks later:
        </Head>
        <Head at={V.turn.run - 2} size={128}>
          They run
        </Head>
        <Head at={V.turn.ahead - 2} size={128}>
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
  const tilesAt = V.coach.every + 4;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: 'blur(22px) brightness(0.42) saturate(1.2)', transform: 'scale(1.15)'}}>
        <Clip name="coach_circle" frames={LEN('coach')} from={1} audio={false} push={0} />
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
        <Clip name="coach_circle" frames={LEN('coach')} from={1} focus="45% 40%" push={0.06} />
      </div>
      {/* 8 identical weeks: same coach, same group */}
      <div style={{position: 'absolute', left: 51, top: 1290, display: 'flex', gap: 14}}>
        {new Array(8).fill(0).map((_, i) => {
          const at = tilesAt + i * 5;
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
        <Sub at={V.coach.what - 2} size={68}>
          What changed?
        </Sub>
        <Head at={V.coach.same - 2} size={118}>
          The same coach.
        </Head>
        <Head at={V.coach.every - 2} size={118}>
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
        <Clip name="group_play" frames={frames} rate={0.5} focus="50% 30%" push={0.08} />
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
  const pick = interpolate(frame, [V.split.pick, V.split.pick + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: NAVY_DEEP}}>
      <Half side="l" frames={frames} reveal={l} pick={pick} />
      <Half side="r" frames={frames} reveal={r} pick={pick} />
      <div style={{position: 'absolute', left: 535, top: 0, bottom: 0, width: 10, background: '#fff', opacity: Math.min(l, r) / 100}} />
      <div style={{position: 'absolute', left: 50, width: 450, top: 1150}}>
        <Sub at={V.split.drop + 2} size={48}>
          <span style={{color: '#FF8A8F'}}>Drop-in:</span> a new start each time.
        </Sub>
      </div>
      <div style={{position: 'absolute', left: 590, width: 450, top: 1150}}>
        <Sub at={V.split.season} size={48}>
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
  const b = useIn(V.price.drop - 4, ESU.spring.photo);
  const monday = useIn(V.price.monday - 2, ESU.spring.stat);
  const save = useIn(V.price.save - 2, {stiffness: 160, damping: 11});
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
          $<Count at={V.price.drop} from={32} to={37.5} decimals={2} />,
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
      {/* the reel now speaks to every age, so the toddler price is on screen too ($232 vs 8 × $36 = $288: also $56) */}
      <div style={{position: 'absolute', left: 90, right: 90, top: 1440, textAlign: 'center', fontFamily: BODY, fontWeight: 600, fontSize: 30, lineHeight: 1.35, color: 'rgba(255,255,255,0.8)', opacity: Math.min(1, b * 1.2)}}>
        Prices shown for ages 4–12. Toddlers (12–24 mo):
        <br />
        $29 a class vs. $36 drop-in from Monday.
      </div>
    </NavyBg>
  );
};

// ================================================================== 7 · HARD CTA
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const bar = useIn(4, ESU.spring.photo);
  const pill = useIn(10, ESU.spring.stat);
  const pulse = frame > V.cta.book + 8 ? 1 + Math.sin((frame - V.cta.book - 8) / 4) * 0.035 : 1;
  const arrowIn = useIn(V.cta.link);
  return (
    <AbsoluteFill>
      <Clip name="ball_smile" frames={LEN('cta')} from={0.5} rate={0.45} focus="100% 45%" push={0.07} />
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
        <Head at={V.cta.first} size={58} style={{textShadow: 'none'}}>
          First class is tomorrow morning.
        </Head>
        <div style={{transform: `scale(${pulse})`}}>
          <Head at={V.cta.book - 2} size={156} color={YELLOW} style={{textShadow: '0 6px 0 rgba(0,0,0,0.18)'}}>
            Book tonight.
          </Head>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
          <Head at={V.cta.link - 2} size={62} style={{textShadow: 'none'}}>
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
  const big = useIn(V.early.off - 2, {stiffness: 170, damping: 12});
  const ticket = useIn(V.early.code - 4, ESU.spring.photo);
  const draw = interpolate(frame, [V.early.code - 2, V.early.code + 20], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 2});
  const code = 'EARLYBIRD25';
  const typed = Math.floor(interpolate(frame, [V.early.code + 8, V.early.code + 40], [0, code.length], clamp)); // typed as it is spoken
  const ends = useIn(V.early.code + 44, ESU.spring.stat);
  const W = 900;
  const H = 230;
  const tick = frame > V.early.code + 48 ? 1 + Math.sin((frame - V.early.code - 48) / 3.5) * 0.04 : 1;
  const leafIn = useIn(V.early.camps - 2, ESU.spring.stat);
  const snowIn = useIn(V.early.camps + 2, ESU.spring.stat);
  return (
    <NavyBg>
      <Polaroids dim={0.55} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 45% at 50% 48%, rgba(11,8,38,0.92) 0%, rgba(11,8,38,0.55) 60%, rgba(11,8,38,0.15) 100%)'}} />
      <Block top={330} gap={6}>
        <Head at={V.early.head - 2} size={62} color={YELLOW} style={{letterSpacing: 4}}>
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
        <Sub at={V.early.camps - 2} size={52} style={{textAlign: 'center'}}>
          Thanksgiving and
          <br />
          Winter Camps.
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
        <Sub at={V.early.code + 50} size={38} color="rgba(255,255,255,0.9)" style={{fontWeight: 600}}>
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
  const tag = useIn(V.end.tag - 2, ESU.spring.stat);
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
        <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 50, letterSpacing: 3, color: NAVY, background: YELLOW, padding: '4px 28px 8px', borderRadius: 14, transform: `scale(${tag})`}}>
          AGES 12 MONTHS – 12 YEARS
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

/** absolute frame of a scene-local reveal */
const at = (seg: Seg, f: number) => T[seg][0] + f;

const SoundDesign: React.FC = () => (
  <>
    {/* audio hook: referee whistle on frame 0, then a tap per age, everything lights up, ALL OF THEM slams */}
    <Sfx at={0} name="whistle" v={0.8} />
    {HOOK.taps.map((f) => (
      <React.Fragment key={f}>
        <Sfx at={f} name="pop" v={0.5} />
        <Sfx at={f} name="click" v={0.3} />
      </React.Fragment>
    ))}
    <Sfx at={HOOK.fill} name="xylo_up" v={0.45} />
    <Sfx at={HOOK.stamp} name="boom" v={0.5} />
    <Sfx at={HOOK.stamp} name="kick" v={0.4} />
    <Sfx at={HOOK.stamp + 7} name="swipe" v={0.25} />
    <Sfx at={HOOK.out} name="whoosh" v={0.4} />
    {/* again */}
    <Sfx at={at('again', V.again.kids - 2)} name="click" v={0.4} />
    <Sfx at={at('again', V.again.start - 2)} name="click" v={0.4} />
    <Sfx at={at('again', V.again.again + 2)} name="tape_stop" v={0.4} />
    {/* turn */}
    <Sfx at={T.turn[0]} name="whoosh_long" v={0.5} />
    <Sfx at={at('turn', V.turn.ahead)} name="xylo_up" v={0.35} />
    <Sfx at={at('turn', V.turn.ahead + 16)} name="kick" v={0.45} />
    {/* coach */}
    <Sfx at={at('coach', 6)} name="swipe" v={0.35} />
    {new Array(8).fill(0).map((_, i) => (
      <Sfx key={`w${i}`} at={at('coach', V.coach.every + 4 + i * 5)} name="tick" v={0.4} />
    ))}
    {/* split */}
    <Sfx at={T.split[0]} name="swipe" v={0.4} />
    <Sfx at={at('split', V.split.pick)} name="ding" v={0.35} />
    {/* price */}
    <Sfx at={at('price', 4)} name="pop" v={0.35} />
    <Sfx at={at('price', V.price.drop - 4)} name="pop" v={0.35} />
    <Sfx at={at('price', V.price.monday - 2)} name="tick" v={0.45} />
    <Sfx at={at('price', V.price.save - 2)} name="tada" v={0.4} />
    {/* cta */}
    <Sfx at={at('cta', 4)} name="whoosh" v={0.35} />
    <Sfx at={at('cta', V.cta.book - 2)} name="click" v={0.5} />
    {/* earlybird */}
    <Sfx at={T.early[0]} name="whoosh_long" v={0.4} />
    <Sfx at={at('early', V.early.off - 2)} name="boom" v={0.35} />
    <Sfx at={at('early', V.early.camps - 2)} name="sparkle" v={0.3} />
    <Sfx at={at('early', V.early.code + 8)} name="typing" v={0.3} />
    <Sfx at={at('early', V.early.code + 44)} name="ding" v={0.4} />
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
      {/* no music bed on purpose: custom music is laid in afterwards */}
      <Audio src={staticFile('audio/vo_glued.wav')} />
      <SoundDesign />
    </AbsoluteFill>
  );
};
