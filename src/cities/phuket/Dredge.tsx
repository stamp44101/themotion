import React, {useMemo} from 'react';

// The bucket dredge (style frame B, PhuketStyleDredge): a pontoon hull with two storeys of works, a
// stack and its smoke, the ladder dipping at the bow with its bucket chain turning, and the
// tailings chute at the stern. Local frame: bow toward +z, ~11 long with the ladder; drawn at
// `scale`.
const hull = <meshStandardMaterial color="#b9b2a0" roughness={0.7} />;
const iron = <meshStandardMaterial color="#8a3d1c" roughness={0.6} metalness={0.3} />;
export const Dredge: React.FC<{t: number}> = ({t}) => {
  const bob = 0.05 * Math.sin(t * 1.4);
  const buckets = 16;
  const boomLen = 9;
  // the bucket chain runs up the boom and back down underneath it
  const chain = useMemo(() => Array.from({length: buckets}, (_, i) => i / buckets), []);
  return (
    <group position={[0, bob, 0]}>
      {/* pontoon hull and the two-storey works on it */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.7, 7.5]} />
        {hull}
      </mesh>
      <mesh position={[0, 1.5, -0.6]} castShadow>
        <boxGeometry args={[3.4, 1.6, 4.6]} />
        <meshStandardMaterial color="#d8d0bc" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.7, -1.0]} castShadow>
        <boxGeometry args={[2.8, 0.9, 3.0]} />
        <meshStandardMaterial color="#d8d0bc" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.25, -1.0]} castShadow>
        <boxGeometry args={[3.2, 0.12, 3.4]} />
        <meshStandardMaterial color="#8a3a2a" roughness={0.7} />
      </mesh>
      {/* the stack and its smoke */}
      <mesh position={[0.8, 4.1, -1.8]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 1.8, 10]} />
        {iron}
      </mesh>
      {Array.from({length: 7}, (_, i) => {
        const a = (t * 0.6 + i / 7) % 1;
        return (
          <mesh key={i} position={[0.8 + a * 1.2, 5.1 + a * 3.2, -1.8 - a * 0.6]} scale={0.3 + a * 0.9}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#77736c" transparent opacity={0.55 * (1 - a)} depthWrite={false} />
          </mesh>
        );
      })}
      {/* the ladder (boom) dipping into the pond at the bow, the bucket chain turning on it */}
      <group position={[0, 1.6, 3.2]} rotation-x={0.55}>
        <mesh position={[0, 0, boomLen / 2]} castShadow>
          <boxGeometry args={[0.5, 0.35, boomLen]} />
          {iron}
        </mesh>
        {chain.map((u, i) => {
          const q = (u + t * 0.18) % 1;
          // up along the top for the first half, back down along the underside for the second
          const top = q < 0.5;
          const zz = top ? q * 2 * boomLen : (1 - (q - 0.5) * 2) * boomLen;
          return (
            <mesh key={i} position={[0, top ? 0.32 : -0.32, zz]} castShadow>
              <boxGeometry args={[1.0, 0.6, 0.48]} />
              <meshStandardMaterial color={top ? '#c2561e' : '#7a3414'} roughness={0.7} />
            </mesh>
          );
        })}
      </group>
      {/* the tailings chute at the stern, spilling grey sand */}
      <group position={[0, 1.4, -4.2]} rotation-x={-0.35}>
        <mesh position={[0, 0, -1.6]} castShadow>
          <boxGeometry args={[0.8, 0.25, 3.2]} />
          {iron}
        </mesh>
        {Array.from({length: 6}, (_, i) => {
          const a = (t * 1.2 + i / 6) % 1;
          return (
            <mesh key={i} position={[0, -0.3 - a * 1.6, -3.3 - a * 0.4]}>
              <sphereGeometry args={[0.14, 6, 5]} />
              <meshStandardMaterial color="#9a958a" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

