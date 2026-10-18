import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {KhonKaenLandmarks} from './Landmarks';
import {ACTORS, CARAVAN} from './actors';
import {CENTRAL, DAM, DIG, KKU, LAKE_DISCS, mittraphapX, PHU_WIANG, RAIL_X, STATION, STUPA, THUNG_SANG, TOWN} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = water centroid of บึงแก่นนคร, 80 m/unit, +x east, -z north. Pins from #46
// (see places.ts). The Khorat plateau is flat; ภูเวียง's ring of hills (far WNW), pulled to
// the tile edge, is the only relief (the hills round Ubolratana are unknown, so not drawn).
export const KHONKAEN: CityConfig = {
  id: 'khonkaen',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ขอนแก่น', sub: 'จากแผ่นดินไดโนเสาร์ สู่เมืองใหญ่แห่งอีสาน'},
    finale: {kicker: 'เมืองขอนแก่น', title: 'ขอนแก่น', sub: 'ครบ 50 ปี การค้นพบไดโนเสาร์ไทย'},
    approxBefore: 1700,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -48, z1: 48},
    peaks: [
      [PHU_WIANG[0], PHU_WIANG[1], 7, 5.5],
      [PHU_WIANG[0] - 1, PHU_WIANG[1] + 9, 6, 6],
    ],
    // the lakes are drawn as open water in Landmarks.tsx (a closed `path` river is a ring
    // channel, not a lake); `sites` and `clearings` keep houses and trees off them
    rivers: [],
    bridges: [],
    noMoat: true,
    noWall: true,
    // the north-eastern line from Korat, through Khon Kaen toward Udon (reached 1 Apr 1933)
    // the at-grade track is lifted when the double track goes up on its viaduct (2019, Landmarks)
    rail: {axis: 'z', pos: RAIL_X, open: [1932.4, 1933.1], close: 2018.5, station: STATION, stationYear: 1932.6},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {hx: 20, hz: 25, outline: TOWN, moat: [1797, 1797.1], wall: [1797, 1797.1], gates: [1797, 1797.1], groundFrom: 1797.1},
    gates: [],
    houses: {built: [1797.05, 40], modern: [1940, 60], keepOut: [[STUPA[0], STUPA[1], 2.4]]},
    villages: {
      centers: [
        [26, 18],
        [-28, 22],
        [18, -24],
        [-36, -4],
        [34, -8],
      ],
      built: [1800, 1860],
    },
    forestCity: 1796,
    clearings: [
      [PHU_WIANG[0] + 10, PHU_WIANG[1] + 6, 9, -1e9],
      [STUPA[0], STUPA[1], 9, -1e9],
      [DAM[0] - 4.8, DAM[1], 7, 1964],
      [DAM[0] + 3.4, DAM[1] + 0.5, 2.5, 1964],
      ...LAKE_DISCS.map(([x, z, r]) => [x, z, r + 0.6, -1e9] as [number, number, number, number]),
      [THUNG_SANG[0], THUNG_SANG[1], 3.6, -1e9],
      // the cart track the 1797 settlers came up from Suwannaphum
      ...CARAVAN.flatMap(([x0, z0], i) => i === 0 ? [] : Array.from({length: 6}, (_, k) => {
        const [x1, z1] = CARAVAN[i - 1];
        const u = k / 6;
        return [x0 + (x1 - x0) * u, z0 + (z1 - z0) * u, 2.2, -1e9] as [number, number, number, number];
      })),
    ],
    paddies: [1810, 1950],
    sites: [
      [STUPA[0], STUPA[1], 2.4],
      [DAM[0] - 4.8, DAM[1], 6],
      [DAM[0] + 2.4, DAM[1], 3],
      [KKU[0], KKU[1], 4.5],
      [DIG[0], DIG[1], 5],
      [STATION[0], STATION[1], 1.8],
      ...LAKE_DISCS,
      [THUNG_SANG[0], THUNG_SANG[1], 3.3],
    ],
    urban: {from: 1933, rate: 1.5},
    sprawl: {height: 1, tall: 0.06},
    highRise: 1990,
    towers: [
      {x0: -22, x1: -6, z0: -32, z1: -16, extra: 7},
      {x0: -6, x1: 6, z0: -18, z1: -11, extra: 4},
    ],
    roads: [
      {from: [mittraphapX(48), 48], to: [mittraphapX(-48), -48], width: 1.6, year: 1956.2},
      {from: [mittraphapX(-11.5), -11.5], to: [12, -11.5], width: 1.1, year: 1940},
      {from: [CENTRAL[0] - 2, -48], to: [CENTRAL[0] - 2, -29.5], width: 1.1, year: 1966},
    ],
    // the countryside out toward Phu Wiang stays country: the 1976 dig must not stand in a suburb
    openGround: [{x0: -48, x1: -30, z0: -36, z1: -14}],
    ringRoadYear: 1e9,
    cars: [1960, 2026],
    boats: [1800, 1960],
    finale: 'fireworks',
    life: {
      buffalo: [{x: 22, z: 14, r: 4, count: 6, from: 1810, to: 1970}],
      people: [{x: -6.5, z: -3, r: 1.6, count: 24, from: 1797.1, to: 2026}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: KhonKaenLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_khonkaen.wav',
  sky: {
    top: [
      [-2e8, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [-2e8, '#f2d9a8'],
      [-1e6, '#f2d9a8'],
      [1700, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[-2e8, '#8a9a52'], [-1e6, '#8a9a52'], ...GROUND],
  },
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1850) / 100))),
  gloom: () => 0,
};
