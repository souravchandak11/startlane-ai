/**
 * Scenes 6–13: MEET → THE CLASS → GAMES & SKILLS → JUST PLAY → NAP → FIRSTS → RIGHT THERE → CTA.
 */
import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {FONT} from '../presets/fonts';
import {ESULogo} from '../components/ESU_Logo';
import {Parent, Toddler, ToddlerPose} from './Characters';
import {BallGlyph, waddle} from './Scenes1';
import {BounceText, SerifWords, Sticker} from './Type';
import {backOut, C, clamp, easeInOut, easeOut, L, TOTAL, W} from './theme';
import {BallG, Cloud, Confetti, Gauge, Goal, Grass, Heart, PastelBg, SkyBg, Sparkles, Stage, Star, Sun} from './World';

type P = [number, number];

/** where a toddler's hand actually lands in world space (incl. arm-reach clamp) */
const toddlerHand = (tx: number, ty: number, ts: number, side: -1 | 1, target: P): P => {
  const sh: P = [tx + ts * 44 * side, ty - ts * 196];
  const want: P = [tx + ts * target[0], ty + ts * (-196 + target[1])];
  const dx = want[0] - sh[0];
  const dy = want[1] - sh[1];
  const d = Math.hypot(dx, dy);
  const r = 81 * ts;
  return d <= r ? want : [sh[0] + (dx / d) * r, sh[1] + (dy / d) * r];
};
/** parent hand target (shoulder-relative units) that reaches a world point */
const parentReach = (px: number, py: number, ps: number, crouch: number, world: P): P => {
  const shY = -330 + crouch * 150 - 230;
  return [(world[0] - px) / ps, (world[1] - (py + ps * shY)) / ps];
};

const Pop: React.FC<{at: number; out?: number; x: number; y: number; size: number; color?: string; children: React.ReactNode; stroke?: string}> = ({
  at,
  out,
  x,
  y,
  size,
  color = C.ink,
  children,
  stroke = '#fff',
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
        fontWeight: 700,
        fontSize: size,
        color,
        whiteSpace: 'nowrap',
        WebkitTextStroke: `${size * 0.14}px ${stroke}`,
        paintOrder: 'stroke fill',
      }}
    >
      {children}
    </div>
  );
};

// ================================================================== 6 · MEET MOMMY, DADDY & ME SOCCER
export const MeetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('sol1');
  const soccer = W('sol1', 5);
  const esu = W('sol1', 7);
  const bob = (i: number) => Math.sin(frame / 6 + i) * 6;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#FFD54A'}} />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${frame * 0.6}deg at 50% 52%, rgba(255,255,255,0.22) 0deg 9deg, transparent 9deg 18deg)`,
        }}
      />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 5px, transparent 5.5px)', backgroundSize: '60px 60px'}} />
      <Pop at={s0} x={540} y={380} size={84}>
        meet
      </Pop>
      <Sticker at={W('sol1', 1)} x={330} y={530} size={128} bg={C.pink} color="#fff" rot={-6}>
        Mommy,
      </Sticker>
      <Sticker at={W('sol1', 2)} x={740} y={680} size={128} bg={C.skyDeep} color="#fff" rot={5}>
        Daddy
      </Sticker>
      {frame >= W('sol1', 3) && (
        <div
          style={{
            position: 'absolute',
            left: 330,
            top: 840,
            transform: `translate(-50%, -50%) scale(${backOut((frame - W('sol1', 3)) / 8, 2)})`,
            fontFamily: FONT.serif,
            fontStyle: 'italic',
            fontSize: 230,
            color: C.red,
            WebkitTextStroke: '16px #fff',
            paintOrder: 'stroke fill',
            lineHeight: 1,
          }}
        >
          &amp;
        </div>
      )}
      <Sticker at={W('sol1', 4)} x={610} y={850} size={150} bg={C.red} color="#fff" rot={-4}>
        me
      </Sticker>
      <BounceText
        text="SOCCER"
        at={soccer}
        y={1060}
        size={230}
        colors={[C.navy]}
        stagger={1}
        replace={{1: <BallGlyph size={230} spin={frame * 10} />}}
      />
      <Confetti at={soccer} burst={{x: 540, y: 1040}} count={60} dur={40} />
      {frame >= esu - 2 && (
        <div style={{position: 'absolute', left: 540, top: 1330, transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: 26}}>
          <div style={{fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 92, color: C.ink, opacity: interpolate(frame, [esu - 2, esu + 6], [0, 1], clamp)}}>at</div>
          <ESULogo size={250} at={esu} enter="slam" />
        </div>
      )}
      {/* family peeking from the bottom edge */}
      <Stage>
        <g transform={`translate(0 ${interpolate(frame, [s0, s0 + 12], [400, 0], {...clamp, easing: (t) => backOut(t, 1.2)})})`}>
          <Parent kind="mom" x={170} y={2150 + bob(0)} scale={0.95} handR={[150, -60 + Math.sin(frame / 3) * 24]} mouth="grin" />
          <Parent kind="dad" x={910} y={2150 + bob(1)} scale={0.95} handL={[-150, -60 + Math.sin(frame / 3 + 1) * 24]} mouth="grin" />
          <Toddler x={540} y={1960 + bob(2)} scale={1.05} handL={[-74, -50]} handR={[74, -50]} mouth="open" />
        </g>
      </Stage>
    </AbsoluteFill>
  );
};

// ================================================================== 7 · 30 MIN · 12–24 MONTHS · RIGHT BY THEIR SIDE
export const InfoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('sol2');
  const ages = W('sol2', 3);
  const withYou = W('sol2', 9);
  const fill = interpolate(frame, [s0, s0 + 20], [0, 1], {...clamp, easing: (t) => easeOut(t, 2)});
  const timerOut = interpolate(frame, [ages - 4, ages + 4], [1, 0], clamp);
  const agesOut = interpolate(frame, [withYou - 6, withYou + 2], [1, 0], clamp);
  // timer
  const R = 230;
  const circ = 2 * Math.PI * R;
  // walk: mom + toddler hand in hand
  const wk = frame - withYou;
  const mx = interpolate(frame, [withYou, withYou + 34], [40, 330], {...clamp, easing: (t) => 1 - (1 - t) ** 1.6});
  const walking = wk < 34;
  const ms = 0.95;
  const floor = 1470;
  const tx = mx + 190;
  const tpose: ToddlerPose = walking ? {...waddle(wk, 0.7), handL: [-60, -92], mouth: 'grin', look: -1} : {handL: [-60, -92], handR: [64, 70], mouth: 'grin', look: -1};
  const hw = toddlerHand(tx, floor, 1, -1, tpose.handL as P);
  const momHand = parentReach(mx, floor, ms, 0, hw);
  const step = Math.sin(wk * 0.35);
  return (
    <AbsoluteFill>
      <PastelBg base="#EAF8F1" blobs={[C.mint, C.sky, C.butter]} seed={7} />
      {/* ---- timer ---- */}
      {timerOut > 0 && (
        <AbsoluteFill style={{opacity: timerOut, transform: `scale(${0.6 + 0.4 * timerOut})`}}>
          <Stage>
            <g transform={`translate(540 860) rotate(${Math.sin(frame / 3) * 2 * (1 - fill)})`}>
              <rect x={-36} y={-R - 80} width={72} height={46} rx={14} fill={C.coral} />
              <rect x={-14} y={-R - 40} width={28} height={30} fill={C.coral} />
              <circle r={R + 30} fill="#fff" stroke={C.ink} strokeWidth={12} />
              <circle r={R - 20} fill="none" stroke="#E6F3EE" strokeWidth={40} />
              <circle
                r={R - 20}
                fill="none"
                stroke={C.grassDeep}
                strokeWidth={40}
                strokeLinecap="round"
                strokeDasharray={`${circ} ${circ}`}
                strokeDashoffset={circ * (1 - fill)}
                transform="rotate(-90)"
              />
              <text y={40} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={200} fill={C.ink}>
                {Math.round(fill * 30)}
              </text>
              <text y={120} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={56} fill={C.dull3}>
                minutes
              </text>
            </g>
          </Stage>
        </AbsoluteFill>
      )}
      {/* ---- ages ---- */}
      {frame >= ages && agesOut > 0 && (
        <AbsoluteFill style={{opacity: agesOut}}>
          <BounceText text="12–24" at={W('sol2', 4)} y={820} size={250} colors={[C.skyDeep, C.coral, C.orange, C.grassDeep, C.lilac]} stagger={1} />
          <Sticker at={W('sol2', 7)} x={540} y={1030} size={110} bg={C.sun} rot={-3}>
            months old
          </Sticker>
          <Stage>
            <Grass y={1400} />
            <Toddler x={540} y={1460} scale={0.9} handL={[-70, -40 + Math.sin(frame / 3) * 20]} handR={[64, 70]} mouth="open" />
          </Stage>
        </AbsoluteFill>
      )}
      {/* ---- hand in hand ---- */}
      {frame >= withYou - 2 && (
        <AbsoluteFill>
          <Stage>
            <Grass y={1380} flowers />
            <Parent
              kind="mom"
              x={mx}
              y={floor}
              scale={ms}
              handR={momHand}
              handL={[-120, 220 + (walking ? step * 20 : 0)]}
              footL={[-46 + (walking ? 34 * step : 0), walking ? -Math.max(0, 26 * step) : 0]}
              footR={[46 - (walking ? 34 * step : 0), walking ? -Math.max(0, -26 * step) : 0]}
              mouth="grin"
              look={1}
              headTilt={6}
            />
            <Toddler x={tx} y={floor - (walking ? Math.abs(Math.sin(wk * 0.7)) * 8 : 0)} scale={1} {...tpose} />
            {frame >= W('sol2', 13) && <Heart x={(mx + tx) / 2 + 20} y={hw[1] - 90 - (frame - W('sol2', 13)) * 2} s={0.7} color={C.red} />}
          </Stage>
          <Sticker at={W('sol2', 10)} x={mx + 10} y={760} size={92} bg={C.coral} color="#fff" rot={-6}>
            you
          </Sticker>
          <Sticker at={W('sol2', 13)} x={tx + 120} y={1040} size={80} bg={C.sun} rot={5}>
            them
          </Sticker>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- theme icons
const Lion: React.FC = () => (
  <g>
    {new Array(12).fill(0).map((_, i) => (
      <circle key={i} cx={Math.cos((i * Math.PI) / 6) * 62} cy={Math.sin((i * Math.PI) / 6) * 62} r={30} fill={C.orange} />
    ))}
    <circle r={60} fill={C.sun} />
    <circle cx={-22} cy={-10} r={7} fill={C.ink} />
    <circle cx={22} cy={-10} r={7} fill={C.ink} />
    <path d="M-12 12 L12 12 L0 24 Z" fill={C.ink} />
    <path d="M-16 32 Q0 42 16 32" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
  </g>
);
const Rocket: React.FC<{f: number}> = ({f}) => (
  <g transform="rotate(30)">
    <path d={`M-18 60 Q0 ${100 + Math.sin(f) * 14} 18 60 Z`} fill={C.orange} />
    <path d="M-30 40 L-56 70 L-30 64 Z M30 40 L56 70 L30 64 Z" fill={C.red} />
    <path d="M0 -90 Q44 -40 32 60 L-32 60 Q-44 -40 0 -90 Z" fill="#fff" stroke={C.ink} strokeWidth={6} />
    <circle cy={-14} r={18} fill={C.sky} stroke={C.ink} strokeWidth={6} />
  </g>
);
const Fish: React.FC<{f: number}> = ({f}) => (
  <g transform={`translate(0 ${Math.sin(f) * 6})`}>
    <path d="M40 0 L86 -36 L86 36 Z" fill={C.coral} />
    <ellipse rx={66} ry={46} fill={C.coral} />
    <path d="M-10 -40 Q10 -10 -10 40" stroke="#fff" strokeWidth={8} fill="none" opacity={0.6} />
    <circle cx={-34} cy={-10} r={9} fill={C.ink} />
    <circle cx={-60} cy={-64} r={10} fill="none" stroke={C.skyDeep} strokeWidth={5} />
    <circle cx={-40} cy={-88} r={7} fill="none" stroke={C.skyDeep} strokeWidth={5} />
  </g>
);
const Rainbow: React.FC = () => (
  <g transform="translate(0 30)">
    {[C.red, C.orange, C.sun, C.grass, C.skyDeep].map((c, i) => (
      <path key={i} d={`M${-90 + i * 14} 0 A${90 - i * 14} ${90 - i * 14} 0 0 1 ${90 - i * 14} 0`} stroke={c} strokeWidth={14} fill="none" />
    ))}
    <ellipse cx={-80} cy={6} rx={34} ry={18} fill="#fff" />
    <ellipse cx={80} cy={6} rx={34} ry={18} fill="#fff" />
  </g>
);

// ================================================================== 8 · THEMED GAMES → BALANCE · COORDINATION · CONFIDENCE
export const SkillsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('sol3');
  const build = W('sol3', 4);
  const cardsOut = interpolate(frame, [build - 6, build + 2], [1, 0], clamp);
  const cards = [
    {bg: C.butter, icon: <Lion />, x: 320, y: 770, rot: -6, from: [-500, 600]},
    {bg: '#CFEAFF', icon: <Rocket f={frame / 2} />, x: 760, y: 790, rot: 5, from: [1600, 500]},
    {bg: '#FFE0E6', icon: <Fish f={frame / 5} />, x: 330, y: 1210, rot: 4, from: [-500, 1500]},
    {bg: '#E6DEFF', icon: <Rainbow />, x: 750, y: 1190, rot: -5, from: [1600, 1700]},
  ];
  const skills = [
    {at: W('sol3', 5), label: 'balance', color: C.skyDeep, pose: {footR: [70, 40], handL: [-84, -6], handR: [84, -6], mouth: 'smile'} as ToddlerPose, y: 600},
    {at: W('sol3', 6), label: 'coordination', color: C.grassDeep, pose: {footR: [100, 40], handL: [-80, 10], handR: [60, 40], lean: -8, mouth: 'open', look: 1} as ToddlerPose, y: 960},
    {at: W('sol3', 8), label: 'confidence', color: C.red, pose: {handL: [-80, -78], handR: [80, -78], mouth: 'grin', happyEyes: true} as ToddlerPose, y: 1320},
  ];
  return (
    <AbsoluteFill>
      <PastelBg base="#F4F0FF" blobs={[C.lilac, C.pink, C.butter]} seed={9} />
      {cardsOut > 0 &&
        cards.map((c, i) => {
          const at = s0 + i * 6;
          if (frame < at) return null;
          const k = easeOut((frame - at) / 10, 3);
          const x = c.from[0] + (c.x - c.from[0]) * k;
          const y = c.from[1] + (c.y - c.from[1]) * k;
          const wob = Math.sin((frame - at) / 7 + i) * 3;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 190,
                top: y - 190,
                width: 380,
                height: 380,
                borderRadius: 54,
                background: c.bg,
                border: '12px solid #fff',
                boxShadow: '0 20px 40px rgba(30,23,72,0.18)',
                transform: `rotate(${c.rot + wob + (1 - k) * 40}deg) scale(${cardsOut})`,
              }}
            >
              <svg width={356} height={356} viewBox="-120 -120 240 240">
                {c.icon}
              </svg>
            </div>
          );
        })}
      {frame >= build - 2 &&
        skills.map((s, i) => {
          if (frame < s.at - 3) return null;
          const k = backOut((frame - s.at + 3) / 10, 1.8);
          const ring = interpolate(frame, [s.at, s.at + 14], [0, 1], {...clamp, easing: (t) => easeOut(t)});
          const R = 140;
          const circ = 2 * Math.PI * R;
          return (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: s.y - 170, height: 340}}>
              <svg width={1080} height={340} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
                <g transform={`translate(${250 - (1 - k) * 300} 170) scale(${k})`}>
                  <circle r={R + 18} fill="#fff" />
                  <clipPath id={`sk${i}`}>
                    <circle r={R - 14} />
                  </clipPath>
                  <circle r={R - 14} fill={i === 0 ? '#DDF1FF' : i === 1 ? '#E2F7DA' : '#FFE3E3'} />
                  <g clipPath={`url(#sk${i})`}>
                    {i === 2 && <Star x={0} y={-30} r={120} color="#FFE07A" rot={frame} />}
                    {i === 1 && <BallG x={70} y={92} r={28} rot={frame * 8} />}
                    <Toddler x={i === 1 ? -14 : 0} y={128} scale={0.62} {...s.pose} shadow={false} />
                  </g>
                  <circle r={R} fill="none" stroke="#EEE" strokeWidth={16} />
                  <circle r={R} fill="none" stroke={s.color} strokeWidth={16} strokeLinecap="round" strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ * (1 - ring)} transform="rotate(-90)" />
                  {ring >= 1 && (
                    <g transform={`translate(${R * 0.72} ${R * 0.72}) scale(${backOut((frame - s.at - 14) / 8, 3)})`}>
                      <circle r={36} fill={s.color} stroke="#fff" strokeWidth={8} />
                      <path d="M-14 0 L-4 11 L16 -11" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  )}
                </g>
              </svg>
              <div
                style={{
                  position: 'absolute',
                  left: 450,
                  top: 170,
                  transform: `translateY(-50%) translateX(${(1 - k) * 200}px)`,
                  opacity: Math.min(1, k),
                  fontFamily: FONT.round,
                  fontWeight: 700,
                  fontSize: s.label.length > 10 ? 84 : 100,
                  color: s.color,
                  WebkitTextStroke: '14px #fff',
                  paintOrder: 'stroke fill',
                }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
    </AbsoluteFill>
  );
};

// ================================================================== 9 · NO PRESSURE. JUST PLAY.
export const PlayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('sol4');
  const pressure = W('sol4', 1);
  const just = W('sol4', 2);
  const play = W('sol4', 3);
  const needle = interpolate(frame, [s0, pressure, pressure + 10], [0.92, 0.95, 0.04], {...clamp, easing: (t) => easeOut(t, 2)});
  const gaugeOut = interpolate(frame, [just - 4, just + 2], [1, 0], clamp);
  const roll = interpolate(frame, [just, just + 22], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PastelBg base="#E8F5FF" blobs={[C.sky, C.mint, C.butter]} seed={11} />
      {gaugeOut > 0 && (
        <AbsoluteFill style={{opacity: gaugeOut, transform: `scale(${0.7 + 0.3 * gaugeOut})`}}>
          <Stage>
            <Gauge x={540} y={1000} value={needle} r={300} />
            <text x={540} y={1110} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={70} fill={C.ink} letterSpacing={6}>
              PRESSURE
            </text>
            {frame >= pressure + 10 && (
              <g transform={`translate(${540 - 300} 1000) scale(${backOut((frame - pressure - 10) / 8, 3)})`}>
                <circle r={60} fill={C.grassDeep} stroke="#fff" strokeWidth={10} />
                <text y={22} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={64} fill="#fff">
                  0
                </text>
              </g>
            )}
          </Stage>
        </AbsoluteFill>
      )}
      {frame >= just - 2 && (
        <AbsoluteFill>
          <Stage>
            <Grass y={1420} />
            {[0, 1, 2, 3, 4].map((i) => {
              const d = frame - just - i * 2;
              if (d < 0) return null;
              const bx = 140 + i * 200;
              const by = 1500 - d * (14 + i * 2);
              return (
                <g key={i}>
                  <path d={`M${bx} ${by + 70} q-10 40 6 90`} stroke={C.dull2} strokeWidth={3} fill="none" />
                  <ellipse cx={bx} cy={by} rx={56} ry={68} fill={[C.red, C.sun, C.skyDeep, C.pink, C.grass][i]} />
                  <ellipse cx={bx - 18} cy={by - 24} rx={12} ry={18} fill="#fff" opacity={0.5} />
                </g>
              );
            })}
            <g transform={`rotate(${roll * 360} ${200 + roll * 680} 1300)`}>
              <Toddler x={200 + roll * 680} y={1480 - Math.sin(roll * Math.PI) * 220} scale={1} handL={[-80, -70]} handR={[80, -70]} mouth="grin" happyEyes />
            </g>
          </Stage>
          <BounceText text="play!" at={play} y={820} size={280} colors={[C.red, C.skyDeep, C.orange, C.grassDeep, C.pink]} stagger={2} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ================================================================== 10 · ONE VERY GOOD NAP
export const NapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('sol5');
  const nap = W('sol5', 5);
  const breathe = 1 + Math.sin(frame / 10) * 0.02;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #17164A 0%, #2D2A78 60%, #4A3E8F 100%)'}}>
      <Stage>
        {new Array(26).fill(0).map((_, i) => {
          const x = random(`nx${i}`) * 1080;
          const y = 300 + random(`ny${i}`) * 900;
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 9 + i));
          return <Star key={i} x={x} y={y} r={6 + random(`nr${i}`) * 10} color="#FFF4C2" rot={i * 20} />;
        }).map((s, i) => (
          <g key={i} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 9 + i))}>
            {s}
          </g>
        ))}
        {/* sleepy moon */}
        <g transform="translate(820 560)">
          <circle r={120} fill="#FFE9A8" />
          <circle cx={56} cy={-40} r={110} fill="#25236A" />
          <path d="M-70 10 Q-55 20 -40 10" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
          <circle cx={-70} cy={40} r={14} fill={C.pink} opacity={0.5} />
        </g>
        {/* cloud bed */}
        <g transform={`translate(540 1320) scale(${breathe})`}>
          <ellipse cx={0} cy={60} rx={420} ry={110} fill="#E8E6FF" />
          <circle cx={-260} cy={0} r={120} fill="#F3F2FF" />
          <circle cx={-60} cy={-30} r={150} fill="#F3F2FF" />
          <circle cx={170} cy={-10} r={130} fill="#F3F2FF" />
          <circle cx={330} cy={30} r={90} fill="#F3F2FF" />
        </g>
        {/* toddler asleep, lying on their side hugging the ball */}
        <g transform={`translate(560 1190) rotate(-90) scale(${breathe})`}>
          <Toddler x={0} y={190} scale={1.0} handL={[-10, 40]} handR={[20, 40]} footL={[-20, 92]} footR={[20, 80]} mouth="sleep" shadow={false} />
        </g>
        <BallG x={600} y={1160} r={58} rot={-20} />
        {/* Zzz */}
        {[0, 1, 2].map((i) => {
          const d = (frame - s0 - i * 9) % 36;
          if (frame - s0 - i * 9 < 0) return null;
          return (
            <text
              key={i}
              x={360 - d * 3 + i * 10}
              y={1000 - d * 7}
              fontFamily="Fredoka"
              fontWeight={700}
              fontSize={60 + i * 18}
              fill="#fff"
              opacity={interpolate(d, [0, 6, 28, 36], [0, 1, 1, 0], clamp)}
            >
              z
            </text>
          );
        })}
      </Stage>
      {frame >= nap - 2 && (
        <div style={{position: 'absolute', left: 540, top: 700, transform: 'translate(-50%, -50%)', display: 'flex', gap: 14}}>
          {[0, 1, 2, 3, 4].map((i) => {
            const at = nap + i * 3;
            const k = frame >= at ? backOut((frame - at) / 7, 3) : 0;
            return (
              <svg key={i} width={110} height={110} viewBox="-55 -55 110 110" style={{transform: `scale(${k})`}}>
                <Star x={0} y={0} r={48} color={C.sun} stroke="#fff" />
              </svg>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ================================================================== 11 · FIRST KICK · FIRST GOAL · FIRST HIGH FIVE
const MilestoneCard: React.FC<{label: string; bg: string; children: React.ReactNode}> = ({label, bg, children}) => (
  <div style={{width: 600, height: 780, borderRadius: 48, background: bg, border: '14px solid #fff', boxShadow: '0 30px 60px rgba(30,23,72,0.25)', position: 'relative', overflow: 'hidden'}}>
    <div style={{position: 'absolute', top: 34, left: 0, right: 0, textAlign: 'center', fontFamily: FONT.round, fontWeight: 600, fontSize: 30, letterSpacing: 10, color: 'rgba(30,23,72,0.55)'}}>
      MILESTONE
    </div>
    <svg width={572} height={520} viewBox="0 0 572 520" style={{position: 'absolute', top: 86, left: 0}}>
      <rect x={34} y={0} width={504} height={500} rx={36} fill="#fff" opacity={0.6} />
      {children}
    </svg>
    <div style={{position: 'absolute', bottom: 44, left: 0, right: 0, textAlign: 'center', fontFamily: FONT.round, fontWeight: 700, fontSize: label.length > 10 ? 78 : 92, color: C.ink}}>
      {label}
    </div>
  </div>
);

export const FirstsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const kick = W('emo1', 2);
  const goal = W('emo1', 5);
  const five = W('emo1', 8);
  const cards = [
    {at: L('emo1'), label: 'first kick', bg: '#FFD9E4', rest: {x: 300, y: 760, r: -11, s: 0.62}},
    {at: goal - 2, label: 'first goal', bg: '#D6EEFF', rest: {x: 790, y: 760, r: 9, s: 0.62}},
    {at: five - 2, label: 'first high five', bg: '#FFF0B8', rest: {x: 540, y: 1000, r: -2, s: 1}},
  ];
  // high-five pose
  const tx = 360;
  const ty = 470;
  const ts = 0.78;
  const hand = toddlerHand(tx, ty, ts, -1, [-60, -92]);
  const momT = parentReach(170, 470, 0.42, 0.85, [hand[0] - 6, hand[1] - 4]);
  const scenes = [
    <g key="k">
      <rect x={34} y={380} width={504} height={120} rx={0} fill={C.grass} />
      <Toddler x={230} y={460} scale={0.85} footR={[100, 36]} handL={[-84, 0]} handR={[60, 40]} lean={-8} mouth="open" look={1} />
      <BallG x={420 + Math.min(40, (frame - kick) * 3)} y={330 - Math.min(60, (frame - kick) * 4)} r={44} rot={frame * 14} />
      <path d="M330 340 l-50 10 M330 370 l-60 0" stroke={C.ink} strokeWidth={6} strokeLinecap="round" opacity={0.4} />
    </g>,
    <g key="g">
      <rect x={34} y={380} width={504} height={120} fill={C.grass} />
      <Goal x={380} y={420} w={250} h={180} bulge={Math.max(0, Math.cos((frame - goal) / 3)) * Math.exp(-(frame - goal) / 12)} />
      <BallG x={390} y={384} r={34} rot={frame * 4} />
      <Toddler x={170} y={470} scale={0.78} handL={[-80, -78]} handR={[80, -78]} mouth="grin" happyEyes />
    </g>,
    <g key="h">
      <rect x={34} y={400} width={504} height={100} fill={C.grass} />
      <Parent kind="mom" x={170} y={470} scale={0.42} crouch={0.85} handR={momT} mouth="grin" happyEyes footL={[-80, 0]} footR={[80, 0]} />
      <Toddler x={tx} y={ty} scale={ts} handL={[-60, -92]} handR={[64, 60]} mouth="grin" happyEyes />
      {frame >= five && <Star x={hand[0] - 4} y={hand[1] - 10} r={30 + Math.min(30, (frame - five) * 4)} color={C.sun} rot={frame * 3} />}
    </g>,
  ];
  return (
    <AbsoluteFill>
      <PastelBg base="#FFF6EA" blobs={[C.pink, C.butter, C.sky]} seed={13} />
      {cards.map((c, i) => {
        if (frame < c.at) return null;
        const next = cards[i + 1];
        const settle = next ? interpolate(frame, [next.at, next.at + 10], [0, 1], {...clamp, easing: (t) => easeInOut(t)}) : 0;
        const k = backOut((frame - c.at) / 10, 1.6);
        const x0 = 540;
        const y0 = 1000;
        const x = x0 + (c.rest.x - x0) * settle;
        const y = interpolate(k, [0, 1], [1700, y0]) + (c.rest.y - y0) * settle;
        const s = 1 + (c.rest.s - 1) * settle;
        const r = (1 - k) * 18 + c.rest.r * (i === 2 ? 1 : settle) + (i === 2 ? 0 : 0);
        return (
          <div key={i} style={{position: 'absolute', left: x - 300, top: y - 390, transform: `rotate(${r}deg) scale(${s})`}}>
            <MilestoneCard label={c.label} bg={c.bg}>
              {scenes[i]}
            </MilestoneCard>
            {frame >= c.at + 6 && (
              <div
                style={{
                  position: 'absolute',
                  right: -24,
                  top: -24,
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  background: C.grassDeep,
                  border: '10px solid #fff',
                  transform: `scale(${backOut((frame - c.at - 6) / 7, 3)}) rotate(-12deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width={60} height={60} viewBox="-30 -30 60 60">
                  <path d="M-16 0 L-5 12 L17 -12" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ================================================================== 12 · YOU'LL BE RIGHT THERE
export const ThereScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('emo2');
  const right = W('emo2', 2);
  const all = W('emo2', 4);
  const walkK = interpolate(frame, [s0, right], [0, 1], {...clamp, easing: (t) => easeOut(t, 2)});
  const ts = 1.15;
  const ty = 1470;
  const tx = interpolate(walkK, [0, 1], [900, 640]);
  const hit = frame >= right;
  const tHand: P = hit ? [-60, -96] : [-64, 60];
  const hw = toddlerHand(tx, ty, ts, -1, tHand);
  const mx = 330;
  const momT = hit ? parentReach(mx, 1480, 0.95, 0.75, [hw[0] - 8, hw[1] - 6]) : ([140, 160] as P);
  const push = interpolate(frame, [s0, s0 + 50], [1, 1.07], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #FFB46B 0%, #FF9A8B 55%, #FF8FB4 100%)'}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 70%'}}>
        <Stage>
          <Sun x={540} y={1260} r={260} face={false} color="#FFD27A" />
          <Cloud x={240} y={760} s={0.8} color="#FFE6D6" />
          <Cloud x={860} y={940} s={0.6} color="#FFE6D6" />
          <Grass y={1360} color="#8BCF6E" dark="#5DAE52" />
          <Parent kind="mom" x={mx} y={1480} scale={0.95} crouch={0.75} handR={momT} handL={[-120, 150]} mouth="grin" happyEyes={hit} footL={[-70, 0]} footR={[70, 0]} look={1} />
          <Toddler
            x={tx}
            y={ty - (frame < right ? Math.abs(Math.sin(frame * 0.7)) * 8 : 0)}
            scale={ts}
            {...(frame < right ? waddle(frame - s0, 0.7) : {})}
            handL={tHand}
            mouth="grin"
            happyEyes={hit}
            look={-1}
          />
          {hit && <Star x={hw[0] - 6} y={hw[1] - 10} r={40 + Math.min(50, (frame - right) * 6)} color="#FFF4B0" rot={frame * 3} />}
          <Sparkles at={right} x={hw[0]} y={hw[1]} spread={200} count={8} color="#fff" dur={26} />
          {frame >= all &&
            [0, 1, 2].map((i) => {
              const d = frame - all - i * 4;
              if (d < 0) return null;
              return <Heart key={i} x={hw[0] - 60 + i * 60} y={hw[1] - 80 - d * 7} s={0.5 + i * 0.12} color={i === 1 ? C.red : '#fff'} />;
            })}
        </Stage>
      </AbsoluteFill>
      <SerifWords
        y={450}
        size={128}
        color="#fff"
        words={[
          {t: "you'll", at: s0},
          {t: 'be', at: W('emo2', 1)},
          {t: 'right', at: right},
          {t: 'there', at: W('emo2', 3)},
        ]}
      />
      <SerifWords
        y={600}
        size={128}
        color="#fff"
        words={[
          {t: 'for', at: W('emo2', 4)},
          {t: 'all', at: all, style: {color: C.navy}},
          {t: 'of', at: W('emo2', 6)},
          {t: 'it.', at: W('emo2', 7)},
        ]}
      />
    </AbsoluteFill>
  );
};

// ================================================================== 13 · CTA END CARD
const Row: React.FC<{at: number; icon: React.ReactNode; title: string; sub?: string}> = ({at, icon, title, sub}) => {
  const frame = useCurrentFrame();
  if (frame < at) return <div style={{height: 112}} />;
  const k = backOut((frame - at) / 9, 2);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 26, height: 112, transform: `translateX(${(1 - k) * -80}px)`, opacity: Math.min(1, k * 1.4)}}>
      <div style={{width: 84, height: 84, borderRadius: 26, background: '#FFF3D6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        {icon}
      </div>
      <div>
        <div style={{fontFamily: FONT.round, fontWeight: 700, fontSize: 50, color: C.ink, lineHeight: 1.05}}>{title}</div>
        {sub && <div style={{fontFamily: FONT.round, fontWeight: 500, fontSize: 32, color: C.dull3, marginTop: 4}}>{sub}</div>}
      </div>
    </div>
  );
};

const Emo: React.FC<{code: string; size?: number}> = ({code, size = 56}) => <Img src={staticFile(`emoji/${code}.svg`)} style={{width: size, height: size}} />;

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = L('cta1');
  const weekend = W('cta1', 4);
  const park = W('cta1', 7);
  const tap = L('cta2');
  const book = W('cta2', 4);
  const press = W('cta2', 6);
  const btnK = frame >= book - 2 ? backOut((frame - book + 2) / 10, 2.2) : 0;
  const pressed = frame >= press && frame < press + 5 ? 0.92 : 1;
  const pulse = frame > press + 5 ? 1 + Math.sin((frame - press) / 5) * 0.03 : 1;
  const handK = interpolate(frame, [tap, tap + 10], [0, 1], {...clamp, easing: (t) => easeOut(t)});
  const handTap = frame >= press - 4 && frame < press + 6 ? Math.sin(((frame - press + 4) / 10) * Math.PI) * 26 : 0;
  return (
    <AbsoluteFill>
      <PastelBg base="#FFF7EC" blobs={[C.butter, C.pink, C.mint]} seed={21} />
      {/* header */}
      <Sticker at={s0} x={540} y={370} size={78} bg={C.red} color="#fff" rot={-3}>
        FALL CLASSES
      </Sticker>
      <BounceText text="start this weekend!" at={W('cta1', 2)} y={500} size={86} colors={[C.ink]} stagger={1} idle={false} />
      {/* info card */}
      {frame >= weekend - 4 && (
        <div
          style={{
            position: 'absolute',
            left: 70,
            right: 70,
            top: 590,
            padding: '30px 40px',
            borderRadius: 44,
            background: '#fff',
            boxShadow: '0 24px 50px rgba(30,23,72,0.16)',
            transform: `scale(${backOut((frame - weekend + 4) / 10, 1.6)})`,
            transformOrigin: '50% 0%',
          }}
        >
          <Row at={weekend} icon={<Emo code="1f5d3" />} title="Sat & Sun · Oct 3 – Nov 22" sub="8-week fall season" />
          <Row at={weekend + 5} icon={<Emo code="23f0" />} title="10:15 – 10:45 AM" sub="30 playful minutes" />
          <Row
            at={weekend + 10}
            icon={
              <svg width={70} height={70} viewBox="-80 -175 160 160">
                <circle cx={0} cy={-88} r={78} fill="#F3C29B" />
                <path d="M-70 -112 Q-62 -172 0 -168 Q62 -172 70 -112 Q48 -140 18 -130 Q-2 -148 -22 -128 Q-48 -140 -70 -112 Z" fill="#5A3A22" />
                <circle cx={-28} cy={-82} r={10} fill={C.ink} />
                <circle cx={28} cy={-82} r={10} fill={C.ink} />
                <path d="M-18 -50 Q0 -36 18 -50" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
              </svg>
            }
            title="Ages 12–24 months"
            sub="with mom, dad or a grown-up"
          />
          <Row at={park} icon={<Emo code="1f4cd" />} title="The Sports Park" sub="13196 Bluff Creek Dr · Playa Vista" />
        </div>
      )}
      {/* price chip */}
      <Sticker at={W('cta1', 9)} x={540} y={1168} size={58} bg={C.sun} rot={-2}>
        try a class · $34 drop-in
      </Sticker>
      {/* button */}
      {btnK > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 1300,
            transform: `translate(-50%, -50%) scale(${btnK * pressed * pulse})`,
            background: C.red,
            color: '#fff',
            fontFamily: FONT.round,
            fontWeight: 700,
            fontSize: 64,
            padding: '30px 56px 34px',
            borderRadius: 999,
            border: '10px solid #fff',
            boxShadow: `0 ${pressed < 1 ? 6 : 18}px ${pressed < 1 ? 14 : 34}px rgba(237,28,36,0.4)`,
            whiteSpace: 'nowrap',
          }}
        >
          Book their first class →
        </div>
      )}
      {frame >= tap && (
        <div style={{position: 'absolute', left: 800 - (1 - handK) * -300, top: 1340 + handTap, opacity: handK, transform: 'rotate(-20deg)'}}>
          <Emo code="1f447" size={130} />
        </div>
      )}
      {/* sponsor line */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1420, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: interpolate(frame, [tap, tap + 10], [0, 1], clamp)}}>
        <div style={{fontFamily: FONT.round, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: C.dull3}}>PROUDLY SPONSORED BY</div>
        <Img src={staticFile('logos/wateria-navy.svg')} style={{width: 210, height: 210 * (462 / 1800)}} />
      </div>
      {/* family waving from below */}
      <Stage>
        <g transform={`translate(0 ${interpolate(frame, [s0, s0 + 14], [300, 0], {...clamp, easing: (t) => backOut(t, 1.2)})})`}>
          <Toddler x={130} y={1800 + Math.abs(Math.sin(frame / 6)) * -10} scale={0.9} handR={[74, -50 + Math.sin(frame / 3) * 20]} handL={[-62, 70]} mouth="grin" />
          <BallG x={960} y={1700} r={70} rot={frame * 4} />
        </g>
      </Stage>
      <Confetti at={TOTAL - 47} count={110} dur={46} />
    </AbsoluteFill>
  );
};
