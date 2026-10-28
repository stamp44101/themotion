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
// v2 (owner, 27 Oct: three flat posts; the clip must feel like Chiang Mai's 0 to 100): the middle
// stays on the town and watches it fill, with wide shots that come back. The town is sparse in 2135
// (the frontier town of the wars, its wall razed) and fills over the palelai beat; the east bank grows
// from the road beat on; the landing is the whole tile at full size.
// palelai: wide over the town from the west, Wat Pa Lelai in the foreground, the houses filling
const PL_IN: Key = [8.8, -22, 1, 6, 96, 238, 38, 30];
const PL_END: Key = [13.8, -20, 1, 6, 86, 258, 38, 30];
// royal: along the town's river front, the old town dense behind the boats
const PR_IN: Key = [15.2, 9, 1, 12, 78, 272, 40, 30];
const PR_END: Key = [20.2, 11, 1, -12, 72, 292, 40, 30];
const TR_IN: Key = [21.6, 10, 1, 2, 70, 302, 38, 30];
const TR_END: Key = [26.2, 10, 1, 4, 62, 320, 38, 30];
// road: the gate and the town from the west, the east bank starting beyond the river
const RD_IN: Key = [27.6, WEST_GATE[0] - 7, 1, WEST_GATE[1] + 1, 84, 332, 38, 30];
const RD_END: Key = [32.2, WEST_GATE[0] - 4, 1, WEST_GATE[1], 78, 350, 38, 30];
// growth: the long wide shot, the town over both banks
const GR_IN: Key = [33.6, 2, 1, 0, 165, 366, 36, 30];
const GR_END: Key = [41.2, 2, 1, -2, 205, 404, 36, 30];
const PAY_IN: Key = [43.0, FIELD[0], 2.5, FIELD[1] + 2.5, 62, 504, 38, 30];
const PAY_END: Key = [51.4, FIELD[0], 2.5, FIELD[1] + 2.5, 50, 518, 34, 30];
// the landing: the whole tile again, as on the cover, now the full city
const END: Key = [54.2, -10, 1, -6, 270, 556, 34, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1300,
  after: 2026,
  camera: [
    ...between(HERO_END, PL_IN, 4, 0.1),
    ...between(PL_END, PR_IN, 4),
    ...between(PR_END, TR_IN, 4),
    ...between(TR_END, RD_IN, 4),
    ...between(RD_END, GR_IN, 4),
    ...between(GR_END, PAY_IN, 4, 0.2),
    ...between(PAY_END, END, 4),
    END,
    [60, -10, 1, -6, 300, 566, 34, 30],
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
      // the town fills again round its temples (the houses come up over this beat), and Luang Pho To
      // is restored (the hands remodelled over the knees, ~Rama IV: Matichon)
      id: 'palelai',
      kind: 'build',
      t: [7.7, 14.0],
      year: [1600, 1866],
      caption: {t0: 7.5, title: 'เมืองเก่าฝั่งตะวันตกคืนชีพ', sub: 'บ้านเรือนเต็มคูเมือง ราวสมัยรัชกาลที่ 4 บูรณะหลวงพ่อโตวัดป่าเลไลยก์'},
      era: 'รัตนโกสินทร์',
      camera: [PL_IN, PL_END],
    },
    {
      // 4 Aug 2447: Rama V's boats up the Tha Chin, the stop at Wat Khae's landing (Silpa-mag,
      // The Bangkok Insight)
      id: 'royal',
      kind: 'procession',
      t: [14.4, 20.4],
      year: {hold: 1904},
      caption: {t0: 14.2, title: 'เสด็จประพาสต้น', sub: 'พ.ศ. 2447 รัชกาลที่ 5 เสด็จทางเรือมาเมืองสุพรรณ แวะเสวยที่ท่าน้ำวัดแค'},
      camera: [PR_IN, PR_END],
    },
    {
      // the mail boats up and down the Tha Chin past the full old town
      id: 'boats',
      kind: 'trade',
      t: [20.8, 26.4],
      year: [1925, 1945],
      caption: {t0: 20.6, title: 'เรือเมล์ล่องท่าจีน', sub: 'ก่อนมีถนน ผู้คนและข้าวเดินทางเข้ากรุงทางน้ำ ตลาดริมน้ำคึกคัก'},
      camera: [TR_IN, TR_END],
    },
    {
      // Malaiman road in from the west through the old gate; the east bank starts to build
      id: 'road',
      kind: 'arrive',
      t: [26.8, 32.4],
      year: [1950, 1966],
      caption: {t0: 26.6, title: 'ถนนมาลัยแมนเข้าเมือง', sub: 'ถนนตัดผ่านทุ่งนาเข้าเมืองเก่า รถยนต์มาแทนเรือเมล์ เมืองข้ามไปฝั่งตะวันออก'},
      camera: [RD_IN, RD_END],
    },
    {
      // the long wide shot: the town over both banks, the tower rising, the dragon
      id: 'growth',
      kind: 'grow',
      t: [32.8, 41.4],
      year: [1967, 2018],
      caption: {t0: 32.6, title: 'เมืองโตสองฝั่งท่าจีน', sub: 'สะพานข้ามน้ำ หอคอยชมเมือง และมังกรสวรรค์ข้างศาลหลักเมือง'},
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the Don Chedi fair (every January since 2502; the re-enactment since 2523): the
      // two elephants meet again before the stupa
      id: 'payoff',
      kind: 'celebrate',
      t: [41.8, 51.6],
      year: [2025, 2025.4],
      caption: {t0: 41.6, t1: 54.0, title: 'งานอนุสรณ์ดอนเจดีย์', sub: 'ทุกเดือนมกราคม แสดงยุทธหัตถีหน้าเจดีย์ที่สร้างครอบซากเดิม ซึ่งพบสมัยรัชกาลที่ 6'},
      camera: [PAY_IN, PAY_END],
    },
    {id: 'today', kind: 'today', t: [52.0, 54.6], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
export const SOUND_EVENTS = {trains: [] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[]};
