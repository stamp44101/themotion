import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {offsetPoly} from '../../engine/poly';
import {SurinLandmarks} from './Landmarks';
import {ACTORS, ROAD, TABLE} from './actors';
import {
  INNER, INNER_W, LAK_MUEANG, MONUMENT, OLD_HALL, OUTER, OUTER_W, RAIL_Z, STADIUM, STATION, THANASAN, WAT_BURAPHARAM, WAT_CHUMPHON,
  WAT_KLANG, WAT_SALA_LOI,
} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = the inner moat's centre, 40 m/unit (places.ts), +x east, +z south. The plain
// is flat. The town inside the inner moat is the engine's walled-city ground with no wall: the
// moats themselves are drawn by Landmarks.tsx (docs/briefs/surin.md §1), and given to the
// occupancy map here as footprints so nothing is built on them.
type P = [number, number];
const band = (pts: P[], closed: boolean, w: number, from: number, label: string) =>
  (closed ? pts.map((a, i) => [a, pts[(i + 1) % pts.length]] as [P, P]) : pts.slice(1).map((b, i) => [pts[i], b] as [P, P])).map(([a, b], i) => ({
    fp: {band: [a, b, w + 0.4] as [P, P, number]},
    from,
    label: `${label} ${i}`,
  }));
// the town ground: just inside the inner moat and its rampart
const TOWN = offsetPoly(INNER, -(INNER_W / 2 + 1.4)) as P[];

export const SURIN: CityConfig = {
  id: 'surin',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สุรินทร์', sub: 'ถิ่นช้างใหญ่ แผ่นดินกูย เขมร ลาว'},
    finale: {kicker: 'ประทายสมันต์ – สุรินทร์', title: 'สุรินทร์', sub: 'ถิ่นช้างใหญ่ ผ้าไหมงาม ประคำสวย'},
    approxBefore: 1700,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -48, z1: 48},
    peaks: [],
    rivers: [],
    bridges: [],
    noMoat: true,
    noWall: true,
    // the North-Eastern Line (1 พ.ค. 2469) along the old town's north edge; the first train
    // comes in from Buriram, to the west
    rail: {axis: 'x', pos: RAIL_Z, open: [1925.9, 1926.02], station: STATION, stationYear: 1925.5},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {hx: 16, hz: 19, outline: TOWN, moat: [1e9, 1e9], wall: [1e9, 1e9], gates: [1e9, 1e9], groundFrom: 603.5},
    gates: [],
    houses: {
      // Chiang Pum's town fills the old moat through the hold on 2306
      built: [1762.6, 0.5],
      // Every house "abandoned" in the year 1e8, i.e. never: a house with no abandon year gets
      // gone = Infinity, and the engine's ramp(Y, Infinity, Infinity + 10) is NaN, so it is
      // never drawn (engine bug, reported on PR #69; the fix belongs in a separate engine PR)
      abandon: {prob: 1, from: 1e8, spread: 1, rebuild: 1e9, rebuildSpread: 1},
      modern: [1930, 60],
      keepOut: [
        [OLD_HALL[0] - 4, OLD_HALL[1] + 1.5, 2.6],
        [OLD_HALL[0] - 6.6, OLD_HALL[1] + 1.5, 1.6],
      ],
    },
    villages: {
      // Kuy, Khmer and Lao villages on the plain round the town
      centers: [
        [-36, 32],
        [34, -36],
        [-38, -34],
        [38, 40],
      ],
      built: [1762.6, 160],
    },
    // the forest inside the moat goes 602-603.2 and the town ground comes 603.5-605, at ~0.33
    // years a frame (timeline.ts: the moat beat runs 600-640 over 4 s)
    forestCity: 602,
    clearings: [
      // the grassland the herd crosses (and the iron-age village's fields)
      [-2, -4, 15, -1e9],
      // the fields where the white elephant is run down, cleared in the Khmer beat: at 1700
      // they went in the 0.4-s gap before 2302 (541 years in 12 frames) and failed check_render
      [-24, -4, 9, 1205],
    ],
    paddies: [1762.6, 1960],
    sites: [
      [LAK_MUEANG[0], LAK_MUEANG[1], 1.2],
      [OLD_HALL[0], OLD_HALL[1], 2.2],
      [MONUMENT[0], MONUMENT[1], 2.6],
      [STADIUM[0], STADIUM[1], 6.4],
      [WAT_KLANG[0], WAT_KLANG[1] + 0.8, 1.8],
      [WAT_BURAPHARAM[0], WAT_BURAPHARAM[1] + 0.8, 1.8],
      [WAT_SALA_LOI[0], WAT_SALA_LOI[1] + 0.8, 1.8],
      [WAT_CHUMPHON[0], WAT_CHUMPHON[1] + 0.8, 1.8],
    ],
    footprints: [
      ...band(INNER, true, INNER_W + 2, 601, 'inner moat'),
      ...band(OUTER, false, OUTER_W, 1186, 'outer moat'),
      {fp: {band: [ROAD[0], ROAD[1], 1.6]}, from: 1181, to: 1550, label: 'royal road'},
      {fp: {band: [TABLE[0], TABLE[1], 6]}, from: 2024, label: 'elephant buffet'},
      {fp: {band: [THANASAN[0], THANASAN[1], 3.4]}, from: 1926, label: 'Thanasan shophouses'},
    ],
    urban: {from: 1950, rate: 2.0},
    sprawl: {height: 0.8, tall: 0.04},
    highRise: 1995,
    towers: [],
    roads: [
      // ถนนธนสาร, the station into town (2469)
      {from: THANASAN[0], to: THANASAN[1], width: 0.9, year: 1926},
      // the road south past the monument, and east past the show ground
      {from: [MONUMENT[0] + 2.2, MONUMENT[1] + 1.5], to: [MONUMENT[0] + 2.2, 47], width: 0.9, year: 1930},
      {from: [MONUMENT[0] + 2.2, 30.5], to: [47, 30.5], width: 0.9, year: 1955},
    ],
    openGround: [
      {x0: STADIUM[0] - 6.4, x1: STADIUM[0] + 6.4, z0: STADIUM[1] - 5, z1: STADIUM[1] + 5},
      // the south moat's lake (สวนรัก)
      {x0: 1, x1: 10.3, z0: 10.5, z1: 19.9},
    ],
    ringRoadYear: 1e9,
    cars: [1960, 2026],
    boats: [1e9, 1e9],
    finale: 'lanterns',
    life: {
      buffalo: [{x: -30, z: 30, r: 4, count: 6, from: 1763, to: 1980}],
      people: [{x: STATION[0] + 2.5, z: STATION[1] + 2.4, r: 1.3, count: 12, from: 1926.1, to: 2026}],
      elephants: [
        {x: -36, z: 28, r: 3, count: 3, from: 1764, to: 1960},
        {x: 34, z: -32, r: 3, count: 3, from: 1764, to: 1960},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: SurinLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_surin.wav',
  sky: {
    top: [
      [-500, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [-500, '#e6e2c4'],
      [1700, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[-500, '#9aa45e'], ...GROUND],
  },
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1850) / 100))),
  gloom: () => 0,
};
