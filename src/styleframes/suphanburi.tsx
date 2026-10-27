// Throwaway style frames for Suphanburi's cover, A (owner, 27 Oct 2026; docs/briefs/suphanburi.md §4):
// the ยุทธหัตถี. Two war elephants are already mid-charge at frame 0 (the cover is an event), meet
// tusk to tusk at 0.55 s in a burst of dust and a golden flash where the glaives cross; the Siamese
// elephant drives the other aside, and the Don Chedi stupa rises on the field behind. Nobody is
// struck, nobody falls. Legend scale on the whole tile (owner: the cover must show the land, with a
// giant on it): A1 elephants 8x (~26 units tall), A2 6x, the camera far enough to show the tile.
import React, {useMemo} from 'react';
import {KORAT} from '../cities/korat';
import {Walker} from '../cities/nan/figures';
import {lathe} from '../engine/parts';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {Dust, Flash, SIDES, WarElephant} from './suphanburiElephant';

type P2 = [number, number];
// the field (a corner of the tile, as Don Chedi will be in the city build)
const FIELD: P2 = [0, -4];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const IMPACT = 0.55;
/** both elephants' centres along x (Siam from -x, Hongsawadi from +x) and Hongsawadi's turn */
const duel = (t: number, S: number) => {
  const gap0 = 3.0 * S; // centre to the field's middle at frame 0
  const meet = 1.9 * S; // centre to the middle when the tusks meet
  const charge = clamp01(t / IMPACT);
  const c = gap0 + (meet - gap0) * charge;
  // after the impact the Siamese elephant drives forward and the other gives way, turning aside
  const push = smooth(clamp01((t - IMPACT) / 2.0)) * 1.1 * S;
  const turn = smooth(clamp01((t - IMPACT - 0.3) / 1.8)) * 0.75;
  const recoil = Math.sin(clamp01((t - IMPACT) / 0.35) * Math.PI) * 0.25 * S;
  return {siam: -c + push - recoil * 0.4, hongsa: c + push + recoil, turn, charging: t < IMPACT + 0.1};
};

// a Lanka bell stupa (Don Chedi's), height 1
const BELL: [number, number][] = [
  [0, 0], [0.42, 0], [0.42, 0.06], [0.36, 0.06], [0.36, 0.12], [0.3, 0.12], [0.3, 0.17], [0.27, 0.19], [0.3, 0.26],
  [0.29, 0.36], [0.24, 0.44], [0.15, 0.49], [0.11, 0.5], [0.11, 0.56], [0.075, 0.56], [0.07, 0.62], [0.05, 0.75],
  [0.03, 0.88], [0.012, 0.97], [0, 1],
];
const Stupa: React.FC<{k: number; H: number}> = ({k, H}) => {
  const geo = useMemo(() => lathe(BELL, 28), []);
  if (k < 0.02) return null;
  return (
    <group scale={[H, H * k, H]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color="#f1ece0" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.8, 0]} scale={[0.07, 0.21, 0.07]}>
        <cylinderGeometry args={[0.3, 1, 1, 12]} />
        <meshStandardMaterial color="#d9a43a" metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
};

/** two bodies of troops with flags behind each elephant, standing */
const Troops: React.FC<{t: number; S: number}> = ({t, S}) => (
  <>
    {[-1, 1].map((side) =>
      Array.from({length: 4}, (_, r) =>
        Array.from({length: 7}, (_, c) => {
          const u = 0.3 * S;
          const x = side * (3.9 * S + r * u);
          const z = -1.6 * S + c * u - (r % 2) * u * 0.5;
          return (
            <group key={`${side}-${r}-${c}`} position={[x, 0, z]} rotation-y={-side * Math.PI / 2} scale={0.16 * S}>
              <Walker step={t * 0.2 + c} i={r + c + (side > 0 ? 3 : 0)} spear still />
            </group>
          );
        }),
      ),
    )}
  </>
);

const Hero: React.FC<{t: number; S: number}> = ({t, S}) => {
  const d = duel(t, S);
  const gait = t * (d.charging ? 1.5 : 0.6);
  const stride = d.charging ? 1 : Math.max(0.2, 1 - (t - IMPACT) / 1.5);
  // the glaives are levelled as they close, raised again after the clash
  const swing = clamp01(t / IMPACT) * (1 - smooth(clamp01((t - IMPACT - 0.4) / 1.2)) * 0.7);
  const flashU = (t - IMPACT + 0.05) / 0.85;
  return (
    <group position={[FIELD[0], 0, FIELD[1]]}>
      {/* the trampled ground of the field */}
      <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[4.2 * S, 48]} />
        <meshStandardMaterial color="#c8b07c" roughness={1} />
      </mesh>
      <group position={[d.siam, 0, 0]} rotation-y={Math.PI / 2} scale={S}>
        <WarElephant walk={gait} stride={stride} t={t} side={SIDES.siam} swing={swing} trunk={-0.7} />
      </group>
      <group position={[d.hongsa, 0, 0]} rotation-y={-Math.PI / 2 + d.turn} scale={S}>
        <WarElephant walk={gait + 0.5} stride={stride} t={t + 0.7} side={SIDES.hongsa} swing={swing * 0.9} trunk={-0.5} />
      </group>
      {/* dust kicked up behind the charge, and the burst at the meeting */}
      {Array.from({length: 10}, (_, i) => {
        const tt = (t + i * 0.13) % 1.3;
        const u = tt / 1.3;
        const back = (i % 2 ? 1 : -1) * (3.6 * S + (i % 5) * 0.4 * S) * (1 - 0.5 * clamp01(t / IMPACT));
        return (
          <group key={i} position={[back * (1 - u * 0.2), 0, (i % 3 - 1) * 0.6 * S]}>
            <Dust u={d.charging || t < 2.5 ? u : 0} r={0.45 * S} />
          </group>
        );
      })}
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const u = (t - IMPACT) / 1.6;
        return (
          <group key={`b${i}`} position={[Math.cos(a) * u * 1.6 * S, 0, Math.sin(a) * u * 1.0 * S]}>
            <Dust u={u} r={0.85 * S} />
          </group>
        );
      })}
      <group position={[(d.siam + d.hongsa) / 2, 3.7 * S, 0]}>
        <Flash u={flashU} r={1.1 * S} />
      </group>
      {/* the stupa rises on the field behind, after the clash */}
      <group position={[0, 0, -3.0 * S]}>
        <Stupa k={smooth(clamp01((t - 2.6) / 1.8))} H={3.4 * S} />
      </group>
      <Troops t={t} S={S} />
    </group>
  );
};

const AZ = 6;
const keys = (S: number, d: [number, number, number]) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        // 18 Jan 2135 BE is January 1593 CE, before the old Thai new year: the counter shows CE + 543
        year: [1592, 1592.4],
        camera: [
          // the cover sees the whole tile with the giants standing on it (owner: the land must show)
          [0, FIELD[0], 1.6 * S, FIELD[1], d[0], AZ, 27, 30],
          [3, FIELD[0], 1.8 * S, FIELD[1] - 0.5 * S, d[1], AZ + 8, 29, 30],
          [8, FIELD[0], 2.0 * S, FIELD[1] - 1 * S, d[2], AZ + 18, 32, 30],
        ],
      },
    ],
  });

const base = (id: string, S: number, d: [number, number, number]): CityConfig => {
  const STORY = keys(S, d);
  const L: React.FC<LandmarkProps> = ({t}) => <Hero t={t} S={S} />;
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สุพรรณบุรี', sub: 'เมืองยุทธหัตถี'},
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
      clearings: [[FIELD[0], FIELD[1], 4.6 * S, -1e9]],
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

export const SUPHANBURI_A1 = base('suphanburi-a1', 8, [290, 305, 345]);
export const SUPHANBURI_A2 = base('suphanburi-a2', 6, [235, 250, 290]);
