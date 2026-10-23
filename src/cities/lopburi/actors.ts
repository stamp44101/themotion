// Pure position math for Lopburi's moving things (src/engine/actors.ts); Landmarks.tsx draws
// from the same functions.
import type {Actor, ActorCtx} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {PALACE, PIPE_FROM, PRANG, RECEPTION, RIVER, riverX, SAN_PHRA_KAN, WAT_NAKHON_KOSA} from './places';
import {STORY} from './timeline';

type P = [number, number];
const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
const beatK = (id: string, t: number) => {
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
const gy = (ctx: ActorCtx, x: number, z: number) => ctx.ground?.(x, z) ?? 0;

// ------------------------------------------------------------------ Hanuman
// The cover: he leaps in from across the tile (from the camera's side, so he lands facing it)
// and comes down beside where the prang will stand; at the end of the legend he leaps away north.
// In the payoff he comes back from the east and settles among the buffet tables.
export const HANUMAN_S = 4.6;
const LAND: P = [PRANG[0] + 9, PRANG[1] - 4];
const START: [number, number, number] = [PRANG[0], 9, PRANG[1] + 26];
const LAND_T = 2.4;
const EXIT: [number, number] = [7.0, 8.1]; // seconds: the leap away
const EXIT_TO: [number, number, number] = [PRANG[0] + 30, 20, PRANG[1] - 40];
// behind the prang as the payoff's camera sees it (from the east), so the troop and the tables
// stay in front of him
export const RET_LAND: P = [PRANG[0] - 5, PRANG[1] + 1];
const RET_FROM: [number, number, number] = [PRANG[0] - 22, 14, PRANG[1] - 4];
const RET: [number, number] = [beatAt('payoff', 0) + 0.2, beatAt('payoff', 0) + 1.8];

const arc = (a: [number, number, number], b: [number, number, number], u: number, lift: number) => [
  lerp(a[0], b[0], u),
  lerp(a[1], b[1], u) + lift * Math.sin(Math.PI * u),
  lerp(a[2], b[2], u),
];

/** Hanuman at second t: position, heading and pose (leap 1 = flying, 0 = crouched), or null. */
export const hanumanAt = (t: number, ground = 0) => {
  const land3: [number, number, number] = [LAND[0], ground, LAND[1]];
  if (t <= LAND_T) {
    const u = Math.max(0, t / LAND_T);
    const [x, y, z] = arc(START, land3, u, 6);
    return {x, y, z, yaw: Math.atan2(LAND[0] - START[0], LAND[1] - START[2]), leap: 1};
  }
  if (t < EXIT[0]) return {x: LAND[0], y: ground, z: LAND[1], yaw: Math.atan2(LAND[0] - START[0], LAND[1] - START[2]), leap: Math.max(0, 1 - (t - LAND_T) * 4)};
  if (t < EXIT[1]) {
    const u = (t - EXIT[0]) / (EXIT[1] - EXIT[0]);
    const [x, y, z] = arc(land3, EXIT_TO, smooth(u), 6);
    return {x, y, z, yaw: Math.atan2(EXIT_TO[0] - LAND[0], EXIT_TO[2] - LAND[1]), leap: Math.min(1, u * 4)};
  }
  const g2 = ground;
  if (t >= RET[0] && t <= RET[1]) {
    const u = (t - RET[0]) / (RET[1] - RET[0]);
    const [x, y, z] = arc(RET_FROM, [RET_LAND[0], g2, RET_LAND[1]], u, 6);
    return {x, y, z, yaw: Math.atan2(RET_LAND[0] - RET_FROM[0], RET_LAND[1] - RET_FROM[2]), leap: 1};
  }
  if (t > RET[1]) {
    // settled, turned toward the camera side (south-east)
    return {x: RET_LAND[0], y: g2, z: RET_LAND[1], yaw: Math.PI / 2, leap: Math.max(0, 1 - (t - RET[1]) * 4)};
  }
  return null;
};

// ------------------------------------------------------------------ the troop
// In the legend twenty macaques run round where he lands, then gather to him. From the
// abandonment on (1688) they live round the prang and ศาลพระกาฬ; at the buffet they crowd the tables.
export const TROOP_N = 24;
export const monkeyAt = (i: number, t: number, Y: number) => {
  const a = (i / TROOP_N) * Math.PI * 2 + i * 0.37;
  const legend = t < beatAt('legend', 1);
  const pay = t >= beatAt('payoff', 0);
  if (!legend && Y < 1688) return null;
  if (legend) {
    const r = 5 + (i % 4) * 1.4;
    const run = t > LAND_T ? Math.min(1, (t - LAND_T) / 3) : 0;
    const ang = a + t * (0.35 + (i % 3) * 0.08) * (i % 2 ? 1 : -1) * (1 - run);
    let x = PRANG[0] + 2 + Math.cos(ang) * r;
    let z = PRANG[1] + Math.sin(ang) * r * 1.2;
    x += (LAND[0] + Math.cos(a) * 3.2 - x) * run;
    z += (LAND[1] + Math.sin(a) * 3.2 - z) * run;
    return {x, z, rot: ang + Math.PI / 2, hop: Math.sin(t * 9 + i * 1.7), sit: false};
  }
  if (pay) {
    // round the buffet tables south of the prang
    const row = i % 3;
    const col = Math.floor(i / 3);
    return {x: PRANG[0] - 3 + col * 1.0, z: PRANG[1] + 3 + row * 1.3 + (col % 2) * 0.3, rot: row === 1 ? Math.PI : 0, hop: Math.sin(t * 4 + i) * 0.2, sit: true};
  }
  // everyday: half sit about the prang and the shrine, half wander between them
  const home = i % 2 ? SAN_PHRA_KAN : PRANG;
  if (i % 3 === 0) {
    const ang = a + t * 0.25;
    return {x: home[0] + Math.cos(ang) * 2.4, z: home[1] + Math.sin(ang) * 2.0, rot: ang + Math.PI / 2, hop: Math.sin(t * 8 + i), sit: false};
  }
  return {x: home[0] + Math.cos(a) * 2.2, z: home[1] + Math.sin(a) * 1.9, rot: a, hop: 0, sit: true};
};

// ------------------------------------------------------------------ the river traffic
// downstream along the river from the palace reach to the south edge
const DOWNSTREAM: P[] = RIVER.slice(8) as P[];
const DOWN_LEN = lengthOf(DOWNSTREAM);

// Lavo: small trading boats going up and down the river
export const lavoBoatAt = (i: number, t: number, Y: number) => {
  if (Y < 600 || Y > 1160) return null;
  const k = beatK('lavo', t);
  if (k < -0.05 || k > 1.05) return null;
  const up = i % 2 === 0;
  const d = (i * 2.5 + (up ? 1 - k : k) * 7) % 10;
  const p = along(DOWNSTREAM, d);
  return {x: p.x + (up ? -0.35 : 0.35), z: p.z, rot: p.rot + (up ? Math.PI : 0)};
};

// 1155: three elephants walk down from the town to the landing, board, and the junk sails south
const ELE_PATH: P[] = [[PRANG[0] - 6, PRANG[1] + 3], [-6, -1.5], [riverX(-1) + 2.2, -1]];
const ELE_LEN = lengthOf(ELE_PATH);
export const elephantAt = (i: number, t: number) => {
  const k = beatK('elephants', t);
  if (k < 0 || k > 0.62) return null;
  const d = smooth(Math.min(1, k / 0.55)) * ELE_LEN - i * 2.4;
  const p = along(ELE_PATH, Math.max(0, d));
  return {x: p.x, z: p.z, rot: p.rot, step: Math.sin(t * 5 + i)};
};
const JUNK_START = 6; // distance down the river where it waits (beside the landing)
export const junkAt = (t: number) => {
  const k = beatK('elephants', t);
  if (k < 0 || k > 1.02) return null;
  const sail = Math.max(0, (k - 0.55) / 0.45);
  const p = along(DOWNSTREAM, JUNK_START + smooth(sail) * 9);
  return {x: p.x, z: p.z, rot: p.rot, sail};
};

// the prang: a file of monks and bearers carry the naga-sheltered Buddha in from the east
export const processionAt = (i: number, t: number) => {
  const k = beatK('prang', t);
  if (k < 0.35 || k > 1) return null;
  const u = smooth(Math.min(1, (k - 0.35) / 0.55));
  const x = lerp(PRANG[0] + 14, PRANG[0] + 3.0, u) + i * 0.9;
  return {x, z: PRANG[1] + 0.6 * Math.sin(i * 1.3) * 0.3, rot: -Math.PI / 2};
};

// Narai: the clay pipe from ทะเลชุบศร (off the tile to the east) to the palace fountains
export const PIPE: P[] = [PIPE_FROM, [30, -12], [16, -8], [SAN_PHRA_KAN[0] + 1.5, -2.6], [PALACE.x1 + 0.5, -1], [RECEPTION[0], RECEPTION[1]]];
export const PIPE_LEN = lengthOf(PIPE);
export const pipeK = (t: number) => Math.max(0, Math.min(1, (beatK('narai', t) - 0.25) / 0.6));

// 1685: the embassy's fleet comes up the river from the south to the palace landing
const UPSTREAM: P[] = [...DOWNSTREAM].reverse().slice(0, -2) as P[];
const PALACE_LANDING_D = lengthOf(UPSTREAM) - 0.5;
export const fleetAt = (i: number, t: number) => {
  const k = beatK('french', t);
  if (k < 0 || k > 1.05) return null;
  const d = PALACE_LANDING_D - 16 + smooth(Math.min(1, k / 0.7)) * 16 - i * 1.9;
  if (d < 0) return null;
  const p = along(UPSTREAM, d);
  return {x: p.x + (i % 2 ? 0.4 : -0.4), z: p.z, rot: p.rot, big: i === 0};
};

export const ACTORS: Actor[] = [
  // the cover: Hanuman on the whole tile, then landed beside the prang site
  {id: 'hanuman', role: 'hero', during: [0, LAND_T], size: 9, at: (t, ctx) => {
    const h = hanumanAt(t, gy(ctx, LAND[0], LAND[1]));
    return h ? [h.x, h.y + 6, h.z] : null;
  }},
  // the Dvaravati stupa rising, the boats on the river
  {id: 'stupa', during: [beatAt('lavo', 0.05), beatAt('lavo', 0.9)], size: 2, at: (t, ctx) => (ctx.Y < 830 ? [WAT_NAKHON_KOSA[0], 1.5, WAT_NAKHON_KOSA[1]] : null)},
  {id: 'troop', during: [LAND_T, beatAt('legend', 0.85)], size: 3.5, at: (t, ctx) => {
    const h = hanumanAt(t, gy(ctx, LAND[0], LAND[1]));
    return h ? [h.x, h.y + 4, h.z] : null;
  }},
  {id: 'lavoBoats', during: [beatAt('lavo', 0.1), beatAt('lavo', 0.9)], size: 1.6, at: (t, ctx) => {
    const b = lavoBoatAt(1, t, ctx.Y);
    return b ? [b.x, 0.3, b.z] : null;
  }},
  {id: 'elephants', during: [beatAt('elephants', 0.05), beatAt('elephants', 0.55)], size: 1.6, at: (t) => {
    const e = elephantAt(0, t);
    return e ? [e.x, 1.2, e.z] : null;
  }},
  {id: 'junk', during: [beatAt('elephants', 0.6), beatAt('elephants', 0.98)], size: 1.8, at: (t) => {
    const j = junkAt(t);
    return j ? [j.x, 0.8, j.z] : null;
  }},
  {id: 'procession', during: [beatAt('prang', 0.4), beatAt('prang', 0.95)], size: 1.6, at: (t) => {
    const p = processionAt(0, t);
    return p ? [p.x + 2, 0.8, p.z] : null;
  }},
  // the water reaching the palace and the fountains springing up
  {id: 'water', during: [beatAt('narai', 0.72), beatAt('narai', 0.98)], size: 2, at: () => [RECEPTION[0], 0.6, RECEPTION[1]]},
  {id: 'fleet', during: [beatAt('french', 0.05), beatAt('french', 0.75)], size: 1.6, at: (t) => {
    const f = fleetAt(0, t);
    return f ? [f.x, 0.5, f.z] : null;
  }},
  {id: 'monkeysMoveIn', during: [beatAt('fade', 0.2), beatAt('fade', 1)], size: 2.5, at: () => [PRANG[0], 1.5, PRANG[1]]},
  {id: 'cityGrowing', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 12, at: () => [8, 1.5, 0]},
  {id: 'hanumanReturns', role: 'callback', during: [RET[0] + 0.4, beatAt('payoff', 1)], size: 6, at: (t, ctx) => {
    const h = hanumanAt(t, gy(ctx, RET_LAND[0], RET_LAND[1]));
    return h ? [h.x, h.y + 5, h.z] : null;
  }},
];
