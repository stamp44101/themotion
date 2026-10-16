import React from 'react';
import {lathe} from '../../engine/parts';
import {ramp, smooth} from '../../lib';
import type {LandmarkProps} from '../../engine/types';

// World positions from Google Maps / UNESCO via scripts/geo.mjs (origin = old-town centroid
// 8.41680, 99.96438, 80 m/unit). See docs/briefs/nakhonsi.md §5a.
export const CHEDI: [number, number] = [2.5, 7.4];
export const NORTH_GATE: [number, number] = [-1.1, -15.0];
export const HO_PHRA_ISUAN: [number, number] = [-0.9, -10.2];
export const HO_PHRA_NARAI: [number, number] = [-0.2, -10.4];
export const PHUTTHASIHING: [number, number] = [-1.0, -3.2];

// The great chedi is ~55 m (0.7 unit) tall in reality; it is the clip's hero, so it is drawn
// at ~9 units, the way Korat's dinosaurs are. Lanka bell profile: square-ish base tiers,
// bell, harmika, ringed spire.
const BASE: [number, number][] = [
  [0, 0], [2.6, 0], [2.6, 0.5], [2.2, 0.5], [2.2, 1.0], [1.9, 1.0], [1.9, 1.4],
];
const BELL: [number, number][] = [
  [0, 1.4], [1.9, 1.4], [2.0, 1.8], [1.95, 2.6], [1.7, 3.3], [1.25, 3.85], [0.7, 4.15], [0, 4.25],
];
const SPIRE: [number, number][] = [
  [0, 4.2], [0.62, 4.2], [0.62, 4.75], [0.45, 4.75], [0.42, 5.2], [0.34, 5.4], [0.3, 5.9],
  [0.22, 6.2], [0.18, 6.8], [0.1, 7.6], [0.05, 8.4], [0, 8.9],
];
const baseGeo = lathe(BASE, 16);
const bellGeo = lathe(BELL, 24);
const spireGeo = lathe(SPIRE, 12);

const Chedi: React.FC<{k: number; lanka: number; night: number}> = ({k, lanka, night}) => (
  <group position={[CHEDI[0], 0, CHEDI[1]]} scale={[1.3, 1.3 * Math.max(0.001, k), 1.3]}>
    {/* the older, smaller Srivijaya-era stupa inside, replaced by the Lanka bell */}
    <group scale={1 - 0.15 * (1 - lanka)}>
      <mesh geometry={baseGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#efece4" roughness={0.75} />
      </mesh>
      <mesh geometry={bellGeo} castShadow>
        <meshStandardMaterial color="#f6f4ee" roughness={0.6} />
      </mesh>
      <mesh geometry={spireGeo} scale={[1, lanka, 1]} castShadow>
        <meshStandardMaterial color="#e2b33c" metalness={0.7} roughness={0.3} emissive="#ffcf6a" emissiveIntensity={night * 0.6} />
      </mesh>
    </group>
    {/* cloister wall around the chedi court (comes with the Lanka rebuild) */}
    {lanka > 0.02 && [
      [0, -3.6, 7.6, 0.5],
      [0, 3.6, 7.6, 0.5],
      [-3.6, 0, 0.5, 7.6],
      [3.6, 0, 0.5, 7.6],
    ].map(([x, z, w, d], i) => (
      <mesh key={i} position={[x, 0.45 * lanka, z]} scale={[1, lanka, 1]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.9, d]} />
        <meshStandardMaterial color="#8e3a2c" roughness={0.8} />
      </mesh>
    ))}
  </group>
);

export const NakhonSiLandmarks: React.FC<LandmarkProps> = ({Y, night}) => {
  // a first stupa from the legend onward, the Lanka bell ~13th century (attributed)
  const k = smooth(ramp(Y, 280, 300));
  const lanka = smooth(ramp(Y, 1200, 1240));
  return <Chedi k={k} lanka={lanka} night={night} />;
};
