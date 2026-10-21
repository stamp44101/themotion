// A green sea turtle (เต่าตนุ), the Phuket cover hero (owner's pick) and its hatchlings in the
// payoff. Modelled from the parts that make a sea turtle read at phone size:
// - a low domed carapace of plates: five along the spine, four down each side, and a serrated
//   rim of marginal plates, amber and brown with darker seams; a pale plastron under it;
// - long, swept-back, wing-like fore-flippers and short paddle hind-flippers, scaled;
// - a blunt head with a hooked beak, big dark eyes and plate scales.
// The gait on sand is the real one: both fore-flippers dig in together, the body heaves forward
// and settles, then a pause. Local units: the turtle faces +z and is ~3.4 long.
import React, {useMemo} from 'react';
import * as THREE from 'three';

const PLATE = ['#8a6a3c', '#9b7a45', '#7d5f35', '#a3834c', '#86663a'];
const SEAM = '#3e2c18';
const SKIN = '#8c8a6a';
const SKIN_DARK = '#5e5c44';
const UP = new THREE.Vector3(0, 1, 0);

// one stroke of the crawl: 0 -> 1 is dig (fore-flippers forward and down), heave, settle, pause
export const crawlPhase = (t: number, rate = 0.55) => (t * rate) % 1;
// how far the body has moved within the current stroke (0..1), for lunging along a path
export const crawlAdvance = (t: number, rate = 0.55) => {
  const q = crawlPhase(t, rate);
  return Math.floor(t * rate) + (q < 0.15 ? 0 : q < 0.6 ? (q - 0.15) / 0.45 : 1);
};

// a flipper as a tapered, swept wing: overlapping flattened ellipsoids, widest at the root
const Flipper: React.FC<{len: number; width: number; mat: React.ReactNode}> = ({len, width, mat}) => {
  const segs = 4;
  return (
    <group>
      {Array.from({length: segs}, (_, i) => {
        const u = (i + 0.5) / segs;
        const w = width * (1 - 0.6 * u);
        return (
          <mesh key={i} position={[u * len * 0.92, 0, -0.2 * u * u * len]} rotation-y={0.3 * u} scale={[(len / segs) * 0.85, 0.07, w / 2]} castShadow>
            <sphereGeometry args={[1, 12, 6]} />
            {mat}
          </mesh>
        );
      })}
    </group>
  );
};

export const SeaTurtle: React.FC<{t: number; rate?: number; swim?: boolean; detail?: boolean}> = ({t, rate = 0.55, swim = false, detail = true}) => {
  const q = crawlPhase(t, rate);
  // fore-flippers: forward (dig) then sweep back (push); in water a slow symmetric beat
  const fore = swim ? Math.sin(t * 2.2) * 0.6 : q < 0.15 ? -0.7 + (q / 0.15) * 0.1 : q < 0.6 ? -0.6 + ((q - 0.15) / 0.45) * 1.3 : 0.7 - ((q - 0.6) / 0.4) * 1.4;
  const heave = swim ? 0 : q > 0.15 && q < 0.6 ? Math.sin(((q - 0.15) / 0.45) * Math.PI) * 0.18 : 0;
  const breathe = Math.max(0, Math.sin(t * 0.9)) ** 3;
  const skin = <meshStandardMaterial color={SKIN} flatShading roughness={0.85} />;
  const shell = useMemo(
    () => ({
      // the dome as a squashed hemisphere
      dome: new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      hex: new THREE.CylinderGeometry(1, 1, 1, 6),
    }),
    [],
  );
  // scutes on the dome: [x, z, size, tilt about z, tilt about x]
  // plates on the dome, [x, z, size]: five down the spine, four down each side
  const scutes: [number, number, number][] = [
    [0, 0.95, 0.34], [0, 0.42, 0.36], [0, -0.1, 0.36], [0, -0.62, 0.34], [0, -1.08, 0.28],
    [0.6, 0.62, 0.33], [0.66, 0.08, 0.35], [0.62, -0.46, 0.33], [0.48, -0.95, 0.27],
    [-0.6, 0.62, 0.33], [-0.66, 0.08, 0.35], [-0.62, -0.46, 0.33], [-0.48, -0.95, 0.27],
  ];
  const domeY = (x: number, z: number) => 0.42 + 0.46 * Math.sqrt(Math.max(0, 1 - (x / 1.25) ** 2 - (z / 1.6) ** 2));
  const marginals = 26;
  return (
    <group position={[0, heave, 0]}>
      {/* plastron */}
      <mesh position={[0, 0.36, 0]} scale={[1.15, 0.1, 1.5]}>
        <sphereGeometry args={[1, 14, 6]} />
        <meshStandardMaterial color="#e2d6ad" roughness={0.9} />
      </mesh>
      {/* the carapace dome under its plates */}
      <mesh geometry={shell.dome} position={[0, 0.42, 0]} scale={[1.25, 0.48, 1.6]} castShadow receiveShadow>
        <meshStandardMaterial color={SEAM} roughness={0.85} />
      </mesh>
      {detail &&
        scutes.map(([x, z, sz], i) => {
          const y = domeY(x, z);
          const n = new THREE.Vector3(x / 1.25 ** 2, (y - 0.42) / 0.48 ** 2, z / 1.6 ** 2).normalize();
          const quat = new THREE.Quaternion().setFromUnitVectors(UP, n);
          return (
            <mesh key={i} geometry={shell.hex} position={[x + n.x * 0.012, y + n.y * 0.012, z + n.z * 0.012]} quaternion={quat} scale={[sz, 0.035, sz * 1.08]} castShadow>
              <meshStandardMaterial color={PLATE[i % PLATE.length]} roughness={0.55} />
            </mesh>
          );
        })}
      {/* the serrated rim of marginal plates */}
      {detail &&
        Array.from({length: marginals}, (_, i) => {
          const a = (i / marginals) * Math.PI * 2;
          const x = Math.sin(a) * 1.27;
          const z = Math.cos(a) * 1.62;
          return (
            <mesh key={`m${i}`} position={[x, 0.44, z]} rotation-y={a} scale={[0.26, 0.07, 0.2]} castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={PLATE[(i + 2) % PLATE.length]} roughness={0.6} />
            </mesh>
          );
        })}
      {/* fore-flippers: long, swept, wing-like */}
      {[-1, 1].map((sd) => (
        <group key={`f${sd}`} position={[sd * 0.95, 0.42, 0.75]} rotation-y={sd > 0 ? -fore : Math.PI + fore} rotation-z={sd * 0.12}>
          <Flipper len={2.0} width={0.6} mat={skin} />
        </group>
      ))}
      {/* hind-flippers: short paddles, alternating */}
      {[-1, 1].map((sd) => (
        <group key={`h${sd}`} position={[sd * 0.6, 0.4, -1.35]} rotation-y={sd > 0 ? -2.3 + 0.25 * Math.sin(t * 3 + sd) : -0.84 - 0.25 * Math.sin(t * 3 + sd)}>
          <Flipper len={0.8} width={0.42} mat={skin} />
        </group>
      ))}
      {/* head and neck, lifting to breathe */}
      <group position={[0, 0.55 + 0.12 * breathe, 1.85]} rotation-x={-0.2 * breathe}>
        <mesh position={[0, 0, -0.25]} scale={[0.3, 0.26, 0.4]} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          {skin}
        </mesh>
        <mesh scale={[0.36, 0.3, 0.46]} castShadow>
          <sphereGeometry args={[1, 12, 9]} />
          {skin}
        </mesh>
        {/* the hooked beak */}
        <mesh position={[0, -0.04, 0.42]} rotation-x={Math.PI / 2 + 0.3} scale={[0.22, 0.24, 0.16]} castShadow>
          <coneGeometry args={[1, 1, 8]} />
          <meshStandardMaterial color="#c9b98a" roughness={0.6} />
        </mesh>
        {detail &&
          [[0, 0.24, 0.05, 0.2], [-0.16, 0.2, -0.12, 0.13], [0.16, 0.2, -0.12, 0.13]].map(([x, y, z, s], k) => (
            <mesh key={k} position={[x, y, z]} scale={[s, 0.03, s]}>
              <cylinderGeometry args={[1, 1, 1, 6]} />
              <meshStandardMaterial color={SKIN_DARK} />
            </mesh>
          ))}
        {[-1, 1].map((sd) => (
          <group key={sd} position={[sd * 0.27, 0.08, 0.15]}>
            <mesh>
              <sphereGeometry args={[0.1, 10, 8]} />
              <meshStandardMaterial color="#141410" roughness={0.2} />
            </mesh>
            <mesh position={[sd * 0.03, 0.04, 0.06]}>
              <sphereGeometry args={[0.025, 6, 5]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

// the two rows of flipper marks a turtle leaves on sand, from (x0, z) to (x1, z) going +x
export const TurtleTrack: React.FC<{x0: number; x1: number; z: number; s: number; y?: number}> = ({x0, x1, z, s, y = 0.03}) => {
  const n = Math.max(0, Math.floor((x1 - x0) / (0.55 * s)));
  return (
    <group>
      <mesh position={[(x0 + x1) / 2, y - 0.005, z]} receiveShadow>
        <boxGeometry args={[Math.max(0.01, x1 - x0), 0.01, 1.3 * s]} />
        <meshStandardMaterial color="#d8c69c" roughness={1} />
      </mesh>
      {Array.from({length: n}, (_, i) =>
        [-1, 1].map((sd) => (
          <mesh key={`${i}${sd}`} position={[x0 + (i + 0.5) * 0.55 * s, y, z + sd * 0.95 * s]} rotation-y={sd * 0.6} scale={[0.32 * s, 0.01, 0.12 * s]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#b49a6c" roughness={1} />
          </mesh>
        )),
      )}
    </group>
  );
};

// a white ring of broken surf round something at the waterline
export const Surf: React.FC<{x: number; z: number; r: number; t: number; k: number}> = ({x, z, r, t, k}) =>
  k <= 0.02 ? null : (
    <group position={[x, 0.08, z]}>
      {Array.from({length: 18}, (_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const pulse = 1 + 0.12 * Math.sin(t * 3 + i);
        return (
          <mesh key={i} position={[Math.cos(a) * r * pulse, 0.05 * Math.sin(t * 4 + i), Math.sin(a) * r * pulse * 0.8]} scale={[0.6 + 0.3 * ((i * 7) % 3), 0.12, 0.5]}>
            <sphereGeometry args={[1, 8, 5]} />
            <meshStandardMaterial color="#f2f8fa" transparent opacity={0.85 * k} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
