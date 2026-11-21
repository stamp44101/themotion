import React from 'react';

import type {LandmarkProps} from '../../engine/types';
import {HipRoof} from '../../engine/parts';
import {Walker} from '../nan/figures';
import {RowBoat} from '../phetchabun/figures';
import {
  BANGPU_PAVILION, BARGES, BUILDERS, CARRIERS, FERRIES, FORTS, FORT_WORKERS, GUNBOATS, GUNS, KILN, PILGRIMS, STROLLERS,
  TOWER, TOWER_H, bargeAt, builderAt, carrierAt, chediAK, chediBK, chulaK, clamp01, clothBoatAt, clothCarryAt, fairK,
  ferryAt, fillK, flash, fortK, fortWorkerAt, gunUp, gunsK, heroK, jetAt, pierK, pilgrimAt, relicAt, RUNWAY_GAP, RUNWAY_L,
  shipAt, shrineK, siltK, smooth, strollerAt, terminalK, wrapK,
} from './actors';
import {Chedi, Dust, FlatWater, GiantChedi, GOLD, LIME, RED_CLOTH, Water, shapeOf} from './Hero';
import {AIRPORT, BANGPU, BRIDGE_SPANS, CHEDI, CHULA, HERO_S, PIER, PILLAR, RIVER, RUNWAY_ROT, SWAMP} from './places';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; r?: number}> = ({p, s, c, r = 0}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} />
  </mesh>
);
/** a muzzle flash and its smoke, self-lit so it reads at noon */
const Flash: React.FC<{k: number; s?: number}> = ({k, s = 1}) =>
  k <= 0.01 ? null : (
    <group>
      <mesh scale={0.35 * s * (0.4 + k)}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffd27a" toneMapped={false} transparent opacity={k} />
      </mesh>
      <mesh position={[0, 0.5 * s * (1 - k), 0]} scale={0.6 * s * (1.4 - k)}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#e9e4dc" toneMapped={false} transparent opacity={0.7 * (1 - k * 0.5)} />
      </mesh>
    </group>
  );

// ------------------------------------------------------------------ the real chedi, its temple, and the island's builders
const RealChedi: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const a = chediAK(t, Y);
  if (a < 0.01 || (heroK(t) > 0.35 && Y < 1820)) return null;
  const b = chediBK(t, Y);
  const growing = b > 0.01 && b < 0.99;
  return (
    <group position={[CHEDI[0], 0, CHEDI[1]]}>
      <Chedi
        H={2.0 + 0.9 * b}
        width={1 + 0.1 * b}
        built={Math.min(1, a / 0.8)}
        wash={smooth((a - 0.82) / 0.18)}
        spire={b}
        scaffold={a < 0.99 || growing ? 1 : 0}
        wrap={wrapK(t, Y)}
      />
      {/* the viharn beside it and the low wall round the compound (Rama III) */}
      {a > 0.99 && (
        <group>
          <group position={[1.15, 0, 0.55]} rotation-y={Math.PI / 2} scale={0.55}>
            <Box p={[0, 0.3, 0]} s={[1.0, 0.6, 1.8]} c={LIME} />
            <HipRoof w={1.2} l={2.0} h={0.55} y={0.6} color="#9a3a24" />
          </group>
          {[[0, -1.25, 2.4, 0.08], [0, 1.25, 2.4, 0.08], [-1.2, 0, 0.08, 2.5], [1.75, 0, 0.08, 2.5]].map(([x, z, w, l], i) => (
            <Box key={i} p={[x, 0.08, z]} s={[w, 0.16, l]} c="#ece6d6" />
          ))}
        </group>
      )}
    </group>
  );
};
const IslandWork: React.FC<{t: number}> = ({t}) => (
  <group>
    {Array.from({length: BUILDERS}, (_, i) => {
      const b = builderAt(i, t);
      return b ? (
        <group key={i} position={[b[0], 0, b[1]]} rotation-y={i * 1.3 + t * 0.5} scale={0.4}>
          <Walker step={t * 1.3 + i} i={i} load={i % 2 === 0} />
        </group>
      ) : null;
    })}
  </group>
);

// ------------------------------------------------------------------ Rama II's forts and the town's pillar
/** a low brick fort with bastions at the corners, whitewashed, cannons in its embrasures; `k` rising, `gone` sinking */
const Fort: React.FC<{k: number; s?: number}> = ({k, s = 1}) =>
  k < 0.02 ? null : (
    <group scale={[s, s * k, s]}>
      {[[0, -0.7, 1.5, 0.12], [0, 0.7, 1.5, 0.12], [-0.7, 0, 0.12, 1.5], [0.7, 0, 0.12, 1.5]].map(([x, z, w, l], i) => (
        <Box key={i} p={[x, 0.22, z]} s={[w, 0.44, l]} c="#e8e1cf" />
      ))}
      {[[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]].map(([x, z], i) => (
        <Box key={i} p={[x, 0.27, z]} s={[0.36, 0.54, 0.36]} c="#ddd5c0" r={Math.PI / 4} />
      ))}
      {Array.from({length: 4}, (_, i) => (
        <mesh key={i} position={[-0.45 + i * 0.3, 0.5, -0.78]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.045, 0.06, 0.4, 8]} />
          <meshStandardMaterial color="#2e2c2a" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
      <Box p={[0, 0.05, 0]} s={[1.3, 0.1, 1.3]} c="#b9ad8e" />
    </group>
  );
const Town: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  // Prakhon Chai and Narai Prap Suek are gone today (only Phi Suea Samut and Phra Chula remain): they sink in the grow years
  const gone = smooth((Y - 1948) / 14);
  return (
    <group>
      {FORTS.map(([x, z], j) => (
        <group key={j} position={[x, 0, z]} rotation-y={0.2}>
          <Fort k={fortK(j, t, Y) * (j === 0 ? 1 : 1 - gone)} s={j === 0 ? 0.95 : 1} />
        </group>
      ))}
      {/* the city pillar's shrine */}
      {shrineK(t, Y) > 0.02 && (
        <group position={[PILLAR[0], 0, PILLAR[1]]} scale={[0.7, 0.7 * shrineK(t, Y), 0.7]}>
          <Box p={[0, 0.15, 0]} s={[1.0, 0.3, 1.0]} c="#efe8d8" />
          <Box p={[0, 0.55, 0]} s={[0.7, 0.5, 0.7]} c="#f4efe2" />
          <HipRoof w={0.95} l={0.95} h={0.5} y={0.8} color="#b0382a" />
          <mesh position={[0, 1.5, 0]}>
            <coneGeometry args={[0.07, 0.3, 6]} />
            <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.35} />
          </mesh>
        </group>
      )}
      {/* the brick yard on the east bank: stacks and a smoking kiln while the town is built */}
      {Y > 1818.9 && Y < 1830 && (
        <group position={[KILN[0], 0, KILN[1]]}>
          {[[-0.4, 0], [0.4, 0.2], [0, 0.5]].map(([x, z], i) => (
            <Box key={i} p={[x, 0.15, z]} s={[0.5, 0.3, 0.35]} c="#a8503a" />
          ))}
          <mesh position={[0.2, 0.35, -0.5]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 0.7, 10]} />
            <meshStandardMaterial color="#7a4a36" roughness={0.9} />
          </mesh>
          <group position={[0.2, 0.9, -0.5]}>
            <Dust u={(t * 0.8) % 1} seed={Math.floor(t * 0.8)} S={1.6} color="#d9d2c6" n={6} />
          </group>
        </group>
      )}
      {Array.from({length: CARRIERS}, (_, i) => {
        const p = carrierAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.4}>
            <Walker step={t * 1.6 + i * 0.3} i={i} load={p.load} />
          </group>
        ) : null;
      })}
      {Array.from({length: FERRIES}, (_, i) => {
        const p = ferryAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.08, p.z]} rotation-y={p.rot} scale={0.55}>
            <RowBoat row={t * 1.2 + i} i={i} />
            <Box p={[0, 0.3, 0]} s={[0.5, 0.25, 0.9]} c="#a8503a" />
          </group>
        ) : null;
      })}
    </group>
  );
};

// ------------------------------------------------------------------ raise: the royal barges and the relic
const Barge: React.FC<{t: number; i: number; red?: boolean}> = ({t, i, red}) => (
  <group>
    <mesh position={[0, 0.12, 0]} scale={[0.32, 0.18, 1.9]} castShadow>
      <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      <meshStandardMaterial color={i === 0 ? '#7a1a14' : '#4a2618'} roughness={0.6} side={2} />
    </mesh>
    <Box p={[0, 0.2, 0]} s={[0.12, 0.05, 2.6]} c={GOLD} />
    {/* the prow rising at the bow */}
    <mesh position={[0, 0.45, 1.8]} rotation-x={-0.4}>
      <coneGeometry args={[0.1, 0.8, 6]} />
      <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.4} />
    </mesh>
    {/* the pavilion amidships (a busabok) on the lead barge, or the red cloth's bundle */}
    {i === 0 && !red && (
      <group position={[0, 0.2, 0]}>
        <Box p={[0, 0.3, 0]} s={[0.4, 0.6, 0.5]} c="#c9302a" />
        <mesh position={[0, 0.85, 0]}>
          <coneGeometry args={[0.32, 0.6, 4]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
        </mesh>
      </group>
    )}
    {red && (
      <mesh position={[0, 0.32, 0]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.2, 0.2, 2.2, 10]} />
        <meshBasicMaterial color={RED_CLOTH} toneMapped={false} />
      </mesh>
    )}
    {/* the paddlers, white-coated, in two files */}
    {Array.from({length: 8}, (_, k) => (
      <group key={k} position={[(k % 2 ? 0.2 : -0.2), 0.12, -1.3 + Math.floor(k / 2) * 0.55 + (i === 0 && Math.floor(k / 2) === 2 ? 0.0 : 0)]} scale={0.22}>
        <mesh position={[0, 0.6, 0]}>
          <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
          <meshStandardMaterial color={red ? '#f4f1ea' : '#e9e2d0'} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.16, 8, 6]} />
          <meshStandardMaterial color="#a8714a" roughness={0.9} />
        </mesh>
        <mesh position={[(k % 2 ? 0.45 : -0.45), 0.4, 0]} rotation={[Math.sin(t * 6 + k) * 0.6, 0, (k % 2 ? -1 : 1) * 0.5]}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 5]} />
          <meshStandardMaterial color="#6b4a2a" />
        </mesh>
      </group>
    ))}
  </group>
);
const Raise: React.FC<{t: number}> = ({t}) => {
  const r = relicAt(t);
  return (
    <group>
      {Array.from({length: BARGES}, (_, i) => {
        const p = bargeAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.08, p.z]} rotation-y={p.rot} scale={0.62}>
            <Barge t={t} i={i} />
          </group>
        ) : null;
      })}
      {r && (
        <group position={[r.x, 0, r.z]}>
          {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map(([x, z], i) => (
            <group key={i} position={[x, 0, z]} scale={0.38}>
              <Walker step={t * 1.6 + i * 0.5} i={i} />
            </group>
          ))}
          <Box p={[0, 0.72, 0]} s={[0.5, 0.08, 0.7]} c="#6b3a20" />
          <mesh position={[0, 0.95, 0]}>
            <coneGeometry args={[0.18, 0.45, 4]} />
            <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ Phra Chulachomklao fort and the fight of ร.ศ. 112
/** an earth-and-brick fort, its sea face toward +x; `k` rising */
const Chula: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = chulaK(t, Y);
  if (k < 0.02) return null;
  const g = gunsK(t, Y);
  return (
    <group>
      <group position={[CHULA[0], 0, CHULA[1]]} scale={[1, k, 1]}>
        {/* the ramparts: a grassy bank round a parade ground, faced in brick toward the sea */}
        {[[1.4, 0, 0.5, 4.6], [-1.6, 0, 0.5, 4.2], [0, -2.2, 3.4, 0.5], [0, 2.2, 3.4, 0.5]].map(([x, z, w, l], i) => (
          <Box key={i} p={[x, 0.24, z]} s={[w, 0.48, l]} c="#6f8a4a" />
        ))}
        <Box p={[0, 0.04, 0]} s={[3.0, 0.08, 4.0]} c="#b7aa86" />
        {/* the flag: red with the white elephant (the flag of 2436) */}
        <Box p={[-0.6, 1.3, -0.4]} s={[0.05, 2.6, 0.05]} c="#e8e4dc" />
        <mesh position={[-0.6, 2.35, -0.05]}>
          <boxGeometry args={[0.03, 0.5, 0.7]} />
          <meshBasicMaterial color="#c8202a" toneMapped={false} />
        </mesh>
        <mesh position={[-0.58, 2.35, -0.05]}>
          <boxGeometry args={[0.03, 0.2, 0.28]} />
          <meshBasicMaterial color="#f4f1ea" toneMapped={false} />
        </mesh>
      </group>
      {/* the seven disappearing guns (ปืนเสือหมอบ): they rise to fire and drop back into their pits */}
      {g > 0.02 &&
        GUNS.map(([x, z], i) => {
          const up = gunUp(i, t);
          const f = flash(i, t);
          return (
            <group key={i} position={[x, 0, z]} scale={g}>
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.32, 0.36, 0.3, 14]} />
                <meshStandardMaterial color="#9a9384" roughness={0.9} />
              </mesh>
              <group position={[0, 0.3 + up * 0.35, 0]} rotation-z={-0.15 - up * 0.1}>
                <mesh position={[0.35, 0, 0]} rotation-z={Math.PI / 2} castShadow>
                  <cylinderGeometry args={[0.07, 0.1, 0.9, 10]} />
                  <meshStandardMaterial color="#2a2a2a" roughness={0.45} metalness={0.5} />
                </mesh>
                {up > 0.8 && (
                  <group position={[0.85, 0.05, 0]}>
                    <Flash k={f} s={1.3} />
                  </group>
                )}
              </group>
            </group>
          );
        })}
      {Array.from({length: FORT_WORKERS}, (_, i) => {
        const p = fortWorkerAt(i, t);
        return p ? (
          <group key={i} position={[p[0], 0, p[1]]} rotation-y={i + t * 0.35} scale={0.4}>
            <Walker step={t * 1.4 + i} i={i} load={i % 2 === 0} />
          </group>
        ) : null;
      })}
    </group>
  );
};
/** a French warship of 1893: black hull, white upperworks, two funnels, the tricolour at the stern; along +z */
const Warship: React.FC<{t: number; i: number}> = ({t, i}) => (
  <group>
    <mesh position={[0, 0.2, 0]} scale={[0.42, 0.28, 1.9]} castShadow>
      <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      <meshStandardMaterial color="#1f2328" roughness={0.6} side={2} />
    </mesh>
    <Box p={[0, 0.27, 0]} s={[0.78, 0.12, 3.4]} c="#2a2e33" />
    <Box p={[0, 0.48, -0.2]} s={[0.5, 0.3, 1.4]} c="#ece8de" />
    {[0.25, -0.45].map((z, k) => (
      <mesh key={k} position={[0, 0.85, z]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.55, 10]} />
        <meshStandardMaterial color="#c9a55a" roughness={0.6} />
      </mesh>
    ))}
    <Box p={[0, 1.1, 0.6]} s={[0.04, 1.4, 0.04]} c="#4a3a2a" />
    {/* the tricolour */}
    {['#1f3f9a', '#f4f1ea', '#c8202a'].map((c, k) => (
      <mesh key={k} position={[0, 0.85, -1.75 - k * 0.14]}>
        <boxGeometry args={[0.02, 0.24, 0.14]} />
        <meshBasicMaterial color={c} toneMapped={false} />
      </mesh>
    ))}
    {/* funnel smoke trailing astern */}
    {[0, 1, 2].map((k) => {
      const u = ((t * 1.5 + k / 3 + i * 0.2) % 1 + 1) % 1;
      return (
        <mesh key={k} position={[0, 1.2 + u * 0.6, 0.2 - u * 1.6]} scale={0.18 + u * 0.3}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#5a5550" toneMapped={false} transparent opacity={0.75 * (1 - u)} />
        </mesh>
      );
    })}
    <group position={[0.45, 0.55, 0.9]}>
      <Flash k={flash(10 + i, t)} />
    </group>
  </group>
);
/** a small Siamese gunboat: white hull, one funnel, the red elephant flag */
const Gunboat: React.FC<{t: number; i: number}> = ({t, i}) => (
  <group>
    <mesh position={[0, 0.14, 0]} scale={[0.28, 0.2, 1.1]} castShadow>
      <sphereGeometry args={[1, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      <meshStandardMaterial color="#e8e4da" roughness={0.6} side={2} />
    </mesh>
    <Box p={[0, 0.3, -0.1]} s={[0.3, 0.2, 0.8]} c="#d8d2c4" />
    <mesh position={[0, 0.55, 0]}>
      <cylinderGeometry args={[0.07, 0.07, 0.4, 8]} />
      <meshStandardMaterial color="#3a3a3a" />
    </mesh>
    <mesh position={[0, 0.6, -0.95]}>
      <boxGeometry args={[0.02, 0.18, 0.28]} />
      <meshBasicMaterial color="#c8202a" toneMapped={false} />
    </mesh>
    <group position={[0, 0.4, 0.9]}>
      <Flash k={flash(20 + i, t)} s={0.8} />
    </group>
  </group>
);
const Fight: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (t < 19.5 || t > 28.4) return null;
  return (
    <group>
      {[0, 1].map((i) => {
        const p = shipAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.08, p.z]} rotation-y={p.rot} scale={0.9}>
            <Warship t={t} i={i} />
          </group>
        ) : null;
      })}
      {Y > 1892 &&
        GUNBOATS.map(([x, z], i) => (
          <group key={i} position={[x, 0.08, z]} rotation-y={Math.PI + 0.4 + i * 0.3} scale={0.8}>
            <Gunboat t={t} i={i} />
          </group>
        ))}
    </group>
  );
};

// ------------------------------------------------------------------ Bang Pu: the resort and its pier
const BangPu: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = pierK(t, Y);
  if (k < 0.01) return null;
  const L = PIER[1][1] - PIER[0][1];
  const len = L * k;
  return (
    <group>
      {/* the pier on its piles, out to sea */}
      <group position={[PIER[0][0], 0, PIER[0][1]]}>
        <Box p={[0, 0.42, len / 2 - 0.6]} s={[0.55, 0.08, len + 1.2]} c="#c9b38a" />
        {Array.from({length: Math.max(1, Math.floor(len / 0.8))}, (_, i) => (
          <Box key={i} p={[0, 0.2, i * 0.8]} s={[0.5, 0.4, 0.06]} c="#7a6248" />
        ))}
      </group>
      {/* the pavilion at its end (ศาลาสุขตา) */}
      {k > 0.98 && (
        <group position={[BANGPU_PAVILION[0], 0.46, BANGPU_PAVILION[1]]}>
          <Box p={[0, 0.02, 0]} s={[1.6, 0.06, 1.3]} c="#d8c7a0" />
          {[[-0.65, -0.5], [0.65, -0.5], [-0.65, 0.5], [0.65, 0.5]].map(([x, z], i) => (
            <Box key={i} p={[x, 0.32, z]} s={[0.08, 0.6, 0.08]} c="#f1ece0" />
          ))}
          <HipRoof w={1.8} l={1.5} h={0.55} y={0.62} color="#b0382a" />
        </group>
      )}
      {/* the resort's houses on the shore */}
      {[[-1.4, 0.4], [0.2, -0.6], [1.6, 0.3]].map(([x, z], i) => {
        // a growing mesh is gated on its own scale: a zero scale blacked out the whole frame under bloom ([local], 28.2 s)
        const hk = clamp01(k * 2 - i * 0.3);
        return hk < 0.02 ? null : (
        <group key={i} position={[BANGPU[0] + x, 0, BANGPU[1] + z]} scale={[0.75, 0.75 * hk, 0.75]}>
          <Box p={[0, 0.3, 0]} s={[1.2, 0.6, 0.9]} c="#f1ece0" />
          <HipRoof w={1.4} l={1.1} h={0.45} y={0.6} color="#9a3a24" />
        </group>
        );
      })}
      {Array.from({length: STROLLERS}, (_, i) => {
        const p = strollerAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.46, p.z]} rotation-y={p.rot} scale={0.32}>
            <Walker step={t * 1.2 + i * 0.4} i={i + 1} />
          </group>
        ) : null;
      })}
      {/* gulls over the pier */}
      {Y > 1975 || (t > 27 && t < 34)
        ? Array.from({length: 9}, (_, i) => {
            const a = t * 0.7 + i * 0.7;
            const flap = Math.sin(t * 9 + i) * 0.5;
            return (
              <group key={i} position={[PIER[0][0] + Math.cos(a) * (1.4 + (i % 3) * 0.5), 1.4 + (i % 4) * 0.3, PIER[0][1] + 2.4 + Math.sin(a) * 1.6]} rotation-y={-a}>
                {[-1, 1].map((s) => (
                  <mesh key={s} position={[s * 0.18, 0, 0]} rotation-z={s * flap}>
                    <boxGeometry args={[0.34, 0.02, 0.1]} />
                    <meshBasicMaterial color="#ffffff" toneMapped={false} />
                  </mesh>
                ))}
              </group>
            );
          })
        : null}
    </group>
  );
};

// ------------------------------------------------------------------ the Bhumibol twin bridges (2549)
const Bridges: React.FC<{Y: number}> = ({Y}) => {
  if (Y < 2005.7) return null;
  return (
    <group>
      {BRIDGE_SPANS.map(([a, b], i) => {
        const cx = (a[0] + b[0]) / 2;
        const cz = (a[1] + b[1]) / 2;
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const rot = Math.atan2(b[0] - a[0], b[1] - a[1]);
        return (
          <group key={i} position={[cx, 0, cz]} rotation-y={rot}>
            <Box p={[0, 0.9, 0]} s={[0.7, 0.14, len + 1.0]} c="#d9d6cf" />
            {[-len * 0.22, len * 0.22].map((z, j) => (
              <group key={j} position={[0, 0, z]}>
                {/* an A-shaped pylon */}
                {[-1, 1].map((s) => (
                  <mesh key={s} position={[s * 0.3, 2.6, 0]} rotation-z={s * -0.08} castShadow>
                    <boxGeometry args={[0.22, 5.2, 0.26]} />
                    <meshStandardMaterial color="#e9e6df" roughness={0.6} />
                  </mesh>
                ))}
                {/* the cable fan */}
                {Array.from({length: 5}, (_, c) =>
                  [-1, 1].map((d) => {
                    const dz = d * (0.5 + c * 0.55);
                    const h = 4.9 - 0.9;
                    const L = Math.hypot(dz, h);
                    return (
                      <mesh key={`${c}${d}`} position={[0, 0.95 + h / 2, dz / 2]} rotation-x={Math.atan2(dz, h)}>
                        <cylinderGeometry args={[0.015, 0.015, L, 4]} />
                        <meshStandardMaterial color="#f2c230" roughness={0.5} />
                      </mesh>
                    );
                  }),
                )}
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ Suvarnabhumi on the old cobra swamp
const SWAMP_SHAPE = shapeOf(SWAMP);
const Jet: React.FC<{pitch: number}> = ({pitch}) => (
  <group rotation-x={pitch}>
    <mesh rotation-x={Math.PI / 2} castShadow>
      <capsuleGeometry args={[0.2, 2.6, 4, 10]} />
      <meshStandardMaterial color="#f4f5f7" roughness={0.4} />
    </mesh>
    <Box p={[0, -0.02, 0.15]} s={[3.2, 0.06, 0.6]} c="#dfe3e8" />
    <Box p={[0, 0.02, -1.35]} s={[1.2, 0.05, 0.35]} c="#dfe3e8" />
    <mesh position={[0, 0.45, -1.4]}>
      <boxGeometry args={[0.06, 0.7, 0.5]} />
      <meshStandardMaterial color="#5b2a86" roughness={0.5} />
    </mesh>
    {[-0.8, 0.8].map((x) => (
      <mesh key={x} position={[x, -0.18, 0.35]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.12, 0.12, 0.5, 10]} />
        <meshStandardMaterial color="#b8bec6" roughness={0.4} />
      </mesh>
    ))}
  </group>
);
const Airport: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const f = fillK(Y);
  const tk = terminalK(Y);
  return (
    <group>
      {/* the swamp, then the sand fill over it */}
      <FlatWater shape={SWAMP_SHAPE} color={f > 0.5 ? '#9fae6e' : '#5f8a76'} y={-0.03} />
      {f > 0.62 &&
        [-1, 1].map((r) => {
          const [x, z] = [AIRPORT[0] + Math.cos(RUNWAY_ROT) * r * RUNWAY_GAP, AIRPORT[1] + Math.sin(RUNWAY_ROT) * r * RUNWAY_GAP];
          return (
            <group key={r} position={[x, 0.12, z]} rotation-y={-RUNWAY_ROT} scale={[1, 1, Math.max(0.03, smooth((f - 0.6) / 0.4))]}>
              <Box p={[0, 0, 0]} s={[0.9, 0.04, RUNWAY_L]} c="#4a4d52" />
              {Array.from({length: 12}, (_, i) => (
                <Box key={i} p={[0, 0.03, -RUNWAY_L / 2 + 0.8 + i * 1.45]} s={[0.08, 0.02, 0.6]} c="#f2f2f2" />
              ))}
            </group>
          );
        })}
      {tk > 0.02 && (
        <group position={[AIRPORT[0], 0, AIRPORT[1]]} rotation-y={-RUNWAY_ROT}>
          {/* the apron and the long terminal under its arched roof, the concourse fingers */}
          <Box p={[0, 0.1, 0]} s={[3.2, 0.04, 9]} c="#9a9ea4" />
          <group scale={[1, tk, 1]}>
            <Box p={[0, 0.45, 2.8]} s={[2.4, 0.7, 2.2]} c="#c5ccd4" />
            <mesh position={[0, 0.8, 2.8]} rotation-z={Math.PI / 2} scale={[0.45, 1, 1]}>
              <cylinderGeometry args={[1, 1, 2.5, 20, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#dfe5ec" roughness={0.3} metalness={0.3} side={2} />
            </mesh>
            {[-1.8, 0, 1.8].map((z, i) => (
              <Box key={i} p={[0, 0.3, z - 1.4]} s={[2.4, 0.35, 0.35]} c="#c9cfd6" />
            ))}
            <Box p={[0, 0.3, -3.0]} s={[0.4, 0.35, 3.6]} c="#c9cfd6" />
          </group>
        </group>
      )}
      {/* the control tower (132 m, drawn tall) */}
      {tk > 0.02 && (
        <group position={[TOWER[0], 0, TOWER[1]]} scale={[1, tk, 1]}>
          <mesh position={[0, TOWER_H / 2, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.32, TOWER_H, 12]} />
            <meshStandardMaterial color="#e6e9ec" roughness={0.5} />
          </mesh>
          <mesh position={[0, TOWER_H + 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.35, 0.5, 12]} />
            <meshStandardMaterial color="#5f8fb3" roughness={0.2} metalness={0.4} />
          </mesh>
        </group>
      )}
      {[0, 1, 2].map((i) => {
        const p = jetAt(i, t, Y);
        return p ? (
          <group key={i} position={[p.x, p.y, p.z]} rotation-y={p.rot} scale={0.85}>
            <Jet pitch={p.pitch} />
          </group>
        ) : null;
      })}
    </group>
  );
};

// ------------------------------------------------------------------ the fair: the red cloth by barge, the crowd round the chedi
const Fair: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = fairK(t, Y);
  if (k < 0.02) return null;
  const c = clothCarryAt(t);
  return (
    <group>
      {[0, 1, 2].map((i) => {
        const p = clothBoatAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.08, p.z]} rotation-y={p.rot} scale={0.55}>
            <Barge t={t} i={i} red={i === 0} />
          </group>
        ) : null;
      })}
      {c && (
        <group position={[c.x, 0, c.z]}>
          {Array.from({length: 6}, (_, i) => (
            <group key={i} position={[(i % 2 ? 0.25 : -0.25), 0, -0.6 + Math.floor(i / 2) * 0.6]} scale={0.36}>
              <Walker step={t * 1.6 + i * 0.5} i={i} />
            </group>
          ))}
          <mesh position={[0, 0.66, 0]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.12, 0.12, 1.8, 10]} />
            <meshBasicMaterial color={RED_CLOTH} toneMapped={false} />
          </mesh>
        </group>
      )}
      {Array.from({length: PILGRIMS}, (_, i) => {
        const [x, z] = pilgrimAt(i, t);
        return (
          <group key={i} position={[x, 0, z]} rotation-y={-t * 0.45 - (i / PILGRIMS) * Math.PI * 2} scale={0.32 * k}>
            <Walker step={t * 1.2 + i * 0.3} i={i} />
          </group>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ river traffic: junks and rice boats, later steamers
const RIVER_L = RIVER.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - RIVER[i][0], p[1] - RIVER[i][1]), 0);
const onRiver = (d: number, off: number) => {
  let r = ((d % RIVER_L) + RIVER_L) % RIVER_L;
  for (let i = 1; i < RIVER.length; i++) {
    const [ax, az] = RIVER[i - 1];
    const [bx, bz] = RIVER[i];
    const len = Math.hypot(bx - ax, bz - az);
    if (r <= len) {
      const u = r / len;
      return {x: ax + (bx - ax) * u + ((bz - az) / len) * off, z: az + (bz - az) * u - ((bx - ax) / len) * off, rot: Math.atan2(bx - ax, bz - az)};
    }
    r -= len;
  }
  return {x: RIVER[RIVER.length - 1][0], z: RIVER[RIVER.length - 1][1], rot: 0};
};
const Junk: React.FC<{modern: boolean}> = ({modern}) =>
  modern ? (
    <group>
      <Box p={[0, 0.15, 0]} s={[0.6, 0.3, 2.6]} c="#3a4a5a" />
      <Box p={[0, 0.45, -0.8]} s={[0.5, 0.35, 0.6]} c="#eeeeee" />
    </group>
  ) : (
    <group>
      <mesh position={[0, 0.15, 0]} scale={[0.35, 0.22, 1.2]} castShadow>
        <sphereGeometry args={[1, 12, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#5a3d26" roughness={0.8} side={2} />
      </mesh>
      <Box p={[0, 0.9, 0.1]} s={[0.04, 1.6, 0.04]} c="#4a3a2a" />
      <mesh position={[0, 1.0, 0.1]}>
        <boxGeometry args={[0.03, 1.1, 0.9]} />
        <meshStandardMaterial color="#c97a3a" roughness={0.9} side={2} />
      </mesh>
    </group>
  );
const Traffic: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  // off during the beats that put their own boats on the water at Pak Nam and the mouth
  if ((t > 9.2 && t < 15.8) || (t > 20.4 && t < 27.6) || (t > 48.8 && t < 55.4)) return null;
  return (
    <group>
      {Array.from({length: 5}, (_, i) => {
        const dir = i % 2 ? -1 : 1;
        const p = onRiver(RIVER_L * (0.3 + i * 0.13) + dir * t * 0.9, dir * 1.1);
        if (p.z > 36) return null;
        return (
          <group key={i} position={[p.x, 0.08, p.z]} rotation-y={p.rot + (dir < 0 ? Math.PI : 0)} scale={0.8}>
            <Junk modern={Y > 1900} />
          </group>
        );
      })}
    </group>
  );
};

export const SamutPrakanLandmarks: React.FC<LandmarkProps> = ({Y, t}) => (
  <group>
    <Water silt={siltK(Y)} />
    <group position={[CHEDI[0], 0, CHEDI[1]]}>
      <GiantChedi t={t} S={HERO_S} />
    </group>
    <RealChedi t={t} Y={Y} />
    <IslandWork t={t} />
    <Town t={t} Y={Y} />
    <Raise t={t} />
    <Chula t={t} Y={Y} />
    <Fight t={t} Y={Y} />
    <BangPu t={t} Y={Y} />
    <Bridges Y={Y} />
    <Airport t={t} Y={Y} />
    <Fair t={t} Y={Y} />
    <Traffic t={t} Y={Y} />
  </group>
);

