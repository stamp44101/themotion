// Real positions ([local]'s map, docs/briefs/uttaradit_onep/README.md; Gemini's answer in
// docs/briefs/uttaradit_research_gemini.md): world units at 100 m/unit, +x east, +z south, origin the Phraya Phichai Dap
// Hak monument before the provincial hall (17.62966, 100.09742). Pure data so actors.ts, timeline.ts, geo.ts and
// Landmarks.tsx share it.
//
// Two true-scale patches on one tile of the Nan valley (brief, "The tile"):
// - the town (Bang Pho Tha It, today's Uttaradit) round the origin, the Nan looping round its east side (OSM, true);
// - old Phichai, 36 km south, drawn true size but moved north to the tile's south edge: world = true + PHICHAI_SHIFT.
//   Its bearing from the monument is drawn ~12 degrees west of south (true ~3 degrees): within the 30-degree rule.
// Between them the river is joined by hand (the Ban Dara reach, where the railway crosses it on the Paramin bridge).
// The Nam Phi pits (24 km ESE) and Sirikit dam (51 km ENE) are pulled in along their bearings. Approximate: the brief's
// "## v1 build".
export type P = [number, number];
export const M_PER_UNIT = 100;

export const TILE = {x0: -38, x1: 46, z0: -34, z1: 50};

// ---- the town (true scale)
export const MONUMENT: P = [0, 0]; // อนุสาวรีย์พระยาพิชัยดาบหัก หน้าศาลากลาง (origin)
export const HALL: P = [0.2, -2.2]; // the provincial hall behind the monument (drawn N of it)
export const RESIDENCE: P = [1.7, 3.1]; // จวนผู้ว่าราชการหลังเก่า (gem's pin), on the river
export const LANDING: P = [1.3, 11.2]; // ท่าเรือบางโพท่าอิฐ หน้าวัดท่าถนน (west bank)
export const MARKET: P = [1.0, 9.8]; // ตลาดสดเทศบาล
export const THA_SAO: P = [22.0, -17.8];

// ---- the railway: one straight N-S line (the engine's rail) down the west of the town; it crosses the Nan once, at
// Ban Dara, between the two towns. Uttaradit station is OSM (-0.2, 10.3): drawn beside the track on its west side.
export const RAIL_X = -1.6;
export const STATION: P = [-3.9, 10.3];
export const SILA_AT: P = [1.6, -10.6]; // OSM (3.8, -10.6): the line is drawn straight, so the station sits 2.2 W, east of the track

// ---- old Phichai (true size, shifted): the traced wall (Treasury survey, ±100 m), the river SW of it
export const PHICHAI_SHIFT: P = [9.5, -322];
const ph = ([x, z]: P): P => [Math.round((x + PHICHAI_SHIFT[0]) * 10) / 10, Math.round((z + PHICHAI_SHIFT[1]) * 10) / 10];
export const PHICHAI_WALL: P[] = (
  [
    [-24.6, 355.5], [-21.3, 354.8], [-18.6, 354.0], [-17.8, 354.6], [-16.5, 357.3], [-15.0, 360.4], [-13.9, 362.6],
    [-14.4, 363.8], [-16.7, 365.1], [-19.0, 361.9], [-21.7, 358.8], [-23.7, 356.3],
  ] as P[]
).map(ph);
export const PHICHAI: P = ph([-18.6, 358.7]); // the wall's centre (traced)
/** the gate on the long east side (the Treasury text: a fort outside the middle of the east wall) */
export const PHICHAI_GATE: P = ph([-15.6, 359.0]);
export const HUAI_KHA: P = ph([-27.5, 354.0]); // บ้านห้วยคา, the hero's birthplace (gem's pin)
export const WAT_EKKA: P = ph([-33.9, 369.4]); // ทุ่งวัดเอกา, the 2316 field (local history, west bank)
/** where the giant stands for the fight: on the west bank between Wat Ekka and the river, facing the wall */
export const FIGHT_AT: P = [-20.4, 47.0];

// ---- the Nan (OSM ways 76586910, 40137447-9), north-east to south
// upstream from the dam's gorge (pulled in) to the town
const UP: P[] = [[46.4, -32.6], [43.6, -29.4], [41.0, -26.2]];
// through the town, true (OSM, every ~2.5 units; the reach below the landing drawn 60 m E, clear of the railway)
const TOWN: P[] = [
  [38.4, -23.1], [35.4, -22.1], [33.5, -19.3], [30.5, -17.4], [27.1, -16.4], [22.7, -16.0], [18.9, -13.7], [17.3, -11.7],
  [16.4, -7.2], [16.7, -2.4], [19.0, 1.8], [22.6, 5.3], [23.3, 8.3], [22.5, 10.8], [20.1, 12.2], [17.2, 11.9], [14.3, 10.4],
  [12.2, 8.8], [10.7, 6.4], [8.5, 4.0], [5.9, 3.6], [4.3, 8.8], [3.2, 12.0], [2.2, 14.7], [2.1, 18.4],
];
// the Ban Dara reach (drawn): the river turns west across the railway, then runs down the west of Phichai
const DARA: P[] = [[1.4, 20.4], [-2.4, 21.4], [-8.0, 21.8], [-14.0, 21.6], [-20.0, 22.0], [-25.0, 23.4], [-28.4, 26.2]];
// past Phichai (OSM, true, shifted with the wall), out of the tile's south edge
const PAST: P[] = (
  [
    [-39.0, 351.3], [-37.6, 356.1], [-36.2, 359.1], [-33.7, 361.3], [-31.1, 363.2], [-24.7, 366.4], [-17.6, 367.8],
    [-15.8, 370.0], [-15.3, 371.4], [-15.4, 374.0],
  ] as P[]
).map(ph);
export const NAN: P[] = [...UP, ...TOWN, ...DARA, ...PAST];
export const NAN_W = 2.0; // 150-220 m
/** where the rail crosses the Nan (the Paramin bridge, Ban Dara, 262 m) */
export const PARAMIN: P = [RAIL_X, 21.2];

// ---- far places, pulled in along their bearings
/** the Nam Phi iron pits (บ่อพระแสง, บ่อพระขรรค์), 23.6 km ESE: at the foot of the hills east of the Nan */
export const NAM_PHI: P = [33.0, 10.5];
/** Sirikit dam, 51.5 km ENE, across the Nan's gorge in the tile's NE corner; the lake fills behind it */
export const DAM: P = [42.2, -27.4];
export const DAM_LEN = 7.0; // the 800 m crest, drawn short across the gorge
/** the lake: a blob of discs NE of the dam, clipped by the tile */
export const LAKE: [number, number, number][] = [[44.2, -30.4, 2.4], [45.4, -32.6, 2.6], [43.0, -32.8, 2.2], [45.6, -29.0, 1.6]];

// ---- the cover: the giant anvil on the east bank, below the Nam Phi hills
export const HERO_AT: P = [28.0, -5.0];
export const HERO_S = 40; // the sword's length (the style frame A1's); the anvil's face is 0.42 S high

// ---- roads (OSM names, approximate years: the grow beat)
export const BOROM_AT: P[] = [[-20, 0.4], [-8, 0.2], [-1.0, 0.0]]; // ถ.บรมอาสน์ west from the hall
export const RIVER_ROAD: P[] = [[3.6, -8.0], [2.6, 2.2], [1.2, 9.0], [0.9, 12.4]]; // along the west bank (ถ.เกษมราษฎร์)
export const NORTH_ROAD: P[] = [[-6, -0.2], [-6.4, -14], [-7.0, -30.0]]; // north to Laplae and Sila At
