// Pure position math for Ratchaburi's moving things (src/engine/actors.ts); Landmarks.tsx draws
// from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {H_FOUNT, H_HERO, STORY} from './timeline';
import {FOUNTAIN, HERO, KILNS, KOIKI, LANDING, RIVER, WALL, YUAN_ROAD} from './places';

type P = [number, number];
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
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

// ------------------------------------------------------------------ the cover's jar
export type JarState = {thrown: number; dragon: number; glaze: number; fire: number; h: number};
/** the jar thrown at legend scale from frame 0 (style frame A1), then gone into the earth by 6.8 s */
export const jarAt = (t: number): JarState => ({
  thrown: smooth(clamp01((t + 0.3) / 1.5)),
  dragon: smooth(clamp01((t - 0.7) / 1.5)),
  glaze: smooth(clamp01((t - 1.5) / 1.2)),
  fire: smooth(clamp01((t - 1.5) / 1.2)) * (1 - smooth(clamp01((t - 3.2) / 1))),
  h: H_HERO * (1 - smooth(clamp01((t - 4.6) / 2.2))),
});

// ------------------------------------------------------------------ the Thai Yuan column
export const YUAN = 26;
const YUAN_L = lengthOf(YUAN_ROAD);
/** walker i (every fourth an ox cart with a loom) on the road south, strung out 1.3 apart; the head
 *  goes from the north edge to Khu Bua over the beat and a little after */
export const yuanAt = (i: number, t: number) => {
  const k = beatK('yuan', t);
  if (k < -0.08 || k > 1.25) return null;
  const head = lerp(22, 60, smooth(clamp01((k + 0.08) / 1.16)));
  const d = head - i * 1.8;
  if (d < 0 || d > YUAN_L) return null;
  if (k > 1.08) return null;
  const p = along(YUAN_ROAD, d);
  const side = i % 2 ? 0.25 : -0.25;
  return {x: p.x + Math.cos(p.rot) * side, z: p.z - Math.sin(p.rot) * side, rot: p.rot, cart: i % 4 === 2};
};

// ------------------------------------------------------------------ the wall
/** how far the wall stands over the wall beat (the engine's wall follows the year; this drives the
 *  workers and the pillar) */
export const wallK = (t: number) => clamp01(beatK('wall', t) / 0.8);
/** the ferries taking the town over the river to the east bank during the wall beat */
export const FERRIES = 4;
export const ferryAt = (i: number, t: number) => {
  const k = beatK('wall', t);
  if (k < -0.05 || k > 1.05) return null;
  // crossing the eastward reach south to north, x between the bend and the wall's west end
  const x = -10 + i * 1.6;
  const u = ((k * 2.2 + i * 0.27) % 1 + 1) % 1;
  const zS = 5.0 + i * 0.05;
  const zN = 3.5;
  const back = Math.floor(k * 2.2 + i * 0.27) % 2 === 1;
  const z = back ? lerp(zN, zS, u) : lerp(zS, zN, u);
  return {x, z, rot: back ? 0 : Math.PI};
};
export const wallMid = (): [number, number, number] => [(WALL[0][0] + WALL[1][0]) / 2, 1.2, WALL[2][1]];

// ------------------------------------------------------------------ Koi Ki
/** the shophouse rows going up along Worradet Rd through the koiki beat */
export const koikiK = (t: number) => clamp01(beatK('koiki', t) / 0.75);

// ------------------------------------------------------------------ the kilns
/** the kilns going up and the jars set out to dry, through the kiln beat */
export const kilnK = (t: number) => clamp01(beatK('kiln', t) / 0.6);
export const jarsK = (t: number) => clamp01((beatK('kiln', t) - 0.35) / 0.6);

// ------------------------------------------------------------------ the jar boats
// from the landing below Koi Ki down the eastward reach and off the tile
const DOWN: P[] = [LANDING, ...RIVER.slice(RIVER.findIndex(([x, z]) => x === 0.7 && z === 3.9))];
const DOWN_L = lengthOf(DOWN);
export const JARBOATS = 5;
export const jarBoatAt = (i: number, t: number) => {
  const k = beatK('jars', t);
  if (k < -0.05 || k > 1.1) return null;
  const d = k * DOWN_L * 0.55 - i * 3.2 + 2;
  if (d < 0 || d > DOWN_L) return null;
  return along(DOWN, d);
};

// ------------------------------------------------------------------ the payoff
/** the fountain lit and spraying through the payoff */
export const fountainK = (t: number) => smooth(clamp01(beatK('payoff', t) / 0.25));
export const WALKERS = 30;
/** the walking-street crowd strolling along Koi Ki's row */
export const strollerAt = (i: number, t: number) => {
  const k = beatK('payoff', t);
  if (k < -0.05) return null;
  const [[x0, z], [x1]] = KOIKI;
  const L = x1 - x0;
  const dir = i % 2 ? 1 : -1;
  const u = (((i * 0.37 + t * 0.06 * dir) % 1) + 1) % 1;
  return {x: x0 + u * L, z: z - 0.9 + (i % 3) * 0.35, rot: dir > 0 ? Math.PI / 2 : -Math.PI / 2};
};

export const ACTORS: Actor[] = [
  {id: 'jarThrown', role: 'hero', during: [0, 2.5], size: 0.3 * H_HERO, at: () => [HERO[0], 0.45 * H_HERO, HERO[1]]},
  {id: 'jarSinks', during: [2.5, 6.8], size: 4, at: (t) => [HERO[0], Math.max(0.5, jarAt(t).h * 0.4), HERO[1]]},
  {id: 'yuanColumn', during: [beatAt('yuan', 0.05), beatAt('yuan', 0.97)], size: 2, at: (t) => {
    const w = yuanAt(4, t);
    return w ? [w.x, 0.6, w.z] : null;
  }},
  {id: 'wallRises', during: [beatAt('wall', 0.04), beatAt('wall', 0.8)], size: 3, at: () => wallMid()},
  {id: 'ferries', during: [beatAt('wall', 0.04), beatAt('wall', 0.96)], size: 1, at: (t) => {
    const f = ferryAt(1, t);
    return f ? [f.x, 0.3, f.z] : null;
  }},
  {id: 'koikiRows', during: [beatAt('koiki', 0.04), beatAt('koiki', 0.75)], size: 2.5, at: () => [(KOIKI[0][0] + KOIKI[1][0]) / 2, 0.6, KOIKI[0][1]]},
  {id: 'kilnsSmoke', during: [beatAt('kiln', 0.04), beatAt('kiln', 0.96)], size: 2.5, at: () => [KILNS[0], 1.2, KILNS[1]]},
  {id: 'jarBoats', during: [beatAt('jars', 0.06), beatAt('jars', 0.95)], size: 2, at: (t) => {
    const b = jarBoatAt(1, t);
    return b ? [b.x, 0.3, b.z] : null;
  }},
  {id: 'cityGrowing', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 16, at: () => [-8, 1.5, 4]},
  {id: 'jarFountain', role: 'callback', during: [beatAt('payoff', 0.05), beatAt('payoff', 1)], size: 0.5 * H_FOUNT, at: () => [FOUNTAIN[0], 0.5 * H_FOUNT, FOUNTAIN[1]]},
];

