// The cover's hero (owner's pick A1, delegated: 15 Nov 2569) and the two waters, shared by the city and the style frames.
// อ้ายเท่ง: a giant cowhide shadow puppet on its rod in a banana trunk; at frame 0 his top half is cut and perforated, his
// legs still in the rough hide; a chisel and mallet cut him free by CUT_END, then he comes alive (the jointed arm swings
// up and points, the body sways on its rod). `liveFrom` lets the payoff bring him back already cut (the callback).
// นางเงือกทอง (style frame A2) is kept for the record.
import React from 'react';
import * as THREE from 'three';
import {GULF, KO_NU, LAKE} from './places';

type P2 = [number, number];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// ---------- the two waters, one flat shape each, cut at the tile's edges
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
const GULF_SHAPE = shapeOf(GULF, [KO_NU]);
const LAKE_SHAPE = shapeOf(LAKE);
const FlatWater: React.FC<{shape: THREE.Shape; color: string}> = ({shape, color}) => (
  <mesh position={[0, -1.3, 0]} rotation-x={-Math.PI / 2} receiveShadow>
    <extrudeGeometry args={[shape, {depth: 1.36, bevelEnabled: false}]} />
    <meshStandardMaterial color={color} roughness={0.12} metalness={0.25} />
  </mesh>
);
export const TwoWaters: React.FC = () => (
  <group>
    <FlatWater shape={GULF_SHAPE} color="#2f7fb8" />
    <FlatWater shape={LAKE_SHAPE} color="#4a9a9a" />
  </group>
);

/** a puff that bursts out and fades, self-lit (chips, clay) */
export const Puff: React.FC<{u: number; seed: number; S: number; color: string; n?: number}> = ({u, seed, S, color, n = 10}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.3 + hash(seed * 3 + i) * 0.5);
        return (
          <mesh key={i} position={[Math.cos(a) * sp * u, (0.2 + hash(seed * 7 + i) * 0.6) * sp * u - u * u * S * 0.3, Math.sin(a) * sp * u * 0.4 + S * 0.05]}
            scale={S * 0.06 * (1 - u) * (0.6 + hash(i + seed) * 0.6)}>
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1 - u} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- A1: อ้ายเท่ง cut from hide, then alive on his rod

export const CUT_END = 2.0;
export const ALIVE = 2.25;
/** the cut line falls from mid-body (frame 0) to below the feet */
const cutV = (t: number) => 0.5 - 0.56 * smooth(clamp01(t / CUT_END));
const SKIN = '#2b1c14';
const CLOTH = '#b3262a';
const HIDE = '#d6a560';
const LIGHT = '#ffd77a';
const ROD = '#c9a25a';

const poly = (pts: P2[]) => {
  const s = new THREE.Shape();
  pts.forEach(([u, v], i) => (i === 0 ? s.moveTo(u, v) : s.lineTo(u, v)));
  s.closePath();
  return s;
};
const ellipse = (cx: number, cy: number, rx: number, ry: number) => {
  const s = new THREE.Shape();
  s.absellipse(cx, cy, rx, ry, 0, Math.PI * 2, false, 0);
  return s;
};
/** a limb: a tapered strip from a to b */
const limb = (a: P2, b: P2, wa: number, wb: number) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy);
  const nx = -dy / l;
  const ny = dx / l;
  return poly([
    [a[0] + nx * wa, a[1] + ny * wa], [b[0] + nx * wb, b[1] + ny * wb], [b[0] - nx * wb, b[1] - ny * wb], [a[0] - nx * wa, a[1] - ny * wa],
  ]);
};

// Ai Teng in profile, facing right, in units of his height (feet at v = 0.04, the bald crown at v = 0.96)
const BODY: {s: THREE.Shape; c: string; lo: number}[] = [
  {s: ellipse(0.02, 0.885, 0.075, 0.07), c: SKIN, lo: 0.82}, // the bald head
  {s: poly([[0.07, 0.915], [0.2, 0.86], [0.17, 0.845], [0.07, 0.86]]), c: SKIN, lo: 0.84}, // the hornbill nose
  {s: poly([[0.06, 0.845], [0.16, 0.825], [0.06, 0.81]]), c: SKIN, lo: 0.8}, // the wide jaw
  {s: ellipse(-0.06, 0.9, 0.022, 0.02), c: SKIN, lo: 0.88}, // curls at the back of the head
  {s: ellipse(-0.065, 0.865, 0.02, 0.02), c: SKIN, lo: 0.84},
  {s: ellipse(-0.05, 0.935, 0.018, 0.018), c: SKIN, lo: 0.91},
  {s: poly([[-0.005, 0.83], [0.045, 0.83], [0.04, 0.77], [0.0, 0.77]]), c: SKIN, lo: 0.77}, // the neck
  {s: poly([[-0.055, 0.785], [0.075, 0.785], [0.065, 0.55], [-0.035, 0.5]]), c: SKIN, lo: 0.5}, // the long thin trunk
  {s: ellipse(0.06, 0.53, 0.085, 0.075), c: SKIN, lo: 0.45}, // the pot belly
  {s: poly([[-0.07, 0.48], [0.13, 0.47], [0.15, 0.35], [0.06, 0.29], [-0.065, 0.33]]), c: CLOTH, lo: 0.29}, // the loincloth
  {s: limb([-0.03, 0.36], [-0.07, 0.07], 0.024, 0.017), c: SKIN, lo: 0.06}, // back leg
  {s: limb([0.06, 0.36], [0.1, 0.07], 0.024, 0.017), c: SKIN, lo: 0.06}, // front leg
  {s: poly([[-0.085, 0.085], [-0.0, 0.07], [-0.0, 0.04], [-0.09, 0.05]]), c: SKIN, lo: 0.04}, // feet
  {s: poly([[0.085, 0.085], [0.17, 0.07], [0.17, 0.04], [0.08, 0.05]]), c: SKIN, lo: 0.04},
  {s: limb([-0.03, 0.765], [-0.12, 0.6], 0.022, 0.017), c: SKIN, lo: 0.6}, // the back arm, fixed
  {s: limb([-0.12, 0.6], [-0.09, 0.47], 0.017, 0.014), c: SKIN, lo: 0.47},
  {s: poly([[-0.1, 0.48], [-0.075, 0.48], [-0.07, 0.3], [-0.095, 0.27], [-0.11, 0.31]]), c: '#cfd6dc', lo: 0.27}, // the knife
];
// the front arm, jointed at the shoulder (pivot at the origin of its group)
const SHOULDER: P2 = [0.045, 0.765];
const ARM: THREE.Shape[] = [
  limb([0, 0], [0.1, -0.13], 0.022, 0.017),
  limb([0.1, -0.13], [0.19, -0.06], 0.017, 0.014),
  limb([0.19, -0.06], [0.29, -0.025], 0.011, 0.008), // the long index finger
];
// the light through the perforations: rows of holes along each part
const HOLES: {u: number; v: number; r: number; c: string}[] = (() => {
  const out: {u: number; v: number; r: number; c: string}[] = [];
  for (let k = 0; k < 9; k++) out.push({u: 0.01, v: 0.76 - k * 0.028, r: 0.007, c: LIGHT}); // down the trunk
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2;
    out.push({u: 0.06 + Math.cos(a) * 0.05, v: 0.53 + Math.sin(a) * 0.045, r: 0.006, c: LIGHT}); // a ring on the belly
  }
  for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) out.push({u: -0.045 + k * 0.034, v: 0.45 - r * 0.045, r: 0.008, c: '#f2c230'}); // the loincloth's flowers
  for (let k = 0; k < 8; k++) {
    out.push({u: -0.035 - k * 0.0045, v: 0.33 - k * 0.032, r: 0.005, c: LIGHT}); // down the legs
    out.push({u: 0.064 + k * 0.0045, v: 0.33 - k * 0.032, r: 0.005, c: LIGHT});
  }
  out.push({u: 0.03, v: 0.9, r: 0.012, c: '#f7f1de'}); // the eye
  for (let k = 0; k < 5; k++) out.push({u: -0.02 + k * 0.025, v: 0.865 + (k % 2) * 0.02, r: 0.005, c: LIGHT});
  return out;
})();

/** the hide still round the uncut part: a rounded slab h tall, wider than the figure, with ragged sides */
const hideShape = (h: number) => {
  const w = 0.23;
  const r = Math.min(0.05, h / 2);
  const sh = new THREE.Shape();
  sh.moveTo(-w + r, 0);
  sh.lineTo(w - r, 0);
  sh.quadraticCurveTo(w, 0, w, r);
  for (let k = 1; k <= 6; k++) sh.lineTo(w + (k % 2 ? 0.012 : -0.008), r + ((h - 2 * r) * k) / 6);
  sh.lineTo(-w, h);
  for (let k = 5; k >= 1; k--) sh.lineTo(-w + (k % 2 ? -0.01 : 0.009), r + ((h - 2 * r) * k) / 6);
  sh.lineTo(-w, r);
  sh.quadraticCurveTo(-w, 0, -w + r, 0);
  return sh;
};

const Part: React.FC<{s: THREE.Shape; c: string; H: number; d: number; glow?: number}> = ({s, c, H, d}) => (
  <mesh scale={[H, H, 1]} castShadow>
    <extrudeGeometry args={[s, {depth: d, bevelEnabled: false, curveSegments: 18}]} />
    <meshStandardMaterial color={c} roughness={0.7} />
  </mesh>
);

export const AiTeng: React.FC<{t: number; H: number; trunk?: boolean}> = ({t, H, trunk = true}) => {
  const cv = cutV(t);
  const d = H * 0.012;
  const live = smooth(clamp01((t - ALIVE) / 0.6));
  // after the cut the arm swings up and points, then wags; the whole body sways on its rod
  const armRot = live * (0.9 + 0.25 * Math.sin((t - ALIVE) * 6.0));
  const sway = live * 0.06 * Math.sin((t - ALIVE) * 3.1);
  const bob = live * H * 0.015 * Math.abs(Math.sin((t - ALIVE) * 3.1));
  // the mallet strikes every 0.14 s while cutting; the chisel walks along the cut line
  const cutting = t < CUT_END;
  const strike = cutting ? (t % 0.14) / 0.14 : 1;
  const chiselU = 0.22 * Math.sin(t * 2.4) - 0.02;
  // the scrap of hide falls away after the cut
  const fall = smooth(clamp01((t - CUT_END) / 0.6));
  const lift = H * 0.22; // the feet stand this far above the banana trunk
  return (
    <group>
      {/* the banana trunk the rod is stuck in, lying on the sand */}
      {trunk && <mesh position={[0, H * 0.035, 0]} rotation-z={Math.PI / 2} castShadow receiveShadow>
        <cylinderGeometry args={[H * 0.04, H * 0.045, H * 0.75, 16]} />
        <meshStandardMaterial color="#7da046" roughness={0.8} />
      </mesh>}
      <group position={[0, lift + bob, 0]} rotation-z={sway}>
        {/* the rod (ไม้ตับ): split bamboo from above the head down into the trunk */}
        <mesh position={[0.01 * H, (0.42 - 0.11) * H, -d * 0.6]} castShadow>
          <boxGeometry args={[H * 0.018, H * 1.24, d * 0.8]} />
          <meshStandardMaterial color={ROD} roughness={0.7} />
        </mesh>
        {/* the figure: parts above the cut are cut out; the rest still sits in the hide */}
        {BODY.map((b, i) => (
          <Part key={i} s={b.s} c={b.c} H={H} d={d} />
        ))}
        {/* the perforations, punched as the cut passes: light shows through them */}
        {HOLES.map((h, i) =>
          h.v > cv ? (
            <mesh key={i} position={[h.u * H, h.v * H, d + 0.02]}>
              <circleGeometry args={[h.r * H, 10]} />
              <meshBasicMaterial color={h.c} toneMapped={false} />
            </mesh>
          ) : null,
        )}
        {/* the jointed arm and its control rod */}
        {(cv < 0.62 || t >= CUT_END) && (
          <group position={[SHOULDER[0] * H, SHOULDER[1] * H, d * 0.5]} rotation-z={armRot}>
            {ARM.map((s, i) => (
              <Part key={i} s={s} c={SKIN} H={H} d={d} />
            ))}
          </group>
        )}
        {/* the arm's control rod, hanging from the hand down past the feet (the puppeteer's hand below) */}
        {(() => {
          const c = Math.cos(armRot);
          const sn = Math.sin(armRot);
          const hx = (SHOULDER[0] + 0.19 * c + 0.06 * sn) * H;
          const hy = (SHOULDER[1] + 0.19 * sn - 0.06 * c) * H;
          const len = hy + 0.1 * H;
          return (
            <mesh position={[hx, hy - len / 2, d * 1.5]} castShadow>
              <boxGeometry args={[H * 0.008, len, H * 0.008]} />
              <meshStandardMaterial color={ROD} roughness={0.7} />
            </mesh>
          );
        })()}
        {/* the uncut hide: a rough, translucent sheet from the cut line down past the feet, the figure inside it */}
        {fall < 0.999 && cv > -0.05 && (
          <group position={[0.02 * H, -fall * H * 0.3, d * 2.2 + fall * H * 0.2]} rotation-x={fall * 1.1}>
            <mesh position={[0, -0.03 * H, 0]} scale={[H, H, 1]} castShadow>
              <shapeGeometry args={[hideShape(Math.max(cv, 0) + 0.03), 6]} />
              <meshStandardMaterial color={HIDE} roughness={0.85} transparent opacity={0.74} side={THREE.DoubleSide} />
            </mesh>
            {/* the straight cut edge at the top of the sheet */}
            <mesh position={[0, (Math.max(cv, 0) + 0.004) * H, 0.02]}>
              <boxGeometry args={[H * 0.46, H * 0.008, 0.05]} />
              <meshBasicMaterial color="#8a5a2a" toneMapped={false} />
            </mesh>
          </group>
        )}
        {/* the scrap, after the cut: the frame of hide round the feet tumbling away */}
        {t >= CUT_END && fall < 0.999 && (
          <group position={[0.02 * H, H * 0.02 - fall * H * 0.25, d * 2 + fall * H * 0.15]} rotation-x={fall * 1.3}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * H * 0.19, H * 0.12, 0]}>
                <boxGeometry args={[H * 0.04, H * 0.24, d * 0.6]} />
                <meshStandardMaterial color={HIDE} roughness={0.85} transparent opacity={1 - fall} />
              </mesh>
            ))}
          </group>
        )}
        {/* the chisel and the mallet at the cut line */}
        {cutting && (
          <group position={[chiselU * H, Math.max(cv, 0.02) * H, d * 2]} scale={1.8}>
            <group position={[0, 0, H * 0.06]} rotation-x={-0.9}>
              <mesh position={[0, H * 0.05, 0]} castShadow>
                <cylinderGeometry args={[H * 0.006, H * 0.004, H * 0.11, 8]} />
                <meshStandardMaterial color="#c8ccd0" roughness={0.35} metalness={0.7} />
              </mesh>
              <mesh position={[0, H * 0.12, 0]} castShadow>
                <cylinderGeometry args={[H * 0.012, H * 0.012, H * 0.05, 10]} />
                <meshStandardMaterial color="#5a3a22" roughness={0.8} />
              </mesh>
              {/* the mallet swinging down onto the chisel's head */}
              <group position={[0, H * 0.15, 0]} rotation-z={0.9 * (1 - Math.pow(strike, 0.4))}>
                <mesh position={[H * 0.07, H * 0.03, 0]} rotation-z={Math.PI / 2} castShadow>
                  <cylinderGeometry args={[H * 0.025, H * 0.025, H * 0.06, 12]} />
                  <meshStandardMaterial color="#6b4325" roughness={0.8} />
                </mesh>
                <mesh position={[H * 0.13, H * 0.03, 0]} rotation-z={Math.PI / 2}>
                  <cylinderGeometry args={[H * 0.006, H * 0.006, H * 0.1, 6]} />
                  <meshStandardMaterial color="#3b2414" roughness={0.8} />
                </mesh>
              </group>
            </group>
            <Puff u={strike} seed={Math.floor(t / 0.14)} S={H * 0.12} color="#f0c27a" n={6} />
          </group>
        )}
      </group>
    </group>
  );
};

// ---------- A2: the golden mermaid modelled on the rocks at Samila

const SHAPE_END = 1.6;
const GOLD0 = 1.55;
const GOLD1 = 2.6;
const CLAY = '#a8774f';
const GOLD = '#e0ae38';

export const Mermaid: React.FC<{t: number; S: number}> = ({t, S}) => {
  const shaped = smooth(clamp01(t / SHAPE_END));
  const form = 0.4 + 0.6 * shaped; // the upper body is half out of the lump at frame 0
  const gold = (y: number) => smooth(clamp01(((t - GOLD0) / (GOLD1 - GOLD0)) * 1.3 - (y / S) * 0.9)); // from the rock up
  const mat = (y: number) => {
    const g = gold(y);
    const c = new THREE.Color(CLAY).lerp(new THREE.Color(GOLD), g);
    return <meshStandardMaterial color={c} roughness={0.75 - 0.5 * g} metalness={0.1 + 0.75 * g} emissive={new THREE.Color('#6a4a10')} emissiveIntensity={0.25 * g} />;
  };
  const comb = smooth(clamp01((t - GOLD1) / 0.4));
  const combRot = comb * 0.35 * Math.sin((t - GOLD1) * 4.2);
  // the tail: a chain of beads from the hip curling forward on the rock
  const tail = Array.from({length: 16}, (_, i) => {
    const u = i / 15;
    return {
      p: [-S * (0.04 + 0.26 * u), S * (0.3 - 0.2 * u + 0.05 * Math.sin(Math.PI * u)), S * (0.06 + 0.14 * Math.sin(Math.PI * u * 0.9))] as [number, number, number],
      r: S * 0.08 * (1 - 0.72 * u),
    };
  });
  const end = tail[tail.length - 1].p;
  const up = (k: number) => S * k;
  return (
    <group>
      {/* the rocks */}
      {[
        [0, 0.1, 0, 0.2], [-0.2, 0.06, 0.12, 0.15], [0.17, 0.05, 0.08, 0.13], [-0.05, 0.04, 0.22, 0.12], [0.08, 0.03, -0.16, 0.12],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[S * x, S * y, S * z]} scale={[1, 0.62, 1]} rotation={[hash(i) * 2, hash(i + 3) * 3, 0]} castShadow receiveShadow>
          <dodecahedronGeometry args={[S * r, 0]} />
          <meshStandardMaterial color="#8d8478" roughness={0.95} />
        </mesh>
      ))}
      {/* the tail and its fin, modelled at frame 0 */}
      {tail.map((b, i) => (
        <mesh key={i} position={b.p} castShadow>
          <sphereGeometry args={[b.r, 16, 12]} />
          {mat(b.p[1])}
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[end[0] - S * 0.04, end[1] + S * 0.02, end[2] + s * S * 0.04]} rotation={[s * 0.6, 0, 0.9]} scale={[1, 1, 0.3]} castShadow>
          <coneGeometry args={[S * 0.06, S * 0.13, 12]} />
          {mat(end[1])}
        </mesh>
      ))}
      {/* the hips */}
      <mesh position={[0, up(0.32), S * 0.03]} scale={[1, 0.85, 0.9]} castShadow>
        <sphereGeometry args={[S * 0.085, 18, 14]} />
        {mat(up(0.32))}
      </mesh>
      {/* the rough lump of clay the upper body is carved from: shrinks as the figure comes out of it */}
      {shaped < 0.999 && (
        <mesh position={[S * 0.01, up(0.6), S * 0.03]} rotation={[0.4, 0.7, 0.2]} scale={[(0.3 + 0.7 * (1 - shaped)) * 1.15, (0.25 + 0.75 * (1 - shaped)) * 0.8, (0.3 + 0.7 * (1 - shaped)) * 0.95]} castShadow>
          <icosahedronGeometry args={[S * 0.1, 1]} />
          <meshStandardMaterial color={CLAY} roughness={0.95} flatShading />
        </mesh>
      )}
      {/* the upper body coming out of the lump */}
      <group position={[0, up(0.36), S * 0.03]} scale={[0.4 + 0.6 * form, 0.4 + 0.6 * form, 0.4 + 0.6 * form]}>
        {/* the torso, leaning a little toward the sea */}
        <mesh position={[0, S * 0.11, 0]} rotation-x={-0.08} scale={[1, 1, 0.8]} castShadow>
          <capsuleGeometry args={[S * 0.05, S * 0.14, 8, 16]} />
          {mat(up(0.46))}
        </mesh>
        {/* the neck and the head, turned to look along the shore */}
        <mesh position={[0, S * 0.235, S * 0.005]} castShadow>
          <cylinderGeometry args={[S * 0.018, S * 0.022, S * 0.05, 10]} />
          {mat(up(0.6))}
        </mesh>
        <mesh position={[0, S * 0.29, S * 0.012]} scale={[0.9, 1.1, 1]} castShadow>
          <sphereGeometry args={[S * 0.048, 18, 14]} />
          {mat(up(0.66))}
        </mesh>
        {/* the hair: from the crown down the back to the waist */}
        <mesh position={[0, S * 0.2, -S * 0.04]} rotation-x={0.12} scale={[1.05, 1, 0.42]} castShadow>
          <capsuleGeometry args={[S * 0.052, S * 0.2, 8, 16]} />
          {mat(up(0.55))}
        </mesh>
        {/* two locks over the shoulders, down over the chest */}
        {[-1, 1].map((s2) => (
          <mesh key={s2} position={[s2 * S * 0.028, S * 0.12, S * 0.04]} rotation-z={s2 * 0.12} scale={[0.75, 1, 0.55]} castShadow>
            <capsuleGeometry args={[S * 0.024, S * 0.11, 6, 12]} />
            {mat(up(0.5))}
          </mesh>
        ))}
        {/* the left arm resting on the rock */}
        <mesh position={[-S * 0.07, S * 0.06, S * 0.02]} rotation-z={-0.3} castShadow>
          <capsuleGeometry args={[S * 0.016, S * 0.15, 6, 10]} />
          {mat(up(0.42))}
        </mesh>
        {/* the right arm raised to the hair with a comb */}
        <group position={[S * 0.05, S * 0.19, S * 0.005]} rotation-z={-0.9 + combRot}>
          <mesh position={[0, S * 0.06, 0]} castShadow>
            <capsuleGeometry args={[S * 0.016, S * 0.1, 6, 10]} />
            {mat(up(0.62))}
          </mesh>
          <group position={[0, S * 0.12, 0]} rotation-z={1.9}>
            <mesh position={[0, S * 0.05, 0]} castShadow>
              <capsuleGeometry args={[S * 0.014, S * 0.08, 6, 10]} />
              {mat(up(0.7))}
            </mesh>
            <mesh position={[0, S * 0.11, S * 0.01]} castShadow>
              <boxGeometry args={[S * 0.045, S * 0.018, S * 0.008]} />
              {mat(up(0.72))}
            </mesh>
          </group>
        </group>
      </group>
      {/* the spatula shaping the lump, and the clay it scrapes off */}
      {shaped < 0.999 && (
        <group position={[S * (0.12 * Math.cos(t * 5)), up(0.6 + 0.08 * Math.sin(t * 3.3)), S * (0.15 + 0.05 * Math.sin(t * 5))]} rotation={[0.6, 0, 0.5 * Math.sin(t * 5)]}>
          <mesh castShadow>
            <boxGeometry args={[S * 0.035, S * 0.006, S * 0.09]} />
            <meshStandardMaterial color="#c8ccd0" roughness={0.35} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, S * 0.08]}>
            <cylinderGeometry args={[S * 0.008, S * 0.008, S * 0.08, 8]} />
            <meshStandardMaterial color="#6b4325" roughness={0.8} />
          </mesh>
          <Puff u={(t * 4) % 1} seed={Math.floor(t * 4)} S={S * 0.12} color="#c99a6a" n={5} />
        </group>
      )}
      {/* the shine as the gold reaches the head */}
      {t > GOLD1 - 0.2 && t < GOLD1 + 0.8 && (
        <mesh position={[S * 0.05, up(0.7), S * 0.06]} rotation-z={t * 3} scale={[S * 0.012, S * 0.04, S * 0.012].map((v) => v * Math.sin(clamp01((t - GOLD1 + 0.2) / 1.0) * Math.PI)) as [number, number, number]}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#fff2b0" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

