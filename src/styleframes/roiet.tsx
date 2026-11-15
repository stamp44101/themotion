// Throwaway style frames for Roi Et's cover (15 Nov 2026; docs/briefs/roiet_research.md). The rules from experiments
// §17-§20: the symbol fills ~1/3 of the frame at second 0 on the whole land tile at legend scale; it is half made by hand at
// frame 0 (no blank canvas) and changes shape, not only colour.
// A1: แคน. A giant khaen (แคนแปด, 2 rafts of 8 bamboo pipes through a ประดู่ windchest) lying on the land; at frame 0 half
//   its pipes are in; the rest slide in one by one and the rattan bands tie them; then it lifts and its pipes light pair by
//   pair as it plays. The town's own craft ("แหล่งผลิตแคนลือเลื่อง", Ban Si Kaeo).
// A2: โหวด. A giant wot standing upright, the province's own instrument and the shape of หอโหวด ๑๐๑: half its ring of
//   bamboo pipes stands round the hub at frame 0; the rest drop in one at a time (tallest to shortest, a spiral), the black
//   wax ring seals the foot, then it spins and rings of sound roll out over the land. The tower takes this shape at the end.
// B: ข้าวหอมมะลิ. A giant sheaf of jasmine rice: half its stalks bound at frame 0, the rest swing in, the straw band ties
//   round, and the green ears ripen to gold and droop.
// The land is the real map at 100 m/unit, origin the city pillar on the island in บึงพลาญชัย (OSM): the Dvaravati moat
// (คลองคูเมือง, its centreline from OSM relation 14556044), a broken earth bank inside it, the bueng with its island; in
// 2317 the ruined town is ดงกุ่ม, forest inside the moat.
import React from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
/** the moat's centreline from OSM (resampled every 7.5 degrees round (-1.2, -1.4)); the filled NW stretch is closed again */
export const MOAT: P2[] = [
  [7.1, -1.4], [7.0, -0.3], [6.8, 0.8], [6.7, 1.9], [6.6, 3.1], [6.4, 4.4], [6.3, 6.1], [5.4, 7.2], [3.8, 7.3], [2.4, 7.4],
  [1.2, 7.5], [0.0, 7.6], [-1.2, 7.7], [-2.4, 7.8], [-3.7, 7.9], [-5.1, 7.9], [-6.6, 8.0], [-8.5, 8.1], [-9.8, 7.2],
  [-10.1, 5.4], [-9.9, 3.6], [-9.7, 2.1], [-9.3, 0.6], [-9.3, -1.5], [-9.3, -3.5], [-9.3, -6.1], [-8.6, -7.1], [-7.7, -7.9],
  [-6.5, -8.3], [-5.2, -8.3], [-4.0, -8.0], [-3.0, -8.1], [-2.1, -8.3], [-1.2, -8.5], [-0.2, -8.7], [0.8, -8.8], [2.0, -9.1],
  [3.3, -9.2], [4.9, -9.4], [6.5, -9.1], [7.4, -8.0], [7.5, -6.4], [7.5, -5.0], [7.5, -3.7], [7.3, -2.5],
];
/** บึงพลาญชัย (OSM relation 2222833): the outer shore and the island's two lobes */
export const BUENG: P2[] = [
  [-0.6, 1.0], [-0.3, 0.7], [0.2, 0.9], [0.5, 0.9], [0.7, 0.8], [0.8, 0.2], [0.8, -0.1], [0.7, -0.9], [0.5, -1.4],
  [0.1, -2.2], [-0.5, -3.0], [-0.9, -3.3], [-1.2, -3.5], [-1.8, -3.5], [-2.4, -3.4], [-2.9, -3.3], [-3.2, -3.2],
  [-3.4, -2.9], [-3.6, -2.4], [-3.7, -1.7], [-3.6, -1.2], [-3.4, -0.7], [-2.8, 0.1], [-2.3, 0.6], [-1.6, 1.1], [-0.9, 1.2],
];
export const ISLAND: P2[] = [
  [-2.3, -0.9], [-2.2, -0.5], [-2.0, -0.1], [-1.4, 0.0], [-0.7, 0.3], [-0.3, 0.5], [0.1, 0.5], [0.3, 0.2], [0.2, -0.2],
  [0.0, -0.4], [-0.4, -0.05], [-0.6, -0.3], [-0.6, -0.7], [-0.5, -1.2], [-0.6, -1.8], [-0.9, -2.1], [-1.3, -2.5],
  [-1.9, -2.6], [-2.5, -2.6], [-2.7, -2.1], [-2.7, -1.6], [-2.5, -1.3],
];
const WATER = '#3d6f80';
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

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
const BUENG_SHAPE = shapeOf(BUENG, [ISLAND]);

/** a puff that bursts out and fades, self-lit (dust, chips) */
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

/** the old town: the bueng (shallow, reedy in 2317) and a broken earth bank just inside the moat */
const OldTown: React.FC = () => {
  const bank: React.ReactNode[] = [];
  const n = MOAT.length;
  for (let i = 0; i < n; i++) {
    if (hash(i * 3.1) < 0.28) continue; // gaps: the bank is a ruin
    const a = MOAT[i];
    const b = MOAT[(i + 1) % n];
    // pull the bank 0.7 units in toward the town's middle
    const pull = (p: P2): P2 => {
      const dx = -1.2 - p[0];
      const dz = -0.4 - p[1];
      const d = Math.hypot(dx, dz);
      return [p[0] + (dx / d) * 0.7, p[1] + (dz / d) * 0.7];
    };
    const [ax, az] = pull(a);
    const [bx, bz] = pull(b);
    const h = 0.25 + hash(i) * 0.25;
    bank.push(
      <mesh key={i} position={[(ax + bx) / 2, h / 2, (az + bz) / 2]} rotation-y={Math.atan2(bx - ax, bz - az)} castShadow receiveShadow>
        <boxGeometry args={[0.6, h, Math.hypot(bx - ax, bz - az) + 0.2]} />
        <meshStandardMaterial color="#9a8458" roughness={1} />
      </mesh>,
    );
  }
  return (
    <group>
      <mesh position={[0, -1.3, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <extrudeGeometry args={[BUENG_SHAPE, {depth: 1.4, bevelEnabled: false}]} />
        <meshStandardMaterial color="#4f7a6a" roughness={0.2} metalness={0.2} />
      </mesh>
      {bank}
    </group>
  );
};

// ---------- A1: a khaen made by hand ----------
const BAMBOO = '#d9b764';
const BAMBOO_DK = '#a8843c';
const PRADU = '#6e2a1a';
const RATTAN = '#7a4a22';
const PAIRS = 8;
const K_END = 1.9;
const LIFT0 = 2.1;
// pipes are numbered 0..15: left raft 0..7, right raft 8..15; half are in at frame 0 (the inner four of each raft)
const ORDER = [3, 4, 11, 12, 2, 5, 10, 13, 1, 6, 9, 14, 0, 7, 8, 15];
const pipeAt = (k: number) => {
  const j = ORDER.indexOf(k);
  return j < 8 ? -1 : ((j - 7) / 8) * K_END;
};

const Khaen: React.FC<{t: number; S: number}> = ({t, S}) => {
  // the khaen's own frame: pipes along +y, rafts side by side in x; the windchest a third of the way up
  const r = S * 0.03;
  const lenOf = (i: number) => S * (0.5 + 0.5 * Math.sin(((i + 0.5) / PAIRS) * Math.PI)); // longest in the middle
  const chestY = S * 0.3;
  const lift = smooth(clamp01((t - LIFT0) / 0.9));
  const bands = smooth(clamp01((t - (K_END - 0.2)) / 0.5));
  const playing = t > LIFT0 + 0.6;
  return (
    // lying on the land, its foot toward the camera; it lifts to lean up at ~32 degrees
    <group rotation-y={0.5}>
      <group rotation-x={-Math.PI / 2 + lift * 0.42} position={[0, r * 2.2, S * 0.3]}>
      <group rotation-y={Math.PI / 2}>
        {Array.from({length: 2 * PAIRS}, (_, k) => {
          const raft = k < PAIRS ? -1 : 1;
          const i = k % PAIRS;
          const at = pipeAt(k);
          const u = at < 0 ? 1 : smooth(clamp01((t - (at - 0.28)) / 0.28));
          if (u <= 0) return null;
          const L = lenOf(i);
          const x = raft * (r * 1.05) + (raft < 0 ? -1 : 1) * 0;
          const zz = (i - (PAIRS - 1) / 2) * r * 2.1;
          // a pipe slides in from beyond its tip end
          const slide = (1 - u) * S * 0.5;
          const lit = playing && Math.floor((t - LIFT0 - 0.6) * 6) % PAIRS === i;
          return (
            <group key={k} position={[x, L / 2 + slide, zz]}>
              <mesh castShadow>
                <cylinderGeometry args={[r, r, L, 10]} />
                {lit ? (
                  <meshBasicMaterial color="#ffe08a" toneMapped={false} />
                ) : (
                  <meshStandardMaterial color={BAMBOO} roughness={0.55} />
                )}
              </mesh>
              {/* the nodes: darker rings along the pipe */}
              {[0.15, 0.48, 0.8].map((f, j) => (
                <mesh key={j} position={[0, (f - 0.5) * L, 0]}>
                  <cylinderGeometry args={[r * 1.12, r * 1.12, r * 0.4, 10]} />
                  <meshStandardMaterial color={BAMBOO_DK} roughness={0.6} />
                </mesh>
              ))}
              {u < 1 && u > 0.85 && <Puff u={(u - 0.85) / 0.15} seed={k} S={S * 0.12} color="#f6e2a8" n={5} />}
            </group>
          );
        })}
        {/* the windchest (เต้า) of ประดู่, a fat spindle round the pipes, with its mouthpiece */}
        <mesh position={[0, chestY, 0]} scale={[r * 2.4, r * 2.8, r * 8.8]} castShadow>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color={PRADU} roughness={0.45} />
        </mesh>
        <mesh position={[r * 3.2, chestY, 0]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[r * 0.7, r * 0.9, r * 2.2, 10]} />
          <meshStandardMaterial color={PRADU} roughness={0.45} />
        </mesh>
        {/* rattan bands tying the rafts, wound on once every pipe is in */}
        {bands > 0 &&
          [0.62, 0.88].map((f, j) => (
            <mesh key={j} position={[0, S * f, 0]} scale={[1, 1, 1]}>
              <boxGeometry args={[r * 4.6 * bands, r * 0.7, PAIRS * r * 2.25]} />
              <meshStandardMaterial color={RATTAN} roughness={0.8} />
            </mesh>
          ))}
      </group>
      </group>
      {/* the sound: rings rolling out over the land while it plays */}
      {playing &&
        [0, 1, 2].map((j) => {
          const u = ((t - LIFT0 - 0.6) * 0.8 + j / 3) % 1;
          return (
            <mesh key={j} position={[0, 0.3, 0]} rotation-x={-Math.PI / 2} scale={S * (0.3 + u * 0.9)}>
              <ringGeometry args={[0.97, 1, 64]} />
              <meshBasicMaterial color="#ffe6a0" toneMapped={false} transparent opacity={(1 - u) * 0.7} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
    </group>
  );
};

// ---------- A2: a wot, the shape of หอโหวด ๑๐๑ ----------
const WOTS = 14;
const W_END = 1.9;
const SPIN0 = 2.1;
const wotAt = (k: number) => (k < WOTS / 2 ? -1 : ((k - WOTS / 2 + 1) / (WOTS / 2)) * W_END);

const Wot: React.FC<{t: number; S: number}> = ({t, S}) => {
  const R = S * 0.1; // ring radius
  const r = S * 0.034; // pipe radius
  const lenOf = (k: number) => S * (0.95 - (k / (WOTS - 1)) * 0.5); // a spiral: tallest first
  const seal = smooth(clamp01((t - (W_END - 0.1)) / 0.4));
  const spin = t > SPIN0 ? (t - SPIN0) ** 2 * 2.2 : 0;
  const lean = smooth(clamp01((t - SPIN0) / 1.2)) * 0.18;
  return (
    <group rotation-z={lean}>
      <group rotation-y={spin}>
        {/* the hub stick, standing proud above the ring like the tower's spire */}
        <mesh position={[0, S * 0.55, 0]} castShadow>
          <cylinderGeometry args={[S * 0.012, S * 0.016, S * 1.1, 10]} />
          <meshStandardMaterial color="#8a6a34" roughness={0.7} />
        </mesh>
        {Array.from({length: WOTS}, (_, k) => {
          const at = wotAt(k);
          const u = at < 0 ? 1 : smooth(clamp01((t - (at - 0.26)) / 0.26));
          if (u <= 0) return null;
          const a = (k / WOTS) * Math.PI * 2;
          const L = lenOf(k);
          const drop = (1 - u) * S * 0.6;
          return (
            <group key={k} position={[Math.cos(a) * R, S * 0.06 + L / 2 + drop, Math.sin(a) * R]}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[r, r, L, 12]} />
                <meshStandardMaterial color={BAMBOO} roughness={0.5} />
              </mesh>
              {/* the open top: a dark mouth */}
              <mesh position={[0, L / 2 + 0.01, 0]} rotation-x={-Math.PI / 2}>
                <circleGeometry args={[r * 0.75, 12]} />
                <meshStandardMaterial color="#3a2a14" roughness={1} />
              </mesh>
              {[0.2, 0.55, 0.85].map((f, j) => (
                <mesh key={j} position={[0, (f - 0.5) * L, 0]}>
                  <cylinderGeometry args={[r * 1.1, r * 1.1, r * 0.35, 12]} />
                  <meshStandardMaterial color={BAMBOO_DK} roughness={0.6} />
                </mesh>
              ))}
              {u < 1 && u > 0.82 && (
                <group position={[0, -L / 2, 0]}>
                  <Puff u={(u - 0.82) / 0.18} seed={k} S={S * 0.16} color="#f6e2a8" n={6} />
                </group>
              )}
            </group>
          );
        })}
        {/* the wax (ขี้สูด) that seals the foot: a black ring that closes round once the last pipe is in */}
        <mesh position={[0, S * 0.07, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[R, S * 0.045, 10, 40, Math.PI * 2 * Math.max(0.5, seal)]} />
          <meshStandardMaterial color="#22180f" roughness={0.35} />
        </mesh>
      </group>
      {/* the sound once it spins: rings rolling out over the land */}
      {t > SPIN0 + 0.3 &&
        [0, 1, 2].map((j) => {
          const u = ((t - SPIN0 - 0.3) * 0.9 + j / 3) % 1;
          return (
            <mesh key={j} position={[0, 0.3, 0]} rotation-x={-Math.PI / 2} scale={S * (0.25 + u * 1.0)}>
              <ringGeometry args={[0.97, 1, 64]} />
              <meshBasicMaterial color="#ffe6a0" toneMapped={false} transparent opacity={(1 - u) * 0.7} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
    </group>
  );
};

// ---------- B: a sheaf of jasmine rice ----------
const STALKS = 44;
const S_END = 1.8;
const TIE = 2.0;
const stalkAt = (k: number) => (k < STALKS / 2 ? -1 : ((k - STALKS / 2 + 1) / (STALKS / 2)) * S_END);

const Sheaf: React.FC<{t: number; S: number}> = ({t, S}) => {
  const tie = smooth(clamp01((t - TIE) / 0.5));
  const ripe = smooth(clamp01((t - TIE - 0.3) / 1.2));
  const green = new THREE.Color('#8fb04a');
  const gold = new THREE.Color('#e3b440');
  const ear = green.clone().lerp(gold, ripe);
  const straw = new THREE.Color('#a6a24a').lerp(new THREE.Color('#d6b25a'), ripe);
  const H = S * 0.62;
  return (
    <group>
      {Array.from({length: STALKS}, (_, k) => {
        const at = stalkAt(k);
        const u = at < 0 ? 1 : smooth(clamp01((t - (at - 0.3)) / 0.3));
        if (u <= 0) return null;
        const a = hash(k * 1.7) * Math.PI * 2;
        const rr = S * 0.05 * Math.sqrt(hash(k * 2.3));
        // a loose stalk leans out from the sheaf, then swings in to stand with the others
        const outLean = (1 - u) * 1.0 + 0.06;
        const flare = 0.05 + 0.1 * (1 - tie);
        return (
          <group key={k} position={[Math.cos(a) * rr, 0, Math.sin(a) * rr]} rotation-y={-a}>
            <group rotation-z={outLean * 0.6 + flare * 0.3}>
              <mesh position={[0, H / 2, 0]} castShadow>
                <cylinderGeometry args={[S * 0.007, S * 0.009, H, 6]} />
                <meshStandardMaterial color={straw} roughness={0.8} />
              </mesh>
              {/* the ear: grains along a stem that droops as it ripens */}
              <group position={[0, H, 0]} rotation-z={0.5 + ripe * 0.9}>
                {Array.from({length: 7}, (_, j) => (
                  <mesh key={j} position={[0, j * S * 0.018, 0]} scale={[1, 1.8, 1]} castShadow>
                    <sphereGeometry args={[S * 0.011, 6, 5]} />
                    <meshStandardMaterial color={ear} roughness={0.55} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        );
      })}
      {/* the straw band (ตอก) tied round the middle */}
      {tie > 0 && (
        <mesh position={[0, H * 0.42, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[S * 0.045, S * 0.008, 8, 28, Math.PI * 2 * tie]} />
          <meshStandardMaterial color="#c49a48" roughness={0.7} />
        </mesh>
      )}
    </group>
  );
};

const AZ = 14;
const keys = (focus: P2, target: number, d: [number, number, number], el: number) =>
  buildStory({
    duration: 60,
    before: 1700,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1775, 1775.4],
        camera: [
          [0, focus[0], target, focus[1], d[0], AZ, el, 30],
          [3, focus[0], target * 1.06, focus[1], d[1], AZ + 8, el + 2, 30],
          [8, focus[0], target * 1.12, focus[1], d[2], AZ + 18, el + 5, 30],
        ],
      },
    ],
  });

const base = (id: string, Hero: React.FC<{t: number}>, at: P2, focus: P2, target: number, d: [number, number, number], el: number, clear: number): CityConfig => {
  const STORY = keys(focus, target, d, el);
  const L: React.FC<LandmarkProps> = ({t}) => (
    <>
      <OldTown />
      <group position={[at[0], 0, at[1]]}>
        <Hero t={t} />
      </group>
    </>
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ร้อยเอ็ด', sub: 'สาเกตนคร เมืองกลางบึงพลาญชัย'},
      finale: KORAT.story.finale,
      approxBefore: 1775,
    },
    layout: {
      ...KORAT.layout,
      tile: {x0: -42, x1: 40, z0: -44, z1: 38},
      peaks: [],
      rivers: [{path: MOAT, width: 0.6, closed: true}],
      bridges: [],
      noMoat: true,
      noWall: true,
      city: {hx: 9, hz: 9, outline: MOAT, moat: [1775.5, 1775.6], wall: [1775.5, 1775.6], gates: [1775.5, 1775.6], groundFrom: 1775.5},
      gates: [],
      rail: undefined,
      trains: [],
      houses: {built: [1775.6, 40], modern: [1930, 80], keepOut: []},
      villages: {centers: [[-22, -18], [18, -24], [-26, 16], [22, 12], [-6, 28]], built: [1500, 1700]},
      forestCity: 1775.6,
      clearings: [
        [at[0], at[1], clear, -1e9],
        [-1.4, -1.2, 4.4, -1e9],
        ...MOAT.map(([x, z]) => [x, z, 2.0, -1e9] as [number, number, number, number]),
      ],
      paddies: [1600, 1760],
      sites: [],
      openGround: [],
      roads: [],
      towers: [],
      boats: [3000, 3001],
      cameraKeys: STORY.cameraKeys,
    },
    Landmarks: L,
    callouts: [],
    actors: [],
    gloom: () => 0,
  };
};

// the hero stands on open ground SE of the moat town; the camera looks north over both: the hero and the moat with the bueng
const AT: P2 = [17, 12];
const FOCUS: P2 = [7, 5];
// A1: the khaen ~48 units long lying on the land
export const ROIET_A1 = base('roiet-a1', ({t}) => <Khaen t={t} S={54} />, AT, FOCUS, 4, [205, 214, 236], 42, 22);
// A2: the wot ~44 units tall with its spire
export const ROIET_A2 = base('roiet-a2', ({t}) => <Wot t={t} S={44} />, AT, FOCUS, 18, [205, 214, 236], 36, 16);
// B: the sheaf ~38 units tall
export const ROIET_B = base('roiet-b', ({t}) => <Sheaf t={t} S={58} />, AT, FOCUS, 18, [205, 214, 236], 36, 16);
