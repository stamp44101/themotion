/** Polygon helpers for city footprints that are not rectangles. */
import type {CityLayout} from './types';

export type Poly = [number, number][];

/** The city footprint: the declared outline, or the hx/hz rectangle. */
export const cityPoly = (city: CityLayout['city']): Poly =>
  city.outline ?? [
    [-city.hx, -city.hz],
    [city.hx, -city.hz],
    [city.hx, city.hz],
    [-city.hx, city.hz],
  ];

export const polyCentroid = (p: Poly): [number, number] => {
  let x = 0;
  let z = 0;
  for (const [px, pz] of p) {
    x += px;
    z += pz;
  }
  return [x / p.length, z / p.length];
};

/** Push every vertex away from the centroid by `d` world units. Good enough for
 *  a moat ring around a convex-ish footprint, and far simpler than a true
 *  straight-skeleton offset. */
export const offsetPoly = (p: Poly, d: number): Poly => {
  const [cx, cz] = polyCentroid(p);
  return p.map(([x, z]) => {
    const dx = x - cx;
    const dz = z - cz;
    const len = Math.hypot(dx, dz) || 1;
    return [x + (dx / len) * d, z + (dz / len) * d] as [number, number];
  });
};

/** Edges as [midX, midZ, angleY, length]. */
export const polyEdges = (p: Poly) =>
  p.map((a, i) => {
    const b = p[(i + 1) % p.length];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    return {
      mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as [number, number],
      angle: Math.atan2(dx, dz),
      len: Math.hypot(dx, dz),
      a,
      b,
    };
  });

export const polyPerimeter = (p: Poly) => polyEdges(p).reduce((s, e) => s + e.len, 0);

/** Point `t` (0..1) along the perimeter. */
export const polyPointAt = (p: Poly, t: number): [number, number] => {
  const edges = polyEdges(p);
  const total = edges.reduce((s, e) => s + e.len, 0);
  let d = ((t % 1) + 1) % 1 * total;
  for (const e of edges) {
    if (d <= e.len) {
      const k = e.len === 0 ? 0 : d / e.len;
      return [e.a[0] + (e.b[0] - e.a[0]) * k, e.a[1] + (e.b[1] - e.a[1]) * k];
    }
    d -= e.len;
  }
  return p[0];
};

/** Standard ray-cast point-in-polygon. */
export const inPoly = (p: Poly, x: number, z: number) => {
  let inside = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, zi] = p[i];
    const [xj, zj] = p[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
};

/** Shrink toward the centroid — used to keep houses off the wall line. */
export const shrinkPoly = (p: Poly, d: number): Poly => offsetPoly(p, -d);

/** An axis-aligned slab to keep a wall out of: the river's footprint. */
export type Band = {axis: 'x' | 'z'; lo: number; hi: number; s0: number; s1: number};

/** Split segment a->b into the pieces that fall OUTSIDE every band.
 *
 *  A city wall does not march across open water: where a river passes through
 *  the line, real cities left a gap with a water gate so boats could pass. */
export const subtractBands = (
  a: [number, number],
  b: [number, number],
  bands: Band[],
): [[number, number], [number, number]][] => {
  const at = (t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  // intervals of t that are inside some band
  const cuts: [number, number][] = [];
  for (const bd of bands) {
    const ci = bd.axis === 'x' ? 0 : 1; // which coordinate the slab constrains
    const si = 1 - ci;                   // the along-river coordinate
    const a0 = a[ci];
    const d = b[ci] - a0;
    let t0: number;
    let t1: number;
    if (Math.abs(d) < 1e-6) {
      if (a0 < bd.lo || a0 > bd.hi) continue;
      [t0, t1] = [0, 1];
    } else {
      t0 = (bd.lo - a0) / d;
      t1 = (bd.hi - a0) / d;
      if (t0 > t1) [t0, t1] = [t1, t0];
    }
    t0 = Math.max(0, t0);
    t1 = Math.min(1, t1);
    if (t1 <= t0) continue;
    // only cut if the crossing actually lies along the river's extent
    const mid = at((t0 + t1) / 2)[si];
    if (mid < bd.s0 || mid > bd.s1) continue;
    cuts.push([t0, t1]);
  }
  if (!cuts.length) return [[a, b]];
  cuts.sort((p, q) => p[0] - q[0]);
  const out: [[number, number], [number, number]][] = [];
  let cur = 0;
  for (const [c0, c1] of cuts) {
    if (c0 > cur) out.push([at(cur), at(c0)]);
    cur = Math.max(cur, c1);
  }
  if (cur < 1) out.push([at(cur), at(1)]);
  return out.filter(([p, q]) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 0.25);
};

export const inBands = (x: number, z: number, bands: Band[]) =>
  bands.some((bd) => {
    const c = bd.axis === 'x' ? x : z;
    const s = bd.axis === 'x' ? z : x;
    return c >= bd.lo && c <= bd.hi && s >= bd.s0 && s <= bd.s1;
  });

/** The gap endpoints where a segment crosses a band — the piers of a water gate. */
export const bandGaps = (
  a: [number, number],
  b: [number, number],
  bands: Band[],
): {p: [number, number]; q: [number, number]; angle: number}[] => {
  const kept = subtractBands(a, b, bands);
  if (kept.length <= 1 && (kept.length === 0 || (kept[0][0] === a && kept[0][1] === b))) {
    return kept.length === 0
      ? [{p: a, q: b, angle: Math.atan2(b[0] - a[0], b[1] - a[1])}]
      : [];
  }
  const out: {p: [number, number]; q: [number, number]; angle: number}[] = [];
  const angle = Math.atan2(b[0] - a[0], b[1] - a[1]);
  for (let i = 0; i < kept.length - 1; i++) {
    out.push({p: kept[i][1], q: kept[i + 1][0], angle});
  }
  if (kept.length && (kept[0][0][0] !== a[0] || kept[0][0][1] !== a[1])) {
    out.push({p: a, q: kept[0][0], angle});
  }
  const last = kept[kept.length - 1];
  if (kept.length && (last[1][0] !== b[0] || last[1][1] !== b[1])) {
    out.push({p: last[1], q: b, angle});
  }
  return out;
};
