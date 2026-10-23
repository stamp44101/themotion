import React from 'react';
import {Elephant, lathe} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';
import {ramp, smooth} from '../../lib';
import {Person} from '../phuket/figures';
import {
  bridgeK, campK, CANDLE_S, CART_N, cartAt, caravanAt, commissionerAt, coverCandleK, exodusAt, ferryAt, fisherAt, FLOAT_N, floatAt, floodK,
  houseK, PARADE, JET_N, jetAt, MONUMENT, OFFICE, NAGA_R, nagaOpening, nagaReturn, officeK, OPEN_END, raftAt, TOWN_N, townHouse, watLuangK,
} from './actors';
import {Naga} from './Naga';
import {AIRFIELD, CANDLE_AT, DON_MOT_DAENG, munZ, RUNWAY_ROT, THUNG, THUNG_HALF, WAT_LUANG, WAT_SI_UBON, WAT_THUNG} from './places';

export {THUNG, WAT_LUANG} from './places';

// the candle is matte beeswax, the naga gilt with a clearcoat, so the two read apart
const WAX = '#e9b95e';
const WAX_DARK = '#c58f3a';
const RIVER = '#4f8fb0';

// ------------------------------------------------------------------ the carved candle
// a candle tree in gilt wax on a red float: the cover's giant, the field's monument, today's floats
const CANDLE_PROFILE = lathe([[0, 0], [1.1, 0], [1.2, 0.4], [0.9, 0.9], [1.0, 1.6], [0.75, 2.2], [0.8, 3.0], [0.55, 3.6], [0.6, 4.4], [0.35, 5.0], [0.38, 5.8], [0.18, 6.4], [0.06, 7.0], [0, 7.2]], 20);
export const CarvedCandle: React.FC<{night: number; float?: boolean; white?: boolean}> = ({night, float = true, white}) => (
  <group>
    {float && (
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 1, 3]} />
        <meshStandardMaterial color="#8a2d1e" />
      </mesh>
    )}
    <mesh position={[0, float ? 1 : 0, 0]} geometry={CANDLE_PROFILE} castShadow>
      <meshStandardMaterial color={white ? '#f4efe3' : WAX} roughness={0.8} metalness={0} emissive="#ffb347" emissiveIntensity={night * 0.5} />
    </mesh>
    {[0.9, 2.2, 3.6, 5.0].map((y, i) => (
      <mesh key={y} position={[0, (float ? 1 : 0) + y, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.95 - i * 0.18, 0.09, 8, 24]} />
        <meshStandardMaterial color={white ? '#d9a43a' : WAX_DARK} roughness={0.7} />
      </mesh>
    ))}
  </group>
);

// ------------------------------------------------------------------ small things
const Dugout: React.FC<{t: number; i: number; crew?: number}> = ({t, i, crew = 2}) => (
  <group>
    <mesh position={[0, 0.12, 0]} scale={[0.32, 0.18, 1.5]} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#6b4524" />
    </mesh>
    {Array.from({length: crew}, (_, k) => (
      <group key={k} position={[0, 0.05, -0.5 + k * 0.9]} scale={0.55}>
        <Person t={t} i={i * 3 + k} />
      </group>
    ))}
  </group>
);
const Raft: React.FC<{t: number; i: number}> = ({t, i}) => (
  <group>
    <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.6, 0.18, 2.6]} />
      <meshStandardMaterial color="#b89a5e" />
    </mesh>
    <mesh position={[0, 0.75, -0.3]} rotation-z={Math.PI / 2} castShadow>
      <cylinderGeometry args={[0.55, 0.55, 1.5, 3, 1, false, 0, Math.PI]} />
      <meshStandardMaterial color="#8a6b3a" side={2} />
    </mesh>
    {[0, 1, 2].map((k) => (
      <group key={k} position={[-0.5 + k * 0.5, 0.2, 0.8]} scale={0.6}>
        <Person t={t} i={i * 3 + k} />
      </group>
    ))}
  </group>
);
const Cart: React.FC<{load?: React.ReactNode}> = ({load}) => (
  <group>
    <mesh position={[0, 0.55, 0]} castShadow>
      <boxGeometry args={[0.9, 0.25, 1.5]} />
      <meshStandardMaterial color="#7a5530" />
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.52, 0.4, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.4, 0.4, 0.08, 12]} />
        <meshStandardMaterial color="#4a3320" />
      </mesh>
    ))}
    {/* the ox */}
    <mesh position={[0, 0.55, 1.4]} scale={[0.35, 0.35, 0.6]} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#c9b79c" />
    </mesh>
    {load}
  </group>
);
const StiltHouse: React.FC<{k: number; s?: number}> = ({k, s = 1}) =>
  k <= 0.02 ? null : (
    <group scale={[s, s * k, s]}>
      {[[-0.5, -0.4], [0.5, -0.4], [-0.5, 0.4], [0.5, 0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]}>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshStandardMaterial color="#5b3d22" />
        </mesh>
      ))}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.5, 1.0]} />
        <meshStandardMaterial color="#a77d4c" />
      </mesh>
      <mesh position={[0, 1.45, 0]} rotation-y={Math.PI / 4} castShadow>
        <coneGeometry args={[0.95, 0.6, 4]} />
        <meshStandardMaterial color="#6e4a2a" />
      </mesh>
    </group>
  );
// an Isan สิม: white walls, a steep layered roof with gilt finials
const Sim: React.FC<{k: number; night: number}> = ({k, night}) =>
  k <= 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.5, 3.2]} />
        <meshStandardMaterial color="#e9e2d2" />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[1.8, 1.0, 2.8]} />
        <meshStandardMaterial color="#f5f1e8" emissive="#ffe2a8" emissiveIntensity={night * 0.4} />
      </mesh>
      <mesh position={[0, 1.95, 0]} rotation-y={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.05, 1.4, 1.0, 4, 1, false, Math.PI / 4]} />
        <meshStandardMaterial color="#9b2d22" />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <coneGeometry args={[0.12, 0.6, 6]} />
        <meshStandardMaterial color="#d9a43a" metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );

// ------------------------------------------------------------------ the landmarks
export const UbonLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH, beat}) => {
  const ctx = {Y, beat, ground: terrainH};
  const open = t <= OPEN_END ? nagaOpening(t) : null;
  const ret = nagaReturn(t, Y);
  const coverK = t <= OPEN_END ? coverCandleK(t) : 0;
  const flood = floodK({beat});
  const town = Y >= 1792;
  return (
    <group>
      {/* the cover: the giant candle and its naga */}
      {coverK > 0.02 && (
        <group position={[CANDLE_AT[0], terrainH(CANDLE_AT[0], CANDLE_AT[1]) - (1 - coverK) * 22, CANDLE_AT[1]]} scale={CANDLE_S}>
          <CarvedCandle night={night} />
        </group>
      )}
      {open && <Naga pts={open} r={NAGA_R} jaw={0.35 + Math.sin(t * 2.2) * 0.25} night={night} t={t} />}
      {Y < 0 &&
        [0, 1, 2, 3].map((i) => {
          const f = fisherAt(i, t);
          return (
            <group key={i} position={[f.x, -0.02, f.z]} rotation-y={f.rot}>
              <Dugout t={t} i={i} />
            </group>
          );
        })}

      {/* 2314: the island camp, the rafts, the caravan */}
      {Y > 1700 && Y < 1800 && (
        // the island lies along the Mun, which runs north-east here
        <group position={[DON_MOT_DAENG[0], 0, DON_MOT_DAENG[1]]} rotation-y={0.63}>
          <mesh position={[0, 0.04, 0]} rotation-x={-Math.PI / 2} scale={[4.2, 1.3, 1]}>
            <circleGeometry args={[1, 32]} />
            <meshStandardMaterial color="#d8c08a" />
          </mesh>
          {Y < 1795 &&
            Array.from({length: 6}, (_, i) => (
              <group key={i} position={[-2.5 + i, 0.05, i % 2 ? 0.35 : -0.35]} scale={0.8}>
                <StiltHouse k={campK(i, ctx)} />
              </group>
            ))}
        </group>
      )}
      {Array.from({length: 4}, (_, i) => {
        const r = raftAt(i, ctx);
        return r && Y < 1790 ? (
          <group key={i} position={[r.x, -0.02, r.z]} rotation-y={Math.PI / 2}>
            <Raft t={t} i={i} />
          </group>
        ) : null;
      })}
      {Array.from({length: 8}, (_, i) => {
        const c = caravanAt(i, ctx);
        if (!c || Y > 1790) return null;
        return (
          <group key={i} position={[c.x, terrainH(c.x, c.z), c.z]} rotation-y={c.rot}>
            {i % 2 === 0 ? (
              <group scale={1.2}>
                <Elephant step={Math.sin(t * 3 + i)} howdah />
              </group>
            ) : (
              <Cart />
            )}
          </group>
        );
      })}

      {/* the flood over the camp, and the boats leaving it */}
      {flood > 0.01 && (
        <mesh position={[DON_MOT_DAENG[0], 0.12, DON_MOT_DAENG[1]]} rotation={[-Math.PI / 2, 0, 0.63]} scale={[9 * flood + 2, 4 * flood + 1, 1]}>
          <circleGeometry args={[1, 40]} />
          <meshStandardMaterial color={RIVER} transparent opacity={0.92} roughness={0.2} />
        </mesh>
      )}
      {Array.from({length: 5}, (_, i) => {
        const b = exodusAt(i, ctx);
        return b ? (
          <group key={i} position={[b.x, -0.02, b.z]} rotation-y={Math.PI / 2} scale={1.3}>
            <Dugout t={t} i={i + 4} crew={3} />
          </group>
        ) : null;
      })}
      {/* ดงอู่ผึ้ง: big trees hung with wild bee combs on the high bank */}
      {/* cleared for the town one by one across the founding's first third, never all at once
          (a one-frame pop here was a 9-level luma jump in check_render) */}
      {Y > 1774 &&
        Y < 1793 &&
        [[-4, -6], [4, -5], [-6, 2], [6, 3], [0, -8], [-2, 6]].map(([x, z], i) => {
          const k = Y < 1792 ? 1 : 1 - smooth(ramp(beat('founding'), 0.04 + i * 0.05, 0.14 + i * 0.05));
          return k <= 0.02 ? null : (
          <group key={i} position={[x, terrainH(x, z), z]} scale={[k, k, k]}>
            <mesh position={[0, 1.6, 0]}>
              <cylinderGeometry args={[0.25, 0.35, 3.2, 7]} />
              <meshStandardMaterial color="#5b3d22" />
            </mesh>
            <mesh position={[0, 3.8, 0]} scale={[2.2, 1.6, 2.2]} castShadow>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color="#3f7d33" flatShading />
            </mesh>
            {[0, 1, 2].map((k) => (
              <mesh key={k} position={[Math.cos(k * 2.1) * 1.3, 2.5, Math.sin(k * 2.1) * 1.3]} scale={[0.35, 0.6, 0.35]}>
                <sphereGeometry args={[1, 10, 8]} />
                <meshStandardMaterial color="#d49a2a" emissive="#8a5a10" emissiveIntensity={0.2} />
              </mesh>
            ))}
          </group>
          );
        })}

      {/* 2335: the field and the first town round it */}
      {town && (
        <mesh position={[THUNG[0], 0.03, THUNG[1]]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[THUNG_HALF[0] * 2, THUNG_HALF[1] * 2]} />
          <meshStandardMaterial color="#86b45a" />
        </mesh>
      )}
      {town &&
        Y < 1960 &&
        Array.from({length: TOWN_N}, (_, i) => {
          const h = townHouse(i);
          return (
            <group key={i} position={[h.x, terrainH(h.x, h.z), h.z]} rotation-y={h.rot}>
              <StiltHouse k={houseK(i, ctx)} s={h.s} />
            </group>
          );
        })}
      {town && (
        <group position={[WAT_LUANG[0], terrainH(WAT_LUANG[0], WAT_LUANG[1]), WAT_LUANG[1]]} rotation-y={Math.PI / 2}>
          <Sim k={watLuangK(ctx)} night={night} />
        </group>
      )}
      {Y >= 1855 && (
        <group position={[WAT_SI_UBON[0], 0, WAT_SI_UBON[1]]} rotation-y={Math.PI / 2} scale={0.8}>
          <Sim k={1} night={night} />
        </group>
      )}
      {/* วัดทุ่งศรีเมือง's library on its pond (~2384) */}
      {Y >= 1841 && (
        <group position={[WAT_THUNG[0], 0, WAT_THUNG[1]]}>
          <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[2.0, 2.0]} />
            <meshStandardMaterial color={RIVER} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[0.9, 0.7, 0.9]} />
            <meshStandardMaterial color="#7a4f2a" />
          </mesh>
          <mesh position={[0, 1.25, 0]} rotation-y={Math.PI / 4} castShadow>
            <coneGeometry args={[0.85, 0.7, 4]} />
            <meshStandardMaterial color="#9b2d22" />
          </mesh>
        </group>
      )}

      {/* 2436: the commissioner's elephants and the new office */}
      {Array.from({length: 7}, (_, i) => {
        const c = commissionerAt(i, ctx);
        if (!c || Y > 1895) return null;
        return (
          <group key={i} position={[c.x, terrainH(c.x, c.z), c.z]} rotation-y={c.rot}>
            {i < 3 ? (
              <group scale={1.1}>
                <Elephant step={Math.sin(t * 3 + i)} howdah color={i === 1 ? '#d9d2c4' : undefined} />
              </group>
            ) : (
              <group scale={1.1}>
                <Person t={0} i={i + 10} />
              </group>
            )}
          </group>
        );
      })}
      {/* gated on its own scale: mounted at y-scale 0 it blacked out the shader cut (CLAUDE.md) */}
      {Y >= 1893 && officeK(ctx) > 0.02 && (
        <group position={[OFFICE[0], 0, OFFICE[1]]} scale={[1, officeK(ctx), 1]}>
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 1.6, 1.4]} />
            <meshStandardMaterial color="#f2eee4" emissive="#ffe2a8" emissiveIntensity={night * 0.3} />
          </mesh>
          <mesh position={[0, 1.85, 0]} castShadow>
            <boxGeometry args={[3.4, 0.5, 1.6]} />
            <meshStandardMaterial color="#8c3b2a" />
          </mesh>
        </group>
      )}

      {/* 2444: the first procession, bound candles on carts round the field */}
      {Array.from({length: CART_N}, (_, i) => {
        const c = cartAt(i, t, ctx);
        return c ? (
          <group key={i} position={[c.x, 0, c.z]} rotation-y={c.rot} scale={1.25}>
            <Cart
              load={
                <group position={[0, 0.7, -0.1]}>
                  {[[-0.2, 0], [0.2, 0], [0, 0.2], [0, -0.2], [0, 0]].map(([x, z], k) => (
                    <mesh key={k} position={[x, 0.7 + (k === 4 ? 0.2 : 0), z]} castShadow>
                      <cylinderGeometry args={[0.09, 0.09, 1.4 + (k === 4 ? 0.4 : 0), 8]} />
                      <meshStandardMaterial color={WAX} emissive="#ffb347" emissiveIntensity={night * 0.5} />
                    </mesh>
                  ))}
                  <mesh position={[0, 0.9, 0]}>
                    <cylinderGeometry args={[0.36, 0.36, 0.4, 10, 1, true]} />
                    <meshStandardMaterial color="#f3e6b4" side={2} />
                  </mesh>
                </group>
              }
            />
            <group position={[0.9, 0, 0.4]} scale={0.8}>
              <Person t={t} i={i + 20} />
            </group>
          </group>
        ) : null;
      })}

      {/* 2473-2497: the boats across to Warin, then the first bridge */}
      {[0, 1, 2].map((i) => {
        const f = ferryAt(i, t, ctx);
        return f ? (
          <group key={i} position={[f.x, -0.02, f.z]} scale={1.35}>
            <Dugout t={t} i={i + 30} crew={3} />
          </group>
        ) : null;
      })}
      {Y >= 1953.4 && bridgeK(Y) > 0.02 && (
        <group position={[0, 0, munZ(0)]}>
          <mesh position={[0, 0.7, 0]} scale={[1, 1, bridgeK(Y)]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.25, 5.6]} />
            <meshStandardMaterial color="#c9c4ba" />
          </mesh>
          {[-1.8, -0.6, 0.6, 1.8].map((z) => (
            <mesh key={z} position={[0, 0.3, z * bridgeK(Y)]}>
              <boxGeometry args={[0.5, 0.8, 0.3]} />
              <meshStandardMaterial color="#9c968c" />
            </mesh>
          ))}
        </group>
      )}

      {/* the airfield (2464 on) and the jets of 2508-2517 */}
      {Y >= 1921 && (
        <group position={[AIRFIELD[0], 0.02, AIRFIELD[1]]} rotation-y={RUNWAY_ROT}>
          <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <planeGeometry args={[Y >= 1955 ? 1.6 : 2.4, 37.5]} />
            <meshStandardMaterial color={Y >= 1955 ? '#5f6366' : '#a6b56c'} />
          </mesh>
        </group>
      )}
      {Array.from({length: JET_N}, (_, i) => {
        const j = jetAt(i, t, ctx);
        if (!j) return null;
        const d = -14 + j.k * 34;
        const y = 0.6 + Math.max(0, d) * Math.max(0, d) * 0.02;
        return (
          <group key={i} position={[AIRFIELD[0], 0, AIRFIELD[1]]} rotation-y={RUNWAY_ROT}>
            <group position={[0, y, d]} scale={1.3}>
              <mesh castShadow>
                <coneGeometry args={[0.25, 2.4, 8]} />
                <meshStandardMaterial color="#7d8a6a" />
              </mesh>
              <mesh position={[0, -0.2, 0]} rotation-x={Math.PI / 2}>
                <boxGeometry args={[2.2, 0.9, 0.06]} />
                <meshStandardMaterial color="#6f7b5e" />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* 2542: the great candle at the centre of the field */}
      {Y >= 1999 && (
        <group position={[MONUMENT[0], 0, MONUMENT[1]]} scale={1.0}>
          <mesh position={[0, 0.4, 0]} receiveShadow>
            <cylinderGeometry args={[1.25, 1.4, 0.8, 8]} />
            <meshStandardMaterial color="#e9e2d2" />
          </mesh>
          <group position={[0, 0.8, 0]}>
            <CarvedCandle night={night} float={false} />
          </group>
        </group>
      )}
      {ret && <Naga pts={ret} r={NAGA_R * 0.55} jaw={0.3 + Math.sin(t * 2.4) * 0.25} night={night} t={t} />}

      {/* today: the procession of carved candles round the field, with dancers */}
      {Array.from({length: FLOAT_N}, (_, i) => {
        const f = floatAt(i, t, ctx);
        if (!f) return null;
        return (
          <group key={i} position={[f.x, 0, f.z]} rotation-y={f.rot} scale={[f.k, f.k, f.k]}>
            <group scale={0.62}>
              <CarvedCandle night={night} />
            </group>
            {[0, 1, 2].map((k) => (
              <group key={k} position={[-0.9 + k * 0.9, 0, 2.4]} scale={0.75}>
                <Person t={t} i={i * 3 + k} />
              </group>
            ))}
          </group>
        );
      })}
      {Y >= 2024.9 && (
        // crowds lining both sides of the parade road, clear of the office and the great candle
        Array.from({length: 44}, (_, i) => {
          const x = PARADE.x0 + 0.6 + (i >> 1) * ((PARADE.x1 - PARADE.x0 - 1.2) / 21);
          const z = PARADE.z + (i % 2 ? 1.5 : -1.5);
          if (Math.abs(x - OFFICE[0]) < 2.3 && z < PARADE.z) return null;
          if (Math.hypot(x - MONUMENT[0], z - MONUMENT[1]) < 4.2) return null;
          return (
            <group key={i} position={[x, 0, z]} rotation-y={i % 2 ? Math.PI : 0} scale={0.7}>
              <Person t={0} i={i} />
            </group>
          );
        })
      )}
    </group>
  );
};
export const smoothK = (x: number) => smooth(ramp(x, 0, 1));
