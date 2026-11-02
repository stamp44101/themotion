// Pure position math for Saraburi's moving things (src/engine/actors.ts); Landmarks.tsx draws from
// the same functions.
import type {Actor, ActorCtx} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {D_HERO, DEER_STOP, STORY} from './timeline';
import {FOOT, FOOT_ROAD, MITTRAPHAP, OLD_HALL, RIVER, RIVER_W, SAMUHA, TON_TAN} from './places';

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
/** distance from (x, z) to the Pa Sak's centreline */
export const riverDist = (x: number, z: number) => {
  let best = Infinity;
  for (let i = 1; i < RIVER.length; i++) {
    const [ax, az] = RIVER[i - 1];
    const [bx, bz] = RIVER[i];
    const dx = bx - ax;
    const dz = bz - az;
    const u = clamp01(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz));
    best = Math.min(best, Math.hypot(x - ax - u * dx, z - az - u * dz));
  }
  return best;
};
const ramp = (t: number, a: number, b: number) => smooth(clamp01((t - a) / (b - a)));

// ------------------------------------------------------------------ the cover (style frame A1)
/** the print's length: legend scale with the deer through the cover, then it settles to the size
 *  the mondop covers (drawn ~2 units, the real print is 1.5 m) as the deer goes into the hills */
export const L_HERO = 1.25 * D_HERO;
export const L_REAL = 1.6;
export const printAt = (t: number) => ({
  len: lerp(L_HERO, L_REAL, ramp(t, 4.3, 6.3)),
  // the water lights the moment the muzzle touches it (0.95 s), full by 1.15 s ([local]'s render: still blue at 1.2 s)
  glow: ramp(t, 0.95, 1.15) * (1 - 0.5 * ramp(t, 2.4, 4.0)),
});
export type DeerState = {x: number; z: number; rot: number; step: number; gait: number; drink: number; wound: number; s: number};
/** the deer gallops in already mid-leap at frame 0, drinks at the heel by 1 s, the water flares at
 *  1.2 s and the wound closes by 2 s; it bounds away north into the range and is gone by 6.2 s */
export const deerAt = (t: number): DeerState | null => {
  const s = D_HERO * (1 - ramp(t, 4.4, 6.2));
  if (s < 0.2) return null;
  const run = clamp01(t / 1.0);
  const xRun = DEER_STOP[0] - 0.9 * D_HERO * (1 - smooth(run * 0.6 + 0.4 * run * run));
  const leave = clamp01((t - 2.15) / 3.8);
  const gait = t < 1.0 ? 1 - 0.7 * ramp(t, 0.7, 1.0) : leave > 0 ? Math.min(1, leave * 6) : 0;
  return {
    x: t < 2.15 ? xRun : DEER_STOP[0] + leave * 0.4 * D_HERO,
    z: DEER_STOP[1] - leave * 1.4 * D_HERO,
    rot: ramp(t, 2.0, 2.4) * (Math.PI / 2),
    step: t * 11,
    gait,
    drink: ramp(t, 0.95, 1.25) * (1 - ramp(t, 1.85, 2.15)),
    wound: 1 - ramp(t, 1.3, 2.0),
    s,
  };
};
/** hunter Bun runs in behind the deer and kneels at the print; he goes as the print settles */
export const hunterAt = (t: number) => {
  const s = 1.4 * D_HERO * (1 - ramp(t, 4.3, 6.0));
  if (s < 0.2) return null;
  const x0 = DEER_STOP[0] - 2.2 * D_HERO;
  const x1 = DEER_STOP[0] - 0.5 * D_HERO;
  // on the camera's side of the deer and behind it, so the two never overlap on the cover
  return {x: lerp(x0, x1, Math.min(1, t / 2.4)), z: FOOT[1] + 0.75 * D_HERO, s, kneel: ramp(t, 2.4, 2.8)};
};

// ------------------------------------------------------------------ the king's procession
export const ELEPHANTS = 9;
const ROAD_L = lengthOf(FOOT_ROAD);
/** elephants with howdahs up the straight road from the west edge to the hill, 3.2 apart */
export const elephantAt = (i: number, t: number) => {
  const k = beatK('procession', t);
  if (k < -0.08 || k > 1.1) return null;
  const head = lerp(34, ROAD_L - 3, smooth(clamp01((k + 0.08) / 1.1)));
  const d = head - i * 3.2;
  if (d < 1 || d > ROAD_L - 2) return null;
  const p = along(FOOT_ROAD, d);
  return {...p, howdah: i % 3 === 0};
};
/** the first mondop (King Songtham's, one spire) over the print, through the procession */
export const mondop1K = (t: number) => ramp(beatK('procession', t), 0.45, 0.95);

// ------------------------------------------------------------------ the fire of 2310
export const fireK = (t: number) => {
  const k = beatK('fire', t);
  return {flame: ramp(k, 0.08, 0.3) * (1 - ramp(k, 0.8, 1.0)), fall: ramp(k, 0.4, 0.85)};
};

// ------------------------------------------------------------------ the mondop of 2330
export const mondop2K = (t: number) => ramp(beatK('rebuild', t), 0.05, 0.75);

// ------------------------------------------------------------------ the Thai Yuan

const TON_TAN_AT = (() => {
  let acc = 0;
  let best = 0;
  let bd = Infinity;
  for (let i = 0; i < RIVER.length; i++) {
    if (i) acc += Math.hypot(RIVER[i][0] - RIVER[i - 1][0], RIVER[i][1] - RIVER[i - 1][1]);
    const d = Math.hypot(RIVER[i][0] - TON_TAN[0], RIVER[i][1] - TON_TAN[1]);
    if (d < bd) {
      bd = d;
      best = acc;
    }
  }
  return best;
})();
export const YUAN_BOATS = 7;
/** boats with the families coming down the Pa Sak to Ban Ton Tan, 2.6 apart; they stop at the bank */
export const yuanBoatAt = (i: number, t: number) => {
  const k = beatK('yuan', t);
  if (k < -0.06 || k > 1.08) return null;
  const head = lerp(TON_TAN_AT - 14, TON_TAN_AT + 3, smooth(clamp01((k + 0.06) / 0.85)));
  const d = Math.min(head - i * 2.2, TON_TAN_AT + 3 - i * 1.3);
  if (d < TON_TAN_AT - 22) return null;
  return along(RIVER, d);
};
/** the Lanna houses going up at Ban Ton Tan and Sao Hai (Samuha), on land only */
const grid = (c: P, n: number, seed: number): P[] => {
  const out: P[] = [];
  for (let i = 0; out.length < n && i < n * 6; i++) {
    const a = i * 2.39996 + seed;
    const r = 1.1 + 0.62 * Math.sqrt(i);
    const x = c[0] + Math.cos(a) * r;
    const z = c[1] + Math.sin(a) * r * 0.8;
    if (riverDist(x, z) > RIVER_W / 2 + 1.0) out.push([x, z]);
  }
  return out;
};
export const LANNA: P[] = [...grid(TON_TAN, 14, 0.3), ...grid(SAMUHA, 10, 1.1)];
export const lannaK = (i: number, t: number) => ramp(beatK('yuan', t), 0.3 + (i % 7) * 0.05, 0.6 + (i % 7) * 0.05);

// ------------------------------------------------------------------ the move to Pak Phriao
/** Pak Phriao's hall going up and Sao Hai's emptying, through the train beat */
export const hallK = (t: number) => ramp(beatK('train', t), 0.35, 0.8);

// ------------------------------------------------------------------ the Friendship Highway
const MIT_L = lengthOf(MITTRAPHAP);
export const TRUCKS = 8;
/** trucks turning off at the fork for Korat, 2.4 apart */
export const truckAt = (i: number, t: number) => {
  const k = beatK('road', t);
  if (k < -0.05 || k > 1.1) return null;
  const d = (k * 1.4 * MIT_L + i * 3.1) % (MIT_L + 4) - 2;
  if (d < 0.3 || d > MIT_L - 0.5) return null;
  return along(MITTRAPHAP, d);
};

// ------------------------------------------------------------------ the payoff
export const flowersK = (t: number) => ramp(beatK('payoff', t), 0.0, 0.45);
export const MONKS = 14;
// up the middle naga stair on the mondop's south side
const STAIR: P[] = [
  [FOOT[0] + 0.5, FOOT[1] + 8.5],
  [FOOT[0] + 0.5, FOOT[1] + 4.2],
  [FOOT[0], FOOT[1] + 1.7],
];
const STAIR_L = lengthOf(STAIR);
export const monkAt = (i: number, t: number) => {
  const k = beatK('payoff', t);
  if (k < -0.05) return null;
  const d = k * 9 - i * 0.75;
  if (d < 0 || d > STAIR_L) return null;
  return along(STAIR, d);
};
/** the deer at the forest edge above the mondop, watching, through the payoff (the callback) */
export const deerBack = (t: number) => {
  const k = beatK('payoff', t);
  if (k < 0) return null;
  return {x: FOOT[0] + 4.6, z: FOOT[1] - 0.6, s: 1.3 * ramp(k, 0, 0.2), drink: 0.3 + 0.3 * Math.sin(t * 0.8)};
};

const on = (c: ActorCtx, x: number, z: number, dy: number): [number, number, number] => [x, (c.ground?.(x, z) ?? 0) + dy, z];

export const ACTORS: Actor[] = [
  {id: 'deer', role: 'hero', during: [0, 2.6], size: D_HERO, at: (t, c) => {
    const d = deerAt(t);
    return d ? on(c, d.x, d.z, 0.7 * d.s) : null;
  }},
  {id: 'elephants', during: [beatAt('procession', 0.04), beatAt('procession', 0.96)], size: 2, at: (t, c) => {
    const e = elephantAt(3, t);
    return e ? on(c, e.x, e.z, 1.2) : null;
  }},
  {id: 'mondopRises', during: [beatAt('procession', 0.45), beatAt('procession', 0.95)], size: 2, at: (_, c) => on(c, FOOT[0], FOOT[1], 1.4)},
  {id: 'fire', during: [beatAt('fire', 0.08), beatAt('fire', 0.95)], size: 2.5, at: (_, c) => on(c, FOOT[0], FOOT[1], 1.4)},
  {id: 'mondop2Rises', during: [beatAt('rebuild', 0.05), beatAt('rebuild', 0.8)], size: 2.5, at: (_, c) => on(c, FOOT[0], FOOT[1], 1.8)},
  {id: 'yuanBoats', during: [beatAt('yuan', 0.04), beatAt('yuan', 0.96)], size: 1.5, at: (t) => {
    const b = yuanBoatAt(2, t);
    return b ? [b.x, 0.3, b.z] : null;
  }},
  {id: 'trucks', during: [beatAt('road', 0.08), beatAt('road', 0.95)], size: 1.5, at: (t) => {
    for (let i = 0; i < TRUCKS; i++) {
      const p = truckAt(i, t);
      if (p) return [p.x, 0.4, p.z];
    }
    return null;
  }},
  {id: 'hallRises', during: [beatAt('train', 0.35), beatAt('train', 0.8)], size: 1.6, at: () => [OLD_HALL[0], 0.7, OLD_HALL[1]]},
  {id: 'townGrows', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 12, at: () => [0, 1, 0]},
  {id: 'monks', during: [beatAt('payoff', 0.05), beatAt('payoff', 1)], size: 1, at: (t, c) => {
    const m = monkAt(2, t);
    return m ? on(c, m.x, m.z, 0.4) : null;
  }},
  {id: 'deerBack', role: 'callback', during: [beatAt('payoff', 0.2), beatAt('payoff', 1)], size: 2.5, at: (t, c) => {
    const d = deerBack(t);
    return d ? on(c, d.x, d.z, 1.5) : null;
  }},
];
