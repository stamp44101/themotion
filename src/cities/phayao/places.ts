// Real positions (cloud's map, docs/briefs/phayao_onep/README.md and its geojson): world units at 100 m/unit, +x east,
// +z south, origin the city pillar (ศาลหลักเมืองพะเยา, 19.16650, 99.90195, OSM way 1468605644). Pure data so actors.ts,
// timeline.ts, geo.ts and Landmarks.tsx share it. Everything is at true scale on one 96-unit tile: the Kwan (OSM relation
// 5657979, simplified to ~100 m), the wiang on its headland, Wat Si Khom Kham on the shore, the Ing in and out of the lake,
// and the roads (OSM). The Ing's course across the lake bed before 2482 is an estimate. No far places.
export type P = [number, number];
export const M_PER_UNIT = 100;

export const TILE = {x0: -62, x1: 34, z0: -48, z1: 48};

// ---- the Kwan: one flat shape (OSM relation 5657979, outer ring simplified to ~100 m); it fills in the lake beat (2482)
export const KWAN: P[] = [
  [-38.7, 16.8], [-41.2, 18.6], [-39.0, 16.6], [-41.6, 14.5], [-40.3, 11.5], [-41.8, 11.9], [-45.2, 3.9], [-48.9, 0.9],
  [-47.8, -1.5], [-50.2, -2.3], [-50.4, -11.2], [-48.7, -12.6], [-48.2, -24.2], [-43.8, -29.9], [-45.2, -36.5], [-37.0, -38.0],
  [-37.3, -40.4], [-35.4, -41.1], [-34.7, -37.8], [-33.4, -38.1], [-33.5, -35.8], [-29.2, -30.3], [-29.4, -28.0], [-25.2, -20.5],
  [-25.8, -18.4], [-20.8, -16.8], [-11.6, -7.2], [-9.7, -7.9], [-7.1, -4.5], [-5.5, 2.5], [-1.8, 4.1], [3.2, 3.1], [8.8, 5.8],
  [10.2, 4.3], [14.6, 8.2], [5.4, 8.3], [3.6, 12.8], [5.3, 14.2], [9.0, 10.2], [8.0, 12.6], [-2.5, 20.1], [-8.6, 18.6],
  [-11.4, 12.7], [-15.7, 19.1], [-18.4, 19.9], [-16.4, 21.8], [-22.6, 24.5], [-32.5, 22.6], [-34.8, 20.2], [-34.1, 19.2],
];
export const inPoly = (x: number, z: number, poly: P[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i];
    const [xj, zj] = poly[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
};
/** the lake bed on a 2.5-unit grid: no trees on it in any era (marsh and paddy before the gate, water after) */
export const KWAN_CELLS: P[] = [];
for (let x = -52; x <= 16; x += 2.5) for (let z = -42; z <= 26; z += 2.5) if (inPoly(x, z, KWAN)) KWAN_CELLS.push([x, z]);

// ---- the Ing: in from the north (OSM way 255901636), across the lake bed to the outlet (estimate before the lake), then
// east (OSM 459149835 + 255901640); it starts and ends on the tile's edges
export const ING: P[] = [
  [-41.6, -48], [-40.0, -47.7], [-36.6, -44.4], [-36.0, -41.1], [-33, -34], [-30.5, -27], [-27.5, -21], [-22, -15], [-17, -9],
  [-13, -3], [-9.5, 3], [-5, 8.5], [1, 10.5], [8, 9.2], [14.6, 8.2], [16.7, 10.4], [19.7, 6.9], [21.6, 8.1], [20.1, 4.9],
  [22.8, 6.5], [24.2, 4.1], [26.6, 3.7], [24.5, 1.8], [27.8, 1.8], [31.6, 2.6], [34, 1.0],
];
export const ING_W = 1.0;
/** the 2482 gate across the Ing at the lake's outlet, just upstream of the Phahonyothin bridge (OSM tags no gate) */
export const GATE: P = [11.4, 8.5];
/** where ถนนพหลโยธิน crosses the Ing below the gate (OSM bridge ways 192211859 / 234013690) */
export const OUTLET_BRIDGE: P = [13.0, 7.4];

// ---- Wiang Phayao on its headland (imagery + OSM: the ring road and the moat traces on the north and east), kept inside
// the lake's shore
export const WIANG: P[] = [[-6.9, -5.3], [-2.0, -6.3], [3.4, -5.0], [4.8, 0], [2.7, 2.4], [-1.8, 3.2], [-4.8, 1.6], [-6.0, -2.0]];
export const PILLAR: P = [0, 0]; // ศาลหลักเมืองพะเยา (origin)
export const WAT_SI_UMONG: P = [-1.3, 1.2]; // วัดศรีอุโมงค์คำ (OSM -1.27, 1.17)
export const WAT_RATCHAKHRUE: P = [1.65, -0.55]; // วัดราชคฤห์ (OSM)
/** อนุสาวรีย์พญางำเมือง in the lakeside park (OSM node 6315215536 at -6.2, -2.5): drawn 1.4 E, clear of the shore road */
export const MONUMENT: P = [-4.8, -2.2];

// ---- Wat Si Khom Kham (OSM way 210167222 at -13.3, -11.1) on the shore NW of the wiang: the Buddha faces east, the lake at
// its back; the old Phahonyothin passes 1.3 units east
/** the wat stands on the strip between the shore and the old road (both run north-west to south-east here, ~3.3 units
 *  apart): the vihara is drawn at the pin, its front to the road (north-east), the lake at its back */
export const VIHARA_C: P = [-13.3, -11.1];
/** the vihara's front (toward the road), a unit vector in x/z */
export const FRONT: P = [0.72, -0.69];
export const VIHARA_L = 2.0; // front to back
export const VIHARA_W = 2.4; // along the shore
/** the Buddha sits at the back of the vihara, facing the front */
export const WAT_SI_KHOM_KHAM: P = [VIHARA_C[0] - 0.25 * FRONT[0], VIHARA_C[1] - 0.25 * FRONT[1]];
/** the Buddha's size once it is back at its site after the cover (drawn ~10x so it reads against the people) */
export const BUDDHA_S = 1.6;
/** the cover's legend scale */
export const LEGEND_S = 56;

// ---- Wat Tilok Aram (OSM node 5230006780), on the lake bed 0.9 km S of the pillar: dry land until the gate
export const WAT_TILOK: P = [-2.4, 8.8];

// ---- roads (OSM, centrelines of the dual carriageways)
/** ถนนพหลโยธิน (ทล.1) from the north-west edge along the east of the wiang to the outlet bridge and south */
export const TRUNK: P[] = [
  [-33.2, -48], [-32.2, -44.4], [-31.0, -38.0], [-29.6, -35.8], [-27.4, -33.2], [-25.7, -32.0], [-21.8, -29.3], [-18.3, -27.2],
  [-13.6, -24.3], [-9.0, -20.4], [-4.9, -16.7], [-1.9, -13.8], [0.1, -11.4], [1.6, -9.6], [3.3, -7.4], [5.0, -5.0], [6.2, -3.4],
  [9.0, 0.1], [11.2, 3.0], [12.6, 5.2], [13.0, 6.8], [13.0, 9.8], [12.4, 12.0], [11.0, 17.5], [10.0, 24.4], [9.7, 28.5],
  [9.2, 36.5], [8.0, 43.5], [6.4, 48],
];
/** the old Phahonyothin along the shore past Wat Si Khom Kham and through the wiang (OSM primary พย.ถ1-0060 / ถ3-0001) */
export const OLD_ROAD: P[] = [
  [-21.8, -29.3], [-24.1, -23.3], [-21.9, -19.9], [-19.7, -16.7], [-16.0, -13.9], [-12.0, -12.4], [-8.0, -7.4], [-5.0, -4.2],
  [-0.3, -2.1], [2.3, -2.4], [6.8, 1.3], [11.2, 3.6], [12.6, 5.2],
];
/** ถนนรอบเวียงประตูคลอง along the north moat */
export const MOAT_ROAD: P[] = [[-5.0, -4.2], [-4.1, -5.0], [4.5, -5.4]];
/** ถนนชายกว๊าน round the headland's lake side (kept 0.6 inland of the simplified shore) */
export const SHORE_ROAD: P[] = [[2.2, 2.0], [-0.5, 3.3], [-4.3, 2.3], [-5.3, 1.3], [-6.2, -2.9], [-5.0, -4.2]];
/** ทล.1202 north-east from the wiang's corner */
export const NE_ROAD: P[] = [[5.0, -5.0], [14.9, -10.1], [20.9, -14.3], [27.5, -20.7], [33.0, -30.0], [34, -31.6]];
/** ทล.1193 south-west to Mae Na Ruea, off the trunk */
export const SW_ROAD: P[] = [[9.7, 28.5], [4.0, 29.8], [-7.5, 30.8], [-16.2, 34.4], [-20.8, 35.9], [-33.0, 41.6]];

// ---- the settlers' track in from the south (Lampang lies south-west): along the trunk's line to the wiang's south-east
export const SOUTH_TRACK: P[] = [[9.6, 34.0], [10.0, 24.4], [11.0, 17.5], [12.4, 12.0], [13.0, 9.8], [12.8, 6.4], [9.6, 2.0], [6.4, 0.2]];

// ---- the province beat: the parade along the shore road to the monument's park
export const PARADE: P[] = [[2.2, 1.6], [-0.5, 2.9], [-4.0, 2.0], [-5.0, 0.9], [-5.6, -1.2]];

/** the Buddha's turn: local +z to FRONT (north-east, toward the road and the town) */
export const FACE = Math.atan2(FRONT[0], FRONT[1]);
/** the vihara's turn: local +x to FRONT */
export const VIHARA_ROT = Math.atan2(-FRONT[1], FRONT[0]);
