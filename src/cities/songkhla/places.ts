// Real positions (cloud's map, docs/briefs/songkhla_onep/README.md and its geojson): world units at 100 m/unit, +x east,
// +z south, origin the city pillar shrine (ศาลเจ้าพ่อหลักเมืองสงขลา, 7.19658, 100.59100, OSM node 4695685892). Pure data
// shared by the style frames, actors, timeline, geo and Landmarks. The two waters are OSM run through that transform and
// cut at the tile's edges (shapely, simplified to 0.3 units): the Gulf of Thailand (natural=coastline, Ko Nu its one
// island) and ทะเลสาบสงขลา with the channel to the sea (relation 1116319). Each is ONE flat shape, never a path river.
export type P = [number, number];
export const M_PER_UNIT = 100;

export const TILE = {x0: -56, x1: 40, z0: -50, z1: 46};

export const GULF: P[] = [[-15.7, -33.9], [-8.6, -40.9], [-10.2, -39.2], [-9.0, -37.3], [-5.2, -27.2], [-2.2, -21.8], [-0.8, -20.7], [2.3, -20.1], [3.8, -20.2], [3.8, -20.5], [2.4, -20.3], [4.3, -21.1], [5.7, -21.1], [6.4, -20.4], [19.8, 2.7], [25.4, 11.3], [28.7, 14.9], [31.1, 16.3], [32.6, 16.3], [34.1, 15.4], [35.1, 15.7], [40.0, 23.9], [40.0, -50.0], [-31.9, -50.0], [-29.2, -45.9], [-28.4, -45.6], [-25.6, -46.2], [-25.9, -47.3], [-25.3, -46.2], [-23.3, -45.8], [-21.5, -44.6], [-18.9, -41.6], [-17.8, -40.9], [-13.1, -42.8], [-17.2, -40.6], [-18.9, -41.3], [-21.2, -44.1], [-23.4, -45.6], [-26.8, -45.4], [-29.6, -44.3], [-34.1, -50.0], [-35.3, -50.0], [-35.3, -49.4], [-34.2, -48.5], [-33.1, -46.5], [-31.6, -42.5], [-29.6, -43.2], [-29.4, -44.0], [-28.7, -43.7], [-28.4, -42.5], [-30.9, -41.8], [-31.1, -42.2], [-31.4, -41.5], [-31.0, -40.7], [-30.1, -40.4], [-29.0, -36.5], [-26.2, -33.7], [-25.7, -33.6], [-23.3, -35.6], [-23.0, -37.3], [-17.6, -37.1], [-19.0, -35.3], [-21.7, -35.3], [-23.8, -34.3], [-24.3, -33.5], [-24.0, -32.0], [-23.3, -32.0], [-19.8, -28.9], [-19.1, -29.1], [-18.2, -28.5], [-15.6, -33.0]];
export const KO_NU: P[] = [[5.7, -47.3], [6.8, -45.6], [7.5, -45.5], [8.1, -44.8], [7.5, -42.6], [8.3, -41.5], [7.9, -40.5], [6.9, -40.9], [6.2, -42.3], [5.0, -43.2], [5.6, -44.3], [5.2, -45.5]];
export const LAKE: P[] = [[-56.0, 22.7], [-54.2, 20.4], [-55.5, 16.4], [-55.3, 14.8], [-54.4, 14.2], [-51.5, 15.0], [-51.8, 16.8], [-51.3, 19.4], [-49.9, 21.4], [-49.4, 26.4], [-47.2, 30.5], [-46.8, 32.6], [-43.4, 34.5], [-41.5, 37.5], [-38.3, 39.3], [-37.5, 40.2], [-36.7, 42.3], [-37.2, 42.9], [-41.8, 44.0], [-43.5, 45.2], [-43.9, 46.0], [-24.6, 46.0], [-23.7, 43.5], [-23.2, 40.1], [-22.6, 39.2], [-16.6, 37.8], [-8.4, 34.4], [-0.8, 28.9], [1.1, 26.4], [1.2, 24.8], [1.7, 24.7], [3.8, 19.6], [3.8, 16.5], [3.6, 15.8], [2.0, 16.0], [3.3, 15.3], [1.6, 15.4], [3.1, 15.1], [3.0, 14.2], [1.3, 14.9], [-2.5, 13.7], [-1.5, 10.5], [-0.5, 10.8], [1.0, 10.0], [0.4, 9.2], [1.5, 9.4], [0.6, 9.2], [-0.9, 7.5], [-0.5, 7.1], [-1.1, 6.9], [-1.1, 5.8], [-1.9, 4.5], [-1.5, 4.4], [-3.8, -5.2], [-5.5, -9.4], [-10.1, -17.8], [-10.0, -18.6], [-10.7, -19.4], [-12.8, -24.7], [-13.0, -26.3], [-15.3, -31.2], [-15.6, -33.0], [-18.2, -28.5], [-18.2, -27.4], [-17.9, -27.1], [-18.2, -27.0], [-18.2, -22.9], [-18.6, -21.1], [-19.1, -20.9], [-18.4, -18.1], [-18.8, -18.1], [-19.6, -17.0], [-18.8, -16.8], [-18.9, -15.9], [-19.9, -15.8], [-20.1, -15.2], [-19.2, -13.9], [-18.3, -13.7], [-18.3, -13.3], [-19.4, -13.0], [-18.1, -10.5], [-15.7, -9.4], [-15.2, -8.6], [-15.7, -8.3], [-15.2, -8.2], [-13.5, -3.9], [-13.5, -3.4], [-14.2, -2.8], [-11.2, -0.6], [-10.5, 0.6], [-10.7, 1.5], [-12.8, 2.4], [-12.9, 4.2], [-15.7, 6.2], [-18.5, 5.7], [-18.6, 6.3], [-27.1, 8.6], [-28.6, 6.0], [-29.2, 3.2], [-29.9, 3.6], [-31.5, 1.4], [-37.5, -1.9], [-41.1, -1.9], [-42.2, -1.3], [-43.1, -1.9], [-44.3, 0.1], [-45.9, 1.5], [-47.6, 0.4], [-48.4, 0.8], [-49.7, -4.3], [-49.4, -6.0], [-54.0, -12.3], [-56.0, -14.2]];

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
export const inWater = (x: number, z: number) => (inPoly(GULF, x, z) && !inPoly(KO_NU, x, z)) || inPoly(LAKE, x, z);
/** trees never stand on the water: a 2-unit grid of clearings over both waters */
export const WATER_CLEARINGS: [number, number, number, number][] = (() => {
  const out: [number, number, number, number][] = [];
  for (let x = TILE.x0 + 1; x < TILE.x1; x += 2)
    for (let z = TILE.z0 + 1; z < TILE.z1; z += 2) if (inWater(x, z)) out.push([x, z, 1.55, -1e9]);
  return out;
})();

// ---- the hills (OSM peaks; heights not verified, drawn low)
/** the Singora hills across the channel (เขาแดง, เขาน้อย, เขาเมือง), Khao Tang Kuan on the spit, Khao Khiao (the bridge's
 *  west end) and Ko Yo's hills at the south-west corner */
export const KHAO_DAENG: P = [-23.8, -19.8];
export const KHAO_NOI: P = [-35.7, -22.6];
export const KHAO_MUEANG: P = [-26.4, -11.8];
export const TANG_KUAN: P = [-1.9, -15.7];
export const KHAO_KHIAO: P = [-47.0, -1.2];
export const KO_YO: P = [-53.5, 28.0];

// ---- pins on the spit (Bo Yang)
export const PILLAR: P = [0, 0];
export const MUSEUM: P = [-2.3, -6.4];
export const OLD_STATION: P = [3.0, -5.0];
export const MERMAID: P = [5.3, -20.9];
export const SPIT_TIP: P = [-11.5, -37.9];
export const AIRFIELD: P = [17.5, 11.3];
// ---- Singora, across the channel
export const FORT_8: P = [-18.9, -28.0];
export const SULAIMAN_TOMB: P = [-37.2, -40.9];
export const LAEM_SON: P = [-15.7, -8.8]; // estimate
