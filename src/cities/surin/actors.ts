// Pure position math for Surin's moving things (src/engine/actors.ts); Landmarks.tsx draws
// from the same functions.
import type {Actor, ActorCtx} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {FROM_EAST, INNER, MONUMENT, STADIUM} from './places';
import {STORY} from './timeline';

type P = [number, number];
const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
const beatK = (id: string, t: number) => {
  const [a, b] = STORY.at(id);
  return (t - a) / (b - a);
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
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
const gy = (ctx: ActorCtx, x: number, z: number) => ctx.ground?.(x, z) ?? 0;

export type Beast = {x: number; z: number; rot: number; s: number; walk: number; stride: number; run: boolean; tusks: boolean; white?: boolean; rider?: boolean};

// ------------------------------------------------------------------ the cover: the wild herd
// In from the south-east of the clearing, out toward the camera (north-west), at hero scale:
// the tusker is ~14 units nose to tail on the 96-unit tile.
const H_FROM: P = [4, 3];
const H_TO: P = [-6, -13];
const H_HEAD = Math.atan2(H_TO[0] - H_FROM[0], H_TO[1] - H_FROM[1]);
const H_LEN = Math.hypot(H_TO[0] - H_FROM[0], H_TO[1] - H_FROM[1]);
const onLine = (from: P, ux: number, uz: number, d: number, side: number): P => [from[0] + ux * d - uz * side, from[1] + uz * d + ux * side];
const HERD = [
  {d: 2, side: 0, s: 4.6, ph: 0, tusks: true},
  {d: -6, side: -6, s: 4.0, ph: 0.3, tusks: false},
  {d: -8, side: 5.5, s: 3.9, ph: 0.6, tusks: false},
  {d: -3.5, side: -2.6, s: 2.0, ph: 0.15, tusks: false},
  {d: -15, side: 0.5, s: 3.8, ph: 0.45, tusks: true},
  {d: -15, side: -6.5, s: 1.9, ph: 0.8, tusks: false},
];
export const HERD_N = HERD.length;
export const herdAt = (i: number, t: number): Beast | null => {
  if (t > beatAt('herd', 1) + 0.4) return null;
  const h = HERD[i];
  const [x, z] = onLine(H_FROM, (H_TO[0] - H_FROM[0]) / H_LEN, (H_TO[1] - H_FROM[1]) / H_LEN, h.d + t * 0.7, h.side);
  return {x, z, rot: H_HEAD, s: h.s, walk: t * 0.55 + h.ph, stride: 1, run: false, tusks: h.tusks};
};

// ------------------------------------------------------------------ the moat diggers
// a ring of people with baskets walking the line of the inner moat as it is dug
export const DIGGERS = 18;
const RING = [...INNER, INNER[0]] as P[];
const RING_LEN = lengthOf(RING);
export const diggerAt = (i: number, t: number) => {
  const k = beatK('moat', t);
  if (k < 0 || k > 1.02) return null;
  const p = along(RING, ((i / DIGGERS + k * 0.12) % 1) * RING_LEN);
  // just inside the moat (toward the town's centre, the origin), on the rampart, facing along it
  const r = Math.hypot(p.x, p.z) || 1;
  return {x: p.x - (p.x / r) * 1.4, z: p.z - (p.z / r) * 1.4, rot: p.rot, step: Math.sin(t * 7 + i)};
};

// ------------------------------------------------------------------ the royal road (ราชมรรคา)
// south-east to north-west across the tile, through the old town: the road from Angkor's side
// of the Dangrek range toward Phimai
export const ROAD: [P, P] = [[46, 38], [-46, -36]];
const ROAD_LEN = Math.hypot(ROAD[1][0] - ROAD[0][0], ROAD[1][1] - ROAD[0][1]);
export const CARAVAN = 8;
export const caravanAt = (i: number, t: number) => {
  const k = beatK('khmer', t);
  if (k < 0 || k > 1.02) return null;
  const d = 30 + k * 34 - i * 3.2;
  const u = d / ROAD_LEN;
  return {x: lerp(ROAD[0][0], ROAD[1][0], u), z: lerp(ROAD[0][1], ROAD[1][1], u), rot: Math.atan2(ROAD[1][0] - ROAD[0][0], ROAD[1][1] - ROAD[0][1]), elephant: i % 2 === 0, walk: t * 0.6 + i * 0.3};
};

// ------------------------------------------------------------------ 2302: the white elephant
// in from the north-west (from Ayutthaya's side), ridden down by the five Kuy headmen in
// the old moat's western fields; caught at a pond
const W_FROM: P = [-46, -14];
export const W_CATCH: P = [-21, 1];
const W_HEAD = Math.atan2(W_CATCH[0] - W_FROM[0], W_CATCH[1] - W_FROM[1]);
const W_LEN = Math.hypot(W_CATCH[0] - W_FROM[0], W_CATCH[1] - W_FROM[1]);
export const HEADMEN = 5;
export const whiteAt = (t: number): Beast | null => {
  const k = beatK('white', t);
  if (k < 0 || k > 1.02) return null;
  const u = smooth(clamp01(k / 0.62));
  const [x, z] = onLine(W_FROM, Math.sin(W_HEAD), Math.cos(W_HEAD), u * W_LEN, 0);
  const run = u < 0.98;
  return {x, z, rot: W_HEAD, s: 2.6, walk: t * (run ? 1.25 : 0.2), stride: run ? 1.2 : 0.2, run, tusks: true, white: true};
};
export const headmanAt = (i: number, t: number): Beast | null => {
  const k = beatK('white', t);
  if (k < 0 || k > 1.02) return null;
  const u = smooth(clamp01(k / 0.66));
  const side = (i - 2) * 3.2;
  const back = 6 + Math.abs(i - 2) * 1.2;
  const [cx, cz] = onLine(W_FROM, Math.sin(W_HEAD), Math.cos(W_HEAD), u * W_LEN - back * (1 - 0.5 * clamp01((k - 0.6) / 0.3)), side);
  const run = k < 0.7;
  return {x: cx, z: cz, rot: W_HEAD, s: 2.0, walk: t * (run ? 1.25 : 0.25) + i * 0.23, stride: run ? 1.2 : 0.3, run, tusks: i % 2 === 0, rider: true};
};
/** 0 -> 1: the nooses fly from 45% of the beat and pull tight by 65% */
export const lassoK = (t: number) => clamp01((beatK('white', t) - 0.45) / 0.2);

// ------------------------------------------------------------------ 2306: the move from Ban Mueang Thi
// a column of people, carts and elephants in from the east edge to the old town
const MOVE: P[] = [FROM_EAST, [24, 2], [9, 3]];
const MOVE_LEN = lengthOf(MOVE);
export const MOVERS = 16;
export const moverAt = (i: number, t: number) => {
  const k = beatK('prathai', t);
  if (k < 0 || k > 1) return null;
  const d = k * (MOVE_LEN + 14) - i * 1.5;
  if (d < 0 || d > MOVE_LEN) return null;
  const p = along(MOVE, d);
  return {x: p.x, z: p.z + ((i % 3) - 1) * 0.7, rot: p.rot, kind: i % 4 === 0 ? 'elephant' : i % 4 === 2 ? 'cart' : 'person', walk: t * 0.6 + i * 0.37};
};

// ------------------------------------------------------------------ 2505: the parade into the show ground
const PARADE: P[] = [[46, 30.5], [STADIUM[0] + 5, 30.5], [STADIUM[0], STADIUM[1] + 3.2]];
const PARADE_LEN = lengthOf(PARADE);
export const PARADE_N = 10;
export const paradeAt = (i: number, t: number): Beast | null => {
  const k = beatK('show', t);
  if (k < -0.02 || k > 1.02) return null;
  const d = 12 + k * 30 - i * 2.4;
  if (d < 0) return null;
  if (d <= PARADE_LEN) {
    const p = along(PARADE, d);
    return {x: p.x, z: p.z, rot: p.rot, s: 1.1, walk: t * 0.6 + i * 0.3, stride: 1, run: false, tusks: i % 3 === 0};
  }
  // round the track
  const a = Math.PI / 2 + (d - PARADE_LEN) / 3.3;
  return {x: STADIUM[0] + Math.cos(a) * 3.3, z: STADIUM[1] + Math.sin(a) * 3.3, rot: a + Math.PI, s: 1.1, walk: t * 0.6 + i * 0.3, stride: 1, run: false, tusks: i % 3 === 0};
};

// ------------------------------------------------------------------ the payoff: the elephant buffet
// a long table south of the monument, the herd walking up to it from the south
export const TABLE: [P, P] = [[MONUMENT[0] - 2, MONUMENT[1] + 4.4], [MONUMENT[0] - 2, MONUMENT[1] + 14.4]];
export const BUFFET_N = 8;
export const buffetAt = (i: number, t: number): Beast | null => {
  const k = beatK('payoff', t);
  if (k < 0) return null;
  const zEnd = TABLE[0][1] + 0.6 + i * 1.3;
  const z0 = 44 + i * 1.6;
  const u = smooth(clamp01(k / 0.45 - i * 0.03));
  const z = lerp(z0, zEnd, u);
  const x = TABLE[0][0] - 1.9;
  const s = i === 0 ? 1.6 : i === 3 ? 0.8 : 1.15;
  const walking = u < 0.99;
  return {x, z, rot: walking ? Math.PI : Math.PI / 2, s, walk: t * 0.55 + i * 0.29, stride: walking ? 1 : 0, run: false, tusks: i === 0 || i === 5};
};

export const ACTORS: Actor[] = [
  // the cover: the herd on the whole tile, walking from frame 0
  {id: 'herd', role: 'hero', during: [0, 2.5], size: 7, at: (t, ctx) => {
    const h = herdAt(0, t);
    return h ? [h.x, gy(ctx, h.x, h.z) + 6, h.z] : null;
  }},
  // and on across the clearing under the first caption
  {id: 'herdWalks', during: [2.5, beatAt('herd', 0.97)], size: 7, at: (t, ctx) => {
    const h = herdAt(0, t);
    return h ? [h.x, gy(ctx, h.x, h.z) + 6, h.z] : null;
  }},
  {id: 'diggers', during: [beatAt('moat', 0.05), beatAt('moat', 0.95)], size: 3, at: (t) => {
    const d = diggerAt(4, t);
    return d ? [d.x, 0.8, d.z] : null;
  }},
  {id: 'caravan', during: [beatAt('khmer', 0.05), beatAt('khmer', 0.95)], size: 2.1, at: (t) => {
    const c = caravanAt(0, t);
    return c ? [c.x, 1.4, c.z] : null;
  }},
  {id: 'whiteElephant', during: [beatAt('white', 0.05), beatAt('white', 0.95)], size: 3, at: (t) => {
    const w = whiteAt(t);
    return w ? [w.x, 3, w.z] : null;
  }},
  {id: 'move', during: [beatAt('prathai', 0.08), beatAt('prathai', 0.9)], size: 2.0, at: (t) => {
    const m = moverAt(4, t);
    return m ? [m.x, 0.8, m.z] : null;
  }},
  {id: 'parade', during: [beatAt('show', 0.05), beatAt('show', 0.95)], size: 1.8, at: (t) => {
    const p = paradeAt(0, t);
    return p ? [p.x, 1.4, p.z] : null;
  }},
  {id: 'cityGrowing', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 12, at: () => [4, 1.5, 2]},
  {id: 'herdReturns', role: 'callback', during: [beatAt('payoff', 0.1), beatAt('payoff', 1)], size: 2.5, at: (t, ctx) => {
    const b = buffetAt(0, t);
    return b ? [b.x, gy(ctx, b.x, b.z) + 2, b.z] : null;
  }},
];
