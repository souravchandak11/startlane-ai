import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  continueRender,
  delayRender,
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
import {Camera, Emoji, Flash, Grain, GlowBg, ProgressBar, Sfx} from '../components/ESU_Fx';
import {Chat, Chip, LockScreen, ScreenTimeCard, SearchBar} from '../components/ESU_UI';
import {BouncingBall, Jersey, Leaves, Pitch, PlayerCard, TacticBoard} from '../components/ESU_Soccer';
import {ESULogo} from '../components/ESU_Logo';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ------------------------------------------------------------------ timeline
type LineId = (typeof timeline.lines)[number]['id'];
const line = (id: LineId) => timeline.lines.find((l) => l.id === id)!;
/** start frame of a VO line */
const L = (id: LineId) => Math.round(line(id).start * FPS);
/** end frame of a VO line */
const E = (id: LineId) => Math.round(line(id).end * FPS);
/** start frame of the n-th word of a VO line */
const W = (id: LineId, n: number) => Math.round(line(id).words[Math.min(n, line(id).words.length - 1)].start * FPS);

export const TOTAL_FRAMES = Math.round(timeline.total * FPS);

// Scene boundaries (absolute frames). Every cut lands on a VO line start.
const S = {
  hook: 0,
  badMom: L('hook2'),
  ipad: L('hook3'),
  nineAm: L('pain1'),
  bored: L('pain2'),
  google: L('pain3'),
  stat: L('pain4'),
  blackout: E('pain4') + 2,
  turn: L('turn1'),
  reveal: L('sol1'),
  facts: L('sol2'),
  euro: L('sol3'),
  proof: L('sol4'),
  weeks: L('out1'),
  card: L('out2'),
  callback: L('out3'),
  cta: L('cta1'),
  end: TOTAL_FRAMES,
};

/** Wrap a scene: its own Sequence + camera push-in. Frames inside are relative. */
const Scene: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
  push?: number;
  punches?: {at: number; amount?: number}[];
  shakes?: number[];
}> = ({from, to, children, push, punches, shakes}) => (
  <Sequence from={from} durationInFrames={to - from} name={`scene@${from}`}>
    <Camera durationInFrames={to - from} push={push} punches={punches} shakes={shakes}>
      {children}
    </Camera>
  </Sequence>
);

const Center: React.FC<{children: React.ReactNode; y?: number}> = ({children, y = 0.4}) => (
  <AbsoluteFill style={{alignItems: 'center'}}>
    <div style={{position: 'absolute', top: `${y * 100}%`, transform: 'translateY(-50%)'}}>{children}</div>
  </AbsoluteFill>
);

/** Big kinetic headline, words slam in one by one. */
const Slam: React.FC<{
  words: {t: string; at: number; color?: string; serif?: boolean}[];
  size?: number;
  y?: number;
}> = ({words, size = 190, y = 0.42}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
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
          gap: '0 28px',
          textAlign: 'center',
        }}
      >
        {words.map((w, i) => {
          if (frame < w.at) return null;
          const s = spring({frame: frame - w.at, fps, config: {stiffness: 380, damping: 17}});
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                fontFamily: w.serif ? FONT.serif : FONT.heavy,
                fontStyle: w.serif ? 'italic' : 'normal',
                fontSize: w.serif ? size * 1.05 : size,
                lineHeight: 1,
                color: w.color ?? ESU.white,
                textTransform: w.serif ? 'none' : 'uppercase',
                transform: `scale(${interpolate(s, [0, 1], [2.2, 1])})`,
                opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
                textShadow: '0 12px 40px rgba(0,0,0,0.6)',
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ scenes
/** 1 · HOOK — screen-time report slams in (visual hook on frame 0). */
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <GlowBg base="#0b0b10" colors={['rgba(229,50,45,0.55)', 'rgba(20,24,40,0.9)', 'rgba(229,50,45,0.2)']} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div
          style={{
            position: 'absolute',
            top: 150,
            display: 'flex',
            alignItems: 'baseline',
            gap: 18,
            color: ESU.white,
            textShadow: '0 8px 30px rgba(0,0,0,0.6)',
          }}
        >
          <span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 104}}>Moms of kids</span>
          <span style={{fontFamily: FONT.heavy, fontSize: 104, color: ESU.gold}}>4–12</span>
        </div>
      </AbsoluteFill>
      <Center y={0.4}>
        <ScreenTimeCard at={0} />
      </Center>
      <Emoji code="1f4f1" size={170} x={950} y={1170} at={10} rotate={14} />
      <Emoji code="23f0" size={150} x={130} y={1150} at={16} rotate={-12} />
      {/* alarm pulse ring */}
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 ${120 + Math.sin(frame / 3) * 40}px rgba(229,50,45,${0.35 + Math.sin(frame / 3) * 0.15})`,
        }}
      />
    </AbsoluteFill>
  );
};

/** 2 · "you're not a bad mom." — light-background pattern interrupt. */
const BadMomScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const base = S.badMom;
  const not = W('hook2', 1) - base;
  const s = spring({frame: frame - not, fps, config: {stiffness: 400, damping: 14}});
  return (
    <AbsoluteFill style={{background: '#F6F1EA', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', marginTop: -180}}>
        <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 170, color: ESU.navy, lineHeight: 1}}>
          you’re
        </div>
        <div
          style={{
            display: 'inline-block',
            fontFamily: FONT.heavy,
            fontSize: 250,
            color: ESU.white,
            background: ESU.red,
            padding: '0 34px',
            borderRadius: 24,
            margin: '10px 0',
            transform: `scale(${frame >= not ? interpolate(s, [0, 1], [1.8, 1]) : 0}) rotate(-3deg)`,
            lineHeight: 1.05,
          }}
        >
          NOT
        </div>
        <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 170, color: ESU.navy, lineHeight: 1}}>
          a bad mom.
        </div>
      </div>
      <Emoji code="2764" size={150} x={860} y={540} at={W('hook2', 3) - base} rotate={12} />
    </AbsoluteFill>
  );
};

/** 3 · "watch this before you hand over the iPad again" — tablet with a STOP stamp. */
const IpadScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const base = S.ipad;
  const tab = spring({frame, fps, config: ESU.spring.photo});
  const stampAt = W('hook3', 6) - base; // "iPad"
  const stamp = spring({frame: frame - stampAt, fps, config: {stiffness: 500, damping: 15}});
  return (
    <AbsoluteFill>
      <GlowBg base="#0b0b10" colors={['rgba(80,120,255,0.45)', 'rgba(20,24,40,0.9)', 'rgba(229,50,45,0.25)']} />
      <Center y={0.38}>
        <div
          style={{
            width: 720,
            height: 940,
            borderRadius: 70,
            background: '#111',
            padding: 30,
            boxShadow: '0 60px 140px rgba(0,0,0,0.7), 0 0 120px rgba(90,140,255,0.35)',
            transform: `translateY(${(1 - tab) * 900}px) rotate(${interpolate(tab, [0, 1], [18, -4])}deg)`,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 44,
              background: `linear-gradient(${frame * 3}deg, #3b82f6, #a855f7, #f43f5e, #f59e0b)`,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div style={{fontSize: 150, filter: 'blur(1px)', opacity: 0.9}}>
              <svg width="220" height="220" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,0.25)" />
                <path d="M40 30 L72 50 L40 70 Z" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </Center>
      {frame >= stampAt && (
        <Center y={0.36}>
          <div
            style={{
              fontFamily: FONT.heavy,
              fontSize: 230,
              color: ESU.white,
              padding: '10px 60px',
              border: `16px solid ${ESU.white}`,
              background: 'rgba(200,16,46,0.92)',
              borderRadius: 30,
              transform: `scale(${interpolate(stamp, [0, 1], [3, 1])}) rotate(-12deg)`,
              opacity: interpolate(stamp, [0, 0.2], [0, 1], clamp),
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            }}
          >
            WAIT
          </div>
        </Center>
      )}
      <Emoji code="1f440" size={150} x={170} y={330} at={6} rotate={-10} />
    </AbsoluteFill>
  );
};

/** 4 · 9 AM lock screen + notification pile-up. */
const NineAmScene: React.FC = () => {
  const base = S.nineAm;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#1d2a4a 0%,#3a2b55 55%,#6b3b4f 100%)'}} />
      <Center y={0.38}>
        <LockScreen
          notes={[
            {icon: '1f3ae', app: 'Games', text: 'Your friends are playing. Jump back in!', at: W('pain1', 3) - base},
            {icon: '1f4fa', app: 'Videos', text: 'Up next: 47 more episodes', at: W('pain1', 5) - base},
            {icon: '23f0', app: 'Screen Time', text: 'Time limit reached. Ignore limit?', at: W('pain1', 7) - base},
          ]}
        />
      </Center>
    </AbsoluteFill>
  );
};

/** 5 · "Mom, I'm bored" chat spam. */
const BoredScene: React.FC = () => {
  const base = S.bored;
  const a = W('pain2', 0) - base;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const badgeAt = W('pain2', 4) - base; // "hundredth"
  const b = spring({frame: frame - badgeAt, fps, config: {stiffness: 400, damping: 12}});
  return (
    <AbsoluteFill>
      <GlowBg base="#101014" colors={['rgba(47,124,246,0.35)', 'rgba(20,24,40,0.9)', 'rgba(229,50,45,0.2)']} />
      <Center y={0.37}>
        <Chat
          name="Leo 🦖"
          avatar="1f629"
          tone="light"
          msgs={[
            {text: 'mom', at: a},
            {text: 'mom', at: a + 4},
            {text: 'MOM', at: a + 8, big: true},
            {text: "i'm boreddd 😩", at: a + 14},
            {text: 'can i have the ipad', at: badgeAt - 2},
          ]}
        />
      </Center>
      {frame >= badgeAt && (
        <div
          style={{
            position: 'absolute',
            right: 70,
            top: 250,
            fontFamily: FONT.heavy,
            fontSize: 120,
            color: ESU.white,
            background: '#E5322D',
            borderRadius: 999,
            padding: '6px 44px',
            transform: `scale(${b}) rotate(10deg)`,
            boxShadow: '0 20px 60px rgba(229,50,45,0.6)',
          }}
        >
          ×100
        </div>
      )}
    </AbsoluteFill>
  );
};

/** 6 · Googling it... again. */
const GoogleScene: React.FC = () => {
  const base = S.google;
  const againAt = W('pain3', 9) - base;
  return (
    <AbsoluteFill>
      <GlowBg base="#0d0d12" colors={['rgba(66,133,244,0.3)', 'rgba(20,24,40,0.9)', 'rgba(251,188,5,0.12)']} />
      <Center y={0.34}>
        <SearchBar
          at={4}
          cps={30}
          query="how to get my kid off the ipad"
          suggestions={[' without a meltdown', ' on weekends', ' at 7 years old']}
        />
      </Center>
      <Emoji code="1f644" size={160} x={880} y={1080} at={againAt} rotate={10} />
    </AbsoluteFill>
  );
};

/** 7 · The stat: 5.5 hours. Every. Single. Day. */
const StatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const base = S.stat;
  const numAt = W('pain4', 6) - base; // "five"
  const val = interpolate(frame, [numAt, numAt + 18], [0, 5.5], {...clamp, easing: (x) => 1 - (1 - x) ** 3});
  const pop = spring({frame: frame - numAt, fps, config: ESU.spring.stat});
  const every = W('pain4', 13) - base;
  const single = W('pain4', 14) - base;
  const day = W('pain4', 15) - base;
  const desat = interpolate(frame, [day + 8, S.blackout - base], [0, 1], clamp);
  return (
    <AbsoluteFill style={{filter: `grayscale(${desat}) brightness(${1 - desat * 0.5})`}}>
      <GlowBg base="#0b0b10" colors={['rgba(229,50,45,0.45)', 'rgba(20,24,40,0.9)', 'rgba(255,215,0,0.12)']} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 230, fontFamily: FONT.caption, fontWeight: 800, fontSize: 54, color: 'rgba(255,255,255,0.85)', letterSpacing: 2}}>
          KIDS AGES 8–12
        </div>
        <div
          style={{
            position: 'absolute',
            top: 330,
            display: 'flex',
            alignItems: 'baseline',
            gap: 20,
            transform: `scale(${frame >= numAt ? interpolate(pop, [0, 1], [0.4, 1]) : 0})`,
          }}
        >
          <span style={{fontFamily: FONT.stat, fontWeight: 700, fontSize: 420, lineHeight: 1, color: ESU.gold, textShadow: '0 20px 80px rgba(255,215,0,0.35)'}}>
            {val.toFixed(1)}
          </span>
          <span style={{fontFamily: FONT.heavy, fontSize: 130, color: ESU.white}}>HRS</span>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 820,
            width: 900,
            textAlign: 'center',
            fontFamily: FONT.caption,
            fontWeight: 600,
            fontSize: 38,
            lineHeight: 1.3,
            color: 'rgba(255,255,255,0.65)',
            opacity: frame >= numAt ? 1 : 0,
          }}
        >
          of screen time a day, on average
          <br />
          <span style={{fontSize: 30, opacity: 0.8}}>Source: Common Sense Media Census, 2021</span>
        </div>
      </AbsoluteFill>
      <Slam
        y={0.6}
        size={160}
        words={[
          {t: 'EVERY.', at: every},
          {t: 'SINGLE.', at: single},
          {t: 'DAY.', at: day, color: '#FF4D4D'},
        ]}
      />
    </AbsoluteFill>
  );
};

/** 8 · The turn: "A ball. A team. A coach who believes in them." */
const TurnScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const base = S.turn;
  const ballAt = W('turn1', 5) - base;
  const teamAt = W('turn1', 7) - base;
  const coachAt = W('turn1', 9) - base;
  const title = spring({frame, fps, config: ESU.spring.headline});
  return (
    <AbsoluteFill>
      <Pitch at={0} dim={0.45} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div
          style={{
            position: 'absolute',
            top: 150,
            fontFamily: FONT.serif,
            fontStyle: 'italic',
            width: 960,
            textAlign: 'center',
            fontSize: 132,
            lineHeight: 1,
            color: ESU.white,
            textShadow: '0 10px 40px rgba(0,0,0,0.6)',
            transform: `translateY(${(1 - title) * 60}px)`,
            opacity: title,
          }}
        >
          What they
          <br />
          <span style={{color: ESU.gold}}>actually</span> need?
        </div>
      </AbsoluteFill>
      <BouncingBall at={ballAt - 6} x={540} floorY={930} size={300} />
      {frame >= teamAt && (
        <AbsoluteFill style={{alignItems: 'center'}}>
          <div style={{position: 'absolute', top: 960, display: 'flex', gap: 6}}>
            {[7, 9, 10, 11, 4].map((n, i) => {
              const s = spring({frame: frame - teamAt - i * 2, fps, config: {stiffness: 320, damping: 13}});
              return (
                <div key={n} style={{transform: `translateY(${(1 - s) * 200}px) scale(${s})`}}>
                  <Jersey num={n} size={190} color={i % 2 ? ESU.red : ESU.navy} trim={i % 2 ? ESU.white : ESU.red} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      <Emoji code="1f64c" size={170} x={170} y={720} at={coachAt} rotate={-12} />
      <Emoji code="1f4aa" size={150} x={910} y={720} at={coachAt + 5} rotate={12} />
    </AbsoluteFill>
  );
};

/** 9 · Brand reveal. */
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const base = S.reveal;
  const fallAt = W('sol1', 4) - base; // "Fall"
  const f = spring({frame: frame - fallAt, fps, config: {stiffness: 300, damping: 13}});
  const rays = frame * 0.6;
  return (
    <AbsoluteFill>
      <GlowBg />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${rays}deg at 50% 36%, rgba(255,215,0,0.08) 0deg 8deg, rgba(0,0,0,0) 8deg 20deg)`,
        }}
      />
      <Leaves count={10} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 260}}>
          <ESULogo size={330} at={0} />
        </div>
        <div style={{position: 'absolute', top: 700, textAlign: 'center'}}>
          <div style={{fontFamily: FONT.display, fontSize: 132, color: ESU.white, letterSpacing: 6, lineHeight: 1}}>
            EURO SOCCER <span style={{color: ESU.red}}>USA</span>
          </div>
          {frame >= fallAt && (
            <div
              style={{
                display: 'inline-block',
                marginTop: 18,
                padding: '8px 40px 0',
                background: ESU.gradient.gold,
                borderRadius: 18,
                fontFamily: FONT.display,
                fontSize: 150,
                letterSpacing: 5,
                color: ESU.navyDeep,
                transform: `scale(${interpolate(f, [0, 1], [2, 1])}) rotate(-2deg)`,
                boxShadow: '0 20px 60px rgba(255,215,0,0.35)',
              }}
            >
              FALL ACADEMY
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 10 · What it is — facts as chips. */
const FactsScene: React.FC = () => {
  const base = S.facts;
  return (
    <AbsoluteFill>
      <Pitch at={-30} dim={0.62} tilt />
      <Leaves count={6} seed={9} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 230, display: 'flex', flexDirection: 'column', gap: 38, alignItems: 'center', transform: 'scale(1.12)', transformOrigin: '50% 0'}}>
          <Chip icon="26bd" label="Weekend soccer classes" at={W('sol2', 0) - base} />
          <Chip icon="1f4cd" label="The Sports Park · Playa Vista" at={W('sol2', 3) - base} accent={ESU.red} />
          <Chip icon="1f5d3" label="Sat & Sun mornings" at={W('sol2', 5) - base} />
          <Chip icon="1f60a" label="Ages 4 – 12" at={W('sol2', 7) - base} accent={ESU.red} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 11 · "with European-trained coaches, grouped by age and ability." */
const EuroScene: React.FC = () => {
  const base = S.euro;
  return (
    <AbsoluteFill>
      <GlowBg base={ESU.navyDeep} colors={['rgba(46,139,87,0.45)', 'rgba(26,58,107,0.9)', 'rgba(255,215,0,0.12)']} />
      <Center y={0.32}>
        <div style={{transform: 'scale(0.92)'}}>
          <TacticBoard at={2} />
        </div>
      </Center>
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 1150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, transform: 'scale(1.1)'}}>
          <Chip icon="1f3af" label="European-trained coaches" at={W('sol3', 1) - base} />
          <Chip icon="1f91d" label="Grouped by age & ability" at={W('sol3', 3) - base} accent={ESU.red} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 11b · Social proof: #1 in LA, 10,000+ kids, 20+ years. */
const ProofScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const base = S.proof;
  const rows = [
    {big: '#1', small: 'VOTED IN LOS ANGELES', at: W('sol4', 1) - base, icon: '1f3c6'},
    {big: 'count', small: 'KIDS COACHED', at: W('sol4', 5) - base, icon: '26bd'},
    {big: '20+', small: 'YEARS IN LA', at: W('sol4', 7) - base, icon: '2b50'},
  ];
  return (
    <AbsoluteFill>
      <GlowBg base={ESU.navyDeep} colors={['rgba(255,215,0,0.3)', 'rgba(26,58,107,0.9)', 'rgba(200,16,46,0.35)']} />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${frame * 0.5}deg at 50% 40%, rgba(255,215,0,0.06) 0deg 8deg, rgba(0,0,0,0) 8deg 20deg)`,
        }}
      />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 330, width: 820, display: 'flex', flexDirection: 'column', gap: 70, alignItems: 'flex-start'}}>
          {rows.map((r, i) => {
            if (frame < r.at) return null;
            const p = spring({frame: frame - r.at, fps, config: ESU.spring.stat});
            const n = Math.round(interpolate(frame - r.at, [0, 18], [0, 10000], {...clamp, easing: (x) => 1 - (1 - x) ** 3}));
            const big = r.big === 'count' ? `${n.toLocaleString('en-US')}+` : r.big;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 34,
                  transform: `translateX(${(1 - p) * -160}px) scale(${interpolate(p, [0, 1], [0.6, 1])})`,
                  transformOrigin: 'left center',
                  opacity: p,
                }}
              >
                <Img src={staticFile(`emoji/${r.icon}.svg`)} style={{width: 150, height: 150}} />
                <div>
                  <div style={{fontFamily: FONT.stat, fontWeight: 700, fontSize: 230, lineHeight: 0.95, color: i === 0 ? ESU.gold : ESU.white}}>
                    {big}
                  </div>
                  <div style={{fontFamily: FONT.caption, fontWeight: 800, fontSize: 44, color: 'rgba(255,255,255,0.85)', letterSpacing: 2}}>
                    {r.small}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 12 · "8 weeks from now, you'll notice it." — week counter. */
const WeeksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wk = Math.round(interpolate(frame, [0, 24], [1, 8], {...clamp, easing: (x) => x ** 1.6}));
  const pop = spring({frame: frame - 24, fps, config: ESU.spring.stat});
  return (
    <AbsoluteFill>
      <GlowBg base={ESU.navyDeep} />
      <Leaves count={8} seed={5} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 280, fontFamily: FONT.display, fontSize: 110, color: 'rgba(255,255,255,0.8)', letterSpacing: 8}}>
          WEEK
        </div>
        <div
          style={{
            position: 'absolute',
            top: 380,
            fontFamily: FONT.stat,
            fontWeight: 700,
            fontSize: 520,
            lineHeight: 1,
            color: wk === 8 ? ESU.gold : ESU.white,
            transform: `scale(${1 + (frame >= 24 ? (1 - pop) * 0.25 : 0)})`,
            textShadow: '0 20px 80px rgba(0,0,0,0.5)',
          }}
        >
          {wk}
        </div>
        <div style={{position: 'absolute', top: 960, display: 'flex', gap: 14}}>
          {new Array(8).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                width: 84,
                height: 18,
                borderRadius: 9,
                background: i < wk ? ESU.gold : 'rgba(255,255,255,0.18)',
                boxShadow: i < wk ? '0 0 20px rgba(255,215,0,0.5)' : undefined,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 13 · Outcomes as a player-card "stat upgrade". */
const CardScene: React.FC = () => {
  const base = S.card;
  return (
    <AbsoluteFill>
      <GlowBg base={ESU.navyDeep} colors={['rgba(255,215,0,0.35)', 'rgba(26,58,107,0.9)', 'rgba(200,16,46,0.3)']} />
      <Center y={0.38}>
        <PlayerCard
          at={0}
          stats={[
            {label: 'SCREEN TIME', from: 6.7, to: 2.9, at: 8, invert: true, suffix: 'h'},
            {label: 'CONFIDENCE', from: 58, to: 92, at: W('out2', 1) - base},
            {label: 'FRIENDS', from: 51, to: 88, at: W('out2', 3) - base},
            {label: 'SKILLS', from: 46, to: 86, at: W('out2', 5) - base},
          ]}
        />
      </Center>
    </AbsoluteFill>
  );
};

/** 14 · Callback to the chat: now the kid is asking for soccer. */
const CallbackScene: React.FC = () => {
  const base = S.callback;
  const a = W('out3', 5) - base; // "is it Saturday yet?"
  return (
    <AbsoluteFill>
      <GlowBg base="#101418" colors={['rgba(46,139,87,0.45)', 'rgba(26,58,107,0.8)', 'rgba(255,215,0,0.2)']} />
      <Leaves count={7} seed={2} />
      <Center y={0.36}>
        <Chat
          name="Leo 🦖"
          avatar="1f929"
          tone="light"
          msgs={[
            {text: 'mom', at: 3},
            {text: 'is it saturday yet?? ⚽⚽', at: a, big: true},
            {text: '2 more sleeps 😂', at: a + 22, me: true},
          ]}
        />
      </Center>
      <Emoji code="1f979" size={150} x={900} y={1060} at={a + 24} rotate={8} />
    </AbsoluteFill>
  );
};

/** 15 · Soft CTA end card. */
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const base = S.cta;
  const tapAt = W('cta1', 4) - base; // "Tap"
  const btn = spring({frame: frame - tapAt, fps, config: ESU.spring.headline});
  const pulse = 1 + Math.max(0, Math.sin((frame - tapAt) / 5)) * 0.04;
  const title = spring({frame: frame - 4, fps, config: ESU.spring.headline});
  return (
    <AbsoluteFill>
      <Pitch at={-40} dim={0.72} />
      <Leaves count={9} seed={7} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 170}}>
          <ESULogo size={230} at={0} />
        </div>
        <div style={{position: 'absolute', top: 470, textAlign: 'center', transform: `translateY(${(1 - title) * 60}px)`, opacity: title}}>
          <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 104, color: ESU.white, lineHeight: 1}}>
            Fall starts this weekend.
          </div>
          <div style={{fontFamily: FONT.display, fontSize: 150, color: ESU.gold, letterSpacing: 5, marginTop: 20, lineHeight: 1}}>
            FALL ACADEMY
          </div>
          <div style={{fontFamily: FONT.caption, fontWeight: 700, fontSize: 44, color: 'rgba(255,255,255,0.92)', marginTop: 16, lineHeight: 1.35}}>
            Oct 3 – Nov 22 · Sat &amp; Sun · Ages 4–12
            <br />
            The Sports Park · Playa Vista
          </div>
        </div>
        {frame >= tapAt && (
          <div style={{position: 'absolute', top: 1010, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
            <div
              style={{
                fontFamily: FONT.caption,
                fontWeight: 800,
                fontSize: 64,
                color: ESU.white,
                background: ESU.gradient.accent,
                padding: '30px 64px',
                borderRadius: 999,
                transform: `scale(${btn * pulse})`,
                boxShadow: '0 24px 70px rgba(200,16,46,0.55), inset 0 -6px 0 rgba(0,0,0,0.2)',
              }}
            >
              FIND YOUR KID’S CLASS →
            </div>
            <div style={{fontFamily: FONT.caption, fontWeight: 700, fontSize: 46, color: ESU.white, opacity: btn}}>
              eurosoccerusa.com · link in bio
            </div>
          </div>
        )}
      </AbsoluteFill>
      <Emoji code="1f447" size={120} x={540} y={1370} at={tapAt + 12} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ sound design
const SoundDesign: React.FC = () => (
  <>
    {/* hook */}
    <Sfx at={0} name="boom" volume={0.55} />
    <Sfx at={2} name="whoosh" volume={0.35} />
    <Sfx at={22} name="ding" volume={0.35} />
    <Sfx at={S.badMom} name="glitch" volume={0.3} />
    <Sfx at={W('hook2', 1)} name="pop" volume={0.5} />
    <Sfx at={S.ipad} name="whoosh_long" volume={0.35} />
    <Sfx at={W('hook3', 6)} name="boom" volume={0.45} />
    {/* pain */}
    <Sfx at={S.nineAm} name="swipe" volume={0.4} />
    <Sfx at={W('pain1', 3)} name="ding" volume={0.3} />
    <Sfx at={W('pain1', 5)} name="ding" volume={0.3} />
    <Sfx at={W('pain1', 7)} name="ding" volume={0.35} />
    <Sfx at={S.bored} name="whoosh" volume={0.3} />
    {[0, 4, 8, 14].map((d) => (
      <Sfx key={d} at={W('pain2', 0) + d} name="pop" volume={0.45} />
    ))}
    <Sfx at={W('pain2', 4) - 2} name="pop" volume={0.45} />
    <Sfx at={W('pain2', 4)} name="boom" volume={0.3} />
    <Sfx at={S.google} name="swipe" volume={0.35} />
    <Sfx at={S.google + 4} name="typing" volume={0.4} />
    <Sfx at={S.stat} name="whoosh" volume={0.35} />
    <Sfx at={W('pain4', 6)} name="boom" volume={0.5} />
    <Sfx at={W('pain4', 13)} name="kick" volume={0.45} />
    <Sfx at={W('pain4', 14)} name="kick" volume={0.45} />
    <Sfx at={W('pain4', 15)} name="boom" volume={0.45} />
    <Sfx at={S.blackout - 6} name="tape_stop" volume={0.35} />
    {/* turn / solution */}
    <Sfx at={S.turn} name="boom" volume={0.6} />
    <Sfx at={S.turn} name="whistle" volume={0.3} />
    <Sfx at={W('turn1', 5) - 2} name="kick" volume={0.6} />
    <Sfx at={W('turn1', 7)} name="whoosh" volume={0.35} />
    <Sfx at={W('turn1', 9)} name="sparkle" volume={0.35} />
    <Sfx at={S.reveal} name="whoosh_long" volume={0.4} />
    <Sfx at={S.reveal + 6} name="crowd" volume={0.35} />
    <Sfx at={W('sol1', 4)} name="boom" volume={0.45} />
    {[0, 3, 5, 7].map((n) => (
      <Sfx key={n} at={W('sol2', n)} name="pop" volume={0.4} />
    ))}
    <Sfx at={S.euro} name="swipe" volume={0.35} />
    {[0, 1, 2, 3].map((i) => (
      <Sfx key={i} at={S.euro + 10 + i * 11} name="kick" volume={0.3} />
    ))}
    <Sfx at={W('sol3', 1)} name="pop" volume={0.4} />
    <Sfx at={W('sol3', 3)} name="pop" volume={0.4} />
    <Sfx at={S.proof} name="whoosh_long" volume={0.35} />
    <Sfx at={W('sol4', 1)} name="boom" volume={0.45} />
    <Sfx at={W('sol4', 1)} name="sparkle" volume={0.3} />
    <Sfx at={W('sol4', 5)} name="riser" volume={0.18} />
    <Sfx at={W('sol4', 5) + 18} name="boom" volume={0.35} />
    <Sfx at={W('sol4', 7)} name="pop" volume={0.45} />
    <Sfx at={S.weeks} name="whoosh" volume={0.35} />
    {new Array(7).fill(0).map((_, i) => (
      <Sfx key={i} at={S.weeks + Math.round(24 * ((i + 1) / 7) ** (1 / 1.6))} name="tick" volume={0.4} />
    ))}
    <Sfx at={S.weeks + 24} name="boom" volume={0.4} />
    <Sfx at={S.card} name="whoosh_long" volume={0.4} />
    <Sfx at={W('out2', 1)} name="sparkle" volume={0.3} />
    <Sfx at={W('out2', 3)} name="pop" volume={0.4} />
    <Sfx at={W('out2', 5)} name="pop" volume={0.4} />
    <Sfx at={S.callback} name="swipe" volume={0.35} />
    <Sfx at={S.callback + 3} name="pop" volume={0.4} />
    <Sfx at={W('out3', 5)} name="pop" volume={0.5} />
    <Sfx at={W('out3', 5) + 22} name="ding" volume={0.35} />
    <Sfx at={S.cta} name="whoosh_long" volume={0.4} />
    <Sfx at={W('cta1', 4)} name="boom" volume={0.35} />
    <Sfx at={W('cta1', 4) + 2} name="click" volume={0.5} />
  </>
);

// ------------------------------------------------------------------ root
export const ESU_FallLaunch: React.FC = () => {
  const [handle] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    loadAllFonts().then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{background: ESU.dark}}>
      <Scene from={S.hook} to={S.badMom} push={0.05} shakes={[0, 22]}>
        <HookScene />
      </Scene>
      <Scene from={S.badMom} to={S.ipad} push={0.04} punches={[{at: W('hook2', 1) - S.badMom, amount: 0.06}]}>
        <BadMomScene />
      </Scene>
      <Scene from={S.ipad} to={S.nineAm} push={0.07} shakes={[W('hook3', 6) - S.ipad]}>
        <IpadScene />
      </Scene>
      <Scene from={S.nineAm} to={S.bored} push={0.06}>
        <NineAmScene />
      </Scene>
      <Scene from={S.bored} to={S.google} push={0.05} punches={[{at: W('pain2', 4) - S.bored, amount: 0.08}]} shakes={[W('pain2', 4) - S.bored]}>
        <BoredScene />
      </Scene>
      <Scene from={S.google} to={S.stat} push={0.08} punches={[{at: W('pain3', 9) - S.google, amount: 0.07}]}>
        <GoogleScene />
      </Scene>
      <Scene
        from={S.stat}
        to={S.blackout}
        push={0.06}
        shakes={[W('pain4', 6) - S.stat, W('pain4', 13) - S.stat, W('pain4', 14) - S.stat, W('pain4', 15) - S.stat]}
        punches={[{at: W('pain4', 15) - S.stat, amount: 0.06}]}
      >
        <StatScene />
      </Scene>
      {/* S.blackout → S.turn: pure black "gasp" before the drop */}
      <Scene from={S.turn} to={S.reveal} push={0.06} shakes={[0, W('turn1', 5) - S.turn]}>
        <TurnScene />
      </Scene>
      <Scene from={S.reveal} to={S.facts} push={0.05} shakes={[W('sol1', 4) - S.reveal]}>
        <RevealScene />
      </Scene>
      <Scene from={S.facts} to={S.euro} push={0.05}>
        <FactsScene />
      </Scene>
      <Scene from={S.euro} to={S.proof} push={0.05}>
        <EuroScene />
      </Scene>
      <Scene
        from={S.proof}
        to={S.weeks}
        push={0.05}
        shakes={[W('sol4', 1) - S.proof, W('sol4', 5) - S.proof + 18]}
      >
        <ProofScene />
      </Scene>
      <Scene from={S.weeks} to={S.card} push={0.04} shakes={[24]}>
        <WeeksScene />
      </Scene>
      <Scene from={S.card} to={S.callback} push={0.05}>
        <CardScene />
      </Scene>
      <Scene from={S.callback} to={S.cta} push={0.05}>
        <CallbackScene />
      </Scene>
      <Scene from={S.cta} to={S.end} push={0.05}>
        <CtaScene />
      </Scene>

      {/* cut flashes */}
      {[S.badMom, S.nineAm, S.stat, S.reveal, S.proof, S.weeks, S.cta].map((f) => (
        <Flash key={f} at={f} length={5} peak={0.55} />
      ))}
      <Flash at={S.turn} length={9} peak={1} />

      <ESUCaptions
        y={0.71}
        yByLine={{hook1: 0.73, hook3: 0.75, pain4: 0.74, turn1: 0.74, out3: 0.74}}
        hide={['hook2', 'sol1', 'sol3', 'sol4', 'cta1']}
        hidePages={['pain4:13']}
        highlight={['saturday', 'ipad', 'screen', 'bored', 'again', 'ball', 'team', 'coach', 'europeantrained', 'ability', 'confidence', 'friends', 'skills', '8']}
        serif={['hundredth', 'actually', 'believes', 'notice', 'yet']}
      />

      <Grain opacity={0.08} />
      <ProgressBar />

      <Audio src={staticFile('audio/vo.wav')} volume={1} />
      <Audio
        src={staticFile('audio/music.wav')}
        volume={(f) => interpolate(f, [0, 8, TOTAL_FRAMES - 30, TOTAL_FRAMES], [0.3, 0.22, 0.22, 0], clamp)}
      />
      <SoundDesign />
    </AbsoluteFill>
  );
};
