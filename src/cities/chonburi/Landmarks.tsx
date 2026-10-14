import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ramp} from '../../lib';
import {SmallChedi, Viharn, prism} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';

export const SRI_PHALO: [number, number] = [8.5, -31.0];
export const WAT_YAI: [number, number] = [0.0, -8.0];
export const TAKSIN_FLEET: [number, number] = [18.0, -19.0];
export const BANG_PLA_SOI_PIER: [number, number] = [10.0, -12.0];
export const ANG_SILA: [number, number] = [8.0, 5.0];
export const BUFFALO_RACE: [number, number] = [-7.0, -1.0];
export const KHAO_SAM_MUK: [number, number] = [8.5, 18.0];
export const BANG_SAEN: [number, number] = [7.0, 28.0];

const Jetty: React.FC<{length?: number}> = ({length = 7}) => (
  <group>
    <mesh position={[length / 2, 0.18, 0]} castShadow receiveShadow>
      <boxGeometry args={[length, 0.18, 0.8]} />
      <meshStandardMaterial color="#705039" roughness={0.95} />
    </mesh>
    {[0.4, 2.0, 3.6, 5.2, 6.7].filter((x) => x < length).map((x) => (
      <React.Fragment key={x}>
        <mesh position={[x, -0.05, -0.28]} castShadow><cylinderGeometry args={[0.07, 0.09, 0.8, 6]} /><meshStandardMaterial color="#443126" /></mesh>
        <mesh position={[x, -0.05, 0.28]} castShadow><cylinderGeometry args={[0.07, 0.09, 0.8, 6]} /><meshStandardMaterial color="#443126" /></mesh>
      </React.Fragment>
    ))}
  </group>
);

const FishingBoat: React.FC<{color: string}> = ({color}) => (
  <group rotation-y={Math.PI / 2}>
    <mesh position={[0, 0.12, 0]} scale={[1.3, 0.28, 0.42]} castShadow>
      <sphereGeometry args={[1, 12, 6]} />
      <meshStandardMaterial color={color} roughness={0.75} />
    </mesh>
    <mesh position={[0, 0.85, 0]} castShadow><cylinderGeometry args={[0.035, 0.05, 1.5, 6]} /><meshStandardMaterial color="#3a2b22" /></mesh>
    <mesh position={[0.38, 0.85, 0]} rotation-z={-0.5} castShadow>
      <planeGeometry args={[0.9, 1.0]} />
      <meshStandardMaterial color="#e8dcc0" side={THREE.DoubleSide} roughness={0.9} />
    </mesh>
  </group>
);

const SriPhaloPort: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k * 1.25}>
      <Jetty length={7.5} />
      <group position={[7.4, 0, -1.0]}><FishingBoat color="#69412c" /></group>
      <group position={[8.5, 0, 1.0]} scale={0.8}><FishingBoat color="#815338" /></group>
      {[-1.8, 0, 1.8].map((z) => (
        <group key={z} position={[-1.2, 0, z]}>
          <mesh position={[0, 0.42, 0]} castShadow><boxGeometry args={[1.4, 0.75, 1.2]} /><meshStandardMaterial color="#a7865f" roughness={0.9} /></mesh>
          <mesh position={[0, 0.95, 0]} rotation-y={Math.PI / 4} castShadow><coneGeometry args={[1.0, 0.65, 4]} /><meshStandardMaterial color="#5d402b" roughness={1} /></mesh>
        </group>
      ))}
    </group>
  );
};

const WatYai: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.15, 0]} receiveShadow><boxGeometry args={[5.6, 0.3, 6.0]} /><meshStandardMaterial color="#d8c5a1" /></mesh>
      <Viharn pos={[0, 0.3, 0.3]} k={1} scale={1.45} />
      <SmallChedi pos={[0, 0.3, -2.1]} scale={0.9} k={1} color="#d5a83d" />
      {[-2.0, 2.0].map((x) => <SmallChedi key={x} pos={[x, 0.3, -1.8]} scale={0.42} k={1} color="#e8ded0" />)}
    </group>
  );
};

const TaksinBoats: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      {[-2.2, 0, 2.2].map((z, i) => (
        <group key={z} position={[i * 0.7, 0, z]}>
          <FishingBoat color="#5f3027" />
          <mesh position={[0, 1.55, 0]}><boxGeometry args={[0.08, 0.75, 0.04]} /><meshStandardMaterial color="#45251e" /></mesh>
          <mesh position={[0.28, 1.75, 0]}><planeGeometry args={[0.55, 0.42]} /><meshBasicMaterial color="#b21f2d" side={THREE.DoubleSide} toneMapped={false} /></mesh>
        </group>
      ))}
    </group>
  );
};

const BangPlaSoiPier: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <Jetty length={8.5} />
      {[-2.1, 0, 2.1].map((z, i) => (
        <group key={z} position={[-1.6, 0, z]}>
          <mesh position={[0, 0.55, 0]} castShadow><boxGeometry args={[1.6, 1.0, 1.35]} /><meshStandardMaterial color={i === 1 ? '#b35b3e' : '#94704d'} /></mesh>
          <mesh position={[0, 1.2, 0]} rotation-y={Math.PI / 4} castShadow><coneGeometry args={[1.15, 0.65, 4]} /><meshStandardMaterial color="#50372a" /></mesh>
        </group>
      ))}
      <group position={[7.5, 0, -2.0]}><FishingBoat color="#a35432" /></group>
      <group position={[6.5, 0, 2.0]} scale={0.85}><FishingBoat color="#46698a" /></group>
    </group>
  );
};

const AngSilaRetreat: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  const roof = useMemo(() => prism(2.8, 0.8, 3.5), []);
  if (k < 0.02) return null;
  const Building = ({x, color}: {x: number; color: string}) => (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.85, 0]} castShadow><boxGeometry args={[2.5, 1.7, 3.2]} /><meshStandardMaterial color={color} roughness={0.8} /></mesh>
      <mesh geometry={roof} position={[0, 1.7, 0]} castShadow><meshStandardMaterial color="#6f3f31" side={THREE.DoubleSide} roughness={0.8} /></mesh>
      {[-0.65, 0.65].map((wx) => <mesh key={wx} position={[wx, 0.95, 1.61]}><planeGeometry args={[0.38, 0.62]} /><meshBasicMaterial color="#b9d4d6" /></mesh>)}
    </group>
  );
  return (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.12, 0]} receiveShadow><boxGeometry args={[7.5, 0.24, 5.2]} /><meshStandardMaterial color="#b9ad96" /></mesh>
      <Building x={-1.7} color="#eee7d8" />
      <Building x={1.7} color="#a63a30" />
      {[-2.4, -1.2, 0, 1.2, 2.4].map((x) => (
        <group key={x} position={[x, 0.25, 2.0]}>
          <mesh castShadow><cylinderGeometry args={[0.18, 0.28, 0.35, 10]} /><meshStandardMaterial color="#77736e" roughness={1} /></mesh>
          <mesh position={[0, 0.22, 0]}><torusGeometry args={[0.26, 0.07, 6, 12]} /><meshStandardMaterial color="#8f8b85" /></mesh>
        </group>
      ))}
    </group>
  );
};

const Buffalo: React.FC<{x: number; z: number; phase: number}> = ({x, z, phase}) => {
  const leg = Math.sin(phase) * 0.25;
  return (
    <group position={[x, 0, z]} rotation-y={Math.PI / 2}>
      <mesh position={[0, 0.65, 0]} scale={[1.0, 0.52, 0.58]} castShadow><sphereGeometry args={[0.75, 8, 6]} /><meshStandardMaterial color="#39302b" roughness={1} /></mesh>
      <mesh position={[0.72, 0.78, 0]} scale={[0.45, 0.42, 0.42]} castShadow><sphereGeometry args={[0.62, 8, 6]} /><meshStandardMaterial color="#332a25" /></mesh>
      {[-0.48, 0.48].flatMap((lx) => [-0.28, 0.28].map((lz, i) => (
        <mesh key={`${lx}-${lz}`} position={[lx + leg * (i ? -1 : 1), 0.26, lz]} rotation-z={leg} castShadow><cylinderGeometry args={[0.08, 0.1, 0.55, 6]} /><meshStandardMaterial color="#2d2723" /></mesh>
      )))}
      {[-1, 1].map((s) => <mesh key={s} position={[0.98, 1.02, s * 0.32]} rotation-x={s * 0.6} rotation-z={-0.65}><coneGeometry args={[0.08, 0.58, 6]} /><meshStandardMaterial color="#ded2b2" /></mesh>)}
    </group>
  );
};

const BuffaloRace: React.FC<{pos: [number, number, number]; k: number; t: number}> = ({pos, k, t}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <mesh position={[0, 0.04, 0]} receiveShadow><boxGeometry args={[11, 0.08, 4.8]} /><meshStandardMaterial color="#a97743" roughness={1} /></mesh>
      {[-2.0, 2.0].map((z) => <mesh key={z} position={[0, 0.3, z]}><boxGeometry args={[11, 0.08, 0.08]} /><meshStandardMaterial color="#efe2c5" /></mesh>)}
      {[0, 1, 2, 3].map((i) => {
        const run = ((t * (1.0 + i * 0.04) + i * 1.4) % 8) - 4;
        return <Buffalo key={i} x={run} z={-1.25 + i * 0.82} phase={t * 6 + i} />;
      })}
    </group>
  );
};

const SamMukShrine: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  const rocks: Array<[number, number, number, number, number, number]> = [
    [1.9, 0.65, -3.0, 1.4, 1.5, 1.1],
    [2.8, 0.82, -1.8, 1.25, 1.9, 1.0],
    [3.1, 0.92, -0.2, 1.35, 2.2, 1.2],
    [2.9, 0.78, 1.5, 1.4, 1.8, 1.1],
    [2.3, 0.62, 3.0, 1.2, 1.45, 1.0],
  ];
  const trees: Array<[number, number, number, number]> = [
    [-1.5, 1.2, -3.0, 0.95], [-0.1, 1.7, -3.4, 1.0], [1.1, 1.8, -2.7, 1.05],
    [-1.8, 1.5, -1.2, 1.0], [-0.4, 2.0, -1.4, 1.1], [1.0, 2.2, -1.0, 1.0],
    [-1.5, 1.6, 0.6, 1.05], [-0.1, 2.2, 0.5, 1.15], [1.2, 2.0, 0.7, 1.0],
    [-1.1, 1.5, 2.3, 1.05], [0.3, 1.9, 2.5, 1.1], [1.4, 1.55, 3.0, 0.9],
  ];
  const roadPoints: Array<[number, number]> = [
    [-3.6, -4.5], [-0.8, -5.2], [2.8, -4.1], [4.3, -1.2], [4.1, 2.2], [2.0, 5.0],
  ];
  const roadSegments = roadPoints.slice(1).map(([x1, z1], i) => {
    const [x0, z0] = roadPoints[i];
    const dx = x1 - x0;
    const dz = z1 - z0;
    return {x: (x0 + x1) / 2, z: (z0 + z1) / 2, len: Math.hypot(dx, dz) + 0.18, angle: -Math.atan2(dz, dx)};
  });
  return (
    <group position={pos} scale={k}>
      {/* Pale, broken rock face on the sea side of the wooded ridge. */}
      {rocks.map(([x, y, z, sx, sy, sz], i) => (
        <mesh key={`rock-${i}`} position={[x, y, z]} scale={[sx, sy, sz]} rotation={[0.1 * i, 0.35 * i, 0.08 * (i - 2)]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={i % 2 ? '#bda879' : '#d0bd91'} roughness={1} />
        </mesh>
      ))}

      {/* Dense low-poly canopy makes the landmark read as a forested headland. */}
      {trees.map(([x, y, z, s], i) => (
        <mesh key={`tree-${i}`} position={[x, y, z]} scale={[s, s * 0.82, s]} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#174d35' : i % 3 === 1 ? '#22643e' : '#2b7547'} roughness={1} />
        </mesh>
      ))}

      {/* The recognisable road curling around the foot of the promontory. */}
      {roadSegments.map((segment, i) => (
        <mesh key={`road-${i}`} position={[segment.x, -1.42, segment.z]} rotation-y={segment.angle} castShadow receiveShadow>
          <boxGeometry args={[segment.len, 0.14, 0.72]} />
          <meshStandardMaterial color="#62686c" roughness={0.96} />
        </mesh>
      ))}
      {[[-3.2, -4.45], [-1.1, -5.0], [1.2, -4.8], [3.4, -3.2], [4.2, -0.5], [4.0, 2.4], [2.3, 4.6]].map(([x, z], i) => (
        <mesh key={`post-${i}`} position={[x, -1.22, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.34, 6]} />
          <meshStandardMaterial color="#e5e0d5" />
        </mesh>
      ))}

      {/* Chao Mae Sam Muk shrine sits high on the ridge rather than at sea level. */}
      <group position={[-0.25, 2.05, 0.25]} scale={0.9}>
        <mesh position={[0, 0.18, 0]} receiveShadow><boxGeometry args={[3.2, 0.35, 2.8]} /><meshStandardMaterial color="#b9b2a4" /></mesh>
        <mesh position={[0, 0.8, 0]} castShadow><boxGeometry args={[2.2, 1.15, 1.8]} /><meshStandardMaterial color="#c5372d" /></mesh>
        <mesh position={[0, 1.55, 0]} rotation-y={Math.PI / 4} castShadow><coneGeometry args={[1.6, 0.75, 4]} /><meshStandardMaterial color="#1f694b" metalness={0.25} /></mesh>
        {[-0.75, 0.75].map((x) => <mesh key={x} position={[x, 0.9, 1.0]}><sphereGeometry args={[0.14, 8, 8]} /><meshBasicMaterial color="#ff3838" toneMapped={false} /></mesh>)}
      </group>
    </group>
  );
};

const BangSaenBeach: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      <mesh position={[1.8, 0.03, 0]} receiveShadow><boxGeometry args={[7.0, 0.06, 9.0]} /><meshStandardMaterial color="#dcc48f" roughness={1} /></mesh>
      {[-3.2, -1.6, 0, 1.6, 3.2].map((z, i) => (
        <group key={z} position={[3.0 + (i % 2) * 1.0, 0, z]}>
          <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.04, 0.05, 1.1, 6]} /><meshStandardMaterial color="#eee" /></mesh>
          <mesh position={[0, 1.05, 0]}><coneGeometry args={[0.9, 0.28, 12]} /><meshBasicMaterial color={i % 2 ? '#f05b50' : '#36a6c9'} toneMapped={false} /></mesh>
        </group>
      ))}
      <mesh position={[-1.0, 0.18, 0]} castShadow><boxGeometry args={[0.9, 0.2, 10.0]} /><meshStandardMaterial color="#555b60" /></mesh>
    </group>
  );
};

export const ChonburiLandmarks: React.FC<LandmarkProps> = ({Y, t, terrainH}) => {
  const at = (p: [number, number]) => [p[0], terrainH(p[0], p[1]), p[1]] as [number, number, number];
  const kSriPhalo = ramp(Y, 1300, 1350) * (1 - ramp(Y, 1550, 1700));
  const kWat = ramp(Y, 1380, 1430);
  const kTaksin = ramp(Y, 1766.4, 1767) * (1 - ramp(Y, 1768, 1772));
  const kPier = ramp(Y, 1780, 1820);
  const kAngSila = ramp(Y, 1851, 1865);
  const kBuffalo = ramp(Y, 1870, 1880);
  const kSamMuk = ramp(Y, 1850, 1900);
  const kBangSaen = ramp(Y, 1943, 1948);
  return (
    <group>
      <SriPhaloPort pos={at(SRI_PHALO)} k={kSriPhalo} />
      <WatYai pos={at(WAT_YAI)} k={kWat} />
      <TaksinBoats pos={[TAKSIN_FLEET[0], 0, TAKSIN_FLEET[1]]} k={kTaksin} />
      <BangPlaSoiPier pos={at(BANG_PLA_SOI_PIER)} k={kPier} />
      <AngSilaRetreat pos={at(ANG_SILA)} k={kAngSila} />
      <BuffaloRace pos={at(BUFFALO_RACE)} k={kBuffalo} t={t} />
      <SamMukShrine pos={at(KHAO_SAM_MUK)} k={kSamMuk} />
      <BangSaenBeach pos={at(BANG_SAEN)} k={kBangSaen} />
    </group>
  );
};
