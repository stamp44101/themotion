// Throwaway style frames for Phuket's cover hero (owner to choose). After Phetchaburi's read
// (docs/experiments.md §3) a hero has to be big on the phone screen and visibly moving from the
// first second, like Korat's walking dinosaurs. Two candidates on a provisional coastal tile:
//   A: a giant sea turtle hauling itself out of the Andaman and crawling up the beach
//   B: a tin dredge working a mine pond, its bucket chain turning and its stack smoking
import React, {useMemo} from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {lerp, ramp, smooth} from '../lib';

type Key = [number, number, number, number, number, number, number, number];
const story = (camera: Key[]) =>
  buildStory({duration: 60, before: 1600, after: 2026, camera: [], beats: [{id: 'open', t: [0, 8], year: [1700, 1701], camera}]});

// the Andaman along the west edge (a wide band, as Chonburi's Gulf)
const SEA_X = -38;
const SEA_W = 28;
const SHORE = SEA_X + SEA_W / 2; // x of the waterline

// ------------------------------------------------------------------ A: the turtle
const shell = <meshStandardMaterial color="#6b5a3a" flatShading roughness={0.8} />;
const skin = <meshStandardMaterial color="#8c8a6a" flatShading roughness={0.9} />;
const Flipper: React.FC<{x: number; z: number; side: number; ph: number; t: number; front: boolean}> = ({x, z, side, ph, t, front}) => {
  const stroke = Math.sin(t * 2.6 + ph);
  return (
    <group position={[x, 0.35, z]} rotation-y={side * (front ? 0.5 + 0.45 * stroke : 0.9 + 0.25 * stroke)}>
      <mesh position={[side * (front ? 0.9 : 0.5), 0, 0]} scale={[front ? 1.0 : 0.55, 0.12, front ? 0.38 : 0.3]} castShadow>
        <sphereGeometry args={[1, 10, 6]} />
        {skin}
      </mesh>
    </group>
  );
};
const Turtle: React.FC<{t: number}> = ({t}) => {
  // hauls out of the surf and crawls inland: lunges with each flipper stroke, not a glide
  const p = smooth(ramp(t, 0, 7.5));
  const lunge = 0.25 * Math.max(0, Math.sin(t * 2.6));
  const x = lerp(SHORE - 8, SHORE + 12, p) + lunge;
  const s = 8.5;
  const heave = 0.08 * Math.abs(Math.sin(t * 2.6));
  return (
    <group>
      {/* the track it leaves in the sand */}
      <mesh position={[(SHORE - 2 + x) / 2, 0.03, 2]} receiveShadow>
        <boxGeometry args={[Math.max(0.01, x - SHORE + 2), 0.02, 2.6 * s * 0.5]} />
        <meshStandardMaterial color="#c9b48a" roughness={1} />
      </mesh>
      <group position={[x, heave * s, 2]} rotation-y={Math.PI / 2} scale={s}>
        {/* carapace: a flattened dome with scutes, a lighter plastron under it */}
        <mesh position={[0, 0.55, 0]} scale={[1.25, 0.5, 1.6]} castShadow>
          <sphereGeometry args={[1, 14, 9, 0, Math.PI * 2, 0, Math.PI / 2]} />
          {shell}
        </mesh>
        {[[0, 0.9, 0.55], [0, 0.98, -0.1], [0, 0.9, -0.75], [0.6, 0.78, 0.2], [-0.6, 0.78, 0.2], [0.6, 0.76, -0.5], [-0.6, 0.76, -0.5]].map(([sx, sy, sz], k) => (
          <mesh key={k} position={[sx, sy, sz]} scale={[0.32, 0.06, 0.32]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#4f4129" flatShading roughness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 0.5, 0]} scale={[1.18, 0.12, 1.5]}>
          <sphereGeometry args={[1, 12, 6]} />
          <meshStandardMaterial color="#d9cfa8" roughness={0.9} />
        </mesh>
        {/* head and neck, lifting as it breathes */}
        <group position={[0, 0.6 + 0.08 * Math.sin(t * 1.3), 1.75]} rotation-x={-0.15 + 0.1 * Math.sin(t * 1.3)}>
          <mesh scale={[0.38, 0.32, 0.5]} castShadow>
            <sphereGeometry args={[1, 10, 8]} />
            {skin}
          </mesh>
          {[-0.2, 0.2].map((ex) => (
            <mesh key={ex} position={[ex, 0.12, 0.3]}>
              <sphereGeometry args={[0.06, 6, 5]} />
              <meshStandardMaterial color="#1a1a14" />
            </mesh>
          ))}
        </group>
        {/* the big fore-flippers row together; the hind ones push alternately */}
        <Flipper x={0.9} z={0.9} side={1} ph={0} t={t} front />
        <Flipper x={-0.9} z={0.9} side={-1} ph={0} t={t} front />
        <Flipper x={0.7} z={-1.2} side={1} ph={Math.PI} t={t} front={false} />
        <Flipper x={-0.7} z={-1.2} side={-1} ph={Math.PI} t={t} front={false} />
      </group>
      {/* surf running off its shell as it leaves the water */}
      {t < 3 &&
        Array.from({length: 10}, (_, i) => (
          <mesh key={i} position={[x - 2 - (i % 3), 0.4 + ((t * 3 + i) % 1.2), 2 + (i - 5) * 0.6]}>
            <sphereGeometry args={[0.18, 6, 5]} />
            <meshStandardMaterial color="#e8f4f8" transparent opacity={0.8 * (1 - t / 3)} />
          </mesh>
        ))}
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
