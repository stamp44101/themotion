import React from 'react';
import {Elephant} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp, smooth} from '../../lib';
import {
  ARMY_COLS, ARMY_ROWS, DIG_END, armyCentre, cannonK, carAt, CARS, columnAt, COLUMN, dredgeOn, ELEPHANTS, elephantAt, GUARDS, guardAt, HATCH_N, hatchAt, heroK, HEROES, heroX, MINERS,
  minerAt, ferryAt, sarasinK, MOTHER, motherZ, payoffOn, SHORE_Z, PITS, pitAt, pitK, RELEASE_N, releaseAt, SHOP_N, shopK, shopX, tinBoatAt, tinOn,
} from './actors';
import {Dredge} from './Dredge';
import {Person} from './figures';
import {GreenTurtle} from './GreenTurtle';
import {
  BIG_BUDDHA, BRIDGE_X, BRIDGE_Z, BURMESE_CAMP, CHARTERED, CHINPRACHA, DIBUK_RD_Z, DREDGE, EDGE, HEROINES, JUI_TUI, KATHU, KRABI_RD_Z, LANDING, MAINLAND_Z, NORTH_BEACH_W,
  NORTH_BEACH_X, SEA_Y, SHIP_AT, STOCKADE, THALANG_RD_Z, WEST_BEACH_W,
} from './places';
import {SeaTurtle, Surf, TurtleTrack} from './SeaTurtle';

type TH = LandmarkProps['terrainH'];
const SAND = '#e6d4a4';
const SEA = '#3f8fc0';

// พังงา across ช่องปากพระ: a strip of wooded mainland north of the island, as a second slab
const MAINLAND_TREES = Array.from({length: 70}, (_, i) => ({x: -46 + ((i * 37) % 93), z: MAINLAND_Z[0] + 1.5 + ((i * 53) % 13), s: 0.8 + ((i * 7) % 5) * 0.12}));
const Mainland: React.FC = () => {
  const d = MAINLAND_Z[1] - MAINLAND_Z[0];
  return (
    <group position={[0, 0, (MAINLAND_Z[0] + MAINLAND_Z[1]) / 2]}>
      <mesh position={[0, -3, 0]} receiveShadow>
        <boxGeometry args={[2 * EDGE, 6, d]} />
        <meshStandardMaterial color="#6b4a2e" roughness={1} />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[2 * EDGE, 0.04, d]} />
        <meshStandardMaterial color="#5f8f45" roughness={1} />
      </mesh>
      <mesh position={[0, 0.03, d / 2 - 1.2]} receiveShadow>
        <boxGeometry args={[2 * EDGE, 0.05, 2.4]} />
        <meshStandardMaterial color={SAND} roughness={1} />
      </mesh>
      {MAINLAND_TREES.map((tr, i) => (
        <mesh key={i} position={[tr.x, 0.9 * tr.s, tr.z - (MAINLAND_Z[0] + MAINLAND_Z[1]) / 2]} scale={tr.s} castShadow>
          <coneGeometry args={[0.8, 1.9, 6]} />
          <meshStandardMaterial color={i % 3 ? '#3f7d3a' : '#2f6a36'} roughness={1} />
        </mesh>
      ))}
    </group>
  );
};

// สะพานสารสิน (1967): a concrete deck on piers over the strait, mainland to the island. It spans
// out from the mainland across the bridge beat (k), each pier going in as the deck reaches it.
// Drawn 1.8 wide so a car (0.9 x 0.45 here) sits on it as on a two-lane road.
export const DECK_W = 1.8;
const Sarasin: React.FC<{k: number}> = ({k}) => {
  const len = BRIDGE_Z[1] - BRIDGE_Z[0];
  const built = len * k;
  return (
    <group position={[BRIDGE_X, 0, BRIDGE_Z[0]]}>
      <mesh position={[0, 0.35, built / 2]} castShadow receiveShadow>
        <boxGeometry args={[DECK_W, 0.16, built + 0.4]} />
        <meshStandardMaterial color="#b4b6b8" roughness={0.85} />
      </mesh>
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[sd * (DECK_W / 2 - 0.03), 0.5, built / 2]} castShadow>
          <boxGeometry args={[0.06, 0.16, built + 0.4]} />
          <meshStandardMaterial color="#e6e6e2" />
        </mesh>
      ))}
      {Array.from({length: 7}, (_, i) => {
        const z = ((i + 0.5) * len) / 7;
        return z > built ? null : (
          <mesh key={i} position={[0, (0.27 + SEA_Y) / 2, z]} castShadow>
            <boxGeometry args={[0.8, 0.27 - SEA_Y, 0.35]} />
            <meshStandardMaterial color="#9a9c9e" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
};
// the car ferry over ช่องปากพระ, the only way across before the bridge: a flat deck with a
// wheelhouse and two cars on it
const Ferry: React.FC<{x: number; z: number; k: number; t: number}> = ({x, z, k, t}) =>
  k <= 0.02 ? null : (
    <group position={[x, SEA_Y + 0.05 * Math.sin(t * 1.6), z]} scale={k}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.6, 0.3, 3.2]} />
        <meshStandardMaterial color="#e8e2d0" roughness={0.8} />
      </mesh>
      <mesh position={[0.55, 0.55, 0]} castShadow>
        <boxGeometry args={[0.45, 0.5, 0.8]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      {[-0.7, 0.6].map((dz, i) => (
        <mesh key={i} position={[-0.25, 0.42, dz]} castShadow>
          <boxGeometry args={[0.45, 0.24, 0.9]} />
          <meshStandardMaterial color={i ? '#2e86c1' : '#f1c40f'} />
        </mesh>
      ))}
    </group>
  );

// ------------------------------------------------------------------ small people
// a body and a head; undyed cotton and indigo read as people against sand and grass
const Walker: React.FC<{x: number; z: number; rot: number; y: number; robe: string; load?: boolean; blade?: number}> = ({x, z, rot, y, robe, load, blade}) => (
  <group position={[x, y, z]} rotation-y={rot}>
    <mesh position={[0, 0.4, 0]} castShadow>
      <cylinderGeometry args={[0.13, 0.21, 0.8, 6]} />
      <meshStandardMaterial color={robe} roughness={0.85} />
    </mesh>
    <mesh position={[0, 0.94, 0]} castShadow>
      <sphereGeometry args={[0.15, 6, 5]} />
      <meshStandardMaterial color="#c99a72" roughness={0.9} />
    </mesh>
    {load && (
      <mesh position={[0, 1.16, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.16, 0.2, 8]} />
        <meshStandardMaterial color="#9a7a44" roughness={1} />
      </mesh>
    )}
    {blade !== undefined && (
      // the legend's blades, flashing in the sun
      <mesh position={[0.24, 1.0, 0.1]} rotation-z={-0.5}>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshBasicMaterial color={blade > 0.5 ? '#fffbe8' : '#c9c4b0'} toneMapped={false} />
      </mesh>
    )}
  </group>
);

// ------------------------------------------------------------------ 1675: the ship and the tin
const Ship: React.FC<{t: number}> = ({t}) => (
  <group position={[SHIP_AT[0], SEA_Y + 0.05 * Math.sin(t * 1.1), SHIP_AT[1]]} rotation-y={0.2} scale={1.3}>
    <mesh position={[0, 0.35, 0]} castShadow>
      <boxGeometry args={[1.4, 0.7, 4.6]} />
      <meshStandardMaterial color="#5b3a22" roughness={0.8} />
    </mesh>
    <mesh position={[0, 0.85, -1.9]} castShadow>
      <boxGeometry args={[1.3, 0.5, 1.0]} />
      <meshStandardMaterial color="#6e4a2c" roughness={0.8} />
    </mesh>
    {[1.1, -0.4].map((mz, i) => (
      <group key={i} position={[0, 0, mz]}>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 3.6, 6]} />
          <meshStandardMaterial color="#4a3018" />
        </mesh>
        <mesh position={[0, 2.5 - i * 0.3, 0.08]} castShadow>
          <boxGeometry args={[1.8 - i * 0.3, 1.6 - i * 0.2, 0.04]} />
          <meshStandardMaterial color="#efe6cf" roughness={0.9} />
        </mesh>
      </group>
    ))}
  </group>
);
const TinBoat: React.FC<{x: number; z: number; rot: number}> = ({x, z, rot}) => (
  <group position={[x, SEA_Y + 0.08, z]} rotation-y={rot}>
    <mesh castShadow>
      <boxGeometry args={[0.5, 0.22, 1.4]} />
      <meshStandardMaterial color="#6a4a2a" />
    </mesh>
    {[-0.3, 0, 0.3].map((dz) => (
      <mesh key={dz} position={[0, 0.18, dz]}>
        <boxGeometry args={[0.28, 0.12, 0.18]} />
        <meshStandardMaterial color="#b9bcc0" metalness={0.7} roughness={0.3} />
      </mesh>
    ))}
  </group>
);

// ------------------------------------------------------------------ 1785: the stockade
const Stockade: React.FC<{y: number}> = ({y}) => (
  <group position={[STOCKADE[0], y, STOCKADE[1]]}>
    {Array.from({length: 40}, (_, i) => {
      const a = (i / 40) * Math.PI * 2;
      // a gap on the west side for the gate
      if (Math.abs(a - Math.PI * 1.5) < 0.2) return null;
      return (
        <mesh key={i} position={[Math.sin(a) * 1.5, 0.45, Math.cos(a) * 1.2]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 0.9, 5]} />
          <meshStandardMaterial color="#7a5a34" roughness={1} />
        </mesh>
      );
    })}
    {[[-0.4, -0.2], [0.5, 0.3]].map(([x, z], i) => (
      <group key={i} position={[x, 0, z]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.8, 0.7, 0.6]} />
          <meshStandardMaterial color="#b49a6c" />
        </mesh>
        <mesh position={[0, 0.85, 0]} rotation-y={Math.PI / 4} castShadow>
          <coneGeometry args={[0.65, 0.5, 4]} />
          <meshStandardMaterial color="#8a6a3a" />
        </mesh>
      </group>
    ))}
  </group>
);

// ------------------------------------------------------------------ 1825: Kathu shrine
const Shrine: React.FC<{x: number; z: number; y: number; s?: number}> = ({x, z, y, s = 1}) => (
  <group position={[x, y, z]} scale={s}>
    <mesh position={[0, 0.35, 0]} castShadow>
      <boxGeometry args={[1.2, 0.7, 0.9]} />
      <meshStandardMaterial color="#f0e6d2" />
    </mesh>
    <mesh position={[0, 0.85, 0]} castShadow>
      <boxGeometry args={[1.5, 0.12, 1.15]} />
      <meshStandardMaterial color="#c0392b" />
    </mesh>
    <mesh position={[0, 1.0, 0]} castShadow>
      <boxGeometry args={[1.0, 0.2, 0.7]} />
      <meshStandardMaterial color="#c0392b" />
    </mesh>
  </group>
);

// ------------------------------------------------------------------ 1901-1906: the shophouses
const PASTEL = ['#f2c7a5', '#a9d6c9', '#f4e3a1', '#c9d8f0', '#f0b8c0', '#d8e8b8', '#f6d6b0'];
const Shophouse: React.FC<{x: number; z: number; k: number; i: number; face: 1 | -1}> = ({x, z, k, i, face}) => {
  if (k <= 0.02) return null;
  const h = 1.3 * k;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, h, 1.1]} />
        <meshStandardMaterial color={PASTEL[i % PASTEL.length]} roughness={0.8} />
      </mesh>
      {k > 0.9 && (
        <>
          <mesh position={[0, 1.36, 0]} castShadow>
            <boxGeometry args={[0.76, 0.1, 1.16]} />
            <meshStandardMaterial color="#b0563a" />
          </mesh>
          {/* the five-foot way's arches on the street front */}
          <mesh position={[0, 0.32, face * 0.56]}>
            <boxGeometry args={[0.42, 0.42, 0.02]} />
            <meshStandardMaterial color="#5a4a3a" />
          </mesh>
          {/* upper windows with shutters */}
          {[-0.17, 0.17].map((dx) => (
            <mesh key={dx} position={[dx, 0.95, face * 0.56]}>
              <boxGeometry args={[0.14, 0.22, 0.02]} />
              <meshStandardMaterial color="#3d6b5a" />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};
// บ้านชินประชา (2446) and the Chartered Bank (2450), two-storey Sino-European mansions
const Mansion: React.FC<{x: number; z: number; color: string; k: number; w?: number}> = ({x, z, color, k, w = 1.6}) =>
  k <= 0.02 ? null : (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.8 * k, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 1.6 * k, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {k > 0.9 && (
        <mesh position={[0, 1.78, 0]} rotation-y={Math.PI / 4} castShadow>
          <coneGeometry args={[w * 0.8, 0.5, 4]} />
          <meshStandardMaterial color="#9c4a32" />
        </mesh>
      )}
    </group>
  );

// ------------------------------------------------------------------ 1967: the first cars
const CAR_COLORS = ['#c0392b', '#2e86c1', '#f1c40f', '#ecf0f1', '#27ae60', '#8e44ad', '#e67e22', '#34495e'];
const Car: React.FC<{x: number; z: number; rot: number; y: number; c: string}> = ({x, z, rot, y, c}) => (
  <group position={[x, y, z]} rotation-y={rot} scale={0.9}>
    <mesh position={[0, 0.22, 0]} castShadow>
      <boxGeometry args={[0.5, 0.24, 1.0]} />
      <meshStandardMaterial color={c} metalness={0.3} roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.42, -0.05]} castShadow>
      <boxGeometry args={[0.44, 0.18, 0.55]} />
      <meshStandardMaterial color={c} metalness={0.3} roughness={0.5} />
    </mesh>
  </group>
);
// อนุสาวรีย์ท้าวเทพกระษัตรี ท้าวศรีสุนทร: two bronze figures on a white pedestal in the roundabout
const Heroines: React.FC<{y: number}> = ({y}) => (
  <group position={[HEROINES[0], y, HEROINES[1]]}>
    <mesh position={[0, 0.3, 0]} receiveShadow>
      <cylinderGeometry args={[1.3, 1.3, 0.12, 20]} />
      <meshStandardMaterial color="#7fae6a" />
    </mesh>
    <mesh position={[0, 0.7, 0]} castShadow>
      <boxGeometry args={[0.9, 0.8, 0.6]} />
      <meshStandardMaterial color="#efece4" />
    </mesh>
    {[-0.2, 0.2].map((dx) => (
      <mesh key={dx} position={[dx, 1.45, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.45, 4, 8]} />
        <meshStandardMaterial color="#5a4630" metalness={0.6} roughness={0.4} />
      </mesh>
    ))}
  </group>
);

// ------------------------------------------------------------------ 2002: the Big Buddha
// พระพุทธมิ่งมงคลเอกนาคคีรี: a seated image in white marble, in the Maravijaya posture (the right
// hand over the right knee touching the earth, the left in the lap), on an octagonal plinth. Built
// from the forms that read at a distance: the broad crossed legs, the tapering body, the shoulders
// and arms, the head with its long ears and the flame of the ushnisha. Local front is +z; ~3 tall.
const MARBLE = '#f4f2ec';
const BigBuddha: React.FC<{y: number; k: number}> = ({y, k}) => {
  if (k <= 0.02) return null;
  const m = <meshStandardMaterial color={MARBLE} roughness={0.55} />;
  return (
    // faces north-east, toward Chalong Bay
    <group position={[BIG_BUDDHA[0], y, BIG_BUDDHA[1]]} rotation-y={2.36} scale={[2.6, 2.6 * k, 2.6]}>
      {/* the octagonal plinth and the lotus throne */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.45, 0.4, 8]} />
        <meshStandardMaterial color="#e9e5da" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[1.15, 1.25, 0.22, 24]} />
        {m}
      </mesh>
      {/* the crossed legs: a broad, low mass with the knees out to the sides */}
      <mesh position={[0, 0.78, 0.12]} scale={[1.18, 0.32, 0.72]} castShadow>
        <sphereGeometry args={[1, 24, 12]} />
        {m}
      </mesh>
      {/* the body, tapering to the shoulders, and the robe's line over the left shoulder */}
      <mesh position={[0, 1.42, -0.05]} castShadow>
        <cylinderGeometry args={[0.46, 0.62, 1.05, 20]} />
        {m}
      </mesh>
      <mesh position={[0, 1.95, -0.05]} scale={[0.72, 0.26, 0.42]} castShadow>
        <sphereGeometry args={[1, 20, 10]} />
        {m}
      </mesh>
      {/* arms: upper arms down the sides; the right forearm reaches over the right knee to the
          ground, the left lies in the lap */}
      {[-1, 1].map((sd) => (
        <mesh key={`ua${sd}`} position={[sd * 0.6, 1.55, 0.02]} rotation-z={sd * 0.12} castShadow>
          <capsuleGeometry args={[0.13, 0.62, 4, 10]} />
          {m}
        </mesh>
      ))}
      <mesh position={[0.72, 1.0, 0.42]} rotation-x={0.9} rotation-z={0.15} castShadow>
        <capsuleGeometry args={[0.11, 0.55, 4, 10]} />
        {m}
      </mesh>
      <mesh position={[-0.3, 0.98, 0.42]} rotation-z={Math.PI / 2 - 0.3} castShadow>
        <capsuleGeometry args={[0.11, 0.5, 4, 10]} />
        {m}
      </mesh>
      {/* neck, head, the long ear lobes, the curls and the flame */}
      <mesh position={[0, 2.12, -0.02]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.18, 12]} />
        {m}
      </mesh>
      <mesh position={[0, 2.42, 0]} scale={[0.29, 0.34, 0.3]} castShadow>
        <sphereGeometry args={[1, 18, 14]} />
        {m}
      </mesh>
      {[-1, 1].map((sd) => (
        <mesh key={`ear${sd}`} position={[sd * 0.29, 2.32, -0.02]} scale={[0.05, 0.2, 0.08]} castShadow>
          <sphereGeometry args={[1, 8, 8]} />
          {m}
        </mesh>
      ))}
      <mesh position={[0, 2.72, -0.02]} scale={[0.2, 0.12, 0.2]} castShadow>
        <sphereGeometry args={[1, 14, 8]} />
        {m}
      </mesh>
      <mesh position={[0, 2.95, -0.02]} castShadow>
        <coneGeometry args={[0.08, 0.38, 10]} />
        {m}
      </mesh>
    </group>
  );
};

export const PhuketLandmarks: React.FC<LandmarkProps> = ({Y, t, terrainH, beat}) => {
  const ctx = {Y, beat, ground: terrainH};
  const hk = heroK(t);
  const mk = smooth(ramp(t, 2.2, 3.8)) * (1 - smooth(ramp(t, 6, 8.6)));
  const g = (x: number, z: number) => terrainH(x, z);

  // ---- 1675
  const elephants = Array.from({length: ELEPHANTS}, (_, i) => elephantAt(i, ctx));
  const guards = Array.from({length: GUARDS}, (_, i) => guardAt(i, ctx));
  const boat = tinBoatAt(t, ctx);
  // ---- 1785
  const army = armyCentre(ctx);
  const col = Array.from({length: COLUMN}, (_, i) => columnAt(i, t, ctx));
  const smoke = cannonK(t, ctx);
  // ---- 1849-69
  const miners = Array.from({length: MINERS}, (_, i) => minerAt(i, ctx));
  // ---- 1967
  const cars = Array.from({length: CARS}, (_, i) => carAt(i, t, ctx));
  const ferry = ferryAt(t, ctx);
  const payoff = payoffOn(Y);
  // the payoff arrives over its first ~1.3 s instead of popping in under the caption ([local] on
  // #59 measured it as the clip's largest frame-to-frame jump at 58.2 s): the mother rises out of
  // the sand at her nest, the hatchlings come up out of it, the crowd walks in along the beach
  const arrive = smooth(ramp(beat('turtles'), 0, 0.15));

  return (
    <group>
      {/* ---- the cover: two turtles haul out and dig in */}
      {/* the sea all round the island, and the mainland (พังงา) across the strait */}
      <mesh position={[0, SEA_Y, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[1400, 1400]} />
        <meshStandardMaterial color={SEA} roughness={0.15} metalness={0.25} />
      </mesh>
      <Mainland />
      {/* the beaches, in every era: the Andaman shore on the west edge, Mai Khao on the north */}
      <mesh position={[-EDGE + WEST_BEACH_W / 2, 0.025, 0]} receiveShadow>
        <boxGeometry args={[WEST_BEACH_W, 0.05, 2 * EDGE]} />
        <meshStandardMaterial color={SAND} roughness={1} />
      </mesh>
      <mesh position={[(NORTH_BEACH_X[0] + NORTH_BEACH_X[1]) / 2, 0.026, -EDGE + NORTH_BEACH_W / 2]} receiveShadow>
        <boxGeometry args={[NORTH_BEACH_X[1] - NORTH_BEACH_X[0], 0.05, NORTH_BEACH_W]} />
        <meshStandardMaterial color={SAND} roughness={1} />
      </mesh>
      {sarasinK(Y, ctx) > 0.01 && <Sarasin k={sarasinK(Y, ctx)} />}
      {ferry && <Ferry {...ferry} t={t} />}
      {mk > 0.02 &&
        HEROES.map((h, i) => (
          // the sand each one throws up as it digs its body pit; it settles back after the cover
          <mesh key={`mound${i}`} position={[heroX(h, DIG_END), 0, h.z]} scale={[1.7 * h.s * mk, 0.5 * h.s * mk, 1.5 * h.s * mk]} receiveShadow castShadow>
            <sphereGeometry args={[1, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={SAND} roughness={1} />
          </mesh>
        ))}
      {hk > 0.02 &&
        HEROES.map((h, i) => {
          const x = heroX(h, t);
          // it sinks under its own mound: never cut, it is covered
          const sink = (1 - hk) * 1.1 * h.s;
          const Body = h.kind === 'leatherback' ? SeaTurtle : GreenTurtle;
          return (
            <group key={i}>
              <TurtleTrack x0={-EDGE} x1={x - 1.2 * h.s} z={h.z} s={h.s * 0.45} />
              <group position={[x, -sink, h.z]} rotation-y={Math.PI / 2} scale={h.s}>
                <Body t={t + h.ph} />
              </group>
              <Surf x={x - 0.6 * h.s} z={h.z} r={1.6 * h.s} t={t + h.ph} k={(1 - smooth(ramp(x, -EDGE - 2, -EDGE + 4))) * hk} />
            </group>
          );
        })}

      {/* ---- 1675: Bowrey's ship, the tin boat, the elephants carrying the captain to Luppoone */}
      {tinOn(Y) && <Ship t={t} />}
      {boat && <TinBoat {...boat} />}
      {tinOn(Y) &&
        [0, 0.5, 1].map((dz, i) => (
          <mesh key={i} position={[LANDING[0] - 0.8, g(LANDING[0] - 0.8, LANDING[1]) + 0.12, LANDING[1] + dz]} castShadow>
            <boxGeometry args={[0.3, 0.2, 0.3]} />
            <meshStandardMaterial color="#b9bcc0" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      {elephants.map((e, i) =>
        e ? (
          <group key={`e${i}`} position={[e.x, g(e.x, e.z), e.z]} rotation-y={e.rot} scale={1.1}>
            <Elephant step={Math.sin(t * 5 + i)} howdah={i === 0} />
          </group>
        ) : null,
      )}
      {guards.map((p, i) => (p ? <Walker key={`g${i}`} x={p.x + (i % 2 ? 0.3 : -0.3)} z={p.z} rot={p.rot} y={g(p.x, p.z) + 0.05 * Math.abs(Math.sin(t * 7 + i))} robe={i % 3 ? '#efe6d0' : '#a8322a'} /> : null))}

      {/* ---- 1785: the stockade, the army, the column of the legend, the cannon */}
      {Y >= 1780 && Y < 1810 && <Stockade y={g(STOCKADE[0], STOCKADE[1])} />}
      {army &&
        Array.from({length: ARMY_ROWS * ARMY_COLS}, (_, i) => {
          const r = Math.floor(i / ARMY_COLS);
          const c = i % ARMY_COLS;
          const lx = (c - (ARMY_COLS - 1) / 2) * 0.62;
          const lz = (r - (ARMY_ROWS - 1) / 2) * 0.62;
          const cs = Math.cos(army.rot);
          const sn = Math.sin(army.rot);
          const x = army.x + lx * cs + lz * sn;
          const z = army.z - lx * sn + lz * cs;
          return <Walker key={`a${i}`} x={x} z={z} rot={army.rot} y={g(x, z) + 0.05 * Math.abs(Math.sin(t * 8 + i))} robe={i % 4 ? '#7a2a22' : '#3a3026'} />;
        })}
      {Y >= 1785 && Y < 1785.46 && beat('siege') < 0.3 && (
        // the Burmese camp's tents on the field before the army moves up
        Array.from({length: 6}, (_, i) => (
          <mesh key={`tent${i}`} position={[BURMESE_CAMP[0] + (i % 3) * 1.2 - 1.2, g(BURMESE_CAMP[0], BURMESE_CAMP[1]) + 0.35, BURMESE_CAMP[1] + Math.floor(i / 3) * 1.3 - 0.6]} castShadow>
            <coneGeometry args={[0.5, 0.7, 4]} />
            <meshStandardMaterial color="#d8c8a0" />
          </mesh>
        ))
      )}
      {col.map((p, i) => (p ? <Walker key={`c${i}`} x={p.x} z={p.z} rot={p.rot} y={g(p.x, p.z) + 0.05 * Math.abs(Math.sin(t * 7 + i))} robe={i % 2 ? '#2f3a5c' : '#efe6d0'} blade={(t * 3 + i * 0.37) % 1} /> : null))}
      {smoke >= 0 &&
        [0, 1].map((k) => {
          const a = (smoke + k * 0.5) % 1;
          return (
            <mesh key={`sm${k}`} position={[STOCKADE[0] - 1.8 - a * 1.4, g(STOCKADE[0], STOCKADE[1]) + 0.8 + a * 1.6, STOCKADE[1] - 0.6 + k * 1.2]} scale={0.4 + a * 1.2}>
              <sphereGeometry args={[1, 8, 6]} />
              <meshStandardMaterial color="#d8d4cc" transparent opacity={0.7 * (1 - a)} depthWrite={false} />
            </mesh>
          );
        })}

      {/* ---- 1825 on: the Kathu shrine; 1849-69: miners and the pits down the canal */}
      {Y >= 1825 && <Shrine x={KATHU[0]} z={KATHU[1]} y={g(KATHU[0], KATHU[1])} s={1.2} />}
      {Y >= 1880 && <Shrine x={JUI_TUI[0]} z={JUI_TUI[1]} y={g(JUI_TUI[0], JUI_TUI[1])} s={0.8} />}
      {miners.map((p, i) => (p ? <Walker key={`m${i}`} x={p.x + (i % 2 ? 0.35 : -0.35)} z={p.z} rot={p.rot} y={g(p.x, p.z) + 0.05 * Math.abs(Math.sin(t * 7 + i))} robe={i % 3 ? '#2c3e66' : '#efe6d0'} load /> : null))}
      {PITS.map((p, i) => {
        const k = pitK(i, Y);
        if (k <= 0.02) return null;
        const q = pitAt(i);
        // open-cast tin pits; after the mines close (1992) they fill and stay as lagoons
        const lagoon = Y >= 1992;
        return (
          <mesh key={`pit${i}`} position={[q.x, g(q.x, q.z) + 0.03, q.z]} scale={[1.3 * k, 0.04, 1.0 * k]} receiveShadow>
            <sphereGeometry args={[1, 14, 6]} />
            <meshStandardMaterial color={lagoon ? '#3f8fb8' : '#a8865a'} roughness={lagoon ? 0.2 : 1} />
          </mesh>
        );
      })}

      {/* ---- 1901-1906: the shophouse rows on ถลาง, ดีบุก and กระบี่; the mansions */}
      {Array.from({length: SHOP_N}, (_, i) => {
        const k = shopK(i, Y, ctx);
        const x = shopX(i);
        return (
          <group key={`sh${i}`}>
            <Shophouse x={x} z={THALANG_RD_Z - 0.95} k={k} i={i} face={1} />
            <Shophouse x={x} z={THALANG_RD_Z + 0.95} k={k} i={i + 3} face={-1} />
            {i % 2 === 0 && <Shophouse x={x} z={DIBUK_RD_Z - 0.4} k={k} i={i + 5} face={-1} />}
            {i % 3 === 0 && <Shophouse x={x - 0.3} z={KRABI_RD_Z - 0.6} k={k} i={i + 1} face={1} />}
          </group>
        );
      })}
      <Mansion x={CHINPRACHA[0]} z={CHINPRACHA[1]} color="#f3e6c4" k={Y < 1903 ? 0 : Y > 1906.5 ? 1 : smooth(ramp(beat('oldtown'), 0.3, 0.6))} />
      <Mansion x={CHARTERED[0] - 1.3} z={CHARTERED[1] + 1.0} color="#f6f2e8" k={Y >= 1907 ? 1 : 0} w={1.4} />

      {/* ---- 1909: the dredge on Tongkah Bay, drawn ~4x so it reads */}
      {dredgeOn(Y) && (
        <group position={[DREDGE[0], SEA_Y, DREDGE[1]]} rotation-y={-0.6} scale={0.55}>
          <Dredge t={t} />
        </group>
      )}

      {/* ---- 1967: the heroines' monument and the first cars over the bridge */}
      {Y >= 1967 && <Heroines y={g(HEROINES[0], HEROINES[1])} />}
      {cars.map((c, i) => (c ? <Car key={`car${i}`} x={c.x} z={c.z} rot={c.rot} y={c.z < -EDGE && c.z > BRIDGE_Z[0] ? 0.43 : g(c.x, c.z)} c={CAR_COLORS[i % CAR_COLORS.length]} /> : null))}

      {/* ---- 2002: the Big Buddha on เขานาคเกิด */}
      <BigBuddha y={g(BIG_BUDDHA[0], BIG_BUDDHA[1])} k={Y < 2002 ? 0 : smooth(ramp(Y, 2002, 2007))} />

      {/* ---- the payoff at Mai Khao: the leatherback and her hatchlings, the Songkran release */}
      {payoff && (
        <group>
          {(() => {
            // heading north to the sea: the turtles face -z (rotation pi); their tracks run along z
            const mz = motherZ(t, ctx);
            const nest = SHORE_Z + 7;
            return (
              <group>
                <group rotation-y={Math.PI / 2}>
                  <TurtleTrack x0={-nest} x1={-(mz + 1.2 * MOTHER.s)} z={MOTHER.x} s={MOTHER.s * 0.45} />
                </group>
                <group position={[MOTHER.x, (mz < SHORE_Z ? SEA_Y + 0.1 : 0) - (1 - arrive) * 1.6 * MOTHER.s, mz]} rotation-y={Math.PI} scale={MOTHER.s}>
                  <SeaTurtle t={t} swim={mz < SHORE_Z + 0.5} />
                </group>
                <Surf x={MOTHER.x} z={mz} r={1.6 * MOTHER.s} t={t} k={smooth(ramp(-mz, -(SHORE_Z + 1), -(SHORE_Z - 3)))} />
                <mesh position={[MOTHER.x - 4.6, 0.04, nest]} scale={[1.6, 0.04, 1.0]}>
                  <sphereGeometry args={[1, 12, 6]} />
                  <meshStandardMaterial color="#b99d6c" roughness={1} />
                </mesh>
              </group>
            );
          })()}
          {Array.from({length: HATCH_N}, (_, i) => {
            const h = hatchAt(i, t);
            return h ? (
              <group key={`h${i}`} position={[h.x, 0, h.z]} rotation-y={Math.PI + 0.2 * Math.sin(i)} scale={0.42 * smooth(ramp(arrive, (i % 5) * 0.12, 0.5 + (i % 5) * 0.12))}>
                <SeaTurtle t={t + i * 1.3} rate={1.7} detail={false} />
              </group>
            ) : null;
          })}
          {Array.from({length: RELEASE_N}, (_, i) => {
            const r = releaseAt(i);
            const k = ((t + i * 0.83) * 0.16) % 1;
            const tz = r.z - 1.2 - k * (r.z - SHORE_Z + 0.6);
            return (
              <group key={`r${i}`}>
                <group position={[r.x - (1 - arrive) * (10 + i * 1.5), 0, r.z + (1 - arrive) * 2]} rotation-y={Math.PI - (1 - arrive) * 1.2} scale={1.6}>
                  <Person t={t} i={i} />
                </group>
                {arrive > 0.95 && tz > SHORE_Z - 1 && (
                  <group position={[r.x, tz < SHORE_Z ? SEA_Y + 0.1 : 0, tz]} rotation-y={Math.PI} scale={0.4}>
                    <GreenTurtle t={t + i} rate={1.2} swim={tz < SHORE_Z} />
                  </group>
                )}
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};
