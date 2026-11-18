// The cover's hero and the waters, shared by the city and the style frames (docs/briefs/trang.md).
// A1 ยางพารา (cloud's pick, the owner delegated the choice): a giant rubber tree being tapped. At frame 0 the tapping panel is
// half used (the old cuts in a striped band) and today's cut is half made; a tapping knife runs on along the spiral until
// CUT_END, white latex wells up along the fresh cut, runs down the channel to the spout and drips into the coconut cup, which
// fills. `done` brings it back already tapped, its cup full (the callback).
// A2 หมูย่างเมืองตรัง and B พะยูน are the other two style frames, kept for the record.
import React from 'react';
import * as THREE from 'three';
import {WATERS} from './places';

type P2 = [number, number];
export const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// ---------- the waters: one flat shape per piece, cut at the tile's edges
const shapeOf = (pts: P2[], holes: P2[][] = []) => {
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
const SHAPES = WATERS.map((w) => shapeOf(w.outer, w.holes));
// The slab's top sits at -1.3 + depth = 0.10 (Songkhla: depth >= 1.40 or it z-fights with the shore); matte so the sun's
// specular never blows out.
export const Waters: React.FC = () => (
  <group>
    {SHAPES.map((s, i) => (
      <mesh key={i} position={[0, -1.3, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <extrudeGeometry args={[s, {depth: 1.4, bevelEnabled: false}]} />
        <meshStandardMaterial color={i === 0 ? '#3a7fa6' : '#4d8a92'} roughness={0.85} metalness={0} />
      </mesh>
    ))}
  </group>
);

/** a puff that bursts out and fades, self-lit (bark shavings, steam) */
export const Puff: React.FC<{u: number; seed: number; S: number; color: string; n?: number; rise?: number}> = ({u, seed, S, color, n = 8, rise = 0}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.3 + hash(seed * 3 + i) * 0.5);
        return (
          <mesh key={i} position={[Math.cos(a) * sp * u, (0.2 + hash(seed * 7 + i) * 0.5) * sp * u + rise * u * S - (rise ? 0 : u * u * S * 0.4), Math.sin(a) * sp * u * 0.5]}
            scale={S * 0.07 * (1 - u * 0.7) * (0.6 + hash(i + seed) * 0.6)}>
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1 - u} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- A1: the rubber tree, tapped
export const CUT_END = 1.8;
const BARK = '#6d6a62';
const PANEL = '#d9a066';
const SCAR = '#8a5a32';
const FRESH = '#6a3416';
const LATEX = '#fbfaf2';
const LEAF = ['#3f7f35', '#4f9140', '#356f2f', '#5d9a45'];
// the cut runs half round the trunk, from high at the back-left to low at the front-right (the spout side)
const PHI0 = -1.9;
const PHI1 = 0.75;
const SLOPE = 0.55; // drop per unit of arc

/** the band of bark between the cut (at base) and h above it, over the cut's half turn, a hair outside the trunk */
const panelGeo = (R: number, base: number, h: number) => {
  const n = 24;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= n; i++) {
    const phi = PHI0 + ((PHI1 - PHI0) * i) / n;
    const y = base - (phi - PHI0) * R * SLOPE;
    const r = R * 1.015;
    pos.push(Math.sin(phi) * r, y, Math.cos(phi) * r, Math.sin(phi) * r, y + h, Math.cos(phi) * r);
    if (i < n) idx.push(2 * i, 2 * i + 2, 2 * i + 1, 2 * i + 1, 2 * i + 2, 2 * i + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};
/** today's cut: 0.5 at frame 0 (half made), 1 at CUT_END */
export const cutK = (t: number) => 0.5 + 0.5 * smooth(t / CUT_END);
/** the cup's latex: a quarter full at frame 0, near full by 2.6 s */
export const cupK = (t: number) => 0.25 + 0.7 * smooth((t - 0.4) / 2.2);

export const RubberTree: React.FC<{t: number; S: number; done?: boolean}> = ({t, S, done}) => {
  const R = S * 0.12; // trunk radius at the panel
  const yCut = S * 0.42; // the cut's high end
  const arc = (k: number) => PHI0 + (PHI1 - PHI0) * k;
  const at = (phi: number, y: number, r = R * 1.01): THREE.Vector3 => new THREE.Vector3(Math.sin(phi) * r, y, Math.cos(phi) * r);
  const yAt = (phi: number, base: number) => base - (phi - PHI0) * R * SLOPE;
  const helix = (base: number, k0: number, k1: number, r = R * 1.01) =>
    new THREE.CatmullRomCurve3(Array.from({length: 13}, (_, i) => {
      const phi = arc(k0 + ((k1 - k0) * i) / 12);
      return at(phi, yAt(phi, base), r);
    }));
  const ck = done ? 1 : cutK(t);
  const fill = done ? 0.95 : cupK(t);
  const lowEnd = at(PHI1, yAt(PHI1, yCut));
  const spoutY = lowEnd.y - S * 0.06;
  const spout = at(PHI1, spoutY, R * 1.08);
  const cupR = S * 0.085;
  const cupC = at(PHI1, spoutY - S * 0.07, R + cupR * 0.95);
  const knife = at(arc(ck), yAt(arc(ck), yCut), R * 1.06);
  const knifeOn = !done && t < CUT_END + 0.35;
  const knifeLift = smooth((t - CUT_END) / 0.35);
  const sway = Math.sin(t * 1.3) * 0.015;
  // drops falling from the spout into the cup
  const dropU = (t * 2.2) % 1;
  return (
    <group>
      {/* the trunk: a grey column flaring at the root, tapering up to the fork */}
      <mesh position={[0, S * 0.32, 0]} castShadow>
        <cylinderGeometry args={[R * 0.7, R * 1.05, S * 0.64, 20]} />
        <meshStandardMaterial color={BARK} roughness={0.9} />
      </mesh>
      <mesh position={[0, S * 0.025, 0]} castShadow>
        <cylinderGeometry args={[R * 1.05, R * 1.5, S * 0.05, 16]} />
        <meshStandardMaterial color="#6e695c" roughness={0.95} />
      </mesh>
      {/* the used panel: a slanted band of renewed tan bark above today's cut, old cut scars across it */}
      <mesh geometry={panelGeo(R, yCut, S * 0.085)} castShadow>
        <meshStandardMaterial color={PANEL} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({length: 3}, (_, k) => (
        <mesh key={`s${k}`}>
          <tubeGeometry args={[helix(yCut + (k + 1) * S * 0.021, 0, 1, R * 1.03), 24, S * 0.0025, 4, false]} />
          <meshStandardMaterial color={SCAR} roughness={0.9} />
        </mesh>
      ))}
      {/* the top line where tapping began, a dark scar */}
      <mesh>
        <tubeGeometry args={[helix(yCut + S * 0.085, 0, 1, R * 1.03), 24, S * 0.004, 4, false]} />
        <meshStandardMaterial color={SCAR} roughness={0.9} />
      </mesh>
      {/* today's cut, as far as the knife has gone, with the latex welling white along it */}
      {ck > 0.02 && (
        <>
          <mesh>
            <tubeGeometry args={[helix(yCut, 0, ck, R * 1.02), 24, S * 0.014, 6, false]} />
            <meshStandardMaterial color={FRESH} roughness={0.7} />
          </mesh>
          <mesh>
            <tubeGeometry args={[helix(yCut - S * 0.014, 0.2, ck, R * 1.05), 24, S * 0.015, 6, false]} />
            <meshBasicMaterial color={LATEX} toneMapped={false} />
          </mesh>
        </>
      )}
      {/* the channel down to the spout, white once the latex reaches the low end */}
      <mesh position={[(lowEnd.x + spout.x) / 2, (lowEnd.y + spout.y) / 2, (lowEnd.z + spout.z) / 2]}>
        <boxGeometry args={[S * 0.02, lowEnd.y - spout.y, S * 0.02]} />
        <meshBasicMaterial color={LATEX} toneMapped={false} />
      </mesh>
      {/* the spout: a tin tongue */}
      <mesh position={[spout.x, spout.y, spout.z]} rotation-y={PHI1} rotation-x={0.5}>
        <boxGeometry args={[S * 0.04, S * 0.005, S * 0.06]} />
        <meshStandardMaterial color="#c8ccd0" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* the wire round the trunk and the coconut cup hanging on it */}
      <mesh position={[0, cupC.y + cupR * 0.4, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[R * 1.02, S * 0.0018, 4, 24]} />
        <meshStandardMaterial color="#8e8e8e" metalness={0.5} />
      </mesh>
      <group position={[cupC.x, cupC.y, cupC.z]}>
        <mesh rotation-x={Math.PI} castShadow>
          <sphereGeometry args={[cupR, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#5a3b22" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -cupR * (1 - fill) * 0.9, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[cupR * Math.sqrt(1 - (1 - fill) * (1 - fill) * 0.8) * 0.97, 20]} />
          <meshBasicMaterial color={LATEX} toneMapped={false} />
        </mesh>
      </group>
      {/* a drop falling from the spout */}
      <mesh position={[spout.x + (cupC.x - spout.x) * dropU, spout.y - (spout.y - cupC.y) * dropU * dropU, spout.z + (cupC.z - spout.z) * dropU]} scale={S * 0.018}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial color={LATEX} toneMapped={false} />
      </mesh>
      {/* the tapping knife: a hooked blade on a wooden handle, riding the cut; it lifts away at the end */}
      {knifeOn && (
        <group position={[knife.x * (1 + knifeLift * 0.6), knife.y + knifeLift * S * 0.08, knife.z * (1 + knifeLift * 0.6)]} rotation-y={arc(ck)}>
          <mesh position={[0, 0, S * 0.012]} rotation-x={0.3}>
            <boxGeometry args={[S * 0.07, S * 0.018, S * 0.05]} />
            <meshStandardMaterial color="#d9dde2" metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[S * 0.02, S * 0.01, S * 0.075]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[S * 0.014, S * 0.016, S * 0.08, 8]} />
            <meshStandardMaterial color="#c49a62" roughness={0.8} />
          </mesh>
          <Puff u={(t * 3.2) % 1} seed={Math.floor(t * 3.2)} S={S * 0.05} color="#d8a670" n={5} />
        </group>
      )}
      {/* the fork and the high crown, leaves stirring */}
      <group position={[0, S * 0.62, 0]} rotation-z={sway} rotation-x={sway * 0.6}>
        {[[-0.5, 0.2], [0.45, -0.3], [0.05, 0.55], [0.25, 0.1]].map(([a, b], i) => (
          <mesh key={i} position={[a * S * 0.07, S * 0.09, b * S * 0.07]} rotation-z={-a * 0.6} rotation-x={b * 0.6} castShadow>
            <cylinderGeometry args={[R * 0.32, R * 0.5, S * 0.2, 8]} />
            <meshStandardMaterial color={BARK} roughness={0.9} />
          </mesh>
        ))}
        {Array.from({length: 18}, (_, i) => {
          const a = (i / 18) * Math.PI * 2 * 2.3 + 0.4;
          const r = i < 4 ? S * 0.06 : S * (0.12 + hash(i) * 0.1);
          const y = S * (0.16 + (i < 4 ? 0.2 : hash(i + 9) * 0.18));
          const s = S * (0.075 + hash(i + 3) * 0.045);
          return (
            <mesh key={i} position={[Math.cos(a) * r, y + Math.sin(t * 1.7 + i) * S * 0.004, Math.sin(a) * r * 0.9 - S * 0.02]} scale={[s, s * 0.72, s]} castShadow>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color={LEAF[i % LEAF.length]} roughness={0.85} flatShading />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

// ---------- A2: หมูย่างเมืองตรัง, a whole pig turning on its spit over the coals
export const RoastPig: React.FC<{t: number; S: number}> = ({t, S}) => {
  const turn = t * 1.6 + 1.2;
  // the crackling spreads round the pig: half crisp at frame 0, all of it by ~2.2 s
  const crisp = 0.5 + 0.5 * smooth(t / 2.2);
  const raw = new THREE.Color('#e8b7a0');
  const done = new THREE.Color('#9a3c16');
  const skin = (u: number) => raw.clone().lerp(done, u < crisp ? 1 : smooth((crisp + 0.12 - u) / 0.12));
  const L = S * 0.5;
  const segs = 22;
  return (
    <group>
      {/* the brick oven's low wall and the bed of coals */}
      {/* the brick pit: four low walls round a bed of glowing coals */}
      {[[0, -1], [0, 1]].map(([, s], i) => (
        <mesh key={i} position={[0, S * 0.07, s * S * 0.17]} castShadow receiveShadow>
          <boxGeometry args={[L * 1.5, S * 0.14, S * 0.04]} />
          <meshStandardMaterial color="#9a5a3c" roughness={0.95} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * L * 0.73, S * 0.07, 0]} castShadow receiveShadow>
          <boxGeometry args={[S * 0.04, S * 0.14, S * 0.38]} />
          <meshStandardMaterial color="#9a5a3c" roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, S * 0.03, 0]}>
        <boxGeometry args={[L * 1.4, S * 0.04, S * 0.3]} />
        <meshStandardMaterial color="#2a2220" roughness={1} />
      </mesh>
      {Array.from({length: 18}, (_, i) => (
        <mesh key={`c${i}`} position={[(hash(i) - 0.5) * L * 1.3, S * 0.055, (hash(i + 7) - 0.5) * S * 0.26]} scale={S * 0.022}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={new THREE.Color(i % 3 ? '#ff6a1a' : '#ffb347').multiplyScalar(0.75 + 0.25 * Math.sin(t * 6 + i))} toneMapped={false} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * L * 0.72, S * 0.2, 0]} castShadow>
          <boxGeometry args={[S * 0.03, S * 0.32, S * 0.03]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, S * 0.34, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[S * 0.008, S * 0.008, L * 1.6, 8]} />
        <meshStandardMaterial color="#b0b4b8" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* the pig, along x, turning on the spit; its skin in rings so the crackling can spread */}
      <group position={[0, S * 0.34, 0]} rotation-x={turn}>
        {Array.from({length: segs}, (_, i) => {
          const u = (i + 0.5) / segs;
          const x = (u - 0.5) * L;
          const r = S * 0.12 * Math.sin(Math.PI * (0.12 + u * 0.8)) ** 0.6;
          return (
            <mesh key={i} position={[x, 0, 0]} rotation-z={Math.PI / 2} castShadow>
              <cylinderGeometry args={[r, r, L / segs + 0.01, 18]} />
              <meshStandardMaterial color={skin(u)} roughness={0.35} metalness={0.1} />
            </mesh>
          );
        })}
        {/* the head and snout, the ears */}
        <mesh position={[L * 0.56, 0, 0]} scale={[1.1, 0.85, 0.85]} castShadow>
          <sphereGeometry args={[S * 0.08, 14, 10]} />
          <meshStandardMaterial color={skin(0.98)} roughness={0.35} />
        </mesh>
        <mesh position={[L * 0.66, -S * 0.01, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[S * 0.03, S * 0.035, S * 0.05, 12]} />
          <meshStandardMaterial color={skin(1)} roughness={0.4} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[L * 0.53, S * 0.06, s * S * 0.05]} rotation-x={s * 0.5} scale={[1, 0.3, 1]}>
            <coneGeometry args={[S * 0.04, S * 0.06, 8]} />
            <meshStandardMaterial color={skin(0.96)} roughness={0.4} />
          </mesh>
        ))}
        {/* the legs, tied straight */}
        {[-0.3, 0.3].flatMap((x) => [-1, 1].map((s) => (
          <mesh key={`${x}${s}`} position={[x * L, -S * 0.1, s * S * 0.05]} rotation-z={x > 0 ? -0.9 : 0.9}>
            <cylinderGeometry args={[S * 0.02, S * 0.025, S * 0.14, 8]} />
            <meshStandardMaterial color={skin(x + 0.5)} roughness={0.4} />
          </mesh>
        )))}
      </group>
      <group position={[0, S * 0.5, 0]}>
        <Puff u={(t * 0.9) % 1} seed={Math.floor(t * 0.9)} S={S * 0.25} color="#efe9e0" n={7} rise={1} />
      </group>
    </group>
  );
};

// ---------- B: พะยูน, a dugong mother and calf grazing the seagrass off Ko Libong
const DugongBody: React.FC<{S: number; t: number; phase: number}> = ({S, t, phase}) => {
  const fl = Math.sin(t * 2.4 + phase) * 0.35;
  return (
    <group>
      <mesh scale={[0.32, 0.26, 1]} castShadow>
        <sphereGeometry args={[S * 0.5, 20, 14]} />
        <meshStandardMaterial color="#8d8f93" roughness={0.6} />
      </mesh>
      {/* the head and the broad down-turned snout */}
      <mesh position={[0, -S * 0.03, S * 0.5]} scale={[0.9, 0.8, 1]}>
        <sphereGeometry args={[S * 0.11, 14, 10]} />
        <meshStandardMaterial color="#9a9ca0" roughness={0.6} />
      </mesh>
      <mesh position={[0, -S * 0.07, S * 0.6]} rotation-x={0.6}>
        <cylinderGeometry args={[S * 0.07, S * 0.08, S * 0.06, 12]} />
        <meshStandardMaterial color="#a8a39a" roughness={0.7} />
      </mesh>
      {/* the flippers */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * S * 0.15, -S * 0.07, S * 0.25]} rotation-z={s * (0.6 + fl * 0.3)} scale={[1, 0.2, 0.6]}>
          <sphereGeometry args={[S * 0.08, 10, 8]} />
          <meshStandardMaterial color="#7f8185" roughness={0.6} />
        </mesh>
      ))}
      {/* the fluked tail, beating */}
      <group position={[0, 0, -S * 0.5]} rotation-x={fl}>
        <mesh position={[0, 0, -S * 0.12]} scale={[1.6, 0.12, 0.6]}>
          <sphereGeometry args={[S * 0.13, 14, 8]} />
          <meshStandardMaterial color="#7f8185" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
export const Dugongs: React.FC<{t: number; S: number}> = ({t, S}) => {
  // they swim forward over the meadow; the grazed trail behind them (bare sand) lengthens
  const z = (t - 1.5) * S * 0.08;
  return (
    <group>
      {/* the seagrass meadow: tufts on a sand bed just under the surface */}
      {Array.from({length: 60}, (_, i) => {
        const x = (hash(i) - 0.5) * S * 0.8;
        const zz = (hash(i + 40) - 0.5) * S * 0.9;
        const grazed = Math.abs(x) < S * 0.12 && zz < z - S * 0.2;
        return grazed ? null : (
          <mesh key={i} position={[x, 0.15 + Math.sin(t * 2 + i) * 0.03, zz]} scale={[S * 0.02, S * 0.03, S * 0.02]}>
            <coneGeometry args={[1, 2, 5]} />
            <meshStandardMaterial color={i % 3 ? '#5f8f3a' : '#7aa64a'} roughness={0.9} />
          </mesh>
        );
      })}
      <group position={[0, 0.4 + Math.sin(t * 1.2) * S * 0.02, z]} rotation-x={0.1}>
        <DugongBody S={S} t={t} phase={0} />
      </group>
      <group position={[S * 0.35, 0.3 + Math.sin(t * 1.2 + 1) * S * 0.015, z - S * 0.1]} scale={0.55}>
        <DugongBody S={S} t={t} phase={1.3} />
      </group>
      {/* the mother breathes: a burst of spray when she surfaces at ~1.6 s */}
      <group position={[0, S * 0.15, z + S * 0.55]}>
        <Puff u={(t - 1.4) / 1.2} seed={3} S={S * 0.18} color="#f4fbff" n={10} rise={0.6} />
      </group>
    </group>
  );
};
