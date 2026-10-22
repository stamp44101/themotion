// พญานาค of Ubon's candles, alive: one smooth tapered body (not a string of beads), gold on the
// back and pale on the belly, scale bands, a serrated fin along the spine, and an Isan-style head
// with a flame crest, open jaws, fangs and whiskers. Drawn along whatever path the caller gives
// (head first). Real candles carry nagas in gilt wax; this one is that wax come to life.
import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';

export type V3 = [number, number, number];

const BACK = new THREE.Color('#e3a33a');
const BELLY = new THREE.Color('#f6e2a6');
const BAND = new THREE.Color('#a8661c');
const UP = new THREE.Vector3(0, 1, 0);

type Frame = {p: THREE.Vector3; t: THREE.Vector3; n: THREE.Vector3; b: THREE.Vector3};
// a frame at every point: tangent along the body, `n` toward the back (world up as far as the
// body allows), `b` to the side
const frames = (pts: V3[]): Frame[] => {
  const P = pts.map((p) => new THREE.Vector3(...p));
  let prevN = new THREE.Vector3(0, 1, 0);
  return P.map((p, i) => {
    const a = P[Math.max(0, i - 1)];
    const c = P[Math.min(P.length - 1, i + 1)];
    const t = new THREE.Vector3().subVectors(a, c);
    if (t.lengthSq() < 1e-8) t.set(1, 0, 0);
    t.normalize();
    let n = UP.clone().sub(t.clone().multiplyScalar(UP.dot(t)));
    if (n.lengthSq() < 0.05) n = prevN.clone().sub(t.clone().multiplyScalar(prevN.dot(t)));
    n.normalize();
    prevN = n;
    const b = new THREE.Vector3().crossVectors(t, n).normalize();
    return {p, t, n, b};
  });
};

/** A tube whose radius tapers along the body, with vertex colours for back, belly and bands. */
const bodyGeometry = (F: Frame[], radius: (u: number) => number, radial = 18) => {
  const n = F.length;
  const pos = new Float32Array(n * (radial + 1) * 3);
  const col = new Float32Array(n * (radial + 1) * 3);
  const idx: number[] = [];
  let arc = 0;
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    if (i > 0) arc += F[i].p.distanceTo(F[i - 1].p);
    const u = i / (n - 1);
    const r = radius(u);
    // scale bands every 0.55 units, a little sharper on the back
    const band = (arc / 0.55) % 1;
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      // flatten the belly a little, like a real snake
      const rr = r * (ca < 0 ? 0.86 + 0.14 * (1 + ca) : 1);
      const k = (i * (radial + 1) + j) * 3;
      pos[k] = F[i].p.x + (F[i].n.x * ca + F[i].b.x * sa) * rr;
      pos[k + 1] = F[i].p.y + (F[i].n.y * ca + F[i].b.y * sa) * rr;
      pos[k + 2] = F[i].p.z + (F[i].n.z * ca + F[i].b.z * sa) * rr;
      const belly = THREE.MathUtils.smoothstep(-ca, -0.15, 0.35);
      c.copy(BACK).lerp(BELLY, belly);
      if (band < 0.16 && belly < 0.6) c.lerp(BAND, 0.55 * (1 - belly));
      col[k] = c.r;
      col[k + 1] = c.g;
      col[k + 2] = c.b;
    }
  }
  for (let i = 0; i < n - 1; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

const GOLD = {color: '#e8ab3c', metalness: 0.45, roughness: 0.35} as const;
const DARK_GOLD = {color: '#b8721f', metalness: 0.4, roughness: 0.4} as const;

// the head, modelled pointing +z with its crown up (+y), unit = body radius at the neck
const Head: React.FC<{jaw: number; night: number}> = ({jaw, night}) => (
  <group>
    {/* skull and snout */}
    <mesh position={[0, 0.15, 0.7]} scale={[0.95, 0.72, 1.35]} castShadow>
      <sphereGeometry args={[1, 20, 14]} />
      <meshStandardMaterial {...GOLD} />
    </mesh>
    <mesh position={[0, 0.1, 1.85]} scale={[0.62, 0.42, 0.9]} castShadow>
      <sphereGeometry args={[1, 16, 12]} />
      <meshStandardMaterial {...GOLD} />
    </mesh>
    {/* the curled snout tip of Isan nagas */}
    <mesh position={[0, 0.42, 2.6]} rotation-x={-0.9} castShadow>
      <torusGeometry args={[0.22, 0.09, 8, 14, Math.PI * 1.3]} />
      <meshStandardMaterial {...DARK_GOLD} />
    </mesh>
    {/* lower jaw, opening and closing */}
    <group position={[0, -0.25, 0.6]} rotation-x={0.12 + jaw * 0.45}>
      <mesh position={[0, -0.1, 1.0]} scale={[0.55, 0.22, 1.05]} castShadow>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color="#f3d796" metalness={0.3} roughness={0.45} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.3, 0.08, 1.7]} rotation-x={Math.PI}>
          <coneGeometry args={[0.06, 0.3, 6]} />
          <meshStandardMaterial color="#fffaf0" />
        </mesh>
      ))}
    </group>
    {/* fangs from the upper jaw */}
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.32, -0.32, 2.0]} rotation-x={Math.PI}>
        <coneGeometry args={[0.07, 0.42, 6]} />
        <meshStandardMaterial color="#fffaf0" />
      </mesh>
    ))}
    {/* eyes, brows */}
    {[-1, 1].map((s) => (
      <group key={s}>
        <mesh position={[s * 0.62, 0.48, 1.25]}>
          <sphereGeometry args={[0.17, 12, 10]} />
          <meshBasicMaterial color="#e2361f" toneMapped={false} />
        </mesh>
        <mesh position={[s * 0.66, 0.66, 1.2]} rotation-z={s * 0.5} rotation-y={s * 0.3}>
          <boxGeometry args={[0.5, 0.1, 0.32]} />
          <meshStandardMaterial {...DARK_GOLD} />
        </mesh>
      </group>
    ))}
    {/* the flame crest (หงอน): three tall curling flames sweeping back from the crown */}
    {[-1, 0, 1].map((k) => (
      <group key={k} position={[k * 0.38, 0.75, 0.55 - Math.abs(k) * 0.2]} rotation-x={-0.55} rotation-z={-k * 0.3}>
        <mesh position={[0, 0.9 - Math.abs(k) * 0.25, 0]} castShadow>
          <coneGeometry args={[0.24, 1.9 - Math.abs(k) * 0.5, 8]} />
          <meshStandardMaterial {...GOLD} emissive="#ffb347" emissiveIntensity={0.15 + night * 0.6} />
        </mesh>
        <mesh position={[0, 1.85 - Math.abs(k) * 0.5, -0.25]} rotation-x={-0.9}>
          <coneGeometry args={[0.1, 0.6, 6]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
      </group>
    ))}
    {/* the mane: a ruff of small flames round the back of the head */}
    {Array.from({length: 9}, (_, i) => {
      const a = -Math.PI * 0.85 + (i / 8) * Math.PI * 1.7;
      return (
        <mesh key={i} position={[Math.sin(a) * 0.95, 0.05 + Math.cos(a) * 0.75, -0.15]} rotation-z={-a} rotation-x={-0.6}>
          <coneGeometry args={[0.16, 0.75, 6]} />
          <meshStandardMaterial {...DARK_GOLD} />
        </mesh>
      );
    })}
    {/* whiskers trailing back from the snout */}
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.75, -0.05, 1.4]} rotation-z={s * 1.2} rotation-x={0.9}>
        <cylinderGeometry args={[0.035, 0.015, 1.5, 5]} />
        <meshStandardMaterial {...DARK_GOLD} />
      </mesh>
    ))}
  </group>
);

/**
 * The naga along `pts` (head first). `r` is the body radius at the neck; the tail tapers to
 * a point. `jaw` 0..1 opens the mouth.
 */
export const Naga: React.FC<{pts: V3[]; r: number; jaw?: number; night?: number; fins?: boolean}> = ({pts, r, jaw = 0.3, night = 0, fins = true}) => {
  const F = useMemo(() => frames(pts), [pts]);
  const radius = (u: number) => r * (u < 0.04 ? 0.82 + u * 4.5 : Math.pow(1 - u, 0.7) * 1.05 + 0.04);
  const geo = useMemo(() => bodyGeometry(F, radius), [F]);
  useEffect(() => () => geo.dispose(), [geo]);
  const h = F[0];
  const m = new THREE.Matrix4().makeBasis(h.b.clone().negate(), h.n, h.t);
  const q = new THREE.Quaternion().setFromRotationMatrix(m);
  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors metalness={0.35} roughness={0.42} emissive="#5a3200" emissiveIntensity={night * 0.5} />
      </mesh>
      {/* the serrated fin along the spine, shrinking toward the tail */}
      {fins &&
        F.map((f, i) => {
          if (i < 3 || i % 3 || i > F.length * 0.9) return null;
          const u = i / (F.length - 1);
          const rr = radius(u);
          const p = f.p.clone().addScaledVector(f.n, rr * 0.95);
          const mm = new THREE.Matrix4().makeBasis(f.b.clone().negate(), f.n, f.t);
          const qq = new THREE.Quaternion().setFromRotationMatrix(mm);
          return (
            <mesh key={i} position={p} quaternion={qq} scale={[rr * 0.12, rr * 0.75, rr * 0.7]} castShadow>
              <coneGeometry args={[1, 1, 3]} />
              <meshStandardMaterial {...DARK_GOLD} />
            </mesh>
          );
        })}
      <group position={h.p} quaternion={q} scale={r * 1.15}>
        <Head jaw={jaw} night={night} />
      </group>
    </group>
  );
};
