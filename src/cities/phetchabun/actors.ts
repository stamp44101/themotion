// Pure position math for Phetchabun's moving things (src/engine/actors.ts); Landmarks.tsx draws
// from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {LANDING, NAKHONBAN, POOL, RIVER, WALL, WALL_C} from './places';
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
/** distance along `pts` of the point nearest to q (sampled every 0.1) */
const arcTo = (pts: P[], q: P) => {
  const L = lengthOf(pts);
  let best = 0;
  let bd = Infinity;
  for (let d = 0; d <= L; d += 0.1) {
    const p = along(pts, d);
    const e = Math.hypot(p.x - q[0], p.z - q[1]);
    if (e < bd) {
      bd = e;
      best = d;
    }
  }
  return best;
};

// ------------------------------------------------------------------ the river course
// The drawn river is a polyline with sharp corners; a boat follows the same line with the
// corners rounded off (Chaikin), and its bow and stern both stay on it (Nan's lesson: a hull on
// an averaged heading drifts across the banks).
const chaikin = (pts: P[], iters = 3): P[] => {
  let q = pts;
  for (let k = 0; k < iters; k++) {
    const r: P[] = [q[0]];
    for (let i = 0; i < q.length - 1; i++) {
      const [ax, az] = q[i];
      const [bx, bz] = q[i + 1];
      r.push([0.75 * ax + 0.25 * bx, 0.75 * az + 0.25 * bz], [0.25 * ax + 0.75 * bx, 0.25 * az + 0.75 * bz]);
    }
    r.push(q[q.length - 1]);
    q = r;
  }
  return q;
};
export const COURSE = chaikin(RIVER);
const onCourse = (d: number, half: number, side: number) => {
  const bow = along(COURSE, d + half);
  const stern = along(COURSE, d - half);
  const rot = Math.atan2(bow.x - stern.x, bow.z - stern.z);
  return {x: (bow.x + stern.x) / 2 + Math.cos(rot) * side, z: (bow.z + stern.z) / 2 - Math.sin(rot) * side, rot};
};
export const D_POOL = arcTo(COURSE, POOL);
export const D_LANDING = arcTo(COURSE, LANDING);
/** the stretch drawn at high water while boats are on it (the cover, the procession, the rite) */
export const HIGH: P[] = (() => {
  const out: P[] = [];
  for (let d = D_POOL - 9; d <= D_LANDING + 3; d += 0.5) {
    const p = along(COURSE, d);
    out.push([p.x, p.z]);
  }
  return out;
})();
/** the high water narrows to the river's width over this many units at each end, so it never
 *  stops in a step (a V on the bank at 46 s) */
export const HIGH_TAPER = 5;
/** the river line's own corners along the stretch (the engine draws its 1.0-wide river on it, with
 *  sharp corners): a round pool on each keeps them from poking out of the smoothed high water as
 *  V points (the workstation's 46 s still) */
export const HIGH_RAW: P[] = (() => {
  // only the corners well inside the full-width stretch (the ends taper, see HIGH_TAPER)
  const lo = D_POOL - 9 + HIGH_TAPER + 1;
  const hi = D_LANDING + 3 - HIGH_TAPER - 1;
  const idx = RIVER.map((p, i) => ({i, d: arcTo(COURSE, p)})).filter((q) => q.d >= lo && q.d <= hi).map((q) => q.i);
  return RIVER.slice(idx[0], idx[idx.length - 1] + 1);
})();
export const HIGH_W = 2.4;
/** The Pa Sak doubles back on itself at the rite's bend (วังมะขามแฟบ is the deep pool in that
 *  hairpin): at high water the land between the two arms narrows to a thin wedge with a sharp tip
 *  right behind the governor (the workstation's 46 s render). Fill any land that is close to the
 *  high water from two arms of the river at once, so the hairpin reads as one round pool. */
export const WEDGE_FILL: P[] = (() => {
  const step = 0.3;
  const out: P[] = [];
  const samples = HIGH.map((p, i) => ({p, d: i * 0.5}));
  for (let x = POOL[0] - 9; x <= POOL[0] + 9; x += step)
    for (let z = POOL[1] - 9; z <= POOL[1] + 9; z += step) {
      // distances to the course, with the arc each is measured at
      const near = samples.map((q) => ({e: Math.hypot(q.p[0] - x, q.p[1] - z), d: q.d})).filter((q) => q.e < HIGH_W / 2 + 1.4);
      if (!near.length || near.some((q) => q.e < HIGH_W / 2 - 0.4)) continue;
      const ds = near.map((q) => q.d);
      if (Math.max(...ds) - Math.min(...ds) > 4) out.push([x, z]);
    }
  return out;
})();
export const highWater = (t: number) => {
  const open = 1 - clamp01((beatK('procession', t) - 1.05) / 0.2);
  const pay = clamp01((beatK('payoff', t) + 0.12) / 0.12);
  return Math.max(t < 14 ? open : 0, pay);
};

// ------------------------------------------------------------------ the cover: the image rises
// 14 units tall (style frame A1). It rises upright over 0.25-2.25 s (never spins), stands in its
// halo, then comes down to the raft's size and settles on the raft that the boats bring up
export const HERO_H = 14;
export const RAFT_IMG = 1.5;
const rise = (t: number) => smooth(clamp01((t - 0.25) / 2.0));
const SHRINK0 = 4.9;
const SHRINK1 = 6.9;
export const imageAt = (t: number) => {
  const u = rise(t);
  const v = smooth(clamp01((t - SHRINK0) / (SHRINK1 - SHRINK0)));
  // log-scale shrink so it reads as one smooth settling
  const s = HERO_H * (RAFT_IMG / HERO_H) ** v;
  const base = lerp(-HERO_H * 0.95 + u * (HERO_H * 0.95 + 0.25), RAFT_DECK, v);
  return {u, v, s, y: base};
};
/** the whirlpool, the burst and the ripples, all at the pool */
export const whirlK = (t: number) => Math.min(1, 0.75 + t / 0.6) * (1 - clamp01((t - 3.5) / 2.5));
export const burstU = (t: number) => (t + 0.35) / 1.5;
export const haloK = (t: number) => clamp01((t - 1.6) / 1.2);

// ------------------------------------------------------------------ the procession by water
export const RAFT_DECK = 0.58;
/** the raft (with the image under its canopy) from the pool down to the Wat Traiphum landing */
export const raftAt = (t: number) => {
  const end = beatAt('procession', 1);
  if (t < SHRINK0 || t > end + 0.6) return null;
  const k = clamp01(beatK('procession', t) / 0.92);
  const d = lerp(D_POOL, D_LANDING, smooth(k));
  const p = onCourse(d, 1.2, 0);
  return {x: p.x, z: p.z, rot: p.rot, k};
};
export const ESCORTS = 6;
/** the escort boats: they row up to the pool round the image, then lead and follow the raft */
export const escortAt = (i: number, t: number) => {
  const r = raftAt(t);
  if (!r) return null;
  const ahead = i < 3;
  const n = ahead ? i : i - 3;
  const off = (ahead ? 1 : -1) * (3.2 + n * 2.6);
  // they come in from downstream over the shrink
  const gather = smooth(clamp01((t - SHRINK0) / 2.0));
  const d = lerp(D_POOL, D_LANDING, smooth(r.k)) + off + (1 - gather) * 6 * (ahead ? 1 : -1);
  const side = (n % 2 ? 1 : -1) * 0.35;
  const p = onCourse(d, 1.3, side);
  return {x: p.x, z: p.z, rot: p.rot, row: t * 1.4 + i * 0.37, fade: gather};
};

// ------------------------------------------------------------------ the Ayutthaya wall goes up
const RING = [...WALL, WALL[0]] as P[];
export const RING_LEN = lengthOf(RING);
/** 0..1 how far round the wall is built (from the north-west corner, clockwise) */
export const wallK = (t: number, Y: number) => (Y >= 1684 ? 1 : smooth(clamp01((beatK('wall', t) - 0.05) / 0.8)));
export const BUILDERS = 18;
export const builderAt = (i: number, t: number) => {
  const k = beatK('wall', t);
  if (k < -0.02 || k > 1.02) return null;
  // each carries bricks from the kiln yard by the river to the wall's growing end
  const head = wallK(t, 0) * RING_LEN;
  const d = Math.max(0, head - 1.2 - (i % 6) * 0.9);
  const p = along(RING, d);
  // outside the wall line, on the side away from the town centre
  const ox = p.x - WALL_C[0];
  const oz = p.z - WALL_C[1];
  const r = Math.hypot(ox, oz) || 1;
  const out = 0.9 + Math.floor(i / 6) * 0.7;
  return {x: p.x + (ox / r) * out, z: p.z + (oz / r) * out, rot: p.rot + (i % 2 ? Math.PI : 0), step: t * 1.5 + i * 0.37};
};

// ------------------------------------------------------------------ 2370: the camp and the army
// the camp the Vientiane force held at Phetchabun (its exact site is not known; drawn on the open
// ground south of the town, on the road up from Saraburi); the Bangkok army comes up from the
// south and takes it
export const CAMP: P = [6, 10.5];
export const CAMP_R = 2.4;
export const ARMY_COLS = 4;
export const ARMY_ROWS = 9;
export const ARMY_PATH: P[] = [
  [8.5, 30],
  [7.2, 21],
  [6, 9],
];
const ARMY_LEN = lengthOf(ARMY_PATH);
const D_CAMP = arcTo(ARMY_PATH, CAMP);
export const ARMY_S = 0.85;
export const armyAt = (col: number, row: number, t: number) => {
  const k = beatK('army', t);
  if (k < -0.02 || k > 1.04) return null;
  // up to the camp's south side by 60%, then into it as it falls
  const u = k < 0.6 ? smooth(k / 0.6) * (D_CAMP - CAMP_R - 0.6) : D_CAMP - CAMP_R - 0.6 + smooth(clamp01((k - 0.6) / 0.4)) * 3.2;
  const d = u - row * 1.35;
  if (d < 0) return null;
  const p = along(ARMY_PATH, d);
  const side = (col - (ARMY_COLS - 1) / 2) * 0.95;
  const walking = k < 0.97;
  return {x: p.x + Math.cos(p.rot) * side, z: p.z - Math.sin(p.rot) * side, rot: p.rot, step: walking ? t * 1.5 + col * 0.3 + row * 0.17 : 0, elephant: row === 0 && (col === 0 || col === ARMY_COLS - 1)};
};
/** the camp's palisade falls as the army reaches it (0 standing .. 1 down) */
export const campFall = (t: number) => clamp01((beatK('army', t) - 0.5) / 0.25);

// ------------------------------------------------------------------ 2486: Nakhonban Phetchabun
// the plan's roads are cut across the plain west of the old town and timber halls go up; the
// workers carry their tools along the new roads
export const CAP_ROADS: [P, P][] = [
  [[-3.5, 13], [-28, 13]],
  [[NAKHONBAN[0], 13], [NAKHONBAN[0], 24]],
  [[-25, 13], [-25, 22]],
];
export const capitalK = (t: number, Y: number) => (Y > 1945 ? 1 : clamp01(beatK('capital', t) / 0.85));
export const WORKERS = 16;
export const workerAt = (i: number, t: number) => {
  const k = beatK('capital', t);
  if (k < -0.02 || k > 1.02) return null;
  const [a, b] = CAP_ROADS[i % CAP_ROADS.length];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  // they work along the road as it is cut, a little behind its head
  const head = capitalK(t, 0) * len;
  const d = Math.max(0, head - 0.8 - Math.floor(i / 3) * 1.3);
  const ux = (b[0] - a[0]) / len;
  const uz = (b[1] - a[1]) / len;
  const side = (i % 2 ? 1 : -1) * 0.9;
  return {x: a[0] + ux * d - uz * side, z: a[1] + uz * d + ux * side, rot: Math.atan2(ux, uz), step: t * 1.4 + i * 0.41};
};

// ------------------------------------------------------------------ the tamarind trucks
// Highway 21 in from the south (Saraburi) to the town; trucks carry the crop out (south)
export const HIGHWAY: P[] = [
  [-10, 44],
  [-7, 26],
  [-3.4, 12],
  [-1.5, 3.6],
];
const HW_LEN = lengthOf(HIGHWAY);
export const TRUCKS = 5;
export const truckAt = (i: number, t: number) => {
  const k = beatK('tamarind', t);
  if (k < -0.05 || k > 1.1) return null;
  // southbound, leaving town loaded, one after another
  const d = HW_LEN - (k * 0.6 - i * 0.15) * HW_LEN;
  if (d < 0 || d > HW_LEN) return null;
  const p = along(HIGHWAY, d);
  return {x: p.x - Math.cos(p.rot) * 0.45, z: p.z + Math.sin(p.rot) * 0.45, rot: p.rot + Math.PI};
};
// the orchards on the plain west and south-west of the town
export const ORCHARDS: {c: P; w: number; h: number}[] = [
  {c: [-20, 22], w: 14, h: 10},
  {c: [-32, 8], w: 10, h: 14},
  {c: [-22, 34], w: 12, h: 8},
  {c: [10, 26], w: 10, h: 8},
];
export const PICKERS = 12;
export const pickerAt = (i: number, t: number) => {
  const k = beatK('tamarind', t);
  if (k < -0.02 || k > 1.02) return null;
  const o = ORCHARDS[i % 2];
  const a = (i / PICKERS) * Math.PI * 2 + t * 0.25;
  return {x: o.c[0] + Math.cos(a) * 3.2, z: o.c[1] + Math.sin(a) * 2.4, rot: -a, step: t * 1.3 + i * 0.3};
};

// ------------------------------------------------------------------ the payoff: อุ้มพระดำน้ำ
// the governor stands in the river holding the image in his arms; four officials stand round him
// (the four ministers of the old city), and they dip with it together. The image dips but
// never goes under all at once, and it never tips (research §5.1)
export const DIPS = 3;
export const dipAt = (t: number) => {
  const k = beatK('payoff', t);
  if (k < -0.05) return null;
  // walk out (0-0.25), three dips (0.3-0.85), stand holding it up (to the end)
  const wade = smooth(clamp01((k + 0.05) / 0.3));
  const d = clamp01((k - 0.3) / 0.55);
  const phase = d * DIPS;
  const dip = d > 0 && d < 1 ? Math.sin(Math.PI * (phase % 1)) ** 2 : 0;
  return {k, wade, dip, raise: smooth(clamp01((k - 0.86) / 0.1))};
};
/** where the governor stands: a step off the west bank at the pool */
export const GOV: P = [POOL[0] - 0.15, POOL[1]];
export const OFFICIALS = 4;
export const RITE_SCALE = 1.5;

const boatY = 0.6;
export const ACTORS: Actor[] = [
  // the cover: the image on the whole tile from frame 0
  {id: 'risingBuddha', role: 'hero', during: [0, 2.5], size: 6, at: (t) => {
    const im = imageAt(t);
    return [POOL[0], Math.max(1, im.y + im.s * 0.5), POOL[1]];
  }},
  {id: 'buddhaStands', during: [2.5, 7.2], size: 2, at: (t) => {
    const im = imageAt(t);
    return [POOL[0], Math.max(0.8, im.y + im.s * 0.5), POOL[1]];
  }},
  {id: 'raft', during: [beatAt('procession', 0.05), beatAt('procession', 0.95)], size: 1.4, at: (t) => {
    const r = raftAt(t);
    return r ? [r.x, boatY + 0.5, r.z] : null;
  }},
  {id: 'builders', during: [beatAt('wall', 0.08), beatAt('wall', 0.9)], size: 2.4, at: (t) => {
    const b = builderAt(0, t);
    return b ? [b.x, 0.9, b.z] : null;
  }},
  {id: 'army', during: [beatAt('army', 0.05), beatAt('army', 0.95)], size: 2.6, at: (t) => {
    const a = armyAt(1, 0, t);
    return a ? [a.x, 1.6, a.z] : null;
  }},
  {id: 'workers', during: [beatAt('capital', 0.05), beatAt('capital', 0.9)], size: 2.2, at: (t) => {
    const w = workerAt(1, t);
    return w ? [w.x, 0.8, w.z] : null;
  }},
  {id: 'trucks', during: [beatAt('tamarind', 0.1), beatAt('tamarind', 0.9)], size: 1.8, at: (t) => {
    // the truck nearest town (the shot is on the town end of the highway)
    for (let i = TRUCKS - 1; i >= 0; i--) {
      const tr = truckAt(i, t);
      if (tr && tr.z < 22) return [tr.x, 0.7, tr.z];
    }
    return null;
  }},
  {id: 'cityGrowing', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 12, at: () => [WALL_C[0], 1.5, WALL_C[1]]},
  {id: 'umPhraDamNam', role: 'callback', during: [beatAt('payoff', 0.05), beatAt('payoff', 1)], size: 1.6, at: (t) => {
    const d = dipAt(t);
    return d ? [GOV[0], 1.6 - d.dip * 0.8, GOV[1]] : null;
  }},
];
