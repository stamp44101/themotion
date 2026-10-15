// Real-world anchors for a city or landmark reel, so the model keeps true compass
// directions. Chonburi shipped with the Gulf on the east of the town; it is west.
// A viewer from the city noticed at once ("อยากให้ศึกษาตำแหน่งจากความเป็นจริง").
//
// World axes: +x = east, -z = north, y = up. Distances may be compressed (a
// 15 km coast squeezed onto one tile), but directions between places may not.

export type GeoPoint = {
  name: string;
  lat: number;
  lon: number;
  /** where the model puts it, world units (x, z) */
  at: [number, number];
  /** a point on open water (sea, river), checked against every land point */
  water?: boolean;
  source: string;
};

export type Geo = {points: GeoPoint[]};

const R = Math.PI / 180;

/** Metres east and north from a to b (equirectangular; fine over a few tens of km). */
export const metresEN = (a: {lat: number; lon: number}, b: {lat: number; lon: number}): [number, number] => {
  const lat0 = ((a.lat + b.lat) / 2) * R;
  return [(b.lon - a.lon) * 111320 * Math.cos(lat0), (b.lat - a.lat) * 110574];
};

/** Compass bearing in degrees (0 = north, 90 = east). */
export const bearing = (east: number, north: number) => ((Math.atan2(east, north) / R) % 360 + 360) % 360;
export const angleDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

/** World (x, z) for a lat/lon, given the lat/lon of the world origin. */
export const toWorld = (origin: {lat: number; lon: number}, p: {lat: number; lon: number}, metresPerUnit = 80): [number, number] => {
  const [e, n] = metresEN(origin, p);
  return [e / metresPerUnit, -n / metresPerUnit];
};

export type GeoPair = {a: string; b: string; real: number; model: number; diff: number; metres: number; water: boolean};

/** Every pair worth comparing: land-land at least `minMetres` apart, and every land-water pair. */
export const geoPairs = (geo: Geo, minMetres = 300): GeoPair[] => {
  const out: GeoPair[] = [];
  const P = geo.points;
  for (let i = 0; i < P.length; i++)
    for (let j = i + 1; j < P.length; j++) {
      const [a, b] = [P[i], P[j]];
      if (a.water && b.water) continue;
      const water = !!(a.water || b.water);
      const [e, n] = metresEN(a, b);
      const metres = Math.hypot(e, n);
      if (!water && metres < minMetres) continue;
      const real = bearing(e, n);
      const model = bearing(b.at[0] - a.at[0], -(b.at[1] - a.at[1]));
      out.push({a: a.name, b: b.name, real, model, diff: angleDiff(real, model), metres, water});
    }
  return out;
};
