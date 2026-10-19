import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {PhetchaburiLandmarks} from './Landmarks';
import {ACTORS} from './actors';
import {
  BAN_PUEN, BANG_CHAN, eastWallX, KAMPHAENG_LAENG, MAHATHAT, PEAK_E, PEAK_H, PEAK_M, PEAK_W, RAIL_X, RIVER, RIVER_W, STATION, WALL, WAT_YAI, WEST_GATE,
} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = the centre of the traced wall rectangle (13.10398, 99.95308), 80 m/unit,
// +x east, -z north. Pins, river, wall and the ONEP zone from docs/briefs/phetchaburi.md.
export const PHETCHABURI: CityConfig = {
  id: 'phetchaburi',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เพชรบุรี', sub: 'เขาวัง เมืองพระ เมืองขนมหวาน'},
    finale: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เพชรบุรี', sub: 'เขาวังคู่บ้าน เมืองขนมหวาน'},
    approxBefore: 1500,
    duration: STORY.duration,
  },
  // experiment 2 (docs/experiments.md): fireworks over the lit ridge first, then back 800 years
  hook: {from: 56.6, hold: 1.4, out: 0.3, in: 0.75, text: 'ย้อนกลับไป 800 กว่าปี'},
  layout: {
    tile: {x0: -48, x1: 48, z0: -48, z1: 48},
    // Khao Wang: summit 91 m over a 10 m plain, i.e. ~1 unit of relief over a ~6 x 6 unit ridge
    // (brief §5). At true height it reads as a bump; drawn ~4x (Chonburi's Khao Sam Muk is amplified the same way)
    // so the three crowns stand up from the plain. Kaeng Krachan's hills far west, low.
    peaks: [
      [PEAK_W[0], PEAK_W[1], PEAK_H.w, 2.0],
      [PEAK_M[0], PEAK_M[1], PEAK_H.m, 1.7],
      [PEAK_E[0], PEAK_E[1], PEAK_H.e, 1.6],
      [-46, 30, 5, 8],
      [-46, 4, 3.5, 7],
    ],
    rivers: [{path: RIVER, width: RIVER_W}],
    bridges: [],
    // the river is the west moat; no dug moat is recorded on the other sides
    noMoat: true,
    // 1903: the first southern line ends here: the station is a terminus, the line runs north
    rail: {axis: 'z', pos: RAIL_X, open: [1902.4, 1903.0], station: STATION, stationYear: 1902.8, span: [-48, STATION[1] - 1]},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1, park: 3})),
    city: {
      hx: 6.1,
      hz: 8,
      outline: WALL,
      // the brick-and-laterite wall: its date is not recorded; standing by the 2124 attack.
      // It rises in the jump between the Khmer beat and the siege
      moat: [1380, 1400],
      wall: [1380, 1420],
      gates: [1410, 1430],
      // gone by ~2492, when residents carried the bricks off after a market fire
      decay: [1900, 1949, 9999, 9999],
      ruinStrength: 0.92,
      groundFrom: 1150,
    },
    gates: [
      {x: eastWallX(BANG_CHAN[1]), z: BANG_CHAN[1], rot: -0.17, width: 1.4, pavilion: true},
      {x: WEST_GATE[0], z: WEST_GATE[1], rot: 0, width: 1.2},
    ],
    houses: {
      built: [1150, 450],
      modern: [1920, 80],
      keepOut: [
        [KAMPHAENG_LAENG[0], KAMPHAENG_LAENG[1], 2.6],
        [WAT_YAI[0], WAT_YAI[1], 1.6],
      ],
    },
    villages: {
      centers: [
        [18, -22],
        [24, 14],
        [-24, 22],
        [10, 30],
        [-30, -26],
      ],
      built: [1200, 1500],
    },
    forestCity: 1150,
    clearings: [
      // the open plain under the sugar palms (Landmarks.tsx), leaving groves between the
      // discs and the wooded ridge standing up out of it
      [12, -22, 11, -1e9],
      [18, 10, 11, -1e9],
      [-2, 28, 11, -1e9],
      [-30, 12, 9, -1e9],
      [30, -4, 9, -1e9],
      [-27, 33, 9, -1e9],
      [6, -38, 9, -1e9],
      [31, 30, 9, -1e9],
      [-34, -30, 9, -1e9],
      [-12, -18, 6, -1e9],
      [-12, 4, 5, -1e9],
      [KAMPHAENG_LAENG[0], KAMPHAENG_LAENG[1], 3.2, -1e9],
      [MAHATHAT[0], MAHATHAT[1], 2.4, 1400],
      [BAN_PUEN[0], BAN_PUEN[1], 4, 1909],
      // the crowns: the old chedi's summit always, the palace grounds from 1859
      [PEAK_M[0], PEAK_M[1], 1.4, -1e9],
      [PEAK_W[0], PEAK_W[1], 2.4, 1858.6],
      [PEAK_M[0], PEAK_M[1], 2.0, 1858.6],
      [PEAK_E[0], PEAK_E[1], 2.0, 1858.6],
      // open ground round the ridge's foot, so the hill stands up out of the plain
      [-20, -12.5, 4, -1e9],
      [-27, -2, 4, -1e9],
      [-14.5, -1, 3.4, -1e9],
      [-28, -12, 3, -1e9],
    ],
    // rice under the sugar palms from the start: the plain reads open and sandy, not forest
    paddies: [500, 900],
    sites: [
      [KAMPHAENG_LAENG[0], KAMPHAENG_LAENG[1], 2.6],
      [MAHATHAT[0], MAHATHAT[1], 2.0],
      [WAT_YAI[0], WAT_YAI[1], 1.4],
      [BAN_PUEN[0], BAN_PUEN[1], 2.0],
      [PEAK_W[0], PEAK_W[1], 1.6],
      [PEAK_M[0], PEAK_M[1], 1.2],
      [PEAK_E[0], PEAK_E[1], 1.2],
    ],
    // the ridge and the palace grounds stay open as the town grows round them
    openGround: [
      {x0: -26, x1: -15.6, z0: -11, z1: -1.5},
      {x0: BAN_PUEN[0] - 2.4, x1: BAN_PUEN[0] + 1.6, z0: BAN_PUEN[1] - 2.6, z1: BAN_PUEN[1] + 2.6},
    ],
    urban: {from: 1930, rate: 2.0},
    sprawl: {height: 0.7, tall: 0.02},
    highRise: 1995,
    towers: [],
    roads: [
      // station road east over the river into the town
      {from: [RAIL_X + 1.6, -16], to: [-2, -10], width: 1.0, year: 1903},
      {from: [-2, -10], to: [-2, 9.5], width: 0.9, year: 1903},
      // east to the coast (the Gulf is SE)
      {from: [eastWallX(0) + 0.8, 0], to: [48, 24], width: 1.0, year: 1950},
    ],
    // no engine ring road: its rectangle would run along the river (cars on the water)
    ringRoadYear: 1e9,
    cars: [1960, 2026],
    boats: [1000, 1960],
    finale: 'fireworks',
    life: {
      buffalo: [{x: 16, z: -6, r: 4, count: 5, from: 1000, to: 1960}],
      // the งานพระนครคีรี fair at the foot of the ridge
      people: [{x: -16.6, z: -2.2, r: 1.4, count: 30, from: 1990, to: 2026}],
      stalls: [{x: -16.6, z: -2.2, r: 1.3, count: 12, from: 1990, to: 2026}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: PhetchaburiLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_phetchaburi.wav',
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
