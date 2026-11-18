import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {PhraeLandmarks} from './Landmarks';
import {ACTORS, DEMO_AT, atAlong} from './actors';
import {
  BYPASS, CHAROEN, CHOHAE, CHOHAE_HILL, CHOHAE_RD, DENCHAI, GABLE_AT, GABLE_S, GATE_CHAI, GATE_MAI, GATE_YANGMA, KHAMLUE, KHUM,
  LANDING, LOG_TRACK, MAIN_NS, NE_EXIT, OLD_TOWN, PILLAR, RAIL_SPAN, RAIL_Z, RUNWAY, SOUTH_RD, STAIR, THUNGHONG, TILE,
  TO_THUNGHONG, WAT_LUANG, WAT_MING_MUEANG, WAT_PHRA_NON, WEST_RD, WONGBURI, YOM, YOM_BRIDGE, YOM_W,
} from './places';
import {STORY} from './timeline';

// World origin = the city pillar (places.ts), 100 m/unit, +x east, +z south, the town at true scale and Cho Hae and Den
// Chai drawn closer at the south corners. The old town is the shell-shaped เวียง with its moat and earth wall, standing
// before frame 0 and sparse at the cover (2440); it fills through the shan, rail and teak beats and spills out east in the
// grow shot. The cover's giant gable stands on open ground east of it.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));
const wallRot = (a: P, b: P) => Math.atan2(b[0] - a[0], b[1] - a[1]);

export const PHRAE: CityConfig = {
  id: 'phrae',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'แพร่', sub: 'เมืองไม้สัก ลายขนมปังขิง'},
    finale: {kicker: 'ประตูสู่ล้านนา', title: 'แพร่', sub: 'หม้อห้อมไม้สัก ช่อแฮศรีเมือง'},
    approxBefore: 1902,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [
      // Cho Hae's low hill, and the real hills behind it to the south-east
      CHOHAE_HILL,
      [44.5, 33.5, 5.0, 5.0],
      [46.0, 21.0, 3.6, 4.0],
      // the ridge that walls the plain on the west (real ~6 km out, drawn at the tile's north-west edge)
      [-33.0, -37.0, 10.0, 8.0],
      [-34.0, -24.0, 8.0, 6.0],
      [-25.0, -41.5, 5.5, 5.0],
    ],
    rivers: [{path: YOM, width: YOM_W}],
    bridges: [
      // ทล.1023 over the Yom
      {at: atAlong(YOM, YOM_BRIDGE), year: 1935, modernYear: 1985},
    ],
    city: {
      hx: 6,
      hz: 6,
      outline: OLD_TOWN,
      // the moat and earth wall are centuries old by the cover (legend: พญาพล; เมืองแพล in the 1826 inscription)
      moat: [1200, 1201],
      wall: [1200, 1201],
      gates: [1200, 1201],
      // an earth rampart, long worn low by the cover (no merlons: the engine drops them below 0.3); the west and south
      // stretches still stand today
      decay: [1100, 1150, 9999, 9999],
      ruinStrength: 0.8,
      groundFrom: 1200,
    },
    gates: [
      {x: GATE_CHAI[0], z: GATE_CHAI[1], rot: wallRot(OLD_TOWN[2], OLD_TOWN[3]), width: 0.8},
      {x: GATE_MAI[0], z: GATE_MAI[1], rot: wallRot(OLD_TOWN[18 - 1], OLD_TOWN[0]), width: 0.7},
      {x: GATE_YANGMA[0], z: GATE_YANGMA[1], rot: wallRot(OLD_TOWN[16], OLD_TOWN[17]), width: 0.5},
    ],
    rail: {axis: 'x', pos: RAIL_Z, open: [1912.0, 1912.2], station: [DENCHAI[0], DENCHAI[1]], stationYear: 1912.2, span: RAIL_SPAN},
    trains: [{t0: 12.0, dur: 2.8, dir: -1, modern: false, park: 1.4}],
    houses: {
      // sparse at the cover (2440), full by the 2470s
      built: [1888, 45],
      modern: [1960, 45],
      keepOut: [
        [WAT_LUANG[0], WAT_LUANG[1], 1.0],
        [WAT_PHRA_NON[0], WAT_PHRA_NON[1], 0.8],
        [WAT_MING_MUEANG[0], WAT_MING_MUEANG[1], 1.0],
        [KHUM[0], KHUM[1], 0.9],
        [WONGBURI[0], WONGBURI[1], 0.9],
        [PILLAR[0], PILLAR[1], 0.5],
        [1.1, 1.9, 0.7],
        [DEMO_AT[0], DEMO_AT[1], 0.8],
      ],
    },
    villages: {
      // rice villages round the plain; Ban Thung Hong north-east on its road
      centers: [[THUNGHONG[0] - 1.5, THUNGHONG[1] - 3.0], [-24, -16], [-22, 26], [18, 22], [-8, -24], [22, -28], [-28, -34]],
      built: [1800, 80],
    },
    forestCity: 1200.5,
    clearings: [
      // the open ground the cover's gable stands on (fields; the town spreads over it later)
      [GABLE_AT[0], GABLE_AT[1], GABLE_S * 0.42, -1e9],
      // the elephants' track from the west forest and their landing on the Yom
      ...LOG_TRACK.map(([x, z]) => [x, z, 2.0, -1e9] as [number, number, number, number]),
      [LANDING[0], LANDING[1], 2.4, -1e9],
      // Cho Hae's terrace and stair
      [CHOHAE[0], CHOHAE[1], 1.8, -1e9],
      ...STAIR.map(([x, z]) => [x, z, 1.6, -1e9] as [number, number, number, number]),
      // the hill's west face below the stair, open toward the road (the porters must read from the west)
      ...[[32.6, 27.6], [33.4, 29.4], [35.4, 29.2], [32.2, 25.4], [35.0, 25.0], [30.8, 27.0], [31.4, 29.6]].map(([x, z]) => [x, z, 1.6, -1e9] as [number, number, number, number]),
      // the station yard and the line (cleared before the counter jumps to 2455)
      [DENCHAI[0] - 1.4, DENCHAI[1], 3.0, 1906],
      ...[-34, -30, -26, -22, -18, -14].map((x) => [x, RAIL_Z, 1.8, 1906] as [number, number, number, number]),
      // the old town ground and the fields round it
      [0, 0, 6.5, -1e9],
      [9, 4, 4, -1e9],
      // Ban Thung Hong's drying ground (cleared well before the mohom beat)
      [THUNGHONG[0], THUNGHONG[1], 2.8, 1990],
      // the airport
      [27.6, 12.2, 4.0, 1955],
    ],
    paddies: [1700, 1760],
    sites: [
      [WAT_LUANG[0], WAT_LUANG[1], 1.0],
      [WAT_PHRA_NON[0], WAT_PHRA_NON[1], 0.7],
      [WAT_MING_MUEANG[0], WAT_MING_MUEANG[1], 0.9],
      [KHUM[0], KHUM[1], 0.9],
      [WONGBURI[0], WONGBURI[1], 0.9],
      [PILLAR[0], PILLAR[1], 0.4],
      [1.1, 1.9, 0.6],
      [DEMO_AT[0], DEMO_AT[1], 0.5],
      [CHOHAE[0], CHOHAE[1], 1.8],
      [LANDING[0] - 1.2, LANDING[1] - 1.0, 0.6],
      [DENCHAI[0] - 2.0, DENCHAI[1] - 1.4, 1.1],
      [THUNGHONG[0], THUNGHONG[1], 2.2],
    ],
    openGround: [
      // the airport (OSM runway)
      {x0: Math.min(RUNWAY[0][0], RUNWAY[1][0]) - 1.2, x1: Math.max(RUNWAY[0][0], RUNWAY[1][0]) + 1.2, z0: RUNWAY[1][1] - 0.8, z1: RUNWAY[0][1] + 0.8},
      // Ban Thung Hong's drying ground
      {x0: THUNGHONG[0] - 2.4, x1: THUNGHONG[0] + 1.6, z0: THUNGHONG[1] - 1.6, z1: THUNGHONG[1] + 1.6},
    ],
    urban: {from: 1955, rate: 0.8},
    urbanBox: {x0: -12, x1: 46, z0: -32, z1: 30},
    // a low provincial town: no towers
    sprawl: {height: 0.45, tall: 0.02},
    highRise: 1e9,
    towers: [],
    roads: [
      ...segs(CHAROEN, 0.5, 1850),
      ...segs(KHAMLUE, 0.4, 1850),
      ...segs(NE_EXIT, 0.5, 1850),
      ...segs(MAIN_NS, 0.7, 1935, 0.3),
      ...segs(TO_THUNGHONG, 0.6, 1940, 0.3),
      ...segs(WEST_RD, 0.6, 1935, 0.2),
      ...segs(SOUTH_RD, 0.5, 1945, 0.2),
      ...segs(CHOHAE_RD, 0.6, 1942, 0.3),
      ...segs(BYPASS, 0.8, 1975, 0.3),
    ],
    ringRoadYear: 1e9,
    cars: [1960, 2026],
    boats: [1850, 1965],
    finale: 'fireworks',
    life: {
      buffalo: [
        {x: -22, z: -8, r: 3, count: 4, from: 1850, to: 1985},
        {x: 16, z: 18, r: 3, count: 4, from: 1850, to: 1975},
      ],
      people: [{x: WONGBURI[0] + 0.4, z: WONGBURI[1] + 1.5, r: 1.3, count: 26, from: 2015, to: 2027}],
      stalls: [{x: WONGBURI[0] - 1.6, z: WONGBURI[1] + 1.5, r: 0.7, count: 4, from: 2015, to: 2027}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: PhraeLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_phrae.wav',
  sky: {
    top: [
      [1897, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1897, '#e6e2c4'],
      [1950, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1897, '#a6a866'], ...GROUND],
  },
  // a forest-heavy opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1900) / 60))),
  gloom: () => 0,
};
