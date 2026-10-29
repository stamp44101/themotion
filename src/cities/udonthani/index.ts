import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {UdonLandmarks} from './Landmarks';
import {ACTORS} from './actors';
import {
  AIRFIELD, BAN_CHIANG, CAMP, CENTRAL, CLOCK, FIELD, HALL, LAKE_DISCS, MATCHIMA, MONUMENT, NONG_BUA, NORTH_TRACK, PHO_SI,
  PUYA, RACHINU, RAIL_X, RUNWAY_ROT, STATION, UD_TOWN,
} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = the city pillar shrine, 70 m/unit (places.ts), +x east, +z south. No wall, no moat:
// the town is the 1893 camp beside Nong Prachak, which is drawn as open water in Landmarks.tsx (a
// closed `path` river is a ring channel, not a lake); `sites` and `clearings` keep things off it.
// The tile is forest and the lake until the camp; the town fills from there (the 0-to-100 spine).
type P = [number, number];
const segs = (pts: P[], width: number, year: number) => pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year}));

// the town of the 1900s: the lake's east and south shores round the hall, the temples and the field
const TOWN: P[] = [
  [-15, -14], [2, -15], [12, -6], [14, 6], [10, 18], [-4, 18], [-17, 15], [-17, 2],
];

export const UDONTHANI: CityConfig = {
  id: 'udonthani',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'อุดรธานี', sub: 'จากค่ายริมหนอง สู่เมืองใหญ่อีสานตอนบน'},
    finale: {kicker: 'พ.ศ. 2436 – 2569', title: 'อุดรธานี', sub: 'หนองประจักษ์คู่เมือง อารยธรรมบ้านเชียง'},
    approxBefore: 1850,
    duration: STORY.duration,
  },
  layout: {
    // x1 66: the cover's jar (Ban Chiang, due east) stands on the tile's east side
    tile: {x0: -44, x1: 62, z0: -50, z1: 52},
    // the Khorat plateau round Udon is flat (Phu Phan is far east, off the tile)
    peaks: [],
    rivers: [],
    bridges: [],
    noMoat: true,
    noWall: true,
    // the north-eastern line from Khon Kaen (24 Jun 2484), straight N-S through the station
    rail: {axis: 'z', pos: RAIL_X, open: [1940.6, 1941.2], station: STATION, stationYear: 1941},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {hx: 16, hz: 17, outline: TOWN, moat: [1e9, 1e9], wall: [1e9, 1e9], gates: [1e9, 1e9], groundFrom: 1893.6},
    gates: [],
    houses: {
      // the camp town fills round the lake from 1894 (houses at 1894 + rand^1.6 x 46)
      built: [1894, 46],
      abandon: {prob: 1, from: 3000, spread: 0, rebuild: 3001, rebuildSpread: 0},
      modern: [1950, 50],
      keepOut: [],
    },
    // Ban Duea Mak Khaeng and the villages round it, older than the camp but small
    villages: {
      centers: [
        [-2, -20],
        [-26, 14],
        [16, -26],
        [-30, -30],
        [36, 36],
      ],
      built: [1860, 60],
    },
    forestCity: 1893.6,
    clearings: [
      ...LAKE_DISCS.map(([x, z, r]) => [x, z, r + 0.6, -1e9] as [number, number, number, number]),
      [BAN_CHIANG[0], BAN_CHIANG[1], 12, -1e9],
      [CAMP[0], CAMP[1], 4, 1893.4],
      [NONG_BUA[0], NONG_BUA[1], 2.6, -1e9],
      // the airfield, cleared for the first strip (1932) and again for the long runway
      ...[-2, -1, 0, 1, 2].map((k) => [AIRFIELD[0] + k * 4 * Math.cos(RUNWAY_ROT), AIRFIELD[1] + k * 4 * Math.sin(RUNWAY_ROT), k === 0 ? 5 : 4, Math.abs(k) < 2 ? 1931.5 : 1963] as [number, number, number, number]),
      // the cart track down from Nong Khai the 1893 column came by
      ...NORTH_TRACK.flatMap(([x0, z0], i) => i === 0 ? [] : Array.from({length: 6}, (_, k) => {
        const [x1, z1] = NORTH_TRACK[i - 1];
        const u = k / 6;
        return [x0 + (x1 - x0) * u, z0 + (z1 - z0) * u, 2.2, -1e9] as [number, number, number, number];
      })),
    ],
    paddies: [1900, 1990],
    sites: [
      ...LAKE_DISCS,
      [NONG_BUA[0], NONG_BUA[1], 2.4],
      [BAN_CHIANG[0], BAN_CHIANG[1], 3],
      [CAMP[0], CAMP[1], 3],
      [HALL[0], HALL[1], 2.4],
      [MATCHIMA[0], MATCHIMA[1], 1.8],
      [PHO_SI[0], PHO_SI[1], 1.8],
      [RACHINU[0], RACHINU[1], 1.6],
      [MONUMENT[0], MONUMENT[1], 1.6],
      [CLOCK[0], CLOCK[1], 1.0],
      [CENTRAL[0], CENTRAL[1], 2.6],
      [UD_TOWN[0], UD_TOWN[1], 2.4],
      [PUYA[0], PUYA[1], 1.6],
    ],
    openGround: [
      // the fair ground, ทุ่งศรีเมือง
      {x0: FIELD[0] - 4.6, x1: FIELD[0] + 4.6, z0: FIELD[1] - 4.6, z1: FIELD[1] + 4.6},
      // the airfield (กองบิน 23)
      {x0: AIRFIELD[0] - 11, x1: AIRFIELD[0] + 11, z0: AIRFIELD[1] - 7, z1: AIRFIELD[1] + 7},
    ],
    urban: {from: 1941, rate: 1.6},
    // the city grows over the tile; Ban Chiang (drawn on the east side, really 48 km out) stays rural
    urbanBox: {x0: -44, x1: 32, z0: -50, z1: 52},
    sprawl: {height: 0.8, tall: 0.05},
    highRise: 1990,
    towers: [
      {x0: 12, x1: 24, z0: 8, z1: 20, extra: 5},
    ],
    roads: [
      // the track down from Nong Khai, older than the camp
      ...segs(NORTH_TRACK, 0.7, 1880),
      // round the lake's east shore and south to Wat Pho Si
      {from: [-1, -8.2], to: [-1, 10], width: 0.7, year: 1900},
      // ถนนโพศรี / the road south past the monument
      {from: [9.4, -12], to: [9.4, 34], width: 0.8, year: 1910},
      // ถนนประจักษ์ศิลปาคม: the hall to the station
      {from: [0, 14.8], to: [20, 14.8], width: 0.9, year: 1941},
      // the road to the airfield
      {from: [2, 10], to: [2, 36], width: 0.8, year: 1932},
    ],
    ringRoadYear: 1e9,
    cars: [1955, 2026],
    boats: [1e9, 1e9],
    finale: 'lanterns',
    life: {
      buffalo: [
        {x: -24, z: 24, r: 4, count: 6, from: 1860, to: 1985},
        {x: 20, z: -30, r: 3, count: 5, from: 1860, to: 1985},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: UdonLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_udonthani.wav',
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
