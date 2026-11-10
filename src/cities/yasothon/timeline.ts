// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/yasothon.md, approved by the owner on 10 Nov 2569): hero / launch / found / trade / road /
// province / grow / festival / today. Held years: 2357 (เมืองยศสุนทร) and 2515 (the province); the counter lands on 2569.
// Ban Sing Tha's settling (~2315) is in the counter's run and never named as a year; the festival is older than the town
// and undated, so the launch carries no year. Nobody hurt: only clean launches (gemini part 5; the 1999 accident and the
// 2370 executions stay out).
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {BODY, HALL, LANDING, MUSEUM, R, ROCKET_AT, TAIL, TOWER, WAT_MAHATHAT} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the rocket lying north of its tower on the whole tile, seen from the west-south-west across the Chi
const C0: Key = [0, 6, 6, -9, 292, -75, 34, 30];
const C1: Key = [2.6, 7, 10, -6, 272, -70, 32, 30];
// the launch: in to the tower as the rocket stands, up with it on its smoke, down to the village as the rain comes
// The camera rides up with the rocket so its nose stays under the counter and caption band (the top 30%): the target sits
// 10 under the nose (at 200 out the caption's lowest line, ~37% from the top, is ~14 units above the centre); the rocket is
// gone into the thin rain cloud at fly 32 (actors.ts), so the camera stops with the cloud's top just under the text.
const NOSE0 = R + (TAIL - 2) + BODY + 2.6 * R; // the standing rocket's nose height
const ride = (lift: number, t0: number, t1: number, az0: number, az1: number, el0: number, el1: number): Key[] => {
  const n = Math.round((t1 - t0) / 0.3);
  return Array.from({length: n + 1}, (_, i) => {
    const t = t0 + ((t1 - t0) * i) / n;
    const u = i / n;
    const fly = Math.min(32, t > lift ? 9 * (t - lift) ** 2 : 0);
    return [t, ROCKET_AT[0] - 2, Math.max(35, NOSE0 + fly - 10), ROCKET_AT[1], 200, az0 + (az1 - az0) * u, el0 + (el1 - el0) * u, 30] as Key;
  });
};
const LA_IN: Key = [3.6, ROCKET_AT[0] - 2, 35, ROCKET_AT[1], 200, -62, 16, 30];
const LA_RIDE = ride(4.8, 4.5, 6.9, -60, -52, 15, 11);
const LA_UP = LA_RIDE[LA_RIDE.length - 1];
const LA_DOWN: Key = [8.1, 0, 2, 2, 120, -40, 30, 30];
// 2357: the temple and the governor's hall rise in the village, from the south-south-west
const FO_IN: Key = [9.8, WAT_MAHATHAT[0] + 1.2, 3, WAT_MAHATHAT[1] + 1.4, 58, -22, 40, 30];
const FO_END: Key = [15.6, WAT_MAHATHAT[0] + 1.6, 3, WAT_MAHATHAT[1] + 1.6, 44, -4, 38, 30];
// the trade: boats up the Chi to the landing, the shophouse street behind, from the south
const TR_IN: Key = [16.4, LANDING[0] - 0.5, 1, LANDING[1] + 4, 40, 14, 32, 30];
const TR_END: Key = [22.6, LANDING[0] + 0.5, 1, LANDING[1] + 1, 30, 38, 32, 30];
// the road: Chaeng Sanit cut down the town's east side, trucks in from the north-west, from the east
const RD_IN: Key = [24.0, -3.0, 1, -8, 40, 66, 36, 30];
const RD_END: Key = [28.8, 1.0, 1, -3, 34, 98, 36, 30];
// 2515: the provincial hall on the road, from the north-east, the old town behind it
const PR_IN: Key = [29.8, HALL[0], 1.4, HALL[1], 60, 126, 28, 30];
const PR_END: Key = [34.6, HALL[0], 1.4, HALL[1] + 1, 52, 148, 28, 30];
// the grow shot: the whole town from the north, wide, swinging round to the east
const GR_IN: Key = [37.0, 4, 1, 4, 165, 166, 36, 30];
const GR_END: Key = [43.8, 4, 1, 2, 215, 112, 36, 30];
// the festival: the procession down Chaeng Sanit to the tower, the toad museum behind it by the water; the cover's
// rocket back on the tower and away (from the east, over the Phaya Thaen water: the toad museum stands to the right of
// the tower and the stupa behind the town, neither in front of the tower)
const FE_IN: Key = [45.2, 7.5, 3, 5, 78, 92, 28, 30];
// the rocket comes down onto the tower (47-49 s), stands, and rides up again into the cloud (51.8 s)
const FE_STAND: Key = [49.4, ROCKET_AT[0] - 2, 35, ROCKET_AT[1], 200, 84, 16, 30];
const FE_RIDE = ride(51.8, 51.5, 53.9, 80, 72, 15, 11);
// the landing: the whole tile again at the cover's distance, now full of town, from the south-south-west
const END: Key = [56.0, 4, 6, 4, 292, 30, 32, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1760,
  after: 2026,
  camera: [
    ...between(C1, LA_IN, 3),
    ...between(LA_DOWN, FO_IN, 3),
    ...between(FO_END, TR_IN, 3),
    ...between(TR_END, RD_IN, 3),
    ...between(RD_END, PR_IN, 5),
    ...between(PR_END, GR_IN, 6, 0.1),
    ...between(GR_END, FE_IN, 4, 0.1),
    ...between(FE_RIDE[FE_RIDE.length - 1], END, 5),
    END,
    [60, 4, 6, 4, 302, 22, 32, 30],
  ],
  beats: [
    {
      // the cover (owner's pick A1): a giant bamboo rocket on its trestles north of the launch tower, half bound in rope at
      // frame 0; the binding walks down the rest by 2.2 s, the bamboo tail is lashed on, it swings up onto the tower.
      // No counter and no year under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1760, 1764],
      camera: [C0, C1],
    },
    {
      // the rain-asking rite (บุญบั้งไฟ, the sixth month): the villagers round the tower, the fuse, the roar; the rocket
      // climbs on its smoke and the rain sweeps the paddies; Ban Sing Tha is a handful of Lao houses at the landing
      // (settled ~2314-2315 by the chronicle; no year named)
      id: 'launch',
      kind: 'celebrate',
      t: [3.0, 9.2],
      year: [1764, 1772],
      caption: {t0: 3.2, title: 'บุญบั้งไฟขอฝน', sub: 'ชาวลาวจากเวียงจันทน์ตั้งบ้านสิงห์ท่าริมแม่น้ำชี'},
      era: 'ธนบุรี',
      camera: [LA_IN, ...LA_RIDE, LA_DOWN],
    },
    {
      // ปีจอ จ.ศ. 1176 = 2357: Rama II raises Ban Sing Tha to เมืองยศสุนทร, Kham Sing its first governor; the governor's
      // hall and Phra That Phra Anon (a Lan Xang stupa of the 24th Buddhist century) rise on the beat
      id: 'found',
      kind: 'build',
      t: [9.6, 15.6],
      year: {hold: 1814},
      caption: {t0: 9.8, title: 'เมืองยศสุนทร', sub: 'พ.ศ. 2357 รัชกาลที่ 2 ยกบ้านสิงห์ท่าเป็นเมือง'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'พระธาตุพระอานนท์', dx: 120, dy: -170, p: [WAT_MAHATHAT[0], 5.4, WAT_MAHATHAT[1]], t0: 11.0, t1: 15.2}],
      camera: [FO_IN, FO_END],
    },
    {
      // boats on the Chi to the landing; the shophouse street of Sing Tha goes up (c. 2450-2480 by its architecture)
      id: 'trade',
      kind: 'trade',
      t: [16.0, 22.8],
      year: [1815, 1925],
      caption: {t0: 16.0, title: 'เรือค้าขายขึ้นล่องน้ำชี', sub: 'ตึกแถวย่านสิงห์ท่าผุดขึ้นเรียงถนน'},
      callouts: [{label: 'ท่าน้ำบ้านสิงห์ท่า', dx: -130, dy: -150, p: [LANDING[0], 0.8, LANDING[1]], t0: 18.0, t1: 22.4}],
      camera: [TR_IN, TR_END],
    },
    {
      // Chaeng Sanit (Highway 23) cut down the old town's east side (2480s by gemini; no year on screen); trucks come in
      id: 'road',
      kind: 'arrive',
      t: [23.2, 29.0],
      year: [1930, 1966],
      caption: {t0: 23.2, title: 'ถนนแจ้งสนิทตัดผ่านเมือง', sub: 'การค้าย้ายจากท่าน้ำขึ้นมาริมถนน'},
      camera: [RD_IN, RD_END],
    },
    {
      // 1 Mar 2515 (Revolutionary Council no. 70): the province of its own; the hall rises on the road, the flag goes up
      id: 'province',
      kind: 'build',
      t: [29.6, 35.0],
      year: {hold: 1972},
      caption: {t0: 29.6, title: 'ตั้งจังหวัดยโสธร', sub: '1 มี.ค. 2515 แยกออกจากอุบลราชธานี'},
      callouts: [{label: 'ศาลากลางจังหวัด', dx: 130, dy: -160, p: [HALL[0], 2.0, HALL[1]], t0: 30.8, t1: 34.6}],
      camera: [PR_IN, PR_END],
    },
    {
      // the grow shot: the town spreads east to the Phaya Thaen water; the toad museum rises on its dike at the end
      id: 'grow',
      kind: 'grow',
      t: [35.6, 44.0],
      year: [1973, 2020],
      caption: {t0: 35.6, title: 'เมืองโตไปทางตะวันออก', sub: 'ถึงบึงพญาแถน ทุ่งข้าวหอมมะลิรอบเมือง'},
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the May festival; the decorated rockets (บั้งไฟเอ้) down Chaeng Sanit to the park, the toad museum by
      // the water; the cover's giant rocket back on its tower and away (the open loop closing)
      id: 'festival',
      kind: 'celebrate',
      t: [44.6, 54.0],
      year: [2023, 2025.5],
      caption: {t0: 44.6, t1: 51.6, title: 'บุญบั้งไฟยโสธร', sub: 'ทุกเดือนพฤษภาคม ขบวนบั้งไฟเอ้ และพญาคันคากยักษ์ริมบึง'},
      callouts: [{label: 'พิพิธภัณฑ์พญาคันคาก', dx: 140, dy: -150, p: [MUSEUM[0], 3.0, MUSEUM[1]], t0: 45.4, t1: 49.4}],
      camera: [FE_IN, FE_STAND, ...FE_RIDE],
    },
    {id: 'today', kind: 'today', t: [54.4, 56.0], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
