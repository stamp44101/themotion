import React from 'react';
import * as THREE from 'three';
import {HipRoof} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {SteamLoco} from '../kanchanaburi/figures';
import {Walker} from '../nan/figures';
import {
  BOATS, CALLBACK_AT, HALL_AT, CALLBACK_S, DINERS, DUGONG_AT, FLOOD, GARDENS, HERO_AT, HERO_ROT, HERO_S, JUNKS, KT_STATION_AT, LINE,
  LINE_L, LONGTAILS, PLANTERS, PORK_AT, PLOT_COLS, PLOT_ROWS, PORTERS, QUAY, SHOPHOUSES, STEAMER_AT, TABLES, TR_STATION_AT, WALKERS,
  boatAt, breakfastK, callbackK, clockK, dinerAt, firstTrainAt, floodK, hallK, heroK, junkAt, longtailAt, moveTrainAt,
  planterAt, porterAt, seedAt, seedK, shopK, smooth, stationK, trStationK, trackK, walkerAt,
} from './actors';
import {Puff, RubberTree, Waters} from './Hero';
import {CLOCK} from './places';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; r?: number; basic?: boolean}> = ({p, s, c, r = 0, basic}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    {basic ? <meshBasicMaterial color={c} toneMapped={false} /> : <meshStandardMaterial color={c} roughness={0.85} />}
  </mesh>
);

// ------------------------------------------------------------------ boats
/** a Penang junk (สำเภา), ~2.4 long, bow toward +z */
const Junk: React.FC<{sail?: string}> = ({sail = '#b5542e'}) => (
  <group>
    <Box p={[0, 0.2, 0]} s={[0.7, 0.35, 2.0]} c="#5a3a22" />
    <Box p={[0, 0.42, -0.95]} s={[0.66, 0.35, 0.4]} c="#6b452a" />
    <Box p={[0, 0.3, 1.0]} s={[0.5, 0.22, 0.4]} c="#6b452a" />
    {[[0.35, 1.7, 1.1], [-0.4, 1.3, 0.8]].map(([z, h, w], k) => (
      <group key={k} position={[0, 0.35, z]}>
        <mesh position={[0, h / 2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, h, 5]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
        <mesh position={[0, h * 0.58, 0.02]} rotation-y={Math.PI / 2}>
          <planeGeometry args={[w, h * 0.78]} />
          <meshStandardMaterial color={sail} side={THREE.DoubleSide} roughness={0.9} />
        </mesh>
        {[0.3, 0.55, 0.8].map((v) => (
          <mesh key={v} position={[0, h * v, 0.04]} rotation-y={Math.PI / 2}>
            <boxGeometry args={[w, 0.025, 0.02]} />
            <meshStandardMaterial color="#3a2a1a" />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);
/** a river boat with a thatched cabin; `lead` carries the governor's white canopy and flag */
const RiverBoat: React.FC<{lead?: boolean; i: number}> = ({lead, i}) => (
  <group>
    <Box p={[0, 0.12, 0]} s={[0.42, 0.18, 1.5]} c="#6b452a" />
    <Box p={[0, 0.3, -0.1]} s={[0.4, 0.22, 0.7]} c={lead ? '#f2efe6' : '#a8915e'} />
    {lead && (
      <>
        <mesh position={[0, 0.85, 0.5]}>
          <cylinderGeometry args={[0.015, 0.015, 0.9, 5]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
        <mesh position={[0.14, 1.15, 0.5]}>
          <planeGeometry args={[0.28, 0.18]} />
          <meshStandardMaterial color="#c4262c" side={THREE.DoubleSide} />
        </mesh>
      </>
    )}
    {[-0.5, 0.55].map((z, k) => (
      <group key={k} position={[0, 0.2, z]} scale={0.3}>
        <Walker step={0} i={i + k} still />
      </group>
    ))}
  </group>
);
/** a small coastal steamer at the quay, ~3 long, bow toward +z */
const Steamer: React.FC<{t: number}> = ({t}) => (
  <group>
    <Box p={[0, 0.22, 0]} s={[0.8, 0.4, 3.0]} c="#2c2f36" />
    <Box p={[0, 0.5, -0.2]} s={[0.66, 0.3, 1.4]} c="#efe9dc" />
    <mesh position={[0, 0.95, 0.1]}>
      <cylinderGeometry args={[0.12, 0.12, 0.6, 10]} />
      <meshStandardMaterial color="#b0261c" />
    </mesh>
    <group position={[0, 1.3, 0.1]}>
      <Puff u={(t * 0.8) % 1} seed={Math.floor(t * 0.8)} S={0.6} color="#d6d2ca" n={5} rise={1} />
    </group>
  </group>
);
/** a long-tail boat (เรือหางยาว), ~1.8 long, bow toward +z, with its long shaft and a wake */
const LongTail: React.FC<{t: number; i: number}> = ({t, i}) => (
  <group>
    <Box p={[0, 0.1, 0]} s={[0.36, 0.16, 1.8]} c={i % 2 ? '#2f6fb0' : '#c7a253'} />
    <Box p={[0, 0.3, 0.9]} s={[0.06, 0.4, 0.06]} c="#c4262c" />
    <mesh position={[0, 0.16, -1.1]} rotation-x={0.2}>
      <cylinderGeometry args={[0.02, 0.02, 0.8, 5]} />
      <meshStandardMaterial color="#555" />
    </mesh>
    {[0, 1, 2].map((k) => (
      <group key={k} position={[-0.2 + k * 0.2, 0.15, -0.2 + k * 0.3]} scale={0.26}>
        <Walker step={0} i={i * 3 + k} still />
      </group>
    ))}
    <group position={[0, 0.1, -1.5]}>
      <Puff u={(t * 2) % 1} seed={Math.floor(t * 2) + i} S={0.5} color="#e8f4fb" n={5} />
    </group>
  </group>
);

// ------------------------------------------------------------------ the cover's tree
const CoverTree: React.FC<{t: number}> = ({t}) => {
  const k = heroK(t);
  if (k < 0.01) return null;
  return (
    <group position={[HERO_AT[0], 0, HERO_AT[1]]} rotation-y={HERO_ROT} scale={[1, k, 1]}>
      <RubberTree t={t} S={HERO_S} />
    </group>
  );
};

// ------------------------------------------------------------------ Khuan Thani: the city pillar's shrine, always there
/** drawn 1 unit SE of its pin, clear of the road that passes it */
export const SHRINE_AT: [number, number] = [-23.3, 9.8];
const PillarShrine: React.FC = () => (
  <group position={[SHRINE_AT[0], 0, SHRINE_AT[1]]}>
    <Box p={[0, 0.2, 0]} s={[0.9, 0.4, 0.9]} c="#efe7d6" />
    <HipRoof w={1.1} l={1.1} h={0.5} y={0.4} color="#a8342a" />
  </group>
);

// ------------------------------------------------------------------ Kantang: shophouses, the quay, the station
const Shophouse: React.FC<{k: number; j: number}> = ({k, j}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <Box p={[0, 0.45, 0]} s={[0.8, 0.9, 1.4]} c={j % 3 === 0 ? '#e9dcc4' : j % 3 === 1 ? '#d9c39c' : '#efe6d4'} />
      <Box p={[0.41, 0.25, 0]} s={[0.04, 0.4, 1.2]} c="#6b452a" />
      <HipRoof w={1.0} l={1.6} h={0.45} y={0.9} color={j % 2 ? '#a8432c' : '#8a3a26'} />
    </group>
  );
const Kantang: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 1889.5) return null;
  const [a, b] = QUAY;
  const qk = shopK(0, t, Y);
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return (
    <group>
      {SHOPHOUSES.map(([x, z, r], j) => (
        <group key={j} position={[x, 0, z]} rotation-y={r}>
          <Shophouse k={shopK(j, t, Y)} j={j} />
        </group>
      ))}
      {qk > 0.02 && (
        <mesh position={[(a[0] + b[0]) / 2, 0.08, (a[1] + b[1]) / 2]} rotation-y={Math.atan2(b[0] - a[0], b[1] - a[1])} scale={[1, qk, 1]} receiveShadow>
          <boxGeometry args={[0.45, 0.16, L]} />
          <meshStandardMaterial color="#8f8576" roughness={0.9} />
        </mesh>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the first rubber: seedlings in rows, planters, gardens
const Seedling: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={k}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.9, 5]} />
        <meshStandardMaterial color="#7d786c" />
      </mesh>
      <mesh position={[0, 1.0, 0]} scale={[0.38, 0.3, 0.38]} castShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={i % 2 ? '#4f9140' : '#3f7f35'} flatShading />
      </mesh>
    </group>
  );
const FirstPlot: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 1890.5) return null;
  return (
    <group>
      {Array.from({length: PLOT_ROWS * PLOT_COLS}, (_, n) => {
        const r = Math.floor(n / PLOT_COLS);
        const c = n % PLOT_COLS;
        const [x, z] = seedAt(r, c);
        return (
          <group key={n} position={[x, 0, z]}>
            <Seedling k={seedK(r, c, t, Y)} i={n} />
          </group>
        );
      })}
      {Array.from({length: PLANTERS}, (_, i) => {
        const p = planterAt(i, t);
        return p ? (
          <group key={i} position={[p[0], 0, p[1]]} rotation-y={Math.PI + i} scale={0.42}>
            <Walker step={t * 1.2 + i} i={i} load={i % 2 === 0} />
          </group>
        ) : null;
      })}
    </group>
  );
};
/** the rubber gardens: rows of small rubber trees that appear plot by plot over the years */
const GARDEN_TREES = GARDENS.slice(1).flatMap(([cx, cz, w, d, year], g) => {
  const out: [number, number, number, number][] = [];
  for (let x = -w / 2 + 0.4; x <= w / 2 - 0.3; x += 0.9) for (let z = -d / 2 + 0.4; z <= d / 2 - 0.3; z += 0.9) out.push([cx + x, cz + z, year + g * 0.01, hash(out.length + g * 31)]);
  return out;
});
const Gardens: React.FC<{Y: number}> = ({Y}) => {
  const trunk = React.useRef<THREE.InstancedMesh>(null);
  const crown = React.useRef<THREE.InstancedMesh>(null);
  React.useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    GARDEN_TREES.forEach(([x, z, year, h], i) => {
      const k = smooth((Y - year) / 6);
      const s = Math.max(0.0001, k) * (0.85 + h * 0.3);
      m.compose(new THREE.Vector3(x, 0.55 * s, z), q, new THREE.Vector3(s, s, s));
      trunk.current!.setMatrixAt(i, m);
      m.compose(new THREE.Vector3(x, 1.25 * s, z), q, new THREE.Vector3(0.48 * s, 0.4 * s, 0.48 * s));
      crown.current!.setMatrixAt(i, m);
    });
    trunk.current!.instanceMatrix.needsUpdate = true;
    crown.current!.instanceMatrix.needsUpdate = true;
  }, [Y]);
  return (
    <group>
      <instancedMesh ref={trunk} args={[undefined, undefined, GARDEN_TREES.length]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 1.1, 5]} />
        <meshStandardMaterial color="#7d786c" />
      </instancedMesh>
      <instancedMesh ref={crown} args={[undefined, undefined, GARDEN_TREES.length]} castShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#4a8a3c" flatShading />
      </instancedMesh>
    </group>
  );
};

// ------------------------------------------------------------------ the railway, the stations and the trains
const SEGS = LINE.slice(1).map((b, i) => [LINE[i], b] as const);
const Railway: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 1912) return null;
  let left = trackK(t, Y) * LINE_L;
  return (
    <group>
      {SEGS.map(([a, b], i) => {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const show = Math.min(len, Math.max(0, left));
        left -= len;
        if (show < 0.05) return null;
        const u = show / len;
        const ex = a[0] + (b[0] - a[0]) * u;
        const ez = a[1] + (b[1] - a[1]) * u;
        return (
          <mesh key={i} position={[(a[0] + ex) / 2, 0.06, (a[1] + ez) / 2]} rotation-y={Math.atan2(b[0] - a[0], b[1] - a[1])} receiveShadow>
            <boxGeometry args={[0.5, 0.08, show]} />
            <meshStandardMaterial color="#5e5148" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
};
/** a wooden station hall (the Kantang one is the yellow-and-brown original) */
const Station: React.FC<{k: number; rot: number; c: string}> = ({k, rot, c}) =>
  k < 0.02 ? null : (
    <group rotation-y={rot} scale={[1, k, 1]}>
      <Box p={[0, 0.35, 0]} s={[0.9, 0.7, 2.6]} c={c} />
      <Box p={[0.46, 0.35, 0]} s={[0.04, 0.5, 2.3]} c="#7a4a26" />
      <HipRoof w={1.3} l={3.0} h={0.5} y={0.7} color="#7a3a22" />
    </group>
  );
const Train: React.FC<{p: {x: number; z: number; rot: number} | null; t: number}> = ({p, t}) =>
  p ? (
    <group position={[p.x, 0.08, p.z]} rotation-y={p.rot - Math.PI / 2} scale={2.4}>
      <SteamLoco wagons={4} t={t * 3} />
      <group position={[0.62, 0.45, 0]}>
        <Puff u={(t * 1.6) % 1} seed={Math.floor(t * 1.6)} S={0.6} color="#e8e4dc" n={6} rise={0.6} />
      </group>
    </group>
  ) : null;
const Trains: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const mv = moveTrainAt(t);
  return (
    <group>
      <group position={[KT_STATION_AT[0], 0, KT_STATION_AT[1]]}>
        <Station k={stationK(t, Y)} rot={-0.5} c="#e6c66a" />
      </group>
      <Train p={firstTrainAt(t)} t={t} />
      <Train p={mv ? {...mv} : null} t={t} />
      {Array.from({length: PORTERS}, (_, i) => {
        const p = porterAt(i, t);
        return p ? (
          <group key={i} position={[p[0], 0, p[1]]} rotation-y={Math.PI / 2} scale={0.42}>
            <Walker step={t * 1.4 + i} i={i} load />
          </group>
        ) : null;
      })}
      {t > 23 && t < 27.2 && (
        <group position={[STEAMER_AT[0], 0.05, STEAMER_AT[1]]} rotation-y={0.08}>
          <Steamer t={t} />
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the flood over Kantang
const FLOOD_SHAPE = (() => {
  const sh = new THREE.Shape();
  FLOOD.forEach(([x, z], i) => (i === 0 ? sh.moveTo(x, -z) : sh.lineTo(x, -z)));
  sh.closePath();
  return sh;
})();
const Flood: React.FC<{t: number}> = ({t}) => {
  const k = floodK(t);
  if (k < 0.01) return null;
  return (
    <mesh position={[0, 0.05 + 0.3 * k, 0]} rotation-x={-Math.PI / 2}>
      <shapeGeometry args={[FLOOD_SHAPE]} />
      <meshStandardMaterial color="#6f9cb0" transparent opacity={0.75 * k} roughness={0.6} />
    </mesh>
  );
};

// ------------------------------------------------------------------ Thap Thiang: the hall, the station, the clock tower
const ThapThiang: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const hk = hallK(t, Y);
  const ck = clockK(t, Y);
  return (
    <group>
      <group position={[TR_STATION_AT[0], 0, TR_STATION_AT[1]]}>
        <Station k={trStationK(Y)} rot={0.05} c="#efe3c2" />
      </group>
      {hk > 0.02 && (
        <group position={[HALL_AT[0], 0, HALL_AT[1]]} scale={[1, hk, 1]}>
          <Box p={[0, 0.4, 0]} s={[1.2, 0.8, 0.7]} c="#f4f0e6" />
          <Box p={[0, 0.4, 0.37]} s={[0.4, 0.8, 0.06]} c="#e6dccb" />
          <HipRoof w={1.4} l={0.9} h={0.45} y={0.8} color="#8a3a26" />
        </group>
      )}
      {ck > 0.02 && (
        <group position={[CLOCK[0], 0, CLOCK[1]]} scale={[1, ck, 1]}>
          <Box p={[0, 1.0, 0]} s={[0.45, 2.0, 0.45]} c="#f2ede2" />
          {[0, 1, 2, 3].map((k) => (
            <mesh key={k} position={[Math.sin((k * Math.PI) / 2) * 0.24, 1.7, Math.cos((k * Math.PI) / 2) * 0.24]} rotation-y={(k * Math.PI) / 2}>
              <circleGeometry args={[0.15, 16]} />
              <meshBasicMaterial color="#fffaf0" toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
          ))}
          <mesh position={[0, 2.2, 0]}>
            <coneGeometry args={[0.35, 0.5, 4]} />
            <meshStandardMaterial color="#8a3a26" />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the sea: long-tails and a dugong pair off Ko Libong
const Dugong: React.FC<{t: number; s: number; phase: number}> = ({t, s, phase}) => {
  const fl = Math.sin(t * 2.4 + phase) * 0.35;
  return (
    <group scale={s}>
      <mesh scale={[0.32, 0.26, 1]}>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshStandardMaterial color="#8d8f93" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.03, 0.5]} scale={[0.9, 0.8, 1]}>
        <sphereGeometry args={[0.11, 12, 8]} />
        <meshStandardMaterial color="#9a9ca0" roughness={0.6} />
      </mesh>
      <group position={[0, 0, -0.5]} rotation-x={fl}>
        <mesh position={[0, 0, -0.12]} scale={[1.6, 0.12, 0.6]}>
          <sphereGeometry args={[0.13, 12, 8]} />
          <meshStandardMaterial color="#7f8185" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
const Sea: React.FC<{t: number}> = ({t}) => {
  if (t < 40.4 || t > 46.4) return null;
  const sw = (t - 41) * 0.25;
  return (
    <group>
      {Array.from({length: LONGTAILS}, (_, i) => {
        const p = longtailAt(i, t);
        return p ? (
          <group key={i} position={[p.x + (i - 1) * 0.5, 0.05, p.z]} rotation-y={p.rot}>
            <LongTail t={t} i={i} />
          </group>
        ) : null;
      })}
      <group position={[DUGONG_AT[0], 0.18 + Math.sin(t * 1.2) * 0.06, DUGONG_AT[1] - sw]} rotation-y={Math.PI + 0.3}>
        <Dugong t={t} s={2.6} phase={0} />
      </group>
      <group position={[DUGONG_AT[0] + 1.0, 0.14 + Math.sin(t * 1.2 + 1) * 0.05, DUGONG_AT[1] - sw + 0.4]} rotation-y={Math.PI + 0.3}>
        <Dugong t={t} s={1.5} phase={1.3} />
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ breakfast: tables, steamers, roast pork, the tree back
const Breakfast: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = breakfastK(t, Y);
  const cb = callbackK(t);
  if (k < 0.01 && cb < 0.01) return null;
  return (
    <group>
      {cb > 0.01 && (
        <group position={[CALLBACK_AT[0], 0, CALLBACK_AT[1]]} rotation-y={0.2} scale={[1, cb, 1]}>
          <RubberTree t={t} S={CALLBACK_S} done />
        </group>
      )}
      {k > 0.01 &&
        TABLES.map(([x, z], i) => (
          <group key={i} position={[x, 0, z]} scale={k}>
            <Box p={[0, 0.3, 0]} s={[0.5, 0.06, 0.5]} c="#f4f1ea" />
            <Box p={[0, 0.15, 0]} s={[0.08, 0.3, 0.08]} c="#5a3b22" />
            {/* a stack of bamboo steamers, steaming */}
            <mesh position={[0.1, 0.42, 0.05]}>
              <cylinderGeometry args={[0.1, 0.1, 0.18, 10]} />
              <meshStandardMaterial color="#c9a46a" />
            </mesh>
            <group position={[0.1, 0.55, 0.05]}>
              <Puff u={(t * 0.9 + i * 0.37) % 1} seed={Math.floor(t * 0.9 + i * 0.37) + i * 7} S={0.4} color="#ffffff" n={4} rise={1} />
            </group>
          </group>
        ))}
      {k > 0.01 && (
        // the roast pork rack: two whole pigs hung glossy red-brown
        <group position={[PORK_AT[0], 0, PORK_AT[1]]} scale={k}>
          <Box p={[0, 0.7, 0]} s={[0.06, 1.4, 0.06]} c="#3a3a3a" />
          <Box p={[0, 1.4, 0]} s={[1.2, 0.05, 0.05]} c="#3a3a3a" />
          {[-0.35, 0.35].map((x) => (
            <mesh key={x} position={[x, 0.95, 0]} scale={[0.22, 0.42, 0.16]}>
              <sphereGeometry args={[1, 12, 10]} />
              <meshStandardMaterial color="#9a3c16" roughness={0.35} metalness={0.1} />
            </mesh>
          ))}
        </group>
      )}
      {k > 0.01 &&
        Array.from({length: DINERS}, (_, i) => {
          const [x, z] = dinerAt(i);
          return (
            <group key={i} position={[x, 0, z]} rotation-y={i < TABLES.length ? Math.PI / 2 : -Math.PI / 2} scale={0.36 * k}>
              <Walker step={0} i={i} still />
            </group>
          );
        })}
    </group>
  );
};

export const TrangLandmarks: React.FC<LandmarkProps> = ({Y, t}) => (
  <group>
    <Waters />
    <CoverTree t={t} />
    <PillarShrine />
    {t > 3 && t < 9 &&
      Array.from({length: JUNKS}, (_, i) => {
        const p = junkAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot}>
            <Junk sail={i % 2 ? '#c9a46a' : '#b5542e'} />
          </group>
        ) : null;
      })}
    {t > 8 && t < 15.5 &&
      Array.from({length: BOATS}, (_, i) => {
        const p = boatAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot}>
            <RiverBoat lead={i === 0} i={i} />
          </group>
        ) : null;
      })}
    {t > 8 && t < 15.5 &&
      Array.from({length: WALKERS}, (_, i) => {
        const p = walkerAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.4}>
            <Walker step={t * 1.3 + i} i={i} load={i % 3 === 0} />
          </group>
        ) : null;
      })}
    <Kantang t={t} Y={Y} />
    <FirstPlot t={t} Y={Y} />
    <Gardens Y={Y} />
    <Railway t={t} Y={Y} />
    <Trains t={t} Y={Y} />
    <Flood t={t} />
    <ThapThiang t={t} Y={Y} />
    <Sea t={t} />
    <Breakfast t={t} Y={Y} />
  </group>
);
