import React, {useMemo} from 'react';
import * as THREE from 'three';
import {glowTexture, SmallChedi, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp} from '../../lib';
import {Walker} from '../nan/figures';
import {RowBoat} from '../phetchabun/figures';
import {
  along, BOATS, boatAt, BUILDERS, builderAt, CANAL_L, canalDug, chediAt, chediH, clamp01, CORPS, DEBRIS, debrisAt,
  marcherAt, WALKERS, walkerAt, WHEEL, wheelK,
} from './actors';
import {Chedi, Terrace} from './chedi';
import {
  CANAL_PATH, CANAL_W, MARKET_E, MARKET_W, PALACE, PRATHON, RAIL_CANAL_X, RAIL_Z, SILPAKORN, STATION_RD,
} from './places';
import {H_MID} from './timeline';

const WATER = '#3f8fc0';
const smooth01 = (x: number) => x * x * (3 - 2 * x);

// a growing mesh is gated on its own scale (CLAUDE.md: a mesh at scale 0 blacks out the shader look)
const Grow: React.FC<{k: number; children: React.ReactNode; at: [number, number, number]; rot?: number}> = ({k, children, at, rot = 0}) =>
  k > 0.02 ? (
    <group position={at} rotation-y={rot} scale={[1, Math.max(0.03, k), 1]}>
      {children}
    </group>
  ) : null;

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; e?: string}> = ({p, s, c, e}) => (
  <mesh position={p} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} emissive={e ?? '#000000'} emissiveIntensity={e ? 0.6 : 0} />
  </mesh>
);

// ------------------------------------------------------------------ the chedi
const ChediMain: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const H = chediH(t);
  const s = chediAt(t);
  // the court (square terrace, cloister, viharns) goes up with the crown
  const court = Y >= 1870.5 ? 1 : smooth01(clamp01((s.gold - 0.5) / 0.5)) * (t > 8 ? 1 : 0);
  return (
    <group>
      <group scale={H}>
        <Terrace court={court} />
        <Chedi shell={s.shell} spire={s.spire} crown={s.crown} gold={s.gold} slump={s.slump} lit={s.lit} />
      </group>
      {/* scaffolding poles round the shell while it is being laid */}
      {s.gold < 0.6 && t > 5.6 && s.shell < 0.99 && (
        <group>
          {Array.from({length: 16}, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const r = 0.335 * H * (1 + 0.18 * s.slump);
            const h = Math.max(0.3, (0.06 + s.shell * 0.32) * H * (1 - 0.45 * s.slump) + 0.4);
            return (
              <mesh key={i} position={[Math.cos(a) * r, h / 2, Math.sin(a) * r]}>
                <cylinderGeometry args={[0.03, 0.03, h, 4]} />
                <meshStandardMaterial color="#b89a62" roughness={1} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
};

const Debris: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: DEBRIS}, (_, i) => {
      const d = debrisAt(i, t);
      if (!d) return null;
      return (
        <mesh key={i} position={[d.x, d.y, d.z]} rotation={[d.rot, d.rot * 0.7, 0]} castShadow>
          <boxGeometry args={[0.32, 0.16, 0.18]} />
          <meshStandardMaterial color="#8e4f33" roughness={1} />
        </mesh>
      );
    })}
  </>
);

const Builders: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: BUILDERS}, (_, i) => {
      const b = builderAt(i, t);
      if (!b) return null;
      return (
        <group key={i} position={[b.x, 0.06 * H_MID, b.z]} rotation-y={b.rot} scale={0.32}>
          <Walker step={t * 1.4 + i * 0.37} i={i} load={i % 3 === 0} />
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ the canal
/** a flat ribbon along the path up to distance L (the canal as dug so far) */
const ribbon = (pts: [number, number][], L: number, w: number) => {
  const pos: number[] = [];
  let acc = 0;
  for (let i = 1; i < pts.length && acc < L; i++) {
    const [ax, az] = pts[i - 1];
    const [bx0, bz0] = pts[i];
    const len = Math.hypot(bx0 - ax, bz0 - az);
    const u = Math.min(1, (L - acc) / len);
    const bx = ax + (bx0 - ax) * u;
    const bz = az + (bz0 - az) * u;
    const nx = (-(bz0 - az) / len) * (w / 2);
    const nz = ((bx0 - ax) / len) * (w / 2);
    pos.push(ax + nx, 0, az + nz, ax - nx, 0, az - nz, bx + nx, 0, bz + nz);
    pos.push(bx + nx, 0, bz + nz, ax - nx, 0, az - nz, bx - nx, 0, bz - nz);
    // a round joint so the bends do not gap
    acc += len;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
};

const Canal: React.FC<{t: number}> = ({t}) => {
  const L = canalDug(t);
  const q = Math.round(L * 4) / 4;
  const water = useMemo(() => (q > 0.3 ? ribbon(CANAL_PATH, q, CANAL_W) : null), [q]);
  const bank = useMemo(() => (q > 0.3 ? ribbon(CANAL_PATH, q, CANAL_W + 0.5) : null), [q]);
  const head = q > 0.3 && q < CANAL_L - 0.5 ? along(CANAL_PATH, q) : null;
  return (
    <group>
      {bank && (
        <mesh geometry={bank} position={[0, 0.045, 0]} receiveShadow>
          <meshStandardMaterial color="#8c7350" roughness={1} side={THREE.DoubleSide} />
        </mesh>
      )}
      {water && (
        <mesh geometry={water} position={[0, 0.07, 0]} receiveShadow>
          <meshStandardMaterial color={WATER} roughness={0.25} metalness={0.1} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* the diggers at the head of the cut */}
      {head &&
        Array.from({length: 6}, (_, i) => (
          <group key={i} position={[head.x + Math.cos(i * 1.1) * 0.9, 0, head.z + Math.sin(i * 1.1) * 0.9]} rotation-y={head.rot + i} scale={0.3}>
            <Walker step={t * 1.8 + i * 0.4} i={i + 3} load />
          </group>
        ))}
    </group>
  );
};

const Boats: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <>
    {Array.from({length: BOATS}, (_, i) => {
      const b = boatAt(i, t);
      if (!b) return null;
      return (
        <group key={i} position={[b.x, 0.02, b.z]} rotation-y={b.rot + Math.PI} scale={0.42}>
          <RowBoat row={t * 1.3 + i} i={i} />
          {/* a load of bricks amidships */}
          <Box p={[0, 0.32, 0]} s={[0.5, 0.22, 0.8]} c="#9a5a3c" />
        </group>
      );
    })}
    {/* the canal's later traffic: a few boats moored at the market landings */}
    {Y > 1870 && Y < 1990 &&
      [MARKET_W, MARKET_E].map(([x], k) => (
        <group key={k} position={[x + 1.2, 0.02, -7.5]} rotation-y={Math.PI / 2} scale={0.4}>
          <RowBoat row={0} i={k + 5} />
        </group>
      ))}
  </>
);

/** the girder bridge where the line crosses the canal, and the road bridge (สะพานเจริญศรัทธา, 1918) */
const Bridges: React.FC<{Y: number}> = ({Y}) => (
  <>
    {Y > 1902.5 && (
      <group position={[RAIL_CANAL_X, 0, RAIL_Z]}>
        <Box p={[0, 0.22, 0]} s={[1.6, 0.12, 1.1]} c="#4f5560" />
        {[-0.5, 0.5].map((z) => (
          <Box key={z} p={[0, 0.42, z]} s={[1.6, 0.3, 0.06]} c="#5d646f" />
        ))}
      </group>
    )}
    {Y > 1917.5 && <Box p={[STATION_RD[0][0], 0.16, -7.5]} s={[1.0, 0.1, 1.6]} c="#e6dfd0" />}
  </>
);

// ------------------------------------------------------------------ the market by the canal
const Market: React.FC<{Y: number; night: number}> = ({Y, night}) => {
  const k = smooth01(ramp(Y, 1898, 1904));
  const lit = night > 0.3 ? '#ffd28a' : undefined;
  if (k < 0.02) return null;
  return (
    <>
      {[MARKET_W, MARKET_E].map(([mx, mz], m) =>
        Array.from({length: 6}, (_, i) => (
          <Grow key={`${m}${i}`} k={k} at={[mx - 2.2 + i * 0.9, 0, mz - 0.6]}>
            {/* Chinese shophouses along the bank, red-tiled */}
            <Box p={[0, 0.4, 0]} s={[0.8, 0.8, 0.9]} c={i % 2 ? '#e4d7bf' : '#d9c7a4'} e={lit} />
            <Box p={[0, 0.86, 0]} s={[0.86, 0.12, 0.96]} c="#a3533a" />
          </Grow>
        )),
      )}
    </>
  );
};

// ------------------------------------------------------------------ Sanam Chandra Palace (Rama VI)
const Palace: React.FC<{Y: number; night: number}> = ({Y, night}) => {
  const k = smooth01(ramp(Y, 1907, 1911));
  const lit = night > 0.3 ? '#ffd9a0' : undefined;
  return (
    <group position={[PALACE[0], 0, PALACE[1]]}>
      {/* the lawn (สนามจันทร์) and the moat round the grounds */}
      {k > 0.02 && (
        <mesh position={[0, 0.05, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[6.8 * k, 5.6 * k]} />
          <meshStandardMaterial color="#86ad5c" roughness={1} />
        </mesh>
      )}
      {/* พระที่นั่งพิมานปฐม and พระที่นั่งอภิรมย์ฤดี (Thai halls) */}
      <Viharn pos={[-1.2, 0, -0.8]} k={k} scale={0.8} rot={Math.PI / 2} />
      <Viharn pos={[1.2, 0, -0.8]} k={k} scale={0.7} rot={Math.PI / 2} />
      {/* พระตำหนักชาลีมงคลอาสน์ (the European villa) */}
      <Grow k={smooth01(ramp(Y, 1908, 1909))} at={[0.4, 0, 1.6]}>
        <Box p={[0, 0.5, 0]} s={[1.6, 1.0, 1.1]} c="#f0d48a" e={lit} />
        <mesh position={[0, 1.25, 0]} scale={[1, 0.55, 0.7]} rotation-y={Math.PI / 4}>
          <coneGeometry args={[1.1, 1, 4]} />
          <meshStandardMaterial color="#a3533a" flatShading />
        </mesh>
      </Grow>
      {/* the Ganesha shrine on its pillar */}
      <Grow k={k} at={[2.6, 0, 0.2]}>
        <Box p={[0, 0.5, 0]} s={[0.3, 1.0, 0.3]} c="#f2ead8" />
        <Box p={[0, 1.1, 0]} s={[0.36, 0.3, 0.36]} c="#d6a33d" />
      </Grow>
    </group>
  );
};

const Corps: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: CORPS}, (_, i) => {
      const m = marcherAt(i, t);
      if (!m) return null;
      return (
        <group key={i} position={[m.x, 0, m.z]} rotation-y={m.rot} scale={0.34}>
          <Walker step={m.moving ? t * 2 + (i % 2) * 0.5 : 0} i={i} spear still={!m.moving} />
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ Silpakorn and Phra Prathon
const Silpakorn: React.FC<{Y: number; night: number}> = ({Y, night}) => {
  const k = smooth01(ramp(Y, 1966, 1969));
  const lit = night > 0.3 ? '#ffe1a8' : undefined;
  return (
    <group position={[SILPAKORN[0], 0, SILPAKORN[1]]}>
      {[[-2, -1.6], [1.4, -1.8], [-1.6, 1.8], [1.8, 1.4], [0, 0]].map(([x, z], i) => (
        <Grow key={i} k={k} at={[x, 0, z]}>
          <Box p={[0, 0.55, 0]} s={[2.0, 1.1, 0.9]} c={i === 4 ? '#e8e2d4' : '#d9d2c1'} e={lit} />
        </Grow>
      ))}
    </group>
  );
};

/** Phra Prathon Chedi: the Dvaravati town's centre, a brick stupa standing all through */
const Prathon: React.FC = () => (
  <group position={[PRATHON[0], 0, PRATHON[1]]}>
    <Box p={[0, 0.3, 0]} s={[2.6, 0.6, 2.6]} c="#9a6a4c" />
    <SmallChedi pos={[0, 0.6, 0]} scale={0.9} k={1} color="#8e5a3e" />
  </group>
);

// ------------------------------------------------------------------ the fair (payoff)
const Fair: React.FC<{t: number; night: number}> = ({t, night}) => {
  const halo = useMemo(() => glowTexture('rgba(255,214,140,1)', 'rgba(255,170,80,0)'), []);
  const k = wheelK(t);
  if (k < 0.02) return null;
  const spin = t * 0.5;
  return (
    <group>
      {/* the crowd walking round the chedi */}
      {Array.from({length: WALKERS}, (_, i) => {
        const w = walkerAt(i, t);
        if (!w) return null;
        return (
          <group key={i} position={[w.x, 0.06 * H_MID, w.z]} rotation-y={w.rot} scale={0.3}>
            <Walker step={t * 1.3 + i * 0.29} i={i} />
          </group>
        );
      })}
      {/* stalls round the square's edge, strings of lights */}
      {Array.from({length: 24}, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r = 5.9;
        return (
          <group key={`s${i}`} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} rotation-y={-a}>
            <Grow k={k} at={[0, 0, 0]}>
              <Box p={[0, 0.3, 0]} s={[0.7, 0.6, 0.5]} c={['#c8322a', '#e2b33c', '#2f7fb8', '#e8e4dc'][i % 4]} e={night > 0.3 ? '#ffcf86' : undefined} />
            </Grow>
          </group>
        );
      })}
      {/* the Ferris wheel on the south side of the square */}
      <group position={[WHEEL[0], 0, WHEEL[1]]} scale={k}>
        {[-0.5, 0.5].map((x) => (
          <mesh key={x} position={[x * 0.6, 1.3, 0]} rotation-z={x > 0 ? -0.25 : 0.25}>
            <boxGeometry args={[0.12, 2.7, 0.12]} />
            <meshStandardMaterial color="#d8d2c4" />
          </mesh>
        ))}
        <group position={[0, 2.5, 0]} rotation-y={Math.PI / 2} rotation-z={spin}>
          <mesh>
            <torusGeometry args={[1.9, 0.06, 6, 40]} />
            <meshBasicMaterial color={night > 0.3 ? '#ffd27a' : '#e8e4dc'} toneMapped={false} />
          </mesh>
          {Array.from({length: 10}, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <group key={i}>
                <mesh rotation-z={a}>
                  <boxGeometry args={[0.04, 3.8, 0.04]} />
                  <meshStandardMaterial color="#cfc8b8" />
                </mesh>
                <mesh position={[Math.cos(a) * 1.9, Math.sin(a) * 1.9 - 0.2, 0]} rotation-z={-spin}>
                  <boxGeometry args={[0.32, 0.3, 0.3]} />
                  <meshStandardMaterial color={['#c8322a', '#2f7fb8', '#e2b33c'][i % 3]} />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>
      {/* the chedi's glow at night */}
      {night > 0.05 && (
        <sprite position={[0, 0.35 * H_MID, 0]} scale={[2.6 * H_MID, 2.6 * H_MID, 1]}>
          <spriteMaterial map={halo} transparent opacity={0.45 * night * k} depthWrite={false} toneMapped={false} />
        </sprite>
      )}
    </group>
  );
};

export const NakhonPathomLandmarks: React.FC<LandmarkProps> = ({Y, t, night}) => (
  <group>
    <ChediMain t={t} Y={Y} />
    <Debris t={t} />
    <Builders t={t} />
    <Canal t={t} />
    <Boats t={t} Y={Y} />
    <Bridges Y={Y} />
    <Market Y={Y} night={night} />
    <Palace Y={Y} night={night} />
    <Corps t={t} />
    <Silpakorn Y={Y} night={night} />
    <Prathon />
    <Fair t={t} night={night} />
  </group>
);
