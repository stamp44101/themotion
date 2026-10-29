// Phra Pathom Chedi as lathe geometry (height 1 = 120.45 m) and the old stupa it encases. Rama IV's
// encasing (2396) is drawn as a brick shell rising round the old stupa; it slumps in the rains of
// July 2403, is relaid as the bell, and is crowned in 2413 (docs/briefs/nakhonpathom.md).
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {lathe, PRANG} from '../../engine/parts';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const GOLD = '#d98a2b';
export const BRICK = '#9a5a3c';
const LIME = '#e8e0cc';
const ROOF = '#b8442f';

// the bell: base 235.5 m round (Ø ~75 m, r 0.31; Gemini's 56.6-m diameter disagrees, brief), broad and
// low; then the harmika, the ringed spire and the crown
const BELL: [number, number][] = [
  [0.33, 0.06], [0.33, 0.075], [0.31, 0.08], [0.311, 0.12], [0.3, 0.17], [0.276, 0.22], [0.236, 0.27],
  [0.184, 0.315], [0.12, 0.35], [0.066, 0.37], [0, 0.375],
];
const BELL_TOP = 0.375;
const SPIRE: [number, number][] = [
  [0, 0.43], [0.07, 0.43], [0.064, 0.47], [0.056, 0.47], [0.053, 0.53], [0.046, 0.53], [0.043, 0.6],
  [0.036, 0.6], [0.033, 0.67], [0.028, 0.67], [0.025, 0.74], [0.02, 0.74], [0.017, 0.82], [0.012, 0.82],
  [0.009, 0.9], [0.004, 0.93], [0, 0.93],
];
const CROWN: [number, number][] = [[0, 0.93], [0.013, 0.935], [0.009, 0.965], [0.004, 0.99], [0, 1]];
// the old Dvaravati stupa (an upturned bowl) carrying its later prang
const BOWL: [number, number][] = [
  [0, 0], [0.2, 0], [0.2, 0.03], [0.19, 0.04], [0.195, 0.08], [0.18, 0.12], [0.14, 0.155], [0.08, 0.175], [0, 0.18],
];

const rAt = (y: number) => {
  for (let i = 1; i < BELL.length; i++) {
    const [r0, a] = BELL[i - 1];
    const [r1, b] = BELL[i];
    if (y >= a && y <= b && b > a) return r0 + ((y - a) / (b - a)) * (r1 - r0);
  }
  return 0;
};
/** the bell's profile between y0 and y1 (no caps: tiers meet without seams) */
const band = (y0: number, y1: number): [number, number][] => [
  [rAt(y0), y0],
  ...BELL.filter(([, y]) => y > y0 && y < y1),
  [rAt(y1), y1],
];
export const TIERS = 7;
const TIER_Y = Array.from({length: TIERS + 1}, (_, i) => 0.06 + (i / TIERS) * (BELL_TOP - 0.06));

const tint = new THREE.Color();
const brick = new THREE.Color(BRICK);
const gold = new THREE.Color(GOLD);

/** the chedi. `shell` 0..1: how many tiers of the bell are laid (fractional = the top tier rising);
 *  `spire`, `crown` 0..1; `gold` 0 brick .. 1 glazed; `slump` 0..1 the 2403 collapse (the shell sinks
 *  and spreads). Every growing mesh is gated on its own scale (CLAUDE.md). */
export const Chedi: React.FC<{shell: number; spire: number; crown: number; gold: number; slump?: number; lit?: number}> = ({
  shell,
  spire,
  crown,
  gold: g,
  slump = 0,
  lit = 0,
}) => {
  const geos = useMemo(() => TIER_Y.slice(0, -1).map((y, i) => lathe(band(y, TIER_Y[i + 1]), 64)), []);
  const spireGeo = useMemo(() => lathe(SPIRE, 32), []);
  const crownGeo = useMemo(() => lathe(CROWN, 24), []);
  const bowl = useMemo(() => lathe(BOWL, 32), []);
  const prang = useMemo(() => lathe(PRANG, 12), []);
  const color = `#${tint.copy(brick).lerp(gold, clamp01(g)).getHexString()}`;
  const glow = lit > 0.02 ? '#ffb54a' : '#000000';
  const harmika = 0.43 - BELL_TOP;
  const sq = 1 - 0.45 * slump;
  const spread = 1 + 0.18 * slump;
  return (
    <group>
      {/* the old stupa, hidden once the bell closes over it */}
      {shell < 1 && (
        <group>
          <mesh geometry={bowl} position={[0, 0.06, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={BRICK} roughness={0.95} />
          </mesh>
          <mesh geometry={prang} position={[0, 0.24, 0]} scale={0.05} castShadow>
            <meshStandardMaterial color={BRICK} roughness={0.95} />
          </mesh>
        </group>
      )}
      <group scale={[spread, sq, spread]}>
        {geos.map((geo, i) => {
          const k = clamp01(shell * TIERS - i);
          if (k <= 0.02) return null;
          return (
            <mesh key={i} geometry={geo} position={[0, (1 - k) * -(TIER_Y[i + 1] - TIER_Y[i]), 0]} scale={[1, k, 1]} castShadow receiveShadow>
              <meshStandardMaterial
                color={color}
                roughness={0.35 + 0.55 * (1 - g)}
                metalness={0.25 * g}
                side={THREE.DoubleSide}
                emissive={glow}
                emissiveIntensity={0.35 * lit}
              />
            </mesh>
          );
        })}
      </group>
      {spire > 0.02 && (
        <group scale={[1, spire, 1]}>
          <mesh position={[0, BELL_TOP + harmika / 2, 0]} castShadow>
            <boxGeometry args={[0.15, harmika, 0.15]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.25 * g} emissive={glow} emissiveIntensity={0.35 * lit} />
          </mesh>
          <mesh geometry={spireGeo} castShadow>
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.25 * g} emissive={glow} emissiveIntensity={0.35 * lit} />
          </mesh>
        </group>
      )}
      {crown > 0.02 && (
        <mesh geometry={crownGeo} scale={[1, crown, 1]}>
          <meshBasicMaterial color="#ffd66b" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

/** the round upper terrace (~92 m), and from `court` the walled square (~250 x 240 m), the round
 *  gallery and the four viharns ([local]'s measurements on Esri imagery, PR #76) */
export const Terrace: React.FC<{court: number}> = ({court}) => (
  <group>
    <mesh position={[0, 0.03, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[0.38, 0.4, 0.06, 64]} />
      <meshStandardMaterial color={LIME} roughness={0.9} />
    </mesh>
    {court > 0.02 && (
      <group scale={[1, court, 1]}>
        <mesh position={[0, 0.0125, 0]} receiveShadow>
          <boxGeometry args={[2.05, 0.025, 2.0]} />
          <meshStandardMaterial color="#cfc6b0" roughness={0.95} />
        </mesh>
        {/* the round gallery (คตพระระเบียง, ~107-126 m across, measured on imagery): a low wall under a red roof */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.05, 96, 1, true]} />
          <meshStandardMaterial color={LIME} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.066, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.45, 0.525, 96]} />
          <meshStandardMaterial color={ROOF} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        {[0, 1, 2, 3].map((q) => (
          <group key={q} rotation-y={(q * Math.PI) / 2}>
            <mesh position={[0, 0.07, 0.52]} castShadow>
              <boxGeometry args={[0.16, 0.09, 0.12]} />
              <meshStandardMaterial color={LIME} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.135, 0.52]} rotation-z={Math.PI / 4} castShadow>
              <boxGeometry args={[0.09, 0.09, 0.13]} />
              <meshStandardMaterial color={ROOF} roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    )}
  </group>
);
