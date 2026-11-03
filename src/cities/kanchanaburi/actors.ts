// Pure position math for Kanchanaburi's moving things (src/engine/actors.ts); Landmarks.tsx draws from the
// same functions.
import type {Actor, ActorCtx} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {BRIDGE, BRIDGE_YAW, HERO_K, KHWAE_YAI, LAT_YA, RAIL, type P} from './places';
import {STORY} from './timeline';

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ramp = (t: number, a: number, b: number) => smooth(clamp01((t - a) / (b - a)));
export const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
export const lengthOf = (pts: P[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
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

// ------------------------------------------------------------------ the bridge and its train
/** a real Kwai bridge is 322.9 m: 3.23 units at 100 m/unit */
export const BRIDGE_REAL = 3.23;
/** the bridge's unit direction (local +x): along the line, toward the south-south-west */
export const DIR: P = [Math.sin(BRIDGE_YAW), Math.cos(BRIDGE_YAW)];
export const [HERO_FADE0, HERO_FADE1] = [4.2, 6.0];
const [md0] = STORY.at('mend');
const [py0] = STORY.at('payoff');
export const CROSS = {hero: 0, mend: md0 + 0.4, festival: py0 + 3.4};
/** scale of the bridge at second t as a multiple of the real one: the cover's giant, gone by 6 s, real from
 *  the 2486 beat, and swelling back to a callback in the festival */
export const bridgeK = (t: number) => {
  if (t < HERO_FADE1) return HERO_K * (1 - ramp(t, HERO_FADE0, HERO_FADE1));
  if (t < py0) return 1;
  return 1 + 1.4 * ramp(t, py0 + 0.6, py0 + 4.0);
};
export const bridgeLen = (t: number) => BRIDGE_REAL * bridgeK(t);
/** the bridge's west end (local x = 0) for scale k: its centre stays on the real site */
export const bridgeOrigin = (k: number): P => [BRIDGE[0] - (DIR[0] * BRIDGE_REAL * k) / 2, BRIDGE[1] - (DIR[1] * BRIDGE_REAL * k) / 2];
/** where the engine is along the bridge, in bridge lengths (0 = the near end, 1 = the far end), or null */
export const trainU = (t: number): number | null => {
  const speed = 0.34;
  for (const t0 of [CROSS.hero, CROSS.mend, CROSS.festival]) {
    const u = -0.2 + (t - t0) * speed;
    if (t >= t0 && u <= 1.25) return u;
  }
  return null;
};
export const trainWorld = (t: number, ground: (x: number, z: number) => number): [number, number, number] | null => {
  const u = trainU(t);
  if (u === null) return null;
  const k = bridgeK(t);
  const [ox, oz] = bridgeOrigin(k);
  const L = BRIDGE_REAL * k;
  const x = ox + DIR[0] * L * u;
  const z = oz + DIR[1] * L * u;
  return [x, Math.max(ground(x, z), 0) + 0.07 * L + 0.01 * L, z];
};
/** the world is read at the second the train runs: no train on the broken bridge, the hero only before it fades */
export const trainShown = (t: number) => {
  if (t < HERO_FADE1 - 0.2) return true;
  const [bk0] = STORY.at('break');
  if (t >= bk0 - 0.2 && t < md0) return false;
  return t >= CROSS.mend;
};

// ------------------------------------------------------------------ rafts down the Khwae Yai (2374)
const PATH_LEN = lengthOf(KHWAE_YAI);
const RAFTS = 5;
export const raftAt = (i: number, t: number) => {
  const [a, b] = STORY.at('move');
  const p = ramp(t, a, a + 0.62 * (b - a));
  // the last 9 units of the river down to the confluence, spaced out
  const d = PATH_LEN - 4 - (1 - p) * 26 - i * 1.5;
  return along(KHWAE_YAI, d);
};
export const raftsOn = (t: number) => {
  const [a, b] = STORY.at('move');
  return t >= a - 0.2 && t <= b + 0.2;
};

// ------------------------------------------------------------------ the work train that lays the line (2486)
const clampU = clamp01;
export const railBridgeAt = (() => {
  let acc = 0;
  let best = 1e9;
  let at = 0;
  for (let i = 1; i < RAIL.length; i++) {
    const [ax, az] = RAIL[i - 1];
    const [bx, bz] = RAIL[i];
    const len = Math.hypot(bx - ax, bz - az);
    const u = clampU(((BRIDGE[0] - ax) * (bx - ax) + (BRIDGE[1] - az) * (bz - az)) / (len * len));
    const d = Math.hypot(BRIDGE[0] - ax - u * (bx - ax), BRIDGE[1] - az - u * (bz - az));
    if (d < best) {
      best = d;
      at = acc + u * len;
    }
    acc += len;
  }
  return at;
})();
export const workTrainAt = (t: number) => {
  const [a, b] = STORY.at('bridge');
  if (t < a + 0.4 || t > b - 0.4) return null;
  const p = ramp(t, a + 0.6, b - 0.6);
  const r = along(RAIL, railBridgeAt - 24 + p * 17);
  return r;
};

// ------------------------------------------------------------------ the elephants of Lat Ya (2328)
export const elephantAt = (i: number, t: number) => {
  const [a, b] = STORY.at('fight');
  if (t < a - 0.3 || t > b + 1.5) return null;
  const k = (t - a) / (b - a);
  const ang = 0.9 + i * 2.1 + k * 1.6;
  const r = 1.6 + 0.5 * i;
  return {x: LAT_YA[0] + 1.0 + Math.cos(ang) * r, z: LAT_YA[1] + 1.2 + Math.sin(ang) * r * 0.8, rot: ang + Math.PI / 2};
};

const on = (c: ActorCtx, x: number, z: number, dy: number): [number, number, number] => [x, (c.ground?.(x, z) ?? 0) + dy, z];

export const ACTORS: Actor[] = [
  {
    id: 'cover-train',
    during: [0, 3.0],
    role: 'hero',
    size: 6,
    minInFrame: 0.5,
    at: (t, c) => (t > 3.6 ? null : trainWorld(t, c.ground ?? (() => 0))),
  },
  {
    id: 'mended-train',
    during: [CROSS.mend + 0.2, CROSS.mend + 2.2],
    size: 1.2,
    minInFrame: 0.5,
    at: (t, c) => (t >= CROSS.mend && t <= CROSS.mend + 4.4 ? trainWorld(t, c.ground ?? (() => 0)) : null),
  },
  {
    id: 'festival-train',
    during: [CROSS.festival + 0.2, CROSS.festival + 2.6],
    role: 'callback',
    size: 3,
    minInFrame: 0.5,
    at: (t, c) => (t >= CROSS.festival ? trainWorld(t, c.ground ?? (() => 0)) : null),
  },
  ...[0, 1, 2].map((i): Actor => ({
    id: `elephant${i}`,
    during: 'fight',
    size: 1.2,
    minInFrame: 0.5,
    at: (t, c) => {
      const e = elephantAt(i, t);
      return e ? on(c, e.x, e.z, 0.6) : null;
    },
  })),
  {id: 'wall-rise', during: 'move', size: 3, minInFrame: 0.3, at: (t, c) => on(c, -0.3, -0.2, 1.0)},
  {
    id: 'work-train',
    during: 'bridge',
    size: 1.5,
    minInFrame: 0.3,
    at: (t, c) => {
      const w = workTrainAt(t);
      return w ? on(c, w.x, w.z, 0.5) : null;
    },
  },
  {
    id: 'falling-span',
    during: 'break',
    size: 2,
    minInFrame: 0.5,
    at: (t, c) => (t >= STORY.at('break')[0] && t <= STORY.at('break')[1] ? on(c, BRIDGE[0], BRIDGE[1], 0.5) : null),
  },
  ...Array.from({length: RAFTS}, (_, i): Actor => ({
    id: `raft${i}`,
    during: 'move',
    size: 1,
    minInFrame: 0.5,
    at: (t, c) => {
      if (!raftsOn(t)) return null;
      const r = raftAt(i, t);
      return on(c, r.x, r.z, 0.3);
    },
  })),
];
