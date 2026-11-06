import {GROUND} from '../../Scene';
import type {CityConfig} from '../../engine/types';
import {ChanthaburiLandmarks, ORCHARDS} from './Landmarks';
import {ACTORS, rowSpots} from './actors';
import {
  CATHEDRAL, COAST, ESTUARY, ESTUARY_W, FRENCH_HOUSE, GATE, LOWER, NW_PATH, KHAO_PLOI_WAEN, NOEN_WONG, PILLAR, RIVER, RIVER_W, SI_CHAN,
  SOUTH_ROAD, THA_LUANG, TILE, TOWER, TUEK_DAENG, WALL, WEST_FORT, WEST_ROAD,
} from './places';
import {STORY} from './timeline';

// World origin = the city pillar (places.ts), 100 m/unit, +x east, +z south. The engine's `city` is the Ban Lum laterite
// wall of Narai's reign (~1 x 2 km round today's ค่ายตากสิน, ONEP §5.2.1), built in the build beat and torn down in 2377
// (ruinStrength 1: nothing stands), when the town moves to Noen Wong; the houses inside empty then and come back in 2419.
// Its moat and south gate are drawn in Landmarks.tsx (the river is the east side). The ONEP old-town strip (the
// waterfront row, the cathedral across the river, the gem market) is drawn by hand on the river bend south-east of it.
// The Gulf fills the tile's south edge (Landmarks.tsx); the mouth, Noen Wong and Khao Ploi Waen are pulled in (places.ts).
type P = [number, number];
const segs = (pts: P[], width: number, year: number) => pts.slice(1).map((b, i) => ({from: pts[i], to: b, width, year}));
// the sea strip: kept clear of trees and of everything generated
const SEA_DISCS: [number, number, number][] = Array.from({length: 27}, (_, i) => [TILE.x0 + 1.5 + i * 3, (COAST + TILE.z1) / 2 - 0.4, 2.6]);

export const CHANTHABURI: CityConfig = {
  id: 'chanthaburi',
  look: 'shader',
  story: {
    captions: STORY.captions,
    eras: STORY.eras,
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'จันทบุรี', sub: 'เมืองพลอยริมแม่น้ำจันท์'},
    finale: {kicker: 'สมัยพระนารายณ์ – พ.ศ. 2569', title: 'จันทบุรี', sub: 'เมืองที่เจียระไนตัวเองมาสามร้อยปี'},
    approxBefore: 1700,
    duration: STORY.duration,
  },
  layout: {
    tile: TILE,
    peaks: [
      // Khao Ploi Waen (~150 m, drawn higher so it reads), the rise at Noen Wong, the hills east of the river
      [KHAO_PLOI_WAEN[0], KHAO_PLOI_WAEN[1], 5.4, 4.0],
      [NOEN_WONG[0], NOEN_WONG[1], 1.0, 6],
      [26, -15, 2.6, 6],
      [24, 20, 2.2, 7],
    ],
    rivers: [
      {path: RIVER, width: RIVER_W},
      {path: ESTUARY, width: ESTUARY_W},
    ],
    bridges: [],
    noMoat: true,
    city: {
      hx: 9,
      hz: 18.5,
      outline: WALL,
      moat: [1e9, 1e9],
      wall: [1658, 1666],
      gates: [1e9, 1e9],
      decay: [1834.06, 1834.3, 1e9, 1e9],
      ruinStrength: 1,
      groundFrom: 1658,
    },
    gates: [],
    trains: [],
    houses: {
      // the walled town fills under Narai, empties for Noen Wong in 2377 and fills again in 2419
      built: [1662, 24],
      abandon: {prob: 0.92, from: 1834.08, spread: 0.3, rebuild: 1876.06, rebuildSpread: 0.36},
      modern: [1950, 50],
      keepOut: [[FRENCH_HOUSE[0] + 0.4, FRENCH_HOUSE[1] + 0.2, 1.4], [PILLAR[0], PILLAR[1], 0.6], [GATE[0], GATE[1] - 1.2, 1.2]],
    },
    villages: {
      centers: [[-24, -18], [14, -20], [-26, 26], [10, 26], [26, 4], [-10, 40]],
      built: [1660, 26],
    },
    forestCity: 1657,
    clearings: [
      // the fields south of the wall, where the army stands in 2310
      [GATE[0], GATE[1] + 5.5, 6.5, 1660],
      ...SEA_DISCS.map(([x, z, r]) => [x, z, r + 0.6, -1e9] as [number, number, number, number]),
      [NOEN_WONG[0], NOEN_WONG[1], 4.8, 1834.1],
      [WEST_FORT[0], WEST_FORT[1], 1.8, 1834.1],
      [TUEK_DAENG[0] + 0.6, TUEK_DAENG[1], 2.2, 1834.1],
      // the old-town strip, and the lower river's banks (cleared while the town fills under Narai)
      [4.2, 6.4, 3.4, 1876.05],
      [6.6, 10.0, 2.8, 1876.05],
      ...LOWER.map(([x, z]) => [x, z, 2.8, 1680] as [number, number, number, number]),
      // the line the stones were carried along to Noen Wong
      ...NW_PATH.map(([x, z]) => [x, z, 2.4, 1680] as [number, number, number, number]),
      [CATHEDRAL[0] + 2.1, CATHEDRAL[1], 3.0, 1680],
      // the old-town strip on the river bend: cleared when the town comes back in 2419
      ...rowSpots.map((s) => [s.x, s.z, 1.1, 1876.05] as [number, number, number, number]),
      [2.6, 10.3, 2.6, 1906.5],
      // the river banks at the Ban Lum landing, cleared with the town under Narai
      ...[[6.5, 7.5], [5.1, 5.6], [4.5, 3.6], [4.9, 1.5], [5.3, -0.6], [6.2, -3.0], [7.4, -5.2]].map(([x, z]) => [x, z, 2.6, 1659] as [number, number, number, number]),
      ...ORCHARDS.map(([x, z, r]) => [x, z, r + 0.6, 1950] as [number, number, number, number]),
    ],
    paddies: [1658, 1688],
    sites: [
      ...SEA_DISCS,
      [CATHEDRAL[0] + 2.1, CATHEDRAL[1], 2.7],
      [3.7, 7.2, 0.8],
      [NOEN_WONG[0], NOEN_WONG[1], 4.2],
      [KHAO_PLOI_WAEN[0], KHAO_PLOI_WAEN[1], 2.0],
      [WEST_FORT[0], WEST_FORT[1], 1.4],
      [TUEK_DAENG[0] + 0.6, TUEK_DAENG[1], 1.6],
      [TOWER[0], TOWER[1], 0.6],
      ...ORCHARDS.map(([x, z, r]) => [x, z, r] as [number, number, number]),
    ],
    footprints: [
      {fp: {rect: [GATE[0], GATE[1], 2.0, 0.8]}, from: 1658, to: 1834.3, label: 'south gate', onWall: true},
      {fp: {rect: [FRENCH_HOUSE[0], FRENCH_HOUSE[1], 1.6, 0.9]}, from: 1893, label: 'French building'},
      ...rowSpots.map((s, j) => ({fp: {rect: [s.x, s.z, 0.75, 0.75] as [number, number, number, number]}, from: 1876, label: `waterfront house ${j}`})),
    ],
    // the gem market's street and the lot by the shrine stay open
    openGround: [{x0: SI_CHAN[0][0] - 0.2, x1: SI_CHAN[1][0] + 0.2, z0: SI_CHAN[0][1] - 1.0, z1: SI_CHAN[0][1] + 1.0}],
    urban: {from: 1945, rate: 0.7},
    urbanBox: {x0: -34, x1: 30, z0: -24, z1: 40},
    sprawl: {height: 0.65, tall: 0.04},
    highRise: 2000,
    towers: [],
    roads: [
      ...segs(SI_CHAN, 0.5, 1910),
      ...segs(THA_LUANG, 0.8, 1950),
      ...segs(WEST_ROAD, 0.9, 1960),
      ...segs(SOUTH_ROAD, 0.8, 1970),
    ],
    ringRoadYear: 1e9,
    cars: [1955, 2026],
    boats: [1e9, 1e9],
    finale: 'fireworks',
    life: {
      buffalo: [
        {x: -24, z: -16, r: 3, count: 5, from: 1660, to: 1985},
        {x: 14, z: 28, r: 3, count: 4, from: 1660, to: 1980},
      ],
    },
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: ChanthaburiLandmarks,
  callouts: STORY.callouts,
  actors: ACTORS,
  soundtrack: 'soundtrack_chanthaburi.wav',
  sky: {
    top: [
      [1600, '#5f9fcf'],
      [2026, '#4a8ed6'],
    ],
    bottom: [
      [1600, '#e6e2c4'],
      [1900, '#e2eed9'],
      [2026, '#d3e8f7'],
    ],
    ground: [[1600, '#a6a866'], ...GROUND],
  },
  // a forest-only opening reads dark: extra sky fill until the town is up (CLAUDE.md)
  ambient: (Y) => 0.35 * (1 - Math.min(1, Math.max(0, (Y - 1700) / 80))),
  gloom: () => 0,
};
