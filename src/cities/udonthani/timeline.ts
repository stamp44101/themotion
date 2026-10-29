// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/udonthani.md (Gemini's
// research, cross-checked on the web, 28 Oct 2026). Built to the 0-to-100 spine (owner, 27 Oct): the
// tile is forest and a lake when the camp arrives, and the town fills it beat by beat. The hero is the
// Ban Chiang jar (owner, option A1): a giant jar rising out of its dig on the whole tile, its red
// scrolls painted in the first second and a half. It comes back as the jar lantern at the fair.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {AIRFIELD, BAN_CHIANG, FIELD, RAIL_X, STATION} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]
export const HERO_S = 9.6;
// the cover: the camera east of the jar looking west, so the whole tile lies behind it
const HERO_END: Key = [7.2, 26, 4, 0, 200, 128, 33, 30];
const CP_IN: Key = [8.6, 1.5, 1, -20, 72, 150, 40, 30];
const CP_END: Key = [13.4, -1, 1, -7, 58, 166, 40, 30];
// the town filling round the lake: wide, from the north
const TN_IN: Key = [14.8, -2, 1, -1, 92, 186, 40, 30];
const TN_END: Key = [19.8, 2, 1, 1, 86, 206, 40, 30];
const TR_IN: Key = [21.2, RAIL_X - 3, 1, STATION[1] + 2, 62, 232, 36, 30];
const TR_END: Key = [25.8, RAIL_X - 4, 1, STATION[1], 56, 250, 36, 30];
const MK_IN: Key = [27.2, 18, 1, 15, 52, 266, 40, 30];
const MK_END: Key = [31.4, 18, 1, 15, 48, 284, 40, 30];
const AF_IN: Key = [32.8, AIRFIELD[0] + 2, 1, AIRFIELD[1] - 4, 82, 300, 36, 30];
const AF_END: Key = [36.8, AIRFIELD[0] + 2, 1, AIRFIELD[1] - 8, 86, 318, 36, 30];
// the long wide shot: the town over the whole tile
const GR_IN: Key = [38.4, 8, 1, 8, 170, 334, 36, 30];
const GR_END: Key = [45, 8, 1, 6, 215, 372, 35, 30];
const PY_IN: Key = [46.6, FIELD[0], 2.5, FIELD[1], 60, 400, 38, 30];
const PY_END: Key = [52.8, FIELD[0], 2.5, FIELD[1], 48, 414, 34, 30];
// the landing: the whole tile again, as on the cover, now the full city
const END: Key = [54.8, 8, 1, 6, 270, 450, 33, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1800,
  after: 2026,
  camera: [
    ...between(HERO_END, CP_IN, 4, 0.1),
    ...between(CP_END, TN_IN, 4),
    ...between(TN_END, TR_IN, 4),
    ...between(TR_END, MK_IN, 4),
    ...between(MK_END, AF_IN, 4),
    ...between(AF_END, GR_IN, 4),
    ...between(GR_END, PY_IN, 4, 0.2),
    ...between(PY_END, END, 4),
    END,
    [60, 8, 1, 6, 300, 460, 33, 30],
  ],
  beats: [
    {
      // the cover: the Ban Chiang jar at legend scale, painted in the first 1.6 s, on the tile's
      // east side (the site is 50 km due east). Before the camp: the counter runs up to 2433
      id: 'hero',
      kind: 'legend',
      t: [0, 7.4],
      year: [1880, 1890],
      caption: {t0: 3.3, title: 'ไหบ้านเชียง มรดกโลก', sub: 'ไหลายแดงยุคก่อนประวัติศาสตร์ ขุดพบทางตะวันออกของเมือง'},
      era: 'ก่อนตั้งเมือง',
      camera: [
        [0, BAN_CHIANG[0] - 6, 1.4 * HERO_S, BAN_CHIANG[1], 290, 106, 29, 30],
        [3, BAN_CHIANG[0] - 8, 1.5 * HERO_S, BAN_CHIANG[1], 300, 112, 30, 30],
        HERO_END,
      ],
    },
    {
      // 18 Jan ร.ศ. 112 (2436; January 1894 CE): after the treaty's 25-km rule, Prince Prachak
      // moves the Lao Phuan command down from Nong Khai to Ban Duea Mak Khaeng by the lake
      // (udoncity.go.th, Silpa-mag, The Isaan Record)
      id: 'camp',
      kind: 'procession',
      t: [7.8, 13.6],
      year: {hold: 1893},
      caption: {t0: 7.6, title: 'ตั้งค่ายริมหนองนาเกลือ', sub: '18 ม.ค. 2436 กรมหลวงประจักษ์ศิลปาคมย้ายกองบัญชาการจากหนองคายมาบ้านเดื่อหมากแข้ง'},
      era: 'รัตนโกสินทร์',
      camera: [CP_IN, CP_END],
    },
    {
      // the town fills round the lake: Wat Matchimawat (1894), Wat Pho Si (1906), the hall on the rise
      // (1906), เมืองอุดรธานี (1907), Rachinuthit (1920-25)
      id: 'town',
      kind: 'build',
      t: [14, 20],
      year: [1894, 1938],
      caption: {t0: 13.8, title: 'เมืองอุดรธานี', sub: 'ยกบ้านหมากแข้งขึ้นเป็นเมืองอุดรธานีสมัยรัชกาลที่ 5 วัด ศาลากลาง โรงเรียน ผุดขึ้นรอบหนอง'},
      camera: [TN_IN, TN_END],
    },
    {
      // 24 Jun 2484: the line opens Khon Kaen - Udon (SRT; the station's own page)
      id: 'train',
      kind: 'arrive',
      t: [20.4, 26],
      year: {hold: 1941},
      caption: {t0: 20.2, title: 'รถไฟถึงอุดร', sub: '24 มิ.ย. 2484 เปิดเดินรถขอนแก่น–อุดรธานี เมืองขยายไปทางสถานี'},
      camera: [TR_IN, TR_END],
    },
    {
      // the Chinese and Vietnamese quarters round the station; the shrine; the clock tower (2500/01,
      // disputed: no year on screen)
      id: 'market',
      kind: 'trade',
      t: [26.4, 31.6],
      year: [1942, 1962],
      caption: {t0: 26.2, title: 'ตลาดรอบสถานี', sub: 'ชาวจีนและชาวเวียดนามตั้งร้านค้า ศาลเจ้าปู่-ย่าคู่เมือง หอนาฬิกากลางย่านการค้า'},
      camera: [MK_IN, MK_END],
    },
    {
      // the air base years (the town told as growth, not as the war: Gemini §5)
      id: 'airfield',
      kind: 'arrive',
      t: [32, 37],
      year: [1963, 1976],
      caption: {t0: 31.8, title: 'ฐานบินอุดร', sub: 'ยุคสงครามเวียดนาม สนามบินขยายใหญ่ โรงแรม ร้านค้าผุดขึ้น เมืองโตลงไปทางใต้'},
      camera: [AF_IN, AF_END],
    },
    {
      // the long wide shot: the municipality grows to the ring road (1993), the malls, UD Town
      id: 'growth',
      kind: 'grow',
      t: [37.4, 45],
      year: [1977, 2020],
      caption: {t0: 37.2, title: 'เมืองใหญ่อีสานตอนบน', sub: 'ห้าง ตึกสูง และย่านใหม่ข้างสถานี เมืองโตเต็มแผ่นดิน'},
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the Thung Si Mueang fair in front of the hall (held for over 60 years; 2569: 26 Nov -
      // 7 Dec), the jar back as a giant lantern on the field
      id: 'payoff',
      kind: 'celebrate',
      t: [45.4, 53],
      year: [2025, 2025.4],
      caption: {t0: 45.2, t1: 54.2, title: 'งานทุ่งศรีเมือง', sub: 'งานประจำปีหน้าศาลากลางที่จัดมากว่า 60 ปี ผู้คนเต็มทุ่งทุกปลายปี'},
      camera: [PY_IN, PY_END],
    },
    {id: 'today', kind: 'today', t: [53.4, 54.6], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train comes up from Khon Kaen (the south) as the train caption lands
const [tr0] = STORY.at('train');
export const SOUND_EVENTS = {
  trains: [
    {t0: tr0 + 0.2, dur: 5.2, dir: 1, modern: false},
  ] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[],
};
