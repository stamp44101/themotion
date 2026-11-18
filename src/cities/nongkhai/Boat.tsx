// The long boat (เรือยาว) with a naga bow, dug from one log: the cover's hero (half carved at frame 0), the governor's
// boat Kham Yat in the founding beat, and the racing boats of the payoff. Local axis: the bow at +z, the waterline at y = 0.
import React from 'react';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};

export const HULL = '#8a1f17';
export const GOLD = '#e0a92a';
export const NAGA_SCALE = '#2f8a5a';
const BARK = '#6e5236';
const HEART = '#b9874f';
const HOLLOW = '#6a2c1a';

/** chips that burst from the adze and fade, self-lit so they read at noon */
export const Chips: React.FC<{u: number; seed: number; S: number; n?: number; color?: string}> = ({u, seed, S, n = 10, color = '#f0cf95'}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.35 + hash(seed * 3 + i) * 0.6);
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * sp * u, (0.6 + hash(seed * 7 + i) * 0.8) * sp * u - 1.2 * S * u * u, Math.sin(a) * sp * u]}
            rotation={[a, a * 2, 0]}
            scale={S * 0.07 * (1 - u * 0.6)}
          >
            <boxGeometry args={[1, 0.35, 0.6]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

/** the naga's head and neck rising from the bow: k 0 a rough block, 1 the carved naga (gold and green, red eyes) */
const NagaBow: React.FC<{L: number; k: number; t: number}> = ({L, k, t}) => {
  const n = 9;
  const r0 = L * 0.05;
  const neck = (u: number): [number, number] => [L * 0.06 * Math.sin(u * 1.6), L * 0.05 + u * L * 0.24];
  const nod = Math.sin(t * 3) * 0.05 * k;
  return (
    <group position={[0, 0, L * 0.5]}>
      {/* the rough block the head is carved from: it shrinks away as the head comes out */}
      {k < 0.98 && (
        <mesh position={[0, L * 0.14, L * 0.04]} scale={[1 - k * 0.9, 1 - k * 0.9, 1 - k * 0.9]} castShadow>
          <boxGeometry args={[L * 0.12, L * 0.26, L * 0.14]} />
          <meshStandardMaterial color={HEART} roughness={0.9} />
        </mesh>
      )}
      {k > 0.02 && (
        <group scale={[k, k, k]} rotation-x={nod}>
          {Array.from({length: n}, (_, i) => {
            const u = i / (n - 1);
            const [z, y] = neck(u);
            return (
              <mesh key={i} position={[0, y, z]} castShadow>
                <sphereGeometry args={[r0 * (1 - u * 0.35), 12, 10]} />
                <meshStandardMaterial color={i % 2 ? GOLD : NAGA_SCALE} roughness={0.45} metalness={i % 2 ? 0.45 : 0.1} />
              </mesh>
            );
          })}
          {/* the head: a long snout forward over the water, the crest of flames back along the neck */}
          <group position={[0, L * 0.3, neck(1)[0] + L * 0.03]} scale={2.2}>
            <mesh position={[0, 0, L * 0.03]} scale={[0.85, 0.7, 1.6]} castShadow>
              <sphereGeometry args={[L * 0.03, 14, 10]} />
              <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.5} />
            </mesh>
            <mesh position={[0, -L * 0.012, L * 0.07]} rotation-x={Math.PI / 2 + 0.35} castShadow>
              <coneGeometry args={[L * 0.016, L * 0.05, 8]} />
              <meshStandardMaterial color="#b2231c" roughness={0.5} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * L * 0.019, L * 0.01, L * 0.045]}>
                <sphereGeometry args={[L * 0.007, 8, 6]} />
                <meshBasicMaterial color="#ff3a20" toneMapped={false} />
              </mesh>
            ))}
            {Array.from({length: 5}, (_, i) => (
              <mesh key={i} position={[0, L * (0.03 + 0.004 * i), -L * (0.005 + i * 0.016)]} rotation-x={-0.5 - i * 0.12} castShadow>
                <coneGeometry args={[L * 0.012, L * (0.05 - i * 0.005), 6]} />
                <meshStandardMaterial color={i % 2 ? '#d33a22' : GOLD} roughness={0.5} metalness={0.3} />
              </mesh>
            ))}
          </group>
        </group>
      )}
    </group>
  );
};

/** the long boat. front: how far along from the stern (0) to the bow (1) the log is carved and painted; head: the naga's
 *  head (0 a block, 1 carved); rowers: pairs of paddlers (0 for none), stroking at phase `stroke` */
export const LongBoat: React.FC<{L: number; front?: number; head?: number; t?: number; rowers?: number; stroke?: number; color?: string; band?: string}> = ({
  L,
  front = 1,
  head = 1,
  t = 0,
  rowers = 0,
  stroke = 0,
  color = HULL,
  band = GOLD,
}) => {
  const N = 26;
  const segL = L / N;
  const halfW = (u: number) => L * 0.065 * Math.max(0.18, Math.pow(Math.sin(Math.PI * u), 0.55));
  const H = L * 0.045;
  const logR = L * 0.075;
  return (
    <group>
      {Array.from({length: N}, (_, i) => {
        const u = (i + 0.5) / N;
        const z = (u - 0.5) * L;
        const w = halfW(u);
        // the hull rises toward bow and stern
        const rise = L * 0.035 * Math.pow(Math.abs(u - 0.5) * 2, 3);
        if (u > front)
          return (
            <mesh key={i} position={[0, logR * 0.8, z]} rotation-x={Math.PI / 2} castShadow receiveShadow>
              <cylinderGeometry args={[logR, logR, segL * 1.02, 12]} />
              <meshStandardMaterial color={BARK} roughness={1} />
            </mesh>
          );
        return (
          <group key={i} position={[0, rise, z]}>
            <mesh position={[0, H * 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[w * 2, H, segL * 1.04]} />
              <meshStandardMaterial color={color} roughness={0.55} />
            </mesh>
            {/* the hollow, a lighter heartwood floor */}
            <mesh position={[0, H * 0.98, 0]}>
              <boxGeometry args={[w * 1.45, H * 0.06, segL * 1.04]} />
              <meshStandardMaterial color={HOLLOW} roughness={0.8} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={`g${s}`} position={[s * w * 1.0, H * 0.45, 0]}>
                <boxGeometry args={[L * 0.005, H * 0.22, segL * 1.04]} />
                <meshStandardMaterial color={NAGA_SCALE} roughness={0.5} />
              </mesh>
            ))}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * w * 1.0, H * 0.82, 0]}>
                <boxGeometry args={[L * 0.006, H * 0.3, segL * 1.04]} />
                <meshStandardMaterial color={band} roughness={0.4} metalness={0.4} />
              </mesh>
            ))}
          </group>
        );
      })}
      {/* the stern's naga tail, curling up */}
      {front > 0.02 &&
        Array.from({length: 6}, (_, i) => {
          const a = i / 5;
          return (
            <mesh key={i} position={[0, L * 0.05 + a * L * 0.12, -L * 0.5 - Math.sin(a * 2.2) * L * 0.04]} castShadow>
              <sphereGeometry args={[L * 0.028 * (1 - a * 0.6), 10, 8]} />
              <meshStandardMaterial color={i % 2 ? GOLD : NAGA_SCALE} roughness={0.45} metalness={0.3} />
            </mesh>
          );
        })}
      <NagaBow L={L} k={head} t={t} />
      {/* paddlers in pairs, white shirts and red headbands, the paddles dipping together */}
      {rowers > 0 &&
        Array.from({length: rowers}, (_, i) => {
          const z = (-0.36 + (0.72 * (i + 0.5)) / rowers) * L;
          const ph = Math.sin((stroke + i * 0.02) * Math.PI * 2);
          return [-1, 1].map((s) => (
            <group key={`${i}${s}`} position={[s * L * 0.032, H * 0.9, z]}>
              <mesh position={[0, L * 0.018, 0]}>
                <capsuleGeometry args={[L * 0.007, L * 0.014, 3, 6]} />
                <meshStandardMaterial color={i % 4 === 0 ? '#c8202a' : '#f2efe6'} roughness={0.9} />
              </mesh>
              <mesh position={[0, L * 0.036, 0]}>
                <sphereGeometry args={[L * 0.0065, 6, 5]} />
                <meshStandardMaterial color="#a8714a" roughness={0.9} />
              </mesh>
              <mesh position={[s * L * 0.02, L * 0.006, ph * L * 0.012]} rotation={[ph * 0.6, 0, s * 0.7]}>
                <boxGeometry args={[L * 0.003, L * 0.05, L * 0.006]} />
                <meshStandardMaterial color="#c99b62" roughness={0.7} />
              </mesh>
            </group>
          ));
        })}
    </group>
  );
};

/** the cover's timing: half carved at frame 0, the adze front runs to the bow by CARVE_END, the head comes out after */
export const CARVE0 = 0.5;
export const CARVE_END = 1.7;
export const carveFront = (t: number) => CARVE0 + (0.96 - CARVE0) * smooth(t / CARVE_END);
export const headK = (t: number) => smooth((t - 1.2) / 0.8);
