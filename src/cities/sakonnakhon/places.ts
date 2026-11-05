// Real positions ([local]'s map, docs/briefs/sakonnakhon_onep/README.md, PR #84, 0d5524c; Gemini's answer in
// docs/briefs/sakonnakhon_research_gemini.md): world units at 100 m/unit, +x east, +z south, origin the stupa of
// วัดพระธาตุเชิงชุม (17.1646, 104.1533). Pure data so actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it.
//
// Nong Han is 18 x 7 km and the town is 1.4 km: the lake is drawn **0.55x about the town's shore point (7, 0)**, so its
// west shore stays where it is at the town while ดอนสวรรค์ and ท่าแร่ come in with it (stated as approximate in the brief).
// The lake's outline is [local]'s constructed one (OSM's multipolygon was not reachable at build time).
export type P = [number, number];
export const M_PER_UNIT = 100;
export const LAKE_K = 0.55;
const SHORE: P = [7, 0];
const squeeze = ([x, z]: P): P => [SHORE[0] + (x - SHORE[0]) * LAKE_K, z * LAKE_K];

export const TILE = {x0: -48, x1: 62, z0: -64, z1: 50};

// [local]'s outline, compressed, clipped to the tile's east edge, then rounded (Chaikin x2)
const RAW: P[] = [
  [7.1, -3.8], [11.4, -44.7], [24.1, -85.6], [49.7, -103.3], [81.6, -94.4], [108.2, -59.0], [119.9, -14.8], [115.6, 27.2],
  [96.5, 62.6], [68.8, 82.5], [41.2, 75.9], [19.9, 47.1], [7.1, 16.1],
];
const chaikin = (pts: P[]): P[] =>
  pts.flatMap((a, i) => {
    const b = pts[(i + 1) % pts.length];
    return [
      [0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]],
      [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]],
    ] as P[];
  });
const clipX = (pts: P[]) => pts.map(([x, z]) => [Math.min(x, TILE.x1 - 0.6), z] as P);
export const LAKE_PATH: P[] = chaikin(chaikin(clipX(RAW.map(squeeze))));
// discs covering the lake, for sites / clearings (checked against LAKE_PATH in check_story's occupancy)
export const LAKE_DISCS: [number, number, number][] = [
  [14, -20, 7], [20, -40, 9], [32, -48, 9], [46, -44, 10], [56, -30, 7], [40, -26, 14], [56, -6, 7],
  [26, -6, 13], [42, 2, 16], [55, 20, 8], [40, 26, 13], [26, 30, 9], [16, 18, 7], [12, 6, 5],
];

// ---- the old town: เมืองหนองหารหลวง, a double-moated near-square ~1.3 x 1.5 km on the west shore ([local] §1,
// constructed from the dimensions; its east side stops 0.5 units short of the shore so the moat is not in the lake)
export const OLD_TOWN: P[] = [[-5.2, -8.8], [6.4, -8.8], [6.4, 6.2], [-5.2, 6.2]];
export const STUPA: P = [0, 0]; // พระธาตุเชิงชุม (origin)
export const SRA_PHANG: P = [3.4, -2.1]; // สระพังทอง, the Khmer baray
export const KHOM_BRIDGE: P = [-11.8, -5.4]; // สะพานขอม, laterite, 11 openings, before the town's west gate
export const CITY_GATE: P = [-11.5, -5.1]; // ประตูเมือง / ลานรวมใจไทสกล (today's gate monument)
export const KHA_THAT: P = [-0.9, 0.4]; // the ข้าพระธาตุ village round the stupa (สกลทวาปี)
export const NONG_SAI_KHAO: P = [-9.4, 9.0]; // หนองทรายขาว (2370; nothing is shown here)
export const PILLAR: P = [-1.6, 6.0]; // ศาลหลักเมือง
export const CLOCK: P = [-6.2, 2.9]; // แยกหอนาฬิกา, where the procession forms
export const MING_MUANG: P = [-4.4, 3.1]; // สนามมิ่งเมือง (the first city hall stood here)
export const HALL: P = [-8.0, -2.8]; // ศาลากลาง (2507, 2541), the ศูนย์ราชการ
export const MARKET: P = [-3.7, 2.0];
// พระธาตุดุม (11.6, 22.9) is 1.6 units inside the drawn shore (the constructed outline is coarse): drawn 1.6 W
export const THAT_DUM: P = [10.0, 22.9];
export const AIRPORT: P = [-36.9, -33.9]; // ท่าอากาศยานสกลนคร (17.1951, 104.1186)
export const RUNWAY_ROT = (-28 * Math.PI) / 180; // drawn WNW-ESE

// ---- the lake's places, compressed with it
export const DON_SAWAN: P = squeeze([40.6, -25.5]); // เกาะดอนสวรรค์, the widow's mound of the legend
// the legend's town, beside the mound that stays (ดอนสวรรค์)
export const LEGEND_AT: P = [DON_SAWAN[0] - 4, DON_SAWAN[1] + 5];
export const THA_RAE: P = (([x, z]) => [x, z - 2.4] as P)(squeeze([39.6, -100.2])); // บ้านท่าแร่, on the north shore
// the raft crossing of 2427: from the town's shore round the lake's west side to Tha Rae
// it ends on the water off the landing: the rafts never sit on the shore
export const RAFT_PATH: P[] = [[8.6, -6], [10.6, -16], [12.6, -30], [16.4, -42], [21.0, -49.4]];

// ---- far places: drawn at the tile's edges (geo.ts, far: true)
export const NARAI: P = [-44, -22]; // พระธาตุนารายณ์เจงเวง, 6.6 km WNW
export const PHU_PHAN: P = [-36, 38]; // the Phu Phan hills, 10-22 km SW
export const SERI_CAVE: P = [-40, 42]; // ถ้ำเสรีไทย, 22.6 km WSW
export const PALACE: P = [-28, 40]; // พระตำหนักภูพานราชนิเวศน์, 10.3 km SW (2518)
// the road the Tai Yo came in by in 2381 (from the Mekong, to the north-east), down the lake's west shore
export const YO_ROAD: P[] = [[4, -62], [4.6, -44], [4.8, -28], [4, -16], [1.6, -9.6]];
// the road the people were led away by in 2370 (south, toward Kabin Buri)
export const SOUTH_ROAD: P[] = [[0.6, 6.8], [-1.6, 14], [-4, 26], [-6, 38], [-7, 49]];
// ถ.นิตโย (highway 22) west past the Khom bridge toward the airport and Udon
export const NITAYO: P[] = [[-5.2, -5.2], [-11.8, -5.4], [-24, -14], [-36, -24], [-47, -30]];
// highway 213 south-west to Phu Phan and Kalasin
export const HW213: P[] = [[-5.2, 4], [-14, 14], [-26, 28], [-34, 40], [-38, 49]];
// the wax-castle route: the clock tower, ถ.สุขเกษม, ถ.เจริญเมือง, the stupa's gate
export const PROCESSION: P[] = [[-6.2, 2.9], [-3.0, 2.9], [-3.0, 1.0], [-1.4, 1.0]];

// the cover's giant: the indigo pot and cloth stand on the plain where the lake will be
export const HERO_AT: P = [30, -8];
export const HERO_S = 16;
