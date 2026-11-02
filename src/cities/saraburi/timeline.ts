// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/saraburi.md (Gemini's research
// cross-checked on the web, 1 Nov 2026). Built to the 0-to-100 spine: at the cover the tile is
// forest, the Pa Sak and a few riverside huts; the hunter's deer finds the Footprint (owner, option
// A1); the shrine is built, burned and raised again; the Thai Yuan settle at Sao Hai; the train
// comes and the seat moves to Pak Phriao; the Friendship Highway turns off to Isan; the town and the
// cement hills grow; flower alms at the same Footprint closes the clip.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {CEMENT, FOOT, STATION} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]
/** the deer's height at the shoulder at legend scale (the cover, style frame A1) */
export const D_HERO = 14;
/** where the deer pulls up to drink, west of the print's heel (actors.ts draws it here) */
export const DEER_STOP: [number, number] = [FOOT[0] - 0.42 * 1.25 * D_HERO + 0.12 * 1.25 * D_HERO - 0.85 * D_HERO, FOOT[1]];

const [FX, FZ] = FOOT;
// the cover ends close over the hill as the deer goes into the forest and the print settles
const HERO_END: Key = [6.5, FX - 10, 3, FZ, 80, 40, 33, 30];
// the elephants come up the straight road from the west; the first mondop rises over the print
const PR_IN: Key = [7.0, FX - 18, 2, FZ - 1.5, 74, 44, 32, 30];
const PR_END: Key = [11.6, FX - 6, 2.5, FZ, 58, 72, 32, 30];
// the fire of 2310
const FI_IN: Key = [12.5, FX, 2.5, FZ, 38, 86, 27, 30];
const FI_END: Key = [17.0, FX, 2.5, FZ, 33, 116, 29, 30];
// the seven-tier mondop rises
const RB_IN: Key = [17.6, FX, 3, FZ, 35, 126, 33, 30];
const RB_END: Key = [21.8, FX, 3, FZ, 42, 154, 37, 30];
// the Thai Yuan boats come down the Pa Sak to Ban Ton Tan and Sao Hai
const YU_IN: Key = [23.0, -18, 1, -19, 72, 170, 38, 30];
const YU_END: Key = [27.3, -30, 1, -25, 66, 194, 38, 30];
// the first train pulls in at Pak Phriao; the town follows it
// looking east along the line from the west, so the train runs up the frame to the station the
// whole beat ([local]'s render: side-on, it crossed the frame in the beat's last second)
const TR_IN: Key = [28.7, -10, 1, 2, 80, 250, 30, 30];
const TR_END: Key = [33.3, 3, 1, 2, 62, 266, 32, 30];
// the Friendship Highway turns off at the fork
const RD_IN: Key = [34.3, 11, 1, 6, 56, 276, 37, 30];
const RD_END: Key = [38.4, 20, 1, 5, 66, 296, 38, 30];
// the long wide shot: the town over both banks, the cement hills cut white
const GR_IN: Key = [39.8, -8, 2, -8, 165, 306, 36, 30];
const GR_END: Key = [46.8, -8, 2, -8, 200, 334, 35, 30];
// flower alms at the Footprint
const PY_IN: Key = [48.2, FX, 2.5, FZ + 3.5, 40, 346, 33, 30];
const PY_END: Key = [54.0, FX, 2.5, FZ + 3.5, 34, 364, 31, 30];
// the landing: the whole tile again, as on the cover, now the full town
const END: Key = [55.8, -20, 4, -12, 300, 378, 30, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1623,
  after: 2026,
  camera: [
    ...between(HERO_END, PR_IN, 4, 0.05),
    ...between(PR_END, FI_IN, 4),
    ...between(FI_END, RB_IN, 4),
    ...between(RB_END, YU_IN, 4),
    ...between(YU_END, TR_IN, 4, 0.2),
    ...between(TR_END, RD_IN, 4),
    ...between(RD_END, GR_IN, 4),
    ...between(GR_END, PY_IN, 4, 0.1),
    ...between(PY_END, END, 4),
    END,
    [60, -20, 4, -12, 330, 386, 30, 30],
  ],
  beats: [
    {
      // the chronicle's legend: hunter Bun's wounded deer (เนื้อ) drinks at a print in the rock on
      // Khao Suwan Banphot and is healed; King Songtham comes to see it. The year is disputed
      // (2149 / 2165 / ~2166-67, brief), so the caption names the reign; the counter shows "ราว 2166"
      id: 'hero',
      kind: 'legend',
      t: [0, 6.7],
      year: {hold: 1623},
      caption: {t0: 3.3, t1: 6.95, title: 'พบรอยพระพุทธบาท', sub: 'สมัยพระเจ้าทรงธรรม เนื้อของพรานบุญกินน้ำในรอย แผลหาย'},
      era: 'อยุธยา',
      camera: [
        [0, DEER_STOP[0] + 2, 0.55 * D_HERO, FZ, 310, 14, 24, 30],
        [3, DEER_STOP[0] + 4, 0.55 * D_HERO, FZ, 300, 22, 26, 30],
        HERO_END,
      ],
    },
    {
      // the king's road: a straight road surveyed with a "Farang's telescope" from Tha Chao Sanuk on
      // the Pa Sak to the hill, elephant processions in the 3rd and 4th months; a mondop over the
      // print (chronicle; silpa-mag; Gemini part 1)
      id: 'procession',
      kind: 'procession',
      t: [7.0, 11.6],
      year: [1624, 1632],
      caption: {t0: 7.0, t1: 11.8, title: 'ขบวนช้างเสด็จพระบาท', sub: 'ตัดถนนตรงจากท่าเจ้าสนุก สร้างมณฑปครอบรอยพระบาท'},
      camera: [PR_IN, PR_END],
    },
    {
      // at the fall of Ayutthaya (2309-2310) looters stripped the gold and the mondop burned to its
      // base (chronicle; FAD)
      id: 'fire',
      kind: 'disaster',
      t: [12.5, 17.0],
      year: {hold: 1767},
      caption: {t0: 12.5, t1: 17.2, title: 'มณฑปถูกเผาคราวเสียกรุง', sub: 'พ.ศ. 2310 ทองถูกลอก ไฟไหม้จนเหลือแต่ฐาน'},
      camera: [FI_IN, FI_END],
    },
    {
      // Rama I sends the Front Palace to build it again, 2330: one spire of seven tiers, green tiles,
      // three naga stairs (Rattanakosin chronicle, Thiphakorawong)
      id: 'rebuild',
      kind: 'build',
      t: [17.6, 21.8],
      year: {hold: 1787},
      caption: {t0: 17.6, t1: 22.0, title: 'รัชกาลที่ 1 สร้างมณฑปใหม่', sub: 'ยอดปราสาท 7 ชั้น บันไดนาค 3 สาย'},
      era: 'รัตนโกสินทร์',
      camera: [RB_IN, RB_END],
    },
    {
      // Chiang Saen taken, CS 1166 = 2347; its people sent south to Saraburi (Sao Hai) and Ratchaburi
      // (Khu Bua) (Rattanakosin chronicle R1 via silpa-mag ?p=145605; Gemini)
      id: 'yuan',
      kind: 'arrive',
      t: [23.0, 27.3],
      year: {hold: 1804},
      caption: {t0: 23.0, t1: 27.5, title: 'ไทยวนเชียงแสนมาตั้งบ้าน', sub: 'ริมป่าสักที่เสาไห้ ครัวเดียวกับไทยวนคูบัว ราชบุรี'},
      camera: [YU_IN, YU_END],
    },
    {
      // the railway Ayutthaya-Saraburi-Kaeng Khoi opened 1 May 2440 (SRT); the seat moved from Sao Hai
      // to Pak Phriao by the station (2439 or ~2441, disputed: no year of its own on screen)
      id: 'train',
      kind: 'trade',
      t: [28.7, 33.3],
      year: {hold: 1897},
      caption: {t0: 28.7, t1: 33.5, title: 'รถไฟมาถึง เมืองย้ายตาม', sub: 'ศาลากลางย้ายจากเสาไห้ มาริมสถานีที่ปากเพรียว'},
      callouts: [{label: 'สถานีสระบุรี', dx: 150, dy: -110, p: [STATION[0], 0.8, STATION[1]], t0: 30.2, t1: 33.2}],
      camera: [TR_IN, TR_END],
    },
    {
      // the Friendship Highway, Saraburi to Korat, opened 10 Jul 2501 (koratdata 3209; silpa-mag)
      id: 'road',
      kind: 'arrive',
      t: [34.3, 38.4],
      year: {hold: 1958},
      caption: {t0: 34.3, t1: 38.6, title: 'ถนนมิตรภาพ ประตูสู่อีสาน', sub: 'ทางหลวงสายใหม่จากสระบุรีไปโคราช'},
      camera: [RD_IN, RD_END],
    },
    {
      // the cement works in the limestone hills (Tha Luang fired 2491, Kaeng Khoi 2514, Siam City
      // 2515), the municipality 5 -> 20 km2 (2517) (SCG Heritage; tmsbr.go.th; years kept off)
      id: 'growth',
      kind: 'grow',
      t: [39.8, 46.8],
      year: [1960, 2016],
      caption: {t0: 39.8, t1: 47.0, title: 'ภูเขาหินปูนกลายเป็นปูน', sub: 'โรงปูนแก่งคอย ทับกวาง เมืองขยายกว้างสี่เท่า'},
      callouts: [{label: 'โรงปูนแก่งคอย', dx: -150, dy: -120, p: [CEMENT[0], 1.6, CEMENT[1]], t0: 42.5, t1: 46.2}],
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // ตักบาตรดอกเข้าพรรษา: the first day of Lent, the yellow Globba from the hills given to the monks
      // as they climb the naga stairs (sac.or.th rituals 45; 27-30 Jul 2569)
      id: 'payoff',
      kind: 'celebrate',
      t: [48.2, 54.0],
      year: {hold: 2025},
      caption: {t0: 48.2, t1: 54.2, title: 'ตักบาตรดอกเข้าพรรษา', sub: 'ดอกไม้เหลืองจากเขา ถวายพระขึ้นบันไดนาค'},
      camera: [PY_IN, PY_END],
    },
    {id: 'today', kind: 'today', t: [54.4, 55.8], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train comes in from Bangkok (the west, dir -1 runs toward +x) as the caption lands
const [tr0] = STORY.at('train');
export const SOUND_EVENTS = {
  trains: [{t0: tr0 + 0.05, dur: 4.6, dir: -1, modern: false}] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[],
};
