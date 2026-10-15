import React, {useMemo} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {lerp, mix, ramp, smooth} from '../../lib';
import {Prang, SmallChedi, Viharn, lathe, prism} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';

export const PHANAN: [number, number] = [21.9, 14.2];
export const PALACE: [number, number] = [-5.5, -5.4];
export const SANPHET: [number, number] = [-5.3, -2.9];
export const MAHATHAT: [number, number] = [6.9, -4.4];
export const RATCHABURANA: [number, number] = [6.6, -6.8];
export const POM_PHET: [number, number] = [21.8, 9.6];
// The survey coordinate sits on the broad west-channel centreline at model
// scale. Shift the temple compound 160 m onto the west bank so it cannot occupy
// open water while preserving its across-the-river relationship to the island.
export const CHAIWAT: [number, number] = [-29.8, 15.0];
export const DUTCH: [number, number] = [20.0, 18.3];
export const PORTUGUESE: [number, number] = [16.6, 27.8];
export const JAPANESE: [number, number] = [20.2, 29.2];

const FALL = 1767;
const BRICK = '#9b5942';
const LATERITE = '#6f5545';

const BELL_CHEDI: [number, number][] = [
  [0, 0], [1.55, 0], [1.55, 0.35], [1.3, 0.42], [1.3, 0.7], [1.12, 0.78], [1.25, 1.1],
  [1.2, 1.65], [0.96, 2.2], [0.52, 2.55], [0.46, 2.9], [0.28, 3.0], [0.24, 3.35],
  [0.15, 4.2], [0.07, 4.9], [0, 5.15],
];

const BellChedi: React.FC<{pos: [number, number, number]; k: number; ruin: number; lit: number}> = ({pos, k, ruin, lit}) => {
  const geo = useMemo(() => lathe(BELL_CHEDI, 16), []);
  if (k < 0.02) return null;
  return (
    <mesh geometry={geo} position={pos} scale={[1, k * lerp(1, 0.86, ruin), 1]} castShadow receiveShadow>
      <meshStandardMaterial
        color={mix('#ede7db', '#8f7969', ruin)}
        emissive="#ffc36b"
        emissiveIntensity={lit * 0.25}
        roughness={0.86}
        flatShading
      />
    </mesh>
  );
};

const RoofedHall: React.FC<{
  pos: [number, number, number];
  k: number;
  rot?: number;
  size?: [number, number, number];
  wall?: string;
  roof?: string;
  lit?: number;
}> = ({pos, k, rot = 0, size = [2.4, 1.5, 4.4], wall = '#e8dcc8', roof = '#6f342b', lit = 0}) => {
  const roofGeo = useMemo(() => prism(size[0] + 0.5, 1.05, size[2] + 0.6), [size]);
  if (k < 0.02) return null;
  return (
    <group position={pos} rotation-y={rot} scale={[1, k, 1]}>
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={wall} emissive="#ffbd66" emissiveIntensity={lit * 0.16} roughness={0.9} />
      </mesh>
      <mesh geometry={roofGeo} position={[0, size[1] + 0.5, 0]} castShadow>
        <meshStandardMaterial color={roof} roughness={0.86} flatShading side={THREE.DoubleSide} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, size[1] + 1.25, s * (size[2] / 2 + 0.05)]} rotation-x={Math.PI / 4}>
          <boxGeometry args={[0.08, 1.5, 0.08]} />
          <meshStandardMaterial color="#c7a34d" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const SMOKE = new Array(18).fill(0).map((_, i) => ({
  x: (random(`ay-v2-smoke-x-${i}`) - 0.5) * 34 + 3,
  z: (random(`ay-v2-smoke-z-${i}`) - 0.5) * 22 - 1,
  ph: random(`ay-v2-smoke-ph-${i}`),
}));

const Smoke: React.FC<{t: number; k: number; n: number}> = ({t, k, n}) => (
  <>
    {SMOKE.slice(0, n).flatMap((s, i) =>
      new Array(5).fill(0).map((_, j) => {
        const age = (t * 0.55 + s.ph + j * 0.19) % 1;
        return (
          <mesh key={`${i}-${j}`} position={[s.x + age * 1.2, 0.9 + age * 9, s.z - age * 0.7]} scale={(0.55 + age * 1.8) * k}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={j === 0 ? '#f47735' : '#554f4d'}
              emissive={j === 0 ? '#ef541e' : '#000000'}
              emissiveIntensity={j === 0 ? 1.2 : 0}
              transparent
              opacity={0.68 * (1 - age)}
              flatShading
              depthWrite={false}
            />
          </mesh>
        );
      }),
    )}
  </>
);

export const AyutthayaLandmarks: React.FC<LandmarkProps> = ({Y, t, night}) => {
  const ruin = ramp(Y, FALL, FALL + 1.0);
  const lit = night * ramp(Y, 1991, 1995);
  const phanan = smooth(ramp(Y, 1318, 1324));
  const palace = smooth(ramp(Y, 1348, 1354));
  // A dated beat shows the completed monument: construction grows into the
  // named year instead of beginning only after the caption has arrived.
  const mahathat = smooth(ramp(Y, 1368, 1374));
  const ratcha = smooth(ramp(Y, 1418, 1424));
  const sanphet = (year: number) => smooth(ramp(Y, year - 4, year));
  const fortress = smooth(ramp(Y, 1549, 1555));
  const chaiwat = smooth(ramp(Y, 1624, 1630));
  const dutch = smooth(ramp(Y, 1634, 1640)) * (1 - ramp(Y, FALL, FALL + 10));
  const portuguese = smooth(ramp(Y, 1540, 1548)) * (1 - ramp(Y, FALL, FALL + 10));
  const japanese = smooth(ramp(Y, 1600, 1608)) * (1 - ramp(Y, FALL, FALL + 10));
  const firstFall = ramp(Y, 1568.7, 1569.0) * (1 - ramp(Y, 1569.7, 1571));
  const finalFall = ramp(Y, 1766.8, 1767.0) * (1 - ramp(Y, 1767.7, 1772));
  const conservation = ramp(Y, 1908, 1976);
  const ruinColor = (c: string) => mix(c, BRICK, ruin);

  const phananRoof = useMemo(() => prism(1.35, 0.75, 1.7), []);
  const palaceSpire = useMemo(() => lathe([[0, 0], [0.9, 0], [0.75, 1.2], [0.48, 1.8], [0.26, 2.8], [0, 4.2]], 8), []);
  const japaneseRoof = useMemo(() => prism(1.4, 0.72, 1.8), []);

  return (
    <>
      {/* Wat Phanan Choeng: the pre-capital river temple and its 19 m Buddha. */}
      {phanan > 0.02 && (
        <group position={[PHANAN[0], 0, PHANAN[1]]} scale={[1, phanan, 1]} rotation-y={-0.25}>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 1.8, 1.2]} />
            <meshStandardMaterial color="#e9dfc9" emissive="#ffbd66" emissiveIntensity={lit * 0.16} roughness={0.9} />
          </mesh>
          <mesh geometry={phananRoof} position={[0, 2.05, 0]} castShadow>
            <meshStandardMaterial color="#7d3027" roughness={0.84} flatShading side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 1.05, 0.05]} castShadow>
            <sphereGeometry args={[0.28, 12, 10]} />
            <meshStandardMaterial color="#d7aa39" metalness={0.48} roughness={0.42} />
          </mesh>
          <mesh position={[0, 0.66, 0.05]} castShadow>
            <cylinderGeometry args={[0.26, 0.40, 0.78, 12]} />
            <meshStandardMaterial color="#d7aa39" metalness={0.48} roughness={0.42} />
          </mesh>
        </group>
      )}

      {/* Grand Palace: three principal halls aligned along the north riverfront. */}
      <group position={[PALACE[0], 0, PALACE[1]]}>
        <Viharn pos={[-2.4, 0, 0]} k={palace * lerp(1, 0.30, ruin)} scale={1.25} rot={Math.PI / 2} />
        <Viharn pos={[1.0, 0, 0.2]} k={palace * lerp(1, 0.34, ruin)} scale={1.35} rot={Math.PI / 2} />
        <Viharn pos={[3.7, 0, 0.4]} k={palace * lerp(1, 0.28, ruin)} scale={1.0} rot={Math.PI / 2} />
        {ruin < 0.95 && (
          <mesh geometry={palaceSpire} position={[1.0, 2.3, 0.2]} scale={palace * (1 - ruin)} castShadow>
            <meshStandardMaterial color="#d2a84a" metalness={0.4} roughness={0.55} flatShading />
          </mesh>
        )}
      </group>

      {/* Wat Phra Si Sanphet: three bell chedis on one long terrace. */}
      <group position={[SANPHET[0], 0, SANPHET[1]]}>
        <mesh position={[0, 0.28, 0]} scale={[1, Math.max(0.02, sanphet(1492)), 1]} receiveShadow castShadow>
          <boxGeometry args={[8.6, 0.55, 3.2]} />
          <meshStandardMaterial color={ruinColor('#c9bda8')} roughness={1} />
        </mesh>
        <BellChedi pos={[2.55, 0.56, 0]} k={sanphet(1492)} ruin={ruin} lit={lit} />
        <BellChedi pos={[0, 0.56, 0]} k={sanphet(1492)} ruin={ruin} lit={lit} />
        <BellChedi pos={[-2.55, 0.56, 0]} k={sanphet(1532)} ruin={ruin} lit={lit} />
      </group>

      {/* The twin prang landmarks at the historic core. */}
      <group position={[MAHATHAT[0], 0, MAHATHAT[1]]}>
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[4.8, 0.5, 4.4]} />
          <meshStandardMaterial color={ruinColor(LATERITE)} />
        </mesh>
        <Prang pos={[0, 0.5, 0]} k={mahathat * lerp(1, 0.52, ruin)} scale={1.65} color={ruinColor('#dfd4c2')} />
        {[[2.0, 1.8], [-2.0, 1.8], [2.0, -1.8], [-2.0, -1.8]].map(([x, z], i) => (
          <SmallChedi key={i} pos={[x, 0.5, z]} scale={0.48} k={mahathat * lerp(1, 0.6, ruin)} color={ruinColor('#e5dccd')} glow={lit * 0.2} />
        ))}
      </group>
      <group position={[RATCHABURANA[0], 0, RATCHABURANA[1]]}>
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.5, 4.0]} />
          <meshStandardMaterial color={ruinColor(LATERITE)} />
        </mesh>
        <Prang pos={[0, 0.5, 0]} k={ratcha * lerp(1, 0.84, ruin)} scale={1.45} color={ruinColor('#d7c8b2')} />
      </group>

      {/* Pom Phet at the real south-east confluence. */}
      {fortress > 0.02 && (
        <group position={[POM_PHET[0], 0, POM_PHET[1]]} rotation-y={0.18} scale={[1, fortress, 1]}>
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[2.4, 2.7, 1.3, 8]} />
            <meshStandardMaterial color={ruinColor('#92563f')} roughness={1} flatShading />
          </mesh>
          <mesh position={[0, 1.38, 0]} receiveShadow>
            <cylinderGeometry args={[2.25, 2.25, 0.18, 8]} />
            <meshStandardMaterial color={ruinColor('#6e5040')} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 1.55, 1.5, Math.sin(i * Math.PI / 2) * 1.55]} rotation-y={-i * Math.PI / 2}>
              <boxGeometry args={[0.7, 0.45, 0.5]} />
              <meshStandardMaterial color={ruinColor('#92563f')} />
            </mesh>
          ))}
        </group>
      )}

      {/* Wat Chaiwatthanaram on the outer west bank. */}
      {chaiwat > 0.02 && (
        <group position={[CHAIWAT[0], 0, CHAIWAT[1]]}>
          <mesh position={[0, 0.22, 0]} receiveShadow castShadow>
            <boxGeometry args={[2.2, 0.44, 2.2]} />
            <meshStandardMaterial color={ruinColor('#bda98f')} roughness={1} />
          </mesh>
          <Prang pos={[0, 0.44, 0]} k={chaiwat * lerp(1, 0.90, ruin)} scale={0.72} color={ruinColor('#d6c4ab')} />
          {new Array(8).fill(0).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <Prang key={i} pos={[Math.cos(a) * 0.83, 0.44, Math.sin(a) * 0.83]} k={chaiwat * lerp(1, 0.78, ruin)} scale={0.18} color={ruinColor('#cfbca4')} />;
          })}
          {lit > 0.02 && (
            <mesh position={[0, 2.0, 0]}>
              <sphereGeometry args={[2.1, 16, 12]} />
              <meshBasicMaterial color="#ffc06a" transparent opacity={lit * 0.13} depthWrite={false} />
            </mesh>
          )}
        </group>
      )}

      {/* International settlements remain outside the wall, south of the river. */}
      {dutch > 0.02 && (
        <group position={[DUTCH[0], 0, DUTCH[1]]} scale={[1, dutch, 1]}>
          <RoofedHall pos={[0, 0, 0]} k={1} size={[3.2, 1.8, 2.2]} wall="#a44f38" roof="#49342b" />
          <mesh position={[1.9, 2.6, 0]}>
            <boxGeometry args={[0.06, 1.6, 0.06]} />
            <meshStandardMaterial color="#342a24" />
          </mesh>
          <mesh position={[2.2, 3.0, 0]}>
            <boxGeometry args={[0.65, 0.38, 0.03]} />
            <meshStandardMaterial color="#e86d32" />
          </mesh>
        </group>
      )}
      {portuguese > 0.02 && (
        <group position={[PORTUGUESE[0], 0, PORTUGUESE[1]]} scale={[1, portuguese, 1]}>
          <RoofedHall pos={[0, 0, 0]} k={1} size={[2.4, 1.7, 4.0]} wall="#f0ecdf" roof="#9b3e2d" />
          <mesh position={[0, 1.8, 2.5]} castShadow>
            <boxGeometry args={[0.9, 3.6, 0.9]} />
            <meshStandardMaterial color="#eee9dc" />
          </mesh>
          <mesh position={[0, 3.9, 2.5]}>
            <boxGeometry args={[0.1, 0.7, 0.1]} />
            <meshStandardMaterial color="#3a3530" />
          </mesh>
          <mesh position={[0, 4.0, 2.5]}>
            <boxGeometry args={[0.55, 0.1, 0.1]} />
            <meshStandardMaterial color="#3a3530" />
          </mesh>
        </group>
      )}
      {japanese > 0.02 && (
        <group position={[JAPANESE[0], 0, JAPANESE[1]]} scale={[1, japanese, 1]}>
          {[[-1.8, -1.2], [0, 0.6], [1.8, -0.7], [0.8, 2.0]].map(([x, z], i) => (
            <group key={i} position={[x, 0, z]}>
              <mesh position={[0, 0.45, 0]} castShadow>
                <boxGeometry args={[1.2, 0.9, 1.5]} />
                <meshStandardMaterial color="#d9cdb4" />
              </mesh>
              <mesh geometry={japaneseRoof} position={[0, 0.95, 0]} castShadow>
                <meshStandardMaterial color="#34343b" flatShading side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
          <mesh position={[-2.8, 1.1, 1.8]}>
            <boxGeometry args={[0.18, 2.2, 0.18]} />
            <meshStandardMaterial color="#b83b2e" />
          </mesh>
          <mesh position={[-1.4, 1.1, 1.8]}>
            <boxGeometry args={[0.18, 2.2, 0.18]} />
            <meshStandardMaterial color="#b83b2e" />
          </mesh>
          <mesh position={[-2.1, 2.1, 1.8]}>
            <boxGeometry args={[1.8, 0.22, 0.22]} />
            <meshStandardMaterial color="#b83b2e" />
          </mesh>
        </group>
      )}

      {/* Conservation reads as ordered timber braces instead of a new monument. */}
      {conservation > 0.02 && conservation < 0.98 && (
        <group position={[MAHATHAT[0], 0, MAHATHAT[1]]} scale={conservation}>
          {[-2.4, 2.4].map((x) => [-2.1, 2.1].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 2.2, z]} rotation-z={x * z > 0 ? 0.18 : -0.18}>
              <boxGeometry args={[0.12, 4.5, 0.12]} />
              <meshStandardMaterial color="#7b5c38" />
            </mesh>
          )))}
        </group>
      )}

      {firstFall > 0.02 && <Smoke t={t} k={firstFall} n={7} />}
      {finalFall > 0.02 && <Smoke t={t} k={finalFall} n={18} />}
    </>
  );
};
