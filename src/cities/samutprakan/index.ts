import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {SamutPrakanLandmarks} from './Landmarks';
import {ACTORS, FORTS, KILN} from './actors';
import {
  AIRPORT, AIRPORT_ROAD, BANGPU, BRIDGE_SPANS, CHEDI, CHULA, HALL, OLD_TOWN, PIER, PILLAR, RING_N, RING_S1, RING_S2,
  SRINAKHARIN, SUKHUMVIT, SUKSAWAT, SUKSAWAT_END, SWAMP, THEPHARAK, TILE, WATER_CLEARINGS, WAT_KLANG, inOldWater, inPoly,
} from './places';
import {STORY} from './timeline';

// World origin = the city pillar (places.ts), 150 m/unit, +x east, +z south. The river and the Gulf are one flat shape drawn
// by Landmarks.tsx (the engine knows only path rivers), so they are kept clear here: a 2-unit grid of clearings (no tree)
// and sites (no house, hut or block) over them, as Songkhla does. No wall: the engine's `city` is Pak Nam's strip of the
// east bank, filled with houses from Rama II's founding (~2362); the forts, the chedi, the barges, the French ships, Bang Pu,
// the bridges and the airport are Landmarks.tsx.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));
const inSwamp = (x: number, z: number) => inPoly(SWAMP, x, z);

export const SAMUTPRAKAN: CityConfig = {
  id: 'samutprakan',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สมุทรปราการ', sub: 'เมืองปากน้ำ ประตูสู่สยาม'},
    finale: {kicker: 'สมัย ร.2 – พ.ศ. 2569', title: 'สมุทรปราการ', sub: 'พระสมุทรเจดีย์ ป้อมพระจุลฯ ปากน้ำเจ้าพระยา'},
    // Rama II's years (2362-2371) disagree between sources: the counter says ราว until the raise beat
    approxBefore: 1828,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [],
    rivers: [],
    bridges: [],
    noMoat: true,
    noWall: true,
    city: {
      hx: 2,
      hz: 5,
      outline: OLD_TOWN,
      // no wall is drawn (noWall); these years only clear the town's ground with the founding
      moat: [1819.2, 1819.3],
      wall: [1819.2, 1819.3],
      gates: [1819.2, 1819.3],
      groundFrom: 1819.1,
    },
    gates: [],
    rail: undefined,
    trains: [],
    houses: {
      // Pak Nam fills from Rama II's founding through the raise beat (the counter runs ราว 2362-2410)
      built: [1820, 45],
      modern: [1950, 40],
      keepOut: [
        [PILLAR[0], PILLAR[1], 0.7],
        [HALL[0], HALL[1], 0.8],
        [WAT_KLANG[0], WAT_KLANG[1], 0.8],
        ...FORTS.map(([x, z]) => [x, z, 1.3] as [number, number, number]),
        [KILN[0], KILN[1], 1.0],
      ],
    },
    villages: {
      // fishing and orchard villages along both banks and the coast
      centers: [[-14, 2], [-20, 14], [6, 16], [-26, 40], [10, 34], [26, 48], [-30, -4]],
      built: [1830, 1890],
    },
    forestCity: 1819.1,
    clearings: [
      ...WATER_CLEARINGS,
      // the swamp of Nong Ngu Hao: reeds, no trees
      ...(() => {
        const out: [number, number, number, number][] = [];
        for (let x = 22; x < 46; x += 2) for (let z = -33; z < -10; z += 2) if (inSwamp(x, z)) out.push([x, z, 1.6, -1e9]);
        return out;
      })(),
      // the chedi's island, cleared for the work with the founding
      [CHEDI[0], CHEDI[1], 1.9, 1818.8],
      [CHEDI[0], CHEDI[1] + 2.2, 1.4, 1818.8],
      // Pak Nam's bank and the brick yard, cleared with the founding (before the forts rise in the build beat)
      ...[[0.4, -6.4], [0.6, -3.6], [1.4, -1.0], [0.6, 1.6], [0.2, 3.4], [KILN[0], KILN[1]]].map(([x, z]) => [x, z, 1.8, 1818.8] as [number, number, number, number]),
      // Phra Chula's ground at the mouth, cleared before the fort beat
      [CHULA[0], CHULA[1], 3.4, 1866],
      [CHULA[0] + 1.6, CHULA[1] - 2.6, 1.6, 1866],
      // Bang Pu's shore, cleared before the resort beat
      [BANGPU[0], BANGPU[1], 2.6, 1922],
      [BANGPU[0] - 2.2, BANGPU[1] + 0.8, 1.6, 1922],
      // the bridges' landings
      ...BRIDGE_SPANS.flat().map(([x, z]) => [x, z, 1.4, 2003] as [number, number, number, number]),
    ],
    paddies: [1800, 1850],
    sites: [
      // over the water (and the old west channel); a smaller disc at the shore so the shore roads stay clear of it
      ...WATER_CLEARINGS.filter(([, , r]) => r > 1).flatMap(([x, z]) => {
        const ring = (r: number) => [[r, 0], [-r, 0], [0, r], [0, -r], [r * 0.7, r * 0.7], [-r * 0.7, r * 0.7], [r * 0.7, -r * 0.7], [-r * 0.7, -r * 0.7]].every(([dx, dz]) => inOldWater(x + dx, z + dz));
        return ring(1.5) ? [[x, z, 1.45] as [number, number, number]] : ring(0.9) ? [[x, z, 0.8] as [number, number, number]] : [];
      }),
      [CHEDI[0], CHEDI[1], 1.7],
      [CHEDI[0] + 1.1, CHEDI[1] + 0.5, 0.8],
      ...FORTS.map(([x, z]) => [x, z, 0.95] as [number, number, number]),
      [PILLAR[0], PILLAR[1], 0.6],
      [KILN[0], KILN[1], 0.9],
      [CHULA[0], CHULA[1], 3.0],
      [BANGPU[0], BANGPU[1], 1.8],
      [PIER[0][0], PIER[0][1] - 0.6, 0.8],
    ],
    openGround: [
      // the airport: no block on the fill
      {x0: 24, x1: 46, z0: -34, z1: -11},
      // the fort's glacis and Bang Pu's beach
      {x0: CHULA[0] - 3, x1: CHULA[0] + 3, z0: CHULA[1] - 3.5, z1: CHULA[1] + 3.5},
      {x0: BANGPU[0] - 3, x1: BANGPU[0] + 3, z0: BANGPU[1] - 1.5, z1: BANGPU[1] + 2.5},
    ],
    urban: {from: 1946, rate: 1.0},
    urbanBox: {x0: TILE.x0, x1: TILE.x1, z0: TILE.z0, z1: TILE.z1},
    sprawl: {height: 0.75, tall: 0.05},
    highRise: 1992,
    // the condominiums along Sukhumvit north of Pak Nam, toward Bangkok
    towers: [{x0: -6, x1: 8, z0: -32, z1: -12, extra: 2}],
    roads: [
      ...segs(SUKHUMVIT, 0.7, 1936),
      ...segs(SUKSAWAT, 0.6, 1958),
      ...segs(SUKSAWAT_END, 0.5, 1990),
      ...segs(SRINAKHARIN, 0.7, 1972),
      ...segs(THEPHARAK, 0.6, 1978),
      ...segs(AIRPORT_ROAD, 0.8, 2003),
      ...segs(RING_S1, 0.8, 2005.7),
      ...segs(RING_S2, 0.8, 2005.7),
      ...segs(RING_N, 0.8, 2005.7),
    ],
    ringRoadYear: 1e9,
    cars: [1936, 2026],
    boats: [1e9, 1e9],
    finale: 'fireworks',
    life: {
      people: [
        {x: CHEDI[0], z: CHEDI[1] + 1.8, r: 1.4, count: 18, from: 2007, to: 2027},
        {x: -1.2, z: -2.2, r: 1.0, count: 14, from: 2007, to: 2027},
        {x: BANGPU[0], z: BANGPU[1] + 1.4, r: 1.6, count: 14, from: 1937, to: 2027},
      ],
      stalls: [
        {x: 0.6, z: -2.0, r: 1.0, count: 8, from: 2007, to: 2027},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: SamutPrakanLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_samutprakan.wav',
  sky: {
    top: [
      [1818, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1818, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1818, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1825) / 60))),
  gloom: () => 0,
};
export {AIRPORT};
