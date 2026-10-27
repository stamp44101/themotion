// Real positions (docs/briefs/suphanburi_onep/README.md, PR #73): metres from the city pillar
// (ศาลเจ้าพ่อหลักเมือง, OSM node 14109371999, 14.4784865, 100.1110566) at **50 m/unit**, so the
// moated town (1.4 x 3.7 km) stands on the tile with the Tha Chin down its east side.
// +x east, +z south. Pure data so actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it.
type P = [number, number];
export const M_PER_UNIT = 50;
const u = (x: number, z: number): P => [+(x / M_PER_UNIT).toFixed(2), +(z / M_PER_UNIT).toFixed(2)];

// ---- the moated town: ONEP zone 1 (เมืองเก่าสุพรรณบุรี, OT_CODE 15), simplified to 35 m. Its west,
// north and south sides follow the moats; its east side follows the Tha Chin
export const TOWN: P[] = [
  u(322, -1742), u(696, -1657), u(666, -1385), u(710, -1283), u(617, -1188), u(630, -878), u(528, -749), u(515, -482),
  u(628, -302), u(827, -132), u(900, 47), u(864, 131), u(653, 263), u(767, 327), u(576, 729), u(594, 1236), u(436, 1245),
  u(437, 1352), u(268, 1365), u(206, 1895), u(-148, 1884), u(-235, 1942), u(-301, 1872), u(-701, 1808), u(-634, 1297),
  u(-684, 1222), u(-614, 1143), u(-456, -21), u(-509, -130), u(-429, -206), u(-316, -1056), u(-358, -1167), u(-291, -1210),
  u(-208, -1733), u(177, -1716), u(246, -1780),
];
// the moat and rampart run along the land sides: from the north-east corner (by Wat Khae) west,
// down the west side and along the south to where the south moat meets the river
export const MOAT: P[] = [
  u(696, -1657), u(322, -1742), u(246, -1780), u(177, -1716), u(-208, -1733), u(-291, -1210), u(-358, -1167), u(-316, -1056),
  u(-429, -206), u(-509, -130), u(-456, -21), u(-614, 1143), u(-684, 1222), u(-634, 1297), u(-701, 1808), u(-301, 1872),
  u(-235, 1942), u(-148, 1884), u(206, 1895), u(268, 1365),
];
// the restored wall and gate on the west side (Google pins), the fort at the middle of the north moat
export const WEST_GATE = u(-437, 332);
export const NORTH_FORT = u(264, -1702);

// ---- the Tha Chin (OSM, README item 3), north to south. 38-70 m of water; drawn 1.1 (55 m)
export const RIVER_W = 1.1;
export const RIVER: P[] = (
  [
    [704, -3874], [528, -3702], [473, -3450], [576, -3348], [975, -3115], [1102, -2983], [1144, -2819], [1143, -2547],
    [1198, -2382], [1290, -2318], [1653, -2271], [1884, -2182], [1978, -2104], [2043, -1968], [1929, -1672], [1859, -1581],
    [1635, -1416], [1446, -1243], [1285, -1130], [832, -963], [698, -931], [653, -902], [580, -811], [528, -675], [515, -509],
    [534, -412], [611, -305], [795, -173], [866, -54], [887, 90], [775, 203], [604, 273], [440, 406], [383, 502], [365, 687],
    [411, 895], [439, 1134], [429, 1223], [452, 1419], [497, 1526], [537, 1557], [657, 1602], [820, 1637], [896, 1678],
    [930, 1721], [985, 1866], [1015, 2081], [1073, 2241], [1080, 2329], [1039, 2435], [992, 2476], [955, 2558], [939, 2638],
  ] as P[]
).map(([x, z]) => u(x, z));

// ---- pins (README item 2)
export const PILLAR = u(0, 0); // ศาลเจ้าพ่อหลักเมือง
export const DRAGON = u(44, -23); // พิพิธภัณฑ์ลูกหลานพันธุ์มังกร, wrapped round the shrine
export const MAHATHAT = u(257, -225); // วัดพระศรีรัตนมหาธาตุ, the prang
export const PALELAI = u(-1755, 501); // วัดป่าเลไลยก์ (หลวงพ่อโต), outside the moat
export const WAT_KHAE = u(652, -971); // วัดแค, on the bank
export const TOWER = u(754, 883); // หอคอยบรรหาร-แจ่มใส, east bank
export const PHRA_RUP = u(133, 939); // วัดพระรูป
// the bridges [west end, east end] (OSM)
export const BRIDGE_MALAIMAN: [P, P] = [u(640, -260), u(820, -190)];

// ---- Don Chedi (19.7 km NNW, far: true): the field of the duel, drawn in the tile's north-west
// corner, 325 degrees from the pillar (true bearing 330; distance compressed ~13x)
export const FIELD: P = [-28, -40];
