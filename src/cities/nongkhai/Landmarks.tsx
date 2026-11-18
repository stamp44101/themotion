import React from 'react';
import * as THREE from 'three';
import type {LandmarkProps} from '../../engine/types';
import {HipRoof, lathe} from '../../engine/parts';
import {Cart, Walker} from '../nan/figures';
import {Chips, LongBoat} from './Boat';
import {
  BANK_CROWD, BOAT_ROT, beatK, BRIDGE_CARS, BRIDGE_LEN, CARS, CAR_LEN, CARTS, COLUMNS, FIREBALLS, FOUND_HOUSES, HAW_BOATS,
  KHAMYAT_LEN, RACE_BOAT_LEN, RACE_LANES, RANKS, SIM_AT, STATUES, TENTS, WALKERS, WATCHERS, adzeAt, along, bridgeCarAt,
  brokenK, carveFront, cartAt, coverK, fallK, fireballAt, foundHouseK, hawBoatAt, headK, khamyatAt, lengthOf, monumentK,
  raceAt, railK, SIM_ROT, STATION_AT, STATION_ROT, saiCarryAt, saiCartAt, saiHomeK, sermAt, simK, soldierAt, spanK, spitK, stationK, statueK, tentsK,
  trainAt, walkerAt,
} from './actors';
import {BOAT_AT, BOAT_S, BRIDGE, MEKONG, PRAPHO, RAIL, SPIT, THAT} from './places';

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const WATER = '#4f8f9e';
const SAND = '#c9b48a';

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; r?: number}> = ({p, s, c, r = 0}) => (
  <mesh position={p} rotation-y={r} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={0.85} />
  </mesh>
);

/** a flat shape from a polygon in world x/z */
const shapeOf = (pts: [number, number][]) => {
  const sh = new THREE.Shape();
  pts.forEach(([x, z], i) => (i === 0 ? sh.moveTo(x, -z) : sh.lineTo(x, -z)));
  sh.closePath();
  return sh;
};
const Flat: React.FC<{shape: THREE.Shape; top?: number; depth?: number; color: string; rough?: number; metal?: number}> = ({
  shape,
  top = 0.1,
  depth = 1.4,
  color,
  rough = 0.12,
  metal = 0.25,
}) => (
  <mesh position={[0, top - depth, 0]} rotation-x={-Math.PI / 2} receiveShadow>
    <extrudeGeometry args={[shape, {depth, bevelEnabled: false}]} />
    <meshStandardMaterial color={color} roughness={rough} metalness={metal} />
  </mesh>
);
const MEKONG_SHAPE = shapeOf(MEKONG);
const SPIT_SHAPE = shapeOf(SPIT);

// ------------------------------------------------------------------ the cover: the long boat carved on the bank
const Cover: React.FC<{t: number}> = ({t}) => {
  const k = coverK(t);
  if (k < 0.02) return null;
  const front = carveFront(t);
  const [ax, az] = adzeAt(t);
  // a chip burst every 0.18 s at the adze front while it runs
  const ph = (t / 0.18) % 1;
  return (
    <group>
      <group position={[BOAT_AT[0], 0, BOAT_AT[1]]} rotation-y={BOAT_ROT} scale={[k, k, k]}>
        <LongBoat L={BOAT_S} front={front} head={headK(t)} t={t} />
      </group>
      {t < 2.1 && (
        <group position={[ax, BOAT_S * 0.06, az]}>
          <Chips u={ph} seed={Math.floor(t / 0.18)} S={BOAT_S * 0.12} n={12} />
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ houses and temples
/** a Lao house on stilts with a steep hip roof (drawn x1.4 so it reads in the close shots) */
const StiltHouse: React.FC<{k: number; i: number}> = ({k, i}) =>
  k < 0.02 ? null : (
    <group scale={[1.4, 1.4 * k, 1.4]}>
      {[-0.3, 0.3].map((x) => [-0.3, 0.3].map((z) => <Box key={`${x}${z}`} p={[x, 0.2, z]} s={[0.08, 0.4, 0.08]} c="#5b3b22" />))}
      <Box p={[0, 0.6, 0]} s={[0.8, 0.4, 0.8]} c={i % 2 ? '#8a6040' : '#7a5236'} />
      <HipRoof w={0.95} l={0.95} h={0.5} y={0.8} color="#5a4636" />
    </group>
  );
/** Wat Pho Chai's sim: white walls, a tiered red-orange roof, a gilded finial; drawn x1.4 */
const Sim: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1.4, 1.4 * k, 1.4]}>
      <Box p={[0, 0.1, 0]} s={[1.4, 0.2, 2.3]} c="#e7e0cf" />
      <Box p={[0, 0.5, 0]} s={[1.05, 0.6, 1.95]} c="#f4efe2" />
      <HipRoof w={1.35} l={2.25} h={0.5} y={0.8} color="#b9471f" />
      <HipRoof w={0.95} l={1.6} h={0.45} y={1.15} color="#c8662a" />
      <mesh position={[0, 1.75, 0]}>
        <coneGeometry args={[0.07, 0.35, 6]} />
        <meshStandardMaterial color="#d9a521" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );

/** a small seated Buddha image in gold under a white tiered parasol (Phra Serm / Phra Sai on their carts) */
const BUDDHA = lathe([[0, 0], [0.32, 0], [0.34, 0.08], [0.24, 0.16], [0.2, 0.4], [0.13, 0.5], [0.11, 0.56], [0.12, 0.66], [0.06, 0.74], [0.02, 0.84], [0, 0.86]], 12);
const Image: React.FC<{glow?: number}> = ({glow = 0}) => (
  <group>
    <mesh geometry={BUDDHA} castShadow>
      <meshStandardMaterial color="#e3ae35" metalness={0.65} roughness={0.3} emissive="#f0b030" emissiveIntensity={0.15 + glow} />
    </mesh>
    <mesh position={[0, 1.15, 0]}>
      <cylinderGeometry args={[0.012, 0.012, 0.6, 5]} />
      <meshStandardMaterial color="#d9c9a0" />
    </mesh>
    {[0, 1, 2].map((i) => (
      <mesh key={i} position={[0, 1.18 + i * 0.13, 0]}>
        <coneGeometry args={[0.36 - i * 0.09, 0.08, 14, 1, true]} />
        <meshStandardMaterial color="#f6f2e6" side={2} roughness={0.8} />
      </mesh>
    ))}
  </group>
);

// ------------------------------------------------------------------ settle and found
const Settle: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {t > 2.6 && t < 10 &&
      Array.from({length: CARTS}, (_, i) => {
        const p = cartAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.9}>
            <Cart step={t * 1.4 + i} />
          </group>
        ) : null;
      })}
    {t > 2.6 && t < 10 &&
      Array.from({length: WALKERS}, (_, i) => {
        const p = walkerAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.6}>
            <Walker step={t * 1.6 + i * 0.3} i={i} load={i % 3 === 0} />
          </group>
        ) : null;
      })}
    {FOUND_HOUSES.map(([x, z], j) => (
      <group key={j} position={[x, 0, z]} rotation-y={hash(j) * 0.6 - 0.3}>
        <StiltHouse k={foundHouseK(j, t, Y)} i={j} />
      </group>
    ))}
  </group>
);

const Found: React.FC<{t: number}> = ({t}) => {
  const p = khamyatAt(t);
  const on = t > 8.0 && t < 15.0;
  return (
    <group>
      {p && (
        <group position={[p.x, 0.02, p.z]} rotation-y={p.rot}>
          <LongBoat L={KHAMYAT_LEN} t={t} rowers={9} stroke={t * 1.7} />
          {/* the governor under a red parasol at the stern */}
          <group position={[0, KHAMYAT_LEN * 0.03, -KHAMYAT_LEN * 0.4]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.5, 5]} />
              <meshStandardMaterial color="#d9c9a0" />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.26, 0.1, 12, 1, true]} />
              <meshStandardMaterial color="#c0302a" side={2} />
            </mesh>
          </group>
          {/* the wake */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0.02, -KHAMYAT_LEN * (0.55 + i * 0.18)]} rotation-x={-Math.PI / 2}>
              <ringGeometry args={[0.12 + i * 0.18, 0.2 + i * 0.2, 16, 1, Math.PI * 1.1, Math.PI * 0.8]} />
              <meshBasicMaterial color="#e9f2f2" transparent opacity={0.7 - i * 0.2} toneMapped={false} />
            </mesh>
          ))}
        </group>
      )}
      {on &&
        BANK_CROWD.map(([x, z], i) => (
          <group key={i} position={[x, 0, z]} rotation-y={Math.PI + 0.3} scale={0.42}>
            <Walker step={t * 2 + i * 0.37} i={i} still={i % 3 === 0} />
          </group>
        ))}
    </group>
  );
};

// ------------------------------------------------------------------ Phra That Lahanong and its bank
/** a Lao that: a square base in tiers, a tall four-sided bell drawn as a lathe, a gold spire */
const THAT_BELL = lathe([[0.5, 0], [0.48, 0.2], [0.38, 0.5], [0.32, 0.9], [0.22, 1.35], [0.12, 1.75], [0.05, 2.1], [0, 2.3]], 4);
const That: React.FC = () => (
  <group>
    <Box p={[0, 0.15, 0]} s={[1.5, 0.3, 1.5]} c="#e9e2d0" />
    <Box p={[0, 0.42, 0]} s={[1.2, 0.26, 1.2]} c="#efe9da" />
    <mesh geometry={THAT_BELL} position={[0, 0.55, 0]} rotation-y={Math.PI / 4} scale={[1.45, 1, 1.45]} castShadow>
      <meshStandardMaterial color="#f1ebdc" flatShading roughness={0.8} />
    </mesh>
    <mesh position={[0, 2.95, 0]} castShadow>
      <coneGeometry args={[0.07, 0.5, 6]} />
      <meshStandardMaterial color="#d9a521" metalness={0.6} roughness={0.35} />
    </mesh>
  </group>
);
const Sink: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const s = spitK(t, Y);
  const f = fallK(t, Y);
  const slumping = s > 0.01 && s < 0.99;
  return (
    <group>
      {/* the bank the stupa stood on: sand, sinking under the water as the river eats it */}
      {s > 0.01 && <Flat shape={SPIT_SHAPE} top={0.08 + 0.1 * s - 0.25 * (1 - s)} depth={1.2} color={SAND} rough={0.95} metal={0} />}
      {slumping && (
        <group position={[THAT[0] - 0.6, 0.15, THAT[1] + 0.8]}>
          <Chips u={(t * 2.2) % 1} seed={Math.floor(t * 2.2)} S={1.4} n={10} color="#d8c39b" />
        </group>
      )}
      <group position={[THAT[0], -0.9 * f, THAT[1]]} rotation={[-0.42 * f, 0, 0.3 * f]}>
        <That />
      </group>
      {/* the ring of splash as it goes in */}
      {f > 0.3 && f < 0.98 && (
        <mesh position={[THAT[0], 0.13, THAT[1]]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.6 + f * 1.4, 0.8 + f * 1.6, 28]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8 * (1 - f)} toneMapped={false} />
        </mesh>
      )}
      {t > 14.2 && t < 21 &&
        WATCHERS.map(([x, z], i) => (
          <group key={i} position={[x, 0, z]} rotation-y={Math.PI * 0.8} scale={0.42}>
            <Walker step={0} i={i} still />
          </group>
        ))}
    </group>
  );
};

// ------------------------------------------------------------------ Wat Pho Chai and the legend of Phra Sai's cart
const PraSai: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const serm = sermAt(t);
  const sai = saiCartAt(t);
  const carry = saiCarryAt(t);
  const b = brokenK(t);
  const home = saiHomeK(t, Y);
  return (
    <group>
      <group position={[SIM_AT[0], 0, SIM_AT[1]]} rotation-y={SIM_ROT}>
        <Sim k={simK(Y)} />
      </group>
      {/* Phra Sai in the sim's porch, home again (seen from the river, the sim's north side) */}
      {home > 0.02 && (
        <group position={[SIM_AT[0] - 1.4, 0.2, SIM_AT[1] - 0.9]} scale={0.9 * home}>
          <Image glow={0.2} />
        </group>
      )}
      {serm && (
        <group position={[serm.x, 0, serm.z]} rotation-y={serm.rot} scale={0.75}>
          <Cart step={t * 1.2} />
          <group position={[0, 1.15, -0.9]} scale={0.9}>
            <Image />
          </group>
        </group>
      )}
      {sai && !carry && b < 1.5 && (beatK0(t) < 0.92) && (
        <group position={[sai.x, 0, sai.z]} rotation-y={sai.rot} scale={0.75}>
          {/* the cart tips onto its broken wheel */}
          <group rotation-z={0.32 * b} position={[0, -0.2 * b, 0]}>
            <Cart step={b > 0 ? 0 : t * 1.2} />
            {!carry && saiHomeK(t, Y) < 0.02 && b < 1 && (
              <group position={[0, 1.15, -0.9]} scale={0.9}>
                <Image />
              </group>
            )}
          </group>
          {b > 0.2 && (
            <mesh position={[0.9, 0.08, -0.9]} rotation-x={-Math.PI / 2}>
              <torusGeometry args={[0.45, 0.06, 6, 14, Math.PI * 1.2]} />
              <meshStandardMaterial color="#5a4128" />
            </mesh>
          )}
        </group>
      )}
      {carry && (
        <group position={[carry.x, 0, carry.z]} rotation-y={carry.rot}>
          <Box p={[0, 0.62, 0]} s={[0.5, 0.06, 1.2]} c="#8a5a32" />
          <group position={[0, 0.66, 0]} scale={0.7}>
            <Image glow={0.15} />
          </group>
          {Array.from({length: 6}, (_, i) => (
            <group key={i} position={[(i % 2 ? 0.32 : -0.32), 0, -0.55 + Math.floor(i / 2) * 0.55]} scale={0.4}>
              <Walker step={t * 1.6 + i * 0.5} i={i + 1} />
            </group>
          ))}
        </group>
      )}
      {/* the people round the broken cart */}
      {sai && b > 0.3 && !carry && beatK0(t) < 0.6 &&
        [0, 1, 2, 3].map((i) => (
          <group key={i} position={[sai.x + Math.cos(i * 1.6) * 1.0, 0, sai.z + Math.sin(i * 1.6) * 0.8]} rotation-y={i * 1.6 + Math.PI} scale={0.4}>
            <Walker step={0} i={i + 4} still />
          </group>
        ))}
    </group>
  );
};
const beatK0 = (t: number) => beatK('prasai', t);

// ------------------------------------------------------------------ the Haw wars: the army, its boats, the monument
const Tent: React.FC = () => (
  <mesh position={[0, 0.3, 0]} rotation-y={Math.PI / 4} castShadow>
    <coneGeometry args={[0.55, 0.6, 4]} />
    <meshStandardMaterial color="#efe9d8" flatShading roughness={0.9} />
  </mesh>
);
const Monument: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <Box p={[0, 0.12, 0]} s={[1.4, 0.24, 1.4]} c="#d9d2c0" />
      <Box p={[0, 0.5, 0]} s={[0.9, 0.55, 0.9]} c="#f1ecdf" />
      <mesh position={[0, 1.45, 0]} rotation-y={Math.PI / 4} castShadow>
        <cylinderGeometry args={[0.08, 0.5, 1.4, 4]} />
        <meshStandardMaterial color="#f4f0e4" flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.25, 0]}>
        <coneGeometry args={[0.07, 0.22, 4]} />
        <meshStandardMaterial color="#d9a521" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
const Haw: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {tentsK(t) > 0 && TENTS.map(([x, z], i) => (
      <group key={i} position={[x, 0, z]}>
        <Tent />
      </group>
    ))}
    {t > 25.6 && t < 32.5 &&
      Array.from({length: COLUMNS * RANKS}, (_, j) => {
        const c = j % COLUMNS;
        const r = Math.floor(j / COLUMNS);
        const p = soldierAt(c, r, t);
        return p ? (
          <group key={j} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.42}>
            <Walker step={t * 2 + r * 0.25} i={1} spear />
          </group>
        ) : null;
      })}
    {t > 25.6 && t < 32.5 &&
      Array.from({length: HAW_BOATS}, (_, i) => {
        const p = hawBoatAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0.02, p.z]} rotation-y={p.rot}>
            <LongBoat L={2.2} head={0} front={1} rowers={4} stroke={t * 1.5 + i * 0.3} color="#4a3322" band="#b0261c" />
          </group>
        ) : null;
      })}
    <group position={[PRAPHO[0], 0, PRAPHO[1]]}>
      <Monument k={monumentK(t, Y)} />
    </group>
  </group>
);

// ------------------------------------------------------------------ the railway and the old station
const RAIL_L = lengthOf(RAIL);
const SLEEPERS = Array.from({length: Math.floor(RAIL_L / 0.6)}, (_, i) => along(RAIL, i * 0.6));
const Railway: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (railK(Y) < 1) return null;
  const sk = stationK(t, Y);
  return (
    <group>
      {RAIL.slice(1).map((b, i) => {
        const a = RAIL[i];
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        return (
          <mesh key={i} position={[(a[0] + b[0]) / 2, 0.06, (a[1] + b[1]) / 2]} rotation-y={Math.atan2(b[0] - a[0], b[1] - a[1])} receiveShadow>
            <boxGeometry args={[0.55, 0.08, len + 0.05]} />
            <meshStandardMaterial color="#8b8170" roughness={1} />
          </mesh>
        );
      })}
      {SLEEPERS.map((p, i) => (
        <mesh key={i} position={[p.x, 0.11, p.z]} rotation-y={p.rot}>
          <boxGeometry args={[0.5, 0.03, 0.12]} />
          <meshStandardMaterial color="#5a4632" />
        </mesh>
      ))}
      {/* the station by the river: a long wooden building with a hip roof and a platform */}
      {sk > 0.02 && (
        <group position={[STATION_AT[0], 0, STATION_AT[1]]} rotation-y={STATION_ROT + Math.PI / 2} scale={[1, sk, 1]}>
          <Box p={[0, 0.06, 0]} s={[3.2, 0.12, 0.7]} c="#cfc6b2" />
          <Box p={[0, 0.42, 0]} s={[2.2, 0.56, 0.45]} c="#e9d9b0" />
          <HipRoof w={2.5} l={0.7} h={0.38} y={0.7} color="#9a3a24" />
        </group>
      )}
      {Array.from({length: CARS}, (_, c) => {
        const p = trainAt(c, t);
        if (!p) return null;
        const loco = c === 0;
        return (
          <group key={c} position={[p.x, 0.12, p.z]} rotation-y={p.rot}>
            <Box p={[0, 0.42, 0]} s={[0.55, 0.6, CAR_LEN * 0.92]} c={loco ? '#c0392b' : '#e9e2d0'} />
            <Box p={[0, 0.76, 0]} s={[0.6, 0.08, CAR_LEN * 0.94]} c={loco ? '#5a5a5a' : '#8a3a2a'} />
            {!loco && <Box p={[0, 0.5, 0]} s={[0.57, 0.12, CAR_LEN * 0.8]} c="#7a2f2a" />}
          </group>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ Sala Kaew Ku: the giant concrete statues
const CONCRETE = '#a9a49a';
const NagaHood: React.FC<{h: number}> = ({h}) => (
  <group>
    <mesh position={[0, h * 0.18, 0]} castShadow>
      <cylinderGeometry args={[h * 0.32, h * 0.38, h * 0.36, 14]} />
      <meshStandardMaterial color={CONCRETE} roughness={0.95} />
    </mesh>
    <mesh position={[0, h * 0.55, 0]} castShadow>
      <cylinderGeometry args={[h * 0.12, h * 0.16, h * 0.5, 10]} />
      <meshStandardMaterial color={CONCRETE} roughness={0.95} />
    </mesh>
    {Array.from({length: 7}, (_, i) => {
      const a = (i - 3) * 0.32;
      return (
        <group key={i} position={[Math.sin(a) * h * 0.22, h * 0.82 + Math.cos(a) * h * 0.08, Math.cos(a) * h * 0.05]} rotation-z={-a}>
          <mesh castShadow>
            <capsuleGeometry args={[h * 0.05, h * 0.18, 4, 8]} />
            <meshStandardMaterial color={CONCRETE} roughness={0.95} />
          </mesh>
          <mesh position={[0, h * 0.13, h * 0.04]} scale={[1, 0.8, 1.4]}>
            <sphereGeometry args={[h * 0.055, 8, 6]} />
            <meshStandardMaterial color={CONCRETE} roughness={0.95} />
          </mesh>
        </group>
      );
    })}
  </group>
);
const Figure: React.FC<{h: number}> = ({h}) => (
  <group>
    <mesh position={[0, h * 0.3, 0]} castShadow>
      <cylinderGeometry args={[h * 0.12, h * 0.18, h * 0.6, 10]} />
      <meshStandardMaterial color={CONCRETE} roughness={0.95} />
    </mesh>
    <mesh position={[0, h * 0.72, 0]} castShadow>
      <cylinderGeometry args={[h * 0.1, h * 0.12, h * 0.26, 10]} />
      <meshStandardMaterial color={CONCRETE} roughness={0.95} />
    </mesh>
    <mesh position={[0, h * 0.92, 0]} castShadow>
      <coneGeometry args={[h * 0.09, h * 0.2, 8]} />
      <meshStandardMaterial color={CONCRETE} roughness={0.95} />
    </mesh>
  </group>
);
const SalaKaewKu: React.FC<{t: number; Y: number}> = ({t, Y}) => (
  <group>
    {STATUES.map(([x, z, h], j) => {
      const k = statueK(j, t, Y);
      if (k < 0.02) return null;
      return (
        <group key={j} position={[x, 0, z]} scale={[1, k, 1]}>
          {j === 0 ? <NagaHood h={h} /> : <Figure h={h} />}
        </group>
      );
    })}
  </group>
);

// ------------------------------------------------------------------ the Friendship Bridge
const Bridge: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = spanK(t, Y);
  if (k < 0.01) return null;
  const [a, b] = BRIDGE;
  const rot = Math.atan2(b[0] - a[0], b[1] - a[1]);
  const half = BRIDGE_LEN / 2;
  const reach = half * k;
  const PIERS = 9;
  return (
    <group position={[a[0], 0, a[1]]} rotation-y={rot}>
      {/* the two halves reaching from the banks, the deck 0.9 above the river */}
      {[0, 1].map((side) => {
        const z0 = side === 0 ? 0 : BRIDGE_LEN - reach;
        return (
          <group key={side} position={[0, 0, z0 + reach / 2]}>
            <Box p={[0, 0.9, 0]} s={[0.75, 0.18, reach]} c="#d6d1c4" />
            {[-1, 1].map((s) => (
              <Box key={s} p={[s * 0.36, 1.06, 0]} s={[0.04, 0.14, reach]} c="#eae6dc" />
            ))}
            <Box p={[0, 1.0, 0]} s={[0.14, 0.03, reach]} c="#6d6458" />
          </group>
        );
      })}
      {Array.from({length: PIERS}, (_, i) => {
        const z = ((i + 0.5) / PIERS) * BRIDGE_LEN;
        const built = z < reach + 0.3 || z > BRIDGE_LEN - reach - 0.3;
        return built ? <Box key={i} p={[0, 0.45, z]} s={[0.5, 0.9, 0.3]} c="#bdb7a8" /> : null;
      })}
      {/* the flags of the two countries at the middle once it meets */}
      {k > 0.98 &&
        [-1, 1].map((s) => (
          <group key={s} position={[s * 0.42, 1.0, half]}>
            <Box p={[0, 0.45, 0]} s={[0.03, 0.9, 0.03]} c="#dddddd" />
            <Box p={[0, 0.8, 0.14 * s]} s={[0.02, 0.18, 0.28]} c={s > 0 ? '#2b3a8c' : '#c8202a'} />
          </group>
        ))}
      {Array.from({length: BRIDGE_CARS}, (_, i) => {
        const p = bridgeCarAt(i, t, Y);
        if (!p) return null;
        // back into the bridge's frame
        const dx = p.x - a[0];
        const dz = p.z - a[1];
        const lz = dx * Math.sin(rot) + dz * Math.cos(rot);
        const lx = dx * Math.cos(rot) - dz * Math.sin(rot);
        return (
          <group key={i} position={[lx, 1.05, lz]} rotation-y={i % 2 ? 0 : Math.PI}>
            <Box p={[0, 0.1, 0]} s={[0.22, 0.16, 0.42]} c={['#d8d8d8', '#c0392b', '#2c3e50', '#f1c40f', '#ecf0f1', '#2980b9'][i % 6]} />
          </group>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ the Ok Phansa race and the naga fireballs
const RACE_COLORS: [string, string][] = [
  ['#7a1a14', '#e0a92a'],
  ['#1f4a7a', '#f2efe6'],
  ['#2f6a3a', '#f2c230'],
  ['#5a2a6a', '#f2efe6'],
];
const Race: React.FC<{t: number}> = ({t}) => (
  <group>
    {t > 49.4 && t < 55.2 &&
      Array.from({length: RACE_LANES}, (_, i) => {
        const p = raceAt(i, t);
        if (!p) return null;
        const [hull, band] = RACE_COLORS[i];
        return (
          <group key={i} position={[p.x, 0.02, p.z]} rotation-y={p.rot}>
            <LongBoat L={RACE_BOAT_LEN} t={t} rowers={7} stroke={t * 2.4 + i * 0.2} color={hull} band={band} head={1} />
            <mesh position={[0, 0.02, -RACE_BOAT_LEN * 0.62]} rotation-x={-Math.PI / 2}>
              <ringGeometry args={[0.15, 0.3, 14, 1, Math.PI * 1.1, Math.PI * 0.8]} />
              <meshBasicMaterial color="#eef6f6" transparent opacity={0.6} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    {t > 49.4 && t < 56 &&
      Array.from({length: FIREBALLS}, (_, i) => {
        const f = fireballAt(i, t);
        if (!f) return null;
        return (
          <mesh key={i} position={[f.x, f.y, f.z]} scale={0.32 * (1 - f.u * 0.4)}>
            <sphereGeometry args={[1, 12, 10]} />
            <meshBasicMaterial color="#ff5a2a" toneMapped={false} transparent opacity={1 - f.u * 0.7} />
          </mesh>
        );
      })}
  </group>
);

// ------------------------------------------------------------------ small fishing boats on the Mekong through the years
const FISHERS: [number, number, number][] = [
  // x, z, drift phase: in the channel, clear of the bridge and of the race course
  [-18, -2.6, 0],
  [20, -18.6, 1.7],
  [30, -30, 3.1],
  [-8, -6.6, 4.2],
];
const Fishers: React.FC<{t: number}> = ({t}) => (
  <group>
    {FISHERS.map(([x, z, ph], i) => {
      const d = Math.sin(t * 0.25 + ph) * 1.2;
      return (
        <group key={i} position={[x + d, 0.02, z - d * 0.5]} rotation-y={1.2}>
          <LongBoat L={1.3} head={0} rowers={1} stroke={t * 0.8 + ph} color="#4b3a2a" band="#6b5a44" />
        </group>
      );
    })}
  </group>
);

export const NongKhaiLandmarks: React.FC<LandmarkProps> = ({Y, t}) => (
  <group>
    <Flat shape={MEKONG_SHAPE} color={WATER} />
    <Fishers t={t} />
    <Cover t={t} />
    <Settle t={t} Y={Y} />
    <Found t={t} />
    <Sink t={t} Y={Y} />
    <PraSai t={t} Y={Y} />
    <Haw t={t} Y={Y} />
    <Railway t={t} Y={Y} />
    <SalaKaewKu t={t} Y={Y} />
    <Bridge t={t} Y={Y} />
    <Race t={t} />
  </group>
);
