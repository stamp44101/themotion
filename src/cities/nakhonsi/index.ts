import {ramp} from '../../lib';
import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {CHEDI, HO_PHRA_ISUAN, HO_PHRA_NARAI, NakhonSiLandmarks, NORTH_GATE, PHUTTHASIHING, SLIDE} from './Landmarks';
import {CAPTIONS, ERAS, SOUND_EVENTS, yearAt} from './timeline';

// World origin = old-town centroid (8.41680, 99.96438), 80 m/unit,
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
    // Narrow cones, not broad ones: the first draft's r=22 summit spread 2 units of
    // terrain onto the coastal plain at x=-11.5, and the 1914 train ran sunk in it.
    peaks: [
      [-45, -4, 18, 13],
      [-46, 9, 14, 9],
      [-44, -34, 12, 8],
      [-46, 28, 12, 8],
    ],
    rivers: [
      // Gulf of Thailand: 13 km east in reality, compressed to the tile's east edge
      {axis: 'z', pos: 44, width: 10},
      // คลองหน้าเมือง: along the north wall, then east to the Gulf (OSM way 145173593)
      {path: [[-6.5, -15.05], [-1.34, -15.6], [1.7, -15.92], [3.2, -16.0], [12.5, -18.4], [26, -24], [39, -27]], width: 0.4},
      // คลองท่าซัก: north of the old town, past Tha Wang (OSM)
      {path: [[-12, -50], [-10.3, -44.2], [-7.7, -37.6], [5.5, -43.6], [16.1, -44.4], [39, -46]], width: 0.35},
    ],
    bridges: [],
    // Khao Chum Thong - Nakhon Si branch, opened 1 Oct 1914. The station (Tha Wang) is a
    // terminus, so the line stops there instead of running on to the tile edge.
    rail: {axis: 'z', pos: -11.5, open: [1913.4, 1914.1], station: [-8.9, -31.4], stationYear: 1912.5, span: [-34, 50]},
    trains: SOUND_EVENTS.trains.map((tr) => ({...tr, dir: tr.dir as 1 | -1})),
    city: {
      hx: 4.7,
      hz: 15.15,
      // A rectangle 456 x 2,384 m tilted 6 deg, north end to the west (docs/briefs/nakhonsi.md §1):
      // ถนนราชดำเนิน runs the length of the town at that angle, and the north moat
      // (คลองหน้าเมือง) meets it at a right angle, rising to the east (owner's satellite check). The brief's four corner pins made a
      // parallelogram (long sides 8.5 deg, short sides 3 deg the other way); only the long
      // sides' length and the chedi's 115 m to the east wall are kept from it.
      // corners NW, NE, SE, SW
      outline: [
        [-4.09, -14.55],
        [1.58, -15.15],
        [4.69, 14.49],
        [-0.98, 15.08],
      ],
      moat: [1686, 1688],
      wall: [1686, 1688],
      gates: [1687, 1689],
      groundFrom: 1200,
    },
    gates: [{x: NORTH_GATE[0], z: NORTH_GATE[1], rot: Math.PI / 2 + 0.105, width: 1.6, pavilion: true}], // turned with the 6 deg wall
    houses: {
      built: [1250, 500],
      modern: [1920, 80],
      keepOut: [[CHEDI[0], CHEDI[1], 1.6]],
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
    clearings: [
      [CHEDI[0], CHEDI[1], 3.2, 300],
      // the settlement on the sand ridge (หาดทรายแก้ว) that the walled town later sits on:
      // open sand and gardens along the ridge long before the walls
      ...[-27, -21, -15, -9, -3, 3, 9, 15, 21, 27].map((z, i) => [0.3 + 0.105 * z, z, 3.4, 420 + i * 25] as [number, number, number, number]),
      // 22 Nov 1988: the slide strips a channel down Khao Luang's east face (see SLIDE)
      ...SLIDE.map(([x, z]) => [x, z, 1.6, 1988.15] as [number, number, number, number]),
    ],
    // rice on the coastal plain from the Tambralinga era on (Song records, c. 1001)
    paddies: [550, 1300],
    // landmark ground: no generated building, house or hut stands on these in any era
    sites: [
      [CHEDI[0], CHEDI[1], 1.8],
      [NORTH_GATE[0], NORTH_GATE[1], 1.2],
      [HO_PHRA_ISUAN[0], HO_PHRA_ISUAN[1], 1.0],
      [HO_PHRA_NARAI[0], HO_PHRA_NARAI[1], 1.0],
      [PHUTTHASIHING[0], PHUTTHASIHING[1], 0.8],
    ],
    // The modern city is a long low-rise strip on the sand ridge: Tha Wang market (the
    // commercial centre since the railway) 2 km north of the old town, down to Central
    // Nakhon Si 3.2 km south of the chedi. Shophouses, two-to-five storeys; a handful of
    // hotels and offices at Tha Wang are the only tall blocks.
    urban: {from: 1900, rate: 2.4},
    urbanBox: {x0: -14, x1: 15, z0: -44, z1: 49},
    sprawl: {height: 0.55, tall: 0.015},
    highRise: 1995,
    towers: [{x0: -1, x1: 8, z0: -37, z1: -29, extra: 3}],
    roads: [
      // ถนนราชดำเนิน out of the north gate to Tha Wang, and south toward Central
      {from: [-1.1, -14.2], to: [3.4, -34], width: 1.2, year: 1915},
      {from: [3.4, -34], to: [5, -49], width: 1.2, year: 1930},
      {from: [2.2, 15.6], to: [7.2, 47.6], width: 1.2, year: 1930},
    ],
    ringRoadYear: 1975,
    cars: [1960, 2026],
    boats: [300, 2026],
    finale: 'fireworks',
    cameraKeys: [
      // opening: east of the town looking west, Khao Luang behind the chedi
      [0, CHEDI[0], 1.5, CHEDI[1], 38, 95, 28, 30],
      [3, CHEDI[0], 2, CHEDI[1], 60, 102, 30, 30],
      // legend -> stele: orbit the chedi round to the south
      [7.5, CHEDI[0], 2.5, CHEDI[1], 75, 130, 32, 30],
      [8.7, CHEDI[0], 2.5, CHEDI[1], 75, 140, 32, 30],
      // Tambralinga: the long town from the south-west
      [12.5, 0, 1, -2, 95, 175, 36, 30],
      [16.5, 0, 1, -2, 110, 215, 35, 30],
      // the Lanka bell and Chandrabhanu: close on the chedi, swinging west -> north-west
      [20.5, CHEDI[0], 2.5, CHEDI[1], 48, 250, 32, 30],
      [21.8, CHEDI[0], 2.5, CHEDI[1], 48, 262, 32, 30],
      [25, CHEDI[0], 2.5, CHEDI[1], 52, 300, 32, 30],
      // Ayutthaya: wide from the north-west, the whole walled town
      [29.5, 0, 1, 0, 125, 340, 38, 30],
      // Narai's walls: the north gate on the canal
      [33.5, NORTH_GATE[0], 1, NORTH_GATE[1] + 2, 55, 380, 34, 30],
      // Chao Nakhon: the town from the north-east
      [38.5, 0, 1, -4, 85, 420, 36, 30],
      // 1914: follow the first train up the line into the Tha Wang terminus
      [40.2, -11, 1, 26, 55, 455, 34, 30],
      [41.5, -11, 1, 2, 55, 450, 34, 30],
      [42.4, -10, 1, -20, 55, 444, 34, 30],
      [44.5, -9, 1, -30, 60, 446, 35, 30],
      // the modern strip city from Tha Wang to Central, growing
      [47, 2, 1, 4, 155, 480, 38, 30],
      // 1988: across the town to the Khao Luang slopes
      [48.4, -34, 8, -4, 120, 495, 32, 30],
      [50.8, -34, 8, -4, 115, 505, 32, 30],
      // World Heritage: back to the chedi, night falls over the modern city
      [52.5, CHEDI[0], 2.5, CHEDI[1], 80, 530, 32, 30],
      [56, CHEDI[0], 2.5, CHEDI[1], 95, 565, 34, 30],
      [60, CHEDI[0], 2, CHEDI[1] - 4, 125, 590, 35, 30],
    ],
  },
  Landmarks: NakhonSiLandmarks,
  callouts: [
    {t0: 4, t1: 7.4, label: 'พระบรมธาตุเจดีย์', dx: 90, dy: -120, p: [CHEDI[0], 2.4, CHEDI[1]]},
    {t0: 13.2, t1: 15.7, label: 'คลองหน้าเมือง', dx: 90, dy: 110, p: [8, 0, -17.3]},
    {t0: 30.5, t1: 33.6, label: 'ประตูชัยเหนือ', dx: -90, dy: -130, p: [NORTH_GATE[0], 1.5, NORTH_GATE[1]]},
    {t0: 35.2, t1: 38.4, label: 'หอพระอิศวร', dx: -100, dy: -120, p: [HO_PHRA_ISUAN[0], 0.8, HO_PHRA_ISUAN[1]]},
    {t0: 42.9, t1: 44.4, label: 'สถานีรถไฟนครศรีธรรมราช', dx: 80, dy: -130, p: [-8.9, 1.2, -31.4]},
    {t0: 48.4, t1: 50.9, label: 'เขาหลวง', dx: 80, dy: -110, p: [-44, 22.5, -4]},
    {t0: 52.6, t1: 55.6, label: 'วัดพระมหาธาตุวรมหาวิหาร', dx: 90, dy: -120, p: [CHEDI[0], 5.5, CHEDI[1]]},
  ],
  soundtrack: 'soundtrack_nakhonsi.wav',
  sky: {
    top: [
      [0, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [0, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    // a sandy coastal plain early (the ridge is beach sand), the shared greens from 1300
    ground: [[0, '#a29c66'], [1100, '#969a5e'], ...GROUND.filter(([y]) => y >= 1250)],
  },
  // the legend-era beats are forest with one white chedi: lift the sky fill until the town
  // grows (fades out 1250-1400, t ~24.6-29.6 s, slowly enough not to step)
  ambient: (Y) => 0.6 * (1 - ramp(Y, 1250, 1400)),
  gloom: (Y) => ramp(Y, 1767, 1767.2) * (1 - ramp(Y, 1769.2, 1769.6)) + ramp(Y, 1988.12, 1988.25) * (1 - ramp(Y, 1988.3, 1988.4)),
};
