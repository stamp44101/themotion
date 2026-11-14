// Pure position math for Kalasin's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {DAM, DIG, FAIR, FIRST_PILLAR, LOOM_AT, LOOM_S, PILLAR, SHAWL_AT, WAT_KLANG, WAT_NUEA, WAT_TAI} from './places';
export {SHAWL_AT};
import {STORY} from './timeline';

type P = [number, number];
export const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const beatK = (id: string, t: number) => {
  const [a, b] = STORY.at(id);
  return (t - a) / (b - a);
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
export const lengthOf = (pts: P[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
/** distance along pts of the point on it nearest p */
export const atAlong = (pts: P[], p: P) => {
  let best = 0;
  let bd = Infinity;
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1];
    const [bx, bz] = pts[i];
    const len = Math.hypot(bx - ax, bz - az);
    const u = clamp01(((p[0] - ax) * (bx - ax) + (p[1] - az) * (bz - az)) / (len * len));
    const d = Math.hypot(ax + (bx - ax) * u - p[0], az + (bz - az) * u - p[1]);
    if (d < bd) {
      bd = d;
      best = acc + u * len;
    }
    acc += len;
  }
  return best;
};

// ------------------------------------------------------------------ the cover: the Phrae Wa loom (style frame A1)
export const ROWS = 20;
export const WEAVE_END = 2.0;
/** row k is woven at this time; half are done before frame 0 */
export const rowAt = (k: number) => (k < ROWS / 2 ? -1 : ((k - ROWS / 2 + 1) / (ROWS / 2)) * WEAVE_END);
/** the loom stands through the cover and folds away as the camera leaves for the settlers (gone by 4.4 s) */
export const loomK = (t: number) => 1 - smooth((t - 3.5) / 0.9);
/** the loom's centre (its long axis runs along z; the frame spans -0.62..0.38 x LOOM_S about LOOM_AT) */
export const LOOM_C: P = [LOOM_AT[0], LOOM_AT[1] - 0.12 * LOOM_S];

// ------------------------------------------------------------------ settle: carts and walkers come down the khlong's bank
export const SETTLE_PATH: P[] = [[6.0, -31.0], [4.4, -26.0], [4.0, -20.0], [2.6, -14.0], [3.0, -8.4], [1.8, -4.4], [1.2, -1.6]];
export const CARTS = 3;
export const WALKERS = 10;
const SETTLE_L = lengthOf(SETTLE_PATH);
/** each cart's distance along the path: they come in fast while the camera is close, and stop in the clearing */
export const cartAt = (i: number, t: number) => {
  const k = beatK('settle', t);
  if (k < -0.15 || t > STORY.at('found')[0] + 1.0) return null;
  const d = lerp(SETTLE_L * 0.42, SETTLE_L - 0.4, smooth((k + 0.1) / 0.85)) - i * 2.6;
  return along(SETTLE_PATH, d);
};
export const walkerAt = (i: number, t: number) => {
  const p = cartAt(Math.floor(i / 4), t);
  if (!p) return null;
  const s = i % 2 ? 1 : -1;
  return {x: p.x + s * (0.55 + (i % 3) * 0.12), z: p.z - 0.6 - (i % 4) * 0.45, rot: p.rot};
};
/** the first stilt houses go up as the carts stop */
export const FOUND_HOUSES: P[] = [[2.8, -4.6], [3.8, -2.6], [3.4, 2.2], [2.4, 5.0], [3.6, 6.2], [4.2, -0.4], [4.4, -3.6]];
export const foundHouseK = (j: number, t: number, Y: number) => (Y > 1795 ? 1 : smooth((beatK('settle', t) - 0.45 - j * 0.06) / 0.18));

// ------------------------------------------------------------------ found: the pillar carried to Kut Nam Kin and raised
const FOUND_PATH: P[] = [[1.6, 0.2], [0.8, 1.6], [0.2, 3.4], [-0.4, 5.0], [FIRST_PILLAR[0] + 0.3, FIRST_PILLAR[1] - 0.6]];
const FOUND_L = lengthOf(FOUND_PATH);
export const BEARERS = 8;
/** the pillar log's bearers: along the path until ~55% of the beat, then they stand round the hole */
export const logAt = (t: number) => {
  const k = beatK('found', t);
  if (k < -0.05 || k > 1.1) return null;
  return along(FOUND_PATH, smooth((k + 0.05) / 0.55) * FOUND_L);
};
/** the pillar rises from lying to standing (0 lying on the bearers' shoulders, 1 standing) */
export const pillarUp = (t: number) => smooth((beatK('found', t) - 0.58) / 0.22);
/** the first pillar stands from the found beat until the bank beat carries it off */
export const firstPillarK = (t: number, Y: number) => (Y < 1792 || Y > 1828 || (t > 20 && beatK('bank', t) > 0.38) ? 0 : 1);
/** the procession that walks behind the log: a line of townspeople */
export const MARCHERS = 12;
export const marcherAt = (i: number, t: number) => {
  const k = beatK('found', t);
  if (k < -0.05 || k > 1.05) return null;
  const d = smooth((k + 0.05) / 0.55) * FOUND_L - 0.9 - i * 0.42;
  if (d < -0.5) return null;
  const p = along(FOUND_PATH, Math.max(0, d));
  // the line stops as a ring round the pillar
  const ring = smooth((k - 0.55) / 0.2);
  const a = (i / MARCHERS) * Math.PI * 2;
  // a tight ring on the strip of land between the khlong and the oxbow (people stay on land)
  const rx = FIRST_PILLAR[0] + 0.2 + Math.cos(a) * 0.6;
  const rz = FIRST_PILLAR[1] + Math.sin(a) * 0.35;
  return {x: lerp(p.x + (i % 2 ? 0.25 : -0.25), rx, ring), z: lerp(p.z, rz, ring), rot: p.rot};
};

// ------------------------------------------------------------------ temples: three sim rise in a row along the khlong
export const TEMPLES: P[] = [WAT_NUEA, WAT_KLANG, WAT_TAI];
export const templeK = (j: number, t: number, Y: number) => (Y > 1810 ? 1 : smooth((beatK('temples', t) - 0.05 - j * 0.22) / 0.25));
/** builders round each sim while it rises */
export const builderAt = (j: number, i: number, t: number): P | null => {
  const k = templeK(j, t, 0);
  if (k <= 0.02 || k >= 0.98) return null;
  const [x, z] = TEMPLES[j];
  const a = (i / 3) * Math.PI * 2 + t * 0.4;
  return [x + Math.cos(a) * 1.0, z + Math.sin(a) * 0.9];
};

// ------------------------------------------------------------------ the bank: the neck slumps, the pillar is carried home
/** 0 before, 1 once the bank has slid into the water (the neck of water is closed by it, the oxbow cut off) */
export const slumpK = (t: number, Y: number) => (Y > 1828 ? 1 : smooth((beatK('bank', t) - 0.12) / 0.35));
/** the pillar's carry from Kut Nam Kin to today's shrine */
const CARRY_PATH: P[] = [[FIRST_PILLAR[0] + 0.6, FIRST_PILLAR[1] - 0.8], [-0.6, 4.4], [-0.6, 2.0], [-0.3, 1.0], [PILLAR[0] + 0.3, PILLAR[1] + 0.5]];
const CARRY_L = lengthOf(CARRY_PATH);
export const carryAt = (t: number) => {
  const k = beatK('bank', t);
  if (k < 0.4 || k > 0.82) return null;
  return along(CARRY_PATH, smooth((k - 0.4) / 0.4) * CARRY_L);
};
/** today's shrine stands from the end of the carry */
export const shrineK = (t: number, Y: number) => (Y > 1828 ? 1 : smooth((beatK('bank', t) - 0.78) / 0.1));

// ------------------------------------------------------------------ the dam: the crest rises, the reservoir fills
export const crestK = (t: number, Y: number) => (Y > 1969 ? 1 : smooth((beatK('dam', t) - 0.05) / 0.45));
export const fillK = (t: number, Y: number) => (Y > 1969 ? 1 : smooth((beatK('dam', t) - 0.45) / 0.4));
export const DAM_TRUCKS = 4;
export const damTruckAt = (i: number, t: number) => {
  const k = beatK('dam', t);
  if (k < -0.05 || k > 0.6) return null;
  const u = ((k * 3 + i / DAM_TRUCKS) % 1 + 1) % 1;
  const back = Math.floor(k * 3 + i / DAM_TRUCKS) % 2 === 1;
  const s = back ? 1 - u : u;
  return {x: lerp(-35.5, -18.5, s), z: lerp(-33.6, -34.5, s), rot: back ? -Math.PI / 2 : Math.PI / 2};
};

// ------------------------------------------------------------------ the dinosaur: a monk finds a bone; the dig bares a skeleton
/** the dig front along the skeleton (0 nothing showing, 1 bare); the bone the monk finds shows first */
export const digK = (t: number, Y: number) => (Y > 1995 ? 1 : smooth((beatK('dino', t) - 0.35) / 0.5));
export const boneK = (t: number, Y: number) => (Y > 1995 ? 1 : smooth((beatK('dino', t) - 0.1) / 0.15));
export const DIGGERS = 6;
export const diggerAt = (i: number): P => [DIG[0] - 1.6 + (i % 3) * 1.6, DIG[1] + (i < 3 ? -1.2 : 1.2)];
export const MONK_AT: P = [DIG[0] + 0.9, DIG[1] + 0.8];

// ------------------------------------------------------------------ the fair: pong lang bands, Phu Thai dancers, the shawl
export const fairK = (t: number, Y: number) => (Y < 2015 ? 0 : smooth((beatK('fair', t) + 0.15) / 0.25));
export const hallK = (t: number, Y: number) => (Y > 2016 ? 1 : smooth((beatK('grow', t) - 0.4) / 0.35));
export const DANCERS = 14;
export const dancerAt = (i: number, t: number): P => {
  const a = (i / DANCERS) * Math.PI * 2 + t * 0.35;
  return [FAIR[0] + Math.cos(a) * 1.9, FAIR[1] + Math.sin(a) * 1.3];
};
/** the pong lang frames and the shawl's frame on the fair ground */
export const PONGLANG_AT: P[] = [[FAIR[0] - 2.8, FAIR[1] - 2.2], [FAIR[0] + 2.4, FAIR[1] - 2.4]];

export const ACTORS: Actor[] = [
  {id: 'loom', role: 'hero', during: [0, 3.0], size: LOOM_S * 0.35, at: () => [LOOM_C[0], LOOM_S * 0.2, LOOM_C[1]]},
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `cart${i}`,
    during: [4.4, 8.2],
    size: 0.9,
    minInFrame: 0.6,
    at: (t) => {
      const p = cartAt(i, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  })),
  {
    id: 'pillarlog',
    during: [9.0, 14.6],
    size: 1.2,
    minInFrame: 0.7,
    at: (t) => {
      const p = logAt(t);
      return p ? [p.x, 0.8, p.z] : null;
    },
  },
  ...TEMPLES.map((p, j): Actor => ({id: `sim${j}`, during: [15.6 + j * 1.3, 19.6 + j * 0.5], size: 1.0, at: (t, c) => (templeK(j, t, c.Y) > 0.05 ? [p[0], 0.6, p[1]] : null)})),
  {id: 'slump', during: [21.6, 23.8], size: 1.0, at: () => [FIRST_PILLAR[0] - 1.2, 0.3, FIRST_PILLAR[1] + 0.6]},
  {
    id: 'carry',
    during: [23.4, 25.4],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = carryAt(t);
      return p ? [p.x, 0.7, p.z] : null;
    },
  },
  {id: 'crest', during: [27.2, 32.0], size: 4.0, at: () => [DAM[0], 0.6, DAM[1]]},
  {id: 'dig', during: [33.6, 38.0], size: 1.6, at: () => [DIG[0], 0.8, DIG[1]]},
  // the grow shot: the town builds out east over the paddies (the sprawl, registered as what is being built)
  {id: 'sprawl', during: [39.2, 45.6], size: 14, at: () => [14, 0.5, -2]},
  {id: 'shawl-back', role: 'callback', during: [46.6, 54.0], size: 1.6, at: () => [SHAWL_AT[0], 1.2, SHAWL_AT[1]]},
  {id: 'dancers', during: [46.6, 54.0], size: 2.0, at: () => [FAIR[0], 0.5, FAIR[1]]},
];
