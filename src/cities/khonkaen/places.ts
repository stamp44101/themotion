// World origin = water centroid of บึงแก่นนคร (16.41304, 102.83739; measured off satellite in
// #46, Google's label pin sits at the lake's north end), 80 m/unit, +x east, -z north.
// Pins from issue #46 / docs/briefs/khonkaen.md, placed with scripts/geo.mjs.
export const LAKE: [number, number] = [0, 0]; // บึงแก่นนคร (formerly บึงบอน)
// พระมหาธาตุแก่นนคร, วัดหนองแวง, at the lake's south-west corner (real -4.2, 5.0: nudged
// 0.8 west so the exaggerated nine-tier base stands on the shore, not in the lake)
export const STUPA: [number, number] = [-5, 5.4];
export const PILLAR: [number, number] = [-11.9, -24.9]; // ศาลหลักเมือง
export const STATION: [number, number] = [-15.5, -18.9];
export const CENTRAL: [number, number] = [-15, -27.8];
export const RAIL_X = -13; // the Korat - Nong Khai line, east of the station
// ถนนมิตรภาพ runs past the city's WEST side, not through the old core (OSM ways 1552214095
// south [-34.4, 32.4] to 1550208013 north [-6.7, -145.9]): x as a function of z
export const mittraphapX = (z: number) => -34.4 + (z - 32.4) * ((-6.7 + 34.4) / (-145.9 - 32.4));
// off-tile places pulled in along their bearing
export const THUNG_SANG: [number, number] = [13.1, -35]; // บึงทุ่งสร้าง (real 18.7, -50.0) x 0.7
export const KKU: [number, number] = [-10.5, -43]; // 7.0 km N, bearing 346 (real -20.5, -84.8)
// far places: only their bearing from the centre (and between each other) is kept
export const DAM: [number, number] = [-30, -34]; // เขื่อนอุบลรัตน์, 46 km, bearing 330 (model 319; dam -> dig 256, model 235)
export const PHU_WIANG: [number, number] = [-47.5, -32]; // ภูเวียง range (national park pin), 72 km, bearing 296 (model 304)
// หลุมขุดค้นที่ 1 ภูประตูตีหมา, where the first bone was found on 20 Jul 1976 (#46), inside the
// range: drawn on its eastern foot because the range stands at the tile edge
export const DIG: [number, number] = [PHU_WIANG[0] + 6, PHU_WIANG[1] + 6];

// บึงแก่นนคร: 1,418 m north-south, 553 m wide at the median row and 731 m at the widest,
// 0.60 km2 of open water (#46). Narrower toward the south, where the stupa stands.
export const LAKE_PATH: [number, number][] = [
  [0.3, -8.9], [2.6, -7.2], [4.0, -4.5], [3.7, -1], [3.2, 2], [2.4, 4], [1.8, 6], [0.9, 7.8],
  [0, 8.9], [-0.9, 7.8], [-1.8, 6], [-2.4, 4], [-3.2, 2], [-3.7, -1], [-4.4, -4.5], [-2.6, -7.2],
];
// circles covering the lake, for sites / clearings
export const LAKE_DISCS: [number, number, number][] = [
  [0, -6.5, 3.4], [0, -3, 4.6], [0, 1, 4], [0, 4.5, 3], [0, 7.4, 1.8],
];
// the old town: no wall was ever built (Bueng Bon raised to a town in 1797, no ONEP old-town
// zone exists). Town ground = the lake's west and north-west shore up to the station quarter.
export const TOWN: [number, number][] = [
  [-3, 9],
  [-4.5, -4],
  [-1, -10],
  [-6, -25],
  [-19, -25],
  [-20, -8],
  [-11, 10],
];
