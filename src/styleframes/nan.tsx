// Throwaway style frames for Nan's opening hero, A (owner, 25 Oct 2026; docs/briefs/nan.md §4):
// the naga race boat on the Nan from frame 0. A1, one boat coming down the river toward the
// camera (the settlers' boat from Pua in the 1902 beat); A2, three boats racing abreast (how
// the payoff would call it back). Geography is provisional: one river down the tile through
// forest, drawn wide enough to float the boats at hero scale.
import React from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {NanBoat} from './nanBoat';

type P2 = [number, number];
// north to south, the way the Nan flows
const RIVER: P2[] = [
  [20, -48],
  [13, -30],
  [5, -14],
  [-1, 0],
  [0, 14],
  [-6, 30],
  [-11, 48],
];
const WIDTH = 14;
const WATER_Y = 0.1;
const S = 2.4; // hero scale: a 16-unit boat drawn 38 units long

// position and heading at arc length s along the river
const LEN: number[] = [0];
for (let i = 1; i < RIVER.length; i++) LEN.push(LEN[i - 1] + Math.hypot(RIVER[i][0] - RIVER[i - 1][0], RIVER[i][1] - RIVER[i - 1][1]));
const at = (s: number, side: number): [number, number, number] => {
  // a softened polyline: blend the headings of neighbouring segments over 6 units
  const h = (q: number) => {
    let i = 1;
    while (i < LEN.length - 1 && LEN[i] < q) i++;
    const a = RIVER[i - 1];
    const b = RIVER[i];
    return Math.atan2(b[0] - a[0], b[1] - a[1]);
  };
  const head = Math.atan2(
    [-3, 0, 3].reduce((m, d) => m + Math.sin(h(s + d)), 0),
    [-3, 0, 3].reduce((m, d) => m + Math.cos(h(s + d)), 0),
  );
  let i = 1;
  while (i < LEN.length - 1 && LEN[i] < s) i++;
  const u = (s - LEN[i - 1]) / (LEN[i] - LEN[i - 1]);
  const x = RIVER[i - 1][0] + (RIVER[i][0] - RIVER[i - 1][0]) * u;
  const z = RIVER[i - 1][1] + (RIVER[i][1] - RIVER[i - 1][1]) * u;
  return [x + Math.cos(head) * side, z - Math.sin(head) * side, head];
};

const SPEED = 2.6;
const S0 = 40; // the bow just north of the tile centre at frame 0, under the title

const Boat: React.FC<{t: number; s0: number; side: number; speed: number; shirt: string; band: string; ph: number}> = ({t, s0, side, speed, shirt, band, ph}) => {
  const [x, z, head] = at(s0 + t * speed, side);
  return (
    <group position={[x, WATER_Y, z]} rotation-y={head} scale={S}>
      <NanBoat t={t + ph} shirt={shirt} band={band} />
    </group>
  );
};

const SoloHero: React.FC<LandmarkProps> = ({t}) => <Boat t={t} s0={S0} side={0} speed={SPEED} shirt="#f1c232" band="#b0261c" ph={0} />;

const RaceHero: React.FC<LandmarkProps> = ({t}) => (
  <>
    <Boat t={t} s0={S0} side={0} speed={SPEED} shirt="#f1c232" band="#b0261c" ph={0} />
    <Boat t={t} s0={S0 - 3} side={-4.4} speed={SPEED * 1.03} shirt="#d83a2e" band="#1d4f91" ph={0.37} />
    <Boat t={t} s0={S0 - 6} side={4.4} speed={SPEED * 1.06} shirt="#2f7fd0" band="#f1c232" ph={0.71} />
  </>
);

// the camera follows the hero boat: wide on the whole tile at 0, then down to it
const bow = (t: number) => at(S0 + t * SPEED, 0);
const [x3, z3] = bow(3);
const [x8, z8] = bow(8);
const STORY = buildStory({
  duration: 60,
  before: -2000,
  after: 2026,
  camera: [],
  beats: [
    {
      id: 'open',
      t: [0, 8],
      year: [1359, 1359.4],
      camera: [
        // camera to the south (azimuth from +z): the boat comes down the river toward it
        [0, 0, 2, 4, 340, 20, 38, 30],
        [3, x3, 3, z3, 170, 25, 30, 30],
        [8, x8, 4, z8, 110, 40, 22, 30],
      ],
    },
  ],
});

const base = (id: string, Landmarks: React.FC<LandmarkProps>): CityConfig => ({
  ...KORAT,
  id,
  story: {
    captions: [],
    eras: [],
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'น่าน', sub: 'เมืองที่ย้ายตามสายน้ำ'},
    finale: KORAT.story.finale,
    approxBefore: 1650,
  },
  layout: {
    ...KORAT.layout,
    peaks: [],
    rivers: [{path: RIVER, width: WIDTH}],
    bridges: [],
    noMoat: true,
    noWall: true,
    rail: undefined,
    trains: [],
    clearings: [],
    sites: [],
    openGround: [],
    roads: [],
    towers: [],
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks,
  callouts: [],
  actors: [],
  gloom: () => 0,
});

export const NAN_BOAT = base('nan-boat', SoloHero);
export const NAN_RACE = base('nan-race', RaceHero);
