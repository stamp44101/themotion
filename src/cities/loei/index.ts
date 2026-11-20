import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {LoeiLandmarks} from './Landmarks';
import {ACTORS, AYU_PATH, CARAVAN_PATH, FORGES, GIANT_AT, LX_PATH, STREET, WAX_PATH, atAlong} from './actors';
import {
  BAN_HAE, FAIR, HERO_AT, KRADUENG, KRADUENG_R, KR_TRAIL, LOEI, LOEI_RIVER, LOEI_RIVER_W, MAN, MAN_W, NAM_MAN, NAM_MAN_W,
  OLD_CORE, PEAKS, PHON_CHAI, ROAD_E, ROAD_N, ROAD_NW, ROAD_S, ROAD_W, SOK, SOK_W, STUPA, TILE,
} from './places';
import {STORY} from './timeline';

// World origin = Wat Phon Chai in Dan Sai (places.ts), 100 m/unit, +x east, +z south: Dan Sai at true scale in its valley,
// Loei town and Phu Kradueng drawn closer at the NE and SE edges. No wall: the engine's `city` is the old town on both banks
// round Wat Phon Chai, filled with houses through the frontier beat (counter 2107-2383). At the cover the tile is forested
// hills round a valley of paddies with the giant Phi Ta Khon on open ground north-east of the town site.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));
/** clear a track of trees along a path (CLAUDE.md: carts were hidden in Kalasin's forest) */
const track = (pts: P[], r: number, year: number) => pts.map(([x, z]) => [x, z, r, year] as [number, number, number, number]);

export const LOEI_CITY: CityConfig = {
  id: 'loei',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เลย', sub: 'ผีตาโขน ด่านซ้าย'},
    finale: {kicker: 'พ.ศ. 2103 – 2569', title: 'เลย', sub: 'เมืองแห่งทะเลภูเขา สุดหนาวในสยาม'},
    approxBefore: 1560,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: PEAKS,
    rivers: [
      {path: MAN, width: MAN_W},
      {path: SOK, width: SOK_W},
      {path: LOEI_RIVER, width: LOEI_RIVER_W},
      {path: NAM_MAN, width: NAM_MAN_W},
    ],
    bridges: [
      // ทล.2013 west over the Man by the stupa
      {at: atAlong(MAN, [-9.57, 7.9]), year: 1840, modernYear: 1975, river: 0},
      // the road north out of town over the Man
      {at: atAlong(MAN, [-8.8, 0.1]), year: 1840, modernYear: 1975, river: 0},
      // the town street from Wat Phon Chai north to the festival ground
      {at: atAlong(MAN, [1.2, -2.7]), year: 1900, modernYear: 1985, river: 0},
      // ทล.2013 over the Sok
      {at: atAlong(SOK, [-1.46, 2.07]), year: 1840, modernYear: 1975, river: 1},
      // ทล.2013 over the Loei river, at the drawn Loei town
      {at: atAlong(LOEI_RIVER, [38.6, -15.3]), year: 1955, modernYear: 1985, river: 2},
    ],
    noMoat: true,
    noWall: true,
    city: {
      hx: 8,
      hz: 7,
      outline: OLD_CORE,
      // no wall is drawn (noWall); these years only clear the old town's ground before the frontier beat
      moat: [1565.3, 1565.4],
      wall: [1565.3, 1565.4],
      gates: [1565.3, 1565.4],
      groundFrom: 1565.2,
    },
    gates: [],
    rail: undefined,
    trains: [],
    houses: {
      // the old town fills through the frontier beat (the counter runs 2107-2383)
      built: [1600, 230],
      modern: [1975, 40],
      keepOut: [
        [PHON_CHAI[0], PHON_CHAI[1], 1.4],
        [STUPA[0], STUPA[1], 1.6],
        [GIANT_AT[0], GIANT_AT[1], 2.9],
      ],
    },
    villages: {
      // rice villages up the valley and along the road east
      centers: [[-4, -21], [0, -35], [20, -9], [-16, 5], [3, 26]],
      built: [1700, 120],
    },
    forestCity: 1565,
    clearings: [
      // the open ground the cover's giant stands on (paddies; the town spreads over part of it later)
      [HERO_AT[0], HERO_AT[1], 11, -1e9],
      // the stupa's ground in the Man's bend, cleared before the oath
      [STUPA[0], STUPA[1], 1.8, 1550],
      // the two columns' tracks: Ayutthaya's from the west, Lan Xang's down the valley
      ...track(AYU_PATH, 1.4, 1550),
      ...track(LX_PATH, 1.4, 1550),
      // the caravans' track down the valley, and the wax procession's way to the stupa
      ...track(CARAVAN_PATH, 1.4, 1550),
      ...track(WAX_PATH, 1.2, 1550),
      // Ban Hae and the Loei town site, cleared some years before the held 2396; the furnaces at the hill foot
      [BAN_HAE[0], BAN_HAE[1], 3.6, 1838],
      [LOEI[0], LOEI[1], 2.6, 1838],
      [32.0, -17.4, 2.2, 1838],
      ...FORGES.map(([x, z]) => [x, z, 1.3, 1838] as [number, number, number, number]),
      // Phu Kradueng's plateau and the climb (drawn in Landmarks.tsx): no tile trees under it
      [KRADUENG[0], KRADUENG[1], KRADUENG_R + 3.8, -1e9],
      ...track(KR_TRAIL, 1.2, -1e9),
      [KRADUENG[0] - 14.6, KRADUENG[1] - 2.8, 2.2, -1e9],
      // the festival ground and the giant's ground
      [GIANT_AT[0], GIANT_AT[1], 4.0, 2005],
      [FAIR[0], FAIR[1], 1.6, 2005],
    ],
    paddies: [1580, 1720],
    sites: [
      [PHON_CHAI[0], PHON_CHAI[1], 1.2],
      [STUPA[0], STUPA[1], 1.4],
      [GIANT_AT[0], GIANT_AT[1], 2.9],
      [LOEI[0], LOEI[1], 0.8],
      [KRADUENG[0], KRADUENG[1], KRADUENG_R + 3.6],
      ...FORGES.map(([x, z]) => [x, z, 0.6] as [number, number, number]),
    ],
    openGround: [
      {x0: GIANT_AT[0] - 4, x1: GIANT_AT[0] + 3.4, z0: GIANT_AT[1] - 3.6, z1: GIANT_AT[1] + 3.6},
      {x0: KRADUENG[0] - 11, x1: KRADUENG[0] + 11, z0: KRADUENG[1] - 11, z1: KRADUENG[1] + 11},
    ],
    urban: {from: 1965, rate: 0.7},
    urbanBox: {x0: -12, x1: 24, z0: -16, z1: 12},
    // a small district town in the hills: no towers
    sprawl: {height: 0.42, tall: 0.02},
    highRise: 1e9,
    towers: [],
    roads: [
      // the old ways (cart tracks), then the highways
      ...segs(ROAD_W.slice(0, 8), 0.55, 1840),
      ...segs(ROAD_N.slice(0, 6), 0.55, 1840),
      ...segs(STREET, 0.45, 1900),
      ...segs(ROAD_E, 0.7, 1958, 0.2),
      ...segs(ROAD_W.slice(7), 0.7, 1962, 0.2),
      ...segs(ROAD_N.slice(5), 0.6, 1964, 0.2),
      ...segs(ROAD_NW, 0.6, 1968, 0.2),
      ...segs(ROAD_S, 0.6, 1970, 0.15),
    ],
    ringRoadYear: 1e9,
    cars: [1962, 2026],
    boats: [1560, 1900],
    finale: 'fireworks',
    life: {
      buffalo: [
        {x: -4.6, z: -18, r: 1.6, count: 4, from: 1600, to: 1990},
        {x: 17, z: -8, r: 2.2, count: 4, from: 1600, to: 1990},
      ],
      people: [
        {x: 3.6, z: -1.0, r: 1.2, count: 22, from: 2016, to: 2027, colors: ['#c8202c', '#f0b62a', '#2f7fc1', '#2e9b55', '#f2ece0']},
        {x: 4.4, z: 1.2, r: 0.9, count: 12, from: 2016, to: 2027},
      ],
      stalls: [{x: 6.4, z: -0.6, r: 1.2, count: 10, from: 2016, to: 2027}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: LoeiLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_loei.wav',
  sky: {
    top: [
      [1555, '#5a9bcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1555, '#e3e6d0'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1555, '#93a466'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1600) / 120))),
  gloom: () => 0,
};
