// Lives here until src/cities/phuket/index.ts exists (check_story treats every folder in
// src/cities as a city); it moves to src/cities/phuket/places.ts with the build.
// Real positions (docs/briefs/phuket.md §4, phuket_field.md §1: OSM-confirmed pins) via
// scripts/geo.mjs. World origin = the ONEP core centroid, 7.878381, 98.392508; 80 m/unit,
// +x east, -z north. Pure data so actors.ts, timeline.ts and geo.ts share it.
//
// The tile is the ONEP core at true scale (30 x 47 units, phuket_onep/README.md). Everything
// beyond ~4 km is `far`: pulled in along its real bearing from the centroid, as Chiang Rai's
// Wat Rong Khun. The whole north of the island (Thalang, the battle, Mai Khao, Sarasin) lies in a
// narrow cone at 334-344 degrees, so it ends up packed along the tile's north-north-west edge.
type P = [number, number];

// ---- the old town (true scale)
// แยกธนาคารชาร์เตอร์ด, ถนนพังงา x ถนนภูเก็ต (OSM node 5060965586)
export const CHARTERED: P = [-2.4, -7.3];
// บ้านชินประชา, 98 ถนนกระบี่ (2446)
export const CHINPRACHA: P = [-11.9, -10.3];
// ศาลเจ้าจุ้ยตุ่ย, ซอยภูธร ถนนระนอง
export const JUI_TUI: P = [-12.4, -6.7];
// วงเวียนสะพานหิน: land reclaimed from the dredge tailings; the 2452 dredge worked the bay off it
export const SAPHAN_HIN: P = [5.0, 13.9];
export const DREDGE: P = [25, 15];

// คลองบางใหญ่: ~11 m wide (0.14 units), runs through the core from Kathu's side to the bay.
// Mapped run 7.905514,98.378434 -> enters the core 7.890920,98.391739 -> leaves 7.872326,98.390302
export const BANG_YAI: P[] = [
  [-19.4, -37.5],
  [-12, -28],
  [-5, -21],
  [-1.1, -17.3],
  [-1.6, -6],
  [-2.2, 2],
  [-3.0, 8.4],
  [-1, 14],
];
export const BANG_YAI_W = 0.4; // drawn ~3x so it reads as a line with banks

// The ONEP core (record 0, `พื้นที่เมืองเก่า`), Douglas-Peucker to 0.5 units from 218 points
export const CORE: P[] = [
  [14.7, -18.5], [15.1, -16.4], [11.6, -16.2], [1.2, -12.5], [0.4, -7.0], [3.8, -6.7], [4.4, 1.0],
  [1.6, 2.0], [2.4, 11.8], [6.8, 14.9], [7.7, 16.8], [13.0, 21.4], [10.3, 23.5], [0.5, 16.5],
  [-3.0, 9.1], [-3.1, 6.4], [-4.5, 3.7], [-10.5, -1.8], [-15.1, -1.7], [-13.5, -4.9],
  [-14.1, -13.8], [-0.8, -17.6], [4.8, -16.4], [9.2, -17.1], [11.2, -18.3], [14.0, -23.5],
];

// ---- far places, pulled in along their bearings (real distance in the comment)
// หาดไม้ขาว, the nesting beach's south end by the runway: 27 km at 339
export const MAI_KHAO: P = [-15.7, -41.1];
// the airport runway beside it: 27 km at 342
export const AIRPORT: P = [-13.1, -40.9];
// อนุสาวรีย์ท้าวเทพกระษัตรี ท้าวศรีสุนทร (2510): 11.7 km at 344
export const HEROINES: P = [-8.0, -28.9];
// อนุสาวรีย์ทุ่งถลางชนะศึก, the mapped monument to the 2328 battle (not โคกพม่า): 18 km at 334
export const BATTLE: P = [-16.0, -33.4];
// วัดพระนางสร้าง, by the Thai camp at บ้านเคียน: 17.8 km at 338
export const PHRA_NANG_SANG: P = [-13.1, -32.5];
// สะพานสารสิน over ช่องปากพระ, the island's north tip: 37 km at 344
export const SARASIN: P = [-14.0, -46.5];
// ศาลเจ้ากะทู้ (2368), the tin valley: 6.7 km at 309
export const KATHU: P = [-23.4, -18.8];
// พระใหญ่ on เขานาคเกิด (2545): 10.4 km at 237
export const BIG_BUDDHA: P = [-33.6, 21.7];

// ---- water
// The Andaman: a wide band whose east edge is the west coast. The coast runs from Mai Khao in the
// north-north-west down to the hills under the Big Buddha.
export const ANDAMAN: P[] = [
  [-34, -56],
  [-35, -38],
  [-41, -27],
  [-50, -13],
  [-54, 0],
  [-56, 20],
  [-57, 56],
];
export const ANDAMAN_W = 28;
// ช่องปากพระ along the north edge, the strait Sarasin crosses (660 m long: ~8 units)
export const PAK_PHRA_Z = -50.5;
export const PAK_PHRA_W = 8;
// อ่าวภูเก็ต / อ่าวทุ่งคา: east and south-east of the town
export const BAY: P[] = [
  [36, -56],
  [35, -20],
  [33, 0],
  [33, 16],
  [27, 30],
  [22, 56],
];
export const BAY_W = 28;
