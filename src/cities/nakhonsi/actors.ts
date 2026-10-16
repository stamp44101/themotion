// Pure position math for Nakhon Si's moving things (src/engine/actors.ts): the relic boat,
// the Gulf junks, the two armies at the north gate and the แห่ผ้าขึ้นธาตุ procession.
// Landmarks.tsx draws from these; check_story projects them through the camera.
import type {Actor, ActorCtx} from '../../engine/actors';
import type {Formation} from '../../engine/army';
import {lerp, ramp, smooth} from '../../lib';
import {random} from 'remotion';

// where the legend's boat comes ashore: the Gulf's edge (13 km east, compressed to the tile)
export const LANDING: [number, number] = [40.4, 5];
// แห่ผ้าขึ้นธาตุ: the procession walks south down the town's axis, west of Phutthasihing,
// then turns east into the chedi court through its west side
export const PROCESSION: [number, number][] = [
  [-0.4, -7],
  [0.3, 5.6],
  [0.6, 7.4],
  [1.3, 7.4],
];

// legend: the relic boat sails in over the beat's first third and comes ashore
// (visibility on the beat too: on the year it lasted 0.8 s once the legend beat ran
// 300 -> 820, which the actor check caught at once)
export const relicBoat = (t: number, {beat}: ActorCtx) => {
  const p = beat('legend');
  const k = 1 - ramp(p, 0.36, 0.46);
  const sail = smooth(Math.min(1, p * 3));
  return {x: lerp(46, LANDING[0], sail), z: lerp(-16, LANDING[1], sail), k, rot: Math.atan2(LANDING[0] - 46, LANDING[1] + 16)};
};

// trade junks in the Gulf through the Tambralinga centuries (Song embassies 1001-1070)
export const JUNKS = new Array(5).fill(0).map((_, i) => ({
  x: 41.5 + random(`jx${i}`) * 5,
  z0: -46 + random(`jz${i}`) * 90,
  v: (random(`jv${i}`) < 0.5 ? -1 : 1) * (1.6 + random(`js${i}`)),
}));
export const tradeK = (Y: number) => ramp(Y, 850, 900) * (1 - ramp(Y, 1450, 1500));
export const junkAt = (j: (typeof JUNKS)[number], t: number) => ({x: j.x, z: ((((j.z0 + j.v * t + 46) % 92) + 92) % 92) - 46, rot: j.v > 0 ? 0 : Math.PI});

// 1767-69: Chao Nakhon's men hold the town; Taksin's army comes down from the north across
// the siege beat: march 0-.27, clash at the gate .27-.44, the defenders fall .44-.58,
// Thonburi marches in .62-.84
export const siege = (t: number, {Y, beat}: ActorCtx) => {
  const p = beat('siege');
  const inn = smooth(ramp(p, 0, 0.27));
  const clash = smooth(ramp(p, 0.27, 0.44));
  const enter = smooth(ramp(p, 0.62, 0.84));
  const defend = Y >= 1767.05 && p < 0.58;
  const nakhonAt: [number, number] = [-0.5, lerp(-12, -14.2, clash)];
  const thonburiAt: [number, number] = [lerp(lerp(3, -0.6, inn), -0.5, enter), lerp(lerp(lerp(-48, -20.5, inn), -17.4, clash), -11.5, enter)];
  const thonburi: Formation = p > 0 && p < 1 ? {at: thonburiAt, face: defend ? nakhonAt : [-0.5, 0]} : null;
  const nakhon: Formation = defend ? {at: nakhonAt, face: p > 0 ? thonburiAt : [-0.5, -20]} : null;
  return {thonburi, nakhon};
};

// แห่ผ้าขึ้นธาตุ: the head of the procession along its route, 0 -> 1 over the beat
const segs = PROCESSION.slice(1).map((b, i) => {
  const a = PROCESSION[i];
  return {a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1])};
});
export const PATH_LEN = segs.reduce((s, g) => s + g.len, 0);
export const pathPointAt = (d: number) => {
  let r = Math.max(0, Math.min(PATH_LEN, d));
  for (const g of segs) {
    if (r <= g.len) {
      const u = r / g.len;
      return {x: lerp(g.a[0], g.b[0], u), z: lerp(g.a[1], g.b[1], u), rot: Math.atan2(g.b[0] - g.a[0], g.b[1] - g.a[1])};
    }
    r -= g.len;
  }
  const g = segs[segs.length - 1];
  return {x: g.b[0], z: g.b[1], rot: 0};
};
export const PEOPLE = 64;
export const processionHead = (p: number) => (p <= 0 || p >= 1 ? null : pathPointAt(Math.min(PATH_LEN, p * (PATH_LEN + PEOPLE * 0.16))));

export const ACTORS: Actor[] = [
  {
    id: 'relicBoat',
    during: 'legend',
    size: 2,
    at: (t, ctx) => {
      const b = relicBoat(t, ctx);
      return b.k > 0.02 ? [b.x, 0.5, b.z] : null;
    },
  },
  {
    id: 'thonburiArmy',
    during: 'siege',
    size: 3,
    at: (t, ctx) => {
      const f = siege(t, ctx).thonburi;
      return f ? [f.at[0], 0.5, f.at[1]] : null;
    },
  },
  {
    id: 'nakhonArmy',
    during: 'siege',
    size: 3,
    at: (t, ctx) => {
      const f = siege(t, ctx).nakhon;
      return f ? [f.at[0], 0.5, f.at[1]] : null;
    },
  },
  {
    id: 'procession',
    during: 'procession',
    size: 1,
    at: (t, ctx) => {
      const h = processionHead(ctx.beat('procession'));
      return h ? [h.x, 0.4, h.z] : null;
    },
  },
];
