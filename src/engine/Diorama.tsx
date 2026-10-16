import {useThree} from '@react-three/fiber';
import {cityPoly, offsetPoly, polyEdges, polyPerimeter, polyPointAt, subtractBands, bandGaps, inBands, type Band, type Poly} from './poly';

const shapeCache = new Map<Poly, THREE.Shape>();
const polyShape = (p: Poly) => {
  let sh = shapeCache.get(p);
  if (!sh) {
    sh = new THREE.Shape(p.map(([x, z]) => new THREE.Vector2(x, -z)));
    shapeCache.set(p, sh);
  }
  return sh;
};
import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {random, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {DAYLIGHT, FPS, keyColor, lerp, lighting, mix, ramp, smooth} from '../lib';
import {BUILD_PALETTES} from '../Scene';
import {applyCamera, droneCamera} from './camera';
import {col, glowTexture, prism, updateInstances, windowTexture} from './parts';
import {inRiver as pointInRiver, isPathRiver, riverCrossings, riverLength, riverPointAt, riverSegments, subtractPathRivers} from './river';
import type {CityConfig, CityLayout} from './types';
import {MAX_CARS, RING, carAt, decks, driveSegments, roadCrossings, riverSpan} from './roads';
import {World, getWorld, railSpan, stationPos} from './world';
import {LifeLayer} from './Life';

type P = {c: CityConfig; w: World};

const useT = (c: CityConfig) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return {frame, t, Y: c.story.yearAt(t), dur: c.story.duration ?? 60};
};

// ------------------------------------------------------------------ camera, lights, sync
const CameraRig: React.FC<P> = ({c}) => {
  const {t, dur} = useT(c);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    applyCamera(camera, droneCamera(c.layout.cameraKeys)(t));
  }, [camera, t, c]);
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

export const sunState = (t: number, dur = 60) => {
  const {cyc, night, finale} = lighting(t, dur);
  const day = cyc / DAYLIGHT;
  const th = Math.PI * Math.min(1, Math.max(0, day));
  const elev = Math.sin(th);
  const dir = new THREE.Vector3(Math.cos(th), Math.max(0.05, elev) * 1.1, 0.45).normalize();
  const vis = (cyc < DAYLIGHT ? 1 : 0) * (1 - finale);
  return {dir, elev, vis, night};
};

const Lights: React.FC<P> = ({c, w}) => {
  const {t, Y, dur} = useT(c);
  const {dir, elev, vis, night} = sunState(t, dur);
  const {finale} = lighting(t, dur);
  // The sun is the key light. During story time, sky fill rises as it sets so a timelapse
  // night dims the scene instead of blacking it out; the finale is allowed to go fully dark.
  const sunF = vis * Math.max(0, elev) ** 0.6;
  const fill = (1 - sunF) * 1.3 * (1 - finale);
  const sun = useRef<THREE.DirectionalLight>(null);
  const tgt = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    tgt.position.set(w.C[0], 0, w.C[1]);
    tgt.updateMatrixWorld();
    if (sun.current) sun.current.target = tgt;
  });
  const warm = 1 - Math.min(1, elev * 2.2);
  const half = w.S * 0.78;
  return (
    <>
      <primitive object={tgt} />
      <hemisphereLight args={[mix('#cfe3ff', '#4a5a9a', night), mix('#6f8a4a', '#1a2440', night), lerp(1.2, 1.05, night) + fill + (c.ambient?.(Y) ?? 0)]} />
      <directionalLight
        ref={sun}
        position={[w.C[0] + dir.x * 150, dir.y * 150, w.C[1] + dir.z * 150]}
        intensity={sunF * 3.0 * (1 - night)}
        color={mix('#fff4e0', '#ff9a4a', warm)}
        castShadow
        // the shader look doubles the shadow resolution (issue #27, step 1)
        shadow-mapSize-width={c.look === 'shader' ? 4096 : 2048}
        shadow-mapSize-height={c.look === 'shader' ? 4096 : 2048}
        shadow-camera-left={-half}
        shadow-camera-right={half}
        shadow-camera-top={half}
        shadow-camera-bottom={-half}
        shadow-camera-near={1}
        shadow-camera-far={500}
        shadow-bias={-0.0006}
      />
      <directionalLight position={[w.C[0] - 60, 90, w.C[1] - 30]} intensity={1.7 * night} color="#9fb4ff" />
    </>
  );
};

// ------------------------------------------------------------------ land
const Ground: React.FC<P> = ({c, w}) => {
  const {Y, dur} = useT(c);
  const g = c.gloom(Y);
  const ground = mix(keyColor(c.sky.ground, Y), '#8c8a70', g * 0.4);
  const {tile} = c.layout;
  const {terrain, skirt} = useMemo(() => {
    const seg = 96;
    const geo = new THREE.PlaneGeometry(w.S, w.S, seg, seg);
    geo.rotateX(-Math.PI / 2);
    geo.translate(w.C[0], 0, w.C[1]);
    const pos = geo.attributes.position;
    const colors: number[] = [];
    const forest = new THREE.Color(c.layout.forest ?? '#5f8c5a');
    for (let i = 0; i < pos.count; i++) {
      const h = w.terrainH(pos.getX(i), pos.getZ(i));
      pos.setY(i, h > 0.15 ? h : 0);
      const cc = new THREE.Color('#ffffff').lerp(forest, Math.min(1, h / 3));
      colors.push(cc.r, cc.g, cc.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const v: number[] = [];
    const BOT = -1.4;
    const hh = (x: number, z: number) => {
      const h = w.terrainH(x, z);
      return h > 0.15 ? h : 0;
    };
    const edge = (ax: number, az: number, bx: number, bz: number) => {
      const n = 120;
      for (let i = 0; i < n; i++) {
        const x0 = lerp(ax, bx, i / n);
        const z0 = lerp(az, bz, i / n);
        const x1 = lerp(ax, bx, (i + 1) / n);
        const z1 = lerp(az, bz, (i + 1) / n);
        v.push(x0, hh(x0, z0), z0, x0, BOT, z0, x1, BOT, z1, x0, hh(x0, z0), z0, x1, BOT, z1, x1, hh(x1, z1), z1);
      }
    };
    edge(tile.x0, tile.z1, tile.x1, tile.z1);
    edge(tile.x1, tile.z1, tile.x1, tile.z0);
    edge(tile.x1, tile.z0, tile.x0, tile.z0);
    edge(tile.x0, tile.z0, tile.x0, tile.z1);
    const s = new THREE.BufferGeometry();
    s.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    s.computeVertexNormals();
    return {terrain: geo.toNonIndexed(), skirt: s};
  }, [c, w, tile]);
  return (
    <>
      <mesh geometry={terrain} receiveShadow castShadow>
        <meshStandardMaterial vertexColors flatShading roughness={1} color={ground} />
      </mesh>
      <mesh geometry={skirt} castShadow>
        <meshStandardMaterial color="#6b4a2e" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[w.C[0], -3.6, w.C[1]]} castShadow receiveShadow>
        <boxGeometry args={[w.S, 4.4, w.S]} />
        <meshStandardMaterial color="#a8774c" roughness={1} />
      </mesh>
      <mesh position={[w.C[0], -6.7, w.C[1]]} castShadow>
        <boxGeometry args={[w.S, 1.8, w.S]} />
        <meshStandardMaterial color="#7d6a5c" roughness={1} />
      </mesh>
    </>
  );
};

const Paddies: React.FC<P> = ({c, w}) => {
  const {Y, dur} = useT(c);
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    w.paddies.forEach((p, i) => {
      const urban = ramp(Y, p.urban, p.urban + 8);
      const tone = (Math.sin(Y * 0.9 + i) + 1) / 2;
      col.set(urban > 0.5 ? '#a8a597' : mix(mix('#8fbf55', '#d8c45e', tone * 0.7), '#a8a597', urban));
      m.setColorAt(i, col);
    });
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    updateInstances(m, w.paddies.length, (i, o) => {
      const p = w.paddies[i];
      const k = ramp(Y, p.appear, p.appear + 30);
      o.position.set(p.x, 0.03, p.z);
      o.scale.set(3.6 * k, 1, 3.6 * k);
      return k > 0.02;
    });
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, w.paddies.length]} receiveShadow>
      <boxGeometry args={[1, 0.06, 1]} />
      <meshStandardMaterial roughness={1} />
    </instancedMesh>
  );
};

const along = (L: CityLayout, axis: 'x' | 'z', a: number, crossPos: number, y: number): [number, number, number] =>
  axis === 'z' ? [crossPos, y, a] : [a, y, crossPos];

const Water: React.FC<P> = ({c}) => {
  const {Y, frame} = useT(c);
  const L = c.layout;
  const {city} = L;
  const water = mix('#3f8fc0', '#617a86', c.gloom(Y) * 0.6);
  const p = L.noMoat ? 0 : ramp(Y, city.moat[0], city.moat[1]) * 4;
  const mx = city.hx + 1.4;
  const mz = city.hz + 1.4;
  // east, north, west, south — dug in sequence. With a real footprint the moat
  // follows the wall line pushed 1.4 units outward instead.
  const sides: [number, number, number, number, number][] = city.outline
    ? polyEdges(offsetPoly(cityPoly(city), 1.4)).map((e, i) => [e.mid[0], e.mid[1], e.angle, e.len + 1.4, i])
    : [
        [mx, 0, 0, 2 * mz + 2.8, 0],
        [0, -mz, Math.PI / 2, 2 * mx + 1.4, 1],
        [-mx, 0, 0, 2 * mz + 2.8, 2],
        [0, mz, Math.PI / 2, 2 * mx + 1.4, 3],
      ];
  return (
    <>
      {L.rivers.map((river, ri) => {
        if (isPathRiver(river)) {
          const segs = riverSegments(L, river);
          const joints = river.closed ? river.path : river.path.slice(1, -1);
          return (
            <group key={ri}>
              {segs.map((seg, si) => {
                const midX = (seg.a[0] + seg.b[0]) / 2;
                const midZ = (seg.a[1] + seg.b[1]) / 2;
                const rot = Math.PI / 2 - seg.angle;
                const nx = -Math.sin(seg.angle);
                const nz = Math.cos(seg.angle);
                const count = seg.len > 2 ? Math.round(seg.len / 2.4) : 0;
                return (
                  <group key={si}>
                    <mesh position={[midX, -0.6, midZ]} rotation-y={rot} receiveShadow>
                      <boxGeometry args={[river.width, 1.4, seg.len + 0.12]} />
                      <meshStandardMaterial color={water} roughness={0.12} metalness={0.25} />
                    </mesh>
                    {[-1, 1].map((side) => (
                      <mesh
                        key={side}
                        position={[midX + nx * side * river.width / 2, 0.08, midZ + nz * side * river.width / 2]}
                        rotation-y={rot}
                      >
                        <boxGeometry args={[0.35, 0.1, seg.len]} />
                        <meshStandardMaterial color="#b9a77c" roughness={1} />
                      </mesh>
                    ))}
                    {new Array(count).fill(0).map((_, i) => {
                      const a = 1 + ((i * 23.7 + frame * 0.12) % (seg.len - 2));
                      const p = riverPointAt(L, river, seg.start + a, -river.width * 0.36 + ((i * 1.37) % (river.width * 0.72)));
                      return (
                        <mesh key={`fl${i}`} position={[p.x, 0.1, p.z]} rotation-y={rot}>
                          <boxGeometry args={[0.06, 0.01, 1.2]} />
                          <meshBasicMaterial color="#d9f0ff" transparent opacity={0.45} />
                        </mesh>
                      );
                    })}
                  </group>
                );
              })}
              {joints.map(([x, z], i) => (
                <mesh key={`joint${i}`} position={[x, -0.6, z]} receiveShadow>
                  <cylinderGeometry args={[river.width / 2, river.width / 2, 1.4, 12]} />
                  <meshStandardMaterial color={water} roughness={0.12} metalness={0.25} />
                </mesh>
              ))}
            </group>
          );
        }
        const span = riverSpan(L, river);
        const mid = (span[0] + span[1]) / 2;
        const len = span[1] - span[0];
        const rot = river.axis === 'z' ? 0 : Math.PI / 2;
        return (
          <group key={ri}>
            <mesh position={along(L, river.axis, mid, river.pos, -0.6)} rotation-y={rot} receiveShadow>
              <boxGeometry args={[river.width, 1.4, len + 0.08]} />
              <meshStandardMaterial color={water} roughness={0.12} metalness={0.25} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={along(L, river.axis, mid, river.pos + (s * river.width) / 2, 0.08)} rotation-y={rot}>
                <boxGeometry args={[0.35, 0.1, len]} />
                <meshStandardMaterial color="#b9a77c" roughness={1} />
              </mesh>
            ))}
            {new Array(Math.round(len / 2.4)).fill(0).map((_, i) => {
              const a = span[0] + 1 + ((i * 23.7 + frame * 0.12) % (len - 2));
              return (
                <mesh key={`fl${i}`} position={along(L, river.axis, a, river.pos - river.width * 0.36 + ((i * 1.37) % (river.width * 0.72)), 0.1)} rotation-y={rot}>
                  <boxGeometry args={[0.06, 0.01, 1.2]} />
                  <meshBasicMaterial color="#d9f0ff" transparent opacity={0.45} />
                </mesh>
              );
            })}
          </group>
        );
      })}
      {sides.map(([x, z, r, l, i]) => {
        const k = Math.min(1, Math.max(0, p - i));
        if (k <= 0) return null;
        return (
          <mesh key={i} position={[x, 0.05, z]} rotation-y={r} receiveShadow>
            <boxGeometry args={[1.4, 0.06, l * k]} />
            <meshStandardMaterial color={water} roughness={0.12} metalness={0.25} />
          </mesh>
        );
      })}
    </>
  );
};

const Trees: React.FC<P> = ({c, w}) => {
  const {Y, dur} = useT(c);
  const trunk = useRef<THREE.InstancedMesh>(null);
  const crown = useRef<THREE.InstancedMesh>(null);
  const crown2 = useRef<THREE.InstancedMesh>(null);
  const T = w.trees;
  const scales = useMemo(() => new Float32Array(T.length), [T]);
  useLayoutEffect(() => {
    T.forEach((tr, i) => {
      let k = Y < tr.clear ? 1 : 1 - ramp(Y, tr.clear, tr.clear + 2);
      if (tr.regrow && Y > tr.regrow[0]) {
        k = Math.max(k, ramp(Y, tr.regrow[0], tr.regrow[0] + 50) * (1 - ramp(Y, tr.regrow[1], tr.regrow[1] + 4)));
      }
      scales[i] = k;
    });
    updateInstances(trunk.current, T.length, (i, o) => {
      const tr = T[i];
      const k = scales[i] * tr.s;
      o.position.set(tr.x, tr.y + 0.35 * k, tr.z);
      o.scale.set(k, k, k);
      return k > 0.02;
    });
    updateInstances(crown.current, T.length, (i, o) => {
      const tr = T[i];
      const k = scales[i] * tr.s;
      o.position.set(tr.x, tr.y + 1.15 * k, tr.z);
      o.rotation.set(tr.tint * 3, tr.tint * 7, 0);
      o.scale.set(k, k * 1.1, k);
      return k > 0.02;
    });
    updateInstances(crown2.current, T.length, (i, o) => {
      const tr = T[i];
      const k = scales[i] * tr.s * (tr.tint > 0.45 ? 1 : 0);
      o.position.set(tr.x + 0.25 * k, tr.y + 1.75 * k, tr.z - 0.15 * k);
      o.rotation.set(tr.tint * 5, tr.tint * 2, 0);
      o.scale.set(k * 0.62, k * 0.62, k * 0.62);
      return k > 0.02;
    });
  });
  useLayoutEffect(() => {
    T.forEach((tr, i) => {
      col.set(tr.tint < 0.33 ? '#3f7d3a' : tr.tint < 0.66 ? '#4f8f3f' : '#2f6a36');
      crown.current?.setColorAt(i, col);
      col.offsetHSL(0.01, 0, 0.06);
      crown2.current?.setColorAt(i, col);
    });
  }, [T]);
  return (
    <>
      <instancedMesh ref={trunk} args={[undefined, undefined, T.length]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 0.7, 5]} />
        <meshStandardMaterial color="#6b4a32" flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crown} args={[undefined, undefined, T.length]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial flatShading roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={crown2} args={[undefined, undefined, T.length]} castShadow>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial flatShading roughness={0.95} />
      </instancedMesh>
    </>
  );
};

/** Instanced traditional houses (box + gable roof) with a per-instance scale. */
const HouseSet: React.FC<{items: {x: number; z: number; rot: number}[]; k: (i: number) => number}> = ({items, k}) => {
  const body = useRef<THREE.InstancedMesh>(null);
  const roof = useRef<THREE.InstancedMesh>(null);
  const roofGeo = useMemo(() => prism(1.05, 0.6, 0.85), []);
  useLayoutEffect(() => {
    const ks = items.map((_, i) => k(i));
    updateInstances(body.current, items.length, (i, o) => {
      o.position.set(items[i].x, 0.22 * ks[i], items[i].z);
      o.rotation.y = items[i].rot;
      o.scale.set(1, ks[i], 1);
      return ks[i] > 0.02;
    });
    updateInstances(roof.current, items.length, (i, o) => {
      o.position.set(items[i].x, 0.44 * ks[i], items[i].z);
      o.rotation.y = items[i].rot;
      o.scale.set(1, ks[i], 1);
      return ks[i] > 0.02;
    });
  });
  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, items.length]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.44, 0.65]} />
        <meshStandardMaterial color="#9a6a45" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={roof} args={[roofGeo, undefined, items.length]} castShadow>
        <meshStandardMaterial color="#5a3420" roughness={0.9} flatShading side={THREE.DoubleSide} />
      </instancedMesh>
    </>
  );
};

const Houses: React.FC<P> = ({c, w}) => {
  const {Y, t, dur} = useT(c);
  const H = w.houses;
  const modern = useRef<THREE.InstancedMesh>(null);
  const {map, emap} = useMemo(windowTexture, []);
  const {night} = lighting(t, dur);
  // razed: a road or rail laid through the old town later removed the house for good
  const trad = (i: number) => {
    const h = H[i];
    if (smooth(ramp(Y, h.modern, h.modern + 5)) > 0.02) return 0;
    return (
      Math.min(
        1,
        smooth(ramp(Y, h.built, h.built + 6)) * (1 - ramp(Y, h.gone, h.gone + 10)) +
          (Y > h.rebuilt ? smooth(ramp(Y, h.rebuilt, h.rebuilt + 4)) : 0),
      ) * (1 - ramp(Y, h.razed, h.razed + 2))
    );
  };
  useLayoutEffect(() => {
    updateInstances(modern.current, H.length, (i, o) => {
      const h = H[i];
      const k = smooth(ramp(Y, h.modern, h.modern + 5)) * (1 - ramp(Y, h.razed, h.razed + 2));
      o.position.set(h.x, (h.modernH * k) / 2, h.z);
      o.rotation.y = h.rot;
      o.scale.set(0.95, Math.max(0.001, h.modernH * k), 0.8);
      return k > 0.02;
    });
  });
  useLayoutEffect(() => {
    H.forEach((h, i) => {
      col.set(BUILD_PALETTES[h.palette][0]);
      modern.current?.setColorAt(i, col);
    });
  }, [H]);
  return (
    <>
      <HouseSet items={H} k={trad} />
      <instancedMesh ref={modern} args={[undefined, undefined, H.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={map} emissiveMap={emap} emissive="#ffb85a" emissiveIntensity={night * 1.4} roughness={0.85} />
      </instancedMesh>
    </>
  );
};

const Village: React.FC<P> = ({c, w}) => {
  const {Y, dur} = useT(c);
  const V = w.village;
  const ab = c.layout.houses.abandon;
  const k = (i: number) =>
    smooth(ramp(Y, V[i].built, V[i].built + 8)) *
    (1 - ramp(Y, V[i].urban, V[i].urban + 4)) *
    (ab ? 1 - 0.6 * ramp(Y, ab.from, ab.from + ab.spread * 0.5) * (1 - ramp(Y, ab.rebuild, ab.rebuild + 15)) : 1);
  return <HouseSet items={V} k={k} />;
};

const Buildings: React.FC<P> = ({c, w}) => {
  const {Y, t, dur} = useT(c);
  const B = w.buildings;
  const ref = useRef<THREE.InstancedMesh>(null);
  const {map, emap} = useMemo(windowTexture, []);
  const {night} = lighting(t, dur);
  useLayoutEffect(() => {
    updateInstances(ref.current, B.length, (i, o) => {
      const b = B[i];
      // gone: a road laid through the block later (the ring road) took it down
      const g = smooth(ramp(Y, b.built, b.built + 6)) * (1 - ramp(Y, b.gone, b.gone + 2));
      // Korat had towers by the monument in 1940; high-rises came decades later
      const hr = c.layout.highRise;
      const up = hr == null ? 1 : smooth(ramp(Y, Math.max(b.built, hr), Math.max(b.built, hr) + 12));
      const h = (b.h - b.lift * (1 - up)) * g;
      o.position.set(b.x, h / 2, b.z);
      o.scale.set(b.w, Math.max(0.001, h), b.d);
      return g > 0.02;
    });
  });
  useLayoutEffect(() => {
    B.forEach((b, i) => {
      col.set(BUILD_PALETTES[b.palette][0]);
      ref.current?.setColorAt(i, col);
    });
  }, [B]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, B.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={map} emissiveMap={emap} emissive="#ffb85a" emissiveIntensity={night * 1.5} roughness={0.8} />
    </instancedMesh>
  );
};

/** Where a river crosses the wall line there has to be a gap -- boats passed
 *  through a water gate, the wall did not run across the channel. */
const riverBands = (L: CityLayout): Band[] =>
  L.rivers.flatMap((r) => {
    if (isPathRiver(r)) return [];
    const span = riverSpan(L, r);
    const half = r.width / 2 + 0.35;
    return [{axis: r.axis === 'z' ? 'x' : 'z', lo: r.pos - half, hi: r.pos + half, s0: span[0], s1: span[1]} as Band];
  });

type WallCut = {
  dry: [[number, number], [number, number]][];
  gaps: {p: [number, number]; q: [number, number]; angle: number}[];
};
const wallCutCache = new WeakMap<CityLayout, WallCut[]>();
const wallCuts = (L: CityLayout, poly: Poly, bands: Band[]) => {
  const cached = wallCutCache.get(L);
  if (cached) return cached;
  const hasPathRivers = L.rivers.some(isPathRiver);
  const cuts = polyEdges(poly).map((edge) => {
    const bandDry = subtractBands(edge.a, edge.b, bands);
    const dry = hasPathRivers ? bandDry.flatMap(([p, q]) => subtractPathRivers(L, p, q)) : bandDry;
    if (!hasPathRivers) return {dry, gaps: bandGaps(edge.a, edge.b, bands)};
    const angle = Math.atan2(edge.b[0] - edge.a[0], edge.b[1] - edge.a[1]);
    if (!dry.length) return {dry, gaps: [{p: edge.a, q: edge.b, angle}]};
    const gaps: WallCut['gaps'] = [];
    const same = (p: [number, number], q: [number, number]) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-5;
    if (!same(edge.a, dry[0][0])) gaps.push({p: edge.a, q: dry[0][0], angle});
    for (let i = 0; i < dry.length - 1; i++) if (!same(dry[i][1], dry[i + 1][0])) gaps.push({p: dry[i][1], q: dry[i + 1][0], angle});
    if (!same(dry[dry.length - 1][1], edge.b)) gaps.push({p: dry[dry.length - 1][1], q: edge.b, angle});
    return {dry, gaps};
  });
  wallCutCache.set(L, cuts);
  return cuts;
};

const Walls: React.FC<P> = ({c}) => {
  const {Y, dur} = useT(c);
  const {city, gates} = c.layout;
  const bands = riverBands(c.layout);
  const d = city.decay;
  const decay = d ? ramp(Y, d[0], d[1]) * (1 - ramp(Y, d[2], d[3])) : 0;
  const ruinStrength = city.ruinStrength ?? 0.4;
  const standing = 1 - ruinStrength * decay;
  const h = 1.3 * smooth(ramp(Y, city.wall[0], city.wall[1])) * standing;
  const gk = smooth(ramp(Y, city.gates[0], city.gates[1]));
  // Existing cities retain their approved gate animation pixel-for-pixel.
  // Cities opting into deeper ruin also lose the defensive gatehouse mass.
  const gateK = city.ruinStrength === undefined ? gk : gk * standing;
  const cren = useRef<THREE.InstancedMesh>(null);
  const roofGeo = useMemo(() => prism(2.2, 1.0, 3.0), []);
  const {hx, hz} = city;
  const poly = city.outline ? cityPoly(city) : null;
  const cuts = poly ? wallCuts(c.layout, poly, bands) : [];
  const NX = Math.round(hx * 3.4);
  const NZ = Math.round(hz * 3.4);
  // a real footprint spaces merlons evenly along its perimeter instead of
  // per-side, so angled walls get the same density as axis-aligned ones
  const total = poly ? Math.round(polyPerimeter(poly) * 1.7) : 2 * NX + 2 * NZ;
  useLayoutEffect(() => {
    updateInstances(cren.current, total, (i, o) => {
      let x: number;
      let z: number;
      if (poly) {
        [x, z] = polyPointAt(poly, (i + 0.5) / total);
      } else if (i < NX) [x, z] = [-hx + ((i + 0.5) * 2 * hx) / NX, -hz];
      else if (i < 2 * NX) [x, z] = [-hx + ((i - NX + 0.5) * 2 * hx) / NX, hz];
      else if (i < 2 * NX + NZ) [x, z] = [hx, -hz + ((i - 2 * NX + 0.5) * 2 * hz) / NZ];
      else [x, z] = [-hx, -hz + ((i - 2 * NX - NZ + 0.5) * 2 * hz) / NZ];
      o.position.set(x, h + 0.14, z);
      const inPathRiver = c.layout.rivers.some((r) => isPathRiver(r) && pointInRiver(c.layout, r, x, z, 0.35));
      return h > 0.3 && !inBands(x, z, bands) && !inPathRiver;
    });
  });
  const ground = ramp(Y, city.groundFrom, city.groundFrom + 1.5);
  if (h < 0.02 && ground <= 0) return null;
  const earth = Y > 1940 ? mix('#a39a72', '#a9a596', ramp(Y, 1940, 1990)) : '#a89c70';
  return (
    <>
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        {poly ? <shapeGeometry args={[polyShape(poly)]} /> : <planeGeometry args={[2 * hx, 2 * hz]} />}
        <meshStandardMaterial color={earth} transparent opacity={ground * 0.85} roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {h > 0.02 && (
        <>
          {(
            poly
              ? cuts.flatMap((cut) =>
                  cut.dry.map(([p, q]) => {
                    const dx = q[0] - p[0];
                    const dz = q[1] - p[1];
                    return [
                      (p[0] + q[0]) / 2,
                      (p[1] + q[1]) / 2,
                      Math.atan2(dx, dz),
                      Math.hypot(dx, dz) + 0.5,
                    ] as const;
                  }),
                )
              : ([
                  [hx, 0, 0, 2 * hz + 0.4],
                  [-hx, 0, 0, 2 * hz + 0.4],
                  [0, hz, Math.PI / 2, 2 * hx + 0.4],
                  [0, -hz, Math.PI / 2, 2 * hx + 0.4],
                ] as const)
          ).map(([x, z, r, l], i) => (
            <mesh key={i} position={[x, h / 2, z]} rotation-y={r} castShadow receiveShadow>
              <boxGeometry args={[0.55, h, l]} />
              <meshStandardMaterial color="#b0603e" roughness={0.95} />
            </mesh>
          ))}
          {[
            [hx, hz],
            [hx, -hz],
            [-hx, hz],
            [-hx, -hz],
          ].map(([x, z], i) => (
            <mesh key={`b${i}`} position={[x, (h * 1.25) / 2, z]} castShadow>
              <boxGeometry args={[1.7, h * 1.25, 1.7]} />
              <meshStandardMaterial color="#9c5236" roughness={0.95} />
            </mesh>
          ))}
          <instancedMesh ref={cren} args={[undefined, undefined, total]} castShadow>
            <boxGeometry args={[0.32, 0.28, 0.32]} />
            <meshStandardMaterial color="#c47652" roughness={0.95} />
          </instancedMesh>
          {gk > 0.02 &&
            poly &&
              cuts.flatMap((cut, ei) =>
                cut.gaps.map((g, gi) => {
                  const w = Math.hypot(g.q[0] - g.p[0], g.q[1] - g.p[1]);
                  const mid: [number, number] = [(g.p[0] + g.q[0]) / 2, (g.p[1] + g.q[1]) / 2];
                  return (
                    <group key={`wg${ei}-${gi}`} position={[mid[0], 0, mid[1]]} rotation-y={g.angle}>
                      {[-1, 1].map((sgn) => (
                        <mesh key={sgn} position={[0, h * 0.62, (sgn * w) / 2]} castShadow receiveShadow>
                          <boxGeometry args={[0.8, h * 1.25, 0.8]} />
                          <meshStandardMaterial color="#9c5236" roughness={0.95} />
                        </mesh>
                      ))}
                      <mesh position={[0, h * 1.32, 0]} castShadow>
                        <boxGeometry args={[0.6, 0.34, w]} />
                        <meshStandardMaterial color="#b0603e" roughness={0.95} />
                      </mesh>
                    </group>
                  );
                }),
              )}
            {gateK > 0.02 &&
              gates.map((g, i) => (
              <group key={`g${i}`} position={[g.x, 0, g.z]} rotation-y={g.rot}>
                <mesh position={[0, (h * 1.6 * gateK) / 2, 0]} castShadow>
                  <boxGeometry args={[1.1, h * 1.6 * gateK, g.width]} />
                  <meshStandardMaterial color="#a9583a" roughness={0.95} />
                </mesh>
                <mesh position={[0, h * 0.35 * gateK, 0]}>
                  <boxGeometry args={[1.14, h * 0.7 * gateK, g.width * 0.32]} />
                  <meshStandardMaterial color="#3b2016" roughness={1} />
                </mesh>
                {g.pavilion && (
                  <group position={[0, h * 1.6 * gateK, 0]} scale={[1, gateK, 1]}>
                    <mesh position={[0, 0.45, 0]} castShadow>
                      <boxGeometry args={[1.0, 0.9, g.width * 0.8]} />
                      <meshStandardMaterial color="#7a4a2c" roughness={0.9} />
                    </mesh>
                    <mesh geometry={roofGeo} position={[0, 0.9, 0]} scale={[0.75, 1, (g.width * 0.95) / 3]} castShadow>
                      <meshStandardMaterial color="#8a3a26" roughness={0.8} flatShading side={THREE.DoubleSide} />
                    </mesh>
                  </group>
                )}
              </group>
            ))}
        </>
      )}
    </>
  );
};

/** A plain concrete road bridge wherever the ring road or a road crosses a river with no
 *  bridge of its own. Without it the road sank under the water at both banks and the
 *  cars drove straight across the river (Nakhon Sawan's ring road crossed the confluence). */
const RoadBridges: React.FC<P> = ({c}) => {
  const {Y} = useT(c);
  const L = c.layout;
  return (
    <>
      {driveSegments(L, Y).flatMap((s, si) =>
        roadCrossings(L, s).map((x, i) => (
          <group key={`${si}-${i}`} position={[x.x, 0, x.z]} rotation-y={-x.ang} scale={[1, s.k, 1]}>
            <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[x.len, 0.08, s.width + 0.3]} />
              <meshStandardMaterial color="#9c9d9f" roughness={0.9} />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh key={side} position={[0, 0.22, side * (s.width / 2 + 0.12)]} castShadow>
                <boxGeometry args={[x.len, 0.16, 0.08]} />
                <meshStandardMaterial color="#d8d6d0" roughness={0.8} />
              </mesh>
            ))}
          </group>
        )),
      )}
    </>
  );
};

/** Where the railway crosses a river: position along the rail, bridge length, river width. */
const railCrossings = (L: CityLayout) => {
  const {rail} = L;
  if (!rail) return [];
  const [start, end] = railSpan(L);
  const a: [number, number] = rail.axis === 'z' ? [rail.pos, start] : [start, rail.pos];
  const b: [number, number] = rail.axis === 'z' ? [rail.pos, end] : [end, rail.pos];
  const railAngle = rail.axis === 'z' ? Math.PI / 2 : 0;
  return L.rivers.flatMap((river) => {
    if (isPathRiver(river)) {
      return riverCrossings(L, river, a, b).flatMap((hit) => {
        const sinA = Math.abs(Math.sin(railAngle - hit.angle));
        if (sinA < 1e-3) return [];
        return [{
          a: rail.axis === 'z' ? hit.z : hit.x,
          x: hit.x,
          z: hit.z,
          len: river.width / Math.max(sinA, 0.3) + 1.6,
          width: river.width,
        }];
      });
    }
    if (river.axis === rail.axis) return [];
    const [s0, s1] = riverSpan(L, river);
    if (rail.pos < s0 - river.width || rail.pos > s1 + river.width) return [];
    return [{
      a: river.pos,
      x: rail.axis === 'z' ? rail.pos : river.pos,
      z: rail.axis === 'z' ? river.pos : rail.pos,
      len: river.width + 1.6,
      width: river.width,
    }];
  });
};

const RailBridges: React.FC<P> = ({c}) => {
  const {Y} = useT(c);
  const L = c.layout;
  const {rail} = L;
  if (!rail) return null;
  const railK = ramp(Y, rail.open[0], rail.open[1]);
  if (railK <= 0) return null;
  const [start, end] = railSpan(L);
  const reach = start + (end - start) * railK;
  const girder = '#2f3439';
  return (
    <>
      {railCrossings(L).map(({a, x, z, len, width}, i) => {
        const k = Math.max(0, Math.min(1, (reach - (a - len / 2)) / 1.5));
        if (k <= 0) return null;
        const n = Math.floor(len / 1.2) + 1;
        return (
          <group key={i} position={[x, 0, z]} rotation-y={rail.axis === 'z' ? 0 : Math.PI / 2} scale={[1, 1, k]}>
            <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.7, 0.08, len]} />
              <meshStandardMaterial color="#4a4f55" roughness={0.8} />
            </mesh>
            {[-0.82, 0.82].map((x) => (
              <React.Fragment key={x}>
                <mesh position={[x, 0.15 + 0.275, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.12, 0.55, len]} />
                  <meshStandardMaterial color={girder} roughness={0.6} metalness={0.4} />
                </mesh>
                {Array.from({length: n}, (_, j) => (
                  <mesh key={j} position={[x, 0.15 + 0.275, (j - (n - 1) / 2) * 1.2]} castShadow receiveShadow>
                    <boxGeometry args={[0.14, 0.55, 0.14]} />
                    <meshStandardMaterial color={girder} roughness={0.6} metalness={0.4} />
                  </mesh>
                ))}
              </React.Fragment>
            ))}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[0, -0.1, s * (width / 2 + 0.35)]} castShadow receiveShadow>
                <boxGeometry args={[2.2, 0.5, 0.9]} />
                <meshStandardMaterial color="#9b8f7a" roughness={0.95} />
              </mesh>
            ))}
          </group>
        );
      })}
    </>
  );
};

const Infrastructure: React.FC<P> = ({c, w}) => {
  const {Y, t, dur} = useT(c);
  const {night} = lighting(t, dur);
  const L = c.layout;
  const {rail, tile} = L;
  const sleepers = useRef<THREE.InstancedMesh>(null);
  const railK = rail ? ramp(Y, rail.open[0], rail.open[1]) : 0;
  const span = rail ? railSpan(L) : [0, 0];
  const railLen = span[1] - span[0];
  const station = rail ? ramp(Y, rail.stationYear, rail.stationYear + 2) : 0;
  const roofGeo = useMemo(() => prism(2.6, 0.9, 4.6), []);
  const ring = ramp(Y, L.ringRoadYear, L.ringRoadYear + 8);
  const [rx, rz] = RING(L);
  useLayoutEffect(() => {
    if (!rail) return;
    updateInstances(sleepers.current, 140, (i, o) => {
      const a = span[0] + 1 + i * 1.6;
      o.position.set(...along(L, rail.axis, a, rail.pos, 0.06));
      o.rotation.y = rail.axis === 'z' ? 0 : Math.PI / 2;
      const over = railCrossings(L).some((x) => Math.abs(a - x.a) < x.len / 2);
      return !over && a < span[0] + railLen * railK && a < span[1] - 0.5;
    });
  });
  const roadMat = <meshStandardMaterial color="#55585e" roughness={0.9} />;
  return (
    <>
      {L.bridges.map((b, i) => {
        const k = ramp(Y, b.year, b.year + 3);
        if (k <= 0) return null;
        const river = L.rivers[b.river ?? 0];
        let position: [number, number, number];
        let rot: number;
        if (isPathRiver(river)) {
          const p = riverPointAt(L, river, b.at);
          position = [p.x, 0, p.z];
          rot = -(p.angle + Math.PI / 2);
        } else {
          position = along(L, river.axis, b.at, river.pos, 0);
          rot = river.axis === 'z' ? 0 : Math.PI / 2;
        }
        return (
          <group key={i} position={position} rotation-y={rot} scale={[k, 1, 1]}>
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[river.width + 1.4, 0.2, 1.5]} />
              <meshStandardMaterial color={Y > b.modernYear ? '#b3b4b5' : '#7a5636'} roughness={0.9} />
            </mesh>
          </group>
        );
      })}
      {rail && railK > 0 && (
        <>
          {[-0.35, 0.35].map((dx) => (
            <mesh key={dx} position={along(L, rail.axis, span[0] + (railLen * railK) / 2, rail.pos + dx, 0.12)} rotation-y={rail.axis === 'z' ? 0 : Math.PI / 2}>
              <boxGeometry args={[0.08, 0.08, railLen * railK]} />
              <meshStandardMaterial color="#8b8f96" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
          <instancedMesh ref={sleepers} args={[undefined, undefined, 140]} receiveShadow>
            <boxGeometry args={[1.3, 0.06, 0.3]} />
            <meshStandardMaterial color="#5a4632" />
          </instancedMesh>
        </>
      )}
      {rail && station > 0.02 && (
        <group position={stationPos(rail)} rotation-y={rail.axis === 'z' ? 0 : Math.PI / 2} scale={[1, station, 1]}>
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 1.6, 4.4]} />
            <meshStandardMaterial color="#ece4d0" emissive="#ffcf7a" emissiveIntensity={night * 0.25} />
          </mesh>
          <mesh geometry={roofGeo} position={[0, 1.6, 0]} castShadow>
            <meshStandardMaterial color="#a4442c" flatShading side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
      {ring > 0 && (
        <group>
          {(
            [
              [rx, 0, 1.2, 2 * rz + 1.2],
              [-rx, 0, 1.2, 2 * rz + 1.2],
              [0, rz, 2 * rx + 1.2, 1.2],
              [0, -rz, 2 * rx + 1.2, 1.2],
            ] as const
          ).map(([x, z, ww, dd], i) => (
            <mesh key={i} position={[x, 0.05, z]} receiveShadow>
              <boxGeometry args={[ww, 0.04 * ring, dd]} />
              {roadMat}
            </mesh>
          ))}
        </group>
      )}
      {L.roads.map((r, i) => {
        const k = ramp(Y, r.year - 3, r.year);
        if (k <= 0) return null;
        const [ax, az] = r.from;
        const [bx, bz] = r.to;
        const len = Math.hypot(bx - ax, bz - az) * k;
        const ang = Math.atan2(bz - az, bx - ax);
        return (
          <group key={`rd${i}`} position={[ax + Math.cos(ang) * (len / 2), 0.06, az + Math.sin(ang) * (len / 2)]} rotation-y={-ang}>
            <mesh receiveShadow>
              <boxGeometry args={[len, 0.05, r.width]} />
              {roadMat}
            </mesh>
            {r.width > 1.6 && (
              <mesh position={[0, 0.04, 0]}>
                <boxGeometry args={[len, 0.02, 0.08]} />
                <meshStandardMaterial color="#e8e2c8" />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
};

const Train: React.FC<P & {i: number}> = ({c, i}) => {
  const {t, dur} = useT(c);
  const L = c.layout;
  const tr = L.trains[i];
  const rail = L.rail;
  if (!rail || t < tr.t0 || t > tr.t0 + tr.dur + (tr.park ?? 0)) return null;
  const span = railSpan(L);
  const p = Math.min(1, (t - tr.t0) / tr.dur);
  // a line with a terminus (rail.span) ends at its station: trains pull in and stop there
  // or start from there, instead of running on past it
  const st = rail.axis === 'z' ? rail.station[1] : rail.station[0];
  const termLo = !!rail.span && Math.abs(st - span[0]) < Math.abs(st - span[1]);
  const termHi = !!rail.span && !termLo;
  const lo = termLo ? span[0] + 3 : span[0] - 14;
  const hi = termHi ? span[1] - 3 : span[1] + 6;
  const arrive = tr.dir > 0 ? termLo : termHi;
  const leave = tr.dir > 0 ? termHi : termLo;
  const ease = (u: number) => (arrive ? 1 - (1 - u) ** 2 : leave ? u * u : u);
  const a = tr.dir > 0 ? lerp(hi, lo, ease(p)) : lerp(lo, hi, ease(p));
  const head = -tr.dir;
  const body = tr.modern ? '#2f5aa8' : '#202024';
  const car = tr.modern ? '#e8ecef' : '#7a3b2a';
  const visible = a < span[1] && a > span[0] + 2;
  return (
    <group position={along(L, rail.axis, a, rail.pos, 0)} rotation-y={rail.axis === 'z' ? 0 : Math.PI / 2} visible={visible}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.9, 0.9, 2.2]} />
        <meshStandardMaterial color={body} roughness={0.6} />
      </mesh>
      {!tr.modern &&
        new Array(7).fill(0).map((_, k) => (
          <mesh key={k} position={[0.2 * Math.sin(k + t * 3), 1.6 + k * 0.35, head * 0.7 - head * k * 0.8]}>
            <icosahedronGeometry args={[0.3 + k * 0.12, 0]} />
            <meshStandardMaterial color="#efeeea" transparent opacity={0.85 - k * 0.11} flatShading />
          </mesh>
        ))}
      {[1, 2, 3, 4].map((k) => (
        <mesh key={k} position={[0, 0.55, -head * k * 2.35]} castShadow>
          <boxGeometry args={[0.85, 0.8, 2.1]} />
          <meshStandardMaterial color={car} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const Cars: React.FC<P> = ({c}) => {
  const {Y, frame} = useT(c);
  const ref = useRef<THREE.InstancedMesh>(null);
  const L = c.layout;
  // Cars drive only on roads that exist this year: the ring road (once built) and
  // every built road, back and forth, and cross water only on a bridge deck.
  const segs = driveSegments(L, Y).filter((s) => s.k > 0.99);
  const dk = decks(L, Y);
  useLayoutEffect(() => {
    updateInstances(ref.current, MAX_CARS, (i, o) => {
      const car = carAt(L, Y, frame, i, segs, dk);
      if (!car || car.wet) return false;
      o.position.set(car.x, car.y, car.z);
      o.rotation.y = -car.ang + Math.PI / 2;
      return true;
    });
  });
  useLayoutEffect(() => {
    for (let i = 0; i < MAX_CARS; i++) {
      col.set(i % 3 === 0 ? '#c8202f' : ['#f2f2f2', '#2b2f3a', '#9aa4ad', '#e0b83a'][i % 4]);
      ref.current?.setColorAt(i, col);
    }
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, MAX_CARS]} castShadow>
      <boxGeometry args={[0.38, 0.32, 0.75]} />
      <meshStandardMaterial roughness={0.5} />
    </instancedMesh>
  );
};

const Boats: React.FC<P> = ({c, w}) => {
  const {Y, t, dur} = useT(c);
  const L = c.layout;
  const k = ramp(Y, L.boats[0], L.boats[0] + 100) * (1 - ramp(Y, L.boats[1], L.boats[1] + 20));
  if (k <= 0.02) return null;
  const R = L.rivers[0];
  const span = isPathRiver(R) ? null : riverSpan(L, R);
  const len = isPathRiver(R) ? riverLength(L, R) : span![1] - span![0];
  return (
    <>
      {w.boats.map((b, i) => {
        const a = (span?.[0] ?? 0) + 2 + ((((b.at + t * b.sp * 4) % (len - 4)) + len - 4) % (len - 4));
        if (isPathRiver(R)) {
          const p = riverPointAt(L, R, a, b.off);
          return (
            <mesh key={i} position={[p.x, 0.15, p.z]} rotation-y={Math.PI / 2 - p.angle} scale={k} castShadow>
              <boxGeometry args={[0.45, 0.2, 1.6]} />
              <meshStandardMaterial color="#6a4a2e" />
            </mesh>
          );
        }
        return (
          <mesh key={i} position={along(L, R.axis, a, R.pos + b.off, 0.15)} rotation-y={R.axis === 'z' ? 0 : Math.PI / 2} scale={k} castShadow>
            <boxGeometry args={[0.45, 0.2, 1.6]} />
            <meshStandardMaterial color="#6a4a2e" />
          </mesh>
        );
      })}
    </>
  );
};

const Plane: React.FC<P> = ({c}) => {
  const {t, frame, dur} = useT(c);
  const pl = c.layout.plane;
  if (!pl || t < pl[0] || t > pl[1]) return null;
  const p = (t - pl[0]) / (pl[1] - pl[0]);
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

const LANTERNS = new Array(220).fill(0).map((_, i) => ({
  t0: 55.0 + random(`lt${i}`) * 4.8,
  x: (random(`lx${i}`) - 0.5) * 30,
  z: (random(`lz${i}`) - 0.5) * 22,
  speed: 2.2 + random(`lv${i}`) * 2.2,
  wob: random(`lw${i}`) * Math.PI * 2,
}));
const FIREWORK_COLORS = ['#ffd27a', '#ff5a6e', '#7ad7ff', '#b6ff7a', '#ff9af0', '#ffffff'];
const BURSTS = new Array(16).fill(0).map((_, i) => ({
  t0: 55.4 + i * 0.28 + random(`fwt${i}`) * 0.2,
  x: (random(`fwx${i}`) - 0.5) * 28,
  y: 16 + random(`fwy${i}`) * 10,
  z: (random(`fwz${i}`) - 0.5) * 18,
  color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
}));
const SPARKS = 44;
const SPARK_DIRS = new Array(SPARKS).fill(0).map((_, j) => {
  const u = random(`su${j}`) * 2 - 1;
  const a = random(`sa${j}`) * Math.PI * 2;
  const r = Math.sqrt(1 - u * u);
  return [r * Math.cos(a), u, r * Math.sin(a)];
});

/** One additive point cloud whose positions/colors are rewritten every frame. */
const GlowPoints: React.FC<{n: number; tex: THREE.Texture; size: number; fill: (a: THREE.BufferAttribute, cl: THREE.BufferAttribute) => void}> = ({
  n,
  tex,
  size,
  fill,
}) => {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    return g;
  }, [n]);
  useLayoutEffect(() => {
    const a = geo.attributes.position as THREE.BufferAttribute;
    const cl = geo.attributes.color as THREE.BufferAttribute;
    fill(a, cl);
    a.needsUpdate = true;
    cl.needsUpdate = true;
  });
  return (
    <points geometry={geo}>
      <pointsMaterial map={tex} vertexColors size={size} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

const KRATHONGS = new Array(180).fill(0).map((_, i) => ({s: random(`ks${i}`), sp: 0.002 + random(`kv${i}`) * 0.004, side: random(`kd${i}`) - 0.5, t0: random(`kt${i}`) * 3}));

const Finale: React.FC<P> = ({c}) => {
  const {t: tAbs, dur} = useT(c);
  const t = tAbs - (dur - 60); // lantern/firework schedules are authored for a 60 s clip
  const lantern = useMemo(() => glowTexture('rgba(255,236,190,1)', 'rgba(255,150,50,0.55)'), []);
  const spark = useMemo(() => glowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0.5)'), []);
  const {dir, vis, elev} = sunState(tAbs, dur);
  const mode = c.layout.finale;
  const loy = mode === 'loykrathong';
  const tl = t + (loy ? 6 : 0); // Loy Krathong: lanterns start earlier
  const {city} = c.layout;
  // krathongs drift around the moat ring (and any extra ponds)
  const ponds = c.layout.krathongPonds ?? [];
  const krathongStart = dur - 12;
  return (
    <>
      {(mode === 'lanterns' || loy) && tl > 54.9 && (
        <GlowPoints
          n={LANTERNS.length}
          tex={lantern}
          size={3.4}
          fill={(a, cl) =>
            LANTERNS.forEach((l, i) => {
              const age = tl - l.t0;
              if (age < 0) a.setXYZ(i, 0, -80, 0);
              else a.setXYZ(i, l.x + Math.sin(age * 1.4 + l.wob) * 0.8 + age * 0.6, 0.8 + age * l.speed, l.z - age * 0.4);
              cl.setXYZ(i, 1, 0.85, 0.6);
            })
          }
        />
      )}
      {(mode === 'fireworks' || loy) && t > 54.9 && (
        <GlowPoints
          n={BURSTS.length * SPARKS}
          tex={spark}
          size={4.2}
          fill={(a, cl) =>
            BURSTS.forEach((b, i) => {
              const age = t - b.t0;
              col.set(b.color);
              for (let j = 0; j < SPARKS; j++) {
                const idx = i * SPARKS + j;
                if (age < 0 || age > 2.2 || (loy && i % 2)) {
                  a.setXYZ(idx, 0, -80, 0);
                  continue;
                }
                const r = 11 * (1 - Math.exp(-age * 3));
                const [dx, dy, dz] = SPARK_DIRS[j];
                a.setXYZ(idx, b.x + dx * r, b.y + dy * r - age * age * 1.6, b.z + dz * r);
                const f = Math.max(0, 1 - age / 2.2);
                cl.setXYZ(idx, col.r * f, col.g * f, col.b * f);
              }
            })
          }
        />
      )}
      {loy && tAbs > krathongStart && (
        <GlowPoints
          n={KRATHONGS.length}
          tex={lantern}
          size={1.5}
          fill={(a, cl) => {
            const mx = city.hx + 1.4;
            const mz = city.hz + 1.4;
            const per = 4 * mx + 4 * mz;
            KRATHONGS.forEach((k, i) => {
              const on = Math.min(1, Math.max(0, (tAbs - krathongStart - k.t0) / 1.2));
              const pond = ponds.length && i % 3 === 0 ? ponds[i % ponds.length] : null;
              let x: number;
              let z: number;
              if (pond) {
                const ang = k.s * Math.PI * 2 + tAbs * k.sp * 20;
                x = pond[0] + Math.cos(ang) * pond[2] * (0.3 + 0.6 * Math.abs(k.side) * 2);
                z = pond[1] + Math.sin(ang) * pond[2] * (0.3 + 0.6 * Math.abs(k.side) * 2);
              } else {
                const u = (((k.s + tAbs * k.sp) % 1) + 1) % 1 * per;
                const o = k.side * 0.9;
                if (u < 2 * mx) [x, z] = [-mx + u, -mz + o];
                else if (u < 2 * mx + 2 * mz) [x, z] = [mx + o, -mz + (u - 2 * mx)];
                else if (u < 4 * mx + 2 * mz) [x, z] = [mx - (u - 2 * mx - 2 * mz), mz + o];
                else [x, z] = [-mx + o, mz - (u - 4 * mx - 2 * mz)];
              }
              a.setXYZ(i, x, on > 0 ? 0.18 : -80, z);
              const fl = 0.8 + 0.2 * Math.sin(tAbs * 9 + i);
              cl.setXYZ(i, on * fl, on * 0.75 * fl, on * 0.35 * fl);
            });
          }}
        />
      )}
      {vis > 0 && elev > -0.05 && (
        <sprite position={[dir.x * 420, dir.y * 420, dir.z * 420]} scale={[150, 150, 1]}>
          <spriteMaterial map={lantern} color={mix('#fff6dc', '#ff9a4a', 1 - Math.min(1, elev * 2))} transparent depthWrite={false} fog={false} blending={THREE.AdditiveBlending} />
        </sprite>
      )}
    </>
  );
};

const LandmarkLayer: React.FC<P> = ({c, w}) => {
  const {Y, t, frame, dur} = useT(c);
  const {night} = lighting(t, dur);
  const Landmarks = c.Landmarks;
  const beat = (id: string) => c.story.beat?.(id, t) ?? 0;
  return <Landmarks Y={Y} t={t} frame={frame} night={night} terrainH={w.terrainH} beat={beat} />;
};

export const Diorama: React.FC<{c: CityConfig}> = ({c}) => {
  const w = getWorld(c.layout);
  const p = {c, w};
  return (
    <>
      <CameraRig {...p} />
      <Lights {...p} />
      <Ground {...p} />
      <Paddies {...p} />
      <Water {...p} />
      <Trees {...p} />
      <Houses {...p} />
      <Village {...p} />
      <Buildings {...p} />
      <Walls {...p} />
      <LandmarkLayer {...p} />
      <LifeLayer c={c} />
      <Infrastructure {...p} />
      <RailBridges {...p} />
      {c.layout.trains.map((_, i) => (
        <Train key={i} {...p} i={i} />
      ))}
      <RoadBridges {...p} />
      <Cars {...p} />
      <Boats {...p} />
      <Plane {...p} />
      <Finale {...p} />
      <FrameSync />
    </>
  );
};
