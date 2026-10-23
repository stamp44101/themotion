// Throwaway style frames for Lopburi's opening hero (docs/briefs/lopburi.md §4): the city legend
// made alive. Hanuman, white and giant, leaps in across the tile and lands beside พระปรางค์สามยอด,
// and a troop of ordinary macaques (his "descendants", ลูกศิษย์เจ้าพ่อพระกาฬ) runs and hops round
// the towers. Geography is provisional: แม่น้ำลพบุรี drawn straight down the west of the tile,
// the prang at hero scale until the pins and the ONEP polygon come in.
import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import {Hanuman, HanumanHead, Macaque, PrangSamYot, SittingMacaque, type Face} from '../cities/lopburi/figures';
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
      year: [-1500, -1499],
      camera: [
        // frame 0 shows the whole floating tile with its soil edge (Korat opened at 320), then
        // a slow push in to the landing
        [0, 2, 2, 0, 320, 140, 34, 30],
        [3, 4, 4, -2, 190, 148, 31, 30],
        [8, 6, 5, -3, 105, 160, 28, 30],
      ],
    },
  ],
});

const RIVER: [number, number][] = [[-14, -48], [-13, -20], [-12, 0], [-13, 20], [-14, 48]];

const LAND_T = 2.4; // Hanuman touches down
const LAND: [number, number] = [9, -4];
const START: [number, number, number] = [0, 9, 26];

const LopburiHero: React.FC<LandmarkProps> = ({t, terrainH}) => {
  // the leap: a parabola from the east edge of the tile to beside the prang
  const u = Math.min(1, t / LAND_T);
  const x = START[0] + (LAND[0] - START[0]) * u;
  const z = START[2] + (LAND[1] - START[2]) * u;
  const ground = terrainH(LAND[0], LAND[1]);
  const y = u < 1 ? START[1] * (1 - u) + 10 * Math.sin(Math.PI * u) * (1 - u) + ground : ground;
  const yaw = Math.atan2(LAND[0] - START[0], LAND[1] - START[2]);
  const flying = t < LAND_T - 0.15;
  // the troop: twenty macaques round the towers; they scatter as he lands, then run to him
  const troop = Array.from({length: 20}, (_, i) => {
    const a = (i / 20) * Math.PI * 2 + i * 0.37;
    const r = 6 + (i % 4) * 1.6;
    const run = t > LAND_T ? Math.min(1, (t - LAND_T) / 3) : 0;
    const ang = a + t * (0.35 + (i % 3) * 0.08) * (i % 2 ? 1 : -1) * (1 - run);
    let mx = Math.cos(ang) * r;
    let mz = Math.sin(ang) * r * 1.3;
    mx += (LAND[0] + Math.cos(a) * 3.2 - mx) * run;
    mz += (LAND[1] + Math.sin(a) * 3.2 - mz) * run;
    const dir = Math.atan2(-Math.sin(ang), Math.cos(ang)) * (i % 2 ? 1 : -1);
    return {mx, mz, dir, hop: Math.sin(t * 9 + i * 1.7), s: 2.1 + (i % 3) * 0.3};
  });
  return (
    <>
      <PrangSamYot y={terrainH(0, 0)} />
      <group position={[x, y, z]} rotation-y={yaw} scale={4.6}>
        <Hanuman leap={flying ? 1 : Math.max(0, 1 - (t - LAND_T + 0.15) * 4)} t={t} />
      </group>
      {troop.map((m, i) => (
        <group key={i} position={[m.mx, terrainH(m.mx, m.mz), m.mz]} rotation-y={m.dir} scale={m.s}>
          <Macaque hop={m.hop} />
        </group>
      ))}
      {[[2.4, 4.8], [-2.4, -4.6], [2.5, -1.2], [-2.3, 2.6]].map(([xx, zz], i) => (
        <group key={`b${i}`} position={[xx, terrainH(0, 0) + 0.8, zz]} rotation-y={xx > 0 ? 1.4 : -1.4} scale={1.9}>
          <SittingMacaque t={t * 1.2 + i * 2} />
        </group>
      ))}
      {/* three sit on the gallery roofs */}
      {[-1.8, 1.8, 0].map((zz, i) => (
        <group key={`s${i}`} position={[0.4, terrainH(0, 0) + (i < 2 ? 3.0 : 0.8), zz + (i === 2 ? 5.6 : 0)]} rotation-y={1.2} scale={1.9}>
          <SittingMacaque t={t + i} />
        </group>
      ))}
    </>
  );
};

export const LOPBURI_HANUMAN: CityConfig = {
  ...KORAT,
  id: 'lopburi-style',
  story: {
    captions: [],
    eras: [],
    yearAt: STORY.yearAt,
    beat: STORY.beat,
    beats: STORY.beats,
    intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ลพบุรี', sub: 'ละโว้ เมืองพระนารายณ์ ถิ่นหนุมาน'},
    finale: KORAT.story.finale,
    approxBefore: 1650,
  },
  layout: {
    ...KORAT.layout,
    peaks: [],
    rivers: [{path: RIVER, width: 2.2}],
    bridges: [],
    noMoat: true,
    noWall: true,
    rail: undefined,
    trains: [],
    // open ground round the prang and where he lands, so neither is lost in the canopy
    clearings: [
      [0, 0, 13, -1e9],
      [LAND[0], LAND[1], 8, -1e9],
    ],
    sites: [[0, 0, 7]],
    openGround: [],
    roads: [],
    towers: [],
    cameraKeys: STORY.cameraKeys,
  },
  Landmarks: LopburiHero,
  callouts: [],
  actors: [],
  gloom: () => 0,
};

// ------------------------------------------------------------------ the faces side by side
const FaceCam: React.FC<{az: number}> = ({az}) => {
  const {camera} = useThree();
  React.useLayoutEffect(() => {
    const a = (az * Math.PI) / 180;
    camera.position.set(Math.sin(a) * 7, 0.6, Math.cos(a) * 7);
    camera.lookAt(0, 0.25, 0);
    camera.updateProjectionMatrix();
  }, [az, camera]);
  return null;
};
export const HanumanFaces: React.FC = () => {
  const frame = useCurrentFrame();
  const az = [0, 30][frame % 2];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #8fb3d9 0%, #e9e2d0 100%)'}}>
      <ThreeCanvas width={1800} height={760} gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1}} camera={{fov: 30}}>
        <FaceCam az={az} />
        <hemisphereLight args={['#dfeaff', '#7a6a4a', 1.2]} />
        <directionalLight position={[3, 5, 6]} intensity={2.2} />
        {(['cartoon', 'middle', 'khon', 'thai'] as Face[]).map((f, i) => (
          <group key={f} position={[(i - 1.5) * 1.5, 0, 0]} scale={1.15}>
            <HanumanHead face={f} />
          </group>
        ))}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
