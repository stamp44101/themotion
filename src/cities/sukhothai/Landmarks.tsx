import React, {useMemo} from 'react';
import {random} from 'remotion';
import {lerp, mix, ramp, smooth} from '../../lib';
import {Prang, SmallChedi, lathe} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';

export const MAHATHAT: [number, number] = [0, 0];
export const SA_SI: [number, number] = [-6.5, -3.5];
export const PALACE: [number, number] = [3.6, -4.4];
export const SI_SAWAI: [number, number] = [-1, 6.4];
export const PHRA_PHAI_LUANG: [number, number] = [0, -15.5];
export const SI_CHUM: [number, number] = [-9, -14];
export const KILNS: [number, number] = [18, 20];
export const HX = 11;
export const HZ = 8.5;

const MERGER = 1438;
const LATERITE = '#9a8068';

// Sukhothai lotus-bud (dok bua tum) chedi
const LOTUS_BUD: [number, number][] = [
  [0, 0], [0.95, 0], [0.95, 0.5], [0.7, 0.55], [0.7, 1.9], [0.82, 2.0], [0.55, 2.15], [0.72, 2.35], [0.86, 2.7],
  [0.82, 3.1], [0.6, 3.55], [0.32, 3.95], [0.14, 4.5], [0.05, 5.0], [0, 5.2],
];

const LotusChedi: React.FC<{pos: [number, number, number]; scale: number; k: number; ruin: number; glow: number}> = ({pos, scale, k, ruin, glow}) => {
  const geo = useMemo(() => lathe(LOTUS_BUD, 4), []);
  if (k < 0.02) return null;
  const c = mix('#ece6da', LATERITE, ruin * 0.8);
  return (
    <group position={pos} scale={[scale, scale * k, scale]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.25 + i * 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2 - i * 0.6, 0.5, 3.2 - i * 0.6]} />
          <meshStandardMaterial color={c} roughness={0.9} emissive="#ffb347" emissiveIntensity={glow * 0.25} />
        </mesh>
      ))}
      <mesh geometry={geo} position={[0, 1.5, 0]} rotation-y={Math.PI / 4} castShadow>
        <meshStandardMaterial color={c} roughness={0.85} flatShading emissive="#ffb347" emissiveIntensity={glow * 0.35} />
      </mesh>
    </group>
  );
};

/** Seated Buddha (simplified): lap, torso, head with ushnisha. */
const Buddha: React.FC<{pos: [number, number, number]; scale: number; k: number; color?: string; rot?: number}> = ({pos, scale, k, color = '#d9d2c2', rot = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} rotation-y={rot} scale={[scale, scale * k, scale]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.6, 0.4, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.55, 1.2, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.3, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.12, 0]} castShadow>
        <coneGeometry args={[0.1, 0.35, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );

/** Columned assembly hall ruin (only the pillars and base remain). */
const Colonnade: React.FC<{pos: [number, number, number]; k: number; rows: number}> = ({pos, k, rows}) =>
  k < 0.02 ? null : (
    <group position={pos}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.24, rows * 1.1 + 0.6]} />
        <meshStandardMaterial color="#b8a690" roughness={1} />
      </mesh>
      {new Array(rows * 2).fill(0).map((_, i) => (
        <mesh key={i} position={[(i % 2 ? 1 : -1) * 1.2, 0.24 + 0.9 * k, -((rows - 1) * 1.1) / 2 + Math.floor(i / 2) * 1.1]} scale={[1, k, 1]} castShadow>
          <cylinderGeometry args={[0.16, 0.18, 1.8, 6]} />
          <meshStandardMaterial color={LATERITE} roughness={1} />
        </mesh>
      ))}
    </group>
  );

const KILN_SMOKE = new Array(5).fill(0).map((_, i) => ({x: (i - 2) * 1.6, z: (i % 2) * 1.4, ph: random(`ks${i}`)}));

export const SukhothaiLandmarks: React.FC<LandmarkProps> = ({Y, t, night}) => {
  const ruin = ramp(Y, MERGER + 40, MERGER + 160);
  const lit = night * ramp(Y, 1991, 1994);
  const khmer = smooth(ramp(Y, 1175, 1205));
  const mahathat = smooth(ramp(Y, 1292, 1345));
  const outerWalls = smooth(ramp(Y, 1346, 1356));
  const kilns = smooth(ramp(Y, 1340, 1350)) * (1 - 0.6 * ramp(Y, 1500, 1560));
  const firing = ramp(Y, 1345, 1350) * (1 - ramp(Y, 1480, 1500));
  const siChum = smooth(ramp(Y, 1386, 1394));
  const pond = smooth(ramp(Y, 1258, 1264));
  const inscription = ramp(Y, 1283, 1283.6);

  return (
    <>
      {/* Wat Phra Phai Luang: three laterite Khmer prangs (Bayon period) */}
      {[-3.2, 0, 3.2].map((dx, i) => (
        <Prang key={i} pos={[PHRA_PHAI_LUANG[0] + dx, 0, PHRA_PHAI_LUANG[1]]} k={khmer * lerp(1, 0.7, ruin * (i === 1 ? 0 : 1))} scale={0.9} color={LATERITE} />
      ))}
      {/* Wat Si Sawai: three Khmer-style prangs inside the walls */}
      {[-1.8, 0, 1.8].map((dx, i) => (
        <Prang key={`s${i}`} pos={[SI_SAWAI[0] + dx, 0, SI_SAWAI[1]]} k={smooth(ramp(Y, 1200, 1230))} scale={0.55} color={mix('#e2dccf', LATERITE, ruin * 0.6)} />
      ))}

      {/* Wat Mahathat: lotus-bud chedi, satellites, Buddha images and colonnades */}
      <LotusChedi pos={[MAHATHAT[0], 0, MAHATHAT[1]]} scale={1.15} k={mahathat} ruin={ruin} glow={lit} />
      {[
        [-3, -3],
        [3, -3],
        [-3, 3],
        [3, 3],
      ].map(([x, z], i) => (
        <SmallChedi key={i} pos={[MAHATHAT[0] + x, 0, MAHATHAT[1] + z]} scale={0.5} k={mahathat} color={mix('#e9e2d6', LATERITE, ruin * 0.7)} glow={lit * 0.6} />
      ))}
      <Colonnade pos={[MAHATHAT[0], 0, MAHATHAT[1] + 5.4]} k={mahathat} rows={5} />
      <Buddha pos={[MAHATHAT[0], 0.24, MAHATHAT[1] + 2.6]} scale={0.8} k={mahathat} color={mix('#e6dfd2', '#bdb4a6', ruin)} rot={Math.PI} />

      {/* Traphang Trakuan pond with Wat Sa Si on its island */}
      {pond > 0.02 && (
        <group position={[SA_SI[0], 0, SA_SI[1]]}>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[5.4 * pond, 0.06, 4.2 * pond]} />
            <meshStandardMaterial color="#3f8fc0" roughness={0.12} metalness={0.25} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[2.2, 0.16, 2.2]} />
            <meshStandardMaterial color="#b8a690" />
          </mesh>
          <SmallChedi pos={[0, 0.2, 0]} scale={0.75} k={smooth(ramp(Y, 1300, 1310))} color={mix('#ece6da', '#9a9088', ruin * 0.6)} glow={lit * 0.8} />
        </group>
      )}

      {/* Palace site: Manangkhasila throne and the stone inscription */}
      {Y > 1252 && (
        <group position={[PALACE[0], 0, PALACE[1]]}>
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.6, 0.5, 1.8]} />
            <meshStandardMaterial color="#b8a690" />
          </mesh>
          <mesh position={[0.9, 0.5 + 0.55 * inscription, 0.4]} scale={[1, inscription, 1]} castShadow>
            <boxGeometry args={[0.35, 1.1, 0.35]} />
            <meshStandardMaterial color="#3a3a38" emissive="#ffd27a" emissiveIntensity={(1 - ramp(Y, 1284, 1300)) * 1.2} />
          </mesh>
        </group>
      )}

      {/* the triple walls: two outer earthen rings with moats between (inner ring is the engine's wall) */}
      {outerWalls > 0.02 &&
        [3.6, 6.2].map((o, i) => {
          const hx = HX + o;
          const hz = HZ + o;
          return (
            <group key={i}>
              {[
                [hx, 0, 0.9, 2 * hz + 0.9],
                [-hx, 0, 0.9, 2 * hz + 0.9],
                [0, hz, 2 * hx + 0.9, 0.9],
                [0, -hz, 2 * hx + 0.9, 0.9],
              ].map(([x, z, w, d], j) => (
                <mesh key={j} position={[x, 0.3 * outerWalls, z]} scale={[1, outerWalls, 1]} castShadow receiveShadow>
                  <boxGeometry args={[w, 0.6, d]} />
                  <meshStandardMaterial color={mix('#8a6a4a', '#5f7a4a', ruin)} roughness={1} />
                </mesh>
              ))}
              {[
                [hx + 1.3, 0, 1.0, 2 * hz + 3.6],
                [-hx - 1.3, 0, 1.0, 2 * hz + 3.6],
                [0, hz + 1.3, 2 * hx + 3.6, 1.0],
                [0, -hz - 1.3, 2 * hx + 3.6, 1.0],
              ].map(([x, z, w, d], j) =>
                i === 0 ? (
                  <mesh key={`m${j}`} position={[x, 0.05, z]} receiveShadow>
                    <boxGeometry args={[w * (j < 2 ? 1 : outerWalls), 0.06, d * (j < 2 ? outerWalls : 1)]} />
                    <meshStandardMaterial color="#3f8fc0" roughness={0.12} metalness={0.25} />
                  </mesh>
                ) : null,
              )}
            </group>
          );
        })}

      {/* Sangkhalok kilns with glazed wares */}
      {kilns > 0.02 && (
        <group position={[KILNS[0], 0, KILNS[1]]}>
          {[-3.2, -1.6, 0, 1.6, 3.2].map((x, i) => (
            <mesh key={i} position={[x, 0, (i % 2) * 1.4]} scale={[1, kilns, 1.6]} castShadow>
              <sphereGeometry args={[0.7, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#a0563a" roughness={1} emissive="#ff7a2a" emissiveIntensity={firing * (0.3 + night)} />
            </mesh>
          ))}
          {new Array(24).fill(0).map((_, i) => (
            <mesh key={`p${i}`} position={[-3 + (i % 8) * 0.8, 0.2 * kilns, 3 + Math.floor(i / 8) * 0.7]} scale={kilns} castShadow>
              <cylinderGeometry args={[0.18, 0.24, 0.4, 8]} />
              <meshStandardMaterial color={['#8fb5a0', '#a8c4b0', '#6f9a8a', '#c9c2a8'][i % 4]} roughness={0.35} metalness={0.1} />
            </mesh>
          ))}
          {firing > 0.02 &&
            KILN_SMOKE.map((s, i) =>
              [0, 1, 2, 3].map((j) => {
                const age = (t * 0.5 + s.ph + j * 0.25) % 1;
                return (
                  <mesh key={`${i}-${j}`} position={[s.x + age, 1 + age * 6, s.z]} scale={(0.4 + age * 1.2) * firing}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#8a847e" transparent opacity={0.6 * (1 - age)} flatShading />
                  </mesh>
                );
              }),
            )}
        </group>
      )}

      {/* Wat Si Chum: roofless mondop enclosing Phra Achana */}
      {siChum > 0.02 && (
        <group position={[SI_CHUM[0], 0, SI_CHUM[1]]}>
          {[
            [0, -1.9, 4.2, 0.4],
            [-1.9, 0, 0.4, 4.2],
            [1.9, 0, 0.4, 4.2],
          ].map(([x, z, w, d], i) => (
            <mesh key={i} position={[x, 2.2 * siChum, z]} scale={[1, siChum, 1]} castShadow receiveShadow>
              <boxGeometry args={[w, 4.4, d]} />
              <meshStandardMaterial color={mix('#d8cfbf', LATERITE, ruin * 0.6)} roughness={1} />
            </mesh>
          ))}
          {[-1.25, 1.25].map((x, i) => (
            <mesh key={`f${i}`} position={[x, 2.2 * siChum, 1.9]} scale={[1, siChum, 1]} castShadow>
              <boxGeometry args={[1.7, 4.4, 0.4]} />
              <meshStandardMaterial color={mix('#d8cfbf', LATERITE, ruin * 0.6)} roughness={1} />
            </mesh>
          ))}
          <Buddha pos={[0, 0, -0.3]} scale={1.65} k={siChum} color="#e8e1d2" />
          {lit > 0.02 && (
            <mesh position={[0, 2.5, 0]}>
              <sphereGeometry args={[4, 14, 10]} />
              <meshBasicMaterial color="#ffc070" transparent opacity={0.12 * lit} depthWrite={false} />
            </mesh>
          )}
        </group>
      )}
    </>
  );
};
