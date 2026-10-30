// Throwaway style frames for Nakhon Pathom's cover (29 Oct 2026). A: the old brick stupa with its
// prang top stands alone in a forest clearing; from frame 0 the golden bell of Rama IV's Phra Pathom
// Chedi rises round it tier by tier, closes over it, and the spire shoots up to the crown by 1.6 s.
// A1 legend scale ~26 units on the whole tile; A2 ~18 units with the round cloister and the square
// terrace. B: a giant Dvaravati Dharmachakra rolls in across the forest and stands up on its pillar
// beside the old stupa, a crouching deer at its foot.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {Walker} from '../cities/nan/figures';
import {lathe, PRANG} from '../engine/parts';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const FIELD: P2 = [0, -4];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const GOLD = '#d98a2b';
const BRICK = '#9a5a3c';
const LIME = '#e8e0cc';

// Phra Pathom Chedi, height 1 (120.45 m): the bell's base is 56.6 m across (r 0.235), the bell is
// broad and low, then the harmika, the ringed spire and the crown
const BELL: [number, number][] = [
  [0, 0.06], [0.25, 0.06], [0.25, 0.075], [0.235, 0.08], [0.236, 0.12], [0.228, 0.17], [0.21, 0.22],
  [0.18, 0.27], [0.14, 0.315], [0.09, 0.35], [0.05, 0.37], [0, 0.375],
];
const SPIRE: [number, number][] = [
  [0, 0.43], [0.06, 0.43], [0.055, 0.47], [0.048, 0.47], [0.046, 0.53], [0.04, 0.53], [0.038, 0.6],
  [0.032, 0.6], [0.03, 0.67], [0.025, 0.67], [0.023, 0.74], [0.018, 0.74], [0.016, 0.82], [0.011, 0.82],
  [0.009, 0.9], [0.004, 0.93], [0, 0.93],
];
const CROWN: [number, number][] = [[0, 0.93], [0.012, 0.935], [0.008, 0.965], [0.004, 0.99], [0, 1]];
// the old Dvaravati stupa (an upturned bowl) carrying a later prang, about a third of the height
const BOWL: [number, number][] = [
  [0, 0], [0.16, 0], [0.16, 0.03], [0.15, 0.04], [0.155, 0.08], [0.14, 0.12], [0.11, 0.155], [0.06, 0.175], [0, 0.18],
];

/** a band of the bell's profile between y0 and y1 (the tier that rises in its turn) */
const band = (y0: number, y1: number): [number, number][] => {
  const out: [number, number][] = [];
  const at = (y: number) => {
    for (let i = 1; i < BELL.length; i++) {
      const [r0, a] = BELL[i - 1];
      const [r1, b] = BELL[i];
      if (y >= a && y <= b && b > a) return r0 + ((y - a) / (b - a)) * (r1 - r0);
    }
    return 0;
  };
  out.push([at(y0), y0]);
  for (const [r, y] of BELL) if (y > y0 && y < y1) out.push([r, y]);
  out.push([at(y1), y1]);
  return out;
};

const TIERS = 7;
const TIER_Y = Array.from({length: TIERS + 1}, (_, i) => 0.06 + (i / TIERS) * (0.375 - 0.06));

/** the encasing: tier i rises out of the ground ring and locks in place; gated on its own scale */
const NewChedi: React.FC<{t: number; H: number}> = ({t, H}) => {
  const geos = useMemo(() => TIER_Y.slice(0, -1).map((y, i) => lathe(band(y, TIER_Y[i + 1]), 64)), []);
  const spire = useMemo(() => lathe(SPIRE, 32), []);
  const crown = useMemo(() => lathe(CROWN, 24), []);
  const harmika = 0.43 - 0.375;
  // already under way at frame 0: two tiers up; one tier every 0.13 s
  const tierAt = (i: number) => clamp01((t + 0.26 - i * 0.13) / 0.16);
  const sp = clamp01((t - 0.95) / 0.5);
  const cr = clamp01((t - 1.4) / 0.2);
  return (
    <group scale={H}>
      {geos.map((g, i) => {
        const k = smooth(tierAt(i));
        if (k <= 0.02) return null;
        // each tier slides up from the tier below and settles
        const dy = (1 - k) * -(TIER_Y[i + 1] - TIER_Y[i]) * 1.2;
        return (
          <mesh key={i} geometry={g} position={[0, dy, 0]} scale={[1, k, 1]} castShadow receiveShadow>
            <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.25} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {sp > 0.02 && (
        <group scale={[1, sp, 1]}>
          <mesh position={[0, 0.375 + harmika / 2, 0]} castShadow>
            <boxGeometry args={[0.13, harmika, 0.13]} />
            <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.25} />
          </mesh>
          <mesh geometry={spire} castShadow>
            <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.25} />
          </mesh>
        </group>
      )}
      {cr > 0.02 && (
        <mesh geometry={crown} scale={[1, cr, 1]}>
          <meshBasicMaterial color="#ffd66b" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

/** the old stupa that the new chedi swallows */
const OldChedi: React.FC<{H: number}> = ({H}) => {
  const bowl = useMemo(() => lathe(BOWL, 32), []);
  const prang = useMemo(() => lathe(PRANG, 12), []);
  return (
    <group scale={H}>
      <mesh geometry={bowl} position={[0, 0.06, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={BRICK} roughness={0.95} />
      </mesh>
      <mesh geometry={prang} position={[0, 0.24, 0]} scale={0.045} castShadow>
        <meshStandardMaterial color={BRICK} roughness={0.95} />
      </mesh>
    </group>
  );
};

/** the terrace the chedi stands on: a round base, and in A2 the round cloister and the square terrace */
const Terrace: React.FC<{H: number; full: boolean}> = ({H, full}) => (
  <group scale={H}>
    <mesh position={[0, 0.03, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[0.34, 0.36, 0.06, 64]} />
      <meshStandardMaterial color={LIME} roughness={0.9} />
    </mesh>
    {full && (
      <>
        <mesh position={[0, 0.0125, 0]} receiveShadow>
          <boxGeometry args={[1.85, 0.025, 1.85]} />
          <meshStandardMaterial color="#cfc6b0" roughness={0.95} />
        </mesh>
        {/* the round cloister: a low wall with a red roof */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.745, 0.745, 0.05, 96, 1, true]} />
          <meshStandardMaterial color={LIME} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.066, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.715, 0.775, 96]} />
          <meshStandardMaterial color="#b8442f" roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        {/* the four viharns at the cardinal points */}
        {[0, 1, 2, 3].map((q) => (
          <group key={q} rotation-y={(q * Math.PI) / 2}>
            <mesh position={[0, 0.07, 0.42]} castShadow>
              <boxGeometry args={[0.16, 0.09, 0.1]} />
              <meshStandardMaterial color={LIME} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.135, 0.42]} rotation-z={Math.PI / 4} scale={[1, 1, 1]} castShadow>
              <boxGeometry args={[0.09, 0.09, 0.11]} />
              <meshStandardMaterial color="#b8442f" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </>
    )}
  </group>
);

const Builders: React.FC<{t: number; R: number; s: number}> = ({t, R, s}) => (
  <>
    {Array.from({length: 18}, (_, i) => {
      const a = (i / 18) * Math.PI * 2;
      return (
        <group key={i} position={[Math.cos(a) * R, 0, Math.sin(a) * R]} rotation-y={-a - Math.PI / 2} scale={s}>
          <Walker step={t * 0.6 + i * 0.37} i={i} />
        </group>
      );
    })}
  </>
);

const ChediHero: React.FC<{t: number; H: number; full: boolean}> = ({t, H, full}) => (
  <group position={[FIELD[0], 0, FIELD[1]]}>
    <Terrace H={H} full={full} />
    <OldChedi H={H} />
    <NewChedi t={t} H={H} />
    <Builders t={t} R={H * (full ? 0.52 : 0.4)} s={H * 0.02} />
  </group>
);

// B: the Dharmachakra (Wheel of the Law) on its pillar; the wheel is ~16 units across
const Wheel: React.FC = () => {
  const spokes = 16;
  return (
    <group>
      <mesh>
        <torusGeometry args={[1, 0.09, 12, 64]} />
        <meshStandardMaterial color="#8f8572" roughness={0.95} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.82, 0.04, 8, 64]} />
        <meshStandardMaterial color="#7d7462" roughness={0.95} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 24]} />
        <meshStandardMaterial color="#7d7462" roughness={0.95} />
      </mesh>
      {Array.from({length: spokes}, (_, i) => (
        <mesh key={i} rotation-z={(i / spokes) * Math.PI * 2} position={[0, 0, 0]}>
          <boxGeometry args={[0.05, 1.8, 0.07]} />
          <meshStandardMaterial color="#857b68" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
};

const WheelHero: React.FC<{t: number; R: number}> = ({t, R}) => {
  // already rolling in from the west at frame 0; reaches the pillar at 1.0 s, tips up onto it by 1.5 s
  const roll = smooth(clamp01((t + 0.35) / 1.35));
  const x = (1 - roll) * -42;
  const lift = smooth(clamp01((t - 1.0) / 0.5));
  const pillarH = R * 0.9;
  const y = R + lift * pillarH;
  const spin = -x / R;
  return (
    <group position={[FIELD[0], 0, FIELD[1]]}>
      <OldChedi H={R * 1.4} />
      <group position={[R * 1.6, 0, R * 0.4]}>
        <mesh position={[0, pillarH / 2, 0]} castShadow>
          <cylinderGeometry args={[R * 0.1, R * 0.12, pillarH, 12]} />
          <meshStandardMaterial color="#8f8572" roughness={0.95} />
        </mesh>
        <group position={[x, y, 0]} scale={R}>
          <group rotation-z={spin}>
            <Wheel />
          </group>
        </group>
        {/* the crouching deer */}
        {lift > 0.02 && (
          <group position={[R * 0.5, 0, R * 0.6]} scale={R * 0.25 * lift}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[1.2, 0.5, 0.5]} />
              <meshStandardMaterial color="#8f8572" roughness={0.95} />
            </mesh>
            <mesh position={[0.55, 0.8, 0]} castShadow>
              <boxGeometry args={[0.3, 0.5, 0.3]} />
              <meshStandardMaterial color="#8f8572" roughness={0.95} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

const AZ = 6;
const keys = (h: number, d: [number, number, number]) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1853, 1853.4],
        camera: [
          [0, FIELD[0], h, FIELD[1], d[0], AZ, 28, 30],
          [3, FIELD[0], h * 1.05, FIELD[1], d[1], AZ + 8, 30, 30],
          [8, FIELD[0], h * 1.1, FIELD[1], d[2], AZ + 18, 33, 30],
        ],
      },
    ],
  });

const base = (id: string, L: React.FC<LandmarkProps>, h: number, d: [number, number, number], clear: number): CityConfig => {
  const STORY = keys(h, d);
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'นครปฐม', sub: 'เมืองพระปฐมเจดีย์'},
      finale: KORAT.story.finale,
      approxBefore: 1500,
    },
    layout: {
      ...KORAT.layout,
      peaks: [],
      rivers: [],
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

const A1: React.FC<LandmarkProps> = ({t}) => <ChediHero t={t} H={52} full={false} />;
const A2: React.FC<LandmarkProps> = ({t}) => <ChediHero t={t} H={38} full />;
const B: React.FC<LandmarkProps> = ({t}) => <WheelHero t={t} R={13} />;

export const NKP_A1 = base('nakhonpathom-a1', A1, 26, [310, 320, 350], 20);
export const NKP_A2 = base('nakhonpathom-a2', A2, 12, [260, 270, 305], 22);
export const NKP_B = base('nakhonpathom-b', B, 14, [290, 300, 330], 22);
