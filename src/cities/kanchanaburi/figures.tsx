// Kanchanaburi's figures (style frames 3 Nov 2026; docs/briefs/kanchanaburi.md): the Kwai bridge
// (สะพานข้ามแม่น้ำแคว, 11 spans: the curved steel arches of 2486 and the three straight spans that
// replaced the ones bombed in 2488) and a steam locomotive with its smoke. Local space: the bridge runs
// along +x, one unit = the bridge's whole length, deck at y = DECK.
import React, {useMemo} from 'react';
import {Ball, Seg} from '../suratthani/figures';
export {Ball, Seg};

type V = [number, number, number];
export const STEEL = '#2c3036';
export const STEEL_NEW = '#4b525c';
export const PIER = '#9b9487';
export const DECK = 0.07;
const SPANS = 11;
const PITCH = 1 / SPANS;
const ARCH = 0.052;

/** span i (0..10) runs x in [i*PITCH, (i+1)*PITCH]; the repaired ones (4, 5, 6: the bombed middle) are straight. */
export const isStraight = (i: number, repaired: boolean) => repaired && i >= 4 && i <= 6;

const Span: React.FC<{i: number; straight: boolean; broken?: number}> = ({i, straight, broken = 0}) => {
  const x0 = i * PITCH;
  const x1 = x0 + PITCH;
  const color = straight ? STEEL_NEW : STEEL;
  const fall = broken * 0.08;
  const parts = useMemo(() => {
    const n = 8;
    const top: V[] = [];
    for (let k = 0; k <= n; k++) {
      const u = k / n;
      const h = straight ? ARCH * 0.8 : ARCH * Math.sin(Math.PI * u) ** 0.8;
      top.push([x0 + u * PITCH, DECK + 0.006 + h, 0]);
    }
    return top;
  }, [i, straight]);
  return (
    <group position={[0, -fall, 0]} rotation-z={broken ? -0.35 * broken * (i % 2 ? 1 : -1) : 0}>
      {[-0.011, 0.011].map((z, side) => (
        <group key={side} position={[0, 0, z]}>
          {parts.slice(1).map((p, k) => (
            <Seg key={k} a={[parts[k][0], parts[k][1], 0]} b={[p[0], p[1], 0]} r0={0.0016} r1={0.0016} color={color} />
          ))}
          {parts.map((p, k) => (
            <Seg key={'v' + k} a={[p[0], DECK + 0.004, 0]} b={[p[0], p[1], 0]} r0={0.0009} r1={0.0009} color={color} />
          ))}
          {parts.slice(1).map((p, k) => (
            <Seg key={'d' + k} a={[parts[k][0], k % 2 ? DECK + 0.004 : parts[k][1], 0]} b={[p[0], k % 2 ? p[1] : DECK + 0.004, 0]} r0={0.0007} r1={0.0007} color={color} />
          ))}
        </group>
      ))}
      <mesh position={[(x0 + x1) / 2, DECK, 0]} castShadow>
        <boxGeometry args={[PITCH, 0.006, 0.03]} />
        <meshStandardMaterial color="#22252a" flatShading roughness={0.9} />
      </mesh>
      <mesh position={[(x0 + x1) / 2, DECK + 0.005, 0]}>
        <boxGeometry args={[PITCH, 0.003, 0.012]} />
        <meshStandardMaterial color="#6b5a46" flatShading roughness={0.95} />
      </mesh>
    </group>
  );
};

/** The whole bridge. `grow` 0..1 raises piers then spans left to right; `repaired` swaps in the straight
 *  spans; `broken` 0..1 drops spans 4-6 (the 2488 raids). */
export const KwaiBridge: React.FC<{grow?: number; repaired?: boolean; broken?: number}> = ({grow = 1, repaired = false, broken = 0}) => (
  <group>
    {Array.from({length: SPANS + 1}, (_, i) => {
      const s = Math.max(0, Math.min(1, grow * (SPANS + 1) - i * 0.9));
      if (s < 0.02) return null;
      return (
        <mesh key={i} position={[i * PITCH, (DECK - 0.01) / 2, 0]} scale={[1, s, 1]} castShadow>
          <boxGeometry args={[0.012, DECK + 0.01, 0.034]} />
          <meshStandardMaterial color={PIER} flatShading roughness={0.95} />
        </mesh>
      );
    })}
    {Array.from({length: SPANS}, (_, i) => {
      const s = grow * (SPANS + 1) - i * 0.9 - 1;
      if (s < 0.2) return null;
      const down = broken > 0 && !repaired && i >= 4 && i <= 6;
      return <Span key={i} i={i} straight={isStraight(i, repaired)} broken={down ? broken : 0} />;
    })}
  </group>
);

// ---------------------------------------------------------------- the steam locomotive
const BLACK = '#17181b';
const RED = '#7a1f1a';
const BRASS = '#b88a3a';

export const Wheel: React.FC<{p: V; r: number; spin: number}> = ({p, r, spin}) => (
  <group position={p} rotation-x={Math.PI / 2}>
    <mesh rotation-y={spin} castShadow>
      <cylinderGeometry args={[r, r, r * 0.35, 12]} />
      <meshStandardMaterial color={BLACK} flatShading roughness={0.7} />
    </mesh>
    <mesh position={[0, 0, 0]} rotation-y={spin}>
      <boxGeometry args={[r * 1.6, r * 0.4, r * 0.1]} />
      <meshStandardMaterial color={BRASS} flatShading />
    </mesh>
  </group>
);

/** A small steam engine and tender, 1 unit long, facing +x. `t` is the wheel phase. */
export const SteamLoco: React.FC<{wagons?: number; t?: number}> = ({wagons = 3, t = 0}) => {
  const r = 0.07;
  const wheels = [0.18, 0.31, 0.44, 0.7, 0.8];
  return (
    <group>
      <mesh position={[0.4, r * 1.9, 0]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.62, 14]} />
        <meshStandardMaterial color={BLACK} flatShading roughness={0.6} />
      </mesh>
      <mesh position={[0.4, r * 1.9, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.103, 0.103, 0.04, 14]} />
        <meshStandardMaterial color={RED} flatShading />
      </mesh>
      <mesh position={[0.62, r * 3.9, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.15, 10]} />
        <meshStandardMaterial color={BLACK} flatShading />
      </mesh>
      <mesh position={[0.5, r * 3.2, 0]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color={BRASS} flatShading />
      </mesh>
      <mesh position={[0.14, r * 2.6, 0]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.22]} />
        <meshStandardMaterial color={RED} flatShading roughness={0.8} />
      </mesh>
      <mesh position={[0.14, r * 4.1, 0]} castShadow>
        <boxGeometry args={[0.24, 0.02, 0.26]} />
        <meshStandardMaterial color={BLACK} flatShading />
      </mesh>
      <mesh position={[0.9, r * 2.4, 0]} castShadow>
        <boxGeometry args={[0.28, 0.17, 0.2]} />
        <meshStandardMaterial color={BLACK} flatShading roughness={0.8} />
      </mesh>
      {wheels.map((x, i) => (
        <React.Fragment key={i}>
          <Wheel p={[x, r, 0.115]} r={r * (i < 3 ? 1.1 : 0.8)} spin={t * 6} />
          <Wheel p={[x, r, -0.115]} r={r * (i < 3 ? 1.1 : 0.8)} spin={t * 6} />
        </React.Fragment>
      ))}
      {Array.from({length: wagons}, (_, k) => (
        <mesh key={k} position={[1.28 + k * 0.42, r * 2.3, 0]} castShadow>
          <boxGeometry args={[0.38, 0.16, 0.2]} />
          <meshStandardMaterial color={k % 2 ? '#5a3b26' : '#3d4a3a'} flatShading roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

/** Smoke: `u` is the time since the puff left the chimney (s); a trail of grey balls drifting back. */
export const Smoke: React.FC<{t: number; speed: number; count?: number}> = ({t, speed, count = 7}) => (
  <group>
    {Array.from({length: count}, (_, i) => {
      const age = (t * 1.2 + i / count) % 1;
      const s = 0.03 + age * 0.12;
      const o = (1 - age) * 0.8;
      return <Ball key={i} p={[-age * 0.75 * (speed > 0 ? 1 : 0) - 0.05, age * 0.35, 0.01 * Math.sin(i * 3)]} s={s} color="#dcdcd8" basic opacity={o} detail={1} />;
    })}
  </group>
);

// ---------------------------------------------------------------- a war elephant (1 unit long), facing +x
const GREY = '#7d7b78';
export const Elephant: React.FC<{step?: number}> = ({step = 0}) => (
  <group>
    <Ball p={[0, 0.5, 0]} s={[0.5, 0.36, 0.3]} color={GREY} />
    <Ball p={[0.46, 0.62, 0]} s={[0.2, 0.2, 0.2]} color={GREY} />
    <Seg a={[0.6, 0.55, 0]} b={[0.74, 0.18, 0]} r0={0.07} r1={0.04} color={GREY} />
    <Ball p={[0.5, 0.64, 0.17]} s={[0.04, 0.13, 0.13]} color="#8d8a86" />
    <Ball p={[0.5, 0.64, -0.17]} s={[0.04, 0.13, 0.13]} color="#8d8a86" />
    {[[-0.28, 0.14], [-0.28, -0.14], [0.28, 0.14], [0.28, -0.14]].map(([x, z], i) => (
      <Seg key={i} a={[x, 0.4, z]} b={[x + 0.06 * Math.sin(step + i * 1.7), 0.02, z]} r0={0.07} r1={0.06} color="#6f6d6a" />
    ))}
    <mesh position={[0, 0.88, 0]}>
      <boxGeometry args={[0.34, 0.12, 0.3]} />
      <meshStandardMaterial color="#b0382c" flatShading />
    </mesh>
  </group>
);
