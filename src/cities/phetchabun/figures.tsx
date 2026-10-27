// Phetchabun's props: the raft that carries the image (a bamboo raft with a gilt canopy, บุษบก),
// a plain rowing boat, a 1960s truck, the timber halls of Nakhonban, a tamarind tree, and the
// people of the อุ้มพระดำน้ำ rite in white.
import React from 'react';

const SKINS = ['#c68e5f', '#a8714a', '#d9a47a'];
const GILT = '#d9a43a';
const BAMBOO = '#c9b077';
const TIMBER = '#6e4e30';

/** The raft along +z, deck at y 0.42 (RAFT_DECK), ~2.6 long. The image stands in the middle. */
export const Raft: React.FC = () => (
  <group>
    {Array.from({length: 7}, (_, i) => (
      <mesh key={i} position={[(i - 3) * 0.2, 0.3, 0]} rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2.6, 6]} />
        <meshStandardMaterial color={BAMBOO} roughness={0.9} />
      </mesh>
    ))}
    {/* an open gilt dais for the image, a tiered parasol (ฉัตร) at each corner: no roof, so the
        image is seen from the drone */}
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[0.9, 0.16, 0.9]} />
      <meshStandardMaterial color={GILT} metalness={0.5} roughness={0.4} />
    </mesh>
    {[-1, 1].map((x) =>
      [-1, 1].map((z) => (
        <group key={`${x}${z}`} position={[x * 0.62, 0, z * 0.95]}>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.4, 5]} />
            <meshStandardMaterial color={GILT} metalness={0.5} roughness={0.4} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 1.25 + i * 0.2, 0]}>
              <cylinderGeometry args={[0.05, 0.3 - i * 0.07, 0.12, 10]} />
              <meshStandardMaterial color={i % 2 ? GILT : '#f1ece0'} metalness={i % 2 ? 0.5 : 0} roughness={0.5} />
            </mesh>
          ))}
        </group>
      )),
    )}
    {/* garlands of flags at the corners */}
    {[-1, 1].map((z) => (
      <mesh key={z} position={[0, 0.75, z * 1.15]}>
        <boxGeometry args={[1.3, 0.5, 0.04]} />
        <meshStandardMaterial color={z > 0 ? '#f1ece0' : '#e8c24a'} roughness={0.9} />
      </mesh>
    ))}
  </group>
);

/** A seated rower (row = phase). */
const Rower: React.FC<{row: number; i: number; white?: boolean}> = ({row, i, white}) => {
  const a = Math.sin(row * Math.PI * 2) * 0.5;
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.22, 4, 8]} />
        <meshStandardMaterial color={white ? '#f4f1ea' : i % 2 ? '#2f3f6e' : '#e8dcc0'} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.84, 0]}>
        <sphereGeometry args={[0.11, 10, 8]} />
        <meshStandardMaterial color={SKINS[i % 3]} roughness={0.9} />
      </mesh>
      <mesh position={[0.25, 0.42, 0.1]} rotation={[a, 0, 0.5]}>
        <cylinderGeometry args={[0.025, 0.025, 1.1, 5]} />
        <meshStandardMaterial color="#8a6a3a" />
      </mesh>
    </group>
  );
};

/** A plain wooden boat along +z with three rowers, ~2.6 long. */
export const RowBoat: React.FC<{row: number; i: number}> = ({row, i}) => (
  <group>
    <mesh position={[0, 0.12, 0]} scale={[0.42, 0.22, 1.3]} castShadow>
      <sphereGeometry args={[1, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      <meshStandardMaterial color="#5a3d26" roughness={0.8} side={2} />
    </mesh>
    <mesh position={[0, 0.13, 0]} rotation-x={-Math.PI / 2} scale={[0.4, 1.25, 1]}>
      <circleGeometry args={[1, 18]} />
      <meshStandardMaterial color="#7a5636" roughness={0.9} />
    </mesh>
    {[-0.7, 0, 0.7].map((z, k) => (
      <group key={z} position={[0, 0, z]}>
        <Rower row={row + k * 0.05} i={i + k} />
      </group>
    ))}
  </group>
);

/** A 1960s Thai truck along +z: green cab, wooden bed piled with tamarind sacks. ~2.4 long. */
export const Truck: React.FC = () => (
  <group>
    <mesh position={[0, 0.55, 0.75]} castShadow>
      <boxGeometry args={[0.95, 0.7, 0.7]} />
      <meshStandardMaterial color="#3f7a4f" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.72, 1.05]}>
      <boxGeometry args={[0.85, 0.28, 0.06]} />
      <meshStandardMaterial color="#9fc3d6" roughness={0.2} metalness={0.3} />
    </mesh>
    <mesh position={[0, 0.45, -0.4]} castShadow>
      <boxGeometry args={[1.0, 0.5, 1.55]} />
      <meshStandardMaterial color="#8a6238" roughness={0.9} />
    </mesh>
    {Array.from({length: 6}, (_, i) => (
      <mesh key={i} position={[(i % 2 ? 0.22 : -0.22), 0.86, -0.85 + Math.floor(i / 2) * 0.45]} castShadow>
        <sphereGeometry args={[0.24, 8, 6]} />
        <meshStandardMaterial color="#a0703f" roughness={1} />
      </mesh>
    ))}
    {[-0.75, 0.7].map((z) =>
      [-1, 1].map((x) => (
        <mesh key={`${z}${x}`} position={[x * 0.5, 0.18, z]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 10]} />
          <meshStandardMaterial color="#1f1f1f" roughness={0.9} />
        </mesh>
      )),
    )}
  </group>
);

/** A long timber hall with a tall hipped roof (the Nakhonban offices, 2486). */
export const Hall: React.FC<{roof?: number}> = ({roof = 1}) => (
  <group>
    {[-1, 1].map((x) =>
      [-1.4, 0, 1.4].map((z) => (
        <mesh key={`${x}${z}`} position={[x * 0.75, 0.35, z]}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 5]} />
          <meshStandardMaterial color={TIMBER} />
        </mesh>
      )),
    )}
    <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.6, 0.6, 3.2]} />
      <meshStandardMaterial color="#c9a774" roughness={0.9} />
    </mesh>
    {roof > 0.02 && (
      <mesh position={[0, 1.25 + 0.45 * roof, 0]} rotation-y={Math.PI / 4} scale={[1.45, roof * 0.9, 2.6]} castShadow>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color="#7d6a4a" flatShading roughness={0.95} />
      </mesh>
    )}
  </group>
);

/** A sweet-tamarind tree: a short trunk under a wide, feathery dome. */
export const Tamarind: React.FC<{s?: number}> = ({s = 1}) => (
  <group scale={s}>
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.08, 0.11, 0.7, 5]} />
      <meshStandardMaterial color="#5a4330" />
    </mesh>
    <mesh position={[0, 0.95, 0]} scale={[1, 0.62, 1]} castShadow>
      <sphereGeometry args={[0.62, 10, 8]} />
      <meshStandardMaterial color="#5f8f3a" roughness={1} flatShading />
    </mesh>
  </group>
);

/** A person standing waist-deep in the river in white (the rite), arms forward to hold the
 *  image (`hold`) or at the sides. ~1.7 tall above the riverbed; the river cuts them at the waist. */
export const RiteFigure: React.FC<{i: number; hold?: boolean; uniform?: string}> = ({i, hold, uniform = '#f4f1ea'}) => (
  <group>
    <mesh position={[0, 0.55, 0]} castShadow>
      <capsuleGeometry args={[0.19, 0.6, 4, 10]} />
      <meshStandardMaterial color={uniform} roughness={0.85} />
    </mesh>
    <mesh position={[0, 1.18, 0.02]} castShadow>
      <sphereGeometry args={[0.15, 12, 10]} />
      <meshStandardMaterial color={SKINS[i % 3]} roughness={0.9} />
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.2, hold ? 0.78 : 0.6, hold ? 0.2 : 0]} rotation={[hold ? -1.2 : 0, 0, s * (hold ? -0.25 : 0.12)]} castShadow>
        <capsuleGeometry args={[0.05, 0.36, 4, 6]} />
        <meshStandardMaterial color={uniform} roughness={0.85} />
      </mesh>
    ))}
  </group>
);
