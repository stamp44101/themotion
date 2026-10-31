import React from 'react';
import {Prang, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp} from '../../lib';
import {Cart, Walker} from '../nan/figures';
import {RowBoat} from '../phetchabun/figures';
import {
  clamp01, FERRIES, ferryAt, fountainK, jarAt, JARBOATS, jarBoatAt, jarsK, kilnK, koikiK, strollerAt, WALKERS, wallK, YUAN,
  yuanAt,
} from './actors';
import {Jar, JarBoat} from './jar';
import {FOUNTAIN, HERO, KILNS, KOIKI, LANDING, MAHATHAT, OLD_HALL, PILLAR} from './places';
import {H_FOUNT} from './timeline';

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

// ------------------------------------------------------------------ the cover's jar
const HeroJar: React.FC<{t: number}> = ({t}) => {
  const s = jarAt(t);
  if (s.h < 0.3) return null;
  return (
    <group position={[HERO[0], 0, HERO[1]]}>
      <Jar t={t} H={s.h} potters={s.h > 12} look={s} />
    </group>
  );
};

// ------------------------------------------------------------------ Wat Mahathat (old, on the west bank)
const Mahathat: React.FC = () => (
  <group>
    <Prang pos={[MAHATHAT[0], 0, MAHATHAT[1]]} k={1} scale={0.62} color="#e4dccb" />
    {/* the laterite enclosure */}
    {[
      [0, -1.9, 3.8, 0.3],
      [0, 1.9, 3.8, 0.3],
      [-1.9, 0, 0.3, 3.8],
      [1.9, 0, 0.3, 3.8],
    ].map(([dx, dz, w, l], i) => (
      <Box key={i} p={[MAHATHAT[0] + dx, 0.22, MAHATHAT[1] + dz]} s={[w, 0.44, l]} c="#9c5a3c" />
    ))}
    <Viharn pos={[MAHATHAT[0], 0, MAHATHAT[1] + 3.2]} k={1} scale={0.5} />
  </group>
);

// ------------------------------------------------------------------ the city pillar shrine (2360)
const Pillar: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = Y >= 1818 ? 1 : smooth01(clamp01((wallK(t) - 0.5) / 0.4));
  return (
    <Grow k={k} at={[PILLAR[0], 0, PILLAR[1]]}>
      <Box p={[0, 0.3, 0]} s={[0.9, 0.6, 0.9]} c="#efe7d6" />
      <mesh position={[0, 0.85, 0]} castShadow>
        <coneGeometry args={[0.6, 0.6, 4]} />
        <meshStandardMaterial color="#c4452f" roughness={0.7} />
      </mesh>
    </Grow>
  );
};

// ------------------------------------------------------------------ the Thai Yuan column
const Column: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: YUAN}, (_, i) => {
      const w = yuanAt(i, t);
      if (!w) return null;
      return (
        <group key={i} position={[w.x, 0, w.z]} rotation-y={w.rot} scale={w.cart ? 1.1 : 1.3}>
          {w.cart ? <Cart step={t * 1.6 + i} /> : <Walker step={t * 1.4 + i * 0.31} i={i} load={i % 3 === 0} />}
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ the ferries of 2360
const Ferries: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: FERRIES}, (_, i) => {
      const f = ferryAt(i, t);
      if (!f) return null;
      return (
        <group key={i} position={[f.x, 0.05, f.z]} rotation-y={f.rot} scale={0.5}>
          <RowBoat row={t * 1.2 + i} i={i} />
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ Koi Ki: the riverside shophouse rows
const Koiki: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = Y >= 1898 ? 1 : koikiK(t);
  if (k <= 0.02 && Y < 1897) return null;
  const [[x0, z], [x1]] = KOIKI;
  const n = Math.round((x1 - x0) / 0.82);
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        // each house goes up in its turn along the street, from the bend east
        const ki = Y >= 1898 ? 1 : smooth01(clamp01(k * 1.6 - (i / n) * 0.6));
        const x = x0 + (i + 0.5) * ((x1 - x0) / n);
        const wood = i % 3 === 1 ? '#8a5a36' : '#9b6a42';
        return (
          <Grow key={i} k={ki} at={[x, 0, z]}>
            <Box p={[0, 0.45, 0]} s={[0.76, 0.9, 0.9]} c={wood} />
            <Box p={[0, 0.98, 0]} s={[0.8, 0.16, 0.96]} c="#7a3b2a" />
            {/* the shop front open to the street on the river side */}
            <Box p={[0, 0.3, -0.46]} s={[0.6, 0.5, 0.04]} c="#3a2a1c" e={Y > 2020 ? '#ffb347' : undefined} />
          </Grow>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ the pink monthon hall (2465)
const OldHall: React.FC<{Y: number}> = ({Y}) => {
  const k = smooth01(ramp(Y, 1921.5, 1922.5));
  return (
    <Grow k={k} at={[OLD_HALL[0], 0, OLD_HALL[1]]}>
      <Box p={[0, 0.5, 0]} s={[2.4, 1.0, 1.2]} c="#e7a9a0" />
      <Box p={[0, 1.08, 0]} s={[2.6, 0.18, 1.4]} c="#9c4a3a" />
    </Grow>
  );
};

// ------------------------------------------------------------------ the kilns (2476 on)
/** a dragon kiln: a long brick tunnel up a gentle slope, a chimney at its head */
const Kiln: React.FC<{k: number; t: number; i: number; Y: number}> = ({k, t, i, Y}) => (
  <Grow k={k} at={[0, 0, 0]}>
    <mesh position={[0, 0.35, 0]} rotation-x={Math.PI / 2} rotation-z={0.06} castShadow>
      <cylinderGeometry args={[0.42, 0.42, 4.2, 10, 1, false, 0, Math.PI]} />
      <meshStandardMaterial color="#8c4a32" roughness={0.95} side={2} />
    </mesh>
    <Box p={[0, 0.9, -2.2]} s={[0.4, 1.8, 0.4]} c="#7a3b2a" />
    {Y < 2010 &&
      [0, 1, 2].map((j) => {
        const u = (t * 0.5 + j / 3 + i * 0.21) % 1;
        return (
          <mesh key={j} position={[0.1 * Math.sin(u * 6), 1.9 + u * 1.6, -2.2 - u * 0.4]} scale={0.25 + u * 0.4}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#d9d4ca" transparent opacity={0.55 * (1 - u)} roughness={1} />
          </mesh>
        );
      })}
  </Grow>
);

const Kilns: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = Y >= 1934 ? 1 : kilnK(t);
  const jars = Y >= 1934 ? 1 : jarsK(t);
  if (Y < 1933) return null;
  return (
    <group position={[KILNS[0], 0, KILNS[1]]}>
      {[-1.6, 0, 1.6].map((dx, i) => (
        <group key={i} position={[dx, 0, 0]}>
          <Kiln k={smooth01(clamp01(k * 1.5 - i * 0.25))} t={t} i={i} Y={Y} />
        </group>
      ))}
      {/* jars set out to dry in rows south of the kilns */}
      {Array.from({length: 24}, (_, j) => {
        const kj = smooth01(clamp01(jars * 1.4 - (j / 24) * 0.4));
        if (kj <= 0.02) return null;
        const x = -2.4 + (j % 8) * 0.68;
        const z = 2.8 + Math.floor(j / 8) * 0.7;
        return (
          <mesh key={j} position={[x, 0.26 * kj, z]} scale={[0.26, 0.3 * kj, 0.26]} castShadow>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color={j % 4 === 1 ? '#8a4a2a' : '#4a2716'} roughness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ the jar boats and the landing
const JarBoats: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: JARBOATS}, (_, i) => {
      const b = jarBoatAt(i, t);
      if (!b) return null;
      return <JarBoat key={i} p={[b.x, b.z]} dir={b.rot} />;
    })}
  </>
);

const LandingJars: React.FC<{Y: number}> = ({Y}) => {
  if (Y < 1941 || Y > 1990) return null;
  return (
    <group position={[LANDING[0] - 0.6, 0, LANDING[1] + 1.4]}>
      {Array.from({length: 10}, (_, j) => (
        <mesh key={j} position={[(j % 5) * 0.5, 0.22, Math.floor(j / 5) * 0.5]} scale={[0.22, 0.26, 0.22]} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#4a2716" roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ the payoff: the jar fountain (2565)
const FOUNT_LOOK = {thrown: 1, dragon: 1, glaze: 1, fire: 0};
const Fountain: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 2022.8) return null;
  const k = fountainK(t);
  return (
    <group position={[FOUNTAIN[0], 0, FOUNTAIN[1]]}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.7, 0.24, 32]} />
        <meshStandardMaterial color="#cfc6b0" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.04, 32]} />
        <meshStandardMaterial color="#5fa8d3" roughness={0.15} metalness={0.2} />
      </mesh>
      <group position={[0, 0.24, 0]}>
        <Jar t={t} H={H_FOUNT} potters={false} look={FOUNT_LOOK} wheel={false} />
      </group>
      {/* the spray: arcs of water from the dragons' mouths into the basin, lit at night */}
      {k > 0.02 &&
        Array.from({length: 10}, (_, i) => {
          const a = (i / 10) * Math.PI * 2 + t * 0.4;
          const u = (t * 1.3 + i * 0.13) % 1;
          const r = 0.7 + u * 0.7;
          const y = 0.25 + H_FOUNT * 0.75 * Math.sin(Math.PI * (0.35 + 0.65 * u)) * k;
          return (
            <mesh key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} scale={0.09}>
              <sphereGeometry args={[1, 8, 6]} />
              <meshBasicMaterial color="#cfeeff" toneMapped={false} />
            </mesh>
          );
        })}
    </group>
  );
};

const Strollers: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: WALKERS}, (_, i) => {
      const w = strollerAt(i, t);
      if (!w) return null;
      return (
        <group key={i} position={[w.x, 0, w.z]} rotation-y={w.rot} scale={0.36}>
          <Walker step={t * 1.1 + i * 0.29} i={i} />
        </group>
      );
    })}
  </>
);

export const RatchaburiLandmarks: React.FC<LandmarkProps> = ({t, Y}) => (
  <group>
    <HeroJar t={t} />
    <Mahathat />
    <Column t={t} />
    <Pillar t={t} Y={Y} />
    <Ferries t={t} />
    <Koiki t={t} Y={Y} />
    <OldHall Y={Y} />
    <Kilns t={t} Y={Y} />
    <JarBoats t={t} />
    <LandingJars Y={Y} />
    <Fountain t={t} Y={Y} />
    <Strollers t={t} />
  </group>
);
