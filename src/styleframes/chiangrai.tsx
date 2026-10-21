// Throwaway style frames for Chiang Rai's cover hero (docs/briefs/chiangrai.md §3a, owner's
// pick A): วัดร่องขุ่น at hero scale on the whole tile at frame 0, the hands of the cycle of
// rebirth rising out of the pit in front of it. Geography is provisional until issue #54
// (the Kok along the north, ดอยจอมทอง west of the centre).
import React from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {WhiteTemple} from '../cities/chiangrai/WhiteTemple';

const story = (camera: [number, number, number, number, number, number, number, number][]) =>
  buildStory({duration: 60, before: 400, after: 2026, camera: [], beats: [{id: 'open', t: [0, 8], year: [500, 501], camera}]});

const base = (camera: Parameters<typeof story>[0], at: [number, number], s: number, rot = 0): CityConfig => {
  const STORY = story(camera);
  const Landmarks: React.FC<LandmarkProps> = ({t}) => <WhiteTemple t={t} at={at} s={s} rot={rot} />;
  return {
    ...KORAT,
    id: 'chiangrai-style',
    story: {
      captions: [],
      eras: [],
      yearAt: STORY.yearAt,
      beat: STORY.beat,
      beats: STORY.beats,
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เชียงราย', sub: 'เหนือสุดในสยาม เมืองศิลปะริมน้ำกก'},
      finale: KORAT.story.finale,
      approxBefore: 1650,
    },
    layout: {
      ...KORAT.layout,
      // ดอยจอมทอง, a low hill on the Kok's south bank west of the centre; the Thai-Myanmar range
      // behind to the north-west
      peaks: [
        [-13, -6.5, 2.2, 1.6],
        [-42, -40, 9, 9],
        [-16, -46, 7, 8],
        [-46, -14, 6, 8],
      ],
      // แม่น้ำกก along the north of the town, provisional (~140 m)
      rivers: [{path: [[-48, -8], [-30, -9.5], [-14, -8.6], [0, -10.2], [14, -11], [30, -9], [48, -10]], width: 1.8}],
      bridges: [],
      rail: undefined,
      trains: [],
      clearings: [[at[0], at[1] + 2.8 * s, 10 * s, -1e9]],
      sites: [[at[0], at[1] + 2 * s, 8 * s]],
      openGround: [],
      roads: [],
      towers: [],
      cameraKeys: STORY.cameraKeys,
    },
    Landmarks,
    callouts: [],
    actors: [],
    gloom: () => 0,
  };
};

// Every variant opens on the whole tile (the series' cover: a green tile with one standout
// thing on it, owner); the hero is made big by its own scale, not by the camera. The camera
// only drifts under the title and pushes in after it (3 s).
// 1: front-on from the south, the bridge and the hands toward the viewer, the Kok behind
export const CHIANGRAI_FRONT = base(
  [
    [0, 0, 1, 4, 330, 0, 36, 30],
    [3, 0, 1, 5, 290, 4, 35, 30],
    [6, 0, 3, 10, 120, 10, 31, 30],
  ],
  [0, 4],
  2.4,
);
// 2: three-quarter from the south-west, the golden building and the Kok beyond
export const CHIANGRAI_QUARTER = base(
  [
    [0, 0, 1, 4, 330, -35, 36, 30],
    [3, 0, 1, 5, 290, -30, 35, 30],
    [6, -1, 3, 9, 120, -22, 31, 30],
  ],
  [0, 4],
  2.4,
  -0.45,
);
// 3: higher, so the pool, the bridge and the hands read as a plan on the tile
export const CHIANGRAI_CLOSE = base(
  [
    [0, 0, 1, 4, 330, 12, 46, 30],
    [3, 0, 1, 5, 290, 14, 44, 30],
    [6, 0, 3, 11, 120, 16, 36, 30],
  ],
  [0, 4],
  2.4,
  0.15,
);
