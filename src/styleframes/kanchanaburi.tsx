// Throwaway style frames for Kanchanaburi's cover (3 Nov 2026; docs/briefs/kanchanaburi.md). A: a steam
// train crosses the Kwai bridge at legend scale, already on it at frame 0, smoke trailing, the Khwae Yai
// below; A1 bridge 30 units, A2 closer at 20. B: the bridge rises pier by pier over the river and the
// train arrives at 2 s. River and banks are placeholders until the layout lands.
import React from 'react';
import {KORAT} from '../cities/korat';
import {KwaiBridge, Smoke, SteamLoco, DECK} from '../cities/kanchanaburi/figures';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

const clamp = (u: number) => Math.max(0, Math.min(1, u));
const ease = (u: number) => {
  const c = clamp(u);
  return c * c * (3 - 2 * c);
};

const Hero: React.FC<{t: number; S: number; terrainH: LandmarkProps['terrainH']; rise?: boolean}> = ({t, S, terrainH, rise}) => {
  const y0 = Math.max(terrainH(-S / 2 - 2, 0), terrainH(S / 2 + 2, 0)) + 0.3;
  const grow = rise ? ease(t / 1.9) : 1;
  const T0 = rise ? 2.0 : 0;
  const u = -0.2 + (t - T0) * 0.4; // loco position along the bridge (bridge lengths)
  const on = !rise || t >= T0;
  return (
    <group position={[-S / 2, y0, 0]} scale={S}>
      <KwaiBridge grow={grow} />
      {on && (
        <group position={[u, DECK + 0.007, 0]} scale={0.22}>
          <SteamLoco wagons={3} t={t} />
          <group position={[0.62, 0.3, 0]}>
            <Smoke t={t} speed={1} />
          </group>
        </group>
      )}
    </group>
  );
};

const AZ = 330;
const keys = (S: number, d: [number, number, number], el: number) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1850, 1850.4],
        camera: [
          [0, 0, S * 0.3, 0, d[0], AZ, el, 30],
          [3, 0, S * 0.32, 0, d[1], AZ + 8, el + 2, 30],
          [8, 0, S * 0.34, 0, d[2], AZ + 18, el + 5, 30],
        ],
      },
    ],
  });

const base = (id: string, S: number, d: [number, number, number], el: number, rise = false): CityConfig => {
  const STORY = keys(S, d, el);
  const L: React.FC<LandmarkProps> = ({t, terrainH}) => <Hero t={t} S={S} terrainH={terrainH} rise={rise} />;
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'กาญจนบุรี', sub: 'ที่ที่แม่น้ำสองสายมาพบกัน'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      peaks: [[-44, -30, 7, 9], [42, -34, 6, 8], [-40, 34, 5, 7]],
      rivers: [{path: [[0, -70], [3, -30], [0, 0], [-3, 30], [0, 70]], width: 26}],
      bridges: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      clearings: [[0, 0, 0.8 * S, -1e9]],
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

export const KANCH_A1 = base('kanch-a1', 60, [290, 300, 330], 24);
export const KANCH_A2 = base('kanch-a2', 44, [210, 220, 250], 24);
export const KANCH_B = base('kanch-b', 60, [290, 300, 330], 24, true);
