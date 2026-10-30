import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {RatchaburiLandmarks} from './Landmarks';
import {ACTORS} from './actors';
import {
  BYPASS, BYPASS_AT, FOUNTAIN, HERO, KILNS, KOIKI, LANDING, MAHATHAT, OLD_HALL, PHETKASEM, PHETKASEM_AT, PILLAR, RAIL_X,
  RIVER, RIVER_W, STATION, WALL, YUAN_ROAD,
} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = the middle of Rama II's walled town on the east bank (places.ts), 80 m/unit, +x
// east, +z south. The engine's wall is that town of 2360: it rises in the wall beat and crumbles
// once the town hall went back west (2440) and the army took the ground. The older west-bank town
// round Wat Mahathat is a sparse village at the cover (the 0-to-100 spine); Koi Ki, the kilns and
// the sprawl fill both banks from there.
type P = [number, number];
const YUAN_DISCS: P[] = YUAN_ROAD.slice(1).flatMap(([bx, bz], i) => {
  const [ax, az] = YUAN_ROAD[i];
  const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 1.8));
  return Array.from({length: n}, (_, k) => [ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n] as P);
});
const segs = (pts: P[], width: number, year: number) => pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year}));

export const RATCHABURI: CityConfig = {
  id: 'ratchaburi',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ราชบุรี', sub: 'เมืองโอ่งมังกร ริมแม่กลอง'},
    finale: {kicker: 'พ.ศ. 2343 – 2569', title: 'ราชบุรี', sub: 'เมืองโอ่งมังกร เมืองที่ข้ามแม่กลองสองครั้ง'},
    approxBefore: 1800,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -52, x1: 44, z0: -48, z1: 48},
    // the lower Mae Klong plain is flat in town (Khao Ngu, 5 km NW, is off the tile)
    peaks: [],
    rivers: [{path: RIVER, width: RIVER_W}],
    bridges: [
      // the Phetkasem bridge (2493 road, Sirilak bridge 2523) and the bypass bridge (~2543)
      {at: PHETKASEM_AT, year: 1950, modernYear: 1980},
      {at: BYPASS_AT, year: 2000, modernYear: 2000},
    ],
    noMoat: true,
    // the Southern Line (service 1 Apr 2446, opened 19 Jun 2446), N-S west of the walled town over
    // the black bridge; the engine bridges the river where the line crosses it
    rail: {axis: 'z', pos: RAIL_X, open: [1902.6, 1903.2], station: STATION, stationYear: 1901.5},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {
      hx: 5,
      hz: 2,
      outline: WALL,
      moat: [1e9, 1e9],
      wall: [1817.02, 1817.36],
      gates: [1817.2, 1817.42],
      // the town hall goes back west (2440) and the army takes the walled ground: the wall decays
      decay: [1898, 1940, 1e9, 1e9],
      ruinStrength: 0.6,
      groundFrom: 1817.1,
    },
    gates: [
      {x: -2.5, z: -1.6, rot: 0, width: 0.6},
      {x: 2.5, z: -1.6, rot: 0, width: 0.6},
      {x: -2.5, z: 2.0, rot: 0, width: 0.6},
      {x: 2.5, z: 2.0, rot: 0, width: 0.6},
      {x: -5, z: 0.2, rot: Math.PI / 2, width: 0.6},
      {x: 5, z: 0.2, rot: Math.PI / 2, width: 0.6},
    ],
    houses: {
      // the walled town fills after 2360 and empties once the army has it (2440 on)
      built: [1817.3, 50],
      abandon: {prob: 0.75, from: 1898, spread: 15, rebuild: 3000, rebuildSpread: 0},
      modern: [1960, 40],
      keepOut: [[PILLAR[0], PILLAR[1], 0.9]],
    },
    villages: {
      centers: [
        [-21, -7],
        [-26, 2],
        [-18, 12],
        [-8, -14],
        [-38, -26],
        [24, -26],
        [30, 30],
        [-40, 32],
      ],
      built: [1790, 110],
    },
    forestCity: 1817,
    clearings: [
      // the walled town's ground, cleared as the wall goes up
      [0, 0.2, 9, 1816.5],
      // the cart track the Thai Yuan come down (open fields along it)
      ...YUAN_DISCS.map(([x, z]) => [x, z, 2.2, -1e9] as [number, number, number, number]),
      // the cover's jar stands on open fields
      [HERO[0], HERO[1], 15.5, -1e9],
      [MAHATHAT[0], MAHATHAT[1], 3.6, -1e9],
      [KILNS[0], KILNS[1], 4.4, 1932],
      [(KOIKI[0][0] + KOIKI[1][0]) / 2, KOIKI[0][1] - 0.6, 4.6, 1896],
      [OLD_HALL[0], OLD_HALL[1], 1.8, 1920],
      [FOUNTAIN[0], FOUNTAIN[1], 2, 1896],
    ],
    paddies: [1805, 1990],
    sites: [
      [MAHATHAT[0], MAHATHAT[1], 3],
      [KILNS[0], KILNS[1], 3.8],
      [OLD_HALL[0], OLD_HALL[1], 1.6],
      [FOUNTAIN[0], FOUNTAIN[1], 1.9],
      [PILLAR[0], PILLAR[1], 0.8],
      [LANDING[0], LANDING[1] + 1.4, 1.4],
      // Koi Ki's row (drawn in Landmarks.tsx)
      ...Array.from({length: 9}, (_, i) => [KOIKI[0][0] + 0.4 + i * 0.8, KOIKI[0][1], 0.6] as [number, number, number]),
    ],
    openGround: [
      // Worradet Rd and the river wall between Koi Ki and the water (the walking street, the fountain)
      {x0: KOIKI[0][0] - 0.4, x1: KOIKI[1][0] + 0.4, z0: 5.2, z1: KOIKI[0][1] - 0.4},
    ],
    urban: {from: 1950, rate: 0.7},
    // a low-rise provincial town: no towers by the river
    sprawl: {height: 0.55, tall: 0.02},
    highRise: 2010,
    towers: [],
    roads: [
      // ถนนวรเดช along the river (Koi Ki's street)
      {from: [KOIKI[0][0] - 0.4, KOIKI[0][1] - 0.9], to: [KOIKI[1][0] + 0.2, KOIKI[0][1] - 0.9], width: 0.5, year: 1897},
      // the station road up to Koi Ki
      {from: [-9.6, STATION[1] - 4], to: [-9.2, KOIKI[0][1] + 0.6], width: 0.5, year: 1903},
      // ถนนเพชรเกษม (2493)
      ...segs(PHETKASEM, 1.0, 1950),
      // the bypass (~2543)
      ...segs(BYPASS, 0.9, 2000),
    ],
    ringRoadYear: 1e9,
    cars: [1955, 2026],
    boats: [1800, 2026],
    finale: 'fireworks',
    life: {
      people: [{x: -11.7, z: KOIKI[0][1] - 0.9, r: 0.5, count: 10, from: 1897, to: 2026}],
      buffalo: [
        {x: -36, z: 18, r: 4, count: 6, from: 1800, to: 1985},
        {x: 26, z: -18, r: 3, count: 5, from: 1800, to: 1985},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: RatchaburiLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_ratchaburi.wav',
  sky: {
    top: [
      [1800, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1800, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1800, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1900) / 60))),
  gloom: () => 0,
};
