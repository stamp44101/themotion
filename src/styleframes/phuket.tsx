// Throwaway style frames for Phuket's cover hero (owner to choose). After Phetchaburi's read
// (docs/experiments.md §3) a hero has to be big on the phone screen and visibly moving from the
// first second, like Korat's walking dinosaurs. Two candidates on a provisional coastal tile:
//   A: a giant sea turtle hauling itself out of the Andaman and crawling up the beach
//   B: a tin dredge working a mine pond, its bucket chain turning and its stack smoking
import React, {useMemo} from 'react';
import {KORAT} from '../cities/korat';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';
import {SeaTurtle, Surf, TurtleTrack, crawlAdvance} from '../cities/phuket/SeaTurtle';
import {GreenTurtle} from '../cities/phuket/GreenTurtle';
import {Dredge} from '../cities/phuket/Dredge';
import {Person} from '../cities/phuket/figures';

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
// the payoff: the mother turns back to the sea and her hatchlings scramble down the beach after her.
// A family = one mother and her own young. The hatchlings run in a lane beside the mother's track,
// clear of her fore-flippers (they sweep ~3.6 x scale out on a leatherback, ~2.7 x on a green).
type Family = {Body: Species; mz: number; ms: number; lane: [number, number]; n: number; ph: number; size?: number};
const family = ({Body, mz, ms, lane, n, ph, size = 1.1}: Family, t: number, key: number) => {
  const mx = SHORE + 7 - Math.min(13, crawlAdvance(t + ph) * 3.2);
  const [z0, z1] = lane;
  return (
    <group key={key}>
      <TurtleTrack x0={mx + 1.2 * ms} x1={SHORE + 16} z={mz} s={ms * 0.45} />
      <group position={[mx, 0, mz]} rotation-y={-Math.PI / 2} scale={ms}>
        <Body t={t + ph} swim={mx < SHORE - 2} />
      </group>
      <Surf x={mx} z={mz} r={1.6 * ms} t={t + ph} k={smooth(ramp(-mx, -(SHORE + 1), -(SHORE - 4)))} />
      {Array.from({length: n}, (_, i) => {
        const z = z0 + (((i * 5) % n) / Math.max(1, n - 1)) * (z1 - z0);
        const d = (i * 0.29) % 1;
        const hp = i * 1.3 + ph;
        // they hatch from the nest up the beach and race for the water, quick little strokes
        const x = SHORE + 17 - d * 7 - Math.min(22, crawlAdvance(t + hp, 1.7) * 0.55);
        if (x < SHORE - 3) return null;
        return (
          <group key={i} position={[x, 0, z]} rotation-y={-Math.PI / 2 + 0.2 * Math.sin(hp)} scale={size}>
            <Body t={t + hp} rate={1.7} />
          </group>
        );
      })}
      {/* the nest: a scuffed hollow in the sand up the beach */}
      <mesh position={[SHORE + 16, 0.04, (z0 + z1) / 2]} scale={[2.6, 0.05, (z1 - z0) / 2 + 1.5]}>
        <sphereGeometry args={[1, 12, 6]} />
        <meshStandardMaterial color="#b99d6c" roughness={1} />
      </mesh>
    </group>
  );
};
const callback = (Body: Species): React.FC<{t: number}> => ({t}) =>
  family({Body, mz: -6, ms: 5.5, lane: [10, 23.75], n: 12, ph: 0}, t, 0);
// owner's pick (21 ต.ค. 2569): both species. The field check (phuket_field.md §3.4) decides what
// each does today: the leatherback still nests at Mai Khao, the green turtle no longer does and is
// released there by people every Songkran. So the leatherback mother goes back to the sea with her
// hatchlings, and beside her a line of people let young green turtles go at the waterline.
// People are drawn ~6 units a metre (a little under the leatherback's hero scale, so they read as
// people round the turtles, not giants over them), in Songkran shirts, spread along the beach; each
// sets a young turtle down and it crawls into the surf.
const RELEASE = Array.from({length: 6}, (_, i) => ({z: 17 + i * 5.2, ph: i * 0.83}));
const callbackMixed: React.FC<{t: number}> = ({t}) => (
  <group>
    {family({Body: SeaTurtle, mz: -20, ms: 4.6, lane: [-2, 8], n: 9, ph: 0}, t, 0)}
    {RELEASE.map(({z, ph}, i) => {
      const px = SHORE + 7 + (i % 2) * 3;
      // each young turtle is set down at the person's feet and crawls to the water, again and again
      const k = ((t + ph) * 0.16) % 1;
      const tx = px - 3 - k * 9;
      return (
        <group key={i}>
          <group position={[px, 0, z]} rotation-y={-Math.PI / 2} scale={6}>
            <Person t={t} i={i} />
          </group>
          {tx > SHORE - 3 && (
            <group position={[tx, 0, z]} rotation-y={-Math.PI / 2} scale={1.0}>
              <GreenTurtle t={t + ph} rate={1.2} swim={tx < SHORE - 1} />
            </group>
          )}
        </group>
      );
    })}
  </group>
);

// ------------------------------------------------------------------ B: the tin dredge
const POND: [number, number] = [0, 2];
const DredgeOnPond: React.FC<{t: number}> = ({t}) => (
  <group position={[POND[0], 0, POND[1]]} rotation-y={0.5} scale={3.4}>
    <Dredge t={t} />
  </group>
);

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
  DredgeOnPond,
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
const MIXED_CALLBACK_CAM: Key[] = [
  [0, -19, 1, 9, 190, -14, 42, 30],
  [3, -20, 1, 9, 182, -12, 42, 30],
  [6, -21, 1, 9, 175, -10, 41, 30],
];
export const PHUKET_MIXED_CALLBACK = base(callbackMixed, MIXED_CALLBACK_CAM, false, [[SHORE + 8, -16, 14], [SHORE + 8, 6, 14], [SHORE + 8, 26, 14], [SHORE + 8, 42, 10]]);
