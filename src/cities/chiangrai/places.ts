// Real positions (docs/briefs/chiangrai.md §4, chiangrai_field.md §2: OSM-confirmed pins) via
// scripts/geo.mjs. World origin = the ONEP core centroid, 19.910348, 99.830185; 80 m/unit,
// +x east, -z north. Pure data so actors.ts, timeline.ts and geo.ts share it.
type P = [number, number];

// ดอยจอมทอง, Mangrai's เวียง: the summit pin. ~40 m over the town, drawn ~4x (index.ts)
export const CHOM_THONG: P = [-9.7, -7.4];
export const CHOM_THONG_H = 2.4;
// ดอยงำเมือง (กู่พญามังราย): pin -6.7,-3.2 sits on the moat ring of the cut-off NW corner;
// drawn 80 m north, on the low ground between the two hills
export const NGAM_MUEANG: P = [-6.9, -4.2];
// วัดพระแก้ว (วัดป่าเยี้ยะ before 1434), at the south-east foot of Doi Chom Thong
export const PHRA_KAEW: P = [-4.1, -1.8];
// วัดกลางเวียง, the centre of the 2386 town
export const KLANG_WIANG: P = [2.8, -0.5];
// หอนาฬิกาทอง (2551) on ถนนบรรพปราการ = the old south wall line; the old clock tower 350 m north
export const GOLD_CLOCK: P = [1.1, 4.4];
export const OLD_CLOCK: P = [0.5, 0.1];
// อนุสาวรีย์พญามังราย (31 มี.ค. 2507), ห้าแยกพ่อขุน on the old east wall line
export const MONUMENT: P = [13.0, -0.1];
// เกาะลอย: the park on the island (pin 9.8,-11.1), between the Kok and its south channel
export const KOH_LOI: P = [9.6, -10.6];
// สนามบินเก่าเชียงราย (2466), 2.6 km due south of the old town; the runway runs N-S
export const AIRFIELD: P = [-3.4, 28.6];
// วัดร่องขุ่น: 12.16 km at 216 degrees, pulled in to the tile's south-west corner by direction
export const RONG_KHUN: P = [-27.5, 37.5];

// The 2386 wall (ONEP core ring, chiangrai_onep/README.md): a trapezoid, ถนนสิงหไคล on the
// north-east, พหลโยธินสายใน east, บรรพปราการ south, the surviving moat on the south-west
// corner. ONEP's ring also has an arm up Doi Chom Thong; the wall does not climb the hill (the
// engine levels the ground inside the moat ring), so the arm is cut off along the hill's foot.
export const WALL: P[] = [
  [-9.2, -2.0],
  [-2.2, -3.9],
  [-0.25, -2.2],
  [1.5, -3.0],
  [2.8, -3.5],
  [4.75, -3.1],
  [7.5, -1.85],
  [10.0, -1.05],
  [11.5, -0.5],
  [13.3, -0.5],
  [13.3, 2.9],
  [12.6, 5.05],
  [12.25, 5.45],
  [5.4, 4.9],
  [0.85, 4.5],
  [-2.1, 4.95],
  [-7.4, 4.9],
  [-8.6, 2.0],
  [-9.05, 0.65],
];
// ประตูเชียงใหม่ (the SW corner, where the moat and its bridge survive) and the gate on the
// south line where the gold clock tower now stands (ประตูหวาย); the north gate to the Kok
export const GATE_CM: P = [-7.4, 4.9];
export const GATE_WAI: P = [GOLD_CLOCK[0], 4.55];
export const GATE_N: P = [1.5, -3.0];

// แม่น้ำกก: OSM centreline way 40191691 through the ONEP zone (chiangrai_field.md §1), ~110 m
// wide (1.4 units). Upstream it comes in from the west (Tha Ton), downstream it runs north-east
// to the Mekong. It grazes the zone's north edge and never crosses the walls.
export const KOK: P[] = [
  [-48, -6],
  [-32, -7.5],
  [-22, -8.6],
  [-17.9, -10.1],
  [-14.9, -17.7],
  [-13.0, -18.5],
  [-11.0, -18.8],
  [-9.2, -18.6],
  [-7.6, -17.9],
  [-6.0, -15.9],
  [-4.4, -13.6],
  [-3.0, -11.2],
  [-0.6, -10.3],
  [2.9, -10.7],
  [6.9, -11.7],
  [10.7, -12.6],
  [15.9, -12.5],
  [20.0, -13.9],
  [30, -19],
  [48, -27],
];
export const KOK_W = 1.4;
// the Kok's south channel that leaves เกาะลอย an island
export const KOK_S: P[] = [
  [3.2, -10.9],
  [5.6, -9.2],
  [8.4, -8.8],
  [11.4, -9.4],
  [13.8, -11.4],
  [15.6, -12.3],
];
export const KOK_S_W = 0.6;

// the north road over the Kok (สะพานพญามังราย is at the mid-river pin 2.9,-10.7)
export const NORTH_ROAD: [P, P] = [[2.2, -3.2], [4.6, -34]];
// พหลโยธิน to Chiang Mai: south-west out of ประตูเชียงใหม่, past วัดร่องขุ่น
export const SW_ROAD: [P, P] = [[-7.9, 5.6], [-24.6, 34.2]];
// ถนนธนาลัย (2438): the first straight street, east-west through the middle of the walled town
export const THANALAI_Z = 1.5;
