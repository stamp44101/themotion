// Throwaway style frames for Phrae's cover (18 Nov 2026; docs/briefs/phrae_research.md). The rules from experiments
// §17-§20: the symbol fills ~1/3 of the frame at second 0 on the whole land tile at legend scale; it is half made by hand at
// frame 0 (no blank canvas) and changes shape, not only colour.
// A1 (cloud's pick): ลายขนมปังขิง. A giant teak gable board on two trestles; at frame 0 the left half is already fret-sawn
// into lace (rows of rounds, diamonds and drops, the valance of arches), the right half is plain teak with the pattern
// pencilled on; a bow saw cuts the rest hole by hole until CUT_END, each cut-out dropping to the ground; then the lace gable
// lifts and a two-storey teak house grows under it (Wongburi's shape).
// A2: ช้างลากซุงสัก. A giant elephant drags a teak log across the land; the front half of the log is already squared and
// golden, the back half still round in its bark; an adze peels the bark off as it goes until the whole log is a squared beam.
// The Yom (OSM way 1304426787) and the old town's shell outline are drawn from the real map (100 m/unit, origin the city
// pillar ศาลหลักเมืองแพร่).
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {SurinElephant} from '../cities/surin/figures';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const FIELD: P2 = [20, -1];
const YOM: P2[] = [
  [-2.2, -44], [-0.1, -42.1], [4.0, -41.2], [5.9, -40.0], [6.1, -31.2], [3.6, -28.0], [3.3, -25.4], [7.9, -20.0], [8.5, -16.6],
  [7.0, -15.0], [4.3, -13.4], [1.4, -7.7], [-5.3, -7.8], [-6.9, -5.9], [-8.0, -0.9], [-9.6, 0.0], [-13.0, 0.3], [-13.9, 1.0],
  [-15.1, 7.0], [-13.8, 13.7], [-12.9, 15.3], [-9.6, 17.7], [-6.5, 24.5], [-6.0, 27.3], [-6.9, 29.7], [-8.2, 30.4],
  [-14.0, 30.3], [-14.9, 28.5], [-15.9, 23.2], [-18.2, 20.0], [-20.5, 19.3], [-24.6, 19.4], [-36, 19.6],
];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const AZ = 18;
const TEAK = '#a8662a';
const TEAK_DARK = '#6b4325';

/** a puff that bursts out and fades, self-lit (sawdust, chips) */
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

// ---------- A1: a teak gable board fret-sawn into gingerbread lace ----------

export type Hole = {x: number; y: number; r: number; kind: 0 | 1 | 2 | 3; a0?: number; a1?: number; r1?: number};
/** the lace pattern on a gable of base w and height h above a valance strip v deep (board coordinates, y up from the
 *  valance's bottom edge): a sunburst of wedges fanning from the middle of the base, a row of rounds along the rim, and
 *  scallops cut up into the valance's bottom edge. Sorted left to right, the order the saw cuts them. */
export const gableHoles = (w: number, h: number, v: number): Hole[] => {
  const out: Hole[] = [];
  // the valance: scallops cut up from the bottom edge (kind 3) with a round above each
  const nv = 15;
  for (let i = 0; i < nv; i++) {
    const x = (i - (nv - 1) / 2) * (w * 0.96) / nv;
    out.push({x, y: 0, r: (w * 0.96) / nv * 0.42, kind: 3});
    out.push({x, y: v * 0.66, r: v * 0.14, kind: 0});
  }
  // the sunburst: wedges between radius r0 and r1 round the middle of the base
  const r0 = h * 0.2;
  const r1 = h * 0.72;
  const nw = 13;
  for (let i = 0; i < nw; i++) {
    const a0 = Math.PI * (0.06 + (i / nw) * 0.88);
    const a1 = a0 + Math.PI * 0.88 / nw * 0.55;
    const am = (a0 + a1) / 2;
    // keep each wedge inside the triangle: shorten the low ones
    const lim = (h * 0.92) / (Math.sin(am) + (2 * h / w) * Math.abs(Math.cos(am)));
    out.push({x: Math.cos(am) * (r0 + r1) * 0.5, y: v + Math.sin(am) * (r0 + r1) * 0.5, r: r0, r1: Math.min(r1, lim * 0.86), a0, a1, kind: 2});
  }
  // the half round at the hub
  out.push({x: 0, y: v + h * 0.06, r: h * 0.12, kind: 1});
  // rounds along the two slopes
  const nr = 8;
  for (let i = 0; i < nr; i++) {
    const f = 0.12 + (i / (nr - 1)) * 0.72;
    for (const s of [-1, 1]) out.push({x: s * (w / 2) * (1 - f) * 0.9, y: v + h * f * 0.9 - h * 0.05, r: h * 0.035, kind: 0});
  }
  return out.sort((a, b) => a.x - b.x || a.y - b.y);
};

const holePath = (hl: Hole, v: number) => {
  const p = new THREE.Path();
  const {x, y, r} = hl;
  if (hl.kind === 0) p.absarc(x, y, r, 0, Math.PI * 2, true);
  else if (hl.kind === 1) {
    // the hub: a half round sitting on the valance
    p.moveTo(x - r, v + 0.001);
    p.lineTo(x + r, v + 0.001);
    p.absarc(x, v + 0.001, r, 0, Math.PI, false);
  } else if (hl.kind === 2) {
    const a0 = hl.a0 ?? 0;
    const a1 = hl.a1 ?? 0;
    const r1 = hl.r1 ?? r * 2;
    const cy = v;
    p.moveTo(Math.cos(a0) * r, cy + Math.sin(a0) * r);
    p.lineTo(Math.cos(a0) * r1, cy + Math.sin(a0) * r1);
    p.absarc(0, cy, r1, a0, a1, false);
    p.lineTo(Math.cos(a1) * r, cy + Math.sin(a1) * r);
    p.absarc(0, cy, r, a1, a0, true);
  }
  return p;
};

/** the board (valance strip + triangle) with the first `cut` holes sawn out, extruded `d` thick */
const GableBoard: React.FC<{w: number; h: number; v: number; d: number; holes: Hole[]; cut: number; color?: string}> = ({
  w,
  h,
  v,
  d,
  holes,
  cut,
  color = TEAK,
}) => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    // the bottom edge, left to right, with a scallop cut up into it for every valance slot already sawn
    const done = new Set(holes.slice(0, cut).filter((hl) => hl.kind === 3).map((hl) => hl.x));
    const slots = holes.filter((hl) => hl.kind === 3).sort((a, b) => a.x - b.x);
    s.moveTo(-w / 2, 0);
    for (const sl of slots) {
      if (!done.has(sl.x)) continue;
      s.lineTo(sl.x - sl.r, 0);
      s.absarc(sl.x, 0, sl.r, Math.PI, 0, true);
    }
    s.lineTo(w / 2, 0);
    s.lineTo(w / 2, v);
    s.lineTo(0, v + h);
    s.lineTo(-w / 2, v);
    s.lineTo(-w / 2, 0);
    holes.slice(0, cut).filter((hl) => hl.kind !== 3).forEach((hl) => s.holes.push(holePath(hl, v)));
    return new THREE.ExtrudeGeometry(s, {depth: d, bevelEnabled: false, curveSegments: 10});
  }, [w, h, v, d, holes, cut]);
  return (
    <mesh geometry={geo} position={[0, 0, -d / 2]} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
};

const roofShape = (w: number, h: number) => {
  const sh = new THREE.Shape();
  sh.moveTo(-w / 2, 0);
  sh.lineTo(w / 2, 0);
  sh.lineTo(0, h);
  sh.lineTo(-w / 2, 0);
  return sh;
};

export const CUT_END = 2.1;
/** hole k (of n) is cut at this time; the left half are cut before frame 0 */
export const holeAt = (k: number, n: number) => (k < n / 2 ? -1 : ((k - n / 2 + 1) / (n / 2)) * CUT_END);

/** the hero: the gable on its trestles, sawn into lace, then lifted onto a teak house that grows under it */
export const Gingerbread: React.FC<{t: number; S: number; lift?: [number, number]; debris?: boolean; saw?: boolean}> = ({
  t,
  S,
  lift = [2.2, 3.2],
  debris = true,
  saw = true,
}) => {
  const w = S;
  const h = S * 0.36;
  const v = S * 0.1;
  const d = S * 0.022;
  const holes = useMemo(() => gableHoles(w, h, v), [w, h, v]);
  const n = holes.length;
  const cut = holes.reduce((a, _, k) => a + (t >= holeAt(k, n) ? 1 : 0), 0);
  const cur = holes[Math.min(n - 1, cut)];
  const lastAt = holeAt(Math.max(0, cut - 1), n);
  const fall = cut > n / 2 ? clamp01((t - lastAt) / 0.45) : 1;
  const last = holes[Math.max(0, cut - 1)];
  const lastY = last && (last.kind === 2 ? v + Math.sin(((last.a0 ?? 0) + (last.a1 ?? 0)) / 2) * ((last.r + (last.r1 ?? last.r)) / 2) : last.kind === 3 ? v * 0.1 : last.y);
  const sawing = saw && cut < n;
  const stroke = Math.sin(t * 30) * S * 0.04;
  // the board stands on trestles; after the cut it rises onto the house
  const up = smooth(clamp01((t - lift[0]) / (lift[1] - lift[0])));
  const houseH = S * 0.34 * up;
  const y0 = S * 0.07 + houseH;
  // pencil marks on the uncut holes (the pattern drawn on, so the plank is never blank)
  return (
    <group>
      {/* trestles (fold away as the house rises) */}
      {up < 0.98 &&
        [-0.36, 0.36].map((sx) => (
          <group key={sx} position={[sx * w, 0, 0]} scale={[1, 1 - up, 1]}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[0, S * 0.035, s * S * 0.03]} rotation-x={s * 0.4} castShadow>
                <boxGeometry args={[S * 0.02, S * 0.08, S * 0.014]} />
                <meshStandardMaterial color={TEAK_DARK} roughness={0.8} />
              </mesh>
            ))}
          </group>
        ))}
      {/* the house that grows under the lifted gable: pink-washed teak, two storeys, the gable its front */}
      {up > 0.02 && (
        <group>
          <mesh position={[0, houseH * 0.5, -S * 0.2]} castShadow receiveShadow>
            <boxGeometry args={[w * 0.86, houseH, S * 0.4]} />
            <meshStandardMaterial color="#e3ad9f" roughness={0.8} />
          </mesh>
          {/* the floor line and the windows */}
          <mesh position={[0, houseH * 0.5, 0.004 * S]}>
            <boxGeometry args={[w * 0.87, S * 0.012, S * 0.01]} />
            <meshStandardMaterial color={TEAK_DARK} />
          </mesh>
          {[-3, -1, 1, 3].map((i) =>
            [0.25, 0.75].map((fy) => (
              <mesh key={`${i}${fy}`} position={[i * w * 0.1, houseH * fy, 0.006 * S]}>
                <boxGeometry args={[w * 0.06, houseH * 0.26, S * 0.01]} />
                <meshStandardMaterial color="#4e2d17" />
              </mesh>
            )),
          )}
          {/* the roof behind the gable: a prism of the gable's triangle running back over the house */}
          <mesh position={[0, houseH + v, -S * 0.42]} castShadow>
            <extrudeGeometry args={[roofShape(w * 1.02, h * 1.02), {depth: S * 0.42, bevelEnabled: false}]} />
            <meshStandardMaterial color="#8a3b22" roughness={0.85} />
          </mesh>
        </group>
      )}
      <group position={[0, y0, 0]}>
        <GableBoard w={w} h={h} v={v} d={d} holes={holes} cut={cut} />
        {/* the bargeboards: two thick teak planks along the slopes, with a finial at the apex */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[(s * w) / 4, v + h / 2, d * 0.6]} rotation-z={-s * Math.atan2(h, w / 2)} castShadow>
            <boxGeometry args={[Math.hypot(w / 2, h) * 1.04, S * 0.03, d * 1.4]} />
            <meshStandardMaterial color={TEAK_DARK} roughness={0.75} />
          </mesh>
        ))}
        <mesh position={[0, v + h + S * 0.04, d * 0.6]} castShadow>
          <coneGeometry args={[S * 0.02, S * 0.09, 6]} />
          <meshStandardMaterial color={TEAK_DARK} />
        </mesh>
        {/* pencil marks on the holes still to cut */}
        {holes.slice(cut).map((hl, i) => (
          <mesh key={i} position={[hl.kind === 2 ? 0 : hl.x, hl.kind === 2 ? v : hl.kind === 1 ? v : hl.y, d / 2 + 0.02]}>
            {hl.kind === 2 ? (
              <ringGeometry args={[hl.r, hl.r1 ?? hl.r, 2, 1, hl.a0, (hl.a1 ?? 0) - (hl.a0 ?? 0)]} />
            ) : hl.kind === 3 ? (
              <ringGeometry args={[hl.r * 0.88, hl.r, 16, 1, 0, Math.PI]} />
            ) : hl.kind === 1 ? (
              <ringGeometry args={[hl.r * 0.9, hl.r, 16, 1, 0, Math.PI]} />
            ) : (
              <ringGeometry args={[hl.r * 0.8, hl.r, 16]} />
            )}
            <meshBasicMaterial color="#3b2412" transparent opacity={hl.kind === 2 ? 0.28 : 0.55} />
          </mesh>
        ))}
        {/* the bow saw: its blade through the board at the hole being cut, the frame stroking up and down */}
        {sawing && (
          <group position={[cur.kind === 2 ? Math.cos(cur.a0 ?? 0) * (cur.r1 ?? cur.r) : cur.x + cur.r * 0.8, (cur.kind === 2 ? v + Math.sin(cur.a0 ?? 0) * (cur.r1 ?? cur.r) : cur.kind === 3 ? cur.r : cur.y) + stroke, 0]}>
            {/* the blade through the board */}
            <mesh>
              <boxGeometry args={[S * 0.006, S * 0.2, S * 0.006]} />
              <meshStandardMaterial color="#dfe3e6" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* the bow: a steel C in front of the board, open toward the blade */}
            {[1, -1].map((sy) => (
              <mesh key={sy} position={[S * 0.07, sy * S * 0.1, S * 0.04]}>
                <boxGeometry args={[S * 0.14, S * 0.016, S * 0.016]} />
                <meshStandardMaterial color="#26282c" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
            <mesh position={[S * 0.14, 0, S * 0.04]}>
              <boxGeometry args={[S * 0.016, S * 0.216, S * 0.016]} />
              <meshStandardMaterial color="#26282c" metalness={0.6} roughness={0.4} />
            </mesh>
            {[1, -1].map((sy) => (
              <mesh key={`c${sy}`} position={[0, sy * S * 0.1, S * 0.02]}>
                <boxGeometry args={[S * 0.012, S * 0.012, S * 0.05]} />
                <meshStandardMaterial color="#26282c" metalness={0.6} roughness={0.4} />
              </mesh>
            ))}
            {/* the handle under the bow */}
            <mesh position={[0, -S * 0.15, S * 0.02]}>
              <cylinderGeometry args={[S * 0.016, S * 0.013, S * 0.08, 10]} />
              <meshStandardMaterial color="#9a2b1a" roughness={0.55} />
            </mesh>
            <group position={[0, -S * 0.03, d]}>
              <Puff u={(t * 4) % 1} seed={Math.floor(t * 4)} S={S * 0.14} color="#f2c98a" n={8} />
            </group>
          </group>
        )}
      </group>
      {/* the piece just cut drops out and tumbles to the ground */}
      {debris && fall < 1 && last && (
        <mesh
          position={[last.x, y0 + lastY - (y0 + lastY) * fall * fall, S * 0.02 + fall * S * 0.05]}
          rotation-x={fall * 4}
          rotation-z={fall * 2.5}
          castShadow
        >
          <boxGeometry args={[last.kind === 2 ? (last.r1 ?? last.r) - last.r : last.r * 1.6, S * 0.022, last.kind === 2 ? S * 0.025 : last.r * 1.6]} />
          <meshStandardMaterial color="#c88a44" roughness={0.7} />
        </mesh>
      )}
      {/* cut-outs already on the ground under the board, a little heap of sawdust */}
      {debris && Array.from({length: Math.min(24, Math.floor(cut / 3))}, (_, i) => (
        <mesh key={i} position={[(hash(i) - 0.5) * w * 0.8, S * 0.005, S * 0.05 + hash(i + 9) * S * 0.12]} rotation-x={-Math.PI / 2}
          rotation-z={hash(i + 3) * 6}>
          <cylinderGeometry args={[S * 0.022, S * 0.022, S * 0.008, 8]} />
          <meshStandardMaterial color="#c88a44" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- A2: an elephant drags a teak log that is squared as it goes ----------

const LogHaul: React.FC<{t: number; S: number}> = ({t, S}) => {
  const L = S * 0.75;
  const R = S * 0.09;
  // the elephant walks along +x; the log follows on its chain
  const x = S * 0.12 + t * S * 0.05;
  // the squared part grows from the front: half at frame 0, all by 2.4 s
  const sq = 0.5 + 0.5 * smooth(clamp01(t / 2.4));
  const adzeX = x - S * 0.25 - L * sq;
  const chop = Math.max(0, Math.sin(t * 16));
  return (
    <group>
      <group position={[x, 0, 0]} rotation-y={Math.PI / 2} scale={S * 0.17}>
        <SurinElephant walk={t * 0.9} t={t} tusks trunk={0.1} />
      </group>
      {/* the chain from the harness to the log's nose */}
      <mesh position={[x - S * 0.17, S * 0.12, 0]} rotation-z={0.35}>
        <boxGeometry args={[S * 0.16, S * 0.008, S * 0.008]} />
        <meshStandardMaterial color="#2a2c30" metalness={0.6} />
      </mesh>
      <group position={[x - S * 0.25, R, 0]}>
        {/* the squared, golden part (front) */}
        <mesh position={[-(L * sq) / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[L * sq, R * 1.6, R * 1.6]} />
          <meshStandardMaterial color="#c98a3e" roughness={0.6} />
        </mesh>
        {/* grain lines on the squared face */}
        {[-0.5, 0, 0.5].map((g) => (
          <mesh key={g} position={[-(L * sq) / 2, g * R * 0.6, R * 0.81]}>
            <boxGeometry args={[L * sq * 0.98, R * 0.04, R * 0.02]} />
            <meshStandardMaterial color="#8a5326" />
          </mesh>
        ))}
        {/* the round part still in its bark (back) */}
        {sq < 0.999 && (
          <mesh position={[-L * sq - (L * (1 - sq)) / 2, 0, 0]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[R * 1.15, R * 1.2, L * (1 - sq), 14]} />
            <meshStandardMaterial color="#5a4030" roughness={1} flatShading />
          </mesh>
        )}
      </group>
      {/* the adze at the bark line, chopping, chips flying */}
      {sq < 0.999 && (
        <group position={[adzeX, R * 2.2 + chop * S * 0.04, R * 0.4]}>
          <mesh rotation-z={-0.5 - chop * 0.6}>
            <boxGeometry args={[S * 0.012, S * 0.12, S * 0.012]} />
            <meshStandardMaterial color="#8a5a32" />
          </mesh>
          <mesh position={[S * 0.03, -S * 0.05, 0]}>
            <boxGeometry args={[S * 0.05, S * 0.012, S * 0.03]} />
            <meshStandardMaterial color="#cfd3d6" metalness={0.8} roughness={0.3} />
          </mesh>
          <Puff u={(t * 3) % 1} seed={Math.floor(t * 3)} S={S * 0.1} color="#e9b46a" n={8} />
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
        year: [1880, 1880.4],
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
    <group position={[FIELD[0], 0, FIELD[1]]} rotation-y={(AZ * Math.PI) / 180}>
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'แพร่', sub: 'เมืองไม้สัก ริมแม่น้ำยม'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      tile: {x0: -36, x1: 46, z0: -44, z1: 38},
      peaks: [[40, 32, 5, 5]],
      villages: {centers: [], built: [1700, 60]},
      houses: {...KORAT.layout.houses, built: [3000, 1]},
      life: {},
      rivers: [{path: YOM, width: 1.6}],
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

// legend scale: the gable ~52 units across
export const PHRAE_A1 = base('phrae-a1', ({t}) => <Gingerbread t={t} S={52} />, 8, [270, 285, 320], 30, 34);
// A2: the elephant ~20 units high, the log ~60 long
export const PHRAE_A2 = base('phrae-a2', ({t}) => <LogHaul t={t} S={50} />, 5, [270, 285, 320], 34, 34);
