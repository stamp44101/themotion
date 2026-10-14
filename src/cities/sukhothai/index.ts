import {ramp} from '../../lib';
import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {HX, HZ, KILNS, MAHATHAT, PALACE, PHRA_PHAI_LUANG, SA_SI, SI_CHUM, SI_SAWAI, SukhothaiLandmarks} from './Landmarks';
import {CAPTIONS, DURATION, ERAS, yearAt} from './timeline';

const TOURISTS = ['#e8505b', '#f9d56e', '#14b1ab', '#f3ecc2', '#ff9a3c', '#6a8caf', '#ffffff'];
const OLD = ['#e9e2d0', '#3f5f8f', '#a8322a', '#2f6a4a', '#d9a43a', '#7a5a3a'];

export const SUKHOTHAI: CityConfig = {
  id: 'sukhothai',
  story: {
    captions: CAPTIONS,
    eras: ERAS,
    yearAt,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สุโขทัย', sub: 'รุ่งอรุณแห่งความสุข'},
    finale: {kicker: 'มรดกโลก · ต้นทางลายสือไทย', title: 'สุโขทัย', sub: 'รุ่งอรุณแห่งความสุข ยังเรืองรองถึงวันนี้'},
    approxBefore: 1250,
    duration: DURATION,
  },
  layout: {
    tile: {x0: -50, x1: 46, z0: -46, z1: 50},
    // Khao Luang hills on the western edge
    peaks: [
      [-47, -12, 14, 12],
      [-48, 12, 12, 10],
      [-44, -34, 10, 10],
      [-42, 34, 8, 9],
    ],
    rivers: [{axis: 'z', pos: 38, width: 3.6}], // Yom River (compressed) by the new town
    bridges: [{at: 0, year: 1960, modernYear: 1960}],
    trains: [],
    city: {hx: HX, hz: HZ, moat: [1250.5, 1252.5], wall: [1252, 1257], gates: [1255, 1259], groundFrom: 1251},
    gates: [
      {x: HX, z: 0, rot: 0, width: 2.2},
      {x: -HX, z: 0, rot: 0, width: 2.2},
      {x: 0, z: HZ, rot: Math.PI / 2, width: 2.2},
      {x: 0, z: -HZ, rot: Math.PI / 2, width: 2.2},
    ],
    houses: {
      built: [1250, 150],
      abandon: {prob: 0.95, from: 1440, spread: 120, rebuild: 9999, rebuildSpread: 0},
      modern: [9999, 0],
      keepOut: [
        [MAHATHAT[0], MAHATHAT[1] + 2, 4.6],
        [SA_SI[0], SA_SI[1], 3.2],
        [PALACE[0], PALACE[1], 1.8],
        [SI_SAWAI[0], SI_SAWAI[1], 2.6],
        [-2, 3.5, 3.4],
        [6, 4, 2.6],
        [0, 7, 2],
      ],
    },
    villages: {
      centers: [
        [-24, 26],
        [24, -24],
        [-30, -22],
        [10, 32],
        [-14, 34],
      ],
      built: [1250, 150],
    },
    forestCity: 1250.5,
    regrowCity: [1480, 1965],
    clearings: [
      [PHRA_PHAI_LUANG[0], PHRA_PHAI_LUANG[1], 6, 1150],
      [SI_CHUM[0], SI_CHUM[1], 3.5, 1380],
      [KILNS[0], KILNS[1] + 1, 5.5, 1335],
      [0, 0, 21, 1344],
    ],
    paddies: [1150, 1450],
    urban: {from: 1950, rate: 1.2},
    urbanBox: {x0: 28, x1: 46, z0: -24, z1: 24}, // new Sukhothai town by the Yom; the old city stays a park
    towers: [{x0: 30, x1: 46, z0: -20, z1: 20, extra: 2}],
    roads: [{from: [12, 0], to: [46, 0], width: 1.6, year: 1955}],
    ringRoadYear: 9999,
    cars: [9999, 9999],
    boats: [1250, 1960],
    finale: 'loykrathong',
    krathongPonds: [[SA_SI[0], SA_SI[1], 2.2]],
    life: {
      people: [
        {x: 4.5, z: 3, r: 3.2, count: 40, from: 1254, to: 1460, colors: OLD},
        {x: -4, z: 5.5, r: 2.6, count: 8, from: 1260, to: 1460, monks: true},
        {x: KILNS[0], z: KILNS[1] + 1.5, r: 3.4, count: 26, from: 1342, to: 1490, colors: OLD},
        {x: -2, z: 3, r: 6, count: 44, from: 1995, to: 2100, colors: TOURISTS},
        {x: 2.5, z: -6, r: 3, count: 7, from: 1995, to: 2100, monks: true},
        {x: 0, z: -11.6, r: 6, count: 30, from: 2020, to: 2100, colors: TOURISTS},
      ],
      stalls: [
        {x: 4.5, z: 3, r: 2.8, count: 14, from: 1254, to: 1460},
        {x: 7.5, z: 6, r: 2.2, count: 10, from: 1995, to: 2100},
      ],
      elephants: [{x: 6, z: 5, r: 1.8, count: 2, from: 1254, to: 1460, howdah: true}],
      buffalo: [
        {x: -22, z: 22, r: 4, count: 6, from: 1200, to: 1950},
        {x: KILNS[0] - 1, z: KILNS[1] + 4.2, r: 1.8, count: 3, from: 1342, to: 1490},
      ],
    },
    cameraKeys: [
      [0, -2, 0, 2, 440, 38, 30, 30],
      [3, -2, 0, 2, 360, 40, 30, 30],
      [5.5, 0, 1, -14, 60, 40, 30, 30],
      [8, 0, 1, -12, 55, 50, 30, 30],
      [10.5, 0, 0, 0, 95, 46, 38, 30],
      [13, 3, 0, 3, 40, 50, 28, 30],
      [14.6, 4.5, 0, 3, 22, 60, 18, 30],
      [16.5, 3.5, 0, 0, 30, 70, 24, 30],
      [19, 3.6, 1, -4.4, 24, 40, 26, 30],
      [22, 3.6, 1, -4.4, 26, 55, 26, 30],
      [24, 0, 2, 0, 40, 40, 30, 30],
      [27.5, 0, 2, 1, 34, 60, 28, 30],
      [30, 0, 0, 0, 125, 40, 36, 30],
      [32, 10, 0, 14, 60, 40, 30, 30],
      [34, 18, 0, 20, 26, 40, 22, 30],
      [36.5, 18, 0, 20, 22, 60, 20, 30],
      [38, -9, 2, -14, 38, 30, 30, 30],
      [41, -9, 3, -14, 30, 50, 32, 30],
      [43, 0, 0, 0, 110, 40, 36, 30],
      [46.5, 0, 0, 0, 100, 30, 34, 30],
      [49, -4, 1, -2, 60, 40, 30, 30],
      [51, 0, 0, 0, 90, 45, 34, 30],
      [55, 0, 0, 0, 110, 40, 34, 30],
      [58, 0, 1, 0, 140, 45, 32, 30],
      [59.6, -2, 0, 3, 42, 30, 28, 30],
      [63, 0, 0, 2, 36, 55, 26, 30],
      [65, 0, 1, 0, 70, 40, 30, 30],
      [68, -3, 1, -2, 50, 30, 26, 30],
      [70.5, 0, 2, 0, 110, 45, 30, 30],
      [75, -2, 4, 2, 220, 50, 27, 30],
    ],
  },
  Landmarks: SukhothaiLandmarks,
  callouts: [
    {t0: 4, t1: 7.8, label: 'วัดพระพายหลวง', dx: 60, dy: -140, p: [PHRA_PHAI_LUANG[0], 4, PHRA_PHAI_LUANG[1]]},
    {t0: 4.6, t1: 7.8, label: 'เขาหลวง', dx: 40, dy: -110, p: [-47, 15, -12]},
    {t0: 18, t1: 21.8, label: 'ศิลาจารึกหลักที่ 1', dx: -80, dy: -150, p: [PALACE[0] + 0.9, 1.2, PALACE[1] + 0.4]},
    {t0: 24, t1: 27.4, label: 'วัดมหาธาตุ', dx: 90, dy: -150, p: [MAHATHAT[0], 7, MAHATHAT[1]]},
    {t0: 25, t1: 27.4, label: 'วัดสระศรี', dx: -60, dy: -130, p: [SA_SI[0], 2.5, SA_SI[1]]},
    {t0: 34.4, t1: 37, label: 'เตาสังคโลก', dx: -70, dy: -140, p: [KILNS[0], 1, KILNS[1]]},
    {t0: 38.2, t1: 41, label: 'พระอจนะ วัดศรีชุม', dx: 60, dy: -150, p: [SI_CHUM[0], 3.6, SI_CHUM[1]]},
    {t0: 49, t1: 50.8, label: 'วัดศรีสวาย', dx: 60, dy: 130, p: [SI_SAWAI[0], 2.4, SI_SAWAI[1]]},
  ],
  soundtrack: 'soundtrack_sukhothai.wav',
  sky: {
    top: [
      [1100, '#6aa8d6'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1100, '#f2e2c0'],
      [1438, '#ffe0b0'],
      [1480, '#e2e6d4'],
      [2026, '#d3e8f7'],
    ],
    ground: GROUND,
  },
  gloom: (Y) => ramp(Y, 1438, 1450) * (1 - ramp(Y, 1900, 1965)) * 0.35,
};
