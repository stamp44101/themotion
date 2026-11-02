// Real positions ([local]'s map, docs/briefs/suratthani_onep/README.md, PR #81, a67d83d; Gemini's §4 and
// §6 in docs/briefs/suratthani_research_gemini.md): world units at 150 m/unit, +x east, +z south, origin
// the city pillar shrine (ศาลหลักเมืองสุราษฎร์ธานี, OSM way 167081575, 9.13919, 99.32170). Ban Don never
// had a wall; the engine's `city` box is the riverside old town east of the pillar (ถ.หน้าเมือง, the
// market), which fills only after the shipyard (~2375) and Tha Thong's move (Rama IV). Pure data so
// actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it.
type P = [number, number];
export const M_PER_UNIT = 150;

// the Tapi's town arm (OSM 557048595 via [local]), Douglas-Peucker at 50 m: it comes in from Tha Kham
// at the tile's west edge, winds east to Ban Don, turns NNE at the pillar and runs out to Bandon Bay.
// 105-190 m wide by the pillar, 250-450 m in the last 3 km ([local]); drawn as two rivers so the lower
// reach can be wider: upstream 1.5 (225 m), from the pillar down 2.4 (360 m).
export const TAPI_UP: P[] = [
  [-62, 18.4], [-58.9, 17.6], [-51.8, 17.5], [-50.2, 16.7], [-48.4, 13.8], [-47.3, 8.1], [-45.1, 3.6],
  [-41.8, 1.6], [-37.1, 1.8], [-33.0, 2.9], [-29.6, 5.4], [-27.7, 7.5], [-25.9, 8.1], [-24.5, 7.4],
  [-20.4, 2.3], [-16.3, 0.6], [-11.3, 1.0], [-5.6, 2.9], [-3.8, 2.4], [-0.5, -0.9], [0.7, -4.6],
];
export const TAPI_UP_W = 1.5;
export const TAPI_DOWN: P[] = [[0.7, -4.6], [8.3, -19.2], [12.3, -22.0], [20.5, -21.5], [21.7, -22.0], [27.8, -27.3], [32.0, -32.1], [38.0, -37.0], [44.0, -43.5]];
export const TAPI_DOWN_W = 2.4;
// the narrow channel north of Ko Lamphu (the main channel runs south of it, by the town bank): the
// island (OSM way 242787629, 650 x 350 m) is the land between the two
export const LAMPHU_CH: P[] = [[-8.4, 1.9], [-6.6, -0.5], [-3.6, -0.7], [-1.0, -1.6]];
export const LAMPHU_CH_W = 0.6;
export const KO_LAMPHU: P = [-4.6, 0.8];

// Bandon Bay: OSM natural=coastline ([local]), the coast north of the town 8-9 km out at the mouth's
// latitude. The engine's water is a band, so the bay is one wide path whose south edge follows the
// coast (its centre 9 units north of it) plus a band beyond it.
export const COAST: P[] = [
  [-64, -63], [-46, -64.5], [-37, -59.3], [-30, -64], [-20, -64], [-4, -61], [2, -59.7], [9, -62.5], [14, -54], [24, -55],
  [29.5, -50], [31, -44.5], [38, -43], [42, -40.2], [47, -40.5], [56, -45.5], [64, -48],
];
export const SEA_W = 18;
export const SEA_PATH: P[] = COAST.map(([x, z]) => [x, z - SEA_W / 2 + 0.2]);

// ---- Ban Don, the town on the Tapi's south-east bank
export const PILLAR: P = [0, 0];
// ท่าเทียบเรือบ้านดอน (the night-ferry pier, OSM node 2502419676): the old landing where Rama VI's barge
// came in on 28 Jul 2458 (Gemini §6 puts the royal landing and the old riverfront hall here)
export const LANDING: P = [1.0, -3.2];
// สะพานนริศ: the steamer "Narit"'s pier at the mouth of Khlong Makham Tia, the Chak Phra embankment
export const NARIT: P = [2.4, -5.0];
// the old Chinese market and the Kuan U shrine (ตลาดศาลเจ้า / ศาลเจ้ากวนอู), Google
export const SHRINE: P = [5.4, -2.9];
export const MARKET: P = [3.1, -4.8];
// ตลาดล่าง, the lower market downstream (an area, Google)
export const TALAT_LANG: P = [7.8, -12.2];
// the Rama III shipyard (โรงอู่ต่อเรือรบหลวง, ~2375) on the right bank: no pin survives (Gemini, [local]);
// drawn on the town bank just below the landing, where the market grew over it
export const SHIPYARD: P = [4.6, -9.6];
// the provincial hall on ถ.ดอนนก (after 2525), Google
export const NEW_HALL: P = [7.7, 4.7];
// the Chak Phra / long-boat reach, the embankment by Ko Lamphu ([local], approximate)
export const RACE: P = [-2.2, 1.8];
// สะพานศรีสุราษฎร์ (1 Oct 2556) over the mouth reach, and สะพานศรีตาปี (29 Jul 2562) by the pillar
export const SRI_SURAT: P = [24.6, -24.6];
export const SRI_TAPI: P = [-0.9, -0.6];

// ---- far places: only bearings are kept (geo.ts, far: true)
// Chaiya and Phra Borommathat Chaiya, 31 km NW (bearing 331): drawn on the bay's west shore at the
// tile's north-west, with Laem Pho's beach in front of it
export const CHAIYA: P = [-40, -55];
export const LAEM_PHO: P = [-33, -57.5];
// Tha Kham: the Chulachomklao rail bridge over the Tapi (11.2 km W, bearing 255) at the tile's west
// edge; the Southern Line drawn north-south through it, Phun Phin station (10.7 km W, 249) south-east of it
export const RAIL_X = -57;
export const THA_KHAM: P = [RAIL_X, 17.6];
export const STATION: P = [-54.4, 24.5];
// Tha Thong / Kanchanadit, 27.6 km E (bearing 69): the old town's boats come in along the coast from
// the tile's east edge
export const THA_THONG_IN: P = [64, -40];
// the oyster farms (ขนำ) off the mouth, Bandon Bay (Gemini §6, 9.255, 99.485: NE)
export const OYSTERS: P = [44, -52];
// the ferries to Samui leave NE (Don Sak 51 km NE, Nathon 80 km NE)
export const SAMUI_OUT: P = [64, -62];

// the cover: a coconut palm on the west bank of the lower reach, leaning ESE out over the river so its
// coconut drops into the water (the hero stands across the river from the town-to-be)
export const PALM_BASE: P = [-3.0, -12.1];
/** where the palm's crown hangs over the river (the river centreline) */
export const PALM_OVER: P = [3.0, -9.0];
/** the callback palm on the west bank opposite Saphan Narit, over the Chak Phra boats */
export const PALM2: P = [-0.6, -7.4];

// ---- roads
// ถ.หน้าเมือง along the bank, ถ.ชนเกษม south, ถ.ตลาดใหม่ east, the road west to Tha Kham (ถ.ราษฎร์บำรุง /
// Route 401) and the ring road (Route 420) round the south: drawn by their real lines, compressed
export const NA_MUEANG: P[] = [[-2.6, 3.4], [0.6, 0.6], [2.2, -3.4], [5.0, -8.6], [8.6, -13.6]];
export const CHON_KASEM: P[] = [[1.0, 1.0], [5.5, 4.0], [10.5, 5.5]];
export const TALAT_MAI: P[] = [[3.4, -3.0], [9.0, 0.0], [16.0, 2.5], [24.0, 4.0]];
export const TO_THA_KHAM: P[] = [[-2.6, 3.4], [-12, 6.5], [-24, 11.5], [-36, 12.5], [-46, 19], [-52.6, 21.6]];
export const RING: P[] = [[-14, 24], [0, 22], [14, 18], [26, 8], [30, -6], [33, -18]];
