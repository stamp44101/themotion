// Throwaway style frames for Saraburi's cover (1 Nov 2026; docs/briefs/saraburi.md). A: the
// chronicle's wounded deer (เนื้อ) bursts out of the forest under Khao Suwan Banphot already in
// mid-leap at frame 0, pulls up at the Footprint by 1 s and drinks; the water flares gold at 1.2 s,
// rings run out over the slab and the arrow wound closes by 2 s; it lifts its head and bounds away
// up the hill while hunter Bun runs in behind and kneels. A1 legend scale (12 units at the
// shoulder) on the whole tile; A2 smaller (8) and closer. B: the flower-alms payoff look, yellow
// ดอกเข้าพรรษา sprays bursting open over the slab and monks walking up to it. The hill and the Pa
// Sak are placeholders (the hill drawn in the tile's NW as the far place, the river across the
// south) until [local]'s centreline lands.
import React from 'react';
import {KORAT} from '../cities/korat';
import {Deer, Footprint, GlobbaSpray, Hunter, LightRings, Monk} from '../cities/saraburi/figures';
import {Burst} from '../cities/phetchabun/buddha';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const RIVER: P2[] = [[46, -20], [30, -5], [18, 8], [4, 14], [-14, 17], [-32, 22], [-50, 24]];
const SLAB: P2 = [12, -12];
const PEAKS: [number, number, number, number][] = [
  [8, -25, 14, 8],
  [-5, -21, 10, 7],
  [20, -30, 9, 7],
];

const clamp = (u: number) => Math.max(0, Math.min(1, u));
const ease = (u: number) => {
  const c = clamp(u);
  return c * c * (3 - 2 * c);
};

const HeroA: React.FC<{t: number; D: number; terrainH: LandmarkProps['terrainH']}> = ({t, D, terrainH}) => {
  const L = 1.25 * D; // the print, legend scale like the deer
  const heelX = SLAB[0] - 0.42 * L;
  // drinking, the muzzle is ~0.85 D ahead of the deer's centre: put it over the heel's water
  const stopX = heelX + 0.12 * L - 0.85 * D;
  // run in (already mid-leap at frame 0), stop at the heel by 1.0 s
  const run = clamp(t / 1.0);
  const xRun = stopX - 1.2 * D * (1 - ease(run * 0.6 + 0.4 * run * run));
  const leave = clamp((t - 2.15) / 1.6);
  const turn = ease((t - 2.0) / 0.4) * (Math.PI / 2);
  const gait = t < 1.0 ? 1 - 0.7 * ease((t - 0.7) / 0.3) : leave > 0 ? Math.min(1, leave * 3) : 0;
  const step = t * 11;
  const drink = ease((t - 0.95) / 0.3) * (1 - ease((t - 1.85) / 0.3));
  const wound = 1 - ease((t - 1.3) / 0.7);
  const glow = ease((t - 1.15) / 0.35) * (1 - 0.4 * ease((t - 2.4) / 1.5));
  const dx = t < 2.15 ? xRun : stopX;
  const dz = SLAB[1] - leave * 2.6 * D * leave;
  const bob = Math.abs(Math.sin(step)) * 0.22 * D * gait;
  const hx = SLAB[0] - 4.0 * D + Math.min(t / 2.4, 1) * (4.0 * D - 0.42 * L - 1.6 * D);
  const hz = SLAB[1] - 0.9 * D;
  const kneel = ease((t - 2.4) / 0.4);
  return (
    <>
      <group position={[SLAB[0], terrainH(SLAB[0], SLAB[1]) - 0.1 * D, SLAB[1]]} scale={[L, L * 0.8, L]}>
        <Footprint glow={glow} />
        <LightRings t={t} t0={1.2} r={0.55} />
        <group position={[-0.3, 0.15, 0]}>
          <Burst u={(t - 1.15) / 1.5} r={0.35} />
        </group>
      </group>
      <group position={[dx, terrainH(dx, dz) + bob, dz]} rotation-y={turn} scale={D}>
        <Deer step={step} gait={gait} drink={drink} wound={wound} />
      </group>
      <group position={[hx, terrainH(hx, hz), hz]} scale={1.4 * D}>
        <Hunter step={t * 9} run={1 - kneel} kneel={kneel} />
      </group>
    </>
  );
};

const HeroB: React.FC<{t: number; D: number; terrainH: LandmarkProps['terrainH']}> = ({t, D, terrainH}) => {
  const L = 1.5 * D;
  const sprays: [number, number, number, number][] = [
    [-0.9, -0.7, 1.1, 0.3], [0.2, -1.0, 1.3, 1.4], [1.1, -0.5, 1.0, 2.2], [-1.4, 0.2, 0.9, 3.1],
    [1.5, 0.4, 0.85, 4.0], [-0.4, -1.5, 1.2, 4.7], [0.8, -1.6, 0.95, 5.3],
  ];
  return (
    <>
      <group position={[SLAB[0], terrainH(SLAB[0], SLAB[1]) - 0.1 * D, SLAB[1]]} scale={[L, L * 0.8, L]}>
        <Footprint glow={0.6} />
      </group>
      {sprays.map(([ox, oz, s, seed], i) => {
        const x = SLAB[0] + ox * L;
        const z = SLAB[1] + oz * L;
        const open = 0.35 + ease((t - i * 0.12) / 1.3) * 0.65;
        return (
          <group key={i} position={[x, terrainH(x, z), z]} rotation-y={seed} scale={1.3 * D * s}>
            <GlobbaSpray open={open} seed={seed} />
          </group>
        );
      })}
      {Array.from({length: 9}, (_, i) => {
        // in single file along the north bank from the east, toward the print (never on the river)
        const x = SLAB[0] + 0.8 * L + i * 0.42 * D - t * 0.5 * D;
        const z = SLAB[1] + 0.45 * L;
        if (x > 30) return null; // still in the forest east of the clearing (and the river's bend)
        return (
          <group key={i} position={[x, terrainH(x, z), z]} rotation-y={Math.PI} scale={0.45 * D}>
            <Monk step={t * 6 + i} />
          </group>
        );
      })}
    </>
  );
};

const AZ = 14;
const keys = (y: number, d: [number, number, number], el: number) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1622, 1622.4],
        camera: [
          [0, SLAB[0], y, SLAB[1], d[0], AZ, el, 30],
          [3, SLAB[0], y * 1.05, SLAB[1], d[1], AZ + 8, el + 2, 30],
          [8, SLAB[0], y * 1.1, SLAB[1], d[2], AZ + 18, el + 5, 30],
        ],
      },
    ],
  });

const base = (id: string, Hero: typeof HeroA, D: number, d: [number, number, number], el: number): CityConfig => {
  const STORY = keys(D * 0.9, d, el);
  const L: React.FC<LandmarkProps> = ({t, terrainH}) => <Hero t={t} D={D} terrainH={terrainH} />;
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สระบุรี', sub: 'เมืองพระพุทธบาท ริมป่าสัก'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      peaks: PEAKS,
      rivers: [{path: RIVER, width: 1.2}],
      bridges: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      clearings: [[SLAB[0] - D, SLAB[1], 3.2 * D, -1e9]],
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

export const SARABURI_A1 = base('saraburi-a1', HeroA, 14, [310, 320, 350], 24);
export const SARABURI_A2 = base('saraburi-a2', HeroA, 9, [220, 230, 260], 24);
export const SARABURI_B = base('saraburi-b', HeroB, 10, [270, 280, 310], 26);
