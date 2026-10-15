import {ramp} from '../../lib';
import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {BAN_PRASAT, KoratLandmarks, MONUMENT, PHIMAI, RUNWAY, SEMA, THUNG_SAMRIT} from './Landmarks';
import {CAPTIONS, ERAS, SOUND_EVENTS, yearAt} from './timeline';

export const KORAT: CityConfig = {
  id: 'korat',
  story: {
    captions: CAPTIONS,
    eras: ERAS,
    yearAt,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'นครราชสีมา', sub: 'จากแผ่นดินไดโนเสาร์ สู่ประตูอีสาน'},
    finale: {kicker: 'เมืองย่าโม', title: 'นครราชสีมา', sub: 'ดินแดน 3 มงกุฎยูเนสโก · เขาใหญ่ · สะแกราช · อุทยานธรณีโคราช'},
    approxBefore: 1650,
  },
  layout: {
    tile: {x0: -50, x1: 46, z0: -50, z1: 46},
    // Dong Phaya Yen – Khao Yai hills: SW of Korat only (Khao Yai bears ~233 deg),
    // pulled in to the tile's south-west corner as a backdrop
    peaks: [
      [-48, 30, 10, 9],
      [-44, 44, 14, 10],
      [-30, 47, 9, 8],
    ],
    rivers: [{axis: 'x', pos: -13, width: 3.4}], // Lam Takhong, just north of the walls
    bridges: [
      {at: 0, year: 1900, modernYear: 1960},
      {at: -26, year: 1958, modernYear: 1958},
    ],
    // the station is ~2 km west of the monument; the line runs east-west south of the old town
    rail: {axis: 'x', pos: 11.6, open: [1897.6, 1899.2], station: [-29, 9], stationYear: 1898},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {hx: 11, hz: 6.5, moat: [1656.6, 1659.2], wall: [1659, 1663], gates: [1662, 1665], groundFrom: 1656.8},
    gates: [
      {x: -11, z: 0, rot: 0, width: 2.8, pavilion: true}, // Chumphon (west)
      {x: 11, z: 0, rot: 0, width: 2.2, pavilion: true}, // Phon Lan (east)
      {x: 0, z: -6.5, rot: Math.PI / 2, width: 2.2, pavilion: true}, // Phon Lae (north)
      {x: 0, z: 6.5, rot: Math.PI / 2, width: 2.2, pavilion: true}, // Chai Narong (south)
    ],
    houses: {
      built: [1658, 120],
      abandon: {prob: 0.55, from: 1826.0, spread: 0.6, rebuild: 1827.4, rebuildSpread: 25},
      modern: [1930, 80],
      keepOut: [
        [-3, 2.6, 2],
        [5.4, -3.6, 2],
        [1.6, -1.6, 0.8],
      ],
    },
    villages: {
      centers: [
        [-38, 16],
        [10, 22],
        [-28, -2],
        [28, 8],
        [6, 32],
        [34, -8],
      ],
      built: [700, 900],
    },
    forestCity: 1656.5,
    clearings: [
      [-44.1, 5.7, 5, 600], // Sema
      [34, -31.6, 6.5, 1050], // Phimai
      [20.1, -36, 5.5, -1300], // Ban Prasat
      [20.6, -29.6, 6, -2000], // Thung Samrit: an open field (thung), where the 1826 battle is seen
      [-29, 9, 4, 1899], // station
      [-14.6, 0, 3.6, 1933], // monument
      [-22, 31, 14, 1954], // Wing 1
    ],
    paddies: [500, 1400],
    // Wing 1 airfield: the runway (26 x 2.4 at RUNWAY) and its apron stay open
    openGround: [{x0: RUNWAY[0] - 14, x1: RUNWAY[0] + 14, z0: RUNWAY[1] - 2.5, z1: RUNWAY[1] + 2.5}],
    urban: {from: 1915, rate: 2.0},
    highRise: 1985, // low-rise shophouses until the hotel and office towers of the late 1980s-90s
    towers: [
      {x0: -32, x1: -14, z0: -8, z1: 7, extra: 7},
      {x0: 14, x1: 32, z0: -8, z1: 10, extra: 4},
    ],
    roads: [
      {from: [-50, 40], to: [-15, 0], width: 2.2, year: 1958}, // Mittraphap from Saraburi
      {from: [-16, 0], to: [-28, -50], width: 2.2, year: 1958}, // Mittraphap to Khon Kaen
      {from: [14, 0], to: [46, 2], width: 1.2, year: 1930}, // road to Phimai
    ],
    ringRoadYear: 1950,
    cars: [1955, 2015],
    boats: [400, 1950],
    finale: 'fireworks',
    plane: SOUND_EVENTS.plane as [number, number],
    cameraKeys: [
      [0, -2, 0, -2, 430, 38, 30, 30],
      [3, -4, 2, -4, 150, 40, 30, 30],
      [7.4, -2, 2, -4, 110, 46, 30, 30],
      [8.6, 20, 0, -36, 80, 44, 32, 30],
      [11, 20, 0, -36, 70, 48, 34, 30],
      [11.6, -40, 2, 5, 96, 40, 28, 30],
      [14.2, -40, 2, 6, 88, 46, 28, 30],
      [14.9, 32, 3, -31, 100, 50, 28, 30],
      [17, 30, 3, -30, 92, 54, 28, 30],
      [18.6, 0, 0, 0, 84, 48, 36, 30],
      [22.6, 0, 0, 0, 66, 58, 40, 30],
      [24.4, -12, 2, 0, 38, -50, 26, 30],
      [27, -12, 2, 0, 34, -40, 26, 30],
      [28.6, 0, 0, -2, 82, -10, 38, 30],
      [30.6, 2, 1, -4, 72, 10, 36, 30],
      // hold on Thung Samrit, both armies in the field, for the whole callout
      [31.6, THUNG_SAMRIT[0], 0, THUNG_SAMRIT[1], 74, 22, 36, 30],
      [33.8, THUNG_SAMRIT[0], 0, THUNG_SAMRIT[1], 70, 36, 36, 30],
      [35.6, -22, 0, 4, 82, 30, 32, 30],
      [36.6, -27, 0, 8, 56, 25, 30, 30],
      [39.6, -27, 0, 8, 52, 35, 30, 30],
      [41.2, -14.6, 1.5, 0, 30, -60, 22, 30],
      [44, -14.6, 1.5, 0, 26, -45, 22, 30],
      [46, -24, 0, 10, 120, -20, 32, 30],
      [49, -6, 0, 6, 140, 20, 32, 30],
      [52, -16, 1, 18, 140, 34, 30, 30],
      [55, -8, 2, 8, 140, 48, 30, 30],
      [57, 0, 6, 0, 150, 52, 26, 30],
      [60, -2, 6, -2, 230, 54, 26, 30],
    ],
  },
  Landmarks: KoratLandmarks,
  callouts: [
    {t0: 4, t1: 7.8, label: 'ลำตะคอง', dx: 60, dy: 110, p: [5, 0, -13]},
    {t0: 8.8, t1: 11.0, label: 'แหล่งโบราณคดีบ้านปราสาท', dx: -120, dy: -140, p: [BAN_PRASAT[0], 0.5, BAN_PRASAT[1]]},
    {t0: 12.2, t1: 14.4, label: 'พระนอนเมืองเสมา', dx: 60, dy: -130, p: [SEMA[0], 1.5, SEMA[1]]},
    {t0: 15.0, t1: 17.2, label: 'ปราสาทหินพิมาย', dx: -60, dy: -130, p: [PHIMAI[0], 6, PHIMAI[1]]},
    {t0: 19, t1: 22.2, label: 'คูเมือง', dx: 80, dy: 120, p: [12.4, 0, 3]},
    {t0: 23.2, t1: 27, label: 'ประตูชุมพล', dx: 100, dy: -150, p: [-11, 3.6, 0]},
    {t0: 31.8, t1: 33.6, label: 'ทุ่งสัมฤทธิ์', dx: 60, dy: -120, p: [THUNG_SAMRIT[0], 0.5, THUNG_SAMRIT[1]]},
    {t0: 36.8, t1: 40, label: 'สถานีรถไฟนครราชสีมา', dx: 40, dy: -130, p: [-29, 1.6, 9]},
    {t0: 41.7, t1: 45, label: 'อนุสาวรีย์ท้าวสุรนารี', dx: 120, dy: -150, p: [MONUMENT[0], 2.6, MONUMENT[1]]},
    {t0: 46.2, t1: 49.6, label: 'ถนนมิตรภาพ', dx: 70, dy: 120, p: [-20, 0.4, 6]},
    {t0: 50.4, t1: 53.8, label: 'กองบิน 1', dx: 80, dy: 120, p: [RUNWAY[0] + 8, 0, RUNWAY[1]]},
  ],
  soundtrack: 'soundtrack_korat.wav',
  sky: {
    top: [
      [-2e8, '#5f9fcf'],
      [-1e6, '#5f9fcf'],
      [1600, '#6aa8d6'],
      [1826, '#6aa8d6'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [-2e8, '#f2d9a8'],
      [-1e6, '#f2d9a8'],
      [0, '#e2eed9'],
      [1826, '#e6eddd'],
      [2026, '#d3e8f7'],
    ],
    ground: [[-2e8, '#7a9a48'], [-1e6, '#7a9a48'], ...GROUND],
  },
  gloom: (Y) => ramp(Y, 1825.9, 1826.1) * (1 - ramp(Y, 1826.8, 1827.4)),
};
