// The cover's hero (style frame A, cloud's pick, delegated by the owner: 20 Nov 2569) and the water, shared by the city and
// the style frames. พระสมุทรเจดีย์: a giant white bell-shaped chedi on its island in the river; at frame 0 its lower half is
// laid in red brick inside a bamboo scaffold, workers on the planks; the courses go up one at a time until LAY_END, the
// whitewash sweeps up, the scaffold comes down and the spire shoots up (the shape changes: Rama IV made it taller). The same
// Chedi draws the real one in the town (stage A, Rama II-III; stage B, Rama IV) and the red cloth of the payoff.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Walker} from '../nan/figures';
import {COURSES, LAY_END, courseAt, heroK, scaffoldK, spireK, washK} from './actors';
import {WATER, WEST_CHANNEL, type P} from './places';

const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const BRICK = '#b0563a';
export const LIME = '#f4f1e8';
export const GOLD = '#e0ac2c';
export const RED_CLOTH = '#c8202a';
const BAMBOO = '#b99a5a';

// ---------- the water: one flat shape for the river and the Gulf, cut at the tile's edges; the old west channel apart
export const shapeOf = (pts: P[]) => {
  const sh = new THREE.Shape();
  pts.forEach(([x, z], i) => (i === 0 ? sh.moveTo(x, -z) : sh.lineTo(x, -z)));
  sh.closePath();
  return sh;
};
const WATER_SHAPE = shapeOf(WATER);
const CHANNEL_SHAPE = shapeOf(WEST_CHANNEL);
// The slab's top sits at -1.3 + depth = 0.10: depth >= 1.40 so it never z-fights the shore ground (Songkhla, PR #93);
// matte, so the sun's specular never blows out to white.
export const FlatWater: React.FC<{shape: THREE.Shape; color: string; y?: number}> = ({shape, color, y = 0}) => (
  <mesh position={[0, -1.3 + y, 0]} rotation-x={-Math.PI / 2} receiveShadow>
    <extrudeGeometry args={[shape, {depth: 1.4, bevelEnabled: false}]} />
    <meshStandardMaterial color={color} roughness={0.85} metalness={0} />
  </mesh>
);
const WATER_C = new THREE.Color('#4d86a4');
const MUD_C = new THREE.Color('#8f7f5c');
const MANGROVE_C = new THREE.Color('#6e8048');
/** silt 0: open water; 0.5 mudflat; 1 mangrove land (then not drawn) */
export const Water: React.FC<{silt: number}> = ({silt}) => {
  const c = silt < 0.5 ? WATER_C.clone().lerp(MUD_C, silt * 2) : MUD_C.clone().lerp(MANGROVE_C, (silt - 0.5) * 2);
  return (
    <group>
      <FlatWater shape={WATER_SHAPE} color="#4d86a4" />
      {silt < 0.98 && <FlatWater shape={CHANNEL_SHAPE} color={`#${c.getHexString()}`} y={-0.004} />}
    </group>
  );
};

// ---------- the chedi: a lathe profile (radius, height) for a unit-high bell-shaped chedi on three round terraces
const PROFILE: [number, number][] = [
  [0.3, 0], [0.3, 0.05], [0.25, 0.05], [0.25, 0.1], [0.205, 0.1], [0.205, 0.15], [0.18, 0.15], [0.18, 0.18], [0.165, 0.2],
  [0.17, 0.22], [0.155, 0.235], [0.175, 0.26], [0.18, 0.3], [0.17, 0.35], [0.145, 0.4], [0.105, 0.445], [0.06, 0.47],
  [0.0, 0.475],
];
const BELL_TOP = 0.475;
/** the profile cut at height h (a flat cap there) */
const profileTo = (h: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let i = 0; i < PROFILE.length; i++) {
    const [r, y] = PROFILE[i];
    if (y <= h) out.push([r, y]);
    else {
      const [r0, y0] = PROFILE[i - 1];
      const u = (h - y0) / Math.max(1e-6, y - y0);
      out.push([r0 + (r - r0) * u, h], [0, h]);
      return out;
    }
  }
  return out;
};
const latheOf = (pts: [number, number][]) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(Math.max(0.0005, r), y)), 32);
const Lathe: React.FC<{h: number; color: string; grow?: number}> = ({h, color, grow = 1}) => {
  const q = Math.round(h * 200) / 200;
  const geo = useMemo(() => latheOf(profileTo(Math.max(0.004, q))), [q]);
  return (
    <mesh geometry={geo} scale={[grow, 1, grow]} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.75} />
    </mesh>
  );
};

/** One chedi, `H` high when finished. `built` 0..1 brick laid up to the bell's top; `wash` 0..1 whitewash from the bottom;
 *  `spire` 0 a stub, 1 the tall spire; `scaffold` 0..1; `wrap` 0..1 the red cloth round the bell's neck; `workers` on the
 *  scaffold (legend scale). */
export const Chedi: React.FC<{H: number; built: number; wash: number; spire: number; scaffold?: number; wrap?: number; workers?: number; t?: number; width?: number}> = ({
  H,
  built,
  wash,
  spire,
  scaffold = 0,
  wrap = 0,
  workers = 0,
  t = 0,
  width = 1,
}) => {
  const hb = built * BELL_TOP;
  const hw = Math.min(hb, wash * BELL_TOP);
  const done = built > 0.999;
  // the scaffold stands a lift above the brickwork
  const hs = Math.min(0.56, hb + 0.1);
  // the spire above the bell: a throne, the rings and the gold tip; a stub before it shoots up
  const sp = 0.32 + 0.68 * spire;
  const top = BELL_TOP + 0.04 + 0.48 * sp;
  return (
    <group scale={[H * width, H, H * width]}>
      {hb > 0.002 && <Lathe h={hb} color={BRICK} />}
      {hw > 0.002 && <Lathe h={hw} color={LIME} grow={1.012} />}
      {done && (
        <group>
          {/* the throne (บัลลังก์) */}
          <mesh position={[0, BELL_TOP + 0.02, 0]} castShadow>
            <boxGeometry args={[0.09, 0.04, 0.09]} />
            <meshStandardMaterial color={wash > 0.95 ? LIME : BRICK} roughness={0.75} />
          </mesh>
          {/* the rings (ปล้องไฉน) and the spire (ปลี) */}
          <mesh position={[0, BELL_TOP + 0.04 + (0.34 * sp) / 2, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.05, 0.34 * sp, 16]} />
            <meshStandardMaterial color={wash > 0.95 ? LIME : BRICK} roughness={0.75} />
          </mesh>
          {Array.from({length: 7}, (_, i) => (
            <mesh key={i} position={[0, BELL_TOP + 0.04 + 0.34 * sp * ((i + 0.5) / 7.5), 0]} rotation-x={Math.PI / 2}>
              <torusGeometry args={[0.05 - 0.028 * ((i + 0.5) / 7.5), 0.004, 6, 20]} />
              <meshStandardMaterial color={wash > 0.95 ? '#e2ded2' : BRICK} roughness={0.75} />
            </mesh>
          ))}
          <mesh position={[0, BELL_TOP + 0.04 + 0.34 * sp + (0.14 * sp) / 2, 0]} castShadow>
            <coneGeometry args={[0.022, 0.14 * sp, 12]} />
            <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, top, 0]}>
            <sphereGeometry args={[0.008, 8, 6]} />
            <meshBasicMaterial color="#fff2b0" toneMapped={false} />
          </mesh>
        </group>
      )}
      {/* the red cloth wound round the bell's neck (the payoff) */}
      {wrap > 0.01 && (
        <group position={[0, 0.405, 0]} rotation-x={Math.PI / 2}>
          <mesh>
            <torusGeometry args={[0.14, 0.022, 8, 32, Math.PI * 2 * wrap]} />
            <meshBasicMaterial color={RED_CLOTH} toneMapped={false} />
          </mesh>
        </group>
      )}
      {wrap > 0.95 && (
        <mesh position={[0.13, 0.33, 0.06]} rotation-z={0.25}>
          <boxGeometry args={[0.03, 0.14, 0.01]} />
          <meshBasicMaterial color={RED_CLOTH} toneMapped={false} />
        </mesh>
      )}
      {/* the bamboo scaffold round the bell, its planks at each lift; it sinks away when it comes down */}
      {scaffold > 0.01 && (
        <group position={[0, -(1 - scaffold) * 0.5, 0]} scale={[1, scaffold, 1]}>
          {Array.from({length: 18}, (_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.24, hs / 2, Math.sin(a) * 0.24]}>
                <cylinderGeometry args={[0.004, 0.004, hs, 5]} />
                <meshStandardMaterial color={BAMBOO} roughness={0.9} />
              </mesh>
            );
          })}
          {[0.12, 0.22, 0.32, 0.42, 0.52].filter((y) => y < hs).map((y, i) => (
            <mesh key={i} position={[0, y, 0]} rotation-x={Math.PI / 2}>
              <torusGeometry args={[0.24, 0.006, 4, 36]} />
              <meshStandardMaterial color={BAMBOO} roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}
      {workers > 0 &&
        Array.from({length: workers}, (_, i) => {
          const lift = Math.min(4, Math.floor(hash(i) * 4));
          const y = Math.min([0.12, 0.22, 0.32, 0.42][lift], Math.max(0.12, hb - 0.02));
          const a = (i / workers) * Math.PI * 2 + hash(i + 3) + t * 0.15 * (i % 2 ? 1 : -1);
          return (
            <group key={i} position={[Math.cos(a) * 0.255, y, Math.sin(a) * 0.255]} rotation-y={-a} scale={0.02}>
              <Walker step={t * 1.4 + i} i={i} load={i % 2 === 0} />
            </group>
          );
        })}
    </group>
  );
};

/** a hod of bricks thrown in at each course: a puff of brick dust, self-lit */
export const Dust: React.FC<{u: number; seed: number; S: number; color?: string; n?: number}> = ({u, seed, S, color = '#e0a07a', n = 8}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.3 + hash(seed * 3 + i) * 0.5);
        return (
          <mesh key={i} position={[Math.cos(a) * sp * u, (0.3 + hash(seed * 7 + i) * 0.5) * sp * u, Math.sin(a) * sp * u]} scale={S * 0.07 * (1 - u)}>
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1 - u} />
          </mesh>
        );
      })}
    </group>
  );
};

/** the cover: the giant chedi on a sand island, `S` high; it sinks away by 3.8 s (heroK) unless `keep` (the style frames) */
export const GiantChedi: React.FC<{t: number; S: number; keep?: boolean}> = ({t, S, keep}) => {
  const k = keep ? 1 : heroK(t);
  if (k < 0.02) return null;
  const done = Array.from({length: COURSES}, (_, i) => (t >= courseAt(i) ? 1 : 0)).reduce((a: number, b) => a + b, 0);
  const lastAt = courseAt(Math.max(0, done - 1));
  const since = t - lastAt;
  return (
    <group scale={[k, k, k]}>
      {/* the island: a low sand bank fringed with mangrove */}
      <mesh position={[0, 0.05, 0]} scale={[S * 0.4, S * 0.012, S * 0.34]} receiveShadow>
        <sphereGeometry args={[1, 32, 12]} />
        <meshStandardMaterial color="#d8c494" roughness={1} />
      </mesh>
      {Array.from({length: 22}, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * S * 0.37, S * 0.012, Math.sin(a) * S * 0.31]} scale={S * (0.022 + hash(i) * 0.012)} castShadow>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color="#3f6a34" roughness={0.9} />
          </mesh>
        );
      })}
      <Chedi H={S} built={done / COURSES} wash={washK(t)} spire={spireK(t)} scaffold={scaffoldK(t)} workers={scaffoldK(t) > 0.5 ? 10 : 0} t={t} />
      {/* brick dust where each new course goes on */}
      {done > COURSES / 2 && t < LAY_END + 0.3 && since < 0.45 && (
        <group position={[0, S * BELL_TOP * (done / COURSES), 0]}>
          <Dust u={since / 0.45} seed={done} S={S * 0.25} />
        </group>
      )}
    </group>
  );
};

