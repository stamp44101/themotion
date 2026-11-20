// Real positions (cloud's map, docs/briefs/phrae_onep/README.md and its geojson): world units at 100 m/unit, +x east,
// +z south, origin the city pillar shrine (ศาลหลักเมืองแพร่, 18.14318, 100.1385, OSM node 3961429157). Pure data so
// actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it. The town is at true scale: the shell-shaped old town (traced on
// Esri imagery along the OSM wall segments, the east moat pond and the north stream), the Yom (OSM way 1304426787), the roads,
// the airport and Ban Thung Hong are OSM run through that transform. Drawn closer: Phra That Cho Hae (9.4 km SE, drawn at the
// tile's south-east corner on its low hill) and Den Chai station (20.4 km SSW, drawn at the south-west corner). Directions
// stay within ~10 degrees of the real ones (geo.ts).
export type P = [number, number];
export const M_PER_UNIT = 100;

export const TILE = {x0: -36, x1: 46, z0: -44, z1: 38};

// ---- the Yom (OSM way 1304426787), resampled ~0.5 units; it comes in at the north edge, bends round the north and west of
// the old town, and leaves by the west edge south of town (it ends exactly on the edge: path rivers are drawn unclipped)
export const YOM: P[] = [
  [-2.2, -44], [-0.1, -42.1], [4.0, -41.2], [5.9, -40.0], [6.1, -31.2], [3.6, -28.0], [3.3, -25.4], [7.9, -20.0], [8.5, -16.6],
  [7.0, -15.0], [4.3, -13.4], [1.4, -7.7], [-5.3, -7.8], [-6.9, -5.9], [-8.0, -0.9], [-9.6, 0.0], [-13.0, 0.3], [-13.9, 1.0],
  [-15.1, 7.0], [-13.8, 13.7], [-12.9, 15.3], [-9.6, 17.7], [-6.5, 24.5], [-6.0, 27.3], [-6.9, 29.7], [-8.2, 30.4],
  [-14.0, 30.3], [-14.9, 28.5], [-15.9, 23.2], [-18.2, 20.0], [-20.5, 19.3], [-24.6, 19.4], [-36, 19.6],
];
export const YOM_W = 1.3;

// ---- เวียงแพร่: the shell-shaped old town (imagery trace; ~1.2 x 1.2 km, ~4 km round, the "หอยสังข์" of the sources)
export const OLD_TOWN: P[] = [
  [6.1, -6.0], [5.5, -3.8], [4.7, -0.4], [3.4, 1.3], [2.4, 2.6], [1.4, 4.1], [-1.1, 4.6], [-3.8, 4.4], [-4.9, 2.5], [-5.9, 1.9],
  [-5.5, 0.0], [-4.3, -1.9], [-2.9, -2.6], [-1.7, -3.3], [-0.5, -4.6], [1.6, -5.9], [4.0, -7.1], [5.2, -6.8],
];
export const PILLAR: P = [0, 0]; // ศาลหลักเมือง (origin)
export const WAT_LUANG: P = [-1.6, -2.0]; // วัดหลวง (OSM -1.56, -2.17; drawn 0.17 S, clear of the wall)
export const KHUM: P = [0.25, -1.2]; // คุ้มเจ้าหลวง (OSM 0.25, -1.18)
export const WONGBURI: P = [-2.35, -0.3]; // คุ้มวงศ์บุรี (OSM -2.35, -0.26), on ถนนคำลือ
export const WAT_PHRA_NON: P = [-3.9, -0.8]; // วัดพระนอน
export const WAT_MING_MUEANG: P = [1.95, -0.6]; // วัดพระบาทมิ่งเมือง
/** ประตูชัย: estimated where ถนนเจริญเมือง leaves the south-east wall (no OSM node; the sources put it on ซอยแจ้งเมือง) */
export const GATE_CHAI: P = [3.62, 1.02];
export const GATE_MAI: P = [6.0, -5.6]; // ประตูใหม่ (OSM 6.12, -5.76, set on the wall line)
export const GATE_YANGMA: P = [4.7, -6.95]; // ประตูยั้งม้า (OSM 5.28, -6.67, set on the wall line)
/** the police post the Shan took first (2445): drawn at the town centre by the pillar */
export const POLICE: P = [1.1, 1.9];

// ---- roads (OSM, simplified)
/** ถนนเจริญเมือง: from the pillar out through ประตูชัย to the south-east */
export const CHAROEN: P[] = [[0.2, 0.75], [2.0, 1.0], [GATE_CHAI[0], GATE_CHAI[1]], [6.4, 3.0], [9.7, 5.4]];
/** ถนนคำลือ across the west of the old town (Wongburi stands on it) */
export const KHAMLUE: P[] = [[-4.6, 2.4], [-3.2, 0.95], [-1.6, 0.95], [0.2, 0.75]];
/** out of ประตูใหม่ to the north-east */
export const NE_EXIT: P[] = [[GATE_MAI[0], GATE_MAI[1]], [8.6, -6.9], [11.5, -8.2]];
/** ถนนยันตรกิจโกศล (the old 101) north to south past the east of the old town */
export const MAIN_NS: P[] = [[11.5, -8.2], [11.0, -2.0], [10.0, 5.0], [7.0, 12.0], [4.0, 19.5], [1.5, 28.0], [-1.0, 36.0], [-1.6, 38.0]];
/** north-east to Ban Thung Hong */
export const TO_THUNGHONG: P[] = [[11.5, -8.2], [20.0, -10.5], [27.0, -19.0], [35.0, -28.6], [40.0, -34.8], [44.4, -40.2], [46, -42.0]];
/** ถนนช่อแฮ south-east through แยกช่อแฮ to the foot of the hill */
export const CHOHAE_RD: P[] = [[9.7, 5.4], [18.5, 11.0], [24.5, 17.0], [29.0, 22.4], [32.0, 25.2], [34.4, 26.8]];
/** west over the Yom (ทล.1023, ถนนเหมืองหิต) */
export const WEST_RD: P[] = [[-36, 0.2], [-28.0, 5.0], [-20.5, 10.8], [-16.5, 10.6], [-11.0, 9.4], [-6.6, 8.6]];
/** south from the old town's south-west (พร.4030) */
export const SOUTH_RD: P[] = [[-4.4, 5.4], [-6.6, 8.6], [-6.0, 13.5], [4.0, 19.5]];
/** the bypass (ทล.101 / 129) round the east and south */
export const BYPASS: P[] = [
  [44.4, -40.2], [41.5, -26.0], [34.0, -2.0], [32.0, 8.0], [32.3, 16.0], [29.0, 22.4], [24.0, 25.0], [16.0, 28.0], [7.0, 32.0],
  [1.5, 35.0], [-0.4, 38.0],
];
/** where WEST_RD crosses the Yom */
export const YOM_BRIDGE: P = [-14.6, 10.3];

// ---- the airport (OSM runway way 86013656): kept open ground; the runway appears with the grow beat
export const RUNWAY: [P, P] = [[26.9, 20.4], [28.5, 4.0]];

// ---- the cover: the giant teak gable on open ground east of the old town (it becomes town later)
export const GABLE_AT: P = [26, -4];
export const GABLE_S = 44;

// ---- teak: the elephants' landing on the Yom's west bank, west of the old town, and the rafts' run down the river
export const LANDING: P = [-17.2, 6.0];
export const LOG_TRACK: P[] = [[-33, 1.5], [-28, 3.0], [-23, 4.6], [-19.4, 5.6], [-17.2, 6.0]];

// ---- Ban Thung Hong (ทุ่งโฮ้ง, OSM 35.1, -28.9): the mo hom village, its drying lines east of the road
export const THUNGHONG: P = [38.4, -25.4];

// ---- far places, drawn closer
/** พระธาตุช่อแฮ (real 9.4 km, bearing 132): drawn on its hill near the south-east corner (bearing 126; its bearing to Den
 *  Chai, 235 real, is 263 drawn: the two far places are squeezed into the tile's south strip) */
export const CHOHAE: P = [38.4, 27.6];
/** [x, z, height, radius] */
export const CHOHAE_HILL: [number, number, number, number] = [38.6, 27.8, 2.4, 4.2];
/** the naga stair up the hill's west side, from the road's end to the chedi's terrace */
export const STAIR: P[] = [[34.4, 26.8], [37.0, 27.6]];
/** สถานีรถไฟเด่นชัย (real 20.4 km, bearing 208): drawn at the south-west (bearing 210); the line comes in from the west edge and ends there (the railhead of 2455) */
export const DENCHAI: P = [-20.0, 35.0];
export const RAIL_Z = 36.3;
export const RAIL_SPAN: [number, number] = [-36, -17.5];
