// Pure position math for Phuket's moving things (src/engine/actors.ts): the cover's two turtles,
// Bowrey's elephants and the tin boat, the 2328 siege, the miners down the canal, the shophouses
// going up, the dredge, the first cars over Sarasin, and the turtles back at Mai Khao.
// Landmarks.tsx draws from these; check_story projects them.
import type {Actor, ActorCtx} from '../../engine/actors';
import {lerp, ramp, smooth} from '../../lib';
import {BANG_YAI, BIG_BUDDHA, BRIDGE_X, BURMESE_CAMP, DREDGE, EDGE, LANDING, MAI_KHAO, MAINLAND_Z, NORTH_ROAD, OLD_TOWN_X, SHIP_AT, STOCKADE, THALANG_RD_Z, TRACK} from './places';
import {STORY} from './timeline';

type P = [number, number];
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

// seconds at a share of a beat, so the actor windows follow a retime
const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
const gy = (ctx: ActorCtx, x: number, z: number) => ctx.ground?.(x, z) ?? 0;

// ------------------------------------------------------------------ the cover
// a leatherback and a green turtle haul out of the Andaman at hero scale (style frame
// PhuketStyleMixed) and dig in, sinking into the sand, across 2.2-3.4 s, before the caption.
// Their fore-flippers reach ~3.6 x scale (leatherback) and ~2.7 x (green) to each side, so the
// lanes sit far enough apart that they never touch.
export const HEROES = [
  {kind: 'leatherback' as const, z: -27, s: 6.0, lag: 0, ph: 0},
  {kind: 'green' as const, z: 5, s: 4.8, lag: -2.0, ph: 0.9},
];
// the dig: from 2.2 s each sinks into its body pit over two seconds and leaves a mound of thrown
// sand behind, rather than vanishing ([local] on #59 measured a 0.2-s cut at 3.1-3.3 s)
export const heroK = (t: number) => 1 - smooth(ramp(t, 2.2, 4.2));
export const DIG_END = 4.2;
// x of a hero turtle's centre: it hauls out of the sea over the tile's west edge (the Andaman
// shore) and crawls inland up the beach until it digs in
export const heroX = (h: (typeof HEROES)[number], t: number) => -EDGE - 3 + h.lag + 1.9 * Math.min(t, 3.0);

// ------------------------------------------------------------------ 1675
// Bowrey's ship rides in the bay; two of the Raja's elephants carry its captain up the forest
// track to Luppoone with a file of the lifeguard, while a boat ferries tin out to the ship
const TRACK_LEN = lengthOf(TRACK);
export const ELEPHANTS = 2;
export const GUARDS = 8;
export const tinOn = (Y: number) => Y >= 1660 && Y < 1700;
export const elephantAt = (i: number, {Y, beat}: ActorCtx) => {
  const p = beat('tin');
  if (!tinOn(Y) || p < 0.36 || p >= 1) return null;
  const d = smooth(ramp(p, 0.4, 0.98)) * TRACK_LEN - i * 2.2;
  return d < 0 ? null : along(TRACK, Math.min(d, TRACK_LEN));
};
export const guardAt = (i: number, {Y, beat}: ActorCtx) => {
  const p = beat('tin');
  if (!tinOn(Y) || p < 0.36 || p >= 1) return null;
  const d = smooth(ramp(p, 0.4, 0.98)) * TRACK_LEN + 1.4 - i * 0.7 - (i >= 4 ? 4.4 : 0);
  return d < 0 ? null : along(TRACK, Math.min(d, TRACK_LEN));
};
// the tin boat shuttles from the landing out to the ship and back
export const tinBoatAt = (t: number, {Y}: ActorCtx) => {
  if (!tinOn(Y)) return null;
  const u = 0.5 - 0.5 * Math.cos(t * 0.9);
  return {x: lerp(LANDING[0] + 1.2, SHIP_AT[0] - 1.0, u), z: lerp(LANDING[1] - 2.0, SHIP_AT[1] + 2.4, u), rot: 0.3};
};

// ------------------------------------------------------------------ 1785
// The Burmese army (a block of soldiers) marches from its boats in the north-west to the camp
// on the field, presses toward the stockade, is held there, and withdraws back north-west.
// A column marches out of the stockade with flashing blades (the women of the legend).
export const siegeOn = (Y: number) => Y >= 1785 && Y < 1785.46;
export const ARMY_ROWS = 6;
export const ARMY_COLS = 9;
const ARMY_FROM: P = [-26, -42];
export const armyCentre = ({Y, beat}: ActorCtx): {x: number; z: number; rot: number} | null => {
  const p = beat('siege');
  if (!siegeOn(Y) || p <= 0 || p >= 1) return null;
  const tx = (a: P, b: P, u: number) => ({x: lerp(a[0], b[0], u), z: lerp(a[1], b[1], u)});
  const front: P = [lerp(BURMESE_CAMP[0], STOCKADE[0], 0.55), lerp(BURMESE_CAMP[1], STOCKADE[1], 0.55)];
  let q: {x: number; z: number};
  if (p < 0.3) q = tx(ARMY_FROM, BURMESE_CAMP, smooth(ramp(p, 0, 0.28)));
  else if (p < 0.55) q = tx(BURMESE_CAMP, front, smooth(ramp(p, 0.3, 0.5)));
  else if (p < 0.72) q = {x: front[0], z: front[1]};
  else q = tx(front, ARMY_FROM, smooth(ramp(p, 0.72, 1)));
  const toward = p < 0.72 ? STOCKADE : ARMY_FROM;
  return {...q, rot: Math.atan2(toward[0] - q.x, toward[1] - q.z)};
};
// the legend's column: out of the stockade's west gate, along its front and back in, on a loop
export const COLUMN = 18;
const LOOP: P[] = [[STOCKADE[0] - 1.6, STOCKADE[1]], [STOCKADE[0] - 3.4, STOCKADE[1] + 1.6], [STOCKADE[0] - 3.4, STOCKADE[1] - 2.2], [STOCKADE[0] - 1.6, STOCKADE[1] - 1.2]];
const LOOP_C = [...LOOP, LOOP[0]];
const LOOP_LEN = lengthOf(LOOP_C);
export const columnAt = (i: number, t: number, {Y, beat}: ActorCtx) => {
  const p = beat('siege');
  if (!siegeOn(Y) || p < 0.32 || p > 0.86) return null;
  const d = (((t - beatAt('siege', 0.32)) * 1.3 - i * 0.55) % LOOP_LEN + LOOP_LEN) % LOOP_LEN;
  if ((t - beatAt('siege', 0.32)) * 1.3 - i * 0.55 < 0) return null;
  return along(LOOP_C, d);
};
// cannon smoke from the stockade while the army presses
export const cannonK = (t: number, {Y, beat}: ActorCtx) => {
  const p = beat('siege');
  return siegeOn(Y) && p > 0.4 && p < 0.75 ? (t * 1.6) % 1 : -1;
};

// ------------------------------------------------------------------ 1849-1869
// Hokkien miners walk from Kathu down the canal; the pits open along it as the years go by,
// and the new town grows at its foot
const CANAL_LEN = lengthOf(BANG_YAI);
export const MINERS = 14;
export const minerAt = (i: number, {Y, beat}: ActorCtx) => {
  const p = beat('mines');
  if (Y < 1849 || p <= 0 || p >= 1) return null;
  const d = smooth(ramp(p, 0.02, 0.9)) * (CANAL_LEN * 0.62 + 6) - i * 0.7;
  if (d < 0) return null;
  return along(BANG_YAI, Math.min(d, CANAL_LEN * 0.62));
};
// pits along the canal's upper half: [distance along the canal, side]
export const PITS = Array.from({length: 9}, (_, i) => ({d: 1.5 + i * 2.1, side: i % 2 ? 1 : -1, year: 1849 + i * 2.2}));
export const pitAt = (i: number) => {
  const q = along(BANG_YAI, PITS[i].d);
  const nx = Math.cos(q.rot);
  const nz = -Math.sin(q.rot);
  return {x: q.x + nx * 1.6 * PITS[i].side, z: q.z + nz * 1.6 * PITS[i].side};
};
// pits close (and fill with water) once the mines end
export const pitK = (i: number, Y: number) => (Y < PITS[i].year ? 0 : Y < 1992 ? smooth(ramp(Y, PITS[i].year, PITS[i].year + 1.5)) : 1);

// ------------------------------------------------------------------ 1901-1906
// the shophouse rows rise along ถลาง (and ดีบุก, กระบี่ behind it), house by house from the east
export const SHOP_N = 14;
export const shopK = (i: number, Y: number, {beat}: ActorCtx) => {
  if (Y < 1901) return 0;
  if (Y > 1906.5) return 1;
  const p = beat('oldtown');
  return smooth(ramp(p, 0.04 + (i / SHOP_N) * 0.6, 0.16 + (i / SHOP_N) * 0.6));
};
export const shopX = (i: number) => lerp(OLD_TOWN_X[1] - 0.6, OLD_TOWN_X[0] + 0.6, i / (SHOP_N - 1));

// ------------------------------------------------------------------ 1909
// the dredge works Tongkah Bay from 1909 until the mines close (1992)
export const dredgeOn = (Y: number) => Y >= 1909 && Y < 1992;

// ------------------------------------------------------------------ 1967
// From ferry to bridge (owner: the old beat "lingered and told no story", and its three hero-scale
// cars were wider than the bridge). The beat opens on the car ferry, until then the only way
// over the strait, shuttling across; the bridge spans out from the mainland to the island over
// it; then a stream of cars at road scale pours over and down the road onto the island.
export const sarasinK = (Y: number, {beat}: ActorCtx) => (Y < 1967 ? 0 : Y > 1967.46 ? 1 : smooth(ramp(beat('bridge'), 0.08, 0.5)));
export const FERRY_X = BRIDGE_X + 4.5;
export const ferryAt = (t: number, {Y, beat}: ActorCtx) => {
  const p = beat('bridge');
  if (Y < 1960 || Y > 1967.46 || p > 0.6) return null;
  // across and back on a slow, eased shuttle; it fades out of use as the bridge opens
  const u = 0.5 - 0.5 * Math.cos(t * 1.4);
  return {x: FERRY_X, z: lerp(MAINLAND_Z[1] - 1.2, -EDGE - 1.2, u), k: 1 - smooth(ramp(p, 0.45, 0.6))};
};
const ROAD_IN: P[] = [[BRIDGE_X, MAINLAND_Z[1] - 6], ...[...NORTH_ROAD].reverse()];
const ROAD_LEN = lengthOf(ROAD_IN);
export const CARS = 14;
export const CAR_GAP = 2.0;
export const carAt = (i: number, t: number, {Y, beat}: ActorCtx) => {
  const p = beat('bridge');
  if (Y < 1967 || Y > 1967.46 || p < 0.45 || p >= 1) return null;
  const d = (t - beatAt('bridge', 0.45)) * 5 - i * CAR_GAP;
  if (d < 0 || d > ROAD_LEN) return null;
  return along(ROAD_IN, d);
};

// ------------------------------------------------------------------ 1973-2015
export const growing = (Y: number) => Y >= 1973 && Y <= 2015.5;

// ------------------------------------------------------------------ the payoff
// Mai Khao today, on the north shore: the leatherback mother goes back to the sea (north) from her
// nest with her hatchlings, and west along the beach people let young green turtles go (style
// frame PhuketStyleMixedCallback, drawn smaller here so the beach holds them)
// from 2024 on, through the landing on today (it is the last thing moving before the card)
export const payoffOn = (Y: number) => Y >= 2024;
export const SHORE_Z = -EDGE;
export const MOTHER = {x: MAI_KHAO[0] - 6, s: 2.0};
// the mother's z: from her nest up the beach, down to the water and out
export const motherZ = (t: number, ctx: ActorCtx) =>
  SHORE_Z + 6 - Math.min(7, 1.2 * Math.max(0, t - beatAt('turtles', 0)) * (ctx.beat('turtles') > 0 ? 1 : 0));
export const HATCH_N = 10;
export const hatchAt = (i: number, t: number) => {
  const x = MOTHER.x - 3.2 - (((i * 7) % HATCH_N) / HATCH_N) * 2.8;
  const d = Math.max(0, t - beatAt('turtles', 0) - (i % 4) * 0.3);
  const z = SHORE_Z + 6 - ((i * 0.37) % 1) * 1.5 - d * 1.2;
  return z < SHORE_Z - 1.4 ? null : {x, z};
};
export const RELEASE_N = 6;
export const releaseAt = (i: number) => ({x: MOTHER.x - 8.5 - i * 1.6, z: SHORE_Z + 3.6 + (i % 2) * 0.9});

const CENTRE: P = [-2, -4];
export const ACTORS: Actor[] = [
  {
    id: 'heroTurtles',
    role: 'hero',
    during: [0, 2.2],
    size: 14,
    at: (t) => (heroK(t) > 0.02 ? [heroX(HEROES[0], t) + 2, 4, (HEROES[0].z + HEROES[1].z) / 2] : null),
  },
  // the two sinking into the sand after the hero window, so the cover never cuts to an empty frame
  {id: 'heroesDig', during: [2.2, 3.1], size: 10, at: (t) => (heroK(t) > 0.02 ? [heroX(HEROES[0], t), 1.5, HEROES[0].z] : null)},
  {id: 'elephants', during: [beatAt('tin', 0.42), beatAt('tin', 0.97)], size: 2.2, at: (t, ctx) => {
    const e = elephantAt(0, ctx);
    return e ? [e.x, gy(ctx, e.x, e.z) + 1.8, e.z] : null;
  }},
  {id: 'burmeseArmy', during: [beatAt('siege', 0.02), beatAt('siege', 0.98)], size: 3, at: (t, ctx) => {
    const a = armyCentre(ctx);
    return a ? [a.x, gy(ctx, a.x, a.z) + 0.6, a.z] : null;
  }},
  {id: 'column', during: [beatAt('siege', 0.34), beatAt('siege', 0.85)], size: 2, at: (t, ctx) => {
    const c = columnAt(0, t, ctx);
    return c ? [c.x, gy(ctx, c.x, c.z) + 0.6, c.z] : null;
  }},
  {id: 'miners', during: [beatAt('mines', 0.05), beatAt('mines', 0.9)], size: 1.6, at: (t, ctx) => {
    const m = minerAt(0, ctx);
    return m ? [m.x, gy(ctx, m.x, m.z) + 0.6, m.z] : null;
  }},
  {id: 'shophouses', during: [beatAt('oldtown', 0.06), beatAt('oldtown', 0.75)], size: 1.6, at: (t, ctx) => {
    for (let i = 0; i < SHOP_N; i++) {
      const k = shopK(i, ctx.Y, ctx);
      if (k > 0.02 && k < 0.98) return [shopX(i), 0.8, THALANG_RD_Z];
    }
    return null;
  }},
  {id: 'dredge', during: 'dredge', size: 3, at: (t, ctx) => (dredgeOn(ctx.Y) ? [DREDGE[0], 1.5, DREDGE[1]] : null)},
  // the bridge going out over the strait (half its length), then the stream of traffic on it
  {id: 'bridgeBuilt', during: [beatAt('bridge', 0.06), beatAt('bridge', 0.5)], size: 4, at: (t, ctx) => {
    const k = sarasinK(ctx.Y, ctx);
    return k > 0.02 && k < 0.99 ? [BRIDGE_X, 0.4, MAINLAND_Z[1] + (k * (MAINLAND_Z[1] - -EDGE)) * -1] : null;
  }},
  {id: 'traffic', during: [beatAt('bridge', 0.5), beatAt('bridge', 0.97)], size: 3, at: (t, ctx) => {
    for (const i of [3, 0]) {
      const c = carAt(i, t, ctx);
      if (c) return [c.x, 0.6, c.z];
    }
    return null;
  }},
  // the town grows under the wide shot; then the camera comes down to the Big Buddha going up
  {id: 'cityGrowing', during: [beatAt('growth', 0), beatAt('growth', 0.68)], size: 12, at: (t, ctx) => (growing(ctx.Y) ? [CENTRE[0], 1.5, CENTRE[1]] : null)},
  {id: 'bigBuddha', during: [beatAt('growth', 0.72), beatAt('growth', 1)], size: 2.6, at: (t, ctx) => (ctx.Y >= 2002 ? [BIG_BUDDHA[0], gy(ctx, BIG_BUDDHA[0], BIG_BUDDHA[1]) + 3, BIG_BUDDHA[1]] : null)},
  {id: 'turtlesReturn', role: 'callback', during: 'turtles', size: 3, at: (t, ctx) => (payoffOn(ctx.Y) ? [MOTHER.x, 0.6, motherZ(t, ctx)] : null)},
  {id: 'release', during: [beatAt('turtles', 0.1), beatAt('today', 1)], size: 2.5, at: (t, ctx) => {
    if (!payoffOn(ctx.Y)) return null;
    const r = releaseAt(2);
    return [r.x, 1.2, r.z];
  }},
];
