// Moving things declare themselves: an army, a train, a boat, a procession. Each actor is
// pure data with a position function, so the same code places it in the scene and lets
// check_story project it through the camera for every frame of its beat.
//
// A still is not proof that a moving thing shows in the render (CLAUDE.md): Korat's armies
// were culled once they marched out of the first frame's bounding sphere, Nakhon Si's
// train vanished the instant its run ended, and the owner caught both on full renders.
// With actors registered, check_story fails one that is out of frame or behind trees for
// much of its beat, or that pops in and out while on screen, and scripts/actor_strips.mjs
// renders a short *sequential* strip around each one.
import type {CityLayout} from './types';
import {railSpan} from './world';

export type ActorCtx = {Y: number; beat: (id: string) => number};

export type Actor = {
  id: string;
  /** the seconds it must be on screen: a story beat id, or [t0, t1] */
  during: string | [number, number];
  /** world position at t, or null while it is not standing / not drawn */
  at: (t: number, ctx: ActorCtx) => [number, number, number] | null;
  /** half-size in world units, for the in-frame margin (default 1) */
  size?: number;
  /** share of its standing time it must be in frame (default 0.8; a train that crosses the
   *  whole tile only passes through the frame, 0.15) */
  minInFrame?: number;
};

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

/** Where train `tr` is at second t along the layout's rail, or null when it is off the
 *  tile or not running. A line with a terminus (rail.span) ends at its station: trains
 *  pull in and stop there, or start from there; `park` keeps one at the platform. */
export const trainAt = (L: CityLayout, tr: CityLayout['trains'][number], t: number, terrainH: (x: number, z: number) => number = () => 0) => {
  const rail = L.rail;
  if (!rail || t < tr.t0 || t > tr.t0 + tr.dur + (tr.park ?? 0)) return null;
  const span = railSpan(L);
  const p = Math.min(1, (t - tr.t0) / tr.dur);
  const st = rail.axis === 'z' ? rail.station[1] : rail.station[0];
  const termLo = !!rail.span && Math.abs(st - span[0]) < Math.abs(st - span[1]);
  const termHi = !!rail.span && !termLo;
  const lo = termLo ? span[0] + 3 : span[0] - 14;
  const hi = termHi ? span[1] - 3 : span[1] + 6;
  const arrive = tr.dir > 0 ? termLo : termHi;
  const leave = tr.dir > 0 ? termHi : termLo;
  const ease = (u: number) => (arrive ? 1 - (1 - u) ** 2 : leave ? u * u : u);
  const a = tr.dir > 0 ? lerp(hi, lo, ease(p)) : lerp(lo, hi, ease(p));
  const visible = a < span[1] && a > span[0] + 2;
  const x = rail.axis === 'z' ? rail.pos : a;
  const z = rail.axis === 'z' ? a : rail.pos;
  return {a, x, z, y: terrainH(x, z), visible};
};

/** The layout's trains as actors (the engine registers these itself). */
export const trainActors = (L: CityLayout, terrainH?: (x: number, z: number) => number): Actor[] =>
  L.trains.map((tr, i) => ({
    id: `train${i}`,
    during: [tr.t0, tr.t0 + tr.dur + (tr.park ?? 0)],
    size: 2,
    minInFrame: 0.15,
    at: (t) => {
      const p = trainAt(L, tr, t, terrainH);
      return p && p.visible ? [p.x, p.y + 0.6, p.z] : null;
    },
  }));
