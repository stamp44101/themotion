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
const GLAZE = new THREE.Color('#4a2716');
const DRAGON = '#e9d7a8';

// the jar, height 1: a narrow foot, a full belly, the shoulder, a short neck and a rolled lip
const JAR: P2[] = [
  [0, 0], [0.27, 0], [0.31, 0.06], [0.4, 0.2], [0.47, 0.36], [0.49, 0.48], [0.47, 0.6], [0.41, 0.72],
  [0.33, 0.82], [0.27, 0.88], [0.26, 0.93], [0.3, 0.96], [0.29, 0.99], [0.24, 1], [0.22, 0.96], [0, 0.96],
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

/** the dragon: a turn and a quarter from the foot to the shoulder, a body of beads drawn in from
 *  its tail (thick in the middle, thin at the tail), a crest of spikes, and a head with horns, an
 *  open jaw and whiskers that leads the coil round the jar */
const Dragon: React.FC<{u: number}> = ({u}) => {
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const N = 80;
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      const y = 0.12 + s * 0.6 + 0.08 * Math.sin(s * 11);
      const a = s * Math.PI * 2.5;
      const r = radiusAt(y) + 0.03;
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  if (u <= 0.02) return null;
  const BEADS = 70;
  const shown = Math.floor(BEADS * u);
  const up = new THREE.Vector3(0, 1, 0);
  const head = curve.getPointAt(Math.min(1, u));
  const ahead = curve.getTangentAt(Math.min(1, u));
  const out = new THREE.Vector3(head.x, 0, head.z).normalize();
  const m = new THREE.Matrix4().makeBasis(out, new THREE.Vector3().crossVectors(ahead, out).normalize(), ahead);
  const q = new THREE.Quaternion().setFromRotationMatrix(m);
  return (
    <group>
      {Array.from({length: shown}, (_, i) => {
        const s = (i / BEADS) * u;
        const p = curve.getPointAt(s);
        // thickest a third of the way back from the head
        const f = i / Math.max(1, shown);
        const r = 0.025 + 0.04 * Math.sin(Math.PI * Math.min(1, f * 1.3));
        const n = new THREE.Vector3(p.x, 0, p.z).normalize();
        return (
          <group key={i} position={p}>
            <mesh castShadow>
              <sphereGeometry args={[r, 10, 8]} />
              <meshStandardMaterial color={i % 2 ? DRAGON : '#dcc38a'} roughness={0.45} />
            </mesh>
            {i % 3 === 0 && (
              <mesh position={[n.x * r * 0.6, r * 0.8, n.z * r * 0.6]} quaternion={new THREE.Quaternion().setFromUnitVectors(up, n.clone().add(up).normalize())}>
                <coneGeometry args={[r * 0.35, r * 1.4, 5]} />
                <meshStandardMaterial color="#d9822b" roughness={0.6} />
              </mesh>
            )}
          </group>
        );
      })}
      <group position={head} quaternion={q}>
        {/* the skull, the long snout, the open lower jaw */}
        <mesh position={[0.02, 0, 0.02]} castShadow>
          <boxGeometry args={[0.12, 0.13, 0.15]} />
          <meshStandardMaterial color={DRAGON} roughness={0.45} />
        </mesh>
        <mesh position={[0.03, 0.02, 0.13]} castShadow>
          <boxGeometry args={[0.08, 0.07, 0.12]} />
          <meshStandardMaterial color={DRAGON} roughness={0.45} />
        </mesh>
        <mesh position={[0.03, -0.05, 0.11]} rotation-x={0.45}>
          <boxGeometry args={[0.07, 0.025, 0.11]} />
          <meshStandardMaterial color="#c0503a" roughness={0.6} />
        </mesh>
        {[-1, 1].map((sd) => (
          <group key={sd}>
            <mesh position={[0.02, 0.09, sd * 0.04 - 0.02]} rotation-x={-0.9} rotation-z={sd * 0.3}>
              <coneGeometry args={[0.014, 0.14, 6]} />
              <meshStandardMaterial color="#d9822b" />
            </mesh>
            <mesh position={[0.07, 0.04, 0.0 + sd * 0.0]}>
              <sphereGeometry args={[0.018, 8, 6]} />
              <meshBasicMaterial color="#ffd23f" toneMapped={false} />
            </mesh>
            <mesh position={[0.03 + sd * 0.05, 0.0, 0.2]} rotation-z={sd * 1.1} rotation-x={0.4}>
              <cylinderGeometry args={[0.005, 0.003, 0.16, 4]} />
              <meshStandardMaterial color="#d9822b" />
            </mesh>
          </group>
        ))}
      </group>
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
        <meshStandardMaterial color={color} roughness={0.45 - glaze * 0.25} metalness={glaze * 0.1} />
      </mesh>
      {glaze < 0.9 && <Grooves t={t} k={k} />}
      <group rotation-y={Math.PI}>
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

