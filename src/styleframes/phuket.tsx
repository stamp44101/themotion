// Throwaway style frames for Phuket's cover hero (owner to choose). After Phetchaburi's read
// (docs/experiments.md §3) a hero has to be big on the phone screen and visibly moving from the
// first second, like Korat's walking dinosaurs. Two candidates on a provisional coastal tile:
//   A: a giant sea turtle hauling itself out of the Andaman and crawling up the beach
//   B: a tin dredge working a mine pond, its bucket chain turning and its stack smoking
import React, {useMemo} from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {SeaTurtle, Surf, TurtleTrack, crawlAdvance} from './SeaTurtle';
import {ramp, smooth} from '../lib';

type Key = [number, number, number, number, number, number, number, number];
const story = (camera: Key[]) =>
  buildStory({duration: 60, before: 1600, after: 2026, camera: [], beats: [{id: 'open', t: [0, 8], year: [1700, 1701], camera}]});

// the Andaman along the west edge (a wide band, as Chonburi's Gulf)
const SEA_X = -38;
const SEA_W = 28;
const SHORE = SEA_X + SEA_W / 2; // x of the waterline

// ------------------------------------------------------------------ A: the turtle (owner's pick)
// the cover: the mother hauls out of the surf and crawls up the beach, a stroke at a time
const Turtle: React.FC<{t: number}> = ({t}) => {
  const s = 8.5;
  const x = SHORE - 8 + Math.min(20, crawlAdvance(t) * 4.6);
  return (
    <group>
      <TurtleTrack x0={SHORE} x1={x - 1.2 * s} z={2} s={s * 0.45} />
      <group position={[x, 0, 2]} rotation-y={Math.PI / 2} scale={s}>
        <SeaTurtle t={t} />
      </group>
      <Surf x={x - 0.6 * s} z={2} r={1.6 * s} t={t} k={1 - smooth(ramp(x, SHORE - 2, SHORE + 4))} />
    </group>
  );
};
// the payoff: the mother turns back to the sea and her hatchlings scramble down the beach after her
const HATCH = Array.from({length: 16}, (_, i) => ({z: 2 + (((i * 37) % 17) - 8) * 1.2, d: (i * 0.29) % 1, ph: i * 1.3}));
const Callback: React.FC<{t: number}> = ({t}) => {
  const s = 5.5;
  const mx = SHORE + 7 - Math.min(13, crawlAdvance(t) * 3.2);
  return (
    <group>
      <TurtleTrack x0={mx + 1.2 * s} x1={SHORE + 16} z={2} s={s * 0.45} />
      <group position={[mx, 0, 2]} rotation-y={-Math.PI / 2} scale={s}>
        <SeaTurtle t={t} swim={mx < SHORE - 2} />
      </group>
      <Surf x={mx} z={2} r={1.6 * s} t={t} k={smooth(ramp(-mx, -(SHORE + 1), -(SHORE - 4)))} />
      {HATCH.map((h, i) => {
        // they hatch from the nest up the beach and race for the water, quick little strokes
        const x = SHORE + 17 - h.d * 7 - Math.min(22, crawlAdvance(t + h.ph, 1.7) * 0.55);
        if (x < SHORE - 3) return null;
        return (
          <group key={i} position={[x, 0, h.z]} rotation-y={-Math.PI / 2 + 0.2 * Math.sin(h.ph)} scale={1.6}>
            <SeaTurtle t={t + h.ph} rate={1.7} />
          </group>
        );
      })}
      {/* the nest: a scuffed hollow in the sand up the beach */}
      <mesh position={[SHORE + 16, 0.04, 2]} scale={[2.6, 0.05, 2.2]}>
        <sphereGeometry args={[1, 12, 6]} />
        <meshStandardMaterial color="#cdb88e" roughness={1} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ B: the tin dredge
const POND: [number, number] = [0, 2];
const hull = <meshStandardMaterial color="#b9b2a0" roughness={0.7} />;
const iron = <meshStandardMaterial color="#8a3d1c" roughness={0.6} metalness={0.3} />;
const Dredge: React.FC<{t: number}> = ({t}) => {
  const s = 3.4;
  const bob = 0.05 * Math.sin(t * 1.4);
  const buckets = 16;
  const boomLen = 9;
  // the bucket chain runs up the boom and back down underneath it
  const chain = useMemo(() => Array.from({length: buckets}, (_, i) => i / buckets), []);
  return (
    <group position={[POND[0], bob * s, POND[1]]} rotation-y={0.5} scale={s}>
      {/* pontoon hull and the two-storey works on it */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.7, 7.5]} />
        {hull}
      </mesh>
      <mesh position={[0, 1.5, -0.6]} castShadow>
        <boxGeometry args={[3.4, 1.6, 4.6]} />
        <meshStandardMaterial color="#d8d0bc" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.7, -1.0]} castShadow>
        <boxGeometry args={[2.8, 0.9, 3.0]} />
        <meshStandardMaterial color="#d8d0bc" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.25, -1.0]} castShadow>
        <boxGeometry args={[3.2, 0.12, 3.4]} />
        <meshStandardMaterial color="#8a3a2a" roughness={0.7} />
      </mesh>
      {/* the stack and its smoke */}
      <mesh position={[0.8, 4.1, -1.8]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 1.8, 10]} />
        {iron}
      </mesh>
      {Array.from({length: 7}, (_, i) => {
        const a = (t * 0.6 + i / 7) % 1;
        return (
          <mesh key={i} position={[0.8 + a * 1.2, 5.1 + a * 3.2, -1.8 - a * 0.6]} scale={0.3 + a * 0.9}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#77736c" transparent opacity={0.55 * (1 - a)} depthWrite={false} />
          </mesh>
        );
      })}
      {/* the ladder (boom) dipping into the pond at the bow, the bucket chain turning on it */}
      <group position={[0, 1.6, 3.2]} rotation-x={0.55}>
        <mesh position={[0, 0, boomLen / 2]} castShadow>
          <boxGeometry args={[0.5, 0.35, boomLen]} />
          {iron}
        </mesh>
        {chain.map((u, i) => {
          const q = (u + t * 0.18) % 1;
          // up along the top for the first half, back down along the underside for the second
          const top = q < 0.5;
          const zz = top ? q * 2 * boomLen : (1 - (q - 0.5) * 2) * boomLen;
          return (
            <mesh key={i} position={[0, top ? 0.32 : -0.32, zz]} castShadow>
              <boxGeometry args={[1.0, 0.6, 0.48]} />
              <meshStandardMaterial color={top ? '#c2561e' : '#7a3414'} roughness={0.7} />
            </mesh>
          );
        })}
      </group>
      {/* the tailings chute at the stern, spilling grey sand */}
      <group position={[0, 1.4, -4.2]} rotation-x={-0.35}>
        <mesh position={[0, 0, -1.6]} castShadow>
          <boxGeometry args={[0.8, 0.25, 3.2]} />
          {iron}
        </mesh>
        {Array.from({length: 6}, (_, i) => {
          const a = (t * 1.2 + i / 6) % 1;
          return (
            <mesh key={i} position={[0, -0.3 - a * 1.6, -3.3 - a * 0.4]}>
              <sphereGeometry args={[0.14, 6, 5]} />
              <meshStandardMaterial color="#9a958a" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

const base = (Hero: React.FC<{t: number}>, camera: Key[], pond: boolean, sites: [number, number, number][]): CityConfig => {
  const STORY = story(camera);
  const Landmarks: React.FC<LandmarkProps> = ({t}) => <Hero t={t} />;
  return {
    ...KORAT,
    id: 'phuket-style',
    story: {
      captions: [],
      eras: [],
      yearAt: STORY.yearAt,
      beat: STORY.beat,
      beats: STORY.beats,
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ภูเก็ต', sub: 'ไข่มุกอันดามัน เมืองแร่ดีบุก'},
      finale: KORAT.story.finale,
      approxBefore: 1650,
    },
    layout: {
      ...KORAT.layout,
      // the island's spine of wooded hills, provisional
      peaks: [
        [10, -34, 7, 9],
        [32, -10, 6, 8],
        [26, 28, 5, 7],
      ],
      rivers: [
        {axis: 'z', pos: SEA_X, width: SEA_W},
        ...(pond ? [{path: [[-13, -9], [9, -12], [16, 2], [9, 16], [-11, 16], [-16, 4]] as [number, number][], closed: true, width: 13}] : []),
      ],
      bridges: [],
      rail: undefined,
      trains: [],
      // a sand beach along the shore
      clearings: [
        [SHORE + 3, -30, 7, -1e9],
        [SHORE + 3, -15, 7, -1e9],
        [SHORE + 3, 0, 8, -1e9],
        [SHORE + 3, 15, 7, -1e9],
        [SHORE + 3, 30, 7, -1e9],
        ...sites.map(([x, z, r]) => [x, z, r, -1e9] as [number, number, number, number]),
      ],
      sites,
      openGround: [],
      // no town yet: Phuket never had a wall, and the cover is the island alone
      noWall: true,
      noMoat: true,
      houses: {...KORAT.layout.houses, built: [9000, 1], modern: [9000, 1], keepOut: []},
      villages: {centers: [], built: [9000, 9001]},
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

// Both open on the whole tile (the series' cover) and push in after the title (3 s).
// A: from the south-west, the sea in front, the turtle hauling out toward the camera's left
export const PHUKET_TURTLE = base(
  Turtle,
  [
    [0, -22, 2, 2, 260, -40, 36, 30],
    [3, -18, 2, 2, 230, -38, 35, 30],
    [6, -12, 3, 2, 120, -30, 32, 30],
  ],
  false,
  [[SHORE + 4, 2, 18]],
);
// B: from the south-east, the dredge on its mine pond in the middle of the island
export const PHUKET_DREDGE = base(
  Dredge,
  [
    [0, 0, 1, 2, 300, 30, 36, 30],
    [3, 0, 1, 2, 260, 32, 35, 30],
    [6, 0, 3, 2, 110, 36, 32, 30],
  ],
  true,
  [[POND[0], POND[1], 16]],
);
// A's payoff: mother back to the sea, the hatchlings after her (closer, the same south-west side)
export const PHUKET_TURTLE_CALLBACK = base(
  Callback,
  [
    [0, -19, 1, 2, 125, -14, 42, 30],
    [3, -20, 1, 2, 118, -12, 42, 30],
    [6, -21, 1, 2, 112, -10, 41, 30],
  ],
  false,
  [[SHORE + 8, 2, 16]],
);
