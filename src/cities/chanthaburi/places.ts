// Real positions ([local]'s map, docs/briefs/chanthaburi_onep/README.md, PR #86; Gemini's answer in
// docs/briefs/chanthaburi_research_gemini.md): world units at 100 m/unit, +x east, +z south, origin the city pillar
// (ศาลหลักเมือง, Ban Lum, 12.61616, 102.11061). Pure data so actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it.
//
// The town core (within 1.4 km of the pillar) is drawn at true scale. Everything further out is pulled in toward the
// pillar along its true bearing (`squeeze`: the first 1.4 km true, every km beyond it drawn as 250 m), so the river
// mouth (16.5 km), Noen Wong (5.5 km), Khao Ploi Waen (7.7 km) and the shipyard at Samet Ngam (10 km) fit on the tile
// with their directions kept. Stated as approximate in the brief ("## v1 build").
export type P = [number, number];
export const M_PER_UNIT = 100;
const R0 = 14;
const K = 0.25;
export const squeeze = ([x, z]: P): P => {
  const r = Math.hypot(x, z);
  if (r <= R0) return [x, z];
  const f = (R0 + (r - R0) * K) / r;
  return [x * f, z * f];
};

export const TILE = {x0: -42, x1: 36, z0: -26, z1: 52};
/** the coast: the Gulf of Thailand fills the tile south of this line */
export const COAST = 48.6;

// ---- the town (true scale)
export const PILLAR: P = [0, 0]; // ศาลหลักเมือง + ศาลพระเจ้าตาก (origin)
export const CAMP: P = [-1.03, -3.84]; // ค่ายตากสิน: the Ban Lum wall's line runs inside it (ONEP §5.2.1)
export const FRENCH_HOUSE: P = [-0.6, -1.4]; // ตึกฝรั่งเศสในค่ายตากสิน (gem's pin, unchecked), drawn 0.5 S off the shrine
export const OLD_HALL: P = [0.37, 1.33]; // ศาลากลางหลังเก่า
export const BOT_MUEANG: P = [2.72, 2.61]; // วัดโบสถ์เมือง
export const WATERFRONT: P = [3.37, 3.81]; // ชุมชนริมน้ำจันทบูร (ถ.สุขาภิบาล)
export const CATHEDRAL: P = [8.9, 7.66]; // อาสนวิหาร (OSM pin 12.60923, 102.11864; drawn 0.2 E so its front clears the bank)
export const MARKET: P = [3.0, 10.1]; // ตลาดพลอย ถ.ศรีจันทร์ (OSM 4.95, 10.36; the stalls run west along the street from it)

// ---- the Ban Lum laterite wall (Narai's reign; ONEP: ~1,000 x 2,000 m round today's ค่ายตากสิน, west of the river).
// Its orientation is not recorded: drawn with the long side N-S along the river's west bank, the pillar at its SE corner.
export const WALL: P[] = [[-9, -18.5], [0.8, -18.5], [0.8, 1.5], [-9, 1.5]];
/** the gate the elephant breaks (south side, toward the open fields where the army stands) */
export const GATE: P = [-4.2, 1.5];

// ---- the river (OSM ways 27163513 + 27163449). Upstream and through the town at true scale, nudged in the town reach
// so the waterfront (west bank) and วัดจันทนาราม / the cathedral (east bank) stay on their banks; below the town the
// OSM centreline is squeezed (above) and simplified.
const UP: P[] = [
  [36, -23.2], [31, -25], [26.8, -19.5], [23.8, -19.7], [20.5, -19.5], [21.2, -16.5], [18.7, -15.5], [15.4, -14.4],
  [15.2, -12], [12.6, -9.7], [10.3, -9.3], [8.2, -7.2], [7.4, -5.2], [6.2, -3.0], [5.3, -0.6], [4.9, 1.5], [4.5, 3.6],
  [5.1, 5.6], [6.5, 7.5], [7.3, 9.3], [7.0, 10.8], [5.2, 11.9], [3.0, 12.3], [2.2, 13.6],
];
// squeezed OSM points below the town (scripts in the brief's v1 section), simplified to the bends that read
export const LOWER: P[] = [
  [2.4, 14.7], [1.6, 16.6], [-2.0, 16.9], [-5.1, 18.1], [-9.4, 18.9], [-13.0, 18.2], [-15.6, 19.8], [-15.6, 23.6],
  [-13.4, 27.4], [-9.8, 28.2], [-9.2, 30.6], [-13.4, 32.2], [-16.4, 33.6], [-16.2, 38.4], [-16.8, 42.0], [-17.2, 44.4],
];
export const RIVER: P[] = [...UP, ...LOWER];
export const RIVER_W = 1.5; // 50-80 m in town, drawn ~2x so it reads
/** the estuary at Laem Sing: 0.8-1 km wide, drawn 4.4 */
export const ESTUARY: P[] = [[-17.0, 42.6], [-17.6, 46.0], [-18.4, 49.2], [-19.0, 51.9]];
export const ESTUARY_W = 4.4;

// ---- far places, squeezed along their true bearings
export const NOEN_WONG: P = [-21, 13]; // ค่ายเนินวง / วัดโยธานิมิต (12.58657, 102.06974; squeeze gives -19.6, 14.4: drawn 1.4 NW off the river)
export const NW_HALF = [2.8, 3.0]; // 560 x 600 m (ONEP, 14 x 15 เส้น), drawn true size
export const KHAO_PLOI_WAEN: P = squeeze([-76.41, 7.66]); // เขาพลอยแหวน (12.60923, 102.04027)
export const SAMET_NGAM: P = [-12.0, 34.4]; // อู่ต่อเรือเสม็ดงาม (squeeze -13.1, 33.2: on the east bank, unnamed on screen)
/** ป้อมไพรีพินาศ on the west headland and ตึกแดง (on ป้อมพิฆาตปัจจามิตร) on the east bank, drawn either side of the estuary */
export const WEST_FORT: P = [-22.4, 46.6];
export const TUEK_DAENG: P = [-13.6, 44.2];
export const TOWER: P = [-11.4, 44.8]; // the brick tower 350 m E of ตึกแดง (คุกขี้ไก่; not named on screen)

// ---- the cover: the giant lap on the fields west of the river, where the walled town will be
export const HERO_AT: P = [-15, -7];
export const HERO_S = 26;

// ---- roads (OSM names; years approximate, the grow beat)
// ถ.ท่าหลวง through the old town and over the river to the east bank, and its new road west (the town spreads west)
export const THA_LUANG: P[] = [[-6.7, 0.15], [0.9, 1.03], [3.4, 2.46], [6.0, 4.06], [9.5, 3.75], [15.0, 0.9], [24, -0.6], [35.4, -0.7]];
export const WEST_ROAD: P[] = [[-6.7, 0.15], [-18, -2.6], [-41.4, -6.2]];
export const SI_CHAN: P[] = [[0.3, 10.25], [4.6, 10.31]];
// the road down to the mouth (the grow beat), on the west side of the lower river
export const SOUTH_ROAD: P[] = [[-6.7, 0.15], [-8.6, 7.6], [-13.0, 12.6], [-17.4, 17.6], [-19.6, 24.0], [-21.0, 32.0], [-21.6, 42.0]];

// the column that carries the wall's stones from Ban Lum to Noen Wong (2377), and comes back (2419)
export const NW_PATH: P[] = [[-6.0, 2.4], [-9.5, 6.0], [-14.5, 9.6], [-18.6, 11.4]];
