import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {random} from 'remotion';
import * as THREE from 'three';
import {Army} from '../../engine/army';
import {lathe, Prang, prism, SmallChedi, updateInstances, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp, smooth} from '../../lib';
import {boatAt, cartAt, FLEET, fireK, heroK, siege, towersUp, WEST_ARMY_Z} from './actors';
import {BAN_PUEN, BANG_CHAN, eastWallX, KAMPHAENG_LAENG, MAHATHAT, PEAK_E, PEAK_M, PEAK_W, RAIL_X, RIVER, WAT_YAI} from './places';

export {BAN_PUEN, KAMPHAENG_LAENG, MAHATHAT, PEAK_E, PEAK_M, PEAK_W, STATION, WAT_YAI} from './places';

// ------------------------------------------------------------------ ตาลโตนด
// Phetchaburi's plain is sugar palms standing on paddy bunds, not a closed canopy. A thin
// trunk and a round crown of fronds, scattered over the plain away from the river, the town,
// the ridge and the line; each palm goes when the modern town reaches it.
const riverDist = (x: number, z: number) => {
  let best = 1e9;
  for (let i = 1; i < RIVER.length; i++) {
    const [ax, az] = RIVER[i - 1];
    const [bx, bz] = RIVER[i];
    const dx = bx - ax;
    const dz = bz - az;
    const u = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    best = Math.min(best, Math.hypot(x - ax - u * dx, z - az - u * dz));
  }
  return best;
};
// where the frame-0 tray stands at full hero scale (RIDGE + (tray - RIDGE) * 3.2)
const HERO_TRAY: [number, number] = [-20.2 + (-23.6 + 20.2) * 3.2, -5.8 + (-1.0 + 5.8) * 3.2];
const PALMS = (() => {
  const out: {x: number; z: number; h: number; reach: number}[] = [];
  for (let i = 0; out.length < 520 && i < 6000; i++) {
    const x = (random(`px${i}`) - 0.5) * 92;
    const z = (random(`pz${i}`) - 0.5) * 92;
    if (riverDist(x, z) < 1.4) continue;
    if (x > -7.5 && x < 8 && z > -9.5 && z < 10) continue; // the walled town and its banks
    if ([PEAK_W, PEAK_M, PEAK_E].some(([px, pz]) => Math.hypot(x - px, z - pz) < 5)) continue;
    if (Math.abs(x - RAIL_X) < 1.8 && z < -12) continue;
    if (Math.hypot(x - BAN_PUEN[0], z - BAN_PUEN[1]) < 2.4) continue;
    if (Math.hypot(x - MAHATHAT[0], z - MAHATHAT[1]) < 2) continue;
    if (Math.hypot(x - HERO_TRAY[0], z - HERO_TRAY[1]) < 12.5) continue; // the frame-0 tray
    // the modern town grows out from the walls at about 2 years per unit (index.ts urban)
    const fromWalls = Math.max(0, Math.hypot(Math.max(0, Math.abs(x) - 6), Math.max(0, Math.abs(z) - 8)));
    out.push({x, z, h: 1.8 + random(`ph${i}`) * 0.6, reach: 1930 + 2.0 * fromWalls + random(`pr${i}`) * 6});
  }
  return out;
})();
const Palms: React.FC<{Y: number; terrainH: LandmarkProps['terrainH']}> = ({Y, terrainH}) => {
  const trunk = useRef<THREE.InstancedMesh>(null);
  const crown = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    updateInstances(trunk.current, PALMS.length, (i, o) => {
      const p = PALMS[i];
      if (Y > p.reach) return false;
      o.position.set(p.x, terrainH(p.x, p.z) + p.h / 2, p.z);
      o.scale.set(1, p.h, 1);
      return true;
    });
    updateInstances(crown.current, PALMS.length, (i, o) => {
      const p = PALMS[i];
      if (Y > p.reach) return false;
      o.position.set(p.x, terrainH(p.x, p.z) + p.h + 0.12, p.z);
      o.rotation.set(0, i, 0);
      return true;
    });
  });
  return (
    <>
      <instancedMesh ref={trunk} args={[undefined, undefined, PALMS.length]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 1, 5]} />
        <meshStandardMaterial color="#6e5a44" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crown} args={[undefined, undefined, PALMS.length]} castShadow>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#4f7d3a" roughness={0.9} flatShading />
      </instancedMesh>
    </>
  );
};

// ------------------------------------------------------------------ วัดกำแพงแลง
// five laterite prangs in the Bayon plan inside a low laterite wall; real towers ~15 m,
// drawn ~6x so they read from the opening's whole-tile shot as they rise
const LATERITE = '#8e4c32';
const KamphaengLaeng: React.FC<{k: number}> = ({k}) => (
  <group position={[KAMPHAENG_LAENG[0], 0, KAMPHAENG_LAENG[1]]}>
    <Prang pos={[0, 0, 0]} k={k} scale={0.62} color={LATERITE} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
      <Prang key={i} pos={[sx * 1.9, 0, sz * 1.9]} k={Math.max(0, Math.min(1, k * 1.25 - 0.1 * i))} scale={0.4} color={LATERITE} />
    ))}
    {k > 0.05 &&
      [[0, -3.0, 6.2, 0.3], [0, 3.0, 6.2, 0.3], [-3.0, 0, 0.3, 6.2], [3.0, 0, 0.3, 6.2]].map(([x, z, w, l], i) => (
        <mesh key={`w${i}`} position={[x, 0.25 * k, z]} scale={[1, k, 1]} castShadow receiveShadow>
          <boxGeometry args={[w, 0.5, l]} />
          <meshStandardMaterial color={LATERITE} roughness={1} />
        </mesh>
      ))}
  </group>
);

// ------------------------------------------------------------------ วัดมหาธาตุวรวิหาร
// the white five-prang group, the town's tallest skyline, with its cloister
const WHITE = '#f3efe6';
const Mahathat: React.FC<{k: number; night: number}> = ({k, night}) => (
  <group position={[MAHATHAT[0], 0, MAHATHAT[1]]}>
    <Prang pos={[0, 0, 0]} k={k} scale={0.7} color={WHITE} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
      <Prang key={i} pos={[sx * 1.5, 0, sz * 1.5]} k={k} scale={0.34} color={WHITE} />
    ))}
    {k > 0.05 && (
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[4.0, 0.4, 4.0]} />
        <meshStandardMaterial color="#d8cfbd" roughness={1} emissive="#ffd28a" emissiveIntensity={night * 0.25} />
      </mesh>
    )}
  </group>
);

// ------------------------------------------------------------------ พระนครคีรี
// Khao Wang's three crowns, each on its own peak (heights from terrainH): the palace group on
// the west peak, พระธาตุจอมเพชร (built over an older chedi) on the middle one, วัดพระแก้วน้อย
// on the east. Floodlit at night (untone-mapped so ACES does not wash the glow out).
const BELL = lathe([[0, 0], [1.2, 0], [1.2, 0.35], [1.0, 0.4], [1.0, 0.7], [0.95, 1.1], [0.85, 1.5], [0.6, 1.85], [0.32, 2.0], [0.3, 2.3], [0.16, 2.5], [0.1, 3.4], [0.04, 3.9], [0, 4.1]], 16);
const Glow: React.FC<{color: string; night: number; base?: number}> = ({color, night, base = 0}) => (
  <meshStandardMaterial color={color} roughness={0.6} emissive="#ffd27a" emissiveIntensity={base + night * 0.9} />
);
// `g` grows the whole group (sizes and spacing) for the frame-0 hero; 1 for the real palace
const KhaoWang: React.FC<{k: number; g?: number; old: number; night: number; terrainH: LandmarkProps['terrainH']}> = ({k, g = 1, old, night, terrainH}) => {
  const roof = useMemo(() => prism(1.3, 0.55, 1.8), []);
  const at = (p: [number, number], dx = 0, dz = 0): [number, number, number] => [p[0] + dx * g, terrainH(p[0] + dx * g, p[1] + dz * g) - 0.05, p[1] + dz * g];
  const kk = (a: number, b: number) => smooth(ramp(k, a, b));
  return (
    <>
      {/* the older chedi on the summit, grey, before Rama IV built the new one over it */}
      <SmallChedi pos={at(PEAK_M)} scale={0.7 * g} k={old * (1 - kk(0.25, 0.5))} color="#9b958a" />
      {/* พระธาตุจอมเพชร */}
      {/* gated on its own scale: a mesh at y-scale 0 gets a singular normal matrix, NaN shading,
          and the shader look's bloom spreads the NaN over the whole frame (PR #53, 22.17 s) */}
      {kk(0.2, 0.6) > 0.02 && (
        <mesh geometry={BELL} position={at(PEAK_M)} scale={[0.8 * g, 0.8 * g * kk(0.2, 0.6), 0.8 * g]} castShadow>
          <Glow color={WHITE} night={night} />
        </mesh>
      )}
      {/* the palace group: three halls and the domed observatory หอชัชวาลเวียงชัย */}
      {[
        [-1.3, 0.5, 0],
        [-0.6, -1.4, 1.57],
        [1.0, -1.5, 1.2],
      ].map(([dx, dz, r], i) => {
        const s = kk(0.35 + i * 0.08, 0.7 + i * 0.08);
        if (s < 0.02) return null;
        return (
          <group key={i} position={at(PEAK_W, dx, dz)} rotation-y={r} scale={[1.2 * g, 1.2 * g * s, 1.2 * g]}>
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.7, 1.6]} />
              <Glow color="#f2ece0" night={night} />
            </mesh>
            <mesh geometry={roof} position={[0, 0.7, 0]} castShadow>
              <meshStandardMaterial color="#7f8a92" roughness={0.7} flatShading side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
      {kk(0.55, 0.85) > 0.02 && (
        <group position={at(PEAK_W, 0.3, -0.2)} scale={[1.3 * g, 1.3 * g * kk(0.55, 0.85), 1.3 * g]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.36, 1.6, 12]} />
            <Glow color="#f5f0e4" night={night} />
          </mesh>
          <mesh position={[0, 1.6, 0]} castShadow>
            <sphereGeometry args={[0.36, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Glow color="#e9e4da" night={night} />
          </mesh>
        </group>
      )}
      {/* วัดพระแก้วน้อย: a small marble-grey ubosot and its prang */}
      <Viharn pos={at(PEAK_E, 0.8, 0.4)} k={kk(0.45, 0.8)} rot={0.1} scale={0.7 * g} />
      <Prang pos={at(PEAK_E, 0.5, -1.1)} k={kk(0.5, 0.85)} scale={0.34 * g} color="#e6e2da" />
    </>
  );
};

// the frame-0 hero's hill: three wooded lobes at the real peaks and heights, so scaled up it
// still reads as Khao Wang (the real terrain is inside it)
export const RIDGE: [number, number] = [-20.2, -5.8];
// the tray beside it, in the same (unscaled) coordinates: toward the camera and to its right
const RIDGE_TRAY: [number, number] = [-23.6, -1.0];
// `k` sinks it into the real hill as the hero goes, so it never pops out at full size
const HeroMound: React.FC<{k: number; terrainH: LandmarkProps['terrainH']}> = ({k, terrainH}) => (
  <>
    {([[PEAK_W, 2.3], [PEAK_M, 2.0], [PEAK_E, 1.8]] as [[number, number], number][]).map(([p, r], i) => (
      <mesh key={i} position={[p[0], 0, p[1]]} scale={[r * (0.6 + 0.4 * k), (terrainH(p[0], p[1]) + 0.1) * (0.3 + 0.7 * k), r * (0.6 + 0.4 * k)]} castShadow receiveShadow>
        <sphereGeometry args={[1, 10, 7, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#4c7a37" roughness={0.95} flatShading />
      </mesh>
    ))}
  </>
);

// the frame-0 hero's ขนมหม้อแกง, beside the hill, in the hero group's own coordinates (it is
// scaled about RIDGE with the hill). Built to read as the real thing from the cover shot:
// a shallow aluminium tray; the custard cut into twelve pieces, each with a slightly domed,
// glossy top baked golden in the middle and caramel-brown toward the tray walls, mottled where
// the heat caught it; a thick scatter of fried shallots; and one piece lifted out on a server
// so the pale, dense cut face shows, with its thin brown skin on top.
export const TRAY_AT: [number, number] = [RIDGE_TRAY[0], RIDGE_TRAY[1]];
const TRAY = {x: 2.6, z: 1.9, h: 0.42, wall: 0.022};
const COLS = 4;
const ROWS = 3;
const GAP = 0.03;
const PIECE = {
  w: (TRAY.x - 2 * TRAY.wall - (COLS - 1) * GAP) / COLS,
  d: (TRAY.z - 2 * TRAY.wall - (ROWS - 1) * GAP) / ROWS,
  h: 0.36,
  dome: 0.05,
};
const pieceAt = (c: number, r: number): [number, number] => [
  -TRAY.x / 2 + TRAY.wall + PIECE.w / 2 + c * (PIECE.w + GAP),
  -TRAY.z / 2 + TRAY.wall + PIECE.d / 2 + r * (PIECE.d + GAP),
];
// the piece nearest the cover camera (west, right of frame) is the one being served
const LIFT = {c: 0, r: 2};
const domeY = (u: number, v: number) => PIECE.dome * Math.max(0, 1 - (2 * u / PIECE.w) ** 2) * Math.max(0, 1 - (2 * v / PIECE.d) ** 2);
// a box whose top face puffs up like baked custard (the edges stay put, so the sides meet it)
const domedPiece = () => {
  const g = new THREE.BoxGeometry(PIECE.w, PIECE.h, PIECE.d, 6, 1, 6);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    if (pos.getY(i) > PIECE.h / 2 - 1e-6) pos.setY(i, PIECE.h / 2 + domeY(pos.getX(i), pos.getZ(i)));
  }
  g.computeVertexNormals();
  return g;
};
// the whole tray's top in one canvas: golden, darker toward the walls and corners, mottled
const topTexture = () => {
  const W = 512;
  const H = Math.round((W * (TRAY.z - 2 * TRAY.wall)) / (TRAY.x - 2 * TRAY.wall));
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  // deep golden in the middle, the palm sugar caramelising darker toward the hot tray walls
  const mid = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.62);
  mid.addColorStop(0, '#dc9a42');
  mid.addColorStop(0.7, '#c98536');
  mid.addColorStop(1, '#a8652a');
  g.fillStyle = mid;
  g.fillRect(0, 0, W, H);
  const edge = (x0: number, y0: number, x1: number, y1: number) => {
    const grd = g.createLinearGradient(x0, y0, x1, y1);
    grd.addColorStop(0, 'rgba(96,42,10,0.85)');
    grd.addColorStop(0.4, 'rgba(126,62,18,0.38)');
    grd.addColorStop(1, 'rgba(120,58,16,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, W, H);
  };
  edge(0, 0, W * 0.13, 0);
  edge(W, 0, W * 0.87, 0);
  edge(0, 0, 0, H * 0.16);
  edge(0, H, 0, H * 0.84);
  const blob = (x: number, y: number, r: number, color: string) => {
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, color);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
  };
  // browned patches where the top heat caught it, thicker toward the edges
  for (let i = 0; i < 230; i++) {
    const bx = random(`mtx${i}`);
    const by = random(`mty${i}`);
    const toEdge = Math.min(bx, 1 - bx, by, 1 - by);
    const a = (0.14 + 0.22 * random(`mta${i}`)) * (toEdge < 0.18 ? 1.4 : 1);
    blob(bx * W, by * H, 4 + 13 * random(`mtr${i}`), `rgba(104,46,12,${a.toFixed(2)})`);
  }
  // a little warmer gold where the custard rose highest
  for (let i = 0; i < 40; i++) {
    blob((0.2 + 0.6 * random(`mhx${i}`)) * W, (0.2 + 0.6 * random(`mhy${i}`)) * H, 8 + 16 * random(`mhr${i}`), 'rgba(222,150,62,0.22)');
  }
  // fine crust grain, darker only (pale specks read as flour)
  for (let i = 0; i < 700; i++) {
    g.fillStyle = 'rgba(88,38,10,0.3)';
    g.fillRect(random(`mgx${i}`) * W, random(`mgy${i}`) * H, 1 + random(`mgs${i}`) * 1.5, 1 + random(`mgt${i}`) * 1.5);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
// the cut face: pale, dense mung-bean-and-palm-sugar custard under a thin brown baked skin
const sideTexture = () => {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const g = c.getContext('2d')!;
  const grd = g.createLinearGradient(0, 0, 0, 64);
  grd.addColorStop(0, '#5e300e');
  grd.addColorStop(0.08, '#874a1a');
  grd.addColorStop(0.15, '#c99a58');
  grd.addColorStop(0.3, '#d6ae6b');
  grd.addColorStop(0.92, '#dbb575');
  grd.addColorStop(1, '#b9874a');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 90; i++) {
    g.fillStyle = 'rgba(170,118,52,0.18)';
    g.fillRect(random(`msx${i}`) * 64, 10 + random(`msy${i}`) * 52, 1, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
// fried shallots: thin crescent rings, golden to dark amber, scattered thick over the top
const SHALLOTS = (() => {
  const out: {x: number; z: number; y: number; ry: number; rx: number; s: number; col: string}[] = [];
  for (let i = 0; out.length < 820 && i < 6000; i++) {
    const c = Math.floor(random(`shc${i}`) * COLS);
    const r = Math.floor(random(`shr${i}`) * ROWS);
    if (c === LIFT.c && r === LIFT.r) continue;
    const u = (random(`shu${i}`) - 0.5) * (PIECE.w - 0.06);
    const v = (random(`shv${i}`) - 0.5) * (PIECE.d - 0.06);
    const [px, pz] = pieceAt(c, r);
    const k = random(`shk${i}`);
    out.push({
      x: px + u,
      z: pz + v,
      y: TRAY.wall + PIECE.h + domeY(u, v) + 0.006,
      ry: random(`shy${i}`) * Math.PI * 2,
      rx: Math.PI / 2 + (random(`shx${i}`) - 0.5) * 0.5,
      s: 0.7 + random(`shs${i}`) * 0.6,
      col: k < 0.45 ? '#c27a30' : k < 0.85 ? '#9c5419' : '#5e2f0e',
    });
  }
  return out;
})();
const ON_LIFTED = SHALLOTS.slice(0, 24).map((sh, i) => ({...sh, x: (random(`slx${i}`) - 0.5) * (PIECE.w - 0.08), z: (random(`slz${i}`) - 0.5) * (PIECE.d - 0.08)}));
const Shallots: React.FC<{list: typeof SHALLOTS; lifted?: boolean}> = ({list, lifted}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => new THREE.Color(), []);
  useLayoutEffect(() => {
    updateInstances(ref.current, list.length, (i, o) => {
      const sh = list[i];
      o.position.set(sh.x, lifted ? PIECE.h / 2 + domeY(sh.x, sh.z) + 0.006 : sh.y, sh.z);
      // lay the ring flat first, then spin it about the vertical
      o.rotation.order = 'YXZ';
      o.rotation.set(sh.rx, sh.ry, 0);
      o.scale.setScalar(sh.s);
      return true;
    });
    list.forEach((sh, i) => ref.current?.setColorAt(i, tmp.set(sh.col)));
    if (ref.current?.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, list.length]} castShadow>
      <torusGeometry args={[0.034, 0.0085, 3, 6, 2.3]} />
      <meshStandardMaterial roughness={0.6} />
    </instancedMesh>
  );
};
const ALUMINIUM = <meshStandardMaterial color="#dfe3e7" metalness={0.3} roughness={0.22} />;
// the tray's sides lean out a little, as a pressed aluminium tray's do
const FLARE = 0.12;
// `k` 0 -> 1 grows it in (it must shrink away with the hero, not pop out at full size)
const MoKaeng: React.FC<{k: number; t: number}> = ({k, t}) => {
  const geo = useMemo(domedPiece, []);
  const tops = useMemo(() => {
    const base = topTexture();
    return Array.from({length: COLS * ROWS}, (_, i) => {
      const c = i % COLS;
      const r = Math.floor(i / COLS);
      const map = base.clone();
      map.needsUpdate = true;
      map.repeat.set(1 / COLS, 1 / ROWS);
      map.offset.set(c / COLS, (ROWS - 1 - r) / ROWS);
      // a soft sheen, not a lacquer: strong clearcoat glare read as a chalky film
      return new THREE.MeshPhysicalMaterial({map, roughness: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.5});
    });
  }, []);
  const sideMat = useMemo(() => new THREE.MeshStandardMaterial({map: sideTexture(), roughness: 0.55}), []);
  const mats = (i: number) => [sideMat, sideMat, tops[i], sideMat, sideMat, sideMat];
  if (k < 0.02) return null;
  const [lx, lz] = pieceAt(LIFT.c, LIFT.r);
  // the served piece rises a little over the opening seconds
  const lift = 0.3 + 0.08 * Math.min(1, t / 2);
  const y0 = TRAY.wall + PIECE.h / 2;
  return (
    <group position={[TRAY_AT[0], 0, TRAY_AT[1]]} rotation-y={0.25} scale={1.75 * k}>
      {/* the tray: floor, walls and a rolled rim */}
      <mesh position={[0, TRAY.wall / 2, 0]} receiveShadow>
        <boxGeometry args={[TRAY.x, TRAY.wall, TRAY.z]} />
        {ALUMINIUM}
      </mesh>
      {[
        // x, z, w, d, lean about x, lean about z (each side leans outward)
        [0, -TRAY.z / 2 + TRAY.wall / 2, TRAY.x, TRAY.wall, -FLARE, 0],
        [0, TRAY.z / 2 - TRAY.wall / 2, TRAY.x, TRAY.wall, FLARE, 0],
        [-TRAY.x / 2 + TRAY.wall / 2, 0, TRAY.wall, TRAY.z, 0, FLARE],
        [TRAY.x / 2 - TRAY.wall / 2, 0, TRAY.wall, TRAY.z, 0, -FLARE],
      ].map(([x, z, w, d, rx, rz], i) => (
        <group key={i} position={[x, 0, z]} rotation-x={rx} rotation-z={rz}>
          <mesh position={[0, TRAY.h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w + (w > d ? 0.1 : 0), TRAY.h, d + (d > w ? 0.1 : 0)]} />
            {ALUMINIUM}
          </mesh>
          <mesh position={[0, TRAY.h, 0]} castShadow>
            <boxGeometry args={[w + (w > d ? 0.16 : 0.03), 0.026, d + (d > w ? 0.16 : 0.03)]} />
            {ALUMINIUM}
          </mesh>
        </group>
      ))}
      {/* caramel left on the walls above the custard line */}
      {[
        [0, -TRAY.z / 2 + TRAY.wall + 0.004, TRAY.x - 2 * TRAY.wall, 0.008],
        [0, TRAY.z / 2 - TRAY.wall - 0.004, TRAY.x - 2 * TRAY.wall, 0.008],
        [-TRAY.x / 2 + TRAY.wall + 0.004, 0, 0.008, TRAY.z - 2 * TRAY.wall],
        [TRAY.x / 2 - TRAY.wall - 0.004, 0, 0.008, TRAY.z - 2 * TRAY.wall],
      ].map(([x, z, w, d], i) => (
        <mesh key={`c${i}`} position={[x + Math.sign(x) * 0.045, TRAY.wall + PIECE.h + 0.025, z + Math.sign(z) * 0.045]}>
          <boxGeometry args={[w, 0.04, d]} />
          <meshStandardMaterial color="#7a4116" roughness={0.6} />
        </mesh>
      ))}
      {/* the pieces, cut with thin gaps, one slot empty where the served piece came from */}
      {Array.from({length: COLS * ROWS}, (_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        if (c === LIFT.c && r === LIFT.r) return null;
        const [x, z] = pieceAt(c, r);
        return <mesh key={`p${i}`} geometry={geo} material={mats(i)} position={[x, y0, z]} castShadow receiveShadow />;
      })}
      {/* what the served piece left on the tray floor */}
      <mesh position={[lx, TRAY.wall + 0.004, lz]}>
        <boxGeometry args={[PIECE.w - 0.04, 0.008, PIECE.d - 0.04]} />
        <meshStandardMaterial color="#c79a55" roughness={0.7} />
      </mesh>
      <Shallots list={SHALLOTS} />
      {/* the served piece on a steel server with a wooden handle, tilted so its top and its
          cut face both turn to the camera */}
      <group position={[lx - 0.22, y0 + lift, lz]} rotation-z={0.18}>
        <mesh geometry={geo} material={mats(LIFT.r * COLS + LIFT.c)} castShadow />
        <Shallots list={ON_LIFTED} lifted />
        <mesh position={[0, -PIECE.h / 2 - 0.008, 0]} castShadow>
          <boxGeometry args={[PIECE.w + 0.06, 0.014, PIECE.d + 0.04]} />
          <meshStandardMaterial color="#d9dce0" metalness={0.4} roughness={0.28} />
        </mesh>
        <mesh position={[-PIECE.w / 2 - 0.3, -PIECE.h / 2 + 0.12, 0]} rotation-z={-0.42} castShadow>
          <boxGeometry args={[0.7, 0.04, 0.09]} />
          <meshStandardMaterial color="#5c3a20" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ พระรามราชนิเวศน์
// two pale storeys under steep red roofs, a round corner tower; real ~100 m long, drawn ~2.4x
const BanPuen: React.FC<{k: number; night: number}> = ({k, night}) => {
  const roof = useMemo(() => prism(1.5, 0.8, 3.4), []);
  if (k < 0.02) return null;
  return (
    <group position={[BAN_PUEN[0], 0, BAN_PUEN[1]]} rotation-y={0.2} scale={[1.5, 1.5 * k, 1.5]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.1, 3.2]} />
        <meshStandardMaterial color="#efe3c4" roughness={0.85} emissive="#ffd28a" emissiveIntensity={night * 0.3} />
      </mesh>
      <mesh geometry={roof} position={[0, 1.1, 0]} castShadow>
        <meshStandardMaterial color="#a8432e" roughness={0.75} flatShading side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.8, 0.75, -1.4]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 1.5, 12]} />
        <meshStandardMaterial color="#efe3c4" roughness={0.85} />
      </mesh>
      <mesh position={[0.8, 1.75, -1.4]} castShadow>
        <coneGeometry args={[0.46, 0.7, 12]} />
        <meshStandardMaterial color="#a8432e" roughness={0.75} flatShading />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ the 2124 siege
const WarBoat: React.FC = () => (
  <group>
    <mesh position={[0, 0.15, 0]} castShadow>
      <boxGeometry args={[0.45, 0.26, 2.6]} />
      <meshStandardMaterial color="#5a3a24" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.42, 0.3]} castShadow>
      <boxGeometry args={[0.4, 0.28, 0.7]} />
      <meshStandardMaterial color="#7c2a20" roughness={0.9} />
    </mesh>
    {[-0.8, -0.3, 0.2, 0.7].map((z, i) => (
      <mesh key={i} position={[0, 0.48, z]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.32, 5]} />
        <meshStandardMaterial color="#3a2a22" roughness={0.9} />
      </mesh>
    ))}
  </group>
);
// a timber หอรบ on the wall; burning flames and a smoke column while `f` > 0
const Tower: React.FC<{x: number; z: number; f: number; t: number}> = ({x, z, f, t}) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 1.1, 0]} castShadow>
      <boxGeometry args={[0.9, 2.2, 0.9]} />
      <meshStandardMaterial color={f > 0.3 ? '#3b2a20' : '#7a5232'} roughness={0.95} />
    </mesh>
    {f > 0.02 &&
      [0, 1, 2, 3].map((i) => {
        const fl = 0.75 + 0.25 * Math.sin(t * 17 + i * 2.1);
        return (
          <mesh key={i} position={[(i % 2 - 0.5) * 0.4, 2.4 + 0.25 * i, ((i >> 1) - 0.5) * 0.4]} scale={[f * fl, f * fl * 1.5, f * fl]}>
            <coneGeometry args={[0.32, 1.0, 6]} />
            <meshBasicMaterial color={i % 2 ? '#ffb02e' : '#ff6a1c'} toneMapped={false} />
          </mesh>
        );
      })}
    {f > 0.02 &&
      [0, 1, 2, 3, 4].map((i) => {
        const a = (t * 0.6 + i / 5) % 1;
        return (
          <mesh key={`s${i}`} position={[0.4 * a, 3 + a * 4.5, -0.6 * a]} scale={f * (0.5 + a * 1.2)}>
            <sphereGeometry args={[0.6, 7, 6]} />
            <meshStandardMaterial color="#5b5550" transparent opacity={0.55 * (1 - a)} depthWrite={false} />
          </mesh>
        );
      })}
  </group>
);
const Cart: React.FC = () => (
  <group>
    <mesh position={[0, 0.45, 0]} castShadow>
      <boxGeometry args={[0.6, 0.3, 1.0]} />
      <meshStandardMaterial color={LATERITE} roughness={1} />
    </mesh>
    {[-0.36, 0.36].map((x) => (
      <mesh key={x} position={[x, 0.3, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.3, 0.3, 0.08, 10]} />
        <meshStandardMaterial color="#4a3424" roughness={1} />
      </mesh>
    ))}
    <mesh position={[0, 0.45, 1.0]} castShadow>
      <boxGeometry args={[0.45, 0.45, 0.8]} />
      <meshStandardMaterial color="#8a8172" roughness={1} />
    </mesh>
  </group>
);

export const PhetchaburiLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH, beat}) => {
  const ctx = {Y, beat};
  const towers = Y >= 1185 ? towersUp(Y, ctx) : 0;
  const mahathat = smooth(ramp(Y, 1440, 1470));
  const watYai = smooth(ramp(Y, 1680, 1700));
  // the palace rises across its beat and stands from then on
  const palace = Y >= 1862.45 ? 1 : Y >= 1859 ? beat('palace') : 0;
  const hero = heroK(ctx);
  const banPuen = Y >= 1916.45 ? 1 : Y >= 1910 ? smooth(ramp(beat('banpuen'), 0.05, 0.85)) : 0;
  const {west, east, town} = siege(t, ctx);
  const f = fireK(ctx);
  const gateX = eastWallX(BANG_CHAN[1]);
  return (
    <>
      <Palms Y={Y} terrainH={terrainH} />
      <KamphaengLaeng k={towers} />
      <Mahathat k={mahathat} night={night} />
      <Viharn pos={[WAT_YAI[0], 0, WAT_YAI[1]]} k={watYai} rot={0} scale={0.8} />
      {/* frame 0: the crowns at hero scale on the ridge (the cover frame), gone by the first
          caption; the real palace rises in its own beat */}
      <KhaoWang k={palace} old={Y >= 1300 ? 1 : 0} night={night} terrainH={terrainH} />
      {hero > 0.02 && (
        // the whole hill as a model, scaled about the ridge's centre so nothing collides
        <group position={[RIDGE[0], 0, RIDGE[1]]} scale={1 + 2.2 * hero}>
          <group position={[-RIDGE[0], 0, -RIDGE[1]]}>
            <HeroMound k={hero} terrainH={terrainH} />
            <MoKaeng k={Math.min(1, hero * 1.3)} t={t} />
            <KhaoWang k={hero} old={0} night={night} terrainH={terrainH} />
          </group>
        </group>
      )}
      <BanPuen k={banPuen} night={night} />
      {[0, 1, 2, 3].map((i) => {
        const c = cartAt(i, ctx);
        return c ? (
          <group key={i} position={[c.x, 0, c.z]} rotation-y={c.rot}>
            <Cart />
          </group>
        ) : null;
      })}
      {Array.from({length: FLEET}, (_, i) => {
        const b = boatAt(i, ctx);
        return b ? (
          <group key={i} position={[b.x, 0, b.z]} rotation-y={b.rot}>
            <WarBoat />
          </group>
        ) : null;
      })}
      <Army f={west} color="#7c2a20" terrainH={terrainH} />
      <Army f={east} color="#7c2a20" terrainH={terrainH} />
      <Army f={town} color="#e8e2d0" terrainH={terrainH} />
      {Y >= 1500 && Y < 1700 && (
        <>
          <Tower x={-5.3} z={WEST_ARMY_Z} f={f} t={t} />
          <Tower x={gateX - 0.2} z={BANG_CHAN[1] - 1.6} f={f} t={t} />
        </>
      )}
    </>
  );
};
