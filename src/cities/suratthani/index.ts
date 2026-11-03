import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {SuratThaniLandmarks} from './Landmarks';
import {ACTORS, atAlong} from './actors';
import {
  CHAIYA, CHON_KASEM, KO_LAMPHU, LAMPHU_CH, LAMPHU_CH_W, LANDING, MARKET, NA_MUEANG, NARIT, NEW_HALL, PALM2, PALM_BASE, RAIL_X, RING,
  SEA_PATH, SEA_W, SHIPYARD, SHRINE, SRI_SURAT, SRI_TAPI, STATION, TALAT_MAI, TAPI_DOWN, TAPI_DOWN_W, TAPI_UP, TAPI_UP_W, TO_THA_KHAM,
} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = the city pillar at Ban Don (places.ts), 150 m/unit, +x east, +z south. Ban Don never had a
// wall: the engine's `city` is the old riverside town along ถ.หน้าเมือง, which fills from the shipyard
// (~2375) and Tha Thong's move (Rama IV). At the cover the tile is forest, the Tapi winding in from Tha
// Kham and Bandon Bay across the north (the 0-to-100 spine); Chaiya and its great stupa stand on the bay's
// west shore at the tile's north-west (far place), the Southern Line crosses the Tapi at the west edge.
type P = [number, number];
const segs = (pts: P[], width: number, year: number) => pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year}));
const [CX, CZ] = CHAIYA;

export const SURATTHANI: CityConfig = {
  id: 'suratthani',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สุราษฎร์ธานี', sub: 'เมืองคนดี ริมแม่น้ำตาปี'},
    finale: {kicker: 'ราว พ.ศ. 1300 – 2569', title: 'สุราษฎร์ธานี', sub: 'เมืองร้อยเกาะ เงาะอร่อย หอยใหญ่'},
    // Srivijaya's stupa and port are dated only to a century: the counter reads "ราว" until 2328
    approxBefore: 1700,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -62, x1: 64, z0: -78, z1: 30},
    peaks: [
      // Khao Tha Phet, the wooded hill south of the town (real ~6 km S, drawn at the tile's south edge)
      [3, 26.5, 3.2, 5],
      // the low hills behind Chaiya (far place)
      [CX - 6, CZ - 5, 3.0, 4],
    ],
    rivers: [
      {path: TAPI_UP, width: TAPI_UP_W},
      {path: TAPI_DOWN, width: TAPI_DOWN_W},
      {path: LAMPHU_CH, width: LAMPHU_CH_W},
      // Bandon Bay: one wide path whose south edge is the coast
      {path: SEA_PATH, width: SEA_W},
    ],
    bridges: [
      // สะพานศรีสุราษฎร์ over the lower reach (1 Oct 2556) and สะพานศรีตาปี by the pillar (29 Jul 2562)
      {at: atAlong(TAPI_DOWN, SRI_SURAT), year: 2013, modernYear: 2013, river: 1},
      {at: atAlong(TAPI_UP, SRI_TAPI), year: 2019, modernYear: 2019, river: 0},
    ],
    noMoat: true,
    noWall: true,
    // the Southern Line, through Phun Phin and over the Tapi at Tha Kham (2459), drawn north-south at the
    // tile's west edge; the track is laid inside the 2459 hold so it grows on screen, and the station is
    // drawn in Landmarks.tsx on the beat's seconds (Saraburi's lesson: nothing grows on a year the counter
    // jumps over)
    rail: {axis: 'z', pos: RAIL_X, open: [1916.0, 1916.16], station: STATION, stationYear: 1e9, span: [-58, 30]},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {
      hx: 9.5,
      hz: 11,
      // the old riverside town along ถ.หน้าเมือง, the market and the landing, on the south-east bank
      outline: [
        [1.4, 1.6], [1.6, -2.2], [3.0, -6.0], [5.6, -10.6], [9.0, -10.4], [9.2, -4.0], [6.2, 1.8], [3.0, 3.2],
      ],
      moat: [1e9, 1e9],
      wall: [1e9, 1e9],
      gates: [1e9, 1e9],
      groundFrom: 1832,
    },
    gates: [],
    houses: {
      // Ban Don fills from the shipyard and Tha Thong's move
      built: [1833, 45],
      modern: [1955, 40],
      keepOut: [
        [SHRINE[0], SHRINE[1], 0.9],
        [LANDING[0], LANDING[1], 1.2],
        [SHIPYARD[0], SHIPYARD[1], 2.4],
      ],
    },
    villages: {
      centers: [
        // farm and fishing hamlets on both banks and along the river
        [-20, 12], [-36, -4], [14, 8], [-12, -24], [22, -10], [-44, 22], [32, 12], [-26, 22], [12, -36],
      ],
      built: [1700, 160],
    },
    forestCity: 757,
    clearings: [
      // the cover's palm on the west bank and the run of the river below it (open from the start)
      [PALM_BASE[0], PALM_BASE[1], 5, -1e9],
      // Chaiya and its stupa, Laem Pho's beach
      [CX, CZ + 2, 8, -1e9],
      // the shipyard, the landing and the market on the town bank
      [SHIPYARD[0], SHIPYARD[1], 4, -1e9],
      [3.5, -3.0, 4, -1e9],
      // Ko Lamphu (a park from 2539) and the callback palm
      [KO_LAMPHU[0], KO_LAMPHU[1], 1.8, -1e9],
      // Phun Phin station and the line
      [STATION[0], STATION[1], 3.2, -1e9],
      [RAIL_X, 4, 2.4, -1e9],
      [RAIL_X, -20, 2.4, -1e9],
    ],
    paddies: [1700, 1990],
    sites: [
      [CX, CZ, 3.2],
      [SHRINE[0], SHRINE[1], 1.0],
      [LANDING[0] + 0.6, LANDING[1], 1.0],
      [SHIPYARD[0], SHIPYARD[1], 2.8],
      [STATION[0], STATION[1], 2.6],
      [PALM_BASE[0], PALM_BASE[1], 1.2],
      [PALM2[0], PALM2[1], 0.7],
      [NEW_HALL[0], NEW_HALL[1], 1.2],
      [NARIT[0], NARIT[1], 0.8],
    ],
    openGround: [
      // the riverside embankment where the Chak Phra crowd stands, Ko Lamphu park
      {x0: 1.6, x1: 5.0, z0: -7.0, z1: -2.0},
      {x0: KO_LAMPHU[0] - 1.6, x1: KO_LAMPHU[0] + 1.6, z0: KO_LAMPHU[1] - 0.8, z1: KO_LAMPHU[1] + 0.8},
    ],
    urban: {from: 1940, rate: 0.8},
    urbanBox: {x0: -36, x1: 48, z0: -44, z1: 30},
    // a provincial city, low-rise with a few towers late
    sprawl: {height: 0.6, tall: 0.03},
    highRise: 2000,
    towers: [],
    roads: [
      ...segs(NA_MUEANG, 0.5, 1900),
      ...segs(CHON_KASEM, 0.45, 1910),
      // the road to Tha Kham after the train (Route 401)
      ...segs(TO_THA_KHAM, 0.6, 1917),
      ...segs(TALAT_MAI, 0.6, 1950),
      // the ring road (Route 420)
      ...segs(RING, 0.8, 1990),
    ],
    ringRoadYear: 1e9,
    cars: [1950, 2026],
    boats: [1832, 2026],
    finale: 'fireworks',
    life: {
      people: [
        // the welcome at the landing for Rama VI's barge (2458)
        {x: LANDING[0] + 1.8, z: LANDING[1] - 0.2, r: 1.0, count: 26, from: 1915.15, to: 1915.45, colors: ['#f4f1ea', '#efe9dc', '#2f3b63']},
        // the Chak Phra crowd on the embankment and on Ko Lamphu
        {x: 3.2, z: -4.6, r: 1.4, count: 40, from: 2024.6, to: 2026, colors: ['#f4f1ea', '#f2d36b', '#c0392b', '#2e86c1']},
        {x: KO_LAMPHU[0] + 0.6, z: KO_LAMPHU[1], r: 0.9, count: 18, from: 2024.6, to: 2026},
        // Ban Don's market
        {x: MARKET[0] + 1.4, z: MARKET[1] + 1.2, r: 0.7, count: 10, from: 1860, to: 2026},
      ],
      buffalo: [
        {x: -30, z: 18, r: 4, count: 6, from: 1700, to: 1985},
        {x: 18, z: 16, r: 3, count: 5, from: 1750, to: 1975},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: SuratThaniLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_suratthani.wav',
  sky: {
    top: [
      [757, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [757, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[757, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1900) / 60))),
  // Chaiya burning: a smoky grade over the fire, eased in and out inside the held year (2328)
  gloom: (Y) => {
    const u = (a: number, b: number) => {
      const c = Math.max(0, Math.min(1, (Y - a) / (b - a)));
      return c * c * (3 - 2 * c);
    };
    return 0.35 * u(1785.02, 1785.14) * (1 - u(1785.3, 1785.44));
  },
};
