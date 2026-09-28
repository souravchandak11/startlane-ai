import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ESU} from '../presets/brand';
import {FONT} from '../presets/fonts';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const glass: React.CSSProperties = {
  background: 'rgba(245,245,247,0.94)',
  borderRadius: 44,
  boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.4) inset',
  color: '#111',
  fontFamily: FONT.ui,
};

/** Phone "screen time" weekly-report style card with bars and a counting total. */
export const ScreenTimeCard: React.FC<{at?: number; hours?: number; mins?: number}> = ({
  at = 0,
  hours = 6,
  mins = 42,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - at;
  // slams down from oversized so frame 0 already has content (cover-frame friendly)
  const s = spring({frame: f, fps, config: {stiffness: 170, damping: 15}});
  const total = hours * 60 + mins;
  // starts mid-count so the very first frame already reads as a big, scary number
  const shown = Math.round(interpolate(f, [0, 22], [total * 0.62, total], {...clamp, easing: (x) => 1 - (1 - x) ** 3}));
  const bars = [0.42, 0.55, 0.38, 0.61, 0.5, 0.95, 1];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div
      style={{
        ...glass,
        width: 860,
        padding: '46px 54px 40px',
        transform: `scale(${interpolate(s, [0, 1], [1.1, 1])}) rotate(${interpolate(s, [0, 1], [-6, -2])}deg)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 34, fontWeight: 600, color: '#6b6b73'}}>
        <div style={{width: 54, height: 54, borderRadius: 14, background: 'linear-gradient(135deg,#7b5cff,#5b3bd9)', display: 'grid', placeItems: 'center'}}>
          <div style={{width: 26, height: 26, borderRadius: '50%', border: '5px solid white', borderTopColor: 'transparent'}} />
        </div>
        SCREEN TIME · SATURDAY
      </div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 22}}>
        <div style={{fontSize: 150, fontWeight: 800, letterSpacing: -6, lineHeight: 1}}>
          {Math.floor(shown / 60)}h {String(shown % 60).padStart(2, '0')}m
        </div>
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 12,
          fontSize: 36,
          fontWeight: 700,
          color: '#fff',
          background: '#E5322D',
          padding: '8px 20px',
          borderRadius: 999,
          transform: `scale(${spring({frame: f - 22, fps, config: {stiffness: 300, damping: 12}})})`,
        }}
      >
        ▲ 38% from last week
      </div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 26, height: 250, marginTop: 36}}>
        {bars.map((b, i) => {
          const g = interpolate(spring({frame: f - i, fps, config: {stiffness: 140, damping: 16}}), [0, 1], [0.45, 1]);
          return (
            <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
              <div
                style={{
                  width: '100%',
                  height: 210 * b * g,
                  borderRadius: 14,
                  background: i >= 5 ? 'linear-gradient(180deg,#FF5A4E,#E5322D)' : '#3b82f6',
                }}
              />
              <div style={{fontSize: 30, fontWeight: 600, color: i >= 5 ? '#E5322D' : '#8a8a92'}}>{days[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Lock-screen style clock with stacked notifications. */
export const LockScreen: React.FC<{at?: number; notes: {icon: string; app: string; text: string; at: number}[]}> = ({
  at = 0,
  notes,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - at;
  const s = spring({frame: f, fps, config: {stiffness: 120, damping: 18}});
  return (
    <div style={{width: 900, textAlign: 'center', color: 'white', fontFamily: FONT.ui}}>
      <div style={{fontSize: 44, fontWeight: 600, opacity: 0.85, transform: `translateY(${(1 - s) * -40}px)`}}>
        Saturday, October 3
      </div>
      <div
        style={{
          fontSize: 300,
          fontWeight: 700,
          letterSpacing: -8,
          lineHeight: 1,
          marginTop: 6,
          transform: `scale(${interpolate(s, [0, 1], [1.3, 1])})`,
          opacity: s,
          textShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        9:00
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 50}}>
        {notes.map((n, i) => {
          const p = spring({frame: frame - n.at, fps, config: {stiffness: 260, damping: 20}});
          if (frame < n.at) return null;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                textAlign: 'left',
                padding: '24px 28px',
                borderRadius: 36,
                background: 'rgba(40,40,48,0.72)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                transform: `translateY(${(1 - p) * -80}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
                opacity: p,
              }}
            >
              <div style={{width: 76, height: 76, borderRadius: 18, background: 'rgba(255,255,255,0.12)', display: 'grid', placeItems: 'center', flexShrink: 0}}>
                <Img src={staticFile(`emoji/${n.icon}.svg`)} style={{width: 50, height: 50}} />
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 700}}>
                  <span>{n.app}</span>
                  <span style={{opacity: 0.55, fontWeight: 500}}>now</span>
                </div>
                <div style={{fontSize: 32, opacity: 0.9, marginTop: 4}}>{n.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Chat thread (kid → mom). Bubbles pop in on their frames. */
export const Chat: React.FC<{
  name: string;
  avatar: string;
  msgs: {text: string; at: number; me?: boolean; big?: boolean}[];
  tone?: 'dark' | 'light';
}> = ({name, avatar, msgs, tone = 'light'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const light = tone === 'light';
  return (
    <div
      style={{
        width: 880,
        borderRadius: 54,
        padding: '34px 36px 44px',
        background: light ? '#FFFFFF' : '#15151b',
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
        fontFamily: FONT.ui,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18, paddingBottom: 26, borderBottom: `2px solid ${light ? '#eee' : '#2a2a33'}`}}>
        <div style={{width: 84, height: 84, borderRadius: '50%', background: light ? '#f1f1f4' : '#26262e', display: 'grid', placeItems: 'center'}}>
          <Img src={staticFile(`emoji/${avatar}.svg`)} style={{width: 56, height: 56}} />
        </div>
        <div style={{fontSize: 40, fontWeight: 700, color: light ? '#111' : '#fff'}}>{name}</div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28}}>
        {msgs.map((m, i) => {
          if (frame < m.at) return null;
          const p = spring({frame: frame - m.at, fps, config: {stiffness: 420, damping: 18}});
          return (
            <div
              key={i}
              style={{
                alignSelf: m.me ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                padding: m.big ? '22px 34px' : '18px 30px',
                borderRadius: 38,
                fontSize: m.big ? 58 : 44,
                fontWeight: m.big ? 800 : 500,
                lineHeight: 1.2,
                color: m.me ? '#fff' : light ? '#111' : '#fff',
                background: m.me ? '#2F7CF6' : light ? '#ECECF0' : '#2a2a33',
                transformOrigin: m.me ? 'right bottom' : 'left bottom',
                transform: `scale(${p})`,
              }}
            >
              {m.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Search bar that types a query and then drops autocomplete suggestions. */
export const SearchBar: React.FC<{query: string; at: number; cps?: number; suggestions: string[]}> = ({
  query,
  at,
  cps = 26,
  suggestions,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - at;
  const typed = Math.max(0, Math.min(query.length, Math.floor((f / fps) * cps)));
  const doneAt = Math.ceil((query.length / cps) * fps);
  const s = spring({frame: f, fps, config: {stiffness: 160, damping: 18}});
  const caret = Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{width: 900, fontFamily: FONT.ui, transform: `translateY(${(1 - s) * 80}px)`, opacity: s}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          background: '#fff',
          borderRadius: suggestions.length && f > doneAt ? '44px 44px 0 0' : 999,
          padding: '30px 38px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <Img src={staticFile('emoji/1f50d.svg')} style={{width: 50, height: 50}} />
        <div style={{fontSize: 44, color: '#222', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {query.slice(0, typed)}
          <span style={{opacity: caret ? 1 : 0, color: '#2F7CF6'}}>|</span>
        </div>
      </div>
      {f > doneAt && (
        <div style={{background: '#fff', borderRadius: '0 0 44px 44px', padding: '6px 0 20px', boxShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>
          {suggestions.map((q, i) => {
            const p = spring({frame: f - doneAt - i * 3, fps, config: {stiffness: 300, damping: 22}});
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 22,
                  alignItems: 'center',
                  padding: '16px 38px',
                  fontSize: 38,
                  color: '#333',
                  opacity: p,
                  transform: `translateX(${(1 - p) * 40}px)`,
                }}
              >
                <span style={{color: '#9aa0a6', fontSize: 34}}>↻</span>
                <span>
                  {query}
                  <b style={{color: '#111'}}>{q}</b>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/** Simple pill chip used for program facts. */
export const Chip: React.FC<{icon: string; label: string; at: number; accent?: string}> = ({
  icon,
  label,
  at,
  accent = ESU.gold,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: ESU.spring.headline});
  if (frame < at) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 20,
        padding: '20px 34px 20px 22px',
        borderRadius: 999,
        background: 'rgba(10,31,63,0.82)',
        border: `3px solid ${accent}`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
        transform: `translateX(${(1 - p) * -120}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`,
        opacity: p,
      }}
    >
      <Img src={staticFile(`emoji/${icon}.svg`)} style={{width: 64, height: 64}} />
      <span style={{fontFamily: FONT.caption, fontWeight: 800, fontSize: 50, color: ESU.white, letterSpacing: -0.5}}>
        {label}
      </span>
    </div>
  );
};
