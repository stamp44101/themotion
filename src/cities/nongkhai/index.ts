import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {NongKhaiLandmarks} from './Landmarks';
import {ACTORS, BOAT_ROT, CAMP, FOUND_HOUSES, SETTLE_PATH, SIM_AT, STATION_AT, STATUES, TENTS, WATCHERS} from './actors';
import {
  BAN_PHAI, BOAT_AT, BOAT_S, BRIDGE, CROWD, EAST_ROAD, HWY2, LAO_ROAD, MITTRAPHAP, NEW_STATION, OLD_CORE, OLD_STATION, PRAPHO,
  RAIL, RIVER_ROAD, SALA_KAEW_KU, SPIT, THAT, TILE, WAT_PHO_CHAI, WATER_CLEARINGS, WEST_ROAD, inWater,
} from './places';
import {STORY} from './timeline';

// World origin = the Prap Ho monument (places.ts), 100 m/unit, +x east, +z south, everything at true scale. The Mekong is
// ONE flat shape drawn by Landmarks.tsx (the engine knows only path rivers), so it is kept clear here: a 2-unit grid of
// clearings (no tree) and sites (no house, hut or block) over it. No wall: the engine's `city` is the old town strip on the
// bank from Tha Sadet to Wat Pho Chai, filled with houses through the founding, sink and Phra Sai beats. At the cover the
// tile is forest on both banks with the giant boat on open ground south of the river; Laos is the north-west bank.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));
const line = (pts: P[], r: number, year: number, every = 1.5) =>
  pts.slice(1).flatMap((b, i) => {
    const a = pts[i];
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / every));
    return Array.from({length: n}, (_, j) => [a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n, r, year] as [number, number, number, number]);
  });
/** the cover boat's ground: discs along its keel */
const BOAT_GROUND = Array.from({length: 9}, (_, i) => {
  const u = (i / 8 - 0.5) * BOAT_S * 0.92;
  return [BOAT_AT[0] + Math.sin(BOAT_ROT) * u, BOAT_AT[1] + Math.cos(BOAT_ROT) * u, BOAT_S * 0.1, -1e9] as [number, number, number, number];
});

export const NONGKHAI: CityConfig = {
  id: 'nongkhai',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'หนองคาย', sub: 'เมืองริมโขง ฝั่งตรงข้ามเวียงจันทน์'},
    finale: {kicker: 'พ.ศ. 2370 – 2569', title: 'หนองคาย', sub: 'หลวงพ่อพระใส สะพานมิตรภาพ ริมฝั่งโขง'},
    approxBefore: 1827,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [],
    rivers: [],
    bridges: [],
    noMoat: true,
    noWall: true,
    city: {
      hx: 3,
      hz: 7,
      outline: OLD_CORE,
      // no wall is drawn (noWall); these years only clear the old town's ground with the settling
      moat: [1825.5, 1825.6],
      wall: [1825.5, 1825.6],
      gates: [1825.5, 1825.6],
      groundFrom: 1824.5,
    },
    gates: [],
    rail: undefined,
    trains: [],
    houses: {
      // the old town fills through the founding, sink and Phra Sai beats (the counter runs 2370-2399)
      built: [1828, 28],
      modern: [1960, 34],
      keepOut: [
        [SIM_AT[0], SIM_AT[1], 1.6],
        [PRAPHO[0], PRAPHO[1], 1.0],
        [BAN_PHAI[0], BAN_PHAI[1], 0.6],
        [CROWD[0], CROWD[1], 1.6],
      ],
    },
    villages: {
      // rice villages on both banks (Laos on the north-west)
      centers: [[-16, 9], [24, 4], [32, 14], [-4, 22], [18, 28], [-22, -14], [-10, -20], [4, -26], [12, -36], [-26, -26], [40, 26]],
      built: [1832, 1905],
    },
    forestCity: 1824,
    clearings: [
      ...WATER_CLEARINGS,
      // the cover boat's open ground on the bank (paddies; the town spreads over it later)
      ...BOAT_GROUND,
      // the cart track up to Ban Phai, and Ban Phai's bank, cleared before the settlers come (trees fade over 2 years)
      ...line(SETTLE_PATH, 1.8, -1e9),
      [BAN_PHAI[0], BAN_PHAI[1] + 1.8, 3.4, 1821],
      // the bank in front of the town where the crowd stands (found, race)
      ...line([[-3, -1.6], [5, -4.4], [12.4, -6.8]], 1.6, 1821),
      // the stupa's spit and the bank behind it
      ...SPIT.map(([x, z]) => [x, z, 1.3, -1e9] as [number, number, number, number]),
      [THAT[0] - 2.0, THAT[1] + 4.4, 2.6, -1e9],
      ...WATCHERS.map(([x, z]) => [x, z, 1.0, -1e9] as [number, number, number, number]),
      // Wat Pho Chai's ground and the road the carts take west
      [WAT_PHO_CHAI[0], WAT_PHO_CHAI[1] - 1.0, 2.4, 1833],
      ...line([[17.7, -7.4], [14.4, -6.8], [11.5, -5.0], [8.7, -3.8]], 1.4, 1833),
      // the army's camp and its road to the bank
      [CAMP[0], CAMP[1] + 3.2, 3.6, 1882],
      ...line([[CAMP[0], CAMP[1]], [CAMP[0] - 0.4, -2.2]], 2.2, 1882),
      // the railway's bed, cleared as the counter reaches 2498
      ...line(RAIL, 1.2, 1951),
      [STATION_AT[0], STATION_AT[1], 1.6, 1951],
      // Sala Kaew Ku's park
      [SALA_KAEW_KU[0], SALA_KAEW_KU[1], 2.6, 1960],
      // the bridge's landings
      [BRIDGE[0][0], BRIDGE[0][1] + 0.6, 1.8, 1989],
      [BRIDGE[1][0], BRIDGE[1][1] - 0.6, 1.8, 1989],
    ],
    paddies: [1830, 1880],
    sites: [
      // over the water; a smaller disc at the shore so the bank roads stay clear of it
      ...WATER_CLEARINGS.flatMap(([x, z]) => {
        const ring = (r: number) => [[r, 0], [-r, 0], [0, r], [0, -r], [r * 0.7, r * 0.7], [-r * 0.7, r * 0.7], [r * 0.7, -r * 0.7], [-r * 0.7, -r * 0.7]].every(([dx, dz]) => inWater(x + dx, z + dz));
        return ring(1.5) ? [[x, z, 1.45] as [number, number, number]] : ring(0.9) ? [[x, z, 0.8] as [number, number, number]] : [];
      }),
      [SIM_AT[0], SIM_AT[1], 1.2],
      [PRAPHO[0], PRAPHO[1], 0.9],
      [THAT[0] - 1.0, THAT[1] + 2.2, 2.4],
      [STATION_AT[0], STATION_AT[1], 0.8],
      ...STATUES.map(([x, z, h]) => [x, z, 0.6 + h * 0.3] as [number, number, number]),
      [NEW_STATION[0], NEW_STATION[1], 1.0],
      // the bank where the crowds stand
      [CROWD[0], CROWD[1], 1.4],
      [CROWD[0] - 3, CROWD[1] + 1.2, 1.2],
      [CROWD[0] + 3, CROWD[1] - 1.0, 1.2],
    ],
    footprints: [
      ...FOUND_HOUSES.map(([x, z], j) => ({fp: {rect: [x, z, 1.2, 1.2] as [number, number, number, number]}, from: 1824, label: `stilt house ${j}`})),
      ...RAIL.slice(1).map((b, i) => ({fp: {band: [RAIL[i], b, 0.8] as [P, P, number]}, from: 1954, label: `railway ${i}`})),
      ...TENTS.map(([x, z], j) => ({fp: {rect: [x, z, 1.0, 1.0] as [number, number, number, number]}, from: 1885, to: 1887, label: `tent ${j}`})),
    ],
    openGround: [
      // the bank in front of Tha Sadet where the race crowd stands
      {x0: CROWD[0] - 4.2, x1: CROWD[0] + 4.2, z0: CROWD[1] - 1.6, z1: CROWD[1] + 1.6},
    ],
    urban: {from: 1960, rate: 0.55},
    urbanBox: {x0: -32, x1: 50, z0: -30, z1: 30},
    // a low border town: a few mid-rise blocks only
    sprawl: {height: 0.5, tall: 0.03},
    highRise: 1985,
    towers: [],
    roads: [
      ...segs(RIVER_ROAD, 0.6, 1880, 0.5),
      ...segs(WEST_ROAD, 0.6, 1890, 0.5),
      ...segs(MITTRAPHAP, 0.7, 1925, 0.5),
      ...segs(LAO_ROAD, 0.6, 1910, 0.5),
      ...segs(HWY2, 0.8, 1962, 0.3),
      ...segs(EAST_ROAD, 0.6, 1965, 0.3),
    ],
    ringRoadYear: 1e9,
    cars: [1960, 2026],
    boats: [1820, 2026],
    finale: 'fireworks',
    life: {
      buffalo: [
        {x: -18, z: 16, r: 3, count: 4, from: 1830, to: 1990},
        {x: 30, z: 20, r: 3, count: 4, from: 1830, to: 1990},
      ],
      people: [{x: CROWD[0], z: CROWD[1], r: 2.8, count: 34, from: 2005, to: 2027}],
      stalls: [{x: CROWD[0] - 0.6, z: CROWD[1] + 1.0, r: 2.0, count: 8, from: 2005, to: 2027}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: NongKhaiLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_nongkhai.wav',
  sky: {
    top: [
      [1820, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1820, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1820, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1826) / 60))),
  gloom: () => 0,
};
