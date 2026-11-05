// Throwaway style frames for Sakon Nakhon's cover (4 Nov 2026; docs/briefs/sakonnakhon.md). The rule from
// experiments §17: the symbol is what moves AND it fills ~1/3 of the frame at second 0.
// A: indigo (คราม), the town's own symbol. A giant undyed cloth hangs from a bamboo pole with its foot in a
// giant indigo pot; at frame 0 the blue is already climbing it, and by 1.6 s it is dyed to the pole with the
// white มัดหมี่ diamonds left where the threads were tied; then the pole lifts and the cloth billows, and a
// ring of indigo runs out across the ground. A1 on the whole tile (~50 units of cloth), A2 closer with the
// dyers at the pot. B: Nong Han's legend. A small walled town on the tile sinks and the lake rises over it in
// the first 2.5 s (the city that became the lake). Shapes are placeholders until the layout lands.
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

const INDIGO = '#1b2a63';
const INDIGO_DEEP = '#121c45';
const UNDYED = '#ece3cf';
const DYE_END = 1.6;
const AZ = 18;
const A = (AZ * Math.PI) / 180;

// the indigo pot (หม้อนิล): a wide clay jar, height 1
const POT: [number, number][] = [
  [0, 0], [0.34, 0], [0.46, 0.08], [0.52, 0.25], [0.52, 0.5], [0.48, 0.72], [0.42, 0.86], [0.44, 0.94],
  [0.47, 1], [0.44, 1.01], [0.4, 0.95],
];

const TEX_W = 512;
const TEX_H = 768;

/** the cloth: undyed above the dye front, indigo below with white tied diamonds; front = 0..1 from the foot */
const clothTexture = (front: number) => {
  const c = document.createElement('canvas');
  c.width = TEX_W;
  c.height = TEX_H;
  const g = c.getContext('2d')!;
  g.fillStyle = UNDYED;
  g.fillRect(0, 0, TEX_W, TEX_H);
  const yF = TEX_H * (1 - front); // canvas y of the front (0 = top of the cloth)
  if (front > 0) {
    // the dyed part, with a ragged wicking edge
    g.fillStyle = INDIGO;
    g.beginPath();
    g.moveTo(0, TEX_H);
    for (let i = 0; i <= 32; i++) {
      const x = (i / 32) * TEX_W;
      g.lineTo(x, yF + Math.sin(i * 1.7) * 9 + Math.sin(i * 0.6) * 14);
    }
    g.lineTo(TEX_W, TEX_H);
    g.closePath();
    g.fill();
    // the tied threads stayed white: rows of มัดหมี่ diamonds, clipped to the dyed part
    g.save();
    g.beginPath();
    g.rect(0, yF + 18, TEX_W, TEX_H);
    g.clip();
    g.fillStyle = '#e9e4da';
    const dx = TEX_W / 6;
    const dy = 86;
    for (let row = 0; row * dy < TEX_H + dy; row++) {
      for (let col = -1; col <= 6; col++) {
        const cx = col * dx + (row % 2 ? dx / 2 : 0) + dx / 2;
        const cy = row * dy + 40;
        const w = dx * 0.32;
        const h = dy * 0.36;
        g.beginPath();
        g.moveTo(cx, cy - h);
        g.lineTo(cx + w, cy);
        g.lineTo(cx, cy + h);
        g.lineTo(cx - w, cy);
        g.closePath();
        g.fill();
        g.fillStyle = INDIGO;
        g.fillRect(cx - w * 0.25, cy - h * 0.25, w * 0.5, h * 0.5);
        g.fillStyle = '#e9e4da';
      }
    }
    // borders woven in at the selvedges
    g.fillStyle = INDIGO_DEEP;
    g.fillRect(0, 0, 18, TEX_H);
    g.fillRect(TEX_W - 18, 0, 18, TEX_H);
    g.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

const Cloth: React.FC<{t: number; W: number; H: number}> = ({t, W, H}) => {
  const front = 0.22 + 0.78 * smooth(clamp01(t / DYE_END));
  const q = Math.round(front * 90) / 90;
  const tex = useMemo(() => clothTexture(q), [q]);
  const lift = smooth(clamp01((t - DYE_END) / 1.4));
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(W, H, 36, 48);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      const v = (y + H / 2) / H; // 0 at the foot, 1 at the pole
      const free = 1 - v;
      const amp = W * (0.025 + 0.06 * lift) * free;
      const z = amp * Math.sin((x / W) * 7 + t * 2.3 + v * 2.2) + amp * 0.5 * Math.sin((x / W) * 15 - t * 3.1);
      p.setZ(i, z + W * 0.08 * lift * free * free);
    }
    g.computeVertexNormals();
    return g;
  }, [W, H, t, lift]);
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial map={tex} roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
  );
};

const Bamboo: React.FC<{from: [number, number, number]; to: [number, number, number]; r: number}> = ({from, to, r}) => {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const len = a.distanceTo(b);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return (
    <mesh position={mid} quaternion={q} castShadow>
      <cylinderGeometry args={[r, r, len, 10]} />
      <meshStandardMaterial color="#b89a5a" roughness={0.8} />
    </mesh>
  );
};

/** the ring of indigo that runs out across the ground when the dye reaches the pole */
const Ring: React.FC<{t: number; R: number}> = ({t, R}) => {
  const u = clamp01((t - DYE_END + 0.2) / 1.6);
  if (u <= 0.02 || u >= 1) return null;
  return (
    <mesh position={[0, 0.06, 0]} rotation-x={-Math.PI / 2} scale={R * (0.7 + u * 2.6)}>
      <ringGeometry args={[0.9, 1, 96]} />
      <meshBasicMaterial color={INDIGO} transparent opacity={(1 - u) * 0.8} toneMapped={false} />
    </mesh>
  );
};

const Indigo: React.FC<{t: number; S: number; dyers: boolean}> = ({t, S, dyers}) => {
  const W = 2.2 * S;
  const H = 3.2 * S;
  const potH = 1.0 * S;
  const potR = 0.62 * W; // the lathe's widest radius is 0.52 of its scale
  const lift = smooth(clamp01((t - DYE_END) / 1.4));
  const poleY = potH * 0.75 + H + 0.12 * H * lift;
  const potGeo = useMemo(() => lathe(POT, 48), []);
  return (
    <group position={[FIELD[0], 0, FIELD[1]]}>
      {/* the pot and the dye in it */}
      <group scale={[potR / 0.52, potH, potR / 0.52]}>
        <mesh geometry={potGeo} castShadow receiveShadow>
          <meshStandardMaterial color="#6b4a33" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh position={[0, potH * 0.9, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[(potR / 0.52) * 0.43, 48]} />
        <meshStandardMaterial color={INDIGO_DEEP} roughness={0.25} metalness={0.1} />
      </mesh>
      <group rotation-y={A}>
        {/* the cloth, its foot in the dye */}
        <group position={[0, poleY - H / 2, 0]}>
          <Cloth t={t} W={W} H={H} />
        </group>
        {/* the pole and its two A-frames */}
        <Bamboo from={[-W * 0.7, poleY, 0]} to={[W * 0.7, poleY, 0]} r={0.035 * S} />
        {[-1, 1].map((s) => (
          <group key={s}>
            <Bamboo from={[s * W * 0.66, 0, -0.25 * S]} to={[s * W * 0.66, poleY + 0.05 * S, 0]} r={0.03 * S} />
            <Bamboo from={[s * W * 0.66, 0, 0.25 * S]} to={[s * W * 0.66, poleY + 0.05 * S, 0]} r={0.03 * S} />
          </group>
        ))}
      </group>
      <Ring t={t} R={potR} />
      {dyers &&
        Array.from({length: 10}, (_, i) => {
          const a = (i / 10) * Math.PI * 2 + 0.4;
          const r = (potR / 0.52) * 0.6;
          return (
            <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} rotation-y={-a - Math.PI / 2} scale={0.09 * S}>
              <Walker step={t * 0.4 + i} i={i} still />
            </group>
          );
        })}
    </group>
  );
};

/** B: the legend of Nong Han. A walled town sinks and the lake rises over it in the first 2.5 s */
const Sinking: React.FC<{t: number; S: number}> = ({t, S}) => {
  const R = 2.2 * S;
  const sink = smooth(clamp01((t + 0.4) / 2.6)) * 0.15;
  const lake = smooth(clamp01((t + 0.2) / 2.4));
  const houses = useMemo(
    () =>
      Array.from({length: 46}, (_, i) => {
        const a = i * 2.39996;
        const r = Math.sqrt((i + 3) / 49) * R * 0.78;
        return {x: Math.cos(a) * r, z: Math.sin(a) * r, h: 0.08 + ((i * 37) % 10) / 70, w: 0.12 + ((i * 13) % 5) / 40};
      }),
    [R],
  );
  return (
    <group position={[FIELD[0], 0, FIELD[1]]}>
      <group position={[0, -sink * 0.9 * S, 0]} rotation-z={sink * 0.05}>
        <mesh position={[0, 0.05, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[R, 64]} />
          <meshStandardMaterial color="#8d7a55" roughness={1} />
        </mesh>
        {/* the wall */}
        <mesh position={[0, 0.18 * S, 0]} castShadow>
          <cylinderGeometry args={[R * 0.92, R * 0.92, 0.36 * S, 64, 1, true]} />
          <meshStandardMaterial color="#9a6a45" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        {/* the stupa at the centre */}
        <mesh position={[0, 0.55 * S, 0]} castShadow>
          <coneGeometry args={[0.32 * S, 1.1 * S, 4]} />
          <meshStandardMaterial color="#c8a46a" roughness={0.8} />
        </mesh>
        {houses.map((h, i) => (
          <mesh key={i} position={[h.x, h.h * S * 0.5, h.z]} castShadow>
            <boxGeometry args={[h.w * S, h.h * S, h.w * S * 0.8]} />
            <meshStandardMaterial color={i % 3 ? '#7a5636' : '#a77a4c'} roughness={0.9} />
          </mesh>
        ))}
      </group>
      {/* the lake rising over it, wider than the town */}
      <mesh position={[0, 0.04 * S + lake * 0.5 * S, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[R * (lake < 0.7 ? 0.9 : 0.9 + (lake - 0.7) * 1.2), 96]} />
        <meshStandardMaterial color="#2f6385" roughness={0.2} metalness={0.15} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

const keys = (target: number, d: [number, number, number], el: number) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1700, 1700.4],
        camera: [
          [0, FIELD[0], target, FIELD[1], d[0], AZ, el, 30],
          [3, FIELD[0], target * 1.04, FIELD[1], d[1], AZ + 8, el + 2, 30],
          [8, FIELD[0], target * 1.08, FIELD[1], d[2], AZ + 18, el + 5, 30],
        ],
      },
    ],
  });

const base = (id: string, Hero: React.FC<{t: number}>, target: number, d: [number, number, number], el: number, clear: number): CityConfig => {
  const STORY = keys(target, d, el);
  const L: React.FC<LandmarkProps> = ({t}) => <Hero t={t} />;
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
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'สกลนคร', sub: 'เมืองครามริมหนองหาร'},
      finale: KORAT.story.finale,
      approxBefore: 1700,
    },
    layout: {
      ...KORAT.layout,
      peaks: [[-48, -40, 7, 10], [-30, -50, 6, 9]],
      rivers: [],
      bridges: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      clearings: [[FIELD[0], FIELD[1], clear, -1e9]],
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

const S_A = 16;
export const SAKON_A1 = base('sakon-a1', ({t}) => <Indigo t={t} S={S_A} dyers={false} />, 2.75 * S_A, [300, 310, 340], 20, 2.2 * S_A);
export const SAKON_A2 = base('sakon-a2', ({t}) => <Indigo t={t} S={S_A} dyers />, 2.85 * S_A, [250, 260, 290], 18, 2.2 * S_A);
const S_B = 14;
export const SAKON_B = base('sakon-b', ({t}) => <Sinking t={t} S={S_B} />, 0.9 * S_B, [215, 225, 255], 34, 3.4 * S_B);
