import React, {useMemo} from 'react';
import * as THREE from 'three';
import {lathe, prism, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp} from '../../lib';
import {Naga} from '../ubon/Naga';
import {KuyRider, NECK, SurinElephant} from '../surin/figures';
import {
  along, armyAt, ARMY_COLS, ARMY_ROWS, beatK, bullAt, BULL_S, CH_MOAT, CIRCLE_N, circlerAt, clamp01, DIGGERS, diggerAt, fleerAt,
  floodK, HERO_W, HIGH_W, heroBoatAt, PAY_D, RACE_D0, highWater, palisadeK, PAY_N, payBoatAt, planeAt, PLANE_S, RACE_N, raceBoatAt, returnerAt, SETTLERS,
  settlerAt, TOWN_LEN, TOWN_RING, WALKERS, type Boat,
} from './actors';
import {NanBoat} from './boat';
import {Biplane, Bull, Cart, Walker} from './figures';
import {
  AIRFIELD, AIRFIELD_LEN, BOAT_MONUMENT, BRIDGE_MAIN, BRIDGE_NORTH, BRIDGE_SOUTH, CHAE_HAENG, CHANG_KHAM, GATES, HOKHAM, KHAO_NOI,
  MING_MUEANG, NEW_REACH, OLD_REACH, OLD_RIVER, PHUMIN, RIVER, RIVER_W, TOWN, WIANG_NUEA, WN_INNER, WN_OUTER,
} from './places';

type P = [number, number];
const WATER = '#3f8fc0';
const BANK = '#c2b184';
const WHITEWASH = '#f1ece0';
const ROOF = '#9b3a2a';
const TIMBER = '#6e4e30';
const GOLD = '#d9a43a';
const BRICK = '#a9583c';

// a growing mesh is gated on its own scale (CLAUDE.md: a mesh at scale 0 blacks out the shader look)
const Grow: React.FC<{k: number; children: React.ReactNode; at: [number, number, number]; rot?: number}> = ({k, children, at, rot = 0}) =>
  k > 0.02 ? (
    <group position={at} rotation-y={rot} scale={[1, Math.max(0.03, k), 1]}>
      {children}
    </group>
  ) : null;

const edgesOf = (pts: P[], closed: boolean) =>
  closed ? pts.map((a, i) => [a, pts[(i + 1) % pts.length]] as [P, P]) : pts.slice(1).map((b, i) => [pts[i], b] as [P, P]);

// ------------------------------------------------------------------ water
/** Water along `pts`, `w` wide, with rounded joints and sandy banks. `dug` 0..1 digs it edge
 *  by edge (a moat). */
const Ribbon: React.FC<{pts: P[]; w: number; closed?: boolean; dug?: number; y?: number; color?: string; banks?: boolean}> = ({
  pts,
  w,
  closed = false,
  dug = 1,
  y = 0.05,
  color = WATER,
  banks = true,
}) => {
  if (w < 0.04 || dug < 0.01) return null;
  const E = edgesOf(pts, closed);
  const n = dug * E.length;
  return (
    <>
      {E.map(([a, b], i) => {
        const e = Math.min(1, Math.max(0, n - i));
        if (e <= 0.02) return null;
        const full = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const len = full * e;
        const ux = (b[0] - a[0]) / full;
        const uz = (b[1] - a[1]) / full;
        const cx = a[0] + (ux * len) / 2;
        const cz = a[1] + (uz * len) / 2;
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

const Rivers: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  const hw = highWater(t);
  // 2398: the river leaves the channel under the east wall for today's course
  const swing = clamp01((Y - 1855.15) / 1.6);
  const base = RIVER_W + (HERO_W - RIVER_W) * hw.hero + (HIGH_W - RIVER_W) * hw.pay * (1 - hw.hero);
  const north = RIVER.slice(0, 11);
  const south = RIVER.slice(17);
  const oldW = (RIVER_W + (1.9 - RIVER_W) * hw.race + (HERO_W - RIVER_W) * hw.hero) * (1 - swing) + 0.42 * swing;
  return (
    <>
      <Ribbon pts={north} w={base} />
      <Ribbon pts={south} w={RIVER_W} />
      {Y < 1960 && <Ribbon pts={OLD_REACH} w={oldW} color={swing > 0.5 ? '#4f8fa6' : WATER} banks={swing < 0.9} />}
      {swing > 0.02 && <Ribbon pts={NEW_REACH} w={base * smooth01(swing)} />}
    </>
  );
};
const smooth01 = (x: number) => x * x * (3 - 2 * x);

/** The 2360 flood: a sheet of water spreading out from the channel over the town. */
const Flood: React.FC<{t: number}> = ({t}) => {
  const k = floodK(t);
  if (k < 0.02) return null;
  return (
    <mesh position={[4, 0.36 * k, -2]} scale={[4 + 16 * k, 1, 3 + 14 * k]}>
      <cylinderGeometry args={[1, 1, 0.08, 40]} />
      <meshStandardMaterial color="#5d8fae" roughness={0.2} metalness={0.2} transparent opacity={0.72} />
    </mesh>
  );
};

// ------------------------------------------------------------------ small buildings and props
const Hut: React.FC<{s?: number; roof?: string}> = ({s = 1, roof = '#b89a5e'}) => (
  <group scale={s}>
    {[-1, 1].map((x) =>
      [-1, 1].map((z) => (
        <mesh key={`${x}${z}`} position={[x * 0.4, 0.3, z * 0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 4]} />
          <meshStandardMaterial color={TIMBER} />
        </mesh>
      )),
    )}
    <mesh position={[0, 0.75, 0]} castShadow>
      <boxGeometry args={[1, 0.4, 0.8]} />
      <meshStandardMaterial color="#9b7a52" />
    </mesh>
    <mesh position={[0, 1.15, 0]} rotation-y={Math.PI / 4} scale={[0.9, 0.5, 0.75]} castShadow>
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial color={roof} flatShading />
    </mesh>
  </group>
);

// a Lanna bell chedi (lathe profile shared with Lampang's)
const LANNA: [number, number][] = [
  [0, 0], [1.2, 0], [1.2, 0.35], [1.0, 0.35], [1.0, 0.7], [0.85, 0.7], [0.85, 1.0],
  [0.95, 1.1], [0.9, 1.6], [0.7, 1.95], [0.45, 2.15], [0.28, 2.25], [0.24, 2.8],
  [0.15, 3.3], [0.08, 3.9], [0, 4.3],
];
const Chedi: React.FC<{at: [number, number, number]; s: number; k: number; color: string; night: number}> = ({at, s, k, color, night}) => {
  const geo = useMemo(() => lathe(LANNA, 16), []);
  return k < 0.02 ? null : (
    <mesh geometry={geo} position={at} scale={[s, s * k, s]} castShadow>
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} emissive="#ffc861" emissiveIntensity={night * 0.5} />
    </mesh>
  );
};

// ------------------------------------------------------------------ the boats
const BoatAt: React.FC<{b: Boat | null; pairs?: number}> = ({b, pairs}) =>
  b && b.s > 0.03 ? (
    <group position={[b.x, 0.1, b.z]} rotation-y={b.rot} scale={b.s}>
      <NanBoat t={b.t} shirt={b.shirt} band={b.band} pairs={pairs} />
    </group>
  ) : null;

// ------------------------------------------------------------------ Wiang Phu Phiang Chae Haeng
const ChaeHaeng: React.FC<{Y: number; t: number; night: number; g: LandmarkProps['terrainH']; beat: LandmarkProps['beat']}> = ({Y, t, night, g, beat}) => {
  const [x, z] = CHAE_HAENG;
  const y = g(x, z);
  const dig = clamp01(beat('chaehaeng') / 0.8) + (Y > 1368 ? 1 : 0);
  const chedi = ramp(Y, 1360, 1364);
  const huts = ramp(Y, 1360.5, 1363) * (1 - ramp(Y, 1368.1, 1368.42));
  return (
    <>
      <Ribbon pts={CH_MOAT} w={0.55} closed dug={Math.min(1, dig)} y={0.04} />
      {/* the walled temple on the rise: the chedi, the viharn, the naga stair (2349) */}
      <group position={[x, y, z]}>
        {chedi > 0.02 && (
          <mesh position={[0, 0.2, 0]} receiveShadow>
            <boxGeometry args={[3.0, 0.4, 3.0]} />
            <meshStandardMaterial color="#e9e0cc" roughness={0.9} />
          </mesh>
        )}
        <Chedi at={[0, 0.4, 0]} s={0.5} k={chedi} color={GOLD} night={night} />
        <Viharn pos={[0, 0.4, 2.4]} k={ramp(Y, 1362, 1364)} scale={0.55} />
        {Y > 1806 &&
          [-0.55, 0.55].map((sx) => (
            <mesh key={sx} position={[sx, 0.25, -3.2]} rotation-x={0.06}>
              <boxGeometry args={[0.16, 0.3, 4.2]} />
              <meshStandardMaterial color="#e3a935" metalness={0.35} roughness={0.45} />
            </mesh>
          ))}
      </group>
      {huts > 0.02 &&
        Array.from({length: 9}, (_, i) => {
          const a = (i / 9) * Math.PI * 2 + 0.3;
          const hx = x + Math.cos(a) * 1.7;
          const hz = z + Math.sin(a) * 2.6;
          return (
            <Grow key={i} k={huts} at={[hx, g(hx, hz), hz]} rot={-a}>
              <Hut s={0.45} />
            </Grow>
          );
        })}
      {/* the diggers with their baskets */}
      {Array.from({length: DIGGERS}, (_, i) => {
        const d = diggerAt(i, t);
        return d ? (
          <group key={`d${i}`} position={[d.x, g(d.x, d.z), d.z]} rotation-y={d.rot} scale={0.55}>
            <Walker step={d.step} i={i} load={i % 2 === 0} />
          </group>
        ) : null;
      })}
    </>
  );
};

// ------------------------------------------------------------------ the town's walls
/** 1911-2360: a log palisade round the town, put up behind the bull; the flood knocks it down. */
const Palisade: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  const k = Y < 1368.6 ? palisadeK(t) : 1;
  const fall = beatK('flood', t);
  if (k < 0.01 || Y > 1817.6) return null;
  const n = Math.floor(TOWN_LEN / 0.42);
  // it starts on the east side, where the bull came in, and closes both ways round
  const start = 0.32;
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const u = i / n;
        const fromStart = Math.min(Math.abs(u - start), 1 - Math.abs(u - start)) * 2;
        if (fromStart > k) return null;
        const p = along(TOWN_RING, u * TOWN_LEN);
        // the flood fells the east side first, then the rest
        const east = p.x > 2 ? 0 : 0.25;
        const tip = clamp01((fall - 0.25 - east) / 0.25);
        return (
          <mesh key={i} position={[p.x, 0.55 * (1 - tip * 0.6), p.z]} rotation={[0, p.rot, tip * 1.35 * (i % 2 ? 1 : -1)]} castShadow>
            <cylinderGeometry args={[0.12, 0.14, 1.1, 5]} />
            <meshStandardMaterial color={TIMBER} roughness={1} />
          </mesh>
        );
      })}
    </>
  );
};

/** 2398-2400: the brick wall with its gates and four corner forts. Most of it went in the 20th
 *  century; the north stretch stands (restored 2536). */
const BrickWall: React.FC<{Y: number}> = ({Y}) => {
  if (Y < 1855.5) return null;
  const E = edgesOf(TOWN, true);
  const gatesAt = GATES.filter((gt) => Y > gt.year);
  const up = (i: number) => smooth01(clamp01((Y - 1855.5 - i * 0.16) / 0.6));
  const gone = (i: number) => (i === 0 ? 0 : ramp(Y, 1950 + i * 2, 1966 + i * 2));
  return (
    <>
      {E.map(([a, b], i) => {
        const k = up(i) * (1 - gone(i));
        if (k < 0.02) return null;
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const ux = (b[0] - a[0]) / L;
        const uz = (b[1] - a[1]) / L;
        // cut the edge round its gates
        const cuts = gatesAt
          .map((gt) => ((gt.at[0] - a[0]) * ux + (gt.at[1] - a[1]) * uz))
          .filter((s, j) => s > 0.4 && s < L - 0.4 && Math.abs((gatesAt[j].at[0] - a[0]) * -uz + (gatesAt[j].at[1] - a[1]) * ux) < 0.6)
          .sort((p, q) => p - q);
        const spans: [number, number][] = [];
        let s0 = 0;
        cuts.forEach((c) => {
          spans.push([s0, c - 0.55]);
          s0 = c + 0.55;
        });
        spans.push([s0, L]);
        const rot = Math.atan2(ux, uz);
        return spans.map(([p0, p1], j) => {
          const len = p1 - p0;
          if (len < 0.1) return null;
          const m = (p0 + p1) / 2;
          const cx = a[0] + ux * m;
          const cz = a[1] + uz * m;
          const merlons = Math.floor(len / 0.5);
          return (
            <group key={`${i}-${j}`} position={[cx, 0, cz]} rotation-y={rot} scale={[1, k, 1]}>
              <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.6, 1.0, len]} />
                <meshStandardMaterial color={BRICK} roughness={0.9} />
              </mesh>
              {Array.from({length: merlons}, (_, q) => (
                <mesh key={q} position={[0, 1.12, -len / 2 + 0.25 + q * 0.5]} castShadow>
                  <boxGeometry args={[0.6, 0.24, 0.26]} />
                  <meshStandardMaterial color={BRICK} roughness={0.9} />
                </mesh>
              ))}
            </group>
          );
        });
      })}
      {gatesAt.map((gt, i) => {
        const e = E.findIndex(([a, b]) => {
          const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
          const s = ((gt.at[0] - a[0]) * (b[0] - a[0]) + (gt.at[1] - a[1]) * (b[1] - a[1])) / L;
          const d = Math.abs(((gt.at[0] - a[0]) * -(b[1] - a[1]) + (gt.at[1] - a[1]) * (b[0] - a[0])) / L);
          return s > 0 && s < L && d < 0.6;
        });
        const [a, b] = E[Math.max(0, e)];
        const k = up(Math.max(0, e)) * (1 - gone(Math.max(0, e)));
        if (k < 0.02) return null;
        const rot = Math.atan2(b[0] - a[0], b[1] - a[1]);
        return (
          <group key={gt.name} position={[gt.at[0], 0, gt.at[1]]} rotation-y={rot} scale={[1, k, 1]}>
            {[-0.62, 0.62].map((s) => (
              <mesh key={s} position={[0, 0.75, s]} castShadow>
                <boxGeometry args={[0.85, 1.5, 0.3]} />
                <meshStandardMaterial color={WHITEWASH} roughness={0.9} />
              </mesh>
            ))}
            <mesh position={[0, 1.62, 0]} castShadow>
              <boxGeometry args={[0.95, 0.25, 1.6]} />
              <meshStandardMaterial color={WHITEWASH} roughness={0.9} />
            </mesh>
            <mesh position={[0, 2.0, 0]} rotation-y={Math.PI / 2} castShadow>
              <coneGeometry args={[0.85, 0.6, 4]} />
              <meshStandardMaterial color={ROOF} flatShading />
            </mesh>
          </group>
        );
      })}
      {[TOWN[0], TOWN[2], TOWN[3], TOWN[6]].map(([x, z], i) => {
        const k = up(i * 2) * (1 - gone(i === 0 ? 1 : i * 2));
        return k < 0.02 ? null : (
          <mesh key={i} position={[x, 0.7 * k, z]} scale={[1, k, 1]} castShadow>
            <cylinderGeometry args={[0.85, 0.95, 1.4, 8]} />
            <meshStandardMaterial color={BRICK} roughness={0.9} />
          </mesh>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ temples and halls
/** Wat Phra That Chang Kham: the chedi on a base carried by elephants (1949). */
const ChangKham: React.FC<{Y: number; night: number}> = ({Y, night}) => {
  const k = ramp(Y, 1405, 1407);
  if (k < 0.02) return null;
  const [x, z] = CHANG_KHAM;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.35 * k, 0]} scale={[1, k, 1]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.7, 2.2]} />
        <meshStandardMaterial color={WHITEWASH} roughness={0.9} />
      </mesh>
      {k > 0.9 &&
        [0, 1, 2, 3].map((side) =>
          [-0.6, 0, 0.6].map((o) => {
            const a = (side * Math.PI) / 2;
            const ex = Math.cos(a) * 1.15 - Math.sin(a) * o;
            const ez = Math.sin(a) * 1.15 + Math.cos(a) * o;
            return (
              <group key={`${side}${o}`} position={[ex, 0.28, ez]} rotation-y={-a + Math.PI / 2}>
                <mesh scale={[0.22, 0.24, 0.2]} castShadow>
                  <sphereGeometry args={[1, 8, 6]} />
                  <meshStandardMaterial color="#e4ddd0" roughness={0.9} />
                </mesh>
                <mesh position={[0, -0.12, 0.2]} scale={[0.05, 0.16, 0.05]}>
                  <cylinderGeometry args={[1, 0.8, 1, 5]} />
                  <meshStandardMaterial color="#e4ddd0" />
                </mesh>
              </group>
            );
          }),
        )}
      <Chedi at={[0, 0.7 * k, 0]} s={0.42} k={k} color={GOLD} night={night} />
      <Viharn pos={[2.6, 0, 0.2]} k={k} rot={Math.PI / 2} scale={0.55} />
    </group>
  );
};

/** Wat Phumin (2139): the cruciform hall carried on the backs of two nagas running north-south. */
const Phumin: React.FC<{Y: number; t: number; night: number; beat: LandmarkProps['beat']}> = ({Y, t, night, beat}) => {
  const k = Y > 1596.5 ? 1 : smooth01(clamp01(beat('phumin') / 0.55));
  const roofA = useMemo(() => prism(1.6, 0.8, 3.4), []);
  const roofB = useMemo(() => prism(1.2, 0.6, 2.6), []);
  const nagaPts = useMemo(
    () =>
      [-1, 1].map((s) =>
        Array.from({length: 22}, (_, i) => {
          const u = i / 21;
          // head out at the north stair, the body under the hall, the tail out to the south
          return [PHUMIN[0] + s * 1.15, 0.45 + 0.9 * Math.max(0, 1 - u * 6) + 0.05 * Math.sin(u * 9), PHUMIN[1] - 2.6 + u * 5.4] as [number, number, number];
        }),
      ),
    [],
  );
  if (k < 0.02) return null;
  return (
    <>
      {k > 0.25 && nagaPts.map((pts, i) => <Naga key={i} pts={pts} r={0.2} jaw={0.4} night={night} t={t} />)}
      <Grow k={k} at={[PHUMIN[0], 0, PHUMIN[1]]}>
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[2.6, 0.5, 2.6]} />
          <meshStandardMaterial color="#e9e0cc" roughness={0.9} />
        </mesh>
        {[0, Math.PI / 2].map((r) => (
          <group key={r} rotation-y={r}>
            <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.25, 0.9, 3.0]} />
              <meshStandardMaterial color={WHITEWASH} roughness={0.9} />
            </mesh>
            <mesh geometry={roofA} position={[0, 1.4, 0]} castShadow>
              <meshStandardMaterial color={ROOF} roughness={0.7} flatShading side={THREE.DoubleSide} />
            </mesh>
            <mesh geometry={roofB} position={[0, 1.95, 0]} castShadow>
              <meshStandardMaterial color="#b8452f" roughness={0.7} flatShading side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 2.75, 0]} castShadow>
          <coneGeometry args={[0.22, 0.9, 6]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
        </mesh>
      </Grow>
    </>
  );
};

/** หอคำ: the ruler's wooden hall (2400), then the brick hall (2446), the museum since 2517. */
const HoKham: React.FC<{Y: number}> = ({Y}) => {
  const wood = ramp(Y, 1856, 1857.2) * (1 - ramp(Y, 1902, 1903));
  const brick = ramp(Y, 1903, 1904);
  const [x, z] = HOKHAM;
  return (
    <group position={[x, 0, z]}>
      {wood > 0.02 && (
        <Grow k={wood} at={[0, 0, 0]}>
          <Hut s={1.1} roof="#7a5534" />
        </Grow>
      )}
      {brick > 0.02 && (
        <Grow k={brick} at={[0, 0, 0]}>
          <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 1.4, 1.5]} />
            <meshStandardMaterial color="#f3ead8" roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.4, 0]} rotation-y={Math.PI / 4} scale={[1.9, 0.7, 1.2]} castShadow>
            <coneGeometry args={[1, 1, 4]} />
            <meshStandardMaterial color={ROOF} flatShading />
          </mesh>
        </Grow>
      )}
    </group>
  );
};

/** Wat Phra That Khao Noi on its hill (2030) and the standing gilt Buddha (2542). */
const KhaoNoi: React.FC<{Y: number; g: LandmarkProps['terrainH']; night: number}> = ({Y, g, night}) => {
  const [x, z] = KHAO_NOI;
  const y = g(x, z);
  const buddha = ramp(Y, 1998, 2000);
  return (
    <group position={[x, y, z]}>
      <Chedi at={[0.8, 0, -0.3]} s={0.22} k={ramp(Y, 1486, 1488)} color={WHITEWASH} night={night} />
      {buddha > 0.02 && (
        <Grow k={buddha} at={[0, 0, 0.6]} rot={Math.PI / 2}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.55, 0.65, 0.6, 10]} />
            <meshStandardMaterial color={WHITEWASH} />
          </mesh>
          <mesh position={[0, 1.4, 0]} scale={[0.32, 0.85, 0.24]} castShadow>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} emissive="#ffc861" emissiveIntensity={night * 0.4} />
          </mesh>
          <mesh position={[0, 2.35, 0]} castShadow>
            <sphereGeometry args={[0.18, 10, 8]} />
            <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 2.62, 0]}>
            <coneGeometry args={[0.07, 0.25, 6]} />
            <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} />
          </mesh>
        </Grow>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ Wiang Nuea, 2360-2398
const rect = (c: P, [w, h]: [number, number]): P[] => [
  [c[0] - w / 2, c[1] - h / 2],
  [c[0] + w / 2, c[1] - h / 2],
  [c[0] + w / 2, c[1] + h / 2],
  [c[0] - w / 2, c[1] + h / 2],
];
const WN_OUT = rect(WIANG_NUEA, WN_OUTER);
const WN_IN = rect(WIANG_NUEA, WN_INNER);
const WiangNuea: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  const k = beatK('flood', t);
  const dig = Y > 1817.5 ? 1 : clamp01((k - 0.45) / 0.45);
  // the moats silt up as the town spreads over them
  const silt = ramp(Y, 1950, 1985);
  const huts = (Y > 1817.5 ? 1 : clamp01((k - 0.6) / 0.35)) * (1 - ramp(Y, 1855.3, 1856.6));
  if (dig < 0.01) return null;
  return (
    <>
      {silt < 0.98 && <Ribbon pts={WN_OUT} closed w={0.55 * (1 - silt)} dug={dig} y={0.04} color="#5a95b0" />}
      {silt < 0.98 && <Ribbon pts={WN_IN} closed w={0.5 * (1 - silt)} dug={dig} y={0.04} color="#5a95b0" />}
      {huts > 0.02 &&
        Array.from({length: 14}, (_, i) => {
          const hx = WIANG_NUEA[0] - WN_INNER[0] / 2 + 0.9 + (i % 3) * ((WN_INNER[0] - 1.8) / 2);
          const hz = WIANG_NUEA[1] - WN_INNER[1] / 2 + 0.9 + Math.floor(i / 3) * ((WN_INNER[1] - 1.8) / 4);
          return (
            <Grow key={i} k={huts} at={[hx, 0, hz]} rot={i * 0.7}>
              <Hut s={0.55} />
            </Grow>
          );
        })}
    </>
  );
};

// ------------------------------------------------------------------ the airfield, ~2470
const Airfield: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  if (Y < 1926.6) return null;
  const paved = ramp(Y, 1965, 1968);
  const [x, z] = AIRFIELD;
  const p = planeAt(t);
  const crowd = Y < 1940;
  return (
    <>
      <mesh position={[x, 0.03, z]} receiveShadow>
        <boxGeometry args={[1.4, 0.04, AIRFIELD_LEN]} />
        <meshStandardMaterial color={paved > 0.5 ? '#6f6f6a' : '#c7c08a'} roughness={1} />
      </mesh>
      {Y < 1990 && (
        <mesh position={[x - 1.6, 0.45, z + 3]} castShadow>
          <boxGeometry args={[1.2, 0.9, 1.6]} />
          <meshStandardMaterial color="#b7a27a" roughness={1} />
        </mesh>
      )}
      {crowd &&
        Array.from({length: 26}, (_, i) => {
          const side = i % 2 ? 1 : -1;
          const px = x + side * (1.3 + (i % 3) * 0.35);
          const pz = z + 0.5 + Math.floor(i / 2) * 0.42;
          return (
            <group key={i} position={[px, 0, pz]} rotation-y={-side * Math.PI / 2} scale={0.5}>
              <Walker step={0} i={i} still />
            </group>
          );
        })}
      {p && (
        <group position={[p.x, p.y - 0.9, p.z]} rotation-y={p.rot} scale={PLANE_S}>
          <Biplane prop={p.prop} pitch={p.pitch} />
        </group>
      )}
    </>
  );
};

// ------------------------------------------------------------------ the bridges
const Bridge: React.FC<{ends: [P, P]; k: number}> = ({ends: [a, b], k}) => {
  if (k < 0.02) return null;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const rot = Math.atan2(b[0] - a[0], b[1] - a[1]);
  return (
    <group position={[(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2]} rotation-y={rot} scale={[1, k, 1]}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.14, L + 0.6]} />
        <meshStandardMaterial color="#c9c6bd" roughness={0.9} />
      </mesh>
      {[-0.42, 0.42].map((s) => (
        <mesh key={s} position={[s, 0.56, 0]}>
          <boxGeometry args={[0.06, 0.14, L + 0.6]} />
          <meshStandardMaterial color="#e8e4da" />
        </mesh>
      ))}
      {[-0.25, 0, 0.25].map((u) => (
        <mesh key={u} position={[0, 0.2, u * L]}>
          <boxGeometry args={[0.5, 0.42, 0.25]} />
          <meshStandardMaterial color="#a9a69c" />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ the payoff's grandstand and crowd
const RaceGround: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  const k = ramp(Y, 2008, 2012);
  const crowd = clamp01((beatK('payoff', t) + 0.1) / 0.3);
  const [mx, mz] = BOAT_MONUMENT;
  return (
    <>
      {k > 0.02 && (
        <Grow k={k} at={[mx - 1.3, 0, mz - 2.4]} rot={0.62}>
          {/* the ปะรำพิธี on the west bank */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.0, 4.4]} />
            <meshStandardMaterial color="#f4efe4" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.2, 0]} rotation-y={Math.PI / 4} scale={[1.2, 0.5, 3.4]} castShadow>
            <coneGeometry args={[1, 1, 4]} />
            <meshStandardMaterial color="#c4452f" flatShading />
          </mesh>
        </Grow>
      )}
      {/* the racing-boat monument on its plinth */}
      {Y > 2000 && (
        <group position={[mx, 0, mz]} rotation-y={0.62} scale={0.22}>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[2.4, 1.2, 8]} />
            <meshStandardMaterial color="#d7d0c0" />
          </mesh>
          <group position={[0, 1.4, 0]} scale={0.45}>
            <NanBoat t={0} pairs={8} />
          </group>
        </group>
      )}
      {crowd > 0.02 &&
        Array.from({length: 48}, (_, i) => {
          // both banks, either side of the bridge
          const along0 = (i % 24) * 0.55 - 6.5;
          const side = i < 24 ? -1 : 1;
          const p = along(RIVER, PAY_D + along0);
          const r = Math.atan2(Math.sin(p.rot), Math.cos(p.rot));
          const off = side * (HIGH_W / 2 + 0.55 + (i % 3) * 0.3);
          const px = p.x + Math.cos(r) * off;
          const pz = p.z - Math.sin(r) * off;
          return (
            <group key={i} position={[px, 0, pz]} rotation-y={r - (side * Math.PI) / 2} scale={0.5 * crowd}>
              <Walker step={0} i={i} still />
            </group>
          );
        })}
    </>
  );
};

// ------------------------------------------------------------------ the scene
export const NanLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH: g, beat}) => {
  const b = bullAt(t);
  const bridgeK = (y: number) => ramp(Y, y, y + 2);
  return (
    <>
      <Rivers Y={Y} t={t} />
      <Flood t={t} />

      {/* the cover and the settlers */}
      <BoatAt b={heroBoatAt(t)} />
      {Array.from({length: SETTLERS}, (_, i) => (
        <BoatAt key={i} b={settlerAt(i, t)} pairs={12} />
      ))}

      <ChaeHaeng Y={Y} t={t} night={night} g={g} beat={beat} />

      {/* 1911: the white bull, then the log wall round the new town */}
      {b && (
        <group position={[b.x, g(b.x, b.z) - b.wade * 0.6, b.z]} rotation-y={b.rot} scale={BULL_S}>
          <Bull walk={b.walk} moving={b.moving} />
        </group>
      )}
      <Palisade Y={Y} t={t} />

      {/* 1993: Tilokaraj's army at the west wall */}
      {Array.from({length: ARMY_COLS}, (_, c) =>
        Array.from({length: ARMY_ROWS}, (_, r) => {
          const a = armyAt(c, r, t);
          if (!a) return null;
          return a.elephant ? (
            <group key={`a${c}${r}`} position={[a.x, g(a.x, a.z), a.z]} rotation-y={a.rot} scale={0.8}>
              <SurinElephant walk={a.walk} stride={a.walking ? 1 : 0} tusks={c % 2 === 0} t={t + c} />
              <group position={NECK} scale={0.95}>
                <KuyRider pole swing={Math.sin(t * 2 + c)} />
              </group>
            </group>
          ) : (
            <group key={`a${c}${r}`} position={[a.x, g(a.x, a.z), a.z]} rotation-y={a.rot} scale={0.6}>
              <Walker step={a.walk} i={c + r} spear still={!a.walking} />
            </group>
          );
        }),
      )}

      <ChangKham Y={Y} night={night} />
      <Phumin Y={Y} t={t} night={night} beat={beat} />
      {Array.from({length: CIRCLE_N}, (_, i) => {
        const c = circlerAt(i, t);
        return c ? (
          <group key={`c${i}`} position={[c.x, 0, c.z]} rotation-y={c.rot} scale={0.42}>
            <Walker step={c.step} i={i} />
          </group>
        ) : null;
      })}
      <HoKham Y={Y} />
      <Viharn pos={[MING_MUEANG[0], 0, MING_MUEANG[1]]} k={ramp(Y, 1856.5, 1857.3)} scale={0.6} />
      <KhaoNoi Y={Y} g={g} night={night} />

      {/* 2343: the races in the channel under the east wall */}
      {Array.from({length: RACE_N}, (_, i) => (
        <BoatAt key={`r${i}`} b={raceBoatAt(i, t)} pairs={12} />
      ))}
      {beatK('race', t) > -0.05 &&
        beatK('race', t) < 1.05 &&
        Array.from({length: 26}, (_, i) => {
          const p = along(OLD_RIVER, RACE_D0 + 2 + (i % 13) * 0.9);
          const side = i < 13 ? 1 : -1;
          const off = side * (1.35 + (i % 2) * 0.3);
          return (
            <group key={`rc${i}`} position={[p.x + Math.cos(p.rot) * off, 0, p.z - Math.sin(p.rot) * off]} rotation-y={p.rot - (side * Math.PI) / 2} scale={0.45}>
              <Walker step={0} i={i} still />
            </group>
          );
        })}

      {/* 2360 north to Wiang Nuea, 2398 back */}
      <WiangNuea Y={Y} t={t} />
      {Array.from({length: WALKERS}, (_, i) => {
        const w = fleerAt(i, t) ?? returnerAt(i, t);
        if (!w) return null;
        return (
          <group key={`w${i}`} position={[w.x, 0, w.z]} rotation-y={w.rot}>
            {w.elephant ? (
              <group scale={0.8}>
                <SurinElephant walk={w.step * 0.4} t={t} tusks={i === 0} />
              </group>
            ) : w.cart ? (
              <group scale={0.55}>
                <Cart step={w.step} />
              </group>
            ) : (
              <group scale={0.5}>
                <Walker step={w.step} i={i} load={i % 3 === 0} />
              </group>
            )}
          </group>
        );
      })}
      <BrickWall Y={Y} />

      <Airfield Y={Y} t={t} />
      <Bridge ends={BRIDGE_MAIN} k={bridgeK(1972)} />
      <Bridge ends={BRIDGE_SOUTH} k={bridgeK(1990)} />
      <Bridge ends={BRIDGE_NORTH} k={bridgeK(2004)} />

      {/* the payoff */}
      <RaceGround Y={Y} t={t} />
      {Array.from({length: PAY_N}, (_, i) => (
        <BoatAt key={`p${i}`} b={payBoatAt(i, t)} pairs={i === 0 ? 22 : 16} />
      ))}
    </>
  );
};
