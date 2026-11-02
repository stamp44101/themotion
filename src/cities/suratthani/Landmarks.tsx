import React from 'react';
import {Army} from '../../engine/army';
import type {LandmarkProps} from '../../engine/types';
import {NanBoat} from '../nan/boat';
import {Hall, RowBoat} from '../phetchabun/figures';
import {
  BARGES, bargeAt, beatK, burmese, CALLBACK_H, clamp01, coconutAt, FERRIES, ferryAt, fireK, hullK, launchK, LEAN, monkeyAt,
  monkeyBack, MOVE_BOATS, moveBoatAt, OYSTER_HUTS, oysterK, palmH, PHRA_BOATS, phraAt, RACERS, racerAt, ramp, shipAt, SHIPS, siamese,
  SLIP_DIR, splashK, welcomeK,
} from './actors';
import {Ball, ClimbingMonkey, CoconutPalm, NUT, Seg, Splash} from './figures';
import {CHAIYA, LANDING, MARKET, PALM2, PALM_BASE, PALM_OVER, SHIPYARD, SHRINE, STATION} from './places';

type TH = LandmarkProps['terrainH'];

// a growing mesh is gated on its own scale (CLAUDE.md: a mesh at scale 0 blacks out the shader look)
const Grow: React.FC<{k: number; children: React.ReactNode; at: [number, number, number]; rot?: number; scale?: number}> = ({k, children, at, rot = 0, scale = 1}) =>
  k > 0.02 ? (
    <group position={at} rotation-y={rot} scale={[scale, scale * Math.max(0.03, k), scale]}>
      {children}
    </group>
  ) : null;

const Box: React.FC<{p: [number, number, number]; s: [number, number, number]; c: string; r?: number; basic?: boolean}> = ({p, s, c, r = 0, basic}) => (
  <mesh position={p} rotation-y={r} castShadow={!basic} receiveShadow={!basic}>
    <boxGeometry args={s} />
    {basic ? <meshBasicMaterial color={c} toneMapped={false} /> : <meshStandardMaterial color={c} roughness={0.85} />}
  </mesh>
);
const GILT = '#d9a43a';
const RED = '#b8322a';

// ------------------------------------------------------------------ the cover
const Cover: React.FC<{t: number; terrainH: TH}> = ({t, terrainH}) => {
  const g = terrainH(PALM_BASE[0], PALM_BASE[1]);
  const H = palmH(t);
  const m = monkeyAt(t, g);
  const nut = coconutAt(t, g);
  const sp = splashK(t);
  return (
    <>
      <group position={[PALM_BASE[0], g, PALM_BASE[1]]} rotation-y={LEAN} scale={H}>
        <CoconutPalm sway={Math.sin(t * 1.7)} nuts={5} />
      </group>
      {m && (
        <group position={[m.x, m.y, m.z]} rotation-y={LEAN}>
          <group rotation-z={m.tilt}>
            <group rotation-y={Math.PI} scale={m.s}>
              <ClimbingMonkey climb={m.climb} look={m.look} twist={m.twist} />
            </group>
          </group>
        </group>
      )}
      {nut && (
        <group position={[nut.x, nut.y, nut.z]} rotation-y={nut.spin} rotation-z={0.4}>
          <Ball p={[0, 0, 0]} s={[nut.r, nut.r * 1.15, nut.r]} color={NUT} detail={1} />
        </group>
      )}
      <group position={[PALM_OVER[0], 0.05, PALM_OVER[1]]} scale={7}>
        <Splash u={sp} />
      </group>
    </>
  );
};

// ------------------------------------------------------------------ Srivijaya's ships
const Junk: React.FC<{sail: number; dhow?: boolean}> = ({sail, dhow}) => (
  <group>
    <mesh position={[0, 0.35, 0]} scale={[0.9, 0.45, 2.6]} castShadow>
      <sphereGeometry args={[1, 12, 8]} />
      <meshStandardMaterial color={dhow ? '#7a5a3a' : '#5a3a22'} />
    </mesh>
    {(dhow ? [0.2] : [-0.9, 0.6]).map((z, k) => (
      <group key={z} position={[0, 0.7, z]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.8, 6]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
        {dhow ? (
          // a lateen sail: a tall triangle
          <mesh position={[0, 1.6, 0.1]} rotation-x={0.2} scale={[1, 1, 1]}>
            <coneGeometry args={[1.1, 2.6, 3]} />
            <meshStandardMaterial color="#efe6d2" flatShading />
          </mesh>
        ) : (
          <mesh position={[0, 1.6 - k * 0.2, 0.02]} scale={[1, 0.6 + 0.4 * Math.min(1, sail * 3), 1]}>
            <boxGeometry args={[2.2 - k * 0.4, 2.2, 0.08]} />
            <meshStandardMaterial color="#b0562f" />
          </mesh>
        )}
      </group>
    ))}
  </group>
);
const Ships: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: SHIPS}, (_, i) => {
      const s = shipAt(i, t);
      if (!s) return null;
      return (
        <group key={i} position={[s.x, 0.05 + Math.sin(t * 1.3 + i) * 0.06, s.z]} rotation-y={s.rot} rotation-z={Math.sin(t * 1.1 + i) * 0.03} scale={3.2}>
          <Junk sail={s.sail} dhow={i % 2 === 1} />
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ Chaiya: the great stupa, the town, 2328
/** Phra Borommathat Chaiya: a cruciform Srivijaya stupa, porches on four sides, three receding tiers with
 *  small stupas at the corners, a gilt spire. Real ~24 m; drawn ~5 units tall (a far place). */
const Borommathat: React.FC = () => {
  const plaster = '#d4cbb8';
  const shade = '#b8ad97';
  return (
    <group>
      {/* the cloister and its court */}
      <Box p={[0, 0.06, 0]} s={[5.2, 0.12, 5.2]} c="#cfc6b3" />
      {[[0, -2.5, 0], [0, 2.5, 0], [-2.5, 0, Math.PI / 2], [2.5, 0, Math.PI / 2]].map(([x, z, r], i) => (
        <Box key={i} p={[x, 0.35, z]} s={[5.2, 0.5, 0.35]} c="#9c4a3a" r={r} />
      ))}
      {/* the base and the four porches */}
      <Box p={[0, 0.7, 0]} s={[1.9, 1.2, 1.9]} c={plaster} />
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation-y={(i * Math.PI) / 2}>
          <Box p={[0, 0.55, 1.15]} s={[0.9, 0.9, 0.5]} c={shade} />
          <mesh position={[0, 1.15, 1.15]} castShadow>
            <coneGeometry args={[0.55, 0.5, 4]} />
            <meshStandardMaterial color={plaster} flatShading />
          </mesh>
        </group>
      ))}
      {/* three tiers with corner stupas */}
      {[0, 1, 2].map((k) => {
        const w = 1.6 - k * 0.42;
        const y = 1.45 + k * 0.62;
        return (
          <group key={k}>
            <Box p={[0, y, 0]} s={[w, 0.5, w]} c={k % 2 ? shade : plaster} />
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], j) => (
              <mesh key={j} position={[(a * w) / 2, y + 0.38, (b * w) / 2]} castShadow>
                <coneGeometry args={[0.1, 0.36, 6]} />
                <meshStandardMaterial color={plaster} />
              </mesh>
            ))}
          </group>
        );
      })}
      <mesh position={[0, 3.6, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.42, 0.4, 10]} />
        <meshStandardMaterial color={plaster} />
      </mesh>
      <mesh position={[0, 4.35, 0]} castShadow>
        <coneGeometry args={[0.22, 1.3, 10]} />
        <meshStandardMaterial color={GILT} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
};
const CHAIYA_HOUSES: [number, number][] = Array.from({length: 14}, (_, i) => [
  CHAIYA[0] - 7.5 + (i % 5) * 2.1 + ((i * 7) % 3) * 0.3,
  CHAIYA[1] + 3.2 + Math.floor(i / 5) * 1.9,
]);
const Flames: React.FC<{k: number; t: number; seed: number}> = ({k, t, seed}) => {
  if (k < 0.03) return null;
  return (
    <group scale={k}>
      {[0, 1, 2].map((i) => {
        const f = 0.8 + 0.25 * Math.sin(t * 13 + seed + i * 2.1);
        return (
          <mesh key={i} position={[(i - 1) * 0.22, 0.5 * f, Math.sin(seed + i) * 0.15]} scale={[0.32, f, 0.32]}>
            <coneGeometry args={[1, 1.4, 6]} />
            <meshBasicMaterial color={i === 1 ? '#ffd166' : '#ff7a2f'} toneMapped={false} transparent opacity={0.9} />
          </mesh>
        );
      })}
      {[0, 1, 2].map((i) => {
        const u = (t * 0.45 + i / 3 + seed * 0.1) % 1;
        return (
          <mesh key={`s${i}`} position={[0.2 * Math.sin(seed + i), 1.3 + u * 2.6, 0.1]} scale={0.35 + u * 0.8}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#5c5550" transparent opacity={0.55 * (1 - u)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};
const Hut: React.FC<{burnt?: number}> = ({burnt = 0}) => (
  <group>
    {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map(([x, z], i) => (
      <Box key={i} p={[x, 0.2, z]} s={[0.06, 0.4, 0.06]} c="#5a4630" />
    ))}
    <Box p={[0, 0.5, 0]} s={[0.8, 0.3, 0.8]} c={burnt > 0.5 ? '#3c3430' : '#b89a6a'} />
    {burnt < 0.85 && (
      <mesh position={[0, 0.85, 0]} rotation-y={Math.PI / 4} castShadow>
        <coneGeometry args={[0.72, 0.5, 4]} />
        <meshStandardMaterial color={burnt > 0.5 ? '#2e2a26' : '#8c7a52'} flatShading />
      </mesh>
    )}
  </group>
);
const Chaiya: React.FC<{t: number; Y: number; terrainH: TH}> = ({t, Y, terrainH}) => {
  const f = Y > 1784 && Y < 1787 ? fireK(t) : 0;
  const burnt = Y > 1785.2 ? 1 : f > 0.3 ? 0.6 : 0;
  const b = burmese(t);
  const s = siamese(t);
  return (
    <>
      <group position={[CHAIYA[0], terrainH(CHAIYA[0], CHAIYA[1]), CHAIYA[1]]}>
        <Borommathat />
      </group>
      {Y < 1840 &&
        CHAIYA_HOUSES.map(([x, z], i) => (
          <group key={i} position={[x, terrainH(x, z), z]} rotation-y={i * 0.7} scale={1.3}>
            <Hut burnt={i % 3 === 2 ? 0 : burnt} />
            {i % 3 !== 2 && <Flames k={f * (0.7 + 0.3 * ((i * 5) % 3) / 2)} t={t} seed={i * 1.7} />}
          </group>
        ))}
      {Y > 1784 && Y < 1787 && (
        <>
          <Army f={b} color="#7a2e2a" terrainH={terrainH} />
          <Army f={s} color="#efe9dc" terrainH={terrainH} />
        </>
      )}
    </>
  );
};

// ------------------------------------------------------------------ the royal shipyard, ~2375
const Hull: React.FC<{k: number}> = ({k}) => {
  if (k < 0.02) return null;
  const ribs = 7;
  return (
    <group>
      {/* the keel, then ribs, then planking as k passes 0.5 */}
      <Box p={[0, 0.12, 0]} s={[0.12, 0.12, 3.0 * Math.min(1, k * 2)]} c="#6b4a2a" />
      {Array.from({length: ribs}, (_, i) => {
        if (i / ribs > k * 1.8) return null;
        const z = -1.3 + (i * 2.6) / (ribs - 1);
        const w = 0.55 * Math.cos(((z / 1.6) * Math.PI) / 2.2);
        return (
          <group key={i} position={[0, 0.12, z]}>
            <Seg a={[-w, 0.55, 0]} b={[0, 0, 0]} r0={0.04} r1={0.04} color="#8a6440" />
            <Seg a={[w, 0.55, 0]} b={[0, 0, 0]} r0={0.04} r1={0.04} color="#8a6440" />
          </group>
        );
      })}
      {k > 0.5 && (
        <mesh position={[0, 0.38, 0]} scale={[0.6, 0.38 * Math.min(1, (k - 0.5) * 2.2), 1.6]} castShadow>
          <sphereGeometry args={[1, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color="#6e4a2c" side={2} roughness={0.8} />
        </mesh>
      )}
      {k > 0.85 && (
        <mesh position={[0, 1.3, 0.2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 6]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
      )}
    </group>
  );
};
const Shipyard: React.FC<{t: number; Y: number; terrainH: TH}> = ({t, Y, terrainH}) => {
  if (Y < 1831) return null;
  const old = Y > 1900; // the market grew over it
  if (old) return null;
  const g = terrainH(SHIPYARD[0], SHIPYARD[1]);
  const l = launchK(t);
  const step = t * 6;
  return (
    <group position={[SHIPYARD[0], g, SHIPYARD[1]]} rotation-y={SLIP_DIR}>
      {/* the shed and the timber stack behind the slips (inland, -z local) */}
      <Box p={[0, 0.45, -2.6]} s={[3.4, 0.9, 1.3]} c="#8a6a48" />
      <mesh position={[0, 1.05, -2.6]} rotation-y={Math.PI / 4} scale={[2.6, 1, 1]} castShadow>
        <coneGeometry args={[1.05, 0.5, 4]} />
        <meshStandardMaterial color="#6b5a3a" flatShading />
      </mesh>
      {[0, 1, 2].map((i) => (
        <Seg key={i} a={[1.9 + i * 0.12, 0.08 + i * 0.12, -3.4]} b={[1.9 + i * 0.12, 0.08 + i * 0.12, -1.6]} r0={0.07} r1={0.07} color="#7a5a34" />
      ))}
      {/* two slips running down into the water */}
      {[-0.9, 0.9].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <Box p={[0, 0.03, 0.3]} s={[0.9, 0.06, 3.6]} c="#9a7a54" />
          <group position={[0, 0, i === 0 ? 1.8 * l : 0]}>
            <Hull k={i === 0 ? hullK(0, t) : hullK(1, t)} />
          </group>
        </group>
      ))}
      {/* the shipwrights */}
      {Array.from({length: 6}, (_, i) => (
        <group key={`w${i}`} position={[(i % 3 - 1) * 1.1 + 0.3, 0, -1.2 + Math.floor(i / 3) * 0.9 + Math.sin(step + i) * 0.12]} scale={0.32}>
          <Box p={[0, 0.4, 0]} s={[0.36, 0.8, 0.26]} c={i % 2 ? '#2f3b63' : '#efe9dc'} />
          <Ball p={[0, 0.95, 0]} s={0.17} color="#b07a55" />
        </group>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ Tha Thong moves in; the Chinese shrine
const Shrine: React.FC = () => (
  <group>
    <Box p={[0, 0.35, 0]} s={[1.4, 0.7, 1.0]} c="#c23b2b" />
    <mesh position={[0, 0.9, 0]} scale={[1.7, 0.35, 1.25]} castShadow>
      <cylinderGeometry args={[0.45, 0.6, 1, 4, 1]} />
      <meshStandardMaterial color="#2f6e4f" flatShading />
    </mesh>
    <Box p={[0, 1.18, 0]} s={[1.5, 0.06, 0.1]} c={GILT} />
  </group>
);
const Move: React.FC<{t: number; Y: number; terrainH: TH}> = ({t, Y, terrainH}) => {
  const shrine = Y < 1855 ? 0 : Y > 1870 ? 1 : ramp(beatK('move', t), 0.35, 0.8);
  return (
    <>
      {Array.from({length: MOVE_BOATS}, (_, i) => {
        const b = moveBoatAt(i, t);
        if (!b) return null;
        return (
          <group key={i} position={[b.x, 0.02, b.z]} rotation-y={b.rot} scale={0.85}>
            <RowBoat row={t * 1.6 + i * 0.3} i={i} />
          </group>
        );
      })}
      <Grow k={shrine} at={[SHRINE[0], terrainH(SHRINE[0], SHRINE[1]), SHRINE[1]]} rot={0.5}>
        <Shrine />
      </Grow>
    </>
  );
};

// ------------------------------------------------------------------ Rama VI's barge, 2458
const Landing: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 1914) return null;
  const k = Y > 1916 ? 1 : welcomeK(t);
  const flags = Y < 1916 ? k : 0;
  return (
    <group position={[LANDING[0] + 0.7, 0, LANDING[1]]} rotation-y={-0.45}>
      {/* the timber landing stage out over the water */}
      <Box p={[-0.9, 0.18, 0]} s={[1.8, 0.1, 0.9]} c="#8a6a48" />
      {[-1.6, -0.3].map((x) => (
        <Box key={x} p={[x, 0.08, 0]} s={[0.1, 0.2, 0.9]} c="#5a4630" />
      ))}
      {/* the welcome arch with its flags, up for the visit */}
      {flags > 0.02 && (
        <group scale={[1, flags, 1]}>
          <Box p={[0.4, 0.75, -0.5]} s={[0.1, 1.3, 0.1]} c="#efe9dc" />
          <Box p={[0.4, 0.75, 0.5]} s={[0.1, 1.3, 0.1]} c="#efe9dc" />
          <Box p={[0.4, 1.42, 0]} s={[0.14, 0.18, 1.2]} c={RED} />
          {[-0.4, 0, 0.4].map((z, i) => (
            <Box key={i} p={[0.4, 1.65, z]} s={[0.04, 0.22 + 0.04 * Math.sin(t * 6 + i), 0.18]} c={i === 1 ? '#f4f1ea' : '#2f3b8f'} />
          ))}
        </group>
      )}
    </group>
  );
};
const Barges: React.FC<{t: number}> = ({t}) => (
  <>
    {Array.from({length: BARGES}, (_, i) => {
      const b = bargeAt(i, t);
      if (!b) return null;
      return (
        <group key={i} position={[b.x, 0.02, b.z]} rotation-y={b.rot} scale={i === 0 ? 0.2 : 0.15}>
          <NanBoat t={t + i * 0.3} pairs={i === 0 ? 18 : 14} shirt={i === 0 ? '#c0392b' : '#efe9dc'} band={GILT} L={16} />
          {i === 0 && (
            // the royal pavilion amidships: red and gilt, a tiered roof
            <group position={[0, 1.4, 1.5]}>
              <Box p={[0, 0.8, 0]} s={[1.6, 1.6, 2.6]} c={RED} />
              {[0, 1, 2].map((k) => (
                <mesh key={k} position={[0, 1.9 + k * 0.55, 0]} scale={[1.5 - k * 0.4, 1, 2.3 - k * 0.6]} castShadow>
                  <coneGeometry args={[1, 0.6, 4]} />
                  <meshStandardMaterial color={GILT} metalness={0.4} roughness={0.5} flatShading />
                </mesh>
              ))}
            </group>
          )}
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ Phun Phin station, 2459
const Station: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 1915.9) return null;
  const k = Y > 1917 ? 1 : ramp(beatK('train', t), 0.05, 0.35);
  return (
    <Grow k={k} at={[STATION[0], 0, STATION[1]]} rot={Math.PI / 2} scale={0.85}>
      <Hall roof={1} />
    </Grow>
  );
};

// ------------------------------------------------------------------ the grow shot: oysters and ferries
const OysterHut: React.FC = () => (
  <group>
    {[[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]].map(([x, z], i) => (
      <Box key={i} p={[x, 0.2, z]} s={[0.06, 0.6, 0.06]} c="#5a4630" />
    ))}
    <Box p={[0, 0.55, 0]} s={[0.9, 0.25, 0.9]} c="#b89a6a" />
    <mesh position={[0, 0.85, 0]} rotation-y={Math.PI / 4} castShadow>
      <coneGeometry args={[0.75, 0.4, 4]} />
      <meshStandardMaterial color="#8c7a52" flatShading />
    </mesh>
    {/* the pole grid the oysters grow on */}
    {Array.from({length: 12}, (_, i) => (
      <Box key={`p${i}`} p={[1.2 + (i % 4) * 0.45, 0.15, -0.7 + Math.floor(i / 4) * 0.7]} s={[0.05, 0.4, 0.05]} c="#4a3a28" />
    ))}
  </group>
);
const Bay: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  const k = oysterK(Y);
  return (
    <>
      {OYSTER_HUTS.map(([x, z], i) =>
        i / OYSTER_HUTS.length < k ? (
          <group key={i} position={[x, 0, z]} rotation-y={i * 0.4} scale={1.3}>
            <OysterHut />
          </group>
        ) : null,
      )}
      {Array.from({length: FERRIES}, (_, i) => {
        const f = ferryAt(i, t);
        if (!f) return null;
        return (
          <group key={`f${i}`} position={[f.x, 0.05 + 0.05 * Math.sin(t * 1.6 + i), f.z]} rotation-y={f.rot} scale={1.6}>
            <Box p={[0, 0.2, 0]} s={[1.3, 0.4, 3.4]} c="#f2efe6" />
            <Box p={[0, 0.6, -0.4]} s={[1.0, 0.4, 1.4]} c="#2e6fb0" />
            <Box p={[0, 0.9, -0.6]} s={[0.6, 0.25, 0.6]} c="#f2efe6" />
          </group>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ Chak Phra (the payoff)
/** a phanom phra boat: a hull with naga heads at the bow, a gilt busabok holding the image on a raised
 *  platform, red and gold, pennants (drawn ~2 units long) */
const PhraBoat: React.FC<{t: number; i: number}> = ({t, i}) => (
  <group>
    <mesh position={[0, 0.18, 0]} scale={[0.42, 0.22, 1.2]} castShadow>
      <sphereGeometry args={[1, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      <meshStandardMaterial color={RED} roughness={0.6} side={2} />
    </mesh>
    {/* twin naga heads at the bow (+z) */}
    {[-0.16, 0.16].map((x) => (
      <Seg key={x} a={[x, 0.2, 1.0]} b={[x * 1.3, 0.95, 1.35]} r0={0.07} r1={0.05} color={GILT} />
    ))}
    {/* the platform and the busabok */}
    <Box p={[0, 0.42, -0.1]} s={[0.66, 0.2, 1.3]} c="#efe9dc" />
    <Box p={[0, 0.8, -0.1]} s={[0.4, 0.55, 0.4]} c={RED} />
    {[0, 1, 2, 3].map((k) => (
      <mesh key={k} position={[0, 1.15 + k * 0.22, -0.1]} scale={[1, 1, 1]} castShadow>
        <coneGeometry args={[0.38 - k * 0.08, 0.26, 4]} />
        <meshStandardMaterial color={GILT} metalness={0.45} roughness={0.45} flatShading />
      </mesh>
    ))}
    <mesh position={[0, 2.1, -0.1]}>
      <coneGeometry args={[0.05, 0.6, 6]} />
      <meshStandardMaterial color={GILT} metalness={0.45} roughness={0.45} />
    </mesh>
    {/* pennants */}
    {[-0.3, 0.3].map((x, k) => (
      <group key={x} position={[x, 0.5, -0.6]}>
        <Box p={[0, 0.5, 0]} s={[0.03, 1.0, 0.03]} c="#efe9dc" />
        <Box p={[0, 0.9, 0.14 + 0.03 * Math.sin(t * 5 + i + k)]} s={[0.02, 0.18, 0.26]} c={k ? '#f1c232' : '#2f6e4f'} />
      </group>
    ))}
  </group>
);
const ChakPhra: React.FC<{t: number; Y: number; terrainH: TH}> = ({t, Y, terrainH}) => {
  if (Y < 2024.5) return null;
  const mb = monkeyBack(t);
  const g2 = terrainH(PALM2[0], PALM2[1]);
  return (
    <>
      {Array.from({length: PHRA_BOATS}, (_, i) => {
        const b = phraAt(i, t);
        if (!b) return null;
        return (
          <group key={i} position={[b.x, 0.02, b.z]} rotation-y={b.rot}>
            <group scale={1.1}>
              <PhraBoat t={t} i={i} />
            </group>
            {/* the long boat towing it, ahead on a rope */}
            <group position={[0, 0, 2.6]} scale={0.1}>
              <NanBoat t={t + i * 0.4} pairs={12} shirt={i % 2 ? '#f1c232' : '#2e86c1'} band={RED} L={16} />
            </group>
            <Seg a={[0, 0.3, 1.3]} b={[0, 0.25, 1.9]} r0={0.02} r1={0.02} color="#e9dcb8" />
          </group>
        );
      })}
      {Array.from({length: RACERS}, (_, i) => {
        const r = racerAt(i, t);
        if (!r) return null;
        return (
          <group key={`r${i}`} position={[r.x, 0.02, r.z]} rotation-y={r.rot} scale={0.12}>
            <NanBoat t={t * 1.4 + i * 0.5} pairs={20} shirt={i ? '#c0392b' : '#f1c232'} band={i ? GILT : '#2f3b8f'} L={18} />
          </group>
        );
      })}
      {/* the monkey back on a palm on Ko Lamphu, over the boats */}
      <group position={[PALM2[0], g2, PALM2[1]]} rotation-y={-0.6} scale={CALLBACK_H}>
        <CoconutPalm sway={Math.sin(t * 1.5)} nuts={4} seed={1} />
      </group>
      {mb && mb.grow > 0.02 && (
        <group position={[PALM2[0] + 0.16 * mb.u * mb.u * CALLBACK_H * Math.cos(-0.6), g2 + mb.u * CALLBACK_H - 0.25 * 3.4, PALM2[1] - 0.16 * mb.u * mb.u * CALLBACK_H * Math.sin(-0.6) + 0.045 * CALLBACK_H * Math.cos(-0.6)]} rotation-y={-0.6}>
          <group rotation-y={Math.PI} scale={3.4 * mb.grow}>
            <ClimbingMonkey climb={mb.climb} look={mb.look} />
          </group>
        </group>
      )}
      {/* the market stalls and lamps along Na Mueang */}
      {Array.from({length: 8}, (_, i) => (
        <Box key={`st${i}`} p={[MARKET[0] + 0.5 + (i % 4) * 0.9, 0.25, MARKET[1] + 1.6 + Math.floor(i / 4) * 1.0]} s={[0.7, 0.5, 0.6]} c={i % 2 ? '#f1c232' : '#efe9dc'} />
      ))}
    </>
  );
};

export const SuratThaniLandmarks: React.FC<LandmarkProps> = ({t, Y, terrainH}) => (
  <group>
    <Cover t={t} terrainH={terrainH} />
    <Ships t={t} />
    <Chaiya t={t} Y={Y} terrainH={terrainH} />
    <Shipyard t={t} Y={Y} terrainH={terrainH} />
    <Move t={t} Y={Y} terrainH={terrainH} />
    <Landing t={t} Y={Y} />
    <Barges t={t} />
    <Station t={t} Y={Y} />
    <Bay t={t} Y={Y} />
    <ChakPhra t={t} Y={Y} terrainH={terrainH} />
  </group>
);

export {clamp01};
