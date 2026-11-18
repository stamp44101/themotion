// Pure position math for Nong Khai's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {CARVE_END, carveFront, headK} from './Boat';
import {BAN_PHAI, BOAT_AT, BOAT_S, BRIDGE, OLD_STATION, PRAPHO, RAIL, SALA_KAEW_KU, THAT, WAT_PHO_CHAI} from './places';
import {STORY} from './timeline';

export type P = [number, number];
export {carveFront, headK, CARVE_END};
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

// ------------------------------------------------------------------ the cover: the long boat carved on the bank
/** the boat lies along the river (its bow to the east-north-east, downstream) */
export const BOAT_ROT = Math.atan2(4.9, -1.6);
/** it stands through the cover and folds away as the camera leaves for Ban Phai (gone by 4.3 s) */
export const coverK = (t: number) => 1 - smooth((t - 3.4) / 0.9);
/** where the adze is, in world space (the carving front along the hull) */
export const adzeAt = (t: number): P => {
  const u = carveFront(t) - 0.5;
  return [BOAT_AT[0] + Math.sin(BOAT_ROT) * u * BOAT_S, BOAT_AT[1] + Math.cos(BOAT_ROT) * u * BOAT_S];
};

// ------------------------------------------------------------------ settle: carts and walkers come up to the bank at Ban Phai
export const SETTLE_PATH: P[] = [[13.4, 22.0], [12.4, 15.0], [11.0, 9.0], [9.6, 3.4], [8.6, -1.0], [7.8, -3.6]];
export const CARTS = 3;
export const WALKERS = 10;
const SETTLE_L = lengthOf(SETTLE_PATH);
export const cartAt = (i: number, t: number) => {
  const k = beatK('settle', t);
  if (k < -0.15 || t > STORY.at('found')[0] + 0.8) return null;
  const d = lerp(SETTLE_L * 0.38, SETTLE_L - 0.2, smooth((k + 0.1) / 0.85)) - i * 2.4;
  return along(SETTLE_PATH, d);
};
export const walkerAt = (i: number, t: number) => {
  const p = cartAt(Math.floor(i / 4), t);
  if (!p) return null;
  const s = i % 2 ? 1 : -1;
  return {x: p.x + s * (0.55 + (i % 3) * 0.12), z: p.z + 0.6 + (i % 4) * 0.45, rot: p.rot};
};
/** Ban Phai's first stilt houses on the bank, going up as the carts stop */
export const FOUND_HOUSES: P[] = [[5.6, -3.4], [8.8, -4.4], [10.6, -5.4], [6.4, -1.6], [3.8, -2.6], [11.8, -3.8], [9.2, -2.0]];
export const foundHouseK = (j: number, t: number, Y: number) => (Y > 1828 ? 1 : smooth((beatK('settle', t) - 0.45 - j * 0.06) / 0.18));

// ------------------------------------------------------------------ found: the governor's boat Kham Yat along the town front
export const KHAMYAT_PATH: P[] = [[13.6, -11.0], [12.4, -10.4], [7.3, -8.8], [2.4, -7.2], [-2.7, -5.4], [-5.0, -4.7]];
const KHAMYAT_L = lengthOf(KHAMYAT_PATH);
export const KHAMYAT_LEN = 4.4;
/** the boat paddles upstream (west) against the current across the beat */
export const khamyatAt = (t: number) => {
  const k = beatK('found', t);
  if (k < -0.1 || k > 1.1) return null;
  return along(KHAMYAT_PATH, lerp(0.2, KHAMYAT_L - 0.2, clamp01((k + 0.05) / 1.05)));
};
/** the people of the new town along the bank, cheering the boat */
export const BANK_CROWD: P[] = Array.from({length: 16}, (_, i) => {
  const x = -1.6 + i * 0.85;
  // just inland of the bank (the bank runs from (-2.7,-3.7) to (12.4,-8.9))
  const zb = -3.7 + ((x + 2.7) / 15.1) * (-8.9 + 3.7);
  return [x, zb + 1.0 + (i % 3) * 0.35] as P;
});

// ------------------------------------------------------------------ sink: the bank slumps and the stupa falls into the river
/** the spit of bank under the stupa: 1 standing, 0 gone under the water */
export const spitK = (t: number, Y: number) => (Y < 1846 ? 1 : Y > 1848 ? 0 : 1 - smooth((beatK('sink', t) - 0.12) / 0.45));
/** the stupa's fall: 0 upright on the bank, 1 leaning in the river, half under */
export const fallK = (t: number, Y: number) => (Y < 1846 ? 0 : Y > 1848 ? 1 : smooth((beatK('sink', t) - 0.32) / 0.42));
export const WATCHERS: P[] = [[23.2, -14.0], [24.0, -14.6], [22.4, -13.4], [24.8, -15.2], [21.6, -12.8], [25.6, -15.6]];

// ------------------------------------------------------------------ prasai: two carts leave Wat Pho Chai; Phra Sai's breaks
/** the sim drawn 0.9 NW of the pin, between the bank road and the river (the wat's compound lies north of the road) */
export const SIM_AT: P = [17.0, -5.9];
/** the sim's long axis along the bank road */
export const SIM_ROT = Math.atan2(4.3, -2.6);
/** Wat Pho Chai's sim stands from the years after 2382 (raised between the found and sink beats, off camera) */
export const simK = (Y: number) => (Y < 1835 ? 0 : 1);
export const CART_PATH: P[] = [[WAT_PHO_CHAI[0] - 0.2, WAT_PHO_CHAI[1] - 2.0], [16.4, -7.6], [14.4, -6.8], [11.5, -5.0], [8.7, -3.8], [5.1, -2.4], [1.8, -0.8]];
const CART_L = lengthOf(CART_PATH);
/** Phra Serm's cart rolls on west and out of the shot */
export const sermAt = (t: number) => {
  const k = beatK('prasai', t);
  if (k < 0 || k > 1.05) return null;
  return along(CART_PATH, smooth(k / 1.0) * CART_L * 0.95);
};
/** Phra Sai's cart follows; its wheel breaks at BREAK and it stops */
export const BREAK = 0.42;
export const saiCartAt = (t: number) => {
  const k = beatK('prasai', t);
  if (k < 0 || k > 1.05) return null;
  const d = smooth(Math.min(k, BREAK) / 1.0) * CART_L * 0.95 - 1.5;
  return along(CART_PATH, Math.max(0, d));
};
export const brokenK = (t: number) => smooth((beatK('prasai', t) - BREAK) / 0.08);
/** Phra Sai carried back to the sim on a palanquin after the break */
export const saiCarryAt = (t: number) => {
  const k = beatK('prasai', t);
  if (k < BREAK + 0.12 || k > 0.92) return null;
  const c = saiCartAt(STORY.at('prasai')[0] + BREAK * (STORY.at('prasai')[1] - STORY.at('prasai')[0]));
  if (!c) return null;
  const u = smooth((k - BREAK - 0.12) / 0.32);
  return {x: lerp(c.x, SIM_AT[0] - 0.2, u), z: lerp(c.z, SIM_AT[1] - 1.0, u), rot: Math.atan2(SIM_AT[0] - c.x, SIM_AT[1] - c.z)};
};
/** Phra Sai is back in the sim from the end of the carry */
export const saiHomeK = (t: number, Y: number) => (Y > 1857 ? 1 : smooth((beatK('prasai', t) - 0.86) / 0.06));

// ------------------------------------------------------------------ haw: the army gathers, marches to the bank and crosses
export const CAMP: P = [-1.2, 7.0];
export const COLUMNS = 3;
export const RANKS = 8;
/** soldier (c, r): from the camp north to the bank, then into the boats */
export const soldierAt = (c: number, r: number, t: number) => {
  const k = beatK('haw', t);
  if (k < -0.05 || k > 0.62) return null;
  const x = CAMP[0] - 0.9 + c * 0.9;
  const z0 = CAMP[1] + 1.0 + r * 0.55;
  const z1 = -2.4 + r * 0.55;
  const u = smooth((k + 0.05) / 0.5);
  const z = lerp(z0, z1, u);
  // the front ranks go into the boats as they reach the bank
  if (k > 0.4 + r * 0.025) return null;
  return {x, z, rot: Math.PI};
};
/** the army's boats, from the bank to the Lao bank and back */
export const HAW_BOATS = 4;
export const hawBoatAt = (i: number, t: number) => {
  const k = beatK('haw', t);
  const k0 = 0.36 + i * 0.05;
  if (k < k0 || k > 1.02) return null;
  const u = smooth((k - k0) / 0.5);
  const x = -3.2 + i * 1.3;
  // the bank (-3.7 at x -2.7 to -5.6 at x 2.4) and the far bank (-9.9 to -11.3)
  const zs = -3.7 + ((x + 2.7) / 5.1) * -1.9 - 0.7;
  const zn = -9.9 + ((x + 2.7) / 5.1) * -1.4 + 1.2;
  return {x: x - u * 0.8, z: lerp(zs, zn, u), rot: Math.PI};
};
/** the monument rises at the end of the beat and stands after */
export const monumentK = (t: number, Y: number) => (Y > 1887 ? 1 : Y < 1885 ? 0 : smooth((beatK('haw', t) - 0.55) / 0.3));
export const TENTS: P[] = [[-3.4, 9.2], [-1.6, 10.0], [0.4, 9.4], [1.8, 10.6], [-3.0, 11.4], [-0.4, 11.8], [1.6, 12.6]];
export const tentsK = (t: number) => {
  const k = beatK('haw', t);
  return k < -0.2 || k > 1.1 ? 0 : 1;
};

// ------------------------------------------------------------------ rail: the train runs up to the old station
const RAIL_L = lengthOf(RAIL);
export const CARS = 6;
export const CAR_LEN = 1.1;
/** the engine's distance along the line; it parks at the platform */
export const trainD = (t: number) => {
  const k = beatK('rail', t);
  if (k < -0.1) return null;
  return lerp(RAIL_L * 0.35, RAIL_L - 0.6, smooth((k + 0.1) / 0.78));
};
export const trainAt = (car: number, t: number) => {
  const d = trainD(t);
  if (d === null) return null;
  if (t > STORY.at('grow')[0] + 0.5) return null;
  return along(RAIL, d - car * CAR_LEN);
};
export const stationK = (t: number, Y: number) => (Y > 1956 ? 1 : Y < 1954 ? 0 : smooth((beatK('rail', t) + 0.2) / 0.3));
export const railK = (Y: number) => (Y < 1954 ? 0 : 1);
/** the station building beside the track's end, on its south side (between the track and the bank road) */
export const STATION_AT: P = [-14.2, 1.75];
export const STATION_ROT = Math.atan2(2.7, -0.3);

// ------------------------------------------------------------------ grow: Sala Kaew Ku's statues rise in the east
export const STATUES: [number, number, number][] = [
  // x, z, height (units, drawn at legend scale so they read on the wide shot)
  [SALA_KAEW_KU[0], SALA_KAEW_KU[1], 2.6],
  [SALA_KAEW_KU[0] - 1.3, SALA_KAEW_KU[1] + 0.8, 1.6],
  [SALA_KAEW_KU[0] - 1.5, SALA_KAEW_KU[1] - 1.2, 1.4],
  [SALA_KAEW_KU[0] + 0.5, SALA_KAEW_KU[1] - 1.8, 1.2],
];
export const statueK = (j: number, t: number, Y: number) => (Y > 1994 ? 1 : Y < 1955 ? 0 : smooth((beatK('grow', t) - 0.35 - j * 0.1) / 0.25));

// ------------------------------------------------------------------ bridge: the spans reach out from both banks and meet
export const BRIDGE_LEN = Math.hypot(BRIDGE[1][0] - BRIDGE[0][0], BRIDGE[1][1] - BRIDGE[0][1]);
/** how far each half has reached, 0..1 (they meet at 1) */
export const spanK = (t: number, Y: number) => (Y > 1995 ? 1 : Y < 1993 ? 0 : smooth((beatK('bridge', t) + 0.15) / 0.6));
export const BRIDGE_CARS = 6;
export const bridgeCarAt = (i: number, t: number, Y: number) => {
  if (spanK(t, Y) < 1) return null;
  const k = Y > 1995 ? (t * 0.08 + i / BRIDGE_CARS) % 1 : (beatK('bridge', t) - 0.6) * 1.6 + i / BRIDGE_CARS - 0.4;
  if (Y <= 1995 && (k < 0 || k > 1)) return null;
  const dir = i % 2 ? 1 : -1;
  const u = dir > 0 ? k : 1 - k;
  const [a, b] = BRIDGE;
  const side = dir * 0.16;
  const nx = -(b[1] - a[1]) / BRIDGE_LEN;
  const nz = (b[0] - a[0]) / BRIDGE_LEN;
  return {x: lerp(a[0], b[0], u) + nx * side, z: lerp(a[1], b[1], u) + nz * side, rot: Math.atan2(b[0] - a[0], b[1] - a[1]) + (dir > 0 ? 0 : Math.PI)};
};

// ------------------------------------------------------------------ race: naga boats race off Tha Sadet; fireballs rise
export const RACE_LANES = 4;
export const RACE_BOAT_LEN = 3.2;
/** boat i's position: downstream to upstream (east to west) along the town front; boat 0 is the cover's gold naga, leading */
export const raceAt = (i: number, t: number) => {
  const k = beatK('race', t);
  if (k < -0.1 || k > 1.1) return null;
  const lane = (i - (RACE_LANES - 1) / 2) * 0.9;
  const speed = i === 0 ? 1 : 0.9 - i * 0.03;
  const u = clamp01((k + 0.1) * speed);
  // the course: from off Wat Pho Chai's reach west past Tha Sadet (the river between (-2.7,-3.7)-(12.4,-8.9) on the bank
  // and (-2.7,-9.9)-(12.4,-17.1) on the far side); lanes run parallel, 2-3.6 units off the Thai bank
  const x = lerp(6.0, -4.0, u);
  const zb = -3.7 + ((x + 2.7) / 15.1) * -5.2;
  return {x, z: zb - 2.0 - lane * 0.9 - 0.9, rot: Math.atan2(-15.1, 5.2)};
};
export const raceCrowdK = (t: number, Y: number) => (Y < 2010 ? 0 : 1);
/** the naga fireballs: red balls rising silently from the river at the end of the race */
export const FIREBALLS = 7;
export const fireballAt = (i: number, t: number) => {
  const k = beatK('race', t);
  const k0 = 0.45 + (i % 4) * 0.1 + Math.floor(i / 4) * 0.05;
  if (k < k0 || k > k0 + 0.45) return null;
  const u = (k - k0) / 0.45;
  return {x: -6 + i * 2.4, y: 0.3 + u * 7.5, z: -9.6 - i * 0.55 - (i > 3 ? 1.2 : 0), u};
};

export const ACTORS: Actor[] = [
  {id: 'boat', role: 'hero', during: [0, 3.0], size: BOAT_S * 0.4, at: () => [BOAT_AT[0], BOAT_S * 0.05, BOAT_AT[1]]},
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `cart${i}`,
    during: [4.4, 8.4],
    size: 0.9,
    minInFrame: 0.6,
    at: (t) => {
      const p = cartAt(i, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  })),
  {
    id: 'khamyat',
    during: [8.8, 14.4],
    size: KHAMYAT_LEN,
    minInFrame: 0.7,
    at: (t) => {
      const p = khamyatAt(t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  },
  {id: 'stupa', during: [15.4, 20.2], size: 1.6, at: () => [THAT[0], 0.8, THAT[1]]},
  {
    id: 'saicart',
    during: [21.2, 25.6],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = saiCarryAt(t) ?? saiCartAt(t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  },
  {
    id: 'army',
    during: [26.4, 29.0],
    size: 2.2,
    minInFrame: 0.6,
    at: (t) => {
      const p = soldierAt(1, 3, t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  },
  {
    id: 'hawboats',
    during: [29.0, 31.8],
    size: 1.6,
    at: (t) => {
      const p = hawBoatAt(1, t);
      return p ? [p.x, 0.3, p.z] : null;
    },
  },
  {
    id: 'train',
    during: [32.4, 37.2],
    size: 3.0,
    minInFrame: 0.7,
    at: (t) => {
      const p = trainAt(0, t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  },
  // the grow shot: the town spreads along the bank (the sprawl, registered as what is being built)
  {id: 'sprawl', during: [38.0, 44.2], size: 14, at: () => [8, 0.5, 2]},
  {id: 'spans', during: [44.8, 49.8], size: 3.0, at: () => [(BRIDGE[0][0] + BRIDGE[1][0]) / 2, 1.0, (BRIDGE[0][1] + BRIDGE[1][1]) / 2]},
  {
    id: 'nagaboat-back',
    role: 'callback',
    during: [50.2, 54.4],
    size: RACE_BOAT_LEN,
    at: (t) => {
      const p = raceAt(0, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  },
];
export {OLD_STATION, PRAPHO, BAN_PHAI};
