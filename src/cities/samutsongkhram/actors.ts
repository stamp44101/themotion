// Pure position math for Samut Songkhram's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same
// functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {
  BANG_KUNG, DON_HOI_LOT, FORT, LANDING, MAEKLONG, MARKET_X, NET_AT, RAIL_Z, RAMA2, STATION, TRAY_AT, TRAY_S, WAT_PHET,
} from './places';
import {STORY, TRAINS} from './timeline';

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

// ------------------------------------------------------------------ the cover: the pla thu tray (style frame A1)
export const PACK_END = 2.1;
export const STEAM0 = 2.35;
export const RING_IN = 4;
export const RING_OUT = 9;
export const N_BASKETS = RING_IN + RING_OUT;
export const packAt = (k: number) =>
  k < N_BASKETS / 2 ? -1 + k * 0.05 : 0.1 + ((k - N_BASKETS / 2) / (N_BASKETS / 2 - 1)) * (PACK_END - 0.3);
/** the tray stands through the catch (it steams while the boats bring the fish in) and is gone once the camera leaves */
export const trayK = (t: number) => 1 - smooth((t - 4.2) / 0.8);
export const TRAY_R = TRAY_S * 0.5;
export const basketAt = (k: number): P => {
  const inner = k < RING_IN;
  const n = inner ? RING_IN : RING_OUT;
  const j = inner ? k : k - RING_IN;
  const r = inner ? TRAY_R * 0.34 : TRAY_R * 0.74;
  const a = (j / n) * Math.PI * 2 + (inner ? 0.3 : 0);
  return [Math.cos(a) * r, Math.sin(a) * r];
};

// ------------------------------------------------------------------ the catch: boats drag a net; fish and a Buddha
export const CATCH_BOATS = 3;
/** the boats close in round the net (they stop in the channel, mid-estuary) */
export const catchBoatAt = (i: number, t: number): {x: number; z: number; rot: number} | null => {
  const k = beatK('catch', t);
  if (k < -0.1 || k > 1.1) return null;
  // two boats either side of the net along the channel, one across it (the estuary runs ESE, unit U)
  const U: P = [0.894, 0.447];
  const r = lerp(5.0, 2.4, smooth(k / 0.35));
  const [dx, dz] = i === 0 ? [-U[0] * r, -U[1] * r] : i === 1 ? [U[0] * r, U[1] * r] : [-U[1] * r * 0.5, U[0] * r * 0.5];
  return {x: NET_AT[0] + dx, z: NET_AT[1] + dz, rot: i === 2 ? Math.atan2(U[0], U[1]) + Math.PI / 2 : Math.atan2(U[0], U[1])};
};
/** the net comes up (0 under water, 1 hauled up) */
export const netK = (t: number) => smooth((t - 4.6) / 1.2);
/** the Buddha rises out of the net, gilded, and stands on the raft of boats */
export const buddhaK = (t: number) => smooth((t - 5.8) / 1.1) * (1 - smooth((t - 9.6) / 0.5));
export const BUDDHA_H = 4.2;

// ------------------------------------------------------------------ the battle at Bang Kung
/** the Burmese boats come down the river from the north, are met, and turn back */
const DOWN: P[] = MAEKLONG.slice(0, 3);
const UP: P[] = [MAEKLONG[4], MAEKLONG[3], MAEKLONG[2]];
export const BURMESE = 4;
export const THAI = 5;
export const burmeseAt = (i: number, t: number) => {
  const k = beatK('bangkung', t);
  if (k < -0.1 || k > 1.1) return null;
  const L = lengthOf(DOWN);
  const fwd = smooth((k + 0.1) / 0.5) * (L - 1.2 - i * 1.3);
  const back = smooth((k - 0.62) / 0.38) * 5;
  const p = along(DOWN, Math.max(0, fwd - back));
  return {...p, x: p.x + (i % 2 ? 0.45 : -0.45)};
};
export const thaiAt = (i: number, t: number) => {
  const k = beatK('bangkung', t);
  if (k < -0.1 || k > 1.1) return null;
  const L = lengthOf(UP);
  const d = smooth((k - 0.25) / 0.55) * (L - 2.2 - i * 1.2);
  if (d <= 0 && k < 0.25) return null;
  const p = along(UP, d);
  return {...p, x: p.x + (i % 2 ? 0.45 : -0.45)};
};
/** the camp's palisade and the old wat inside it (โบสถ์ในรากไม้: the bot later held by banyan roots) */
export const CAMP_R = 2.0;
/** cannon smoke over the water while the fleets are engaged */
export const gunK = (t: number) => {
  const k = beatK('bangkung', t);
  return smooth((k - 0.15) / 0.1) * (1 - smooth((k - 0.8) / 0.1));
};

// ------------------------------------------------------------------ the fort and Wat Ban Laem
export const watK = (t: number, Y: number) => (Y > 1771 ? 1 : smooth((beatK('fort', t) + 0.05) / 0.25));
export const fortK = (t: number, Y: number) => (Y > 1905 ? 1 : smooth((beatK('fort', t) - 0.12) / 0.3));
/** the riverside stilt houses, one after another through the fort beat */
export const RIVER_HOUSES: P[] = [
  [-3.6, 7.8], [-3.0, 8.8], [-2.4, 9.6], [-3.8, 1.6], [-3.2, 0.8], [-2.4, 0.2], [-1.6, 8.2], [-1.0, 7.2],
];
export const riverHouseK = (j: number, t: number, Y: number) => (Y > 1905 ? 1 : smooth((beatK('fort', t) - 0.3 - j * 0.06) / 0.16));

// ------------------------------------------------------------------ the railway: the station is the engine's; trains too
/** the engine's train: its loco's x at t (it comes in from the east and stops at the terminus; places.ts / index.ts span) */
export const RAIL_SPAN: [number, number] = [-5.4, 40];
export const trainNoseX = (i: number, t: number) => {
  const tr = TRAINS[i];
  if (!tr) return null;
  if (t < tr.t0 || t > tr.t0 + tr.dur + (tr.park ?? 0)) return null;
  const p = Math.min(1, (t - tr.t0) / tr.dur);
  const lo = RAIL_SPAN[0] + 3;
  const hi = RAIL_SPAN[1] + 6;
  return lerp(hi, lo, 1 - (1 - p) ** 2);
};

// ------------------------------------------------------------------ the market: boats at the landing, shophouses
const UPRIVER: P[] = [[-11.8, 17.2], [-8.4, 10.5], [-6.6, 6.0], [LANDING[0] - 0.9, LANDING[1] + 0.3]];
export const MARKET_BOATS = 3;
export const marketBoatAt = (i: number, t: number) => {
  const k = beatK('market', t);
  if (k < -0.1 || k > 1.15) return null;
  const L = lengthOf(UPRIVER);
  const d = lerp(L * 0.35 - 2.2 * i, L - 1.4 * i, smooth((k + 0.05) / 0.75));
  if (d < 0) return null;
  return along(UPRIVER, d);
};
/** shophouse rows behind the market stalls, north and south of the track */
export const SHOPS = Array.from({length: 10}, (_, j) => ({x: -3.0 + (j % 5) * 0.8, z: j < 5 ? RAIL_Z - 1.5 : RAIL_Z + 1.5}));
export const shopK = (j: number, t: number, Y: number) => (Y > 1967 ? 1 : smooth((beatK('market', t) - 0.15 - (j % 5) * 0.08) / 0.2));
/** the market stalls along the track (there from the market beat on), each with its awning */
export const STALLS = Array.from({length: 8}, (_, i) => MARKET_X[0] + ((i + 0.5) / 8) * (MARKET_X[1] - MARKET_X[0]));
export const stallK = (t: number, Y: number) => (Y > 1967 ? 1 : smooth((beatK('market', t) - 0.05) / 0.25));
/** an awning folds back as the payoff's train comes (its loco within ~2.5 units) and stays folded while the train is by it */
export const awningOpen = (x: number, t: number) => {
  const a = trainNoseX(1, t);
  if (a === null) return 1;
  return smooth((a - x - 1.0) / 1.6);
};

// ------------------------------------------------------------------ Rama II road: trucks over the new bridge
const BRIDGE_RUN: P[] = RAMA2.slice(3, 9);
export const TRUCKS = 4;
export const truckAt = (i: number, t: number) => {
  const k = beatK('road', t);
  if (k < 0.15 || k > 1.15) return null;
  const L = lengthOf(BRIDGE_RUN);
  const d = lerp(L * 0.05 - 2.6 * i, L * 0.85 - 2.6 * i, smooth((k - 0.15) / 0.95));
  if (d < 0) return null;
  return along(BRIDGE_RUN, d);
};

// ------------------------------------------------------------------ Don Hoi Lot: people digging razor clams on the flat
export const DIGGERS = 10;
export const diggerAt = (i: number): P => [DON_HOI_LOT[0] - 3 + (i % 5) * 1.3, DON_HOI_LOT[1] - 2.4 - Math.floor(i / 5) * 1.2];
export const diggersK = (t: number, Y: number) => (Y < 2000 ? 0 : smooth((beatK('grow', t) - 0.1) / 0.2));

export const ACTORS: Actor[] = [
  {id: 'tray', role: 'hero', during: [0, 3.0], size: TRAY_R, at: () => [TRAY_AT[0], 1, TRAY_AT[1]]},
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `catchboat${i}`,
    during: [4.6, 9.0],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = catchBoatAt(i, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  })),
  {id: 'buddha', during: [6.4, 9.0], size: 1.2, tall: BUDDHA_H, at: (t) => (buddhaK(t) > 0.3 ? [NET_AT[0], 0.6, NET_AT[1]] : null)},
  {id: 'camp', during: [10.8, 15.6], size: CAMP_R, at: () => [BANG_KUNG[0], 0.6, BANG_KUNG[1]]},
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `fleet${i}`,
    during: [12.0, 15.4],
    size: 1.0,
    minInFrame: 0.5,
    at: (t) => {
      const p = thaiAt(i, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  })),
  {id: 'fort', during: [18.4, 22.6], size: 1.4, at: (t, c) => (fortK(t, c.Y) > 0.05 ? [FORT[0], 0.5, FORT[1]] : null)},
  {id: 'wat', during: [17.2, 22.6], size: 1.0, at: (t, c) => (watK(t, c.Y) > 0.05 ? [WAT_PHET[0], 0.8, WAT_PHET[1]] : null)},
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `marketboat${i}`,
    during: i === 0 ? [30.4, 34.6] : [31.6, 34.6],
    size: 0.9,
    minInFrame: 0.6,
    at: (t) => {
      const p = marketBoatAt(i, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  })),
  {
    id: 'truck0',
    during: [36.6, 40.4],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = truckAt(0, t);
      return p ? [p.x, 0.8, p.z] : null;
    },
  },
  // the grow shot: the town builds out over the orchards towards the sea (the sprawl, registered as what is being built)
  {id: 'sprawl', during: [41.4, 47.8], size: 12, at: () => [6, 0.5, 10]},
  {id: 'plathu-back', role: 'callback', during: [49.0, 54.0], size: 1.6, at: () => [(MARKET_X[0] + MARKET_X[1]) / 2, 0.5, RAIL_Z + 0.9]},
];
export {STATION};
