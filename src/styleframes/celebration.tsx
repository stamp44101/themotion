// A one-off city for the 1,000-follower story: not any real place, just the series at its
// grandest -- a mountain, a winding river, a moated old town round a gilded chedi, a modern
// city to the tile's edges, lanterns, krathongs and fireworks. Rendered as a cutout
// (--props {cutout, wide}) at the finale's night and composed onto the story background.
import React from 'react';
import {KORAT} from '../cities/korat';
import {SmallChedi, Viharn} from '../engine/parts';
import type {CityConfig, LandmarkProps} from '../engine/types';

const CelebrationLandmarks: React.FC<LandmarkProps> = ({night}) => (
  <>
    <SmallChedi pos={[0, 0, 0]} scale={3.4} k={1} color="#e2b33c" glow={0.5 + night * 0.9} />
    {[
      [-4.6, 0, 0],
      [4.6, 0, Math.PI],
    ].map(([x, z, r], i) => (
      <Viharn key={i} pos={[x, 0, z]} rot={r} k={1} scale={0.5} />
    ))}
    {[-1, 1].flatMap((sx) =>
      [-1, 1].map((sz) => <SmallChedi key={`${sx}${sz}`} pos={[sx * 3.4, 0, sz * 3.4]} scale={0.55} k={1} color="#f1ece2" glow={night * 0.5} />),
    )}
  </>
);

export const CELEBRATION: CityConfig = {
  ...KORAT,
  id: 'celebration',
  story: {...KORAT.story, yearAt: () => 2026, captions: [], eras: []},
  layout: {
    ...KORAT.layout,
    // behind the town from the camera (az 135 sits north-east, looking south-west): the far corner
    peaks: [
      [-40, 40, 22, 11],
      [-46, 14, 14, 9],
      [-14, 46, 14, 9],
    ],
    rivers: [
      {
        path: [
          [-50, -30],
          [-30, -24],
          [-18, -14],
          [-16, 0],
          [-20, 12],
          [-4, 30],
          [8, 50],
        ],
        width: 2.6,
      },
    ],
    bridges: [],
    rail: undefined,
    trains: [],
    city: {hx: 9, hz: 9, moat: [1000, 1001], wall: [1000, 1001], gates: [1000, 1001], groundFrom: 999},
    gates: [
      {x: -9, z: 0, rot: 0, width: 2.4, pavilion: true},
      {x: 9, z: 0, rot: 0, width: 2.4, pavilion: true},
      {x: 0, z: -9, rot: Math.PI / 2, width: 2.4, pavilion: true},
      {x: 0, z: 9, rot: Math.PI / 2, width: 2.4, pavilion: true},
    ],
    houses: {built: [1000, 50], modern: [1900, 40], keepOut: [[0, 0, 6]]},
    clearings: [],
    sites: [[0, 0, 6]],
    openGround: [],
    urban: {from: 1900, rate: 0.6},
    urbanBox: undefined,
    sprawl: {height: 1, tall: 0.08},
    highRise: 1950,
    towers: [
      {x0: 14, x1: 34, z0: -8, z1: 10, extra: 9},
      {x0: -34, x1: -14, z0: -8, z1: 12, extra: 6},
    ],
    roads: [
      {from: [-48, 0], to: [-9, 0], width: 1.6, year: 1950},
      {from: [9, 0], to: [48, 2], width: 1.6, year: 1950},
      {from: [0, 9], to: [2, 48], width: 1.6, year: 1950},
    ],
    ringRoadYear: 1960,
    cars: [1950, 2100],
    boats: [1000, 2100],
    finale: 'loykrathong',
    krathongPonds: [],
    life: {},
    cameraKeys: [[0, 0, 1, 0, 340, 135, 34, 30], [9999, 0, 1, 0, 340, 135, 34, 30]],
  },
  Landmarks: CelebrationLandmarks,
  callouts: [],
  actors: [],
  gloom: () => 0,
};
