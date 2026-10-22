// Real positions (docs/briefs/ubon.md §4, the Gemini research's pins) via scripts/geo.mjs.
// World origin = the centre of ทุ่งศรีเมือง, 15.230222, 104.857306; 80 m/unit, +x east, -z north.
// Pure data so actors.ts, timeline.ts and geo.ts share it. Every pin waits for the
// workstation's OSM check; the Mun's centreline is drawn from the pins, not traced.
type P = [number, number];

// ---- the town on the north bank
export const THUNG: P = [0, 0]; // ทุ่งศรีเมือง, ~340 x 220 m = 4.3 x 2.8 units
export const THUNG_HALF: P = [1.4, 2.1]; // half-extents, x then z
export const PILLAR: P = [0.5, 2.3]; // ศาลหลักเมือง (2515-19)
export const WAT_THUNG: P = [4.7, 0.3]; // วัดทุ่งศรีเมือง, หอไตรกลางน้ำ (~2384)
export const WAT_SI_UBON: P = [-1.5, 3.7]; // วัดศรีอุบลรัตนาราม (2398)
export const WAT_LUANG: P = [4.2, 6.7]; // วัดหลวง, the town's first temple, on the bank
// the old core: ~1.7 km along the river by ~1 km inland
export const OLD_TOWN: P[] = [[-9, -4], [9, -4], [10, 6.8], [-10, 8.6]];

// ---- แม่น้ำมูล: ~190 m of water at the bridge (2.4 units), drawn 3 wide. It flows west to east
// past the town; the bridge pin (the deck's middle) puts the channel's centre at z ~ 10 there.
export const MUN: P[] = [[-48, 15], [-34, 13.4], [-20, 11.6], [-8, 10.6], [0, 10.2], [8, 9.4], [18, 10.4], [30, 12.6], [48, 12]];
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
export const WARIN_STATION: P = [1.9, 41.1]; // สถานีวารินทร์ (1 เม.ย. 2473)
export const RAIL_Z = 42.4; // the line from Si Sa Ket runs in from the west to the station
export const FERRY_X = 3.2; // ท่าหาดสวนยา (Warin) - ท่าจวน (Ubon): the boats before the bridge

// ---- north of town
export const AIRFIELD: P = [17.4, -29.1]; // กองบิน 21: runway 05/23, 3,000 m (37.5 units)
export const RUNWAY_ROT = (50 * Math.PI) / 180; // bearing 050

// ---- the founders' first camps, upstream to the north-west
// ดอนมดแดง: an island in the Mun upstream (provisional: its pin is the workstation's to find)
export const DON_MOT_DAENG: P = [-30, 12.9];
// บ้านท่าบ่อ / ห้วยแจระแม, the high ground after the flood: [-44.9, -34.4] true, pulled in
export const THA_BO: P = [-34, -26];
// ดงอู่ผึ้ง: the bee forest on the high north bank where the town was cleared
export const DONG_U_PHUENG: P = [0, 0];

// ---- far places (geo only)
export const PHA_TAEM: P = [46, -11]; // 71 km at 077 -> pulled to the east edge
export const KHONG_CHIAM: P = [46, -6]; // ปากมูล, the two-colour river, 68 km at 082

// the opening: the giant candle stands where ทุ่งศรีเมือง will be
export const CANDLE_AT: P = [0, -2];
