// Real positions (cloud's map, docs/briefs/roiet_onep/README.md and its geojson): world units at 100 m/unit, +x east,
// +z south, origin the city pillar shrine on the island in บึงพลาญชัย (ศาลหลักเมืองร้อยเอ็ด, 16.05675, 103.65253, OSM way
// 1444501158). Pure data so actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it. Everything on the tile is at true
// scale: the moat (OSM relation 14556044), the bueng (relation 2222833), the temples, the old airstrip, หนองหญ้าม้า and
// the roads are OSM run through that transform. No far places. Landmarks are drawn larger than life (the tower, Phra Sung
// Yai, the sim) but stand on their real pins.
export type P = [number, number];
export const M_PER_UNIT = 100;

export const TILE = {x0: -40, x1: 40, z0: -42, z1: 40};

// ---- the Dvaravati moat: its centreline, resampled every 7.5 degrees round (-1.2, -1.4); the filled north half of the
// west side (now a road) is closed again, it was water in 2318
export const MOAT: P[] = [
  [7.1, -1.4], [7.0, -0.3], [6.8, 0.8], [6.7, 1.9], [6.6, 3.1], [6.4, 4.4], [6.3, 6.1], [5.4, 7.2], [3.8, 7.3], [2.4, 7.4],
  [1.2, 7.5], [0.0, 7.6], [-1.2, 7.7], [-2.4, 7.8], [-3.7, 7.9], [-5.1, 7.9], [-6.6, 8.0], [-8.5, 8.1], [-9.8, 7.2],
  [-10.1, 5.4], [-9.9, 3.6], [-9.7, 2.1], [-9.3, 0.6], [-9.3, -1.5], [-9.3, -3.5], [-9.3, -6.1], [-8.6, -7.1], [-7.7, -7.9],
  [-6.5, -8.3], [-5.2, -8.3], [-4.0, -8.0], [-3.0, -8.1], [-2.1, -8.3], [-1.2, -8.5], [-0.2, -8.7], [0.8, -8.8], [2.0, -9.1],
  [3.3, -9.2], [4.9, -9.4], [6.5, -9.1], [7.4, -8.0], [7.5, -6.4], [7.5, -5.0], [7.5, -3.7], [7.3, -2.5],
];
export const MOAT_W = 0.55;
/** the town inside the moat (the engine's city ground and in-town house grid), 0.6 in from the water */
export const TOWN: P[] = MOAT.map(([x, z]) => {
  const dx = -1.2 - x;
  const dz = -0.4 - z;
  const d = Math.hypot(dx, dz);
  return [Math.round((x + (dx / d) * 0.6) * 10) / 10, Math.round((z + (dz / d) * 0.6) * 10) / 10] as P;
});

// ---- บึงพลาญชัย: the shore and the island (two lobes joined; the pillar shrine on the south-east lobe)
export const BUENG: P[] = [
  [-0.6, 1.0], [-0.3, 0.7], [0.2, 0.9], [0.5, 0.9], [0.7, 0.8], [0.8, 0.2], [0.8, -0.1], [0.7, -0.9], [0.5, -1.4],
  [0.1, -2.2], [-0.5, -3.0], [-0.9, -3.3], [-1.2, -3.5], [-1.8, -3.5], [-2.4, -3.4], [-2.9, -3.3], [-3.2, -3.2],
  [-3.4, -2.9], [-3.6, -2.4], [-3.7, -1.7], [-3.6, -1.2], [-3.4, -0.7], [-2.8, 0.1], [-2.3, 0.6], [-1.6, 1.1], [-0.9, 1.2],
];
export const ISLAND: P[] = [
  [-2.3, -0.9], [-2.2, -0.5], [-2.0, -0.1], [-1.4, 0.0], [-0.7, 0.3], [-0.3, 0.5], [0.1, 0.5], [0.3, 0.2], [0.2, -0.2],
  [0.0, -0.4], [-0.4, -0.05], [-0.6, -0.3], [-0.6, -0.7], [-0.5, -1.2], [-0.6, -1.8], [-0.9, -2.1], [-1.3, -2.5],
  [-1.9, -2.6], [-2.5, -2.6], [-2.7, -2.1], [-2.7, -1.6], [-2.5, -1.3],
];
export const BUENG_C: P = [-1.4, -1.2];
/** the shore path the Phawet procession walks, ~0.45 outside the water, round the bueng */
export const SHORE: P[] = BUENG.map(([x, z]) => {
  const dx = x - BUENG_C[0];
  const dz = z - BUENG_C[1];
  const d = Math.hypot(dx, dz);
  return [x + (dx / d) * 0.45, z + (dz / d) * 0.45] as P;
});

/** หนองหญ้าม้า (OSM relation 18169840), 3-5 km S: one flat shape cut at the tile's south edge */
export const NONG_YA_MA: P[] = [
  [8.0, 34.1], [11.8, 33.6], [14.4, 30.5], [19.9, 29.6], [22.2, 27.5], [23.6, 27.3], [25.1, 29.6], [28.8, 30.6],
  [30.6, 31.1], [31.2, 30.1], [33.9, 34.6], [33.7, 37.1], [32.6, 40], [27.9, 40], [27.5, 39.6], [21.0, 40], [17.0, 40],
  [18.7, 32.0], [14.8, 34.5], [10.9, 35.5],
];

// ---- the old town (OSM pins)
export const PILLAR: P = [-0.15, 0.1]; // ศาลหลักเมือง on the island (OSM 0, 0; drawn 0.15 W, inside the lobe's shore)
export const WAT_BUENG: P = [-3.9, 0.6]; // วัดบึงพระลานชัย (OSM -3.6, 0.4; drawn 0.3 W, clear of the shore)
export const WAT_KLANG: P = [2.0, -5.6]; // วัดกลางมิ่งเมือง
export const WAT_SA_THONG: P = [-3.0, -7.1]; // วัดสระทอง
export const WAT_NUEA: P = [-7.2, -5.0]; // วัดเหนือ
export const WAT_BURAPHA: P = [6.4, -6.0]; // วัดบูรพาภิราม: Phra Sung Yai (OSM artwork node 3633967718)
/** หอโหวด ๑๐๑ (OSM node 11496203069 at -0.1, 2.3): drawn 0.35 N, between the bueng's south shore (z ~1.0) and ถนนเทวาภิบาล
 *  (z ~3.2), its base (radius 0.86) off the road and out of the water */
export const TOWER: P = [-0.1, 1.98];
export const TOWER_R = 0.87;
/** the provincial hall south of the road (OSM node 2648733780) */
export const HALL: P = [2.4, 4.0];
/** the old airstrip NNW of the moat (OSM runway 17/35): its south and north ends */
export const STRIP: [P, P] = [[-6.0, -10.6], [-8.2, -19.7]];
export const STRIP_W = 0.9;

// ---- roads (OSM), each a polyline; the moat crossings are bridges (index.ts)
/** ถนนเทวาภิบาล / แจ้งสนิท (ทล.23): west to east across the town, south of the bueng */
export const MAIN_ROAD: P[] = [
  [-40, -9.1], [-35.1, -7.3], [-29.9, -5.1], [-25.6, -3.4], [-21.1, -1.5], [-17.4, 0.1], [-14.1, 1.4], [-10.7, 2.8],
  [-6.7, 3.6], [-2.5, 3.3], [0.7, 3.2], [4.1, 3.5], [7.8, 4.0], [11.6, 4.3], [15.5, 3.8], [21.5, 2.8], [26.0, 2.1],
  [29.1, 1.5], [35.9, 0.5], [40, 0.6],
];
/** ทล.214 north out of the moat, past the airstrip's east side */
export const N_ROAD: P[] = [
  [-0.9, -4.4], [-1.2, -7.0], [-1.3, -9.3], [-3.0, -14.1], [-4.1, -17.4], [-5.0, -19.9], [-6.1, -23.3], [-7.3, -26.6],
  [-8.1, -29.0], [-10.6, -36.2], [-12.4, -42],
];
/** ถนนปัทมานนท์ (ทล.214) south-south-west */
export const SW_ROAD: P[] = [[-4.6, 3.6], [-5.0, 6.0], [-5.3, 8.5], [-6.3, 13.5], [-7.2, 16.6], [-8.2, 19.9], [-8.7, 22.3], [-9.7, 26.6], [-10.3, 29.2], [-11.1, 32.8], [-11.7, 35.7], [-12.3, 40]];
/** ถนนสุริยเดชบำรุง (ทล.215) south-south-east */
export const SE_ROAD: P[] = [[0.7, 3.2], [0.9, 5.4], [1.6, 8.4], [2.2, 11.9], [2.8, 15.4], [3.4, 19.3], [4.0, 22.7], [4.5, 26.2], [5.1, 29.4], [6.8, 32.4], [8.4, 36.3], [9.6, 40]];

// ---- the cover's wot: on open paddy south-east of the moat (it becomes town later)
export const WOT_AT: P = [17, 12];
export const WOT_S = 44;

// ---- the founding: Thao Thon's people come up from the south (Suwannaphum) to the moat's south causeway and on to the
// bueng's west bank, where Wat Bueng Phra Lan Chai is cleared from the ruins
export const FOUND_PATH: P[] = [[-9.0, 30.0], [-8.0, 22.0], [-6.8, 15.0], [-5.6, 10.6], [-5.2, 7.9], [-4.8, 5.2], [-4.4, 2.6], [-4.3, 1.6]];
/** the old causeway over the moat (later the bridge of ถนนปัทมานนท์) */
export const CAUSEWAY: P = [-5.2, 7.9];
