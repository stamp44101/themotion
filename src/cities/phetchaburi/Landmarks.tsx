import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {Army} from '../../engine/army';
import {lathe, Prang, prism, SmallChedi, updateInstances, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp, smooth} from '../../lib';
import {boatAt, cartAt, FLEET, fireK, heroK, siege, towersUp, WEST_ARMY_Z} from './actors';
import {BAN_PUEN, BANG_CHAN, eastWallX, KAMPHAENG_LAENG, MAHATHAT, PEAK_E, PEAK_M, PEAK_W, RAIL_X, RIVER, WAT_YAI} from './places';

export {BAN_PUEN, KAMPHAENG_LAENG, MAHATHAT, PEAK_E, PEAK_M, PEAK_W, STATION, WAT_YAI} from './places';

// ------------------------------------------------------------------ ตาลโตนด
// Phetchaburi's plain is sugar palms standing on paddy bunds, not a closed canopy. A thin
// trunk and a round crown of fronds, scattered over the plain away from the river, the town,
// the ridge and the line; each palm goes when the modern town reaches it.
const riverDist = (x: number, z: number) => {
  let best = 1e9;
  for (let i = 1; i < RIVER.length; i++) {
    const [ax, az] = RIVER[i - 1];
    const [bx, bz] = RIVER[i];
    const dx = bx - ax;
    const dz = bz - az;
    const u = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    best = Math.min(best, Math.hypot(x - ax - u * dx, z - az - u * dz));
  }
  return best;
};
const PALMS = (() => {
  const out: {x: number; z: number; h: number; reach: number}[] = [];
  for (let i = 0; out.length < 520 && i < 6000; i++) {
    const x = (random(`px${i}`) - 0.5) * 92;
    const z = (random(`pz${i}`) - 0.5) * 92;
    if (riverDist(x, z) < 1.4) continue;
    if (x > -7.5 && x < 8 && z > -9.5 && z < 10) continue; // the walled town and its banks
    if ([PEAK_W, PEAK_M, PEAK_E].some(([px, pz]) => Math.hypot(x - px, z - pz) < 5)) continue;
    if (Math.abs(x - RAIL_X) < 1.8 && z < -12) continue;
    if (Math.hypot(x - BAN_PUEN[0], z - BAN_PUEN[1]) < 2.4) continue;
    if (Math.hypot(x - MAHATHAT[0], z - MAHATHAT[1]) < 2) continue;
    // the modern town grows out from the walls at about 2 years per unit (index.ts urban)
    const fromWalls = Math.max(0, Math.hypot(Math.max(0, Math.abs(x) - 6), Math.max(0, Math.abs(z) - 8)));
    out.push({x, z, h: 1.8 + random(`ph${i}`) * 0.6, reach: 1930 + 2.0 * fromWalls + random(`pr${i}`) * 6});
  }
  return out;
})();
const Palms: React.FC<{Y: number; terrainH: LandmarkProps['terrainH']}> = ({Y, terrainH}) => {
  const trunk = useRef<THREE.InstancedMesh>(null);
  const crown = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    updateInstances(trunk.current, PALMS.length, (i, o) => {
      const p = PALMS[i];
      if (Y > p.reach) return false;
      o.position.set(p.x, terrainH(p.x, p.z) + p.h / 2, p.z);
      o.scale.set(1, p.h, 1);
      return true;
    });
    updateInstances(crown.current, PALMS.length, (i, o) => {
      const p = PALMS[i];
      if (Y > p.reach) return false;
      o.position.set(p.x, terrainH(p.x, p.z) + p.h + 0.12, p.z);
      o.rotation.set(0, i, 0);
      return true;
    });
  });
  return (
    <>
      <instancedMesh ref={trunk} args={[undefined, undefined, PALMS.length]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 1, 5]} />
        <meshStandardMaterial color="#6e5a44" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crown} args={[undefined, undefined, PALMS.length]} castShadow>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#4f7d3a" roughness={0.9} flatShading />
      </instancedMesh>
    </>
  );
};

// ------------------------------------------------------------------ วัดกำแพงแลง
// five laterite prangs in the Bayon plan inside a low laterite wall; real towers ~15 m,
// drawn ~6x so they read from the opening's whole-tile shot as they rise
const LATERITE = '#8e4c32';
const KamphaengLaeng: React.FC<{k: number}> = ({k}) => (
  <group position={[KAMPHAENG_LAENG[0], 0, KAMPHAENG_LAENG[1]]}>
    <Prang pos={[0, 0, 0]} k={k} scale={0.62} color={LATERITE} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
      <Prang key={i} pos={[sx * 1.9, 0, sz * 1.9]} k={Math.max(0, Math.min(1, k * 1.25 - 0.1 * i))} scale={0.4} color={LATERITE} />
    ))}
    {k > 0.05 &&
      [[0, -3.0, 6.2, 0.3], [0, 3.0, 6.2, 0.3], [-3.0, 0, 0.3, 6.2], [3.0, 0, 0.3, 6.2]].map(([x, z, w, l], i) => (
        <mesh key={`w${i}`} position={[x, 0.25 * k, z]} scale={[1, k, 1]} castShadow receiveShadow>
          <boxGeometry args={[w, 0.5, l]} />
          <meshStandardMaterial color={LATERITE} roughness={1} />
        </mesh>
      ))}
  </group>
);

// ------------------------------------------------------------------ วัดมหาธาตุวรวิหาร
// the white five-prang group, the town's tallest skyline, with its cloister
const WHITE = '#f3efe6';
const Mahathat: React.FC<{k: number; night: number}> = ({k, night}) => (
  <group position={[MAHATHAT[0], 0, MAHATHAT[1]]}>
    <Prang pos={[0, 0, 0]} k={k} scale={0.7} color={WHITE} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
      <Prang key={i} pos={[sx * 1.5, 0, sz * 1.5]} k={k} scale={0.34} color={WHITE} />
    ))}
    {k > 0.05 && (
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[4.0, 0.4, 4.0]} />
        <meshStandardMaterial color="#d8cfbd" roughness={1} emissive="#ffd28a" emissiveIntensity={night * 0.25} />
      </mesh>
    )}
  </group>
);

// ------------------------------------------------------------------ พระนครคีรี
// Khao Wang's three crowns, each on its own peak (heights from terrainH): the palace group on
// the west peak, พระธาตุจอมเพชร (built over an older chedi) on the middle one, วัดพระแก้วน้อย
// on the east. Floodlit at night (untone-mapped so ACES does not wash the glow out).
const BELL = lathe([[0, 0], [1.2, 0], [1.2, 0.35], [1.0, 0.4], [1.0, 0.7], [0.95, 1.1], [0.85, 1.5], [0.6, 1.85], [0.32, 2.0], [0.3, 2.3], [0.16, 2.5], [0.1, 3.4], [0.04, 3.9], [0, 4.1]], 16);
const Glow: React.FC<{color: string; night: number; base?: number}> = ({color, night, base = 0}) => (
  <meshStandardMaterial color={color} roughness={0.6} emissive="#ffd27a" emissiveIntensity={base + night * 0.9} />
);
// `g` grows the whole group (sizes and spacing) for the frame-0 hero; 1 for the real palace
const KhaoWang: React.FC<{k: number; g?: number; old: number; night: number; terrainH: LandmarkProps['terrainH']}> = ({k, g = 1, old, night, terrainH}) => {
  const roof = useMemo(() => prism(1.3, 0.55, 1.8), []);
  const at = (p: [number, number], dx = 0, dz = 0): [number, number, number] => [p[0] + dx * g, terrainH(p[0] + dx * g, p[1] + dz * g) - 0.05, p[1] + dz * g];
  const kk = (a: number, b: number) => smooth(ramp(k, a, b));
  return (
    <>
      {/* the older chedi on the summit, grey, before Rama IV built the new one over it */}
      <SmallChedi pos={at(PEAK_M)} scale={0.7 * g} k={old * (1 - kk(0.25, 0.5))} color="#9b958a" />
      {/* พระธาตุจอมเพชร */}
      {/* gated on its own scale: a mesh at y-scale 0 gets a singular normal matrix, NaN shading,
          and the shader look's bloom spreads the NaN over the whole frame (PR #53, 22.17 s) */}
      {kk(0.2, 0.6) > 0.02 && (
        <mesh geometry={BELL} position={at(PEAK_M)} scale={[0.8 * g, 0.8 * g * kk(0.2, 0.6), 0.8 * g]} castShadow>
          <Glow color={WHITE} night={night} />
        </mesh>
      )}
      {/* the palace group: three halls and the domed observatory หอชัชวาลเวียงชัย */}
      {[
        [-1.3, 0.5, 0],
        [-0.6, -1.4, 1.57],
        [1.0, -1.5, 1.2],
      ].map(([dx, dz, r], i) => {
        const s = kk(0.35 + i * 0.08, 0.7 + i * 0.08);
        if (s < 0.02) return null;
        return (
          <group key={i} position={at(PEAK_W, dx, dz)} rotation-y={r} scale={[1.2 * g, 1.2 * g * s, 1.2 * g]}>
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.7, 1.6]} />
              <Glow color="#f2ece0" night={night} />
            </mesh>
            <mesh geometry={roof} position={[0, 0.7, 0]} castShadow>
              <meshStandardMaterial color="#7f8a92" roughness={0.7} flatShading side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
      {kk(0.55, 0.85) > 0.02 && (
        <group position={at(PEAK_W, 0.3, -0.2)} scale={[1.3 * g, 1.3 * g * kk(0.55, 0.85), 1.3 * g]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.36, 1.6, 12]} />
            <Glow color="#f5f0e4" night={night} />
          </mesh>
          <mesh position={[0, 1.6, 0]} castShadow>
            <sphereGeometry args={[0.36, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Glow color="#e9e4da" night={night} />
          </mesh>
        </group>
      )}
      {/* วัดพระแก้วน้อย: a small marble-grey ubosot and its prang */}
      <Viharn pos={at(PEAK_E, 0.8, 0.4)} k={kk(0.45, 0.8)} rot={0.1} scale={0.7 * g} />
      <Prang pos={at(PEAK_E, 0.5, -1.1)} k={kk(0.5, 0.85)} scale={0.34 * g} color="#e6e2da" />
    </>
  );
};

// the frame-0 hero's hill: three wooded lobes at the real peaks and heights, so scaled up it
// still reads as Khao Wang (the real terrain is inside it)
export const RIDGE: [number, number] = [-20.2, -5.8];
const HeroMound: React.FC<{terrainH: LandmarkProps['terrainH']}> = ({terrainH}) => (
  <>
    {([[PEAK_W, 2.3], [PEAK_M, 2.0], [PEAK_E, 1.8]] as [[number, number], number][]).map(([p, r], i) => (
      <mesh key={i} position={[p[0], 0, p[1]]} scale={[r, terrainH(p[0], p[1]) + 0.1, r]} castShadow receiveShadow>
        <sphereGeometry args={[1, 10, 7, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4c7a37" roughness={0.95} flatShading />
      </mesh>
    ))}
  </>
);

// ------------------------------------------------------------------ พระรามราชนิเวศน์
// two pale storeys under steep red roofs, a round corner tower; real ~100 m long, drawn ~2.4x
const BanPuen: React.FC<{k: number; night: number}> = ({k, night}) => {
  const roof = useMemo(() => prism(1.5, 0.8, 3.4), []);
  if (k < 0.02) return null;
  return (
    <group position={[BAN_PUEN[0], 0, BAN_PUEN[1]]} rotation-y={0.2} scale={[1.5, 1.5 * k, 1.5]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.1, 3.2]} />
        <meshStandardMaterial color="#efe3c4" roughness={0.85} emissive="#ffd28a" emissiveIntensity={night * 0.3} />
      </mesh>
      <mesh geometry={roof} position={[0, 1.1, 0]} castShadow>
        <meshStandardMaterial color="#a8432e" roughness={0.75} flatShading side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.8, 0.75, -1.4]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 1.5, 12]} />
        <meshStandardMaterial color="#efe3c4" roughness={0.85} />
      </mesh>
      <mesh position={[0.8, 1.75, -1.4]} castShadow>
        <coneGeometry args={[0.46, 0.7, 12]} />
        <meshStandardMaterial color="#a8432e" roughness={0.75} flatShading />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ the 2124 siege
const WarBoat: React.FC = () => (
  <group>
    <mesh position={[0, 0.15, 0]} castShadow>
      <boxGeometry args={[0.45, 0.26, 2.6]} />
      <meshStandardMaterial color="#5a3a24" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.42, 0.3]} castShadow>
      <boxGeometry args={[0.4, 0.28, 0.7]} />
      <meshStandardMaterial color="#7c2a20" roughness={0.9} />
    </mesh>
    {[-0.8, -0.3, 0.2, 0.7].map((z, i) => (
      <mesh key={i} position={[0, 0.48, z]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.32, 5]} />
        <meshStandardMaterial color="#3a2a22" roughness={0.9} />
      </mesh>
    ))}
  </group>
);
// a timber หอรบ on the wall; burning flames and a smoke column while `f` > 0
const Tower: React.FC<{x: number; z: number; f: number; t: number}> = ({x, z, f, t}) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 1.1, 0]} castShadow>
      <boxGeometry args={[0.9, 2.2, 0.9]} />
      <meshStandardMaterial color={f > 0.3 ? '#3b2a20' : '#7a5232'} roughness={0.95} />
    </mesh>
    {f > 0.02 &&
      [0, 1, 2, 3].map((i) => {
        const fl = 0.75 + 0.25 * Math.sin(t * 17 + i * 2.1);
        return (
          <mesh key={i} position={[(i % 2 - 0.5) * 0.4, 2.4 + 0.25 * i, ((i >> 1) - 0.5) * 0.4]} scale={[f * fl, f * fl * 1.5, f * fl]}>
            <coneGeometry args={[0.32, 1.0, 6]} />
            <meshBasicMaterial color={i % 2 ? '#ffb02e' : '#ff6a1c'} toneMapped={false} />
          </mesh>
        );
      })}
    {f > 0.02 &&
      [0, 1, 2, 3, 4].map((i) => {
        const a = (t * 0.6 + i / 5) % 1;
        return (
          <mesh key={`s${i}`} position={[0.4 * a, 3 + a * 4.5, -0.6 * a]} scale={f * (0.5 + a * 1.2)}>
            <sphereGeometry args={[0.6, 7, 6]} />
            <meshStandardMaterial color="#5b5550" transparent opacity={0.55 * (1 - a)} depthWrite={false} />
          </mesh>
        );
      })}
  </group>
);
const Cart: React.FC = () => (
  <group>
    <mesh position={[0, 0.45, 0]} castShadow>
      <boxGeometry args={[0.6, 0.3, 1.0]} />
      <meshStandardMaterial color={LATERITE} roughness={1} />
    </mesh>
    {[-0.36, 0.36].map((x) => (
      <mesh key={x} position={[x, 0.3, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.3, 0.3, 0.08, 10]} />
        <meshStandardMaterial color="#4a3424" roughness={1} />
      </mesh>
    ))}
    <mesh position={[0, 0.45, 1.0]} castShadow>
      <boxGeometry args={[0.45, 0.45, 0.8]} />
      <meshStandardMaterial color="#8a8172" roughness={1} />
    </mesh>
  </group>
);

export const PhetchaburiLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH, beat}) => {
  const ctx = {Y, beat};
  const towers = Y >= 1185 ? towersUp(Y, ctx) : 0;
  const mahathat = smooth(ramp(Y, 1440, 1470));
  const watYai = smooth(ramp(Y, 1680, 1700));
  // the palace rises across its beat and stands from then on
  const palace = Y >= 1862.45 ? 1 : Y >= 1859 ? beat('palace') : 0;
  const hero = heroK(ctx);
  const banPuen = Y >= 1916.45 ? 1 : Y >= 1910 ? smooth(ramp(beat('banpuen'), 0.05, 0.85)) : 0;
  const {west, east, town} = siege(t, ctx);
  const f = fireK(ctx);
  const gateX = eastWallX(BANG_CHAN[1]);
  return (
    <>
      <Palms Y={Y} terrainH={terrainH} />
      <KamphaengLaeng k={towers} />
      <Mahathat k={mahathat} night={night} />
      <Viharn pos={[WAT_YAI[0], 0, WAT_YAI[1]]} k={watYai} rot={0} scale={0.8} />
      {/* frame 0: the crowns at hero scale on the ridge (the cover frame), gone by the first
          caption; the real palace rises in its own beat */}
      <KhaoWang k={palace} old={Y >= 1300 ? 1 : 0} night={night} terrainH={terrainH} />
      {hero > 0.02 && (
        // the whole hill as a model, scaled about the ridge's centre so nothing collides
        <group position={[RIDGE[0], 0, RIDGE[1]]} scale={1 + 2.2 * hero}>
          <group position={[-RIDGE[0], 0, -RIDGE[1]]}>
            <HeroMound terrainH={terrainH} />
            <KhaoWang k={hero} old={0} night={night} terrainH={terrainH} />
          </group>
        </group>
      )}
      <BanPuen k={banPuen} night={night} />
      {[0, 1, 2, 3].map((i) => {
        const c = cartAt(i, ctx);
        return c ? (
          <group key={i} position={[c.x, 0, c.z]} rotation-y={c.rot}>
            <Cart />
          </group>
        ) : null;
      })}
      {Array.from({length: FLEET}, (_, i) => {
        const b = boatAt(i, ctx);
        return b ? (
          <group key={i} position={[b.x, 0, b.z]} rotation-y={b.rot}>
            <WarBoat />
          </group>
        ) : null;
      })}
      <Army f={west} color="#7c2a20" terrainH={terrainH} />
      <Army f={east} color="#7c2a20" terrainH={terrainH} />
      <Army f={town} color="#e8e2d0" terrainH={terrainH} />
      {Y >= 1500 && Y < 1700 && (
        <>
          <Tower x={-5.3} z={WEST_ARMY_Z} f={f} t={t} />
          <Tower x={gateX - 0.2} z={BANG_CHAN[1] - 1.6} f={f} t={t} />
        </>
      )}
    </>
  );
};
