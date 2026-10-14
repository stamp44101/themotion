import type {AxisRiver, CityLayout, PathRiver, River} from './types';

export type RiverPoint = {x: number; z: number; angle: number; at: number};
export type RiverCrossing = RiverPoint & {roadT: number};

export const isPathRiver = (river: River): river is PathRiver => Array.isArray(river.path);

export const riverSpan = (L: CityLayout, river: AxisRiver): [number, number] =>
  river.span ?? (river.axis === 'z' ? [L.tile.z0, L.tile.z1] : [L.tile.x0, L.tile.x1]);

type RiverSegment = {
  a: [number, number];
  b: [number, number];
  start: number;
  len: number;
  angle: number;
};

export const riverSegments = (L: CityLayout, river: River): RiverSegment[] => {
  if (!isPathRiver(river)) {
    const [s0, s1] = riverSpan(L, river);
    const a: [number, number] = river.axis === 'z' ? [river.pos, s0] : [s0, river.pos];
    const b: [number, number] = river.axis === 'z' ? [river.pos, s1] : [s1, river.pos];
    return [{a, b, start: 0, len: Math.hypot(b[0] - a[0], b[1] - a[1]), angle: Math.atan2(b[1] - a[1], b[0] - a[0])}];
  }
  const points = river.closed && river.path.length > 2 ? [...river.path, river.path[0]] : river.path;
  const out: RiverSegment[] = [];
  let start = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 1e-6) continue;
    out.push({a, b, start, len, angle: Math.atan2(b[1] - a[1], b[0] - a[0])});
    start += len;
  }
  return out;
};

export const riverLength = (L: CityLayout, river: River) => riverSegments(L, river).reduce((sum, s) => sum + s.len, 0);

/** Position and tangent on a river. Axis rivers retain their historic `at`
 * coordinate; path rivers use distance from path[0]. */
export const riverPointAt = (L: CityLayout, river: River, at: number, offset = 0): RiverPoint => {
  if (!isPathRiver(river)) {
    return river.axis === 'z'
      ? {x: river.pos + offset, z: at, angle: Math.PI / 2, at}
      : {x: at, z: river.pos + offset, angle: 0, at};
  }
  const segs = riverSegments(L, river);
  const total = segs.reduce((sum, s) => sum + s.len, 0);
  if (!segs.length || total <= 0) return {x: river.path[0]?.[0] ?? 0, z: river.path[0]?.[1] ?? 0, angle: 0, at: 0};
  const d = river.closed ? ((at % total) + total) % total : Math.max(0, Math.min(total, at));
  const seg = segs.find((s) => d <= s.start + s.len) ?? segs[segs.length - 1];
  const u = Math.max(0, Math.min(1, (d - seg.start) / seg.len));
  const x = seg.a[0] + (seg.b[0] - seg.a[0]) * u;
  const z = seg.a[1] + (seg.b[1] - seg.a[1]) * u;
  return {x: x - Math.sin(seg.angle) * offset, z: z + Math.cos(seg.angle) * offset, angle: seg.angle, at: d};
};

const closestOnSegment = (x: number, z: number, s: RiverSegment) => {
  const dx = s.b[0] - s.a[0];
  const dz = s.b[1] - s.a[1];
  const u = Math.max(0, Math.min(1, ((x - s.a[0]) * dx + (z - s.a[1]) * dz) / (s.len * s.len)));
  const px = s.a[0] + dx * u;
  const pz = s.a[1] + dz * u;
  return {x: px, z: pz, angle: s.angle, at: s.start + s.len * u, distance: Math.hypot(x - px, z - pz)};
};

export const closestRiverPoint = (L: CityLayout, river: River, x: number, z: number) => {
  const segs = riverSegments(L, river);
  if (!segs.length) return {x: 0, z: 0, angle: 0, at: 0, distance: Infinity};
  return segs.map((s) => closestOnSegment(x, z, s)).reduce((best, p) => (p.distance < best.distance ? p : best));
};

/** Footprint test with separate end padding for legacy rectangular bands.
 * Polyline rivers use round end caps, so their width naturally supplies it. */
export const inRiver = (L: CityLayout, river: River, x: number, z: number, margin = 0, endMargin = river.width / 2) => {
  if (isPathRiver(river)) return closestRiverPoint(L, river, x, z).distance < river.width / 2 + margin;
  const c = river.axis === 'z' ? x : z;
  const a = river.axis === 'z' ? z : x;
  const [s0, s1] = riverSpan(L, river);
  return Math.abs(c - river.pos) < river.width / 2 + margin && a > s0 - endMargin && a < s1 + endMargin;
};

const segmentIntersection = (a: [number, number], b: [number, number], c: [number, number], d: [number, number]) => {
  const rx = b[0] - a[0];
  const rz = b[1] - a[1];
  const sx = d[0] - c[0];
  const sz = d[1] - c[1];
  const den = rx * sz - rz * sx;
  if (Math.abs(den) < 1e-8) return null;
  const qx = c[0] - a[0];
  const qz = c[1] - a[1];
  const t = (qx * sz - qz * sx) / den;
  const u = (qx * rz - qz * rx) / den;
  if (t < -1e-8 || t > 1 + 1e-8 || u < -1e-8 || u > 1 + 1e-8) return null;
  return {t: Math.max(0, Math.min(1, t)), u: Math.max(0, Math.min(1, u))};
};

/** Centreline intersections, de-duplicated where a crossing lands on a path vertex. */
export const riverCrossings = (L: CityLayout, river: River, a: [number, number], b: [number, number]): RiverCrossing[] => {
  const out: RiverCrossing[] = [];
  for (const s of riverSegments(L, river)) {
    const hit = segmentIntersection(a, b, s.a, s.b);
    if (!hit) continue;
    const x = a[0] + (b[0] - a[0]) * hit.t;
    const z = a[1] + (b[1] - a[1]) * hit.t;
    if (out.some((p) => Math.hypot(p.x - x, p.z - z) < 1e-5)) continue;
    const at = isPathRiver(river)
      ? s.start + s.len * hit.u
      : river.axis === 'z'
        ? z
        : x;
    out.push({x, z, angle: s.angle, at, roadT: hit.t});
  }
  return out.sort((p, q) => p.roadT - q.roadT);
};

const tubeIntervals = (L: CityLayout, river: PathRiver, a: [number, number], b: [number, number], margin: number) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const steps = Math.max(8, Math.ceil(len / 0.08));
  const inside = (t: number) => {
    const x = a[0] + (b[0] - a[0]) * t;
    const z = a[1] + (b[1] - a[1]) * t;
    return inRiver(L, river, x, z, margin);
  };
  const refine = (lo: number, hi: number, target: boolean) => {
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2;
      if (inside(mid) === target) hi = mid;
      else lo = mid;
    }
    return (lo + hi) / 2;
  };
  const cuts: [number, number][] = [];
  let prevT = 0;
  let prev = inside(0);
  let start = prev ? 0 : -1;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const now = inside(t);
    if (now !== prev) {
      const edge = refine(prevT, t, now);
      if (now) start = edge;
      else if (start >= 0) cuts.push([start, edge]);
    }
    prev = now;
    prevT = t;
  }
  if (prev && start >= 0) cuts.push([start, 1]);
  return cuts;
};

const pointAt = (a: [number, number], b: [number, number], t: number): [number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

/** Split a wall edge into dry pieces for polyline river footprints. Legacy-only
 * layouts continue to use subtractBands so their rendered geometry is unchanged. */
export const subtractPathRivers = (
  L: CityLayout,
  a: [number, number],
  b: [number, number],
  margin = 0.35,
): [[number, number], [number, number]][] => {
  const cuts = L.rivers
    .filter(isPathRiver)
    .flatMap((r) => tubeIntervals(L, r, a, b, margin))
    .sort((p, q) => p[0] - q[0]);
  if (!cuts.length) return [[a, b]];
  const out: [[number, number], [number, number]][] = [];
  let cur = 0;
  for (const [c0, c1] of cuts) {
    if (c0 > cur) out.push([pointAt(a, b, cur), pointAt(a, b, c0)]);
    cur = Math.max(cur, c1);
  }
  if (cur < 1) out.push([pointAt(a, b, cur), b]);
  return out.filter(([p, q]) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 0.25);
};

