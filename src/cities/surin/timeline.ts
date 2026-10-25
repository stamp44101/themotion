// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/surin.md and the Gemini
// research, spot-checked (PR #69). The hero is the province's own animal: a wild herd crosses
// the forest where the town will stand, and comes back at the end to the elephant buffet in
// front of the founder's monument. 60 s.
import {buildStory} from '../../engine/story';
import {between, type CameraKey} from '../../engine/glide';
import {MONUMENT, STADIUM} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]
const HERD_END: Key = [7.2, -1, 2, -1, 120, 186, 36, 30];
const MOAT_IN: Key = [8.6, 0, 1, 0, 118, 200, 50, 30];
const MOAT_END: Key = [11.4, 0, 1, 0, 112, 214, 50, 30];
const KH_IN: Key = [12.6, 6, 1, 8, 80, 230, 40, 30];
const KH_END: Key = [17.4, -2, 1, 1, 80, 248, 40, 30];
const WH_IN: Key = [18.6, -26, 2, -4, 78, 262, 36, 30];
const WH_END: Key = [23.6, -21, 2, 1, 70, 276, 36, 30];
const PR_IN: Key = [24.8, 16, 1, 2, 78, 290, 40, 30];
const PR_END: Key = [29.6, 8, 1, 2, 78, 304, 42, 30];
const RA_IN: Key = [30.8, 9, 1, -15, 72, 318, 36, 30];
const RA_END: Key = [34.6, 8, 1, -12, 66, 332, 38, 30];
const SH_IN: Key = [35.8, STADIUM[0] + 2, 1, STADIUM[1] - 2, 72, 346, 40, 30];
const SH_END: Key = [40.2, STADIUM[0], 1, STADIUM[1], 64, 360, 40, 30];
const GR_IN: Key = [41.4, 4, 1, 3, 150, 374, 38, 30];
const GR_END: Key = [45.4, 5, 1, 4, 175, 392, 36, 30];
const PAY_IN: Key = [47.2, MONUMENT[0] - 1, 2, MONUMENT[1] + 8, 66, 412, 34, 30];
const PAY_END: Key = [54.4, MONUMENT[0] - 1, 2, MONUMENT[1] + 7, 58, 432, 34, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: -500,
  after: 2026,
  camera: [
    ...between(HERD_END, MOAT_IN, 4),
    ...between(MOAT_END, KH_IN, 4),
    ...between(KH_END, WH_IN, 4),
    ...between(WH_END, PR_IN, 4),
    ...between(PR_END, RA_IN, 4),
    ...between(RA_END, SH_IN, 4),
    ...between(SH_END, GR_IN, 4),
    ...between(GR_END, PAY_IN, 4, 0.3),
    [57.6, 2, 2, 4, 220, 452, 36, 30],
    [60, 2, 2, 4, 300, 468, 36, 30],
  ],
  beats: [
    {
      // the cover: a wild herd crosses the forest tile where the town will stand; at the
      // edge of the clearing, an iron-age village on its moated mound smokes from its smelters
      id: 'herd',
      kind: 'arrive',
      t: [0, 7.4],
      year: {hold: -500},
      caption: {t0: 3.3, title: 'ถิ่นช้างป่าดงเร็ก', sub: 'ชุมชนยุคเหล็กขุดคูน้ำล้อมเนินบ้าน ถลุงเหล็กริมป่าช้าง'},
      era: 'ก่อนประวัติศาสตร์',
      camera: [
        [0, 0, 2, 2, 430, 165, 38, 30],
        [3, -2, 3, 1, 190, 168, 33, 30],
        HERD_END,
      ],
    },
    {
      // the oval moat dug round the town mound, earth thrown up into a rampart inside it.
      // Only 40 years: the engine clears the in-city forest over 1.2 years and lays the town
      // ground over 1.5, so the curve has to run slowly here (Lopburi's check_render lesson)
      id: 'moat',
      kind: 'build',
      t: [7.7, 11.7],
      year: [600, 640],
      caption: {t0: 7.5, title: 'คูเมืองรูปวงรี', sub: 'สันนิษฐานว่าพุทธศตวรรษที่ 12–13 ขุดคูน้ำคันดินชั้นในที่ยังเห็นถึงวันนี้'},
      era: 'ทวารวดี',
      camera: [MOAT_IN, MOAT_END],
    },
    {
      // Jayavarman VII's road from Angkor runs through; a caravan of elephants and ox carts
      // walks it, and the outer moat is dug round the larger town
      id: 'khmer',
      kind: 'procession',
      t: [11.9, 17.8],
      year: [1181, 1218],
      caption: {t0: 11.7, title: 'ถนนจากเมืองพระนคร', sub: 'สมัยชัยวรมันที่ 7 ราชมรรคาผ่านแดนนี้ สันนิษฐานว่าคูเมืองชั้นนอกขุดในยุคนี้'},
      era: 'เขมร',
      camera: [KH_IN, KH_END],
    },
    {
      // 2302: the white elephant breaks out of Ayutthaya; five Kuy headmen ride it down
      id: 'white',
      kind: 'discover',
      t: [18.2, 24.0],
      year: {hold: 1759},
      caption: {t0: 18.0, title: 'ช้างเผือกแตกโรง', sub: 'พ.ศ. 2302 ตามพงศาวดาร หัวหน้าชาวกูยช่วยจับคืน เชียงปุมได้เป็นหลวงสุรินทรภักดี'},
      era: 'อยุธยา',
      camera: [WH_IN, WH_END],
    },
    {
      // 2306: Chiang Pum brings his people and elephants from Ban Mueang Thi into the old moat
      id: 'prathai',
      kind: 'build',
      t: [24.4, 30.0],
      // not a hold: the engine's houses take 6 years to go up, so the year runs slowly
      // through the beat (พ.ศ. 2306 stays on the counter for its first second)
      year: [1762.55, 1767.5],
      caption: {t0: 24.2, title: 'ตั้งเมืองประทายสมันต์', sub: 'พ.ศ. 2306 เชียงปุมพาผู้คนและช้างจากบ้านเมืองทีมาตั้งในคูเมืองเก่า ต่อมาได้ชื่อว่าเมืองสุรินทร์'},
      camera: [PR_IN, PR_END],
    },
    {
      // 1 พ.ค. 2469: the first train from Buriram; ถนนธนสาร runs from the station into town
      id: 'railway',
      kind: 'arrive',
      t: [30.4, 35.0],
      year: {hold: 1926},
      caption: {t0: 30.2, title: 'รถไฟถึงสุรินทร์', sub: '1 พ.ค. 2469 ถนนธนสารตัดจากสถานีเข้ากลางเมือง'},
      era: 'รัตนโกสินทร์',
      camera: [RA_IN, RA_END],
    },
    {
      // 2505: the elephant show, begun at Tha Tum in 2503, moves to the ground south of town
      id: 'show',
      kind: 'celebrate',
      t: [35.4, 40.6],
      year: {hold: 1962},
      caption: {t0: 35.2, title: 'งานช้างเข้าเมือง', sub: 'พ.ศ. 2505 งานแสดงช้างที่เริ่มที่ท่าตูมย้ายมาจัดในตัวเมือง'},
      camera: [SH_IN, SH_END],
    },
    {
      // the town fills the outer moat and reaches the railway
      id: 'growth',
      kind: 'grow',
      t: [41.0, 45.8],
      year: [1963, 2015],
      caption: {t0: 40.8, title: 'เมืองโตเกินคูเมือง', sub: 'เมืองขยายจากคูเมืองชั้นในไปจรดทางรถไฟ'},
      era: 'ปัจจุบัน',
      callouts: [{t0: 43.8, t1: 45.6, label: 'อนุสาวรีย์พระยาสุรินทรภักดี', dx: -90, dy: -140, p: [MONUMENT[0], 1.5, MONUMENT[1]]}],
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the elephant buffet in front of the monument, and the herd comes back
      id: 'payoff',
      kind: 'celebrate',
      t: [46.2, 54.6],
      year: [2025, 2025.4],
      caption: {t0: 46.0, t1: 55.8, title: 'บุฟเฟต์ช้างหน้าอนุสาวรีย์', sub: 'ทุกพฤศจิกายน ช้างนับร้อยเชือกกินผลไม้ เคยทำสถิติโลกกินเนสส์'},
      camera: [PAY_IN, PAY_END],
    },
    {id: 'today', kind: 'today', t: [54.8, 55.8], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train comes in from the west (Buriram) as the railway caption lands
const [rail0] = STORY.at('railway');
export const SOUND_EVENTS = {
  trains: [{t0: rail0 + 0.1, dur: 4.0, dir: -1, modern: false}] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[],
};
