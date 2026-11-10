import React from 'react';
import * as THREE from 'three';
import type {LandmarkProps} from '../../engine/types';
import {HipRoof} from '../../engine/parts';
import {Walker} from '../nan/figures';
import {
  BIND_END,
  bindAt,
  BOATS,
  boatAt,
  clamp01,
  CLOUD_Y,
  cloudK,
  towerK,
  CROWD,
  crowdAt,
  crowdK,
  flagK,
  floatAt,
  FLOATS,
  flyY,
  FOUND_HOUSES,
  foundHouseK,
  FUSE,
  hallK,
  hongK,
  LIFT,
  LIFT2,
  museumK,
  NOZZLE,
  rainK,
  RINGS,
  ringY,
  riseK,
  rocketShown,
  SHOPS,
  shopK,
  smooth,
  stupaK,
  tailK,
  tractorAt,
  TRESTLE,
  TRUCKS,
  truckAt,
} from './actors';
import {BODY, HALL, HONG, MUSEUM, PILLAR, R, ROCKET_AT, TAIL, TOWER, WAT_MAHATHAT, WAT_SING_THA} from './places';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const Box: React.FC<{
  p: [number, number, number];
  s: [number, number, number];
  c: string;
  e?: string;
  ei?: number;
  r?: number;
}> = ({p, s, c, e, ei = 0.6, r = 0}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} emissive={e ?? '#000000'} emissiveIntensity={e ? ei : 0} />
  </mesh>
);

// ------------------------------------------------------------------ the rocket (from the style frame A1)
const BAMBOO = '#c9b46a';
const ROPE = '#5b3a1f';
const RED = '#b3261e';
const GOLD = '#d9a521';

/** a puff of smoke, grey-white, that grows and fades with its age u (0..1) */
const Smoke: React.FC<{p: [number, number, number]; u: number; s: number}> = ({p, u, s}) =>
  u < 0 || u > 1 ? null : (
    <mesh position={p} scale={s * (0.4 + u * 1.2)}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#e4e1da" roughness={1} transparent opacity={0.9 * (1 - u * u)} />
    </mesh>
  );

/** the rocket in its local frame: standing along +y from the foot of the tail */
const RocketBody: React.FC<{t: number; burning: boolean}> = ({t, burning}) => {
  const tail = tailK(t);
  const next = Array.from({length: RINGS}, (_, k) => k).find((k) => bindAt(k) > t);
  return (
    <group>
      {/* the bamboo body and its nodes */}
      <mesh position={[0, NOZZLE + BODY / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[R, R, BODY, 18]} />
        <meshStandardMaterial color={BAMBOO} roughness={0.7} />
      </mesh>
      {/* the nose (หัวบั้งไฟ), red cloth over a cone */}
      <mesh position={[0, NOZZLE + BODY + 1.3 * R, 0]} castShadow>
        <coneGeometry args={[R * 1.05, R * 2.6, 18]} />
        <meshStandardMaterial color={RED} roughness={0.8} />
      </mesh>
      {/* the rope rings: each drops on spinning when it is bound; every fourth is red */}
      {Array.from({length: RINGS}, (_, k) => {
        const f = t > BIND_END + 1 ? 1 : smooth((t - bindAt(k)) / 0.12);
        if (f <= 0) return null;
        return (
          <mesh key={k} position={[0, ringY(k), 0]} rotation-x={Math.PI / 2} rotation-z={(1 - f) * 4} scale={1 + (1 - f) * 0.6}>
            <torusGeometry args={[R * 1.04, R * 0.16, 8, 24]} />
            <meshStandardMaterial color={k % 4 === 3 ? RED : ROPE} roughness={0.95} />
          </mesh>
        );
      })}
      {/* the binder's coil of rope over the next ring, spinning (gone once the body is bound) */}
      {next !== undefined && t < BIND_END && (
        <group position={[R * 1.9, ringY(next), 0]} rotation-y={t * 9}>
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[R * 0.55, R * 0.28, 8, 16]} />
            <meshStandardMaterial color={ROPE} roughness={0.95} />
          </mesh>
        </group>
      )}
      {/* the bamboo tail (หาง), lashed alongside the lower body; it slides up into place after the binding */}
      {tail > 0.01 && (
        <group position={[R * 1.15, TAIL / 2 - (1 - tail) * TAIL * 0.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[R * 0.25, R * 0.32, TAIL + 4, 8]} />
            <meshStandardMaterial color="#b9a35c" roughness={0.75} />
          </mesh>
          {[TAIL / 2 - 0.5, TAIL / 2 + 1.5].map((y) => (
            <mesh key={y} position={[-R * 0.5, y, 0]} rotation-x={Math.PI / 2}>
              <torusGeometry args={[R * 1.2, R * 0.12, 6, 18]} />
              <meshStandardMaterial color={RED} roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}
      {/* the flame at the nozzle, self-lit */}
      {burning && (
        <mesh position={[0, NOZZLE - 1.6, 0]} rotation-x={Math.PI} scale={[R * 0.9, 3.2 * (0.85 + 0.15 * Math.sin(t * 40)), R * 0.9]}>
          <coneGeometry args={[1, 1, 12]} />
          <meshBasicMaterial color="#ffd27a" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

/** the launch tower (ฮ้านบั้งไฟ): four bamboo legs leaning in, with cross bars */
const Tower: React.FC<{h: number; w: number}> = ({h, w}) => (
  <group>
    {[
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ].map(([sx, sz], i) => {
      const lean = Math.atan((w * 0.3) / h);
      return (
        <mesh key={i} position={[sx * w * 0.35, h / 2, sz * w * 0.35]} rotation={[-sz * lean, 0, sx * lean]} castShadow>
          <cylinderGeometry args={[0.18, 0.26, h * 1.01, 6]} />
          <meshStandardMaterial color="#a8924d" roughness={0.8} />
        </mesh>
      );
    })}
    {[0.25, 0.5, 0.75, 0.95].map((f) =>
      [0, 1].map((o) => (
        <mesh key={`${f}${o}`} position={[0, f * h, 0]} rotation-y={o * (Math.PI / 2)}>
          <boxGeometry args={[w * (0.75 - 0.5 * f), 0.18, 0.18]} />
          <meshStandardMaterial color="#8d7841" roughness={0.85} />
        </mesh>
      )),
    )}
  </group>
);

/** a column of smoke from the tower to the climbing rocket, after a lift-off at `lift` */
const Trail: React.FC<{t: number; lift: number}> = ({t, lift}) => {
  const u = t - lift;
  if (u < 0 || u > 6.5) return null;
  const top = Math.min(9 * u * u, CLOUD_Y + 4 - R - NOZZLE); // into the cloud, not through the text band
  return (
    <group position={[ROCKET_AT[0], R + NOZZLE, ROCKET_AT[1]]}>
      {Array.from({length: 22}, (_, i) => {
        const f = i / 21;
        const age = (1 - f) * u;
        return (
          <Smoke
            key={i}
            p={[(hash(i) - 0.5) * age * 1.4, f * top - 1, (hash(i + 5) - 0.5) * age * 1.4]}
            u={clamp01(age / 6.5)}
            s={1.4 + age * 0.4}
          />
        );
      })}
      {/* the burst of smoke on the ground at lift-off */}
      {Array.from({length: 10}, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r = 1.5 + Math.min(u, 2) * 2.4;
        return <Smoke key={`g${i}`} p={[Math.cos(a) * r, -NOZZLE + 0.6, Math.sin(a) * r]} u={clamp01(u / 3)} s={1.6} />;
      })}
    </group>
  );
};

/** the rain cloud over the launch field: the rocket climbs into it (and the rain falls from it), and in the payoff comes back
 *  down out of it */
const Cloud: React.FC<{t: number}> = ({t}) => {
  const k = cloudK(t);
  if (k < 0.02) return null;
  return (
    <group position={[ROCKET_AT[0], CLOUD_Y, ROCKET_AT[1]]} scale={k}>
      {Array.from({length: 26}, (_, i) => {
        const a = hash(i + 200) * Math.PI * 2;
        const r = Math.sqrt(hash(i + 230)) * 16;
        const s = 4 + hash(i + 260) * 4;
        return (
          <mesh key={i} position={[Math.cos(a) * r, 2 + hash(i + 290) * 5 + s * 0.4, Math.sin(a) * r]} scale={[s * 1.3, s * 0.7, s * 1.3]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={i % 3 ? '#b9c0c8' : '#9aa4ae'} roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
};

const Rocket: React.FC<{t: number}> = ({t}) => {
  if (!rocketShown(t)) return null;
  const rise = riseK(t);
  const f = flyY(t);
  const burning = (t > FUSE + 0.3 && t < 30) || t > LIFT2 - 0.2;
  return (
    <group position={[ROCKET_AT[0], TRESTLE * (1 - rise) + R + (Number.isFinite(f) ? f : 0), ROCKET_AT[1]]} rotation-x={-(Math.PI / 2) * (1 - rise)}>
      <RocketBody t={t} burning={burning} />
    </group>
  );
};

/** the trestles under the lying rocket's body (gone once it stands) */
const Trestles: React.FC<{t: number}> = ({t}) => {
  const k = 1 - smooth((riseK(t) - 0.2) / 0.3);
  if (k < 0.02 || t > 10) return null;
  return (
    <group>
      {[NOZZLE + BODY * 0.2, NOZZLE + BODY * 0.8].map((y) =>
        [-1, 1].map((s) => (
          <mesh key={`${y}${s}`} position={[ROCKET_AT[0] + s * R * 0.9, (TRESTLE + R) / 2, ROCKET_AT[1] - y]} rotation-z={s * 0.3} scale={[1, k, 1]} castShadow>
            <boxGeometry args={[0.4, TRESTLE + R, 0.4]} />
            <meshStandardMaterial color="#6b4a2c" roughness={0.95} />
          </mesh>
        )),
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the launch crowd and the rain
const Crowd: React.FC<{t: number}> = ({t}) => {
  const k = crowdK(t);
  if (k < 0.02) return null;
  const cheer = t > LIFT;
  return (
    <group>
      {Array.from({length: CROWD}, (_, i) => {
        const [x, z] = crowdAt(i);
        const face = Math.atan2(TOWER[0] - x, TOWER[1] - z);
        return (
          <group key={i} position={[x, cheer ? 0.25 * Math.abs(Math.sin(t * 7 + i)) : 0, z]} rotation-y={face} scale={0.9 * k}>
            <Walker step={t * 0.8 + i} i={i} still={!cheer || i % 2 === 0} />
          </group>
        );
      })}
    </group>
  );
};

const Rain: React.FC<{t: number}> = ({t}) => {
  const k = rainK(t);
  if (k < 0.02) return null;
  return (
    <group>
      {Array.from({length: 160}, (_, i) => {
        const x = -14 + hash(i) * 30;
        const z = -10 + hash(i + 77) * 30;
        const y = 22 - (((t * 30 + hash(i + 3) * 22) % 22) + 0);
        return (
          <mesh key={i} position={[x, y, z]} scale={[0.06, 1.4, 0.06]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#cfe3f2" transparent opacity={0.7 * k} />
          </mesh>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ 2357: the stupa, the temple, the governor's hall
/** Phra That Phra Anon: a square Lan Xang stupa (25.3 m, drawn ~4 units at legend scale), white with a gilded bud */
const Stupa: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <Box p={[0, 0.3, 0]} s={[1.8, 0.6, 1.8]} c="#ece6d6" />
      <Box p={[0, 0.85, 0]} s={[1.4, 0.5, 1.4]} c="#f2ede0" />
      <Box p={[0, 1.4, 0]} s={[1.05, 0.6, 1.05]} c="#ece6d6" />
      {/* the square bud (บัวเหลี่ยม), narrowing in steps to a gilded spire */}
      <mesh position={[0, 2.25, 0]} rotation-y={Math.PI / 4} castShadow>
        <cylinderGeometry args={[0.32, 0.72, 1.1, 4]} />
        <meshStandardMaterial color="#f2ede0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.2, 0]} rotation-y={Math.PI / 4} castShadow>
        <cylinderGeometry args={[0.02, 0.3, 1.0, 4]} />
        <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
/** a small sim (ordination hall) with a red hip roof */
const Sim: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <Box p={[0, 0.35, 0]} s={[1.0, 0.7, 1.8]} c="#efe8d8" />
      <HipRoof w={1.25} l={2.1} h={0.55} y={0.7} color="#9a3a24" />
    </group>
  );
/** the governor's hall (โฮงเจ้าเมือง): a wooden hall on stilts */
const Hong: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      {[-0.8, 0, 0.8].map((x) =>
        [-0.5, 0.5].map((z) => <Box key={`${x}${z}`} p={[x, 0.25, z]} s={[0.12, 0.5, 0.12]} c="#5b3b22" />),
      )}
      <Box p={[0, 0.75, 0]} s={[2.0, 0.5, 1.3]} c="#8a6040" />
      <HipRoof w={2.4} l={1.6} h={0.7} y={1.0} color="#5a4636" />
    </group>
  );
/** a Lao house on stilts with a steep hip roof (drawn x1.4 so it reads in the found shot) */
const StiltHouse: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1.4, 1.4 * k, 1.4]}>
      {[-0.3, 0.3].map((x) => [-0.3, 0.3].map((z) => <Box key={`${x}${z}`} p={[x, 0.2, z]} s={[0.08, 0.4, 0.08]} c="#5b3b22" />))}
      <Box p={[0, 0.6, 0]} s={[0.8, 0.4, 0.8]} c={i % 2 ? '#8a6040' : '#7a5236'} />
      <HipRoof w={0.95} l={0.95} h={0.5} y={0.8} color="#5a4636" />
    </group>
  );
const OldTown: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const s = stupaK(t, Y);
  const h = hongK(t, Y);
  return (
    <group>
      {FOUND_HOUSES.map(([x, z], j) => (
        <group key={j} position={[x, 0, z]}>
          <StiltHouse k={foundHouseK(j, t, Y)} i={j} />
        </group>
      ))}
      {/* drawn at legend scale (x2.2), as the town's other landmarks, so it reads over the trees */}
      <group position={[WAT_MAHATHAT[0], 0, WAT_MAHATHAT[1]]} scale={2.2}>
        <Stupa k={s} />
        <group position={[1.3, 0, 0.2]} scale={0.8}>
          <Sim k={s} />
        </group>
      </group>
      <group position={[WAT_SING_THA[0], 0, WAT_SING_THA[1] + 0.4]}>
        <Sim k={h} />
      </group>
      <group position={[HONG[0], 0, HONG[1]]} scale={1.5}>
        <Hong k={h} />
      </group>
      {/* the city pillar's small shrine */}
      {h > 0.02 && (
        <group position={[PILLAR[0], 0, PILLAR[1]]} scale={[1, h, 1]}>
          <Box p={[0, 0.25, 0]} s={[0.5, 0.5, 0.5]} c="#efe2c8" />
          <HipRoof w={0.7} l={0.7} h={0.35} y={0.5} color="#b0261c" />
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the trade: boats, shophouses
/** a river boat (เรือแจว with a bamboo cabin) */
const Boat: React.FC = () => (
  <group>
    <Box p={[0, 0.16, 0]} s={[0.55, 0.32, 2.0]} c="#5b3b22" />
    <mesh position={[0, 0.42, -0.1]} rotation-z={Math.PI / 2} scale={[0.34, 0.28, 1.0]} castShadow>
      <cylinderGeometry args={[1, 1, 1, 12, 1, false, 0, Math.PI]} />
      <meshStandardMaterial color="#b89a5e" roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
  </group>
);
const Boats: React.FC<{t: number}> = ({t}) => (
  <group>
    {Array.from({length: BOATS}, (_, i) => {
      const p = boatAt(i, t);
      return p ? (
        <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot} scale={0.9}>
          <Boat />
        </group>
      ) : null;
    })}
  </group>
);
const Shophouses: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {SHOPS.map((s, j) => {
      const k = shopK(j, t, Y);
      return k < 0.02 ? null : (
        <group key={j} position={[s.x, 0, s.z]} scale={[1, k, 1]}>
          <Box p={[0, 0.5, 0]} s={[1.05, 1.0, 1.0]} c={j % 3 ? '#e8d48a' : '#efe6cf'} />
          <Box p={[0, 1.05, 0]} s={[1.12, 0.1, 1.08]} c="#7a5a3c" />
          <HipRoof w={1.1} l={1.05} h={0.35} y={1.1} color="#8a3b2a" />
        </group>
      );
    })}
  </group>
);

// ------------------------------------------------------------------ the road: trucks
const Truck: React.FC<{i: number}> = ({i}) => (
  <group>
    <Box p={[0, 0.35, -0.35]} s={[0.55, 0.45, 0.5]} c={i % 2 ? '#2f5d8a' : '#c7462e'} />
    <Box p={[0, 0.4, 0.3]} s={[0.6, 0.55, 0.9]} c="#7a5a3c" />
  </group>
);
const Trucks: React.FC<{t: number}> = ({t}) => (
  <group>
    {Array.from({length: TRUCKS}, (_, i) => {
      const p = truckAt(i, t);
      return p ? (
        <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot} scale={1.4}>
          <Truck i={i} />
        </group>
      ) : null;
    })}
  </group>
);

// ------------------------------------------------------------------ 2515: the provincial hall and its flag
const Hall: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = hallK(t, Y);
  if (k < 0.02) return null;
  const f = flagK(t, Y);
  return (
    <group position={[HALL[0], 0, HALL[1]]}>
      <group scale={[1, k, 1]}>
        <Box p={[0, 0.7, 0]} s={[3.4, 1.4, 1.5]} c="#f1ecdf" />
        <Box p={[0, 1.45, 0]} s={[3.6, 0.1, 1.7]} c="#7d5a3c" />
        <HipRoof w={3.6} l={1.7} h={0.55} y={1.5} color="#8a3b2a" />
      </group>
      {k > 0.5 && (
        <group position={[-1.2, 0, 1.4]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 3.0, 6]} />
            <meshStandardMaterial color="#dddddd" />
          </mesh>
          {f > 0.02 && (
            <group position={[0.36, 0.4 + 2.4 * f, 0]}>
              {['#b0261c', '#f4f4f4', '#2a3a8c', '#f4f4f4', '#b0261c'].map((c, i) => (
                <Box key={i} p={[0, 0.2 - i * 0.08, 0]} s={[0.7, i === 2 ? 0.16 : 0.08, 0.02]} c={c} />
              ))}
            </group>
          )}
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the grow shot: the tractor, the toad museum
const Tractor: React.FC<{t: number}> = ({t}) => {
  const p = tractorAt(t);
  if (!p) return null;
  return (
    <group position={[p.x, 0, p.z]} rotation-y={p.rot} scale={4}>
      <Box p={[0, 0.45, 0]} s={[0.8, 0.5, 1.2]} c="#c7462e" />
      <Box p={[0, 0.9, -0.2]} s={[0.6, 0.5, 0.5]} c="#2b2b2b" />
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.4, 0.3]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 12]} />
          <meshStandardMaterial color="#1f1f1f" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};
/** the Phaya Khankhak museum: a giant toad building (19 m, drawn ~3 units), facing the tower across the park */
const Museum: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = museumK(t, Y);
  if (k < 0.02) return null;
  const skin = '#8a7a3a';
  return (
    <group position={[MUSEUM[0], 0, MUSEUM[1]]} rotation-y={Math.PI * 0.85} scale={6 * k}>
      <mesh position={[0, 0.42, 0]} scale={[0.62, 0.42, 0.75]} castShadow>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.72, 0.5]} scale={[0.45, 0.3, 0.42]} castShadow>
        <sphereGeometry args={[1, 18, 12]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.22, 0.98, 0.62]} scale={0.1}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`l${s}`} position={[s * 0.55, 0.15, -0.3]} scale={[0.22, 0.16, 0.4]}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ the payoff: the decorated rockets in procession
/** a bang fai eh on its cart: a red tube banded in gold, a naga head at the front, walkers beside */
const Float: React.FC<{t: number; i: number}> = ({t, i}) => (
  <group>
    <Box p={[0, 0.25, 0]} s={[0.7, 0.3, 2.2]} c="#6b4a2c" />
    <mesh position={[0, 0.75, 0]} rotation-x={Math.PI / 2} castShadow>
      <cylinderGeometry args={[0.28, 0.28, 2.2, 12]} />
      <meshStandardMaterial color={RED} roughness={0.7} />
    </mesh>
    {[-0.7, 0, 0.7].map((z) => (
      <mesh key={z} position={[0, 0.75, z]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.3, 0.06, 6, 14]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
      </mesh>
    ))}
    {/* the naga head, raised at the front */}
    <mesh position={[0, 1.15, 1.25]} rotation-x={-0.6} castShadow>
      <coneGeometry args={[0.26, 0.9, 10]} />
      <meshStandardMaterial color={i % 2 ? GOLD : '#2f8a4a'} metalness={0.3} roughness={0.5} />
    </mesh>
    {[-0.75, 0.75].map((x, j) => (
      <group key={x} position={[x, 0, (j - 0.5) * 0.6]} scale={0.75}>
        <Walker step={t * 1.2 + i + j} i={i * 2 + j} />
      </group>
    ))}
  </group>
);
const Procession: React.FC<{t: number}> = ({t}) => (
  <group>
    {Array.from({length: FLOATS}, (_, i) => {
      const p = floatAt(i, t);
      return p ? (
        <group key={i} position={[p.x, 0.05, p.z]} rotation-y={p.rot} scale={1.6}>
          <Float t={t} i={i} />
        </group>
      ) : null;
    })}
  </group>
);

export const YasothonLandmarks: React.FC<LandmarkProps> = ({Y, t}) => (
  <group>
    {towerK(t) > 0.02 && (
      <group position={[TOWER[0], 0, TOWER[1]]} scale={[1, towerK(t), 1]}>
        <Tower h={TAIL + 6} w={5.2} />
      </group>
    )}
    <Cloud t={t} />
    <Trestles t={t} />
    <Rocket t={t} />
    <Trail t={t} lift={LIFT} />
    <Trail t={t} lift={LIFT2} />
    <Crowd t={t} />
    <Rain t={t} />
    <OldTown t={t} Y={Y} />
    {t > 15.4 && t < 24.0 && <Boats t={t} />}
    <Shophouses t={t} Y={Y} />
    {t > 23.4 && t < 30.0 && <Trucks t={t} />}
    <Hall t={t} Y={Y} />
    {t > 35.4 && t < 44.4 && <Tractor t={t} />}
    <Museum t={t} Y={Y} />
    {t > 44.4 && t < 51.0 && <Procession t={t} />}
  </group>
);
