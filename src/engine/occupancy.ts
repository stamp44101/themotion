// One map of who stands where, and when, for everything the engine places.
//
// Every generator used to carry its own partial keep-outs (inRiver, onRoad, onSite,
// openGround, wet() in Life.tsx, ...), and each missed something: houses on a chedi,
// crowds on the Ping, blocks over the kerb, towers through standing trees. Now every
// footprint is *claimed* here first. A claim records a kind and the years it stands;
// a higher-priority claim evicts a lower one from the year it arrives (a block built in
// 1990 fells the tree under it in 1989), and a lower claim landing on a higher one is
// cut short or refused.
//
// The same structure audits a finished layout (`audit()`), including layouts produced
// by older engines: record every placed object without rules, then report every pair
// that the rules forbid. check_story runs that over each city.
import {RING} from './roads';
import {isPathRiver, riverSegments, riverSpan} from './river';
import type {CityLayout} from './types';

export type Kind =
  | 'water'
  | 'site' // a landmark's ground: nothing generated stands on it
  | 'open' // ground the sprawl must leave open: airfields, parks, plazas
  | 'road'
  | 'rail'
  | 'station'
  | 'landmark' // a hand-placed landmark part with its own years
  | 'building'
  | 'house'
  | 'hut'
  | 'life' // people, stalls, animals: never claimed, only queried
  | 'tree';

/** Higher evicts lower. Same kind never blocks itself (blocks jitter into each other today
 *  and nobody has minded; fixing that would move every posted city). */
export const PRIORITY: Record<Kind, number> = {
  water: 9,
  site: 8,
  open: 8,
  road: 7,
  rail: 7,
  station: 7,
  landmark: 6,
  building: 5,
  house: 5,
  hut: 4,
  life: 2,
  tree: 1,
};

/** What a standing occupant forbids on top of it. Not listed, and allowed: roads and
 *  the rail cross water on bridges the engine builds; a site or open ground may include
 *  water; the station is placed beside the rail by construction (stationPos). Bridges,
 *  boats and cars never go through the map, so water and roads do not need to allow them. */
const FORBIDS: Record<Kind, Kind[]> = {
  water: ['station', 'landmark', 'building', 'house', 'hut', 'life', 'tree'],
  site: ['building', 'house', 'hut'],
  open: ['building', 'house', 'hut'],
  road: ['building', 'house', 'hut', 'station', 'tree'],
  rail: ['building', 'house', 'hut', 'tree', 'life'],
  station: ['building', 'house', 'hut', 'tree', 'life'],
  landmark: ['building', 'house', 'hut', 'tree', 'life'],
  building: ['house', 'hut', 'tree'],
  house: ['hut', 'tree'],
  hut: ['tree'],
  life: [],
  tree: [],
};
export const forbids = (under: Kind, over: Kind) => FORBIDS[under].includes(over);

export type Footprint =
  | {rect: [number, number, number, number]} // x, z, w, d (axis aligned)
  | {disc: [number, number, number]} // x, z, r
  | {band: [[number, number], [number, number], number]}; // a, b, width

export type Claim = {
  kind: Kind;
  from: number;
  to: number;
  /** who owns it, for the audit's report */
  label?: string;
  /** called when a higher claim lands on this one from `year` on */
  onEvict?: (year: number) => void;
};

export type Conflict = {under: Kind; over: Kind; count: number; at: [number, number]; year: number; labels: [string, string]};

export class Occupancy {
  readonly cell: number;
  readonly nx: number;
  readonly nz: number;
  private readonly cells: (Claim[] | undefined)[];
  constructor(
    readonly tile: CityLayout['tile'],
    cell = 0.5,
  ) {
    this.cell = cell;
    this.nx = Math.ceil((tile.x1 - tile.x0) / cell);
    this.nz = Math.ceil((tile.z1 - tile.z0) / cell);
    this.cells = new Array(this.nx * this.nz);
  }

  private index(x: number, z: number) {
    const i = Math.floor((x - this.tile.x0) / this.cell);
    const j = Math.floor((z - this.tile.z0) / this.cell);
    if (i < 0 || j < 0 || i >= this.nx || j >= this.nz) return -1;
    return j * this.nx + i;
  }

  /** Cell indices whose centre lies inside the footprint, grown by `pad`. */
  cellsOf(fp: Footprint, pad = 0): number[] {
    const out: number[] = [];
    let x0: number, x1: number, z0: number, z1: number;
    let inside: (x: number, z: number) => boolean;
    if ('rect' in fp) {
      const [x, z, w, d] = fp.rect;
      const hw = w / 2 + pad;
      const hd = d / 2 + pad;
      [x0, x1, z0, z1] = [x - hw, x + hw, z - hd, z + hd];
      inside = (px, pz) => Math.abs(px - x) < hw && Math.abs(pz - z) < hd;
    } else if ('disc' in fp) {
      const [x, z, r0] = fp.disc;
      const r = r0 + pad;
      [x0, x1, z0, z1] = [x - r, x + r, z - r, z + r];
      inside = (px, pz) => Math.hypot(px - x, pz - z) < r;
    } else {
      const [[ax, az], [bx, bz], w] = fp.band;
      const h = w / 2 + pad;
      [x0, x1, z0, z1] = [Math.min(ax, bx) - h, Math.max(ax, bx) + h, Math.min(az, bz) - h, Math.max(az, bz) + h];
      const dx = bx - ax;
      const dz = bz - az;
      const len2 = dx * dx + dz * dz || 1;
      inside = (px, pz) => {
        const u = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / len2));
        return Math.hypot(px - (ax + u * dx), pz - (az + u * dz)) < h;
      };
    }
    const i0 = Math.max(0, Math.floor((x0 - this.tile.x0) / this.cell));
    const i1 = Math.min(this.nx - 1, Math.floor((x1 - this.tile.x0) / this.cell));
    const j0 = Math.max(0, Math.floor((z0 - this.tile.z0) / this.cell));
    const j1 = Math.min(this.nz - 1, Math.floor((z1 - this.tile.z0) / this.cell));
    for (let j = j0; j <= j1; j++)
      for (let i = i0; i <= i1; i++) {
        const cx = this.tile.x0 + (i + 0.5) * this.cell;
        const cz = this.tile.z0 + (j + 0.5) * this.cell;
        if (inside(cx, cz)) out.push(j * this.nx + i);
      }
    // a footprint smaller than a cell still occupies the cell its centre is in
    if (!out.length) {
      const [x, z] = 'rect' in fp ? fp.rect : 'disc' in fp ? fp.disc : [(fp.band[0][0] + fp.band[1][0]) / 2, (fp.band[0][1] + fp.band[1][1]) / 2];
      const i = this.index(x, z);
      if (i >= 0) out.push(i);
    }
    return out;
  }

  /** Record a claim with no rules (for audits and for things that are allowed to overlap). */
  record(fp: Footprint, claim: Claim, pad = 0) {
    for (const i of this.cellsOf(fp, pad)) (this.cells[i] ?? (this.cells[i] = [])).push(claim);
  }

  /**
   * Try to stand `kind` on the footprint from `from` to `to`. Returns the years it may
   * stand, or null if something it must not stand on is already there at `from`.
   * Higher claims already there cut the new one short at their arrival; lower claims
   * under it are evicted at `from` (their `onEvict` runs, and they are cut to `from`).
   * `onEvict` on the new claim lets a later, higher claim cut it short in turn.
   */
  claim(fp: Footprint, claim: Claim, pad = 0): [number, number] | null {
    const cells = this.cellsOf(fp, pad);
    const p = PRIORITY[claim.kind];
    let to = claim.to;
    for (const i of cells)
      for (const c of this.cells[i] ?? []) {
        if (c.to <= claim.from) continue;
        if (c.kind === claim.kind) continue;
        if (PRIORITY[c.kind] >= p && forbids(c.kind, claim.kind)) {
          if (c.from <= claim.from) return null;
          to = Math.min(to, c.from);
        }
      }
    if (to <= claim.from) return null;
    const placed: Claim = {...claim, to};
    for (const i of cells) {
      const list = this.cells[i] ?? (this.cells[i] = []);
      for (const c of list) {
        if (c.kind === claim.kind || c.to <= claim.from || c.from >= to) continue;
        if (PRIORITY[c.kind] < p && forbids(claim.kind, c.kind)) {
          // a lower claim that started earlier is cut at the newcomer's arrival; one that
          // would start while the newcomer stands never stands at all
          const cut = Math.max(claim.from, c.from);
          if (cut < c.to) {
            c.to = cut;
            c.onEvict?.(cut);
          }
        }
      }
      list.push(placed);
    }
    return [claim.from, to];
  }

  /** Could `kind` stand here through [from, to) without breaking a rule? Used for things
   *  that are placed every frame (walkers, herds) and never block anything themselves. */
  free(fp: Footprint, kind: Kind, from: number, to: number, pad = 0): boolean {
    for (const i of this.cellsOf(fp, pad))
      for (const c of this.cells[i] ?? []) {
        if (c.kind === kind || c.to <= from || c.from >= to) continue;
        if (forbids(c.kind, kind)) return false;
      }
    return true;
  }

  /** Every forbidden pair standing on the same cell at the same time, grouped by kinds. */
  audit(): Conflict[] {
    const found = new Map<string, Conflict>();
    for (let idx = 0; idx < this.cells.length; idx++) {
      const list = this.cells[idx];
      if (!list || list.length < 2) continue;
      for (let a = 0; a < list.length; a++)
        for (let b = 0; b < list.length; b++) {
          if (a === b) continue;
          const under = list[a];
          const over = list[b];
          if (under.kind === over.kind || !forbids(under.kind, over.kind)) continue;
          const y0 = Math.max(under.from, over.from);
          const y1 = Math.min(under.to, over.to);
          if (y1 - y0 <= 0.5) continue; // a hand-over year is not an overlap
          const key = `${under.kind}>${over.kind}`;
          const hit = found.get(key);
          if (hit) hit.count++;
          else
            found.set(key, {
              under: under.kind,
              over: over.kind,
              count: 1,
              at: [this.tile.x0 + ((idx % this.nx) + 0.5) * this.cell, this.tile.z0 + (Math.floor(idx / this.nx) + 0.5) * this.cell],
              year: y0,
              labels: [under.label ?? under.kind, over.label ?? over.kind],
            });
        }
    }
    return [...found.values()].sort((p, q) => q.count - p.count);
  }
}

const FOREVER = 1e9;
const ALWAYS = -1e9;

/** The fixed occupants of a layout: water, landmark sites, open ground, roads (ring
 *  road included), rail and station. Everything generated is claimed after these. */
export const baseOccupancy = (L: CityLayout, cell = 0.5) => {
  const occ = new Occupancy(L.tile, cell);
  // water: every cell inside a river band (no margin: a riverside block may stand at the
  // bank; trees keep their own 0.8 margin through their claim's pad)
  for (const r of L.rivers) {
    const claim: Claim = {kind: 'water', from: ALWAYS, to: FOREVER, label: 'river'};
    if (isPathRiver(r)) {
      for (const s of riverSegments(L, r)) occ.record({band: [s.a, s.b, r.width]}, claim);
    } else {
      const [s0, s1] = riverSpan(L, r);
      const a: [number, number] = r.axis === 'z' ? [r.pos, s0] : [s0, r.pos];
      const b: [number, number] = r.axis === 'z' ? [r.pos, s1] : [s1, r.pos];
      occ.record({band: [a, b, r.width]}, claim);
    }
  }
  for (const [x, z, r] of L.sites ?? []) occ.record({disc: [x, z, r]}, {kind: 'site', from: ALWAYS, to: FOREVER, label: 'site'});
  for (const o of L.openGround ?? [])
    occ.record({rect: [(o.x0 + o.x1) / 2, (o.z0 + o.z1) / 2, o.x1 - o.x0, o.z1 - o.z0]}, {kind: 'open', from: ALWAYS, to: FOREVER, label: 'open ground'});
  for (const f of L.footprints ?? []) occ.record(f.fp, {kind: 'landmark', from: f.from ?? ALWAYS, to: f.to ?? FOREVER, label: f.label ?? 'landmark'});
  for (const rd of allRoads(L)) occ.record({band: [rd.from, rd.to, rd.width]}, {kind: 'road', from: rd.year, to: FOREVER, label: rd.label}, 0.6);
  if (L.rail) {
    const [r0, r1] = L.rail.span ?? (L.rail.axis === 'z' ? [L.tile.z0, L.tile.z1] : [L.tile.x0, L.tile.x1]);
    const a: [number, number] = L.rail.axis === 'z' ? [L.rail.pos, r0] : [r0, L.rail.pos];
    const b: [number, number] = L.rail.axis === 'z' ? [L.rail.pos, r1] : [r1, L.rail.pos];
    occ.record({band: [a, b, 4.0]}, {kind: 'rail', from: L.rail.open[0], to: FOREVER, label: 'rail'});
    const [sx, , sz] = stationPos(L.rail);
    occ.record({rect: [sx, sz, 4.4, 6.0]}, {kind: 'station', from: L.rail.stationYear, to: FOREVER, label: 'station'});
  }
  return occ;
};

/** The station stands beside the track, never on it. A station placed on the rail
 *  line (Nakhon Sawan, Phitsanulok) had every train drive through the building, so
 *  it is moved to the platform side, 2.6 off the line. */
export const stationPos = (rail: NonNullable<CityLayout['rail']>): [number, number, number] => {
  const [sx, sz] = rail.station;
  const cross = rail.axis === 'z' ? sx : sz;
  const off = cross - rail.pos;
  if (Math.abs(off) >= 2.2) return [sx, 0, sz];
  const c = rail.pos + (off < 0 ? -2.6 : 2.6);
  return rail.axis === 'z' ? [c, 0, sz] : [sx, 0, c];
};

/** Every built road: the listed ones plus the engine's ring road (a rectangle round the
 *  tile centre that is not in `L.roads`, and that buildings used to ignore). */
export const allRoads = (L: CityLayout): {from: [number, number]; to: [number, number]; width: number; year: number; label: string}[] => {
  const [rx, rz] = RING(L);
  const ring: [[number, number], [number, number]][] = [
    [[rx, -rz], [rx, rz]],
    [[rx, rz], [-rx, rz]],
    [[-rx, rz], [-rx, -rz]],
    [[-rx, -rz], [rx, -rz]],
  ];
  return [
    ...L.roads.map((r, i) => ({...r, label: `road ${i}`})),
    ...ring.map(([from, to]) => ({from, to, width: 1.2, year: L.ringRoadYear, label: 'ring road'})),
  ];
};
