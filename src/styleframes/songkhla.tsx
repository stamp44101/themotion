// Throwaway style frames for Songkhla's cover (15 Nov 2026; docs/briefs/songkhla_research.md). The rules from experiments
// §17-§20: the symbol stands on the whole land tile at legend scale at second 0; it is half made by hand at frame 0 (no blank
// canvas) and changes shape, not only colour.
// A1 (cloud's pick): หนังตะลุง, the puppet อ้ายเท่ง (modelled on a man of Ban Khu Khut, Sathing Phra, Songkhla). A giant
// cowhide puppet stands on its rod in a banana trunk on the spit; at frame 0 its top half is already cut and perforated (light
// shines through the holes), the bottom half is still the rough hide; a chisel and mallet cut it free row by row until
// CUT_END; the scrap falls away, then the puppet comes alive: the jointed arm swings up and points his long finger, the body
// sways on its rod.
// A2: นางเงือกทอง. A giant mermaid on the rocks at Samila; at frame 0 the tail and the rock are modelled in clay and the upper
// body is still a rough lump; a spatula shapes the lump into the torso, head, hair and arms; the clay turns to gold from the
// rock up; then she combs her hair.
// The tile is the real map (100 m/unit, origin the city pillar; src/cities/songkhla/places.ts): the town's sand spit between
// the Gulf of Thailand (east) and ทะเลสาบสงขลา (west), the Singora hills across the channel, Ko Yo in the south-west corner.
import React from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {KHAO_DAENG, KHAO_KHIAO, KHAO_MUEANG, KHAO_NOI, KO_YO, MERMAID, TANG_KUAN, TILE, WATER_CLEARINGS} from '../cities/songkhla/places';
import {AiTeng, Mermaid, TwoWaters} from '../cities/songkhla/Hero';

type P2 = [number, number];

const AZ = 14;

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
        year: [1600, 1600.4],
        camera: [
          [0, target[0], target[1], target[2], d[0], AZ, el, 30],
          [3, target[0], target[1] * 1.06, target[2], d[1], AZ + 7, el + 2, 30],
          [8, target[0], target[1] * 1.12, target[2], d[2], AZ + 16, el + 5, 30],
        ],
      },
    ],
  });

const base = (id: string, Hero: React.FC<{t: number}>, at: P2, rotY: number, target: [number, number, number], d: [number, number, number], el: number, clear: number): CityConfig => {
  const STORY = keys(target, d, el);
  const L: React.FC<LandmarkProps> = ({t}) => (
    <group>
      <TwoWaters />
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สงขลา', sub: 'เมืองสองทะเล ริมปากทะเลสาบ'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      tile: TILE,
      peaks: [
        [KHAO_DAENG[0], KHAO_DAENG[1], 2.4, 4.6],
        [KHAO_NOI[0], KHAO_NOI[1], 1.3, 3.0],
        [KHAO_MUEANG[0], KHAO_MUEANG[1], 1.6, 3.4],
        [TANG_KUAN[0], TANG_KUAN[1], 1.3, 2.2],
        [KHAO_KHIAO[0], KHAO_KHIAO[1], 1.4, 3.0],
        [KO_YO[0], KO_YO[1], 2.0, 4.0],
      ],
      rivers: [],
      bridges: [],
      noMoat: true,
      noWall: true,
      city: {hx: 2, hz: 2, moat: [3000, 3001], wall: [3000, 3001], gates: [3000, 3001], groundFrom: 3000},
      gates: [],
      houses: {built: [3000, 10], modern: [3000, 10], keepOut: []},
      villages: {centers: [], built: [3000, 3010]},
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

const rad = (deg: number) => (deg * Math.PI) / 180;
// A1: the puppet ~61 units from the trunk to the crown, standing on the spit facing the camera
export const SONGKHLA_A1 = base('songkhla-a1', ({t}) => <AiTeng t={t} H={50} />, [4, -2], rad(AZ), [-7, 24, -3], [345, 352, 375], 34, 12);
// A2: the mermaid ~45 units high on the rocks at Samila
export const SONGKHLA_A2 = base('songkhla-a2', ({t}) => <Mermaid t={t} S={62} />, [MERMAID[0] - 3, MERMAID[1] + 3], rad(AZ + 15), [-6, 16, -10], [345, 352, 375], 34, 9);
