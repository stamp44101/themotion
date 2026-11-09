// Throwaway style frames for Uttaradit's cover (8 Nov 2026; docs/briefs/uttaradit.md). The rules from
// experiments §17-§19: the symbol moves AND fills ~1/3 of the frame at second 0, it is half-made by hand at
// frame 0 (no blank canvas), and its change is of shape, not only of colour.
// A: the province's own iron (เหล็กน้ำพี้) forged into a sword. A giant glowing bar lies on the anvil; at
// frame 0 the tip half is already a flat blade; the hammer walks down the rest, each blow flattening one
// segment and throwing sparks, until the whole bar is a blade by FORGE_END; it cools from orange to steel,
// the hilt goes on and the sword lifts and turns. A1 one sword on the whole tile; A2 the twin swords
// (ดาบสองมือ) side by side, two hammers out of step. B: ดาบหัก, the fight before Phichai's wall in 2316:
// the hero with a sword in each hand between two lines of spearmen; one blade snaps at ~2.2 s and its half
// spins away. Owner (8 Nov): the cover shows the whole land tile with a giant on it, like Korat, Chiang Mai,
// Udon and Ratchaburi: legend-scale hero, forest tile and its soil edge in frame, camera ~290-335 out.
// Shapes are placeholders until the layout lands.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {Walker} from '../cities/nan/figures';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const FIELD: P2 = [4, -2];
// the Nan, north to south down the west of the tile (placeholder until [local]'s map)
const NAN: P2[] = [
  [-30, -58], [-26, -40], [-20, -26], [-19, -12], [-23, 2], [-24, 16], [-19, 30], [-14, 44], [-12, 58],
];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const mix = (a: THREE.Color, b: THREE.Color, k: number) => a.clone().lerp(b, clamp01(k));

const AZ = 18;
const A = (AZ * Math.PI) / 180;
const FORGE_END = 2.3;

const STEEL = new THREE.Color('#9ea6ad');
const DARK_IRON = new THREE.Color('#3a3634');
const HOT = new THREE.Color('#ff6a12');
const WHITE_HOT = new THREE.Color('#ffd27a');

// the blade, in segments from the tip (k = 0) to the tang; units of the sword's length L = 1
const SEG = 12;
const segX = (k: number) => 0.5 - (k + 0.5) / SEG; // tip at +0.5, tang at -0.5
const BAR_H = 0.07;
const BAR_W = 0.075;
const BLADE_H = 0.02;
const bladeW = (k: number) => (k === 0 ? 0.08 : 0.17 - 0.02 * (k / SEG)); // a slightly curved-back dap, tip narrow

/** the strike time of each segment: the tip half was forged before frame 0, the rest by FORGE_END */
const strikes = (lag: number) =>
  Array.from({length: SEG}, (_, k) => (k < SEG / 2 ? -1.2 + k * 0.15 : lag + ((k - SEG / 2) / (SEG / 2 - 1)) * (FORGE_END - 0.25 - lag)));

/** sparks thrown off one blow, self-lit */
const Sparks: React.FC<{u: number; seed: number; S: number}> = ({u, seed, S}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: 22}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const up = 0.4 + hash(seed * 5 + i) * 0.9;
        const sp = S * (0.25 + hash(seed * 3 + i) * 0.45);
        const x = Math.cos(a) * sp * u;
        const z = Math.sin(a) * sp * u;
        const y = up * sp * u - u * u * sp * 1.4;
        return (
          <mesh key={i} position={[x, Math.max(0, y), z]} scale={S * 0.012 * (1 - u)}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={i % 3 ? '#ffb347' : '#fff1c2'} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

/** one sword being forged on the anvil top (local origin = anvil face centre), length S */
const Blade: React.FC<{t: number; S: number; lag: number; seed: number}> = ({t, S, lag, seed}) => {
  const tf = useMemo(() => strikes(lag), [lag]);
  const done = smooth(clamp01((t - FORGE_END - 0.2) / 1.1));
  // after the last blow the sword rises off the anvil and turns its flat to the camera
  const lift = done * 0.32 * S;
  const tilt = done * 0.75;
  // the hammer: between two blows it rises, then drops fast onto the next segment
  const next = tf.findIndex((s) => s >= t);
  const prevT = next <= 0 ? -1 : tf[next - 1];
  const nextT = next < 0 ? FORGE_END + 9 : tf[next];
  const u = clamp01((t - prevT) / Math.max(0.05, nextT - prevT));
  const up = u < 0.7 ? smooth(u / 0.7) : 1 - smooth((u - 0.7) / 0.3);
  const hx = segX(next < 0 ? SEG - 1 : next) * S;
  const hammerAway = smooth(clamp01((t - FORGE_END) / 0.6));
  return (
    <group>
      <group position={[0, lift, 0]} rotation-x={tilt}>
        {tf.map((s, k) => {
          const f = smooth(clamp01((t - s) / 0.08)); // 0 = bar, 1 = flat blade
          const since = t - s;
          // heat: the bar glows from the fire, a fresh blow brightens it, then it cools to steel
          const heat = since < 0 ? 0.75 : Math.max(0, 1 - since / 2.6);
          const col = heat > 0.85 ? mix(HOT, WHITE_HOT, (heat - 0.85) / 0.15) : mix(f > 0.5 ? STEEL : DARK_IRON, HOT, heat / 0.85);
          const w = BAR_W + (bladeW(k) - BAR_W) * f;
          const h = BAR_H + (BLADE_H - BAR_H) * f;
          return (
            <mesh key={k} position={[segX(k) * S, h * S * 0.5, 0]} castShadow>
              <boxGeometry args={[(S / SEG) * 1.02, h * S, w * S]} />
              <meshStandardMaterial
                color={col}
                emissive={HOT}
                emissiveIntensity={heat * 0.9}
                roughness={0.35 + 0.3 * heat}
                metalness={0.7 - 0.4 * heat}
              />
            </mesh>
          );
        })}
        {/* the hilt goes on once the blade is cool enough: a guard and a cord-wrapped grip */}
        {done > 0.02 && (
          <group position={[-0.5 * S, BLADE_H * S * 0.5, 0]} scale={done}>
            <mesh position={[-0.02 * S, 0, 0]} castShadow>
              <boxGeometry args={[0.03 * S, 0.05 * S, 0.17 * S]} />
              <meshStandardMaterial color="#b08d3a" metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[-0.17 * S, 0, 0]} rotation-z={Math.PI / 2} castShadow>
              <cylinderGeometry args={[0.03 * S, 0.034 * S, 0.27 * S, 10]} />
              <meshStandardMaterial color="#3b2416" roughness={0.9} />
            </mesh>
            <mesh position={[-0.32 * S, 0, 0]} castShadow>
              <sphereGeometry args={[0.04 * S, 10, 8]} />
              <meshStandardMaterial color="#b08d3a" metalness={0.7} roughness={0.35} />
            </mesh>
          </group>
        )}
      </group>
      {tf.map((s, k) => (
        <group key={k} position={[segX(k) * S, BLADE_H * S, 0]}>
          <Sparks u={(t - s) / 0.7} seed={seed * 31 + k} S={S} />
        </group>
      ))}
      {/* the smith's hammer, a wooden haft and an iron head, swung from off the anvil's side */}
      {hammerAway < 0.98 && (
        <group position={[hx, (0.03 + up * 0.32 + hammerAway * 0.6) * S, (0.05 + hammerAway * 0.5) * S]} rotation-x={-0.5 * up}>
          <mesh position={[0, 0.045 * S, 0]} castShadow>
            <boxGeometry args={[0.08 * S, 0.09 * S, 0.13 * S]} />
            <meshStandardMaterial color="#2e2c2b" metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.045 * S, 0.3 * S]} rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.016 * S, 0.02 * S, 0.5 * S, 8]} />
            <meshStandardMaterial color="#7a5532" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/** the anvil on its log, and the hearth glowing behind */
const Smithy: React.FC<{t: number; S: number; blades: {z: number; lag: number}[]}> = ({t, S, blades}) => {
  const top = 0.42 * S;
  return (
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={A}>
      {/* the log the anvil sits on */}
      <mesh position={[0, 0.13 * S, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3 * S, 0.34 * S, 0.26 * S, 18]} />
        <meshStandardMaterial color="#6b4a2c" roughness={0.95} />
      </mesh>
      {/* the anvil: a waisted block with a long face, a horn at one end */}
      <mesh position={[0, 0.31 * S, 0]} castShadow>
        <boxGeometry args={[0.36 * S, 0.12 * S, 0.22 * S]} />
        <meshStandardMaterial color="#2b2a2a" metalness={0.5} roughness={0.55} />
      </mesh>
      <mesh position={[0, top - 0.04 * S, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7 * S, 0.08 * S, 0.3 * S]} />
        <meshStandardMaterial color="#363535" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh position={[0.45 * S, top - 0.05 * S, 0]} rotation-z={-Math.PI / 2} castShadow>
        <coneGeometry args={[0.07 * S, 0.22 * S, 12]} />
        <meshStandardMaterial color="#363535" metalness={0.55} roughness={0.45} />
      </mesh>
      {/* the hearth: a low pit of coals on the ground beside the anvil, breathing with the bellows */}
      <group position={[-0.15 * S, 0, 0.55 * S]}>
        <mesh position={[0, 0.03 * S, 0]} receiveShadow>
          <cylinderGeometry args={[0.24 * S, 0.27 * S, 0.06 * S, 20]} />
          <meshStandardMaterial color="#6e3a24" roughness={0.95} />
        </mesh>
        {Array.from({length: 30}, (_, i) => {
          const glow = 0.6 + 0.4 * Math.sin(t * 5 + i * 1.7);
          const a = hash(i) * Math.PI * 2;
          const r = Math.sqrt(hash(i + 40)) * 0.2 * S;
          return (
            <mesh key={i} position={[Math.cos(a) * r, 0.07 * S, Math.sin(a) * r]} scale={S * (0.02 + hash(i + 7) * 0.015)}>
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#2a1a12" emissive="#ff5a10" emissiveIntensity={glow} roughness={1} />
            </mesh>
          );
        })}
      </group>
      {blades.map((b, i) => (
        <group key={i} position={[0, top, b.z * S]}>
          <Blade t={t} S={S} lag={b.lag} seed={i + 1} />
        </group>
      ))}
    </group>
  );
};

// ---------- B: ดาบหัก, the fight before Phichai's wall ----------

/** a straight dap blade held in a fist, pointing up out of the hand (local +y) */
const Dap: React.FC<{len: number; broken?: number}> = ({len, broken = 1}) => (
  <group>
    <mesh position={[0, 0.08, 0]}>
      <boxGeometry args={[0.05, 0.16, 0.05]} />
      <meshStandardMaterial color="#3b2416" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.17, 0]}>
      <boxGeometry args={[0.04, 0.03, 0.2]} />
      <meshStandardMaterial color="#b08d3a" metalness={0.7} roughness={0.35} />
    </mesh>
    <mesh position={[0, 0.18 + (len * broken) / 2, 0]} castShadow>
      <boxGeometry args={[0.05, len * broken, 0.16]} />
      <meshStandardMaterial color="#c9d0d6" metalness={0.75} roughness={0.25} />
    </mesh>
  </group>
);

const BROKE = 2.2;

const Hero: React.FC<{t: number}> = ({t}) => {
  // both arms swing the swords in turn; at BROKE the right blade snaps at its middle
  // both arms raised in a V, each sword chopping in turn
  const broken = t >= BROKE;
  return (
    <group>
      <Walker step={t * 0.6} i={2} still />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.24, 1.42, 0.05]} rotation-x={0.35 * Math.sin(t * 4.2 + (s > 0 ? 0 : Math.PI))} rotation-z={s * 2.3}>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.05, 0.045, 0.4, 6]} />
            <meshStandardMaterial color="#c99a72" roughness={0.9} />
          </mesh>
          <group position={[0, -0.38, 0]} rotation-x={Math.PI}>
            <Dap len={1.15} broken={s > 0 && broken ? 0.5 : 1} />
          </group>
        </group>
      ))}
      {/* a red sash: the commander */}
      <mesh position={[0, 1.02, 0]} scale={[0.22, 0.07, 0.22]}>
        <cylinderGeometry args={[1, 1, 1, 10]} />
        <meshStandardMaterial color="#b0261c" roughness={0.9} />
      </mesh>
    </group>
  );
};

const Fight: React.FC<{t: number; S: number}> = ({t, S}) => {
  const u = clamp01((t - BROKE) / 1.6);
  // the snapped half of the blade spins up and away, with a flash at the break
  const piece: [number, number, number] = [0.9 * S + u * 1.1 * S, 2.9 * S + u * 1.0 * S - u * u * 3.2 * S, 0.3 * S + u * 0.4 * S];
  return (
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={A}>
      {/* the giant: Phraya Phichai with a sword in each hand */}
      <group scale={S}>
        <Hero t={t} />
      </group>
      {u > 0 && u < 1 && (
        <group position={piece} rotation={[u * 9, u * 5, u * 7]} scale={S}>
          <mesh castShadow>
            <boxGeometry args={[0.05, 0.58, 0.16]} />
            <meshStandardMaterial color="#c9d0d6" metalness={0.75} roughness={0.25} />
          </mesh>
        </group>
      )}
      {t > BROKE && t < BROKE + 0.5 && (
        <mesh position={[0.95 * S, 2.75 * S, 0.3 * S]} scale={S * 0.3 * Math.sin(((t - BROKE) / 0.5) * Math.PI)}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#fff1c2" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

/** Phichai at true scale behind the giant: a square earth wall with a gate in each side and roofs inside */
const Phichai: React.FC = () => {
  const c: P2 = [FIELD[0] + 2, FIELD[1] - 20];
  const half = 9;
  return (
    <group position={[c[0], 0, c[1]]} rotation-y={A}>
      {[0, 1, 2, 3].map((k) => (
        <group key={k} rotation-y={(k * Math.PI) / 2}>
          {[-1, 1].map((sd) => (
            <mesh key={sd} position={[sd * half * 0.55, 0.6, half]} castShadow receiveShadow>
              <boxGeometry args={[half * 0.8, 1.2, 0.8]} />
              <meshStandardMaterial color="#8e5b3c" roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}
      {Array.from({length: 14}, (_, i) => (
        <mesh key={i} position={[(hash(i) - 0.5) * 12, 0.7, (hash(i + 20) - 0.5) * 12]} rotation-y={hash(i + 5) * 3} castShadow>
          <coneGeometry args={[1.1, 1.4, 4]} />
          <meshStandardMaterial color="#7b4b2b" roughness={0.9} />
        </mesh>
      ))}
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'อุตรดิตถ์', sub: 'เมืองเหล็กน้ำพี้ริมแม่น้ำน่าน'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      peaks: [],
      rivers: [{path: NAN, width: 1.8}],
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

// legend scale: the sword ~40 units long on an anvil ~17 high, about the size of Udon's jar
const S_A = 40;
const CAM: [number, number, number] = [290, 300, 335];
export const UTTARADIT_A1 = base('uttaradit-a1', ({t}) => <Smithy t={t} S={S_A} blades={[{z: 0, lag: 0}]} />, 0.35 * S_A, CAM, 36, 30);
// A2: the twin swords (ดาบสองมือ) side by side, the second hammer half a blow behind the first
export const UTTARADIT_A2 = base(
  'uttaradit-a2',
  ({t}) => <Smithy t={t} S={S_A} blades={[{z: -0.14, lag: 0}, {z: 0.14, lag: 0.12}]} />,
  0.35 * S_A,
  CAM,
  36,
  30,
);
// B: the giant ~26 units tall (Walker 1.75 x 15), his town small behind him
const S_B = 15;
export const UTTARADIT_B = base(
  'uttaradit-b',
  ({t}) => (
    <>
      <Fight t={t} S={S_B} />
      <Phichai />
    </>
  ),
  0.9 * S_B,
  CAM,
  28,
  32,
);
