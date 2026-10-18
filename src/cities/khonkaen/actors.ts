// Pure position math for Khon Kaen's moving things (src/engine/actors.ts).
import type {Actor, ActorCtx} from '../../engine/actors';
import {lerp, ramp, smooth} from '../../lib';
import {DAM, DIG, LAKE, mittraphapX, PHU_WIANG, RAIL_X, STATION} from './places';

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

// frame 0: drawn just west of its real spot at hero scale so its base stays off the lake
export const HERO_AT: P = [-8, 6.5];
// frame 0: พระมหาธาตุแก่นนคร at hero scale on the forest tile, gone by the first caption
export const heroStupa = (t: number, {beat}: ActorCtx) => ({k: 1 - smooth(ramp(beat('dinos'), 0.26, 0.4))});

// ~130 Ma: sauropods, mother and calf, walking the plain below ภูเวียง
export const sauropodAt = (i: number, t: number) => {
  const a = t * 0.18 + i * 0.5;
  return {x: PHU_WIANG[0] + 12 + Math.cos(a) * 4, z: PHU_WIANG[1] + 8 + Math.sin(a) * 3, rot: -a};
};

// 1797: the settlers' carts come up from the Ban Phai country (SSW, bearing 207) to Bueng
// Bon's west shore, where the old town stands
export const CARAVAN: P[] = [[-19, 47], [-14, 32], [-9, 17], [-7.5, 2], [-6.5, -3]];
const CARAVAN_LEN = lengthOf(CARAVAN);
export const caravanAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('founding');
  if (p <= 0 || p >= 1) return null;
  const d = smooth(ramp(p, 0, 0.7)) * CARAVAN_LEN - i * 1.6;
  if (d < 0) return null;
  return along(CARAVAN, Math.min(d, CARAVAN_LEN));
};

// 1956-57: an army-green convoy up the new Mittraphap road
export const truckAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('mittraphap');
  if (p <= 0 || p >= 1) return null;
  const z = lerp(32, -22, p) + i * 3;
  return {x: mittraphapX(z) + 0.3, z, rot: Math.PI - 0.155};
};

// 2019: an SRT train comes up the new viaduct from the south and pulls in to the elevated station
export const VIADUCT = {x: RAIL_X, y: 1.7, z0: 48, z1: -48};
export const dtrainAt = ({beat}: ActorCtx) => {
  const p = beat('doubletrack');
  if (p <= 0 || p >= 1) return null;
  return {x: VIADUCT.x, z: lerp(36, STATION[1] + 3, smooth(ramp(p, 0, 0.72)))};
};

// 1964-66: the reservoir behind Ubolratana fills
export const reservoirK = (Y: number) => smooth(ramp(Y, 1964.9, 1966.1));

// 1996: the nine tiers go up one after another over the stupa beat
export const tiersUp = ({beat}: ActorCtx) => beat('stupa') * 1.25;

export const ACTORS: Actor[] = [
  {id: 'heroStupa', during: [0, 2.4], size: 6, at: (t, ctx) => (heroStupa(t, ctx).k > 0.02 ? [HERO_AT[0], 6, HERO_AT[1]] : null)},
  {id: 'sauropods', during: [3.4, 8], size: 4, at: (t) => {
    const s = sauropodAt(0, t);
    return [s.x, 3, s.z];
  }},
  {id: 'bone', during: 'discovery', size: 2.4, at: () => [DIG[0], 1, DIG[1]]},
  {id: 'dtrain', during: 'doubletrack', size: 2.4, at: (t, ctx) => {
    const c = dtrainAt(ctx);
    return c ? [c.x, VIADUCT.y + 0.6, c.z] : null;
  }},
  {id: 'caravan', during: 'founding', size: 1.6, at: (t, ctx) => {
    const c = caravanAt(0, ctx);
    return c ? [c.x, 0.5, c.z] : null;
  }},
  {id: 'convoy', during: 'mittraphap', size: 1.6, minInFrame: 0.5, at: (t, ctx) => {
    const c = truckAt(2, ctx);
    return c ? [c.x, 0.5, c.z] : null;
  }},
];
export {DAM, LAKE};
