// Real positions (docs/briefs/ubon.md §4, the Gemini research's pins) via scripts/geo.mjs.
// World origin = the centre of ทุ่งศรีเมือง, 15.230222, 104.857306; 80 m/unit, +x east, -z north.
// Pure data so actors.ts, timeline.ts and geo.ts share it. Every pin waits for the
// workstation's OSM check; the Mun's centreline is drawn from the pins, not traced.
type P = [number, number];

// ---- the town on the north bank
export const THUNG: P = [0, 0]; // ทุ่งศรีเมือง, ~340 x 220 m = 4.3 x 2.8 units
export const THUNG_HALF: P = [1.4, 2.1]; // half-extents, x then z
export const PILLAR: P = [0.6, 2.6]; // ศาลหลักเมือง (2515-19)
export const WAT_THUNG: P = [4.7, 0.3]; // วัดทุ่งศรีเมือง, หอไตรกลางน้ำ (~2384)
// วัดศรีอุบลรัตนาราม (2398): OSM [-1.9, 3.5], drawn 1.1 further south-west (bearing 209 vs 208) so it
// stands outside the ring of houses round the field instead of cutting into it (owner)
export const WAT_SI_UBON: P = [-2.6, 4.6];
export const WAT_LUANG: P = [3.8, 7.4]; // วัดหลวง, the town's first temple, on the bank (OSM [3.8, 7.8], kept off the water)
// the old core: ~1.7 km along the river by ~1 km inland
export const OLD_TOWN: P[] = [[-9, -4], [9, -4], [10, 6.8], [-10, 8.6]];

// ---- แม่น้ำมูล: ~190 m of water at the bridge (2.4 units), drawn 3 wide. The OSM centreline
// (riverbank r2665616, centreline r392517; the workstation's check on PR #63), resampled to model
// units: west of town it bends south, east of town it runs north-east toward Khong Chiam.
export const MUN: P[] = [[-56, 33.9], [-34.2, 33.8], [-28.1, 32.5], [-23.1, 30.9], [-20.4, 28.7], [-16.2, 24.7], [-12.2, 14.9], [-10.6, 11.8], [-8.9, 9.8], [-5.7, 9.1], [-1.3, 10.1], [3.6, 10.6], [14.2, 9.7], [20.2, 9.5], [25.6, 7.2], [30, 5.3], [43.6, -4.6], [47.8, -5.5], [56, -4.8]];
export const MUN_W = 3;
export const munZ = (x: number) => {
  for (let i = 0; i < MUN.length - 1; i++) {
    const [x0, z0] = MUN[i];
    const [x1, z1] = MUN[i + 1];
    if (x >= x0 && x <= x1) return z0 + ((z1 - z0) * (x - x0)) / (x1 - x0);
  }
  return x < MUN[0][0] ? MUN[0][1] : MUN[MUN.length - 1][1];
};

// ---- crossings and the south bank
export const BRIDGE_X = 0; // สะพานเสรีประชาธิปไตย (2497), the deck's middle at [0, 10.4]
export const WARIN_STATION: P = [1.7, 40.8]; // สถานีวารินทร์ (1 เม.ย. 2473)
export const RAIL_Z = 42.4; // the line from Si Sa Ket runs in from the west to the station
export const FERRY_X = 3.2; // ท่าหาดสวนยา (Warin) - ท่าจวน (Ubon): the boats before the bridge

// ---- north of town
export const AIRFIELD: P = [16.6, -31.0]; // กองบิน 21: runway 05/23, 3,000 m (37.5 units)
export const RUNWAY_ROT = (50 * Math.PI) / 180; // bearing 050

// ---- the founders' first camp, downstream to the east
// ดอนมดแดง: a forested island in the Mun ~21 km downstream (15.2904, 105.0524; the workstation's
// satellite check on PR #63), pulled in to the east edge on the river. The people came down the
// Mekong and up the Mun, so they arrive from the east.
export const DON_MOT_DAENG: P = [41, -2.6];
// บ้านท่าบ่อ / ห้วยแจระแม, the high ground after the flood: [-44.9, -34.4] true, pulled in
export const THA_BO: P = [-34, -26];
// ดงอู่ผึ้ง: the bee forest on the high north bank where the town was cleared
export const DONG_U_PHUENG: P = [0, 0];

// the opening: the giant candle stands where ทุ่งศรีเมือง will be
export const CANDLE_AT: P = [0, -2];
