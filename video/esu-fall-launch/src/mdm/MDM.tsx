/**
 * Euro Soccer USA — "Mommy, Daddy & Me" (Parent-Assisted Toddler, 12–24 months) launch video.
 * Fully animated: rubber-hose characters, a bouncing-ball audio/visual hook, word-synced
 * kinetic type and a procedural kids-pop score whose drop lands on the first "goal".
 *
 *  HOOK     ball bounces → toddler kicks it at camera → scratch-freeze "wait…" → rewind
 *  PAIN     same playground / same swings / same Saturday (muted world, rubber stamps)
 *           toddler energy meter overflows, walls close in · "only this little once"
 *  TURN     calendar flips to THIS WEEKEND → aim arc → GOAL (colour floods back, music drops)
 *  OFFER    Mommy, Daddy & Me Soccer lockup · 30 min · 12–24 months · right by their side
 *           themed games → balance / coordination / confidence · no pressure · nap
 *  EMOTION  milestone cards: first kick / first goal / first high five · "right there"
 *  CTA      fall classes start this weekend · details · Book their first class →
 */
import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FPS} from '../presets/brand';
import {FONT, loadAllFonts} from '../presets/fonts';
import {LOGO_ASPECT, LOGO_SRC} from '../components/ESU_Logo';
import {CapLine, Captions} from './Type';
import {C, clamp, E, L, line, timeline, TOTAL, W} from './theme';
import {Iris} from './World';
import {EnergyScene, GoalScene, HookScene, LittleScene, SameScene} from './Scenes1';
import {CtaScene, FirstsScene, InfoScene, MeetScene, NapScene, PlayScene, SkillsScene, ThereScene} from './Scenes2';

export const MDM_TOTAL = TOTAL;

const SFX_GAIN = 0.55;
const Sfx: React.FC<{at: number; name: string; v?: number}> = ({at, name, v = 0.5}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={v * SFX_GAIN} />
  </Sequence>
);

// ------------------------------------------------------------------ scene timing
const T = {
  same: L('pain1'),
  energy: L('pain2'),
  little: L('pain3') - 6,
  goal: L('turn1'),
  drop: W('turn1', 8),
  meet: L('sol1') - 4,
  info: L('sol2') - 4,
  skills: L('sol3'),
  play: L('sol4'),
  nap: L('sol5') - 4,
  firsts: L('emo1') - 5,
  there: L('emo2'),
  cta: L('cta1') - 4,
};
const DARK: [number, number][] = [[T.nap, T.firsts + 6]];

// ------------------------------------------------------------------ captions
const CAPS: Partial<Record<string, CapLine>> = {
  pain1: {y: 430, emph: {4: 'serif', 6: 'serif', 8: 'serif'}},
  pain2: {y: 720, size: 70, emph: {3: {sticker: C.sun}, 5: 'serif'}},
  turn1: {y: 430, emph: {2: {sticker: C.sun}, 7: 'serif'}, hideFrom: 8},
  sol2: {y: 420, emph: {1: {sticker: C.sun}, 14: 'serif'}, hideWords: [3, 4, 5, 6, 7, 8]},
  sol3: {y: 400, emph: {0: 'serif', 2: {sticker: C.lilac, color: '#fff'}}, hideWords: [5, 6, 7, 8]},
  sol4: {y: 430, emph: {1: 'serif'}, hideWords: [3]},
  sol5: {y: 430, dark: true, maxWords: 5, emph: {5: {sticker: C.lilac, color: '#fff'}}},
};

// ------------------------------------------------------------------ corner logos (light + dark aware)
const MdmCornerLogos: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 4, fps, config: {stiffness: 160, damping: 18}});
  const dark = DARK.reduce((a, [s, e]) => Math.max(a, interpolate(frame, [s - 4, s, e - 4, e], [0, 1, 1, 0], clamp)), 0);
  const hideCrest = interpolate(frame, [W('sol1', 7) - 6, W('sol1', 7), T.info - 2, T.info + 4], [1, 0, 0, 1], clamp);
  const sweep = interpolate(frame % 240, [0, 22], [-60, 160], clamp);
  const crestW = 124;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 150,
          width: crestW,
          height: crestW / LOGO_ASPECT,
          opacity: enter * hideCrest,
          transform: `translateX(${(1 - enter) * -60}px)`,
          filter: 'drop-shadow(0 8px 16px rgba(30,23,72,0.3))',
        }}
      >
        <Img src={staticFile(LOGO_SRC)} style={{width: '100%', height: '100%'}} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: 166,
          opacity: enter,
          transform: `translateX(${(1 - enter) * 60}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 6,
        }}
      >
        <div style={{position: 'relative', overflow: 'hidden', background: '#fff', borderRadius: 16, padding: '12px 18px', boxShadow: '0 8px 20px rgba(30,23,72,0.22)'}}>
          <Img src={staticFile('logos/wateria-navy.svg')} style={{width: 196, height: 196 * (462 / 1800), display: 'block'}} />
          <div
            style={{
              position: 'absolute',
              top: -10,
              bottom: -10,
              width: '30%',
              left: `${sweep}%`,
              transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(255,255,255,0))',
            }}
          />
        </div>
        <div
          style={{
            fontFamily: FONT.round,
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 3,
            color: dark > 0.5 ? '#fff' : C.navy,
            textShadow: dark > 0.5 ? '0 2px 8px rgba(0,0,0,0.6)' : '0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          OFFICIAL SPONSOR
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PaperGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.07, mixBlendMode: 'multiply'}}>
        <filter id={`pg${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#pg${seed})`} />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 65%, rgba(30,23,72,0.14) 100%)'}} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the film
const between = (f: number, a: number, b: number) => f >= a && f < b;

const Picture: React.FC = () => {
  const frame = useCurrentFrame();
  // MEET → INFO push-up transition
  const push = interpolate(frame, [T.info, T.info + 9], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const dissolve = interpolate(frame, [T.little, T.little + 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: C.cream}}>
      {between(frame, 0, T.same) && <HookScene />}
      {between(frame, T.same, T.energy) && <SameScene />}
      {between(frame, T.energy, T.little + 8) && <EnergyScene />}
      {between(frame, T.little, T.goal) && (
        <AbsoluteFill style={{opacity: dissolve}}>
          <LittleScene />
        </AbsoluteFill>
      )}
      {between(frame, T.goal, T.meet + 14) && <GoalScene />}
      {between(frame, T.meet, T.info + 10) && (
        <AbsoluteFill style={{transform: `translateY(${-push * 1920}px)`}}>
          <Iris at={T.meet} x={540} y={900} dur={12}>
            <MeetScene />
          </Iris>
        </AbsoluteFill>
      )}
      {between(frame, T.info, T.skills) && (
        <AbsoluteFill style={{transform: `translateY(${(1 - push) * 1920}px)`}}>
          <InfoScene />
        </AbsoluteFill>
      )}
      {between(frame, T.skills, T.play) && <SkillsScene />}
      {between(frame, T.play, T.nap + 14) && <PlayScene />}
      {between(frame, T.nap, T.firsts + 14) && (
        <Iris at={T.nap} x={540} y={-200} dur={14}>
          <NapScene />
        </Iris>
      )}
      {between(frame, T.firsts, T.there) && (
        <Iris at={T.firsts} x={540} y={2100} dur={14}>
          <FirstsScene />
        </Iris>
      )}
      {between(frame, T.there, T.cta + 14) && <ThereScene />}
      {frame >= T.cta && (
        <Iris at={T.cta} x={560} y={1150} dur={14}>
          <CtaScene />
        </Iris>
      )}
      {/* hard-cut flashes */}
      {[T.same, T.skills, T.play, T.there].map((at) => {
        const o = interpolate(frame, [at, at + 1, at + 5], [0, 0.75, 0], clamp);
        return o > 0 ? <AbsoluteFill key={at} style={{background: '#fff', opacity: o}} /> : null;
      })}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ mix
const musicVolume = (f: number) => {
  const t = f / FPS;
  if (t < line('hook1').start - 0.05) return 0.34; // the audio hook: groove + bounces, full level
  let dist = Infinity;
  for (const l of timeline.lines) {
    if (t >= l.start - 0.08 && t <= l.end + 0.08) {
      dist = 0;
      break;
    }
    dist = Math.min(dist, Math.abs(t - l.start), Math.abs(t - l.end));
  }
  const drop = W('turn1', 8);
  // let the drop punch through for a beat
  const dropLift = interpolate(f, [drop, drop + 2, drop + 16], [0, 0.14, 0], clamp);
  return interpolate(dist, [0, 0.25], [0.11, 0.3], clamp) + dropLift;
};

const SoundDesign: React.FC = () => (
  <>
    {/* hook */}
    <Sfx at={8} name="ball_bounce" v={0.9} />
    <Sfx at={17} name="ball_bounce" v={0.75} />
    <Sfx at={24} name="ball_bounce" v={0.55} />
    <Sfx at={26} name="kick" v={0.6} />
    <Sfx at={27} name="whoosh" v={0.5} />
    <Sfx at={L('hook1') - 1} name="scratch" v={0.8} />
    <Sfx at={W('hook1', 1)} name="whoosh_long" v={0.35} />
    <Sfx at={W('hook1', 2)} name="pop" v={0.5} />
    <Sfx at={W('hook1', 3)} name="bloop" v={0.4} />
    <Sfx at={W('hook1', 5)} name="boing" v={0.55} />
    <Sfx at={W('hook1', 5) + 2} name="glock" v={0.35} />
    <Sfx at={L('hook2')} name="boing" v={0.6} />
    <Sfx at={W('hook2', 2)} name="slide_up" v={0.4} />
    <Sfx at={W('hook2', 4)} name="slide_up" v={0.35} />
    <Sfx at={W('hook2', 5)} name="bloop" v={0.4} />
    <Sfx at={W('hook2', 6)} name="kiss" v={0.5} />
    <Sfx at={W('hook2', 6)} name="sparkle" v={0.35} />
    {/* same saturday */}
    <Sfx at={T.same} name="slide_down" v={0.45} />
    <Sfx at={W('pain1', 4)} name="kick" v={0.75} />
    <Sfx at={W('pain1', 6)} name="kick" v={0.75} />
    <Sfx at={W('pain1', 6)} name="shutter" v={0.3} />
    <Sfx at={W('pain1', 8)} name="whoosh" v={0.35} />
    <Sfx at={W('pain1', 8) + 8} name="swipe" v={0.35} />
    <Sfx at={W('pain1', 8) + 13} name="swipe" v={0.35} />
    <Sfx at={W('pain1', 9)} name="kick" v={0.8} />
    <Sfx at={W('pain1', 9) + 6} name="swipe" v={0.35} />
    {/* energy */}
    {[0, 7, 13, 19, 25, 31, 37].map((d, i) => (
      <Sfx key={d} at={T.energy + d} name={i % 2 ? 'boing' : 'ball_bounce'} v={0.45} />
    ))}
    <Sfx at={W('pain2', 3)} name="riser" v={0.25} />
    <Sfx at={W('pain2', 4)} name="squeak" v={0.6} />
    <Sfx at={W('pain2', 5)} name="boom" v={0.35} />
    {/* little */}
    <Sfx at={W('pain3', 2)} name="sparkle" v={0.3} />
    <Sfx at={W('pain3', 4)} name="kiss" v={0.35} />
    {/* turn → goal */}
    <Sfx at={T.goal} name="swipe" v={0.4} />
    <Sfx at={W('turn1', 1)} name="swipe" v={0.5} />
    <Sfx at={W('turn1', 1) + 8} name="glock" v={0.45} />
    <Sfx at={W('turn1', 3)} name="whoosh" v={0.4} />
    <Sfx at={W('turn1', 8) - 9} name="kick" v={0.8} />
    <Sfx at={W('turn1', 8) - 8} name="whoosh" v={0.45} />
    <Sfx at={W('turn1', 8)} name="net" v={0.9} />
    <Sfx at={W('turn1', 8)} name="boom" v={0.55} />
    <Sfx at={W('turn1', 8) + 1} name="crowd" v={0.4} />
    <Sfx at={W('turn1', 9)} name="xylo_up" v={0.4} />
    {/* meet */}
    <Sfx at={T.meet} name="whoosh_long" v={0.4} />
    <Sfx at={W('sol1', 1)} name="slide_up" v={0.4} />
    <Sfx at={W('sol1', 2)} name="slide_up" v={0.4} />
    <Sfx at={W('sol1', 3)} name="pop" v={0.45} />
    <Sfx at={W('sol1', 4)} name="boing" v={0.5} />
    <Sfx at={W('sol1', 5)} name="boom" v={0.5} />
    <Sfx at={W('sol1', 5)} name="clap1" v={0.5} />
    <Sfx at={W('sol1', 7)} name="sparkle" v={0.4} />
    {/* info */}
    <Sfx at={T.info} name="whoosh" v={0.45} />
    {new Array(7).fill(0).map((_, i) => (
      <Sfx key={i} at={L('sol2') + i * 3} name="tick" v={0.35} />
    ))}
    <Sfx at={L('sol2') + 21} name="ding" v={0.4} />
    <Sfx at={W('sol2', 4)} name="pop" v={0.45} />
    <Sfx at={W('sol2', 7)} name="bloop" v={0.45} />
    <Sfx at={W('sol2', 9)} name="whoosh" v={0.35} />
    <Sfx at={W('sol2', 10)} name="pop" v={0.4} />
    <Sfx at={W('sol2', 13)} name="kiss" v={0.4} />
    {/* skills */}
    {[0, 6, 12, 18].map((d) => (
      <Sfx key={d} at={T.skills + d} name="pop" v={0.4} />
    ))}
    <Sfx at={W('sol3', 4) - 4} name="whoosh" v={0.35} />
    <Sfx at={W('sol3', 5)} name="xylo_up" v={0.4} />
    <Sfx at={W('sol3', 6)} name="xylo_up" v={0.4} />
    <Sfx at={W('sol3', 8)} name="xylo_up" v={0.4} />
    <Sfx at={W('sol3', 8) + 14} name="tada" v={0.35} />
    {/* play */}
    <Sfx at={W('sol4', 1)} name="slide_down" v={0.45} />
    <Sfx at={W('sol4', 1) + 10} name="bloop" v={0.45} />
    <Sfx at={W('sol4', 2)} name="boing" v={0.5} />
    <Sfx at={W('sol4', 3)} name="xylo_up" v={0.4} />
    {/* nap */}
    <Sfx at={T.nap} name="slide_down" v={0.4} />
    {[0, 3, 6, 9, 12].map((d) => (
      <Sfx key={d} at={W('sol5', 5) + d} name="glock" v={0.2} />
    ))}
    {/* firsts */}
    <Sfx at={T.firsts} name="xylo_up" v={0.35} />
    <Sfx at={W('emo1', 2) - 2} name="shutter" v={0.45} />
    <Sfx at={W('emo1', 2) + 4} name="pop" v={0.4} />
    <Sfx at={W('emo1', 5) - 2} name="shutter" v={0.45} />
    <Sfx at={W('emo1', 5) + 4} name="pop" v={0.4} />
    <Sfx at={W('emo1', 8) - 2} name="shutter" v={0.45} />
    <Sfx at={W('emo1', 8) + 4} name="clap1" v={0.5} />
    {/* right there */}
    <Sfx at={T.there} name="whoosh" v={0.35} />
    <Sfx at={W('emo2', 2)} name="clap1" v={0.55} />
    <Sfx at={W('emo2', 2)} name="sparkle" v={0.4} />
    <Sfx at={W('emo2', 5)} name="kiss" v={0.35} />
    {/* cta */}
    <Sfx at={T.cta} name="whoosh_long" v={0.4} />
    <Sfx at={L('cta1')} name="pop" v={0.45} />
    <Sfx at={W('cta1', 2)} name="xylo_up" v={0.3} />
    <Sfx at={W('cta1', 4)} name="pop" v={0.35} />
    <Sfx at={W('cta1', 4) + 5} name="pop" v={0.35} />
    <Sfx at={W('cta1', 4) + 10} name="pop" v={0.35} />
    <Sfx at={W('cta1', 7)} name="pop" v={0.35} />
    <Sfx at={W('cta1', 9)} name="bloop" v={0.4} />
    <Sfx at={L('cta2')} name="whoosh" v={0.3} />
    <Sfx at={W('cta2', 4) - 2} name="boing" v={0.5} />
    <Sfx at={W('cta2', 6)} name="click" v={0.7} />
    <Sfx at={E('cta2') + 4} name="sparkle" v={0.35} />
  </>
);

export const MDM: React.FC = () => {
  const [handle] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    loadAllFonts().then(() => continueRender(handle));
  }, [handle]);
  return (
  <AbsoluteFill style={{background: C.cream}}>
    <Picture />
    <Captions lines={CAPS} />
    <MdmCornerLogos />
    <PaperGrain />
    <Audio src={staticFile('audio/vo_mdm.wav')} volume={1} />
    <Audio src={staticFile('audio/music_mdm.wav')} volume={musicVolume} />
    <SoundDesign />
  </AbsoluteFill>
  );
};
