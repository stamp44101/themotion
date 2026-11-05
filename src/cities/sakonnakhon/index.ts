import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {SakonNakhonLandmarks} from './Landmarks';
import {ACTORS} from './actors';
import {
  AIRPORT, CITY_GATE, CLOCK, HALL, HERO_AT, HW213, KHOM_BRIDGE, LAKE_DISCS, MING_MUANG, NARAI, NITAYO, OLD_TOWN, PALACE, PHU_PHAN,
  RUNWAY_ROT, SERI_CAVE, SOUTH_ROAD, SRA_PHANG, THA_RAE, THAT_DUM, TILE, YO_ROAD,
} from './places';
import {STORY} from './timeline';

// World origin = the stupa of Wat Phra That Choeng Chum, 100 m/unit (places.ts), +x east, +z south. The engine's
// `city` is the double-moated Khmer square of เมืองหนองหารหลวง on Nong Han's west shore ([local]'s constructed plan;
// one moat drawn), never walled in masonry. Nong Han is drawn as open water in Landmarks.tsx (a closed `path` river
// is a ring channel, not a lake) and fills during the legend beat; `sites` and `clearings` keep things off it from
// the start. The lake is drawn 0.55x about the town's shore; Tha Rae, Narai Cheng Weng and Phu Phan are pulled in.
type P = [number, number];
const segs = (pts: P[], width: number, year: number) => pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year}));
const trackClear = (pts: P[]) =>
  pts.flatMap(([x0, z0], i) =>
    i === 0
      ? []
      : Array.from({length: 6}, (_, k) => {
          const [x1, z1] = pts[i - 1];
          const u = k / 6;
          return [x0 + (x1 - x0) * u, z0 + (z1 - z0) * u, 2.0, -1e9] as [number, number, number, number];
        }),
  );

export const SAKONNAKHON: CityConfig = {
  id: 'sakonnakhon',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สกลนคร', sub: 'ผ้าคราม พระธาตุ และหนองหาร'},
    finale: {kicker: 'พ.ศ. 2381 – 2569', title: 'สกลนคร', sub: 'เมืองครามริมหนองหาร'},
    approxBefore: 1800,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    // the Phu Phan hills in the tile's south-west corner (really 10-22 km out); the palace and the cave on them
    peaks: [
      [PHU_PHAN[0] - 4, PHU_PHAN[1] + 4, 9, 10],
      [PALACE[0], PALACE[1], 4, 6],
      [SERI_CAVE[0] - 3, SERI_CAVE[1] + 2, 5, 7],
    ],
    rivers: [],
    bridges: [],
    city: {
      hx: 5.8,
      hz: 7.5,
      outline: OLD_TOWN,
      moat: [1000.5, 1030],
      wall: [1e9, 1e9],
      gates: [1e9, 1e9],
      groundFrom: 1838.5,
    },
    gates: [],
    trains: [],
    houses: {
      // the new town of 2381 fills the old square
      built: [1838.6, 60],
      modern: [1955, 50],
      keepOut: [[0, 0, 3.2], [SRA_PHANG[0], SRA_PHANG[1], 1.8]],
    },
    villages: {
      // the Tai Yo, Phu Tai and Lao villages round the lake after 2381
      centers: [[-14, 14], [-20, -12], [6, 34], [-30, -44], [2, -40], [-34, 8], [-8, 40]],
      built: [1839, 70],
    },
    forestCity: 1000,
    clearings: [
      ...LAKE_DISCS.map(([x, z, r]) => [x, z, r + 0.8, -1e9] as [number, number, number, number]),
      [HERO_AT[0], HERO_AT[1], 24, -1e9],
      [0, -1.3, 8.5, 1000],
      [NARAI[0], NARAI[1], 3, -1e9],
      [THAT_DUM[0], THAT_DUM[1], 2.6, -1e9],
      [THA_RAE[0], THA_RAE[1], 4.6, 1884],
      [KHOM_BRIDGE[0], KHOM_BRIDGE[1], 2.2, -1e9],
      [PALACE[0], PALACE[1], 2.2, 1974],
      ...[-1, 0, 1].map((k) => [AIRPORT[0] + k * 5 * Math.cos(RUNWAY_ROT), AIRPORT[1] + k * 5 * Math.sin(RUNWAY_ROT), 5, 1984] as [number, number, number, number]),
      ...trackClear(YO_ROAD),
      ...trackClear(SOUTH_ROAD),
    ],
    paddies: [1840, 1990],
    sites: [
      ...LAKE_DISCS,
      [0, 0, 3.2],
      [SRA_PHANG[0], SRA_PHANG[1], 1.8],
      [KHOM_BRIDGE[0], KHOM_BRIDGE[1], 1.4],
      [THAT_DUM[0], THAT_DUM[1], 2.0],
      [NARAI[0], NARAI[1], 2.0],
      [THA_RAE[0], THA_RAE[1] - 1, 3.8],
      [HALL[0], HALL[1], 2.6],
      [CLOCK[0], CLOCK[1], 0.8],
      [CITY_GATE[0], CITY_GATE[1] - 0.9, 1.4],
      [PALACE[0], PALACE[1], 1.6],
      [SERI_CAVE[0], SERI_CAVE[1], 1.2],
    ],
    openGround: [
      // the airport (ค่ายกฤษณ์สีวะรา)
      {x0: AIRPORT[0] - 9, x1: AIRPORT[0] + 9, z0: AIRPORT[1] - 5, z1: AIRPORT[1] + 5},
      // สนามมิ่งเมือง and the procession's route to the stupa
      {x0: MING_MUANG[0] - 2.2, x1: -1.0, z0: 1.6, z1: 4.0},
    ],
    urban: {from: 1955, rate: 1.3},
    // the town grows west of the lake, along ถ.นิตโย; the lake's far shores stay rural
    urbanBox: {x0: -48, x1: 8, z0: -42, z1: 30},
    sprawl: {height: 0.7, tall: 0.04},
    highRise: 2005,
    towers: [],
    roads: [
      ...segs(YO_ROAD, 0.6, 1830),
      ...segs(SOUTH_ROAD, 0.6, 1800),
      ...segs(NITAYO, 0.9, 1930),
      ...segs(HW213.slice(0, 3), 0.8, 1950),
    ],
    ringRoadYear: 1e9,
    cars: [1960, 2026],
    boats: [1e9, 1e9],
    finale: 'lanterns',
    life: {
      people: [
        {x: -3.6, z: 2.4, r: 1.2, count: 16, from: 1840, to: 2024},
      ],
      buffalo: [
        {x: -24, z: 18, r: 4, count: 6, from: 1840, to: 1985},
        {x: -18, z: -28, r: 3, count: 5, from: 1840, to: 1985},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: SakonNakhonLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_sakonnakhon.wav',
  sky: {
    top: [
      [-600, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [-600, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[-600, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1840) / 60))),
  gloom: () => 0,
};
