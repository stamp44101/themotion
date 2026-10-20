import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {ChiangRaiLandmarks} from './Landmarks';
import {ACTORS, RUNWAY} from './actors';
import {
  AIRFIELD, CHOM_THONG, CHOM_THONG_H, GATE_CM, GATE_N, GATE_WAI, GOLD_CLOCK, KLANG_WIANG, KOH_LOI, KOK, KOK_S, KOK_S_W, KOK_W, MONUMENT, NGAM_MUEANG, NORTH_ROAD, OLD_CLOCK, PHRA_KAEW,
  RONG_KHUN, SW_ROAD, THANALAI_Z, WALL,
} from './places';
import {STORY} from './timeline';

// World origin = the ONEP core centroid (19.910348, 99.830185), 80 m/unit, +x east, -z north.
// The wall from the ONEP core ring, the Kok from OSM, pins from docs/briefs/chiangrai_field.md.
export const CHIANGRAI: CityConfig = {
  id: 'chiangrai',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เชียงราย', sub: 'เมืองพญามังราย ริมแม่น้ำกก'},
    finale: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เชียงราย', sub: 'เหนือสุดในสยาม'},
    approxBefore: 1500,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -48, z1: 48},
    peaks: [
      // ดอยจอมทอง: ~40 m over the town, drawn ~4x so it stands up as Mangrai's hill
      [CHOM_THONG[0], CHOM_THONG[1], CHOM_THONG_H, 2.2],
      // the Thai-Myanmar range and ดอยตุง's massif behind, north and west, as backdrop
      [-42, -40, 9, 9],
      [-14, -45, 7, 8],
      [14, -45, 6, 7],
      [-45, -14, 6, 8],
    ],
    rivers: [
      {path: KOK, width: KOK_W},
      {path: KOK_S, width: KOK_S_W},
    ],
    bridges: [],
    noMoat: false,
    rail: undefined,
    trains: [],
    city: {
      hx: 11.3,
      hz: 4.7,
      outline: WALL,
      // 2386: brick wall, bastions and a moat round a trapezoid extended east (ณัฐกร 2564)
      moat: [1840, 1842],
      wall: [1841, 1843.3],
      gates: [1842.4, 1843.4],
      // taken down over 2450-2460; the moat survives on the south-west corner
      decay: [1897, 1918, 9999, 9999],
      ruinStrength: 1,
      groundFrom: 1262,
    },
    gates: [
      {x: GATE_CM[0], z: GATE_CM[1], rot: 0.8, width: 1.1},
      {x: GATE_WAI[0], z: GATE_WAI[1], rot: 0, width: 1.1},
      {x: GATE_N[0], z: GATE_N[1], rot: -0.4, width: 1.0},
    ],
    houses: {
      built: [1262, 220],
      // emptied under the Burmese wars, re-founded 2386
      abandon: {prob: 0.92, from: 1785, spread: 25, rebuild: 1840.5, rebuildSpread: 3},
      modern: [1930, 70],
      keepOut: [
        [KLANG_WIANG[0], KLANG_WIANG[1], 1.6],
        [PHRA_KAEW[0], PHRA_KAEW[1] + 0.6, 1.8],
        [OLD_CLOCK[0], OLD_CLOCK[1], 0.6],
      ],
    },
    villages: {
      centers: [
        [20, 10],
        [-22, 16],
        [12, 26],
        [-30, -24],
        [26, -24],
      ],
      built: [1300, 1500],
    },
    forestCity: 1200,
    // forest takes back the empty town, then the 2386 settlers clear it
    regrowCity: [1755, 1840],
    clearings: [
      // the frame-0 temple's court and pool at hero scale (actors.ts HERO_AT), open ground from
      // then on. South of the walls so it never covers the town: a clearing with no end year
      // would remove the forest that takes the empty town back before 2386
      [-5.8, 32.1, 22, -1e9],
      // the elephant's way along the south bank to the hill (founding beat)
      [2, -5.6, 2.4, -1e9],
      [-4, -6.0, 2.2, -1e9],
      // the procession's way south out of the town (1436)
      [-7.2, 6.4, 2.6, 1400],
      [-8.2, 12, 2.4, 1400],
      [-8.8, 17, 2.4, 1400],
      // the caravan's way up from the south (1843)
      [1.6, 14, 2.4, 1800],
      [1.8, 21, 2.4, 1800],
      [PHRA_KAEW[0], PHRA_KAEW[1], 2.0, 1300],
      [AIRFIELD[0], AIRFIELD[1], 6.5, 1922],
      [RONG_KHUN[0], RONG_KHUN[1], 9, 1996],
      [GOLD_CLOCK[0], GOLD_CLOCK[1], 1.6, 2003],
      [MONUMENT[0], MONUMENT[1], 1.4, 1962],
    ],
    // rice along the Kok valley long before the town
    paddies: [800, 1100],
    sites: [
      [CHOM_THONG[0], CHOM_THONG[1], 1.0],
      [NGAM_MUEANG[0], NGAM_MUEANG[1], 0.5],
      [PHRA_KAEW[0], PHRA_KAEW[1] + 0.8, 1.7],
      [KLANG_WIANG[0], KLANG_WIANG[1], 1.5],
      [OLD_CLOCK[0], OLD_CLOCK[1], 0.5],
      [GOLD_CLOCK[0], GOLD_CLOCK[1], 1.5],
      [MONUMENT[0], MONUMENT[1], 1.2],
      [RONG_KHUN[0], RONG_KHUN[1], 6],
    ],
    footprints: [
      {fp: {disc: [PHRA_KAEW[0], PHRA_KAEW[1], 0.8]}, from: 1300, label: 'วัดพระแก้ว chedi'},
      {fp: {rect: [PHRA_KAEW[0], PHRA_KAEW[1] + 2.0, 1.4, 2.6]}, from: 1440, label: 'วัดพระแก้ว viharn'},
      {fp: {rect: [KLANG_WIANG[0], KLANG_WIANG[1], 1.6, 3.0]}, from: 1843, label: 'วัดกลางเวียง'},
      {fp: {disc: [OLD_CLOCK[0], OLD_CLOCK[1], 0.4]}, from: 1967, label: 'หอนาฬิกาเก่า'},
      // the gold tower stands on the old south wall line, decades after the wall came down
      {fp: {disc: [GOLD_CLOCK[0], GOLD_CLOCK[1], 1.5]}, from: 2004, label: 'หอนาฬิกาทอง', onWall: true},
      {fp: {disc: [MONUMENT[0], MONUMENT[1], 1.2]}, from: 1963, label: 'อนุสาวรีย์พญามังราย', onWall: true},
      {fp: {rect: [RONG_KHUN[0], RONG_KHUN[1], 10, 10]}, from: 1997, label: 'วัดร่องขุ่น'},
      {fp: {rect: [RUNWAY.x + 0.6, (RUNWAY.z0 + RUNWAY.z1) / 2, RUNWAY.w + 4.2, RUNWAY.z1 - RUNWAY.z0 + 1.6]}, from: 1923, label: 'สนามบินเก่า (strip, apron, hangar)'},
    ],
    openGround: [
      // the old airfield and the island park stay open as the town grows round them
      {x0: AIRFIELD[0] - 2, x1: AIRFIELD[0] + 2, z0: AIRFIELD[1] - 6, z1: AIRFIELD[1] + 6},
      {x0: KOH_LOI[0] - 1.6, x1: KOH_LOI[0] + 1.6, z0: KOH_LOI[1] - 0.8, z1: KOH_LOI[1] + 0.8},
      {x0: RONG_KHUN[0] - 6, x1: RONG_KHUN[0] + 6, z0: RONG_KHUN[1] - 6, z1: RONG_KHUN[1] + 6},
    ],
    urban: {from: 1935, rate: 1.4},
    sprawl: {height: 0.75, tall: 0.03},
    highRise: 1990,
    towers: [],
    roads: [
      // ถนนธนาลัย (2438), dug across the streets beat (Landmarks.tsx) and finished in 1897
      {from: [-8.8, THANALAI_Z], to: [13.3, THANALAI_Z], width: 0.8, year: 1897},
      // ถนนบรรพปราการ and พหลโยธินสายใน on the old south and east wall lines, once the walls are down
      {from: [-7.4, 5.6], to: [12.3, 6.0], width: 0.8, year: 1918},
      {from: [14.0, -0.6], to: [14.0, 5.8], width: 0.8, year: 1918},
      // north over the Kok (สะพานพญามังราย)
      {from: NORTH_ROAD[0], to: NORTH_ROAD[1], width: 0.9, year: 1950},
      // พหลโยธิน south-west to Chiang Mai, past วัดร่องขุ่น
      {from: SW_ROAD[0], to: SW_ROAD[1], width: 1.0, year: 1935},
      // south to the old airfield
      {from: [GOLD_CLOCK[0] - 0.6, 6.4], to: [AIRFIELD[0] + 1.6, AIRFIELD[1] - 4], width: 0.8, year: 1923},
      // east to the Mekong side
      {from: [14.4, 1.5], to: [48, 6], width: 0.9, year: 1960},
    ],
    // no engine ring road: a rectangle round the centre would cut the trapezoid's corners
    ringRoadYear: 1e9,
    cars: [1950, 2026],
    boats: [1262, 1960],
    finale: 'lanterns',
    life: {
      buffalo: [{x: 20, z: 14, r: 4, count: 5, from: 1300, to: 1960}],
      // the crowd round the gold clock tower's light show (design beat)
      people: [
        {x: GOLD_CLOCK[0] - 2.6, z: GOLD_CLOCK[1] + 0.4, r: 0.9, count: 16, from: 2010, to: 2026},
        {x: GOLD_CLOCK[0] + 2.6, z: GOLD_CLOCK[1] + 0.6, r: 0.9, count: 16, from: 2010, to: 2026},
        {x: GOLD_CLOCK[0], z: GOLD_CLOCK[1] - 2.6, r: 0.9, count: 14, from: 2010, to: 2026},
      ],
      stalls: [{x: GOLD_CLOCK[0] + 4.2, z: GOLD_CLOCK[1] - 2.2, r: 1.0, count: 8, from: 1990, to: 2026}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: ChiangRaiLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_chiangrai.wav',
  rain: [[7.8, 12.0]],
  sky: {
    top: [
      [0, '#62a2cf'],
      [2026, '#4d90d4'],
    ],
    bottom: [
      [0, '#efe9d2'],
      [2026, '#d9e9f4'],
    ],
    ground: GROUND,
  },
  ambient: (Y) => 0.25 * (1 - Math.min(1, Math.max(0, (Y - 1300) / 200))),
  gloom: () => 0,
};
