// The Ban Chiang jar: a lathe of the late-period jar with its red scroll pattern on a canvas
// texture that an unseen brush paints in (k 0 -> 1). Shared by the cover, the Ban Chiang marker and
// the fair's lantern.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {lathe} from '../../engine/parts';

// small foot, round body, short neck, flared rim (height 1); points roughly evenly spaced along the
// outline so the texture's v runs with the surface
export const JAR: [number, number][] = [
  [0, 0], [0.16, 0.0], [0.19, 0.03], [0.17, 0.06], [0.26, 0.1], [0.36, 0.16], [0.44, 0.24], [0.49, 0.33],
  [0.5, 0.42], [0.48, 0.51], [0.43, 0.6], [0.35, 0.68], [0.25, 0.74], [0.19, 0.78], [0.18, 0.83],
  [0.22, 0.89], [0.28, 0.94], [0.31, 0.97], [0.29, 0.98], [0.2, 0.93],
];
export const RED = '#a5281b';
// fired clay: a pale terracotta (owner: closer to the real jars than the first frames' cream)
export const CLAY = '#d9a679';

const TEX_W = 1024;
const TEX_H = 512;
/** the scroll pattern as polylines in texture px: two bands of interlocking S-scrolls and borders */
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
  for (const [y, r] of [[TEX_H * 0.36, 34], [TEX_H * 0.56, 40]] as [number, number][]) {
    const n = 8;
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * (TEX_W / n);
      const a = spiral(x - r * 0.9, y, r, 1.4, 1);
      const b = spiral(x + r * 0.9, y, r, 1.4, -1);
      paths.push([...a.reverse(), ...b]);
    }
  }
  for (const y of [TEX_H * 0.26, TEX_H * 0.66]) {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 64; i++) pts.push([(i / 64) * TEX_W, y + Math.sin(i * 1.3) * 3]);
    paths.push(pts);
  }
  return paths;
};
const PATHS = scrollPaths();

const paintTexture = (k: number) => {
  const c = document.createElement('canvas');
  c.width = TEX_W;
  c.height = TEX_H;
  const g = c.getContext('2d')!;
  g.fillStyle = CLAY;
  g.fillRect(0, 0, TEX_W, TEX_H);
  if (k > 0) {
    g.strokeStyle = RED;
    g.lineWidth = 12;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    // the brush goes round all the scrolls at once, each one drawn to the same fraction
    for (const p of PATHS) {
      const m = Math.max(1, Math.floor(p.length * k));
      g.beginPath();
      g.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < m; i++) g.lineTo(p[i][0], p[i][1]);
      g.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
};

/** the jar, height 1 (scale it), painted to k. `glow` > 0 makes it the lantern: self-lit and outside
 *  tone mapping (CLAUDE.md: an emissive standard material washes out under ACES in daylight) */
export const Jar: React.FC<{k: number; seg?: number; glow?: number}> = ({k, seg = 48, glow = 0}) => {
  const geo = useMemo(() => lathe(JAR, seg), [seg]);
  const q = Math.round(k * 120) / 120;
  const tex = useMemo(() => paintTexture(q), [q]);
  const lit = useMemo(() => new THREE.Color(1, 1, 1), []);
  if (glow > 0) {
    lit.setRGB(1 + glow * 0.55, 1 + glow * 0.4, 1 + glow * 0.15);
    return (
      <mesh geometry={geo}>
        <meshBasicMaterial map={tex} color={lit} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    );
  }
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial map={tex} roughness={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
};
