// Real positions ([local]'s map, docs/briefs/yasothon_onep/README.md and its geojson; gemini's answer in
// docs/briefs/yasothon_research_gemini.md): world units at 100 m/unit, +x east, +z south, origin the city pillar shrine
// (ศาลเจ้าพ่อหลักเมือง, 15.79152, 104.14332), the heart of Ban Sing Tha. Pure data so actors.ts, timeline.ts, geo.ts and
// Landmarks.tsx share it. Everything in the story but the far places lies within ~1.7 km of the pillar, so the tile is the
// town at true scale; from west to east it reads: the Chi, the long pond (บุ่ง), the old town, Chaeng Sanit, the Phaya
// Thaen water.
export type P = [number, number];
export const M_PER_UNIT = 100;

export const TILE = {x0: -34, x1: 38, z0: -38, z1: 40};

// ---- the old town (OSM pins)
export const PILLAR: P = [0, 0]; // ศาลเจ้าพ่อหลักเมือง (origin)
export const WAT_SING_THA: P = [-0.9, 0.5]; // วัดสิงห์ท่า
export const WAT_MAHATHAT: P = [-1.1, -2.9]; // วัดมหาธาตุ, พระธาตุพระอานนท์
/** the governor's hall (โฮงเจ้าเมือง): not pinned; drawn on the block east of the pillar */
export const HONG: P = [1.6, -1.2];
/** ท่าน้ำเก่าบ้านสิงห์ท่า ([local]'s estimate from imagery, due west of Wat Sing Tha), drawn 0.4 E onto the bank */
export const LANDING: P = [-5.6, 1.9];
/** the old quarter ([local]'s estimate from imagery and OSM, not a legal boundary): the town's houses fill it */
export const OLD_QUARTER: P[] = [
  [-4.6, -5.6], [1.6, -6.6], [7.7, 4.4], [5.6, 5.6], [-1.6, 5.4], [-5.2, 3.0], [-5.0, -1.6],
];

// ---- the Chi (OSM ways 448436403/2), north-west to south through the tile. [local]: the OSM centreline sits near the
// east bank and the channel is 150-200 m wide, so the town reach (z -12..12) is drawn 80 m west, clear of the pond.
const CHI_OSM: P[] = [
  [-40.6, -27.0], [-38.4, -23.6], [-36.9, -20.1], [-34.9, -17.2], [-32.1, -15.4], [-27.8, -15.3], [-23.9, -14.9],
  [-20.2, -12.0], [-16.7, -10.4], [-13.0, -10.2], [-10.0, -8.9], [-7.9, -4.5], [-7.0, -1.1], [-5.9, 2.7], [-4.9, 5.7],
  [-5.8, 9.1], [-7.9, 11.5], [-10.1, 13.8], [-10.5, 17.1], [-11.4, 20.3], [-13.8, 22.3], [-16.7, 24.1], [-15.5, 29.1],
  [-13.4, 33.7], [-12.7, 37.2], [-11.7, 40.3], [-9.0, 42.0],
];
export const CHI: P[] = CHI_OSM.map(([x, z]) => [Math.round((z > -12 && z < 12 ? x - 0.8 : x) * 10) / 10, z]);
export const CHI_W = 1.8;
/** the long pond between the temples and the river (OSM สวนสาธารณะริมชี, ~600 x 120 m), drawn as a short water body */
export const POND: P[] = [[-5.6, -4.6], [-4.9, -2.0], [-4.1, 0.6]];
export const POND_W = 1.0;
/** the Phaya Thaen water (บึงพญาแถน, OSM), drawn as a wide spine from its outflow under Chaeng Sanit north */
export const PHAYA_THAEN: P[] = [
  [13.8, 12.4], [16.0, 9.2], [16.6, 5.6], [16.4, 1.0], [16.8, -3.0], [17.6, -7.0], [19.6, -11.0], [21.4, -15.4], [22.0, -19.4],
];
export const PHAYA_THAEN_W = 3.4;

// ---- the new town
/** Chaeng Sanit (ทล.23, OSM): in from the north-west, down the old town's east side, out to the south-east */
export const CHAENG_SANIT: P[] = [
  [-14.8, -26.4], [-11.1, -22.1], [-8.1, -18.6], [-6.9, -16.3], [-5.7, -13.0], [-4.6, -10.1], [-3.3, -6.7], [-1.6, -4.4],
  [0.9, -2.3], [3.0, -0.5], [5.6, 1.8], [8.3, 4.1], [10.9, 6.6], [13.3, 8.7], [15.3, 10.4], [19.2, 11.8], [24.6, 14.3],
  [31.1, 17.7], [35.6, 20.0],
];
/** the road west over the Chi ([local]: the bridge nearest the old town, OSM way 561113262) */
export const WEST_ROAD: P[] = [[-2.6, -6.2], [-6.4, -7.6], [-9.6, -8.4], [-13.0, -7.0], [-20.0, -5.0], [-30.0, -3.0]];
/** where WEST_ROAD crosses the Chi (distance along CHI) and Chaeng Sanit the Phaya Thaen outflow (along PHAYA_THAEN) */
export const CHI_BRIDGE_AT = 38.7;
export const OUTFLOW_BRIDGE_AT = 2.5;
/** the provincial hall ([local]: unverified, the government compound on the east side of Chaeng Sanit) */
export const HALL: P = [-2.6, -11.8];
export const MARKET: P = [4.8, -4.1]; // ตลาดสด (OSM)

// ---- the festival side
/** the launch tower: [local] could not see the towers in imagery and suggests the dike between the park and the
 *  museum; drawn at the park's north-west corner, clear of the road, the ponds and the water. The cover's rocket is
 *  bound here, launched here, and comes back here in the payoff. */
export const TOWER: P = [9.2, 9.4];
export const PARK: P = [10.5, 9.3]; // สวนสาธารณะพญาแถน (OSM)
export const MUSEUM: P = [12.4, 0.5]; // พิพิธภัณฑ์พญาคันคาก (OSM), drawn 0.2 W onto the dike

// ---- the cover: the rocket lies north of the tower, tail end at the tower's foot; it swings up onto the tower
/** the rocket's body and its bamboo tail, world units (legend scale: a real bang fai saen is ~3 m + a 10 m tail) */
export const BODY = 22;
export const TAIL = 19;
export const R = 1.7;
/** the rocket stands beside the tower (east of it) */
export const ROCKET_AT: P = [TOWER[0] + 1.8, TOWER[1]];

// ---- far places (sub lines only; not drawn)
export const TAT_THONG: P = [72.5, 33.2];
