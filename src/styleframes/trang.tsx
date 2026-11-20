// Throwaway style frames for Trang's cover (18 Nov 2026; docs/briefs/trang_research.md). The rules from experiments §17-§20:
// the symbol stands on the whole land tile at legend scale at second 0; it is half made by hand at frame 0 and changes shape.
// A1 (cloud's pick): ยางพารา. A giant rubber tree on the land between the Trang river and the railway's line; at frame 0 the
// tapping panel is half used and today's cut half made; the knife runs on along the spiral, the latex wells up white, runs
// down to the spout and fills the cup.
// A2: หมูย่างเมืองตรัง. A giant whole pig on its spit over a brick pit of coals, half its skin already crackled red-brown; it
// turns and the crackling spreads round it; smoke rises.
// B: พะยูน. A dugong mother and calf grazing the seagrass in the sea off the Trang mouth (Ko Libong drawn closer), leaving a
// bare trail; the mother surfaces and breathes.
// The tile is the real map (200 m/unit, origin the city pillar at Khuan Thani; src/cities/trang/places.ts): the river winding
// down to the estuary at Kantang and the sea at the south-west.
import React from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {Dugongs, RoastPig, RubberTree, Waters} from '../cities/trang/Hero';
import {RIVER, RIVER_W, TILE, WATER_CLEARINGS} from '../cities/trang/places';

type P2 = [number, number];
const AZ = 2;

const keys = (target: [number, number, number], d: [number, number, number], el: number) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1800, 1800.4],
        camera: [
          [0, target[0], target[1], target[2], d[0], AZ, el, 30],
          [3, target[0], target[1] * 1.04, target[2], d[1], AZ + 6, el + 1, 30],
          [8, target[0], target[1] * 1.1, target[2], d[2], AZ + 16, el + 4, 30],
        ],
      },
    ],
  });

const base = (id: string, Hero: React.FC<{t: number}>, at: P2, rotY: number, target: [number, number, number], d: [number, number, number], el: number, clear: number): CityConfig => {
  const STORY = keys(target, d, el);
  const L: React.FC<LandmarkProps> = ({t}) => (
    <group>
      <Waters />
      <group position={[at[0], 0, at[1]]} rotation-y={rotY}>
        <Hero t={t} />
      </group>
    </group>
  );
  return {
    ...KORAT,
    id,
    look: 'shader',
    story: {
      captions: [],
      eras: [],
      yearAt: STORY.yearAt,
      beat: STORY.beat,
      beats: STORY.beats,
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ตรัง', sub: 'ถิ่นกำเนิดยางพารา ริมแม่น้ำตรัง'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      tile: TILE,
      peaks: [],
      rivers: [{path: RIVER, width: RIVER_W}],
      bridges: [],
      noMoat: true,
      noWall: true,
      city: {hx: 2, hz: 2, moat: [3000, 3001], wall: [3000, 3001], gates: [3000, 3001], groundFrom: 3000},
      gates: [],
      houses: {built: [3000, 10], modern: [3000, 10], keepOut: []},
      villages: {centers: [[0, 0], [-24, 62]], built: [1700, 1750]},
      forestCity: 3000,
      rail: undefined,
      trains: [],
      clearings: [...WATER_CLEARINGS, [at[0], at[1], clear, -1e9]],
      paddies: [3000, 3010],
      urban: {from: 3000, rate: 1},
      sites: [],
      openGround: [],
      roads: [],
      towers: [],
      life: undefined,
      cameraKeys: STORY.cameraKeys,
    },
    Landmarks: L,
    callouts: [],
    actors: [],
    gloom: () => 0,
    ambient: () => 0.25,
  };
};

// legend scale: the tree ~56 units tall on the land between the river and the line
export const TRANG_A1 = base('trang-a1', ({t}) => <RubberTree t={t} S={60} />, [6, 30], 0.5, [3, 24, 33], [400, 405, 420], 34, 10);
// A2: the pig ~36 units long on its spit
export const TRANG_A2 = base('trang-a2', ({t}) => <RoastPig t={t} S={64} />, [6, 30], 0.35, [3, 16, 33], [400, 405, 420], 34, 22);
// B: the mother dugong ~26 units long in the sea at the south-west
export const TRANG_B = base('trang-b', ({t}) => <Dugongs t={t} S={13} />, [-31, 90.5], 1.9, [3, 10, 33], [400, 405, 420], 34, 0);
