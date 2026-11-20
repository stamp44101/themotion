import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {PattaniLandmarks} from './Landmarks';
import {ACTORS, HAUL_PATH, PROC_PATH, SHOPS, atAlong} from './actors';
import {
  CANNON_AT, CANNON_S, CENTRAL_MOSQUE, CHABANG_TIGA, DECHA_BRIDGE, EAST_RD, HWY42, HWY43, ISTANA, KRUESE, KRUSE_VILLAGE, LANDING,
  NONGCHIK_RD, NORTH_RD, OLD_STREET, OLD_TOWN, PILLAR, PITS, PSU, PSU_RD, RD_410, RD_418, RIVER, RIVER_W, SAMAKKHI_RD, SEA_CLEARINGS,
  SHRINE, TILE, TOMB, inSea,
} from './places';
import {STORY} from './timeline';

// World origin = the city pillar (places.ts), 125 m/unit, +x east, +z south, everything at true scale. No wall: the engine's
// `city` is the town on both banks of the Pattani river, filled with houses from the move (the newtown beat) on. At the cover
// the tile is forest, paddy and the bay, with Kru Se's village on the shore and the giant cannon on the plain between.
type P = [number, number];
const segs = (pts: P[], width: number, year: number, step = 0) =>
  pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year: year + i * step}));
const strip = (pts: P[], r: number, year: number, step = 1.2): [number, number, number, number][] =>
  pts.slice(1).flatMap((b, i) => {
    const a = pts[i];
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    return Array.from({length: n}, (_, j) => [a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n, r, year] as [number, number, number, number]);
  });
/** the cover cannon's strip of open ground (rotated 0.18 rad like the cannon) */
const CANNON_LINE: P[] = [-0.52, 0.52].map((u) => [CANNON_AT[0] + Math.cos(0.18) * u * CANNON_S, CANNON_AT[1] - Math.sin(0.18) * u * CANNON_S] as P);

export const PATTANI: CityConfig = {
  id: 'pattani',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ปัตตานี', sub: 'ปืนใหญ่พญาตานี เมืองท่าริมอ่าว'},
    finale: {kicker: 'พ.ศ. 2145 – 2569', title: 'ปัตตานี', sub: 'เมืองงามสามวัฒนธรรม'},
    approxBefore: 1602,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [],
    rivers: [{path: RIVER, width: RIVER_W}],
    bridges: [
      // สะพานเดชานุชิต (Landmarks.tsx draws its truss over the deck)
      {at: atAlong(RIVER, DECHA_BRIDGE), year: 1912, modernYear: 1990, river: 0},
      // ทล.42 over the river south of the town
      {at: atAlong(RIVER, [-1.95, 15.15]), year: 1950, modernYear: 1985, river: 0},
    ],
    noMoat: true,
    noWall: true,
    city: {
      hx: 10,
      hz: 15,
      outline: OLD_TOWN,
      // no wall is drawn (noWall); these years only clear the town's ground with the move
      moat: [1790.3, 1790.4],
      wall: [1790.3, 1790.4],
      gates: [1790.3, 1790.4],
      groundFrom: 1790.2,
    },
    gates: [],
    rail: undefined,
    trains: [],
    houses: {
      // the town fills through the newtown and bridge beats (the counter runs 1787-1930)
      built: [1795, 70],
      modern: [1955, 45],
      keepOut: [
        [PILLAR[0], PILLAR[1], 0.7],
        [SHRINE[0], SHRINE[1], 1.2],
        [CHABANG_TIGA[0], CHABANG_TIGA[1], 2.2],
        [CENTRAL_MOSQUE[0], CENTRAL_MOSQUE[1], 2.2],
        [DECHA_BRIDGE[0], DECHA_BRIDGE[1], 1.4],
        ...SHOPS.map(([x, z]) => [x, z, 1.0] as [number, number, number]),
        // the procession's way from the shrine to the river and up the far bank
        ...PROC_PATH.map(([x, z]) => [x, z, 0.6] as [number, number, number]),
      ],
    },
    villages: {
      // Kru Se's village on the shore (it stands at the cover), and the rice and fishing villages round the bay
      centers: [KRUSE_VILLAGE, [47.5, -6.5], [52, -2], [-14, 8], [-20, 18], [12, 20], [30, 24], [-22, -2], [56, 8], [6, -24]],
      built: [1450, 1800],
    },
    forestCity: 1789,
    clearings: [
      ...SEA_CLEARINGS,
      // the cover cannon's plain (it is paddy; the town never builds over it: openGround)
      ...strip(CANNON_LINE, 3.4, -1e9, 2.0),
      // Kru Se: the palace and its stockade, the mosque, the tomb, the pits, the landing and the haul road
      [ISTANA[0] + 0.5, ISTANA[1] + 0.3, 3.2, -1e9],
      [KRUESE[0], KRUESE[1], 2.0, -1e9],
      [TOMB[0], TOMB[1], 1.0, -1e9],
      [PITS[0], PITS[1], 4.4, -1e9],
      [PITS[0] + 2.0, PITS[1] + 4.0, 3.4, -1e9],
      [LANDING[0], LANDING[1], 1.8, -1e9],
      ...strip(HAUL_PATH, 2.6, -1e9),
      // the ground east of the palace and the landing, where the camera looks from in the haul and the taken beats
      [ISTANA[0] + 4.4, ISTANA[1] - 1.0, 3.0, -1e9],
      [ISTANA[0] + 4.6, ISTANA[1] + 3.0, 3.0, -1e9],
      // the town's ground on both banks, cleared as the move begins (before the houses go up)
      ...Array.from({length: 7 * 8}, (_, k) => [-6.5 + (k % 7) * 2.6, -5.5 + Math.floor(k / 7) * 2.6, 2.0, 1788] as [number, number, number, number]),
      [CHABANG_TIGA[0], CHABANG_TIGA[1], 2.4, 1788],
      // the river's banks below the town, so the boats coming up are not hidden by trees
      ...strip(RIVER.filter((p) => p[1] < -2 && p[1] > -31), 1.4, 1700, 2.0),
      [CENTRAL_MOSQUE[0], CENTRAL_MOSQUE[1], 2.6, 1935],
      [PSU[0], PSU[1], 3.0, 1960],
    ],
    paddies: [1500, 1600],
    sites: [
      // the sea
      ...SEA_CLEARINGS.flatMap(([x, z]) => {
        const ring = (r: number) => [[r, 0], [-r, 0], [0, r], [0, -r], [r * 0.7, r * 0.7], [-r * 0.7, r * 0.7], [r * 0.7, -r * 0.7], [-r * 0.7, -r * 0.7]].every(([dx, dz]) => inSea(x + dx, z + dz));
        return ring(1.5) ? [[x, z, 1.45] as [number, number, number]] : ring(0.9) ? [[x, z, 0.8] as [number, number, number]] : [];
      }),
      ...strip(CANNON_LINE, 2.4, 0, 2.0).map(([x, z, r]) => [x, z, r] as [number, number, number]),
      [KRUESE[0], KRUESE[1], 1.7],
      [TOMB[0], TOMB[1], 0.7],
      [ISTANA[0] + 0.5, ISTANA[1] + 0.3, 2.9],
      [PITS[0], PITS[1], 2.0],
      [LANDING[0], LANDING[1], 1.0],
      [PILLAR[0], PILLAR[1], 0.6],
      [SHRINE[0], SHRINE[1], 1.0],
      [CHABANG_TIGA[0], CHABANG_TIGA[1], 2.0],
      [CENTRAL_MOSQUE[0], CENTRAL_MOSQUE[1], 2.4],
      [CENTRAL_MOSQUE[0], CENTRAL_MOSQUE[1] + 3.4, 0.6],
      [PSU[0], PSU[1], 1.5],
    ],
    footprints: SHOPS.map(([x, z], j) => ({fp: {rect: [x, z, 1.7, 0.8] as [number, number, number, number]}, from: 1830, label: `Anoru shophouse ${j}`})),
    openGround: [
      // the plain the cover's cannon lies on and the payoff's cannon stands on again
      {x0: CANNON_AT[0] - 14, x1: CANNON_AT[0] + 14, z0: CANNON_AT[1] - 4.5, z1: CANNON_AT[1] + 4.5},
      // Kru Se's mosque and old palace ground (the archaeological site)
      {x0: ISTANA[0] - 2.4, x1: KRUESE[0] + 1.6, z0: ISTANA[1] - 2.4, z1: KRUESE[1] + 1.4},
    ],
    urban: {from: 1955, rate: 0.25},
    // the built-up land today: the town, Rusamilae and the campus to the north-west, the ribbon along ทล.42 out to Kru Se
    // and the villages round the bay's south shore (the cannon's plain stays open: openGround)
    urbanBox: {x0: -28, x1: 58, z0: -30, z1: 28},
    // a provincial town: a few taller blocks only
    sprawl: {height: 0.5, tall: 0.04},
    highRise: 1990,
    towers: [],
    roads: [
      ...segs(NONGCHIK_RD, 0.6, 1880),
      ...segs(OLD_STREET, 0.6, 1913),
      ...segs(EAST_RD, 0.6, 1930),
      ...segs(HWY42, 0.8, 1950, 0.3),
      ...segs(RD_410, 0.7, 1955),
      ...segs(RD_418, 0.7, 1955),
      ...segs(SAMAKKHI_RD, 0.6, 1960),
      ...segs(NORTH_RD, 0.6, 1962),
      ...segs(PSU_RD, 0.6, 1968),
      ...segs(HWY43, 0.8, 1990),
    ],
    ringRoadYear: 1e9,
    cars: [1950, 2026],
    boats: [1700, 2026],
    finale: 'fireworks',
    life: {
      buffalo: [
        {x: -14, z: 22, r: 3, count: 4, from: 1570, to: 1980},
        {x: 20, z: 24, r: 3, count: 4, from: 1570, to: 1990},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: PattaniLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_pattani.wav',
  sky: {
    top: [
      [1570, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1570, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1570, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.3 * (1 - Math.min(1, Math.max(0, (Y - 1790) / 80))),
  gloom: () => 0,
};
