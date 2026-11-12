// Throwaway style frames for Yasothon's cover (10 Nov 2026; docs/briefs/yasothon.md). The rules from experiments
// §17-§20: the symbol moves and fills ~1/3 of the frame at second 0, on the whole land tile at legend scale; it is
// half-made by hand at frame 0 (no blank canvas) and changes shape; the first close event (3-9 s) is the cover's own
// object in local hands.
// A1 (cloud's pick): a giant bang fai (บั้งไฟ) being bound. A bamboo body lies on two trestles; at frame 0 the front
// half is already wrapped in rope rings; the binding walks down the rest, one ring at a time, until BIND_END; the long
// bamboo tail is lashed on, and the rocket swings upright against its launch tower (ฮ้านบั้งไฟ). The launch itself is
// the 3-9 s event.
// A2: the triangular axe pillow (หมอนขวานผ้าขิด, in the provincial motto) being stuffed. A row of khit-cloth sections
// lies on the land; at frame 0 the front half is already plump triangles; the stuffing walks down the rest, each
// section rising from flat cloth to a triangle with a puff of kapok; the finished pillow lifts and turns.
// B: Phaya Khankhak (พญาคันคาก), the toad king of the rain legend, a giant on the land by the Chi; his throat swells
// as he croaks, and at ~1.4 s a bang fai shoots up beside him. Nothing is half-made at frame 0 (§19 says that loses).
// Shapes are placeholders until the layout lands.
import React from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const FIELD: P2 = [4, -2];
// the Chi, north-west to south down the west of the tile (placeholder until [local]'s map)
const CHI: P2[] = [
  [-46, -58], [-36, -44], [-28, -30], [-26, -14], [-30, 0], [-28, 16], [-20, 30], [-18, 44], [-22, 58],
];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const AZ = 18;
const A = (AZ * Math.PI) / 180;

/** a puff that bursts out and fades, self-lit so it reads at noon (rope fibre, kapok, smoke) */
const Puff: React.FC<{u: number; seed: number; S: number; color: string; n?: number; up?: number}> = ({u, seed, S, color, n = 14, up = 0.6}) => {
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

// ---------- A1: the bang fai being bound ----------

const BIND_END = 2.2;
const RINGS = 16;
const BAMBOO = new THREE.Color('#c9b46a');
const ROPE = '#5b3a1f';

/** the time each ring is bound: the front half before frame 0, the rest by BIND_END */
const bindAt = (k: number) => (k < RINGS / 2 ? -1 + k * 0.1 : 0.15 + ((k - RINGS / 2) / (RINGS / 2 - 1)) * (BIND_END - 0.35));

/** the rocket along +x (nose at +L/2), radius r, origin at its centre */
const Rocket: React.FC<{t: number; L: number; r: number; tailIn: number}> = ({t, L, r, tailIn}) => {
  const ringX = (k: number) => L / 2 - L * 0.12 - ((k + 0.5) / RINGS) * L * 0.84;
  const next = Array.from({length: RINGS}, (_, k) => k).find((k) => bindAt(k) > t);
  const tail = 1.05 * L;
  return (
    <group>
      {/* the bamboo body, with its nodes */}
      <mesh rotation-z={Math.PI / 2} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, L * 0.9, 18]} />
        <meshStandardMaterial color={BAMBOO} roughness={0.7} />
      </mesh>
      {[0.2, 0.45, 0.7].map((f) => (
        <mesh key={f} position={[L * 0.45 - f * L * 0.9, 0, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[r * 1.04, r * 1.04, L * 0.012, 18]} />
          <meshStandardMaterial color="#a8924d" roughness={0.8} />
        </mesh>
      ))}
      {/* the nose (หัวบั้งไฟ), red cloth over a cone */}
      <mesh position={[L * 0.45 + r * 1.2, 0, 0]} rotation-z={-Math.PI / 2} castShadow>
        <coneGeometry args={[r * 1.05, r * 2.4, 18]} />
        <meshStandardMaterial color="#b3261e" roughness={0.8} />
      </mesh>
      {/* the rope rings: each one drops onto the body, spinning, when it is bound */}
      {Array.from({length: RINGS}, (_, k) => {
        const f = smooth(clamp01((t - bindAt(k)) / 0.12));
        if (f <= 0) return null;
        return (
          <group key={k} position={[ringX(k), 0, 0]}>
            <mesh rotation-y={Math.PI / 2} rotation-z={(1 - f) * 4} scale={1 + (1 - f) * 0.6}>
              <torusGeometry args={[r * 1.04, r * 0.16, 8, 24]} />
              <meshStandardMaterial color={k % 4 === 3 ? '#b3261e' : ROPE} roughness={0.95} />
            </mesh>
            <Puff u={(t - bindAt(k)) / 0.5} seed={k + 3} S={r * 1.6} color="#e8d7a8" n={8} up={0.3} />
          </group>
        );
      })}
      {/* the binder's coil of rope, hovering over the next ring and spinning */}
      {next !== undefined && (
        <group position={[ringX(next), r * 1.9, 0]} rotation-x={t * 9}>
          <mesh>
            <torusGeometry args={[r * 0.55, r * 0.28, 8, 16]} />
            <meshStandardMaterial color={ROPE} roughness={0.95} />
          </mesh>
          <mesh position={[0, -r * 0.6, 0]}>
            <cylinderGeometry args={[r * 0.05, r * 0.05, r * 1.2, 5]} />
            <meshStandardMaterial color={ROPE} roughness={0.95} />
          </mesh>
        </group>
      )}
      {/* the tail (หาง): a long straight bamboo pole lashed to the rear, sliding in once the body is bound */}
      {tailIn > 0.01 && (
        <group position={[-L * 0.45 - tail / 2 + (1 - tailIn) * -tail * 0.4, r * 0.7, 0]}>
          <mesh rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[r * 0.22, r * 0.3, tail, 8]} />
            <meshStandardMaterial color="#b9a35c" roughness={0.75} />
          </mesh>
          {[0.47, 0.42].map((f) => (
            <mesh key={f} position={[f * tail, 0, 0]} rotation-y={Math.PI / 2}>
              <torusGeometry args={[r * 0.4, r * 0.1, 6, 14]} />
              <meshStandardMaterial color="#b3261e" roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

/** the launch tower (ฮ้านบั้งไฟ): four bamboo legs leaning in, with cross bars */
const Tower: React.FC<{h: number; w: number}> = ({h, w}) => (
  <group>
    {[
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ].map(([sx, sz], i) => {
      const lean = Math.atan((w * 0.35) / h);
      return (
        <mesh key={i} position={[sx * w * 0.32, h / 2, sz * w * 0.32]} rotation={[-sz * lean, 0, sx * lean]} castShadow>
          <cylinderGeometry args={[w * 0.035, w * 0.05, h * 1.01, 6]} />
          <meshStandardMaterial color="#a8924d" roughness={0.8} />
        </mesh>
      );
    })}
    {[0.25, 0.5, 0.75, 0.95].map((f) =>
      [0, 1].map((o) => (
        <mesh key={`${f}${o}`} position={[0, f * h, 0]} rotation-y={o * (Math.PI / 2)}>
          <boxGeometry args={[w * (0.75 - 0.5 * f), w * 0.03, w * 0.03]} />
          <meshStandardMaterial color="#8d7841" roughness={0.85} />
        </mesh>
      )),
    )}
  </group>
);

const RISE0 = 2.55;
const BangFai: React.FC<{t: number; S: number}> = ({t, S}) => {
  const L = S;
  const r = 0.085 * S;
  const tailIn = smooth(clamp01((t - BIND_END) / 0.35));
  // the rocket swings up about its rear end onto the tower
  const rise = smooth(clamp01((t - RISE0) / 1.3));
  const th = rise * 1.4;
  const rear = -L * 0.45;
  const bed = 0.12 * S;
  const towerX = rear + L * 0.15;
  return (
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={A}>
      {/* two trestles the rocket lies on while it is bound */}
      {[-0.28, 0.28].map((f) => (
        <group key={f} position={[f * L, 0, 0]}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0, bed / 2, s * r * 0.9]} rotation-x={s * 0.35} castShadow>
              <boxGeometry args={[r * 0.4, bed * 1.1, r * 0.4]} />
              <meshStandardMaterial color="#6b4a2c" roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}
      <group position={[towerX, 0, -r * 3.2]}>
        <Tower h={0.95 * L} w={0.22 * L} />
      </group>
      <group position={[rear, bed + r, 0]} rotation-z={th}>
        <group position={[-rear, 0, 0]}>
          <Rocket t={t} L={L} r={r} tailIn={tailIn} />
        </group>
      </group>
    </group>
  );
};

// ---------- A2: the triangular axe pillow being stuffed ----------

const SECTIONS = 10;
const STUFF_END = 2.2;
const stuffAt = (k: number) => (k < SECTIONS / 2 ? -1 + k * 0.1 : 0.1 + ((k - SECTIONS / 2) / (SECTIONS / 2 - 1)) * (STUFF_END - 0.3));
// khit cloth: red and black with cream and gold, never red-white-blue (it reads as the flag)
const KHIT = ['#a51f1a', '#e9d9b0', '#1b1b1b', '#d19a2a'];

/** one triangular section along x, its flat face on the ground; up = 0 flat cloth, 1 a plump triangle */
const Wedge: React.FC<{len: number; R: number; up: number; color: string}> = ({len, R, up, color}) => {
  const h = 0.04 + 0.96 * up;
  return (
    <group position={[0, 0.5 * R * h, 0]}>
      <group rotation-z={Math.PI / 2} scale={[h, 1, 1]}>
        <mesh rotation-y={Math.PI / 2} castShadow receiveShadow>
          <cylinderGeometry args={[R, R, len * 0.97, 3]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

const Pillow: React.FC<{t: number; S: number}> = ({t, S}) => {
  const len = S / SECTIONS;
  const R = 0.24 * S;
  const done = smooth(clamp01((t - STUFF_END - 0.15) / 1.2));
  const next = Array.from({length: SECTIONS}, (_, k) => k).find((k) => stuffAt(k) > t);
  const sx = (k: number) => S / 2 - (k + 0.5) * len;
  // turned so one triangular end faces the camera three-quarters on: from the side it reads as a striped barrel
  return (
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={A - 0.75}>
      <group position={[0, done * 0.12 * S, 0]} rotation-y={done * 0.5}>
        {Array.from({length: SECTIONS}, (_, k) => {
          const up = smooth(clamp01((t - stuffAt(k)) / 0.25));
          return (
            <group key={k} position={[sx(k), 0, 0]}>
              <Wedge len={len} R={R} up={up} color={KHIT[k % KHIT.length]} />
              {/* a black khit band between sections */}
              <group position={[len / 2, 0, 0]}>
                <Wedge len={len * 0.08} R={R * 1.02} up={up} color="#171717" />
              </group>
              <group position={[0, R * 0.6 * up, 0]}>
                <Puff u={(t - stuffAt(k)) / 0.6} seed={k + 11} S={R * 0.9} color="#ffffff" n={10} />
              </group>
            </group>
          );
        })}
        {/* the patterned end caps: diamonds of khit on the two triangles */}
        {done > 0.02 &&
          [-1, 1].map((s) => (
            <group key={s} position={[(s * S) / 2 + s * 0.01 * S, 0, 0]} scale={done}>
              {[0, 1, 2].map((i) => (
                <mesh key={i} position={[0, R * (0.35 + i * 0.32), 0]} rotation-x={Math.PI / 4}>
                  <boxGeometry args={[0.01 * S, R * 0.22, R * 0.22]} />
                  <meshBasicMaterial color={i === 1 ? '#f2c14e' : '#b3261e'} toneMapped={false} />
                </mesh>
              ))}
            </group>
          ))}
      </group>
      {/* the bundle of kapok over the next section, bobbing as it stuffs */}
      {next !== undefined && (
        <group position={[sx(next), R * 1.9 + Math.abs(Math.sin(t * 10)) * R * 0.25, 0]}>
          {Array.from({length: 7}, (_, i) => (
            <mesh key={i} position={[(hash(i) - 0.5) * R * 0.8, (hash(i + 9) - 0.5) * R * 0.5, (hash(i + 4) - 0.5) * R * 0.8]} scale={R * 0.3}>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color="#f7f3ea" roughness={1} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// ---------- B: Phaya Khankhak, the toad king, and a bang fai going up ----------

const LAUNCH = 1.4;
const Toad: React.FC<{t: number; S: number}> = ({t, S}) => {
  const croak = Math.max(0, Math.sin(t * 5)) ** 2;
  const skin = '#6f6a33';
  return (
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={A + 0.5}>
      <group scale={S}>
        {/* body, squat on its haunches, head raised to the sky */}
        <mesh position={[0, 0.42, 0]} scale={[0.75, 0.42, 0.62]} rotation-z={0.25} castShadow>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color={skin} roughness={0.85} />
        </mesh>
        <mesh position={[0.55, 0.72, 0]} scale={[0.42, 0.3, 0.45]} rotation-z={0.45} castShadow>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color={skin} roughness={0.85} />
        </mesh>
        {/* warts */}
        {Array.from({length: 26}, (_, i) => {
          const a = hash(i) * Math.PI * 2;
          const b = 0.2 + hash(i + 30) * 1.0;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.6 * Math.sin(b), 0.42 + Math.cos(b) * 0.4, Math.sin(a) * 0.55 * Math.sin(b)]} scale={0.035 + hash(i + 3) * 0.03}>
              <sphereGeometry args={[1, 6, 5]} />
              <meshStandardMaterial color="#8a7d3c" roughness={0.9} />
            </mesh>
          );
        })}
        {/* eyes */}
        {[-1, 1].map((s) => (
          <group key={s} position={[0.62, 0.98, s * 0.22]}>
            <mesh scale={0.1}>
              <sphereGeometry args={[1, 12, 10]} />
              <meshStandardMaterial color="#d9a521" roughness={0.4} />
            </mesh>
            <mesh position={[0.06, 0.02, 0]} scale={0.05}>
              <sphereGeometry args={[1, 8, 6]} />
              <meshStandardMaterial color="#111" roughness={0.3} />
            </mesh>
          </group>
        ))}
        {/* the throat sac, swelling with each croak */}
        <mesh position={[0.78, 0.5, 0]} scale={0.1 + croak * 0.14}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color="#d8c9a0" roughness={0.6} />
        </mesh>
        {/* legs */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[0.5, 0.18, s * 0.38]} scale={[0.08, 0.2, 0.08]}>
              <capsuleGeometry args={[1, 1, 4, 8]} />
              <meshStandardMaterial color={skin} roughness={0.85} />
            </mesh>
            <mesh position={[-0.4, 0.16, s * 0.6]} scale={[0.4, 0.16, 0.2]}>
              <sphereGeometry args={[1, 14, 10]} />
              <meshStandardMaterial color={skin} roughness={0.85} />
            </mesh>
          </group>
        ))}
      </group>
      {/* the bang fai going up from its tower beside him, with its smoke */}
      <group position={[-0.2 * S, 0, -1.2 * S]}>
        <Tower h={1.1 * S} w={0.25 * S} />
        {(() => {
          const u = Math.max(0, t - LAUNCH);
          const y = 0.9 * S + u * u * 1.6 * S;
          return (
            <>
              <group position={[0, y, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.05 * S, 0.05 * S, 0.5 * S, 12]} />
                  <meshStandardMaterial color={BAMBOO} roughness={0.7} />
                </mesh>
                <mesh position={[0, 0.3 * S, 0]}>
                  <coneGeometry args={[0.055 * S, 0.12 * S, 12]} />
                  <meshStandardMaterial color="#b3261e" roughness={0.8} />
                </mesh>
                {u > 0 && (
                  <mesh position={[0, -0.32 * S, 0]} scale={[0.06 * S, 0.14 * S * (0.8 + 0.2 * Math.sin(t * 40)), 0.06 * S]}>
                    <coneGeometry args={[1, 1, 10]} />
                    <meshBasicMaterial color="#ffd27a" toneMapped={false} />
                  </mesh>
                )}
              </group>
              {u > 0 &&
                Array.from({length: 18}, (_, i) => {
                  const f = i / 17;
                  const yy = 0.9 * S + f * (y - 0.9 * S) - 0.3 * S;
                  const age = (1 - f) * u;
                  return (
                    <mesh key={i} position={[(hash(i) - 0.5) * age * 0.3 * S, Math.max(0.2 * S, yy), (hash(i + 5) - 0.5) * age * 0.3 * S]} scale={S * (0.06 + age * 0.12)}>
                      <icosahedronGeometry args={[1, 1]} />
                      <meshStandardMaterial color="#d9d6cf" roughness={1} transparent opacity={0.85} />
                    </mesh>
                  );
                })}
            </>
          );
        })()}
      </group>
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ยโสธร', sub: 'เมืองบั้งไฟริมแม่น้ำชี'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      peaks: [],
      rivers: [{path: CHI, width: 2.2}],
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

// legend scale: the rocket body ~42 units long (about Uttaradit's sword), its tail as long again
export const YASOTHON_A1 = base('yasothon-a1', ({t}) => <BangFai t={t} S={42} />, 9, [300, 310, 340], 34, 32);
// A2: the pillow ~38 units long, ~11 high once stuffed
export const YASOTHON_A2 = base('yasothon-a2', ({t}) => <Pillow t={t} S={38} />, 7, [290, 300, 330], 36, 30);
// B: the toad ~24 units across, the tower beside him ~26 high
export const YASOTHON_B = base('yasothon-b', ({t}) => <Toad t={t} S={24} />, 14, [300, 310, 340], 30, 32);
