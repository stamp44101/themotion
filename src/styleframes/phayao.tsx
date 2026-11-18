// Throwaway style frames for Phayao's cover (15 Nov 2026; docs/briefs/phayao_research.md). The rules from experiments
// §17-§20: the symbol fills ~1/3 of the frame at second 0 on the whole land tile at legend scale; it is half made by hand at
// frame 0 (no blank canvas) and changes shape, not only colour.
// A1 (cloud's pick): พระเจ้าตนหลวง. The giant seated Buddha of Wat Si Khom Kham (the provincial seal), built in brick and
// stucco over ~33 years (พ.ศ. 2034-2067). At frame 0 the lap and the pedestal are stuccoed white, the chest is raw brick in a
// bamboo scaffold with people on it; the brick courses climb to the shoulders and the head, the stucco sweeps up after
// them, the scaffold comes down and the gold goes on from the lap up.
// A2: วัดติโลกอาราม. A Lanna bell chedi half laid in brick by the Ing at frame 0; the bell and the spire go up and are
// stuccoed; then the weir's water spreads into the Kwan and the chedi sinks to its bell in the lake (the temple drowned in
// 2482).
// B: ปลาบึก. A giant Mekong catfish (the province's aquatic animal, bred at the Kwan's fisheries station) leaps out of the
// Kwan from frame 0 and dives back in with a splash.
// The map is the real one (OSM 15 Nov 2026), 100 m/unit, origin the city pillar (ศาลหลักเมืองพะเยา); the Kwan's outline
// from OSM relation 5657979; the Ing's course across the plain before the lake is an estimate.
import React from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// the Kwan today (OSM relation 5657979, simplified to ~100 m)
export const KWAN: P2[] = [
  [-38.7, 16.8], [-41.2, 18.6], [-39.0, 16.6], [-41.6, 14.5], [-40.3, 11.5], [-41.8, 11.9], [-45.2, 3.9], [-48.9, 0.9],
  [-47.8, -1.5], [-50.2, -2.3], [-50.4, -11.2], [-48.7, -12.6], [-48.2, -24.2], [-43.8, -29.9], [-45.2, -36.5], [-37.0, -38.0],
  [-37.3, -40.4], [-35.4, -41.1], [-34.7, -37.8], [-33.4, -38.1], [-33.5, -35.8], [-29.2, -30.3], [-29.4, -28.0], [-25.2, -20.5],
  [-25.8, -18.4], [-20.8, -16.8], [-11.6, -7.2], [-9.7, -7.9], [-7.1, -4.5], [-5.5, 2.5], [-1.8, 4.1], [3.2, 3.1], [8.8, 5.8],
  [10.2, 4.3], [14.6, 8.2], [5.4, 8.3], [3.6, 12.8], [5.3, 14.2], [9.0, 10.2], [8.0, 12.6], [-2.5, 20.1], [-8.6, 18.6],
  [-11.4, 12.7], [-15.7, 19.1], [-18.4, 19.9], [-16.4, 21.8], [-22.6, 24.5], [-32.5, 22.6], [-34.8, 20.2], [-34.1, 19.2],
];
// the Ing: in from the north (OSM 255901636), across the plain to the outlet at the weir (estimate before the lake), then
// east (OSM 459149835 + 255901640), kept inside the tile
const ING: P2[] = [
  [-41.6, -48], [-40.0, -47.7], [-36.6, -44.4], [-36.0, -41.1], [-33, -34], [-30.5, -27], [-27.5, -21], [-22, -15], [-17, -9],
  [-13, -3], [-9.5, 3], [-5, 8.5], [1, 10.5], [8, 9.2], [14.6, 8.2], [16.7, 10.4], [19.7, 6.9], [21.6, 8.1], [20.1, 4.9],
  [22.8, 6.5], [24.2, 4.1], [26.6, 3.7], [24.5, 1.8], [27.8, 1.8], [31.6, 2.6], [33.6, 1.0],
];
const inside = (x: number, z: number, poly: P2[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i];
    const [xj, zj] = poly[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
};
const KWAN_BED: [number, number, number, number][] = [];
for (let x = -52; x <= 16; x += 2.5) for (let z = -42; z <= 26; z += 2.5) if (inside(x, z, KWAN)) KWAN_BED.push([x, z, 2.2, -1e9]);
const WAT_SI_KHOM_KHAM: P2 = [-13.2, -11.0];
const WAT_TILOK: P2 = [-2.4, 8.9];
// Wiang Phayao on its headland: the ring road (ถนนรอบเวียงประตูคลอง) and the moat traces on the north and east sides, kept
// inside the lake's shore (imagery 15 Nov 2026)
export const WIANG: P2[] = [[-7.6, -5.2], [-2.0, -6.3], [3.8, -5.5], [4.8, 0], [2.7, 2.4], [-1.8, 3.3], [-5.2, 1.8], [-6.8, -2.0]];

const shapeOf = (pts: P2[], c: P2 = [0, 0]) => {
  const sh = new THREE.Shape();
  pts.forEach(([x, z], i) => (i === 0 ? sh.moveTo(x - c[0], -(z - c[1])) : sh.lineTo(x - c[0], -(z - c[1]))));
  sh.closePath();
  return sh;
};
/** the lake: one flat shape, its top at the rivers' surface; spread from `c` by k */
const Lake: React.FC<{k?: number; c?: P2; lift?: number}> = ({k = 1, c = [0, 0], lift = 0}) => {
  const sh = React.useMemo(() => shapeOf(KWAN, c), [c]);
  if (k < 0.01) return null;
  return (
    <group position={[c[0], 0, c[1]]} scale={[k, 1, k]}>
      <mesh position={[0, -1.3 + lift, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <extrudeGeometry args={[sh, {depth: 1.4, bevelEnabled: false}]} />
        <meshStandardMaterial color="#3f8fc0" roughness={0.12} metalness={0.25} />
      </mesh>
    </group>
  );
};

const Puff: React.FC<{u: number; seed: number; S: number; color: string; n?: number}> = ({u, seed, S, color, n = 10}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.3 + hash(seed * 3 + i) * 0.5);
        return (
          <mesh key={i} position={[Math.cos(a) * sp * u, (0.4 + hash(seed * 7 + i) * 0.5) * sp * u, Math.sin(a) * sp * u]}
            scale={S * 0.08 * (1 - u) * (0.6 + hash(i + seed) * 0.6)}>
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1 - u} />
          </mesh>
        );
      })}
    </group>
  );
};

/** a small figure (white shirt, indigo pants), h tall, carrying a brick when `load` */
const Worker: React.FC<{h: number; load?: boolean; skin?: string}> = ({h, load, skin = '#8a5a3a'}) => (
  <group>
    <mesh position={[0, h * 0.22, 0]}>
      <boxGeometry args={[h * 0.26, h * 0.44, h * 0.18]} />
      <meshStandardMaterial color="#2c3560" roughness={0.9} />
    </mesh>
    <mesh position={[0, h * 0.62, 0]}>
      <boxGeometry args={[h * 0.32, h * 0.36, h * 0.2]} />
      <meshStandardMaterial color="#efe9da" roughness={0.9} />
    </mesh>
    <mesh position={[0, h * 0.9, 0]}>
      <sphereGeometry args={[h * 0.11, 8, 6]} />
      <meshStandardMaterial color={skin} roughness={0.8} />
    </mesh>
    {load && (
      <mesh position={[0, h * 1.06, 0]}>
        <boxGeometry args={[h * 0.34, h * 0.1, h * 0.18]} />
        <meshStandardMaterial color="#b4532d" roughness={0.9} />
      </mesh>
    )}
  </group>
);

// ---------- A1: Phra Chao Ton Luang, brick, stucco, gold ----------

const BRICK = '#b4532d';
const STUCCO = '#ece4d0';
const GOLD = '#d9a93c';
const BRICK_END = 1.7;
const STUCCO_END = 2.5;
const GOLD0 = 2.3;
const GOLD_END = 3.4;

type Part = {col: string; metal: number; rough: number};
/** a limb as a capsule from a to b */
const Limb: React.FC<{a: [number, number, number]; b: [number, number, number]; r: number; p: Part}> = ({a, b, r, p}) => {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const mid = A.clone().add(B).multiplyScalar(0.5);
  const dir = B.clone().sub(A);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return (
    <mesh position={mid} quaternion={q} castShadow>
      <capsuleGeometry args={[r, dir.length(), 4, 10]} />
      <meshStandardMaterial color={p.col} roughness={p.rough} metalness={p.metal} />
    </mesh>
  );
};

const TonLuang: React.FC<{t: number; S: number}> = ({t, S}) => {
  // heights as a share of S (the top of the flame finial = 1)
  const brick = 0.57 + 0.43 * smooth(clamp01(t / BRICK_END)); // frame 0: brick laid to the chin, no head yet
  const stucco = 0.26 + 0.74 * smooth(clamp01(t / STUCCO_END)); // frame 0: the pedestal and the lap are white
  const gold = smooth(clamp01((t - GOLD0) / (GOLD_END - GOLD0)));
  const scaffold = 1 - smooth(clamp01((t - STUCCO_END + 0.2) / 0.6));
  /** a part whose base is at y0 and top at y1 (share of S): shown once the brick front passes its base, grown up to the
   *  front; coloured by the stucco and gold fronts at its middle */
  const part = (y0: number, y1: number) => {
    if (brick <= y0) return null;
    const grown = clamp01((brick - y0) / Math.max(0.001, y1 - y0));
    const mid = y0 + (y1 - y0) * 0.5;
    const col = gold > 0 && mid < gold ? GOLD : mid < stucco ? STUCCO : BRICK;
    return {grown, col, metal: col === GOLD ? 0.55 : 0, rough: col === BRICK ? 0.95 : col === GOLD ? 0.35 : 0.7};
  };
  const M: React.FC<{p: NonNullable<ReturnType<typeof part>>}> = ({p}) => (
    <meshStandardMaterial color={p.col} roughness={p.rough} metalness={p.metal} />
  );
  type Spec = {y0: number; y1: number; el: (p: NonNullable<ReturnType<typeof part>>) => React.ReactNode};
  const y = (v: number) => v * S;
  const specs: Spec[] = [
    // the pedestal: three octagonal tiers and a lotus row
    {y0: 0, y1: 0.05, el: (p) => (
      <mesh position={[0, y(0.025), 0]} castShadow receiveShadow><cylinderGeometry args={[y(0.42), y(0.45), y(0.05), 8]} /><M p={p} /></mesh>
    )},
    {y0: 0.05, y1: 0.09, el: (p) => (
      <mesh position={[0, y(0.07), 0]} castShadow><cylinderGeometry args={[y(0.39), y(0.41), y(0.04), 8]} /><M p={p} /></mesh>
    )},
    {y0: 0.09, y1: 0.13, el: (p) => (
      <group position={[0, y(0.11), 0]}>
        <mesh castShadow><cylinderGeometry args={[y(0.43), y(0.4), y(0.04), 24]} /><M p={p} /></mesh>
        {Array.from({length: 22}, (_, i) => {
          const a = (i / 22) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.sin(a) * y(0.425), y(0.01), Math.cos(a) * y(0.425)]} rotation-y={a} scale={[y(0.05), y(0.035), y(0.02)]}>
              <sphereGeometry args={[1, 8, 6]} /><M p={p} />
            </mesh>
          );
        })}
      </group>
    )},
    // the crossed legs (the lap), the right knee forward
    {y0: 0.13, y1: 0.25, el: (p) => (
      <group>
        <mesh position={[0, y(0.18), y(0.04)]} scale={[y(0.38), y(0.065), y(0.2)]} castShadow><sphereGeometry args={[1, 24, 14]} /><M p={p} /></mesh>
        <mesh position={[y(-0.2), y(0.18), y(0.12)]} scale={[y(0.13), y(0.06), y(0.1)]} castShadow><sphereGeometry args={[1, 14, 10]} /><M p={p} /></mesh>
        <mesh position={[y(0.2), y(0.18), y(0.12)]} scale={[y(0.13), y(0.06), y(0.1)]} castShadow><sphereGeometry args={[1, 14, 10]} /><M p={p} /></mesh>
      </group>
    )},
    // the waist and the left hand in the lap
    {y0: 0.22, y1: 0.33, el: (p) => (
      <group>
        <mesh position={[0, y(0.28), y(-0.02)]} scale={[1, 1, 0.72]} castShadow><cylinderGeometry args={[y(0.15), y(0.19), y(0.12), 20]} /><M p={p} /></mesh>
        <mesh position={[y(0.03), y(0.255), y(0.13)]} scale={[y(0.09), y(0.025), y(0.05)]} castShadow><sphereGeometry args={[1, 10, 8]} /><M p={p} /></mesh>
      </group>
    )},
    // the chest
    {y0: 0.33, y1: 0.5, el: (p) => (
      <mesh position={[0, y(0.415), y(-0.03)]} scale={[1, 1, 0.66]} castShadow><cylinderGeometry args={[y(0.17), y(0.15), y(0.17), 20]} /><M p={p} /></mesh>
    )},
    // the robe's flap over the left shoulder
    {y0: 0.3, y1: 0.55, el: (p) => (
      <mesh position={[y(0.07), y(0.43), y(0.075)]} rotation-z={-0.12} castShadow><boxGeometry args={[y(0.06), y(0.24), y(0.012)]} /><M p={p} /></mesh>
    )},
    // the arms: the left forearm into the lap; the right hand down over the right knee, calling the earth (the Buddha's
    // right is -x, the viewer's left)
    {y0: 0.3, y1: 0.52, el: (p) => (
      <group>
        <Limb a={[y(0.21), y(0.49), y(-0.03)]} b={[y(0.26), y(0.33), y(0.0)]} r={y(0.048)} p={p} />
        <Limb a={[y(-0.21), y(0.49), y(-0.03)]} b={[y(-0.26), y(0.33), y(0.0)]} r={y(0.048)} p={p} />
        <Limb a={[y(0.26), y(0.33), y(0.0)]} b={[y(0.05), y(0.255), y(0.13)]} r={y(0.04)} p={p} />
        <Limb a={[y(-0.26), y(0.33), y(0.0)]} b={[y(-0.25), y(0.2), y(0.2)]} r={y(0.04)} p={p} />
        <Limb a={[y(-0.25), y(0.2), y(0.2)]} b={[y(-0.26), y(0.14), y(0.25)]} r={y(0.03)} p={p} />
        <mesh position={[y(0.02), y(0.25), y(0.14)]} scale={[y(0.06), y(0.02), y(0.04)]}><sphereGeometry args={[1, 10, 8]} /><M p={p} /></mesh>
      </group>
    )},
    // the shoulders
    {y0: 0.48, y1: 0.55, el: (p) => (
      <mesh position={[0, y(0.505), y(-0.03)]} scale={[y(0.24), y(0.05), y(0.11)]} castShadow><sphereGeometry args={[1, 20, 12]} /><M p={p} /></mesh>
    )},
    // the neck
    {y0: 0.54, y1: 0.6, el: (p) => (
      <mesh position={[0, y(0.57), y(-0.02)]} castShadow><cylinderGeometry args={[y(0.05), y(0.06), y(0.06), 12]} /><M p={p} /></mesh>
    )},
    // the face and the ears
    {y0: 0.59, y1: 0.76, el: (p) => (
      <group position={[0, y(0.675), y(-0.01)]}>
        <mesh scale={[y(0.095), y(0.11), y(0.095)]} castShadow><sphereGeometry args={[1, 20, 16]} /><M p={p} /></mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * y(0.095), y(-0.02), 0]} scale={[y(0.016), y(0.08), y(0.032)]}><sphereGeometry args={[1, 8, 6]} /><M p={p} /></mesh>
        ))}
        <mesh position={[0, y(-0.005), y(0.093)]} scale={[y(0.013), y(0.032), y(0.013)]}><sphereGeometry args={[1, 6, 6]} /><M p={p} /></mesh>
      </group>
    )},
    // the curls and the ushnisha
    {y0: 0.72, y1: 0.86, el: (p) => (
      <group>
        <mesh position={[0, y(0.73), y(-0.015)]} scale={[y(0.098), y(0.066), y(0.098)]} castShadow><icosahedronGeometry args={[1, 2]} /><M p={p} /></mesh>
        <mesh position={[0, y(0.8), y(-0.015)]} scale={[y(0.05), y(0.055), y(0.05)]} castShadow><icosahedronGeometry args={[1, 2]} /><M p={p} /></mesh>
      </group>
    )},
    // the flame finial
    {y0: 0.85, y1: 1, el: (p) => (
      <mesh position={[0, y(0.925), y(-0.015)]} castShadow><coneGeometry args={[y(0.03), y(0.15), 10]} /><M p={p} /></mesh>
    )},
  ];
  // the scaffold: bamboo posts round the unfinished part, platforms, and people on them
  const posts: P2[] = [[-0.34, 0.1], [0.34, 0.1], [-0.34, -0.2], [0.34, -0.2], [-0.15, -0.26], [0.15, -0.26]];
  const top = Math.min(0.8, brick + 0.02);
  const deck = (k: number) => 0.28 + k * 0.16;
  return (
    <group>
      {specs.map((s, i) => {
        const p = part(s.y0, s.y1);
        if (!p) return null;
        const g = smooth(p.grown);
        return (
          <group key={i} position={[0, y(s.y0) * (1 - g), 0]} scale={[1, Math.max(0.02, g), 1]}>
            {s.el(p)}
          </group>
        );
      })}
      {scaffold > 0.02 && (
        <group position={[0, -(1 - scaffold) * y(0.6), 0]}>
          {posts.map(([px, pz], i) => (
            <mesh key={i} position={[y(px), y((0.26 + top) / 2), y(pz)]} castShadow>
              <cylinderGeometry args={[y(0.006), y(0.006), y(top - 0.26), 6]} />
              <meshStandardMaterial color="#c9b06a" roughness={0.8} />
            </mesh>
          ))}
          {[0, 1, 2, 3].map((k) =>
            deck(k) < top ? (
              <group key={k}>
                {[[-0.34, -0.05], [0.34, -0.05]].map(([dx, dz], j) => (
                  <mesh key={j} position={[y(dx), y(deck(k)), y(dz)]}>
                    <boxGeometry args={[y(0.06), y(0.008), y(0.36)]} />
                    <meshStandardMaterial color="#a88d4e" roughness={0.85} />
                  </mesh>
                ))}
              </group>
            ) : null,
          )}
          {/* people: carrying bricks up along the front deck, laying them at the front */}
          {Array.from({length: 7}, (_, i) => {
            const k = Math.min(3, Math.floor(i / 2));
            const dy = deck(k);
            if (dy > top) return null;
            const ph = (t * 0.55 + hash(i) ) % 1;
            const zz = (ph < 0.5 ? ph * 2 : 2 - ph * 2) * 0.3 - 0.2;
            return (
              <group key={i} position={[y(i % 2 === 0 ? 0.34 : -0.34), y(dy) + y(0.004), y(zz)]} rotation-y={ph < 0.5 ? 0 : Math.PI}>
                <Worker h={y(0.07)} load={ph < 0.5} />
              </group>
            );
          })}
        </group>
      )}
      {/* the brick front's dust while it climbs */}
      {t < BRICK_END && (
        <group position={[0, y(brick), y(0.05)]}>
          <Puff u={(t * 3) % 1} seed={Math.floor(t * 3)} S={y(0.12)} color="#e2a77e" n={6} />
        </group>
      )}
    </group>
  );
};

// ---------- A2: Wat Tilok Aram's chedi, built, then drowned by the Kwan ----------

const CHEDI_BRICK_END = 1.4;
const CHEDI_STUCCO_END = 2.0;
const FLOOD0 = 2.0;
const FLOOD_END = 3.4;

const Chedi: React.FC<{t: number; S: number; sink: number}> = ({t, S, sink}) => {
  const brick = 0.48 + 0.52 * smooth(clamp01(t / CHEDI_BRICK_END)); // frame 0: the bell half laid
  const stucco = 0.2 + 0.8 * smooth(clamp01(t / CHEDI_STUCCO_END));
  const y = (v: number) => v * S;
  // tiers: [y0, y1, radius at the bottom, radius at the top, sides]
  const tiers: [number, number, number, number, number][] = [
    [0, 0.08, 0.36, 0.36, 4],
    [0.08, 0.14, 0.3, 0.3, 4],
    [0.14, 0.19, 0.25, 0.25, 4],
    [0.19, 0.25, 0.22, 0.2, 8],
    [0.25, 0.29, 0.19, 0.18, 8],
    [0.29, 0.33, 0.17, 0.17, 24],
    [0.33, 0.52, 0.17, 0.12, 24], // the bell
    [0.52, 0.58, 0.07, 0.07, 4], // the harmika
    [0.58, 0.83, 0.06, 0.01, 16], // the rings and the spire
    [0.83, 0.92, 0.012, 0.004, 8],
  ];
  return (
    <group position={[0, -sink * y(0.42), 0]}>
      {tiers.map(([a, b, r0, r1, n], i) => {
        if (brick <= a) return null;
        const g = smooth(clamp01((brick - a) / (b - a)));
        const mid = (a + b) / 2;
        const col = mid < stucco ? '#ede6d6' : BRICK;
        const bell = i === 6;
        return (
          <group key={i} position={[0, y(a), 0]} scale={[1, Math.max(0.02, g), 1]}>
            {bell ? (
              <mesh position={[0, y((b - a) / 2), 0]} scale={[1, (b - a) / (2 * 0.17), 1]} castShadow>
                <sphereGeometry args={[y(0.17), 24, 14, 0, Math.PI * 2, 0, Math.PI / 2 + 0.25]} />
                <meshStandardMaterial color={col} roughness={col === BRICK ? 0.95 : 0.7} />
              </mesh>
            ) : (
              <mesh position={[0, y((b - a) / 2), 0]} rotation-y={n === 4 ? Math.PI / 4 : 0} castShadow receiveShadow>
                <cylinderGeometry args={[y(r1) * (n === 4 ? 1.41 : 1), y(r0) * (n === 4 ? 1.41 : 1), y(b - a), n]} />
                <meshStandardMaterial color={col} roughness={col === BRICK ? 0.95 : 0.7} />
              </mesh>
            )}
          </group>
        );
      })}
      {brick > 0.9 && (
        <mesh position={[0, y(0.93), 0]}>
          <sphereGeometry args={[y(0.012), 8, 6]} />
          <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
        </mesh>
      )}
      {/* the builders on the terraces while the brick goes up */}
      {t < CHEDI_STUCCO_END &&
        Array.from({length: 6}, (_, i) => {
          const a = (i / 6) * Math.PI * 2 + t * 0.6;
          const lvl = i % 3;
          const r = [0.33, 0.27, 0.22][lvl];
          const h = [0.08, 0.14, 0.19][lvl];
          return (
            <group key={i} position={[Math.sin(a) * y(r), y(h), Math.cos(a) * y(r)]} rotation-y={a + Math.PI / 2}>
              <Worker h={y(0.05)} load={i % 2 === 0} />
            </group>
          );
        })}
      {t < CHEDI_BRICK_END && (
        <group position={[0, y(brick), 0]}>
          <Puff u={(t * 3) % 1} seed={Math.floor(t * 3)} S={y(0.1)} color="#e2a77e" n={6} />
        </group>
      )}
    </group>
  );
};

const Tilok: React.FC<{t: number; S: number; c: P2}> = ({t, S, c}) => {
  const flood = smooth(clamp01((t - FLOOD0) / (FLOOD_END - FLOOD0)));
  return (
    <group>
      <Lake k={flood} c={c} />
      <group position={[c[0], 0, c[1]]}>
        <Chedi t={t} S={S} sink={flood} />
        {flood > 0.02 && flood < 0.98 && (
          <group position={[0, 0.2, 0]}>
            {[0, 1, 2].map((k) => (
              <mesh key={k} rotation-x={-Math.PI / 2} position={[0, 0.05 * k, 0]}>
                <ringGeometry args={[S * (0.3 + ((t * 0.6 + k / 3) % 1) * 0.4), S * (0.31 + ((t * 0.6 + k / 3) % 1) * 0.4), 48]} />
                <meshBasicMaterial color="#e8f4ff" toneMapped={false} transparent opacity={0.5 * (1 - ((t * 0.6 + k / 3) % 1))} />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </group>
  );
};

// ---------- B: a giant pla buek leaps out of the Kwan ----------

const PlaBuek: React.FC<{t: number; S: number}> = ({t, S}) => {
  // a 2.6-s leap from frame 0: up out of the water (it is already half out at frame 0), over, and back in
  const T = 3.8;
  const u = clamp01((t + 0.7) / T);
  const x = (u - 0.5) * S * 0.9;
  const h = Math.sin(u * Math.PI) * S * 0.42;
  const pitch = Math.cos(u * Math.PI) * 0.9;
  const tail = Math.sin(t * 9) * 0.25;
  const y = (v: number) => v * S;
  const BODY = '#7c8794';
  const BELLY = '#dfe3e6';
  return (
    <group>
      {u < 1 && (
        <group position={[x, h - y(0.05), 0]} rotation-z={pitch}>
          {/* the body: long, scaleless, grey on top, white below */}
          <mesh scale={[y(0.36), y(0.1), y(0.11)]} castShadow><sphereGeometry args={[1, 28, 16]} />
            <meshStandardMaterial color={BODY} roughness={0.45} metalness={0.15} />
          </mesh>
          <mesh position={[0, y(-0.035), 0]} scale={[y(0.33), y(0.07), y(0.095)]}><sphereGeometry args={[1, 24, 12]} />
            <meshStandardMaterial color={BELLY} roughness={0.5} />
          </mesh>
          {/* the broad flat head, the low small eye */}
          <mesh position={[y(0.3), y(-0.01), 0]} scale={[y(0.12), y(0.08), y(0.1)]}><sphereGeometry args={[1, 18, 12]} />
            <meshStandardMaterial color={BODY} roughness={0.45} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[y(0.36), y(-0.03), s * y(0.07)]}><sphereGeometry args={[y(0.012), 8, 6]} />
              <meshStandardMaterial color="#111" roughness={0.3} />
            </mesh>
          ))}
          {/* the dorsal fin, the tail */}
          <mesh position={[y(0.06), y(0.12), 0]} rotation-z={-0.4}><boxGeometry args={[y(0.08), y(0.1), y(0.01)]} />
            <meshStandardMaterial color={BODY} roughness={0.5} />
          </mesh>
          <group position={[y(-0.36), 0, 0]} rotation-y={tail}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[y(-0.06), s * y(0.06), 0]} rotation-z={s * 0.6}><boxGeometry args={[y(0.14), y(0.05), y(0.012)]} />
                <meshStandardMaterial color={BODY} roughness={0.5} />
              </mesh>
            ))}
          </group>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[y(0.18), y(-0.07), s * y(0.1)]} rotation-x={s * 0.6}><boxGeometry args={[y(0.08), y(0.01), y(0.06)]} />
              <meshStandardMaterial color={BODY} roughness={0.5} />
            </mesh>
          ))}
        </group>
      )}
      {/* splashes where it left the water and where it goes back in */}
      <group position={[-S * 0.45, 0.2, 0]}>
        <Puff u={clamp01((t + 0.7) / 1.2)} seed={3} S={y(0.35)} color="#e8f6ff" n={16} />
      </group>
      <group position={[S * 0.45, 0.2, 0]}>
        <Puff u={clamp01((t - T + 0.7) / 1.2)} seed={7} S={y(0.45)} color="#e8f6ff" n={20} />
      </group>
    </group>
  );
};

const AZ = 78; // from the east, looking west across the town to the Kwan and the Phi Pan Nam range

const keys = (target: [number, number, number], d: [number, number, number], el: number, year: number) =>
  buildStory({
    duration: 60,
    before: 1100,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [year, year + 0.4],
        camera: [
          [0, target[0], target[1], target[2], d[0], AZ, el, 30],
          [3, target[0], target[1], target[2], d[1], AZ + 6, el + 1, 30],
          [8, target[0], target[1], target[2], d[2], AZ + 14, el + 3, 30],
        ],
      },
    ],
  });

const base = (id: string, sub: string, Hero: React.FC<{t: number}>, at: P2, ty: number, d: [number, number, number], el: number,
  clear: number, year: number, lake: boolean, noHouses = false): CityConfig => {
  const STORY = keys([at[0], ty, at[1]], d, el, year);
  const L: React.FC<LandmarkProps> = ({t}) => (
    <group>
      {lake && <Lake />}
      <Hero t={t} />
    </group>
  );
  return {
    ...KORAT,
    id,
    look: 'shader',
    story: {
      captions: [],
      eras: [],
      yearAt: STORY.yearAt,
      beat: STORY.beat,
      beats: STORY.beats,
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'พะเยา', sub},
      finale: KORAT.story.finale,
      approxBefore: 1100,
    },
    layout: {
      ...KORAT.layout,
      tile: {x0: -62, x1: 34, z0: -48, z1: 48},
      // the Phi Pan Nam range behind the Kwan to the west
      peaks: [
        [-58, -34, 10, 10],
        [-60, -12, 11, 12],
        [-58, 10, 10, 9],
        [-57, 34, 10, 8],
        [-46, 44, 8, 6],
      ],
      rivers: [{path: ING, width: 1.4}],
      bridges: [],
      city: {...KORAT.layout.city, hx: 7, hz: 6.5, outline: WIANG},
      gates: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      houses: {...KORAT.layout.houses, modern: [3000, 1], ...(noHouses ? {built: [3000, 1] as [number, number]} : {})},
      // no modern sprawl in a style frame (it would build on the lake)
      urban: {...KORAT.layout.urban, from: 3000},
      villages: {centers: [[-2, -1], [10, -14], [-24, 30], [20, 22], [16, -32]], built: [700, 900]},
      clearings: [
        [at[0], at[1], clear, -1e9],
        // the Kwan's bed: marsh and paddy before the weir, water after; no trees on it either way
        ...KWAN_BED,
      ],
      sites: [],
      openGround: [],
      roads: [],
      towers: [],
      cameraKeys: STORY.cameraKeys,
    },
    Landmarks: L,
    callouts: [],
    actors: [],
    gloom: () => 0,
  };
};

const tonLuangAt: P2 = WAT_SI_KHOM_KHAM;
// legend scale: the Buddha ~46 units to the finial (the real one is ~16 m)
export const PHAYAO_A1 = base('phayao-a1', 'พระเจ้าตนหลวง ริมกว๊านพะเยา', ({t}) => (
  <group position={[tonLuangAt[0], 0, tonLuangAt[1]]} rotation-y={(AZ * Math.PI) / 180}>
    <TonLuang t={t} S={56} />
  </group>
), tonLuangAt, 34, [250, 258, 285], 30, 28, 1491, false);
// A2: the chedi ~50 units to the finial, on the Ing's bank where the lake is today
export const PHAYAO_A2 = base('phayao-a2', 'วัดติโลกอาราม วัดที่จมกลางกว๊าน', ({t}) => <Tilok t={t} S={52} c={WAT_TILOK} />,
  WAT_TILOK, 27, [250, 258, 285], 32, 24, 1476, false);
// B: the fish ~45 units long over the Kwan
export const PHAYAO_B = base('phayao-b', 'ปลาบึก กว๊านพะเยา', ({t}) => (
  <group position={[-37, 0, -7.5]} rotation-y={(AZ * Math.PI) / 180}>
    <PlaBuek t={t} S={50} />
  </group>
), [-30, -6], 14, [250, 258, 285], 32, 24, 1960, true, true);
