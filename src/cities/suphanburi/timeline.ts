// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/suphanburi.md (Gemini's
// research, cross-checked on the web, 27 Oct 2026). The hero is the ยุทธหัตถี (owner, option A1): two
// war elephants at legend scale, already charging at frame 0 on the whole tile, meet tusk to tusk;
// the stupa rises on the field. They come back in the payoff, the re-enactment at the Don Chedi fair.
import {buildStory} from '../../engine/story';
import {between, type CameraKey} from '../../engine/glide';
import {FIELD, PALELAI, WAT_KHAE, WEST_GATE} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]
// the cover: the whole tile, the giants on it (owner: the land must show). The camera stands north
// of the field looking south, so the stupa, the town and the river lie behind the giants
export const HERO_S = 8;
const HERO_END: Key = [7.2, FIELD[0] + 4, 4, FIELD[1] + 14, 190, 222, 34, 30];
const PL_IN: Key = [8.6, PALELAI[0], 1, PALELAI[1], 54, 232, 36, 30];
const PL_END: Key = [12.4, PALELAI[0], 1, PALELAI[1], 46, 252, 36, 30];
const PR_IN: Key = [13.8, 10.5, 1, 6, 72, 268, 38, 30];
const PR_END: Key = [18.4, WAT_KHAE[0] - 1, 1, WAT_KHAE[1] + 4, 60, 290, 38, 30];
const DI_IN: Key = [19.8, FIELD[0], 1, FIELD[1] + 5, 54, 312, 38, 30];
const DI_END: Key = [24.4, FIELD[0], 1, FIELD[1] + 5, 46, 334, 38, 30];
const TR_IN: Key = [25.8, 11, 1, 1, 62, 356, 36, 30];
const TR_END: Key = [30.4, 11, 1, 5, 54, 378, 36, 30];
const RD_IN: Key = [31.8, WEST_GATE[0] - 4, 1, WEST_GATE[1] + 1, 66, 412, 36, 30];
const RD_END: Key = [36.2, WEST_GATE[0] - 1, 1, WEST_GATE[1], 56, 432, 36, 30];
const GR_IN: Key = [37.6, 0, 1, 0, 175, 448, 36, 30];
const GR_END: Key = [42.4, 0, 1, -2, 195, 476, 36, 30];
const PAY_IN: Key = [44.0, FIELD[0], 2.5, FIELD[1] + 2.5, 62, 504, 38, 30];
const PAY_END: Key = [52.4, FIELD[0], 2.5, FIELD[1] + 2.5, 50, 518, 34, 30];
const END: Key = [55.0, -10, 1, -10, 200, 556, 36, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1300,
  after: 2026,
  camera: [
    ...between(HERO_END, PL_IN, 4, 0.2),
    ...between(PL_END, PR_IN, 4, 0.2),
    ...between(PR_END, DI_IN, 4, 0.3),
    ...between(DI_END, TR_IN, 4, 0.3),
    ...between(TR_END, RD_IN, 4, 0.2),
    ...between(RD_END, GR_IN, 4),
    ...between(GR_END, PAY_IN, 4, 0.2),
    ...between(PAY_END, END, 4),
    END,
    [60, -10, 1, -10, 270, 566, 36, 30],
  ],
  beats: [
    {
      // the cover: the duel at legend scale, the stupa rising on the field
      id: 'hero',
      kind: 'fight',
      t: [0, 7.4],
      // 18 Jan 2135 BE is January 1593 CE, before the old Thai new year: the counter shows CE + 543
      year: {hold: 1592},
      caption: {t0: 3.3, title: 'ยุทธหัตถี ณ หนองสาหร่าย', sub: 'พ.ศ. 2135 สมเด็จพระนเรศวรมหาราชทรงชนะพระมหาอุปราชา'},
      era: 'อยุธยา',
      camera: [
        [0, FIELD[0], 1.6 * HERO_S, FIELD[1] + 4, 290, 196, 27, 30],
        [3, FIELD[0], 1.8 * HERO_S, FIELD[1] + 6, 300, 204, 29, 30],
        HERO_END,
      ],
    },
    {
      // Luang Pho To restored (the hands remodelled over the knees, ~Rama IV: Matichon); builders
      // on the scaffold, the hall going up round the image
      id: 'palelai',
      kind: 'build',
      t: [7.7, 12.6],
      year: [1855, 1866],
      caption: {t0: 7.5, title: 'หลวงพ่อโตวัดป่าเลไลยก์', sub: 'ราวสมัยรัชกาลที่ 4 บูรณะองค์พระพุทธรูปใหญ่นอกคูเมือง'},
      era: 'รัตนโกสินทร์',
      camera: [PL_IN, PL_END],
    },
    {
      // 4 Aug 2447: Rama V's boats up the Tha Chin, the stop at Wat Khae's landing (Silpa-mag,
      // The Bangkok Insight)
      id: 'royal',
      kind: 'procession',
      t: [13.0, 18.6],
      year: {hold: 1904},
      caption: {t0: 12.8, title: 'เสด็จประพาสต้น', sub: 'พ.ศ. 2447 รัชกาลที่ 5 เสด็จทางเรือมาเมืองสุพรรณ แวะเสวยที่ท่าน้ำวัดแค'},
      camera: [PR_IN, PR_END],
    },
    {
      // Rama VI's reign: the ruined stupa found under the jungle at Don Chedi
      id: 'found',
      kind: 'discover',
      t: [19.0, 24.6],
      year: [1912.2, 1914.5],
      caption: {t0: 18.8, title: 'พบซากเจดีย์ยุทธหัตถี', sub: 'สมัยรัชกาลที่ 6 พบเนินเจดีย์โบราณกลางป่าที่ดอนเจดีย์'},
      camera: [DI_IN, DI_END],
    },
    {
      // the mail boats up and down the Tha Chin, the riverside market
      id: 'boats',
      kind: 'trade',
      t: [25.0, 30.6],
      year: [1925, 1945],
      caption: {t0: 24.8, title: 'เรือเมล์ล่องท่าจีน', sub: 'ก่อนมีถนน ผู้คนและข้าวเดินทางเข้ากรุงทางน้ำ ตลาดริมน้ำคึกคัก'},
      camera: [TR_IN, TR_END],
    },
    {
      // Malaiman road in from the west through the old gate; buses and cars
      id: 'road',
      kind: 'arrive',
      t: [31.0, 36.4],
      year: [1950, 1965],
      caption: {t0: 30.8, title: 'ถนนมาลัยแมนเข้าเมือง', sub: 'ถนนตัดผ่านทุ่งนาเข้าเมืองเก่า รถยนต์มาแทนเรือเมล์'},
      camera: [RD_IN, RD_END],
    },
    {
      id: 'growth',
      kind: 'grow',
      t: [36.8, 42.6],
      year: [1966, 2018],
      caption: {t0: 36.6, title: 'เมืองโตสองฝั่งท่าจีน', sub: 'สะพานข้ามน้ำ หอคอยชมเมือง และมังกรสวรรค์ข้างศาลหลักเมือง'},
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the Don Chedi fair (every January since 2502; the re-enactment since 2523): the
      // two elephants meet again before the stupa
      id: 'payoff',
      kind: 'celebrate',
      t: [43.0, 52.6],
      year: [2025, 2025.4],
      caption: {t0: 42.8, t1: 54.2, title: 'งานอนุสรณ์ดอนเจดีย์', sub: 'ทุกเดือนมกราคม การแสดงยุทธหัตถีหน้าพระเจดีย์ ผู้คนมาร่วมรำลึก'},
      camera: [PAY_IN, PAY_END],
    },
    {id: 'today', kind: 'today', t: [53.0, 54.4], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
export const SOUND_EVENTS = {trains: [] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[]};
