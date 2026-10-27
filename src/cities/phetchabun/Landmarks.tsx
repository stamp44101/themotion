import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {lathe, Viharn, Elephant} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp} from '../../lib';
import {Walker} from '../nan/figures';
import {
  ARMY_COLS, ARMY_ROWS, ARMY_S, armyAt, BUILDERS, builderAt, burstU, CAMP, CAMP_R, campFall, CAP_ROADS, capitalK, clamp01, dipAt, ESCORTS, escortAt,
  GOV, haloK, HIGH, HIGH_RAW, WEDGE_FILL, HIGH_TAPER, HIGH_W, highWater, imageAt, ORCHARDS, OFFICIALS, PICKERS, pickerAt, RAFT_DECK, raftAt, RING_LEN, RITE_SCALE, TRUCKS,
  truckAt, wallK, whirlK, WORKERS, workerAt, along, beatK,
} from './actors';
import {Burst, Halo, MahaThammaracha, Ripples, Whirlpool} from './buddha';
import {Hall, Raft, RiteFigure, RowBoat, Tamarind, Truck} from './figures';
import {GATES, MAHATHAT, NAKHONBAN, OLD_TOWN, POOL, TRAIPHUM, WALL, WALL_C, WATER_GATES} from './places';
import {HERO_AZ} from './timeline';

type P = [number, number];
const WATER = '#3f8fc0';
const BANK = '#c2b184';
const BRICK = '#a9583c';
const WHITEWASH = '#f1ece0';
const ROOF = '#9b3a2a';
const FACE = (HERO_AZ * Math.PI) / 180;
const smooth01 = (x: number) => x * x * (3 - 2 * x);

// a growing mesh is gated on its own scale (CLAUDE.md: a mesh at scale 0 blacks out the shader look)
const Grow: React.FC<{k: number; children: React.ReactNode; at: [number, number, number]; rot?: number}> = ({k, children, at, rot = 0}) =>
  k > 0.02 ? (
    <group position={at} rotation-y={rot} scale={[1, Math.max(0.03, k), 1]}>
      {children}
    </group>
  ) : null;

const edgesOf = (pts: P[], closed: boolean) =>
  closed ? pts.map((a, i) => [a, pts[(i + 1) % pts.length]] as [P, P]) : pts.slice(1).map((b, i) => [pts[i], b] as [P, P]);

/** Water along `pts`, `w` wide, with rounded joints and sandy banks. */
const Ribbon: React.FC<{pts: P[]; w: number; closed?: boolean; y?: number; color?: string; banks?: boolean; taper?: [number, number]}> = ({
  pts,
  w: w0,
  closed = false,
  y = 0.05,
  color = WATER,
  banks = true,
  taper,
}) => {
  if (w0 < 0.04) return null;
  // `taper` [length, end width]: the width runs down to `end width` over `length` units at both ends
  const E = edgesOf(pts, closed);
  const total = E.reduce((sum, [a, b]) => sum + Math.hypot(b[0] - a[0], b[1] - a[1]), 0);
  let run = 0;
  return (
    <>
      {E.map(([a, b], i) => {
        const at = run;
        run += Math.hypot(b[0] - a[0], b[1] - a[1]);
        const e = taper ? Math.min(1, Math.min(at, total - at) / taper[0]) : 1;
        const w = taper ? taper[1] + (w0 - taper[1]) * e * e * (3 - 2 * e) : w0;
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (len < 1e-3) return null;
        const ux = (b[0] - a[0]) / len;
        const uz = (b[1] - a[1]) / len;
        const cx = (a[0] + b[0]) / 2;
        const cz = (a[1] + b[1]) / 2;
        const rot = Math.atan2(ux, uz);
        return (
          <group key={i}>
            <mesh position={[cx, y, cz]} rotation-y={rot} receiveShadow>
              <boxGeometry args={[w, 0.06, len]} />
              <meshStandardMaterial color={color} roughness={0.12} metalness={0.25} />
            </mesh>
            <mesh position={[a[0], y, a[1]]} receiveShadow>
              <cylinderGeometry args={[w / 2, w / 2, 0.06, 16]} />
              <meshStandardMaterial color={color} roughness={0.12} metalness={0.25} />
            </mesh>
            {banks &&
              [-1, 1].map((s) => (
                <mesh key={s} position={[cx - uz * s * (w / 2 + 0.12), y + 0.01, cz + ux * s * (w / 2 + 0.12)]} rotation-y={rot}>
                  <boxGeometry args={[0.28, 0.05, len]} />
                  <meshStandardMaterial color={BANK} roughness={1} />
                </mesh>
              ))}
          </group>
        );
      })}
    </>
  );
};

const WaterPatches: React.FC<{k: number; fill: boolean}> = ({k, fill}) => {
  const r = (1 + (HIGH_W - 1) * k) / 2;
  const geo = useMemo(() => {
    // the ribbon's own top (same widths and taper as the Ribbon below it): a plane per segment and
    // a disc per joint
    const total = HIGH.slice(1).reduce((sum, b, i) => sum + Math.hypot(b[0] - HIGH[i][0], b[1] - HIGH[i][1]), 0);
    let run = 0;
    const top = HIGH.slice(1).flatMap((b, i) => {
      const a = HIGH[i];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const at = run;
      run += len;
      const e = Math.min(1, Math.min(at, total - at) / HIGH_TAPER);
      const w = 1 + (2 * r - 1) * e * e * (3 - 2 * e);
      const rot = Math.atan2(b[0] - a[0], b[1] - a[1]);
      return [
        new THREE.PlaneGeometry(w, len).rotateX(-Math.PI / 2).rotateY(rot).translate((a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2),
        new THREE.CircleGeometry(w / 2, 20).rotateX(-Math.PI / 2).translate(a[0], 0, a[1]),
      ];
    });
    const discs = [
      ...top,
      ...HIGH_RAW.map(([x, z]) => new THREE.CircleGeometry(r, 28).rotateX(-Math.PI / 2).translate(x, 0, z)),
      ...(fill ? WEDGE_FILL.map(([x, z]) => new THREE.CircleGeometry(0.45, 12).rotateX(-Math.PI / 2).translate(x, 0, z)) : []),
    ];
    return mergeGeometries(discs);
  }, [r, fill]);
  // the ribbon's box top is at 0.15 + 0.03
  return (
    <mesh geometry={geo} position={[0, 0.182, 0]} receiveShadow>
      <meshStandardMaterial color={WATER} roughness={0.12} metalness={0.25} />
    </mesh>
  );
};

// ------------------------------------------------------------------ the image
/** The image at the pool: it rises upright out of the whirlpool (0.25-2.25 s), stands in its halo,
 *  then settles to the raft's size and rides the raft down to Wat Traiphum. It always faces the
 *  cover's camera and never turns. */
const Image: React.FC<{t: number}> = ({t}) => {
  const im = imageAt(t);
  const r = raftAt(t);
  if (im.u < 0.01) return null;
  // after the shrink it stands on the raft
  const onRaft = im.v >= 1 && r;
  if (im.v >= 1 && !r) return null;
  const x = onRaft ? r.x : POOL[0];
  const z = onRaft ? r.z : POOL[1];
  const halo = haloK(t);
  return (
    <group position={[x, im.y + (onRaft ? 0.16 : 0), z]} rotation-y={FACE} scale={im.s}>
      <MahaThammaracha glow={0.25 * halo} />
      <Halo k={halo} />
    </group>
  );
};

const Cover: React.FC<{t: number}> = ({t}) => {
  if (t > 8.5) return null;
  const r = 4.5;
  return (
    <group position={[POOL[0], 0, POOL[1]]}>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[r * 1.35, r * 1.35, 0.08, 40]} />
        <meshStandardMaterial color={WATER} roughness={0.12} metalness={0.25} transparent opacity={clamp01((6.6 - t) / 1.6)} />
      </mesh>
      {/* lifted over the high water (the engine's river surface is at 0.1) */}
      <group position={[0, 0.08, 0]}>
        <Whirlpool t={t} k={whirlK(t)} r={r} />
        <Burst u={burstU(t)} r={r} />
        <Ripples t={t} t0={1.8} r={r} />
      </group>
    </group>
  );
};

const Procession: React.FC<{t: number}> = ({t}) => {
  const r = raftAt(t);
  return (
    <>
      {r && (
        <group position={[r.x, 0.16, r.z]} rotation-y={r.rot}>
          <Raft />
        </group>
      )}
      {Array.from({length: ESCORTS}, (_, i) => {
        const e = escortAt(i, t);
        return e && e.fade > 0.05 ? (
          <group key={i} position={[e.x, 0.16, e.z]} rotation-y={e.rot} scale={0.62 * e.fade}>
            <RowBoat row={e.row} i={i} />
          </group>
        ) : null;
      })}
    </>
  );
};

// ------------------------------------------------------------------ temples
// a Sukhothai lotus-bud chedi (เจดีย์ทรงดอกบัวตูม), white with a gilt tip
const LOTUS: [number, number][] = [
  [0, 0], [1.1, 0], [1.1, 0.3], [0.9, 0.3], [0.9, 0.6], [0.75, 0.6], [0.75, 1.3], [0.6, 1.35], [0.6, 1.6],
  [0.75, 1.75], [0.78, 2.0], [0.6, 2.3], [0.3, 2.55], [0.12, 2.9], [0.06, 3.5], [0, 3.8],
];
const Mahathat: React.FC<{night: number}> = ({night}) => {
  const geo = useMemo(() => lathe(LOTUS, 16), []);
  const [x, z] = MAHATHAT;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[3.4, 0.3, 4.6]} />
        <meshStandardMaterial color="#e3dac6" roughness={0.9} />
      </mesh>
      <mesh geometry={geo} position={[0, 0.3, -1.0]} scale={0.6} castShadow>
        <meshStandardMaterial color="#efe9da" roughness={0.6} emissive="#ffc861" emissiveIntensity={night * 0.35} />
      </mesh>
      <Viharn pos={[0, 0.3, 1.1]} k={1} scale={0.6} />
    </group>
  );
};
const Traiphum: React.FC<{Y: number}> = ({Y}) => {
  const [x, z] = TRAIPHUM;
  // the hall facing the river, a white wall round the compound
  return (
    <group position={[x, 0, z]}>
      <Viharn pos={[0, 0, 0]} k={1} rot={Math.PI / 2} scale={0.62} />
      {Y > 1650 && (
        <mesh position={[0.3, 0.12, 1.4]} receiveShadow>
          <boxGeometry args={[2.4, 0.24, 0.12]} />
          <meshStandardMaterial color={WHITEWASH} roughness={0.9} />
        </mesh>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the two towns
/** The Sukhothai-era earthwork round Wat Mahathat: a moat and a low bank, standing from before
 *  the clip; the moat silts up and becomes ถนนสันคูเมือง in the 20th century. */
const OldTown: React.FC<{Y: number}> = ({Y}) => {
  const moat = 1 - ramp(Y, 1930, 1975);
  return (
    <>
      {moat > 0.05 && <Ribbon pts={OLD_TOWN} w={0.6 * moat} closed y={0.04} color="#4f8fa6" />}
      {edgesOf(OLD_TOWN, true).map(([a, b], i) => {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const rot = Math.atan2(b[0] - a[0], b[1] - a[1]);
        return (
          <mesh key={i} position={[(a[0] + b[0]) / 2, 0.1, (a[1] + b[1]) / 2]} rotation-y={rot} receiveShadow>
            <boxGeometry args={[0.5, 0.2 * (0.5 + 0.5 * moat), len]} />
            <meshStandardMaterial color="#9a8a5a" roughness={1} />
          </mesh>
        );
      })}
    </>
  );
};

/** where the wall is cut along an edge: the gates and the two water gates, as [s0, s1] along it */
const cutsOn = (a: P, b: P) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ux = (b[0] - a[0]) / L;
  const uz = (b[1] - a[1]) / L;
  const near = (q: P) => {
    const s = (q[0] - a[0]) * ux + (q[1] - a[1]) * uz;
    const d = Math.abs((q[0] - a[0]) * -uz + (q[1] - a[1]) * ux);
    return d < 0.6 && s > 0 && s < L ? s : null;
  };
  const cuts: [number, number][] = [];
  GATES.forEach((g) => {
    const s = near(g.at);
    if (s !== null) cuts.push([s - 0.6, s + 0.6]);
  });
  WATER_GATES.forEach((g) => {
    const s = near(g.at);
    if (s !== null) cuts.push([s - 1.3, s + 1.3]);
  });
  return cuts.sort((p, q) => p[0] - q[0]);
};

/** The Ayutthaya town's brick wall (~1660s, approximate): it rises round from the north-west
 *  corner during the wall beat. Most of it went in the 20th century; the north stretch and the
 *  north-east fort (ป้อมสนามชัย) stand, restored. */
const AyutthayaWall: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  if (Y < 1659.5) return null;
  const k = wallK(t, Y);
  const E = edgesOf(WALL, true);
  // the north edge (index 0) and its fort survive; the others fall to a low ruin by 1970
  const ruin = (i: number) => (i === 0 ? 0 : ramp(Y, 1905 + i * 8, 1940 + i * 8));
  let acc = 0;
  return (
    <>
      {E.map(([a, b], i) => {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const s0 = acc;
        acc += L;
        // how much of this edge is built, by the round from the north-west corner
        const built = clamp01((k * RING_LEN - s0) / L);
        if (built < 0.01) return null;
        const ux = (b[0] - a[0]) / L;
        const uz = (b[1] - a[1]) / L;
        const rot = Math.atan2(ux, uz);
        const h = 1 - 0.85 * ruin(i);
        const spans: [number, number][] = [];
        let p = 0;
        cutsOn(a, b).forEach(([c0, c1]) => {
          spans.push([p, c0]);
          p = c1;
        });
        spans.push([p, L]);
        return spans.map(([p0, p1], j) => {
          const e1 = Math.min(p1, built * L);
          const len = e1 - p0;
          if (len < 0.1) return null;
          const m = (p0 + e1) / 2;
          const merlons = h > 0.6 ? Math.floor(len / 0.5) : 0;
          return (
            <group key={`${i}-${j}`} position={[a[0] + ux * m, 0, a[1] + uz * m]} rotation-y={rot} scale={[1, Math.max(0.05, h), 1]}>
              <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.5, 0.9, len]} />
                <meshStandardMaterial color={BRICK} roughness={0.9} />
              </mesh>
              {Array.from({length: merlons}, (_, q) => (
                <mesh key={q} position={[0, 1.0, -len / 2 + 0.25 + q * 0.5]} castShadow>
                  <boxGeometry args={[0.5, 0.2, 0.24]} />
                  <meshStandardMaterial color={BRICK} roughness={0.9} />
                </mesh>
              ))}
            </group>
          );
        });
      })}
      {/* the four arrow-head forts, each standing out past its corner */}
      {WALL.map((c, i) => {
        // the corner's place in the round: forts rise as the wall reaches them
        const at = [0, 13.5, 26, 39.5][i] / RING_LEN;
        const fk = smooth01(clamp01((k - at) / 0.06));
        if (fk < 0.02) return null;
        const ox = Math.sign(c[0] - WALL_C[0]);
        const oz = Math.sign(c[1] - WALL_C[1]);
        const rot = Math.atan2(ox, oz);
        const h = (1 - 0.8 * (i === 1 ? 0 : ramp(Y, 1915 + i * 6, 1945 + i * 6))) * fk;
        return (
          <group key={i} position={[c[0], 0, c[1]]} rotation-y={rot} scale={[1, Math.max(0.05, h), 1]}>
            {/* the arrow head: a diamond pointing out, its neck on the corner */}
            <mesh position={[0, 0.55, 0.6]} rotation-y={Math.PI / 4} castShadow receiveShadow>
              <boxGeometry args={[1.5, 1.1, 1.5]} />
              <meshStandardMaterial color={BRICK} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.55, -0.1]} castShadow>
              <boxGeometry args={[1.0, 1.1, 1.0]} />
              <meshStandardMaterial color={BRICK} roughness={0.9} />
            </mesh>
          </group>
        );
      })}
      {/* the gates: brick and sandstone towers each side of the opening */}
      {GATES.map((g, i) => {
        const side = g.side;
        const along = side === 'n' || side === 's';
        const order = {n: 0, e: 1, s: 2, w: 3}[side];
        const gk = smooth01(clamp01((k - [6.75, 19.75, 32.75, 46.25][order] / RING_LEN) / 0.05));
        const h = gk * (1 - 0.85 * ramp(Y, 1910 + i * 7, 1945 + i * 7));
        if (h < 0.02) return null;
        return (
          <group key={g.name} position={[g.at[0], 0, g.at[1]]} rotation-y={along ? Math.PI / 2 : 0} scale={[1, h, 1]}>
            {[-0.75, 0.75].map((s) => (
              <mesh key={s} position={[0, 0.7, s]} castShadow>
                <boxGeometry args={[0.8, 1.4, 0.36]} />
                <meshStandardMaterial color={i % 2 ? '#c9b48a' : BRICK} roughness={0.9} />
              </mesh>
            ))}
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[0.9, 0.22, 1.9]} />
              <meshStandardMaterial color={WHITEWASH} roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.85, 0]} rotation-y={Math.PI / 4} castShadow>
              <coneGeometry args={[0.8, 0.5, 4]} />
              <meshStandardMaterial color={ROOF} flatShading />
            </mesh>
          </group>
        );
      })}
      {/* the water gates: a pier each side of the river, a lintel over it */}
      {WATER_GATES.map((g, i) => {
        const gk = smooth01(clamp01((k - (i === 0 ? 5.4 : 21.2) / RING_LEN) / 0.05));
        const h = gk * (1 - 0.9 * ramp(Y, 1905, 1935));
        if (h < 0.02) return null;
        return (
          <group key={i} position={[g.at[0], 0, g.at[1]]} rotation-y={g.side === 'n' ? Math.PI / 2 : 0} scale={[1, h, 1]}>
            {[-1.4, 1.4].map((s) => (
              <mesh key={s} position={[0, 0.6, s]} castShadow>
                <boxGeometry args={[0.6, 1.2, 0.3]} />
                <meshStandardMaterial color={BRICK} roughness={0.9} />
              </mesh>
            ))}
            <mesh position={[0, 1.3, 0]} castShadow>
              <boxGeometry args={[0.6, 0.2, 3.1]} />
              <meshStandardMaterial color={BRICK} roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ 2370: the camp
const Camp: React.FC<{t: number}> = ({t}) => {
  const k = beatK('army', t);
  if (k < -0.15 || k > 1.08) return null;
  const fall = campFall(t);
  const n = 40;
  return (
    <group position={[CAMP[0], 0, CAMP[1]]}>
      {Array.from({length: n}, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        // the side facing the army (south) goes down first
        const south = Math.sin(a) > 0 ? 0 : 0.4;
        const tip = clamp01((fall - south) / 0.5);
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * CAMP_R, 0.45 * (1 - tip * 0.6), Math.sin(a) * CAMP_R]}
            rotation={[tip * 1.3 * Math.sin(a), 0, -tip * 1.3 * Math.cos(a)]}
            castShadow
          >
            <cylinderGeometry args={[0.09, 0.11, 0.9, 5]} />
            <meshStandardMaterial color="#6e4e30" roughness={1} />
          </mesh>
        );
      })}
      {[[-0.8, -0.6], [0.7, -0.4], [0, 0.8], [-0.9, 0.9], [1.0, 0.9]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.3, z]} rotation-y={0.4 * i} castShadow>
          <coneGeometry args={[0.55, 0.6, 4]} />
          <meshStandardMaterial color="#cdbf9a" flatShading />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ 2486: Nakhonban
const Capital: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  if (Y < 1942.6 || Y > 1962) return null;
  const k = capitalK(t, Y);
  // the House turns the plan down (July 2487): the halls stand empty, their roofs go
  const left = ramp(Y, 1944.6, 1952);
  return (
    <>
      {CAP_ROADS.map(([a, b], i) => {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const len = L * k;
        if (len < 0.1) return null;
        const ux = (b[0] - a[0]) / L;
        const uz = (b[1] - a[1]) / L;
        return (
          <mesh key={i} position={[a[0] + (ux * len) / 2, 0.04, a[1] + (uz * len) / 2]} rotation-y={Math.atan2(ux, uz)} receiveShadow>
            <boxGeometry args={[0.9, 0.04, len]} />
            <meshStandardMaterial color="#c9a46a" roughness={1} transparent opacity={1 - 0.6 * left} />
          </mesh>
        );
      })}
      {CAP_ROADS.flatMap(([a, b], i) => {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const ux = (b[0] - a[0]) / L;
        const uz = (b[1] - a[1]) / L;
        return Array.from({length: Math.floor(L / 5)}, (_, j) => {
          const s = 3 + j * 5;
          const hk = clamp01((k * L - s) / 2.5);
          const side = j % 2 ? 1 : -1;
          const x = a[0] + ux * s - uz * side * 1.9;
          const z = a[1] + uz * s + ux * side * 1.9;
          return (
            <Grow key={`${i}-${j}`} k={hk} at={[x, 0, z]} rot={Math.atan2(ux, uz)}>
              <Hall roof={1 - left} />
            </Grow>
          );
        });
      })}
      {Array.from({length: WORKERS}, (_, i) => {
        const w = workerAt(i, t);
        return w ? (
          <group key={i} position={[w.x, 0, w.z]} rotation-y={w.rot} scale={0.45}>
            <Walker step={w.step} i={i} load={i % 3 === 0} />
          </group>
        ) : null;
      })}
    </>
  );
};

// ------------------------------------------------------------------ the tamarind orchards
const Orchards: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  const k = ramp(Y, 1958, 1968);
  if (k < 0.02) return null;
  return (
    <>
      {ORCHARDS.map((o, i) =>
        Array.from({length: Math.floor(o.w / 1.7)}, (_, a) =>
          Array.from({length: Math.floor(o.h / 1.7)}, (_, b) => {
            const x = o.c[0] - o.w / 2 + 0.85 + a * 1.7;
            const z = o.c[1] - o.h / 2 + 0.85 + b * 1.7;
            return (
              <Grow key={`${i}-${a}-${b}`} k={k} at={[x, 0, z]}>
                <Tamarind s={0.9} />
              </Grow>
            );
          }),
        ),
      )}
      {Array.from({length: PICKERS}, (_, i) => {
        const p = pickerAt(i, t);
        return p ? (
          <group key={`p${i}`} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.42}>
            <Walker step={p.step} i={i} load />
          </group>
        ) : null;
      })}
      {Array.from({length: TRUCKS}, (_, i) => {
        const tr = truckAt(i, t);
        return tr ? (
          <group key={`t${i}`} position={[tr.x, 0, tr.z]} rotation-y={tr.rot} scale={0.75}>
            <Truck />
          </group>
        ) : null;
      })}
    </>
  );
};

// ------------------------------------------------------------------ the payoff: อุ้มพระดำน้ำ
const Rite: React.FC<{t: number; night: number}> = ({t}) => {
  const d = dipAt(t);
  if (!d) return null;
  const S = RITE_SCALE;
  // they wade in from the west bank to waist depth, lower again as they dip
  // shoulder deep at the bottom of a dip: the image dips to its knees, never under
  const y = -0.45 * S * d.wade - d.dip * 0.3 * S;
  const halo = d.raise;
  return (
    <group position={[GOV[0] - (1 - d.wade) * 2.6, 0, GOV[1]]} rotation-y={FACE}>
      <group position={[0, y, 0]} scale={S}>
        <RiteFigure i={0} hold uniform="#f6f3ea" />
        {/* the image, held at the chest, facing out like the cover */}
        <group position={[0, 0.72, 0.42]} scale={0.62}>
          <MahaThammaracha glow={0.2 + 0.4 * halo} />
          <Halo k={0.35 + 0.65 * halo} />
        </group>
      </group>
      {/* the four officials round him, dipping with him */}
      {Array.from({length: OFFICIALS}, (_, i) => {
        const a = Math.PI * (0.65 + (i / (OFFICIALS - 1)) * 0.7) + Math.PI;
        return (
          <group key={i} position={[Math.sin(a) * 1.25 * S, y - 0.05 * S, Math.cos(a) * 1.25 * S]} rotation-y={a + Math.PI} scale={S * 0.95}>
            <RiteFigure i={i + 1} uniform="#ecebe4" />
          </group>
        );
      })}
      {/* the rings the dips send out */}
      {d.dip > 0.05 && (
        <mesh position={[0, 0.2, 0]} rotation-x={-Math.PI / 2} scale={1.2 + d.dip * 0.8}>
          <ringGeometry args={[0.95, 1.0, 40]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3 * d.dip} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};
/** the people on the banks and the boats moored along them */
const RiteCrowd: React.FC<{t: number}> = ({t}) => {
  const k = beatK('payoff', t);
  if (k < -0.15 || k > 1.3) return null;
  const pts = Array.from({length: 26}, (_, i) => {
    const p = along(HIGH, 12 + i * 0.55);
    const side = i % 2 ? 1 : -1;
    const off = HIGH_W / 2 + 0.6 + (i % 3) * 0.35;
    return {x: p.x + Math.cos(p.rot) * side * off, z: p.z - Math.sin(p.rot) * side * off, rot: p.rot + (side > 0 ? -Math.PI / 2 : Math.PI / 2), i};
  }).filter(
    // nobody stands on the water: not on another arm of the high water, nor on the filled hairpin
    (p) => !HIGH.some(([x, z]) => Math.hypot(x - p.x, z - p.z) < HIGH_W / 2 + 0.25) && !WEDGE_FILL.some(([x, z]) => Math.hypot(x - p.x, z - p.z) < 0.6),
  );
  return (
    <>
      {pts.map((p) => (
        <group key={p.i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.55}>
          <Walker step={t * 0.3 + p.i * 0.2} i={p.i} still />
        </group>
      ))}
    </>
  );
};

export const PhetchabunLandmarks: React.FC<LandmarkProps> = ({Y, t, night}) => {
  const hw = highWater(t);
  return (
    <>
      {hw > 0.02 && <Ribbon pts={HIGH} w={1 + (HIGH_W - 1) * hw} y={0.15} banks={false} taper={[HIGH_TAPER, 1]} />}
      {/* the hairpin's thin land wedge filled in at the rite's high water, and a round pool on each
          corner of the river's own line (its sharp corners never poke out of the smoothed high
          water): flat discs on the water's top face, no side walls, merged into one mesh, so the
          shader look's ambient occlusion finds no seams to darken (the workstation's 8becca7 render) */}
      {hw > 0.02 && <WaterPatches k={hw} fill={hw > 0.5 && t > 30} />}
      <Cover t={t} />
      <Image t={t} />
      <Procession t={t} />

      <Mahathat night={night} />
      <Traiphum Y={Y} />
      <OldTown Y={Y} />
      <AyutthayaWall Y={Y} t={t} />
      {Array.from({length: BUILDERS}, (_, i) => {
        const b = builderAt(i, t);
        return b ? (
          <group key={`b${i}`} position={[b.x, 0, b.z]} rotation-y={b.rot} scale={0.75}>
            <Walker step={b.step} i={i} load={i % 2 === 0} />
          </group>
        ) : null;
      })}

      <Camp t={t} />
      {Array.from({length: ARMY_COLS}, (_, c) =>
        Array.from({length: ARMY_ROWS}, (_, r) => {
          const a = armyAt(c, r, t);
          if (!a) return null;
          return a.elephant ? (
            <group key={`a${c}${r}`} position={[a.x, 0, a.z]} rotation-y={a.rot} scale={ARMY_S}>
              <Elephant step={a.step} howdah />
            </group>
          ) : (
            <group key={`a${c}${r}`} position={[a.x, 0, a.z]} rotation-y={a.rot} scale={ARMY_S * 0.8}>
              <Walker step={a.step} i={c + r} spear still={a.step === 0} />
            </group>
          );
        }),
      )}

      <Capital Y={Y} t={t} />
      {Y > 1990 && (
        <group position={[NAKHONBAN[0], 0, NAKHONBAN[1]]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[1.2, 0.6, 1.2]} />
            <meshStandardMaterial color="#e8e2d2" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[0.35, 1.3, 0.35]} />
            <meshStandardMaterial color="#d9a43a" metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      )}
      <Orchards Y={Y} t={t} />

      <Rite t={t} night={night} />
      <RiteCrowd t={t} />
    </>
  );
};
