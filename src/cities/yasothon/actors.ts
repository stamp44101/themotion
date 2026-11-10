// Pure position math for Yasothon's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {BODY, CHAENG_SANIT, CHI, HALL, LANDING, MUSEUM, R, ROCKET_AT, TAIL, TOWER, WAT_MAHATHAT} from './places';
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

// ------------------------------------------------------------------ the rocket (the cover, the launch, the payoff)
// Local frame: the rocket stands along +y from the foot of its tail (y = 0); the body runs from NOZZLE to NOZZLE + BODY,
// the tail lashed alongside its lower part. Lying (the cover), it is turned down to point north (-z) on its trestles.
export const NOZZLE = TAIL - 2;
export const TOP = NOZZLE + BODY + 2.6 * R;
export const TRESTLE = 1.6;
export const RINGS = 14;
export const BIND_END = 2.2;
/** the time each rope ring is bound: the front half before frame 0, the rest by BIND_END */
export const bindAt = (k: number) => (k < RINGS / 2 ? -1 + k * 0.1 : 0.15 + ((k - RINGS / 2) / (RINGS / 2 - 1)) * (BIND_END - 0.35));
/** the ring's place along the body, from the nose (k = 0) down */
export const ringY = (k: number) => NOZZLE + BODY * (0.94 - ((k + 0.5) / RINGS) * 0.88);
/** the tail slides in alongside once the body is bound */
export const tailK = (t: number) => smooth((t - BIND_END) / 0.35);
/** the rocket swings up onto the tower (0 lying, 1 standing) */
export const riseK = (t: number) => (t > 40 ? 1 : smooth((t - 2.55) / 1.25));
/** the launch: the fuse at FUSE, lift-off at LIFT; the payoff's launch at LIFT2 */
export const FUSE = 4.3;
export const LIFT = 4.8;
export const LIFT2 = 51.8;
/** the payoff: the rocket comes back down out of the sky onto its tower */
export const BACK0 = 47.2;
export const BACK1 = 49.2;
/** the rocket's height above its standing place at t (climbing after a launch, coming down for the payoff) */
export const flyY = (t: number) => {
  if (t < 30) return t > LIFT ? 9 * (t - LIFT) ** 2 : 0;
  if (t < BACK0) return Infinity;
  if (t < LIFT2) return 70 * (1 - smooth((t - BACK0) / (BACK1 - BACK0)));
  return 9 * (t - LIFT2) ** 2;
};
/** whether the rocket is drawn: from frame 0 until it is far up, and again from its return */
export const rocketShown = (t: number) => flyY(t) < 140;
/** world position of the local point at height y along the rocket, at t */
export const rocketPoint = (t: number, y: number): [number, number, number] => {
  const a = -(Math.PI / 2) * (1 - riseK(t));
  const h0 = TRESTLE * (1 - riseK(t));
  const f = flyY(t);
  return [ROCKET_AT[0], h0 + R + y * Math.cos(a) + (Number.isFinite(f) ? f : 0), ROCKET_AT[1] + y * Math.sin(a)];
};
export const bodyMid = (t: number) => rocketPoint(t, NOZZLE + BODY / 2);

// ------------------------------------------------------------------ the launch crowd and the rain
export const CROWD = 26;
export const crowdK = (t: number) => smooth((t - 3.2) / 0.5) * (1 - smooth((t - 9.0) / 0.5));
export const crowdAt = (i: number): P => {
  const a = (i / CROWD) * Math.PI * 1.6 + Math.PI * 0.7;
  const r = 4.2 + (i % 3) * 1.0;
  return [TOWER[0] + Math.cos(a) * r, TOWER[1] + Math.sin(a) * r];
};
/** the rain over the paddies once the rocket is up */
export const rainK = (t: number) => smooth((t - 7.0) / 0.6) * (1 - smooth((t - 9.4) / 0.6));

// ------------------------------------------------------------------ 2357: the stupa and the governor's hall
export const stupaK = (t: number, Y: number) => (Y > 1815 ? 1 : smooth((beatK('found', t) - 0.08) / 0.45));
export const hongK = (t: number, Y: number) => (Y > 1815 ? 1 : smooth((beatK('found', t) - 0.35) / 0.35));

// ------------------------------------------------------------------ the trade: boats up the Chi, the shophouse street
// up the Chi from the tile's south edge to the landing (the drawn centreline, reversed)
const UPRIVER: P[] = [...CHI.filter(([, z]) => z > 2.6)].reverse().concat([[LANDING[0] - 1.0, LANDING[1] + 0.3]]);
export const BOATS = 4;
export const boatAt = (i: number, t: number) => {
  const k = beatK('trade', t);
  if (k < -0.05 || k > 1.2) return null;
  const L = lengthOf(UPRIVER);
  const d = lerp(L * 0.7 - 3 * i, L - 2.6 * i, smooth((k + 0.05) / 0.9));
  if (d < 0) return null;
  return along(UPRIVER, d);
};
/** two rows of shophouses on the street east of the pillar, built one after another through the trade beat */
export const SHOPS = Array.from({length: 12}, (_, j) => ({x: 0.6 + (j % 6) * 1.15, z: j < 6 ? 1.3 : 2.9}));
export const shopK = (j: number, t: number, Y: number) => (Y > 1926 ? 1 : smooth((beatK('trade', t) - 0.25 - (j % 6) * 0.08) / 0.18));

// ------------------------------------------------------------------ the road: trucks down Chaeng Sanit
const ROAD_IN = CHAENG_SANIT.slice(0, 11);
export const TRUCKS = 3;
export const truckAt = (i: number, t: number) => {
  const k = beatK('road', t);
  if (k < 0.2 || k > 1.15) return null;
  const L = lengthOf(ROAD_IN);
  const d = lerp(L * 0.15 - 4 * i, L * 0.95 - 4 * i, smooth((k - 0.2) / 0.85));
  if (d < 0) return null;
  return along(ROAD_IN, d);
};

// ------------------------------------------------------------------ 2515: the hall and its flag
export const hallK = (t: number, Y: number) => (Y > 1973 ? 1 : smooth((beatK('province', t) - 0.05) / 0.3));
export const flagK = (t: number, Y: number) => (Y > 1973 ? 1 : smooth((beatK('province', t) - 0.4) / 0.25));

// ------------------------------------------------------------------ the grow shot: a tractor in the paddies, the museum
const FIELD_RUN: P[] = [[-2, 21], [6, 23], [12, 27], [6, 31], [-2, 29]];
export const tractorAt = (t: number) => {
  const k = beatK('grow', t);
  if (k < -0.02 || k > 1.05) return null;
  return along(FIELD_RUN, lengthOf(FIELD_RUN) * clamp01(k));
};
export const museumK = (t: number, Y: number) => (Y > 2021 ? 1 : smooth((beatK('grow', t) - 0.78) / 0.18));

// ------------------------------------------------------------------ the payoff: the procession of decorated rockets
const PROCESSION: P[] = [[0.9, -2.3], [3.0, -0.5], [5.6, 1.8], [8.3, 4.1], [9.6, 5.3], [9.6, 7.0]];
export const FLOATS = 5;
export const floatAt = (i: number, t: number) => {
  const k = beatK('festival', t);
  if (k < -0.02 || k > 0.62) return null;
  const L = lengthOf(PROCESSION);
  const d = lerp(-2.4 * i + L * 0.1, L - 2.4 * i, smooth(k / 0.55));
  if (d < 0) return null;
  return along(PROCESSION, d);
};

export const ACTORS: Actor[] = [
  {id: 'bangfai', role: 'hero', during: [0, 3.0], size: BODY * 0.5, at: (t) => bodyMid(t)},
  {id: 'bangfai-launch', during: [3.2, 6.6], size: 6, minInFrame: 0.6, at: (t) => bodyMid(t)},
  {id: 'crowd', during: [3.6, 5.2], size: 5, at: (t) => (crowdK(t) > 0.05 ? [TOWER[0] - 2, 0.6, TOWER[1]] : null)},
  {id: 'stupa', during: [10.2, 15.4], size: 4, at: (t, c) => (stupaK(t, c.Y) > 0.05 ? [WAT_MAHATHAT[0], 3.6, WAT_MAHATHAT[1]] : null)},
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `boat${i}`,
    during: [16.6, 22.6],
    size: 1.8,
    minInFrame: 0.6,
    at: (t) => {
      const p = boatAt(i, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  })),
  {
    id: 'truck0',
    during: [24.6, 28.8],
    size: 1.8,
    minInFrame: 0.6,
    at: (t) => {
      const p = truckAt(0, t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  },
  {id: 'hall', during: [30.2, 34.8], size: 2.2, at: (t, c) => (hallK(t, c.Y) > 0.05 ? [HALL[0], 1.2, HALL[1]] : null)},
  {
    id: 'tractor',
    during: [36.0, 43.6],
    size: 4.4,
    at: (t) => {
      const p = tractorAt(t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  },
  {id: 'museum', during: [42.8, 44.0], size: 5, at: (t, c) => (museumK(t, c.Y) > 0.05 ? [MUSEUM[0], 1.6, MUSEUM[1]] : null)},
  {
    id: 'procession',
    during: [45.0, 50.0],
    size: 3,
    at: (t) => {
      const p = floatAt(1, t);
      return p ? [p.x, 0.8, p.z] : null;
    },
  },
  {id: 'bangfai-back', role: 'callback', during: [49.2, 53.6], size: 6, minInFrame: 0.6, at: (t) => (rocketShown(t) ? bodyMid(t) : null)},
];
