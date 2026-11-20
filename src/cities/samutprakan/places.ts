// Real positions (cloud's map, docs/briefs/samutprakan_onep/README.md and its geojson): world units at 150 m/unit, +x east,
// +z south, origin the city pillar shrine (ศาลหลักเมืองสมุทรปราการ, 13.59349, 100.59755, nominatim node 5214164522). Pure
// data so actors.ts, timeline.ts, geo.ts, Hero.tsx and Landmarks.tsx share it. At true scale: the Chao Phraya (OSM river
// ways, resampled), Pak Nam on its east bank, the chedi and Phi Suea Samut fort on the west bank, the mouth and the Gulf
// coast (OSM coastline 255391976 / 787931156), Phra Chulachomklao fort and Bang Pu. Drawn closer: Suvarnabhumi (19 km NE,
// at the tile's north-east corner) and the Bhumibol twin bridges (9-11 km NW, where the river enters the tile).
export type P = [number, number];
export const M_PER_UNIT = 150;

export const TILE = {x0: -40, x1: 46, z0: -34, z1: 66};

// ---- the Chao Phraya: OSM centreline from the tile's west edge to the mouth (the apex where the two coastlines meet)
export const RIVER: P[] = [
  [-40.0, -25.9], [-37.5, -22.5], [-34.9, -19.9], [-33.4, -18.5], [-30.1, -16.3], [-27.8, -15.0], [-24.8, -13.6],
  [-21.2, -12.9], [-17.3, -12.5], [-14.2, -12.7], [-10.2, -12.5], [-7.2, -11.7], [-5.3, -10.3], [-3.9, -7.5],
  [-3.5, -4.6], [-3.7, -2.9], [-4.3, -0.1], [-5.1, 2.2], [-6.7, 5.2], [-9.9, 9.5], [-11.9, 11.8], [-13.3, 13.9],
  [-14.7, 17.1], [-15.3, 20.6], [-15.3, 23.1], [-14.1, 27.0], [-11.6, 30.5], [-9.2, 32.6], [-2.1, 37.9],
];
/** the river's width along RIVER (index -> units): ~650 m where it enters, ~850 m at Pak Nam, ~1 km at the mouth */
export const riverW = (i: number) => (i < 11 ? 4.4 + (i / 11) * 1.0 : i < 20 ? 5.4 + ((i - 11) / 9) * 0.4 : 5.8 + ((i - 20) / 8) * 1.4);

/** the Gulf coast west of the mouth (apex outward, OSM 255391976) and east of it (apex outward, OSM 787931156) */
export const COAST_W: P[] = [[-7.1, 42.7], [-9.2, 49.7], [-17.1, 57.4], [-19.3, 56.5], [-22.5, 57.1], [-25.0, 58.8], [-28.0, 58.4], [-31.9, 57.9], [-37.0, 58.9], [-40.0, 59.3]];
export const COAST_E: P[] = [[7.0, 37.6], [9.5, 39.6], [16.1, 46.0], [18.2, 49.3], [26.5, 54.3], [31.5, 55.7], [34.8, 55.6], [38.1, 56.3], [41.0, 56.9], [44.3, 58.3], [46.0, 58.8]];

const banks = () => {
  const L: P[] = [];
  const R: P[] = [];
  RIVER.forEach((p, i) => {
    const a = RIVER[Math.max(0, i - 1)];
    const b = RIVER[Math.min(RIVER.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const n = Math.hypot(dx, dz);
    const h = riverW(i) / 2;
    // looking downstream, the left bank (east of the southbound reach) is +(dz, -dx)
    L.push([p[0] + (dz / n) * h, p[1] - (dx / n) * h]);
    R.push([p[0] - (dz / n) * h, p[1] + (dx / n) * h]);
  });
  return {L, R};
};
const B = banks();
/** the river's east/north bank and west/south bank, entry to mouth */
export const BANK_L = B.L;
export const BANK_R = B.R;

/** all the open water as one flat shape: the river between its banks, opening at the mouth into the Gulf, cut at the tile's
 *  edges (CLAUDE.md: a sea is one flat shape, never a wide path river) */
export const WATER: P[] = [
  ...BANK_R.slice(0, -1),
  ...COAST_W,
  [TILE.x0, TILE.z1],
  [TILE.x1, TILE.z1],
  ...[...COAST_E].reverse(),
  ...[...BANK_L.slice(0, -1)].reverse(),
];

/** the old channel west of the chedi's island: open water until the silt closes it (the grow beat) */
export const WEST_CHANNEL: P[] = [
  [-6.6, -9.9], [-8.2, -9.9], [-9.6, -8.6], [-10.3, -6.0], [-10.3, -2.8], [-9.7, 0.0], [-8.6, 1.8], [-7.2, 2.6],
  [-7.0, 1.3], [-8.2, 0.2], [-8.9, -2.6], [-9.0, -5.6], [-8.6, -7.8], [-7.3, -8.6],
];

/** point in polygon (even-odd) */
export const inPoly = (pts: P[], x: number, z: number) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, zi] = pts[i];
    const [xj, zj] = pts[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
};
export const inWater = (x: number, z: number) => inPoly(WATER, x, z);
export const inOldWater = (x: number, z: number) => inWater(x, z) || inPoly(WEST_CHANNEL, x, z);
/** trees never stand on the water: a 2-unit grid of clearings over it (and the old channel, mudflat after it closes) */
export const WATER_CLEARINGS: [number, number, number, number][] = (() => {
  const out: [number, number, number, number][] = [];
  for (let x = TILE.x0 + 1; x < TILE.x1; x += 2)
    for (let z = TILE.z0 + 1; z < TILE.z1; z += 2) if (inOldWater(x, z)) out.push([x, z, 1.55, -1e9]);
  for (let x = -10.6; x < -6.4; x += 0.8) for (let z = -10; z < 3; z += 0.8) if (inPoly(WEST_CHANNEL, x, z)) out.push([x, z, 0.6, -1e9]);
  return out;
})();

// ---- Pak Nam (east bank) and the chedi's island (west bank)
export const PILLAR: P = [0, 0];
export const HALL: P = [-0.1, -3.9]; // ศาลากลางจังหวัด (nominatim)
export const WAT_KLANG: P = [1.3, 0.8]; // วัดกลางวรวิหาร (OSM way 1229700134)
/** องค์พระสมุทรเจดีย์ (OSM way 29976964) */
export const CHEDI: P = [-7.7, -5.0];
/** ป้อมผีเสื้อสมุทร (OSM way 1224439620 at -7.2, -1.3; drawn 0.6 W so it stands clear of the bank) */
export const PHISUEA: P = [-7.8, -1.2];
/** Rama II's forts on the east bank (ป้อมประโคนชัย by the pillar's street, ป้อมนารายณ์ปราบศึก upstream): positions from
 *  the street names, not surveyed (both are gone) */
export const PRAKHONCHAI: P = [-0.6, 2.9];
export const NARAI: P = [0.0, -7.4];
/** Pak Nam town on the east bank (imagery; not a legal boundary) */
export const OLD_TOWN: P[] = [[-0.4, -5.6], [1.6, -5.6], [2.8, -2.6], [2.9, 1.6], [1.8, 4.0], [-1.2, 4.0], [-1.0, 1.0], [-0.6, -2.4]];
/** the landing on the island's river side where the barges stop and the red cloth goes ashore */
export const LANDING: P = [-6.0, -5.4];

// ---- the mouth: ป้อมพระจุลจอมเกล้า (OSM way 1010188105 at -13.4, 41.5) drawn 3.9 E, near today's shore: the mud has
// built the shore out ~1 km since 2436, and the fort faced the channel then
export const CHULA: P = [-9.5, 41.6];
/** the channel the French ships took: up the mouth past the fort and on toward Pak Nam */
export const CHANNEL: P[] = [[4.0, 64.0], [2.6, 54.0], [0.0, 45.0], [-2.6, 39.4], [-6.6, 35.0], [-10.6, 31.9], [-13.0, 28.6], [-14.4, 24.5]];

// ---- Bang Pu (OSM way 543819719) on the coast 10 km SE, at true scale; the pier runs out to sea
export const BANGPU: P = [38.2, 54.9];
export const PIER: P[] = [[38.4, 56.2], [38.4, 61.6]];

// ---- far places, drawn closer
/** Suvarnabhumi (real 19 km, bearing 59; drawn bearing 55 at the north-east corner), runways along bearing ~17 */
export const AIRPORT: P = [33.0, -22.5];
export const RUNWAY_ROT = (17 * Math.PI) / 180;
/** the swamp of หนองงูเห่า under it, drained for the airport */
export const SWAMP: P[] = [[23.5, -33.6], [45.6, -33.6], [45.6, -11.5], [36.0, -10.4], [26.0, -12.6], [22.6, -20.0]];
/** the Bhumibol twin bridges (real 9-11 km, bearing 319-325; drawn bearing ~300) across the river near the tile's west edge */
export const BRIDGES: P[] = [[-35.6, -20.6], [-29.6, -15.7]];

// ---- roads (OSM, /1.5)
/** ถนนสุขุมวิท: down the east bank from the north edge to Pak Nam, then south-east along the coast to Bang Pu */
export const SUKHUMVIT: P[] = [
  [-6.6, -34.0], [-6.7, -25.3], [-5.3, -20.7], [-4.0, -16.7], [-1.2, -12.6], [1.4, -9.0], [2.4, -6.0], [4.2, -2.9],
  [7.3, -1.3], [8.7, 3.3], [7.3, 7.3], [5.3, 12.7], [6.0, 17.3], [8.0, 21.3], [10.7, 25.3], [12.7, 30.0], [14.0, 33.3],
  [16.0, 38.0], [18.7, 41.3], [22.0, 44.0], [25.3, 46.7], [29.3, 48.7], [32.7, 50.7], [37.3, 52.0], [44.0, 54.0], [46.0, 54.6],
];
/** ถนนสุขสวัสดิ์ on the west bank, in from the west edge to the chedi */
export const SUKSAWAT: P[] = [[-40.0, -19.6], [-36.7, -15.3], [-33.3, -11.3], [-30.7, -8.0], [-28.0, -6.0], [-25.3, -2.0], [-24.0, -1.3], [-17.3, -0.7], [-13.3, -0.7], [-11.0, -1.0]];
/** the last stretch to the temple, across the old channel once it has silted up */
export const SUKSAWAT_END: P[] = [[-11.0, -1.0], [-9.6, -2.6]];
/** ถนนศรีนครินทร์ north-east from Pak Nam */
export const SRINAKHARIN: P[] = [[7.3, -1.3], [10.7, -3.3], [11.3, -6.7], [13.3, -11.3], [15.3, -14.0], [17.3, -16.7], [18.7, -20.7], [21.3, -24.7], [22.0, -28.0], [22.6, -34.0]];
/** ถนนเทพารักษ์ east from Sukhumvit, and the airport road on to the terminal */
export const THEPHARAK: P[] = [[-2.6, -14.8], [5.3, -15.8], [10.0, -17.0], [15.3, -18.0], [18.7, -20.7]];
export const AIRPORT_ROAD: P[] = [[18.7, -20.7], [23.0, -21.0], [27.4, -21.6], [30.8, -22.2]];

// ---- the Bhumibol bridges' decks: each spans the river square to it, landing ~0.9 beyond the banks
const span = (c: P, a: P, b: P, half: number): [P, P] => {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const n = Math.hypot(dx, dz);
  const lx = dz / n;
  const lz = -dx / n;
  return [[c[0] - lx * half, c[1] - lz * half], [c[0] + lx * half, c[1] + lz * half]];
};
/** [south landing, north landing] of each bridge */
export const BRIDGE_SPANS: [P, P][] = [span(BRIDGES[0], RIVER[1], RIVER[2], 3.3), span(BRIDGES[1], RIVER[4], RIVER[5], 3.4)];
/** the roads to the bridges: from Suk Sawat to each south landing, and from the north landings east to Sukhumvit */
export const RING_S1: P[] = [[-33.3, -11.3], [-35.0, -14.4], BRIDGE_SPANS[0][0]];
export const RING_S2: P[] = [[-30.7, -8.0], [-31.0, -10.6], BRIDGE_SPANS[1][0]];
export const RING_N: P[] = [BRIDGE_SPANS[0][1], BRIDGE_SPANS[1][1], [-24.0, -24.0], [-14.0, -26.0], [-6.7, -25.3]];

// ---- the cover's giant chedi: its height in world units (legend scale; the real one is drawn ~2.6 high)
export const HERO_S = 54;
