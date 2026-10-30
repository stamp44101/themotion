// Throwaway style frames for Ratchaburi's cover (30 Oct 2026; docs/briefs/ratchaburi.md). A: a giant
// dragon jar is thrown on a wheel on the Mae Klong's west bank. At frame 0 the red clay is already
// spinning up out of a lump; it bellies into the jar by 1.2 s, the cream dragon coils up round it
// from the foot to the shoulder by 2.2 s, and the glaze darkens as the kiln fire takes at its foot.
// A1 legend scale (~30 units tall) on the whole tile; A2 smaller (~18) at the river's bend with
// jar boats going downstream. The Mae Klong is the OSM centreline (ratchaburi_onep/) at 80 m/unit,
// origin 13.5440, 99.8200 (the bend between Wat Mahathat and the 2360 wall).
import React from 'react';
import {KORAT} from '../cities/korat';
import {Jar, JarBoat} from '../cities/ratchaburi/jar';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const RIVER: P2[] = [
  [-6.9, -53.2], [-2.0, -44.8], [2.9, -33.6], [1.5, -29.2], [-0.6, -25.4], [-2.2, -22.5], [-2.9, -20.3],
  [-3.1, -17.8], [-2.7, -15.2], [-1.9, -13.0], [-0.9, -10.7], [-0.8, -7.9], [-1.9, -3.0], [-2.3, -0.8],
  [-1.5, 2.1], [0.5, 3.7], [13.5, 3.2], [23.4, 6.2], [30.4, 5.3], [33.6, 6.0], [36.5, 8.9], [38.2, 15.9],
  [40.0, 19.0], [42.0, 20.7], [53.7, 25.8], [58.1, 26.5], [60.3, 25.6], [61.9, 21.3], [61.8, 17.3],
];

/** point at distance s along the river from its upstream end, and the heading there */
const along = (s: number): [P2, number] => {
  let acc = 0;
  for (let i = 1; i < RIVER.length; i++) {
    const [ax, az] = RIVER[i - 1];
    const [bx, bz] = RIVER[i];
    const d = Math.hypot(bx - ax, bz - az);
    if (acc + d >= s) {
      const f = (s - acc) / d;
      return [[ax + (bx - ax) * f, az + (bz - az) * f], Math.atan2(bx - ax, bz - az)];
    }
    acc += d;
  }
  return [RIVER[RIVER.length - 1], 0];
};

const Boats: React.FC<{t: number}> = ({t}) => (
  <>
    {[0, 1, 2, 3].map((i) => {
      const [p, h] = along(36 + i * 6 + t * 1.6);
      return <JarBoat key={i} p={p} dir={h} />;
    })}
  </>
);

// the jar stands on the west bank south-west of the bend, in the open fields of the old town
const SITE: P2 = [-12, 12];
const SITE2: P2 = [-7, 9];

const AZ = 200;
const keys = (c: P2, h: number, d: [number, number, number], el: number) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1933, 1933.4],
        camera: [
          [0, c[0], h, c[1], d[0], AZ, el, 30],
          [3, c[0], h * 1.05, c[1], d[1], AZ + 8, el + 2, 30],
          [8, c[0], h * 1.1, c[1], d[2], AZ + 18, el + 5, 30],
        ],
      },
    ],
  });

const base = (id: string, L: React.FC<LandmarkProps>, c: P2, h: number, d: [number, number, number], el: number, clear: number): CityConfig => {
  const STORY = keys(c, h, d, el);
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ราชบุรี', sub: 'เมืองโอ่งมังกร ริมแม่กลอง'},
      finale: KORAT.story.finale,
      approxBefore: 1500,
    },
    layout: {
      ...KORAT.layout,
      peaks: [],
      rivers: [{path: RIVER, width: 1.8}],
      bridges: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      clearings: [[c[0], c[1], clear, -1e9]],
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

const A1: React.FC<LandmarkProps> = ({t}) => (
  <group position={[SITE[0], 0, SITE[1]]}>
    <Jar t={t} H={30} potters />
  </group>
);
const A2: React.FC<LandmarkProps> = ({t}) => (
  <>
    <group position={[SITE2[0], 0, SITE2[1]]}>
      <Jar t={t} H={18} potters />
    </group>
    <Boats t={t} />
  </>
);

export const RATCHABURI_A1 = base('ratchaburi-a1', A1, SITE, 14, [310, 320, 350], 26, 20);
export const RATCHABURI_A2 = base('ratchaburi-a2', A2, SITE2, 8, [230, 240, 270], 28, 13);
// a close study of the dragon relief on the cover's jar (rendered at ~3 s, the dragon drawn in)
export const RATCHABURI_DRAGON = base('ratchaburi-dragon', A1, SITE, 14, [125, 125, 125], 10, 20);
