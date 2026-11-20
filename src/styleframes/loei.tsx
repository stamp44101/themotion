// Throwaway style frames for Loei's cover (20 Nov 2026; docs/briefs/loei_research.md part 2). The rules from experiments
// §17-§20: the symbol is half made by hand at frame 0 on the whole land tile at legend scale, and changes shape.
// A1 (lead's and cloud's pick): หน้ากากผีตาโขน. A giant Phi Ta Khon on the valley floor north-east of Dan Sai: the coconut-frond
// face carved but bare, the rice-steamer basket half woven; the basket is woven up, the long nose grows out, the paint runs
// down behind a brush, the eyes open and it starts to dance.
// A2: พระธาตุศรีสองรัก. The stupa at legend scale, half built at frame 0; its tiers drop into place to the lotus-bud spire and
// the gilded lantern.
// Dan Sai from the real map (src/cities/loei/places.ts): ลำน้ำหมัน, ห้วยน้ำศอก, the hills from Esri hillshade.
import React from 'react';
import {KORAT} from '../cities/korat';
import {COVER_AZ, HERO_AT, MAN, MAN_W, PEAKS, SOK, SOK_W, TILE} from '../cities/loei/places';
import {PhiTaKhon, Stupa} from '../cities/loei/hero';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

const keys = (target: number, d: [number, number, number], el: number) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1700, 1700.4],
        camera: [
          [0, HERO_AT[0] - 4, target, HERO_AT[1] + 4, d[0], COVER_AZ, el, 30],
          [3, HERO_AT[0] - 4, target * 1.06, HERO_AT[1] + 4, d[1], COVER_AZ + 6, el + 1, 30],
          [8, HERO_AT[0] - 4, target * 1.12, HERO_AT[1] + 4, d[2], COVER_AZ + 14, el + 4, 30],
        ],
      },
    ],
  });

const base = (id: string, Hero: React.FC<{t: number}>, target: number, d: [number, number, number], el: number, clear: number): CityConfig => {
  const STORY = keys(target, d, el);
  const L: React.FC<LandmarkProps> = ({t}) => (
    <group position={[HERO_AT[0], 0, HERO_AT[1]]} rotation-y={(COVER_AZ * Math.PI) / 180}>
      <Hero t={t} />
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เลย', sub: 'ผีตาโขน ด่านซ้าย'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      tile: TILE,
      peaks: PEAKS,
      rivers: [
        {path: MAN, width: MAN_W},
        {path: SOK, width: SOK_W},
      ],
      bridges: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      clearings: [[HERO_AT[0], HERO_AT[1], clear, -1e9]],
      sites: [],
      openGround: [],
      roads: [],
      towers: [],
      cameraKeys: STORY.cameraKeys,
    },
    Landmarks: L,
    callouts: [],
    actors: [],
    gloom: () => 0,
  };
};

// A1: the Phi Ta Khon ~44 units from the ground to the basket's rim (legend scale on the ~80-unit tile)
export const LOEI_A1 = base('loei-a1', ({t}) => <PhiTaKhon t={t} S={44} />, 20, [300, 305, 330], 34, 12);
// A2: the stupa, base 22 units, ~40 tall
export const LOEI_A2 = base('loei-a2', ({t}) => <Stupa w={22} k={0.5 + 0.5 * Math.min(1, Math.max(0, t / 2.4))} t={t} />, 18, [300, 305, 330], 34, 14);
