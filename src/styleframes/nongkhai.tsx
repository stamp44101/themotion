// Throwaway style frames for Nong Khai's cover (18 Nov 2026; docs/briefs/nongkhai.md). The rules from experiments §17-§20:
// the symbol fills ~1/3 of the frame at second 0 on the whole land tile at legend scale; it is half made by hand at frame 0
// (no blank canvas) and changes shape, not only colour. Both stand on the real map (the Mekong and Laos behind).
// A1 (cloud's pick): เรือยาวหัวพญานาค. A long boat dug from one log; at frame 0 its stern half is hollowed and painted, the
// bow half still a round log in bark; the adze front runs to the bow (chips fly) and the naga's head comes out of the block.
// A2: พญานาคปูนปั้น. A giant seven-headed concrete naga like Sala Kaew Ku's; the coils are cast at frame 0 and three heads
// stand, the other four are cast one by one on their rebar and the hood fans out.
import React from 'react';
import {NONGKHAI} from '../cities/nongkhai';
import {LongBoat} from '../cities/nongkhai/Boat';
import {BOAT_ROT, carveFront, headK} from '../cities/nongkhai/actors';
import {BOAT_AT, BOAT_S, MEKONG} from '../cities/nongkhai/places';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import * as THREE from 'three';

const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const shapeOf = (pts: [number, number][]) => {
  const sh = new THREE.Shape();
  pts.forEach(([x, z], i) => (i === 0 ? sh.moveTo(x, -z) : sh.lineTo(x, -z)));
  sh.closePath();
  return sh;
};
const MEKONG_SHAPE = shapeOf(MEKONG);
const Mekong: React.FC = () => (
  <mesh position={[0, 0.1 - 1.4, 0]} rotation-x={-Math.PI / 2} receiveShadow>
    <extrudeGeometry args={[MEKONG_SHAPE, {depth: 1.4, bevelEnabled: false}]} />
    <meshStandardMaterial color="#4f8f9e" roughness={0.12} metalness={0.25} />
  </mesh>
);

// ---------- A2: the concrete naga ----------
const CONCRETE = '#a9a49a';
const FRESH = '#c8c2b4';
const NAGA_HEADS = 7;
const headAt = (i: number) => (i < 3 ? -1 : 0.2 + (i - 3) * 0.42);
const ConcreteNaga: React.FC<{t: number; S: number}> = ({t, S}) => {
  const coils = 3;
  return (
    <group>
      {Array.from({length: coils}, (_, c) => (
        <mesh key={c} position={[0, S * (0.05 + c * 0.075), 0]} rotation-x={Math.PI / 2} castShadow>
          <torusGeometry args={[S * (0.26 - c * 0.05), S * 0.045, 10, 36]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, S * 0.42, -S * 0.04]} castShadow>
        <cylinderGeometry args={[S * 0.07, S * 0.09, S * 0.36, 12]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.95} />
      </mesh>
      {Array.from({length: NAGA_HEADS}, (_, i) => {
        const order = [3, 2, 4, 1, 5, 0, 6][i];
        const k = smooth((t - headAt(i)) / 0.35);
        const a = (order - 3) * 0.3;
        const p: [number, number, number] = [Math.sin(a) * S * 0.2, S * 0.62 + Math.cos(a) * S * 0.06, -S * 0.04 + Math.cos(a) * S * 0.03];
        return (
          <group key={i} position={p} rotation-z={-a}>
            {/* the rebar, then the cast neck and head */}
            {k < 1 &&
              [-1, 0, 1].map((s) => (
                <mesh key={s} position={[s * S * 0.012, S * 0.08, 0]}>
                  <cylinderGeometry args={[S * 0.003, S * 0.003, S * 0.2, 4]} />
                  <meshStandardMaterial color="#6a4a3a" />
                </mesh>
              ))}
            {k > 0.02 && (
              <group scale={[k, k, k]}>
                <mesh position={[0, S * 0.07, 0]} castShadow>
                  <capsuleGeometry args={[S * 0.025, S * 0.12, 4, 8]} />
                  <meshStandardMaterial color={k < 1 ? FRESH : CONCRETE} roughness={0.95} />
                </mesh>
                <mesh position={[0, S * 0.16, S * 0.025]} scale={[1, 0.75, 1.5]} castShadow>
                  <sphereGeometry args={[S * 0.035, 10, 8]} />
                  <meshStandardMaterial color={k < 1 ? FRESH : CONCRETE} roughness={0.95} />
                </mesh>
              </group>
            )}
            {k > 0.05 && k < 0.95 && (
              <group position={[0, S * 0.14, 0]}>
                {Array.from({length: 6}, (_, j) => {
                  const b = hash(i * 9 + j) * Math.PI * 2;
                  const u = (t * 3 + j * 0.17) % 1;
                  return (
                    <mesh key={j} position={[Math.cos(b) * S * 0.08 * u, S * 0.05 * u, Math.sin(b) * S * 0.08 * u]} scale={S * 0.008 * (1 - u)}>
                      <icosahedronGeometry args={[1, 0]} />
                      <meshBasicMaterial color="#e9e4d6" toneMapped={false} />
                    </mesh>
                  );
                })}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};

const keys = buildStory({
  duration: 60,
  before: 1820,
  after: 2026,
  camera: [],
  beats: [
    {
      id: 'open',
      t: [0, 8],
      year: [1822, 1822.4],
      camera: [
        [0, BOAT_AT[0] + 1, 6, BOAT_AT[1] - 6, 300, -8, 36, 30],
        [3, BOAT_AT[0] + 1, 5, BOAT_AT[1] - 6, 262, -4, 35, 30],
        [8, BOAT_AT[0] + 1, 5, BOAT_AT[1] - 6, 240, 4, 37, 30],
      ],
    },
  ],
});

const base = (id: string, Hero: React.FC<{t: number}>): CityConfig => {
  const L: React.FC<LandmarkProps> = ({t}) => (
    <group>
      <Mekong />
      <Hero t={t} />
    </group>
  );
  return {
    ...NONGKHAI,
    id,
    story: {...NONGKHAI.story, captions: [], eras: [], yearAt: keys.yearAt, beat: keys.beat, beats: keys.beats},
    layout: {...NONGKHAI.layout, cameraKeys: keys.cameraKeys},
    Landmarks: L,
    callouts: [],
    actors: [],
  };
};

export const NONGKHAI_A1 = base('nongkhai-a1', ({t}) => (
  <group position={[BOAT_AT[0], 0, BOAT_AT[1]]} rotation-y={BOAT_ROT}>
    <LongBoat L={BOAT_S} front={carveFront(t)} head={headK(t)} t={t} />
  </group>
));
export const NONGKHAI_A2 = base('nongkhai-a2', ({t}) => (
  <group position={[BOAT_AT[0], 0, BOAT_AT[1]]}>
    <ConcreteNaga t={t} S={46} />
  </group>
));
