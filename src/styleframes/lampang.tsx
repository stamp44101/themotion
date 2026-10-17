// Throwaway style frames for Lampang's opening (CLAUDE.md workflow step 1): which hero
// stands on the tile at frame 0. Korat's dinosaurs cut its skip rate from ~52% to 33%
// (docs/experiments.md). Geography here is provisional until issue #44 brings the ONEP
// outline and real pins; delete this file once src/cities/lampang exists.
import React from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import {Elephant, SmallChedi} from '../engine/parts';
import type {CityConfig, LandmarkProps} from '../engine/types';

const STORY = buildStory({
  duration: 60,
  before: 500,
  after: 2026,
  camera: [],
  beats: [
    {
      id: 'legend',
      t: [0, 8],
      year: [600, 700],
      camera: [
        [0, 0, 1, 0, 340, 135, 34, 30],
        [3, 6, 2, 2, 110, 150, 32, 30],
        [6, 6, 2, 2, 55, 160, 30, 30],
      ],
    },
  ],
});

const HERO: [number, number] = [6, 2];

// ช้างเผือกอัญเชิญพระแก้วมรกต: a white elephant carrying a gilded busabok with the green
// Emerald Buddha on top, walking slowly along the bank. Sized like Korat's dinosaurs (~17 units
// tall at frame 0's 340), not like a real elephant: it has to read from the whole-tile shot.
const ElephantHero: React.FC<LandmarkProps> = ({t, terrainH}) => {
  const x = HERO[0] + Math.sin(t * 0.25) * 3;
  const z = HERO[1] + t * 0.4;
  return (
    <group position={[x, terrainH(x, z), z]} rotation-y={0.3} scale={6}>
      <Elephant step={Math.sin(t * 3)} color="#ece6dc" />
      <group position={[0, 2.15, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.95, 0.3, 1.0]} />
          <meshStandardMaterial color="#b8322a" />
        </mesh>
        {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * 0.36, 0.45, sz * 0.38]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 5]} />
            <meshStandardMaterial color="#e2b04a" metalness={0.6} roughness={0.3} />
          </mesh>
        )))}
        <mesh position={[0, 0.42, 0]} castShadow>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial color="#2fbf6a" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow>
          <coneGeometry args={[0.6, 0.75, 4]} />
          <meshStandardMaterial color="#e2b04a" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

// a gilded Lanna bell chedi (Lampang Luang's silhouette), large on the tile
const ChediHero: React.FC<LandmarkProps> = ({terrainH}) => (
  <SmallChedi pos={[HERO[0], terrainH(HERO[0], HERO[1]), HERO[1]]} scale={3.2} k={1} color="#d9a43a" glow={0.15} />
);

const base = (Landmarks: React.FC<LandmarkProps>): CityConfig => ({
  ...KORAT,
  id: 'lampang-style',
  story: {
    captions: [],
    eras: [],
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ลำปาง', sub: 'เขลางค์นคร เมืองรถม้า'},
    finale: KORAT.story.finale,
    approxBefore: 1650,
  },
  layout: {
    ...KORAT.layout,
    // provisional: the Khun Tan range to the west, hills to the east, the Wang through the basin
    peaks: [
      [-44, -20, 12, 9],
      [-46, 12, 14, 10],
      [44, -30, 8, 8],
    ],
    rivers: [
      {
        path: [
          [-6, -48],
          [-2, -20],
          [-4, 6],
          [-14, 30],
          [-20, 48],
        ],
        width: 2.6,
      },
    ],
    bridges: [],
    rail: undefined,
    trains: [],
    clearings: [],
    sites: [[HERO[0], HERO[1], 6]],
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

export const LAMPANG_ELEPHANT = base(ElephantHero);
export const LAMPANG_CHEDI = base(ChediHero);
