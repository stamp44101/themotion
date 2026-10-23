// Throwaway style frames for Lopburi's opening hero (docs/briefs/lopburi.md §4): the city legend
// made alive. Hanuman, white and giant, leaps in across the tile and lands beside พระปรางค์สามยอด,
// and a troop of ordinary macaques (his "descendants", ลูกศิษย์เจ้าพ่อพระกาฬ) runs and hops round
// the towers. Geography is provisional: แม่น้ำลพบุรี drawn straight down the west of the tile,
// the prang at hero scale until the pins and the ONEP polygon come in.
import React from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import {lathe, PRANG} from '../engine/parts';
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
        [0, 4, 3, 0, 150, 140, 30, 30],
        [3, 3, 4, 0, 72, 152, 26, 30],
        [7, 2, 4, 0, 52, 165, 22, 30],
      ],
    },
  ],
});

const RIVER: [number, number][] = [[-14, -48], [-13, -20], [-12, 0], [-13, 20], [-14, 48]];

// ------------------------------------------------------------------ พระปรางค์สามยอด
// three laterite towers in a row north-south, joined by low galleries; hero scale
const LATERITE = '#a2603f';
const STUCCO = '#d9c7a8';
const PRANG_GEO = lathe(PRANG, 12);
const PrangSamYot: React.FC<{y: number}> = ({y}) => (
  <group position={[0, y, 0]}>
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[4.2, 0.8, 11]} />
      <meshStandardMaterial color="#8f5a3e" flatShading />
    </mesh>
    {[-3.6, 0, 3.6].map((z) => (
      <group key={z} position={[0, 0.8, z]} scale={z === 0 ? 1.55 : 1.35}>
        <mesh geometry={PRANG_GEO} castShadow receiveShadow>
          <meshStandardMaterial color={LATERITE} flatShading roughness={0.95} />
        </mesh>
        <mesh position={[0, 4.2, 0]}>
          <coneGeometry args={[0.16, 0.6, 8]} />
          <meshStandardMaterial color={STUCCO} />
        </mesh>
      </group>
    ))}
    {[-1.8, 1.8].map((z) => (
      <mesh key={z} position={[0, 1.9, z]} castShadow>
        <boxGeometry args={[1.5, 2.2, 1.6]} />
        <meshStandardMaterial color={LATERITE} flatShading roughness={0.95} />
      </mesh>
    ))}
  </group>
);

// ------------------------------------------------------------------ a limb between two points
const UP = new THREE.Vector3(0, 1, 0);
const Limb: React.FC<{a: THREE.Vector3; b: THREE.Vector3; r: number; color: string}> = ({a, b, r, color}) => {
  const d = new THREE.Vector3().subVectors(b, a);
  const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
  return (
    <mesh position={a.clone().add(b).multiplyScalar(0.5)} quaternion={q} castShadow>
      <capsuleGeometry args={[r, d.length(), 4, 10]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
};
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// ------------------------------------------------------------------ หนุมาน
// White as in khon, a gold diadem and jewellery, the open mouth with crystal fangs, a long tail
// curling up. Modelled facing +z, about 4 tall standing; `leap` 0 = crouched on landing, 1 = flying.
const WHITE = '#f6f3ec';
const GOLD = '#e0a93a';
const Hanuman: React.FC<{leap: number; t: number}> = ({leap, t}) => {
  const k = leap;
  const hip = v(0, 1.5 - (1 - k) * 0.5, 0);
  const chest = v(0, 2.45 - (1 - k) * 0.55, 0.25 + k * 0.35);
  const head = chest.clone().add(v(0, 0.75, 0.25));
  const sh = (s: number) => chest.clone().add(v(s * 0.5, 0.15, 0));
  // arms reach forward when flying, plant on the ground on landing
  const hand = (s: number) =>
    k > 0.5 ? chest.clone().add(v(s * 0.55, 0.5, 1.4)) : v(s * 0.8, 0.15, 1.0);
  const elbow = (s: number) => sh(s).clone().lerp(hand(s), 0.5).add(v(s * 0.25, k > 0.5 ? 0.1 : 0.3, -0.1));
  // legs trail behind in flight, fold into a crouch on landing
  const foot = (s: number) => (k > 0.5 ? hip.clone().add(v(s * 0.35, -0.6, -1.6)) : v(s * 0.55, 0.1, 0.1));
  const knee = (s: number) => (k > 0.5 ? hip.clone().add(v(s * 0.35, -0.75, -0.6)) : v(s * 0.6, 0.85, 0.75));
  const tail = new THREE.CatmullRomCurve3([
    hip.clone().add(v(0, 0, -0.4)),
    hip.clone().add(v(0, 0.3, -1.4)),
    hip.clone().add(v(0.3, 1.6, -2.0)),
    hip.clone().add(v(0.2, 2.6, -1.3)),
    hip.clone().add(v(-0.2, 2.6, -0.7 + Math.sin(t * 3) * 0.1)),
  ]);
  return (
    <group>
      {/* body */}
      <mesh position={hip.clone().lerp(chest, 0.5)} rotation-x={0.25 + k * 0.4} scale={[0.62, 0.95, 0.5]} castShadow>
        <sphereGeometry args={[1, 18, 14]} />
        <meshStandardMaterial color={WHITE} roughness={0.6} />
      </mesh>
      <mesh position={hip} scale={[0.55, 0.42, 0.45]} castShadow>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color={WHITE} roughness={0.6} />
      </mesh>
      {/* gold belt and necklace */}
      <mesh position={hip.clone().add(v(0, 0.25, 0))} rotation-x={Math.PI / 2 + 0.2} castShadow>
        <torusGeometry args={[0.55, 0.07, 6, 20]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
      </mesh>
      {/* a gold collar lying on the chest with a pendant (ทับทรวง), and shoulder pieces */}
      <mesh position={chest.clone().add(v(0, 0.45, 0.12))} rotation-x={Math.PI / 2 - 0.5} scale={[1, 1, 0.5]}>
        <cylinderGeometry args={[0.46, 0.5, 0.12, 20, 1, true]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={chest.clone().add(v(0, 0.15, 0.48))} rotation-x={0.4}>
        <octahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial color="#c0392b" metalness={0.3} roughness={0.3} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={sh(s).clone().add(v(s * 0.05, 0.12, 0))} rotation-z={-s * 0.6} scale={[0.32, 0.12, 0.28]}>
          <sphereGeometry args={[1, 10, 6]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
      {/* arms and legs, with gold bands */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Limb a={sh(s)} b={elbow(s)} r={0.17} color={WHITE} />
          <Limb a={elbow(s)} b={hand(s)} r={0.14} color={WHITE} />
          <mesh position={elbow(s).clone().lerp(hand(s), 0.7)} quaternion={new THREE.Quaternion().setFromUnitVectors(UP, hand(s).clone().sub(elbow(s)).normalize())}>
            <cylinderGeometry args={[0.17, 0.17, 0.12, 12]} />
            <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
          </mesh>
          <Limb a={hip.clone().add(v(s * 0.3, -0.1, 0))} b={knee(s)} r={0.2} color={WHITE} />
          <Limb a={knee(s)} b={foot(s)} r={0.16} color={WHITE} />
        </group>
      ))}
      <mesh castShadow>
        <tubeGeometry args={[tail, 24, 0.09, 8, false]} />
        <meshStandardMaterial color={WHITE} roughness={0.6} />
      </mesh>
      {/* the head: a round skull, a muzzle with the mouth open, crystal fangs, round eyes,
          and the gold diadem with a small flame at the brow */}
      <group position={head} scale={1.25}>
        <mesh scale={[0.48, 0.5, 0.46]} castShadow>
          <sphereGeometry args={[1, 18, 14]} />
          <meshStandardMaterial color={WHITE} roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.12, 0.38]} scale={[0.32, 0.22, 0.24]} castShadow>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color={WHITE} roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.24, 0.5]} scale={[0.24, 0.12, 0.12]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#b32a22" />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.13, -0.16, 0.58]} rotation-x={Math.PI}>
              <coneGeometry args={[0.04, 0.16, 5]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            <mesh position={[s * 0.17, 0.08, 0.38]}>
              <sphereGeometry args={[0.09, 12, 10]} />
              <meshStandardMaterial color="#fffaf0" />
            </mesh>
            <mesh position={[s * 0.18, 0.08, 0.46]}>
              <sphereGeometry args={[0.05, 10, 8]} />
              <meshStandardMaterial color="#2a1608" />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.2, 0]} rotation-x={Math.PI / 2 - 0.15}>
          <torusGeometry args={[0.47, 0.06, 6, 24]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.42, 0.36]} rotation-x={-0.3}>
          <coneGeometry args={[0.08, 0.32, 6]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ the troop
// an ordinary macaque: grey-brown, a pink face, the tail held up in an arc; hops as it runs
const MONKEY_TAIL = new THREE.CatmullRomCurve3([v(0, 0, 0), v(0, 0.15, -0.3), v(0, 0.55, -0.4), v(0, 0.75, -0.2)]);
// a macaque sitting up, as they do on the prang
const SittingMacaque: React.FC<{t: number}> = ({t}) => (
  <group>
    <mesh position={[0, 0.42, 0]} scale={[0.26, 0.38, 0.24]} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#8c7356" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.92, 0.04]} rotation-y={Math.sin(t * 1.3) * 0.5} scale={0.24} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#8c7356" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.9, 0.22]} scale={[0.13, 0.12, 0.06]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#d99a8a" />
    </mesh>
    <mesh position={[0, 0.08, -0.25]}>
      <tubeGeometry args={[MONKEY_TAIL, 12, 0.035, 5, false]} />
      <meshStandardMaterial color="#7a6249" />
    </mesh>
  </group>
);
const Macaque: React.FC<{hop: number}> = ({hop}) => (
  <group position={[0, Math.abs(hop) * 0.35, 0]} rotation-x={hop * 0.15}>
    <mesh position={[0, 0.42, 0]} scale={[0.26, 0.24, 0.42]} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#8c7356" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.66, 0.38]} scale={0.24} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#8c7356" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.63, 0.58]} scale={[0.13, 0.12, 0.07]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#d99a8a" />
    </mesh>
    {[
      [-0.15, 0.25],
      [0.15, 0.25],
      [-0.15, -0.25],
      [0.15, -0.25],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.18, z + (i < 2 ? hop : -hop) * 0.08]}>
        <capsuleGeometry args={[0.05, 0.25, 3, 6]} />
        <meshStandardMaterial color="#7a6249" />
      </mesh>
    ))}
    <mesh position={[0, 0.55, -0.42]}>
      <tubeGeometry args={[MONKEY_TAIL, 12, 0.035, 5, false]} />
      <meshStandardMaterial color="#7a6249" />
    </mesh>
  </group>
);

const LAND_T = 2.4; // Hanuman touches down
const LAND: [number, number] = [9, -4];
const START: [number, number, number] = [0, 12, 30];

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
      <group position={[x, y, z]} rotation-y={yaw} scale={3.4}>
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
