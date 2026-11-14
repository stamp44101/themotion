import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {KalasinLandmarks} from './Landmarks';
import {ACTORS, FOUND_HOUSES, LOOM_C, atAlong} from './actors';
import {
  BYPASS, DIG, FAIR, FIRST_PILLAR, HALL, KHLONG, KHLONG_W, LOOM_S, MONUMENT, NE_ROAD, N_ROAD, OLD_CORE, OLD_STREET, OXBOW, PAO,
  PAO_W, PHU_KUM_KHAO, PILLAR, POND, POND_C, SE_ROAD, SHAWL_AT, SOMPHAMIT, SOUTH_BRIDGE, SOUTH_ROAD, TILE, UNIVERSITY, WAT_KLANG,
  WAT_NUEA, WAT_TAI,
} from './places';
import {STORY} from './timeline';

// World origin = the city pillar (places.ts), 100 m/unit, +x east, +z south, the town at true scale and the dam and Phu Kum
// Khao drawn closer at the north edge. No wall: the engine's `city` is the old core on คลองปาว, filled with houses from the
// settling (~2325) through the temples and bank beats. At the cover the tile is forest and paddy on the khlong with the giant
// loom on open ground east of it; the reservoir corner is forest until the dam beat floods it.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));
const ring = (c: P, r: number, n: number, year: number) =>
  Array.from({length: n}, (_, i) => [c[0] + Math.cos((i / n) * 6.283) * r, c[1] + Math.sin((i / n) * 6.283) * r, r * 0.75, year] as [number, number, number, number]);

export const KALASIN: CityConfig = {
  id: 'kalasin',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'กาฬสินธุ์', sub: 'เมืองน้ำดำ ริมลำน้ำปาว'},
    finale: {kicker: 'พ.ศ. 2336 – 2569', title: 'กาฬสินธุ์', sub: 'โปงลางเลิศล้ำ ผ้าไหมแพรวา'},
    approxBefore: 1793,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [[PHU_KUM_KHAO[0], PHU_KUM_KHAO[1], 2.2, 3.6]],
    rivers: [
      {path: KHLONG, width: KHLONG_W},
      {path: PAO, width: PAO_W},
    ],
    bridges: [
      // ถนนถีนานนท์ over คลองปาว (OSM marks the bridge)
      {at: atAlong(KHLONG, SOUTH_BRIDGE), year: 1959, modernYear: 1990, river: 0},
    ],
    noMoat: true,
    noWall: true,
    city: {
      hx: 3,
      hz: 7,
      outline: OLD_CORE,
      // no wall is drawn (noWall); these years only clear the old core's ground with the settling
      moat: [1781.3, 1781.4],
      wall: [1781.3, 1781.4],
      gates: [1781.3, 1781.4],
      groundFrom: 1781.2,
    },
    gates: [],
    rail: undefined,
    trains: [],
    houses: {
      // the old core fills through the temples and bank beats (the counter runs 2337-2371)
      built: [1786, 50],
      modern: [1975, 40],
      keepOut: [
        [WAT_NUEA[0], WAT_NUEA[1], 1.6],
        [WAT_KLANG[0], WAT_KLANG[1], 1.6],
        [WAT_TAI[0], WAT_TAI[1], 1.6],
        [SOMPHAMIT[0], SOMPHAMIT[1], 0.6],
        [PILLAR[0], PILLAR[1], 0.8],
        [MONUMENT[0], MONUMENT[1], 0.6],
        [FIRST_PILLAR[0], FIRST_PILLAR[1], 1.0],
      ],
    },
    villages: {
      // rice villages round the paddies
      centers: [[-14, -14], [-20, 6], [16, 22], [30, 18], [-10, 26], [28, -30], [36, 8]],
      built: [1700, 60],
    },
    forestCity: 1780.5,
    clearings: [
      // the open ground the cover's loom stands on (paddies; the town spreads over it later)
      [LOOM_C[0], LOOM_C[1], LOOM_S * 0.42, -1e9],
      // the pond of Kaeng Don Klang (drawn in Landmarks.tsx): no trees on it
      ...ring(POND_C, 3.2, 6, -1e9),
      [POND_C[0], POND_C[1], 3.4, -1e9],
      // the oxbow and the first pillar's strip of land
      [-1.6, 8.0, 2.0, -1e9],
      // the old core's bank cleared with the settling
      ...[[1.4, -4.0], [3.0, -2.0], [2.6, 1.0], [2.0, 4.4], [3.4, 6.0], [0.4, 0.4], [0.2, 3.0]].map(([x, z]) => [x, z, 2.0, 1781.2] as [number, number, number, number]),
      // the reservoir floods the valley in the dam beat (the trees go with the water)
      ...Array.from({length: 7 * 5}, (_, k) => [-37 + (k % 7) * 3, -45 + Math.floor(k / 7) * 2.6, 2.4, 1964.5] as [number, number, number, number]),
      // the old cart track down the khlong's east bank (the settlers come in on it)
      ...[[6.0, -31.0], [5.0, -27.5], [4.4, -24.0], [4.0, -20.0], [3.2, -16.6], [2.6, -14.0], [3.0, -10.8], [3.0, -8.4], [2.4, -6.2], [1.8, -4.4]].map(([x, z]) => [x, z, 2.0, -1e9] as [number, number, number, number]),
      // the crest's foot and the river below it, cleared for the works (so the dam reads from the south)
      ...[[-35, -32], [-30, -32], [-25, -32.2], [-20.5, -32.4], [-17.5, -33], [-28, -29.5], [-22, -29.6]].map(([x, z]) => [x, z, 2.6, 1964] as [number, number, number, number]),
      // the dig on Phu Kum Khao's slope
      [DIG[0], DIG[1], 3.4, 1990],
      // the hall and the fair ground
      [HALL[0], HALL[1], 3.0, 2005],
      [FAIR[0], FAIR[1] - 1.2, 4.6, 2005],
    ],
    paddies: [1700, 1760],
    sites: [
      [WAT_NUEA[0], WAT_NUEA[1], 1.5],
      [WAT_KLANG[0], WAT_KLANG[1], 1.2],
      [WAT_TAI[0], WAT_TAI[1], 1.5],
      [SOMPHAMIT[0], SOMPHAMIT[1], 0.5],
      [PILLAR[0], PILLAR[1], 0.6],
      [FIRST_PILLAR[0], FIRST_PILLAR[1], 0.8],
      [10.6, -12.4, 2.2],
      [13.6, -14.0, 2.4],
      [16.2, -19.8, 3.0],
      [-1.6, 8.0, 1.8],
      [DIG[0], DIG[1], 2.8],
      [HALL[0], HALL[1], 2.8],
      [FAIR[0], FAIR[1] - 1.2, 4.2],
      [SHAWL_AT[0], SHAWL_AT[1], 2.0],
      [UNIVERSITY[0], UNIVERSITY[1], 1.2],
    ],
    footprints: FOUND_HOUSES.map(([x, z], j) => ({fp: {rect: [x, z, 1.2, 1.2] as [number, number, number, number]}, from: 1781, label: `stilt house ${j}`})),
    openGround: [
      {x0: FAIR[0] - 4.6, x1: FAIR[0] + 4.0, z0: FAIR[1] - 5.6, z1: FAIR[1] + 2.6},
      {x0: POND_C[0] - 7, x1: POND_C[0] + 6, z0: POND_C[1] - 7, z1: POND_C[1] + 6},
    ],
    urban: {from: 1975, rate: 0.6},
    urbanBox: {x0: -14, x1: 44, z0: -26, z1: 32},
    // a low provincial town: no towers
    sprawl: {height: 0.45, tall: 0.02},
    highRise: 1e9,
    towers: [],
    roads: [
      // the old street east from the pillar (after the pillar's move)
      ...segs(OLD_STREET, 0.6, 1830),
      ...segs(SOUTH_ROAD, 0.7, 1960, 0.2),
      ...segs(N_ROAD, 0.7, 1965, 0.2),
      ...segs(SE_ROAD, 0.7, 1966, 0.2),
      ...segs(NE_ROAD, 0.7, 1976, 0.2),
      ...segs(BYPASS, 0.8, 1990, 0.2),
    ],
    ringRoadYear: 1e9,
    cars: [1960, 2026],
    boats: [1780, 1960],
    finale: 'fireworks',
    life: {
      buffalo: [
        {x: -14, z: 18, r: 3, count: 4, from: 1780, to: 1990},
        {x: 22, z: 20, r: 3, count: 4, from: 1780, to: 1990},
      ],
      people: [{x: FAIR[0], z: FAIR[1] + 0.6, r: 3.2, count: 34, from: 2021, to: 2027}],
      stalls: [{x: FAIR[0] - 0.4, z: FAIR[1] + 1.8, r: 2.2, count: 10, from: 2021, to: 2027}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: KalasinLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_kalasin.wav',
  sky: {
    top: [
      [1777, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1777, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1777, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1782) / 60))),
  gloom: () => 0,
};
