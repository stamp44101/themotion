import {ramp} from '../../lib';
import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {
  BAN_MAI,
  CITY_PILLAR,
  ChachoengsaoLandmarks,
  FORTRESS,
  HX,
  HZ,
  RAIL_BRIDGE,
  WAT_SOTHON,
} from './Landmarks';
import {CAPTIONS, DURATION, ERAS, yearAt} from './timeline';

const OLD = ['#e9e2d0', '#3f5f8f', '#a8322a', '#2f6a4a', '#d9a43a', '#7a5a3a'];
const TODAY = ['#e8505b', '#f9d56e', '#14b1ab', '#f3ecc2', '#ff9a3c', '#6a8caf', '#ffffff'];

const BANG_PAKONG_X = -4.8;
const KHLONG_THA_KHAI_Z = -5.0;

export const CHACHOENGSAO: CityConfig = {
  id: 'chachoengsao',
  story: {
    captions: CAPTIONS,
    eras: ERAS,
    yearAt,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ฉะเชิงเทรา', sub: 'เมืองแปดริ้ว ลุ่มน้ำบางปะกง'},
    finale: {kicker: 'พ.ศ. 2091 – 2569', title: 'ฉะเชิงเทรา', sub: 'สายน้ำบางปะกง บารมีหลวงพ่อโสธร'},
    approxBefore: 1770,
    duration: DURATION,
  },
  layout: {
    tile: {x0: -48, x1: 48, z0: -46, z1: 50},
    // Chachoengsao sits on the flat lower alluvial plain of the Bang Pakong delta -- no hills
    peaks: [],
    rivers: [
      {axis: 'z', pos: BANG_PAKONG_X, width: 2.8}, // Bang Pakong River (~220 m wide)
      {axis: 'x', pos: KHLONG_THA_KHAI_Z, width: 0.6, span: [BANG_PAKONG_X + 1.4, 48]}, // Khlong Tha Khai stops at east river bank
    ],
    urbanBox: {x0: 2, x1: 24, z0: -12, z1: 6}, // Modern high-rises stay in commercial core east of river, clear of Wat Sothon
    bridges: [
      {at: 0, year: 1960, modernYear: 1960}, // Maruphong modern bridge across Bang Pakong
    ],
    noMoat: true,
    rail: {
      axis: 'x',
      pos: RAIL_BRIDGE[1],
      open: [1907, 1909],
      station: [2.0, RAIL_BRIDGE[1]],
      stationYear: 1908,
    },
    trains: [
      {t0: 44.0, dur: 4.8, dir: 1, modern: false},
      {t0: 54.0, dur: 4.2, dir: -1, modern: true},
    ],
    city: {
      hx: HX,
      hz: HZ,
      /* Rectangular brick fortress constructed in 1834 (Rama III) on the east bank of Bang Pakong */
      outline: [
        [-HX, -HZ],
        [ HX, -HZ],
        [ HX,  HZ],
        [-HX,  HZ],
      ],
      moat: [1833, 1835],
      wall: [1834, 1836],
      gates: [1834, 1836],
      decay: [1910, 1940, 1970, 2000],
      groundFrom: 1548,
    },
    gates: [
      {x: HX, z: 0, rot: 0, width: 2.0},
      {x: -HX, z: 0, rot: 0, width: 2.0},
      {x: 0, z: HZ, rot: Math.PI / 2, width: 2.0},
      {x: 0, z: -HZ, rot: Math.PI / 2, width: 2.0},
    ],
    houses: {
      built: [1548, 280],
      abandon: {prob: 0.3, from: 1848, spread: 2, rebuild: 1850, rebuildSpread: 10},
      modern: [1960, 40],
      keepOut: [
        [WAT_SOTHON[0], WAT_SOTHON[1], 4.5],
        [FORTRESS[0], FORTRESS[1], 2.2],
        [CITY_PILLAR[0], CITY_PILLAR[1], 2.0],
        [BAN_MAI[0], BAN_MAI[1], 3.0],
        [BANG_PAKONG_X, 0, 2.5],
      ],
    },
    villages: {
      centers: [
        [16, 20],
        [-20, 24],
        [22, -20],
        [-18, -25],
        [28, 6],
      ],
      built: [1548, 250],
    },
    forestCity: 1548,
    clearings: [
      [WAT_SOTHON[0], WAT_SOTHON[1], 7.5, 1548],
      [FORTRESS[0], FORTRESS[1], 7.0, 1830],
      [CITY_PILLAR[0], CITY_PILLAR[1], 4.5, 1830],
      [BAN_MAI[0], BAN_MAI[1], 5.5, 1870],
    ],
    paddies: [1548, 1960],
    urban: {from: 1960, rate: 1.1},
    towers: [{x0: 6, x1: 22, z0: -6, z1: 8, extra: 2}],
    roads: [
      {from: [BANG_PAKONG_X + 1.8, -24], to: [BANG_PAKONG_X + 1.8, 24], width: 1.6, year: 1930}, // Thanon Maruphong along river
      {from: [0, 0], to: [40, 0], width: 1.6, year: 1955},
    ],
    ringRoadYear: 1980,
    cars: [1960, 2026],
    boats: [1548, 2026],
    finale: 'fireworks',
    life: {
      people: [
        // Devotees at Wat Sothon
        {x: WAT_SOTHON[0] + 1.5, z: WAT_SOTHON[1] + 1.5, r: 2.5, count: 24, from: 1770, to: 1970, colors: OLD},
        {x: WAT_SOTHON[0] + 1.5, z: WAT_SOTHON[1] - 1.0, r: 2.0, count: 6, from: 1770, to: 2100, monks: true},
        {x: WAT_SOTHON[0] + 2.0, z: WAT_SOTHON[1] + 2.0, r: 3.5, count: 40, from: 1970, to: 2100, colors: TODAY},
        // Fortress garrison
        {x: 0, z: 0, r: 1.8, count: 18, from: 1834, to: 1900, colors: OLD},
        // Talat Ban Mai riverside merchants (safely on dry bank)
        {x: BAN_MAI[0] + 1.4, z: BAN_MAI[1], r: 1.8, count: 28, from: 1880, to: 2100, colors: OLD},
      ],
      stalls: [
        {x: BAN_MAI[0] + 1.4, z: BAN_MAI[1], r: 1.6, count: 14, from: 1880, to: 2100},
        {x: WAT_SOTHON[0] + 2.2, z: WAT_SOTHON[1] + 2.5, r: 2.5, count: 12, from: 1970, to: 2100},
      ],
      ships: [{river: 0, count: 8, from: 1548, to: 1960}],
      houseboats: [{river: 0, count: 4, from: 1800, to: 2026}],
      buffalo: [
        [18, 16],
        [-16, 20],
        [20, -18],
      ].map(([bx, bz]) => ({x: bx, z: bz, r: 3.5, count: 5, from: 1548, to: 1965})),
    },
    plane: [1995, 2026],
    cameraKeys: [
      // [t, targetX, targetY, targetZ, distance, azimuth°, elevation°, fov°]
      // 0–7s: Ancient Paet Riu & Bang Pakong wide panorama
      [0, 0, 1, 0, 380, 42, 34, 30],
      [3, 0, 1, 0, 320, 45, 33, 30],
      [7, BANG_PAKONG_X, 0, 0, 240, 50, 32, 30],

      // 8–13s: Taksin's battle at Pak Nam Jolo / Eastern route
      [10, BANG_PAKONG_X, 0, -8, 140, 55, 30, 30],
      [12.5, BANG_PAKONG_X, 0, -4, 90, 60, 28, 30],

      // 13–19s: Luang Pho Sothon enshrinement at Wat Sothon
      [14, WAT_SOTHON[0], 1, WAT_SOTHON[1], 55, 75, 26, 30],
      [16, WAT_SOTHON[0] + 0.4, 1.2, WAT_SOTHON[1], 26, 65, 22, 28], // Close dive on golden Luang Pho Sothon and viharn
      [18.5, WAT_SOTHON[0], 2, WAT_SOTHON[1], 48, 70, 26, 30],

      // 19–27s: Rama III Citadel Fortress & Bastions built (1834)
      [20, FORTRESS[0], 1, FORTRESS[1], 95, 45, 32, 30],
      [23, FORTRESS[0] - 0.8, 1.2, FORTRESS[1], 42, 55, 24, 28], // Bastion & cannons facing river
      [26, FORTRESS[0], 1.5, FORTRESS[1], 80, 50, 30, 30],

      // 27–35s: Ang-Yi 1848 rebellion at the northern fort wall
      [28, FORTRESS[0], 1, -HZ - 1.0, 55, 35, 26, 28],
      [31, FORTRESS[0], 1, -HZ - 1.0, 32, 40, 22, 28], // Smoke and clash
      [34, FORTRESS[0], 1.5, 0, 85, 60, 32, 30],

      // 35–42s: Monthon Prachinburi & City Pillar Shrine
      [36, CITY_PILLAR[0], 1, CITY_PILLAR[1], 50, 65, 26, 30],
      [39, CITY_PILLAR[0], 1.2, CITY_PILLAR[1], 26, 75, 22, 28],
      [41.5, 0, 1.5, 0, 110, 55, 34, 30],

      // 42–49s: Eastern Railway Bridge & Talat Ban Mai boom
      [43, BAN_MAI[0], 1, BAN_MAI[1], 55, 45, 26, 30],
      [45.5, RAIL_BRIDGE[0], 1.2, RAIL_BRIDGE[1], 45, 50, 24, 28], // Train crossing the river
      [48.5, BANG_PAKONG_X, 1, -8, 120, 65, 32, 30],

      // 49–55s: Modern Grand Marble Ubosot of Wat Sothon (1996+)
      [50, WAT_SOTHON[0], 3, WAT_SOTHON[1], 65, 80, 28, 30],
      [52.5, WAT_SOTHON[0], 3.5, WAT_SOTHON[1], 38, 95, 22, 28], // The tall marble spire
      [54.5, WAT_SOTHON[0], 2.5, WAT_SOTHON[1], 55, 75, 26, 30],

      // 55–60s: Pull-back to full modern Chachoengsao
      [56, 0, 2, 0, 180, 50, 34, 30],
      [60, 0, 3, 0, 350, 45, 32, 30],
    ],
  },
  Landmarks: ChachoengsaoLandmarks,
  callouts: [
    {t0: 3.5, t1: 6.8, label: 'แม่น้ำบางปะกง', dx: 80, dy: 130, p: [BANG_PAKONG_X, 0, -4]},
    {t0: 14.5, t1: 18.5, label: 'หลวงพ่อโสธร', dx: 80, dy: -130, p: [WAT_SOTHON[0], 1.5, WAT_SOTHON[1] + 1.8]},
    {t0: 21.0, t1: 25.5, label: 'ป้อมเมืองฉะเชิงเทรา', dx: -80, dy: -140, p: [-HX, 0.7, 0]},
    {t0: 28.5, t1: 33.5, label: 'ศึกปราบกบฏอั้งยี่', dx: 80, dy: -130, p: [0, 1.0, -HZ - 1.0]},
    {t0: 36.5, t1: 40.5, label: 'ศาลหลักเมือง', dx: 70, dy: -130, p: [CITY_PILLAR[0], 1.8, CITY_PILLAR[1]]},
    {t0: 43.5, t1: 47.5, label: 'ตลาดบ้านใหม่', dx: -70, dy: -130, p: [BAN_MAI[0], 1.2, BAN_MAI[1]]},
    {t0: 45.0, t1: 48.5, label: 'สะพานรถไฟบางปะกง', dx: 80, dy: -120, p: [RAIL_BRIDGE[0], 1.5, RAIL_BRIDGE[1]]},
    {t0: 50.5, t1: 54.5, label: 'พระอุโบสถวัดโสธรฯ', dx: -80, dy: -140, p: [WAT_SOTHON[0], 5.5, WAT_SOTHON[1]]},
  ],
  soundtrack: 'soundtrack_chachoengsao.wav',
  sky: {
    top: [
      [1548, '#6aa8d6'],
      [1848, '#5a7894'],
      [1897, '#6aa8d6'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1548, '#f5e6cf'],
      [1834, '#ffe6bc'],
      [1848, '#c89a7e'],
      [1908, '#dfe7dc'],
      [2026, '#d3e8f7'],
    ],
    ground: GROUND,
  },
  // Gloom punch during the 1848 Ang-Yi clash
  gloom: (Y) => ramp(Y, 1847.8, 1848.2) * (1 - ramp(Y, 1848.8, 1849.3)) * 0.45,
  rain: [],
};
