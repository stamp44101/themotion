// Pure position math for Ubon's moving things (src/engine/actors.ts); Landmarks.tsx draws
// from the same functions.
import type {Actor, ActorCtx} from '../../engine/actors';
import {lerp, ramp, smooth} from '../../lib';
import type {V3} from './Naga';
import {CANDLE_AT, DON_MOT_DAENG, FERRY_X, munZ, THUNG, WAT_LUANG} from './places';
import {STORY} from './timeline';

type P = [number, number];
const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
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
const lengthOf = (pts: P[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// ------------------------------------------------------------------ the naga
// The giant candle of the cover, at hero scale (~29 units tall), stands where the field will be.
export const CANDLE_S = 3.6;
export const NAGA_R = 1.8; // body radius at the neck
export const NAGA_N = 40;
const NAGA_GAP = 0.95;
const WATER_Y = -0.05;
// The naga winds round a candle on a conical helix that hugs the candle's taper (tight at the
// spire, wide at the foot), as the carved nagas on Ubon's candles do. Measured in arc length
// (near enough: k is linear in u), so the body slides at an even speed.
type Coil = {cx: number; cz: number; top: number; bottom: number; rTop: number; rBot: number; turns: number; phase: number};
const coilLen = (c: Coil) => Math.hypot(Math.PI * (c.rTop + c.rBot) * c.turns, c.top - c.bottom);
// `up` runs it from the foot to the spire (the payoff); otherwise spire to foot (the cover)
const coil = (c: Coil, u: number, up = false): V3 => {
  const k = Math.min(1, Math.max(0, u / coilLen(c)));
  const kk = up ? 1 - k : k;
  const a = kk * Math.PI * 2 * c.turns + c.phase;
  const r = c.rTop + (c.rBot - c.rTop) * kk;
  return [c.cx + Math.cos(a) * r, c.top - (c.top - c.bottom) * kk, c.cz + Math.sin(a) * r];
};

// the cover: spire to foot, then across the bank to the river, then upstream (west) on the Mun.
// At frame 0 (k = OPEN_K0) the head is on the north-east side, facing the camera, with the body
// wound up toward the spire; the coil ends on the south-east side, toward the river.
const OPEN_K0 = 0.35;
const OPEN_TURNS = 3.63;
const COVER: Coil = {
  cx: CANDLE_AT[0], cz: CANDLE_AT[1], top: 23, bottom: 4.5, rTop: 3.3, rBot: 6.4, turns: OPEN_TURNS,
  phase: -1.05 - OPEN_K0 * Math.PI * 2 * OPEN_TURNS,
};
const COVER_LEN = coilLen(COVER);
const OPEN_BANK = (() => {
  const [x, , z] = coil(COVER, COVER_LEN);
  return [x, z] as P;
})();
const OPEN_ENTRY = [OPEN_BANK[0], munZ(OPEN_BANK[0])] as P;
const OPEN_TO_RIVER = Math.hypot(OPEN_ENTRY[0] - OPEN_BANK[0], OPEN_ENTRY[1] - OPEN_BANK[1]);
const openingPath = (u: number): V3 => {
  if (u <= COVER_LEN) return coil(COVER, u);
  const v = u - COVER_LEN;
  if (v <= OPEN_TO_RIVER) {
    const k = v / OPEN_TO_RIVER;
    return [OPEN_BANK[0], lerp(COVER.bottom, WATER_Y + NAGA_R * 0.55, Math.sqrt(k)), lerp(OPEN_BANK[1], OPEN_ENTRY[1], k)];
  }
  const w = v - OPEN_TO_RIVER;
  const x = OPEN_ENTRY[0] - w;
  return [x, WATER_Y + NAGA_R * 0.55, munZ(x) + Math.sin(w * 0.35) * 0.6];
};
// head position along the path: it uncoils fast, crosses the bank, then swims slowly upstream
const openHead = (t: number) =>
  COVER_LEN * OPEN_K0 + 18 * Math.min(t, 2.4) + 14 * Math.min(Math.max(0, t - 2.4), 3.4) + 5 * Math.max(0, t - 5.8);
export const OPEN_END = beatAt('naga', 1);
// it dives under at the end of the beat
const diveK = (t: number) => smooth(ramp(t, OPEN_END - 0.9, OPEN_END));
export const nagaOpening = (t: number): V3[] | null => {
  if (t > OPEN_END) return null;
  const h = openHead(t);
  const dive = diveK(t) * NAGA_R * 3;
  return Array.from({length: NAGA_N}, (_, i) => {
    const p = openingPath(Math.max(0, h - i * NAGA_GAP));
    return [p[0], p[1] - (p[1] < 1.5 ? dive : 0), p[2]] as V3;
  });
};
// the cover candle stands until the beat ends, by when the camera has left it
export const coverCandleK = (t: number) => (t < OPEN_END ? 1 : 0);

// the payoff: up out of the Mun, across the bank and up the field to coil round the great
// candle at the centre of ทุ่งศรีเมือง (~9 units on its plinth), foot to spire
export const MONUMENT: P = [THUNG[0], THUNG[1]];
const MON: Coil = {cx: MONUMENT[0], cz: MONUMENT[1], top: 7.6, bottom: 1.6, rTop: 1.6, rBot: 2.8, turns: 2.4, phase: 0.6};
const MON_LEN = coilLen(MON);
const MON_FOOT = coil(MON, 0, true);
const RET_START: P = [-7, munZ(-7)];
const RET_PTS: P[] = [RET_START, [-4, munZ(-4)], [-3, 6], [-2, 3.4], [MON_FOOT[0], MON_FOOT[2]]];
const RET_LEN = lengthOf(RET_PTS);
const returnPath = (u: number): V3 => {
  if (u < 0) {
    const x = RET_START[0] + u;
    return [x, WATER_Y - NAGA_R * 2.5, munZ(x)];
  }
  if (u <= RET_LEN) {
    const a = along(RET_PTS, u);
    const inRiver = u < 10;
    return [a.x, inRiver ? WATER_Y + NAGA_R * 0.4 : 0.5 + NAGA_R * 0.5, a.z];
  }
  return coil(MON, u - RET_LEN, true);
};
export const RET_T0 = beatAt('payoff', 0.08);
const retHead = (t: number) => {
  const d = t - RET_T0;
  if (d < 0) return -NAGA_N * NAGA_GAP;
  return -8 + 12 * Math.min(d, 2.6) + 7 * Math.max(0, d - 2.6);
};
const RET_MAX = RET_LEN + MON_LEN * 0.92;
export const nagaReturn = (t: number, Y: number): V3[] | null => {
  if (Y < 2024.9 || t < RET_T0) return null;
  const h = Math.min(RET_MAX, retHead(t));
  return Array.from({length: NAGA_N}, (_, i) => returnPath(h - i * NAGA_GAP));
};

// ------------------------------------------------------------------ the first people
// ~3,000 years ago: fishers in dugouts on the Mun, the naga swimming past them
export const fisherAt = (i: number, t: number) => {
  const x = -2 - i * 4 + Math.sin(t * 0.4 + i) * 0.8;
  return {x, z: munZ(x) + (i % 2 ? 0.6 : -0.5), rot: i % 2 ? Math.PI / 2 : -Math.PI / 2};
};

// ------------------------------------------------------------------ 2314: the migration
// carts and elephants down from the north to the island camp; rafts down the Mun from the west
export const CARAVAN: P[] = [[-35, -9], [-32.5, -2], [-30, DON_MOT_DAENG[1] - 3.2]];
const CARAVAN_LEN = lengthOf(CARAVAN);
export const caravanAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('migration');
  if (p <= 0) return null;
  const d = smooth(ramp(p, 0, 0.85)) * CARAVAN_LEN - i * 2.4;
  if (d < 0) return null;
  return along(CARAVAN, Math.min(d, CARAVAN_LEN - i * 0.8));
};
export const raftAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('migration');
  if (p <= 0) return null;
  const x = lerp(-39 - i * 2.6, DON_MOT_DAENG[0] - 1.6 - i * 1.4, smooth(ramp(p, 0.05, 0.8)));
  return {x, z: munZ(x) + (i % 2 ? 0.5 : -0.4)};
};
// the camp's huts go up on the island
export const campK = (i: number, {beat, Y}: ActorCtx) => (Y > 1795 ? 0 : smooth(ramp(beat('migration'), 0.55 + i * 0.05, 0.75 + i * 0.05)) * (1 - floodK({beat})));

// ------------------------------------------------------------------ the flood
export const floodK = ({beat}: Pick<ActorCtx, 'beat'>) => {
  const p = beat('flood');
  return smooth(ramp(p, 0.02, 0.35)) * (1 - smooth(ramp(p, 0.75, 1)));
};
// the boats leave the drowned camp for the high north bank at ดงอู่ผึ้ง
export const exodusAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('flood');
  if (p <= 0.12 || p >= 1) return null;
  const x = lerp(DON_MOT_DAENG[0] + 2 - i * 1.6, -4 - i * 1.4, smooth(ramp(p, 0.15, 0.95)));
  return {x, z: munZ(x) - 0.4 + (i % 2) * 0.7};
};

// ------------------------------------------------------------------ 2335: the town
export const TOWN_N = 26;
export const townHouse = (i: number): {x: number; z: number; rot: number; s: number} => {
  // rows of stilt houses round the field and down to the river, the lord's hall on the north side
  const ring = i < 14;
  if (ring) {
    const a = (i / 14) * Math.PI * 2;
    return {x: Math.cos(a) * 3.6, z: Math.sin(a) * 4.2 - 0.3, rot: -a, s: 1};
  }
  const k = i - 14;
  return {x: -6 + (k % 6) * 2.2, z: 5.2 + Math.floor(k / 6) * 1.6, rot: 0, s: 0.9};
};
export const houseK = (i: number, {beat, Y}: ActorCtx) => (Y >= 1793 ? 1 : smooth(ramp(beat('founding'), 0.04 + (i / TOWN_N) * 0.6, 0.12 + (i / TOWN_N) * 0.6)));
export const watLuangK = ({beat, Y}: ActorCtx) => (Y >= 1793 ? 1 : smooth(ramp(beat('founding'), 0.55, 0.85)));

// ------------------------------------------------------------------ 2436: the frontier town
export const ROAD_W: P[] = [[-46, -1.2], [-20, -1.2], [-3.2, -1.2]];
const ROAD_W_LEN = lengthOf(ROAD_W);
export const commissionerAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('frontier');
  if (p <= 0 || p >= 1.02) return null;
  const d = lerp(26, ROAD_W_LEN, smooth(ramp(p, 0, 0.8))) - i * 1.5;
  if (d < 0) return null;
  return along(ROAD_W, Math.min(d, ROAD_W_LEN - i * 0.4));
};
export const officeK = ({beat, Y}: ActorCtx) => (Y >= 1894 ? 1 : smooth(ramp(beat('frontier'), 0.35, 0.8)));

// ------------------------------------------------------------------ the candle processions
// a loop round the field: ~4.3 x 2.8 units of grass with a road round it
export const LOOP = {hx: 2.6, hz: 3.2};
const LOOP_LEN = 4 * (LOOP.hx + LOOP.hz);
export const loopAt = (d: number) => {
  let r = ((d % LOOP_LEN) + LOOP_LEN) % LOOP_LEN;
  const {hx, hz} = LOOP;
  const legs: [P, P][] = [[[-hx, hz], [hx, hz]], [[hx, hz], [hx, -hz]], [[hx, -hz], [-hx, -hz]], [[-hx, -hz], [-hx, hz]]];
  for (const [a, b] of legs) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (r <= len) return {x: THUNG[0] + lerp(a[0], b[0], r / len), z: THUNG[1] + lerp(a[1], b[1], r / len), rot: Math.atan2(b[0] - a[0], b[1] - a[1])};
    r -= len;
  }
  return {x: THUNG[0] - hx, z: THUNG[1] + hz, rot: 0};
};
export const CART_N = 6;
export const cartAt = (i: number, t: number, {beat}: ActorCtx) => {
  const p = beat('firstcandle');
  if (p <= 0 || p >= 1) return null;
  return loopAt((t - beatAt('firstcandle', 0)) * 1.1 + i * (LOOP_LEN / CART_N));
};
export const FLOAT_N = 8;
export const BIG_LOOP = 1.7; // today's floats ride a wider loop on the roads round the field
export const floatAt = (i: number, t: number, {Y}: ActorCtx) => {
  if (Y < 2024.9) return null;
  const q = loopAt((t - beatAt('payoff', 0)) * 1.4 + i * (LOOP_LEN / FLOAT_N));
  return {x: THUNG[0] + (q.x - THUNG[0]) * BIG_LOOP, z: THUNG[1] + (q.z - THUNG[1]) * BIG_LOOP, rot: q.rot};
};

// ------------------------------------------------------------------ the ferries, the jets
export const ferryAt = (i: number, t: number, {Y}: ActorCtx) => {
  if (Y < 1929.5 || Y > 1954.2) return null;
  const n = munZ(FERRY_X) - 1.1;
  const s = munZ(FERRY_X) + 1.1;
  const u = (Math.sin(t * 0.7 + i * 2.1) + 1) / 2;
  return {x: FERRY_X + i * 1.4 - 1.4, z: lerp(n, s, u), rot: 0};
};
export const bridgeK = (Y: number) => smooth(ramp(Y, 1953.4, 1954.6));
export const JET_N = 3;
export const jetAt = (i: number, t: number, {beat}: ActorCtx) => {
  const p = beat('growth');
  const p0 = 0.16 + i * 0.07;
  if (p < p0 || p > p0 + 0.3) return null;
  const k = (p - p0) / 0.3;
  return {k, i};
};

// ------------------------------------------------------------------ the registry
const gy = (ctx: ActorCtx, x: number, z: number) => ctx.ground?.(x, z) ?? 0;
const mid = (pts: V3[] | null, i: number) => (pts ? pts[Math.min(i, pts.length - 1)] : null);
export const ACTORS: Actor[] = [
  // the cover: the naga coiled on the giant candle, centred under the title
  {id: 'naga', role: 'hero', during: [0, 2.2], size: 9, at: (t) => mid(nagaOpening(t), 0) && [CANDLE_AT[0], 9, CANDLE_AT[1]]},
  {id: 'nagaSwims', during: [2.2, beatAt('naga', 0.92)], size: 4, at: (t) => mid(nagaOpening(t), 6)},
  // the fishers the naga is passing: whichever dugout is nearest its head
  {id: 'fishers', during: [beatAt('naga', 0.45), beatAt('naga', 1)], size: 1.6, at: (t, ctx) => {
    const n = nagaOpening(t);
    if (ctx.Y >= 0 || !n) return null;
    const hx = Math.min(n[0][0], 0);
    let best = fisherAt(0, t);
    for (let i = 1; i < 4; i++) {
      const f = fisherAt(i, t);
      if (Math.abs(f.x - hx) < Math.abs(best.x - hx)) best = f;
    }
    return [best.x, 0.3, best.z];
  }},
  {id: 'caravan', during: [beatAt('migration', 0.1), beatAt('migration', 0.95)], size: 2, at: (t, ctx) => {
    const c = caravanAt(0, ctx);
    return c ? [c.x, gy(ctx, c.x, c.z) + 1.5, c.z] : null;
  }},
  {id: 'rafts', during: [beatAt('migration', 0.1), beatAt('migration', 0.8)], size: 1.6, at: (t, ctx) => {
    const r = raftAt(0, ctx);
    return r ? [r.x, 0.4, r.z] : null;
  }},
  {id: 'exodus', during: [beatAt('flood', 0.18), beatAt('flood', 0.95)], size: 1.9, at: (t, ctx) => {
    const b = exodusAt(0, ctx);
    return b ? [b.x, 0.3, b.z] : null;
  }},
  {id: 'firstTown', during: [beatAt('founding', 0.05), beatAt('founding', 0.85)], size: 2.5, at: (t, ctx) => (houseK(TOWN_N - 1, ctx) < 0.99 ? [THUNG[0], 1, THUNG[1] + 1] : [WAT_LUANG[0], 1.2, WAT_LUANG[1]])},
  {id: 'commissioner', during: [beatAt('frontier', 0.05), beatAt('frontier', 0.85)], size: 1.6, at: (t, ctx) => {
    const c = commissionerAt(0, ctx);
    return c ? [c.x, gy(ctx, c.x, c.z) + 1.2, c.z] : null;
  }},
  {id: 'candleCarts', during: [beatAt('firstcandle', 0.04), beatAt('firstcandle', 0.98)], size: 1.4, at: (t, ctx) => {
    const c = cartAt(0, t, ctx);
    return c ? [c.x, 0.8, c.z] : null;
  }},
  {id: 'ferries', during: [beatAt('railway', 0.5), beatAt('railway', 1)], size: 2, at: (t, ctx) => {
    const f = ferryAt(1, t, ctx);
    return f ? [f.x, 0.3, f.z] : null;
  }},
  {id: 'cityGrowing', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 12, at: () => [0, 1.5, 6]},
  {id: 'nagaReturns', role: 'callback', during: [RET_T0 + 1.0, beatAt('payoff', 1)], size: 3, at: (t, ctx) => mid(nagaReturn(t, ctx.Y), 0)},
  {id: 'floats', during: [beatAt('payoff', 0), beatAt('today', 1)], size: 2, at: (t, ctx) => {
    const f = floatAt(0, t, ctx);
    return f ? [f.x, 1.5, f.z] : null;
  }},
];
export {DON_MOT_DAENG};
