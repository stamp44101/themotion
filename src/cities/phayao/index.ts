import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {PhayaoLandmarks} from './Landmarks';
import {ACTORS, BOAT_C, FOUND_HOUSES, atAlong} from './actors';
import {
  GATE, ING, ING_W, KWAN_CELLS, LEGEND_S, MOAT_ROAD, MONUMENT, NE_ROAD, OLD_ROAD, OUTLET_BRIDGE, PILLAR, SHORE_ROAD, SOUTH_TRACK,
  SW_ROAD, TILE, TRUNK, VIHARA_C, VIHARA_L, VIHARA_W, WAT_RATCHAKHRUE, WAT_SI_KHOM_KHAM, WAT_SI_UMONG, WAT_TILOK, WIANG,
} from './places';
import {STORY} from './timeline';

// World origin = the city pillar (places.ts), 100 m/unit, +x east, +z south, everything at true scale on one tile. No wall
// or moat drawn: the engine's `city` is Wiang Phayao on its headland, an old town at the cover (sparse), abandoned in the
// Burmese wars, re-filled after 2386. The lake bed (marsh and paddy) floods into the Kwan in the lake beat (Landmarks.tsx).
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));
/** the lake bed as open ground: the 2.5-unit cells merged into runs along x */
const LAKE_OPEN = (() => {
  const rows = new Map<number, number[]>();
  for (const [x, z] of KWAN_CELLS) rows.set(z, [...(rows.get(z) ?? []), x]);
  const out: {x0: number; x1: number; z0: number; z1: number}[] = [];
  for (const [z, xs] of rows) {
    xs.sort((a, b) => a - b);
    let s = xs[0];
    for (let i = 1; i <= xs.length; i++) {
      if (i === xs.length || xs[i] - xs[i - 1] > 2.6) {
        out.push({x0: s - 1.25, x1: xs[i - 1] + 1.25, z0: z - 1.25, z1: z + 1.25});
        s = xs[i];
      }
    }
  }
  return out;
})();

export const PHAYAO: CityConfig = {
  id: 'phayao',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'พะเยา', sub: 'พระเจ้าตนหลวง ริมกว๊านพะเยา'},
    finale: {kicker: 'ภูกามยาว – พะเยา', title: 'พะเยา', sub: 'กว๊านพะเยาแหล่งชีวิต ศักดิ์สิทธิ์พระเจ้าตนหลวง'},
    approxBefore: 1843,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    // the Phi Pan Nam range behind the Kwan's west shore; Doi Chom Thong north-west of the town
    peaks: [
      [-58, -34, 10, 10],
      [-60, -12, 11, 12],
      [-58, 10, 10, 9],
      [-57, 34, 10, 8],
      [-14.2, -20.2, 1.0, 2.0],
    ],
    rivers: [{path: ING, width: ING_W}],
    bridges: [
      // ถนนพหลโยธิน over the Ing at the lake's outlet (OSM bridge)
      {at: atAlong(ING, OUTLET_BRIDGE), year: 1935, modernYear: 1985, river: 0},
    ],
    noMoat: true,
    noWall: true,
    city: {
      hx: 6,
      hz: 5,
      outline: WIANG,
      // no wall is drawn (noWall); the years only clear the wiang's ground
      moat: [1300, 1301],
      wall: [1300, 1301],
      gates: [1300, 1301],
      groundFrom: 1300,
    },
    gates: [],
    rail: undefined,
    trains: [],
    houses: {
      // a sparse old town at the cover, empty after the wars, filled again after 2386
      built: [1440, 160],
      abandon: {prob: 0.97, from: 1700, spread: 70, rebuild: 1843.6, rebuildSpread: 70},
      modern: [1965, 45],
      keepOut: [
        [PILLAR[0], PILLAR[1], 0.7],
        [WAT_SI_UMONG[0], WAT_SI_UMONG[1], 1.0],
        [WAT_RATCHAKHRUE[0], WAT_RATCHAKHRUE[1], 0.8],
        ...FOUND_HOUSES.map(([x, z]) => [x, z, 0.7] as [number, number, number]),
      ],
    },
    regrowCity: [1730, 1841],
    villages: {
      // rice villages on the plain round the lake bed
      centers: [[20, -20], [24, 16], [18, 32], [-14, 38], [0, -30], [-24, -40], [28, -6]],
      built: [1300, 200],
    },
    forestCity: 1300,
    clearings: [
      // the cover's open ground round the legend Buddha on the shore
      [WAT_SI_KHOM_KHAM[0], WAT_SI_KHOM_KHAM[1], LEGEND_S * 0.46, -1e9],
      // the lake bed: marsh and paddy before the gate, water after
      ...KWAN_CELLS.map(([x, z]) => [x, z, 2.2, -1e9] as [number, number, number, number]),
      // the track up from the south (the people leave on it, the settlers come back on it; the trunk later)
      ...SOUTH_TRACK.map(([x, z]) => [x, z, 1.8, -1e9] as [number, number, number, number]),
      // the gate's works
      [GATE[0], GATE[1], 2.0, 1930],
      // the wat's ground
      [VIHARA_C[0], VIHARA_C[1], 2.2, -1e9],
    ],
    paddies: [1300, 1400],
    sites: [
      [VIHARA_C[0], VIHARA_C[1], 1.2],
      [WAT_TILOK[0], WAT_TILOK[1], 0.7],
      [WAT_SI_UMONG[0], WAT_SI_UMONG[1], 0.9],
      [WAT_RATCHAKHRUE[0], WAT_RATCHAKHRUE[1], 0.7],
      [PILLAR[0], PILLAR[1], 0.5],
      [MONUMENT[0], MONUMENT[1], 0.5],
      [GATE[0], GATE[1], 1.1],
    ],
    footprints: FOUND_HOUSES.map(([x, z], j) => ({fp: {rect: [x, z, 1.1, 0.9] as [number, number, number, number]}, from: 1843, label: `Lanna house ${j}`})),
    openGround: [
      ...LAKE_OPEN,
      // the lakeside park on the headland (the monument)
      {x0: MONUMENT[0] - 1.2, x1: MONUMENT[0] + 1.2, z0: MONUMENT[1] - 1.6, z1: MONUMENT[1] + 1.6},
      // the wat's ground
      {x0: VIHARA_C[0] - 1.6, x1: VIHARA_C[0] + 1.2, z0: VIHARA_C[1] - 1.6, z1: VIHARA_C[1] + 1.4},
      // the boats' water off the wat
      {x0: BOAT_C[0] - 3.5, x1: BOAT_C[0] + 3.5, z0: BOAT_C[1] - 3, z1: BOAT_C[1] + 3},
    ],
    urban: {from: 1962, rate: 0.7},
    urbanBox: {x0: -30, x1: 32, z0: -40, z1: 30},
    // a low provincial town: no towers
    sprawl: {height: 0.45, tall: 0.02},
    highRise: 1e9,
    towers: [],
    roads: [
      ...segs(OLD_ROAD, 0.6, 1850, 0.4),
      ...segs(MOAT_ROAD, 0.5, 1900),
      ...segs(TRUNK, 0.8, 1935, 0.15),
      ...segs(SHORE_ROAD, 0.5, 1975),
      ...segs(NE_ROAD, 0.7, 1960, 0.2),
      ...segs(SW_ROAD, 0.7, 1965, 0.2),
    ],
    ringRoadYear: 1e9,
    cars: [1955, 2026],
    boats: [1400, 1938],
    finale: 'lanterns',
    life: {
      buffalo: [
        {x: -20, z: 4, r: 4, count: 5, from: 1400, to: 1937},
        {x: 18, z: 20, r: 3, count: 4, from: 1850, to: 1990},
      ],
      people: [{x: -9.6, z: -8.6, r: 0.8, count: 10, from: 2019, to: 2027}],
      stalls: [{x: -9.0, z: -10.2, r: 0.8, count: 5, from: 2019, to: 2027}],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: PhayaoLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_phayao.wav',
  sky: {
    top: [
      [1488, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1488, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1488, '#a6a866'], ...GROUND],
  },
  // a forest-and-marsh opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1843) / 80))),
  gloom: () => 0,
};
