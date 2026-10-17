import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {LampangLandmarks} from './Landmarks';
import {ACTORS, HERO_AT} from './actors';
import {
  BAN_SAO_NAK, BRIDGE, BRIDGE_AT, CLOCK_TOWER, KAD_KONG_TA, KHUN_TAN, KILNS, LAMPANG_LUANG, MAE_MOH, PRATU_MA, STATION, WALL, WANG, WAT_PHRA_KAEW, WAT_SI_CHUM,
} from './places';
import {SOUND_EVENTS, STORY} from './timeline';

// World origin = centre of the approximate เขลางค์ wall oval (18.29838, 99.50423), 80 m/unit,
// +x east, -z north. Pins, river and the ONEP zone from docs/briefs/lampang.md.
export const LAMPANG: CityConfig = {
  id: 'lampang',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ลำปาง', sub: 'เขลางค์นคร เมืองรถม้า'},
    finale: {kicker: 'เขลางค์นคร', title: 'ลำปาง', sub: 'รถม้า · ชามตราไก่ · วัดพระธาตุลำปางหลวง'},
    approxBefore: 1400,
    duration: STORY.duration,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -48, z1: 48},
    // a basin ringed by hills: ดอยขุนตาล (1,304 m) WNW, pulled in to the tile corner; lower
    // ranges west and east (heights for these are [unknown] -- kept modest)
    peaks: [
      [KHUN_TAN[0], KHUN_TAN[1], 13, 9],
      [-46, -14, 8, 8],
      [46, 18, 6, 7],
    ],
    // แม่น้ำวัง, ~50 m at the bridge, drawn 72 m so boats and logs read
    rivers: [{path: WANG, width: 0.9}],
    // สะพานรัษฎาภิเศก: first built 1894, the present bridge 1917
    bridges: [{at: BRIDGE_AT, year: 1894, modernYear: 1917}],
    // 1 April 1916 Lampang is the end of the line: the station is a terminus at the west end
    rail: {axis: 'x', pos: 28, open: [1915.4, 1916.1], station: STATION, stationYear: 1915.6, span: [-44, 48]},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1, park: 3})),
    city: {
      hx: 8.2,
      hz: 5.2,
      outline: WALL,
      // the legend's earth wall rises while the legend caption is up (t ~3.5-6 s)
      moat: [676, 684],
      wall: [678, 690],
      gates: [686, 692],
      // the เขลางค์ circuit survives today only in fragments (ประตูม้า): no intact enclosure in
      // modern shots (CLAUDE.md), worn down as the town grows over it
      decay: [1920, 1970, 9999, 9999],
      ruinStrength: 0.85,
      groundFrom: 674,
    },
    gates: [{x: PRATU_MA[0], z: PRATU_MA[1], rot: -0.47, width: 1.4, pavilion: true}],
    houses: {
      built: [700, 300],
      modern: [1920, 80],
      keepOut: [[WAT_PHRA_KAEW[0], WAT_PHRA_KAEW[1], 1.4]],
    },
    villages: {
      centers: [
        [-20, -6],
        [20, 10],
        [-24, 34],
        [14, -26],
        [26, 32],
      ],
      built: [800, 1100],
    },
    forestCity: 680,
    clearings: [
      // the opening carriage trots across a clearing north of the town
      [HERO_AT[0] + 2, HERO_AT[1], 5, -1e9],
      [LAMPANG_LUANG[0], LAMPANG_LUANG[1], 4.5, 1430],
      [MAE_MOH[0], MAE_MOH[1], 7, 1954],
      [KILNS[0], KILNS[1], 3.2, 1954],
    ],
    paddies: [900, 1500],
    sites: [
      [WAT_PHRA_KAEW[0], WAT_PHRA_KAEW[1], 1.6],
      [LAMPANG_LUANG[0], LAMPANG_LUANG[1], 3.4],
      [WAT_SI_CHUM[0], WAT_SI_CHUM[1], 1.3],
      [BAN_SAO_NAK[0], BAN_SAO_NAK[1], 0.9],
      [KILNS[0], KILNS[1], 2.4],
      [MAE_MOH[0], MAE_MOH[1] + 2, 8],
      [CLOCK_TOWER[0], CLOCK_TOWER[1], 0.6],
      [PRATU_MA[0], PRATU_MA[1], 0.9],
    ],
    urban: {from: 1916, rate: 2.2},
    sprawl: {height: 0.75, tall: 0.03},
    highRise: 1990,
    towers: [{x0: -17, x1: -8, z0: 17, z1: 26, extra: 3}],
    roads: [
      // station road to the clock tower and over the Wang into the old town
      {from: [STATION[0] + 5, STATION[1] - 3.6], to: CLOCK_TOWER, width: 1.1, year: 1916},
      {from: CLOCK_TOWER, to: [BRIDGE[0], 12], width: 1.1, year: 1916},
      {from: [BRIDGE[0], 12], to: [BRIDGE[0], 4.9], width: 1.1, year: 1894},
      // road east to Mae Moh, south of the pit
      {from: [8.6, -1.4], to: [34, -1], width: 1.1, year: 1955},
      {from: [34, -1], to: [48, 3], width: 1.1, year: 1955},
    ],
    // no engine ring road: its rectangle would lie along the Wang's bends (cars on the water)
    ringRoadYear: 1e9,
    cars: [1960, 2026],
    boats: [700, 1960],
    finale: 'fireworks',
    life: {
      // working elephants on the teak banks, buffalo in the paddies, the riverside market
      elephants: [{x: 16, z: -8, r: 2.5, count: 3, from: 1870, to: 1935}],
      buffalo: [{x: -22, z: -2, r: 4, count: 5, from: 950, to: 1960}],
      people: [{x: KAD_KONG_TA[0], z: KAD_KONG_TA[1] + 1, r: 1.2, count: 26, from: 1900, to: 2026}],
      stalls: [{x: KAD_KONG_TA[0], z: KAD_KONG_TA[1] + 1, r: 1.1, count: 10, from: 1900, to: 2026}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: LampangLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_lampang.wav',
  sky: {
    top: [
      [0, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [0, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: GROUND,
  },
  // the forest-only opening reads dark (Nakhon Si's lesson): lift the sky fill until the town grows
  ambient: (Y) => 0.4 * (1 - Math.min(1, Math.max(0, (Y - 1300) / 200))),
  gloom: () => 0,
};
