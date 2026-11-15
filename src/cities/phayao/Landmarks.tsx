import React from 'react';
import * as THREE from 'three';
import type {LandmarkProps} from '../../engine/types';
import {Cart, Walker} from '../nan/figures';
import {
  BOATS, CARRIERS, CARTS, CIRCLERS, FOUND_HOUSES, GATE_WORKERS, LEAVERS, MARCHERS, PILGRIMS, SETTLERS, boatAt, buddhaS,
  buildFronts, cartAt, carrierAt, circlerAt, clamp01, fillK, foundHouseK, gateK, leaverAt, marcherAt, monumentK, payoffK,
  pilgrimAt, settlerAt, sinkK, smooth, vihK,
} from './actors';
import {FACE, GATE, KWAN, MONUMENT, VIHARA_C, VIHARA_L, VIHARA_ROT, VIHARA_W, WAT_SI_KHOM_KHAM, WAT_TILOK} from './places';
import {STORY} from './timeline';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const WATER = '#3f8fc0';
const BRICK = '#b4532d';
const STUCCO = '#ece4d0';
const GOLD = '#d9a93c';
const LANNA_RED = '#8e2a22';
const TILE_ROOF = '#7a3b22';

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; r?: number; m?: number}> = ({p, s, c, r = 0, m = 0}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} metalness={m} />
  </mesh>
);

/** a puff that bursts out and fades, self-lit (dust) */
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

/** a candle flame, self-lit */
const Flame: React.FC<{s?: number}> = ({s = 0.06}) => (
  <mesh>
    <sphereGeometry args={[s, 6, 5]} />
    <meshBasicMaterial color="#ffc861" toneMapped={false} />
  </mesh>
);

// ------------------------------------------------------------------ the Kwan
const shapeOf = (pts: [number, number][]) => {
  const sh = new THREE.Shape();
  pts.forEach(([x, z], i) => (i === 0 ? sh.moveTo(x, -z) : sh.lineTo(x, -z)));
  sh.closePath();
  return sh;
};
const KWAN_SHAPE = shapeOf(KWAN);
/** the lake rises over the marsh and the paddies in the lake beat; its top settles just over the rivers' surface */
const Kwan: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = fillK(t, Y);
  if (k < 0.01) return null;
  return (
    <mesh position={[0, -1.28 - 0.3 * (1 - k), 0]} rotation-x={-Math.PI / 2} receiveShadow>
      <extrudeGeometry args={[KWAN_SHAPE, {depth: 1.4, bevelEnabled: false}]} />
      <meshStandardMaterial color={WATER} roughness={0.12} metalness={0.25} />
    </mesh>
  );
};

// ------------------------------------------------------------------ the Buddha (the cover, then on its site)
type Part = {col: string; metal: number; rough: number};
const Limb: React.FC<{a: [number, number, number]; b: [number, number, number]; r: number; p: Part}> = ({a, b, r, p}) => {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const dir = B.clone().sub(A);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return (
    <mesh position={A.clone().add(B).multiplyScalar(0.5)} quaternion={q} castShadow>
      <capsuleGeometry args={[r, dir.length(), 4, 10]} />
      <meshStandardMaterial color={p.col} roughness={p.rough} metalness={p.metal} />
    </mesh>
  );
};
/** a small builder (white shirt, indigo pants), h tall, carrying a brick when `load` */
const Builder: React.FC<{h: number; load?: boolean}> = ({h, load}) => (
  <group>
    <Box p={[0, h * 0.22, 0]} s={[h * 0.26, h * 0.44, h * 0.18]} c="#2c3560" />
    <Box p={[0, h * 0.62, 0]} s={[h * 0.32, h * 0.36, h * 0.2]} c="#efe9da" />
    <mesh position={[0, h * 0.9, 0]}>
      <sphereGeometry args={[h * 0.11, 8, 6]} />
      <meshStandardMaterial color="#8a5a3a" roughness={0.8} />
    </mesh>
    {load && <Box p={[0, h * 1.06, 0]} s={[h * 0.34, h * 0.1, h * 0.18]} c={BRICK} />}
  </group>
);

const TonLuang: React.FC<{t: number; S: number}> = ({t, S}) => {
  const f = buildFronts(t);
  const part = (y0: number, y1: number): (Part & {grown: number}) | null => {
    if (f.brick <= y0) return null;
    const grown = clamp01((f.brick - y0) / Math.max(0.001, y1 - y0));
    const mid = (y0 + y1) / 2;
    const col = f.gold > 0 && mid < f.gold ? GOLD : mid < f.stucco ? STUCCO : BRICK;
    return {grown, col, metal: col === GOLD ? 0.55 : 0, rough: col === BRICK ? 0.95 : col === GOLD ? 0.35 : 0.7};
  };
  const M: React.FC<{p: Part}> = ({p}) => <meshStandardMaterial color={p.col} roughness={p.rough} metalness={p.metal} />;
  const y = (v: number) => v * S;
  const specs: {y0: number; y1: number; el: (p: Part) => React.ReactNode}[] = [
    {y0: 0, y1: 0.05, el: (p) => <mesh position={[0, y(0.025), 0]} castShadow receiveShadow><cylinderGeometry args={[y(0.42), y(0.45), y(0.05), 8]} /><M p={p} /></mesh>},
    {y0: 0.05, y1: 0.09, el: (p) => <mesh position={[0, y(0.07), 0]} castShadow><cylinderGeometry args={[y(0.39), y(0.41), y(0.04), 8]} /><M p={p} /></mesh>},
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
    {y0: 0.13, y1: 0.25, el: (p) => (
      <group>
        <mesh position={[0, y(0.18), y(0.04)]} scale={[y(0.38), y(0.065), y(0.2)]} castShadow><sphereGeometry args={[1, 24, 14]} /><M p={p} /></mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * y(0.2), y(0.18), y(0.12)]} scale={[y(0.13), y(0.06), y(0.1)]} castShadow><sphereGeometry args={[1, 14, 10]} /><M p={p} /></mesh>
        ))}
      </group>
    )},
    {y0: 0.22, y1: 0.33, el: (p) => <mesh position={[0, y(0.28), y(-0.02)]} scale={[1, 1, 0.72]} castShadow><cylinderGeometry args={[y(0.15), y(0.19), y(0.12), 20]} /><M p={p} /></mesh>},
    {y0: 0.33, y1: 0.5, el: (p) => <mesh position={[0, y(0.415), y(-0.03)]} scale={[1, 1, 0.66]} castShadow><cylinderGeometry args={[y(0.17), y(0.15), y(0.17), 20]} /><M p={p} /></mesh>},
    {y0: 0.3, y1: 0.55, el: (p) => <mesh position={[y(0.07), y(0.43), y(0.075)]} rotation-z={-0.12} castShadow><boxGeometry args={[y(0.06), y(0.24), y(0.012)]} /><M p={p} /></mesh>},
    // the arms: the left hand in the lap, the right hand over the right knee calling the earth (the Buddha's right is -x)
    {y0: 0.3, y1: 0.52, el: (p) => (
      <group>
        <Limb a={[y(0.21), y(0.49), y(-0.03)]} b={[y(0.26), y(0.33), 0]} r={y(0.048)} p={p} />
        <Limb a={[y(-0.21), y(0.49), y(-0.03)]} b={[y(-0.26), y(0.33), 0]} r={y(0.048)} p={p} />
        <Limb a={[y(0.26), y(0.33), 0]} b={[y(0.05), y(0.255), y(0.13)]} r={y(0.04)} p={p} />
        <Limb a={[y(-0.26), y(0.33), 0]} b={[y(-0.25), y(0.2), y(0.2)]} r={y(0.04)} p={p} />
        <Limb a={[y(-0.25), y(0.2), y(0.2)]} b={[y(-0.26), y(0.14), y(0.25)]} r={y(0.03)} p={p} />
        <mesh position={[y(0.02), y(0.25), y(0.14)]} scale={[y(0.06), y(0.02), y(0.04)]}><sphereGeometry args={[1, 10, 8]} /><M p={p} /></mesh>
      </group>
    )},
    {y0: 0.48, y1: 0.55, el: (p) => <mesh position={[0, y(0.505), y(-0.03)]} scale={[y(0.24), y(0.05), y(0.11)]} castShadow><sphereGeometry args={[1, 20, 12]} /><M p={p} /></mesh>},
    {y0: 0.54, y1: 0.6, el: (p) => <mesh position={[0, y(0.57), y(-0.02)]} castShadow><cylinderGeometry args={[y(0.05), y(0.06), y(0.06), 12]} /><M p={p} /></mesh>},
    {y0: 0.59, y1: 0.76, el: (p) => (
      <group position={[0, y(0.675), y(-0.01)]}>
        <mesh scale={[y(0.095), y(0.11), y(0.095)]} castShadow><sphereGeometry args={[1, 20, 16]} /><M p={p} /></mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * y(0.095), y(-0.02), 0]} scale={[y(0.016), y(0.08), y(0.032)]}><sphereGeometry args={[1, 8, 6]} /><M p={p} /></mesh>
        ))}
        <mesh position={[0, y(-0.005), y(0.093)]} scale={[y(0.013), y(0.032), y(0.013)]}><sphereGeometry args={[1, 6, 6]} /><M p={p} /></mesh>
      </group>
    )},
    {y0: 0.72, y1: 0.86, el: (p) => (
      <group>
        <mesh position={[0, y(0.73), y(-0.015)]} scale={[y(0.098), y(0.066), y(0.098)]} castShadow><icosahedronGeometry args={[1, 2]} /><M p={p} /></mesh>
        <mesh position={[0, y(0.8), y(-0.015)]} scale={[y(0.05), y(0.055), y(0.05)]} castShadow><icosahedronGeometry args={[1, 2]} /><M p={p} /></mesh>
      </group>
    )},
    {y0: 0.85, y1: 1, el: (p) => <mesh position={[0, y(0.925), y(-0.015)]} castShadow><coneGeometry args={[y(0.03), y(0.15), 10]} /><M p={p} /></mesh>},
  ];
  const posts: [number, number][] = [[-0.34, 0.1], [0.34, 0.1], [-0.34, -0.2], [0.34, -0.2], [-0.15, -0.26], [0.15, -0.26]];
  const top = Math.min(0.8, f.brick + 0.02);
  const deck = (k: number) => 0.28 + k * 0.16;
  return (
    <group>
      {specs.map((s, i) => {
        const p = part(s.y0, s.y1);
        if (!p) return null;
        const g = smooth(p.grown);
        if (g < 0.02) return null;
        return (
          <group key={i} position={[0, y(s.y0) * (1 - g), 0]} scale={[1, g, 1]}>
            {s.el(p)}
          </group>
        );
      })}
      {f.scaffold > 0.02 && (
        <group position={[0, -(1 - f.scaffold) * y(0.6), 0]}>
          {posts.map(([px, pz], i) => (
            <mesh key={i} position={[y(px), y((0.26 + top) / 2), y(pz)]} castShadow>
              <cylinderGeometry args={[y(0.006), y(0.006), y(top - 0.26), 6]} />
              <meshStandardMaterial color="#c9b06a" roughness={0.8} />
            </mesh>
          ))}
          {[0, 1, 2, 3].map((k) =>
            deck(k) < top ? (
              <group key={k}>
                {[-0.34, 0.34].map((dx) => (
                  <Box key={dx} p={[y(dx), y(deck(k)), y(-0.05)]} s={[y(0.06), y(0.008), y(0.36)]} c="#a88d4e" />
                ))}
              </group>
            ) : null,
          )}
          {Array.from({length: 7}, (_, i) => {
            const k = Math.min(3, Math.floor(i / 2));
            const dy = deck(k);
            if (dy > top) return null;
            const ph = (t * 0.55 + hash(i)) % 1;
            const zz = (ph < 0.5 ? ph * 2 : 2 - ph * 2) * 0.3 - 0.2;
            return (
              <group key={i} position={[y(i % 2 === 0 ? 0.34 : -0.34), y(dy) + y(0.004), y(zz)]} rotation-y={ph < 0.5 ? 0 : Math.PI}>
                <Builder h={y(0.07)} load={ph < 0.5} />
              </group>
            );
          })}
        </group>
      )}
      {t < BRICK_SHOW && (
        <group position={[0, y(f.brick), y(0.05)]}>
          <Puff u={(t * 3) % 1} seed={Math.floor(t * 3)} S={y(0.12)} color="#e2a77e" n={6} />
        </group>
      )}
    </group>
  );
};
const BRICK_SHOW = 1.7;

// ------------------------------------------------------------------ the open vihara (Khruba Sriwichai's, 2466)
const Vihara: React.FC<{k: number}> = ({k}) => {
  if (k < 0.02) return null;
  const L = VIHARA_L;
  const W = VIHARA_W;
  const posts = smooth(k / 0.45);
  const roof = smooth((k - 0.45) / 0.45);
  const H = 1.5;
  return (
    <group>
      {/* the platform, grown outward */}
      <group scale={[smooth(k / 0.15), 1, smooth(k / 0.15)]}>
        <Box p={[0, 0.08, 0]} s={[L + 0.2, 0.16, W + 0.2]} c="#d8d0bc" />
      </group>
      {/* red posts round the sides (the front is open) */}
      {posts > 0.02 &&
        [-1, -0.33, 0.33, 1].flatMap((fx) =>
          [-1, 1].map((sz) => (
            <group key={`${fx}${sz}`} position={[(fx * L) / 2.15, 0.16, (sz * W) / 2.15]} scale={[1, posts, 1]}>
              <Box p={[0, H / 2, 0]} s={[0.1, H, 0.1]} c={LANNA_RED} />
            </group>
          )),
        )}
      {/* the back wall behind the Buddha */}
      {posts > 0.02 && (
        <group position={[-L / 2 + 0.05, 0.16, 0]} scale={[1, posts, 1]}>
          <Box p={[0, H / 2, 0]} s={[0.1, H, W * 0.9]} c="#f0e8d8" />
        </group>
      )}
      {/* the Lanna roof: two tiers of steep gables along the ridge (front to back), a gold finial at each gable */}
      {roof > 0.02 && (
        <group position={[0, 0.16 + H + (1 - roof) * 1.2, 0]} scale={[1, Math.max(0.02, roof), 1]}>
          {[
            [0, 0, W * 0.62, L + 0.5],
            [0.55, 0, W * 0.42, L * 0.8],
          ].map(([dy, , halfW, len], j) => (
            <group key={j} position={[0, dy, 0]}>
              {[-1, 1].map((s) => (
                <mesh key={s} position={[0, 0.32, (s * halfW) / 2]} rotation-x={s * 0.75} castShadow>
                  <boxGeometry args={[len, 0.07, halfW * 1.2]} />
                  <meshStandardMaterial color={TILE_ROOF} roughness={0.8} />
                </mesh>
              ))}
              {[-1, 1].map((s) => (
                <mesh key={`f${s}`} position={[(s * len) / 2, 0.75, 0]}>
                  <coneGeometry args={[0.05, 0.4, 6]} />
                  <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ Wat Tilok Aram's chedi, drowned by the Kwan
const TILOK_S = 1.8;
const Chedi: React.FC<{sink: number}> = ({sink}) => {
  const S = TILOK_S;
  const y = (v: number) => v * S;
  const tiers: [number, number, number, number, number][] = [
    [0, 0.08, 0.36, 0.36, 4], [0.08, 0.14, 0.3, 0.3, 4], [0.14, 0.19, 0.25, 0.25, 4], [0.19, 0.25, 0.22, 0.2, 8],
    [0.25, 0.29, 0.19, 0.18, 8], [0.29, 0.33, 0.17, 0.17, 24], [0.52, 0.58, 0.07, 0.07, 4], [0.58, 0.83, 0.06, 0.01, 16],
    [0.83, 0.92, 0.012, 0.004, 8],
  ];
  return (
    <group position={[0, -sink * y(0.36), 0]}>
      {tiers.map(([a, b, r0, r1, n], i) => (
        <mesh key={i} position={[0, y((a + b) / 2), 0]} rotation-y={n === 4 ? Math.PI / 4 : 0} castShadow receiveShadow>
          <cylinderGeometry args={[y(r1) * (n === 4 ? 1.41 : 1), y(r0) * (n === 4 ? 1.41 : 1), y(b - a), n]} />
          <meshStandardMaterial color="#cfc6b4" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, y(0.33), 0]} scale={[1, 1.1, 1]} castShadow>
        <sphereGeometry args={[y(0.17), 20, 12, 0, Math.PI * 2, 0, Math.PI / 2 + 0.25]} />
        <meshStandardMaterial color="#cfc6b4" roughness={0.9} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ the 2482 gate across the Ing at the outlet
const Gate: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 1938.5) return null;
  const built = Y > 1940 ? 1 : smooth(((t - STORY.at('lake')[0]) / (STORY.at('lake')[1] - STORY.at('lake')[0])) / 0.06);
  if (built < 0.02) return null;
  const shut = gateK(t, Y);
  const n = 4;
  const span = 1.8;
  return (
    <group position={[GATE[0], 0, GATE[1]]} scale={[1, built, 1]}>
      {/* the piers across the flow (the river runs east here: the gate's line runs north-south) */}
      {Array.from({length: n + 1}, (_, i) => (
        <Box key={i} p={[0, 0.45, -span / 2 + (i * span) / n]} s={[0.4, 0.9, 0.16]} c="#c7c3b8" />
      ))}
      <Box p={[0, 0.94, 0]} s={[0.5, 0.08, span + 0.3]} c="#9d9a92" />
      {/* the steel doors come down */}
      {Array.from({length: n}, (_, i) => (
        <Box key={i} p={[0.05, 0.85 - 0.6 * shut, -span / 2 + ((i + 0.5) * span) / n]} s={[0.08, 0.55, span / n - 0.18]} c="#55606b" m={0.4} />
      ))}
      {/* the men at the winches on the deck */}
      {t < STORY.at('lake')[1] &&
        Array.from({length: GATE_WORKERS}, (_, i) => (
          <group key={i} position={[0.12, 0.98, -span / 2 + ((i + 0.5) * span) / GATE_WORKERS]} rotation-y={-Math.PI / 2} scale={0.32}>
            <Walker step={t * 1.2 + i} i={i + 1} still />
          </group>
        ))}
    </group>
  );
};

// ------------------------------------------------------------------ houses, carts and people
/** a Lanna wooden house on posts with a steep gable roof */
const LannaHouse: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      {[[-0.4, -0.3], [0.4, -0.3], [-0.4, 0.3], [0.4, 0.3]].map(([x, z], j) => (
        <Box key={j} p={[x, 0.22, z]} s={[0.07, 0.44, 0.07]} c="#5b3d24" />
      ))}
      <Box p={[0, 0.62, 0]} s={[1.0, 0.36, 0.76]} c={i % 2 ? '#8b5e3a' : '#7a5232'} />
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 0.98, s * 0.2]} rotation-x={s * 0.85} castShadow>
          <boxGeometry args={[1.15, 0.05, 0.62]} />
          <meshStandardMaterial color="#6e4a2c" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );

const People: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {/* paetpeng: the first circling of the finished Buddha, candles in hand */}
    {Array.from({length: CIRCLERS}, (_, i) => {
      const p = circlerAt(i, t);
      return p ? (
        <group key={`c${i}`} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.32}>
          <Walker step={t * 1.4 + i * 0.3} i={i} />
          <group position={[0.25, 1.35, 0.25]}>
            <Flame s={0.12} />
          </group>
        </group>
      ) : null;
    })}
    {/* abandon: the people leave south with what they can carry */}
    {Array.from({length: LEAVERS}, (_, i) => {
      const p = leaverAt(i, t);
      return p ? (
        <group key={`l${i}`} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.45}>
          <Walker step={t * 1.6 + i * 0.37} i={i} load={i % 2 === 0} />
        </group>
      ) : null;
    })}
    {/* refound: carts and settlers up the track */}
    {Array.from({length: CARTS}, (_, i) => {
      const p = cartAt(i, t);
      return p ? (
        <group key={`k${i}`} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.75}>
          <Cart step={t * 1.4 + i} />
        </group>
      ) : null;
    })}
    {Array.from({length: SETTLERS}, (_, i) => {
      const p = settlerAt(i, t);
      return p ? (
        <group key={`s${i}`} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.45}>
          <Walker step={t * 1.6 + i * 0.3} i={i} load={i % 3 === 0} />
        </group>
      ) : null;
    })}
    {FOUND_HOUSES.map(([x, z], j) => (
      <group key={`h${j}`} position={[x, 0, z]} rotation-y={hash(j) * 0.6}>
        <LannaHouse k={foundHouseK(j, t, Y)} i={j} />
      </group>
    ))}
    {/* vihara: men carry the logs up from the town in pairs */}
    {Array.from({length: CARRIERS / 2}, (_, j) => {
      const a = carrierAt(j * 2, t);
      const b = carrierAt(j * 2 + 1, t);
      if (!a || !b || a.fade < 0.05) return null;
      return (
        <group key={`w${j}`} scale={a.fade}>
          {[a, b].map((p, i) => (
            <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.42}>
              <Walker step={t * 1.6 + j + i * 0.5} i={j + i} />
            </group>
          ))}
          <mesh position={[(a.x + b.x) / 2, 0.66, (a.z + b.z) / 2]} rotation-y={a.rot} rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.9, 6]} />
            <meshStandardMaterial color="#8a6238" roughness={0.9} />
          </mesh>
        </group>
      );
    })}
    {/* province: the parade with flags on the shore road */}
    {Array.from({length: MARCHERS}, (_, i) => {
      const p = marcherAt(i, t);
      return p ? (
        <group key={`m${i}`} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.42}>
          <Walker step={t * 1.7 + i * 0.4} i={i} />
          {i % 3 === 0 && (
            <group position={[0.3, 1.0, 0]}>
              <Box p={[0, 0.7, 0]} s={[0.04, 1.4, 0.04]} c="#6b4a2a" />
              <Box p={[0, 1.25, 0.3]} s={[0.03, 0.4, 0.6]} c={i % 2 ? '#f2c230' : '#2f4fa0'} />
            </group>
          )}
        </group>
      ) : null;
    })}
  </group>
);

/** อนุสาวรีย์พญางำเมือง (2524-2527): a dark bronze king on a white pedestal in the lakeside park */
const Monument: React.FC<{k: number}> = ({k}) =>
  k < 0.5 ? null : (
    <group position={[MONUMENT[0], 0, MONUMENT[1]]}>
      <Box p={[0, 0.25, 0]} s={[0.7, 0.5, 0.7]} c="#ece6d8" />
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.16, 0.5, 4, 8]} />
        <meshStandardMaterial color="#4a3b26" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.32, 0]} castShadow>
        <coneGeometry args={[0.12, 0.3, 8]} />
        <meshStandardMaterial color="#b8902e" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );

/** the payoff: pilgrims with candles round the vihara's front, boats with candles on the Kwan */
const PaetPeng: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = payoffK(t, Y);
  if (k < 0.02) return null;
  return (
    <group>
      {Array.from({length: PILGRIMS}, (_, i) => {
        const p = pilgrimAt(i, t);
        if (!p || p.fade < 0.05) return null;
        return (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.4 * p.fade * k}>
            <Walker step={t * 1.3 + i * 0.4} i={i} />
            <group position={[0.25, 1.35, 0.25]}>
              <Flame s={0.12} />
            </group>
          </group>
        );
      })}
      {Array.from({length: BOATS}, (_, i) => {
        const p = boatAt(i, t);
        return (
          <group key={`b${i}`} position={[p.x, 0.1, p.z]} rotation-y={p.rot} scale={k}>
            <Box p={[0, 0.06, 0]} s={[0.24, 0.12, 0.9]} c="#6b4a2a" />
            <group position={[0, 0.1, -0.15]} scale={0.3}>
              <Walker step={0} i={i} still />
            </group>
            <group position={[0, 0.24, 0.3]}>
              <Flame s={0.06} />
            </group>
          </group>
        );
      })}
    </group>
  );
};

export const PhayaoLandmarks: React.FC<LandmarkProps> = ({Y, t}) => {
  const S = buddhaS(t);
  return (
    <group>
      <Kwan t={t} Y={Y} />
      {/* the Buddha faces the road and the town (north-east), the lake at its back */}
      <group position={[WAT_SI_KHOM_KHAM[0], 0, WAT_SI_KHOM_KHAM[1]]} rotation-y={FACE}>
        <TonLuang t={t} S={S} />
      </group>
      <group position={[VIHARA_C[0], 0, VIHARA_C[1]]} rotation-y={VIHARA_ROT}>
        <Vihara k={t > 4.4 ? vihK(t, Y) : 0} />
      </group>
      <group position={[WAT_TILOK[0], 0, WAT_TILOK[1]]}>
        <Chedi sink={sinkK(t, Y)} />
      </group>
      <Gate t={t} Y={Y} />
      <People t={t} Y={Y} />
      <Monument k={monumentK(t, Y)} />
      <PaetPeng t={t} Y={Y} />
    </group>
  );
};
