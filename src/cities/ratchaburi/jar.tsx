// The dragon jar (owner's cover, style frame A1): a lathe-thrown jar on a wheel, the cream dragon
// coiling up it, the glaze darkening over the kiln fire; and the jar boats. Shared by the city and
// its style frames.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {lathe} from '../../engine/parts';
import {Walker} from '../nan/figures';
import {DragonRelief} from './dragon';

type P2 = [number, number];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const CLAY = new THREE.Color('#b5583a');
const GLAZE = new THREE.Color('#6e4632');

// the jar, height 1, after the owner's photo of Ratchaburi's dragon-jar monument: taller than wide, a
// narrow foot widening to the shoulder high up (widest ~0.62), a short neck and a broad rolled lip
const JAR: P2[] = [
  [0, 0], [0.24, 0], [0.26, 0.05], [0.31, 0.18], [0.36, 0.34], [0.4, 0.5], [0.415, 0.62], [0.4, 0.72],
  [0.35, 0.81], [0.3, 0.87], [0.29, 0.91], [0.34, 0.93], [0.34, 0.98], [0.3, 1], [0.27, 0.95], [0, 0.95],
];
// the lump of clay on the wheel, the same number of points
const LUMP: P2[] = JAR.map(([r, y], i) => (i === JAR.length - 1 || i === 0 ? [0, y * 0.35] : [Math.min(r, 0.3) * 1.05, y * 0.35]));

/** the jar thrown: k 0 = the lump, 1 = the jar */
const thrown = (k: number): P2[] => JAR.map(([r, y], i) => [LUMP[i][0] + (r - LUMP[i][0]) * k, LUMP[i][1] + (y - LUMP[i][1]) * k]);

/** the jar's radius at height y (for the dragon to lie on its skin) */
const radiusAt = (y: number) => {
  for (let i = 1; i < 11; i++) {
    const [r0, a] = JAR[i - 1];
    const [r1, b] = JAR[i];
    if (y >= a && y <= b) return r0 + ((y - a) / (b - a)) * (r1 - r0);
  }
  return 0.3;
};

// turned so the head (design x ~ -0.1) faces the cover camera (azimuth ~200-208 deg); the payoff looks from ~180-192
const FRONT = (229 * Math.PI) / 180;

/** the gold bands: two lines round the shoulder and two near the foot (the monument's) */
const Bands: React.FC<{k: number}> = ({k}) => {
  if (k <= 0.02) return null;
  return (
    <group>
      {[0.2, 0.235, 0.74, 0.775].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[radiusAt(y) + 0.004, 0.007 * k, 6, 64]} />
          <meshStandardMaterial color="#e2a83c" roughness={0.35} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

/** throwing rings: dark grooves that wind up the clay while it spins, so the turning reads */
const Grooves: React.FC<{t: number; k: number}> = ({t, k}) => (
  <>
    {[0, 1, 2, 3, 4].map((i) => {
      const y = (0.12 + i * 0.17) * (0.35 + 0.65 * k);
      const a = t * 9 + i * 1.3;
      const r = radiusAt(Math.min(0.9, y / (0.35 + 0.65 * k))) * (0.6 + 0.4 * k) + 0.012;
      return (
        <mesh key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} rotation-y={-a}>
          <boxGeometry args={[0.02, 0.05, 0.16]} />
          <meshStandardMaterial color="#7e3824" roughness={0.9} />
        </mesh>
      );
    })}
  </>
);

/** the kiln fire round the jar's foot once the glaze takes */
const Fire: React.FC<{t: number; k: number}> = ({t, k}) => {
  if (k <= 0.02) return null;
  return (
    <group>
      {Array.from({length: 14}, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const h = (0.1 + 0.06 * Math.sin(t * 13 + i * 2.1)) * k;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.4, h / 2, Math.sin(a) * 0.4]}>
            <coneGeometry args={[0.05, h, 6]} />
            <meshBasicMaterial color={i % 2 ? '#ffb347' : '#ff7a2a'} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

export type JarLook = {thrown: number; dragon: number; glaze: number; fire: number};
/** the cover's timing: already rising out of the lump at frame 0 (the cover is an event) */
export const coverJar = (t: number): JarLook => ({
  thrown: smooth(clamp01((t + 0.3) / 1.5)),
  dragon: smooth(clamp01((t - 0.7) / 1.5)),
  glaze: smooth(clamp01((t - 1.5) / 1.2)),
  fire: smooth(clamp01((t - 1.5) / 1.2)) * (1 - smooth(clamp01((t - 3.2) / 1))),
});

export const Jar: React.FC<{t: number; H: number; potters: boolean; look?: JarLook; wheel?: boolean}> = ({t, H, potters, look, wheel = true}) => {
  const s = look ?? coverJar(t);
  const k = s.thrown;
  const dragon = s.dragon;
  const glaze = s.glaze;
  const geo = useMemo(() => lathe(thrown(k), 48), [k]);
  const color = useMemo(() => CLAY.clone().lerp(GLAZE, glaze * 0.85), [glaze]);
  return (
    <group scale={H}>
      {/* the wheel */}
      {wheel && <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.55, 0.58, 0.04, 48]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.9} />
      </mesh>}
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.6 - glaze * 0.1} metalness={0} />
      </mesh>
      <Bands k={dragon} />
      {glaze < 0.9 && <Grooves t={t} k={k} />}
      <DragonRelief u={dragon} radiusAt={radiusAt} theta0={FRONT} />
      <Fire t={t} k={s.fire} />
      {potters &&
        Array.from({length: 10}, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(a) * 0.75, 0, Math.sin(a) * 0.75]} rotation-y={-a - Math.PI / 2} scale={0.022}>
              <Walker step={t * 0.6 + i * 0.37} i={i} />
            </group>
          );
        })}
    </group>
  );
};

/** a jar boat: a long hull loaded with rows of small jars, going downstream */
export const JarBoat: React.FC<{p: P2; dir: number}> = ({p, dir}) => (
  <group position={[p[0], 0.1, p[1]]} rotation-y={dir} scale={2.2}>
    <mesh castShadow>
      <boxGeometry args={[0.55, 0.16, 1.8]} />
      <meshStandardMaterial color="#5b3b22" roughness={0.9} />
    </mesh>
    {Array.from({length: 8}, (_, i) => (
      <mesh key={i} position={[(i % 2) * 0.24 - 0.12, 0.18, -0.7 + Math.floor(i / 2) * 0.45]} castShadow>
        <sphereGeometry args={[0.13, 10, 8]} />
        <meshStandardMaterial color={i % 3 ? '#4a2716' : '#8a4a2a'} roughness={0.4} />
      </mesh>
    ))}
  </group>
);

