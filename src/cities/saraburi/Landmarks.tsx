import React from 'react';
import {Elephant, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {Hall, RowBoat, Truck} from '../phetchabun/figures';
import {
  beatK, clamp01, deerAt, deerBack, elephantAt, ELEPHANTS, fireK, flowersK, hallK, hunterAt, LANNA, lannaK, monkAt, MONKS,
  mondop1K, mondop2K, printAt, truckAt, TRUCKS, YUAN_BOATS, yuanBoatAt,
} from './actors';
import {Deer, Footprint, GlobbaSpray, Hunter, LightRings, Monk} from './figures';
import {CEMENT, CEMENT_HILLS, FOOT, OLD_HALL, SAO_HAI_HALL, SAO_HAI_MKT, WAT_PAK_PHRIAO, WAT_SUNG} from './places';
import {D_HERO} from './timeline';

type TH = LandmarkProps['terrainH'];
const smooth01 = (x: number) => x * x * (3 - 2 * x);
const ramp = (x: number, a: number, b: number) => smooth01(clamp01((x - a) / (b - a)));

// a growing mesh is gated on its own scale (CLAUDE.md: a mesh at scale 0 blacks out the shader look)
const Grow: React.FC<{k: number; children: React.ReactNode; at: [number, number, number]; rot?: number}> = ({k, children, at, rot = 0}) =>
  k > 0.02 ? (
    <group position={at} rotation-y={rot} scale={[1, Math.max(0.03, k), 1]}>
      {children}
    </group>
  ) : null;

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; e?: string; r?: number}> = ({p, s, c, e, r = 0}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} emissive={e ?? '#000000'} emissiveIntensity={e ? 0.6 : 0} />
  </mesh>
);

const GILT = '#d9a43a';
const WHITE = '#efe9dc';
const GREEN_TILE = '#3f7a5a';

// ------------------------------------------------------------------ the cover
const Cover: React.FC<{t: number; terrainH: TH}> = ({t, terrainH}) => {
  const pr = printAt(t);
  const d = deerAt(t);
  const h = hunterAt(t);
  const fy = terrainH(FOOT[0], FOOT[1]);
  // the print shows until the second mondop's platform covers it
  if (t > 24) return null;
  return (
    <>
      <group position={[FOOT[0], fy - 0.08 * pr.len, FOOT[1]]} scale={[pr.len, pr.len * 0.8, pr.len]}>
        <Footprint glow={pr.glow} />
        <LightRings t={t} t0={1.2} r={0.55} />
      </group>
      {d && (
        <group position={[d.x, terrainH(d.x, d.z) + Math.abs(Math.sin(d.step)) * 0.22 * d.s * d.gait, d.z]} rotation-y={d.rot} scale={d.s}>
          <Deer step={d.step} gait={d.gait} drink={d.drink} wound={d.wound} />
        </group>
      )}
      {h && (
        <group position={[h.x, terrainH(h.x, h.z), h.z]} scale={h.s}>
          <Hunter step={t * 9} run={1 - h.kneel} kneel={h.kneel} />
        </group>
      )}
    </>
  );
};

// ------------------------------------------------------------------ the mondops on the hill's crown
/** King Songtham's mondop: an open hall with one tiered spire, gilt (drawn ~2 tall, ~7x true) */
const Mondop1: React.FC<{k: number; fall: number; flame: number; t: number}> = ({k, fall, flame, t}) => {
  if (k < 0.02) return null;
  const top = 1 - fall; // the roof and spire burn and drop; the base stays
  return (
    <group>
      <Box p={[0, 0.25, 0]} s={[1.7, 0.5, 1.7]} c="#d8d0bf" />
      <Grow k={k} at={[0, 0.5, 0]}>
        <Box p={[0, 0.45, 0]} s={[1.2, 0.9, 1.2]} c={fall > 0.5 ? '#5d5148' : WHITE} />
        {top > 0.05 && (
          <group position={[0, 0.9, 0]} scale={[1, top, 1]}>
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} position={[0, 0.12 + i * 0.22, 0]} castShadow>
                <cylinderGeometry args={[0.55 - i * 0.12, 0.75 - i * 0.12, 0.22, 4, 1]} />
                <meshStandardMaterial color={fall > 0.2 ? '#4a3a2c' : GILT} metalness={0.4} roughness={0.5} flatShading />
              </mesh>
            ))}
            <mesh position={[0, 1.25, 0]} castShadow>
              <coneGeometry args={[0.16, 0.8, 8]} />
              <meshStandardMaterial color={fall > 0.2 ? '#4a3a2c' : GILT} metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
        )}
      </Grow>
      <Fire flame={flame} t={t} />
    </group>
  );
};

/** the flames and smoke of 2310 on the mondop */
const Fire: React.FC<{flame: number; t: number}> = ({flame, t}) => {
  if (flame < 0.02) return null;
  return (
    <group>
      {Array.from({length: 9}, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        const f = 0.75 + 0.25 * Math.sin(t * 13 + i * 2.1);
        return (
          <mesh key={i} position={[Math.cos(a) * 0.5, 1.3 + 0.6 * f * flame, Math.sin(a) * 0.5]} scale={[0.45 * flame, 2.0 * f * flame, 0.45 * flame]}>
            <coneGeometry args={[1, 1, 6]} />
            <meshBasicMaterial color={i % 2 ? '#ff8a1f' : '#ffd25a'} toneMapped={false} transparent opacity={0.9} />
          </mesh>
        );
      })}
      {Array.from({length: 7}, (_, i) => {
        const u = (t * 0.45 + i / 7) % 1;
        return (
          <mesh key={`s${i}`} position={[0.3 * Math.sin(i * 1.7) + u * 0.8, 1.8 + u * 3.2, 0.2 * Math.cos(i)]} scale={(0.35 + u * 0.7) * flame}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#4a4542" transparent opacity={0.55 * (1 - u)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Rama I's mondop of 2330: a square body on a platform, seven receding green-tiled tiers under a
 *  tall gilt spire, three naga stairs down the south slope (drawn ~3 tall, ~8x true) */
const Mondop2: React.FC<{k: number}> = ({k}) => {
  if (k < 0.02) return null;
  const tiers = Math.round(7 * clamp01((k - 0.35) / 0.5));
  const spire = clamp01((k - 0.8) / 0.2);
  return (
    <group>
      {/* the platform and its parapet (กำแพงแก้ว) */}
      <Box p={[0, 0.2, 0]} s={[2.6, 0.4, 2.6]} c="#ddd5c4" />
      {[
        [0, -1.25, 2.6, 0.1],
        [-1.25, 0, 0.1, 2.6],
        [1.25, 0, 0.1, 2.6],
        [-0.85, 1.25, 0.9, 0.1],
        [0.85, 1.25, 0.9, 0.1],
      ].map(([x, z, w, l], i) => (
        <Box key={i} p={[x, 0.55, z]} s={[w, 0.3, l]} c={WHITE} />
      ))}
      <Grow k={clamp01(k / 0.35)} at={[0, 0.4, 0]}>
        <Box p={[0, 0.5, 0]} s={[1.3, 1.0, 1.3]} c={WHITE} />
        {/* gilt doors on the four sides */}
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} p={[Math.sin((i * Math.PI) / 2) * 0.66, 0.42, Math.cos((i * Math.PI) / 2) * 0.66]} s={[0.36, 0.6, 0.04]} r={(i * Math.PI) / 2} c={GILT} />
        ))}
      </Grow>
      {Array.from({length: tiers}, (_, i) => (
        <mesh key={i} position={[0, 1.45 + i * 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.5 - i * 0.055, 0.78 - i * 0.055, 0.2, 4, 1]} />
          <meshStandardMaterial color={i % 2 ? GILT : GREEN_TILE} metalness={i % 2 ? 0.45 : 0.1} roughness={0.5} flatShading />
        </mesh>
      ))}
      {spire > 0.02 && (
        <mesh position={[0, 2.85 + 0.5 * spire, 0]} scale={[1, spire, 1]} castShadow>
          <coneGeometry args={[0.18, 1.0, 10]} />
          <meshStandardMaterial color={GILT} metalness={0.55} roughness={0.35} />
        </mesh>
      )}
    </group>
  );
};

/** the three naga stairs down the south slope, from the platform to the hill's foot */
const Stairs: React.FC<{k: number; terrainH: TH}> = ({k, terrainH}) => {
  if (k < 0.5) return null;
  const u = clamp01((k - 0.5) / 0.3);
  return (
    <>
      {[-0.7, 0.5, 1.7].map((dx, j) =>
        Array.from({length: 7}, (_, i) => {
          const x = FOOT[0] + dx - 0.6;
          const z = FOOT[1] + 1.6 + i * 0.9;
          if (i / 7 > u) return null;
          return <Box key={`${j}${i}`} p={[x, terrainH(x, z) + 0.06, z]} s={[0.42, 0.14, 0.9]} c={i === 6 ? GILT : '#cfc6b3'} />;
        }),
      )}
    </>
  );
};

const Mondops: React.FC<{t: number; Y: number; terrainH: TH}> = ({t, Y, terrainH}) => {
  const y = terrainH(FOOT[0], FOOT[1]);
  const f = fireK(t);
  const after = Y > 1768;
  const m1 = Y < 1700 ? mondop1K(t) : 1;
  const fall = Y > 1700 ? (after ? 1 : f.fall) : 0;
  const m2 = Y > 1790 ? 1 : Y > 1780 ? mondop2K(t) : 0;
  return (
    <group position={[FOOT[0], y, FOOT[1]]}>
      {m2 < 0.3 && <Mondop1 k={m1} fall={fall} flame={Y > 1700 && !after ? f.flame : 0} t={t} />}
      <Mondop2 k={m2} />
    </group>
  );
};

// ------------------------------------------------------------------ the king's elephants
const Elephants: React.FC<{t: number; terrainH: TH}> = ({t, terrainH}) => (
  <>
    {Array.from({length: ELEPHANTS}, (_, i) => {
      const e = elephantAt(i, t);
      if (!e) return null;
      return (
        <group key={i} position={[e.x, terrainH(e.x, e.z), e.z]} rotation-y={e.rot} scale={0.8}>
          <Elephant step={Math.sin(t * 5 + i)} howdah={e.howdah} color="#8a857f" />
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ the Thai Yuan
/** a Lanna house on posts, a steep gable with crossed กาแล at the ridge, a loom under some */
const Lanna: React.FC<{k: number; loom: boolean}> = ({k, loom}) => (
  <Grow k={k} at={[0, 0, 0]}>
    {[-0.3, 0.3].map((x) =>
      [-0.4, 0.4].map((z) => <Box key={`${x}${z}`} p={[x, 0.25, z]} s={[0.07, 0.5, 0.07]} c="#4a3322" />),
    )}
    <Box p={[0, 0.65, 0]} s={[0.75, 0.32, 1.0]} c="#7b5534" />
    <mesh position={[0, 1.02, 0]} rotation-z={Math.PI / 4} castShadow>
      <boxGeometry args={[0.6, 0.6, 1.12]} />
      <meshStandardMaterial color="#5b3f2a" roughness={0.9} />
    </mesh>
    {[-0.55, 0.55].map((z) => (
      <group key={z} position={[0, 1.42, z]}>
        <Box p={[-0.08, 0, 0]} s={[0.04, 0.3, 0.04]} c="#3e2a1c" r={0} />
        <Box p={[0.08, 0, 0]} s={[0.04, 0.3, 0.04]} c="#3e2a1c" r={0} />
      </group>
    ))}
    {loom && <Box p={[0.15, 0.18, 0]} s={[0.3, 0.16, 0.36]} c="#b3262a" />}
  </Grow>
);

const Yuan: React.FC<{t: number; Y: number; terrainH: TH}> = ({t, Y, terrainH}) => {
  if (Y < 1803.5) return null;
  return (
    <>
      {LANNA.map(([x, z], i) => (
        <group key={i} position={[x, terrainH(x, z), z]} rotation-y={(i * 0.7) % 1.2}>
          <Lanna k={Y > 1805 ? 1 : lannaK(i, t)} loom={i % 3 === 0} />
        </group>
      ))}
      {Array.from({length: YUAN_BOATS}, (_, i) => {
        const b = yuanBoatAt(i, t);
        if (!b) return null;
        return (
          <group key={`b${i}`} position={[b.x, 0, b.z]} rotation-y={b.rot} scale={0.75}>
            <RowBoat row={t * 1.3 + i * 0.3} i={i} />
          </group>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ Sao Hai and Pak Phriao
/** Sao Hai's riverside market and Wat Sung (old), the seat's hall until the train */
const SaoHai: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const hall = Y < 1896 ? 1 : Y > 1898 ? 0 : 1 - hallK(t);
  return (
    <>
      {Array.from({length: 6}, (_, i) => (
        <Box key={i} p={[SAO_HAI_MKT[0] - 2 + i * 0.8, 0.3, SAO_HAI_MKT[1]]} s={[0.7, 0.6, 0.8]} c={i % 2 ? '#8a6a48' : '#7a5c3e'} />
      ))}
      <Viharn pos={[WAT_SUNG[0], 0, WAT_SUNG[1]]} k={1} scale={0.45} />
      {hall > 0.02 && (
        <group position={[SAO_HAI_HALL[0], 0, SAO_HAI_HALL[1]]} scale={[0.5, 0.5 * hall, 0.5]} rotation-y={Math.PI / 2}>
          <Hall />
        </group>
      )}
    </>
  );
};

/** the provincial hall at Pak Phriao (white, colonial, 2440) and Wat Pak Phriao */
const PakPhriao: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = Y < 1896 ? 0 : Y > 1898 ? 1 : hallK(t);
  return (
    <>
      <Viharn pos={[WAT_PAK_PHRIAO[0], 0, WAT_PAK_PHRIAO[1]]} k={Y > 1700 ? 1 : 0} scale={0.45} />
      <Grow k={Y > 2018 ? 0 : k} at={[OLD_HALL[0], 0, OLD_HALL[1]]}>
        <Box p={[0, 0.35, 0]} s={[1.8, 0.7, 0.9]} c="#f1ece0" />
        <mesh position={[0, 0.85, 0]} rotation-y={Math.PI / 4} scale={[1.35, 0.35, 0.75]} castShadow>
          <coneGeometry args={[1, 1, 4]} />
          <meshStandardMaterial color="#b4553b" flatShading roughness={0.8} />
        </mesh>
      </Grow>
    </>
  );
};

// ------------------------------------------------------------------ the Friendship Highway
const Trucks: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: TRUCKS}, (_, i) => {
      const p = truckAt(i, t);
      if (!p) return null;
      return (
        <group key={i} position={[p.x, 0.02, p.z]} rotation-y={p.rot} scale={0.55}>
          <Truck />
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ the cement hills
/** quarry benches cut white into the hills' south faces, and the works at their foot, by year */
const Cement: React.FC<{Y: number; t: number; terrainH: TH}> = ({Y, t, terrainH}) => {
  const k = ramp(Y, 1971, 2015);
  const plant = ramp(Y, 1970, 1973);
  return (
    <>
      {k > 0.02 &&
        CEMENT_HILLS.map(([hx, hz, h, r], j) =>
          Array.from({length: 4}, (_, i) => {
            if (i / 4 > k) return null;
            const z = hz + r * (0.35 + i * 0.16);
            const x = hx + (j - 1) * 0.6;
            const w = r * (0.9 - i * 0.12);
            return <Box key={`${j}${i}`} p={[x, terrainH(x, z) - 0.15, z]} s={[w, 0.5, 1.1]} c="#e6e1d6" />;
          }),
        )}
      <Grow k={plant} at={[CEMENT[0], 0, CEMENT[1]]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-1.2 + i * 0.6, 1.0, -0.6]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 2.0, 12]} />
            <meshStandardMaterial color="#d7d2c8" roughness={0.7} />
          </mesh>
        ))}
        <Box p={[0.4, 0.5, 0.6]} s={[2.6, 1.0, 1.0]} c="#9a9a96" />
        <mesh position={[1.6, 1.8, -0.4]} castShadow>
          <cylinderGeometry args={[0.14, 0.2, 3.6, 10]} />
          <meshStandardMaterial color="#c9c4ba" roughness={0.7} />
        </mesh>
      </Grow>
      {plant > 0.9 &&
        Array.from({length: 4}, (_, i) => {
          const u = (t * 0.35 + i / 4) % 1;
          return (
            <mesh key={`p${i}`} position={[CEMENT[0] + 1.6 + u * 1.4, 3.8 + u * 2.4, CEMENT[1] - 0.4]} scale={0.3 + u * 0.6}>
              <sphereGeometry args={[1, 8, 6]} />
              <meshStandardMaterial color="#e9e6e0" transparent opacity={0.5 * (1 - u)} depthWrite={false} />
            </mesh>
          );
        })}
    </>
  );
};

// ------------------------------------------------------------------ flower alms (the payoff)
const SPRAYS: [number, number, number][] = [
  [-2.2, 1.0, 0.9], [2.1, 0.6, 1.0], [-1.9, 3.4, 0.8], [2.6, 3.2, 0.85], [-2.8, -1.4, 0.95], [2.9, -1.6, 0.9],
  [-0.9, -2.6, 0.8], [1.2, -2.7, 0.85], [-3.6, 1.8, 0.7], [3.8, 1.4, 0.75], [-3.2, 5.0, 0.8], [3.4, 5.2, 0.8],
  [-4.4, -0.6, 0.7], [4.6, -2.8, 0.7], [-2.4, 7.0, 0.75], [2.8, 7.2, 0.75],
];
const Flowers: React.FC<{t: number; Y: number; terrainH: TH}> = ({t, Y, terrainH}) => {
  if (Y < 2024.5) return null;
  const k = flowersK(t);
  return (
    <>
      {SPRAYS.map(([dx, dz, s], i) => {
        const x = FOOT[0] + dx;
        const z = FOOT[1] + dz;
        return (
          <group key={i} position={[x, terrainH(x, z), z]} rotation-y={i * 1.3} scale={2.4 * s}>
            <GlobbaSpray open={clamp01(k * 1.4 - i * 0.04)} seed={i} />
          </group>
        );
      })}
      {Array.from({length: MONKS}, (_, i) => {
        const m = monkAt(i, t);
        if (!m) return null;
        return (
          <group key={`m${i}`} position={[m.x, terrainH(m.x, m.z), m.z]} rotation-y={m.rot - Math.PI / 2} scale={0.55}>
            <Monk step={t * 6 + i} />
          </group>
        );
      })}
      <DeerBack t={t} terrainH={terrainH} />
    </>
  );
};
const DeerBack: React.FC<{t: number; terrainH: TH}> = ({t, terrainH}) => {
  const d = deerBack(t);
  if (!d || d.s < 0.05) return null;
  return (
    <group position={[d.x, terrainH(d.x, d.z), d.z]} rotation-y={Math.PI - 0.4} scale={d.s}>
      <Deer step={0} gait={0} drink={d.drink} wound={0} />
    </group>
  );
};

export const SaraburiLandmarks: React.FC<LandmarkProps> = ({t, Y, terrainH}) => (
  <group>
    <Cover t={t} terrainH={terrainH} />
    <Mondops t={t} Y={Y} terrainH={terrainH} />
    <Stairs k={Y > 1790 ? 1 : Y > 1780 ? mondop2K(t) : 0} terrainH={terrainH} />
    <Elephants t={t} terrainH={terrainH} />
    <Yuan t={t} Y={Y} terrainH={terrainH} />
    <SaoHai t={t} Y={Y} />
    <PakPhriao t={t} Y={Y} />
    <Trucks t={t} />
    <Cement Y={Y} t={t} terrainH={terrainH} />
    <Flowers t={t} Y={Y} terrainH={terrainH} />
  </group>
);
