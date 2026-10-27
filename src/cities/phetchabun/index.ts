import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {PhetchabunLandmarks} from './Landmarks';
import {ACTORS, CAMP, CAMP_R, CAP_ROADS, HIGH, HIGH_W, HIGHWAY, ORCHARDS} from './actors';
import {GATES, MAHATHAT, NAKHONBAN, OLD_TOWN, POOL, RIVER, RIVER_W, TRAIPHUM, WALL, WATER_GATES} from './places';
import {STORY} from './timeline';

// World origin = the city pillar (ศาลหลักเมือง, on the Ayutthaya town's south-west corner fort),
// 40 m/unit (places.ts), +x east, +z south. The Pa Sak is the engine's river (a path river, so
// the occupancy map, the house grid and the road bridges all know it); Landmarks.tsx draws its
// high water for the boats, the two towns' walls and the forts.
type P = [number, number];
const band = (pts: P[], closed: boolean, w: number, from: number | undefined, to: number | undefined, label: string) =>
  (closed ? pts.map((a, i) => [a, pts[(i + 1) % pts.length]] as [P, P]) : pts.slice(1).map((b, i) => [pts[i], b] as [P, P])).map(([a, b], i) => ({
    fp: {band: [a, b, w] as [P, P, number]},
    from,
    to,
    label: `${label} ${i}`,
  }));
const segs = (pts: P[], width: number, year: number) => pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year}));

export const PHETCHABUN: CityConfig = {
  id: 'phetchabun',
  // the owner renders the shader look only (26 Oct 2026)
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เพชรบูรณ์', sub: 'พระผุดจากสายน้ำป่าสัก'},
    finale: {kicker: 'เมืองอกแตก ริมน้ำป่าสัก', title: 'เพชรบูรณ์', sub: 'พระพุทธมหาธรรมราชา มะขามหวาน ศรีเทพมรดกโลก'},
    approxBefore: 1800,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -46, x1: 46, z0: -50, z1: 42},
    // a flat basin: the nearest hill is 6 km out and the ranges 12-30 km (README item 4), off the tile
    peaks: [],
    rivers: [{path: RIVER, width: RIVER_W}],
    bridges: [],
    noMoat: true,
    noWall: true,
    trains: [],
    city: {hx: 12.6, hz: 12.6, outline: WALL, moat: [1e9, 1e9], wall: [1e9, 1e9], gates: [1e9, 1e9], groundFrom: 1661},
    gates: [],
    houses: {
      // the Ayutthaya town fills in as the wall goes up (the wall beat runs 1660-1684)
      built: [1662, 10],
      // prob 1 with a far-off year: the engine's ramp on gone = Infinity is NaN (PR #69)
      abandon: {prob: 1, from: 3000, spread: 0, rebuild: 3001, rebuildSpread: 0},
      modern: [1945, 50],
      keepOut: [],
    },
    villages: {
      centers: [
        [-13, 1],
        [-20, -4],
        [16, -22],
        [20, 10],
        [-8, 26],
      ],
      built: [1400, 160],
    },
    forestCity: 1661,
    clearings: [
      // the river bend at the pool is open meadow (the cover, the procession, the rite)
      [POOL[0], POOL[1], 8, -1e9],
      [MAHATHAT[0], MAHATHAT[1], 3, -1e9],
      [TRAIPHUM[0], TRAIPHUM[1], 2.2, -1e9],
      [CAMP[0], CAMP[1], CAMP_R + 2, 1800],
      [NAKHONBAN[0], NAKHONBAN[1] + 6, 12, 1942],
      // the banks of the cover's high water (the image's way down to Wat Traiphum)
      ...HIGH.filter((_, i) => i % 6 === 0).map(([x, z]) => [x, z, HIGH_W / 2 + 1.2, -1e9] as [number, number, number, number]),
    ],
    paddies: [1400, 1975],
    sites: [
      [MAHATHAT[0], MAHATHAT[1], 2.8],
      [TRAIPHUM[0], TRAIPHUM[1], 1.6],
      [NAKHONBAN[0], NAKHONBAN[1], 1.2],
      // the pool and the crowd on its banks
      [POOL[0], POOL[1], 5.5],
    ],
    footprints: [
      // the Sukhothai earthwork and moat round Wat Mahathat
      ...band(OLD_TOWN, true, 0.9, undefined, 1975, 'old town moat'),
      // the Ayutthaya wall, its gates and water gates
      // the wall line, open where the Pa Sak passes through its two water gates
      ...[
        [WALL[0], [WATER_GATES[0].at[0] - 1.3, WALL[0][1]]],
        [[WATER_GATES[0].at[0] + 1.3, WALL[0][1]], WALL[1]],
        [WALL[1], [WALL[1][0], WATER_GATES[1].at[1] - 1.3]],
        [[WALL[1][0], WATER_GATES[1].at[1] + 1.3], WALL[2]],
        [WALL[2], WALL[3]],
        [WALL[3], WALL[0]],
      ].map(([a, b], i) => ({fp: {band: [a, b, 0.7] as [P, P, number]}, from: 1660, label: `town wall ${i}`})),
      ...GATES.map((g) => ({fp: {band: [g.at, g.at, 1.8] as [P, P, number]}, from: 1660, label: g.name, onWall: true})),
      ...WALL.map((c, i) => ({fp: {band: [c, c, 2.4] as [P, P, number]}, from: 1660, label: `corner fort ${i}`, onWall: true})),
      // 2370: the camp
      {fp: {band: [CAMP, CAMP, CAMP_R * 2 + 0.6] as [P, P, number]}, from: 1826, to: 1828, label: 'camp'},
      // Nakhonban's roads and halls (2486-2490s)
      ...CAP_ROADS.map(([a, b], i) => ({fp: {band: [a, b, 5] as [P, P, number]}, from: 1942.6, to: 1962, label: `nakhonban ${i}`})),
    ],
    urban: {from: 1955, rate: 1.6},
    sprawl: {height: 0.55, tall: 0.02},
    highRise: 2010,
    towers: [],
    roads: [
      // Highway 21 in from the south (Saraburi)
      ...segs(HIGHWAY, 0.9, 1962),
      // ถนนหลักเมือง and its bridge, the road north to the new provincial hall
      {from: [-2.5, -14.6], to: [9, -14.3], width: 0.8, year: 1975},
      {from: [-2.5, -14.6], to: [-12, -40], width: 0.8, year: 1975},
      // the north bridge
      {from: [1, -25.5], to: [16, -25.5], width: 0.8, year: 1988},
      // the east bridge, out to the east bank
      {from: [13.7, -9.5], to: [13.7, 3], width: 0.8, year: 1980},
      {from: [13.7, 3], to: [13.7, 16], width: 0.8, year: 1980},
    ],
    openGround: [
      // the rite's banks at the pool
      {x0: POOL[0] - 6, x1: POOL[0] + 6, z0: POOL[1] - 6, z1: POOL[1] + 6},
      // the tamarind orchards
      ...ORCHARDS.map((o) => ({x0: o.c[0] - o.w / 2, x1: o.c[0] + o.w / 2, z0: o.c[1] - o.h / 2, z1: o.c[1] + o.h / 2})),
    ],
    ringRoadYear: 1e9,
    cars: [1962, 2026],
    boats: [1e9, 1e9],
    finale: 'lanterns',
    life: {
      buffalo: [
        {x: -24, z: -16, r: 4, count: 6, from: 1500, to: 1975},
        {x: 22, z: 20, r: 3, count: 5, from: 1500, to: 1975},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: PhetchabunLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_phetchabun.wav',
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
    ground: [[1300, '#a6a866'], ...GROUND],
  },
  // a forested basin before the Ayutthaya town: extra sky fill keeps it out of the dark greens
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1850) / 100))),
  gloom: () => 0,
};
