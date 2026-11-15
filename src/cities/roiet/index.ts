import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {RoietLandmarks} from './Landmarks';
import {ACTORS, atAlong} from './actors';
import {
  BUENG_C, MAIN_ROAD, MOAT, MOAT_W, N_ROAD, PILLAR, SE_ROAD, STRIP, SW_ROAD, TILE, TOWER, TOWER_R, TOWN, WAT_BUENG,
  WAT_BURAPHA, WAT_KLANG, WAT_NUEA, WAT_SA_THONG, WOT_AT, WOT_S,
} from './places';
import {STORY} from './timeline';

// World origin = the city pillar on the island in บึงพลาญชัย (places.ts), 100 m/unit, +x east, +z south, everything at true
// scale. The Dvaravati moat is the first river (a closed loop), crossed by its old causeway (later the bridge of ถนนปัทมานนท์)
// and by the modern roads' bridges. No wall is drawn (an earth bank long gone); the engine's `city` is the town inside the
// moat, forest (ดงกุ่ม) at the cover, cleared in the founding beat and filled with houses through the plane beat.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));
const at = (p: P) => atAlong([...MOAT, MOAT[0]], p);

export const ROIET: CityConfig = {
  id: 'roiet',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ร้อยเอ็ด', sub: 'สาเกตนคร เมืองกลางบึงพลาญชัย'},
    finale: {kicker: 'พ.ศ. 2318 – 2569', title: 'ร้อยเอ็ด', sub: 'งามน่ายลบึงพลาญชัย'},
    approxBefore: 1775,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [],
    rivers: [{path: MOAT, width: MOAT_W, closed: true}],
    bridges: [
      // the old causeway at the south (the founders come in over it), later ถนนปัทมานนท์'s bridge
      {at: at([-5.25, 7.9]), year: 1700, modernYear: 1960, river: 0},
      // ถนนเทวาภิบาล / แจ้งสนิท over the west and east sides, ทล.214 north, ถนนสุริยเดชบำรุง south
      {at: at([-9.85, 3.0]), year: 1934, modernYear: 1965, river: 0},
      {at: at([6.55, 3.85]), year: 1934, modernYear: 1965, river: 0},
      {at: at([-1.2, -8.5]), year: 1939, modernYear: 1968, river: 0},
      {at: at([1.25, 7.5]), year: 1949, modernYear: 1970, river: 0},
    ],
    noMoat: true,
    noWall: true,
    city: {
      hx: 9,
      hz: 9,
      outline: TOWN,
      // no wall is drawn (noWall); these years only clear the town's ground with the founding
      moat: [1771.4, 1771.5],
      wall: [1771.4, 1771.5],
      gates: [1771.4, 1771.5],
      groundFrom: 1772.0,
    },
    gates: [],
    rail: undefined,
    trains: [],
    houses: {
      // the town fills the moat through the plane beat (the counter runs 2343-2465)
      built: [1776, 100],
      modern: [1950, 60],
      // the temples, the bueng's park and the tower are `sites` and `openGround`; the pillar's island is water-locked
      keepOut: [
        [TOWER[0], TOWER[1], 1.0],
      ],
    },
    villages: {
      // rice villages round the paddies outside the moat
      centers: [[-22, -16], [16, -24], [-26, 18], [28, 16], [-14, 30], [30, -10], [-30, -2]],
      built: [1700, 60],
    },
    forestCity: 1771.4,
    clearings: [
      // the paddy the cover's wot stands on (town later)
      [WOT_AT[0], WOT_AT[1], WOT_S * 0.18, -1e9],
      // the moat's banks and the bueng's shore stay open, so the water reads from the cover on
      ...MOAT.map(([x, z]) => [x, z, 1.6, -1e9] as [number, number, number, number]),
      [BUENG_C[0], BUENG_C[1], 4.4, -1e9],
      // the founders' track up from the south and over the causeway
      ...[[-9.0, 30.0], [-8.4, 25.0], [-8.0, 22.0], [-7.4, 18.4], [-6.8, 15.0], [-6.2, 12.6], [-5.6, 10.6], [-5.2, 8.6]].map(
        ([x, z]) => [x, z, 1.8, -1e9] as [number, number, number, number],
      ),
      // the airstrip, cleared a few years before the plane lands
      ...[0, 0.25, 0.5, 0.75, 1].map((f) => [STRIP[0][0] + (STRIP[1][0] - STRIP[0][0]) * f, STRIP[0][1] + (STRIP[1][1] - STRIP[0][1]) * f, 2.2, 1905] as [number, number, number, number]),
    ],
    paddies: [1650, 1740],
    sites: [
      [WAT_BUENG[0], WAT_BUENG[1], 1.3],
      [WAT_KLANG[0], WAT_KLANG[1], 1.3],
      [WAT_SA_THONG[0], WAT_SA_THONG[1], 1.3],
      [WAT_NUEA[0], WAT_NUEA[1], 1.3],
      [WAT_BURAPHA[0], WAT_BURAPHA[1], 1.0],
      [TOWER[0], TOWER[1], TOWER_R],
      [PILLAR[0], PILLAR[1], 0.4],
    ],
    openGround: [
      // the bueng and its park
      {x0: -4.3, x1: 1.4, z0: -4.1, z1: 2.6},
      // the old airstrip
      {x0: -8.8, x1: -5.4, z0: -20.2, z1: -10.2},
    ],
    urban: {from: 1945, rate: 0.55},
    urbanBox: {x0: -36, x1: 36, z0: -38, z1: 36},
    // a low provincial town: no towers but the one
    sprawl: {height: 0.5, tall: 0.03},
    highRise: 1e9,
    towers: [],
    roads: [
      ...segs(MAIN_ROAD, 0.7, 1934),
      ...segs(N_ROAD, 0.7, 1939),
      ...segs(SW_ROAD, 0.6, 1940),
      ...segs(SE_ROAD, 0.6, 1949),
    ],
    ringRoadYear: 1e9,
    cars: [1950, 2026],
    boats: [3000, 3001],
    finale: 'fireworks',
    life: {
      buffalo: [
        {x: 20, z: 22, r: 3, count: 4, from: 1700, to: 1970},
        {x: -20, z: 22, r: 3, count: 4, from: 1700, to: 1970},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: RoietLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_roiet.wav',
  sky: {
    top: [
      [1774, '#6aa2cc'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1774, '#ece2bf'],
      [1900, '#e6ecd6'],
      [2026, '#d6e8f4'],
    ],
    ground: [[1774, '#aaa262'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1774) / 60))),
  gloom: () => 0,
};
