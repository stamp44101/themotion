import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {LopburiLandmarks} from './Landmarks';
import {ACTORS} from './actors';
import {
  ARMY, NEW_TOWN, OLD_TOWN, PALACE, POM_CHAI_CHANA, POM_THA_PHO, PRANG, PRANG_KHAEK, PRATU_CHAI, RAIL_X, RIVER, RIVER_W, SAN_PAOLO,
  SAN_PHRA_KAN, STATION, VICHAYEN, WAT_MAHATHAT, WAT_NAKHON_KOSA,
} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = the ONEP old-town centroid, 40 m/unit (places.ts), +x east, +z south. The
// plain is flat (the town stands on a low river terrace): no hills on the tile. The walls
// Ramesuan raised were pulled down in 2092 and Narai's were forts and gates, not a ring:
// no engine wall or moat; the forts and ประตูชัย are landmarks.
const PX = (PALACE.x0 + PALACE.x1) / 2;
const PZ = (PALACE.z0 + PALACE.z1) / 2;

export const LOPBURI: CityConfig = {
  id: 'lopburi',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ลพบุรี', sub: 'ละโว้ เมืองพระนารายณ์ ถิ่นหนุมาน'},
    finale: {kicker: 'ลวปุระ – ละโว้ – ลพบุรี', title: 'ลพบุรี', sub: 'เมืองพระนารายณ์ ถิ่นลิงศาลพระกาฬ'},
    approxBefore: 1100,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -48, z1: 48},
    peaks: [],
    rivers: [{path: RIVER, width: RIVER_W}],
    bridges: [],
    noMoat: true,
    noWall: true,
    // the Northern Line (1 เม.ย. 2444) runs north-south through the town, between the prang
    // and ศาลพระกาฬ; the station stands finished before the first train
    rail: {axis: 'z', pos: RAIL_X, open: [1900.9, 1901.05], station: STATION, stationYear: 1898.5},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {hx: 20, hz: 19, outline: OLD_TOWN, moat: [1e9, 1e9], wall: [1e9, 1e9], gates: [1e9, 1e9], groundFrom: 653.5},
    gates: [],
    houses: {
      built: [656, 32],
      modern: [1905, 60],
      keepOut: [
        [PRANG[0], PRANG[1], 4.6],
        [SAN_PHRA_KAN[0], SAN_PHRA_KAN[1], 3],
        [PRANG_KHAEK[0], PRANG_KHAEK[1], 2.6],
        [WAT_MAHATHAT[0], WAT_MAHATHAT[1], 2.2],
        [WAT_NAKHON_KOSA[0], WAT_NAKHON_KOSA[1], 2.2],
        [PX, PZ, 5.6],
        [VICHAYEN[0], VICHAYEN[1], 2],
      ],
    },
    villages: {
      centers: [
        [-30, -26],
        [26, 24],
        [-32, 22],
        [30, -30],
      ],
      built: [700, 1200],
    },
    // the forest goes 652-653.2 and the ground comes 653.5-655, at ~0.23 years a frame
    forestCity: 652,
    clearings: [
      // where Hanuman lands and the troop runs, and the prang's ground
      [PRANG[0] + 6, PRANG[1] - 2, 9, -1e9],
      // the river landing the elephants walk down to
      [-8, -1.5, 4, -1e9],
    ],
    paddies: [700, 1950],
    sites: [
      [PRANG[0], PRANG[1], 2.2],
      [SAN_PHRA_KAN[0], SAN_PHRA_KAN[1], 2.4],
      [PRANG_KHAEK[0], PRANG_KHAEK[1], 2.4],
      // OSM way 196252384: x 0.7-5.5, z 3.7-8.0; kept west of the track
      [WAT_MAHATHAT[0], WAT_MAHATHAT[1], 2.0],
      [WAT_NAKHON_KOSA[0], WAT_NAKHON_KOSA[1], 2],
      [VICHAYEN[0], VICHAYEN[1], 1.8],
      [SAN_PAOLO[0], SAN_PAOLO[1], 1.2],
      [POM_THA_PHO[0], POM_THA_PHO[1], 1.5],
      [POM_CHAI_CHANA[0], POM_CHAI_CHANA[1], 1.5],
      [PRATU_CHAI[0], PRATU_CHAI[1], 1.4],
    ],
    urban: {from: 1937, rate: 1.4},
    sprawl: {height: 0.9, tall: 0.05},
    highRise: 1995,
    towers: [{x0: 18, x1: 40, z0: -6, z1: 8, extra: 2}],
    roads: [
      // ถนนนารายณ์มหาราช, east from the old town to the new town round วงเวียนสระแก้ว (2480)
      {from: [9, 1], to: [48, 1], width: 1.0, year: 1937},
      // the road north past the army camp
      {from: [NEW_TOWN[0], 1], to: [ARMY[0] + 3, -40], width: 0.9, year: 1940},
    ],
    openGround: [
      {x0: PALACE.x0 - 0.2, x1: PALACE.x1 + 0.2, z0: PALACE.z0 - 0.2, z1: PALACE.z1 + 0.2},
      {x0: ARMY[0] - 5, x1: ARMY[0] + 5, z0: ARMY[1] - 4, z1: ARMY[1] + 4},
    ],
    ringRoadYear: 1e9,
    cars: [1950, 2026],
    boats: [700, 1950],
    finale: 'lanterns',
    life: {
      buffalo: [{x: -30, z: 30, r: 4, count: 6, from: 800, to: 1975}],
      people: [
        // Lavo's first townspeople round the stupa, so the clearing is not an empty lawn
        {x: WAT_NAKHON_KOSA[0] - 3, z: WAT_NAKHON_KOSA[1] + 1.5, r: 2.2, count: 14, from: 657, to: 1300},
        {x: STATION[0] + 2.5, z: STATION[1] + 2, r: 1.4, count: 14, from: 1902, to: 2026},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: LopburiLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_lopburi.wav',
  sky: {
    top: [
      [-1500, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [-1500, '#e6e2c4'],
      [1700, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[-1500, '#9aa45e'], ...GROUND],
  },
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1850) / 100))),
  gloom: () => 0,
};
