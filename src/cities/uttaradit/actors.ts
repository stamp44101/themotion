// Pure position math for Uttaradit's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {DAM, FIGHT_AT, HALL, HERO_AT, HERO_S, LAKE, LANDING, MONUMENT, NAN, PHICHAI, SILA_AT} from './places';
import {STORY} from './timeline';

type P = [number, number];
export const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** 0 at the beat's start, 1 at its end, unclamped */
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

// ------------------------------------------------------------------ the cover: the Nam Phi iron forged into a sword
export const AZ = (18 * Math.PI) / 180;
export const FORGE_END = 2.3;
export const SEG = 12;
/** the anvil's face height and the log under it (S units, the style frame's) */
export const ANVIL_TOP = 0.42 * HERO_S;
/** the strike time of each segment from the tip (k = 0): the tip half before frame 0, the rest by FORGE_END */
export const strikeAt = (k: number) => (k < SEG / 2 ? -1.2 + k * 0.15 : ((k - SEG / 2) / (SEG / 2 - 1)) * (FORGE_END - 0.25));
/** the hilt goes on and the blade lifts off the anvil */
export const doneK = (t: number) => smooth((t - FORGE_END - 0.2) / 0.6);
/** the anvil, its log and the coals sink into the ground once the sword has gone */
export const anvilK = (t: number) => 1 - smooth((t - 3.0) / 0.9);
/** the sword's flight from the anvil to the giant's right hand at Phichai (the raise beat) */
export const flyK = (t: number) => smooth((t - 3.0) / 1.7);
/** the giant's sword, in his hand (S units of the sword) */
export const HAND_S = 7.2;
export const GIANT = 7.6; // the giant's scale on the 1.75-unit walker figure (~13 units tall)
const SHOULDER = (side: number): [number, number, number] => [FIGHT_AT[0] + side * 0.24 * GIANT, 1.42 * GIANT, FIGHT_AT[1]];
/** the cover sword's centre and scale at t (on the anvil, rising, flying) */
export const swordAt = (t: number) => {
  const f = flyK(t);
  const lift = doneK(t) * 0.3 * HERO_S;
  const y0 = ANVIL_TOP + lift;
  const [hx, hy, hz] = SHOULDER(1);
  const s = lerp(HERO_S, HAND_S, f);
  const x = lerp(HERO_AT[0], hx, f);
  const z = lerp(HERO_AT[1], hz, f);
  // an arc: it climbs over the valley before dropping into the giant's hand
  const y = lerp(y0, hy + 2, f) + Math.sin(Math.PI * f) * 16;
  return {x, y, z, s, spin: f * Math.PI * 2};
};

// ------------------------------------------------------------------ 2316: the giant, the swords, the column
/** the giant rises out of the field as the sword comes down, and sinks back once the column has gone */
export const giantK = (t: number) => smooth((t - 4.5) / 0.5) * (1 - smooth((t - 9.0) / 0.6));
/** the right sword snaps at ~7.0 s */
export const SNAP = 7.0;
export const snapK = (t: number) => clamp01((t - SNAP) / 1.5);
/** the arms chop in turn (radians of swing) */
export const chop = (t: number, side: number) => 0.45 * Math.sin(t * 5.2 + (side > 0 ? 0 : Math.PI));
export const COLUMN = 18;
/** the Burmese column's road down the west bank from the north (west of the river's bend), ending short of the giant */
const COL_PATH: P[] = [[-35.5, 6], [-35, 18], [-34, 28], [-32, 37], [-27.6, 43.6]];
const COL_L = lengthOf(COL_PATH);
/** each soldier's spot: marching in (4.8-7.0 s), pressed at the giant, falling back north (7.4-9.3 s) */
export const soldierAt = (i: number, t: number) => {
  const row = Math.floor(i / 3);
  const lane = (i % 3) - 1;
  const inK = smooth((t - 4.8) / 2.0);
  const backK = smooth((t - 7.4) / 1.9);
  const d = COL_L * (0.6 + 0.4 * inK) - row * 2.3 - backK * COL_L * 0.75;
  if (d < -1) return null;
  const p = along(COL_PATH, Math.max(0, d));
  const side = lane * 1.5;
  return {
    x: p.x + Math.cos(p.rot) * side,
    z: p.z - Math.sin(p.rot) * side,
    rot: backK > 0.05 ? p.rot + Math.PI : p.rot,
    moving: (t > 4.8 && t < 6.9) || (t > 7.4 && t < 9.3),
    show: smooth((t - 4.6) / 0.3) * (1 - smooth((t - 8.9) / 0.5)),
  };
};
export const SOLDIER_S = 2.4;

// ------------------------------------------------------------------ the trade: boats up to the landing, teak rafts down
// upstream boats: from the Ban Dara reach east and up the west-bank reach to the landing (no rail bridge yet)
const UPRIVER: P[] = [[-14.0, 21.6], [-8.0, 21.8], [-2.4, 21.4], [1.2, 20.2], [2.1, 17.2], [2.6, 14.4], [3.3, 12.4]];
export const BOATS = 3;
export const boatAt = (i: number, t: number) => {
  const k = beatK('trade', t);
  if (k < -0.05 || k > 1.3) return null;
  const L = lengthOf(UPRIVER);
  const d = lerp(-3 * i, L - 1.4 * i, smooth((k + 0.05) / 0.85));
  if (d < 0) return null;
  return along(UPRIVER, d);
};
// teak rafts: down the loop from the north-east to the landing, one after another
const DOWNRIVER: P[] = [[16.6, -4.6], [17.2, -0.6], [19.6, 2.6], [22.6, 5.6], [22.9, 9.4], [20.0, 12.0], [14.6, 10.5], [10.8, 6.6], [8.2, 4.2], [5.8, 4.2], [4.2, 9.2], [3.6, 11.0]];
export const RAFTS = 4;
export const raftAt = (i: number, t: number) => {
  const k = beatK('trade', t);
  if (k < -0.05 || k > 1.3) return null;
  const L = lengthOf(DOWNRIVER);
  const d = lerp(-5 * i, L - 1.6 * i, smooth((k + 0.05) / 1.0));
  if (d < 0) return null;
  return along(DOWNRIVER, d);
};
/** the market row on the river street at the landing: built house by house through the trade beat */
export const ROW = Array.from({length: 8}, (_, j) => ({x: 1.4, z: 5.4 + j * 1.0}));
export const rowK = (j: number, t: number) => smooth((beatK('trade', t) - 0.15 - j * 0.07) / 0.18);

// ------------------------------------------------------------------ 2452: the station and the shophouses
export const stationK = (t: number) => smooth((beatK('arrive', t) - 0.02) / 0.22);
/** shophouse rows round the station, west of the track (built through the arrive beat) */
export const SHOPS = Array.from({length: 14}, (_, j) => ({x: -6.2 - (j % 2) * 1.6, z: 3.6 + Math.floor(j / 2) * 1.5}));
export const shopK = (j: number, t: number) => smooth((beatK('arrive', t) - 0.3 - j * 0.03) / 0.16);

// ------------------------------------------------------------------ 2458: the hall
export const hallK = (t: number) => smooth((beatK('rename', t) - 0.05) / 0.3);
export const flagK = (t: number) => smooth((beatK('rename', t) - 0.4) / 0.25);

// ------------------------------------------------------------------ the dam and the lake
export const damK = (t: number) => smooth(beatK('dam', t) / 0.9);
export const lakeK = (t: number) => smooth((beatK('fill', t) + 0.05) / 0.8);

// ------------------------------------------------------------------ the payoff: the fair and the sword back over the town
/** the grow shot's two events: the Sila At yards (2501) go up, then orchards climb the Laplae hills */
export const silaK = (t: number) => smooth((beatK('grow', t) - 0.04) / 0.32);
export const orchardK = (t: number) => smooth((beatK('grow', t) - 0.42) / 0.4);
export const ORCHARD: [number, number] = [-31, -20];
export const fairK = (t: number) => smooth((beatK('gather', t) - 0.02) / 0.2);
/** the cover's sword, whole again, comes down out of the sky over the monument and turns */
export const backK = (t: number) => smooth((beatK('gather', t) - 0.18) / 0.3);
export const BACK_S = 10;
export const swordBackAt = (t: number) => {
  const k = backK(t);
  return {x: MONUMENT[0] + 0.5, y: lerp(40, 8.5, k), z: MONUMENT[1] + 0.6, s: BACK_S, spin: (t - 46) * 0.35};
};

export const ACTORS: Actor[] = [
  {
    id: 'sword',
    role: 'hero',
    during: [0, 3.0],
    size: HERO_S * 0.35,
    at: (t) => {
      const p = swordAt(t);
      return [p.x, p.y, p.z];
    },
  },
  {id: 'sword-flight', during: [3.2, 4.4], size: 4, minInFrame: 0.5, at: (t) => {
    const p = swordAt(t);
    return [p.x, p.y, p.z];
  }},
  {
    id: 'giant',
    during: 'fight',
    size: 5,
    at: (t) => (giantK(t) > 0.05 ? [FIGHT_AT[0], 7 * giantK(t), FIGHT_AT[1]] : null),
  },
  {
    id: 'column',
    during: [5.6, 8.6],
    size: 4,
    at: (t) => {
      const p = soldierAt(4, t);
      return p ? [p.x, 2, p.z] : null;
    },
  },
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `boat${i}`,
    during: [12.4, 17.4],
    size: 1.2,
    minInFrame: 0.6,
    at: (t) => {
      const p = boatAt(i, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  })),
  {id: 'hall', during: [24.0, 28.6], size: 2.2, at: (t) => (hallK(t) > 0.05 ? [HALL[0], 1.2, HALL[1]] : null)},
  {id: 'dam', during: [30.6, 33.4], size: 3, at: (t) => (damK(t) > 0.05 ? [DAM[0], 1.4, DAM[1]] : null)},
  {id: 'lake', during: [34.0, 37.4], size: 3, at: (t) => (lakeK(t) > 0.05 ? [LAKE[0][0], 1.4, LAKE[0][1]] : null)},
  {id: 'silaat', during: [38.8, 41.2], size: 5, at: (t) => (silaK(t) > 0.05 ? [SILA_AT[0] + 1.6, 1, SILA_AT[1]] : null)},
  {id: 'orchards', during: [41.8, 45.2], size: 6, at: (t, c) => (orchardK(t) > 0.05 ? [ORCHARD[0], (c.ground?.(ORCHARD[0], ORCHARD[1]) ?? 4) + 1, ORCHARD[1]] : null)},
  {id: 'fair', during: [46.8, 48.4], size: 3, at: (t) => (fairK(t) > 0.05 ? [MONUMENT[0], 1, MONUMENT[1] + 2] : null)},
  {
    id: 'sword-back',
    role: 'callback',
    during: [49.2, 54.0],
    size: 6,
    at: (t) => {
      const p = swordBackAt(t);
      return [p.x, p.y, p.z];
    },
  },
];

/** Phichai, for the fight's framing */
export const PHICHAI_C = PHICHAI;
export const LANDING_C = LANDING;
export const NAN_PATH = NAN;
