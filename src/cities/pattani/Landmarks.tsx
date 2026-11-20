import React from 'react';
import * as THREE from 'three';
import type {LandmarkProps} from '../../engine/types';
import {HipRoof} from '../../engine/parts';
import {Walker} from '../nan/figures';
import {
  BOATS, CARTS, CROWD, FOUNDER_AT, FURNACE_AT, HAULERS, HAUL_PATH, MOULDS, PALANQUINS, PORTERS, POUR_END, PROC_N, SHIPS,
  SHIP_FLAGS, SHOPS, SMITHS, TAKE_CREW, bareK, boatAt, bridgeK, callbackK, coverK, crossAt, fairK, gateGunsK, haulAt,
  haulerAt, mosqueK, palaceK, porterAt, pourK, procAt, salute, shellFront, shipAt, shopK, shrineK, smithAt, splashK,
  takeAt, takeShipAt, BRIDGE_DIR,
} from './actors';
import {
  CANNON_AT, CANNON_S, CENTRAL_MOSQUE, CHABANG_TIGA, DECHA_BRIDGE, ISTANA, KRUESE, LANDING, PITS, SEA, SEA_NE, SHRINE, TOMB,
} from './places';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const SEA_C = '#2f7fb0';
const BRONZE = '#b98a3e';
const CLAY = '#c98a5c';

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; r?: number; e?: string; ei?: number}> = ({
  p,
  s,
  c,
  r = 0,
  e,
  ei = 0.6,
}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} emissive={e ?? '#000000'} emissiveIntensity={e ? ei : 0} />
  </mesh>
);

/** a puff that bursts out and fades, self-lit so it reads at noon (dust, smoke, spray) */
export const Puff: React.FC<{u: number; seed: number; S: number; color: string; n?: number; up?: number}> = ({u, seed, S, color, n = 10, up = 0.5}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.3 + hash(seed * 3 + i) * 0.5);
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * sp * u, (up + hash(seed * 7 + i) * 0.5) * sp * u, Math.sin(a) * sp * u]}
            scale={S * 0.08 * (1 - u) * (0.6 + hash(i + seed) * 0.6)}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1 - u} />
          </mesh>
        );
      })}
    </group>
  );
};

/** a flat water shape from a polygon in world x/z, its top at the rivers' surface */
const shapeOf = (pts: [number, number][]) => {
  const sh = new THREE.Shape();
  pts.forEach(([x, z], i) => (i === 0 ? sh.moveTo(x, -z) : sh.lineTo(x, -z)));
  sh.closePath();
  return sh;
};
export const FlatWater: React.FC<{shape: THREE.Shape; y?: number; color?: string}> = ({shape, y = 0, color = SEA_C}) => (
  <mesh position={[0, -1.3 + y, 0]} rotation-x={-Math.PI / 2} receiveShadow>
    <extrudeGeometry args={[shape, {depth: 1.4, bevelEnabled: false}]} />
    <meshStandardMaterial color={color} roughness={0.12} metalness={0.25} />
  </mesh>
);
export const SEA_SHAPE = shapeOf(SEA);
export const SEA_NE_SHAPE = shapeOf(SEA_NE);

// ------------------------------------------------------------------ the cannon (any size): barrel along +x, muzzle at +x
/** radius of the barrel at u (0 breech .. 1 muzzle), as a share of its length */
const radiusAt = (u: number) => 0.062 - 0.02 * u + (u > 0.94 ? (u - 0.94) * 0.5 : 0);
const RINGS = [0.05, 0.2, 0.36, 0.55, 0.72, 0.9];
/** the barrel: a tapered bronze tube in 8 sections with raised rings, a knob at the breech, two lifting handles */
const Barrel: React.FC<{S: number; hot?: number; color?: string; gild?: boolean; hotAt?: (u: number) => number}> = ({S, hot = 0, color = BRONZE, gild, hotAt}) => {
  const matOf = (h: number) => (
    <meshStandardMaterial
      color={gild ? '#f0c040' : color}
      metalness={0.75}
      roughness={0.32}
      emissive={h > 0.02 ? '#ff6a1a' : gild ? '#7a5a10' : '#000000'}
      emissiveIntensity={h > 0.02 ? h * 1.2 : gild ? 0.5 : 0}
    />
  );
  const mat = matOf(hot);
  const N = hotAt ? 16 : 8;
  return (
    <group>
      {Array.from({length: N}, (_, i) => {
        const u0 = i / N;
        const u1 = (i + 1) / N;
        return (
          <mesh key={i} position={[(u0 + u1 - 1) * 0.5 * S, 0, 0]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[radiusAt(u0) * S, radiusAt(u1) * S, S / N + 0.001, 20]} />
            {hotAt ? matOf(hotAt((u0 + u1) / 2)) : mat}
          </mesh>
        );
      })}
      {RINGS.map((u) => (
        <mesh key={u} position={[(u - 0.5) * S, 0, 0]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[radiusAt(u) * S * 1.12, radiusAt(u) * S * 1.12, S * 0.025, 20]} />
          {mat}
        </mesh>
      ))}
      {/* the muzzle's flare and its dark bore */}
      <mesh position={[0.5 * S, 0, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[radiusAt(1) * S * 1.05, radiusAt(0.96) * S, S * 0.04, 20]} />
        {mat}
      </mesh>
      <mesh position={[0.5 * S + 0.001, 0, 0]} rotation-y={Math.PI / 2}>
        <circleGeometry args={[radiusAt(1) * S * 0.55, 18]} />
        <meshBasicMaterial color="#1a1208" />
      </mesh>
      {/* the cascabel knob at the breech */}
      <mesh position={[-0.53 * S, 0, 0]} castShadow>
        <sphereGeometry args={[S * 0.035, 14, 10]} />
        {mat}
      </mesh>
      {/* the lifting handles on top */}
      {[-0.1, 0.12].map((u) => (
        <mesh key={u} position={[u * S, radiusAt(0.45) * S, 0]} castShadow>
          <torusGeometry args={[S * 0.025, S * 0.008, 6, 12, Math.PI]} />
          {mat}
        </mesh>
      ))}
    </group>
  );
};

/** the cover: a giant mould on the land, half knocked off at frame 0; the bronze still pours into its head; a giant mallet
 *  knocks the clay off toward the muzzle, the fresh bronze glowing and cooling. In the payoff it stands again, gilded. */
export const GiantCannon: React.FC<{t: number}> = ({t}) => {
  const ck = coverK(t);
  const bk = callbackK(t);
  if (ck < 0.02 && bk < 0.02) return null;
  const S = CANNON_S;
  const back = bk > 0.02 && ck < 0.02;
  const k = back ? bk : ck;
  const front = back ? 1 : shellFront(t);
  const lift = radiusAt(0.1) * S * 1.15;
  const PIECES = 14;
  const pour = !back && t < POUR_END + 0.3;
  const pourK = Math.max(0, 1 - Math.max(0, t - POUR_END) / 0.3);
  // the mallet strikes every 0.36 s at the shell's edge
  const ph = (t % 0.36) / 0.36;
  const swing = ph < 0.25 ? 1 - ph / 0.25 : (ph - 0.25) / 0.75;
  const edgeX = (front - 0.5) * S;
  return (
    <group position={[CANNON_AT[0], 0, CANNON_AT[1]]} rotation-y={0.18} scale={[k, k, k]}>
      {/* legend scale: the giant is drawn 1.25x stouter than the town's guns so it reads on the whole tile */}
      <group position={[0, lift * FAT, 0]} scale={[1, FAT, FAT]}>
        {/* the bronze under the clay: hot where it was just bared, cooling to bronze */}
        <Barrel S={S} gild={back} hotAt={back ? undefined : (u) => (u < front ? Math.max(0, 1 - (front - u) / 0.14) * 0.85 : 0)} />
        {/* the clay shell still on the muzzle end: sections from `front` to the muzzle */}
        {!back &&
          Array.from({length: PIECES}, (_, i) => {
            const u0 = i / PIECES;
            const u1 = (i + 1) / PIECES;
            if (u1 <= front - 0.08) return null;
            // a section just passed by the front falls away and tumbles
            const fall = clamp((front - u0) / 0.08, 0, 1);
            const r = Math.max(radiusAt(u0), radiusAt(u1)) * S * 1.28;
            return (
              <group key={i} position={[(u0 + u1 - 1) * 0.5 * S, -fall * lift * 0.9, fall * S * 0.05 * (i % 2 ? 1 : -1)]} rotation-x={fall * (i % 2 ? 0.9 : -0.9)}>
                <mesh rotation-z={Math.PI / 2} castShadow receiveShadow>
                  <cylinderGeometry args={[r, r, S / PIECES + 0.02, 16, 1, false, 0, Math.PI * (2 - fall)]} />
                  <meshStandardMaterial color={CLAY} roughness={1} side={THREE.DoubleSide} />
                </mesh>
              </group>
            );
          })}
        {/* the funnel at the mould's head (the muzzle end) and the stream of bronze into it */}
        {!back && (
          <group position={[0.53 * S, radiusAt(1) * S * 1.3, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[S * 0.05, S * 0.025, S * 0.06, 14]} />
              <meshStandardMaterial color={CLAY} roughness={1} />
            </mesh>
            {pour && pourK > 0.02 && (
              <mesh position={[0, S * 0.12, 0]} scale={[pourK, 1, pourK]}>
                <cylinderGeometry args={[S * 0.02, S * 0.026, S * 0.2, 10]} />
                <meshBasicMaterial color="#ffb347" toneMapped={false} />
              </mesh>
            )}
          </group>
        )}
        {/* the crucible tipping over the funnel */}
        {!back && t < POUR_END + 1.2 && (
          <group position={[0.53 * S + S * 0.06, radiusAt(1) * S + S * 0.27, 0]} rotation-z={0.9 + Math.min(t, POUR_END) * 0.25}>
            <mesh castShadow>
              <cylinderGeometry args={[S * 0.07, S * 0.05, S * 0.12, 16]} />
              <meshStandardMaterial color="#4a3a30" roughness={0.9} />
            </mesh>
            <mesh position={[0, S * 0.055, 0]} rotation-x={-Math.PI / 2}>
              <circleGeometry args={[S * 0.062, 16]} />
              <meshBasicMaterial color="#ffa040" toneMapped={false} />
            </mesh>
          </group>
        )}
        {/* the mallet knocking the clay off at the shell's edge, with a puff of clay dust at each blow */}
        {!back && front < 0.995 && (
          <group position={[edgeX, radiusAt(front) * S * 1.3, S * 0.02]}>
            {/* pivots at the far end of its handle (up and toward the muzzle); the head comes down on the clay */}
            <group position={[S * 0.16, S * 0.3, 0]} rotation-z={-0.2 - swing * 0.9}>
              <mesh position={[-S * 0.13, -S * 0.13, 0]} rotation-z={Math.PI / 4}>
                <cylinderGeometry args={[S * 0.01, S * 0.01, S * 0.37, 8]} />
                <meshStandardMaterial color="#6b4325" roughness={0.8} />
              </mesh>
              <mesh position={[-S * 0.26, -S * 0.26, 0]} rotation-x={Math.PI / 2} castShadow>
                <cylinderGeometry args={[S * 0.045, S * 0.045, S * 0.12, 12]} />
                <meshStandardMaterial color="#5a3a22" roughness={0.8} />
              </mesh>
            </group>
            <Puff u={ph < 0.6 ? ph / 0.6 : -1} seed={Math.floor(t / 0.36)} S={S * 0.12} color="#d9a07a" n={7} />
          </group>
        )}
      </group>
      {/* the carriage the gilded gun stands on in the payoff */}
      {back && (
        <group>
          {[-0.25, 0.2].map((u) => (
            <Box key={u} p={[u * S, lift * 0.45, 0]} s={[S * 0.07, lift * 0.9, S * 0.16]} c="#6b4325" />
          ))}
          <Box p={[0, lift * 0.06, 0]} s={[S * 0.75, lift * 0.12, S * 0.2]} c="#5a3a22" />
        </group>
      )}
    </group>
  );
};
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const FAT = 1.25;

// ------------------------------------------------------------------ Kru Se: the mosque, the tomb, the palace
/** Krue Se mosque: red brick, pointed arches along its sides, no dome (only the drum it never got) */
const KrueSe: React.FC = () => (
  <group position={[KRUESE[0], 0, KRUESE[1]]} scale={1.25}>
    <Box p={[0, 0.08, 0]} s={[1.9, 0.16, 1.3]} c="#b9a58a" />
    {/* the walls as piers between arches */}
    {[-1, 1].map((s) =>
      Array.from({length: 6}, (_, i) => <Box key={`${s}${i}`} p={[-0.8 + i * 0.32, 0.5, s * 0.55]} s={[0.12, 0.7, 0.14]} c="#a34a2c" />),
    )}
    {[-1, 1].map((s) =>
      Array.from({length: 4}, (_, i) => <Box key={`e${s}${i}`} p={[s * 0.86, 0.5, -0.45 + i * 0.3]} s={[0.14, 0.7, 0.12]} c="#a34a2c" />),
    )}
    {/* the pointed arch heads above the openings */}
    {[-1, 1].map((s) =>
      Array.from({length: 5}, (_, i) => (
        <mesh key={`a${s}${i}`} position={[-0.64 + i * 0.32, 0.92, s * 0.55]} castShadow>
          <coneGeometry args={[0.17, 0.26, 4]} />
          <meshStandardMaterial color="#a34a2c" roughness={0.95} />
        </mesh>
      )),
    )}
    <Box p={[0, 1.06, 0]} s={[1.8, 0.1, 1.24]} c="#93432a" />
    {/* the unfinished drum where the dome would stand */}
    <mesh position={[0, 1.2, 0]} castShadow>
      <cylinderGeometry args={[0.36, 0.4, 0.2, 16, 1, true]} />
      <meshStandardMaterial color="#8f3f26" roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
  </group>
);
/** Lim Ko Niao's tomb beside the mosque: a small white Chinese grave with a horseshoe wall */
const Tomb: React.FC = () => (
  <group position={[TOMB[0], 0, TOMB[1]]} scale={0.8}>
    <mesh position={[0, 0.12, 0]} rotation-y={Math.PI} castShadow>
      <torusGeometry args={[0.32, 0.07, 6, 14, Math.PI]} />
      <meshStandardMaterial color="#efe8d8" />
    </mesh>
    <mesh position={[0, 0.1, 0.05]} scale={[1, 0.5, 0.8]} castShadow>
      <sphereGeometry args={[0.22, 12, 8]} />
      <meshStandardMaterial color="#e2dccc" />
    </mesh>
    <Box p={[0, 0.2, -0.2]} s={[0.22, 0.32, 0.06]} c="#b0382a" />
  </group>
);
/** a Malay house of the court: on posts, a tall gable roof (a ridge box and two slopes) */
const GableHouse: React.FC<{w: number; l: number; c?: string; roof?: string}> = ({w, l, c = '#8a6040', roof = '#6a4a30'}) => (
  <group>
    {[-1, 1].map((sx) => [-1, 1].map((sz) => <Box key={`${sx}${sz}`} p={[sx * w * 0.4, 0.2, sz * l * 0.4]} s={[0.08, 0.4, 0.08]} c="#4a3220" />))}
    <Box p={[0, 0.6, 0]} s={[w, 0.4, l]} c={c} />
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * w * 0.28, 1.05, 0]} rotation-z={s * -0.85} castShadow>
        <boxGeometry args={[0.06, w * 0.78, l * 1.08]} />
        <meshStandardMaterial color={roof} roughness={0.95} />
      </mesh>
    ))}
  </group>
);
/** the queens' palace at Kru Se and its stockade; after Kru Se is left it sinks to a ruin */
const Istana: React.FC<{Y: number}> = ({Y}) => {
  const ruin = clamp((Y - 1800) / 60, 0, 1);
  return (
    <group position={[ISTANA[0], 0, ISTANA[1]]}>
      <group scale={[1.4, 1.4 * (1 - 0.85 * ruin), 1.4]}>
        <GableHouse w={1.2} l={1.8} c="#7a5236" roof="#5a3e28" />
        <group position={[1.4, 0, 0.6]}>
          <GableHouse w={0.8} l={1.0} />
        </group>
      </group>
      {ruin < 0.9 &&
        Array.from({length: 26}, (_, i) => {
          const a = (i / 26) * Math.PI * 2;
          if (i === 6 || i === 7) return null; // the gate, toward the haul road (south-east)
          return <Box key={i} p={[0.5 + Math.cos(a) * 2.5, 0.3 * (1 - ruin), 0.3 + Math.sin(a) * 1.9]} s={[0.12, 0.6 * (1 - ruin) + 0.02, 0.12]} c="#5a3a22" />;
        })}
    </group>
  );
};

// ------------------------------------------------------------------ cast: the moulds in their pits, the furnace, the smiths
const Cast: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y > 1600 || t > 10) return null;
  const bare = bareK(t, Y);
  return (
    <group>
      {/* the pit ground */}
      <mesh position={[PITS[0], 0.03, PITS[1] + 0.2]} receiveShadow>
        <boxGeometry args={[5.4, 0.04, 2.6]} />
        <meshStandardMaterial color="#8a6a4a" roughness={1} />
      </mesh>
      {MOULDS.map(([x, z], j) => {
        const pk = pourK(j, t);
        const S = j === 1 ? 2.2 : 1.6;
        return (
          <group key={j} position={[x, 0.22, z]} rotation-y={Math.PI / 2}>
            <Barrel S={S} hot={pk * (1 - bare) * 0.9} />
            {bare < 0.98 && (
              <mesh rotation-z={Math.PI / 2} scale={[1, 1, 1]} castShadow>
                <cylinderGeometry args={[S * 0.09, S * 0.08, S * 1.05, 14, 1, false, 0, Math.PI * 2 * (1 - bare)]} />
                <meshStandardMaterial color={CLAY} roughness={1} side={THREE.DoubleSide} />
              </mesh>
            )}
            {pk > 0.02 && pk < 0.98 && (
              <mesh position={[S * 0.55, S * 0.25, 0]}>
                <cylinderGeometry args={[0.04, 0.05, S * 0.4, 8]} />
                <meshBasicMaterial color="#ffb347" toneMapped={false} />
              </mesh>
            )}
          </group>
        );
      })}
      {/* the furnace: a brick kiln glowing at its mouth, smoke above */}
      <group position={[FURNACE_AT[0], 0, FURNACE_AT[1]]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.55, 0.9, 12]} />
          <meshStandardMaterial color="#8e4a32" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.3, 0.5]}>
          <boxGeometry args={[0.3, 0.25, 0.08]} />
          <meshBasicMaterial color="#ff8a2a" toneMapped={false} />
        </mesh>
        <group position={[0, 1.0, 0]}>
          <Puff u={(t * 0.8) % 1} seed={Math.floor(t * 0.8)} S={1.2} color="#bdb2a6" n={6} up={1.2} />
        </group>
      </group>
      {/* the founder in a Chinese robe and hat */}
      <group position={[FOUNDER_AT[0], 0, FOUNDER_AT[1]]} rotation-y={1.2} scale={0.46}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.32, 1.4, 10]} />
          <meshStandardMaterial color="#2c3f6a" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.15, 10, 8]} />
          <meshStandardMaterial color="#d8a77a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.78, 0]}>
          <coneGeometry args={[0.3, 0.16, 12]} />
          <meshStandardMaterial color="#1c1c1c" />
        </mesh>
      </group>
      {Array.from({length: SMITHS}, (_, i) => {
        const [x, z] = smithAt(i, t);
        return (
          <group key={i} position={[x, 0, z]} rotation-y={i * 1.7} scale={0.42}>
            <Walker step={t * 1.4 + i * 0.3} i={i} load={i % 3 === 0} still={i % 3 === 1} />
          </group>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ the guns: hauled, at the gate, taken
const Guns: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const h = haulAt(t, Y);
  const tk = takeAt(t);
  const big = Y < 1590 ? null : tk ? tk : gateGunsK(t, Y) > 0 ? h : null;
  const sal = salute(t);
  const rot = (p: {rot: number}) => p.rot - Math.PI / 2;
  return (
    <group>
      {/* the big gun on its rollers */}
      {Y >= 1589.5 && Y < 1602 && t > 8 && t < 15 && (
        <group position={[h.x, 0.25, h.z]} rotation-y={rot(h)}>
          <Barrel S={3.2} />
          {[-1.0, 0, 1.0].map((u) => (
            <mesh key={u} position={[u, -0.15, 0]} rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
              <meshStandardMaterial color="#6b4325" />
            </mesh>
          ))}
          <group position={[1.7, 0, 0]}>
            <Puff u={sal} seed={3} S={2.2} color="#e9e4dc" n={12} up={0.3} />
          </group>
        </group>
      )}
      {/* the ropes and the haulers */}
      {Y >= 1589.5 && Y < 1602 && t > 8 && t < 15 &&
        Array.from({length: HAULERS}, (_, i) => {
          const p = haulerAt(i, t, Y);
          return (
            <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.42}>
              <Walker step={t * 1.3 + i * 0.37} i={i} still={salute(t) > 0} />
            </group>
          );
        })}
      {/* at the gate: the big gun and its two smaller sisters, until the taken beat */}
      {big && Y >= 1601.5 && !tk && (
        <group position={[h.x, 0.25, h.z]} rotation-y={rot(h)}>
          <Barrel S={3.2} />
        </group>
      )}
      {gateGunsK(t, Y) > 0 &&
        Y >= 1590 &&
        [-1, 1].map((s) => (
          <group key={s} position={[h.x + s * 0.9, 0.2, h.z + 0.5]} rotation-y={rot(h)}>
            <Barrel S={1.6} />
          </group>
        ))}
      {/* taken: dragged to the landing by the crew */}
      {tk && t < 27 && (
        <group>
          <group position={[tk.x, 0.25, tk.z]} rotation-y={rot(tk)}>
            <Barrel S={3.2} />
          </group>
          {Array.from({length: TAKE_CREW}, (_, i) => {
            const s = i % 2 ? 1 : -1;
            const back = 1.4 + Math.floor(i / 2) * 0.35;
            return (
              <group key={i} position={[tk.x + Math.sin(tk.rot) * back + Math.cos(tk.rot) * s * 0.3, 0, tk.z + Math.cos(tk.rot) * back - Math.sin(tk.rot) * s * 0.3]} rotation-y={tk.rot} scale={0.42}>
                <Walker step={t * 1.3 + i * 0.4} i={i + 4} />
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ ships
/** a junk (สำเภา), ~2.4 long, bow toward +z */
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
      </group>
    ))}
  </group>
);
/** a Dutch or English ship: a dark hull, a high stern, three masts of square white sails, a flag */
const Ship: React.FC<{flag: string}> = ({flag}) => (
  <group>
    <Box p={[0, 0.22, 0]} s={[0.8, 0.4, 2.4]} c="#3e2a1c" />
    <Box p={[0, 0.5, -1.0]} s={[0.76, 0.4, 0.5]} c="#5a3a22" />
    {[[0.7, 1.6], [0, 2.0], [-0.65, 1.5]].map(([z, h], k) => (
      <group key={k} position={[0, 0.4, z]}>
        <mesh position={[0, h / 2, 0]}>
          <cylinderGeometry args={[0.035, 0.035, h, 5]} />
          <meshStandardMaterial color="#2a1c10" />
        </mesh>
        {[0.45, 0.75].map((v) => (
          <mesh key={v} position={[0, h * v, 0.03]}>
            <planeGeometry args={[0.95 - v * 0.4, h * 0.26]} />
            <meshStandardMaterial color="#f2ece0" side={THREE.DoubleSide} roughness={0.9} />
          </mesh>
        ))}
        {k === 1 && (
          <mesh position={[0.18, h + 0.1, 0]}>
            <planeGeometry args={[0.36, 0.2]} />
            <meshBasicMaterial color={flag} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        )}
      </group>
    ))}
  </group>
);
const Port: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {Array.from({length: SHIPS}, (_, i) => {
      const p = shipAt(i, t, Y);
      if (!p) return null;
      return (
        <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={1.1}>
          {i % 2 === 0 ? <Ship flag={SHIP_FLAGS[i]} /> : <Junk sail={i === 1 ? '#b5542e' : '#d9c39a'} />}
        </group>
      );
    })}
    {Y > 1600 && Y < 1700 &&
      Array.from({length: PORTERS}, (_, i) => {
        const [x, z] = porterAt(i, t);
        return (
          <group key={i} position={[x, 0, z]} rotation-y={i % 2 ? 0.6 : -2.5} scale={0.42}>
            <Walker step={t * 1.5 + i * 0.3} i={i} load />
          </group>
        );
      })}
  </group>
);
/** the jetty at the landing: a short wooden pier into the bay */
const Jetty: React.FC = () => (
  <group position={[LANDING[0] - 0.2, 0, LANDING[1] - 1.0]} rotation-y={0.35}>
    <Box p={[0, 0.16, 0]} s={[0.5, 0.06, 2.0]} c="#7a5a3a" />
    {[-0.8, 0, 0.8].map((z) => [-1, 1].map((s) => <Box key={`${z}${s}`} p={[s * 0.22, 0.05, z]} s={[0.07, 0.3, 0.07]} c="#4a3220" />))}
  </group>
);
const Taken: React.FC<{t: number}> = ({t}) => {
  const s = takeShipAt(t);
  const sp = splashK(t);
  return (
    <group>
      {s && t > 20 && t < 28 && (
        <group position={[s.x, 0, s.z]} rotation-y={s.rot} scale={1.15}>
          <Junk sail="#c9b28a" />
          {s.loaded && (
            <group position={[0, 0.55, 0]} rotation-y={Math.PI / 2}>
              <Barrel S={1.6} />
            </group>
          )}
        </group>
      )}
      <group position={[LANDING[0] - 0.9, 0.1, LANDING[1] - 1.6]}>
        <Puff u={sp} seed={9} S={2.4} color="#ffffff" n={14} up={0.9} />
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ the new town: boats, the palace, Anoru, the shrine
const Sampan: React.FC = () => (
  <group>
    <Box p={[0, 0.1, 0]} s={[0.28, 0.16, 1.0]} c="#6b452a" />
    <mesh position={[0, 0.25, -0.1]} rotation-z={Math.PI / 2}>
      <cylinderGeometry args={[0.16, 0.16, 0.3, 8, 1, true, 0, Math.PI]} />
      <meshStandardMaterial color="#c9b28a" side={THREE.DoubleSide} />
    </mesh>
  </group>
);
const Shophouse: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <Box p={[0, 0.45, 0]} s={[1.6, 0.9, 0.7]} c={i % 2 ? '#e8dcc0' : '#d9c7a4'} />
      <HipRoof w={1.7} l={0.8} h={0.3} y={0.9} color={i % 3 ? '#a4502e' : '#8a3a24'} />
      {[-0.5, 0, 0.5].map((x) => (
        <Box key={x} p={[x, 0.3, 0.36]} s={[0.3, 0.4, 0.02]} c="#3a5a6a" />
      ))}
    </group>
  );
/** the Lim Ko Niao shrine (ศาลเจ้าเล่งจูเกียง): red walls, a green-tiled roof with upturned ends, gold ridge */
const ChineseShrine: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1.2, 1.2 * k, 1.2]}>
      <Box p={[0, 0.1, 0]} s={[1.4, 0.2, 1.1]} c="#d8cfbd" />
      <Box p={[0, 0.5, 0]} s={[1.1, 0.6, 0.8]} c="#b8241c" />
      <HipRoof w={1.4} l={1.05} h={0.36} y={0.8} color="#2f7a52" />
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.7, 1.05, 0]} rotation-z={s * 0.6}>
          <coneGeometry args={[0.05, 0.25, 5]} />
          <meshStandardMaterial color="#d9a521" metalness={0.5} />
        </mesh>
      ))}
      <Box p={[0, 1.15, 0]} s={[0.9, 0.06, 0.06]} c="#d9a521" />
    </group>
  );
const NewTown: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {t > 25 && t < 34 &&
      Array.from({length: BOATS}, (_, i) => {
        const p = boatAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.9}>
            <Sampan />
          </group>
        ) : null;
      })}
    {/* the governor's palace at Chabang Tiga */}
    {palaceK(t, Y) > 0.02 && (
      <group position={[CHABANG_TIGA[0], 0, CHABANG_TIGA[1]]} scale={[1.5, 1.5 * palaceK(t, Y), 1.5]}>
        <GableHouse w={1.3} l={2.0} c="#e6dcc6" roof="#7a3a26" />
        <group position={[1.5, 0, 0.4]}>
          <GableHouse w={0.9} l={1.2} c="#e6dcc6" roof="#7a3a26" />
        </group>
      </group>
    )}
    {SHOPS.map(([x, z], j) => (
      <group key={j} position={[x, 0, z]} rotation-y={j % 2 ? 0.3 : -0.2}>
        <Shophouse k={shopK(j, t, Y)} i={j} />
      </group>
    ))}
    <group position={[SHRINE[0], 0, SHRINE[1]]} rotation-y={0.4}>
      <ChineseShrine k={shrineK(t, Y)} />
    </group>
  </group>
);

// ------------------------------------------------------------------ the Dechanuchit bridge: a steel truss over the river
const BRIDGE_R = -Math.atan2(BRIDGE_DIR[1], BRIDGE_DIR[0]);
const Truss: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = bridgeK(t, Y);
  if (k < 0.02) return null;
  const L = 2.2;
  const H = 0.55;
  const n = 6;
  return (
    <group position={[DECHA_BRIDGE[0], 0, DECHA_BRIDGE[1]]} rotation-y={BRIDGE_R}>
      <Box p={[0, 0.3, 0]} s={[L * Math.min(1, k * 1.6), 0.08, 0.6]} c="#8d8d86" />
      {k > 0.4 &&
        [-1, 1].map((s) => (
          <group key={s} position={[0, 0.34, s * 0.3]} scale={[1, (k - 0.4) / 0.6, 1]}>
            <Box p={[0, H, 0]} s={[L * 0.8, 0.05, 0.05]} c="#5e6a72" />
            {Array.from({length: n + 1}, (_, i) => (
              <Box key={i} p={[(-0.5 + i / n) * L * 0.8, H / 2, 0]} s={[0.04, H, 0.04]} c="#5e6a72" />
            ))}
            {Array.from({length: n}, (_, i) => (
              <mesh key={`d${i}`} position={[(-0.5 + (i + 0.5) / n) * L * 0.8, H / 2, 0]} rotation-z={i % 2 ? 0.75 : -0.75}>
                <boxGeometry args={[0.03, H * 1.25, 0.03]} />
                <meshStandardMaterial color="#5e6a72" />
              </mesh>
            ))}
          </group>
        ))}
      {Array.from({length: CARTS}, (_, i) => {
        const p = crossAt(i, t);
        if (!p) return null;
        const u = (p[0] - DECHA_BRIDGE[0]) / BRIDGE_DIR[0];
        return (
          <group key={i} position={[u, 0.34, (i - 1) * 0.12]} rotation-y={Math.PI / 2} scale={0.32}>
            <Walker step={t * 1.6 + i} i={i} load={i === 1} />
          </group>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ the Central Mosque: green dome, four small domes, minarets
const Dome: React.FC<{r: number; c: string; glow: number}> = ({r, c, glow}) => (
  <group>
    <mesh position={[0, 0, 0]} scale={[1, 1.15, 1]} castShadow>
      <sphereGeometry args={[r, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={c} roughness={0.4} metalness={0.25} emissive={glow > 0.02 ? '#8ff0b0' : '#000000'} emissiveIntensity={glow * 0.35} />
    </mesh>
    <mesh position={[0, r * 1.2, 0]}>
      <coneGeometry args={[r * 0.08, r * 0.4, 6]} />
      <meshStandardMaterial color="#d9a521" metalness={0.6} roughness={0.35} />
    </mesh>
  </group>
);
const Minaret: React.FC<{h: number; glow: number}> = ({h, glow}) => (
  <group>
    <mesh position={[0, h / 2, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.13, h, 10]} />
      <meshStandardMaterial color="#f1ece0" roughness={0.6} />
    </mesh>
    <mesh position={[0, h * 0.78, 0]}>
      <cylinderGeometry args={[0.18, 0.18, 0.06, 12]} />
      <meshStandardMaterial color="#e2dccc" />
    </mesh>
    {glow > 0.05 && (
      <mesh position={[0, h * 0.82, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.12, 10]} />
        <meshBasicMaterial color="#fff2c0" toneMapped={false} />
      </mesh>
    )}
    <group position={[0, h, 0]}>
      <Dome r={0.12} c="#2f8a5a" glow={glow} />
    </group>
  </group>
);
const CentralMosque: React.FC<{t: number; Y: number; night: number}> = ({t, Y, night}) => {
  const k = mosqueK(t, Y);
  if (k < 0.02) return null;
  // the two later minarets on the extended wings come with the modern town
  const four = Y > 2005;
  const glow = night > 0.3 ? night : 0;
  return (
    <group position={[CENTRAL_MOSQUE[0], 0, CENTRAL_MOSQUE[1]]} rotation-y={-Math.PI / 2} scale={1.7}>
      <group scale={[1, k, 1]}>
        <Box p={[0, 0.08, 0]} s={[3.0, 0.16, 2.4]} c="#e8e2d2" />
        <Box p={[0, 0.6, 0]} s={[2.0, 0.9, 1.6]} c="#f4efe2" />
        {/* the arched windows, lit at night */}
        {[-1, 1].map((s) =>
          [-0.6, -0.2, 0.2, 0.6].map((x) => (
            <mesh key={`${s}${x}`} position={[x, 0.6, s * 0.805]}>
              <planeGeometry args={[0.18, 0.4]} />
              {glow > 0.05 ? <meshBasicMaterial color="#ffe3a0" toneMapped={false} side={THREE.DoubleSide} /> : <meshStandardMaterial color="#3a5a5a" side={THREE.DoubleSide} />}
            </mesh>
          )),
        )}
        <group position={[0, 1.05, 0]}>
          <Dome r={0.72} c="#2f8a5a" glow={glow} />
        </group>
        {[-1, 1].map((sx) =>
          [-1, 1].map((sz) => (
            <group key={`${sx}${sz}`} position={[sx * 0.8, 1.05, sz * 0.6]}>
              <Dome r={0.24} c="#2f8a5a" glow={glow} />
            </group>
          )),
        )}
        {[-1, 1].map((s) => (
          <group key={s} position={[1.25, 0, s * 0.9]}>
            <Minaret h={3.0} glow={glow} />
          </group>
        ))}
        {four &&
          [-1, 1].map((s) => (
            <group key={`w${s}`} position={[-1.3, 0, s * 1.0]}>
              <Minaret h={2.6} glow={glow} />
            </group>
          ))}
      </group>
      {/* the long pool in front of the facade */}
      <mesh position={[2.0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.0, 0.05, 0.7 * k]} />
        <meshStandardMaterial color="#3f8fc0" roughness={0.15} metalness={0.3} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ the payoff: the procession wades across the river
const Palanquin: React.FC<{c: string}> = ({c}) => (
  <group>
    <Box p={[0, 1.65, 0]} s={[0.55, 0.06, 1.3]} c="#6b3a1a" />
    <Box p={[0, 1.95, 0]} s={[0.45, 0.5, 0.45]} c={c} />
    <mesh position={[0, 2.3, 0]}>
      <coneGeometry args={[0.38, 0.3, 4]} />
      <meshStandardMaterial color="#d9a521" metalness={0.5} roughness={0.35} />
    </mesh>
  </group>
);
const PAL_COLORS = ['#c8102e', '#e0a800', '#c8102e'];
const Fair: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = fairK(t, Y);
  if (k < 0.02 || t < 44 || t > 54.6) return null;
  return (
    <group>
      {Array.from({length: PROC_N}, (_, i) => {
        const p = procAt(i, t);
        if (!p) return null;
        const wet = p.wet ? 0.18 : 0;
        const bearer = i >= 2 && i < 2 + PALANQUINS * 4;
        const pal = bearer && (i - 2) % 4 === 0 ? Math.floor((i - 2) / 4) : -1;
        return (
          <group key={i} position={[p.x, -wet, p.z]} rotation-y={p.rot} scale={0.42}>
            {i < 2 ? (
              // the lion dance at the head: a long yellow and red body
              <group>
                <Walker step={t * 2 + i} i={i} />
                <Box p={[0, 1.35, 0.2]} s={[0.5, 0.45, 0.9]} c={i ? '#e0a800' : '#c8102e'} />
              </group>
            ) : (
              <Walker step={t * 1.4 + i * 0.3} i={i + 2} />
            )}
            {pal >= 0 && (
              <group position={[0, 0, -0.3]}>
                <Palanquin c={PAL_COLORS[pal]} />
              </group>
            )}
            {p.wet && (
              <group position={[0, 0.3, 0]}>
                <Puff u={(t * 2 + i * 0.37) % 1} seed={i + Math.floor(t * 2)} S={1.6} color="#e8f6ff" n={5} up={0.4} />
              </group>
            )}
          </group>
        );
      })}
      {CROWD.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]} rotation-y={x > 0 ? -1.9 : 1.6} scale={0.42 * k}>
          <Walker step={t + i} i={i + 5} still />
        </group>
      ))}
    </group>
  );
};

export const PattaniLandmarks: React.FC<LandmarkProps> = ({Y, t, night}) => (
  <group>
    <FlatWater shape={SEA_SHAPE} />
    <FlatWater shape={SEA_NE_SHAPE} />
    <GiantCannon t={t} />
    <KrueSe />
    <Tomb />
    <Istana Y={Y} />
    <Jetty />
    <Cast t={t} Y={Y} />
    <Guns t={t} Y={Y} />
    <Port t={t} Y={Y} />
    <Taken t={t} />
    <NewTown t={t} Y={Y} />
    <Truss t={t} Y={Y} />
    <CentralMosque t={t} Y={Y} night={night} />
    <Fair t={t} Y={Y} />
  </group>
);
export {HAUL_PATH};
