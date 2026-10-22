// พญานาค of Ubon's candles, alive: the wax naga of a carved candle come to life. One smooth
// tapered body with overlapping scales (a normal map built in code, so light catches each
// scale's edge like carving), gilt with a clearcoat against the candle's matte wax, a continuous
// saw-edged fin down the spine, and an Isan head: long snout, brow ridges, slit eyes, a forked
// tongue and a crest of กนก flames swept back. The tail ends in a กนก plume. A small travelling
// wave runs head to tail and the head sways, so it reads as alive even when its path is still.
// Drawn along whatever path the caller gives (head first).
import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';

export type V3 = [number, number, number];

// coloured like the nagas of Thai painting: an emerald back, a gold stripe down each side and
// a gold belly of broad plates
const BACK = new THREE.Color('#2e8a4e');
const STRIPE = new THREE.Color('#f2b83c');
const BELLY = new THREE.Color('#f0c766');
const SCUTE = new THREE.Color('#b9801f');
const UP = new THREE.Vector3(0, 1, 0);

type Frame = {p: THREE.Vector3; t: THREE.Vector3; n: THREE.Vector3; b: THREE.Vector3};
// a frame at every point: tangent along the body, `n` toward the back (world up as far as the
// body allows), `b` to the side
const framesOf = (P: THREE.Vector3[]): Frame[] => {
  let prevN = new THREE.Vector3(0, 1, 0);
  return P.map((p, i) => {
    const a = P[Math.max(0, i - 1)];
    const c = P[Math.min(P.length - 1, i + 1)];
    const t = new THREE.Vector3().subVectors(a, c);
    if (t.lengthSq() < 1e-8) t.set(1, 0, 0);
    t.normalize();
    let n = UP.clone().sub(t.clone().multiplyScalar(UP.dot(t)));
    if (n.lengthSq() < 0.05) n = prevN.clone().sub(t.clone().multiplyScalar(prevN.dot(t)));
    n.normalize();
    prevN = n;
    const b = new THREE.Vector3().crossVectors(t, n).normalize();
    return {p, t, n, b};
  });
};

// ------------------------------------------------------------------ scales, built once
// A height field of overlapping shield scales in a repeating tile (4 x 4 scales, rows offset by
// half a scale, each row lying over the one behind it). From it: a normal map, a roughness map
// (scale edges rougher), and a colour map that darkens the edges like gilt rubbed off carving.
const TILE = 128;
const CELLS = 4;
const scaleMaps = (() => {
  if (typeof document === 'undefined') return null;
  const H = new Float32Array(TILE * TILE);
  for (let py = 0; py < TILE; py++)
    for (let px = 0; px < TILE; px++) {
      const x = (px / TILE) * CELLS;
      const y = (py / TILE) * CELLS;
      let h = 0;
      // later rows (larger y centre) lie on top; test them first
      for (let dr = 1; dr >= -1; dr--) {
        const r = Math.floor(y) + dr;
        const off = ((r % 2) + 2) % 2 ? 0.5 : 0;
        let hit = -1;
        for (let di = -1; di <= 1; di++) {
          const cx = Math.floor(x - off) + di + off + 0.5;
          const cy = r;
          const dx = (x - cx) / 0.62;
          const dy = (y - cy) / 0.95;
          if (y > cy + 0.05) continue; // the free edge of a scale points back down the body
          const d = dx * dx + dy * dy;
          if (d < 1) hit = Math.max(hit, Math.sqrt(1 - d) * (0.55 + 0.45 * Math.min(1, (cy - y) * 1.6)));
        }
        if (hit >= 0) {
          h = hit;
          break;
        }
      }
      H[py * TILE + px] = h;
    }
  const at = (x: number, y: number) => H[((y + TILE) % TILE) * TILE + ((x + TILE) % TILE)];
  const nrm = new Uint8Array(TILE * TILE * 4);
  const rgh = new Uint8Array(TILE * TILE * 4);
  const col = new Uint8Array(TILE * TILE * 4);
  for (let y = 0; y < TILE; y++)
    for (let x = 0; x < TILE; x++) {
      const k = (y * TILE + x) * 4;
      const sx = (at(x + 1, y) - at(x - 1, y)) * 2.2;
      const sy = (at(x, y + 1) - at(x, y - 1)) * 2.2;
      const v = new THREE.Vector3(-sx, -sy, 1).normalize();
      nrm[k] = (v.x * 0.5 + 0.5) * 255;
      nrm[k + 1] = (v.y * 0.5 + 0.5) * 255;
      nrm[k + 2] = (v.z * 0.5 + 0.5) * 255;
      nrm[k + 3] = 255;
      const h = at(x, y);
      const edge = 1 - Math.min(1, h * 2.4);
      const g = 255 * (0.28 + 0.5 * edge);
      rgh[k] = rgh[k + 1] = rgh[k + 2] = g;
      rgh[k + 3] = 255;
      const c = 255 * (1 - 0.28 * edge);
      col[k] = col[k + 1] = col[k + 2] = c;
      col[k + 3] = 255;
    }
  const tex = (data: Uint8Array, srgb: boolean) => {
    const t = new THREE.DataTexture(data, TILE, TILE, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  };
  return {normal: tex(nrm, false), rough: tex(rgh, false), color: tex(col, true)};
})();

// scales around the body, and how long one scale is in units of body radius
const AROUND = 20;

/** A tube whose radius tapers along the body, with UVs for the scales and vertex colours for
 * back, belly and bands. */
const bodyGeometry = (F: Frame[], radius: (u: number) => number, r0: number, radial = 24) => {
  const n = F.length;
  const pos = new Float32Array(n * (radial + 1) * 3);
  const col = new Float32Array(n * (radial + 1) * 3);
  const uv = new Float32Array(n * (radial + 1) * 2);
  const idx: number[] = [];
  let arc = 0;
  const c = new THREE.Color();
  const scaleLen = r0 * 0.3;
  for (let i = 0; i < n; i++) {
    if (i > 0) arc += F[i].p.distanceTo(F[i - 1].p);
    const u = i / (n - 1);
    const r = radius(u);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      // flatten the belly a little, like a real snake
      const rr = r * (ca < 0 ? 0.86 + 0.14 * (1 + ca) : 1) * (arc > r0 * 1.7 && arc < r0 * 2.7 ? 1.08 : 1);
      const k = (i * (radial + 1) + j) * 3;
      pos[k] = F[i].p.x + (F[i].n.x * ca + F[i].b.x * sa) * rr;
      pos[k + 1] = F[i].p.y + (F[i].n.y * ca + F[i].b.y * sa) * rr;
      pos[k + 2] = F[i].p.z + (F[i].n.z * ca + F[i].b.z * sa) * rr;
      const belly = THREE.MathUtils.smoothstep(-ca, 0.45, 0.7);
      const stripe = Math.max(0, 1 - Math.abs(-ca - 0.38) / 0.12);
      c.copy(BACK).lerp(BELLY, belly).lerp(STRIPE, stripe);
      // the gold collar just behind the head, a little proud of the neck
      const collar = arc > r0 * 1.7 && arc < r0 * 2.7;
      if (collar) c.copy(STRIPE);
      // the belly plates: a line across the belly every scute
      if (belly > 0.7 && (arc / (r0 * 0.38)) % 1 < 0.14) c.lerp(SCUTE, 0.7);
      col[k] = c.r;
      col[k + 1] = c.g;
      col[k + 2] = c.b;
      const q = (i * (radial + 1) + j) * 2;
      // scales stay a constant size along the body: as it tapers, fewer fit around it
      uv[q] = ((j / radial) * AROUND * (0.35 + 0.65 * (r / r0))) / CELLS;
      uv[q + 1] = arc / scaleLen / CELLS;
    }
  }
  for (let i = 0; i < n - 1; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

/** The spine fin: one ribbon from the neck to near the tail, its top edge a row of backswept
 * teeth, tallest at the neck. */
const finGeometry = (F: Frame[], radius: (u: number) => number) => {
  const n = F.length;
  const i0 = 2;
  const i1 = Math.floor(n * 0.93);
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = i0; i <= i1; i++) {
    const u = i / (n - 1);
    const rr = radius(u);
    const base = F[i].p.clone().addScaledVector(F[i].n, rr * 0.8);
    const tooth = i % 2 === 0;
    const h = rr * (tooth ? 0.95 : 0.35) * (1 - 0.5 * u);
    // a tooth leans back toward the tail
    const top = base.clone().addScaledVector(F[i].n, h).addScaledVector(F[i].t, -(tooth ? rr * 0.5 : 0));
    pos.push(base.x, base.y, base.z, top.x, top.y, top.z);
    if (i > i0) {
      const k = (i - i0) * 2;
      idx.push(k - 2, k, k - 1, k - 1, k, k + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

// ------------------------------------------------------------------ กนก flames
// A flame leaf in its own plane: rooted at the origin, sweeping up and back (-x), with three
// lobes on its leading edge and a curled tip, extruded thin.
const flameShape = (() => {
  const s = new THREE.Shape();
  s.moveTo(0.2, 0);
  // the leading edge rises and bends back into a curled tip
  s.quadraticCurveTo(0.42, 0.7, 0.18, 1.35);
  s.quadraticCurveTo(-0.05, 1.85, -0.5, 1.95);
  s.quadraticCurveTo(-0.62, 1.8, -0.4, 1.7);
  // the trailing edge comes down in three hooks
  s.quadraticCurveTo(-0.3, 1.5, -0.68, 1.38);
  s.quadraticCurveTo(-0.38, 1.25, -0.3, 1.05);
  s.quadraticCurveTo(-0.28, 0.9, -0.6, 0.82);
  s.quadraticCurveTo(-0.3, 0.66, -0.24, 0.5);
  s.quadraticCurveTo(-0.24, 0.38, -0.46, 0.3);
  s.quadraticCurveTo(-0.2, 0.2, -0.16, 0);
  s.lineTo(0.2, 0);
  return s;
})();
const FLAME = new THREE.ExtrudeGeometry(flameShape, {depth: 0.12, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 2, curveSegments: 10});
FLAME.translate(0, 0, -0.05);

const GILT = {color: '#eeb13c', metalness: 0.4, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.25} as const;
const DARK_GILT = {color: '#d39a2c', metalness: 0.4, roughness: 0.4} as const;
const RED = {color: '#c4301f', roughness: 0.5} as const;

// a กนก flame standing in the head's midplane (y-z), its tip curling back; `lean` tips it
// back about x (0 = upright, -1.57 = lying back along the head)
const Flame: React.FC<{
  at: V3;
  lean: number;
  splay?: number;
  s: number;
  trim?: boolean;
  dark?: boolean;
  glow?: number;
}> = ({at, lean, splay = 0, s, trim, dark, glow = 0}) => (
  <group position={at} rotation-y={splay}>
    <group rotation-x={lean} scale={s}>
      <mesh geometry={FLAME} rotation-y={-Math.PI / 2} castShadow>
        {dark ? <meshStandardMaterial {...DARK_GILT} /> : <meshPhysicalMaterial {...GILT} emissive="#ffb347" emissiveIntensity={glow} />}
      </mesh>
      {/* the red inlay of painted nagas, showing on both faces */}
      {trim && (
        <mesh geometry={FLAME} rotation-y={-Math.PI / 2} position={[0, 0.14, 0.04]} scale={[0.7, 0.7, 1.9]}>
          <meshStandardMaterial {...RED} />
        </mesh>
      )}
    </group>
  </group>
);

// The head, modelled pointing +z with its crown up (+y); unit = body radius at the neck.
// After the Isan gate nagas (a photogrammetry scan the owner sent): a short, compact head about
// as wide as the neck, the mouth nearly closed, round scrolls at the cheeks, and above it one
// solid crown flame tapering up like a spire, about twice the head's height, layered with กนก
// up both edges. No whiskers.
const Head: React.FC<{jaw: number; night: number; t: number}> = ({jaw, night, t}) => {
  const ph = (t % 1.7) / 1.7;
  const tongue = ph < 0.2 ? Math.sin((ph / 0.2) * Math.PI) : 0;
  const quiver = Math.sin(t * 3) * 0.02;
  return (
    <group>
      {/* crown, brow and a short snout */}
      <mesh position={[0, 0.2, 0.3]} scale={[0.82, 0.68, 0.85]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshPhysicalMaterial {...GILT} />
      </mesh>
      <mesh position={[0, 0.08, 1.0]} scale={[0.58, 0.45, 0.72]} castShadow>
        <sphereGeometry args={[1, 20, 14]} />
        <meshPhysicalMaterial {...GILT} />
      </mesh>
      <mesh position={[0, 0.05, 1.5]} scale={[0.4, 0.32, 0.42]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshPhysicalMaterial {...GILT} />
      </mesh>
      {/* the nose tip curling up */}
      <Flame at={[0, 0.25, 1.75]} lean={-0.3} s={0.32} />
      {/* lower jaw, nearly closed; the tongue flicks out now and then */}
      <group position={[0, -0.22, 0.4]} rotation-x={0.06 + jaw * 0.22}>
        <mesh position={[0, -0.06, 0.75]} scale={[0.48, 0.17, 0.85]} castShadow>
          <sphereGeometry args={[1, 16, 10]} />
          <meshPhysicalMaterial {...GILT} />
        </mesh>
        <mesh position={[0, 0.04, 0.8]} scale={[0.38, 0.06, 0.7]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial {...RED} />
        </mesh>
        {tongue > 0.02 && (
          <group position={[0, 0.04, 1.1 + tongue * 0.5]}>
            <mesh rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.035, 0.045, 0.6, 6]} />
              <meshStandardMaterial color="#b3261e" />
            </mesh>
            {[-1, 1].map((k) => (
              <mesh key={k} position={[k * 0.045, 0, 0.38]} rotation-x={Math.PI / 2} rotation-z={k * 0.5}>
                <cylinderGeometry args={[0.01, 0.028, 0.2, 5]} />
                <meshStandardMaterial color="#b3261e" />
              </mesh>
            ))}
          </group>
        )}
      </group>
      {[-1, 1].map((k) => (
        <group key={k}>
          {/* fangs */}
          <mesh position={[k * 0.25, -0.26, 1.45]} rotation-x={Math.PI - 0.2}>
            <coneGeometry args={[0.055, 0.3, 6]} />
            <meshStandardMaterial color="#fffaf0" />
          </mesh>
          {/* almond eyes under the brow */}
          <mesh position={[k * 0.5, 0.42, 0.85]} rotation-y={k * 0.4} scale={[0.7, 0.6, 1.1]}>
            <sphereGeometry args={[0.2, 16, 12]} />
            <meshBasicMaterial color="#e8341c" toneMapped={false} />
          </mesh>
          <mesh position={[k * 0.62, 0.42, 0.9]} rotation-y={k * 1.0}>
            <boxGeometry args={[0.035, 0.18, 0.04]} />
            <meshBasicMaterial color="#1a0d05" />
          </mesh>
          {/* the round scroll on each cheek */}
          <group position={[k * 0.8, 0.05, 0.35]} rotation-y={(k * Math.PI) / 2}>
            <mesh castShadow>
              <torusGeometry args={[0.26, 0.09, 8, 20, Math.PI * 1.7]} />
              <meshPhysicalMaterial {...GILT} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.12, 10, 8]} />
              <meshStandardMaterial {...DARK_GILT} />
            </mesh>
          </group>
        </group>
      ))}
      {/* the crown: one solid flame mass tapering up like a spire, as wide as the head at its
          foot and about twice its height, leaning a little back; กนก flames stand out from it in
          rings, smaller toward the curled tip */}
      <group position={[0, 0.6, 0.2]} rotation-x={-0.2 + quiver}>
        <mesh position={[0, 1.1, 0]} scale={[0.62, 1, 0.8]} castShadow>
          <coneGeometry args={[1.0, 2.2, 10]} />
          <meshPhysicalMaterial {...GILT} emissive="#ffb347" emissiveIntensity={0.06 + night * 0.5} />
        </mesh>
        {[0, 1, 2, 3].map((i) => {
          const y = 0.2 + i * 0.48;
          const w = 1.0 * (1 - y / 2.2);
          const n = 7 - i;
          return Array.from({length: n}, (_, j) => {
            const a = ((j + (i % 2) * 0.5) / n) * Math.PI * 2;
            return (
              <Flame
                key={`${i}-${j}`}
                at={[Math.sin(a) * w * 0.55, y, Math.cos(a) * w * 0.72]}
                lean={0}
                splay={a}
                s={0.55 - i * 0.08}
                dark={(i + j) % 2 === 1}
              />
            );
          });
        })}
        <Flame at={[0, 2.05, 0]} lean={-0.2} s={0.45} />
      </group>
    </group>
  );
};

/**
 * The naga along `pts` (head first). `r` is the body radius at the neck; the tail tapers to
 * a กนก plume. `jaw` 0..1 opens the mouth; `t` (seconds) drives the wave, sway and tongue.
 */
export const Naga: React.FC<{pts: V3[]; r: number; jaw?: number; night?: number; fins?: boolean; t?: number}> = ({
  pts,
  r,
  jaw = 0.3,
  night = 0,
  fins = false,
  t = 0,
}) => {
  const radius = (u: number) => r * (u < 0.04 ? 0.82 + u * 4.5 : Math.pow(1 - u, 0.7) * 1.05 + 0.04);
  // a small wave travels from head to tail, sideways; it grows in from the neck so the head
  // stays where the path puts it
  const F = useMemo(() => {
    const P0 = pts.map((p) => new THREE.Vector3(...p));
    const F0 = framesOf(P0);
    let arc = 0;
    const P = P0.map((p, i) => {
      if (i > 0) arc += p.distanceTo(P0[i - 1]);
      const u = i / Math.max(1, P0.length - 1);
      const w = Math.sin(arc / (r * 3.2) - t * 4.2) * r * 0.22 * THREE.MathUtils.smoothstep(u, 0.02, 0.15);
      return p.clone().addScaledVector(F0[i].b, w);
    });
    return framesOf(P);
  }, [pts, r, t]);
  const geo = useMemo(() => bodyGeometry(F, radius, r), [F]);
  const fin = useMemo(() => (fins ? finGeometry(F, radius) : null), [F, fins]);
  useEffect(() => () => geo.dispose(), [geo]);
  useEffect(() => () => fin?.dispose(), [fin]);
  const h = F[0];
  const m = new THREE.Matrix4().makeBasis(h.b.clone().negate(), h.n, h.t);
  const q = new THREE.Quaternion().setFromRotationMatrix(m);
  const sway = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(t * 1.1) * 0.06, Math.sin(t * 1.3) * 0.12, 0));
  q.multiply(sway);
  // the tail plume: a flame at the last point, pointing back along the body
  const tail = F[F.length - 1];
  const tq = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(tail.n, tail.t.clone().negate(), tail.b));
  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshPhysicalMaterial
          vertexColors
          map={scaleMaps?.color ?? null}
          normalMap={scaleMaps?.normal ?? null}
          normalScale={new THREE.Vector2(0.9, 0.9)}
          roughnessMap={scaleMaps?.rough ?? null}
          metalness={0.15}
          roughness={1}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
          emissive="#5a3200"
          emissiveIntensity={night * 0.5}
        />
      </mesh>
      {fin && (
        <mesh geometry={fin} castShadow>
          <meshPhysicalMaterial {...GILT} side={THREE.DoubleSide} />
        </mesh>
      )}
      <group position={tail.p} quaternion={tq} scale={r * 1.5}>
        <mesh geometry={FLAME} castShadow>
          <meshPhysicalMaterial {...GILT} />
        </mesh>
      </group>
      <group position={h.p} quaternion={q} scale={r * 1.3}>
        <Head jaw={jaw} night={night} t={t} />
      </group>
    </group>
  );
};
