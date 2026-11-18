import React from 'react';
import * as THREE from 'three';
import type {LandmarkProps} from '../../engine/types';
import {HipRoof} from '../../engine/parts';
import {Cart, Walker} from '../nan/figures';
import {
  BEARERS, CARTS, DAM_TRUCKS, DANCERS, DIGGERS, FOUND_HOUSES, MARCHERS, MONK_AT, PONGLANG_AT, ROWS, TEMPLES, WALKERS,
  WEAVE_END, boneK, builderAt, carryAt, cartAt, clamp01, crestK, damTruckAt, dancerAt, diggerAt, digK, fairK, fillK,
  firstPillarK, foundHouseK, hallK, logAt, loomK, marcherAt, pillarUp, rowAt, shrineK, slumpK, templeK, walkerAt,
} from './actors';
import {
  CREST, DAM, DIG, FIRST_PILLAR, HALL, LOOM_AT, LOOM_S, NECK, OXBOW, PILLAR, POND, RESERVOIR, SHAWL_AT, SOMPHAMIT,
} from './places';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const WATER = '#3f8fc0';

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; r?: number; e?: string; ei?: number}> = ({
  p,
  s,
  c,
  r = 0,
  e,
  ei = 0.6,
}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} emissive={e ?? '#000000'} emissiveIntensity={e ? ei : 0} />
  </mesh>
);

/** a puff that bursts out and fades, self-lit so it reads at noon (dust, chips) */
const Puff: React.FC<{u: number; seed: number; S: number; color: string; n?: number; up?: number}> = ({u, seed, S, color, n = 10, up = 0.5}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.3 + hash(seed * 3 + i) * 0.5);
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * sp * u, (up + hash(seed * 7 + i) * 0.5) * sp * u, Math.sin(a) * sp * u]}
            scale={S * 0.08 * (1 - u) * (0.6 + hash(i + seed) * 0.6)}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1 - u} />
          </mesh>
        );
      })}
    </group>
  );
};

/** a flat water shape from a polygon in world x/z, its top at the rivers' surface (0.1) */
const shapeOf = (pts: [number, number][]) => {
  const sh = new THREE.Shape();
  pts.forEach(([x, z], i) => (i === 0 ? sh.moveTo(x, -z) : sh.lineTo(x, -z)));
  sh.closePath();
  return sh;
};
const FlatWater: React.FC<{shape: THREE.Shape; y?: number; color?: string}> = ({shape, y = 0, color = WATER}) => (
  <mesh position={[0, -1.3 + y, 0]} rotation-x={-Math.PI / 2} receiveShadow>
    <extrudeGeometry args={[shape, {depth: 1.4, bevelEnabled: false}]} />
    <meshStandardMaterial color={color} roughness={0.12} metalness={0.25} />
  </mesh>
);

// ------------------------------------------------------------------ the cover: the Phrae Wa loom (style frame A1)
const CRIMSON = '#a3142a';
const KHIT = ['#f2c230', '#f7f1de', '#2f9a5a', '#f2c230', '#1c1c1c'];
const TEAK = '#6b4325';

/** one band of khit across the cloth: a row of small diamonds, w wide, h deep (every fourth row a gold band) */
const KhitRow: React.FC<{w: number; h: number; k: number}> = ({w, h, k}) => {
  const n = 9;
  const c = KHIT[k % KHIT.length];
  if (k % 4 === 3)
    return (
      <mesh position={[0, 0.02 * h, 0]}>
        <boxGeometry args={[w * 0.92, h * 0.05, h * 0.18]} />
        <meshStandardMaterial color="#f2c230" roughness={0.5} metalness={0.2} />
      </mesh>
    );
  return (
    <group>
      {Array.from({length: n}, (_, i) => (
        <mesh key={i} position={[(i - (n - 1) / 2) * (w * 0.92) / n, 0.02 * h, 0]} rotation-y={Math.PI / 4}>
          <boxGeometry args={[h * 0.42, h * 0.05, h * 0.42]} />
          <meshStandardMaterial color={(i + k) % 3 === 0 ? '#f7f1de' : c} roughness={0.5} metalness={0.15} />
        </mesh>
      ))}
    </group>
  );
};
/** a woven length of Phrae Wa: n rows, crimson ground, along +z from its start */
const Shawl: React.FC<{W: number; rowH: number; n: number}> = ({W, rowH, n}) => (
  <group>
    <mesh position={[0, 0, (n * rowH) / 2]} castShadow receiveShadow>
      <boxGeometry args={[W, rowH * 0.3, Math.max(0.01, n * rowH)]} />
      <meshStandardMaterial color={CRIMSON} roughness={0.55} metalness={0.1} />
    </mesh>
    {Array.from({length: n}, (_, k) => (
      <group key={k} position={[0, rowH * 0.15, (k + 0.5) * rowH]}>
        <KhitRow w={W} h={rowH} k={k} />
      </group>
    ))}
  </group>
);

const Loom: React.FC<{t: number}> = ({t}) => {
  const lk = loomK(t);
  if (lk < 0.02) return null;
  const S = LOOM_S;
  const W = S * 0.42;
  const rowH = S * 0.026;
  const done = Array.from({length: ROWS}, (_, k) => (t >= rowAt(k) ? 1 : 0)).reduce((a: number, b) => a + b, 0);
  const lastAt = rowAt(Math.max(0, done - 1));
  const beat = done > ROWS / 2 && t < WEAVE_END + 0.1 ? Math.exp(-(t - lastAt) * 12) : 0;
  const front = S * 0.3;
  const fellZ = front - done * rowH;
  const reedZ = fellZ - S * 0.05 - (1 - beat) * S * 0.06;
  const rowT = done < ROWS ? clamp01((t - lastAt) / Math.max(0.05, rowAt(done) - lastAt)) : 1;
  const shuttleX = (done % 2 === 0 ? -1 : 1) * (rowT * 2 - 1) * W * 0.62;
  const H = S * 0.22;
  return (
    <group position={[LOOM_AT[0], 0, LOOM_AT[1] - S * 0.2]} scale={[lk, lk, lk]}>
      {[-1, 1].map((sx) =>
        [S * 0.36, -S * 0.42].map((z, j) => <Box key={`${sx}${j}`} p={[sx * W * 0.7, S * 0.22, z]} s={[S * 0.035, S * 0.44, S * 0.035]} c={TEAK} />),
      )}
      {[-1, 1].map((sx) => (
        <Box key={sx} p={[sx * W * 0.7, S * 0.44, -S * 0.03]} s={[S * 0.03, S * 0.03, S * 0.82]} c={TEAK} />
      ))}
      {[S * 0.33, -S * 0.4].map((z, j) => (
        <mesh key={j} position={[0, H, z]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[S * 0.022, S * 0.022, W * 1.45, 12]} />
          <meshStandardMaterial color={TEAK} roughness={0.75} />
        </mesh>
      ))}
      {/* the warp: red silk from the fell back to the warp beam */}
      <mesh position={[0, H + S * 0.004, (fellZ - S * 0.4) / 2]}>
        <boxGeometry args={[W, S * 0.003, Math.max(0.01, fellZ + S * 0.4)]} />
        <meshStandardMaterial color="#c8323f" roughness={0.6} transparent opacity={0.85} />
      </mesh>
      {Array.from({length: 22}, (_, i) => (
        <mesh key={i} position={[(i / 21 - 0.5) * W, H + S * 0.007, (fellZ - S * 0.4) / 2]}>
          <boxGeometry args={[S * 0.0025, S * 0.002, Math.max(0.01, fellZ + S * 0.4)]} />
          <meshStandardMaterial color="#e05a5a" roughness={0.5} />
        </mesh>
      ))}
      {/* the woven cloth, from the breast beam back to the fell */}
      <group position={[0, H + S * 0.006, front]} rotation-y={Math.PI}>
        <Shawl W={W} rowH={rowH} n={done} />
      </group>
      {/* the reed / beater swinging in to the fell, a puff of lint at each beat */}
      <group position={[0, H, reedZ]}>
        <Box p={[0, S * 0.04, 0]} s={[W * 1.25, S * 0.09, S * 0.012]} c="#8a5a32" />
        <Puff u={beat > 0.05 ? 1 - beat : -1} seed={done} S={S * 0.2} color="#ffd9a0" n={6} />
      </group>
      {done < ROWS && (
        <group position={[shuttleX, H + S * 0.02, fellZ - S * 0.02]}>
          <mesh rotation-z={Math.PI / 2} scale={[1, 1, 0.5]} castShadow>
            <capsuleGeometry args={[S * 0.012, S * 0.06, 4, 10]} />
            <meshStandardMaterial color="#3b2414" roughness={0.6} />
          </mesh>
          <mesh rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[S * 0.008, S * 0.008, S * 0.03, 10]} />
            <meshStandardMaterial color="#f2c230" roughness={0.4} metalness={0.3} />
          </mesh>
        </group>
      )}
      <Box p={[0, S * 0.08, S * 0.44]} s={[W * 0.9, S * 0.025, S * 0.08]} c={TEAK} />
    </group>
  );
};

// ------------------------------------------------------------------ houses and temples
/** a Lao house on stilts with a steep hip roof (drawn x1.4 so it reads in the settle shot) */
const StiltHouse: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1.4, 1.4 * k, 1.4]}>
      {[-0.3, 0.3].map((x) => [-0.3, 0.3].map((z) => <Box key={`${x}${z}`} p={[x, 0.2, z]} s={[0.08, 0.4, 0.08]} c="#5b3b22" />))}
      <Box p={[0, 0.6, 0]} s={[0.8, 0.4, 0.8]} c={i % 2 ? '#8a6040' : '#7a5236'} />
      <HipRoof w={0.95} l={0.95} h={0.5} y={0.8} color="#5a4636" />
    </group>
  );
/** a sim (ordination hall) with a red hip roof and a gilded finial, drawn x1.3 */
const Sim: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1.3, 1.3 * k, 1.3]}>
      <Box p={[0, 0.08, 0]} s={[1.3, 0.16, 2.1]} c="#d9d2c0" />
      <Box p={[0, 0.45, 0]} s={[1.0, 0.6, 1.8]} c="#efe8d8" />
      <HipRoof w={1.25} l={2.1} h={0.6} y={0.75} color="#9a3a24" />
      <mesh position={[0, 1.45, 0]}>
        <coneGeometry args={[0.07, 0.3, 6]} />
        <meshStandardMaterial color="#d9a521" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
/** a small shrine house for a pillar (ศาล): white base, red roof */
const Shrine: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <Box p={[0, 0.15, 0]} s={[1.0, 0.3, 1.0]} c="#efe8d8" />
      <Box p={[0, 0.55, 0]} s={[0.7, 0.5, 0.7]} c="#f4efe2" />
      <HipRoof w={0.95} l={0.95} h={0.5} y={0.8} color="#b0382a" />
    </group>
  );
/** the pradu-wood pillar: a dark post with a lotus-bud top */
const PillarPost: React.FC = () => (
  <group>
    <mesh position={[0, 0.7, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.12, 1.4, 10]} />
      <meshStandardMaterial color="#6b3a20" roughness={0.6} />
    </mesh>
    <mesh position={[0, 1.5, 0]} castShadow>
      <sphereGeometry args={[0.13, 10, 8]} />
      <meshStandardMaterial color="#d9a521" metalness={0.5} roughness={0.4} />
    </mesh>
  </group>
);

const Settle: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {t > 2.6 && t < 10 &&
      Array.from({length: CARTS}, (_, i) => {
        const p = cartAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.9}>
            <Cart step={t * 1.4 + i} />
          </group>
        ) : null;
      })}
    {t > 2.6 && t < 10 &&
      Array.from({length: WALKERS}, (_, i) => {
        const p = walkerAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.6}>
            <Walker step={t * 1.6 + i * 0.3} i={i} load={i % 3 === 0} />
          </group>
        ) : null;
      })}
    {FOUND_HOUSES.map(([x, z], j) => (
      <group key={j} position={[x, 0, z]} rotation-y={hash(j) * 0.6}>
        <StiltHouse k={foundHouseK(j, t, Y)} i={j} />
      </group>
    ))}
  </group>
);

const Found: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const p = logAt(t);
  const up = pillarUp(t);
  const standing = firstPillarK(t, Y) > 0 && !(t > 8.4 && t < 15.2 && up < 1);
  return (
    <group>
      {p && up < 1 && (
        <group position={[p.x, 0, p.z]} rotation-y={p.rot}>
          {/* the log on the bearers' shoulders, lying along the path */}
          <group position={[0, 0.7, 0]} rotation-x={Math.PI / 2}>
            <PillarPost />
          </group>
          {Array.from({length: BEARERS}, (_, i) => (
            <group key={i} position={[(i % 2 ? 0.3 : -0.3), 0, -0.6 + Math.floor(i / 2) * 0.45]} scale={0.42}>
              <Walker step={t * 1.6 + i * 0.5} i={i} />
            </group>
          ))}
        </group>
      )}
      {/* the pillar swings up at Kut Nam Kin and stands */}
      {t > 8.4 && t < 15.2 && up > 0 && (
        <group position={[FIRST_PILLAR[0], 0, FIRST_PILLAR[1]]} rotation-x={(1 - up) * (Math.PI / 2)}>
          <PillarPost />
        </group>
      )}
      {t > 8.4 && t < 15.2 &&
        Array.from({length: MARCHERS}, (_, i) => {
          const m = marcherAt(i, t);
          return m ? (
            <group key={i} position={[m.x, 0, m.z]} rotation-y={m.rot} scale={0.42}>
              <Walker step={t * 1.5 + i * 0.4} i={i + 2} still={pillarUp(t) > 0.5} />
            </group>
          ) : null;
        })}
      {standing && (
        <group position={[FIRST_PILLAR[0], 0, FIRST_PILLAR[1]]}>
          <PillarPost />
        </group>
      )}
    </group>
  );
};

const Temples: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {TEMPLES.map(([x, z], j) => (
      <group key={j} position={[x, 0, z]} rotation-y={j < 2 ? Math.PI / 2 : 0}>
        <Sim k={templeK(j, t, Y)} />
      </group>
    ))}
    {t > 14.6 && t < 21.4 &&
      TEMPLES.map((_, j) =>
        [0, 1, 2].map((i) => {
          const b = builderAt(j, i, t);
          return b ? (
            <group key={`${j}${i}`} position={[b[0], 0, b[1]]} rotation-y={i * 2} scale={0.42}>
              <Walker step={t * 1.2 + i} i={i + j} load={i === 0} />
            </group>
          ) : null;
        }),
      )}
    {/* the founder's shrine stands from the temples beat */}
    <group position={[SOMPHAMIT[0], 0, SOMPHAMIT[1]]} scale={0.7}>
      <Shrine k={templeK(0, t, Y)} />
    </group>
  </group>
);

// ------------------------------------------------------------------ Kut Nam Kin: the oxbow, the neck, the slump, the carry
const OXBOW_SHAPE = shapeOf(OXBOW);
const NECK_SHAPE = shapeOf(NECK);
const Bank: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const s = slumpK(t, Y);
  const c = carryAt(t);
  return (
    <group>
      <FlatWater shape={OXBOW_SHAPE} />
      {/* the neck of water joining the oxbow to the khlong; the slumped bank fills it */}
      {s < 0.98 && <FlatWater shape={NECK_SHAPE} y={-0.02} />}
      {s > 0.02 && s < 1 && (
        <group position={[-3.2, 0, 7.4]}>
          {/* a wedge of bank sliding and tilting into the neck */}
          <group position={[0.6 * (1 - s), 0.25 - 0.35 * s, -0.2 * (1 - s)]} rotation-z={0.6 * s}>
            <Box p={[0, 0, 0]} s={[1.2, 0.5, 0.9]} c="#8a6a44" />
          </group>
          <Puff u={(s * 2) % 1} seed={Math.floor(s * 2)} S={1.6} color="#c9a57a" n={10} />
        </group>
      )}
      {s >= 1 && <Box p={[-3.2, 0.06, 7.4]} s={[1.0, 0.1, 0.8]} c="#7a8a4a" />}
      {/* the bearers carry the pillar up to today's shrine */}
      {c && (
        <group position={[c.x, 0, c.z]} rotation-y={c.rot}>
          <group position={[0, 0.7, 0]} rotation-x={Math.PI / 2}>
            <PillarPost />
          </group>
          {Array.from({length: 6}, (_, i) => (
            <group key={i} position={[(i % 2 ? 0.3 : -0.3), 0, -0.5 + Math.floor(i / 2) * 0.45]} scale={0.42}>
              <Walker step={t * 1.6 + i * 0.5} i={i + 3} />
            </group>
          ))}
        </group>
      )}
      <group position={[PILLAR[0], 0, PILLAR[1]]}>
        <Shrine k={shrineK(t, Y)} />
        {shrineK(t, Y) > 0.5 && (
          <group scale={0.6}>
            <PillarPost />
          </group>
        )}
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ the pond of Kaeng Don Klang
const POND_SHAPE = shapeOf(POND);

// ------------------------------------------------------------------ the Lam Pao dam and its reservoir
const RES_SHAPE = shapeOf(RESERVOIR);
const Dam: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const ck = crestK(t, Y);
  const fk = fillK(t, Y);
  return (
    <group>
      {/* the reservoir: the river valley floods, the water rising to its level */}
      {fk > 0.01 && (
        <group scale={[1, 1, 1]}>
          <FlatWater shape={RES_SHAPE} y={-0.9 * (1 - fk)} color="#3a86b8" />
        </group>
      )}
      {/* the earth crest, rising along the shore */}
      {ck > 0.01 &&
        CREST.slice(1).map((b, i) => {
          const a = CREST[i];
          const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
          const ang = Math.atan2(b[0] - a[0], b[1] - a[1]);
          return (
            <group key={i} position={[(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2]} rotation-y={ang}>
              <mesh position={[0, 0.45 * ck, 0]} scale={[1, ck, 1]} castShadow receiveShadow>
                <boxGeometry args={[1.6, 0.9, len + 0.2]} />
                <meshStandardMaterial color="#b49a6a" roughness={0.95} />
              </mesh>
              <mesh position={[0, 0.92 * ck, 0]} scale={[1, ck, 1]}>
                <boxGeometry args={[0.5, 0.04, len + 0.2]} />
                <meshStandardMaterial color="#5f5f5f" roughness={0.8} />
              </mesh>
            </group>
          );
        })}
      {/* the spillway gates at the river's outlet */}
      {ck > 0.6 && (
        <group position={[DAM[0], 0, DAM[1] + 0.9]}>
          {[-0.6, 0, 0.6].map((x) => (
            <Box key={x} p={[x, 0.7, 0]} s={[0.3, 1.4, 0.5]} c="#d8d4cc" />
          ))}
          <Box p={[0, 1.45, 0]} s={[1.8, 0.15, 0.6]} c="#c9c4ba" />
          {fk > 0.6 && <Puff u={(t * 1.5) % 1} seed={Math.floor(t * 1.5)} S={1.6} color="#ffffff" n={8} up={0.2} />}
        </group>
      )}
      {t > 26 && t < 33 &&
        Array.from({length: DAM_TRUCKS}, (_, i) => {
          const p = damTruckAt(i, t);
          return p ? (
            <group key={i} position={[p.x, 0.9 * ck, p.z]} rotation-y={p.rot} scale={0.7}>
              <Box p={[0, 0.35, -0.35]} s={[0.55, 0.45, 0.5]} c="#e0a52a" />
              <Box p={[0, 0.4, 0.3]} s={[0.6, 0.5, 0.9]} c="#a07a4a" />
            </group>
          ) : null;
        })}
    </group>
  );
};

// ------------------------------------------------------------------ Phu Kum Khao: the dig
const BONE = '#f1ead8';
const Skeleton: React.FC<{S: number; front: number}> = ({S, front}) => {
  const N = 26;
  const spine = (u: number): [number, number] => {
    const x = (u - 0.5) * S * 1.05;
    const y = u < 0.45 ? S * 0.03 + u * S * 0.1 : u < 0.62 ? S * 0.075 : S * 0.075 + (u - 0.62) * S * 0.2;
    return [x, y];
  };
  return (
    <group>
      {Array.from({length: N}, (_, i) => {
        const u = i / (N - 1);
        if (u > front) return null;
        const [x, y] = spine(u);
        const r = S * (u < 0.45 ? 0.022 + u * 0.08 : u < 0.62 ? 0.058 : 0.05 - (u - 0.62) * 0.06);
        return (
          <mesh key={i} position={[x, y * 0.4, 0]} castShadow>
            <sphereGeometry args={[r, 8, 6]} />
            <meshStandardMaterial color={BONE} roughness={0.6} />
          </mesh>
        );
      })}
      {Array.from({length: 8}, (_, i) => {
        const u = 0.42 + i * 0.025;
        if (u > front) return null;
        const [x] = spine(u);
        return (
          <mesh key={i} position={[x, S * 0.02, 0]} rotation-x={-Math.PI / 2}>
            <torusGeometry args={[S * 0.1, S * 0.012, 5, 14, Math.PI]} />
            <meshStandardMaterial color={BONE} roughness={0.6} />
          </mesh>
        );
      })}
      {front > 0.98 && (
        <mesh position={[spine(1)[0] + S * 0.03, S * 0.03, 0]} scale={[1.6, 0.8, 0.8]} castShadow>
          <sphereGeometry args={[S * 0.045, 10, 8]} />
          <meshStandardMaterial color={BONE} roughness={0.6} />
        </mesh>
      )}
    </group>
  );
};
const Dig: React.FC<{t: number; Y: number; terrainH: LandmarkProps['terrainH']}> = ({t, Y, terrainH}) => {
  const dk = digK(t, Y);
  const bk = boneK(t, Y);
  if (bk < 0.01 && dk < 0.01) return null;
  const gy = terrainH(DIG[0], DIG[1]);
  return (
    <group position={[DIG[0], gy, DIG[1]]}>
      {/* the pit: red sandstone, opening as the dig spreads */}
      <mesh position={[0, 0.03, 0]} scale={[0.6 + 0.4 * dk, 1, 0.6 + 0.4 * dk]} receiveShadow>
        <cylinderGeometry args={[2.6, 2.8, 0.06, 28]} />
        <meshStandardMaterial color="#b5643c" roughness={0.95} />
      </mesh>
      {/* the first bone the abbot sees on the slope */}
      {bk > 0.02 && dk < 0.1 && (
        <mesh position={[0.6, 0.12, 0.3]} rotation-z={Math.PI / 2} scale={bk}>
          <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
          <meshStandardMaterial color={BONE} roughness={0.6} />
        </mesh>
      )}
      <group rotation-y={0.3}>
        <Skeleton S={4.4} front={dk} />
      </group>
      {dk > 0 && dk < 0.98 && <Puff u={(t * 2.5) % 1} seed={Math.floor(t * 2.5)} S={1.6} color="#e7b48a" n={8} />}
      {/* the abbot in saffron, then the diggers round the pit */}
      {t > 32 && t < 39 && (
        <group position={[MONK_AT[0] - DIG[0], 0, MONK_AT[1] - DIG[1]]} rotation-y={-2.4} scale={0.5}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.3, 1.4, 10]} />
            <meshStandardMaterial color="#e08a1e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.18, 10, 8]} />
            <meshStandardMaterial color="#c68e5f" roughness={0.9} />
          </mesh>
        </group>
      )}
      {t > 32 && t < 39 && dk > 0.02 &&
        Array.from({length: DIGGERS}, (_, i) => {
          const [x, z] = diggerAt(i);
          return (
            <group key={i} position={[x - DIG[0], 0, z - DIG[1]]} rotation-y={i < 3 ? 0 : Math.PI} scale={0.45}>
              <Walker step={t * 0.8 + i} i={i} still={i % 2 === 0} />
            </group>
          );
        })}
    </group>
  );
};

// ------------------------------------------------------------------ the new provincial hall
const Hall: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = hallK(t, Y);
  if (k < 0.02) return null;
  return (
    <group position={[HALL[0], 0, HALL[1]]} scale={[1.3, 1.3 * k, 1.3]}>
      <Box p={[0, 0.7, 0]} s={[3.4, 1.4, 1.5]} c="#f1ecdf" />
      <Box p={[0, 1.45, 0]} s={[3.6, 0.1, 1.7]} c="#7d5a3c" />
      <HipRoof w={3.6} l={1.7} h={0.55} y={1.5} color="#8a3b2a" />
      <Box p={[0, 1.2, 0.85]} s={[1.0, 1.0, 0.3]} c="#e8e0cc" />
    </group>
  );
};

// ------------------------------------------------------------------ the fair: pong lang, Phu Thai dancers, the shawl
/** a Phu Thai dancer: black blouse, red Phrae Wa across the shoulder, a red skirt, arms swaying */
const Dancer: React.FC<{t: number; i: number}> = ({t, i}) => {
  const sway = Math.sin(t * 3 + i) * 0.5;
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 0.9, 8]} />
        <meshStandardMaterial color="#1c1c2a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.5, 8]} />
        <meshStandardMaterial color="#14141c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.15, 0]} rotation-z={0.6}>
        <boxGeometry args={[0.08, 0.6, 0.32]} />
        <meshBasicMaterial color={CRIMSON} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial color="#c68e5f" roughness={0.9} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.25, 1.25, 0]} rotation-z={s * (1.1 + sway * s)}>
          <cylinderGeometry args={[0.04, 0.04, 0.45, 5]} />
          <meshStandardMaterial color="#c68e5f" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};
/** a pong lang on its post (logs hung at 45 degrees), played: the struck log glows */
const PongLang: React.FC<{t: number; seed: number}> = ({t, seed}) => {
  const hit = Math.floor(t * 8 + seed) % 10;
  return (
    <group>
      <Box p={[0, 0.9, 0]} s={[0.12, 1.8, 0.12]} c="#5a3a22" />
      {Array.from({length: 10}, (_, k) => {
        const f = (k + 0.7) / 10.6;
        const glow = k === hit ? 1 : 0;
        return (
          <mesh key={k} position={[0, 1.7 - f * 1.4, 0.15 + f * 1.4]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.06, 0.06, 0.4 + 0.5 * f, 8]} />
            <meshStandardMaterial color={glow ? '#ffd27a' : '#c99b62'} emissive={glow ? '#ffb040' : '#000000'} emissiveIntensity={glow ? 0.8 : 0} roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
};
const Fair: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = fairK(t, Y);
  if (k < 0.02) return null;
  return (
    <group>
      {/* the cover's shawl, hung full length from a frame over the fair ground (the callback) */}
      <group position={[SHAWL_AT[0], 0, SHAWL_AT[1]]} scale={[1, k, 1]}>
        {[-1, 1].map((s) => (
          <Box key={s} p={[s * 1.6, 1.6, 0]} s={[0.12, 3.2, 0.12]} c={TEAK} />
        ))}
        <Box p={[0, 3.15, 0]} s={[3.5, 0.12, 0.14]} c={TEAK} />
        <group position={[0, 3.05, 0.02]} rotation-x={Math.PI / 2}>
          <Shawl W={2.8} rowH={0.13} n={ROWS} />
        </group>
      </group>
      {PONGLANG_AT.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]} rotation-y={i ? -0.6 : 0.6} scale={k}>
          <PongLang t={t} seed={i * 3} />
        </group>
      ))}
      {Array.from({length: DANCERS}, (_, i) => {
        const [x, z] = dancerAt(i, t);
        return (
          <group key={i} position={[x, 0, z]} rotation-y={t * 0.35 + i} scale={0.55 * k}>
            <Dancer t={t} i={i} />
          </group>
        );
      })}
    </group>
  );
};

export const KalasinLandmarks: React.FC<LandmarkProps> = ({Y, t, terrainH}) => (
  <group>
    <FlatWater shape={POND_SHAPE} />
    <Loom t={t} />
    <Settle t={t} Y={Y} />
    <Found t={t} Y={Y} />
    <Temples t={t} Y={Y} />
    <Bank t={t} Y={Y} />
    <Dam t={t} Y={Y} />
    <Dig t={t} Y={Y} terrainH={terrainH} />
    <Hall t={t} Y={Y} />
    <Fair t={t} Y={Y} />
  </group>
);
