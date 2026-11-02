// Surat Thani's figures (style frames 2 Nov 2026; docs/briefs/suratthani.md): the coconut monkey
// (ลิงกัง, a pig-tailed macaque on a long rope), the coconut palm it climbs, a falling coconut and its
// splash, the handler on the ground, and the school rambutan tree for option B.
import React, {useMemo} from 'react';
import * as THREE from 'three';

type V = [number, number, number];
const UP = new THREE.Vector3(0, 1, 0);

export const Seg: React.FC<{a: V; b: V; r0: number; r1: number; color: string; flat?: number; basic?: boolean}> = ({a, b, r0, r1, color, flat = 1, basic}) => {
  const {pos, quat, len} = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const d = vb.clone().sub(va);
    const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
    return {pos: va.add(vb).multiplyScalar(0.5), quat: q, len: Math.max(1e-4, d.length())};
  }, [a[0], a[1], a[2], b[0], b[1], b[2]]);
  return (
    <group position={pos} quaternion={quat}>
      <mesh scale={[1, 1, flat]} castShadow>
        <cylinderGeometry args={[r1, r0, len, 8]} />
        {basic ? <meshBasicMaterial color={color} toneMapped={false} /> : <meshStandardMaterial color={color} flatShading roughness={0.85} />}
      </mesh>
    </group>
  );
};
export const Ball: React.FC<{p: V; s: V | number; color: string; basic?: boolean; opacity?: number; detail?: number}> = ({p, s, color, basic, opacity = 1, detail = 2}) => (
  <mesh position={p} scale={s} castShadow={!basic}>
    <icosahedronGeometry args={[1, detail]} />
    {basic ? (
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={opacity} depthWrite={false} />
    ) : (
      <meshStandardMaterial color={color} flatShading roughness={0.85} transparent={opacity < 1} opacity={opacity} />
    )}
  </mesh>
);

const clamp = (u: number) => Math.max(0, Math.min(1, u));

// ---------------------------------------------------------------- the coconut palm
/** The trunk's centreline: base at the origin, a gentle lean toward +x (over the water), crown at
 *  y = 1. `trunkAt(u)` gives the point at height fraction u, so the monkey can ride it. */
export const trunkAt = (u: number): V => [0.16 * u * u + 0.04 * Math.sin(u * 3), u, 0];
const TRUNK = new THREE.CatmullRomCurve3(Array.from({length: 9}, (_, i) => new THREE.Vector3(...trunkAt(i / 8))));
const FROND_COLORS = ['#3f7a2e', '#4d8a34', '#36692a'];
export const NUT = '#6f8f2a';
export const NUT_RIPE = '#8a5a2b';

/** A coconut palm 1 unit tall (scale it). `sway` swings the crown; `nuts` how many coconuts are
 *  still hanging under the crown (the one the monkey takes is drawn by the hero, not here). */
export const CoconutPalm: React.FC<{sway?: number; nuts?: number; seed?: number}> = ({sway = 0, nuts = 6, seed = 0}) => {
  const top = trunkAt(1);
  const fronds = 11;
  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[TRUNK, 24, 0.028, 7, false]} />
        <meshStandardMaterial color="#8a7a63" roughness={1} flatShading />
      </mesh>
      {/* ring scars up the trunk */}
      {Array.from({length: 7}, (_, i) => {
        const p = trunkAt(0.1 + i * 0.12);
        return (
          <mesh key={i} position={p} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.03, 0.006, 4, 10]} />
            <meshStandardMaterial color="#6e604d" />
          </mesh>
        );
      })}
      <group position={top} rotation-z={sway * 0.05}>
        {Array.from({length: fronds}, (_, i) => {
          const az = (i / fronds) * Math.PI * 2 + seed;
          const droop = 0.35 + 0.35 * ((i * 7) % 3) / 2;
          const L = 0.42;
          const pts: V[] = [0, 0.33, 0.66, 1].map((u) => [Math.cos(az) * L * u, 0.12 * u - droop * u * u * 0.5 + sway * 0.02 * u, Math.sin(az) * L * u]);
          const c = FROND_COLORS[i % 3];
          return (
            <group key={i}>
              {pts.slice(1).map((p, k) => (
                <Seg key={k} a={pts[k]} b={p} r0={0.012} r1={0.008} color={c} />
              ))}
              {/* leaflets: narrow blades either side of the rib, drooping, shorter toward the tip */}
              {pts.slice(1).flatMap((p, k) =>
                [-1, 1].map((side) => {
                  const m: V = [(p[0] + pts[k][0]) / 2, (p[1] + pts[k][1]) / 2 - 0.012, (p[2] + pts[k][2]) / 2];
                  return (
                    <group key={'l' + k + side} position={m} rotation-y={-az}>
                      <mesh position={[0, -0.01, side * 0.045]} rotation-x={side * 0.55} rotation-z={-0.2 - k * 0.25} scale={[0.14, 0.006, 0.075 - k * 0.015]} castShadow>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color={c} flatShading />
                      </mesh>
                    </group>
                  );
                }),
              )}
            </group>
          );
        })}
        {Array.from({length: nuts}, (_, i) => {
          const az = (i / Math.max(1, nuts)) * Math.PI * 2 + 0.4;
          return <Ball key={i} p={[Math.cos(az) * 0.045, -0.05 - (i % 2) * 0.03, Math.sin(az) * 0.045]} s={0.032} color={i % 3 ? NUT : NUT_RIPE} detail={1} />;
        })}
      </group>
    </group>
  );
};

// ---------------------------------------------------------------- the monkey
const FUR = '#8b6a43';
const FUR_D = '#5e4529';
const FACE = '#e2a58f';
const COLLAR = '#c8302a';

/** A pig-tailed macaque (ลิงกัง) about 1 unit long, clinging to a vertical trunk that runs up its
 *  front (+z is toward the trunk). `climb` is the climbing phase (radians): arms and legs reach
 *  alternately. `look` turns the head (radians); `twist` 0..1 raises the right hand to the crown
 *  for the coconut. Hands and feet meet the trunk at z ~0.32. */
export const ClimbingMonkey: React.FC<{climb: number; look?: number; twist?: number}> = ({climb, look = 0, twist = 0}) => {
  const s = Math.sin(climb);
  const reachL = 0.18 * s;
  const reachR = -0.18 * s;
  const rArmUp = twist;
  return (
    <group>
      {/* body: an upright barrel leaning into the trunk */}
      <Ball p={[0, 0.5, 0.05]} s={[0.24, 0.36, 0.2]} color={FUR} />
      <Ball p={[0, 0.25, 0.02]} s={[0.22, 0.2, 0.19]} color={FUR} />
      {/* the short pig tail, curled up behind */}
      <Seg a={[0, 0.12, -0.15]} b={[0, 0.2, -0.3]} r0={0.04} r1={0.03} color={FUR_D} />
      <Seg a={[0, 0.2, -0.3]} b={[0, 0.32, -0.26]} r0={0.03} r1={0.02} color={FUR_D} />
      {/* red collar and head */}
      <mesh position={[0, 0.84, 0.06]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.1, 0.025, 5, 12]} />
        <meshStandardMaterial color={COLLAR} />
      </mesh>
      <group position={[0, 0.98, 0.06]} rotation-y={look}>
        <Ball p={[0, 0, 0]} s={[0.17, 0.16, 0.16]} color={FUR} />
        {/* the dark cap of the pig-tailed macaque */}
        <Ball p={[0, 0.09, -0.02]} s={[0.12, 0.06, 0.12]} color={FUR_D} />
        {/* face turned out from the trunk, toward the viewer side (-z) and up */}
        <Ball p={[0, -0.02, -0.13]} s={[0.1, 0.09, 0.05]} color={FACE} />
        <Ball p={[-0.04, 0.01, -0.17]} s={0.017} color="#20160f" />
        <Ball p={[0.04, 0.01, -0.17]} s={0.017} color="#20160f" />
        {[-1, 1].map((k) => (
          <Ball key={k} p={[k * 0.16, 0.02, 0]} s={[0.03, 0.045, 0.03]} color={FACE} />
        ))}
      </group>
      {/* arms reaching up the trunk */}
      <Seg a={[-0.17, 0.7, 0.08]} b={[-0.14, 0.95 + reachL, 0.3]} r0={0.055} r1={0.045} color={FUR} />
      <Seg
        a={[0.17, 0.7, 0.08]}
        b={[0.14 + rArmUp * 0.12, 0.95 + reachR * (1 - rArmUp) + rArmUp * 0.45, 0.3 - rArmUp * 0.05]}
        r0={0.055}
        r1={0.045}
        color={FUR}
      />
      {/* legs gripping lower down */}
      <Seg a={[-0.15, 0.22, 0.05]} b={[-0.16, 0.1 - reachR * 0.8, 0.3]} r0={0.07} r1={0.05} color={FUR} />
      <Seg a={[0.15, 0.22, 0.05]} b={[0.16, 0.1 - reachL * 0.8, 0.3]} r0={0.07} r1={0.05} color={FUR} />
    </group>
  );
};

/** The handler on the ground holding the rope: a man in a white shirt and a pha khao ma, 1 unit
 *  tall. `pull` tilts him back on the rope. */
export const Handler: React.FC<{pull?: number; step?: number}> = ({pull = 0, step = 0}) => (
  <group rotation-z={-pull * 0.15}>
    <Seg a={[-0.06, 0, 0]} b={[-0.06, 0.45, 0]} r0={0.045} r1={0.05} color="#3b3a6b" />
    <Seg a={[0.06, 0, Math.sin(step) * 0.05]} b={[0.06, 0.45, 0]} r0={0.045} r1={0.05} color="#3b3a6b" />
    <Ball p={[0, 0.66, 0]} s={[0.14, 0.22, 0.1]} color="#f2efe6" />
    <Ball p={[0, 0.5, 0]} s={[0.15, 0.05, 0.11]} color="#c0392b" />
    <Ball p={[0, 0.95, 0]} s={0.09} color="#b07a55" />
    <Ball p={[0, 1.03, 0]} s={[0.12, 0.03, 0.12]} color="#d8c48c" />
    <Seg a={[0.12, 0.8, 0]} b={[0.32, 0.72, 0]} r0={0.035} r1={0.03} color="#b07a55" />
    <Seg a={[-0.12, 0.8, 0]} b={[0.28, 0.66, 0.04]} r0={0.035} r1={0.03} color="#b07a55" />
  </group>
);

/** Rings spreading on water from a splash, plus a column of white droplets. `u` 0..1 over the
 *  splash's life; radius 1 at the end (scale it). */
export const Splash: React.FC<{u: number}> = ({u}) => {
  if (u <= 0 || u >= 1) return null;
  const up = Math.sin(Math.min(1, u * 2.2) * Math.PI);
  return (
    <group>
      {[0, 0.2, 0.4].map((d, i) => {
        const v = clamp((u - d) / (1 - d));
        if (v <= 0.02) return null;
        return (
          <mesh key={i} position={[0, 0.02 + i * 0.002, 0]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[v * 0.95, v * 0.95 + 0.06, 32]} />
            <meshBasicMaterial color="#f4fbff" toneMapped={false} transparent opacity={(1 - v) * 0.9} depthWrite={false} />
          </mesh>
        );
      })}
      {Array.from({length: 9}, (_, i) => {
        const az = (i / 9) * Math.PI * 2;
        const r = 0.12 + u * 0.35;
        return <Ball key={i} p={[Math.cos(az) * r, up * (0.35 + (i % 3) * 0.12), Math.sin(az) * r]} s={0.05 * (1 - u) + 0.01} color="#ffffff" basic opacity={1 - u} detail={0} />;
      })}
      <Ball p={[0, up * 0.25, 0]} s={[0.12, 0.3 * up + 0.01, 0.12]} color="#e8f6ff" basic opacity={(1 - u) * 0.8} detail={1} />
    </group>
  );
};

// ---------------------------------------------------------------- the school rambutan (option B)
const RAMB_RED = '#d8262f';
const RAMB_GREEN = '#9bbf3a';
/** A rambutan tree 1 unit tall: a round dark crown on a short trunk, `grow` 0..1 rising out of
 *  the ground, `ripe` 0..1 flushing its clusters from green to red. */
export const RambutanTree: React.FC<{grow: number; ripe: number}> = ({grow, ripe}) => {
  const g = Math.max(0.03, grow);
  const col = new THREE.Color(RAMB_GREEN).lerp(new THREE.Color(RAMB_RED), clamp(ripe));
  const clusters: V[] = [
    [0.3, 0.55, 0.18], [-0.28, 0.6, 0.2], [0.05, 0.5, 0.34], [0.32, 0.72, -0.12], [-0.3, 0.75, -0.1],
    [0.0, 0.85, 0.28], [-0.12, 0.48, -0.3], [0.2, 0.9, 0.1], [-0.35, 0.62, 0.0], [0.36, 0.6, 0.02],
  ];
  return (
    <group scale={[g, g, g]}>
      <Seg a={[0, 0, 0]} b={[0, 0.45, 0]} r0={0.07} r1={0.05} color="#5b4630" />
      <Ball p={[0, 0.68, 0]} s={[0.42, 0.3, 0.42]} color="#2f5a26" />
      <Ball p={[0.2, 0.8, 0.1]} s={[0.25, 0.2, 0.25]} color="#3b6b2c" />
      <Ball p={[-0.18, 0.78, -0.12]} s={[0.25, 0.2, 0.25]} color="#335f28" />
      {clusters.map((p, i) => (
        <group key={i} position={p}>
          {[0, 1, 2].map((k) => (
            <Ball key={k} p={[(k - 1) * 0.05, -0.02 * k, 0]} s={0.045 * (0.6 + 0.4 * clamp(ripe * 1.5))} color={'#' + col.getHexString()} detail={0} />
          ))}
        </group>
      ))}
    </group>
  );
};
/** One giant rambutan, hairs out (spinterns), 1 unit across; `open` 0..1 peels the shell back. */
export const Rambutan: React.FC<{ripe: number; open?: number}> = ({ripe, open = 0}) => {
  const col = '#' + new THREE.Color(RAMB_GREEN).lerp(new THREE.Color(RAMB_RED), clamp(ripe)).getHexString();
  const hairs = useMemo(
    () =>
      Array.from({length: 70}, (_, i) => {
        const y = 1 - (2 * (i + 0.5)) / 70;
        const r = Math.sqrt(1 - y * y);
        const th = i * 2.399;
        return [Math.cos(th) * r, y, Math.sin(th) * r] as V;
      }),
    [],
  );
  return (
    <group>
      <Ball p={[0, 0.5, 0]} s={[0.5, 0.55, 0.5]} color={col} detail={2} />
      {open > 0.02 && <Ball p={[0, 0.55 + open * 0.3, 0]} s={[0.36, 0.42, 0.36]} color="#f4f1e6" detail={2} />}
      {hairs.map((h, i) => (
        <Seg key={i} a={[h[0] * 0.48, 0.5 + h[1] * 0.53, h[2] * 0.48]} b={[h[0] * 0.66, 0.5 + h[1] * 0.72 + 0.03, h[2] * 0.66]} r0={0.018} r1={0.004} color={i % 4 ? col : '#2f7a2a'} />
      ))}
    </group>
  );
};
