// The Loei hero pieces, shared by the style frames (src/styleframes/loei.tsx) and the city (Landmarks.tsx).
// PhiTaKhon: a Phi Ta Khon mask (หน้ากากผีตาโขน) on a patchwork costume at legend scale. A face carved from the base of a
// coconut-palm frond (โคนก้านมะพร้าว), a sticky-rice steamer basket (หวดนึ่งข้าว) stitched on as the headpiece with its
// rim flared up, and a long carved nose (ThaiLex, en.wiki Phi Ta Khon, sanook: "หัวบาน หน้าแหลม"). Half made by hand at
// frame 0: the face is carved but bare, the basket half woven, no nose; the basket is woven up, the nose grows out, the
// paint sweeps down the face behind a brush, the eyes open, and the ghost starts to dance (sway + bells).
// Stupa: Phra That Si Song Rak (th.wiki: square base 10.47 m, 19.19 m tall, a lantern of glass at the top with little
// bells): a whitewashed Lan Xang stupa, square stepped base, an indented square body, a square lotus-bud spire.
import React from 'react';
import * as THREE from 'three';

export const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** a puff that bursts out and fades, self-lit so it reads at noon (dust, chips, wood shavings) */
export const Puff: React.FC<{u: number; seed: number; S: number; color: string; n?: number; up?: number}> = ({u, seed, S, color, n = 10, up = 0.5}) => {
  if (u < 0 || u > 1) return null;
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const a = hash(seed * 17 + i) * Math.PI * 2;
        const sp = S * (0.3 + hash(seed * 3 + i) * 0.5);
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * sp * u, (up + hash(seed * 7 + i) * 0.5) * sp * u, Math.sin(a) * sp * u]}
            scale={S * 0.08 * (1 - u) * (0.6 + hash(i + seed) * 0.6)}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={1 - u} />
          </mesh>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------ the Phi Ta Khon mask
const BARE = '#c9a879'; // the carved frond base, unpainted
const BAMBOO = ['#d8bf8a', '#bfa06a'];
const MASK_RED = '#c8202c';
const PATCH = ['#c8202c', '#f0b62a', '#2f7fc1', '#2e9b55', '#7d3c98', '#e8742a', '#f2ece0', '#1f6e8c', '#d94b7a', '#f0b62a', '#2e9b55', '#c8202c'];
const HUAD_PAINT = ['#2e9b55', '#f0b62a', MASK_RED, '#2f7fc1', '#f2ece0', MASK_RED, '#2e9b55', '#f0b62a'];

/** the timing of the mask's making, seconds from frame 0 (the cover) */
export const MASK = {
  rings: 8,
  /** basket ring k is woven at this time; the bottom half is woven before frame 0 */
  ringAt: (k: number) => (k < 4 ? -1 : 0.05 + ((k - 4) / 4) * 0.85),
  nose: (t: number) => smooth((t - 0.45) / 1.0),
  paint: (t: number) => smooth((t - 0.85) / 1.45),
  eyes: (t: number) => smooth((t - 1.25) / 0.35),
  dance: (t: number) => smooth((t - 2.3) / 0.5),
};

/** a long nose: n segments along an arc forward then up, k of it grown */
const Nose: React.FC<{S: number; k: number; color: string}> = ({S, k, color}) => {
  if (k < 0.02) return null;
  const n = 9;
  // out from the face, then curling up at the tip like a horn (the carved noses point forward and up)
  const pt = (u: number): THREE.Vector3 => new THREE.Vector3(0, S * (-0.03 * Math.sin(Math.PI * u) + 0.2 * u * u * u), S * 0.36 * u);
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const u0 = i / n;
        if (u0 > k) return null;
        const u1 = Math.min(k, (i + 1) / n);
        const a = pt(u0);
        const b = pt(u1);
        const d = b.clone().sub(a);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
        const r0 = S * (0.055 - 0.04 * u0);
        const r1 = S * (0.055 - 0.04 * u1);
        return (
          <mesh key={i} position={a.clone().add(b).multiplyScalar(0.5)} quaternion={q} castShadow>
            <cylinderGeometry args={[r1, r0, Math.max(0.001, d.length()), 10]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        );
      })}
      {k > 0.97 && (
        <mesh position={pt(1)} castShadow>
          <sphereGeometry args={[S * 0.018, 8, 6]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      )}
    </group>
  );
};

/**
 * The Phi Ta Khon at size S (ground to the basket's rim), facing +z. `t` is seconds into its making (frame 0 = the cover);
 * `done` forces the finished, painted mask (the callback). `dance` sways it.
 */
export const PhiTaKhon: React.FC<{t: number; S: number; done?: boolean}> = ({t, S, done = false}) => {
  const tt = done ? 99 : t;
  const nk = MASK.nose(tt);
  const pf = MASK.paint(tt);
  const ek = MASK.eyes(tt);
  const dk = MASK.dance(tt);
  // the paint front runs from the basket's rim (y 1.06 S) down to the chin (0.36 S)
  const front = S * (1.06 - pf * 0.82);
  const painted = (y: number) => pf > 0.001 && y >= front;
  const sway = dk * Math.sin(t * 7.5) * 0.06;
  const hop = dk * Math.abs(Math.sin(t * 7.5)) * S * 0.015;
  const faceY = S * 0.56;
  const bands = 10;
  return (
    <group position={[0, hop, 0]} rotation-z={sway}>
      {/* the patchwork costume, a cone of rag strips from the chin to the ground */}
      {PATCH.map((c, i) => (
        <mesh key={i} position={[0, S * 0.19, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[S * 0.16, S * 0.25, S * 0.38, 4, 1, true, (i / PATCH.length) * Math.PI * 2, (Math.PI * 2) / PATCH.length]} />
          <meshStandardMaterial color={c} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* the bells at the waist (กระดิ่ง), swinging when it dances */}
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const sw = dk * Math.sin(t * 15 + i) * 0.4;
        return (
          <group key={i} position={[Math.sin(a) * S * 0.215, S * 0.24, Math.cos(a) * S * 0.215]} rotation-x={sw}>
            <mesh position={[0, -S * 0.02, 0]}>
              <sphereGeometry args={[S * 0.022, 8, 6]} />
              <meshStandardMaterial color="#d9a521" metalness={0.6} roughness={0.35} />
            </mesh>
          </group>
        );
      })}
      {/* the face: the carved frond base, in latitude bands so the paint can run down it */}
      {Array.from({length: bands}, (_, i) => {
        const th0 = (i / bands) * Math.PI;
        const yMid = faceY + Math.cos(th0 + Math.PI / bands / 2) * S * 0.29;
        return (
          <mesh key={i} position={[0, faceY, 0]} scale={[S * 0.25, S * 0.29, S * 0.15]} castShadow>
            <sphereGeometry args={[1, 28, 3, 0, Math.PI * 2, th0, Math.PI / bands]} />
            <meshStandardMaterial color={painted(yMid) ? MASK_RED : BARE} roughness={0.75} />
          </mesh>
        );
      })}
      {/* the chin, carved pointed (หน้าแหลม) */}
      <mesh position={[0, S * 0.28, S * 0.03]} rotation-x={Math.PI} castShadow>
        <coneGeometry args={[S * 0.1, S * 0.14, 14]} />
        <meshStandardMaterial color={painted(S * 0.33) ? MASK_RED : BARE} roughness={0.75} />
      </mesh>
      {/* the paint's patterns: white scrolls on the cheeks and brow, black rims round the eyes, green dots */}
      {pf > 0.02 &&
        [
          [-0.15, 0.68, 0.1, '#f2ece0'], [0.15, 0.68, 0.1, '#f2ece0'], [-0.2, 0.5, 0.08, '#f2ece0'], [0.2, 0.5, 0.08, '#f2ece0'],
          [0, 0.76, 0.06, '#2e9b55'], [-0.09, 0.42, 0.1, '#1c1c1c'], [0.09, 0.42, 0.1, '#1c1c1c'],
        ].map(([x, y, z, c], i) =>
          painted(S * (y as number)) ? (
            <mesh key={i} position={[S * (x as number), S * (y as number), S * (z as number) + S * 0.04]} rotation-y={(x as number) * 2}>
              <torusGeometry args={[S * 0.04, S * 0.008, 6, 16, Math.PI * 1.5]} />
              <meshBasicMaterial color={c as string} toneMapped={false} />
            </mesh>
          ) : null,
        )}
      {/* the eyes: bulging, white with black pupils, opening as the paint passes */}
      {ek > 0.01 &&
        [-1, 1].map((s) => (
          <group key={s} position={[s * S * 0.1, S * 0.6, S * 0.125]} scale={ek}>
            <mesh>
              <sphereGeometry args={[S * 0.05, 14, 10]} />
              <meshStandardMaterial color="#f7f3ea" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, S * 0.04]}>
              <sphereGeometry args={[S * 0.024, 10, 8]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
            <mesh position={[0, S * 0.04, S * 0.02]} rotation-z={s * 0.3}>
              <torusGeometry args={[S * 0.06, S * 0.01, 6, 12, Math.PI]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
          </group>
        ))}
      {/* carved eye slits before the eyes open */}
      {ek < 0.5 &&
        [-1, 1].map((s) => (
          <mesh key={s} position={[s * S * 0.1, S * 0.6, S * 0.135]} scale={[1, 0.35, 0.3]}>
            <sphereGeometry args={[S * 0.045, 10, 8]} />
            <meshStandardMaterial color="#5a3d22" roughness={0.9} />
          </mesh>
        ))}
      {/* the grin: a dark mouth with white teeth */}
      <mesh position={[0, S * 0.45, S * 0.12]} scale={[S * 0.13, S * 0.035, S * 0.04]}>
        <sphereGeometry args={[1, 16, 8]} />
        <meshStandardMaterial color="#2a0f0f" roughness={0.9} />
      </mesh>
      {pf > 0.6 &&
        Array.from({length: 7}, (_, i) => (
          <mesh key={i} position={[(i - 3) * S * 0.032, S * 0.46, S * 0.155]}>
            <boxGeometry args={[S * 0.022, S * 0.03, S * 0.01]} />
            <meshBasicMaterial color="#f7f3ea" toneMapped={false} />
          </mesh>
        ))}
      {/* the long nose, growing out of the face */}
      <group position={[0, S * 0.57, S * 0.12]}>
        <Nose S={S} k={nk} color={painted(S * 0.6) ? MASK_RED : BARE} />
        {nk > 0.02 && nk < 0.98 && <Puff u={(t * 4) % 1} seed={Math.floor(t * 4)} S={S * 0.12} color="#e6c99a" n={6} />}
      </group>
      {/* the sticky-rice basket on top, its rim flared up: woven ring by ring (bottom half done at frame 0) */}
      {Array.from({length: MASK.rings}, (_, k) => {
        const at = MASK.ringAt(k);
        const g = done ? 1 : smooth((tt - at) / 0.18);
        if (g <= 0.01) return null;
        const y0 = S * (0.78 + k * 0.035);
        const r0 = S * (0.24 + k * 0.03);
        const r1 = S * (0.24 + (k + 1) * 0.03);
        const col = painted(y0) ? HUAD_PAINT[k] : BAMBOO[k % 2];
        return (
          <mesh key={k} position={[0, y0 + S * 0.0175, 0]} scale={[g, 1, g]} castShadow>
            <cylinderGeometry args={[r1, r0, S * 0.036, 30, 1, true]} />
            <meshStandardMaterial color={col} roughness={0.85} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* the basket's woven slats (vertical ribs) */}
      {Array.from({length: 16}, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const woven = done ? MASK.rings : Array.from({length: MASK.rings}, (_, k) => (tt >= MASK.ringAt(k) + 0.1 ? 1 : 0)).reduce((s: number, v) => s + v, 0);
        const h = S * 0.035 * Math.max(4, woven);
        const rm = S * (0.24 + 0.015 * Math.max(4, woven));
        return (
          <mesh key={i} position={[Math.sin(a) * rm, S * 0.78 + h / 2, Math.cos(a) * rm]} rotation-y={a} rotation-x={-0.4}>
            <boxGeometry args={[S * 0.01, h, S * 0.006]} />
            <meshStandardMaterial color="#8a6a3a" roughness={0.9} />
          </mesh>
        );
      })}
      {/* the strip being woven in, running round the open ring */}
      {!done &&
        tt < MASK.ringAt(MASK.rings - 1) + 0.2 &&
        (() => {
          const k = Array.from({length: MASK.rings}, (_, j) => (tt >= MASK.ringAt(j) ? 1 : 0)).reduce((s: number, v) => s + v, 0);
          const a = tt * 14;
          const r = S * (0.25 + k * 0.03);
          return (
            <mesh position={[Math.sin(a) * r, S * (0.8 + k * 0.035), Math.cos(a) * r]} rotation-y={a}>
              <boxGeometry args={[S * 0.16, S * 0.012, S * 0.012]} />
              <meshStandardMaterial color="#e8d3a0" roughness={0.7} />
            </mesh>
          );
        })()}
      {/* the brush, riding the paint front across the face */}
      {!done && pf > 0.01 && pf < 0.99 && (
        <group position={[Math.sin(t * 9) * S * 0.18, front, S * 0.24]} rotation-z={0.5 + Math.sin(t * 9) * 0.4}>
          <mesh position={[0, S * 0.08, 0]}>
            <cylinderGeometry args={[S * 0.008, S * 0.008, S * 0.16, 6]} />
            <meshStandardMaterial color="#6b4325" roughness={0.7} />
          </mesh>
          <mesh>
            <coneGeometry args={[S * 0.02, S * 0.05, 8]} />
            <meshBasicMaterial color={MASK_RED} toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ Phra That Si Song Rak
const LIME = '#efe9dc';
const LIME_SH = '#ddd5c2';
/** the stupa's tiers bottom to top: [half width, height] in units of its base width w */
const TIERS: [number, number][] = [
  [0.5, 0.06], [0.44, 0.06], [0.39, 0.07], // the stepped base
  [0.33, 0.28], // the square body
  [0.36, 0.04], [0.3, 0.05], // the cornice
  [0.26, 0.12], [0.22, 0.12], [0.17, 0.12], [0.12, 0.12], [0.075, 0.12], // the square lotus-bud spire
];
export const STUPA_H = TIERS.reduce((s, [, h]) => s + h, 0) + 0.18; // in base widths (~1.84, as 19.19 / 10.47)

/**
 * Phra That Si Song Rak, base width w, centred on its base. `k` 0..1 builds it tier by tier (the top one last, then the
 * gilded lantern); the bricks rise into place with a puff.
 */
export const Stupa: React.FC<{w: number; k: number; t?: number}> = ({w, k, t = 0}) => {
  if (k < 0.01) return null;
  const n = TIERS.length;
  let y = 0;
  return (
    <group>
      {TIERS.map(([hw, h], i) => {
        const y0 = y;
        y += h;
        const g = smooth(k * (n + 1) - i);
        if (g <= 0.01) return null;
        const drop = (1 - g) * w * 0.3;
        return (
          <group key={i} position={[0, y0 * w + drop, 0]}>
            <mesh position={[0, (h * w) / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[hw * 2 * w, h * w, hw * 2 * w]} />
              <meshStandardMaterial color={i % 2 ? LIME_SH : LIME} roughness={0.85} transparent={g < 1} opacity={g} />
            </mesh>
            {/* the indented corners of the body (ย่อมุม) */}
            {i === 3 &&
              [-1, 1].map((sx) =>
                [-1, 1].map((sz) => (
                  <mesh key={`${sx}${sz}`} position={[sx * hw * w, (h * w) / 2, sz * hw * w]} castShadow>
                    <boxGeometry args={[w * 0.08, h * w * 1.02, w * 0.08]} />
                    <meshStandardMaterial color={LIME_SH} roughness={0.85} />
                  </mesh>
                )),
              )}
            {/* a niche on each face of the body */}
            {i === 3 &&
              [0, 1, 2, 3].map((j) => (
                <mesh key={j} position={[Math.sin((j * Math.PI) / 2) * hw * w * 1.01, (h * w) / 2, Math.cos((j * Math.PI) / 2) * hw * w * 1.01]} rotation-y={(j * Math.PI) / 2}>
                  <boxGeometry args={[w * 0.18, h * w * 0.6, w * 0.02]} />
                  <meshStandardMaterial color="#b9ae96" roughness={0.9} />
                </mesh>
              ))}
            {g > 0.05 && g < 0.95 && <Puff u={g} seed={i} S={w * 0.4} color="#efe2c8" n={6} up={0.1} />}
          </group>
        );
      })}
      {/* the gilded lantern and the finial */}
      {k > 0.97 && (
        <group position={[0, y * w, 0]}>
          <mesh position={[0, w * 0.05, 0]}>
            <cylinderGeometry args={[w * 0.04, w * 0.06, w * 0.1, 8]} />
            <meshStandardMaterial color="#d9a521" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, w * 0.13, 0]}>
            <sphereGeometry args={[w * 0.04, 10, 8]} />
            <meshStandardMaterial color="#f6e7b0" metalness={0.3} roughness={0.15} emissive="#f6d77a" emissiveIntensity={0.25 + 0.1 * Math.sin(t * 4)} />
          </mesh>
          <mesh position={[0, w * 0.2, 0]}>
            <coneGeometry args={[w * 0.02, w * 0.1, 8]} />
            <meshStandardMaterial color="#d9a521" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
};
