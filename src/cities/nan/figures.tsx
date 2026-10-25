// Nan's figures: people on foot (undyed cotton, indigo and white read against the ground,
// CLAUDE.md "figures must read as people"), the white bull of the province's seal, an ox cart,
// and the biplane of ~2470.
import React from 'react';

const SKINS = ['#c68e5f', '#a8714a', '#d9a47a'];
const CLOTH = ['#f1ece0', '#2f3f6e', '#e8dcc0', '#3a4f80', '#f4f1ea', '#7a2f2a'];

/** A person walking (step = phase). `load`: a shoulder pole with two baskets; `spear`: a
 *  soldier's spear and red headcloth. ~1.7 units tall. */
export const Walker: React.FC<{step: number; i: number; load?: boolean; spear?: boolean; still?: boolean}> = ({step, i, load, spear, still}) => {
  const a = still ? 0 : Math.sin(step * Math.PI * 2) * 0.45;
  const cloth = spear ? '#5a3a24' : CLOTH[i % CLOTH.length];
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.1, 0.85, 0]} rotation-x={a * s}>
          <mesh position={[0, -0.42, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.84, 6]} />
            <meshStandardMaterial color={SKINS[(i + 1) % 3]} roughness={0.9} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.12, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.4, 4, 8]} />
        <meshStandardMaterial color={cloth} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.6, 0.02]} castShadow>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color={SKINS[i % 3]} roughness={0.9} />
      </mesh>
      {spear && (
        <>
          <mesh position={[0, 1.7, 0.02]} scale={[0.15, 0.06, 0.15]}>
            <cylinderGeometry args={[1, 1, 1, 8]} />
            <meshStandardMaterial color="#b0261c" roughness={0.9} />
          </mesh>
          <mesh position={[0.26, 1.35, 0.1]} rotation-x={0.15} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 2.4, 5]} />
            <meshStandardMaterial color="#6b4a2a" />
          </mesh>
          <mesh position={[0.26, 2.6, 0.28]} rotation-x={0.15}>
            <coneGeometry args={[0.06, 0.25, 5]} />
            <meshStandardMaterial color="#c9c9c9" metalness={0.6} roughness={0.4} />
          </mesh>
        </>
      )}
      {load && (
        <group position={[0, 1.42, 0]} rotation-y={Math.PI / 2}>
          <mesh rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.5, 5]} />
            <meshStandardMaterial color="#8a6a3a" />
          </mesh>
          {[-0.68, 0.68].map((x) => (
            <mesh key={x} position={[x, -0.45, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.15, 0.32, 8]} />
              <meshStandardMaterial color="#b89a5e" roughness={1} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

/** The white bull (โคอุศุภราช), a humped zebu, nose toward +z. ~2.4 long at scale 1. */
export const Bull: React.FC<{walk: number; moving: boolean}> = ({walk, moving}) => {
  const W = '#f4efe4';
  const S = '#d9cfbd';
  const legs: [number, number, number][] = [
    [-0.32, 0.75, 0],
    [0.32, 0.75, 0.5],
    [-0.32, -0.75, 0.5],
    [0.32, -0.75, 0],
  ];
  return (
    <group>
      {legs.map(([x, z, ph], j) => (
        <group key={j} position={[x, 1.05, z]} rotation-x={moving ? Math.sin((walk + ph) * Math.PI * 2) * 0.45 : 0}>
          <mesh position={[0, -0.52, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.08, 1.05, 6]} />
            <meshStandardMaterial color={S} roughness={0.9} />
          </mesh>
          <mesh position={[0, -1.02, 0]}>
            <cylinderGeometry args={[0.09, 0.1, 0.1, 6]} />
            <meshStandardMaterial color="#3a3530" />
          </mesh>
        </group>
      ))}
      {/* body, hump, dewlap */}
      <mesh position={[0, 1.35, 0]} scale={[0.55, 0.55, 1.15]} castShadow>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color={W} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.95, 0.55]} scale={[0.32, 0.35, 0.38]} castShadow>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color={W} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.0, 1.0]} scale={[0.14, 0.4, 0.3]} castShadow>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={S} roughness={0.9} />
      </mesh>
      {/* head, held up and forward */}
      <group position={[0, 1.75, 1.25]} rotation-x={0.5}>
        <mesh position={[0, 0, 0.3]} scale={[0.24, 0.26, 0.48]} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={W} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.05, 0.72]} scale={[0.17, 0.15, 0.12]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#c79a8a" roughness={0.9} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s}>
            {/* horns curving up and out, gilt like the seal's */}
            <mesh position={[s * 0.24, 0.3, 0.05]} rotation-z={-s * 0.6} castShadow>
              <coneGeometry args={[0.07, 0.55, 6]} />
              <meshStandardMaterial color="#e3a935" metalness={0.4} roughness={0.4} />
            </mesh>
            <mesh position={[s * 0.27, 0.05, 0.05]} rotation-z={s * 1.2} scale={[0.07, 0.18, 0.05]}>
              <sphereGeometry args={[1, 6, 5]} />
              <meshStandardMaterial color={S} />
            </mesh>
          </group>
        ))}
      </group>
      {/* tail */}
      <mesh position={[0, 1.2, -1.15]} rotation-x={0.25 + (moving ? Math.sin(walk * 6) * 0.15 : 0)}>
        <cylinderGeometry args={[0.03, 0.03, 0.9, 5]} />
        <meshStandardMaterial color={S} />
      </mesh>
    </group>
  );
};

/** An ox cart, along +z. */
export const Cart: React.FC<{step: number}> = ({step}) => (
  <group>
    <mesh position={[0, 0.85, -0.9]} castShadow>
      <boxGeometry args={[1.0, 0.5, 1.6]} />
      <meshStandardMaterial color="#8a6a3a" roughness={1} />
    </mesh>
    <mesh position={[0, 1.3, -0.9]} rotation-x={Math.PI / 2} scale={[0.55, 0.85, 0.45]} castShadow>
      <cylinderGeometry args={[1, 1, 1.6, 10, 1, true, 0, Math.PI]} />
      <meshStandardMaterial color="#c9b07a" side={2} roughness={1} />
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.58, 0.5, -0.9]} rotation={[step * 4, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 10]} />
        <meshStandardMaterial color="#5a4128" />
      </mesh>
    ))}
    <mesh position={[0, 0.85, 0.75]} scale={[0.4, 0.45, 0.8]} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#b3a58c" roughness={1} />
    </mesh>
    <mesh position={[0, 0.95, 1.55]} scale={[0.2, 0.22, 0.32]} castShadow>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#b3a58c" roughness={1} />
    </mesh>
  </group>
);

/** A biplane of the 1920s, nose to +z, wheels on y = 0. ~7.5 m span drawn at scale 1 = 1.6 units. */
export const Biplane: React.FC<{prop: number; pitch: number}> = ({prop, pitch}) => {
  const SKIN = '#c8b98f';
  const RED = '#b0261c';
  return (
    <group rotation-x={-pitch}>
      {/* fuselage */}
      <mesh position={[0, 0.55, 0]} rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.16, 0.07, 1.6, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.55, 0.85]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.16, 0.16, 0.16, 12]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* wings, upper and lower, with the roundel */}
      {[0.85, 0.42].map((y, i) => (
        <mesh key={y} position={[0, y, 0.35 - i * 0.05]} castShadow>
          <boxGeometry args={[1.6, 0.03, 0.34]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
      ))}
      {[-0.6, 0.6].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.875, 0.35]} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[0.12, 14]} />
            <meshStandardMaterial color={RED} />
          </mesh>
          <mesh position={[x, 0.64, 0.33]}>
            <boxGeometry args={[0.02, 0.43, 0.02]} />
            <meshStandardMaterial color="#5a4a3a" />
          </mesh>
        </group>
      ))}
      {/* tail */}
      <mesh position={[0, 0.6, -0.72]}>
        <boxGeometry args={[0.6, 0.02, 0.2]} />
        <meshStandardMaterial color={SKIN} />
      </mesh>
      <mesh position={[0, 0.75, -0.75]}>
        <boxGeometry args={[0.02, 0.3, 0.2]} />
        <meshStandardMaterial color={RED} />
      </mesh>
      {/* propeller */}
      <group position={[0, 0.55, 0.95]} rotation-z={prop}>
        <mesh>
          <boxGeometry args={[0.6, 0.06, 0.02]} />
          <meshStandardMaterial color="#5a3a24" />
        </mesh>
        <mesh>
          <circleGeometry args={[0.3, 16]} />
          <meshBasicMaterial color="#d8d0c0" transparent opacity={0.18} depthWrite={false} />
        </mesh>
      </group>
      {/* undercarriage */}
      {[-0.22, 0.22].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.24, 0.45]} rotation-x={0.2}>
            <boxGeometry args={[0.02, 0.4, 0.02]} />
            <meshStandardMaterial color="#5a4a3a" />
          </mesh>
          <mesh position={[x, 0.09, 0.45]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 10]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
