// Throwaway style frames for Phetchabun's cover, A (owner, 27 Oct 2026; docs/briefs/phetchabun.md
// §4): the Pa Sak turns into a whirlpool at วังมะขามแฟบ, golden water bursts up and the พระพุทธมหา
// ธรรมราชา rises out of it, slow and upright, a halo opening behind it. A1 at legend scale (14
// units tall), A2 smaller (9) with the camera closer. River from the workstation's OSM centreline
// (docs/briefs/phetchabun_onep/README.md) at 40 m/unit, origin the city pillar; the pool is drawn
// wide (high water) round the rite's site.
import React from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {Burst, Halo, MahaThammaracha, Ripples, Whirlpool} from './phetchabunBuddha';

type P2 = [number, number];
const m = (x: number, z: number): P2 => [x / 40, z / 40];
const RIVER: P2[] = [
  m(1343, -3669), m(1083, -3012), m(1126, -2679), m(1013, -2339), m(926, -1871), m(689, -1587), m(512, -1514), m(546, -1294),
  m(416, -1274), m(324, -1162), m(330, -924), m(249, -874), m(160, -907), m(179, -473), m(60, -427), m(38, -297), m(275, -220),
  m(418, -140), m(562, -190), m(732, -91), m(746, 122), m(683, 236), m(848, 226), m(970, 294), m(1031, 526), m(1055, 833),
  m(961, 972), m(926, 1137), m(1045, 1403), m(1192, 1444), m(1313, 1508), m(1246, 1706), m(1153, 1903),
];
// วังมะขามแฟบ, the rite's site (Google pin, README): on the bend below the north bridge
const POOL = m(325, -899);
const POOL_R = 4.5;

const rise = (t: number) => {
  const u = Math.min(1, Math.max(0, (t - 0.25) / 2.0));
  return u * u * (3 - 2 * u);
};

const Hero: React.FC<{t: number; H: number; face: number}> = ({t, H, face}) => {
  // the whirlpool is already turning at frame 0 (the cover is an event, experiments §8-9)
  const k = Math.min(1, 0.75 + t / 0.6);
  const u = rise(t);
  // the burst is already rising at frame 0, so the cover frame shows the event
  const burst = (t + 0.35) / 1.5;
  const halo = Math.min(1, Math.max(0, (t - 1.6) / 1.2));
  return (
    <group position={[POOL[0], 0, POOL[1]]}>
      {/* the deep pool at high water */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[POOL_R * 1.35, POOL_R * 1.35, 0.08, 40]} />
        <meshStandardMaterial color="#3f8fc0" roughness={0.12} metalness={0.25} />
      </mesh>
      <Whirlpool t={t} k={k * (1 - 0.6 * u)} r={POOL_R} />
      <Burst u={burst} r={POOL_R} />
      <Ripples t={t} t0={1.8} r={POOL_R} />
      {/* the image rises upright out of the water; it never spins */}
      {u > 0.01 && (
        <group position={[0, -H * 0.95 + u * (H * 0.95 + 0.25), 0]} rotation-y={face} scale={H}>
          <MahaThammaracha glow={0.25 * halo} />
          <Halo k={halo} />
        </group>
      )}
    </group>
  );
};

const AZ = 30;
const keys = (d0: number, d1: number, d2: number, y: number) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1557, 1557.4],
        camera: [
          [0, POOL[0], y, POOL[1], d0, AZ, 28, 30],
          [3, POOL[0], y * 1.6, POOL[1], d1, AZ + 6, 20, 30],
          [8, POOL[0], y * 1.6, POOL[1], d2, AZ + 16, 16, 30],
        ],
      },
    ],
  });

const base = (id: string, H: number, d: [number, number, number]): CityConfig => {
  const STORY = keys(d[0], d[1], d[2], H * 0.35);
  const L: React.FC<LandmarkProps> = ({t}) => <Hero t={t} H={H} face={(AZ * Math.PI) / 180} />;
  return {
    ...KORAT,
    id,
    story: {
      captions: [],
      eras: [],
      yearAt: STORY.yearAt,
      beat: STORY.beat,
      beats: STORY.beats,
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เพชรบูรณ์', sub: 'พระผุดจากสายน้ำป่าสัก'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      peaks: [],
      rivers: [{path: RIVER, width: 1.6}],
      bridges: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      clearings: [[POOL[0], POOL[1], POOL_R * 1.6, -1e9]],
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

export const PHETCHABUN_A1 = base('phetchabun-a1', 14, [105, 85, 66]);
export const PHETCHABUN_A2 = base('phetchabun-a2', 9, [80, 62, 50]);
