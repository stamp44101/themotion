import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {SaraburiLandmarks} from './Landmarks';
import {ACTORS} from './actors';
import {
  ADISORN, AMNUAI_AT, CEMENT, CEMENT_HILLS, FOOT, FOOT_ROAD, FORK, MITTRAPHAP, OLD_HALL, PHAHONYOTHIN, PILLAR, RAIL_Z, RIVER,
  RIVER_W, SAMUHA, SAO_HAI_HALL, SAO_HAI_MKT, STATION, TON_TAN, WAT_PAK_PHRIAO, WAT_SUNG,
} from './places';
import {DEER_STOP, SOUND_EVENTS, STORY} from './timeline';

// World origin = the city pillar at Pak Phriao (places.ts), 100 m/unit, +x east, +z south. Saraburi
// never had a wall: the engine's `city` box is Pak Phriao's riverside town between the Pa Sak and
// the railway, which fills only after the train (2440). At the cover the tile is forest, the river
// and a few huts at Sao Hai (the 0-to-100 spine); the Footprint's hill is drawn in the north-west
// (far place) and the Kaeng Khoi - Thap Kwang limestone hills in the north-east (far place).
type P = [number, number];
const segs = (pts: P[], width: number, year: number) => pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year}));
const [FX, FZ] = FOOT;

export const SARABURI: CityConfig = {
  id: 'saraburi',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สระบุรี', sub: 'เมืองพระพุทธบาท ริมป่าสัก'},
    finale: {kicker: 'ราว พ.ศ. 2166 – 2569', title: 'สระบุรี', sub: 'เมืองพระพุทธบาท ประตูสู่อีสาน'},
    // the find's year is disputed (brief): the counter reads "ราว" until the fire of 2310
    approxBefore: 1700,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -80, x1: 31, z0: -56, z1: 36},
    peaks: [
      // the low hill the Footprint lies on, the mondop on its crown, and Khao Suwan Banphot's range
      // behind it (far place, drawn ~7x the real 100-200 m so the hill reads)
      [FX, FZ, 2.2, 3.4],
      [FX - 2, FZ - 9, 9, 6],
      [FX + 7, FZ - 8, 7, 5],
      [FX - 10, FZ - 9, 7, 6],
      // the limestone hills of Kaeng Khoi - Thap Kwang (far place)
      ...CEMENT_HILLS,
    ],
    rivers: [{path: RIVER, width: RIVER_W}],
    bridges: [
      // Saphan Amnuai Songkhram (Phahonyothin, 24 Jun 2483), concrete from the start
      {at: AMNUAI_AT, year: 1940, modernYear: 1975},
    ],
    noMoat: true,
    noWall: true,
    // Ayutthaya-Saraburi-Kaeng Khoi, opened 1 May 2440, drawn straight E-W (places.ts)
    rail: {axis: 'x', pos: RAIL_Z, open: [1896.6, 1897.1], station: STATION, stationYear: 1896.5},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {
      hx: 6,
      hz: 1.4,
      moat: [1e9, 1e9],
      wall: [1e9, 1e9],
      gates: [1e9, 1e9],
      groundFrom: 1897,
    },
    gates: [],
    houses: {
      // Pak Phriao fills once the seat has followed the train
      built: [1897.2, 25],
      modern: [1965, 40],
      keepOut: [
        [PILLAR[0], PILLAR[1], 0.8],
        [OLD_HALL[0], OLD_HALL[1], 1.2],
      ],
    },
    villages: {
      centers: [
        // Sao Hai, Ton Tan, Pak Phriao's riverside, and farm hamlets across the plain
        [SAO_HAI_MKT[0] + 2, SAO_HAI_MKT[1] + 3],
        [TON_TAN[0] + 3, TON_TAN[1] + 5],
        [8, -6],
        [-14, -6],
        [-46, -20],
        [-40, 8],
        [-12, 18],
        [16, 20],
        [-62, 14],
      ],
      built: [1640, 200],
    },
    forestCity: 1890,
    clearings: [
      // the hill's crown and the deer's run from the west (open ground from the start, so nothing
      // vanishes in one frame later)
      [FX, FZ, 7.5, -1e9],
      [(DEER_STOP[0] + FX) / 2, FZ + 0.5, 12, -1e9],
      [DEER_STOP[0] - 8, FZ + 1, 8, -1e9],
      // the straight road (1624) and the stairs' foot
      ...FOOT_ROAD.slice(1).flatMap(([bx, bz], i) => {
        const [ax, az] = FOOT_ROAD[i];
        const n = Math.ceil(Math.hypot(bx - ax, bz - az) / 2);
        return Array.from({length: n}, (_, k) => [ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n, 1.6, 1623.5] as [number, number, number, number]);
      }),
      [FX, FZ + 6, 3.5, 1786],
      // Sao Hai's market and temple, the Thai Yuan villages
      [SAO_HAI_MKT[0], SAO_HAI_MKT[1], 4, -1e9],
      [WAT_SUNG[0], WAT_SUNG[1], 1.6, -1e9],
      [TON_TAN[0], TON_TAN[1] - 1, 5, 1803],
      [SAMUHA[0], SAMUHA[1] - 0.5, 4.2, 1803],
      // Pak Phriao: Wat Pak Phriao (2321) and the town by the station
      [WAT_PAK_PHRIAO[0], WAT_PAK_PHRIAO[1], 1.4, -1e9],
      [3, 0.5, 8, 1896],
      // the cement works
      [CEMENT[0], CEMENT[1], 3.4, 1969],
    ],
    paddies: [1700, 1990],
    sites: [
      [FX, FZ, 2.6],
      [SAO_HAI_MKT[0], SAO_HAI_MKT[1], 2.6],
      [WAT_SUNG[0], WAT_SUNG[1], 1.2],
      [SAO_HAI_HALL[0], SAO_HAI_HALL[1], 1.2],
      [WAT_PAK_PHRIAO[0], WAT_PAK_PHRIAO[1], 1.1],
      [OLD_HALL[0], OLD_HALL[1], 1.2],
      [CEMENT[0], CEMENT[1], 2.6],
    ],
    openGround: [
      // the mondop's lawn and the stairs' foot, where the crowd stands for flower alms
      {x0: FX - 3.5, x1: FX + 3.5, z0: FZ - 3, z1: FZ + 9},
    ],
    urban: {from: 1955, rate: 0.9},
    // a low-rise provincial town
    sprawl: {height: 0.55, tall: 0.02},
    highRise: 2010,
    towers: [],
    roads: [
      // the king's straight road to the Footprint (Route 3022's line), an earth road
      ...segs(FOOT_ROAD, 0.6, 1623.6),
      // Phahonyothin (2483) over Saphan Amnuai Songkhram
      ...segs(PHAHONYOTHIN, 0.9, 1940),
      // the Friendship Highway (2501)
      ...segs(MITTRAPHAP, 1.0, 1958),
      // Pak Phriao's street from the station to the river
      {from: [8.6, 0.9], to: [8.6, -1.4], width: 0.4, year: 1897},
      // to Adisorn camp (2496) and the new hall (2562)
      {from: [FORK[0], FORK[1]], to: [ADISORN[0], ADISORN[1]], width: 0.5, year: 1953},
    ],
    ringRoadYear: 1e9,
    cars: [1950, 2026],
    boats: [1623, 2026],
    finale: 'fireworks',
    life: {
      people: [
        // the flower-alms crowd on the lawn below the stairs
        {x: FX + 0.4, z: FZ + 7.2, r: 2.2, count: 40, from: 2024.6, to: 2026, colors: ['#f4f1ea', '#f2d36b', '#efe9dc']},
        // Pak Phriao's market by the station
        {x: 7.4, z: 0.6, r: 0.8, count: 10, from: 1897.5, to: 2026},
      ],
      buffalo: [
        {x: -40, z: 4, r: 4, count: 6, from: 1650, to: 1985},
        {x: -12, z: 22, r: 3, count: 5, from: 1700, to: 1985},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: SaraburiLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_saraburi.wav',
  sky: {
    top: [
      [1623, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1623, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1623, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1900) / 60))),
  // the fall of Ayutthaya: a smoky grade over the fire, eased in and out inside the held year (2310)
  gloom: (Y) => {
    const u = (a: number, b: number) => {
      const c = Math.max(0, Math.min(1, (Y - a) / (b - a)));
      return c * c * (3 - 2 * c);
    };
    return 0.4 * u(1767.02, 1767.14) * (1 - u(1767.3, 1767.44));
  },
};

