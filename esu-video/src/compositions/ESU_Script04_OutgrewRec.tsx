import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {ESU, clamp} from '../presets/brand';
import {Captions, Grain, Mono, Scene, VideoText, pop, shake, useFontsReady} from '../components/ESU_Kit';
import type {CaptionPage, Word} from '../components/ESU_Kit';
import narration from '../data/vo_s04.json';

const FPS = 30;
const VO_START = 2;
const WORDS = narration.words as {w: string; t: number; end: number}[];
// Frame at which narration word i starts.
const W = (i: number) => VO_START + Math.round(WORDS[i].t * FPS);
const VO_END = VO_START + Math.round(narration.duration * FPS);

const T = {
  hook: 0,
  sign1: W(11),
  sign2: W(24),
  sign3: W(36),
  sign4: W(45),
  sign5: W(56),
  thing: W(70),
  weekend: W(73),
  select: W(83),
  cta: W(95),
  end: VO_END + 66,
};
export const SCRIPT04_DURATION = T.end;

const CAPTION_WORDS: Word[] = WORDS.map((x) => ({w: x.w === 'next,' ? 'NEXT,' : x.w, t: x.t + VO_START / FPS}));
const PAGES: CaptionPage[] = (() => {
  const pages: CaptionPage[] = [];
  let cur: Word[] = [];
  const flush = (end: number) => {
    if (cur.length) pages.push({words: cur, start: cur[0].t - 0.06, end});
    cur = [];
  };
  CAPTION_WORDS.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    const breakHere = prev && (/[.?!]$/.test(prev.w) || cur.length >= 4 || (/,$/.test(prev.w) && cur.length >= 2));
    if (breakHere) flush(w.t - 0.06);
    cur.push(w);
    if (i === CAPTION_WORDS.length - 1) flush(w.t + 0.6);
  });
  return pages;
})();

const poster = (size: number, color: string, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: ESU.font.poster,
  fontSize: size,
  lineHeight: 0.92,
  color,
  textTransform: 'uppercase',
  ...extra,
});

const card: React.CSSProperties = {background: '#fff', borderRadius: 28, boxShadow: '0 14px 40px rgba(10,31,63,0.16)'};

const SignHeader: React.FC<{n: number; title: string; dark?: boolean}> = ({n, title, dark}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const num = pop(f, fps, -3, ESU.spring.slam);
  const t = pop(f, fps, 3);
  return (
    <div style={{position: 'absolute', top: 330, left: 60, right: 60, display: 'flex', alignItems: 'flex-end', gap: 30}}>
      <div style={{...poster(290, ESU.red), transform: `scale(${interpolate(num, [0, 1], [1.5, 1])})`, transformOrigin: 'left bottom', opacity: Math.min(1, num * 2)}}>0{n}</div>
      <div style={{paddingBottom: 16, opacity: t, transform: `translateX(${(1 - t) * 60}px)`}}>
        <Mono size={24} color={dark ? ESU.gold : ESU.red}>
          SIGN {n} OF 5
        </Mono>
        <div style={{...poster(dark ? 82 : 92, dark ? ESU.white : ESU.navy), marginTop: 10, whiteSpace: 'pre-line'}}>{title}</div>
      </div>
    </div>
  );
};

// ── HOOK + TITLE ──────────────────────────────────────────────────────
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = pop(f, fps, 0, ESU.spring.slam);
  const [sx, sy] = shake(f, 0, 12, 16);
  const top = pop(f, fps, 1, {stiffness: 220, damping: 16});
  const bottom = pop(f, fps, 4, {stiffness: 220, damping: 18});
  const hurts = pop(f, fps, W(2) - 1, {stiffness: 320, damping: 11});
  const strike = interpolate(f, [W(8), W(8) + 6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <Scene bg={ESU.cream} enter="cut">
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', opacity: top, transform: `translateY(${(1 - top) * -60}px)`}}>
        <div style={poster(118, ESU.red)}>SIGNS YOUR KID</div>
      </div>
      <div style={{position: 'absolute', left: -150, top: 400, transform: `translate(${sx}px, ${sy}px) scale(${interpolate(slam, [0, 1], [1.3, 1])})`}}>
        <VideoText id="vt-five" text="5" src="footage/touch.mp4" width={1080} height={840} fontSize={960} baseline={820} stroke={ESU.navy} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 640,
          width: 400,
          transform: `scale(${hurts}) rotate(6deg)`,
          background: ESU.red,
          borderRadius: 20,
          padding: '16px 26px 8px',
          boxShadow: '0 14px 34px rgba(200,16,46,0.35)',
        }}
      >
        <Mono size={22} color="rgba(255,255,255,0.8)">SIGN #5</Mono>
        <div style={poster(118, ESU.white)}>HURTS.</div>
      </div>
      <Mono size={24} color="rgba(10,31,63,0.55)" style={{position: 'absolute', left: 640, top: 960, opacity: hurts, lineHeight: 1.5}}>
        WATCH TO THE END.
        <br />
        THEN SAVE IT.
      </Mono>
      <div style={{position: 'absolute', top: 1238, width: '100%', textAlign: 'center', transform: `translateY(${(1 - bottom) * 90}px)`, opacity: bottom}}>
        <div style={{display: 'inline-block', position: 'relative'}}>
          <div style={poster(170, ESU.navy)}>OUTGREW REC.</div>
          <div style={{position: 'absolute', right: -14, width: 300, top: 70, height: 16, background: ESU.red, transform: `scaleX(${strike}) rotate(-4deg)`, transformOrigin: 'left center'}} />
        </div>
      </div>
    </Scene>
  );
};

const Tracker: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.sign1 || frame >= T.thing) return null;
  const starts = [T.sign1, T.sign2, T.sign3, T.sign4, T.sign5, T.thing];
  const idx = starts.findIndex((s, i) => frame >= s && frame < starts[i + 1]);
  const fadeIn = interpolate(frame, [T.sign1, T.sign1 + 8], [0, 1], clamp);
  const dark = idx === 4;
  return (
    <div style={{position: 'absolute', top: 262, left: 91, display: 'flex', gap: 12, opacity: fadeIn}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = i < idx ? 1 : i === idx ? interpolate(frame, [starts[i], starts[i + 1]], [0, 1], clamp) : 0;
        return (
          <div key={i} style={{width: 170, height: 12, borderRadius: 6, background: dark ? 'rgba(255,255,255,0.18)' : 'rgba(10,31,63,0.13)', overflow: 'hidden'}}>
            <div style={{width: `${fill * 100}%`, height: '100%', background: i === idx ? ESU.red : dark ? ESU.white : ESU.navy}} />
          </div>
        );
      })}
    </div>
  );
};

// ── SIGN 1 · best kid on the team ─────────────────────────────────────
const Sign1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (i: number) => W(i) - T.sign1;
  const c = pop(f, fps, 2, ESU.spring.photo);
  const sb = pop(f, fps, 8);
  const meter = pop(f, fps, at(19) - 4);
  const level = interpolate(f, [at(20), at(22)], [0.62, 0.05], {...clamp, easing: Easing.out(Easing.cubic)});
  const nobody = pop(f, fps, at(20), ESU.spring.slam);
  return (
    <Scene bg={ESU.cream}>
      <SignHeader n={1} title={'BEST KID\nON THE TEAM.'} />
      <div style={{position: 'absolute', left: 70, top: 680, width: 470, height: 504, borderRadius: 30, overflow: 'hidden', border: '8px solid #fff', boxShadow: ESU.shadow.card, transform: `translateY(${(1 - c) * 260}px) rotate(-2.5deg)`}}>
        <OffthreadVideo src={staticFile('footage/strike.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{position: 'absolute', left: 590, top: 690, width: 420, padding: '22px 28px', borderRadius: 28, background: ESU.navy, opacity: sb, transform: `translateX(${(1 - sb) * 120}px)`}}>
        <Mono size={22} color={ESU.gold}>REC LEAGUE · FINAL</Mono>
        <div style={{...poster(150, ESU.white), marginTop: 8}}>9 – 0</div>
        <Mono size={20} color="rgba(255,255,255,0.6)">AGAIN.</Mono>
      </div>
      <div style={{position: 'absolute', left: 590, top: 975, width: 420, padding: '22px 28px', ...card, opacity: meter, transform: `translateX(${(1 - meter) * 120}px)`}}>
        <Mono size={22} color="rgba(10,31,63,0.6)">CHALLENGE LEVEL</Mono>
        <div style={{marginTop: 14, height: 26, borderRadius: 13, background: 'rgba(10,31,63,0.1)', overflow: 'hidden'}}>
          <div style={{width: `${level * 100}%`, height: '100%', background: ESU.red}} />
        </div>
        <div style={{...poster(44, ESU.red), marginTop: 16, whiteSpace: 'nowrap', opacity: nobody, transform: `scale(${interpolate(nobody, [0, 1], [1.3, 1])})`, transformOrigin: 'left center'}}>NOBODY PUSHES HIM.</div>
      </div>
    </Scene>
  );
};

// ── SIGN 2 · twelve kids, one ball ────────────────────────────────────
const Sign2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (i: number) => W(i) - T.sign2;
  const kids = Array.from({length: 12}, (_, i) => i);
  const size = 120;
  const gap = 36;
  const left0 = (1080 - (6 * size + 5 * gap)) / 2;
  const pos = (i: number) => {
    const row = i < 6 ? 0 : 1;
    const col = row === 0 ? i : 11 - i;
    return {x: left0 + col * (size + gap), y: 720 + row * 190};
  };
  const ballT = interpolate(f, [6, at(34)], [0, 11], {...clamp, easing: Easing.inOut(Easing.quad)});
  const a = Math.floor(ballT);
  const b = Math.min(11, a + 1);
  const frac = ballT - a;
  const hop = Math.sin(frac * Math.PI) * 50;
  const bx = pos(a).x + (pos(b).x - pos(a).x) * frac + size / 2;
  const by = pos(a).y + (pos(b).y - pos(a).y) * frac - 30 - hop;
  const touches = pop(f, fps, at(34), ESU.spring.slam);
  const [sx, sy] = shake(f, at(34), 10, 10);
  return (
    <Scene bg={ESU.cream}>
      <SignHeader n={2} title={'12 KIDS.\n1 BALL.'} />
      {kids.map((i) => {
        const s = pop(f, fps, i * 1.2 - 2, {stiffness: 300, damping: 18});
        const lit = Math.abs(ballT - i) < 0.5;
        const him = i === 11;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos(i).x,
              top: pos(i).y,
              width: size,
              height: size,
              borderRadius: size / 2,
              background: him ? ESU.red : ESU.navy,
              border: lit ? `8px solid ${ESU.gold}` : '8px solid transparent',
              transform: `scale(${s * (lit ? 1.1 : 1)})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={poster(54, ESU.white)}>{i + 1}</div>
          </div>
        );
      })}
      <Mono size={22} color={ESU.red} style={{position: 'absolute', left: pos(11).x + 4, top: pos(11).y + size + 14, opacity: interpolate(f, [10, 16], [0, 1], clamp)}}>
        ↑ HIM
      </Mono>
      <div style={{position: 'absolute', left: bx - 26, top: by, width: 52, height: 52, borderRadius: 26, background: ESU.gold, border: `5px solid ${ESU.navy}`, boxShadow: '0 8px 16px rgba(0,0,0,0.2)'}} />
      <div style={{position: 'absolute', top: 1190, width: '100%', textAlign: 'center', transform: `translate(${sx}px, ${sy}px) scale(${interpolate(touches, [0, 1], [1.5, 1])})`, opacity: Math.min(1, touches * 2)}}>
        <div style={poster(110, ESU.navy)}>
          TOUCHES EACH: <span style={{color: ESU.red}}>1</span>
        </div>
      </div>
    </Scene>
  );
};

// ── SIGN 3 · teaching himself ─────────────────────────────────────────
const Sign3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (i: number) => W(i) - T.sign3;
  const query = 'how to do a step-over';
  const typed = query.slice(0, Math.floor(interpolate(f, [6, 30], [0, query.length], clamp)));
  const bar = pop(f, fps, 2);
  const vid = pop(f, fps, 8, ESU.spring.photo);
  const play = interpolate(f, [26, 34], [1, 0], clamp);
  const prog = interpolate(f, [26, 110], [0.04, 0.42], clamp);
  const chip = pop(f, fps, at(44) - 2, {stiffness: 300, damping: 13});
  return (
    <Scene bg={ESU.cream}>
      <SignHeader n={3} title={'TEACHING\nHIMSELF.'} />
      <div style={{position: 'absolute', left: 60, top: 660, width: 960, height: 90, borderRadius: 45, ...card, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 20, opacity: bar}}>
        <div style={{width: 30, height: 30, borderRadius: 15, border: `5px solid ${ESU.navy}`, opacity: 0.6}} />
        <div style={{fontFamily: ESU.font.body, fontWeight: 600, fontSize: 40, color: ESU.navy}}>
          {typed}
          <span style={{opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: ESU.red}}>|</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, top: 790, width: 960, height: 440, borderRadius: 30, overflow: 'hidden', background: '#000', boxShadow: ESU.shadow.card, transform: `translateY(${(1 - vid) * 240}px)`}}>
        <OffthreadVideo src={staticFile('footage/touch.mp4')} muted playbackRate={0.85} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.65) 100%)'}} />
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 130, height: 130, marginLeft: -65, marginTop: -65, borderRadius: 65, background: 'rgba(0,0,0,0.55)', opacity: play, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 0, height: 0, borderTop: '28px solid transparent', borderBottom: '28px solid transparent', borderLeft: '46px solid #fff', marginLeft: 10}} />
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, bottom: 26, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.3)'}}>
          <div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 4, background: ESU.red}} />
        </div>
        <Mono size={18} color="rgba(255,255,255,0.8)" style={{position: 'absolute', right: 28, bottom: 46}}>
          {`0:${String(Math.floor(prog * 60)).padStart(2, '0')} / 3:52`}
        </Mono>
        <div style={{position: 'absolute', left: 24, top: 22, padding: '10px 20px', borderRadius: 999, background: 'rgba(10,31,63,0.88)', transform: `scale(${chip})`, transformOrigin: 'left center'}}>
          <Mono size={22} color={ESU.white}>
            <span style={{color: ESU.red}}>●</span> THE BACKYARD · 7:40 PM
          </Mono>
        </div>
      </div>
    </Scene>
  );
};

// ── SIGN 4 · coach out of drills ──────────────────────────────────────
const Sign4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (i: number) => W(i) - T.sign4;
  const board = pop(f, fps, 2, ESU.spring.photo);
  const lines = ['1.  Laps', '2.  Passing lines', '3.  Scrimmage'];
  const stamp = pop(f, fps, at(50), {stiffness: 260, damping: 14});
  const [sx, sy] = shake(f, at(50), 10, 14);
  const vol = pop(f, fps, at(48) - 2, {stiffness: 300, damping: 14});
  return (
    <Scene bg={ESU.cream}>
      <SignHeader n={4} title={'COACH IS OUT\nOF DRILLS.'} />
      <div style={{transform: `translate(${sx}px, ${sy}px)`, position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 120, top: 670, width: 840, height: 560, ...card, overflow: 'hidden', transform: `translateY(${(1 - board) * 260}px) rotate(1.5deg)`}}>
          <div style={{height: 92, background: ESU.navy, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px'}}>
            <Mono size={24} color={ESU.white}>PRACTICE PLAN · REC U10</Mono>
            <div style={{transform: `scale(${vol})`, background: ESU.gold, borderRadius: 999, padding: '6px 16px'}}>
              <Mono size={18}>VOLUNTEER COACH</Mono>
            </div>
          </div>
          <div style={{padding: '30px 44px'}}>
            {lines.map((l, i) => {
              const s = pop(f, fps, 6 + i * 6);
              return (
                <div key={l} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 92, borderBottom: '2px solid rgba(10,31,63,0.1)', opacity: s, transform: `translateX(${(1 - s) * 40}px)`}}>
                  <div style={{fontFamily: ESU.font.body, fontWeight: 600, fontSize: 46, color: ESU.navy}}>{l}</div>
                  <Mono size={40} color={ESU.green}>✓</Mono>
                </div>
              );
            })}
            <div style={{height: 92, display: 'flex', alignItems: 'center', opacity: pop(f, fps, 24)}}>
              <div style={{fontFamily: ESU.font.body, fontWeight: 600, fontSize: 46, color: 'rgba(10,31,63,0.45)'}}>
                4.&nbsp;&nbsp;
                <span style={{opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: ESU.red}}>|</span>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 70,
            top: 1080,
            transform: `scale(${interpolate(stamp, [0, 1], [2.4, 1])}) rotate(-8deg)`,
            opacity: Math.min(1, stamp * 3),
            border: `8px solid ${ESU.red}`,
            borderRadius: 16,
            background: ESU.cream,
            padding: '8px 26px 2px',
          }}
        >
          <div style={poster(84, ESU.red)}>OUT OF DRILLS</div>
        </div>
      </div>
    </Scene>
  );
};

// ── SIGN 5 · "am I actually good?" ───────────────────────────────────
const Dots: React.FC<{color: string; f: number}> = ({color, f}) => (
  <div style={{display: 'flex', gap: 10}}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: color, opacity: 0.35 + 0.65 * Math.abs(Math.sin(f * 0.3 - i * 0.8))}} />
    ))}
  </div>
);

const Sign5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (i: number) => W(i) - T.sign5;
  const phone = pop(f, fps, 2, ESU.spring.photo);
  const kidMsg = f >= at(58);
  const msg = pop(f, fps, at(58), {stiffness: 260, damping: 16});
  const read = interpolate(f, [at(62), at(62) + 6], [0, 1], clamp);
  const youTyping = f >= at(63) && f < at(68);
  const push = interpolate(f, [0, T.thing - T.sign5], [1, 1.05], clamp);
  return (
    <Scene bg={ESU.dark}>
      <SignHeader n={5} title={'“AM I\nACTUALLY GOOD?”'} dark />
      <div style={{position: 'absolute', left: 110, top: 690, width: 860, height: 520, borderRadius: 44, background: '#1C1C1E', transform: `translateY(${(1 - phone) * 240}px) scale(${push})`, padding: '30px 36px'}}>
        <Mono size={20} color="rgba(255,255,255,0.4)" style={{textAlign: 'center'}}>
          MESSAGES · 9:12 PM
        </Mono>
        <div style={{marginTop: 40, display: 'flex'}}>
          <div style={{background: '#3A3A3C', borderRadius: 30, padding: kidMsg ? '22px 30px' : '26px 30px', transform: `scale(${kidMsg ? 0.9 + msg * 0.1 : 1})`, transformOrigin: 'left center'}}>
            {kidMsg ? (
              <div style={{fontFamily: ESU.font.body, fontWeight: 600, fontSize: 46, color: ESU.white}}>mom… am i actually good?</div>
            ) : (
              <Dots color="rgba(255,255,255,0.8)" f={f} />
            )}
          </div>
        </div>
        <Mono size={18} color="rgba(255,255,255,0.45)" style={{marginTop: 14, opacity: read}}>
          Read 9:14 PM
        </Mono>
        <div style={{marginTop: 70, display: 'flex', justifyContent: 'flex-end', height: 70}}>
          {youTyping && (
            <div style={{background: '#0A84FF', borderRadius: 30, padding: '26px 30px'}}>
              <Dots color="#fff" f={f} />
            </div>
          )}
        </div>
      </div>
    </Scene>
  );
};

// ── "Here's the thing." ───────────────────────────────────────────────
const TheThing: React.FC = () => {
  const f = useCurrentFrame();
  const words: [string, string, number][] = [
    ["HERE'S", ESU.white, -2],
    ['THE', ESU.gold, 3],
    ['THING.', ESU.gold, 6],
  ];
  return (
    <Scene bg={ESU.dark} enter="flash">
      <div style={{position: 'absolute', top: 720, left: 80, right: 80, display: 'flex', flexWrap: 'wrap', gap: '0 34px'}}>
        {words.map(([w, c, d]) => {
          const s = interpolate(f, [d, d + 4], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
          return (
            <div key={w} style={{...poster(210, c), opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>
              {w}
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

// ── "The next step doesn't have to cost you every weekend." ──────────
const Weekend: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (i: number) => W(i) - T.weekend;
  const head = pop(f, fps, -3);
  const cal = pop(f, fps, 2, ESU.spring.photo);
  const every = pop(f, fps, at(81), ESU.spring.slam);
  const stamp = pop(f, fps, at(82) + 8, {stiffness: 260, damping: 14});
  const [sx, sy] = shake(f, at(82) + 8, 10, 14);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekendCells = Array.from({length: 10}, (_, k) => ({row: Math.floor(k / 2), col: 5 + (k % 2)}));
  const fillFrom = at(76);
  const fillTo = at(82);
  const cell = 118;
  return (
    <Scene bg={ESU.cream}>
      <div style={{position: 'absolute', top: 320, left: 70, opacity: head, transform: `translateY(${(1 - head) * 40}px)`}}>
        <div style={poster(118, ESU.navy)}>THE NEXT STEP</div>
        <div style={{...poster(118, ESU.red), opacity: every, transform: `scale(${interpolate(every, [0, 1], [1.4, 1])})`, transformOrigin: 'left center'}}>≠ EVERY WEEKEND.</div>
      </div>
      <div style={{transform: `translate(${sx}px, ${sy}px)`, position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 60, top: 600, width: 960, ...card, padding: '26px 30px', transform: `translateY(${(1 - cal) * 260}px)`}}>
          <Mono size={22} color="rgba(10,31,63,0.6)">BIG-CLUB SEASON · OCTOBER</Mono>
          <div style={{display: 'grid', gridTemplateColumns: `repeat(7, ${cell}px)`, gap: 14, marginTop: 18}}>
            {days.map((d, i) => (
              <Mono key={i} size={20} color={i >= 5 ? ESU.red : 'rgba(10,31,63,0.5)'} style={{textAlign: 'center'}}>
                {d}
              </Mono>
            ))}
            {Array.from({length: 35}, (_, i) => {
              const row = Math.floor(i / 7);
              const col = i % 7;
              const k = weekendCells.findIndex((c) => c.row === row && c.col === col);
              const on = k >= 0 ? interpolate(f, [fillFrom + (k * (fillTo - fillFrom)) / 10, fillFrom + (k * (fillTo - fillFrom)) / 10 + 3], [0, 1], clamp) : 0;
              return (
                <div key={i} style={{height: 84, borderRadius: 14, background: on > 0.5 ? ESU.red : 'rgba(10,31,63,0.06)', transform: `scale(${1 + on * 0.06 - (on > 0.99 ? 0.06 : 0)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Mono size={20} color={on > 0.5 ? ESU.white : 'rgba(10,31,63,0.45)'}>{i + 1 <= 31 ? i + 1 : ''}</Mono>
                  {on > 0.5 && (
                    <Mono size={13} color={ESU.white} style={{letterSpacing: 1}}>
                      {k % 2 ? 'TOURNEY' : 'GAME'}
                    </Mono>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 880,
            transform: `scale(${interpolate(stamp, [0, 1], [2.2, 1])}) rotate(-7deg)`,
            opacity: Math.min(1, stamp * 3),
            background: ESU.navy,
            borderRadius: 18,
            padding: '14px 34px 6px',
            boxShadow: '0 20px 50px rgba(10,31,63,0.35)',
          }}
        >
          <div style={poster(120, ESU.white)}>DOESN&apos;T HAVE TO.</div>
        </div>
      </div>
    </Scene>
  );
};

// ── Euro Select team sheet ────────────────────────────────────────────
const Select: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (i: number) => W(i) - T.select;
  const sheet = pop(f, fps, 0, ESU.spring.photo);
  const rows: [string, string, number][] = [
    ['AGES', '9–12', at(85)],
    ['PRACTICE', 'TUE & THU EVENINGS', at(90)],
    ['GAMES', '1 WEEKEND GAME', at(93)],
    ['HOME', 'THE SPORTS PARK', at(94) + 6],
  ];
  const sofi = pop(f, fps, at(94) + 14, {stiffness: 300, damping: 12});
  return (
    <Scene bg={ESU.navy}>
      <AbsoluteFill style={{opacity: 0.35}}>
        <OffthreadVideo src={staticFile('footage/sofi.mp4')} muted startFrom={60} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(18px) saturate(1.2)'}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 80, top: 400, width: 920, ...card, overflow: 'hidden', transform: `translateY(${(1 - sheet) * 300}px) rotate(${(1 - sheet) * 4}deg)`}}>
        <div style={{background: ESU.navy, padding: '24px 34px', display: 'flex', alignItems: 'center', gap: 26, borderBottom: `6px solid ${ESU.red}`}}>
          <div style={{width: 110, height: 110, borderRadius: 24, background: '#fff', padding: 10}}>
            <Img src={staticFile('img/esu_logo.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
          </div>
          <div>
            <div style={poster(96, ESU.white)}>EURO SELECT</div>
            <Mono size={20} color={ESU.gold} style={{marginTop: 6}}>
              TEAM SHEET · BY TRYOUT
            </Mono>
          </div>
        </div>
        {rows.map(([k, v, d]) => {
          const s = pop(f, fps, d, {stiffness: 260, damping: 18});
          return (
            <div key={k} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 116, padding: '0 34px', borderBottom: '2px solid rgba(10,31,63,0.08)'}}>
              <Mono size={22} color="rgba(10,31,63,0.5)">{k}</Mono>
              <div style={{...poster(60, ESU.navy), opacity: s, transform: `translateX(${(1 - s) * 50}px)`}}>
                {v.split(' ').map((p, i) => (
                  <span key={i} style={{color: /\d/.test(p) ? ESU.red : ESU.navy}}>
                    {i ? ' ' : ''}
                    {p}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', right: 80, top: 1120, transform: `scale(${sofi}) rotate(-4deg)`, background: ESU.gold, borderRadius: 16, padding: '12px 24px 6px'}}>
        <div style={poster(56, ESU.navy)}>+ A GAME AT SOFI STADIUM EVERY YEAR</div>
      </div>
    </Scene>
  );
};

// ── CTA ───────────────────────────────────────────────────────────────
const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (i: number) => W(i) - T.cta;
  const a = pop(f, fps, -4);
  const next = pop(f, fps, at(96), ESU.spring.slam);
  const [sx, sy] = shake(f, at(96), 12, 16);
  const b1 = pop(f, fps, at(97), ESU.spring.photo);
  const typed = f >= at(97) + 14;
  const b2 = pop(f, fps, at(98), {stiffness: 220, damping: 16});
  const foot = pop(f, fps, at(103));
  const dots = [0, 1, 2].map((i) => 0.35 + 0.65 * Math.abs(Math.sin(f * 0.35 - i * 0.8)));
  return (
    <Scene bg={ESU.cream}>
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', opacity: a}}>
        <div style={poster(140, ESU.navy)}>COMMENT</div>
      </div>
      <div style={{position: 'absolute', top: 430, width: '100%', textAlign: 'center', transform: `translate(${sx}px, ${sy}px) scale(${interpolate(next, [0, 1], [1.6, 1])})`, opacity: Math.min(1, next * 2)}}>
        <div style={poster(320, ESU.red)}>“NEXT”</div>
      </div>
      <div style={{position: 'absolute', top: 780, width: '100%', textAlign: 'center', opacity: next}}>
        <Mono size={26}>WE&apos;LL TELL YOU HONESTLY IF HE&apos;S READY.</Mono>
      </div>
      <div style={{position: 'absolute', top: 880, left: 90, width: 820, padding: '22px 28px', borderRadius: 30, background: '#fff', boxShadow: '0 10px 30px rgba(10,31,63,0.12)', display: 'flex', alignItems: 'center', gap: 22, opacity: b1, transform: `translateY(${(1 - b1) * 60}px)`}}>
        <div style={{width: 72, height: 72, borderRadius: 36, background: 'rgba(10,31,63,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <Mono size={20}>YOU</Mono>
        </div>
        {typed ? (
          <div style={{fontFamily: ESU.font.body, fontWeight: 800, fontSize: 48, color: ESU.navy}}>
            <span style={{color: ESU.red}}>NEXT</span> — he&apos;s 10
          </div>
        ) : (
          <div style={{display: 'flex', gap: 10}}>
            {dots.map((o, i) => (
              <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: ESU.navy, opacity: o}} />
            ))}
          </div>
        )}
      </div>
      <div style={{position: 'absolute', top: 1040, left: 110, width: 880, padding: '22px 28px', borderRadius: 30, background: ESU.navy, display: 'flex', alignItems: 'center', gap: 22, opacity: b2, transform: `translateY(${(1 - b2) * 60}px) scale(${0.9 + b2 * 0.1})`}}>
        <div style={{width: 72, height: 72, borderRadius: 36, background: '#fff', padding: 8, flexShrink: 0}}>
          <Img src={staticFile('img/esu_logo.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        </div>
        <div>
          <Mono size={18} color={ESU.gold}>EUROSOCCERUSA</Mono>
          <div style={{fontFamily: ESU.font.body, fontWeight: 600, fontSize: 35, color: ESU.white, lineHeight: 1.2, marginTop: 4, whiteSpace: 'nowrap'}}>
            Let&apos;s find out if he&apos;s ready for a tryout.
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1270, left: 90, right: 150, display: 'flex', alignItems: 'center', gap: 26, opacity: foot, transform: `translateY(${(1 - foot) * 30}px)`}}>
        <Img src={staticFile('img/esu_logo.png')} style={{width: 120, height: 104, objectFit: 'contain'}} />
        <div>
          <Mono size={26} color={ESU.navy}>EURO SELECT · AGES 9–12 · BY TRYOUT</Mono>
          <Mono size={19} color="rgba(10,31,63,0.65)" style={{marginTop: 8}}>
            TUE &amp; THU 5:30 PM · THE SPORTS PARK, PLAYA VISTA
          </Mono>
        </div>
      </div>
    </Scene>
  );
};

const SCENES: [number, number, React.FC][] = [
  [T.hook, T.sign1, Hook],
  [T.sign1, T.sign2, Sign1],
  [T.sign2, T.sign3, Sign2],
  [T.sign3, T.sign4, Sign3],
  [T.sign4, T.sign5, Sign4],
  [T.sign5, T.thing, Sign5],
  [T.thing, T.weekend, TheThing],
  [T.weekend, T.select, Weekend],
  [T.select, T.cta, Select],
  [T.cta, T.end, CTA],
];

const sfx: [number, string, number][] = [
  [0, 'boom', 0.6],
  [2, 'whoosh', 0.35],
  [W(2) - 1, 'pop', 0.5],
  [W(8), 'stamp', 0.45],
  ...[T.sign1, T.sign2, T.sign3, T.sign4, T.sign5, T.weekend, T.select, T.cta].map((s): [number, string, number] => [s - 1, 'whoosh', 0.4]),
  [T.sign1 + 8, 'pop', 0.3],
  [W(20), 'stamp', 0.45],
  ...Array.from({length: 11}, (_, k): [number, string, number] => [T.sign2 + 6 + Math.round((k * (W(34) - T.sign2 - 6)) / 11), 'tick', 0.22]),
  [W(34), 'stamp', 0.5],
  ...Array.from({length: 7}, (_, k): [number, string, number] => [T.sign3 + 6 + k * 3, 'tick', 0.15]),
  [W(44) - 2, 'pop', 0.4],
  [T.sign4 + 6, 'tick', 0.25],
  [T.sign4 + 12, 'tick', 0.25],
  [T.sign4 + 18, 'tick', 0.25],
  [W(50), 'stamp', 0.6],
  [W(58), 'ding', 0.4],
  [T.thing, 'boom', 0.45],
  [W(81), 'pop', 0.35],
  [W(82) + 8, 'boom', 0.55],
  [W(85), 'tick', 0.3],
  [W(90), 'tick', 0.3],
  [W(93), 'tick', 0.3],
  [W(94) + 14, 'pop', 0.45],
  [W(96), 'boom', 0.55],
  [W(98), 'ding', 0.4],
];

const captionTheme = (frame: number): 'light' | 'dark' => (frame >= T.sign5 && frame < T.weekend) || (frame >= T.select && frame < T.cta) ? 'dark' : 'light';

export const ESU_Script04_OutgrewRec: React.FC = () => {
  useFontsReady();
  const frame = useCurrentFrame();
  const showCaptions = frame < T.thing || (frame >= T.weekend && frame < T.cta);
  return (
    <AbsoluteFill style={{background: ESU.cream}}>
      {SCENES.map(([from, to, C]) => (
        <Sequence key={from} from={from} durationInFrames={to - from}>
          <C />
        </Sequence>
      ))}
      <Tracker />
      {showCaptions && <Captions pages={PAGES} theme={captionTheme(frame)} />}
      <Grain />
      <Sequence from={VO_START}>
        <Audio src={staticFile('audio/vo_s04.wav')} />
      </Sequence>
      {sfx.map(([at, name, vol]) => (
        <Sequence key={`${at}-${name}`} from={at}>
          <Audio src={staticFile(`audio/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
