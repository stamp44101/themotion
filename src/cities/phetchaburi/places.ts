// Real positions (docs/briefs/phetchaburi.md §5a, Google Maps / OSM) via scripts/geo.mjs.
// World origin = the centre of the traced wall rectangle, 13.10398, 99.95308; 80 m/unit,
// +x east, -z north. Pure data so actors.ts, timeline.ts and geo.ts share it.
type P = [number, number];

// พระนครคีรี (เขาวัง): three peaks in a line west -> east (pins -22.3,-7.3 / -20.0,-5.1 / -18.4,-5.3)
export const PEAK_W: P = [-22.3, -7.1]; // palace group, พระที่นั่งเพชรภูมิไพโรจน์
export const PEAK_M: P = [-20.0, -5.1]; // พระธาตุจอมเพชร
export const PEAK_E: P = [-18.4, -5.3]; // วัดพระแก้วน้อย
// exaggerated peak heights, see index.ts
export const PEAK_H = {w: 3.0, m: 2.6, e: 2.0};

// วัดกำแพงแลง: the pin (3.8, -2.2) sits on the traced east wall line. Drawn inside it, far
// enough west that its enclosure (drawn ~3x, Landmarks.tsx) clears the wall: at 2.9 the
// enclosure ran through the east wall and ประตูบางจาน opened into the temple
export const KAMPHAENG_LAENG: P = [1.65, -2.4];
// วัดมหาธาตุวรวิหาร on the west bank
export const MAHATHAT: P = [-8.9, -2.0]; // pin -7.9: moved 80 m west so its terrace clears the channel
// วัดใหญ่สุวรรณาราม: the pin (0.4, -7.0) lies on the disputed north wall line; drawn inside
export const WAT_YAI: P = [0.4, -5.4];
// พระรามราชนิเวศน์ (วังบ้านปืน), on the west bank south of the town (pin -7.7, 12.5)
export const BAN_PUEN: P = [-8.1, 12.6];
// สถานีรถไฟเพชรบุรี (pin -16.2, -17.0): the 1903 terminus of the first southern line
export const STATION: P = [-16.2, -17.0];
export const RAIL_X = -13.6;
// the 2124 assault points: ตำบลคลองกระแชง west of the river (pin -7.3, -4.4) and
// ประตูบางจาน on the east wall (BANG_CHAN, below the wall)
export const KLONG_KRACHAENG: P = [-7.6, -4.4];
// the west gate by the landing ท่าตรง (no pin)
export const WEST_GATE: P = [-5.3, -1.0];

// The wall (MBJ 46-2, traced on OSM in the brief §1b): the river is its west moat, the west
// side along ถนนพานิชเจริญ on the east bank, ท่าหิน south, โพธิ์การ้อง east, พงษ์สุริยา north
// (disputed). Corners -5.5,-6.7 / 3.7,-7.7 / 6.1,6.4 / -5.5,8.0; the west side moved 0.2
// east so it stands on the bank, not in the drawn channel.
export const WALL: P[] = [
  [-5.3, -6.7],
  [3.7, -7.7],
  [6.1, 6.4],
  [-5.3, 8.0],
];
// x of the east wall at depth z (for the gate and the east army)
export const eastWallX = (z: number) => 3.7 + ((z + 7.7) / 14.1) * 2.4;
// ประตูบางจาน (no pin): on the east wall where the road runs east, south of วัดกำแพงแลง so the
// armies at the gate (5.3 units wide) stand in the street, not in the temple's enclosure
export const BANG_CHAN: P = [eastWallX(2.8), 2.8];

// แม่น้ำเพชรบุรี: enters the ONEP zone at -6.5,-9.4 and leaves at -6.0,11.4 (OSM way
// 120451772), flowing north through the town. ~35 m real; drawn 56 m (0.7) so boats read.
// Upstream it comes from the south-west, downstream it bends north-east to the Gulf.
export const RIVER: P[] = [
  [-16, 48],
  [-10, 30],
  [-6.4, 18],
  [-5.95, 11.4],
  [-6.1, 4],
  [-6.15, -2],
  [-6.35, -9.4],
  [-7.2, -20],
  [-4, -33],
  [5, -48],
];
export const RIVER_W = 0.7;

// the royal procession's way up Khao Wang (palace beat): from the plain at the hill's north-east
// foot, up the north flank below วัดพระแก้วน้อย and the chedi, to the foot of the palace
// terrace. The palace shot looks from the north, where the three crowns stand side by
// side; a way up the south-east flank (the first route) was hidden behind the hill all along
export const CLIMB: P[] = [
  [-15.4, -7.6],
  [-16.6, -7.3],
  [-17.8, -7.6],
  [-19.0, -7.3],
  [-19.7, -7.0],
];
// the งานพระนครคีรี fair on the plain below the hill, where the cover's ขนมหม้อแกง comes back;
// clear of Wat Mahathat's terrace (its nearest corner is 4 units away) and of the river
export const FAIR: P = [-14.0, 2.6];

