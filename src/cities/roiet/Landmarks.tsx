import React from 'react';
import * as THREE from 'three';
import type {LandmarkProps} from '../../engine/types';
import {HipRoof} from '../../engine/parts';
import {Biplane, Cart, Walker} from '../nan/figures';
import {
  CARTS, DIGGERS, TOWN_HOUSES, townHouseK, MARCHERS, OLD_TEMPLES, PLANE_S, SPIN0, WALKERS, WOTS, W_END, buddhaK, cartAt, clamp01, clearerAt, coverK,
  diggerAt, fairK, islandK, marcherAt, marshK, planeAt, smooth, stripK, templeK, walkerAt, waterK, watBuengK, wotAt, wotBack,
} from './actors';
import {BUENG, ISLAND, NONG_YA_MA, PILLAR, STRIP, STRIP_W, TOWER, WAT_BUENG, WAT_BURAPHA, WOT_AT, WOT_S} from './places';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const WATER = '#3f8fc0';
const BAMBOO = '#d9b764';
const BAMBOO_DK = '#a8843c';
const WAX = '#22180f';
const mix = (a: string, b: string, u: number) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), clamp01(u)).getHexString();

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; r?: number}> = ({p, s, c, r = 0}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} />
  </mesh>
);

/** a puff that bursts out and fades, self-lit so it reads at noon (dust, chips) */
const Puff: React.FC<{u: number; seed: number; S: number; color: string; n?: number}> = ({u, seed, S, color, n = 8}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.3 + hash(seed * 3 + i) * 0.5);
        return (
          <mesh key={i} position={[Math.cos(a) * sp * u, (0.4 + hash(seed * 7 + i) * 0.5) * sp * u, Math.sin(a) * sp * u]} scale={S * 0.08 * (1 - u) * (0.6 + hash(i + seed) * 0.6)}>
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1 - u} />
          </mesh>
        );
      })}
    </group>
  );
};

/** a flat water shape from a polygon in world x/z (with holes), its top at the rivers' surface */
const shapeOf = (pts: [number, number][], holes: [number, number][][] = []) => {
  const sh = new THREE.Shape();
  pts.forEach(([x, z], i) => (i === 0 ? sh.moveTo(x, -z) : sh.lineTo(x, -z)));
  sh.closePath();
  for (const h of holes) {
    const p = new THREE.Path();
    h.forEach(([x, z], i) => (i === 0 ? p.moveTo(x, -z) : p.lineTo(x, -z)));
    p.closePath();
    sh.holes.push(p);
  }
  return sh;
};
const FlatWater: React.FC<{shape: THREE.Shape; y?: number; color?: string}> = ({shape, y = 0, color = WATER}) => (
  <mesh position={[0, -1.3 + y, 0]} rotation-x={-Math.PI / 2} receiveShadow>
    <extrudeGeometry args={[shape, {depth: 1.4, bevelEnabled: false}]} />
    <meshStandardMaterial color={color} roughness={0.12} metalness={0.25} />
  </mesh>
);
const BUENG_SHAPE = shapeOf(BUENG, [ISLAND]);
const NYM_SHAPE = shapeOf(NONG_YA_MA);

// ------------------------------------------------------------------ the wot (cover, callback and the tower's shape)
/** a wot of `n` bamboo pipes round a hub, tallest first in a spiral; `inAt(k)` is when pipe k drops in (-1 = already in) */
const WotBody: React.FC<{t: number; S: number; inAt?: (k: number) => number; seal?: number; core?: string}> = ({
  t,
  S,
  inAt = () => -1,
  seal = 1,
  core = '#8a6a34',
}) => {
  // as the real wot and หอโหวด ๑๐๑ (owner's photo, 18 Nov): the pipes hang from a head at the top, their tops flush, their
  // feet stepping down round the ring; the longest reaches the ground, the core column stands in the middle
  const R = S * 0.1;
  const r = S * 0.034;
  const TOP = S * 1.0;
  const lenOf = (k: number) => S * (0.98 - (k / (WOTS - 1)) * 0.55);
  return (
    <group>
      <mesh position={[0, TOP / 2, 0]} castShadow>
        <cylinderGeometry args={[R * 0.75, R * 0.85, TOP, 16]} />
        <meshStandardMaterial color={core} roughness={0.7} />
      </mesh>
      {Array.from({length: WOTS}, (_, k) => {
        const at = inAt(k);
        const u = at < 0 ? 1 : smooth((t - (at - 0.26)) / 0.26);
        if (u <= 0) return null;
        const a = (k / WOTS) * Math.PI * 2;
        const L = lenOf(k);
        const drop = (1 - u) * S * 0.6;
        return (
          <group key={k} position={[Math.cos(a) * R, TOP - L / 2 + drop, Math.sin(a) * R]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[r, r, L, 12]} />
              <meshStandardMaterial color={BAMBOO} roughness={0.5} />
            </mesh>
            {[0.15, 0.45, 0.8].map((f, j) => (
              <mesh key={j} position={[0, (f - 0.5) * L, 0]}>
                <cylinderGeometry args={[r * 1.1, r * 1.1, r * 0.35, 12]} />
                <meshStandardMaterial color={BAMBOO_DK} roughness={0.6} />
              </mesh>
            ))}
            {u < 1 && u > 0.82 && (
              <group position={[0, L / 2, 0]}>
                <Puff u={(u - 0.82) / 0.18} seed={k} S={S * 0.16} color="#f6e2a8" n={6} />
              </group>
            )}
          </group>
        );
      })}
      {/* the head: the wax (ขี้สูด) round the pipes' tops, closing once the last pipe is in */}
      <mesh position={[0, TOP, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[R, S * 0.045, 10, 40, Math.PI * 2 * Math.max(0.5, seal)]} />
        <meshStandardMaterial color={WAX} roughness={0.35} />
      </mesh>
    </group>
  );
};
/** rings of sound rolling out over the land */
const SoundRings: React.FC<{t: number; S: number}> = ({t, S}) => (
  <group>
    {[0, 1, 2].map((j) => {
      const u = (t * 0.9 + j / 3) % 1;
      return (
        <mesh key={j} position={[0, 0.3, 0]} rotation-x={-Math.PI / 2} scale={S * (0.25 + u * 1.0)}>
          <ringGeometry args={[0.97, 1, 64]} />
          <meshBasicMaterial color="#ffe6a0" toneMapped={false} transparent opacity={(1 - u) * 0.7} side={THREE.DoubleSide} />
        </mesh>
      );
    })}
  </group>
);
const CoverWot: React.FC<{t: number}> = ({t}) => {
  const k = coverK(t);
  if (k < 0.01) return null;
  const seal = smooth((t - (W_END - 0.1)) / 0.4);
  const spin = t > SPIN0 ? (t - SPIN0) ** 2 * 2.2 : 0;
  const lean = smooth((t - SPIN0) / 1.2) * 0.18;
  return (
    <group position={[WOT_AT[0], (1 - k) * 18, WOT_AT[1]]} scale={k}>
      <group rotation-z={lean}>
        <group rotation-y={spin}>
          <WotBody t={t} S={WOT_S} inAt={wotAt} seal={seal} />
        </group>
      </group>
      {t > SPIN0 + 0.3 && <SoundRings t={t - SPIN0 - 0.3} S={WOT_S} />}
    </group>
  );
};
/** the wot coming back (callback) and standing as หอโหวด ๑๐๑: the podium, the glass deck and the blue dome fade in as
 *  it sets down */
const Tower: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const w = wotBack(t, Y);
  if (!w) return null;
  const S = w.S;
  return (
    <group position={[w.x, w.y, w.z]}>
      <group rotation-y={w.spin}>
        <WotBody t={t} S={S} core={w.k > 0.5 ? '#7c8088' : '#8a6a34'} />
      </group>
      {w.k > 0.02 && (
        <group scale={[1, w.k, 1]}>
          {/* the base podium */}
          <mesh position={[0, S * 0.04, 0]} receiveShadow>
            <cylinderGeometry args={[S * 0.12, S * 0.135, S * 0.08, 24]} />
            <meshStandardMaterial color="#e9e3d6" roughness={0.8} />
          </mesh>
          {/* the observation deck (glass) on the head, and its blue dome */}
          <mesh position={[0, S * 1.09, 0]} castShadow>
            <cylinderGeometry args={[S * 0.17, S * 0.17, S * 0.14, 24]} />
            <meshStandardMaterial color="#cfe3ec" roughness={0.2} metalness={0.4} />
          </mesh>
          <mesh position={[0, S * 1.16, 0]}>
            <sphereGeometry args={[S * 0.13, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#2f4f8a" roughness={0.35} metalness={0.3} />
          </mesh>
        </group>
      )}
      {w.k > 0 && w.k < 0.95 && <Puff u={w.k} seed={7} S={3} color="#fff1c8" n={10} />}
    </group>
  );
};

// ------------------------------------------------------------------ houses and temples
/** a sim (ordination hall) with a red hip roof and a gilded finial, drawn x1.3 */
const Sim: React.FC<{k: number; roof?: string}> = ({k, roof = '#9a3a24'}) =>
  k < 0.02 ? null : (
    <group scale={[1.3, 1.3 * k, 1.3]}>
      <Box p={[0, 0.08, 0]} s={[1.3, 0.16, 2.1]} c="#d9d2c0" />
      <Box p={[0, 0.45, 0]} s={[1.0, 0.6, 1.8]} c="#efe8d8" />
      <HipRoof w={1.25} l={2.1} h={0.6} y={0.75} color={roof} />
      <mesh position={[0, 1.45, 0]}>
        <coneGeometry args={[0.07, 0.3, 6]} />
        <meshStandardMaterial color="#d9a521" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
/** a small shrine house for the pillar (ศาล): white base, red roof */
const Shrine: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[0.7, 0.7 * k, 0.7]}>
      <Box p={[0, 0.15, 0]} s={[1.0, 0.3, 1.0]} c="#efe8d8" />
      <Box p={[0, 0.55, 0]} s={[0.7, 0.5, 0.7]} c="#f4efe2" />
      <HipRoof w={0.95} l={0.95} h={0.5} y={0.8} color="#b0382a" />
    </group>
  );

const Found: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {t > 2.8 && t < 10 &&
      Array.from({length: CARTS}, (_, i) => {
        const p = cartAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.9}>
            <Cart step={t * 1.4 + i} />
          </group>
        ) : null;
      })}
    {t > 2.8 && t < 10 &&
      Array.from({length: WALKERS}, (_, i) => {
        const p = walkerAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.55}>
            <Walker step={t * 1.6 + i * 0.3} i={i} load={i % 3 === 0} />
          </group>
        ) : null;
      })}
    {t > 2.8 && t < 10 &&
      [0, 1, 2, 3].map((i) => {
        const c = clearerAt(i, t);
        return c ? (
          <group key={i} position={[c[0], 0, c[1]]} rotation-y={i * 1.7} scale={0.5}>
            <Walker step={t * 1.2 + i} i={i + 5} load={i === 0} />
          </group>
        ) : null;
      })}
    <group position={[WAT_BUENG[0], 0, WAT_BUENG[1]]}>
      <Sim k={watBuengK(t, Y)} />
      {t > 2.8 && t < 10 && watBuengK(t, Y) > 0.02 && watBuengK(t, Y) < 0.98 && <Puff u={(t * 2) % 1} seed={Math.floor(t * 2)} S={1.6} color="#d8c49a" />}
    </group>
  </group>
);

/** a Lao house on stilts with a steep hip roof (drawn x1.3 so it reads) */
const StiltHouse: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1.3, 1.3 * k, 1.3]}>
      {[-0.3, 0.3].map((x) => [-0.3, 0.3].map((z) => <Box key={`${x}${z}`} p={[x, 0.2, z]} s={[0.08, 0.4, 0.08]} c="#5b3b22" />))}
      <Box p={[0, 0.6, 0]} s={[0.8, 0.4, 0.8]} c={i % 2 ? '#8a6040' : '#7a5236'} />
      <HipRoof w={0.95} l={0.95} h={0.5} y={0.8} color="#5a4636" />
    </group>
  );

const OldTown: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {TOWN_HOUSES.map((h, j) => (
      <group key={`h${j}`} position={[h.x, 0, h.z]} rotation-y={h.rot}>
        <StiltHouse k={townHouseK(j, Y)} i={j} />
      </group>
    ))}
    {OLD_TEMPLES.map(([x, z], j) => (
      <group key={j} position={[x, 0, z]} rotation-y={j === 1 ? Math.PI / 2 : 0}>
        <Sim k={templeK(j, t, Y)} />
      </group>
    ))}
  </group>
);

const Airfield: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = stripK(t, Y);
  const p = planeAt(t);
  const [s, n] = STRIP;
  const L = Math.hypot(n[0] - s[0], n[1] - s[1]);
  const rot = Math.atan2(n[0] - s[0], n[1] - s[1]);
  const crowd = Y < 1940 && Y > 1900;
  return (
    <group>
      {k > 0.02 && (
        <mesh position={[(s[0] + n[0]) / 2, 0.03, (s[1] + n[1]) / 2]} rotation-y={rot} scale={[1, 1, k]} receiveShadow>
          <boxGeometry args={[STRIP_W, 0.04, L]} />
          <meshStandardMaterial color={Y > 1960 ? '#8a8a80' : '#c7c08a'} roughness={1} />
        </mesh>
      )}
      {crowd &&
        Array.from({length: 18}, (_, i) => {
          const side = i % 2 ? 1 : -1;
          const f = 0.1 + Math.floor(i / 2) * 0.05;
          const x = s[0] + (n[0] - s[0]) * f + side * (0.9 + (i % 3) * 0.3);
          const z = s[1] + (n[1] - s[1]) * f;
          return (
            <group key={i} position={[x, 0, z]} rotation-y={-side * Math.PI / 2} scale={0.5}>
              <Walker step={0} i={i} still />
            </group>
          );
        })}
      {p && (
        <group position={[p.x, p.y - 0.9, p.z]} rotation-y={p.rot} scale={PLANE_S}>
          <Biplane prop={p.prop} pitch={p.pitch} />
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the bueng: reedy marsh, dug out by hand, refilled
const Bueng: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const m = marshK(t, Y);
  const w = waterK(t, Y);
  const digging = m < 0.99 && w < 0.99;
  return (
    <group>
      {/* the mud basin under everything */}
      <FlatWater shape={BUENG_SHAPE} y={-0.08} color="#6e5a3a" />
      {/* the marsh water before the dig, the clear water after it */}
      {m > 0.01 && <FlatWater shape={BUENG_SHAPE} y={-0.9 * (1 - m)} color={mix('#6f8a62', '#6e5a3a', 1 - m)} />}
      {w > 0.01 && <FlatWater shape={BUENG_SHAPE} y={-0.9 * (1 - w)} color={WATER} />}
      {/* reeds while it is a marsh */}
      {m > 0.05 &&
        Array.from({length: 26}, (_, i) => {
          const [x, z] = BUENG[i % BUENG.length];
          const f = 0.12 + hash(i) * 0.4;
          return (
            <mesh key={i} position={[x + (-1.4 - x) * f, 0.18 * m, z + (-1.2 - z) * f]} scale={[1, m, 1]}>
              <coneGeometry args={[0.18, 0.5, 5]} />
              <meshStandardMaterial color="#7c9a4a" roughness={0.9} />
            </mesh>
          );
        })}
      {digging &&
        Array.from({length: DIGGERS}, (_, i) => {
          const p = diggerAt(i, t);
          return p ? (
            <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.5}>
              <Walker step={t * 1.5 + i * 0.4} i={i} load={p.load} />
            </group>
          ) : null;
        })}
      {digging && <Puff u={(t * 1.5) % 1} seed={Math.floor(t * 1.5)} S={2.2} color="#b89a6a" n={10} />}
      {/* the island's sala (the first municipal office) and the pillar shrine */}
      <group position={[-1.6, 0, -0.9]}>
        {islandK(Y) > 0.02 && (
          <group scale={[1, islandK(Y), 1]}>
            <Box p={[0, 0.2, 0]} s={[0.9, 0.4, 0.9]} c="#d7cdb6" />
            <HipRoof w={1.0} l={1.0} h={0.45} y={0.4} color="#8a3b2a" />
          </group>
        )}
      </group>
      <group position={[PILLAR[0], 0, PILLAR[1]]}>
        <Shrine k={islandK(Y)} />
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ Phra Sung Yai: a golden standing Buddha (drawn x7, so it reads in the grow shot)
const Buddha: React.FC<{Y: number}> = ({Y}) => {
  const k = buddhaK(Y);
  if (k < 0.02) return null;
  const GOLD = '#d9a521';
  return (
    <group position={[WAT_BURAPHA[0], 0, WAT_BURAPHA[1]]} scale={[1.7, 1.7 * k, 1.7]}>
      <Box p={[0, 0.2, 0]} s={[1.0, 0.4, 1.0]} c="#e7dfcf" />
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.38, 1.9, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <sphereGeometry args={[0.2, 12, 10]} />
        <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.68, 0]}>
        <coneGeometry args={[0.07, 0.25, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.35} />
      </mesh>
      {/* the right hand raised in blessing */}
      <mesh position={[0.28, 1.9, 0.1]} rotation-z={-0.3}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 6]} />
        <meshStandardMaterial color={GOLD} metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ the Phawet procession round the bueng
const Parasol: React.FC = () => (
  <group>
    <mesh position={[0, 1.0, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 1.6, 5]} />
      <meshStandardMaterial color="#6a4a2a" />
    </mesh>
    <mesh position={[0, 1.8, 0]}>
      <coneGeometry args={[0.5, 0.22, 12]} />
      <meshBasicMaterial color="#f2c230" toneMapped={false} />
    </mesh>
  </group>
);
/** a khaen player: the khaen held up to the mouth, pipes above the head */
const KhaenPlayer: React.FC<{t: number; i: number}> = ({t, i}) => (
  <group>
    <Walker step={t * 1.4 + i} i={i} />
    <mesh position={[0, 1.55, 0.18]} rotation-x={-0.25 + Math.sin(t * 6 + i) * 0.05}>
      <boxGeometry args={[0.12, 0.9, 0.06]} />
      <meshStandardMaterial color={BAMBOO} roughness={0.6} />
    </mesh>
  </group>
);
const Fair: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = fairK(t, Y);
  if (k < 0.02) return null;
  return (
    <group>
      {Array.from({length: MARCHERS}, (_, i) => {
        const p = marcherAt(i, t);
        const role = i % 6;
        return (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.55 * k}>
            {role === 0 ? <Parasol /> : null}
            {role === 2 || role === 4 ? <KhaenPlayer t={t} i={i} /> : <Walker step={t * 1.4 + i * 0.4} i={i + 3} load={role === 5} />}
          </group>
        );
      })}
    </group>
  );
};

export const RoietLandmarks: React.FC<LandmarkProps> = ({Y, t}) => (
  <group>
    <FlatWater shape={NYM_SHAPE} />
    <Bueng t={t} Y={Y} />
    <CoverWot t={t} />
    <Found t={t} Y={Y} />
    <OldTown t={t} Y={Y} />
    <Airfield t={t} Y={Y} />
    <Buddha Y={Y} />
    <group position={[TOWER[0] - TOWER[0], 0, 0]}>
      <Tower t={t} Y={Y} />
    </group>
    <Fair t={t} Y={Y} />
  </group>
);
