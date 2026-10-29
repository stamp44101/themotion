import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Elephant, glowTexture, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp} from '../../lib';
import {Cart, Walker} from '../nan/figures';
import {Hall} from '../phetchabun/figures';
import {
  beatK, clamp01, COLUMN, columnAt, campK, DRAGON_N, dragonAt, jarH, jarRise, lanternK, PAINT_END, paintK, PAY_S,
  planeAt, RUNWAY_L,
} from './actors';
import {Jar, RED} from './jar';
import {
  AIRFIELD, BAN_CHIANG, CAMP, CENTRAL, CLOCK, FIELD, HALL, LAKE_C, LAKE_PATH, MATCHIMA, MONUMENT, NONG_BUA, PHO_SI,
  PUYA, RACHINU, RUNWAY_ROT, UD_TOWN,
} from './places';

const WATER = '#3f8fc0';
const smooth01 = (x: number) => x * x * (3 - 2 * x);

// a growing mesh is gated on its own scale (CLAUDE.md: a mesh at scale 0 blacks out the shader look)
const Grow: React.FC<{k: number; children: React.ReactNode; at: [number, number, number]; rot?: number}> = ({k, children, at, rot = 0}) =>
  k > 0.02 ? (
    <group position={at} rotation-y={rot} scale={[1, Math.max(0.03, k), 1]}>
      {children}
    </group>
  ) : null;

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; e?: string}> = ({p, s, c, e}) => (
  <mesh position={p} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} emissive={e ?? '#000000'} emissiveIntensity={e ? 0.6 : 0} />
  </mesh>
);

// ------------------------------------------------------------------ the cover's jar and the dig
const HeroJar: React.FC<{t: number}> = ({t}) => {
  const H = jarH(t);
  const y = -H * (1 - jarRise(t));
  // a slow turn through the cover, then still (the marker at Ban Chiang)
  const spin = Math.min(t, 7) * 0.25;
  const ringU = clamp01((t - PAINT_END + 0.3) / 1.4);
  return (
    <group position={[BAN_CHIANG[0], 0, BAN_CHIANG[1]]}>
      {/* the excavation pit and the archaeologists round it (the 1967 dig) */}
      <mesh position={[0, 0.04, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[Math.max(4.4, H * 0.82), Math.max(4.4, H * 0.82)]} />
        <meshStandardMaterial color="#9c7650" roughness={1} />
      </mesh>
      <group position={[0, y, 0]} rotation-y={spin} scale={H}>
        <Jar k={paintK(t)} />
      </group>
      {ringU > 0 && ringU < 1 && (
        <mesh position={[0, 0.07, 0]} rotation-x={-Math.PI / 2} scale={H * 0.5 * (0.6 + ringU * 2.4)}>
          <ringGeometry args={[0.93, 1, 96]} />
          <meshBasicMaterial color={RED} transparent opacity={(1 - ringU) * 0.85} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the lake
const lakeShape = new THREE.Shape(LAKE_PATH.map(([x, z]) => new THREE.Vector2(x, -z)));
const Lake: React.FC<{Y: number}> = ({Y}) => {
  // the park: the island and its bridge (1987)
  const park = ramp(Y, 1986, 1988);
  return (
    <>
      <mesh position={[0, 0.06, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <shapeGeometry args={[lakeShape, 24]} />
        <meshStandardMaterial color={WATER} roughness={0.25} metalness={0.1} />
      </mesh>
      {park > 0.02 && (
        <group>
          <mesh position={[LAKE_C[0], 0.1, LAKE_C[1]]} rotation-x={-Math.PI / 2} scale={[1.5 * park, 2.2 * park, 1]} receiveShadow>
            <circleGeometry args={[1, 24]} />
            <meshStandardMaterial color="#7fa85a" roughness={1} />
          </mesh>
          <Box p={[LAKE_C[0] + 2.7, 0.16, LAKE_C[1]]} s={[3.2 * park, 0.08, 0.35]} c="#c9a774" />
        </group>
      )}
      {/* the yellow duck that floated on the lake in Nov 2013 */}
      {Y > 2013.8 && Y < 2014.2 && (
        <group position={[LAKE_C[0], 0.1, LAKE_C[1] + 3]} scale={0.9}>
          <mesh position={[0, 0.5, 0]} scale={[1, 0.7, 1.3]}>
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial color="#f5cf2a" roughness={0.6} />
          </mesh>
        </group>
      )}
    </>
  );
};

// ------------------------------------------------------------------ the 1893 camp and the column
const Camp: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  // the troops move south to Nong Khon Kwang in 1907; the huts go
  const k = campK(t, Y) * (1 - ramp(Y, 1907, 1909));
  if (k < 0.02) return null;
  return (
    <group position={[CAMP[0], 0, CAMP[1]]}>
      {[[-1.2, -1], [1.2, -1], [-1.2, 1.4], [1.2, 1.4], [0, 3]].map(([x, z], i) => (
        <Grow key={i} k={k} at={[x, 0, z]} rot={i % 2 ? Math.PI / 2 : 0}>
          <group scale={0.55}>
            <Hall />
          </group>
        </Grow>
      ))}
      {/* the flag on its pole */}
      <Grow k={k} at={[0, 0, 0.2]}>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 3.2, 6]} />
          <meshStandardMaterial color="#d8d2c4" />
        </mesh>
        <mesh position={[0.45, 2.9, 0]}>
          <boxGeometry args={[0.9, 0.55, 0.03]} />
          <meshStandardMaterial color="#b0261c" />
        </mesh>
      </Grow>
    </group>
  );
};

const Column: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: COLUMN}, (_, i) => {
      const c = columnAt(i, t);
      if (!c) return null;
      const step = c.moving ? t * 1.6 + i * 0.3 : 0;
      // two elephants near the head, carts at the tail, soldiers in white between
      const kind = i === 2 || i === 3 ? 'elephant' : i >= COLUMN - 4 ? 'cart' : 'walker';
      return (
        <group key={i} position={[c.x, 0, c.z]} rotation-y={c.rot}>
          {kind === 'elephant' ? (
            <group scale={0.62}>
              <Elephant step={step} howdah />
            </group>
          ) : kind === 'cart' ? (
            <group scale={0.6}>
              <Cart step={step} />
            </group>
          ) : (
            <group scale={0.55}>
              <Walker step={step} i={i} still={!c.moving} />
            </group>
          )}
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ the town's landmarks
const Temples: React.FC<{Y: number}> = ({Y}) => (
  <>
    {/* วัดมัชฌิมาวาส: the deserted Wat Non Mak Khaeng restored (1894) */}
    <Viharn pos={[MATCHIMA[0], 0, MATCHIMA[1]]} k={smooth01(ramp(Y, 1893.6, 1895))} scale={0.9} />
    {/* วัดโพธิสมภรณ์ (1906) */}
    <Viharn pos={[PHO_SI[0], 0, PHO_SI[1]]} k={smooth01(ramp(Y, 1905.5, 1907))} scale={0.9} rot={Math.PI / 2} />
  </>
);

const Civic: React.FC<{Y: number; night: number}> = ({Y, night}) => {
  // the hall on the rise (1906), the new five-storey hall (2015)
  const old = smooth01(ramp(Y, 1905.6, 1907)) * (1 - ramp(Y, 2014.6, 2015));
  const neu = smooth01(ramp(Y, 2014.6, 2015.6));
  const rachinu = smooth01(ramp(Y, 1920, 1925));
  const mon = smooth01(ramp(Y, 1970.6, 1971.2));
  const clock = smooth01(ramp(Y, 1957, 1958.4));
  const lit = night > 0.3 ? '#ffd9a0' : undefined;
  return (
    <>
      <Grow k={old} at={[HALL[0], 0, HALL[1]]}>
        <Box p={[0, 0.5, 0]} s={[3.2, 1, 1.6]} c="#efe6d2" />
        <mesh position={[0, 1.25, 0]} scale={[2, 0.5, 1.1]} rotation-y={Math.PI / 4}>
          <coneGeometry args={[1.2, 1, 4]} />
          <meshStandardMaterial color="#9a4a32" flatShading />
        </mesh>
      </Grow>
      <Grow k={neu} at={[HALL[0], 0, HALL[1]]}>
        <Box p={[0, 1.1, 0]} s={[4.2, 2.2, 1.9]} c="#f1eadb" e={lit} />
        <mesh position={[0, 2.55, 0]} scale={[2.4, 0.7, 1.2]} rotation-y={Math.PI / 4}>
          <coneGeometry args={[1.2, 1, 4]} />
          <meshStandardMaterial color="#b0452e" flatShading />
        </mesh>
      </Grow>
      {/* อาคารราชินูทิศ, the yellow colonial school (1920-25) */}
      <Grow k={rachinu} at={[RACHINU[0], 0, RACHINU[1]]}>
        <Box p={[0, 0.55, 0]} s={[2.6, 1.1, 1.2]} c="#e8c66a" e={lit} />
        <Box p={[0, 1.2, 0]} s={[2.8, 0.2, 1.4]} c="#a3533a" />
      </Grow>
      {/* the Prince Prachak monument in the five-way roundabout (1971) */}
      <mesh position={[MONUMENT[0], 0.05, MONUMENT[1]]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[1.5 * Math.max(mon, ramp(Y, 1940, 1945)), 24]} />
        <meshStandardMaterial color="#9cb46a" roughness={1} />
      </mesh>
      <Grow k={mon} at={[MONUMENT[0], 0, MONUMENT[1]]}>
        <Box p={[0, 0.45, 0]} s={[0.8, 0.9, 0.8]} c="#d8d2c4" />
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 0.9, 8]} />
          <meshStandardMaterial color="#3d3a34" metalness={0.4} roughness={0.5} />
        </mesh>
      </Grow>
      {/* the clock tower roundabout */}
      <Grow k={clock} at={[CLOCK[0], 0, CLOCK[1]]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[0.6, 2.8, 0.6]} />
          <meshStandardMaterial color="#f2efe6" />
        </mesh>
        <mesh position={[0, 2.5, 0.31]}>
          <circleGeometry args={[0.22, 16]} />
          <meshBasicMaterial color="#fffbe8" toneMapped={false} />
        </mesh>
      </Grow>
    </>
  );
};

const Chinese: React.FC<{Y: number; night: number}> = ({Y, night}) => {
  const shrine = smooth01(ramp(Y, 1945, 1948));
  const bigger = smooth01(ramp(Y, 2012, 2013.5));
  return (
    <>
      <mesh position={[NONG_BUA[0], 0.06, NONG_BUA[1]]} rotation-x={-Math.PI / 2} scale={[2.2, 1.6, 1]} receiveShadow>
        <circleGeometry args={[1, 20]} />
        <meshStandardMaterial color={WATER} roughness={0.25} metalness={0.1} />
      </mesh>
      <Grow k={shrine} at={[PUYA[0], 0, PUYA[1]]}>
        <Box p={[0, 0.45, 0]} s={[1.4 + bigger, 0.9, 1.0 + bigger * 0.6]} c="#c8322a" e={night > 0.3 ? '#ff7a4a' : undefined} />
        <mesh position={[0, 1.15, 0]} scale={[1.2 + bigger * 0.7, 0.45, 0.8 + bigger * 0.4]} rotation-y={Math.PI / 4}>
          <coneGeometry args={[1.2, 1, 4]} />
          <meshStandardMaterial color="#e2a933" flatShading />
        </mesh>
      </Grow>
    </>
  );
};

const Modern: React.FC<{Y: number; night: number}> = ({Y, night}) => {
  const mall = smooth01(ramp(Y, 1993.5, 1995));
  const ud = smooth01(ramp(Y, 2009.5, 2011));
  const lit = night > 0.3 ? '#ffe1a8' : undefined;
  return (
    <>
      {/* เจริญศรีคอมเพล็กซ์ (1994), Central from 2009 */}
      <Grow k={mall} at={[CENTRAL[0], 0, CENTRAL[1]]}>
        <Box p={[0, 1.2, 0]} s={[4, 2.4, 2.6]} c="#e9e4da" e={lit} />
        <Box p={[0.8, 3.8, 0]} s={[1.6, 2.8, 1.6]} c="#d6dde4" e={lit} />
      </Grow>
      {/* UD Town beside the station (2009-10) */}
      <Grow k={ud} at={[UD_TOWN[0], 0, UD_TOWN[1]]}>
        {[-1.6, 0, 1.6].map((z) => (
          <Box key={z} p={[0, 0.5, z]} s={[2.2, 1, 1.2]} c={z ? '#efe7d8' : '#d9c8a8'} e={lit} />
        ))}
      </Grow>
    </>
  );
};

// ------------------------------------------------------------------ the airfield and the planes
const Airfield: React.FC<{Y: number}> = ({Y}) => {
  // the first strip (1932), lengthened in the base years
  const first = smooth01(ramp(Y, 1931.5, 1933));
  const long = smooth01(ramp(Y, 1963, 1966));
  if (first < 0.02) return null;
  const L = RUNWAY_L * (0.4 + 0.6 * long);
  return (
    <group position={[AIRFIELD[0], 0, AIRFIELD[1]]} rotation-y={-RUNWAY_ROT}>
      <mesh position={[0, 0.05, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[L, 1.6 * first]} />
        <meshStandardMaterial color={long > 0.5 ? '#5c5f63' : '#b49a6c'} roughness={1} />
      </mesh>
      {long > 0.3 &&
        Array.from({length: 9}, (_, i) => (
          <mesh key={i} position={[-L / 2 + (i + 0.5) * (L / 9), 0.07, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[0.9, 0.08]} />
            <meshBasicMaterial color="#f2f0e8" />
          </mesh>
        ))}
      {/* hangars along the north side */}
      {[-4, -1, 2].map((x, i) => (
        <Grow key={i} k={i === 0 ? first : long} at={[x, 0, -2.6]}>
          <mesh position={[0, 0.5, 0]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.9, 0.9, 2.2, 12, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#9aa0a6" metalness={0.3} roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
        </Grow>
      ))}
    </group>
  );
};

/** a twin-prop transport of the 1960s, nose to +z */
const Transport: React.FC<{prop: number}> = ({prop}) => (
  <group>
    <mesh position={[0, 0.5, 0]} rotation-x={Math.PI / 2} castShadow>
      <cylinderGeometry args={[0.26, 0.18, 2.6, 10]} />
      <meshStandardMaterial color="#c9cdd2" metalness={0.4} roughness={0.45} />
    </mesh>
    <Box p={[0, 0.58, 0.15]} s={[3.2, 0.06, 0.5]} c="#b8bdc3" />
    <Box p={[0, 0.75, -1.15]} s={[0.06, 0.6, 0.4]} c="#b8bdc3" />
    <Box p={[0, 0.55, -1.15]} s={[1.1, 0.05, 0.3]} c="#b8bdc3" />
    {[-0.8, 0.8].map((x) => (
      <group key={x} position={[x, 0.52, 0.5]}>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.12, 0.12, 0.6, 8]} />
          <meshStandardMaterial color="#8e949a" />
        </mesh>
        <mesh position={[0, 0, 0.32]} rotation-z={prop}>
          <boxGeometry args={[0.7, 0.05, 0.02]} />
          <meshStandardMaterial color="#2c2c2c" />
        </mesh>
      </group>
    ))}
  </group>
);

const Planes: React.FC<{t: number}> = ({t}) => (
  <>
    {[0, 1, 2].map((i) => {
      const p = planeAt(i, t);
      return p ? (
        <group key={i} position={[p.x, p.y - 0.5, p.z]} rotation-y={p.rot} scale={1.1}>
          <group rotation-x={-Math.min(0.25, p.lift * 0.08)}>
            <Transport prop={t * 40} />
          </group>
        </group>
      ) : null;
    })}
  </>
);

// ------------------------------------------------------------------ the dragon dance
const Dragon: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: DRAGON_N}, (_, i) => {
      const d = dragonAt(i, t);
      if (!d) return null;
      return (
        <group key={i} position={[d.x, 0, d.z]} rotation-y={d.rot}>
          <mesh position={[0, d.y, 0]} scale={i === 0 ? [0.42, 0.36, 0.5] : [0.3, 0.3, 0.34]} castShadow>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color={i === 0 ? '#e0a52c' : i % 2 ? '#c8322a' : '#e0a52c'} roughness={0.6} />
          </mesh>
          <group scale={0.42}>
            <Walker step={t * 2 + i * 0.4} i={i} />
          </group>
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ the fair (the payoff)
const Fair: React.FC<{t: number; Y: number; night: number}> = ({t, Y, night}) => {
  const halo = useMemo(() => glowTexture('rgba(255,236,190,1)', 'rgba(255,170,80,0.55)'), []);
  const k = beatK('payoff', t);
  if (Y < 2024.9 || k > 1.4) return null;
  const L = lanternK(t);
  const wheel = t * 0.35;
  // lit as it rises, breathing like a flame inside
  const pulse = L * (0.7 + 0.25 * Math.sin(t * 5) + 0.6 * night);
  return (
    <group position={[FIELD[0], 0, FIELD[1]]}>
      <mesh position={[0, 0.04, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[4.4, 40]} />
        <meshStandardMaterial color="#c8b07c" roughness={1} />
      </mesh>
      {/* the jar back: a giant lantern on the field, lit from inside */}
      {L > 0.02 && (
        <>
          <group scale={[2 * PAY_S, 2 * PAY_S * L, 2 * PAY_S]} rotation-y={t * 0.3}>
            <Jar k={1} seg={36} glow={pulse} />
          </group>
          {/* the light it throws: a warm halo round it, a flame at the mouth, a pool on the ground */}
          <sprite position={[0, PAY_S, 0]} scale={[7.5 * PAY_S * L, 7.5 * PAY_S * L, 1]}>
            <spriteMaterial map={halo} transparent opacity={0.55 + 0.25 * night} depthWrite={false} toneMapped={false} />
          </sprite>
          <mesh position={[0, 2 * PAY_S * 0.93 * L, 0]} scale={[0.3 * PAY_S, (0.42 + 0.08 * Math.sin(t * 13)) * PAY_S, 0.3 * PAY_S]}>
            <coneGeometry args={[1, 1.6, 10]} />
            <meshBasicMaterial color="#ffcf6a" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation-x={-Math.PI / 2}>
            <circleGeometry args={[2.6 * PAY_S * L, 32]} />
            <meshBasicMaterial color="#ffc46a" transparent opacity={0.35} toneMapped={false} depthWrite={false} />
          </mesh>
        </>
      )}
      {/* the Ferris wheel */}
      <group position={[-2.6, 2.6, 2.8]} rotation-y={0.9}>
        <group rotation-z={wheel}>
          <mesh>
            <torusGeometry args={[2.1, 0.06, 6, 40]} />
            <meshStandardMaterial color="#e8e4dc" emissive={night > 0.3 ? '#ffd27a' : '#000000'} emissiveIntensity={0.8} />
          </mesh>
          {Array.from({length: 10}, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 2.1, Math.sin(a) * 2.1, 0]}>
                <boxGeometry args={[0.32, 0.32, 0.32]} />
                <meshStandardMaterial color={['#d8432f', '#2f7fd8', '#e0b02c'][i % 3]} />
              </mesh>
            );
          })}
        </group>
        {[-0.5, 0.5].map((z) => (
          <mesh key={z} position={[0, -1.3, z]}>
            <boxGeometry args={[0.1, 2.6, 0.1]} />
            <meshStandardMaterial color="#9aa0a6" />
          </mesh>
        ))}
      </group>
      {/* the crowd and the stalls' strings of lights */}
      {Array.from({length: 44}, (_, i) => {
        const a = (i / 44) * Math.PI * 2;
        const r = 2.9 + (i % 3) * 0.5;
        return (
          <group key={i} position={[Math.cos(a + t * 0.05) * r, 0, Math.sin(a + t * 0.05) * r]} rotation-y={-a} scale={0.42}>
            <Walker step={t * 0.8 + i * 0.3} i={i} />
          </group>
        );
      })}
      {Array.from({length: 30}, (_, i) => {
        const a = (i / 30) * Math.PI * 2;
        return (
          <mesh key={`l${i}`} position={[Math.cos(a) * 4.4, 1.5 + 0.2 * Math.sin(i), Math.sin(a) * 4.4]}>
            <sphereGeometry args={[0.12, 8, 6]} />
            <meshBasicMaterial color={i % 3 ? '#ffd36a' : '#ff8a5a'} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

export const UdonLandmarks: React.FC<LandmarkProps> = ({Y, t, night}) => {
  // the rail's station and the town's houses come from the engine; these are the named places
  return (
    <>
      <HeroJar t={t} />
      <Lake Y={Y} />
      <Camp t={t} Y={Y} />
      <Column t={t} />
      <Temples Y={Y} />
      <Civic Y={Y} night={night} />
      <Chinese Y={Y} night={night} />
      <Modern Y={Y} night={night} />
      <Airfield Y={Y} />
      <Planes t={t} />
      <Dragon t={t} />
      <Fair t={t} Y={Y} night={night} />
    </>
  );
};
