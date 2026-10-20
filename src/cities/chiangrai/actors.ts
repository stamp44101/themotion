// Pure position math for Chiang Rai's moving things (src/engine/actors.ts): the cover's temple,
// Mangrai's elephant, the lightning, the procession, the 2386 caravan, the road crew, the
// biplane and the temple's return. Landmarks.tsx draws from these; check_story projects them.
import type {Actor, ActorCtx} from '../../engine/actors';
import {lerp, ramp, smooth} from '../../lib';
import {AIRFIELD, CHOM_THONG, GATE_WAI, GOLD_CLOCK, PHRA_KAEW, RONG_KHUN, THANALAI_Z} from './places';
import {STORY} from './timeline';

type P = [number, number];
const along = (pts: P[], d: number) => {
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

// ------------------------------------------------------------------ the cover
// วัดร่องขุ่น at hero scale over the whole tile at frame 0; it folds into the ground across
// 2-3.5 s, before the first caption (owner)
// it stands on the plain south of the walls, so the clearing under its court (index.ts) never
// covers the town, where the forest has to take the empty town back before 2386
export const HERO_AT: P = [0, 20];
export const HERO_S = 2.0;
export const HERO_ROT = -0.45;
const FOUNDING_LEN = STORY.at('founding')[1] - STORY.at('founding')[0];
export const heroK = ({beat}: ActorCtx) => 1 - smooth(ramp(beat('founding'), 2 / FOUNDING_LEN, 3.5 / FOUNDING_LEN));

// ------------------------------------------------------------------ 1262
// the runaway elephant walks in along the Kok's south bank to the foot of Doi Chom Thong,
// Mangrai's men behind it; then they raise an earth rampart round the hill
export const ELEPHANT_PATH: P[] = [[7, -5.6], [2, -5.4], [-2, -5.8], [-5.2, -6.6], [-7.0, -7.0]];
const EP_LEN = lengthOf(ELEPHANT_PATH);
export const elephantAt = ({beat}: ActorCtx) => {
  const p = beat('founding');
  if (p <= 0.36 || p >= 1) return null;
  return along(ELEPHANT_PATH, smooth(ramp(p, 0.38, 0.72)) * EP_LEN);
};
export const MEN = 12;
export const manAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('founding');
  if (p <= 0.38 || p >= 1) return null;
  const d = smooth(ramp(p, 0.4, 0.78)) * EP_LEN - 2.4 - i * 0.55;
  if (d < 0) return null;
  return along(ELEPHANT_PATH, Math.min(d, EP_LEN - 1.2));
};
export const RING_R = 3.2;
// the rampart rises over the end of the beat and stands until the 2386 wall replaces it
export const ringK = (Y: number, {beat}: ActorCtx) => (Y > 1262.45 ? (Y < 1840 ? 1 : 1 - smooth(ramp(Y, 1840, 1843))) : smooth(ramp(beat('founding'), 0.6, 0.97)));

// ------------------------------------------------------------------ 1434
// lightning strikes the chedi of วัดป่าเยี้ยะ, the plaster splits and the image shows
export const boltK = ({beat}: ActorCtx) => {
  const p = beat('emerald');
  return p > 0.26 && p < 0.42 ? 1 : 0;
};
export const splitK = (Y: number, {beat}: ActorCtx) => (Y < 1434 || Y >= 1436 ? 0 : Y > 1434.45 ? 1 : smooth(ramp(beat('emerald'), 0.34, 0.6)));
// the image stands in the split chedi until the procession takes it away
export const imageOn = (Y: number, {beat}: ActorCtx) => Y >= 1434 && (Y < 1436 ? beat('emerald') > 0.36 : beat('procession') < 0.08);

// ------------------------------------------------------------------ 1436
// the procession leaves south-west for Chiang Mai; at the fork the elephant balks, swings
// round and takes the south road for Lampang
export const PROC_PATH: P[] = [
  [PHRA_KAEW[0] - 0.4, PHRA_KAEW[1] + 1.6],
  [-5.6, 3.2],
  [-7.2, 5.8],
  [-9.0, 8.4],
  [-9.6, 9.2],
  [-8.8, 8.0],
  [-7.6, 6.6],
  [-7.8, 9.6],
  [-8.4, 13.6],
  [-9.0, 18.0],
];
const PROC_LEN = lengthOf(PROC_PATH);
export const ATTENDANTS = 12;
// the elephant leads; it pauses at the far end of the Chiang Mai road (.42-.5) before turning
const procD = (p: number) => {
  const a = lengthOf(PROC_PATH.slice(0, 5));
  if (p < 0.42) return smooth(ramp(p, 0.04, 0.42)) * a;
  if (p < 0.5) return a;
  return a + smooth(ramp(p, 0.5, 0.98)) * (PROC_LEN - a);
};
export const procElephantAt = ({Y, beat}: ActorCtx) => {
  const p = beat('procession');
  if (Y < 1436 || p <= 0.02 || p >= 1) return null;
  return along(PROC_PATH, procD(p));
};
// attendants walk ahead of and behind the elephant along the same way (ahead: umbrellas)
export const attendantAt = (i: number, ctx: ActorCtx) => {
  const p = ctx.beat('procession');
  if (ctx.Y < 1436 || p <= 0.02 || p >= 1) return null;
  const d = procD(p) + (i < 4 ? 1.6 + i * 0.5 : -1.8 - (i - 4) * 0.5);
  return along(PROC_PATH, Math.max(0, Math.min(PROC_LEN, d)));
};

// ------------------------------------------------------------------ 1843
// about 1,000 families come up from the south with elephants and carts, in through the south gate
export const CARAVAN: P[] = [[1.8, 24], [1.6, 16], [GATE_WAI[0], 8], [GATE_WAI[0], GATE_WAI[1]], [1.6, 1.8]];
const CV_LEN = lengthOf(CARAVAN);
export const CARAVAN_N = 22;
export const caravanAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('revival');
  if (p <= 0 || p >= 1) return null;
  const d = smooth(ramp(p, 0.02, 0.8)) * (CV_LEN + 11) - i * 0.62;
  if (d < 0 || d > CV_LEN) return null;
  return {...along(CARAVAN, d), kind: i % 6 === 0 ? 'elephant' : i % 3 === 0 ? 'cart' : 'walker'};
};

// ------------------------------------------------------------------ 1895
// ถนนธนาลัย is dug from the west wall to the east wall across the streets beat, the crew at its head
export const THANALAI_X: [number, number] = [-8.8, 13.3];
export const roadK = (Y: number, {beat}: ActorCtx) => (Y < 1895 ? 0 : Y > 1897 ? 1 : smooth(ramp(beat('streets'), 0.04, 0.9)));
export const roadHead = (Y: number, ctx: ActorCtx) => lerp(THANALAI_X[0], THANALAI_X[1], roadK(Y, ctx));
export const CREW = 8;

// ------------------------------------------------------------------ 1923
// a biplane comes in from the north over the town's roofs and lands southward on the new
// strip, so the shot shows that the field lies outside the town
export const RUNWAY = {x: AIRFIELD[0], z0: AIRFIELD[1] - 5, z1: AIRFIELD[1] + 5, w: 1.1};
export const planeAt = ({Y, beat}: ActorCtx) => {
  const p = beat('airfield');
  if (Y < 1923 || p <= 0 || p >= 1) return null;
  const a = smooth(ramp(p, 0, 0.62));
  const r = smooth(ramp(p, 0.62, 0.95));
  const z = p < 0.62 ? lerp(-8, RUNWAY.z0 + 1, a) : lerp(RUNWAY.z0 + 1, RUNWAY.z1 - 2, r);
  const y = p < 0.62 ? 0.5 + 6 * (1 - a) ** 1.6 : 0.5;
  return {x: RUNWAY.x, y, z, rot: 0, pitch: p < 0.62 ? 0.12 * (1 - a) : 0};
};

// ------------------------------------------------------------------ the payoff
// the temple rises at the tile's south-west edge across the temple beat, and stands on
export const CALLBACK_S = 0.62;
export const CALLBACK_ROT = -1.05;
export const templeK = (Y: number, {beat}: ActorCtx) => (Y < 1997 ? 0 : Y > 1998.4 ? 1 : smooth(ramp(beat('temple'), 0.04, 0.62)));
// 2023: the gold clock tower's light show and the crowd round it
export const lightShow = (Y: number, {beat}: ActorCtx) => (Y >= 2023 && Y < 2023.45 ? beat('design') : 0);
export const growing = (Y: number) => Y >= 1925 && Y <= 1995.5;

// seconds at a share of a beat, so the actor windows follow a retime
const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
const gy = (ctx: ActorCtx, x: number, z: number) => ctx.ground?.(x, z) ?? 0;
// the town's centre, for the grow shot (inside the wall ring)
const CENTRE: P = [2, 1];

export const ACTORS: Actor[] = [
  {id: 'heroTemple', role: 'hero', during: [0, 2.2], size: 12, at: (t, ctx) => (heroK(ctx) > 0.02 ? [HERO_AT[0] - 2.5, 4, HERO_AT[1] + 5] : null)},
  {id: 'elephant', during: [beatAt('founding', 0.42), beatAt('founding', 0.95)], size: 1.8, at: (t, ctx) => {
    const e = elephantAt(ctx);
    return e ? [e.x, gy(ctx, e.x, e.z) + 1.4, e.z] : null;
  }},
  {id: 'rampart', during: [beatAt('founding', 0.62), beatAt('founding', 0.95)], size: 3, minInFrame: 0.6, at: (t, ctx) => {
    const k = ringK(ctx.Y, ctx);
    return k > 0.02 && k < 0.99 ? [CHOM_THONG[0], gy(ctx, CHOM_THONG[0], CHOM_THONG[1] + RING_R) + 0.3, CHOM_THONG[1] + RING_R] : null;
  }},
  {id: 'lightning', during: [beatAt('emerald', 0.27), beatAt('emerald', 0.41)], size: 2, at: (t, ctx) => (boltK(ctx) ? [PHRA_KAEW[0], 4, PHRA_KAEW[1]] : null)},
  {id: 'chediSplits', during: [beatAt('emerald', 0.36), beatAt('emerald', 0.98)], size: 1.4, at: (t, ctx) => (splitK(ctx.Y, ctx) > 0.02 ? [PHRA_KAEW[0], 1.2, PHRA_KAEW[1]] : null)},
  {id: 'procession', during: [beatAt('procession', 0.05), beatAt('procession', 0.97)], size: 1.8, at: (t, ctx) => {
    const e = procElephantAt(ctx);
    return e ? [e.x, 1.4, e.z] : null;
  }},
  {id: 'caravan', during: [beatAt('revival', 0.06), beatAt('revival', 0.9)], size: 1.6, minInFrame: 0.6, at: (t, ctx) => {
    for (let i = 0; i < CARAVAN_N; i += 6) {
      const c = caravanAt(i, ctx);
      if (c) return [c.x, 1.0, c.z];
    }
    return null;
  }},
  {id: 'roadCrew', during: [beatAt('streets', 0.06), beatAt('streets', 0.9)], size: 1.4, at: (t, ctx) => {
    const k = roadK(ctx.Y, ctx);
    return k > 0.01 && k < 0.99 ? [roadHead(ctx.Y, ctx), 0.6, THANALAI_Z] : null;
  }},
  {id: 'biplane', during: [beatAt('airfield', 0.05), beatAt('airfield', 0.95)], size: 2.6, at: (t, ctx) => {
    const p = planeAt(ctx);
    return p ? [p.x, p.y, p.z] : null;
  }},
  {id: 'cityGrowing', during: 'growth', size: 12, at: (t, ctx) => (growing(ctx.Y) ? [CENTRE[0], 1.5, CENTRE[1]] : null)},
  {id: 'templeReturns', role: 'callback', during: 'temple', size: 4, at: (t, ctx) => (templeK(ctx.Y, ctx) > 0.02 ? [RONG_KHUN[0], 1.5, RONG_KHUN[1]] : null)},
  {id: 'lightShow', during: 'design', size: 1.6, at: (t, ctx) => (lightShow(ctx.Y, ctx) > 0 ? [GOLD_CLOCK[0], 2, GOLD_CLOCK[1]] : null)},
];
