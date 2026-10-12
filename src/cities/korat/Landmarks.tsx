import React, {useLayoutEffect, useRef} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {lerp, ramp, smooth} from '../../lib';
import {Prang, SmallChedi, Viharn, updateInstances} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';

export const SEMA: [number, number] = [-30, -28];
export const PHIMAI: [number, number] = [22, -38];
export const BAN_PRASAT: [number, number] = [16, -30];
export const MONUMENT: [number, number] = [-14.6, 0];
export const RUNWAY: [number, number] = [24, 31];
export const THUNG_SAMRIT: [number, number] = [18, -22];

// ------------------------------------------------------------------ dinosaurs
const DINOS = new Array(7).fill(0).map((_, i) => ({
  big: i < 3,
  cx: -12 + random(`dx${i}`) * 20,
  cz: -14 + random(`dz${i}`) * 22,
  r: 4 + random(`dr${i}`) * 7,
  w: (0.12 + random(`dw${i}`) * 0.1) * (random(`dd${i}`) < 0.5 ? -1 : 1),
  ph: random(`dp${i}`) * Math.PI * 2,
  color: i < 3 ? ['#6f7f4a', '#7c6a4a', '#5f7a5a'][i] : ['#c47a3a', '#a8583a', '#c9963f', '#8f6a3a'][i % 4],
}));

const Dino: React.FC<{d: (typeof DINOS)[number]; t: number; k: number; terrainH: LandmarkProps['terrainH']}> = ({d, t, k, terrainH}) => {
  const a = d.ph + d.w * t;
  const x = d.cx + Math.cos(a) * d.r;
  const z = d.cz + Math.sin(a) * d.r;
  const heading = -a - (d.w > 0 ? 0 : Math.PI);
  const step = Math.sin(t * (d.big ? 5 : 9) + d.ph);
  const s = (d.big ? 2.6 : 1.5) * k;
  const m = <meshStandardMaterial color={d.color} flatShading roughness={0.9} />;
  return (
    <group position={[x, terrainH(x, z), z]} rotation-y={heading} scale={s}>
      {d.big ? (
        <>
          <mesh position={[0, 2.0, 0]} scale={[1.2, 1.0, 2.2]} castShadow>
            <icosahedronGeometry args={[1, 1]} />
            {m}
          </mesh>
          <mesh position={[0, 3.6, 2.6]} rotation-x={-0.7} castShadow>
            <cylinderGeometry args={[0.28, 0.5, 3.2, 6]} />
            {m}
          </mesh>
          <mesh position={[0, 4.9, 3.6]} scale={[0.4, 0.35, 0.6]} castShadow>
            <icosahedronGeometry args={[1, 0]} />
            {m}
          </mesh>
          <mesh position={[0, 1.8, -3.4]} rotation-x={-1.45} castShadow>
            <coneGeometry args={[0.55, 3.6, 6]} />
            {m}
          </mesh>
          {[
            [0.7, 1.1],
            [-0.7, 1.1],
            [0.7, -1.1],
            [-0.7, -1.1],
          ].map(([lx, lz], j) => (
            <mesh key={j} position={[lx, 0.8, lz]} rotation-x={step * 0.35 * (j % 2 ? 1 : -1)} castShadow>
              <cylinderGeometry args={[0.28, 0.24, 1.6, 6]} />
              {m}
            </mesh>
          ))}
        </>
      ) : (
        <>
          <mesh position={[0, 1.6, 0]} rotation-x={0.35} scale={[0.7, 0.75, 1.3]} castShadow>
            <icosahedronGeometry args={[1, 1]} />
            {m}
          </mesh>
          <mesh position={[0, 2.5, 1.3]} scale={[0.42, 0.42, 0.7]} castShadow>
            <icosahedronGeometry args={[1, 0]} />
            {m}
          </mesh>
          <mesh position={[0, 1.3, -2.0]} rotation-x={-1.35} castShadow>
            <coneGeometry args={[0.4, 2.8, 6]} />
            {m}
          </mesh>
          {[0.35, -0.35].map((lx, j) => (
            <mesh key={j} position={[lx, 0.55, 0]} rotation-x={step * 0.6 * (j ? 1 : -1)} castShadow>
              <cylinderGeometry args={[0.16, 0.12, 1.1, 5]} />
              {m}
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ 1826 war: two armies
const ARMY = 70;
const OFF = new Array(ARMY).fill(0).map((_, i) => [(random(`ax${i}`) - 0.5) * 6, (random(`az${i}`) - 0.5) * 4]);
const Army: React.FC<{pos: (i: number) => [number, number] | null; color: string}> = ({pos, color}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    updateInstances(ref.current, ARMY, (i, o) => {
      const p = pos(i);
      if (!p) return false;
      o.position.set(p[0], 0.5, p[1]);
      return true;
    });
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, ARMY]} castShadow>
      <boxGeometry args={[0.5, 1.0, 0.5]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </instancedMesh>
  );
};

const SMOKE = new Array(10).fill(0).map((_, i) => ({
  x: (random(`smx${i}`) - 0.5) * 18,
  z: (random(`smz${i}`) - 0.5) * 10,
  ph: random(`smp${i}`),
}));

export const KoratLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH}) => {
  const dinos = 1 - ramp(Y, -5e6, -1.5e6);
  const banPrasat = ramp(Y, -1200, -900);
  const huts = banPrasat * (1 - ramp(Y, 700, 900));
  const museum = ramp(Y, 1985, 1992);
  const sema = smooth(ramp(Y, 590, 660));
  const phimai = smooth(ramp(Y, 1060, 1110));
  const monument = smooth(ramp(Y, 1933.4, 1934.2));
  const runway = ramp(Y, 1955, 1962);
  const war = ramp(Y, 1825.9, 1826.1) * (1 - ramp(Y, 1826.9, 1827.6));

  // armies: Vientiane troops march in from the north-east and fall back to Thung Samrit;
  // Korat townsfolk gather in the city and push them out.
  const lao = (i: number): [number, number] | null => {
    if (Y < 1825.7 || Y > 1827.3) return null;
    const [ox, oz] = OFF[i];
    const inn = smooth(ramp(Y, 1825.7, 1826.05));
    const out = smooth(ramp(Y, 1826.45, 1827.1));
    const x = lerp(lerp(40, 4, inn), THUNG_SAMRIT[0] + 6, out);
    const z = lerp(lerp(-44, -4, inn), THUNG_SAMRIT[1] - 6, out);
    return [x + ox, z + oz];
  };
  const korat = (i: number): [number, number] | null => {
    if (Y < 1826.25 || Y > 1827.3) return null;
    const [ox, oz] = OFF[(i + 17) % ARMY];
    const go = smooth(ramp(Y, 1826.4, 1827.0));
    return [lerp(-6, THUNG_SAMRIT[0], go) + ox, lerp(2, THUNG_SAMRIT[1], go) + oz];
  };

  return (
    <>
      {dinos > 0.02 && DINOS.map((d, i) => <Dino key={i} d={d} t={t} k={dinos} terrainH={terrainH} />)}

      {/* Ban Prasat: prehistoric village + burial pit (later an open-air museum) */}
      {banPrasat > 0.02 && (
        <group position={[BAN_PRASAT[0], 0, BAN_PRASAT[1]]}>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[3.2, 0.06, 2.2]} />
            <meshStandardMaterial color="#6b4a2e" roughness={1} />
          </mesh>
          {[-1, -0.4, 0.2, 0.8].map((x, i) => (
            <mesh key={i} position={[x, 0.1, (i % 2) * 0.6 - 0.3]} rotation-y={0.3}>
              <capsuleGeometry args={[0.08, 0.6, 2, 4]} />
              <meshStandardMaterial color="#efe8d8" />
            </mesh>
          ))}
          {museum > 0 && (
            <mesh position={[0, 1.4, 0]} scale={[1, museum, 1]} castShadow>
              <boxGeometry args={[4, 0.15, 3]} />
              <meshStandardMaterial color="#8a3a26" />
            </mesh>
          )}
          {huts > 0.02 &&
            [
              [-4, 2],
              [3.5, 2.5],
              [-3, -3],
              [4, -2.5],
              [0, 4],
            ].map(([x, z], i) => (
              <group key={i} position={[x, 0, z]} scale={[1, huts, 1]}>
                <mesh position={[0, 0.8, 0]} castShadow>
                  <boxGeometry args={[1.1, 0.45, 0.9]} />
                  <meshStandardMaterial color="#8c6a45" />
                </mesh>
                <mesh position={[0, 1.35, 0]} castShadow>
                  <coneGeometry args={[0.95, 0.75, 4]} />
                  <meshStandardMaterial color="#c2a866" flatShading />
                </mesh>
                <mesh position={[0, 0.3, 0]}>
                  <boxGeometry args={[0.9, 0.6, 0.7]} />
                  <meshStandardMaterial color="#5b4330" />
                </mesh>
              </group>
            ))}
        </group>
      )}

      {/* Mueang Sema: Dvaravati reclining Buddha in red sandstone */}
      {sema > 0.02 && (
        <group position={[SEMA[0], terrainH(SEMA[0], SEMA[1]), SEMA[1]]} scale={[1, sema, 1]} rotation-y={0.4}>
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.2, 0.5, 2.2]} />
            <meshStandardMaterial color="#9b6a52" roughness={1} />
          </mesh>
          <mesh position={[0.3, 0.95, 0]} rotation-z={Math.PI / 2} castShadow>
            <capsuleGeometry args={[0.5, 3.6, 4, 8]} />
            <meshStandardMaterial color="#b4704f" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[-2.45, 1.15, 0]} castShadow>
            <sphereGeometry args={[0.55, 10, 8]} />
            <meshStandardMaterial color="#b4704f" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[-2.55, 1.75, 0]} castShadow>
            <coneGeometry args={[0.2, 0.5, 6]} />
            <meshStandardMaterial color="#b4704f" />
          </mesh>
          <SmallChedi pos={[2, 0.5, -2.4]} scale={0.6} k={1} color="#a36c4f" />
        </group>
      )}

      {/* Prasat Hin Phimai */}
      {phimai > 0.02 && (
        <group position={[PHIMAI[0], 0, PHIMAI[1]]}>
          <Prang pos={[0, 0, 0]} k={phimai} scale={1.4} />
          {[
            [0, 4.2, 9, 0.5],
            [0, -4.2, 9, 0.5],
            [4.2, 0, 0.5, 9],
            [-4.2, 0, 0.5, 9],
          ].map(([x, z, wx, wz], i) => (
            <mesh key={i} position={[x, 0.5 * phimai, z]} scale={[1, phimai, 1]} castShadow receiveShadow>
              <boxGeometry args={[wx, 1, wz]} />
              <meshStandardMaterial color="#cfc6b4" roughness={1} />
            </mesh>
          ))}
          <mesh position={[0, 0.9 * phimai, 4.4]} scale={[1, phimai, 1]} castShadow>
            <boxGeometry args={[2, 1.8, 1.2]} />
            <meshStandardMaterial color="#d6cebd" roughness={1} />
          </mesh>
        </group>
      )}

      {/* temples and the city pillar inside the walls */}
      <Viharn pos={[-3, 0, 2.6]} k={smooth(ramp(Y, 1660, 1666))} rot={Math.PI / 2} />
      <Viharn pos={[5, 0, -3]} k={smooth(ramp(Y, 1662, 1668))} />
      <SmallChedi pos={[6.4, 0, -4.4]} scale={0.6} k={smooth(ramp(Y, 1662, 1668))} color="#efe8dc" />
      {Y > 1657 && (
        <mesh position={[1.6, 0.6 * smooth(ramp(Y, 1657, 1659)), -1.6]} scale={[1, smooth(ramp(Y, 1657, 1659)), 1]} castShadow>
          <boxGeometry args={[0.9, 1.2, 0.9]} />
          <meshStandardMaterial color="#c9433a" emissive="#ffb347" emissiveIntensity={night * 0.4} />
        </mesh>
      )}

      {/* 1826: smoke over the seized city, then the armies */}
      {war > 0.02 &&
        SMOKE.map((s, i) =>
          new Array(5).fill(0).map((_, j) => {
            const age = (t * 0.6 + s.ph + j * 0.2) % 1;
            return (
              <mesh key={`${i}-${j}`} position={[s.x + age * 1.5, 1 + age * 9, s.z - age]} scale={(0.6 + age * 1.8) * war}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={j === 0 ? '#ff8a3a' : '#5d5752'} emissive={j === 0 ? '#ff6a1a' : '#000000'} emissiveIntensity={j === 0 ? 1.2 : 0} transparent opacity={0.75 * (1 - age)} flatShading />
              </mesh>
            );
          }),
        )}
      <Army pos={lao} color="#2e3f6e" />
      <Army pos={korat} color="#b23a2e" />

      {/* Thao Suranari Monument in front of Chumphon Gate */}
      {monument > 0.02 && (
        <group position={[MONUMENT[0], 0, MONUMENT[1]]}>
          <mesh position={[0, 0.06, 0]} receiveShadow>
            <boxGeometry args={[4.6, 0.12, 4.6]} />
            <meshStandardMaterial color="#d8d2c4" roughness={1} />
          </mesh>
          <group scale={[1, monument, 1]}>
            <mesh position={[0, 0.85, 0]} castShadow>
              <boxGeometry args={[1.1, 1.5, 1.1]} />
              <meshStandardMaterial color="#8e8a84" roughness={0.6} />
            </mesh>
            <mesh position={[0, 2.05, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.32, 0.9, 8]} />
              <meshStandardMaterial color="#3a3a36" metalness={0.6} roughness={0.35} emissive="#ffcf7a" emissiveIntensity={night * 0.5} />
            </mesh>
            <mesh position={[0, 2.62, 0]} castShadow>
              <sphereGeometry args={[0.16, 8, 6]} />
              <meshStandardMaterial color="#3a3a36" metalness={0.6} roughness={0.35} emissive="#ffcf7a" emissiveIntensity={night * 0.5} />
            </mesh>
            <mesh position={[0.28, 2.3, 0]} rotation-z={-0.5}>
              <boxGeometry args={[0.05, 0.7, 0.05]} />
              <meshStandardMaterial color="#c9c4b8" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <mesh key={i} position={[Math.cos(i * 0.785) * 1.5, 0.22, Math.sin(i * 0.785) * 1.5]} scale={monument}>
              <sphereGeometry args={[0.22, 6, 5]} />
              <meshStandardMaterial color="#f2c14a" />
            </mesh>
          ))}
        </group>
      )}

      {/* Korat air base (Wing 1) */}
      {runway > 0 && (
        <group position={[RUNWAY[0], 0, RUNWAY[1]]} scale={[runway, 1, 1]}>
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <boxGeometry args={[26, 0.06, 2.4]} />
            <meshStandardMaterial color="#6a6c70" />
          </mesh>
          {[-8, -4, 0, 4, 8].map((x) => (
            <mesh key={x} position={[x, 0.09, 0]}>
              <boxGeometry args={[2, 0.02, 0.15]} />
              <meshStandardMaterial color="#f2f2ea" />
            </mesh>
          ))}
          {[-6, -2, 2].map((x) => (
            <mesh key={`h${x}`} position={[x, 0.7, -3]} castShadow>
              <cylinderGeometry args={[1.2, 1.2, 3, 8, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#9aa0a6" side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      )}
      {t > 47.4 && t < 49.6 &&
        [0, 1].map((j) => {
          const p = (t - 47.4 - j * 0.25) / 2;
          return (
            <group key={j} position={[lerp(-50, 55, p), 14 + j, lerp(30, 10, p) + j * 2]} rotation-y={Math.PI / 2 - 0.2}>
              <mesh>
                <coneGeometry args={[0.7, 3, 3]} />
                <meshStandardMaterial color="#8a9096" flatShading />
              </mesh>
            </group>
          );
        })}
    </>
  );
};
