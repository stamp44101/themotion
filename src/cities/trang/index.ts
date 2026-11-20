import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {TrangLandmarks} from './Landmarks';
import {ACTORS, BREAKFAST_C, CALLBACK_AT, GARDENS, HALL_AT, HERO_AT, HERO_S, KT_STATION_AT, LINE, PORK_AT, QUAY, SHOPHOUSES, TABLES, TR_STATION_AT} from './actors';
import {SHRINE_AT} from './Landmarks';
import {
  AIRPORT, CLOCK, MUNI, OSM_ROADS, PILLAR, RIVER, RIVER_W, SRA, TILE, WATER_CLEARINGS, inWater,
} from './places';
import {STORY} from './timeline';

// World origin = the clock tower in Thap Thiang (today's Trang; places.ts), 200 m/unit, +x east, +z south: the engine grows
// its `city` and the modern sprawl outward from the origin, and Thap Thiang is the town that grows. The city pillar is at Khuan
// Thani on the river (-29, 18), Kantang on the estuary at the south-west (-53, 81), the sea at the south edge. The estuary and
// the sea are flat shapes drawn by Landmarks.tsx (the engine knows only path rivers), kept clear here by a 2-unit grid of
// clearings (no tree) and sites (no house, hut or block). At the cover the tile is forest with Khuan Thani's village and a few
// huts at Kantang and Thap Thiang; Kantang's shophouses, the railway, the hall and the rubber gardens are Landmarks.tsx.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));
/** a rectangle as a grid of clearing discs */
const clearRect = (cx: number, cz: number, w: number, d: number, year: number): [number, number, number, number][] => {
  const out: [number, number, number, number][] = [];
  for (let x = -w / 2; x <= w / 2 + 0.01; x += 1.2) for (let z = -d / 2; z <= d / 2 + 0.01; z += 1.2) out.push([cx + x, cz + z, 0.9, year]);
  return out;
};
const bbox = (pts: P[]) => {
  const xs = pts.map((p) => p[0]);
  const zs = pts.map((p) => p[1]);
  return {hx: Math.max(...xs.map(Math.abs)) + 0.5, hz: Math.max(...zs.map(Math.abs)) + 0.5};
};
const CORE = bbox(MUNI);

export const TRANG: CityConfig = {
  id: 'trang',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ตรัง', sub: 'ถิ่นกำเนิดยางพารา ริมแม่น้ำตรัง'},
    finale: {kicker: 'พ.ศ. 2354 – 2569', title: 'ตรัง', sub: 'หมูย่างรสเลิศ ถิ่นกำเนิดยางพารา'},
    approxBefore: 1811,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [],
    rivers: [{path: RIVER, width: RIVER_W}],
    bridges: [],
    noMoat: true,
    noWall: true,
    city: {
      hx: CORE.hx,
      hz: CORE.hz,
      outline: MUNI,
      // no wall is drawn (noWall); these years only clear Thap Thiang's ground as the town moves up
      moat: [1914.6, 1914.7],
      wall: [1914.6, 1914.7],
      gates: [1914.6, 1914.7],
      groundFrom: 1914.5,
    },
    gates: [],
    rail: undefined,
    trains: [],
    houses: {
      // the municipality fills from the move through the grow beat (the counter runs 2457-2538)
      built: [1916, 72],
      modern: [1965, 40],
      keepOut: [
        [CLOCK[0], CLOCK[1], 0.5],
        [HALL_AT[0], HALL_AT[1], 0.8],
        [TR_STATION_AT[0], TR_STATION_AT[1], 1.0],
      ],
    },
    villages: {
      // Khuan Thani (the first town), the hamlet at Kantang before the port, Thap Thiang's trading village, farms on the way
      centers: [PILLAR, [-22.5, 38.6], [-7, -8], [-12, 22], [-31, 18]],
      built: [1790, 60],
    },
    forestCity: 1914.5,
    clearings: [
      ...WATER_CLEARINGS,
      // the cover tree's ground (forest round it; a rubber garden later)
      [HERO_AT[0], HERO_AT[1], HERO_S * 0.16, -1e9],
      // Kantang's ground on the bank, cleared as the governor comes down (the trees fade before the shophouses rise)
      ...[[-27.3, 37.1], [-25.7, 38.7], [-27.1, 41.1], [-25.1, 41.5], [-23.9, 39.1], [-27.9, 39.7], [-22.5, 37.4], [-22.2, 40.2]].map(([x, z]) => [x, z, 1.6, 1886] as [number, number, number, number]),
      // the first plot and the rubber gardens, each cleared a few years before its trees go in
      ...GARDENS.flatMap(([x, z, w, d, year]) => clearRect(x, z, w, d, year - 4)),
      // the railway's bed, cleared as the counter enters the train beat
      ...LINE.slice(1).flatMap((b, i) => {
        const a = LINE[i];
        const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.5);
        return Array.from({length: n}, (_, j) => [a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n, 1.1, 1909] as [number, number, number, number]);
      }),
      // the stations, the hall and the park
      [KT_STATION_AT[0], KT_STATION_AT[1], 1.8, 1909],
      [TR_STATION_AT[0], TR_STATION_AT[1], 1.6, 1909],
      [HALL_AT[0], HALL_AT[1], 1.2, 1912],
      [BREAKFAST_C[0], BREAKFAST_C[1], 3.0, 1990],
      // the estuary's bank downstream of Kantang, so the junks and the boats are not hidden by the forest
      ...[[-26.5, 46], [-27, 50], [-27.5, 54], [-33.6, 48], [-33.8, 44], [-26.4, 33], [-26.6, 30.4], [-34, 52]].map(([x, z]) => [x, z, 2.0, -1e9] as [number, number, number, number]),
    ],
    paddies: [1800, 1900],
    sites: [
      // over the water; a smaller disc at the shore so the shore roads stay clear of it
      ...WATER_CLEARINGS.flatMap(([x, z]) => {
        const ring = (r: number) => [[r, 0], [-r, 0], [0, r], [0, -r], [r * 0.7, r * 0.7], [-r * 0.7, r * 0.7], [r * 0.7, -r * 0.7], [-r * 0.7, -r * 0.7]].every(([dx, dz]) => inWater(x + dx, z + dz));
        return ring(1.5) ? [[x, z, 1.45] as [number, number, number]] : ring(0.9) ? [[x, z, 0.8] as [number, number, number]] : [];
      }),
      [SHRINE_AT[0], SHRINE_AT[1], 0.6],
      [HALL_AT[0], HALL_AT[1], 0.75],
      [BREAKFAST_C[0], BREAKFAST_C[1] + 0.4, 2.0],
      [PORK_AT[0], PORK_AT[1], 0.6],
      [CALLBACK_AT[0], CALLBACK_AT[1], 0.9],
      [KT_STATION_AT[0], KT_STATION_AT[1], 0.9],
      [TR_STATION_AT[0], TR_STATION_AT[1], 0.85],
    ],
    footprints: [
      ...LINE.slice(1).map((b, i) => ({fp: {band: [LINE[i], b, 1.0] as [P, P, number]}, from: 1912, label: `railway ${i}`})),
      ...SHOPHOUSES.map(([x, z], j) => ({fp: {rect: [x, z, 1.0, 1.5] as [number, number, number, number]}, from: 1890, label: `shophouse ${j}`})),
      {fp: {band: [QUAY[0], QUAY[1], 0.5] as [P, P, number]}, from: 1890, label: 'quay'},
      ...GARDENS.map(([x, z, w, d, year], g) => ({fp: {rect: [x, z, w, d] as [number, number, number, number]}, from: year, label: `rubber garden ${g}`})),
      ...TABLES.map(([x, z], i) => ({fp: {rect: [x, z, 0.6, 0.6] as [number, number, number, number]}, from: 2010, label: `breakfast table ${i}`})),
    ],
    openGround: [
      // the airport (OSM aerodrome), the town park, Sra Kaphang Surin
      {x0: AIRPORT[0] - 6.5, x1: AIRPORT[0] + 7.0, z0: AIRPORT[1] - 1.5, z1: AIRPORT[1] + 1.5},
      {x0: BREAKFAST_C[0] - 2.8, x1: BREAKFAST_C[0] + 2.8, z0: BREAKFAST_C[1] - 2.6, z1: BREAKFAST_C[1] + 2.6},
      {x0: SRA[0] - 1.6, x1: SRA[0] + 1.6, z0: SRA[1] - 1.6, z1: SRA[1] + 1.6},
    ],
    urban: {from: 1950, rate: 0.9},
    // the modern town: Thap Thiang, the ring road and the suburbs out to the airport and Khuan Thani's road (the real
    // built-up area; Kantang stays a small port town)
    urbanBox: {x0: -25, x1: 20, z0: -15, z1: 34},
    sprawl: {height: 0.5, tall: 0.03},
    highRise: 1995,
    towers: [],
    roads: [
      ...OSM_ROADS.flatMap(([, year, width, pts]) => segs(pts, width, year)),
    ],
    ringRoadYear: 1e9,
    cars: [1950, 2026],
    boats: [1800, 2026],
    finale: 'fireworks',
    life: {
      people: [{x: BREAKFAST_C[0] + 0.6, z: BREAKFAST_C[1] + 0.9, r: 1.6, count: 16, from: 2011, to: 2027}],
      stalls: [{x: BREAKFAST_C[0] + 1.6, z: BREAKFAST_C[1] + 1.7, r: 0.6, count: 4, from: 2011, to: 2027}],
      buffalo: [
        {x: -14, z: 26, r: 3, count: 4, from: 1800, to: 1960},
        {x: -32, z: 14, r: 3, count: 4, from: 1800, to: 1960},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: TrangLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_trang.wav',
  sky: {
    top: [
      [1800, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1800, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1800, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the towns are up (CLAUDE.md)
  ambient: (Y) => 0.32 * (1 - Math.min(1, Math.max(0, (Y - 1890) / 60))),
  gloom: () => 0,
};
