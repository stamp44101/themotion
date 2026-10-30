// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/ratchaburi.md (Gemini's
// research, cross-checked on the web, 30 Oct 2026). Built to the 0-to-100 spine: the tile is forest,
// the river and a temple village on the west bank when the Thai Yuan come down from Chiang Saen, and
// the town crosses the Mae Klong and comes back before it fills both banks. The hero is the dragon jar
// (owner, option A1): thrown at legend scale on the whole tile in the first two seconds, then gone into
// the earth; the jars come out of the kilns in 2476 and the giant jar fountain closes the clip.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {FOUNTAIN, HERO, KILNS, MAHATHAT, OLD_HALL, PILLAR, STATION} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]
/** the jar's height at legend scale (the cover) and the fountain's (the payoff, ~6 m drawn ~2.6 units) */
export const H_HERO = 30;
export const H_FOUNT = 2.6;

// the cover ends pulled back over the west bank as the jar goes into the earth
const HERO_END: Key = [6.2, -24, 2, 0, 110, 220, 37, 30];
// the Thai Yuan column coming down the west bank
const CO_IN: Key = [7.9, -24, 1, -25, 52, 230, 40, 30];
const CO_END: Key = [12.1, -25, 1, -2, 52, 252, 40, 30];
// the wall rising on the east bank
const WL_IN: Key = [13.9, -3, 1, 2, 42, 270, 48, 30];
const WL_END: Key = [18.6, -2.5, 1, 2, 40, 300, 46, 30];
// back over the river: the Koi Ki rows go up on the west bank
const RT_IN: Key = [19.4, -12, 1, 7, 44, 312, 36, 30];
const RT_END: Key = [24.2, -12, 1, 7, 40, 336, 35, 30];
// the first train over the black bridge into the station
const TR_IN: Key = [25.0, -7, 1, 8, 58, 348, 34, 30];
const TR_END: Key = [29.6, -7, 1, 12, 52, 372, 34, 30];
// the kilns
const KL_IN: Key = [30.4, KILNS[0], 1, KILNS[1], 46, 384, 38, 30];
const KL_END: Key = [34.3, KILNS[0], 1, KILNS[1], 40, 404, 36, 30];
// the jar boats going downriver past Koi Ki
const JB_IN: Key = [35.7, -6, 1, 5, 54, 414, 40, 30];
const JB_END: Key = [39.8, 8, 1, 6, 62, 432, 40, 30];
// the long wide shot: the town over both banks
const GR_IN: Key = [41.8, -8, 1, 4, 175, 444, 36, 30];
const GR_END: Key = [47.6, -8, 1, 4, 220, 474, 35, 30];
// the fountain at night, Koi Ki behind it
const PY_IN: Key = [50.0, FOUNTAIN[0], 1.6, FOUNTAIN[1], 34, 540, 42, 30];
const PY_END: Key = [53.2, FOUNTAIN[0], 1.6, FOUNTAIN[1], 30, 552, 40, 30];
// the landing: the whole tile again, as on the cover, now the full city
const END: Key = [55.6, -8, 4, 4, 300, 566, 31, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1800,
  after: 2026,
  camera: [
    ...between(HERO_END, CO_IN, 4, 0.1),
    ...between(CO_END, WL_IN, 4),
    ...between(WL_END, RT_IN, 4),
    ...between(RT_END, TR_IN, 4),
    ...between(TR_END, KL_IN, 4),
    ...between(KL_END, JB_IN, 4),
    ...between(JB_END, GR_IN, 4),
    ...between(GR_END, PY_IN, 4, 0.2),
    ...between(PY_END, END, 4),
    END,
    [60, -8, 4, 4, 330, 574, 31, 30],
  ],
  beats: [
    {
      // the cover: the jar thrown at legend scale on the whole tile; the caption opens the loop (the
      // jar is younger than the town's two crossings: first kiln 2476, brief)
      id: 'hero',
      kind: 'legend',
      t: [0, 7.2],
      year: {hold: 1800},
      caption: {t0: 3.3, t1: 7.35, title: 'เมืองโอ่งมังกร ริมแม่กลอง', sub: 'ก่อนจะมีโอ่งใบแรก เมืองนี้ข้ามแม่น้ำมาแล้วสองครั้ง'},
      era: 'รัตนโกสินทร์',
      camera: [
        [0, HERO[0], 0.5 * H_HERO, HERO[1], 310, 200, 26, 30],
        [3, HERO[0], 0.52 * H_HERO, HERO[1], 320, 208, 28, 30],
        HERO_END,
      ],
    },
    {
      // Chiang Saen taken (CS 1166 = 2347); one of five parts of its people sent south to Saraburi and
      // Ratchaburi (Khu Bua) with their tin-chok looms (Rattanakosin chronicle R1 via silpa-mag
      // ?p=145605; Thai PBS; Gemini)
      id: 'yuan',
      kind: 'procession',
      t: [7.4, 12.8],
      year: {hold: 1804},
      caption: {t0: 7.4, t1: 13.05, title: 'ไทยวนจากเชียงแสนมาถึง', sub: 'ครัวเชียงแสนลงใต้ ตั้งบ้านที่คูบัว พร้อมกี่ทอผ้าจก'},
      camera: [CO_IN, CO_END],
    },
    {
      // Rama II moves the town to the east (left) bank from the 6th month of 2360, a brick wall with
      // six forts and the city pillar, to hold the Burmese (silpa-mag ?p=138439; Gemini)
      id: 'wall',
      kind: 'build',
      t: [13.2, 18.8],
      year: {hold: 1817},
      caption: {t0: 13.2, t1: 19.05, title: 'ย้ายเมืองข้ามแม่กลอง', sub: 'รัชกาลที่ 2 ก่อกำแพงอิฐฝั่งตะวันออก รับศึกพม่า'},
      callouts: [{label: 'หลักเมือง', dx: 140, dy: -120, p: [PILLAR[0], 0.8, PILLAR[1]], t0: 16, t1: 18.6}],
      camera: [WL_IN, WL_END],
    },
    {
      // monthon Ratchaburi 2437; the town hall back on the west bank 2440, where the Chinese market
      // ("โคยกี๊", the riverside) was growing (silpa-mag ?p=138439; Gemini, rbm.go.th)
      id: 'koiki',
      kind: 'trade',
      t: [19.2, 24.6],
      year: {hold: 1897},
      caption: {t0: 19.2, t1: 24.85, title: 'กลับมาฝั่งตะวันตก', sub: 'ศาลากลางย้ายกลับ ตลาดจีนริมน้ำ "โคยกี๊" คึกคัก'},
      camera: [RT_IN, RT_END],
    },
    {
      // the Southern Line: service from 1 Apr 2446, opened 19 Jun 2446 (Nakhon Pathom brief; Gemini);
      // the bridge's own year is disputed (2444-2446), so the caption names the train
      id: 'train',
      kind: 'arrive',
      t: [25.0, 30.0],
      year: {hold: 1903},
      caption: {t0: 25.0, t1: 30.25, title: 'รถไฟข้ามแม่กลอง', sub: 'รถไฟสายใต้ข้ามสะพานเหล็ก เข้าสถานีราชบุรี'},
      callouts: [{label: 'สถานีราชบุรี', dx: -160, dy: -90, p: [STATION[0], 0.8, STATION[1]], t0: 27, t1: 29.6}],
      camera: [TR_IN, TR_END],
    },
    {
      // 2476: Chinese potters find Ratchaburi's red clay and start the first kiln (Tao Hong Tai's
      // family and Gemini/GI agree on the year; the kiln's name is disputed, so no name)
      id: 'kiln',
      kind: 'build',
      t: [30.4, 35.0],
      year: {hold: 1933},
      caption: {t0: 30.4, t1: 35.25, title: 'โรงโอ่งแห่งแรก', sub: 'ช่างจีนพบดินแดงราชบุรี ตั้งเตาเผาโอ่ง'},
      camera: [KL_IN, KL_END],
    },
    {
      // WWII cuts the jars from China; Ratchaburi's dragon jars go out by jar boat down the Mae Klong
      // (Gemini, Silpakorn research): the open loop answered, younger than the train
      id: 'jars',
      kind: 'trade',
      t: [35.4, 40.8],
      year: [1941, 1947],
      caption: {t0: 35.4, t1: 41.05, title: 'โอ่งมังกรล่องแม่กลอง', sub: 'สงครามโลก โอ่งจีนเข้าไม่ได้ เรือโอ่งราชบุรีส่งทั่วไทย'},
      camera: [JB_IN, JB_END],
    },
    {
      // the long wide shot: Phetkasem (2493), the road bridges, the new hall (2525), 52 kilns (~2546),
      // the town over both banks (Gemini; years kept off the caption)
      id: 'growth',
      kind: 'grow',
      t: [41.2, 48.8],
      year: [1950, 2016],
      caption: {t0: 41.2, t1: 49.05, title: 'เมืองโตเต็มสองฝั่งน้ำ', sub: 'ถนนเพชรเกษม สะพาน และโรงโอ่งกว่าห้าสิบโรง'},
      callouts: [
        {label: 'วัดมหาธาตุ', dx: -170, dy: -40, p: [MAHATHAT[0], 2, MAHATHAT[1]], t0: 43, t1: 46},
        {label: 'พิพิธภัณฑ์ (ศาลากลางเก่า)', dx: 150, dy: -170, p: [OLD_HALL[0], 1, OLD_HALL[1]], t0: 44.4, t1: 48},
      ],
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the giant dragon-jar fountain on the river wall (end of 2565) and Koi Ki's walking
      // street at night; the hero comes back
      id: 'payoff',
      kind: 'celebrate',
      t: [49.2, 54.0],
      year: [2023, 2023.4],
      caption: {t0: 49.2, t1: 54.4, title: 'โอ่งมังกรยักษ์ริมแม่กลอง', sub: 'ถนนคนเดินตลาดเก่าโคยกี๊ ริมเขื่อนแม่กลอง'},
      callouts: [{label: 'ตลาดเก่าโคยกี๊', dx: 150, dy: -110, p: [-9, 1, 8.6], t0: 50.6, t1: 53.4}],
      camera: [PY_IN, PY_END],
    },
    {id: 'today', kind: 'today', t: [54.4, 55.6], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train comes in from Bangkok (the north) over the black bridge as the caption lands
const [tr0] = STORY.at('train');
export const SOUND_EVENTS = {
  trains: [
    {t0: tr0 + 0.2, dur: 5.6, dir: -1, modern: false},
  ] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[],
};
