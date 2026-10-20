// Throwaway style frames for Chiang Rai's cover hero (docs/briefs/chiangrai.md §3a, owner's
// pick A): วัดร่องขุ่น at hero scale on the whole tile at frame 0, the hands of the cycle of
// rebirth rising out of the pit in front of it. Geography is provisional until issue #54
// (the Kok along the north, ดอยจอมทอง west of the centre).
import React, {useMemo} from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import {prism} from '../engine/parts';
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
    <group position={[x, -1.2 + 1.25 * rise, z]} rotation={[sway, i * 2.39, sway * 0.6]}>
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

// วัดร่องขุ่น's ubosot, modelled from the parts that make it recognisable:
// - a cruciform hall on a two-step white terrace, porches front, back and both sides;
// - stacked roofs, each gable doubled by a lower, shorter one in front of it;
// - every gable edge serrated with ใบระกา teeth, a hooked ช่อฟ้า at the apex and หางหงส์
//   curling up at the eaves, all silver-white;
// - naga stair rails, porch columns, mirror-glass glints;
// - the bridge of rebirth over the pool with the hands rising from the water either side;
// - two guardians at the bridge's foot, and the golden building beside the white one.
const GOLD = <meshStandardMaterial color="#d9a62e" roughness={0.3} metalness={0.7} emissive="#7a5410" emissiveIntensity={0.25} />;

// one gable end: an infill triangle, serrated barge boards, ช่อฟ้า, หางหงส์. `dir` = +1 faces +z
const Gable: React.FC<{w: number; h: number; z: number; y: number; dir?: number; rotY?: number; x?: number; mat?: React.ReactNode}> = ({w, h, z, y, dir = 1, rotY = 0, x = 0, mat = silver}) => {
  const slope = Math.atan2(h, w / 2);
  const len = Math.hypot(w / 2, h);
  const teeth = Math.max(4, Math.round(len / 0.22));
  return (
    <group position={[x, y, z]} rotation-y={rotY + (dir < 0 ? Math.PI : 0)}>
      {[-1, 1].map((sx) => (
        <group key={sx} position={[(sx * w) / 4, h / 2, 0.06]} rotation-z={-sx * slope}>
          <mesh>
            <boxGeometry args={[len + 0.15, 0.12, 0.1]} />
            {mat}
          </mesh>
          {/* ใบระกา: a row of teeth standing up off the board */}
          {Array.from({length: teeth}, (_, k) => (
            <mesh key={k} position={[-len / 2 + 0.12 + (k * (len - 0.24)) / (teeth - 1), 0.13, 0]} rotation-z={sx * slope * 0.6}>
              <coneGeometry args={[0.045, 0.22, 4]} />
              {mat}
            </mesh>
          ))}
        </group>
      ))}
      {/* ช่อฟ้า: a tall hooked finial at the apex */}
      <group position={[0, h + 0.05, 0.06]}>
        <mesh position={[0, 0.45, 0]} rotation-x={0.25}>
          <coneGeometry args={[0.07, 0.95, 6]} />
          {mat}
        </mesh>
        <mesh position={[0, 0.9, 0.12]}>
          <sphereGeometry args={[0.07, 6, 5]} />
          {mat}
        </mesh>
      </group>
      {/* หางหงส์ curling up at both eaves */}
      {[-1, 1].map((sx) => (
        <mesh key={`h${sx}`} position={[sx * (w / 2 + 0.05), 0.3, 0.06]} rotation-z={-sx * 0.5}>
          <coneGeometry args={[0.07, 0.6, 5]} />
          {mat}
        </mesh>
      ))}
    </group>
  );
};

const WhiteTemple: React.FC<{t: number; at: [number, number]; s: number; rot?: number}> = ({t, at, s, rot = 0}) => {
  const roof = useMemo(() => ({
    main: [prism(3.9, 2.5, 7.0), prism(3.3, 2.2, 5.6), prism(2.6, 1.9, 4.0)],
    wing: [prism(3.0, 2.0, 6.4), prism(2.4, 1.7, 5.0)],
    porch: prism(2.8, 1.8, 2.0),
    gold: prism(2.2, 1.5, 3.0),
  }), []);
  const hands = useMemo(
    () =>
      Array.from({length: 48}, (_, i) => {
        const side = i % 2 ? 1 : -1;
        const k = i >> 1;
        return {x: side * (0.7 + (k % 6) * 0.5), z: 8.7 + Math.floor(k / 6) * 0.32 + ((k * 7) % 3) * 0.05, d: (i * 0.37) % 1};
      }),
    [],
  );
  // roof tiers: [y, length, width, height] of the main ridge (along z), each set lower and longer
  const mainTiers: [number, number, number, number][] = [[2.6, 7.0, 3.9, 2.5], [3.3, 5.6, 3.3, 2.2], [4.0, 4.0, 2.6, 1.9]];
  return (
    <group position={[at[0], 0, at[1]]} rotation-y={rot} scale={s}>
      {/* two-step terrace */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.2, 0.5, 10.4]} />
        {white}
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 0.3, 9.0]} />
        {white}
      </mesh>
      {/* the cruciform hall: nave along z, transept along x */}
      <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 1.8, 6.6]} />
        {white}
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.6, 1.6, 2.4]} />
        {white}
      </mesh>
      {/* nave roofs and their gables, front and back */}
      {mainTiers.map(([y, l, w, h], k) => (
        <group key={`m${k}`}>
          <mesh geometry={roof.main[k]} position={[0, y, 0]} castShadow>
            {white}
          </mesh>
          <Gable w={w} h={h} y={y} z={l / 2} />
          <Gable w={w} h={h} y={y} z={-l / 2} dir={-1} />
        </group>
      ))}
      {/* transept roofs and gables, both sides */}
      {[[2.5, 6.4, 3.0, 2.0], [3.1, 5.0, 2.4, 1.7]].map(([y, l, w, h], k) => (
        <group key={`w${k}`} rotation-y={Math.PI / 2}>
          <mesh geometry={roof.wing[k]} position={[0, y, 0]} castShadow>
            {white}
          </mesh>
          <Gable w={w} h={h} y={y} z={l / 2} />
          <Gable w={w} h={h} y={y} z={-l / 2} dir={-1} />
        </group>
      ))}
      {/* front porch: four columns under a doubled gable, naga stair rails down to the bridge */}
      {[-1.1, -0.4, 0.4, 1.1].map((cx) => (
        <mesh key={cx} position={[cx, 1.55, 4.15]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 1.6, 8]} />
          {white}
        </mesh>
      ))}
      <mesh geometry={roof.porch} position={[0, 2.35, 4.2]} castShadow>
        {white}
      </mesh>
      <Gable w={2.8} h={1.8} y={2.35} z={5.2} />
      <Gable w={2.2} h={1.4} y={2.05} z={5.45} />
      {[-0.65, 0.65].map((sx) => (
        <group key={sx}>
          {Array.from({length: 7}, (_, k) => (
            <mesh key={k} position={[sx, 0.85 - k * 0.09 + Math.sin(k * 1.3) * 0.05, 5.4 + k * 0.28]}>
              <sphereGeometry args={[0.11, 6, 5]} />
              {silver}
            </mesh>
          ))}
        </group>
      ))}
      {/* mirror-glass glints sweeping along the walls */}
      {Array.from({length: 48}, (_, i) => {
        const side = i % 2 ? 1 : -1;
        const z = -3.1 + (i >> 1) * 0.27;
        const on = Math.max(0, Math.sin(t * 3 - z * 0.9 + (side > 0 ? 0 : 1.3)));
        return (
          <mesh key={`g${i}`} position={[side * 1.61, 1.3 + ((i * 7) % 5) * 0.2, z]} rotation-y={Math.PI / 2}>
            <planeGeometry args={[0.12, 0.12]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.25 + 0.75 * on ** 4} />
          </mesh>
        );
      })}
      {/* the pool round the terrace, the bridge across its front, the hands in the water */}
      <mesh position={[0, 0.015, 2.8]} receiveShadow>
        <boxGeometry args={[13, 0.03, 18]} />
        <meshStandardMaterial color="#b9ad94" roughness={0.95} />
      </mesh>
      {[[0, 8.9, 10.4, 3.0], [0, -6.6, 10.4, 1.4], [-4.5, 1.2, 1.4, 15.0], [4.5, 1.2, 1.4, 15.0]].map(([x, z, w, d], k) => (
        <mesh key={`p${k}`} position={[x, 0.04, z]} receiveShadow>
          <boxGeometry args={[w, 0.05, d]} />
          <meshStandardMaterial color="#8fb6cc" roughness={0.15} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0.4, 8.9]} castShadow>
        <boxGeometry args={[1.0, 0.14, 3.4]} />
        {white}
      </mesh>
      {hands.map((h, i) => (
        <Hand key={i} x={h.x} z={h.z} i={i} t={t} rise={smooth(ramp(t, 0.15 + h.d * 0.9, 0.85 + h.d * 0.9))} />
      ))}
      {/* two guardians at the foot of the bridge */}
      {[-0.95, 0.95].map((gx) => (
        <group key={gx} position={[gx, 0, 10.9]}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.28, 1.4, 8]} />
            {white}
          </mesh>
          <mesh position={[0, 1.55, 0]} castShadow>
            <sphereGeometry args={[0.2, 8, 6]} />
            {white}
          </mesh>
          <mesh position={[0, 1.85, 0]}>
            <coneGeometry args={[0.12, 0.45, 6]} />
            {silver}
          </mesh>
        </group>
      ))}
      {/* the golden building, beside and behind the white hall */}
      <group position={[5.4, 0, -4.2]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[1.8, 1.4, 2.6]} />
          {GOLD}
        </mesh>
        <mesh geometry={roof.gold} position={[0, 1.5, 0]} castShadow>
          {GOLD}
        </mesh>
        <Gable w={2.2} h={1.5} y={1.5} z={1.5} mat={GOLD} />
        <Gable w={2.2} h={1.5} y={1.5} z={-1.5} dir={-1} mat={GOLD} />
      </group>
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
      clearings: [[at[0], at[1] + 2.8 * s, 10 * s, -1e9]],
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

// Every variant opens on the whole tile (the series' cover: a green tile with one standout
// thing on it, owner); the hero is made big by its own scale, not by the camera. The camera
// only drifts under the title and pushes in after it (3 s).
// 1: front-on from the south, the bridge and the hands toward the viewer, the Kok behind
export const CHIANGRAI_FRONT = base(
  [
    [0, 0, 1, 4, 330, 0, 36, 30],
    [3, 0, 1, 5, 290, 4, 35, 30],
    [6, 0, 3, 10, 120, 10, 31, 30],
  ],
  [0, 4],
  2.4,
);
// 2: three-quarter from the south-west, the golden building and the Kok beyond
export const CHIANGRAI_QUARTER = base(
  [
    [0, 0, 1, 4, 330, -35, 36, 30],
    [3, 0, 1, 5, 290, -30, 35, 30],
    [6, -1, 3, 9, 120, -22, 31, 30],
  ],
  [0, 4],
  2.4,
  -0.45,
);
// 3: higher, so the pool, the bridge and the hands read as a plan on the tile
export const CHIANGRAI_CLOSE = base(
  [
    [0, 0, 1, 4, 330, 12, 46, 30],
    [3, 0, 1, 5, 290, 14, 44, 30],
    [6, 0, 3, 11, 120, 16, 36, 30],
  ],
  [0, 4],
  2.4,
  0.15,
);
