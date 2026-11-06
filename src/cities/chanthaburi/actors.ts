// Pure position math for Chanthaburi's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {
  CATHEDRAL, ESTUARY, FRENCH_HOUSE, GATE, HERO_AT, HERO_S, KHAO_PLOI_WAEN, LOWER, MARKET, NOEN_WONG, NW_PATH, RIVER, SI_CHAN,
} from './places';
import {STORY} from './timeline';

type P = [number, number];
export const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
/** 0 at the beat's start, 1 at its end, unclamped */
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

// ------------------------------------------------------------------ the cover: the yellow sapphire on the lap
export const AZ = (18 * Math.PI) / 180;
export const CUT_END = 2.2;
export const LAP_R = 0.62 * HERO_S;
export const LAP_H = 0.35 * HERO_S;
/** the cut is done: the gem lifts off the lap */
export const doneK = (t: number) => smooth((t - CUT_END) / 1.2);
/** the lap, its stand and the dop stick shrink away */
export const lapK = (t: number) => 1 - smooth((t - 3.9) / 1.3);
/** the gem flies west and settles on Khao Ploi Waen */
export const flyK = (t: number) => smooth((t - 3.8) / 2.0);
/** the gem on the hill fades into it once the wall is going up */
export const hillGemK = (t: number) => 1 - smooth((t - 7.2) / 1.0);
const FWD = 0.2 * LAP_R;
/** where the gem sits on the lap (its culet), world */
const GEM_ON_LAP: [number, number] = [HERO_AT[0] + Math.sin(AZ) * FWD, HERO_AT[1] + Math.cos(AZ) * FWD];
export const KPW_TOP = 5.4; // Khao Ploi Waen's crown (layout.peaks)
/** the gem's culet position and its scale (S units) at t */
export const gemAt = (t: number) => {
  const f = flyK(t);
  const yLap = LAP_H + 0.08 * LAP_R + doneK(t) * 0.3 * HERO_S;
  const s = lerp(HERO_S, 1.3, f);
  const x = lerp(GEM_ON_LAP[0], KHAO_PLOI_WAEN[0], f);
  const z = lerp(GEM_ON_LAP[1], KHAO_PLOI_WAEN[1], f);
  // an arc: it rises a little before it drops onto the hill
  const y = lerp(yLap, KPW_TOP + 0.3, f) + Math.sin(Math.PI * f) * 8;
  return {x, y, z, s};
};

// ------------------------------------------------------------------ the build: the wall, junks at the landing
export const wallK = (t: number) => smooth(beatK('build', t) / 0.5);
const LANDING_UP: P[] = [[7.3, 9.3], [6.5, 7.5], [5.1, 5.6], [4.5, 3.6], [4.9, 1.5], [5.3, -0.6], [6.2, -3.0]];
export const JUNKS_AT_LANDING = 3;
export const landingJunkAt = (i: number, t: number) => {
  const k = beatK('build', t);
  if (k < -0.1 || k > 1.25) return null;
  const L = lengthOf(LANDING_UP);
  const d = lerp(1.0 + 2.6 * (JUNKS_AT_LANDING - 1), L - 0.4, smooth((k + 0.1) / 1.2)) - i * 2.6;
  if (d < 0) return null;
  return along(LANDING_UP, d);
};

// ------------------------------------------------------------------ 2310: the pots, the elephant, the gate
export const POTS = 12;
export const POT_Z = GATE[1] + 2.9;
export const potX = (i: number) => GATE[0] + (i - (POTS - 1) / 2) * 0.62;
/** 0 standing, 0..1 flying apart, > 1 gone */
export const potBreak = (i: number, t: number) => (beatK('smash', t) - (0.04 + i * 0.024)) / 0.06;
export const SOLDIERS = 24;
const soldierHome = (i: number): P => [GATE[0] + ((i % 8) - 3.5) * 0.62, POT_Z + 0.9 + Math.floor(i / 8) * 0.62];
/** each soldier's path: from his row behind the pots, over the causeway, in through the gate */
export const soldierAt = (i: number, t: number) => {
  const k = beatK('smash', t);
  if (k < -0.1 || k > 1.2) return null;
  const home = soldierHome(i);
  const path: P[] = [home, [GATE[0] + (home[0] - GATE[0]) * 0.25, GATE[1] + 1.6], [GATE[0] + ((i % 3) - 1) * 0.35, GATE[1] - 0.6], [GATE[0] + ((i % 5) - 2) * 0.7, GATE[1] - 3.4]];
  const L = lengthOf(path);
  const start = 0.5 + (i % 8) * 0.012 + Math.floor(i / 8) * 0.04;
  const d = L * smooth((k - start) / 0.42);
  return {...along(path, d), moving: k > start && k < start + 0.42, rot0: Math.PI};
};
/** the elephant: from the fields to the gate (k 0.3-0.46), breaks it, walks in */
const ELE_PATH: P[] = [[GATE[0] + 3.2, POT_Z + 2.6], [GATE[0] + 0.2, GATE[1] + 2.0], [GATE[0], GATE[1] + 0.9], [GATE[0], GATE[1] - 2.6]];
export const elephantAt = (t: number) => {
  const k = beatK('smash', t);
  if (k < -0.1 || k > 1.2) return null;
  const L = lengthOf(ELE_PATH);
  const L2 = lengthOf(ELE_PATH.slice(0, 3));
  const d = k < 0.46 ? L2 * smooth((k - 0.28) / 0.18) : L2 + (L - L2) * smooth((k - 0.56) / 0.4);
  return {...along(ELE_PATH, d), moving: (k > 0.28 && k < 0.46) || (k > 0.56 && k < 0.96)};
};
/** the gate's timber doors fall in as the elephant reaches them */
export const gateFall = (t: number) => smooth((beatK('smash', t) - 0.45) / 0.08);

// ------------------------------------------------------------------ 2310: the fleet sails to the sea
export const FLEET_PATH: P[] = [[3.0, 12.3], [2.2, 13.6], ...LOWER, ...ESTUARY.slice(1, 3), [-19.0, 50.6], [-19.4, 53.0]];
const FLEET_L = lengthOf(FLEET_PATH);
export const FLEET = 6;
export const junkAt = (i: number, t: number) => {
  const k = beatK('sail', t);
  if (k < -0.05 || k > 1.1) return null;
  const d = lerp(4 + 3.2 * FLEET, FLEET_L - 2.4, smooth(clamp01(k / 1.0))) - i * 3.2;
  if (d < 0) return null;
  const p = along(FLEET_PATH, d);
  // fades out past the tile's edge into the Gulf
  return {...p, fade: 1 - smooth((d - (FLEET_L - 4.0)) / 1.6)};
};

// ------------------------------------------------------------------ 2377: the wall down, its stones up to Noen Wong
export const moveK = (t: number) => beatK('move', t);
export const nwFortK = (t: number) => smooth((beatK('move', t) - 0.25) / 0.6);
export const mouthFortK = (t: number) => smooth((beatK('move', t) - 0.2) / 0.5);
export const CARRIERS = 16;
const NW_L = lengthOf(NW_PATH);
export const carrierAt = (i: number, t: number) => {
  const k = beatK('move', t);
  if (k < 0 || k > 1.1) return null;
  const d = lerp(0, NW_L + 3, smooth(clamp01((k - 0.02) / 0.95))) - i * 0.85;
  if (d < 0 || d > NW_L - 0.2) return null;
  return {...along(NW_PATH, d), fade: clamp01((NW_L - 0.2 - d) / 0.8)};
};
/** the little church on the west bank goes, and one stands on the east bank */
export const churchCrossK = (t: number) => smooth((beatK('move', t) - 0.4) / 0.35);

// ------------------------------------------------------------------ 2419: back down to Ban Lum, the waterfront row
const BACK = [...NW_PATH].reverse();
export const RETURNERS = 14;
export const returnerAt = (i: number, t: number) => {
  const k = beatK('return', t);
  if (k < 0 || k > 1.1) return null;
  const d = lerp(0, NW_L + 2, smooth(clamp01(k / 0.5))) - i * 0.85;
  if (d < 0 || d > NW_L - 0.1) return null;
  return {...along(BACK, d), fade: clamp01((NW_L - 0.1 - d) / 0.8)};
};
/** row house j of the waterfront goes up at its own moment in the return beat (drawn from then on) */
export const ROW = 18;
export const rowK = (j: number, t: number, Y: number) => (Y > 1877 ? 1 : smooth((beatK('return', t) - 0.42 - (j / ROW) * 0.4) / 0.14));
/** the row's houses: along the river's west bank, from the bridge-to-be down past the cathedral reach */
export const rowSpots = (() => {
  const out: {x: number; z: number; rot: number}[] = [];
  const reach: P[] = RIVER.slice(16, 21); // (4.5, 3.6) .. (7.0, 10.8) in places.ts, south of where ถ.ท่าหลวง crosses
  const L = lengthOf(reach);
  for (let j = 0; j < ROW; j++) {
    const d = 1.2 + (j / (ROW - 1)) * (L - 2.6);
    const p = along(reach, d);
    // the west bank: to the right of the flow when it runs south (the normal points west)
    const nx = -Math.cos(p.rot);
    const nz = Math.sin(p.rot);
    out.push({x: p.x + nx * 1.4, z: p.z + nz * 1.4, rot: p.rot});
  }
  return out;
})();

// ------------------------------------------------------------------ 2436 / 2447: the French flag and the ship
export const frenchHouseK = (t: number, Y: number) => (Y > 1894 ? 1 : smooth(beatK('occupy', t) / 0.3));
export const frenchFlag = (t: number, Y: number) => {
  if (Y < 1893) return 0;
  const up = smooth((beatK('occupy', t) - 0.25) / 0.5);
  const down = smooth((beatK('leave', t) - 0.05) / 0.35);
  return up * (1 - down);
};
export const siamFlag = (t: number, Y: number) => (Y > 1905 ? 1 : smooth((beatK('leave', t) - 0.45) / 0.4));
const LANDING: P = [3.9, -0.8];
export const FRENCH = 10;
const FR_PATH: P[] = [LANDING, [1.6, -0.9], [FRENCH_HOUSE[0] + 0.8, FRENCH_HOUSE[1] + 0.2]];
const FR_L = lengthOf(FR_PATH);
export const frenchAt = (i: number, t: number) => {
  const ko = beatK('occupy', t);
  const kl = beatK('leave', t);
  if (ko >= 0 && kl < 0) {
    const d = lerp(0, FR_L, smooth(clamp01(ko / 0.7))) - i * 0.45;
    if (d < 0) return null;
    return {...along(FR_PATH, Math.min(d, FR_L - 0.05 - (i % 3) * 0.3)), moving: ko < 0.75};
  }
  if (kl >= 0 && kl < 1.05) {
    const back = [...FR_PATH].reverse();
    const d = lerp(0, FR_L, smooth(clamp01(kl / 0.55))) - i * 0.45;
    if (d > FR_L - 0.1) return null; // boarded
    return {...along(back, Math.max(0, d)), moving: kl < 0.6};
  }
  return null;
};
const SHIP_PATH: P[] = [[5.3, -0.6], ...RIVER.slice(15, 25), ...LOWER.slice(1, 4)];
const SHIP_L = lengthOf(SHIP_PATH);
export const steamerAt = (t: number) => {
  const k = beatK('leave', t);
  if (k < 0 || k > 1.1) return null;
  const d = lerp(0, SHIP_L - 0.5, smooth(clamp01((k - 0.5) / 0.6)));
  return {...along(SHIP_PATH, d), moving: k > 0.5};
};
export const tuekDaengK = (t: number, Y: number) => (Y > 1894 ? 1 : smooth(beatK('occupy', t) / 0.4));

// ------------------------------------------------------------------ ราว 2452: the cathedral
export const naveK = (t: number, Y: number) => (Y > 1913 ? 1 : smooth(beatK('raise', t) / 0.4));
/** the spires: up in the raise beat, down in the war, back up late in the grow shot (no years on screen) */
export const spireK = (t: number, Y: number) => {
  const up = Y > 1913 ? 1 : smooth((beatK('raise', t) - 0.3) / 0.5);
  const war = smooth((Y - 1941) / 3) * (1 - smooth((Y - 2003) / 4));
  return up * (1 - war);
};

// ------------------------------------------------------------------ the grow shot: orchards
export const orchardK = (t: number, Y: number) => (Y > 2018 ? 1 : smooth((beatK('grow', t) - 0.1) / 0.6));

// ------------------------------------------------------------------ the payoff: the gem market and the stone back
export const MARKET_PEOPLE = 26;
const STREET: P[] = [[SI_CHAN[0][0] + 0.2, SI_CHAN[0][1] + 0.05], [SI_CHAN[1][0] - 0.2, SI_CHAN[1][1] + 0.05]];
const STREET_L = lengthOf(STREET);
/** shoppers stroll up and down the street between the tables */
export const shopperAt = (i: number, t: number) => {
  const k = (t - beatAt('trade', 0)) * 0.32 + i * 0.37;
  const ph = ((k % 2) + 2) % 2;
  const u = ph < 1 ? ph : 2 - ph;
  const p = along(STREET, u * STREET_L);
  const lane = ((i % 4) - 1.5) * 0.16;
  return {x: p.x, z: p.z + lane, rot: ph < 1 ? Math.PI / 2 : -Math.PI / 2};
};
export const GEM_BACK: [number, number, number] = [MARKET[0] + 0.2, 4.2, MARKET[1]];
export const gemBackK = (t: number) => smooth((beatK('trade', t) - 0.05) / 0.2);
export const MARKET_ON = 2024.5;

export const ACTORS: Actor[] = [
  {id: 'yellowSapphire', role: 'hero', during: [0, 2.5], size: 0.4 * HERO_S, at: (t) => {
    const g = gemAt(t);
    return [g.x, g.y + 0.3 * g.s, g.z];
  }},
  {id: 'gemToKhaoPloiWaen', during: [2.5, 6.0], size: 6, at: (t) => {
    const g = gemAt(t);
    return [g.x, g.y + 0.3 * g.s, g.z];
  }},
  {id: 'wallRises', during: [beatAt('build', 0.02), beatAt('build', 0.55)], size: 6, at: () => [-4, 1, -8]},
  {id: 'junksAtLanding', during: [beatAt('build', 0.2), beatAt('build', 1)], size: 1.6, at: (t) => {
    const j = landingJunkAt(0, t);
    return j ? [j.x, 0.8, j.z] : null;
  }},
  {id: 'potsSmashed', during: [beatAt('smash', 0.02), beatAt('smash', 0.35)], size: 3.6, at: () => [GATE[0], 0.5, POT_Z]},
  {id: 'elephantAtGate', during: [beatAt('smash', 0.28), beatAt('smash', 0.6)], size: 1.6, at: (t) => {
    const e = elephantAt(t);
    return e ? [e.x, 1.0, e.z] : null;
  }},
  {id: 'torchesPourIn', during: [beatAt('smash', 0.55), beatAt('smash', 0.98)], size: 2, at: (t) => {
    const s = soldierAt(12, t);
    return s ? [s.x, 0.8, s.z] : null;
  }},
  {id: 'fleet', during: [beatAt('sail', 0.02), beatAt('sail', 0.95)], size: 2, at: (t) => {
    const j = junkAt(0, t);
    return j ? [j.x, 1.0, j.z] : null;
  }},
  {id: 'stonesToNoenWong', during: [beatAt('move', 0.05), beatAt('move', 0.95)], size: 1.6, at: (t) => {
    for (let i = 0; i < CARRIERS; i++) {
      const c = carrierAt(i, t);
      if (c) return [c.x, 0.8, c.z];
    }
    return null;
  }},
  {id: 'noenWongRises', during: [beatAt('move', 0.25), beatAt('move', 0.9)], size: 3, at: () => [NOEN_WONG[0], 1.6, NOEN_WONG[1]]},
  {id: 'peopleReturn', during: [beatAt('return', 0.02), beatAt('return', 0.5)], size: 1.6, at: (t) => {
    for (let i = 0; i < RETURNERS; i++) {
      const c = returnerAt(i, t);
      if (c) return [c.x, 0.8, c.z];
    }
    return null;
  }},
  {id: 'waterfrontRow', during: [beatAt('return', 0.58), beatAt('return', 0.98)], size: 2, at: () => [rowSpots[9].x, 0.6, rowSpots[9].z]},
  {id: 'frenchMarchIn', during: [beatAt('occupy', 0.02), beatAt('occupy', 0.7)], size: 1.4, at: (t) => {
    const f = frenchAt(0, t);
    return f ? [f.x, 0.8, f.z] : null;
  }},
  {id: 'frenchFlag', during: [beatAt('occupy', 0.25), beatAt('leave', 0.4)], size: 1.2, at: () => [FRENCH_HOUSE[0], 3.0, FRENCH_HOUSE[1]]},
  {id: 'shipLeaves', during: [beatAt('leave', 0.5), beatAt('leave', 1)], size: 1.6, at: (t) => {
    const s = steamerAt(t);
    return s ? [s.x, 0.8, s.z] : null;
  }},
  {id: 'siamFlag', during: [beatAt('leave', 0.4), beatAt('leave', 0.9)], size: 1.2, at: () => [FRENCH_HOUSE[0], 3.0, FRENCH_HOUSE[1]]},
  {id: 'cathedralRises', during: [beatAt('raise', 0.02), beatAt('raise', 0.85)], size: 2.4, at: () => [CATHEDRAL[0] + 1.6, 2.0, CATHEDRAL[1]]},
  {id: 'townGrows', during: [beatAt('grow', 0), beatAt('grow', 1)], size: 16, at: () => [-6, 1.5, 4]},
  {id: 'marketCrowd', during: [beatAt('trade', 0.02), STORY.at('today')[1]], size: 1.4, at: (t) => {
    const s = shopperAt(0, t);
    return [s.x, 0.8, s.z];
  }},
  {id: 'gemBack', role: 'callback', during: [beatAt('trade', 0.2), beatAt('trade', 1)], size: 1.2, at: () => GEM_BACK},
];
