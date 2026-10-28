// Throwaway style frames for Udon Thani's cover, A (owner, 28 Oct 2026): the Ban Chiang pot. A
// giant buff jar is already rising out of an excavation pit at frame 0 (the cover is an event); an
// unseen brush whips the red scroll pattern round it in the first 1.6 s, and a red ring of the same
// scrolls runs out across the ground. Legend scale on the whole tile (owner: the cover must show the
// land, with a giant on it): A1 the pot ~26 units tall, A2 ~18 with the dig's terraces round it.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {Walker} from '../cities/nan/figures';
import {lathe} from '../engine/parts';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const FIELD: P2 = [0, -4];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// a Ban Chiang late-period jar: small foot, round body, short neck, flared rim (height 1). Points
// roughly evenly spaced along the outline so the texture's v runs with the surface
const JAR: [number, number][] = [
  [0, 0], [0.16, 0.0], [0.19, 0.03], [0.17, 0.06], [0.26, 0.1], [0.36, 0.16], [0.44, 0.24], [0.49, 0.33],
  [0.5, 0.42], [0.48, 0.51], [0.43, 0.6], [0.35, 0.68], [0.25, 0.74], [0.19, 0.78], [0.18, 0.83],
  [0.22, 0.89], [0.28, 0.94], [0.31, 0.97], [0.29, 0.98], [0.2, 0.93],
];

const PAINT_END = 1.6;
const TEX_W = 1024;
const TEX_H = 512;
const RED = '#a5281b';
const BUFF = '#dcbc90';

/** the scroll pattern as polylines in texture px: two bands of interlocking spirals (S-scrolls) */
const scrollPaths = () => {
  const paths: [number, number][][] = [];
  const spiral = (cx: number, cy: number, r: number, turns: number, dir: number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 40; i++) {
      const k = i / 40;
      const a = dir * k * turns * Math.PI * 2;
      const rr = r * (1 - k * 0.85);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    return pts;
  };
  const bands: [number, number][] = [[TEX_H * 0.36, 34], [TEX_H * 0.56, 40]];
  for (const [y, r] of bands) {
    const n = 8;
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * (TEX_W / n);
      // the S: one spiral each way, joined by a sweep across the band
      const a = spiral(x - r * 0.9, y, r, 1.4, 1);
      const b = spiral(x + r * 0.9, y, r, 1.4, -1);
      paths.push([...a.reverse(), ...b]);
    }
  }
  // the bands' borders and the neck's ring of dashes
  for (const y of [TEX_H * 0.26, TEX_H * 0.66]) {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 64; i++) pts.push([(i / 64) * TEX_W, y + Math.sin(i * 1.3) * 3]);
    paths.push(pts);
  }
  return paths;
};

/** buff jar texture with the first k of the pattern painted */
const paintTexture = (k: number, paths: [number, number][][]) => {
  const c = document.createElement('canvas');
  c.width = TEX_W;
  c.height = TEX_H;
  const g = c.getContext('2d')!;
  g.fillStyle = BUFF;
  g.fillRect(0, 0, TEX_W, TEX_H);
  g.strokeStyle = RED;
  g.lineWidth = 11;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  // the brush goes round all the scrolls at once, each one drawn to the same fraction
  for (const p of paths) {
    const m = Math.max(1, Math.floor(p.length * k));
    if (k <= 0) break;
    g.beginPath();
    g.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < m; i++) g.lineTo(p[i][0], p[i][1]);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
};

const Jar: React.FC<{t: number; H: number}> = ({t, H}) => {
  const geo = useMemo(() => lathe(JAR, 48), []);
  const paths = useMemo(scrollPaths, []);
  const k = smooth(clamp01((t - 0.1) / (PAINT_END - 0.1)));
  const q = Math.round(k * 120) / 120;
  const tex = useMemo(() => paintTexture(q, paths), [q, paths]);
  // already rising at frame 0, out of the pit by 0.7 s with a small settle
  const rise = Math.min(1, 0.45 + t / 0.7 * 0.55);
  const settle = t > 0.7 ? Math.sin(clamp01((t - 0.7) / 0.35) * Math.PI) * 0.03 : 0;
  const y = -H * (1 - smooth(rise)) - H * settle;
  return (
    <group position={[0, y, 0]} rotation-y={t * 0.25} scale={H}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial map={tex} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/** the red scroll ring that runs out across the ground when the painting lands */
const Ring: React.FC<{t: number; R: number}> = ({t, R}) => {
  const u = clamp01((t - PAINT_END + 0.3) / 1.4);
  if (u <= 0 || u >= 1) return null;
  return (
    <mesh position={[0, 0.06, 0]} rotation-x={-Math.PI / 2} scale={R * (0.6 + u * 2.4)}>
      <ringGeometry args={[0.93, 1, 96]} />
      <meshBasicMaterial color={RED} transparent opacity={(1 - u) * 0.85} toneMapped={false} />
    </mesh>
  );
};

/** the excavation: a square pit, stepped terraces and the archaeologists at its rim */
const Dig: React.FC<{t: number; S: number; terraces: boolean}> = ({t, S, terraces}) => (
  <group>
    <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[2.6 * S, 2.6 * S]} />
      <meshStandardMaterial color="#9c7650" roughness={1} />
    </mesh>
    {terraces &&
      [1, 2].map((i) => (
        <mesh key={i} position={[0, 0.03 + i * 0.02, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <ringGeometry args={[(1.3 - i * 0.18) * S * 1.414 * 0.7, (1.3 - (i - 1) * 0.18) * S * 1.414 * 0.7, 4, 1, Math.PI / 4]} />
          <meshStandardMaterial color={i === 1 ? '#8a6544' : '#7a5838'} roughness={1} />
        </mesh>
      ))}
    {/* small pots lying in the dig */}
    {terraces &&
      Array.from({length: 10}, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + 0.3;
        return (
          <group key={`p${i}`} position={[Math.cos(a) * 1.05 * S, 0.05, Math.sin(a) * 1.05 * S]} rotation-z={Math.PI / 2.3} rotation-y={a} scale={0.12 * S}>
            <mesh geometry={lathe(JAR, 16)} castShadow>
              <meshStandardMaterial color={BUFF} roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    {Array.from({length: 12}, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const r = 1.55 * S;
      return (
        <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} rotation-y={-a - Math.PI / 2} scale={0.09 * S}>
          <Walker step={t * 0.4 + i} i={i} still />
        </group>
      );
    })}
  </group>
);

const Hero: React.FC<{t: number; S: number; terraces: boolean}> = ({t, S, terraces}) => (
  <group position={[FIELD[0], 0, FIELD[1]]}>
    <Dig t={t} S={S} terraces={terraces} />
    <Jar t={t} H={3.2 * S} />
    <Ring t={t} R={1.6 * S} />
  </group>
);

const AZ = 6;
const keys = (S: number, d: [number, number, number]) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1893, 1893.4],
        camera: [
          [0, FIELD[0], 1.6 * S, FIELD[1], d[0], AZ, 28, 30],
          [3, FIELD[0], 1.7 * S, FIELD[1], d[1], AZ + 8, 30, 30],
          [8, FIELD[0], 1.8 * S, FIELD[1], d[2], AZ + 18, 33, 30],
        ],
      },
    ],
  });

const base = (id: string, S: number, d: [number, number, number], terraces: boolean): CityConfig => {
  const STORY = keys(S, d);
  const L: React.FC<LandmarkProps> = ({t}) => <Hero t={t} S={S} terraces={terraces} />;
  return {
    ...KORAT,
    id,
    look: 'shader',
    story: {
      captions: [],
      eras: [],
      yearAt: STORY.yearAt,
      beat: STORY.beat,
      beats: STORY.beats,
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'อุดรธานี', sub: 'เมืองหนองประจักษ์'},
      finale: KORAT.story.finale,
      approxBefore: 1500,
    },
    layout: {
      ...KORAT.layout,
      peaks: [],
      rivers: [],
      bridges: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      clearings: [[FIELD[0], FIELD[1], 2.2 * S, -1e9]],
      sites: [],
      openGround: [],
      roads: [],
      towers: [],
      cameraKeys: STORY.cameraKeys,
    },
    Landmarks: L,
    callouts: [],
    actors: [],
    gloom: () => 0,
  };
};

export const UDON_A1 = base('udonthani-a1', 8, [290, 300, 335], false);
export const UDON_A2 = base('udonthani-a2', 5.6, [240, 250, 285], true);
