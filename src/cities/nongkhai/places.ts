// Real positions (cloud's map, docs/briefs/nongkhai_onep/README.md and its geojson): world units at 100 m/unit, +x east,
// +z south, origin อนุสาวรีย์ปราบฮ่อ (17.87962, 102.74057, OSM node 13017978186). Pure data shared by the style frames,
// actors, timeline, geo and Landmarks. Everything is at true scale: the whole story lies within ~4.5 km of the origin.
// The Mekong runs SW -> NE, 550-650 m wide; both banks traced from Esri imagery (OSM's riverbank timed out on the mirror)
// and drawn as ONE flat shape cut at the tile's edges, never a path river. Laos (Tha Deua) is the far, north-west bank.
export type P = [number, number];
export const M_PER_UNIT = 100;

export const TILE = {x0: -32, x1: 50, z0: -44, z1: 38};

/** the Mekong: the Thai (south-east) bank west to east, then the Lao (north-west) bank back; cut at the west and north edges */
export const MEKONG: P[] = [
  [-32.0, 3.2], [-27.8, 2.3], [-22.9, 1.7], [-17.8, 0.4], [-12.8, -1.1], [-7.8, -2.4], [-2.7, -3.7], [2.4, -5.6], [7.3, -7.2],
  [12.4, -8.9], [17.4, -11.7], [22.5, -15.0], [27.5, -19.6], [30.1, -22.6], [32.4, -25.8], [34.2, -28.1], [36.3, -31.5],
  [38.6, -35.8], [39.7, -38.8], [40.7, -41.4], [41.9, -44.0],
  [36.1, -44.0], [34.8, -41.4], [33.0, -38.8], [30.2, -35.8], [27.4, -31.5], [24.0, -28.1], [22.8, -25.8], [18.3, -22.6],
  [15.7, -19.8], [12.4, -17.1], [7.3, -13.3], [2.4, -11.3], [-2.7, -9.9], [-7.8, -8.7], [-12.8, -6.7], [-17.8, -5.4],
  [-22.9, -4.2], [-27.8, -3.6], [-32.0, -3.0],
];
/** the Thai bank alone (west to east), for things that walk or sail along it */
export const THAI_BANK: P[] = MEKONG.slice(0, 21);

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
export const inWater = (x: number, z: number) => inPoly(MEKONG, x, z);
/** trees never stand on the water: a 2-unit grid of clearings over the river */
export const WATER_CLEARINGS: [number, number, number, number][] = (() => {
  const out: [number, number, number, number][] = [];
  for (let x = TILE.x0 + 1; x < TILE.x1; x += 2) for (let z = TILE.z0 + 1; z < TILE.z1; z += 2) if (inWater(x, z)) out.push([x, z, 1.55, -1e9]);
  return out;
})();

// ---- the old town on the bank (OSM pins)
export const PRAPHO: P = [0, 0]; // อนุสาวรีย์ปราบฮ่อ (origin): the 2429 monument, rebuilt here in 2492
/** ตลาดท่าเสด็จ: stands for บ้านไผ่, the founding village on the bank */
export const BAN_PHAI: P = [7.4, -5.6];
/** วัดโพธิ์ชัย (OSM 17.9, -5.4) */
export const WAT_PHO_CHAI: P = [17.9, -5.4];
/** พระธาตุหล้าหนอง: stood on the bank until 2390; the fallen stupa lies ~2 units out in the river (the OSM pin is the shrine on
 *  the bank) */
export const THAT: P = [26.2, -21.4];
/** the bank the stupa stood on before 2390, a sand spit out into today's river (it slumps away in the sink beat) */
export const SPIT: P[] = [[23.6, -16.4], [24.0, -18.4], [24.9, -20.6], [26.0, -22.4], [27.4, -22.8], [28.6, -22.0], [29.4, -21.6], [28.0, -19.2]];
/** the old station by the river (2498-2545): the end of the abandoned track */
export const OLD_STATION: P = [-12.9, 0.6];
/** Nong Khai station (2545), near the bridge */
export const NEW_STATION: P = [-9.9, 16.8];
/** the Friendship Bridge: the Thai abutment, the Lao abutment (OSM, 1,170 m) */
export const BRIDGE: [P, P] = [[-26.0, 5.3], [-27.9, -6.4]];
export const SALA_KAEW_KU: P = [44.5, -8.6];

/** the old town on the bank, from Tha Sadet to Wat Pho Chai (imagery; not a legal boundary): the town's houses fill it */
export const OLD_CORE: P[] = [
  [-6.0, -1.8], [-1.0, -3.3], [3.0, -5.0], [7.5, -6.4], [12.0, -8.1], [16.0, -10.2], [19.6, -12.2], [21.8, -11.6],
  [21.2, -8.4], [18.0, -5.6], [14.0, -3.4], [9.0, -1.0], [4.0, 1.2], [-1.0, 2.6], [-5.6, 2.2],
];

// ---- roads (OSM, simplified)
/** ถนนริมโขง / พนังชลประทาน (212): along the bank east from the town */
export const RIVER_ROAD: P[] = [[-9.6, 1.9], [-5.0, 2.6], [-1.2, 3.2], [1.8, 3.4], [5.1, 2.0], [8.7, 0.3], [11.5, -1.0], [14.9, -2.6], [19.2, -5.2], [21.7, -7.0], [24.8, -8.6], [28.1, -8.8], [31.7, -8.8], [34.7, -9.7], [38.3, -12.0], [40.8, -14.0], [42.7, -16.6], [44.9, -19.6], [47.0, -22.4], [49.2, -25.5], [50.0, -26.6]];
/** ถนนมิตรภาพ (233): north into town from the south edge */
export const MITTRAPHAP: P[] = [[13.4, 38.0], [12.5, 33.0], [11.7, 28.0], [10.0, 22.0], [8.7, 18.9], [7.5, 16.1], [6.1, 13.2], [4.6, 10.0], [3.3, 7.2], [2.0, 4.4], [1.0, 2.0]];
/** ทล.2 from the south, past the new station, to the bridge */
export const HWY2: P[] = [[-7.6, 38.0], [-8.1, 33.6], [-9.1, 31.3], [-15.0, 20.3], [-20.3, 14.8], [-22.7, 12.9], [-24.9, 10.5], [-25.7, 7.6], [-26.0, 5.3]];
/** ทล.242 west along the bank from the town */
export const WEST_ROAD: P[] = [[-9.6, 1.9], [-10.9, 2.4], [-14.0, 3.0], [-17.0, 3.6], [-20.1, 4.4], [-22.8, 5.4], [-25.7, 6.2], [-28.9, 7.0], [-32.0, 7.6]];
/** นค.3045 east to Sala Kaew Ku */
export const EAST_ROAD: P[] = [[10.0, 22.0], [13.0, 21.6], [15.9, 19.6], [17.6, 17.0], [18.2, 14.8], [19.4, 10.1], [22.3, 5.8], [24.8, 3.9], [27.6, 1.9], [31.4, 0.4], [34.6, -1.1], [40.6, -3.9], [44.0, -5.6], [46.7, -7.4], [47.0, -10.8], [45.8, -13.6], [44.4, -17.6]];
/** the Lao road along the north bank (ถนนท่าเดื่อ) */
export const LAO_ROAD: P[] = [[-32.0, -6.6], [-27.9, -7.6], [-24.1, -8.3], [-20.7, -9.0], [-16.0, -10.4], [-11.0, -12.0], [-6.0, -13.4], [-1.0, -14.6], [4.0, -16.4], [9.0, -19.4], [13.0, -22.6], [16.0, -25.6], [19.0, -29.0], [22.0, -32.6], [25.0, -36.6], [28.0, -40.6], [30.2, -44.0]];

// ---- the railway (OSM): the 2498 line from the south edge to the old station by the river
export const RAIL: P[] = [
  [6.9, 38.0], [5.7, 33.0], [4.7, 30.6], [3.2, 28.5], [-1.7, 24.1], [-3.9, 22.2], [-8.3, 18.4], [-10.2, 16.8], [-13.4, 14.0],
  [-16.8, 11.1], [-21.2, 7.3], [-22.0, 4.9], [-20.5, 2.7], [-16.0, 1.0], [OLD_STATION[0] - 0.4, OLD_STATION[1] + 0.1],
];

// ---- the cover: the long boat carved on the bank west of the town (it becomes town later)
export const BOAT_AT: P = [4.0, 8.0];
export const BOAT_S = 44;

// ---- the payoff: the boat race on the Mekong off Tha Sadet; the crowd on the bank
export const RACE: [P, P] = [[-14.0, -4.6], [10.0, -9.6]];
export const CROWD: P = [4.4, -3.4];
