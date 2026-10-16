// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Draft for style frames only: beats, holds and captions come from docs/briefs/nakhonsi.md.
import {Caption, makeCurve} from '../../lib';

export const YEAR_KEYS: [number, number][] = [
  [0, 311],
  [3, 320],
  [8, 775],
  [14, 1001],
  [20, 1230],
  [26, 1350],
  [32, 1688],
  [38, 1769],
  [44, 1914],
  [50, 1988],
  [56, 2026],
  [60, 2026],
];
export const yearAt = makeCurve(YEAR_KEYS);

export const CAPTIONS: Caption[] = [];

export const ERAS = [
  {t: 3, label: 'ตามพรลิงค์'},
  {t: 20, label: 'ศรีธรรมราช'},
  {t: 26, label: 'อยุธยา'},
  {t: 38, label: 'เจ้านคร'},
  {t: 44, label: 'ปัจจุบัน'},
];

export const SOUND_EVENTS = {trains: [] as {t0: number; dur: number; dir: number; modern: boolean}[]};
