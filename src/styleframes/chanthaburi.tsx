// Throwaway style frames for Chanthaburi's cover (6 Nov 2026; docs/briefs/chanthaburi.md). The rules from
// experiments §17-§18: the symbol moves AND fills ~1/3 of the frame at second 0, it is half-made by hand at
// frame 0 (no blank canvas), and its change is of shape, not only of colour.
// A: the town's own symbol, a sapphire (พลอยเมืองจันท์) being cut. A giant stone is held on a dop stick
// (ไม้ติดพลอย) against a spinning lap (จานเจียร); at frame 0 half of its grey crust is already gone and the
// blue crown facets show; the last chips fly off by 2.2 s, each leaving a glint, then the finished gem lifts
// off the lap and turns. A1 on the whole tile, A2 closer. B: ทุบหม้อข้าว, the night of 2310: a row of cooking
// pots smashed one after another before the walls, then the soldiers move on the gate (drawn by day here;
// the clip has it at night). Shapes are placeholders until the layout lands.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {Walker} from '../cities/nan/figures';
import {lathe} from '../engine/parts';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const FIELD: P2 = [0, -4];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const AZ = 18;
const A = (AZ * Math.PI) / 180;
const CUT_END = 2.2;

const SAPPHIRE = '#1f4fc4';
const SAPPHIRE_GLOW = '#0c2a88';
const CRUST = '#5e5850';

// a round brilliant, culet at 0, girdle radius 1, table at 0.63 (a lathe of 8 sides reads as facets)
const GEM: [number, number][] = [
  [0, 0], [0.5, 0.42], [1, 0.84], [1, 0.9], [0.8, 1.02], [0.56, 1.12], [0, 1.12],
];
const GEM_YS = 1; // the pavilion is drawn deeper than a true brilliant's so its point reads at thumbnail size

/** the gem with one shade per facet, so the cut reads even in flat light */
const gemGeometry = (hex: string) => {
  const g = lathe(GEM.map(([r, y]) => [r, y * GEM_YS] as [number, number]), 8).toNonIndexed();
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  const base = new THREE.Color(hex);
  for (let f = 0; f < n / 3; f++) {
    const k = 0.55 + hash(f * 3.7) * 0.75;
    for (let v = 0; v < 3; v++) {
      col[(f * 3 + v) * 3] = Math.min(1, base.r * k);
      col[(f * 3 + v) * 3 + 1] = Math.min(1, base.g * k);
      col[(f * 3 + v) * 3 + 2] = Math.min(1, base.b * k);
    }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
};

/** points on the crown and girdle, in the gem's own frame, where the crust sits */
const crustSpots = (() => {
  const out: {p: [number, number, number]; n: [number, number, number]; tf: number; r: number}[] = [];
  let k = 0;
  for (let ring = 0; ring < 4; ring++) {
    const count = ring === 0 ? 3 : 8;
    for (let j = 0; j < count; j++) {
      const a = (j / count) * Math.PI * 2 + ring * 0.4;
      const rr = [0.25, 0.7, 0.99, 0.62][ring];
      const y = [1.14, 1.05, 0.87, 0.52][ring];
      const ny = [1, 0.7, 0.1, -0.6][ring];
      const nr = Math.sqrt(1 - ny * ny);
      // half of the crust is already gone at frame 0; the rest falls by CUT_END
      const tf = -1.4 + hash(k) * (CUT_END + 1.4);
      out.push({p: [Math.cos(a) * rr * 0.97, y * 0.98, Math.sin(a) * rr * 0.97], n: [Math.cos(a) * nr, ny, Math.sin(a) * nr], tf, r: 0.15 + hash(k + 50) * 0.1});
      k++;
    }
  }
  return out;
})();

const chunkGeo = (i: number) => {
  const g = new THREE.DodecahedronGeometry(1, 0);
  const p = g.attributes.position;
  for (let v = 0; v < p.count; v++) {
    const f = 0.75 + hash(i * 31 + v) * 0.5;
    p.setXYZ(v, p.getX(v) * f, p.getY(v) * f * 0.7, p.getZ(v) * f);
  }
  g.computeVertexNormals();
  return g;
};

/** A four-point glint, self-lit */
const Glint: React.FC<{p: [number, number, number]; s: number}> = ({p, s}) =>
  s <= 0.02 ? null : (
    <group position={p} scale={s}>
      {[0, Math.PI / 2].map((r) => (
        <mesh key={r} rotation-z={r}>
          <planeGeometry args={[0.08, 1]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );

const Gem: React.FC<{t: number; S: number; hex: string; glow: string}> = ({t, hex, glow}) => {
  const gemGeo = useMemo(() => gemGeometry(hex), [hex]);
  const chunks = useMemo(() => crustSpots.map((_, i) => chunkGeo(i)), []);
  const done = smooth(clamp01((t - CUT_END) / 1.2));
  // the gem tilts its table toward the camera; when cut it lifts off the lap and turns
  const tilt = 0.22 - 0.1 * done;
  const spin = done * (t - CUT_END) * 0.6;
  const cut = clamp01((t + 1.4) / (CUT_END + 1.4));
  return (
    <group rotation-x={tilt}>
      <group rotation-y={spin} scale={[1, GEM_YS, 1]}>
        <mesh geometry={gemGeo} scale={[1, 1 / GEM_YS, 1]} castShadow>
          <meshStandardMaterial
            color="#ffffff"
            vertexColors
            emissive={glow}
            emissiveIntensity={0.12 + 0.3 * cut}
            roughness={0.18}
            metalness={0.35}
            flatShading
            side={THREE.DoubleSide}
          />
        </mesh>
        {crustSpots.map((c, i) => {
          const u = (t - c.tf) / 0.7; // 0 at the moment it breaks off, 1 when gone
          if (u >= 1) return null;
          const fly = Math.max(0, u);
          const g = fly * fly * 1.6;
          const pos: [number, number, number] = [
            c.p[0] + c.n[0] * fly * 0.9,
            c.p[1] + c.n[1] * fly * 0.9 - g,
            c.p[2] + c.n[2] * fly * 0.9,
          ];
          const s = c.r * (1 - smooth(clamp01((u - 0.4) / 0.6)));
          return (
            <mesh key={i} geometry={chunks[i]} position={pos} scale={s} rotation={[fly * 4 + i, fly * 3, i * 0.7]} castShadow>
              <meshStandardMaterial color={CRUST} roughness={1} flatShading />
            </mesh>
          );
        })}
        {crustSpots.map((c, i) => {
          const u = (t - c.tf) / 0.55;
          if (u < 0 || u > 1) return null;
          return <Glint key={i} p={[c.p[0] * 1.02, c.p[1] + 0.02, c.p[2] * 1.02]} s={0.55 * Math.sin(u * Math.PI)} />;
        })}
        {done > 0.02 && <Glint p={[0.3, 1.14, 0.2]} s={0.9 * Math.sin(clamp01((t - CUT_END - 0.4) / 0.8) * Math.PI)} />}
      </group>
    </group>
  );
};

/** the spinning lap, with chips flying off its contact point while the stone is cut */
const Lap: React.FC<{t: number; R: number; H: number}> = ({t, R, H}) => {
  const turn = t * 7;
  const cutting = t < CUT_END + 0.2;
  return (
    <group>
      {/* the low wooden stand of the lap, on four legs */}
      <mesh position={[0, H * 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[R * 2.15, H * 0.3, R * 2.15]} />
        <meshStandardMaterial color="#6e4b2e" roughness={0.9} />
      </mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], k) => (
        <mesh key={k} position={[sx * R, H * 0.35, sz * R]} castShadow>
          <boxGeometry args={[R * 0.12, H * 0.7, R * 0.12]} />
          <meshStandardMaterial color="#5a3b22" roughness={0.9} />
        </mesh>
      ))}
      <group position={[0, H + R * 0.04, 0]} rotation-y={turn}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[R, R, R * 0.08, 48]} />
          <meshStandardMaterial color="#9aa0a8" roughness={0.35} metalness={0.6} />
        </mesh>
        {[0, 1, 2, 3].map((k) => (
          <mesh key={k} position={[0, R * 0.041, 0]} rotation-y={(k * Math.PI) / 4}>
            <boxGeometry args={[R * 1.96, R * 0.004, R * 0.03]} />
            <meshStandardMaterial color="#5c626b" roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, R * 0.05, 0]}>
          <cylinderGeometry args={[R * 0.08, R * 0.08, R * 0.04, 16]} />
          <meshStandardMaterial color="#3d4148" />
        </mesh>
      </group>
      {cutting &&
        Array.from({length: 36}, (_, i) => {
          const ph = (t * 1.8 + hash(i)) % 1;
          const a = -0.6 + hash(i + 9) * 1.2;
          const sp = R * (0.5 + hash(i + 3) * 0.8);
          const x = Math.cos(a) * sp * ph;
          const z = R * 0.35 + Math.sin(a) * sp * ph * 0.4 + sp * ph * 0.5;
          const y = H + R * 0.1 + sp * ph * 0.5 - ph * ph * sp * 0.9;
          if (y < 0.05) return null;
          return (
            <mesh key={i} position={[x, y, z]} scale={R * 0.018 * (1 - ph)}>
              <octahedronGeometry args={[1, 0]} />
              <meshBasicMaterial color={i % 3 ? '#cfe0ff' : '#ffffff'} toneMapped={false} />
            </mesh>
          );
        })}
    </group>
  );
};

const Cutting: React.FC<{t: number; S: number; hex?: string; glow?: string}> = ({t, S, hex = SAPPHIRE, glow = SAPPHIRE_GLOW}) => {
  const R = 0.85 * S;
  const H = 0.35 * S;
  const done = smooth(clamp01((t - CUT_END) / 1.2));
  // the stone sits on the lap's front edge; when cut it rises
  const gemY = H + 0.08 * R + done * 0.3 * S;
  return (
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={A}>
      <Lap t={t} R={R} H={H} />
      <group position={[0, gemY, R * 0.2]} scale={S}>
        <Gem t={t} S={S} hex={hex} glow={glow} />
      </group>
    </group>
  );
};

// ---------- B: ทุบหม้อข้าว ----------

const POT: [number, number][] = [
  [0, 0], [0.3, 0], [0.45, 0.12], [0.52, 0.35], [0.5, 0.58], [0.38, 0.74], [0.3, 0.8], [0.33, 0.86], [0.3, 0.88],
];

const PotSmash: React.FC<{t: number; S: number}> = ({t, S}) => {
  const potGeo = useMemo(() => lathe(POT, 20), []);
  const pots = useMemo(
    () =>
      Array.from({length: 14}, (_, i) => ({
        x: (i - 6.5) * 0.7 * S + (i % 2 ? 0.08 : -0.08) * S,
        z: (i % 2 ? 0.25 : -0.15) * S,
        tf: -0.6 + (i / 13) * 2.9 + hash(i) * 0.25,
      })),
    [S],
  );
  const march = smooth(clamp01((t - 2.8) / 4));
  return (
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={A}>
      {/* the town's earth wall and its gate, behind */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 2.5 * S, 0.35 * S, -2.2 * S]} castShadow receiveShadow>
          <boxGeometry args={[3.8 * S, 0.7 * S, 0.5 * S]} />
          <meshStandardMaterial color="#8e5b3c" roughness={0.95} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.75 * S, 0.55 * S, -2.2 * S]} castShadow>
          <boxGeometry args={[0.45 * S, 1.1 * S, 0.6 * S]} />
          <meshStandardMaterial color="#7a4a30" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.45 * S, -2.25 * S]}>
        <boxGeometry args={[1.05 * S, 0.9 * S, 0.12 * S]} />
        <meshStandardMaterial color="#4a2e1c" roughness={0.9} />
      </mesh>
      {/* the pots, smashed one after another */}
      {pots.map((p, i) => {
        const u = (t - p.tf) / 0.9;
        if (u < 0)
          return (
            <group key={i} position={[p.x, 0, p.z]} scale={[0.6 * S, 0.6 * S, 0.6 * S]}>
              <mesh geometry={potGeo} castShadow>
                <meshStandardMaterial color="#3b2b22" roughness={0.85} side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        if (u > 1) return null;
        return (
          <group key={i} position={[p.x, 0, p.z]}>
            {Array.from({length: 7}, (_, k) => {
              const a = (k / 7) * Math.PI * 2 + i;
              const sp = 0.6 * S * (0.7 + hash(i * 7 + k) * 0.6);
              const y = 0.2 * S + sp * u * 0.9 - u * u * sp * 1.1;
              return (
                <mesh
                  key={k}
                  position={[Math.cos(a) * sp * u, Math.max(0.02 * S, y), Math.sin(a) * sp * u]}
                  rotation={[u * 6 + k, u * 4, k]}
                  scale={(1 - u * 0.3) * 0.12 * S}
                  castShadow
                >
                  <boxGeometry args={[1, 0.25, 0.8]} />
                  <meshStandardMaterial color="#3b2b22" roughness={0.85} />
                </mesh>
              );
            })}
            {u < 0.5 && (
              <mesh position={[0, 0.3 * S, 0]} scale={0.25 * S * (0.4 + u * 1.6)}>
                <sphereGeometry args={[1, 12, 10]} />
                <meshBasicMaterial color="#e9e2d0" transparent opacity={0.5 * (1 - u * 2)} />
              </mesh>
            )}
          </group>
        );
      })}
      {/* the soldiers behind the pots, then moving on the gate */}
      {Array.from({length: 18}, (_, i) => {
        const x = (i - 8.5) * 0.5 * S;
        const z0 = 0.9 * S + (i % 3) * 0.25 * S;
        const z = z0 - march * (z0 + 1.5 * S) - (i % 3) * 0.1 * S * march;
        const xx = x * (1 - march * 0.75);
        return (
          <group key={i} position={[xx, 0, z]} rotation-y={Math.PI} scale={0.32 * S}>
            <Walker step={t * 1.6 + i * 0.3} i={i} spear still={march < 0.02} />
          </group>
        );
      })}
    </group>
  );
};

const keys = (target: number, d: [number, number, number], el: number) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1700, 1700.4],
        camera: [
          [0, FIELD[0], target, FIELD[1], d[0], AZ, el, 30],
          [3, FIELD[0], target * 1.04, FIELD[1], d[1], AZ + 8, el + 2, 30],
          [8, FIELD[0], target * 1.08, FIELD[1], d[2], AZ + 18, el + 5, 30],
        ],
      },
    ],
  });

const base = (id: string, Hero: React.FC<{t: number}>, target: number, d: [number, number, number], el: number, clear: number): CityConfig => {
  const STORY = keys(target, d, el);
  const L: React.FC<LandmarkProps> = ({t}) => <Hero t={t} />;
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'จันทบุรี', sub: 'เมืองพลอยริมแม่น้ำจันท์'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      peaks: [[-50, -42, 8, 11], [-34, -52, 6, 9]],
      rivers: [],
      bridges: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      clearings: [[FIELD[0], FIELD[1], clear, -1e9]],
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

const S_A = 28;
export const CHANTHABURI_A1 = base('chanthaburi-a1', ({t}) => <Cutting t={t} S={S_A} />, 0.95 * S_A, [300, 310, 340], 10, 2.4 * S_A);
// A2: the same cut on a yellow sapphire (บุษราคัม), the other stone Khao Ploi Waen is known for
export const CHANTHABURI_A2 = base('chanthaburi-a2', ({t}) => <Cutting t={t} S={S_A} hex="#e8a915" glow="#7a4a00" />, 0.95 * S_A, [300, 310, 340], 10, 2.4 * S_A);
const S_B = 12;
export const CHANTHABURI_B = base('chanthaburi-b', ({t}) => <PotSmash t={t} S={S_B} />, 0.6 * S_B, [250, 260, 290], 36, 4.2 * S_B);
