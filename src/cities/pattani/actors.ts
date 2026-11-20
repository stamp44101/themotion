// Pure position math for Pattani's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {
  ANCHORAGE, CANNON_AT, CANNON_S, CENTRAL_MOSQUE, CHABANG_TIGA, DECHA_BRIDGE, ISTANA, KRUESE, LANDING, PITS, RIVER,
  SHIP_IN, SHIP_OUT, SHRINE,
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

// ------------------------------------------------------------------ the cover: the giant cannon cast on the land
/** the bronze pours from the crucible into the mould's runner until POUR_END */
export const POUR_END = 1.4;
/** how much of the clay mould has been knocked off, breech to muzzle: half at frame 0, all by 2.6 s */
export const shellFront = (t: number) => 0.45 + 0.55 * smooth(t / 2.6);
/** the cover cannon stands through the title and sinks away as the camera leaves for Kru Se (gone by 4.2 s) */
export const coverK = (t: number) => 1 - smooth((t - 3.3) / 0.9);
/** the giant cannon comes back on the plain in the payoff (the callback) and stays to the end */
export const CALLBACK_T = 50.2;
export const callbackK = (t: number) => smooth((t - CALLBACK_T) / 1.4);
/** the cannon's centre (its barrel along x, muzzle to the east, toward Kru Se) */
export const COVER_C: P = CANNON_AT;
export {CANNON_S};

// ------------------------------------------------------------------ cast: three moulds poured at the pits by Kru Se
export const MOULDS: P[] = [[PITS[0] - 1.6, PITS[1]], [PITS[0], PITS[1] + 0.2], [PITS[0] + 1.6, PITS[1]]];
/** mould j is poured (glowing) then cools; the pour runs across the beat */
export const pourK = (j: number, t: number) => smooth((beatK('cast', t) - 0.12 - j * 0.22) / 0.2);
/** the moulds are broken off and the cannons lie bare by the end of the beat */
export const bareK = (t: number, Y: number) => (Y > 1598 ? 1 : smooth((beatK('cast', t) - 0.82) / 0.16));
export const SMITHS = 9;
export const smithAt = (i: number, t: number): P => {
  const j = i % 3;
  const a = (i / SMITHS) * Math.PI * 2 + Math.sin(t * 1.3 + i) * 0.25;
  return [MOULDS[j][0] + Math.cos(a) * 0.9, MOULDS[j][1] + Math.sin(a) * 0.7 + 0.2];
};
/** the master founder (หลิมโต๊ะเคี่ยม in the legend) by the furnace */
export const FOUNDER_AT: P = [PITS[0] - 2.9, PITS[1] - 0.6];
export const FURNACE_AT: P = [PITS[0] - 2.6, PITS[1] + 1.4];

// ------------------------------------------------------------------ haul: the big gun dragged on rollers into the palace
export const HAUL_PATH: P[] = [[PITS[0], PITS[1] - 0.4], [PITS[0] - 0.6, -0.8], [41.2, -3.0], [ISTANA[0] + 0.6, ISTANA[1] + 1.6]];
const HAUL_L = lengthOf(HAUL_PATH);
/** the cannon's place on the path (0 at the pits, stops at the palace gate) */
export const haulAt = (t: number, Y: number) => {
  if (Y > 1601.5) return along(HAUL_PATH, HAUL_L);
  return along(HAUL_PATH, smooth((beatK('haul', t) + 0.05) / 0.7) * HAUL_L);
};
export const HAULERS = 16;
/** the haulers walk ahead on two ropes; at the gate they stand back in a crowd */
export const haulerAt = (i: number, t: number, Y: number) => {
  const c = haulAt(t, Y);
  const k = beatK('haul', t);
  const d = smooth((k + 0.05) / 0.7) * HAUL_L + 1.0 + Math.floor(i / 2) * 0.32;
  const p = along(HAUL_PATH, Math.min(d, HAUL_L + 2.0));
  const s = i % 2 ? 1 : -1;
  const done = smooth((k - 0.72) / 0.15);
  const a = (i / HAULERS) * Math.PI + Math.PI * 0.1;
  const cx = c.x - Math.cos(a) * 1.6;
  const cz = c.z + 0.6 + Math.sin(a) * 0.9;
  return {x: lerp(p.x + s * 0.28 * Math.cos(p.rot), cx, done), z: lerp(p.z - s * 0.28 * Math.sin(p.rot), cz, done), rot: lerp(p.rot, 0, done)};
};
/** the test firing at the end of the beat: a puff of smoke from the muzzle toward the bay (no target, a salute) */
export const salute = (t: number) => {
  const k = beatK('haul', t);
  return k > 0.8 && k < 1.05 ? (k - 0.8) / 0.25 : -1;
};

// ------------------------------------------------------------------ port: the Dutch, Chinese, Japanese and English ships come in
export const SHIPS = 5;
const SHIP_IN_L = lengthOf(SHIP_IN);
/** ship i sails in round the spit's tip and anchors off Kru Se, each a little behind and beside the last */
export const shipAt = (i: number, t: number, Y: number) => {
  if (Y < 1600 || Y > 1604 || t > STORY.at('port')[1] + 0.2) return null;
  const k = beatK('port', t);
  const d = Y > 1602.6 ? SHIP_IN_L : smooth((k + 0.25 - i * 0.12) / 0.75) * SHIP_IN_L;
  const p = along(SHIP_IN, d - i * 1.1);
  const off = (i - 2) * 1.6;
  const fin = clamp01(d / SHIP_IN_L);
  return {x: p.x + off * 0.6 * fin, z: p.z - off * 0.45 * fin, rot: p.rot};
};
export const PORTERS = 10;
/** porters carry bales from the landing up to the palace market and back */
export const porterAt = (i: number, t: number): P => {
  const u = (t * 0.22 + i / PORTERS) % 1;
  const s = u < 0.5 ? u * 2 : 2 - u * 2;
  return [lerp(LANDING[0] + (i % 3) * 0.3, ISTANA[0] - 1.2 + (i % 2) * 0.5, s), lerp(LANDING[1] + 0.4, ISTANA[1] + 1.8, s)];
};
export const SHIP_FLAGS = ['#ff7a00', '#c8102e', '#f2f2f2', '#c8102e', '#1f4fa0'];

// ------------------------------------------------------------------ taken: the gun to the landing, onto a ship and away
const TAKE_PATH: P[] = [[ISTANA[0] + 0.6, ISTANA[1] + 1.6], [ISTANA[0] - 0.6, ISTANA[1] - 1.2], [LANDING[0], LANDING[1] + 0.4]];
const TAKE_L = lengthOf(TAKE_PATH);
const OUT_L = lengthOf(SHIP_OUT);
/** 0..1: the cannon is dragged to the landing (0.15-0.5), loaded, and the ship sails (0.55-1) */
export const takeAt = (t: number) => {
  const k = beatK('taken', t);
  if (k < 0.1) return null;
  return along(TAKE_PATH, smooth((k - 0.12) / 0.38) * TAKE_L);
};
export const takeShipAt = (t: number) => {
  const k = beatK('taken', t);
  if (k < -0.1 || k > 1.25) return null;
  return {...along(SHIP_OUT, smooth((k - 0.56) / 0.5) * OUT_L), loaded: k > 0.52};
};
/** the second gun slips off the landing into the sea (the legend): its splash */
export const splashK = (t: number) => {
  const k = beatK('taken', t);
  return k > 0.46 && k < 0.66 ? (k - 0.46) / 0.2 : -1;
};
/** the palace guns stand at the gate from the haul until this beat takes them */
export const gateGunsK = (t: number, Y: number) => (Y < 1597 ? 0 : Y > 1790 ? 0 : t > 20 && beatK('taken', t) > 0.12 ? 0 : 1);
export const TAKE_CREW = 10;

// ------------------------------------------------------------------ newtown: boats up the river; the palace and Anoru rise
/** the river from the mouth up to the town (RIVER runs south to north; reversed here) */
const UPRIVER: P[] = RIVER.filter((p) => p[1] <= -2 && p[1] >= -16).reverse();
const UPRIVER_L = lengthOf(UPRIVER);
export const BOATS = 4;
export const boatAt = (i: number, t: number) => {
  const k = beatK('newtown', t);
  if (k < -0.1 || k > 1.1) return null;
  const d = smooth((k + 0.1 - i * 0.1) / 0.8) * (UPRIVER_L - 0.6) - i * 0.9;
  return d < 0 ? null : along(UPRIVER, d);
};
export const palaceK = (t: number, Y: number) => (Y > 1862 ? 1 : smooth((beatK('newtown', t) - 0.25) / 0.35));
/** the shophouse rows of Anoru round the shrine, east bank */
export const SHOPS: P[] = [[3.7, -0.9], [3.9, 0.5], [5.1, -4.0]];
export const shopK = (j: number, t: number, Y: number) => (Y > 1862 ? 1 : smooth((beatK('newtown', t) - 0.4 - j * 0.07) / 0.2));
export const shrineK = (t: number, Y: number) => (Y > 1862 ? 1 : smooth((beatK('newtown', t) - 0.55) / 0.2));

// ------------------------------------------------------------------ bridge: the Dechanuchit truss over the river
export const bridgeK = (t: number, Y: number) => (Y > 1931 ? 1 : smooth((beatK('bridge', t) - 0.2) / 0.5));
/** the bridge's axis, square to the river there (the river runs (-1, 2.3) past it) */
export const BRIDGE_DIR: P = [0.917, 0.4];
export const CARTS = 3;
/** once it stands, carts and walkers cross it */
export const crossAt = (i: number, t: number): P | null => {
  const k = beatK('bridge', t);
  if (k < 0.72 || k > 1.1) return null;
  const u = ((t * 0.35 + i / CARTS) % 1) * 2 - 1;
  return [DECHA_BRIDGE[0] + BRIDGE_DIR[0] * u * 0.9, DECHA_BRIDGE[1] + BRIDGE_DIR[1] * u * 0.9];
};

// ------------------------------------------------------------------ grow: the Central Mosque rises in the growing town
export const mosqueK = (t: number, Y: number) => (Y > 1996 ? 1 : smooth((beatK('grow', t) - 0.3) / 0.4));
export {CENTRAL_MOSQUE};

// ------------------------------------------------------------------ fair: the Lim Ko Niao procession wades across the river
/** from the shrine to the east bank south of the bridge, across the river, up the west bank by the pillar */
export const PROC_PATH: P[] = [[SHRINE[0] - 0.4, SHRINE[1] + 0.9], [3.4, 1.2], [1.6, 3.6], [0.6, 4.2], [-1.0, 4.4], [-2.4, 4.0], [-3.0, 2.6], [-2.4, 1.2]];
const PROC_L = lengthOf(PROC_PATH);
/** the river's banks on the wading line (the people are in the water between these distances along PROC_PATH) */
export const WADE: [number, number] = [atAlong(PROC_PATH, [-0.3, 4.3]), atAlong(PROC_PATH, [-1.3, 4.3])];
export const PALANQUINS = 3;
export const procLead = (t: number) => smooth((beatK('fair', t) + 0.1) / 0.62) * (PROC_L + 2.5);
/** walker i of the procession: palanquin bearers first, then followers; null before they leave or after they are gone */
export const procAt = (i: number, t: number) => {
  const d = procLead(t) - i * 0.42;
  if (d < -0.2 || d > PROC_L) return null;
  const p = along(PROC_PATH, Math.max(0, d));
  const wet = d > WADE[0] - 0.2 && d < WADE[1] + 0.2;
  return {...p, wet, d};
};
export const PROC_N = 22;
/** the crowd on both banks watching the crossing */
export const CROWD: P[] = Array.from({length: 26}, (_, i) => {
  const side = i % 2;
  const u = Math.floor(i / 2) / 13;
  return side ? [2.2 + u * 1.2, 2.7 + (u % 0.3) * 0.9] : [-1.6 - u * 1.4, 4.7 + (u % 0.3) * 0.6];
});
export const fairK = (t: number, Y: number) => (Y < 1995 ? 0 : smooth((beatK('fair', t) + 0.2) / 0.2));

export const ACTORS: Actor[] = [
  {id: 'cannon', role: 'hero', during: [0, 3.0], size: CANNON_S * 0.8, at: () => [COVER_C[0], 2, COVER_C[1]]},
  {id: 'pour', during: [3.6, 8.4], size: 2.4, minInFrame: 0.6, at: () => [PITS[0], 0.6, PITS[1]]},
  {
    id: 'haul',
    during: [8.8, 14.4],
    size: 1.6,
    minInFrame: 0.6,
    at: (t, c) => {
      const p = haulAt(t, c.Y);
      return [p.x, 0.5, p.z];
    },
  },
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `ship${i}`,
    during: [15.0, 20.4],
    size: 1.6,
    minInFrame: 0.5,
    at: (t, c) => {
      const p = shipAt(i, t, c.Y);
      return p ? [p.x, 0.8, p.z] : null;
    },
  })),
  {
    id: 'taken',
    during: [21.4, 24.0],
    size: 1.4,
    minInFrame: 0.6,
    at: (t) => {
      const p = takeAt(t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  },
  {
    id: 'takeship',
    during: [24.0, 26.4],
    size: 1.8,
    minInFrame: 0.5,
    at: (t) => {
      const p = takeShipAt(t);
      return p ? [p.x, 0.8, p.z] : null;
    },
  },
  {
    id: 'boat0',
    during: [27.2, 30.4],
    size: 1.2,
    minInFrame: 0.5,
    at: (t) => {
      const p = boatAt(0, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  },
  {id: 'palace', during: [29.2, 32.4], size: 1.6, at: (t, c) => (palaceK(t, c.Y) > 0.05 ? [CHABANG_TIGA[0], 0.6, CHABANG_TIGA[1]] : null)},
  {id: 'truss', during: [33.4, 37.8], size: 1.6, at: (t, c) => (bridgeK(t, c.Y) > 0.05 ? [DECHA_BRIDGE[0], 0.8, DECHA_BRIDGE[1]] : null)},
  {id: 'sprawl', during: [38.6, 45.2], size: 12, at: () => [4, 0.5, 2]},
  {id: 'mosque', during: [40.4, 44.6], size: 4.6, at: (t, c) => (mosqueK(t, c.Y) > 0.05 ? [CENTRAL_MOSQUE[0], 1.0, CENTRAL_MOSQUE[1]] : null)},
  {
    id: 'procession',
    during: [46.0, 51.2],
    size: 1.6,
    minInFrame: 0.5,
    at: (t) => {
      const p = procAt(0, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  },
  {id: 'cannon-back', role: 'callback', during: [52.2, 54.4], size: CANNON_S * 0.8, at: () => [COVER_C[0], 2, COVER_C[1]]},
];
export {ANCHORAGE, KRUESE, LANDING};
