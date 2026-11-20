// Pure position math for Phrae's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {
  CHOHAE, DENCHAI, GABLE_AT, GABLE_S, GATE_CHAI, GATE_MAI, LANDING, LOG_TRACK, POLICE, RAIL_Z, STAIR, THUNGHONG, WONGBURI, YOM,
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

// ------------------------------------------------------------------ the cover: the teak gable (style frame A1)
/** the gable stands through the cover and folds away as the camera leaves for the gate (gone by 4.4 s) */
export const gableK = (t: number) => 1 - smooth((t - 3.5) / 0.9);
/** the gable board's centre for the hero actor (it stands on trestles, then on the house) */
export const GABLE_C: [number, number, number] = [GABLE_AT[0], GABLE_S * 0.25, GABLE_AT[1]];

// ------------------------------------------------------------------ shan: the Shan take the town; the Siamese column comes
/** the Shan come in from the fields south-east of ประตูชัย to the police post by the pillar */
export const SHAN_IN: P[] = [[10.4, 5.6], [8.0, 4.0], [5.8, 2.4], [GATE_CHAI[0], GATE_CHAI[1]], [2.4, 0.5], [POLICE[0] + 0.4, POLICE[1]]];
/** ... and leave by ประตูใหม่ to the north-east as the Siamese come up the road */
export const SHAN_OUT: P[] = [[POLICE[0] + 0.4, POLICE[1]], [2.6, -1.6], [4.2, -3.6], [5.4, -4.9], [GATE_MAI[0], GATE_MAI[1]], [8.6, -6.9], [10.8, -7.9]];
/** the Siamese column up ถนนเจริญเมือง to the gate */
export const SIAM_PATH: P[] = [[14.6, 8.6], [11.6, 6.6], [9.7, 5.4], [6.4, 3.0], [GATE_CHAI[0] + 0.5, GATE_CHAI[1] + 0.4], [2.2, 0.6]];
export const SHAN = 10;
export const SIAM = 14;
const LIN = lengthOf(SHAN_IN);
const LOUT = lengthOf(SHAN_OUT);
const LSIAM = lengthOf(SIAM_PATH);
/** each Shan's place: in through the gate (k 0-0.38), gathered at the post (to 0.6), out by the north-east gate */
export const shanAt = (i: number, t: number) => {
  const k = beatK('shan', t);
  if (k < -0.05 || k > 1.05) return null;
  if (k < 0.42) {
    const d = smooth((k + 0.05) / 0.42) * LIN - i * 0.36;
    const p = along(SHAN_IN, Math.max(0, d));
    return {...p, x: p.x + (i % 2 ? 0.18 : -0.18), still: false};
  }
  if (k < 0.62) {
    const a = (i / SHAN) * Math.PI * 2;
    return {x: POLICE[0] + 0.5 + Math.cos(a) * 0.55, z: POLICE[1] + Math.sin(a) * 0.4, rot: a, still: true};
  }
  const d = smooth((k - 0.62) / 0.36) * LOUT - i * 0.36;
  const p = along(SHAN_OUT, Math.max(0, d));
  return {...p, x: p.x + (i % 2 ? 0.18 : -0.18), still: false};
};
/** the Siamese column: from k 0.42 up the road, to the gate as the Shan leave */
export const siamAt = (i: number, t: number) => {
  const k = beatK('shan', t);
  if (k < 0.42 || k > 1.05) return null;
  const d = smooth((k - 0.42) / 0.56) * LSIAM - (i >> 1) * 0.42;
  if (d < 0) return null;
  const p = along(SIAM_PATH, d);
  return {...p, x: p.x + (i % 2 ? 0.2 : -0.2)};
};

// ------------------------------------------------------------------ rail: the gang lays the last of the line into Den Chai
/** the railhead's x while the track goes down (null once the line is open) */
export const gangAt = (t: number) => {
  const k = beatK('rail', t);
  if (k < -0.05 || k > 0.48) return null;
  return lerp(-34, DENCHAI[0] + 1.0, smooth((k + 0.05) / 0.42));
};
export const GANG = 6;

// ------------------------------------------------------------------ teak: elephants drag logs to the Yom; rafts go down it
export const ELEPHANTS = 3;
const LTRACK = lengthOf(LOG_TRACK);
/** each elephant along the log track from the west forest to the landing; it stops at the bank and the log rolls in */
export const elephantAt = (i: number, t: number) => {
  const k = beatK('teak', t);
  if (k < -0.1 || k > 1.1) return null;
  const d = Math.min(LTRACK - i * 1.6, lerp(LTRACK * 0.35, LTRACK, smooth((k + 0.1) / 0.6)) - i * 3.2);
  const p = along(LOG_TRACK, Math.max(0, d));
  return {...p, moving: k < 0.5 + i * 0.03};
};
/** the log each elephant drags, or rolls into the river once it is at the bank (0 dragged, 1 in the water) */
export const logRoll = (i: number, t: number) => smooth((beatK('teak', t) - 0.55 - i * 0.08) / 0.12);
export const RAFTS = 4;
const RAFT0 = atAlong(YOM, [LANDING[0] + 2.0, LANDING[1]]);
/** the rafts drift down the Yom from the landing (south past the town's west) */
export const raftAt = (i: number, t: number) => {
  const k = beatK('teak', t);
  const start = 0.05 + i * 0.2;
  if (k < start || k > 1.15) return null;
  const p = along(YOM, RAFT0 + (k - start) * 8.0);
  return p;
};

// ------------------------------------------------------------------ chohae: bricks up the naga stair; the chedi grows
/** 0 the old chedi, 1 restored (wider base, taller spire) */
export const chediK = (t: number, Y: number) => (Y > 1931 ? 1 : Y < 1923 ? 0 : smooth((beatK('chohae', t) - 0.2) / 0.6));
export const PORTERS = 8;
const LSTAIR = lengthOf(STAIR);
/** porters climb the stair with bricks and come down again */
export const porterAt = (i: number, t: number) => {
  const k = beatK('chohae', t);
  if (k < -0.05 || k > 1.05) return null;
  const u = ((t * 0.32 + i / PORTERS) % 1 + 1) % 1;
  const up = u < 0.5;
  const s = up ? u * 2 : 2 - u * 2;
  const p = along(STAIR, s * LSTAIR);
  return {...p, x: p.x + (up ? 0.16 : -0.16), up, rot: up ? p.rot : p.rot + Math.PI};
};

// ------------------------------------------------------------------ mohom: the drying lines fill
export const LINES = 6;
/** line j's cloth is hung (0 empty, 1 full) */
export const lineK = (j: number, t: number, Y: number) => (Y > 2015 ? 1 : Y < 2000 ? 0 : smooth((beatK('mohom', t) - 0.04 - j * 0.1) / 0.18));
export const DYERS = 6;
export const dyerAt = (i: number, t: number): P => {
  const j = i % LINES;
  const u = Math.sin(t * 0.9 + i * 1.7);
  return [THUNGHONG[0] - 1.2 + j * 0.5 + 0.22, THUNGHONG[1] - 0.2 + u * 0.9];
};

// ------------------------------------------------------------------ the payoff: the walking street and a gable sawn again
/** the craftsman's stall on ถนนคำลือ in front of Wongburi where a gable is fret-sawn as at the cover */
export const DEMO_AT: P = [WONGBURI[0] + 1.6, WONGBURI[1] + 0.05];
export const DEMO_S = 1.5;
/** the demo gable's own clock: half cut when the beat starts, all cut ~2 s later (the cover's sequence) */
export const demoT = (t: number) => Math.max(-0.5, t - STORY.at('fair')[0] - 1.0);

export const ACTORS: Actor[] = [
  {id: 'gable', role: 'hero', during: [0, 3.0], size: GABLE_S * 0.3, at: () => GABLE_C},
  {
    id: 'shan',
    during: [3.6, 7.0],
    size: 1.0,
    minInFrame: 0.7,
    at: (t) => {
      const p = shanAt(0, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  },
  {
    id: 'siam',
    during: [6.4, 9.4],
    size: 1.0,
    minInFrame: 0.7,
    at: (t) => {
      const p = siamAt(0, t);
      return p ? [p.x, 0.4, p.z] : null;
    },
  },
  {
    id: 'gang',
    during: [10.9, 12.4],
    size: 1.0,
    at: (t) => {
      const g = gangAt(t);
      return g ? [g, 0.4, RAIL_Z] : null;
    },
  },
  ...Array.from({length: ELEPHANTS}, (_, i): Actor => ({
    id: `elephant${i}`,
    during: [17.0, 21.4],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = elephantAt(i, t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  })),
  {
    id: 'raft0',
    during: [17.0, 21.6],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = raftAt(0, t);
      return p ? [p.x, 0.15, p.z] : null;
    },
  },
  {id: 'chedi', during: [23.4, 27.6], size: 1.2, at: (_t, c) => [CHOHAE[0], (c.ground?.(CHOHAE[0], CHOHAE[1]) ?? 2.6) + 0.8, CHOHAE[1]]},
  {
    id: 'porters',
    during: [23.4, 27.6],
    size: 0.8,
    at: (t, c) => {
      const p = porterAt(0, t);
      return p ? [p.x, (c.ground?.(p.x, p.z) ?? 1) + 0.3, p.z] : null;
    },
  },
  // the grow shot: the town builds out east over the fields (the sprawl, registered as what is being built)
  {id: 'sprawl', during: [29.6, 36.0], size: 14, at: () => [13, 0.5, 4]},
  {id: 'dyers', during: [38.0, 44.2], size: 1.4, at: () => [THUNGHONG[0], 0.5, THUNGHONG[1]]},
  {id: 'gable-back', role: 'callback', during: [46.0, 54.0], size: 1.0, at: () => [DEMO_AT[0], 0.7, DEMO_AT[1]]},
  {id: 'crowd', during: [46.0, 54.0], size: 1.6, at: () => [WONGBURI[0], 0.4, WONGBURI[1] + 1.2]},
];

export {DENCHAI};
