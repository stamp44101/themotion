import React, {useLayoutEffect, useRef} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {Army, type Formation} from '../../engine/army';
import {lathe, updateInstances, Viharn} from '../../engine/parts';
import {lerp, ramp, smooth} from '../../lib';
import type {LandmarkProps} from '../../engine/types';

// World positions from Google Maps / UNESCO via scripts/geo.mjs (origin = old-town centroid
// 8.41680, 99.96438, 80 m/unit). See docs/briefs/nakhonsi.md §5a.
export const CHEDI: [number, number] = [2.5, 7.4];
export const NORTH_GATE: [number, number] = [-1.1, -15.0];
export const HO_PHRA_ISUAN: [number, number] = [-0.9, -10.2];
export const HO_PHRA_NARAI: [number, number] = [-0.2, -10.4];
export const PHUTTHASIHING: [number, number] = [-1.0, -3.2];
// where the legend's boat comes ashore: the Gulf's edge (13 km east, compressed to the tile)
export const LANDING: [number, number] = [40.4, 5];
// แห่ผ้าขึ้นธาตุ: the procession walks south down the town's axis, west of Phutthasihing,
// then turns east into the chedi court through its west side
export const PROCESSION: [number, number][] = [
  [-0.4, -7],
  [0.3, 5.6],
  [0.6, 7.4],
  [1.3, 7.4],
];
// 1988 mudslide: a channel of bare mud down Khao Luang's east face toward the plain
export const SLIDE: [number, number][] = Array.from({length: 16}, (_, i) => [-41.5 + i * 0.55, -6 + i * 0.2 + Math.sin(i * 1.3) * 0.4]);

// The great chedi is ~55 m (0.7 unit) tall; it is the clip's hero, so it is drawn ~8x tall.
// It cannot be drawn 8x wide: it stands 115 m (1.4 units) inside the east wall of a town only
// 456 m across, and the first draft's cloister ran through that wall. So the footprint stays
// near real (base r ~1, cloister half 1.1) and the height goes into the spire, which is how the
// real one reads anyway: a modest white bell under a very tall gilded spire.
const S = 0.42;
const SPIRE_Y = 2.0;
const BASE: [number, number][] = [
  [0, 0], [2.3, 0], [2.3, 0.5], [2.05, 0.5], [2.05, 1.0], [1.9, 1.0], [1.9, 1.4],
];
const BELL: [number, number][] = [
  [0, 1.4], [1.9, 1.4], [2.0, 1.8], [1.95, 2.6], [1.7, 3.3], [1.25, 3.85], [0.7, 4.15], [0, 4.25],
];
const SPIRE: [number, number][] = [
  [0, 0], [0.62, 0], [0.62, 0.55], [0.45, 0.55], [0.42, 1.0], [0.34, 1.2], [0.3, 1.7],
  [0.22, 2.0], [0.18, 2.6], [0.1, 3.4], [0.05, 4.2], [0, 4.7],
];
const baseGeo = lathe(BASE, 16);
const bellGeo = lathe(BELL, 24);
const spireGeo = lathe(SPIRE, 12);
const CLOISTER = 2.7;

const Chedi: React.FC<{k: number; lanka: number; night: number; wrap: number}> = ({k, lanka, night, wrap}) => (
  <group position={[CHEDI[0], 0, CHEDI[1]]} scale={[S, S * Math.max(0.001, k), S]}>
    {/* the older, smaller Srivijaya-era stupa inside, replaced by the Lanka bell */}
    <group scale={1 - 0.15 * (1 - lanka)}>
      <mesh geometry={baseGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#efece4" roughness={0.75} />
      </mesh>
      <mesh geometry={bellGeo} castShadow>
        <meshStandardMaterial color="#f6f4ee" roughness={0.6} />
      </mesh>
      <mesh geometry={spireGeo} position={[0, 4.2, 0]} scale={[1, SPIRE_Y * (0.35 + 0.65 * lanka), 1]} castShadow>
        <meshStandardMaterial color="#e2b33c" metalness={0.7} roughness={0.3} emissive="#ffcf6a" emissiveIntensity={night * 0.6} />
      </mesh>
    </group>
    {/* ผ้าพระบฏ: the saffron cloth wound round the bell after the procession */}
    {wrap > 0.02 && (
      <mesh position={[0, 2.2, 0]} scale={[1, wrap, 1]}>
        <cylinderGeometry args={[2.12, 2.16, 1.2, 24, 1, true]} />
        <meshStandardMaterial color="#f0a020" roughness={0.6} side={THREE.DoubleSide} emissive="#f0a020" emissiveIntensity={0.15 + night * 0.3} />
      </mesh>
    )}
    {/* วิหารคด: the roofed gallery round the chedi court (comes with the Lanka rebuild) */}
    {lanka > 0.02 && [
      [0, -CLOISTER, 2 * CLOISTER + 0.5, 0.5],
      [0, CLOISTER, 2 * CLOISTER + 0.5, 0.5],
      [-CLOISTER, 0, 0.5, 2 * CLOISTER + 0.5],
      [CLOISTER, 0, 0.5, 2 * CLOISTER + 0.5],
    ].map(([x, z, w, d], i) => (
      <mesh key={i} position={[x, 0.6 * lanka, z]} scale={[1, lanka, 1]} castShadow receiveShadow>
        <boxGeometry args={[w, 1.2, d]} />
        <meshStandardMaterial color="#8e3a2c" roughness={0.8} />
      </mesh>
    ))}
  </group>
);

const Slide: React.FC<{Y: number; terrainH: LandmarkProps['terrainH']}> = ({Y, terrainH}) => {
  const k = smooth(ramp(Y, 1988.12, 1988.3));
  if (k <= 0) return null;
  // mud first, then scrub greens it over the following decades
  const g = ramp(Y, 1995, 2026);
  const color = g > 0.5 ? '#7d7a45' : g > 0.15 ? '#806444' : '#7a5636';
  return (
    <>
      {SLIDE.map(([x, z], i) => (
        <mesh key={i} position={[x, terrainH(x, z) + 0.05, z]} rotation-y={0.35 * Math.sin(i)} scale={[k, 1, k]} receiveShadow>
          <boxGeometry args={[2.8 - i * 0.06, 0.3, 1.8]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}
    </>
  );
};

// ------------------------------------------------------------------ boats
// a junk: hull, deck house, two battened sails; `relic` is the legend's small white-sailed boat
const Ship: React.FC<{x: number; z: number; rot: number; k: number; relic?: boolean}> = ({x, z, rot, k, relic}) => {
  if (k <= 0.02) return null;
  const sail = relic ? '#f3eee2' : '#a8452e';
  return (
    <group position={[x, 0, z]} rotation-y={rot} scale={k * (relic ? 1.4 : 1.2)}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.9, 0.45, 2.8]} />
        <meshStandardMaterial color="#6b4428" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.55, 0.9]} castShadow>
        <boxGeometry args={[0.7, 0.3, 0.6]} />
        <meshStandardMaterial color="#8a5a34" roughness={0.9} />
      </mesh>
      {(relic ? [0.1] : [-0.6, 0.5]).map((sz, i) => (
        <mesh key={i} position={[0, 1.45, sz]} castShadow>
          <boxGeometry args={[0.05, 1.6 - i * 0.3, 1.0]} />
          <meshStandardMaterial color={sail} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

// trade junks in the Gulf through the Tambralinga centuries (Song embassies 1001-1070)
const JUNKS = new Array(5).fill(0).map((_, i) => ({
  x: 41.5 + random(`jx${i}`) * 5,
  z0: -46 + random(`jz${i}`) * 90,
  v: (random(`jv${i}`) < 0.5 ? -1 : 1) * (1.6 + random(`js${i}`)),
}));

// ------------------------------------------------------------------ แห่ผ้าขึ้นธาตุ
const PEOPLE = 64;
const segs = PROCESSION.slice(1).map((b, i) => {
  const a = PROCESSION[i];
  return {a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1])};
});
const PATH_LEN = segs.reduce((s, g) => s + g.len, 0);
const pointAt = (d: number) => {
  let r = Math.max(0, Math.min(PATH_LEN, d));
  for (const g of segs) {
    if (r <= g.len) {
      const u = r / g.len;
      return {x: lerp(g.a[0], g.b[0], u), z: lerp(g.a[1], g.b[1], u), rot: Math.atan2(g.b[0] - g.a[0], g.b[1] - g.a[1])};
    }
    r -= g.len;
  }
  const g = segs[segs.length - 1];
  return {x: g.b[0], z: g.b[1], rot: 0};
};
// two abreast, the cloth held overhead between them
const Procession: React.FC<{p: number}> = ({p}) => {
  const body = useRef<THREE.InstancedMesh>(null);
  const head = useRef<THREE.InstancedMesh>(null);
  const cloth = useRef<THREE.InstancedMesh>(null);
  const place = (i: number) => {
    if (p <= 0 || p >= 1) return null;
    const row = Math.floor(i / 2);
    const d = p * (PATH_LEN + PEOPLE * 0.16) - row * 0.32;
    if (d < 0 || d > PATH_LEN) return null;
    const q = pointAt(d);
    const side = (i % 2 ? 1 : -1) * 0.13;
    return {x: q.x + Math.cos(q.rot) * side, z: q.z - Math.sin(q.rot) * side, cx: q.x, cz: q.z, rot: q.rot};
  };
  useLayoutEffect(() => {
    updateInstances(body.current, PEOPLE, (i, o) => {
      const q = place(i);
      if (!q) return false;
      o.position.set(q.x, 0.2, q.z);
      o.rotation.y = q.rot;
      return true;
    });
    updateInstances(head.current, PEOPLE, (i, o) => {
      const q = place(i);
      if (!q) return false;
      o.position.set(q.x, 0.45, q.z);
      return true;
    });
    updateInstances(cloth.current, PEOPLE, (i, o) => {
      const q = i % 2 === 0 ? place(i) : null;
      if (!q) return false;
      o.position.set(q.cx, 0.6, q.cz);
      o.rotation.y = q.rot;
      return true;
    });
  });
  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, PEOPLE]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.4, 6]} />
        <meshStandardMaterial color="#f2efe6" roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={head} args={[undefined, undefined, PEOPLE]}>
        <sphereGeometry args={[0.07, 6, 5]} />
        <meshStandardMaterial color="#c99a72" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={cloth} args={[undefined, undefined, PEOPLE]} castShadow>
        <boxGeometry args={[0.42, 0.04, 0.36]} />
        <meshStandardMaterial color="#f0a020" roughness={0.6} emissive="#f0a020" emissiveIntensity={0.25} />
      </instancedMesh>
    </>
  );
};

export const NakhonSiLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH}) => {
  // legend: the relic boat sails in from the Gulf and comes ashore, then the first stupa rises
  const boatK = 1 - ramp(Y, 345, 360);
  const sail = smooth(Math.min(1, t / 3));
  const boatX = lerp(46, LANDING[0], sail);
  const boatZ = lerp(-16, LANDING[1], sail);
  const k = smooth(ramp(Y, 335, 420));
  // Tambralinga's sea trade
  const trade = ramp(Y, 850, 900) * (1 - ramp(Y, 1450, 1500));
  // 1767-69: Chao Nakhon's men hold the town; Taksin's army comes down from the north
  // (year held at 1767 for ชุมนุมเจ้านคร, then at 1769 through the siege)
  const defend = Y >= 1767.05 && Y < 1769.33;
  const inn = smooth(ramp(Y, 1769.02, 1769.18));
  const enter = smooth(ramp(Y, 1769.33, 1769.42));
  const thonburiAt: [number, number] = [lerp(lerp(3, -0.6, inn), -0.5, enter), lerp(lerp(-48, -20.5, inn), -11.5, enter)];
  const thonburi: Formation = Y >= 1769.0 && Y < 1769.47 ? {at: thonburiAt, face: defend ? [-0.5, -12] : [-0.5, 0]} : null;
  const nakhon: Formation = defend ? {at: [-0.5, -12], face: Y >= 1769.05 ? thonburiAt : [-0.5, -20]} : null;
  // แห่ผ้าขึ้นธาตุ, today: the procession, then the cloth on the chedi
  const proc = ramp(Y, 2017.3, 2022.9);
  const wrap = smooth(ramp(Y, 2022.3, 2024.6));
  const lanka = smooth(ramp(Y, 1180, 1215));
  // the Ho Phra halls: shrines of great age, but the halls standing today are later
  // rebuilds of unknown date -- shown from the late Ayutthaya town on (approximate)
  const ho = smooth(ramp(Y, 1690, 1700));
  return (
    <>
      <Chedi k={k} lanka={lanka} night={night} wrap={wrap} />
      <Ship x={boatX} z={boatZ} rot={Math.atan2(LANDING[0] - 46, LANDING[1] + 16)} k={boatK} relic />
      {trade > 0.02 &&
        JUNKS.map((j, i) => {
          const z = ((((j.z0 + j.v * t + 46) % 92) + 92) % 92) - 46;
          return <Ship key={i} x={j.x} z={z} rot={j.v > 0 ? 0 : Math.PI} k={trade} />;
        })}
      <Army f={thonburi} color="#2e4f8e" terrainH={terrainH} />
      <Army f={nakhon} color="#8e2e2e" terrainH={terrainH} />
      <Procession p={proc} />
      <Slide Y={Y} terrainH={terrainH} />
      <Viharn pos={[HO_PHRA_ISUAN[0], 0, HO_PHRA_ISUAN[1]]} k={ho} scale={0.32} />
      <Viharn pos={[HO_PHRA_NARAI[0], 0, HO_PHRA_NARAI[1]]} k={ho} scale={0.32} />
      <Viharn pos={[PHUTTHASIHING[0], 0, PHUTTHASIHING[1]]} k={ho} scale={0.42} />
    </>
  );
};
