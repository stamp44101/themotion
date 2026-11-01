// Saraburi's cover props (style frames, 1 Nov 2026; docs/briefs/saraburi.md): the wounded deer
// (เนื้อ) of the chronicle, the Footprint in its limestone slab, hunter Bun, the yellow ดอกเข้าพรรษา
// sprays and a monk for the flower-alms payoff.
import React, {useMemo} from 'react';
import * as THREE from 'three';

type V = [number, number, number];
const UP = new THREE.Vector3(0, 1, 0);

const Seg: React.FC<{a: V; b: V; r0: number; r1: number; color: string; flat?: number}> = ({a, b, r0, r1, color, flat = 1}) => {
  const {pos, quat, len} = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const d = vb.clone().sub(va);
    const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
    return {pos: va.add(vb).multiplyScalar(0.5), quat: q, len: d.length()};
  }, [a, b]);
  return (
    <group position={pos} quaternion={quat}>
      <mesh scale={[1, 1, flat]} castShadow>
        <cylinderGeometry args={[r1, r0, len, 8]} />
        <meshStandardMaterial color={color} flatShading roughness={0.85} />
      </mesh>
    </group>
  );
};
const Ball: React.FC<{p: V; s: V; color: string; basic?: boolean; opacity?: number}> = ({p, s, color, basic, opacity = 1}) => (
  <mesh position={p} scale={s} castShadow={!basic}>
    <icosahedronGeometry args={[1, 2]} />
    {basic ? (
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={opacity} depthWrite={false} />
    ) : (
      <meshStandardMaterial color={color} flatShading roughness={0.85} transparent={opacity < 1} opacity={opacity} />
    )}
  </mesh>
);

const COAT = '#a8693a';
const BELLY = '#efe4d2';
const DARK = '#2a1c14';
const ANTLER = '#d8c7a4';

/** A sambar-like deer facing +x, ~1 unit at the shoulder, hooves at y 0. `step` is the gallop
 *  phase (radians), `gait` 0 standing .. 1 full gallop, `drink` 0 head up .. 1 muzzle at the
 *  ground, `wound` 0 healed .. 1 a red wound on the flank. */
export const Deer: React.FC<{step: number; gait: number; drink: number; wound: number}> = ({step, gait, drink, wound}) => {
  const s = Math.sin(step);
  const c = Math.cos(step);
  // gallop: fore pair and hind pair each swing together, half a cycle apart
  const legs: {hip: V; len: number; sw: number}[] = [
    {hip: [0.42, 0.78, 0.13], len: 0.74, sw: s},
    {hip: [0.42, 0.78, -0.13], len: 0.74, sw: s * 0.8},
    {hip: [-0.44, 0.82, 0.13], len: 0.78, sw: -s},
    {hip: [-0.44, 0.82, -0.13], len: 0.78, sw: -s * 0.8},
  ];
  const pitch = gait * 0.12 * c; // the body rocks fore and aft in the gallop
  const neck = -drink * 1.15; // the neck pivots down at the withers
  return (
    <group rotation-z={pitch}>
      {/* barrel, chest and rump; a pale belly */}
      <Ball p={[0, 0.88, 0]} s={[0.55, 0.24, 0.21]} color={COAT} />
      <Ball p={[0.38, 0.9, 0]} s={[0.22, 0.25, 0.2]} color={COAT} />
      <Ball p={[-0.42, 0.92, 0]} s={[0.23, 0.24, 0.21]} color={COAT} />
      <Ball p={[0, 0.74, 0]} s={[0.42, 0.1, 0.16]} color={BELLY} />
      {/* the white tail flag, up when it runs */}
      <Seg a={[-0.6, 1.0, 0]} b={[-0.72, 1.0 + 0.12 * gait, 0]} r0={0.06} r1={0.07} color={BELLY} flat={0.6} />
      {/* the arrow wound on the near flank, fading as it heals */}
      {wound > 0.02 && (
        <>
          <Ball p={[-0.12, 0.92, 0.2]} s={[0.12, 0.08, 0.02]} color="#9e1b16" opacity={wound} />
          <Ball p={[-0.12, 0.92, 0.2]} s={[0.05, 0.035, 0.025]} color="#ff5a3a" basic opacity={wound * 0.8} />
        </>
      )}
      {/* neck, head and antlers on one pivot at the withers */}
      <group position={[0.42, 1.02, 0]} rotation-z={neck}>
        <Seg a={[0, 0, 0]} b={[0.26, 0.5, 0]} r0={0.15} r1={0.1} color={COAT} flat={0.75} />
        <Seg a={[0.22, 0.52, 0]} b={[0.52, 0.36, 0]} r0={0.1} r1={0.055} color={COAT} flat={0.8} />
        <Ball p={[0.54, 0.34, 0]} s={[0.06, 0.05, 0.05]} color={DARK} />
        {[-0.07, 0.07].map((z) => (
          <Ball key={z} p={[0.36, 0.52, z]} s={[0.025, 0.025, 0.02]} color={DARK} />
        ))}
        {/* ears */}
        {[-1, 1].map((k) => (
          <Seg key={k} a={[0.22, 0.58, k * 0.06]} b={[0.16, 0.68, k * 0.18]} r0={0.04} r1={0.015} color={COAT} flat={0.4} />
        ))}
        {/* antlers: a beam, a brow tine and a fork at the top */}
        {[-1, 1].map((k) => (
          <group key={k}>
            <Seg a={[0.24, 0.6, k * 0.05]} b={[0.12, 1.02, k * 0.2]} r0={0.025} r1={0.015} color={ANTLER} />
            <Seg a={[0.21, 0.68, k * 0.08]} b={[0.4, 0.82, k * 0.12]} r0={0.018} r1={0.008} color={ANTLER} />
            <Seg a={[0.12, 1.02, k * 0.2]} b={[0.22, 1.18, k * 0.24]} r0={0.014} r1={0.006} color={ANTLER} />
            <Seg a={[0.12, 1.02, k * 0.2]} b={[-0.02, 1.16, k * 0.26]} r0={0.014} r1={0.006} color={ANTLER} />
          </group>
        ))}
      </group>
      {/* legs: thigh, slender shank, dark hoof; swing about the hip */}
      {legs.map((l, i) => (
        <group key={i} position={l.hip} rotation-z={l.sw * 0.55 * gait}>
          <Seg a={[0, 0, 0]} b={[0, -l.len * 0.45, 0]} r0={0.07} r1={0.04} color={COAT} />
          <Seg a={[0, -l.len * 0.45, 0]} b={[0, -l.len + 0.06, 0]} r0={0.03} r1={0.025} color={COAT} />
          <Seg a={[0, -l.len + 0.06, 0]} b={[0, -l.len, 0]} r0={0.03} r1={0.035} color={DARK} />
        </group>
      ))}
    </group>
  );
};

/** The Footprint: a pale limestone slab with the long print sunk in it, five even toes at the
 *  front (+x), filled with water. `glow` 0..1 lights the water gold and draws the wheel. Length
 *  1 along x, top of the slab at y 0.12 (the rock's crown is cut by the print). */
export const Footprint: React.FC<{glow: number}> = ({glow}) => {
  const sole = useMemo(() => {
    const sh = new THREE.Shape();
    const w = 0.17;
    const l0 = -0.42;
    const l1 = 0.3;
    sh.moveTo(l0, -w * 0.85);
    sh.lineTo(l1, -w);
    sh.quadraticCurveTo(l1 + 0.06, 0, l1, w);
    sh.lineTo(l0, w * 0.85);
    sh.quadraticCurveTo(l0 - 0.07, 0, l0, -w * 0.85);
    return new THREE.ShapeGeometry(sh, 12);
  }, []);
  const water = new THREE.Color('#3f86b5').lerp(new THREE.Color('#ffb21f'), glow);
  return (
    <group>
      {/* the slab: a low, rough, pale grey rock */}
      <mesh position={[0, 0.0, 0]} scale={[0.7, 0.12, 0.4]} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#cfcac0" flatShading roughness={1} />
      </mesh>
      <group position={[0, 0.125, 0]} rotation-x={-Math.PI / 2}>
        <mesh geometry={sole}>
          <meshBasicMaterial color={water} toneMapped={false} />
        </mesh>
        {[-0.14, -0.07, 0, 0.07, 0.14].map((z, i) => (
          <mesh key={i} position={[0.39, z, 0]}>
            <circleGeometry args={[0.032, 14]} />
            <meshBasicMaterial color={water} toneMapped={false} />
          </mesh>
        ))}
        {/* the wheel at the sole's centre, drawn in gold as the water lights */}
        {glow > 0.02 && (
          <group position={[-0.05, 0, 0.002]}>
            <mesh>
              <ringGeometry args={[0.09, 0.105, 32]} />
              <meshBasicMaterial color="#fff2c4" toneMapped={false} transparent opacity={glow} />
            </mesh>
            {Array.from({length: 8}, (_, i) => (
              <mesh key={i} rotation-z={(i * Math.PI) / 8}>
                <planeGeometry args={[0.19, 0.01]} />
                <meshBasicMaterial color="#fff2c4" toneMapped={false} transparent opacity={glow} />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </group>
  );
};

/** Gold rings running out over the slab and the ground when the deer drinks. */
export const LightRings: React.FC<{t: number; t0: number; r: number}> = ({t, t0, r}) => (
  <>
    {[0, 0.45, 0.9].map((d, i) => {
      const u = (t - t0 - d) / 1.6;
      if (u <= 0 || u >= 1) return null;
      return (
        <mesh key={i} position={[0, 0.2, 0]} rotation-x={-Math.PI / 2} scale={r * (0.3 + 2.4 * u)}>
          <ringGeometry args={[0.9, 1, 56]} />
          <meshBasicMaterial color="#ffd36a" toneMapped={false} transparent opacity={0.65 * (1 - u)} depthWrite={false} />
        </mesh>
      );
    })}
  </>
);

const SKIN = '#b57d52';
const INDIGO = '#2f3d63';
const UNDYED = '#d9cdb5';

/** Hunter Bun facing +x, ~1 tall: indigo shirt, undyed pha khao ma, a bow in the left hand.
 *  `run` 0..1 the stride, `kneel` 0 standing .. 1 kneeling with palms together. */
export const Hunter: React.FC<{step: number; run: number; kneel: number}> = ({step, run, kneel}) => {
  const s = Math.sin(step) * run;
  const drop = kneel * 0.32;
  return (
    <group>
      <group position={[0, -drop, 0]} rotation-z={-0.18 * run + 0.25 * kneel}>
        <mesh position={[0, 0.66, 0]} scale={[0.16, 0.2, 0.13]} castShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={INDIGO} flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.48, 0]} scale={[0.14, 0.08, 0.12]} castShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={UNDYED} flatShading roughness={0.9} />
        </mesh>
        <mesh position={[0.02, 0.93, 0]} castShadow>
          <sphereGeometry args={[0.085, 12, 10]} />
          <meshStandardMaterial color={SKIN} roughness={0.9} />
        </mesh>
        {/* arms: swinging with the bow when running, joined in a wai when kneeling */}
        {[-1, 1].map((k) => (
          <group key={k} position={[0, 0.8, k * 0.13]} rotation-z={kneel > 0.5 ? -1.1 : k * s * 0.7} rotation-x={kneel > 0.5 ? -k * 0.5 : 0}>
            <Seg a={[0, 0, 0]} b={[0.02, -0.3, 0]} r0={0.035} r1={0.03} color={SKIN} />
          </group>
        ))}
        {kneel < 0.5 && (
          <group position={[0.05, 0.6, 0.16]} rotation-z={0.2}>
            <mesh rotation-y={Math.PI / 2}>
              <torusGeometry args={[0.22, 0.012, 4, 16, Math.PI * 0.9]} />
              <meshStandardMaterial color="#5c3b22" roughness={0.9} />
            </mesh>
          </group>
        )}
      </group>
      {/* legs */}
      {[-1, 1].map((k) => (
        <group key={k} position={[0, 0.45 - drop, k * 0.06]} rotation-z={kneel > 0.5 ? (k > 0 ? 1.5 : 0.2) : k * s * 0.6}>
          <Seg a={[0, 0, 0]} b={[0, -0.43 + (kneel > 0.5 ? 0.1 : 0), 0]} r0={0.045} r1={0.035} color={SKIN} />
        </group>
      ))}
    </group>
  );
};

/** A spray of ดอกเข้าพรรษา (Globba): an arching stem with hanging yellow bracts and small
 *  flowers. ~1 tall, arching toward +x. `open` 0 bud .. 1 full. */
export const GlobbaSpray: React.FC<{open: number; seed: number}> = ({open, seed}) => {
  const n = 7;
  const k = Math.max(0, Math.min(1, open));
  if (k < 0.02) return null;
  return (
    <group scale={[1, 0.4 + 0.6 * k, 1]}>
      {/* the stem: three segments arching over */}
      <Seg a={[0, 0, 0]} b={[0.1, 0.55, 0]} r0={0.03} r1={0.022} color="#4f7d3a" />
      <Seg a={[0.1, 0.55, 0]} b={[0.32, 0.85, 0]} r0={0.022} r1={0.016} color="#4f7d3a" />
      <Seg a={[0.32, 0.85, 0]} b={[0.6, 0.8, 0]} r0={0.016} r1={0.01} color="#4f7d3a" />
      {/* two long leaves from the base */}
      {[-1, 1].map((z) => (
        <mesh key={z} position={[0.05, 0.3, z * 0.12]} rotation={[z * 0.5, 0, -0.5]} scale={[0.06, 0.36, 0.015]} castShadow>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#3d6b30" flatShading roughness={0.9} />
        </mesh>
      ))}
      {/* the hanging raceme: bracts along the arch, opening outward */}
      {Array.from({length: n}, (_, i) => {
        const u = i / (n - 1);
        const x = 0.32 + u * 0.32;
        const y = 0.86 - u * 0.1 - 0.12;
        const z = Math.sin(seed * 3.1 + i * 1.7) * 0.06;
        const size = (0.07 - u * 0.025) * k;
        return (
          <group key={i} position={[x, y, z]}>
            <Seg a={[0, 0.1, 0]} b={[0, 0, 0]} r0={0.006} r1={0.006} color="#6d8a3b" />
            <Ball p={[0, -0.02, 0]} s={[size, size * 1.4, size]} color="#f2c21b" basic={false} />
            <Ball p={[0, -0.02 - size * 1.4, 0]} s={[size * 0.4, size * 0.4, size * 0.4]} color="#ffe46b" basic opacity={0.9} />
          </group>
        );
      })}
    </group>
  );
};

/** A monk in saffron, ~1 tall, walking (+x) with the alms bowl. */
export const Monk: React.FC<{step: number}> = ({step}) => {
  const s = Math.sin(step);
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.55, 4, 10]} />
        <meshStandardMaterial color="#d97a1e" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.98, 0]} castShadow>
        <sphereGeometry args={[0.09, 12, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.9} />
      </mesh>
      <mesh position={[0.13, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.07, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} />
      </mesh>
      {[-1, 1].map((k) => (
        <group key={k} position={[0, 0.25, k * 0.06]} rotation-z={k * s * 0.4}>
          <Seg a={[0, 0, 0]} b={[0, -0.25, 0]} r0={0.035} r1={0.03} color={SKIN} />
        </group>
      ))}
    </group>
  );
};
