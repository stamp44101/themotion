import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {UbonLandmarks} from './Landmarks';
import {ACTORS, CARAVAN} from './actors';
import {AIRFIELD, CANDLE_AT, DON_MOT_DAENG, MUN, MUN_W, OLD_TOWN, RAIL_Z, THUNG, WARIN_STATION, WAT_LUANG, WAT_SI_UBON, WAT_THUNG} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = the centre of ทุ่งศรีเมือง, 80 m/unit, +x east, -z north; pins from the
// Gemini research (docs/briefs/ubon.md §4), awaiting the workstation's OSM check. Ubon was
// never walled; ถนนเขื่อนธานี follows its old earthwork. The plain is flat: no hills.
const path = (pts: [number, number][], r: number, year: number) =>
  pts.slice(1).flatMap(([x1, z1], i) => {
    const [x0, z0] = pts[i];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, z1 - z0) / (r * 1.2)));
    return Array.from({length: n}, (_, k) => [x0 + ((x1 - x0) * k) / n, z0 + ((z1 - z0) * k) / n, r, year] as [number, number, number, number]);
  });

export const UBON: CityConfig = {
  id: 'ubon',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'อุบลราชธานี', sub: 'นครแห่งเทียนพรรษา ริมฝั่งแม่น้ำมูล'},
    finale: {kicker: 'พ.ศ. 2335 – 2569', title: 'อุบลราชธานี', sub: 'เมืองดอกบัว นครแห่งเทียนพรรษา'},
    approxBefore: 1700,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -48, z1: 48},
    peaks: [],
    rivers: [{path: MUN, width: MUN_W}],
    bridges: [],
    noMoat: true,
    noWall: true,
    // the north-eastern line from Si Sa Ket ends at Warin, on the south bank (1 เม.ย. 2473)
    rail: {axis: 'x', pos: RAIL_Z, open: [1929.8, 1929.95], station: WARIN_STATION, stationYear: 1929.9, span: [-48, 6]},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {hx: 10, hz: 7, outline: OLD_TOWN, moat: [1792, 1792.1], wall: [1792, 1792.1], gates: [1792, 1792.1], groundFrom: 1792.1},
    gates: [],
    houses: {
      built: [1793, 50],
      modern: [1955, 60],
      keepOut: [
        [THUNG[0], THUNG[1], 3.4],
        [WAT_LUANG[0], WAT_LUANG[1], 1.9],
        [WAT_THUNG[0], WAT_THUNG[1], 1.6],
        [WAT_SI_UBON[0], WAT_SI_UBON[1], 1.6],
        [3.6, -3.6, 2],
      ],
    },
    villages: {
      centers: [
        [-22, -22],
        [24, -6],
        [-20, 28],
        [26, 30],
        [-36, -6],
      ],
      built: [1800, 1880],
    },
    forestCity: 1792,
    clearings: [
      // the cover candle and the bank the naga slides down
      [CANDLE_AT[0], CANDLE_AT[1], 10, -1e9],
      [CANDLE_AT[0] + 5, CANDLE_AT[1] + 6, 5, -1e9],
      // the river banks where the fishers and the naga are watched from
      ...path(MUN.slice(0, 6) as [number, number][], 3.4, -1e9).map(([x, z, r, y]) => [x, z - 2.2, r, y] as [number, number, number, number]),
      // the island camp and the cart track down to it from the north
      [DON_MOT_DAENG[0], DON_MOT_DAENG[1] - 3, 5, -1e9],
      ...path(CARAVAN, 2.2, -1e9),
      // the field, the first town, the airfield
      [THUNG[0], THUNG[1], 7.5, 1791.8],
      [AIRFIELD[0], AIRFIELD[1], 14, 1920],
    ],
    paddies: [1800, 1950],
    sites: [
      [THUNG[0], THUNG[1], 3.2],
      [WAT_LUANG[0], WAT_LUANG[1], 1.8],
      [WAT_THUNG[0], WAT_THUNG[1], 1.5],
      [WAT_SI_UBON[0], WAT_SI_UBON[1], 1.4],
      [3.6, -3.6, 1.8],
    ],
    urban: {from: 1950, rate: 1.3},
    sprawl: {height: 0.9, tall: 0.05},
    highRise: 1995,
    towers: [{x0: -6, x1: 8, z0: -14, z1: -5, extra: 3}],
    roads: [
      // ถนนอุปราช down the west side of the field to the river, then the bridge road to Warin
      {from: [-1.8, -20], to: [-1.8, 7.5], width: 0.9, year: 1900},
      {from: [0, 12.6], to: [0.8, 35], width: 1.0, year: 1954.5},
      // ถนนพโลรังฤทธิ์ (north of the field), ถนนศรีณรงค์ (south), ถนนเขื่อนธานี (the old earthwork)
      {from: [-9, -2.6], to: [9, -2.6], width: 0.8, year: 1900},
      {from: [-9, 2.6], to: [9, 2.6], width: 0.8, year: 1900},
      {from: [-10, 5.4], to: [10, 5.4], width: 0.8, year: 1900},
      // the road west the commissioner came in on, and north to the airfield
      {from: [-46, -1.2], to: [-9, -1.2], width: 0.9, year: 1893},
      {from: [2.4, -2.6], to: [8, -40], width: 1.1, year: 1960},
    ],
    openGround: [
      {x0: THUNG[0] - 2.6, x1: THUNG[0] + 2.6, z0: THUNG[1] - 3.2, z1: THUNG[1] + 3.2},
      {x0: 4, x1: 31, z0: -42, z1: -16},
    ],
    ringRoadYear: 1e9,
    cars: [1955, 2026],
    boats: [1792, 1955],
    finale: 'lanterns',
    life: {
      buffalo: [{x: -24, z: 24, r: 4, count: 6, from: 1810, to: 1975}],
      people: [{x: -4, z: 6.4, r: 1.4, count: 16, from: 1793, to: 2026}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: UbonLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_ubon.wav',
  sky: {
    top: [
      [-1200, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [-1200, '#e6e2c4'],
      [1700, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[-1200, '#8f9c58'], ...GROUND],
  },
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1850) / 100))),
  gloom: () => 0,
};
