import {ramp} from '../lib';
import type {CityLayout} from './types';

// Roads, road bridges and where the cars are, as plain functions: Diorama draws
// them and scripts/check_story.mjs checks them (no car on open water).

export const RING = (L: CityLayout) => [L.city.hx + 3.1, L.city.hz + 3.1] as const;

export type Seg = {a: [number, number]; b: [number, number]; width: number; k: number};

export const riverSpan = (L: CityLayout, r: CityLayout['rivers'][number]) =>
  r.span ?? (r.axis === 'z' ? [L.tile.z0, L.tile.z1] : [L.tile.x0, L.tile.x1]);

/** Every drivable segment standing in year Y: the ring road's four sides and each built road. */
export const driveSegments = (L: CityLayout, Y: number): Seg[] => {
  const out: Seg[] = [];
  const ring = ramp(Y, L.ringRoadYear, L.ringRoadYear + 8);
  if (ring > 0) {
    const [rx, rz] = RING(L);
    const sides: [[number, number], [number, number]][] = [
      [[rx, -rz], [rx, rz]],
      [[rx, rz], [-rx, rz]],
      [[-rx, rz], [-rx, -rz]],
      [[-rx, -rz], [rx, -rz]],
    ];
    for (const [a, b] of sides) out.push({a, b, width: 1.2, k: ring});
  }
  for (const r of L.roads) {
    const k = ramp(Y, r.year - 3, r.year);
    if (k > 0) out.push({a: r.from, b: [r.from[0] + (r.to[0] - r.from[0]) * k, r.from[1] + (r.to[1] - r.from[1]) * k], width: r.width, k: 1});
  }
  return out;
};

/** Half the width of an explicit `bridges` deck, measured along the river. */
const BRIDGE_HALF = 0.75;

/** Where a road segment crosses a river that no explicit `bridges` entry carries.
 *  An explicit bridge only carries a road whose deck it overlaps: Nakhon Sawan's
 *  ring road crossed the Chao Phraya 3.4 units from the Dechatiwong bridge, an
 *  older tolerance counted that as covered, and the cars drove over bare water. */
export const roadCrossings = (L: CityLayout, s: Seg) => {
  const out: {x: number; z: number; ang: number; len: number}[] = [];
  const [ax, az] = s.a;
  const [bx, bz] = s.b;
  const ang = Math.atan2(bz - az, bx - ax);
  L.rivers.forEach((river, ri) => {
    const across = river.axis === 'z' ? bx - ax : bz - az; // motion across the band
    if (Math.abs(across) < 1e-6) return;
    const u = (river.pos - (river.axis === 'z' ? ax : az)) / across;
    if (u < 0 || u > 1) return;
    const x = ax + (bx - ax) * u;
    const z = az + (bz - az) * u;
    const along = river.axis === 'z' ? z : x;
    const [s0, s1] = riverSpan(L, river);
    if (along < s0 - river.width / 2 || along > s1 + river.width / 2) return;
    const covered = L.bridges.some((br) => (br.river ?? 0) === ri && Math.abs(br.at - along) < BRIDGE_HALF + (s.width + 0.3) / 2);
    if (covered) return;
    const cosA = Math.abs(river.axis === 'z' ? Math.cos(ang) : Math.sin(ang));
    out.push({x, z, ang, len: river.width / Math.max(cosA, 0.3) + 1.4});
  });
  return out;
};

/** On open water, before counting any bridge. */
export const overWater = (L: CityLayout, x: number, z: number) =>
  L.rivers.some((r) => {
    const c = r.axis === 'z' ? x : z;
    const a = r.axis === 'z' ? z : x;
    const [s0, s1] = riverSpan(L, r);
    return Math.abs(c - r.pos) < r.width / 2 + 0.2 && a > s0 - r.width / 2 && a < s1 + r.width / 2;
  });

/** A bridge deck a car can drive on: centre, direction of travel, half length/width, top. */
export type Deck = {x: number; z: number; ang: number; hl: number; hw: number; top: number};

/** Every finished deck in year Y: explicit `bridges` and the generated road bridges. */
export const decks = (L: CityLayout, Y: number): Deck[] => {
  const out: Deck[] = [];
  for (const b of L.bridges) {
    if (ramp(Y, b.year, b.year + 3) < 0.99) continue;
    const river = L.rivers[b.river ?? 0];
    const [x, z] = river.axis === 'z' ? [river.pos, b.at] : [b.at, river.pos];
    out.push({x, z, ang: river.axis === 'z' ? 0 : Math.PI / 2, hl: (river.width + 1.4) / 2, hw: BRIDGE_HALF, top: 0.55});
  }
  for (const s of driveSegments(L, Y)) {
    if (s.k < 0.99) continue;
    for (const c of roadCrossings(L, s)) out.push({x: c.x, z: c.z, ang: c.ang, hl: c.len / 2, hw: (s.width + 0.3) / 2, top: 0.14});
  }
  return out;
};

const onDeck = (d: Deck, x: number, z: number) => {
  const [dx, dz] = [x - d.x, z - d.z];
  const [c, s] = [Math.cos(d.ang), Math.sin(d.ang)];
  return Math.abs(dx * c + dz * s) <= d.hl && Math.abs(-dx * s + dz * c) <= d.hw;
};

export const MAX_CARS = 48;

/** Car i in year Y at this frame: on a built road, back and forth, riding up onto a
 *  bridge deck over water. `wet` marks a car over water with no deck under it; it is
 *  not drawn, and the story check fails the city. */
export const carAt = (L: CityLayout, Y: number, frame: number, i: number, segs = driveSegments(L, Y).filter((s) => s.k > 0.99), dk = decks(L, Y)) => {
  const n = Math.floor(ramp(Y, L.cars[0], L.cars[1]) * MAX_CARS);
  if (i >= n || !segs.length) return null;
  const s = segs[i % segs.length];
  const [ax, az] = s.a;
  const [bx, bz] = s.b;
  const len = Math.hypot(bx - ax, bz - az);
  if (len < 1) return null;
  const dir = i % 2 ? 1 : -1;
  const ph = (((i * 9.7 + frame * (0.12 + (i % 4) * 0.03)) / len) % 2 + 2) % 2; // 0..2, ping-pong
  const u = ph < 1 ? ph : 2 - ph;
  const back = (ph < 1) === (dir < 0);
  const t = back ? 1 - u : u;
  const ang = Math.atan2(bz - az, bx - ax);
  const lane = (back ? -1 : 1) * 0.25;
  const x = ax + (bx - ax) * t - Math.sin(ang) * lane;
  const z = az + (bz - az) * t + Math.cos(ang) * lane;
  const wetHere = overWater(L, x, z);
  const deck = wetHere ? dk.find((d) => onDeck(d, x, z)) : undefined;
  return {x, z, ang, y: deck ? deck.top + 0.16 : 0.22, wet: wetHere && !deck};
};
