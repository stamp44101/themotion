// Throwaway style frames for Ratchaburi's cover (30 Oct 2026; docs/briefs/ratchaburi.md). A: a giant
// dragon jar is thrown on a wheel on the Mae Klong's west bank. At frame 0 the red clay is already
// spinning up out of a lump; it bellies into the jar by 1.2 s, the cream dragon coils up round it
// from the foot to the shoulder by 2.2 s, and the glaze darkens as the kiln fire takes at its foot.
// A1 legend scale (~30 units tall) on the whole tile; A2 smaller (~18) at the river's bend with
// jar boats going downstream. The Mae Klong is the OSM centreline (ratchaburi_onep/) at 80 m/unit,
// origin 13.5440, 99.8200 (the bend between Wat Mahathat and the 2360 wall).
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {KORAT} from '../cities/korat';
import {Walker} from '../cities/nan/figures';
import {lathe} from '../engine/parts';
import {buildStory} from '../engine/story';
import type {CityConfig, LandmarkProps} from '../engine/types';

type P2 = [number, number];
const RIVER: P2[] = [
  [-6.9, -53.2], [-2.0, -44.8], [2.9, -33.6], [1.5, -29.2], [-0.6, -25.4], [-2.2, -22.5], [-2.9, -20.3],
  [-3.1, -17.8], [-2.7, -15.2], [-1.9, -13.0], [-0.9, -10.7], [-0.8, -7.9], [-1.9, -3.0], [-2.3, -0.8],
  [-1.5, 2.1], [0.5, 3.7], [13.5, 3.2], [23.4, 6.2], [30.4, 5.3], [33.6, 6.0], [36.5, 8.9], [38.2, 15.9],
  [40.0, 19.0], [42.0, 20.7], [53.7, 25.8], [58.1, 26.5], [60.3, 25.6], [61.9, 21.3], [61.8, 17.3],
];
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const CLAY = new THREE.Color('#b5583a');
const GLAZE = new THREE.Color('#4a2716');
const DRAGON = '#e9d7a8';

// the jar, height 1: a narrow foot, a full belly, the shoulder, a short neck and a rolled lip
const JAR: P2[] = [
  [0, 0], [0.27, 0], [0.31, 0.06], [0.4, 0.2], [0.47, 0.36], [0.49, 0.48], [0.47, 0.6], [0.41, 0.72],
  [0.33, 0.82], [0.27, 0.88], [0.26, 0.93], [0.3, 0.96], [0.29, 0.99], [0.24, 1], [0.22, 0.96], [0, 0.96],
];
// the lump of clay on the wheel, the same number of points
const LUMP: P2[] = JAR.map(([r, y], i) => (i === JAR.length - 1 || i === 0 ? [0, y * 0.35] : [Math.min(r, 0.3) * 1.05, y * 0.35]));

/** the jar thrown: k 0 = the lump, 1 = the jar */
const thrown = (k: number): P2[] => JAR.map(([r, y], i) => [LUMP[i][0] + (r - LUMP[i][0]) * k, LUMP[i][1] + (y - LUMP[i][1]) * k]);

/** the jar's radius at height y (for the dragon to lie on its skin) */
const radiusAt = (y: number) => {
  for (let i = 1; i < 11; i++) {
    const [r0, a] = JAR[i - 1];
    const [r1, b] = JAR[i];
    if (y >= a && y <= b) return r0 + ((y - a) / (b - a)) * (r1 - r0);
  }
  return 0.3;
};

/** the dragon: a turn and a quarter from the foot to the shoulder, a body of beads drawn in from
 *  its tail (thick in the middle, thin at the tail), a crest of spikes, and a head with horns, an
 *  open jaw and whiskers that leads the coil round the jar */
const Dragon: React.FC<{u: number}> = ({u}) => {
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const N = 80;
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      const y = 0.12 + s * 0.6 + 0.08 * Math.sin(s * 11);
      const a = s * Math.PI * 2.5;
      const r = radiusAt(y) + 0.03;
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  if (u <= 0.02) return null;
  const BEADS = 70;
  const shown = Math.floor(BEADS * u);
  const up = new THREE.Vector3(0, 1, 0);
  const head = curve.getPointAt(Math.min(1, u));
  const ahead = curve.getTangentAt(Math.min(1, u));
  const out = new THREE.Vector3(head.x, 0, head.z).normalize();
  const m = new THREE.Matrix4().makeBasis(out, new THREE.Vector3().crossVectors(ahead, out).normalize(), ahead);
  const q = new THREE.Quaternion().setFromRotationMatrix(m);
  return (
    <group>
      {Array.from({length: shown}, (_, i) => {
        const s = (i / BEADS) * u;
        const p = curve.getPointAt(s);
        // thickest a third of the way back from the head
        const f = i / Math.max(1, shown);
        const r = 0.025 + 0.04 * Math.sin(Math.PI * Math.min(1, f * 1.3));
        const n = new THREE.Vector3(p.x, 0, p.z).normalize();
        return (
          <group key={i} position={p}>
            <mesh castShadow>
              <sphereGeometry args={[r, 10, 8]} />
              <meshStandardMaterial color={i % 2 ? DRAGON : '#dcc38a'} roughness={0.45} />
            </mesh>
            {i % 3 === 0 && (
              <mesh position={[n.x * r * 0.6, r * 0.8, n.z * r * 0.6]} quaternion={new THREE.Quaternion().setFromUnitVectors(up, n.clone().add(up).normalize())}>
                <coneGeometry args={[r * 0.35, r * 1.4, 5]} />
                <meshStandardMaterial color="#d9822b" roughness={0.6} />
              </mesh>
            )}
          </group>
        );
      })}
      <group position={head} quaternion={q}>
        {/* the skull, the long snout, the open lower jaw */}
        <mesh position={[0.02, 0, 0.02]} castShadow>
          <boxGeometry args={[0.12, 0.13, 0.15]} />
          <meshStandardMaterial color={DRAGON} roughness={0.45} />
        </mesh>
        <mesh position={[0.03, 0.02, 0.13]} castShadow>
          <boxGeometry args={[0.08, 0.07, 0.12]} />
          <meshStandardMaterial color={DRAGON} roughness={0.45} />
        </mesh>
        <mesh position={[0.03, -0.05, 0.11]} rotation-x={0.45}>
          <boxGeometry args={[0.07, 0.025, 0.11]} />
          <meshStandardMaterial color="#c0503a" roughness={0.6} />
        </mesh>
        {[-1, 1].map((sd) => (
          <group key={sd}>
            <mesh position={[0.02, 0.09, sd * 0.04 - 0.02]} rotation-x={-0.9} rotation-z={sd * 0.3}>
              <coneGeometry args={[0.014, 0.14, 6]} />
              <meshStandardMaterial color="#d9822b" />
            </mesh>
            <mesh position={[0.07, 0.04, 0.0 + sd * 0.0]}>
              <sphereGeometry args={[0.018, 8, 6]} />
              <meshBasicMaterial color="#ffd23f" toneMapped={false} />
            </mesh>
            <mesh position={[0.03 + sd * 0.05, 0.0, 0.2]} rotation-z={sd * 1.1} rotation-x={0.4}>
              <cylinderGeometry args={[0.005, 0.003, 0.16, 4]} />
              <meshStandardMaterial color="#d9822b" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

/** throwing rings: dark grooves that wind up the clay while it spins, so the turning reads */
const Grooves: React.FC<{t: number; k: number}> = ({t, k}) => (
  <>
    {[0, 1, 2, 3, 4].map((i) => {
      const y = (0.12 + i * 0.17) * (0.35 + 0.65 * k);
      const a = t * 9 + i * 1.3;
      const r = radiusAt(Math.min(0.9, y / (0.35 + 0.65 * k))) * (0.6 + 0.4 * k) + 0.012;
      return (
        <mesh key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} rotation-y={-a}>
          <boxGeometry args={[0.02, 0.05, 0.16]} />
          <meshStandardMaterial color="#7e3824" roughness={0.9} />
        </mesh>
      );
    })}
  </>
);

/** the kiln fire round the jar's foot once the glaze takes */
const Fire: React.FC<{t: number; k: number}> = ({t, k}) => {
  if (k <= 0.02) return null;
  return (
    <group>
      {Array.from({length: 14}, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const h = (0.1 + 0.06 * Math.sin(t * 13 + i * 2.1)) * k;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.4, h / 2, Math.sin(a) * 0.4]}>
            <coneGeometry args={[0.05, h, 6]} />
            <meshBasicMaterial color={i % 2 ? '#ffb347' : '#ff7a2a'} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const Jar: React.FC<{t: number; H: number; potters: boolean}> = ({t, H, potters}) => {
  // already rising out of the lump at frame 0 (the cover is an event)
  const k = smooth(clamp01((t + 0.3) / 1.5));
  const dragon = smooth(clamp01((t - 0.7) / 1.5));
  const glaze = smooth(clamp01((t - 1.5) / 1.2));
  const geo = useMemo(() => lathe(thrown(k), 48), [k]);
  const color = useMemo(() => CLAY.clone().lerp(GLAZE, glaze * 0.85), [glaze]);
  return (
    <group scale={H}>
      {/* the wheel */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.55, 0.58, 0.04, 48]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.9} />
      </mesh>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.45 - glaze * 0.25} metalness={glaze * 0.1} />
      </mesh>
      {glaze < 0.9 && <Grooves t={t} k={k} />}
      <group rotation-y={Math.PI}>
        <Dragon u={dragon} />
      </group>
      <Fire t={t} k={glaze * (1 - smooth(clamp01((t - 3.2) / 1)))} />
      {potters &&
        Array.from({length: 10}, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(a) * 0.75, 0, Math.sin(a) * 0.75]} rotation-y={-a - Math.PI / 2} scale={0.022}>
              <Walker step={t * 0.6 + i * 0.37} i={i} />
            </group>
          );
        })}
    </group>
  );
};

/** a jar boat: a long hull loaded with rows of small jars, going downstream */
const JarBoat: React.FC<{p: P2; dir: number}> = ({p, dir}) => (
  <group position={[p[0], 0.1, p[1]]} rotation-y={dir} scale={2.2}>
    <mesh castShadow>
      <boxGeometry args={[0.55, 0.16, 1.8]} />
      <meshStandardMaterial color="#5b3b22" roughness={0.9} />
    </mesh>
    {Array.from({length: 8}, (_, i) => (
      <mesh key={i} position={[(i % 2) * 0.24 - 0.12, 0.18, -0.7 + Math.floor(i / 2) * 0.45]} castShadow>
        <sphereGeometry args={[0.13, 10, 8]} />
        <meshStandardMaterial color={i % 3 ? '#4a2716' : '#8a4a2a'} roughness={0.4} />
      </mesh>
    ))}
  </group>
);

/** point at distance s along the river from its upstream end, and the heading there */
const along = (s: number): [P2, number] => {
  let acc = 0;
  for (let i = 1; i < RIVER.length; i++) {
    const [ax, az] = RIVER[i - 1];
    const [bx, bz] = RIVER[i];
    const d = Math.hypot(bx - ax, bz - az);
    if (acc + d >= s) {
      const f = (s - acc) / d;
      return [[ax + (bx - ax) * f, az + (bz - az) * f], Math.atan2(bx - ax, bz - az)];
    }
    acc += d;
  }
  return [RIVER[RIVER.length - 1], 0];
};

const Boats: React.FC<{t: number}> = ({t}) => (
  <>
    {[0, 1, 2, 3].map((i) => {
      const [p, h] = along(36 + i * 6 + t * 1.6);
      return <JarBoat key={i} p={p} dir={h} />;
    })}
  </>
);

// the jar stands on the west bank south-west of the bend, in the open fields of the old town
const SITE: P2 = [-12, 12];
const SITE2: P2 = [-7, 9];

const AZ = 200;
const keys = (c: P2, h: number, d: [number, number, number], el: number) =>
  buildStory({
    duration: 60,
    before: 1300,
    after: 2026,
    camera: [],
    beats: [
      {
        id: 'open',
        t: [0, 8],
        year: [1933, 1933.4],
        camera: [
          [0, c[0], h, c[1], d[0], AZ, el, 30],
          [3, c[0], h * 1.05, c[1], d[1], AZ + 8, el + 2, 30],
          [8, c[0], h * 1.1, c[1], d[2], AZ + 18, el + 5, 30],
        ],
      },
    ],
  });

const base = (id: string, L: React.FC<LandmarkProps>, c: P2, h: number, d: [number, number, number], el: number, clear: number): CityConfig => {
  const STORY = keys(c, h, d, el);
  return {
    ...KORAT,
    id,
    look: 'shader',
    story: {
      captions: [],
      eras: [],
      yearAt: STORY.yearAt,
      beat: STORY.beat,
      beats: STORY.beats,
      intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'ราชบุรี', sub: 'เมืองโอ่งมังกร ริมแม่กลอง'},
      finale: KORAT.story.finale,
      approxBefore: 1500,
    },
    layout: {
      ...KORAT.layout,
      peaks: [],
      rivers: [{path: RIVER, width: 1.8}],
      bridges: [],
      noMoat: true,
      noWall: true,
      rail: undefined,
      trains: [],
      clearings: [[c[0], c[1], clear, -1e9]],
      sites: [],
      openGround: [],
      roads: [],
      towers: [],
      cameraKeys: STORY.cameraKeys,
    },
    Landmarks: L,
    callouts: [],
    actors: [],
    gloom: () => 0,
  };
};

const A1: React.FC<LandmarkProps> = ({t}) => (
  <group position={[SITE[0], 0, SITE[1]]}>
    <Jar t={t} H={30} potters />
  </group>
);
const A2: React.FC<LandmarkProps> = ({t}) => (
  <>
    <group position={[SITE2[0], 0, SITE2[1]]}>
      <Jar t={t} H={18} potters />
    </group>
    <Boats t={t} />
  </>
);

export const RATCHABURI_A1 = base('ratchaburi-a1', A1, SITE, 14, [310, 320, 350], 26, 20);
export const RATCHABURI_A2 = base('ratchaburi-a2', A2, SITE2, 8, [230, 240, 270], 28, 13);
