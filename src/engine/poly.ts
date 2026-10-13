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
