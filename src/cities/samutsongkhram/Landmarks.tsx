import React from 'react';
import * as THREE from 'three';
import type {LandmarkProps} from '../../engine/types';
import {HipRoof} from '../../engine/parts';
import {Walker} from '../nan/figures';
import {
  BUDDHA_H, BURMESE, CAMP_R, CATCH_BOATS, DIGGERS, MARKET_BOATS, N_BASKETS, PACK_END, RIVER_HOUSES, SHOPS, STALLS,
  STEAM0, THAI, TRAY_R, TRUCKS, awningOpen, basketAt, buddhaK, burmeseAt, catchBoatAt, clamp01, diggerAt, diggersK, fortK,
  gunK, marketBoatAt, netK, packAt, riverHouseK, shopK, smooth, stallK, thaiAt, trayK, truckAt, watK,
} from './actors';
import {BANG_KUNG, FORT, NET_AT, RAIL_Z, SEA, TRAY_AT, TRAY_S, WAT_PHET} from './places';

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

/** a puff that bursts out and fades, self-lit so it reads at noon (spray, steam, gun smoke) */
const Puff: React.FC<{u: number; seed: number; S: number; color: string; n?: number; up?: number}> = ({u, seed, S, color, n = 12, up = 0.6}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.3 + hash(seed * 3 + i) * 0.5);
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * sp * u, (up + hash(seed * 7 + i) * 0.6) * sp * u, Math.sin(a) * sp * u]}
            scale={S * 0.09 * (1 - u) * (0.6 + hash(i + seed) * 0.6)}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1 - u} />
          </mesh>
        );
      })}
    </group>
  );
};
/** a puff that repeats every `period` seconds */
const Loop: React.FC<{t: number; period: number; seed: number; S: number; color: string; n?: number; up?: number}> = ({t, period, seed, ...p}) => (
  <Puff u={(((t % period) + period) % period) / period} seed={seed * 13 + Math.floor(t / period)} {...p} />
);

// ------------------------------------------------------------------ the pla thu (the cover)
const SEA_BACK = new THREE.Color('#5d86a8');
const SEA_BELLY = new THREE.Color('#f2f5f7');
const STEAMED_BACK = new THREE.Color('#a8864e');
const STEAMED_BELLY = new THREE.Color('#f3dca6');
const BAMBOO = '#d6c08a';

/** one pla thu, along +x, nose at +x; its head bent sharply down (the packing, not the breed) */
const Fish: React.FC<{len: number; cook: number}> = ({len, cook}) => {
  const back = SEA_BACK.clone().lerp(STEAMED_BACK, cook);
  const belly = SEA_BELLY.clone().lerp(STEAMED_BELLY, cook);
  return (
    <group>
      <mesh position={[0, len * 0.06, 0]} scale={[len * 0.42, len * 0.15, len * 0.12]} castShadow>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color={belly} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, len * 0.14, 0]} scale={[len * 0.4, len * 0.09, len * 0.1]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color={back} roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh position={[-len * 0.47, len * 0.08, 0]} rotation-z={Math.PI / 2} scale={[1, 1, 0.25]}>
        <coneGeometry args={[len * 0.14, len * 0.2, 3]} />
        <meshStandardMaterial color={back} roughness={0.5} />
      </mesh>
      <group position={[len * 0.36, len * 0.08, 0]} rotation-z={-1.15}>
        <mesh position={[len * 0.1, 0, 0]} scale={[len * 0.15, len * 0.12, len * 0.11]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color={belly} roughness={0.3} metalness={0.1} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[len * 0.15, len * 0.03, s * len * 0.09]}>
            <sphereGeometry args={[len * 0.03, 8, 6]} />
            <meshStandardMaterial color="#111" roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/** a small raw-bamboo basket (เข่ง), radius b, its three fish curled round the wall */
const Basket: React.FC<{b: number; fill: number; cook: number; seed: number}> = ({b, fill, cook, seed}) => (
  <group>
    <mesh position={[0, b * 0.3, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[b, b * 0.85, b * 0.6, 20, 1, true]} />
      <meshStandardMaterial color={BAMBOO} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, b * 0.02, 0]}>
      <cylinderGeometry args={[b * 0.85, b * 0.85, b * 0.04, 20]} />
      <meshStandardMaterial color="#bfa66c" roughness={0.95} />
    </mesh>
    {[0.15, 0.35, 0.58].map((f) => (
      <mesh key={f} position={[0, b * f, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[b * (0.86 + f * 0.24), b * 0.035, 5, 24]} />
        <meshStandardMaterial color="#a88d55" roughness={0.95} />
      </mesh>
    ))}
    {[0, 1, 2].map((i) => {
      const f = smooth(fill * 3 - i);
      if (f <= 0) return null;
      const a = (i * Math.PI * 2) / 3 + seed;
      return (
        <group key={i} rotation-y={a} position={[0, b * (0.12 + i * 0.1) + (1 - f) * b * 4, 0]}>
          <group position={[0, 0, b * 0.48]} rotation-y={(1 - f) * 3} rotation-x={0.25}>
            <Fish len={b * 1.5} cook={cook} />
          </group>
        </group>
      );
    })}
  </group>
);

const Tray: React.FC<{t: number}> = ({t}) => {
  const k = trayK(t);
  if (k < 0.02) return null;
  const S = TRAY_S;
  const b = S * 0.105;
  const steam = clamp01((t - STEAM0) / 1.2);
  const cook = smooth((t - STEAM0 - 0.3) / 1.6);
  const next = Array.from({length: N_BASKETS}, (_, i) => i).find((i) => packAt(i) > t);
  return (
    <group position={[TRAY_AT[0], 0, TRAY_AT[1]]} rotation-y={0.3} scale={[k, k, k]}>
      <mesh position={[0, S * 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[TRAY_R, TRAY_R * 0.97, S * 0.03, 48]} />
        <meshStandardMaterial color="#aeb4bb" roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh position={[0, S * 0.055, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[TRAY_R, S * 0.012, 8, 64]} />
        <meshStandardMaterial color="#c9ced4" roughness={0.3} metalness={0.8} />
      </mesh>
      {Array.from({length: N_BASKETS}, (_, i) => {
        const [x, z] = basketAt(i);
        const fill = clamp01((t - packAt(i)) / 0.3);
        const ph = t - STEAM0 + hash(i) * 0.9;
        return (
          <group key={i} position={[x, S * 0.07, z]}>
            <Basket b={b} fill={fill} cook={cook} seed={hash(i) * 6} />
            <Puff u={(t - packAt(i) - 0.25) / 0.45} seed={i + 5} S={b * 1.6} color="#d8f0ff" n={8} up={0.5} />
            {steam > 0 && <Puff u={(ph % 0.9) / 0.9} seed={i * 3 + Math.floor(ph / 0.9)} S={b * (t < 3.6 ? 5 : 3) * Math.min(1, steam * 3)} color="#ffffff" n={10} up={t < 3.6 ? 1.6 : 0.8} />}
          </group>
        );
      })}
      {next !== undefined && t < PACK_END && (() => {
        const [x, z] = basketAt(next);
        return (
          <group position={[x, S * 0.07 + b * 2.4, z]} rotation-y={t * 2}>
            <Fish len={b * 1.5} cook={0} />
          </group>
        );
      })()}
    </group>
  );
};

// ------------------------------------------------------------------ boats
const Boat: React.FC<{hull?: string; cover?: string; sail?: string}> = ({hull = '#5b3b22', cover = '#b89a5e', sail}) => (
  <group>
    <Box p={[0, 0.16, 0]} s={[0.55, 0.32, 2.0]} c={hull} />
    <mesh position={[0, 0.42, -0.1]} rotation-z={Math.PI / 2} scale={[0.34, 0.28, 1.0]} castShadow>
      <cylinderGeometry args={[1, 1, 1, 12, 1, false, 0, Math.PI]} />
      <meshStandardMaterial color={cover} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
    {sail && (
      <group position={[0, 0.3, 0.4]}>
        <Box p={[0, 0.7, 0]} s={[0.05, 1.4, 0.05]} c="#4a3420" />
        <Box p={[0, 0.9, 0.02]} s={[0.04, 0.8, 0.7]} c={sail} />
      </group>
    )}
  </group>
);

// ------------------------------------------------------------------ the catch: the net, the fish, the Buddha
const Catch: React.FC<{t: number}> = ({t}) => {
  if (t < 3.0 || t > 10.2) return null;
  const n = netK(t);
  const bk = buddhaK(t);
  return (
    <group>
      {Array.from({length: CATCH_BOATS}, (_, i) => {
        const p = catchBoatAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot} scale={1.3}>
            <Boat />
          </group>
        ) : null;
      })}
      <group position={[NET_AT[0], 0, NET_AT[1]]}>
        {/* the net: a dark mesh bag hauled up out of the water, silver with fish */}
        {n > 0.02 && (
          <group position={[0, -0.6 + n * 0.9, 0]}>
            <mesh scale={[1.6, 0.9 * n, 1.2]}>
              <sphereGeometry args={[1, 14, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              <meshStandardMaterial color="#3d4a4f" roughness={0.9} wireframe />
            </mesh>
            {Array.from({length: 14}, (_, i) => (
              <group key={i} position={[(hash(i) - 0.5) * 2.2, 0.1 + hash(i + 9) * 0.4, (hash(i + 4) - 0.5) * 1.6]} rotation-y={hash(i + 2) * 6} rotation-z={Math.sin(t * 9 + i) * 0.3}>
                <Fish len={0.7} cook={0} />
              </group>
            ))}
            <Loop t={t} period={0.6} seed={3} S={2.2} color="#d8f0ff" n={8} up={0.6} />
          </group>
        )}
        {/* Luang Pho Ban Laem: a gilded standing Buddha (ปางอุ้มบาตร) rising out of the net, haloed */}
        {bk > 0.02 && (
          <group position={[0, 0.3, 0]} scale={[bk, bk, bk]}>
            <mesh position={[0, BUDDHA_H * 0.38, 0]} castShadow>
              <cylinderGeometry args={[0.32, 0.55, BUDDHA_H * 0.72, 12]} />
              <meshStandardMaterial color="#d9a521" metalness={0.65} roughness={0.3} />
            </mesh>
            <mesh position={[0, BUDDHA_H * 0.8, 0]}>
              <sphereGeometry args={[0.36, 14, 10]} />
              <meshStandardMaterial color="#d9a521" metalness={0.65} roughness={0.3} />
            </mesh>
            <mesh position={[0, BUDDHA_H * 0.93, 0]}>
              <coneGeometry args={[0.16, 0.5, 10]} />
              <meshStandardMaterial color="#d9a521" metalness={0.65} roughness={0.3} />
            </mesh>
            {/* the alms bowl held in front */}
            <mesh position={[0, BUDDHA_H * 0.55, 0.38]}>
              <sphereGeometry args={[0.22, 10, 8]} />
              <meshStandardMaterial color="#c08f1a" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0, BUDDHA_H * 0.62, -0.25]}>
              <circleGeometry args={[1.5, 32]} />
              <meshBasicMaterial color="#ffe9a8" toneMapped={false} transparent opacity={0.35 * bk} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ the battle at Bang Kung
const Camp: React.FC<{t: number}> = ({t}) => {
  if (t < 9.6 || t > 17.0) return null;
  const g = gunK(t);
  return (
    <group position={[BANG_KUNG[0], 0, BANG_KUNG[1]]}>
      {/* the palisade of logs round the old wat */}
      {Array.from({length: 40}, (_, i) => {
        const a = (i / 40) * Math.PI * 2;
        return <Box key={i} p={[Math.cos(a) * CAMP_R, 0.45, Math.sin(a) * CAMP_R]} s={[0.16, 0.9 + hash(i) * 0.2, 0.16]} c="#6b4a2c" />;
      })}
      {/* the bot inside, a brick hall with a hip roof */}
      <Box p={[0, 0.4, 0]} s={[0.9, 0.8, 1.5]} c="#c9b8a0" />
      <HipRoof w={1.1} l={1.8} h={0.5} y={0.8} color="#7a3b28" />
      {/* the camp's flags (Chinese defenders' red) */}
      {[0, 1, 2].map((i) => (
        <group key={i} position={[Math.cos(i * 2.1) * CAMP_R, 0, Math.sin(i * 2.1) * CAMP_R]}>
          <Box p={[0, 1.0, 0]} s={[0.05, 2.0, 0.05]} c="#4a3420" />
          <Box p={[0.25, 1.8, 0]} s={[0.5, 0.32, 0.03]} c="#c8281e" />
        </group>
      ))}
      {/* gun smoke from the palisade toward the river */}
      {g > 0.05 &&
        [0, 1, 2].map((i) => (
          <group key={i} position={[-CAMP_R - 0.4, 0.8, -1 + i]}>
            <Loop t={t + i * 0.3} period={0.9} seed={i + 40} S={2.4 * g} color="#ece8e0" n={8} up={0.4} />
          </group>
        ))}
    </group>
  );
};
const Fleets: React.FC<{t: number}> = ({t}) => {
  if (t < 9.6 || t > 17.0) return null;
  const g = gunK(t);
  return (
    <group>
      {Array.from({length: BURMESE}, (_, i) => {
        const p = burmeseAt(i, t);
        return p ? (
          <group key={`b${i}`} position={[p.x, 0.05, p.z]} rotation-y={p.rot} scale={1.2}>
            <Boat hull="#2c2620" cover="#4a3a2a" sail="#d8d0bc" />
            {g > 0.05 && i % 2 === 0 && <Loop t={t + i * 0.4} period={1.1} seed={i + 60} S={1.8 * g} color="#ece8e0" n={6} up={0.5} />}
          </group>
        ) : null;
      })}
      {Array.from({length: THAI}, (_, i) => {
        const p = thaiAt(i, t);
        return p ? (
          <group key={`t${i}`} position={[p.x, 0.05, p.z]} rotation-y={p.rot} scale={1.25}>
            <Boat hull="#7a2a1c" cover="#d9a521" sail="#c8281e" />
            {g > 0.05 && i % 2 === 1 && <Loop t={t + i * 0.3} period={1.0} seed={i + 80} S={1.8 * g} color="#ece8e0" n={6} up={0.5} />}
          </group>
        ) : null;
      })}
    </group>
  );
};

// ------------------------------------------------------------------ Wat Ban Laem, the fort, the riverside houses
const Wat: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group position={[WAT_PHET[0], 0, WAT_PHET[1]]} scale={[1, k, 1]}>
      <Box p={[0, 0.4, 0]} s={[0.8, 0.8, 1.5]} c="#f1ead9" />
      <HipRoof w={1.0} l={1.75} h={0.55} y={0.8} color="#b0382a" />
      <group position={[0.9, 0, -0.5]}>
        <Box p={[0, 0.25, 0]} s={[0.6, 0.5, 0.6]} c="#ece6d6" />
        <mesh position={[0, 0.9, 0]} castShadow>
          <coneGeometry args={[0.26, 1.0, 10]} />
          <meshStandardMaterial color="#ece6d6" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[0.06, 0.35, 8]} />
          <meshStandardMaterial color="#d9a521" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
const Fort: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group position={[FORT[0], 0, FORT[1]]} scale={[1, k, 1]}>
      {/* a low brick-and-lime star of walls with merlons (ใบเสมา), facing the river */}
      {[
        [0, -0.7, 1.8, 0.25],
        [0, 0.7, 1.8, 0.25],
        [-0.9, 0, 0.25, 1.4],
        [0.9, 0, 0.25, 1.4],
      ].map(([x, z, w, l], i) => (
        <group key={i}>
          <Box p={[x, 0.3, z]} s={[w, 0.6, l]} c="#e9e2d0" />
          {Array.from({length: 5}, (_, j) => (
            <Box key={j} p={[x + (w > l ? (j - 2) * 0.36 : 0), 0.7, z + (w > l ? 0 : (j - 2) * 0.28)]} s={[0.16, 0.2, 0.16]} c="#e9e2d0" />
          ))}
        </group>
      ))}
      {/* cannons toward the water */}
      {[-0.35, 0.35].map((z) => (
        <mesh key={z} position={[-1.15, 0.55, z]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.07, 0.09, 0.6, 8]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
const StiltHouse: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      {[-0.25, 0.25].map((x) => [-0.25, 0.25].map((z) => <Box key={`${x}${z}`} p={[x, 0.18, z]} s={[0.07, 0.36, 0.07]} c="#5b3b22" />))}
      <Box p={[0, 0.5, 0]} s={[0.7, 0.32, 0.7]} c={i % 2 ? '#8a6040' : '#7a5236'} />
      <HipRoof w={0.85} l={0.85} h={0.42} y={0.66} color="#5a4636" />
    </group>
  );

// ------------------------------------------------------------------ the market: boats, shophouses, stalls and awnings
const Market: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const sk = stallK(t, Y);
  return (
    <group>
      {t > 29.4 && t < 35.6 &&
        Array.from({length: MARKET_BOATS}, (_, i) => {
          const p = marketBoatAt(i, t);
          return p ? (
            <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot} scale={0.9}>
              <Boat />
            </group>
          ) : null;
        })}
      {SHOPS.map((s, j) => {
        const k = shopK(j, t, Y);
        return k < 0.02 ? null : (
          <group key={j} position={[s.x, 0, s.z]} scale={[1, k, 1]}>
            <Box p={[0, 0.45, 0]} s={[0.82, 0.9, 0.9]} c={j % 3 ? '#e8d48a' : '#efe6cf'} />
            <HipRoof w={0.9} l={0.95} h={0.3} y={0.9} color="#8a3b2a" />
          </group>
        );
      })}
      {sk > 0.02 &&
        STALLS.map((x, i) =>
          [-1, 1].map((s) => {
            const open = awningOpen(x, t);
            const col = ['#d7402f', '#f2c230', '#2f7fc1', '#ef7d2c', '#3aa35a'][(i + (s > 0 ? 2 : 0)) % 5];
            return (
              <group key={`${i}${s}`} position={[x, 0, RAIL_Z + s * 0.85]} scale={[1, sk, 1]}>
                <Box p={[0, 0.2, s * 0.08]} s={[0.34, 0.24, 0.32]} c="#a7895e" />
                {/* the cover's baskets of pla thu on the stall (the callback) */}
                {[-0.08, 0.08].map((dx) => (
                  <group key={dx} position={[dx, 0.34, s * 0.08]} scale={0.16}>
                    <Basket b={0.9} fill={1} cook={1} seed={i + dx} />
                  </group>
                ))}
                {/* the awning, hinged at its pole on the stall side: open it leans out over the rails, folded it stands up */}
                <Box p={[0, 0.45, s * 0.25]} s={[0.03, 0.9, 0.03]} c="#555555" />
                <group position={[0, 0.88, s * 0.25]} rotation-x={s * (-0.12 + (1 - open) * 1.3)}>
                  <Box p={[0, 0, -s * 0.32]} s={[0.4, 0.03, 0.64]} c={col} />
                </group>
              </group>
            );
          }),
        )}
    </group>
  );
};

// ------------------------------------------------------------------ Rama II: trucks
const Truck: React.FC<{i: number}> = ({i}) => (
  <group>
    <Box p={[0, 0.35, -0.35]} s={[0.55, 0.45, 0.5]} c={i % 2 ? '#2f7bd0' : '#e0402a'} />
    <Box p={[0, 0.4, 0.3]} s={[0.6, 0.55, 0.9]} c={i % 2 ? '#f2d24a' : '#f4f1e6'} />
  </group>
);

// ------------------------------------------------------------------ Don Hoi Lot: clam diggers on the flat
const Diggers: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = diggersK(t, Y);
  if (k < 0.02 || t > 48.6) return null;
  return (
    <group>
      {Array.from({length: DIGGERS}, (_, i) => {
        const [x, z] = diggerAt(i);
        return (
          <group key={i} position={[x, 0, z]} rotation-y={hash(i) * 6} scale={1.1 * k}>
            <Walker step={t * 0.3 + i} i={i} still={i % 2 === 0} />
          </group>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ the gulf: one flat shape cut at the tile's edges
const seaShape = (() => {
  const sh = new THREE.Shape();
  // the shape is drawn in x / -z (rotated flat below), so z is negated
  SEA.forEach(([x, z], i) => (i === 0 ? sh.moveTo(x, -z) : sh.lineTo(x, -z)));
  sh.closePath();
  return sh;
})();
const Gulf: React.FC = () => (
  <group>
    {/* extruded upward from y = -1.3 to the rivers' surface at 0.1 */}
    <mesh position={[0, -1.3, 0]} rotation-x={-Math.PI / 2} receiveShadow>
      <extrudeGeometry args={[seaShape, {depth: 1.4, bevelEnabled: false}]} />
      <meshStandardMaterial color="#3f8fc0" roughness={0.12} metalness={0.25} />
    </mesh>
  </group>
);

export const SamutSongkhramLandmarks: React.FC<LandmarkProps> = ({Y, t}) => (
  <group>
    <Gulf />
    <Tray t={t} />
    <Catch t={t} />
    <Camp t={t} />
    <Fleets t={t} />
    <Wat k={watK(t, Y)} />
    <Fort k={fortK(t, Y)} />
    {RIVER_HOUSES.map(([x, z], j) => (
      <group key={j} position={[x, 0, z]}>
        <StiltHouse k={riverHouseK(j, t, Y)} i={j} />
      </group>
    ))}
    <Market t={t} Y={Y} />
    {t > 35.6 && t < 41.0 &&
      Array.from({length: TRUCKS}, (_, i) => {
        const p = truckAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.25, p.z]} rotation-y={p.rot} scale={1.3}>
            <Truck i={i} />
          </group>
        ) : null;
      })}
    <Diggers t={t} Y={Y} />
  </group>
);
