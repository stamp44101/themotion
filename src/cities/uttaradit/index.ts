import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {UttaraditLandmarks} from './Landmarks';
import {ACTORS, ROW, SHOPS} from './actors';
import {
  BOROM_AT, DAM, FIGHT_AT, HALL, HERO_AT, LAKE, MONUMENT, NAM_PHI, NAN, NAN_W, NORTH_ROAD, PHICHAI_WALL, RAIL_X, RIVER_ROAD,
  SILA_AT, STATION, TILE,
} from './places';
import {STORY, TRAINS} from './timeline';

// World origin = the Phraya Phichai monument (places.ts), 100 m/unit, +x east, +z south. The engine's `city` is old
// Phichai's traced wall (Treasury survey), moved north to the tile's south edge on the Nan's east bank: it rises in the
// raise beat (the chronicle's 2033) and settles to a low ruin in 2458, when the town takes the name Uttaradit. Its hx/hz
// are kept small and centred on the origin on purpose: the engine measures the modern sprawl's distance from that box,
// so today's town (Bang Pho Tha It, round the origin) is the one that grows. The town's own early buildings (the market
// row, the station, the shophouses, the hall) are drawn by hand in Landmarks.tsx on their beats.
type P = [number, number];
const segs = (pts: P[], width: number, year: number) => pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year}));
const xs = PHICHAI_WALL.map((p) => p[0]);
const zs = PHICHAI_WALL.map((p) => p[1]);

export const UTTARADIT: CityConfig = {
  id: 'uttaradit',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'อุตรดิตถ์', sub: 'เมืองเหล็กน้ำพี้ริมแม่น้ำน่าน'},
    finale: {kicker: 'พ.ศ. 2033 – 2569', title: 'อุตรดิตถ์', sub: 'ท่าน้ำทิศเหนือ บ้านพระยาพิชัยดาบหัก'},
    approxBefore: 1480,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [
      // the Nam Phi hills east of the Nan (the iron pits at their foot)
      [NAM_PHI[0] + 3, NAM_PHI[1] + 2, 6, 5.5],
      [41, 1, 5, 4.6],
      [41, 20, 4.4, 5],
      // the gorge the dam closes, in the NE corner
      [46.5, -21.5, 7, 4.2],
      [37.5, -32.5, 6, 3.8],
      // the Laplae hills to the west (orchards in the grow shot)
      [-33, -22, 8.6, 6.8],
      [-34, -6, 4.2, 5],
    ],
    rivers: [{path: NAN, width: NAN_W}],
    bridges: [],
    noMoat: true,
    city: {
      hx: 4,
      hz: 4,
      outline: PHICHAI_WALL,
      moat: [1e9, 1e9],
      wall: [1490.6, 1498.4],
      gates: [1e9, 1e9],
      decay: [1915.05, 1915.4, 1e9, 1e9],
      ruinStrength: 0.85,
      groundFrom: 1490.3,
    },
    gates: [],
    rail: {axis: 'z', pos: RAIL_X, open: [1909.02, 1909.18], station: STATION, stationYear: 1e9},
    trains: TRAINS.map((tr) => ({...tr})),
    houses: {
      // old Phichai fills as its wall goes up (inside the raise beat)
      built: [1491.2, 6.5],
      modern: [1985, 30],
      keepOut: [],
    },
    villages: {
      // Bang Pho Tha It and the villages round it grow through the trade beat
      centers: [[-8, 5], [-10, -8], [7, -6], [-15, 14], [10, -16], [-20, -2], [12, 16]],
      built: [1832, 46],
    },
    forestCity: 1490.2,
    clearings: [
      // the cover's clearing below the Nam Phi hills (gone with the anvil; nothing is built there before the grow shot)
      [HERO_AT[0], HERO_AT[1], 9, -1e9],
      // the field of Wat Ekka where the giant stands, and the column's road down the west bank
      [FIGHT_AT[0], FIGHT_AT[1], 6.5, -1e9],
      ...[[-35.5, 8], [-35, 18], [-34, 28], [-32, 37], [-27.6, 43.6]].map(([x, z]) => [x, z, 3.2, -1e9] as [number, number, number, number]),
      // the landing and the river street, cleared with the market row; the station's ground with the line
      [1.4, 9.0, 3.2, 1832],
      [STATION[0], STATION[1], 3.0, 1909.02],
      ...SHOPS.map((s) => [s.x, s.z, 1.0, 1909.02] as [number, number, number, number]),
      [HALL[0], HALL[1], 3.0, 1915.02],
      [MONUMENT[0], MONUMENT[1] + 2, 4.6, 1915.02],
      // the lake (filled in the 2520 hold)
      ...LAKE.map(([x, z, r]) => [x, z, r + 1.4, 1977.05] as [number, number, number, number]),
      [DAM[0], DAM[1], 4.4, 1940],
      [SILA_AT[0] - 1.6, SILA_AT[1] - 0.8, 4.2, 1978.5],
    ],
    paddies: [1836, 1880],
    sites: [
      [HERO_AT[0], HERO_AT[1], 8],
      [FIGHT_AT[0], FIGHT_AT[1], 3],
      [HALL[0], HALL[1], 2.6],
      [MONUMENT[0], MONUMENT[1] + 1.8, 5.2],
      [DAM[0], DAM[1], 4.2],
      ...LAKE.map(([x, z, r]) => [x, z, r + 0.8] as [number, number, number]),
      [SILA_AT[0] - 1.6, SILA_AT[1] - 0.8, 3.8],
    ],
    footprints: [
      {fp: {rect: [STATION[0], STATION[1], 1.8, 4.8]}, from: 1909, label: 'Uttaradit station'},
      ...ROW.map((r, j) => ({fp: {rect: [r.x, r.z, 0.85, 0.85] as [number, number, number, number]}, from: 1832, label: `market row ${j}`})),
      ...SHOPS.map((s, j) => ({fp: {rect: [s.x, s.z, 1.25, 1.15] as [number, number, number, number]}, from: 1909, label: `shophouse ${j}`})),
    ],
    openGround: [{x0: MONUMENT[0] - 5, x1: MONUMENT[0] + 5, z0: MONUMENT[1] - 1, z1: MONUMENT[1] + 6}],
    urban: {from: 1972, rate: 0.6},
    urbanBox: {x0: -30, x1: 30, z0: -32, z1: 26},
    sprawl: {height: 0.6, tall: 0.03},
    highRise: 2005,
    towers: [],
    roads: [
      ...segs(BOROM_AT, 0.7, 1980),
      ...segs(RIVER_ROAD, 0.6, 1982),
      ...segs(NORTH_ROAD, 0.7, 1984),
    ],
    ringRoadYear: 1e9,
    cars: [1985, 2026],
    boats: [1e9, 1e9],
    finale: 'fireworks',
    life: {
      buffalo: [
        {x: -12, z: 20, r: 3, count: 4, from: 1836, to: 1975},
        {x: 10, z: 22, r: 3, count: 4, from: 1836, to: 1975},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: UttaraditLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_uttaradit.wav',
  sky: {
    top: [
      [1480, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1480, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1480, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1880) / 60))),
  gloom: () => 0,
};

/** Phichai's bounding box (for the brief's notes) */
export const PHICHAI_BOX = {x0: Math.min(...xs), x1: Math.max(...xs), z0: Math.min(...zs), z1: Math.max(...zs)};
