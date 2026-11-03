// Real positions ([local]'s map, docs/briefs/kanchanaburi_onep/README.md, PR #83, b2e66d5; Gemini's
// answer in docs/briefs/kanchanaburi_research_gemini.md): world units at 100 m/unit, +x east, +z south,
// origin the city pillar (ศาลหลักเมืองกาญจนบุรี, 14.01964, 99.53081). The rivers and the Kanchanaburi line
// are Douglas-Peucker'd from kanchanaburi_osm.geojson (tolerance 35 m). Pure data so actors.ts,
// timeline.ts, geo.ts and Landmarks.tsx share it.
export type P = [number, number];
export const M_PER_UNIT = 100;

export const PILLAR: P = [0, 0];
// the Rama III wall of 2374, a 210 x 520 m rectangle with its long river side on the SW (ONEP);
// the front gate survives at (-1.0, 0.2). Drawn from the gate, the dimensions and the river's bearing.
export const WALL: P[] = [[-2.87, -1.54], [0.87, 2.04], [2.32, 0.53], [-1.42, -3.05]];
export const GATE: P = [-1.0, 0.2];

// แควใหญ่ (the Mae Klong until 2503) from the west and the north-west bend; แควน้อย from the south-west; both
// join at the pillar's river front (-4.2, 1.1) and run on as the Mae Klong to the SE
export const KHWAE_YAI: P[] = [
  [-57.2, -57.9], [-51.8, -48.5], [-51.4, -44.6], [-53.3, -40.0], [-56.3, -34.9], [-59.7, -31.9], [-59.6, -24.5],
  [-54.6, -20.1], [-50.6, -21.6], [-43.4, -21.4], [-39.9, -22.4], [-34.2, -26.0], [-32.3, -26.2], [-27.5, -21.8],
  [-18.8, -17.4], [-9.9, -11.2], [-8.8, -9.8], [-7.5, -5.5], [-4.9, -2.8], [-4.2, 1.1],
];
export const KHWAE_YAI_W = 3.6; // 280-300 m at the bridge, 120-150 m by the town: drawn 1.25x wide at the bridge
export const KHWAE_NOI: P[] = [[-23.9, 39.4], [-23.3, 34.4], [-24.1, 30.7], [-26.8, 26.3], [-25.3, 24.5], [-22.7, 22.8], [-7.2, 10.6], [-5.9, 8.1], [-5.5, 2.6], [-4.2, 1.1]];
export const KHWAE_NOI_W = 1.6;
export const MAE_KLONG: P[] = [[-4.2, 1.1], [-2.2, 2.2], [-0.7, 5.2], [1.1, 12.4], [0.9, 17.6], [3.7, 24.4], [10.0, 28.7], [23.2, 31.4]];
export const MAE_KLONG_W = 3.2;

// the Kanchanaburi line: from the SE edge past the station, west to the Kwai bridge, then SSW along the
// west bank of the Khwae Yai and across the Khwae Noi at Tha Kilen (-29, 27)
export const RAIL: P[] = [
  [45.1, 33.6], [-5.5, -16.0], [-17.7, -27.9], [-20.6, -29.2], [-24.0, -29.1], [-27.0, -27.4], [-28.8, -24.4], [-29.9, -22.2],
  [-31.3, -19.2], [-31.4, -16.1], [-26.1, 7.7], [-23.9, 17.2], [-23.9, 19.6], [-24.8, 22.3], [-28.8, 27.2],
];
export const BRIDGE: P = [-29.0, -23.6]; // the Kwai bridge (14.041, 99.504)
export const BRIDGE_YAW = Math.atan2(-29.9 + 28.8, -22.2 + 24.4); // the line's bearing over the bridge
export const STATION: P = [-6.0, -16.1];
export const DON_RAK: P = [-5.7, -13.3];
export const CHONG_KAI: P = [-17.5, 16.0];
export const NEW_HALL: P = [19.0, 16.9];
export const OLD_HALL: P = [-0.3, 1.3];
export const PAPER_MILL: P = [0.4, 1.5];
export const MARKET: P = [-3.4, -2.6]; // ถ.ปากแพรก and the Siri-osot shop, at the wall's NW end (approximate)
export const PIER: P = [-3.3, 1.3]; // the old landing and today's Skywalk, at the confluence
export const WAT_YUAN: P = [-3.8, -3.9];
export const M81_END: P = [27.2, -72.3]; // 7.7 km NNE: off the tile, the road leaves at the north edge
// Lat Ya (17.9 km NW) and Khao Chon Kai are far off the tile: drawn at its NW corner as a far place
export const LAT_YA: P = [-40, -38];
// the legend-scale cover bridge sits on the real site and is shown only on the cover and in the finale
export const HERO_K = 7; // the cover bridge is 7x the real one
