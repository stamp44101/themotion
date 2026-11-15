// Pure position math for Roi Et's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {inPoly, shrinkPoly} from '../../engine/poly';
import {BUENG, BUENG_C, FOUND_PATH, MAIN_ROAD, N_ROAD, SE_ROAD, SHORE, SW_ROAD, STRIP, TOWER, TOWN, WAT_BUENG, WAT_KLANG, WAT_NUEA, WAT_SA_THONG, WOT_AT, WOT_S} from './places';
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

// ------------------------------------------------------------------ the cover: the wot (style frame A2)
export const WOTS = 14;
export const W_END = 1.9;
export const SPIN0 = 2.1;
/** pipe k drops in at this time; half are in before frame 0 */
export const wotAt = (k: number) => (k < WOTS / 2 ? -1 : ((k - WOTS / 2 + 1) / (WOTS / 2)) * W_END);
/** the cover's wot stands through the title and lifts away as the camera goes down to the procession (gone by 4.4 s) */
export const coverK = (t: number) => 1 - smooth((t - 3.4) / 1.0);

// ------------------------------------------------------------------ found: the procession up from the south
export const CARTS = 3;
export const WALKERS = 12;
const FOUND_L = lengthOf(FOUND_PATH);
/** each cart's distance along the path; they stop on the bueng's west bank */
export const cartAt = (i: number, t: number) => {
  const k = beatK('found', t);
  if (k < -0.1 || k > 1.05) return null;
  const d = lerp(FOUND_L * 0.35, FOUND_L - 0.2, smooth((k + 0.05) / 0.75)) - i * 2.0;
  return along(FOUND_PATH, d);
};
export const walkerAt = (i: number, t: number) => {
  const k = beatK('found', t);
  if (k < -0.1 || k > 1.05) return null;
  const d = lerp(FOUND_L * 0.35, FOUND_L - 0.2, smooth((k + 0.05) / 0.75)) - 0.9 - i * 0.55;
  if (d < 0) return null;
  const p = along(FOUND_PATH, d);
  const s = i % 2 ? 1 : -1;
  return {x: p.x + s * 0.32, z: p.z, rot: p.rot};
};
/** Wat Bueng Phra Lan Chai's first sim rises on the west bank as the procession arrives */
export const watBuengK = (t: number, Y: number) => (Y > 1776 ? 1 : smooth((beatK('found', t) - 0.55) / 0.3));
/** clearers with axes round the sim's site while it rises */
export const clearerAt = (i: number, t: number): P | null => {
  const k = beatK('found', t);
  if (k < 0.45 || k > 1.0) return null;
  const a = (i / 4) * Math.PI * 2 + t * 0.5;
  return [WAT_BUENG[0] + Math.cos(a) * 1.1 - 0.3, WAT_BUENG[1] + Math.sin(a) * 0.9 + 0.3];
};

// ------------------------------------------------------------------ the old town's houses (Lao houses on stilts)
// drawn here, not by the engine's grid: they fill the moat from the bueng outward through the plane beat (2343-2465), and
// give way to the modern town (the engine's modern houses, from 1950) in the 1940s
const OCCUPIED: [number, number, number][] = [
  [WAT_BUENG[0], WAT_BUENG[1], 1.7], [WAT_KLANG[0], WAT_KLANG[1], 1.7], [WAT_SA_THONG[0], WAT_SA_THONG[1], 1.7],
  [WAT_NUEA[0], WAT_NUEA[1], 1.7], [6.4, -6.0, 1.3], [TOWER[0], TOWER[1], 1.2],
];
const hash = (i: number) => {
  const v = Math.sin(i * 91.7 + 13.1) * 43758.5453;
  return v - Math.floor(v);
};
const distTo = (pts: P[], p: P) => {
  let bd = Infinity;
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1];
    const [bx, bz] = pts[i];
    const len2 = (bx - ax) ** 2 + (bz - az) ** 2;
    const u = clamp01(((p[0] - ax) * (bx - ax) + (p[1] - az) * (bz - az)) / len2);
    bd = Math.min(bd, Math.hypot(ax + (bx - ax) * u - p[0], az + (bz - az) * u - p[1]));
  }
  return bd;
};
export const TOWN_HOUSES: {x: number; z: number; rot: number; built: number}[] = (() => {
  const inner = shrinkPoly(TOWN, 0.9);
  const out: {x: number; z: number; rot: number; built: number}[] = [];
  let k = 0;
  for (let z = -8.4; z <= 7.8; z += 1.45)
    for (let x = -9.6; x <= 7.4; x += 1.45) {
      k++;
      const hx = x + (hash(k) - 0.5) * 0.5;
      const hz = z + (hash(k + 500) - 0.5) * 0.5;
      if (!inPoly(inner, hx, hz)) continue;
      // the bueng and its park, the roads, the temples
      if (hx > -4.6 && hx < 1.6 && hz > -4.2 && hz < 2.9) continue;
      if ([MAIN_ROAD, N_ROAD, SW_ROAD, SE_ROAD].some((r) => distTo(r, [hx, hz]) < 1.25)) continue;
      if (OCCUPIED.some(([ox, oz, r]) => Math.hypot(hx - ox, hz - oz) < r)) continue;
      const d = Math.hypot(hx - BUENG_C[0], hz - BUENG_C[1]);
      out.push({x: hx, z: hz, rot: hash(k + 900) < 0.5 ? 0 : Math.PI / 2, built: 1776 + d * 11 + hash(k + 77) * 18});
    }
  return out;
})();
export const townHouseK = (j: number, Y: number) => smooth((Y - TOWN_HOUSES[j].built) / 4) * (1 - smooth((Y - 1942) / 7));

// ------------------------------------------------------------------ plane: the old temples, the biplane
export const OLD_TEMPLES: P[] = [WAT_KLANG, WAT_SA_THONG, WAT_NUEA];
/** the old temples rise as the town fills, in the run between the founding and the plane (the counter's 2330s-2400s) */
export const templeK = (_j: number, _t: number, Y: number) => smooth((Y - 1790 - _j * 12) / 10);
export const PLANE_S = 1.6;
const STRIP_ROT = Math.atan2(STRIP[0][0] - STRIP[1][0], STRIP[0][1] - STRIP[1][1]);
/** down from the north onto the strip, rolls south and stops by the crowd */
export const planeAt = (t: number) => {
  const k = beatK('plane', t);
  if (k < 0.2 || k > 1.02) return null;
  const [n, s] = [STRIP[1], STRIP[0]];
  const dx = s[0] - n[0];
  const dz = s[1] - n[1];
  const L = Math.hypot(dx, dz);
  const ux = dx / L;
  const uz = dz / L;
  // distance along the runway from its north end: from 22 units out to touchdown (k 0.68), then the roll-out to 6.0
  const u = clamp01((k - 0.2) / 0.48);
  const v = clamp01((k - 0.68) / 0.24);
  const d = k < 0.68 ? lerp(-22, 0.6, u) : 0.6 + 5.4 * (1 - (1 - v) ** 2);
  const y = k < 0.68 ? 0.9 + 6 * (1 - u) ** 1.6 : 0.9;
  const pitch = k < 0.68 ? -0.12 * (1 - u) + 0.08 * u : 0.05;
  return {x: n[0] + ux * d, z: n[1] + uz * d, y, rot: STRIP_ROT, pitch, prop: t * 40};
};
export const stripK = (t: number, Y: number) => (Y > 1923 ? 1 : Y < 1918 ? 0 : smooth((beatK('plane', t) - 0.0) / 0.2));

// ------------------------------------------------------------------ dig: the silted bueng dredged by hand
/** 0 the old reedy marsh, then mud while it is dug, then the water comes back (k 0.78..1) */
export const marshK = (t: number, Y: number) => (Y > 1927 ? 0 : Y < 1925 ? 1 : 1 - smooth((beatK('dig', t) - 0.0) / 0.12));
export const waterK = (t: number, Y: number) => (Y > 1927 ? 1 : Y < 1925 ? 0 : smooth((beatK('dig', t) - 0.78) / 0.18));
export const DIGGERS = 30;
/** a digger walks between a spot in the basin and a spot on the shore with a basket */
export const diggerAt = (i: number, t: number) => {
  const k = beatK('dig', t);
  if (k < 0.05 || k > 0.82) return null;
  const j = i % BUENG.length;
  const [sx, sz] = BUENG[(j * 7) % BUENG.length];
  const dx = sx - BUENG_C[0];
  const dz = sz - BUENG_C[1];
  const d = Math.hypot(dx, dz);
  const shore: P = [sx + (dx / d) * 0.5, sz + (dz / d) * 0.5];
  const deep: P = [lerp(BUENG_C[0], sx, 0.55 + 0.25 * ((i * 0.37) % 1)), lerp(BUENG_C[1], sz, 0.55 + 0.25 * ((i * 0.37) % 1))];
  const ph = (t * 0.45 + i * 0.13) % 1;
  const w = ph < 0.5 ? smooth(ph / 0.5) : 1 - smooth((ph - 0.5) / 0.5);
  // the last ones walk out before the water comes back
  const out = smooth((k - 0.7) / 0.1);
  const u = Math.max(w, out);
  const x = lerp(deep[0], shore[0], u);
  const z = lerp(deep[1], shore[1], u);
  return {x, z, rot: Math.atan2(shore[0] - deep[0], shore[1] - deep[1]) + (ph < 0.5 ? 0 : Math.PI), load: ph < 0.5};
};
/** the island's sala and the pillar shrine stand from the municipality (the first office was on the island) */
export const islandK = (Y: number) => smooth((Y - 1936) / 2);

// ------------------------------------------------------------------ grow: Phra Sung Yai rises
export const buddhaK = (Y: number) => smooth((Y - 1965) / 8);

// ------------------------------------------------------------------ tower: the wot comes back and becomes หอโหวด ๑๐๑
export const TOWER_S = 6.4;
/** the wot's flight: from over the town's east side, shrinking, down onto the bueng's south bank (k 0..0.55), then it
 *  stands as the tower */
export const wotBack = (t: number, Y: number) => {
  if (Y > 2020.5) return {x: TOWER[0], y: 0, z: TOWER[1], S: TOWER_S, spin: 0, k: 1};
  const k = beatK('tower', t);
  if (k < 0) return null;
  const u = smooth(k / 0.55);
  return {
    x: lerp(TOWER[0] + 5, TOWER[0], u),
    y: lerp(1.0, 0, u),
    z: lerp(TOWER[1] + 2, TOWER[1], u),
    S: lerp(9, TOWER_S, u),
    spin: (1 - u) * t * 3,
    k: smooth((k - 0.5) / 0.3),
  };
};

// ------------------------------------------------------------------ fair: the Phawet procession round the bueng
export const MARCHERS = 26;
const SHORE_LOOP: P[] = [...SHORE, SHORE[0]];
const SHORE_L = lengthOf(SHORE_LOOP);
export const fairK = (t: number, Y: number) => (Y < 2020.6 ? 0 : smooth((beatK('fair', t) + 0.1) / 0.2));
export const marcherAt = (i: number, t: number) => {
  const d = (((t * 0.55 - i * 0.48) % SHORE_L) + SHORE_L) % SHORE_L;
  return along(SHORE_LOOP, d);
};

export const ACTORS: Actor[] = [
  {id: 'wot', role: 'hero', during: [0, 3.0], size: WOT_S * 0.15, at: () => [WOT_AT[0], WOT_S * 0.3, WOT_AT[1]]},
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `cart${i}`,
    during: [4.6, 8.4],
    size: 0.9,
    minInFrame: 0.6,
    at: (t) => {
      const p = cartAt(i, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  })),
  {id: 'watbueng', during: [6.4, 8.8], size: 1.0, at: (t, c) => (watBuengK(t, c.Y) > 0.05 ? [WAT_BUENG[0], 0.6, WAT_BUENG[1]] : null)},
  // the town filling the moat in the run between the founding and the plane (houses and the old temples rising)
  {id: 'town', during: [9.2, 11.4], size: 4, at: () => [-4.5, 0.5, -2.5]},
  {
    id: 'plane',
    during: [14.0, 15.8],
    size: 1.4,
    minInFrame: 0.6,
    at: (t) => {
      const p = planeAt(t);
      return p ? [p.x, p.y, p.z] : null;
    },
  },
  ...[0, 9, 18].map((i): Actor => ({
    id: `digger${i}`,
    during: [17.0, 21.6],
    size: 0.6,
    minInFrame: 0.6,
    at: (t) => {
      const p = diggerAt(i, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  })),
  // the grow shot: the town builds out over the paddies on every side (the sprawl, registered as what is being built)
  {id: 'sprawl', during: [24.0, 32.6], size: 14, at: () => [2, 0.5, 2]},
  {
    id: 'wot-back',
    role: 'callback',
    during: [33.8, 41.8],
    size: 2.0,
    tall: 9,
    at: (t, c) => {
      const w = wotBack(t, c.Y);
      return w ? [w.x, w.y, w.z] : null;
    },
  },
  {
    id: 'procession',
    during: [43.4, 52.6],
    size: 1.2,
    at: (t, c) => {
      if (fairK(t, c.Y) < 0.05) return null;
      const p = marcherAt(0, t);
      return [p.x, 0.5, p.z];
    },
  },
];
