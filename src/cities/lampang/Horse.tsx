import React, {useMemo} from 'react';
import * as THREE from 'three';

// A chestnut carriage horse facing +x, ~2 units nose to tail, hooves at y = 0.
// Built from segments between named joints so the neck runs into the chest and the head
// into the neck with no gap: the first two attempts read as a llama, then as headless,
// because a thin white neck and head vanished against the sky and the body. Chestnut with
// a dark mane, a white blaze and a dark muzzle keeps the head readable from every side.
type V = [number, number, number];
const UP = new THREE.Vector3(0, 1, 0);

/** a tapered limb from a to b: radius r0 at a, r1 at b, squashed sideways by `flat` */
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
const Ball: React.FC<{p: V; s: V; color: string}> = ({p, s, color}) => (
  <mesh position={p} scale={s} castShadow>
    <icosahedronGeometry args={[1, 2]} />
    <meshStandardMaterial color={color} flatShading roughness={0.85} />
  </mesh>
);

const COAT = '#b5703c';
const DARK = '#2b1d16';
const WHITE = '#f2ece2';

// joints (x forward, y up)
const WITHERS: V = [0.48, 1.18, 0];
const POLL: V = [0.92, 1.72, 0];
const MUZZLE: V = [1.22, 1.38, 0];

export const Horse: React.FC<{step: number}> = ({step}) => {
  const legs: {hip: V; knee: V; foot: V; phase: number}[] = [
    {hip: [0.5, 0.86, 0.15], knee: [0.52, 0.42, 0.15], foot: [0.5, 0.06, 0.15], phase: 1},
    {hip: [0.5, 0.86, -0.15], knee: [0.52, 0.42, -0.15], foot: [0.5, 0.06, -0.15], phase: -1},
    {hip: [-0.5, 0.9, 0.15], knee: [-0.58, 0.45, 0.15], foot: [-0.52, 0.06, 0.15], phase: -1},
    {hip: [-0.5, 0.9, -0.15], knee: [-0.58, 0.45, -0.15], foot: [-0.52, 0.06, -0.15], phase: 1},
  ];
  return (
    <group>
      {/* barrel, chest and rump */}
      <Ball p={[0, 1.0, 0]} s={[0.62, 0.3, 0.26]} color={COAT} />
      <Ball p={[0.46, 1.02, 0]} s={[0.26, 0.3, 0.25]} color={COAT} />
      <Ball p={[-0.48, 1.04, 0]} s={[0.28, 0.3, 0.26]} color={COAT} />
      {/* neck: thick at the chest, into the head at the poll */}
      <Seg a={[0.42, 1.0, 0]} b={WITHERS} r0={0.2} r1={0.19} color={COAT} flat={0.75} />
      <Seg a={WITHERS} b={POLL} r0={0.19} r1={0.11} color={COAT} flat={0.7} />
      {/* head: a long wedge, nose-down, with a white blaze and a dark muzzle */}
      <Seg a={[0.88, 1.76, 0]} b={MUZZLE} r0={0.12} r1={0.075} color={COAT} flat={0.75} />
      <Seg a={[0.97, 1.66, 0.0]} b={[1.17, 1.42, 0]} r0={0.04} r1={0.03} color={WHITE} flat={2.6} />
      <Ball p={[1.23, 1.36, 0]} s={[0.085, 0.07, 0.07]} color={DARK} />
      {[-0.075, 0.075].map((z) => (
        <Ball key={z} p={[0.98, 1.64, z]} s={[0.025, 0.025, 0.02]} color={DARK} />
      ))}
      {[-0.05, 0.05].map((z) => (
        <Seg key={z} a={[0.88, 1.78, z]} b={[0.9, 1.92, z * 1.4]} r0={0.035} r1={0.005} color={COAT} />
      ))}
      {/* mane along the crest and a forelock, tail from the rump */}
      <Seg a={[0.42, 1.24, 0]} b={[0.86, 1.82, 0]} r0={0.05} r1={0.04} color={DARK} flat={0.6} />
      <Seg a={[-0.74, 1.12, 0]} b={[-0.9, 0.62, 0]} r0={0.06} r1={0.03} color={DARK} />
      {/* legs: upper, lower, hoof; swing about the hip */}
      {legs.map((l, i) => (
        <group key={i} position={l.hip} rotation-z={step * 0.3 * l.phase}>
          <group position={[-l.hip[0], -l.hip[1], -l.hip[2]]}>
            <Seg a={l.hip} b={l.knee} r0={0.08} r1={0.05} color={COAT} />
            <Seg a={l.knee} b={l.foot} r0={0.045} r1={0.04} color={i < 2 ? COAT : COAT} />
            <Seg a={[l.foot[0], 0.14, l.foot[2]]} b={[l.foot[0], 0.0, l.foot[2]]} r0={0.05} r1={0.06} color={DARK} />
          </group>
        </group>
      ))}
    </group>
  );
};
