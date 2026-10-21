// A green turtle (เต่าตนุ), modelled on the owner's reference photos (21 ต.ค. 2569): the turtle
// Phuket releases at Mai Khao. What makes it read, from the photos:
// - a low, heart-shaped carapace of big plates (five down the spine, four down each side), each
//   dark brown with amber rays fanning out from its back edge, thin pale seams between them;
// - head and flippers covered in dark polygonal scales, each outlined in cream;
// - a short blunt snout, a white jaw and throat, pale skin at the neck and a cream underside.
// The textures are painted once on a canvas (a Voronoi of the plates / scales), then mapped onto
// the shell by its own (u, v) parameters. Same local frame and gait as SeaTurtle: faces +z, ~3.6 long.
import React from 'react';
import * as THREE from 'three';
import {crawlPhase} from './SeaTurtle';

const Z0 = 1.45;
const LEN = 3.0;
// heart-shaped outline: broad shoulders, tapering to a rounded point at the tail
const halfW = (u: number) => 1.22 * Math.sin(Math.PI * Math.min(1, 0.16 + u * 0.88)) ** 0.55 * (1 - 0.18 * u);
const height = (u: number) => 0.5 * Math.sin(Math.PI * Math.min(1, 0.12 + u * 0.9)) ** 0.7;
const shellAt = (u: number, v: number) => {
  const a = (v * Math.PI) / 2;
  return new THREE.Vector3(halfW(u) * Math.sin(a), 0.4 + height(u) * Math.cos(a) ** 0.9, Z0 - u * LEN);
};

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// the plates' seeds in shell space (x, z): five vertebrals, four costals a side, a ring of marginals
const PLATES: {x: number; z: number; marginal: boolean}[] = (() => {
  const out: {x: number; z: number; marginal: boolean}[] = [];
  for (let i = 0; i < 5; i++) out.push({x: 0, z: Z0 - LEN * (0.14 + i * 0.18), marginal: false});
  for (const sd of [-1, 1]) for (let i = 0; i < 4; i++) {
    const u = 0.2 + i * 0.2;
    out.push({x: sd * halfW(u) * 0.62, z: Z0 - LEN * u, marginal: false});
  }
  // marginals: twelve down each side of the rim
  for (const sd of [-1, 1]) for (let i = 0; i < 12; i++) {
    const u = 0.04 + (i / 11) * 0.92;
    out.push({x: sd * halfW(u) * 0.97, z: Z0 - LEN * u, marginal: true});
  }
  return out;
})();

let cache: {shell: THREE.BufferGeometry; shellTex: THREE.Texture; scaleTex: THREE.Texture; dot: THREE.SphereGeometry} | null = null;
const assets = () => {
  if (cache) return cache;
  // ---- the shell surface, uv = (v across, u along)
  const nu = 32;
  const nv = 28;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= nu; i++)
    for (let j = 0; j <= nv; j++) {
      const v = -1 + (2 * j) / nv;
      const p = shellAt(i / nu, v);
      pos.push(p.x, p.y, p.z);
      uv.push((v + 1) / 2, 1 - i / nu);
    }
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const a = i * (nv + 1) + j;
      const b = a + nv + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  const shell = new THREE.BufferGeometry();
  shell.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  shell.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  shell.setIndex(idx);
  shell.computeVertexNormals();

  // ---- the plate texture: each pixel finds its plate; rays fan from the plate's back edge
  const W = 256;
  const H = 320;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  const img = g.createImageData(W, H);
  for (let py = 0; py < H; py++)
    for (let px = 0; px < W; px++) {
      const u = py / (H - 1);
      const v = -1 + (2 * px) / (W - 1);
      const x = halfW(u) * Math.sin((v * Math.PI) / 2);
      const z = Z0 - u * LEN;
      let d1 = 1e9;
      let d2 = 1e9;
      let k = 0;
      PLATES.forEach((p, i) => {
        const d = Math.hypot(x - p.x, (z - p.z) * (p.marginal ? 1.6 : 1));
        if (d < d1) {
          d2 = d1;
          d1 = d;
          k = i;
        } else if (d < d2) d2 = d;
      });
      const p = PLATES[k];
      // rays radiate from a point at the back of the plate
      const ang = Math.atan2(x - p.x, z - (p.z - 0.22));
      const ray = 0.5 + 0.5 * Math.sin(ang * 9 + hash(k) * 6);
      const fade = Math.min(1, d1 / 0.45);
      const amber = ray * fade * (p.marginal ? 0.6 : 1);
      let r = 52 + amber * 160;
      let gg = 30 + amber * 66;
      let b = 18 + amber * 22;
      // dark rim inside each plate, then a pale seam
      const edge = d2 - d1;
      if (edge < 0.022) {
        r = 190;
        gg = 158;
        b = 112;
      } else if (edge < 0.09) {
        r *= 0.7;
        gg *= 0.7;
        b *= 0.7;
      }
      const o = (py * W + px) * 4;
      img.data[o] = r;
      img.data[o + 1] = gg;
      img.data[o + 2] = b;
      img.data[o + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  const shellTex = new THREE.CanvasTexture(c);
  shellTex.colorSpace = THREE.SRGBColorSpace;

  // ---- the scale texture for head and flippers: dark cells outlined in cream
  const S = 256;
  const c2 = document.createElement('canvas');
  c2.width = S;
  c2.height = S;
  const g2 = c2.getContext('2d')!;
  const img2 = g2.createImageData(S, S);
  const seeds = Array.from({length: 22}, (_, i) => [hash(i + 3), hash(i + 91)]);
  for (let py = 0; py < S; py++)
    for (let px = 0; px < S; px++) {
      const x = px / S;
      const y = py / S;
      let d1 = 9;
      let d2 = 9;
      let k = 0;
      seeds.forEach(([sx, sy], i) => {
        // wrap so the texture tiles
        const dx = Math.min(Math.abs(x - sx), 1 - Math.abs(x - sx));
        const dy = Math.min(Math.abs(y - sy), 1 - Math.abs(y - sy));
        const d = Math.hypot(dx, dy);
        if (d < d1) {
          d2 = d1;
          d1 = d;
          k = i;
        } else if (d < d2) d2 = d;
      });
      const edge = d2 - d1;
      const shade = 0.8 + 0.4 * hash(k + 7);
      const cream = edge < 0.014;
      const o = (py * S + px) * 4;
      img2.data[o] = cream ? 214 : 56 * shade;
      img2.data[o + 1] = cream ? 204 : 50 * shade;
      img2.data[o + 2] = cream ? 182 : 44 * shade;
      img2.data[o + 3] = 255;
    }
  g2.putImageData(img2, 0, 0);
  const scaleTex = new THREE.CanvasTexture(c2);
  scaleTex.colorSpace = THREE.SRGBColorSpace;
  scaleTex.wrapS = THREE.RepeatWrapping;
  scaleTex.wrapT = THREE.RepeatWrapping;
  scaleTex.repeat.set(2, 1);

  cache = {shell, shellTex, scaleTex, dot: new THREE.SphereGeometry(1, 16, 10)};
  return cache;
};

// a paddle flipper: broad, tapering, one claw on the leading edge
const Flipper: React.FC<{len: number; width: number; tex: THREE.Texture; dot: THREE.SphereGeometry}> = ({len, width, tex, dot}) => {
  const segs = 4;
  return (
    <group>
      {Array.from({length: segs}, (_, i) => {
        const u = (i + 0.5) / segs;
        const w = width * (1 - 0.55 * u);
        return (
          <mesh key={i} geometry={dot} position={[u * len * 0.9, 0, -0.18 * u * u * len]} rotation-y={0.28 * u} scale={[(len / segs) * 0.85, 0.07, w / 2]} castShadow>
            <meshStandardMaterial map={tex} roughness={0.75} />
          </mesh>
        );
      })}
      <mesh position={[len * 0.32, 0.03, width * 0.42]} rotation-z={-Math.PI / 2} scale={[0.04, 0.12, 0.04]}>
        <coneGeometry args={[1, 1, 5]} />
        <meshStandardMaterial color="#cfc6ae" />
      </mesh>
    </group>
  );
};

export const GreenTurtle: React.FC<{t: number; rate?: number; swim?: boolean}> = ({t, rate = 0.55, swim = false}) => {
  const A = assets();
  const q = crawlPhase(t, rate);
  const fore = swim ? Math.sin(t * 2.2) * 0.6 : q < 0.15 ? -0.7 + (q / 0.15) * 0.1 : q < 0.6 ? -0.6 + ((q - 0.15) / 0.45) * 1.3 : 0.7 - ((q - 0.6) / 0.4) * 1.4;
  const heave = swim ? 0 : q > 0.15 && q < 0.6 ? Math.sin(((q - 0.15) / 0.45) * Math.PI) * 0.15 : 0;
  const breathe = Math.max(0, Math.sin(t * 0.9)) ** 3;
  const scales = <meshStandardMaterial map={A.scaleTex} roughness={0.7} />;
  return (
    <group position={[0, heave, 0]}>
      {/* cream underside, showing at the rim */}
      <mesh position={[0, 0.4, -0.05]} scale={[1.02, 0.1, 1.42]}>
        <sphereGeometry args={[1, 16, 6]} />
        <meshStandardMaterial color="#e6dcc2" roughness={0.9} />
      </mesh>
      <mesh geometry={A.shell} castShadow receiveShadow>
        <meshStandardMaterial map={A.shellTex} roughness={0.38} side={THREE.DoubleSide} />
      </mesh>
      {/* fore-flippers: broad paddles, about two-thirds of the shell's length */}
      {[-1, 1].map((sd) => (
        <group key={`f${sd}`} position={[sd * 0.95, 0.42, 0.8]} rotation-y={sd > 0 ? -fore : Math.PI + fore} rotation-z={sd * 0.1}>
          <Flipper len={1.9} width={0.72} tex={A.scaleTex} dot={A.dot} />
        </group>
      ))}
      {[-1, 1].map((sd) => (
        <group key={`h${sd}`} position={[sd * 0.55, 0.4, -1.35]} rotation-y={sd > 0 ? -2.3 + 0.25 * Math.sin(t * 3 + sd) : -0.84 - 0.25 * Math.sin(t * 3 + sd)}>
          <Flipper len={0.75} width={0.5} tex={A.scaleTex} dot={A.dot} />
        </group>
      ))}
      {/* pale neck, the scaled head, the white jaw */}
      <group position={[0, 0.55 + 0.12 * breathe, 1.72]} rotation-x={-0.2 * breathe}>
        <mesh geometry={A.dot} position={[0, -0.04, -0.28]} scale={[0.3, 0.25, 0.38]} castShadow>
          <meshStandardMaterial color="#a9a398" roughness={0.85} />
        </mesh>
        <mesh geometry={A.dot} position={[0, 0.03, 0.06]} scale={[0.32, 0.27, 0.42]} castShadow>
          {scales}
        </mesh>
        <mesh geometry={A.dot} position={[0, -0.13, 0.12]} scale={[0.27, 0.13, 0.34]} castShadow>
          <meshStandardMaterial color="#efe9da" roughness={0.7} />
        </mesh>
        {[-1, 1].map((sd) => (
          <group key={sd} position={[sd * 0.22, 0.08, 0.26]}>
            <mesh>
              <sphereGeometry args={[0.075, 10, 8]} />
              <meshStandardMaterial color="#120f0c" roughness={0.15} />
            </mesh>
            <mesh position={[sd * 0.02, 0.03, 0.05]}>
              <sphereGeometry args={[0.02, 6, 5]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
