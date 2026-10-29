// Real positions (docs/briefs/nakhonpathom_onep/README.md, PR #76; Gemini's pins in
// docs/briefs/nakhonpathom_research_gemini.md §4): world units from Phra Pathom Chedi (OSM way
// 260617833, 13.819673, 100.060078) at 80 m/unit. +x east, +z south. Pure data so actors.ts,
// timeline.ts, geo.ts and Landmarks.tsx share it.
// Nakhon Pathom has no ONEP old-town zone and OSM has no Dvaravati moat: the town is open, round the
// chedi, on an east-west strip (the palace and Silpakorn west, the canal and the line north, Phra
// Prathon east). The tile is centred east of the chedi so both ends fit: x -39..57.
type P = [number, number];
export const M_PER_UNIT = 80;
export const TILE_CX = 9;

// ---- pins (OSM unless noted)
export const CHEDI: P = [0, 0]; // องค์พระปฐมเจดีย์, way 260617833 (origin)
export const MUSEUM: P = [1.3, 1.7]; // พิพิธภัณฑสถานแห่งชาติพระปฐมเจดีย์, node 1121030565
// the temple square inside the four roads (หน้าพระ, ซ้ายพระ, ขวาพระ, หลังพระ): ~485 m a side (Gemini §4.1)
export const TEMPLE_HALF = 3;
export const STATION: P = [-1.8, -6.7]; // สถานีรถไฟนครปฐม, node 259729390
export const RAIL_Z = -6.7; // the Southern Line runs E-W through the station (z -6.3 west .. -8.4 east)
export const PALACE: P = [-19.5, -1.1]; // พระราชวังสนามจันทร์, way 96936815 (13 ha)
export const PALACE_HALT: P = [-25.3, -5.8]; // ที่หยุดรถไฟสนามจันทร์, node 8106124445
export const SILPAKORN: P = [-27.2, 2.4]; // ม.ศิลปากร วิทยาเขตพระราชวังสนามจันทร์, way 220825148
export const PRATHON: P = [49.8, 6.4]; // พระประโทณเจดีย์, way 1227287978: the Dvaravati town's centre
// Ratchadamnoen road (ถนนต้นสน), straight from the chedi west to the palace's east gate
export const RATCHADAMNOEN: P[] = [[-3, -0.6], [-16.4, -0.9]];

// ---- คลองเจดีย์บูชา (OSM ways 97086356, 618139638, 618139639), 10-16 m wide: it comes in from the
// Tha Chin in the east, passes ~140 m north of the chedi and runs on north-west past Wat Phra Ngam
export const CANAL_PATH: P[] = [
  [57.6, -3.3], [52.3, -5.2], [48.7, -6.1], [44.9, -6.4], [41.1, -5.9], [37.4, -6.5], [34.1, -6.5],
  [31.5, -6.1], [28.4, -4.0], [25.5, -1.8], [23.6, -1.2], [20.9, -1.6], [16.1, -2.2], [9.2, -2.0],
  [2.8, -1.7], [2.1, -3.6], [-4.8, -4.2], [-10.4, -4.4], [-12.3, -5.8], [-14.5, -8.2], [-18.3, -9.3],
  [-21.0, -9.6], [-23.0, -11.2], [-23.6, -13.3], [-22.4, -15.8], [-21.6, -18.2], [-22.1, -23.3],
  [-23.5, -26.3], [-26.4, -29.3], [-29.7, -30.9], [-32.7, -31.6], [-34.4, -30.2], [-36.2, -28.2],
  [-38.3, -27.0], [-39.5, -27.6],
];

// ---- far places: only bearings are kept (geo.ts, far: true)
// เมืองนครไชยศรีเก่า / ตลาดท่านา on the Tha Chin, 13.8 km east, where the canal starts
export const THA_NA: P = [57, 4];
