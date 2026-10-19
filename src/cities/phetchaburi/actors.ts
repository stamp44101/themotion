// Pure position math for Phetchaburi's moving things (src/engine/actors.ts): the laterite
// carts, the 2124 fleet and the armies at both walls. Landmarks.tsx draws from these;
// check_story projects them through the camera.
import type {Actor, ActorCtx} from '../../engine/actors';
import type {Formation} from '../../engine/army';
import {lerp, ramp, smooth} from '../../lib';
import {BANG_CHAN, eastWallX, KAMPHAENG_LAENG, KLONG_KRACHAENG, RIVER} from './places';

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

// ~1191: ox carts haul laterite in from the east to the rising towers
export const HAUL: P[] = [[30, 6], [18, 2], [9, -1], [KAMPHAENG_LAENG[0] + 2.2, KAMPHAENG_LAENG[1] + 0.4]];
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
  const townAt: P = [gate[0] - 2.6, gate[1]];
  const defend = Y >= 1581 && p < 0.66;
  const west: Formation = p > 0.4 ? {at: [KLONG_KRACHAENG[0] - 2.1, KLONG_KRACHAENG[1]], face: [-5.3, KLONG_KRACHAENG[1]]} : null;
  const east: Formation = {at: eastIn, face: defend ? townAt : [gate[0] - 6, gate[1]]};
  const town: Formation = defend ? {at: townAt, face: eastAt} : null;
  return {west, east, town};
};
// the หอรบ burn from the assaults on
export const fireK = ({beat}: ActorCtx) => {
  const p = beat('siege');
  return p <= 0 || p >= 1 ? 0 : smooth(ramp(p, 0.5, 0.62)) * (1 - smooth(ramp(p, 0.92, 1)));
};

export const ACTORS: Actor[] = [
  {id: 'carts', during: 'khmer', size: 1.4, minInFrame: 0.5, at: (t, ctx) => {
    const c = cartAt(0, ctx);
    return c ? [c.x, 0.5, c.z] : null;
  }},
  {id: 'fleet', during: [12, 15.6], size: 1.6, at: (t, ctx) => {
    const b = boatAt(2, ctx);
    return b ? [b.x, 0.6, b.z] : null;
  }},
  {id: 'eastArmy', during: [16, 20.2], size: 2.4, at: (t, ctx) => {
    const e = siege(t, ctx).east;
    return e ? [e.at[0], 0.5, e.at[1]] : null;
  }},
];
