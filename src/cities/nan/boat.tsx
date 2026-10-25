// Nan's naga race boat (เรือแข่งหัวพญานาค, docs/briefs/nan.md §4 A): a long, narrow dugout hull
// with a raised naga head at the bow (open mouth, curled fangs, red eyes, a crest of flames)
// and a tail sweeping up at the stern; two files of paddlers in one team shirt stroking in
// time, a man standing amidships calling the stroke and a steersman at the stern.
import React, {useMemo} from 'react';
import * as THREE from 'three';

type V3 = [number, number, number];

const GOLD = '#e3a935';
const GOLD_DARK = '#a8711c';
const RED = '#b0261c';
const LACQUER = '#1c1715';
const SKIN = '#a8714a';

const smooth = (x: number) => x * x * (3 - 2 * x);

/** The hull, along +z (bow at +z), waterline at y = 0. */
const hullGeometry = (L: number, B: number) => {
  const N = 48;
  const M = 10;
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const band = new THREE.Color(RED);
  const dark = new THREE.Color(LACQUER);
  const gold = new THREE.Color(GOLD);
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const z = -L / 2 + u * L;
    const w = (B / 2) * Math.max(0.04, Math.pow(Math.sin(Math.PI * u), 0.55));
    // the sheer rises toward both ends, the bow more
    const top = 0.32 + 0.9 * Math.pow(Math.max(0, (u - 0.86) / 0.14), 2) + 0.5 * Math.pow(Math.max(0, (0.1 - u) / 0.1), 2);
    for (let j = 0; j <= M; j++) {
      const a = -Math.PI / 2 + (j / M) * Math.PI;
      const x = w * Math.sin(a);
      const y = top - 0.75 * Math.cos(a);
      pos.push(x, y, z);
      // gold rim, a red band under it, black lacquer below
      const c = y > top - 0.07 ? gold : y > top - 0.2 ? band : dark;
      col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < N; i++)
    for (let j = 0; j < M; j++) {
      const a = i * (M + 1) + j;
      const b = a + M + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

/** A curve swept with a radius that tapers from r0 to r1. */
const Tapered: React.FC<{pts: V3[]; r0: number; r1: number; color: string}> = ({pts, r0, r1, color}) => {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
    const g = new THREE.TubeGeometry(curve, 24, 1, 10, false);
    // scale each ring about its centre
    const P = g.attributes.position as THREE.BufferAttribute;
    const segs = 24;
    const radial = 10;
    for (let i = 0; i <= segs; i++) {
      const c = curve.getPointAt(i / segs);
      const r = r0 + (r1 - r0) * (i / segs);
      for (let j = 0; j <= radial; j++) {
        const k = i * (radial + 1) + j;
        const v = new THREE.Vector3().fromBufferAttribute(P, k).sub(c).multiplyScalar(r).add(c);
        P.setXYZ(k, v.x, v.y, v.z);
      }
    }
    g.computeVertexNormals();
    return g;
  }, [pts, r0, r1]);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.25} />
    </mesh>
  );
};

/** A flame-shaped plate (crest, tail plume): a flattened cone. */
const Flame: React.FC<{p: V3; rot: V3; s: number; color?: string}> = ({p, rot, s, color = GOLD}) => (
  <mesh position={p} rotation={rot} scale={[s * 0.35, s, s * 0.09]} castShadow>
    <coneGeometry args={[0.5, 1, 6]} />
    <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
  </mesh>
);

/** The naga head, looking along +z; `jaw` 0..1. */
const NagaHead: React.FC<{jaw: number}> = ({jaw}) => (
  <group>
    {/* skull and upper jaw */}
    <mesh position={[0, 0.08, 0.25]} scale={[0.42, 0.3, 0.8]} castShadow>
      <sphereGeometry args={[0.5, 14, 10]} />
      <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.3} />
    </mesh>
    <mesh position={[0, 0.02, 0.62]} rotation-x={-0.12} scale={[0.3, 0.14, 0.5]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.3} />
    </mesh>
    {/* the snout curls up at the tip */}
    <Flame p={[0, 0.16, 0.9]} rot={[-0.5, 0, 0]} s={0.32} />
    {/* lower jaw, hinged at the back of the mouth */}
    <group position={[0, -0.06, 0.2]} rotation-x={0.15 + jaw * 0.55}>
      <mesh position={[0, -0.04, 0.32]} scale={[0.26, 0.09, 0.62]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0.3]} scale={[0.2, 0.03, 0.55]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={RED} roughness={0.8} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.1, 0.1, 0.55]} rotation={[0.3, 0, 0]} scale={[0.04, 0.16, 0.04]}>
          <coneGeometry args={[1, 1, 6]} />
          <meshStandardMaterial color="#f6efe0" roughness={0.5} />
        </mesh>
      ))}
    </group>
    {/* red mouth and the curled fangs of the upper jaw */}
    <mesh position={[0, -0.05, 0.55]} scale={[0.22, 0.04, 0.5]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={RED} roughness={0.8} />
    </mesh>
    {[-1, 1].map((s) => (
      <group key={s}>
        <mesh position={[s * 0.12, -0.16, 0.72]} rotation={[-0.5, 0, s * 0.3]} scale={[0.05, 0.24, 0.05]}>
          <coneGeometry args={[1, 1, 6]} />
          <meshStandardMaterial color="#f6efe0" roughness={0.5} />
        </mesh>
        {/* red eyes, self-lit so they read */}
        <mesh position={[s * 0.17, 0.2, 0.42]} scale={0.075}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshBasicMaterial color="#ff2a12" toneMapped={false} />
        </mesh>
        {/* brow ridge */}
        <mesh position={[s * 0.15, 0.27, 0.4]} rotation={[0.3, 0, s * 0.4]} scale={[0.1, 0.05, 0.22]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={GOLD_DARK} roughness={0.5} metalness={0.3} />
        </mesh>
        {/* whisker flames swept back from the cheeks */}
        <Flame p={[s * 0.24, 0.0, 0.05]} rot={[-1.9, 0, s * 0.6]} s={0.5} color={RED} />
      </group>
    ))}
    {/* crest of flames down the back of the head */}
    {[0, 1, 2, 3].map((i) => (
      <Flame key={i} p={[0, 0.38 - i * 0.04, 0.3 - i * 0.22]} rot={[-0.9 - i * 0.12, 0, 0]} s={0.55 - i * 0.07} color={i % 2 ? RED : GOLD} />
    ))}
  </group>
);

const PaddleMan: React.FC<{side: number; p: number; shirt: string; band: string}> = ({side, p, shirt, band}) => {
  // p in 0..1: drive 0..0.45 (blade in the water, sweeping aft), recovery above the water
  const drive = p < 0.45;
  const k = drive ? smooth(p / 0.45) : smooth((p - 0.45) / 0.55);
  const pitch = drive ? -0.85 + 1.5 * k : 0.65 - 1.5 * k; // negative = blade forward
  const roll = side * (drive ? 0.62 : 0.62 + 0.45 * Math.sin(Math.PI * k));
  const lean = drive ? 0.42 * (1 - k) : 0.42 * k;
  return (
    <group>
      <group rotation-x={lean}>
        <mesh position={[0, 0.24, 0]} scale={[0.3, 0.42, 0.2]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={shirt} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.56, 0.02]} scale={0.12} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.6, 0.02]} scale={[0.13, 0.035, 0.13]}>
          <cylinderGeometry args={[1, 1, 1, 10]} />
          <meshStandardMaterial color={band} roughness={0.9} />
        </mesh>
      </group>
      {/* the paddle, held at the shoulder on the outboard side */}
      <group position={[side * 0.17, 0.36, 0.06]} rotation-z={roll}>
        <group rotation-x={pitch}>
          {/* both arms reaching down the shaft */}
          <mesh position={[-side * 0.08, -0.16, 0.02]} rotation-z={side * 0.35} scale={[0.045, 0.34, 0.045]} castShadow>
            <cylinderGeometry args={[1, 1, 1, 6]} />
            <meshStandardMaterial color={SKIN} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.5, 0]} scale={[0.028, 1.1, 0.028]} castShadow>
            <cylinderGeometry args={[1, 1, 1, 6]} />
            <meshStandardMaterial color="#d2a868" roughness={0.8} />
          </mesh>
          <mesh position={[0, -1.12, 0]} scale={[0.17, 0.36, 0.03]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#e8c27e" roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const Splash: React.FC<{p: number; x: number; z: number; s?: number}> = ({p, x, z, s = 1}) => {
  // a burst at the catch, fading through the drive
  const k = p < 0.5 ? p / 0.5 : 1;
  if (k >= 1) return null;
  return (
    <mesh position={[x, 0.06 + k * 0.12, z]} scale={[s * (0.15 + k * 0.3), s * (0.12 + k * 0.1), s * (0.15 + k * 0.4)]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.75 * (1 - k)} depthWrite={false} />
    </mesh>
  );
};

/**
 * One boat. `t` seconds; `rate` strokes a second; `pairs` paddlers a side (Nan's big class
 * carries 41-58). Length and beam are in the boat's own units (call it with a scale).
 */
export const NanBoat: React.FC<{t: number; rate?: number; pairs?: number; shirt?: string; band?: string; L?: number; jaw?: number}> = ({
  t,
  rate = 1.35,
  pairs = 22,
  shirt = '#f1c232',
  band = RED,
  L = 16,
  jaw = 0.75,
}) => {
  const B = 1.25;
  const hull = useMemo(() => hullGeometry(L, B), [L]);
  const p = (t * rate) % 1;
  // the boat surges on each stroke and pitches a little
  const surge = Math.sin(2 * Math.PI * p) * 0.04;
  const z0 = -L / 2 + 2.0;
  const z1 = L / 2 - 2.6;
  const bowY = 1.22;
  return (
    <group position={[0, 0, surge]} rotation-x={Math.sin(2 * Math.PI * p + 1) * 0.006}>
      <mesh geometry={hull} castShadow receiveShadow>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* the naga's neck rising from the bow, the head looking ahead */}
      <Tapered
        pts={[
          [0, 0.2, L / 2 - 0.9],
          [0, 0.9, L / 2 - 0.1],
          [0, 1.9, L / 2 + 0.15],
          [0, 2.7, L / 2 + 0.05],
          [0, 3.2, L / 2 + 0.4],
        ]}
        r0={0.32}
        r1={0.2}
        color={GOLD}
      />
      {/* scales: red bands round the neck */}
      {[0.9, 1.5, 2.1, 2.6].map((y, i) => (
        <mesh key={i} position={[0, y, L / 2 + (y < 1.6 ? -0.05 : 0.12)]} rotation-x={0.25} scale={[0.29 - i * 0.02, 0.06, 0.29 - i * 0.02]}>
          <cylinderGeometry args={[1, 1, 1, 12]} />
          <meshStandardMaterial color={RED} roughness={0.6} />
        </mesh>
      ))}
      <group position={[0, 3.25, L / 2 + 0.45]} rotation-x={0.1 + Math.sin(t * 1.2) * 0.04} scale={1.25}>
        <NagaHead jaw={jaw} />
      </group>
      {/* the tail sweeping up at the stern, ending in a plume */}
      <Tapered
        pts={[
          [0, 0.4, -L / 2 + 0.8],
          [0, 0.9, -L / 2 - 0.1],
          [0, 1.7, -L / 2 - 0.5],
          [0, 2.3, -L / 2 - 0.35],
        ]}
        r0={0.22}
        r1={0.08}
        color={GOLD}
      />
      {[-0.5, 0, 0.5].map((a, i) => (
        <Flame key={i} p={[0, 2.55, -L / 2 - 0.35]} rot={[0.5 + a * 0.4, 0, a]} s={0.75} color={i === 1 ? RED : GOLD} />
      ))}
      {/* the paddlers, two files, in time */}
      {Array.from({length: pairs}, (_, i) => {
        const z = z0 + ((z1 - z0) * i) / Math.max(1, pairs - 1);
        const pi = (p + i * 0.004) % 1;
        return [-1, 1].map((s) => (
          <group key={`${i}${s}`} position={[s * 0.33, bowY - 0.95, z]}>
            <PaddleMan side={s} p={pi} shirt={shirt} band={band} />
          </group>
        ));
      })}
      {Array.from({length: pairs}, (_, i) => {
        const z = z0 + ((z1 - z0) * i) / Math.max(1, pairs - 1);
        const pi = (p + i * 0.004) % 1;
        return [-1, 1].map((s) => <Splash key={`s${i}${s}`} p={pi} x={s * 1.05} z={z + 0.5} />);
      })}
      {/* the stroke caller standing amidships, arm beating time */}
      <group position={[0, 0.3, 0.2]}>
        <mesh position={[0, 0.5, 0]} scale={[0.3, 0.7, 0.2]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={band} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.0, 0]} scale={0.13} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.85 + 0.25 * Math.max(0, Math.sin(2 * Math.PI * p)), 0]} rotation-z={-0.3} scale={[0.06, 0.45, 0.06]} castShadow>
          <cylinderGeometry args={[1, 1, 1, 6]} />
          <meshStandardMaterial color={SKIN} roughness={0.9} />
        </mesh>
      </group>
      {/* the steersman at the stern with the long oar */}
      <group position={[0, 0.35, -L / 2 + 1.1]}>
        <mesh position={[0, 0.45, 0]} scale={[0.3, 0.65, 0.2]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={band} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.92, 0]} scale={0.13} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={SKIN} roughness={0.9} />
        </mesh>
        <mesh position={[0.35, 0.1, -0.6]} rotation={[0.9, 0, -0.25]} scale={[0.03, 2.0, 0.03]} castShadow>
          <cylinderGeometry args={[1, 1, 1, 6]} />
          <meshStandardMaterial color="#6b4a2a" roughness={0.9} />
        </mesh>
      </group>
      {/* bow wave and the wake */}
      <mesh position={[0, 0.03, L / 2 - 0.6]} scale={[0.9, 0.08, 0.9]}>
        <sphereGeometry args={[1, 12, 6]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} depthWrite={false} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.6, 0.025, -L * 0.15]} rotation={[-Math.PI / 2, 0, s * 0.09]}>
          <planeGeometry args={[0.35, L * 1.1]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};
