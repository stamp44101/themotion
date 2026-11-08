import React from 'react';
import * as THREE from 'three';
import type {LandmarkProps} from '../../engine/types';
import {Walker} from '../nan/figures';
import {
  anvilK, ANVIL_TOP, AZ, backK, BOATS, boatAt, chop, clamp01, COLUMN, damK, doneK, fairK, flagK, flyK, FORGE_END, GIANT, giantK, hallK,
  HAND_S, lakeK, RAFTS, raftAt, ROW, rowK, SEG, SHOPS, shopK, smooth, SNAP, snapK, soldierAt, SOLDIER_S, stationK, strikeAt,
  swordAt, swordBackAt, beatK, silaK, orchardK, ORCHARD,
} from './actors';
import {DAM, DAM_LEN, FIGHT_AT, HALL, HERO_AT, HERO_S, LAKE, MONUMENT, SILA_AT, STATION, RAIL_X} from './places';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const STEEL = new THREE.Color('#9ea6ad');
const DARK_IRON = new THREE.Color('#3a3634');
const HOT = new THREE.Color('#ff6a12');
const WHITE_HOT = new THREE.Color('#ffd27a');
const mix = (a: THREE.Color, b: THREE.Color, k: number) => a.clone().lerp(b, clamp01(k));
const WATER = '#3f8fc0';

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; e?: string; ei?: number; r?: number}> = ({p, s, c, e, ei = 0.6, r = 0}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} emissive={e ?? '#000000'} emissiveIntensity={e ? ei : 0} />
  </mesh>
);
/** a pitched roof over a box: w across x, l along z */
const Gable: React.FC<{w: number; l: number; h: number; y: number; c: string}> = ({w, l, h, y, c}) => (
  <mesh position={[0, y + h / 2, 0]} rotation-y={Math.PI / 4} scale={[w * 0.72, h, l * 0.72]} castShadow>
    <coneGeometry args={[1, 1, 4]} />
    <meshStandardMaterial color={c} flatShading roughness={0.8} />
  </mesh>
);

// ------------------------------------------------------------------ the sword (from the style frame A1)
// the blade in 12 segments from the tip (k = 0, +x) to the tang; units of the sword's length L = 1
const segX = (k: number) => 0.5 - (k + 0.5) / SEG;
const BAR_H = 0.07;
const BAR_W = 0.075;
const BLADE_H = 0.02;
const bladeW = (k: number) => (k === 0 ? 0.08 : 0.17 - 0.02 * (k / SEG));

/** a sword of length 1 along x (tip +x), its flat facing +y; `t` drives the forging (Infinity = finished and cool);
 *  `part`: 'hilt' keeps the tang half (the broken sword in the hand), 'tip' the half that snaps off */
const Sword: React.FC<{t: number; hilt: number; part?: 'all' | 'hilt' | 'tip'}> = ({t, hilt, part = 'all'}) => (
  <group>
    {Array.from({length: SEG}, (_, k) => {
      if ((part === 'hilt' && k < SEG / 2) || (part === 'tip' && k >= SEG / 2)) return null;
      const s = strikeAt(k);
      const f = smooth((t - s) / 0.08);
      const since = t - s;
      const heat = since < 0 ? 0.75 : Math.max(0, 1 - since / 2.6);
      const col = heat > 0.85 ? mix(HOT, WHITE_HOT, (heat - 0.85) / 0.15) : mix(f > 0.5 ? STEEL : DARK_IRON, HOT, heat / 0.85);
      const w = BAR_W + (bladeW(k) - BAR_W) * f;
      const h = BAR_H + (BLADE_H - BAR_H) * f;
      return (
        <mesh key={k} position={[segX(k), h * 0.5, 0]} castShadow>
          <boxGeometry args={[(1 / SEG) * 1.02, h, w]} />
          <meshStandardMaterial color={col} emissive={HOT} emissiveIntensity={heat * 0.9} roughness={0.35 + 0.3 * heat} metalness={0.7 - 0.4 * heat} />
        </mesh>
      );
    })}
    {hilt > 0.02 && (
      <group position={[-0.5, BLADE_H * 0.5, 0]} scale={hilt}>
        <mesh position={[-0.17, 0, 0]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.03, 0.034, 0.27, 10]} />
          <meshStandardMaterial color="#3b2416" roughness={0.9} />
        </mesh>
        <mesh position={[-0.32, 0, 0]} castShadow>
          <sphereGeometry args={[0.04, 10, 8]} />
          <meshStandardMaterial color="#b08d3a" metalness={0.7} roughness={0.35} />
        </mesh>
      </group>
    )}
  </group>
);

/** sparks off one blow, self-lit */
const Sparks: React.FC<{u: number; seed: number; S: number}> = ({u, seed, S}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: 20}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const up = 0.4 + hash(seed * 5 + i) * 0.9;
        const sp = S * (0.25 + hash(seed * 3 + i) * 0.45);
        const y = up * sp * u - u * u * sp * 1.4;
        return (
          <mesh key={i} position={[Math.cos(a) * sp * u, Math.max(0, y), Math.sin(a) * sp * u]} scale={S * 0.012 * (1 - u)}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={i % 3 ? '#ffb347' : '#fff1c2'} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ the cover: the anvil, the hammer, the coals
const Forge: React.FC<{t: number; terrainH: LandmarkProps['terrainH']}> = ({t, terrainH}) => {
  const k = anvilK(t);
  if (k < 0.02) return null;
  const S = HERO_S;
  const g = terrainH(HERO_AT[0], HERO_AT[1]);
  // the hammer: between two blows it rises, then drops fast onto the next segment
  const next = Array.from({length: SEG}, (_, i) => strikeAt(i)).findIndex((s) => s >= t);
  const prevT = next <= 0 ? -1 : strikeAt(next - 1);
  const nextT = next < 0 ? FORGE_END + 9 : strikeAt(next);
  const u = clamp01((t - prevT) / Math.max(0.05, nextT - prevT));
  const up = u < 0.7 ? smooth(u / 0.7) : 1 - smooth((u - 0.7) / 0.3);
  const hx = segX(next < 0 ? SEG - 1 : next) * S;
  const away = smooth((t - FORGE_END) / 0.6);
  return (
    <group position={[HERO_AT[0], g, HERO_AT[1]]} rotation-y={AZ} scale={[1, k, 1]}>
      <mesh position={[0, 0.13 * S, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2 * S, 0.24 * S, 0.26 * S, 18]} />
        <meshStandardMaterial color="#6b4a2c" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.31 * S, 0]} castShadow>
        <boxGeometry args={[0.3 * S, 0.12 * S, 0.2 * S]} />
        <meshStandardMaterial color="#2b2a2a" metalness={0.5} roughness={0.55} />
      </mesh>
      <mesh position={[0, ANVIL_TOP - 0.04 * S, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6 * S, 0.08 * S, 0.28 * S]} />
        <meshStandardMaterial color="#363535" metalness={0.55} roughness={0.45} />
      </mesh>
      <mesh position={[0.4 * S, ANVIL_TOP - 0.05 * S, 0]} rotation-z={-Math.PI / 2} castShadow>
        <coneGeometry args={[0.07 * S, 0.2 * S, 12]} />
        <meshStandardMaterial color="#363535" metalness={0.55} roughness={0.45} />
      </mesh>
      {/* a low pit of coals beside the anvil, breathing with the bellows */}
      <group position={[-0.12 * S, 0, 0.4 * S]}>
        <mesh position={[0, 0.03 * S, 0]} receiveShadow>
          <cylinderGeometry args={[0.18 * S, 0.2 * S, 0.06 * S, 20]} />
          <meshStandardMaterial color="#6e3a24" roughness={0.95} />
        </mesh>
        {Array.from({length: 26}, (_, i) => {
          const a = hash(i) * Math.PI * 2;
          const r = Math.sqrt(hash(i + 40)) * 0.15 * S;
          return (
            <mesh key={i} position={[Math.cos(a) * r, 0.07 * S, Math.sin(a) * r]} scale={S * (0.02 + hash(i + 7) * 0.015)}>
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#2a1a12" emissive="#ff5a10" emissiveIntensity={0.6 + 0.4 * Math.sin(t * 5 + i * 1.7)} roughness={1} />
            </mesh>
          );
        })}
      </group>
      {Array.from({length: SEG}, (_, i) => (
        <group key={i} position={[segX(i) * S, ANVIL_TOP + BLADE_H * S, 0]}>
          <Sparks u={(t - strikeAt(i)) / 0.7} seed={i + 1} S={S} />
        </group>
      ))}
      {/* the smith's hammer, swung from the anvil's near side */}
      {away < 0.98 && (
        <group position={[hx, ANVIL_TOP + (0.03 + up * 0.32 + away * 0.6) * S, (0.05 + away * 0.5) * S]} rotation-x={-0.5 * up}>
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

/** the cover's sword: on the anvil, then lifting, then flying to the giant's hand (gone once he holds it) */
const CoverSword: React.FC<{t: number}> = ({t}) => {
  if (flyK(t) >= 0.999) return null;
  const p = swordAt(t);
  const done = doneK(t);
  return (
    <group position={[p.x, p.y, p.z]} rotation-y={AZ + p.spin} rotation-x={done * 0.75 * (1 - flyK(t))} scale={p.s}>
      <Sword t={t} hilt={done} />
    </group>
  );
};

// ------------------------------------------------------------------ 2316: the giant, his swords, the column
/** a sword held in a fist, pointing out along the arm (the arm runs along local -y from the shoulder) */
const HL = HAND_S / GIANT;
const InHand: React.FC<{part: 'all' | 'hilt'}> = ({part}) => (
  <group rotation-z={-Math.PI / 2}>
    <group position={[0.67 * HL, 0, 0]} scale={HL}>
      <Sword t={1e9} hilt={1} part={part} />
    </group>
  </group>
);
/** where the right blade breaks, in the giant's body frame (shoulder, arm raised by 2.3 rad, 0.67 of the sword out) */
const ARM: [number, number] = [Math.sin(2.3), -Math.cos(2.3)];
const BREAK: [number, number, number] = [0.24 + (0.38 + 0.67 * HL) * ARM[0], 1.42 + (0.38 + 0.67 * HL) * ARM[1], 0.05];

const Giant: React.FC<{t: number}> = ({t}) => {
  const k = giantK(t);
  if (k < 0.02) return null;
  const broken = t >= SNAP;
  const u = snapK(t);
  // he faces the column coming down from the north-west; he rises out of the field and sinks back into it (not squashed)
  const face = -2.0;
  return (
    <group position={[FIGHT_AT[0], -(1 - k) * 2.0 * GIANT, FIGHT_AT[1]]} rotation-y={face} scale={GIANT}>
      <Walker step={0} i={2} still />
      <mesh position={[0, 1.02, 0]} scale={[0.22, 0.07, 0.22]}>
        <cylinderGeometry args={[1, 1, 1, 10]} />
        <meshStandardMaterial color="#b0261c" roughness={0.9} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.24, 1.42, 0.05]} rotation-x={chop(t, s) - 0.3} rotation-z={s * 2.3}>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.05, 0.045, 0.4, 6]} />
            <meshStandardMaterial color="#c99a72" roughness={0.9} />
          </mesh>
          <group position={[0, -0.38, 0]}>
            <InHand part={s > 0 && broken ? 'hilt' : 'all'} />
          </group>
        </group>
      ))}
      {/* the snapped half spins up and away, with a flash at the break */}
      {broken && u < 1 && (
        <group position={[BREAK[0] + u * 1.2, BREAK[1] + u * 1.0 - u * u * 2.4, BREAK[2] + u * 0.6]} rotation={[u * 9, u * 5, 2.3 + u * 7]} scale={HL}>
          <Sword t={1e9} hilt={0} part="tip" />
        </group>
      )}
      {t > SNAP && t < SNAP + 0.5 && (
        <mesh position={BREAK} scale={0.3 * Math.sin(((t - SNAP) / 0.5) * Math.PI)}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#fff1c2" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

const Column: React.FC<{t: number}> = ({t}) => (
  <group>
    {Array.from({length: COLUMN}, (_, i) => {
      const p = soldierAt(i, t);
      if (!p || p.show < 0.02) return null;
      return (
        <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={[SOLDIER_S, SOLDIER_S * p.show, SOLDIER_S]}>
          <Walker step={t * 1.6 + i * 0.3} i={i} spear still={!p.moving} />
        </group>
      );
    })}
  </group>
);

// ------------------------------------------------------------------ the trade: boats, rafts, the market row
/** a big river boat (เรือกระแชง): a long hull under a curved bamboo roof */
const Barge: React.FC = () => (
  <group>
    <Box p={[0, 0.18, 0]} s={[0.7, 0.36, 2.4]} c="#5b3b22" />
    <mesh position={[0, 0.5, -0.1]} rotation-z={Math.PI / 2} scale={[0.4, 0.34, 1.4]} castShadow>
      <cylinderGeometry args={[1, 1, 1, 12, 1, false, 0, Math.PI]} />
      <meshStandardMaterial color="#b89a5e" roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
  </group>
);
const Raft: React.FC = () => (
  <group>
    {[-0.3, 0, 0.3].map((x) => (
      <mesh key={x} position={[x, 0.12, 0]} rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 2.6, 8]} />
        <meshStandardMaterial color="#8a5a32" roughness={0.9} />
      </mesh>
    ))}
    <group position={[0, 0.2, 0.6]} scale={0.5}>
      <Walker step={0} i={1} still />
    </group>
  </group>
);

const River: React.FC<{t: number}> = ({t}) => (
  <group>
    {Array.from({length: BOATS}, (_, i) => {
      const p = boatAt(i, t);
      return p ? (
        <group key={`b${i}`} position={[p.x, 0.05, p.z]} rotation-y={p.rot}>
          <Barge />
        </group>
      ) : null;
    })}
    {Array.from({length: RAFTS}, (_, i) => {
      const p = raftAt(i, t);
      return p ? (
        <group key={`r${i}`} position={[p.x, 0.02, p.z]} rotation-y={p.rot}>
          <Raft />
        </group>
      ) : null;
    })}
  </group>
);

/** a wooden house on stilts with a gable roof (the river street's row) */
const Woodhouse: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <Box p={[0, 0.45, 0]} s={[0.8, 0.5, 0.8]} c={i % 2 ? '#8a6040' : '#7a5236'} />
      <Gable w={0.95} l={0.95} h={0.45} y={0.7} c="#5a4636" />
    </group>
  );

const MarketRow: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {ROW.map((r, j) => {
      const k = Y > 1885 ? 1 : rowK(j, t);
      return (
        <group key={j} position={[r.x, 0, r.z]}>
          <Woodhouse k={k} i={j} />
        </group>
      );
    })}
  </group>
);

// ------------------------------------------------------------------ 2452: the station, the shophouses; the Sila At yards
const Station: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = Y > 1910 ? 1 : stationK(t);
  if (k < 0.02) return null;
  return (
    <group position={[STATION[0], 0, STATION[1]]} scale={[1, k, 1]}>
      <Box p={[0, 0.5, 0]} s={[1.4, 1.0, 3.2]} c="#e9dcc0" />
      <Gable w={1.7} l={3.6} h={0.6} y={1.0} c="#8a3b2a" />
      <Box p={[1.0, 0.08, 0]} s={[0.6, 0.16, 4.6]} c="#9a948a" />
    </group>
  );
};
const Shophouses: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {SHOPS.map((s, j) => {
      const k = Y > 1910 ? 1 : shopK(j, t);
      return k < 0.02 ? null : (
        <group key={j} position={[s.x, 0, s.z]} scale={[1, k, 1]}>
          <Box p={[0, 0.55, 0]} s={[1.2, 1.1, 1.1]} c={j % 3 ? '#cdb898' : '#b9a27c'} />
          <Box p={[0, 1.15, 0]} s={[1.3, 0.1, 1.2]} c="#6e4e38" />
        </group>
      );
    })}
  </group>
);
/** the Sila At station (2501) east of the line, its yard and the long locomotive shed, rising in the grow shot */
const SilaAt: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = Y < 1978 ? 0 : Y > 2022 ? 1 : silaK(t);
  if (k < 0.02) return null;
  return (
    <group position={[SILA_AT[0], 0, SILA_AT[1]]}>
      <group scale={[1, k, 1]}>
        <Box p={[0.6, 0.6, 0]} s={[1.8, 1.2, 4.2]} c="#e2d6bd" />
        <group position={[0.6, 0, 0]}>
          <Gable w={2.1} l={4.6} h={0.6} y={1.2} c="#7a3328" />
        </group>
        <Box p={[3.4, 0.9, -3.2]} s={[2.6, 1.8, 9.0]} c="#8b8f94" />
      </group>
      {/* the yard's sidings */}
      {[1.9, 2.5].map((x) => (
        <mesh key={x} position={[x, 0.06, -2.4]} scale={[0.12, 0.08, 12 * k]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#5a5550" />
        </mesh>
      ))}
    </group>
  );
};
/** longkong and langsat orchards climbing the Laplae hills (the grow shot) */
const Orchards: React.FC<{t: number; Y: number; terrainH: LandmarkProps['terrainH']}> = ({t, Y, terrainH}) => {
  const k = Y < 1978 ? 0 : Y > 2022 ? 1 : orchardK(t);
  if (k < 0.02) return null;
  return (
    <group>
      {Array.from({length: 90}, (_, i) => {
        const a = hash(i + 300) * Math.PI * 2;
        const r = Math.sqrt(hash(i + 400)) * 7.5;
        const x = ORCHARD[0] + Math.cos(a) * r;
        const z = ORCHARD[1] + Math.sin(a) * r;
        const kk = smooth((k - r / 9) / 0.25);
        if (kk < 0.02) return null;
        return (
          <mesh key={i} position={[x, terrainH(x, z) + 0.45 * kk, z]} scale={0.5 * kk} castShadow>
            <sphereGeometry args={[1, 7, 6]} />
            <meshStandardMaterial color={i % 3 ? '#4f8a3a' : '#6aa04a'} roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ 2458: the hall and its flag; the monument
const Hall: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = Y > 1916 ? 1 : hallK(t);
  if (k < 0.02) return null;
  const f = Y > 1916 ? 1 : flagK(t);
  return (
    <group position={[HALL[0], 0, HALL[1]]}>
      <group scale={[1, k, 1]}>
        <Box p={[0, 0.8, 0]} s={[4.0, 1.6, 1.6]} c="#f1ecdf" />
        <Box p={[0, 1.7, 0]} s={[4.3, 0.12, 1.9]} c="#7d5a3c" />
        <mesh position={[0, 2.05, 0]} rotation-y={Math.PI / 4} scale={[3.1, 0.6, 1.4]} castShadow>
          <coneGeometry args={[1, 1, 4]} />
          <meshStandardMaterial color="#8a3b2a" flatShading roughness={0.8} />
        </mesh>
      </group>
      {k > 0.5 && (
        <group position={[0, 0, 1.6]}>
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 3.2, 6]} />
            <meshStandardMaterial color="#dddddd" />
          </mesh>
          {f > 0.02 && (
            <group position={[0.36, 0.4 + 2.6 * f, 0]}>
              <Box p={[0, 0.16, 0]} s={[0.7, 0.1, 0.02]} c="#b0261c" />
              <Box p={[0, 0.06, 0]} s={[0.7, 0.1, 0.02]} c="#f4f4f4" />
              <Box p={[0, -0.04, 0]} s={[0.7, 0.1, 0.02]} c="#2a3a8c" />
            </group>
          )}
        </group>
      )}
    </group>
  );
};
/** the monument (2512): a plinth and the hero with two swords, the right one broken; it rises in the grow shot */
const Monument: React.FC<{t: number; Y: number; night: number}> = ({t, Y, night}) => {
  const k = Y < 1978 ? 0 : Math.min(1, smooth(beatK('grow', t) / 0.25) + (Y > 2022 ? 1 : 0));
  if (k < 0.02) return null;
  return (
    <group position={[MONUMENT[0], 0, MONUMENT[1]]} scale={[1, k, 1]}>
      <Box p={[0, 0.5, 0]} s={[1.0, 1.0, 1.0]} c="#d8d2c4" e={night > 0.3 ? '#ffd27a' : undefined} ei={0.2 * night} />
      <group position={[0, 1.0, 0]} scale={0.7}>
        <Walker step={0} i={2} still />
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ the dam and its lake
// the crest runs across the gorge: the river here runs (-2.6, 3.2), so the crest's local x is (3.2, 2.6) normalised
const damRot = -Math.atan2(2.6, 3.2);
const Dam: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = Y < 1917 ? 0 : Y > 1977.5 ? 1 : damK(t);
  if (k < 0.02) return null;
  return (
    <group position={[DAM[0], 0, DAM[1]]} rotation-y={damRot}>
      {/* the earth embankment in three steps (a broad base, a body, the crest road), grass on its faces */}
      <Box p={[0, 0.6 * k, 0]} s={[DAM_LEN + 1.2, 1.2 * k, 4.2]} c="#7f9a58" />
      <Box p={[0, 1.9 * k, 0]} s={[DAM_LEN + 0.4, 1.4 * k, 2.4]} c="#8aa462" />
      <Box p={[0, 2.85 * k, 0]} s={[DAM_LEN, 0.5 * k, 1.0]} c="#c9c2b2" />
      {/* the spillway's concrete face on the downstream side */}
      <Box p={[DAM_LEN * 0.32, 1.2 * k, 1.6]} s={[1.2, 2.2 * k, 1.4]} c="#d8d4cc" />
    </group>
  );
};
const Lake: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = Y < 1976 ? 0 : Y > 1978 ? 1 : lakeK(t);
  if (k < 0.02) return null;
  return (
    <group>
      {LAKE.map(([x, z, r], i) => (
        <mesh key={i} position={[x, 0.2 + 1.2 * k, z]} rotation-x={-Math.PI / 2} scale={r * (0.5 + 0.9 * k)}>
          <circleGeometry args={[1, 28]} />
          <meshStandardMaterial color={WATER} roughness={0.25} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ the payoff: the fair and the sword back over the town
const Fair: React.FC<{t: number; Y: number; night: number}> = ({t, Y, night}) => {
  const k = Y < 2024.9 ? 0 : fairK(t);
  if (k < 0.02) return null;
  return (
    <group position={[MONUMENT[0], 0, MONUMENT[1]]}>
      {/* stalls round the plaza */}
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = 4.2;
        return (
          <group key={i} position={[Math.cos(a) * r, 0, 2.2 + Math.sin(a) * r * 0.7]} rotation-y={-a} scale={[1, k, 1]}>
            <Box p={[0, 0.35, 0]} s={[0.9, 0.7, 0.6]} c={['#d9c9a3', '#c7462e', '#e8b33a'][i % 3]} />
            <Gable w={1.1} l={0.8} h={0.3} y={0.7} c={i % 2 ? '#f1ecdf' : '#c7462e'} />
          </group>
        );
      })}
      {/* lights strung round the monument */}
      {Array.from({length: 24}, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 3.0, 1.8 + 0.2 * Math.sin(i), 1.0 + Math.sin(a) * 2.2]} scale={0.09 * k}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color={i % 2 ? '#ffd27a' : '#ff8a3a'} toneMapped={night < 0.3} />
          </mesh>
        );
      })}
      {/* the crowd */}
      {Array.from({length: 46}, (_, i) => {
        const a = hash(i) * Math.PI * 2;
        const r = 1.4 + hash(i + 9) * 2.4;
        return (
          <group key={i} position={[Math.cos(a) * r, 0, 1.6 + Math.sin(a) * r * 0.8]} rotation-y={a + Math.PI} scale={0.45 * k}>
            <Walker step={t * 0.8 + i} i={i} still={i % 3 !== 0} />
          </group>
        );
      })}
    </group>
  );
};
const SwordBack: React.FC<{t: number}> = ({t}) => {
  const k = backK(t);
  if (k < 0.02) return null;
  const p = swordBackAt(t);
  // it comes down point first, then levels and turns over the plaza
  return (
    <group position={[p.x, p.y, p.z]} rotation-y={p.spin} rotation-z={(1 - k) * 1.2} scale={p.s}>
      <Sword t={1e9} hilt={1} />
      {/* a cool sheen so the steel reads at dusk */}
      <mesh position={[0.02, 0.022, 0]} scale={[0.92, 0.002, 0.14]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#e8eef4" transparent opacity={0.55} />
      </mesh>
      {k > 0.9 && (
        <mesh position={[0.1, 0.02, 0]} scale={[0.6, 0.02, 0.12]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.25 * Math.sin(t * 3) ** 2} />
        </mesh>
      )}
    </group>
  );
};

export const UttaraditLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH}) => (
  <group>
    <Forge t={t} terrainH={terrainH} />
    <CoverSword t={t} />
    {t > 4.2 && t < 11.4 && (
      <>
        <Giant t={t} />
        <Column t={t} />
      </>
    )}
    {t > 11.0 && t < 18.2 && <River t={t} />}
    <MarketRow t={t} Y={Y} />
    <Station t={t} Y={Y} />
    <Shophouses t={t} Y={Y} />
    <SilaAt t={t} Y={Y} />
    <Orchards t={t} Y={Y} terrainH={terrainH} />
    <Hall t={t} Y={Y} />
    <Monument t={t} Y={Y} night={night} />
    <Dam t={t} Y={Y} />
    <Lake t={t} Y={Y} />
    <Fair t={t} Y={Y} night={night} />
    <SwordBack t={t} />
    {/* the rail's line through Ban Dara is the engine's; RAIL_X kept for the station's side */}
    <group userData={{railX: RAIL_X}} />
  </group>
);
