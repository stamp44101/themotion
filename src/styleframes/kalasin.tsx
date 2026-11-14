// Throwaway style frames for Kalasin's cover (14 Nov 2026; docs/briefs/kalasin_research.md). The rules from experiments
// §17-§20: the symbol fills ~1/3 of the frame at second 0 on the whole land tile at legend scale; it is half made by hand at
// frame 0 (no blank canvas) and changes shape, not only colour.
// A1 (cloud's pick): ผ้าไหมแพรวา. A giant Phu Thai loom; at frame 0 half the shawl is already woven, crimson with rows of
// yellow/white/green diamond khit; the beater bangs one row in at a time and the shuttle crosses, until WEAVE_END; then the
// finished cloth is cut off the loom and rolls out across the land toward the camera.
// A2: โปงลาง. A giant pong lang hung at 45° from a post to a peg in the ground; at frame 0 half its logs are tied on; the rest
// drop in and are tied one at a time, longest at the bottom; then two mallets play it down the scale, each log kicking and
// glowing as it is struck.
// B: ภูกุ้มข้าว. A Phuwiangosaurus skeleton half dug out of a red sandstone pit at frame 0 (tail and hips white, neck and
// head still under the sand); the sand sinks back to bare the rest, then the skeleton gets up on its legs.
// The town sits on คลองปาว (OSM way 242809647), drawn here from the real map (100 m/unit, origin 10 units east of the
// city pillar); the main Lam Pao is ~5 km west, off the tile.
import React from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const FIELD: P2 = [4, 2];
// คลองปาว from the real map, north to south down the west of the old core
const KHLONG_PAO: P2[] = [
  [-5.9, -24.0], [-9.0, -19.7], [-10.9, -14.7], [-12.9, -9.8], [-8.4, -6.8], [-11.8, -3.1], [-17.4, -2.6], [-13.0, 0.5],
  [-11.8, 5.4], [-16.8, 7.1], [-15.7, 12.4], [-11.2, 15.2], [-8.6, 19.5], [-13.3, 21.2], [-18.6, 21.5], [-14.3, 25.0],
  [-12.4, 29.7], [-7.3, 28.6], [-3.7, 24.2], [-1.4, 27.3], [3, 34], [7, 40], [10, 45],
];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const AZ = 18;

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

// ---------- A1: Phrae Wa woven on a giant loom ----------

const ROWS = 20;
const WEAVE_END = 2.0;
const CUT = 2.35;
/** row k is woven at this time; half are done before frame 0 */
const rowAt = (k: number) => (k < ROWS / 2 ? -1 : ((k - ROWS / 2 + 1) / (ROWS / 2)) * WEAVE_END);
const CRIMSON = '#a3142a';
const KHIT = ['#f2c230', '#f7f1de', '#2f9a5a', '#f2c230', '#1c1c1c'];
const TEAK = '#6b4325';

/** one band of khit: a row of small diamonds across the cloth, w wide, h deep */
const KhitRow: React.FC<{w: number; h: number; k: number}> = ({w, h, k}) => {
  const n = 9;
  const col = KHIT[k % KHIT.length];
  const band = k % 4 === 3;
  return (
    <group>
      {band ? (
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[w * 0.92, h * 0.012, h * 0.18]} />
          <meshStandardMaterial color="#f2c230" roughness={0.5} metalness={0.2} />
        </mesh>
      ) : (
        Array.from({length: n}, (_, i) => (
          <mesh key={i} position={[(i - (n - 1) / 2) * (w * 0.92) / n, 0.02, 0]} rotation-y={Math.PI / 4}>
            <boxGeometry args={[h * 0.42, h * 0.012, h * 0.42]} />
            <meshStandardMaterial color={(i + k) % 3 === 0 ? '#f7f1de' : col} roughness={0.5} metalness={0.15} />
          </mesh>
        ))
      )}
    </group>
  );
};

const PhraeWa: React.FC<{t: number; S: number}> = ({t, S}) => {
  // the loom stands along z: the weaver's bench (front, +z), the breast beam, the woven cloth growing back toward the reed
  const W = S * 0.42; // cloth width
  const rowH = S * 0.026;
  const done = Array.from({length: ROWS}, (_, k) => (t >= rowAt(k) ? 1 : 0)).reduce((a: number, b) => a + b, 0);
  const lastAt = rowAt(Math.max(0, done - 1));
  const beat = done > ROWS / 2 && t < WEAVE_END + 0.1 ? Math.exp(-(t - lastAt) * 12) : 0;
  const fellZ = S * 0.3 - done * rowH; // the edge where the next row goes
  const reedZ = fellZ - S * 0.05 - (1 - beat) * S * 0.06;
  const rowT = done < ROWS ? clamp01((t - lastAt) / Math.max(0.05, rowAt(done) - lastAt)) : 1;
  const shuttleX = (done % 2 === 0 ? -1 : 1) * (rowT * 2 - 1) * W * 0.62;
  const H = S * 0.22; // the cloth's height above the ground on the loom
  // after the cut the cloth lifts off and rolls out on the ground toward the camera
  const cut = smooth(clamp01((t - CUT) / 1.4));
  const clothLen = ROWS * rowH;
  return (
    <group position={[0, 0, -S * 0.2]}>
      {/* the frame: four posts and the top beams */}
      {[-1, 1].map((sx) =>
        [S * 0.36, -S * 0.42].map((z, j) => (
          <mesh key={`${sx}${j}`} position={[sx * W * 0.7, S * 0.22, z]} castShadow>
            <boxGeometry args={[S * 0.035, S * 0.44, S * 0.035]} />
            <meshStandardMaterial color={TEAK} roughness={0.8} />
          </mesh>
        )),
      )}
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[sx * W * 0.7, S * 0.44, -S * 0.03]} castShadow>
          <boxGeometry args={[S * 0.03, S * 0.03, S * 0.82]} />
          <meshStandardMaterial color={TEAK} roughness={0.8} />
        </mesh>
      ))}
      {/* breast beam and warp beam */}
      {[S * 0.33, -S * 0.4].map((z, j) => (
        <mesh key={j} position={[0, H, z]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[S * 0.022, S * 0.022, W * 1.45, 12]} />
          <meshStandardMaterial color={TEAK} roughness={0.75} />
        </mesh>
      ))}
      {/* the warp: red silk from the fell back to the warp beam */}
      {cut < 0.02 && (
        <>
      <mesh position={[0, H + S * 0.004, (fellZ + -S * 0.4) / 2]} receiveShadow>
        <boxGeometry args={[W, S * 0.003, Math.max(0.01, fellZ + S * 0.4)]} />
        <meshStandardMaterial color="#c8323f" roughness={0.6} transparent opacity={0.85} />
      </mesh>
      {Array.from({length: 22}, (_, i) => (
        <mesh key={i} position={[(i / 21 - 0.5) * W, H + S * 0.007, (fellZ - S * 0.4) / 2]}>
          <boxGeometry args={[S * 0.0025, S * 0.002, Math.max(0.01, fellZ + S * 0.4)]} />
          <meshStandardMaterial color="#e05a5a" roughness={0.5} />
        </mesh>
      ))}
        </>
      )}
      {/* the woven cloth on the loom (until the cut) */}
      {cut < 0.02 && (
        <group position={[0, H + S * 0.006, 0]}>
          <mesh position={[0, 0, S * 0.3 - (done * rowH) / 2]} castShadow receiveShadow>
            <boxGeometry args={[W, S * 0.008, Math.max(0.01, done * rowH)]} />
            <meshStandardMaterial color={CRIMSON} roughness={0.55} metalness={0.1} />
          </mesh>
          {Array.from({length: done}, (_, k) => (
            <group key={k} position={[0, S * 0.004, S * 0.3 - (k + 0.5) * rowH]}>
              <KhitRow w={W} h={rowH} k={k} />
            </group>
          ))}
        </group>
      )}
      {/* the reed / beater swinging in to the fell */}
      {cut < 0.02 && (
        <group position={[0, H, reedZ]}>
          <mesh position={[0, S * 0.04, 0]} castShadow>
            <boxGeometry args={[W * 1.25, S * 0.09, S * 0.012]} />
            <meshStandardMaterial color="#8a5a32" roughness={0.7} />
          </mesh>
          <Puff u={beat > 0.05 ? 1 - beat : -1} seed={done} S={S * 0.2} color="#ffd9a0" n={6} />
        </group>
      )}
      {/* the shuttle, a boat of dark wood with a gold bobbin */}
      {cut < 0.02 && done < ROWS && (
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
      {/* the weaver's bench */}
      <mesh position={[0, S * 0.08, S * 0.44]} castShadow>
        <boxGeometry args={[W * 0.9, S * 0.025, S * 0.08]} />
        <meshStandardMaterial color={TEAK} roughness={0.8} />
      </mesh>
      {/* the finished shawl: lifted off and rolled out on the land toward the camera, fringes at both ends */}
      {cut >= 0.02 && (
        <group position={[0, S * 0.012 + (1 - cut) * H, S * 0.38]}>
          <group scale={[1, 1, 0.15 + cut * 0.85]}>
            <mesh position={[0, 0, clothLen / 2]} castShadow receiveShadow>
              <boxGeometry args={[W, S * 0.008, clothLen]} />
              <meshStandardMaterial color={CRIMSON} roughness={0.55} metalness={0.1} />
            </mesh>
            {Array.from({length: ROWS}, (_, k) => (
              <group key={k} position={[0, S * 0.004, (k + 0.5) * rowH]}>
                <KhitRow w={W} h={rowH} k={k} />
              </group>
            ))}
          </group>
        </group>
      )}
    </group>
  );
};

// ---------- A2: a pong lang tied together, then played ----------

const LOGS = 12;
const TIE_END = 1.9;
const PLAY0 = 2.1;
const logAt = (k: number) => (k < LOGS / 2 ? -1 : ((k - LOGS / 2 + 1) / (LOGS / 2)) * TIE_END);
const WOOD = '#c99b62';

/** a thin straight cord from a to b */
const Seg: React.FC<{a: [number, number, number]; b: [number, number, number]; r: number}> = ({a, b, r}) => {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const d = B.clone().sub(A);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return (
    <mesh position={A.clone().add(B).multiplyScalar(0.5)} quaternion={q}>
      <cylinderGeometry args={[r, r, d.length(), 5]} />
      <meshStandardMaterial color="#e8dcc0" roughness={0.9} />
    </mesh>
  );
};

const PongLang: React.FC<{t: number; S: number}> = ({t, S}) => {
  // hung from the top of a post (high end, short logs) down to a peg in the ground (low end, long logs)
  const L = S * 1.0; // cord length
  const ang = Math.PI / 4;
  const top: [number, number] = [0, S * 0.72];
  return (
    <group position={[-S * 0.32, 0, -S * 0.1]} rotation-y={1.3}>
      {/* the post */}
      <mesh position={[0, S * 0.37, -S * 0.02]} castShadow>
        <cylinderGeometry args={[S * 0.03, S * 0.035, S * 0.76, 10]} />
        <meshStandardMaterial color="#5a3a22" roughness={0.85} />
      </mesh>
      {/* the twin cords, from the post's top down to the peg, splaying with the logs' length */}
      {[-1, 1].map((s) => {
        const f0 = 0.7 / (LOGS + 0.6);
        const a: [number, number, number] = [s * S * (0.28 + 0.5 * f0) * 0.36, top[1] - Math.sin(ang) * L * f0 + S * 0.05, Math.cos(ang) * L * f0];
        return <Seg key={s} a={[s * S * 0.04, top[1] + S * 0.02, 0]} b={a} r={S * 0.004} />;
      })}
      {[-1, 1].map((s) => {
        const f0 = 0.7 / (LOGS + 0.6);
        const a: [number, number, number] = [s * S * (0.28 + 0.5 * f0) * 0.36, top[1] - Math.sin(ang) * L * f0 + S * 0.05, Math.cos(ang) * L * f0];
        const b: [number, number, number] = [s * S * 0.78 * 0.36, S * 0.05, Math.cos(ang) * L * 1.02];
        return <Seg key={s} a={a} b={b} r={S * 0.004} />;
      })}
      {/* the logs */}
      {Array.from({length: LOGS}, (_, k) => {
        const f = (k + 0.7) / (LOGS + 0.6);
        const len = S * (0.28 + 0.5 * f);
        const at = logAt(k);
        const drop = smooth(clamp01((t - (at - 0.35)) / 0.35));
        if (drop <= 0) return null;
        // the play: mallets run down the scale and back, one log every 0.12 s
        const step = t - PLAY0;
        const hitK = step > 0 ? Math.floor(step / 0.12) % (LOGS * 2) : -1;
        const hitIdx = hitK < 0 ? -1 : hitK < LOGS ? hitK : LOGS * 2 - 1 - hitK;
        const since = step - Math.floor(step / 0.12) * 0.12;
        const kick = hitIdx === k ? Math.exp(-since * 25) : 0;
        const glow = hitIdx === k ? Math.exp(-since * 10) : 0;
        const y = top[1] - Math.sin(ang) * L * f + (1 - drop) * S * 0.25 - kick * S * 0.015;
        const z = Math.cos(ang) * L * f;
        const col = new THREE.Color(WOOD).lerp(new THREE.Color('#ffe08a'), glow * 0.8);
        return (
          <group key={k} position={[0, y + S * 0.025, z]}>
            <mesh rotation-z={Math.PI / 2} castShadow>
              <cylinderGeometry args={[S * (0.022 + 0.006 * f), S * (0.022 + 0.006 * f), len, 12]} />
              <meshStandardMaterial color={col} roughness={0.7} emissive={col} emissiveIntensity={glow * 0.6} />
            </mesh>
            {/* bark rings at the tied ends */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * len * 0.36, 0, 0]} rotation-z={Math.PI / 2}>
                <cylinderGeometry args={[S * (0.024 + 0.006 * f), S * (0.024 + 0.006 * f), S * 0.03, 12]} />
                <meshStandardMaterial color="#6e4a2a" roughness={0.9} />
              </mesh>
            ))}
            {drop < 1 && drop > 0.6 && <Puff u={(drop - 0.6) / 0.4} seed={k} S={S * 0.12} color="#f3e2bd" n={5} />}
          </group>
        );
      })}
      {/* the two mallets, flicking down the logs */}
      {t > PLAY0 - 0.2 &&
        [-1, 1].map((s) => {
          const step = Math.max(0, t - PLAY0);
          const hk = Math.floor(step / 0.12) % (LOGS * 2);
          const idx = hk < LOGS ? hk : LOGS * 2 - 1 - hk;
          const f = (idx + 0.7) / (LOGS + 0.6);
          const len = S * (0.28 + 0.5 * f);
          const since = step - Math.floor(step / 0.12) * 0.12;
          const lift = Math.min(1, since / 0.08);
          return (
            <group key={s} position={[s * len * 0.18, top[1] - Math.sin(ang) * L * f + S * 0.06 + lift * S * 0.05, Math.cos(ang) * L * f + S * 0.04]}
              rotation-x={-0.6}>
              <mesh castShadow>
                <cylinderGeometry args={[S * 0.006, S * 0.006, S * 0.14, 6]} />
                <meshStandardMaterial color="#3b2414" roughness={0.7} />
              </mesh>
              <mesh position={[0, -S * 0.07, 0]}>
                <sphereGeometry args={[S * 0.018, 10, 8]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
              </mesh>
            </group>
          );
        })}
      {/* the peg at the low end */}
      <mesh position={[0, S * 0.02, Math.cos(ang) * L * 1.02]} castShadow>
        <cylinderGeometry args={[S * 0.012, S * 0.012, S * 0.05, 8]} />
        <meshStandardMaterial color="#5a3a22" roughness={0.85} />
      </mesh>
    </group>
  );
};

// ---------- B: a sauropod dug out of Phu Kum Khao, then up on its legs ----------

const DIG_END = 1.9;
const RISE0 = 2.0;
const BONE = '#f1ead8';
const SAND = '#b5643c';

const Skeleton: React.FC<{t: number; S: number}> = ({t, S}) => {
  // the spine runs from the tail tip (-x) to the skull (+x); u = 0..1 along it
  const N = 34;
  const spine = (u: number): [number, number] => {
    const x = (u - 0.5) * S * 1.05;
    const y = u < 0.45 ? S * 0.06 + u * S * 0.35 : u < 0.62 ? S * 0.22 : S * 0.22 + (u - 0.62) * S * 0.9;
    return [x, y];
  };
  // dig front: at frame 0 the tail half is bare; the sand sinks off the rest by DIG_END
  const front = 0.5 + 0.5 * smooth(clamp01(t / DIG_END));
  const rise = smooth(clamp01((t - RISE0) / 1.1));
  const bare = (u: number) => u < front;
  return (
    <group>
      {/* the pit: red sandstone floor */}
      <mesh position={[0, S * 0.005, 0]} receiveShadow>
        <cylinderGeometry args={[S * 0.62, S * 0.68, S * 0.01, 40]} />
        <meshStandardMaterial color={SAND} roughness={0.95} />
      </mesh>
      {/* the skeleton: lies on its side, then rolls up and stands */}
      <group position={[0, rise * S * 0.3, 0]} rotation-x={(1 - rise) * (Math.PI / 2)}>
        {Array.from({length: N}, (_, i) => {
          const u = i / (N - 1);
          if (!bare(u)) return null;
          const [x, y] = spine(u);
          const r = S * (u < 0.45 ? 0.022 + u * 0.08 : u < 0.62 ? 0.058 : 0.05 - (u - 0.62) * 0.06);
          return (
            <mesh key={i} position={[x, y, 0]} castShadow>
              <sphereGeometry args={[r, 10, 8]} />
              <meshStandardMaterial color={BONE} roughness={0.6} />
            </mesh>
          );
        })}
        {/* ribs over the back */}
        {Array.from({length: 9}, (_, i) => {
          const u = 0.42 + i * 0.025;
          if (!bare(u)) return null;
          const [x, y] = spine(u);
          return (
            <mesh key={i} position={[x, y - S * 0.08, 0]} rotation-y={Math.PI / 2}>
              <torusGeometry args={[S * 0.11, S * 0.012, 6, 18, Math.PI]} />
              <meshStandardMaterial color={BONE} roughness={0.6} />
            </mesh>
          );
        })}
        {/* four legs */}
        {[
          [0.47, -1], [0.47, 1], [0.6, -1], [0.6, 1],
        ].map(([u, s], i) => {
          if (!bare(u)) return null;
          const [x, y] = spine(u);
          return (
            <group key={i} position={[x, y - S * 0.15, s * S * 0.07]}>
              <mesh castShadow>
                <cylinderGeometry args={[S * 0.035, S * 0.03, S * 0.3, 8]} />
                <meshStandardMaterial color={BONE} roughness={0.6} />
              </mesh>
            </group>
          );
        })}
        {/* the skull */}
        {bare(0.99) && (
          <mesh position={[spine(1)[0] + S * 0.03, spine(1)[1], 0]} scale={[1.6, 0.8, 0.8]} castShadow>
            <sphereGeometry args={[S * 0.045, 12, 10]} />
            <meshStandardMaterial color={BONE} roughness={0.6} />
          </mesh>
        )}
      </group>
      {/* the sand still over the unbared part: a long mound that shrinks toward the head */}
      {front < 0.999 && (
        <mesh position={[spine((front + 1) / 2)[0], S * 0.02, 0]} scale={[(1 - front) * S * 0.78, S * 0.12, S * 0.2]} castShadow>
          <sphereGeometry args={[1, 18, 10]} />
          <meshStandardMaterial color="#c97a4c" roughness={1} />
        </mesh>
      )}
      {/* the dust where the sand is coming off */}
      {front < 0.999 && (
        <group position={[spine(front)[0], S * 0.05, 0]}>
          <Puff u={(t * 3) % 1} seed={Math.floor(t * 3)} S={S * 0.15} color="#e7b48a" n={6} />
        </group>
      )}
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
  const L: React.FC<LandmarkProps> = ({t}) => (
    <group position={[FIELD[0], 0, FIELD[1]]}>
      <Hero t={t} />
    </group>
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'กาฬสินธุ์', sub: 'เมืองน้ำดำ ริมลำน้ำปาว'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      peaks: [],
      rivers: [{path: KHLONG_PAO, width: 1.6}],
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

// legend scale: the loom ~50 units long, the cloth ~22 units wide
export const KALASIN_A1 = base('kalasin-a1', ({t}) => <PhraeWa t={t} S={56} />, 5, [290, 300, 330], 38, 34);
// A2: the pong lang ~55 units from the post's top to the peg
export const KALASIN_A2 = base('kalasin-a2', ({t}) => <PongLang t={t} S={48} />, 8, [290, 300, 330], 36, 34);
// B: the skeleton ~75 units long in its pit
export const KALASIN_B = base('kalasin-b', ({t}) => <Skeleton t={t} S={64} />, 5, [290, 300, 330], 38, 36);
