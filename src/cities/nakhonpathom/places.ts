// Real positions (docs/briefs/nakhonpathom_onep/README.md, PR #76; Gemini's §4 in
// docs/briefs/nakhonpathom_research_gemini.md): world units from Phra Pathom Chedi (OSM way 260617833,
// 13.819673, 100.060078) at 80 m/unit, +x east, +z south. Pure data so actors.ts, timeline.ts, geo.ts
// and Landmarks.tsx share it.
// No ONEP old-town zone and no Dvaravati moat in OSM: an open town round the chedi on an east-west
// strip (the palace and Silpakorn west, the canal and the line north, Phra Prathon east). The tile is
// centred east of the chedi so both ends fit.
// The chedi is drawn at ~4x true size between the cover and the payoff (H_MID, timeline.ts) so it
// reads as the town's centre; the things round it are pushed out to clear it (real distances in the
// comments): directions are kept (geo.ts, check_story), distances near the centre are stretched.
type P = [number, number];
export const M_PER_UNIT = 80;

export const CHEDI: P = [0, 0]; // องค์พระปฐมเจดีย์ (origin)
// the temple square inside the four roads (หน้าพระ ซ้ายพระ ขวาพระ หลังพระ), ~485 m a side, drawn
// round the 4x chedi's square terrace
export const TEMPLE_HALF = 6.4;
// the Southern Line runs E-W 553 m north of the chedi; drawn 840 m out to clear the canal and market
export const RAIL_Z = -10.5;
// สถานีนครปฐม, OSM node 259729390 (553 m N): on the north side of the line
export const STATION: P = [-4.6, -13.1];
export const PALACE: P = [-21, -1.1]; // พระราชวังสนามจันทร์, OSM way 96936815 (1.6 km W, 13 ha)
export const SILPAKORN: P = [-29, 2.6]; // ม.ศิลปากร วิทยาเขตพระราชวังสนามจันทร์, OSM way 220825148 (2.2 km W)
export const PRATHON: P = [49.8, 6.4]; // พระประโทณเจดีย์, OSM way 1227287978 (4.0 km E)
// ถนนราชดำเนิน (ถนนต้นสน): straight from the chedi's west side to the palace's east gate (1908)
export const RATCHADAMNOEN: P[] = [[-6.8, -0.6], [-17.6, -0.9]];
// the road from the north viharn over สะพานเจริญศรัทธา (1918) to the station
export const STATION_RD: P[] = [[-0.6, -6.6], [-0.6, -8.6]];
// ตลาดบน / ตลาดล่าง: along the canal north of the chedi, west and east of the station road
export const MARKET_W: P = [-4.2, -8.8];
export const MARKET_E: P = [3.6, -8.8];
// ถนนเพชรเกษม (1950): past the chedi's south side and on east past Phra Prathon
export const PHETKASEM: P[] = [[-39, 13], [-14, 10.4], [12, 10.4], [40, 9.2], [57, 9.6]];
// the payoff's fair ground: the temple square itself (the fair fills it and the roads round it)
export const FAIR: P = [0, 0];

// คลองเจดีย์บูชา (OSM ways 97086356, 618139638, 618139639), 10-16 m wide, drawn 0.7: in from the
// Tha Chin in the east, past the chedi's north side (140 m off, drawn 7.5 to clear the square) and on
// north-west past Wat Phra Ngam. It is drawn in Landmarks.tsx and dug during the canal beat (the
// engine's rivers have no year), so `sites` along it keep everything generated off it.
export const CANAL_W = 0.7;
export const CANAL_PATH: P[] = [
  [57.6, -5.0], [52, -5.6], [48.7, -5.6], [44.9, -5.4], [41.1, -5.2], [37.4, -5.4], [34, -5.6], [31.5, -5.8],
  [28.4, -6.2], [25.5, -6.8], [20.9, -7.2], [16, -7.4], [9, -7.5], [3, -7.5], [-5, -7.6], [-10, -8],
  [-13, -9], [-15, -11], [-18.3, -12.2], [-21, -13], [-23, -14.4], [-23.6, -16.4], [-22.4, -18.6],
  [-21.6, -21], [-22.1, -25], [-23.5, -27.6], [-26.4, -30], [-29.7, -31.4], [-32.7, -31.8],
  [-34.4, -30.4], [-36.2, -28.6], [-39, -27.4],
];
// where the line crosses the canal (a girder bridge is drawn there)
export const RAIL_CANAL_X = -14.5;

// ---- far places: only bearings are kept (geo.ts, far: true)
// เมืองนครไชยศรีเก่า / ตลาดท่านา on the Tha Chin, 13.8 km east, where the canal starts
export const THA_NA: P = [57, -4];
