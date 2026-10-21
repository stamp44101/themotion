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
import {GreenTurtle} from './GreenTurtle';

// which turtle: the leatherback (เต่ามะเฟือง) or the green turtle (เต่าตนุ) of the owner's photos
type Species = React.FC<{t: number; rate?: number; swim?: boolean}>;
import {ramp, smooth} from '../lib';

type Key = [number, number, number, number, number, number, number, number];
const story = (camera: Key[]) =>
  buildStory({duration: 60, before: 1600, after: 2026, camera: [], beats: [{id: 'open', t: [0, 8], year: [1700, 1701], camera}]});

// the Andaman along the west edge (a wide band, as Chonburi's Gulf)
const SEA_X = -38;
const SEA_W = 28;
const SHORE = SEA_X + SEA_W / 2; // x of the waterline

// ------------------------------------------------------------------ A: the turtle (owner's pick)
// the cover: two mothers haul out of the surf the same night and crawl up the beach, a stroke at
// a time, out of step. Their fore-flippers reach ~3.6 x scale to each side, so the two lanes sit
// far enough apart that they never touch.
type Mother = {z: number; s: number; lag: number; ph: number; Body?: Species};
const MOTHERS: Mother[] = [
  {z: -15, s: 6.8, lag: 0, ph: 0},
  {z: 22, s: 6.4, lag: -4, ph: 0.9},
];
// owner: a green turtle beside the leatherback. The leatherback is the bigger (2 m against 1 m in
// life; drawn 1.3x here so the green one still reads), the green turtle a little behind it.
const MIXED: Mother[] = [
  {z: -15, s: 7.2, lag: 0, ph: 0, Body: SeaTurtle},
  {z: 20, s: 5.6, lag: -3, ph: 0.9, Body: GreenTurtle},
];
const turtle = (Body: Species, mothers = MOTHERS): React.FC<{t: number}> => ({t}) => (
  <group>
    {mothers.map(({z, s, lag, ph, Body: Own = Body}, i) => {
      const x = SHORE - 7 + lag + Math.min(18, crawlAdvance(t + ph) * 3.8);
      return (
        <group key={i}>
          <TurtleTrack x0={SHORE} x1={x - 1.2 * s} z={z} s={s * 0.45} />
          <group position={[x, 0, z]} rotation-y={Math.PI / 2} scale={s}>
            <Own t={t + ph} />
          </group>
          <Surf x={x - 0.6 * s} z={z} r={1.6 * s} t={t + ph} k={1 - smooth(ramp(x, SHORE - 2, SHORE + 4))} />
        </group>
      );
    })}
  </group>
);
// the payoff: the mother turns back to the sea and her hatchlings scramble down the beach after her
// the hatchlings run in their own lane beside the mother's track, not over her
// (her fore-flippers sweep ~16 units out at this scale, so the lane starts clear of them)
const MZ = -6;
const HATCH = Array.from({length: 12}, (_, i) => ({z: 10 + ((i * 5) % 12) * 1.25, d: (i * 0.29) % 1, ph: i * 1.3}));
const callback = (Body: Species): React.FC<{t: number}> => ({t}) => {
  const s = 5.5;
  const mx = SHORE + 7 - Math.min(13, crawlAdvance(t) * 3.2);
  return (
    <group>
      <TurtleTrack x0={mx + 1.2 * s} x1={SHORE + 16} z={MZ} s={s * 0.45} />
      <group position={[mx, 0, MZ]} rotation-y={-Math.PI / 2} scale={s}>
        <Body t={t} swim={mx < SHORE - 2} />
      </group>
      <Surf x={mx} z={MZ} r={1.6 * s} t={t} k={smooth(ramp(-mx, -(SHORE + 1), -(SHORE - 4)))} />
      {HATCH.map((h, i) => {
        // they hatch from the nest up the beach and race for the water, quick little strokes
        const x = SHORE + 17 - h.d * 7 - Math.min(22, crawlAdvance(t + h.ph, 1.7) * 0.55);
        if (x < SHORE - 3) return null;
        return (
          <group key={i} position={[x, 0, h.z]} rotation-y={-Math.PI / 2 + 0.2 * Math.sin(h.ph)} scale={1.1}>
            <Body t={t + h.ph} rate={1.7} />
          </group>
        );
      })}
      {/* the nest: a scuffed hollow in the sand up the beach */}
      <mesh position={[SHORE + 16, 0.04, 17]} scale={[2.6, 0.05, 8]}>
        <sphereGeometry args={[1, 12, 6]} />
        <meshStandardMaterial color="#b99d6c" roughness={1} />
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
const TURTLE_CAM: Key[] = [
  [0, -22, 2, 2, 260, -40, 36, 30],
  [3, -18, 2, 4, 230, -38, 35, 30],
  [6, -14, 3, 4, 175, -32, 33, 30],
];
export const PHUKET_TURTLE = base(turtle(SeaTurtle), TURTLE_CAM, false, [[SHORE + 4, -12, 16], [SHORE + 4, 20, 16]]);
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
const CALLBACK_CAM: Key[] = [
  [0, -21, 1, 7, 135, -14, 42, 30],
  [3, -22, 1, 7, 128, -12, 42, 30],
  [6, -23, 1, 7, 122, -10, 41, 30],
];
const CALLBACK_SITES: [number, number, number][] = [[SHORE + 8, 0, 16], [SHORE + 8, 18, 12]];
export const PHUKET_TURTLE_CALLBACK = base(callback(SeaTurtle), CALLBACK_CAM, false, CALLBACK_SITES);
// the same two frames with the green turtle of the owner's photos, to compare
export const PHUKET_GREEN = base(turtle(GreenTurtle), TURTLE_CAM, false, [[SHORE + 4, 2, 18]]);
export const PHUKET_GREEN_CALLBACK = base(callback(GreenTurtle), CALLBACK_CAM, false, CALLBACK_SITES);
export const PHUKET_MIXED = base(turtle(SeaTurtle, MIXED), TURTLE_CAM, false, [[SHORE + 4, -12, 16], [SHORE + 4, 20, 16]]);
