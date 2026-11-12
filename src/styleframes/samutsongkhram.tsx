// Throwaway style frames for Samut Songkhram's cover (12 Nov 2026; docs/briefs/samutsongkhram_research.md). Same rules as
// Yasothon (experiments §17-§20): the symbol fills ~1/3 of the frame at second 0, on the whole land tile at legend scale;
// it is half made by hand at frame 0 and changes shape; the 3-9 s event is the cover's own object in local hands.
// A1 (cloud's pick): Mae Klong pla thu (ปลาทูแม่กลอง). A round steel steaming tray (เต๊า) holds a ring of small raw-bamboo
// baskets (เข่ง); at frame 0 half the baskets already hold their three fish, heads bent down (หน้างอคอหัก); the rest are
// packed one basket at a time until PACK_END, then the tray steams and the fish turn from sea-silver to steamed gold.
// A2: coconut sugar (น้ำตาลมะพร้าว). A wide wok of sap boils down; a ladle drops it into rows of cup moulds; at frame 0
// half the cups are set tan cakes; the rest fill one by one, amber to tan.
// B: the railway market (ตลาดร่มหุบ). A train runs down the market track; the awnings over the rails fold back as it
// comes and open again behind it. Nothing is half made at frame 0 (§19 says that loses); kept as the ending's callback.
// The Mae Klong runs down the west of the tile; shapes are placeholders until the layout lands.
import React from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const FIELD: P2 = [6, -2];
// the Mae Klong, north to south down the west of the tile, with the loop west of town (placeholder)
const MAEKLONG: P2[] = [
  [-30, -58], [-22, -44], [-30, -30], [-40, -18], [-34, -6], [-20, -4], [-14, 8], [-16, 24], [-22, 40], [-26, 58],
];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const AZ = 18;
const A = (AZ * Math.PI) / 180;

/** a puff that bursts out and fades, self-lit so it reads at noon (spray, steam) */
const Puff: React.FC<{u: number; seed: number; S: number; color: string; n?: number; up?: number}> = ({u, seed, S, color, n = 12, up = 0.6}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.3 + hash(seed * 3 + i) * 0.5);
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * sp * u, (up + hash(seed * 7 + i) * 0.6) * sp * u, Math.sin(a) * sp * u]}
            scale={S * 0.09 * (1 - u) * (0.6 + hash(i + seed) * 0.6)}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1 - u} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- A1: pla thu packed into baskets on the steaming tray ----------

const PACK_END = 2.1;
const STEAM0 = 2.35;
const RING_IN = 4;
const RING_OUT = 9;
const N_BASKETS = RING_IN + RING_OUT;
const packAt = (k: number) =>
  k < N_BASKETS / 2 ? -1 + k * 0.05 : 0.1 + ((k - N_BASKETS / 2) / (N_BASKETS / 2 - 1)) * (PACK_END - 0.3);
const BAMBOO = '#d6c08a';
const SEA_BACK = new THREE.Color('#5d86a8');
const SEA_BELLY = new THREE.Color('#f2f5f7');
const STEAMED_BACK = new THREE.Color('#a8864e');
const STEAMED_BELLY = new THREE.Color('#f3dca6');

/** one pla thu, along +x, nose at +x; its head is bent sharply down (the packing, not the breed) */
const Fish: React.FC<{len: number; cook: number}> = ({len, cook}) => {
  const back = SEA_BACK.clone().lerp(STEAMED_BACK, cook);
  const belly = SEA_BELLY.clone().lerp(STEAMED_BELLY, cook);
  return (
    <group>
      <mesh position={[0, len * 0.06, 0]} scale={[len * 0.42, len * 0.15, len * 0.12]} castShadow>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color={belly} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, len * 0.14, 0]} scale={[len * 0.4, len * 0.09, len * 0.1]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color={back} roughness={0.35} metalness={0.1} />
      </mesh>
      {/* the tail fork */}
      <mesh position={[-len * 0.47, len * 0.08, 0]} rotation-z={Math.PI / 2} scale={[1, 1, 0.25]}>
        <coneGeometry args={[len * 0.14, len * 0.2, 3]} />
        <meshStandardMaterial color={back} roughness={0.5} />
      </mesh>
      {/* the head, bent down at the neck */}
      <group position={[len * 0.36, len * 0.08, 0]} rotation-z={-1.15}>
        <mesh position={[len * 0.1, 0, 0]} scale={[len * 0.15, len * 0.12, len * 0.11]}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color={belly} roughness={0.3} metalness={0.1} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[len * 0.15, len * 0.03, s * len * 0.09]}>
            <sphereGeometry args={[len * 0.03, 8, 6]} />
            <meshStandardMaterial color="#111" roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/** a small raw-bamboo basket (เข่ง), radius b, with its three fish curled round it */
const Basket: React.FC<{b: number; fill: number; cook: number; seed: number}> = ({b, fill, cook, seed}) => (
  <group>
    <mesh position={[0, b * 0.3, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[b, b * 0.85, b * 0.6, 20, 1, true]} />
      <meshStandardMaterial color={BAMBOO} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, b * 0.02, 0]}>
      <cylinderGeometry args={[b * 0.85, b * 0.85, b * 0.04, 20]} />
      <meshStandardMaterial color="#bfa66c" roughness={0.95} />
    </mesh>
    {[0.15, 0.35, 0.58].map((f) => (
      <mesh key={f} position={[0, b * f, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[b * (0.86 + f * 0.24), b * 0.035, 5, 24]} />
        <meshStandardMaterial color="#a88d55" roughness={0.95} />
      </mesh>
    ))}
    {[0, 1, 2].map((i) => {
      const f = smooth(clamp01(fill * 3 - i));
      if (f <= 0) return null;
      const a = (i * Math.PI * 2) / 3 + seed;
      return (
        <group key={i} rotation-y={a} position={[0, b * (0.12 + i * 0.1) + (1 - f) * b * 4, 0]}>
          <group position={[0, 0, b * 0.48]} rotation-y={(1 - f) * 3} rotation-x={0.25}>
            <Fish len={b * 1.5} cook={cook} />
          </group>
        </group>
      );
    })}
  </group>
);

const PlaThu: React.FC<{t: number; S: number}> = ({t, S}) => {
  const R = S * 0.5;
  const b = S * 0.105;
  const steam = clamp01((t - STEAM0) / 1.2);
  const cook = smooth(clamp01((t - STEAM0 - 0.3) / 1.6));
  const spot = (k: number): P2 => {
    const inner = k < RING_IN;
    const n = inner ? RING_IN : RING_OUT;
    const j = inner ? k : k - RING_IN;
    const r = inner ? R * 0.34 : R * 0.74;
    const a = (j / n) * Math.PI * 2 + (inner ? 0.3 : 0);
    return [Math.cos(a) * r, Math.sin(a) * r];
  };
  // pack the outer ring first from the front, so the half that waits at frame 0 faces the camera
  const order = Array.from({length: N_BASKETS}, (_, k) => k);
  const next = order.find((k) => packAt(k) > t);
  return (
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={A}>
      {/* the steel tray (เต๊า) on a low stand */}
      <mesh position={[0, S * 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[R, R * 0.97, S * 0.03, 48]} />
        <meshStandardMaterial color="#aeb4bb" roughness={0.35} metalness={0.7} />
      </mesh>
      <mesh position={[0, S * 0.055, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[R, S * 0.012, 8, 64]} />
        <meshStandardMaterial color="#c9ced4" roughness={0.3} metalness={0.8} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.57 + 0.78) * R * 0.7, S * 0.012, Math.sin(i * 1.57 + 0.78) * R * 0.7]}>
          <boxGeometry args={[S * 0.04, S * 0.025, S * 0.04]} />
          <meshStandardMaterial color="#6b6f74" roughness={0.6} />
        </mesh>
      ))}
      {order.map((k) => {
        const [x, z] = spot(k);
        const fill = clamp01((t - packAt(k)) / 0.3);
        return (
          <group key={k} position={[x, S * 0.07, z]}>
            <Basket b={b} fill={fill} cook={cook} seed={hash(k) * 6} />
            <Puff u={(t - packAt(k) - 0.25) / 0.45} seed={k + 5} S={b * 1.6} color="#d8f0ff" n={8} up={0.5} />
            {/* steam once the tray is on the boil */}
            {steam > 0 && (
              <Puff u={((t - STEAM0 + hash(k) * 0.9) % 0.9) / 0.9} seed={k * 3 + Math.floor((t - STEAM0 + hash(k) * 0.9) / 0.9)} S={b * 5 * Math.min(1, steam * 3)} color="#ffffff" n={10} up={1.6} />
            )}
          </group>
        );
      })}
      {/* the packer's next fish, hovering over the next basket and bending its head */}
      {next !== undefined && (() => {
        const [x, z] = spot(next);
        return (
          <group position={[x, S * 0.07 + b * 2.4, z]} rotation-y={t * 2}>
            <Fish len={b * 1.5} cook={0} />
          </group>
        );
      })()}
    </group>
  );
};

// ---------- A2: coconut sugar dropped into cup moulds ----------

const COLS = 6;
const ROWS = 4;
const CUPS = COLS * ROWS;
const POUR_END = 2.3;
const pourAt = (k: number) => (k < CUPS / 2 ? -1 + k * 0.04 : 0.1 + ((k - CUPS / 2) / (CUPS / 2 - 1)) * (POUR_END - 0.3));
const AMBER = new THREE.Color('#b8661c');
const SET = new THREE.Color('#d9a35a');

const Sugar: React.FC<{t: number; S: number}> = ({t, S}) => {
  const c = S * 0.09;
  const boardX = S * 0.12;
  const wokX = -S * 0.33;
  const next = Array.from({length: CUPS}, (_, k) => k).find((k) => pourAt(k) > t);
  const cupPos = (k: number): P2 => {
    const i = k % COLS;
    const j = Math.floor(k / COLS);
    return [boardX + (i - (COLS - 1) / 2) * c * 1.25, (j - (ROWS - 1) / 2) * c * 1.25];
  };
  return (
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={A}>
      {/* the wok on its clay stove, sap boiling down */}
      <group position={[wokX, 0, 0]}>
        <mesh position={[0, S * 0.07, 0]} castShadow>
          <cylinderGeometry args={[S * 0.2, S * 0.23, S * 0.14, 24]} />
          <meshStandardMaterial color="#9a5a3a" roughness={0.95} />
        </mesh>
        <mesh position={[0, S * 0.22, 0]} rotation-x={Math.PI} castShadow>
          <sphereGeometry args={[S * 0.24, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2e2a27" roughness={0.6} metalness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, S * 0.19, 0]}>
          <cylinderGeometry args={[S * 0.215, S * 0.215, S * 0.01, 32]} />
          <meshStandardMaterial color="#9b5418" roughness={0.3} />
        </mesh>
        {Array.from({length: 4}, (_, i) => (
          <group key={i} position={[Math.cos(i * 1.7) * S * 0.08, S * 0.2, Math.sin(i * 1.7) * S * 0.08]}>
            <Puff u={((t + i * 0.37) % 1.1) / 1.1} seed={i * 11 + Math.floor((t + i * 0.37) / 1.1)} S={S * 0.16} color="#ffffff" n={6} up={1.6} />
          </group>
        ))}
      </group>
      {/* the mould board and its cups */}
      <mesh position={[boardX, S * 0.025, 0]} receiveShadow castShadow>
        <boxGeometry args={[c * 1.25 * COLS + c * 0.4, S * 0.05, c * 1.25 * ROWS + c * 0.4]} />
        <meshStandardMaterial color="#8b6a44" roughness={0.9} />
      </mesh>
      {Array.from({length: CUPS}, (_, k) => {
        const [x, z] = cupPos(k);
        const f = clamp01((t - pourAt(k)) / 0.25);
        const set = smooth(clamp01((t - pourAt(k) - 0.4) / 0.8));
        return (
          <group key={k} position={[x, S * 0.05, z]}>
            <mesh position={[0, c * 0.2, 0]}>
              <cylinderGeometry args={[c * 0.5, c * 0.38, c * 0.4, 16, 1, true]} />
              <meshStandardMaterial color="#ddd7cc" roughness={0.6} side={THREE.DoubleSide} />
            </mesh>
            {f > 0.02 && (
              <mesh position={[0, c * 0.2 * f + c * (set > 0.95 ? 0.08 : 0), 0]} scale={[1, Math.max(0.05, f), 1]}>
                <cylinderGeometry args={[c * 0.46, c * 0.38, c * 0.4, 16]} />
                <meshStandardMaterial color={AMBER.clone().lerp(SET, set)} roughness={0.5 - set * 0.2} />
              </mesh>
            )}
          </group>
        );
      })}
      {/* the ladle: a pour of sap over the next cup */}
      {next !== undefined && (() => {
        const [x, z] = cupPos(next);
        const h = S * 0.32;
        return (
          <group position={[x, 0, z]}>
            <mesh position={[0, h, 0]} rotation-z={0.5}>
              <sphereGeometry args={[c * 0.45, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#6d4c2f" roughness={0.8} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[-c * 1.8, h + c * 0.6, 0]} rotation-z={1.1}>
              <cylinderGeometry args={[c * 0.06, c * 0.06, c * 3.6, 6]} />
              <meshStandardMaterial color="#6d4c2f" roughness={0.8} />
            </mesh>
            <mesh position={[0, h / 2 + S * 0.03, 0]}>
              <cylinderGeometry args={[c * 0.07, c * 0.1, h - S * 0.06, 8]} />
              <meshBasicMaterial color="#c8721f" toneMapped={false} />
            </mesh>
          </group>
        );
      })()}
    </group>
  );
};

// ---------- B: the railway market, the awnings fold as the train comes ----------

const TRAIN_V = 14; // units a second
const STALLS = 9;

const Market: React.FC<{t: number; S: number}> = ({t, S}) => {
  const L = S;
  const gauge = S * 0.05;
  const carL = S * 0.24;
  const front = L * 0.75 - TRAIN_V * (t - 0.4); // the nose, coming from +x toward -x
  const awn = (x: number) => {
    // fold back when the train is within reach, open again once it has passed
    const ahead = front - x;
    const behind = x - (front + carL * 2.1);
    const d = Math.min(Math.max(ahead, 0), 1e9);
    if (ahead > 0) return smooth(clamp01(1 - (d - S * 0.04) / (S * 0.14)));
    if (behind > 0) return smooth(clamp01(1 - behind / (S * 0.12)));
    return 1;
  };
  return (
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={A}>
      {/* the track: sleepers and two rails */}
      {Array.from({length: 40}, (_, i) => (
        <mesh key={i} position={[-L / 2 + (i + 0.5) * (L / 40), S * 0.006, 0]} receiveShadow>
          <boxGeometry args={[S * 0.012, S * 0.008, gauge * 1.8]} />
          <meshStandardMaterial color="#6a5a48" roughness={0.9} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, S * 0.013, (s * gauge) / 2]}>
          <boxGeometry args={[L, S * 0.006, S * 0.005]} />
          <meshStandardMaterial color="#8d9196" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      {/* stalls both sides: a low table of goods and an awning that leans out over the rails */}
      {Array.from({length: STALLS}, (_, i) => {
        const x = -L / 2 + (i + 0.5) * (L / STALLS);
        const fold = awn(x);
        return [-1, 1].map((s) => {
          const col = ['#d7402f', '#f2c230', '#2f7fc1', '#ef7d2c', '#3aa35a'][(i + (s > 0 ? 2 : 0)) % 5];
          return (
            <group key={`${i}${s}`} position={[x, 0, s * gauge * 1.7]}>
              <mesh position={[0, S * 0.03, s * S * 0.04]} castShadow receiveShadow>
                <boxGeometry args={[L / STALLS * 0.8, S * 0.04, S * 0.06]} />
                <meshStandardMaterial color="#a7895e" roughness={0.9} />
              </mesh>
              {Array.from({length: 4}, (_, j) => (
                <mesh key={j} position={[(j - 1.5) * (L / STALLS) * 0.18, S * 0.055, s * S * 0.04]}>
                  <boxGeometry args={[S * 0.02, S * 0.012, S * 0.03]} />
                  <meshStandardMaterial color={['#c9d3dc', '#d34b3c', '#7fae3e', '#e6b04a'][(i + j) % 4]} roughness={0.6} />
                </mesh>
              ))}
              {/* the awning hinges at its pole on the stall side; folded it stands up and back */}
              <group position={[0, S * 0.11, s * S * 0.07]} rotation-x={s * (-0.15 + (1 - fold) * 1.35)}>
                <mesh position={[0, 0, -s * S * 0.055]} castShadow>
                  <boxGeometry args={[L / STALLS * 0.92, S * 0.005, S * 0.11]} />
                  <meshStandardMaterial color={col} roughness={0.7} side={THREE.DoubleSide} />
                </mesh>
              </group>
              <mesh position={[0, S * 0.055, s * S * 0.07]}>
                <cylinderGeometry args={[S * 0.003, S * 0.003, S * 0.11, 5]} />
                <meshStandardMaterial color="#555" roughness={0.6} />
              </mesh>
            </group>
          );
        });
      })}
      {/* the train: two cream cars with a red band */}
      {[0, 1].map((k) => {
        const cx = front + carL / 2 + k * carL * 1.05;
        if (cx - carL / 2 > L / 2 + carL || cx + carL / 2 < -L / 2 - carL) return null;
        return (
          <group key={k} position={[cx, S * 0.05, 0]}>
            <mesh castShadow>
              <boxGeometry args={[carL, S * 0.065, gauge * 1.5]} />
              <meshStandardMaterial color="#efe6d2" roughness={0.6} />
            </mesh>
            <mesh position={[0, -S * 0.012, 0]}>
              <boxGeometry args={[carL * 1.002, S * 0.012, gauge * 1.52]} />
              <meshStandardMaterial color="#b3261e" roughness={0.6} />
            </mesh>
            <mesh position={[0, S * 0.036, 0]}>
              <boxGeometry args={[carL * 0.98, S * 0.008, gauge * 1.3]} />
              <meshStandardMaterial color="#9aa0a6" roughness={0.5} />
            </mesh>
            {k === 0 && (
              <mesh position={[-carL / 2 - S * 0.001, S * 0.01, 0]}>
                <boxGeometry args={[S * 0.004, S * 0.018, gauge * 0.9]} />
                <meshBasicMaterial color="#fff6c8" toneMapped={false} />
              </mesh>
            )}
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
          [3, FIELD[0], target * 1.06, FIELD[1], d[1], AZ + 8, el + 2, 30],
          [8, FIELD[0], target * 1.12, FIELD[1], d[2], AZ + 18, el + 5, 30],
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สมุทรสงคราม', sub: 'เมืองแม่กลอง ปากแม่น้ำ'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      peaks: [],
      rivers: [{path: MAEKLONG, width: 2.6}],
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

// legend scale: the tray ~52 units across, each basket ~11 units, each fish ~8 units long
export const SAMUTSONGKHRAM_A1 = base('samutsongkhram-a1', ({t}) => <PlaThu t={t} S={52} />, 5, [290, 300, 330], 38, 34);
// A2: the wok ~10 units across and the mould board ~27 units long
export const SAMUTSONGKHRAM_A2 = base('samutsongkhram-a2', ({t}) => <Sugar t={t} S={44} />, 5, [290, 300, 330], 36, 32);
// B: the market ~60 units of track, the train two cars of ~14 units
export const SAMUTSONGKHRAM_B = base('samutsongkhram-b', ({t}) => <Market t={t} S={60} />, 4, [280, 290, 320], 36, 36);
