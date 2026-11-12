import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {YasothonLandmarks} from './Landmarks';
import {ACTORS, FOUND_HOUSES, SHOPS} from './actors';
import {
  CHAENG_SANIT, CHI, CHI_BRIDGE_AT, CHI_W, OUTFLOW_BRIDGE_AT, HALL, HONG, MUSEUM, OLD_QUARTER, PARK, PHAYA_THAEN, PHAYA_THAEN_W, PILLAR, POND, POND_W, ROCKET_AT,
  TILE, TOWER, WAT_MAHATHAT, WAT_SING_THA, WEST_ROAD,
} from './places';
import {STORY} from './timeline';

// World origin = the city pillar in Ban Sing Tha (places.ts), 100 m/unit, +x east, +z south, the town at true scale. No
// wall: the engine's `city` is [local]'s old-quarter estimate, filled with houses from the town's founding (2357) through
// the trade beat. At the cover the tile is forest, paddies and a handful of Lao houses at the landing on the Chi; the
// giant rocket lies north of its tower on the ground that becomes Phaya Thaen park.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));

export const YASOTHON: CityConfig = {
  id: 'yasothon',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ยโสธร', sub: 'เมืองบั้งไฟริมแม่น้ำชี'},
    finale: {kicker: 'พ.ศ. 2357 – 2569', title: 'ยโสธร', sub: 'ยิงบั้งไฟขอฝน ตั้งแต่ยังไม่มีเมือง'},
    approxBefore: 1800,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [],
    rivers: [
      {path: CHI, width: CHI_W},
      {path: POND, width: POND_W},
      {path: PHAYA_THAEN, width: PHAYA_THAEN_W},
    ],
    bridges: [
      {at: CHI_BRIDGE_AT, year: 1958, modernYear: 1985, river: 0},
      {at: OUTFLOW_BRIDGE_AT, year: 1936, modernYear: 1980, river: 2},
    ],
    noMoat: true,
    noWall: true,
    city: {
      hx: 4,
      hz: 4,
      outline: OLD_QUARTER,
      // no wall is drawn (noWall); these years only clear the trees on the old quarter's edge with the town
      moat: [1814.3, 1814.4],
      wall: [1814.3, 1814.4],
      gates: [1814.3, 1814.4],
      groundFrom: 1814.2,
    },
    gates: [],
    rail: undefined,
    trains: [],
    houses: {
      // the town fills through the trade beat (the counter runs 2358-2468)
      built: [1815.2, 80],
      modern: [1975, 40],
      keepOut: [
        [WAT_MAHATHAT[0], WAT_MAHATHAT[1] + 1, 2.8],
        [WAT_SING_THA[0], WAT_SING_THA[1] + 0.4, 1.4],
        [HONG[0], HONG[1], 1.6],
        [PILLAR[0], PILLAR[1], 0.8],
      ],
    },
    villages: {
      // Ban Sing Tha at the landing (there at the cover), and the villages round the paddies
      centers: [[-3.2, 2.8], [-14, 24], [20, 30], [24, -24], [-18, -24], [30, 2]],
      built: [1700, 60],
    },
    forestCity: 1813.0,
    clearings: [
      // the launch field round the tower and the ground the rocket lies on (it becomes Phaya Thaen park)
      [TOWER[0], TOWER[1], 8, -1e9],
      ...Array.from({length: 10}, (_, i) => [ROCKET_AT[0], ROCKET_AT[1] - 5 - i * 4.4, 4.2, -1e9] as [number, number, number, number]),
      // the landing and the village above it
      [-3.6, 2.4, 3.2, -1e9],
      // the river bank below the landing, where the boats come up (cleared as the town grows)
      ...[[-6.8, 5.7], [-7.0, 9.1], [-8.9, 11.5], [-10.9, 13.8], [-11.3, 17.1]].map(([x, z]) => [x, z, 2.6, 1814.0] as [number, number, number, number]),
      // the old quarter cleared for the town in 2357 (inside the held year)
      ...[[-3, -3], [-1, -4.5], [1, -4], [3, -1], [5, 2], [2, 2.5], [-1, 2], [-3, 0.5], [-0.5, -1], [1.5, 0.5], [4, 4], [6, 3.4], [-1.1, -2.9]]
        .map(([x, z]) => [x, z, 2.6, 1814.2] as [number, number, number, number]),
      [HALL[0], HALL[1], 3.0, 1971.5],
      [MUSEUM[0], MUSEUM[1], 4.8, 2014],
    ],
    paddies: [1700, 1760],
    sites: [
      [TOWER[0], TOWER[1], 3.4],
      [WAT_MAHATHAT[0], WAT_MAHATHAT[1], 1.6],
      [WAT_MAHATHAT[0], WAT_MAHATHAT[1] + 2.4, 1.1],
      [WAT_SING_THA[0], WAT_SING_THA[1] + 0.4, 1.3],
      [HONG[0], HONG[1], 1.4],
      [PILLAR[0], PILLAR[1], 0.6],
      [HALL[0], HALL[1], 2.6],
      // the toad is drawn ~4.5 units in radius (x6): its site covers all of it
      [MUSEUM[0], MUSEUM[1], 4.6],
    ],
    footprints: [
      ...SHOPS.map((s, j) => ({fp: {rect: [s.x, s.z, 0.6, 0.55] as [number, number, number, number]}, from: 1815, label: `shophouse ${j}`})),
      ...FOUND_HOUSES.map(([x, z], j) => ({fp: {rect: [x, z, 1.2, 1.2] as [number, number, number, number]}, from: 1814, label: `stilt house ${j}`})),
    ],
    openGround: [{x0: PARK[0] - 4, x1: PARK[0] + 3, z0: PARK[1] - 4, z1: PARK[1] + 3}],
    urban: {from: 1975, rate: 0.5},
    urbanBox: {x0: -12, x1: 34, z0: -30, z1: 28},
    sprawl: {height: 0.6, tall: 0.03},
    highRise: 2008,
    towers: [],
    roads: [
      // Chaeng Sanit, cut through in the road beat (the counter runs 2473-2509)
      ...segs(CHAENG_SANIT, 0.8, 1936, 0.6),
      ...segs(WEST_ROAD, 0.6, 1958, 0.3),
    ],
    ringRoadYear: 1e9,
    cars: [1950, 2026],
    boats: [1e9, 1e9],
    finale: 'fireworks',
    life: {
      buffalo: [
        {x: -2, z: 26, r: 3, count: 4, from: 1760, to: 1975},
        {x: 22, z: 26, r: 3, count: 4, from: 1760, to: 1975},
      ],
      people: [{x: PARK[0] - 1, z: PARK[1] - 1, r: 3.2, count: 40, from: 2023, to: 2027}],
      stalls: [{x: PARK[0] - 1.5, z: PARK[1] + 1.5, r: 2.6, count: 10, from: 2023, to: 2027}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: YasothonLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_yasothon.wav',
  sky: {
    top: [
      [1760, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1760, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1760, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1815) / 60))),
  gloom: () => 0,
};
