// Throwaway style frames for Khon Kaen's opening hero (docs/briefs/khonkaen.md): which big
// thing stands on the whole tile at frame 0 (docs/experiments.md: the hero must read from the
// whole-tile shot). Geography is provisional until issue #46.
import React from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import {lathe} from '../engine/parts';
import type {CityConfig, LandmarkProps} from '../engine/types';

const STORY = buildStory({
  duration: 60,
  before: -2e8,
  after: 2026,
  camera: [],
  beats: [
    {
      id: 'open',
      t: [0, 8],
      year: [-1.3e8, -1.29e8],
      camera: [
        [0, 0, 1, 0, 330, 135, 34, 30],
        [3, 0, 3, 2, 130, 145, 32, 30],
        [6, 0, 3, 2, 90, 160, 32, 30],
      ],
    },
  ],
});

// a long-necked sauropod (Phuwiangosaurus), mother and calf walking round the lake
const Sauropod: React.FC<{t: number; s: number; ph: number; color: string}> = ({t, s, ph, color}) => {
  const a = ph + t * 0.12;
  const x = Math.cos(a) * 13;
  const z = Math.sin(a) * 9 + 2;
  const step = Math.sin(t * 4 + ph);
  const m = <meshStandardMaterial color={color} flatShading roughness={0.9} />;
  return (
    <group position={[x, 0, z]} rotation-y={-a} scale={s}>
      <mesh position={[0, 2.1, 0]} scale={[2.2, 1.05, 1.15]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        {m}
      </mesh>
      <mesh position={[2.4, 3.6, 0]} rotation-z={-0.75} castShadow>
        <cylinderGeometry args={[0.25, 0.55, 3.6, 7]} />
        {m}
      </mesh>
      <mesh position={[3.75, 5.0, 0]} scale={[0.55, 0.32, 0.36]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        {m}
      </mesh>
      <mesh position={[-3.3, 1.6, 0]} rotation-z={1.4} castShadow>
        <coneGeometry args={[0.5, 3.8, 7]} />
        {m}
      </mesh>
      {[[1.2, 0.6], [1.2, -0.6], [-1.2, 0.6], [-1.2, -0.6]].map(([lx, lz], j) => (
        <mesh key={j} position={[lx, 0.8, lz]} rotation-z={step * 0.25 * (j % 3 === 0 ? 1 : -1)} castShadow>
          <cylinderGeometry args={[0.3, 0.26, 1.7, 7]} />
          {m}
        </mesh>
      ))}
    </group>
  );
};
const DinoHero: React.FC<LandmarkProps> = ({t}) => (
  <>
    <Sauropod t={t} s={4.4} ph={0} color="#c8642e" />
    <Sauropod t={t} s={2.4} ph={-0.6} color="#d9a441" />
  </>
);

// พระธาตุขามแก่น's legend: the dead tamarind stump that sprouted, drawn huge, a small white
// chedi at its foot
const TamarindHero: React.FC<LandmarkProps> = ({t}) => {
  const sway = Math.sin(t * 0.8) * 0.03;
  return (
    <group position={[0, 0, 2]} scale={5.6}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.5, 2.8, 8]} />
        <meshStandardMaterial color="#5b3a22" flatShading />
      </mesh>
      {[[-0.9, 3.2, 0.2, 1.4], [0.9, 3.4, -0.3, 1.5], [0, 4.0, 0.4, 1.6], [0.2, 3.1, -0.9, 1.2], [-0.3, 3.0, 1.0, 1.2]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} rotation-z={sway} scale={[r, r * 0.7, r]} castShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={i % 2 ? '#8fbf3a' : '#a6cf4a'} flatShading />
        </mesh>
      ))}
      <mesh position={[1.4, 0, 0.9]} geometry={lathe([[0, 0], [0.45, 0], [0.45, 0.2], [0.32, 0.25], [0.3, 0.6], [0.18, 0.9], [0.08, 1.4], [0, 1.6]], 10)} castShadow>
        <meshStandardMaterial color="#f3efe6" emissive="#ffd27a" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
};

// พระมหาธาตุแก่นนคร: nine tiers, white and gold, on the lake shore
const StupaHero: React.FC<LandmarkProps> = () => (
  <group position={[0, 0, 2]} scale={2.2}>
    {Array.from({length: 9}, (_, i) => {
      const w = 6 - i * 0.55;
      return (
        <mesh key={i} position={[0, 0.5 + i * 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, 1.0, w]} />
          <meshStandardMaterial color={i % 2 ? '#f4efe3' : '#e9e1cf'} />
        </mesh>
      );
    })}
    <mesh position={[0, 9.0, 0]} geometry={lathe([[0, 0], [1.1, 0], [1.0, 0.6], [0.6, 1.4], [0.3, 2.4], [0.12, 4.0], [0, 4.6]], 12)} castShadow>
      <meshStandardMaterial color="#e2b33c" metalness={0.6} roughness={0.3} />
    </mesh>
  </group>
);

const base = (Landmarks: React.FC<LandmarkProps>): CityConfig => ({
  ...KORAT,
  id: 'khonkaen-style',
  story: {
    captions: [],
    eras: [],
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ขอนแก่น', sub: 'จากแผ่นดินไดโนเสาร์ สู่มหานครแห่งอีสาน'},
    finale: KORAT.story.finale,
    approxBefore: 1650,
  },
  layout: {
    ...KORAT.layout,
    // the Khorat plateau is flat; ภูเวียง's ring of hills far west
    peaks: [
      [-46, -10, 7, 8],
      [-44, 6, 6, 7],
    ],
    // บึงแก่นนคร, provisional
    rivers: [{path: [[-14, -4], [-6, -9], [4, -8], [8, -2], [4, 4], [-6, 5], [-14, -4]], closed: true, width: 4}],
    bridges: [],
    rail: undefined,
    trains: [],
    clearings: [[0, 2, 20, -1e9]],
    sites: [[0, 2, 8]],
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

export const KHONKAEN_DINO = base(DinoHero);
export const KHONKAEN_TAMARIND = base(TamarindHero);
export const KHONKAEN_STUPA = base(StupaHero);
