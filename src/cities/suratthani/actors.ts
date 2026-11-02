// Pure position math for Surat Thani's moving things (src/engine/actors.ts); Landmarks.tsx draws from
// the same functions.
import type {Actor, ActorCtx} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {
  CHAIYA, COAST, LAEM_PHO, LANDING, OYSTERS, PALM2, PALM_BASE, PALM_OVER, SAMUI_OUT, SHIPYARD, TAPI_DOWN, TAPI_UP,
} from './places';
import {H_HERO, STORY} from './timeline';

type P = [number, number];
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
export const beatK = (id: string, t: number) => {
  const [a, b] = STORY.at(id);
  return (t - a) / (b - a);
};
export const ramp = (t: number, a: number, b: number) => smooth(clamp01((t - a) / (b - a)));
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
/** distance along a polyline to the point on it nearest p */
export const atAlong = (pts: P[], p: P) => {
  let best = 0;
  let bd = Infinity;
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1];
    const [bx, bz] = pts[i];
    const dx = bx - ax;
    const dz = bz - az;
    const len = Math.hypot(dx, dz);
    const u = clamp01(((p[0] - ax) * dx + (p[1] - az) * dz) / (len * len));
    const d = Math.hypot(p[0] - ax - u * dx, p[1] - az - u * dz);
    if (d < bd) {
      bd = d;
      best = acc + u * len;
    }
    acc += len;
  }
  return best;
};
const on = (c: ActorCtx, x: number, z: number, dy: number): [number, number, number] => [x, (c.ground?.(x, z) ?? 0) + dy, z];

// ------------------------------------------------------------------ the cover (style frame A1)
/** the palm leans ESE from the west bank so its crown hangs over the river */
export const LEAN = Math.atan2(-(PALM_OVER[1] - PALM_BASE[1]), PALM_OVER[0] - PALM_BASE[0]);
/** the palm at legend scale through the cover, settling to a real palm (~4 units) as the ships come in */
export const palmH = (t: number) => lerp(H_HERO, 4, ramp(t, 4.0, 5.8));
/** the monkey's size: 0.38 of the palm (legend), then it climbs down out of sight with the settle */
export const MONKEY_K = 0.38;
/** the trunk's centreline in the palm's frame (lean toward local +x), height fraction u (figures.tsx) */
export const trunkLocal = (u: number): [number, number] => [0.16 * u * u + 0.04 * Math.sin(u * 3), u];
export type MonkeyState = {x: number; y: number; z: number; tilt: number; climb: number; twist: number; look: number; s: number};
/** halfway up at frame 0, at the crown by 1.1 s, spins the coconut 1.1-1.9 s, watches it fall */
export const monkeyAt = (t: number, ground = 0): MonkeyState | null => {
  const H = palmH(t);
  const s = MONKEY_K * H;
  if (s < 0.15) return null;
  const u = t < 1.1 ? 0.42 + 0.44 * smooth(clamp01(t / 1.1) * 0.85 + 0.15 * clamp01(t / 1.1) ** 2) : 0.86;
  const [lx, ly] = trunkLocal(u);
  const [lx2, ly2] = trunkLocal(Math.min(1, u + 0.02));
  const c = Math.cos(LEAN);
  const sn = Math.sin(LEAN);
  // the palm's local +x maps to (cos LEAN, -sin LEAN) in (x, z); the monkey clings on the camera side
  const side = 0.045 * H;
  return {
    x: PALM_BASE[0] + lx * H * c + side * sn,
    y: ground + ly * H - 0.25 * s,
    z: PALM_BASE[1] - lx * H * sn + side * c,
    tilt: -Math.atan2(lx2 - lx, ly2 - ly),
    climb: t < 1.1 ? t * 13 + 0.6 : 0.6,
    twist: ramp(t, 1.0, 1.25) * (1 - ramp(t, 1.95, 2.25)),
    look: ramp(t, 1.9, 2.2) * -0.9,
    s,
  };
};
/** the coconut: spun at the crown 1.1-1.9 s, then a free fall into the river by ~2.45 s */
export const NUT_DROP = 1.9;
export const NUT_FALL = 0.55;
export const coconutAt = (t: number, ground = 0) => {
  if (t > NUT_DROP + NUT_FALL) return null;
  const H = palmH(t);
  const [lx, ly] = trunkLocal(1);
  const x0 = PALM_BASE[0] + lx * H * Math.cos(LEAN);
  const z0 = PALM_BASE[1] - lx * H * Math.sin(LEAN) + 0.05 * H;
  const y0 = ground + ly * H - 0.07 * H;
  const f = Math.max(0, t - NUT_DROP);
  const u = f / NUT_FALL;
  return {
    x: lerp(x0, PALM_OVER[0], u),
    z: lerp(z0, PALM_OVER[1], u),
    y: Math.max(0.2, y0 - (y0 - 0.2) * u * u),
    spin: t > 1.1 ? (Math.min(t, NUT_DROP) - 1.1) * 22 + f * 6 : 0,
    r: 0.055 * H,
  };
};
/** the splash where the coconut lands, 0..1 over 1.1 s */
export const splashK = (t: number) => (t - NUT_DROP - NUT_FALL) / 1.1;

// ------------------------------------------------------------------ Srivijaya's ships
// in from the open bay at the tile's north-east, west along the bay to Laem Pho
const SHIP_PATH: P[] = [[60, -76], [30, -72], [0, -70], [-20, -69.5], [LAEM_PHO[0] + 3, LAEM_PHO[1] - 8]];
const SHIP_L = lengthOf(SHIP_PATH);
export const SHIPS = 4;
export const shipAt = (i: number, t: number) => {
  if (t < 2.4 || t > beatAt('fight', 0.3)) return null;
  const k = clamp01((t - 2.4) / 5.2);
  const d = lerp(0.25, 0.97, smooth(k)) * SHIP_L - i * 7;
  if (d < 0) return null;
  return {...along(SHIP_PATH, d), sail: 1};
};

// ------------------------------------------------------------------ Chaiya burns, 2328
/** the Burmese camp on the shore at Chaiya; the Siamese army marching up from the south */
export const fightK = (t: number) => beatK('fight', t);
export const burmese = (t: number) => {
  const k = fightK(t);
  if (k < -0.1 || k > 1.15) return null;
  // they hold the burning town, then fall back north to the shore
  const back = ramp(k, 0.65, 1.0) * 2.5;
  return {at: [CHAIYA[0] + 1, CHAIYA[1] + 2.6 - back] as P, face: [CHAIYA[0] + 1, CHAIYA[1] + 20] as P};
};
export const siamese = (t: number) => {
  const k = fightK(t);
  if (k < -0.1 || k > 1.15) return null;
  const z = lerp(CHAIYA[1] + 11, CHAIYA[1] + 6.2, smooth(clamp01(k / 0.75)));
  return {at: [CHAIYA[0] + 1.5, z] as P, face: [CHAIYA[0] + 1, CHAIYA[1]] as P};
};
/** the fire over Chaiya's houses: up fast, dying as the Burmese fall back */
export const fireK = (t: number) => {
  const k = fightK(t);
  return ramp(k, 0.02, 0.22) * (1 - ramp(k, 0.8, 1.05));
};

// ------------------------------------------------------------------ the royal shipyard, ~2375
/** two hulls on the slips: ribs then planks; the first slides into the river at the end */
export const hullK = (i: number, t: number) => ramp(beatK('shipyard', t), 0.05 + i * 0.12, 0.6 + i * 0.12);
export const launchK = (t: number) => ramp(beatK('shipyard', t), 0.68, 1.0);
/** the slips run from the bank down into the water, toward the river's centre (WNW) */
export const SLIP_DIR = Math.atan2(PALM_OVER[0] - SHIPYARD[0] - 1.6, PALM_OVER[1] - SHIPYARD[1] + 0.6);

// ------------------------------------------------------------------ Tha Thong moves to Ban Don
const DOWN_L = lengthOf(TAPI_DOWN);
const LANDING_AT = atAlong(TAPI_DOWN, LANDING);
export const MOVE_BOATS = 7;
/** boats with the town's families coming up the lower reach to the Ban Don landing, 1.8 apart */
export const moveBoatAt = (i: number, t: number) => {
  const k = beatK('move', t);
  if (k < -0.06 || k > 1.1) return null;
  const head = lerp(LANDING_AT + 14, LANDING_AT + 2.5, smooth(clamp01((k + 0.06) / 0.85)));
  const d = Math.max(head + i * 1.8, LANDING_AT + 2.5 + i * 0.9);
  if (d > DOWN_L - 1) return null;
  const p = along(TAPI_DOWN, d);
  // upstream: they face back along the path
  return {...p, rot: p.rot + Math.PI};
};

// ------------------------------------------------------------------ Rama VI's barge, 2458
const UP_L = lengthOf(TAPI_UP);
export const BARGES = 5;
/** the royal barge and its escorts down the Tapi from the west to the landing, 2.6 apart */
export const bargeAt = (i: number, t: number) => {
  const k = beatK('royal', t);
  if (k < -0.06 || k > 1.12) return null;
  const end = UP_L + atAlong(TAPI_DOWN, LANDING) - 0.6;
  const head = lerp(UP_L - 19, end, smooth(clamp01((k + 0.06) / 0.88)));
  const d = Math.min(head - i * 2.6, end - i * 1.4);
  if (d < UP_L - 34) return null;
  // the two reaches as one path
  return d <= UP_L ? along(TAPI_UP, d) : along(TAPI_DOWN, d - UP_L);
};
/** the crowd at the landing, and the name going up on the landing's arch */
export const welcomeK = (t: number) => ramp(beatK('royal', t), 0.55, 0.85);

// ------------------------------------------------------------------ the grow shot
export const FERRIES = 3;
/** ferries out of the mouth across the bay NE for Samui, 3 at a time */
export const ferryAt = (i: number, t: number) => {
  const k = beatK('growth', t);
  if (k < 0.05 || k > 1.05) return null;
  const u = ((k - 0.05) * 1.1 + i / FERRIES) % 1;
  const a: P = [42, -43];
  return {x: lerp(a[0], SAMUI_OUT[0], u), z: lerp(a[1], SAMUI_OUT[1], u), rot: Math.atan2(SAMUI_OUT[0] - a[0], SAMUI_OUT[1] - a[1])};
};
/** the oyster farms (ขนำ and their pole grids) appear through the grow beat */
export const oysterK = (Y: number) => clamp01((Y - 1955) / 30);
export const OYSTER_HUTS: P[] = Array.from({length: 9}, (_, i) => [OYSTERS[0] - 9 + (i % 5) * 4.4 + (i > 4 ? 2 : 0), OYSTERS[1] - 4 - Math.floor(i / 5) * 4.6]);

// ------------------------------------------------------------------ Chak Phra (the payoff)
export const PHRA_BOATS = 4;
const NARIT_AT = atAlong(TAPI_DOWN, LANDING) + 1.6;
/** the phanom phra boats drifting down from the landing past Saphan Narit, each towed by a long boat */
export const phraAt = (i: number, t: number) => {
  const k = beatK('payoff', t);
  if (k < -0.05 || k > 1.06) return null;
  const d = NARIT_AT + lerp(-1.2, 4.6, k) - i * 2.6;
  if (d < 0.6) return null;
  return along(TAPI_DOWN, d);
};
/** two long boats racing up the lower reach toward the finish off Saphan Narit (they stop short of
 *  the landing, well below the Sri Tapi bridge by the pillar: a boat never passes under a deck) */
export const RACERS = 2;
export const racerAt = (i: number, t: number) => {
  const k = beatK('payoff', t);
  if (k < 0.18 || k > 1.06) return null;
  const finish = NARIT_AT + 4.2;
  const d = Math.max(finish - (i ? 0.7 : 0), lerp(finish + 18, finish, smooth(clamp01((k - 0.18) / 0.62))) + (i ? 0.9 : 0));
  const p = along(TAPI_DOWN, d);
  // side by side: one each side of the centreline
  const off = (i ? 0.45 : -0.45);
  return {x: p.x + Math.cos(p.rot) * off, z: p.z - Math.sin(p.rot) * off, rot: p.rot + Math.PI};
};
/** the monkey back on a palm on Ko Lamphu over the boats (the callback) */
export const CALLBACK_H = 8;
export const monkeyBack = (t: number) => {
  const k = beatK('payoff', t);
  if (k < 0) return null;
  const grow = ramp(k, 0, 0.12);
  const u = 0.35 + 0.5 * ramp(k, 0.1, 0.55);
  return {u, grow, climb: k < 0.55 ? t * 9 : 0.6, look: k > 0.55 ? Math.sin(t * 1.4) * 0.6 : 0};
};

export const ACTORS: Actor[] = [
  {id: 'monkey', role: 'hero', during: [0, 2.6], size: 0.5 * MONKEY_K * H_HERO, at: (t, c) => {
    const m = monkeyAt(t, c.ground?.(PALM_BASE[0], PALM_BASE[1]) ?? 0);
    return m ? [m.x, m.y + 0.5 * m.s, m.z] : null;
  }},
  {id: 'ships', during: [3.0, 6.6], size: 5, at: (t) => {
    const s = shipAt(0, t);
    return s ? [s.x, 2, s.z] : null;
  }},
  {id: 'armies', during: [beatAt('fight', 0.05), beatAt('fight', 0.95)], size: 3, at: (t) => {
    const f = siamese(t);
    return f ? [f.at[0], 0.8, f.at[1]] : null;
  }},
  {id: 'hulls', during: [beatAt('shipyard', 0.05), beatAt('shipyard', 0.98)], size: 1.4, at: (t, c) => {
    const l = launchK(t);
    return on(c, SHIPYARD[0] + Math.sin(SLIP_DIR) * 1.6 * l, SHIPYARD[1] + Math.cos(SLIP_DIR) * 1.6 * l, 0.6);
  }},
  {id: 'moveBoats', during: [beatAt('move', 0.04), beatAt('move', 0.96)], size: 1.4, at: (t) => {
    const b = moveBoatAt(1, t);
    return b ? [b.x, 0.3, b.z] : null;
  }},
  {id: 'barges', during: [beatAt('royal', 0.04), beatAt('royal', 0.96)], size: 1.5, at: (t) => {
    const b = bargeAt(0, t);
    return b ? [b.x, 0.4, b.z] : null;
  }},
  {id: 'townGrows', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 12, at: () => [6, 1, -8]},
  {id: 'phraBoats', during: [beatAt('payoff', 0.02), beatAt('payoff', 0.98)], size: 1.2, at: (t) => {
    const b = phraAt(0, t);
    return b ? [b.x, 0.8, b.z] : null;
  }},
  {id: 'monkeyBack', role: 'callback', during: [beatAt('payoff', 0.15), beatAt('payoff', 1)], size: 1.3, at: (t, c) => {
    const m = monkeyBack(t);
    return m ? on(c, PALM2[0], PALM2[1], m.u * CALLBACK_H) : null;
  }},
];

// the bay's coast, for placing things in the water (oyster huts, ferries) and checks in Landmarks
export const coastZ = (x: number) => {
  for (let i = 1; i < COAST.length; i++) {
    const [ax, az] = COAST[i - 1];
    const [bx, bz] = COAST[i];
    if (x >= ax && x <= bx) return lerp(az, bz, (x - ax) / (bx - ax));
  }
  return COAST[COAST.length - 1][1];
};
