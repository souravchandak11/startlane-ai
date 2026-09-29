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
import {Burst, Camera, ColorFlood, Flash, Grain, GlowBg, Sfx, Shockwave} from '../components/ESU_Fx';
import {Chat, LockScreen, ScreenTimeCard, SearchBar} from '../components/ESU_UI';
import {BouncingBall, Jersey, Pitch, PlayerCard} from '../components/ESU_Soccer';
import {ESULogo} from '../components/ESU_Logo';
import {GlitchCut, Mono, NewsClip, Stepped, TabletAutoplay, TypeCard, WhiteCard} from '../components/ESU_Type';
import {BlockWipe, CardCloud, ChalkBoard, InlineSentence, InvertFlash, PaperStage, Print} from '../components/ESU_Paper';
import {Clip, CornerLogos, hasClip, photo, PhotoBg, PHOTOS, SponsorLockup} from '../components/ESU_Footage';

/**
 * In-points (seconds into each source clip) for the real footage, following the
 * OmniFlash shot lists. Tune these once the clips are in public/footage.
 */
const CUES = {
  sofa: {hook: 0.0, tablet: 2.8, nineAm: 5.6},
  kick: {strike: 9.0},
  match: {team: 0.0, coach: 0.8, facts: 4.5},
  winning: {weeks: 4.8, card: 6.6},
};

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
/** every spoken word's start frame — drives the per-word camera bumps */
const WORD_FRAMES = timeline.lines.flatMap((l) => l.words.map((w) => Math.round(w.start * FPS)));

// Shot boundaries (absolute frames). Every cut lands on a VO word.
const S = {
  hook: 0,
  badMom: L('hook2'),
  tablet: L('hook3'),
  inline: W('hook3', 5),
  nineAm: L('pain1'),
  bored: L('pain2'),
  google: L('pain3'),
  again: W('pain3', 9),
  news: L('pain4'),
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
  euro: L('sol3'),
  euroCard: W('sol3', 3),
  proof1: L('sol4'),
  proof2: W('sol4', 4),
  proof3: W('sol4', 7),
  weeks: L('out1'),
  card: L('out2'),
  callback: L('out3'),
  cta: L('cta1'),
  logo: TOTAL_FRAMES - 40,
  end: TOTAL_FRAMES,
};

/** A shot: its own Sequence + camera (push-in, crop cuts, shake), optional B&W and stepped motion. */
const Shot: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
  push?: number;
  cuts?: {at: number; scale: number; x?: number; y?: number}[];
  shakes?: number[];
  mono?: boolean;
  stepped?: boolean;
  overlay?: React.ReactNode;
}> = ({from, to, children, push, cuts, shakes, mono, stepped, overlay}) => {
  // cut/shake times are written as absolute frames for readability; make them shot-relative
  const rel = (f: number) => f - from;
  const bumps = WORD_FRAMES.filter((f) => f > from + 2 && f < to).map(rel);
  let body = (
    <Camera
      durationInFrames={to - from}
      push={push}
      cuts={cuts?.map((c) => ({...c, at: rel(c.at)}))}
      shakes={shakes?.map(rel)}
      bumps={bumps}
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

const Center: React.FC<{children: React.ReactNode; y?: number}> = ({children, y = 0.4}) => (
  <AbsoluteFill style={{alignItems: 'center'}}>
    <div style={{position: 'absolute', top: `${y * 100}%`, transform: 'translateY(-50%)'}}>{children}</div>
  </AbsoluteFill>
);

const emoji = (code: string, size = 56) => <Img src={staticFile(`emoji/${code}.svg`)} style={{width: size, height: size}} />;

// ------------------------------------------------------------------ HOOK (color)
const HookShot: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {hasClip('sofa') ? (
        <Clip slot="sofa" inSec={CUES.sofa.hook} />
      ) : (
        <GlowBg base="#0b0b10" colors={['rgba(229,50,45,0.55)', 'rgba(20,24,40,0.9)', 'rgba(229,50,45,0.2)']} />
      )}
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 300, display: 'flex', alignItems: 'baseline', gap: 20, color: ESU.white, textShadow: '0 8px 30px rgba(0,0,0,0.6)'}}>
          <span style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 108}}>Moms of kids</span>
          <span style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 96, letterSpacing: -3}}>4–12</span>
        </div>
      </AbsoluteFill>
      <Center y={hasClip('sofa') ? 0.52 : 0.46}>
        <div style={{transform: `scale(${hasClip('sofa') ? 0.82 : 1})`}}>
          <ScreenTimeCard at={0} />
        </div>
      </Center>
      <AbsoluteFill
        style={{boxShadow: `inset 0 0 ${120 + Math.sin(frame / 3) * 40}px rgba(229,50,45,${0.35 + Math.sin(frame / 3) * 0.15})`}}
      />
    </AbsoluteFill>
  );
};

const TabletShot: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({frame, fps, config: ESU.spring.photo});
  return (
    <AbsoluteFill>
      {hasClip('sofa') ? (
        <Clip slot="sofa" inSec={CUES.sofa.tablet} />
      ) : (
        <>
          <GlowBg base="#07080d" colors={['rgba(80,120,255,0.45)', 'rgba(20,24,40,0.9)', 'rgba(229,50,45,0.2)']} />
          <Center y={0.4}>
            <div style={{transform: `translateY(${(1 - s) * 500}px) rotate(${interpolate(s, [0, 1], [8, -3])}deg)`}}>
              <TabletAutoplay />
            </div>
          </Center>
        </>
      )}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ PAIN (B&W, stepped)
const NineAmShot: React.FC = () => {
  const base = S.nineAm;
  return (
    <AbsoluteFill>
      {hasClip('sofa') ? (
        <>
          <Clip slot="sofa" inSec={CUES.sofa.nineAm} grade="mono" />
          <AbsoluteFill style={{background: 'rgba(0,0,0,0.35)'}} />
        </>
      ) : (
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#2a2f3a 0%,#1a1c22 60%,#0e0f12 100%)'}} />
      )}
      <Center y={0.42}>
        <LockScreen
          notes={[
            {icon: '1f3ae', app: 'Games', text: 'Your friends are playing. Jump back in!', at: W('pain1', 3) - base},
            {icon: '1f4fa', app: 'Videos', text: 'Up next: 47 more episodes', at: W('pain1', 4) + 6 - base},
            {icon: '23f0', app: 'Screen Time', text: 'Time limit reached. Ignore limit?', at: W('pain1', 6) - base},
          ]}
        />
      </Center>
    </AbsoluteFill>
  );
};

const BoredShot: React.FC = () => {
  const a = W('pain2', 0) - S.bored;
  return (
    <PaperStage>
      <Center y={0.4}>
        <Print rotate={-4} pullFrom={2.2} border={16}>
        <div style={{zoom: 0.74}}>
        <Chat
          name="Leo 🦖"
          avatar="1f629"
          tone="dark"
          msgs={[
            {text: 'mom', at: a},
            {text: 'mom', at: a + 4},
            {text: 'MOM', at: a + 8, big: true},
            {text: "i'm boreddd 😩", at: a + 14},
            {text: 'can i have the ipad', at: W('pain2', 6) - S.bored + 8},
          ]}
        />
        </div>
        </Print>
      </Center>
    </PaperStage>
  );
};

const GoogleShot: React.FC = () => (
  <PaperStage>
    <Center y={0.38}>
      <Print rotate={3} border={14} bg="#fafafa">
        <div style={{background: '#1b1b1f', padding: '46px 30px 60px', width: 900}}>
          <div style={{zoom: 0.93}}>
            <SearchBar at={2} cps={34} query="how to get my kid off the ipad" suggestions={[' without a meltdown', ' on weekends', ' at 7 years old']} />
          </div>
        </div>
      </Print>
    </Center>
  </PaperStage>
);

/** "…hand over the [tablet] iPad again." — words on one line either side of a print (MMH inline sentence). */
const InlineShot: React.FC = () => {
  const r = (n: number) => W('hook3', n) - S.inline;
  return (
    <PaperStage>
      <InlineSentence
        cardAt={0}
        left={[
          {t: 'hand', at: r(5)},
          {t: 'over', at: r(6)},
          {t: 'the', at: r(7)},
        ]}
        right={[
          {t: 'iPad', at: r(8)},
          {t: 'again.', at: r(9)},
        ]}
        card={
          <Print rotate={-5} pullFrom={2.8} border={10}>
            <div style={{width: 392, height: 280, overflow: 'hidden'}}>
              <div style={{zoom: 0.4}}>
                <TabletAutoplay />
              </div>
            </div>
          </Print>
        }
      />
    </PaperStage>
  );
};

const NewsShot: React.FC = () => (
  <AbsoluteFill style={{background: '#101010'}}>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #3a3a3a 0%, #0c0c0c 70%)'}} />
    <Center y={0.42}>
      <NewsClip
        kicker="Common Sense Media"
        before="Kids 8–12 now average"
        highlight="5½ hours"
        after="of screen time a day"
        source="The Common Sense Census: Media Use by Tweens and Teens (2021)"
        highlightAt={W('pain4', 6) - S.news}
      />
    </Center>
  </AbsoluteFill>
);

const BigNumberShot: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: ESU.spring.stat});
  return (
    <AbsoluteFill style={{background: '#050505', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', transform: `scale(${interpolate(p, [0, 1], [1.25, 1])})`}}>
        <div style={{fontFamily: FONT.stat, fontWeight: 700, fontSize: 470, lineHeight: 0.9, color: ESU.white}}>5½</div>
        <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 120, color: ESU.white, marginTop: 10}}>hours a day.</div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ TURN (color returns on "A ball.")
const BallShot: React.FC = () => (
  <AbsoluteFill>
    {/* the B&W world floods back to colour from the ball's first bounce */}
    {/* ball is released 14 frames early so its first bounce lands exactly on the beat drop */}
    <ColorFlood at={1} x={540} y={990} frames={16}>
      {hasClip('kick') ? (
        <Clip slot="kick" inSec={CUES.kick.strike} scrim="none" />
      ) : (
        <>
          <Pitch at={-10} dim={0.25} />
          <BouncingBall at={-14} x={540} floorY={1000} size={360} />
        </>
      )}
    </ColorFlood>
    <Shockwave at={1} x={540} y={995} color="rgba(255,255,255,0.85)" maxR={1100} />
    <Burst at={1} x={540} y={995} count={22} spread={480} colors={['#9be89b', ESU.white, '#3fbf6a']} />
  </AbsoluteFill>
);

const TeamShot: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      {hasClip('match') ? (
        <Clip slot="match" inSec={CUES.match.team} />
      ) : photo(2) ? (
        <PhotoBg i={2} dim={0.25} />
      ) : (
        <Pitch at={-40} dim={0.3} tilt={false} />
      )}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: hasClip('match') || photo(2) ? 0 : 1}}>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: 900, gap: '10px 18px', marginTop: -200}}>
          {[7, 9, 10, 11, 4, 8].map((n, i) => {
            const s = spring({frame: frame - i * 2, fps, config: {stiffness: 320, damping: 14}});
            return (
              <div key={n} style={{transform: `translateY(${(1 - s) * 160}px) scale(${s})`}}>
                <Jersey num={n} size={250} color={i % 2 ? ESU.red : ESU.navy} trim={i % 2 ? ESU.white : ESU.red} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CoachShot: React.FC = () => (
  <AbsoluteFill>
    {hasClip('match') ? (
      <Clip slot="match" inSec={CUES.match.coach} />
    ) : photo(3) ? (
      <PhotoBg i={3} dim={0.3} />
    ) : (
      <Pitch at={-60} dim={0.5} />
    )}
    <Center y={0.4}>
      <div style={{transform: 'scale(1.12)'}}>
        <WhiteCard at={4} icon={emoji('1f64c', 60)} title="“That was ALL you!”" body="Coach, after your kid’s first goal" width={860} />
      </div>
    </Center>
  </AbsoluteFill>
);

// ------------------------------------------------------------------ SOLUTION
const RevealShot: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fallAt = W('sol1', 4) - S.reveal;
  const f = spring({frame: frame - fallAt, fps, config: {stiffness: 300, damping: 16}});
  return (
    <AbsoluteFill style={{background: '#050505'}}>
      {photo(0) && <PhotoBg i={0} dim={0.72} blur={5} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, rgba(255,190,90,0.28) 0%, rgba(24,17,69,0.35) 40%, rgba(0,0,0,0) 70%)'}} />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${frame * 0.4}deg at 50% 28%, rgba(255,220,160,0.07) 0deg 6deg, rgba(0,0,0,0) 6deg 18deg)`,
          opacity: interpolate(frame, [4, 14], [0, 1], clamp),
        }}
      />
      <Shockwave at={6} x={540} y={530} color="rgba(255,215,0,0.8)" maxR={1000} />
      <Burst at={6} x={540} y={530} count={34} spread={700} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 250}}>
          <ESULogo size={600} at={0} glow enter="slam" />
        </div>
        <div style={{position: 'absolute', top: 870, textAlign: 'center'}}>
          {frame >= fallAt && (
            <div
              style={{
                marginTop: 18,
                fontFamily: FONT.serif,
                fontStyle: 'italic',
                fontSize: 170,
                color: ESU.gold,
                lineHeight: 1,
                opacity: f,
                transform: `translateY(${(1 - f) * 20}px)`,
              }}
            >
              Fall Academy
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FactsShot: React.FC = () => {
  const base = S.facts;
  return (
    <AbsoluteFill>
      {hasClip('match') ? (
        <Clip slot="match" inSec={CUES.match.facts} />
      ) : photo(1) ? (
        <PhotoBg i={1} dim={0.35} />
      ) : (
        <Pitch at={-30} dim={0.55} />
      )}
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 380, display: 'flex', flexDirection: 'column', gap: 26}}>
          <WhiteCard at={W('sol2', 0) - base} icon={emoji('26bd')} title="Weekend soccer classes" body="Real coaching, real games" />
          <WhiteCard at={W('sol2', 4) - base} icon={emoji('1f4cd')} title="The Sports Park" body="13196 Bluff Creek Dr · Playa Vista" />
          <WhiteCard at={W('sol2', 5) - base} icon={emoji('1f5d3')} title="Sat & Sun mornings" body="8 weeks · Oct 3 – Nov 22" />
          <WhiteCard at={W('sol2', 7) - base} icon={emoji('1f60a')} title="Ages 4–12" body="Toddler classes (1–3) too" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const EuroShot: React.FC = () => <ChalkBoard at={0} />;

const KidsCloudShot: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [4, 24], [0, 10000], {...clamp, easing: (x) => 1 - (1 - x) ** 3}));
  const bgs = ['#181145', '#ED1C24', '#2e6332', '#2a2a30', '#c9ae2d', '#0531c5'];
  const icons = ['1f466-1f3fd', '1f467-1f3fc', '26bd', '1f9d2-1f3fd', '1f3c5', '1f466-1f3ff', '1f467-1f3fe', '1f3c6', '1f466-1f3fb', '1f467-1f3fb', '1f945', '1f466-1f3fe'];
  return (
    <CardCloud
      at={0}
      every={2}
      lead="kids coached"
      big={`${n.toLocaleString('en-US')}+`}
      cards={icons.map((icon, i) => ({icon, bg: bgs[i % bgs.length], photo: PHOTOS.length && i % 3 !== 2 ? photo(i)!.file : undefined}))}
    />
  );
};

const ProofStat: React.FC<{big: string; small: string; count?: number; gold?: boolean; bg?: number}> = ({big, small, count, gold, bg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: ESU.spring.stat});
  const n = count ? Math.round(interpolate(frame, [0, 18], [0, count], {...clamp, easing: (x) => 1 - (1 - x) ** 3})) : 0;
  return (
    <AbsoluteFill style={{background: '#050505', alignItems: 'center', justifyContent: 'center'}}>
      {bg !== undefined && photo(bg) && <PhotoBg i={bg} dim={0.62} mono />}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, rgba(255,190,90,0.22) 0%, rgba(0,0,0,0) 60%)'}} />
      <div style={{textAlign: 'center', transform: `scale(${interpolate(p, [0, 1], [1.2, 1])})`, marginTop: -160}}>
        <div style={{fontFamily: FONT.stat, fontWeight: 700, fontSize: count ? 300 : 420, lineHeight: 0.9, color: gold ? ESU.gold : ESU.white}}>
          {count ? `${n.toLocaleString('en-US')}+` : big}
        </div>
        <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 104, color: ESU.white, marginTop: 20}}>{small}</div>
      </div>
    </AbsoluteFill>
  );
};

const WeeksShot: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wk = Math.round(interpolate(frame, [0, 24], [1, 8], {...clamp, easing: (x) => x ** 1.6}));
  const pop = spring({frame: frame - 24, fps, config: ESU.spring.stat});
  return (
    <AbsoluteFill>
      {hasClip('winning') ? (
        <>
          <Clip slot="winning" inSec={CUES.winning.weeks} />
          <AbsoluteFill style={{background: 'rgba(11,8,38,0.45)'}} />
        </>
      ) : PHOTOS.length ? (
        // one real photo per week tick — an MMH-style 0.1–0.3 s flash montage
        <>
          <PhotoBg i={wk - 1} dim={0.5} drift={2} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,8,38,0.55), rgba(11,8,38,0.2) 50%, rgba(11,8,38,0.65))'}} />
        </>
      ) : (
        <GlowBg base={ESU.navyDeep} />
      )}
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 280, fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 130, color: 'rgba(255,255,255,0.9)', textShadow: '0 4px 30px rgba(0,0,0,0.6)'}}>week</div>
        <div
          style={{
            position: 'absolute',
            top: 440,
            fontFamily: FONT.stat,
            fontWeight: 700,
            fontSize: 520,
            lineHeight: 1,
            textShadow: '0 20px 60px rgba(0,0,0,0.55)',
            color: wk === 8 ? ESU.gold : ESU.white,
            transform: `scale(${1 + (frame >= 24 ? (1 - pop) * 0.25 : 0)})`,
          }}
        >
          {wk}
        </div>
        <div style={{position: 'absolute', top: 1000, display: 'flex', gap: 14}}>
          {new Array(8).fill(0).map((_, i) => (
            <div key={i} style={{width: 84, height: 16, borderRadius: 8, background: i < wk ? ESU.gold : 'rgba(255,255,255,0.18)'}} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CardShot: React.FC = () => {
  const base = S.card;
  return (
    <AbsoluteFill>
      {hasClip('winning') ? (
        <>
          <Clip slot="winning" inSec={CUES.winning.card} />
          <AbsoluteFill style={{background: 'rgba(11,8,38,0.35)'}} />
        </>
      ) : photo(6) ? (
        <PhotoBg i={6} dim={0.55} blur={3} />
      ) : (
        <GlowBg base={ESU.navyDeep} colors={['rgba(255,215,0,0.3)', 'rgba(43,33,112,0.9)', 'rgba(237,28,36,0.3)']} />
      )}
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

/** Floating chat bubbles over live footage (the "is it saturday yet??" payoff). */
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

const CallbackShot: React.FC = () => {
  const a = W('out3', 5) - S.callback;
  if (hasClip('prep')) {
    // real footage: the boy, already in kit, bouncing a ball at mom's bed at sunrise
    return (
      <AbsoluteFill>
        {/* source bed scene is 0–1.79 s; slowed slightly to fill the line */}
        <Clip slot="prep" inSec={0} rate={0.76} />
        <FloatingChat a={a} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <GlowBg base="#0f1412" colors={['rgba(46,139,87,0.45)', 'rgba(43,33,112,0.8)', 'rgba(255,190,90,0.25)']} />
      <Center y={0.38}>
        <Chat
          name="Leo 🦖"
          avatar="1f929"
          tone="light"
          msgs={[
            {text: 'mom', at: 3},
            {text: 'is it saturday yet?? ⚽⚽', at: a, big: true},
            {text: '2 more sleeps 😂', at: a + 18, me: true},
          ]}
        />
      </Center>
    </AbsoluteFill>
  );
};

/** Soft CTA over the real "walk to the field" footage: car mirror → photo in a book → walking in. */
const CtaFootageShot: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tapAt = W('cta1', 4) - S.cta;
  // source cuts (scene-detected): car 1.79–3.17 s, book 3.17–4.17 s, walk 4.17 s →
  const bookAt = Math.round(1.38 * fps);
  const walkAt = W('cta1', 8) - S.cta; // "find your kid's class"
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
          <Clip slot="prep" inSec={3.17} rate={Math.min(1, 1.0 / ((walkAt - bookAt) / fps))} />
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
                  style={{
                    fontFamily: FONT.ui,
                    fontWeight: 600,
                    fontSize: 38,
                    color: 'rgba(255,255,255,0.95)',
                    lineHeight: 1.55,
                    opacity: r,
                    transform: `translateX(${(1 - r) * 40}px)`,
                  }}
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

const CtaShot: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tapAt = W('cta1', 4) - S.cta;
  const btn = spring({frame: frame - tapAt, fps, config: ESU.spring.headline});
  const pulse = 1 + Math.max(0, Math.sin((frame - tapAt) / 5)) * 0.035;
  const title = spring({frame: frame - 2, fps, config: ESU.spring.headline});
  return (
    <AbsoluteFill>
      <Pitch at={-40} dim={0.72} />
      <AbsoluteFill style={{alignItems: 'center'}}>
        <div style={{position: 'absolute', top: 120}}>
          <ESULogo size={300} at={0} shimmer={false} />
        </div>
        <div style={{position: 'absolute', top: 470, textAlign: 'center', opacity: title, transform: `translateY(${(1 - title) * 30}px)`}}>
          <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 112, color: ESU.white, lineHeight: 1}}>Fall starts this weekend.</div>
          <div style={{fontFamily: FONT.display, fontSize: 140, color: ESU.gold, letterSpacing: 6, marginTop: 22, lineHeight: 1}}>FALL ACADEMY</div>
          <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 42, color: 'rgba(255,255,255,0.92)', marginTop: 18, lineHeight: 1.4}}>
            Oct 3 – Nov 22 · Sat &amp; Sun · Ages 4–12
            <br />
            The Sports Park · Playa Vista
          </div>
        </div>
        {frame >= tapAt && (
          <div style={{position: 'absolute', top: 1020, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
            <div
              style={{
                fontFamily: FONT.ui,
                fontWeight: 700,
                fontSize: 58,
                letterSpacing: -1,
                color: '#111',
                background: ESU.white,
                padding: '30px 60px',
                borderRadius: 999,
                transform: `scale(${btn * pulse})`,
                boxShadow: '0 24px 70px rgba(0,0,0,0.5)',
              }}
            >
              Find your kid’s class →
            </div>
            <div style={{position: 'absolute', left: '50%', top: 64, width: 0, height: 0}}>
              <Shockwave at={tapAt + 4} x={0} y={0} color="rgba(255,255,255,0.8)" maxR={300} />
            </div>
            <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 44, color: ESU.white, opacity: btn}}>link in bio · eurosoccerusa.com</div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LogoShot: React.FC = () => (
  <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 70, marginTop: -60}}>
      <ESULogo size={420} at={0} enter="wipe" />
      <SponsorLockup at={10} />
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------------ mix
/** Music ducks ~10 dB under the voice and swells in the gaps (drop, blackout, end card). */
const musicVolume = (f: number) => {
  const t = f / FPS;
  const DUCK = 0.07;
  const OPEN = 0.24;
  let dist = Infinity;
  for (const l of timeline.lines) {
    if (t >= l.start - 0.08 && t <= l.end + 0.08) {
      dist = 0;
      break;
    }
    dist = Math.min(dist, Math.abs(t - l.start), Math.abs(t - l.end));
  }
  const v = interpolate(dist, [0, 0.25], [DUCK, OPEN], clamp);
  const fadeOut = interpolate(f, [S.logo - 4, S.logo + 20], [1, 0], clamp);
  return v * fadeOut;
};

const SoundDesign: React.FC = () => (
  <>
    {/* hook */}
    <Sfx at={0} name="boom" volume={0.5} />
    <Sfx at={1} name="whoosh" volume={0.35} />
    <Sfx at={20} name="ding" volume={0.3} />
    <Sfx at={W('hook1', 5)} name="tick" volume={0.5} />
    <Sfx at={S.badMom} name="swipe" volume={0.4} />
    <Sfx at={W('hook2', 1)} name="pop" volume={0.45} />
    <Sfx at={S.tablet} name="whoosh_long" volume={0.35} />
    <Sfx at={W('hook3', 3)} name="tick" volume={0.45} />
    <Sfx at={S.inline} name="swipe" volume={0.4} />
    <Sfx at={S.inline + 2} name="shutter" volume={0.35} />
    <Sfx at={W('hook3', 9)} name="tick" volume={0.45} />
    {/* pain */}
    <Sfx at={S.nineAm} name="glitch" volume={0.45} />
    <Sfx at={W('pain1', 3)} name="ding" volume={0.3} />
    <Sfx at={W('pain1', 4) + 6} name="ding" volume={0.3} />
    <Sfx at={W('pain1', 6)} name="ding" volume={0.35} />
    <Sfx at={S.bored} name="tick" volume={0.45} />
    {[0, 4, 8, 14].map((d) => (
      <Sfx key={d} at={W('pain2', 0) + d} name="pop" volume={0.45} />
    ))}
    <Sfx at={W('pain2', 4)} name="whoosh" volume={0.3} />
    <Sfx at={S.google} name="swipe" volume={0.35} />
    <Sfx at={S.google + 2} name="typing" volume={0.45} />
    <Sfx at={S.again} name="tick" volume={0.5} />
    <Sfx at={S.news} name="shutter" volume={0.45} />
    <Sfx at={W('pain4', 6)} name="swipe" volume={0.35} />
    <Sfx at={S.bigNum} name="boom" volume={0.45} />
    <Sfx at={S.every} name="glitch" volume={0.35} />
    <Sfx at={S.every} name="kick" volume={0.4} />
    <Sfx at={S.single} name="kick" volume={0.4} />
    <Sfx at={S.day} name="boom" volume={0.45} />
    <Sfx at={S.gasp - 8} name="tape_stop" volume={0.35} />
    {/* turn */}
    <Sfx at={S.question} name="tick" volume={0.35} />
    <Sfx at={S.drop} name="boom" volume={0.6} />
    <Sfx at={S.drop} name="whistle" volume={0.3} />
    <Sfx at={S.drop + 1} name="kick" volume={0.55} />
    <Sfx at={S.team} name="whoosh" volume={0.35} />
    <Sfx at={S.coach} name="pop" volume={0.4} />
    <Sfx at={W('turn1', 11)} name="sparkle" volume={0.3} />
    {/* solution */}
    <Sfx at={S.reveal + 6} name="boom" volume={0.55} />
    <Sfx at={S.reveal + 4} name="crowd" volume={0.35} />
    <Sfx at={W('sol1', 4)} name="sparkle" volume={0.3} />
    {[0, 4, 5, 7].map((n) => (
      <Sfx key={n} at={W('sol2', n)} name="pop" volume={0.4} />
    ))}
    <Sfx at={S.euro} name="swipe" volume={0.35} />
    {[0, 1, 2, 3].map((i) => (
      <Sfx key={i} at={S.euro + 10 + i * 11} name="kick" volume={0.25} />
    ))}
    <Sfx at={S.euroCard} name="pop" volume={0.4} />
    <Sfx at={S.proof1} name="glitch" volume={0.3} />
    <Sfx at={W('sol4', 1)} name="boom" volume={0.4} />
    <Sfx at={S.proof2} name="sparkle" volume={0.3} />
    {[0, 4, 8, 12, 16, 20].map((d) => (
      <Sfx key={d} at={S.proof2 + d} name="pop" volume={0.25} />
    ))}
    <Sfx at={S.proof2 + 18} name="boom" volume={0.3} />
    <Sfx at={S.proof3} name="tick" volume={0.45} />
    {/* outcome */}
    <Sfx at={S.weeks} name="glitch" volume={0.35} />
    {new Array(7).fill(0).map((_, i) => (
      <Sfx key={i} at={S.weeks + Math.round(24 * ((i + 1) / 7) ** (1 / 1.6))} name="tick" volume={0.4} />
    ))}
    <Sfx at={S.weeks + 24} name="boom" volume={0.35} />
    <Sfx at={S.card} name="whoosh_long" volume={0.35} />
    <Sfx at={W('out2', 1)} name="sparkle" volume={0.25} />
    <Sfx at={W('out2', 3)} name="tick" volume={0.45} />
    <Sfx at={W('out2', 5)} name="tick" volume={0.45} />
    <Sfx at={S.callback} name="swipe" volume={0.35} />
    <Sfx at={S.callback + 3} name="pop" volume={0.4} />
    <Sfx at={W('out3', 5)} name="pop" volume={0.5} />
    <Sfx at={W('out3', 5) + 18} name="ding" volume={0.3} />
    {/* CTA + logo */}
    <Sfx at={S.cta} name="whoosh_long" volume={0.4} />
    <Sfx at={W('cta1', 4)} name="click" volume={0.5} />
    <Sfx at={S.logo} name="boom" volume={0.6} />
  </>
);

// ------------------------------------------------------------------ root
export const ESU_FallLaunch: React.FC = () => {
  const [handle] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    loadAllFonts().then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* ---------- HOOK (color) ---------- */}
      <Shot from={S.hook} to={S.badMom} push={0.05} shakes={[0]} cuts={[{at: W('hook1', 5), scale: 1.85, x: 72, y: 56}]}>
        <HookShot />
      </Shot>
      <Shot from={S.badMom} to={S.tablet} push={0.03}>
        <TypeCard
          tone="light"
          size={150}
          words={[
            {t: 'you’re', at: 0},
            {t: 'not', at: W('hook2', 1) - S.badMom, big: true, flip: 4},
            {t: 'a bad mom.', at: W('hook2', 2) - S.badMom},
          ]}
        />
      </Shot>
      <Shot from={S.tablet} to={S.inline} push={0.06} cuts={[{at: W('hook3', 3), scale: 1.7, x: 26, y: 52}]}>
        <TabletShot />
      </Shot>
      <Shot from={S.inline} to={S.nineAm} push={0.05}>
        <InlineShot />
      </Shot>

      {/* ---------- PAIN (black & white, stepped motion) ---------- */}
      <Shot
        from={S.nineAm}
        to={S.bored}
        push={0.05}
        mono
        stepped
        cuts={[
          {at: W('pain1', 3), scale: 1.18, x: 50, y: 52},
          {at: W('pain1', 6), scale: 1.2, x: 50, y: 64},
        ]}
      >
        <NineAmShot />
      </Shot>
      <Shot from={S.bored} to={S.google} push={0.05} mono stepped cuts={[{at: W('pain2', 4), scale: 1.3, x: 38, y: 42}]}>
        <BoredShot />
      </Shot>
      <Shot from={S.google} to={S.again} push={0.07} mono stepped cuts={[{at: W('pain3', 5), scale: 1.16, x: 50, y: 44}]}>
        <GoogleShot />
      </Shot>
      <Shot from={S.again} to={S.news} push={0.03}>
        <TypeCard tone="light" size={150} words={[{t: '…again.', at: 0, big: true}]} />
      </Shot>
      <Shot from={S.news} to={S.bigNum} push={0.06} cuts={[{at: W('pain4', 9), scale: 1.45, x: 22, y: 45}]}>
        <NewsShot />
      </Shot>
      <Shot from={S.bigNum} to={S.every} push={0.04} shakes={[S.bigNum]}>
        <BigNumberShot />
      </Shot>
      <Shot from={S.every} to={S.single} push={0.02}>
        <TypeCard tone="dark" size={150} serif={false} words={[{t: 'Every.', at: 0, big: true}]} />
      </Shot>
      <Shot from={S.single} to={S.day} push={0.02}>
        <TypeCard tone="light" size={150} serif={false} words={[{t: 'Single.', at: 0, big: true}]} />
      </Shot>
      <Shot from={S.day} to={S.gasp} push={0.02} shakes={[S.day]}>
        <TypeCard tone="dark" size={150} serif={false} words={[{t: 'Day.', at: 0, big: true, flip: 3}]} />
      </Shot>
      {/* S.gasp → S.question: black, tape-stop + silence */}

      {/* ---------- TURN: "What they actually need?" → color returns on the drop ---------- */}
      <Shot from={S.question} to={S.drop} push={0.04}>
        <TypeCard
          tone="dark"
          size={130}
          words={[
            {t: 'What they', at: 0},
            {t: 'actually', at: W('turn1', 2) - S.question, big: true},
            {t: 'need?', at: W('turn1', 3) - S.question},
          ]}
        />
      </Shot>
      <Shot from={S.drop} to={S.team} push={0.06} shakes={[S.drop, W('turn1', 5)]}>
        <BallShot />
      </Shot>
      <Shot from={S.team} to={S.coach} push={0.06}>
        <TeamShot />
      </Shot>
      <Shot from={S.coach} to={S.reveal} push={0.06}>
        <CoachShot />
      </Shot>

      {/* ---------- SOLUTION ---------- */}
      <Shot from={S.reveal} to={S.facts} push={0.05} shakes={[S.reveal + 6, W('sol1', 4)]}>
        <RevealShot />
      </Shot>
      <Shot from={S.facts} to={S.euro} push={0.05}>
        <FactsShot />
      </Shot>
      <Shot
        from={S.euro}
        to={S.proof1}
        push={0.05}
        cuts={[{at: S.euroCard, scale: 1.25, x: 50, y: 42}]}
        overlay={
          <AbsoluteFill style={{alignItems: 'center'}}>
            <div style={{position: 'absolute', top: 270}}>
              <WhiteCard at={S.euroCard - S.euro} icon={emoji('1f91d')} title="Grouped by age & ability" width={820} />
            </div>
          </AbsoluteFill>
        }
      >
        <EuroShot />
      </Shot>
      <Shot from={S.proof1} to={S.proof2} push={0.04} shakes={[W('sol4', 1)]}>
        <ProofStat big="#1" small="voted in Los Angeles" gold bg={4} />
      </Shot>
      <Shot from={S.proof2} to={S.proof3} push={0.03}>
        <KidsCloudShot />
      </Shot>
      <Shot from={S.proof3} to={S.weeks} push={0.04}>
        <ProofStat big="20+" small="years in LA" bg={5} />
      </Shot>

      {/* ---------- OUTCOME ---------- */}
      <Shot from={S.weeks} to={S.card} push={0.04} shakes={[S.weeks + 24]}>
        <WeeksShot />
      </Shot>
      <Shot
        from={S.card}
        to={S.callback}
        push={0.05}
        cuts={[
          {at: W('out2', 2), scale: 1.3, x: 50, y: 52},
          {at: W('out2', 4), scale: 1.0},
        ]}
      >
        <CardShot />
      </Shot>
      <Shot from={S.callback} to={S.cta} push={0.05} cuts={[{at: W('out3', 5), scale: 1.22, x: 40, y: 38}]}>
        <CallbackShot />
      </Shot>

      {/* ---------- SOFT CTA + logo card ---------- */}
      <Shot from={S.cta} to={S.logo} push={0.05}>
        {hasClip('prep') ? <CtaFootageShot /> : <CtaShot />}
      </Shot>
      <Shot from={S.logo} to={S.end} push={0.04}>
        <LogoShot />
      </Shot>

      {/* transitions: mostly hard cuts; an occasional glitch + white flash */}
      {[S.nineAm, S.every, S.proof1, S.weeks].map((f) => (
        <GlitchCut key={f} at={f} />
      ))}
      <BlockWipe at={S.inline} dir={1} />
      <BlockWipe at={S.bored} dir={-1} />
      <BlockWipe at={S.facts} dir={1} />
      <BlockWipe at={S.card} dir={-1} />
      <InvertFlash at={S.google} />
      <InvertFlash at={S.callback} />
      <Flash at={S.drop} length={4} peak={0.5} />
      <Flash at={S.reveal + 6} length={5} peak={0.6} color="#FFE9B0" />

      <ESUCaptions
        y={0.72}
        maxWords={3}
        size={66}
        hide={['hook2', 'sol1', 'sol4', 'cta1']}
        hideRanges={[
          [S.inline, S.nineAm],
          [S.again, S.news],
          [S.bigNum, S.drop],
        ]}
        yByLine={{hook1: 0.74, sol2: 0.73, out1: 0.66}}
        darkRanges={[[S.bored, S.again]]}
        emphasis={['saturday', 'ipad', 'screen', 'hundredth', 'believes', 'europeantrained', 'notice', 'confidence']}
      />

      <CornerLogos hideCrest={[[S.reveal, S.facts]]} hideAll={[[S.logo, S.end + 10]]} />

      <Grain opacity={0.08} />

      <Audio src={staticFile('audio/vo.wav')} volume={1} />
      <Audio src={staticFile('audio/music.wav')} volume={musicVolume} />
      <SoundDesign />
    </AbsoluteFill>
  );
};
