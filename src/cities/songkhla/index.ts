import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {SongkhlaLandmarks} from './Landmarks';
import {ACTORS, HERO_AT, HERO_H, LINE, SINGORA_HUTS, STATUE_AT} from './actors';
import {
  BO_YANG, BRIDGE_N, KHAO_DAENG, KHAO_KHIAO, KHAO_MUEANG, KHAO_NOI, KO_YO, MERMAID, OLD_STATION,
  OSM_ROADS, PILLAR, PUPPET_BACK, SHOPHOUSES, SINGORA, STAGE, TANG_KUAN, TILE, WATER_CLEARINGS, inWater,
} from './places';
import {STORY} from './timeline';

// World origin = the city pillar (places.ts), 100 m/unit, +x east, +z south, everything at true scale. The two waters are
// flat shapes drawn by Landmarks.tsx (the engine knows only path rivers), so they are kept clear here: a 2-unit grid of
// clearings (no tree) and sites (no house, hut or block) over both. The walled town of Bo Yang is the engine's `city`: its
// stone wall rises 2379-2385 and is pulled down 2437-2448 (a low ruin stays); the houses fill it from 2381. Singora, its
// forts, the junks, the railway, the mermaid, the bridge and the show are Landmarks.tsx.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));

export const SONGKHLA: CityConfig = {
  id: 'songkhla',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สงขลา', sub: 'เมืองสองทะเล ริมปากทะเลสาบ'},
    finale: {kicker: 'พ.ศ. 2223 – 2569', title: 'สงขลา', sub: 'สมิหลาเพลินใจ เมืองใหญ่สองทะเล'},
    approxBefore: 1680,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [
      [KHAO_DAENG[0], KHAO_DAENG[1], 2.4, 4.6],
      [KHAO_NOI[0], KHAO_NOI[1], 1.3, 3.0],
      [KHAO_MUEANG[0], KHAO_MUEANG[1], 1.6, 3.4],
      [TANG_KUAN[0], TANG_KUAN[1], 1.3, 2.2],
      [KHAO_KHIAO[0], KHAO_KHIAO[1], 1.4, 3.0],
      [KO_YO[0], KO_YO[1], 2.0, 4.0],
    ],
    rivers: [],
    bridges: [],
    noMoat: true,
    city: {
      hx: 3.4,
      hz: 5.9,
      outline: BO_YANG,
      moat: [1836, 1836.1],
      wall: [1836, 1842],
      gates: [1840, 1842],
      // the wall pulled down for its stone 2437-2448: a low ruin stays (the stretches on ถนนจะนะ and ถนนนครใน)
      decay: [1894, 1905, 1e9, 1e9],
      ruinStrength: 0.85,
      groundFrom: 1834,
    },
    gates: [],
    rail: undefined,
    trains: [],
    houses: {
      // the walled town fills from the move through the trade beat (the counter runs 2373-2439 without a jump)
      built: [1838, 34],
      modern: [1967, 36],
      keepOut: [[PILLAR[0], PILLAR[1], 0.9]],
    },
    villages: {
      // fishing villages on the spit and on the far shore, built while the counter runs through the trade beat
      centers: [[8, 22], [-18, -6], [-30, 0], [6, 30]],
      built: [1846, 1890],
    },
    forestCity: 1834,
    clearings: [
      ...WATER_CLEARINGS,
      // the cover puppet's sand on the spit (it becomes town later)
      [HERO_AT[0], HERO_AT[1], HERO_H * 0.2, -1e9],
      // the beach at Samila: open sand all along the Gulf shore of the spit
      ...Array.from({length: 12}, (_, i) => [3.0 + i * 2.2, -22 + i * 3.6, 2.0, -1e9] as [number, number, number, number]),
      [STAGE[0], STAGE[1] + 1.5, 3.6, -1e9],
      [PUPPET_BACK[0], PUPPET_BACK[1], 2.4, -1e9],
      [STATUE_AT[0], STATUE_AT[1] + 1.6, 3.0, -1e9],
      // Singora's ground under Khao Daeng, cleared as the port is founded (before its huts go up)
      ...SINGORA_HUTS.map(([x, z]) => [x, z, 1.1, 1603] as [number, number, number, number]),
      [SINGORA[0] - 1.8, SINGORA[1] + 1.8, 3.2, 1603],
      // the army's road in from the west, under Khao Noi
      ...[[-37.0, -25.4], [-34.6, -25.8], [-32.2, -26.4], [-30.2, -27.0], [-28.6, -27.4]].flatMap(([x, z]) => [
        [x, z, 2.6, 1603] as [number, number, number, number],
        // and the ground between it and the camera (south-east), so the forest does not hide the armies
        [x + 2.2, z + 2.6, 2.4, 1603] as [number, number, number, number],
      ]),
      // Bo Yang's ground on the lake shore, cleared as the move begins (the trees fade before the wall rises)
      ...[[-2.4, -5.0], [0.0, -4.4], [-1.2, -2.0], [0.8, -1.0], [-0.6, 1.6], [1.2, 2.6], [0.4, 4.2], [-3.4, -3.6]].map(([x, z]) => [x, z, 2.0, 1830] as [number, number, number, number]),
      // the mansion and the station
      [-2.4, -7.3, 1.6, 1870],
      [OLD_STATION[0] + 1.2, OLD_STATION[1] + 0.2, 2.0, 1905],
      // the railway's bed down the spit, cleared as the counter enters the train beat
      ...LINE.slice(1).flatMap((b, i) => {
        const a = LINE[i];
        const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.5);
        return Array.from({length: n}, (_, j) => [a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n, 1.2, 1905] as [number, number, number, number]);
      }),
      // the bridge's landing on the Singhanakhon shore
      [BRIDGE_N[0][0], BRIDGE_N[0][1], 1.6, 1980],
    ],
    paddies: [1700, 1800],
    sites: [
      // over the water; a smaller disc at the shore so the shore roads stay clear of it
      ...WATER_CLEARINGS.flatMap(([x, z]) => {
        const ring = (r: number) => [[r, 0], [-r, 0], [0, r], [0, -r], [r * 0.7, r * 0.7], [-r * 0.7, r * 0.7], [r * 0.7, -r * 0.7], [-r * 0.7, -r * 0.7]].every(([dx, dz]) => inWater(x + dx, z + dz));
        return ring(1.5) ? [[x, z, 1.45] as [number, number, number]] : ring(0.9) ? [[x, z, 0.8] as [number, number, number]] : [];
      }),
      [PILLAR[0], PILLAR[1], 0.7],
      [-2.4, -7.3, 1.35],
      [OLD_STATION[0] + 1.2, OLD_STATION[1] + 0.2, 1.8],
      [STATUE_AT[0], STATUE_AT[1], 1.4],
      [STAGE[0], STAGE[1] + 1.5, 3.2],
      [PUPPET_BACK[0], PUPPET_BACK[1], 1.6],
      // Singora's ruins and forts stay open ground (the archaeological site)
      [SINGORA[0] - 1.8, SINGORA[1] + 1.8, 5.4],
      [-23.8, -21.6, 1.6],
      [-21.4, -23.2, 1.6],
      [-26.4, -22.6, 1.6],
      [TANG_KUAN[0], TANG_KUAN[1], 1.4],
    ],
    footprints: [
      ...LINE.slice(1).map((b, i) => ({fp: {band: [LINE[i], b, 1.0] as [P, P, number]}, from: 1905, label: `railway ${i}`})),
      // the shophouse rows (Landmarks.tsx shopK: row j from 1848 + 4j)
      ...SHOPHOUSES.map(([x, z], j) => ({fp: {rect: [x, z, 1.0, 1.5] as [number, number, number, number]}, from: 1848 + j * 4, label: `shophouse row ${j}`})),
    ],
    openGround: [
      // the navy airfield in the south-east of town
      {x0: 13.5, x1: 21.5, z0: 6.0, z1: 16.5},
      // Samila's open sand round the mermaid
      {x0: MERMAID[0] - 2.5, x1: MERMAID[0] + 2.5, z0: MERMAID[1] - 1.0, z1: MERMAID[1] + 3.5},
    ],
    urban: {from: 1967, rate: 0.25},
    urbanBox: {x0: TILE.x0, x1: TILE.x1, z0: TILE.z0, z1: TILE.z1},
    sprawl: {height: 0.6, tall: 0.04},
    highRise: 1990,
    towers: [],
    roads: [
            ...OSM_ROADS.flatMap(([, year, width, pts]) => segs(pts, width, Math.max(1967, year))),
    ],
    ringRoadYear: 1e9,
    cars: [1967, 2026],
    boats: [1600, 2026],
    finale: 'fireworks',
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: SongkhlaLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_songkhla.wav',
  sky: {
    top: [
      [1600, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1600, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1600, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1830) / 60))),
  gloom: () => 0,
};
