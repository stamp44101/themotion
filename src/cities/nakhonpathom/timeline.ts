// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/nakhonpathom.md (Gemini's
// research, cross-checked on the web, 29 Oct 2026). Built to the 0-to-100 spine: the tile is forest
// round an abandoned stupa when Rama IV begins the encasing, and the town fills it beat by beat. The
// hero is Phra Pathom Chedi (owner, option A1): at legend scale on the whole tile, its golden bell
// rising round the old stupa tier by tier in the first second and a half. It settles to the town's
// scale for the story and comes back lit over the 12th-month fair.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {PALACE, PRATHON, SILPAKORN, STATION} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]
/** the chedi's height at legend scale (the cover) and through the story (~4x true: 120 m = 1.5) */
export const H_HERO = 46;
export const H_MID = 6;
// the cover's camera ends close on the shrunken chedi under construction
const HERO_END: Key = [6.4, 4, 3, -2, 72, 26, 34, 30];
// the canal coming in from the east past the chedi's north side
const CN_IN: Key = [8.0, 26, 1, -6, 50, 20, 50, 30];
const CN_END: Key = [11.0, 7, 1, -6, 40, 44, 48, 30];
// the collapse, close on the chedi
const CL_IN: Key = [12.1, 0, 2.2, 0, 34, 74, 32, 30];
const CL_END: Key = [17.0, 0, 2.2, 0, 31, 98, 31, 30];
// the crown
const CR_IN: Key = [17.9, 0, 3.2, 0, 34, 108, 32, 30];
const CR_END: Key = [21.8, 0, 3.6, 0, 42, 138, 33, 30];
// the first train, from the north with the chedi behind it
const TR_IN: Key = [23.4, -2, 1, -12, 58, 160, 38, 30];
const TR_END: Key = [27.2, -4, 1, -11.5, 52, 180, 38, 30];
// the march down Ratchadamnoen to Sanam Chandra
const PL_IN: Key = [28.8, -10, 1, -1, 46, 204, 40, 30];
const PL_END: Key = [32.8, -15, 1, -1, 44, 226, 40, 30];
// the long wide shot: the town over the whole tile
const GR_IN: Key = [35.2, 8, 1, 2, 175, 250, 36, 30];
const GR_END: Key = [42.2, 9, 1, 2, 225, 292, 35, 30];
// the fair round the lit chedi
const PY_IN: Key = [43.6, 0, 3, 0, 52, 318, 34, 30];
const PY_END: Key = [52.6, 0, 3, 0, 44, 346, 32, 30];
// the landing: the whole tile again, as on the cover, now the full city
const END: Key = [54.8, 9, 4, 2, 300, 366, 31, 30];

// every caption stays up until the next one lands, so the counter never runs between beats with no
// headline over it ([local]'s v1 review: 2408 and 2419 went by bare)
export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1800,
  after: 2026,
  camera: [
    ...between(HERO_END, CN_IN, 4, 0.1),
    ...between(CN_END, CL_IN, 4),
    ...between(CL_END, CR_IN, 4),
    ...between(CR_END, TR_IN, 4),
    ...between(TR_END, PL_IN, 4),
    ...between(PL_END, GR_IN, 4),
    ...between(GR_END, PY_IN, 4, 0.2),
    ...between(PY_END, END, 4),
    END,
    [60, 9, 4, 2, 330, 374, 31, 30],
  ],
  beats: [
    {
      // the cover: the chedi at legend scale closing over the old stupa (Rama IV, 2396; mgronline,
      // Thairath, en.wikipedia), then settling to the town's scale as the work it began
      id: 'hero',
      kind: 'build',
      t: [0, 7.2],
      year: {hold: 1853},
      caption: {t0: 3.3, t1: 7.35, title: 'เจดีย์ใหม่ครอบองค์เก่า', sub: 'พ.ศ. 2396 รัชกาลที่ 4 ก่อเจดีย์ใหญ่ครอบองค์เก่าที่ร้างกลางป่า'},
      era: 'รัตนโกสินทร์',
      camera: [
        [0, 0, 0.5 * H_HERO, 0, 340, 6, 28, 30],
        [3, 0, 0.52 * H_HERO, 0, 350, 12, 30, 30],
        HERO_END,
      ],
    },
    {
      // Khlong Chedi Bucha, dug with the works from the Tha Chin (Gemini: 2396-2405; th.wikipedia
      // 2401: disputed, no year on screen); brick boats and the Chinese builders' quarter on its bank
      id: 'canal',
      kind: 'arrive',
      t: [7.4, 11.6],
      year: [1854, 1859],
      caption: {t0: 7.4, t1: 11.85, title: 'ขุดคลองเจดีย์บูชา', sub: 'เรือขนอิฐจากแม่น้ำท่าจีนมาถึงองค์พระ ช่างตั้งบ้านเรือนริมคลอง'},
      camera: [CN_IN, CN_END],
    },
    {
      // early July 2403: days of heavy rain, the half-built encasing slumps; relaid from 19 Sep 2403
      // as the bell (silpa-mag ?p=165453; Gemini). No deaths recorded.
      id: 'collapse',
      kind: 'disaster',
      t: [11.9, 17.2],
      year: {hold: 1860},
      caption: {t0: 11.9, t1: 17.75, title: 'องค์พระพังกลางพายุฝน', sub: 'ก.ค. 2403 ฝนตกหนักหลายวัน อิฐที่ก่อไว้ทรุดลงทั้งองค์ ต้องแก้แบบก่อใหม่'},
      camera: [CL_IN, CL_END],
    },
    {
      // 2413: the crown raised under Rama V, 120.45 m (Thairath, silpa-mag ?p=144387)
      id: 'crown',
      kind: 'build',
      t: [17.8, 22.4],
      year: {hold: 1870},
      caption: {t0: 17.8, t1: 22.75, title: 'ยกยอดมงกุฎ สูง 120 เมตร', sub: 'พ.ศ. 2413 สมัยรัชกาลที่ 5 เจดีย์ที่สูงที่สุดในประเทศไทย'},
      callouts: [{label: 'พระปฐมเจดีย์', dx: 150, dy: -120, p: [0, 0.7 * H_MID, 0], t0: 20.4, t1: 22.2}],
      camera: [CR_IN, CR_END],
    },
    {
      // the Southern Line: service from 1 Apr 2446, opened by Rama V on 19 Jun 2446 (en.wikipedia;
      // Gemini); the seat of Monthon Nakhon Chai Si had moved to the chedi (~2441, sub only)
      id: 'train',
      kind: 'arrive',
      t: [22.8, 27.8],
      year: {hold: 1903},
      caption: {t0: 22.8, t1: 28.15, title: 'รถไฟสายใต้มาถึง', sub: 'พ.ศ. 2446 สถานีเหนือคลองเจดีย์บูชา ตลาดบนตลาดล่างคึกคักริมคลอง'},
      callouts: [{label: 'สถานีนครปฐม', dx: -170, dy: -90, p: [STATION[0], 0.8, STATION[1]], t0: 24.4, t1: 27.4}],
      camera: [TR_IN, TR_END],
    },
    {
      // Rama VI: Sanam Chandra Palace (~2450-2454), Ratchadamnoen road to it, the Wild Tiger Corps;
      // the town renamed เมืองนครปฐม, Royal Gazette 2 Jul 2456 (no year on screen)
      id: 'palace',
      kind: 'procession',
      t: [28.2, 33.8],
      year: [1907, 1914],
      caption: {t0: 28.2, t1: 34.15, title: 'สร้างวังสนามจันทร์', sub: 'สมัยรัชกาลที่ 6 ตัดถนนตรงจากองค์พระสู่วัง กองเสือป่าฝึกซ้อม พระราชทานนามเมืองว่านครปฐม'},
      callouts: [{label: 'พระราชวังสนามจันทร์', dx: -150, dy: -110, p: [PALACE[0] + 2, 1, PALACE[1]], t0: 31.6, t1: 33.6}],
      camera: [PL_IN, PL_END],
    },
    {
      // the long wide shot: Phetkasem (2493), Silpakorn's Sanam Chandra campus (Jun 2511), the city
      // municipality (2542), the town filling the tile (Gemini; years kept off the caption)
      id: 'growth',
      kind: 'grow',
      t: [34.2, 42.6],
      year: [1915, 2018],
      caption: {t0: 34.2, t1: 42.95, title: 'เมืองโตรอบองค์พระ', sub: 'ถนนเพชรเกษม มหาวิทยาลัยศิลปากร และบ้านเรือนขยายเต็มเขตเทศบาลนคร'},
      callouts: [
        {label: 'ม.ศิลปากร', dx: -140, dy: -100, p: [SILPAKORN[0], 1, SILPAKORN[1]], t0: 37.4, t1: 40.6},
        {label: 'พระประโทณเจดีย์', dx: 120, dy: -110, p: [PRATHON[0], 1, PRATHON[1]], t0: 38.6, t1: 42},
      ],
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: งานนมัสการองค์พระปฐมเจดีย์, 12th waxing to 5th waning of the 12th month, 9 days and
      // nights; the chedi lit and the crowd walking round it
      id: 'payoff',
      kind: 'celebrate',
      t: [43, 53],
      year: [2025, 2025.4],
      caption: {t0: 43, t1: 54.2, title: 'งานนมัสการองค์พระ', sub: 'งานเดือน 12 เก้าวันเก้าคืน ผู้คนเวียนรอบองค์พระ'},
      callouts: [{label: 'พระปฐมเจดีย์', dx: 140, dy: -130, p: [0, 0.8 * H_MID, 0], t0: 45, t1: 50}],
      camera: [PY_IN, PY_END],
    },
    {id: 'today', kind: 'today', t: [53.4, 54.6], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train comes in from Bangkok (the east) as the train caption lands
const [tr0] = STORY.at('train');
export const SOUND_EVENTS = {
  trains: [
    {t0: tr0 + 0.2, dur: 5.4, dir: -1, modern: false},
  ] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[],
};
