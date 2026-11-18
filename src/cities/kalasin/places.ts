// Real positions (cloud's map, docs/briefs/kalasin_onep/README.md and its geojson): world units at 100 m/unit, +x east,
// +z south, origin the city pillar shrine (ศาลเจ้าพ่อหลักเมือง, 16.43519, 103.50069, OSM way 1534234341). Pure data so
// actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it. The town is at true scale: คลองปาว, the old core, Kut Nam Kin,
// the Kaeng Don Klang pond and the growth east to the new provincial hall are OSM run through that transform. Drawn closer:
// the main Lam Pao (x0.35 west of x = -28, so it runs down the tile's west edge), the Lam Pao dam and its reservoir (19 km
// N, drawn at the tile's north-west corner) and Phu Kum Khao (29 km N, drawn on the north edge). Directions stay within
// ~15 degrees of the real ones (geo.ts).
export type P = [number, number];
export const M_PER_UNIT = 100;

export const TILE = {x0: -38, x1: 44, z0: -46, z1: 36};

// ---- คลองปาว (OSM way 242809647, a meandering stream ~20-40 m wide): it carries the old town on its east bank. Resampled
// to ~150 m by the old core, ~450 m elsewhere; joined at its north end to the main Pao below the dam (the real stream runs on
// north through paddy ditches), and on past the town to the south edge.
export const KHLONG: P[] = [
  [-23.0, -31.6], [-16.0, -31.0], [-9.0, -30.4], [-2.0, -28.4], [2.2, -26.4],
  [4.1, -24.0], [1.0, -20.1], [-0.1, -15.4], [1.3, -11.9], [-0.7, -11.1], [-2.5, -11.0], [-2.7, -9.5], [-0.8, -8.8],
  [0.5, -7.6], [1.9, -6.4], [0.7, -5.1], [-1.0, -4.2], [-2.0, -2.4], [-2.9, -1.1], [-4.4, -1.6], [-5.6, -2.8], [-7.4, -2.6],
  [-7.0, -0.9], [-5.2, 0.1], [-3.0, 0.5], [-1.4, 1.2], [-1.3, 3.4], [-1.8, 5.4], [-3.1, 6.9], [-5.0, 6.8], [-6.8, 7.1],
  [-8.0, 8.1], [-7.9, 9.8], [-6.3, 10.4], [-3.7, 14.3], [-0.8, 17.9], [-3.9, 21.3], [-8.6, 21.5], [-5.0, 24.9],
  [-1.8, 28.2], [2.7, 28.6], [5.7, 24.7], [8.6, 27.3], [12.8, 30.1], [11.6, 33.2], [11.0, 36.0],
];
export const KHLONG_W = 0.7;
/** the main ลำน้ำปาว (OSM way 186117443) from below the dam down the tile's west edge (x0.35 west of x = -28); it ends
 *  exactly on the south edge (the engine draws a path river as unclipped boxes) */
export const PAO: P[] = [
  [-20.5, -32.8], [-26.0, -30.4], [-31.5, -26.4], [-34.6, -20.0], [-35.2, -12.0], [-34.8, -2.0], [-34.2, 6.0],
  [-31.6, 14.0], [-29.0, 21.0], [-26.6, 28.0], [-25.4, 36.0],
];
export const PAO_W = 1.4;

/** กุดน้ำกิน: the oxbow of คลองปาว 0.8 km S of the pillar (OSM water 169557178), the first pillar's site (2335). Drawn as one
 *  flat shape; until the bank beat a neck of water joins its west end to the khlong. */
export const OXBOW: P[] = [
  [-3.2, 7.7], [-2.7, 7.3], [-1.6, 7.4], [-0.9, 7.2], [-0.3, 7.3], [0.0, 8.0], [-1.1, 8.6], [-1.7, 8.9], [-2.4, 8.9],
  [-3.1, 8.8], [-2.5, 8.5], [-1.8, 8.4], [-1.3, 8.0], [-2.7, 7.7],
];
/** the neck that joined the oxbow to the khlong before the bank gave way (its west end to the khlong at (-3.1, 6.9)) */
export const NECK: P[] = [[-3.4, 7.0], [-3.6, 7.5], [-3.2, 7.8], [-2.8, 7.6], [-3.0, 7.1]];
/** the first pillar (2335), on the land between the khlong and the oxbow */
export const FIRST_PILLAR: P = [-1.3, 6.5];

/** the pond of สวนสาธารณะแก่งดอนกลาง (OSM 242763546), ~1 km across, 2 km NE: one flat shape */
export const POND: P[] = [
  [15.4, -21.2], [17.7, -22.8], [18.7, -21.4], [18.9, -20.0], [17.9, -18.0], [16.9, -16.7], [16.1, -15.5], [14.0, -14.7],
  [13.7, -13.4], [14.1, -12.2], [13.4, -10.8], [11.8, -10.7], [9.9, -11.8], [8.7, -12.7], [9.2, -14.1], [10.2, -15.3],
  [10.8, -16.6], [12.3, -17.2], [13.4, -18.3], [14.3, -20.3], [13.2, -22.4], [14.0, -21.3],
];
export const POND_C: P = [14.0, -16.4];

// ---- the old core on the khlong (OSM pins)
export const PILLAR: P = [0, 0]; // ศาลเจ้าพ่อหลักเมือง (origin; the pillar moved here in 2370)
export const SOMPHAMIT: P = [-1.0, 0.2]; // ศาลเจ้าพ่อโสมพะมิตร (OSM -1.31, 0.18; drawn 0.3 E, clear of the bank)
export const WAT_NUEA: P = [1.2, -2.9]; // วัดเหนือ (วัดศรีบุญเรือง; OSM 1.2, -2.55, drawn 0.35 N clear of Wat Klang)
/** วัดกลาง พระอารามหลวง (OSM 1.83, 0.04): drawn 1.0 N, its sim turned along the street, so ถนนกาฬสินธุ์ passes it, not
 *  through it (owner: a road never runs through a landmark) */
export const WAT_KLANG: P = [1.8, -1.0];
export const WAT_TAI: P = [0.6, 2.9]; // วัดใต้โพธิ์ค้ำ (OSM 0.44, 2.86; drawn 0.16 E)
export const MONUMENT: P = [3.1, 1.0]; // อนุสาวรีย์พระยาชัยสุนทร (the roundabout)
/** the old core between the khlong and ถนนกาฬสินธุ์'s east end (imagery; not a legal boundary): the town's houses fill it */
export const OLD_CORE: P[] = [
  [-0.4, -5.6], [3.8, -5.4], [5.4, -1.0], [5.0, 5.6], [2.2, 8.4], [0.2, 6.6], [-0.4, 4.6], [-0.4, 1.8], [-0.6, -1.0],
  [0.2, -3.6],
];

// ---- roads (OSM)
/** ถนนกาฬสินธุ์: the old street east from the pillar */
export const OLD_STREET: P[] = [[0.8, 0.45], [2.6, 0.7], [5.3, 1.2], [8.2, 1.7], [11.6, 2.4]];
/** ถนนถีนานนท์ (ทล.299) round the town's south and away north-east past the new provincial hall; in from the west over the
 *  khlong (OSM marks the bridge) */
export const SOUTH_ROAD: P[] = [
  [-13.8, 11.6], [-9.3, 11.7], [-6.3, 11.6], [-3.4, 11.4], [0.3, 11.8], [5.8, 12.5], [11.0, 12.7], [15.2, 11.9],
  [19.4, 10.1], [23.2, 8.5], [26.7, 5.8], [31.9, 1.2], [37.6, -3.8], [40.7, -6.5], [43.6, -9.2],
];
/** where SOUTH_ROAD crosses the khlong */
export const SOUTH_BRIDGE: P = [-5.5, 11.6];
/** ถนนถีนานนท์ north-east from the old street's end (the ring) */
export const NE_ROAD: P[] = [[11.6, 2.4], [15.5, -2.3], [19.2, -6.4], [23.3, -11.0], [26.1, -14.2], [28.8, -17.2], [32.3, -19.7], [36.8, -21.0], [42.5, -22.7], [43.8, -23.2]];
/** ทล.227 north from the ring past the pond */
export const N_ROAD: P[] = [[15.5, -2.3], [15.6, -7.5], [16.5, -9.1], [18.1, -13.9], [19.6, -17.7], [21.4, -22.4], [22.7, -26.2], [24.6, -32.4], [26.5, -37.9], [29.3, -45.8]];
/** ทล.214 south-east */
export const SE_ROAD: P[] = [[11.0, 12.7], [12.8, 15.0], [15.1, 18.3], [18.3, 22.7], [21.3, 26.8], [24.1, 30.6], [27.0, 34.4], [28.4, 35.8]];
/** ทล.12, the bypass south of town */
export const BYPASS: P[] = [[-20.8, 24.2], [-15.4, 26.9], [-11.5, 29.1], [-7.9, 31.0], [-5.0, 32.6], [0.4, 35.6]];

// ---- the new town
/** ศาลากลางจังหวัด (the new provincial hall, OSM node 10823555706) */
export const HALL: P = [37.0, -7.9];
/** the fair ground in front of it (the pong lang and Phrae Wa fair), on open ground west of the hall */
export const FAIR: P = [32.4, -8.4];
/** the frame on the fair ground where the cover's shawl hangs (the callback) */
export const SHAWL_AT: P = [FAIR[0], FAIR[1] - 2.9];
export const UNIVERSITY: P = [33.5, -14.7];

// ---- the cover: the giant loom on open ground east of the old town (it becomes town later)
export const LOOM_AT: P = [24, -4];
export const LOOM_S = 40;

// ---- far places, drawn closer at the north edge (the dam -> Phu Kum Khao direction kept: 34 degrees real, ~40 drawn)
/** the Lam Pao dam's outlet (real 19.1 km N, bearing 347); drawn at the north-west, bearing 330 */
export const DAM: P = [-20.5, -34.2];
/** the crest's line, west to east, along the reservoir's south shore */
export const CREST: P[] = [[-37.4, -33.6], [-31.0, -33.8], [-25.0, -34.0], [-20.5, -34.2], [-17.6, -34.6]];
/** the Lam Pao reservoir on the tile: the corner north of the crest, west of Phu Kum Khao, cut at the tile's edges */
export const RESERVOIR: P[] = [
  [-38, -46], [-19.4, -46], [-18.6, -43.0], [-19.2, -40.0], [-18.2, -37.0], [-18.4, -35.2], [-25.0, -34.9],
  [-31.0, -34.7], [-38, -34.5],
];
/** ภูกุ้มข้าว (real 28.6 km N, bearing 5): a low hill on the reservoir's east shore (drawn bearing 343), the dig on its
 *  south slope */
export const PHU_KUM_KHAO: P = [-13.0, -42.8];
export const DIG: P = [-12.6, -39.6];
