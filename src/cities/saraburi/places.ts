// Real positions ([local]'s pull, docs/briefs/saraburi_onep/README.md, PR #80; Gemini's §4 and §6
// in docs/briefs/saraburi_research_gemini.md): world units at 100 m/unit, +x east, +z south, origin
// the city pillar shrine (ศาลหลักเมืองสระบุรี, OSM node 5589680721, 14.52893, 100.90899). Saraburi
// never had a wall (Sao Hai had none either, Gemini/[local]); the engine's `city` box is Pak
// Phriao's riverside town between the Pa Sak and the railway, which the seat moved to after the
// train (2440). Pure data so actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it.
type P = [number, number];
export const M_PER_UNIT = 100;

// the Pa Sak: OSM ways 40268412 + 40268414 from Pak Phriao (east, upstream) to Sao Hai (west),
// 64-95 m wide (median 76, [local]), drawn 1.0. The three points east of Pak Phriao are not in
// [local]'s pull: drawn north-east toward Kaeng Khoi, ~2 units north of the railway's real line by
// the new provincial hall (README: "within 180 m"); the two west of Sao Hai continue its heading.
export const RIVER_W = 1.0;
export const RIVER: P[] = [
  [31, -15.6], [23, -10.5], [18.5, -6.2],
  [14.6, -4.1], [13.2, -3.0], [12.4, -2.6], [8.0, -3.1], [6.8, -3.1], [5.4, -2.7], [3.9, -2.1], [2.7, -1.6], [1.8, -1.5],
  [0.6, -1.8], [-0.9, -2.3], [-1.6, -3.1], [-4.3, -8.3], [-5.3, -9.5], [-6.4, -10.7], [-7.6, -11.3], [-8.9, -11.7],
  [-10.4, -12.0], [-12.1, -11.9], [-13.3, -12.1], [-14.1, -12.5], [-14.4, -13.1], [-14.3, -13.7], [-13.7, -14.4],
  [-12.6, -15.0], [-12.2, -15.2], [-9.8, -16.1], [-8.7, -16.8], [-8.1, -17.4], [-8.1, -18.0], [-8.4, -18.7],
  [-10.3, -19.8], [-12.1, -20.7], [-12.9, -20.6], [-13.8, -19.7], [-16.8, -16.9], [-17.5, -16.7], [-18.1, -17.1],
  [-19.5, -18.9], [-21.9, -20.9], [-22.6, -21.8], [-22.9, -23.2], [-23.5, -26.3], [-23.8, -27.9], [-24.3, -28.6],
  [-25.1, -28.9], [-25.9, -28.7], [-29.5, -25.0], [-32.9, -23.5], [-34.2, -23.0], [-36.0, -22.8], [-37.9, -23.2],
  [-40.5, -25.2], [-43.2, -26.9], [-43.6, -27.7], [-44.1, -31.0], [-44.6, -32.2], [-45.4, -32.8], [-46.4, -33.0],
  [-48.8, -32.8], [-50.2, -32.2], [-51.6, -29.5], [-52.4, -29.1], [-53.2, -29.0], [-56.0, -30.0], [-57.1, -30.3],
  [-58.2, -30.0], [-62.8, -27.9], [-66.3, -26.8], [-69.0, -25.3], [-69.9, -25.0],
  [-74.5, -23.8], [-80, -22.6],
];

/** distance along a polyline from its first point to the point on it nearest `p` */
export const atAlong = (pts: P[], p: P) => {
  let best = 0;
  let bd = Infinity;
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1];
    const [bx, bz] = pts[i];
    const dx = bx - ax;
    const dz = bz - az;
    const len = Math.hypot(dx, dz);
    const u = Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - az) * dz) / (len * len)));
    const d = Math.hypot(p[0] - ax - u * dx, p[1] - az - u * dz);
    if (d < bd) {
      bd = d;
      best = acc + u * len;
    }
    acc += len;
  }
  return best;
};

// ---- Pak Phriao, the town since the train (2440)
export const PILLAR: P = [0, 0];
// the old provincial hall by the river (today the Mueang district office), Google, 0.1 km SE
export const OLD_HALL: P = [0.9, 0.9];
// Wat Pak Phriao (วัดศรีบุรีรตนาราม), where the Emerald Buddha rested a month in 2321
export const WAT_PAK_PHRIAO: P = [7.2, -1.2];
// the railway (Ayutthaya-Saraburi-Kaeng Khoi opened 1 May 2440): in truth it runs WSW-ENE, ~17
// degrees off east, 450 m south of the river at the pillar, turning NE past the new hall. The
// engine's rail is straight, so it is drawn due east-west through the station's real latitude:
// right in town, up to ~1 km too far north at the tile's west edge, and it leaves due east instead
// of turning north-east toward Kaeng Khoi. It never crosses the Pa Sak on the tile ([local]).
export const RAIL_Z = 2.7;
// Saraburi station (OSM node 5394772572 / Google, 8.1, 1.6). The engine's station is 440 x 600 m at
// this scale and stands 2.6 off the line: on the north side it would reach the river, so it is drawn
// on the south side, east of the Phahonyothin crossing (~400 m from the real building)
export const STATION: P = [10, 4.95];
// Saphan Amnuai Songkhram: Phahonyothin over the Pa Sak (24 Jun 2483), Google 14.53074, 100.91218
export const AMNUAI: P = [3.4, -2.0];
// the road meets the water a little east of the bridge's Google pin: the deck is centred on the crossing
export const AMNUAI_AT = atAlong(RIVER, [3.5, -1.85]);
// the Route 1 / Route 2 fork (OSM shared node), where the Friendship Highway starts
export const FORK: P = [5.9, 8.7];
// ค่ายอดิศร (2496), the cavalry centre, OSM way 614585109
export const ADISORN: P = [17.9, 10.3];
// the new provincial hall at Takut (2562), Google
export const NEW_HALL: P = [26.9, -8.2];

// ---- Sao Hai, the old seat, upriver to the west
// ตลาดร้อยปีเสาไห้ (the rice landing of "ข้าวเจ๊กเชย"), Google 14.55111, 100.84494 is on the bank:
// drawn 170 m back from the water so its row stands on land
export const SAO_HAI_MKT: P = [-68.6, -23.0];
// Wat Sung and the weeping pillar's bend (เสาร้องไห้), Google
export const WAT_SUNG: P = [-66.0, -20.8];
// the town hall at Ban Phai Lom Noi (2433-2440): not found by [local] or Google; drawn in Sao Hai
// beside the market, on the river (approximate)
export const SAO_HAI_HALL: P = [-62.4, -24.6];
// the Thai Yuan of 2347: Ban Ton Tan (its old riverside market) and Wat Samuha Pradittharam /
// Suan Dok Mai - Sarang Sok, Google
export const TON_TAN: P = [-31.7, -27.0];
export const SAMUHA: P = [-54.9, -26.6];

// ---- far places: only bearings are kept (geo.ts, far: true)
// the Footprint and its mondop, Wat Phra Phutthabat, 24.6 km NNW (bearing 328): drawn on a low hill
// in the tile's north-west, with Khao Suwan Banphot's range behind it
export const FOOT: P = [-26, -41];
// the straight road the Dutch surveyed for the king's elephants (Route 3022 today), from Tha Chao
// Sanuk on the Pa Sak (20 km W) to the hill: on the tile it comes in from the west edge
export const FOOT_ROAD: P[] = [[-80, -47], [-52, -44.5], [-31, -41.6]];
// the limestone hills of Kaeng Khoi - Thap Kwang and their cement works, 18 km NE (bearing 48): drawn
// in the tile's north-east corner; the first big works here is SCG Kaeng Khoi (2514)
export const CEMENT: P = [20, -27];
export const CEMENT_HILLS: [number, number, number, number][] = [
  [24, -36, 8, 6],
  [29, -28, 6.5, 5],
  [16, -38, 5.5, 5],
];

// ---- roads
// Phahonyothin (ถนนประชาธิปัตย์ 24 Jun 2483): in from Bangkok to the south-west, through the fork,
// over the Pa Sak on Saphan Amnuai Songkhram, then north-west toward Phra Phutthabat
export const PHAHONYOTHIN: P[] = [[-7, 36], [1, 22], [FORK[0], FORK[1]], [4.6, 2.2], AMNUAI, [2.6, -6], [-2, -22], [-11, -35], [-21, -41.5]];
// the Friendship Highway (opened 10 Jul 2501) from the fork toward Kaeng Khoi and Korat: drawn
// south of the straight rail (in truth both go north-east)
export const MITTRAPHAP: P[] = [FORK, [14, 9.8], [22, 7.2], [31, 4.8]];

// the cover: the legend-scale print lies on the hill's crown where the mondop will stand; the deer
// gallops in from the forest to the west
export const HERO = FOOT;
