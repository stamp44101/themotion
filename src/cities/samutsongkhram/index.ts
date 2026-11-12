import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {SamutSongkhramLandmarks} from './Landmarks';
import {ACTORS, CAMP_R, RAIL_SPAN, RIVER_HOUSES, SHOPS, STALLS, TRAY_R, atAlong} from './actors';
import {
  BANG_KUNG, DON_HOI_LOT, ESTUARY, ESTUARY_W, FORT, HALL, MAEKLONG, MAEKLONG_W, NE_ROAD, OLD_TOWN, PILLAR, RAIL_Z,
  RAMA2, RAMA2_BRIDGE, SEA_PATH, SEA_W, TILE, TRAY_AT, WAT_PHET,
} from './places';
import {STORY, TRAINS} from './timeline';

// World origin = the city pillar (places.ts), 100 m/unit, +x east, +z south, the town at true scale and the far reaches
// drawn closer. No wall: the engine's `city` is the old riverside town between the river and the Phet Samut road, filled
// with houses from Ban Laem's settling (~2307) through the fort beat. At the cover the tile is orchard and forest on the
// Mae Klong, the gulf in the south-east corner, and the giant tray of pla thu on open ground between the town and the sea.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));

export const SAMUTSONGKHRAM: CityConfig = {
  id: 'samutsongkhram',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สมุทรสงคราม', sub: 'เมืองแม่กลอง ปากแม่น้ำ'},
    finale: {kicker: 'พ.ศ. 2307 – 2569', title: 'สมุทรสงคราม', sub: 'ปลาทูหน้างอ คอหัก ต้องแม่กลอง'},
    approxBefore: 1800,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [],
    rivers: [
      {path: MAEKLONG, width: MAEKLONG_W},
      {path: ESTUARY, width: ESTUARY_W},
      // the Gulf of Thailand: one wide path whose north-west edge is the coast
      {path: SEA_PATH, width: SEA_W},
    ],
    bridges: [
      // สะพานสมเด็จพระพุทธเลิศหล้านภาลัย, opened with Rama II road on 1 Apr 2516
      {at: atAlong(MAEKLONG, RAMA2_BRIDGE), year: 1969.6, modernYear: 1969.6, river: 0},
    ],
    noMoat: true,
    noWall: true,
    city: {
      hx: 4,
      hz: 5,
      outline: OLD_TOWN,
      // no wall is drawn (noWall); these years only clear the town ground with Ban Laem's settling
      moat: [1764.3, 1764.4],
      wall: [1764.3, 1764.4],
      gates: [1764.3, 1764.4],
      groundFrom: 1764.2,
    },
    gates: [],
    rail: {axis: 'x', pos: RAIL_Z, open: [1904.6, 1905.0], station: [-3.4, RAIL_Z + 1.0], stationYear: 1904.6, span: RAIL_SPAN},
    trains: TRAINS,
    houses: {
      // the riverside town fills through the fort beat (the counter runs 2313-2447)
      built: [1771, 130],
      modern: [1975, 40],
      keepOut: [
        [WAT_PHET[0], WAT_PHET[1], 1.4],
        [FORT[0], FORT[1], 1.5],
        [PILLAR[0], PILLAR[1], 0.6],
        [HALL[0], HALL[1], 1.0],
      ],
    },
    villages: {
      // fishing villages on the estuary and the coast, orchard villages on the loop and at Amphawa
      centers: [[-10, 30], [6, 33], [-28, 6], [-33, -8], [12, -10], [26, 14]],
      built: [1700, 60],
    },
    forestCity: 1763.5,
    clearings: [
      // the open ground the cover's tray stands on (it becomes orchards and town later)
      [TRAY_AT[0], TRAY_AT[1], TRAY_R + 1.5, -1e9],
      // the estuary bank where the boats land the catch
      [-2, 34.6, 3, -1e9],
      // the camp at Bang Kung
      [BANG_KUNG[0], BANG_KUNG[1], CAMP_R + 1.2, -1e9],
      // the town's bank cleared with Ban Laem's settling
      ...[[-3.8, 3.0], [-3.6, 6.4], [-2.6, 8.6], [-3.2, 1.0], [-1.4, 4.0], [0.2, 2.0], [0.4, 6.4]].map(([x, z]) => [x, z, 2.2, 1764.2] as [number, number, number, number]),
    ],
    paddies: [1700, 1760],
    sites: [
      [WAT_PHET[0], WAT_PHET[1], 1.3],
      [FORT[0], FORT[1], 1.4],
      [BANG_KUNG[0], BANG_KUNG[1], CAMP_R + 0.4],
      [PILLAR[0], PILLAR[1], 0.5],
      [HALL[0], HALL[1], 1.0],
    ],
    footprints: [
      ...SHOPS.map((s, j) => ({fp: {rect: [s.x, s.z, 0.45, 0.48] as [number, number, number, number]}, from: 1906, label: `shophouse ${j}`})),
      ...RIVER_HOUSES.map(([x, z], j) => ({fp: {rect: [x, z, 0.45, 0.45] as [number, number, number, number]}, from: 1771, label: `stilt house ${j}`})),
      ...STALLS.map((x, j) => ({fp: {rect: [x, RAIL_Z, 0.22, 1.2] as [number, number, number, number]}, from: 1906, label: `market stall ${j}`})),
    ],
    openGround: [{x0: DON_HOI_LOT[0] - 5, x1: DON_HOI_LOT[0] + 3, z0: DON_HOI_LOT[1] - 5, z1: DON_HOI_LOT[1] + 1}],
    urban: {from: 1975, rate: 0.6},
    urbanBox: {x0: -17, x1: 34, z0: -20, z1: 34},
    // a low town: no towers (Mae Klong has a handful of mid-rise blocks, none in the old market)
    sprawl: {height: 0.35, tall: 0},
    highRise: 1e9,
    towers: [],
    roads: [
      // the old roads out of town (the market beat's years), Rama II on its held year
      ...segs(NE_ROAD, 0.6, 1935, 0.5),
      // the deck over the river goes on last, once the bridge is up (cars never run onto open water)
      ...segs(RAMA2, 0.9, 1973.3).map((s, i) => (i === 5 ? {...s, year: 1975.6} : s)),
    ],
    ringRoadYear: 1e9,
    cars: [1950, 2026],
    boats: [1750, 1972],
    finale: 'fireworks',
    life: {
      people: [{x: -2.2, z: RAIL_Z - 0.2, r: 1.6, count: 18, from: 1906, to: 2027}],
      stalls: [],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: SamutSongkhramLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_samutsongkhram.wav',
  sky: {
    top: [
      [1747, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1747, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1747, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1770) / 80))),
  gloom: () => 0,
};
