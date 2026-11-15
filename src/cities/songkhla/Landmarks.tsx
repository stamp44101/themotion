import React from 'react';
import * as THREE from 'three';
import {Army} from '../../engine/army';
import {HipRoof, SmallChedi} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {SteamLoco} from '../kanchanaburi/figures';
import {Walker} from '../nan/figures';
import {
  BEACH_PEOPLE, BEARERS, CROWD, FERRIES, FLEET, HERO_AT, HERO_H, LINE, MARCHERS, PIERS, PORTERS, PORT_JUNKS, SHOW_H,
  SINGORA_HUTS, STATUE_AT, attackers, bridgeK, callbackK, callbackT, defenders, ferryAt, fireK, fleetAt, fortK,
  goldK, heroK, hutK, marcherAt, pierK, pillarLogAt, portJunkAt, porterAt, ruinK, showK, shrineK, smooth, stationK,
  statueK, trackK, tradeJunkAt, trainAt,
} from './actors';
import {AiTeng, Mermaid, Puff, TwoWaters} from './Hero';
import {BRIDGE_N, FORTS, OLD_STATION, PILLAR, PUPPET_BACK, SHOPHOUSES, SINGORA, STAGE, TANG_KUAN, inWater} from './places';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const rad = (d: number) => (d * Math.PI) / 180;

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; r?: number; e?: string; ei?: number}> = ({
  p,
  s,
  c,
  r = 0,
  e,
  ei = 0.6,
}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} emissive={e ?? '#000000'} emissiveIntensity={e ? ei : 0} />
  </mesh>
);

// ------------------------------------------------------------------ boats
/** a Chinese- or Malay-rigged junk (สำเภา), ~2.4 long, bow toward +z */
const Junk: React.FC<{sail?: string}> = ({sail = '#b5542e'}) => (
  <group>
    <Box p={[0, 0.2, 0]} s={[0.7, 0.35, 2.0]} c="#5a3a22" />
    <Box p={[0, 0.42, -0.95]} s={[0.66, 0.35, 0.4]} c="#6b452a" />
    <Box p={[0, 0.3, 1.0]} s={[0.5, 0.22, 0.4]} c="#6b452a" />
    {[[0.35, 1.7, 1.1], [-0.4, 1.3, 0.8]].map(([z, h, w], k) => (
      <group key={k} position={[0, 0.35, z]}>
        <mesh position={[0, h / 2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, h, 5]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
        <mesh position={[0, h * 0.58, 0.02]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[w, h * 0.78]} />
          <meshStandardMaterial color={sail} side={THREE.DoubleSide} roughness={0.9} />
        </mesh>
        {[0.3, 0.55, 0.8].map((v) => (
          <mesh key={v} position={[0, h * v, 0.04]} rotation-y={Math.PI / 2}>
            <boxGeometry args={[w, 0.025, 0.02]} />
            <meshStandardMaterial color="#3a2a1a" />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);
/** a flat stone barge (the wall's stone across the lake) */
const Barge: React.FC = () => (
  <group>
    <Box p={[0, 0.15, 0]} s={[0.8, 0.25, 1.8]} c="#5a3a22" />
    {[-0.4, 0, 0.4].map((z) => (
      <Box key={z} p={[0, 0.38, z]} s={[0.55, 0.22, 0.32]} c="#a49a8a" />
    ))}
    <Box p={[0, 0.5, -0.8]} s={[0.12, 0.6, 0.12]} c="#3a2a1a" />
  </group>
);

// ------------------------------------------------------------------ the cover's puppet
const Cover: React.FC<{t: number}> = ({t}) => {
  const k = heroK(t);
  if (k < 0.01) return null;
  return (
    <group position={[HERO_AT[0], 0, HERO_AT[1]]} rotation-y={rad(16)} scale={[1, k, 1]}>
      <AiTeng t={t} H={HERO_H} />
    </group>
  );
};

// ------------------------------------------------------------------ Singora: the port town, its wall and forts; the siege
/** the town wall: a ring round the huts, its stretches over water left out (a wall never runs across open water) */
const WALL_RING: [number, number][] = Array.from({length: 18}, (_, i) => {
  const a = (i / 18) * Math.PI * 2;
  return [SINGORA[0] - 1.8 + Math.cos(a) * 5.2, SINGORA[1] + 1.8 + Math.sin(a) * 3.4];
});
const WALL_SEGS = WALL_RING.map((a, i) => [a, WALL_RING[(i + 1) % WALL_RING.length]] as const).filter(
  ([a, b]) => !inWater(a[0], a[1]) && !inWater(b[0], b[1]) && !inWater((a[0] + b[0]) / 2, (a[1] + b[1]) / 2),
);
const Hut: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1.1, 1.1 * k, 1.1]}>
      <Box p={[0, 0.3, 0]} s={[0.75, 0.5, 0.75]} c={i % 2 ? '#8a6040' : '#a07850'} />
      <HipRoof w={0.9} l={0.9} h={0.45} y={0.55} color={i % 3 ? '#6e5a3c' : '#8a3a24'} />
    </group>
  );
const Fort: React.FC<{k: number; ruin: number}> = ({k, ruin}) =>
  k < 0.02 ? null : (
    <group scale={[1.2, 1.2 * k * (1 - 0.7 * ruin), 1.2]}>
      <Box p={[0, 0.4, 0]} s={[1.4, 0.8, 1.4]} c={ruin > 0.5 ? '#7f6e5c' : '#a8957c'} />
      {[-0.55, 0, 0.55].map((x) => (
        <Box key={x} p={[x, 0.92, 0.6]} s={[0.25, 0.25, 0.2]} c="#a8957c" />
      ))}
      {ruin < 0.6 && (
        <mesh position={[0, 0.95, 0.8]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.07, 0.09, 0.7, 8]} />
          <meshStandardMaterial color="#2c2c2c" metalness={0.5} roughness={0.5} />
        </mesh>
      )}
    </group>
  );
const Singora: React.FC<{t: number; Y: number; terrainH: LandmarkProps['terrainH']}> = ({t, Y, terrainH}) => {
  if (Y < 1603) return null;
  const ruin = ruinK(t, Y);
  const fire = fireK(t);
  const wallK = fortK(0, t, Y);
  return (
    <group>
      {SINGORA_HUTS.map(([x, z], j) => (
        <group key={j} position={[x, terrainH(x, z), z]} rotation-y={hash(j) * 1.4}>
          <Hut k={hutK(j, t, Y)} i={j} />
        </group>
      ))}
      {wallK > 0.02 &&
        WALL_SEGS.map(([a, b], i) => {
          const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
          const mx = (a[0] + b[0]) / 2;
          const mz = (a[1] + b[1]) / 2;
          const h = 0.9 * wallK * (1 - 0.72 * ruin) * (ruin > 0.5 && i % 3 === 0 ? 0.4 : 1);
          return (
            <mesh key={i} position={[mx, terrainH(mx, mz) + h / 2, mz]} rotation-y={Math.atan2(b[0] - a[0], b[1] - a[1])} castShadow receiveShadow>
              <boxGeometry args={[0.35, h, len + 0.1]} />
              <meshStandardMaterial color={ruin > 0.5 ? '#7d6b58' : '#a8957c'} roughness={0.9} />
            </mesh>
          );
        })}
      {FORTS.map(([x, z], j) => (
        <group key={j} position={[x, terrainH(x, z), z]} rotation-y={hash(j + 7) * 1.2}>
          <Fort k={fortK(j, t, Y)} ruin={ruin} />
          {fire > 0.02 && (
            <group position={[0, 1.0, 0]}>
              <Puff u={((t * 1.3 + j * 0.27) % 1)} seed={Math.floor(t * 1.3) + j * 11} S={6 * fire} color={j % 2 ? '#ff8a2a' : '#ffb347'} n={12} />
              <Puff u={((t * 1.3 + j * 0.27 + 0.5) % 1)} seed={Math.floor(t * 1.3 + 0.5) + j * 13} S={5 * fire} color="#ff6a1a" n={10} />
              <Puff u={((t * 0.7 + j * 0.41) % 1)} seed={Math.floor(t * 0.7) + j * 5} S={8 * fire} color="#5c5650" n={9} />
            </group>
          )}
        </group>
      ))}
      {fire > 0.02 &&
        SINGORA_HUTS.filter((_, j) => j % 4 === 0).map(([x, z], j) => (
          <group key={`f${j}`} position={[x, terrainH(x, z) + 0.6, z]}>
            <Puff u={((t * 1.5 + j * 0.31) % 1)} seed={Math.floor(t * 1.5) + j * 3} S={5 * fire} color="#ff7a1a" n={10} />
            <Puff u={((t * 0.8 + j * 0.23) % 1)} seed={Math.floor(t * 0.8) + j * 7} S={7 * fire} color="#6a625a" n={8} />
          </group>
        ))}
    </group>
  );
};

const Siege: React.FC<{t: number; terrainH: LandmarkProps['terrainH']}> = ({t, terrainH}) => (
  <group>
    {t > 8 && t < 15.6 && <Army f={attackers(t)} color="#a3261c" terrainH={terrainH} />}
    {t > 8 && t < 15.6 && <Army f={defenders(t)} color="#2f6b3a" terrainH={terrainH} />}
    {t > 8 && t < 16 &&
      Array.from({length: FLEET}, (_, i) => {
        const p = fleetAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot} scale={1.1}>
            <Junk sail={i % 2 ? '#c23a2a' : '#e8dcc0'} />
          </group>
        ) : null;
      })}
  </group>
);

// ------------------------------------------------------------------ Bo Yang
const PillarShrine: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1.2, 1.2 * k, 1.2]}>
      <Box p={[0, 0.15, 0]} s={[1.1, 0.3, 1.1]} c="#efe8d8" />
      <Box p={[0, 0.55, 0]} s={[0.8, 0.5, 0.8]} c="#b8322a" />
      <HipRoof w={1.1} l={1.1} h={0.45} y={0.8} color="#d9a521" />
    </group>
  );
const BoYang: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {t > 14.5 && t < 21.5 &&
      Array.from({length: FERRIES}, (_, i) => {
        const p = ferryAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot}>
            <Barge />
          </group>
        ) : null;
      })}
    {(() => {
      const p = pillarLogAt(t);
      if (!p) return null;
      return (
        <group position={[p.x, 0, p.z]} rotation-y={p.rot}>
          <mesh position={[0, 0.9, 0]} rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 2.0, 10]} />
            <meshStandardMaterial color="#6b3a20" roughness={0.6} />
          </mesh>
          {Array.from({length: BEARERS}, (_, i) => (
            <group key={i} position={[(i % 2 ? 0.28 : -0.28), 0, -0.8 + Math.floor(i / 2) * 0.8]} scale={0.55}>
              <Walker step={t * 1.6 + i * 0.4} i={i} />
            </group>
          ))}
        </group>
      );
    })()}
    {Array.from({length: MARCHERS}, (_, i) => {
      const p = marcherAt(i, t);
      return p ? (
        <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.55}>
          <Walker step={t * 1.5 + i * 0.5} i={i + 3} />
        </group>
      ) : null;
    })}
    <group position={[PILLAR[0], 0, PILLAR[1]]}>
      <PillarShrine k={shrineK(t, Y)} />
    </group>
  </group>
);

// ------------------------------------------------------------------ trade on the lake shore
/** the deputy governor's mansion (2421; today the national museum): a long Chinese hall with a curved red roof */
const Mansion: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <Box p={[0, 0.35, 0]} s={[2.4, 0.7, 1.2]} c="#efe6d2" />
      <HipRoof w={2.6} l={1.4} h={0.45} y={0.7} color="#a23a26" />
      <Box p={[0, 0.35, 0.9]} s={[1.0, 0.5, 0.6]} c="#e8dcc4" />
    </group>
  );
/** a row of shophouses: pastel fronts under one long red-tiled roof, 0.9 by 1.4 */
const FRONTS = ['#efe2c4', '#d9e4d0', '#f0d6c4', '#e6dcc8', '#d6dbe6'];
const ShopRow: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      {[-0.47, 0, 0.47].map((z, j) => (
        <Box key={j} p={[0, 0.3, z]} s={[0.9, 0.6, 0.46]} c={FRONTS[(i + j) % FRONTS.length]} />
      ))}
      <HipRoof w={1.0} l={1.5} h={0.35} y={0.6} color="#9a3a24" />
    </group>
  );
export const shopK = (j: number, Y: number) => smooth((Y - (1848 + j * 4)) / 4);

const Trade: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const pk = pierK(Y);
  return (
    <group>
      {pk > 0.02 &&
        PIERS.map(([x, z], i) => (
          <group key={i} position={[x - 0.7, 0, z]}>
            <Box p={[0, 0.16, 0]} s={[1.6 * pk, 0.1, 0.45]} c="#7a5a3a" />
            {[-0.6, 0, 0.6].map((dx) => (
              <Box key={dx} p={[dx * pk, 0.05, 0]} s={[0.08, 0.3, 0.08]} c="#4a3422" />
            ))}
          </group>
        ))}
      {t > 20.4 && t < 27.8 &&
        Array.from({length: 4}, (_, i) => {
          const p = tradeJunkAt(i, t);
          return p ? (
            <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot} scale={0.85}>
              <Junk sail={i % 2 ? '#c9a46a' : '#b5542e'} />
            </group>
          ) : null;
        })}
      {t > 20.6 && t < 27.4 &&
        Array.from({length: PORTERS}, (_, i) => {
          const p = porterAt(i, t);
          return p ? (
            <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.62}>
              <Walker step={t * 1.8 + i * 0.3} i={i} load={p.load} />
            </group>
          ) : null;
        })}
      {SHOPHOUSES.map(([x, z], j) => (
        <group key={`sh${j}`} position={[x, 0, z]}>
          <ShopRow k={shopK(j, Y)} i={j} />
        </group>
      ))}
      <group position={[-2.4, 0, -7.3]} rotation-y={0.12}>
        <Mansion k={smooth((Y - 1876) / 3)} />
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ the railway
const TRACK_SEGS = LINE.slice(1).map((b, i) => [LINE[i], b] as const);
const TRACK_L = TRACK_SEGS.reduce((s, [a, b]) => s + Math.hypot(b[0] - a[0], b[1] - a[1]), 0);
const Railway: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 1897) return null;
  const k = trackK(t, Y);
  let left = k * TRACK_L;
  const tr = trainAt(t);
  return (
    <group>
      {TRACK_SEGS.map(([a, b], i) => {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const show = Math.min(len, Math.max(0, left));
        left -= len;
        if (show < 0.05) return null;
        const u = show / len;
        const ex = a[0] + (b[0] - a[0]) * u;
        const ez = a[1] + (b[1] - a[1]) * u;
        return (
          <mesh key={i} position={[(a[0] + ex) / 2, 0.06, (a[1] + ez) / 2]} rotation-y={Math.atan2(b[0] - a[0], b[1] - a[1])} receiveShadow>
            <boxGeometry args={[0.55, 0.08, show]} />
            <meshStandardMaterial color="#5e5148" roughness={0.9} />
          </mesh>
        );
      })}
      <group position={[OLD_STATION[0] + 1.4, 0, OLD_STATION[1] + 0.3]} rotation-y={0.32}>
        {stationK(t, Y) > 0.02 && (
          <group scale={[1, stationK(t, Y), 1]}>
            <Box p={[0, 0.35, 0]} s={[1.0, 0.7, 2.6]} c="#e9dcc0" />
            <HipRoof w={1.3} l={2.9} h={0.5} y={0.7} color="#8a3a26" />
          </group>
        )}
      </group>
      {tr && (
        <group position={[tr.x, 0.08, tr.z]} rotation-y={tr.rot - Math.PI / 2} scale={2.4}>
          <SteamLoco wagons={3} t={t * 3} />
          <group position={[0.75, 0.55, 0]}>
            <Puff u={(t * 1.6) % 1} seed={Math.floor(t * 1.6)} S={0.7} color="#e8e4dc" n={6} />
          </group>
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the golden mermaid
const Statue: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const sk = statueK(t, Y);
  if (Y < 1965.5 || sk < 0.01) return null;
  const gk = goldK(t, Y);
  const tt = gk > 0 ? 1.6 + gk * 1.0 : sk * 1.6;
  return (
    <group position={[STATUE_AT[0], 0, STATUE_AT[1]]} rotation-y={rad(160)} scale={sk}>
      <Mermaid t={tt} S={4.6} />
    </group>
  );
};
const Beach: React.FC<{t: number; Y: number}> = ({t, Y}) =>
  Y < 1965.5 || Y > 1967.5 ? null : (
    <group>
      {BEACH_PEOPLE.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]} rotation-y={rad(160) + hash(i) * 0.8} scale={0.42}>
          <Walker step={t * 0.6 + i} i={i} still={i % 3 !== 0} />
        </group>
      ))}
    </group>
  );

// ------------------------------------------------------------------ Tinsulanonda bridge, north span
const Bridge: React.FC<{Y: number}> = ({Y}) => {
  const k = bridgeK(Y);
  if (k < 0.01) return null;
  const [a, b] = BRIDGE_N;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const rot = Math.atan2(b[0] - a[0], b[1] - a[1]);
  const half = (k * L) / 2;
  const piers = Math.floor(L / 1.2);
  return (
    <group position={[a[0], 0, a[1]]} rotation-y={rot}>
      {/* the deck grows from both shores and meets in the middle */}
      <Box p={[0, 0.55, half / 2]} s={[0.7, 0.18, half]} c="#d8d4cc" />
      <Box p={[0, 0.55, L - half / 2]} s={[0.7, 0.18, half]} c="#d8d4cc" />
      {Array.from({length: piers + 1}, (_, i) => {
        const z = (i / piers) * L;
        if (z > half && z < L - half) return null;
        return <Box key={i} p={[0, 0.25, z]} s={[0.22, 0.5, 0.22]} c="#b8b2a8" />;
      })}
    </group>
  );
};

// ------------------------------------------------------------------ the show on Samila: the stage and the callback
const Stage: React.FC<{t: number; k: number}> = ({t, k}) =>
  k < 0.02 ? null : (
    <group position={[STAGE[0], 0, STAGE[1]]} rotation-y={rad(200)} scale={[1, k, 1]}>
      {/* the raised hut (โรงหนัง) with its white screen lit from behind, facing the crowd */}
      {[-0.9, 0.9].map((x) => [-0.5, 0.5].map((z) => <Box key={`${x}${z}`} p={[x, 0.4, z]} s={[0.12, 0.8, 0.12]} c="#5b3b22" />))}
      <Box p={[0, 0.85, 0]} s={[2.0, 0.12, 1.2]} c="#7a5a3a" />
      <mesh position={[0, 1.55, 0.58]}>
        <planeGeometry args={[1.8, 1.2]} />
        <meshBasicMaterial color={new THREE.Color('#fff2cc').multiplyScalar(0.9 + 0.1 * Math.sin(t * 9))} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* small puppets' shadows dancing on the screen */}
      {[-0.45, 0.4].map((x, i) => (
        <mesh key={x} position={[x + 0.12 * Math.sin(t * 2.2 + i), 1.5 + 0.06 * Math.sin(t * 4 + i), 0.6]}>
          <planeGeometry args={[0.28, 0.62]} />
          <meshBasicMaterial color="#2b1c14" side={THREE.DoubleSide} />
        </mesh>
      ))}
      <HipRoof w={2.2} l={1.4} h={0.6} y={2.15} color="#6e5a3c" />
    </group>
  );
const Show: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = showK(t, Y);
  const cb = callbackK(t);
  return (
    <group>
      <Stage t={t} k={k} />
      {k > 0.02 &&
        CROWD.map(([x, z], i) => (
          <group key={i} position={[x, 0, z]} rotation-y={Math.atan2(STAGE[0] - x, STAGE[1] - z)} scale={0.42 * k}>
            <Walker step={t * 0.5 + i} i={i} still={i % 4 !== 0} />
          </group>
        ))}
      {cb > 0.01 && (
        <group position={[PUPPET_BACK[0], (1 - cb) * -SHOW_H * 1.2, PUPPET_BACK[1]]} rotation-y={rad(200)}>
          <AiTeng t={callbackT(t)} H={SHOW_H} />
        </group>
      )}
    </group>
  );
};

/** the old chedi on Khao Tang Kuan's summit (Srivijaya style, date unknown: always there) */
const TangKuan: React.FC<{terrainH: LandmarkProps['terrainH']}> = ({terrainH}) => (
  <SmallChedi pos={[TANG_KUAN[0], terrainH(TANG_KUAN[0], TANG_KUAN[1]) - 0.05, TANG_KUAN[1]]} scale={0.9} k={1} color="#efe8dc" />
);

export const SongkhlaLandmarks: React.FC<LandmarkProps> = ({Y, t, terrainH}) => (
  <group>
    <TwoWaters />
    <Cover t={t} />
    <TangKuan terrainH={terrainH} />
    <Singora t={t} Y={Y} terrainH={terrainH} />
    <Siege t={t} terrainH={terrainH} />
    {t > 2.6 && t < 9.6 &&
      Array.from({length: PORT_JUNKS}, (_, i) => {
        const p = portJunkAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot}>
            <Junk sail={i % 2 ? '#c9a46a' : '#b5542e'} />
          </group>
        ) : null;
      })}
    <BoYang t={t} Y={Y} />
    <Trade t={t} Y={Y} />
    <Railway t={t} Y={Y} />
    <Statue t={t} Y={Y} />
    <Beach t={t} Y={Y} />
    <Bridge Y={Y} />
    <Show t={t} Y={Y} />
  </group>
);
