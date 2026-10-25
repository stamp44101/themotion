// Real positions (docs/briefs/surin_onep/README.md, PR #69): metres from the ONEP centroid
// converted to world units at **40 m/unit** with the origin moved to the inner moat's centre,
// 14.884570, 103.489456 (README x 272, z 96). +x east, +z south. Pure data so actors.ts,
// timeline.ts, geo.ts and Landmarks.tsx share it.
type P = [number, number];
const u = (x: number, z: number): P => [+((x - 272) / 40).toFixed(2), +((z - 96) / 40).toFixed(2)];

// ---- the inner moat (พุทธศตวรรษที่ 12–13): the hull of the six surviving ponds; the north-east
// quarter, where no water survives, is rounded with one extra point instead of the hull's chord.
// ~55 m wide = 1.4 units. This is the moat's centreline.
export const INNER: P[] = [
  u(-365, 48), u(-305, -178), u(-183, -379), u(357, -637), u(432, -617), u(700, -420), u(879, 41), u(881, 144),
  u(606, 674), u(400, 892), u(19, 614), u(-304, 177),
];
export const INNER_W = 1.4;

// ---- the outer moat / the ONEP old-town zone (record 57; Khmer, สันนิษฐานว่า พุทธศตวรรษที่ 16–18).
// An open line: no ditch survives on the north side, where the railway is the zone's edge
// (README "Outer moat"). From the north-east corner round by the south to the north-west.
export const OUTER: P[] = [u(1057, -641), u(879, -241), u(1372, 152), u(433, 1190), u(-1368, 58), u(-1015, -740)];
export const OUTER_W = 1.1;

// ---- the railway (1 พ.ค. 2469): east-west along the zone's north edge
// the engine lays it straight east-west; the real line rises ~8 degrees to the east
export const RAIL_Z = -22.2;
// สถานีรถไฟสุรินทร์, OSM node 3107829713 at u(760, -681) = [12.2, -19.4]; 2.6 south of the line,
// where the engine puts a station
export const STATION: P = [12.2, -19.6];
// ถนนธนสาร: from the station south into the town
export const THANASAN: [P, P] = [[11.0, -15.2], [5.5, 0]];

// ---- pins (OSM, README §2)
export const LAK_MUEANG = u(247, 93); // ศาลหลักเมือง, the inner moat's centre
export const OLD_HALL = u(563, 354); // ศาลากลางจังหวัดหลังเดิม
export const MONUMENT = u(288, 781); // อนุสาวรีย์พระยาสุรินทรภักดีศรีณรงค์จางวาง (ปุม), on the south moat
export const STADIUM = u(1098, 1160); // สนามกีฬาศรีณรงค์, the elephant show ground
export const WAT_BURAPHARAM = u(670, 116);
export const WAT_KLANG = u(459, 99);
export const WAT_SALA_LOI = u(991, 371);
export const WAT_CHUMPHON = u(286, 901); // วัดจุมพลสุทธาวาส, south of the monument

// ---- off the tile
// ปราสาทเมืองที / บ้านเมืองที, where Chiang Pum lived before 2306: 17.5 km east (14.8884,
// 103.6518); the move comes in from the east edge
export const MUEANG_THI_TRUE: P = [436.7, -10.5];
export const FROM_EAST: P = [47, 2];
