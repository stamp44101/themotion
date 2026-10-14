import {ramp} from '../../lib';
import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {
  CHULAMANI_CHEDI,
  DECHATIWONG_BRIDGE,
  DRAGON_PARADE,
  NakhonSawanLandmarks,
  PASAN,
  SAN_KHU,
  TEAK_RAFTS,
  THEPHARAK_SHRINE,
  WAT_NAKHON_SAWAN,
} from './Landmarks';
import {CAPTIONS, DURATION, ERAS, yearAt} from './timeline';

const OLD = ['#e9e2d0', '#3f5f8f', '#a8322a', '#2f6a4a', '#d9a43a', '#7a5a3a'];
const TODAY = ['#e8505b', '#f9d56e', '#14b1ab', '#f3ecc2', '#ff9a3c', '#6a8caf', '#ffffff'];

const CHAO_PHRAYA_X = -2.0;

export const NAKHONSAWAN: CityConfig = {
  id: 'nakhonsawan',
  story: {
    captions: CAPTIONS,
    eras: ERAS,
    yearAt,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'นครสวรรค์', sub: 'ปากน้ำโพ ต้นกำเนิดแม่น้ำเจ้าพระยา'},
    finale: {kicker: 'พ.ศ. 1900 – 2569', title: 'นครสวรรค์', sub: 'สี่แควรวมสาย ปากน้ำโพสู่เจ้าพระยา'},
    approxBefore: 1357,
    duration: DURATION,
  },
  layout: {
    tile: {x0: -46, x1: 46, z0: -46, z1: 46},
    // Real limestone peaks rising directly west of downtown Pak Nam Pho
    peaks: [
      [-13.5, -4.5, 3.4, 6.5], // Khao Khiriwong summit (site of Phra Chulamani Chedi)
      [-15.0, -11.0, 2.5, 5.5], // Khao Kob northern ridge
      [-16.0, 6.0, 1.8, 4.5],  // Southern limestone foothill
    ],
    // The famous Pak Nam Pho confluence: Ping (north), Nan (east), merging into Chao Phraya (south)
    rivers: [
      // River 0 (carries boats): Main channel along Z at x = -2.0 (Ping river north, Chao Phraya south)
      {axis: 'z', pos: CHAO_PHRAYA_X, width: 3.5},
      // River 1: Nan River flowing from east (x: -0.25 to 46) into the confluence at z = 0.0
      {axis: 'x', pos: 0.0, width: 2.75, span: [-0.25, 46]},
    ],
    bridges: [
      // Dechatiwong Bridge crossing Chao Phraya (River 0) at z = 12.0
      {at: 12.0, year: 1950, modernYear: 1950, river: 0},
    ],
    noMoat: true,
    // Northern Railway line runs north-south along the eastern bank
    rail: {axis: 'z', pos: 18.0, open: [1903, 1905], station: [18.0, 8.0], stationYear: 1905},
    trains: [
      {t0: 38.6, dur: 4.8, dir: -1, modern: false}, // 1905 steam train arrival
      {t0: 53.5, dur: 3.4, dir: 1, modern: true},   // modern express train
    ],
    city: {
      hx: 3.5,
      hz: 5.5,
      // Ancient Phra Bang moated perimeter on west bank (safely on dry land west of river edge at x = -3.75)
      outline: [
        [-11.5, -6.5],
        [-4.5, -6.5],
        [-4.5, 4.5],
        [-11.5, 4.5],
      ],
      moat: [1357, 1365],
      wall: [1357, 1370],
      gates: [1360, 1375],
      decay: [1785, 1800, 1980, 1990],
      groundFrom: 1357,
    },
    gates: [
      {x: -4.5, z: -1.0, rot: Math.PI / 2, width: 2.0}, // Waterfront gate
      {x: -11.5, z: -1.0, rot: Math.PI / 2, width: 2.0}, // Mountain gate
      {x: -8.0, z: -6.5, rot: 0, width: 2.0}, // North gate
      {x: -8.0, z: 4.5, rot: 0, width: 2.0}, // South gate
    ],
    houses: {
      built: [1357, 160],
      modern: [1940, 75],
      keepOut: [
        [WAT_NAKHON_SAWAN[0], WAT_NAKHON_SAWAN[1], 2.8],
        [SAN_KHU[0], SAN_KHU[1], 2.8],
        [THEPHARAK_SHRINE[0], THEPHARAK_SHRINE[1], 2.4],
        [DRAGON_PARADE[0], DRAGON_PARADE[1], 2.6],
        [TEAK_RAFTS[0], TEAK_RAFTS[1], 2.5],
        [DECHATIWONG_BRIDGE[0], DECHATIWONG_BRIDGE[1], 3.2],
        [PASAN[0], PASAN[1], 2.5],
        [CHULAMANI_CHEDI[0], CHULAMANI_CHEDI[1], 3.5],
        [18.0, 8.0, 2.5], // Railway station
      ],
    },
    villages: {
      centers: [
        [-16.0, 18.0],
        [22.0, -18.0],
        [24.0, 22.0],
      ],
      built: [1357, 180],
    },
    forestCity: 0.15,
    paddies: [1357, 1970],
    urban: {from: 1950, rate: 1.1},
    urbanBox: {x0: -10.0, x1: 6.0, z0: -8.0, z1: 14.0},
    towers: [{x0: -5.0, x1: 2.0, z0: -4.0, z1: 6.0, extra: 2}], // Pak Nam Pho commercial hub
    roads: [
      {from: [-8.0, -28.0], to: [-8.0, 28.0], width: 1.4, year: 1925}, // Main north-south street
      {from: [-11.0, 12.0], to: [18.0, 12.0], width: 1.6, year: 1950}, // Phahonyothin Highway crossing Dechatiwong Bridge
      {from: [-4.6, 0.0], to: [-4.6, 14.0], width: 1.2, year: 1890},  // Waterfront road (Kosi Rd)
    ],
    ringRoadYear: 1985,
    cars: [1955, 2026],
    boats: [1357, 2026],
    finale: 'fireworks',
    life: {
      people: [
        {x: WAT_NAKHON_SAWAN[0] + 1.2, z: WAT_NAKHON_SAWAN[1], r: 2.2, count: 22, from: 1357, to: 1850, colors: OLD},
        {x: THEPHARAK_SHRINE[0] + 0.5, z: THEPHARAK_SHRINE[1], r: 2.0, count: 28, from: 1870, to: 2026, colors: OLD},
        {x: DRAGON_PARADE[0] + 0.8, z: DRAGON_PARADE[1], r: 2.5, count: 35, from: 1901, to: 2026, colors: TODAY},
        {x: PASAN[0], z: PASAN[1] + 1.0, r: 2.2, count: 24, from: 2019, to: 2026, colors: TODAY},
      ],
      stalls: [
        {x: -3.8, z: 2.0, r: 2.2, count: 16, from: 1870, to: 2026}, // Pak Nam Pho riverfront market
      ],
      ships: [{river: 0, count: 9, from: 1357, to: 1970}],
      houseboats: [{river: 0, count: 6, from: 1840, to: 2026}],
      buffalo: [
        [-18.0, -22.0],
        [24.0, -12.0],
      ].map(([bx, bz]) => ({x: bx, z: bz, r: 4.0, count: 5, from: 1357, to: 1965})),
    },
    plane: [1995, 2026],
    cameraKeys: [
      // [t, targetX, targetY, targetZ, distance, azimuth°, elevation°, fov°]
      // 0–3s: High establishing panorama
      [0, -2.0, 1.0, 0.0, 320, 25, 34, 30],
      [3.0, -2.0, 1.0, 0.0, 250, 40, 32, 30],

      // 3–8.5s: Descending orbit over confluence (Caption 1: 3.2–8.5s)
      [3.5, -2.0, 1.0, 0.0, 240, 42, 32, 30], // Caption 1 hold
      [5.5, -2.0, 1.0, 0.0, 180, 70, 30, 30],
      [8.5, -5.0, 1.0, -0.5, 115, 100, 28, 30],

      // 9–21.5s: Continuous low orbit/truck covering Wat & San Khu at constant dist ~48 (Caption 2: 9.5–15s, Caption 3: 16–22s)
      [9.5, -6.5, 1.0, -1.0, 48, 110, 25, 28], // Wat Nakhon Sawan - Caption 2 hold
      [11.0, -6.5, 1.0, -1.0, 48, 112, 25, 28], // Hold
      [13.5, -8.5, 1.0, -1.0, 48, 140, 25, 28], // Trucking across town
      [16.0, -11.0, 1.0, -1.0, 48, 170, 26, 28], // San Khu redoubt - Caption 3 hold
      [17.5, -11.0, 1.0, -1.0, 48, 172, 26, 28], // Hold
      [21.0, -10.0, 1.0, -0.5, 52, 195, 26, 28],

      // 22–29.5s: Wide Shot #1 (dist 120 >= 100) tracking teak rafts downstream (Caption 4: 23–29.5s)
      [22.5, -2.0, 0.5, -1.0, 120, 205, 30, 30],
      [23.5, -2.0, 0.5, -0.5, 120, 207, 30, 30], // Caption 4 hold
      [26.0, -2.0, 0.5, 2.5, 118, 225, 30, 30], // Track downstream
      [29.0, -2.0, 0.5, 5.0, 115, 245, 28, 30],

      // 30–37.5s: Dragon parade & shrine push-in then hold (Caption 5: 30.5–37s)
      [30.5, -4.8, 1.0, 1.0, 45, 252, 22, 28], // Arrive
      [31.5, -4.8, 1.0, 1.0, 36, 255, 20, 26], // Push-in
      [33.5, -4.8, 1.0, 1.0, 36, 260, 20, 26], // Hold
      [36.5, -4.8, 1.0, 1.0, 38, 265, 22, 26], // Hold

      // 38–44s: Track steam train along rail at x=18 (Caption 6: 38–43.5s)
      [38.0, 18.0, 1.0, 12.0, 58, 275, 25, 28], // Train north
      [39.2, 18.0, 1.0, 10.5, 58, 278, 25, 28], // Caption 6 hold
      [41.5, 18.0, 1.0, 6.0, 56, 300, 24, 28],  // Tracking with train
      [43.5, 18.0, 1.0, 2.0, 58, 320, 24, 28],

      // 44.5–50.5s: Wide Shot #2 (dist 130 >= 100) opposite side showing Bridge & City (Caption 7: 44.5–50s)
      [44.5, -2.0, 1.0, 6.0, 130, 220, 32, 30], // Opposite side wide shot
      [46.0, -2.0, 1.0, 6.0, 130, 222, 32, 30], // Caption 7 hold
      [48.0, -2.0, 1.0, 4.0, 128, 235, 32, 30],
      [50.5, -1.0, 1.0, 2.0, 125, 250, 30, 30],

      // 51–56s: Rising orbit over Pasan & Chulamani Chedi (Caption 8: 51–55.5s)
      [51.0, 0.8, 1.0, 2.2, 70, 265, 26, 28], // Pasan
      [52.0, 0.8, 1.0, 2.2, 70, 268, 26, 28], // Caption 8 hold
      [54.0, -6.0, 2.5, -1.0, 110, 310, 38, 30], // Rising orbit revealing hill
      [56.0, -9.0, 3.2, -3.0, 140, 350, 44, 30],

      // 56–60s: Grand Finale high aerial over confluence
      [57.5, -2.0, 2.0, 0.0, 210, 380, 48, 28],
      [60.0, -2.0, 2.5, 0.0, 260, 420, 50, 28],
    ],
  },
  Landmarks: NakhonSawanLandmarks,
  callouts: [
    {t0: 4.0, t1: 7.5, label: 'วัดนครสวรรค์ (วัดหัวเมือง)', dx: 80, dy: -130, p: [WAT_NAKHON_SAWAN[0], 2, WAT_NAKHON_SAWAN[1]]},
    {t0: 17.0, t1: 20.5, label: 'คูเมืองสันคู', dx: -70, dy: -120, p: [SAN_KHU[0], 1.5, SAN_KHU[1]]},
    {t0: 24.5, t1: 28.0, label: 'แพซุงปากน้ำโพ', dx: 80, dy: 110, p: [TEAK_RAFTS[0], 1, TEAK_RAFTS[1]]},
    {t0: 31.5, t1: 35.5, label: 'ศาลเจ้าพ่อเทพารักษ์', dx: 70, dy: -130, p: [THEPHARAK_SHRINE[0], 1.5, THEPHARAK_SHRINE[1]]},
    {t0: 39.0, t1: 42.5, label: 'สถานีรถไฟปากน้ำโพ', dx: 70, dy: -120, p: [18.0, 2, 8.0]},
    {t0: 45.5, t1: 49.0, label: 'สะพานเดชาติวงศ์', dx: -80, dy: -130, p: [DECHATIWONG_BRIDGE[0], 1.2, DECHATIWONG_BRIDGE[1]]},
    {t0: 51.5, t1: 54.5, label: 'อาคารพาสาน (เกาะยม)', dx: 75, dy: 120, p: [PASAN[0], 1.2, PASAN[1]]},
  ],
  soundtrack: 'soundtrack_nakhonsawan.wav',
  sky: {
    top: [
      [1000, '#6aa8d6'],
      [1785, '#5f87ab'],
      [1850, '#6aa8d6'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1000, '#f2e2c0'],
      [1569, '#ffe6bc'],
      [1785, '#c8a07e'],
      [1950, '#e8b48a'],
      [2026, '#d3e8f7'],
    ],
    ground: GROUND,
  },
  gloom: (Y) =>
    ramp(Y, 1785, 1788) * (1 - ramp(Y, 1792, 1805)) * 0.45,
  rain: [],
};
