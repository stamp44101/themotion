// Real positions (docs/briefs/lopburi_onep/README.md: the ONEP old-town polygon and the OSM
// features the workstation pulled for PR #67). World origin = the polygon's centroid,
// 14.800683, 100.612775. **40 m/unit** (not the usual 80): everything Lopburi's story needs
// (the prang, ศาลพระกาฬ, the railway between them, Narai's palace, the station) lies within
// ~600 m, which at 80 m/unit would put the prang and the shrine 1.5 units apart with a railway
// between. +x east, +z south. Pure data so actors.ts, timeline.ts and geo.ts share it.
type P = [number, number];

// ---- the old town (ONEP record 48, เมืองเก่าลพบุรี, 1.70 km2), simplified to 27 points; its
// west edge is on the far bank: the river runs through the zone
export const OLD_TOWN: P[] = [
  [-11.7, -10.3], [-10.5, -13.2], [-9.7, -19.1], [-1.6, -19.4], [7.0, -18.3], [10.2, -16.8], [12.9, -13.4],
  [14.6, -6.4], [15.9, -4.9], [15.4, -1.3], [16.6, 10.6], [16.1, 13.4], [19.6, 14.0], [19.1, 17.7], [18.1, 19.1],
  [10.3, 17.3], [-1.4, 16.7], [-6.0, 14.0], [-8.9, 10.1], [-13.5, 10.9], [-18.3, 9.9], [-19.9, 8.6],
  [-22.8, 8.5], [-21.7, 4.0], [-19.0, 2.0], [-18.5, -2.5], [-14.7, -9.9],
];

// ---- the Khmer and older monuments (OSM, within 30 m of the research's pins)
export const PRANG: P = [3.5, -6.2]; // พระปรางค์สามยอด, Bayon style, Jayavarman VII
// ศาลพระกาฬ: OSM [6.1, -4.4]; drawn 0.9 further east so it stands clear of the railway, which the
// engine lays straight north-south (the real line leans ~12 degrees; bearing from the prang 119
// against the real 125)
export const SAN_PHRA_KAN: P = [7.0, -4.4];
export const PRANG_KHAEK: P = [-2.9, -4.5]; // ปรางค์แขก, the oldest Hindu shrine (9th-10th c.)
export const WAT_MAHATHAT: P = [3.1, 5.6]; // วัดพระศรีรัตนมหาธาตุ, OSM site centre (the research's pin was 92 m off)
export const WAT_NAKHON_KOSA: P = [7.4, -1.4]; // วัดนครโกษา, a Dvaravati stupa base

// ---- Narai's palace (OSM way 1539990196, the closed wall ring, ~310 x 245 m) and the halls
export const PALACE = {x0: -9.7, x1: -1.9, z0: -0.3, z1: 5.8};
export const DUSIT: P = [-7.4, 2.8]; // พระที่นั่งดุสิตสวรรค์ธัญญมหาปราสาท
export const SUTTHA: P = [-7.3, 4.3]; // พระที่นั่งสุทธาสวรรย์, where Narai died
export const PHRA_CHAO_HAO: P = [-3.7, 4.9]; // ตึกพระเจ้าเหา
export const RECEPTION: P = [-3.8, 2.3]; // ตึกเลี้ยงรับรองแขกเมือง, with the fountains
export const PHIMAN: P = [-5.6, 1.6]; // พระที่นั่งพิมานมงกุฎ, Rama IV (inside the wall; drawn between the halls)
export const VICHAYEN: P = [-6.9, -6.6]; // บ้านวิชาเยนทร์ / บ้านหลวงรับราชทูต
export const SAN_PAOLO: P = [18.3, 15.7]; // วัดสันเปาโล and its octagonal observatory tower
// ประตูชัย, south: OSM [4.3, 15.1]; drawn 1.7 west because the engine's straight north-south track
// passes 0.9 from it here, where the real line, leaning ~12 degrees, runs ~5 units east of it
export const PRATU_CHAI: P = [2.6, 15.1];
export const POM_THA_PHO: P = [-0.9, -18.1]; // ป้อมท่าโพธิ์, on the river at the north
export const POM_CHAI_CHANA: P = [12.5, 15.8]; // ป้อมชัยชนะสงคราม, south-east

// ---- แม่น้ำลพบุรี: 52-62 m at the palace, 72 m south (OSM riverbank way 196480898), drawn 1.8. OSM centreline (ways 571946579,
// 986386580) /40: in from the west along the north edge, turning at the north-west corner and
// running SSW past the palace; extended to the tile edges
export const RIVER: P[] = [
  [-56, -14], [-34, -14], [-19.4, -15.05], [-16.4, -15], [-14.1, -14.55], [-12.8, -13.4], [-11.6, -11.5],
  [-11.15, -9.8], [-11.9, -7], [-13.3, -2], [-14.6, 4.35], [-16.45, 13.6], [-19.35, 23.5], [-23, 36], [-26, 56],
];
export const RIVER_W = 1.8;
export const riverX = (z: number) => {
  for (let i = 8; i < RIVER.length - 1; i++) {
    const [x0, z0] = RIVER[i];
    const [x1, z1] = RIVER[i + 1];
    if (z >= z0 && z <= z1) return x0 + ((x1 - x0) * (z - z0)) / (z1 - z0);
  }
  return z < RIVER[8][1] ? RIVER[8][0] : RIVER[RIVER.length - 1][0];
};

// ---- the Northern Line (1 เม.ย. 2444): OSM runs NNE through the town, ~130 m east of the prang
// and beside ศาลพระกาฬ; the engine lays it straight north-south between the two
export const RAIL_X = 5.2;
// สถานีลพบุรี, OSM [6.7, 5.9]; set 2.6 off the line, where the engine would put it
export const STATION: P = [7.8, 5.9];

// ---- outside the old town
export const ARMY: P = [25.7, -14.4]; // ค่ายสมเด็จพระนารายณ์มหาราช, 2480
// the new town: วงเวียนสระแก้ว is 2.3 km east (x 57.6), off the tile; the tile's east edge stands in
export const NEW_TOWN: P = [34, 2];
// ทะเลชุบศร and พระที่นั่งเย็น, 3.7 km east-north-east: off the tile; the pipes come in from its edge
export const THALE_CHUP_SON_TRUE: P = [86.7, -31.5];
export const PIPE_FROM: P = [47, -17];
