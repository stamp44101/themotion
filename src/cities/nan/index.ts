import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {NanLandmarks} from './Landmarks';
import {ACTORS, CH_MOAT, HERO_W, HIGH_W} from './actors';
import {
  AIRFIELD, AIRFIELD_LEN, BOAT_MONUMENT, BRIDGE_MAIN, BRIDGE_NORTH, BRIDGE_SOUTH, CHAE_HAENG, CHANG_KHAM, GATES, HOKHAM, KHAO_NOI,
  KHUANG, MING_MUEANG, NEW_REACH, OLD_REACH, PHUMIN, RIVER, TOWN, WIANG_NUEA, WN_INNER, WN_OUTER,
} from './places';
import {STORY} from './timeline';

// World origin = the ONEP temple-core centroid, 70 m/unit (places.ts), +x east, +z south. The
// river is drawn by Landmarks.tsx, not by the engine: it moves in the story (the channel under
// the east wall until 2398, today's course after), so the engine's rivers are empty and the
// water is given to the occupancy map here as footprints, each with its years.
type P = [number, number];
const band = (pts: P[], closed: boolean, w: number, from: number | undefined, to: number | undefined, label: string) =>
  (closed ? pts.map((a, i) => [a, pts[(i + 1) % pts.length]] as [P, P]) : pts.slice(1).map((b, i) => [pts[i], b] as [P, P])).map(([a, b], i) => ({
    fp: {band: [a, b, w] as [P, P, number]},
    from,
    to,
    label: `${label} ${i}`,
  }));
const rect = (c: P, [w, h]: [number, number]): P[] => [
  [c[0] - w / 2, c[1] - h / 2],
  [c[0] + w / 2, c[1] - h / 2],
  [c[0] + w / 2, c[1] + h / 2],
  [c[0] - w / 2, c[1] + h / 2],
];
const WATER_W = Math.max(HIGH_W, HERO_W) + 0.6;

export const NAN: CityConfig = {
  id: 'nan',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'น่าน', sub: 'เมืองที่ย้ายตามสายน้ำ'},
    finale: {kicker: 'ภูเพียงแช่แห้ง – เวียงน่าน', title: 'น่าน', sub: 'แข่งเรือลือเลื่อง เมืองงาช้างดำ จิตรกรรมวัดภูมินทร์'},
    approxBefore: 1700,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -48, z1: 48},
    peaks: [
      // Doi Khao Noi, ~95 m above the town (README terrain) = 1.36 units
      [KHAO_NOI[0], KHAO_NOI[1], 1.36, 6],
      // the low rise of Phu Phiang Chae Haeng, ~15 m above the paddies
      [CHAE_HAENG[0], CHAE_HAENG[1], 0.22, 3],
    ],
    rivers: [],
    bridges: [],
    noMoat: true,
    noWall: true,
    trains: [],
    city: {hx: 9.5, hz: 8.3, outline: TOWN, moat: [1e9, 1e9], wall: [1e9, 1e9], gates: [1e9, 1e9], groundFrom: 1447.0},
    gates: [],
    houses: {
      // the town fills in as Tilokaraj's army comes (the siege beat runs 1446.6-1452.2)
      built: [1446.8, 0.6],
      // every house leaves in the 2360 flood and comes back after 2398. prob 1: a house with no
      // abandon year gets gone = Infinity and the engine's ramp(Y, Inf, Inf + 10) is NaN, so it
      // is never drawn (engine bug, reported on PR #69)
      abandon: {prob: 1, from: 1817.5, spread: 3, rebuild: 1855.6, rebuildSpread: 0.8},
      modern: [1935, 60],
      keepOut: [],
    },
    villages: {
      centers: [
        [-24, -22],
        [-26, 26],
        [22, 15],
        [-14, -34],
        [36, -6],
      ],
      built: [1447, 120],
    },
    forestCity: 1446.7,
    clearings: [
      // the grass by the river where the settlers land and the rise of Chae Haeng
      [CHAE_HAENG[0], CHAE_HAENG[1], 6, 1359.5],
    ],
    paddies: [1448, 1985],
    sites: [
      [CHAE_HAENG[0], CHAE_HAENG[1], 2.8],
      [CHANG_KHAM[0] + 1.0, CHANG_KHAM[1], 2.6],
      [PHUMIN[0], PHUMIN[1], 2.0],
      [HOKHAM[0], HOKHAM[1], 1.5],
      [MING_MUEANG[0], MING_MUEANG[1], 1.3],
      [KHAO_NOI[0], KHAO_NOI[1] + 0.3, 1.8],
      [BOAT_MONUMENT[0] - 1.3, BOAT_MONUMENT[1] - 2.4, 2.6],
    ],
    footprints: [
      // the river: north and south reaches always, the channel under the east wall until the
      // 2398 swing (then a strip pond, ท้องหลง, filled by 2500), today's reach after it
      ...band(RIVER.slice(0, 11), false, WATER_W, undefined, undefined, 'river north'),
      ...band(RIVER.slice(17), false, WATER_W, undefined, undefined, 'river south'),
      ...band(OLD_REACH, false, HERO_W + 0.6, undefined, 1858, 'old channel'),
      ...band(OLD_REACH, false, 1.0, 1858, 1960, 'old channel pond'),
      ...band(NEW_REACH, false, WATER_W, 1855, undefined, 'river today'),
      ...band(CH_MOAT, true, 0.9, 1359, undefined, 'Chae Haeng moat'),
      ...band(rect(WIANG_NUEA, WN_OUTER), true, 0.9, 1817, 1985, 'Wiang Nuea outer moat'),
      ...band(rect(WIANG_NUEA, WN_INNER), true, 0.8, 1817, 1985, 'Wiang Nuea inner moat'),
      // the wall line: the palisade (1911) and the brick wall (2398)
      ...band(TOWN, true, 0.9, 1368, undefined, 'town wall'),
      ...GATES.map((g) => ({fp: {band: [g.at, g.at, 1.6] as [P, P, number]}, from: g.year, label: g.name})),
      {fp: {band: [[AIRFIELD[0], AIRFIELD[1] - AIRFIELD_LEN / 2], [AIRFIELD[0], AIRFIELD[1] + AIRFIELD_LEN / 2], 1.8]}, from: 1926.5, label: 'airfield'},
      {fp: {band: [[AIRFIELD[0] - 1.6, AIRFIELD[1] + 2], [AIRFIELD[0] - 1.6, AIRFIELD[1] + 4], 1.4]}, from: 1926.5, to: 1990, label: 'hangar'},
      ...[BRIDGE_MAIN, BRIDGE_SOUTH, BRIDGE_NORTH].map((b, i) => ({fp: {band: [b[0], b[1], 1.2] as [P, P, number]}, from: [1972, 1990, 2004][i], label: `bridge ${i}`})),
    ],
    urban: {from: 1950, rate: 2.0},
    sprawl: {height: 0.8, tall: 0.04},
    highRise: 2000,
    towers: [],
    roads: [
      // the north road out of ประตูริม to the airfield (~2470)
      {from: [-2.1, -7.6], to: [AIRFIELD[0] - 1.0, AIRFIELD[1] + AIRFIELD_LEN / 2 + 0.5], width: 0.8, year: 1927},
      // the Phrae road (2481) in from the south-west to ประตูเชียงใหม่
      {from: [-46, 46], to: [-14, 20], width: 0.9, year: 1939},
      {from: [-14, 20], to: [-1.7, 6.2], width: 0.9, year: 1939},
      // over the main bridge to the east bank
      {from: [6.4, -1.1], to: BRIDGE_MAIN[0], width: 0.9, year: 1972},
      {from: BRIDGE_MAIN[1], to: [47, 8], width: 0.9, year: 1972},
      // ประตูท่าลี่ to the south bridge and on to Chae Haeng
      {from: [4.7, 5.3], to: BRIDGE_SOUTH[0], width: 0.8, year: 1990},
      {from: BRIDGE_SOUTH[1], to: [CHAE_HAENG[0] - 3.5, CHAE_HAENG[1] - 1], width: 0.8, year: 1990},
      // the north bridge
      {from: [12, -31.5], to: BRIDGE_NORTH[0], width: 0.8, year: 2004},
      {from: BRIDGE_NORTH[1], to: [47, -28.5], width: 0.8, year: 2004},
    ],
    openGround: [
      // ข่วงเมือง, the square in front of the temples
      {x0: KHUANG[0] - 1.2, x1: KHUANG[0] + 1.2, z0: KHUANG[1] - 0.6, z1: KHUANG[1] + 0.6},
    ],
    ringRoadYear: 1e9,
    cars: [1939, 2026],
    boats: [1e9, 1e9],
    finale: 'lanterns',
    life: {
      buffalo: [
        {x: -22, z: 30, r: 4, count: 6, from: 1450, to: 1985},
        {x: 20, z: 20, r: 3, count: 5, from: 1450, to: 1985},
      ],
      people: [{x: KHUANG[0], z: KHUANG[1], r: 1.0, count: 10, from: 1860, to: 2026}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: NanLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_nan.wav',
  sky: {
    top: [
      [1300, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1300, '#e6e2c4'],
      [1800, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1300, '#9aa45e'], ...GROUND],
  },
  // the valley floor is forest until the siege: extra sky fill keeps it out of the dark greens
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1850) / 100))),
  gloom: () => 0,
};
