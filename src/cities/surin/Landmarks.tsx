import React from 'react';
import * as THREE from 'three';
import {Elephant} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp} from '../../lib';
import {Person} from '../phuket/figures';
import {
  BUFFET_N, buffetAt, CARAVAN, caravanAt, DIGGERS, diggerAt, HEADMEN, headmanAt, HERD_N, herdAt, lassoK, moverAt, MOVERS,
  PARADE_N, paradeAt, ROAD, TABLE, W_CATCH, whiteAt, type Beast,
} from './actors';
import {KuyRider, NECK, SurinElephant, WHITE_ELEPHANT, WHITE_SHADE} from './figures';
import {
  INNER, INNER_W, LAK_MUEANG, MONUMENT, OLD_HALL, OUTER, OUTER_W, STADIUM, THANASAN, WAT_BURAPHARAM, WAT_CHUMPHON, WAT_KLANG,
  WAT_SALA_LOI,
} from './places';

type P = [number, number];
const WATER = '#3f8fc0';
const BANK = '#b9a77c';
const EARTH = '#8d7a52';
const WHITEWASH = '#f1ece0';
const ROOF = '#9b3a2a';
const TIMBER = '#7a5534';
const GOLD = '#d9a43a';
const LATERITE = '#a2603f';

// a growing mesh is gated on its own scale (CLAUDE.md: a mesh at scale 0 blacks out the shader look)
const Grow: React.FC<{k: number; children: React.ReactNode; at: [number, number, number]; rot?: number}> = ({k, children, at, rot = 0}) =>
  k > 0.02 ? (
    <group position={at} rotation-y={rot} scale={[1, Math.max(0.03, k), 1]}>
      {children}
    </group>
  ) : null;

// ------------------------------------------------------------------ water dug edge by edge
/** A moat along `pts` (closed or open), dug edge after edge as `k` runs 0 -> 1. */
const Moat: React.FC<{pts: P[]; closed: boolean; w: number; k: number; rampart?: boolean}> = ({pts, closed, w, k, rampart}) => {
  const edges = closed ? pts.map((a, i) => [a, pts[(i + 1) % pts.length]] as [P, P]) : pts.slice(1).map((b, i) => [pts[i], b] as [P, P]);
  const dug = k * edges.length;
  return (
    <>
      {edges.map(([a, b], i) => {
        const e = Math.min(1, Math.max(0, dug - i));
        if (e <= 0.02) return null;
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]) * e;
        const ux = (b[0] - a[0]) / Math.hypot(b[0] - a[0], b[1] - a[1]);
        const uz = (b[1] - a[1]) / Math.hypot(b[0] - a[0], b[1] - a[1]);
        const cx = a[0] + (ux * len) / 2;
        const cz = a[1] + (uz * len) / 2;
        const rot = Math.atan2(ux, uz);
        // the rampart on the town side (toward the origin)
        const nx = -uz;
        const nz = ux;
        const inward = cx * nx + cz * nz < 0 ? 1 : -1;
        return (
          <group key={i}>
            <mesh position={[cx, 0.05, cz]} rotation-y={rot} receiveShadow>
              <boxGeometry args={[w, 0.06, len + w * 0.6]} />
              <meshStandardMaterial color={WATER} roughness={0.12} metalness={0.25} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[cx + nx * s * (w / 2 + 0.1), 0.07, cz + nz * s * (w / 2 + 0.1)]} rotation-y={rot}>
                <boxGeometry args={[0.25, 0.06, len]} />
                <meshStandardMaterial color={BANK} roughness={1} />
              </mesh>
            ))}
            {rampart && (
              <mesh position={[cx + nx * inward * (w / 2 + 0.75), 0.18, cz + nz * inward * (w / 2 + 0.75)]} rotation-y={rot} castShadow receiveShadow>
                <boxGeometry args={[1.0, 0.36, len + 1]} />
                <meshStandardMaterial color="#7f8a4a" roughness={1} flatShading />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ small buildings and props
const Hut: React.FC<{s?: number; roof?: string}> = ({s = 1, roof = '#b89a5e'}) => (
  <group scale={s}>
    {[-1, 1].map((x) =>
      [-1, 1].map((z) => (
        <mesh key={`${x}${z}`} position={[x * 0.4, 0.3, z * 0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 4]} />
          <meshStandardMaterial color={TIMBER} />
        </mesh>
      )),
    )}
    <mesh position={[0, 0.75, 0]} castShadow>
      <boxGeometry args={[1, 0.4, 0.8]} />
      <meshStandardMaterial color="#9b7a52" />
    </mesh>
    <mesh position={[0, 1.15, 0]} rotation-y={Math.PI / 4} scale={[0.9, 0.5, 0.75]} castShadow>
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial color={roof} flatShading />
    </mesh>
  </group>
);
// a Thai hall: whitewashed walls and a steep red roof
const Hall: React.FC<{w: number; d: number; h: number; roof?: string}> = ({w, d, h, roof = ROOF}) => (
  <group>
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={WHITEWASH} />
    </mesh>
    <mesh position={[0, h + h * 0.35, 0]} rotation-y={Math.PI / 4} scale={[w * 0.72, h * 0.7, d * 0.72]} castShadow>
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial color={roof} flatShading />
    </mesh>
  </group>
);
const Chedi: React.FC<{s: number; color?: string}> = ({s, color = WHITEWASH}) => (
  <group scale={s}>
    <mesh position={[0, 0.25, 0]} castShadow>
      <boxGeometry args={[1.2, 0.5, 1.2]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[0, 0.85, 0]} castShadow>
      <sphereGeometry args={[0.45, 10, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[0, 1.6, 0]} castShadow>
      <coneGeometry args={[0.18, 1.1, 8]} />
      <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.4} />
    </mesh>
  </group>
);
const Temple: React.FC = () => (
  <group>
    <Hall w={2.2} d={1.2} h={0.9} />
    <group position={[0, 0, 1.6]}>
      <Chedi s={0.9} />
    </group>
  </group>
);
// the ox cart of the caravans
const Cart: React.FC<{walk: number}> = ({walk}) => (
  <group>
    <mesh position={[0, 0.55, -0.4]} castShadow>
      <boxGeometry args={[0.7, 0.35, 1.1]} />
      <meshStandardMaterial color={TIMBER} />
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.42, 0.4, -0.4]} rotation-z={Math.PI / 2} rotation-x={walk * 4}>
        <torusGeometry args={[0.35, 0.05, 5, 10]} />
        <meshStandardMaterial color="#5b3e24" />
      </mesh>
    ))}
    {[-1, 1].map((s) => (
      <group key={`ox${s}`} position={[s * 0.3, 0, 0.75]}>
        <mesh position={[0, 0.45, 0]} scale={[0.25, 0.25, 0.5]} castShadow>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#d8cfbd" />
        </mesh>
        <mesh position={[0, 0.5, 0.45]} scale={0.14}>
          <sphereGeometry args={[1, 6, 5]} />
          <meshStandardMaterial color="#cfc4ae" />
        </mesh>
      </group>
    ))}
  </group>
);
const Smoke: React.FC<{t: number; ph: number}> = ({t, ph}) => (
  <>
    {[0, 1, 2].map((i) => {
      const k = (t * 0.45 + ph + i / 3) % 1;
      return (
        <mesh key={i} position={[Math.sin(k * 5 + ph) * 0.2, 0.7 + k * 2.4, 0]} scale={0.25 + k * 0.5}>
          <sphereGeometry args={[1, 7, 5]} />
          <meshStandardMaterial color="#d8d3cc" transparent opacity={0.55 * (1 - k)} depthWrite={false} />
        </mesh>
      );
    })}
  </>
);
const Dust: React.FC<{t: number; s: number}> = ({t, s}) => (
  <>
    {[0, 1, 2, 3].map((i) => {
      const k = (t * 1.6 + i / 4) % 1;
      return (
        <mesh key={i} position={[Math.sin(i * 2.1) * s * 0.4, 0.3 + k * s * 0.5, -s * 1.2 + Math.cos(i * 1.7) * s * 0.4]} scale={s * (0.25 + k * 0.45)}>
          <sphereGeometry args={[1, 7, 5]} />
          <meshStandardMaterial color="#cdb48c" transparent opacity={0.45 * (1 - k)} depthWrite={false} />
        </mesh>
      );
    })}
  </>
);
/** A sagging rope between two world points. */
const Rope: React.FC<{a: THREE.Vector3; b: THREE.Vector3; sag: number}> = ({a, b, sag}) => {
  const mid = a.clone().lerp(b, 0.5);
  mid.y -= sag;
  const curve = new THREE.CatmullRomCurve3([a, mid, b]);
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 16, 0.06, 5, false]} />
      <meshStandardMaterial color="#5a3a20" roughness={1} />
    </mesh>
  );
};

const Beast3: React.FC<{b: Beast; t: number; g: (x: number, z: number) => number; dust?: boolean}> = ({b, t, g, dust}) => (
  <group position={[b.x, g(b.x, b.z), b.z]} rotation-y={b.rot} scale={b.s}>
    <SurinElephant
      walk={b.walk}
      stride={b.stride}
      trunk={b.run ? -0.4 : 0.3}
      ears={b.run ? 0.35 : 0}
      tusks={b.tusks}
      color={b.white ? WHITE_ELEPHANT : undefined}
      shade={b.white ? WHITE_SHADE : undefined}
      t={t + b.walk}
    />
    {b.rider && (
      <group position={NECK} scale={0.95}>
        <KuyRider pole swing={Math.sin(t * 2.4 + b.walk)} />
      </group>
    )}
    {dust && b.run && <Dust t={t + b.walk} s={1} />}
  </group>
);

// ------------------------------------------------------------------ the monument and the show ground
const Monument: React.FC = () => (
  <group>
    {/* the replica wall and gate (ประตูโขง) behind the statue */}
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 2.0, 0.45, -0.8]} castShadow>
        <boxGeometry args={[2.2, 0.9, 0.35]} />
        <meshStandardMaterial color={LATERITE} />
      </mesh>
    ))}
    <mesh position={[0, 1.0, -0.8]} castShadow>
      <boxGeometry args={[1.6, 0.25, 0.5]} />
      <meshStandardMaterial color={LATERITE} />
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={`p${s}`} position={[s * 0.65, 0.5, -0.8]} castShadow>
        <boxGeometry args={[0.3, 1.0, 0.5]} />
        <meshStandardMaterial color={LATERITE} />
      </mesh>
    ))}
    {/* the pedestal and the dark bronze figure with his halberd (ของ้าว) */}
    <mesh position={[0, 0.5, 0.4]} castShadow>
      <boxGeometry args={[1.0, 1.0, 1.0]} />
      <meshStandardMaterial color="#e9e3d6" />
    </mesh>
    <mesh position={[0, 1.4, 0.4]} castShadow>
      <cylinderGeometry args={[0.18, 0.25, 0.8, 8]} />
      <meshStandardMaterial color="#3a3530" metalness={0.4} roughness={0.5} />
    </mesh>
    <mesh position={[0, 1.95, 0.4]} castShadow>
      <sphereGeometry args={[0.15, 8, 6]} />
      <meshStandardMaterial color="#3a3530" metalness={0.4} roughness={0.5} />
    </mesh>
    <mesh position={[0.3, 1.7, 0.4]} castShadow>
      <cylinderGeometry args={[0.03, 0.03, 1.4, 5]} />
      <meshStandardMaterial color="#3a3530" />
    </mesh>
  </group>
);
const Stadium: React.FC = () => (
  <group>
    <mesh position={[0, 0.04, 0]} scale={[4.6, 1, 4.0]} receiveShadow>
      <cylinderGeometry args={[1, 1, 0.08, 32]} />
      <meshStandardMaterial color="#cdb48c" roughness={1} />
    </mesh>
    {[-1, 1].map((s) => (
      <group key={s} position={[s * 5.4, 0, 0]}>
        {[0, 1, 2].map((r) => (
          <mesh key={r} position={[s * r * 0.45, 0.25 + r * 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.45, 0.5 + r * 0.6, 6.5]} />
            <meshStandardMaterial color={r === 2 ? '#c94b3a' : '#d9d2c3'} />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);
const FRUIT = ['#3f9a3a', '#e0402b', '#f2c230', '#7cc04a'];

export const SurinLandmarks: React.FC<LandmarkProps> = ({Y, t, terrainH}) => {
  const g = (x: number, z: number) => terrainH(x, z);
  const pay = Y >= 2024.9;
  const lasso = lassoK(t);
  const white = whiteAt(t);
  return (
    <group>
      {/* ~2,500 years ago: an iron-age village on a moated mound, its furnaces smoking */}
      {Y < 640 && (
        <group position={[-15, g(-15, 3), 3]}>
          <mesh position={[0, 0.15, 0]} scale={[2.4, 1, 2.4]} receiveShadow>
            <cylinderGeometry args={[1, 1.1, 0.3, 20]} />
            <meshStandardMaterial color="#9a8a5c" roughness={1} />
          </mesh>
          <mesh position={[0, 0.04, 0]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[2.9, 3.4, 28]} />
            <meshStandardMaterial color={WATER} roughness={0.15} metalness={0.2} />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return (
              <group key={i} position={[Math.cos(a) * 1.4, 0.3, Math.sin(a) * 1.4]} rotation-y={-a}>
                <Hut s={0.9} />
              </group>
            );
          })}
          {[0, 1].map((i) => (
            <group key={`f${i}`} position={[i * 0.8 - 0.4, 0.3, 0]}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.2, 0.28, 0.4, 8]} />
                <meshStandardMaterial color="#6e4a32" />
              </mesh>
              <Smoke t={t} ph={i * 0.4} />
            </group>
          ))}
          {[0, 1, 2, 3].map((i) => (
            <group key={`p${i}`} position={[Math.cos(i * 1.7) * 0.8, 0.3, Math.sin(i * 1.7) * 0.8]} rotation-y={i * 1.3} scale={0.9}>
              <Person t={t} i={i} />
            </group>
          ))}
        </group>
      )}

      {/* the cover: the wild herd */}
      {Array.from({length: HERD_N}, (_, i) => {
        const b = herdAt(i, t);
        return b ? <Beast3 key={i} b={b} t={t} g={g} /> : null;
      })}

      {/* the inner moat and its rampart, dug 601-638; the outer moat, 1186-1212 */}
      <Moat pts={INNER} closed w={INNER_W} k={ramp(Y, 601, 638)} rampart />
      <Moat pts={OUTER} closed={false} w={OUTER_W} k={ramp(Y, 1186, 1212)} />
      {Array.from({length: DIGGERS}, (_, i) => {
        const d = diggerAt(i, t);
        return d ? (
          <group key={`d${i}`} position={[d.x, g(d.x, d.z), d.z]} rotation-y={d.rot} scale={0.9}>
            <Person t={t} i={i} />
          </group>
        ) : null;
      })}

      {/* the royal road (ราชมรรคา), Jayavarman VII; grassed over by the 1500s */}
      {Y >= 1181 && Y < 1560 && (() => {
        const k = ramp(Y, 1181, 1190) * (1 - ramp(Y, 1450, 1550));
        const [[ax, az], [bx, bz]] = ROAD;
        const len = Math.hypot(bx - ax, bz - az);
        return (
          <mesh position={[(ax + bx) / 2, 0.06, (az + bz) / 2]} rotation-y={Math.atan2(bx - ax, bz - az)} receiveShadow>
            <boxGeometry args={[1.2, 0.05, len]} />
            <meshStandardMaterial color="#b49a6a" roughness={1} transparent opacity={k} />
          </mesh>
        );
      })()}
      {Array.from({length: CARAVAN}, (_, i) => {
        const c = caravanAt(i, t);
        if (!c) return null;
        return (
          <group key={`c${i}`} position={[c.x, g(c.x, c.z), c.z]} rotation-y={c.rot}>
            {c.elephant ? (
              <group scale={1.4}>
                <SurinElephant walk={c.walk} tusks={i === 0} t={t + i} />
                <group position={NECK} scale={0.95}>
                  <KuyRider />
                </group>
              </group>
            ) : (
              <group scale={1.6}>
                <Cart walk={c.walk} />
              </group>
            )}
          </group>
        );
      })}

      {/* 2302: the white elephant and the five headmen; the pond where it was caught */}
      {Y > 1700 && Y < 1770 && (
        <mesh position={[W_CATCH[0] - 3, 0.04, W_CATCH[1] + 3]} rotation-x={-Math.PI / 2} scale={[3, 2, 1]}>
          <circleGeometry args={[1, 24]} />
          <meshStandardMaterial color={WATER} roughness={0.15} metalness={0.2} />
        </mesh>
      )}
      {white && <Beast3 b={white} t={t} g={g} dust />}
      {Array.from({length: HEADMEN}, (_, i) => {
        const h = headmanAt(i, t);
        if (!h) return null;
        const pole = new THREE.Vector3(0.4, NECK[1] + 1.6, NECK[2] + 2.2).multiplyScalar(h.s).applyAxisAngle(new THREE.Vector3(0, 1, 0), h.rot).add(new THREE.Vector3(h.x, g(h.x, h.z), h.z));
        const foot = white
          ? new THREE.Vector3((i % 2 ? 0.42 : -0.42), 0.2, -0.72).multiplyScalar(white.s).applyAxisAngle(new THREE.Vector3(0, 1, 0), white.rot).add(new THREE.Vector3(white.x, g(white.x, white.z), white.z))
          : pole;
        return (
          <group key={`h${i}`}>
            <Beast3 b={h} t={t} g={g} dust />
            {white && lasso > 0 && i !== 2 && <Rope a={pole} b={pole.clone().lerp(foot, lasso)} sag={1.2 * (1 - lasso) + 0.25} />}
          </group>
        );
      })}

      {/* 2306: the move from Ban Mueang Thi */}
      {Array.from({length: MOVERS}, (_, i) => {
        const m = moverAt(i, t);
        if (!m) return null;
        return (
          <group key={`m${i}`} position={[m.x, g(m.x, m.z), m.z]} rotation-y={m.rot}>
            {m.kind === 'elephant' ? (
              <group scale={1.3}>
                <SurinElephant walk={m.walk} tusks={i % 8 === 0} t={t + i} />
                <group position={NECK} scale={0.95}>
                  <KuyRider />
                </group>
              </group>
            ) : m.kind === 'cart' ? (
              <group scale={1.6}>
                <Cart walk={m.walk} />
              </group>
            ) : (
              <group scale={1.0}>
                <Person t={t} i={i} />
              </group>
            )}
          </group>
        );
      })}
      {/* the governor's house (จวน), its elephant kraals and the ศาลปะกำ; the provincial hall from 2451 */}
      {Y >= 1763 && Y < 1908 && (
        <Grow k={ramp(Y, 1762.7, 1764.5)} at={[OLD_HALL[0], g(...OLD_HALL), OLD_HALL[1]]}>
          <Hut s={2.2} roof="#7b5a3a" />
        </Grow>
      )}
      {Y >= 1763 && Y < 1960 &&
        [0, 1].map((i) => {
          const x = OLD_HALL[0] - 4 - i * 2.6;
          const z = OLD_HALL[1] + 1.5;
          return (
            <Grow key={`k${i}`} k={ramp(Y, 1763, 1765)} at={[x, g(x, z), z]}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => {
                const a = (j / 8) * Math.PI * 2;
                return (
                  <mesh key={j} position={[Math.cos(a) * 1.0, 0.35, Math.sin(a) * 1.0]}>
                    <cylinderGeometry args={[0.06, 0.06, 0.7, 4]} />
                    <meshStandardMaterial color={TIMBER} />
                  </mesh>
                );
              })}
              <mesh position={[0, 0.5, 0]} rotation-x={Math.PI / 2}>
                <torusGeometry args={[1.0, 0.04, 4, 16]} />
                <meshStandardMaterial color={TIMBER} />
              </mesh>
            </Grow>
          );
        })}
      {Y >= 1908 && (
        <Grow k={ramp(Y, 1908, 1912)} at={[OLD_HALL[0], g(...OLD_HALL), OLD_HALL[1]]}>
          <Hall w={3.4} d={1.6} h={1.2} roof="#7f8f99" />
        </Grow>
      )}
      {/* temples */}
      {Y >= 1785 &&
        [WAT_KLANG, WAT_BURAPHARAM, WAT_SALA_LOI, WAT_CHUMPHON].map((p, i) => (
          <Grow key={`w${i}`} k={ramp(Y, 1785 + i * 8, 1800 + i * 8)} at={[p[0], g(p[0], p[1]), p[1]]} rot={i * 0.3}>
            <Temple />
          </Grow>
        ))}
      {/* ศาลหลักเมือง, raised again in 2517 */}
      {Y >= 1974 && (
        <Grow k={ramp(Y, 1974, 1976)} at={[LAK_MUEANG[0], g(...LAK_MUEANG), LAK_MUEANG[1]]}>
          <Hall w={1.2} d={1.2} h={0.8} roof={GOLD} />
        </Grow>
      )}

      {/* 2469: shophouses along ถนนธนสาร, from the station into town */}
      {Y >= 1926 &&
        Array.from({length: 7}, (_, i) => {
          const [[ax, az], [bx, bz]] = THANASAN;
          const u = 0.12 + i * 0.12;
          const rot = Math.atan2(bx - ax, bz - az);
          const nx = Math.cos(rot);
          const nz = -Math.sin(rot);
          return [-1, 1].map((s) => {
            const x = ax + (bx - ax) * u + nx * s * 1.2;
            const z = az + (bz - az) * u + nz * s * 1.2;
            return (
              <Grow key={`sh${i}${s}`} k={ramp(Y, 1926.05 + i * 0.03, 1926.3 + i * 0.02)} at={[x, g(x, z), z]} rot={rot}>
                <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.9, 1.0, 1.0]} />
                  <meshStandardMaterial color={i % 2 ? '#c9a46e' : '#b98a58'} />
                </mesh>
                <mesh position={[0, 1.1, 0]} rotation-z={Math.PI / 4} scale={[0.5, 0.5, 1.02]}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color="#8a8f8f" />
                </mesh>
              </Grow>
            );
          });
        })}

      {/* 2505: the show ground and the parade */}
      {Y >= 1962 && (
        <Grow k={ramp(Y, 1962.0, 1962.2)} at={[STADIUM[0], g(...STADIUM), STADIUM[1]]}>
          <Stadium />
        </Grow>
      )}
      {Array.from({length: PARADE_N}, (_, i) => {
        const b = paradeAt(i, t);
        return b ? (
          <group key={`pa${i}`}>
            <Beast3 b={b} t={t} g={g} />
            <group position={[b.x, g(b.x, b.z) + 2.3 * b.s, b.z]} rotation-y={b.rot} scale={b.s * 0.9}>
              <mesh>
                <boxGeometry args={[0.9, 0.35, 0.9]} />
                <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.4} />
              </mesh>
            </group>
          </group>
        ) : null;
      })}

      {/* 2528: the founder's monument on the south moat */}
      {Y >= 1985 && (
        <Grow k={ramp(Y, 1985, 1988)} at={[MONUMENT[0], g(...MONUMENT), MONUMENT[1]]}>
          <Monument />
        </Grow>
      )}

      {/* the payoff: the buffet table and the herd come back to it */}
      {pay && (
        <group>
          {(() => {
            const [[ax, az], [, bz]] = TABLE;
            const len = bz - az;
            return (
              <group position={[ax, g(ax, (az + bz) / 2), (az + bz) / 2]}>
                <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.0, 0.1, len]} />
                  <meshStandardMaterial color="#c0302a" />
                </mesh>
                {Array.from({length: 10}, (_, i) => (
                  <mesh key={i} position={[0, 0.25, -len / 2 + 0.5 + i * (len - 1) / 9]}>
                    <boxGeometry args={[0.9, 0.45, 0.1]} />
                    <meshStandardMaterial color="#8a2a22" />
                  </mesh>
                ))}
                {Array.from({length: 40}, (_, i) => (
                  <mesh key={`f${i}`} position={[((i % 3) - 1) * 0.28, 0.6, -len / 2 + 0.3 + (i * (len - 0.6)) / 39]} castShadow>
                    <sphereGeometry args={[0.13 + (i % 2) * 0.05, 7, 5]} />
                    <meshStandardMaterial color={FRUIT[i % 4]} />
                  </mesh>
                ))}
              </group>
            );
          })()}
          {Array.from({length: BUFFET_N}, (_, i) => {
            const b = buffetAt(i, t);
            return b ? <Beast3 key={`bu${i}`} b={b} t={t} g={g} /> : null;
          })}
          {Array.from({length: 22}, (_, i) => {
            const x = TABLE[0][0] + 1.6 + (i % 2) * 0.6;
            const z = TABLE[0][1] + 0.3 + i * 0.45;
            return (
              <group key={`cr${i}`} position={[x, g(x, z), z]} rotation-y={-Math.PI / 2} scale={0.9}>
                <Person t={t} i={i} />
              </group>
            );
          })}
        </group>
      )}

      {/* earth heaps where the moat is being dug */}
      {Y > 600 && Y < 640 &&
        INNER.map(([x, z], i) => (
          <mesh key={`e${i}`} position={[x * 0.9, 0.2, z * 0.9]} scale={[0.8, 0.4, 0.8]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color={EARTH} roughness={1} />
          </mesh>
        ))}
      {/* Kuy elephant villages' elephants, standing at the edge of the town */}
      {Y >= 1764 && Y < 1960 && !pay &&
        [0, 1, 2].map((i) => {
          const x = OLD_HALL[0] - 4 - i * 2.6;
          const z = OLD_HALL[1] + 1.5;
          return (
            <group key={`ke${i}`} position={[x, g(x, z), z]} rotation-y={i * 1.4} scale={0.55}>
              <Elephant step={Math.sin(t * 2 + i) * 0.4} />
            </group>
          );
        })}
    </group>
  );
};
