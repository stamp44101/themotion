import {useThree} from '@react-three/fiber';
import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {FPS, keyColor, lerp, lighting, mix, ramp, smooth, yearAt} from '../lib';
import {BUILD_PALETTES, GROUND} from '../Scene';
import {applyCamera, isoCamera} from './isoCamera';
import {
  BOATS,
  BUILDINGS,
  CLOUDS,
  DOI_SUTHEP_TEMPLE,
  HOUSES,
  KUKUT,
  VILLAGE,
  LANTERNS,
  LAWA_HUTS,
  PADDIES,
  RAIL_X,
  RIVER_W,
  RIVER_X,
  ROAD_PATH,
  TILE,
  TILE_C,
  TILE_S,
  TREES,
  terrainH,
} from './world';

const useT = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return {frame, t, Y: yearAt(t)};
};

const o3 = new THREE.Object3D();
const col = new THREE.Color();

// Write instance matrices; fn returns false to hide an instance.
const updateInstances = (mesh: THREE.InstancedMesh | null, n: number, fn: (i: number, o: THREE.Object3D) => boolean) => {
  if (!mesh) return;
  for (let i = 0; i < n; i++) {
    o3.position.set(0, 0, 0);
    o3.rotation.set(0, 0, 0);
    o3.scale.set(1, 1, 1);
    if (!fn(i, o3)) o3.scale.set(0, 0, 0);
    o3.updateMatrix();
    mesh.setMatrixAt(i, o3.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
};

const prism = (w: number, h: number, l: number) => {
  const x = w / 2;
  const z = l / 2;
  const v = [
    // front + back gables
    [-x, 0, z], [x, 0, z], [0, h, z],
    [x, 0, -z], [-x, 0, -z], [0, h, -z],
    // left slope
    [-x, 0, -z], [-x, 0, z], [0, h, z], [-x, 0, -z], [0, h, z], [0, h, -z],
    // right slope
    [x, 0, z], [x, 0, -z], [0, h, -z], [x, 0, z], [0, h, -z], [0, h, z],
  ].flat();
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.computeVertexNormals();
  return g;
};

const lathe = (pts: [number, number][], seg = 8) =>
  new THREE.LatheGeometry(
    pts.map(([r, y]) => new THREE.Vector2(r, y)),
    seg,
  );

const BELL_LOW: [number, number][] = [[0, 0], [1.3, 0], [1.3, 0.25], [1.15, 0.3], [1.2, 0.9], [1.12, 1.25], [0.85, 1.32], [0, 1.28]];
const BELL_TOP: [number, number][] = [[0, 1.25], [1.12, 1.25], [1.05, 1.5], [0.75, 1.9], [0.45, 2.05], [0.3, 2.1], [0, 2.1]];
const SMALL_CHEDI: [number, number][] = [
  [0, 0], [1.0, 0], [1.0, 0.3], [0.8, 0.3], [0.8, 0.55], [0.62, 0.6], [0.65, 1.1], [0.5, 1.5], [0.25, 1.7], [0.12, 2.6], [0, 2.9],
];

const windowTexture = () => {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 128;
  const g = c.getContext('2d')!;
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 64, 128);
  g.fillStyle = '#7d8a96';
  for (let y = 8; y < 120; y += 16) for (let x = 6; x < 60; x += 14) g.fillRect(x, y, 8, 9);
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  const e = document.createElement('canvas');
  e.width = 64;
  e.height = 128;
  const ge = e.getContext('2d')!;
  ge.fillStyle = '#000000';
  ge.fillRect(0, 0, 64, 128);
  for (let y = 8; y < 120; y += 16)
    for (let x = 6; x < 60; x += 14) {
      ge.fillStyle = Math.sin(x * 7.1 + y * 3.3) > -0.3 ? '#ffd27a' : '#000000';
      ge.fillRect(x, y, 8, 9);
    }
  const emap = new THREE.CanvasTexture(e);
  emap.colorSpace = THREE.SRGBColorSpace;
  return {map, emap};
};

const glowTexture = (inner: string, outer: string) => {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.3, outer);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

// ------------------------------------------------------------------ camera, lights, sync
const CameraRig: React.FC = () => {
  const {t} = useT();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    applyCamera(camera, isoCamera(t));
  }, [camera, t]);
  return null;
};

const FrameSync: React.FC = () => {
  const frame = useCurrentFrame();
  const advance = useThree((s) => s.advance);
  useLayoutEffect(() => {
    advance(performance.now());
  }, [advance, frame]);
  return null;
};

export const sunState = (t: number) => {
  const {cyc, night, intro, finale} = lighting(t);
  const day = intro ? 0.25 + t / 3 * 0.25 : cyc / 0.72;
  const th = Math.PI * Math.min(1, Math.max(0, day));
  const elev = Math.sin(th);
  const dir = new THREE.Vector3(Math.cos(th) * 1.0, Math.max(0.05, elev) * 1.1, 0.45).normalize();
  const vis = (intro ? 1 : cyc < 0.72 ? 1 : 0) * (1 - finale);
  return {dir, elev, vis, night};
};

const Lights: React.FC = () => {
  const {t} = useT();
  const {dir, elev, vis, night} = sunState(t);
  const target = isoCamera(t).target;
  const sun = useRef<THREE.DirectionalLight>(null);
  const tgt = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    tgt.position.set(TILE_C[0], 0, TILE_C[1]);
    tgt.updateMatrixWorld();
    if (sun.current) sun.current.target = tgt;
  });
  const warm = 1 - Math.min(1, elev * 2.2);
  const sunCol = mix('#fff4e0', '#ff9a4a', warm);
  const sunI = vis * Math.max(0, elev) ** 0.6 * 3.0 * (1 - night);
  return (
    <>
      <primitive object={tgt} />
      <hemisphereLight args={[mix('#cfe3ff', '#4a5a9a', night), mix('#6f8a4a', '#1a2440', night), lerp(1.2, 1.05, night)]} />
      <directionalLight
        ref={sun}
        position={[TILE_C[0] + dir.x * 150, dir.y * 150, TILE_C[1] + dir.z * 150]}
        intensity={sunI}
        color={sunCol}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-camera-near={1}
        shadow-camera-far={500}
        shadow-bias={-0.0006}
      />
      <directionalLight position={[target[0] - 60, 90, target[2] - 30]} intensity={1.7 * night} color="#9fb4ff" />
    </>
  );
};

// ------------------------------------------------------------------ ground & terrain
const Ground: React.FC = () => {
  const {Y} = useT();
  const burm = ramp(Y, 1556, 1563) * (1 - ramp(Y, 1775, 1792));
  const ground = mix(keyColor(GROUND, Y), '#8c8a70', burm * 0.4);
  const {terrain, skirt} = useMemo(() => {
    const seg = 96;
    const g = new THREE.PlaneGeometry(TILE_S, TILE_S, seg, seg);
    g.rotateX(-Math.PI / 2);
    g.translate(TILE_C[0], 0, TILE_C[1]);
    const pos = g.attributes.position;
    const colors: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = terrainH(x, z);
      pos.setY(i, h > 0.15 ? h : 0);
      // flat land is tinted by the era colour (material colour); slopes are forest green
      const m = Math.min(1, h / 3);
      const c = new THREE.Color('#ffffff').lerp(new THREE.Color(h > 26 ? '#7d9a74' : '#5f8c5a'), m);
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    // soil cross-section along the four edges
    const v: number[] = [];
    const BOT = -1.4;
    const edge = (ax: number, az: number, bx: number, bz: number) => {
      const n = 120;
      for (let i = 0; i < n; i++) {
        const x0 = lerp(ax, bx, i / n);
        const z0 = lerp(az, bz, i / n);
        const x1 = lerp(ax, bx, (i + 1) / n);
        const z1 = lerp(az, bz, (i + 1) / n);
        const h0 = Math.max(0, terrainH(x0, z0));
        const h1 = Math.max(0, terrainH(x1, z1));
        v.push(x0, h0 > 0.15 ? h0 : 0, z0, x0, BOT, z0, x1, BOT, z1, x0, h0 > 0.15 ? h0 : 0, z0, x1, BOT, z1, x1, h1 > 0.15 ? h1 : 0, z1);
      }
    };
    edge(TILE.x0, TILE.z1, TILE.x1, TILE.z1);
    edge(TILE.x1, TILE.z1, TILE.x1, TILE.z0);
    edge(TILE.x1, TILE.z0, TILE.x0, TILE.z0);
    edge(TILE.x0, TILE.z0, TILE.x0, TILE.z1);
    const s = new THREE.BufferGeometry();
    s.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    s.computeVertexNormals();
    return {terrain: g.toNonIndexed(), skirt: s};
  }, []);
  return (
    <>
      <mesh geometry={terrain} receiveShadow castShadow>
        <meshStandardMaterial vertexColors flatShading roughness={1} color={ground} />
      </mesh>
      <mesh geometry={skirt} castShadow>
        <meshStandardMaterial color="#6b4a2e" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[TILE_C[0], -1.4 - 2.2, TILE_C[1]]} castShadow receiveShadow>
        <boxGeometry args={[TILE_S, 4.4, TILE_S]} />
        <meshStandardMaterial color="#a8774c" roughness={1} />
      </mesh>
      <mesh position={[TILE_C[0], -1.4 - 4.4 - 0.9, TILE_C[1]]} castShadow>
        <boxGeometry args={[TILE_S, 1.8, TILE_S]} />
        <meshStandardMaterial color="#7d6a5c" roughness={1} />
      </mesh>
    </>
  );
};

const Paddies: React.FC = () => {
  const {Y} = useT();
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    PADDIES.forEach((p, i) => {
      const urban = ramp(Y, p.urban, p.urban + 8);
      const tone = (Math.sin(Y * 0.9 + i) + 1) / 2;
      col.set(urban > 0.5 ? '#a8a597' : mix(mix('#8fbf55', '#d8c45e', tone * 0.7), '#a8a597', urban));
      m.setColorAt(i, col);
    });
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    updateInstances(m, PADDIES.length, (i, o) => {
      const p = PADDIES[i];
      const k = ramp(Y, p.appear, p.appear + 30);
      o.position.set(p.x, 0.03, p.z);
      o.scale.set(3.6 * k, 1, 3.6 * k);
      return k > 0.02;
    });
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, PADDIES.length]} receiveShadow>
      <boxGeometry args={[1, 0.06, 1]} />
      <meshStandardMaterial roughness={1} />
    </instancedMesh>
  );
};

const Water: React.FC = () => {
  const {Y, frame} = useT();
  const burm = ramp(Y, 1556, 1563) * (1 - ramp(Y, 1775, 1792));
  const water = mix('#3f8fc0', '#617a86', burm * 0.6);
  const p = ramp(Y, 1294.4, 1296.0) * 4;
  // east, north, west, south — dug in sequence from Tha Phae gate
  const sides: [number, number, number, number][] = [
    [11.4, 0, 0, 0],
    [0, -11.4, Math.PI / 2, 1],
    [-11.4, 0, 0, 2],
    [0, 11.4, Math.PI / 2, 3],
  ];
  return (
    <>
      <mesh position={[RIVER_X, -0.6, TILE_C[1]]} receiveShadow>
        <boxGeometry args={[RIVER_W, 1.4, TILE_S + 0.08]} />
        <meshStandardMaterial color={water} roughness={0.12} metalness={0.25} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[RIVER_X + (s * RIVER_W) / 2, 0.08, TILE_C[1]]}>
          <boxGeometry args={[0.35, 0.1, TILE_S]} />
          <meshStandardMaterial color="#b9a77c" roughness={1} />
        </mesh>
      ))}
      {new Array(40).fill(0).map((_, i) => {
        const z = ((i * 23.7 + frame * 0.12) % 90) - 49;
        return (
          <mesh key={`fl${i}`} position={[RIVER_X - 1.8 + ((i * 1.37) % 3.6), 0.1, z]}>
            <boxGeometry args={[0.06, 0.01, 1.2]} />
            <meshBasicMaterial color="#d9f0ff" transparent opacity={0.45} />
          </mesh>
        );
      })}
      {sides.map(([x, z, rot, i]) => {
        const k = Math.min(1, Math.max(0, p - i));
        if (k <= 0) return null;
        return (
          <mesh key={i} position={[x, 0.05, z]} rotation-y={rot} receiveShadow>
            <boxGeometry args={[1.4, 0.06, 24.2 * k]} />
            <meshStandardMaterial color={water} roughness={0.12} metalness={0.25} />
          </mesh>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ vegetation
const Trees: React.FC = () => {
  const {Y} = useT();
  const trunk = useRef<THREE.InstancedMesh>(null);
  const crown = useRef<THREE.InstancedMesh>(null);
  const crown2 = useRef<THREE.InstancedMesh>(null);
  const scales = useMemo(() => new Float32Array(TREES.length), []);
  useLayoutEffect(() => {
    TREES.forEach((tr, i) => {
      let k = Y < tr.clear ? 1 : 1 - ramp(Y, tr.clear, tr.clear + 2);
      if (tr.regrow && Y > tr.regrow[0]) {
        k = Math.max(k, ramp(Y, tr.regrow[0], tr.regrow[0] + 50) * (1 - ramp(Y, tr.regrow[1], tr.regrow[1] + 4)));
      }
      scales[i] = k;
    });
    updateInstances(trunk.current, TREES.length, (i, o) => {
      const tr = TREES[i];
      const k = scales[i] * tr.s;
      o.position.set(tr.x, tr.y + 0.35 * k, tr.z);
      o.scale.set(k, k, k);
      return k > 0.02;
    });
    updateInstances(crown.current, TREES.length, (i, o) => {
      const tr = TREES[i];
      const k = scales[i] * tr.s;
      o.position.set(tr.x, tr.y + 1.15 * k, tr.z);
      o.rotation.set(tr.tint * 3, tr.tint * 7, 0);
      o.scale.set(k, k * 1.1, k);
      return k > 0.02;
    });
    updateInstances(crown2.current, TREES.length, (i, o) => {
      const tr = TREES[i];
      const k = scales[i] * tr.s * (tr.tint > 0.45 ? 1 : 0);
      o.position.set(tr.x + 0.25 * k, tr.y + 1.75 * k, tr.z - 0.15 * k);
      o.rotation.set(tr.tint * 5, tr.tint * 2, 0);
      o.scale.set(k * 0.62, k * 0.62, k * 0.62);
      return k > 0.02;
    });
  });
  useLayoutEffect(() => {
    TREES.forEach((tr, i) => {
      col.set(tr.tint < 0.33 ? '#3f7d3a' : tr.tint < 0.66 ? '#4f8f3f' : '#2f6a36');
      crown.current?.setColorAt(i, col);
      col.offsetHSL(0.01, 0, 0.06);
      crown2.current?.setColorAt(i, col);
    });
  }, []);
  return (
    <>
      <instancedMesh ref={trunk} args={[undefined, undefined, TREES.length]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 0.7, 5]} />
        <meshStandardMaterial color="#6b4a32" flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crown} args={[undefined, undefined, TREES.length]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial flatShading roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={crown2} args={[undefined, undefined, TREES.length]} castShadow>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial flatShading roughness={0.95} />
      </instancedMesh>
    </>
  );
};

// ------------------------------------------------------------------ city
const Houses: React.FC = () => {
  const {Y} = useT();
  const body = useRef<THREE.InstancedMesh>(null);
  const roof = useRef<THREE.InstancedMesh>(null);
  const modern = useRef<THREE.InstancedMesh>(null);
  const roofGeo = useMemo(() => prism(1.05, 0.6, 0.85), []);
  const {map, emap} = useMemo(windowTexture, []);
  const {night} = lighting(useT().t);
  const state = useMemo(() => new Float32Array(HOUSES.length * 2), []);
  useLayoutEffect(() => {
    HOUSES.forEach((h, i) => {
      const trad =
        smooth(ramp(Y, h.built, h.built + 6)) * (1 - ramp(Y, h.gone, h.gone + 10)) +
        (Y > h.rebuilt ? smooth(ramp(Y, h.rebuilt, h.rebuilt + 4)) : 0);
      const mod = smooth(ramp(Y, h.modern, h.modern + 5));
      state[i * 2] = mod > 0.02 ? 0 : Math.min(1, trad);
      state[i * 2 + 1] = mod;
    });
    updateInstances(body.current, HOUSES.length, (i, o) => {
      const h = HOUSES[i];
      const k = state[i * 2];
      o.position.set(h.x, 0.22 * k, h.z);
      o.rotation.y = h.rot;
      o.scale.set(1, k, 1);
      return k > 0.02;
    });
    updateInstances(roof.current, HOUSES.length, (i, o) => {
      const h = HOUSES[i];
      const k = state[i * 2];
      o.position.set(h.x, 0.44 * k, h.z);
      o.rotation.y = h.rot;
      o.scale.set(1, k, 1);
      return k > 0.02;
    });
    updateInstances(modern.current, HOUSES.length, (i, o) => {
      const h = HOUSES[i];
      const k = state[i * 2 + 1];
      o.position.set(h.x, (h.modernH * k) / 2, h.z);
      o.rotation.y = h.rot;
      o.scale.set(0.95, h.modernH * k, 0.8);
      return k > 0.02;
    });
  });
  useLayoutEffect(() => {
    HOUSES.forEach((h, i) => {
      col.set(BUILD_PALETTES[h.palette][0]);
      modern.current?.setColorAt(i, col);
    });
  }, []);
  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, HOUSES.length]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.44, 0.65]} />
        <meshStandardMaterial color="#9a6a45" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={roof} args={[roofGeo, undefined, HOUSES.length]} castShadow>
        <meshStandardMaterial color="#5a3420" roughness={0.9} flatShading side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={modern} args={[undefined, undefined, HOUSES.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={map} emissiveMap={emap} emissive="#ffb85a" emissiveIntensity={night * 1.4} roughness={0.85} />
      </instancedMesh>
    </>
  );
};

const Village: React.FC = () => {
  const {Y} = useT();
  const body = useRef<THREE.InstancedMesh>(null);
  const roof = useRef<THREE.InstancedMesh>(null);
  const roofGeo = useMemo(() => prism(1.05, 0.6, 0.85), []);
  useLayoutEffect(() => {
    const k = (i: number) => {
      const v = VILLAGE[i];
      return smooth(ramp(Y, v.built, v.built + 8)) * (1 - ramp(Y, v.urban, v.urban + 4)) * (1 - 0.6 * ramp(Y, 1600, 1700) * (1 - ramp(Y, 1790, 1810)));
    };
    updateInstances(body.current, VILLAGE.length, (i, o) => {
      const v = VILLAGE[i];
      const s = k(i);
      o.position.set(v.x, 0.22 * s, v.z);
      o.rotation.y = v.rot;
      o.scale.set(1, s, 1);
      return s > 0.02;
    });
    updateInstances(roof.current, VILLAGE.length, (i, o) => {
      const v = VILLAGE[i];
      const s = k(i);
      o.position.set(v.x, 0.44 * s, v.z);
      o.rotation.y = v.rot;
      o.scale.set(1, s, 1);
      return s > 0.02;
    });
  });
  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, VILLAGE.length]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.44, 0.65]} />
        <meshStandardMaterial color="#9a6a45" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={roof} args={[roofGeo, undefined, VILLAGE.length]} castShadow>
        <meshStandardMaterial color="#5a3420" roughness={0.9} flatShading side={THREE.DoubleSide} />
      </instancedMesh>
    </>
  );
};

const Buildings: React.FC = () => {
  const {Y, t} = useT();
  const ref = useRef<THREE.InstancedMesh>(null);
  const {map, emap} = useMemo(windowTexture, []);
  const {night} = lighting(t);
  useLayoutEffect(() => {
    updateInstances(ref.current, BUILDINGS.length, (i, o) => {
      const b = BUILDINGS[i];
      const g = smooth(ramp(Y, b.built, b.built + 6));
      o.position.set(b.x, (b.h * g) / 2, b.z);
      o.scale.set(b.w, Math.max(0.001, b.h * g), b.d);
      return g > 0.02;
    });
  });
  useLayoutEffect(() => {
    BUILDINGS.forEach((b, i) => {
      col.set(BUILD_PALETTES[b.palette][0]);
      ref.current?.setColorAt(i, col);
    });
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, BUILDINGS.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={map} emissiveMap={emap} emissive="#ffb85a" emissiveIntensity={night * 1.5} roughness={0.8} />
    </instancedMesh>
  );
};

const BRICK = '#b0603e';
const Walls: React.FC = () => {
  const {Y} = useT();
  const decay = ramp(Y, 1600, 1720) * (1 - ramp(Y, 1790, 1800));
  const h = 1.3 * smooth(ramp(Y, 1295.4, 1297.2)) * (1 - 0.4 * decay);
  const gk = smooth(ramp(Y, 1296.4, 1297.6));
  const cren = useRef<THREE.InstancedMesh>(null);
  const N = 34;
  useLayoutEffect(() => {
    updateInstances(cren.current, N * 4, (i, o) => {
      const side = Math.floor(i / N);
      const s = -10 + ((i % N) + 0.5) * (20 / N);
      const [x, z] = side === 0 ? [10, s] : side === 1 ? [s, -10] : side === 2 ? [-10, s] : [s, 10];
      o.position.set(x, h + 0.14, z);
      return h > 0.3;
    });
  });
  const city = ramp(Y, 1295, 1296.5);
  if (h < 0.02 && city <= 0) return null;
  const earth = Y > 1940 ? mix('#a39a72', '#a9a596', ramp(Y, 1940, 1990)) : '#a89c70';
  const gates: [number, number, number, number][] = [
    [10, 0, 0, 2.6], // Tha Phae (east)
    [0, -10, Math.PI / 2, 2.1], // Chang Phueak (north)
    [-10, 0, 0, 2.1], // Suan Dok (west)
    [1.5, 10, Math.PI / 2, 2.1], // Chiang Mai (south)
    [-5.5, 10, Math.PI / 2, 2.0], // Suan Prung (south-west)
  ];
  return (
    <>
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={earth} transparent opacity={city * 0.85} roughness={1} />
      </mesh>
      {h > 0.02 && (
        <>
          {[
            [10, 0, 0],
            [-10, 0, 0],
            [0, 10, Math.PI / 2],
            [0, -10, Math.PI / 2],
          ].map(([x, z, r], i) => (
            <mesh key={i} position={[x, h / 2, z]} rotation-y={r} castShadow receiveShadow>
              <boxGeometry args={[0.55, h, 20.4]} />
              <meshStandardMaterial color={BRICK} roughness={0.95} />
            </mesh>
          ))}
          {[
            [10, 10],
            [10, -10],
            [-10, 10],
            [-10, -10],
          ].map(([x, z], i) => (
            <mesh key={`b${i}`} position={[x, (h * 1.25) / 2, z]} castShadow>
              <boxGeometry args={[1.7, h * 1.25, 1.7]} />
              <meshStandardMaterial color="#9c5236" roughness={0.95} />
            </mesh>
          ))}
          <instancedMesh ref={cren} args={[undefined, undefined, N * 4]} castShadow>
            <boxGeometry args={[0.32, 0.28, 0.32]} />
            <meshStandardMaterial color="#c47652" roughness={0.95} />
          </instancedMesh>
          {gk > 0.02 &&
            gates.map(([x, z, r, w], i) => (
              <group key={`g${i}`} position={[x, 0, z]} rotation-y={r}>
                <mesh position={[0, (h * 1.6 * gk) / 2, 0]} castShadow>
                  <boxGeometry args={[1.1, h * 1.6 * gk, w]} />
                  <meshStandardMaterial color="#a9583a" roughness={0.95} />
                </mesh>
                <mesh position={[0, h * 0.35 * gk, 0]}>
                  <boxGeometry args={[1.14, h * 0.7 * gk, w * 0.32]} />
                  <meshStandardMaterial color="#3b2016" roughness={1} />
                </mesh>
              </group>
            ))}
        </>
      )}
    </>
  );
};

const ChediLuang: React.FC = () => {
  const {Y, t} = useT();
  const prog = smooth(ramp(Y, 1392, 1475));
  const gold = ramp(Y, 1440, 1475);
  const broken = Y >= 1545;
  const fall = ramp(Y, 1545, 1545.7);
  const {night} = lighting(t);
  const low = useMemo(() => lathe(BELL_LOW, 10), []);
  const top = useMemo(() => lathe(BELL_TOP, 10), []);
  if (prog < 0.01) return null;
  const brick = '#b5653f';
  return (
    <group scale={[1, prog, 1]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 1, 6]} />
        <meshStandardMaterial color={brick} roughness={0.95} />
      </mesh>
      {new Array(16).fill(0).map((_, i) => {
        const s = (i % 4) - 1.5;
        const side = Math.floor(i / 4);
        const [x, z] = side === 0 ? [3.05, s * 1.3] : side === 1 ? [-3.05, s * 1.3] : side === 2 ? [s * 1.3, 3.05] : [s * 1.3, -3.05];
        return (
          <mesh key={i} position={[x, 0.75, z]} castShadow>
            <boxGeometry args={[0.45, 0.55, 0.45]} />
            <meshStandardMaterial color="#8f8a80" roughness={1} />
          </mesh>
        );
      })}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 1, 4.8]} />
        <meshStandardMaterial color="#a65a3a" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 1.2, 3.6]} />
        <meshStandardMaterial color={brick} roughness={0.95} />
      </mesh>
      <mesh position={[3.4, 1.1, 0]} rotation-z={0.55} castShadow>
        <boxGeometry args={[2.6, 0.25, 1.0]} />
        <meshStandardMaterial color="#c07a52" roughness={1} />
      </mesh>
      <mesh geometry={low} position={[0, 3.2, 0]} scale={1.3} castShadow>
        <meshStandardMaterial color={brick} roughness={0.95} flatShading />
      </mesh>
      {(!broken || fall < 1) && (
        <group
          position={[fall * 3.5, 3.2 - fall * fall * 5.5, fall * 1.2]}
          rotation={[0, 0, -fall * 1.2]}
          scale={1 - fall * 0.5}
        >
          <mesh geometry={top} scale={1.3} castShadow>
            <meshStandardMaterial color={brick} roughness={0.95} flatShading />
          </mesh>
          <mesh position={[0, 2.75 + 1.1, 0]} castShadow>
            <coneGeometry args={[0.38, 2.2, 8]} />
            <meshStandardMaterial
              color={mix(brick, '#e8b84a', gold)}
              metalness={gold * 0.6}
              roughness={0.4}
              emissive="#ffb347"
              emissiveIntensity={night * gold * 0.4}
            />
          </mesh>
        </group>
      )}
      <mesh position={[0, 4.6, 0]}>
        <sphereGeometry args={[4.4, 16, 12]} />
        <meshBasicMaterial color="#ffc070" transparent opacity={0.1 * night * ramp(Y, 1985, 2000)} depthWrite={false} />
      </mesh>
    </group>
  );
};

const SmallChedi: React.FC<{pos: [number, number, number]; scale: number; k: number; color: string; glow?: number}> = ({
  pos,
  scale,
  k,
  color,
  glow = 0,
}) => {
  const geo = useMemo(() => lathe(SMALL_CHEDI, 10), []);
  if (k < 0.02) return null;
  return (
    <mesh geometry={geo} position={pos} scale={[scale, scale * k, scale]} castShadow>
      <meshStandardMaterial color={color} metalness={0.45} roughness={0.35} flatShading emissive="#ffb347" emissiveIntensity={glow} />
    </mesh>
  );
};

const Viharn: React.FC<{pos: [number, number, number]; k: number; rot?: number}> = ({pos, k, rot = 0}) => {
  const roof = useMemo(() => prism(2.0, 1.1, 3.2), []);
  const roof2 = useMemo(() => prism(1.5, 0.9, 2.4), []);
  if (k < 0.02) return null;
  return (
    <group position={pos} rotation-y={rot} scale={[1, k, 1]}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.8, 2.8]} />
        <meshStandardMaterial color="#f1e9da" roughness={0.9} />
      </mesh>
      <mesh geometry={roof} position={[0, 0.8, 0]} castShadow>
        <meshStandardMaterial color="#b0362a" roughness={0.7} flatShading side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={roof2} position={[0, 1.35, 0]} castShadow>
        <meshStandardMaterial color="#c4452f" roughness={0.7} flatShading side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Temples: React.FC = () => {
  const {Y, t} = useT();
  const {night} = lighting(t);
  const ds = DOI_SUTHEP_TEMPLE;
  const chetYot = smooth(ramp(Y, 1455, 1466));
  const kukut = smooth(ramp(Y, 661, 720));
  const lawa = ramp(Y, 450, 540) * (1 - ramp(Y, 1240, 1300));
  return (
    <>
      {/* Wat Phra Singh, Wat Chiang Man */}
      <SmallChedi pos={[-5.3, 0, 1.2]} scale={0.75} k={smooth(ramp(Y, 1345, 1352))} color="#e7c35a" glow={night * 0.5} />
      <Viharn pos={[-3.6, 0, 0.8]} k={smooth(ramp(Y, 1345, 1352))} />
      <SmallChedi pos={[5.9, 0, -6.9]} scale={0.6} k={smooth(ramp(Y, 1296.8, 1297.6))} color="#e9dfcf" />
      <Viharn pos={[4.7, 0, -6.2]} k={smooth(ramp(Y, 1296.8, 1297.6))} rot={Math.PI / 2} />
      {/* Wat Phra That Doi Suthep */}
      <SmallChedi pos={ds} scale={1.1} k={smooth(ramp(Y, 1383, 1389))} color="#f0c14e" glow={night * 1.2} />
      {/* Wat Chet Yot */}
      {chetYot > 0.02 && (
        <group position={[-16, 0, -18]} scale={[1, chetYot, 1]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[2.6, 0.9, 2.6]} />
            <meshStandardMaterial color="#c49866" roughness={0.9} />
          </mesh>
          {[
            [0, 0, 1.6],
            [-0.9, -0.9, 0.9],
            [0.9, -0.9, 0.9],
            [-0.9, 0.9, 0.9],
            [0.9, 0.9, 0.9],
            [0, -0.95, 0.8],
            [0, 0.95, 0.8],
          ].map(([x, z, h], i) => (
            <mesh key={i} position={[x, 0.9 + h / 2, z]} castShadow>
              <coneGeometry args={[0.28, h, 6]} />
              <meshStandardMaterial color="#d4a86a" roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}
      {/* Hariphunchai: Ku Kut stepped chedi */}
      {kukut > 0.02 && (
        <group position={[KUKUT[0], 0, KUKUT[1]]} scale={[1, kukut, 1]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[0, 0.35 + i * 0.7, 0]} castShadow>
              <boxGeometry args={[3 - i * 0.5, 0.7, 3 - i * 0.5]} />
              <meshStandardMaterial color={i % 2 ? '#b08a56' : '#c29a62'} roughness={0.95} />
            </mesh>
          ))}
          <mesh position={[0, 4.0, 0]} castShadow>
            <coneGeometry args={[0.35, 1.2, 6]} />
            <meshStandardMaterial color="#d4aa66" />
          </mesh>
        </group>
      )}
      {/* Lawa stilt huts */}
      {lawa > 0.02 &&
        LAWA_HUTS.map(([x, z], i) => (
          <group key={i} position={[x, terrainH(x, z), z]} scale={[1, lawa, 1]}>
            {[
              [-0.4, -0.3],
              [0.4, -0.3],
              [-0.4, 0.3],
              [0.4, 0.3],
            ].map(([px, pz], j) => (
              <mesh key={j} position={[px, 0.3, pz]}>
                <cylinderGeometry args={[0.05, 0.05, 0.6, 4]} />
                <meshStandardMaterial color="#5b4330" />
              </mesh>
            ))}
            <mesh position={[0, 0.8, 0]} castShadow>
              <boxGeometry args={[1.1, 0.45, 0.9]} />
              <meshStandardMaterial color="#8c6a45" />
            </mesh>
            <mesh position={[0, 1.35, 0]} castShadow>
              <coneGeometry args={[0.95, 0.75, 4]} />
              <meshStandardMaterial color="#c2a866" flatShading />
            </mesh>
          </group>
        ))}
    </>
  );
};

// ------------------------------------------------------------------ infrastructure & traffic
const Road: React.FC = () => {
  const {Y} = useT();
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < ROAD_PATH.length - 1; i++) {
      const [x0, z0] = ROAD_PATH[i];
      const [x1, z1] = ROAD_PATH[i + 1];
      for (let k = 0; k < 12; k++) {
        const x = lerp(x0, x1, k / 12);
        const z = lerp(z0, z1, k / 12);
        pts.push(new THREE.Vector3(x, terrainH(x, z) + 0.12, z));
      }
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 240, 0.28, 4, false);
  }, []);
  const p = ramp(Y, 1934, 1935.6);
  useLayoutEffect(() => {
    const n = geo.index ? geo.index.count : 0;
    geo.setDrawRange(0, Math.floor((n * p) / 6) * 6);
  });
  if (p <= 0) return null;
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial color="#d9c9a2" roughness={1} />
    </mesh>
  );
};

const Infrastructure: React.FC = () => {
  const {Y, t} = useT();
  const {night} = lighting(t);
  const bridge = ramp(Y, 1893, 1896);
  const rail = ramp(Y, 1920.5, 1921.6);
  const station = ramp(Y, 1921, 1923);
  const roads = ramp(Y, 1950, 1958);
  const roofGeo = useMemo(() => prism(2.6, 0.9, 4.6), []);
  const sleepers = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    updateInstances(sleepers.current, 120, (i, o) => {
      const z = TILE.z0 + 1 + i * 1.6;
      o.position.set(RAIL_X, 0.06, z);
      return z < TILE.z0 + (TILE_S - 1) * rail && z < TILE.z1 - 0.5;
    });
  });
  const roadMat = <meshStandardMaterial color="#55585e" roughness={0.9} />;
  return (
    <>
      {bridge > 0 && (
        <group position={[RIVER_X, 0, 0]} scale={[bridge, 1, 1]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[RIVER_W + 1.4, 0.2, 1.5]} />
            <meshStandardMaterial color={Y > 1965 ? '#b3b4b5' : '#7a5636'} roughness={0.9} />
          </mesh>
          {[-1.5, 0, 1.5].map((x) => (
            <mesh key={x} position={[x, 0.2, 0]}>
              <boxGeometry args={[0.3, 0.4, 1.2]} />
              <meshStandardMaterial color="#6e6a62" />
            </mesh>
          ))}
        </group>
      )}
      {Y > 1985 && (
        <mesh position={[RIVER_X, 0.45, 14]} castShadow>
          <boxGeometry args={[RIVER_W + 1.4, 0.2, 1.3]} />
          <meshStandardMaterial color="#a9abad" />
        </mesh>
      )}
      {rail > 0 && (
        <>
          {[-0.35, 0.35].map((dx) => (
            <mesh key={dx} position={[RAIL_X + dx, 0.12, TILE.z0 + (TILE_S * rail) / 2]}>
              <boxGeometry args={[0.08, 0.08, TILE_S * rail]} />
              <meshStandardMaterial color="#8b8f96" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
          <instancedMesh ref={sleepers} args={[undefined, undefined, 120]} receiveShadow>
            <boxGeometry args={[1.3, 0.06, 0.3]} />
            <meshStandardMaterial color="#5a4632" />
          </instancedMesh>
        </>
      )}
      {station > 0.02 && (
        <group position={[RAIL_X + 3, 0, -2]} scale={[1, station, 1]}>
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 1.6, 4.4]} />
            <meshStandardMaterial color="#ece4d0" emissive="#ffcf7a" emissiveIntensity={night * 0.25} />
          </mesh>
          <mesh geometry={roofGeo} position={[0, 1.6, 0]} castShadow>
            <meshStandardMaterial color="#a4442c" flatShading side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
      {roads > 0 && (
        <group>
          {[
            [13.1, 0, 1.2, 27.4],
            [-13.1, 0, 1.2, 27.4],
            [0, 13.1, 27.4, 1.2],
            [0, -13.1, 27.4, 1.2],
          ].map(([x, z, w, d], i) => (
            <mesh key={i} position={[x, 0.05, z]} receiveShadow>
              <boxGeometry args={[w, 0.04 * roads, d]} />
              {roadMat}
            </mesh>
          ))}
          <mesh position={[(13.7 + RAIL_X) / 2, 0.05, 0]} receiveShadow>
            <boxGeometry args={[RAIL_X - 13.7, 0.04 * roads, 1.1]} />
            {roadMat}
          </mesh>
          <mesh position={[-24, 0.05, -21]} rotation-y={-0.62} receiveShadow>
            <boxGeometry args={[26, 0.04 * roads, 1.1]} />
            {roadMat}
          </mesh>
        </group>
      )}
    </>
  );
};

const Train: React.FC<{t0: number; dur: number; dir: 1 | -1; modern: boolean}> = ({t0, dur, dir, modern}) => {
  const {t} = useT();
  if (t < t0 || t > t0 + dur) return null;
  const p = (t - t0) / dur;
  const z = dir > 0 ? lerp(TILE.z1 + 6, TILE.z0 - 14, p) : lerp(TILE.z0 - 14, TILE.z1 + 6, p);
  const head = -dir; // direction of travel along z
  const body = modern ? '#2f5aa8' : '#202024';
  const car = modern ? '#e8ecef' : '#7a3b2a';
  return (
    <group position={[RAIL_X, 0, z]} visible={z < TILE.z1 && z > TILE.z0 + 2}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.9, 0.9, 2.2]} />
        <meshStandardMaterial color={body} roughness={0.6} />
      </mesh>
      {!modern && (
        <>
          <mesh position={[0, 1.25, head * 0.7]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.5, 8]} />
            <meshStandardMaterial color={body} />
          </mesh>
          {new Array(7).fill(0).map((_, k) => (
            <mesh key={k} position={[0.2 * Math.sin(k + t * 3), 1.6 + k * 0.35, head * 0.7 - head * k * 0.8]}>
              <icosahedronGeometry args={[0.3 + k * 0.12, 0]} />
              <meshStandardMaterial color="#efeeea" transparent opacity={0.85 - k * 0.11} flatShading />
            </mesh>
          ))}
        </>
      )}
      {[1, 2, 3, 4].map((c) => (
        <mesh key={c} position={[0, 0.55, -head * c * 2.35]} castShadow>
          <boxGeometry args={[0.85, 0.8, 2.1]} />
          <meshStandardMaterial color={car} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const RING = 13.1;
const ringPos = (s: number): [number, number, number] => {
  const L = RING * 8;
  const u = ((s % L) + L) % L;
  const side = Math.floor(u / (RING * 2));
  const f = u - side * RING * 2 - RING;
  if (side === 0) return [RING, f, 0];
  if (side === 1) return [-f, -RING, Math.PI / 2];
  if (side === 2) return [-RING, -f, 0];
  return [f, RING, Math.PI / 2];
};
const Cars: React.FC = () => {
  const {Y, frame} = useT();
  const ref = useRef<THREE.InstancedMesh>(null);
  const n = Math.floor(ramp(Y, 1958, 2015) * 48);
  useLayoutEffect(() => {
    updateInstances(ref.current, 48, (i, o) => {
      if (i >= n) return false;
      const dir = i % 2 ? 1 : -1;
      const [x, z, r] = ringPos(i * 9.7 + dir * frame * (0.12 + (i % 4) * 0.03));
      const lane = dir * 0.25;
      o.position.set(x + (r === 0 ? lane : 0), 0.22, z + (r !== 0 ? lane : 0));
      o.rotation.y = r;
      return true;
    });
  });
  useLayoutEffect(() => {
    for (let i = 0; i < 48; i++) {
      col.set(i % 3 === 0 ? '#c8202f' : ['#f2f2f2', '#2b2f3a', '#9aa4ad', '#e0b83a'][i % 4]);
      ref.current?.setColorAt(i, col);
    }
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 48]} castShadow>
      <boxGeometry args={[0.38, 0.32, 0.75]} />
      <meshStandardMaterial roughness={0.5} />
    </instancedMesh>
  );
};

const Boats: React.FC = () => {
  const {Y, t} = useT();
  const k = ramp(Y, 600, 700) * (1 - ramp(Y, 1950, 1970));
  if (k <= 0.02) return null;
  return (
    <>
      {BOATS.map((b, i) => {
        const z = ((b.z + t * b.sp * 4 + 900) % 90) - 49;
        return (
          <mesh key={i} position={[RIVER_X + b.off, 0.15, z]} scale={k} castShadow>
            <boxGeometry args={[0.45, 0.2, 1.6]} />
            <meshStandardMaterial color="#6a4a2e" />
          </mesh>
        );
      })}
    </>
  );
};

const Clouds: React.FC = () => {
  const {Y, t} = useT();
  const {night} = lighting(t);
  return (
    <>
      {CLOUDS.map((c, i) => {
        const x = ((c.x + Y * 0.08 * c.sp) % 160) - 80;
        return (
          <group key={i} position={[x, c.y, c.z]} scale={c.s}>
            {c.puffs.map(([px, py, pz, s], j) => (
              <mesh key={j} position={[px, py, pz]} scale={s} castShadow>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color={mix('#ffffff', '#8a90b8', night)} flatShading roughness={1} />
              </mesh>
            ))}
          </group>
        );
      })}
    </>
  );
};

const Plane: React.FC = () => {
  const {t, frame} = useT();
  if (t < 50.2 || t > 54) return null;
  const p = (t - 50.2) / 3.8;
  return (
    <group position={[lerp(60, -60, p), lerp(30, 18, p), lerp(-14, 14, p)]} rotation-y={-Math.PI / 2 + 0.3}>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.35, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f2f4f6" />
      </mesh>
      <mesh>
        <boxGeometry args={[4.4, 0.08, 0.9]} />
        <meshStandardMaterial color="#d3d8de" />
      </mesh>
      <mesh position={[0, 0.6, -1.8]}>
        <boxGeometry args={[0.08, 1.1, 0.7]} />
        <meshStandardMaterial color="#7a2a8a" />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshBasicMaterial color={frame % 20 < 6 ? '#ff4040' : '#401010'} />
      </mesh>
    </group>
  );
};

const Glows: React.FC = () => {
  const {t, Y} = useT();
  const lantern = useMemo(() => glowTexture('rgba(255,236,190,1)', 'rgba(255,150,50,0.55)'), []);
  const dustTex = useMemo(() => glowTexture('rgba(190,170,140,0.9)', 'rgba(170,150,120,0.35)'), []);
  const {dir, vis, elev} = sunState(t);
  const target = isoCamera(t).target;
  const lanternGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(LANTERNS.length * 3), 3));
    return g;
  }, []);
  const dustGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(30 * 3), 3));
    return g;
  }, []);
  useLayoutEffect(() => {
    const a = lanternGeo.attributes.position as THREE.BufferAttribute;
    LANTERNS.forEach((l, i) => {
      const age = t - l.t0;
      if (age < 0) a.setXYZ(i, 0, -50, 0);
      else a.setXYZ(i, l.x + Math.sin(age * 1.4 + l.wob) * 0.8 + age * 0.6, 0.8 + age * l.speed, l.z - age * 0.4);
    });
    a.needsUpdate = true;
    const d = dustGeo.attributes.position as THREE.BufferAttribute;
    const q = ramp(Y, 1545.05, 1546.6);
    for (let i = 0; i < 30; i++) {
      const ang = i * 2.4;
      const r = 1 + q * 6 * (0.5 + (i % 5) / 5);
      d.setXYZ(i, Math.cos(ang) * r, 3 + q * 4 * ((i % 3) / 2) + (i % 4), Math.sin(ang) * r);
    }
    d.needsUpdate = true;
  });
  const dustOn = Y >= 1545 && Y < 1547;
  return (
    <>
      {t > 54.9 && (
        <points geometry={lanternGeo}>
          <pointsMaterial map={lantern} size={3.4} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
      )}
      {dustOn && (
        <points geometry={dustGeo}>
          <pointsMaterial map={dustTex} size={5} sizeAttenuation transparent depthWrite={false} opacity={0.8 * (1 - ramp(Y, 1545.6, 1546.8))} />
        </points>
      )}
      {vis > 0 && elev > -0.05 && (
        <sprite position={[target[0] + dir.x * 420, dir.y * 420, target[2] + dir.z * 420]} scale={[150, 150, 1]}>
          <spriteMaterial map={lantern} color={mix('#fff6dc', '#ff9a4a', 1 - Math.min(1, elev * 2))} transparent depthWrite={false} fog={false} blending={THREE.AdditiveBlending} />
        </sprite>
      )}
    </>
  );
};

export const IsoScene: React.FC<{fog: string}> = ({fog}) => {
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    scene.fog = new THREE.Fog(fog, 900, 2400);
  }, [scene, fog]);
  return (
    <>
      <CameraRig />
      <Lights />
      <Ground />
      <Paddies />
      <Water />
      <Trees />
      <Houses />
      <Village />
      <Buildings />
      <Walls />
      <ChediLuang />
      <Temples />
      <Road />
      <Infrastructure />
      <Train t0={45.4} dur={3.2} dir={1} modern={false} />
      <Train t0={51.6} dur={2.8} dir={-1} modern />
      <Cars />
      <Boats />
      <Plane />
      <Glows />
      <FrameSync />
    </>
  );
};
