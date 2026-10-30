import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {NakhonPathomLandmarks} from './Landmarks';
import {ACTORS} from './actors';
import {
  CANAL_PATH, MARKET_E, MARKET_W, PALACE, PHETKASEM, PRATHON, RAIL_Z, RATCHADAMNOEN, SILPAKORN, STATION, STATION_RD,
  TEMPLE_HALF,
} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = Phra Pathom Chedi, 80 m/unit (places.ts), +x east, +z south. No wall, no moat: the
// town grew round the chedi after Rama IV's encasing (2396). The canal is drawn and dug in
// Landmarks.tsx (it has a year; the engine's rivers do not), so `sites` and `clearings` along it keep
// generated things and trees off it. The tile is forest round the abandoned stupa at the cover and the
// town fills it from there (the 0-to-100 spine).
type P = [number, number];
const segs = (pts: P[], width: number, year: number) => pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year}));

// discs every ~1.5 units along the canal
const CANAL_DISCS: [number, number, number][] = CANAL_PATH.slice(1).flatMap(([bx, bz], i) => {
  const [ax, az] = CANAL_PATH[i];
  const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 1.5));
  return Array.from({length: n}, (_, k) => [ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n, 1.0] as [number, number, number]);
});

// the town of the 1900s: round the chedi and north over the canal to the station
const TOWN: P[] = [
  [-10, -11], [8, -11], [12, -6], [11, 8], [3, 11], [-8, 10], [-12, 2], [-12, -8],
];

export const NAKHONPATHOM: CityConfig = {
  id: 'nakhonpathom',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'นครปฐม', sub: 'เมืองพระปฐมเจดีย์ เจดีย์ซ้อนเจดีย์'},
    finale: {kicker: 'พ.ศ. 2396 – 2569', title: 'นครปฐม', sub: 'พระปฐมเจดีย์เสียดฟ้า สนามจันทร์งามล้น'},
    approxBefore: 1850,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -39, x1: 57, z0: -46, z1: 50},
    // the lower Tha Chin plain is flat
    peaks: [],
    rivers: [],
    bridges: [],
    noMoat: true,
    noWall: true,
    // the Southern Line (service 1 Apr 2446, opened 19 Jun 2446), E-W north of the canal
    rail: {axis: 'x', pos: RAIL_Z, open: [1902.6, 1903.2], station: STATION, stationYear: 1901.5},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {hx: 12, hz: 13, outline: TOWN, moat: [1e9, 1e9], wall: [1e9, 1e9], gates: [1e9, 1e9], groundFrom: 1856},
    gates: [],
    houses: {
      // a few builders' houses with the works, the town proper after the seat moved (~2441) and the line
      built: [1856, 100],
      abandon: {prob: 1, from: 3000, spread: 0, rebuild: 3001, rebuildSpread: 0},
      modern: [1950, 50],
      keepOut: [],
    },
    villages: {
      centers: [
        [-30, -22],
        [30, 22],
        [40, -2],
        [-12, 32],
        [18, -32],
        [-30, 30],
      ],
      built: [1820, 70],
    },
    forestCity: 1856,
    clearings: [
      // the chedi's ground, cleared for the works (it is forest-bound at the cover)
      [0, 0, TEMPLE_HALF + 0.6, -1e9],
      ...CANAL_DISCS.map(([x, z]) => [x, z, 1.2, 1854] as [number, number, number, number]),
      [PALACE[0], PALACE[1], 4.2, 1906],
      [SILPAKORN[0], SILPAKORN[1], 4.2, 1965],
      [PRATHON[0], PRATHON[1], 2.2, -1e9],
    ],
    paddies: [1880, 1990],
    sites: [
      [0, 0, TEMPLE_HALF + 0.2],
      ...CANAL_DISCS,
      [PALACE[0], PALACE[1], 4],
      [SILPAKORN[0], SILPAKORN[1], 3.8],
      [PRATHON[0], PRATHON[1], 2],
      [MARKET_W[0], MARKET_W[1], 2.6],
      [MARKET_E[0], MARKET_E[1], 2.6],
      // the station road and its bridge (drawn in Landmarks.tsx)
      [STATION_RD[0][0], -9, 2.2],
    ],
    openGround: [
      // the temple square (the fair ground)
      {x0: -TEMPLE_HALF, x1: TEMPLE_HALF, z0: -TEMPLE_HALF, z1: TEMPLE_HALF},
      // the palace grounds
      {x0: PALACE[0] - 3.6, x1: PALACE[0] + 3.6, z0: PALACE[1] - 3, z1: PALACE[1] + 3},
    ],
    urban: {from: 1950, rate: 1.4},
    sprawl: {height: 0.8, tall: 0.04},
    highRise: 2000,
    towers: [{x0: -6, x1: 10, z0: 11, z1: 17, extra: 3}],
    roads: [
      // ถนนราชดำเนิน to the palace (Rama VI)
      ...segs(RATCHADAMNOEN, 0.8, 1908),
      // ถนนเพชรเกษม (2493)
      ...segs(PHETKASEM, 1.0, 1950),
      // the road east toward Phra Prathon
      {from: [6.8, 0.6], to: [47, 5.2], width: 0.7, year: 1935},
    ],
    ringRoadYear: 1e9,
    cars: [1955, 2026],
    boats: [1e9, 1e9],
    finale: 'fireworks',
    life: {
      people: [
        {x: MARKET_W[0], z: MARKET_W[1] + 0.9, r: 0.5, count: 10, from: 1903, to: 2026},
        {x: MARKET_E[0], z: MARKET_E[1] + 0.9, r: 0.5, count: 10, from: 1903, to: 2026},
      ],
      buffalo: [
        {x: -26, z: 22, r: 4, count: 6, from: 1850, to: 1985},
        {x: 28, z: 30, r: 3, count: 5, from: 1850, to: 1985},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: NakhonPathomLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_nakhonpathom.wav',
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
  // the collapse beat's days of rain (seconds)
  rain: [[12.1, 15.6]],
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1900) / 60))),
  gloom: () => 0,
};
