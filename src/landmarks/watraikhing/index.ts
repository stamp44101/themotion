import type {CamKey} from '../../engine/types';
import type {Story} from '../../Overlay';
import {CAPTIONS, DURATION, yearAt} from './timeline';
import {PIER_END, RIVER_Z, UBOSOT, raftAt} from './Temple';

// Camera: [t, targetX, targetY, targetZ, distance, azimuth (from south toward east), elevation, fov].
// Azimuth ~180 puts the camera over the river looking south at the ubosot's front.
const rx = (t: number) => raftAt(yearAt(t))[0];

export const CAMERA_KEYS: CamKey[] = [
  // whole tile, river in front
  [0, 0, 0, 0, 230, 150, 42, 30],
  [3.2, -12, 0, 6, 160, 165, 38, 30],
  // ginger fields, orbit toward the temple ground
  [8.2, 0, 1, 4, 118, 190, 35, 30],
  // the ubosot rises: slow orbit at near-constant distance
  [8.8, UBOSOT[0], 2, UBOSOT[1], 96, 198, 33, 30],
  [10.6, UBOSOT[0], 2, UBOSOT[1], 94, 204, 33, 30],
  [14.6, UBOSOT[0], 3, UBOSOT[1], 86, 232, 32, 30],
  // track the raft down the Tha Chin to the landing
  [15.2, rx(15.2) + 6, 1, PIER_END[1], 66, 206, 29, 30],
  [17.4, rx(17.4) + 3, 1, PIER_END[1], 62, 196, 28, 30],
  [19.6, rx(19.6), 1.5, PIER_END[1] + 2, 64, 186, 29, 30],
  [21.2, UBOSOT[0], 3, -6, 72, 172, 28, 30],
  // hero: the ubosot's river front
  [21.8, UBOSOT[0], 4, UBOSOT[1] - 1, 84, 166, 28, 30],
  [23.6, UBOSOT[0], 4, UBOSOT[1] - 1, 82, 161, 28, 30],
  [26.4, UBOSOT[0], 4, UBOSOT[1], 78, 146, 29, 30],
  // dusk: pull out over the fair
  [27.0, 0, 2, 2, 104, 136, 32, 30],
  [30.8, 0, 2, 4, 150, 116, 35, 30],
  [DURATION, 0, 2, 4, 205, 104, 38, 30],
];

export type LandmarkCallout = {t0: number; t1: number; label: string; dx: number; dy: number; p: (t: number) => [number, number, number]};

export const CALLOUTS: LandmarkCallout[] = [
  {t0: 3.6, t1: 7.9, label: 'แม่น้ำท่าจีน', dx: -110, dy: -50, p: () => [-22, 0.4, RIVER_Z - 12]},
  {t0: 9.4, t1: 14.3, label: 'พระอุโบสถ', dx: 120, dy: -60, p: () => [UBOSOT[0], 6, UBOSOT[1]]},
  {t0: 15.7, t1: 20.6, label: 'หลวงพ่อวัดไร่ขิง', dx: 110, dy: -70, p: (t) => {
    const [x, , z] = raftAt(yearAt(t));
    return [x, 2.6, z];
  }},
  {t0: 22.3, t1: 26.1, label: 'หน้าบันและช่อฟ้า', dx: 120, dy: -70, p: () => [UBOSOT[0], 9, UBOSOT[1] - 10]},
  {t0: 27.6, t1: 30.6, label: 'ท่าน้ำวัด', dx: -120, dy: -40, p: () => [PIER_END[0], 1, PIER_END[1]]},
];

export const STORY: Story = {
  captions: CAPTIONS,
  eras: [
    {t: 3.2, label: 'ไร่ขิง'},
    {t: 8.8, label: 'สร้างวัด'},
    {t: 21.8, label: 'มงคลจินดาราม'},
    {t: 27, label: 'ปัจจุบัน'},
  ],
  yearAt,
  intro: {kicker: 'ไทม์แลปส์ประวัติศาสตร์', title: 'วัดไร่ขิง', sub: 'นครปฐม · ริมแม่น้ำท่าจีน'},
  finale: {kicker: 'ราว พ.ศ. 2394 – 2569', title: 'วัดไร่ขิง', sub: 'หลวงพ่อวัดไร่ขิง ศูนย์รวมศรัทธาลุ่มน้ำนครชัยศรี'},
  approxBefore: 1860,
  duration: DURATION,
};

/** What scripts/check_story.mjs reads for a landmark reel (no city layout). */
export const WAT_RAI_KHING = {
  landmark: true as const,
  story: STORY,
  callouts: CALLOUTS.map((c) => ({...c, p: c.p((c.t0 + c.t1) / 2)})),
  cameraKeys: CAMERA_KEYS,
  soundtrack: 'soundtrack_watraikhing.wav',
};
