// Real positions (cloud's map, docs/briefs/pattani_onep/README.md and its geojson): world units at 125 m/unit, +x east,
// +z south, origin the city pillar shrine (ศาลหลักเมืองปัตตานี, 6.86878, 101.25252, OSM way 1337146202). Pure data so
// actors.ts, timeline.ts, geo.ts, Landmarks.tsx and the style frames share it. Everything is at true scale: the town on the
// Pattani river, Kru Se 5.6 km east on the bay's south shore, Pattani bay and the Laem Tachi spit. No far places.
// The sea (the bay and the gulf, joined round the spit's tip) is ONE flat shape cut at the tile's edges, plus the open sea's
// north-east corner beyond the spit (shapely from OSM natural=coastline, simplified to 0.3 units). Never a path river.
export type P = [number, number];
export const M_PER_UNIT = 125;

export const TILE = {x0: -30, x1: 62, z0: -72, z1: 30};

export const SEA: P[] = [[62.0, -51.8], [58.2, -50.2], [57.0, -48.9], [55.7, -48.6], [54.9, -47.4], [52.8, -48.0], [49.3, -52.5], [49.8, -53.6], [49.4, -53.6], [49.0, -52.6], [49.1, -53.5], [48.7, -53.6], [48.4, -53.1], [47.8, -53.6], [45.8, -53.3], [45.8, -53.0], [47.2, -53.2], [43.8, -51.3], [41.0, -57.7], [37.8, -60.9], [35.2, -62.1], [28.9, -61.1], [28.7, -61.8], [29.7, -62.9], [29.4, -66.1], [30.2, -69.4], [26.7, -70.5], [24.2, -69.3], [19.6, -64.1], [18.3, -66.5], [15.5, -66.5], [13.3, -65.3], [12.2, -66.1], [10.6, -65.0], [9.9, -65.1], [9.9, -64.3], [8.4, -64.0], [7.5, -64.4], [3.5, -61.2], [2.4, -61.2], [0.9, -62.1], [-2.1, -61.4], [-4.9, -59.2], [-5.9, -57.9], [-7.5, -57.3], [-8.2, -57.4], [-8.1, -57.8], [-7.3, -57.8], [-7.1, -58.5], [-8.6, -59.2], [-12.1, -57.3], [-11.7, -58.2], [-11.1, -58.0], [-11.0, -58.9], [-12.2, -60.1], [-12.7, -59.7], [-12.5, -58.7], [-14.4, -57.5], [-15.9, -53.7], [-16.3, -51.2], [-17.0, -51.2], [-17.8, -53.4], [-17.7, -55.0], [-16.3, -58.3], [-14.8, -59.9], [-9.2, -63.7], [-8.6, -66.6], [-4.7, -67.3], [1.0, -66.9], [3.5, -68.0], [6.7, -68.6], [13.7, -72.0], [-30.0, -72.0], [-30.0, -8.7], [-27.4, -9.9], [-20.9, -14.1], [-18.2, -16.2], [-15.3, -19.9], [-13.8, -23.4], [-15.9, -27.8], [-9.2, -31.7], [-8.5, -30.8], [-6.3, -31.6], [-0.3, -31.7], [0.4, -31.6], [0.5, -30.1], [1.6, -29.3], [4.8, -30.3], [8.9, -30.2], [12.6, -27.9], [17.5, -22.5], [19.2, -21.4], [29.1, -20.0], [27.8, -20.1], [28.4, -19.9], [27.7, -16.5], [28.0, -13.9], [27.6, -12.2], [28.2, -10.8], [29.3, -9.7], [32.0, -8.1], [34.7, -8.3], [39.5, -10.0], [46.2, -14.3], [49.7, -15.4], [51.3, -14.9], [52.5, -13.3], [54.0, -12.5], [54.7, -10.8], [55.3, -10.8], [57.8, -8.8], [62.0, -8.2]];
export const SEA_NE: P[] = [[32.6, -72.0], [46.6, -65.5], [51.3, -62.7], [58.0, -58.3], [62.0, -54.8], [62.0, -72.0]];
export const RIVER: P[] = [[-4.7, 30.0], [-4.3, 29.7], [-2.7, 29.7], [-2.0, 29.1], [-3.6, 27.8], [-3.6, 27.1], [-2.8, 25.9], [-4.0, 24.5], [-4.0, 23.7], [-2.2, 23.1], [0.2, 23.8], [0.9, 23.1], [-0.6, 21.7], [-0.1, 19.6], [-2.1, 18.2], [-2.5, 16.0], [-1.4, 14.4], [-1.5, 13.4], [-2.9, 13.1], [-5.5, 13.6], [-6.5, 12.9], [-6.8, 11.5], [-5.8, 9.0], [-6.0, 7.3], [-5.4, 7.0], [-2.7, 8.2], [-1.6, 8.0], [-1.0, 7.4], [-0.7, 3.1], [0.3, 0.8], [2.7, -2.8], [3.2, -4.2], [2.8, -8.7], [4.3, -14.5], [3.3, -19.7], [1.9, -22.4], [-4.3, -26.9], [-7.4, -31.3]];
export const RIVER_W = 0.6;

/** point in polygon (even-odd) */
export const inPoly = (pts: P[], x: number, z: number) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, zi] = pts[i];
    const [xj, zj] = pts[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
};
export const inSea = (x: number, z: number) => inPoly(SEA, x, z) || inPoly(SEA_NE, x, z);
/** trees never stand on the sea: a 2-unit grid of clearings over it */
export const SEA_CLEARINGS: [number, number, number, number][] = (() => {
  const out: [number, number, number, number][] = [];
  for (let x = TILE.x0 + 1; x < TILE.x1; x += 2)
    for (let z = TILE.z0 + 1; z < TILE.z1; z += 2) if (inSea(x, z)) out.push([x, z, 1.55, -1e9]);
  return out;
})();

// ---- the town on the river (OSM pins)
export const PILLAR: P = [0, 0]; // ศาลหลักเมืองปัตตานี (origin), by the west bank
export const DECHA_BRIDGE: P = [-0.3, 2.5]; // สะพานเดชานุชิต
export const HALL: P = [-2.2, 1.0]; // ศาลากลางจังหวัด
/** ศาลเจ้าแม่ลิ้มกอเหนี่ยว (ศาลเจ้าเล่งจูเกียง, OSM 5.0, -2.4), in the Chinese quarter of Anoru on the east bank */
export const SHRINE: P = [5.0, -2.4];
/** มัสยิดกลางปัตตานี (OSM 2.3, 5.9), on the east bank; drawn 0.4 W, 1.3 S so ถนนยะรัง passes east of its wide grounds and the procession's crowd north of it */
export const CENTRAL_MOSQUE: P = [1.9, 7.2];
/** วังจะบังติกอ (nominatim 6.85592, 101.24850) */
export const CHABANG_TIGA: P = [-3.6, 11.4];
export const PSU: P = [-14.5, -11.3]; // ม.อ. ปัตตานี
export const MOUTH: P = [-7.4, -31.2]; // where the river meets the bay
/** the old town on both banks (imagery; not a legal boundary) */
export const OLD_TOWN: P[] = [
  [-7.0, -6.0], [2.0, -7.5], [9.0, -6.0], [10.0, 1.0], [8.5, 8.0], [5.0, 13.0], [-1.0, 15.0], [-7.0, 13.5], [-7.5, 6.0],
  [-8.0, 0.0],
];

// ---- Kru Se, the old capital on the bay's south shore (OSM pins)
export const KRUESE: P = [44.7, -3.7]; // มัสยิดกรือเซะ
export const TOMB: P = [43.6, -3.9]; // ฮวงซุ้ยเจ้าแม่ลิ้มกอเหนี่ยว (OSM 43.8, -3.9; drawn 0.2 W, clear of the mosque)
/** the queens' wooden palace and its stockade, between the mosque and the shore (no pin: the old citadel is not in OSM) */
export const ISTANA: P = [40.4, -6.6];
/** the casting pits, on open ground south of the mosque (estimate) */
export const PITS: P = [42.6, 2.4];
/** the landing on the shore below the palace and the anchorage off it in the bay (estimate) */
export const LANDING: P = [39.6, -9.6];
export const ANCHORAGE: P = [38.0, -14.0];
export const KRUSE_VILLAGE: P = [36.4, -2.0]; // บ้านกรือเซะ (OSM 39.1, -2.2), the houses spread west of the mosque

// ---- the bay
export const SPIT_TIP: P = [-11.1, -56.8];
/** ships come in round the spit's tip and up the bay to Kru Se; every point is on the sea (checked in actors) */
export const SHIP_IN: P[] = [[-29.0, -40.0], [-22.0, -46.0], [-12.0, -50.0], [0.0, -45.0], [14.0, -36.0], [26.0, -25.0], [33.0, -18.0], [ANCHORAGE[0], ANCHORAGE[1]]];
/** the boat that takes the cannon away: from the landing out of the bay to the west */
export const SHIP_OUT: P[] = [[LANDING[0] - 0.4, LANDING[1] - 1.4], [34.0, -16.0], [24.0, -26.0], [10.0, -39.0], [-4.0, -48.0], [-16.0, -51.0], [-24.0, -44.0], [-29.5, -38.0]];

// ---- roads (OSM trunk/primary/secondary, simplified to 0.5 units)
/** ทล.42: west to east south of the town, then out to Kru Se (drawn ~1.4 units south of the mosque: OSM runs at its gate) */
export const HWY42: P[] = [
  [-30.0, 13.0], [-23.9, 12.8], [-4.7, 15.2], [5.7, 15.1], [9.3, 14.6], [12.2, 12.8], [17.9, 2.2], [22.6, -0.9], [32.0, -2.4],
  [38.0, -1.4], [42.0, -0.6], [47.0, -0.8], [51.0, -3.0], [54.2, -4.0], [57.0, -3.2], [62.0, 0.0],
];
/** ถนนพิพิธ / ถนนยะรัง: the old street over the Dechanuchit bridge, south past the Central Mosque */
export const OLD_STREET: P[] = [[-1.8, -0.7], [-0.8, 2.3], [3.5, 4.7], [5.4, 7.0], [3.6, 10.4], [-0.1, 14.4]];
export const NONGCHIK_RD: P[] = [[-24.7, 9.9], [-10.2, 3.2], [-1.8, -0.7]];
export const RD_410: P[] = [[1.3, 15.4], [15.9, 23.3], [19.1, 30.0]];
export const RD_418: P[] = [[-26.8, 10.9], [-24.1, 24.3], [-27.8, 30.0]];
export const PSU_RD: P[] = [[-10.2, 3.0], [-15.7, -7.2], [-30.0, -3.2]];
export const SAMAKKHI_RD: P[] = [[-2.0, -1.1], [-4.2, -8.7], [-6.4, -12.4], [-12.7, -9.2], [-15.7, -7.2]];
export const EAST_RD: P[] = [[4.9, 1.9], [19.7, -0.4], [22.6, -0.9]];
export const NORTH_RD: P[] = [[4.9, 1.7], [6.7, -0.6], [7.4, -4.0], [7.9, -17.8], [8.2, -19.4], [23.6, -18.0], [24.0, -11.3], [25.7, -1.5]];
export const HWY43: P[] = [[39.9, 30.0], [45.2, 25.5], [62.0, 3.0]];

// ---- the cover: the giant cannon on the plain south-east of ทล.42, between the town and Kru Se (legend scale), clear of
// every road; it comes back in the payoff
export const CANNON_AT: P = [32.5, 11];
export const CANNON_S = 32; // barrel length in units (4 km: legend scale, over a third of the tile's width)
