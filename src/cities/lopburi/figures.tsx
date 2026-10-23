// Lopburi's figures: พระปรางค์สามยอด at hero scale, Hanuman (the face after the owner's
// references, PR #67) and the macaques. Used by the city and the style frames.
import React from 'react';
import * as THREE from 'three';
import {lathe, PRANG} from '../../engine/parts';

// ------------------------------------------------------------------ พระปรางค์สามยอด
// three laterite towers in a row north-south, joined by low galleries; hero scale
export const LATERITE = '#a2603f';
export const STUCCO = '#d9c7a8';
const PRANG_GEO = lathe(PRANG, 12);
export const PrangSamYot: React.FC<{y: number}> = ({y}) => (
  <group position={[0, y, 0]}>
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[4.2, 0.8, 11]} />
      <meshStandardMaterial color="#8f5a3e" flatShading />
    </mesh>
    {[-3.6, 0, 3.6].map((z) => (
      <group key={z} position={[0, 0.8, z]} scale={z === 0 ? 1.55 : 1.35}>
        <mesh geometry={PRANG_GEO} castShadow receiveShadow>
          <meshStandardMaterial color={LATERITE} flatShading roughness={0.95} />
        </mesh>
        <mesh position={[0, 4.2, 0]}>
          <coneGeometry args={[0.16, 0.6, 8]} />
          <meshStandardMaterial color={STUCCO} />
        </mesh>
      </group>
    ))}
    {[-1.8, 1.8].map((z) => (
      <mesh key={z} position={[0, 1.9, z]} castShadow>
        <boxGeometry args={[1.5, 2.2, 1.6]} />
        <meshStandardMaterial color={LATERITE} flatShading roughness={0.95} />
      </mesh>
    ))}
  </group>
);

// ------------------------------------------------------------------ a limb between two points
const UP = new THREE.Vector3(0, 1, 0);
const Limb: React.FC<{a: THREE.Vector3; b: THREE.Vector3; r: number; color: string}> = ({a, b, r, color}) => {
  const d = new THREE.Vector3().subVectors(b, a);
  const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
  return (
    <mesh position={a.clone().add(b).multiplyScalar(0.5)} quaternion={q} castShadow>
      <capsuleGeometry args={[r, d.length(), 4, 10]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
};
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const WHITE = '#f6f3ec';
const GOLD = '#e0a93a';

// ------------------------------------------------------------------ three faces to choose from
// A cartoon: round, dot eyes. B between: a longer muzzle, almond eyes with an amber iris, brows,
// a diadem with a short ยอด. C khon: the mask of the khon Hanuman, white with gold lines, big
// gold-ringed eyes, the wide open mouth with a row of teeth and crystal fangs, กรรเจียก fanning
// at the ears and a tall gold ยอด. Modelled facing +z, unit about the skull's radius x2.
export type Face = 'cartoon' | 'middle' | 'khon' | 'thai';
const M = {color: WHITE, roughness: 0.55} as const;
const G = {color: GOLD, metalness: 0.55, roughness: 0.3} as const;
// D thai: after the owner's references (Mr. Mee Studio's Hanuman and similar Thai character
// art): a white bald dome with thin red stripes over the top, a gold headband with a red jewel
// and gold กนก fanning at the ears, big round eyes, a wide grin with teeth and small fangs, blue
// spirals on the cheeks. No tall crown: Hanuman is หัวโล้น.
const KANOK = (() => {
  const sh = new THREE.Shape();
  sh.moveTo(0.06, 0);
  sh.quadraticCurveTo(0.2, 0.35, 0.05, 0.7);
  sh.quadraticCurveTo(-0.05, 0.85, -0.22, 0.8);
  sh.quadraticCurveTo(-0.08, 0.7, -0.1, 0.55);
  sh.quadraticCurveTo(-0.22, 0.5, -0.2, 0.38);
  sh.quadraticCurveTo(-0.08, 0.35, -0.1, 0.2);
  sh.quadraticCurveTo(-0.12, 0.08, -0.06, 0);
  sh.lineTo(0.06, 0);
  return new THREE.ExtrudeGeometry(sh, {depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 1, curveSegments: 8});
})();
const BLUE = '#4f86d1';
const ThaiHead: React.FC = () => (
  <group>
    {/* the bald dome, drawn up to a soft point like an onion, and a muzzle */}
    <mesh scale={[0.5, 0.52, 0.47]} castShadow><sphereGeometry args={[1, 24, 18]} /><meshStandardMaterial {...M} /></mesh>
    <mesh position={[0, 0.38, -0.02]} scale={[0.3, 0.3, 0.29]} castShadow><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial {...M} /></mesh>
    <mesh position={[0, 0.7, -0.04]} rotation-x={-0.2} castShadow><coneGeometry args={[0.1, 0.22, 12]} /><meshStandardMaterial {...M} /></mesh>
    <mesh position={[0, -0.16, 0.3]} scale={[0.35, 0.23, 0.26]} castShadow><sphereGeometry args={[1, 18, 12]} /><meshStandardMaterial color="#fbf1ec" roughness={0.55} /></mesh>
    {/* red stripes up over the dome to the point */}
    <group position={[0, 0.38, -0.02]} rotation-x={-0.9}>
      {[-0.13, 0, 0.13].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation-y={Math.PI / 2}>
          <torusGeometry args={[Math.sqrt(0.315 * 0.315 - x * x), 0.014, 5, 20, Math.PI * 0.85]} />
          <meshStandardMaterial color="#d2504a" />
        </mesh>
      ))}
    </group>
    {/* a friendly open smile: dark red inside, a row of teeth, two small fangs, the tongue */}
    <mesh position={[0, -0.2, 0.53]} scale={[0.2, 0.09, 0.07]}><sphereGeometry args={[1, 18, 10]} /><meshStandardMaterial color="#7d2a22" /></mesh>
    <mesh position={[0, -0.25, 0.565]} scale={[0.09, 0.035, 0.04]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#e07a72" /></mesh>
    <mesh position={[0, -0.14, 0.575]} scale={[0.24, 0.035, 0.03]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#fffaf0" /></mesh>
    {/* the khon line framing the face, under the eyes and round the muzzle */}
    <mesh position={[0, -0.04, 0.44]} rotation-z={Math.PI} scale={[1, 0.8, 1]}>
      <torusGeometry args={[0.3, 0.011, 5, 28, Math.PI]} />
      <meshStandardMaterial color={BLUE} />
    </mesh>
    {[-1, 1].map((s) => (
      <group key={s}>
        <mesh position={[s * 0.11, -0.19, 0.58]} rotation-x={Math.PI}><coneGeometry args={[0.022, 0.06, 5]} /><meshStandardMaterial color="#fffaf0" /></mesh>
        {/* big round eyes, outlined, with a highlight */}
        <group position={[s * 0.15, 0.09, 0.4]} rotation-y={s * 0.2}>
          <mesh scale={[1, 1.1, 0.7]}><sphereGeometry args={[0.1, 16, 12]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[s * -0.01, -0.005, 0.06]} scale={[1, 1.1, 0.5]}><sphereGeometry args={[0.062, 14, 10]} /><meshStandardMaterial color="#1a1410" /></mesh>
          <mesh position={[0.02 - s * 0.01, 0.03, 0.095]}><sphereGeometry args={[0.018, 8, 6]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
          <mesh scale={[1, 1.1, 1]}><torusGeometry args={[0.1, 0.01, 5, 20]} /><meshStandardMaterial color="#3a2a22" /></mesh>
        </group>
        {/* red brow curls and a pink line at the temple */}
        <mesh position={[s * 0.16, 0.22, 0.39]} rotation-z={s * 0.25}>
          <torusGeometry args={[0.07, 0.012, 5, 14, Math.PI * 0.9]} />
          <meshStandardMaterial color="#d2504a" />
        </mesh>
        <group position={[s * 0.33, 0.1, 0.33]} rotation-y={s * 0.8}>
          <mesh rotation-z={s * 0.4}><torusGeometry args={[0.09, 0.01, 5, 16, Math.PI * 0.8]} /><meshStandardMaterial color="#e27a8f" /></mesh>
        </group>
        {/* blue spirals on the cheeks */}
        <group position={[s * 0.4, -0.04, 0.33]} rotation-y={s * 0.85} scale={1.2}>
          <mesh><torusGeometry args={[0.07, 0.012, 5, 18, Math.PI * 1.6]} /><meshStandardMaterial color={BLUE} /></mesh>
          <mesh rotation-z={1}><torusGeometry args={[0.035, 0.01, 5, 14, Math.PI * 1.4]} /><meshStandardMaterial color={BLUE} /></mesh>
        </group>
        {/* gold กนก at the ears, small and close to the head */}
        <group position={[s * 0.47, 0.08, 0.02]} rotation-y={s * 1.15} rotation-z={s * -0.25} scale={[-s * 0.45, 0.45, 0.45]}>
          <mesh geometry={KANOK} castShadow><meshStandardMaterial {...G} /></mesh>
        </group>
      </group>
    ))}
    {/* the gold headband, a darker pattern line along it, and its red jewel */}
    <mesh position={[0, 0.25, 0.03]} rotation-x={-0.12}>
      <cylinderGeometry args={[0.455, 0.475, 0.11, 28, 1, true]} />
      <meshStandardMaterial {...G} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0.25, 0.03]} rotation-x={Math.PI / 2 - 0.12}>
      <torusGeometry args={[0.472, 0.012, 5, 28]} />
      <meshStandardMaterial color="#b9802a" metalness={0.5} roughness={0.35} />
    </mesh>
    <mesh position={[0, 0.27, 0.48]} rotation-x={0.1}>
      <octahedronGeometry args={[0.06, 0]} />
      <meshStandardMaterial color="#c0392b" metalness={0.3} roughness={0.25} />
    </mesh>
  </group>
);

export const HanumanHead: React.FC<{face: Face}> = ({face}) => {
  if (face === 'thai') return <ThaiHead />;
  if (face === 'cartoon')
    return (
      <group>
        <mesh scale={[0.48, 0.5, 0.46]} castShadow><sphereGeometry args={[1, 18, 14]} /><meshStandardMaterial {...M} /></mesh>
        <mesh position={[0, -0.12, 0.38]} scale={[0.32, 0.22, 0.24]} castShadow><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial {...M} /></mesh>
        <mesh position={[0, -0.24, 0.5]} scale={[0.24, 0.12, 0.12]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#b32a22" /></mesh>
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.13, -0.16, 0.58]} rotation-x={Math.PI}><coneGeometry args={[0.04, 0.16, 5]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
            <mesh position={[s * 0.17, 0.08, 0.38]}><sphereGeometry args={[0.09, 12, 10]} /><meshStandardMaterial color="#fffaf0" /></mesh>
            <mesh position={[s * 0.18, 0.08, 0.46]}><sphereGeometry args={[0.05, 10, 8]} /><meshStandardMaterial color="#2a1608" /></mesh>
          </group>
        ))}
        <mesh position={[0, 0.2, 0]} rotation-x={Math.PI / 2 - 0.15}><torusGeometry args={[0.47, 0.06, 6, 24]} /><meshStandardMaterial {...G} /></mesh>
        <mesh position={[0, 0.42, 0.36]} rotation-x={-0.3}><coneGeometry args={[0.08, 0.32, 6]} /><meshStandardMaterial {...G} /></mesh>
      </group>
    );
  const khon = face === 'khon';
  return (
    <group>
      {/* skull and a longer muzzle */}
      <mesh scale={[0.46, 0.48, 0.44]} castShadow><sphereGeometry args={[1, 20, 16]} /><meshStandardMaterial {...M} /></mesh>
      <mesh position={[0, -0.14, 0.36]} scale={[0.3, 0.2, 0.3]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial {...M} /></mesh>
      {/* the mouth: open, red inside; khon shows a row of teeth and long crystal fangs */}
      <mesh position={[0, -0.25, 0.5]} scale={[khon ? 0.27 : 0.2, khon ? 0.13 : 0.08, 0.14]}><sphereGeometry args={[1, 14, 8]} /><meshStandardMaterial color="#a8231c" /></mesh>
      {khon &&
        Array.from({length: 7}, (_, i) => (
          <mesh key={i} position={[(i - 3) * 0.055, -0.2, 0.64 - Math.abs(i - 3) * 0.03]}>
            <boxGeometry args={[0.045, 0.06, 0.03]} />
            <meshStandardMaterial color="#fffaf0" />
          </mesh>
        ))}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * (khon ? 0.2 : 0.12), -0.2, 0.56]} rotation-x={Math.PI} rotation-z={s * 0.15}>
            <coneGeometry args={[khon ? 0.035 : 0.03, khon ? 0.24 : 0.13, 6]} />
            <meshBasicMaterial color={khon ? '#e9f6ff' : '#ffffff'} toneMapped={false} />
          </mesh>
          {/* eyes: almond with an amber iris (B); big, round and gold-ringed (C) */}
          <group position={[s * 0.17, 0.08, 0.37]} rotation-y={s * 0.25} scale={khon ? [1.25, 1.25, 1] : [1, 0.82, 1]}>
            <mesh><sphereGeometry args={[0.1, 14, 12]} /><meshStandardMaterial color="#fffaf0" /></mesh>
            <mesh position={[0, 0, 0.07]} scale={[1, 1, 0.5]}><sphereGeometry args={[0.062, 12, 10]} /><meshStandardMaterial color={khon ? '#1a0d05' : '#c8861c'} /></mesh>
            <mesh position={[0, 0, 0.095]} scale={[1, 1, 0.5]}><sphereGeometry args={[0.032, 10, 8]} /><meshStandardMaterial color="#120a04" /></mesh>
            <mesh position={[0.025, 0.03, 0.105]}><sphereGeometry args={[0.014, 6, 5]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
            {khon && (
              <mesh rotation-x={0}><torusGeometry args={[0.105, 0.018, 6, 20]} /><meshStandardMaterial {...G} /></mesh>
            )}
          </group>
          {/* brows sweeping up and out */}
          <mesh position={[s * 0.18, 0.21, 0.4]} rotation-z={s * 0.3} scale={[0.14, 0.03, 0.05]}>
            <sphereGeometry args={[1, 10, 6]} />
            <meshStandardMaterial {...(khon ? G : M)} />
          </mesh>
          {/* khon: gold lines on the cheeks and the fanned ear ornaments (กรรเจียก) */}
          {khon && (
            <>
              <mesh position={[s * 0.27, -0.06, 0.33]} rotation-y={s * 0.75} rotation-z={s * 0.6}>
                <torusGeometry args={[0.1, 0.016, 5, 16, Math.PI * 1.5]} />
                <meshStandardMaterial {...G} />
              </mesh>
              <group position={[s * 0.42, 0.0, 0.1]} rotation-y={s * 0.9} scale={1.5}>
                {[0, 1, 2].map((k) => (
                  <mesh key={k} position={[0, 0.1 + k * 0.07, -0.05 * k]} rotation-x={-0.3 - k * 0.2} scale={[0.13 - k * 0.025, 0.24 - k * 0.04, 0.02]}>
                    <sphereGeometry args={[1, 10, 6]} />
                    <meshStandardMaterial {...G} />
                  </mesh>
                ))}
              </group>
            </>
          )}
        </group>
      ))}
      {/* diadem; B has a short ยอด, C the tall tiered gold ยอด of the khon headdress */}
      <mesh position={[0, 0.2, 0]} rotation-x={Math.PI / 2 - 0.15}><torusGeometry args={[0.46, khon ? 0.07 : 0.055, 6, 26]} /><meshStandardMaterial {...G} /></mesh>
      {khon ? (
        <group position={[0, 0.42, 0.02]}>
          {[0, 1, 2, 3].map((k) => (
            <group key={k} position={[0, k * 0.11, 0]}>
              <mesh>
                <cylinderGeometry args={[0.19 - k * 0.04, 0.24 - k * 0.045, 0.14, 14]} />
                <meshStandardMaterial {...G} />
              </mesh>
              <mesh position={[0, -0.06, 0]} rotation-x={Math.PI / 2}>
                <torusGeometry args={[0.24 - k * 0.045, 0.018, 6, 20]} />
                <meshStandardMaterial color="#b9802a" metalness={0.5} roughness={0.35} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 0.6, 0]}><coneGeometry args={[0.07, 0.42, 10]} /><meshStandardMaterial {...G} /></mesh>
        </group>
      ) : (
        <mesh position={[0, 0.45, 0.2]} rotation-x={-0.25}><coneGeometry args={[0.07, 0.26, 6]} /><meshStandardMaterial {...G} /></mesh>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ หนุมาน
// White as in khon, a gold diadem and jewellery, the open mouth with crystal fangs, a long tail
// curling up. Modelled facing +z, about 4 tall standing; `leap` 0 = crouched on landing, 1 = flying.
export const Hanuman: React.FC<{leap: number; t: number; face?: Face}> = ({leap, t, face = 'thai'}) => {
  const k = leap;
  const hip = v(0, 1.5 - (1 - k) * 0.5, 0);
  const chest = v(0, 2.45 - (1 - k) * 0.55, 0.25 + k * 0.35);
  const head = chest.clone().add(v(0, 0.75, 0.25));
  const sh = (s: number) => chest.clone().add(v(s * 0.5, 0.15, 0));
  // arms reach forward when flying, plant on the ground on landing
  const hand = (s: number) =>
    k > 0.5 ? chest.clone().add(v(s * 0.55, 0.5, 1.4)) : v(s * 0.8, 0.15, 1.0);
  const elbow = (s: number) => sh(s).clone().lerp(hand(s), 0.5).add(v(s * 0.25, k > 0.5 ? 0.1 : 0.3, -0.1));
  // legs trail behind in flight, fold into a crouch on landing
  const foot = (s: number) => (k > 0.5 ? hip.clone().add(v(s * 0.35, -0.6, -1.6)) : v(s * 0.55, 0.1, 0.1));
  const knee = (s: number) => (k > 0.5 ? hip.clone().add(v(s * 0.35, -0.75, -0.6)) : v(s * 0.6, 0.85, 0.75));
  const tail = new THREE.CatmullRomCurve3([
    hip.clone().add(v(0, 0, -0.4)),
    hip.clone().add(v(0, 0.3, -1.4)),
    hip.clone().add(v(0.3, 1.6, -2.0)),
    hip.clone().add(v(0.2, 2.6, -1.3)),
    hip.clone().add(v(-0.2, 2.6, -0.7 + Math.sin(t * 3) * 0.1)),
  ]);
  return (
    <group>
      {/* body */}
      <mesh position={hip.clone().lerp(chest, 0.5)} rotation-x={0.25 + k * 0.4} scale={[0.62, 0.95, 0.5]} castShadow>
        <sphereGeometry args={[1, 18, 14]} />
        <meshStandardMaterial color={WHITE} roughness={0.6} />
      </mesh>
      <mesh position={hip} scale={[0.6, 0.46, 0.5]} castShadow>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color="#e2762c" roughness={0.6} />
      </mesh>
      {/* gold belt and necklace */}
      <mesh position={hip.clone().add(v(0, 0.25, 0))} rotation-x={Math.PI / 2 + 0.2} castShadow>
        <torusGeometry args={[0.55, 0.07, 6, 20]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
      </mesh>
      {/* a gold collar lying on the chest with a pendant (ทับทรวง), and shoulder pieces */}
      <mesh position={chest.clone().add(v(0, 0.45, 0.12))} rotation-x={Math.PI / 2 - 0.5} scale={[1, 1, 0.5]}>
        <cylinderGeometry args={[0.46, 0.5, 0.12, 20, 1, true]} />
        <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={chest.clone().add(v(0, 0.15, 0.48))} rotation-x={0.4}>
        <octahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial color="#c0392b" metalness={0.3} roughness={0.3} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={sh(s).clone().add(v(s * 0.05, 0.12, 0))} rotation-z={-s * 0.6} scale={[0.32, 0.12, 0.28]}>
          <sphereGeometry args={[1, 10, 6]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
      {/* arms and legs, with gold bands */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Limb a={sh(s)} b={elbow(s)} r={0.17} color={WHITE} />
          <Limb a={elbow(s)} b={hand(s)} r={0.14} color={WHITE} />
          <mesh position={elbow(s).clone().lerp(hand(s), 0.7)} quaternion={new THREE.Quaternion().setFromUnitVectors(UP, hand(s).clone().sub(elbow(s)).normalize())}>
            <cylinderGeometry args={[0.17, 0.17, 0.12, 12]} />
            <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
          </mesh>
          <Limb a={hip.clone().add(v(s * 0.3, -0.1, 0))} b={knee(s)} r={0.23} color="#e2762c" />
          <Limb a={knee(s)} b={foot(s)} r={0.16} color={WHITE} />
        </group>
      ))}
      {/* cream spirals on the chest and arms, as in the references */}
      {face === 'thai' &&
        [
          [-0.22, 0.05, 0.42],
          [0.2, -0.15, 0.4],
          [0, -0.4, 0.38],
        ].map(([dx, dy, dz], i) => (
          <mesh key={i} position={chest.clone().add(v(dx, dy, dz))} rotation-x={-0.3}>
            <torusGeometry args={[0.1, 0.015, 5, 16, Math.PI * 1.6]} />
            <meshStandardMaterial color="#c9b78f" />
          </mesh>
        ))}
      {/* ตรีเพชร, the trident, in the right hand */}
      {face === 'thai' && (
        <group position={hand(1).clone().add(v(0.15, 0, 0.1))}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 2.0, 8]} />
            <meshStandardMaterial color="#b8862f" metalness={0.5} roughness={0.35} />
          </mesh>
          {[-1, 0, 1].map((k) => (
            <mesh key={k} position={[k * 0.14, 1.55 - Math.abs(k) * 0.08, 0]} rotation-z={-k * 0.25}>
              <coneGeometry args={[0.05, 0.42, 6]} />
              <meshStandardMaterial color="#d8dde3" metalness={0.7} roughness={0.25} />
            </mesh>
          ))}
          <mesh position={[0, 1.35, 0]}>
            <boxGeometry args={[0.36, 0.06, 0.06]} />
            <meshStandardMaterial color="#b8862f" metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      )}
      <mesh castShadow>
        <tubeGeometry args={[tail, 24, 0.09, 8, false]} />
        <meshStandardMaterial color={WHITE} roughness={0.6} />
      </mesh>
      <group position={head} scale={1.25}>
        <HanumanHead face={face} />
      </group>
    </group>
  );
};

// ------------------------------------------------------------------ the troop
// an ordinary macaque: grey-brown, a pink face, the tail held up in an arc; hops as it runs
const MONKEY_TAIL = new THREE.CatmullRomCurve3([v(0, 0, 0), v(0, 0.15, -0.3), v(0, 0.55, -0.4), v(0, 0.75, -0.2)]);
// a macaque sitting up, as they do on the prang
export const SittingMacaque: React.FC<{t: number}> = ({t}) => (
  <group>
    <mesh position={[0, 0.42, 0]} scale={[0.26, 0.38, 0.24]} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#8c7356" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.92, 0.04]} rotation-y={Math.sin(t * 1.3) * 0.5} scale={0.24} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#8c7356" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.9, 0.22]} scale={[0.13, 0.12, 0.06]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#d99a8a" />
    </mesh>
    <mesh position={[0, 0.08, -0.25]}>
      <tubeGeometry args={[MONKEY_TAIL, 12, 0.035, 5, false]} />
      <meshStandardMaterial color="#7a6249" />
    </mesh>
  </group>
);
export const Macaque: React.FC<{hop: number}> = ({hop}) => (
  <group position={[0, Math.abs(hop) * 0.35, 0]} rotation-x={hop * 0.15}>
    <mesh position={[0, 0.42, 0]} scale={[0.26, 0.24, 0.42]} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#8c7356" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.66, 0.38]} scale={0.24} castShadow>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#8c7356" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.63, 0.58]} scale={[0.13, 0.12, 0.07]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#d99a8a" />
    </mesh>
    {[
      [-0.15, 0.25],
      [0.15, 0.25],
      [-0.15, -0.25],
      [0.15, -0.25],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.18, z + (i < 2 ? hop : -hop) * 0.08]}>
        <capsuleGeometry args={[0.05, 0.25, 3, 6]} />
        <meshStandardMaterial color="#7a6249" />
      </mesh>
    ))}
    <mesh position={[0, 0.55, -0.42]}>
      <tubeGeometry args={[MONKEY_TAIL, 12, 0.035, 5, false]} />
      <meshStandardMaterial color="#7a6249" />
    </mesh>
  </group>
);

