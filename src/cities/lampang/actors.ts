// Pure position math for Lampang's moving things (src/engine/actors.ts): the opening
// carriage, the Emerald Buddha's elephants, หนานทิพย์ช้าง and ท้าวมหายศ at Lampang Luang,
// กาวิละ's army marching north, teak logs on the Wang, and a carriage from the station.
// Landmarks.tsx draws from these; check_story projects them through the camera.
import type {Actor, ActorCtx} from '../../engine/actors';
import type {Formation} from '../../engine/army';
import {lerp, ramp, smooth} from '../../lib';
import {BRIDGE, CLOCK_TOWER, LAMPANG_LUANG, PRATU_MA, STATION, WANG, WAT_PHRA_KAEW} from './places';

type P = [number, number];
const along = (pts: P[], d: number) => {
  let r = Math.max(0, d);
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1];
    const [bx, bz] = pts[i];
    const len = Math.hypot(bx - ax, bz - az);
    if (r <= len) {
      const u = r / len;
      return {x: lerp(ax, bx, u), z: lerp(az, bz, u), rot: Math.atan2(bx - ax, bz - az)};
    }
    r -= len;
  }
  const [ax, az] = pts[pts.length - 2];
  const [bx, bz] = pts[pts.length - 1];
  return {x: bx, z: bz, rot: Math.atan2(bx - ax, bz - az)};
};
const lengthOf = (pts: P[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// frame 0: the city's symbol stands on the forest tile at hero scale (experiment 1c); it
// trots across the clearing north of where the walls will rise and is gone by the caption
export const HERO_AT: P = [-8, -15];
export const heroCarriage = (t: number, {beat}: ActorCtx) => {
  const p = beat('legend');
  return {x: HERO_AT[0] + t * 1.5, z: HERO_AT[1] + t * 0.3, k: 1 - smooth(ramp(p, 0.36, 0.5))};
};

// 1436: the white elephant carries พระแก้วมรกต in from the north, through ประตูม้า, to
// วัดพระแก้วดอนเต้า; two grey elephants follow
const ELEPHANT_ROUTE: P[] = [[4, -30], [3.9, -16], [PRATU_MA[0], PRATU_MA[1] - 1.5], PRATU_MA, [WAT_PHRA_KAEW[0] - 1.2, WAT_PHRA_KAEW[1]]];
const ELEPHANT_LEN = lengthOf(ELEPHANT_ROUTE);
export const elephantAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('emerald');
  if (p <= 0 || p >= 1) return null;
  const d = smooth(ramp(p, 0, 0.8)) * ELEPHANT_LEN - i * 3.2;
  if (d < 0) return null;
  return along(ELEPHANT_ROUTE, Math.min(d, ELEPHANT_LEN));
};

// ~1732: ท้าวมหายศ's army camps inside the walled Lampang Luang; หนานทิพย์ช้าง's villagers
// come down from the town (north-east), he slips in and fires (.42-.48), the camp breaks
// and flees west, the villagers take the compound
export const SHOT = [0.42, 0.48];
export const thipChang = (t: number, {beat}: ActorCtx) => {
  const p = beat('thipchang');
  if (p <= 0 || p >= 1) return {mahayot: null as Formation, villagers: null as Formation, flash: 0, p};
  const [lx, lz] = LAMPANG_LUANG;
  const come = smooth(ramp(p, 0, 0.4));
  const flee = smooth(ramp(p, 0.5, 0.9));
  const enter = smooth(ramp(p, 0.55, 0.85));
  const camp: P = [lx, lz];
  const mahayotAt: P = [lerp(lx, -47, flee), lerp(lz, lz + 4, flee)];
  const villagersAt: P = [lerp(lerp(lx + 9, lx + 4.5, come), lx + 1.2, enter), lerp(lerp(lz - 8, lz - 4.2, come), lz - 0.8, enter)];
  const mahayot: Formation = p < 0.92 ? {at: mahayotAt, face: flee > 0.02 ? [-48, lz + 4] : villagersAt} : null;
  const villagers: Formation = {at: villagersAt, face: p < 0.5 ? camp : mahayotAt};
  const flash = ramp(p, SHOT[0], SHOT[0] + 0.02) * (1 - ramp(p, SHOT[1] - 0.02, SHOT[1]));
  return {mahayot, villagers, flash, p};
};

// 1774: กาวิละ's Lampang army forms at ประตูม้า and marches north-west toward Chiang Mai
export const kawila = (t: number, {beat}: ActorCtx): Formation => {
  const p = beat('kawila');
  if (p <= 0 || p >= 1) return null;
  const m = smooth(ramp(p, 0.1, 0.95));
  const route: P[] = [[PRATU_MA[0], PRATU_MA[1] - 2], [-6, -16], [-18, -24]];
  const q = along(route, m * lengthOf(route));
  return {at: [q.x, q.z], face: [q.x + Math.sin(q.rot) * 5, q.z + Math.cos(q.rot) * 5]};
};

// 1890s: rafts of teak logs float down the Wang toward the bridge
export const WANG_LEN = lengthOf(WANG);
export const logAt = (i: number, {beat}: ActorCtx) => {
  const p = beat('teak');
  if (p <= 0 || p >= 1) return null;
  const d = 40 + p * 36 - i * 4.5;
  if (d < 0 || d > WANG_LEN) return null;
  return along(WANG, d);
};

// 1916: a carriage meets the first train at the station and drives into town
const CARRIAGE_ROUTE: P[] = [[STATION[0] + 3, STATION[1] - 1.2], CLOCK_TOWER, BRIDGE, [0, 0]];
const CARRIAGE_LEN = lengthOf(CARRIAGE_ROUTE);
export const townCarriage = (t: number, {beat}: ActorCtx) => {
  const p = beat('railway');
  if (p < 0.68) return null;
  const d = smooth(ramp(p, 0.74, 1)) * CARRIAGE_LEN * 0.18;
  return along(CARRIAGE_ROUTE, d);
};

export const ACTORS: Actor[] = [
  {
    id: 'heroCarriage',
    during: [0, 2.4],
    size: 8,
    at: (t, ctx) => {
      const c = heroCarriage(t, ctx);
      return c.k > 0.02 ? [c.x, 2, c.z] : null;
    },
  },
  {
    id: 'whiteElephant',
    during: 'emerald',
    size: 1.5,
    at: (t, ctx) => {
      const e = elephantAt(0, ctx);
      return e ? [e.x, 1.2, e.z] : null;
    },
  },
  {
    id: 'mahayot',
    during: 'thipchang',
    size: 3,
    minInFrame: 0.6,
    at: (t, ctx) => {
      const f = thipChang(t, ctx).mahayot;
      return f ? [f.at[0], 0.5, f.at[1]] : null;
    },
  },
  {
    id: 'villagers',
    during: 'thipchang',
    size: 3,
    at: (t, ctx) => {
      const f = thipChang(t, ctx).villagers;
      return f ? [f.at[0], 0.5, f.at[1]] : null;
    },
  },
  {
    id: 'kawilaArmy',
    during: 'kawila',
    size: 3,
    at: (t, ctx) => {
      const f = kawila(t, ctx);
      return f ? [f.at[0], 0.5, f.at[1]] : null;
    },
  },
  {
    id: 'teakLogs',
    during: 'teak',
    size: 1.6,
    at: (t, ctx) => {
      const l = logAt(0, ctx);
      return l ? [l.x, 0.2, l.z] : null;
    },
  },
  {
    id: 'townCarriage',
    during: 'railway',
    size: 1.6,
    minInFrame: 0.5,
    at: (t, ctx) => {
      const c = townCarriage(t, ctx);
      return c ? [c.x, 0.4, c.z] : null;
    },
  },
];
