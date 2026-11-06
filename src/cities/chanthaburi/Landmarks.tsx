import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Elephant, glowTexture, lathe, SmallChedi, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp} from '../../lib';
import {Walker} from '../nan/figures';
import {
  AZ, beatK, CARRIERS, carrierAt, churchCrossK, clamp01, CUT_END, doneK, elephantAt, FLEET, frenchAt, FRENCH, frenchFlag,
  frenchHouseK, gateFall, GEM_BACK, gemAt, gemBackK, hillGemK, JUNKS_AT_LANDING, junkAt, landingJunkAt, LAP_H, LAP_R, lapK,
  MARKET_ON, MARKET_PEOPLE, mouthFortK, naveK, nwFortK, orchardK, potBreak, POTS, potX, POT_Z, RETURNERS, returnerAt, ROW, rowK,
  rowSpots, shopperAt, siamFlag, smooth, soldierAt, SOLDIERS, spireK, steamerAt, tuekDaengK, wallK,
} from './actors';
import {
  CATHEDRAL, COAST, FRENCH_HOUSE, GATE, HERO_AT, HERO_S, KHAO_PLOI_WAEN, NOEN_WONG, NW_HALF, SI_CHAN, TILE, TOWER, TUEK_DAENG,
  WALL, WEST_FORT,
} from './places';

const WATER = '#3f8fc0';
const LATERITE = '#9b4f2e';
const LATERITE_DARK = '#7a3c22';
const YELLOW = '#e8a915';
const YELLOW_GLOW = '#7a4a00';
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; e?: string; ei?: number; r?: number}> = ({p, s, c, e, ei = 0.6, r = 0}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} emissive={e ?? '#000000'} emissiveIntensity={e ? ei : 0} />
  </mesh>
);

/** a pitched roof over a box: w across, l along z */
const Gable: React.FC<{w: number; l: number; h: number; y: number; c: string}> = ({w, l, h, y, c}) => (
  <mesh position={[0, y + h / 2, 0]} rotation-y={Math.PI / 4} scale={[w * 0.72, h, l * 0.72]} castShadow>
    <coneGeometry args={[1, 1, 4]} />
    <meshStandardMaterial color={c} flatShading roughness={0.8} />
  </mesh>
);

const Stick: React.FC<{a: [number, number, number]; b: [number, number, number]; r: number; c: string}> = ({a, b, r, c}) => {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  return (
    <mesh position={A.clone().add(B).multiplyScalar(0.5)} quaternion={q} castShadow>
      <cylinderGeometry args={[r, r, A.distanceTo(B), 8]} />
      <meshStandardMaterial color={c} roughness={0.75} />
    </mesh>
  );
};

// ------------------------------------------------------------------ the gem (cover A2, moved from the style frames)
// a round brilliant, culet at 0, girdle radius 1, table at 1.12 (the pavilion drawn deeper than a true brilliant's so
// its point reads at thumbnail size)
const GEM: [number, number][] = [[0, 0], [0.5, 0.42], [1, 0.84], [1, 0.9], [0.8, 1.02], [0.56, 1.12], [0, 1.12]];
const gemGeometry = (hex: string) => {
  const g = lathe(GEM, 8).toNonIndexed();
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  const base = new THREE.Color(hex);
  for (let f = 0; f < n / 3; f++) {
    const k = 0.55 + hash(f * 3.7) * 0.75;
    for (let v = 0; v < 3; v++) {
      col[(f * 3 + v) * 3] = Math.min(1, base.r * k);
      col[(f * 3 + v) * 3 + 1] = Math.min(1, base.g * k);
      col[(f * 3 + v) * 3 + 2] = Math.min(1, base.b * k);
    }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
};

// The crust (Gemini §2): a rounded, dull brown-black pebble with red laterite dirt in its cracks. Rounded lumps cover
// the whole stone, crown, girdle and pavilion, so the uncut part reads as a pebble; red dirt sits between them. At
// frame 0 about half is gone (the side facing the camera's left first); the rest falls by CUT_END.
const UP = new THREE.Vector3(0, 1, 0);
type Spot = {p: [number, number, number]; n: [number, number, number]; tf: number; r: number; red: boolean};
const CRUST: Spot[] = (() => {
  const out: Spot[] = [];
  let k = 0;
  const rings: [number, number, number, number][] = [
    // [radius, y, normal y, count]
    [0.0, 1.13, 1, 1], [0.38, 1.12, 0.95, 6], [0.7, 1.05, 0.7, 10], [0.98, 0.94, 0.25, 14], [0.98, 0.8, -0.2, 14],
    [0.74, 0.62, -0.6, 12], [0.45, 0.36, -0.75, 9], [0.18, 0.14, -0.85, 5],
  ];
  for (const [rr, y, ny, count] of rings) {
    for (let j = 0; j < count; j++) {
      const a = (j / count) * Math.PI * 2 + y * 2.3;
      const nr = Math.sqrt(Math.max(0, 1 - ny * ny));
      // falls earlier on one side (a < pi): the cut sweeps round the stone
      const side = 0.5 + 0.5 * Math.cos(a - 0.6);
      const tf = -2.6 + (0.35 * hash(k) + 0.65 * side) * (CUT_END + 2.6);
      const red = hash(k + 77) < 0.28;
      out.push({p: [Math.cos(a) * rr, y, Math.sin(a) * rr], n: [Math.cos(a) * nr, ny, Math.sin(a) * nr], tf, r: red ? 0.09 + hash(k + 50) * 0.05 : 0.17 + hash(k + 50) * 0.07, red});
      k++;
    }
  }
  return out;
})();

const lumpGeo = (i: number) => {
  const g = new THREE.IcosahedronGeometry(1, 1);
  const p = g.attributes.position;
  for (let v = 0; v < p.count; v++) {
    const f = 0.82 + hash(i * 31 + v) * 0.3;
    p.setXYZ(v, p.getX(v) * f, p.getY(v) * f * 0.42, p.getZ(v) * f);
  }
  g.computeVertexNormals();
  return g;
};

const Glint: React.FC<{p: [number, number, number]; s: number}> = ({p, s}) =>
  s <= 0.02 ? null : (
    <group position={p} scale={s}>
      {[0, Math.PI / 2].map((r) => (
        <mesh key={r} rotation-z={r}>
          <planeGeometry args={[0.08, 1]} />
          <meshBasicMaterial color="#fff6d8" toneMapped={false} transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );

/** the gem in its own frame (unit girdle radius, culet at the origin), with its crust falling */
const Gem: React.FC<{t: number; crust: boolean; spin: number; glow?: number}> = ({t, crust, spin, glow = 0}) => {
  const geo = useMemo(() => gemGeometry(YELLOW), []);
  const lumps = useMemo(() => CRUST.map((_, i) => lumpGeo(i)), []);
  const cut = clamp01((t + 2.6) / (CUT_END + 2.6));
  return (
    <group rotation-y={spin}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color="#ffffff" vertexColors emissive={YELLOW_GLOW} emissiveIntensity={0.18 + 0.32 * cut + glow} roughness={0.16} metalness={0.3} flatShading side={THREE.DoubleSide} />
      </mesh>
      {crust &&
        CRUST.map((c, i) => {
          const u = (t - c.tf) / 0.7;
          if (u >= 1) return null;
          const fly = Math.max(0, u);
          const g = fly * fly * 1.8;
          const s = c.r * (1 - smooth((u - 0.4) / 0.6));
          if (s < 0.02) return null;
          return (
            <mesh
              key={i}
              geometry={lumps[i]}
              position={[c.p[0] + c.n[0] * fly * 0.9, c.p[1] + c.n[1] * fly * 0.9 - g, c.p[2] + c.n[2] * fly * 0.9]}
              scale={s}
              quaternion={new THREE.Quaternion().setFromUnitVectors(UP, new THREE.Vector3(...c.n)).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(fly * 4, i * 0.7 + fly * 3, 0)))}
              castShadow
            >
              <meshStandardMaterial color={c.red ? '#8e3f22' : i % 3 ? '#3b3129' : '#4d4036'} roughness={1} flatShading />
            </mesh>
          );
        })}
      {crust &&
        CRUST.map((c, i) => {
          const u = (t - c.tf) / 0.55;
          if (u < 0 || u > 1 || c.red) return null;
          return <Glint key={`g${i}`} p={[c.p[0] * 1.03, c.p[1] + 0.03, c.p[2] * 1.03]} s={0.5 * Math.sin(u * Math.PI)} />;
        })}
    </group>
  );
};

/** the cutter's bench: the lap on its low stand, the jamb peg and the ไม้ทวน (dop stick) holding the stone */
const Lap: React.FC<{t: number; gemTop: number}> = ({t, gemTop}) => {
  const R = LAP_R;
  const H = LAP_H;
  const S = HERO_S;
  const turn = t * 7;
  const cutting = t < CUT_END + 0.2;
  const fwd = 0.2 * R;
  const done = doneK(t);
  // the peg stands at the bench's right; the stick runs from the shellac on the stone's table up to its notch
  const peg: [number, number, number] = [R * 0.98, gemTop - 0.5 * done * 0.3 * S + 0.52 * S, fwd - 0.08 * R];
  const free = smooth((t - CUT_END - 0.1) / 0.8);
  const tip: [number, number, number] = [lerp3(0, R * 0.55, free), gemTop + free * 0.25 * S, lerp3(fwd, fwd - 0.2 * R, free)];
  return (
    <group>
      <Box p={[0, H * 0.85, 0]} s={[R * 2.15, H * 0.3, R * 2.15]} c="#6e4b2e" />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], k) => (
        <Box key={k} p={[sx * R * 0.85, H * 0.35, sz * R * 0.85]} s={[R * 0.12, H * 0.7, R * 0.12]} c="#5a3b22" />
      ))}
      <group position={[0, H + R * 0.04, 0]} rotation-y={turn}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[R, R, R * 0.08, 48]} />
          <meshStandardMaterial color="#9aa0a8" roughness={0.35} metalness={0.6} />
        </mesh>
        {[0, 1, 2, 3].map((k) => (
          <mesh key={k} position={[0, R * 0.041, 0]} rotation-y={(k * Math.PI) / 4}>
            <boxGeometry args={[R * 1.96, R * 0.004, R * 0.03]} />
            <meshStandardMaterial color="#5c626b" roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, R * 0.05, 0]}>
          <cylinderGeometry args={[R * 0.08, R * 0.08, R * 0.04, 16]} />
          <meshStandardMaterial color="#3d4148" />
        </mesh>
      </group>
      {/* the jamb peg: a post with a notched wooden head (the stick's end rests in a notch) */}
      <Box p={[peg[0], (H + peg[1]) / 2, peg[2]]} s={[0.07 * S, peg[1] - H, 0.07 * S]} c="#5a3b22" />
      <mesh position={[peg[0], peg[1] + 0.02 * S, peg[2]]} castShadow>
        <cylinderGeometry args={[0.06 * S, 0.14 * S, 0.22 * S, 8]} />
        <meshStandardMaterial color="#7b5532" roughness={0.9} flatShading />
      </mesh>
      {/* the ไม้ทวน: brown wood, a lump of dark red-brown shellac (ครั่ง) holding the stone */}
      <Stick a={tip} b={peg} r={0.035 * S} c="#7a5130" />
      <mesh position={[tip[0], tip[1] + 0.02 * S, tip[2]]} scale={[0.13 * S, 0.08 * S, 0.13 * S]} castShadow>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#5e1f12" roughness={0.45} />
      </mesh>
      {cutting &&
        Array.from({length: 36}, (_, i) => {
          const ph = (t * 1.8 + hash(i)) % 1;
          const a = -0.6 + hash(i + 9) * 1.2;
          const sp = R * (0.5 + hash(i + 3) * 0.8);
          const x = Math.cos(a) * sp * ph;
          const z = fwd + R * 0.15 + Math.sin(a) * sp * ph * 0.4 + sp * ph * 0.5;
          const y = H + R * 0.1 + sp * ph * 0.5 - ph * ph * sp * 0.9;
          if (y < 0.05) return null;
          return (
            <mesh key={i} position={[x, y, z]} scale={R * 0.02 * (1 - ph)}>
              <octahedronGeometry args={[1, 0]} />
              <meshBasicMaterial color={i % 3 ? '#ffe7a3' : '#ffffff'} toneMapped={false} />
            </mesh>
          );
        })}
    </group>
  );
};
const lerp3 = (a: number, b: number, u: number) => a + (b - a) * u;

const Hero: React.FC<{t: number; terrainH: LandmarkProps['terrainH']}> = ({t, terrainH}) => {
  if (t > 8.4) return null;
  const k = lapK(t);
  const g = gemAt(t);
  const done = doneK(t);
  const spin = done * (t - CUT_END) * 0.8;
  const hk = t > 5.8 ? hillGemK(t) : 1;
  const onHill = smooth((t - 5.0) / 0.8);
  const y = g.y * (1 - onHill) + (terrainH(KHAO_PLOI_WAEN[0], KHAO_PLOI_WAEN[1]) + 0.2) * onHill;
  const gemTop = LAP_H + 0.08 * LAP_R + 1.12 * HERO_S;
  return (
    <>
      {k > 0.02 && (
        <group position={[HERO_AT[0], 0, HERO_AT[1]]} rotation-y={AZ} scale={[k, k, k]}>
          <Lap t={t} gemTop={gemTop} />
        </group>
      )}
      {g.s * hk > 0.05 && (
        <group position={[g.x, y, g.z]} rotation-y={AZ} scale={g.s * hk}>
          <group rotation-x={0.2 - 0.1 * done}>
            <Gem t={t} crust spin={spin} glow={0.25 * onHill} />
            {done > 0.02 && t < 4.6 && <Glint p={[0.3, 1.16, 0.25]} s={0.9 * Math.sin(clamp01((t - CUT_END - 0.4) / 0.9) * Math.PI)} />}
          </group>
        </group>
      )}
    </>
  );
};

// ------------------------------------------------------------------ the wall's moat and the south gate (2310)
const MOAT_W = 1.2;
const Moat: React.FC<{Y: number}> = ({Y}) => {
  const grow = ramp(Y, 1656.5, 1666);
  const fill = 1 - ramp(Y, 1834.12, 1834.4);
  if (grow < 0.02 || fill < 0.02) return null;
  const [[x0, z0], [x1], [, z1]] = [WALL[0], WALL[1], WALL[2]];
  const off = 0.7 + MOAT_W / 2;
  const sides: {c: [number, number]; len: number; rot: number}[] = [
    {c: [x0 - off, (z0 + z1) / 2], len: z1 - z0 + 2 * off, rot: 0},
    {c: [(x0 + x1) / 2 - off / 2, z0 - off], len: x1 - x0 + off, rot: Math.PI / 2},
    // south side, in two halves either side of the gate's causeway
    {c: [(x0 - off + GATE[0] - 0.7) / 2, z1 + off], len: GATE[0] - 0.7 - (x0 - off), rot: Math.PI / 2},
    {c: [(GATE[0] + 0.7 + x1) / 2, z1 + off], len: x1 - GATE[0] - 0.7, rot: Math.PI / 2},
  ];
  return (
    <>
      {sides.map((s, i) => (
        <mesh key={i} position={[s.c[0], 0.05, s.c[1]]} rotation-y={s.rot} scale={[1, 1, grow]} receiveShadow>
          <boxGeometry args={[MOAT_W * fill, 0.06, s.len]} />
          <meshStandardMaterial color={WATER} roughness={0.12} metalness={0.25} />
        </mesh>
      ))}
    </>
  );
};

const Gate: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const up = ramp(Y, 1660, 1668) * (1 - ramp(Y, 1834.06, 1834.3));
  if (up < 0.02) return null;
  const fall = Y > 1768 ? 1 : gateFall(t);
  return (
    <group position={[GATE[0], 0, GATE[1]]} scale={[1, up, 1]}>
      {[-1, 1].map((s) => (
        <Box key={s} p={[s * 0.75, 0.75, 0]} s={[0.5, 1.5, 0.8]} c={LATERITE_DARK} />
      ))}
      <Box p={[0, 1.42, 0]} s={[2.0, 0.22, 0.8]} c={LATERITE} />
      {Y < 1834 &&
        [-1, 1].map((s) => (
          <group key={s} position={[s * 0.5, 0, 0.3]} rotation-x={fall * 1.35} rotation-y={s * fall * 0.3}>
            <Box p={[-s * 0.25, 0.6, 0]} s={[0.5, 1.2, 0.08]} c="#5b3a20" />
          </group>
        ))}
    </group>
  );
};

// ------------------------------------------------------------------ 2310: pots, soldiers with torches, the elephant
const POT: [number, number][] = [[0, 0], [0.3, 0], [0.45, 0.12], [0.52, 0.35], [0.5, 0.58], [0.38, 0.74], [0.3, 0.8], [0.33, 0.86], [0.3, 0.88]];
const Smash: React.FC<{t: number; night: number}> = ({t, night}) => {
  const potGeo = useMemo(() => lathe(POT, 16), []);
  const halo = useMemo(() => glowTexture('rgba(255,230,160,1)', 'rgba(255,140,40,0.5)'), []);
  const k = beatK('smash', t);
  if (k < -0.15 || k > 1.25) return null;
  const P = 0.6;
  return (
    <>
      {Array.from({length: POTS}, (_, i) => {
        const u = potBreak(i, t);
        const x = potX(i);
        if (u < 0)
          return (
            <group key={i} position={[x, 0, POT_Z]} scale={P}>
              <mesh geometry={potGeo} castShadow>
                <meshStandardMaterial color="#2f241d" roughness={0.85} side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        if (u > 1.6) return null;
        const v = Math.min(1, u);
        return (
          <group key={i} position={[x, 0, POT_Z]}>
            {Array.from({length: 7}, (_, j) => {
              const a = (j / 7) * Math.PI * 2 + i;
              const sp = 0.7 * (0.7 + hash(i * 7 + j) * 0.6);
              const y = 0.25 + sp * v * 0.9 - v * v * sp * 1.1;
              return (
                <mesh key={j} position={[Math.cos(a) * sp * v, Math.max(0.03, y), Math.sin(a) * sp * v]} rotation={[v * 6 + j, v * 4, j]} scale={0.14} castShadow>
                  <boxGeometry args={[1, 0.25, 0.8]} />
                  <meshStandardMaterial color="#2f241d" roughness={0.85} />
                </mesh>
              );
            })}
            {u < 0.5 && (
              <mesh position={[0, 0.35, 0]} scale={0.3 * (0.4 + u * 1.6)}>
                <sphereGeometry args={[1, 10, 8]} />
                <meshBasicMaterial color="#efe7d4" transparent opacity={0.55 * (1 - u * 2)} />
              </mesh>
            )}
          </group>
        );
      })}
      {Array.from({length: SOLDIERS}, (_, i) => {
        const s = soldierAt(i, t);
        if (!s) return null;
        const inside = s.z < GATE[1] - 2.6;
        return (
          <group key={i} position={[s.x, 0, s.z]} rotation-y={s.moving || inside ? s.rot : Math.PI} scale={0.5}>
            <Walker step={t * 1.6 + i * 0.3} i={i} spear still={!s.moving} />
            {/* a torch in the left hand */}
            <mesh position={[-0.28, 1.5, 0.15]}>
              <cylinderGeometry args={[0.03, 0.03, 0.7, 5]} />
              <meshStandardMaterial color="#4a3020" />
            </mesh>
            <mesh position={[-0.28, 1.92, 0.15]} scale={[0.12, 0.2, 0.12]}>
              <sphereGeometry args={[1, 8, 6]} />
              <meshBasicMaterial color="#ffb347" toneMapped={false} />
            </mesh>
            <sprite position={[-0.28, 1.95, 0.15]} scale={[1.4, 1.4, 1]}>
              <spriteMaterial map={halo} transparent opacity={0.25 + 0.6 * night} depthWrite={false} toneMapped={false} />
            </sprite>
          </group>
        );
      })}
      {(() => {
        const e = elephantAt(t);
        if (!e) return null;
        return (
          <group position={[e.x, 0, e.z]} rotation-y={e.rot} scale={0.62}>
            <Elephant step={e.moving ? Math.sin(t * 9) : 0} howdah color="#6e6a66" />
          </group>
        );
      })()}
    </>
  );
};

// ------------------------------------------------------------------ boats
/** a Chinese-rigged junk (สำเภา), ~2.4 long, bow toward +z */
const Junk: React.FC<{sail?: string}> = ({sail = '#b5542e'}) => (
  <group>
    <Box p={[0, 0.2, 0]} s={[0.7, 0.35, 2.0]} c="#5a3a22" />
    <Box p={[0, 0.42, -0.95]} s={[0.66, 0.35, 0.4]} c="#6b452a" />
    <Box p={[0, 0.3, 1.0]} s={[0.5, 0.22, 0.4]} c="#6b452a" />
    {[[0.35, 1.7, 1.1], [-0.4, 1.3, 0.8]].map(([z, h, w], k) => (
      <group key={k} position={[0, 0.35, z]}>
        <mesh position={[0, h / 2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, h, 5]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
        <mesh position={[0, h * 0.58, 0.02]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[w, h * 0.78]} />
          <meshStandardMaterial color={sail} side={THREE.DoubleSide} roughness={0.9} />
        </mesh>
        {[0.3, 0.55, 0.8].map((v) => (
          <mesh key={v} position={[0, h * v, 0.04]} rotation-y={Math.PI / 2}>
            <boxGeometry args={[w, 0.025, 0.02]} />
            <meshStandardMaterial color="#3a2a1a" />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

const Steamer: React.FC = () => (
  <group>
    <Box p={[0, 0.2, 0]} s={[0.6, 0.32, 2.0]} c="#1f2226" />
    <Box p={[0, 0.48, -0.1]} s={[0.46, 0.26, 1.0]} c="#f1ece0" />
    <mesh position={[0, 0.9, 0.1]} castShadow>
      <cylinderGeometry args={[0.1, 0.1, 0.55, 8]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
    <mesh position={[0, 0.9, -0.9]}>
      <cylinderGeometry args={[0.02, 0.02, 1.0, 5]} />
      <meshStandardMaterial color="#3a2a1a" />
    </mesh>
  </group>
);

const Boats: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <>
    {Array.from({length: JUNKS_AT_LANDING}, (_, i) => {
      const j = landingJunkAt(i, t);
      if (!j) return null;
      return (
        <group key={`l${i}`} position={[j.x, 0.02, j.z]} rotation-y={j.rot + Math.PI} scale={0.6}>
          <Junk sail={i % 2 ? '#c9a46a' : '#b5542e'} />
        </group>
      );
    })}
    {Array.from({length: FLEET}, (_, i) => {
      const j = junkAt(i, t);
      if (!j || j.fade < 0.02) return null;
      return (
        <group key={`f${i}`} position={[j.x, 0.02, j.z]} rotation-y={j.rot} scale={1.3 * j.fade}>
          <Junk sail={i % 3 === 1 ? '#c9a46a' : '#a8482a'} />
        </group>
      );
    })}
    {(() => {
      const s = steamerAt(t);
      if (!s || Y < 1904) return null;
      return (
        <group position={[s.x, 0.02, s.z]} rotation-y={s.rot} scale={0.7}>
          <Steamer />
        </group>
      );
    })()}
  </>
);

// ------------------------------------------------------------------ 2377: Noen Wong, the column, the forts at the mouth
const NoenWong: React.FC<{t: number; Y: number; terrainH: LandmarkProps['terrainH']}> = ({t, Y, terrainH}) => {
  const k = Y > 1835 ? 1 : nwFortK(t);
  if (Y < 1833.9 || k < 0.02) return null;
  const [cx, cz] = NOEN_WONG;
  const [hx, hz] = NW_HALF;
  const top = terrainH(cx, cz);
  const wh = 0.85;
  const side = (len: number) => [-(len / 2 + 0.7) / 2 - 0.35, (len / 2 + 0.7) / 2 + 0.35].map((c) => [c, len / 2 - 0.7] as [number, number]);
  return (
    <group position={[cx, 0, cz]}>
      {/* the rise, levelled for the camp */}
      <mesh position={[0, top / 2 - 0.2, 0]} receiveShadow>
        <boxGeometry args={[2 * hx + 1.2, top + 0.4, 2 * hz + 1.2]} />
        <meshStandardMaterial color="#8f9a55" roughness={1} />
      </mesh>
      <group position={[0, top, 0]} scale={[1, k, 1]}>
        {/* north and south walls, gates in the middle */}
        {[-1, 1].map((s) =>
          side(2 * hx).map(([c, len], j) => <Box key={`${s}${j}`} p={[c, wh / 2, s * hz]} s={[len, wh, 0.28]} c={LATERITE} />),
        )}
        {[-1, 1].map((s) =>
          side(2 * hz).map(([c, len], j) => <Box key={`e${s}${j}`} p={[s * hx, wh / 2, c]} s={[0.28, wh, len]} c={LATERITE} />),
        )}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], j) => (
          <Box key={`c${j}`} p={[sx * hx, wh * 0.6, sz * hz]} s={[0.55, wh * 1.2, 0.55]} c={LATERITE_DARK} />
        ))}
      </group>
      {Y > 1834.3 && <Viharn pos={[0.4, top, 0.2]} k={Y > 1835 ? 1 : smooth((beatK('move', t) - 0.7) / 0.25)} scale={0.55} rot={Math.PI / 2} />}
    </group>
  );
};

/** a person carrying a laterite block on the shoulder */
const Carrier: React.FC<{step: number; i: number; block: boolean}> = ({step, i, block}) => (
  <group>
    <Walker step={step} i={i} />
    {block && <Box p={[0.12, 1.72, 0]} s={[0.36, 0.22, 0.26]} c={LATERITE} />}
  </group>
);

const Columns: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: CARRIERS}, (_, i) => {
      const c = carrierAt(i, t);
      if (!c || c.fade < 0.05) return null;
      return (
        <group key={`c${i}`} position={[c.x, 0, c.z]} rotation-y={c.rot} scale={0.6 * c.fade}>
          <Carrier step={t * 1.5 + i * 0.3} i={i} block />
        </group>
      );
    })}
    {Array.from({length: RETURNERS}, (_, i) => {
      const c = returnerAt(i, t);
      if (!c || c.fade < 0.05) return null;
      return (
        <group key={`r${i}`} position={[c.x, 0, c.z]} rotation-y={c.rot} scale={0.6 * c.fade}>
          <Walker step={t * 1.5 + i * 0.3} i={i} load={i % 3 === 0} />
        </group>
      );
    })}
  </>
);

// the French tricolour and the Siamese flag of 2447 (the white elephant on red)
const flagTexture = (kind: 'fr' | 'siam') => {
  const c = document.createElement('canvas');
  c.width = 96;
  c.height = 64;
  const g = c.getContext('2d')!;
  if (kind === 'fr') {
    ['#1f3f99', '#f4f4f0', '#d42a2a'].forEach((col, i) => {
      g.fillStyle = col;
      g.fillRect(i * 32, 0, 32, 64);
    });
  } else {
    g.fillStyle = '#c8202a';
    g.fillRect(0, 0, 96, 64);
    g.fillStyle = '#f4f1ea';
    g.beginPath();
    g.ellipse(46, 34, 20, 12, 0, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(68, 28, 8, 9, 0, 0, Math.PI * 2);
    g.fill();
    g.fillRect(74, 28, 4, 18);
    [32, 40, 52, 60].forEach((x) => g.fillRect(x, 40, 4, 12));
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

const Flag: React.FC<{tex: THREE.Texture; h: number; up: number; t: number}> = ({tex, h, up, t}) =>
  up < 0.02 ? null : (
    <mesh position={[0.62, 0.8 + (h - 1.2) * up, 0]} rotation-y={0.12 * Math.sin(t * 3)}>
      <planeGeometry args={[1.2, 0.8]} />
      <meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={0.9} />
    </mesh>
  );

/** a French soldier: blue coat, white trousers, kepi, rifle on the shoulder */
const Soldier: React.FC<{step: number; still: boolean}> = ({step, still}) => {
  const a = still ? 0 : Math.sin(step * Math.PI * 2) * 0.45;
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.1, 0.85, 0]} rotation-x={a * s}>
          <mesh position={[0, -0.42, 0]}>
            <cylinderGeometry args={[0.07, 0.06, 0.84, 6]} />
            <meshStandardMaterial color="#e9e6dc" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.12, 0]} castShadow>
        <capsuleGeometry args={[0.19, 0.4, 4, 8]} />
        <meshStandardMaterial color="#26387a" />
      </mesh>
      <mesh position={[0, 1.6, 0.02]}>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color="#d9a47a" />
      </mesh>
      <mesh position={[0, 1.78, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.16, 8]} />
        <meshStandardMaterial color="#b0261c" />
      </mesh>
      <mesh position={[0.24, 1.45, 0]} rotation-z={0.2}>
        <cylinderGeometry args={[0.025, 0.025, 1.1, 5]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
    </group>
  );
};

const French: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const fr = useMemo(() => flagTexture('fr'), []);
  const siam = useMemo(() => flagTexture('siam'), []);
  if (Y < 1893) return null;
  const hk = frenchHouseK(t, Y);
  const ff = frenchFlag(t, Y);
  const sf = siamFlag(t, Y);
  const tk = tuekDaengK(t, Y);
  return (
    <>
      {/* the French building in the camp, and its flagpole */}
      {hk > 0.02 && (
        <group position={[FRENCH_HOUSE[0], 0, FRENCH_HOUSE[1]]} scale={[1, hk, 1]}>
          <Box p={[0, 0.45, 0]} s={[1.6, 0.9, 0.9]} c="#e7dcc4" />
          <Box p={[0, 0.94, 0]} s={[1.75, 0.1, 1.0]} c="#8c4a36" />
          {[-0.5, 0, 0.5].map((x) => (
            <Box key={x} p={[x, 0.5, 0.46]} s={[0.2, 0.4, 0.02]} c="#3b4a5a" />
          ))}
        </group>
      )}
      <group position={[FRENCH_HOUSE[0] + 1.2, 0, FRENCH_HOUSE[1] + 0.5]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 3.0, 6]} />
          <meshStandardMaterial color="#dcd8cc" />
        </mesh>
        <Flag tex={fr} h={3.0} up={ff} t={t} />
        <Flag tex={siam} h={3.0} up={Y > 1904 ? sf : 0} t={t} />
      </group>
      {Array.from({length: FRENCH}, (_, i) => {
        const f = frenchAt(i, t);
        if (!f) return null;
        return (
          <group key={i} position={[f.x + ((i % 2) - 0.5) * 0.3, 0, f.z]} rotation-y={f.rot} scale={0.56}>
            <Soldier step={t * 1.7 + i * 0.3} still={!f.moving} />
          </group>
        );
      })}
      {/* ตึกแดง at the mouth: the French command house on the old fort, its own flag */}
      {tk > 0.02 && (
        <group position={[TUEK_DAENG[0], 0, TUEK_DAENG[1]]}>
          <group scale={[1, tk, 1]}>
            <Box p={[0, 0.7, 0]} s={[1.3, 0.9, 0.8]} c="#a5352a" />
            <Box p={[0, 1.2, 0]} s={[1.4, 0.12, 0.9]} c="#6e2a22" />
          </group>
          <group position={[0.9, 0, 0]}>
            <mesh position={[0, 1.6, 0]}>
              <cylinderGeometry args={[0.03, 0.035, 3.2, 6]} />
              <meshStandardMaterial color="#dcd8cc" />
            </mesh>
            <group position={[0, 0.2, 0]}>
              <Flag tex={fr} h={3.0} up={ff} t={t} />
              <Flag tex={siam} h={3.0} up={Y > 1904 ? sf : 0} t={t} />
            </group>
          </group>
          {/* the brick tower east of it */}
          <group position={[TOWER[0] - TUEK_DAENG[0], 0, TOWER[1] - TUEK_DAENG[1]]} scale={[1, tk, 1]}>
            <Box p={[0, 0.5, 0]} s={[0.55, 1.0, 0.55]} c="#8d3a2a" />
          </group>
        </group>
      )}
    </>
  );
};

/** the forts at the mouth (2377): ป้อมไพรีพินาศ on the west headland, the east-bank fort under ตึกแดง */
const MouthForts: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = Y > 1835 ? 1 : mouthFortK(t);
  if (Y < 1833.9 || k < 0.02) return null;
  return (
    <>
      {[WEST_FORT, TUEK_DAENG].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]} scale={[1, k, 1]}>
          <Box p={[0, 0.2, 0]} s={[2.0, 0.4, 1.6]} c={i ? '#8a5a3c' : LATERITE} />
          {[-0.6, 0, 0.6].map((cx) => (
            <mesh key={cx} position={[cx, 0.48, 0.75]} rotation-x={Math.PI / 2 - 0.2}>
              <cylinderGeometry args={[0.06, 0.08, 0.6, 6]} />
              <meshStandardMaterial color="#26282c" metalness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
};

// ------------------------------------------------------------------ the waterfront row, the churches, the cathedral
const Waterfront: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 1876) return null;
  return (
    <>
      {rowSpots.map((s, j) => {
        const k = rowK(j, t, Y);
        if (k < 0.02) return null;
        return (
          <group key={j} position={[s.x, 0, s.z]} rotation-y={s.rot} scale={[1, k, 1]}>
            <Box p={[0, 0.32, 0]} s={[0.72, 0.64, 0.62]} c={j % 3 ? '#6e4b2e' : '#7d5634'} />
            <Gable w={0.8} l={0.7} h={0.32} y={0.64} c={j % 2 ? '#8b8f92' : '#6f5040'} />
          </group>
        );
      })}
    </>
  );
};

const Chapel: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <Box p={[0, 0.3, 0]} s={[1.0, 0.6, 0.6]} c="#8a6440" />
      <Gable w={0.7} l={1.1} h={0.35} y={0.6} c="#5a3b22" />
      <Box p={[-0.5, 1.05, 0]} s={[0.05, 0.4, 0.05]} c="#efe9da" />
      <Box p={[-0.5, 1.12, 0]} s={[0.05, 0.05, 0.22]} c="#efe9da" />
    </group>
  );

const Cathedral: React.FC<{t: number; Y: number; night: number}> = ({t, Y, night}) => {
  // the first churches: on the west bank from the Vietnamese Catholics' arrival, across to the east bank in 2377
  const cross = Y < 1834 ? 0 : Y > 1835 ? 1 : churchCrossK(t);
  const westK = Y > 1700 ? 1 - cross : 0;
  const nave = naveK(t, Y);
  const spire = spireK(t, Y);
  const eastK = cross * (1 - nave);
  const [cx, cz] = CATHEDRAL;
  const WALLC = '#efe6d2';
  return (
    <>
      <group position={[3.7, 0, 7.2]} rotation-y={0.4}>
        <Chapel k={westK} />
      </group>
      <group position={[cx + 1.0, 0, cz]}>
        <Chapel k={eastK} />
      </group>
      {Y > 1905.9 && nave > 0.02 && (
        <group position={[cx, 0, cz]} scale={1.35}>
          <group scale={[1, nave, 1]}>
            {/* the nave runs east from the twin-towered front, which faces the river */}
            <Box p={[1.7, 0.5, 0]} s={[2.8, 1.0, 1.1]} c={WALLC} e="#ffcf7a" ei={night * 0.3} />
            <mesh position={[1.7, 1.0, 0]} rotation-x={Math.PI / 2} rotation-z={Math.PI / 2} scale={[0.62, 2.8, 0.55]} castShadow>
              <cylinderGeometry args={[1, 1, 1, 3]} />
              <meshStandardMaterial color="#5d6670" flatShading />
            </mesh>
            {[0.7, 1.3, 1.9, 2.5].map((x) =>
              [-1, 1].map((s) => <Box key={`${x}${s}`} p={[x, 0.55, s * 0.56]} s={[0.14, 0.5, 0.02]} c="#3c5a8a" e="#ffcf7a" ei={night * 0.9} />),
            )}
            {[-1, 1].map((s) => (
              <Box key={s} p={[0.15, 0.8, s * 0.36]} s={[0.44, 1.6, 0.44]} c={WALLC} />
            ))}
            <Box p={[0.15, 0.6, 0]} s={[0.4, 1.2, 0.3]} c={WALLC} />
            <mesh position={[-0.08, 0.95, 0]} rotation-z={Math.PI / 2}>
              <circleGeometry args={[0.16, 16]} />
              <meshStandardMaterial color="#3c5a8a" emissive="#ffcf7a" emissiveIntensity={night} side={THREE.DoubleSide} />
            </mesh>
          </group>
          {spire > 0.02 &&
            [-1, 1].map((s) => (
              <mesh key={s} position={[0.15, 1.6 * nave + 0.75 * spire, s * 0.36]} scale={[1, spire, 1]} castShadow>
                <coneGeometry args={[0.25, 1.5, 8]} />
                <meshStandardMaterial color="#5d6670" flatShading roughness={0.6} />
              </mesh>
            ))}
        </group>
      )}
    </>
  );
};

// ------------------------------------------------------------------ the sea, the hill's chedi, the orchards
const Sea: React.FC = () => {
  const w = TILE.x1 - TILE.x0;
  const d = TILE.z1 - COAST;
  return (
    <>
      <mesh position={[(TILE.x0 + TILE.x1) / 2, -0.02, COAST + d / 2]} receiveShadow>
        <boxGeometry args={[w, 0.16, d]} />
        <meshStandardMaterial color="#3a86b8" roughness={0.12} metalness={0.25} />
      </mesh>
      <mesh position={[(TILE.x0 + TILE.x1) / 2, 0.02, COAST - 0.35]} receiveShadow>
        <boxGeometry args={[w, 0.06, 0.7]} />
        <meshStandardMaterial color="#e2d3a0" roughness={1} />
      </mesh>
    </>
  );
};

export const ORCHARDS: [number, number, number][] = [[22, -12, 4.2], [-31, -15, 4.0], [22, 21, 4.4], [12, 32, 3.6], [-31, 18, 3.6]];
const Orchards: React.FC<{t: number; Y: number; terrainH: LandmarkProps['terrainH']}> = ({t, Y, terrainH}) => {
  const k = orchardK(t, Y);
  if (Y < 1937 || k < 0.02) return null;
  return (
    <>
      {ORCHARDS.map(([cx, cz, r], o) =>
        Array.from({length: 36}, (_, i) => {
          const x = cx - r + ((i % 6) + 0.5) * ((2 * r) / 6);
          const z = cz - r + (Math.floor(i / 6) + 0.5) * ((2 * r) / 6);
          const s = clamp01(k * 1.6 - (i / 36) * 0.6);
          if (s < 0.05) return null;
          return (
            <mesh key={`${o}-${i}`} position={[x, terrainH(x, z) + 0.45 * s, z]} scale={[0.5 * s, 0.55 * s, 0.5 * s]} castShadow>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={o % 2 ? '#2f5f2a' : '#3b6b2c'} flatShading />
            </mesh>
          );
        }),
      )}
    </>
  );
};

// ------------------------------------------------------------------ the payoff: the gem market on Si Chan road
const Market: React.FC<{t: number; Y: number; night: number}> = ({t, Y, night}) => {
  const halo = useMemo(() => glowTexture('rgba(255,240,200,1)', 'rgba(255,190,90,0.45)'), []);
  if (Y < MARKET_ON) return null;
  const [[x0, z0], [x1]] = SI_CHAN;
  const tables: {x: number; z: number; s: number}[] = [];
  for (let i = 0; i < 8; i++) for (const s of [-1, 1]) tables.push({x: x0 + 0.5 + i * ((x1 - x0 - 1) / 7), z: z0 + s * 0.62, s});
  const bk = gemBackK(t);
  const STONES = ['#f2c12e', '#2d5bd1', '#c0283a', '#2f9a5a', '#f2c12e'];
  return (
    <>
      {tables.map((tb, i) => (
        <group key={i} position={[tb.x, 0, tb.z]}>
          <Box p={[0, 0.25, 0]} s={[0.46, 0.06, 0.32]} c="#f3f0e6" />
          <Box p={[0, 0.12, 0]} s={[0.42, 0.22, 0.28]} c="#2b4a8c" />
          {[-0.12, 0.04, 0.16].map((dx, j) => (
            <mesh key={j} position={[dx, 0.3, 0]} scale={0.035}>
              <octahedronGeometry args={[1, 0]} />
              <meshBasicMaterial color={STONES[(i + j) % STONES.length]} toneMapped={false} />
            </mesh>
          ))}
          {/* the lamp over the table */}
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshStandardMaterial color="#fff2c8" emissive="#ffd27a" emissiveIntensity={0.5 + 1.5 * night} />
          </mesh>
          <sprite position={[0, 0.85, 0]} scale={[0.8, 0.8, 1]}>
            <spriteMaterial map={halo} transparent opacity={0.15 + 0.5 * night} depthWrite={false} toneMapped={false} />
          </sprite>
          {/* the seller behind the table, a buyer leaning in */}
          <group position={[0, 0, tb.s * 0.32]} rotation-y={tb.s > 0 ? Math.PI : 0} scale={0.42}>
            <Walker step={0} i={i + 3} still />
          </group>
          {i % 2 === 0 && (
            <group position={[0.05, 0, -tb.s * 0.32]} rotation-y={tb.s > 0 ? 0 : Math.PI} scale={0.42}>
              <Walker step={0} i={i} still />
            </group>
          )}
        </group>
      ))}
      {Array.from({length: MARKET_PEOPLE}, (_, i) => {
        const p = shopperAt(i, t);
        return (
          <group key={`p${i}`} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.44}>
            <Walker step={t * 1.4 + i * 0.37} i={i} />
          </group>
        );
      })}
      {/* the hero back: the yellow sapphire over the street, turning, catching the lamps */}
      {bk > 0.02 && (
        <group position={[GEM_BACK[0], GEM_BACK[1] - 0.6, GEM_BACK[2]]} scale={1.1 * bk}>
          <group rotation-x={0.25}>
            <Gem t={9} crust={false} spin={t * 0.9} glow={0.25 + 0.35 * night} />
          </group>
          <sprite position={[0, 0.6, 0]} scale={[3.2, 3.2, 1]}>
            <spriteMaterial map={halo} transparent opacity={0.18 + 0.3 * night} depthWrite={false} toneMapped={false} />
          </sprite>
          <Glint p={[0.35, 1.18, 0.4]} s={0.7 * Math.abs(Math.sin(t * 2.1))} />
        </group>
      )}
    </>
  );
};

const KhaoPloiWaen: React.FC<{Y: number; terrainH: LandmarkProps['terrainH']}> = ({Y, terrainH}) => {
  const [x, z] = KHAO_PLOI_WAEN;
  // the chedi on the hill (Wat Khao Ploi Waen; it appears when the town returns, after it was built in 2398)
  return <SmallChedi pos={[x, terrainH(x, z) - 0.1, z]} scale={0.9} k={ramp(Y, 1876.1, 1876.4)} color="#f1ece0" />;
};

export const ChanthaburiLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH}) => (
  <>
    <Hero t={t} terrainH={terrainH} />
    <Sea />
    <Moat Y={Y} />
    <Gate t={t} Y={Y} />
    <Smash t={t} night={night} />
    <Boats t={t} Y={Y} />
    <NoenWong t={t} Y={Y} terrainH={terrainH} />
    <MouthForts t={t} Y={Y} />
    <Columns t={t} />
    <Waterfront t={t} Y={Y} />
    <Cathedral t={t} Y={Y} night={night} />
    <French t={t} Y={Y} />
    <KhaoPloiWaen Y={Y} terrainH={terrainH} />
    <Orchards t={t} Y={Y} terrainH={terrainH} />
    <Market t={t} Y={Y} night={night} />
  </>
);
