// Kanchanaburi's hand-built parts: the Kwai bridge (legend-scale on the cover, real from 2486, broken 2488,
// mended after, swelling back for the festival), the steam train, the track and the station, Lat Ya's camp,
// the rafts of 2374, the white rows of Don Rak, the paper mill and the Skywalk.
import React from 'react';
import type {LandmarkProps} from '../../engine/types';
import {Ball} from '../suratthani/figures';
import {DECK, Elephant, KwaiBridge, Smoke, SteamLoco} from './figures';
import {BRIDGE_REAL, DIR, ACTORS as _A, bridgeK, bridgeOrigin, clamp01, builderAt, columnAt, elephantAt, litBoatAt, modernTrainAt, raftAt, raftsOn, ramp, trainU, workTrainAt} from './actors';
import {DON_RAK, KHWAE_NOI, LAT_YA, PAPER_MILL, PIER, RAIL, STATION, BRIDGE} from './places';
import {STORY} from './timeline';
void _A;

type P = [number, number];
const seg = (a: P, b: P) => ({len: Math.hypot(b[0] - a[0], b[1] - a[1]), rot: Math.atan2(b[0] - a[0], b[1] - a[1])});
const dToPath = (p: P, path: P[]) => {
  let best = 1e9;
  for (let i = 1; i < path.length; i++) {
    const [ax, az] = path[i - 1];
    const [bx, bz] = path[i];
    const dx = bx - ax;
    const dz = bz - az;
    const u = clamp01(((p[0] - ax) * dx + (p[1] - az) * dz) / (dx * dx + dz * dz));
    best = Math.min(best, Math.hypot(p[0] - ax - u * dx, p[1] - az - u * dz));
  }
  return best;
};

// ---------------------------------------------------------------- the track, in 2-unit pieces
const KHWAE_NOI_W2 = 1.1;
type Piece = {x: number; z: number; rot: number; d: number; deck: boolean};
const bridgeAt = (() => {
  // distance along RAIL of the Kwai bridge
  let acc = 0;
  let best = 1e9;
  let at = 0;
  for (let i = 1; i < RAIL.length; i++) {
    const [ax, az] = RAIL[i - 1];
    const [bx, bz] = RAIL[i];
    const len = Math.hypot(bx - ax, bz - az);
    const u = clamp01(((BRIDGE[0] - ax) * (bx - ax) + (BRIDGE[1] - az) * (bz - az)) / (len * len));
    const d = Math.hypot(BRIDGE[0] - ax - u * (bx - ax), BRIDGE[1] - az - u * (bz - az));
    if (d < best) {
      best = d;
      at = acc + u * len;
    }
    acc += len;
  }
  return at;
})();
const PIECES: Piece[] = (() => {
  const out: Piece[] = [];
  let acc = 0;
  for (let i = 1; i < RAIL.length; i++) {
    const a = RAIL[i - 1];
    const b = RAIL[i];
    const {len, rot} = seg(a, b);
    for (let s = 0; s < len; s += 2) {
      const u = (s + 1) / len;
      const x = a[0] + (b[0] - a[0]) * Math.min(1, u);
      const z = a[1] + (b[1] - a[1]) * Math.min(1, u);
      const d = Math.abs(acc + s + 1 - bridgeAt);
      // the bridge itself is drawn as the bridge; skip the pieces under it
      if (d < BRIDGE_REAL * 0.55) continue;
      out.push({x, z, rot, d, deck: dToPath([x, z], KHWAE_NOI) < KHWAE_NOI_W2});
    }
    acc += len;
  }
  return out;
})();

const Track: React.FC<{Y: number; lay: number; terrainH: LandmarkProps['terrainH']}> = ({Y, lay, terrainH}) => {
  if (Y < 1942.95) return null;
  const reach = lay * 140;
  return (
    <group>
      {PIECES.filter((p) => p.d <= reach).map((p, i) => {
        const y = Math.max(terrainH(p.x, p.z), 0.05);
        return (
          <group key={i} position={[p.x, p.deck ? y + 0.35 : y + 0.04, p.z]} rotation-y={p.rot}>
            {p.deck && (
              <mesh position={[0, -0.22, 0]}>
                <boxGeometry args={[0.5, 0.34, 2]} />
                <meshStandardMaterial color="#5b5a57" flatShading roughness={0.9} />
              </mesh>
            )}
            <mesh>
              <boxGeometry args={[0.42, 0.04, 2.05]} />
              <meshStandardMaterial color="#8d836f" flatShading roughness={1} />
            </mesh>
            <mesh position={[-0.13, 0.04, 0]}>
              <boxGeometry args={[0.035, 0.05, 2.05]} />
              <meshStandardMaterial color="#2b2b2e" flatShading roughness={0.5} />
            </mesh>
            <mesh position={[0.13, 0.04, 0]}>
              <boxGeometry args={[0.035, 0.05, 2.05]} />
              <meshStandardMaterial color="#2b2b2e" flatShading roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const Station: React.FC<{k: number; terrainH: LandmarkProps['terrainH']}> = ({k, terrainH}) => {
  if (k < 0.03) return null;
  const y = terrainH(STATION[0] + 0.9, STATION[1] - 0.4);
  return (
    <group position={[STATION[0] + 0.9, y, STATION[1] - 0.4]} scale={[1, k, 1]} rotation-y={0.78}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#d9ccae" flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[1.8, 0.14, 0.8]} />
        <meshStandardMaterial color="#8a2f24" flatShading roughness={0.8} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------- Lat Ya's camp (far place, 2328)
const Camp: React.FC<{Y: number; fight: number; moveP: number; terrainH: LandmarkProps['terrainH']}> = ({Y, fight, moveP, terrainH}) => {
  if (Y < 1784.9 || Y > 1831.2) return null;
  const s = 1 - ramp(moveP, 0.0, 0.6);
  if (s < 0.03) return null;
  const [cx, cz] = LAT_YA;
  const y0 = terrainH(cx, cz);
  const W = 3.6;
  const D = 1.8;
  const posts = [] as [number, number][];
  for (let i = 0; i <= 18; i++) {
    posts.push([-W / 2 + (W * i) / 18, -D / 2], [-W / 2 + (W * i) / 18, D / 2]);
  }
  for (let j = 1; j < 9; j++) posts.push([-W / 2, -D / 2 + (D * j) / 9], [W / 2, -D / 2 + (D * j) / 9]);
  return (
    <group position={[cx, y0, cz]} scale={[s, s, s]} rotation-y={0.5}>
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.18, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.38, 6]} />
          <meshStandardMaterial color="#6a4a2b" flatShading />
        </mesh>
      ))}
      {[[-1.1, 0.2], [0.2, -0.3], [1.2, 0.3], [-0.2, 0.4]].map(([x, z], i) => (
        <mesh key={'t' + i} position={[x, 0.18, z]} castShadow>
          <coneGeometry args={[0.32, 0.36, 5]} />
          <meshStandardMaterial color="#c9b98b" flatShading />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => {
        const age = (fight * 3 + i * 0.37) % 1;
        const bx = -W / 2 + 0.3 + i * 0.7;
        return <Ball key={'s' + i} p={[bx, 0.4 + age * 0.9, 0.9]} s={0.12 + age * 0.3} color="#cfcfca" basic opacity={fight > 0.05 && fight < 0.95 ? (1 - age) * 0.7 : 0} detail={1} />;
      })}
    </group>
  );
};

// ---------------------------------------------------------------- rafts of 2374
const Rafts: React.FC<{t: number; terrainH: LandmarkProps['terrainH']}> = ({t, terrainH}) => {
  if (!raftsOn(t)) return null;
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => {
        const r = raftAt(i, t);
        return (
          <group key={i} position={[r.x, Math.max(terrainH(r.x, r.z), 0) + 0.3, r.z]} rotation-y={r.rot} scale={1.7}>
            <mesh castShadow>
              <boxGeometry args={[0.8, 0.14, 1.5]} />
              <meshStandardMaterial color="#7d5a35" flatShading roughness={0.95} />
            </mesh>
            <mesh position={[0, 0.3, -0.1]} castShadow>
              <boxGeometry args={[0.5, 0.4, 0.7]} />
              <meshStandardMaterial color="#c4a76a" flatShading roughness={0.95} />
            </mesh>
            <mesh position={[0, 0.58, -0.1]} rotation-y={Math.PI / 4} castShadow>
              <coneGeometry args={[0.55, 0.3, 4]} />
              <meshStandardMaterial color="#8a6b3a" flatShading />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const Elephants: React.FC<{t: number; terrainH: LandmarkProps['terrainH']}> = ({t, terrainH}) => (
  <group>
    {[0, 1, 2].map((i) => {
      const e = elephantAt(i, t);
      if (!e) return null;
      return (
        <group key={i} position={[e.x, terrainH(e.x, e.z), e.z]} rotation-y={e.rot} scale={1.8}>
          <Elephant step={t * 4 + i} />
        </group>
      );
    })}
  </group>
);

const Column: React.FC<{t: number; terrainH: LandmarkProps['terrainH']}> = ({t, terrainH}) => (
  <group>
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const w = columnAt(i, t);
      if (!w) return null;
      const bob = 0.05 * Math.abs(Math.sin(t * 7 + i));
      return (
        <group key={i} position={[w.x, terrainH(w.x, w.z) + bob, w.z]} scale={1.5}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.22, 4, 8]} />
            <meshStandardMaterial color={i % 2 ? '#7a2f2a' : '#2f3b63'} flatShading />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshStandardMaterial color="#c8a27a" flatShading />
          </mesh>
        </group>
      );
    })}
  </group>
);

const Builders: React.FC<{t: number; terrainH: LandmarkProps['terrainH']}> = ({t, terrainH}) => (
  <group>
    {[0, 1, 2, 3, 4].map((i) => {
      const w = builderAt(i, t);
      if (!w) return null;
      return (
        <group key={i} position={[w.x, terrainH(w.x, w.z) + 0.04 * Math.abs(Math.sin(t * 6 + i)), w.z]} scale={1.8}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.22, 4, 8]} />
            <meshStandardMaterial color={i % 2 ? '#f4f1ea' : '#2f3b63'} flatShading />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshStandardMaterial color="#c8a27a" flatShading />
          </mesh>
        </group>
      );
    })}
  </group>
);

const Incense: React.FC<{p: number; t: number; terrainH: LandmarkProps['terrainH']}> = ({p, t, terrainH}) => {
  if (p < 0.05) return null;
  const y0 = terrainH(DON_RAK[0], DON_RAK[1]);
  return (
    <group position={[DON_RAK[0] + 0.5, y0 + 0.1, DON_RAK[1]]} scale={1.6}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const age = (t * 0.5 + i / 6) % 1;
        return <Ball key={i} p={[Math.sin(i * 2.1) * 0.9 + age * 0.15, age * 1.1, Math.cos(i * 1.7) * 0.7]} s={0.05 + age * 0.12} color="#e8e6e0" basic opacity={(1 - age) * 0.5 * p} detail={1} />;
      })}
    </group>
  );
};

const WorkTrain: React.FC<{t: number; terrainH: LandmarkProps['terrainH']}> = ({t, terrainH}) => {
  const w = workTrainAt(t);
  if (!w) return null;
  return (
    <group position={[w.x, terrainH(w.x, w.z) + 0.1, w.z]} rotation-y={w.rot - Math.PI / 2} scale={2.4}>
      <SteamLoco wagons={2} t={t} />
      <group position={[0.62, 0.3, 0]}>
        <Smoke t={t} speed={1} />
      </group>
    </group>
  );
};

const ModernTrain: React.FC<{t: number; terrainH: LandmarkProps['terrainH']}> = ({t, terrainH}) => {
  const w = modernTrainAt(t);
  if (!w) return null;
  return (
    <group position={[w.x, terrainH(w.x, w.z) + 0.1, w.z]} rotation-y={w.rot - Math.PI / 2} scale={3}>
      <mesh position={[0.3, 0.2, 0]} castShadow>
        <boxGeometry args={[0.9, 0.3, 0.26]} />
        <meshStandardMaterial color="#2f5a8a" flatShading />
      </mesh>
      <mesh position={[1.25, 0.2, 0]} castShadow>
        <boxGeometry args={[0.9, 0.3, 0.26]} />
        <meshStandardMaterial color="#e5d9b6" flatShading />
      </mesh>
    </group>
  );
};

const LitBoat: React.FC<{t: number; terrainH: LandmarkProps['terrainH']}> = ({t, terrainH}) => {
  const w = litBoatAt(t);
  if (!w) return null;
  return (
    <group position={[w.x, Math.max(terrainH(w.x, w.z), 0) + 0.25, w.z]} rotation-y={w.rot} scale={1.8}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.14, 1.6]} />
        <meshStandardMaterial color="#8a2f24" flatShading />
      </mesh>
      {[-0.6, -0.2, 0.2, 0.6].map((z, i) => (
        <mesh key={i} position={[0, 0.3, z]}>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshBasicMaterial color={i % 2 ? '#ffd36b' : '#ff8a5b'} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

// ---------------------------------------------------------------- Don Rak: the quiet rows
const Cemetery: React.FC<{p: number; Y: number; terrainH: LandmarkProps['terrainH']}> = ({p, Y, terrainH}) => {
  if (Y < 1945.55 || p < 0.03) return null;
  const y0 = terrainH(DON_RAK[0], DON_RAK[1]);
  return (
    <group position={[DON_RAK[0], y0, DON_RAK[1]]} rotation-y={0.2} scale={[1, p, 1]}>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[2.6, 0.03, 2.0]} />
        <meshStandardMaterial color="#8fb06a" flatShading roughness={1} />
      </mesh>
      {Array.from({length: 7}).flatMap((_, r) =>
        Array.from({length: 11}).map((__, c) => (
          <mesh key={r * 20 + c} position={[-1.2 + c * 0.24, 0.07, -0.85 + r * 0.28]}>
            <boxGeometry args={[0.1, 0.12, 0.04]} />
            <meshBasicMaterial color="#f1efe8" toneMapped={false} />
          </mesh>
        )),
      )}
    </group>
  );
};

const Mill: React.FC<{Y: number; terrainH: LandmarkProps['terrainH']}> = ({Y, terrainH}) => {
  const k = clamp01((Y - 1935) / 3);
  if (k < 0.03) return null;
  const y0 = terrainH(PAPER_MILL[0] + 1.4, PAPER_MILL[1] + 0.6);
  return (
    <group position={[PAPER_MILL[0] + 1.4, y0, PAPER_MILL[1] + 0.6]} scale={[1, k, 1]} rotation-y={0.78}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.2, 0.5, 0.7]} />
        <meshStandardMaterial color="#c9c1b0" flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0.45, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.7, 8]} />
        <meshStandardMaterial color="#8a5a43" flatShading />
      </mesh>
    </group>
  );
};

const Skywalk: React.FC<{Y: number; terrainH: LandmarkProps['terrainH']}> = ({Y, terrainH}) => {
  const k = clamp01((Y - 2022) / 0.4);
  if (k < 0.03) return null;
  return (
    <group position={[PIER[0] + 0.2, Math.max(terrainH(PIER[0], PIER[1]), 0) + 0.35, PIER[1] + 0.1]} rotation-y={0.9} scale={[k, 1, 1]}>
      <mesh>
        <boxGeometry args={[1.5, 0.05, 0.22]} />
        <meshStandardMaterial color="#9cc7d8" transparent opacity={0.65} roughness={0.2} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------- the bridge and the train
const Bridge: React.FC<LandmarkProps> = ({t, Y, beat, terrainH}) => {
  const k = bridgeK(t);
  const hero = t < 6.2;
  if (k < 0.02 || !(hero || Y > 1942.95)) return null;
  const L = BRIDGE_REAL * k;
  const [ox, oz] = bridgeOrigin(k);
  const ex = ox + DIR[0] * L;
  const ez = oz + DIR[1] * L;
  const y0 = Math.max(terrainH(ox, oz), terrainH(ex, ez), 0.2) + 0.02 * L;
  const grow = hero ? 1 : Math.min(1, beat('bridge') / 0.85);
  const mended = beat('mend') > 0.08;
  const broken = mended ? 0 : ramp(beat('break'), 0, 0.8);
  const u = trainU(t);
  const showTrain = u !== null && (hero ? t < 6.0 : !(Y >= 1944.9 && !mended));
  const phi = Math.atan2(-DIR[1], DIR[0]);
  return (
    <group position={[ox, y0, oz]} rotation-y={phi} scale={L}>
      <KwaiBridge grow={grow} repaired={mended} broken={broken} />
      {showTrain && u !== null && (
        <group position={[u, DECK + 0.007, 0]} scale={0.22}>
          <SteamLoco wagons={3} t={t} />
          <group position={[0.62, 0.3, 0]}>
            <Smoke t={t} speed={1} />
          </group>
        </group>
      )}
    </group>
  );
};

export const KanchanaburiLandmarks: React.FC<LandmarkProps> = (props) => {
  const {t, Y, beat, terrainH} = props;
  void STORY;
  return (
    <>
      <Bridge {...props} />
      <Track Y={Y} lay={beat('bridge')} terrainH={terrainH} />
      <Station k={Y > 1942.95 ? ramp(beat('bridge'), 0.3, 0.7) : 0} terrainH={terrainH} />
      <Camp Y={Y} fight={beat('fight')} moveP={beat('move')} terrainH={terrainH} />
      <Rafts t={t} terrainH={terrainH} />
      <Elephants t={t} terrainH={terrainH} />
      <WorkTrain t={t} terrainH={terrainH} />
      <Column t={t} terrainH={terrainH} />
      <Builders t={t} terrainH={terrainH} />
      <Incense p={ramp(beat('rest'), 0, 0.4)} t={t} terrainH={terrainH} />
      <ModernTrain t={t} terrainH={terrainH} />
      <LitBoat t={t} terrainH={terrainH} />
      <Cemetery p={ramp(beat('rest'), 0.0, 0.5)} Y={Y} terrainH={terrainH} />
      <Mill Y={Y} terrainH={terrainH} />
      <Skywalk Y={Y} terrainH={terrainH} />
    </>
  );
};
