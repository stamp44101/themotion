// Real positions (cloud's map, docs/briefs/loei_onep/README.md and its geojson): world units at 100 m/unit, +x east,
// +z south, origin Wat Phon Chai in Dan Sai (วัดโพนชัย, 17.27452, 101.14908, OSM node 4319746818), the temple of the Bun
// Luang / Phi Ta Khon festival. Pure data so actors.ts, timeline.ts, geo.ts, Landmarks.tsx and the style frames share it.
// Dan Sai is at true scale: ลำน้ำหมัน, ห้วยน้ำศอก, the stupa, the roads and the hills are OSM and Esri hillshade run through
// that transform. Drawn closer: Loei town (66 km, bearing 69; drawn at the NE, bearing ~60) and Phu Kradueng (78 km,
// bearing 123; drawn at the SE, bearing ~131). Directions stay within ~10 degrees of the real ones (geo.ts).
export type P = [number, number];
export const M_PER_UNIT = 100;

export const TILE = {x0: -36, x1: 44, z0: -42, z1: 38};

// ---- ลำน้ำหมัน (OSM way 310614163): flows south to north through Dan Sai, ~30-40 m wide. Resampled to ~1 unit; extended
// down its forested valley to the south edge (OSM's way starts 2.6 km south of town) and clipped at the north edge.
export const MAN: P[] = [
  [-12.2, 38.0], [-12.5, 33.0], [-11.8, 29.0], [-11.11, 25.59], [-10.7, 24.42], [-9.58, 23.63], [-8.84, 22.48], [-9.03, 21.44],
  [-9.55, 20.15], [-10.07, 18.88], [-10.36, 17.78], [-9.99, 16.69], [-10.14, 15.41], [-9.92, 14.14], [-11.28, 12.56],
  [-12.56, 12.52], [-13.16, 11.68], [-12.13, 11.44], [-10.78, 11.04], [-9.15, 10.5], [-8.95, 9.43], [-9.56, 8.25],
  [-9.59, 7.09], [-9.65, 5.97], [-8.09, 5.59], [-6.46, 5.09], [-7.15, 4.26], [-8.35, 3.56], [-9.38, 2.82], [-9.58, 1.38],
  [-8.92, 0.15], [-7.93, -0.64], [-6.94, -1.1], [-5.94, -1.49], [-4.78, -1.87], [-3.79, -2.17], [-2.75, -1.31],
  [-1.75, -1.05], [-0.94, -2.27], [0.06, -2.52], [0.83, -1.82], [1.54, -3.25], [2.41, -3.76], [1.91, -4.69], [1.42, -5.62],
  [0.26, -6.22], [-0.76, -6.16], [-1.77, -6.34], [-2.02, -7.51], [-2.24, -9.0], [-1.25, -9.69], [-1.63, -10.97],
  [-1.58, -11.99], [-1.32, -13.14], [-1.37, -15.02], [-1.48, -16.44], [-0.77, -17.96], [-0.96, -19.39], [-1.31, -20.67],
  [-2.48, -21.23], [-2.43, -22.5], [-1.69, -23.27], [-1.94, -24.56], [-3.28, -24.74], [-4.31, -25.12], [-4.27, -26.3],
  [-3.8, -27.46], [-3.12, -28.56], [-2.07, -28.66], [-1.52, -27.73], [-0.86, -28.58], [0.52, -29.0], [1.68, -29.65],
  [2.7, -29.61], [3.23, -30.71], [2.37, -31.33], [0.94, -31.96], [0.24, -32.71], [-0.51, -33.48], [-1.51, -32.86],
  [-1.44, -34.19], [-0.8, -35.41], [0.45, -35.59], [-0.15, -36.66], [-0.96, -37.79], [-0.75, -38.99], [0.23, -39.53],
  [1.26, -39.43], [2.53, -39.59], [2.88, -40.84], [2.6, -42.0],
];
export const MAN_W = 0.7;
/** ห้วยน้ำศอก (OSM way 310614172, "Huai Nam Sak"): curls round Wat Phon Chai's south and east and joins the Man to the WNW
 *  (the Phra Upakhut rite is held "between the Man and the Sok") */
export const SOK: P[] = [
  [6.6, 4.4], [4.6, 3.4], [3.25, 2.88], [2.34, 3.94], [1.5, 4.73], [0.39, 4.32], [-0.72, 3.8], [-1.45, 2.93], [-1.47, 1.89],
  [-0.82, 0.78], [-0.84, -0.38], [-1.94, -0.95],
];
export const SOK_W = 0.35;

// ---- Dan Sai (OSM pins)
export const PHON_CHAI: P = [0, 0]; // วัดโพนชัย (origin): the festival temple, on the tongue of land between the Man and the Sok
/** พระธาตุศรีสองรัก (OSM way 667841411): on the land inside the Man's bend 1.0 km WSW */
export const STUPA: P = [-8.9, 5.0];
/** the stupa's base drawn at 1.2 units (true 10.5 m), so it reads in the oath beat */
export const STUPA_W = 1.2;
/** the festival ground (OSM events venue 13197811002), north of the Man */
export const FAIR: P = [-2.9, -6.1];
/** the old town's core on both banks round Wat Phon Chai (imagery; not a legal boundary) */
export const OLD_CORE: P[] = [
  [-7.6, -1.8], [-5.0, -4.6], [-1.0, -7.4], [3.4, -6.4], [6.6, -2.6], [7.8, 1.4], [4.4, 3.2], [0.8, 5.6], [-3.6, 5.8], [-6.0, 3.4],
  [-7.8, 1.0],
];

// ---- roads (OSM; nudged off the riverbed where OSM's simplified ways touch the Man)
/** ทล.2013 east from the town toward Phu Ruea and Loei */
export const ROAD_E: P[] = [
  [-0.4, 2.0], [1.0, 2.2], [3.0, 1.6], [5.5, 0.5], [8.0, 0.2], [10.7, -1.5], [13.9, -3.3], [18.3, -5.8], [21.9, -7.5],
  [24.8, -6.8], [26.8, -8.3], [31.4, -8.7], [34.4, -11.7], [37.4, -14.6], [40.7, -17.8], [44.0, -21.0],
];
/** ทล.2013 west from the town, past the stupa, over the Man and up into the hills to the south-west */
export const ROAD_W: P[] = [
  [-0.4, 2.0], [-3.5, 2.2], [-6.2, 2.4], [-5.3, 5.3], [-7.0, 7.3], [-9.2, 7.9], [-11.0, 8.0], [-14.1, 8.3], [-16.7, 10.6],
  [-18.8, 13.7], [-22.9, 13.8], [-25.2, 14.3], [-24.2, 15.8], [-21.8, 17.5], [-25.0, 19.0], [-28.4, 19.6], [-31.7, 20.6],
  [-33.8, 19.8], [-34.5, 24.2], [-36.0, 25.8],
];
/** the road north out of town (to the 2113/2114 junction), west of the Man */
export const ROAD_N: P[] = [
  [-6.2, 2.4], [-8.0, 1.2], [-9.4, -0.6], [-10.2, -3.0], [-10.6, -8.4], [-9.0, -10.2], [-6.7, -10.4], [-4.4, -9.4], [-3.6, -10.0], [-2.9, -12.0], [-2.9, -15.6],
  [-3.3, -18.4], [-3.6, -20.5], [-3.9, -23.0], [-5.6, -25.1], [-5.6, -26.4], [-4.4, -29.6], [-3.2, -32.6], [-2.7, -36.7],
  [-2.4, -39.0], [-2.2, -42.0],
];
/** ทล.2113 north-west from the junction into the hills */
export const ROAD_NW: P[] = [
  [-10.6, -8.4], [-12.0, -10.5], [-14.0, -12.6], [-15.8, -15.2], [-18.6, -18.2], [-19.9, -20.9], [-20.5, -22.3], [-23.0, -26.8],
  [-23.6, -29.1], [-24.3, -30.2], [-24.3, -34.4], [-24.4, -38.2], [-25.0, -39.4], [-25.2, -42.0],
];
/** ทล.2014 south from the stupa's corner over the viewpoint hill */
export const ROAD_S: P[] = [
  [-5.3, 5.3], [-4.47, 6.9], [-3.57, 7.56], [-2.64, 8.84], [-2.89, 10.02], [-2.8, 11.03], [-1.82, 11.89], [-1.03, 12.67],
  [-0.36, 13.59], [0.26, 14.49], [0.91, 15.33], [0.84, 16.51], [0.56, 17.53], [0.59, 18.63], [0.98, 19.82], [1.96, 20.37],
  [3.24, 20.29], [4.76, 19.78], [5.96, 19.45], [7.18, 19.52], [6.38, 20.3], [5.55, 21.15], [5.3, 22.22], [5.18, 23.29],
  [5.57, 24.5], [6.69, 25.04], [7.18, 25.96], [6.84, 27.31], [6.45, 28.82], [6.26, 29.85], [6.61, 30.83], [7.0, 31.91],
  [7.4, 32.88], [7.82, 34.02], [8.11, 35.06], [7.54, 36.02], [6.9, 37.0], [6.6, 38.0],
];

// ---- the hills (Esri World_Hillshade): forested ridges all round; the Man's valley and the town stay level
export const PEAKS: [number, number, number, number][] = [
  // north-west and west
  [-32, -31, 6.5, 6.5], [-15, -34, 5.0, 4.5], [-30, -17, 7.2, 6], [-21, -5, 5.6, 5], [-31, 1, 7.2, 6], [-27, 8, 4.8, 4],
  // north, east of the Man's valley
  [11, -26, 6.4, 5], [9, -36, 5.6, 4], [17, -19, 6.4, 5],
  // south-west and south
  [-24, 27, 8.0, 6], [-31, 34, 6.4, 5], [-2, 31, 4.8, 4], [11, 22, 3.0, 4],
  // south-east and east
  [18, 13, 4.8, 5], [15, 32, 5.6, 5], [23, 3, 4.8, 4],
  // the hill behind Ban Hae, at whose foot Loei's smiths dug their furnaces (drawn)
  [25, -33, 4.0, 3],
];

// ---- the cover: the giant Phi Ta Khon on open ground north-east of the town, its face to the camera
export const HERO_AT: P = [12, -9];
export const HERO_S = 44;
/** the camera's azimuth on the cover (degrees from +z toward +x); the mask turns to face it */
export const COVER_AZ = 16;

// ---- far places, drawn closer
/** เมืองเลย: the city pillar on แม่น้ำเลย (real 66 km, bearing 69; drawn bearing ~60) */
export const LOEI: P = [33.0, -19.0];
/** แม่น้ำเลย through the drawn Loei town, flowing south to north (it enters from the tile's east edge) */
export const LOEI_RIVER: P[] = [[44.0, -11.5], [40.4, -13.8], [37.0, -16.4], [35.4, -19.4], [35.0, -23.0], [35.6, -27.0], [36.6, -31.0], [37.0, -36.0], [37.4, -42.0]];
export const LOEI_RIVER_W = 0.9;
/** ห้วยน้ำหมาน, the stream Ban Hae stood on, into the Loei from the west (not in OSM: drawn from the description) */
export const NAM_MAN: P[] = [[26.6, -25.4], [28.6, -23.6], [30.6, -22.0], [32.6, -21.2], [35.1, -21.0]];
export const NAM_MAN_W = 0.3;
/** Ban Hae: houses on both banks of the Huai Nam Man */
export const BAN_HAE: P = [31.0, -21.6];
/** ภูกระดึง: the flat-topped mountain (real 78 km, bearing 123; drawn bearing ~131) */
export const KRADUENG: P = [30.0, 26.0];
/** the plateau's top radius and its cliff height */
export const KRADUENG_R = 7.0;
export const KRADUENG_H = 6.0;
/** the climb up its west face, from the foot (Si Than) to the rim */
export const KR_TRAIL: P[] = [[18.0, 22.0], [20.2, 23.2], [21.6, 24.0], [22.8, 24.6], [23.4, 25.4], [24.2, 25.8]];
