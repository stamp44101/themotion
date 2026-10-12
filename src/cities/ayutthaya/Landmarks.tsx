import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {lerp, mix, ramp, smooth} from '../../lib';
import {Elephant, Prang, SmallChedi, Viharn, lathe, prism} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';

export const SANPHET: [number, number] = [-8, -4];
export const MAHATHAT: [number, number] = [2, -1];
export const RATCHABURANA: [number, number] = [5, -4.5];
export const CHAIWAT: [number, number] = [-26, 6];
export const PALACE: [number, number] = [-11, -7.4];
export const BATTLE: [number, number] = [-32, -26];
export const BUDDHA_HEAD: [number, number, number] = [5.8, 0.35, 3.0];
export const PORTUGUESE: [number, number] = [-9, 19];
export const JAPANESE: [number, number] = [1, 20.5];
export const DUTCH: [number, number] = [10, 18.5];

const FALL = 1767;
const BRICK = '#9a6a52';

// Ceylonese bell-shaped chedi (Wat Phra Si Sanphet style)
const BELL_CHEDI: [number, number][] = [
  [0, 0], [1.6, 0], [1.6, 0.35], [1.35, 0.4], [1.35, 0.7], [1.2, 0.75], [1.3, 1.1], [1.25, 1.7], [1.0, 2.2], [0.55, 2.5],
  [0.5, 2.85], [0.32, 2.9], [0.3, 3.2], [0.2, 3.3], [0.16, 4.2], [0.08, 4.9], [0, 5.1],
];

const BellChedi: React.FC<{pos: [number, number, number]; k: number; ruin: number}> = ({pos, k, ruin}) => {
  const geo = useMemo(() => lathe(BELL_CHEDI, 12), []);
  if (k < 0.02) return null;
  return (
    <mesh geometry={geo} position={pos} scale={[1, k * lerp(1, 0.82, ruin), 1]} castShadow receiveShadow>
      <meshStandardMaterial color={mix('#ece6da', '#8f8378', ruin)} roughness={0.85} flatShading />
    </mesh>
  );
};

const SMOKE = new Array(16).fill(0).map((_, i) => ({
  x: (random(`asx${i}`) - 0.5) * 28,
  z: (random(`asz${i}`) - 0.5) * 16,
  ph: random(`asp${i}`),
}));

const Smoke: React.FC<{t: number; k: number; n: number}> = ({t, k, n}) => (
  <>
    {SMOKE.slice(0, n).map((s, i) =>
      new Array(5).fill(0).map((_, j) => {
        const age = (t * 0.6 + s.ph + j * 0.2) % 1;
        return (
          <mesh key={`${i}-${j}`} position={[s.x + age * 1.5, 1 + age * 10, s.z - age]} scale={(0.7 + age * 2) * k}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={j === 0 ? '#ff8a3a' : '#5d5752'}
              emissive={j === 0 ? '#ff6a1a' : '#000000'}
              emissiveIntensity={j === 0 ? 1.4 : 0}
              transparent
              opacity={0.75 * (1 - age)}
              flatShading
            />
          </mesh>
        );
      }),
    )}
  </>
);

export const AyutthayaLandmarks: React.FC<LandmarkProps> = ({Y, t, night}) => {
  const ruin = ramp(Y, FALL, FALL + 0.6);
  const lit = night * ramp(Y, 1991, 1995); // floodlit ruins today
  const glow = (base: number) => base * (1 - ruin) * 0.3 + lit * 0.9;
  const japRoof = useMemo(() => prism(1.2, 0.7, 1.4), []);
  const churchRoof = useMemo(() => prism(2.0, 1.0, 3.2), []);

  const palace = smooth(ramp(Y, 1350.6, 1351.8));
  const chedi = (y: number) => smooth(ramp(Y, y, y + 4));
  const mahathat = smooth(ramp(Y, 1374, 1384));
  const ratcha = smooth(ramp(Y, 1424, 1432));
  const chaiwat = smooth(ramp(Y, 1630, 1636));
  const foreign = smooth(ramp(Y, 1545, 1610)) * (1 - ramp(Y, FALL, FALL + 15));
  const firstFall = ramp(Y, 1568.8, 1569.1) * (1 - ramp(Y, 1569.6, 1570.4));
  const fall = ramp(Y, FALL - 0.2, FALL) * (1 - ramp(Y, FALL + 0.5, FALL + 1.2));
  const roots = ramp(Y, 1790, 1830);

  // the elephant duel (1592): two war elephants charge, one turns away
  const duel = ramp(Y, 1588.6, 1589) * (1 - ramp(Y, 1593.6, 1594));
  const charge = smooth(ramp(Y, 1590.0, 1591.6));
  const ruinColor = (c: string) => mix(c, BRICK, ruin);

  return (
    <>
      {/* Royal palace */}
      <Viharn pos={[PALACE[0], 0, PALACE[1]]} k={palace * lerp(1, 0.35, ruin)} scale={1.3} rot={Math.PI / 2} />
      <Viharn pos={[PALACE[0] + 3.4, 0, PALACE[1]]} k={palace * lerp(1, 0.35, ruin)} rot={Math.PI / 2} />

      {/* Wat Phra Si Sanphet: three bell chedis in a row, east → middle → west */}
      <BellChedi pos={[SANPHET[0] + 2.4, 0, SANPHET[1]]} k={chedi(1492)} ruin={ruin} />
      <BellChedi pos={[SANPHET[0], 0, SANPHET[1]]} k={chedi(1499)} ruin={ruin} />
      <BellChedi pos={[SANPHET[0] - 2.4, 0, SANPHET[1]]} k={chedi(1530)} ruin={ruin} />
      {lit > 0.02 && (
        <mesh position={[SANPHET[0], 3, SANPHET[1]]}>
          <sphereGeometry args={[5, 16, 12]} />
          <meshBasicMaterial color="#ffc070" transparent opacity={0.12 * lit} depthWrite={false} />
        </mesh>
      )}

      {/* Wat Mahathat and Wat Ratchaburana */}
      <Prang pos={[MAHATHAT[0], 0, MAHATHAT[1]]} k={mahathat * lerp(1, 0.62, ruin)} scale={1.5} color={ruinColor('#e2dccf')} />
      <SmallChedi pos={[MAHATHAT[0] + 3.2, 0, MAHATHAT[1] - 3.2]} scale={0.6} k={mahathat * lerp(1, 0.5, ruin)} color={ruinColor('#e9e2d6')} glow={glow(0.2)} />
      <SmallChedi pos={[MAHATHAT[0] - 3.2, 0, MAHATHAT[1] - 3.2]} scale={0.6} k={mahathat * lerp(1, 0.5, ruin)} color={ruinColor('#e9e2d6')} glow={glow(0.2)} />
      <Prang pos={[RATCHABURANA[0], 0, RATCHABURANA[1]]} k={ratcha * lerp(1, 0.85, ruin)} scale={1.25} color={ruinColor('#d8cfbf')} />

      {/* Buddha head embraced by tree roots (Wat Mahathat) */}
      {roots > 0.02 && (
        <group position={BUDDHA_HEAD}>
          <mesh position={[0, 0.05, 0]} scale={roots}>
            <sphereGeometry args={[0.32, 10, 8]} />
            <meshStandardMaterial color="#8d8a84" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0, 0.4, 0]} scale={roots}>
            <coneGeometry args={[0.12, 0.3, 6]} />
            <meshStandardMaterial color="#8d8a84" />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[Math.cos(i * 1.3) * 0.4, 0.5 + i * 0.12, Math.sin(i * 1.3) * 0.4]} rotation={[Math.sin(i) * 0.8, i, Math.cos(i) * 0.8]} scale={roots}>
              <cylinderGeometry args={[0.05, 0.09, 1.3, 5]} />
              <meshStandardMaterial color="#6b4a32" />
            </mesh>
          ))}
          <mesh position={[0.1, 1.9, 0.1]} scale={roots * 1.6}>
            <icosahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial color="#3f7d3a" flatShading />
          </mesh>
        </group>
      )}

      {/* Wat Chaiwatthanaram on the west bank */}
      {chaiwat > 0.02 && (
        <group position={[CHAIWAT[0], 0, CHAIWAT[1]]}>
          <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
            <boxGeometry args={[9, 0.6, 9]} />
            <meshStandardMaterial color={ruinColor('#c9b9a0')} roughness={1} />
          </mesh>
          <Prang pos={[0, 0.6, 0]} k={chaiwat * lerp(1, 0.9, ruin)} scale={1.9} color={ruinColor('#d9cbb4')} />
          {[
            [-3.2, -3.2],
            [3.2, -3.2],
            [-3.2, 3.2],
            [3.2, 3.2],
          ].map(([x, z], i) => (
            <Prang key={i} pos={[x, 0.6, z]} k={chaiwat * lerp(1, 0.8, ruin)} scale={0.8} color={ruinColor('#d6c8b0')} />
          ))}
          {lit > 0.02 && (
            <mesh position={[0, 4, 0]}>
              <sphereGeometry args={[7, 16, 12]} />
              <meshBasicMaterial color="#ffc070" transparent opacity={0.14 * lit} depthWrite={false} />
            </mesh>
          )}
        </group>
      )}

      {/* Foreign settlements outside the southern walls */}
      {foreign > 0.02 && (
        <>
          <group position={[PORTUGUESE[0], 0, PORTUGUESE[1]]} scale={[1, foreign, 1]}>
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[1.8, 1.4, 3]} />
              <meshStandardMaterial color="#f2efe6" />
            </mesh>
            <mesh geometry={churchRoof} position={[0, 1.4, 0]} castShadow>
              <meshStandardMaterial color="#a4442c" flatShading side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 1.6, 1.8]} castShadow>
              <boxGeometry args={[0.8, 3.2, 0.8]} />
              <meshStandardMaterial color="#f2efe6" />
            </mesh>
            <mesh position={[0, 3.4, 1.8]}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
              <meshStandardMaterial color="#3a3a36" />
            </mesh>
            <mesh position={[0, 3.5, 1.8]}>
              <boxGeometry args={[0.4, 0.1, 0.1]} />
              <meshStandardMaterial color="#3a3a36" />
            </mesh>
          </group>
          {[
            [-1.6, -1],
            [0, 0.4],
            [1.6, -0.8],
            [0.6, 1.8],
          ].map(([x, z], i) => (
            <group key={i} position={[JAPANESE[0] + x, 0, JAPANESE[1] + z]} scale={[1, foreign, 1]}>
              <mesh position={[0, 0.35, 0]} castShadow>
                <boxGeometry args={[1.0, 0.7, 1.2]} />
                <meshStandardMaterial color="#d9cdb4" />
              </mesh>
              <mesh geometry={japRoof} position={[0, 0.7, 0]} castShadow>
                <meshStandardMaterial color="#3a3a40" flatShading side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
          <group position={[DUTCH[0], 0, DUTCH[1]]} scale={[1, foreign, 1]}>
            <mesh position={[0, 1.0, 0]} castShadow>
              <boxGeometry args={[3, 2, 1.8]} />
              <meshStandardMaterial color="#9a4a32" />
            </mesh>
            <mesh position={[0, 2.25, 0]} castShadow>
              <boxGeometry args={[3.1, 0.5, 1.9]} />
              <meshStandardMaterial color="#3a2a24" />
            </mesh>
            <mesh position={[1.7, 2.6, 0]}>
              <boxGeometry args={[0.05, 1.2, 0.05]} />
              <meshStandardMaterial color="#3a2a24" />
            </mesh>
            <mesh position={[1.95, 3.0, 0]}>
              <boxGeometry args={[0.5, 0.32, 0.02]} />
              <meshStandardMaterial color="#e05a2a" />
            </mesh>
          </group>
        </>
      )}

      {/* 1592: the elephant duel on the plain north-west of the city */}
      {duel > 0.02 && (
        <>
          <group position={[BATTLE[0] - lerp(7, 1.4, charge), 0, BATTLE[1]]} rotation-y={Math.PI / 2} scale={duel * 1.3}>
            <Elephant step={Math.sin(t * 6)} howdah color="#8a8682" />
          </group>
          <group
            position={[BATTLE[0] + lerp(7, 1.4, charge) + ramp(Y, 1591.8, 1593) * 6, 0, BATTLE[1] + ramp(Y, 1591.8, 1593) * 3]}
            rotation-y={-Math.PI / 2 + ramp(Y, 1591.8, 1592.4) * 2.4}
            scale={duel * 1.3}
          >
            <Elephant step={Math.sin(t * 6 + 1)} howdah color="#6e6a66" />
          </group>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const age = (t * 0.8 + i / 6) % 1;
            return (
              <mesh key={i} position={[BATTLE[0] + (i - 2.5) * 1.6, 0.6 + age * 2, BATTLE[1] + Math.sin(i) * 1.5]} scale={(0.6 + age * 1.5) * duel * charge}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#c2ad8a" transparent opacity={0.5 * (1 - age)} flatShading />
              </mesh>
            );
          })}
        </>
      )}

      {firstFall > 0.02 && <Smoke t={t} k={firstFall} n={7} />}
      {fall > 0.02 && <Smoke t={t} k={fall} n={16} />}
    </>
  );
};
