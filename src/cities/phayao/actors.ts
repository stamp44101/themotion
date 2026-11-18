// Pure position math for Phayao's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {
  BUDDHA_S, FRONT, GATE, KWAN, LEGEND_S, MONUMENT, PARADE, SOUTH_TRACK, VIHARA_C, VIHARA_L, VIHARA_W, WAT_SI_KHOM_KHAM, WAT_TILOK, WIANG,
} from './places';
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

// ------------------------------------------------------------------ the cover: the Buddha built, then back to its size
export const BRICK_END = 1.7;
export const STUCCO_END = 2.5;
export const GOLD0 = 2.3;
export const GOLD_END = 3.4;
/** the build fronts as a share of the Buddha's height (brick, stucco, gold); all done after the cover */
export const buildFronts = (t: number) => ({
  brick: 0.57 + 0.43 * smooth(t / BRICK_END),
  stucco: 0.26 + 0.74 * smooth(t / STUCCO_END),
  gold: smooth((t - GOLD0) / (GOLD_END - GOLD0)),
  scaffold: 1 - smooth((t - STUCCO_END + 0.2) / 0.6),
});
/** the Buddha's size: legend scale through the cover, back to its drawn size on its site by 4.4 s */
export const buddhaS = (t: number) => (t < 3.0 ? LEGEND_S : lerp(LEGEND_S, BUDDHA_S, smooth((t - 3.0) / 1.4)));

// ------------------------------------------------------------------ paetpeng: the first full-moon circling of the Buddha
export const CIRCLERS = 16;
/** people walk round the Buddha clockwise with candles (the lake is not there yet) */
export const circlerAt = (i: number, t: number): {x: number; z: number; rot: number} | null => {
  const k = beatK('paetpeng', t);
  if (k < 0.15 || k > 1.05) return null;
  const a = (i / CIRCLERS) * Math.PI * 2 - t * 0.45;
  const r = 1.25 + (i % 2) * 0.22;
  return {x: WAT_SI_KHOM_KHAM[0] + Math.cos(a) * r, z: WAT_SI_KHOM_KHAM[1] + Math.sin(a) * r, rot: -a};
};

// ------------------------------------------------------------------ abandon: the people leave down the track south
const TRACK_L = lengthOf(SOUTH_TRACK);
const OUT = [...SOUTH_TRACK].reverse();
export const LEAVERS = 10;
export const leaverAt = (i: number, t: number) => {
  const k = beatK('abandon', t);
  if (k < 0.0 || k > 0.92) return null;
  const d = smooth(k / 0.85) * TRACK_L * 0.32 - (i % 5) * 0.7 + (i >= 5 ? -0.35 : 0);
  if (d < 0) return null;
  const p = along(OUT, d);
  return {x: p.x + (i >= 5 ? 0.35 : -0.35), z: p.z, rot: p.rot};
};
/** the abandoned houses go and the forest comes back with the years (engine: houses.abandon, regrowCity) */

// ------------------------------------------------------------------ refound: the carts come up the track into the wiang
export const CARTS = 3;
export const SETTLERS = 9;
export const cartAt = (i: number, t: number) => {
  const k = beatK('refound', t);
  if (k < -0.1 || k > 1.05) return null;
  const d = lerp(TRACK_L * 0.62, TRACK_L - 0.4, smooth((k + 0.05) / 0.7)) - i * 2.0;
  return along(SOUTH_TRACK, d);
};
export const settlerAt = (i: number, t: number) => {
  const p = cartAt(Math.floor(i / 3), t);
  if (!p) return null;
  const s = i % 2 ? 1 : -1;
  return {x: p.x + s * 0.55, z: p.z + 0.6 + (i % 3) * 0.4, rot: p.rot};
};
/** the first houses of the new town, in the wiang's east part, raised as the carts stop */
export const FOUND_HOUSES: P[] = [[3.0, 0.9], [1.0, 1.0], [2.2, -3.9], [0.8, -3.9], [-3.0, -0.8], [-3.6, 0.4], [4.0, 0.6]];
export const foundHouseK = (j: number, t: number, Y: number) => (Y > 1846 ? 1 : Y < 1842 ? 0 : smooth((beatK('refound', t) - 0.5 - j * 0.05) / 0.16));

// ------------------------------------------------------------------ vihara: timber carried up, the vihara raised
export const vihK = (t: number, Y: number) => (Y > 1925.5 ? 1 : Y < 1843.5 ? 0 : smooth((beatK('vihara', t) - 0.12) / 0.62));
const CARRY: P[] = [[-9.8, -9.6], [-11.0, -11.0], [-11.6, -11.8], [VIHARA_C[0] + FRONT[0] * (VIHARA_L / 2 + 0.3), VIHARA_C[1] + FRONT[1] * (VIHARA_L / 2 + 0.3)]];
const CARRY_L = lengthOf(CARRY);
export const CARRIERS = 10;
/** pairs of men carry logs from the town to the wat in a loop; each fades at the ends of the loop */
export const carrierAt = (i: number, t: number) => {
  const k = beatK('vihara', t);
  if (k < -0.05 || k > 0.85) return null;
  const pair = Math.floor(i / 2);
  const u = (t * 0.22 + pair / (CARRIERS / 2)) % 1;
  const p = along(CARRY, u * CARRY_L + (i % 2) * 0.5);
  return {x: p.x + (i % 2 ? 0.12 : -0.12), z: p.z, rot: p.rot, fade: smooth(u / 0.1) * smooth((1 - u) / 0.1)};
};

// ------------------------------------------------------------------ the lake: the gate shuts, the Kwan fills
export const gateK = (t: number, Y: number) => (Y > 1940 ? 1 : Y < 1938.5 ? 0 : smooth((beatK('lake', t) - 0.04) / 0.18));
export const fillK = (t: number, Y: number) => (Y > 1940 ? 1 : Y < 1938.5 ? 0 : smooth((beatK('lake', t) - 0.18) / 0.62));
/** the drowned chedi goes down to its bell as the water rises */
export const sinkK = fillK;
export const GATE_WORKERS = 4;

// ------------------------------------------------------------------ province: a parade with flags on the shore road
const PARADE_L = lengthOf(PARADE);
export const MARCHERS = 14;
export const marcherAt = (i: number, t: number) => {
  const k = beatK('province', t);
  if (k < 0.05 || k > 1.0) return null;
  const d = smooth((k - 0.05) / 0.8) * PARADE_L - i * 0.42;
  if (d < -0.2) return null;
  const p = along(PARADE, Math.max(0, d));
  return {x: p.x + (i % 2 ? 0.14 : -0.14), z: p.z, rot: p.rot};
};
export const monumentK = (t: number, Y: number) => (Y >= 1984 ? 1 : 0);

// ------------------------------------------------------------------ the payoff: Paet Peng and the boats with candles
export const PILGRIMS = 18;
/** candles carried round the front of the vihara in a U (the lake is at its back) */
export const pilgrimAt = (i: number, t: number) => {
  const k = beatK('payoff', t);
  if (k < -0.05 || k > 1.05) return null;
  const u = (t * 0.07 + i / PILGRIMS) % 1;
  // round the front in a U from one side of the vihara to the other (front = FRONT, side = along the shore)
  const a = -Math.PI / 2 + u * Math.PI;
  const f = Math.cos(a) * (VIHARA_L / 2 + 0.45);
  const s = Math.sin(a) * (VIHARA_W / 2 + 0.35);
  const x = VIHARA_C[0] + FRONT[0] * f - FRONT[1] * s;
  const z = VIHARA_C[1] + FRONT[1] * f + FRONT[0] * s;
  return {x, z, rot: Math.atan2(-FRONT[1], FRONT[0]) - a, fade: smooth(u / 0.08) * smooth((1 - u) / 0.08)};
};
export const BOATS = 7;
/** boats with candles circle on the lake off the wat's shore */
export const BOAT_C: P = [-18.6, -6.0];
export const boatAt = (i: number, t: number) => {
  const a = (i / BOATS) * Math.PI * 2 + t * 0.12;
  return {x: BOAT_C[0] + Math.cos(a) * 2.6, z: BOAT_C[1] + Math.sin(a) * 2.0, rot: -a};
};
export const payoffK = (t: number, Y: number) => (Y < 2018 ? 0 : smooth((beatK('payoff', t) + 0.1) / 0.2));

/** true if a point is on the lake (for checks and placing) */
export const onLake = (x: number, z: number) => {
  let c = false;
  for (let i = 0, j = KWAN.length - 1; i < KWAN.length; j = i++) {
    const [xi, zi] = KWAN[i];
    const [xj, zj] = KWAN[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
};
export {WIANG, WAT_TILOK, GATE, MONUMENT};

export const ACTORS: Actor[] = [
  {id: 'buddha', role: 'hero', during: [0, 3.0], size: LEGEND_S * 0.35, at: () => [WAT_SI_KHOM_KHAM[0], LEGEND_S * 0.4, WAT_SI_KHOM_KHAM[1]]},
  {id: 'shrink', during: [3.0, 4.4], size: 4, at: () => [WAT_SI_KHOM_KHAM[0], 2, WAT_SI_KHOM_KHAM[1]]},
  {id: 'circlers', during: [3.9, 8.4], size: 1.6, minInFrame: 0.6, at: (t) => (circlerAt(0, t) ? [WAT_SI_KHOM_KHAM[0], 0.5, WAT_SI_KHOM_KHAM[1]] : null)},
  {
    id: 'leavers',
    during: [9.0, 13.4],
    size: 1.2,
    minInFrame: 0.6,
    at: (t) => {
      const p = leaverAt(0, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  },
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `cart${i}`,
    during: [15.0, 19.6],
    size: 0.9,
    minInFrame: 0.6,
    at: (t) => {
      const p = cartAt(i, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  })),
  {
    id: 'logs',
    during: [21.2, 25.4],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = carrierAt(0, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  },
  {id: 'vihara', during: [21.6, 25.6], size: 1.6, at: (t, c) => (vihK(t, c.Y) > 0.05 && vihK(t, c.Y) < 0.99 ? [VIHARA_C[0], 1.0, VIHARA_C[1]] : null)},
  {id: 'gate', during: [27.4, 29.6], size: 1.2, at: () => [GATE[0], 0.6, GATE[1]]},
  {id: 'flood', during: [29.4, 33.0], size: 10, at: () => [-2, 0.2, 6]},
  {id: 'tilok', during: [30.4, 33.2], size: 1.6, at: () => [WAT_TILOK[0], 0.6, WAT_TILOK[1]]},
  {
    id: 'parade',
    during: [34.6, 39.0],
    size: 1.2,
    minInFrame: 0.6,
    at: (t) => {
      const p = marcherAt(0, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  },
  // the grow shot: the town builds out north and east along the trunk (the sprawl, registered as what is being built)
  {id: 'sprawl', during: [40.4, 46.6], size: 14, at: () => [4, 0.5, -10]},
  {id: 'buddha-back', role: 'callback', during: [48.0, 54.0], size: 1.6, at: () => [WAT_SI_KHOM_KHAM[0], 1.2, WAT_SI_KHOM_KHAM[1]]},
  {
    id: 'pilgrims',
    during: [48.0, 54.0],
    size: 1.4,
    at: (t) => {
      const p = pilgrimAt(0, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  },
];
