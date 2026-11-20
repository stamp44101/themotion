import React from 'react';
import type {LandmarkProps} from '../../engine/types';
import {HipRoof, SmallChedi, Viharn} from '../../engine/parts';
import {Gingerbread} from '../../styleframes/phrae';
import {Walker} from '../nan/figures';
import {SurinElephant} from '../surin/figures';
import {
  DEMO_AT, DEMO_S, DYERS, ELEPHANTS, GANG, LINES, PORTERS, RAFTS, SHAN, SIAM, chediK, clamp01, demoT, dyerAt, elephantAt, gableK,
  gangAt, lineK, logRoll, porterAt, raftAt, shanAt, siamAt, smooth,
} from './actors';
import {
  CHOHAE, DENCHAI, GABLE_AT, GABLE_S, KHUM, LANDING, PILLAR, POLICE, RAIL_Z, RUNWAY, STAIR, THUNGHONG, WAT_LUANG, WAT_MING_MUEANG,
  WAT_PHRA_NON, WONGBURI,
} from './places';

const AZ = (18 * Math.PI) / 180;

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

// ------------------------------------------------------------------ the old town's buildings
/** Khum Chao Luang (built for the last ruler): a white two-storey mansion with a hip roof, drawn x3 */
const Khum: React.FC = () => (
  <group scale={1.0}>
    <Box p={[0, 0.35, 0]} s={[1.5, 0.7, 0.9]} c="#f2eee4" />
    <Box p={[0, 0.36, 0.46]} s={[1.5, 0.04, 0.02]} c="#c9b48a" />
    {[-0.5, -0.2, 0.1, 0.4].map((x) =>
      [0.18, 0.52].map((y) => <Box key={`${x}${y}`} p={[x + 0.05, y, 0.455]} s={[0.12, 0.16, 0.02]} c="#3e5a3a" />),
    )}
    <HipRoof w={1.6} l={1.0} h={0.42} y={0.7} color="#6e4a3a" />
  </group>
);

/** the Shan's banner at the police post, and the Siamese red flag at the column's head */
const Flag: React.FC<{color: string; k: number}> = ({color, k}) =>
  k < 0.02 ? null : (
    <group scale={[1, k, 1]}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.8, 5]} />
        <meshStandardMaterial color="#5a4128" />
      </mesh>
      <mesh position={[0.3, 1.55, 0]}>
        <boxGeometry args={[0.6, 0.38, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );

const Shan: React.FC<{t: number}> = ({t}) => {
  if (t < 2.8 || t > 10) return null;
  const k = (t - 3) / 6.4;
  return (
    <group>
      {Array.from({length: SHAN}, (_, i) => {
        const p = shanAt(i, t);
        return p ? (
          <group key={i} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.6}>
            <Walker step={t * 1.8 + i * 0.3} i={i % 2 ? 1 : 3} still={p.still} />
          </group>
        ) : null;
      })}
      {/* the post the Shan took, and their banner over it while they hold the town */}
      <group position={[POLICE[0], 0, POLICE[1]]}>
        <Box p={[0, 0.25, 0]} s={[0.9, 0.5, 0.6]} c="#d9cdb4" />
        <HipRoof w={1.0} l={0.7} h={0.3} y={0.5} color="#7a4a32" />
        <group position={[0.6, 0, 0.3]}>
          <Flag color="#d8b23a" k={smooth((k - 0.36) / 0.08) * (1 - smooth((k - 0.66) / 0.06))} />
        </group>
      </group>
      {Array.from({length: SIAM}, (_, i) => {
        const p = siamAt(i, t);
        return p ? (
          <group key={`s${i}`} position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.6}>
            <Walker step={t * 1.7 + i * 0.25} i={i} spear />
            {i === 0 && (
              <group position={[0.45, 0, 0]} scale={1.6}>
                <Flag color="#c0272d" k={1} />
              </group>
            )}
          </group>
        ) : null;
      })}
    </group>
  );
};

// ------------------------------------------------------------------ Den Chai: logs stacked by the station
const DenChai: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  const g = gangAt(t);
  return (
    <group>
      {/* the gang carrying the last sleepers into the yard */}
      {g !== null &&
        Array.from({length: GANG}, (_, i) => (
          <group key={i} position={[g - 0.6 - (i >> 1) * 0.7, 0, RAIL_Z + (i % 2 ? 0.55 : -0.55)]} rotation-y={Math.PI / 2} scale={0.4}>
            <Walker step={t * 1.6 + i * 0.4} i={i % 2 ? 0 : 2} load={i % 3 === 0} />
          </group>
        ))}
      {Y >= 1912 && <DenChaiYard />}
    </group>
  );
};
const DenChaiYard: React.FC = () => (
    <group position={[DENCHAI[0] - 2.4, 0, DENCHAI[1] - 1.4]}>
      {Array.from({length: 3}, (_, r) =>
        Array.from({length: 4 - r}, (_, c) => (
          <mesh key={`${r}${c}`} position={[c * 0.34 + r * 0.17, 0.16 + r * 0.29, 0]} rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 1.6, 8]} />
            <meshStandardMaterial color={c % 2 ? '#a8662a' : '#946024'} roughness={0.8} />
          </mesh>
        )),
      )}
    </group>
);

// ------------------------------------------------------------------ teak: elephants and the rafts on the Yom
const Teak: React.FC<{t: number}> = ({t}) => {
  if (t < 15 || t > 23) return null;
  return (
    <group>
      {Array.from({length: ELEPHANTS}, (_, i) => {
        const p = elephantAt(i, t);
        if (!p) return null;
        const roll = logRoll(i, t);
        return (
          <group key={i}>
            <group position={[p.x, 0, p.z]} rotation-y={p.rot} scale={0.5}>
              <SurinElephant walk={p.moving ? t * 0.9 + i * 0.3 : 0} stride={p.moving ? 1 : 0} t={t + i} tusks={i !== 1} trunk={0.2} />
            </group>
            {/* the log on its chain behind; once at the bank it rolls down into the Yom */}
            {roll < 1 && (
              <group position={[p.x - Math.sin(p.rot) * 1.6 + roll * 1.6, 0.14 - roll * 0.1, p.z - Math.cos(p.rot) * 1.6]} rotation-y={p.rot}>
                <mesh rotation-x={Math.PI / 2} rotation-y={roll * 6} castShadow>
                  <cylinderGeometry args={[0.14, 0.15, 1.6, 8]} />
                  <meshStandardMaterial color="#8a5a2c" roughness={0.9} flatShading />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
      {/* the mahouts' huts and the log pile at the landing */}
      <group position={[LANDING[0] - 1.2, 0, LANDING[1] - 1.0]}>
        <Box p={[0, 0.25, 0]} s={[0.8, 0.5, 0.6]} c="#8a6a44" />
        <HipRoof w={0.95} l={0.75} h={0.35} y={0.5} color="#6a5236" />
      </group>
      {Array.from({length: RAFTS}, (_, i) => {
        const p = raftAt(i, t);
        return p ? (
          <group key={`r${i}`} position={[p.x, 0.06, p.z]} rotation-y={p.rot}>
            {Array.from({length: 5}, (_, j) => (
              <mesh key={j} position={[(j - 2) * 0.2, 0, 0]} rotation-x={Math.PI / 2} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 1.5, 7]} />
                <meshStandardMaterial color="#a8662a" roughness={0.8} />
              </mesh>
            ))}
            <group position={[0, 0.06, 0.4]} scale={0.36}>
              <Walker step={0} i={i + 2} still />
            </group>
          </group>
        ) : null;
      })}
    </group>
  );
};

// ------------------------------------------------------------------ Phra That Cho Hae on its hill
const CHEDI_GOLD = '#d9a521';
/** the octagonal Lanna chedi on a square terrace; the restoration widens its base and lifts its spire (drawn x5) */
const ChoHae: React.FC<{t: number; Y: number; terrainH: LandmarkProps['terrainH']}> = ({t, Y, terrainH}) => {
  const k = chediK(t, Y);
  const gy = terrainH(CHOHAE[0], CHOHAE[1]);
  const base = 0.75 + 0.25 * k;
  const spire = 0.7 + 0.3 * k;
  return (
    <group>
      <group position={[CHOHAE[0], gy, CHOHAE[1]]}>
        {/* the cloister terrace */}
        <Box p={[0, 0.06, 0]} s={[2.4, 0.12, 2.4]} c="#e9e2d0" />
        {[-1, 1].map((s) => (
          <Box key={s} p={[s * 1.15, 0.2, 0]} s={[0.1, 0.25, 2.4]} c="#b0362a" />
        ))}
        {[-1, 1].map((s) => (
          <Box key={`z${s}`} p={[0, 0.2, s * 1.15]} s={[2.4, 0.25, 0.1]} c="#b0362a" />
        ))}
        {/* the octagonal tiers */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.2 + i * 0.22 * base, 0]} castShadow>
            <cylinderGeometry args={[(0.75 - i * 0.14) * base, (0.8 - i * 0.14) * base, 0.22 * base, 8]} />
            <meshStandardMaterial color={CHEDI_GOLD} metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
        {/* the bell and the spire */}
        <mesh position={[0, 0.86 * base + 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.46, 0.5, 8]} />
          <meshStandardMaterial color={CHEDI_GOLD} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.86 * base + 0.5 + 0.7 * spire, 0]} castShadow>
          <coneGeometry args={[0.22, 1.4 * spire, 8]} />
          <meshStandardMaterial color={CHEDI_GOLD} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.86 * base + 0.5 + 1.4 * spire + 0.06, 0]}>
          <sphereGeometry args={[0.06, 8, 6]} />
          <meshStandardMaterial color="#fff2b0" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* the viharn beside it */}
        <group position={[0, 0, 0.0]}>
          <Viharn pos={[-1.6, 0, 0.2]} k={1} rot={Math.PI / 2} scale={0.32} />
        </group>
      </group>
      {/* the naga stair: two red-and-gold balustrades up the slope */}
      {STAIR.slice(1).map((b, i) => {
        const a = STAIR[i];
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const ya = terrainH(a[0], a[1]);
        const yb = terrainH(b[0], b[1]);
        const ang = Math.atan2(b[0] - a[0], b[1] - a[1]);
        const pitch = Math.atan2(yb - ya, len);
        return (
          <group key={i} position={[(a[0] + b[0]) / 2, (ya + yb) / 2, (a[1] + b[1]) / 2]} rotation-y={ang}>
            <group rotation-x={-pitch}>
              <Box p={[0, 0.04, 0]} s={[0.36, 0.06, Math.hypot(len, yb - ya)]} c="#e6dcc4" />
              {[-1, 1].map((s) => (
                <Box key={s} p={[s * 0.2, 0.12, 0]} s={[0.06, 0.14, Math.hypot(len, yb - ya)]} c={s > 0 ? '#c9a227' : '#b23a2a'} />
              ))}
            </group>
          </group>
        );
      })}
      {t > 21.5 && t < 28.6 &&
        Array.from({length: PORTERS}, (_, i) => {
          const p = porterAt(i, t);
          return p ? (
            <group key={i} position={[p.x, terrainH(p.x, p.z), p.z]} rotation-y={p.rot} scale={0.36}>
              <Walker step={t * 1.5 + i * 0.4} i={i} load={p.up} />
            </group>
          ) : null;
        })}
      {/* the brick heap at the stair's foot while the work goes on */}
      {Y > 1923 && Y < 1931 && (
        <group position={[STAIR[0][0] - 0.6, terrainH(STAIR[0][0] - 0.6, STAIR[0][1]), STAIR[0][1]]}>
          {Array.from({length: 6}, (_, i) => (
            <Box key={i} p={[(i % 3) * 0.22, 0.06 + Math.floor(i / 3) * 0.12, 0]} s={[0.2, 0.1, 0.32]} c="#a8452c" />
          ))}
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ Ban Thung Hong: the mo hom drying lines
const ThungHong: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 2000) return null;
  return (
    <group position={[THUNGHONG[0], 0, THUNGHONG[1]]}>
      {Array.from({length: LINES}, (_, j) => {
        const k = lineK(j, t, Y);
        const x = -1.2 + j * 0.5;
        return (
          <group key={j} position={[x, 0, 0]}>
            {[-1.1, 1.1].map((z) => (
              <Box key={z} p={[0, 0.35, z]} s={[0.05, 0.7, 0.05]} c="#5a4128" />
            ))}
            <Box p={[0, 0.68, 0]} s={[0.02, 0.02, 2.2]} c="#3a2a1a" />
            {Array.from({length: 6}, (_, c) =>
              k > (c + 0.5) / 6 ? (
                <mesh key={c} position={[0, 0.48, -0.9 + c * 0.36]} rotation-y={Math.sin(t * 2 + c + j) * 0.12}>
                  <boxGeometry args={[0.03, 0.38, 0.3]} />
                  <meshStandardMaterial color={c % 3 === 0 ? '#1f2c55' : '#26366a'} roughness={0.9} />
                </mesh>
              ) : null,
            )}
          </group>
        );
      })}
      {/* the indigo pots */}
      {[0, 1, 2].map((i) => (
        <mesh key={`p${i}`} position={[-1.9, 0.2, -0.8 + i * 0.6]} castShadow>
          <cylinderGeometry args={[0.2, 0.16, 0.4, 10]} />
          <meshStandardMaterial color="#6a4a32" roughness={0.9} />
        </mesh>
      ))}
      {t > 36 && t < 45 &&
        Array.from({length: DYERS}, (_, i) => {
          const [x, z] = dyerAt(i, t);
          return (
            <group key={`d${i}`} position={[x - THUNGHONG[0], 0, z - THUNGHONG[1]]} rotation-y={Math.cos(t * 0.9 + i * 1.7) > 0 ? 0 : Math.PI} scale={0.36}>
              <Walker step={t * 1.4 + i} i={1} load={i % 3 === 0} />
            </group>
          );
        })}
    </group>
  );
};

// ------------------------------------------------------------------ the payoff: lanterns over ถนนคำลือ, the gable sawn again
const Fair: React.FC<{t: number; Y: number}> = ({t, Y}) => {
  if (Y < 2014) return null;
  const tl = demoT(t);
  return (
    <group>
      {/* the craftsman's trestle in front of Wongburi: the cover's gable, sawn again at hand size */}
      {t > 44 && (
        <group position={[DEMO_AT[0], 0, DEMO_AT[1]]} rotation-y={AZ}>
          <Gingerbread t={tl} S={DEMO_S} lift={[99, 100]} />
        </group>
      )}
      {/* paper lanterns strung along the street */}
      {Array.from({length: 9}, (_, i) => (
        <mesh key={i} position={[WONGBURI[0] - 2.0 + i * 0.5, 1.1 + Math.sin(i) * 0.05, WONGBURI[1] + 0.9]}>
          <sphereGeometry args={[0.08, 8, 6]} />
          <meshBasicMaterial color={i % 2 ? '#ff7a3a' : '#ffc04a'} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

export const PhraeLandmarks: React.FC<LandmarkProps> = ({Y, t, terrainH}) => {
  const gk = gableK(t);
  return (
    <group>
      {/* the cover (A1): the giant teak gable, fret-sawn, lifted onto a house; it folds away as the camera leaves */}
      {gk > 0.02 && (
        <group position={[GABLE_AT[0], 0, GABLE_AT[1]]} rotation-y={AZ} scale={gk}>
          <Gingerbread t={t} S={GABLE_S} />
        </group>
      )}
      {/* the old town: Wat Luang, Wat Phra Non, Wat Phra Bat Ming Mueang, Khum Chao Luang, the pillar shrine, Wongburi */}
      <Viharn pos={[WAT_LUANG[0], 0, WAT_LUANG[1]]} k={1} rot={0.2} scale={0.42} />
      <SmallChedi pos={[WAT_LUANG[0] - 0.7, 0, WAT_LUANG[1] - 0.2]} scale={0.6} k={1} color="#efe6d2" />
      <Viharn pos={[WAT_PHRA_NON[0], 0, WAT_PHRA_NON[1]]} k={1} rot={Math.PI / 2} scale={0.38} />
      <Viharn pos={[WAT_MING_MUEANG[0], 0, WAT_MING_MUEANG[1]]} k={1} rot={0.1} scale={0.42} />
      <SmallChedi pos={[WAT_MING_MUEANG[0] + 0.6, 0, WAT_MING_MUEANG[1] - 0.1]} scale={0.5} k={1} color={CHEDI_GOLD} />
      <group position={[KHUM[0], 0, KHUM[1]]}>
        <Khum />
      </group>
      <group position={[PILLAR[0], 0, PILLAR[1]]} scale={0.5}>
        <Box p={[0, 0.3, 0]} s={[0.8, 0.6, 0.8]} c="#f4efe2" />
        <HipRoof w={0.95} l={0.95} h={0.5} y={0.6} color="#b0382a" />
      </group>
      {Y > 1899 && (
        <group position={[WONGBURI[0], 0, WONGBURI[1]]} rotation-y={AZ}>
          <Gingerbread t={10} S={1.6} lift={[-2, -1]} debris={false} saw={false} />
        </group>
      )}
      <Shan t={t} />
      <DenChai Y={Y} t={t} />
      <Teak t={t} />
      <ChoHae t={t} Y={Y} terrainH={terrainH} />
      {/* the airport's runway (kept open ground) with the grow beat */}
      {Y > 1962 && (
        <group position={[(RUNWAY[0][0] + RUNWAY[1][0]) / 2, 0.03, (RUNWAY[0][1] + RUNWAY[1][1]) / 2]}
          rotation-y={Math.atan2(RUNWAY[1][0] - RUNWAY[0][0], RUNWAY[1][1] - RUNWAY[0][1])}
          scale={[1, 1, clamp01((Y - 1962) / 4)]}>
          <mesh receiveShadow>
            <boxGeometry args={[0.45, 0.04, Math.hypot(RUNWAY[1][0] - RUNWAY[0][0], RUNWAY[1][1] - RUNWAY[0][1])]} />
            <meshStandardMaterial color="#5b5d60" roughness={0.9} />
          </mesh>
        </group>
      )}
      <ThungHong t={t} Y={Y} />
      <Fair t={t} Y={Y} />
    </group>
  );
};
