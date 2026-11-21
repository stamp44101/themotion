// Throwaway style frames for Samut Prakan's cover (20 Nov 2026; docs/briefs/samutprakan_research.md). The rules from
// experiments §17-§20: the symbol stands on the whole land tile at legend scale at second 0; it is half made by hand at frame 0
// (no blank canvas) and changes shape, not only colour.
// A (cloud's pick): พระสมุทรเจดีย์. A giant chedi on its island in the Chao Phraya; at frame 0 its lower half is laid in red
// brick inside a bamboo scaffold with workers on the planks; the courses go up, the whitewash sweeps up, the scaffold comes
// down and the spire shoots up (Rama IV made it taller). The city's own Hero.tsx.
// B: ช้างสามเศียร (the Erawan Museum, opened 2537: modern, kept only as the alternative). A giant copper three-headed elephant;
// at frame 0 its body and legs are plated, the heads still bare frames; the plates go on head by head, then the three trunks
// lift and the copper turns to its green patina.
// The tile is the real map (150 m/unit, origin the city pillar; src/cities/samutprakan/places.ts): the Chao Phraya, Pak Nam on
// its east bank, the mouth and the Gulf in the south.
import React from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {CHEDI, TILE, WATER_CLEARINGS} from '../cities/samutprakan/places';
import {GiantChedi, Water} from '../cities/samutprakan/Hero';

type P2 = [number, number];
const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
const AZ = 12;

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
        year: [1818, 1818.4],
        camera: [
          [0, target[0], target[1], target[2], d[0], AZ, el, 30],
          [3, target[0], target[1] * 1.04, target[2], d[1], AZ - 4, el, 30],
          [8, target[0], target[1] * 1.1, target[2], d[2], AZ - 10, el + 3, 30],
        ],
      },
    ],
  });

// ---------- B: the three-headed elephant, plated by hand ----------
const COPPER = '#b8673a';
const PATINA = '#4f9a86';
const FRAME = '#5a5a5a';
const Plate: React.FC<{on: boolean; c: string; children: React.ReactNode}> = ({on, c, children}) => (
  <mesh castShadow>
    {children}
    <meshStandardMaterial color={on ? c : FRAME} roughness={on ? 0.45 : 0.8} metalness={on ? 0.55 : 0.2} wireframe={!on} />
  </mesh>
);
const Erawan: React.FC<{t: number; S: number}> = ({t, S}) => {
  // heads plated at 0.6 / 1.2 / 1.8 s; trunks lift 2.0-2.8 s; the patina creeps 2.2-3.2 s
  const head = (i: number) => t >= 0.6 + i * 0.6;
  const lift = smooth((t - 2.0) / 0.8);
  const pat = smooth((t - 2.2) / 1.0);
  const c = pat > 0.5 ? PATINA : COPPER;
  return (
    <group>
      {/* the plinth (the museum's round building) */}
      <mesh position={[0, S * 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[S * 0.32, S * 0.34, S * 0.16, 32]} />
        <meshStandardMaterial color="#e9e2d0" roughness={0.8} />
      </mesh>
      <group position={[0, S * 0.16, 0]}>
        {/* the body and the four legs: plated at frame 0 */}
        <group position={[0, S * 0.38, 0]}>
          <Plate on c={c}>
            <sphereGeometry args={[S * 0.2, 24, 16]} />
          </Plate>
        </group>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
          <group key={i} position={[x * S * 0.1, S * 0.15, z * S * 0.12]}>
            <Plate on c={c}>
              <cylinderGeometry args={[S * 0.055, S * 0.06, S * 0.3, 14]} />
            </Plate>
          </group>
        ))}
        {/* the three heads, left, centre, right; each plated in turn, then its trunk lifts */}
        {[-1, 0, 1].map((s, i) => (
          <group key={i} position={[s * S * 0.13, S * 0.55, S * 0.2 - Math.abs(s) * S * 0.03]} rotation-y={s * 0.45}>
            <Plate on={head(i)} c={c}>
              <sphereGeometry args={[S * 0.09, 18, 12]} />
            </Plate>
            {[-1, 1].map((e) => (
              <group key={e} position={[e * S * 0.08, 0, -S * 0.02]} rotation-y={e * 0.3}>
                <Plate on={head(i)} c={c}>
                  <boxGeometry args={[S * 0.02, S * 0.1, S * 0.08]} />
                </Plate>
              </group>
            ))}
            <group position={[0, -S * 0.03, S * 0.07]} rotation-x={-0.2 - lift * 1.6}>
              <group position={[0, -S * 0.09, 0]}>
                <Plate on={head(i)} c={c}>
                  <cylinderGeometry args={[S * 0.018, S * 0.032, S * 0.2, 10]} />
                </Plate>
              </group>
            </group>
          </group>
        ))}
        {/* the gold howdah-spire on the back */}
        <mesh position={[0, S * 0.66, -S * 0.04]} castShadow>
          <coneGeometry args={[S * 0.05, S * 0.2, 8]} />
          <meshStandardMaterial color="#e0ac2c" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

const base = (id: string, Hero: React.FC<{t: number}>, at: P2, target: [number, number, number], d: [number, number, number], el: number, clear: number): CityConfig => {
  const STORY = keys([at[0] + target[0], target[1], at[1] + target[2]], d, el);
  const L: React.FC<LandmarkProps> = ({t}) => (
    <group>
      <Water silt={0} />
      <group position={[at[0], 0, at[1]]}>
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สมุทรปราการ', sub: 'เมืองปากน้ำ ประตูสู่สยาม'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      tile: TILE,
      peaks: [],
      rivers: [],
      bridges: [],
      noMoat: true,
      noWall: true,
      city: {hx: 2, hz: 2, moat: [3000, 3001], wall: [3000, 3001], gates: [3000, 3001], groundFrom: 3000},
      gates: [],
      houses: {built: [3000, 10], modern: [3000, 10], keepOut: []},
      villages: {centers: [[6, 16], [-20, 14], [10, 34]], built: [1700, 1710]},
      forestCity: 3000,
      rail: undefined,
      trains: [],
      clearings: [...WATER_CLEARINGS, [at[0], at[1], clear, -1e9]],
      paddies: [1700, 1710],
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

// A: the chedi ~44 units high on its island in the river
export const SAMUTPRAKAN_A = base('samutprakan-a', ({t}) => <GiantChedi t={t} S={56} keep />, CHEDI, [4, 19, 10], [345, 335, 345], 34, 6);
// B: the elephant ~40 units high on open ground north of Pak Nam (the museum is 3 km N of the pillar)
export const SAMUTPRAKAN_B = base('samutprakan-b', ({t}) => <Erawan t={t} S={52} />, [-1.5, -19], [3, 18, 18], [345, 335, 345], 34, 14);
