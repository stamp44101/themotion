import {ramp} from '../../lib';
import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {CHEDI, NakhonSiLandmarks, NORTH_GATE} from './Landmarks';
import {CAPTIONS, ERAS, yearAt} from './timeline';

// Style-frame draft. World origin = old-town centroid (8.41680, 99.96438), 80 m/unit,
// +x east, -z north. Footprint and canals from docs/briefs/nakhonsi.md (Google Maps / OSM).
export const NAKHONSI: CityConfig = {
  id: 'nakhonsi',
  look: 'shader',
  story: {
    captions: CAPTIONS,
    eras: ERAS,
    yearAt,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'นครศรีธรรมราช', sub: 'เมืองพระธาตุ มรดกโลกแห่งแดนใต้'},
    finale: {kicker: 'มรดกโลก พ.ศ. 2569', title: 'นครศรีธรรมราช', sub: 'พระบรมธาตุเจดีย์ · เขาหลวง · อ่าวไทย'},
    approxBefore: 1600,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -50, z1: 50},
    // Khao Luang range: 26 km WNW of the old town (far), pulled to the tile's west edge.
    // Real summit ~1,800 m (disputed 1,780 / 1,835); the tallest peak sits WNW of the chedi.
    peaks: [
      [-44, -4, 18, 22],
      [-46, 8, 14, 12],
      [-44, -36, 12, 10],
      [-46, 28, 12, 9],
    ],
    rivers: [
      // Gulf of Thailand: 13 km east in reality, compressed to the tile's east edge
      {axis: 'z', pos: 44, width: 10},
      // คลองหน้าเมือง: along the north wall, then east to the Gulf (OSM way 145173593)
      {path: [[-6.5, -14.6], [-0.8, -15.6], [1.7, -15.9], [3.2, -16.0], [12.5, -18.4], [26, -24], [39, -27]], width: 0.4},
      // คลองท่าซัก: north of the old town, past Tha Wang (OSM)
      {path: [[-12, -50], [-10.3, -44.2], [-7.7, -37.6], [5.5, -43.6], [16.1, -44.4], [39, -46]], width: 0.35},
    ],
    bridges: [],
    trains: [],
    city: {
      hx: 5.1,
      hz: 15.1,
      // corners NW, NE, SE, SW (brief §1): tilted ~3 deg east of north
      outline: [
        [-5.1, -14.8],
        [0.6, -14.5],
        [5.1, 15.1],
        [-0.7, 14.8],
      ],
      moat: [1686, 1688],
      wall: [1686, 1688],
      gates: [1687, 1689],
      groundFrom: 1200,
    },
    gates: [{x: NORTH_GATE[0], z: NORTH_GATE[1], rot: Math.PI / 2, width: 1.6, pavilion: true}],
    houses: {
      built: [1250, 500],
      modern: [1920, 80],
      keepOut: [[CHEDI[0], CHEDI[1], 4.2]],
    },
    villages: {
      centers: [
        [-14, 6],
        [12, -6],
        [14, 22],
        [-16, -24],
      ],
      built: [700, 1000],
    },
    forestCity: 1100,
    clearings: [[CHEDI[0], CHEDI[1], 4.5, 300]],
    paddies: [800, 1500],
    urban: {from: 1930, rate: 2.2},
    highRise: 1990,
    towers: [{x0: -8, x1: 12, z0: -38, z1: -20, extra: 4}],
    roads: [],
    ringRoadYear: 1975,
    cars: [1960, 2026],
    boats: [300, 2026],
    finale: 'fireworks',
    cameraKeys: [
      // A: the whole tile, Khao Luang on the left, the chedi in the long walled town
      // camera east of the town looking west: Khao Luang stands behind the chedi
      [0, CHEDI[0], 3, CHEDI[1], 170, 95, 26, 30],
      [3, CHEDI[0], 3, CHEDI[1], 130, 98, 26, 30],
      // B: the chedi with the mountain behind it
      [18, CHEDI[0], 3, CHEDI[1], 60, 95, 22, 30],
      [24, CHEDI[0], 3, CHEDI[1], 58, 105, 22, 30],
      // C: night finale over the chedi and the modern town
      [50, 0, 2, 0, 160, 125, 32, 30],
      [60, 0, 2, 0, 200, 130, 34, 30],
    ],
  },
  Landmarks: NakhonSiLandmarks,
  callouts: [],
  soundtrack: 'soundtrack_korat.wav',
  sky: {
    top: [
      [0, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [0, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [...GROUND],
  },
  gloom: (Y) => ramp(Y, 1767, 1767.5) * (1 - ramp(Y, 1769, 1770)),
};
