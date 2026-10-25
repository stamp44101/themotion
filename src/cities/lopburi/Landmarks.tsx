import React from 'react';
import * as THREE from 'three';
import {Elephant, lathe, PRANG as PRANG_PROFILE} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp, smooth} from '../../lib';
import {Person} from '../phuket/figures';
import {along, elephantAt, fleetAt, HANUMAN_S, hanumanAt, junkAt, lavoBoatAt, monkeyAt, PIPE, PIPE_LEN, pipeK, processionAt, RET_LAND, TROOP_N} from './actors';
import {Hanuman, Macaque, PrangSamYot, SittingMacaque} from './figures';
import {
  DUSIT, PALACE, PHIMAN, PHRA_CHAO_HAO, POM_CHAI_CHANA, POM_THA_PHO, PRANG, PRANG_KHAEK, PRATU_CHAI, RECEPTION, riverX,
  SAN_PAOLO, SAN_PHRA_KAN, SUTTHA, VICHAYEN, WAT_MAHATHAT, WAT_NAKHON_KOSA,
} from './places';

const BRICK = '#a8553a';
const LATERITE = '#a2603f';
const WHITEWASH = '#f1ece0';
const ROOF = '#9b3a2a';
const GOLD = '#d9a43a';

// a growing mesh is gated on its own scale (CLAUDE.md: a mesh at scale 0 blacks out the shader look)
const Grow: React.FC<{k: number; children: React.ReactNode; at: [number, number, number]; rot?: number}> = ({k, children, at, rot = 0}) =>
  k > 0.02 ? (
    <group position={at} rotation-y={rot} scale={[1, Math.max(0.03, k), 1]}>
      {children}
    </group>
  ) : null;

// ------------------------------------------------------------------ small buildings
const PRANG_GEO = lathe(PRANG_PROFILE, 10);
const Prang: React.FC<{color: string; s: number}> = ({color, s}) => (
  <group scale={s}>
    <mesh geometry={PRANG_GEO} castShadow receiveShadow>
      <meshStandardMaterial color={color} flatShading roughness={0.95} />
    </mesh>
  </group>
);
// a Thai hall: whitewashed walls and a steep stacked red roof
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
// a European house (บ้านวิชาเยนทร์, พิมานมงกุฎ): white, flat-fronted, a low hipped roof
const WesternHouse: React.FC<{w: number; d: number; h: number; floors?: number}> = ({w, d, h, floors = 2}) => (
  <group>
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#f4f1e8" />
    </mesh>
    {Array.from({length: floors}, (_, f) =>
      [-1, 0, 1].map((k) => (
        <mesh key={`${f}${k}`} position={[k * w * 0.3, (h / floors) * (f + 0.55), d / 2 + 0.01]}>
          <planeGeometry args={[w * 0.12, (h / floors) * 0.45]} />
          <meshStandardMaterial color="#5d4a3a" />
        </mesh>
      )),
    )}
    <mesh position={[0, h + 0.25, 0]} rotation-y={Math.PI / 4} scale={[w * 0.75, 0.5, d * 0.75]} castShadow>
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial color="#8a5a40" flatShading />
    </mesh>
  </group>
);
const Fort: React.FC = () => (
  <group>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1.1, 1.3, 1, 5]} />
      <meshStandardMaterial color={WHITEWASH} flatShading />
    </mesh>
    {Array.from({length: 10}, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.cos(a) * 1.05, 1.1, Math.sin(a) * 1.05]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color={WHITEWASH} />
        </mesh>
      );
    })}
  </group>
);
const Boat: React.FC<{len?: number; color?: string; roof?: boolean; crew?: number; t: number; i: number}> = ({len = 1.6, color = '#6b4524', roof, crew = 2, t, i}) => (
  <group>
    <mesh position={[0, 0.12, 0]} scale={[0.32, 0.18, len]} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {roof && (
      <mesh position={[0, 0.45, -0.2]} scale={[0.3, 0.25, 0.6]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c9a23a" />
      </mesh>
    )}
    {Array.from({length: crew}, (_, k) => (
      <group key={k} position={[0, 0.05, -0.5 + k * 0.8]} scale={0.5}>
        <Person t={t} i={i * 3 + k} />
      </group>
    ))}
  </group>
);
const Junk: React.FC<{sail: number}> = ({sail}) => (
  <group>
    <mesh position={[0, 0.35, 0]} scale={[0.9, 0.45, 2.6]} castShadow>
      <sphereGeometry args={[1, 12, 8]} />
      <meshStandardMaterial color="#5a3a22" />
    </mesh>
    {[-0.9, 0.6].map((z, k) => (
      <group key={z} position={[0, 0.7, z]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.8, 6]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
        <mesh position={[0, 1.6 - k * 0.2, 0.02]} scale={[1, 0.6 + 0.4 * Math.min(1, sail * 3), 1]}>
          <boxGeometry args={[2.2 - k * 0.4, 2.2, 0.08]} />
          <meshStandardMaterial color="#b0562f" />
        </mesh>
      </group>
    ))}
  </group>
);

// ------------------------------------------------------------------ Narai's palace
// the white wall with its lamp niches (~2,000 of them, lit at night while the court lived here),
// the halls inside; overgrown after 1688; Rama IV's พิมานมงกุฎ from 1858
const PalaceWall: React.FC<{k: number; lamps: number; ruin: number}> = ({k, lamps, ruin}) => {
  const {x0, x1, z0, z1} = PALACE;
  const h = 0.9 * k * (1 - ruin * 0.35);
  const segs: [number, number, number, number][] = [
    [(x0 + x1) / 2, z0, x1 - x0, 0],
    [(x0 + x1) / 2, z1, x1 - x0, 0],
    [x0, (z0 + z1) / 2, z1 - z0, Math.PI / 2],
    [x1, (z0 + z1) / 2, z1 - z0, Math.PI / 2],
  ];
  if (k < 0.03) return null;
  return (
    <group>
      {segs.map(([x, z, len, rot], i) => (
        <group key={i} position={[x, 0, z]} rotation-y={rot}>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[len, h, 0.25]} />
            <meshStandardMaterial color={ruin > 0.5 ? '#cfc6b2' : WHITEWASH} />
          </mesh>
          {lamps > 0.02 &&
            Array.from({length: Math.floor(len * 2.5)}, (_, j) => (
              <mesh key={j} position={[-len / 2 + (j + 0.5) / 2.5, h * 0.6, 0.14]}>
                <planeGeometry args={[0.1, 0.16]} />
                <meshBasicMaterial color="#ffcc66" toneMapped={false} transparent opacity={lamps} />
              </mesh>
            ))}
        </group>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ the lunar eclipse, 11 Dec 1685
const Moon: React.FC<{k: number}> = ({k}) => {
  // the shadow crosses: white -> copper red at totality
  const c = new THREE.Color('#f6f1dc').lerp(new THREE.Color('#b0402a'), Math.min(1, k * 1.6));
  return (
    <mesh position={[PALACE.x0 - 10, 34, PALACE.z0 - 40]}>
      <sphereGeometry args={[2.4, 24, 18]} />
      <meshBasicMaterial color={c} toneMapped={false} />
    </mesh>
  );
};

// ------------------------------------------------------------------ the landmarks
export const LopburiLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH, beat}) => {
  const g = (x: number, z: number) => terrainH(x, z);
  const narai = ramp(Y, 1665.5, 1666.4); // the palace goes up through the hold on 1666
  const ruin = ramp(Y, 1690, 1760) * (1 - ramp(Y, 1856, 1862));
  const lamps = narai * (Y < 1688 ? night : 0);
  const prangK = ramp(Y, 1186, 1212);
  const hanuman = hanumanAt(t, g(PRANG[0] + 9, PRANG[1] - 4));
  const pay = Y >= 2024.9;
  const eclipse = beat('french') > 0.55 ? (beat('french') - 0.55) / 0.45 : 0;
  return (
    <group>
      {/* the legend's smelters: fires and smoke by the river, ~3,500 years ago */}
      {Y < 0 &&
        [0, 1, 2].map((i) => {
          const x = riverX(-4 + i * 4) + 3 + i;
          const z = -4 + i * 4;
          return (
            <group key={i} position={[x, g(x, z), z]}>
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.35, 0.45, 0.6, 8]} />
                <meshStandardMaterial color="#7a5236" />
              </mesh>
              <mesh position={[0, 0.65, 0]}>
                <sphereGeometry args={[0.18, 8, 6]} />
                <meshBasicMaterial color="#ff8a2a" toneMapped={false} />
              </mesh>
              {[0, 1, 2].map((k) => {
                const u = ((t * 0.5 + k / 3 + i * 0.2) % 1);
                return (
                  <mesh key={k} position={[u * 0.6, 1 + u * 3, 0]} scale={0.3 + u * 0.6}>
                    <sphereGeometry args={[1, 8, 6]} />
                    <meshStandardMaterial color="#c9c4bb" transparent opacity={0.7 * (1 - u)} />
                  </mesh>
                );
              })}
              <group position={[0.9, 0, 0.4]} rotation-y={-1.8} scale={0.6}>
                <Person t={t} i={i} />
              </group>
            </group>
          );
        })}

      {/* Dvaravati ลวปุระ: the stupa of วัดนครโกษา and the town's earthwork ring */}
      {Y >= 657 && (
        <Grow k={ramp(Y, 657, 686)} at={[WAT_NAKHON_KOSA[0], g(...WAT_NAKHON_KOSA), WAT_NAKHON_KOSA[1]]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[1.3, 1.5, 1, 12]} />
            <meshStandardMaterial color={BRICK} flatShading />
          </mesh>
          <mesh position={[0, 1.6, 0]} scale={[1, 1.1, 1]} castShadow>
            <sphereGeometry args={[1.1, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={BRICK} flatShading />
          </mesh>
          <mesh position={[0, 2.9, 0]}>
            <coneGeometry args={[0.25, 1.2, 8]} />
            <meshStandardMaterial color={BRICK} />
          </mesh>
        </Grow>
      )}
      {Y >= 600 && Y < 1700 &&
        [0, 1, 2, 3].map((i) => {
          const b = lavoBoatAt(i, t, Y);
          return b ? (
            <group key={i} position={[b.x, -0.02, b.z]} rotation-y={b.rot}>
              <Boat t={t} i={i} />
            </group>
          ) : null;
        })}

      {/* ปรางค์แขก: three brick towers, 9th-10th c. */}
      {Y >= 880 && (
        <Grow k={ramp(Y, 880, 960)} at={[PRANG_KHAEK[0], g(...PRANG_KHAEK), PRANG_KHAEK[1]]}>
          {[-1.6, 0, 1.6].map((z) => (
            <group key={z} position={[0, 0, z]}>
              <Prang color={BRICK} s={z === 0 ? 0.62 : 0.52} />
            </group>
          ))}
        </Grow>
      )}
      {/* ศาลพระกาฬ: the laterite base (11th c.), the shrine on it from 2494, the great banyan */}
      {Y >= 1000 && (
        <group position={[SAN_PHRA_KAN[0], g(...SAN_PHRA_KAN), SAN_PHRA_KAN[1]]}>
          <Grow k={ramp(Y, 1000, 1060)} at={[0, 0, 0]}>
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[3, 1.2, 3]} />
              <meshStandardMaterial color={LATERITE} flatShading />
            </mesh>
          </Grow>
          {Y >= 1951 && (
            <group position={[0, 0, 2.2]}>
              <Hall w={2.2} d={1.6} h={1.1} />
            </group>
          )}
          <group position={[1.9, 0, -1.2]}>
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.25, 0.4, 2, 8]} />
              <meshStandardMaterial color="#6b5236" />
            </mesh>
            <mesh position={[0, 2.6, 0]} scale={[2, 1.3, 2]} castShadow>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color="#3f7a3a" flatShading />
            </mesh>
          </group>
        </group>
      )}

      {/* the elephants for the Song court and the junk that takes them */}
      {[0, 1, 2].map((i) => {
        const e = elephantAt(i, t);
        return e ? (
          <group key={i} position={[e.x, g(e.x, e.z), e.z]} rotation-y={e.rot} scale={i === 0 ? 1.15 : 1}>
            <Elephant step={e.step} howdah={i === 0} />
          </group>
        ) : null;
      })}
      {(() => {
        const j = junkAt(t);
        return j ? (
          <group position={[j.x, -0.1, j.z]} rotation-y={j.rot}>
            <Junk sail={j.sail} />
          </group>
        ) : null;
      })()}

      {/* พระปรางค์สามยอด: Jayavarman VII's three towers rise in laterite */}
      {prangK > 0.02 && (
        <group scale={[1, Math.max(0.03, prangK), 1]}>
          <group position={[PRANG[0], 0, PRANG[1]]} scale={0.62}>
            <PrangSamYot y={g(...PRANG)} />
          </group>
        </group>
      )}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const p = processionAt(i, t);
        return p ? (
          <group key={i} position={[p.x, g(p.x, p.z), p.z]} rotation-y={p.rot} scale={0.7}>
            <Person t={t} i={i + 20} />
            {i === 1 && (
              <mesh position={[0, 2.3, 0]}>
                <coneGeometry args={[0.45, 1.1, 8]} />
                <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
              </mesh>
            )}
          </group>
        ) : null;
      })}

      {/* วัดพระศรีรัตนมหาธาตุ: the great prang, 13th-14th c., whitewashed later */}
      {Y >= 1250 && (
        <Grow k={ramp(Y, 1250, 1320)} at={[WAT_MAHATHAT[0], g(...WAT_MAHATHAT), WAT_MAHATHAT[1]]}>
          <Prang color={LATERITE} s={1.25} />
          <mesh position={[0, 0.1, 0]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[1.8, 2.0, 4]} />
            <meshStandardMaterial color={BRICK} side={THREE.DoubleSide} />
          </mesh>
        </Grow>
      )}

      {/* Narai's palace, Ban Wichayen, San Paolo's tower, the forts and gate */}
      <PalaceWall k={narai} lamps={lamps} ruin={ruin} />
      {narai > 0.02 &&
        (
          [
            [DUSIT, 2.2, 1.2, 1.1],
            [SUTTHA, 1.6, 1.0, 0.9],
            [RECEPTION, 1.4, 1.0, 0.8],
          ] as [[number, number], number, number, number][]
        ).map(([p, w, d, h], i) => (
          <Grow key={i} k={narai * (1 - ruin * 0.5)} at={[p[0], g(...p), p[1]]}>
            <Hall w={w} d={d} h={h} roof={ruin > 0.6 ? '#6e5a4a' : ROOF} />
          </Grow>
        ))}
      {narai > 0.02 && (
        <Grow k={narai} at={[PHRA_CHAO_HAO[0], g(...PHRA_CHAO_HAO), PHRA_CHAO_HAO[1]]}>
          <Hall w={1.4} d={0.9} h={0.9} roof="#6e5a4a" />
        </Grow>
      )}
      {/* the fountains at the reception hall, while the water runs */}
      {beat('narai') > 0.7 && Y < 1688 &&
        Array.from({length: 10}, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const hgt = 0.6 + 0.25 * Math.sin(t * 6 + i);
          return (
            <mesh key={i} position={[RECEPTION[0] + Math.cos(a) * 1.3, hgt / 2, RECEPTION[1] + Math.sin(a) * 1.0]}>
              <cylinderGeometry args={[0.03, 0.08, hgt, 5]} />
              <meshBasicMaterial color="#bfe6ff" toneMapped={false} transparent opacity={0.8} />
            </mesh>
          );
        })}
      {/* the clay pipe from ทะเลชุบศร and the water pulses running down it */}
      {Y >= 1666 && Y < 1700 &&
        PIPE.slice(1).map(([x1, z1], i) => {
          const [x0, z0] = PIPE[i];
          const len = Math.hypot(x1 - x0, z1 - z0);
          return (
            <mesh key={i} position={[(x0 + x1) / 2, 0.12, (z0 + z1) / 2]} rotation-y={Math.atan2(x1 - x0, z1 - z0)}>
              <boxGeometry args={[0.18, 0.18, len]} />
              <meshStandardMaterial color="#b0603a" />
            </mesh>
          );
        })}
      {pipeK(t) > 0 && pipeK(t) < 1 &&
        [0, 1, 2, 3, 4].map((i) => {
          const d = pipeK(t) * PIPE_LEN - i * 1.4;
          if (d < 0) return null;
          const p = along(PIPE, d);
          return (
            <mesh key={i} position={[p.x, 0.32, p.z]}>
              <sphereGeometry args={[0.24, 10, 8]} />
              <meshBasicMaterial color="#6cc4ff" toneMapped={false} />
            </mesh>
          );
        })}
      {Y >= 1858 && (
        <Grow k={ramp(Y, 1858, 1862)} at={[PHIMAN[0], g(...PHIMAN), PHIMAN[1]]}>
          <WesternHouse w={2.4} d={1.2} h={1.6} floors={3} />
        </Grow>
      )}
      {Y >= 1675 && (
        <group position={[VICHAYEN[0], g(...VICHAYEN), VICHAYEN[1]]}>
          <WesternHouse w={2.2} d={1.3} h={1.1} />
        </group>
      )}
      {Y >= 1686 && (
        <group position={[SAN_PAOLO[0], g(...SAN_PAOLO), SAN_PAOLO[1]]}>
          <mesh position={[0, 1.3, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.7, 2.6, 8]} />
            <meshStandardMaterial color={Y < 1700 ? WHITEWASH : '#b7a58a'} flatShading />
          </mesh>
        </group>
      )}
      {Y >= 1666 &&
        [POM_THA_PHO, POM_CHAI_CHANA].map((p, i) => (
          <group key={i} position={[p[0], g(...p), p[1]]}>
            <Fort />
          </group>
        ))}
      {Y >= 1666 && (
        <group position={[PRATU_CHAI[0], g(...PRATU_CHAI), PRATU_CHAI[1]]}>
          {[-0.7, 0.7].map((x) => (
            <mesh key={x} position={[x, 0.8, 0]} castShadow>
              <boxGeometry args={[0.5, 1.6, 0.6]} />
              <meshStandardMaterial color={WHITEWASH} />
            </mesh>
          ))}
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[1.9, 0.4, 0.6]} />
            <meshStandardMaterial color={WHITEWASH} />
          </mesh>
        </group>
      )}

      {/* the French embassy's fleet, elephants lining the bank, and the eclipse that night */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const f = fleetAt(i, t);
        return f ? (
          <group key={i} position={[f.x, -0.02, f.z]} rotation-y={f.rot} scale={f.big ? 1.5 : 1.1}>
            <Boat len={f.big ? 2.2 : 1.7} color={f.big ? '#7a2a1e' : '#6b4524'} roof crew={f.big ? 3 : 2} t={t} i={i + 40} />
          </group>
        ) : null;
      })}
      {beat('french') > 0 && beat('french') < 1 &&
        [0, 1, 2, 3, 4].map((i) => {
          const z = PALACE.z0 + 0.6 + i * 1.3;
          const x = riverX(z) + 2.0;
          return (
            <group key={i} position={[x, g(x, z), z]} rotation-y={Math.PI / 2}>
              <Elephant step={0} howdah />
            </group>
          );
        })}
      {eclipse > 0 && eclipse < 1.05 && <Moon k={eclipse} />}

      {/* the troop */}
      {Array.from({length: TROOP_N}, (_, i) => {
        const m = monkeyAt(i, t, Y);
        if (!m) return null;
        const y = g(m.x, m.z);
        return (
          <group key={i} position={[m.x, y, m.z]} rotation-y={m.rot} scale={1.1}>
            {m.sit ? <SittingMacaque t={t + i} /> : <Macaque hop={m.hop} />}
          </group>
        );
      })}

      {/* the payoff: the monkey buffet's red tables piled with fruit, south of the prang */}
      {pay &&
        [0, 1, 2].map((r) => (
          <group key={r} position={[PRANG[0] + 1.5, g(...PRANG), PRANG[1] + 3.6 + r * 1.3]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[7, 0.12, 0.8]} />
              <meshStandardMaterial color="#c0262c" />
            </mesh>
            {Array.from({length: 9}, (_, k) => (
              <mesh key={k} position={[-3.2 + k * 0.8, 0.6, 0]}>
                <coneGeometry args={[0.25, 0.4, 6]} />
                <meshStandardMaterial color={['#f2c14e', '#e8742c', '#7bb04a'][k % 3]} />
              </mesh>
            ))}
          </group>
        ))}

      {/* Hanuman: the cover, and back for the buffet */}
      {hanuman && (
        <group position={[hanuman.x, hanuman.y, hanuman.z]} rotation-y={hanuman.yaw} scale={pay ? HANUMAN_S * 0.5 : HANUMAN_S}>
          <Hanuman leap={hanuman.leap} t={t} />
        </group>
      )}
    </group>
  );
};
export {RET_LAND, smooth};
