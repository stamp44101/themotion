import {bump, ramp} from '../../lib';
import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {AyutthayaLandmarks, BATTLE, BUDDHA_HEAD, CHAIWAT, JAPANESE, MAHATHAT, PALACE, PORTUGUESE, SANPHET} from './Landmarks';
import {CAPTIONS, DURATION, ERAS, yearAt} from './timeline';

const TOURISTS = ['#e8505b', '#f9d56e', '#14b1ab', '#f3ecc2', '#ff9a3c', '#6a8caf', '#ffffff'];
const FOREIGNERS = ['#2b2f3a', '#7a2a2a', '#e9e2d0', '#3f5f8f', '#5a3a2a', '#d9a43a'];

export const AYUTTHAYA: CityConfig = {
  id: 'ayutthaya',
  story: {
    captions: CAPTIONS,
    eras: ERAS,
    yearAt,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'อยุธยา', sub: '417 ปี แห่งราชธานี'},
    finale: {kicker: 'พ.ศ. 1893 – 2310', title: 'อยุธยา', sub: '417 ปี ราชธานีที่ไม่มีวันลืม'},
    approxBefore: 1340,
    duration: DURATION,
  },
  layout: {
    tile: {x0: -50, x1: 46, z0: -46, z1: 50},
    peaks: [],
    // The island: Lopburi River (north), Chao Phraya (west, then south), Pa Sak (east).
    rivers: [
      {axis: 'x', pos: 12.5, width: 4.2, span: [-19, 46]}, // Chao Phraya south of the island (boats)
      {axis: 'x', pos: -12.5, width: 3.4}, // Lopburi
      {axis: 'z', pos: -19, width: 4.2, span: [-12.5, 50]}, // Chao Phraya west
      {axis: 'z', pos: 19, width: 3.4, span: [-46, 12.5]}, // Pa Sak
    ],
    noMoat: true,
    bridges: [
      {at: 0, year: 1960, modernYear: 1960, river: 3},
      {at: -4, year: 1965, modernYear: 1965, river: 2},
      {at: 8, year: 1985, modernYear: 1985, river: 0},
    ],
    rail: {axis: 'z', pos: 27, open: [1896, 1897.5], station: [29.5, 2], stationYear: 1897},
    trains: [{t0: 66.2, dur: 3, dir: 1, modern: true}],
    city: {hx: 15, hz: 9, moat: [1349.5, 1350.5], wall: [1352, 1360], gates: [1355, 1362], decay: [1767, 1768, 9999, 9999], groundFrom: 1350},
    gates: [
      {x: 0, z: 9, rot: Math.PI / 2, width: 2.2, pavilion: true},
      {x: -15, z: 0, rot: 0, width: 2.2, pavilion: true},
      {x: 15, z: 0, rot: 0, width: 2.2, pavilion: true},
      {x: 0, z: -9, rot: Math.PI / 2, width: 2.2, pavilion: true},
    ],
    houses: {
      built: [1351, 160],
      abandon: {prob: 0.97, from: 1767.0, spread: 0.6, rebuild: 1860, rebuildSpread: 140},
      modern: [1940, 80],
      keepOut: [
        [SANPHET[0], SANPHET[1], 4.4],
        [PALACE[0] + 1.6, PALACE[1], 3.4],
        [MAHATHAT[0], MAHATHAT[1], 4.4],
        [5, -4.5, 2.4],
        [BUDDHA_HEAD[0], BUDDHA_HEAD[2], 1.6],
        [-9, -1, 3.4],
        [-4, 4, 3],
      ],
    },
    villages: {
      centers: [
        [-32, 22],
        [32, 26],
        [32, -22],
        [-36, -2],
        [8, 32],
        [-4, -30],
      ],
      built: [1300, 200],
    },
    forestCity: 1349.5,
    regrowCity: [1768, 1955],
    clearings: [
      [CHAIWAT[0], CHAIWAT[1], 7, 1628],
      [PORTUGUESE[0], PORTUGUESE[1], 3.5, 1540],
      [JAPANESE[0], JAPANESE[1], 3.5, 1540],
      [10, 18.5, 3, 1540],
      [0, 18, 6, 1590],
      [BATTLE[0], BATTLE[1], 10, 1585],
    ],
    paddies: [1200, 1700],
    urban: {from: 1940, rate: 2.6},
    towers: [{x0: 21, x1: 44, z0: -20, z1: 20, extra: 2}],
    roads: [
      {from: [21, 0], to: [46, 0], width: 1.6, year: 1960},
      {from: [-21, -4], to: [-50, -4], width: 1.6, year: 1965},
    ],
    ringRoadYear: 9999,
    cars: [9999, 9999],
    boats: [1300, 1960],
    finale: 'fireworks',
    life: {
      people: [
        {x: 8, z: 10.2, r: 2.4, count: 26, from: 1352, to: 1767},
        {x: -2, z: 5.5, r: 3, count: 9, from: 1356, to: 1767, monks: true},
        {x: 0, z: 18.5, r: 5.5, count: 60, from: 1590, to: 1767, colors: FOREIGNERS},
        {x: -9, z: -1, r: 5, count: 46, from: 1995, to: 2100, colors: TOURISTS},
        {x: -2, z: 6, r: 3, count: 7, from: 1995, to: 2100, monks: true},
        {x: 9, z: 3, r: 3, count: 26, from: 1990, to: 2100, colors: TOURISTS},
      ],
      stalls: [
        {x: 0, z: 17.6, r: 4, count: 16, from: 1600, to: 1767},
        {x: 9, z: 3, r: 2.8, count: 12, from: 1990, to: 2100},
      ],
      ships: [{river: 0, count: 8, from: 1550, to: 1767}],
      houseboats: [
        {river: 0, count: 14, from: 1360, to: 1955},
        {river: 3, count: 6, from: 1380, to: 1955},
      ],
      elephants: [
        {x: -6, z: 17.5, r: 2.4, count: 2, from: 1600, to: 1767},
        {x: -3, z: 2.5, r: 2.6, count: 3, from: 1995, to: 2100, howdah: true},
      ],
      buffalo: [{x: 26, z: 28, r: 4, count: 6, from: 1300, to: 1950}],
    },
    cameraKeys: [
      [0, -2, 0, 2, 440, 38, 30, 30],
      [3, -2, 0, 2, 360, 40, 30, 30],
      [6.5, 0, 0, 0, 150, 42, 34, 30],
      [10, 0, 0, 0, 95, 48, 38, 30],
      [11.5, 6, 0, 11, 40, 150, 24, 30],
      [13.5, 8, 0, 11.5, 28, 165, 24, 30],
      [15, 2, 0, 6, 70, 30, 30, 30],
      [17, -8, 1, -4, 40, 40, 28, 30],
      [20.5, -8, 2, -4, 34, 55, 26, 30],
      [22.5, 0, 0, 0, 100, 40, 36, 30],
      [24.2, 0, 0, 0, 110, 30, 36, 30],
      [28.4, -24, 0, -20, 70, 30, 30, 30],
      [31, -30, 1, -26, 34, 50, 22, 30],
      [33.4, -26, 1, -26, 40, 70, 24, 30],
      [35, -26, 2, 6, 50, 60, 26, 30],
      [38, -26, 2, 6, 40, 30, 24, 30],
      [39.5, 0, 0, 17, 42, 160, 24, 30],
      [42, 2, 0, 18, 26, 172, 16, 30],
      [43.2, 0, 0, 8, 90, 30, 32, 30],
      [47.2, 0, 0, 0, 100, 40, 36, 30],
      [50, 0, 1, 0, 70, 40, 34, 30],
      [53.4, 0, 0, 0, 80, 50, 34, 30],
      [55, 5.6, 0.8, 3, 18, 40, 18, 30],
      [57.2, 0, 0, 0, 90, 40, 34, 30],
      [61.2, -6, 0, 0, 80, 30, 32, 30],
      [62.5, -8, 0, 0, 34, 30, 24, 30],
      [65, -6, 0, 2, 30, 50, 22, 30],
      [67, -6, 2, -2, 70, 40, 30, 30],
      [70.5, -2, 3, 0, 120, 45, 30, 30],
      [75, -2, 4, 2, 220, 50, 27, 30],
    ],
  },
  Landmarks: AyutthayaLandmarks,
  callouts: [
    {t0: 3.5, t1: 6.4, label: 'แม่น้ำเจ้าพระยา', dx: 60, dy: 120, p: [-19, 0, 30]},
    {t0: 3.8, t1: 6.4, label: 'แม่น้ำลพบุรี', dx: -40, dy: -120, p: [10, 0, -12.5]},
    {t0: 4.1, t1: 6.4, label: 'แม่น้ำป่าสัก', dx: 40, dy: -120, p: [19, 0, -26]},
    {t0: 9, t1: 11.4, label: 'พระราชวังหลวง', dx: -60, dy: -120, p: [PALACE[0], 1.5, PALACE[1]]},
    {t0: 17, t1: 20.4, label: 'วัดพระศรีสรรเพชญ์', dx: 80, dy: -140, p: [SANPHET[0], 5, SANPHET[1]]},
    {t0: 21, t1: 24, label: 'วัดมหาธาตุ', dx: 80, dy: -130, p: [MAHATHAT[0], 6.5, MAHATHAT[1]]},
    {t0: 35.2, t1: 38, label: 'วัดไชยวัฒนาราม', dx: 60, dy: -140, p: [CHAIWAT[0], 9, CHAIWAT[1]]},
    {t0: 39.6, t1: 43, label: 'หมู่บ้านโปรตุเกส', dx: -60, dy: 130, p: [PORTUGUESE[0], 3, PORTUGUESE[1]]},
    {t0: 40.2, t1: 43, label: 'หมู่บ้านญี่ปุ่น', dx: 60, dy: 150, p: [JAPANESE[0], 1.4, JAPANESE[1]]},
    {t0: 55.2, t1: 57.2, label: 'เศียรพระในรากไม้ วัดมหาธาตุ', dx: -60, dy: -170, p: BUDDHA_HEAD},
  ],
  soundtrack: 'soundtrack_ayutthaya.wav',
  sky: {
    top: [
      [1300, '#6aa8d6'],
      [1766, '#6aa8d6'],
      [1767.4, '#4a3a3e'],
      [1769, '#7a8590'],
      [1960, '#6aa8d6'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1300, '#e8eedd'],
      [1766, '#ffe0b0'],
      [1767.4, '#c0603a'],
      [1769, '#c4baa8'],
      [1960, '#e6eddd'],
      [2026, '#d3e8f7'],
    ],
    ground: GROUND,
  },
  gloom: (Y) => Math.max(bump(Y, 1568.8, 1570.4, 0.3) * 0.7, ramp(Y, 1767, 1767.6) * (1 - ramp(Y, 1860, 1960)) * 0.75),
};
