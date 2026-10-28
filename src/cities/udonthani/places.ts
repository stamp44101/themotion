// Real positions (docs/briefs/udonthani_onep/README.md, PR #74; Gemini's pins in
// docs/briefs/udonthani_research_gemini.md §4): world units from the city pillar shrine (OSM node
// 13245284100, 17.4136718, 102.78775) at **70 m/unit**, so the 7 km city of today fills the tile.
// +x east, +z south. Pure data so actors.ts, timeline.ts, geo.ts and Landmarks.tsx share it.
// Udon has no ONEP old-town zone (no wall, no moat): the town is the camp beside the lake.
type P = [number, number];
export const M_PER_UNIT = 70;

// ---- หนองประจักษ์ (หนองนาเกลือ), OSM relation 1609427: 760 m E-W x 1,110 m N-S, bbox x -14.1..-3.3,
// z -13.6..2.1. Traced as a smooth outline (the park's island is drawn in Landmarks.tsx)
export const LAKE_C: P = [-8.7, -5.8];
export const LAKE_PATH: P[] = [
  [-8.2, -13.6], [-5.6, -12.4], [-4.0, -9.6], [-3.4, -6.2], [-3.6, -2.6], [-4.6, 0.4], [-6.6, 2.0], [-9.2, 2.1],
  [-11.6, 0.8], [-13.2, -1.8], [-14.1, -5.2], [-13.8, -8.8], [-12.4, -11.6], [-10.4, -13.4],
];
// discs covering the lake, for sites / clearings
export const LAKE_DISCS: [number, number, number][] = [
  [-8.8, -10.8, 3.6], [-8.8, -6.6, 4.8], [-8.6, -2.2, 4.4], [-8, 0.6, 2.6],
];

// ---- pins
export const PILLAR: P = [0, 0]; // ศาลหลักเมือง (origin)
export const HALL: P = [-0.5, -2.5]; // ศาลากลางจังหวัด (OSM relation 9300032)
export const FIELD: P = [3.4, 2.6]; // ทุ่งศรีเมือง, south-east of the hall (the fair ground)
// the 1893 camp on the lake's east shore, toward Wat Matchimawat (Gemini §1: ด้านทิศตะวันออกของหนองฯ)
export const CAMP: P = [-1.2, -6.5];
export const MATCHIMA: P = [9.2, 0.9]; // วัดมัชฌิมาวาส (วัดโนนหมากแข้ง)
export const PHO_SI: P = [-14, 11.6]; // วัดโพธิสมภรณ์
export const RACHINU: P = [-4.2, 3.4]; // อาคารราชินูทิศ (1925, today the city museum)
export const MONUMENT: P = [9.4, 14.8]; // พระอนุสาวรีย์กรมหลวงประจักษ์ฯ, the five-way roundabout (OSM node 757352767)
export const CLOCK: P = [19.4, 16.1]; // วงเวียนหอนาฬิกา
export const CENTRAL: P = [18.3, 12.4]; // เซ็นทรัล อุดรธานี (เจริญศรีคอมเพล็กซ์เดิม)
// the north-eastern line: the station (OSM node 675458495) at (27.0, 15.0). The real line bends
// NNW north of town and SE south of it; the engine's rail is straight, drawn N-S through the station
export const RAIL_X = 27;
export const STATION: P = [24.4, 15];
export const UD_TOWN: P = [31.2, 12.1]; // ยูดี ทาวน์, beside the station (east of the line)
export const PUYA: P = [29.8, 23]; // ศาลเจ้าปู่-ย่า, by หนองบัว behind the station
export const NONG_BUA: P = [33.6, 24]; // หนองบัว (small lake)
// กองบิน 23 / the airport, ~3 km south of the hall; the runway runs 12/30 (drawn shortened)
export const AIRFIELD: P = [2, 42];
export const RUNWAY_ROT = (30 * Math.PI) / 180; // runway heading from the +x axis, toward the north-west

// ---- far places: only bearings are kept (geo.ts, far: true)
// แหล่งโบราณคดีบ้านเชียง, 50 km due east: the cover's jar stands on the tile's east side
export const BAN_CHIANG: P = [42, 2];
// the road down from Nong Khai (north) that the 1893 column came by
export const NORTH_TRACK: P[] = [
  [3, -50], [2.4, -36], [1.2, -24], [0.4, -14], [-0.6, -8.2],
];
