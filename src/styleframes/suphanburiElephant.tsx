// The war elephants of the ยุทธหัตถี (docs/briefs/suphanburi.md §4 A): SurinElephant dressed for war,
// with a caparison (ผ้าปกหลัง) in the side's colour, a gilt net on the forehead, gilt tusk rings, and
// the rider on the neck holding the ของ้าว (glaive). The riders are small and have no faces (a royal
// figure: research §5.3); nobody is struck and nobody falls. Moves to src/cities/suphanburi/ with the
// city.
import React from 'react';
import {NECK, SurinElephant} from '../cities/surin/figures';

const GILT = '#d9a43a';
export const SIDES = {
  // เจ้าพระยาไชยานุภาพ: crimson and gold
  siam: {cloth: '#a8231c', trim: GILT, rider: '#c0392b'},
  // พลายพัทธกอ: dark green and gold
  hongsa: {cloth: '#1f5a3e', trim: '#c9a54a', rider: '#2d6b4a'},
};
type Side = (typeof SIDES)['siam'];

const gilt = <meshStandardMaterial color={GILT} metalness={0.55} roughness={0.35} />;

/** The rider astride the neck: a gilt war crown, the side's colour, the glaive raised (`swing`
 *  0 = upright, 1 = levelled forward). In the elephant's own frame (faces +z). */
const Rider: React.FC<{side: Side; swing: number}> = ({side, swing}) => (
  <group position={NECK}>
    <mesh position={[0, 0.32, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.2, 0.55, 8]} />
      <meshStandardMaterial color={side.rider} flatShading />
    </mesh>
    {/* the crown (ชฎา/มาลา): a tall gilt cone, no face modelled */}
    <mesh position={[0, 0.72, 0]} castShadow>
      <sphereGeometry args={[0.14, 10, 8]} />
      {gilt}
    </mesh>
    <mesh position={[0, 0.98, 0]} castShadow>
      <coneGeometry args={[0.1, 0.42, 8]} />
      {gilt}
    </mesh>
    {/* the glaive: a long shaft with a curved gilt blade, pivoting at the shoulder */}
    <group position={[0.2, 0.5, 0.05]} rotation-x={0.25 + swing * 1.05}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 2.8, 6]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
      <mesh position={[0, 2.85, 0.06]} rotation-x={0.25} castShadow>
        <boxGeometry args={[0.06, 0.55, 0.16]} />
        {gilt}
      </mesh>
    </group>
  </group>
);

/** A war elephant facing +z. `walk` is the gait phase, `stride` 0..1. */
export const WarElephant: React.FC<{walk: number; stride: number; t: number; side: Side; swing: number; trunk?: number}> = ({walk, stride, t, side, swing, trunk = -0.6}) => (
  <group>
    <SurinElephant walk={walk} stride={stride} trunk={trunk} t={t} ears={0.25} />
    {/* the caparison over the back, hanging to the knees, a gilt hem */}
    <mesh position={[0, 1.95, 0.05]} scale={[0.92, 0.42, 1.0]} castShadow>
      <sphereGeometry args={[1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={side.cloth} roughness={0.8} side={2} />
    </mesh>
    {[-1, 1].map((s) => (
      <group key={s}>
        <mesh position={[s * 0.88, 1.45, 0.05]} castShadow>
          <boxGeometry args={[0.04, 0.95, 1.7]} />
          <meshStandardMaterial color={side.cloth} roughness={0.8} />
        </mesh>
        <mesh position={[s * 0.9, 0.98, 0.05]}>
          <boxGeometry args={[0.05, 0.1, 1.72]} />
          <meshStandardMaterial color={side.trim} metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    ))}
    {/* the gilt net on the forehead and the tusk rings */}
    <mesh position={[0, 2.25, 1.62]} rotation-x={-0.35} scale={[0.55, 0.5, 0.12]}>
      <sphereGeometry args={[1, 12, 8]} />
      {gilt}
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={`r${s}`} position={[s * 0.2, 1.5, 1.95]} rotation-x={1.1}>
        <torusGeometry args={[0.085, 0.03, 6, 12]} />
        {gilt}
      </mesh>
    ))}
    {/* a pennant on a staff behind the rider */}
    <group position={[0, 2.5, -0.2]}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.8, 5]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
      <mesh position={[0, 1.55, -0.32 - 0.05 * Math.sin(t * 9)]} rotation-y={0.25 * Math.sin(t * 7)}>
        <boxGeometry args={[0.02, 0.45, 0.65]} />
        <meshStandardMaterial color={side.trim} metalness={0.3} roughness={0.5} side={2} />
      </mesh>
    </group>
    <Rider side={side} swing={swing} />
  </group>
);

/** A soft dust puff (grows and fades over `u` 0..1). */
export const Dust: React.FC<{u: number; r: number}> = ({u, r}) =>
  u > 0 && u < 1 ? (
    <mesh position={[0, r * (0.4 + 0.8 * u), 0]} scale={r * (0.5 + 1.3 * u)}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#cdb489" roughness={1} transparent opacity={0.55 * (1 - u)} depthWrite={false} />
    </mesh>
  ) : null;

/** The golden flash where the glaives meet (u 0..1 over ~0.8 s): a disc and a ring, self-lit. */
export const Flash: React.FC<{u: number; r: number}> = ({u, r}) =>
  u > 0 && u < 1 ? (
    <group>
      <mesh scale={r * (0.4 + 1.6 * u)}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial color="#fff1c4" toneMapped={false} transparent opacity={0.85 * (1 - u) ** 1.5} depthWrite={false} />
      </mesh>
      <mesh rotation-y={Math.PI / 2} scale={r * (0.6 + 3.2 * u)}>
        <ringGeometry args={[0.9, 1, 40]} />
        <meshBasicMaterial color="#ffd36a" toneMapped={false} transparent opacity={0.8 * (1 - u)} depthWrite={false} side={2} />
      </mesh>
    </group>
  ) : null;
