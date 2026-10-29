// Pure position math for Udon Thani's moving things (src/engine/actors.ts); Landmarks.tsx draws
// from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {AIRFIELD, BAN_CHIANG, CAMP, CLOCK, FIELD, MONUMENT, NORTH_TRACK, RUNWAY_ROT, STATION} from './places';
import {HERO_S, STORY} from './timeline';

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

// ------------------------------------------------------------------ the cover's jar
export const PAINT_END = 1.6;
const SHRINK0 = 4.6;
const SHRINK1 = 7.0;
/** the jar's height: legend scale (3.2 x HERO_S) through the cover, shrinking to the Ban Chiang marker */
export const JAR_SMALL = 3.4;
export const jarH = (t: number) => {
  const giant = 3.2 * HERO_S;
  return giant * (JAR_SMALL / giant) ** smooth(clamp01((t - SHRINK0) / (SHRINK1 - SHRINK0)));
};
/** how far out of the pit (0 sunk, 1 standing): already rising at frame 0, out by 0.7 s */
export const jarRise = (t: number) => {
  const r = smooth(Math.min(1, 0.45 + (t / 0.7) * 0.55));
  const settle = t > 0.7 ? Math.sin(clamp01((t - 0.7) / 0.35) * Math.PI) * 0.03 : 0;
  return r - settle;
};
export const paintK = (t: number) => smooth(clamp01((t - 0.1) / (PAINT_END - 0.1)));

// ------------------------------------------------------------------ the 1893 column
export const COLUMN = 16;
const TRACK_L = lengthOf(NORTH_TRACK);
/** walker i of the column down from Nong Khai: soldiers, then carts and two elephants; it reaches the
 *  camp at 75% of the beat and stops strung out along the last stretch */
export const columnAt = (i: number, t: number) => {
  const k = beatK('camp', t);
  if (k < -0.15 || k > 1.6) return null;
  const head = lerp(TRACK_L * 0.35, TRACK_L - 0.6, smooth(clamp01((k + 0.15) / 0.9)));
  const d = head - i * 1.15;
  if (d < 0) return null;
  const p = along(NORTH_TRACK, d);
  return {...p, moving: k < 0.75};
};
/** the camp's huts and the flag going up as the column arrives */
export const campK = (t: number, Y: number) => (Y > 1893.5 ? 1 : smooth(clamp01((beatK('camp', t) - 0.55) / 0.4)));

// ------------------------------------------------------------------ the dragon at the station
/** the dragon dance up Prachak road from the clock tower toward the station */
export const DRAGON_PATH: P[] = [[MONUMENT[0] + 3, MONUMENT[1] + 0.6], [CLOCK[0], CLOCK[1] - 0.4], [STATION[0] - 1.4, STATION[1]]];
export const DRAGON_N = 9;
export const dragonAt = (i: number, t: number) => {
  const k = beatK('market', t);
  if (k < -0.05 || k > 1.05) return null;
  const L = lengthOf(DRAGON_PATH);
  const d = lerp(1, L - 1, clamp01(k)) - i * 0.5;
  if (d < 0) return null;
  const p = along(DRAGON_PATH, d);
  return {...p, y: 0.6 + Math.sin(t * 7 - i * 0.8) * 0.25};
};

// ------------------------------------------------------------------ the planes
// the runway's axis (12/30): toward the WNW for a take-off, from AIRFIELD
const RW: P = [-Math.cos(RUNWAY_ROT), -Math.sin(RUNWAY_ROT)];
export const RUNWAY_L = 18;
/** plane i's take-off: rolls from the south-east end, lifts at mid-runway, climbs out WNW */
export const planeAt = (i: number, t: number) => {
  const [a, b] = STORY.at('airfield');
  const t0 = a + 0.2 + i * 2.2;
  const u = (t - t0) / 3.2;
  if (u < 0 || u > 1.15) return null;
  const s = -RUNWAY_L / 2 + 2 + (u * u) * (RUNWAY_L + 10);
  const lift = Math.max(0, s - 2) * 0.22;
  void b;
  return {x: AIRFIELD[0] + RW[0] * s, z: AIRFIELD[1] + RW[1] * s, y: 0.5 + lift, rot: Math.atan2(RW[0], RW[1]), lift};
};

// ------------------------------------------------------------------ the fair
export const PAY_S = 2.4;
/** the jar lantern on the field: rises out of the ground as the payoff opens */
export const lanternK = (t: number) => smooth(clamp01(beatK('payoff', t) / 0.18));

export const ACTORS: Actor[] = [
  // the cover: the giant jar on the whole tile from frame 0
  {id: 'banChiangJar', role: 'hero', during: [0, 2.5], size: 1.4 * HERO_S, at: () => [BAN_CHIANG[0], 1.4 * HERO_S, BAN_CHIANG[1]]},
  {id: 'jarShrinks', during: [2.5, 7.2], size: 5, at: (t) => [BAN_CHIANG[0], jarH(t) * 0.45, BAN_CHIANG[1]]},
  {id: 'column', during: [beatAt('camp', 0.02), beatAt('camp', 0.95)], size: 2.4, at: (t) => {
    const c = columnAt(0, t);
    return c ? [c.x, 0.8, c.z] : null;
  }},
  {id: 'townFills', during: [beatAt('town', 0), beatAt('town', 1)], size: 10, at: () => [CAMP[0] + 2, 1, CAMP[1] + 5]},
  {id: 'dragon', during: [beatAt('market', 0.05), beatAt('market', 0.95)], size: 2.2, at: (t) => {
    const d = dragonAt(0, t);
    return d ? [d.x, 0.8, d.z] : null;
  }},
  {id: 'planes', during: [beatAt('airfield', 0.05), beatAt('airfield', 0.95)], size: 2.4, at: (t) => {
    for (let i = 2; i >= 0; i--) {
      const p = planeAt(i, t);
      if (p && p.y < 12) return [p.x, p.y, p.z];
    }
    return null;
  }},
  {id: 'cityGrowing', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 16, at: () => [8, 1.5, 6]},
  {id: 'jarLantern', role: 'callback', during: [beatAt('payoff', 0.05), beatAt('payoff', 1)], size: 1.6 * PAY_S, at: () => [FIELD[0], 1.6 * PAY_S, FIELD[1]]},
];
