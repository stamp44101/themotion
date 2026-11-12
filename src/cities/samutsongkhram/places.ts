// Real positions (cloud's map, docs/briefs/samutsongkhram_onep/README.md and its geojson): world units at 100 m/unit,
// +x east, +z south, origin the city pillar (ศาลหลักเมือง, 13.41204, 100.00271). Pure data so actors.ts, timeline.ts,
// geo.ts and Landmarks.tsx share it. The town is at true scale; the far reaches are drawn closer so the tile holds the
// story: west of x = -24 distances are x0.4 (the loop and Amphawa), south of z = 26 x0.5 (the mouth and the coast), north
// of z = -22 x0.5. Directions stay within ~10 degrees of the real ones (geo.ts). The river, the rail and the Rama II road
// are OSM ways run through that transform (scripts in the brief's map folder), simplified to ~35 m.
export type P = [number, number];
export const M_PER_UNIT = 100;

export const TILE = {x0: -40, x1: 36, z0: -30, z1: 44};

// ---- the Mae Klong (OSM way 1460457504): in from the north-west past Bang Kung, the loop west of town, down the town's
// west side, out past the Rama II bridge to the mouth
export const MAEKLONG: P[] = [
  // enters at the tile's north edge (drawn 1.2 E so the 2.2-wide channel stays on the tile)
  [-38.5, -30.0], [-38.4, -28.7], [-37.3, -22.2], [-37.9, -13.1], [-37.6, -10.7], [-36.3, -10.4], [-33.7, -13.4],
  [-32.4, -10.8], [-32.2, -8.4], [-33.6, -1.8], [-33.7, 2.2], [-32.6, 4.0], [-31.0, 3.8], [-28.8, 1.1], [-27.1, 1.1],
  [-26.0, 2.3], [-25.2, 4.5], [-25.2, 12.3], [-24.4, 13.2], [-22.6, 12.9], [-20.2, 10.4], [-19.1, 8.3], [-18.7, 6.0],
  [-18.9, 1.3], [-22.8, -6.5], [-22.1, -8.1], [-20.5, -9.3], [-18.0, -9.1], [-15.6, -8.1], [-6.7, 0.1], [-6.2, 3.3],
  [-8.4, 10.5], [-17.4, 24.2], [-20.8, 28.1], [-20.8, 29.3], [-19.7, 30.4], [-15.1, 31.1], [-12.0, 32.4],
];
export const MAEKLONG_W = 2.2;
/** the estuary: from below the Rama II bridge, widening out to the gulf */
/** ends at the tile's south edge, beside the gulf's corner (the engine draws a path river as boxes, unclipped) */
export const ESTUARY: P[] = [[-13.0, 32.0], [-9.4, 34.4], [-6.0, 37.6], [2.0, 41.6], [10.0, 44.0]];
export const ESTUARY_W = 6.0;
/** the coast (OSM coastline, way 746400327), Don Hoi Lot's flats on it; the gulf is one wide path south-east of it */
export const COAST: P[] = [[0, 50.6], [10, 45.4], [21.0, 40.6], [25.3, 39.4], [30.1, 36.8], [34.5, 34.9], [39.1, 29.4], [44, 22]];
/** the Gulf of Thailand on the tile: the corner south-east of the coast, cut at the tile's edges (drawn in Landmarks.tsx
 *  as one flat shape, so no water hangs off the tile) */
export const SEA: P[] = [[12.6, 44], [21.0, 40.6], [25.3, 39.4], [30.1, 36.8], [34.5, 34.9], [36, 33.1], [36, 44]];

// ---- the town (OSM pins)
export const PILLAR: P = [0, 0]; // ศาลหลักเมือง (origin; built 2517)
export const STATION: P = [-4.6, 5.0]; // สถานีรถไฟแม่กลอง, the terminus ~100 m from the bank
/** วัดเพชรสมุทรวรวิหาร (วัดบ้านแหลม): the red-roofed compound on the bank just north of the station */
export const WAT_PHET: P = [-4.3, 3.0];
/** the landing in front of Wat Phet, on the bank (the river's east edge is ~-5.1 here) */
export const LANDING: P = [-4.9, 3.9];
/** ป้อมพิฆาตข้าศึก (Rama III; abolished 2425): the site of Somdet Phra Phutthaloetla hospital, on the bank S of the station */
export const FORT: P = [-5.0, 6.8];
export const HALL: P = [-1.2, -1.1]; // ศาลากลาง (OSM)
/** the old riverside town: the dense blocks between the river and the Phet Samut road (imagery; not a legal boundary) */
export const OLD_TOWN: P[] = [[-4.6, 0.6], [0.6, -0.6], [1.8, 4.4], [1.0, 9.2], [-3.4, 9.8], [-5.0, 7.8], [-3.6, 5.6], [-4.4, 2.0]];

// ---- the railway (OSM way 591357872 runs ENE out of town; the engine's line is straight, along x, ~30 degrees off)
export const RAIL_Z = 5.0;
/** the market section: the last ~300 m of track before the station, stalls both sides (ตลาดร่มหุบ) */
export const MARKET_X: [number, number] = [-3.8, -0.6];

// ---- roads (OSM)
/** ถนนพระรามที่ 2 (ทล.35), in from the west over its Mae Klong bridge, round the town's south and out to the north-east */
export const RAMA2: P[] = [
  [-40.9, 42.8], [-36.4, 38.1], [-31.7, 33.7], [-26.7, 29.1], [-23.6, 28.8], [-22.2, 28.76], [-19.4, 28.68], [-17.0, 28.6], [-10.5, 27.9], [-4.9, 24.2],
  [-0.7, 19.0], [3.7, 14.4], [8.9, 10.5], [13.8, 6.6], [19.4, 2.7], [25.2, -0.9], [30.3, -6.0], [34.4, -11.0], [39.4, -15.1],
];
/** สะพานสมเด็จพระพุทธเลิศหล้านภาลัย: where Rama II crosses the Mae Klong */
export const RAMA2_BRIDGE: P = [-20.8, 28.7];
/** ถนนชูศักดิ์ (ทล.325), the old road west to Amphawa (a viaduct over a side channel near town; the main river is crossed
 *  upstream) */
export const CHUSAK: P[] = [[-31.8, -12.8], [-31.4, -6.4], [-30.9, -3.4], [-25.3, -7.7], [-19.3, -11.5], [-16.2, -11.2], [-10.1, -7.0], [-5.4, -4.1], [-2.0, 1.1]];
/** ทล.3092 north-east out of town */
export const NE_ROAD: P[] = [[1.6, 4.2], [3.0, -1.5], [6.0, -8.9], [11.8, -12.3], [20, -16], [30, -20]];

// ---- the cover: the pla thu tray on open ground between the town and the sea
export const TRAY_AT: P = [10, 22];
export const TRAY_S = 36;

// ---- the river mouth (the catch), Don Hoi Lot (the grow shot), Bang Kung (the battle, far place)
export const MOUTH: P = [-4.0, 37.3];
/** on the estuary's centreline, mid-channel */
export const NET_AT: P = [-1.0, 40.1];
export const DON_HOI_LOT: P = [21.5, 40.4];
/** วัดบางกุ้ง / ค่ายบางกุ้ง: 7.7 km NW, drawn at the tile's north-west on the east bank (bearing 301 degrees, real 299) */
export const BANG_KUNG: P = [-34.6, -21.0];
/** อัมพวา (sub line only; on the loop at the west edge) */
export const AMPHAWA: P = [-34.9, -14.2];
