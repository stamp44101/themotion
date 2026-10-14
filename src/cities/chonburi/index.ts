import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {
  ANG_SILA,
  BANG_PLA_SOI_PIER,
  BANG_SAEN,
  BUFFALO_RACE,
  ChonburiLandmarks,
  KHAO_SAM_MUK,
  SRI_PHALO,
  TAKSIN_FLEET,
  WAT_YAI,
} from './Landmarks';
import {CAPTIONS, DURATION, ERAS, yearAt} from './timeline';

const OLD = ['#eadfc7', '#355c7d', '#a33a2d', '#3f704d', '#d2a84a', '#74523a'];
const TODAY = ['#f25f5c', '#ffe066', '#247ba0', '#70c1b3', '#ffffff', '#ff9f1c'];

// The engine models water as a band. This wide band meets the eastern tile edge,
// so only its western boundary reads on camera: the Gulf of Thailand coastline.
const SEA_X = 29;

export const CHONBURI: CityConfig = {
  id: 'chonburi',
  story: {
    captions: CAPTIONS,
    eras: ERAS,
    yearAt,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ชลบุรี', sub: 'บางปลาสร้อย อ่างศิลา บางแสน'},
    finale: {kicker: 'จากเมืองประมง สู่นครชายฝั่ง', title: 'ชลบุรี', sub: 'ทะเล ผู้คน และเมืองที่เติบโตไปด้วยกัน'},
    approxBefore: 1400,
    duration: DURATION,
  },
  layout: {
    tile: {x0: -46, x1: 46, z0: -46, z1: 46},
    peaks: [
      // Three overlapping peaks form Khao Sam Muk's long wooded headland.
      // Heights are visually amplified at miniature-map scale so the ridge
      // and its sea-facing cliff remain legible in the vertical frame.
      [KHAO_SAM_MUK[0] - 0.8, KHAO_SAM_MUK[1] - 3.0, 1.45, 6.0],
      [KHAO_SAM_MUK[0], KHAO_SAM_MUK[1], 2.25, 6.4],
      [KHAO_SAM_MUK[0] + 0.4, KHAO_SAM_MUK[1] + 3.1, 1.75, 5.6],
      [-20, 15, 1.2, 11],
    ],
    forest: '#376b4a',
    rivers: [{axis: 'z', pos: SEA_X, width: 34}],
    bridges: [],
    noMoat: true,
    trains: [],
    city: {
      hx: 8,
      hz: 14,
      // Narrative footprint of the historic Bang Pla Soi settlement. Chonburi
      // had no documented city wall; wall/moat years below keep both invisible.
      outline: [
        [-8, -14],
        [8, -14],
        [8, 4],
        [-8, 4],
      ],
      moat: [9999, 9999],
      wall: [9999, 9999],
      gates: [9999, 9999],
      groundFrom: 1350,
    },
    gates: [],
    houses: {
      built: [1380, 260],
      modern: [1943, 75],
      keepOut: [
        [WAT_YAI[0], WAT_YAI[1], 4.2],
        [BANG_PLA_SOI_PIER[0], BANG_PLA_SOI_PIER[1], 3.0],
        [ANG_SILA[0], ANG_SILA[1], 4.5],
        [BUFFALO_RACE[0], BUFFALO_RACE[1], 6.0],
        [KHAO_SAM_MUK[0], KHAO_SAM_MUK[1], 4.0],
        [BANG_SAEN[0], BANG_SAEN[1], 5.0],
      ],
    },
    villages: {
      centers: [
        [-21, -28],
        [-23, 18],
        [-10, 31],
        [2, 29],
      ],
      built: [1150, 400],
    },
    forestCity: 1350,
    clearings: [
      [SRI_PHALO[0], SRI_PHALO[1], 6.5, 1050],
      [WAT_YAI[0], WAT_YAI[1], 7.0, 1380],
      [BANG_PLA_SOI_PIER[0], BANG_PLA_SOI_PIER[1], 5.5, 1780],
      [ANG_SILA[0], ANG_SILA[1], 6.0, 1850],
      [BUFFALO_RACE[0], BUFFALO_RACE[1], 7.0, 1865],
      [KHAO_SAM_MUK[0], KHAO_SAM_MUK[1], 4.5, 1850],
      [BANG_SAEN[0], BANG_SAEN[1], 7.5, 1940],
    ],
    paddies: [1200, 1965],
    urban: {from: 1943, rate: 0.2},
    urbanBox: {x0: -30, x1: 11, z0: -40, z1: 38},
    towers: [
      {x0: -9, x1: 7, z0: -18, z1: 4, extra: 4},
      {x0: -2, x1: 10, z0: 22, z1: 34, extra: 7},
    ],
    roads: [
      {from: [-30, -8], to: [10.5, -8], width: 1.4, year: 1936},
      {from: [6, -38], to: [6, 36], width: 1.5, year: 1943},
      {from: [-22, 2], to: [10, 2], width: 1.2, year: 1950},
    ],
    ringRoadYear: 1985,
    cars: [1943, 2026],
    boats: [1350, 2026],
    finale: 'fireworks',
    life: {
      people: [
        {x: WAT_YAI[0] + 1.8, z: WAT_YAI[1] + 1.5, r: 2.8, count: 24, from: 1400, to: 2026, colors: OLD},
        {x: WAT_YAI[0] - 1.2, z: WAT_YAI[1] + 1.2, r: 2.0, count: 5, from: 1400, to: 2026, monks: true},
        {x: BANG_PLA_SOI_PIER[0] - 2.8, z: BANG_PLA_SOI_PIER[1], r: 2.4, count: 22, from: 1800, to: 1975, colors: OLD},
        {x: ANG_SILA[0] - 1.0, z: ANG_SILA[1] + 2.0, r: 2.4, count: 18, from: 1855, to: 2026, colors: OLD},
        {x: BUFFALO_RACE[0], z: BUFFALO_RACE[1] - 3.4, r: 2.8, count: 20, from: 1870, to: 2026, colors: OLD},
        {x: BUFFALO_RACE[0], z: BUFFALO_RACE[1] + 3.4, r: 2.8, count: 20, from: 1870, to: 2026, colors: OLD},
        {x: BANG_SAEN[0] - 1.5, z: BANG_SAEN[1], r: 4.0, count: 45, from: 1943, to: 2026, colors: TODAY},
      ],
      stalls: [
        {x: BANG_PLA_SOI_PIER[0] - 3.0, z: BANG_PLA_SOI_PIER[1], r: 2.0, count: 14, from: 1800, to: 2026},
        {x: ANG_SILA[0] - 2.0, z: ANG_SILA[1] + 2.5, r: 2.4, count: 16, from: 1860, to: 2026},
        {x: BANG_SAEN[0] - 2.0, z: BANG_SAEN[1] - 1.0, r: 3.0, count: 18, from: 1943, to: 2026},
      ],
      ships: [{river: 0, count: 10, from: 1350, to: 2026, offset: -6}],
      buffalo: [
        {x: -20, z: -2, r: 5, count: 6, from: 1200, to: 1965},
        {x: -18, z: 18, r: 5, count: 5, from: 1300, to: 1965},
      ],
    },
    plane: [1970, 2026],
    cameraKeys: [
      [0, 3, 1, -4, 300, 25, 38, 30],
      [3.0, 3, 1, -4, 240, 45, 36, 30],
      [3.5, SRI_PHALO[0] + 1.5, 1, SRI_PHALO[1], 112, 55, 36, 30],
      [5.5, SRI_PHALO[0] + 1.5, 1, SRI_PHALO[1], 96, 82, 35, 30],
      [8.4, SRI_PHALO[0] + 1.5, 1, SRI_PHALO[1], 84, 110, 34, 29],
      [9.0, WAT_YAI[0], 1.2, WAT_YAI[1], 68, 122, 34, 29],
      [11.5, WAT_YAI[0], 1.2, WAT_YAI[1], 58, 145, 33, 28],
      [14.8, WAT_YAI[0], 1.2, WAT_YAI[1], 62, 170, 34, 29],
      [15.5, TAKSIN_FLEET[0], 0.5, TAKSIN_FLEET[1], 88, 182, 32, 29],
      [18.2, TAKSIN_FLEET[0], 0.5, TAKSIN_FLEET[1], 84, 210, 31, 29],
      [21.5, TAKSIN_FLEET[0], 0.5, TAKSIN_FLEET[1], 90, 238, 32, 29],
      [22.0, BANG_PLA_SOI_PIER[0], 1, BANG_PLA_SOI_PIER[1], 72, 245, 34, 28],
      [25.0, BANG_PLA_SOI_PIER[0], 1, BANG_PLA_SOI_PIER[1], 64, 270, 33, 28],
      [28.2, BANG_PLA_SOI_PIER[0], 1, BANG_PLA_SOI_PIER[1], 70, 295, 34, 28],
      [28.8, ANG_SILA[0], 1, ANG_SILA[1], 62, 305, 35, 28],
      [32.0, ANG_SILA[0], 1, ANG_SILA[1], 55, 330, 34, 28],
      [35.0, ANG_SILA[0], 1, ANG_SILA[1], 61, 355, 35, 28],
      [35.5, BUFFALO_RACE[0], 0.8, BUFFALO_RACE[1], 68, 365, 35, 29],
      [38.5, BUFFALO_RACE[0], 0.8, BUFFALO_RACE[1], 62, 392, 34, 28],
      [42.0, BUFFALO_RACE[0], 0.8, BUFFALO_RACE[1], 70, 420, 35, 29],
      [42.5, 7, 1.5, 20, 135, 430, 38, 30],
      [45.0, KHAO_SAM_MUK[0], 2.0, KHAO_SAM_MUK[1], 55, 455, 38, 29],
      [47.0, KHAO_SAM_MUK[0], 2.0, KHAO_SAM_MUK[1], 58, 475, 37, 29],
      [49.2, BANG_SAEN[0], 1.0, BANG_SAEN[1], 78, 495, 35, 29],
      [49.8, 1, 2.0, 0, 145, 495, 39, 30],
      [52.0, 1, 2.0, 0, 145, 525, 40, 30],
      [55.5, 2, 2.5, 2, 175, 555, 43, 30],
      [60.0, 2, 3.0, 2, 255, 595, 48, 29],
    ],
  },
  Landmarks: ChonburiLandmarks,
  callouts: [
    {t0: 4.0, t1: 7.8, label: 'เมืองท่าศรีพโล', dx: -70, dy: -125, p: [SRI_PHALO[0] + 2, 1.3, SRI_PHALO[1]]},
    {t0: 10.0, t1: 14.0, label: 'วัดใหญ่อินทาราม', dx: 75, dy: -135, p: [WAT_YAI[0], 2.6, WAT_YAI[1]]},
    {t0: 16.5, t1: 20.5, label: 'กองเรือหัวเมืองตะวันออก', dx: -75, dy: -120, p: [TAKSIN_FLEET[0] + 1.4, 1.5, TAKSIN_FLEET[1] + 2.2]},
    {t0: 23.0, t1: 27.5, label: 'บ้านสะพานบางปลาสร้อย', dx: 80, dy: -125, p: [BANG_PLA_SOI_PIER[0] + 2, 1.5, BANG_PLA_SOI_PIER[1]]},
    {t0: 30.0, t1: 34.0, label: 'ตึกมหาราช–ตึกราชินี', dx: -80, dy: -135, p: [ANG_SILA[0], 2.5, ANG_SILA[1]]},
    {t0: 36.5, t1: 41.0, label: 'สนามวิ่งควายเมืองชล', dx: 80, dy: -125, p: [BUFFALO_RACE[0], 1.4, BUFFALO_RACE[1]]},
    {t0: 44.0, t1: 47.0, label: 'เขาสามมุข', dx: -75, dy: -130, p: [KHAO_SAM_MUK[0], 5.0, KHAO_SAM_MUK[1]]},
    {t0: 47.0, t1: 51.5, label: 'ชายหาดบางแสน', dx: 75, dy: 115, p: [BANG_SAEN[0] + 2.5, 1.4, BANG_SAEN[1]]},
  ],
  soundtrack: 'soundtrack_chonburi.wav',
  sky: {
    top: [
      [1350, '#70a8cf'],
      [1767, '#71869c'],
      [1855, '#6ca7cf'],
      [1943, '#55a9df'],
      [2026, '#378fd1'],
    ],
    bottom: [
      [1350, '#f1dfbd'],
      [1767, '#c59b7f'],
      [1855, '#f0d2a8'],
      [1943, '#f5c786'],
      [2026, '#bde5f3'],
    ],
    ground: GROUND,
  },
  gloom: (Y) => {
    const inWar = Math.max(0, Math.min(1, (Y - 1766) / 0.6)) * Math.max(0, Math.min(1, (1770 - Y) / 1.5));
    return inWar * 0.35;
  },
  rain: [],
};
