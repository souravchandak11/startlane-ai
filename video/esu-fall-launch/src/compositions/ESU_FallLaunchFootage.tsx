/**
 * Euro Soccer USA — Fall Academy launch reel, FOOTAGE CUT.
 *
 * Real footage (5 OmniFlash clips in public/footage) carries the whole 48 s,
 * cut on voiceover words; Metro-Media-House graphics sit on top and between:
 * glowing serif type, paper-stage prints, white pop-up cards, chalk tactics,
 * news-clip highlighter, glitch/flash/block-wipe transitions, corner logos.
 *
 * Source shot maps (scene-detected, seconds):
 *  sofa   A face 0–.46 · B thumbs .46–.96 · C room+ball .96–1.58 · D mom 1.58–2.79 · E hand-over 2.79–3.46
 *         F boy+tablet 3.46–4.17 · G pull-back→print 4.17–5.58 · H B&W room+clock 5.58–6.50 · I B&W wide 6.50–7.38
 *         J B&W phone pulses 7.38–8.71 · K B&W eyes 8.71–10
 *  kick   A mom+phone 0–1.12 · B head in hand 1.12–2.08 · C print of boy 2.08–2.67 · D devices 2.67–4.96
 *         E boy silhouette 4.96–6.42 · F eye 6.42–6.83 · G lawn 6.83–7.25 · H cleats 7.25–7.75 · I garage ball 7.75–9.17 · J COLOUR kick 9.17–10
 *  match  A sprint .0–.79 · B coach fist-bump .79–2.29 · C aerial 2.29–4.58 · D mom sideline 4.58–6.08 · E cones 6.08–7.62 · F drill 7.62–10
 *  winning A discs .04–1.0 · B photo cloud 1.0–1.67 · C high-fives 1.67–2.46 · D field timelapse 2.46–3.29 · E shot on goal 3.29–4.25
 *          F medal 4.25–5.04 · G juggling 5.04–5.96 · H sunset palms 5.96–6.79 · I silhouettes 6.79–8
 *  prep   bed 0–1.79 · car 1.79–3.17 · book 3.17–4.17 · walk 4.17–10
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ESU, FPS} from '../presets/brand';
import {FONT, loadAllFonts} from '../presets/fonts';
import timeline from '../timeline.json';
import {ESUCaptions} from '../components/ESU_Captions';
import {Burst, Camera, ColorFlood, Flash, Grain, Sfx, Shockwave} from '../components/ESU_Fx';
import {Chat, ScreenTimeCard, SearchBar} from '../components/ESU_UI';
import {ESULogo} from '../components/ESU_Logo';
import {GlitchCut, Mono, NewsClip, Stepped, WhiteCard} from '../components/ESU_Type';
import {BlockWipe, ChalkBoard, InvertFlash, PaperStage, Print} from '../components/ESU_Paper';
import {Clip, CornerLogos, photo, PHOTOS, Slot, SponsorLockup} from '../components/ESU_Footage';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ------------------------------------------------------------------ timeline helpers
type LineId = (typeof timeline.lines)[number]['id'];
const line = (id: LineId) => timeline.lines.find((l) => l.id === id)!;
const L = (id: LineId) => Math.round(line(id).start * FPS);
const E = (id: LineId) => Math.round(line(id).end * FPS);
const W = (id: LineId, n: number) => Math.round(line(id).words[Math.min(n, line(id).words.length - 1)].start * FPS);
export const FOOTAGE_TOTAL = Math.round(timeline.total * FPS);
const WORD_FRAMES = timeline.lines.flatMap((l) => l.words.map((w) => Math.round(w.start * FPS)));

// key beats (absolute frames)
const B = {
  sat: W('hook1', 5),
  mom: L('hook2'),
  hook3: L('hook3'),
  boyTab: W('hook3', 3),
  inline: W('hook3', 5),
  nineAm: L('pain1'),
  nineB: W('pain1', 3),
  nineC: W('pain1', 5) + 6,
  bored: L('pain2'),
  eyes: W('pain2', 4),
  google: L('pain3'),
  googleB: W('pain3', 5),
  again: W('pain3', 9),
  news: L('pain4'),
  devices: W('pain4', 9),
  bigNum: W('pain4', 12) + 4,
  every: W('pain4', 13),
  single: W('pain4', 14),
  day: W('pain4', 15),
  gasp: E('pain4') + 4,
  question: L('turn1'),
  drop: W('turn1', 4),
  team: W('turn1', 6),
  coach: W('turn1', 8),
  reveal: L('sol1'),
  facts: L('sol2'),
  cones: W('sol2', 5),
  euro: L('sol3'),
  drill: W('sol3', 3),
  proof1: L('sol4'),
  proof2: W('sol4', 4),
  proof3: W('sol4', 7),
  weeks: L('out1'),
  weeksClip: L('out1') + 24,
  conf: L('out2'),
  friends: W('out2', 2),
  skills: W('out2', 4),
  callback: L('out3'),
  cta: L('cta1'),
  logo: FOOTAGE_TOTAL - 40,
  end: FOOTAGE_TOTAL,
};

// ------------------------------------------------------------------ shot wrapper
const Shot: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
  push?: number;
  shakes?: number[];
  cuts?: {at: number; scale: number; x?: number; y?: number}[];
  mono?: boolean;
  stepped?: boolean;
  overlay?: React.ReactNode;
  bumps?: boolean;
}> = ({from, to, children, push = 0.06, shakes, cuts, mono, stepped, overlay, bumps = true}) => {
  const rel = (f: number) => f - from;
  let body = (
    <Camera
      durationInFrames={to - from}
      push={push}
      shakes={shakes?.map(rel)}
      cuts={cuts?.map((c) => ({...c, at: rel(c.at)}))}
      bumps={bumps ? WORD_FRAMES.filter((f) => f > from + 2 && f < to).map(rel) : []}
    >
      {children}
    </Camera>
  );
  if (stepped) body = <Stepped>{body}</Stepped>;
  if (mono) body = <Mono>{body}</Mono>;
  return (
    <Sequence from={from} durationInFrames={to - from} name={`shot@${from}`}>
      {body}
      {overlay}
    </Sequence>
  );
};

/** Footage shot: `slot` from `inSec`, optionally re-timed to fill the slot exactly. */
const F: React.FC<{slot: Slot; inSec: number; outSec?: number; frames?: number; grade?: 'warm' | 'mono'; scrim?: 'top' | 'bottom' | 'both' | 'none'; pos?: string}> = ({
  slot,
  inSec,
  outSec,
  frames,
  grade = 'warm',
  scrim = 'both',
  pos,
}) => {
  // speed so the source segment [inSec, outSec] exactly fills `frames` (never faster than 1.15×)
  const rate = outSec && frames ? Math.min(1.15, (outSec - inSec) / (frames / FPS)) : 1;
  return <Clip slot={slot} inSec={inSec} rate={rate} grade={grade} scrim={scrim} objectPosition={pos} />;
};

const Center: React.FC<{children: React.ReactNode; y?: number}> = ({children, y = 0.4}) => (
  <AbsoluteFill style={{alignItems: 'center'}}>
    <div style={{position: 'absolute', top: `${y * 100}%`, transform: 'translateY(-50%)'}}>{children}</div>
  </AbsoluteFill>
);

const emoji = (code: string, size = 56) => <Img src={staticFile(`emoji/${code}.svg`)} style={{width: size, height: size}} />;

// ------------------------------------------------------------------ overlays
/** Glowing serif / grotesk words that fade up on their frames (MMH type over footage). */
const TypeOver: React.FC<{
  words: {t: string; at: number; big?: boolean; flip?: number; br?: boolean}[];
  y?: number;
  size?: number;
  serif?: boolean;
  color?: string;
  glow?: boolean;
}> = ({words, y = 0.7, size = 110, serif = true, color = ESU.white, glow = true}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: `${y * 100}%`,
          transform: 'translateY(-50%)',
          width: 980,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: '0 24px',
          textAlign: 'center',
        }}
      >
        {words.map((w, i) => {
          const d = frame - w.at;
          return (
            <React.Fragment key={i}>
              {w.br && <div style={{flexBasis: '100%', height: 0}} />}
              <span
                style={{
                  fontFamily: serif ? FONT.serif : FONT.ui,
                  fontStyle: serif ? 'italic' : 'normal',
                  fontWeight: serif ? 400 : 700,
                  fontSize: w.big ? size * 1.7 : size,
                  lineHeight: 1.02,
                  letterSpacing: interpolate(d, [-1, 10], [serif ? 8 : 12, serif ? -1 : -3], clamp),
                  color: w.flip !== undefined && d >= w.flip ? ESU.red : color,
                  opacity: interpolate(d, [-1, 4], [0, 1], clamp),
                  transform: `translateY(${interpolate(d, [-1, 6], [14, 0], clamp)}px)`,
                  textShadow: glow ? '0 0 34px rgba(255,255,255,0.45), 0 6px 34px rgba(0,0,0,0.75)' : '0 6px 30px rgba(0,0,0,0.7)',
                }}
              >
                {w.t}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** One big word slammed over a footage frame (supercut). */
const SlamWord: React.FC<{t: string; red?: boolean}> = ({t, red}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {stiffness: 420, damping: 18}});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 800,
          fontSize: 250,
          letterSpacing: -10,
          color: red && frame >= 3 ? ESU.red : ESU.white,
          transform: `scale(${interpolate(s, [0, 1], [1.5, 1])})`,
          textShadow: '0 10px 60px rgba(0,0,0,0.7)',
        }}
      >
        {t}
      </div>
    </AbsoluteFill>
  );
};

/** White notification cards stacking over footage. */
const NotifStack: React.FC<{notes: {icon: string; app: string; text: string; at: number}[]; top?: number}> = ({notes, top = 360}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top, display: 'flex', flexDirection: 'column', gap: 16, width: 900}}>
        {notes.map((n, i) => {
          if (frame < n.at) return null;
          const p = spring({frame: frame - n.at, fps, config: {stiffness: 300, damping: 20}});
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                padding: '22px 26px',
                borderRadius: 34,
                background: 'rgba(255,255,255,0.97)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
                transform: `translateY(${(1 - p) * -60}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
                opacity: p,
                fontFamily: FONT.ui,
                color: '#111',
              }}
            >
              <div style={{width: 72, height: 72, borderRadius: 18, background: '#f1f1f3', display: 'grid', placeItems: 'center', flexShrink: 0}}>
                {emoji(n.icon, 46)}
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 700}}>
                  <span>{n.app}</span>
                  <span style={{opacity: 0.5, fontWeight: 500}}>now</span>
                </div>
                <div style={{fontSize: 32, opacity: 0.85, marginTop: 2}}>{n.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Game-UI stat chip over footage: label, filling bar, count-up value. */
const StatChip: React.FC<{label: string; from: number; to: number; icon: string}> = ({label, from, to, icon}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {stiffness: 220, damping: 20}});
  const k = interpolate(frame, [4, 20], [0, 1], {...clamp, easing: (x) => 1 - (1 - x) ** 3});
  const v = Math.round(from + (to - from) * k);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 330,
          width: 860,
          padding: '26px 34px',
          borderRadius: 30,
          background: 'rgba(11,8,38,0.72)',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          transform: `translateY(${(1 - p) * -40}px)`,
          opacity: p,
          fontFamily: FONT.ui,
          color: ESU.white,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          {emoji(icon, 54)}
          <div style={{fontWeight: 800, fontSize: 44, letterSpacing: 2, flex: 1}}>{label}</div>
          <div style={{fontFamily: FONT.stat, fontWeight: 700, fontSize: 84, lineHeight: 1, color: ESU.gold}}>{v}</div>
          <div style={{fontSize: 44, color: '#4ade80', opacity: k}}>▲</div>
        </div>
        <div style={{marginTop: 16, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.15)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${(from + (to - from) * k)}%`, background: ESU.gradient.gold, borderRadius: 9}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Floating chat bubbles over live footage. */
const FloatingChat: React.FC<{a: number}> = ({a}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bubble = (text: string, at: number, me = false, big = false) => {
    if (frame < at) return null;
    const p = spring({frame: frame - at, fps, config: {stiffness: 420, damping: 18}});
    return (
      <div
        style={{
          alignSelf: me ? 'flex-end' : 'flex-start',
          padding: big ? '22px 34px' : '16px 28px',
          borderRadius: 40,
          fontFamily: FONT.ui,
          fontSize: big ? 56 : 42,
          fontWeight: big ? 800 : 600,
          color: me ? '#fff' : '#111',
          background: me ? '#2F7CF6' : 'rgba(255,255,255,0.97)',
          boxShadow: '0 18px 44px rgba(0,0,0,0.45)',
          transformOrigin: me ? 'right bottom' : 'left bottom',
          transform: `scale(${p})`,
        }}
      >
        {text}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 380, width: 860, display: 'flex', flexDirection: 'column', gap: 16}}>
        {bubble('mom', 4)}
        {bubble('is it saturday yet?? ⚽⚽', a, false, true)}
        {bubble('2 more sleeps 😂', a + 18, true)}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ bespoke shots
const HookOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = spring({frame: frame - B.sat, fps, config: {stiffness: 200, damping: 20}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 300, display: 'flex', alignItems: 'baseline', gap: 20, color: ESU.white, textShadow: '0 8px 30px rgba(0,0,0,0.7)'}}>
          <span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 108}}>Moms of kids</span>
          <span style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 96, letterSpacing: -3}}>4–12</span>
        </div>
      </AbsoluteFill>
      {frame < B.sat + 12 && (
        <Center y={0.52}>
          <div style={{transform: `scale(0.8) translateX(${out * 1200}px) rotate(${out * 12}deg)`}}>
            <ScreenTimeCard at={0} />
          </div>
        </Center>
      )}
      <AbsoluteFill
        style={{boxShadow: `inset 0 0 ${120 + Math.sin(frame / 3) * 40}px rgba(229,50,45,${0.3 + Math.sin(frame / 3) * 0.12})`}}
      />
    </AbsoluteFill>
  );
};

/** "hand / over / the  [clip's own print on paper]  iPad / again." */
const InlineWordsOver: React.FC = () => {
  const frame = useCurrentFrame();
  const r = (n: number) => W('hook3', n) - B.inline;
  const word = (t: string, at: number) => (
    <span
      key={t}
      style={{
        fontFamily: FONT.ui,
        fontWeight: 600,
        fontSize: 58,
        letterSpacing: -1,
        color: '#111',
        opacity: interpolate(frame - at, [-1, 4], [0, 1], clamp),
        transform: `translateY(${interpolate(frame - at, [-1, 6], [10, 0], clamp)}px)`,
        display: 'inline-block',
      }}
    >
      {t}
    </span>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 16, top: 800, width: 190, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2}}>
        {word('hand', r(5))}
        {word('over', r(6))}
        {word('the', r(7))}
      </div>
      <div style={{position: 'absolute', right: 16, top: 800, width: 190, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2}}>
        {word('iPad', r(8))}
        {word('again.', r(9))}
      </div>
    </AbsoluteFill>
  );
};

const RevealOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fallAt = W('sol1', 4) - B.reveal;
  const f = spring({frame: frame - fallAt, fps, config: {stiffness: 300, damping: 16}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 32%, rgba(11,8,38,0.25) 0%, rgba(11,8,38,0.75) 70%)'}} />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${frame * 0.4}deg at 50% 30%, rgba(255,220,160,0.08) 0deg 6deg, rgba(0,0,0,0) 6deg 18deg)`,
          opacity: interpolate(frame, [4, 14], [0, 1], clamp),
          mixBlendMode: 'screen',
        }}
      />
      <Shockwave at={6} x={540} y={560} color="rgba(255,215,0,0.85)" maxR={1000} />
      <Burst at={6} x={540} y={560} count={34} spread={700} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 290}}>
          <ESULogo size={580} at={0} glow enter="slam" />
        </div>
        {frame >= fallAt && (
          <div
            style={{
              position: 'absolute',
              top: 880,
              fontFamily: FONT.serif,
              fontStyle: 'italic',
              fontSize: 170,
              color: ESU.gold,
              lineHeight: 1,
              opacity: f,
              transform: `translateY(${(1 - f) * 20}px)`,
              textShadow: '0 0 40px rgba(255,215,0,0.35), 0 8px 40px rgba(0,0,0,0.7)',
            }}
          >
            Fall Academy
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FactsOverlay: React.FC = () => {
  const base = B.facts;
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 300, display: 'flex', flexDirection: 'column', gap: 16, transform: 'scale(0.86)', transformOrigin: '50% 0'}}>
        <WhiteCard at={W('sol2', 0) - base} icon={emoji('26bd')} title="Weekend soccer classes" body="Fall Academy · 8 weekends" />
        <WhiteCard at={W('sol2', 4) - base} icon={emoji('1f4cd')} title="The Sports Park" body="13196 Bluff Creek Dr · Playa Vista" />
        <WhiteCard at={W('sol2', 5) - base} icon={emoji('1f5d3')} title="Sat & Sun · Oct 3 – Nov 22" body="Morning classes, 9 AM – 12 PM" />
        <WhiteCard at={W('sol2', 7) - base} icon={emoji('1f60a')} title="Ages 4–12" body="Toddler & Mini Kickers classes too" />
      </div>
    </AbsoluteFill>
  );
};

const BigStat: React.FC<{big: string; small: string; count?: number; gold?: boolean}> = ({big, small, count, gold}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: ESU.spring.stat});
  const n = count ? Math.round(interpolate(frame, [2, 22], [0, count], {...clamp, easing: (x) => 1 - (1 - x) ** 3})) : 0;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', transform: `scale(${interpolate(p, [0, 1], [1.2, 1])})`, marginTop: -200}}>
        <div
          style={{
            fontFamily: count ? FONT.serif : FONT.stat,
            fontStyle: count ? 'italic' : 'normal',
            fontWeight: count ? 400 : 700,
            fontSize: count ? 250 : 400,
            lineHeight: 0.9,
            color: gold ? ESU.gold : ESU.white,
            textShadow: '0 0 40px rgba(255,255,255,0.35), 0 12px 60px rgba(0,0,0,0.7)',
          }}
        >
          {count ? `${n.toLocaleString('en-US')}+` : big}
        </div>
        <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 100, color: ESU.white, marginTop: 20, textShadow: '0 6px 30px rgba(0,0,0,0.8)'}}>
          {small}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const WeekCounter: React.FC<{from: number}> = ({from}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame + from;
  const wk = Math.round(interpolate(f, [0, 24], [1, 8], {...clamp, easing: (x) => x ** 1.6}));
  const pop = spring({frame: f - 24, fps, config: ESU.spring.stat});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 290, fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 120, color: 'rgba(255,255,255,0.95)', textShadow: '0 4px 30px rgba(0,0,0,0.7)'}}>
        week
      </div>
      <div
        style={{
          position: 'absolute',
          top: 410,
          fontFamily: FONT.stat,
          fontWeight: 700,
          fontSize: 440,
          lineHeight: 1,
          color: wk === 8 ? ESU.gold : ESU.white,
          transform: `scale(${1 + (f >= 24 ? (1 - pop) * 0.25 : 0)})`,
          textShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {wk}
      </div>
      <div style={{position: 'absolute', top: 900, display: 'flex', gap: 14}}>
        {new Array(8).fill(0).map((_, i) => (
          <div key={i} style={{width: 84, height: 16, borderRadius: 8, background: i < wk ? ESU.gold : 'rgba(255,255,255,0.25)', boxShadow: '0 4px 14px rgba(0,0,0,0.4)'}} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CtaFootage: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tapAt = W('cta1', 4) - B.cta;
  const bookAt = Math.round(1.38 * fps);
  const walkAt = W('cta1', 8) - B.cta;
  const line = spring({frame: frame - 2, fps, config: ESU.spring.headline});
  const btn = spring({frame: frame - tapAt, fps, config: ESU.spring.headline});
  const panel = spring({frame: frame - walkAt, fps, config: {stiffness: 140, damping: 18}});
  const pulse = 1 + Math.max(0, Math.sin((frame - tapAt) / 5)) * 0.035;
  const shot = frame < bookAt ? 'car' : frame < walkAt ? 'book' : 'walk';
  const button = (
    <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 700,
          fontSize: 54,
          letterSpacing: -1,
          color: '#111',
          background: ESU.white,
          padding: '26px 56px',
          borderRadius: 999,
          transform: `scale(${btn * pulse})`,
          boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
        }}
      >
        Find your kid’s class →
      </div>
      <div style={{position: 'absolute', left: '50%', top: 56, width: 0, height: 0}}>
        <Shockwave at={tapAt + 4} x={0} y={0} color="rgba(255,255,255,0.85)" maxR={300} />
      </div>
      <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 38, color: ESU.white, opacity: btn, textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>
        link in bio · eurosoccerusa.com
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      {shot === 'car' && <Clip slot="prep" inSec={1.8} />}
      {shot === 'book' && (
        <Sequence from={bookAt} layout="none">
          <Clip slot="prep" inSec={3.17} />
        </Sequence>
      )}
      {shot === 'walk' && (
        <Sequence from={walkAt} layout="none">
          <Clip slot="prep" inSec={4.2} scrim="top" />
        </Sequence>
      )}
      {shot !== 'walk' && (
        <AbsoluteFill style={{alignItems: 'center'}}>
          <div style={{position: 'absolute', top: 1360, textAlign: 'center', opacity: line, transform: `translateY(${(1 - line) * 24}px)`}}>
            <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 104, color: ESU.white, lineHeight: 1, textShadow: '0 0 30px rgba(255,255,255,0.45), 0 6px 30px rgba(0,0,0,0.8)'}}>
              Fall starts this weekend.
            </div>
            <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 40, color: ESU.white, marginTop: 14, textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>
              Oct 3 – Nov 22 · Sat &amp; Sun mornings
            </div>
          </div>
          {frame >= tapAt && <div style={{position: 'absolute', top: 1560}}>{button}</div>}
        </AbsoluteFill>
      )}
      {shot === 'walk' && (
        <AbsoluteFill style={{alignItems: 'center'}}>
          <div
            style={{
              position: 'absolute',
              top: 300,
              width: 900,
              padding: '38px 40px 42px',
              borderRadius: 36,
              background: 'rgba(11,8,38,0.72)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
              textAlign: 'center',
              opacity: panel,
              transform: `translateY(${(1 - panel) * -40}px) scale(${interpolate(panel, [0, 1], [0.96, 1])})`,
            }}
          >
            <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 64, color: ESU.white, lineHeight: 1}}>Euro Soccer USA</div>
            <div style={{fontFamily: FONT.display, fontSize: 132, color: ESU.gold, letterSpacing: 6, lineHeight: 1, marginTop: 10}}>FALL ACADEMY</div>
            <div style={{height: 2, background: 'rgba(255,255,255,0.25)', margin: '20px 60px 22px'}} />
            {[
              ['🗓', '8 weekends · Oct 3 – Nov 22'],
              ['⏰', 'Sat & Sun mornings · 9 AM – 12 PM'],
              ['⚽', 'Ages 4–12 · toddler classes too'],
              ['📍', 'The Sports Park · Playa Vista, LA'],
            ].map(([icon, text], i) => {
              const r = spring({frame: frame - walkAt - 4 - i * 3, fps, config: {stiffness: 260, damping: 20}});
              return (
                <div
                  key={i}
                  style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 38, color: 'rgba(255,255,255,0.95)', lineHeight: 1.55, opacity: r, transform: `translateX(${(1 - r) * 40}px)`}}
                >
                  {icon} {text}
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', top: 1180}}>{button}</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/** Real ESU photos flashing as prints (only if public/photos has any). */
const PhotoFlash: React.FC<{start: number; every?: number; count?: number}> = ({start, every = 3, count = 8}) => {
  const frame = useCurrentFrame();
  if (!PHOTOS.length) return null;
  const k = Math.floor((frame - start) / every);
  if (k < 0 || k >= count) return null;
  const p = photo(k)!;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{padding: 14, background: '#fafafa', boxShadow: '0 24px 60px rgba(0,0,0,0.55)', transform: `rotate(${k % 2 ? 4 : -4}deg)`}}>
        <Img src={staticFile(p.file)} style={{width: 760, height: 900, objectFit: 'cover', display: 'block'}} />
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ mix + sound
const musicVolume = (f: number) => {
  const t = f / FPS;
  let dist = Infinity;
  for (const l of timeline.lines) {
    if (t >= l.start - 0.08 && t <= l.end + 0.08) {
      dist = 0;
      break;
    }
    dist = Math.min(dist, Math.abs(t - l.start), Math.abs(t - l.end));
  }
  const v = interpolate(dist, [0, 0.25], [0.07, 0.24], clamp);
  return v * interpolate(f, [B.logo - 4, B.logo + 20], [1, 0], clamp);
};

const SoundDesign: React.FC = () => (
  <>
    <Sfx at={0} name="boom" volume={0.5} />
    <Sfx at={1} name="whoosh" volume={0.35} />
    <Sfx at={20} name="ding" volume={0.3} />
    <Sfx at={14} name="tick" volume={0.4} />
    <Sfx at={B.sat} name="swipe" volume={0.45} />
    <Sfx at={B.mom} name="whoosh" volume={0.3} />
    <Sfx at={W('hook2', 1)} name="pop" volume={0.4} />
    <Sfx at={B.hook3} name="tick" volume={0.4} />
    <Sfx at={B.boyTab} name="tick" volume={0.4} />
    <Sfx at={B.inline} name="whoosh_long" volume={0.35} />
    <Sfx at={B.inline + 8} name="shutter" volume={0.35} />
    <Sfx at={B.nineAm} name="glitch" volume={0.45} />
    <Sfx at={B.nineAm + 2} name="tick" volume={0.5} />
    <Sfx at={W('pain1', 3)} name="ding" volume={0.3} />
    <Sfx at={W('pain1', 4) + 6} name="ding" volume={0.3} />
    <Sfx at={W('pain1', 6)} name="ding" volume={0.35} />
    <Sfx at={B.bored} name="swipe" volume={0.4} />
    {[0, 4, 8, 14].map((d) => (
      <Sfx key={d} at={W('pain2', 0) + d} name="pop" volume={0.45} />
    ))}
    <Sfx at={B.eyes} name="whoosh" volume={0.3} />
    <Sfx at={B.google} name="glitch" volume={0.25} />
    <Sfx at={B.google + 6} name="typing" volume={0.45} />
    <Sfx at={B.again} name="tick" volume={0.5} />
    <Sfx at={B.news} name="shutter" volume={0.45} />
    <Sfx at={W('pain4', 6)} name="swipe" volume={0.35} />
    <Sfx at={B.devices} name="tick" volume={0.4} />
    <Sfx at={B.bigNum} name="boom" volume={0.45} />
    <Sfx at={B.every} name="glitch" volume={0.35} />
    <Sfx at={B.every} name="kick" volume={0.4} />
    <Sfx at={B.single} name="kick" volume={0.4} />
    <Sfx at={B.day} name="boom" volume={0.45} />
    <Sfx at={B.gasp - 8} name="tape_stop" volume={0.35} />
    <Sfx at={B.question} name="tick" volume={0.35} />
    <Sfx at={B.drop} name="boom" volume={0.6} />
    <Sfx at={B.drop} name="whistle" volume={0.3} />
    <Sfx at={B.drop + 1} name="kick" volume={0.6} />
    <Sfx at={B.team} name="whoosh" volume={0.35} />
    <Sfx at={B.coach} name="pop" volume={0.35} />
    <Sfx at={W('turn1', 11)} name="sparkle" volume={0.3} />
    <Sfx at={B.reveal + 6} name="boom" volume={0.55} />
    <Sfx at={B.reveal + 4} name="crowd" volume={0.35} />
    <Sfx at={W('sol1', 4)} name="sparkle" volume={0.3} />
    {[0, 4, 5, 7].map((n) => (
      <Sfx key={n} at={W('sol2', n)} name="pop" volume={0.4} />
    ))}
    <Sfx at={B.cones} name="tick" volume={0.4} />
    <Sfx at={B.euro} name="swipe" volume={0.35} />
    {[0, 1, 2, 3].map((i) => (
      <Sfx key={i} at={B.euro + 34 + i * 8} name="kick" volume={0.22} />
    ))}
    <Sfx at={B.drill} name="whoosh" volume={0.35} />
    <Sfx at={B.drill + 4} name="pop" volume={0.4} />
    <Sfx at={B.proof1} name="glitch" volume={0.3} />
    <Sfx at={W('sol4', 1)} name="boom" volume={0.4} />
    <Sfx at={B.proof2} name="sparkle" volume={0.3} />
    <Sfx at={B.proof2 + 22} name="boom" volume={0.3} />
    <Sfx at={B.proof3} name="tick" volume={0.45} />
    <Sfx at={B.weeks} name="glitch" volume={0.35} />
    {new Array(7).fill(0).map((_, i) => (
      <Sfx key={i} at={B.weeks + Math.round(24 * ((i + 1) / 7) ** (1 / 1.6))} name="tick" volume={0.4} />
    ))}
    <Sfx at={B.weeks + 24} name="boom" volume={0.35} />
    <Sfx at={B.conf} name="whoosh" volume={0.35} />
    <Sfx at={B.conf + 6} name="sparkle" volume={0.25} />
    <Sfx at={B.friends} name="whoosh" volume={0.3} />
    <Sfx at={B.friends + 4} name="pop" volume={0.35} />
    <Sfx at={B.skills} name="kick" volume={0.45} />
    <Sfx at={B.callback} name="swipe" volume={0.35} />
    <Sfx at={B.callback + 4} name="pop" volume={0.4} />
    <Sfx at={W('out3', 5)} name="pop" volume={0.5} />
    <Sfx at={W('out3', 5) + 18} name="ding" volume={0.3} />
    <Sfx at={B.cta} name="whoosh_long" volume={0.4} />
    <Sfx at={W('cta1', 4)} name="click" volume={0.5} />
    <Sfx at={B.logo} name="boom" volume={0.6} />
  </>
);

// ------------------------------------------------------------------ the edit
export const ESU_FallLaunchFootage: React.FC = () => {
  const [handle] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    loadAllFonts().then(() => continueRender(handle));
  }, [handle]);
  const n = (a: number, b: number) => b - a; // frames in a shot

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* ===== HOOK (colour) ===== */}
      <Shot from={0} to={14} push={0.04} shakes={[0]} bumps={false} overlay={<HookOverlay />}>
        <F slot="sofa" inSec={0.0} />
      </Shot>
      <Shot from={14} to={B.sat} push={0.04} overlay={<Sequence from={-14}><HookOverlay /></Sequence>}>
        <F slot="sofa" inSec={0.5} outSec={0.95} frames={n(14, B.sat)} />
      </Shot>
      <Shot from={B.sat} to={B.mom} push={0.05} overlay={<Sequence from={-B.sat}><HookOverlay /></Sequence>}>
        <F slot="sofa" inSec={0.98} />
      </Shot>
      <Shot
        from={B.mom}
        to={B.hook3}
        push={0.05}
        overlay={
          <TypeOver
            y={0.76}
            size={112}
            words={[
              {t: 'you’re', at: 0},
              {t: 'not', at: W('hook2', 1) - B.mom, big: true, flip: 4},
              {t: 'a bad mom.', at: W('hook2', 2) - B.mom, br: true},
            ]}
          />
        }
      >
        <F slot="sofa" inSec={1.6} />
      </Shot>
      <Shot from={B.hook3} to={B.boyTab} push={0.06}>
        <F slot="sofa" inSec={2.8} outSec={3.44} frames={n(B.hook3, B.boyTab)} />
      </Shot>
      <Shot from={B.boyTab} to={B.inline} push={0.06}>
        <F slot="sofa" inSec={3.48} outSec={4.15} frames={n(B.boyTab, B.inline)} />
      </Shot>
      <Shot from={B.inline} to={B.nineAm} push={0.03} overlay={<InlineWordsOver />}>
        <F slot="sofa" inSec={4.19} outSec={5.56} frames={n(B.inline, B.nineAm)} scrim="none" />
      </Shot>

      {/* ===== PAIN (black & white, stepped 15 fps) ===== */}
      <Shot
        from={B.nineAm}
        to={B.nineB}
        mono
        stepped
        overlay={
          <TypeOver y={0.22} size={150} serif={false} glow={false} words={[{t: '9:00 AM', at: 2}]} />
        }
      >
        <F slot="sofa" inSec={5.6} grade="mono" />
      </Shot>
      <Shot
        from={B.nineB}
        to={B.bored}
        mono
        stepped
        overlay={
          <NotifStack
            notes={[
              {icon: '1f3ae', app: 'Games', text: 'Your friends are playing. Jump back in!', at: 0},
              {icon: '1f4fa', app: 'Videos', text: 'Up next: 47 more episodes', at: W('pain1', 4) + 6 - B.nineB},
              {icon: '23f0', app: 'Screen Time', text: 'Time limit reached. Ignore limit?', at: W('pain1', 6) - B.nineB},
            ]}
          />
        }
      >
        <F slot="sofa" inSec={6.52} outSec={8.69} frames={n(B.nineB, B.bored)} grade="mono" />
      </Shot>
      <Shot from={B.bored} to={B.eyes} mono stepped>
        <PaperStage>
          <Center y={0.4}>
            <Print rotate={-4} pullFrom={2.2} border={16}>
              <div style={{zoom: 0.74}}>
                <Chat
                  name="Leo 🦖"
                  avatar="1f629"
                  tone="dark"
                  msgs={[
                    {text: 'mom', at: 0},
                    {text: 'mom', at: 4},
                    {text: 'MOM', at: 8, big: true},
                    {text: "i'm boreddd 😩", at: 14},
                  ]}
                />
              </div>
            </Print>
          </Center>
        </PaperStage>
      </Shot>
      <Shot from={B.eyes} to={B.google} mono stepped push={0.08}>
        <F slot="sofa" inSec={8.72} grade="mono" />
      </Shot>
      <Shot
        from={B.google}
        to={B.again}
        mono
        stepped
        overlay={
          <Center y={0.3}>
            <div style={{zoom: 0.9}}>
              <SearchBar at={4} cps={34} query="how to get my kid off the ipad" suggestions={[' without a meltdown', ' on weekends', ' at 7 years old']} />
            </div>
          </Center>
        }
      >
        <Sequence from={0} durationInFrames={B.googleB - B.google}>
          <F slot="kick" inSec={0.0} grade="mono" />
        </Sequence>
        <Sequence from={B.googleB - B.google}>
          <F slot="kick" inSec={1.14} grade="mono" />
        </Sequence>
      </Shot>
      <Shot from={B.again} to={B.news} push={0.03} overlay={<TypeOver y={0.82} size={130} color="#111" glow={false} words={[{t: '…again.', at: 0, big: true}]} />}>
        <F slot="kick" inSec={2.1} grade="mono" scrim="none" />
      </Shot>
      <Shot from={B.news} to={B.devices} cuts={[{at: W('pain4', 7), scale: 1.4, x: 22, y: 45}]}>
        <AbsoluteFill style={{background: '#101010'}}>
          <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #3a3a3a 0%, #0c0c0c 70%)'}} />
          <Center y={0.42}>
            <NewsClip
              kicker="Common Sense Media"
              before="Kids 8–12 now average"
              highlight="5½ hours"
              after="of screen time a day"
              source="The Common Sense Census: Media Use by Tweens and Teens (2021)"
              highlightAt={W('pain4', 6) - B.news}
            />
          </Center>
        </AbsoluteFill>
      </Shot>
      <Shot from={B.devices} to={B.bigNum} mono stepped push={0.08}>
        <F slot="kick" inSec={2.7} grade="mono" />
      </Shot>
      <Shot from={B.bigNum} to={B.every} mono shakes={[B.bigNum]} overlay={<BigStat big="5½" small="hours a day." />}>
        <F slot="kick" inSec={4.98} grade="mono" />
        <AbsoluteFill style={{background: 'rgba(0,0,0,0.35)'}} />
      </Shot>
      <Shot from={B.every} to={B.single} mono overlay={<SlamWord t="Every." />}>
        <F slot="kick" inSec={6.44} grade="mono" />
      </Shot>
      <Shot from={B.single} to={B.day} mono overlay={<SlamWord t="Single." />}>
        <F slot="kick" inSec={6.85} grade="mono" />
      </Shot>
      <Shot from={B.day} to={B.gasp} mono shakes={[B.day]} overlay={<SlamWord t="Day." red />}>
        <F slot="kick" inSec={7.27} grade="mono" />
      </Shot>
      {/* B.gasp → B.question: black + tape-stop */}

      {/* ===== TURN ===== */}
      <Shot
        from={B.question}
        to={B.drop}
        mono
        push={0.05}
        overlay={
          <TypeOver
            y={0.3}
            size={120}
            words={[
              {t: 'What they', at: 0},
              {t: 'actually', at: W('turn1', 2) - B.question, big: true, br: true},
              {t: 'need?', at: W('turn1', 3) - B.question, br: true},
            ]}
          />
        }
      >
        <F slot="kick" inSec={7.8} outSec={9.14} frames={n(B.question, B.drop)} grade="mono" scrim="none" />
      </Shot>
      <Shot
        from={B.drop}
        to={B.team}
        push={0.07}
        shakes={[B.drop]}
        overlay={
          <>
            <Shockwave at={1} x={640} y={1500} color="rgba(255,255,255,0.85)" maxR={1200} />
            <Burst at={1} x={640} y={1500} count={24} spread={520} colors={['#9be89b', ESU.white, '#3fbf6a']} />
          </>
        }
      >
        <ColorFlood at={1} x={640} y={1500} frames={14}>
          <F slot="kick" inSec={9.18} outSec={10.0} frames={n(B.drop, B.team)} scrim="none" />
        </ColorFlood>
      </Shot>
      <Shot from={B.team} to={B.coach} push={0.06}>
        <F slot="match" inSec={0.0} outSec={0.78} frames={n(B.team, B.coach)} />
      </Shot>
      <Shot
        from={B.coach}
        to={B.reveal}
        push={0.05}
        overlay={
          <Center y={0.24}>
            <WhiteCard at={10} icon={emoji('1f64c', 56)} title="“That was ALL you!”" body="Coach, after practice" width={760} />
          </Center>
        }
      >
        <F slot="match" inSec={0.8} outSec={2.27} frames={n(B.coach, B.reveal)} />
      </Shot>

      {/* ===== SOLUTION ===== */}
      <Shot from={B.reveal} to={B.facts} push={0.05} shakes={[B.reveal + 6, W('sol1', 4)]} overlay={<RevealOverlay />}>
        <F slot="match" inSec={2.3} outSec={4.56} frames={n(B.reveal, B.facts)} />
      </Shot>
      <Shot from={B.facts} to={B.euro} push={0.05} overlay={<FactsOverlay />}>
        <Sequence from={0} durationInFrames={B.cones - B.facts}>
          <F slot="match" inSec={4.6} outSec={6.06} frames={B.cones - B.facts} />
        </Sequence>
        <Sequence from={B.cones - B.facts}>
          <F slot="match" inSec={6.1} outSec={7.6} frames={B.euro - B.cones} />
        </Sequence>
      </Shot>
      <Shot from={B.euro} to={B.drill} push={0.04}>
        <ChalkBoard at={0} />
      </Shot>
      <Shot
        from={B.drill}
        to={B.proof1}
        push={0.05}
        overlay={
          <AbsoluteFill style={{alignItems: 'center'}}>
            <div style={{position: 'absolute', top: 330}}>
              <WhiteCard at={4} icon={emoji('1f91d')} title="Grouped by age & ability" body="European-trained coaches" width={820} />
            </div>
          </AbsoluteFill>
        }
      >
        <F slot="match" inSec={7.64} />
      </Shot>
      <Shot from={B.proof1} to={B.proof2} push={0.04} shakes={[W('sol4', 1)]} overlay={<BigStat big="#1" small="voted in Los Angeles" gold />}>
        <F slot="winning" inSec={5.98} outSec={6.77} frames={n(B.proof1, B.proof2)} />
        <AbsoluteFill style={{background: 'rgba(0,0,0,0.3)'}} />
      </Shot>
      <Shot from={B.proof2} to={B.proof3} push={0.03} overlay={<BigStat big="" count={10000} small="kids coached" />}>
        <F slot="winning" inSec={1.02} outSec={1.65} frames={n(B.proof2, B.proof3)} />
        <AbsoluteFill style={{background: 'rgba(0,0,0,0.45)'}} />
      </Shot>
      <Shot from={B.proof3} to={B.weeks} push={0.04} overlay={<BigStat big="20+" small="years in LA" />}>
        <F slot="winning" inSec={6.82} />
        <AbsoluteFill style={{background: 'rgba(0,0,0,0.2)'}} />
      </Shot>

      {/* ===== OUTCOME ===== */}
      <Shot from={B.weeks} to={B.weeksClip} push={0.03} overlay={<WeekCounter from={0} />}>
        {PHOTOS.length ? (
          <AbsoluteFill style={{background: '#0b0826'}}>
            <PhotoFlash start={0} every={3} count={8} />
          </AbsoluteFill>
        ) : (
          <F slot="winning" inSec={2.48} outSec={3.27} frames={n(B.weeks, B.conf)} />
        )}
        <AbsoluteFill style={{background: 'rgba(11,8,38,0.35)'}} />
      </Shot>
      <Shot from={B.weeksClip} to={B.conf} push={0.03} shakes={[B.weeksClip]} overlay={<WeekCounter from={B.weeksClip - B.weeks} />}>
        <F slot="winning" inSec={2.48} outSec={3.27} frames={n(B.weeksClip, B.conf)} />
        <AbsoluteFill style={{background: 'rgba(11,8,38,0.35)'}} />
      </Shot>
      <Shot from={B.conf} to={B.friends} push={0.05} overlay={<StatChip label="CONFIDENCE" from={58} to={92} icon="1f3c5" />}>
        <F slot="winning" inSec={4.27} outSec={5.02} frames={n(B.conf, B.friends)} />
      </Shot>
      <Shot from={B.friends} to={B.skills} push={0.05} overlay={<StatChip label="FRIENDS" from={51} to={88} icon="1f91d" />}>
        <F slot="winning" inSec={1.69} outSec={2.44} frames={n(B.friends, B.skills)} />
      </Shot>
      <Shot from={B.skills} to={B.callback} push={0.05} overlay={<StatChip label="SKILLS" from={46} to={86} icon="26bd" />}>
        <F slot="winning" inSec={3.31} outSec={4.23} frames={n(B.skills, B.callback)} />
      </Shot>
      <Shot from={B.callback} to={B.cta} push={0.05} overlay={<FloatingChat a={W('out3', 5) - B.callback} />}>
        <F slot="prep" inSec={0.0} outSec={1.77} frames={n(B.callback, B.cta)} />
      </Shot>

      {/* ===== SOFT CTA + end card ===== */}
      <Shot from={B.cta} to={B.logo} push={0.04}>
        <CtaFootage />
      </Shot>
      <Shot from={B.logo} to={B.end} push={0.04} bumps={false}>
        <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 70, marginTop: -60}}>
            <ESULogo size={420} at={0} enter="wipe" />
            <SponsorLockup at={10} />
          </div>
        </AbsoluteFill>
      </Shot>

      {/* transitions */}
      {[B.nineAm, B.every, B.proof1, B.weeks].map((f) => (
        <GlitchCut key={f} at={f} />
      ))}
      <BlockWipe at={B.inline} dir={1} />
      <BlockWipe at={B.bored} dir={-1} />
      <BlockWipe at={B.eyes} dir={1} />
      <BlockWipe at={B.euro} dir={1} />
      <BlockWipe at={B.drill} dir={-1} />
      <InvertFlash at={B.google} />
      <InvertFlash at={B.callback} />
      <Flash at={B.drop} length={4} peak={0.5} />
      <Flash at={B.reveal + 6} length={5} peak={0.6} color="#FFE9B0" />
      <Flash at={B.coach} length={3} peak={0.35} />

      <ESUCaptions
        y={0.74}
        maxWords={3}
        hide={['hook2', 'sol1', 'sol4', 'cta1']}
        hideRanges={[
          [B.inline, B.nineAm],
          [B.again, B.news],
          [B.bigNum, B.drop],
        ]}
        yByLine={{hook1: 0.76, out1: 0.66}}
        darkRanges={[[B.bored, B.eyes]]}
        emphasis={['saturday', 'screen', 'hundredth', 'believes', 'europeantrained', 'notice']}
      />

      <CornerLogos hideCrest={[[B.reveal, B.facts]]} hideAll={[[B.logo, B.end + 10]]} />
      <Grain opacity={0.07} />

      <Audio src={staticFile('audio/vo.wav')} volume={1} />
      <Audio src={staticFile('audio/music.wav')} volume={musicVolume} />
      <SoundDesign />
    </AbsoluteFill>
  );
};
