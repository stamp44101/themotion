import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {Elephant, lathe, SmallChedi, updateInstances, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp, smooth} from '../../lib';
import {
  ATTENDANTS, attendantAt, boltK, CALLBACK_ROT, CALLBACK_S, CARAVAN_N, caravanAt, CREW, elephantAt, HERO_AT, HERO_ROT, HERO_S, heroK, imageOn, lightShow, manAt, MEN, planeAt,
  procElephantAt, RING_R, ringK, roadHead, roadK, RUNWAY, splitK, templeK, THANALAI_X,
} from './actors';
import {CHOM_THONG, CHOM_THONG_H, GOLD_CLOCK, KLANG_WIANG, MONUMENT, NGAM_MUEANG, OLD_CLOCK, PHRA_KAEW, RONG_KHUN, THANALAI_Z} from './places';
import {WhiteTemple} from './WhiteTemple';

export {CHOM_THONG, GOLD_CLOCK, KLANG_WIANG, MONUMENT, NGAM_MUEANG, PHRA_KAEW, RONG_KHUN} from './places';

type TH = LandmarkProps['terrainH'];
const WHITE = '#f3efe6';
const GOLD = '#d9a62e';
const gold = <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.7} emissive="#7a5410" emissiveIntensity={0.25} />;

// ------------------------------------------------------------------ people
// a body and a head per person, with an optional umbrella; undyed cotton and indigo so the
// figures read as people against the ground
type Person = {x: number; z: number; rot: number; bob: number; robe: string; umbrella?: boolean; load?: boolean};
const ROBES = ['#efe6d0', '#f6f1e4', '#3c4f80', '#e8dcc0', '#efe6d0', '#41558a'];
const People: React.FC<{list: Person[]; max: number; terrainH: TH}> = ({list, max, terrainH}) => {
  const body = useRef<THREE.InstancedMesh>(null);
  const head = useRef<THREE.InstancedMesh>(null);
  const load = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => new THREE.Color(), []);
  useLayoutEffect(() => {
    const y = (p: Person) => terrainH(p.x, p.z) + p.bob;
    updateInstances(body.current, max, (i, o) => {
      const p = list[i];
      if (!p) return false;
      o.position.set(p.x, y(p) + 0.4, p.z);
      o.rotation.y = p.rot;
      return true;
    });
    list.forEach((p, i) => body.current?.setColorAt(i, tmp.set(p.robe)));
    if (body.current?.instanceColor) body.current.instanceColor.needsUpdate = true;
    updateInstances(head.current, max, (i, o) => {
      const p = list[i];
      if (!p) return false;
      o.position.set(p.x, y(p) + 0.94, p.z);
      return true;
    });
    updateInstances(load.current, max, (i, o) => {
      const p = list[i];
      if (!p || !p.load) return false;
      o.position.set(p.x, y(p) + 1.16, p.z);
      o.rotation.y = p.rot;
      return true;
    });
  });
  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, max]} castShadow>
        <cylinderGeometry args={[0.13, 0.21, 0.8, 6]} />
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={head} args={[undefined, undefined, max]} castShadow>
        <sphereGeometry args={[0.15, 6, 5]} />
        <meshStandardMaterial color="#c99a72" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={load} args={[undefined, undefined, max]} castShadow>
        <boxGeometry args={[0.36, 0.16, 0.26]} />
        <meshStandardMaterial color="#8a6a44" roughness={1} />
      </instancedMesh>
      {list.map((p, i) =>
        p.umbrella ? (
          <group key={`u${i}`} position={[p.x, terrainH(p.x, p.z) + p.bob, p.z]}>
            <mesh position={[0.18, 1.0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.6, 4]} />
              <meshStandardMaterial color="#6a4a22" />
            </mesh>
            <mesh position={[0.18, 1.85, 0]} castShadow>
              <coneGeometry args={[0.42, 0.3, 10]} />
              <meshStandardMaterial color="#e2b13c" metalness={0.4} roughness={0.4} />
            </mesh>
          </group>
        ) : null,
      )}
    </>
  );
};

// ------------------------------------------------------------------ 1262: the elephant and the rampart
const ElephantAt: React.FC<{x: number; z: number; rot: number; t: number; s?: number; howdah?: boolean; terrainH: TH; color?: string}> = ({x, z, rot, t, s = 1.3, howdah, terrainH, color = '#d9d3c7'}) => (
  <group position={[x, terrainH(x, z), z]} rotation-y={rot} scale={s}>
    <Elephant step={Math.sin(t * 5)} howdah={howdah} color={color} />
  </group>
);

// Mangrai's earth rampart round Doi Chom Thong, laid on the hillside
const RING_N = 56;
const Rampart: React.FC<{k: number; terrainH: TH}> = ({k, terrainH}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    updateInstances(ref.current, RING_N, (i, o) => {
      // built round the ring in order as k grows
      const a = (i / RING_N) * Math.PI * 2 + Math.PI / 2;
      const local = Math.min(1, Math.max(0, k * RING_N - i * 0.6) / 3);
      if (local < 0.05) return false;
      const x = CHOM_THONG[0] + Math.cos(a) * RING_R;
      const z = CHOM_THONG[1] + Math.sin(a) * RING_R;
      o.position.set(x, terrainH(x, z) + 0.18 * local, z);
      o.rotation.y = -a;
      o.scale.set(1, local, 1);
      return true;
    });
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, RING_N]} castShadow receiveShadow>
      <boxGeometry args={[0.6, 0.42, 0.42]} />
      <meshStandardMaterial color="#9a6b42" roughness={1} />
    </instancedMesh>
  );
};

// ------------------------------------------------------------------ 1434: วัดป่าเยี้ยะ's chedi splits
const BELL = lathe([[0, 0], [0.9, 0], [0.9, 0.3], [0.75, 0.35], [0.75, 0.6], [0.7, 0.95], [0.6, 1.3], [0.42, 1.6], [0.22, 1.72], [0.2, 2.0], [0.1, 2.2], [0.06, 2.9], [0, 3.1]], 16);
// half of the bell, for the split
const HALF = new THREE.LatheGeometry(
  [[0, 0], [0.9, 0], [0.9, 0.3], [0.75, 0.35], [0.75, 0.6], [0.7, 0.95], [0.6, 1.3], [0.42, 1.6], [0.22, 1.72], [0.2, 2.0], [0.1, 2.2], [0.06, 2.9], [0, 3.1]].map(([r, y]) => new THREE.Vector2(r, y)),
  10,
  0,
  Math.PI,
);
const PhraKaew: React.FC<{Y: number; t: number; ctx: {Y: number; beat: (id: string) => number}; terrainH: TH}> = ({Y, t, ctx, terrainH}) => {
  if (Y < 1300) return null;
  const y = terrainH(PHRA_KAEW[0], PHRA_KAEW[1]);
  const split = splitK(Y, ctx);
  const bolt = boltK(ctx);
  const img = imageOn(Y, ctx);
  const s = 0.75;
  return (
    <group position={[PHRA_KAEW[0], y, PHRA_KAEW[1]]}>
      {split > 0.02 ? (
        [-1, 1].map((sx) => (
          <group key={sx} position={[sx * split * 0.55, 0, 0]} rotation-z={-sx * split * 0.12} scale={s}>
            <mesh geometry={HALF} rotation-y={sx > 0 ? -Math.PI / 2 : Math.PI / 2} castShadow>
              <meshStandardMaterial color="#d9d2c2" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))
      ) : (
        <mesh geometry={BELL} scale={s} castShadow>
          <meshStandardMaterial color={Y >= 1436 ? WHITE : '#d9d2c2'} roughness={0.8} />
        </mesh>
      )}
      {img && (
        // the green image, self-lit so it reads through the storm
        <group position={[0, 0.3, 0]}>
          <mesh position={[0, 0.3, 0]} scale={[0.32, 0.28, 0.26]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial color="#2fd17a" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.62, 0]}>
            <sphereGeometry args={[0.12, 8, 6]} />
            <meshBasicMaterial color="#3fe08a" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <coneGeometry args={[0.06, 0.22, 6]} />
            <meshBasicMaterial color="#ffd36a" toneMapped={false} />
          </mesh>
        </group>
      )}
      {bolt > 0 && (
        // a jagged bolt from the cloud base to the spire
        <group>
          {[[0, 22, 0.6, 18], [0.6, 18, -0.4, 13], [-0.4, 13, 0.5, 8], [0.5, 8, -0.2, 4.4], [-0.2, 4.4, 0, 2.4]].map(([x0, y0, x1, y1], k) => (
            <mesh key={k} position={[(x0 + x1) / 2, (y0 + y1) / 2, 0]} rotation-z={Math.atan2(x1 - x0, y0 - y1)}>
              <boxGeometry args={[0.16 + 0.06 * Math.sin(t * 40 + k), Math.hypot(x1 - x0, y0 - y1), 0.16]} />
              <meshBasicMaterial color="#f4f7ff" toneMapped={false} />
            </mesh>
          ))}
        </group>
      )}
      {/* the viharn, later */}
      {Y >= 1440 && <Viharn pos={[0, 0, 2.0]} k={smooth(ramp(Y, 1440, 1460))} rot={0} scale={0.7} />}
    </group>
  );
};

// ------------------------------------------------------------------ 1895: the road crew
const Thanalai: React.FC<{Y: number; t: number; ctx: {Y: number; beat: (id: string) => number}; terrainH: TH}> = ({Y, t, ctx, terrainH}) => {
  const k = roadK(Y, ctx);
  // the engine lays the finished street in 1897
  if (k <= 0.01 || Y > 1897.5) return null;
  const head = roadHead(Y, ctx);
  const len = head - THANALAI_X[0];
  const crew: Person[] = [];
  if (k < 0.99)
    for (let i = 0; i < CREW; i++)
      crew.push({
        x: head - 0.2 - (i >> 1) * 0.55,
        z: THANALAI_Z + (i % 2 ? 0.55 : -0.55),
        rot: Math.PI / 2,
        bob: 0.08 * Math.max(0, Math.sin(t * 9 + i * 1.7)),
        robe: ROBES[i % ROBES.length],
        load: i % 3 === 0,
      });
  return (
    <>
      <mesh position={[THANALAI_X[0] + len / 2, terrainH(0, THANALAI_Z) + 0.05, THANALAI_Z]} receiveShadow>
        <boxGeometry args={[Math.max(0.01, len), 0.08, 0.9]} />
        <meshStandardMaterial color="#b58b5e" roughness={1} />
      </mesh>
      {crew.length > 0 && <People list={crew} max={CREW} terrainH={terrainH} />}
    </>
  );
};

// ------------------------------------------------------------------ 1923: the airfield and the biplane
const Biplane: React.FC = () => {
  const m = <meshStandardMaterial color="#c9c2a8" roughness={0.6} />;
  return (
    <group scale={2}>
      <mesh castShadow>
        <boxGeometry args={[0.32, 0.32, 2.0]} />
        {m}
      </mesh>
      {[0.28, -0.12].map((y) => (
        <mesh key={y} position={[0, y, 0.35]} castShadow>
          <boxGeometry args={[3.0, 0.05, 0.5]} />
          <meshStandardMaterial color="#b8322a" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, -0.9]} castShadow>
        <boxGeometry args={[1.0, 0.04, 0.35]} />
        {m}
      </mesh>
      <mesh position={[0, 0.3, -0.95]} castShadow>
        <boxGeometry args={[0.04, 0.4, 0.3]} />
        {m}
      </mesh>
      <mesh position={[0, 0, 1.03]}>
        <boxGeometry args={[0.9, 0.08, 0.03]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ the clock towers and the monument
// the old clock tower (2510), a plain white tower at the old crossroads
const OldClock: React.FC<{Y: number}> = ({Y}) => {
  if (Y < 1967) return null;
  return (
    <group position={[OLD_CLOCK[0], 0, OLD_CLOCK[1]]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.45, 1.8, 0.45]} />
        <meshStandardMaterial color={WHITE} roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.0, 0]} castShadow>
        <coneGeometry args={[0.38, 0.5, 4]} />
        <meshStandardMaterial color="#9a3a2a" />
      </mesh>
    </group>
  );
};
// หอนาฬิกาทอง (2551): a tall gilded tower of stacked, flaring tiers on a roundabout; its
// light show runs through the design beat
const GOLD_TIERS = lathe([[0, 0], [1.0, 0], [1.0, 0.25], [0.7, 0.35], [0.62, 1.2], [0.85, 1.35], [0.55, 1.55], [0.5, 2.3], [0.72, 2.45], [0.42, 2.65], [0.34, 3.2], [0.5, 3.3], [0.24, 3.55], [0.14, 4.3], [0.04, 4.8], [0, 4.9]], 12);
const GoldClock: React.FC<{Y: number; t: number; night: number; show: number}> = ({Y, t, night, show}) => {
  if (Y < 2004) return null;
  const k = smooth(ramp(Y, 2004, 2008));
  const hue = (t * 0.6) % 1;
  const glow = show > 0 ? 0.6 + 0.4 * Math.sin(t * 5) : night * 0.6;
  const col = show > 0 ? new THREE.Color().setHSL(hue, 0.85, 0.6) : new THREE.Color('#ffcf6a');
  return (
    <group position={[GOLD_CLOCK[0], 0, GOLD_CLOCK[1]]}>
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.12, 24]} />
        <meshStandardMaterial color="#7da35a" roughness={1} />
      </mesh>
      <mesh geometry={GOLD_TIERS} scale={[0.6, 0.6 * k, 0.6]} castShadow>
        {gold}
      </mesh>
      {k > 0.98 && (
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.5, 12]} />
          <meshBasicMaterial color={col} toneMapped={false} transparent opacity={0.25 + 0.6 * glow} />
        </mesh>
      )}
    </group>
  );
};
// อนุสาวรีย์พญามังราย (2507): a bronze king on a tall base at ห้าแยกพ่อขุน
const Monument: React.FC<{Y: number}> = ({Y}) => {
  if (Y < 1963) return null;
  const k = smooth(ramp(Y, 1963, 1964.2));
  return (
    <group position={[MONUMENT[0], 0, MONUMENT[1]]} scale={[1, k, 1]}>
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.12, 20]} />
        <meshStandardMaterial color="#7da35a" roughness={1} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.7]} />
        <meshStandardMaterial color="#d8d0c0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 0.6, 8]} />
        <meshStandardMaterial color="#5a4630" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.65, 0]} castShadow>
        <sphereGeometry args={[0.13, 8, 6]} />
        <meshStandardMaterial color="#5a4630" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <coneGeometry args={[0.07, 0.3, 6]} />
        <meshStandardMaterial color="#5a4630" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
};

export const ChiangRaiLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH, beat}) => {
  const ctx = {Y, beat};
  const hero = heroK(ctx);
  const ring = ringK(Y, ctx);
  const temple = templeK(Y, ctx);
  const plane = planeAt(ctx);
  const show = lightShow(Y, ctx);
  const ctY = terrainH(CHOM_THONG[0], CHOM_THONG[1]);

  const men: Person[] = [];
  for (let i = 0; i < MEN; i++) {
    const m = manAt(i, ctx);
    if (m) men.push({x: m.x + (i % 2 ? 0.25 : -0.25), z: m.z, rot: m.rot, bob: 0.05 * Math.abs(Math.sin(t * 7 + i)), robe: ROBES[i % ROBES.length], umbrella: i === 0})
  }
  const attendants: Person[] = [];
  for (let i = 0; i < ATTENDANTS; i++) {
    const a = attendantAt(i, ctx);
    if (a) attendants.push({x: a.x + (i % 2 ? 0.25 : -0.25), z: a.z, rot: a.rot, bob: 0.04 * Math.abs(Math.sin(t * 6 + i)), robe: i < 4 ? '#f1ece0' : ROBES[i % ROBES.length], umbrella: i === 1 || i === 3})
  }
  const walkers: Person[] = [];
  const carts: {x: number; z: number; rot: number}[] = [];
  const elephants: {x: number; z: number; rot: number}[] = [];
  for (let i = 0; i < CARAVAN_N; i++) {
    const c = caravanAt(i, ctx);
    if (!c) continue;
    if (c.kind === 'elephant') elephants.push(c);
    else if (c.kind === 'cart') carts.push(c);
    else walkers.push({x: c.x + (i % 2 ? 0.3 : -0.3), z: c.z, rot: c.rot, bob: 0.05 * Math.abs(Math.sin(t * 7 + i)), robe: ROBES[i % ROBES.length], load: i % 2 === 0});
  }
  const e1262 = elephantAt(ctx);
  const eProc = procElephantAt(ctx);

  return (
    <>
      {/* frame 0: วัดร่องขุ่น at hero scale over the whole tile; it folds into the ground before
          the first caption (owner) */}
      {hero > 0.02 && <WhiteTemple t={t} at={HERO_AT} s={HERO_S} rot={HERO_ROT} k={hero} />}

      {/* ดอยจอมทอง: the chedi on the summit, the rampart round the hill */}
      <SmallChedi pos={[CHOM_THONG[0], ctY, CHOM_THONG[1]]} scale={0.5} k={1} color={Y >= 1900 ? '#e8c46a' : WHITE} glow={night} />
      {ring > 0.02 && <Rampart k={ring} terrainH={terrainH} />}
      {/* ดอยงำเมือง: กู่พญามังราย */}
      {Y >= 1320 && <SmallChedi pos={[NGAM_MUEANG[0], terrainH(NGAM_MUEANG[0], NGAM_MUEANG[1]), NGAM_MUEANG[1]]} scale={0.32} k={smooth(ramp(Y, 1320, 1330))} color="#cdbfa6" />}
      <PhraKaew Y={Y} t={t} ctx={ctx} terrainH={terrainH} />
      {/* วัดกลางเวียง, the centre of the 2386 town */}
      {Y >= 1843 && (
        <>
          <Viharn pos={[KLANG_WIANG[0], 0, KLANG_WIANG[1] + 0.5]} k={smooth(ramp(Y, 1843, 1843.4))} rot={0} scale={0.6} />
          <SmallChedi pos={[KLANG_WIANG[0], 0, KLANG_WIANG[1] - 0.9]} scale={0.3} k={smooth(ramp(Y, 1843, 1843.4))} color={WHITE} />
        </>
      )}

      {e1262 && <ElephantAt x={e1262.x} z={e1262.z} rot={e1262.rot} t={t} terrainH={terrainH} />}
      {men.length > 0 && <People list={men} max={MEN} terrainH={terrainH} />}
      {eProc && <ElephantAt x={eProc.x} z={eProc.z} rot={eProc.rot} t={t} howdah terrainH={terrainH} />}
      {attendants.length > 0 && <People list={attendants} max={ATTENDANTS} terrainH={terrainH} />}
      {elephants.map((e, i) => (
        <ElephantAt key={`e${i}`} x={e.x} z={e.z} rot={e.rot} t={t + i} s={0.9} terrainH={terrainH} color="#7d7a76" />
      ))}
      {carts.map((c, i) => (
        <group key={`c${i}`} position={[c.x, terrainH(c.x, c.z), c.z]} rotation-y={c.rot}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.6, 0.3, 1.0]} />
            <meshStandardMaterial color="#8a6a44" roughness={1} />
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
      ))}
      {walkers.length > 0 && <People list={walkers} max={CARAVAN_N} terrainH={terrainH} />}

      <Thanalai Y={Y} t={t} ctx={ctx} terrainH={terrainH} />

      {/* สนามบินเก่า: a grass strip from 2466 */}
      {Y >= 1923 && (
        <mesh position={[RUNWAY.x, 0.04, (RUNWAY.z0 + RUNWAY.z1) / 2]} receiveShadow>
          <boxGeometry args={[RUNWAY.w, 0.06, RUNWAY.z1 - RUNWAY.z0]} />
          <meshStandardMaterial color={Y > 1960 ? '#9a9a92' : '#a7b678'} roughness={1} />
        </mesh>
      )}
      {plane && (
        <group position={[plane.x, plane.y, plane.z]} rotation={[plane.pitch, plane.rot, 0]}>
          <Biplane />
        </group>
      )}

      <OldClock Y={Y} />
      <GoldClock Y={Y} t={t} night={night} show={show} />
      <Monument Y={Y} />

      {/* the payoff: the temple rises at the tile's south-west edge, the cover's hands with it */}
      {temple > 0.02 && <WhiteTemple t={t} at={RONG_KHUN} s={CALLBACK_S} rot={CALLBACK_ROT} k={temple} handT={(beat('temple') - 0.3) * 4} />}
    </>
  );
};
