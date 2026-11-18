// Pure position math for Trang's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {CLOCK, FIRST_RUBBER, HALL, KT_CORE, KT_PORT, KT_STATION, RAIL, RIVER, TR_STATION, TT_PARK} from './places';
import {STORY} from './timeline';
import {smooth} from './Hero';

type P = [number, number];
export {smooth};
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

// ------------------------------------------------------------------ the cover: the giant rubber tree (style frame A1)
export const HERO_AT: P = [-9.0, 30.0];
export const HERO_S = 60;
export const HERO_ROT = 0.5;
/** the tree stands through the cover and sinks away as the camera leaves for the estuary (gone by 4.4 s) */
export const heroK = (t: number) => 1 - smooth((t - 3.4) / 1.0);

// ------------------------------------------------------------------ junks: Penang junks sail in from the sea to the bank
/** the estuary's channel from the sea up to where Kantang will stand (every point checked inside the water) */
export const JUNK_PATH: P[] = [
  [-28.5, 64.6], [-29.0, 60.0], [-30.0, 56.0], [-31.0, 53.6], [-29.6, 51.2], [-29.5, 49.0], [-29.5, 46.4],
  [-31.0, 45.6], [-32.0, 44.6], [-32.0, 43.6], [-31.6, 42.6], [-31.3, 41.8], [-30.6, 40.6], [-29.8, 39.6],
];
const JUNK_L = lengthOf(JUNK_PATH);
export const JUNKS = 3;
/** the junks come in on the tide: fast while the camera is on them, and stop off the bank */
export const junkAt = (i: number, t: number) => {
  const k = beatK('junks', t);
  if (k < -0.1 || k > 1.05) return null;
  const d = lerp(JUNK_L * 0.2, JUNK_L - 0.2, smooth((k + 0.08) / 0.92)) - i * 3.4;
  return along(JUNK_PATH, Math.max(0, d));
};

// ------------------------------------------------------------------ ratsada: the governor's boats come down to Kantang
/** the last reach of the river and the upper estuary down to the landing by the port */
export const BOAT_PATH: P[] = [
  ...RIVER.slice(-9),
  [-28.9, 33.6], [-28.5, 34.4], [-28.6, 35.6], [-28.8, 36.8], [-29.1, 37.6], [-29.4, 38.4],
];
const BOAT_L = lengthOf(BOAT_PATH);
export const BOATS = 5;
export const boatAt = (i: number, t: number) => {
  const k = beatK('ratsada', t);
  if (k < -0.05 || k > 1.05) return null;
  const d = lerp(BOAT_L * 0.15, BOAT_L - 0.1, smooth((k + 0.05) / 0.6)) - i * 2.6;
  return along(BOAT_PATH, Math.max(0, d));
};
/** the household walks up from the landing into the new town */
const LANDING_WALK: P[] = [[-28.4, 37.9], [-27.6, 37.8], [-26.8, 37.5], [-26.0, 37.0]];
export const WALKERS = 10;
export const walkerAt = (i: number, t: number) => {
  const k = beatK('ratsada', t);
  if (k < 0.5 || k > 1.05) return null;
  const d = smooth((k - 0.5 - (i % 5) * 0.05) / 0.4) * lengthOf(LANDING_WALK) - Math.floor(i / 5) * 0.4;
  if (d < 0) return null;
  const p = along(LANDING_WALK, d);
  return {x: p.x + (i % 2 ? 0.18 : -0.18), z: p.z + (i % 3) * 0.12, rot: p.rot};
};
/** Kantang's first shophouse rows (on the quay street and along ถนนตรังคภูมิ), [x, z, rotY] */
export const SHOPHOUSES: [number, number, number][] = [
  [-27.5, 36.5, 0], [-27.5, 37.3, 0], [-27.6, 40.1, 0], [-27.7, 40.9, 0], [-27.8, 41.7, 0],
  [-26.5, 40.2, 1.57], [-25.7, 40.3, 1.57], [-24.5, 40.0, 1.25],
];
export const shopK = (j: number, t: number, Y: number) => (Y > 1892 ? 1 : smooth((beatK('ratsada', t) - 0.45 - j * 0.05) / 0.2));
/** the quay along the bank by the port */
export const QUAY: [P, P] = [[-27.85, 36.1], [-28.35, 40.9]];

// ------------------------------------------------------------------ rubber: the first seedlings planted in rows east of Kantang
/** the first plot (timeline.ts repeats it for the callout) */
export const PLOT_C: P = [FIRST_RUBBER[0] + 3.0, FIRST_RUBBER[1] + 3.5];
export const PLOT_ROWS = 5;
export const PLOT_COLS = 7;
export const seedAt = (r: number, c: number): P => [PLOT_C[0] + (c - (PLOT_COLS - 1) / 2) * 0.8, PLOT_C[1] + (r - (PLOT_ROWS - 1) / 2) * 0.8];
/** each seedling is planted in turn through the first half of the beat, then they all grow */
export const seedK = (r: number, c: number, t: number, Y: number) => {
  if (Y > 1907) return 1;
  const k = beatK('rubber', t);
  const n = r * PLOT_COLS + c;
  const planted = smooth((k - 0.05 - (n / (PLOT_ROWS * PLOT_COLS)) * 0.45) / 0.05);
  return planted * (0.18 + 0.82 * smooth((k - 0.55) / 0.4));
};
export const PLANTERS = 6;
export const planterAt = (i: number, t: number): P | null => {
  const k = beatK('rubber', t);
  if (k < -0.02 || k > 0.62) return null;
  const n = Math.min(PLOT_ROWS * PLOT_COLS - 1, Math.floor(clamp01((k - 0.05) / 0.45) * PLOT_ROWS * PLOT_COLS) + i * 2);
  const [x, z] = seedAt(Math.floor(n / PLOT_COLS), n % PLOT_COLS);
  return [x + 0.3, z + 0.25];
};
/** the rubber gardens spreading over the land (Landmarks draws them; occupancy keeps them clear): [x, z, w, d, year] */
export const GARDENS: [number, number, number, number, number][] = [
  [PLOT_C[0], PLOT_C[1], 5.6, 4.0, 1891],
  [-22.5, 49.5, 5.5, 4.5, 1898],
  [-9.0, 43.5, 5.5, 4.5, 1925],
  [-33.0, 36.0, 5.5, 4.5, 1935],
  [-13.5, 51.0, 5.5, 4.5, 1940],
  [-27.0, 25.5, 5.5, 4.5, 1950],
  [-18.0, 58.5, 5.5, 4.5, 1958],
  [-4.5, 51.0, 5.5, 4.5, 1962],
  [0.0, 42.0, 5.5, 4.5, 1968],
  [-9.0, 58.5, 5.5, 4.5, 1972],
  [4.5, 31.5, 5.5, 4.5, 1978],
  [4.5, 49.5, 5.5, 4.5, 1984],
  [0.0, 58.5, 5.5, 4.5, 1988],
];

// ------------------------------------------------------------------ train: the line laid to the wharf, the first train pulls in
/** the line from the wharf (a 500 m spur past the station) out along the Kantang branch to Trang station */
export const KT_SPUR: P = [-27.9, 39.25];
const trIdx = (() => {
  let best = 0;
  let bd = Infinity;
  RAIL.forEach(([x, z], i) => {
    const d = Math.hypot(x - TR_STATION[0], z - TR_STATION[1]);
    if (d < bd) {
      bd = d;
      best = i;
    }
  });
  return best;
})();
/** Kantang -> Trang station */
export const LINE: P[] = [KT_SPUR, ...RAIL.slice(0, trIdx + 1)];
export const LINE_L = lengthOf(LINE);
/** the stretch of the line the first train runs in on (from 26 units out to the stop at the station) */
const STOP_D = 2.0;
/** the track grows out from the wharf over the first 40% of the train beat */
export const trackK = (t: number, Y: number) => (Y > 1914 ? 1 : Y < 1912 ? 0 : smooth(beatK('train', t) / 0.4));
export const firstTrainAt = (t: number) => {
  const k = beatK('train', t);
  if (k < 0.3 || k > 1.05) return null;
  const e = 1 - (1 - clamp01((k - 0.3) / 0.55)) ** 2;
  const p = along(LINE, lerp(30, STOP_D, e));
  return {...p, rot: p.rot + Math.PI};
};
export const KT_STATION_AT: P = [-24.0, 39.85];
export const stationK = (t: number, Y: number) => (Y > 1914 ? 1 : Y < 1912 ? 0 : smooth((beatK('train', t) - 0.15) / 0.2));
/** porters carry sacks from the train to the steamer at the quay */
export const PORTERS = 6;
export const porterAt = (i: number, t: number): P | null => {
  const k = beatK('train', t);
  if (k < 0.82 || k > 1.08) return null;
  const u = ((t * 0.7 + i / PORTERS) % 1 + 1) % 1;
  const back = u > 0.5;
  const s = back ? 2 - u * 2 : u * 2;
  return [lerp(-26.1, -28, s), lerp(38.9, 38.6, s) + (i % 3) * 0.25 - 0.25];
};
export const STEAMER_AT: P = [-29.25, 38.9];

// ------------------------------------------------------------------ move: Kantang floods; the offices go up the line
/** the flood over Kantang's low streets: up in the first third of the beat, down by the half */
export const floodK = (t: number) => {
  const k = beatK('move', t);
  return smooth(k / 0.2) * (1 - smooth((k - 0.4) / 0.2));
};
export const FLOOD = KT_CORE;
/** the train carrying the offices runs the whole line, Kantang to Thap Thiang */
export const moveTrainAt = (t: number) => {
  const k = beatK('move', t);
  if (k < 0.3 || k > 1.02) return null;
  const e = smooth((k - 0.3) / 0.58);
  return along(LINE, lerp(STOP_D + 0.5, LINE_L - 1.2, e));
};
/** the provincial hall at Thap Thiang rises as the train pulls in (drawn 1.7 units N of its pin, clear of the streets) */
export const HALL_AT: P = [0.05, -2.55];
export const hallK = (t: number, Y: number) => (Y > 1918 ? 1 : Y < 1913 ? 0 : smooth((beatK('move', t) - 0.7) / 0.25));
export const TR_STATION_AT: P = [-3.5, 1.75];
export const trStationK = (Y: number) => smooth((Y - 1913.2) / 0.6);
/** the clock tower in the middle of town */
export const clockK = (t: number, Y: number) => (Y > 1996 ? 1 : smooth((beatK('grow', t) - 0.15) / 0.2));

// ------------------------------------------------------------------ sea: long-tails run out to Ko Libong; dugongs graze
/** Ko Libong drawn closer, on the south-west of the sea (timeline.ts repeats it for the callout) */
export const LIBONG: P = [-33.0, 63.2];
export const SEA_PATH: P[] = [[-29.5, 50.0], [-30.0, 53.6], [-30.5, 57.0], [-30.4, 60.0], [-29.8, 62.6], [-29.6, 64.8]];
export const LONGTAILS = 3;
export const longtailAt = (i: number, t: number) => {
  const k = beatK('sea', t);
  if (k < -0.05 || k > 1.05) return null;
  const d = smooth((k + 0.05 - i * 0.12) / 0.8) * (lengthOf(SEA_PATH) - 0.5);
  return along(SEA_PATH, Math.max(0, d));
};
export const DUGONG_AT: P = [-27.0, 62.6];

// ------------------------------------------------------------------ breakfast: the morning tables in the park, the tree back
/** the breakfast ground: open ground west of the station, clear of every street (the old town's blocks are too small at
 *  200 m/unit for tables and the tree) */
export const BREAKFAST_C: P = [-6.1, 2.0];
export const TABLES: P[] = Array.from({length: 9}, (_, i) => [BREAKFAST_C[0] - 0.2 + (i % 3) * 0.75, BREAKFAST_C[1] + 0.2 + Math.floor(i / 3) * 0.65]);
export const CALLBACK_AT: P = [BREAKFAST_C[0] - 0.6, BREAKFAST_C[1] - 1.5];
export const PORK_AT: P = [BREAKFAST_C[0] + 2.0, BREAKFAST_C[1] - 0.5];
export const CALLBACK_S = 7;
export const callbackK = (t: number) => smooth((beatK('breakfast', t) + 0.02) / 0.15);
export const breakfastK = (t: number, Y: number) => (Y < 2010 ? 0 : smooth((beatK('breakfast', t) + 0.1) / 0.2));
export const DINERS = 18;
export const dinerAt = (i: number): P => {
  const [x, z] = TABLES[i % TABLES.length];
  const s = i < TABLES.length ? -1 : 1;
  return [x + s * 0.28, z + 0.05];
};

// ------------------------------------------------------------------ the actors
export const ACTORS: Actor[] = [
  {id: 'tree', role: 'hero', during: [0, 3], size: HERO_S * 0.25, at: () => [HERO_AT[0], HERO_S * 0.35, HERO_AT[1]]},
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `junk${i}`,
    during: [3.8, 8.4],
    size: 1.2,
    minInFrame: 0.6,
    at: (t) => {
      const p = junkAt(i, t);
      return p ? [p.x, 0.8, p.z] : null;
    },
  })),
  {
    id: 'boats',
    during: [9.2, 12.6],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = boatAt(0, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  },
  {id: 'shophouses', during: [12.6, 14.8], size: 1.5, at: () => [-26.7, 0.5, 38.9]},
  {id: 'planting', during: [15.4, 20.6], size: 2.0, at: () => [PLOT_C[0], 0.4, PLOT_C[1]]},
  {
    id: 'first-train',
    during: [23, 26.4],
    size: 1.4,
    minInFrame: 0.7,
    at: (t) => {
      const p = firstTrainAt(t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  },
  {id: 'flood', during: [27.4, 29.6], size: 3.0, at: () => [-26.1, 0.3, 39.1]},
  {
    id: 'move-train',
    during: [29, 32.6],
    size: 2.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = moveTrainAt(t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  },
  {id: 'hall', during: [31.4, 33], size: 1.5, at: () => [HALL[0], 0.6, HALL[1]]},
  // the grow shot: Thap Thiang builds out over the paddies (the sprawl, registered as what is being built)
  {id: 'sprawl', during: [33.6, 40.6], size: 12, at: () => [-1.2, 0.5, 4.2]},
  {
    id: 'longtails',
    during: [41.4, 45.6],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = longtailAt(0, t);
      return p ? [p.x, 0.3, p.z] : null;
    },
  },
  {id: 'tree-back', role: 'callback', during: [46.6, 54], size: CALLBACK_S * 0.25, at: () => [CALLBACK_AT[0], CALLBACK_S * 0.35, CALLBACK_AT[1]]},
  {id: 'breakfast', during: [46.6, 54], size: 1.6, at: () => [BREAKFAST_C[0] + 0.55, 0.4, BREAKFAST_C[1] + 0.85]},
];
export {CLOCK, HALL, KT_PORT, TR_STATION, TT_PARK};
