import {ramp} from '../../lib';
import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {CHANDRA, CHULAMANI, HX, HZ, PhitsanulokLandmarks, WAT_YAI} from './Landmarks';
import {CAPTIONS, DURATION, ERAS, yearAt} from './timeline';

const OLD = ['#e9e2d0', '#3f5f8f', '#a8322a', '#2f6a4a', '#d9a43a', '#7a5a3a'];
const TODAY = ['#e8505b', '#f9d56e', '#14b1ab', '#f3ecc2', '#ff9a3c', '#6a8caf', '#ffffff'];

/* The Nan runs north-south straight through the city — Phitsanulok grew on
 * both banks, which is the whole point of the old name สองแคว. The Khwae Noi
 * comes in from the west and stops at the confluence. */
const NAN_X = -2;
const KHWAE_Z = -30;

export const PHITSANULOK: CityConfig = {
  id: 'phitsanulok',
  story: {
    captions: CAPTIONS,
    eras: ERAS,
    yearAt,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'พิษณุโลก', sub: 'เมืองสองแคว ริมฝั่งน่าน'},
    finale: {kicker: 'พ.ศ. 1900 – 2569', title: 'พิษณุโลก', sub: 'เผาแล้วสร้างใหม่ ยังยืนอยู่ริมน้ำน่าน'},
    approxBefore: 1350,
    duration: DURATION,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -46, z1: 50},
    // low hills east of town; the central plain runs west
    peaks: [
      [44, -18, 11, 13],
      [46, 10, 9, 11],
      [40, 34, 7, 9],
    ],
    rivers: [
      {axis: 'z', pos: NAN_X, width: 4.4}, // Nan
      {axis: 'x', pos: KHWAE_Z, width: 2.6, span: [-48, NAN_X]}, // Khwae Noi, ends at the confluence
    ],
    bridges: [
      {at: 0, year: 1925, modernYear: 1960},
      {at: -16, year: 1968, modernYear: 1968},
    ],
    // the Nan is the city's water; no separate ring moat
    noMoat: true,
    rail: {axis: 'z', pos: -26, open: [1907, 1909], station: [-26, 2], stationYear: 1907},
    trains: [
      {t0: 62.0, dur: 5.2, dir: 1, modern: false},
      {t0: 70.0, dur: 4.6, dir: -1, modern: true},
    ],
    city: {
      hx: HX,
      hz: HZ,
      moat: [1455, 1462],
      wall: [1459, 1468],
      gates: [1464, 1470],
      // burned in the siege, left derelict, only partly restored as a park
      decay: [1776, 1830, 1960, 1995],
      groundFrom: 1150,
    },
    gates: [
      {x: HX, z: 0, rot: 0, width: 2.4, pavilion: true},
      {x: -HX, z: 0, rot: 0, width: 2.4},
      {x: 0, z: HZ, rot: Math.PI / 2, width: 2.4},
      {x: 0, z: -HZ, rot: Math.PI / 2, width: 2.4},
    ],
    houses: {
      built: [1150, 320],
      // the 1775 sack empties the town; it refills slowly from ~1830
      abandon: {prob: 0.8, from: 1776, spread: 30, rebuild: 1840, rebuildSpread: 90},
      modern: [1958, 46], // rebuilt in concrete after the fire
      keepOut: [
        [WAT_YAI[0], WAT_YAI[1], 5.2],
        [CHANDRA[0], CHANDRA[1], 4.6],
        [NAN_X, 0, 3.2],
      ],
    },
    villages: {
      centers: [
        [-28, 22],
        [26, -26],
        [-32, -18],
        [18, 30],
        [-16, 36],
      ],
      built: [1120, 260],
    },
    forestCity: 1150,
    regrowCity: [1800, 1870], // scrub over the burned quarter, then cleared again
    clearings: [
      [CHULAMANI[0], CHULAMANI[1], 5.5, 1100],
      [WAT_YAI[0], WAT_YAI[1], 6.5, 1345],
      [CHANDRA[0], CHANDRA[1], 5.5, 1450],
      [0, 0, 20, 1460],
    ],
    paddies: [1100, 1500],
    urban: {from: 1958, rate: 1.05}, // the post-fire rebuild is the real start of the modern city
    towers: [{x0: -14, x1: 14, z0: -16, z1: 16, extra: 2}],
    roads: [
      {from: [-11, 0], to: [-46, 0], width: 1.8, year: 1962},
      {from: [11, 0], to: [46, 0], width: 1.8, year: 1962},
      {from: [0, 13], to: [0, 48], width: 1.6, year: 1972},
    ],
    ringRoadYear: 1985,
    cars: [1960, 2026],
    boats: [1150, 2026], // the Nan carried trade long before the railway
    finale: 'loykrathong',
    krathongPonds: [],
    life: {
      people: [
        {x: WAT_YAI[0] - 3, z: WAT_YAI[1] + 3, r: 3.0, count: 30, from: 1360, to: 1770, colors: OLD},
        {x: WAT_YAI[0] - 4, z: WAT_YAI[1] - 1, r: 2.4, count: 8, from: 1360, to: 2100, monks: true},
        {x: 2.5, z: 5, r: 3.6, count: 44, from: 1465, to: 1775, colors: OLD}, // the royal-capital market
        {x: CHANDRA[0] + 2, z: CHANDRA[1] + 3, r: 2.6, count: 18, from: 1465, to: 1775, colors: OLD},
        {x: WAT_YAI[0] - 3, z: WAT_YAI[1] + 3.5, r: 4.5, count: 40, from: 1975, to: 2100, colors: TODAY},
        {x: 1, z: -7, r: 5, count: 26, from: 1990, to: 2100, colors: TODAY},
      ],
      stalls: [
        {x: 2.5, z: 5, r: 3.0, count: 16, from: 1465, to: 1775},
        {x: WAT_YAI[0] - 2, z: WAT_YAI[1] + 5, r: 2.6, count: 12, from: 1975, to: 2100},
      ],
      ships: [{river: 0, count: 7, from: 1200, to: 1960}],
      houseboats: [{river: 0, count: 5, from: 1850, to: 2026}],
      elephants: [{x: 4, z: 7, r: 2.0, count: 3, from: 1465, to: 1700, howdah: true}],
      buffalo: [
        {x: -26, z: 20, r: 4.5, count: 7, from: 1150, to: 1960},
        {x: 24, z: -22, r: 4, count: 5, from: 1150, to: 1960},
      ],
    },
    plane: [1998, 2026],
    cameraKeys: [
      // [t, targetX, targetY, targetZ, distance, azimuth°, elevation°, fov°]
      [0, 0, 2, 0, 430, 40, 30, 30],
      [3, 0, 1, 0, 350, 44, 30, 30],
      [6, -4, 0, -22, 90, 50, 32, 30], // the confluence — "two rivers"
      [8, -3, 0, -16, 62, 58, 30, 30],
      [10, CHULAMANI[0], 2, CHULAMANI[1], 46, 40, 28, 30],
      [12, CHULAMANI[0], 2, CHULAMANI[1], 38, 70, 26, 30],
      [14, 0, 0, 4, 60, 60, 30, 30],
      [15.5, 2, 0, 2, 34, 50, 26, 30],
      [18, WAT_YAI[0] - 8.2, 1.8, WAT_YAI[1], 15, 272, 16, 30], // on the image, from the front
      [21, WAT_YAI[0] - 8.2, 1.8, WAT_YAI[1], 13, 248, 14, 28],
      [23, WAT_YAI[0], 4, WAT_YAI[1], 34, 100, 26, 30],
      [26, WAT_YAI[0], 4, WAT_YAI[1], 44, 60, 30, 30],
      [29, 0, 2, 0, 105, 45, 36, 30], // the city becomes a capital
      [32, 2.5, 0, 5, 36, 40, 26, 30], // market dive
      [34, 3, 0, 5, 20, 70, 18, 28],
      [36, 0, 2, 0, 95, 80, 34, 30],
      [39, CHANDRA[0], 2, CHANDRA[1], 60, 20, 30, 30],
      [42, CHANDRA[0], 2.0, CHANDRA[1], 46, 35, 34, 30], // Naresuan's birthplace
      [45, CHANDRA[0], 2.0, CHANDRA[1], 40, 72, 31, 30],
      [48, 0, 2, 0, 90, 55, 32, 30],
      [52, 0, 2, 0, 120, 30, 34, 30],
      [55, 0, 3, 0, 100, 10, 30, 30], // war
      [58, 0, 3, 0, 86, -20, 36, 32], // the sack
      [61, 0, 2, 0, 110, 15, 32, 30],
      [63.5, 0, 1, 0, 70, 40, 28, 30],
      [65.5, 1, 2, 2, 62, 55, 36, 32], // the fire
      [67.5, 0, 2, 0, 80, 70, 30, 30],
      [69.5, WAT_YAI[0] - 3, 0, WAT_YAI[1] + 3, 30, 60, 24, 30], // today, at the temple
      [71.5, WAT_YAI[0], 3, WAT_YAI[1], 46, 100, 28, 30],
      [73, 0, 2, 0, 120, 60, 30, 30],
      [75, 0, 4, 0, 240, 50, 27, 30],
    ],
  },
  Landmarks: PhitsanulokLandmarks,
  callouts: [
    {t0: 6.2, t1: 9.4, label: 'แม่น้ำน่าน', dx: 90, dy: 130, p: [NAN_X, 0, -8]},
    {t0: 6.8, t1: 9.4, label: 'แม่น้ำแควน้อย', dx: -70, dy: -130, p: [-22, 0, KHWAE_Z]},
    {t0: 10.4, t1: 13.4, label: 'วัดจุฬามณี', dx: 70, dy: -140, p: [CHULAMANI[0], 4, CHULAMANI[1]]},
    {t0: 19.4, t1: 22.6, label: 'พระพุทธชินราช', dx: 80, dy: -140, p: [WAT_YAI[0] - 8.2, 2.4, WAT_YAI[1]]},
    {t0: 24, t1: 28.2, label: 'ปรางค์วัดใหญ่', dx: -90, dy: -150, p: [WAT_YAI[0], 9, WAT_YAI[1]]},
    {t0: 42.6, t1: 46.6, label: 'พระราชวังจันทน์', dx: -60, dy: -140, p: [CHANDRA[0], 2.2, CHANDRA[1]]},
    {t0: 62.6, t1: 65, label: 'สถานีรถไฟพิษณุโลก', dx: 70, dy: -130, p: [-26, 2, 2]},
  ],
  soundtrack: 'soundtrack_phitsanulok.wav',
  sky: {
    top: [
      [1000, '#6aa8d6'],
      [1776, '#5f87ab'],
      [1850, '#6aa8d6'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1000, '#f2e2c0'],
      [1463, '#ffe6bc'],
      [1776, '#c8a07e'],
      [1957, '#e8b48a'],
      [1975, '#dfe7dc'],
      [2026, '#d3e8f7'],
    ],
    ground: GROUND,
  },
  // the sack-to-rebuild century, plus a short sepia punch around the fire
  gloom: (Y) =>
    ramp(Y, 1776, 1790) * (1 - ramp(Y, 1830, 1880)) * 0.45 +
    ramp(Y, 1955, 1957) * (1 - ramp(Y, 1958, 1968)) * 0.4,
  rain: [],
};
