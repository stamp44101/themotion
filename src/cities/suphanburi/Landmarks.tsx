import React, {useMemo} from 'react';
import * as THREE from 'three';
import {lathe, Prang, Viharn} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp} from '../../lib';
import {Walker} from '../nan/figures';
import {Raft, RowBoat, Tamarind} from '../phetchabun/figures';
import {
  BUILDERS, builderAt, BUSES, busAt, clamp01, clearK, DIGGERS, diggerAt, DUEL_END, duelAt, hallK, IMPACT, MAIL_N, mailBoatAt, PAY_S,
  reenactAt, ROYAL_N, royalBoatAt, STUPA_AT, STUPA_H, stupaHeight, stupaRise,
} from './actors';
import {DRAGON, FIELD, MAHATHAT, MOAT, NORTH_FORT, PALELAI, PHRA_RUP, PILLAR, TOWER, WAT_KHAE, WEST_GATE} from './places';
import {HERO_S} from './timeline';
import {Dust, Flash, SIDES, WarElephant} from './warElephant';

type P = [number, number];
const WATER = '#3f8fc0';
const BRICK = '#a9583c';
const GILT = '#d9a43a';
const smooth01 = (x: number) => x * x * (3 - 2 * x);

// a growing mesh is gated on its own scale (CLAUDE.md: a mesh at scale 0 blacks out the shader look)
const Grow: React.FC<{k: number; children: React.ReactNode; at: [number, number, number]; rot?: number}> = ({k, children, at, rot = 0}) =>
  k > 0.02 ? (
    <group position={at} rotation-y={rot} scale={[1, Math.max(0.03, k), 1]}>
      {children}
    </group>
  ) : null;

/** a strip along `pts` (moat water or a bank), flat-topped */
const Strip: React.FC<{pts: P[]; w: number; y: number; h: number; color: string; water?: boolean}> = ({pts, w, y, h, color, water}) => (
  <>
    {pts.slice(1).map((b, i) => {
      const a = pts[i];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return (
        <group key={i}>
          <mesh position={[(a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2]} rotation-y={Math.atan2(b[0] - a[0], b[1] - a[1])} receiveShadow>
            <boxGeometry args={[w, h, len]} />
            <meshStandardMaterial color={color} roughness={water ? 0.12 : 1} metalness={water ? 0.25 : 0} />
          </mesh>
          <mesh position={[a[0], y, a[1]]} receiveShadow>
            <cylinderGeometry args={[w / 2, w / 2, h, 12]} />
            <meshStandardMaterial color={color} roughness={water ? 0.12 : 1} metalness={water ? 0.25 : 0} />
          </mesh>
        </group>
      );
    })}
  </>
);

// ------------------------------------------------------------------ the old town's defences
/** The moat round the land sides and the earth rampart inside it, standing from before the clip; the
 *  restored west gate and the north fort. */
const Defences: React.FC = () => {
  // the rampart runs 0.7 inside the moat (toward the town's centre)
  const inner = useMemo(() => MOAT.map(([x, z]) => {
    const dx = 2 - x;
    const dz = 0 - z;
    const r = Math.hypot(dx, dz) || 1;
    return [x + (dx / r) * 0.75, z + (dz / r) * 0.75] as P;
  }), []);
  return (
    <>
      <Strip pts={MOAT} w={0.5} y={0.06} h={0.06} color={WATER} water />
      <Strip pts={inner} w={0.55} y={0.12} h={0.24} color="#8f7d55" />
      <group position={[WEST_GATE[0], 0, WEST_GATE[1]]} rotation-y={0.1}>
        {[-0.7, 0.7].map((s) => (
          <mesh key={s} position={[0.6, 0.7, s]} castShadow>
            <boxGeometry args={[0.7, 1.4, 0.5]} />
            <meshStandardMaterial color={BRICK} roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0.6, 1.5, 0]} castShadow>
          <boxGeometry args={[0.8, 0.25, 2.0]} />
          <meshStandardMaterial color={BRICK} roughness={0.9} />
        </mesh>
      </group>
      <mesh position={[NORTH_FORT[0], 0.45, NORTH_FORT[1] + 0.6]} rotation-y={Math.PI / 4} castShadow>
        <boxGeometry args={[1.3, 0.9, 1.3]} />
        <meshStandardMaterial color={BRICK} roughness={0.9} />
      </mesh>
    </>
  );
};

// ------------------------------------------------------------------ temples and the town's landmarks
/** Luang Pho To (หลวงพ่อโต): a great seated image with the legs down (ปางป่าเลไลยก์), drawn ~4x. The
 *  hall rises round it in the 'palelai' beat. */
const LuangPhoTo: React.FC = () => (
  <group>
    <mesh position={[0, 0.35, 0]} castShadow>
      <boxGeometry args={[1.4, 0.7, 1.0]} />
      <meshStandardMaterial color="#e3dac6" roughness={0.9} />
    </mesh>
    {[-0.22, 0.22].map((x) => (
      <mesh key={x} position={[x, 0.55, 0.45]} castShadow>
        <boxGeometry args={[0.22, 0.6, 0.24]} />
        <meshStandardMaterial color={GILT} metalness={0.5} roughness={0.4} />
      </mesh>
    ))}
    <mesh position={[0, 1.15, 0.05]} scale={[1, 1, 0.7]} castShadow>
      <cylinderGeometry args={[0.38, 0.5, 1.0, 14]} />
      <meshStandardMaterial color={GILT} metalness={0.5} roughness={0.4} />
    </mesh>
    <mesh position={[0, 1.88, 0.05]} castShadow>
      <sphereGeometry args={[0.28, 14, 12]} />
      <meshStandardMaterial color={GILT} metalness={0.5} roughness={0.4} />
    </mesh>
    <mesh position={[0, 2.2, 0.05]} castShadow>
      <coneGeometry args={[0.1, 0.32, 10]} />
      <meshStandardMaterial color={GILT} metalness={0.55} roughness={0.35} />
    </mesh>
  </group>
);

const PaLelai: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  const k = hallK(t, Y);
  return (
    <group position={[PALELAI[0], 0, PALELAI[1]]}>
      <LuangPhoTo />
      {/* the hall goes up round the image: its back and side walls first, the roof last; it is
          open on the camera's side (the drone sees the image, not just roof) */}
      <Grow k={k} at={[0, 0, 0]}>
        {[-1.3, 1.3].map((x) => (
          <mesh key={x} position={[x, 1.3, -0.1]} castShadow>
            <boxGeometry args={[0.2, 2.6, 2.6]} />
            <meshStandardMaterial color="#f1e9da" roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 1.3, -1.35]} castShadow>
          <boxGeometry args={[2.8, 2.6, 0.2]} />
          <meshStandardMaterial color="#f1e9da" roughness={0.9} />
        </mesh>
      </Grow>
      {k > 0.85 && (
        <mesh position={[0, 3.0, -0.1]} rotation-y={Math.PI / 2} scale={[1.6, 0.9, 1.7]} castShadow>
          <coneGeometry args={[1, 1, 4]} />
          <meshStandardMaterial color="#b0362a" flatShading roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* the scaffold while it is being restored */}
      {k > 0.02 && k < 0.98 &&
        [-1, 1].map((x) =>
          [-1, 1].map((z) => (
            <mesh key={`${x}${z}`} position={[x * 0.9, 1.3, z * 0.75 + 0.1]}>
              <cylinderGeometry args={[0.04, 0.04, 2.6, 4]} />
              <meshStandardMaterial color="#8a6a3a" />
            </mesh>
          )),
        )}
    </group>
  );
};

const WatKhae: React.FC = () => (
  <group position={[WAT_KHAE[0] - 1.6, 0, WAT_KHAE[1] + 0.4]}>
    <Viharn pos={[0, 0, 0]} k={1} scale={0.55} rot={Math.PI / 2} />
    {/* Khun Phaen's giant tamarind */}
    <group position={[0.4, 0, 1.6]}>
      <Tamarind s={2.6} />
    </group>
  </group>
);

/** the dragon of the Dragon Descendants Museum (opened ~2551), wrapped round the pillar shrine: drawn
 *  2x (a 135 m body = 5.4 units) */
const Dragon: React.FC<{k: number}> = ({k}) => {
  const geo = useMemo(() => {
    const pts = Array.from({length: 40}, (_, i) => {
      const u = i / 39;
      const a = u * Math.PI * 2.4;
      const r = 1.3 - 0.3 * u;
      return new THREE.Vector3(Math.cos(a) * r, 0.25 + u * 1.1 + 0.15 * Math.sin(u * 18), Math.sin(a) * r);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.17, 10, false);
  }, []);
  if (k < 0.02) return null;
  return (
    <group position={[DRAGON[0], 0, DRAGON[1]]} scale={[1, Math.max(0.03, k), 1]}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color="#3f8f4a" metalness={0.35} roughness={0.45} emissive="#c9a54a" emissiveIntensity={0.1} />
      </mesh>
      {/* the head at the top of the coil, gilt, facing out */}
      <mesh position={[1.0 * Math.cos(Math.PI * 2.4), 1.45, 1.0 * Math.sin(Math.PI * 2.4)]} scale={[0.32, 0.26, 0.5]} castShadow>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={GILT} metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
};

/** Banharn-Jamsai tower (2533-2537, 123 m), drawn ~2x: a slim shaft and a viewing pod */
const Tower: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group position={[TOWER[0], 0, TOWER[1]]} scale={[1, Math.max(0.03, k), 1]}>
      <mesh position={[0, 2.6, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.32, 5.2, 12]} />
        <meshStandardMaterial color="#e8e2d4" roughness={0.6} />
      </mesh>
      <mesh position={[0, 3.9, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.45, 0.45, 16]} />
        <meshStandardMaterial color="#d9a43a" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[0.08, 0.7, 8]} />
        <meshStandardMaterial color="#d9a43a" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );

// ------------------------------------------------------------------ Don Chedi
// a Lanka bell stupa, height 1 (the duel's, and the 2495-2502 one built over the old base)
const BELL: [number, number][] = [
  [0, 0], [0.42, 0], [0.42, 0.06], [0.36, 0.06], [0.36, 0.12], [0.3, 0.12], [0.3, 0.17], [0.27, 0.19], [0.3, 0.26],
  [0.29, 0.36], [0.24, 0.44], [0.15, 0.49], [0.11, 0.5], [0.11, 0.56], [0.075, 0.56], [0.07, 0.62], [0.05, 0.75],
  [0.03, 0.88], [0.012, 0.97], [0, 1],
];
const Stupa: React.FC<{H: number; k: number; ruin?: number; night?: number}> = ({H, k, ruin = 0, night = 0}) => {
  const geo = useMemo(() => lathe(BELL, 28), []);
  if (k < 0.02) return null;
  // a ruin is a low, broken, overgrown stump of the same profile
  const h = H * k * (1 - 0.82 * ruin);
  return (
    <group scale={[H, Math.max(0.03, h), H]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={ruin > 0.5 ? '#8f8a6e' : '#f1ece0'} roughness={0.8} emissive="#ffd38a" emissiveIntensity={night * 0.25} />
      </mesh>
      {ruin < 0.5 && (
        <mesh position={[0, 0.8, 0]} scale={[0.07, 0.21, 0.07]}>
          <cylinderGeometry args={[0.3, 1, 1, 12]} />
          <meshStandardMaterial color={GILT} metalness={0.55} roughness={0.35} />
        </mesh>
      )}
    </group>
  );
};

const DonChedi: React.FC<{Y: number; t: number; night: number}> = ({Y, t, night}) => {
  // the duel's stupa: giant as it rises, settling to the field's scale; then left to ruin; the
  // mound cleared under Rama VI; the new stupa built over it (2495-2502)
  const inDuel = t < DUEL_END;
  const rebuilt = ramp(Y, 1952, 1959);
  const overgrown = !inDuel && Y < 1912 ? 1 : 1 - clearK(t, Y);
  return (
    <group position={[STUPA_AT[0], 0, STUPA_AT[1]]}>
      {inDuel ? (
        <Stupa H={stupaHeight(t)} k={stupaRise(t)} />
      ) : rebuilt > 0.02 ? (
        <Stupa H={STUPA_H} k={rebuilt} night={night} />
      ) : (
        <Stupa H={STUPA_H} k={1} ruin={1} />
      )}
      {/* the jungle that grew over the ruin, cleared in the 'found' beat */}
      {!inDuel && rebuilt < 0.02 && overgrown > 0.02 &&
        Array.from({length: 8}, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <Grow key={i} k={overgrown} at={[Math.cos(a) * 1.4, 0, Math.sin(a) * 1.4]}>
              <Tamarind s={1.2} />
            </Grow>
          );
        })}
      {/* the monument before the stupa (2502): the king on his elephant, small and plain */}
      {Y > 1958.9 && (
        <group position={[0, 0, -3.2]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[1.4, 0.6, 1.4]} />
            <meshStandardMaterial color="#e8e2d2" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/** the two war elephants of the duel (the cover) */
const Duel: React.FC<{t: number}> = ({t}) => {
  if (t > DUEL_END) return null;
  const d = duelAt(t);
  const S = d.S;
  const gait = t * (d.charging ? 1.5 : 0.6);
  const stride = d.charging ? 1 : Math.max(0.2, 1 - (t - IMPACT) / 1.5);
  const flashU = (t - IMPACT + 0.05) / 0.85;
  const k = S / HERO_S;
  return (
    <group>
      <mesh position={[FIELD[0], 0.03, FIELD[1]]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[Math.max(3, 3.2 * S), 48]} />
        <meshStandardMaterial color="#c8b07c" roughness={1} />
      </mesh>
      <group position={[d.siam, 0, FIELD[1]]} rotation-y={Math.PI / 2} scale={S}>
        <WarElephant walk={gait} stride={stride} t={t} side={SIDES.siam} swing={d.swing} trunk={-0.7} />
      </group>
      <group position={[d.hongsa, 0, FIELD[1]]} rotation-y={-Math.PI / 2 + d.turn} scale={S}>
        <WarElephant walk={gait + 0.5} stride={stride} t={t + 0.7} side={SIDES.hongsa} swing={d.swing * 0.9} trunk={-0.5} />
      </group>
      {Array.from({length: 10}, (_, i) => {
        const u = ((t + i * 0.13) % 1.3) / 1.3;
        const back = (i % 2 ? 1 : -1) * (2.4 * HERO_S + (i % 5) * 0.4 * HERO_S) * (1 - 0.5 * clamp01(t / IMPACT)) * k;
        return (
          <group key={i} position={[FIELD[0] + back * (1 - u * 0.2), 0, FIELD[1] + (i % 3 - 1) * 0.6 * S]}>
            <Dust u={t < 2.5 ? u : 0} r={0.45 * S} />
          </group>
        );
      })}
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const u = (t - IMPACT) / 1.6;
        return (
          <group key={`b${i}`} position={[FIELD[0] + Math.cos(a) * u * 1.6 * S, 0, FIELD[1] + Math.sin(a) * u * S]}>
            <Dust u={u} r={0.85 * S} />
          </group>
        );
      })}
      <group position={[(d.siam + d.hongsa) / 2, 3.7 * S, FIELD[1]]}>
        <Flash u={flashU} r={1.1 * S} />
      </group>
    </group>
  );
};

/** the payoff: the fair at Don Chedi; the re-enactment, the crowd, the lights */
const Fair: React.FC<{t: number; night: number}> = ({t}) => {
  const r = reenactAt(t);
  if (!r) return null;
  const gait = t * (r.moving ? 1.3 : 0.2);
  return (
    <group>
      <mesh position={[FIELD[0], 0.03, FIELD[1] + 1]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[6.5, 40]} />
        <meshStandardMaterial color="#c8b07c" roughness={1} />
      </mesh>
      <group position={[r.siam, 0, r.z]} rotation-y={Math.PI / 2} scale={PAY_S}>
        <WarElephant walk={gait} stride={r.moving ? 1 : 0.15} t={t} side={SIDES.siam} swing={r.swing} trunk={-0.6} />
      </group>
      <group position={[r.hongsa, 0, r.z]} rotation-y={-Math.PI / 2} scale={PAY_S}>
        <WarElephant walk={gait + 0.5} stride={r.moving ? 1 : 0.15} t={t + 0.7} side={SIDES.hongsa} swing={r.swing * 0.9} trunk={-0.5} />
      </group>
      {r.clash && (
        <group position={[FIELD[0], 3.6 * PAY_S, r.z]}>
          <Flash u={((t * 2.2) % 1) * 0.6} r={0.8 * PAY_S} />
        </group>
      )}
      {/* the crowd round the arena and the strings of lights */}
      {Array.from({length: 40}, (_, i) => {
        const a = (i / 40) * Math.PI * 2;
        const x = FIELD[0] + Math.cos(a) * 7.4;
        const z = FIELD[1] - 0.5 + Math.sin(a) * 6.2;
        // leave the stupa's side (south) open
        if (z > FIELD[1] + 3.2) return null;
        return (
          <group key={i} position={[x, 0, z]} rotation-y={-a - Math.PI / 2} scale={0.5}>
            <Walker step={t * 0.3 + i * 0.2} i={i} still />
          </group>
        );
      })}
      {Array.from({length: 26}, (_, i) => {
        const a = (i / 26) * Math.PI * 2;
        return (
          <mesh key={`l${i}`} position={[FIELD[0] + Math.cos(a) * 8.2, 1.6 + 0.2 * Math.sin(i), FIELD[1] - 0.5 + Math.sin(a) * 7]}>
            <sphereGeometry args={[0.12, 8, 6]} />
            <meshBasicMaterial color={i % 3 ? '#ffd36a' : '#ff8a5a'} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ boats, buses
const MailBoat: React.FC = () => (
  <group>
    <mesh position={[0, 0.2, 0]} scale={[0.5, 0.25, 1.5]} castShadow>
      <sphereGeometry args={[1, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
      <meshStandardMaterial color="#a8231c" roughness={0.7} side={2} />
    </mesh>
    <mesh position={[0, 0.45, -0.1]} castShadow>
      <boxGeometry args={[0.8, 0.45, 2.2]} />
      <meshStandardMaterial color="#c9372c" roughness={0.7} />
    </mesh>
    <mesh position={[0, 0.85, -0.2]} castShadow>
      <boxGeometry args={[0.85, 0.35, 1.8]} />
      <meshStandardMaterial color="#f1ece0" roughness={0.8} />
    </mesh>
    <mesh position={[0, 1.08, -0.2]} castShadow>
      <boxGeometry args={[0.95, 0.08, 2.0]} />
      <meshStandardMaterial color="#5a3d26" roughness={0.9} />
    </mesh>
  </group>
);
const Bus: React.FC<{bus: boolean}> = ({bus}) => (
  <group>
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[0.85, bus ? 0.7 : 0.45, bus ? 2.4 : 1.4]} />
      <meshStandardMaterial color={bus ? '#2f6fb0' : '#e8e2d4'} roughness={0.6} />
    </mesh>
    <mesh position={[0, bus ? 0.7 : 0.62, 0]}>
      <boxGeometry args={[0.87, 0.18, bus ? 2.2 : 0.9]} />
      <meshStandardMaterial color="#9fc3d6" roughness={0.2} metalness={0.3} />
    </mesh>
    {[-1, 1].map((z) =>
      [-1, 1].map((x) => (
        <mesh key={`${z}${x}`} position={[x * 0.45, 0.17, z * (bus ? 0.8 : 0.45)]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.17, 0.17, 0.1, 10]} />
          <meshStandardMaterial color="#1f1f1f" />
        </mesh>
      )),
    )}
  </group>
);

export const SuphanburiLandmarks: React.FC<LandmarkProps> = ({Y, t, night}) => (
  <>
    <Defences />
    <Prang pos={[MAHATHAT[0], 0, MAHATHAT[1]]} k={1} scale={0.42} color="#d9c7a8" />
    <Viharn pos={[MAHATHAT[0] + 1.6, 0, MAHATHAT[1] + 0.2]} k={1} scale={0.5} rot={Math.PI / 2} />
    <Viharn pos={[PHRA_RUP[0], 0, PHRA_RUP[1]]} k={1} scale={0.45} rot={Math.PI / 2} />
    {/* the pillar shrine */}
    <mesh position={[PILLAR[0], 0.35, PILLAR[1]]} castShadow>
      <boxGeometry args={[0.9, 0.7, 0.9]} />
      <meshStandardMaterial color="#c0392b" roughness={0.7} />
    </mesh>
    <PaLelai Y={Y} t={t} />
    {Array.from({length: BUILDERS}, (_, i) => {
      const b = builderAt(i, t);
      return b ? (
        <group key={`b${i}`} position={[b.x, 0, b.z]} rotation-y={b.rot} scale={0.55}>
          <Walker step={b.step} i={i} load={i % 2 === 0} />
        </group>
      ) : null;
    })}
    <WatKhae />
    <Dragon k={ramp(Y, 2004, 2008.5)} />
    <Tower k={smooth01(ramp(Y, 1990.4, 1994.8))} />

    <Duel t={t} />
    <DonChedi Y={Y} t={t} night={night} />
    {Array.from({length: DIGGERS}, (_, i) => {
      const d = diggerAt(i, t);
      return d ? (
        <group key={`d${i}`} position={[d.x, 0, d.z]} rotation-y={d.rot} scale={0.55}>
          <Walker step={d.step} i={i} load={i % 3 === 0} />
        </group>
      ) : null;
    })}
    <Fair t={t} night={night} />

    {Array.from({length: ROYAL_N}, (_, i) => {
      const b = royalBoatAt(i, t);
      return b ? (
        <group key={`r${i}`} position={[b.x, 0.12, b.z]} rotation-y={b.rot} scale={b.barge ? 0.6 : 0.55}>
          {b.barge ? <Raft /> : <RowBoat row={b.row} i={i} />}
        </group>
      ) : null;
    })}
    {Array.from({length: MAIL_N}, (_, i) => {
      const b = mailBoatAt(i, t);
      return b ? (
        <group key={`m${i}`} position={[b.x, 0.08, b.z]} rotation-y={b.rot} scale={0.62}>
          <MailBoat />
        </group>
      ) : null;
    })}
    {Array.from({length: BUSES}, (_, i) => {
      const b = busAt(i, t);
      return b ? (
        <group key={`v${i}`} position={[b.x, 0, b.z]} rotation-y={b.rot} scale={0.7}>
          <Bus bus={b.bus} />
        </group>
      ) : null;
    })}
  </>
);
