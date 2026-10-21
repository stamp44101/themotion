import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {PhuketLandmarks} from './Landmarks';
import {ACTORS, HEROES} from './actors';
import {
  AIRPORT, BANG_YAI, BANG_YAI_W, BATTLE, BIG_BUDDHA, BURMESE_CAMP, CHARTERED, CHINPRACHA, CORE, DIBUK_RD_Z, EDGE, HEROINES, JUI_TUI, KATHU, KRABI_RD_Z, LANDING, LIPON,
  MAI_KHAO, NORTH_BEACH_W, NORTH_BEACH_X, NORTH_ROAD, OLD_TOWN_X, SAPHAN_HIN, STOCKADE, THALANG_RD_Z, TRACK, WEST_BEACH_W,
} from './places';
import {STORY} from './timeline';

// World origin = the ONEP core centroid (7.878381, 98.392508), 80 m/unit, +x east, -z north.
// The core from ONEP record 0 (phuket_onep/), pins from docs/briefs/phuket_field.md. The tile is
// the tin town at true scale; Thalang, Mai Khao, Sarasin, Kathu and the Big Buddha are pulled in
// along their bearings. No wall, no moat: Phuket town was never walled.
const segs = (pts: [number, number][], r: number, year: number) =>
  pts.slice(1).flatMap(([x1, z1], i) => {
    const [x0, z0] = pts[i];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, z1 - z0) / (r * 1.2)));
    return Array.from({length: n}, (_, k) => [x0 + ((x1 - x0) * k) / n, z0 + ((z1 - z0) * k) / n, r, year] as [number, number, number, number]);
  });

export const PHUKET: CityConfig = {
  id: 'phuket',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ภูเก็ต', sub: 'เกาะดีบุก กลางทะเลอันดามัน'},
    finale: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ภูเก็ต', sub: 'ไข่มุกอันดามัน'},
    approxBefore: 1800,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -48, z1: 48},
    // the island's granite spine at real height (80 m a unit): the Kathu-Patong ridge, เขารัง
    // above the town, เขานาคเกิด under the Big Buddha, the hills south toward Chalong, and
    // เขาพระแทว east of Thalang
    peaks: [
      [-21, -4, 5, 4.5],
      [-18.6, -13.3, 1.7, 2.8],
      [BIG_BUDDHA[0], BIG_BUDDHA[1], 5.2, 6.5],
      [-18, 36, 4, 6.5],
      [7, -40, 4.5, 5],
    ],
    rivers: [
      // the sea is all round the tile (Landmarks.tsx); inside it only the canal
      {path: BANG_YAI, width: BANG_YAI_W},
    ],
    bridges: [],
    noMoat: true,
    noWall: true,
    rail: undefined,
    trains: [],
    city: {hx: 15.1, hz: 23.5, outline: CORE, moat: [1850, 1850.1], wall: [1850, 1850.1], gates: [1850, 1850.1], groundFrom: 1850},
    gates: [],
    houses: {
      built: [1850, 50],
      modern: [1960, 60],
      keepOut: [
        [CHINPRACHA[0], CHINPRACHA[1], 1.4],
        [JUI_TUI[0], JUI_TUI[1], 1.0],
        [CHARTERED[0] - 1.3, CHARTERED[1] + 1.0, 1.2],
      ],
    },
    villages: {
      // Thalang's villages in the north, fishing villages on the coasts
      centers: [
        [-4, -36],
        [12, -24],
        [-26, 6],
        [-12, 30],
        [8, -14],
      ],
      built: [1600, 1750],
    },
    forestCity: 1849,
    clearings: [
      // the cover turtles' beach on the west coast, open sand at hero scale
      // the west beach (the Andaman shore) and Mai Khao's beach on the north shore, open sand
      ...Array.from({length: 33}, (_, i) => [-EDGE + WEST_BEACH_W / 2, -EDGE + i * 3, WEST_BEACH_W / 2 + 1.2, -1e9] as [number, number, number, number]),
      ...Array.from({length: Math.ceil((NORTH_BEACH_X[1] - NORTH_BEACH_X[0]) / 3) + 1}, (_, i) => [NORTH_BEACH_X[0] + i * 3, -EDGE + NORTH_BEACH_W / 2, NORTH_BEACH_W / 2 + 1.2, -1e9] as [number, number, number, number]),
      // the cover's turtles at hero scale
      ...HEROES.map((h) => [-EDGE + 9, h.z, 12, -1e9] as [number, number, number, number]),
      // Bowrey's forest track up to Luppoone, and the landing
      ...segs(TRACK, 3.0, -1e9),
      [LANDING[0], LANDING[1], 3.5, -1e9],
      [LIPON[0], LIPON[1], 3, -1e9],
      // the 1785 field between the camp and the stockade
      [BURMESE_CAMP[0], BURMESE_CAMP[1], 4.5, -1e9],
      [STOCKADE[0] - 2.5, STOCKADE[1], 3.5, -1e9],
      [-23, -39, 4, -1e9],
      [BATTLE[0], BATTLE[1], 2.5, -1e9],
      // the canal's tin workings from Kathu down to the town
      ...segs(BANG_YAI.slice(0, 4), 3.2, 1848),
      [KATHU[0], KATHU[1], 2.4, 1824],
      // Mai Khao's beach: the payoff's nests, the crowd
      [MAI_KHAO[0] - 2, MAI_KHAO[1] + 4, 9, -1e9],
      [HEROINES[0], HEROINES[1], 1.8, 1966],
      [BIG_BUDDHA[0], BIG_BUDDHA[1], 2.6, 2001],
      ...segs(NORTH_ROAD, 1.4, 1960),
    ],
    paddies: [1700, 1900],
    sites: [
      [CHINPRACHA[0], CHINPRACHA[1], 1.2],
      [JUI_TUI[0], JUI_TUI[1], 0.8],
      [CHARTERED[0] - 1.3, CHARTERED[1] + 1.0, 1.1],
      [KATHU[0], KATHU[1], 1.2],
      [HEROINES[0], HEROINES[1], 1.4],
      [STOCKADE[0], STOCKADE[1], 1.8],
      [BIG_BUDDHA[0], BIG_BUDDHA[1], 2.2],
      [LIPON[0], LIPON[1], 1.2],
    ],
    footprints: [
      {fp: {rect: [CHINPRACHA[0], CHINPRACHA[1], 1.6, 1.4]}, from: 1903, label: 'บ้านชินประชา'},
      {fp: {rect: [CHARTERED[0] - 1.3, CHARTERED[1] + 1.0, 1.4, 1.4]}, from: 1907, label: 'ธนาคารชาร์เตอร์ด'},
      {fp: {disc: [KATHU[0], KATHU[1], 1.0]}, from: 1825, label: 'ศาลเจ้ากะทู้'},
      {fp: {disc: [JUI_TUI[0], JUI_TUI[1], 0.7]}, from: 1880, label: 'ศาลเจ้าจุ้ยตุ่ย'},
      {fp: {disc: [HEROINES[0], HEROINES[1], 1.3]}, from: 1967, label: 'อนุสาวรีย์วีรสตรี'},
      {fp: {disc: [BIG_BUDDHA[0], BIG_BUDDHA[1], 2.0]}, from: 2002, label: 'พระใหญ่'},
      // the shophouse rows on ถลาง, ดีบุก and กระบี่
      {fp: {rect: [(OLD_TOWN_X[0] + OLD_TOWN_X[1]) / 2, THALANG_RD_Z, OLD_TOWN_X[1] - OLD_TOWN_X[0], 3.2]}, from: 1901, label: 'ตึกแถวถนนถลาง'},
      {fp: {rect: [(OLD_TOWN_X[0] + OLD_TOWN_X[1]) / 2, (DIBUK_RD_Z + KRABI_RD_Z) / 2 - 0.4, OLD_TOWN_X[1] - OLD_TOWN_X[0], 1.6]}, from: 1901, label: 'ตึกแถวดีบุก/กระบี่'},
    ],
    openGround: [
      // the airport by Mai Khao from 1979, and the beach in front of it
      {x0: AIRPORT[0] - 1.5, x1: AIRPORT[0] + 5, z0: AIRPORT[1] - 1.2, z1: AIRPORT[1] + 1.2},
      {x0: NORTH_BEACH_X[0], x1: MAI_KHAO[0] + 1.5, z0: -EDGE, z1: -EDGE + NORTH_BEACH_W + 1},
      {x0: -EDGE, x1: -EDGE + WEST_BEACH_W, z0: -EDGE, z1: EDGE},
    ],
    urban: {from: 1960, rate: 1.3},
    sprawl: {height: 0.8, tall: 0.04},
    highRise: 1990,
    towers: [],
    roads: [
      // the old town's streets: ถลาง, ดีบุก, กระบี่ east-west, ถนนภูเก็ต south to Saphan Hin
      {from: [OLD_TOWN_X[0], THALANG_RD_Z], to: [OLD_TOWN_X[1], THALANG_RD_Z], width: 0.5, year: 1880},
      {from: [OLD_TOWN_X[0], DIBUK_RD_Z - 1.0], to: [OLD_TOWN_X[1], DIBUK_RD_Z - 1.0], width: 0.4, year: 1905},
      {from: [CHARTERED[0], -12.6], to: [CHARTERED[0], 3], width: 0.6, year: 1905},
      {from: [CHARTERED[0], 3], to: [SAPHAN_HIN[0], SAPHAN_HIN[1]], width: 0.6, year: 1905},
      {from: [-13, CHARTERED[1]], to: [12, CHARTERED[1]], width: 0.5, year: 1905},
      // ถนนเทพกระษัตรี north past the heroines to the Sarasin bridge (open 1967)
      ...NORTH_ROAD.slice(1).map((p, i) => ({from: NORTH_ROAD[i], to: p, width: 0.8, year: i === NORTH_ROAD.length - 2 ? 1967 : 1930})),
      // west over the ridge to Kathu and on to the west coast
      {from: [-13, -6], to: [KATHU[0], KATHU[1]], width: 0.7, year: 1930},
    ],
    ringRoadYear: 1e9,
    cars: [1967, 2026],
    boats: [9998, 9999],
    finale: 'fireworks',
    life: {
      buffalo: [{x: 8, z: -20, r: 3.5, count: 5, from: 1700, to: 1960}],
      people: [{x: -7, z: THALANG_RD_Z, r: 1.2, count: 18, from: 1905, to: 2026}],
      stalls: [{x: -9, z: KRABI_RD_Z - 1.6, r: 1.0, count: 8, from: 1980, to: 2026}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: PhuketLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_phuket.wav',
  sky: {
    top: [
      [0, '#5fa6d6'],
      [2026, '#4a95db'],
    ],
    bottom: [
      [0, '#f1ead6'],
      [2026, '#dcecf6'],
    ],
    ground: GROUND,
  },
  ambient: (Y) => 0.2 * (1 - Math.min(1, Math.max(0, (Y - 1800) / 120))),
  gloom: () => 0,
};
