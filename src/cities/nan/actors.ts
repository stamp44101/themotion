// Pure position math for Nan's moving things (src/engine/actors.ts); Landmarks.tsx draws
// from the same functions.
import type {Actor, ActorCtx} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {AIRFIELD, AIRFIELD_LEN, BRIDGE_MAIN, CHAE_HAENG, OLD_RIVER, PHUMIN, RIVER, TOWN, WIANG_NUEA} from './places';
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
/** distance along `pts` of the vertex nearest to q */
const arcTo = (pts: P[], q: P) => {
  let best = 0;
  let bd = Infinity;
  let acc = 0;
  pts.forEach((p, i) => {
    if (i > 0) acc += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
    const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
    if (d < bd) {
      bd = d;
      best = acc;
    }
  });
  return best;
};
// heading along a path, smoothed over +-w units so a long boat turns through a bend
const heading = (pts: P[], d: number, w = 3) => {
  const a = along(pts, d - w);
  const b = along(pts, d + w);
  return Math.atan2(b.x - a.x, b.z - a.z);
};
const gy = (ctx: ActorCtx, x: number, z: number) => ctx.ground?.(x, z) ?? 0;

export type Boat = {x: number; z: number; rot: number; s: number; t: number; shirt: string; band: string; hero?: boolean};
export const SHIRTS: [string, string][] = [
  ['#f1c232', '#b0261c'],
  ['#d83a2e', '#1d4f91'],
  ['#2f7fd0', '#f1c232'],
  ['#2e9a5a', '#f1ece0'],
  ['#e8eef0', '#b0261c'],
  ['#8a3fb0', '#f1c232'],
];

// ------------------------------------------------------------------ the water's width
/** The river is drawn at high water for the boats: the cover, the 2343 races and the payoff
 *  (the races are run on the flood after the rains). Real width elsewhere (places RIVER_W). */
export const HIGH_W = 2.6;
/** wider still for the cover's hero boat (drawn 1.6x, a 2-unit beam) */
export const HERO_W = 3.6;
export const highWater = (t: number) => {
  const hero = 1 - clamp01((t - 6.6) / 2.0);
  const race = clamp01((beatK('race', t) + 0.15) / 0.15) * (1 - clamp01((beatK('race', t) - 1) / 0.15));
  const pay = clamp01((beatK('payoff', t) + 0.15) / 0.15);
  return {hero, race, pay};
};

// ------------------------------------------------------------------ the cover: down from Pua
// the hero boat at 1x (16 units, a 20-m dugout drawn ~55x), the settlers' boats at 0.45x
// behind it; along the river from its north edge
export const HERO_S = 1.6;
const SPEED = 4;
const D0 = 20;
export const heroBoatAt = (t: number): Boat | null => {
  const end = beatAt('hero', 1);
  const fade = 1 - clamp01((t - (end - 0.2)) / 0.8);
  if (fade < 0.03 || t < 0) return null;
  const d = D0 + Math.min(t, end) * SPEED + Math.max(0, t - end) * SPEED * 0.4;
  const p = along(OLD_RIVER, d);
  return {x: p.x, z: p.z, rot: heading(OLD_RIVER, d, 6), s: HERO_S * fade, t, shirt: SHIRTS[0][0], band: SHIRTS[0][1], hero: true};
};
export const SETTLERS = 5;
export const settlerAt = (i: number, t: number): Boat | null => {
  const end = beatAt('hero', 1);
  if (t > end + 0.8) return null;
  const d = D0 + t * SPEED - 17 - i * 4.6;
  if (d < 0.5) return null;
  const p = along(OLD_RIVER, d);
  const r = heading(OLD_RIVER, d, 2);
  const side = (i % 2 ? 1 : -1) * 0.55;
  const [sh, b] = SHIRTS[(i + 3) % SHIRTS.length];
  return {x: p.x + Math.cos(r) * side, z: p.z - Math.sin(r) * side, rot: r, s: 0.42, t: t + i * 0.31, shirt: sh, band: b};
};

// ------------------------------------------------------------------ Wiang Phu Phiang Chae Haeng
// 350 x 500 m round the rise (research §4.2): a rounded rectangle, the moat's centreline
const CH_HX = 175 / 70;
const CH_HZ = 250 / 70;
export const CH_MOAT: P[] = Array.from({length: 24}, (_, i) => {
  const a = (i / 24) * Math.PI * 2;
  const c = Math.cos(a);
  const s = Math.sin(a);
  // a superellipse: square-ish with round corners
  const e = 0.35;
  return [CHAE_HAENG[0] - 0.4 + CH_HX * Math.sign(c) * Math.abs(c) ** e, CHAE_HAENG[1] + CH_HZ * Math.sign(s) * Math.abs(s) ** e] as P;
});
const CH_RING = [...CH_MOAT, CH_MOAT[0]] as P[];
const CH_LEN = lengthOf(CH_RING);
export const DIGGERS = 16;
export const diggerAt = (i: number, t: number) => {
  const k = beatK('chaehaeng', t);
  if (k < 0 || k > 1.02) return null;
  const p = along(CH_RING, ((i / DIGGERS + k * 0.15) % 1) * CH_LEN);
  // just inside the moat, facing along it
  const dx = p.x - CHAE_HAENG[0];
  const dz = p.z - CHAE_HAENG[1];
  const r = Math.hypot(dx, dz) || 1;
  return {x: p.x - (dx / r) * 0.75, z: p.z - (dz / r) * 0.75, rot: p.rot, step: t * 1.6 + i * 0.37};
};

// ------------------------------------------------------------------ 1911: the white bull
// from the rise, north-west across the old channel, into the new town's ground; it stands
// there while the log wall closes round it
export const BULL_PATH: P[] = [
  [CHAE_HAENG[0] - 2, CHAE_HAENG[1] - 4],
  [18, 11],
  [9.5, 2.6],
  [6.0, 1.2],
  [1.2, 0.2],
];
const BULL_LEN = lengthOf(BULL_PATH);
export const BULL_S = 2.2;
export const bullAt = (t: number) => {
  const k = beatK('bull', t);
  if (k < -0.02 || k > 1.02) return null;
  const u = smooth(clamp01(k / 0.62));
  const p = along(BULL_PATH, u * BULL_LEN);
  const moving = u < 0.995;
  // wading: the old channel is ~ x 7.2 here
  const wade = Math.max(0, 1 - Math.abs(p.x - 7.2) / 1.2);
  return {x: p.x, z: p.z, rot: p.rot, s: BULL_S, walk: t * (moving ? 1.1 : 0.1), moving, wade};
};
/** 0 -> 1: the log wall goes up round the town behind the bull, from the east side */
export const palisadeK = (t: number) => clamp01((beatK('bull', t) - 0.35) / 0.55);
export const TOWN_RING = [...TOWN, TOWN[0]] as P[];
export const TOWN_LEN = lengthOf(TOWN_RING);

// ------------------------------------------------------------------ 1993: Tilokaraj's army
// columns from the west (Chiang Mai's side), up to the west wall; war elephants lead
export const ARMY_COLS = 4;
export const ARMY_ROWS = 7;
const AR_FROM: P = [-30, -4];
const AR_TO: P = [-12.2, -1.5];
export const armyAt = (col: number, row: number, t: number) => {
  const k = beatK('siege', t);
  if (k < -0.02 || k > 1.05) return null;
  const u = smooth(clamp01(k / 0.75));
  const L = Math.hypot(AR_TO[0] - AR_FROM[0], AR_TO[1] - AR_FROM[1]);
  const ux = (AR_TO[0] - AR_FROM[0]) / L;
  const uz = (AR_TO[1] - AR_FROM[1]) / L;
  // the columns fan out north and south as they close on the wall
  const side = (col - (ARMY_COLS - 1) / 2) * (1.6 + 3.2 * u);
  const back = row * 1.2 + (row === 0 ? 0 : 0.8);
  const d = u * L - back;
  const walking = u < 0.995;
  return {x: AR_FROM[0] + ux * d - uz * side, z: AR_FROM[1] + uz * d + ux * side, rot: Math.atan2(ux, uz), walk: t * (walking ? 1.4 : 0.1) + col * 0.3 + row * 0.17, walking, elephant: row === 0};
};

// ------------------------------------------------------------------ 2139: the people round Wat Phumin
export const CIRCLE_N = 14;
export const circlerAt = (i: number, t: number) => {
  const k = beatK('phumin', t);
  if (k < -0.02 || k > 1.02) return null;
  const a = (i / CIRCLE_N) * Math.PI * 2 + t * 0.32;
  const r = 2.9;
  return {x: PHUMIN[0] + Math.cos(a) * r, z: PHUMIN[1] + Math.sin(a) * r, rot: -a, step: t * 1.5 + i * 0.4};
};

// ------------------------------------------------------------------ the 2343 races, in the old channel
export const RACE_D0 = arcTo(OLD_RIVER, [7.2, -6.4]);
export const RACE_N = 2;
export const raceBoatAt = (i: number, t: number): Boat | null => {
  const k = beatK('race', t);
  if (k < -0.05 || k > 1.05) return null;
  const d = RACE_D0 + k * 13 * (1 + i * 0.05) - i * 0.6;
  const p = along(OLD_RIVER, d);
  const r = heading(OLD_RIVER, d, 3);
  const side = (i ? 1 : -1) * 0.45;
  const [sh, b] = SHIRTS[i + 1];
  return {x: p.x + Math.cos(r) * side, z: p.z - Math.sin(r) * side, rot: r, s: 0.42, t: t + i * 0.4, shirt: sh, band: b};
};

// ------------------------------------------------------------------ 2360: up to Wiang Nuea, and 2398 back
const NORTH_GATE: P = [-2.1, -7.4];
const WN_SOUTH: P = [WIANG_NUEA[0] - 2, WIANG_NUEA[1] + 4];
export const FLEE: P[] = [[-1.5, -2], NORTH_GATE, [3, -16], [9, -26], WN_SOUTH];
const FLEE_LEN = lengthOf(FLEE);
export const WALKERS = 22;
/** the file of people, carts and a few elephants carrying the town north (2360) */
export const fleerAt = (i: number, t: number) => {
  const k = beatK('flood', t);
  if (k < 0.12 || k > 1.04) return null;
  const head = (clamp01((k - 0.12) / 0.86) * 1.15) * FLEE_LEN;
  const d = head - i * 1.25;
  if (d < 0 || d > FLEE_LEN) return null;
  const p = along(FLEE, d);
  return {x: p.x, z: p.z, rot: p.rot, step: t * 1.7 + i * 0.37, cart: i % 6 === 3, elephant: i % 9 === 0};
};
const BACK = [...FLEE].reverse() as P[];
export const returnerAt = (i: number, t: number) => {
  const k = beatK('return', t);
  if (k < 0 || k > 1.04) return null;
  const head = clamp01(k / 0.9) * 1.15 * FLEE_LEN;
  const d = head - i * 1.25;
  if (d < 0 || d > FLEE_LEN) return null;
  const p = along(BACK, d);
  return {x: p.x, z: p.z, rot: p.rot, step: t * 1.7 + i * 0.37, cart: i % 6 === 3, elephant: i % 9 === 0};
};
/** the flood's spread over the old town (0..1) and its fall */
export const floodK = (t: number) => {
  const k = beatK('flood', t);
  return clamp01(k / 0.3) * (1 - clamp01((k - 0.75) / 0.25));
};

// ------------------------------------------------------------------ ~2470: the first aircraft
// down from the north onto the strip, rolls south and stops by the crowd
export const PLANE_S = 1.6;
export const planeAt = (t: number) => {
  const k = beatK('plane', t);
  if (k < -0.02 || k > 1.02) return null;
  const z0 = AIRFIELD[1] - AIRFIELD_LEN / 2;
  const zIn = -50;
  // descent to the touchdown at 42%, the roll-out ends at 75%
  const u = clamp01(k / 0.42);
  const v = clamp01((k - 0.42) / 0.33);
  const z = k < 0.42 ? lerp(zIn, z0 + 1, u) : z0 + 1 + 7.5 * (1 - (1 - v) ** 2);
  const y = k < 0.42 ? 0.9 + 7 * (1 - u) ** 1.6 : 0.9;
  const pitch = k < 0.42 ? -0.12 * (1 - u) + 0.08 * u : 0.05;
  return {x: AIRFIELD[0], z, y, rot: 0, pitch, prop: t * 40, rolling: k >= 0.42 && v < 1};
};

// ------------------------------------------------------------------ the payoff: the race under the bridge
// two heats abreast on the high water, the hero boat in the lead
const BRIDGE_MID: P = [(BRIDGE_MAIN[0][0] + BRIDGE_MAIN[1][0]) / 2, (BRIDGE_MAIN[0][1] + BRIDGE_MAIN[1][1]) / 2];
export const PAY_D = arcTo(RIVER, BRIDGE_MID);
export const PAY_N = 4;
export const payBoatAt = (i: number, t: number): Boat | null => {
  const k = beatK('payoff', t);
  if (k < -0.05) return null;
  const hero = i === 0;
  // a crowd of boats down the course: the first pair races under the bridge, the hero ahead
  const d = PAY_D - 8 + clamp01(k) * 17 * (hero ? 1.08 : 1 - i * 0.03) - Math.floor(i / 2) * 9;
  const p = along(RIVER, d);
  const r = heading(RIVER, d, 4);
  const side = (i % 2 ? 1 : -1) * 0.66;
  const [sh, b] = SHIRTS[i % SHIRTS.length];
  return {x: p.x + Math.cos(r) * side, z: p.z - Math.sin(r) * side, rot: r, s: hero ? 0.62 : 0.56, t: t + i * 0.29, shirt: sh, band: b, hero};
};

const boatY = (b: Boat) => 1.5 * b.s + 0.6;
export const ACTORS: Actor[] = [
  // the cover: the hero boat on the whole tile from frame 0
  {id: 'nagaBoat', role: 'hero', during: [0, 2.5], size: 12, at: (t) => {
    const b = heroBoatAt(t);
    return b ? [b.x, boatY(b), b.z] : null;
  }},
  {id: 'boatsDownRiver', during: [2.5, beatAt('hero', 0.97)], size: 12, at: (t) => {
    const b = heroBoatAt(t);
    return b ? [b.x, boatY(b), b.z] : null;
  }},
  {id: 'diggers', during: [beatAt('chaehaeng', 0.05), beatAt('chaehaeng', 0.95)], size: 2.4, at: (t) => {
    const d = diggerAt(5, t);
    return d ? [d.x, 0.8, d.z] : null;
  }},
  {id: 'whiteBull', during: [beatAt('bull', 0.05), beatAt('bull', 0.95)], size: 3, at: (t, ctx) => {
    const b = bullAt(t);
    return b ? [b.x, gy(ctx, b.x, b.z) + 2.4, b.z] : null;
  }},
  {id: 'army', during: [beatAt('siege', 0.05), beatAt('siege', 0.95)], size: 2.6, at: (t) => {
    const a = armyAt(1, 0, t);
    return a ? [a.x, 1.6, a.z] : null;
  }},
  {id: 'circling', during: [beatAt('phumin', 0.05), beatAt('phumin', 0.95)], size: 1.2, at: (t) => {
    const c = circlerAt(0, t);
    return c ? [c.x, 0.8, c.z] : null;
  }},
  {id: 'raceBoats', during: [beatAt('race', 0.05), beatAt('race', 0.95)], size: 3.4, at: (t) => {
    const b = raceBoatAt(0, t);
    return b ? [b.x, boatY(b), b.z] : null;
  }},
  {id: 'flee', during: [beatAt('flood', 0.2), beatAt('flood', 0.95)], size: 2.4, at: (t) => {
    const w = fleerAt(0, t);
    return w ? [w.x, 0.8, w.z] : null;
  }},
  {id: 'return', during: [beatAt('return', 0.05), beatAt('return', 0.95)], size: 2.4, at: (t) => {
    const w = returnerAt(0, t);
    return w ? [w.x, 0.8, w.z] : null;
  }},
  {id: 'plane', during: [beatAt('plane', 0.05), beatAt('plane', 0.95)], size: 1.8, at: (t) => {
    const p = planeAt(t);
    return p ? [p.x, p.y + 0.4, p.z] : null;
  }},
  {id: 'cityGrowing', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 12, at: () => [4, 1.5, 2]},
  {id: 'nagaBoatRaces', role: 'callback', during: [beatAt('payoff', 0.1), beatAt('payoff', 1)], size: 4.5, at: (t) => {
    const b = payBoatAt(0, t);
    return b ? [b.x, boatY(b), b.z] : null;
  }},
];

