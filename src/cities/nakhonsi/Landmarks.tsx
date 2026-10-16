import React from 'react';
import {lathe, Viharn} from '../../engine/parts';
import {ramp, smooth} from '../../lib';
import type {LandmarkProps} from '../../engine/types';

// World positions from Google Maps / UNESCO via scripts/geo.mjs (origin = old-town centroid
// 8.41680, 99.96438, 80 m/unit). See docs/briefs/nakhonsi.md §5a.
export const CHEDI: [number, number] = [2.5, 7.4];
export const NORTH_GATE: [number, number] = [-1.1, -15.0];
export const HO_PHRA_ISUAN: [number, number] = [-0.9, -10.2];
export const HO_PHRA_NARAI: [number, number] = [-0.2, -10.4];
export const PHUTTHASIHING: [number, number] = [-1.0, -3.2];
// 1988 mudslide: a channel of bare mud down Khao Luang's east face toward the plain
export const SLIDE: [number, number][] = Array.from({length: 16}, (_, i) => [-40.5 + i * 0.9, -6 + i * 0.3 + Math.sin(i * 1.3) * 0.5]);

// The great chedi is ~55 m (0.7 unit) tall; it is the clip's hero, so it is drawn ~8x tall.
// It cannot be drawn 8x wide: it stands 115 m (1.4 units) inside the east wall of a town only
// 456 m across, and the first draft's cloister ran through that wall. So the footprint stays
// near real (base r ~1, cloister half 1.1) and the height goes into the spire, which is how the
// real one reads anyway: a modest white bell under a very tall gilded spire.
const S = 0.42;
const SPIRE_Y = 2.0;
const BASE: [number, number][] = [
  [0, 0], [2.3, 0], [2.3, 0.5], [2.05, 0.5], [2.05, 1.0], [1.9, 1.0], [1.9, 1.4],
];
const BELL: [number, number][] = [
  [0, 1.4], [1.9, 1.4], [2.0, 1.8], [1.95, 2.6], [1.7, 3.3], [1.25, 3.85], [0.7, 4.15], [0, 4.25],
];
const SPIRE: [number, number][] = [
  [0, 0], [0.62, 0], [0.62, 0.55], [0.45, 0.55], [0.42, 1.0], [0.34, 1.2], [0.3, 1.7],
  [0.22, 2.0], [0.18, 2.6], [0.1, 3.4], [0.05, 4.2], [0, 4.7],
];
const baseGeo = lathe(BASE, 16);
const bellGeo = lathe(BELL, 24);
const spireGeo = lathe(SPIRE, 12);
const CLOISTER = 2.7;

const Chedi: React.FC<{k: number; lanka: number; night: number}> = ({k, lanka, night}) => (
  <group position={[CHEDI[0], 0, CHEDI[1]]} scale={[S, S * Math.max(0.001, k), S]}>
    {/* the older, smaller Srivijaya-era stupa inside, replaced by the Lanka bell */}
    <group scale={1 - 0.15 * (1 - lanka)}>
      <mesh geometry={baseGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#efece4" roughness={0.75} />
      </mesh>
      <mesh geometry={bellGeo} castShadow>
        <meshStandardMaterial color="#f6f4ee" roughness={0.6} />
      </mesh>
      <mesh geometry={spireGeo} position={[0, 4.2, 0]} scale={[1, SPIRE_Y * (0.35 + 0.65 * lanka), 1]} castShadow>
        <meshStandardMaterial color="#e2b33c" metalness={0.7} roughness={0.3} emissive="#ffcf6a" emissiveIntensity={night * 0.6} />
      </mesh>
    </group>
    {/* วิหารคด: the roofed gallery round the chedi court (comes with the Lanka rebuild) */}
    {lanka > 0.02 && [
      [0, -CLOISTER, 2 * CLOISTER + 0.5, 0.5],
      [0, CLOISTER, 2 * CLOISTER + 0.5, 0.5],
      [-CLOISTER, 0, 0.5, 2 * CLOISTER + 0.5],
      [CLOISTER, 0, 0.5, 2 * CLOISTER + 0.5],
    ].map(([x, z, w, d], i) => (
      <mesh key={i} position={[x, 0.6 * lanka, z]} scale={[1, lanka, 1]} castShadow receiveShadow>
        <boxGeometry args={[w, 1.2, d]} />
        <meshStandardMaterial color="#8e3a2c" roughness={0.8} />
      </mesh>
    ))}
  </group>
);

const Slide: React.FC<{Y: number; terrainH: LandmarkProps['terrainH']}> = ({Y, terrainH}) => {
  const k = smooth(ramp(Y, 1988.12, 1988.3));
  if (k <= 0) return null;
  // mud first, then scrub greens it over the following decades
  const g = ramp(Y, 1995, 2026);
  const color = g > 0.5 ? '#7d7a45' : g > 0.15 ? '#806444' : '#7a5636';
  return (
    <>
      {SLIDE.map(([x, z], i) => (
        <mesh key={i} position={[x, terrainH(x, z) + 0.05, z]} rotation-y={0.35 * Math.sin(i)} scale={[k, 1, k]} receiveShadow>
          <boxGeometry args={[2.8 - i * 0.06, 0.3, 1.8]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}
    </>
  );
};

export const NakhonSiLandmarks: React.FC<LandmarkProps> = ({Y, night, terrainH}) => {
  // a first stupa from the legend onward, the Lanka bell ~13th century (attributed)
  const k = smooth(ramp(Y, 280, 300));
  const lanka = smooth(ramp(Y, 1180, 1215));
  // the Ho Phra halls: shrines of great age, but the halls standing today are later
  // rebuilds of unknown date -- shown from the late Ayutthaya town on (approximate)
  const ho = smooth(ramp(Y, 1690, 1700));
  return (
    <>
      <Chedi k={k} lanka={lanka} night={night} />
      <Slide Y={Y} terrainH={terrainH} />
      <Viharn pos={[HO_PHRA_ISUAN[0], 0, HO_PHRA_ISUAN[1]]} k={ho} scale={0.32} />
      <Viharn pos={[HO_PHRA_NARAI[0], 0, HO_PHRA_NARAI[1]]} k={ho} scale={0.32} />
      <Viharn pos={[PHUTTHASIHING[0], 0, PHUTTHASIHING[1]]} k={ho} scale={0.42} />
    </>
  );
};
