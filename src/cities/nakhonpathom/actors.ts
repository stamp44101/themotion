// Pure position math for Nakhon Pathom's moving things (src/engine/actors.ts); Landmarks.tsx draws
// from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {CANAL_PATH, PALACE, RATCHADAMNOEN} from './places';
import {H_HERO, H_MID, STORY} from './timeline';

type P = [number, number];
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const beatAt = (id: string, p: number) => {
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

// ------------------------------------------------------------------ the chedi
const SHRINK0 = 4.4;
const SHRINK1 = 6.8;
/** the chedi's height: legend scale through the cover, then the town's scale */
export const chediH = (t: number) => H_HERO * (H_MID / H_HERO) ** smooth(clamp01((t - SHRINK0) / (SHRINK1 - SHRINK0)));

export type ChediState = {shell: number; spire: number; crown: number; gold: number; slump: number; lit: number};
/** where the work stands at t: the cover's finished chedi winds back to the brick shell Rama IV
 *  began; the shell rises through the canal beat, slumps in the 2403 rains, is relaid as the bell
 *  and crowned (2413); lit for the fair */
export const chediAt = (t: number): ChediState => {
  const back = smooth(clamp01((t - 5) / 1.8));
  if (t < 7.2) {
    return {
      shell: lerp(clamp01((t + 0.3) / 1.0), 0.35, back),
      spire: clamp01((t - 0.95) / 0.5) * (1 - back),
      crown: clamp01((t - 1.4) / 0.2) * (1 - back),
      gold: 1 - back,
      slump: 0,
      lit: 0,
    };
  }
  const cn = clamp01(beatK('canal', t));
  const cl = beatK('collapse', t);
  if (cl < 0) return {shell: lerp(0.35, 0.7, smooth(cn)), spire: 0, crown: 0, gold: 0, slump: 0, lit: 0};
  if (cl <= 1) {
    const s = smooth(clamp01((cl - 0.22) / 0.3));
    const clear = smooth(clamp01((cl - 0.7) / 0.3));
    return {shell: lerp(0.7, 0.3, clear), spire: 0, crown: 0, gold: 0, slump: s * (1 - clear), lit: 0};
  }
  const cr = clamp01(beatK('crown', t));
  const lit = smooth(clamp01(beatK('payoff', t) / 0.2));
  return {
    shell: lerp(0.3, 1, smooth(clamp01(cr / 0.3))),
    spire: smooth(clamp01((cr - 0.3) / 0.2)),
    crown: smooth(clamp01((cr - 0.5) / 0.1)),
    gold: smooth(clamp01((cr - 0.15) / 0.4)),
    slump: 0,
    lit,
  };
};

/** the July 2403 rains, in and out over the collapse beat */
export const rainK = (t: number) => {
  const k = beatK('collapse', t);
  return smooth(clamp01(k / 0.12)) * smooth(clamp01((0.72 - k) / 0.15));
};

/** the walled square, gallery and viharns spreading out from the base through the crown beat */
export const courtK = (t: number) => clamp01((beatK('crown', t) - 0.12) / 0.5);

/** the bricks thrown out as the shell slumps: brick i at t, or null */
export const DEBRIS = 42;
export const debrisAt = (i: number, t: number) => {
  const cl = beatK('collapse', t);
  const u = clamp01((cl - 0.24) / 0.32);
  if (u <= 0 || cl > 0.8) return null;
  const a = (i / DEBRIS) * Math.PI * 2 + (i % 3) * 0.4;
  const r0 = 0.3 * H_MID;
  const out = (0.06 + ((i * 37) % 11) / 11 * 0.14) * H_MID;
  const h0 = (0.12 + ((i * 13) % 7) / 7 * 0.16) * H_MID;
  const y = Math.max(0.05, h0 * (1 - u * u) + Math.sin(u * Math.PI) * 0.4);
  return {x: Math.cos(a) * (r0 + out * u), z: Math.sin(a) * (r0 + out * u), y, rot: a + u * 4};
};

/** the builders walking round the base, carrying bricks: from the cover's end to the crown */
export const BUILDERS = 20;
export const builderAt = (i: number, t: number) => {
  if (t < 5.6 || t > beatAt('crown', 0.9)) return null;
  // between the upper terrace's edge (0.38 H) and the gallery that comes later (0.45 H)
  const R = (0.4 + (i % 2) * 0.03) * H_MID;
  const a = (i / BUILDERS) * Math.PI * 2 + t * 0.18 * (i % 2 ? 1 : -1);
  return {x: Math.cos(a) * R, z: Math.sin(a) * R, rot: a + (i % 2 ? 0 : Math.PI)};
};

// ------------------------------------------------------------------ the canal
export const CANAL_L = lengthOf(CANAL_PATH);
// the stretch from the Tha Chin (path[0], east) to the chedi's landing
export const LANDING_D = (() => {
  let best = 0;
  let bd = 1e9;
  for (let d = 0; d < CANAL_L; d += 0.25) {
    const p = along(CANAL_PATH, d);
    const dd = Math.hypot(p.x, p.z);
    if (dd < bd) [bd, best] = [dd, d];
  }
  return best;
})();
/** how much of the canal is dug, as a distance from the east end: begun with the works, to the
 *  landing during the canal beat, on north-west by the collapse */
export const canalDug = (t: number) => {
  if (t < 5) return 0;
  const k = beatK('canal', t);
  if (k < 0) return 0.45 * LANDING_D * smooth(clamp01((t - 5) / 2.4));
  if (k <= 1) return lerp(0.45 * LANDING_D, LANDING_D + 4, smooth(k));
  return lerp(LANDING_D + 4, CANAL_L, smooth(clamp01((t - beatAt('canal', 1)) / 4)));
};
/** the brick boats coming up the canal from the Tha Chin to the landing during the canal beat */
export const BOATS = 5;
export const boatAt = (i: number, t: number) => {
  const k = beatK('canal', t);
  if (k < 0.05 || t > beatAt('collapse', 0.3)) return null;
  const d = Math.min(canalDug(t) - 2.5 - i * 4.2, LANDING_D - 1.2 - i * 1.6);
  if (d < 0.5) return null;
  return along(CANAL_PATH, d);
};

// ------------------------------------------------------------------ the Wild Tiger Corps
export const CORPS = 24;
const RD = [...RATCHADAMNOEN, [PALACE[0] + 2.6, PALACE[1] + 0.2]] as P[];
const RD_L = lengthOf(RD);
/** marcher i on Ratchadamnoen, from the chedi to the palace gate; stops strung out at the gate */
export const marcherAt = (i: number, t: number) => {
  const k = beatK('palace', t);
  if (k < -0.05 || k > 1.1) return null;
  const head = lerp(3, RD_L - 0.4, smooth(clamp01((k + 0.05) / 0.95)));
  const d = head - Math.floor(i / 2) * 1.0;
  if (d < 0) return null;
  const p = along(RD, d);
  const side = i % 2 ? 0.3 : -0.3;
  return {x: p.x - Math.cos(p.rot) * side, z: p.z + Math.sin(p.rot) * side, rot: p.rot, moving: k < 0.92};
};

// ------------------------------------------------------------------ the fair
/** the crowd walking round the chedi (เวียนประทักษิณ) */
export const WALKERS = 46;
export const walkerAt = (i: number, t: number) => {
  const k = beatK('payoff', t);
  if (k < 0) return null;
  // a third on the upper terrace round the bell (0.32-0.38 H), the rest on the square outside the
  // gallery (0.6-0.72 H): nobody walks through the gallery's wall or the viharns
  const up = i % 3 === 0;
  const R = (up ? 0.35 : 0.6 + (i % 4) * 0.04) * H_MID;
  const a = (i / WALKERS) * Math.PI * 2 + t * (up ? 0.16 : 0.1);
  return {x: Math.cos(a) * R, z: Math.sin(a) * R, y: up ? 0.06 * H_MID : 0, rot: -a};
};
/** the Ferris wheel on the square's south side, its plane east-west, clear of the gallery (0.525 H) and
 *  inside the wall (1.02 H): the rim (1.9) spans z 0.82 H +- 0.3 */
export const WHEEL: P = [0, 0.82 * H_MID];
export const wheelK = (t: number) => smooth(clamp01(beatK('payoff', t) / 0.15));

export const ACTORS: Actor[] = [
  // the cover: the chedi at legend scale on the whole tile from frame 0
  {id: 'chediRising', role: 'hero', during: [0, 2.5], size: 0.3 * H_HERO, at: () => [0, 0.4 * H_HERO, 0]},
  {id: 'chediSettles', during: [2.5, 7.2], size: 4, at: (t) => [0, chediH(t) * 0.3, 0]},
  {id: 'brickBoats', during: [beatAt('canal', 0.18), beatAt('canal', 0.98)], size: 1.4, at: (t) => {
    const b = boatAt(0, t);
    return b ? [b.x, 0.4, b.z] : null;
  }},
  {id: 'collapse', during: [beatAt('collapse', 0.05), beatAt('collapse', 0.95)], size: 0.4 * H_MID, at: () => [0, 0.2 * H_MID, 0]},
  {id: 'crownRaised', during: [beatAt('crown', 0.05), beatAt('crown', 0.95)], size: 0.35 * H_MID, at: () => [0, 0.45 * H_MID, 0]},
  {id: 'tigerCorps', during: [beatAt('palace', 0.04), beatAt('palace', 0.95)], size: 2, at: (t) => {
    const m = marcherAt(0, t);
    return m ? [m.x, 0.7, m.z] : null;
  }},
  {id: 'cityGrowing', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 16, at: () => [6, 1.5, 2]},
  {id: 'chediLit', role: 'callback', during: [beatAt('payoff', 0.05), beatAt('payoff', 1)], size: 0.4 * H_MID, at: () => [0, 0.4 * H_MID, 0]},
];
