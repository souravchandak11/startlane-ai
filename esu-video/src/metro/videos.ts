import {M, timing} from './Metro';
import type {MetroVideo, Narration} from './Metro';
import nA from '../data/metro/A_bench.out.json';
import nB from '../data/metro/B_behind.out.json';
import nC from '../data/metro/C_scholarship.out.json';
import nD from '../data/metro/D_unrushed.out.json';
import nE from '../data/metro/E_seventy.out.json';

const HOLD = 52;
const P = (n: string) => `photos/${n}.jpg`;
const V = (n: string) => `footage/${n}.mp4`;

// ── A · The price of a bench ──────────────────────────────────────────
const A = (() => {
  const narration = nA as Narration;
  const {w, voEnd} = timing(narration);
  const v: MetroVideo = {
    vo: 'A_bench',
    narration,
    rail: {left: 'THE BILL', right: 'THE BALL'},
    scenes: [
      {from: 0, canvas: 'screen', power: true, media: {src: V('select_run'), rate: 0.75, bandY: 520, bandH: 1000}, items: [
        {k: 'vhs', left: 'PLAY ▶', right: 'CLUB SEASON · LA'},
        {k: 'slam', at: w(0), lines: [['$4,000']], y: 820, size: 300},
        {k: 'label', at: w(0) + 4, text: 'A YEAR OF CLUB SOCCER · LOS ANGELES', x: 70, y: 1140, color: M.gold, align: 'center', size: 26},
      ]},
      {from: w(3), canvas: 'screen', media: {src: P('lineup'), bandY: 690, bandH: 760}, items: [
        {k: 'spread', from: 3, to: 11, y: 450},
        {k: 'slam', at: w(12), lines: [['LOS', {img: P('field_wide')}, 'ANGELES']], y: 1180, size: 150},
        {k: 'source', at: w(12), text: 'ANYTIME SOCCER · 2026 COST GUIDE · LA $4K–$9K+/YR'},
      ]},
      {from: w(14), canvas: 'navy', items: [
        {k: 'spread', from: 14, to: 19, y: 470},
        {k: 'counter', at: w(18), dur: 16, from: 4000, to: 9000, prefix: '$', suffix: '+', y: 760, size: 300, color: M.gold},
        {k: 'label', at: w(20), text: 'AT THE TOP END', x: 70, y: 1080, color: M.ivory, align: 'center', size: 28},
        {k: 'source', at: w(18), text: 'ANYTIME SOCCER · 2026 CITY COST GUIDE'},
      ]},
      {from: w(21), canvas: 'black', items: [{k: 'slam', at: w(21), lines: [['FEES.']], y: 780, size: 300}]},
      {from: w(22), canvas: 'navy', items: [{k: 'slam', at: w(22), lines: [['TRAVEL.']], y: 780, size: 300}]},
      {from: w(23), canvas: 'black', items: [{k: 'slam', at: w(23), lines: [['TOURNA-'], ['MENTS.']], y: 700, size: 260}]},
      {from: w(24), canvas: 'paper', items: [
        {k: 'spread', from: 24, to: 33, y: 440},
        {k: 'invoice', at: w(24) + 2, x: 150, y: 720, w: 780, title: 'CLUB SEASON · INVOICE', rows: [
          {label: 'FEES', value: '$ $ $', at: w(24) + 4},
          {label: 'TRAVEL', value: '$ $', at: w(24) + 8},
          {label: 'TOURNAMENTS', value: '$ $', at: w(24) + 12},
          {label: 'TIME ON THE BALL', value: '—', at: w(34), red: true},
        ]},
        {k: 'stamp', at: w(34) + 6, text: 'NOT LISTED', x: 360, y: 1150, rot: -7, color: M.red, size: 92},
      ]},
      {from: w(35), canvas: 'screen', flash: true, media: {src: V('touch'), bandY: 560, bandH: 900}, items: [
        {k: 'slam', at: w(35), lines: [['TIME ON'], ['THE BALL.']], lineAt: [w(35), w(37)], colors: [M.ivory, M.gold], y: 820, size: 220},
      ]},
      {from: w(39), canvas: 'navy', items: [
        {k: 'spread', from: 39, to: 45, y: 460},
        {k: 'slam', at: w(46), lines: [['AGE', {img: P('kids_field')}], [{img: P('select_duel')}, 'ABILITY.']], lineAt: [w(46), w(48)], colors: [M.ivory, M.gold], y: 760, size: 210},
      ]},
      {from: w(49), canvas: 'paper', items: [
        {k: 'polaroid', at: w(49), src: P('training'), x: 80, y: 470, w: 440, h: 300, rot: -4, label: 'COACHES'},
        {k: 'polaroid', at: w(51), src: P('coach_toddlers'), x: 560, y: 440, w: 440, h: 300, rot: 3, label: 'SAT'},
        {k: 'polaroid', at: w(53), src: P('kids_run'), x: 100, y: 900, w: 430, h: 290, rot: 2, label: 'SUN'},
        {k: 'polaroid', at: w(56), src: P('field_wide'), x: 560, y: 880, w: 440, h: 300, rot: -3, label: 'PLAYA VISTA'},
        {k: 'string', at: w(57), pts: [[300, 476], [780, 446], [780, 886], [315, 906], [300, 476]]},
        {k: 'slam', at: w(49), lines: [['BACKGROUND-CHECKED'], ['COACHES.']], lineAt: [w(49), w(50)], colors: [M.ink, M.red], y: 1290, size: 92},
      ]},
      {from: w(58), canvas: 'black', items: [{k: 'slam', at: w(58), lines: [['7-WEEK'], ['BLOCKS.']], y: 700, size: 260, colors: [M.ivory, M.gold]}]},
      {from: w(60), canvas: 'screen', media: {src: V('strike'), bandY: 620, bandH: 820}, items: [
        {k: 'spread', from: 60, to: 60, y: 460},
        {k: 'slam', at: w(61), lines: [['DROP IN'], ['ONCE.']], lineAt: [w(61), w(63)], colors: [M.ivory, M.gold], y: 840, size: 220},
      ]},
    ],
    end: {from: w(66), photo: P('select_dribble'), lines: ['TIME ON', 'THE BALL.'], info: [['WEEKEND ACADEMY · AGES 4–12', 'GROUPED BY AGE + ABILITY'], ['THE SPORTS PARK', 'PLAYA VISTA · SAT & SUN']], cta: 'COMMENT “BALL” →'},
  };
  return {v, duration: voEnd + HOLD};
})();

// ── B · Technically behind ────────────────────────────────────────────
const B = (() => {
  const narration = nB as Narration;
  const {w, voEnd} = timing(narration);
  const v: MetroVideo = {
    vo: 'B_behind',
    narration,
    rail: {left: 'TRYOUT', right: 'READY'},
    scenes: [
      {from: 0, canvas: 'screen', power: true, media: {src: P('select_run'), bandY: 520, bandH: 1000}, items: [
        {k: 'vhs', left: 'PLAY ▶', right: 'TRYOUTS · FEB'},
        {k: 'spread', from: 0, to: 1, y: 470},
        {k: 'slam', at: w(2), lines: [['TECHNICALLY'], ['BEHIND.']], lineAt: [w(2), w(3)], colors: [M.ivory, M.red], y: 1040, size: 190},
      ]},
      {from: w(4), canvas: 'screen', media: {src: P('select_duel'), bandY: 690, bandH: 680}, items: [
        {k: 'spread', from: 4, to: 10, y: 450},
        {k: 'slam', at: w(11), lines: [['AT NINE.']], y: 1120, size: 240, colors: [M.gold]},
      ]},
      {from: w(13), canvas: 'navy', items: [
        {k: 'spread', from: 13, to: 13, y: 450},
        {k: 'slam', at: w(14), lines: [['SOUTHERN'], ['CALIFORNIA']], lineAt: [w(14), w(15)], colors: [M.ivory, M.gold], y: 520, size: 150},
        {k: 'spread', from: 16, to: 20, y: 830, size: 40},
        {k: 'tiles', at: w(21), tiles: ['FEB', '10', '→', 'MAR', '31'], y: 950, stagger: 11, size: 130},
        {k: 'label', at: w(25), text: 'THE MAIN SOCAL TRYOUT WINDOW', x: 70, y: 1150, color: M.gold, align: 'center', size: 26},
        {k: 'source', at: w(21), text: 'SOCAL PITCH TRYOUT GUIDE · 2ND WINDOW MAY–JUNE'},
      ]},
      {from: w(26), canvas: 'paper', items: [
        {k: 'spread', from: 26, to: 34, y: 430},
        {k: 'quote', from: 35, to: 54, x: 60, y: 680, w: 960, rot: -1.2, source: 'PARENT POST · SOCALSOCCER.COM FORUM · 2025', size: 46, enterAt: w(26) + 8},
        {k: 'stamp', at: w(50), text: 'BEFORE TRYOUTS', x: 230, y: 1200, rot: -7, color: M.red, size: 88},
      ]},
      {from: w(55), canvas: 'black', flash: true, items: [
        {k: 'spread', from: 55, to: 57, y: 470},
        {k: 'slam', at: w(58), lines: [['TECHNICALLY'], ['BEHIND'], ['= ?']], lineAt: [w(58), w(59), w(61)], colors: [M.ivory, M.ivory, M.red], y: 700, size: 190},
      ]},
      {from: w(62), canvas: 'black', items: [{k: 'slam', at: w(62), lines: [['FEWER'], ['TOUCHES.']], lineAt: [w(62), w(63)], y: 740, size: 240}]},
      {from: w(64), canvas: 'navy', items: [{k: 'slam', at: w(64), lines: [['FEWER'], ['REPS.']], lineAt: [w(64), w(65)], y: 740, size: 240}]},
      {from: w(66), canvas: 'black', items: [{k: 'slam', at: w(66), lines: [['LESS'], ['COACHING.']], lineAt: [w(66), w(67)], y: 740, size: 240}]},
      {from: w(68), canvas: 'screen', flash: true, media: {src: V('touch'), bandY: 560, bandH: 900}, items: [
        {k: 'slam', at: w(68), lines: [['ALL'], ['FIXABLE.']], lineAt: [w(68), w(69)], colors: [M.ivory, M.gold], y: 820, size: 250},
      ]},
      {from: w(70), canvas: 'paper', items: [
        {k: 'spread', from: 70, to: 76, y: 430},
        {k: 'polaroid', at: w(77), src: P('kids_field'), x: 70, y: 690, w: 450, h: 290, rot: -3, label: 'AGE'},
        {k: 'polaroid', at: w(79), src: P('select_duel'), x: 560, y: 670, w: 450, h: 290, rot: 3, label: 'ABILITY'},
        {k: 'string', at: w(79) + 10, pts: [[295, 696], [785, 676]]},
        {k: 'slam', at: w(82), lines: [['STARTS EXACTLY'], ['WHERE HE IS.']], lineAt: [w(83), w(84)], colors: [M.ink, M.red], y: 1130, size: 124},
      ]},
    ],
    end: {from: w(87), photo: P('kids_run'), lines: ['NOT BEHIND.', 'JUST STARTING.'], info: [['WEEKEND ACADEMY · AGES 4–12', 'EVERY SKILL LEVEL'], ['GROUPED BY AGE + ABILITY', 'THE SPORTS PARK · PLAYA VISTA']], cta: 'COMMENT “READY” →'},
  };
  return {v, duration: voEnd + HOLD};
})();

// ── C · The scholarship math ──────────────────────────────────────────
const C = (() => {
  const narration = nC as Narration;
  const {w, voEnd} = timing(narration);
  const v: MetroVideo = {
    vo: 'C_scholarship',
    narration,
    display: {'N-C-double-A': 'NCAA'},
    rail: {left: 'THE PITCH', right: 'THE BALL'},
    scenes: [
      {from: 0, canvas: 'screen', power: true, media: {src: P('select_duel'), bandY: 690, bandH: 680}, items: [
        {k: 'vhs', left: 'PLAY ▶', right: 'THE FINE PRINT'},
        {k: 'spread', from: 0, to: 1, y: 470},
        {k: 'slam', at: w(2), lines: [['NEVER'], ['PROMISE A'], ['SCHOLARSHIP.']], lineAt: [w(2), w(3), w(7)], colors: [M.red, M.ivory, M.ivory], y: 720, size: 190},
      ]},
      {from: w(8), canvas: 'black', flash: true, items: [{k: 'slam', at: w(8), lines: [["HERE'S WHY."]], y: 820, size: 220}]},
      {from: w(10), canvas: 'navy', items: [
        {k: 'spread', from: 10, to: 10, y: 450},
        {k: 'slam', at: w(11), lines: [['1 IN 17']], y: 540, size: 280, colors: [M.gold]},
        {k: 'dots', at: w(13), n: 17, cols: 9, y: 860, dot: 64, color: M.red, dim: 'rgba(255,253,247,0.45)'},
        {k: 'spread', from: 14, to: 25, y: 1060, size: 40},
        {k: 'source', at: w(14), text: 'NCAA RESEARCH · 2024–25 DATA (UPDATED MARCH 2026)'},
      ]},
      {from: w(26), canvas: 'navy', items: [
        {k: 'slam', at: w(26), lines: [['DIVISION I?']], y: 450, size: 150},
        {k: 'slam', at: w(29), lines: [['1 IN 70']], y: 620, size: 260, colors: [M.gold]},
        {k: 'dots', at: w(31), n: 70, cols: 10, y: 920, dot: 44, color: M.red, dim: 'rgba(255,253,247,0.45)'},
        {k: 'source', at: w(26), text: 'NCAA RESEARCH · MEN’S SOCCER · 2024–25'},
      ]},
      {from: w(32), canvas: 'paper', items: [
        {k: 'slam', at: w(32), lines: [['GIRLS:']], y: 450, size: 130},
        {k: 'slam', at: w(36), lines: [['1 IN 13']], y: 600, size: 230, colors: [M.red]},
        {k: 'label', at: w(38), text: 'PLAY NCAA SOCCER', x: 70, y: 830, color: M.ink, align: 'center', size: 28},
        {k: 'slam', at: w(40), lines: [['1 IN 36']], y: 900, size: 230, colors: [M.ink]},
        {k: 'label', at: w(42), text: 'PLAY DIVISION I', x: 70, y: 1130, color: M.ink, align: 'center', size: 28},
        {k: 'source', at: w(32), text: 'NCAA RESEARCH · WOMEN’S SOCCER · 2024–25'},
      ]},
      {from: w(43), canvas: 'screen', media: {src: P('select_run'), bandY: 660, bandH: 800}, items: [
        {k: 'spread', from: 43, to: 49, y: 450},
        {k: 'slam', at: w(50), lines: [['A PATHWAY?'], ['NOT FOR SALE.']], lineAt: [w(50), w(50) + 9], colors: [M.ivory, M.red], y: 1120, size: 150},
      ]},
      {from: w(51), canvas: 'screen', flash: true, media: {src: V('touch'), bandY: 560, bandH: 900}, items: [
        {k: 'spread', from: 51, to: 53, y: 460},
        {k: 'slam', at: w(54), lines: [['THE BALL.']], y: 880, size: 270, colors: [M.gold]},
      ]},
      {from: w(56), canvas: 'screen', media: {src: P('kick'), bandY: 640, bandH: 760}, items: [{k: 'slam', at: w(56), lines: [['FIRST'], ['TOUCH.']], lineAt: [w(56), w(57)], y: 800, size: 230}]},
      {from: w(58), canvas: 'screen', media: {src: P('training'), bandY: 640, bandH: 760}, items: [{k: 'slam', at: w(58), lines: [['FIRST'], ['PASS.']], lineAt: [w(58), w(59)], y: 800, size: 230}]},
      {from: w(60), canvas: 'screen', media: {src: P('lineup'), bandY: 560, bandH: 900}, items: [{k: 'slam', at: w(60), lines: [['FIRST REAL'], ['GAME.']], lineAt: [w(60), w(62)], colors: [M.ivory, M.gold], y: 800, size: 210}]},
      {from: w(63), canvas: 'paper', items: [
        {k: 'polaroid', at: w(63), src: P('kids_field'), x: 80, y: 460, w: 440, h: 290, rot: -4, label: 'AGE'},
        {k: 'polaroid', at: w(65), src: P('boy_bib'), x: 560, y: 440, w: 440, h: 290, rot: 3, label: 'ABILITY'},
        {k: 'polaroid', at: w(68), src: P('field_wide'), x: 100, y: 880, w: 430, h: 290, rot: 2, label: 'SAT + SUN'},
        {k: 'polaroid', at: w(73), src: P('coach_toddlers'), x: 560, y: 860, w: 440, h: 290, rot: -3, label: 'PLAYA VISTA'},
        {k: 'string', at: w(74), pts: [[300, 466], [780, 446], [780, 866], [315, 886], [300, 466]]},
        {k: 'slam', at: w(68), lines: [['SAT + SUN MORNINGS']], y: 1300, size: 96, colors: [M.red]},
      ]},
    ],
    end: {from: w(75), photo: P('select_dribble'), lines: ['NO PITCH.', 'JUST THE BALL.'], info: [['GROUPED BY AGE + ABILITY', 'WEEKEND ACADEMY · AGES 4–12'], ['SAT & SUN MORNINGS', 'THE SPORTS PARK · PLAYA VISTA']], cta: 'COMMENT “PROMISE” →'},
  };
  return {v, duration: voEnd + HOLD};
})();

// ── D · Unrushed ──────────────────────────────────────────────────────
const D = (() => {
  const narration = nD as Narration;
  const {w, voEnd} = timing(narration);
  const v: MetroVideo = {
    vo: 'D_unrushed',
    narration,
    rail: {left: 'EVERY WEEKEND', right: 'YOURS'},
    scenes: [
      {from: 0, canvas: 'screen', power: true, media: {src: V('field_wide'), bandY: 640, bandH: 760}, items: [
        {k: 'vhs', left: 'PLAY ▶', right: 'SAT · 6:40 AM'},
        {k: 'slam', at: w(0), lines: [['EVERY'], ['WEEKEND.']], lineAt: [w(0), w(1)], y: 780, size: 260},
      ]},
      {from: w(2), canvas: 'navy', items: [
        {k: 'spread', from: 2, to: 8, y: 450},
        {k: 'tiles', at: w(4), tiles: ['SAT', 'SUN', 'SAT', 'SUN'], y: 760, stagger: 5, size: 120},
        {k: 'slam', at: w(9), lines: [['A FAMILY.']], y: 1040, size: 220, colors: [M.gold]},
      ]},
      {from: w(10), canvas: 'paper', items: [
        {k: 'spread', from: 10, to: 15, y: 440},
        {k: 'quote', from: 16, to: 25, x: 60, y: 660, w: 960, rot: -1.2, source: 'DIANE SCHRADER · THE BLAZE · 2025', size: 46, enterAt: w(10) + 8},
      ]},
      {from: w(26), canvas: 'navy', items: [
        {k: 'spread', from: 26, to: 27, y: 450},
        {k: 'slam', at: w(28), lines: [['PRACTICE +'], ['GAME DAYS:']], lineAt: [w(28), w(30)], colors: [M.ivory, M.gold], y: 530, size: 130},
        {k: 'tiles', at: w(36), tiles: ['3', ':', '23'], y: 830, stagger: 12, size: 180},
        {k: 'label', at: w(40), text: 'HOURS · EVERY PRACTICE OR GAME DAY', x: 70, y: 1070, color: M.gold, align: 'center', size: 26},
        {k: 'spread', from: 32, to: 35, y: 1180, size: 40},
        {k: 'source', at: w(32), text: 'ASPEN INSTITUTE PROJECT PLAY · 2025 PARENT SURVEY'},
      ]},
      {from: w(43), canvas: 'black', flash: true, items: [
        {k: 'spread', from: 43, to: 44, y: 470},
        {k: 'slam', at: w(45), lines: [['A DIFFERENT'], ['SHAPE.']], lineAt: [w(45), w(46)], colors: [M.ivory, M.gold], y: 760, size: 210},
      ]},
      {from: w(50), canvas: 'screen', media: {src: V('kids_field'), bandY: 660, bandH: 720}, items: [{k: 'slam', at: w(50), lines: [['ONE CLASS.']], y: 860, size: 230}]},
      {from: w(52), canvas: 'screen', media: {src: P('game_wide'), bandY: 640, bandH: 760}, items: [{k: 'slam', at: w(52), lines: [['SAT OR SUN'], ['MORNING.']], lineAt: [w(52), w(55)], colors: [M.ivory, M.gold], y: 800, size: 210}]},
      {from: w(56), canvas: 'paper', items: [
        {k: 'polaroid', at: w(57), src: P('field_wide'), x: 80, y: 470, w: 440, h: 290, rot: -3, label: 'THE SPORTS PARK'},
        {k: 'polaroid', at: w(59), src: P('tent'), x: 560, y: 520, w: 440, h: 290, rot: 3},
        {k: 'polaroid', at: w(61), src: P('kids_run'), x: 290, y: 930, w: 480, h: 320, rot: -1, label: 'PLAYA VISTA'},
        {k: 'string', at: w(62), pts: [[300, 476], [780, 526], [530, 936], [300, 476]]},
      ]},
      {from: w(63), canvas: 'screen', flash: true, media: {src: P('boy_bib'), bandY: 660, bandH: 720}, items: [
        {k: 'slam', at: w(65), lines: [['THE REST IS'], ['YOURS.']], lineAt: [w(65), w(70)], colors: [M.ivory, M.gold], y: 840, size: 210},
      ]},
    ],
    end: {from: w(71), photo: P('training'), lines: ['ONE CLASS.', "THEN IT'S YOURS."], info: [['WEEKEND ACADEMY · AGES 4–12', 'SAT OR SUN MORNING'], ['THE SPORTS PARK', 'PLAYA VISTA']], cta: 'COMMENT “WEEKEND” →'},
  };
  return {v, duration: voEnd + HOLD};
})();

// ── E · 70% by 13 ─────────────────────────────────────────────────────
const E = (() => {
  const narration = nE as Narration;
  const {w, voEnd} = timing(narration);
  const v: MetroVideo = {
    vo: 'E_seventy',
    narration,
    rail: {left: '70%', right: 'AT 13'},
    scenes: [
      {from: 0, canvas: 'screen', power: true, media: {src: P('kids_run'), bw: true, bandY: 640, bandH: 760}, items: [
        {k: 'vhs', left: 'PLAY ▶', right: 'AGE 13'},
        {k: 'slam', at: w(0), lines: [['70%']], y: 700, size: 360, colors: [M.red]},
        {k: 'label', at: w(0) + 3, text: 'OF KIDS QUIT ORGANIZED SPORTS BY 13', x: 70, y: 1110, color: M.ivory, align: 'center', size: 28},
      ]},
      {from: w(2), canvas: 'navy', items: [
        {k: 'spread', from: 2, to: 11, y: 440},
        {k: 'dots', at: w(6), n: 10, cols: 10, y: 790, dot: 72, color: M.red, dim: 'rgba(255,253,247,0.5)', lit: 7},
        {k: 'slam', at: w(12), lines: [['BY 13.']], y: 950, size: 260, colors: [M.gold]},
      ]},
      {from: w(15), canvas: 'paper', items: [
        {k: 'clipping', at: w(15), x: 70, y: 440, w: 940, rot: -1, masthead: 'PEDIATRICS', meta: 'CLINICAL REPORT · VOL 153 · ISSUE 2 · 2024', title: 'Overuse Injuries, Overtraining, and Burnout in Young Athletes', byline: 'AAP COUNCIL ON SPORTS MEDICINE AND FITNESS', excerpt: '70% of youth athletes choosing to discontinue participation in organized sports by 13 years of age', hiAt: w(18)},
        {k: 'source', at: w(15), text: 'AMERICAN ACADEMY OF PEDIATRICS · PEDIATRICS 2024;153(2)'},
      ]},
      {from: w(22), canvas: 'black', items: [
        {k: 'spread', from: 22, to: 25, y: 470},
        {k: 'slam', at: w(26), lines: [['3 THINGS.']], y: 800, size: 260, colors: [M.gold]},
      ]},
      {from: w(28), canvas: 'black', flash: true, items: [{k: 'slam', at: w(28), lines: [['OVERUSE.']], y: 800, size: 260, colors: [M.ivory]}]},
      {from: w(29), canvas: 'navy', items: [{k: 'slam', at: w(29), lines: [['OVER-'], ['TRAINING.']], y: 700, size: 240}]},
      {from: w(30), canvas: 'black', items: [{k: 'slam', at: w(30), lines: [['BURNOUT.']], y: 800, size: 260, colors: [M.red]}]},
      {from: w(31), canvas: 'paper', items: [
        {k: 'spread', from: 31, to: 41, y: 430},
        {k: 'polaroid', at: w(37), src: P('kids_field'), x: 250, y: 760, w: 580, h: 380, rot: -2, label: 'THE EARLY YEARS'},
      ]},
      {from: w(42), canvas: 'screen', flash: true, media: {src: V('touch'), bandY: 560, bandH: 900}, items: [
        {k: 'slam', at: w(42), lines: [['TECHNIQUE,'], ['TAUGHT PATIENTLY.']], lineAt: [w(42), w(43)], colors: [M.ivory, M.gold], y: 820, size: 132},
      ]},
      {from: w(45), canvas: 'navy', items: [
        {k: 'slam', at: w(45), lines: [['GROUPS BY']], y: 560, size: 150},
        {k: 'slam', at: w(47), lines: [['AGE', {img: P('kids_field')}], [{img: P('select_duel')}, 'ABILITY.']], lineAt: [w(47), w(49)], colors: [M.ivory, M.gold], y: 760, size: 210},
      ]},
      {from: w(50), canvas: 'screen', media: {src: P('game_wide'), bandY: 640, bandH: 760}, items: [{k: 'slam', at: w(50), lines: [['ONE MORNING'], ['A WEEK.']], lineAt: [w(50), w(52)], colors: [M.ivory, M.gold], y: 800, size: 200}]},
      {from: w(54), canvas: 'paper', items: [
        {k: 'spread', from: 54, to: 58, y: 450},
        {k: 'slam', at: w(60), lines: [['A TROPHY?']], y: 760, size: 230},
        {k: 'stamp', at: w(61) + 6, text: 'NOT THE GOAL', x: 220, y: 1030, rot: -7, color: M.red, size: 100},
      ]},
      {from: w(62), canvas: 'screen', flash: true, media: {src: P('select_run'), bandY: 520, bandH: 1000}, items: [
        {k: 'slam', at: w(63), lines: [['STILL PLAYING'], ['AT 13.']], lineAt: [w(64), w(67)], colors: [M.ivory, M.gold], y: 960, size: 170},
      ]},
    ],
    end: {from: w(69), photo: P('lineup'), lines: ['STILL PLAYING', 'AT 13.'], info: [['TECHNIQUE FIRST', 'GROUPED BY AGE + ABILITY'], ['SAT & SUN MORNINGS', 'THE SPORTS PARK · PLAYA VISTA']], cta: 'COMMENT “PLAY” →'},
  };
  return {v, duration: voEnd + HOLD};
})();

export const METRO_VIDEOS = {A, B, C, D, E};
