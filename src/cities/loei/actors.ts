// Pure position math for Loei's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {clamp01, smooth} from './hero';
import {BAN_HAE, FAIR, HERO_AT, HERO_S, KRADUENG, KRADUENG_H, KRADUENG_R, LOEI, PHON_CHAI, STUPA} from './places';
import {STORY} from './timeline';

type P = [number, number];
export {clamp01, smooth};
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

// ------------------------------------------------------------------ the cover: the giant Phi Ta Khon (style frame A1)
/** the giant stands through the cover and shrinks away as the camera leaves for the stupa (gone by 4.2 s) */
export const heroK = (t: number) => 1 - smooth((t - 3.3) / 0.9);

// ------------------------------------------------------------------ oath: two columns meet at the Man's bend
/** Ayutthaya's people come in from the west, over the hills from the Nan side */
export const AYU_PATH: P[] = [[-24.0, 5.6], [-19.0, 5.2], [-15.0, 4.8], [-12.4, 4.7], [-10.6, 4.8]];
/** Lan Xang's people come down the valley from the north, west of the Man */
export const LX_PATH: P[] = [[-11.4, -12.0], [-11.0, -6.0], [-10.8, -2.0], [-10.6, 1.6], [-10.4, 3.6]];
export const OATH_N = 9; // people in each column
const AYU_L = lengthOf(AYU_PATH);
const LX_L = lengthOf(LX_PATH);
/** where person i of column c (0 Ayutthaya, 1 Lan Xang) is: walking in until ~45% of the beat, then standing in an arc
 *  facing the stupa */
export const oathAt = (c: number, i: number, t: number) => {
  const k = beatK('oath', t);
  if (k < -0.12 || k > 1.12) return null;
  const path = c ? LX_PATH : AYU_PATH;
  const L = c ? LX_L : AYU_L;
  const walk = smooth((k + 0.12) / 0.55);
  const d = lerp(L * 0.15, L, walk) - i * 0.55;
  const p = along(path, Math.max(0, d));
  // the arc: Ayutthaya's on the stupa's south-west, Lan Xang's on its north-west
  const a = (c ? -2.0 : 2.0) + ((i / (OATH_N - 1)) - 0.5) * 1.3 * (c ? -1 : 1);
  const ax = STUPA[0] - Math.sin(a) * 0.1 + Math.cos(a + Math.PI) * 1.55;
  const az = STUPA[1] + Math.sin(a) * 1.1;
  const settle = smooth((k - 0.42) / 0.18);
  const x = lerp(p.x, ax, settle);
  const z = lerp(p.z, az, settle);
  const rot = settle > 0.5 ? Math.atan2(STUPA[0] - x, STUPA[1] - z) : p.rot;
  return {x, z, rot, walking: settle < 0.95 && walk < 0.999};
};
/** the stupa rises tier by tier through the oath (2103 -> 2106); standing from then on */
export const stupaK = (t: number, Y: number) => (Y > 1566 ? 1 : Y < 1559 ? 0 : smooth((beatK('oath', t) - 0.18) / 0.72));

// ------------------------------------------------------------------ frontier: ox caravans down the valley into town
export const CARAVAN_PATH: P[] = [[-5.4, -30.0], [-5.0, -26.0], [-4.2, -22.0], [-3.5, -17.0], [-3.4, -12.6], [-3.6, -9.6], [-3.3, -7.2], [-2.6, -5.2], [-1.8, -3.9]];
const CARAVAN_L = lengthOf(CARAVAN_PATH);
export const OXEN = 6;
/** pack ox i of the caravan: in from the north, stopping at the market by the river */
export const oxAt = (i: number, t: number) => {
  const k = beatK('frontier', t);
  if (k < -0.12 || k > 1.05) return null;
  const d = lerp(CARAVAN_L * 0.3, CARAVAN_L - 0.2, smooth((k + 0.12) / 1.0)) - i * 1.25;
  if (d < 0) return null;
  return along(CARAVAN_PATH, d);
};
/** Wat Phon Chai's sim rises with the town */
export const phonChaiK = (t: number, Y: number) => (Y > 1700 ? 1 : Y < 1600 ? 0 : smooth((beatK('frontier', t) - 0.3) / 0.4));

// ------------------------------------------------------------------ loei: Ban Hae raised to Mueang Loei (far place 1)
/** Ban Hae's houses on both banks of the Huai Nam Man (drawn round BAN_HAE) */
export const LOEI_HOUSES: P[] = [
  [29.4, -23.4], [30.4, -24.0], [31.6, -23.0], [32.8, -22.6], [33.6, -23.2], [29.0, -20.6], [30.2, -20.0], [31.4, -19.6],
  [32.6, -19.6], [28.0, -22.2], [33.8, -17.6], [32.4, -17.2], [30.8, -17.8],
];
export const loeiHouseK = (j: number, t: number, Y: number) => (Y > 1856 ? 1 : Y < 1840 ? 0 : smooth((beatK('loei', t) - 0.05 - j * 0.035) / 0.2));
/** the pillar procession from the stream to the pillar's site */
const LOEI_PILLAR_PATH: P[] = [[BAN_HAE[0] - 1.2, BAN_HAE[1] + 1.0], [BAN_HAE[0], BAN_HAE[1] + 0.4], [LOEI[0] - 1.0, LOEI[1] - 0.2], [LOEI[0] - 0.3, LOEI[1]]];
const LP_L = lengthOf(LOEI_PILLAR_PATH);
export const loeiLogAt = (t: number) => {
  const k = beatK('loei', t);
  if (k < 0.2 || k > 0.7) return null;
  return along(LOEI_PILLAR_PATH, smooth((k - 0.2) / 0.4) * LP_L);
};
export const loeiPillarUp = (t: number, Y: number) => (Y > 1856 ? 1 : Y < 1840 ? 0 : smooth((beatK('loei', t) - 0.62) / 0.2));
/** the smiths' furnaces at the hill foot (Mouhot, 2404): pits glowing, bellows pumping */
export const FORGES: P[] = [[26.0, -28.6], [27.4, -29.4], [28.8, -28.4]];
export const forgeK = (t: number, Y: number) => (Y < 1850 || Y > 1940 ? 0 : 1);

// ------------------------------------------------------------------ wax: the wax castles carried to the stupa
/** from Wat Phon Chai over the Sok, west along the road, over the Man and up to the stupa */
export const WAX_PATH: P[] = [
  [0.6, 1.2], [-0.4, 2.1], [-3.5, 2.3], [-6.2, 2.5], [-5.5, 5.2], [-7.0, 7.3], [-9.2, 7.9], [-10.3, 7.6], [-10.4, 6.2], [-10.1, 5.2],
  [-9.6, 5.0],
];
const WAX_L = lengthOf(WAX_PATH);
export const WAX_N = 16;
/** person i of the procession (every fourth carries a wax castle on a litter with three others) */
export const waxAt = (i: number, t: number) => {
  const k = beatK('wax', t);
  if (k < -0.1 || k > 1.08) return null;
  const head = lerp(1.0, WAX_L - 0.2, smooth((k + 0.1) / 0.95));
  const d = head - i * 0.6;
  if (d < 0) return null;
  return along(WAX_PATH, d);
};

// ------------------------------------------------------------------ kradueng: the climb to the plateau (far place 2)
/** a point on the climb, u 0..1: switchbacks up the west face (outside the frustum's side), then onto the top */
export const climbAt = (u: number) => {
  const [cx, cz] = KRADUENG;
  if (u < 0.12) {
    // the walk in from the foot village
    const v = u / 0.12;
    return {x: lerp(cx - 15, cx - 10.2, v), z: lerp(cz - 3.0, cz - 0.6, v), y: 0};
  }
  if (u < 0.88) {
    const v = (u - 0.12) / 0.76;
    const y = v * KRADUENG_H;
    const r = KRADUENG_R + 2.5 * (1 - v) + 0.2;
    const phi = Math.PI + 0.32 * Math.sin(v * Math.PI * 3);
    return {x: cx + Math.cos(phi) * r, z: cz + Math.sin(phi) * r * 0.9 - 0.6, y};
  }
  const v = (u - 0.88) / 0.12;
  return {x: lerp(cx - KRADUENG_R + 0.2, cx - 3.0, v), z: lerp(cz - 0.6, cz - 0.4, v), y: KRADUENG_H};
};
export const CLIMBERS = 10;
export const climberAt = (i: number, t: number) => {
  const k = beatK('kradueng', t);
  if (k < -0.1 || k > 1.1) return null;
  const u = clamp01(0.08 + k * 0.7 - i * 0.055);
  const a = climbAt(u);
  const b = climbAt(Math.min(1, u + 0.01));
  return {...a, rot: Math.atan2(b.x - a.x, b.z - a.z)};
};

// ------------------------------------------------------------------ fest: Bun Luang, the streets full of Phi Ta Khon
/** the giant comes back at the festival ground, dancing (the callback) */
export const GIANT_AT: P = [-5.6, -5.4];
export const GIANT_S = 8;
export const giantK = (t: number, Y: number) => (Y < 2015 ? 0 : smooth((beatK('fest', t) + 0.05) / 0.2));
/** the town street from ทล.2013 past Wat Phon Chai, over the Man and north to the festival ground (OSM 310612759 marks its
 *  crossing) */
export const STREET: P[] = [[1.6, 2.1], [1.6, 0.0], [1.8, -1.5], [2.0, -2.3], [0.6, -3.3], [-1.0, -4.2], [-2.4, -5.0]];
/** the parade walks the street */
export const PARADE_PATH: P[] = STREET;
const PARADE_L = lengthOf(PARADE_PATH);
export const GHOSTS = 30;
/** ghost i in the parade: it walks the street over and over (fading out and back in at the restart), swaying */
export const ghostAt = (i: number, t: number, Y: number) => {
  if (Y < 2015) return null;
  const k = beatK('fest', t);
  if (k < -0.05 || k > 1.25) return null;
  const s = ((t * 0.55 + i * (PARADE_L / GHOSTS)) % PARADE_L + PARADE_L) % PARADE_L;
  const p = along(PARADE_PATH, s);
  const side = ((i % 3) - 1) * 0.28;
  const fade = smooth(s / 0.6) * smooth((PARADE_L - s) / 0.6);
  return {x: p.x + Math.cos(p.rot) * side, z: p.z - Math.sin(p.rot) * side, rot: p.rot, fade};
};
/** the crowd of ghosts dancing round the giant on the festival ground */
export const RING_GHOSTS = 18;
export const ringGhostAt = (i: number, t: number): P => {
  const a = (i / RING_GHOSTS) * Math.PI * 2 + t * 0.3;
  const r = 2.3 + (i % 2) * 0.35;
  return [GIANT_AT[0] + Math.cos(a) * r, GIANT_AT[1] + Math.sin(a) * r * 0.8];
};

export const ACTORS: Actor[] = [
  {id: 'giant', role: 'hero', during: [0, 3.0], size: HERO_S * 0.3, tall: HERO_S * 0.6, at: () => [HERO_AT[0], HERO_S * 0.45, HERO_AT[1]]},
  ...[0, 1].map((c): Actor => ({
    id: c ? 'lanxang' : 'ayutthaya',
    during: [4.4, 9.2],
    size: 0.9,
    minInFrame: 0.6,
    at: (t) => {
      const p = oathAt(c, 0, t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  })),
  {id: 'stupa', during: [5.0, 9.4], size: 1.2, at: (t, c) => (stupaK(t, c.Y) > 0.05 ? [STUPA[0], 1.0, STUPA[1]] : null)},
  ...[0, 2].map((i): Actor => ({
    id: `ox${i}`,
    during: [10.6, 15.2],
    size: 0.9,
    minInFrame: 0.6,
    at: (t) => {
      const p = oxAt(i, t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  })),
  {id: 'banhae', during: [16.8, 21.2], size: 2.0, at: () => [BAN_HAE[0], 0.6, BAN_HAE[1]]},
  {
    id: 'waxcastle',
    during: [22.8, 27.2],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = waxAt(1, t);
      return p ? [p.x, 0.8, p.z] : null;
    },
  },
  {
    id: 'climbers',
    during: [28.8, 33.6],
    size: 1.2,
    minInFrame: 0.6,
    at: (t) => {
      const p = climberAt(0, t);
      return p ? [p.x, p.y + 0.6, p.z] : null;
    },
  },
  // the grow shot: the town builds out east along the road and north up the valley (the sprawl, as what is being built)
  {id: 'sprawl', during: [35.2, 43.6], size: 12, at: () => [6, 0.5, -2]},
  {id: 'giant-back', role: 'callback', during: [45.2, 54.0], size: GIANT_S * 0.3, tall: GIANT_S * 0.7, at: () => [GIANT_AT[0], GIANT_S * 0.4, GIANT_AT[1]]},
  {
    id: 'parade',
    during: [45.2, 54.0],
    size: 1.6,
    at: () => [PHON_CHAI[0] - 0.6, 0.6, PHON_CHAI[1] - 2.4],
  },
  {id: 'fair', during: [45.2, 54.0], size: 2.0, at: () => [FAIR[0], 0.5, FAIR[1]]},
];
