import React from 'react';
import * as THREE from 'three';
import type {LandmarkProps} from '../../engine/types';
import {HipRoof} from '../../engine/parts';
import {Bull, Walker} from '../nan/figures';
import {
  CLIMBERS, FORGES, climbAt as climbOf, GHOSTS, GIANT_AT, GIANT_S, LOEI_HOUSES, OATH_N, OXEN, RING_GHOSTS, WAX_N, climberAt, forgeK, ghostAt,
  giantK, heroK, loeiHouseK, loeiLogAt, loeiPillarUp, oathAt, oxAt, phonChaiK, ringGhostAt, stupaK, waxAt,
} from './actors';
import {PhiTaKhon, Puff, Stupa, hash} from './hero';
import {COVER_AZ, HERO_AT, HERO_S, KRADUENG, KRADUENG_H, KRADUENG_R, LOEI, PHON_CHAI, STUPA, STUPA_W} from './places';

type TH = LandmarkProps['terrainH'];

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; r?: number}> = ({p, s, c, r = 0}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} />
  </mesh>
);

// ------------------------------------------------------------------ the cover: the giant Phi Ta Khon
const Giant: React.FC<{t: number}> = ({t}) => {
  const k = heroK(t);
  if (k < 0.02) return null;
  return (
    <group position={[HERO_AT[0], 0, HERO_AT[1]]} rotation-y={(COVER_AZ * Math.PI) / 180} scale={[k, k, k]}>
      <PhiTaKhon t={t} S={HERO_S} />
      {k < 0.98 && <Puff u={1 - k} seed={3} S={HERO_S * 0.5} color="#f0d9a8" n={14} />}
    </group>
  );
};

// ------------------------------------------------------------------ figures
/** a parasol bearer's tiered white parasol (ฉัตร), carried over a column's leader */
const Parasol: React.FC<{color?: string}> = ({color = '#f4efe2'}) => (
  <group>
    <mesh position={[0, 1.6, 0]}>
      <cylinderGeometry args={[0.03, 0.03, 1.6, 5]} />
      <meshStandardMaterial color="#6b4325" />
    </mesh>
    {[0, 1, 2].map((j) => (
      <mesh key={j} position={[0, 2.1 + j * 0.25, 0]} castShadow>
        <coneGeometry args={[0.55 - j * 0.14, 0.22, 12, 1, true]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
    ))}
  </group>
);

/** a small Phi Ta Khon in the parade: patchwork body, red mask, the flared basket and the nose (~2.2 units) */
const GHOST_RAGS = ['#c8202c', '#f0b62a', '#2f7fc1', '#2e9b55', '#7d3c98', '#e8742a'];
const Ghost: React.FC<{t: number; i: number}> = ({t, i}) => {
  const sway = Math.sin(t * 8 + i) * 0.18;
  const hop = Math.abs(Math.sin(t * 8 + i)) * 0.12;
  return (
    <group position={[0, hop, 0]} rotation-z={sway}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.42, 1.1, 6]} />
        <meshStandardMaterial color={GHOST_RAGS[i % 6]} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.16, 6]} />
        <meshStandardMaterial color={GHOST_RAGS[(i + 2) % 6]} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.38, 0.02]} scale={[0.3, 0.36, 0.22]} castShadow>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#c8202c" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.42, 0.38]} rotation-x={1.2}>
        <coneGeometry args={[0.07, 0.4, 6]} />
        <meshStandardMaterial color="#c8202c" roughness={0.7} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.11, 1.5, 0.19]}>
          <sphereGeometry args={[0.06, 6, 5]} />
          <meshBasicMaterial color="#f7f3ea" />
        </mesh>
      ))}
      <mesh position={[0, 1.88, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.28, 0.36, 12, 1, true]} />
        <meshStandardMaterial color={GHOST_RAGS[(i + 4) % 6]} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
    </group>
  );
};

/** a pack ox: a small humped zebu with two panniers (Nan's bull, scaled) */
const PackOx: React.FC<{t: number; i: number}> = ({t, i}) => (
  <group>
    <group scale={0.42}>
      <Bull walk={t * 1.2 + i * 0.3} moving />
    </group>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.32, 0.6, 0]} castShadow>
        <boxGeometry args={[0.22, 0.32, 0.5]} />
        <meshStandardMaterial color={i % 2 ? '#a07a4a' : '#8a6a3a'} roughness={1} />
      </mesh>
    ))}
  </group>
);

// ------------------------------------------------------------------ buildings
/** a Lao house on stilts with a steep hip roof (drawn x1.4) */
const StiltHouse: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1.4, 1.4 * k, 1.4]}>
      {[-0.3, 0.3].map((x) => [-0.3, 0.3].map((z) => <Box key={`${x}${z}`} p={[x, 0.2, z]} s={[0.08, 0.4, 0.08]} c="#5b3b22" />))}
      <Box p={[0, 0.6, 0]} s={[0.8, 0.4, 0.8]} c={i % 2 ? '#8a6040' : '#7a5236'} />
      <HipRoof w={0.95} l={0.95} h={0.5} y={0.8} color="#5a4636" />
    </group>
  );
/** a sim (ordination hall), red hip roof and a gilded finial, drawn x1.3 */
const Sim: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1.3, 1.3 * k, 1.3]}>
      <Box p={[0, 0.08, 0]} s={[1.3, 0.16, 2.1]} c="#d9d2c0" />
      <Box p={[0, 0.45, 0]} s={[1.0, 0.6, 1.8]} c="#efe8d8" />
      <HipRoof w={1.25} l={2.1} h={0.6} y={0.75} color="#9a3a24" />
      <mesh position={[0, 1.45, 0]}>
        <coneGeometry args={[0.07, 0.3, 6]} />
        <meshStandardMaterial color="#d9a521" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
/** a city-pillar post with a lotus-bud top */
const PillarPost: React.FC = () => (
  <group>
    <mesh position={[0, 0.7, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.12, 1.4, 10]} />
      <meshStandardMaterial color="#6b3a20" roughness={0.6} />
    </mesh>
    <mesh position={[0, 1.5, 0]} castShadow>
      <sphereGeometry args={[0.13, 10, 8]} />
      <meshStandardMaterial color="#d9a521" metalness={0.5} roughness={0.4} />
    </mesh>
  </group>
);
/** a wax castle (ต้นผึ้ง / ปราสาทผึ้ง): tiers of beeswax flowers on a bamboo frame */
const WaxCastle: React.FC = () => (
  <group>
    {[0, 1, 2, 3].map((j) => (
      <mesh key={j} position={[0, 0.18 + j * 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.32 - j * 0.07, 0.36 - j * 0.07, 0.24, 8]} />
        <meshStandardMaterial color={j % 2 ? '#f3d27a' : '#f7e8b8'} roughness={0.5} emissive="#f0c040" emissiveIntensity={0.12} />
      </mesh>
    ))}
    <mesh position={[0, 1.2, 0]}>
      <coneGeometry args={[0.08, 0.35, 8]} />
      <meshStandardMaterial color="#e8b84a" roughness={0.4} />
    </mesh>
  </group>
);

// ------------------------------------------------------------------ oath: the two columns and the stupa
const Oath: React.FC<{t: number; Y: number; terrainH: TH}> = ({t, Y, terrainH}) => (
  <group>
    <group position={[STUPA[0], terrainH(STUPA[0], STUPA[1]), STUPA[1]]} rotation-y={0.15}>
      <Stupa w={STUPA_W} k={stupaK(t, Y)} t={t} />
    </group>
    {t > 2.5 &&
      t < 10.2 &&
      [0, 1].map((c) =>
        Array.from({length: OATH_N}, (_, i) => {
          const p = oathAt(c, i, t);
          if (!p) return null;
          return (
            <group key={`${c}${i}`} position={[p.x, terrainH(p.x, p.z), p.z]} rotation-y={p.rot} scale={0.42}>
              {/* Ayutthaya's people in white and red, Lan Xang's in indigo (CLAUDE.md: figures read as people) */}
              <Walker step={t * 1.5 + i * 0.4} i={c ? 1 + (i % 2) * 2 : (i % 2) * 2 + (i % 3 === 2 ? 5 : 0)} still={!p.walking} load={i % 4 === 3} />
              {i === 0 && <Parasol color={c ? '#e6d9a8' : '#f4efe2'} />}
            </group>
          );
        }),
      )}
  </group>
);

// ------------------------------------------------------------------ frontier: the caravans and the town's temple
const Frontier: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {t > 9 &&
      t < 16.4 &&
      Array.from({length: OXEN}, (_, i) => {
        const p = oxAt(i, t);
        if (!p) return null;
        return (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot}>
            <PackOx t={t} i={i} />
            {i % 2 === 0 && (
              <group position={[0.55, 0, 0.3]} scale={0.42}>
                <Walker step={t * 1.4 + i} i={i + 1} />
              </group>
            )}
          </group>
        );
      })}
    {/* Wat Phon Chai's sim, on the tongue of land between the Man and the Sok */}
    <group position={[PHON_CHAI[0] + 0.3, 0, PHON_CHAI[1]]} scale={0.85}>
      <Sim k={phonChaiK(t, Y)} />
    </group>
  </group>
);

// ------------------------------------------------------------------ loei: Ban Hae becomes Mueang Loei
const Loei: React.FC<{t: number; Y: number; terrainH: TH}> = ({t, Y, terrainH}) => {
  const log = loeiLogAt(t);
  const up = loeiPillarUp(t, Y);
  const fk = forgeK(t, Y);
  return (
    <group>
      {LOEI_HOUSES.map(([x, z], j) => (
        <group key={j} position={[x, 0, z]} rotation-y={hash(j + 40) * 0.8}>
          <StiltHouse k={loeiHouseK(j, t, Y)} i={j} />
        </group>
      ))}
      {log && up < 1 && (
        <group position={[log.x, 0, log.z]} rotation-y={log.rot}>
          <group position={[0, 0.7, 0]} rotation-x={Math.PI / 2}>
            <PillarPost />
          </group>
          {Array.from({length: 6}, (_, i) => (
            <group key={i} position={[i % 2 ? 0.3 : -0.3, 0, -0.6 + Math.floor(i / 2) * 0.45]} scale={0.42}>
              <Walker step={t * 1.6 + i * 0.5} i={i} />
            </group>
          ))}
        </group>
      )}
      {up > 0 && (
        <group position={[LOEI[0], 0, LOEI[1]]} rotation-x={(1 - up) * (Math.PI / 2)}>
          <PillarPost />
        </group>
      )}
      {up >= 1 && (
        <group position={[LOEI[0], 0, LOEI[1]]}>
          <Box p={[0, 0.06, 0]} s={[1.0, 0.12, 1.0]} c="#efe8d8" />
        </group>
      )}
      {/* the smiths' furnaces: pits glowing at the hill's foot, sparks over them */}
      {fk > 0 &&
        FORGES.map(([x, z], j) => {
          const gy = terrainH(x, z);
          const flick = 0.7 + 0.3 * Math.sin(t * 13 + j * 2);
          return (
            <group key={j} position={[x, gy, z]}>
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.36, 0.42, 0.12, 12]} />
                <meshBasicMaterial color={new THREE.Color('#ff7a1a').multiplyScalar(flick)} toneMapped={false} />
              </mesh>
              <Puff u={(t * 2 + j * 0.33) % 1} seed={Math.floor(t * 2 + j * 0.33) + j * 9} S={0.9} color="#ffb04a" n={6} up={1.4} />
              <group position={[0.6, 0, 0.2]} rotation-y={-1.2} scale={0.42}>
                <Walker step={t * 2 + j} i={j + 1} still />
              </group>
            </group>
          );
        })}
    </group>
  );
};

// ------------------------------------------------------------------ wax: the wax castles carried to the stupa
const Wax: React.FC<{t: number}> = ({t}) =>
  t < 20.8 || t > 28.4 ? null : (
    <group>
      {Array.from({length: WAX_N}, (_, i) => {
        const p = waxAt(i, t);
        if (!p) return null;
        return (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.42}>
            <Walker step={t * 1.4 + i * 0.37} i={i % 2 ? 0 : 2} />
            {i % 4 === 1 && (
              <group position={[0, 1.9, 0]} scale={1.6}>
                <WaxCastle />
              </group>
            )}
          </group>
        );
      })}
    </group>
  );

// ------------------------------------------------------------------ Phu Kradueng: the plateau, its pines and the climb
const MESA_SIDE = '#a98a62';
const Kradueng: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const [cx, cz] = KRADUENG;
  return (
    <group position={[cx, 0, cz]}>
      {/* the cliffs: a sandstone frustum, its top a green plateau */}
      <mesh position={[0, KRADUENG_H / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[KRADUENG_R, KRADUENG_R + 2.5, KRADUENG_H, 28, 3]} />
        <meshStandardMaterial color={MESA_SIDE} roughness={0.95} flatShading />
      </mesh>
      {/* the forested lower slopes */}
      <mesh position={[0, 0.9, 0]} receiveShadow>
        <cylinderGeometry args={[KRADUENG_R + 2.2, KRADUENG_R + 3.6, 1.8, 28]} />
        <meshStandardMaterial color="#4f7a3a" roughness={1} />
      </mesh>
      <mesh position={[0, KRADUENG_H + 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[KRADUENG_R - 0.05, KRADUENG_R - 0.05, 0.06, 28]} />
        <meshStandardMaterial color="#9fb267" roughness={1} />
      </mesh>
      {/* three-needled pines on the top (สนสามใบ) */}
      {Array.from({length: 46}, (_, i) => {
        const a = hash(i * 3 + 1) * Math.PI * 2;
        const r = Math.sqrt(hash(i * 5 + 2)) * (KRADUENG_R - 0.8);
        if (Math.cos(a) * r < -KRADUENG_R + 3.4 && Math.abs(Math.sin(a) * r) < 1.4) return null; // the trail's head stays open
        const s = 0.8 + hash(i) * 0.6;
        return (
          <group key={i} position={[Math.cos(a) * r, KRADUENG_H, Math.sin(a) * r]} scale={s}>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.05, 0.07, 0.7, 5]} />
              <meshStandardMaterial color="#5a4128" />
            </mesh>
            <mesh position={[0, 1.0, 0]} castShadow>
              <coneGeometry args={[0.38, 1.2, 7]} />
              <meshStandardMaterial color="#2f5a35" roughness={0.9} />
            </mesh>
          </group>
        );
      })}
      {/* the climb: a pale track up the west face */}
      {Array.from({length: 30}, (_, i) => {
        const p = climbOf(i / 29);
        return (
          <mesh key={i} position={[p.x - cx, p.y + 0.03, p.z - cz]} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[0.2, 8]} />
            <meshStandardMaterial color="#d8c9a4" roughness={1} />
          </mesh>
        );
      })}
      {t > 26.6 &&
        t < 34.8 &&
        Array.from({length: CLIMBERS}, (_, i) => {
          const p = climberAt(i, t);
          if (!p) return null;
          return (
            <group key={i} position={[p.x - cx, p.y, p.z - cz]} rotation-y={p.rot} scale={0.42}>
              <Walker step={t * 1.3 + i * 0.4} i={i % 2 ? 1 : 0} load={i % 3 === 0} />
            </group>
          );
        })}
      {/* the visitors' huts at the foot (Si Than) from the park's founding */}
      {Y > 1960 &&
        [[-14, -4.5], [-15.6, -2.4], [-13.2, -1.6]].map(([x, z], j) => (
          <group key={j} position={[x, 0, z]} rotation-y={j}>
            <StiltHouse k={1} i={j} />
          </group>
        ))}
    </group>
  );
};

// ------------------------------------------------------------------ fest: Bun Luang
const Fest: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = giantK(t, Y);
  if (k < 0.02) return null;
  return (
    <group>
      {/* the cover's giant, finished and dancing over the festival ground (the callback) */}
      <group position={[GIANT_AT[0], 0, GIANT_AT[1]]} rotation-y={-2.0} scale={[k, k, k]}>
        <PhiTaKhon t={t} S={GIANT_S} done />
      </group>
      {Array.from({length: RING_GHOSTS}, (_, i) => {
        const [x, z] = ringGhostAt(i, t);
        return (
          <group key={`r${i}`} position={[x, 0, z]} rotation-y={Math.atan2(GIANT_AT[0] - x, GIANT_AT[1] - z)} scale={0.5 * k}>
            <Ghost t={t} i={i} />
          </group>
        );
      })}
      {Array.from({length: GHOSTS}, (_, i) => {
        const p = ghostAt(i, t, Y);
        if (!p || p.fade < 0.05) return null;
        return (
          <group key={`p${i}`} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.5 * p.fade}>
            <Ghost t={t} i={i + 7} />
          </group>
        );
      })}
    </group>
  );
};

export const LoeiLandmarks: React.FC<LandmarkProps> = ({Y, t, terrainH}) => (
  <group>
    <Giant t={t} />
    <Oath t={t} Y={Y} terrainH={terrainH} />
    <Frontier t={t} Y={Y} />
    <Loei t={t} Y={Y} terrainH={terrainH} />
    <Wax t={t} />
    <Kradueng t={t} Y={Y} />
    <Fest t={t} Y={Y} />
  </group>
);
