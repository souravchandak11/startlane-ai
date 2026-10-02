/**
 * Scenes 1–5: HOOK → SAME SATURDAY → TODDLER ENERGY → ONLY THIS LITTLE ONCE → FIRST GOAL.
 * All timings are absolute frames keyed to the voiceover (theme.ts L/W/E helpers).
 */
import React from 'react';
import {AbsoluteFill, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {FONT} from '../presets/fonts';
import {HoldingHands, Parent, Toddler, ToddlerPose} from './Characters';
import {BounceText, SerifWords, Sticker} from './Type';
import {backOut, C, clamp, easeInOut, easeOut, L, W} from './theme';
import {BallG, Calendar, Cloud, Confetti, EnergyMeter, Goal, Grass, Heart, PastelBg, SkyBg, Slide, Sparkles, Stage, Sun, SwingSet, Tree, Bench} from './World';

// ------------------------------------------------------------------ shared helpers
export const waddle = (f: number, speed = 0.55, amp = 1): ToddlerPose => {
  const s = Math.sin(f * speed);
  return {
    footL: [-26 + 10 * s * amp, 92 - Math.max(0, 22 * s) * amp],
    footR: [26 + 10 * s * amp, 92 - Math.max(0, -22 * s) * amp],
    handL: [-64, 70 - 14 * s * amp],
    handR: [64, 70 + 14 * s * amp],
    lean: 5 * s * amp,
  };
};

/** inline spinning ball glyph for type ("SOCCER" → S⚽CCER) */
export const BallGlyph: React.FC<{size: number; spin?: number}> = ({size, spin = 0}) => (
  <svg width={size * 0.78} height={size * 0.78} viewBox="-52 -52 104 104" style={{display: 'block', marginBottom: size * 0.1, overflow: 'visible'}}>
    <BallG x={0} y={0} r={48} rot={spin} />
  </svg>
);

const Pop: React.FC<{at: number; out?: number; x: number; y: number; size: number; color?: string; children: React.ReactNode; weight?: number}> = ({
  at,
  out,
  x,
  y,
  size,
  color = C.ink,
  children,
  weight = 700,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = backOut((f - at) / 8, 2.4);
  const o = out !== undefined ? interpolate(f, [out, out + 5], [1, 0], clamp) : 1;
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${k})`,
        opacity: o,
        fontFamily: FONT.round,
        fontWeight: weight,
        fontSize: size,
        color,
        whiteSpace: 'nowrap',
        WebkitTextStroke: `${size * 0.14}px #fff`,
        paintOrder: 'stroke fill',
        textShadow: `0 ${size * 0.06}px 0 rgba(30,23,72,0.15)`,
      }}
    >
      {children}
    </div>
  );
};

/** rubber stamp slam */
const Stamp: React.FC<{at: number; x: number; y: number; rot: number; text?: string; size?: number}> = ({at, x, y, rot, text = 'SAME', size = 130}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const d = f - at;
  const s = d < 4 ? interpolate(d, [0, 4], [2.4, 0.94], {easing: (t) => t * t}) : interpolate(d, [4, 8], [0.94, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`,
        opacity: interpolate(d, [0, 3], [0, 0.92], clamp),
        border: `${size * 0.09}px solid ${C.red}`,
        outline: `${size * 0.04}px solid ${C.red}`,
        outlineOffset: size * 0.06,
        borderRadius: size * 0.16,
        padding: '0.04em 0.22em 0.06em 0.3em',
        fontFamily: FONT.round,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: size * 0.08,
        color: C.red,
        lineHeight: 1.05,
        mixBlendMode: 'multiply',
      }}
    >
      {text}
    </div>
  );
};

// ================================================================== 1 · HOOK
const FLOOR = 1440;
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const wait = L('hook1');
  const your = W('hook1', 1);
  const yep = L('hook2');
  const momIn = W('hook2', 2);
  const dadIn = W('hook2', 4);
  const too = W('hook2', 6);
  // freeze-frame on "Wait…", rewind on "your"
  const frozen = frame >= wait && frame < your;
  const f = frozen ? wait : frame;

  // ---- toddler walk-in + kick
  const tScale = 1.25;
  const tx = interpolate(f, [0, 20], [90, 470], {...clamp, easing: (t) => 1 - (1 - t) ** 2});
  let pose: ToddlerPose = f < 21 ? waddle(f, 0.75) : {};
  let ty = FLOOR - (f < 21 ? Math.abs(Math.sin(f * 0.75)) * 10 : 0);
  if (f >= 21 && f < 34) {
    // wind-up 21→25, strike 25→27, follow-through
    const back = interpolate(f, [21, 25], [0, 1], clamp);
    const strike = interpolate(f, [25, 27], [0, 1], clamp);
    const ret = interpolate(f, [29, 34], [0, 1], clamp);
    const fx = 26 - 40 * back + 110 * strike - 70 * ret;
    const fy = 92 - 26 * back - 40 * strike + 66 * ret;
    pose = {footR: [fx, fy], handL: [-80, 20], handR: [70, 40], lean: -6 * strike + 4 * back, mouth: 'open', look: 1};
  }
  if (frame >= wait && frame < your) pose = {...pose, mouth: 'o', look: 1};
  const excited = frame >= your && frame < yep;
  if (excited) {
    const d = frame - your;
    pose = {mouth: 'open', handL: [-72, -36 + Math.sin(d / 3) * 10], handR: [72, -36 - Math.sin(d / 3) * 10], look: 0};
    ty = FLOOR - Math.abs(Math.sin(d / 4)) * 26;
  }
  if (frame >= yep) {
    const d = frame - yep;
    pose = {mouth: 'grin', happyEyes: d < 30, headTilt: Math.sin(d / 3) * 6 * Math.exp(-d / 20), handR: [74, -60], handL: [-62, 70]};
    ty = FLOOR - Math.abs(Math.sin(d / 5)) * 14 * Math.exp(-d / 30);
  }
  const blink = frame % 70 > 66 ? 1 : 0;

  // ---- ball: 3 bounces → rest → kicked at camera → freeze → rewind
  const r0 = 64;
  const restX = 600;
  const restY = FLOOR - r0;
  let bx = restX;
  let by = restY;
  let br = r0;
  let bsq = 1;
  if (f < 8) {
    const u = f / 8;
    by = 360 + (restY - 360) * u * u;
    bx = 760 - 60 * u;
  } else if (f < 17) {
    const u = (f - 8) / 9;
    by = restY - 4 * 330 * u * (1 - u);
    bx = 700 - 50 * u;
  } else if (f < 24) {
    const u = (f - 17) / 7;
    by = restY - 4 * 140 * u * (1 - u);
    bx = 650 - 50 * u;
  }
  for (const c of [8, 17, 24]) if (Math.abs(f - c) < 1.5) bsq = 0.78;
  const kick = 27;
  if (f >= kick) {
    const u = interpolate(f, [kick, wait], [0, 1], {...clamp, easing: (t) => t * t});
    bx = restX + (720 - restX) * u;
    by = restY + (640 - restY) * u;
    br = r0 + (300 - r0) * u;
  }
  if (frame >= your) {
    const u = interpolate(frame, [your, your + 8], [1, 0], {...clamp, easing: (t) => 1 - (1 - t) ** 2});
    bx = restX + (720 - restX) * u;
    by = restY + (640 - restY) * u;
    br = r0 + (300 - r0) * u;
  }
  const spin = f * 16 + (frame >= your ? -(frame - your) * 40 : 0);

  // ---- parents slide in on "you get to play too"
  const momX = interpolate(frame, [momIn, momIn + 10], [-360, 190], {...clamp, easing: (t) => backOut(t, 1.4)});
  const dadX = interpolate(frame, [dadIn, dadIn + 10], [1440, 880], {...clamp, easing: (t) => backOut(t, 1.4)});
  const waveM = Math.sin((frame - momIn) / 3.2) * 26;
  const waveD = Math.sin((frame - dadIn) / 3.2 + 1) * 26;

  const zoom = frozen ? 1.06 : frame >= your && frame < your + 6 ? interpolate(frame, [your, your + 6], [1.06, 1], clamp) : 1;
  const rewindLines = frame >= your && frame < your + 9;

  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`}}>
      <SkyBg />
      <Stage>
        <Sun x={880} y={1300} r={100} face={false} />
        <Cloud x={220 + frame * 0.6} y={640} s={0.9} />
        <Cloud x={860 - frame * 0.4} y={880} s={0.6} />
        <Cloud x={600 + frame * 0.3} y={460} s={0.5} />
        <Grass y={1360} />
        {frame >= momIn && (
          <Parent kind="mom" x={momX} y={1420} scale={0.9} handR={[150, -40 + waveM]} handL={[-110, 220]} mouth="grin" blink={blink} />
        )}
        {frame >= dadIn && (
          <Parent kind="dad" x={dadX} y={1420} scale={0.9} handL={[-150, -40 + waveD]} handR={[110, 220]} mouth="grin" blink={blink} />
        )}
        <Toddler x={tx} y={ty} scale={tScale} {...pose} blink={pose.happyEyes ? 0 : blink} />
        <BallG x={bx} y={by} r={br} rot={spin} squash={bsq} shadowY={br < 90 ? FLOOR + 2 : undefined} />
        {/* speed lines behind the flying ball */}
        {f >= kick && f < wait &&
          [0, 1, 2, 3].map((i) => (
            <line key={i} x1={bx - br - 40 - i * 30} y1={by + (i - 1.5) * 40} x2={bx - br - 160 - i * 40} y2={by + (i - 1.5) * 60 + 40} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.8} />
          ))}
      </Stage>
      {/* freeze-frame treatment: white inset frame + pause glyph */}
      {frozen && (
        <AbsoluteFill style={{boxShadow: 'inset 0 0 0 22px #fff', background: 'rgba(255,255,255,0.08)'}}>
          <div style={{position: 'absolute', right: 70, bottom: 520, display: 'flex', gap: 14, opacity: (frame - wait) % 10 < 6 ? 1 : 0.3}}>
            <div style={{width: 22, height: 70, borderRadius: 6, background: '#fff'}} />
            <div style={{width: 22, height: 70, borderRadius: 6, background: '#fff'}} />
          </div>
        </AbsoluteFill>
      )}
      {rewindLines && (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          {new Array(6).fill(0).map((_, i) => (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: (random(`rw${frame}${i}`) * 1920) | 0, height: 8 + random(`rh${frame}${i}`) * 20, background: 'rgba(255,255,255,0.55)'}} />
          ))}
        </AbsoluteFill>
      )}
      {/* ---- frame-0 audience call-out (holds the scroll until the VO lands) */}
      {frame < wait + 2 && (
        <Sticker at={-6} out={wait - 4} x={540} y={430} size={60} bg="#fff" rot={-3} wobble>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 14}}>
            parents of 1-year-olds
            <img src={staticFile('emoji/1f440.svg')} style={{width: 58, height: 58}} />
          </span>
        </Sticker>
      )}
      {/* ---- "wait…" */}
      {frame >= wait && frame < your + 8 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: interpolate(frame, [your, your + 7], [470, 300], clamp),
            transform: `translateY(-50%) scale(${backOut((frame - wait) / 7, 2) * interpolate(frame, [your, your + 7], [1, 0.4], clamp)})`,
            opacity: interpolate(frame, [your + 3, your + 8], [1, 0], clamp),
            textAlign: 'center',
            fontFamily: FONT.serif,
            fontStyle: 'italic',
            fontSize: 250,
            color: C.red,
            WebkitTextStroke: '22px #fff',
            paintOrder: 'stroke fill',
            lineHeight: 1,
          }}
        >
          wait…
        </div>
      )}
      {/* ---- question stack */}
      <Pop at={W('hook1', 1)} out={yep + 5} x={540} y={420} size={84}>
        your
      </Pop>
      <Sticker at={W('hook1', 2)} out={yep + 5} x={540} y={548} size={118} bg={C.sun} rot={-4}>
        1-year-old
      </Sticker>
      <Pop at={W('hook1', 3)} out={yep + 5} x={540} y={690} size={96}>
        can play
      </Pop>
      {frame < yep + 12 && (
        <BounceText
          text="SOCCER?"
          at={W('hook1', 5)}
          out={yep + 5}
          y={880}
          size={200}
          colors={[C.red, C.skyDeep, C.grassDeep, C.orange, C.pink, C.lilac, C.red]}
          stagger={1}
          replace={{1: <BallGlyph size={200} spin={frame * 10} />}}
        />
      )}
      {/* ---- yep! stamp */}
      {frame >= yep && frame < W('hook2', 1) + 6 && (
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 560,
            width: 330,
            height: 330,
            borderRadius: '50%',
            background: C.red,
            border: '14px solid #fff',
            boxShadow: '0 18px 40px rgba(30,23,72,0.3)',
            transform: `translate(-50%, -50%) rotate(-10deg) scale(${backOut((frame - yep) / 8, 3) * interpolate(frame, [W('hook2', 1), W('hook2', 1) + 6], [1, 0], clamp)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.round,
            fontWeight: 700,
            fontSize: 120,
            color: '#fff',
          }}
        >
          yep!
        </div>
      )}
      {/* ---- and you get to play too */}
      <Pop at={W('hook2', 1)} x={540} y={410} size={82}>
        {['and', 'you', 'get', 'to'].map((w, i) => (
          <span key={w} style={{opacity: frame >= W('hook2', 1 + i) ? 1 : 0, marginRight: 22}}>
            {w}
          </span>
        ))}
      </Pop>
      <BounceText text="play" at={W('hook2', 5)} x={420} y={570} size={170} colors={[C.skyDeep, C.grassDeep, C.orange, C.red]} stagger={1} />
      <Sticker at={too} x={790} y={580} size={120} bg={C.pink} color="#fff" rot={6}>
        too!
      </Sticker>
      <Stage>
        <Sparkles at={too} x={540} y={900} spread={420} count={10} color={C.pink} dur={32} />
        {frame >= too &&
          [0, 1, 2, 3, 4].map((i) => {
            const d = frame - too - i * 3;
            if (d < 0) return null;
            return <Heart key={i} x={200 + i * 170 + Math.sin(d / 5 + i) * 20} y={1050 - d * 9} s={0.6 + (i % 2) * 0.3} color={i % 2 ? C.pink : C.red} rot={(i - 2) * 10} />;
          })}
      </Stage>
    </AbsoluteFill>
  );
};

// ================================================================== 2 · SAME SATURDAY
export const SameScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('pain1');
  const same1 = W('pain1', 4);
  const same2 = W('pain1', 6);
  const same3 = W('pain1', 8);
  const sat = W('pain1', 9);
  const d = frame - s0;
  const swing = Math.sin((d / 30) * Math.PI) * 10;
  const push = interpolate(frame, [s0, same2], [1, 1.07], clamp);
  const crop = frame >= same2 && frame < same3 ? 1.32 : 1;
  const calIn = interpolate(frame, [same3, same3 + 7], [-700, 940], {...clamp, easing: (t) => backOut(t, 1.3)});
  const flip = interpolate(frame, [same3 + 6, sat + 12], [0, 3], clamp);
  // the toddler sits on the swing seat (swing-local coords)
  const sitScale = 0.78;
  const sitY = -128 + 92 * sitScale - 6;
  const shW = sitY - 196 * sitScale;
  const handT = (sx: number): [number, number] => [sx / sitScale, (-250 - shW) / sitScale];
  const flash = frame >= same2 && frame < same2 + 3;
  const momX = 300;
  const momY = 1600;
  const momS = 0.8;
  const momShY = -330 + 0.85 * 150 - 230;
  const phone = [momX + momS * 30, momY + momS * (momShY + 60)];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #C5CAD5 0%, #E2E4E9 70%)'}}>
      <AbsoluteFill style={{transform: `scale(${push * crop})`, transformOrigin: crop > 1 ? '68% 62%' : '50% 55%'}}>
        <Stage>
          <Cloud x={260} y={560} s={0.8} color="#EEF0F3" />
          <Cloud x={820} y={700} s={0.6} color="#EEF0F3" />
          <Grass y={1300} color="#B6BFB3" dark="#97A194" flowers={false} />
          <Tree x={980} y={1330} s={0.85} dull />
          <Slide x={170} y={1420} s={0.95} dull />
          <SwingSet x={730} y={1440} s={1} angle={swing} dull>
            <Toddler
              x={0}
              y={sitY}
              scale={sitScale}
              footL={[-14, 52]}
              footR={[14, 52]}
              handL={handT(-50)}
              handR={handT(50)}
              mouth="meh"
              shadow={false}
              blink={frame % 80 > 75 ? 1 : 0}
            />
          </SwingSet>
          <Bench x={momX} y={1552} s={0.95} dull />
          <Parent kind="mom" x={momX} y={momY} scale={momS} crouch={0.85} handR={[30, 60]} handL={[-30, 90]} headTilt={10} mouth="flat" blink={frame % 60 > 52 ? 1 : 0} footL={[-60, 0]} footR={[60, 0]} />
          <rect x={phone[0] - 26} y={phone[1] - 44} width={52} height={88} rx={10} fill="#2B2D38" />
          <rect x={phone[0] - 20} y={phone[1] - 36} width={40} height={70} rx={6} fill="#8FB8E8" opacity={0.75} />
        </Stage>
      </AbsoluteFill>
      {flash && <AbsoluteFill style={{background: '#fff', opacity: 0.8}} />}
      <Stamp at={same1} x={300} y={1000} rot={-14} />
      {frame < same3 + 4 && <Stamp at={same2} x={640} y={880} rot={9} />}
      {/* calendar of identical Saturdays */}
      {frame >= same3 && (
        <AbsoluteFill style={{background: `rgba(120,126,140,${interpolate(frame, [same3, same3 + 6], [0, 0.35], clamp)})`}}>
          <Stage>
            <Calendar
              x={540}
              y={calIn}
              s={1.25}
              flip={flip}
              pages={['6', '13', '20', '27'].map((n) => ({top: 'SATURDAY', big: n, small: 'playground. again.', color: '#8C93A1'}))}
            />
          </Stage>
          <Stamp at={sat} x={560} y={1150} rot={-8} size={150} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ================================================================== 3 · TODDLER ENERGY
export const EnergyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('pain2');
  const energy = W('pain2', 3);
  const nowhere = W('pain2', 4);
  const d = frame - s0;
  // ricochet keyframes (local frame, x)
  const hops = [0, 7, 13, 19, 25, 31, 37, 43];
  const xs = [260, 820, 330, 780, 300, 760, 420, 540];
  let tx = 540;
  let ty = 1440;
  let rot = 0;
  let sq = 1;
  const boxK = interpolate(frame, [nowhere, nowhere + 12], [0, 1], {...clamp, easing: (t) => easeInOut(t)});
  if (frame < nowhere) {
    let i = 0;
    while (i < hops.length - 2 && d >= hops[i + 1]) i++;
    const a = hops[i];
    const b = hops[i + 1];
    const u = Math.min(1, Math.max(0, (d - a) / (b - a)));
    tx = xs[i] + (xs[i + 1] - xs[i]) * u;
    ty = 1440 - 4 * 380 * u * (1 - u);
    rot = (i % 2 ? -1 : 1) * 360 * easeInOut(u);
    sq = u < 0.12 ? 0.75 + 2 * u : u > 0.9 ? 1 - (u - 0.9) * 2 : 1.08;
  } else {
    const k = frame - nowhere;
    tx = 540;
    ty = 1240;
    sq = 0.82 + Math.abs(Math.sin(k / 2.5)) * 0.08;
    rot = Math.sin(k / 2) * 4;
  }
  const level = frame < energy ? interpolate(frame, [s0, energy], [0, 1], clamp) : interpolate(frame, [energy, nowhere], [1, 9.99], {...clamp, easing: (t) => t * t});
  // closing walls: inner box 460×520 around the toddler
  const bw = interpolate(boxK, [0, 1], [1080, 470]);
  const bh = interpolate(boxK, [0, 1], [1300, 560]);
  const bcx = 540;
  const bcy = interpolate(boxK, [0, 1], [1080, 1040]);
  const shake = frame >= energy && frame < nowhere ? (random(`es${frame}`) - 0.5) * 10 : 0;
  return (
    <AbsoluteFill style={{background: '#D8D2C9'}}>
      <Stage>
        {/* room */}
        <rect x={0} y={1380} width={1080} height={540} fill="#BDB4A7" />
        <rect x={620} y={640} width={320} height={300} rx={18} fill="#C9CFD8" stroke="#A9A196" strokeWidth={16} />
        <line x1={780} y1={640} x2={780} y2={940} stroke="#A9A196" strokeWidth={10} />
        <line x1={620} y1={790} x2={940} y2={790} stroke="#A9A196" strokeWidth={10} />
        <rect x={90} y={1130} width={430} height={200} rx={50} fill="#A79F94" />
        <rect x={70} y={1060} width={110} height={290} rx={44} fill="#9C9489" />
        <rect x={430} y={1060} width={110} height={290} rx={44} fill="#9C9489" />
        <ellipse cx={600} cy={1520} rx={360} ry={70} fill="#AFA698" />
        {/* motion trail */}
        {frame < nowhere &&
          [1, 2, 3].map((k) => (
            <circle key={k} cx={tx - (xs[1] - xs[0]) * 0.02 * k} cy={ty - 200} r={40 - k * 8} fill={C.sun} opacity={0.18 * (4 - k)} />
          ))}
        <g transform={`rotate(${rot} ${tx} ${ty - 170})`}>
          <Toddler x={tx} y={ty} scale={0.95} squash={sq} handL={[-74, -50]} handR={[74, -50]} footL={[-34, 80]} footR={[34, 80]} mouth={frame < nowhere ? 'grin' : 'o'} happyEyes={frame < nowhere} shadow={false} />
        </g>
        {/* lightning sparks around the kid */}
        {frame >= energy - 6 && frame < nowhere &&
          [0, 1, 2].map((i) => {
            const a = (frame * 0.4 + i * 2.1) % (Math.PI * 2);
            const px = tx + Math.cos(a) * 200;
            const py = ty - 200 + Math.sin(a) * 200;
            return <path key={i} d={`M${px} ${py - 40} l-18 40 h22 l-14 40 l40 -52 h-24 l14 -28 z`} fill={C.sun} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />;
          })}
      </Stage>
      {/* walls closing in */}
      {boxK > 0 && (
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: bcy - bh / 2, background: '#5F5A54'}} />
          <div style={{position: 'absolute', left: 0, bottom: 0, right: 0, top: bcy + bh / 2, background: '#5F5A54'}} />
          <div style={{position: 'absolute', left: 0, top: bcy - bh / 2, width: bcx - bw / 2, height: bh, background: '#5F5A54'}} />
          <div style={{position: 'absolute', right: 0, top: bcy - bh / 2, width: 1080 - (bcx + bw / 2), height: bh, background: '#5F5A54'}} />
          <div style={{position: 'absolute', left: bcx - bw / 2, top: bcy - bh / 2, width: bw, height: bh, boxShadow: 'inset 0 0 0 14px #3E3A36, inset 0 0 60px rgba(0,0,0,0.35)'}} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
        <Stage>
          <g opacity={interpolate(frame, [nowhere + 2, nowhere + 8], [1, 0], clamp)}>
            <EnergyMeter x={540} y={470} level={level} label="TODDLER ENERGY" />
          </g>
        </Stage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ================================================================== 4 · ONLY THIS LITTLE ONCE
export const LittleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('pain3');
  const only = W('pain3', 2);
  const little = W('pain3', 4);
  const once = W('pain3', 5);
  const grip = interpolate(frame, [only - 4, only + 10], [0, 1], {...clamp, easing: (t) => easeOut(t)});
  const push = interpolate(frame, [s0, s0 + 70], [1, 1.08], clamp);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, #FFF3E6 0%, #FFDCCB 70%, #F7C6B6 100%)'}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 58%'}}>
        <Stage>
          <g transform="translate(-60 330) scale(1.02)">
            <HoldingHands grip={grip} breathe={Math.sin(frame / 12)} />
          </g>
          {frame >= little &&
            [0, 1, 2, 3].map((i) => {
              const dd = frame - little - i * 5;
              if (dd < 0) return null;
              return <Heart key={i} x={420 + i * 70 + Math.sin(dd / 6 + i) * 18} y={960 - dd * 6} s={0.35 + (i % 2) * 0.15} color={i % 2 ? C.pink : C.coral} rot={(i - 1.5) * 12} />;
            })}
        </Stage>
      </AbsoluteFill>
      <SerifWords
        y={470}
        size={118}
        words={[
          {t: 'and', at: s0},
          {t: "they're", at: W('pain3', 1)},
          {t: 'only', at: only, style: {color: C.red}},
        ]}
      />
      <SerifWords
        y={620}
        size={118}
        words={[
          {t: 'this', at: W('pain3', 3)},
          {t: 'little', at: little, style: {fontSize: 62, letterSpacing: 6, verticalAlign: 'middle'}},
          {t: 'once.', at: once},
        ]}
      />
    </AbsoluteFill>
  );
};

// ================================================================== 5 · THE FIRST GOAL (music drop)
export const GoalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('turn1');
  const tear = W('turn1', 1);
  const lets = W('turn1', 3);
  const score = W('turn1', 4);
  const goal = W('turn1', 8);
  const together = W('turn1', 9);
  const kickAt = goal - 9;

  // ---------------- part A: calendar flips to THIS WEEKEND
  if (frame < lets) {
    const flip = interpolate(frame, [tear, tear + 8], [0, 1], clamp);
    return (
      <AbsoluteFill>
        <PastelBg base="#FFF1DC" blobs={[C.butter, C.sky, C.pink]} seed={4} />
        <AbsoluteFill
          style={{
            background: `repeating-conic-gradient(from ${frame * 0.5}deg at 50% 48%, rgba(255,194,51,0.16) 0deg 10deg, transparent 10deg 20deg)`,
            opacity: interpolate(frame, [tear, tear + 8], [0, 1], clamp),
          }}
        />
        <Stage>
          <Calendar
            x={540}
            y={interpolate(frame, [s0, s0 + 6], [1500, 960], {...clamp, easing: (t) => backOut(t, 1.2)})}
            s={1.35}
            flip={flip}
            pages={[
              {top: 'SATURDAY', big: '27', small: 'playground. again.', color: '#8C93A1'},
              {top: 'THIS WEEKEND', big: '3 · 4', small: 'october', color: C.red},
            ]}
          />
          <Sparkles at={tear + 6} x={540} y={900} spread={330} count={9} />
          {frame >= tear + 8 && <BallG x={790 + Math.sin(frame / 4) * 6} y={1290} r={62} rot={frame * 6} />}
        </Stage>
      </AbsoluteFill>
    );
  }

  // ---------------- part B: the field, the build, the goal
  const tx = 360;
  const tS = 1.12;
  const ballR0 = 56;
  const b0: [number, number] = [520, FLOOR - ballR0];
  const ctrl: [number, number] = [690, 860];
  const goalPos: [number, number] = [840, 1330];
  const tgt: [number, number] = [goalPos[0] + 10, goalPos[1] - 110];
  let bx = b0[0];
  let by = b0[1];
  let br = ballR0;
  const u = interpolate(frame, [kickAt, goal], [0, 1], {...clamp, easing: (t) => t ** 1.35});
  if (frame >= kickAt) {
    bx = (1 - u) ** 2 * b0[0] + 2 * (1 - u) * u * ctrl[0] + u * u * tgt[0];
    by = (1 - u) ** 2 * b0[1] + 2 * (1 - u) * u * ctrl[1] + u * u * tgt[1];
    br = ballR0 - 18 * u;
  }
  if (frame > goal) {
    const dd = frame - goal;
    bx = tgt[0] + 14 * Math.min(1, dd / 4);
    by = Math.min(goalPos[1] - 38, tgt[1] + dd * dd * 1.4);
    br = 38;
  }
  const bulge = frame >= goal ? Math.exp(-(frame - goal) / 8) * Math.cos((frame - goal) / 2.2) : 0;
  // toddler: wind-up then strike, then celebrate
  let pose: ToddlerPose = {look: 1, mouth: 'smile', handL: [-74, 40], handR: [66, 40]};
  let ty = FLOOR;
  if (frame >= score && frame < goal) {
    const back = interpolate(frame, [score + 4, kickAt], [0, 1], {...clamp, easing: (t) => easeInOut(t)});
    const strike = interpolate(frame, [kickAt, kickAt + 3], [0, 1], clamp);
    pose = {
      look: 1,
      mouth: strike > 0 ? 'open' : 'smile',
      footR: [26 - 50 * back + 130 * strike, 92 - 30 * back - 50 * strike],
      handL: [-86, 10],
      handR: [70, 30 - 30 * back],
      lean: 6 * back - 10 * strike,
    };
  }
  if (frame >= goal) {
    const dd = frame - goal;
    pose = {mouth: 'grin', happyEyes: true, handL: [-80, -78], handR: [80, -78], footL: [-30, 92], footR: [30, 92]};
    ty = FLOOR - Math.abs(Math.sin(dd / 4.5)) * (frame >= together ? 120 : 60);
  }
  const momCheer = frame >= goal;
  const dadX = interpolate(frame, [goal + 8, goal + 18], [1400, 990], {...clamp, easing: (t) => backOut(t, 1.3)});
  const sat = frame < goal ? 0.5 : 1;
  const push = frame < goal ? interpolate(frame, [lets, goal], [1, 1.14], {...clamp, easing: (t) => t * t}) : interpolate(frame, [goal, goal + 10], [1.2, 1.04], clamp);
  const shake = frame >= goal && frame < goal + 10 ? (random(`gs${frame}`) - 0.5) * 24 * (1 - (frame - goal) / 10) : 0;
  // dotted aim arc draws on during "score their very first"
  const arcLen = 760;
  const arcK = interpolate(frame, [score, kickAt], [0, 1], clamp);
  const flood = interpolate(frame, [goal, goal + 12], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
  const floodMask = `radial-gradient(circle at ${tgt[0]}px ${tgt[1]}px, transparent ${flood * 2300}px, black ${flood * 2300 + 60}px)`;
  const field = (
    <Stage>
      <Sun x={180} y={760} r={90} />
      <Cloud x={700 + frame * 0.4} y={600} s={0.7} />
      <Cloud x={300 - frame * 0.3} y={960} s={0.5} />
      <Grass y={1220} />
      <Goal x={goalPos[0]} y={goalPos[1]} w={330} h={220} bulge={bulge} />
      {frame >= goal + 8 && <Parent kind="dad" x={dadX} y={1500} scale={0.82} handL={[-130, -200]} handR={[130, -200]} mouth="grin" happyEyes />}
      <Parent
        kind="mom"
        x={150}
        y={1500}
        scale={0.82}
        crouch={momCheer ? interpolate(frame, [goal, together], [0.75, 0.15], clamp) : 0.75}
        handL={momCheer ? [-120, -210] : [-130, 120]}
        handR={momCheer ? [120, -210] : [150, 80]}
        mouth={momCheer ? 'grin' : 'open'}
        happyEyes={momCheer}
        footL={[-70, 0]}
        footR={[70, 0]}
      />
      {frame >= score && frame < goal + 4 && (
        <path
          d={`M${b0[0]} ${b0[1]} Q${ctrl[0]} ${ctrl[1]} ${tgt[0]} ${tgt[1]}`}
          stroke="#fff"
          strokeWidth={10}
          strokeDasharray="4 26"
          strokeLinecap="round"
          fill="none"
          style={{strokeDashoffset: (1 - arcK) * arcLen}}
          opacity={interpolate(frame, [goal, goal + 4], [0.9, 0], clamp)}
        />
      )}
      <Toddler x={tx} y={ty} scale={tS} {...pose} />
      <BallG x={bx} y={by} r={br} rot={frame * 18} shadowY={frame < kickAt ? FLOOR + 2 : undefined} />
    </Stage>
  );
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.5}px)`}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '62% 64%'}}>
        <AbsoluteFill>
          <SkyBg />
          {field}
        </AbsoluteFill>
        {sat < 1 || flood < 1 ? (
          <AbsoluteFill style={{filter: 'saturate(0.45) brightness(0.97)', WebkitMaskImage: frame >= goal ? floodMask : undefined, maskImage: frame >= goal ? floodMask : undefined}}>
            <SkyBg />
            {field}
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Confetti at={goal} burst={{x: tgt[0], y: tgt[1]}} count={70} dur={50} />
      <Confetti at={goal + 2} count={80} dur={60} />
      <Stage>
        <Sparkles at={goal} x={tgt[0]} y={tgt[1]} spread={300} count={10} dur={26} color="#fff" />
      </Stage>
      {frame >= goal && (
        <BounceText
          text="GOAL!"
          at={goal}
          y={interpolate(frame, [together, together + 8], [600, 520], clamp)}
          size={250}
          colors={[C.red, C.sun, C.skyDeep, C.grassDeep, C.pink]}
          stagger={1}
          replace={{1: <BallGlyph size={250} spin={frame * 12} />}}
        />
      )}
      {frame >= together && (
        <SerifWords y={720} size={150} color={C.ink} words={[{t: 'together.', at: together, style: {color: C.red, WebkitTextStroke: '14px #fff', paintOrder: 'stroke fill'}}]} />
      )}
    </AbsoluteFill>
  );
};
