import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {col, lathe, prism, SMALL_CHEDI, updateInstances} from '../../engine/parts';

// Wat Rai Khing on the south bank of the Tha Chin, at landmark scale: 1 unit = 2 m.
// x = east, z = south, y = up. The ubosot faces north, onto the river.
export const TILE = 40; // half-size of the tile
export const RIVER_Z = -18; // south bank of the Tha Chin; water runs north from here
export const UBOSOT: [number, number] = [0, 2];

const C = {
  roof: '#d8622c',
  roofTrim: '#2f7d5a',
  gold: '#d6a83e',
  wall: '#f5f0e6',
  base: '#e6ddcc',
  ground: '#b9c08a',
  court: '#d9cfb9',
  water: '#3f8db8',
  soil: '#8a6a48',
  soilDark: '#6b5038',
};

const Mat: React.FC<{c: string; glow?: boolean}> = ({c, glow}) =>
  glow ? <meshBasicMaterial color={c} toneMapped={false} /> : <meshStandardMaterial color={c} roughness={0.85} flatShading />;

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
      {/* bargeboards rising to the chofa */}
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

/** The ordination hall: raised base, colonnade, three-tier telescoping roof. */
export const Ubosot: React.FC<{lit?: number}> = ({lit = 0}) => {
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
  return (
    <group position={[UBOSOT[0], 0, UBOSOT[1]]}>
      {/* stepped base and front stair facing the river */}
      <mesh position={[0, baseH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W + 2.4, baseH, L + 2.4]} />
        <Mat c={C.base} />
      </mesh>
      <mesh position={[0, baseH / 4, -L / 2 - 2.2]} receiveShadow>
        <boxGeometry args={[4, baseH / 2, 2.4]} />
        <Mat c={C.base} />
      </mesh>
      <mesh position={[0, baseH + wallH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W - 1.2, wallH, L - 1.6]} />
        <Mat c={C.wall} />
      </mesh>
      {/* doors and windows, lit from inside at night */}
      {[-1, 1].map((d) => (
        <mesh key={d} position={[0, baseH + 1.3, d * (L / 2 - 0.78)]}>
          <boxGeometry args={[1.6, 2.6, 0.06]} />
          <Mat c={lit > 0.5 ? '#ffcf7a' : '#7a3b1e'} glow={lit > 0.5} />
        </mesh>
      ))}
      {[-1, 1].flatMap((s) =>
        [-6, -3, 0, 3, 6].map((z) => (
          <mesh key={`${s}${z}`} position={[s * (W / 2 - 0.58), baseH + 1.8, z]}>
            <boxGeometry args={[0.06, 1.4, 0.9]} />
            <Mat c={lit > 0.5 ? '#ffcf7a' : '#7a3b1e'} glow={lit > 0.5} />
          </mesh>
        )),
      )}
      {cols.map(([x, z], i) => (
        <mesh key={i} position={[x, baseH + wallH / 2, z]} castShadow>
          <boxGeometry args={[0.45, wallH, 0.45]} />
          <Mat c={C.wall} />
        </mesh>
      ))}
      {/* Two vertical tiers (chan) and telescoping end sections (son), steep pitch,
          green-bordered orange tiles: the silhouette that reads as a Thai ubosot. */}
      <Roof w={W + 2.6} h={2.4} l={L + 1.2} y={top - 0.7} />
      <EaveTrim w={W + 2.6} l={L + 1.2} y={top - 0.7} />
      <Roof w={W - 0.4} h={5.6} l={L - 7} y={top + 1.1} />
      <EaveTrim w={W - 0.4} l={L - 7} y={top + 1.1} />
      {[-1, 1].map((d) => (
        <group key={d}>
          <Roof w={W - 1.0} h={5.0} l={3.0} y={top + 0.6} z={d * (L / 2 - 3.2)} />
          <Roof w={W - 1.6} h={4.4} l={2.2} y={top + 0.15} z={d * (L / 2 - 0.9)} />
          <Gable w={W - 1.8} h={4.3} y={top + 0.15} z={d * (L / 2 + 0.22)} dir={d as 1 | -1} />
        </group>
      ))}
      {/* sema boundary stones at the eight directions */}
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * (W / 2 + 3.2), 0.5, Math.cos(a) * (L / 2 + 3.2)]} castShadow>
            <boxGeometry args={[0.5, 1.0, 0.25]} />
            <Mat c={C.gold} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Low white enclosure wall (kamphaeng kaeo) with gates north and south. */
const Enclosure: React.FC = () => {
  const [hx, hz] = [9.5, 16];
  const seg = (x: number, z: number, w: number, d: number, k: string) => (
    <mesh key={k} position={[UBOSOT[0] + x, 0.6, UBOSOT[1] + z]} castShadow receiveShadow>
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
        <Mat c={C.court} />
      </mesh>
    </>
  );
};

/** Open preaching hall (sala kan parian) east of the ubosot. */
const Sala: React.FC<{x: number; z: number; l: number; w: number}> = ({x, z, l, w}) => (
  <group position={[x, 0, z]}>
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

const BellTower: React.FC<{x: number; z: number}> = ({x, z}) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 1.2, 0]} castShadow>
      <boxGeometry args={[2.4, 2.4, 2.4]} />
      <Mat c={C.wall} />
    </mesh>
    {[-1, 1].flatMap((a) => [-1, 1].map((b) => (
      <mesh key={`${a}${b}`} position={[a * 0.9, 3.4, b * 0.9]} castShadow>
        <boxGeometry args={[0.25, 2.0, 0.25]} />
        <Mat c={C.wall} />
      </mesh>
    )))}
    <mesh position={[0, 4.4, 0]} castShadow>
      <coneGeometry args={[1.9, 2.4, 4]} />
      <Mat c={C.roof} />
    </mesh>
  </group>
);

const Chedi: React.FC<{x: number; z: number; s: number}> = ({x, z, s}) => {
  const g = useMemo(() => lathe(SMALL_CHEDI, 12), []);
  return (
    <mesh geometry={g} position={[x, 0, z]} scale={[s, s, s]} castShadow>
      <meshStandardMaterial color={C.wall} roughness={0.8} flatShading />
    </mesh>
  );
};

/** River landing with a sala at its end, where people feed the fish. */
const Pier: React.FC = () => (
  <group position={[UBOSOT[0], 0, RIVER_Z]}>
    <mesh position={[0, 0.25, -3.5]} castShadow receiveShadow>
      <boxGeometry args={[3, 0.25, 7]} />
      <Mat c="#a37a52" />
    </mesh>
    <group position={[0, 0, -8]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.3, 4.5]} />
        <Mat c="#a37a52" />
      </mesh>
      {[-1, 1].flatMap((a) => [-1, 1].map((b) => (
        <mesh key={`${a}${b}`} position={[a * 3.6, 1.4, b * 1.9]} castShadow>
          <boxGeometry args={[0.25, 2.2, 0.25]} />
          <Mat c={C.wall} />
        </mesh>
      )))}
      <group rotation-y={Math.PI / 2}>
        <Roof w={5.6} h={1.8} l={9} y={2.5} />
      </group>
    </group>
  </group>
);

/** Floating tile: ground, river strip at the north edge, soil cross-section. */
const Tile: React.FC<{water: string}> = ({water}) => (
  <>
    <mesh position={[0, -0.05, (RIVER_Z + TILE) / 2]} receiveShadow>
      <boxGeometry args={[TILE * 2, 0.1, TILE - RIVER_Z]} />
      <Mat c={C.ground} />
    </mesh>
    <mesh position={[0, -0.35, (RIVER_Z - TILE) / 2]} receiveShadow>
      <boxGeometry args={[TILE * 2, 0.5, RIVER_Z + TILE]} />
      <meshStandardMaterial color={water} roughness={0.15} metalness={0.25} />
    </mesh>
    <mesh position={[0, -3.2, 0]}>
      <boxGeometry args={[TILE * 2, 6.2, TILE * 2]} />
      <Mat c={C.soil} />
    </mesh>
    <mesh position={[0, -6.6, 0]}>
      <boxGeometry args={[TILE * 2 - 0.4, 0.8, TILE * 2 - 0.4]} />
      <Mat c={C.soilDark} />
    </mesh>
    {/* bank edge */}
    <mesh position={[0, -0.1, RIVER_Z]}>
      <boxGeometry args={[TILE * 2, 0.5, 0.6]} />
      <Mat c="#c7b48a" />
    </mesh>
  </>
);

const keepClear = (x: number, z: number) =>
  z < RIVER_Z + 3 ||
  (Math.abs(x - UBOSOT[0]) < 12 && Math.abs(z - UBOSOT[1]) < 19) ||
  (x > 15 && x < 30 && z > -6 && z < 16) ||
  (Math.abs(x) < 3 && z < UBOSOT[1]) ||
  (x > 22 && z > 14 && x < 38 && z < 34);

const Trees: React.FC = () => {
  const crowns = useRef<THREE.InstancedMesh>(null);
  const trunks = useRef<THREE.InstancedMesh>(null);
  const trees = useMemo(() => {
    const out: {x: number; z: number; s: number}[] = [];
    for (let i = 0; i < 420 && out.length < 150; i++) {
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
      o.scale.set(t.s, t.s, t.s);
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

/** Market umbrellas along the riverbank path and crowds; `lights` turns on the fair. */
const Market: React.FC<{lights: number}> = ({lights}) => {
  const stalls = useMemo(() => {
    const out: {x: number; z: number; c: string}[] = [];
    const cs = ['#e85d4a', '#f2c14e', '#4aa3df', '#f2f2f2', '#7bc67b'];
    for (let x = -36; x <= 36; x += 3.2) if (Math.abs(x) > 4) out.push({x, z: RIVER_Z + 2.2, c: cs[Math.abs(Math.round(x * 7)) % cs.length]});
    for (let z = -12; z <= 30; z += 3.2) out.push({x: -14, z, c: cs[Math.abs(Math.round(z * 5)) % cs.length]});
    return out;
  }, []);
  const people = useRef<THREE.InstancedMesh>(null);
  const crowd = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < 260; i++) {
      const r = random(`pp${i}`);
      if (r < 0.45) out.push([(random(`px${i}`) - 0.5) * 72, RIVER_Z + 3.6 + random(`pz${i}`) * 1.6]);
      else if (r < 0.7) out.push([-12 + random(`px${i}`) * 1.6, -12 + random(`pz${i}`) * 42]);
      else if (r < 0.85) out.push([(random(`px${i}`) - 0.5) * 3, RIVER_Z + 3 + random(`pz${i}`) * 8]);
      else out.push([UBOSOT[0] + (random(`px${i}`) - 0.5) * 16, UBOSOT[1] - 15 + random(`pz${i}`) * 3]);
    }
    return out;
  }, []);
  useLayoutEffect(() => {
    updateInstances(people.current, crowd.length, (i, o) => {
      o.position.set(crowd[i][0], 0.45, crowd[i][1]);
      return true;
    });
    const cs = ['#f4f1ea', '#f4f1ea', '#e0a33a', '#d9534f', '#5b8fd1', '#3d3a48', '#e88fb4'];
    for (let i = 0; i < crowd.length; i++) people.current?.setColorAt(i, col.set(cs[Math.floor(random(`pc${i}`) * cs.length)]));
    if (people.current?.instanceColor) people.current.instanceColor.needsUpdate = true;
  });
  return (
    <>
      {stalls.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]}>
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
            <Mat c={lights > 0.5 ? '#ffd88a' : '#c9a77a'} glow={lights > 0.5} />
          </mesh>
        </group>
      ))}
      <instancedMesh ref={people} args={[undefined, undefined, crowd.length]} castShadow>
        <capsuleGeometry args={[0.22, 0.5, 2, 6]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
    </>
  );
};

/** Strings of fair lights around the enclosure and along the bank. */
const FairLights: React.FC = () => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const pts = useMemo(() => {
    const out: [number, number, number][] = [];
    const [hx, hz] = [9.5, 16];
    for (let i = 0; i <= 40; i++) {
      const u = i / 40;
      out.push([UBOSOT[0] - hx + u * hx * 2, 2.2 - Math.sin(u * Math.PI * 8) ** 2 * 0.4, UBOSOT[1] - hz]);
      out.push([UBOSOT[0] - hx + u * hx * 2, 2.2 - Math.sin(u * Math.PI * 8) ** 2 * 0.4, UBOSOT[1] + hz]);
      out.push([UBOSOT[0] - hx, 2.2 - Math.sin(u * Math.PI * 8) ** 2 * 0.4, UBOSOT[1] - hz + u * hz * 2]);
      out.push([UBOSOT[0] + hx, 2.2 - Math.sin(u * Math.PI * 8) ** 2 * 0.4, UBOSOT[1] - hz + u * hz * 2]);
    }
    for (let x = -38; x <= 38; x += 0.9) out.push([x, 2.9 - Math.sin(x * 0.9) ** 2 * 0.5, RIVER_Z + 1.2]);
    return out;
  }, []);
  useLayoutEffect(() => {
    updateInstances(ref.current, pts.length, (i, o) => {
      o.position.set(...pts[i]);
      return true;
    });
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, pts.length]}>
      <sphereGeometry args={[0.14, 6, 4]} />
      <meshBasicMaterial color="#ffd27a" toneMapped={false} />
    </instancedMesh>
  );
};

/** Fair Ferris wheel (a fixture of Thai temple fairs). */
const Wheel: React.FC<{x: number; z: number; spin: number}> = ({x, z, spin}) => (
  <group position={[x, 0, z]}>
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

const Boats: React.FC = () => (
  <>
    {[
      [-24, -26, 0.1],
      [14, -31, -0.15],
      [30, -22, 0.05],
    ].map(([x, z, r], i) => (
      <group key={i} position={[x, 0, z]} rotation-y={r}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[7, 0.6, 1.4]} />
          <Mat c="#7a4b2a" />
        </mesh>
        <mesh position={[0.5, 0.75, 0]} castShadow>
          <boxGeometry args={[3.2, 0.7, 1.2]} />
          <Mat c="#e8d9b0" />
        </mesh>
      </group>
    ))}
  </>
);

export type TempleProps = {night: number; fair: number; frame: number};

export const Temple: React.FC<TempleProps> = ({night, fair, frame}) => (
  <>
    <hemisphereLight args={[night > 0.5 ? '#8fa0e0' : '#dfeaff', '#7a6a50', 0.9 - night * 0.35]} />
    {night > 0.5 && <spotLight position={[UBOSOT[0] + 6, 14, UBOSOT[1] - 30]} target-position={[UBOSOT[0], 4, UBOSOT[1]]} angle={0.5} penumbra={0.6} intensity={900} distance={80} color="#ffc878" />}
    {night > 0.5 && <pointLight position={[0, 6, RIVER_Z + 4]} intensity={260} distance={50} color="#ffb860" />}
    <directionalLight
      position={[40, 70, 30]}
      intensity={2.3 - night * 1.9}
      color={night > 0.5 ? '#9fb4ff' : '#fff1d6'}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-50}
      shadow-camera-right={50}
      shadow-camera-top={50}
      shadow-camera-bottom={-50}
    />
    <Tile water={night > 0.5 ? '#1d3f63' : C.water} />
    <Enclosure />
    <Ubosot lit={night} />
    <Sala x={22} z={5} l={16} w={9} />
    <BellTower x={-14} z={-8} />
    <Chedi x={-5} z={22} s={1.6} />
    <Chedi x={5} z={22} s={1.6} />
    <Pier />
    <Trees />
    <Boats />
    <Market lights={fair} />
    {fair > 0.5 && <FairLights />}
    {fair > 0.5 && <Wheel x={30} z={24} spin={frame * 0.01} />}
  </>
);
