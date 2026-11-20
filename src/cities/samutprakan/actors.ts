// Pure position math for Samut Prakan's moving things (src/engine/actors.ts); Hero.tsx and Landmarks.tsx draw from the same
// functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {AIRPORT, BANGPU, CHANNEL, CHEDI, CHULA, HERO_S, LANDING, NARAI, PHISUEA, PIER, PRAKHONCHAI, RUNWAY_ROT} from './places';
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

// ------------------------------------------------------------------ the cover: the giant chedi (style frame A)
export const COURSES = 16;
export const LAY_END = 1.8;
/** brick course k is laid at this time; the lower half is laid before frame 0 */
export const courseAt = (k: number) => (k < COURSES / 2 ? -1 : ((k - COURSES / 2 + 1) / (COURSES / 2)) * LAY_END);
/** the whitewash sweeps up after the last course */
export const washK = (t: number) => smooth((t - 1.75) / 0.55);
/** the spire shoots up: the chedi's shape changes from a stub to a tall spire (Rama IV made it taller) */
export const spireK = (t: number) => smooth((t - 2.0) / 0.75);
/** the bamboo scaffold stands while the bricks go up, then comes down */
export const scaffoldK = (t: number) => 1 - smooth((t - 1.85) / 0.4);
/** the giant sinks into its island as the camera dives for Pak Nam (gone by 3.8 s) */
export const heroK = (t: number) => 1 - smooth((t - 2.95) / 0.85);

// ------------------------------------------------------------------ build: Rama II's town, forts and the first chedi
/** forts rise: 0 Phi Suea Samut (west, on its island), 1 Prakhon Chai, 2 Narai Prap Suek (east bank) */
export const FORTS: P[] = [PHISUEA, PRAKHONCHAI, NARAI];
export const fortK = (j: number, t: number, Y: number) => (Y > 1828 ? 1 : Y < 1818.9 ? 0 : smooth((beatK('build', t) - 0.08 - j * 0.1) / 0.5));
/** the first chedi: 0 a bare island, 1 Rama III's chedi finished (early in the raise beat); Rama II leaves it half done */
export const chediAK = (t: number, Y: number) =>
  Y > 1835 ? 1 : Y < 1818.9 ? 0 : t < STORY.at('raise')[0] ? 0.12 + 0.5 * smooth(beatK('build', t) / 0.95) : 0.62 + 0.38 * smooth(beatK('raise', t) / 0.3);
/** Rama IV's larger chedi over it: 0 the old one, 1 the tall one */
export const chediBK = (t: number, Y: number) => (Y > 1868 ? 1 : Y < 1828 ? 0 : smooth((beatK('raise', t) - 0.32) / 0.58));
/** the city pillar's shrine (2365 by one source) stands near the end of the build beat */
export const shrineK = (t: number, Y: number) => (Y > 1828 ? 1 : Y < 1818.9 ? 0 : smooth((beatK('build', t) - 0.72) / 0.15));
/** brick carriers on the east bank: from the kiln yard to the two forts and back */
export const KILN: P = [2.2, -1.6];
export const CARRIERS = 8;
export const carrierAt = (i: number, t: number) => {
  const k = beatK('build', t);
  if (k < -0.05 || k > 1.05) return null;
  const to = i % 2 ? PRAKHONCHAI : NARAI;
  const u = ((t * 0.32 + i * 0.37) % 1 + 1) % 1;
  const back = u > 0.5;
  const s = back ? (1 - u) * 2 : u * 2;
  const x = lerp(KILN[0], to[0] + 0.9, s) + ((i % 3) - 1) * 0.25;
  const z = lerp(KILN[1], to[1], s) + ((i % 4) - 1.5) * 0.15;
  return {x, z, rot: Math.atan2(to[0] - KILN[0], to[1] - KILN[1]) + (back ? Math.PI : 0), load: !back};
};
/** brick boats ferrying across from the east bank to the island's landing */
export const FERRIES = 2;
const FERRY_A: P = [-1.9, -3.4];
const FERRY_B: P = [-5.5, -4.6];
export const ferryAt = (i: number, t: number) => {
  const k = beatK('build', t);
  if (k < -0.1 || k > 1.1) return null;
  const u = ((t * 0.22 + i * 0.5) % 1 + 1) % 1;
  const s = smooth(u < 0.5 ? u * 2 : (1 - u) * 2);
  const off = i ? 1.6 : 0;
  return {x: lerp(FERRY_A[0], FERRY_B[0], s), z: lerp(FERRY_A[1], FERRY_B[1], s) - off, rot: Math.atan2(FERRY_B[0] - FERRY_A[0], FERRY_B[1] - FERRY_A[1]) + (u < 0.5 ? 0 : Math.PI)};
};
/** the island's builders: round the chedi while it rises */
export const BUILDERS = 6;
export const builderAt = (i: number, t: number): P | null => {
  const inBuild = beatK('build', t) > -0.05 && beatK('build', t) < 1;
  const inRaise = beatK('raise', t) > 0.25 && beatK('raise', t) < 0.95;
  if (!inBuild && !inRaise) return null;
  const a = (i / BUILDERS) * Math.PI * 2 + t * 0.5;
  return [CHEDI[0] + Math.cos(a) * 1.25, CHEDI[1] + Math.sin(a) * 1.1];
};

// ------------------------------------------------------------------ raise: the relic barges come down to the island
export const BARGE_PATH: P[] = [[-17.0, -12.6], [-10.0, -12.4], [-6.8, -11.2], [-4.6, -9.0], [-4.0, -7.0], [-4.5, -5.7]];
const BARGE_L = lengthOf(BARGE_PATH);
export const BARGES = 3;
/** the barges come down the river and stop at the island's landing, one behind the other, in the channel */
export const bargeAt = (i: number, t: number) => {
  const k = beatK('raise', t);
  if (k < -0.12 || k > 1.1) return null;
  const d = lerp(BARGE_L * 0.2, BARGE_L, smooth((k + 0.1) / 0.55)) - i * 2.4;
  return along(BARGE_PATH, d);
};
/** the relic is carried up from the landing to the chedi */
export const relicAt = (t: number) => {
  const k = beatK('raise', t);
  if (k < 0.45 || k > 0.75) return null;
  const u = smooth((k - 0.45) / 0.3);
  return {x: lerp(LANDING[0], CHEDI[0] + 0.9, u), z: lerp(LANDING[1], CHEDI[1] + 0.2, u)};
};

// ------------------------------------------------------------------ fort: Phra Chulachomklao fort rises at the mouth
export const chulaK = (t: number, Y: number) => (Y > 1893 ? 1 : Y < 1867.9 ? 0 : smooth((beatK('fort', t) - 0.05) / 0.6));
/** the seven gun pits along the fort's sea face */
export const GUNS: P[] = Array.from({length: 7}, (_, i) => [CHULA[0] + 1.3 + Math.sin(i * 0.5 - 1.5) * 0.4, CHULA[1] - 1.8 + i * 0.6]);
export const gunsK = (t: number, Y: number) => (Y > 1893 ? 1 : smooth((beatK('fort', t) - 0.55) / 0.35));
export const FORT_WORKERS = 8;
export const fortWorkerAt = (i: number, t: number): P | null => {
  const k = beatK('fort', t);
  if (k < 0 || k > 0.95) return null;
  const a = (i / FORT_WORKERS) * Math.PI * 2 + t * 0.35;
  return [CHULA[0] - 0.4 + Math.cos(a) * 2.0, CHULA[1] + Math.sin(a) * 2.4];
};

// ------------------------------------------------------------------ fight: Inconstant and Comète force the channel
const CHANNEL_L = lengthOf(CHANNEL);
export const shipAt = (i: number, t: number) => {
  const k = beatK('fight', t);
  if (k < -0.1 || k > 1.1) return null;
  const d = lerp(CHANNEL_L * 0.3, CHANNEL_L * 0.76, smooth((k + 0.05) / 1.05)) - i * 2.4;
  return along(CHANNEL, d);
};
/** the Siamese gunboats waiting off the fort (in the channel's west side) */
export const GUNBOATS: P[] = [[-1.6, 41.0], [-5.8, 35.6], [1.6, 46.4]];
/** a gun's flash: fort guns fire in turn from ~25% of the beat, the ships answer */
export const flash = (seed: number, t: number) => {
  const k = beatK('fight', t);
  if (k < 0.22 || k > 0.95) return 0;
  const ph = ((t * 1.3 + seed * 0.37) % 1 + 1) % 1;
  return ph < 0.18 ? 1 - ph / 0.18 : 0;
};
/** the disappearing guns rise to fire and drop back into their pits */
export const gunUp = (i: number, t: number) => {
  const k = beatK('fight', t);
  if (k < 0.15 || k > 0.98) return 0;
  const ph = ((t * 1.3 + i * 0.37 + 0.85) % 1 + 1) % 1;
  return ph < 0.55 ? smooth(ph / 0.2) : 1 - smooth((ph - 0.55) / 0.25);
};

// ------------------------------------------------------------------ resort: Bang Pu's pier
export const pierK = (t: number, Y: number) => (Y > 1941 ? 1 : Y < 1924 ? 0 : smooth((beatK('resort', t) - 0.1) / 0.45));
export const STROLLERS = 12;
export const strollerAt = (i: number, t: number) => {
  const pk = pierK(t, 0);
  const k = beatK('resort', t);
  if (pk < 0.6 || k > 1.1) return null;
  const L = PIER[1][1] - PIER[0][1];
  const u = ((t * 0.06 + i * 0.083) % 1 + 1) % 1;
  const s = u < 0.5 ? u * 2 : (1 - u) * 2;
  return {x: PIER[0][0] + (i % 2 ? 0.22 : -0.22), z: PIER[0][1] - 0.6 + s * (L * pk + 0.4), rot: u < 0.5 ? 0 : Math.PI};
};
export const BANGPU_PAVILION: P = [PIER[1][0], PIER[1][1] - 0.4];

// ------------------------------------------------------------------ grow: the channel silts, the island joins the bank
export const siltK = (Y: number) => smooth((Y - 1946) / 46);
/** the airport: the swamp is filled and the runways laid from ~2541 */
export const fillK = (Y: number) => smooth((Y - 1997) / 6);
export const terminalK = (Y: number) => smooth((Y - 2001.5) / 4);

// ------------------------------------------------------------------ airport: jets land and take off
const RD: P = [Math.sin(RUNWAY_ROT), -Math.cos(RUNWAY_ROT)]; // runway direction (north-north-east)
const RN: P = [Math.cos(RUNWAY_ROT), Math.sin(RUNWAY_ROT)]; // across the runways (east-south-east)
export const RUNWAY_L = 18;
export const RUNWAY_GAP = 4.4;
/** a point on runway r (-1 west, +1 east), u along it (-0.5 south end .. 0.5 north end), v across */
export const onRunway = (r: number, u: number, v = 0): P => [
  AIRPORT[0] + RN[0] * (r * RUNWAY_GAP + v) + RD[0] * u * RUNWAY_L,
  AIRPORT[1] + RN[1] * (r * RUNWAY_GAP + v) + RD[1] * u * RUNWAY_L,
];
export const JET_HEAD = Math.atan2(RD[0], RD[1]);
/** jet i: 0 lands on the west runway, 1 lands later on the east one, 2 takes off from the east one */
export const jetAt = (i: number, t: number, Y: number) => {
  if (Y < 2005.5) return null;
  const k = beatK('airport', t);
  const kf = beatK('fair', t);
  if (i === 0) {
    if (k < -0.1 || k > 0.75) return null;
    const u = smooth((k + 0.1) / 0.7);
    // from 16 units south of the threshold, 5 up, down to the touchdown point, then rolling out
    const s = lerp(-1.4, 0.15, u);
    const h = s < -0.42 ? 5.2 * clamp01((-0.42 - s) / 0.98) + 0.25 : 0.25;
    const [x, z] = onRunway(-1, s);
    return {x, y: h, z, rot: JET_HEAD, pitch: s < -0.42 ? 0.08 : 0};
  }
  if (i === 1) {
    if (k < 0.3 || kf > 0.2) return null;
    const u = smooth((k - 0.3) / 0.7);
    const s = lerp(-1.5, -0.2, u);
    const h = s < -0.42 ? 5.4 * clamp01((-0.42 - s) / 1.08) + 0.25 : 0.25;
    const [x, z] = onRunway(1, s);
    return {x, y: h, z, rot: JET_HEAD, pitch: s < -0.42 ? 0.08 : 0};
  }
  if (k < 0.05 || k > 1.05) return null;
  const u = clamp01((k - 0.05) / 0.9);
  const s = lerp(-0.45, 1.1, u * u);
  const h = s > 0.05 ? (s - 0.05) * 6.5 + 0.25 : 0.25;
  const [x, z] = onRunway(1, s, 0.2);
  return {x, y: h, z, rot: JET_HEAD, pitch: s > 0.05 ? -0.14 : 0};
};
export const TOWER: P = [AIRPORT[0] - 2.2, AIRPORT[1] + 3.0];
export const TOWER_H = 5.2;

// ------------------------------------------------------------------ fair: the red cloth comes by barge and goes on the bell
export const CLOTH_PATH: P[] = [[-2.0, -1.8], [-3.4, -3.4], [-4.6, -4.8], [-5.2, -5.3]];
const CLOTH_L = lengthOf(CLOTH_PATH);
export const clothBoatAt = (i: number, t: number) => {
  const k = beatK('fair', t);
  if (k < -0.1 || k > 1.1) return null;
  const d = lerp(0, CLOTH_L, smooth((k + 0.05) / 0.45)) - i * 1.2;
  return d < -0.3 ? null : along(CLOTH_PATH, Math.max(0, d));
};
/** the cloth carried from the landing to the chedi, then wound round the bell's neck */
export const clothCarryAt = (t: number) => {
  const k = beatK('fair', t);
  if (k < 0.4 || k > 0.62) return null;
  const u = smooth((k - 0.4) / 0.22);
  return {x: lerp(LANDING[0], CHEDI[0] + 0.8, u), z: lerp(LANDING[1], CHEDI[1] + 0.2, u)};
};
export const wrapK = (t: number, Y: number) => (Y < 2006.5 ? 0 : Y > 2025.7 ? 1 : smooth((beatK('fair', t) - 0.58) / 0.3));
export const fairK = (t: number, Y: number) => (Y < 2006.5 ? 0 : smooth((beatK('fair', t) + 0.15) / 0.25));
/** the crowd walking round the chedi (ทักษิณาวรรต, three times clockwise) */
export const PILGRIMS = 16;
export const pilgrimAt = (i: number, t: number): P => {
  const a = (i / PILGRIMS) * Math.PI * 2 - t * 0.45;
  return [CHEDI[0] + Math.cos(a) * 1.7, CHEDI[1] + Math.sin(a) * 1.5];
};

export const ACTORS: Actor[] = [
  {id: 'giant-chedi', role: 'hero', during: [0, 3.0], size: HERO_S * 0.22, at: () => [CHEDI[0], HERO_S * 0.32, CHEDI[1]]},
  {
    id: 'carriers',
    during: [4.4, 9.0],
    size: 1.2,
    at: (t) => {
      const p = carrierAt(1, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  },
  {
    id: 'ferry',
    during: [4.4, 9.2],
    size: 1.0,
    at: (t) => {
      const p = ferryAt(0, t);
      return p ? [p.x, 0.3, p.z] : null;
    },
  },
  {id: 'forts', during: [4.6, 9.0], size: 1.0, at: (t, c) => (fortK(0, t, c.Y) > 0.05 ? [PHISUEA[0], 0.5, PHISUEA[1]] : null)},
  {
    id: 'barges',
    during: [10.0, 14.6],
    size: 1.4,
    minInFrame: 0.7,
    at: (t) => {
      const p = bargeAt(0, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  },
  {id: 'chedi-rises', during: [12.0, 15.2], size: 1.2, tall: 3.0, at: () => [CHEDI[0], 1.0, CHEDI[1]]},
  {id: 'chula', during: [16.8, 20.4], size: 2.0, at: () => [CHULA[0], 0.5, CHULA[1]]},
  {
    id: 'ships',
    during: [21.6, 27.0],
    size: 1.4,
    minInFrame: 0.7,
    at: (t) => {
      const p = shipAt(0, t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  },
  {id: 'pier', during: [28.4, 33.2], size: 2.0, at: () => [PIER[0][0], 0.4, (PIER[0][1] + PIER[1][1]) / 2]},
  {id: 'resort', during: [28.4, 33.2], size: 1.4, at: () => [BANGPU[0], 0.5, BANGPU[1]]},
  // the grow shot: the delta fills with town (the sprawl, registered as what is being built)
  {id: 'sprawl', during: [34.4, 41.2], size: 14, at: () => [4, 0.5, -6]},
  {
    id: 'jet-landing',
    during: [42.2, 47.2],
    size: 1.6,
    minInFrame: 0.7,
    at: (t, c) => {
      const p = jetAt(0, t, c.Y) ?? jetAt(1, t, c.Y);
      return p ? [p.x, p.y, p.z] : null;
    },
  },
  {id: 'tower', during: [42.4, 48.0], size: 2.0, tall: TOWER_H, at: () => [TOWER[0], 0.5, TOWER[1]]},
  {
    id: 'cloth-boat',
    during: [49.0, 52.2],
    size: 1.0,
    at: (t) => {
      const p = clothBoatAt(0, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  },
  {id: 'red-cloth', role: 'callback', during: [49.2, 55.2], size: 1.4, tall: 3.0, at: () => [CHEDI[0], 1.6, CHEDI[1]]},
];
export {BANGPU};
