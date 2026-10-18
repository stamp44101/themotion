// World origin = centre of บึงแก่นนคร (provisional 16.4180, 102.8320), 80 m/unit, +x east,
// -z north. PROVISIONAL: these pins are from memory, not Google Maps, until issue #46 brings
// real ones (docs/briefs/khonkaen.md §5a). Replace every one before the clip is posted.
export const LAKE: [number, number] = [0, 0]; // บึงแก่นนคร (formerly บึงบอน)
export const STUPA: [number, number] = [7.7, -0.4]; // พระมหาธาตุแก่นนคร, วัดหนองแวง, east shore
export const STATION: [number, number] = [-11.3, -20.7];
export const CENTRAL: [number, number] = [-8, -20];
export const THUNG_SANG: [number, number] = [22, -26]; // บึงทุ่งสร้าง (real 32, -35.9: pulled in with KKU so their bearing holds)
export const MITTRAPHAP_X = -17.4; // ถนนมิตรภาพ runs north-south west of the old town
export const RAIL_X = -13.6;
// far places, pulled onto the tile by direction
export const KKU: [number, number] = [-12, -45]; // 6.3 km N (real -12.4, -78.2)
export const DAM: [number, number] = [-26, -42]; // เขื่อนอุบลรัตน์, ~45 km NNW (bearing ~330)
export const PHU_WIANG: [number, number] = [-46, -30]; // ~70 km WNW (bearing ~300)

// บึงแก่นนคร: about 1 km across, drawn as a closed shoreline
export const LAKE_PATH: [number, number][] = Array.from({length: 14}, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return [+(6.2 * Math.cos(a) + 0.6 * Math.sin(3 * a)).toFixed(2), +(4.6 * Math.sin(a) + 0.4 * Math.cos(2 * a)).toFixed(2)] as [number, number];
});
// the old town: no wall was ever built (Bueng Bon raised to a town in 1797). This outline is
// only the town ground round the lake's north shore up to the railway quarter.
export const TOWN: [number, number][] = [
  [-13, 6],
  [11, 6],
  [13, -6],
  [7, -23],
  [-11, -23],
  [-15, -8],
];
