import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Elephant, glowTexture, lathe, Prang, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp} from '../../lib';
import {Cart, Walker} from '../nan/figures';
import {
  airlinerAt, ARRIVE_N, arriveAt, BANNER_AT, bannerK, beatK, blueFront, BRAHMINS, brahminAt, castleAt, CASTLES, chuteAt, CHUTES,
  clamp01, CLOTH_H, CLOTH_W, dyeFront, emptyK, heroScale, khmerK, lakeK, LEAVE_N, leaveAt, LEGEND_AT, liftK, PAY_S, planeAt,
  POT_H, raftAt, RAFTS, ringK, RUNWAY_L, sinkK, stupaK, thaRaeK,
} from './actors';
import {
  AIRPORT, CITY_GATE, CLOCK, DON_SAWAN, HALL, HERO_AT, HERO_S, KHA_THAT, KHOM_BRIDGE, LAKE_PATH, NARAI, PALACE, PHU_PHAN,
  RUNWAY_ROT, SERI_CAVE, SRA_PHANG, STUPA, THA_RAE, THAT_DUM,
} from './places';
import {STORY} from './timeline';

const WATER = '#3f7fae';
export const INDIGO = '#1b2a63';
const INDIGO_DEEP = '#121c45';
const DYE_GREEN = '#7d9a3c';
const UNDYED = '#ece3cf';
const TIED = '#ebe6dc';
const LATERITE = '#a2603f';
const smooth01 = (x: number) => x * x * (3 - 2 * x);
const AZ0 = (18 * Math.PI) / 180;

// a growing mesh is gated on its own scale (CLAUDE.md: a mesh at scale 0 blacks out the shader look)
const Grow: React.FC<{k: number; children: React.ReactNode; at: [number, number, number]; rot?: number}> = ({k, children, at, rot = 0}) =>
  k > 0.02 ? (
    <group position={at} rotation-y={rot} scale={[1, Math.max(0.03, k), 1]}>
      {children}
    </group>
  ) : null;

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; e?: string; ei?: number}> = ({p, s, c, e, ei = 0.6}) => (
  <mesh position={p} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} emissive={e ?? '#000000'} emissiveIntensity={e ? ei : 0} />
  </mesh>
);

/** a pitched-roof hut, 1 unit long */
const Hut: React.FC<{c?: string}> = ({c = '#8a6440'}) => (
  <group>
    <Box p={[0, 0.25, 0]} s={[1, 0.5, 0.7]} c={c} />
    <mesh position={[0, 0.66, 0]} scale={[0.78, 0.3, 0.52]} rotation-y={Math.PI / 4} castShadow>
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial color="#6b4a2c" flatShading />
    </mesh>
  </group>
);

// ------------------------------------------------------------------ the cover: the indigo cloth and the pot
const TEX_W = 512;
const TEX_H = 768;
/** the cloth: undyed above the green front, green between the fronts, indigo below the blue front; the tied
 *  threads stay white (stacked diamonds, ลายสะเก็ดธรรม-like) wherever the dye has reached */
export const clothTexture = (green: number, blue: number) => {
  const c = document.createElement('canvas');
  c.width = TEX_W;
  c.height = TEX_H;
  const g = c.getContext('2d')!;
  g.fillStyle = UNDYED;
  g.fillRect(0, 0, TEX_W, TEX_H);
  const edge = (front: number, color: string) => {
    const yF = TEX_H * (1 - front);
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(0, TEX_H);
    for (let i = 0; i <= 32; i++) g.lineTo((i / 32) * TEX_W, yF + Math.sin(i * 1.7) * 9 + Math.sin(i * 0.6) * 14);
    g.lineTo(TEX_W, TEX_H);
    g.closePath();
    g.fill();
  };
  if (green > 0) edge(green, DYE_GREEN);
  if (blue > 0) edge(blue, INDIGO);
  if (green > 0) {
    g.save();
    g.beginPath();
    g.rect(0, TEX_H * (1 - green) + 18, TEX_W, TEX_H);
    g.clip();
    const dx = TEX_W / 5;
    const dy = 104;
    for (let row = 0; row * dy < TEX_H + dy; row++) {
      for (let col = -1; col <= 5; col++) {
        const cx = col * dx + (row % 2 ? dx / 2 : 0) + dx / 2;
        const cy = row * dy + 46;
        // three stacked diamonds: white, dye, white
        for (const [s, color] of [[1, TIED], [0.62, 'dye'], [0.3, TIED]] as [number, string][]) {
          const w = dx * 0.4 * s;
          const h = dy * 0.42 * s;
          const yy = cy;
          g.fillStyle = color === 'dye' ? (yy > TEX_H * (1 - blue) ? INDIGO : DYE_GREEN) : color;
          g.beginPath();
          g.moveTo(cx, cy - h);
          g.lineTo(cx + w, cy);
          g.lineTo(cx, cy + h);
          g.lineTo(cx - w, cy);
          g.closePath();
          g.fill();
        }
      }
    }
    g.fillStyle = INDIGO_DEEP;
    g.fillRect(0, 0, 18, TEX_H);
    g.fillRect(TEX_W - 18, 0, 18, TEX_H);
    g.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

const Cloth: React.FC<{t: number; W: number; H: number; green: number; blue: number; lift: number}> = ({t, W, H, green, blue, lift}) => {
  const qg = Math.round(green * 90) / 90;
  const qb = Math.round(blue * 90) / 90;
  const tex = useMemo(() => clothTexture(qg, qb), [qg, qb]);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(W, H, 30, 40);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const v = (p.getY(i) + H / 2) / H;
      const free = 1 - v;
      const amp = W * (0.025 + 0.06 * lift) * free;
      const z = amp * Math.sin((x / W) * 7 + t * 2.3 + v * 2.2) + amp * 0.5 * Math.sin((x / W) * 15 - t * 3.1);
      p.setZ(i, z + W * 0.08 * lift * free * free);
    }
    g.computeVertexNormals();
    return g;
  }, [W, H, t, lift]);
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial map={tex} roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
  );
};

const Bamboo: React.FC<{from: [number, number, number]; to: [number, number, number]; r: number}> = ({from, to, r}) => {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return (
    <mesh position={a.clone().add(b).multiplyScalar(0.5)} quaternion={q} castShadow>
      <cylinderGeometry args={[r, r, a.distanceTo(b), 8]} />
      <meshStandardMaterial color="#b89a5a" roughness={0.8} />
    </mesh>
  );
};

const POT: [number, number][] = [
  [0, 0], [0.34, 0], [0.46, 0.08], [0.52, 0.25], [0.52, 0.5], [0.48, 0.72], [0.42, 0.86], [0.44, 0.94], [0.47, 1], [0.44, 1.01], [0.4, 0.95],
];

/** the cloth on its bamboo frame, its foot in the pot; S = the hero's unit (HERO_S at legend scale) */
const DyedCloth: React.FC<{t: number; S: number; green: number; blue: number; lift: number; pot: boolean}> = ({t, S, green, blue, lift, pot}) => {
  const W = 2.2 * S;
  const H = 3.2 * S;
  const potH = 1.0 * S;
  const potR = 0.62 * W;
  const poleY = (pot ? potH * 0.75 : 0.2 * S) + H + 0.12 * H * lift;
  const potGeo = useMemo(() => lathe(POT, 40), []);
  return (
    <group>
      {pot && (
        <>
          <group scale={[potR / 0.52, potH, potR / 0.52]}>
            <mesh geometry={potGeo} castShadow receiveShadow>
              <meshStandardMaterial color="#6b4a33" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
          </group>
          <mesh position={[0, potH * 0.9, 0]} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[(potR / 0.52) * 0.43, 40]} />
            <meshStandardMaterial color={INDIGO_DEEP} roughness={0.25} metalness={0.1} />
          </mesh>
        </>
      )}
      <group rotation-y={AZ0}>
        <group position={[0, poleY - H / 2, 0]}>
          <Cloth t={t} W={W} H={H} green={green} blue={blue} lift={lift} />
        </group>
        <Bamboo from={[-W * 0.7, poleY, 0]} to={[W * 0.7, poleY, 0]} r={0.035 * S} />
        {[-1, 1].map((s) => (
          <group key={s}>
            <Bamboo from={[s * W * 0.66, 0, -0.25 * S]} to={[s * W * 0.66, poleY + 0.05 * S, 0]} r={0.03 * S} />
            <Bamboo from={[s * W * 0.66, 0, 0.25 * S]} to={[s * W * 0.66, poleY + 0.05 * S, 0]} r={0.03 * S} />
          </group>
        ))}
      </group>
    </group>
  );
};

const HeroCloth: React.FC<{t: number}> = ({t}) => {
  const k = heroScale(t);
  const u = ringK(t);
  return (
    <group position={[HERO_AT[0], 0, HERO_AT[1]]}>
      {k > 0.02 && (
        <group scale={k}>
          <DyedCloth t={t} S={HERO_S} green={dyeFront(t)} blue={blueFront(t)} lift={liftK(t)} pot />
        </group>
      )}
      {u > 0.02 && u < 1 && (
        <mesh position={[0, 0.08, 0]} rotation-x={-Math.PI / 2} scale={0.62 * CLOTH_W * (0.9 + u * 1.1)}>
          <ringGeometry args={[0.9, 1, 96]} />
          <meshBasicMaterial color={INDIGO} transparent opacity={(1 - u) * 0.8} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};
void CLOTH_H;
void POT_H;

// ------------------------------------------------------------------ the lake and the legend town
const lakeShape = new THREE.Shape(LAKE_PATH.map(([x, z]) => new THREE.Vector2(x, -z)));
const [SINK0] = STORY.at('sink');
const Lake: React.FC<{t: number}> = ({t}) => {
  if (t < SINK0) return null;
  const k = lakeK(t);
  if (k < 0.02) return null;
  return (
    <group position={[LEGEND_AT[0], 0, LEGEND_AT[1]]} scale={[k, 1, k]}>
      <mesh position={[-LEGEND_AT[0], 0.06, -LEGEND_AT[1]]} rotation-x={-Math.PI / 2} receiveShadow>
        <shapeGeometry args={[lakeShape, 24]} />
        <meshStandardMaterial color={WATER} roughness={0.25} metalness={0.1} />
      </mesh>
    </group>
  );
};

/** ดอนสวรรค์: the widow's mound, a wooded island with the ruined chapel */
const DonSawan: React.FC = () => (
  <group position={[DON_SAWAN[0], 0, DON_SAWAN[1]]}>
    <mesh position={[0, 0.12, 0]} scale={[2.6, 0.5, 2.0]} receiveShadow castShadow>
      <sphereGeometry args={[1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#6f8f4a" roughness={1} />
    </mesh>
    {[[-0.9, -0.4], [0.7, -0.6], [0.2, 0.7], [-0.4, 0.3], [1.2, 0.3]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.75, z]} castShadow>
        <coneGeometry args={[0.38, 1.1, 7]} />
        <meshStandardMaterial color="#3f6b35" roughness={1} />
      </mesh>
    ))}
    <Box p={[0.1, 0.62, -0.1]} s={[0.5, 0.3, 0.32]} c="#b9a58a" />
  </group>
);

const LEGEND_HOUSES = Array.from({length: 40}, (_, i) => {
  const a = i * 2.39996;
  const r = Math.sqrt((i + 3) / 43) * 9.5;
  return {x: Math.cos(a) * r, z: Math.sin(a) * r, s: 0.7 + ((i * 37) % 10) / 20, rot: a};
});
const LegendTown: React.FC<{t: number}> = ({t}) => {
  if (t > STORY.at('sink')[1]) return null;
  const drop = sinkK(t) * 1.3;
  const houses = LEGEND_HOUSES;
  return (
    <group position={[LEGEND_AT[0], -drop, LEGEND_AT[1]]} rotation-z={sinkK(t) * 0.04}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[10.5, 10.5, 0.6, 72, 1, true]} />
        <meshStandardMaterial color="#9a6a45" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <Prang pos={[0, 0, 0]} k={1} scale={2.2} color={LATERITE} />
      {houses.map((h, i) =>
        Math.hypot(h.x, h.z) < 2.2 ? null : (
          <group key={i} position={[h.x, 0, h.z]} rotation-y={h.rot} scale={h.s}>
            <Hut />
          </group>
        ),
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the Khmer town and the Lan Xang stupa
const KhomBridge: React.FC<{k: number}> = ({k}) => (
  <group position={[KHOM_BRIDGE[0], 0, KHOM_BRIDGE[1]]}>
    {/* the ditch it spans (N-S), and the laterite deck with its 11 openings (drawn 4x) */}
    <mesh position={[0, 0.05, 0]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[0.7, 3.2]} />
      <meshStandardMaterial color={WATER} roughness={0.3} />
    </mesh>
    <Grow k={k} at={[0, 0, 0]}>
      <Box p={[0, 0.2, 0]} s={[0.9, 0.12, 0.7]} c={LATERITE} />
      {Array.from({length: 11}, (_, i) => (
        <Box key={i} p={[0, 0.07, -0.33 + (i * 0.66) / 10]} s={[0.9, 0.14, 0.03]} c="#8c5236" />
      ))}
    </Grow>
  </group>
);

/** the Lan Xang lotus-bud stupa (square plan, stepped base, a tall four-sided bud), drawn ~10x */
const LanXangStupa: React.FC<{k: number; night: number}> = ({k, night}) => (
  <Grow k={k} at={[STUPA[0], 0, STUPA[1]]}>
    <group scale={[1.15, 1.25, 1.15]}>
    <Box p={[0, 0.25, 0]} s={[3.0, 0.5, 3.0]} c="#efe9dc" />
    <Box p={[0, 0.7, 0]} s={[2.5, 0.4, 2.5]} c="#f3eee2" />
    <Box p={[0, 1.45, 0]} s={[2.0, 1.1, 2.0]} c="#f5f1e6" />
    <mesh position={[0, 3.0, 0]} rotation-y={Math.PI / 4} castShadow>
      <cylinderGeometry args={[0.18, 1.35, 2.0, 4]} />
      <meshStandardMaterial color="#f5f1e6" roughness={0.7} flatShading />
    </mesh>
    <mesh position={[0, 4.35, 0]} rotation-y={Math.PI / 4} castShadow>
      <coneGeometry args={[0.2, 0.9, 4]} />
      <meshStandardMaterial color="#d8a93c" metalness={0.5} roughness={0.35} emissive="#ffb84a" emissiveIntensity={night * 0.8} />
    </mesh>
    </group>
  </Grow>
);

const Choengchum: React.FC<{t: number; Y: number; night: number}> = ({t, Y, night}) => {
  const k = Y > 1200 ? 1 : khmerK(t);
  const s = Y > 1600 ? 1 : stupaK(t);
  const viharn = smooth01(ramp(Y, 1826.5, 1827));
  return (
    <>
      {/* the laterite prasat, inside the stupa once it is closed over */}
      {s < 0.98 && <Prang pos={[STUPA[0], 0, STUPA[1]]} k={k} scale={0.95} color={LATERITE} />}
      <LanXangStupa k={s} night={night} />
      {/* the cloister round it and the old sim (2370) */}
      {s > 0.5 &&
        [[0, -2.4, 5, 0.18], [0, 2.4, 5, 0.18], [-2.4, 0, 0.18, 5], [2.4, 0, 0.18, 5]].map(([x, z, w, d], i) => (
          <Box key={i} p={[x, 0.25, z]} s={[w, 0.5, d]} c="#e9e2d2" />
        ))}
      <Viharn pos={[STUPA[0] + 3.6, 0, STUPA[1]]} k={viharn} scale={0.7} rot={Math.PI / 2} />
      {/* สระพังทอง, the baray */}
      {k > 0.02 && (
        <mesh position={[SRA_PHANG[0], 0.06, SRA_PHANG[1]]} rotation-x={-Math.PI / 2} scale={[k, k, 1]}>
          <planeGeometry args={[2.4, 1.6]} />
          <meshStandardMaterial color={WATER} roughness={0.25} />
        </mesh>
      )}
      <KhomBridge k={k} />
      {/* the other Khmer sanctuaries: Narai Cheng Weng (sandstone, drawn at the tile edge), Phra That Dum (three brick towers) */}
      <Prang pos={[NARAI[0], 0, NARAI[1]]} k={k} scale={1.6} color="#b9a183" />
      {[-0.9, 0, 0.9].map((x) => (
        <Prang key={x} pos={[THAT_DUM[0] + x, 0, THAT_DUM[1]]} k={k} scale={x ? 0.8 : 1.0} color="#a5583a" />
      ))}
    </>
  );
};

const Brahmins: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: BRAHMINS}, (_, i) => {
      const b = brahminAt(i, t);
      if (!b) return null;
      return (
        <group key={i} position={[b.x, 0, b.z]} rotation-y={b.rot} scale={0.5}>
          <Walker step={b.moving ? t * 1.4 + i * 0.3 : 0} i={0} still={!b.moving} />
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ Sakon Thawapi, the people led away, the Tai Yo
const RING = Array.from({length: 22}, (_, i) => {
  const a = (i / 22) * Math.PI * 2;
  const r = i % 2 ? 4.4 : 3.6;
  return {x: KHA_THAT[0] + Math.cos(a) * r, z: KHA_THAT[1] + Math.sin(a) * r, rot: -a};
});
const OUTER = Array.from({length: 30}, (_, i) => {
  const a = i * 2.39996;
  const r = 5.4 + (i % 5) * 0.9;
  return {x: Math.cos(a) * r * 0.9, z: Math.sin(a) * r * 1.1 - 1.2, rot: a};
});
const Thawapi: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  // the ข้าพระธาตุ ring stands from Lan Xang to the new town of 2381; the outer houses go in 2370
  if (Y < 1590 || Y > 1845) return null;
  const outer = Y < 1700 ? 0 : Y > 1828 ? 0 : 1 - emptyK(t);
  const ringK = Y > 1839 ? 1 - ramp(Y, 1839, 1845) : 1;
  return (
    <>
      {ringK > 0.02 &&
        RING.map((h, i) => (
          <group key={i} position={[h.x, 0, h.z]} rotation-y={h.rot} scale={[0.6, 0.6 * ringK, 0.6]}>
            <Hut />
          </group>
        ))}
      {outer > 0.02 &&
        OUTER.map((h, i) => (
          <group key={i} position={[h.x, 0, h.z]} rotation-y={h.rot} scale={[0.6, 0.6 * outer, 0.6]}>
            <Hut c="#97704a" />
          </group>
        ))}
    </>
  );
};

const Leaving: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: LEAVE_N}, (_, i) => {
      const c = leaveAt(i, t);
      if (!c || c.fade < 0.05) return null;
      return (
        <group key={i} position={[c.x, 0, c.z]} rotation-y={c.rot} scale={0.55 * c.fade}>
          {i % 6 === 5 ? <Cart step={t * 1.2} /> : <Walker step={t * 1.4 + i * 0.3} i={i} load={i % 3 === 0} />}
        </group>
      );
    })}
  </>
);

const Arriving: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: ARRIVE_N}, (_, i) => {
      const c = arriveAt(i, t);
      if (!c) return null;
      const step = c.moving ? t * 1.6 + i * 0.3 : 0;
      const kind = i === 2 || i === 3 ? 'elephant' : i >= ARRIVE_N - 4 ? 'cart' : 'walker';
      return (
        <group key={i} position={[c.x, 0, c.z]} rotation-y={c.rot}>
          {kind === 'elephant' ? (
            <group scale={0.62}>
              <Elephant step={step} howdah />
            </group>
          ) : kind === 'cart' ? (
            <group scale={0.6}>
              <Cart step={step} />
            </group>
          ) : (
            <group scale={0.55}>
              <Walker step={step} i={i} still={!c.moving} load={i % 4 === 1} />
            </group>
          )}
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ 2427: the rafts and Tha Rae
/** a seated passenger: a white or indigo shirt and a dark head, no legs (the Walker on stalks read as mushrooms) */
const Sitter: React.FC<{c: string}> = ({c}) => (
  <group>
    <mesh position={[0, 0.16, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.13, 0.32, 8]} />
      <meshStandardMaterial color={c} roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.39, 0]} castShadow>
      <sphereGeometry args={[0.08, 10, 8]} />
      <meshStandardMaterial color="#3a2a20" roughness={0.9} />
    </mesh>
  </group>
);

const Rafts: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: RAFTS}, (_, i) => {
      const r = raftAt(i, t);
      if (!r) return null;
      return (
        <group key={i} position={[r.x, 0.02 + Math.sin(t * 2 + i) * 0.03, r.z]} rotation-y={r.rot + Math.PI / 2}>
          {/* a plain bamboo raft (the Phetchabun relic raft carries a gilt dais and parasols) */}
          {Array.from({length: 7}, (_, k) => (
            <mesh key={k} position={[0, 0.26, (k - 3) * 0.26]} rotation-z={Math.PI / 2} castShadow>
              <cylinderGeometry args={[0.13, 0.13, 2.6, 6]} />
              <meshStandardMaterial color="#c2a66a" roughness={0.9} />
            </mesh>
          ))}
          {/* a family on each raft, sitting, and one poling at the stern */}
          {[[-0.45, -0.2], [0, 0.15], [0.4, -0.15]].map(([x, z], j) => (
            <group key={j} position={[x, 0.38, z]} scale={1.1}>
              <Sitter c={(i + j) % 3 === 0 ? '#2f3b63' : '#f4f1ea'} />
            </group>
          ))}
          <group position={[1.1, 0.38, 0]} rotation-z={0.35 * Math.sin(t * 2.2 + i)}>
            <Box p={[0, 0.5, 0]} s={[0.04, 1.6, 0.04]} c="#8a6a3e" />
          </group>
        </group>
      );
    })}
  </>
);

/** the Tha Rae church: a long nave with a pitched roof, a bell tower and spire at the lake end, a cross */
const Church: React.FC<{big: number; lit?: string}> = ({big, lit}) => {
  const L = 2.6 + big * 1.2;
  const W = 1.0 + big * 0.3;
  const H = 0.9 + big * 0.3;
  return (
    <group>
      <Box p={[0, H / 2, 0]} s={[W, H, L]} c="#f3eee4" e={lit} />
      <mesh position={[0, H + 0.28, 0]} rotation-z={Math.PI / 4} scale={[1, 1, 1]} castShadow>
        <boxGeometry args={[W * 0.72, W * 0.72, L]} />
        <meshStandardMaterial color="#9b4a33" roughness={0.8} />
      </mesh>
      {/* the bell tower at the lake (south) end, and its spire and cross */}
      <Box p={[0, H * 0.9, L / 2 + 0.3]} s={[0.7, H * 1.8, 0.7]} c="#f6f2ea" e={lit} />
      <mesh position={[0, H * 1.8 + 0.6, L / 2 + 0.3]} rotation-y={Math.PI / 4} castShadow>
        <coneGeometry args={[0.45, 1.2, 4]} />
        <meshStandardMaterial color="#7d8790" roughness={0.6} flatShading />
      </mesh>
      <Box p={[0, H * 1.8 + 1.45, L / 2 + 0.3]} s={[0.05, 0.5, 0.05]} c="#e9e3d2" />
      <Box p={[0, H * 1.8 + 1.55, L / 2 + 0.3]} s={[0.28, 0.05, 0.05]} c="#e9e3d2" />
    </group>
  );
};

/** a two-storey French-Vietnamese shophouse row: rendered walls, a tiled roof */
const Shophouses: React.FC<{lit?: string; c: string}> = ({lit, c}) => (
  <group>
    <Box p={[0, 0.4, 0]} s={[1.9, 0.8, 0.7]} c={c} e={lit} ei={0.4} />
    <Box p={[0, 0.84, 0]} s={[2.0, 0.08, 0.8]} c="#8e4a32" />
    {[-0.7, -0.23, 0.23, 0.7].map((x) => (
      <Box key={x} p={[x, 0.55, 0.36]} s={[0.18, 0.22, 0.02]} c="#5d6b6f" />
    ))}
  </group>
);

const ThaRae: React.FC<{t: number; Y: number; night: number}> = ({t, Y, night}) => {
  const k = thaRaeK(t, Y);
  if (k < 0.02) return null;
  // the church by the shore (the chapel of the 1880s grows into today's cathedral), and the grid of streets behind it
  const big = smooth01(ramp(Y, 1950, 1960));
  const lit = night > 0.3 ? '#ffd9a0' : undefined;
  const walls = ['#efe2c4', '#e8d3a6', '#f1ece2', '#e3c995'];
  return (
    <group position={[THA_RAE[0], 0, THA_RAE[1]]} scale={1.6}>
      <Grow k={k} at={[0, 0, 0.9]}>
        <Church big={big} lit={lit} />
      </Grow>
      {Array.from({length: 12}, (_, i) => {
        const gx = (i % 3) - 1;
        const gz = Math.floor(i / 3);
        if (gx === 0 && gz === 0) return null; // the church's square
        return (
          <Grow key={i} k={clamp01(k * 1.4 - i * 0.03)} at={[gx * 2.3, 0, -0.9 - gz * 1.15]}>
            <Shophouses lit={lit} c={walls[i % walls.length]} />
          </Grow>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ 2487: the drop over Phu Phan
const Transport: React.FC<{prop: number}> = ({prop}) => (
  <group>
    <mesh position={[0, 0.5, 0]} rotation-x={Math.PI / 2} castShadow>
      <cylinderGeometry args={[0.26, 0.18, 2.6, 10]} />
      <meshStandardMaterial color="#6f7764" metalness={0.3} roughness={0.55} />
    </mesh>
    <Box p={[0, 0.58, 0.15]} s={[3.4, 0.06, 0.5]} c="#68705e" />
    <Box p={[0, 0.75, -1.15]} s={[0.06, 0.6, 0.4]} c="#68705e" />
    <Box p={[0, 0.55, -1.15]} s={[1.1, 0.05, 0.3]} c="#68705e" />
    {[-0.85, 0.85].map((x) => (
      <group key={x} position={[x, 0.52, 0.5]}>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.12, 0.12, 0.6, 8]} />
          <meshStandardMaterial color="#565c52" />
        </mesh>
        <mesh position={[0, 0, 0.32]} rotation-z={prop}>
          <boxGeometry args={[0.7, 0.05, 0.02]} />
          <meshStandardMaterial color="#2c2c2c" />
        </mesh>
      </group>
    ))}
  </group>
);

const Drop: React.FC<{t: number; night: number; terrainH: LandmarkProps['terrainH']}> = ({t, night, terrainH}) => {
  const k = beatK('drop', t);
  if (k < -0.05 || k > 1.25) return null;
  const fire = clamp01(k / 0.2) * clamp01((1.2 - k) / 0.2);
  return (
    <>
      {[0, 1].map((i) => {
        const p = planeAt(i, t);
        return p ? (
          <group key={i} position={[p.x, p.y, p.z]} rotation-y={p.rot} scale={2.6}>
            <Transport prop={t * 40} />
          </group>
        ) : null;
      })}
      {Array.from({length: CHUTES}, (_, j) => {
        const c = chuteAt(j, t);
        if (!c) return null;
        return (
          <group key={j} position={[c.x, c.y, c.z]} scale={2.2}>
            {c.open > 0.02 && (
              <mesh position={[0, 0.9, 0]} scale={[0.75 * c.open, 0.45 * c.open, 0.75 * c.open]}>
                <sphereGeometry args={[1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#f2efe6" roughness={0.8} side={THREE.DoubleSide} />
              </mesh>
            )}
            <Box p={[0, 0, 0]} s={[0.3, 0.26, 0.3]} c="#6b5a3a" />
          </group>
        );
      })}
      {/* the signal fires on the hills that answer the planes */}
      {fire > 0.02 &&
        [[PHU_PHAN[0] + 2, PHU_PHAN[1] - 6], [PHU_PHAN[0] + 5, PHU_PHAN[1] - 3], [PHU_PHAN[0] - 1, PHU_PHAN[1] - 8]].map(([x, z], i) => (
          <mesh key={i} position={[x, terrainH(x, z) + 0.4 + 0.08 * Math.sin(t * 9 + i), z]} scale={(0.35 + 0.2 * night) * fire}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial color="#ffb050" toneMapped={false} />
          </mesh>
        ))}
    </>
  );
};

// ------------------------------------------------------------------ the modern town: the hall, the clock tower, the airport
const Civic: React.FC<{Y: number; night: number; terrainH: LandmarkProps['terrainH']}> = ({Y, night, terrainH}) => {
  const old = smooth01(ramp(Y, 1963.6, 1964.6)) * (1 - ramp(Y, 1997.6, 1998));
  const neu = smooth01(ramp(Y, 1997.6, 1998.6));
  const clock = smooth01(ramp(Y, 1966, 1967));
  const gate = smooth01(ramp(Y, 1990, 1991));
  const lit = night > 0.3 ? '#ffd9a0' : undefined;
  return (
    <>
      <Grow k={old} at={[HALL[0], 0, HALL[1]]}>
        <Box p={[0, 0.5, 0]} s={[3.2, 1, 1.6]} c="#efe6d2" e={lit} />
        <mesh position={[0, 1.25, 0]} scale={[2, 0.5, 1.1]} rotation-y={Math.PI / 4}>
          <coneGeometry args={[1.2, 1, 4]} />
          <meshStandardMaterial color="#9a4a32" flatShading />
        </mesh>
      </Grow>
      <Grow k={neu} at={[HALL[0], 0, HALL[1]]}>
        <Box p={[0, 1.0, 0]} s={[4.2, 2.0, 1.9]} c="#f1eadb" e={lit} />
        <mesh position={[0, 2.35, 0]} scale={[2.4, 0.7, 1.2]} rotation-y={Math.PI / 4}>
          <coneGeometry args={[1.2, 1, 4]} />
          <meshStandardMaterial color="#b0452e" flatShading />
        </mesh>
      </Grow>
      <Grow k={clock} at={[CLOCK[0], 0, CLOCK[1]]}>
        <Box p={[0, 1.2, 0]} s={[0.5, 2.4, 0.5]} c="#f2efe6" />
        <mesh position={[0, 2.1, 0.26]}>
          <circleGeometry args={[0.18, 16]} />
          <meshBasicMaterial color="#fffbe8" toneMapped={false} />
        </mesh>
      </Grow>
      {/* the gate monument at ลานรวมใจไทสกล */}
      <Grow k={gate} at={[CITY_GATE[0], 0, CITY_GATE[1] - 0.9]}>
        {[-0.7, 0.7].map((x) => (
          <Box key={x} p={[x, 0.7, 0]} s={[0.4, 1.4, 0.4]} c="#e6dccb" />
        ))}
        <Box p={[0, 1.5, 0]} s={[1.9, 0.3, 0.5]} c="#c99a4a" />
      </Grow>
      {/* the palace on Phu Phan (2518), drawn at the hills */}
      <Grow k={smooth01(ramp(Y, 1974.6, 1975.6))} at={[PALACE[0], terrainH(PALACE[0], PALACE[1]), PALACE[1]]}>
        <Box p={[0, 0.4, 0]} s={[1.8, 0.8, 1.0]} c="#efe8da" />
      </Grow>
      {/* the Seri Thai cave's mouth on the hills */}
      <mesh position={[SERI_CAVE[0], terrainH(SERI_CAVE[0], SERI_CAVE[1]) + 0.3, SERI_CAVE[1]]} scale={[0.8, 0.5, 0.3]}>
        <sphereGeometry args={[1, 10, 6]} />
        <meshStandardMaterial color="#2b2622" roughness={1} />
      </mesh>
    </>
  );
};

const Airport: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = smooth01(ramp(Y, 1984.5, 1985.5));
  if (k < 0.02) return null;
  const p = airlinerAt(t);
  return (
    <>
      <group position={[AIRPORT[0], 0, AIRPORT[1]]} rotation-y={-RUNWAY_ROT}>
        <mesh position={[0, 0.05, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[RUNWAY_L * k, 1.4]} />
          <meshStandardMaterial color="#5c5f63" roughness={1} />
        </mesh>
        {Array.from({length: 8}, (_, i) => (
          <mesh key={i} position={[(-RUNWAY_L / 2 + (i + 0.5) * (RUNWAY_L / 8)) * k, 0.07, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[0.8, 0.08]} />
            <meshBasicMaterial color="#f2f0e8" />
          </mesh>
        ))}
        <Grow k={k} at={[1, 0, 2.2]}>
          <Box p={[0, 0.4, 0]} s={[3, 0.8, 1.2]} c="#e8e6e0" />
        </Grow>
      </group>
      {p && (
        <group position={[p.x, p.y, p.z]} rotation-y={p.rot} scale={1.2}>
          <mesh position={[0, 0.3, 0]} rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.24, 0.2, 2.6, 10]} />
            <meshStandardMaterial color="#f2f2f0" metalness={0.3} roughness={0.45} />
          </mesh>
          <Box p={[0, 0.3, 0.1]} s={[3, 0.05, 0.5]} c="#dfe3e8" />
          <Box p={[0, 0.6, -1.1]} s={[0.05, 0.6, 0.4]} c="#2f5aa8" />
        </group>
      )}
    </>
  );
};

// ------------------------------------------------------------------ the payoff: the wax castles, the cloth back
const WAX = '#e3b448';
/** a wax castle on its float: a stepped four-gabled tower in gold, lit at night */
const WaxCastle: React.FC<{night: number; t: number; halo: THREE.Texture}> = ({night, t, halo}) => {
  const e = 0.25 + 1.1 * night;
  const m = <meshStandardMaterial color={WAX} roughness={0.5} metalness={0.25} emissive="#ffb43a" emissiveIntensity={e} />;
  return (
    <group>
      <Box p={[0, 0.25, 0]} s={[1.4, 0.3, 2.2]} c="#7c2c22" />
      {[[0.95, 1.6], [0.7, 1.2], [0.5, 0.86]].map(([w, d], i) => (
        <mesh key={i} position={[0, 0.65 + i * 0.5, 0]} castShadow>
          <boxGeometry args={[w, 0.5, d]} />
          {m}
        </mesh>
      ))}
      <mesh position={[0, 2.4, 0]} rotation-y={Math.PI / 4} castShadow>
        <coneGeometry args={[0.32, 1.3, 4]} />
        {m}
      </mesh>
      <sprite position={[0, 1.4, 0]} scale={[3.4 * (0.4 + night), 3.4 * (0.4 + night), 1]}>
        <spriteMaterial map={halo} transparent opacity={0.35 + 0.35 * night + 0.05 * Math.sin(t * 6)} depthWrite={false} toneMapped={false} />
      </sprite>
    </group>
  );
};

const Procession: React.FC<{t: number; Y: number; night: number}> = ({t, Y, night}) => {
  const halo = useMemo(() => glowTexture('rgba(255,236,190,1)', 'rgba(255,170,80,0.5)'), []);
  const k = beatK('payoff', t);
  if (Y < 2024.9 || k > 1.5) return null;
  const b = bannerK(t);
  return (
    <>
      {Array.from({length: CASTLES}, (_, i) => {
        const c = castleAt(i, t);
        if (!c) return null;
        return (
          <group key={i} position={[c.x, 0, c.z]} rotation-y={c.rot}>
            <group scale={0.62}>
              <WaxCastle night={night} t={t + i} halo={halo} />
            </group>
            {/* dancers in indigo ahead of each float */}
            {Array.from({length: 6}, (_, j) => (
              <group key={j} position={[(j % 2 ? 0.45 : -0.45), 0, 1.1 + Math.floor(j / 2) * 0.55]} scale={0.38}>
                <Walker step={t * 1.2 + j * 0.4} i={2} />
              </group>
            ))}
          </group>
        );
      })}
      {/* the crowd along the route */}
      {Array.from({length: 30}, (_, i) => {
        const x = -6 + (i % 15) * 0.4;
        const z = 2.9 + (i < 15 ? -0.9 : 0.9);
        return (
          <group key={`c${i}`} position={[x, 0, z]} rotation-y={i < 15 ? 0 : Math.PI} scale={0.36}>
            <Walker step={0} i={i} still />
          </group>
        );
      })}
      {/* the hero back: the indigo cloth hung over the route on its bamboo frame */}
      {b > 0.02 && (
        <group position={[BANNER_AT[0], 0, BANNER_AT[1]]} scale={[PAY_S * 0.3, PAY_S * 0.3 * b, PAY_S * 0.3]}>
          <DyedCloth t={t} S={2} green={1} blue={1} lift={0.4} pot={false} />
        </group>
      )}
    </>
  );
};

export const SakonNakhonLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH}) => (
  <>
    <HeroCloth t={t} />
    <LegendTown t={t} />
    <Lake t={t} />
    <DonSawan />
    <Choengchum t={t} Y={Y} night={night} />
    <Brahmins t={t} />
    <Thawapi t={t} Y={Y} />
    <Leaving t={t} />
    <Arriving t={t} />
    <Rafts t={t} />
    <ThaRae t={t} Y={Y} night={night} />
    <Drop t={t} night={night} terrainH={terrainH} />
    <Civic Y={Y} night={night} terrainH={terrainH} />
    <Airport t={t} Y={Y} />
    <Procession t={t} Y={Y} night={night} />
  </>
);
