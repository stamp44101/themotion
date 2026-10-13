import React, {useMemo} from 'react';
import {random} from 'remotion';
import {mix, ramp, smooth} from '../../lib';
import {Prang, SmallChedi, Viharn, lathe} from '../../engine/parts';
import type {LandmarkProps} from '../../engine/types';

/* Phitsanulok sits on both banks of the Nan. The old walled city and Wat Yai
 * are on the east bank; the Chandra Palace — Trailokanat's residence and
 * Naresuan's birthplace — is on the west. The Khwae Noi joins from the
 * north-west, which is what "สองแคว" (two rivers) means. */

export const WAT_YAI: [number, number] = [5, -1];
export const CHANDRA: [number, number] = [-5.3, -9];
/** The image stands on the viharn porch, not inside it -- a drone dive into
 *  the hall only ever sees roof. Exported so the camera keys and the callout
 *  track it instead of hard-coding the offset in three places. */
export const CHINNARAT: [number, number] = [WAT_YAI[0], WAT_YAI[1] - 6.2];
export const CHULAMANI: [number, number] = [5, 19];
// bounding half-extents of the traced outline (see index.ts)
export const HX = 7.1;
export const HZ = 18.3;

const CHINNARAT_CAST = 1357;
const WAT_YAI_BUILT = 1357;
const SIEGE = 1776;
const FIRE = 1957;

const LATERITE = '#9b8166';
const TEAK = '#6d4b2f';

/** Khmer-into-Ayutthaya prang profile — taller and more tapered than the
 *  Sukhothai lotus bud. */
const PRANG_TALL: [number, number][] = [
  [0, 0], [1.5, 0], [1.5, 0.6], [1.25, 0.7], [1.25, 2.2], [1.45, 2.35], [1.2, 2.5],
  [1.1, 3.4], [0.92, 4.3], [0.72, 5.2], [0.52, 6.0], [0.34, 6.7], [0.2, 7.3],
  [0.1, 7.8], [0.16, 8.0], [0.05, 8.5], [0, 8.8],
];

/** The main prang of Wat Phra Si Rattana Mahathat. */
const MainPrang: React.FC<{pos: [number, number, number]; k: number; ruin: number; glow: number; scale?: number}> = ({
  pos,
  k,
  ruin,
  glow,
  scale = 1,
}) => {
  const geo = useMemo(() => lathe(PRANG_TALL, 4), []);
  if (k < 0.02) return null;
  const c = mix('#e6dccb', LATERITE, ruin * 0.75);
  return (
    <group position={pos} scale={[scale, scale * k, scale]} rotation-y={Math.PI / 4}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.3 + i * 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.2 - i * 0.9, 0.6, 5.2 - i * 0.9]} />
          <meshStandardMaterial color={c} roughness={0.9} />
        </mesh>
      ))}
      <mesh geometry={geo} position={[0, 1.9, 0]} castShadow>
        <meshStandardMaterial color={c} roughness={0.8} flatShading emissive="#ffc46b" emissiveIntensity={glow * 0.3} />
      </mesh>
    </group>
  );
};

/** Phra Phuttha Chinnarat: seated Buddha under the distinctive flame halo
 *  (เปลวเพลิง) that makes this image instantly recognisable. */
const Chinnarat: React.FC<{pos: [number, number, number]; k: number; glow: number}> = ({pos, k, glow}) => {
  if (k < 0.02) return null;
  const gold = '#d8a62e';
  const S = 1.7 * k; // the image is the hero of this scene, not the hall behind it
  return (
    <group position={pos} scale={[S, S, S]}>
      {/* flame-shaped halo behind the image */}
      {/* a 225 deg arc starts at +x, so roll it back 22.5 deg to sit the
          opening at the bottom and centre the halo over the head */}
      <mesh position={[0, 1.5, -0.32]} rotation-z={-Math.PI * 0.125} castShadow>
        <torusGeometry args={[1.18, 0.12, 6, 20, Math.PI * 1.25]} />
        <meshStandardMaterial color={gold} roughness={0.35} metalness={0.65} emissive="#ffb347" emissiveIntensity={0.3 + glow} />
      </mesh>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[1.5, 0.44, 0.95]} />
        <meshStandardMaterial color={gold} roughness={0.4} metalness={0.6} emissive="#ffb347" emissiveIntensity={glow * 0.8} />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.52, 1.18, 8]} />
        <meshStandardMaterial color={gold} roughness={0.4} metalness={0.6} flatShading emissive="#ffb347" emissiveIntensity={glow * 0.8} />
      </mesh>
      <mesh position={[0, 1.78, 0]} castShadow>
        <sphereGeometry args={[0.28, 10, 8]} />
        <meshStandardMaterial color={gold} roughness={0.4} metalness={0.6} emissive="#ffb347" emissiveIntensity={glow * 0.8} />
      </mesh>
      <mesh position={[0, 2.14, 0]} castShadow>
        <coneGeometry args={[0.09, 0.34, 6]} />
        <meshStandardMaterial color={gold} roughness={0.35} metalness={0.7} emissive="#ffb347" emissiveIntensity={0.2 + glow} />
      </mesh>
    </group>
  );
};

/** Chandra Palace — teak halls on a laterite platform. Burned in the siege,
 *  so after 1776 only the excavated foundations remain. */
const ChandraPalace: React.FC<{pos: [number, number, number]; k: number; ruin: number; scale?: number}> = ({pos, k, ruin, scale = 1}) => {
  if (k < 0.02) return null;
  const standing = k * (1 - ruin);
  return (
    <group position={pos} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[7.4, 0.36, 5.6]} />
        <meshStandardMaterial color={mix('#b9a890', LATERITE, ruin)} roughness={1} />
      </mesh>
      {standing > 0.02 && (
        <>
          <mesh position={[0, 0.36 + 0.75 * standing, 0]} scale={[1, standing, 1]} castShadow>
            <boxGeometry args={[5.0, 1.5, 3.4]} />
            <meshStandardMaterial color={TEAK} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.36 + 1.5 * standing + 0.5 * standing, 0]} scale={[1, standing, 1]} rotation-y={Math.PI / 4} castShadow>
            <coneGeometry args={[3.6, 1.1, 4]} />
            <meshStandardMaterial color="#8c2f24" roughness={0.75} flatShading />
          </mesh>
        </>
      )}
      {/* foundation stubs, revealed as the timber goes */}
      {ruin > 0.1 &&
        new Array(8).fill(0).map((_, i) => (
          <mesh key={i} position={[-2.8 + (i % 4) * 1.9, 0.36 + 0.22 * ruin, i < 4 ? -1.4 : 1.4]} scale={[1, ruin, 1]} castShadow>
            <boxGeometry args={[0.42, 0.45, 0.42]} />
            <meshStandardMaterial color={LATERITE} roughness={1} />
          </mesh>
        ))}
    </group>
  );
};

const FIRE_CELLS = new Array(30).fill(0).map((_, i) => ({
  x: -9 + random(`fx${i}`) * 18,
  z: -11 + random(`fz${i}`) * 22,
  s: 0.5 + random(`fs${i}`) * 1.1,
  ph: random(`fp${i}`) * Math.PI * 2,
}));

/** The 1957 fire: a short, bright flare across the market quarter, then smoke.
 *  Modelled as emissive cards rather than particles — it reads at this scale
 *  and costs nothing. */
const GreatFire: React.FC<{Y: number; t: number}> = ({Y, t}) => {
  // two burnings: the 1775 sack and the 1957 fire
  const sack = ramp(Y, SIEGE - 3, SIEGE) * (1 - ramp(Y, SIEGE + 4, SIEGE + 16));
  const blaze = ramp(Y, FIRE - 2, FIRE) * (1 - ramp(Y, FIRE + 1.5, FIRE + 9));
  const burn = Math.max(sack, blaze);
  const smoke = Math.max(
    ramp(Y, SIEGE - 2, SIEGE + 2) * (1 - ramp(Y, SIEGE + 12, SIEGE + 34)),
    ramp(Y, FIRE - 1, FIRE + 2) * (1 - ramp(Y, FIRE + 8, FIRE + 22)),
  );
  if (burn < 0.01 && smoke < 0.01) return null;
  return (
    <group>
      {burn > 0.02 && (
        <mesh position={[0, 0.75, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[15, 28]} />
          <meshBasicMaterial color="#ff6a14" transparent opacity={0.34 * burn} toneMapped={false} depthWrite={false} />
        </mesh>
      )}
      {FIRE_CELLS.map((c, i) => {
        const f = 0.6 + 0.4 * Math.sin(t * 7 + c.ph);
        return (
          <React.Fragment key={i}>
            {burn > 0.01 && (
              <mesh position={[c.x, 1.9 * c.s * burn * f, c.z]} scale={[c.s, c.s * burn * f, c.s]}>
                <coneGeometry args={[1.1, 4.2, 5]} />
                <meshBasicMaterial color="#ff8418" transparent opacity={0.95 * burn} toneMapped={false} depthWrite={false} />
              </mesh>
            )}
            {burn > 0.01 && (
              <mesh position={[c.x, 1.4 * c.s * burn * f, c.z]} scale={[c.s * 0.52, c.s * burn * f * 0.8, c.s * 0.52]}>
                <coneGeometry args={[1.1, 4.2, 5]} />
                <meshBasicMaterial color="#ffe08a" transparent opacity={0.95 * burn} toneMapped={false} depthWrite={false} />
              </mesh>
            )}
            {smoke > 0.01 && (
              <mesh position={[c.x + Math.sin(t * 0.4 + c.ph) * 1.2, 2.4 + c.s * 2.2 + (t % 6) * 0.3, c.z]} scale={[c.s * 1.8, c.s * 1.6, c.s * 1.8]}>
                <sphereGeometry args={[0.9, 7, 6]} />
                <meshStandardMaterial color="#4a4038" transparent opacity={0.3 * smoke} />
              </mesh>
            )}
          </React.Fragment>
        );
      })}
    </group>
  );
};

export const PhitsanulokLandmarks: React.FC<LandmarkProps> = ({Y, t, night}) => {
  const khmer = smooth(ramp(Y, 1100, 1140));
  const watYai = smooth(ramp(Y, WAT_YAI_BUILT - 14, WAT_YAI_BUILT + 6));
  const chinnarat = smooth(ramp(Y, CHINNARAT_CAST - 4, CHINNARAT_CAST + 4));
  const palace = smooth(ramp(Y, 1448, 1466));
  const palaceRuin = ramp(Y, SIEGE, SIEGE + 40);

  // Wat Yai was never abandoned — it is still an active temple — so it only
  // weathers during the dark century rather than falling into ruin.
  const weather = ramp(Y, SIEGE, SIEGE + 60) * (1 - ramp(Y, 1900, 1960)) * 0.6;
  const lit = night * ramp(Y, 1930, 1975);
  const glow = chinnarat * (0.25 + 0.75 * lit);

  return (
    <group>
      {/* Wat Phra Si Rattana Mahathat: prang, viharn, and the image inside */}
      <MainPrang pos={[WAT_YAI[0], 0, WAT_YAI[1]]} k={watYai} ruin={weather} glow={lit * 0.8} scale={0.8} />
      <Viharn pos={[WAT_YAI[0], 0, WAT_YAI[1] - 3.6]} k={watYai} scale={1.1} />
      {/* on the porch, not inside the hall -- inside, the drone only ever sees roof */}
      <Chinnarat pos={[CHINNARAT[0], 0.3, CHINNARAT[1]]} k={chinnarat} glow={glow} />
      {[-1, 1].map((s) => (
        <SmallChedi
          key={s}
          pos={[WAT_YAI[0] - 2.4, 0, WAT_YAI[1] + s * 2.6]}
          scale={0.8}
          k={watYai}
          color={mix('#e6dccb', LATERITE, weather)}
          glow={lit * 0.4}
        />
      ))}

      {/* Wat Chulamani: the oldest thing standing, Khmer laterite */}
      <Prang pos={[CHULAMANI[0], 0, CHULAMANI[1]]} k={khmer} scale={1.15} color={LATERITE} />
      <Viharn pos={[CHULAMANI[0] + 4, 0, CHULAMANI[1]]} k={khmer * 0.9} rot={Math.PI / 2} scale={0.9} />

      {/* Chandra Palace on the west bank */}
      <ChandraPalace pos={[CHANDRA[0], 0, CHANDRA[1]]} k={palace} ruin={palaceRuin} scale={0.48} />

      <GreatFire Y={Y} t={t} />
    </group>
  );
};
