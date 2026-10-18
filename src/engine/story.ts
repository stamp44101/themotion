// Beats own their seconds; the year curve, captions, eras, callouts and camera keys are
// derived from them.
//
// Every animation is driven by the year, and the year curve used to be a hand-tuned
// list of keys. Any retime silently changed animation speed: Korat's armies finished
// their battle before the caption came up once a hold was added, Nakhon Si's siege army
// stood still for 2 s because a two-key hold eases in, and going from 60 to 75 s needed a
// hand-written WARP table applied separately to year keys, captions, camera keys,
// callouts and soundtrack cues. Here a city declares beats; each has its seconds and the
// years it covers. Inside a beat the year runs *linearly*, so a held year never eases;
// between beats a monotone cubic carries the jump. Landmarks move on `beat(id, t)`
// (0 -> 1 across the beat's seconds) instead of on the year, so a retime moves the
// motion with the caption. The beats are exported to the soundtrack as well.
import type {Caption} from '../lib';
import {makeCurve} from '../lib';
import type {CamKey} from './types';

export type Beat = {
  id: string;
  /** seconds on the clip */
  t: [number, number];
  /** the years the counter covers, or a year held through the beat: the counter rounds,
   *  so a hold on X runs X .. X + 0.45 and never shows X + 1 */
  year: [number, number] | {hold: number};
  caption?: {title: string; sub: string; note?: string; t0?: number; t1?: number};
  /** era label from this beat on (the timeline bar) */
  era?: string;
  callouts?: {label: string; dx: number; dy: number; p: [number, number, number]; t0?: number; t1?: number}[];
  /** camera keys, absolute seconds; keys outside any beat go in `StoryDef.camera` */
  camera?: CamKey[];
};

export type StoryDef = {
  duration: number;
  /** the year at t = 0, before the first beat (default: the first beat's start year) */
  before?: number;
  /** the year at the end, after the last beat (default: the last beat's end year) */
  after?: number;
  beats: Beat[];
  /** camera keys for the transitions between beats */
  camera?: CamKey[];
};

export const HOLD_SPAN = 0.45;

const span = (b: Beat): [number, number] => ('hold' in b.year ? [b.year.hold, b.year.hold + HOLD_SPAN] : b.year);

export const buildStory = (def: StoryDef) => {
  const beats = [...def.beats].sort((a, b) => a.t[0] - b.t[0]);
  const ids = new Set<string>();
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    if (ids.has(b.id)) throw new Error(`story: beat "${b.id}" is declared twice`);
    ids.add(b.id);
    if (b.t[1] <= b.t[0]) throw new Error(`story: beat "${b.id}" ends before it starts`);
    if (b.t[1] > def.duration) throw new Error(`story: beat "${b.id}" ends after the clip (${def.duration} s)`);
    const [y0, y1] = span(b);
    if (y1 < y0) throw new Error(`story: beat "${b.id}" runs the year backwards`);
    if (i > 0) {
      const prev = beats[i - 1];
      if (b.t[0] < prev.t[1]) throw new Error(`story: beat "${b.id}" overlaps "${prev.id}"`);
      if (y0 < span(prev)[1]) throw new Error(`story: beat "${b.id}" starts before "${prev.id}" ends (${y0} < ${span(prev)[1]})`);
    }
  }

  // year curve: linear inside a beat, monotone cubic across the gaps
  const keys: [number, number][] = [];
  const first = beats[0];
  const last = beats[beats.length - 1];
  if (first.t[0] > 0) keys.push([0, def.before ?? span(first)[0]]);
  for (const b of beats) {
    const [y0, y1] = span(b);
    keys.push([b.t[0], y0], [b.t[1], y1]);
  }
  if (last.t[1] < def.duration) keys.push([def.duration, def.after ?? span(last)[1]]);
  const gaps = makeCurve(keys);
  const yearAt = (t: number) => {
    for (const b of beats) {
      if (t >= b.t[0] && t <= b.t[1]) {
        const [y0, y1] = span(b);
        return y0 + ((t - b.t[0]) / (b.t[1] - b.t[0])) * (y1 - y0);
      }
    }
    return gaps(t);
  };

  const byId = new Map(beats.map((b) => [b.id, b]));
  /** 0 before the beat, 1 after it, linear in seconds across it */
  const beat = (id: string, t: number) => {
    const b = byId.get(id);
    if (!b) throw new Error(`story: no beat "${id}"`);
    return Math.max(0, Math.min(1, (t - b.t[0]) / (b.t[1] - b.t[0])));
  };
  /** seconds of a beat */
  const at = (id: string): [number, number] => {
    const b = byId.get(id);
    if (!b) throw new Error(`story: no beat "${id}"`);
    return b.t;
  };

  const captions: Caption[] = beats
    .filter((b) => b.caption)
    .map((b) => ({t0: b.caption!.t0 ?? b.t[0], t1: b.caption!.t1 ?? b.t[1], title: b.caption!.title, sub: b.caption!.sub, note: b.caption!.note}));
  const eras = beats.filter((b) => b.era).map((b) => ({t: b.t[0], label: b.era!}));
  const callouts = beats.flatMap((b) => (b.callouts ?? []).map((c) => ({...c, t0: c.t0 ?? b.t[0], t1: c.t1 ?? b.t[1]})));
  const cameraKeys = [...(def.camera ?? []), ...beats.flatMap((b) => b.camera ?? [])].sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < cameraKeys.length; i++)
    if (cameraKeys[i][0] <= cameraKeys[i - 1][0]) throw new Error(`story: two camera keys at ${cameraKeys[i][0]} s`);

  return {
    duration: def.duration,
    yearAt,
    beat,
    at,
    captions,
    eras,
    callouts,
    cameraKeys,
    /** [t0, t1] per id, for export_timeline and the soundtrack */
    beats: Object.fromEntries(beats.map((b) => [b.id, b.t])) as Record<string, [number, number]>,
    /** the derived year keys (for check_story's hold checks and debugging) */
    yearKeys: keys,
  };
};

export type BuiltStory = ReturnType<typeof buildStory>;
