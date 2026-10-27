// Pure position math for Suphanburi's moving things (src/engine/actors.ts); Landmarks.tsx draws
// from the same functions.
import type {Actor} from '../../engine/actors';
import {lerp, smooth} from '../../lib';
import {FIELD, PALELAI, RIVER, WAT_KHAE, WEST_GATE} from './places';
import {HERO_S, STORY} from './timeline';

type P = [number, number];
const beatAt = (id: string, p: number) => {
  const [a, b] = STORY.at(id);
  return a + p * (b - a);
};
export const beatK = (id: string, t: number) => {
  const [a, b] = STORY.at(id);
  return (t - a) / (b - a);
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
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
const arcTo = (pts: P[], q: P) => {
  const L = lengthOf(pts);
  let best = 0;
  let bd = Infinity;
  for (let d = 0; d <= L; d += 0.1) {
    const p = along(pts, d);
    const e = Math.hypot(p.x - q[0], p.z - q[1]);
    if (e < bd) {
      bd = e;
      best = d;
    }
  }
  return best;
};

// ------------------------------------------------------------------ the duel (the cover)
// Two war elephants at legend scale, already charging at frame 0; they meet at IMPACT, the Siamese
// elephant drives the other aside, and from 4.9 s both come down to the scale of the field (the
// image settles, as Phetchabun's did) and stand by the stupa until the camera has left.
export const IMPACT = 0.55;
const SHRINK0 = 4.9;
const SHRINK1 = 6.9;
export const DUEL_END = 7.8;
/** the giants' scale: HERO_S, settling to 1.6 */
export const duelScale = (t: number) => HERO_S * (1.6 / HERO_S) ** smooth(clamp01((t - SHRINK0) / (SHRINK1 - SHRINK0)));
/** both elephants' centres along x from FIELD (Siam from -x, Hongsawadi from +x), Hongsawadi's turn */
export const duelAt = (t: number) => {
  const S = duelScale(t);
  const gap0 = 2.4 * HERO_S;
  const meet = 1.9 * HERO_S;
  const charge = clamp01(t / IMPACT);
  const c = gap0 + (meet - gap0) * charge;
  const push = smooth(clamp01((t - IMPACT) / 2.0)) * 1.1 * HERO_S;
  const turn = smooth(clamp01((t - IMPACT - 0.3) / 1.8)) * 0.75;
  const recoil = Math.sin(clamp01((t - IMPACT) / 0.35) * Math.PI) * 0.25 * HERO_S;
  // positions are in giant units; they shrink toward the field's middle with the scale
  const k = S / HERO_S;
  return {
    S,
    siam: FIELD[0] + (-c + push - recoil * 0.4) * k,
    hongsa: FIELD[0] + (c + push + recoil) * k,
    turn,
    charging: t < IMPACT + 0.1,
    swing: clamp01(t / IMPACT) * (1 - smooth(clamp01((t - IMPACT - 0.4) / 1.2)) * 0.7),
  };
};
/** the stupa on the field: giant as it rises (2.6-4.4 s), settling to the field's scale */
// south of the field: the cover's camera looks south from the north, over the giants to the stupa
// and the town beyond
export const STUPA_AT: P = [FIELD[0], FIELD[1] + 8];
export const STUPA_H = 7;
export const stupaRise = (t: number) => smooth(clamp01((t - 2.6) / 1.8));
export const stupaHeight = (t: number) => {
  const giant = 3.0 * HERO_S;
  return giant * (STUPA_H / giant) ** smooth(clamp01((t - SHRINK0) / (SHRINK1 - SHRINK0)));
};

// ------------------------------------------------------------------ Luang Pho To restored
export const BUILDERS = 14;
export const builderAt = (i: number, t: number) => {
  const k = beatK('palelai', t);
  if (k < -0.02 || k > 1.02) return null;
  // round the hall's footprint, carrying up the scaffold
  const a = (i / BUILDERS) * Math.PI * 2 + t * 0.35;
  const r = 2.4 + (i % 3) * 0.4;
  return {x: PALELAI[0] + Math.cos(a) * r, z: PALELAI[1] + Math.sin(a) * r * 1.3, rot: -a, step: t * 1.5 + i * 0.37};
};
export const hallK = (t: number, Y: number) => (Y > 1866.5 ? 1 : smooth(clamp01((beatK('palelai', t) - 0.15) / 0.75)));

// ------------------------------------------------------------------ the river course
const chaikin = (pts: P[], iters = 3): P[] => {
  let q = pts;
  for (let k = 0; k < iters; k++) {
    const r: P[] = [q[0]];
    for (let i = 0; i < q.length - 1; i++) {
      const [ax, az] = q[i];
      const [bx, bz] = q[i + 1];
      r.push([0.75 * ax + 0.25 * bx, 0.75 * az + 0.25 * bz], [0.25 * ax + 0.75 * bx, 0.25 * az + 0.75 * bz]);
    }
    r.push(q[q.length - 1]);
    q = r;
  }
  return q;
};
export const COURSE = chaikin(RIVER);
const onCourse = (d: number, half: number, side: number) => {
  const bow = along(COURSE, d + half);
  const stern = along(COURSE, d - half);
  const rot = Math.atan2(bow.x - stern.x, bow.z - stern.z);
  return {x: (bow.x + stern.x) / 2 + Math.cos(rot) * side, z: (bow.z + stern.z) / 2 - Math.sin(rot) * side, rot};
};
const D_KHAE = arcTo(COURSE, WAT_KHAE);

// ------------------------------------------------------------------ 2447: Rama V's boats
// upstream (north, against the course's direction) from below the town to Wat Khae's landing
export const ROYAL_N = 6;
export const royalBoatAt = (i: number, t: number) => {
  const k = beatK('royal', t);
  if (k < -0.02 || k > 1.04) return null;
  const head = lerp(D_KHAE + 34, D_KHAE + 1.5, smooth(clamp01(k / 0.85)));
  // the barge (i 0) leads, the rowing boats follow downstream of it
  const d = head + (i === 0 ? 0 : 2.2 + (i - 1) * 2.0);
  const p = onCourse(d, 1.2, i === 0 ? 0 : (i % 2 ? 1 : -1) * 0.22);
  // they travel against the course (upstream): turn them round
  return {x: p.x, z: p.z, rot: p.rot + Math.PI, row: t * 1.4 + i * 0.37, barge: i === 0};
};

// ------------------------------------------------------------------ the found stupa
export const DIGGERS = 12;
export const diggerAt = (i: number, t: number) => {
  const k = beatK('found', t);
  if (k < -0.02 || k > 1.02) return null;
  const a = (i / DIGGERS) * Math.PI * 2 + t * 0.25;
  const r = 3.2 + (i % 2) * 0.6;
  return {x: STUPA_AT[0] + Math.cos(a) * r, z: STUPA_AT[1] + Math.sin(a) * r, rot: -a, step: t * 1.4 + i * 0.41};
};
/** the jungle cleared off the mound (0 overgrown .. 1 clear) */
export const clearK = (t: number, Y: number) => (Y > 1915 ? 1 : smooth(clamp01((beatK('found', t) - 0.1) / 0.7)));

// ------------------------------------------------------------------ the mail boats
export const MAIL_N = 4;
export const mailBoatAt = (i: number, t: number) => {
  const k = beatK('boats', t);
  if (k < -0.05 || k > 1.05) return null;
  // two upstream, two downstream, past the town's east side
  const up = i % 2 === 0;
  const mid = arcTo(COURSE, [12, 2]);
  const span = 26;
  const u = clamp01(k * 1.0 + (i >> 1) * 0.18);
  const d = up ? mid + span / 2 - u * span : mid - span / 2 + u * span;
  const p = onCourse(d, 1.6, up ? -0.25 : 0.25);
  return {x: p.x, z: p.z, rot: p.rot + (up ? Math.PI : 0)};
};

// ------------------------------------------------------------------ Malaiman road and its traffic
export const MALAIMAN: P[] = [
  [-56, 9],
  [-30, 8],
  [WEST_GATE[0] - 2.5, WEST_GATE[1] + 0.2],
  [WEST_GATE[0] + 2.5, WEST_GATE[1] - 0.3],
  [2, -3.2],
  // over the river square to its course (the real bridge crosses at 721, -229 m)
  [12.6, -3.0],
  [16.2, -6.2],
  [40, -3],
];
const D_BUS0 = arcTo(MALAIMAN, [-26, 8.3]);
export const BUSES = 5;
export const busAt = (i: number, t: number) => {
  const k = beatK('road', t);
  if (k < -0.05 || k > 1.1) return null;
  // in from the west, one after another, through the gate into the town
  const d = D_BUS0 + (k * 0.9 - i * 0.16) * 24;
  if (d < D_BUS0) return null;
  const p = along(MALAIMAN, d);
  return {x: p.x + Math.cos(p.rot) * 0.4, z: p.z - Math.sin(p.rot) * 0.4, rot: p.rot, bus: i % 2 === 0};
};

// ------------------------------------------------------------------ the payoff: the re-enactment
// two elephants (2.2x) charge at each other before the stupa, meet, back off, meet again
export const PAY_S = 2.2;
export const reenactAt = (t: number) => {
  const k = beatK('payoff', t);
  if (k < -0.05) return null;
  const cycle = clamp01(k / 0.9) * 2.0;
  const ph = cycle % 1;
  // in: 0-0.45 charge, 0.45-0.6 locked, 0.6-1 back off
  const close = ph < 0.45 ? smooth(ph / 0.45) : ph < 0.6 ? 1 : 1 - smooth((ph - 0.6) / 0.4) * 0.6;
  const c = lerp(3.4, 1.9, close) * PAY_S;
  const settled = k > 0.9;
  return {siam: FIELD[0] - (settled ? 1.9 * PAY_S : c), hongsa: FIELD[0] + (settled ? 1.9 * PAY_S : c), z: FIELD[1] - 0.5, moving: !settled && (ph < 0.45 || ph > 0.6), clash: ph > 0.43 && ph < 0.62 && !settled, swing: close};
};

export const ACTORS: Actor[] = [
  // the cover: the two giants on the whole tile from frame 0
  {id: 'warElephants', role: 'hero', during: [0, 2.5], size: 2.4 * HERO_S, at: (t) => {
    const d = duelAt(t);
    return [(d.siam + d.hongsa) / 2, 2 * d.S, FIELD[1]];
  }},
  {id: 'duelSettles', during: [2.5, 7.2], size: 6, at: (t) => {
    const d = duelAt(t);
    return [(d.siam + d.hongsa) / 2, 2 * d.S, FIELD[1]];
  }},
  {id: 'builders', during: [beatAt('palelai', 0.05), beatAt('palelai', 0.95)], size: 2.2, at: (t) => {
    const b = builderAt(0, t);
    return b ? [b.x, 0.9, b.z] : null;
  }},
  {id: 'royalBoats', during: [beatAt('royal', 0.05), beatAt('royal', 0.95)], size: 2.2, at: (t) => {
    const b = royalBoatAt(0, t);
    return b ? [b.x, 0.8, b.z] : null;
  }},
  {id: 'diggers', during: [beatAt('found', 0.05), beatAt('found', 0.95)], size: 2.2, at: (t) => {
    const d = diggerAt(0, t);
    return d ? [d.x, 0.9, d.z] : null;
  }},
  {id: 'mailBoats', during: [beatAt('boats', 0.05), beatAt('boats', 0.95)], size: 2.2, at: (t) => {
    const b = mailBoatAt(0, t);
    return b ? [b.x, 0.8, b.z] : null;
  }},
  {id: 'buses', during: [beatAt('road', 0.1), beatAt('road', 0.9)], size: 2, at: (t) => {
    for (let i = BUSES - 1; i >= 0; i--) {
      const b = busAt(i, t);
      if (b && b.x > -30) return [b.x, 0.8, b.z];
    }
    return null;
  }},
  {id: 'cityGrowing', during: [beatAt('growth', 0), beatAt('growth', 1)], size: 14, at: () => [2, 1.5, 0]},
  {id: 'reenactment', role: 'callback', during: [beatAt('payoff', 0.05), beatAt('payoff', 1)], size: 2.4 * PAY_S, at: (t) => {
    const r = reenactAt(t);
    return r ? [(r.siam + r.hongsa) / 2, 2 * PAY_S, r.z] : null;
  }},
];
