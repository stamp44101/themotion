import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {col, lathe, prism, SMALL_CHEDI, updateInstances} from '../../engine/parts';
import {mix, ramp} from '../../lib';
import {FOUNDED, RAFT} from './timeline';

// Wat Rai Khing on the south bank of the Tha Chin, at landmark scale: 1 unit = 2 m.
// x = east, z = south, y = up. The ubosot faces north, onto the river.
export const TILE = 40; // half-size of the tile
export const RIVER_Z = -18; // south bank of the Tha Chin; water runs north from here
export const UBOSOT: [number, number] = [0, 2];
export const PIER_END: [number, number] = [UBOSOT[0], RIVER_Z - 8];

const C = {
  roof: '#d8622c',
  roofTrim: '#2f7d5a',
  gold: '#d6a83e',
  wall: '#f5f0e6',
  base: '#e6ddcc',
  ground: '#b9c08a',
  court: '#d9cfb9',
  soil: '#8a6a48',
  soilDark: '#6b5038',
  wood: '#a37a52',
};

const Mat: React.FC<{c: string}> = ({c}) => <meshStandardMaterial color={c} roughness={0.85} flatShading />;
/** Window / lamp: dark by day, glowing by night, continuously (light must never snap). */
const Glow: React.FC<{lit: number; day?: string; on?: string}> = ({lit, day = '#7a3b1e', on = '#ffcf7a'}) => (
  <meshStandardMaterial color={mix(day, on, lit)} emissive={on} emissiveIntensity={lit * 2.2} toneMapped={lit < 0.05} roughness={0.8} />
);

/** A Thai gable roof section: ridge along z, base at y = 0. */
const Roof: React.FC<{w: number; h: number; l: number; y: number; z?: number; c?: string}> = ({w, h, l, y, z = 0, c = C.roof}) => {
  const g = useMemo(() => prism(w, h, l), [w, h, l]);
  return (
    <mesh geometry={g} position={[0, y, z]} castShadow receiveShadow>
      <Mat c={c} />
    </mesh>
  );
};

/** Green border along both eaves of a roof section. */
const EaveTrim: React.FC<{w: number; l: number; y: number}> = ({w, l, y}) => (
  <>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[(s * w) / 2, y + 0.05, 0]} castShadow>
        <boxGeometry args={[0.35, 0.22, l + 0.05]} />
        <Mat c={C.roofTrim} />
      </mesh>
    ))}
  </>
);

/** Gilded pediment and finial (chofa) on one gable end. */
const Gable: React.FC<{w: number; h: number; y: number; z: number; dir: 1 | -1}> = ({w, h, y, z, dir}) => {
  const tri = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0);
    s.lineTo(w / 2, 0);
    s.lineTo(0, h);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, [w, h]);
  return (
    <group position={[0, y, z]}>
      <mesh geometry={tri} rotation-y={dir > 0 ? 0 : Math.PI} position={[0, 0, dir * 0.02]}>
        <meshStandardMaterial color={C.gold} metalness={0.4} roughness={0.45} side={THREE.DoubleSide} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * w) / 4, h / 2, dir * 0.06]} rotation-z={-s * Math.atan2(h, w / 2)} castShadow>
          <boxGeometry args={[Math.hypot(w / 2, h) + 0.2, 0.18, 0.14]} />
          <meshStandardMaterial color={C.gold} metalness={0.4} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, h + 0.45, dir * 0.12]} rotation-x={dir * -0.5} castShadow>
        <coneGeometry args={[0.12, 1.1, 5]} />
        <meshStandardMaterial color={C.gold} metalness={0.4} roughness={0.45} />
      </mesh>
    </group>
  );
};

/** The ordination hall: raised base, colonnade, three-tier telescoping roof.
 *  `build` 0..1 raises it in order: base, walls and columns, roof, gables. */
export const Ubosot: React.FC<{lit: number; build: number}> = ({lit, build}) => {
  const L = 20; // 40 m
  const W = 9; // 18 m
  const wallH = 3.4;
  const baseH = 1.0;
  const top = baseH + wallH;
  const cols = useMemo(() => {
    const out: [number, number][] = [];
    for (let z = -L / 2 + 0.6; z <= L / 2 - 0.6; z += 2.2) for (const x of [-W / 2 - 0.2, W / 2 + 0.2]) out.push([x, z]);
    return out;
  }, []);
  const kBase = ramp(build, 0, 0.2);
  const kWall = ramp(build, 0.2, 0.55);
  const kRoof = ramp(build, 0.55, 0.88);
  const kGable = ramp(build, 0.85, 1);
  if (kBase <= 0) return null;
  return (
    <group position={[UBOSOT[0], 0, UBOSOT[1]]}>
      <group scale={[1, kBase, 1]}>
        <mesh position={[0, baseH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[W + 2.4, baseH, L + 2.4]} />
          <Mat c={C.base} />
        </mesh>
        <mesh position={[0, baseH / 4, -L / 2 - 2.2]} receiveShadow>
          <boxGeometry args={[4, baseH / 2, 2.4]} />
          <Mat c={C.base} />
        </mesh>
      </group>
      {kWall > 0 && (
        <group position={[0, baseH, 0]} scale={[1, kWall, 1]}>
          <mesh position={[0, wallH / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[W - 1.2, wallH, L - 1.6]} />
            <Mat c={C.wall} />
          </mesh>
          {[-1, 1].map((d) => (
            <mesh key={d} position={[0, 1.3, d * (L / 2 - 0.78)]}>
              <boxGeometry args={[1.6, 2.6, 0.06]} />
              <Glow lit={lit} />
            </mesh>
          ))}
          {[-1, 1].flatMap((s) =>
            [-6, -3, 0, 3, 6].map((z) => (
              <mesh key={`${s}${z}`} position={[s * (W / 2 - 0.58), 1.8, z]}>
                <boxGeometry args={[0.06, 1.4, 0.9]} />
                <Glow lit={lit} />
              </mesh>
            )),
          )}
          {cols.map(([x, z], i) => (
            <mesh key={i} position={[x, wallH / 2, z]} castShadow>
              <boxGeometry args={[0.45, wallH, 0.45]} />
              <Mat c={C.wall} />
            </mesh>
          ))}
        </group>
      )}
      {/* Two vertical tiers (chan) and telescoping end sections (son), steep pitch,
          green-bordered orange tiles: the silhouette that reads as a Thai ubosot. */}
      {kRoof > 0 && (
        <group position={[0, top, 0]} scale={[kRoof, kRoof, 1]}>
          <Roof w={W + 2.6} h={2.4} l={L + 1.2} y={-0.7} />
          <EaveTrim w={W + 2.6} l={L + 1.2} y={-0.7} />
          <Roof w={W - 0.4} h={5.6} l={L - 7} y={1.1} />
          <EaveTrim w={W - 0.4} l={L - 7} y={1.1} />
          {[-1, 1].map((d) => (
            <group key={d}>
              <Roof w={W - 1.0} h={5.0} l={3.0} y={0.6} z={d * (L / 2 - 3.2)} />
              <Roof w={W - 1.6} h={4.4} l={2.2} y={0.15} z={d * (L / 2 - 0.9)} />
              {kGable > 0 && (
                <group scale={[kGable, kGable, 1]}>
                  <Gable w={W - 1.8} h={4.3} y={0.15} z={d * (L / 2 + 0.22)} dir={d as 1 | -1} />
                </group>
              )}
            </group>
          ))}
        </group>
      )}
      {/* sema boundary stones at the eight directions */}
      {kGable > 0 &&
        Array.from({length: 8}, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.sin(a) * (W / 2 + 3.2), 0.5 * kGable, Math.cos(a) * (L / 2 + 3.2)]} scale={[1, kGable, 1]} castShadow>
              <boxGeometry args={[0.5, 1.0, 0.25]} />
              <Mat c={C.gold} />
            </mesh>
          );
        })}
    </group>
  );
};

const ENC: [number, number] = [9.5, 16];

/** Low white enclosure wall (kamphaeng kaeo) with gates north and south. */
const Enclosure: React.FC<{k: number}> = ({k}) => {
  if (k <= 0) return null;
  const [hx, hz] = ENC;
  const seg = (x: number, z: number, w: number, d: number, key: string) => (
    <mesh key={key} position={[UBOSOT[0] + x, 0.6 * k, UBOSOT[1] + z]} scale={[1, k, 1]} castShadow receiveShadow>
      <boxGeometry args={[w, 1.2, d]} />
      <Mat c={C.wall} />
    </mesh>
  );
  return (
    <>
      {seg(-hx, 0, 0.5, hz * 2, 'w')}
      {seg(hx, 0, 0.5, hz * 2, 'e')}
      {[-1, 1].flatMap((d) => [seg(-(hx + 2) / 2 - 1, d * hz, hx - 2, 0.5, `a${d}`), seg((hx + 2) / 2 + 1, d * hz, hx - 2, 0.5, `b${d}`)])}
      <mesh position={[UBOSOT[0], 0.02, UBOSOT[1]]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[hx * 2, hz * 2]} />
        <meshStandardMaterial color={C.court} roughness={0.9} transparent opacity={k} />
      </mesh>
    </>
  );
};

/** Open preaching hall (sala kan parian). Representative: its date is not in the sources. */
const Sala: React.FC<{x: number; z: number; l: number; w: number; k: number}> = ({x, z, l, w, k}) =>
  k <= 0 ? null : (
    <group position={[x, 0, z]} scale={[1, k, 1]}>
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[w, 0.6, l]} />
        <Mat c={C.base} />
      </mesh>
      {[-1, 1].flatMap((sx) =>
        Array.from({length: Math.floor(l / 2.5) + 1}, (_, i) => (
          <mesh key={`${sx}${i}`} position={[sx * (w / 2 - 0.4), 1.9, -l / 2 + 0.4 + i * ((l - 0.8) / Math.floor(l / 2.5))]} castShadow>
            <boxGeometry args={[0.35, 2.6, 0.35]} />
            <Mat c={C.wall} />
          </mesh>
        )),
      )}
      <Roof w={w + 1.6} h={3.0} l={l + 1} y={3.2} />
    </group>
  );

const BellTower: React.FC<{x: number; z: number; k: number}> = ({x, z, k}) =>
  k <= 0 ? null : (
    <group position={[x, 0, z]} scale={[1, k, 1]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2.4, 2.4, 2.4]} />
        <Mat c={C.wall} />
      </mesh>
      {[-1, 1].flatMap((a) =>
        [-1, 1].map((b) => (
          <mesh key={`${a}${b}`} position={[a * 0.9, 3.4, b * 0.9]} castShadow>
            <boxGeometry args={[0.25, 2.0, 0.25]} />
            <Mat c={C.wall} />
          </mesh>
        )),
      )}
      <mesh position={[0, 4.4, 0]} castShadow>
        <coneGeometry args={[1.9, 2.4, 4]} />
        <Mat c={C.roof} />
      </mesh>
    </group>
  );

const Chedi: React.FC<{x: number; z: number; s: number; k: number}> = ({x, z, s, k}) => {
  const g = useMemo(() => lathe(SMALL_CHEDI, 12), []);
  if (k <= 0) return null;
  return (
    <mesh geometry={g} position={[x, 0, z]} scale={[s, s * k, s]} castShadow>
      <meshStandardMaterial color={C.wall} roughness={0.8} flatShading />
    </mesh>
  );
};

/** River landing; the covered sala at its end (fish feeding) is modern. */
const Pier: React.FC<{k: number; sala: number}> = ({k, sala}) =>
  k <= 0 ? null : (
    <group position={[UBOSOT[0], 0, RIVER_Z]}>
      <mesh position={[0, 0.25, -3.5]} scale={[1, 1, k]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.25, 7]} />
        <Mat c={C.wood} />
      </mesh>
      {sala > 0 && (
        <group position={[0, 0, -8]} scale={[sala, sala, sala]}>
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[8, 0.3, 4.5]} />
            <Mat c={C.wood} />
          </mesh>
          {[-1, 1].flatMap((a) =>
            [-1, 1].map((b) => (
              <mesh key={`${a}${b}`} position={[a * 3.6, 1.4, b * 1.9]} castShadow>
                <boxGeometry args={[0.25, 2.2, 0.25]} />
                <Mat c={C.wall} />
              </mesh>
            )),
          )}
          <group rotation-y={Math.PI / 2}>
            <Roof w={5.6} h={1.8} l={9} y={2.5} />
          </group>
        </group>
      )}
    </group>
  );

/** Floating tile: ground, river strip at the north edge, soil cross-section. */
const Tile: React.FC<{night: number}> = ({night}) => (
  <>
    {/* land 0.6 thick; the river sits in a 0.5-deep bed cut into it */}
    <mesh position={[0, -0.3, (RIVER_Z + TILE) / 2]} receiveShadow>
      <boxGeometry args={[TILE * 2, 0.6, TILE - RIVER_Z]} />
      <Mat c={C.ground} />
    </mesh>
    <mesh position={[0, -0.35, (RIVER_Z - TILE) / 2]} receiveShadow>
      <boxGeometry args={[TILE * 2, 0.5, RIVER_Z + TILE]} />
      <meshStandardMaterial color={mix('#3f8db8', '#1d3f63', night)} roughness={0.15} metalness={0.25} />
    </mesh>
    <mesh position={[0, -3.7, 0]}>
      <boxGeometry args={[TILE * 2, 6.2, TILE * 2]} />
      <Mat c={C.soil} />
    </mesh>
    <mesh position={[0, -7.1, 0]}>
      <boxGeometry args={[TILE * 2 - 0.4, 0.8, TILE * 2 - 0.4]} />
      <Mat c={C.soilDark} />
    </mesh>
    <mesh position={[0, -0.1, RIVER_Z]}>
      <boxGeometry args={[TILE * 2, 0.5, 0.6]} />
      <Mat c="#c7b48a" />
    </mesh>
  </>
);

// --- land use -----------------------------------------------------------------
const inCompound = (x: number, z: number, pad = 0) =>
  Math.abs(x - UBOSOT[0]) < 12 + pad && z > RIVER_Z - 1 && z < UBOSOT[1] + 22 + pad;
const inSala = (x: number, z: number) => x > 16 && x < 28 && z > -5 && z < 15;
/** Ginger plots: the riverside fields that gave the place its name. */
const PLOTS: {x0: number; z0: number; x1: number; z1: number; gone: number}[] = [
  {x0: -11, z0: -12, x1: 11, z1: 22, gone: FOUNDED}, // the temple ground
  {x0: -38, z0: -12, x1: -18, z1: 10, gone: 1960},
  {x0: -38, z0: 14, x1: -18, z1: 36, gone: 1975},
  {x0: 18, z0: 18, x1: 38, z1: 36, gone: 1985},
];
const inPlot = (x: number, z: number) => PLOTS.some((p) => x > p.x0 - 1 && x < p.x1 + 1 && z > p.z0 - 1 && z < p.z1 + 1);

const GingerFields: React.FC<{Y: number}> = ({Y}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const plants = useMemo(() => {
    const out: {x: number; z: number; gone: number; s: number}[] = [];
    PLOTS.forEach((p, n) => {
      for (let z = p.z0; z <= p.z1; z += 1.6)
        for (let x = p.x0; x <= p.x1; x += 0.9)
          out.push({x, z, gone: p.gone + random(`g${n}${x}${z}`) * 6, s: 0.7 + random(`gs${n}${x}${z}`) * 0.5});
    });
    return out;
  }, []);
  useLayoutEffect(() => {
    updateInstances(ref.current, plants.length, (i, o) => {
      const p = plants[i];
      const k = 1 - ramp(Y, p.gone - 3, p.gone);
      if (k <= 0.02) return false;
      o.position.set(p.x, 0.25 * k * p.s, p.z);
      o.scale.set(p.s, p.s * k, p.s);
      return true;
    });
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, plants.length]} castShadow receiveShadow>
      <coneGeometry args={[0.35, 0.6, 5]} />
      <meshStandardMaterial color="#86b24a" roughness={0.9} flatShading />
    </instancedMesh>
  );
};

/** Houses: a few wooden farmhouses early, then the modern town that fills the fields. */
const HOUSES = (() => {
  const out: {x: number; z: number; built: number; modern: boolean; h: number; rot: number}[] = [];
  const early: [number, number][] = [
    [-30, -14], [-16, 12], [-34, 38], [16, 38], [34, 14], [30, -12], [-24, 12],
  ];
  early.forEach(([x, z], i) => out.push({x, z, built: 1820 + i * 6, modern: false, h: 1.6, rot: (i % 2) * Math.PI / 2}));
  PLOTS.slice(1).forEach((p, n) => {
    for (let z = p.z0 + 1.5; z <= p.z1 - 1; z += 5)
      for (let x = p.x0 + 1.5; x <= p.x1 - 1; x += 5) {
        if (random(`hh${n}${x}${z}`) < 0.2) continue;
        out.push({x: x + (random(`hx${n}${x}${z}`) - 0.5), z, built: p.gone + 2 + random(`hb${n}${x}${z}`) * 30, modern: true, h: 2 + random(`hh2${n}${x}${z}`) * 3.5, rot: 0});
      }
  });
  return out;
})();

const Houses: React.FC<{Y: number; lit: number}> = ({Y, lit}) => (
  <>
    {HOUSES.map((h, i) => {
      const k = ramp(Y, h.built, h.built + 3) * (h.modern ? 1 : 1 - ramp(Y, 1965, 1975));
      if (k <= 0) return null;
      return h.modern ? (
        <group key={i} position={[h.x, 0, h.z]} scale={[1, k, 1]}>
          <mesh position={[0, h.h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.4, h.h, 3.6]} />
            <Mat c={['#ece4d6', '#e2d5c0', '#d6dde3'][i % 3]} />
          </mesh>
          <mesh position={[0, h.h * 0.62, 1.81]}>
            <boxGeometry args={[2.4, h.h * 0.35, 0.04]} />
            <Glow lit={lit * (random(`hl${i}`) < 0.75 ? 1 : 0.2)} day="#8a97a3" />
          </mesh>
        </group>
      ) : (
        <group key={i} position={[h.x, 0, h.z]} rotation-y={h.rot} scale={[1, k, 1]}>
          {[-1, 1].flatMap((a) =>
            [-1, 1].map((b) => (
              <mesh key={`${a}${b}`} position={[a * 1.3, 0.5, b * 1.0]}>
                <boxGeometry args={[0.2, 1.0, 0.2]} />
                <Mat c="#6b4a2f" />
              </mesh>
            )),
          )}
          <mesh position={[0, 1.6, 0]} castShadow>
            <boxGeometry args={[3, 1.2, 2.4]} />
            <Mat c="#9a7048" />
          </mesh>
          <Roof w={3.4} h={1.6} l={3.2} y={2.2} c="#7b6a4a" />
        </group>
      );
    })}
  </>
);

const keepClear = (x: number, z: number) =>
  z < RIVER_Z + 3 ||
  inCompound(x, z, 1) ||
  inSala(x, z) ||
  inPlot(x, z) ||
  (Math.abs(x + 14) < 2.6 && z > -15 && z < 33) || // fair lane west of the wall
  Math.hypot(x - 14, z + 10) < 3.5 || // bell tower
  (x > 4 && x < 20 && z > 24 && z < 40); // fair ground (Ferris wheel)

const Trees: React.FC = () => {
  const crowns = useRef<THREE.InstancedMesh>(null);
  const trunks = useRef<THREE.InstancedMesh>(null);
  const trees = useMemo(() => {
    const out: {x: number; z: number; s: number}[] = [];
    for (let i = 0; i < 600 && out.length < 120; i++) {
      const x = (random(`wx${i}`) - 0.5) * (TILE * 2 - 3);
      const z = (random(`wz${i}`) - 0.5) * (TILE * 2 - 3);
      if (!keepClear(x, z)) out.push({x, z, s: 1.1 + random(`ws${i}`) * 1.2});
    }
    return out;
  }, []);
  useLayoutEffect(() => {
    updateInstances(crowns.current, trees.length, (i, o) => {
      const t = trees[i];
      o.position.set(t.x, 1.6 * t.s + 0.8, t.z);
      o.scale.setScalar(t.s);
      return true;
    });
    updateInstances(trunks.current, trees.length, (i, o) => {
      const t = trees[i];
      o.position.set(t.x, 0.8 * t.s, t.z);
      o.scale.setScalar(t.s);
      return true;
    });
  });
  return (
    <>
      <instancedMesh ref={crowns} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#4e8f3a" roughness={0.9} flatShading />
      </instancedMesh>
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 1.6, 5]} />
        <meshStandardMaterial color="#6b4a2f" roughness={1} />
      </instancedMesh>
    </>
  );
};

/** Fair stalls along the bank and the lane west of the wall, and the crowd. */
const STALLS = (() => {
  const out: {x: number; z: number; c: string}[] = [];
  const cs = ['#e85d4a', '#f2c14e', '#4aa3df', '#f2f2f2', '#7bc67b'];
  for (let x = -36; x <= 36; x += 3.2) if (Math.abs(x) > 4) out.push({x, z: RIVER_Z + 2.2, c: cs[Math.abs(Math.round(x * 7)) % cs.length]});
  for (let z = -12; z <= 30; z += 3.2) out.push({x: -14, z, c: cs[Math.abs(Math.round(z * 5)) % cs.length]});
  return out;
})();
const CROWD = (() => {
  const out: [number, number][] = [];
  for (let i = 0; i < 300; i++) {
    const r = random(`pp${i}`);
    if (r < 0.42) out.push([(random(`px${i}`) - 0.5) * 72, RIVER_Z + 3.6 + random(`pz${i}`) * 1.6]);
    else if (r < 0.66) out.push([-12 + random(`px${i}`) * 1.6, -12 + random(`pz${i}`) * 42]);
    else if (r < 0.8) out.push([(random(`px${i}`) - 0.5) * 3, RIVER_Z + 3 + random(`pz${i}`) * 8]);
    else out.push([UBOSOT[0] + (random(`px${i}`) - 0.5) * 16, UBOSOT[1] - 15 + random(`pz${i}`) * 3]);
  }
  return out;
})();

const Fair: React.FC<{k: number; lit: number}> = ({k, lit}) => {
  const people = useRef<THREE.InstancedMesh>(null);
  const n = Math.floor(CROWD.length * k);
  useLayoutEffect(() => {
    updateInstances(people.current, CROWD.length, (i, o) => {
      if (i >= n) return false;
      o.position.set(CROWD[i][0], 0.45, CROWD[i][1]);
      return true;
    });
    const cs = ['#f4f1ea', '#f4f1ea', '#e0a33a', '#d9534f', '#5b8fd1', '#3d3a48', '#e88fb4'];
    for (let i = 0; i < CROWD.length; i++) people.current?.setColorAt(i, col.set(cs[Math.floor(random(`pc${i}`) * cs.length)]));
    if (people.current?.instanceColor) people.current.instanceColor.needsUpdate = true;
  });
  return (
    <>
      {k > 0 &&
        STALLS.map((s, i) => (
          <group key={i} position={[s.x, 0, s.z]} scale={ramp(k, (i % 7) / 10, (i % 7) / 10 + 0.3)}>
            <mesh position={[0, 1.1, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 2.2, 4]} />
              <Mat c="#555" />
            </mesh>
            <mesh position={[0, 2.2, 0]} castShadow>
              <coneGeometry args={[1.5, 0.6, 8]} />
              <Mat c={s.c} />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[1.8, 0.9, 1.0]} />
              <Glow lit={lit} day="#c9a77a" on="#ffd88a" />
            </mesh>
          </group>
        ))}
      <instancedMesh ref={people} args={[undefined, undefined, CROWD.length]} castShadow>
        <capsuleGeometry args={[0.22, 0.5, 2, 6]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
    </>
  );
};

/** Strings of fair lights around the enclosure and along the bank. */
const LIGHTS = (() => {
  const out: [number, number, number][] = [];
  const [hx, hz] = ENC;
  const sag = (u: number) => Math.sin(u * Math.PI * 8) ** 2 * 0.4;
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    out.push([UBOSOT[0] - hx + u * hx * 2, 2.2 - sag(u), UBOSOT[1] - hz]);
    out.push([UBOSOT[0] - hx + u * hx * 2, 2.2 - sag(u), UBOSOT[1] + hz]);
    out.push([UBOSOT[0] - hx, 2.2 - sag(u), UBOSOT[1] - hz + u * hz * 2]);
    out.push([UBOSOT[0] + hx, 2.2 - sag(u), UBOSOT[1] - hz + u * hz * 2]);
  }
  for (let x = -38; x <= 38; x += 0.9) out.push([x, 2.9 - Math.sin(x * 0.9) ** 2 * 0.5, RIVER_Z + 1.2]);
  return out;
})();

const FairLights: React.FC<{k: number}> = ({k}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    updateInstances(ref.current, LIGHTS.length, (i, o) => {
      o.position.set(...LIGHTS[i]);
      o.scale.setScalar(k);
      return k > 0.02;
    });
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, LIGHTS.length]}>
      <sphereGeometry args={[0.14, 6, 4]} />
      <meshBasicMaterial color={mix('#c9b48a', '#ffd27a', k)} toneMapped={false} />
    </instancedMesh>
  );
};

/** Fair Ferris wheel. */
const Wheel: React.FC<{x: number; z: number; spin: number; k: number}> = ({x, z, spin, k}) =>
  k <= 0 ? null : (
    <group position={[x, 0, z]} scale={[k, k, k]}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 2.4, 4.5, 0]} rotation-z={s * 0.2}>
          <boxGeometry args={[0.3, 9.2, 0.3]} />
          <Mat c="#d0d0d0" />
        </mesh>
      ))}
      <group position={[0, 8.6, 0]} rotation-z={spin}>
        <mesh rotation-y={Math.PI / 2}>
          <torusGeometry args={[6.5, 0.12, 6, 40]} />
          <meshBasicMaterial color="#ff7ac8" toneMapped={false} />
        </mesh>
        {Array.from({length: 12}, (_, i) => (
          <group key={i} rotation-x={(i / 12) * Math.PI * 2}>
            <mesh position={[0, 3.25, 0]}>
              <boxGeometry args={[0.08, 6.5, 0.08]} />
              <meshBasicMaterial color={i % 2 ? '#7ad0ff' : '#ffe07a'} toneMapped={false} />
            </mesh>
            <mesh position={[0, 6.5, 0]}>
              <boxGeometry args={[0.9, 0.8, 0.9]} />
              <Mat c={['#e85d4a', '#4aa3df', '#f2c14e'][i % 3]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );

/** Where the raft carrying Luang Pho is in year Y: down the Tha Chin from the west to the landing. */
export const raftAt = (Y: number): [number, number, number] => {
  const u = ramp(Y, RAFT[0], RAFT[1] - 1.5);
  const ease = u * u * (3 - 2 * u);
  return [-46 + (PIER_END[0] - 4 + 46) * ease, 0, PIER_END[1] - 1.2];
};

/** Bamboo raft with the seated bronze Buddha image, monks and polers (the legend). */
const Raft: React.FC<{Y: number}> = ({Y}) => {
  const buddha = useMemo(
    () => lathe([[0, 0], [1.1, 0], [1.1, 0.35], [0.85, 0.45], [0.55, 0.6], [0.45, 1.2], [0.5, 1.5], [0.32, 1.85], [0.2, 2.05], [0.05, 2.5], [0, 2.6]], 10),
    [],
  );
  const k = ramp(Y, RAFT[0] - 0.5, RAFT[0]) * (1 - ramp(Y, RAFT[1] - 0.3, RAFT[1] + 0.5));
  if (k <= 0) return null;
  const [x, , z] = raftAt(Y);
  return (
    <group position={[x, 0, z]} scale={[k, k, k]}>
      {Array.from({length: 9}, (_, i) => (
        <mesh key={i} position={[0, 0.12, -1.6 + i * 0.4]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 7, 6]} />
          <Mat c="#c9b36b" />
        </mesh>
      ))}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.4, 0.3, 2.0]} />
        <Mat c="#9c2f2a" />
      </mesh>
      <mesh geometry={buddha} position={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color="#c9963a" metalness={0.55} roughness={0.35} />
      </mesh>
      {[[-2.6, 0.6], [2.6, -0.6]].map(([px, pz], i) => (
        <group key={i} position={[px, 0.3, pz]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <capsuleGeometry args={[0.22, 0.6, 2, 6]} />
            <Mat c="#3d3a48" />
          </mesh>
          <mesh position={[0.3, 1.0, 0]} rotation-z={-0.5}>
            <cylinderGeometry args={[0.04, 0.04, 3.6, 4]} />
            <Mat c="#6b4a2f" />
          </mesh>
        </group>
      ))}
      {[-1.6, 1.6].map((px) => (
        <mesh key={px} position={[px, 0.85, 0.7]} castShadow>
          <capsuleGeometry args={[0.24, 0.5, 2, 6]} />
          <Mat c="#d9822b" />
        </mesh>
      ))}
    </group>
  );
};

const Boats: React.FC<{Y: number}> = ({Y}) => (
  <>
    {[
      [-24, -30, 0.1, 1820],
      [14, -34, -0.15, 1880],
      [30, -24, 0.05, 1950],
    ].map(([x, z, r, from], i) => {
      const k = ramp(Y, from, from + 5);
      if (k <= 0) return null;
      return (
        <group key={i} position={[x, 0, z]} rotation-y={r} scale={[k, k, k]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[7, 0.6, 1.4]} />
            <Mat c="#7a4b2a" />
          </mesh>
          <mesh position={[0.5, 0.75, 0]} castShadow>
            <boxGeometry args={[3.2, 0.7, 1.2]} />
            <Mat c="#e8d9b0" />
          </mesh>
        </group>
      );
    })}
  </>
);

export type TempleProps = {Y: number; night: number; fair: number; frame: number};

export const Temple: React.FC<TempleProps> = ({Y, night, fair, frame}) => {
  const build = ramp(Y, FOUNDED, FOUNDED + 5);
  return (
    <>
      <hemisphereLight args={[mix('#dfeaff', '#8fa0e0', night), '#7a6a50', 0.9 - night * 0.35]} />
      <directionalLight
        position={[40, 70, 30]}
        intensity={2.3 - night * 1.9}
        color={mix('#fff1d6', '#9fb4ff', night)}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <spotLight position={[UBOSOT[0] + 6, 14, UBOSOT[1] - 30]} target-position={[UBOSOT[0], 4, UBOSOT[1]]} angle={0.5} penumbra={0.6} intensity={900 * night} distance={80} color="#ffc878" />
      <pointLight position={[0, 6, RIVER_Z + 4]} intensity={260 * night} distance={50} color="#ffb860" />
      <Tile night={night} />
      <GingerFields Y={Y} />
      <Enclosure k={ramp(Y, FOUNDED + 3, FOUNDED + 6)} />
      <Ubosot lit={night} build={build} />
      <Sala x={22} z={5} l={16} w={9} k={ramp(Y, 1895, 1900)} />
      <BellTower x={14} z={-10} k={ramp(Y, FOUNDED + 4, FOUNDED + 7)} />
      <Chedi x={-5} z={22} s={1.6} k={ramp(Y, FOUNDED + 5, FOUNDED + 8)} />
      <Chedi x={5} z={22} s={1.6} k={ramp(Y, FOUNDED + 5, FOUNDED + 8)} />
      <Pier k={ramp(Y, FOUNDED + 2, FOUNDED + 5)} sala={ramp(Y, 1990, 2000)} />
      <Trees />
      <Houses Y={Y} lit={night} />
      <Boats Y={Y} />
      <Raft Y={Y} />
      <Fair k={fair} lit={night} />
      <FairLights k={fair} />
      <Wheel x={12} z={32} spin={frame * 0.01} k={fair} />
    </>
  );
};
