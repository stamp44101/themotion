// People for the payoff's Songkran turtle release (style frame PhuketStyleMixedCallback): a
// standing figure ~1.7 tall in local units, in a Songkran shirt, who crouches to set a young
// turtle down. Drawn at whatever scale the scene needs.
import React from 'react';

const SHIRTS = ['#e0503c', '#2f7fc1', '#f2b632', '#3aa37a', '#e86fa3', '#f4f1ea'];
export const Person: React.FC<{t: number; i: number}> = ({t, i}) => {
  // a slow crouch to set the turtle down, then up again
  const q = (t * 0.35 + i * 0.37) % 1;
  const bend = q < 0.5 ? Math.sin(q * 2 * Math.PI) * 0.5 : 0;
  const shirt = SHIRTS[i % SHIRTS.length];
  const skin = ['#c68e5f', '#a8714a', '#d9a47a'][i % 3];
  return (
    <group>
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[sd * 0.1, 0.42 - bend * 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.84, 8]} />
          <meshStandardMaterial color="#2c3440" />
        </mesh>
      ))}
      <group position={[0, 0.84 - bend * 0.25, 0]} rotation-x={bend}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <capsuleGeometry args={[0.17, 0.32, 4, 10]} />
          <meshStandardMaterial color={shirt} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.72, 0.02]} castShadow>
          <sphereGeometry args={[0.13, 12, 10]} />
          <meshStandardMaterial color={skin} />
        </mesh>
        {/* arms reaching down and forward to the turtle */}
        {[-1, 1].map((sd) => (
          <mesh key={sd} position={[sd * 0.22, 0.28, 0.12]} rotation-x={-0.6 - bend * 0.6} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.6, 6]} />
            <meshStandardMaterial color={skin} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
