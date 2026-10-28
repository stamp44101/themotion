import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {SuphanburiLandmarks} from './Landmarks';
import {ACTORS, MALAIMAN, STUPA_AT} from './actors';
import {FIELD, MAHATHAT, MOAT, PALELAI, PHRA_RUP, PILLAR, RIVER, RIVER_W, TOWER, TOWN, WAT_KHAE, WEST_GATE} from './places';
import {STORY} from './timeline';

// World origin = the city pillar, 50 m/unit (places.ts), +x east, +z south. The Tha Chin is the
// engine's river (a path river: occupancy, the house grid and road bridges all know it); the moat,
// rampart, gate and the landmarks are drawn by Landmarks.tsx. Don Chedi (19.7 km NNW) is drawn on the
// tile's north-west corner on its bearing.
type P = [number, number];
const band = (pts: P[], w: number, from: number | undefined, to: number | undefined, label: string) =>
  pts.slice(1).map((b, i) => ({fp: {band: [pts[i], b, w] as [P, P, number]}, from, to, label: `${label} ${i}`}));
const segs = (pts: P[], width: number, year: number) => pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year}));

export const SUPHANBURI: CityConfig = {
  id: 'suphanburi',
  // the owner renders the shader look only (26 Oct 2026)
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สุพรรณบุรี', sub: 'เมืองยุทธหัตถี'},
    finale: {kicker: 'เมืองริมน้ำท่าจีน', title: 'สุพรรณบุรี', sub: 'เมืองยุทธหัตถี วรรณคดีขึ้นชื่อ'},
    approxBefore: 1500,
    duration: STORY.duration,
  },
  layout: {
    // x0 -60: the giants' charge in the cover starts 29 units west of the field
    tile: {x0: -60, x1: 40, z0: -50, z1: 46},
    // a flat plain: the first hills are ~29 km west (README item 4), off the tile
    peaks: [],
    rivers: [{path: RIVER, width: RIVER_W}],
    bridges: [],
    noMoat: true,
    noWall: true,
    trains: [],
    city: {hx: 18.2, hz: 39, outline: TOWN, moat: [1e9, 1e9], wall: [1e9, 1e9], gates: [1e9, 1e9], groundFrom: 1300},
    gates: [],
    houses: {
      // v2: the frontier town of the wars is sparse in 2135 (~13% of its houses) and fills over the
      // palelai beat (1600-1866): houses go up at 1580 + rand^1.6 x 290
      built: [1580, 290],
      // prob 1 with a far-off year: the engine's ramp on gone = Infinity is NaN (PR #69)
      abandon: {prob: 1, from: 3000, spread: 0, rebuild: 3001, rebuildSpread: 0},
      modern: [1950, 50],
      keepOut: [],
    },
    villages: {
      centers: [
        [-24, 6],
        [-20, 26],
        [24, -14],
        [26, 22],
        [-40, 30],
      ],
      built: [1600, 200],
    },
    forestCity: 1300,
    clearings: [
      [FIELD[0], FIELD[1] - 2, 9, -1e9],
      [PALELAI[0], PALELAI[1], 3.5, -1e9],
      [WAT_KHAE[0], WAT_KHAE[1], 3, -1e9],
    ],
    paddies: [1620, 1990],
    sites: [
      [PILLAR[0] + 0.5, PILLAR[1] - 0.3, 2.0],
      [MAHATHAT[0] + 0.8, MAHATHAT[1], 2.0],
      [PALELAI[0], PALELAI[1], 2.6],
      [WAT_KHAE[0] - 1.2, WAT_KHAE[1] + 1.0, 2.0],
      [TOWER[0], TOWER[1], 1.0],
      [PHRA_RUP[0], PHRA_RUP[1], 1.2],
      [WEST_GATE[0] + 0.6, WEST_GATE[1], 1.3],
      [STUPA_AT[0], STUPA_AT[1], 4.2],
    ],
    footprints: [
      // the moat and the rampart inside it
      ...band(MOAT, 2.0, undefined, undefined, 'moat'),
    ],
    openGround: [
      // the duel's field and the fair ground
      {x0: FIELD[0] - 9, x1: FIELD[0] + 9, z0: FIELD[1] - 9, z1: FIELD[1] + 9},
    ],
    urban: {from: 1955, rate: 1.4},
    // the town grows round the old town and across the river; Don Chedi (drawn on the north-west
    // corner, really 20 km out) stays rural
    urbanBox: {x0: -20, x1: 40, z0: -30, z1: 46},
    sprawl: {height: 0.6, tall: 0.03},
    highRise: 2010,
    towers: [],
    roads: [
      // Malaiman road in from the west through the old gate and over the river
      ...segs(MALAIMAN, 0.9, 1950),
      // the later bridges (ถนนพลายชุมพล, ถนนนางแก่นแก้ว)
      {from: [2, 17.7], to: [20, 17.7], width: 0.8, year: 1975},
      {from: [4, 29.4], to: [12.2, 29.6], width: 0.8, year: 1990},
      {from: [12.2, 29.6], to: [12.5, 36], width: 0.8, year: 1990},
      {from: [12.5, 36], to: [30, 38], width: 0.8, year: 1990},
    ],
    ringRoadYear: 1e9,
    cars: [1950, 2026],
    boats: [1e9, 1e9],
    finale: 'lanterns',
    life: {
      buffalo: [
        {x: -26, z: 18, r: 4, count: 6, from: 1500, to: 1990},
        {x: 26, z: -24, r: 3, count: 5, from: 1500, to: 1990},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: SuphanburiLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_suphanburi.wav',
  sky: {
    top: [
      [1300, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1300, '#e6e2c4'],
      [1800, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1300, '#a6a866'], ...GROUND],
  },
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1850) / 100))),
  gloom: () => 0,
};
