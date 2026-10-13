import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ramp} from '../../lib';
import {prism, SmallChedi, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';

export const WAT_SOTHON: [number, number] = [-1.2, 14];
export const FORTRESS: [number, number] = [0, 0];
export const CITY_PILLAR: [number, number] = [0.6, -1.8];
export const BAN_MAI: [number, number] = [-1.8, -10];
export const RAIL_BRIDGE: [number, number] = [-4.8, -14];

export const HX = 1.75;
export const HZ = 3.38;

/** Luang Pho Sothon Buddha image placed outside viharn on riverfront terrace so drone dives see it clearly. */
const LuangPhoSothon: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k}>
      {/* Pedestal / lotus base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.4, 8]} />
        <meshStandardMaterial color="#d4a34b" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Torso & meditation posture */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <coneGeometry args={[0.45, 0.7, 6]} />
        <meshStandardMaterial color="#f7c844" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Head & halo flame (ushnisha) */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#f7c844" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <coneGeometry args={[0.07, 0.25, 5]} />
        {/* Glow flame using toneMapped={false} as required by CLAUDE.md */}
        <meshBasicMaterial color="#ffeaa7" toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Modern grand marble Ubosot of Wat Sothon with iconic high central spire (built from 1996). */
const MarbleUbosotWatSothon: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  const roofT1 = useMemo(() => prism(3.2, 1.5, 4.2), []);
  const roofT2 = useMemo(() => prism(2.4, 1.3, 3.2), []);
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={[1, k, 1]}>
      {/* White marble base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 1.0, 4.8]} />
        <meshStandardMaterial color="#eae8e4" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Main marble hall */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 1.2, 3.8]} />
        <meshStandardMaterial color="#fdfdfd" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Tiered roofs */}
      <mesh geometry={roofT1} position={[0, 2.0, 0]} castShadow>
        <meshStandardMaterial color="#7a848d" roughness={0.5} flatShading side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={roofT2} position={[0, 2.7, 0]} castShadow>
        <meshStandardMaterial color="#88929c" roughness={0.5} flatShading side={THREE.DoubleSide} />
      </mesh>
      {/* High golden spire */}
      <mesh position={[0, 4.4, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.45, 2.6, 8]} />
        <meshStandardMaterial color="#e5b842" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 5.8, 0]}>
        <coneGeometry args={[0.08, 0.6, 6]} />
        <meshBasicMaterial color="#ffeaa7" toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Historic fortress & bastions of Chachoengsao (1834 CE - Rama III). */
const FortressAndCannons: React.FC<{k: number}> = ({k}) => {
  if (k < 0.02) return null;
  const brickMat = <meshStandardMaterial color="#914c3e" roughness={0.9} flatShading />;
  const cannonMat = <meshStandardMaterial color="#2d3436" metalness={0.8} roughness={0.4} />;

  // Corner bastions at northwest and southwest river corners
  return (
    <group scale={[1, k, 1]}>
      {/* Northwest Bastion */}
      <group position={[-HX, 0, -HZ]}>
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.4, 1.2]} />
          {brickMat}
        </mesh>
        <mesh position={[-0.2, 1.5, 0]} rotation-z={0.1} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.7, 6]} />
          {cannonMat}
        </mesh>
      </group>

      {/* Southwest Bastion */}
      <group position={[-HX, 0, HZ]}>
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.4, 1.2]} />
          {brickMat}
        </mesh>
        <mesh position={[-0.2, 1.5, 0]} rotation-z={0.1} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.7, 6]} />
          {cannonMat}
        </mesh>
      </group>

      {/* River-facing curtain wall segment with crenellations */}
      <mesh position={[-HX, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.2, HZ * 1.8]} />
        {brickMat}
      </mesh>
    </group>
  );
};

/** City Pillar Shrine (ศาลหลักเมือง) - white Thai pavilion with golden prang spire. */
const CityPillarShrine: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={[k, k, k]}>
      {/* Platform */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.4, 1.6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {/* Pavilion Columns & Walls */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.1, 0.8, 1.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
      {/* Multi-tier red roof */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <coneGeometry args={[1.0, 0.6, 4]} />
        <meshStandardMaterial color="#a93226" roughness={0.7} />
      </mesh>
      {/* Golden spire */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[0.2, 0.8, 6]} />
        <meshStandardMaterial color="#f1c40f" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

/** Talat Ban Mai (100-year riverside wooden shophouses on stilts). */
const TalatBanMai: React.FC<{pos: [number, number, number]; k: number}> = ({pos, k}) => {
  if (k < 0.02) return null;
  const woodMat = <meshStandardMaterial color="#6d4c41" roughness={0.9} flatShading />;
  const roofMat = <meshStandardMaterial color="#546e7a" roughness={0.7} flatShading />;

  return (
    <group position={pos} scale={k}>
      {/* Boardwalk along the river bank */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.1, 4.0]} />
        {woodMat}
      </mesh>
      {/* Shophouses row */}
      {[-1.4, -0.4, 0.6, 1.4].map((zOff, idx) => (
        <group key={idx} position={[0.4, 0.2, zOff]}>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.8, 0.8]} />
            {woodMat}
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow>
            <coneGeometry args={[0.7, 0.4, 4]} />
            {roofMat}
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** Eastern Railway Bridge across the Bang Pakong River (1908 CE). */
const EasternRailwayBridge: React.FC<{k: number}> = ({k}) => {
  if (k < 0.02) return null;
  const steelMat = <meshStandardMaterial color="#212121" metalness={0.9} roughness={0.3} />;
  const pierMat = <meshStandardMaterial color="#78909c" roughness={0.8} />;

  return (
    <group position={[RAIL_BRIDGE[0], 0, RAIL_BRIDGE[1]]} scale={[1, k, 1]}>
      {/* River piers */}
      {[-1.5, 0, 1.5].map((xOff, i) => (
        <mesh key={i} position={[xOff, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.8, 0.8]} />
          {pierMat}
        </mesh>
      ))}
      {/* Steel Truss bridge deck */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[4.2, 0.15, 0.6]} />
        {steelMat}
      </mesh>
      {/* Steel truss sides */}
      {[-0.25, 0.25].map((zOff, i) => (
        <mesh key={i} position={[0, 1.15, zOff]} castShadow>
          <boxGeometry args={[4.0, 0.5, 0.05]} />
          {steelMat}
        </mesh>
      ))}
    </group>
  );
};

/** 1848 Ang-Yi Secret Society rebellion clash at the north fort wall. */
const AngYiClash1848: React.FC<{k: number}> = ({k}) => {
  if (k < 0.02) return null;
  return (
    <group position={[0, 0, -HZ - 0.8]} scale={k}>
      {/* Rebel flags and fighters */}
      {[-0.8, -0.3, 0.2, 0.7].map((xOff, i) => (
        <group key={i} position={[xOff, 0.3, -0.5 - (i % 2) * 0.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.6, 5]} />
            <meshStandardMaterial color="#c0392b" roughness={0.8} />
          </mesh>
          {/* Red banner */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.3, 0.2, 0.04]} />
            <meshStandardMaterial color="#e74c3c" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {/* Smoke puffs from firearms */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.45, 6, 6]} />
        <meshStandardMaterial color="#dcdde1" roughness={1.0} transparent opacity={0.75} />
      </mesh>
    </group>
  );
};

export const ChachoengsaoLandmarks: React.FC<LandmarkProps> = ({Y, terrainH}) => {

  // Luang Pho Sothon enshrinement from 1770
  const kSothon = ramp(Y, 1768, 1772);
  const kModernUbosot = ramp(Y, 1995, 2004);

  // Fortress & City Pillar from 1834
  const kFortress = ramp(Y, 1833, 1836);
  const kPillar = ramp(Y, 1834, 1837);

  // Ang-Yi rebellion in 1848
  const kAngYi = ramp(Y, 1847.8, 1848.2) * (1 - ramp(Y, 1848.9, 1849.3));

  // Talat Ban Mai from 1880
  const kBanMai = ramp(Y, 1878, 1885);

  // Eastern Railway bridge from 1908
  const kRailBridge = ramp(Y, 1907, 1909);

  return (
    <group>
      {/* Wat Sothon complex at southern river bend */}
      <group position={[WAT_SOTHON[0], terrainH(WAT_SOTHON[0], WAT_SOTHON[1]), WAT_SOTHON[1]]}>
        {kModernUbosot < 0.95 && (
          <group scale={1 - kModernUbosot * 0.8}>
            <Viharn pos={[0, 0, 0]} k={kSothon} rot={Math.PI / 2} scale={1.2} />
            <SmallChedi pos={[1.6, 0, 0]} scale={0.7} k={kSothon} color="#e1d4b8" />
          </group>
        )}
        {/* Golden Luang Pho Sothon image on front terrace */}
        <LuangPhoSothon pos={[0, 0, 1.8]} k={kSothon} />
        {/* Modern grand marble Ubosot */}
        <MarbleUbosotWatSothon pos={[0, 0, 0]} k={kModernUbosot} />
      </group>

      {/* Citadel fortress and bastions */}
      <group position={[FORTRESS[0], terrainH(FORTRESS[0], FORTRESS[1]), FORTRESS[1]]}>
        <FortressAndCannons k={kFortress} />
      </group>

      {/* City Pillar Shrine */}
      <CityPillarShrine
        pos={[CITY_PILLAR[0], terrainH(CITY_PILLAR[0], CITY_PILLAR[1]), CITY_PILLAR[1]]}
        k={kPillar}
      />

      {/* Talat Ban Mai riverside market */}
      <TalatBanMai
        pos={[BAN_MAI[0], terrainH(BAN_MAI[0], BAN_MAI[1]), BAN_MAI[1]]}
        k={kBanMai}
      />

      {/* Eastern Railway Bridge */}
      <EasternRailwayBridge k={kRailBridge} />

      {/* 1848 Ang-Yi clash */}
      <AngYiClash1848 k={kAngYi} />
    </group>
  );
};
