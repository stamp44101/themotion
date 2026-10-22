// Throwaway style frames for Ubon's opening hero (docs/briefs/ubon.md §3a): which big, moving
// thing stands on the whole tile at frame 0. Korat's walking dinosaurs are the only opening that
// beat the baseline (docs/experiments.md). Geography is provisional: the Mun drawn straight
// across the tile until the workstation brings its real centreline.
import React from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import {Elephant, lathe} from '../engine/parts';
import {Person} from '../cities/phuket/figures';
import type {CityConfig, LandmarkProps} from '../engine/types';

const STORY = buildStory({
  duration: 60,
  before: -2000,
  after: 2026,
  camera: [],
  beats: [
    {
      id: 'open',
      t: [0, 8],
      year: [-1000, -999],
      camera: [
        [0, 0, 1, 2, 330, 135, 34, 30],
        [3, 0, 2, 3, 120, 148, 32, 30],
        [6, 0, 2, 3, 80, 160, 31, 30],
      ],
    },
  ],
});

// แม่น้ำมูล across the tile, provisional
const MUN: [number, number][] = [[-48, -3], [-32, 0], [-16, -1], [0, 3], [14, 5], [30, 3], [48, 0]];
const MUN_W = 5;
const munZ = (x: number) => {
  for (let i = 0; i < MUN.length - 1; i++) {
    const [x0, z0] = MUN[i], [x1, z1] = MUN[i + 1];
    if (x >= x0 && x <= x1) return z0 + ((z1 - z0) * (x - x0)) / (x1 - x0);
  }
  return MUN[MUN.length - 1][1];
};

// 1. ผาแต้ม's painted fish, alive: red ochre with the cream "X-ray" spine and ribs of the
// paintings at ผาขาม, swimming up the Mun at hero scale and leaping in turn
const OCHRE = '#b8452a';
const BONE = '#f3e2c4';
const PaintedFish: React.FC<{t: number; s: number; ph: number; x0: number}> = ({t, s, ph, x0}) => {
  const x = ((x0 + t * 2.4 + 60) % 120) - 60;
  const z = munZ(x) + Math.sin(ph * 3) * 0.8;
  const leap = Math.sin(t * 0.9 + ph);
  const y = Math.max(0, leap) * 0.9 * s - 0.1 * s;
  const pitch = Math.cos(t * 0.9 + ph) * (leap > 0 ? 0.7 : 0);
  const sway = Math.sin(t * 6 + ph) * 0.18;
  const ribs = Array.from({length: 8}, (_, i) => -0.7 + i * 0.19);
  return (
    <>
    {leap > -0.2 && leap < 0.35 && (
      <mesh position={[x, 0.15, z]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.35 * s, 0.55 * s, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} toneMapped={false} />
      </mesh>
    )}
    <group position={[x, y, z]} rotation-y={sway} rotation-z={pitch} scale={s}>
      <mesh scale={[1.0, 0.38, 0.26]} castShadow>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color={OCHRE} roughness={0.85} />
      </mesh>
      {/* the forked tail and the fins */}
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[-1.12, sd * 0.16, 0]} rotation-z={-sd * 0.55} castShadow>
          <boxGeometry args={[0.5, 0.16, 0.05]} />
          <meshStandardMaterial color={OCHRE} />
        </mesh>
      ))}
      <mesh position={[0, 0.38, 0]} rotation-z={-0.2} castShadow>
        <boxGeometry args={[0.6, 0.18, 0.03]} />
        <meshStandardMaterial color={OCHRE} />
      </mesh>
      {/* X-ray bones on both flanks: spine, ribs, the eye */}
      {[-1, 1].map((sd) => {
        const zs = (x: number) => sd * (0.26 * Math.sqrt(Math.max(0, 1 - x * x)) + 0.012);
        return (
          <group key={sd}>
            <mesh position={[-0.05, 0.02, zs(0)]}>
              <boxGeometry args={[1.55, 0.035, 0.012]} />
              <meshBasicMaterial color={BONE} toneMapped={false} />
            </mesh>
            {ribs.map((rx) => (
              <mesh key={rx} position={[rx, 0.02, zs(rx)]}>
                <boxGeometry args={[0.03, 0.62 * Math.sqrt(Math.max(0, 1 - rx * rx)), 0.012]} />
                <meshBasicMaterial color={BONE} toneMapped={false} />
              </mesh>
            ))}
            <mesh position={[0.78, 0.1, zs(0.78) * 0.9]}>
              <sphereGeometry args={[0.06, 10, 8]} />
              <meshBasicMaterial color={BONE} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
    </>
  );
};
const FishHero: React.FC<LandmarkProps> = ({t}) => (
  <>
    <PaintedFish t={t} s={8} ph={1.2} x0={-2} />
    <PaintedFish t={t} s={6} ph={-0.4} x0={-16} />
    <PaintedFish t={t} s={5} ph={-2.6} x0={10} />
  </>
);

// 2. ต้นเทียนพรรษา at hero scale: a carved candle tree in orange-gold wax on its float, nagas at
// the front corners, pulled along the north bank by a file of people
const WAX = '#e7a33c';
const WAX_DARK = '#b8741f';
const CandleHero: React.FC<LandmarkProps> = ({t, terrainH}) => {
  const x = -6 + t * 1.3;
  const z = munZ(x) - 8;
  return (
    <group>
      <group position={[x, terrainH(x, z), z]} scale={2.4}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 1, 3]} />
          <meshStandardMaterial color="#8a2d1e" />
        </mesh>
        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[3.6, 0.6, 2.4]} />
          <meshStandardMaterial color={WAX_DARK} roughness={0.5} />
        </mesh>
        <mesh
          position={[0, 1.6, 0]}
          geometry={lathe([[0, 0], [1.1, 0], [1.2, 0.4], [0.9, 0.9], [1.0, 1.6], [0.75, 2.2], [0.8, 3.0], [0.55, 3.6], [0.6, 4.4], [0.35, 5.0], [0.38, 5.8], [0.18, 6.4], [0.06, 7.0], [0, 7.2]], 18)}
          castShadow
        >
          <meshStandardMaterial color={WAX} roughness={0.45} metalness={0.15} />
        </mesh>
        {/* carved bands */}
        {[0.9, 2.2, 3.6, 5.0].map((y, i) => (
          <mesh key={y} position={[0, 1.6 + y, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.95 - i * 0.18, 0.09, 8, 24]} />
            <meshStandardMaterial color={WAX_DARK} />
          </mesh>
        ))}
        {/* nagas rearing at the front corners */}
        {[-1, 1].map((sd) => (
          <group key={sd} position={[1.9, 1.6, sd * 0.95]}>
            <mesh position={[0, 0.9, 0]} rotation-z={-0.35} castShadow>
              <cylinderGeometry args={[0.16, 0.24, 1.8, 8]} />
              <meshStandardMaterial color={WAX} />
            </mesh>
            <mesh position={[0.35, 1.9, 0]} rotation-z={-1.1} castShadow>
              <coneGeometry args={[0.32, 0.8, 8]} />
              <meshStandardMaterial color={WAX} />
            </mesh>
          </group>
        ))}
      </group>
      {Array.from({length: 12}, (_, i) => {
        const px = x + 7 + (i >> 1) * 1.8;
        const pz = z + ((i & 1) * 2 - 1) * 1.6;
        return (
          <group key={i} position={[px, terrainH(px, pz), pz]} rotation-y={Math.PI / 2} scale={2.2}>
            <Person t={0} i={i} />
          </group>
        );
      })}
    </group>
  );
};

// 3. Elephants from the Pha Taem panel, walking down to drink at the Mun
const ElephantHero: React.FC<LandmarkProps> = ({t, terrainH}) => (
  <>
    {[
      {x: -4, s: 5.2, ph: 0, c: '#7d7a76'},
      {x: 6, s: 4.4, ph: 1.3, c: '#8a8580'},
      {x: 1, s: 2.6, ph: 2.2, c: '#928d87'},
    ].map(({x, s, ph, c}) => {
      const z = munZ(x) - 14 + Math.min(t * 1.1, 9) - (s < 3 ? 2 : 0);
      return (
        <group key={x} position={[x, terrainH(x, z), z]} scale={s}>
          <Elephant step={Math.sin(t * 3 + ph)} color={c} />
        </group>
      );
    })}
  </>
);

const base = (Landmarks: React.FC<LandmarkProps>): CityConfig => ({
  ...KORAT,
  id: 'ubon-style',
  story: {
    captions: [],
    eras: [],
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'อุบลราชธานี', sub: 'เมืองดอกบัวริมฝั่งมูล'},
    finale: KORAT.story.finale,
    approxBefore: 1650,
  },
  layout: {
    ...KORAT.layout,
    peaks: [],
    rivers: [{path: MUN, width: MUN_W}],
    bridges: [],
    rail: undefined,
    trains: [],
    // open banks along the Mun so the hero is not lost in the canopy
    clearings: [
      [0, 2, 16, -1e9],
      [12, -4, 10, -1e9],
    ],
    sites: [[0, 2, 6]],
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

export const UBON_FISH = base(FishHero);
export const UBON_CANDLE = base(CandleHero);
export const UBON_ELEPHANT = base(ElephantHero);
