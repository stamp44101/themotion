// Throwaway style frames for Surat Thani's cover (2 Nov 2026; docs/briefs/suratthani.md).
// A: the coconut monkey. A legend-scale ลิงกัง is already halfway up a coconut palm on the west bank
// of the Tapi mouth at frame 0, climbing hand over hand; it reaches the crown by 1.1 s, spins a
// coconut free (1.1-1.9 s) and drops it; the coconut splashes into the river at ~2.4 s while the
// handler on the bank leans back on the rope. A1 legend scale (palm 34 units) on the whole tile; A2
// smaller and closer. B: the school rambutan: a giant tree springs up on the bank and its fruit
// flush from green to red, one giant rambutan rolling out in front. River and bay are placeholders
// until [local]'s map lands.
import React from 'react';
import {KORAT} from '../cities/korat';
import {Ball, ClimbingMonkey, CoconutPalm, Handler, NUT, Rambutan, RambutanTree, Seg, Splash, trunkAt} from '../cities/suratthani/figures';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const TAPI: P2[] = [[-30, 46], [-18, 28], [-6, 12], [2, -4], [5, -18], [6, -32]];
const BASE: P2 = [-0.5, -13];

const clamp = (u: number) => Math.max(0, Math.min(1, u));
const ease = (u: number) => {
  const c = clamp(u);
  return c * c * (3 - 2 * c);
};

const HeroA: React.FC<{t: number; H: number; terrainH: LandmarkProps['terrainH']}> = ({t, H, terrainH}) => {
  const y0 = terrainH(BASE[0], BASE[1]);
  const M = 0.3 * H; // the monkey, legend scale
  // climb: halfway up at frame 0, at the crown by 1.1 s (eased in the last 0.3 s)
  const u = t < 1.1 ? 0.42 + (0.86 - 0.42) * (t / 1.1 - 0.25 * ease((t - 0.8) / 0.3) * ((t - 0.8) / 1.1)) : 0.86;
  const climbing = t < 1.1 ? 1 : 0;
  const tp = trunkAt(u);
  const tp2 = trunkAt(Math.min(1, u + 0.02));
  const tilt = -Math.atan2(tp2[0] - tp[0], tp2[1] - tp[1]);
  const twist = ease((t - 1.0) / 0.25) * (1 - ease((t - 1.95) / 0.3));
  const look = ease((t - 1.9) / 0.3) * -0.9;
  // the coconut: spun at the crown, then free fall into the river
  const crown = trunkAt(1);
  const nut0: [number, number, number] = [BASE[0] + crown[0] * H + 0.6, y0 + crown[1] * H - 0.07 * H, BASE[1] + 0.05 * H];
  const tf = t - 1.9;
  const fall = 2 * (nut0[1] - 0.2) / (0.55 * 0.55);
  const nutY = tf > 0 ? Math.max(0.2, nut0[1] - 0.5 * fall * tf * tf) : nut0[1];
  const nutX = nut0[0] + Math.max(0, tf) * 3;
  const landed = tf > 0.55;
  const spin = t > 1.1 ? (Math.min(t, 1.9) - 1.1) * 22 + Math.max(0, tf) * 6 : 0;
  const hx = BASE[0] - 0.22 * H;
  const hz = BASE[1] + 0.1 * H;
  const monk: [number, number, number] = [BASE[0] + tp[0] * H, y0 + tp[1] * H - 0.25 * M, BASE[1] + 0.045 * H];
  const pull = ease((t - 1.9) / 0.4);
  return (
    <>
      <group position={[BASE[0], y0, BASE[1]]} scale={H}>
        <CoconutPalm sway={Math.sin(t * 1.7)} nuts={5} />
      </group>
      <group position={monk} rotation-z={tilt}>
        <group rotation-y={Math.PI} scale={M}>
          <ClimbingMonkey climb={t * 13 * climbing + 0.6} look={look} twist={twist} />
        </group>
      </group>
      {!landed && (
        <group position={[nutX, nutY, nut0[2]]} rotation-y={spin} rotation-z={0.4}>
          <Ball p={[0, 0, 0]} s={[0.05 * H, 0.058 * H, 0.05 * H]} color={NUT} detail={1} />
        </group>
      )}
      <group position={[nut0[0] + 0.55 * 3, terrainH(nut0[0] + 1.6, nut0[2]) + 0.05, nut0[2]]} scale={0.22 * H}>
        <Splash u={(t - 2.45) / 1.1} />
      </group>
      <group position={[hx, terrainH(hx, hz), hz]} rotation-y={0.5} scale={0.3 * H}>
        <Handler pull={pull} step={t * 4} />
      </group>
      {/* the rope from the handler's hand to the collar */}
      <Seg a={[hx + 0.09 * H, terrainH(hx, hz) + 0.22 * H, hz]} b={[monk[0], monk[1] + 0.84 * M, monk[2] - 0.05 * M]} r0={0.07} r1={0.07} color="#e9dcb8" />
    </>
  );
};

const HeroB: React.FC<{t: number; H: number; terrainH: LandmarkProps['terrainH']}> = ({t, H, terrainH}) => {
  const y0 = terrainH(BASE[0], BASE[1]);
  const grow = 0.35 + 0.65 * ease(t / 1.0);
  const ripe = ease((t - 0.7) / 1.0);
  const rx = BASE[0] + 0.25 * H - ease((t - 1.6) / 1.0) * 0.1 * H;
  const rz = BASE[1] + 0.35 * H;
  return (
    <>
      <group position={[BASE[0], y0, BASE[1]]} scale={H}>
        <RambutanTree grow={grow} ripe={ripe} />
      </group>
      <group position={[rx, terrainH(rx, rz), rz]} rotation-x={ease((t - 1.6) / 1.0) * -2.2} scale={0.3 * H}>
        <Rambutan ripe={ripe} open={ease((t - 2.2) / 0.5)} />
      </group>
    </>
  );
};

const AZ = 330;
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
        year: [1850, 1850.4],
        camera: [
          [0, BASE[0] + 2, y, BASE[1] + 4, d[0], AZ, el, 30],
          [3, BASE[0] + 2, y * 1.05, BASE[1] + 4, d[1], AZ + 8, el + 2, 30],
          [8, BASE[0] + 2, y * 1.1, BASE[1] + 4, d[2], AZ + 18, el + 5, 30],
        ],
      },
    ],
  });

const base = (id: string, Hero: typeof HeroA, H: number, d: [number, number, number], el: number): CityConfig => {
  const STORY = keys(H * 0.45, d, el);
  const L: React.FC<LandmarkProps> = ({t, terrainH}) => <Hero t={t} H={H} terrainH={terrainH} />;
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สุราษฎร์ธานี', sub: 'เมืองคนดี ริมแม่น้ำตาปี'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      peaks: [[-34, -6, 6, 8], [-38, 16, 4.5, 7]],
      rivers: [{path: TAPI, width: 6}, {axis: 'x', pos: -46, width: 36}],
      bridges: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      clearings: [[BASE[0] - 3, BASE[1] + 3, 0.35 * H, -1e9]],
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

export const SURAT_A1 = base('surat-a1', HeroA, 34, [310, 320, 350], 22);
export const SURAT_A2 = base('surat-a2', HeroA, 24, [230, 240, 270], 22);
export const SURAT_B = base('surat-b', HeroB, 20, [290, 300, 330], 24);
