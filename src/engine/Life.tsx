import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {random, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {FPS, lerp, ramp} from '../lib';
import {Elephant, col, prism, updateInstances} from './parts';
import {inRiver as pointInRiver, isPathRiver, riverLength, riverPointAt} from './river';
import type {CityConfig, CityLayout} from './types';

type Life = NonNullable<CityLayout['life']>;
const vis = (Y: number, from: number, to: number) => ramp(Y, from, from + 5) * (1 - ramp(Y, to, to + 5));
const PEOPLE_COLORS = ['#e9e2d0', '#3f5f8f', '#a8322a', '#2f6a4a', '#d9a43a', '#6a4a8a', '#c86a3a'];

/** On or right at the edge of open water: nothing on foot belongs there. */
const wet = (L: CityLayout, x: number, z: number, margin = 0.35) =>
  L.rivers.some((r) => pointInRiver(L, r, x, z, margin, r.width / 2));

type Walker = {x: number; z: number; ang: number; len: number; sp: number; ph: number; color: string; from: number; to: number};

// A crowd disc that overlaps a river used to put people walking on the water
// (Nakhon Sawan's riverfront shrine and market). Walkers standing in the water are
// dropped; a walker whose stroll would reach the water walks a shorter line.
const buildWalkers = (L: Life, layout: CityLayout) => {
  const out: Walker[] = [];
  (L.people ?? []).forEach((g, gi) => {
    for (let i = 0; i < g.count; i++) {
      const a = random(`pa${gi}-${i}`) * Math.PI * 2;
      const r = Math.sqrt(random(`pr${gi}-${i}`)) * g.r;
      const palette = g.monks ? ['#e08a2a', '#d9781f'] : g.colors ?? PEOPLE_COLORS;
      const wx = g.x + Math.cos(a) * r;
      const wz = g.z + Math.sin(a) * r;
      if (!g.monks && wet(layout, wx, wz)) continue;
      out.push({
        x: g.x + Math.cos(a) * r,
        z: g.z + Math.sin(a) * r,
        ang: random(`pd${gi}-${i}`) * Math.PI * 2,
        len: g.monks ? 0 : 0.6 + random(`pl${gi}-${i}`) * 2.2,
        sp: 0.6 + random(`ps${gi}-${i}`) * 0.8,
        ph: random(`pp${gi}-${i}`) * Math.PI * 2,
        color: palette[Math.floor(random(`pc${gi}-${i}`) * palette.length)],
        from: g.from,
        to: g.to,
      });
    }
    if (g.monks) {
      // monks walk in a single file line
      const base = out.length - g.count;
      for (let i = 0; i < g.count; i++) {
        out[base + i].x = g.x - g.r + (i * 2 * g.r) / g.count;
        out[base + i].z = g.z;
        out[base + i].ang = 0;
        out[base + i].len = -1;
      }
    }
  });
  for (const w of out) {
    if (w.len <= 0) continue;
    const end = (s: number): [number, number] => [w.x + Math.cos(w.ang) * s, w.z + Math.sin(w.ang) * s];
    while (w.len > 0.1 && (wet(layout, ...end(w.len)) || wet(layout, ...end(-w.len)))) w.len *= 0.5;
    if (w.len <= 0.1) w.len = 0;
  }
  // a procession that would file across water does not walk
  return out.filter((w) => w.len >= 0 || !(wet(layout, w.x, w.z) || wet(layout, w.x + 4, w.z)));
};

const People: React.FC<{c: CityConfig; Y: number; t: number}> = ({c, Y, t}) => {
  const W = useMemo(() => buildWalkers(c.layout.life ?? {}, c.layout), [c]);
  const body = useRef<THREE.InstancedMesh>(null);
  const head = useRef<THREE.InstancedMesh>(null);
  const pos = (w: Walker): [number, number] => {
    if (w.len < 0) return [w.x + ((t * 0.5) % 4), w.z]; // procession
    const s = Math.sin(t * w.sp * 0.6 + w.ph) * w.len;
    return [w.x + Math.cos(w.ang) * s, w.z + Math.sin(w.ang) * s];
  };
  useLayoutEffect(() => {
    updateInstances(body.current, W.length, (i, o) => {
      const w = W[i];
      const k = vis(Y, w.from, w.to);
      const [x, z] = pos(w);
      o.position.set(x, 0.32 * k + Math.abs(Math.sin(t * 8 * w.sp + w.ph)) * 0.04, z);
      o.scale.set(k, k, k);
      return k > 0.02;
    });
    updateInstances(head.current, W.length, (i, o) => {
      const w = W[i];
      const k = vis(Y, w.from, w.to);
      const [x, z] = pos(w);
      o.position.set(x, 0.72 * k + Math.abs(Math.sin(t * 8 * w.sp + w.ph)) * 0.04, z);
      o.scale.set(k, k, k);
      return k > 0.02;
    });
  });
  useLayoutEffect(() => {
    W.forEach((w, i) => {
      col.set(w.color);
      body.current?.setColorAt(i, col);
      col.set(w.color === '#e08a2a' || w.color === '#d9781f' ? '#c9a07a' : '#8a5a3a');
      head.current?.setColorAt(i, col);
    });
  }, [W]);
  if (!W.length) return null;
  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, W.length]} castShadow>
        <cylinderGeometry args={[0.1, 0.17, 0.62, 6]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={head} args={[undefined, undefined, W.length]} castShadow>
        <sphereGeometry args={[0.1, 6, 5]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
    </>
  );
};

const UMBRELLA = ['#c8202f', '#e0b83a', '#2f6aa8', '#f2f2ea', '#3f8f4a', '#e07a2a'];
const Stalls: React.FC<{c: CityConfig; Y: number}> = ({c, Y}) => {
  const S = useMemo(() => {
    const out: {x: number; z: number; rot: number; color: string; from: number; to: number}[] = [];
    (c.layout.life?.stalls ?? []).forEach((g, gi) => {
      for (let i = 0; i < g.count; i++) {
        const a = random(`sa${gi}-${i}`) * Math.PI * 2;
        const r = Math.sqrt(random(`sr${gi}-${i}`)) * g.r;
        if (wet(c.layout, g.x + Math.cos(a) * r, g.z + Math.sin(a) * r, 0.6)) continue;
        out.push({x: g.x + Math.cos(a) * r, z: g.z + Math.sin(a) * r, rot: random(`so${gi}-${i}`) * 3, color: UMBRELLA[i % UMBRELLA.length], from: g.from, to: g.to});
      }
    });
    return out;
  }, [c]);
  const table = useRef<THREE.InstancedMesh>(null);
  const umb = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    updateInstances(table.current, S.length, (i, o) => {
      const k = vis(Y, S[i].from, S[i].to);
      o.position.set(S[i].x, 0.2 * k, S[i].z);
      o.rotation.y = S[i].rot;
      o.scale.set(k, k, k);
      return k > 0.02;
    });
    updateInstances(umb.current, S.length, (i, o) => {
      const k = vis(Y, S[i].from, S[i].to);
      o.position.set(S[i].x, 1.05 * k, S[i].z);
      o.rotation.y = S[i].rot;
      o.scale.set(k, k, k);
      return k > 0.02;
    });
  });
  useLayoutEffect(() => {
    S.forEach((s, i) => {
      col.set(s.color);
      umb.current?.setColorAt(i, col);
    });
  }, [S]);
  if (!S.length) return null;
  return (
    <>
      <instancedMesh ref={table} args={[undefined, undefined, S.length]} castShadow>
        <boxGeometry args={[0.9, 0.4, 0.6]} />
        <meshStandardMaterial color="#8a6a45" />
      </instancedMesh>
      <instancedMesh ref={umb} args={[undefined, undefined, S.length]} castShadow>
        <coneGeometry args={[0.75, 0.35, 8]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
    </>
  );
};

const along = (axis: 'x' | 'z', a: number, crossPos: number, y: number): [number, number, number] =>
  axis === 'z' ? [crossPos, y, a] : [a, y, crossPos];

const Ship: React.FC<{tall: boolean}> = ({tall}) => (
  <group>
    <mesh position={[0, 0.25, 0]} castShadow>
      <boxGeometry args={[0.9, 0.5, 3.2]} />
      <meshStandardMaterial color={tall ? '#3a2a20' : '#6a3a22'} />
    </mesh>
    <mesh position={[0, 0.55, -1.2]} castShadow>
      <boxGeometry args={[0.85, 0.4, 0.8]} />
      <meshStandardMaterial color={tall ? '#4a3626' : '#7a4a2a'} />
    </mesh>
    {(tall ? [1, 0, -0.9] : [0.6, -0.5]).map((z, i) => (
      <group key={i} position={[0, 0.5, z]}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 2.4, 4]} />
          <meshStandardMaterial color="#3a2a20" />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[tall ? 1.2 : 0.05, tall ? 1.1 : 1.5, tall ? 0.05 : 1.1]} />
          <meshStandardMaterial color={tall ? '#f2ede0' : '#b8562e'} side={THREE.DoubleSide} />
        </mesh>
      </group>
    ))}
  </group>
);

const Ships: React.FC<{c: CityConfig; Y: number; t: number}> = ({c, Y, t}) => {
  const L = c.layout;
  return (
    <>
      {(L.life?.ships ?? []).map((g, gi) => {
        const k = vis(Y, g.from, g.to);
        if (k <= 0.02) return null;
        const r = L.rivers[g.river];
        if (isPathRiver(r)) {
          const len = riverLength(L, r);
          if (len <= 4) return null;
          return new Array(g.count).fill(0).map((_, i) => {
            const a = 2 + ((((random(`sh${gi}-${i}`) * len + t * (i % 2 ? 0.4 : -0.3)) % (len - 4)) + len - 4) % (len - 4));
            const off = (g.offset ?? 0) + (i % 2 ? 0.25 : -0.25) * r.width;
            const p = riverPointAt(L, r, a, off);
            return (
              <group key={`${gi}-${i}`} position={[p.x, 0.05, p.z]} rotation-y={Math.PI / 2 - p.angle} scale={k * 0.9}>
                <Ship tall={i % 3 === 1} />
              </group>
            );
          });
        }
        const span = r.span ?? (r.axis === 'z' ? [L.tile.z0, L.tile.z1] : [L.tile.x0, L.tile.x1]);
        const len = span[1] - span[0];
        return new Array(g.count).fill(0).map((_, i) => {
          const a = span[0] + 2 + ((((random(`sh${gi}-${i}`) * len + t * (i % 2 ? 0.4 : -0.3)) % (len - 4)) + len - 4) % (len - 4));
          const off = (g.offset ?? 0) + (i % 2 ? 0.25 : -0.25) * r.width;
          return (
            <group key={`${gi}-${i}`} position={along(r.axis, a, r.pos + off, 0.05)} rotation-y={r.axis === 'z' ? 0 : Math.PI / 2} scale={k * 0.9}>
              <Ship tall={i % 3 === 1} />
            </group>
          );
        });
      })}
    </>
  );
};

const Houseboats: React.FC<{c: CityConfig; Y: number; t: number}> = ({c, Y, t}) => {
  const L = c.layout;
  const roof = useMemo(() => prism(1.2, 0.6, 1.8), []);
  return (
    <>
      {(L.life?.houseboats ?? []).map((g, gi) => {
        const k = vis(Y, g.from, g.to);
        if (k <= 0.02) return null;
        const r = L.rivers[g.river];
        if (isPathRiver(r)) {
          const len = riverLength(L, r);
          if (len <= 6) return null;
          return new Array(g.count).fill(0).map((_, i) => {
            const a = lerp(3, len - 3, (i + random(`hb${gi}-${i}`) * 0.5) / g.count);
            const side = i % 2 ? 1 : -1;
            const p = riverPointAt(L, r, a, side * (r.width / 2 - 0.7));
            return (
              <group key={`${gi}-${i}`} position={[p.x, 0.15 + Math.sin(t * 2 + i) * 0.03, p.z]} rotation-y={Math.PI / 2 - p.angle} scale={k}>
                <mesh position={[0, 0.1, 0]}>
                  <boxGeometry args={[1.1, 0.2, 1.8]} />
                  <meshStandardMaterial color="#5a4632" />
                </mesh>
                <mesh position={[0, 0.45, 0]} castShadow>
                  <boxGeometry args={[0.9, 0.5, 1.5]} />
                  <meshStandardMaterial color="#9a6a45" />
                </mesh>
                <mesh geometry={roof} position={[0, 0.7, 0]} castShadow>
                  <meshStandardMaterial color="#5a3420" flatShading side={THREE.DoubleSide} />
                </mesh>
              </group>
            );
          });
        }
        const span = r.span ?? (r.axis === 'z' ? [L.tile.z0, L.tile.z1] : [L.tile.x0, L.tile.x1]);
        return new Array(g.count).fill(0).map((_, i) => {
          const a = lerp(span[0] + 3, span[1] - 3, (i + random(`hb${gi}-${i}`) * 0.5) / g.count);
          const side = i % 2 ? 1 : -1;
          return (
            <group key={`${gi}-${i}`} position={along(r.axis, a, r.pos + side * (r.width / 2 - 0.7), 0.15 + Math.sin(t * 2 + i) * 0.03)} rotation-y={r.axis === 'z' ? 0 : Math.PI / 2} scale={k}>
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[1.1, 0.2, 1.8]} />
                <meshStandardMaterial color="#5a4632" />
              </mesh>
              <mesh position={[0, 0.45, 0]} castShadow>
                <boxGeometry args={[0.9, 0.5, 1.5]} />
                <meshStandardMaterial color="#9a6a45" />
              </mesh>
              <mesh geometry={roof} position={[0, 0.7, 0]} castShadow>
                <meshStandardMaterial color="#5a3420" flatShading side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        });
      })}
    </>
  );
};

const Herds: React.FC<{c: CityConfig; Y: number; t: number}> = ({c, Y, t}) => {
  const L = c.layout.life ?? {};
  return (
    <>
      {(L.elephants ?? []).map((g, gi) => {
        const k = vis(Y, g.from, g.to);
        if (k <= 0.02) return null;
        return new Array(g.count).fill(0).map((_, i) => {
          const a = random(`el${gi}-${i}`) * Math.PI * 2 + t * 0.12;
          const x = g.x + Math.cos(a) * g.r;
          const z = g.z + Math.sin(a) * g.r;
          if (wet(c.layout, x, z, 0.8)) return null;
          return (
            <group key={`e${gi}-${i}`} position={[x, 0, z]} rotation-y={-a} scale={k * 0.8}>
              <Elephant step={Math.sin(t * 4 + i)} howdah={g.howdah} />
            </group>
          );
        });
      })}
      {(L.buffalo ?? []).map((g, gi) => {
        const k = vis(Y, g.from, g.to);
        if (k <= 0.02) return null;
        return new Array(g.count).fill(0).map((_, i) => {
          const a = random(`bu${gi}-${i}`) * Math.PI * 2;
          const r = Math.sqrt(random(`bur${gi}-${i}`)) * g.r;
          if (wet(c.layout, g.x + Math.cos(a) * r, g.z + Math.sin(a) * r, 0.8)) return null;
          return (
            <group key={`b${gi}-${i}`} position={[g.x + Math.cos(a) * r + Math.sin(t * 0.3 + i) * 0.4, 0, g.z + Math.sin(a) * r]} rotation-y={a} scale={k * 0.45}>
              <Elephant step={Math.sin(t * 3 + i)} color="#4a4644" />
            </group>
          );
        });
      })}
    </>
  );
};

export const LifeLayer: React.FC<{c: CityConfig}> = ({c}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const Y = c.story.yearAt(t);
  if (!c.layout.life) return null;
  return (
    <>
      <People c={c} Y={Y} t={t} />
      <Stalls c={c} Y={Y} />
      <Ships c={c} Y={Y} t={t} />
      <Houseboats c={c} Y={Y} t={t} />
      <Herds c={c} Y={Y} t={t} />
    </>
  );
};
