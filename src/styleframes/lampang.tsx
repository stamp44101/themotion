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

// ------------------------------------------------------------------ carriage hero
// Owner's pick: the usual forest tile, with a Lampang horse carriage standing out on it from
// frame 0 the way Korat's dinosaurs did; the carriage comes back at its real size in the 1916
// railway beat. Hero scale, not real scale: it has to read from the whole-tile shot.
// รถม้าลำปาง: a horse and a canopied four-wheel carriage, red and white with flowers, at hero scale
const Carriage: React.FC<{t: number}> = ({t}) => {
  const step = Math.sin(t * 9);
  const wood = <meshStandardMaterial color="#8a2a22" flatShading roughness={0.8} />;
  const white = <meshStandardMaterial color="#f2ede4" flatShading roughness={0.8} />;
  const horse = <meshStandardMaterial color="#efe3cf" flatShading roughness={0.9} />;
  return (
    <group>
      {/* horse */}
      <group position={[1.7, 0, 0]}>
        <mesh position={[0, 0.95, 0]} scale={[0.75, 0.38, 0.3]} castShadow>
          <icosahedronGeometry args={[1, 1]} />
          {horse}
        </mesh>
        <mesh position={[0.75, 1.35, 0]} rotation-z={-0.8} castShadow>
          <cylinderGeometry args={[0.13, 0.2, 0.7, 6]} />
          {horse}
        </mesh>
        <mesh position={[1.05, 1.6, 0]} rotation-z={-0.3} scale={[0.36, 0.16, 0.15]} castShadow>
          <icosahedronGeometry args={[1, 0]} />
          {horse}
        </mesh>
        {[
          [0.45, 0.17],
          [0.45, -0.17],
          [-0.45, 0.17],
          [-0.45, -0.17],
        ].map(([lx, lz], j) => (
          <mesh key={j} position={[lx, 0.35, lz]} rotation-z={step * 0.35 * (j % 3 === 0 ? 1 : -1)} castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.7, 5]} />
            {horse}
          </mesh>
        ))}
      </group>
      {/* shafts */}
      {[-0.32, 0.32].map((z) => (
        <mesh key={z} position={[0.9, 0.75, z]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.4, 4]} />
          {wood}
        </mesh>
      ))}
      {/* carriage body and canopy */}
      <mesh position={[-0.2, 0.85, 0]} castShadow>
        <boxGeometry args={[1.3, 0.35, 0.8]} />
        {wood}
      </mesh>
      <mesh position={[-0.35, 1.55, 0]} castShadow>
        <boxGeometry args={[1.25, 0.08, 0.95]} />
        {white}
      </mesh>
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
        <mesh key={`${sx}${sz}`} position={[-0.35 + sx * 0.55, 1.22, sz * 0.4]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.65, 4]} />
          {white}
        </mesh>
      )))}
      {/* flowers along the canopy edge */}
      {[-0.8, -0.35, 0.1].map((x) => (
        <mesh key={x} position={[x, 1.62, 0.48]}>
          <icosahedronGeometry args={[0.07, 0]} />
          <meshStandardMaterial color="#ff5fa2" />
        </mesh>
      ))}
      {/* wheels */}
      {[
        [0.25, 0.45, 0.32],
        [-0.75, 0.55, 0.42],
      ].flatMap(([x, r, w]) => [-1, 1].map((sz) => (
        <mesh key={`${x}${sz}`} position={[x, r, sz * w]} castShadow>
          <torusGeometry args={[r, 0.05, 5, 14]} />
          <meshStandardMaterial color="#e2b04a" />
        </mesh>
      )))}
    </group>
  );
};

const CarriageHero: React.FC<LandmarkProps> = ({t, terrainH}) => {
  const x = HERO[0] - 8 + t * 1.6;
  const z = HERO[1] + 2;
  return (
    <group position={[x, terrainH(x, z), z]} rotation-y={-0.9} scale={8}>
      <Carriage t={t} />
    </group>
  );
};

export const LAMPANG_CARRIAGE = base(CarriageHero);

// side view of the street carriage, for checking the horse model
import {Carriage as CityCarriage} from '../cities/lampang/Landmarks';
const HorseTest: React.FC<LandmarkProps> = ({t, terrainH}) => (
  <group position={[0, terrainH(0, -20) + 0, -20]} scale={8}>
    <CityCarriage t={t} />
  </group>
);
export const LAMPANG_HORSE: CityConfig = {
  ...base(HorseTest),
  layout: {...base(HorseTest).layout, cameraKeys: [[0, 15, 7, -20, 90, 0, 10, 30], [2, 15, 7, -20, 90, 90, 18, 30], [4, 15, 7, -20, 90, 180, 18, 30], [6, 15, 7, -20, 90, 270, 18, 30], [8, 15, 7, -20, 90, 360, 30, 30]]},
};
