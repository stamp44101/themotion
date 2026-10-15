import React, {useMemo} from 'react';
import * as THREE from 'three';

const o3 = new THREE.Object3D();
export const col = new THREE.Color();

/** Write instance matrices; fn returns false to hide an instance. */
export const updateInstances = (mesh: THREE.InstancedMesh | null, n: number, fn: (i: number, o: THREE.Object3D) => boolean) => {
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
  // three caches an InstancedMesh's bounding sphere the first time it is culled. Korat's armies
  // were first seen inside the town; once they marched to Thung Samrit the stale sphere was off
  // camera, so a full render culled them (only their shadows showed). Stills never noticed:
  // every still starts on a fresh page.
  mesh.computeBoundingSphere();
};

/** Gable roof: triangular prism, width w, height h, length l (along z), base at y=0. */
export const prism = (w: number, h: number, l: number) => {
  const x = w / 2;
  const z = l / 2;
  const v = [
    [-x, 0, z], [x, 0, z], [0, h, z],
    [x, 0, -z], [-x, 0, -z], [0, h, -z],
    [-x, 0, -z], [-x, 0, z], [0, h, z], [-x, 0, -z], [0, h, z], [0, h, -z],
    [x, 0, z], [x, 0, -z], [0, h, -z], [x, 0, z], [0, h, -z], [0, h, z],
  ].flat();
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.computeVertexNormals();
  return g;
};

export const lathe = (pts: [number, number][], seg = 8) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

export const SMALL_CHEDI: [number, number][] = [
  [0, 0], [1.0, 0], [1.0, 0.3], [0.8, 0.3], [0.8, 0.55], [0.62, 0.6], [0.65, 1.1], [0.5, 1.5], [0.25, 1.7], [0.12, 2.6], [0, 2.9],
];
// Khmer prang: stacked, inward-curving tiers ending in a lotus bud.
export const PRANG: [number, number][] = [
  [0, 0], [1.3, 0], [1.3, 0.5], [1.05, 0.55], [1.05, 1.9], [1.15, 2.0], [0.95, 2.1], [0.95, 2.5], [0.98, 2.6], [0.8, 2.7],
  [0.8, 3.05], [0.82, 3.12], [0.62, 3.22], [0.62, 3.5], [0.45, 3.6], [0.4, 3.85], [0.22, 4.0], [0.1, 4.35], [0, 4.45],
];

export const windowTexture = () => {
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

export const glowTexture = (inner: string, outer: string) => {
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

export const SmallChedi: React.FC<{pos: [number, number, number]; scale: number; k: number; color: string; glow?: number}> = ({
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

/** Thai temple hall (viharn/ubosot) with two-tier red roof. */
export const Viharn: React.FC<{pos: [number, number, number]; k: number; rot?: number; scale?: number}> = ({pos, k, rot = 0, scale = 1}) => {
  const roof = useMemo(() => prism(2.0, 1.1, 3.2), []);
  const roof2 = useMemo(() => prism(1.5, 0.9, 2.4), []);
  if (k < 0.02) return null;
  return (
    <group position={pos} rotation-y={rot} scale={[scale, scale * k, scale]}>
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

/** Khmer sandstone prang (e.g. Phimai) on a raised terrace. */
export const Prang: React.FC<{pos: [number, number, number]; k: number; scale?: number; color?: string}> = ({
  pos,
  k,
  scale = 1,
  color = '#d9d2c2',
}) => {
  const geo = useMemo(() => lathe(PRANG, 8), []);
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={[scale, scale * k, scale]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.5, 3.4]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh geometry={geo} position={[0, 0.5, 0]} rotation-y={Math.PI / 8} castShadow>
        <meshStandardMaterial color={color} roughness={0.95} flatShading />
      </mesh>
    </group>
  );
};

/** Low-poly elephant (~2.6 units long), optional golden howdah. `step` animates the legs. */
export const Elephant: React.FC<{step: number; howdah?: boolean; color?: string}> = ({step, howdah, color = '#7d7a76'}) => {
  const m = <meshStandardMaterial color={color} flatShading roughness={0.95} />;
  return (
    <group>
      <mesh position={[0, 1.35, 0]} scale={[0.8, 0.75, 1.25]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        {m}
      </mesh>
      <mesh position={[0, 1.6, 1.25]} scale={[0.55, 0.55, 0.5]} castShadow>
        <icosahedronGeometry args={[1, 0]} />
        {m}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.5, 1.65, 1.15]} rotation-y={s * 0.4} scale={[0.08, 0.5, 0.4]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          {m}
        </mesh>
      ))}
      <mesh position={[0, 0.95, 1.65]} rotation-x={0.25} castShadow>
        <cylinderGeometry args={[0.1, 0.17, 1.0, 6]} />
        {m}
      </mesh>
      {[
        [0.42, 0.7],
        [-0.42, 0.7],
        [0.42, -0.7],
        [-0.42, -0.7],
      ].map(([lx, lz], j) => (
        <mesh key={j} position={[lx, 0.45, lz]} rotation-x={step * 0.3 * (j % 3 === 0 ? 1 : -1)} castShadow>
          <cylinderGeometry args={[0.2, 0.18, 0.9, 6]} />
          {m}
        </mesh>
      ))}
      {howdah && (
        <group position={[0, 2.15, -0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.35, 0.9]} />
            <meshStandardMaterial color="#d9a43a" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.45, 0]} castShadow>
            <coneGeometry args={[0.55, 0.6, 4]} />
            <meshStandardMaterial color="#b8322a" />
          </mesh>
        </group>
      )}
    </group>
  );
};
