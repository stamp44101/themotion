// พระพุทธมหาธรรมราชา, Phetchabun's palladium (docs/briefs/phetchabun.md §4 A): a crowned Buddha in
// meditation in the Khmer Bayon style, bronze with a gilt sheen, NO pedestal (research §5.1: not a
// generic Sukhothai image): a crown band (เทริด) with a conical cover over the ushnisha, long
// earlobes to the shoulders, a necklace and armlets, hands in the lap. Height 1 at scale 1.
// And the whirlpool it rises from at วังมะขามแฟบ. Moves to src/cities/phetchabun/ with the city.
import React from 'react';

const BRONZE = '#a07a3e';
const GILT = '#d6a446';
const metal = (c: string, glow = 0) => <meshStandardMaterial color={c} metalness={0.55} roughness={0.38} emissive="#ffb648" emissiveIntensity={glow} />;

export const MahaThammaracha: React.FC<{glow?: number}> = ({glow = 0}) => {
  const B = metal(BRONZE, glow * 0.3);
  const G = metal(GILT, glow);
  const DARK = <meshStandardMaterial color="#3a2a14" roughness={0.6} />;
  return (
    <group>
      {/* crossed legs: two shins meeting in front, knees wide */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.13, 0.075, 0.07]} rotation={[0, s * 0.42, Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.075, 0.3, 4, 12]} />
            {B}
          </mesh>
          <mesh position={[s * 0.3, 0.08, 0.0]} castShadow>
            <sphereGeometry args={[0.085, 12, 10]} />
            {B}
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.07, -0.06]} scale={[0.3, 0.07, 0.17]} castShadow>
        <sphereGeometry args={[1, 16, 10]} />
        {B}
      </mesh>
      {/* torso: broad shoulders, narrow waist */}
      <mesh position={[0, 0.34, -0.02]} scale={[1, 1, 0.68]} castShadow>
        <cylinderGeometry args={[0.2, 0.14, 0.34, 20]} />
        {B}
      </mesh>
      <mesh position={[0, 0.5, -0.02]} scale={[1, 0.55, 0.68]} castShadow>
        <sphereGeometry args={[0.2, 16, 10]} />
        {B}
      </mesh>
      {/* arms: upper arm down to the elbow, forearm in to the hands in the lap */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.225, 0.4, 0.0]} rotation={[0.15, 0, s * 0.12]} castShadow>
            <capsuleGeometry args={[0.048, 0.17, 4, 10]} />
            {B}
          </mesh>
          <mesh position={[s * 0.15, 0.21, 0.09]} rotation={[0, s * -0.9, Math.PI / 2 - s * 0.0]} castShadow>
            <capsuleGeometry args={[0.042, 0.16, 4, 10]} />
            {B}
          </mesh>
          <mesh position={[s * 0.225, 0.46, 0.0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.052, 0.013, 6, 14]} />
            {G}
          </mesh>
        </group>
      ))}
      {/* hands, right over left, palms up */}
      <mesh position={[0, 0.18, 0.15]} scale={[0.14, 0.035, 0.08]} castShadow>
        <sphereGeometry args={[1, 14, 8]} />
        {B}
      </mesh>
      {/* the necklace */}
      <mesh position={[0, 0.55, 0.04]} rotation-x={1.2}>
        <torusGeometry args={[0.1, 0.018, 6, 20]} />
        {G}
      </mesh>
      {/* neck and head */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.06, 12]} />
        {B}
      </mesh>
      <mesh position={[0, 0.69, 0.01]} scale={[0.095, 0.11, 0.095]} castShadow>
        <sphereGeometry args={[1, 18, 14]} />
        {B}
      </mesh>
      {/* the face: brow line, downcast eyes, nose, lips (it faces +z) */}
      <mesh position={[0, 0.715, 0.093]} scale={[0.075, 0.008, 0.01]}>
        <boxGeometry args={[1, 1, 1]} />
        {G}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.034, 0.695, 0.097]} scale={[0.024, 0.006, 0.006]}>
          <boxGeometry args={[1, 1, 1]} />
          {DARK}
        </mesh>
      ))}
      <mesh position={[0, 0.672, 0.1]} rotation-x={-0.3}>
        <coneGeometry args={[0.012, 0.035, 6]} />
        {B}
      </mesh>
      <mesh position={[0, 0.645, 0.094]} scale={[0.024, 0.006, 0.006]}>
        <boxGeometry args={[1, 1, 1]} />
        {DARK}
      </mesh>
      {/* long earlobes */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.095, 0.64, 0]} scale={[0.016, 0.08, 0.028]}>
          <sphereGeometry args={[1, 8, 6]} />
          {B}
        </mesh>
      ))}
      {/* the crown band (เทริด) with its flame points across the front, and the conical cover */}
      <mesh position={[0, 0.765, 0.0]}>
        <cylinderGeometry args={[0.1, 0.098, 0.045, 20]} />
        {G}
      </mesh>
      {Array.from({length: 7}, (_, i) => {
        const a = ((i - 3) / 3) * 1.1;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.098, 0.805, Math.cos(a) * 0.098]} rotation-x={0.15}>
            <coneGeometry args={[0.02, 0.06 - Math.abs(i - 3) * 0.006, 4]} />
            {G}
          </mesh>
        );
      })}
      <mesh position={[0, 0.85, 0]}>
        <coneGeometry args={[0.07, 0.14, 12]} />
        {G}
      </mesh>
      <mesh position={[0, 0.93, 0]}>
        <sphereGeometry args={[0.02, 8, 6]} />
        {G}
      </mesh>
    </group>
  );
};

/** The halo behind the image, self-lit so it reads in daylight. */
export const Halo: React.FC<{k: number}> = ({k}) =>
  k > 0.02 ? (
    <group>
      <mesh position={[0, 0.7, -0.12]} scale={0.3 * k}>
        <ringGeometry args={[0.72, 1, 40]} />
        <meshBasicMaterial color="#ffd36a" toneMapped={false} transparent opacity={0.55 * k} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.48, -0.16]} scale={[0.5 * k, 0.62 * k, 1]}>
        <circleGeometry args={[1, 40]} />
        <meshBasicMaterial color="#ffe7a8" toneMapped={false} transparent opacity={0.18 * k} depthWrite={false} />
      </mesh>
    </group>
  ) : null;

/** The whirlpool: a dark funnel with foam arms spiralling in; `spin` turns it, `k` its size. */
export const Whirlpool: React.FC<{t: number; k: number; r: number}> = ({t, k, r}) => {
  if (k < 0.02) return null;
  const arms = 6;
  return (
    <group scale={[k, 1, k]}>
      <mesh position={[0, -0.25 * k, 0]} rotation-x={Math.PI}>
        <coneGeometry args={[r * 0.55, 0.6 * k, 32, 1, true]} />
        <meshStandardMaterial color="#244a63" roughness={0.2} metalness={0.3} side={2} />
      </mesh>
      <mesh position={[0, 0.11, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[r * 0.5, 32]} />
        <meshBasicMaterial color="#ffcf5a" toneMapped={false} transparent opacity={0.55 + 0.25 * Math.sin(t * 9)} depthWrite={false} />
      </mesh>
      {Array.from({length: arms}, (_, a) =>
        Array.from({length: 14}, (_, j) => {
          const u = j / 13;
          const rr = r * (0.15 + 0.85 * u);
          const ang = (a / arms) * Math.PI * 2 + u * 2.6 - t * 3.2;
          return (
            <mesh key={`${a}-${j}`} position={[Math.cos(ang) * rr, 0.07 - 0.12 * (1 - u), Math.sin(ang) * rr]} rotation-y={-ang} scale={[0.18 + 0.25 * u, 0.04, 0.5 + 0.6 * u]}>
              <sphereGeometry args={[1, 8, 4]} />
              <meshStandardMaterial color="#f2f6f4" transparent opacity={0.75 - 0.35 * u} depthWrite={false} />
            </mesh>
          );
        }),
      )}
    </group>
  );
};

/** The burst of golden water as the image breaks the surface (u 0..1 over ~1.5 s). */
export const Burst: React.FC<{u: number; r: number}> = ({u, r}) => {
  if (u <= 0 || u >= 1) return null;
  const n = 46;
  return (
    <>
      {/* the column */}
      <mesh position={[0, r * 1.6 * Math.sin(Math.PI * u) * 0.5, 0]} scale={[r * 0.35 * (1 - u * 0.5), r * 1.6 * Math.sin(Math.PI * u) + 0.01, r * 0.35 * (1 - u * 0.5)]}>
        <cylinderGeometry args={[0.6, 1, 1, 20, 1, true]} />
        <meshBasicMaterial color="#ffe08a" toneMapped={false} transparent opacity={0.55 * (1 - u)} depthWrite={false} side={2} />
      </mesh>
      {Array.from({length: n}, (_, i) => {
        const a = (i / n) * Math.PI * 2 * 3.1;
        const sp = 0.6 + ((i * 37) % 11) / 11;
        const d = r * sp * u * 1.4;
        const h = r * 2.2 * sp * u * (1 - u);
        return (
          <mesh key={i} position={[Math.cos(a) * d, h, Math.sin(a) * d]} scale={r * 0.07 * (1 - u * 0.6)}>
            <sphereGeometry args={[1, 6, 5]} />
            <meshBasicMaterial color={i % 3 ? '#fff4cf' : '#ffd36a'} toneMapped={false} transparent opacity={0.9 * (1 - u)} depthWrite={false} />
          </mesh>
        );
      })}
    </>
  );
};

/** Golden ripples running out over the water after the image has risen. */
export const Ripples: React.FC<{t: number; t0: number; r: number}> = ({t, t0, r}) => (
  <>
    {[0, 0.7, 1.4, 2.1].map((d, i) => {
      const u = (t - t0 - d) / 2.4;
      if (u <= 0 || u >= 1) return null;
      return (
        <mesh key={i} position={[0, 0.09, 0]} rotation-x={-Math.PI / 2} scale={r * (0.4 + 2.2 * u)}>
          <ringGeometry args={[0.92, 1, 48]} />
          <meshBasicMaterial color="#ffd36a" toneMapped={false} transparent opacity={0.6 * (1 - u)} depthWrite={false} />
        </mesh>
      );
    })}
  </>
);
