// The dragon relief on Ratchaburi's jars, drawn the way a potter lays it on: as a flat design first,
// then wrapped round the jar's skin and raised as a relief. Design space: x runs round the jar
// (arc length at the belly, jar height = 1), y up the jar, z out of the skin.
//
// The design follows the loong's "nine resemblances" (Sixthtone, "How to draw a dragon"): the head
// of a horse (a long muzzle, a bulbous upturned nose), the antlers of a deer, big round eyes under a
// heavy brow, the ears of a cow, the neck of a snake, a clam's belly (pale plates on the underside),
// a carp's scales on the back, eagle's talons; the body bends three times (head, waist, tail), with a
// crest of spines, flame tufts at the elbows and the tail, a flame mane, long whiskers and a beard.
// Laid out after the owner's photo of the dragon-jar monument: the head in profile in front, the
// body S-ing back and down round the belly, the tail going round the back.
import React, {useMemo} from 'react';
import * as THREE from 'three';

type V2 = [number, number];

const GOLD = new THREE.Color('#e2a63a');
const GOLD_D = new THREE.Color('#a8701c');
const GOLD_L = new THREE.Color('#f3d986');
const FLAME = new THREE.Color('#d8661f');

// ------------------------------------------------------------------ design primitives
const spline = (pts: V2[], n: number): V2[] => {
  const c = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal');
  return c.getSpacedPoints(n).map((p) => [p.x, p.y] as V2);
};

/** a raised band along a spine: width w(s), relief height h(s); colour per (s, t across, length) */
const ribbon = (
  spine: V2[],
  w: (s: number) => number,
  h: (s: number) => number,
  color: (s: number, t: number, len: number) => THREE.Color,
  n = 120,
  across = 9,
  side = 1,
) => {
  const pts = spline(spine, n);
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  let len = 0;
  for (let i = 0; i <= n; i++) {
    const [x, y] = pts[i];
    const [ax, ay] = pts[Math.max(0, i - 1)];
    const [bx, by] = pts[Math.min(n, i + 1)];
    if (i > 0) len += Math.hypot(x - ax, y - ay);
    const tx = bx - ax;
    const ty = by - ay;
    const tl = Math.hypot(tx, ty) || 1;
    // the left normal: the back when the spine runs left to right
    const nx = (-ty / tl) * side;
    const ny = (tx / tl) * side;
    const s = i / n;
    const W = w(s);
    const H = h(s);
    for (let j = 0; j <= across; j++) {
      const t = (j / across) * 2 - 1;
      pos.push(x + nx * t * W * 0.5, y + ny * t * W * 0.5, 0.002 + H * Math.sqrt(Math.max(0, 1 - t * t)));
      const c = color(s, t, len);
      col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < n; i++)
    for (let j = 0; j < across; j++) {
      const a = i * (across + 1) + j;
      const b = a + across + 1;
      // wound so the faces look out of the skin whichever side the back is on
      if (side > 0) idx.push(a, b, a + 1, a + 1, b, b + 1);
      else idx.push(a, a + 1, b, a + 1, b + 1, b);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  return {g, pts, perSeg: across * 6};
};

/** a flat shape raised as a relief with a rounded edge */
const plate = (shape: V2[], depth: number, color: THREE.Color, z0 = 0) => {
  const sh = new THREE.Shape(shape.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.ExtrudeGeometry(sh, {depth, bevelEnabled: true, bevelThickness: depth * 0.6, bevelSize: Math.min(0.006, depth), bevelSegments: 2, curveSegments: 6});
  g.translate(0, 0, z0);
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) col.set([color.r, color.g, color.b], i * 3);
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
};

/** a flame tuft: a curling tongue pointing along `dir` (radians), `L` long */
const flame = (at: V2, dir: number, L: number): V2[] => {
  const base: V2[] = [
    [0, -0.18], [0.35, -0.16], [0.62, -0.05], [0.85, 0.05], [1, 0.22], [0.8, 0.14], [0.55, 0.12], [0.62, 0.28],
    [0.38, 0.14], [0.3, 0.26], [0.12, 0.12], [0, 0.18],
  ];
  const c = Math.cos(dir);
  const s = Math.sin(dir);
  return base.map(([x, y]) => [at[0] + (x * c - y * s) * L, at[1] + (x * s + y * c) * L] as V2);
};

const place = (pts: V2[], o: V2, k = 1): V2[] => pts.map(([x, y]) => [o[0] + x * k, o[1] + y * k] as V2);
const circle = (c: V2, r: number, n = 14, sy = 1): V2[] =>
  Array.from({length: n}, (_, i) => [c[0] + Math.cos((i / n) * Math.PI * 2) * r, c[1] + Math.sin((i / n) * Math.PI * 2) * r * sy] as V2);

// ------------------------------------------------------------------ the design
// the body, tail (s = 0) to the neck (s = 1): from the tail round the back (x 2.2 is ~315 deg round,
// so the tail tip shows behind the head), over the right side, an S across the front of the belly
// under the head, and up into the neck; three bends, the waist low
const BODY: V2[] = [
  [2.15, 0.6], [1.95, 0.66], [1.7, 0.6], [1.4, 0.45], [1.1, 0.38], [0.8, 0.5], [0.55, 0.56], [0.38, 0.46],
  [0.22, 0.33], [0.0, 0.28], [-0.2, 0.32], [-0.31, 0.41], [-0.25, 0.49],
];
// the spine runs right to left across the front, so the back is on its right-hand side
const SIDE = -1;
const bodyW = (s: number) => {
  const swell = Math.sin(Math.PI * Math.min(1, s * 1.12)) ** 0.55;
  const neck = 1 - 0.25 * THREE.MathUtils.smoothstep(s, 0.9, 1);
  return 0.022 + 0.12 * swell * neck;
};
const bodyH = (s: number) => 0.4 * bodyW(s);

/** carp scales on the back (staggered dark crescents), clam plates on the belly */
const bodyColor = (s: number, t: number, len: number) => {
  if (t < -0.25) return (len + 0.004) % 0.028 < 0.007 ? GOLD_D : GOLD_L;
  const k = (len + Math.abs(t) * 0.02) % 0.032;
  return k < 0.009 ? GOLD_D : GOLD;
};

// the head, in its own frame: origin at the back of the skull, facing +x, then placed at the neck
const HEAD_AT: V2 = [-0.3, 0.475];
const HEAD_K = 1.2;
const SKULL: V2[] = [
  [0, 0.0], [0.02, 0.05], [0.06, 0.075], [0.11, 0.085], [0.15, 0.072], [0.19, 0.06], [0.24, 0.062], [0.27, 0.075],
  [0.3, 0.068], [0.31, 0.045], [0.29, 0.025], [0.23, 0.015], [0.16, 0.008], [0.09, -0.01], [0.03, -0.025],
];
const JAW: V2[] = [[0.05, -0.03], [0.12, -0.035], [0.2, -0.055], [0.26, -0.075], [0.27, -0.09], [0.2, -0.085], [0.11, -0.07], [0.04, -0.055]];
const MOUTH: V2[] = [[0.08, -0.012], [0.24, 0.012], [0.26, -0.07], [0.12, -0.05]];
const BROW: V2[] = [[0.09, 0.07], [0.12, 0.1], [0.17, 0.095], [0.19, 0.075], [0.15, 0.08], [0.12, 0.078]];
const EAR: V2[] = [[0.04, 0.06], [-0.02, 0.12], [-0.05, 0.13], [-0.01, 0.09], [0.02, 0.055]];

const FRONT_LEG = {s: 0.86, pts: [[0, 0], [0.05, -0.08], [0.12, -0.1], [0.17, -0.13]] as V2[]};
const REAR_LEGS = [
  {s: 0.78, pts: [[0, 0], [-0.04, -0.07], [0.0, -0.12], [0.04, -0.14]] as V2[]},
  {s: 0.6, pts: [[0, 0], [0.05, 0.08], [0.11, 0.1], [0.15, 0.14]] as V2[]},
  {s: 0.45, pts: [[0, 0], [0.05, -0.09], [0.1, -0.13], [0.13, -0.16]] as V2[]},
];

type Part = {g: THREE.BufferGeometry; s: number};

const buildDragon = () => {
  const body = ribbon(BODY, bodyW, bodyH, bodyColor, 220, 10, SIDE);
  const at = (s: number): V2 => body.pts[Math.round(s * (body.pts.length - 1))];
  const parts: Part[] = [];

  // the crest: spines along the back, leaning toward the tail
  for (let i = 4; i < body.pts.length - 8; i += 6) {
    const s = i / (body.pts.length - 1);
    const [x, y] = body.pts[i];
    const [px, py] = body.pts[i - 1];
    const dx = x - px;
    const dy = y - py;
    const d = Math.hypot(dx, dy) || 1;
    const nx = (-dy / d) * SIDE;
    const ny = (dx / d) * SIDE;
    const W = bodyW(s);
    const L = 0.012 + W * 0.3;
    const b: V2 = [x + nx * W * 0.42, y + ny * W * 0.42];
    const tip: V2 = [b[0] + nx * L - (dx / d) * L * 0.5, b[1] + ny * L - (dy / d) * L * 0.5];
    const back: V2 = [b[0] - (dx / d) * L * 0.55, b[1] - (dy / d) * L * 0.55];
    parts.push({g: plate([b, tip, back], 0.006, GOLD_D, bodyH(s) * 0.3), s});
  }

  // legs: a thick forearm and a thinner lower leg, an elbow flame, four eagle's talons
  for (const leg of [FRONT_LEG, ...REAR_LEGS]) {
    const o = at(leg.s);
    const pts = place(leg.pts, o);
    const lg = ribbon(pts, (s) => 0.045 * (1 - 0.45 * s), (s) => 0.022 * (1 - 0.4 * s), (_s, t) => (t < -0.3 ? GOLD_L : GOLD), 24, 6);
    parts.push({g: lg.g, s: leg.s});
    const elbow = pts[1];
    parts.push({g: plate(flame([elbow[0] - 0.005, elbow[1] + 0.005], Math.PI * 0.85, 0.08), 0.006, FLAME, 0.004), s: leg.s});
    const foot = pts[pts.length - 1];
    for (let c = 0; c < 4; c++) {
      const a = -Math.PI * 0.15 - c * 0.42;
      const cl = 0.05;
      const tl = ribbon(
        [foot, [foot[0] + Math.cos(a) * cl * 0.6, foot[1] + Math.sin(a) * cl * 0.6], [foot[0] + Math.cos(a - 0.5) * cl, foot[1] + Math.sin(a - 0.5) * cl]],
        (s) => 0.014 * (1 - s),
        (s) => 0.01 * (1 - s),
        () => GOLD_L,
        10,
        4,
      );
      parts.push({g: tl.g, s: leg.s});
    }
  }

  // the tail's flame tuft
  parts.push({g: plate(flame(BODY[0], Math.PI * 0.95, 0.16), 0.008, FLAME, 0.003), s: 0.02});
  parts.push({g: plate(flame([BODY[0][0] + 0.02, BODY[0][1] - 0.02], -Math.PI * 0.85, 0.12), 0.008, GOLD, 0.003), s: 0.02});

  // ---- the head
  const H = (pts: V2[]) => place(pts, HEAD_AT, HEAD_K);
  const head: THREE.BufferGeometry[] = [];
  // the flame mane streaming back from the head along the neck
  for (let m = 0; m < 6; m++) {
    const o: V2 = [0.01 - m * 0.035, 0.05 - m * 0.012];
    head.push(plate(H(flame(o, Math.PI * (0.92 - m * 0.03), 0.11 - m * 0.006)), 0.01, m % 2 ? FLAME : GOLD_D, 0.01));
  }
  // antlers: a long beam swept back with tines, two of them, the far one lower
  for (const [dz, k, dy] of [[0.006, 0.85, -0.012], [0.02, 1, 0]] as [number, number, number][]) {
    const beam = H([[0.07, 0.08 + dy], [0.03, 0.14 + dy], [-0.04, 0.19 + dy], [-0.12, 0.22 + dy]].map(([x, y]) => [x * k + 0.07 * (1 - k), y] as V2));
    head.push(ribbon(beam, (s) => 0.022 * (1 - 0.6 * s), () => 0.012, () => GOLD_L, 24, 5).g.translate(0, 0, dz));
    const fork = (from: number, to: V2) => {
      const b = beam[Math.round(from * (beam.length - 1))];
      return ribbon([b, [b[0] + to[0] * 0.5, b[1] + to[1] * 0.6], [b[0] + to[0], b[1] + to[1]]], (s) => 0.014 * (1 - 0.7 * s), () => 0.01, () => GOLD_L, 10, 4).g.translate(0, 0, dz);
    };
    head.push(fork(0.35, [0.02, 0.07]));
    head.push(fork(0.7, [0.0, 0.06]));
  }
  head.push(plate(H(EAR), 0.012, GOLD_D, 0.018));
  // skull and muzzle, raised highest; the jaw below; the red mouth sunk between them
  head.push(plate(H(MOUTH), 0.006, new THREE.Color('#9c1f17'), 0.0));
  head.push(plate(H(SKULL), 0.028, GOLD, 0.006));
  head.push(plate(H(JAW), 0.022, GOLD, 0.004));
  // the upturned nose and its nostril
  head.push(plate(circle(H([[0.29, 0.06]])[0], 0.026 * HEAD_K, 14, 0.85), 0.03, GOLD, 0.018));
  head.push(plate(circle(H([[0.3, 0.055]])[0], 0.009 * HEAD_K, 10), 0.006, GOLD_D, 0.052));
  // the brow, the big eye and its pupil
  head.push(plate(H(BROW), 0.02, GOLD_D, 0.028));
  head.push(plate(circle(H([[0.145, 0.055]])[0], 0.02 * HEAD_K, 16, 0.85), 0.012, new THREE.Color('#fbf3dc'), 0.03));
  head.push(plate(circle(H([[0.152, 0.054]])[0], 0.009 * HEAD_K, 12), 0.008, new THREE.Color('#2a120a'), 0.046));
  // fangs, upper and lower
  head.push(plate(H([[0.215, 0.016], [0.232, 0.014], [0.222, -0.022]]), 0.01, new THREE.Color('#fbf3dc'), 0.012));
  head.push(plate(H([[0.235, -0.06], [0.25, -0.064], [0.24, -0.028]]), 0.01, new THREE.Color('#fbf3dc'), 0.012));
  // the tongue curling out
  head.push(ribbon(H([[0.2, -0.04], [0.29, -0.045], [0.34, -0.03], [0.36, 0.0]]), (s) => 0.022 * (1 - 0.5 * s), () => 0.01, () => new THREE.Color('#c0322a'), 20, 4).g.translate(0, 0, 0.012));
  // whiskers: two long tendrils from the nose, one curling up and back, one down and back
  head.push(ribbon(H([[0.29, 0.07], [0.34, 0.13], [0.31, 0.21], [0.22, 0.25], [0.15, 0.22]]), (s) => 0.014 * (1 - 0.7 * s), () => 0.008, () => GOLD, 40, 4).g.translate(0, 0, 0.03));
  head.push(ribbon(H([[0.27, 0.02], [0.35, -0.06], [0.33, -0.16], [0.25, -0.2], [0.2, -0.17]]), (s) => 0.014 * (1 - 0.7 * s), () => 0.008, () => GOLD, 40, 4).g.translate(0, 0, 0.03));
  // the beard: flame tufts under the jaw
  for (let b = 0; b < 3; b++) head.push(plate(H(flame([0.12 - b * 0.03, -0.07 + b * 0.005], -Math.PI * (0.6 + b * 0.08), 0.07)), 0.008, FLAME, 0.006));
  for (const g of head) parts.push({g, s: 0.97});

  return {body, parts};
};

// ------------------------------------------------------------------ wrapping it onto the jar
/** wrap a design-space geometry onto the jar: x -> angle round it (arc length at radius rRef),
 *  y -> height, z -> out from the skin of radius radiusAt(y) */
const wrap = (g: THREE.BufferGeometry, radiusAt: (y: number) => number, rRef: number, theta0: number) => {
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const a = theta0 + x / rRef;
    const r = radiusAt(y) + z;
    p.setXYZ(i, Math.sin(a) * r, y, Math.cos(a) * r);
  }
  p.needsUpdate = true;
  g.computeVertexNormals();
  return g;
};

/** the dragon relief, drawn in from the tail as u goes 0 -> 1; theta0 is the jar's front (the angle
 *  of the camera's azimuth), where the head sits */
export const DragonRelief: React.FC<{u: number; radiusAt: (y: number) => number; theta0: number}> = ({u, radiusAt, theta0}) => {
  const d = useMemo(() => {
    const {body, parts} = buildDragon();
    wrap(body.g, radiusAt, 0.4, theta0);
    for (const p of parts) wrap(p.g, radiusAt, 0.4, theta0);
    return {body, parts};
  }, [radiusAt, theta0]);
  if (u <= 0.02) return null;
  const segs = Math.max(1, Math.round((d.body.pts.length - 1) * Math.min(1, u / 0.95)));
  d.body.g.setDrawRange(0, segs * d.body.perSeg);
  return (
    <group>
      <mesh geometry={d.body.g} castShadow>
        <meshStandardMaterial vertexColors roughness={0.38} metalness={0.4} />
      </mesh>
      {d.parts.map((p, i) =>
        u >= p.s * 0.95 + 0.03 ? (
          <mesh key={i} geometry={p.g} castShadow>
            <meshStandardMaterial vertexColors roughness={0.38} metalness={0.4} />
          </mesh>
        ) : null,
      )}
    </group>
  );
};
