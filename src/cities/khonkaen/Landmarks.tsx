import React from 'react';
import {lathe} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp, smooth} from '../../lib';
import {caravanAt, heroStupa, reservoirK, sauropodAt, tiersUp, truckAt} from './actors';
import {DAM, KKU, LAKE_PATH, STUPA, THUNG_SANG} from './places';
import * as THREE from 'three';

export {CENTRAL, DAM, KKU, LAKE, PHU_WIANG, STATION, STUPA, THUNG_SANG} from './places';

// ------------------------------------------------------------------ พระมหาธาตุแก่นนคร
// nine square tiers stepping in, white with gilt trim, a gilded Isan spire. Real: ~50 m base,
// 80 m tall (0.6 x 1 unit); drawn 5x so it reads from the lake-wide shots, and 2.2x that at
// frame 0 as the opening hero. `tiers` 0 -> 9 builds it.
const SPIRE = lathe([[0, 0], [1.1, 0], [1.05, 0.5], [0.75, 1.1], [0.5, 1.8], [0.32, 2.6], [0.16, 3.6], [0.06, 4.3], [0, 4.7]], 12);
export const NineTier: React.FC<{tiers: number; night: number}> = ({tiers, night}) => (
  <group>
    {Array.from({length: 9}, (_, i) => {
      const k = Math.max(0, Math.min(1, tiers - i));
      if (k <= 0.01) return null;
      const w = 6 - i * 0.55;
      return (
        <group key={i} position={[0, i * 1.0, 0]}>
          <mesh position={[0, 0.5 * k, 0]} scale={[1, k, 1]} castShadow receiveShadow>
            <boxGeometry args={[w, 1.0, w]} />
            <meshStandardMaterial color="#f4efe3" emissive="#ffe2a8" emissiveIntensity={night * 0.55} />
          </mesh>
          <mesh position={[0, 0.98 * k, 0]} scale={[1, k, 1]}>
            <boxGeometry args={[w + 0.12, 0.08, w + 0.12]} />
            <meshStandardMaterial color="#d9a43a" metalness={0.5} roughness={0.35} emissive="#ffc861" emissiveIntensity={night * 1.4} toneMapped={false} />
          </mesh>
        </group>
      );
    })}
    {tiers > 9 && (
      <mesh geometry={SPIRE} position={[0, 9, 0]} scale={[1, Math.min(1, tiers - 9), 1]} castShadow>
        {/* floodlit at night; untone-mapped so ACES does not wash the glow out */}
        <meshStandardMaterial color="#e2b33c" metalness={0.6} roughness={0.3} emissive="#ffcf6a" emissiveIntensity={night * 1.4} toneMapped={false} />
      </mesh>
    )}
  </group>
);

// ------------------------------------------------------------------ Phuwiangosaurus
const Sauropod: React.FC<{t: number; i: number; s: number; color: string; terrainH: LandmarkProps['terrainH']}> = ({t, i, s, color, terrainH}) => {
  const {x, z, rot} = sauropodAt(i, t);
  const step = Math.sin(t * 4 + i);
  const m = <meshStandardMaterial color={color} flatShading roughness={0.9} />;
  return (
    <group position={[x, terrainH(x, z), z]} rotation-y={rot} scale={s}>
      <mesh position={[0, 2.1, 0]} scale={[2.2, 1.05, 1.15]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        {m}
      </mesh>
      <mesh position={[2.4, 3.6, 0]} rotation-z={-0.75} castShadow>
        <cylinderGeometry args={[0.25, 0.55, 3.6, 7]} />
        {m}
      </mesh>
      <mesh position={[3.75, 5.0, 0]} scale={[0.55, 0.32, 0.36]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        {m}
      </mesh>
      <mesh position={[-3.3, 1.6, 0]} rotation-z={1.4} castShadow>
        <coneGeometry args={[0.5, 3.8, 7]} />
        {m}
      </mesh>
      {[[1.2, 0.6], [1.2, -0.6], [-1.2, 0.6], [-1.2, -0.6]].map(([lx, lz], j) => (
        <mesh key={j} position={[lx, 0.8, lz]} rotation-z={step * 0.25 * (j % 3 === 0 ? 1 : -1)} castShadow>
          <cylinderGeometry args={[0.3, 0.26, 1.7, 7]} />
          {m}
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ the 1797 caravan
const OxCart: React.FC<{t: number; i: number}> = ({t, i}) => {
  const step = Math.sin(t * 6 + i);
  return (
    <group scale={0.9}>
      <mesh position={[0, 0.5, -0.5]} castShadow>
        <boxGeometry args={[0.8, 0.4, 1.1]} />
        <meshStandardMaterial color="#8a5a34" />
      </mesh>
      <mesh position={[0, 0.85, -0.5]} scale={[1, 0.6, 1]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 1.1, 8, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#c9b48a" side={2} />
      </mesh>
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.32, -0.5]} rotation-z={Math.PI / 2}>
          <torusGeometry args={[0.3, 0.05, 5, 12]} />
          <meshStandardMaterial color="#5b3a22" />
        </mesh>
      ))}
      <mesh position={[0, 0.55, 0.7]} scale={[0.32, 0.3, 0.6]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#e6dcc8" flatShading />
      </mesh>
      {[[0.15, 0.95], [-0.15, 0.95], [0.15, 0.45], [-0.15, 0.45]].map(([lx, lz], j) => (
        <mesh key={j} position={[lx, 0.2, lz]} rotation-x={step * 0.3 * (j % 3 ? 1 : -1)}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 5]} />
          <meshStandardMaterial color="#e6dcc8" />
        </mesh>
      ))}
      {[[0.5, 0.2], [-0.5, -0.1]].map(([px, pz], j) => (
        <group key={j} position={[px, 0, pz]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 0.45, 6]} />
            <meshStandardMaterial color={j ? '#3d4f7a' : '#8e2e2e'} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.08, 6, 5]} />
            <meshStandardMaterial color="#c99a72" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ Mittraphap convoy
const Truck: React.FC = () => (
  <group>
    <mesh position={[0, 0.45, 0.35]} castShadow>
      <boxGeometry args={[0.6, 0.6, 1.2]} />
      <meshStandardMaterial color="#556b3a" />
    </mesh>
    <mesh position={[0, 0.4, -0.55]} castShadow>
      <boxGeometry args={[0.55, 0.5, 0.5]} />
      <meshStandardMaterial color="#4a5e32" />
    </mesh>
    <mesh position={[0, 0.72, 0.35]}>
      <boxGeometry args={[0.62, 0.05, 1.22]} />
      <meshStandardMaterial color="#6b7f4a" />
    </mesh>
  </group>
);

// ------------------------------------------------------------------ Ubolratana dam
const Dam: React.FC<{k: number; built: number}> = ({k, built}) => {
  if (built < 0.02) return null;
  const [x, z] = DAM;
  return (
    <group position={[x, 0, z]} scale={1.5}>
      {/* the reservoir spreads up the valley behind the wall as it fills */}
      <mesh position={[-3, 0.18 + 0.1 * k, -1]} rotation-x={-Math.PI / 2} scale={[0.2 + 0.8 * k, 0.2 + 0.8 * k, 1]}>
        <circleGeometry args={[5, 24]} />
        <meshStandardMaterial color="#3f8fc0" roughness={0.25} metalness={0.1} />
      </mesh>
      {/* the wall runs NE-SW across the Nam Phong, on the reservoir's south-east shore */}
      <mesh position={[0.8, 0.7 * built, 2.8]} rotation-y={0.785} scale={[1, built, 1]} castShadow receiveShadow>
        <boxGeometry args={[8, 1.4, 0.9]} />
        <meshStandardMaterial color="#cfcac0" roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 1.45 * built, 2.8]} rotation-y={0.785}>
        <boxGeometry args={[8, 0.06, 1.0]} />
        <meshStandardMaterial color="#8a8578" />
      </mesh>
      {/* the river below the dam, out toward the plain */}
      <mesh position={[3, 0.06, 5]} rotation-y={0.785}>
        <boxGeometry args={[0.8, 0.02, 6]} />
        <meshStandardMaterial color="#3f8fc0" />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ KKU
const Campus: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group position={[KKU[0], 0, KKU[1]]}>
      {[[-2, -1, 1.6, 1.2], [1.5, -1.5, 1.2, 1.8], [0, 1.5, 2.2, 1.0], [2.5, 1.8, 1.0, 1.4], [-2.6, 2, 1.2, 0.9]].map(([x, z, w, h], i) => (
        <mesh key={i} position={[x, (h * k) / 2, z]} scale={[1, k, 1]} castShadow>
          <boxGeometry args={[w, h, w * 0.7]} />
          <meshStandardMaterial color={i % 2 ? '#e8dccb' : '#d9cdb8'} />
        </mesh>
      ))}
      <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[8, 7]} />
        <meshStandardMaterial color="#7fae5a" />
      </mesh>
    </group>
  );

// ------------------------------------------------------------------ the lakes
const lakeShape = new THREE.Shape(LAKE_PATH.map(([x, z]) => new THREE.Vector2(x, -z)));
const Lake: React.FC = () => (
  <>
    <mesh position={[0, 0.06, 0]} rotation-x={-Math.PI / 2} receiveShadow>
      <shapeGeometry args={[lakeShape, 24]} />
      <meshStandardMaterial color="#3f8fc0" roughness={0.25} metalness={0.1} />
    </mesh>
    <mesh position={[THUNG_SANG[0], 0.06, THUNG_SANG[1]]} rotation-x={-Math.PI / 2} scale={[3, 2.2, 1]} receiveShadow>
      <circleGeometry args={[1, 20]} />
      <meshStandardMaterial color="#3f8fc0" roughness={0.25} metalness={0.1} />
    </mesh>
  </>
);

export const KhonKaenLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH, beat}) => {
  const ctx = {Y, beat};
  const hero = heroStupa(t, ctx);
  // built across the stupa beat (motion on the beat), standing from then on (visibility on the year)
  const tiers = Y >= 1996.45 ? 10 : Y >= 1996 ? Math.min(10, tiersUp(ctx) * 10) : 0;
  const dinos = 1 - ramp(Y, -1.28e8, -1.0e8);
  const carts = [0, 1, 2, 3, 4].map((i) => caravanAt(i, ctx));
  const trucks = [0, 1, 2, 3, 4, 5].map((i) => truckAt(i, ctx));
  const damBuilt = smooth(ramp(Y, 1964.2, 1965.4));
  const campus = smooth(ramp(Y, 1965, 1972));
  return (
    <>
      {hero.k > 0.02 && (
        <group position={[STUPA[0], terrainH(STUPA[0], STUPA[1]), STUPA[1]]} scale={2.2 * hero.k}>
          <NineTier tiers={10} night={night} />
        </group>
      )}
      {tiers > 0 && (
        <group position={[STUPA[0], 0, STUPA[1]]} scale={0.7}>
          <NineTier tiers={tiers} night={night} />
        </group>
      )}
      {dinos > 0.02 && (
        <>
          <Sauropod t={t} i={0} s={2.6 * dinos} color="#c8642e" terrainH={terrainH} />
          <Sauropod t={t} i={1} s={1.5 * dinos} color="#d9a441" terrainH={terrainH} />
        </>
      )}
      {carts.map((c, i) =>
        c ? (
          <group key={i} position={[c.x, 0, c.z]} rotation-y={c.rot}>
            <OxCart t={t} i={i} />
          </group>
        ) : null,
      )}
      {trucks.map((c, i) =>
        c ? (
          <group key={i} position={[c.x, 0.05, c.z]} rotation-y={c.rot} scale={1.1}>
            <Truck />
          </group>
        ) : null,
      )}
      <Lake />
      <Dam k={reservoirK(Y)} built={damBuilt} />
      <Campus k={campus} />
    </>
  );
};
