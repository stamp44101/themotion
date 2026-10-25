// Surin's figures: an Asian elephant at hero scale (domed twin forehead, small ears, a trunk
// that curls, a walk cycle) and the Kuy elephant men (กูยอะจีง) who ride them with the
// lasso pole (ไม้คันจาม) and the sacred rawhide rope (เชือกปะกำ). The engine's `Elephant` in
// parts.tsx is a 12-mesh prop for crowds; this one is for the cover.
import React from 'react';

export const GREY = '#77706b';
export const GREY_DARK = '#5e5853';
export const WHITE_ELEPHANT = '#efe1d4';
export const WHITE_SHADE = '#dcc6b8';

/** Phase of each leg in a walk (lateral sequence: LH, LF, RH, RF). */
const LEGS: [number, number, number][] = [
  // x, z, phase
  [-0.42, -0.72, 0],
  [-0.42, 0.72, 0.25],
  [0.42, -0.72, 0.5],
  [0.42, 0.72, 0.75],
];

/** A trunk of `n` segments, each bent by `curl` (+ curls under) and swayed sideways. */
const Trunk: React.FC<{n: number; r0: number; len: number; curl: number; sway: number; color: string; i?: number}> = ({n, r0, len, curl, sway, color, i = 0}) => {
  if (i >= n) return null;
  const r = r0 * (1 - (i / n) * 0.6);
  return (
    <group rotation-x={curl * (0.4 + i / n)} rotation-z={sway * (i / n)}>
      <mesh position={[0, -len / 2, 0]} castShadow>
        <cylinderGeometry args={[r, r * 0.92, len, 7]} />
        <meshStandardMaterial color={color} flatShading roughness={0.95} />
      </mesh>
      <group position={[0, -len, 0]}>
        <Trunk n={n} r0={r0} len={len} curl={curl} sway={sway} color={color} i={i + 1} />
      </group>
    </group>
  );
};

/**
 * Asian elephant, ~3 units long nose to tail, standing on y = 0, facing +z.
 * `walk` is the gait phase in cycles (advance it ~0.6/s for a walk, ~1.4/s for a run),
 * `stride` 0 = standing, 1 = full step; `trunk` -1..1 lifts (-1) or curls under (1).
 */
export const SurinElephant: React.FC<{
  walk: number;
  stride?: number;
  trunk?: number;
  ears?: number;
  color?: string;
  shade?: string;
  tusks?: boolean;
  t?: number;
}> = ({walk, stride = 1, trunk = 0.3, ears = 0, color = GREY, shade = GREY_DARK, tusks = true, t = 0}) => {
  const m = <meshStandardMaterial color={color} flatShading roughness={0.95} />;
  const bob = Math.abs(Math.sin(walk * Math.PI * 2)) * 0.06 * stride;
  const sway = Math.sin(t * 1.3) * 0.25 + Math.sin(walk * Math.PI * 2) * 0.15 * stride;
  const flap = Math.sin(t * 2.2) * 0.12 + ears;
  return (
    <group>
      {LEGS.map(([x, z, ph], j) => {
        const a = Math.sin((walk + ph) * Math.PI * 2) * 0.38 * stride;
        const lift = Math.max(0, Math.cos((walk + ph) * Math.PI * 2)) * 0.12 * stride;
        return (
          <group key={j} position={[x, 1.2 + lift, z]} rotation-x={a}>
            <mesh position={[0, -0.6, 0]} castShadow>
              <cylinderGeometry args={[0.26, 0.24, 1.2, 8]} />
              {m}
            </mesh>
            <mesh position={[0, -1.17, 0.02]} castShadow>
              <cylinderGeometry args={[0.27, 0.3, 0.1, 8]} />
              <meshStandardMaterial color={shade} flatShading />
            </mesh>
          </group>
        );
      })}
      <group position={[0, bob, 0]}>
        {/* barrel and rump: an Asian elephant's back is highest in the middle */}
        <mesh position={[0, 1.62, 0.1]} scale={[0.86, 0.8, 1.22]} castShadow receiveShadow>
          <sphereGeometry args={[1, 14, 10]} />
          {m}
        </mesh>
        <mesh position={[0, 1.5, -0.75]} scale={[0.78, 0.72, 0.6]} castShadow>
          <sphereGeometry args={[1, 12, 8]} />
          {m}
        </mesh>
        {/* tail */}
        <group position={[0, 1.75, -1.25]} rotation-x={0.35 + Math.sin(t * 2.6) * 0.15} rotation-z={Math.sin(t * 1.9) * 0.3}>
          <mesh position={[0, -0.45, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.9, 5]} />
            {m}
          </mesh>
          <mesh position={[0, -0.95, 0]}>
            <coneGeometry args={[0.08, 0.2, 5]} />
            <meshStandardMaterial color="#2e2a27" />
          </mesh>
        </group>
        {/* head with the twin forehead domes */}
        <group position={[0, 1.95, 1.3]}>
          <mesh scale={[0.62, 0.66, 0.6]} castShadow>
            <sphereGeometry args={[1, 14, 10]} />
            {m}
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.2, 0.42, 0.12]} scale={0.3} castShadow>
              <sphereGeometry args={[1, 10, 8]} />
              {m}
            </mesh>
          ))}
          {/* ears: smaller than an African's, flat, flapping */}
          {[-1, 1].map((s) => (
            <group key={`e${s}`} position={[s * 0.5, 0.05, -0.1]} rotation-y={s * (0.35 + flap)}>
              <mesh position={[s * 0.22, -0.08, -0.05]} scale={[0.06, 0.5, 0.42]} castShadow>
                <sphereGeometry args={[1, 10, 8]} />
                <meshStandardMaterial color={shade} flatShading roughness={0.95} />
              </mesh>
            </group>
          ))}
          {/* eyes */}
          {[-1, 1].map((s) => (
            <mesh key={`y${s}`} position={[s * 0.4, 0.08, 0.42]} scale={0.055}>
              <sphereGeometry args={[1, 6, 6]} />
              <meshStandardMaterial color="#1c1714" />
            </mesh>
          ))}
          {/* tusks */}
          {tusks &&
            [-1, 1].map((s) => (
              <mesh key={`t${s}`} position={[s * 0.2, -0.4, 0.42]} rotation-x={1.1} rotation-z={-s * 0.15} castShadow>
                <coneGeometry args={[0.07, 0.75, 7]} />
                <meshStandardMaterial color="#f4ecd9" roughness={0.5} />
              </mesh>
            ))}
          {/* trunk: hangs from the face, curls under or lifts */}
          <group position={[0, -0.25, 0.5]} rotation-x={-0.25 - trunk * 0.8}>
            <Trunk n={8} r0={0.2} len={0.2} curl={-0.25 + Math.max(0, trunk) * 0.5 - Math.min(0, trunk) * 0.2} sway={sway} color={color} />
          </group>
        </group>
      </group>
    </group>
  );
};

const SKIN = '#9a6b47';
/** A Kuy elephant man astride the neck: white shirt, indigo trousers, red ผ้าขาวม้า on the head. */
export const KuyRider: React.FC<{pole?: boolean; swing?: number}> = ({pole = false, swing = 0}) => (
  <group>
    <mesh position={[0, 0.32, 0]} castShadow>
      <cylinderGeometry args={[0.13, 0.17, 0.5, 8]} />
      <meshStandardMaterial color="#f2eee4" flatShading />
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.2, 0.08, 0.08]} rotation-z={s * 1.1} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.42, 6]} />
        <meshStandardMaterial color="#2c3f73" flatShading />
      </mesh>
    ))}
    <mesh position={[0, 0.7, 0]} castShadow>
      <sphereGeometry args={[0.13, 10, 8]} />
      <meshStandardMaterial color={SKIN} flatShading />
    </mesh>
    <mesh position={[0, 0.78, 0]} rotation-x={Math.PI / 2}>
      <torusGeometry args={[0.12, 0.045, 6, 12]} />
      <meshStandardMaterial color="#c0302a" />
    </mesh>
    {pole && (
      // the ไม้คันจาม, held forward, its tip swinging out with the rope
      <group position={[0.15, 0.45, 0.05]} rotation-x={0.95 + swing * 0.3} rotation-z={-0.2 - swing * 0.25}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 2.8, 5]} />
          <meshStandardMaterial color="#b88a4e" />
        </mesh>
      </group>
    )}
  </group>
);

/** The rider's seat on a SurinElephant's neck, in the elephant's own frame. */
export const NECK: [number, number, number] = [0, 2.55, 0.95];
