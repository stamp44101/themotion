// Real positions (docs/briefs/phetchabun_onep/README.md, PR #72): metres from the city pillar
// (ศาลหลักเมือง, OSM node 2322827369, 16.4209739, 101.1600819) at **40 m/unit**, so the
// อุ้มพระดำน้ำ site (0.96 km NNE) and Wat Mahathat (0.5 km W) stand well inside the tile.
// +x east, +z south. Pure data so actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it.
type P = [number, number];
export const M_PER_UNIT = 40;
const u = (x: number, z: number): P => [+(x / M_PER_UNIT).toFixed(2), +(z / M_PER_UNIT).toFixed(2)];

// ---- the Pa Sak (OSM ways 126616194 + 126616156, README item 3), north to south. 15-26 m of
// water; drawn 1.0 (40 m) so it reads from the wide shots
export const RIVER_W = 1.0;
export const RIVER: P[] = (
  [
    [1485, -3917], [1343, -3669], [1188, -3277], [1141, -3169], [1083, -3012], [1074, -2865], [1126, -2679], [1109, -2517],
    [1038, -2457], [1013, -2339], [942, -2066], [926, -1871], [857, -1654], [749, -1622], [689, -1587], [601, -1581],
    [512, -1514], [510, -1443], [548, -1410], [546, -1294], [450, -1294], [416, -1274], [324, -1162], [311, -1124],
    [330, -924], [310, -871], [249, -874], [197, -914], [160, -907], [147, -889], [179, -473], [161, -433], [60, -427],
    [26, -388], [38, -297], [66, -276], [275, -220], [418, -140], [499, -194], [562, -190], [732, -91], [746, 122],
    [683, 236], [682, 292], [711, 293], [848, 226], [928, 255], [970, 294], [960, 395], [1031, 526], [1062, 653],
    [1055, 833], [961, 972], [926, 1137], [987, 1231], [1045, 1403], [1157, 1442], [1237, 1426], [1313, 1508],
    [1278, 1588], [1246, 1706], [1193, 1745], [1153, 1903], [1088, 1990], [962, 2003], [951, 2104], [994, 2141],
  ] as P[]
).map(([x, z]) => u(x, z));

// ---- the town (research §4.1; Dr. Wisan Kositanon, "ป้อมปราการและกำแพงเก่า เมืองเพชรบูรณ์",
// citing the Treasury Department's survey). Two towns side by side:
//  - the Sukhothai-era town: an earthwork and moat ~800 m a side with Wat Mahathat at its
//    centre (its lotus-bud chedi), a later extension 800 x 300 m to its south;
//  - the Ayutthaya town: a brick wall 500 m square EAST of it, a corner fort (ป้อมหัวธนู) at
//    each corner, a gate in the middle of each side. The first fort is the city pillar's
//    shrine (so the pillar is a corner: the south-west one); ประตูชุมพล (W) and ประตูดาว (E,
//    beside วัดประตูดาว at 501, -288) face each other; the north gate by วัดโพธิ์เย็น, where
//    the Pa Sak comes in; the river crosses the town past Wat Traiphum and leaves by the
//    ศาลเจ้าแม่ fort (เมืองอกแตก). The Google pin "แนวกำแพงเมืองเก่า" (-106, -485) falls on the
//    north-west corner. The wall's exact line is APPROXIMATE (OSM maps none).
// The west wall is drawn 40 m west of the pillar: the Pa Sak's bend comes within 26 m of the
// pillar's meridian (at 26, -388), and the wall must not stand in the river
export const WALL: P[] = [u(-40, -500), u(500, -500), u(500, 0), u(-40, 0)];
export const WALL_C: P = u(230, -250);
// gates: mid-side
export const GATES: {name: string; at: P; side: 'n' | 'e' | 's' | 'w'}[] = [
  {name: 'ประตูชุมพล', at: u(-40, -270), side: 'w'},
  {name: 'ประตูดาว', at: u(500, -270), side: 'e'},
  {name: 'ประตูเหนือ', at: u(250, -500), side: 'n'},
  {name: 'ประตูใต้', at: u(250, 0), side: 's'},
];
// where the river cuts the wall: water gates (the north one by วัดโพธิ์เย็น, the east one by
// the ศาลเจ้าแม่ fort)
export const WATER_GATES: {at: P; side: 'n' | 'e'}[] = [
  {at: u(177, -500), side: 'n'},
  {at: u(500, -193), side: 'e'},
];
// the Sukhothai earthwork round Wat Mahathat (approximate: ~800 m, centred on the temple)
export const OLD_TOWN: P[] = [u(-914, -374), u(-114, -374), u(-114, 426), u(-914, 426)];

// ---- pins (README item 2)
export const PILLAR = u(0, 0); // ศาลหลักเมือง, on the south-west corner fort
export const MAHATHAT = u(-514, 26); // วัดมหาธาตุ
export const TRAIPHUM = u(153, -188); // วัดไตรภูมิ (พระพุทธมหาธรรมราชา)
export const POOL = u(325, -899); // the อุ้มพระดำน้ำ site (วังมะขามแฟบ), on the bend below the north bridge
export const WALL_HALL = u(204, -279); // หอนิทรรศน์กำแพงเมือง
export const PRATU_DAO = u(501, -288); // วัดประตูดาว
export const TAMARIND = u(-41, 51); // the "เมืองมะขามหวาน" monument
export const OLD_HALL = u(-36, 205); // ศาลากลางหลังเก่า (Gemini pin 16.419124, 101.159743)
export const NAKHONBAN = u(-661, 434); // อนุสาวรีย์นครบาลเพชรบูรณ์ (Gemini pin 16.417047, 101.153887)
// bridges [west end, east end] (OSM bridge ways, README item 3)
export const BRIDGE_N: [P, P] = [u(285, -1018), u(355, -1020)];
export const BRIDGE_LM: [P, P] = [u(143, -580), u(200, -575)]; // ถนนหลักเมือง
export const BRIDGE_E: [P, P] = [u(548, -222), u(548, -162)];
// the landing below Wat Traiphum where the image is carried up from the river
export const LANDING = u(150, -252);
