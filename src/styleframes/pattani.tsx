// Throwaway style frames for Pattani's cover (20 Nov 2026; docs/briefs/pattani_research.md part 2). The rules from
// experiments §17-§20: the symbol fills ~1/3 of the frame at second 0 on the whole land tile at legend scale; it is half made
// by hand at frame 0 and changes shape. Both stand on the real map (src/cities/pattani/places.ts, 125 m/unit).
// A (cloud's pick): ปืนใหญ่พญาตานี. A giant clay mould on the plain between the town and Kru Se; at frame 0 half the clay is
// already knocked off the bronze, the crucible still pours into the mould's head; a mallet knocks the rest off toward the
// muzzle, the fresh bronze glowing and cooling (the same component as the clip's cover).
// B: เรือกอและ. A giant kolae fishing boat drawn up on the bay's south shore; at frame 0 its stern half is painted (red,
// blue, yellow bands and flowers), the bow half bare teak; a brush paints the rest toward the high bird-head bow; then the
// boat slides into the bay.
import React from 'react';
import * as THREE from 'three';
import {PATTANI} from '../cities/pattani';
import {FlatWater, GiantCannon, Puff, SEA_NE_SHAPE, SEA_SHAPE} from '../cities/pattani/Landmarks';
import {CANNON_AT, CANNON_S} from '../cities/pattani/places';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};

// ---------- B: the kolae boat ----------
const KOLAE_AT: P2 = [12, -24];
const KS = 30;
const BANDS = ['#c8102e', '#1f4fa0', '#f2c230', '#2f9a5a', '#f7f1de', '#c8102e', '#1f4fa0', '#f2c230'];
const Kolae: React.FC<{t: number}> = ({t}) => {
  const S = KS;
  const paint = 0.5 + 0.5 * smooth(t / 2.2);
  const slide = smooth((t - 2.6) / 2.4);
  const N = 16;
  const hullH = (u: number) => S * (0.05 + 0.16 * Math.pow(Math.abs(u - 0.5) * 2, 3));
  const brushX = (paint - 0.5) * S;
  return (
    <group position={[KOLAE_AT[0], 0, KOLAE_AT[1] - slide * 6]} rotation-y={0.1}>
      {Array.from({length: N}, (_, i) => {
        const u = (i + 0.5) / N;
        const w = S * (0.11 - 0.07 * Math.pow(Math.abs(u - 0.5) * 2, 2));
        const h = hullH(u);
        const painted = u < paint;
        return (
          <group key={i} position={[(u - 0.5) * S, h / 2 + S * 0.01, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[S / N + 0.05, h, w]} />
              <meshStandardMaterial color={painted ? BANDS[i % BANDS.length] : '#b8865a'} roughness={0.7} />
            </mesh>
            {painted && (
              <mesh position={[0, h * 0.1, w / 2 + 0.02]}>
                <circleGeometry args={[S * 0.018, 10]} />
                <meshStandardMaterial color={i % 2 ? '#f7f1de' : '#f2c230'} />
              </mesh>
            )}
          </group>
        );
      })}
      {/* the bird-head (chakor) at the bow, painted last */}
      <mesh position={[0.52 * S, S * 0.25, 0]} rotation-z={-0.5} castShadow>
        <coneGeometry args={[S * 0.03, S * 0.12, 8]} />
        <meshStandardMaterial color={paint > 0.97 ? '#c8102e' : '#b8865a'} />
      </mesh>
      {paint < 0.995 && (
        <group position={[brushX, S * 0.2, S * 0.07]} rotation-z={Math.sin(t * 12) * 0.4}>
          <mesh position={[0, S * 0.08, 0]}>
            <cylinderGeometry args={[S * 0.006, S * 0.006, S * 0.16, 6]} />
            <meshStandardMaterial color="#6b4325" />
          </mesh>
          <mesh>
            <boxGeometry args={[S * 0.02, S * 0.03, S * 0.04]} />
            <meshStandardMaterial color={BANDS[Math.floor(paint * 16) % BANDS.length]} />
          </mesh>
          <Puff u={(t * 3) % 1} seed={Math.floor(t * 3)} S={S * 0.08} color="#ffd9a0" n={5} />
        </group>
      )}
    </group>
  );
};

const AZ = -6;
const keys = (target: P2) =>
  buildStory({
    duration: 60,
    before: 1500,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1577, 1577.4],
        camera: [
          [0, target[0], 4, target[1], 300, AZ, 36, 30],
          [3, target[0] + 1, 4, target[1] + 1, 268, AZ + 5, 35, 30],
          [8, target[0] + 2, 4, target[1] + 2, 250, AZ + 14, 37, 30],
        ],
      },
    ],
  });

const base = (id: string, Hero: React.FC<{t: number}>, target: P2): CityConfig => {
  const STORY = keys(target);
  const L: React.FC<LandmarkProps> = ({t}) => (
    <group>
      <FlatWater shape={SEA_SHAPE} />
      <FlatWater shape={SEA_NE_SHAPE} />
      <Hero t={t} />
    </group>
  );
  return {
    ...PATTANI,
    id,
    story: {...PATTANI.story, captions: [], eras: [], yearAt: STORY.yearAt, beat: STORY.beat, beats: STORY.beats},
    layout: {...PATTANI.layout, cameraKeys: STORY.cameraKeys},
    Landmarks: L,
    callouts: [],
    actors: [],
  };
};

export const PATTANI_A = base('pattani-a', ({t}) => <GiantCannon t={t} />, [24, -14]);
export const PATTANI_B = base('pattani-b', ({t}) => <Kolae t={t} />, [16, -20]);
void CANNON_AT;
void CANNON_S;
void THREE;
