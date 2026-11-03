import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {KanchanaburiLandmarks} from './Landmarks';
import {ACTORS} from './actors';
import {
  BRIDGE, GATE, KHWAE_NOI, KHWAE_NOI_W, KHWAE_YAI, KHWAE_YAI_W, LAT_YA, MAE_KLONG, MAE_KLONG_W, PAPER_MILL, PIER, STATION, WALL,
} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = the city pillar (places.ts), 100 m/unit, +x east, +z south. The engine's `city` is the Rama III
// wall of Pak Phraek (210 x 520 m, the SW long side on the rivers; ONEP polygon, 6 forts and 8 gates), raised in
// 2374 on the confluence of the Khwae Yai and the Khwae Noi, which run on as the Mae Klong. The Kwai bridge,
// the station and the track are drawn by hand (Landmarks.tsx) because the line runs diagonally; Lat Ya, the
// old seat 17.9 km NW, is drawn at the tile's north-west corner.
const [LX, LZ] = LAT_YA;

export const KANCHANABURI: CityConfig = {
  id: 'kanchanaburi',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'กาญจนบุรี', sub: 'ที่ที่แม่น้ำสองสายมาพบกัน'},
    finale: {kicker: 'พ.ศ. 2328 – 2569', title: 'กาญจนบุรี', sub: 'แควใหญ่ แควน้อย สะพาน และรถไฟ'},
    approxBefore: 1780,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -44, x1: 24, z0: -42, z1: 26},
    peaks: [
      // the hills west of the Khwae Yai and the limestone at Chong Kai, kept low
      [-39, -6, 2.6, 6],
      [-14, 22, 2.2, 4],
      [17, -30, 2.0, 7],
    ],
    rivers: [
      {path: KHWAE_YAI, width: KHWAE_YAI_W},
      {path: KHWAE_NOI, width: KHWAE_NOI_W},
      {path: MAE_KLONG, width: MAE_KLONG_W},
    ],
    bridges: [],
    noMoat: true,
    city: {
      hx: 2.6,
      hz: 2.6,
      outline: WALL,
      moat: [1e9, 1e9],
      wall: [1831.05, 1831.4],
      gates: [1831.2, 1831.45],
      decay: [1900, 1960, 1990, 2000],
      ruinStrength: 0.8,
      groundFrom: 1831,
    },
    gates: [{x: GATE[0], z: GATE[1], rot: 0.78, width: 0.9, pavilion: true}],
    trains: [],
    houses: {
      built: [1832, 60],
      modern: [1960, 50],
      keepOut: [[PAPER_MILL[0] + 1.4, PAPER_MILL[1] + 0.6, 1.0], [STATION[0] + 0.9, STATION[1] - 0.4, 1.4]],
    },
    villages: {
      centers: [[-14, 6], [8, 14], [-30, 8], [14, -8], [-8, 20], [-36, -12], [6, -26]],
      built: [1700, 140],
    },
    forestCity: 1700,
    clearings: [
      [LX, LZ, 7.5, -1e9],
      [BRIDGE[0], BRIDGE[1], 7, -1e9],
      [0, 0, 5, -1e9],
      [STATION[0], STATION[1], 3, -1e9],
      [-5.7, -13.3, 3.6, -1e9],
    ],
    paddies: [1700, 1990],
    sites: [
      [BRIDGE[0], BRIDGE[1], 2.4],
      [STATION[0] + 0.9, STATION[1] - 0.4, 1.4],
      [-5.7, -13.3, 1.8],
      [PAPER_MILL[0] + 1.4, PAPER_MILL[1] + 0.6, 1.0],
      [LX, LZ, 3.2],
    ],
    openGround: [{x0: -7.4, x1: -4.0, z0: -14.6, z1: -12.0}],
    urban: {from: 1948, rate: 0.9},
    urbanBox: {x0: -22, x1: 22, z0: -34, z1: 24},
    sprawl: {height: 0.6, tall: 0.03},
    highRise: 2000,
    towers: [],
    // no roads yet: every road here crosses a river and needs an engine bridge (a v1b job)
    roads: [],
    ringRoadYear: 1e9,
    cars: [1e9, 1e9],
    boats: [1832, 2026],
    finale: 'fireworks',
    life: {
      people: [
        // the figures who lay the track (no suffering: tiny, far, working)
        {x: BRIDGE[0] + 3, z: BRIDGE[1] + 2, r: 1.6, count: 30, from: 1943, to: 1944.9, colors: ['#f4f1ea', '#2f3b63', '#b88a3a']},
        {x: PIER[0] + 1.2, z: PIER[1] - 0.2, r: 1.0, count: 22, from: 1831.2, to: 1850},
        // the bridge week crowd on both banks
        {x: BRIDGE[0] + 2, z: BRIDGE[1] + 1.6, r: 1.6, count: 44, from: 2024.6, to: 2026, colors: ['#f4f1ea', '#f2d36b', '#c0392b', '#2e86c1']},
        {x: PIER[0] + 1.4, z: PIER[1] + 0.4, r: 1.0, count: 16, from: 2024.6, to: 2026},
      ],
      elephants: [
        // the Siamese elephants at Lat Ya (2328)
        {x: LX + 4, z: LZ + 5, r: 2.2, count: 6, from: 1784.9, to: 1830.5, howdah: true},
      ],
      buffalo: [
        {x: -12, z: 22, r: 4, count: 5, from: 1700, to: 1985},
        {x: 14, z: 10, r: 3, count: 4, from: 1750, to: 1975},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: KanchanaburiLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_kanchanaburi.wav',
  sky: {
    top: [
      [1700, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1700, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1700, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1900) / 60))),
  // the raids of 2488: a grey grade eased in and out inside the held year
  gloom: (Y) => {
    const u = (a: number, b: number) => {
      const c = Math.max(0, Math.min(1, (Y - a) / (b - a)));
      return c * c * (3 - 2 * c);
    };
    return 0.3 * u(1945.02, 1945.14) * (1 - u(1945.3, 1945.44));
  },
};

