// The dragon jar (owner's cover, style frame A1): a lathe-thrown jar on a wheel, the cream dragon
// coiling up it, the glaze darkening over the kiln fire; and the jar boats. Shared by the city and
// its style frames.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {lathe} from '../../engine/parts';
import {Walker} from '../nan/figures';

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

/** the dragon as it is on Ratchaburi's jars (the owner's photo of the monument): a gold relief across
 *  the belly in an S, its tail round the back, four legs with claws, a crest of fins, and a big head in
 *  profile in front with a snout, an open jaw, swept-back horns and long curling whiskers.
 *  Drawn in from its tail as u goes 0 -> 1. */
const GOLD = '#e2a83c';
const GOLD_D = '#b97a22';
const Dragon: React.FC<{u: number}> = ({u}) => {
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const N = 90;
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      // across the belly in an S, as on the monument: the tail round the back, the head in front
      const y = 0.4 + 0.11 * Math.sin(s * Math.PI * 3.2 + 0.6) + s * 0.12;
      const a = -Math.PI * 1.4 * (1 - s);
      const r = radiusAt(y) + 0.008;
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  if (u <= 0.02) return null;
  const BEADS = 110;
  const shown = Math.floor(BEADS * u);
  const head = curve.getPointAt(Math.min(1, u));
  const ahead = curve.getTangentAt(Math.min(1, u));
  // a frame on the jar's skin: out (normal), along (tangent), up (their cross)
  const frame = (p: THREE.Vector3, tan: THREE.Vector3) => {
    const out = new THREE.Vector3(p.x, 0, p.z).normalize();
    const up = new THREE.Vector3().crossVectors(out, tan).normalize();
    const along = new THREE.Vector3().crossVectors(up, out).normalize();
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(out, up, along));
  };
  const hq = frame(head, ahead);
  const LEGS = [0.45, 0.6, 0.82, 0.9];
  return (
    <group>
      {Array.from({length: shown}, (_, i) => {
        const s = (i / BEADS) * u;
        const p = curve.getPointAt(s);
        const q = frame(p, curve.getTangentAt(s));
        // tapering to the tail, full behind the head
        const f = (i + 1) / Math.max(1, shown);
        const r = 0.024 + 0.046 * Math.min(1, f * 1.4);
        return (
          <group key={i} position={p} quaternion={q}>
            {/* a flattened scale lying on the skin: thin outward, wide along the body */}
            <mesh scale={[r * 0.55, r, r * 1.25]} castShadow>
              <sphereGeometry args={[1, 10, 8]} />
              <meshStandardMaterial color={i % 3 === 0 ? GOLD_D : GOLD} roughness={0.35} metalness={0.25} />
            </mesh>
            {i % 3 === 1 && (
              <mesh position={[0, r * 1.05, 0]} rotation-x={-0.5}>
                <coneGeometry args={[r * 0.35, r * 1.1, 4]} />
                <meshStandardMaterial color="#c4501e" roughness={0.5} />
              </mesh>
            )}
          </group>
        );
      })}
      {/* four legs reaching down the skin, three claws each */}
      {LEGS.map((ls, k) => {
        if (ls > u - 0.03) return null;
        const p = curve.getPointAt(ls);
        const q = frame(p, curve.getTangentAt(ls));
        return (
          <group key={k} position={p} quaternion={q}>
            <mesh position={[0, -0.055, k % 2 ? 0.02 : -0.02]} rotation-x={k % 2 ? 0.5 : -0.5}>
              <cylinderGeometry args={[0.012, 0.016, 0.09, 6]} />
              <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.25} />
            </mesh>
            {[-1, 0, 1].map((c) => (
              <mesh key={c} position={[0, -0.1, c * 0.02 + (k % 2 ? 0.04 : -0.04)]} rotation-x={Math.PI + c * 0.4}>
                <coneGeometry args={[0.007, 0.035, 4]} />
                <meshStandardMaterial color="#f4ead0" roughness={0.4} />
              </mesh>
            ))}
          </group>
        );
      })}
      {/* the head at the shoulder, facing along the body: x out of the skin, y up, z forward */}
      <group position={head} quaternion={hq} scale={[1, 2, 2]}>
        {/* the snout turned in to follow the jar's curve, so the head lies on the skin */}
        <group rotation-y={-0.5}>
        <mesh position={[0.02, 0.01, 0.0]} scale={[0.06, 0.065, 0.075]} castShadow>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.25} />
        </mesh>
        {/* the long snout and the upturned nose */}
        <mesh position={[0.03, 0.0, 0.11]} scale={[0.035, 0.035, 0.085]} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.25} />
        </mesh>
        {/* the open lower jaw and the red mouth */}
        <mesh position={[0.03, -0.05, 0.09]} rotation-x={0.5} scale={[0.035, 0.012, 0.06]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={GOLD_D} roughness={0.4} />
        </mesh>
        <mesh position={[0.035, -0.028, 0.1]} scale={[0.028, 0.012, 0.045]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#b3261e" roughness={0.6} />
        </mesh>
        {[-1, 1].map((sd) => (
          <group key={sd}>
            {/* horns swept back */}
            <mesh position={[0.02 + sd * 0.0, 0.07, -0.04 + sd * 0.0]} rotation-x={-1.0} rotation-z={sd * 0.35}>
              <coneGeometry args={[0.01, 0.11, 5]} />
              <meshStandardMaterial color="#f1e2b8" roughness={0.4} />
            </mesh>
            {/* glowing eyes */}
            <mesh position={[0.055, 0.03, 0.04 + sd * 0.025]}>
              <sphereGeometry args={[0.013, 8, 6]} />
              <meshBasicMaterial color="#ff5a2a" toneMapped={false} />
            </mesh>
            {/* long whiskers trailing back */}
            <group position={[0.04, sd * 0.02, 0.15]} rotation-x={sd > 0 ? 0.9 : 2.3}>
              <mesh position={[0, 0.07, 0]}>
                <cylinderGeometry args={[0.005, 0.004, 0.14, 5]} />
                <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.25} />
              </mesh>
              <mesh position={[0, 0.15, 0.03]} rotation-x={0.8}>
                <cylinderGeometry args={[0.004, 0.002, 0.1, 5]} />
                <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.25} />
              </mesh>
            </group>
          </group>
        ))}
        {/* the mane */}
        {[0, 1, 2].map((m) => (
          <mesh key={m} position={[0.0, 0.04 - m * 0.02, -0.06 - m * 0.02]} rotation-x={-1.4}>
            <coneGeometry args={[0.018, 0.07, 4]} />
            <meshStandardMaterial color="#c4501e" roughness={0.5} />
          </mesh>
        ))}
        </group>
      </group>
    </group>
  );
};

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
      {/* turned so the head is in front for the cover's camera (azimuth ~200 deg, from the NNW) */}
      <group rotation-y={1.6}>
        <Dragon u={dragon} />
      </group>
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

