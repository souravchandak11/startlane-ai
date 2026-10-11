import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {ESU, clamp} from '../presets/brand';
import {AudioBadge, Captions, Grain, Mono, Scene, VideoText, buildPages, pop, shake, useFontsReady} from '../components/ESU_Kit';
import type {Word} from '../components/ESU_Kit';
import voEnvelope from '../data/voEnvelope.json';

// Scene boundaries (frames @30fps)
const T = {
  hook: 0,
  missed: 38,
  comeHere: 112,
  group: 190,
  minutes: 254,
  confidence: 355,
  thing: 430,
  ability: 466,
  exactly: 514,
  cta: 562,
  end: 690,
};
export const SCRIPT01_DURATION = T.end;

const VO1_START = 3;
const VO2_START = 193;

// Coach Denver's real audio, recut into two contiguous chunks. Times are global seconds.
const VO1: Word[] = [
  ['Some', 0.2], ['kids', 0.4], ['that', 0.5], ['maybe', 0.6], ["haven't", 0.8], ['played', 0.95], ['soccer', 1.2],
  ['and', 1.45], ['missed', 1.8], ['out', 2.0], ['on', 2.1], ['a', 2.15], ['lot', 2.2], ['of', 2.4], ['soccer', 2.6],
  ['that', 2.8], ['their', 3.0], ['peers', 3.1], ['have', 3.2], ['maybe', 3.4], ['done', 3.6],
  ['can', 3.8], ['come', 4.2], ['here', 4.6], ['and', 4.8], ['do', 5.0], ['a', 5.2], ['drop-in', 5.3], ['class.', 5.6],
].map(([w, t]) => ({w: w as string, t: t as number}));
const VO2: Word[] = [
  ['What', 6.51], ['you', 6.71], ['see', 6.81], ['behind', 6.91], ['me', 7.31], ['is', 7.51], ['our', 7.71], ['9', 7.81],
  ['to', 7.91], ['12', 8.11], ['group.', 8.31], ['These', 8.51], ['kids', 8.71], ['play', 8.91], ['for', 9.11], ['one', 9.21],
  ['and', 9.51], ['a', 9.66], ['half', 9.71], ['hours', 9.91], ['every', 10.11], ['Saturday', 10.51], ['or', 10.91],
  ['Sunday', 11.11], ['morning,', 11.31], ['so', 11.91], ['the', 12.11], ['kids', 12.31], ['are', 12.41], ['gaining', 12.51],
  ['confidence.', 13.31],
].map(([w, t]) => ({w: w as string, t: t as number}));

const PAGES = [
  ...buildPages(VO1, [0, 4, 7, 10, 15, 18, 21, 24], 6.15),
  ...buildPages(VO2, [0, 5, 11, 15, 20, 22, 25, 29], 14.2),
];

const level = (frame: number) => {
  const e1 = voEnvelope.vo1 as number[];
  const e2 = voEnvelope.vo2 as number[];
  if (frame >= VO1_START && frame - VO1_START < e1.length) return e1[frame - VO1_START];
  if (frame >= VO2_START && frame - VO2_START < e2.length) return e2[frame - VO2_START];
  return 0;
};

const poster = (size: number, color: string, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: ESU.font.poster,
  fontSize: size,
  lineHeight: 0.92,
  color,
  textTransform: 'uppercase',
  ...extra,
});

// ── 0.00–1.27s · HOOK ───────────────────────────────────────────────
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = spring({frame: f, fps, config: ESU.spring.slam});
  const [sx, sy] = shake(f, 0, 12, 16);
  const hes = pop(f, fps, 1, {stiffness: 220, damping: 16});
  const never = pop(f, fps, 4, {stiffness: 220, damping: 18});
  const chip = pop(f, fps, 11, {stiffness: 320, damping: 11});
  return (
    <Scene bg={ESU.cream} enter="cut">
      <div style={{position: 'absolute', top: 292, left: 70, right: 70, display: 'flex', justifyContent: 'space-between'}}>
        <Mono size={24} color="rgba(10,31,63,0.55)">AGE</Mono>
        <Mono size={24} color="rgba(10,31,63,0.55)">
          TEAMS PLAYED: <span style={{color: ESU.red}}>0</span>
        </Mono>
      </div>
      <div style={{position: 'absolute', left: 0, top: 420, transform: `translate(${sx}px, ${sy}px) scale(${interpolate(slam, [0, 1], [1.3, 1])})`}}>
        <VideoText id="vt-ten" text="10" src="footage/touch.mp4" width={1080} height={820} fontSize={920} baseline={800} letterSpacing={-10} stroke={ESU.navy} />
      </div>
      <div style={{position: 'absolute', left: 84, top: 410, transform: `translateX(${(1 - hes) * -320}px) rotate(-6deg)`, opacity: hes}}>
        <div style={poster(160, ESU.red)}>HE&apos;S</div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 64,
          top: 1050,
          transform: `scale(${chip}) rotate(-7deg)`,
          background: ESU.red,
          borderRadius: 18,
          padding: '10px 30px 4px',
          boxShadow: '0 12px 30px rgba(200,16,46,0.35)',
        }}
      >
        <div style={poster(104, ESU.white)}>TOO LATE?</div>
      </div>
      <div style={{position: 'absolute', top: 1238, width: '100%', textAlign: 'center', transform: `translateY(${(1 - never) * 90}px)`, opacity: never}}>
        <div style={poster(160, ESU.navy)}>NEVER PLAYED.</div>
      </div>
    </Scene>
  );
};

// ── 1.27–3.73s · "and missed out on a lot of soccer that their peers have maybe done"
const MissedOut: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = pop(f, fps, 16, ESU.spring.slam);
  const [sx, sy] = shake(f, 16, 10, 12);
  const sub = pop(f, fps, 28);
  const him = pop(f, fps, 16, {stiffness: 200, damping: 20});
  const ages = [5, 6, 7, 8, 9];
  const tile = 150;
  const gap = 22;
  const rowLeft = (1080 - (ages.length * tile + (ages.length - 1) * gap)) / 2;
  return (
    <Scene bg={ESU.navy}>
      <div style={{position: 'absolute', top: 330, width: '100%', textAlign: 'center', transform: `translate(${sx}px, ${sy}px) scale(${interpolate(title, [0, 1], [1.6, 1])})`, opacity: Math.min(1, title * 2)}}>
        <div style={poster(230, ESU.white)}>MISSED OUT</div>
      </div>
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', opacity: sub, transform: `translateY(${(1 - sub) * 30}px)`}}>
        <div style={{fontFamily: ESU.font.head, fontSize: 92, color: ESU.gold, letterSpacing: 2}}>ON A LOT OF SOCCER.</div>
      </div>
      <Mono size={26} color={ESU.gold} style={{position: 'absolute', top: 725, left: rowLeft}}>THEIR PEERS · AGES 5–9</Mono>
      {ages.map((a, i) => {
        const s = pop(f, fps, i * 3 - 2, {stiffness: 300, damping: 16});
        const pulse = interpolate(f - (52 + i * 2), [0, 4, 10], [1, 1.08, 1], clamp);
        return (
          <div
            key={a}
            style={{
              position: 'absolute',
              top: 775,
              left: rowLeft + i * (tile + gap),
              width: tile,
              height: tile,
              borderRadius: 22,
              background: ESU.gold,
              transform: `scale(${s * pulse})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={poster(78, ESU.navy)}>{a}</div>
            <Mono size={18} color={ESU.navy}>✓ PLAYED</Mono>
          </div>
        );
      })}
      <Mono size={26} color={ESU.white} style={{position: 'absolute', top: 985, left: rowLeft, opacity: him}}>HIM</Mono>
      {ages.map((a, i) => (
        <div
          key={a}
          style={{
            position: 'absolute',
            top: 1035,
            left: rowLeft + i * (tile + gap),
            width: tile,
            height: tile,
            borderRadius: 22,
            border: '4px dashed rgba(255,255,255,0.35)',
            opacity: him,
            transform: `scale(${0.8 + him * 0.2})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={poster(64, 'rgba(255,255,255,0.3)')}>—</div>
        </div>
      ))}
    </Scene>
  );
};

// ── 3.73–6.33s · "can come here and do a drop-in class."
const ComeHere: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = pop(f, fps, 0, ESU.spring.photo);
  const l1 = pop(f, fps, 14, ESU.spring.slam);
  const l2 = pop(f, fps, 26, ESU.spring.slam);
  const stamp = pop(f, fps, 47, {stiffness: 260, damping: 14});
  const [sx, sy] = shake(f, 47, 10, 14);
  const pin = pop(f, fps, 18);
  return (
    <Scene bg={ESU.navy}>
      <div style={{transform: `translate(${sx}px, ${sy}px)`, position: 'absolute', inset: 0}}>
        <div
          style={{
            position: 'absolute',
            left: 250,
            top: 440,
            width: 640,
            height: 686,
            borderRadius: 36,
            overflow: 'hidden',
            border: '8px solid #fff',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            transform: `translateY(${(1 - card) * 220}px) rotate(${(1 - card) * 6 + 2.5}deg)`,
          }}
        >
          <OffthreadVideo src={staticFile('footage/strike.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.08) saturate(1.15)'}} />
          <div
            style={{
              position: 'absolute',
              top: 22,
              left: 22,
              padding: '10px 20px',
              borderRadius: 999,
              background: 'rgba(10,31,63,0.88)',
              opacity: pin,
              transform: `translateY(${(1 - pin) * -20}px)`,
            }}
          >
            <Mono size={20} color={ESU.white}>
              <span style={{color: ESU.red}}>●</span> THE SPORTS PARK · PLAYA VISTA
            </Mono>
          </div>
        </div>
        <div style={{position: 'absolute', left: 70, top: 1000}}>
          <div style={{...poster(150, ESU.white), transform: `translateY(${(1 - l1) * 60}px)`, opacity: l1, textShadow: ESU.shadow.text}}>CAN COME</div>
          <div style={{...poster(200, ESU.red), transform: `scale(${interpolate(l2, [0, 1], [1.5, 1])})`, transformOrigin: 'left center', opacity: Math.min(1, l2 * 2), textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>
            HERE.
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 56,
            top: 1225,
            transform: `scale(${interpolate(stamp, [0, 1], [2.4, 1])}) rotate(-9deg)`,
            opacity: Math.min(1, stamp * 3),
            border: `8px solid ${ESU.red}`,
            borderRadius: 16,
            background: ESU.cream,
            padding: '8px 26px 2px',
          }}
        >
          <div style={poster(80, ESU.red)}>DROP-IN CLASS</div>
        </div>
      </div>
    </Scene>
  );
};

// ── 6.33–8.47s · "What you see behind me is our 9 to 12 group."
const Group: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = pop(f, fps, 0, ESU.spring.photo);
  const swap = interpolate(f, [40, 47], [0, 1], clamp);
  const num = pop(f, fps, 42, ESU.spring.slam);
  const [sx, sy] = shake(f, 42, 10, 14);
  const our = pop(f, fps, 38);
  const grp = pop(f, fps, 56);
  const tag = pop(f, fps, 50, {stiffness: 300, damping: 12});
  return (
    <Scene bg={ESU.cream}>
      <div style={{position: 'absolute', top: 500, left: 60, opacity: 1 - swap}}>
        <Mono size={24} color="rgba(10,31,63,0.6)" style={{marginBottom: 18}}>
          ↓ ESU 9–12s · GAME DAY
        </Mono>
        <div
          style={{
            width: 960,
            height: 420,
            borderRadius: 32,
            overflow: 'hidden',
            boxShadow: ESU.shadow.card,
            transform: `scale(${(0.85 + card * 0.15) * (1 + swap * 0.15)})`,
          }}
        >
          <OffthreadVideo src={staticFile('footage/sofi.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 390, width: '100%', textAlign: 'center', opacity: our, transform: `translateY(${(1 - our) * 40}px)`}}>
        <div style={poster(130, ESU.red)}>OUR</div>
      </div>
      {f >= 41 && (
        <div style={{position: 'absolute', left: 0, top: 500, transform: `translate(${sx}px, ${sy}px) scale(${interpolate(num, [0, 1], [1.35, 1])})`, opacity: Math.min(1, num * 3)}}>
          <VideoText id="vt-912" text="9–12" src="footage/sofi.mp4" startFrom={40} width={1080} height={680} fontSize={660} baseline={640} letterSpacing={-8} stroke={ESU.navy} />
        </div>
      )}
      <div style={{position: 'absolute', top: 1200, width: '100%', textAlign: 'center', opacity: grp, transform: `translateY(${(1 - grp) * 50}px)`}}>
        <div style={poster(150, ESU.navy)}>GROUP.</div>
      </div>
      <div style={{position: 'absolute', right: 80, top: 1118, transform: `scale(${tag}) rotate(5deg)`, background: ESU.red, borderRadius: 14, padding: '8px 22px 2px'}}>
        <div style={poster(58, ESU.white)}>HE&apos;S 10. HE&apos;S IN.</div>
      </div>
    </Scene>
  );
};

// ── 8.47–11.83s · "These kids play for one and a half hours every Saturday or Sunday morning,"
const Minutes: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const label = pop(f, fps, -3);
  const counter = Math.round(interpolate(f, [22, 42], [0, 90], {...clamp, easing: Easing.out(Easing.cubic)}));
  const numIn = pop(f, fps, 20, ESU.spring.stat);
  const bump = interpolate(f, [42, 45, 50], [1, 1.08, 1], clamp);
  const mins = pop(f, fps, 43, ESU.spring.slam);
  const [sx, sy] = shake(f, 43, 8, 10);
  const sub = pop(f, fps, 47);
  const sat = pop(f, fps, 61, {stiffness: 300, damping: 14});
  const sun = pop(f, fps, 79, {stiffness: 300, damping: 14});
  const chip = (txt: string, on: number) => (
    <div
      style={{
        width: 300,
        height: 140,
        borderRadius: 26,
        border: `7px solid ${ESU.navy}`,
        background: on > 0.5 ? ESU.navy : 'transparent',
        transform: `scale(${1 + on * 0.08 - (on > 0.98 ? 0.08 * (on - 0.98) * 50 : 0)})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={poster(96, on > 0.5 ? ESU.gold : ESU.navy)}>{txt}</div>
    </div>
  );
  return (
    <Scene bg={ESU.gold}>
      <div style={{position: 'absolute', top: 385, width: '100%', textAlign: 'center', opacity: label}}>
        <Mono size={30}>THESE KIDS PLAY FOR</Mono>
      </div>
      <div style={{position: 'absolute', top: 410, width: '100%', textAlign: 'center', transform: `scale(${numIn * bump})`, opacity: numIn}}>
        <div style={{...poster(620, ESU.navy), lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{counter}</div>
      </div>
      <div style={{position: 'absolute', top: 985, width: '100%', textAlign: 'center', transform: `translate(${sx}px, ${sy}px) scale(${interpolate(mins, [0, 1], [1.5, 1])})`, opacity: Math.min(1, mins * 2)}}>
        <div style={poster(176, ESU.red)}>MINUTES</div>
      </div>
      <div style={{position: 'absolute', top: 1160, width: '100%', textAlign: 'center', opacity: sub}}>
        <Mono size={26}>= ONE AND A HALF HOURS · 9:00 AM</Mono>
      </div>
      <div style={{position: 'absolute', top: 1225, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34}}>
        {chip('SAT', sat)}
        <Mono size={30}>OR</Mono>
        {chip('SUN', sun)}
      </div>
    </Scene>
  );
};

// ── 11.83–14.33s · "so the kids are gaining confidence."
const Confidence: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const steps = ['NEVER\nPLAYED', 'FIRST\nTOUCH', 'FIRST\nPASS', 'FIRST\nGAME'];
  const xs = [150, 410, 670, 930];
  const dot = interpolate(f, [2, 40], [xs[0], xs[3]], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const card = pop(f, fps, 3, ESU.spring.photo);
  const gain = pop(f, fps, 20);
  const conf = pop(f, fps, 44, ESU.spring.slam);
  const [sx, sy] = shake(f, 44, 12, 16);
  return (
    <Scene bg={ESU.cream}>
      <div style={{position: 'absolute', top: 446, left: xs[0], width: xs[3] - xs[0], height: 8, borderRadius: 4, background: 'rgba(10,31,63,0.15)'}} />
      <div style={{position: 'absolute', top: 446, left: xs[0], width: dot - xs[0], height: 8, borderRadius: 4, background: ESU.red}} />
      {xs.map((x, i) => {
        const on = dot >= x - 2;
        return (
          <React.Fragment key={x}>
            <div
              style={{
                position: 'absolute',
                top: 432,
                left: x - 18,
                width: 36,
                height: 36,
                borderRadius: 18,
                background: on ? ESU.red : ESU.cream,
                border: `6px solid ${on ? ESU.red : 'rgba(10,31,63,0.3)'}`,
                transform: `scale(${on ? 1.15 : 1})`,
              }}
            />
            <Mono size={20} color={on ? ESU.navy : 'rgba(10,31,63,0.4)'} style={{position: 'absolute', top: 490, left: x - 90, width: 180, textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.25}}>
              {steps[i]}
            </Mono>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', top: 428, left: dot - 22, width: 44, height: 44, borderRadius: 22, background: ESU.red, boxShadow: '0 0 0 10px rgba(200,16,46,0.2)'}} />
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 600,
          width: 960,
          height: 420,
          borderRadius: 30,
          overflow: 'hidden',
          boxShadow: ESU.shadow.card,
          border: '8px solid #fff',
          transform: `translateY(${(1 - card) * 300}px) rotate(${-1.5 + (1 - card) * 6}deg)`,
        }}
      >
        <OffthreadVideo src={staticFile('footage/sofi.mp4')} muted startFrom={150} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{position: 'absolute', top: 1050, width: '100%', textAlign: 'center', opacity: gain, transform: `translateY(${(1 - gain) * 40}px)`}}>
        <div style={poster(118, ESU.navy)}>GAINING</div>
      </div>
      <div style={{position: 'absolute', top: 1170, width: '100%', textAlign: 'center', transform: `translate(${sx}px, ${sy}px) scale(${interpolate(conf, [0, 1], [1.7, 1])})`, opacity: Math.min(1, conf * 2)}}>
        <div style={poster(176, ESU.red)}>CONFIDENCE.</div>
      </div>
    </Scene>
  );
};

// ── 14.33–15.53s · re-hook
const TheThing: React.FC = () => {
  const f = useCurrentFrame();
  const words: [string, string, number][] = [
    ['BUT', ESU.white, -2],
    ["HERE'S", ESU.white, 2],
    ['THE', ESU.gold, 6],
    ['THING:', ESU.gold, 10],
  ];
  return (
    <Scene bg={ESU.dark} enter="flash">
      <div style={{position: 'absolute', top: 640, left: 80, right: 80, display: 'flex', flexWrap: 'wrap', gap: '0 34px'}}>
        {words.map(([w, c, d]) => {
          const s = interpolate(f, [d, d + 4], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
          return (
            <div key={w} style={{...poster(200, c), opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>
              {w}
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

// ── 15.53–17.13s · "GROUPED BY AGE + ABILITY"
const Ability: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = pop(f, fps, -3, ESU.spring.slam);
  const b = pop(f, fps, 3, ESU.spring.slam);
  const c = pop(f, fps, 16, ESU.spring.slam);
  const [sx, sy] = shake(f, 16, 12, 18);
  return (
    <Scene bg={ESU.red}>
      <div style={{position: 'absolute', top: 520, left: 80, transform: `translate(${sx}px, ${sy}px)`}}>
        <div style={{...poster(210, ESU.white), opacity: a, transform: `translateX(${(1 - a) * -200}px)`}}>GROUPED</div>
        <div style={{...poster(210, ESU.white), opacity: b, transform: `translateX(${(1 - b) * -200}px)`}}>BY AGE</div>
        <div style={{...poster(210, ESU.navy), opacity: Math.min(1, c * 2), transform: `scale(${interpolate(c, [0, 1], [1.6, 1])})`, transformOrigin: 'left center'}}>
          + ABILITY.
        </div>
      </div>
    </Scene>
  );
};

// ── 17.13–18.73s · "HE STARTS EXACTLY WHERE HE IS."
const Exactly: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = pop(f, fps, -4);
  const hl = interpolate(f, [4, 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const c = pop(f, fps, 10);
  const d = pop(f, fps, 18);
  return (
    <Scene bg={ESU.cream}>
      <div style={{position: 'absolute', top: 500, width: '100%', textAlign: 'center'}}>
        <div style={{...poster(170, ESU.navy), opacity: a, transform: `translateY(${(1 - a) * 40}px)`}}>HE STARTS</div>
        <div style={{position: 'relative', display: 'inline-block', margin: '10px 0'}}>
          <div style={{position: 'absolute', left: -20, right: -20, top: 30, bottom: 10, background: ESU.gold, transform: `scaleX(${hl}) rotate(-1.5deg)`, transformOrigin: 'left center'}} />
          <div style={{...poster(190, ESU.navy), position: 'relative'}}>EXACTLY</div>
        </div>
        <div style={{...poster(170, ESU.navy), opacity: c, transform: `translateY(${(1 - c) * 40}px)`}}>WHERE HE IS.</div>
      </div>
      <div style={{position: 'absolute', top: 1220, width: '100%', textAlign: 'center', opacity: d}}>
        <Mono size={26} color={ESU.red}>FIRST TOUCH → FIRST PASS → FIRST REAL GAME</Mono>
      </div>
    </Scene>
  );
};

// ── 18.73–23.00s · CTA
const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = pop(f, fps, -4);
  const late = pop(f, fps, 4, ESU.spring.slam);
  const [sx, sy] = shake(f, 4, 12, 16);
  const age = pop(f, fps, 10);
  const b1 = pop(f, fps, 16, ESU.spring.photo);
  const typed = f >= 34;
  const b2 = pop(f, fps, 54, {stiffness: 220, damping: 16});
  const foot = pop(f, fps, 68);
  const dots = [0, 1, 2].map((i) => 0.35 + 0.65 * Math.abs(Math.sin(f * 0.35 - i * 0.8)));
  return (
    <Scene bg={ESU.cream}>
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', opacity: a}}>
        <div style={poster(140, ESU.navy)}>COMMENT</div>
      </div>
      <div style={{position: 'absolute', top: 430, width: '100%', textAlign: 'center', transform: `translate(${sx}px, ${sy}px) scale(${interpolate(late, [0, 1], [1.6, 1])})`, opacity: Math.min(1, late * 2)}}>
        <div style={poster(320, ESU.red)}>“LATE”</div>
      </div>
      <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', opacity: age, transform: `translateY(${(1 - age) * 30}px)`}}>
        <div style={poster(96, ESU.navy)}>+ HIS AGE</div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 930,
          left: 90,
          width: 820,
          padding: '22px 28px',
          borderRadius: 30,
          background: '#fff',
          boxShadow: '0 10px 30px rgba(10,31,63,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          opacity: b1,
          transform: `translateY(${(1 - b1) * 60}px)`,
        }}
      >
        <div style={{width: 72, height: 72, borderRadius: 36, background: 'rgba(10,31,63,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <Mono size={20}>YOU</Mono>
        </div>
        {typed ? (
          <div style={{fontFamily: ESU.font.body, fontWeight: 800, fontSize: 48, color: ESU.navy}}>
            <span style={{color: ESU.red}}>LATE</span> — he&apos;s 10
          </div>
        ) : (
          <div style={{display: 'flex', gap: 10}}>
            {dots.map((o, i) => (
              <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: ESU.navy, opacity: o}} />
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1090,
          left: 110,
          width: 880,
          padding: '22px 28px',
          borderRadius: 30,
          background: ESU.navy,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          opacity: b2,
          transform: `translateY(${(1 - b2) * 60}px) scale(${0.9 + b2 * 0.1})`,
        }}
      >
        <div style={{width: 72, height: 72, borderRadius: 36, background: '#fff', padding: 8, flexShrink: 0}}>
          <Img src={staticFile('img/esu_logo.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        </div>
        <div>
          <Mono size={18} color={ESU.gold}>EUROSOCCERUSA</Mono>
          <div style={{fontFamily: ESU.font.body, fontWeight: 600, fontSize: 35, color: ESU.white, lineHeight: 1.2, marginTop: 4, whiteSpace: 'nowrap'}}>
            We&apos;ll tell you honestly where he&apos;d fit.
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1320, left: 90, right: 150, display: 'flex', alignItems: 'center', gap: 26, opacity: foot, transform: `translateY(${(1 - foot) * 30}px)`}}>
        <Img src={staticFile('img/esu_logo.png')} style={{width: 120, height: 104, objectFit: 'contain'}} />
        <div>
          <Mono size={28} color={ESU.navy}>DROP IN ONCE · $39</Mono>
          <Mono size={19} color="rgba(10,31,63,0.65)" style={{marginTop: 8}}>
            SAT &amp; SUN · 9 AM · THE SPORTS PARK, PLAYA VISTA
          </Mono>
        </div>
      </div>
    </Scene>
  );
};

const SFX: [number, string, number][] = [
  [0, 'boom', 0.72], [2, 'whoosh', 0.45], [11, 'pop', 0.6],
  [38, 'whoosh', 0.5], [40, 'tick', 0.35], [43, 'tick', 0.35], [46, 'tick', 0.35], [49, 'tick', 0.35], [52, 'tick', 0.35],
  [54, 'stamp', 0.62], [66, 'pop', 0.35],
  [112, 'whoosh', 0.55], [114, 'pop', 0.5], [126, 'boom', 0.38], [138, 'pop', 0.4], [159, 'stamp', 0.66],
  [190, 'whoosh', 0.5], [232, 'boom', 0.58], [240, 'pop', 0.4], [254, 'whoosh', 0.5],
  [276, 'tick', 0.25], [280, 'tick', 0.25], [284, 'tick', 0.25], [288, 'tick', 0.25], [292, 'tick', 0.25], [297, 'stamp', 0.55],
  [315, 'pop', 0.5], [333, 'pop', 0.5],
  [355, 'whoosh', 0.5], [365, 'tick', 0.35], [377, 'tick', 0.35], [390, 'tick', 0.35], [399, 'boom', 0.66],
  [430, 'whoosh', 0.6], [434, 'tick', 0.4], [438, 'tick', 0.4], [442, 'tick', 0.4],
  [466, 'whoosh', 0.5], [482, 'boom', 0.68], [514, 'whoosh', 0.5], [522, 'pop', 0.4],
  [562, 'whoosh', 0.5], [566, 'boom', 0.68], [596, 'pop', 0.6], [616, 'ding', 0.55], [630, 'tick', 0.3],
];

const SCENES: [number, number, React.FC][] = [
  [T.hook, T.missed, Hook],
  [T.missed, T.comeHere, MissedOut],
  [T.comeHere, T.group, ComeHere],
  [T.group, T.minutes, Group],
  [T.minutes, T.confidence, Minutes],
  [T.confidence, T.thing, Confidence],
  [T.thing, T.ability, TheThing],
  [T.ability, T.exactly, Ability],
  [T.exactly, T.cta, Exactly],
  [T.cta, T.end, CTA],
];

const captionTheme = (frame: number): 'light' | 'dark' =>
  (frame >= T.missed && frame < T.group) ? 'dark' : 'light';

export const ESU_Script01_TooLate: React.FC = () => {
  useFontsReady();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: ESU.cream}}>
      {SCENES.map(([from, to, C]) => (
        <Sequence key={from} from={from} durationInFrames={to - from}>
          <C />
        </Sequence>
      ))}
      <AudioBadge level={level} showFrom={40} revealAt={T.comeHere + 2} compactAt={T.group} hideAt={T.thing} />
      {frame < T.thing && <Captions pages={PAGES} theme={captionTheme(frame)} />}
      <Grain />
      <Sequence from={VO1_START}>
        <Audio src={staticFile('audio/vo1.wav')} />
      </Sequence>
      <Sequence from={VO2_START}>
        <Audio src={staticFile('audio/vo2.wav')} />
      </Sequence>
      {SFX.map(([at, name, vol]) => (
        <Sequence key={`${at}-${name}`} from={at}>
          <Audio src={staticFile(`audio/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
