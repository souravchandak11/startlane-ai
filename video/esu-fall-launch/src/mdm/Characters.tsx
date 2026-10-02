/**
 * Rubber-hose SVG characters for the Mommy, Daddy & Me video.
 *
 * Every limb is a two-bone IK chain drawn as a thick round stroke, so a pose is just
 * "where are the hands and feet" — scenes animate those targets frame by frame.
 * Origin (0,0) is between the feet; up is negative y.
 */
import React from 'react';
import {C, HAIR, SKIN} from './theme';

type P = [number, number];

/** two-bone IK: joint position for a chain root→end with bone lengths a, b. dir=±1 picks the bend side */
const ik = (root: P, end: P, a: number, b: number, dir: 1 | -1): P => {
  const dx = end[0] - root[0];
  const dy = end[1] - root[1];
  let d = Math.hypot(dx, dy);
  d = Math.min(Math.max(d, Math.abs(a - b) + 0.01), a + b - 0.01);
  const ang = Math.atan2(dy, dx);
  const cosA = (a * a + d * d - b * b) / (2 * a * d);
  const alpha = Math.acos(Math.min(1, Math.max(-1, cosA)));
  const th = ang + dir * alpha;
  return [root[0] + a * Math.cos(th), root[1] + a * Math.sin(th)];
};

/** clamp the end of a chain to its reach */
const reach = (root: P, end: P, len: number): P => {
  const dx = end[0] - root[0];
  const dy = end[1] - root[1];
  const d = Math.hypot(dx, dy);
  if (d <= len) return end;
  return [root[0] + (dx / d) * len, root[1] + (dy / d) * len];
};

/** `dir` = which side (in x) the elbow/knee should bow towards: -1 left, 1 right */
const Limb: React.FC<{root: P; end: P; a: number; b: number; dir: 1 | -1; w: number; color: string; sleeve?: string; sleeveLen?: number}> = ({
  root,
  end,
  a,
  b,
  dir,
  w,
  color,
  sleeve,
  sleeveLen = 0.6,
}) => {
  const e = reach(root, end, a + b - 0.02);
  const j1 = ik(root, e, a, b, 1);
  const j2 = ik(root, e, a, b, -1);
  const j = (j1[0] - j2[0]) * dir >= 0 ? j1 : j2;
  // control point pushed past the joint so the curve actually reaches the elbow line (rubber-hose bend)
  const cp: P = [2 * j[0] - (root[0] + e[0]) / 2, 2 * j[1] - (root[1] + e[1]) / 2];
  const d = `M${root[0]} ${root[1]} Q${cp[0]} ${cp[1]} ${e[0]} ${e[1]}`;
  const sl: P = [root[0] + (j[0] - root[0]) * sleeveLen, root[1] + (j[1] - root[1]) * sleeveLen];
  return (
    <g>
      <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" fill="none" />
      {sleeve && (
        <path
          d={`M${root[0]} ${root[1]} L${sl[0]} ${sl[1]}`}
          stroke={sleeve}
          strokeWidth={w + 6}
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  );
};

export type Mouth = 'smile' | 'grin' | 'open' | 'o' | 'flat' | 'sleep' | 'meh';

const Face: React.FC<{
  r: number;
  eyeY: number;
  eyeDX: number;
  look?: number;
  blink?: number;
  mouth?: Mouth;
  happyEyes?: boolean;
  cheek?: string;
  eyeSize?: number;
}> = ({r, eyeY, eyeDX, look = 0, blink = 0, mouth = 'smile', happyEyes = false, cheek = C.pink, eyeSize = 1}) => {
  const ex = look * r * 0.08;
  const eyeH = 12 * eyeSize * (1 - blink * 0.92);
  const mY = eyeY + r * 0.42;
  const mouths: Record<Mouth, React.ReactNode> = {
    smile: <path d={`M${-r * 0.2} ${mY} Q0 ${mY + r * 0.2} ${r * 0.2} ${mY}`} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    grin: (
      <path
        d={`M${-r * 0.26} ${mY - 2} Q0 ${mY + r * 0.36} ${r * 0.26} ${mY - 2} Z`}
        fill="#7A2335"
        stroke={C.ink}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    ),
    open: (
      <g>
        <ellipse cx={0} cy={mY + r * 0.06} rx={r * 0.16} ry={r * 0.17} fill="#7A2335" stroke={C.ink} strokeWidth={4} />
        <ellipse cx={0} cy={mY + r * 0.15} rx={r * 0.09} ry={r * 0.06} fill="#FF7E8F" />
      </g>
    ),
    o: <ellipse cx={0} cy={mY + r * 0.05} rx={r * 0.08} ry={r * 0.1} fill="#7A2335" stroke={C.ink} strokeWidth={4} />,
    flat: <path d={`M${-r * 0.14} ${mY + 4} L${r * 0.14} ${mY + 4}`} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />,
    meh: <path d={`M${-r * 0.16} ${mY + 8} Q0 ${mY - 2} ${r * 0.16} ${mY + 8}`} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    sleep: <path d={`M${-r * 0.08} ${mY + 6} Q0 ${mY + 12} ${r * 0.08} ${mY + 6}`} stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" />,
  };
  const closed = happyEyes || mouth === 'sleep' || blink > 0.85;
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s}>
          {closed ? (
            mouth === 'sleep' ? (
              <path
                d={`M${s * eyeDX - 11} ${eyeY} Q${s * eyeDX} ${eyeY + 9} ${s * eyeDX + 11} ${eyeY}`}
                stroke={C.ink}
                strokeWidth={4.5}
                fill="none"
                strokeLinecap="round"
              />
            ) : (
              <path
                d={`M${s * eyeDX - 11} ${eyeY + 3} Q${s * eyeDX} ${eyeY - 10} ${s * eyeDX + 11} ${eyeY + 3}`}
                stroke={C.ink}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
              />
            )
          ) : (
            <g>
              <ellipse cx={s * eyeDX + ex} cy={eyeY} rx={9 * eyeSize} ry={eyeH} fill={C.ink} />
              {blink < 0.5 && <circle cx={s * eyeDX + ex + 3 * eyeSize} cy={eyeY - 4 * eyeSize} r={3.2 * eyeSize} fill="#fff" />}
            </g>
          )}
          <ellipse cx={s * (eyeDX + r * 0.2)} cy={eyeY + r * 0.28} rx={r * 0.15} ry={r * 0.1} fill={cheek} opacity={0.55} />
        </g>
      ))}
      {mouths[mouth]}
    </g>
  );
};

export type ToddlerPose = {
  /** hand targets relative to the shoulders' mid-point, feet relative to the hips */
  handL?: P;
  handR?: P;
  footL?: P;
  footR?: P;
  lean?: number; // deg
  headTilt?: number; // deg
  squash?: number; // 1 = neutral, <1 squashed
  look?: number;
  blink?: number;
  mouth?: Mouth;
  happyEyes?: boolean;
};

/**
 * The toddler: big head, mini ESU-navy kit with red trim, red socks, chubby limbs.
 * ~340 units tall at scale 1.
 */
export const Toddler: React.FC<
  ToddlerPose & {x: number; y: number; scale?: number; flip?: boolean; skin?: string; hair?: string; shadow?: boolean; desat?: boolean}
> = ({
  x,
  y,
  scale = 1,
  flip = false,
  skin = SKIN.toddler,
  hair = HAIR.toddler,
  handL = [-62, 78],
  handR = [62, 78],
  footL = [-26, 92],
  footR = [26, 92],
  lean = 0,
  headTilt = 0,
  squash = 1,
  look = 0,
  blink = 0,
  mouth = 'smile',
  happyEyes = false,
  shadow = true,
  desat = false,
}) => {
  const kit = desat ? '#5B5F72' : C.navy;
  const trim = desat ? '#9AA0AF' : C.red;
  const sock = desat ? '#A5AAB6' : C.red;
  // skeleton (unflipped): hips at y=-92, shoulders at y=-196
  const hipY = -92;
  const shY = -196;
  const hipL: P = [-22, hipY];
  const hipR: P = [22, hipY];
  const shL: P = [-44, shY];
  const shR: P = [44, shY];
  const fL: P = [hipL[0] + footL[0] + 22, hipY + footL[1]];
  const fR: P = [hipR[0] + footR[0] - 22, hipY + footR[1]];
  const hL: P = [handL[0], shY + handL[1]];
  const hR: P = [handR[0], shY + handR[1]];
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * scale} ${scale})`}>
      {shadow && <ellipse cx={0} cy={4} rx={78} ry={14} fill="rgba(30,23,72,0.16)" />}
      <g transform={`scale(${1 / Math.sqrt(squash)} ${squash})`}>
        <g transform={`rotate(${lean} 0 ${hipY})`}>
          {/* legs */}
          {[
            [hipL, fL, -1] as const,
            [hipR, fR, 1] as const,
          ].map(([h, f, dir], i) => (
            <g key={i}>
              <Limb root={h} end={f} a={50} b={48} dir={dir as 1 | -1} w={30} color={skin} />
              {/* sock + shoe */}
              <g transform={`translate(${reach(h, f, 97.98)[0]} ${reach(h, f, 97.98)[1]})`}>
                <rect x={-15} y={-26} width={30} height={22} rx={8} fill={sock} />
                <rect x={-15} y={-20} width={30} height={5} fill="#fff" opacity={0.9} />
                <ellipse cx={i === 0 ? -6 : 6} cy={0} rx={26} ry={14} fill={desat ? '#3F4250' : C.ink} />
                <ellipse cx={i === 0 ? -10 : 10} cy={-4} rx={9} ry={4} fill="#fff" opacity={0.35} />
              </g>
            </g>
          ))}
          {/* shorts */}
          <path d={`M-48 ${hipY - 34} Q0 ${hipY - 44} 48 ${hipY - 34} L54 ${hipY + 14} Q30 ${hipY + 22} 4 ${hipY + 10} L-4 ${hipY + 10} Q-30 ${hipY + 22} -54 ${hipY + 14} Z`} fill={kit} />
          <rect x={-50} y={hipY - 36} width={100} height={7} rx={3} fill={trim} />
          {/* arms (behind torso edge) */}
          <Limb root={shL} end={hL} a={42} b={40} dir={-1} w={24} color={skin} sleeve={kit} sleeveLen={0.5} />
          <Limb root={shR} end={hR} a={42} b={40} dir={1} w={24} color={skin} sleeve={kit} sleeveLen={0.5} />
          <circle cx={reach(shL, hL, 81.98)[0]} cy={reach(shL, hL, 81.98)[1]} r={15} fill={skin} />
          <circle cx={reach(shR, hR, 81.98)[0]} cy={reach(shR, hR, 81.98)[1]} r={15} fill={skin} />
          {/* torso / jersey */}
          <path
            d={`M-46 ${shY - 6} Q0 ${shY - 22} 46 ${shY - 6} Q60 ${shY + 50} 52 ${hipY - 26} Q0 ${hipY - 14} -52 ${hipY - 26} Q-60 ${shY + 50} -46 ${shY - 6} Z`}
            fill={kit}
          />
          {/* collar + chest stripe + tiny crest dot */}
          <path d={`M-16 ${shY - 12} L0 ${shY + 8} L16 ${shY - 12}`} stroke={trim} strokeWidth={7} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <rect x={-52} y={shY + 44} width={104} height={8} fill={trim} opacity={0.95} />
          <circle cx={-22} cy={shY + 24} r={8} fill="#fff" opacity={0.9} />
          <circle cx={-22} cy={shY + 24} r={4} fill={trim} />
          {/* head */}
          <g transform={`rotate(${headTilt} 0 ${shY - 10})`}>
            <circle cx={-74} cy={shY - 84} r={16} fill={skin} />
            <circle cx={74} cy={shY - 84} r={16} fill={skin} />
            <circle cx={0} cy={shY - 88} r={78} fill={skin} />
            {/* hair: soft fringe + signature curl */}
            <path
              d={`M-70 ${shY - 112} Q-62 ${shY - 172} 0 ${shY - 168} Q62 ${shY - 172} 70 ${shY - 112} Q48 ${shY - 140} 18 ${shY - 130} Q-2 ${shY - 148} -22 ${shY - 128} Q-48 ${shY - 140} -70 ${shY - 112} Z`}
              fill={hair}
            />
            <path
              d={`M4 ${shY - 166} Q-6 ${shY - 196} 18 ${shY - 198} Q36 ${shY - 196} 30 ${shY - 180} Q24 ${shY - 170} 14 ${shY - 178}`}
              stroke={hair}
              strokeWidth={9}
              fill="none"
              strokeLinecap="round"
            />
            <g transform={`translate(0 ${shY - 82})`}>
              <Face r={78} eyeY={0} eyeDX={28} look={look} blink={blink} mouth={mouth} happyEyes={happyEyes} eyeSize={1.15} />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
};

export type ParentPose = {
  handL?: P;
  handR?: P;
  footL?: P;
  footR?: P;
  crouch?: number; // 0 stand, 1 deep crouch
  lean?: number;
  headTilt?: number;
  look?: number;
  blink?: number;
  mouth?: Mouth;
  happyEyes?: boolean;
};

/**
 * Mom / Dad. ~720 units tall standing. Hand targets are relative to the shoulder mid-point;
 * feet are absolute x from centre at floor level.
 */
export const Parent: React.FC<ParentPose & {kind: 'mom' | 'dad'; x: number; y: number; scale?: number; flip?: boolean; shadow?: boolean; desat?: boolean}> = ({
  kind,
  x,
  y,
  scale = 1,
  flip = false,
  handL = [-110, 230],
  handR = [110, 230],
  footL = [-46, 0],
  footR = [46, 0],
  crouch = 0,
  lean = 0,
  headTilt = 0,
  look = 0,
  blink = 0,
  mouth = 'smile',
  happyEyes = false,
  shadow = true,
  desat = false,
}) => {
  const isMom = kind === 'mom';
  const skin = isMom ? SKIN.mom : SKIN.dad;
  const hair = isMom ? HAIR.mom : HAIR.dad;
  const top = desat ? (isMom ? '#A9A2A6' : '#8F9AA8') : isMom ? C.coral : C.skyDeep;
  const pants = desat ? '#5F6474' : isMom ? '#5B7BC0' : '#2F4A7A';
  const hipY = -330 + crouch * 150;
  const shY = hipY - 230;
  const hipL: P = [-34, hipY];
  const hipR: P = [34, hipY];
  const shL: P = [-80, shY + 10];
  const shR: P = [80, shY + 10];
  const fL: P = [footL[0], footL[1] - 14];
  const fR: P = [footR[0], footR[1] - 14];
  const hL: P = [handL[0], shY + handL[1]];
  const hR: P = [handR[0], shY + handR[1]];
  const headY = shY - 92;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * scale} ${scale})`}>
      {shadow && <ellipse cx={0} cy={4} rx={130} ry={20} fill="rgba(30,23,72,0.16)" />}
      <g transform={`rotate(${lean} 0 ${hipY})`}>
        {/* legs */}
        <Limb root={hipL} end={fL} a={170} b={160} dir={-1} w={50} color={pants} />
        <Limb root={hipR} end={fR} a={170} b={160} dir={1} w={50} color={pants} />
        {[fL, fR].map((f, i) => {
          const h = i === 0 ? hipL : hipR;
          const e = reach(h, f, 329.98);
          return (
            <g key={i} transform={`translate(${e[0]} ${e[1] + 4})`}>
              <path d={`M${i === 0 ? -48 : -18} 10 Q${i === 0 ? -48 : -18} -16 ${i === 0 ? -14 : 16} -16 L${i === 0 ? 18 : 48} -4 Q${i === 0 ? 20 : 50} 12 ${i === 0 ? 10 : 40} 14 Z`} fill="#fff" stroke={desat ? '#888' : '#DADDE8'} strokeWidth={3} />
              <rect x={i === 0 ? -48 : -18} y={8} width={66} height={7} rx={3} fill={desat ? '#999' : C.red} />
            </g>
          );
        })}
        {/* hips / waistband */}
        <path d={`M-62 ${hipY - 30} L62 ${hipY - 30} L66 ${hipY + 26} Q0 ${hipY + 40} -66 ${hipY + 26} Z`} fill={pants} />
        {/* back arm drawn first */}
        <Limb root={shL} end={hL} a={130} b={120} dir={-1} w={38} color={skin} sleeve={top} sleeveLen={0.7} />
        {/* torso */}
        <path
          d={`M-84 ${shY + 4} Q0 ${shY - 22} 84 ${shY + 4} Q96 ${shY + 120} 70 ${hipY - 20} Q0 ${hipY - 6} -70 ${hipY - 20} Q-96 ${shY + 120} -84 ${shY + 4} Z`}
          fill={top}
        />
        {isMom ? (
          <path d={`M-30 ${shY - 6} Q0 ${shY + 26} 30 ${shY - 6}`} stroke={skin} strokeWidth={14} fill="none" strokeLinecap="round" />
        ) : (
          <path d={`M-26 ${shY - 8} Q0 ${shY + 12} 26 ${shY - 8}`} stroke={desat ? '#777' : '#2A7FC4'} strokeWidth={8} fill="none" strokeLinecap="round" />
        )}
        <Limb root={shR} end={hR} a={130} b={120} dir={1} w={38} color={skin} sleeve={top} sleeveLen={0.7} />
        <circle cx={reach(shL, hL, 249.98)[0]} cy={reach(shL, hL, 249.98)[1]} r={24} fill={skin} />
        <circle cx={reach(shR, hR, 249.98)[0]} cy={reach(shR, hR, 249.98)[1]} r={24} fill={skin} />
        {/* neck + head */}
        <rect x={-20} y={shY - 40} width={40} height={40} rx={10} fill={skin} />
        <g transform={`rotate(${headTilt} 0 ${shY - 20})`}>
          {isMom && (
            <>
              {/* bun + side locks that stop at the jaw (nothing under the chin) */}
              <circle cx={0} cy={headY - 84} r={32} fill={hair} />
              <ellipse cx={-62} cy={headY + 14} rx={18} ry={46} fill={hair} />
              <ellipse cx={62} cy={headY + 14} rx={18} ry={46} fill={hair} />
            </>
          )}
          <circle cx={-60} cy={headY + 4} r={13} fill={skin} />
          <circle cx={60} cy={headY + 4} r={13} fill={skin} />
          <ellipse cx={0} cy={headY} rx={62} ry={68} fill={skin} />
          {isMom ? (
            <path
              d={`M-64 ${headY + 6} Q-70 ${headY - 74} 0 ${headY - 72} Q70 ${headY - 74} 64 ${headY + 6} Q52 ${headY - 40} 10 ${headY - 44} Q-40 ${headY - 30} -64 ${headY + 6} Z`}
              fill={hair}
            />
          ) : (
            <>
              <path
                d={`M-62 ${headY - 6} Q-66 ${headY - 76} 0 ${headY - 74} Q66 ${headY - 76} 62 ${headY - 6} Q56 ${headY - 40} 30 ${headY - 46} Q-10 ${headY - 36} -40 ${headY - 46} Q-58 ${headY - 40} -62 ${headY - 6} Z`}
                fill={hair}
              />
              {/* short beard */}
              <path
                d={`M-58 ${headY + 4} Q-56 ${headY + 70} 0 ${headY + 74} Q56 ${headY + 70} 58 ${headY + 4} Q46 ${headY + 40} 0 ${headY + 42} Q-46 ${headY + 40} -58 ${headY + 4} Z`}
                fill={hair}
                opacity={0.9}
              />
            </>
          )}
          <g transform={`translate(0 ${headY + 2})`}>
            <Face r={62} eyeY={0} eyeDX={22} look={look} blink={blink} mouth={mouth} happyEyes={happyEyes} cheek={isMom ? C.pink : '#E58A7A'} eyeSize={0.85} />
          </g>
          {isMom && <circle cx={-60} cy={headY + 22} r={6} fill={C.sun} />}
        </g>
      </g>
    </g>
  );
};

/** Close-up: a parent's hand with a tiny toddler hand wrapped around one finger. */
export const HoldingHands: React.FC<{grip: number; breathe?: number}> = ({grip, breathe = 0}) => {
  const big = SKIN.mom;
  const small = SKIN.toddler;
  const g = Math.min(1, Math.max(0, grip));
  return (
    <g>
      {/* parent's hand from the right */}
      <g transform={`translate(${breathe * 4} ${breathe * -3})`}>
        <path d="M1180 520 L760 520 Q690 520 690 590 L690 700 Q690 770 760 770 L1180 790 Z" fill={big} />
        <rect x={420} y={548} width={330} height={74} rx={37} fill={big} />
        <path d="M455 560 Q440 585 455 610" stroke="#D99A75" strokeWidth={5} fill="none" strokeLinecap="round" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={640 - i * 6} y={628 + i * 46} width={120} height={48} rx={24} fill={big} stroke="#D99A75" strokeWidth={3} />
        ))}
        <path d="M760 520 Q700 470 640 492 Q610 506 634 528 Q680 530 720 548 Z" fill={big} stroke="#D99A75" strokeWidth={3} />
        <rect x={1060} y={500} width={60} height={310} fill={C.coral} />
      </g>
      {/* toddler's hand from the lower-left, fingers close around the finger as `grip` → 1 */}
      <g transform={`translate(${-40 * (1 - g)} ${60 * (1 - g)})`}>
        <path d="M120 900 Q260 760 470 690 L540 760 Q340 830 230 980 Z" fill={small} />
        <path d="M100 930 Q230 800 330 760 L360 830 Q250 880 170 990 Z" fill={C.navy} />
        <rect x={110} y={895} width={240} height={14} rx={7} fill={C.red} transform="rotate(-38 230 900)" />
        <ellipse cx={520} cy={640} rx={86} ry={70} fill={small} />
        {[0, 1, 2, 3].map((i) => {
          const fx = 470 + i * 34;
          const curl = g;
          return (
            <rect
              key={i}
              x={fx}
              y={560 - curl * 30 + i * 3}
              width={30}
              height={58 + curl * 34}
              rx={15}
              fill={small}
              stroke="#E0A47E"
              strokeWidth={3}
              transform={`rotate(${-10 + i * 6 - curl * 6} ${fx + 15} 640)`}
            />
          );
        })}
        <ellipse cx={500} cy={680} rx={34} ry={22} fill={small} stroke="#E0A47E" strokeWidth={3} transform="rotate(-30 500 680)" />
      </g>
    </g>
  );
};
