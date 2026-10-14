import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ramp} from '../../lib';
import {SmallChedi, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';

export const WAT_NAKHON_SAWAN: [number, number] = [-6.5, -1.0];
export const CHULAMANI_CHEDI: [number, number] = [-13.5, -4.5];
export const THEPHARAK_SHRINE: [number, number] = [-4.6, -0.6];
export const DRAGON_PARADE: [number, number] = [-4.8, 1.4];
export const TEAK_RAFTS: [number, number] = [-1.5, 3.5];
export const DECHATIWONG_BRIDGE: [number, number] = [-2.0, 12.0];
export const PASAN: [number, number] = [0.8, 2.2];
export const SAN_KHU: [number, number] = [-11.0, -1.0];

/** Ancient Wat Nakhon Sawan (Wat Hua Mueang) - Sukhothai era (from 1357 CE). */
const AncientWatNakhonSawan: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={[1, k, 1]}>
      {/* Brick plinth */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.3, 4.4]} />
        <meshStandardMaterial color="#8b5a3c" roughness={0.9} />
      </mesh>
      {/* Sukhothai style Viharn */}
      <Viharn pos={[0, 0.3, 0.4]} k={k} scale={1.2} />
      {/* Main bell-shaped stupa behind Viharn */}
      <SmallChedi pos={[0, 0.3, -1.3]} scale={1.2} k={k} color="#d9a43a" />
    </group>
  );
};

/** San Khu Ancient Rampart (Sukhothai frontier) & Wooden Watchtower (Nine Armies War 1785). */
const SanKhuRedoubt: React.FC<{pos: [number, number, number]; kMoat: number; kFort: number}> = ({pos, kMoat, kFort}) => {
  if (kMoat < 0.02 && kFort < 0.02) return null;
  return (
    <group position={pos}>
      {/* Earthen rampart mound */}
      {kMoat >= 0.02 && (
        <mesh position={[0, 0.4 * kMoat, 0]} scale={[1, kMoat, 1]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.8, 5.0]} />
          <meshStandardMaterial color="#5c4a38" roughness={0.95} />
        </mesh>
      )}
      {/* Wooden palisade posts & watchtower */}
      {kFort >= 0.02 && (
        <group position={[0, 0.8, 0]}>
          <mesh position={[0.4, 0.25 * kFort, 0]} scale={[1, kFort, 1]} castShadow>
            <boxGeometry args={[0.15, 0.5, 4.8]} />
            <meshStandardMaterial color="#3d2d1e" roughness={0.8} />
          </mesh>
          <group scale={kFort}>
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[0.9, 1.8, 0.9]} />
              <meshStandardMaterial color="#4a3525" roughness={0.85} />
            </mesh>
            <mesh position={[0, 1.9, 0]} castShadow>
              <coneGeometry args={[0.75, 0.6, 4]} />
              <meshStandardMaterial color="#2d1f14" roughness={0.9} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};

/** Chinese Chao Pho Thepharak & Chao Mae Thapthim Riverside Shrine (from 1870 CE). */
const ThepharakShrine: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      {/* Stone terrace along water */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.4, 2.2]} />
        <meshStandardMaterial color="#d1cec7" roughness={0.7} />
      </mesh>
      {/* Chinese red main hall */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.6, 0.8, 1.4]} />
        <meshStandardMaterial color="#b3241c" roughness={0.5} />
      </mesh>
      {/* Upturned green/glazed Chinese roof with sweeping eaves */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[1.35, 0.55, 4]} />
        <meshStandardMaterial color="#1e5e3a" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Red ceremonial lanterns */}
      <mesh position={[-0.7, 0.8, 0.8]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#ff2a2a" toneMapped={false} />
      </mesh>
      <mesh position={[0.7, 0.8, 0.8]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#ff2a2a" toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Floating Teak Log Rafts & Raft Houses of Pak Nam Pho (from 1850 CE). */
const TeakRafts: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      {/* Rows of tethered teak logs floating on the water */}
      {[-0.6, -0.3, 0.0, 0.3, 0.6].map((ox, idx) => (
        <mesh key={idx} position={[ox, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 3.8, 8]} />
          <meshStandardMaterial color="#614126" roughness={0.8} />
        </mesh>
      ))}
      {/* Small floating wooden raft house */}
      <group position={[0, 0.25, 1.4]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.5, 0.1, 1.2]} />
          <meshStandardMaterial color="#826244" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.1, 0.7, 0.9]} />
          <meshStandardMaterial color="#a68058" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <coneGeometry args={[0.9, 0.4, 4]} />
          <meshStandardMaterial color="#4a3728" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

/** Golden Dragon of Pak Nam Pho (มังกรทองปากน้ำโพ) - annual Lunar New Year parade (from 1901 CE). */
const GoldenDragonParade: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  // Create an undulating S-curved golden dragon body
  const dragonSegments = [
    {x: 0.0, z: 1.2, y: 0.4, scale: 0.28},
    {x: 0.25, z: 0.9, y: 0.55, scale: 0.26},
    {x: 0.4, z: 0.5, y: 0.7, scale: 0.24},
    {x: 0.2, z: 0.1, y: 0.55, scale: 0.22},
    {x: -0.15, z: -0.3, y: 0.65, scale: 0.24},
    {x: -0.35, z: -0.7, y: 0.8, scale: 0.25},
    {x: -0.1, z: -1.1, y: 0.95, scale: 0.28}, // Dragon Head
  ];

  return (
    <group position={pos} scale={k}>
      {/* Dragon body segments with golden sheen */}
      {dragonSegments.map((seg, idx) => (
        <group key={idx} position={[seg.x, seg.y, seg.z]}>
          <mesh castShadow>
            <sphereGeometry args={[seg.scale, 8, 8]} />
            <meshStandardMaterial color={idx === dragonSegments.length - 1 ? '#ffcc00' : '#e6a817'} roughness={0.25} metalness={0.75} />
          </mesh>
          {/* Support pole to the ground */}
          <mesh position={[0, -seg.y / 2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, seg.y, 6]} />
            <meshStandardMaterial color="#443322" />
          </mesh>
        </group>
      ))}
      {/* Dragon Head Horns & Pearl of Wisdom */}
      <mesh position={[-0.1, 1.25, -1.1]} castShadow>
        <coneGeometry args={[0.1, 0.35, 4]} />
        <meshStandardMaterial color="#ff2222" metalness={0.4} />
      </mesh>
      {/* Luminous Pearl */}
      <mesh position={[-0.1, 1.05, -1.45]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Classic Dechatiwong Steel Truss Bridge (สะพานเดชาติวงศ์) across Chao Phraya River (from 1950 CE). */
const DechatiwongBridge: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={[1, k, 1]}>
      {/* Concrete piers in river */}
      {[-1.4, 0.0, 1.4].map((px, idx) => (
        <mesh key={idx} position={[px, 0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.28, 0.36, 0.65, 8]} />
          <meshStandardMaterial color="#7a7f82" roughness={0.7} />
        </mesh>
      ))}

      {/* Bridge Roadway Deck */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.15, 0.85]} />
        <meshStandardMaterial color="#33373b" roughness={0.8} />
      </mesh>

      {/* Classic Green Steel Trusses (North and South sides) */}
      {[-0.38, 0.38].map((sideZ, sIdx) => (
        <group key={sIdx} position={[0, 0.95, sideZ]}>
          {/* Top chord */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[4.0, 0.08, 0.06]} />
            <meshStandardMaterial color="#226644" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Truss diagonals */}
          {[-1.5, -0.75, 0.0, 0.75, 1.5].map((tx, tIdx) => (
            <mesh key={tIdx} position={[tx, 0.0, 0]} rotation={[0, 0, (tIdx % 2 ? 1 : -1) * 0.55]} castShadow>
              <boxGeometry args={[0.06, 0.8, 0.05]} />
              <meshStandardMaterial color="#226644" roughness={0.4} metalness={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

/** Phra Chulamani Chedi atop Khao Khiriwong mountain (from 1981 CE). */
const PhraChulamaniChedi: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      {/* Multi-tiered square base platform */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.5, 2.8]} />
        <meshStandardMaterial color="#e8dfd1" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.5, 2.2]} />
        <meshStandardMaterial color="#edd698" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Golden central Chedi tower */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.7, 1.0, 1.2, 8]} />
        <meshStandardMaterial color="#f7c844" roughness={0.25} metalness={0.75} />
      </mesh>
      {/* Tall golden spire */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <coneGeometry args={[0.55, 1.6, 8]} />
        <meshStandardMaterial color="#ffd859" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Luminous spire tip */}
      <mesh position={[0, 3.7, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#fff4cc" toneMapped={false} />
      </mesh>

      {/* Four small satellite chedis at corners */}
      {[
        [-0.9, -0.9],
        [0.9, -0.9],
        [0.9, 0.9],
        [-0.9, 0.9],
      ].map(([cx, cz], idx) => (
        <group key={idx} position={[cx, 1.0, cz]}>
          <mesh castShadow>
            <coneGeometry args={[0.2, 0.6, 6]} />
            <meshStandardMaterial color="#f7c844" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** Pasan (อาคารพาสาน) - Architectural landmark at Koh Yom confluence (from 2019 CE). */
const PasanLandmark: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      {/* Curved organic sweeping bridge-like buildings */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.45, 0.7]} />
        <meshStandardMaterial color="#b85d38" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Intertwining elevated curved ramp */}
      <mesh position={[0.2, 0.75, 0.1]} rotation={[0.15, -0.2, 0.1]} castShadow>
        <boxGeometry args={[1.8, 0.35, 0.55]} />
        <meshStandardMaterial color="#c96d44" roughness={0.35} metalness={0.3} />
      </mesh>
      {/* Raised viewing promontory */}
      <mesh position={[-0.8, 0.95, -0.15]} castShadow>
        <boxGeometry args={[0.7, 0.6, 0.6]} />
        <meshStandardMaterial color="#d47b52" roughness={0.3} metalness={0.3} />
      </mesh>
    </group>
  );
};

export const NakhonSawanLandmarks: React.FC<LandmarkProps> = ({Y, terrainH}) => {
  const at = (p: [number, number]) => [p[0], terrainH(p[0], p[1]), p[1]] as [number, number, number];
  const kWatNakhonSawan = ramp(Y, 1357, 1365);
  const kSanKhuMoat = ramp(Y, 1357, 1365);                                // ancient ditch and bank
  const kSanKhuFort = ramp(Y, 1780, 1785) * (1 - ramp(Y, 1835, 1855));   // Rama I's palisade and tower
  const kTeakRafts = ramp(Y, 1850, 1860);
  const kThepharak = ramp(Y, 1870, 1880);
  const kDragon = ramp(Y, 1901, 1908);
  const kDechatiwong = ramp(Y, 1950, 1953);
  const kChulamani = ramp(Y, 1981, 1985);
  const kPasan = ramp(Y, 2019, 2021);

  return (
    <group>
      {/* Wat Nakhon Sawan */}
      <AncientWatNakhonSawan pos={at(WAT_NAKHON_SAWAN)} k={kWatNakhonSawan} />

      {/* San Khu Redoubt */}
      <SanKhuRedoubt pos={at(SAN_KHU)} kMoat={kSanKhuMoat} kFort={kSanKhuFort} />

      {/* Floating Teak Rafts along Chao Phraya */}
      <TeakRafts pos={[TEAK_RAFTS[0], 0, TEAK_RAFTS[1]]} k={kTeakRafts} />

      {/* Chao Pho Thepharak Chinese Shrine */}
      <ThepharakShrine pos={at(THEPHARAK_SHRINE)} k={kThepharak} />

      {/* Golden Dragon Parade */}
      <GoldenDragonParade pos={at(DRAGON_PARADE)} k={kDragon} />

      {/* Dechatiwong Steel Bridge */}
      <DechatiwongBridge pos={[DECHATIWONG_BRIDGE[0], 0, DECHATIWONG_BRIDGE[1]]} k={kDechatiwong} />

      {/* Phra Chulamani Chedi on mountain summit */}
      <PhraChulamaniChedi pos={at(CHULAMANI_CHEDI)} k={kChulamani} />

      {/* Pasan at Koh Yom Cape */}
      <PasanLandmark pos={at(PASAN)} k={kPasan} />
    </group>
  );
};
