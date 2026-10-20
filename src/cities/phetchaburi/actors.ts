// Pure position math for Phetchaburi's moving things (src/engine/actors.ts): the laterite
// carts, the 2124 fleet and the armies at both walls. Landmarks.tsx draws from these;
// check_story projects them through the camera.
import type {Actor, ActorCtx} from '../../engine/actors';
import type {Formation} from '../../engine/army';
import {lerp, ramp, smooth} from '../../lib';
import {BANG_CHAN, CLIMB, eastWallX, FAIR, KAMPHAENG_LAENG, KLONG_KRACHAENG, PEAK_M, RIVER} from './places';
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

// frame 0 (the cover): Khao Wang's crowns at hero scale on the ridge, gone by the first caption
export const heroK = ({beat}: ActorCtx) => 1 - smooth(ramp(beat('khmer'), 0.24, 0.38));

// ~1191: ox carts haul laterite in from the east to the rising towers
export const HAUL: P[] = [[30, 6], [18, 2], [9, -1], [KAMPHAENG_LAENG[0] + 2.7, KAMPHAENG_LAENG[1] + 0.4]];
const HAUL_LEN = lengthOf(HAUL);
export const cartAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('khmer');
  if (p <= 0 || p >= 1) return null;
  const d = smooth(ramp(p, 0.05, 0.8)) * HAUL_LEN - i * 1.8;
  if (d < 0) return null;
  return along(HAUL, Math.min(d, HAUL_LEN));
};
// the towers rise across the beat (motion on the beat), standing from then on
export const towersUp = (Y: number, {beat}: ActorCtx) => (Y > 1191.45 ? 1 : smooth(ramp(beat('khmer'), 0.22, 0.78)));
// the builders: a file of porters carrying laterite in behind the carts, and a gang working
// round the rising towers (people in the first beat: docs/storyline.md §3.3)
export const PORTERS = 14;
export const porterAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('khmer');
  if (p <= 0.04 || p >= 1) return null;
  const d = smooth(ramp(p, 0.04, 0.85)) * HAUL_LEN - 3.2 - i * 0.75;
  if (d < 0) return null;
  const a = along(HAUL, Math.min(d, HAUL_LEN - 0.4));
  return {...a, side: (i % 2 ? 1 : -1) * 0.35};
};
export const workersOn = ({beat}: ActorCtx) => {
  const p = beat('khmer');
  return p > 0.2 && p < 1;
};

// 1859-62: Rama IV's procession climbs to the palace as it is finished (palace beat .4 -> 1).
// The leader reaches the forecourt at .97 with the file strung out down the path behind it
// (driving every marcher to the top stacked them on one spot), and they stand there until
// the year moves on
const CLIMB_LEN = lengthOf(CLIMB);
export const MARCHERS = 18;
const STEP = Math.min(0.42, (CLIMB_LEN - 0.2) / (MARCHERS - 1));
export const marcherAt = (i: number, {Y, beat}: ActorCtx) => {
  const p = beat('palace');
  if (p <= 0.4 || Y > 1863) return null;
  const d = smooth(ramp(p, 0.4, 0.97)) * CLIMB_LEN - i * STEP;
  if (d < 0) return null;
  return along(CLIMB, Math.min(d, CLIMB_LEN));
};
export const palaceK = (Y: number, {beat}: ActorCtx) => (Y >= 1862.45 ? 1 : Y >= 1859 ? beat('palace') : 0);

// the grow beat: the town spreading over the palm plain (urban.from 1930 in index.ts)
export const growing = (Y: number) => Y >= 1925 && Y <= 2012.5;

// the payoff: the cover's ขนมหม้อแกง back at the fair below the hill, grown in over the first
// third of the feast beat and standing from then on (the open loop closes)
export const fairTrayK = (Y: number, {beat}: ActorCtx) => (Y < 2021 ? 0 : Y > 2021.45 ? 1 : smooth(ramp(beat('feast'), 0.04, 0.3)));

// 2124: the fleet comes up the river from the north (the sea is down the river) and lands at
// คลองกระแชง on the west bank: march 0-.38, landing .38-.48
const UPRIVER: P[] = [[0.5, -40.5] as P].concat(RIVER.slice(RIVER.length - 3, RIVER.length - 1).reverse()).concat([[KLONG_KRACHAENG[0] + 1.3, KLONG_KRACHAENG[1]]]);
const UP_LEN = lengthOf(UPRIVER);
export const FLEET = 6;
export const boatAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('siege');
  if (p <= 0 || p >= 1) return null;
  const d = smooth(ramp(p, 0, 0.42)) * UP_LEN - i * 1.5;
  if (d < 0) return null;
  const b = along(UPRIVER, Math.min(d, UP_LEN - 0.6));
  return {...b, rot: b.rot};
};

// the west force's ranks run 5.8 units north-south: centred north of the pin, clear of Wat Mahathat
export const WEST_ARMY_Z = -7.2;
// the west หอรบ on the west wall, clear of the north-west corner tower (at -6.7; the army's
// line at -7.2 put the two towers inside each other)
export const WEST_TOWER_Z = WEST_ARMY_Z + 2.0;
// the two assaults and the defenders on the east side
//   west: lands .4, stands on the bank facing the wall, firing across the river
//   east: marches in from the coast road 0-.45, clash at the gate .45-.62, enters .7-.95
export const siege = (t: number, {Y, beat}: ActorCtx) => {
  const p = beat('siege');
  if (p <= 0 || p >= 1) return {west: null as Formation, east: null as Formation, town: null as Formation};
  const gate: P = [eastWallX(BANG_CHAN[1]), BANG_CHAN[1]];
  const inn = smooth(ramp(p, 0.04, 0.45));
  const clash = smooth(ramp(p, 0.45, 0.62));
  const enter = smooth(ramp(p, 0.7, 0.95));
  const eastAt: P = [lerp(lerp(15, gate[0] + 3.6, inn), gate[0] + 2.4, clash), lerp(lerp(-9, gate[1], inn), gate[1], clash)];
  const eastIn: P = [lerp(eastAt[0], gate[0] - 3.4, enter), eastAt[1]];
  // the defenders hold the street inside the gate: clear of the slanting east wall on their
  // north-east corner and of วัดกำแพงแลง's enclosure to the north
  const townAt: P = [gate[0] - 3.0, gate[1]];
  const defend = Y >= 1581 && p < 0.66;
  const west: Formation = p > 0.4 ? {at: [KLONG_KRACHAENG[0] - 2.1, WEST_ARMY_Z], face: [-5.3, WEST_ARMY_Z]} : null;
  const east: Formation = {at: eastIn, face: defend ? townAt : [gate[0] - 6, gate[1]]};
  const town: Formation = defend ? {at: townAt, face: eastAt} : null;
  return {west, east, town};
};
// the หอรบ burn from the assaults on
export const fireK = ({beat}: ActorCtx) => {
  const p = beat('siege');
  return p <= 0 || p >= 1 ? 0 : smooth(ramp(p, 0.5, 0.62)) * (1 - smooth(ramp(p, 0.92, 1)));
};

// seconds at a share of a beat, so the actor windows follow a retime
const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
const siegeAt = (p: number) => beatAt('siege', p);

export const ACTORS: Actor[] = [
  {id: 'heroKhaoWang', role: 'hero', during: [0, 2.2], size: 8, at: (t, ctx) => (heroK(ctx) > 0.02 ? [PEAK_M[0], 8, PEAK_M[1]] : null)},
  {id: 'towers', during: [beatAt('khmer', 0.24), beatAt('khmer', 0.76)], size: 3, minInFrame: 0.5, at: (t, ctx) => {
    const k = towersUp(ctx.Y, ctx);
    return k > 0.02 && k < 0.99 ? [KAMPHAENG_LAENG[0], 1.5, KAMPHAENG_LAENG[1]] : null;
  }},
  {id: 'porters', during: 'khmer', size: 1.6, minInFrame: 0.5, at: (t, ctx) => {
    const p = porterAt(0, ctx);
    return p ? [p.x, 0.5, p.z] : null;
  }},
  {id: 'procession', during: [beatAt('palace', 0.44), beatAt('palace', 0.97)], size: 1.6, minInFrame: 0.6, at: (t, ctx) => {
    const m = marcherAt(4, ctx);
    return m ? [m.x, (ctx.ground?.(m.x, m.z) ?? 0) + 0.6, m.z] : null;
  }},
  {id: 'palaceRising', during: 'palace', size: 3, at: (t, ctx) => {
    const k = palaceK(ctx.Y, ctx);
    return k > 0.02 && k < 0.99 ? [PEAK_M[0], 5, PEAK_M[1]] : null;
  }},
  {id: 'cityGrowing', during: 'growth', size: 10, at: (t, ctx) => (growing(ctx.Y) ? [-6, 1.5, 2] : null)},
  {id: 'trayReturns', role: 'callback', during: 'feast', size: 2.3, at: (t, ctx) => (fairTrayK(ctx.Y, ctx) > 0.02 ? [FAIR[0], 1, FAIR[1]] : null)},
  {id: 'carts', during: 'khmer', size: 1.4, minInFrame: 0.5, at: (t, ctx) => {
    const c = cartAt(0, ctx);
    return c ? [c.x, 0.5, c.z] : null;
  }},
  // the fleet sails .0-.42 of the siege, the east assault .45-1 (windows follow the beat)
  {id: 'fleet', during: [siegeAt(0.07), siegeAt(0.4)], size: 1.6, at: (t, ctx) => {
    const b = boatAt(2, ctx);
    return b ? [b.x, 0.6, b.z] : null;
  }},
  {id: 'eastArmy', during: [siegeAt(0.5), siegeAt(0.98)], size: 2.4, at: (t, ctx) => {
    const e = siege(t, ctx).east;
    return e ? [e.at[0], 0.5, e.at[1]] : null;
  }},
];
