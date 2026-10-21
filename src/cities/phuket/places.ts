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
export const DREDGE: P = [24, 12];

// คลองบางใหญ่: ~11 m wide (0.14 units). At true scale it enters the core at 7.890920,98.391739
// ([-1.1, -17.3]) and leaves at 7.872326,98.390302 ([-3.0, 8.4]) for the bay. Upstream it comes from
// the Kathu valley, which is compressed here, so the north end bends to the compressed Kathu
// rather than running on into the Thalang zone at its true-scale [-19.4, -37.5].
export const BANG_YAI: P[] = [
  [-14.5, -16.8],
  [-6, -17.9],
  [-1.1, -17.3],
  [-0.6, -6],
  [-1.0, 2],
  [-3.0, 8.4],
  [-2.2, 12.5],
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
// ศาลเจ้ากะทู้ (2368), the tin valley: 6.7 km at 309, drawn at 318 and 24 units out so its
// bearings to the Thalang cluster (also compressed, harder) stay within 30 degrees
export const KATHU: P = [-16.0, -17.8];
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
// ช่องปากพระ along the north edge, the strait Sarasin crosses (660 m in life; 4 units here so the
// island's north tip stays on the tile)
export const PAK_PHRA_Z = -46;
export const PAK_PHRA_W = 4;
// อ่าวภูเก็ต: east of the town, then round the south-east under the Saphan Hin headland (reclaimed
// from the dredge tailings, so land in every era here); a small cove takes the canal's mouth
export const BAY: P[] = [
  [33, -56],
  [31, -10],
  [29, 8],
  [23, 31],
  [8, 41],
  [-6, 56],
];
export const BAY_W = 28;
export const COVE: P[] = [
  [4, 21],
  [-2.2, 13.5],
];
export const COVE_W = 6;
// the west coast's x at a given z (the Andaman band's east edge), for the beach scenes
export const coastX = (z: number) => {
  for (let i = 1; i < ANDAMAN.length; i++) {
    const [ax, az] = ANDAMAN[i - 1];
    const [bx, bz] = ANDAMAN[i];
    if (z >= az && z <= bz) return ax + ((bx - ax) * (z - az)) / (bz - az) + ANDAMAN_W / 2;
  }
  return ANDAMAN[ANDAMAN.length - 1][0] + ANDAMAN_W / 2;
};

// ---- story places (model positions for the beats, not geo pins)
// Bowrey's Luppoone (ลิพอน, Thalang), "in the very middle of the Island": beside the later monument
export const LIPON: P = [-7.5, -31.5];
// where his ship lands, on the bay shore east of Thalang, and the forest track up to Luppoone
export const LANDING: P = [20.5, -30];
export const SHIP_AT: P = [26.5, -29];
export const TRACK: P[] = [[20, -30], [14, -31.5], [8, -30.5], [2, -32], [-3, -31.2], LIPON];
// 2328: the Thai stockade at วัดพระนางสร้าง / บ้านเคียน (the primary sources' camp), the Burmese
// camp on the open field to its west; the army withdraws north-west to its boats
export const STOCKADE: P = [-12.0, -31.6];
export const BURMESE_CAMP: P = [-19.5, -36];
// 1849-1869: the tin pits spread from Kathu down คลองบางใหญ่ to Thung Kha
export const THUNG_KHA: P = [-2.2, -9];
// the shophouse streets (ถลาง, ดีบุก, กระบี่) run east-west a block north of the Chartered corner
export const THALANG_RD_Z = -8.6;
export const DIBUK_RD_Z = -9.9;
export const KRABI_RD_Z = -10.9;
export const OLD_TOWN_X: [number, number] = [-13, -2.4];
// ถนนเทพกระษัตรี north to the Sarasin bridge, through the heroines' roundabout
export const NORTH_ROAD: P[] = [[-2.4, -12.6], [-5.5, -20], HEROINES, [-12.5, -38], [-14.0, -42], [-14.0, -48]];
