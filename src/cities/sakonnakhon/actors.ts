// Pure position math for Sakon Nakhon's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same
// functions.
import type {Actor} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {
  AIRPORT, HERO_AT, LEGEND_AT, HERO_S, KHOM_BRIDGE, PHU_PHAN, PROCESSION, RAFT_PATH, RUNWAY_ROT, SOUTH_ROAD, STUPA, THA_RAE,
  YO_ROAD,
} from './places';
import {STORY} from './timeline';

type P = [number, number];
const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
export const beatK = (id: string, t: number) => {
  const [a, b] = STORY.at(id);
  return (t - a) / (b - a);
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const along = (pts: P[], d: number) => {
  let r = Math.max(0, d);
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1];
    const [bx, bz] = pts[i];
    const len = Math.hypot(bx - ax, bz - az);
    if (r <= len) return {x: lerp(ax, bx, r / len), z: lerp(az, bz, r / len), rot: Math.atan2(bx - ax, bz - az)};
    r -= len;
  }
  const [ax, az] = pts[pts.length - 2];
  const [bx, bz] = pts[pts.length - 1];
  return {x: bx, z: bz, rot: Math.atan2(bx - ax, bz - az)};
};
export const lengthOf = (pts: P[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// ------------------------------------------------------------------ the cover: the indigo cloth
export const DYE_END = 1.6;
/** how far up the cloth the dye has climbed (0 foot .. 1 pole): a fifth up at frame 0 */
export const dyeFront = (t: number) => 0.22 + 0.78 * smooth(clamp01(t / DYE_END));
/** how far the blue (oxidised) part trails the green front: it catches up 0.5 s behind */
export const blueFront = (t: number) => (t < 0.5 ? 0.12 : 0.22 + 0.78 * smooth(clamp01((t - 0.5) / DYE_END)));
/** the pole lifts and the cloth billows once it is dyed */
export const liftK = (t: number) => smooth(clamp01((t - DYE_END) / 1.4));
const SHRINK0 = 4.4;
const SHRINK1 = 6.4;
/** the cover's scale: legend scale, then gone into the lake by the end of the cover */
export const heroScale = (t: number) => 1 - smooth(clamp01((t - SHRINK0) / (SHRINK1 - SHRINK0)));
export const CLOTH_W = 2.2 * HERO_S;
export const CLOTH_H = 3.2 * HERO_S;
export const POT_H = 1.0 * HERO_S;
/** the indigo ring that runs out across the plain and becomes the lake's edge */
export const ringK = (t: number) => clamp01((t - DYE_END + 0.2) / 3.2);

// ------------------------------------------------------------------ the legend: the town sinks, the lake rises
/** 0 -> 1: the lake spreading out from where the town sank (about ดอนสวรรค์), full by 90% of the beat */
export const lakeK = (t: number) => {
  if (t >= beatAt('sink', 0.9)) return 1;
  return smooth(clamp01((beatK('sink', t) - 0.0) / 0.8));
};
/** the legend town's drop below the ground: it goes before the water reaches it */
export const sinkK = (t: number) => smooth(clamp01((beatK('sink', t) + 0.05) / 0.85));
export {LEGEND_AT};

// ------------------------------------------------------------------ the Khmer town
export const khmerK = (t: number) => smooth(clamp01(beatK('khmer', t) / 0.6));
/** the Brahmins' procession over the Khom bridge and in at the west gate to the prasat */
export const BRAHMIN_PATH: P[] = [[KHOM_BRIDGE[0] - 5, KHOM_BRIDGE[1] - 1.2], [KHOM_BRIDGE[0] + 2, KHOM_BRIDGE[1]], [-5.4, -2.2], [-1.6, -0.6]];
export const BRAHMINS = 12;
export const brahminAt = (i: number, t: number) => {
  const k = beatK('khmer', t);
  if (k < 0 || k > 1.3) return null;
  const L = lengthOf(BRAHMIN_PATH);
  const d = lerp(0, L - 0.4, smooth(clamp01((k - 0.25) / 0.75))) + 3.6 - i * 0.5;
  if (d < 0) return null;
  return {...along(BRAHMIN_PATH, Math.min(d, L - 0.4 - i * 0.12)), moving: k < 1};
};

// ------------------------------------------------------------------ Lan Xang: the stupa closes over the prasat
export const stupaK = (t: number) => smooth(clamp01((beatK('lanxang', t) - 0.05) / 0.6));

// ------------------------------------------------------------------ 2370: the town led away south
export const LEAVE_N = 18;
const SOUTH_L = lengthOf(SOUTH_ROAD);
export const leaveAt = (i: number, t: number) => {
  const k = beatK('leave', t);
  if (k < 0 || k > 1.05) return null;
  const d = lerp(0, SOUTH_L, smooth(clamp01((k - 0.05) / 0.95)) * 0.85) - i * 1.0;
  if (d < 0 || d > SOUTH_L - 0.2) return null;
  return {...along(SOUTH_ROAD, d), fade: clamp01((1.05 - k) / 0.1)};
};
/** Sakon Thawapi's outer houses empty and go; the ข้าพระธาตุ ring round the stupa stays */
export const thawapiK = (t: number, Y: number) => {
  if (Y < 1700) return 0;
  const up = smooth(clamp01((beatK('leave', t) + 0.6) / 0.4));
  return up;
};
export const emptyK = (t: number) => smooth(clamp01((beatK('leave', t) - 0.35) / 0.5));

// ------------------------------------------------------------------ 2381: the Tai Yo arrive
export const ARRIVE_N = 20;
const YO_L = lengthOf(YO_ROAD);
export const arriveAt = (i: number, t: number) => {
  const k = beatK('arrive', t);
  if (k < -0.1 || k > 1.25) return null;
  const head = lerp(YO_L * 0.25, YO_L - 0.4, smooth(clamp01((k + 0.1) / 0.85)));
  const d = head - i * 1.1;
  if (d < 0) return null;
  return {...along(YO_ROAD, d), moving: k < 0.75};
};

// ------------------------------------------------------------------ 2427: the rafts to Tha Rae
export const RAFTS = 5;
const RAFT_L = lengthOf(RAFT_PATH);
export const raftAt = (i: number, t: number) => {
  const k = beatK('cross', t);
  if (k < 0 || k > 1.2) return null;
  const d = lerp(0, RAFT_L - 0.4, smooth(clamp01(k / 0.66))) - i * 3.4;
  if (d < 0) return null;
  return along(RAFT_PATH, d);
};
export const thaRaeK = (t: number, Y: number) => (Y > 1885 ? 1 : smooth(clamp01((beatK('cross', t) - 0.6) / 0.35)));

// ------------------------------------------------------------------ 2487: the parachutes over Phu Phan
const DROP_AT: P = [PHU_PHAN[0] + 2, PHU_PHAN[1] - 6];
export const planeAt = (i: number, t: number) => {
  const t0 = beatAt('drop', 0.16) + i * 1.4;
  const u = (t - t0) / 3.4;
  if (u < 0 || u > 1) return null;
  // flying in from the north-east, over the hills, out to the south-west
  const x = lerp(DROP_AT[0] + 20, DROP_AT[0] - 18, u);
  const z = lerp(DROP_AT[1] - 18, DROP_AT[1] + 14, u);
  return {x, z, y: 14 + i * 1.2, rot: Math.atan2(-38, 32)};
};
export const CHUTES = 10;
/** chute j drops from plane (j % 2) as it passes over the hills, drifting down */
export const chuteAt = (j: number, t: number) => {
  const i = j % 2;
  const t0 = beatAt('drop', 0.16) + i * 1.4 + 1.0 + Math.floor(j / 2) * 0.22;
  const u = (t - t0) / 3.2;
  if (u < 0 || u > 1) return null;
  const x0 = lerp(DROP_AT[0] + 20, DROP_AT[0] - 18, (t0 - beatAt('drop', 0.16) - i * 1.4) / 3.4);
  const z0 = lerp(DROP_AT[1] - 18, DROP_AT[1] + 14, (t0 - beatAt('drop', 0.16) - i * 1.4) / 3.4);
  return {x: x0 + u * 1.2, z: z0 + u * 0.8, y: lerp(13 + i * 1.2, 7, u), open: clamp01(u / 0.12)};
};

// ------------------------------------------------------------------ the grow shot: an airliner lands
const RW: P = [Math.cos(RUNWAY_ROT), Math.sin(RUNWAY_ROT)];
export const RUNWAY_L = 14;
export const airlinerAt = (t: number) => {
  const t0 = beatAt('grow', 0.4);
  const u = (t - t0) / 3.0;
  if (u < 0 || u > 1) return null;
  // comes in from the east end, touches down a third of the way, rolls out
  const s = lerp(RUNWAY_L / 2 + 22, -RUNWAY_L / 2 + 2, smooth(u));
  const y = Math.max(0.5, 0.5 + (s - RUNWAY_L / 6) * 0.22);
  return {x: AIRPORT[0] + RW[0] * s, z: AIRPORT[1] + RW[1] * s, y, rot: Math.atan2(-RW[0], -RW[1])};
};

// ------------------------------------------------------------------ the payoff: the wax castles
export const CASTLES = 3;
const PROC_L = lengthOf(PROCESSION);
export const castleAt = (i: number, t: number) => {
  const k = beatK('payoff', t);
  if (k < -0.05 || k > 1.15) return null;
  const d = lerp(0.6, PROC_L - 0.6, smooth(clamp01((k + 0.05) / 1.05)) * 0.9) - i * 2.2;
  if (d < 0) return null;
  return along(PROCESSION, d);
};
export const PAY_S = 2.0;
/** the hero's callback: the indigo cloth hung again over the route, rising as the payoff opens */
export const bannerK = (t: number) => smooth(clamp01(beatK('payoff', t) / 0.2));
export const BANNER_AT: P = [-7.4, 2.9]; // over the route's start, by the clock tower, so it does not hide the stupa

export const ACTORS: Actor[] = [
  {id: 'indigoCloth', role: 'hero', during: [0, 2.5], size: 0.5 * CLOTH_H, at: () => [HERO_AT[0], POT_H * 0.75 + CLOTH_H * 0.5, HERO_AT[1]]},
  {id: 'clothShrinks', during: [2.5, 6.2], size: 12, at: (t) => [HERO_AT[0], (POT_H * 0.75 + CLOTH_H * 0.5) * Math.max(0.2, heroScale(t)), HERO_AT[1]]},
  {id: 'lakeRises', during: [beatAt('sink', 0), beatAt('sink', 0.95)], size: 14, at: () => [LEGEND_AT[0], 1, LEGEND_AT[1]]},
  {id: 'brahmins', during: [beatAt('khmer', 0.3), beatAt('khmer', 0.98)], size: 2.4, at: (t) => {
    const b = brahminAt(0, t);
    return b ? [b.x, 0.8, b.z] : null;
  }},
  {id: 'prasatRises', during: [beatAt('khmer', 0), beatAt('khmer', 0.3)], size: 3, at: () => [STUPA[0], 1.5, STUPA[1]]},
  {id: 'stupaCloses', during: [beatAt('lanxang', 0), beatAt('lanxang', 0.7)], size: 3, at: () => [STUPA[0], 2.4, STUPA[1]]},
  {id: 'ledAway', during: [beatAt('leave', 0.1), beatAt('leave', 0.95)], size: 2.4, at: (t) => {
    const c = leaveAt(0, t);
    return c ? [c.x, 0.8, c.z] : null;
  }},
  {id: 'taiYo', during: [beatAt('arrive', 0.02), beatAt('arrive', 0.95)], size: 2.4, at: (t) => {
    const c = arriveAt(0, t);
    return c ? [c.x, 0.8, c.z] : null;
  }},
  {id: 'rafts', during: [beatAt('cross', 0.05), beatAt('cross', 0.8)], size: 2.4, at: (t) => {
    const r = raftAt(0, t);
    return r ? [r.x, 0.4, r.z] : null;
  }},
  {id: 'thaRae', during: [beatAt('cross', 0.7), beatAt('cross', 1)], size: 6, at: () => [THA_RAE[0], 1, THA_RAE[1]]},
  {id: 'parachutes', during: [beatAt('drop', 0.3), beatAt('drop', 0.98)], size: 3, at: (t) => {
    for (let j = CHUTES - 1; j >= 0; j--) {
      const c = chuteAt(j, t);
      if (c) return [c.x, c.y, c.z];
    }
    const p = planeAt(0, t) ?? planeAt(1, t);
    return p ? [p.x, p.y, p.z] : null;
  }},
  {id: 'townGrows', during: [beatAt('grow', 0), beatAt('grow', 1)], size: 16, at: () => [-10, 1.5, -8]},
  {id: 'castles', during: [beatAt('payoff', 0.02), beatAt('payoff', 0.98)], size: 2.4, at: (t) => {
    const c = castleAt(0, t);
    return c ? [c.x, 1.2, c.z] : null;
  }},
  {id: 'indigoBanner', role: 'callback', during: [beatAt('payoff', 0.1), beatAt('payoff', 1)], size: 1.6 * PAY_S, at: () => [BANNER_AT[0], 1.0 * PAY_S, BANNER_AT[1]]},
];
