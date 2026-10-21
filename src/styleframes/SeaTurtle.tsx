// Lives here until src/cities/phuket/ exists (check_story treats every folder there as a city).
// A leatherback (เต่ามะเฟือง), Phuket's turtle and the cover hero (owner's pick), and its
// hatchlings in the payoff. docs/briefs/phuket.md §3b. Modelled from what makes a leatherback
// read at phone size, and not a plated sea turtle:
// - no plates: a long, leathery, teardrop carapace, blue-black and white-speckled, with seven
//   ridges running nose to tail and meeting in the pointed tail end (the มะเฟือง of its name);
// - huge fore-flippers, nearly as long as the shell, smooth and spotted, no claws;
// - a big round head with a notched upper jaw and the pink spot on its crown.
// The gait on sand is the real one: both fore-flippers dig in together, the body heaves forward
// and settles, then a pause. Local units: the turtle faces +z and is ~4 long.
import React from 'react';
import * as THREE from 'three';

const HIDE = '#3e4a5c';
const HIDE_LIGHT = '#5a6880';
const SPECK = '#eef1f3';
const BELLY = '#ddd6cc';

// one stroke of the crawl: 0 -> 1 is dig (fore-flippers forward and down), heave, settle, pause
export const crawlPhase = (t: number, rate = 0.55) => (t * rate) % 1;
// how far the body has moved within the current stroke (0..1), for lunging along a path
export const crawlAdvance = (t: number, rate = 0.55) => {
  const q = crawlPhase(t, rate);
  return Math.floor(t * rate) + (q < 0.15 ? 0 : q < 0.6 ? (q - 0.15) / 0.45 : 1);
};

// the carapace as a surface over (u along the body, 0 = nose end, 1 = tail point; v across, -1..1)
const Z0 = 1.55;
const LEN = 3.75;
const halfW = (u: number) => 1.18 * Math.sin(Math.PI * Math.min(1, 0.12 + u * 0.95)) ** 0.7 * (1 - 0.25 * u);
const height = (u: number) => 0.62 * Math.sin(Math.PI * Math.min(1, 0.1 + u * 0.92)) ** 0.8;
const shellAt = (u: number, v: number, lift = 0) => {
  const a = (v * Math.PI) / 2;
  const w = halfW(u);
  const h = height(u);
  // ridged cross-section: a dome with faint flats between the ridges
  const y = h * Math.cos(a) ** 0.75;
  return new THREE.Vector3(w * Math.sin(a), 0.42 + y + lift, Z0 - u * LEN);
};
const RIDGES = [0, -0.3, 0.3, -0.6, 0.6, -0.93, 0.93];
const geo = (() => {
  const nu = 36;
  const nv = 28;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= nu; i++)
    for (let j = 0; j <= nv; j++) {
      const p = shellAt(i / nu, -1 + (2 * j) / nv);
      pos.push(p.x, p.y, p.z);
    }
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const a = i * (nv + 1) + j;
      const b = a + nv + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  const shell = new THREE.BufferGeometry();
  shell.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  shell.setIndex(idx);
  shell.computeVertexNormals();
  const ridges = RIDGES.map((v) => {
    const pts = Array.from({length: 18}, (_, k) => shellAt(0.03 + (k / 17) * 0.97, v, 0.015));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, Math.abs(v) > 0.9 ? 0.05 : 0.04, 5, false);
  });
  // white speckles scattered over the hide, deterministic
  const specks = Array.from({length: 70}, (_, k) => {
    const u = 0.06 + ((k * 0.618) % 1) * 0.86;
    const v = -0.95 + ((k * 0.377 + 0.13) % 1) * 1.9;
    return shellAt(u, v, 0.008);
  });
  return {shell, ridges, specks, dot: new THREE.SphereGeometry(1, 6, 4)};
})();

// a flipper: a long tapered blade of overlapping flattened ellipsoids, widest near the root
const Flipper: React.FC<{len: number; width: number; mat: React.ReactNode; spots?: boolean}> = ({len, width, mat, spots}) => {
  const segs = 5;
  return (
    <group>
      {Array.from({length: segs}, (_, i) => {
        const u = (i + 0.5) / segs;
        const w = width * (1 - 0.7 * u) * (u < 0.2 ? 0.8 : 1);
        return (
          <mesh key={i} position={[u * len * 0.92, 0, -0.22 * u * u * len]} rotation-y={0.32 * u} scale={[(len / segs) * 0.9, 0.06, w / 2]} castShadow>
            <sphereGeometry args={[1, 12, 6]} />
            {mat}
          </mesh>
        );
      })}
      {spots &&
        Array.from({length: 9}, (_, k) => {
          const u = 0.12 + (k / 9) * 0.8;
          return (
            <mesh key={`s${k}`} geometry={geo.dot} position={[u * len * 0.92, 0.055, -0.22 * u * u * len + ((k % 3) - 1) * width * 0.18 * (1 - u)]} scale={[0.05, 0.01, 0.04]}>
              <meshBasicMaterial color={SPECK} />
            </mesh>
          );
        })}
    </group>
  );
};

export const SeaTurtle: React.FC<{t: number; rate?: number; swim?: boolean; detail?: boolean}> = ({t, rate = 0.55, swim = false, detail = true}) => {
  const q = crawlPhase(t, rate);
  // fore-flippers: forward (dig) then sweep back (push); in water a slow symmetric beat
  const fore = swim ? Math.sin(t * 2.2) * 0.6 : q < 0.15 ? -0.7 + (q / 0.15) * 0.1 : q < 0.6 ? -0.6 + ((q - 0.15) / 0.45) * 1.3 : 0.7 - ((q - 0.6) / 0.4) * 1.4;
  const heave = swim ? 0 : q > 0.15 && q < 0.6 ? Math.sin(((q - 0.15) / 0.45) * Math.PI) * 0.16 : 0;
  const breathe = Math.max(0, Math.sin(t * 0.9)) ** 3;
  const skin = <meshStandardMaterial color={HIDE_LIGHT} roughness={0.7} />;
  return (
    <group position={[0, heave, 0]}>
      {/* the pale underside */}
      <mesh position={[0, 0.4, -0.25]} scale={[1.05, 0.12, 1.85]}>
        <sphereGeometry args={[1, 14, 6]} />
        <meshStandardMaterial color={BELLY} roughness={0.9} />
      </mesh>
      {/* the leathery carapace, its seven ridges and white speckles */}
      <mesh geometry={geo.shell} castShadow receiveShadow>
        <meshStandardMaterial color={HIDE} roughness={0.45} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      {geo.ridges.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          <meshStandardMaterial color={HIDE_LIGHT} roughness={0.5} />
        </mesh>
      ))}
      {detail &&
        geo.specks.map((p, i) => (
          <mesh key={`k${i}`} geometry={geo.dot} position={p} scale={[0.035 + (i % 3) * 0.012, 0.012, 0.035]}>
            <meshBasicMaterial color={SPECK} />
          </mesh>
        ))}
      {/* fore-flippers: huge, nearly the shell's length */}
      {[-1, 1].map((sd) => (
        <group key={`f${sd}`} position={[sd * 0.9, 0.46, 0.9]} rotation-y={sd > 0 ? -fore : Math.PI + fore} rotation-z={sd * 0.1}>
          <Flipper len={2.9} width={0.75} mat={skin} spots={detail} />
        </group>
      ))}
      {/* hind-flippers: short, webbed towards the tail */}
      {[-1, 1].map((sd) => (
        <group key={`h${sd}`} position={[sd * 0.42, 0.42, -1.6]} rotation-y={sd > 0 ? -2.2 + 0.2 * Math.sin(t * 3 + sd) : -0.94 - 0.2 * Math.sin(t * 3 + sd)}>
          <Flipper len={0.85} width={0.5} mat={skin} />
        </group>
      ))}
      {/* head and neck, lifting to breathe */}
      <group position={[0, 0.62 + 0.12 * breathe, 1.95]} rotation-x={-0.2 * breathe}>
        <mesh position={[0, -0.04, -0.28]} scale={[0.36, 0.3, 0.4]} castShadow>
          <sphereGeometry args={[1, 10, 8]} />
          {skin}
        </mesh>
        <mesh scale={[0.42, 0.37, 0.5]} castShadow>
          <sphereGeometry args={[1, 14, 10]} />
          {skin}
        </mesh>
        {/* the notched upper jaw: two blunt cusps */}
        {[-1, 1].map((sd) => (
          <mesh key={`j${sd}`} position={[sd * 0.08, -0.14, 0.44]} rotation-x={Math.PI / 2 + 0.5} scale={[0.1, 0.16, 0.1]} castShadow>
            <coneGeometry args={[1, 1, 7]} />
            <meshStandardMaterial color={HIDE} roughness={0.5} />
          </mesh>
        ))}
        {/* the pink spot on the crown */}
        <mesh position={[0, 0.355, -0.02]} scale={[0.12, 0.02, 0.15]}>
          <sphereGeometry args={[1, 10, 6]} />
          <meshStandardMaterial color="#e3a3a6" roughness={0.6} />
        </mesh>
        {detail &&
          Array.from({length: 10}, (_, k) => {
            const a = k * 2.39;
            return (
              <mesh key={`hs${k}`} geometry={geo.dot} position={[0.3 * Math.sin(a), 0.22 + 0.05 * Math.cos(a * 1.7), -0.2 + 0.08 * (k % 4)]} scale={[0.03, 0.02, 0.03]}>
                <meshBasicMaterial color={SPECK} />
              </mesh>
            );
          })}
        {[-1, 1].map((sd) => (
          <group key={sd} position={[sd * 0.31, 0.08, 0.2]}>
            <mesh>
              <sphereGeometry args={[0.09, 10, 8]} />
              <meshStandardMaterial color="#0c0c0e" roughness={0.15} />
            </mesh>
            <mesh position={[sd * 0.03, 0.035, 0.06]}>
              <sphereGeometry args={[0.022, 6, 5]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

// the two rows of flipper marks a turtle leaves on sand, from (x0, z) to (x1, z) going +x
export const TurtleTrack: React.FC<{x0: number; x1: number; z: number; s: number; y?: number}> = ({x0, x1, z, s, y = 0.03}) => {
  const n = Math.max(0, Math.floor((x1 - x0) / (0.55 * s)));
  return (
    <group>
      <mesh position={[(x0 + x1) / 2, y - 0.005, z]} receiveShadow>
        <boxGeometry args={[Math.max(0.01, x1 - x0), 0.01, 1.3 * s]} />
        <meshStandardMaterial color="#d8c69c" roughness={1} />
      </mesh>
      {Array.from({length: n}, (_, i) =>
        [-1, 1].map((sd) => (
          <mesh key={`${i}${sd}`} position={[x0 + (i + 0.5) * 0.55 * s, y, z + sd * 0.95 * s]} rotation-y={sd * 0.6} scale={[0.32 * s, 0.01, 0.12 * s]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#b49a6c" roughness={1} />
          </mesh>
        )),
      )}
    </group>
  );
};

// a white ring of broken surf round something at the waterline
export const Surf: React.FC<{x: number; z: number; r: number; t: number; k: number}> = ({x, z, r, t, k}) =>
  k <= 0.02 ? null : (
    <group position={[x, 0.08, z]}>
      {Array.from({length: 18}, (_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const pulse = 1 + 0.12 * Math.sin(t * 3 + i);
        return (
          <mesh key={i} position={[Math.cos(a) * r * pulse, 0.05 * Math.sin(t * 4 + i), Math.sin(a) * r * pulse * 0.8]} scale={[0.6 + 0.3 * ((i * 7) % 3), 0.12, 0.5]}>
            <sphereGeometry args={[1, 8, 5]} />
            <meshStandardMaterial color="#f2f8fa" transparent opacity={0.85 * k} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
