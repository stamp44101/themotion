import React from 'react';
import {Army} from '../../engine/army';
import {Elephant, SmallChedi, Viharn, lathe} from '../../engine/parts';
import {Horse} from './Horse';
import {RoosterBowl} from './Bowl';
import type {LandmarkProps} from '../../engine/types';
import {ramp, smooth} from '../../lib';
import {elephantAt, heroCarriage, kawila, logAt, thipChang, townCarriage} from './actors';
import {BAN_SAO_NAK, BRIDGE, KILNS, LAMPANG_LUANG, MAE_MOH, WAT_PHRA_KAEW, WAT_SI_CHUM} from './places';

export {BAN_SAO_NAK, BRIDGE, CLOCK_TOWER, KILNS, LAMPANG_LUANG, MAE_MOH, PRATU_MA, STATION, WAT_PHRA_KAEW, WAT_SI_CHUM} from './places';

// ------------------------------------------------------------------ รถม้าลำปาง
// a horse and a canopied four-wheel carriage, red and white with flowers; drawn at hero
// scale for the opening and at street scale (still exaggerated) from 1916
export const Carriage: React.FC<{t: number}> = ({t}) => {
  const step = Math.sin(t * 9);
  const wood = <meshStandardMaterial color="#c8322a" flatShading roughness={0.6} />;
  const white = <meshStandardMaterial color="#f2ede4" flatShading roughness={0.8} />;
  return (
    <group>
      <group position={[1.75, 0, 0]} scale={0.78}>
        <Horse step={step} />
      </group>
      {[-0.32, 0.32].map((z) => (
        <mesh key={z} position={[0.9, 0.75, z]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.4, 4]} />
          {wood}
        </mesh>
      ))}
      <mesh position={[-0.2, 0.85, 0]} castShadow>
        <boxGeometry args={[1.3, 0.35, 0.8]} />
        {wood}
      </mesh>
      <mesh position={[-0.35, 1.55, 0]} castShadow>
        <boxGeometry args={[1.25, 0.08, 0.95]} />
        {white}
      </mesh>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[-0.35 + sx * 0.55, 1.22, sz * 0.4]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.65, 4]} />
            {white}
          </mesh>
        )),
      )}
      {/* the scalloped fringe of a Lampang carriage canopy, and flowers along its edge */}
      {Array.from({length: 18}, (_, i) => {
        const side = i < 9 ? 1 : -1;
        const x = -0.95 + (i % 9) * 0.15;
        return (
          <mesh key={i} position={[x, 1.46, side * 0.48]}>
            <boxGeometry args={[0.12, 0.12, 0.02]} />
            <meshStandardMaterial color={['#e8b030', '#2f9a5a', '#e04a8a'][i % 3]} />
          </mesh>
        );
      })}
      {[-0.9, -0.55, -0.2, 0.15].flatMap((x) =>
        [-1, 1].map((sz) => (
          <mesh key={`${x}${sz}`} position={[x, 1.63, sz * 0.48]}>
            <icosahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial color={sz > 0 ? '#ff5fa2' : '#ffd23a'} />
          </mesh>
        )),
      )}
      {[
        [0.25, 0.45, 0.42],
        [-0.75, 0.55, 0.46],
      ].flatMap(([x, r, w]) =>
        [-1, 1].map((sz) => (
          <mesh key={`${x}${sz}`} position={[x, r, sz * w]} castShadow>
            <torusGeometry args={[r, 0.05, 5, 14]} />
            <meshStandardMaterial color="#e2b04a" />
          </mesh>
        )),
      )}
    </group>
  );
};

// ------------------------------------------------------------------ the Emerald Buddha's elephants
const Busabok: React.FC = () => (
  <group position={[0, 2.15, -0.1]}>
    <mesh castShadow>
      <boxGeometry args={[0.95, 0.3, 1.0]} />
      <meshStandardMaterial color="#b8322a" />
    </mesh>
    {[-1, 1].flatMap((sx) =>
      [-1, 1].map((sz) => (
        <mesh key={`${sx}${sz}`} position={[sx * 0.36, 0.45, sz * 0.38]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 5]} />
          <meshStandardMaterial color="#e2b04a" metalness={0.6} roughness={0.3} />
        </mesh>
      )),
    )}
    <mesh position={[0, 0.42, 0]}>
      <icosahedronGeometry args={[0.2, 0]} />
      <meshBasicMaterial color="#2fbf6a" toneMapped={false} />
    </mesh>
    <mesh position={[0, 0.95, 0]} castShadow>
      <coneGeometry args={[0.6, 0.75, 4]} />
      <meshStandardMaterial color="#e2b04a" metalness={0.6} roughness={0.3} />
    </mesh>
  </group>
);

// ------------------------------------------------------------------ temples
// a Lanna bell chedi: gilded (Lampang Luang) or whitewashed with a gilded spire (Don Tao)
const LANNA: [number, number][] = [
  [0, 0], [1.2, 0], [1.2, 0.35], [1.0, 0.35], [1.0, 0.7], [0.85, 0.7], [0.85, 1.0],
  [0.95, 1.1], [0.9, 1.6], [0.7, 1.95], [0.45, 2.15], [0.28, 2.25], [0.24, 2.8],
  [0.15, 3.3], [0.08, 3.9], [0, 4.3],
];
const lannaGeo = lathe(LANNA, 16);
const Chedi: React.FC<{pos: [number, number, number]; s: number; k: number; color: string; night: number}> = ({pos, s, k, color, night}) =>
  k < 0.02 ? null : (
    <mesh geometry={lannaGeo} position={pos} scale={[s, s * k, s]} castShadow>
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.35} emissive="#ffc861" emissiveIntensity={night * 0.5} />
    </mesh>
  );

// วัดพระธาตุลำปางหลวง: the walled temple on its mound -- the walls are what made it a camp
const LampangLuang: React.FC<{k: number; night: number; terrainH: LandmarkProps['terrainH']}> = ({k, night, terrainH}) => {
  if (k < 0.02) return null;
  const [x, z] = LAMPANG_LUANG;
  const y = terrainH(x, z);
  const H = 2.6;
  return (
    <group position={[x, y, z]}>
      {[
        [0, -H, 2 * H + 0.4, 0.35],
        [0, H, 2 * H + 0.4, 0.35],
        [-H, 0, 0.35, 2 * H + 0.4],
        [H, 0, 0.35, 2 * H + 0.4],
      ].map(([wx, wz, w, d], i) => (
        <mesh key={i} position={[wx, 0.4 * k, wz]} scale={[1, k, 1]} castShadow receiveShadow>
          <boxGeometry args={[w, 0.8, d]} />
          <meshStandardMaterial color="#a8553a" roughness={0.85} />
        </mesh>
      ))}
      <Chedi pos={[0.4, 0, 0.6]} s={0.95} k={k} color="#d9a43a" night={night} />
      <Viharn pos={[-0.4, 0, -1.4]} k={k} scale={0.45} />
    </group>
  );
};

// วัดศรีชุม: Burmese multi-tiered roofs (ปยาทาด), dark teak and gilt
const WatSiChum: React.FC<{k: number}> = ({k}) => {
  if (k < 0.02) return null;
  const [x, z] = WAT_SI_CHUM;
  return (
    <group position={[x, 0, z]} scale={[1, k, 1]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.7, 1.1]} />
        <meshStandardMaterial color="#5a3420" roughness={0.85} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.85 + i * 0.28, 0]} castShadow>
          <boxGeometry args={[1.5 - i * 0.32, 0.12, 1.0 - i * 0.2]} />
          <meshStandardMaterial color={i % 2 ? '#c99a3a' : '#7a2a1c'} metalness={i % 2 ? 0.5 : 0} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 2.15, 0]} castShadow>
        <coneGeometry args={[0.12, 0.6, 6]} />
        <meshStandardMaterial color="#e2b04a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
};

// บ้านเสานัก: a teak house on a forest of posts
const BanSaoNak: React.FC<{k: number}> = ({k}) =>
  k < 0.02 ? null : (
    <group position={[BAN_SAO_NAK[0], 0, BAN_SAO_NAK[1]]} scale={[0.9, 0.9 * k, 0.9]}>
      {Array.from({length: 12}, (_, i) => (
        <mesh key={i} position={[(i % 4) * 0.4 - 0.6, 0.25, Math.floor(i / 4) * 0.4 - 0.4]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 5]} />
          <meshStandardMaterial color="#4a2e1a" />
        </mesh>
      ))}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[1.5, 0.3, 1.1]} />
        <meshStandardMaterial color="#6b4428" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.0, 0]} rotation-y={Math.PI / 4} scale={[1.2, 1, 0.85]} castShadow>
        <coneGeometry args={[1.05, 0.5, 4]} />
        <meshStandardMaterial color="#5a3420" roughness={0.9} />
      </mesh>
    </group>
  );

// ------------------------------------------------------------------ ชามตราไก่
const Kilns: React.FC<{k: number; t: number}> = ({k, t}) => {
  if (k < 0.02) return null;
  const [x, z] = KILNS;
  return (
    <group position={[x, 0, z]}>
      {[-1.4, 0, 1.4].map((dx, i) => (
        <group key={i} position={[dx, 0, -0.8]} scale={[1, k, 1]}>
          <mesh position={[0, 0.3, 0]} scale={[0.55, 0.45, 0.9]} castShadow>
            <sphereGeometry args={[1, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#9a4a32" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.9, -0.7]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 1.2, 6]} />
            <meshStandardMaterial color="#7a3a26" />
          </mesh>
          {[0, 1, 2].map((j) => {
            const u = (t * 0.45 + j / 3 + i * 0.2) % 1;
            return (
              <mesh key={j} position={[0.1 * Math.sin(u * 6), 1.6 + u * 1.6, -0.7 - u * 0.4]} scale={0.25 + u * 0.4}>
                <sphereGeometry args={[1, 6, 5]} />
                <meshStandardMaterial color="#cfcac2" transparent opacity={0.7 * (1 - u) * k} depthWrite={false} />
              </mesh>
            );
          })}
        </group>
      ))}
      {/* the rooster bowl itself, drawn huge and tipped toward the camera so its painted side shows */}
      {/* the camera looks down from the south-east (az ~50 deg), so the bowl turns to face it
          and tips its rim away: the painted outer wall faces the lens, not the white inside */}
      <group position={[0.6, 0.9, 2.2]} rotation-y={0.85} scale={2.9 * k}>
        <group rotation-x={-0.55}>
          <group position={[0, -0.38, 0]}>
            <RoosterBowl />
          </group>
        </group>
      </group>
      {/* stacks of finished bowls by the kilns */}
      {[-2.2, -1.5, 2.2].map((dx, i) => (
        <group key={i} position={[dx, 0, 1.6 + (i % 2) * 0.5]} scale={0.45 * k}>
          {[0, 1, 2, 3].map((j) => (
            <group key={j} position={[0, j * 0.22, 0]}>
              <RoosterBowl />
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};

// ------------------------------------------------------------------ แม่เมาะ
// the open pit as stepped terraces (a basin: drawn as its rim of spoil benches) and, from
// 1972, the power station's stacks
const MaeMoh: React.FC<{pit: number; plant: number; t: number; terrainH: LandmarkProps['terrainH']}> = ({pit, plant, t, terrainH}) => {
  if (pit < 0.02) return null;
  const [x, z] = MAE_MOH;
  const y = terrainH(x, z);
  return (
    <group position={[x, y, z]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.12 + i * 0.22, 0]} scale={[1, 1, 1.3]} receiveShadow>
          <cylinderGeometry args={[(2.2 + i * 0.9) * pit, (2.5 + i * 0.9) * pit, 0.24, 20, 1, true]} />
          <meshStandardMaterial color={i % 2 ? '#8a7a66' : '#5e5246'} roughness={1} side={2} />
        </mesh>
      ))}
      <mesh position={[0, 0.03, 0]} scale={[1, 1, 1.3]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[2.3 * pit, 20]} />
        <meshStandardMaterial color="#2e2a26" roughness={1} />
      </mesh>
      {plant > 0.02 && (
        <group position={[-1.2, 0, 7]}>
          <mesh position={[0, 0.6 * plant, 0]} scale={[1, plant, 1]} castShadow>
            <boxGeometry args={[3, 1.2, 1.6]} />
            <meshStandardMaterial color="#d8d6d0" />
          </mesh>
          {[-1, 0, 1].map((i) => (
            <group key={i} position={[i * 1.1, 0, -1.4]}>
              <mesh position={[0, 2.2 * plant, 0]} scale={[1, plant, 1]} castShadow>
                <cylinderGeometry args={[0.18, 0.26, 4.4, 8]} />
                <meshStandardMaterial color={i === 0 ? '#c8322a' : '#ece9e2'} />
              </mesh>
              {plant > 0.95 &&
                [0, 1, 2].map((j) => {
                  const u = (t * 0.35 + j / 3 + i * 0.13) % 1;
                  return (
                    <mesh key={j} position={[u * 0.8, 4.6 + u * 2, 0]} scale={0.3 + u * 0.6}>
                      <sphereGeometry args={[1, 6, 5]} />
                      <meshStandardMaterial color="#e8e6e0" transparent opacity={0.6 * (1 - u)} depthWrite={false} />
                    </mesh>
                  );
                })}
            </group>
          ))}
        </group>
      )}
    </group>
  );
};

export const LampangLandmarks: React.FC<LandmarkProps> = ({Y, t, night, terrainH, beat}) => {
  const ctx = {Y, beat};
  const hero = heroCarriage(t, ctx);
  const tc = thipChang(t, ctx);
  const army = kawila(t, ctx);
  const carriage = townCarriage(t, ctx);
  // visibility on the year; the Don Tao chedi is old but undated -- shown from the Lanna era
  const donTao = smooth(ramp(Y, 1330, 1380));
  const emerald = ramp(Y, 1436.1, 1436.3) * (1 - ramp(Y, 1468, 1468.5));
  const luang = smooth(ramp(Y, 1440, 1480));
  const siChum = smooth(ramp(Y, 1889.7, 1890.6));
  const saoNak = smooth(ramp(Y, 1895, 1896));
  const kilns = smooth(ramp(Y, 1954.95, 1955.25));
  const pit = smooth(ramp(Y, 1954, 1990));
  const plant = smooth(ramp(Y, 1972.1, 1973.2));
  const elephants = [0, 1, 2].map((i) => elephantAt(i, ctx));
  const logs = Array.from({length: 7}, (_, i) => logAt(i, ctx));
  // two carriages loop over the white bridge in the modern city
  const modern = ramp(Y, 1994, 1996);
  return (
    <>
      {hero.k > 0.02 && (
        <group position={[hero.x, terrainH(hero.x, hero.z), hero.z]} rotation-y={-0.2} scale={11 * hero.k}>
          <Carriage t={t} />
        </group>
      )}
      {elephants.map((e, i) =>
        e ? (
          <group key={i} position={[e.x, terrainH(e.x, e.z), e.z]} rotation-y={e.rot} scale={i ? 0.75 : 0.95}>
            <Elephant step={Math.sin(t * 3 + i)} color={i ? '#7d7a76' : '#ece6dc'} />
            {i === 0 && <Busabok />}
          </group>
        ) : null,
      )}
      <Chedi pos={[WAT_PHRA_KAEW[0] + 0.6, 0, WAT_PHRA_KAEW[1] - 0.4]} s={0.55} k={donTao} color="#f1ece2" night={night} />
      <Viharn pos={[WAT_PHRA_KAEW[0] - 0.5, 0, WAT_PHRA_KAEW[1] + 0.5]} k={donTao} scale={0.35} />
      {/* พระแก้วมรกต, set outside the hall so the dive sees it (CLAUDE.md), 1436-1468 */}
      {emerald > 0.02 && (
        <group position={[WAT_PHRA_KAEW[0] - 0.4, 0, WAT_PHRA_KAEW[1] - 0.6]} scale={emerald}>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.4, 0.5, 0.4]} />
            <meshStandardMaterial color="#e2b04a" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <icosahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial color="#2fbf6a" toneMapped={false} />
          </mesh>
        </group>
      )}
      <LampangLuang k={luang} night={night} terrainH={terrainH} />
      <Army f={tc.mahayot} color="#2e3f6e" terrainH={terrainH} />
      <Army f={tc.villagers} color="#8e2e2e" terrainH={terrainH} />
      {tc.flash > 0.02 && (
        <mesh position={[LAMPANG_LUANG[0] + 1.6, terrainH(LAMPANG_LUANG[0], LAMPANG_LUANG[1]) + 1.2, LAMPANG_LUANG[1] - 1.2]} scale={0.6 + tc.flash}>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshBasicMaterial color="#ffd36a" toneMapped={false} transparent opacity={tc.flash} />
        </mesh>
      )}
      <Army f={army} color="#8e2e2e" terrainH={terrainH} />
      {logs.map((l, i) =>
        l ? (
          <group key={i} position={[l.x, 0.12, l.z]} rotation-y={l.rot}>
            {[-0.36, -0.18, 0, 0.18, 0.36].map((dx) => (
              <mesh key={dx} position={[dx * 0.9, 0, 0]} rotation-x={Math.PI / 2} castShadow>
                <cylinderGeometry args={[0.09, 0.09, 2.6, 6]} />
                <meshStandardMaterial color="#8a5a34" roughness={0.9} />
              </mesh>
            ))}
          </group>
        ) : null,
      )}
      <WatSiChum k={siChum} />
      <BanSaoNak k={saoNak} />
      <Kilns k={kilns} t={t} />
      <MaeMoh pit={pit} plant={plant} t={t} terrainH={terrainH} />
      {carriage && (
        <group position={[carriage.x, 0.14, carriage.z]} rotation-y={carriage.rot - Math.PI / 2} scale={1.3}>
          <Carriage t={t} />
        </group>
      )}
      {modern > 0.02 &&
        [0, 1, 2, 3].map((i) => {
          // the bridge runs north-south across the Wang
          const u = ((t * 0.12 + i * 0.25) % 1) * 2 - 1;
          return (
            <group key={i} position={[BRIDGE[0] + (i % 2 ? 0.3 : -0.3), 0.16, BRIDGE[1] + (i % 2 ? -u : u) * 2.6]} rotation-y={i % 2 ? Math.PI / 2 : -Math.PI / 2} scale={0.75 * modern}>
              <Carriage t={t + i} />
            </group>
          );
        })}
    </>
  );
};
