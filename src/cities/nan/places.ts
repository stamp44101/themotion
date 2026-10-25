// Real positions (docs/briefs/nan_onep/README.md, PR #70): metres from the ONEP temple-core
// centroid (record 23, 18.775818, 100.771412) converted to world units at **70 m/unit**, so
// Wat Phra That Chae Haeng (2.9 km SE) and Khao Noi (2.3 km WSW) both stand on the ±48 tile.
// +x east, +z south. Pure data so actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it.
type P = [number, number];
const u = (x: number, z: number): P => [+(x / 70).toFixed(2), +(z / 70).toFixed(2)];
export const M_PER_UNIT = 70;

// ---- the walled town (เวียงน่าน / เวียงใต้). ONEP has no polygon for it and OSM keeps only the
// north wall (README "City wall"): ~390 m from (-312,-565) to (30,-439). The rest is drawn to
// the research (3.6 km round, 7 gates + ประตูอมร 2450, a corner fort at each corner) and to
// the river: the town's south-east corner stands just inside today's river bend at (421, 431),
// and the old channel ran along the east wall. APPROXIMATE outside the north wall.
export const TOWN: P[] = [
  u(-330, -575), u(30, -440), u(420, -390), u(430, 300), u(250, 380), u(-300, 400), u(-640, 330), u(-660, -260),
];

// ---- the Nan, today (OSM way 310184178, README §3), north to south. 70 m wide at the main
// bridge = 1.0 unit; drawn 1.1 (36-117 m along the reach)
export const RIVER_W = 1.1;
export const RIVER: P[] = [
  u(2588, -3360), u(2589, -3142), u(2504, -2926), u(2367, -2713), u(2178, -2527), u(2126, -2431), u(2070, -2266), u(2066, -1925),
  u(2085, -1424), u(2066, -1378), u(1864, -1080), u(1497, -706), u(1248, -376), u(1155, -132), u(969, 32), u(660, 199),
  u(421, 431), u(360, 558), u(272, 817), u(186, 922), u(55, 982), u(-482, 1122), u(-552, 1210), u(-569, 1274), u(-550, 1520),
  u(-528, 1616), u(-497, 1709), u(-413, 1770), u(-370, 1870), u(-379, 2035), u(-92, 2677), u(-89, 2798), u(-120, 2915),
  u(-205, 2970), u(-401, 2997), u(-460, 3035), u(-538, 3159), u(-615, 3433),
];
// the river's points where the two channels part and meet again
const SPLIT = 10; // u(1864, -1080)
const JOIN = 17; // u(360, 558)
// ---- the old channel (ท้องหลง) the river kept until it swung east in 2398: hard along the east
// wall (research: "ห่างเพียง 4 วา"). Drawn from the research; no survey survives.
export const OLD_RIVER: P[] = [
  ...RIVER.slice(0, SPLIT + 1),
  u(1470, -840), u(900, -590), u(600, -450), u(505, -250), u(500, 70), u(505, 330), u(470, 470),
  ...RIVER.slice(JOIN),
];
// the stretch that is new after the swing (for the occupancy band from 2398) and the stretch
// that dries out (to 2398)
export const NEW_REACH: P[] = RIVER.slice(SPLIT, JOIN + 1);
export const OLD_REACH: P[] = OLD_RIVER.slice(SPLIT, SPLIT + 9);

// ---- pins (OSM, README §2)
export const PHUMIN = u(23, 134); // วัดภูมินทร์
export const HOKHAM = u(-74, -42); // หอคำ (พิพิธภัณฑสถานแห่งชาติน่าน)
export const CHANG_KHAM = u(65, -66); // องค์พระธาตุช้างค้ำ
export const MING_MUEANG = u(-242, 97); // วัดมิ่งเมือง, the city pillar
export const KHUANG = u(19, 66); // ข่วงเมือง
export const OLD_HALL = u(274, -42); // ศาลากลางหลังเดิม
export const WAT_NOI = u(-4, -21); // วัดน้อย
export const SRI_PHAN_TON = u(-596, -39); // วัดศรีพันต้น
export const CHAE_HAENG = u(2139, 1942); // องค์พระธาตุแช่แห้ง, on its rise east of the river
export const KHAO_NOI = u(-2226, 682); // the top of Doi Khao Noi (299 m, ~95 m above the town)
export const KHAO_NOI_WAT = u(-2185, 693);
export const BOAT_MONUMENT = u(900, -2); // อนุสาวรีย์เรือแข่ง, west bank by the main bridge
// bridges: [west end, east end]
export const BRIDGE_MAIN: [P, P] = [u(783, -3), u(963, 217)]; // สะพานพัฒนาภาคเหนือ
export const BRIDGE_SOUTH: [P, P] = [u(127, 887), u(123, 1040)]; // สะพานศรีบุญเรือง
export const BRIDGE_NORTH: [P, P] = [u(2002, -2150), u(2155, -2099)]; // สะพานนครน่านพัฒนา

// ---- gates (research §4.2; OSM keeps two names at junctions). Positions on TOWN's edges.
export const GATES: {name: string; at: P; year: number}[] = [
  {name: 'ประตูไชย', at: u(424, -80), year: 1855},
  {name: 'ประตูน้ำเข้ม', at: u(422, -260), year: 1855},
  {name: 'ประตูริม', at: u(-150, -508), year: 1855},
  {name: 'ประตูอมร', at: u(230, -415), year: 1907},
  {name: 'ประตูปล่องน้ำ', at: u(-500, -413), year: 1855},
  {name: 'ประตูหนองห้า', at: u(-652, 40), year: 1855},
  {name: 'ประตูเชียงใหม่', at: u(-120, 394), year: 1855},
  {name: 'ประตูท่าลี่', at: u(330, 344), year: 1855},
];

// ---- off the old town
// เวียงเหนือ / เวียงดงพระเนตรช้าง (2360-2398): 2-3 km north; outer 1,328 x 1,531 m, inner 394 x 678 m
// (research §4.2). Its exact place is not surveyed; drawn north of the old town, west of the
// river, the airfield on its west edge (research: the airport overlaps Wiang Nuea's west side).
export const WIANG_NUEA = u(1150, -2450);
export const WN_OUTER: [number, number] = [1328 / 70, 1531 / 70];
export const WN_INNER: [number, number] = [394 / 70, 678 / 70];
// the 2469 airfield (today ท่าอากาศยานน่านนคร, 3.8 km NNE, compressed onto the tile with its
// bearing kept): a strip running north-south
export const AIRFIELD = u(280, -2640);
export const AIRFIELD_LEN = 12;
// Pua, where the settlers came from (60 km north): off the north edge of the tile
export const FROM_PUA: P = RIVER[0];
