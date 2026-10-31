// Real positions (docs/briefs/ratchaburi_onep/README.md, PR #78; Gemini's §4 and §6 in
// docs/briefs/ratchaburi_research_gemini.md): world units at 80 m/unit, +x east, +z south, origin
// 13.5445, 99.8295, the middle of the walled town Rama II built on the east (left) bank in 2360.
// The engine's walled city is centred on the origin, so the origin is the wall's, not the old
// temple town's. Pure data so actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it.
type P = [number, number];
export const M_PER_UNIT = 80;

// the Mae Klong: OSM centreline ways 301356780 / 1460457503 (ratchaburi_onep), ~143 m wide through
// town (110-208 m, [local]), drawn 1.8. It comes down from the north, west of the walled town,
// turns east at the bend below Wat Mahathat and leaves the tile to the south-east.
export const RIVER_W = 1.8;
export const RIVER: P[] = [
  [-19.8, -52.5], [-14.8, -44.1], [-9.9, -32.9], [-11.3, -28.5], [-13.4, -24.7], [-15.1, -21.8], [-15.8, -19.6],
  [-15.9, -17.1], [-15.6, -14.5], [-14.8, -12.3], [-13.8, -10.0], [-13.7, -7.2], [-14.8, -2.3], [-15.1, -0.1],
  [-14.3, 2.8], [-12.3, 4.4], [0.7, 3.9], [10.5, 6.9], [17.5, 6.0], [20.8, 6.7], [23.6, 9.6], [25.4, 16.6],
  [27.1, 19.7], [29.1, 21.4], [40.9, 26.5], [45.2, 27.2],
];

// the walled town of 2360 on the east bank (Gemini: 6 forts, 6 gates, ~5-6 sen x 20 sen, i.e.
// ~200-240 x 800 m, along the river). [local] found nothing of it on Esri z18 over today's
// Phanurangsi camp (README, 89fb533): drawn from the documented size along the north bank of the
// river's eastward reach, from just east of the Southern Line, round the city pillar. Approximate.
// The engine draws the corner forts at +-hx, +-hz, so the outline is kept centred on the origin.
export const WALL: P[] = [[-5.6, -2], [5.6, -2], [5.6, 2], [-5.6, 2]];
// ศาลเจ้าพ่อหลักเมืองราชบุรี, OSM node 2408582421 (13.54412, 99.82548, i.e. [-5.4, 0.5]), drawn
// 40 m in so it stands inside the wall's west end
export const PILLAR: P = [-4.9, 0.5];

// the old west-bank town (Jayarajapuri - Ayutthaya), round Wat Mahathat
export const MAHATHAT: P = [-21, -2.8]; // the prang, OSM node 2578808283
// Koi Ki: the Chinese riverside market on Worradet Rd, south bank of the eastward reach (Gemini
// 13.5402, 99.8218: drawn ~200 m further from the water so the jar fountain fits on the river wall)
export const KOIKI: P[] = [[-15, 8.6], [-8.4, 8.6]];
// the giant dragon-jar fountain on the Ratthaprachaphatthana river wall in front of Koi Ki (2565)
export const FOUNTAIN: P = [-11.4, 6.6];
// the pink monthon hall (2465), today the national museum, OSM relation 12906115
export const OLD_HALL: P = [-16.4, 5.6];
// the Southern Line runs N-S 0.6 km west of the wall and crosses the river on the black bridge
export const RAIL_X = -7.2;
export const STATION: P = [-8.6, 20.2]; // OSM node 259729391, on the west side of the track
// the kiln quarter on the Chedi Hak road, west of the old town (Tao Hong Tai, OSM node 4585665489,
// [-33.7, -0.1]); the first kiln's site is not known (ไม่พบ), the quarter stands for it
export const KILNS: P = [-31, -1.4];
// the jar landing where the jar boats load: just downstream of the rail bridge, so no loaded boat
// passes under its deck (CLAUDE.md "a boat never passes under a deck lower than itself"; the black
// bridge's deck is drawn near the water, [local]'s stills review). The boats start in the water here
// and the stacked jars wait on the bank behind it.
export const LANDING: P = [-4.6, 4.3];
export const NEW_HALL: P = [-22.1, 21.2]; // the provincial hall since 2525, OSM way 951493985
// ถนนเพชรเกษม (2493): in from the north-east, over the river at the Phetkasem bridge, on south-west
export const PHETKASEM: P[] = [[44, -16], [10, -12], [-13.6, -8.8], [-24, -7], [-33, 8], [-42, 30], [-46, 48]];
// distances along RIVER from its first point (for the engine's bridges)
export const PHETKASEM_AT = 47.8;
export const BYPASS_AT = 91.3;
// the bypass (2543): north-south east of the town
export const BYPASS: P[] = [[17, -48], [16.4, -10], [16.2, 6.1], [13, 30], [10, 48]];

// the cover's giant jar stands on the west bank fields south of the bend (style frame A1)
export const HERO: P = [-24.9, 12.7];

// the Thai Yuan's road south: down the west bank from the north edge to Khu Bua off the south edge
export const YUAN_ROAD: P[] = [[-27, -48], [-25, -24], [-23, -10], [-28, 4], [-24, 20], [-14, 32], [-4, 44]];

// ---- far places: only bearings are kept (geo.ts, far: true)
// เมืองโบราณคูบัว and the Thai Yuan village, 6-8 km south (OSM node 5583402621)
export const KHU_BUA: P = [-2, 45];
