import {bump, ramp} from '../../lib';
import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {
  AyutthayaLandmarks,
  CHAIWAT,
  DUTCH,
  MAHATHAT,
  PALACE,
  PHANAN,
  POM_PHET,
  PORTUGUESE,
  RATCHABURANA,
  SANPHET,
  JAPANESE,
} from './Landmarks';
import {CAPTIONS, DURATION, ERAS, yearAt} from './timeline';

const TOURISTS = ['#e8505b', '#f9d56e', '#14b1ab', '#f3ecc2', '#ff9a3c', '#6a8caf', '#ffffff'];
const COURT = ['#7a2a2a', '#d9a43a', '#f1e0b0', '#334f7a', '#3f6f4a'];
const FOREIGNERS = ['#23334d', '#8a3528', '#e9e2d0', '#375f8a', '#5a3a2a', '#d9a43a'];

const ISLAND: [number, number][] = [
  [-20.8, -13.8],
  [-6.5, -7.2],
  [7.0, -9.5],
  [19.5, -12.5],
  [21.8, -14.6],
  [23.2, -4.0],
  [22.0, 9.6],
  [12.0, 8.0],
  [-2.0, 14.2],
  [-13.0, 14.0],
  [-22.0, 18.0],
  [-25.5, 12.0],
  [-24.0, 0.0],
  [-21.5, -6.5],
];

export const AYUTTHAYA: CityConfig = {
  id: 'ayutthaya',
  story: {
    captions: CAPTIONS,
    eras: ERAS,
    yearAt,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'อยุธยา', sub: 'เกาะเมืองแห่งสายน้ำ 417 ปีราชธานี'},
    finale: {kicker: 'พ.ศ. 1867 – 2569', title: 'อยุธยา', sub: 'ราชธานีเก่า มรดกโลกที่ยังมีชีวิต'},
    approxBefore: 1324,
    duration: DURATION,
  },
  layout: {
    tile: {x0: -38, x1: 38, z0: -34, z1: 36},
    peaks: [],
    // The four outer paths are the real river bends around the island. The five
    // narrow paths are the principal canals visible on the 1687 survey.
    rivers: [
      {path: [[-22.2, -15.5], [-7.0, -9.0], [7.3, -11.2], [20.0, -14.0], [23.2, -16.4]], width: 1.1}, // Lopburi / Khlong Mueang
      {path: [[23.2, -16.4], [25.0, -4.0], [23.8, 9.8], [22.8, 11.5]], width: 1.9}, // Pa Sak / Khu Khue Na
      {path: [[22.8, 11.5], [12.0, 10.2], [-2.0, 16.0], [-13.0, 15.8], [-22.2, 19.7], [-27.6, 16.0]], width: 2.4}, // Chao Phraya south
      {path: [[-27.6, 16.0], [-27.0, 11.5], [-25.6, 0.0], [-23.2, -7.0], [-22.2, -15.5]], width: 2.1}, // Chao Phraya west
      {path: [[0.2, -9.0], [0.0, -2.0], [-0.2, 6.0], [-1.4, 14.6]], width: 0.32}, // Khlong Pratu Chai
      {path: [[-14.0, -10.5], [-13.0, -2.0], [-12.5, 6.0], [-12.8, 14.3]], width: 0.28}, // Khlong Chakrai Yai
      {path: [[12.2, -10.7], [11.5, -3.0], [12.0, 4.5], [15.8, 9.1]], width: 0.28}, // Khlong Pa Than
      {path: [[-13.4, -4.0], [-5.0, -3.6], [0.0, -3.2]], width: 0.26}, // Khlong Tho
      {path: [[-0.1, 4.2], [6.0, 4.0], [11.8, 4.4]], width: 0.26}, // Khlong Wat Racha
    ],
    noMoat: true,
    bridges: [],
    rail: {axis: 'z', pos: 30.2, open: [1896, 1897.5], station: [27.7, -4.0], stationYear: 1897},
    trains: [{t0: 68.0, dur: 3.0, dir: 1, modern: true}],
    city: {
      hx: 26.0,
      hz: 18.5,
      outline: ISLAND,
      moat: [1349, 1351],
      wall: [1549, 1555],
      gates: [1549, 1556],
      decay: [1767, 1768.5, 9999, 9999],
      ruinStrength: 0.92,
      groundFrom: 1300,
    },
    gates: [
      {x: -20.8, z: -13.8, rot: 0.44, width: 1.8, pavilion: true},
      {x: 21.8, z: -14.6, rot: -0.16, width: 1.8, pavilion: true},
      {x: 22.0, z: 9.6, rot: 0.16, width: 2.0, pavilion: true},
      {x: -2.0, z: 14.2, rot: Math.PI / 2, width: 2.0, pavilion: true},
      {x: -25.5, z: 12.0, rot: -0.12, width: 1.8, pavilion: true},
    ],
    houses: {
      built: [1324, 220],
      abandon: {prob: 0.96, from: 1767, spread: 45, rebuild: 1897, rebuildSpread: 105},
      modern: [1940, 75],
      keepOut: [
        [PHANAN[0], PHANAN[1], 3.0],
        [PALACE[0], PALACE[1], 4.2],
        [SANPHET[0], SANPHET[1], 4.0],
        [MAHATHAT[0], MAHATHAT[1], 3.3],
        [RATCHABURANA[0], RATCHABURANA[1], 3.0],
        [POM_PHET[0], POM_PHET[1], 2.6],
        [CHAIWAT[0], CHAIWAT[1], 6.0],
        [DUTCH[0], DUTCH[1], 3.0],
        [PORTUGUESE[0], PORTUGUESE[1], 3.2],
        [JAPANESE[0], JAPANESE[1], 3.4],
        [27.7, -4.0, 2.8],
      ],
    },
    villages: {
      centers: [[-32, -12], [-33, 25], [31, 20], [31, -20], [5, 28], [-8, -25]],
      built: [1300, 210],
    },
    forestCity: 1348,
    regrowCity: [1768, 1955],
    clearings: [
      [PHANAN[0], PHANAN[1], 4.0, 1318],
      [PALACE[0], PALACE[1], 5.0, 1348],
      [SANPHET[0], SANPHET[1], 4.5, 1446],
      [MAHATHAT[0], MAHATHAT[1], 4.0, 1370],
      [RATCHABURANA[0], RATCHABURANA[1], 3.8, 1420],
      [POM_PHET[0], POM_PHET[1], 3.2, 1545],
      [CHAIWAT[0], CHAIWAT[1], 7.0, 1628],
      [DUTCH[0], DUTCH[1], 3.8, 1630],
      [PORTUGUESE[0], PORTUGUESE[1], 4.0, 1535],
      [JAPANESE[0], JAPANESE[1], 4.2, 1595],
      [27.7, -4.0, 3.5, 1895],
    ],
    paddies: [1200, 1970],
    urban: {from: 1910, rate: 0.55},
    towers: [
      {x0: 25, x1: 38, z0: -16, z1: 14, extra: 2},
      {x0: -8, x1: 18, z0: 18, z1: 34, extra: 1},
    ],
    roads: [
      {from: [17.0, -4.0], to: [38.0, -4.0], width: 1.5, year: 1897},
      {from: [-22.0, 0.0], to: [22.0, 0.0], width: 1.2, year: 1935},
      // Chikun Road runs east of Khlong Pratu Chai; never put the road in the canal bed.
      {from: [4.0, -11.0], to: [4.0, 12.0], width: 1.2, year: 1935},
      {from: [-36.0, 22.0], to: [34.0, 22.0], width: 1.4, year: 1955},
    ],
    ringRoadYear: 9999,
    cars: [1948, 2026],
    boats: [1300, 2026],
    finale: 'fireworks',
    life: {
      people: [
        {x: PHANAN[0], z: PHANAN[1] - 1.2, r: 2.0, count: 24, from: 1324, to: 2026, monks: true},
        {x: PALACE[0] + 2.0, z: PALACE[1] + 1.0, r: 3.2, count: 42, from: 1350, to: 1767, colors: COURT},
        {x: 5.0, z: 1.5, r: 4.0, count: 38, from: 1374, to: 1767, colors: COURT},
        {x: 17.5, z: 21.5, r: 6.0, count: 70, from: 1540, to: 1767, colors: FOREIGNERS},
        {x: SANPHET[0], z: SANPHET[1] + 2.0, r: 4.0, count: 55, from: 1991, to: 2100, colors: TOURISTS},
        {x: MAHATHAT[0], z: MAHATHAT[1] + 2.0, r: 3.0, count: 35, from: 1991, to: 2100, colors: TOURISTS},
      ],
      stalls: [
        {x: 5.0, z: 2.0, r: 4.0, count: 18, from: 1450, to: 1767},
        {x: 18.0, z: 21.0, r: 4.5, count: 16, from: 1600, to: 1767},
        {x: 9.0, z: 3.0, r: 3.0, count: 12, from: 1991, to: 2100},
      ],
      ships: [
        {river: 2, count: 10, from: 1550, to: 1767},
        {river: 1, count: 5, from: 1550, to: 1767},
      ],
      houseboats: [
        {river: 0, count: 10, from: 1324, to: 1955},
        {river: 2, count: 12, from: 1360, to: 1955},
        {river: 3, count: 8, from: 1380, to: 1955},
      ],
      elephants: [
        {x: -2.0, z: 2.0, r: 3.0, count: 3, from: 1450, to: 1767, howdah: true},
        {x: -7.0, z: 2.0, r: 2.5, count: 2, from: 1995, to: 2100, howdah: true},
      ],
      buffalo: [{x: -31, z: -22, r: 5.0, count: 6, from: 1300, to: 1960}],
    },
    cameraKeys: [
      [0.0, 0, 2, 0, 260, 25, 38, 30],
      [3.0, 0, 2, 0, 210, 42, 36, 30],
      [3.8, PHANAN[0], 1, PHANAN[1], 72, 55, 31, 28],
      [5.6, PHANAN[0], 1, PHANAN[1], 62, 76, 30, 28],
      [8.8, PHANAN[0] - 2, 1, PHANAN[1] - 2, 70, 98, 31, 28],
      [10.0, 0, 2, 0, 150, 112, 38, 30],
      [12.5, 0, 2, 0, 132, 130, 36, 30],
      [15.8, 0, 2, 0, 115, 148, 34, 30],
      [17.0, MAHATHAT[0], 1, MAHATHAT[1], 58, 160, 30, 28],
      [19.4, MAHATHAT[0], 1, MAHATHAT[1], 54, 180, 30, 28],
      [20.5, RATCHABURANA[0], 1, RATCHABURANA[1], 52, 195, 30, 28],
      [22.8, 2, 2, -3, 105, 210, 35, 30],
      [24.0, PALACE[0], 1, PALACE[1], 64, 220, 31, 28],
      [26.5, PALACE[0], 1, PALACE[1], 58, 242, 31, 28],
      [29.6, SANPHET[0], 1, SANPHET[1], 62, 262, 32, 28],
      [30.8, SANPHET[0], 2, SANPHET[1], 78, 272, 34, 29],
      [33.7, 6, 2, 0, 102, 292, 36, 30],
      [36.6, POM_PHET[0], 1, POM_PHET[1], 72, 310, 31, 28],
      [37.8, 4, 2, -2, 122, 322, 37, 30],
      [40.6, 17, 2, -10, 70, 342, 32, 28],
      [43.4, 3, 2, 0, 94, 360, 35, 30],
      [44.6, CHAIWAT[0], 2, CHAIWAT[1], 74, 372, 32, 28],
      [47.2, CHAIWAT[0], 2, CHAIWAT[1], 58, 394, 31, 28],
      [50.2, CHAIWAT[0] + 2, 2, CHAIWAT[1], 64, 414, 31, 28],
      [51.4, 18, 1, 21, 112, 426, 35, 30],
      [54.0, 18, 1, 21, 86, 448, 31, 29],
      [57.0, 18, 1, 21, 76, 470, 30, 28],
      [58.0, 3, 2, 0, 132, 482, 38, 30],
      [60.5, 4, 2, -3, 92, 504, 34, 29],
      [63.4, PALACE[0], 2, PALACE[1], 82, 526, 33, 28],
      [64.2, 1, 2, -2, 80, 538, 34, 28],
      [67.2, 1, 2, -2, 88, 558, 35, 29],
      [67.8, 0, 3, 0, 150, 570, 40, 30],
      [70.6, 0, 3, 0, 205, 594, 43, 30],
      [75.0, 0, 4, 1, 270, 628, 46, 30],
    ],
  },
  Landmarks: AyutthayaLandmarks,
  callouts: [
    {t0: 4.1, t1: 7.7, label: 'วัดพนัญเชิง', dx: 70, dy: -130, p: [PHANAN[0], 2.7, PHANAN[1]]},
    {t0: 10.7, t1: 14.4, label: 'เกาะเมืองอยุธยา', dx: -70, dy: -140, p: [0, 1, 0]},
    {t0: 17.3, t1: 19.9, label: 'วัดมหาธาตุ', dx: 75, dy: -135, p: [MAHATHAT[0], 7.0, MAHATHAT[1]]},
    {t0: 20.5, t1: 22.5, label: 'วัดราชบูรณะ', dx: -70, dy: -135, p: [RATCHABURANA[0], 7.0, RATCHABURANA[1]]},
    {t0: 24.4, t1: 27.8, label: 'พระราชวังโบราณ', dx: -70, dy: -140, p: [PALACE[0], 5.0, PALACE[1]]},
    {t0: 31.2, t1: 34.5, label: 'วัดพระศรีสรรเพชญ์', dx: 80, dy: -145, p: [SANPHET[0], 6.5, SANPHET[1]]},
    {t0: 34.2, t1: 36.4, label: 'ป้อมเพชร', dx: 70, dy: -125, p: [POM_PHET[0], 2.2, POM_PHET[1]]},
    {t0: 40.2, t1: 43.1, label: 'หัวรอและแนวป้องกันตะวันออก', dx: 70, dy: -135, p: [20.0, 2.0, -12.5]},
    {t0: 45.0, t1: 49.5, label: 'วัดไชยวัฒนาราม', dx: 75, dy: -145, p: [CHAIWAT[0], 3.0, CHAIWAT[1]]},
    {t0: 52.0, t1: 55.8, label: 'หมู่บ้านฮอลันดา', dx: -70, dy: 130, p: [DUTCH[0], 3.2, DUTCH[1]]},
    {t0: 52.5, t1: 56.3, label: 'หมู่บ้านญี่ปุ่นและโปรตุเกส', dx: 70, dy: 150, p: [JAPANESE[0], 2.0, JAPANESE[1]]},
    {t0: 68.2, t1: 70.5, label: 'อุทยานประวัติศาสตร์อยุธยา', dx: 70, dy: -145, p: [SANPHET[0], 6.5, SANPHET[1]]},
  ],
  soundtrack: 'soundtrack_ayutthaya.wav',
  sky: {
    top: [
      [1300, '#6aa8d6'],
      [1568, '#6aa8d6'],
      [1569.2, '#65758a'],
      [1590, '#6aa8d6'],
      [1766, '#6aa8d6'],
      [1767.3, '#493940'],
      [1780, '#82919a'],
      [1960, '#6aa8d6'],
      [2026, '#355f9a'],
    ],
    bottom: [
      [1300, '#e8eedd'],
      [1568, '#ffe0b0'],
      [1569.2, '#bd7654'],
      [1590, '#e8eedd'],
      [1766, '#ffe0b0'],
      [1767.3, '#bb5533'],
      [1780, '#bbb29e'],
      [1960, '#e6eddd'],
      [2026, '#efb66f'],
    ],
    ground: GROUND,
  },
  gloom: (Y) => Math.max(bump(Y, 1568.7, 1570.2, 0.35) * 0.62, ramp(Y, 1766.8, 1767.3) * (1 - ramp(Y, 1908, 1976)) * 0.78),
};
