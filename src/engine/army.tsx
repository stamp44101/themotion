import React, {useLayoutEffect, useRef} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {updateInstances} from './parts';
import type {LandmarkProps} from './types';

// Each army is a ranked block of figures (the villagers' body + head from Life.tsx, in army
// colours) facing the other army. 70 identical boxes in a random patch read as rubble (#28).
const ARMY = 70;
const COLS = 12;
const ROWS = Math.ceil(ARMY / COLS);
const SLOT = new Array(ARMY).fill(0).map((_, i) => ({
  side: (i % COLS - (COLS - 1) / 2) * 0.48 + (random(`as${i}`) - 0.5) * 0.14,
  back: (Math.floor(i / COLS) - (ROWS - 1) / 2) * 0.58 + (random(`ab${i}`) - 0.5) * 0.14,
  h: 0.9 + random(`ah${i}`) * 0.2,
}));
export type Formation = {at: [number, number]; face: [number, number]} | null;
export const Army: React.FC<{f: Formation; color: string; terrainH: LandmarkProps['terrainH']}> = ({f, color, terrainH}) => {
  const body = useRef<THREE.InstancedMesh>(null);
  const head = useRef<THREE.InstancedMesh>(null);
  const place = (i: number) => {
    if (!f) return null;
    let fx = f.face[0] - f.at[0];
    let fz = f.face[1] - f.at[1];
    const n = Math.hypot(fx, fz) || 1;
    fx /= n;
    fz /= n;
    const {side, back, h} = SLOT[i];
    const x = f.at[0] - fz * side - fx * back;
    const z = f.at[1] + fx * side - fz * back;
    return {x, z, y: terrainH(x, z), h, rot: Math.atan2(fx, fz)};
  };
  useLayoutEffect(() => {
    updateInstances(body.current, ARMY, (i, o) => {
      const p = place(i);
      if (!p) return false;
      o.position.set(p.x, p.y + 0.4 * p.h, p.z);
      o.rotation.y = p.rot;
      o.scale.set(1, p.h, 1);
      return true;
    });
    updateInstances(head.current, ARMY, (i, o) => {
      const p = place(i);
      if (!p) return false;
      o.position.set(p.x, p.y + 0.8 * p.h + 0.14, p.z);
      return true;
    });
  });
  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, ARMY]} castShadow>
        <cylinderGeometry args={[0.13, 0.21, 0.8, 6]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={head} args={[undefined, undefined, ARMY]} castShadow>
        <sphereGeometry args={[0.15, 6, 5]} />
        <meshStandardMaterial color="#c99a72" roughness={0.9} />
      </instancedMesh>
    </>
  );
};

