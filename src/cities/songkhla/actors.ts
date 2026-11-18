// Pure position math for Songkhla's moving things (src/engine/actors.ts); Landmarks.tsx draws from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp} from '../../lib';
import {LANDING, MERMAID, PILLAR, RAIL, SINGORA, STAGE, PUPPET_BACK, inWater} from './places';
import {STORY} from './timeline';

type P = [number, number];
export const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const beatK = (id: string, t: number) => {
  const [a, b] = STORY.at(id);
  return (t - a) / (b - a);
};
export const along = (pts: P[], d: number) => {
  let r = Math.max(0, d);
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1];
    const [bx, bz] = pts[i];
    const len = Math.hypot(bx - ax, bz - az);
    if (r <= len) return {x: lerp(ax, bx, r / len), z: lerp(az, bz, r / len), rot: Math.atan2(bx - ax, bz - az)};
    r -= len;
  }
  const [ax, az] = pts[pts.length - 2];
  const [bx, bz] = pts[pts.length - 1];
  return {x: bx, z: bz, rot: Math.atan2(bx - ax, bz - az)};
};
export const lengthOf = (pts: P[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/** the hide is cut free by this second (Hero.tsx CUT_END) */
const CUT_END = 2.0;

// ------------------------------------------------------------------ the cover: Ai Teng on the spit
export const HERO_AT: P = [4, -2];
export const HERO_H = 50;
/** the cover's puppet stands through the cover and sinks away into its trunk as the camera leaves (gone by 4.2 s) */
export const heroK = (t: number) => 1 - smooth((t - 3.2) / 1.0);

// ------------------------------------------------------------------ port: Dato Mogol's junks come in through the channel
/** from the open gulf, round the spit's tip, into the channel's west side under Khao Daeng */
const PORT_PATH: P[] = [[-2, -49], [-6, -45], [-11, -40.5], [-14.2, -36.6], [-15.6, -33.6], [LANDING[0] + 0.4, LANDING[1] - 0.4]];
const PORT_L = lengthOf(PORT_PATH);
export const PORT_JUNKS = 4;
export const portJunkAt = (i: number, t: number) => {
  const k = beatK('port', t);
  if (k < -0.1 || t > STORY.at('siege')[0] + 0.5) return null;
  const d = lerp(PORT_L * 0.25, PORT_L, smooth((k + 0.05) / 0.75)) - i * 2.8;
  return along(PORT_PATH, Math.max(0, d));
};
/** Singora's huts at the hill's north foot, each on land (checked against the water), built through the port beat */
export const SINGORA_HUTS: P[] = (() => {
  const out: P[] = [];
  for (let i = 0; out.length < 26 && i < 400; i++) {
    const a = (i * 2.399) % (Math.PI * 2);
    const r = 0.6 + ((i * 0.37) % 1) * 3.6;
    const x = SINGORA[0] - 1.8 + Math.cos(a) * r * 1.3;
    const z = SINGORA[1] + 1.8 + Math.sin(a) * r * 0.8;
    if (inWater(x, z) || inWater(x + 0.8, z) || inWater(x - 0.8, z) || inWater(x, z + 0.8) || inWater(x, z - 0.8)) continue;
    if (out.some(([px, pz]) => Math.hypot(px - x, pz - z) < 1.1)) continue;
    out.push([x, z]);
  }
  return out;
})();
/** a hut goes up during the port beat (j staggered); after the siege it is gone (burnt) */
export const hutK = (j: number, t: number, Y: number) => {
  if (Y > 1680.5) return 0;
  const up = Y > 1679 ? 1 : smooth((beatK('port', t) - 0.15 - (j / SINGORA_HUTS.length) * 0.55) / 0.12);
  const burn = smooth((beatK('siege', t) - 0.55 - (j % 5) * 0.04) / 0.18);
  return up * (1 - burn);
};
/** the forts and the town wall rise late in the port beat (Sulaiman's works) */
export const fortK = (j: number, t: number, Y: number) => (Y > 1679 ? 1 : smooth((beatK('port', t) - 0.5 - j * 0.04) / 0.2));
/** the siege's fire on the forts and the town: 0 before, peaks, then smoke dies */
export const fireK = (t: number) => {
  const k = beatK('siege', t);
  return k < 0.45 || k > 1.15 ? 0 : Math.sin(Math.PI * clamp01((k - 0.45) / 0.7));
};
/** the wall and the forts fall to ruins through the second half of the siege; ruins after */
export const ruinK = (t: number, Y: number) => (Y > 1681 ? 1 : smooth((beatK('siege', t) - 0.55) / 0.35));

// ------------------------------------------------------------------ siege: the army from the south, the fleet in the gulf
/** Ayutthaya's army marches up the west shore toward the town; the defenders hold before the wall, then fall back */
export const attackers = (t: number): {at: P; face: P} | null => {
  const k = beatK('siege', t);
  if (k < -0.05 || k > 1.0) return null;
  const u = smooth((k + 0.05) / 0.55);
  return {at: [lerp(-37.0, -31.0, u), lerp(-25.4, -26.8, u)], face: [-24.0, -28.0]};
};
export const defenders = (t: number): {at: P; face: P} | null => {
  const k = beatK('siege', t);
  if (k < -0.05 || k > 0.72) return null;
  const back = smooth((k - 0.5) / 0.2);
  return {at: [lerp(-28.2, -25.2, back), lerp(-27.4, -28.4, back)], face: [-36.0, -26.0]};
};
const FLEET_PATH: P[] = [[8, -49], [0, -45.5], [-7, -42], [-11, -39.5], [-13.6, -37.6]];
const FLEET_L = lengthOf(FLEET_PATH);
export const FLEET = 4;
export const fleetAt = (i: number, t: number) => {
  const k = beatK('siege', t);
  if (k < -0.05 || k > 1.05) return null;
  const d = smooth((k + 0.05) / 0.6) * FLEET_L * 0.9 - i * 2.6;
  return along(FLEET_PATH, Math.max(0, d));
};

// ------------------------------------------------------------------ Bo Yang: stone across the lake, the wall, the pillar
const FERRY_PATH: P[] = [[-9.4, -4.8], [-7.0, -4.4], [-5.4, -3.9], [-4.3, -3.4]];
const FERRY_L = lengthOf(FERRY_PATH);
export const FERRIES = 3;
export const ferryAt = (i: number, t: number) => {
  const k = beatK('boyang', t);
  if (k < -0.05 || k > 1.05) return null;
  const u = (((k * 1.6 + i / FERRIES) % 1) + 1) % 1;
  const back = Math.floor(k * 1.6 + i / FERRIES) % 2 === 1;
  const p = along(FERRY_PATH, (back ? 1 - u : u) * FERRY_L);
  return {...p, rot: back ? p.rot + Math.PI : p.rot};
};
/** the pillar's procession from the lake landing up the street to the centre, after the wall is up */
const PILLAR_PATH: P[] = [[-3.4, -3.6], [-2.2, -3.0], [-1.3, -1.6], [-0.6, -0.6], [PILLAR[0] - 0.2, PILLAR[1] - 0.2]];
const PILLAR_L = lengthOf(PILLAR_PATH);
export const pillarLogAt = (t: number) => {
  const k = beatK('boyang', t);
  if (k < 0.4 || k > 1.02) return null;
  return along(PILLAR_PATH, smooth((k - 0.4) / 0.45) * PILLAR_L);
};
export const BEARERS = 6;
export const MARCHERS = 10;
export const marcherAt = (i: number, t: number) => {
  const k = beatK('boyang', t);
  if (k < 0.4 || k > 1.02) return null;
  const d = smooth((k - 0.4) / 0.45) * PILLAR_L - 0.8 - i * 0.38;
  if (d < -0.3) return null;
  const p = along(PILLAR_PATH, Math.max(0, d));
  return {x: p.x + (i % 2 ? 0.22 : -0.22), z: p.z, rot: p.rot};
};
/** the pillar shrine stands from the end of the procession */
export const shrineK = (t: number, Y: number) => (Y > 1843.5 ? 1 : smooth((beatK('boyang', t) - 0.86) / 0.1));

// ------------------------------------------------------------------ trade: junks at the lake piers, porters
export const PIERS: P[] = [[-4.2, -4.6], [-3.6, -1.8], [-3.0, 1.0], [-2.3, 3.6]];
export const pierK = (Y: number) => smooth((Y - 1846) / 6);
export const tradeJunkAt = (i: number, t: number) => {
  const k = beatK('trade', t);
  if (k < -0.1 || k > 1.1) return null;
  const [px, pz] = PIERS[i % PIERS.length];
  // the first two sail in from the channel and moor; the others lie at their piers
  const inK = i < 2 ? smooth((k + 0.1) / 0.5) : 1;
  return {x: lerp(px - 9, px - 1.5, inK), z: lerp(pz - 4 - i * 2, pz, inK), rot: lerp(Math.PI * 0.85, Math.PI / 2, inK)};
};
export const PORTERS = 10;
export const porterAt = (i: number, t: number) => {
  const k = beatK('trade', t);
  if (k < -0.05 || k > 1.05) return null;
  const [px, pz] = PIERS[i % PIERS.length];
  const u = (((t * 0.45 + i * 0.37) % 1) + 1) % 1;
  const back = u > 0.5;
  const s = back ? (1 - u) * 2 : u * 2;
  return {x: lerp(px + 0.5, px + 2.4, s), z: pz + 0.3 * ((i % 3) - 1), rot: back ? -Math.PI / 2 : Math.PI / 2, load: !back};
};

// ------------------------------------------------------------------ train: the line laid down the spit, the train pulls in
/** the line from the tile's south edge to the station */
export const LINE: P[] = [...RAIL].reverse();
const LINE_L = lengthOf(LINE);
/** the track is laid from the south toward the station in the first half of the beat; it stays (the line closed in 2521 but
 *  the rails were never lifted) */
export const trackK = (t: number, Y: number) => (Y > 1925 ? 1 : smooth(beatK('train', t) / 0.45));
export const trainAt = (t: number) => {
  const k = beatK('train', t);
  if (k < 0.38 || t > STORY.at('mermaid')[0] + 0.3) return null;
  const u = clamp01((k - 0.38) / 0.5);
  const e = u < 0.7 ? u * 1.15 : 0.805 + (1 - (1 - (u - 0.7) / 0.3) ** 2) * 0.195;
  return along(LINE, LINE_L * 0.5 + e * (LINE_L * 0.5 - 0.8));
};
export const stationK = (t: number, Y: number) => (Y > 1925 ? 1 : smooth((beatK('train', t) - 0.2) / 0.2));

// ------------------------------------------------------------------ mermaid: set on the rocks and gilded
export const STATUE_AT: P = [MERMAID[0] + 0.6, MERMAID[1] - 0.2];
export const statueK = (t: number, Y: number) => (Y > 1967 ? 1 : smooth((beatK('mermaid', t) - 0.08) / 0.4));
export const goldK = (t: number, Y: number) => (Y > 1967 ? 1 : smooth((beatK('mermaid', t) - 0.45) / 0.3));
export const BEACH_PEOPLE: P[] = (() => {
  const out: P[] = [];
  for (let i = 0; out.length < 14 && i < 300; i++) {
    const x = MERMAID[0] - 3.4 + ((i * 0.618) % 1) * 4.0;
    const z = MERMAID[1] + 1.2 + ((i * 0.414) % 1) * 2.4;
    if (inWater(x, z) || inWater(x + 0.4, z - 0.4)) continue;
    if (out.some(([px, pz]) => Math.hypot(px - x, pz - z) < 0.55)) continue;
    out.push([x, z]);
  }
  return out;
})();

// ------------------------------------------------------------------ grow: the bridge to Ko Yo
export const bridgeK = (Y: number) => smooth((Y - 1984) / 2.4);

// ------------------------------------------------------------------ the show: nang talung on Samila, Ai Teng back
export const SHOW_H = 9;
/** the giant puppet rises up behind the stage at the start of the show and stays to the end */
export const callbackK = (t: number) => smooth((beatK('show', t) + 0.02) / 0.12) * (1 - smooth((t - 55.0) / 1.0));
/** his clock: already cut, alive from the first frame he shows */
export const callbackT = (t: number) => CUT_END + 0.6 + (t - STORY.at('show')[0]);
export const CROWD: P[] = (() => {
  const out: P[] = [];
  for (let i = 0; out.length < 30 && i < 600; i++) {
    const a = -0.4 + ((i * 0.618) % 1) * 1.6;
    const r = 2.2 + ((i * 0.414) % 1) * 2.6;
    // the crowd sits in front of the screen (south-west of it, toward the camera)
    const x = STAGE[0] - Math.sin(a) * r;
    const z = STAGE[1] + Math.cos(a) * r;
    if (inWater(x, z) || inWater(x + 0.5, z) || inWater(x, z - 0.5)) continue;
    if (out.some(([px, pz]) => Math.hypot(px - x, pz - z) < 0.6)) continue;
    out.push([x, z]);
  }
  return out;
})();
export const showK = (t: number, Y: number) => (Y < 2015 ? 0 : smooth((beatK('show', t) + 0.12) / 0.2));

export const ACTORS: Actor[] = [
  {id: 'aiteng', role: 'hero', during: [0, 3.0], size: HERO_H * 0.25, at: () => [HERO_AT[0], HERO_H * 0.55, HERO_AT[1]]},
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `junk${i}`,
    during: [3.4, 7.6],
    size: 1.4,
    minInFrame: 0.6,
    at: (t) => {
      const p = portJunkAt(i, t);
      return p ? [p.x, 0.8, p.z] : null;
    },
  })),
  {id: 'singora', during: [5.6, 8.4], size: 3, at: () => [SINGORA[0] - 1.5, 1.0, SINGORA[1] + 1.8]},
  {
    id: 'attackers',
    during: [8.8, 14.0],
    size: 2.2,
    at: (t) => {
      const f = attackers(t);
      return f ? [f.at[0], 1.2, f.at[1]] : null;
    },
  },
  {id: 'fire', during: [11.6, 14.6], size: 3, at: () => [-24.0, 1.6, -28.0]},
  ...Array.from({length: 2}, (_, i): Actor => ({
    id: `ferry${i}`,
    during: [15.6, 20.4],
    size: 1.0,
    minInFrame: 0.6,
    at: (t) => {
      const p = ferryAt(i, t);
      return p ? [p.x, 0.5, p.z] : null;
    },
  })),
  {
    id: 'pillar',
    during: [18.0, 20.6],
    size: 1.0,
    minInFrame: 0.7,
    at: (t) => {
      const p = pillarLogAt(t);
      return p ? [p.x, 0.8, p.z] : null;
    },
  },
  ...Array.from({length: 3}, (_, i): Actor => ({
    id: `porter${i}`,
    during: [21.4, 26.6],
    size: 0.75,
    at: (t) => {
      const p = porterAt(i, t);
      return p ? [p.x, 0.6, p.z] : null;
    },
  })),
  {
    id: 'train',
    during: [29.4, 33.0],
    size: 1.6,
    minInFrame: 0.6,
    at: (t) => {
      const p = trainAt(t);
      return p ? [p.x, 0.8, p.z] : null;
    },
  },
  {id: 'statue', during: [33.6, 38.2], size: 1.4, at: () => [STATUE_AT[0], 1.6, STATUE_AT[1]]},
  {id: 'sprawl', during: [39.2, 45.6], size: 16, at: () => [-6, 0.5, 4]},
  {id: 'aiteng-back', role: 'callback', during: [46.8, 54.2], size: SHOW_H * 0.3, at: () => [PUPPET_BACK[0], SHOW_H * 0.6, PUPPET_BACK[1]]},
  {id: 'crowd', during: [46.8, 54.2], size: 2.0, at: () => [STAGE[0], 0.5, STAGE[1] + 2.4]},
];
