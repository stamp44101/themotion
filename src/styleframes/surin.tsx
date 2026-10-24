// Throwaway style frames for Surin's opening hero (docs/briefs/surin_research_gemini.md §2):
// A, a wild herd crossing the whole tile; B, Kuy elephant men on tame elephants running down
// a wild tusker with the lasso pole and the rawhide rope (โพนช้าง); C, the white elephant that
// broke out of Ayutthaya in 2302, chased by the five Kuy headmen. All three move from frame 0.
// Geography is provisional: a forest plain with the Huai Sanaeng drawn as one stream.
import React from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import {GREY_DARK, KuyRider, NECK, SurinElephant, WHITE_ELEPHANT, WHITE_SHADE} from '../cities/surin/figures';
import type {CityConfig, LandmarkProps} from '../engine/types';

const STORY = buildStory({
  duration: 60,
  before: -2000,
  after: 2026,
  camera: [],
  beats: [
    {
      id: 'open',
      t: [0, 8],
      year: [500, 501],
      camera: [
        // frame 0 is the whole floating tile with its soil edge, then a push in on the animals
        [0, 0, 2, 2, 430, 165, 38, 30],
        [3, -2, 3, 1, 190, 166, 32, 30],
        [8, -2, 3, -3, 100, 168, 30, 30],
      ],
    },
  ],
});

const STREAM: [number, number][] = [[-48, 20], [-24, 16], [-6, 22], [10, 18], [30, 24], [48, 21]];

// the line the animals run along: in from the south-east, out to the north-west, toward the
// camera's side of the tile
const FROM: [number, number] = [5, 9];
const TO: [number, number] = [-5, -9];
const HEAD = Math.atan2(TO[0] - FROM[0], TO[1] - FROM[1]);
const along = (d: number, side: number): [number, number] => {
  const L = Math.hypot(TO[0] - FROM[0], TO[1] - FROM[1]);
  const ux = (TO[0] - FROM[0]) / L;
  const uz = (TO[1] - FROM[1]) / L;
  return [FROM[0] + ux * d - uz * side, FROM[1] + uz * d + ux * side];
};

const Dust: React.FC<{t: number; x: number; z: number; y: number; s: number}> = ({t, x, z, y, s}) => (
  <>
    {[0, 1, 2, 3].map((i) => {
      const k = (t * 1.6 + i / 4) % 1;
      return (
        <mesh key={i} position={[x + Math.sin(i * 2.1) * s * 0.4, y + 0.3 + k * s * 0.5, z + Math.cos(i * 1.7) * s * 0.4]} scale={s * (0.25 + k * 0.45)}>
          <sphereGeometry args={[1, 7, 5]} />
          <meshStandardMaterial color="#cdb48c" transparent opacity={0.45 * (1 - k)} depthWrite={false} />
        </mesh>
      );
    })}
  </>
);

type Beast = {d: number; side: number; s: number; speed: number; ph: number; color?: string; shade?: string; tusks?: boolean; rider?: boolean; pole?: boolean};
const Animal: React.FC<{b: Beast; t: number; g: (x: number, z: number) => number; run?: boolean}> = ({b, t, g, run}) => {
  const [x, z] = along(b.d + t * b.speed, b.side);
  const y = g(x, z);
  const walk = t * (run ? 1.25 : 0.55) + b.ph;
  return (
    <>
      <group position={[x, y, z]} rotation-y={HEAD} scale={b.s}>
        <SurinElephant walk={walk} stride={run ? 1.2 : 1} trunk={run ? -0.4 : 0.3} ears={run ? 0.35 : 0} color={b.color} shade={b.shade} tusks={b.tusks} t={t + b.ph} />
        {b.rider && (
          <group position={NECK} scale={0.95}>
            <KuyRider pole={b.pole} swing={Math.sin(t * 2.4 + b.ph)} />
          </group>
        )}
      </group>
      {run && <Dust t={t + b.ph} x={x - Math.sin(HEAD) * b.s * 1.2} z={z - Math.cos(HEAD) * b.s * 1.2} y={y} s={b.s} />}
    </>
  );
};

// ------------------------------------------------------------------ A: the wild herd
const HERD: Beast[] = [
  {d: 0, side: 0, s: 3.3, speed: 0.9, ph: 0, tusks: true},
  {d: -6, side: -4.5, s: 2.9, speed: 0.9, ph: 0.3, tusks: false},
  {d: -7.5, side: 3.8, s: 2.8, speed: 0.9, ph: 0.6, tusks: false},
  {d: -4.2, side: -1.6, s: 1.5, speed: 0.9, ph: 0.15, tusks: false},
  {d: -12, side: 0.5, s: 2.7, speed: 0.9, ph: 0.45, tusks: true},
  {d: -13, side: -5, s: 1.4, speed: 0.9, ph: 0.8, tusks: false},
];
const HerdHero: React.FC<LandmarkProps> = ({t, terrainH}) => (
  <>
    {HERD.map((b, i) => (
      <Animal key={i} b={b} t={t} g={terrainH} />
    ))}
  </>
);

// ------------------------------------------------------------------ B: โพนช้าง, the lasso
const WILD: Beast = {d: 6, side: 0, s: 3.3, speed: 1.5, ph: 0, tusks: true};
const CHASERS: Beast[] = [
  {d: 0.5, side: -4.6, s: 2.7, speed: 1.5, ph: 0.4, tusks: true, rider: true, pole: true, color: GREY_DARK},
  {d: -1.5, side: 4.4, s: 2.7, speed: 1.5, ph: 0.7, tusks: false, rider: true, pole: true, color: GREY_DARK},
];
/** A sagging rope between two world points. */
const Rope: React.FC<{a: THREE.Vector3; b: THREE.Vector3; sag: number}> = ({a, b, sag}) => {
  const mid = a.clone().lerp(b, 0.5);
  mid.y -= sag;
  const curve = new THREE.CatmullRomCurve3([a, mid, b]);
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 20, 0.07, 5, false]} />
      <meshStandardMaterial color="#5a3a20" roughness={1} />
    </mesh>
  );
};
const LassoHero: React.FC<LandmarkProps> = ({t, terrainH}) => {
  const [wx, wz] = along(WILD.d + t * WILD.speed, WILD.side);
  // the hind left foot of the wild tusker, where the noose takes hold
  const foot = new THREE.Vector3(-0.42, 0.2, -0.72).multiplyScalar(WILD.s).applyAxisAngle(new THREE.Vector3(0, 1, 0), HEAD).add(new THREE.Vector3(wx, terrainH(wx, wz), wz));
  const ropes = CHASERS.map((c) => {
    const [cx, cz] = along(c.d + t * c.speed, c.side);
    // the pole tip, ahead of and above the rider
    const tip = new THREE.Vector3(0.4, NECK[1] + 1.6, NECK[2] + 2.2).multiplyScalar(c.s).applyAxisAngle(new THREE.Vector3(0, 1, 0), HEAD).add(new THREE.Vector3(cx, terrainH(cx, cz), cz));
    return tip;
  });
  // the first rope is cast at 1.5 s and pulls tight by 3 s
  const k = Math.min(1, Math.max(0, (t - 1.5) / 1.5));
  return (
    <>
      <Animal b={WILD} t={t} g={terrainH} run />
      {CHASERS.map((b, i) => (
        <Animal key={i} b={b} t={t} g={terrainH} run />
      ))}
      {k > 0 && <Rope a={ropes[0]} b={ropes[0].clone().lerp(foot, k)} sag={1.5 * (1 - k) + 0.3} />}
      {t > 3.5 && <Rope a={ropes[1]} b={ropes[1].clone().lerp(foot, Math.min(1, (t - 3.5) / 1.5))} sag={0.8} />}
    </>
  );
};

// ------------------------------------------------------------------ C: the white elephant, 2302
const WHITE: Beast = {d: 7, side: 0, s: 3.4, speed: 1.4, ph: 0, tusks: true, color: WHITE_ELEPHANT, shade: WHITE_SHADE};
const HEADMEN: Beast[] = [-6, -3, 0, 3, 6].map((side, i) => ({
  d: -2 - Math.abs(side) * 0.6,
  side,
  s: 2.4,
  speed: 1.4,
  ph: i * 0.23,
  tusks: i % 2 === 0,
  rider: true,
  pole: true,
  color: GREY_DARK,
}));
const WhiteHero: React.FC<LandmarkProps> = ({t, terrainH}) => (
  <>
    <Animal b={WHITE} t={t} g={terrainH} run />
    {HEADMEN.map((b, i) => (
      <Animal key={i} b={b} t={t} g={terrainH} run />
    ))}
  </>
);

const base = (id: string, Landmarks: React.FC<LandmarkProps>): CityConfig => ({
  ...KORAT,
  id,
  story: {
    captions: [],
    eras: [],
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สุรินทร์', sub: 'ถิ่นช้างใหญ่ แผ่นดินกูย เขมร ลาว'},
    finale: KORAT.story.finale,
    approxBefore: 1650,
  },
  layout: {
    ...KORAT.layout,
    peaks: [],
    rivers: [{path: STREAM, width: 1.6}],
    bridges: [],
    noMoat: true,
    noWall: true,
    rail: undefined,
    trains: [],
    // the open grassland the animals cross, so they are not lost in the canopy
    clearings: [[1, 1, 17, -1e9]],
    sites: [],
    openGround: [],
    roads: [],
    towers: [],
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks,
  callouts: [],
  actors: [],
  gloom: () => 0,
});

export const SURIN_HERD = base('surin-herd', HerdHero);
export const SURIN_LASSO = base('surin-lasso', LassoHero);
export const SURIN_WHITE = base('surin-white', WhiteHero);
