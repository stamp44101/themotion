// Throwaway style frames for Chiang Rai's cover hero (docs/briefs/chiangrai.md §3a, owner's
// pick A): วัดร่องขุ่น at hero scale on the whole tile at frame 0, the hands of the cycle of
// rebirth rising out of the pit in front of it. Geography is provisional until issue #54
// (the Kok along the north, ดอยจอมทอง west of the centre).
import React, {useMemo} from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import {lathe, prism} from '../engine/parts';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {ramp, smooth} from '../lib';

const story = (camera: [number, number, number, number, number, number, number, number][]) =>
  buildStory({duration: 60, before: 400, after: 2026, camera: [], beats: [{id: 'open', t: [0, 8], year: [500, 501], camera}]});

const WHITE = '#f4f6f8';
const SILVER = '#e3eaf2';
const white = <meshStandardMaterial color={WHITE} roughness={0.35} metalness={0.05} />;
const silver = <meshStandardMaterial color={SILVER} roughness={0.25} metalness={0.35} emissive="#9fb4c8" emissiveIntensity={0.35} />;

// one hand reaching up: forearm, palm, four fingers and a thumb, all white
const Hand: React.FC<{x: number; z: number; rise: number; t: number; i: number}> = ({x, z, rise, t, i}) => {
  if (rise < 0.02) return null;
  const sway = Math.sin(t * 2.2 + i * 1.7) * 0.18;
  return (
    <group position={[x, -1.3 + 1.3 * rise, z]} rotation={[sway, i * 2.39, sway * 0.6]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.9, 6]} />
        {white}
      </mesh>
      <mesh position={[0, 0.98, 0]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.08]} />
        {white}
      </mesh>
      {[-0.075, -0.025, 0.025, 0.075].map((fx, k) => (
        <mesh key={k} position={[fx, 1.17 + (k === 1 || k === 2 ? 0.03 : 0), 0]} rotation-z={fx * -1.5}>
          <cylinderGeometry args={[0.018, 0.022, 0.22 + (k === 1 || k === 2 ? 0.05 : 0), 4]} />
          {white}
        </mesh>
      ))}
      <mesh position={[0.12, 1.02, 0]} rotation-z={-0.8}>
        <cylinderGeometry args={[0.02, 0.024, 0.16, 4]} />
        {white}
      </mesh>
    </group>
  );
};

// วัดร่องขุ่น's ubosot: a white hall under three stacked gabled roofs, silver chofa and finial,
// a porch, mirror-glass glints, and the bridge over the pit of hands in front
const WhiteTemple: React.FC<{t: number; at: [number, number]; s: number; rot?: number}> = ({t, at, s, rot = 0}) => {
  const roofs = useMemo(() => [prism(4.6, 2.4, 7.0), prism(3.6, 2.3, 5.4), prism(2.6, 2.2, 3.8), prism(3.8, 2.1, 2.2)], []);
  const spire = useMemo(() => lathe([[0, 0], [0.35, 0], [0.3, 0.3], [0.18, 0.7], [0.1, 1.4], [0.04, 2.2], [0, 2.6]], 10), []);
  const hands = useMemo(
    () =>
      Array.from({length: 46}, (_, i) => {
        const a = (i / 46) * Math.PI * 2;
        const r = 1.3 + (i % 3) * 0.45;
        return {x: Math.cos(a) * r, z: 8.6 + Math.sin(a) * r * 0.9, d: (i * 0.37) % 1};
      }),
    [],
  );
  const ridgeEnds: [number, number, number][] = [
    [0, 2.2 + 2.4, -3.5],
    [0, 3.0 + 2.3, -2.7],
    [0, 3.8 + 2.2, -1.9],
  ];
  return (
    <group position={[at[0], 0, at[1]]} rotation-y={rot} scale={s}>
      {/* terrace and hall */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.4, 0.5, 9.6]} />
        {white}
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 1.7, 6.4]} />
        {white}
      </mesh>
      {/* three stacked roofs, each lined with silver along its eaves */}
      {[[2.2, 0], [3.0, 1], [3.8, 2]].map(([y, k]) => (
        <group key={k}>
          <mesh geometry={roofs[k]} position={[0, y, 0]} castShadow>
            {white}
          </mesh>
          {[-1, 1].map((sx) => (
            <mesh key={sx} position={[sx * (2.3 - k * 0.5), y + 0.03, 0]}>
              <boxGeometry args={[0.08, 0.08, 7.0 - k * 1.6]} />
              {silver}
            </mesh>
          ))}
        </group>
      ))}
      {/* porch and its gable toward the bridge */}
      <mesh position={[0, 1.05, 4.0]} castShadow>
        <boxGeometry args={[2.8, 1.1, 1.6]} />
        {white}
      </mesh>
      <mesh geometry={roofs[3]} position={[0, 1.6, 4.0]} castShadow>
        {white}
      </mesh>
      {/* the stacked front gables, each edged with a silver naga barge-board that sweeps up
          into a tall hooked chofa: the silhouette that makes it วัดร่องขุ่น */}
      {[[5.12, 1.6, 3.8, 2.1], [3.52, 2.2, 4.6, 2.4], [2.72, 3.0, 3.6, 2.3], [1.92, 3.8, 2.6, 2.2]].map(([z, y, w, h], i) => (
        <group key={`g${i}`} position={[0, y, z]}>
          {[-1, 1].map((sx) => (
            <group key={sx}>
              <mesh position={[(sx * w) / 4, h / 2, 0.02]} rotation-z={-sx * Math.atan2(h, w / 2)}>
                <boxGeometry args={[Math.hypot(w / 2, h) + 0.2, 0.14, 0.12]} />
                {silver}
              </mesh>
              <mesh position={[(sx * w) / 2 + sx * 0.05, 0.35, 0.02]} rotation-z={-sx * 0.35}>
                <coneGeometry args={[0.1, 0.8, 6]} />
                {silver}
              </mesh>
            </group>
          ))}
          <mesh position={[0, h + 0.55, 0.02]}>
            <coneGeometry args={[0.12, 1.3, 6]} />
            {silver}
          </mesh>
        </group>
      ))}
      {/* spikes along every ridge */}
      {[[2.2 + 2.4, 7.0], [3.0 + 2.3, 5.4], [3.8 + 2.2, 3.8]].map(([y, l], k) =>
        Array.from({length: Math.round(l / 0.45)}, (_, j) => (
          <mesh key={`s${k}-${j}`} position={[0, y + 0.18, -l / 2 + 0.2 + j * 0.45]}>
            <coneGeometry args={[0.05, 0.4, 4]} />
            {silver}
          </mesh>
        )),
      )}
      {/* chofa at every ridge end, finial on the top ridge */}
      {ridgeEnds.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y + 0.35, z]} rotation-x={z > 0 ? -0.5 : 0.5}>
          <coneGeometry args={[0.1, 0.9, 6]} />
          {silver}
        </mesh>
      ))}
      <mesh geometry={spire} position={[0, 6.0, 0]} castShadow>
        {silver}
      </mesh>
      {/* mirror-glass glints that sweep along the walls */}
      {Array.from({length: 36}, (_, i) => {
        const side = i % 2 ? 1 : -1;
        const z = -3 + (i >> 1) * 0.36;
        const on = Math.max(0, Math.sin(t * 3 - z * 0.9 + (side > 0 ? 0 : 1.3)));
        return (
          <mesh key={i} position={[side * 1.81, 1.4 + ((i * 7) % 5) * 0.12, z]} rotation-y={Math.PI / 2}>
            <planeGeometry args={[0.14, 0.14]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.25 + 0.75 * on ** 4} />
          </mesh>
        );
      })}
      {/* the pit, the bridge across it, the hands rising */}
      <mesh position={[0, 0.02, 8.6]} rotation-x={-Math.PI / 2} scale={[1, 0.9, 1]}>
        <circleGeometry args={[2.6, 28]} />
        <meshStandardMaterial color="#3a4250" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.35, 8.6]} castShadow>
        <boxGeometry args={[0.9, 0.12, 6.0]} />
        {white}
      </mesh>
      {hands.map((h, i) => (
        <Hand key={i} x={h.x} z={h.z} i={i} t={t} rise={smooth(ramp(t, 0.15 + h.d * 0.9, 0.85 + h.d * 0.9))} />
      ))}
    </group>
  );
};

const base = (camera: Parameters<typeof story>[0], at: [number, number], s: number, rot = 0): CityConfig => {
  const STORY = story(camera);
  const Landmarks: React.FC<LandmarkProps> = ({t}) => <WhiteTemple t={t} at={at} s={s} rot={rot} />;
  return {
    ...KORAT,
    id: 'chiangrai-style',
    story: {
      captions: [],
      eras: [],
      yearAt: STORY.yearAt,
      beat: STORY.beat,
      beats: STORY.beats,
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'เชียงราย', sub: 'เหนือสุดในสยาม เมืองศิลปะริมน้ำกก'},
      finale: KORAT.story.finale,
      approxBefore: 1650,
    },
    layout: {
      ...KORAT.layout,
      // ดอยจอมทอง, a low hill on the Kok's south bank west of the centre; the Thai-Myanmar range
      // behind to the north-west
      peaks: [
        [-13, -6.5, 2.2, 1.6],
        [-42, -40, 9, 9],
        [-16, -46, 7, 8],
        [-46, -14, 6, 8],
      ],
      // แม่น้ำกก along the north of the town, provisional (~140 m)
      rivers: [{path: [[-48, -8], [-30, -9.5], [-14, -8.6], [0, -10.2], [14, -11], [30, -9], [48, -10]], width: 1.8}],
      bridges: [],
      rail: undefined,
      trains: [],
      clearings: [[at[0], at[1] + 2 * s, 9 * s, -1e9]],
      sites: [[at[0], at[1] + 2 * s, 8 * s]],
      openGround: [],
      roads: [],
      towers: [],
      cameraKeys: STORY.cameraKeys,
    },
    Landmarks,
    callouts: [],
    actors: [],
    gloom: () => 0,
  };
};

// 1: front-on from the south, the bridge and the hands toward the viewer, the Kok behind
export const CHIANGRAI_FRONT = base(
  [
    [0, 0, 1, 6, 300, 0, 34, 30],
    [3, 0, 3, 8, 150, 6, 31, 30],
    [6, 0, 4, 9, 100, 12, 30, 30],
  ],
  [0, 4],
  2.2,
);
// 2: three-quarter from the south-west, ดอยจอมทอง and the Kok on the left
export const CHIANGRAI_QUARTER = base(
  [
    [0, -2, 1, 4, 300, -35, 34, 30],
    [3, -2, 3, 6, 150, -28, 31, 30],
    [6, -2, 4, 7, 100, -20, 30, 30],
  ],
  [0, 4],
  2.2,
  -0.45,
);
// 3: bigger and closer, the hands filling the foreground
export const CHIANGRAI_CLOSE = base(
  [
    [0, 0, 2, 10, 210, 10, 30, 30],
    [3, 0, 3, 11, 120, 14, 27, 30],
    [6, 0, 4, 11, 80, 18, 26, 30],
  ],
  [0, 4],
  2.8,
  0.15,
);
