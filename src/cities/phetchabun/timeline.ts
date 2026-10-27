// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/phetchabun.md, checked on
// the web (27 Oct 2026). The hero is the พระพุทธมหาธรรมราชา (owner, 27 Oct 2026, option A): it
// rises upright out of a whirlpool in the Pa Sak at frame 0, is carried by water to Wat
// Traiphum, and comes back in the payoff, held in the governor's arms in the อุ้มพระดำน้ำ rite at
// the same bend. 60 s (experiments §9: prefer 60).
import {buildStory} from '../../engine/story';
import {between, type CameraKey} from '../../engine/glide';
import {LANDING, NAKHONBAN, POOL, WALL_C} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]
// the cover (style frame A1, passed by the owner): the image 14 units tall, the camera from the
// south-south-east, the image facing it
export const HERO_AZ = 30;
const HERO_END: Key = [7.2, POOL[0] - 1, 2, POOL[1] + 3, 62, HERO_AZ + 22, 26, 30];
const PR_IN: Key = [8.4, POOL[0] - 2.5, 0.5, POOL[1] + 7, 46, 62, 34, 30];
const PR_END: Key = [12.4, LANDING[0] + 0.5, 0.5, LANDING[1] - 2, 40, 84, 36, 30];
const WA_IN: Key = [13.8, WALL_C[0], 1, WALL_C[1], 74, 96, 40, 30];
const WA_END: Key = [18.4, WALL_C[0], 1, WALL_C[1], 64, 124, 42, 30];
const AR_IN: Key = [19.8, 6.8, 1, 17, 56, 128, 40, 30];
const AR_END: Key = [24.4, 6.5, 1, 12, 48, 150, 42, 30];
const CA_IN: Key = [25.8, NAKHONBAN[0] + 1, 1, NAKHONBAN[1] + 5, 60, 214, 40, 30];
const CA_END: Key = [30.4, NAKHONBAN[0] + 1, 1, NAKHONBAN[1] + 5, 52, 238, 40, 30];
const TR_IN: Key = [31.8, -5, 1, 12, 68, 252, 38, 30];
const TR_END: Key = [36.2, -5, 1, 13, 62, 272, 38, 30];
const GR_IN: Key = [37.6, 2, 1, -2, 150, 284, 38, 30];
const GR_END: Key = [42.4, 2, 1, -4, 172, 312, 36, 30];
const PAY_IN: Key = [44.0, POOL[0], 1.2, POOL[1], 40, 360 + HERO_AZ - 14, 30, 30];
const PAY_END: Key = [52.4, POOL[0], 1.0, POOL[1], 24, 360 + HERO_AZ + 4, 24, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1300,
  after: 2026,
  camera: [
    ...between(HERO_END, PR_IN, 4),
    ...between(PR_END, WA_IN, 4),
    ...between(WA_END, AR_IN, 4),
    ...between(AR_END, CA_IN, 4),
    ...between(CA_END, TR_IN, 4),
    ...between(TR_END, GR_IN, 4),
    ...between(GR_END, PAY_IN, 4, 0.2),
    ...between(PAY_END, [55.0, 4, 1, -6, 150, 410, 36, 30], 4),
    [55.0, 4, 1, -6, 150, 410, 36, 30],
    [60, 4, 1, -6, 230, 420, 36, 30],
  ],
  beats: [
    {
      // the cover: the river turns into a whirlpool and the image rises out of it, upright
      id: 'hero',
      kind: 'legend',
      t: [0, 7.4],
      year: {hold: 1600},
      caption: {t0: 3.3, title: 'พระผุดกลางน้ำป่าสัก', sub: 'ตำนานเล่าว่า ชาวบ้านพบพระพุทธมหาธรรมราชาที่วังมะขามแฟบ'},
      era: 'อยุธยา',
      camera: [
        [0, POOL[0], 4.9, POOL[1], 105, HERO_AZ, 28, 30],
        [3, POOL[0], 7.8, POOL[1], 85, HERO_AZ + 6, 20, 30],
        HERO_END,
      ],
    },
    {
      // the image on a raft, boats round it, down the Pa Sak to Wat Traiphum
      id: 'procession',
      kind: 'procession',
      t: [7.7, 12.6],
      year: [1600.45, 1604],
      caption: {t0: 7.5, title: 'อัญเชิญขึ้นวัดไตรภูมิ', sub: 'แห่ทางน้ำไปประดิษฐาน เป็นพระคู่บ้านคู่เมืองเพชรบูรณ์'},
      camera: [PR_IN, PR_END],
    },
    {
      // the Ayutthaya town: the brick wall goes up astride the river, four arrow-head forts.
      // Slow years: the houses inside come up over this beat
      id: 'wall',
      kind: 'build',
      t: [13.0, 18.6],
      year: [1660, 1684],
      caption: {t0: 12.8, title: 'กำแพงคร่อมแม่น้ำ', sub: 'สมัยอยุธยา (สันนิษฐานว่ารัชกาลพระนารายณ์) ป้อมหัวธนูสี่มุม ป่าสักไหลผ่านกลางเมือง'},
      camera: [WA_IN, WA_END],
    },
    {
      // 2370: the Siamese army takes the camp the Vientiane force set up at Phetchabun, then
      // marches on north to Lom Sak (Dr. Wisan Kositanon, after the Rama III chronicle; the
      // camp's site is not known: drawn south of the town)
      id: 'army',
      kind: 'fight',
      t: [19.0, 24.6],
      year: {hold: 1827},
      caption: {t0: 18.8, title: 'ศึกเจ้าอนุวงศ์', sub: 'พ.ศ. 2370 ทัพกรุงเทพฯ ตีค่ายที่เมืองเพชรบูรณ์แตก แล้วยกขึ้นไปหล่มสัก'},
      era: 'รัตนโกสินทร์',
      camera: [AR_IN, AR_END],
    },
    {
      // นครบาลเพชรบูรณ์: roads cut and timber halls put up across the plain west of the town,
      // then left when the House turned the bill down (July 2487)
      id: 'capital',
      kind: 'build',
      t: [25.0, 30.6],
      year: [1942.7, 1944.7],
      caption: {t0: 24.8, title: 'นครบาลเพชรบูรณ์', sub: 'พ.ศ. 2486 รัฐบาลจอมพล ป. เตรียมย้ายเมืองหลวงมา แต่สภาไม่อนุมัติใน 2487'},
      callouts: [{t0: 26.6, t1: 30.2, label: 'นครบาลเพชรบูรณ์', dx: -120, dy: -170, p: [NAKHONBAN[0], 1.2, NAKHONBAN[1]]}],
      camera: [CA_IN, CA_END],
    },
    {
      // the sweet-tamarind orchards on the plain and the trucks that carry them out
      id: 'tamarind',
      kind: 'trade',
      t: [31.0, 36.4],
      year: [1962, 1980],
      caption: {t0: 30.8, title: 'มะขามหวานเมืองเพชร', sub: 'สวนมะขามหวานเต็มที่ราบเชิงเขา รถบรรทุกขนออกไปทั่วประเทศ'},
      camera: [TR_IN, TR_END],
    },
    {
      id: 'growth',
      kind: 'grow',
      t: [36.8, 42.6],
      year: [1981, 2018],
      caption: {t0: 36.6, title: 'เมืองโตสองฝั่งป่าสัก', sub: 'เมืองขยายออกจากกำแพงเก่า สะพานข้ามน้ำ ถนนสายหลักผ่านกลางเมือง'},
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the governor holds the image in his arms and dips with it in the Pa Sak, at
      // the bend where it was found
      id: 'payoff',
      kind: 'celebrate',
      t: [43.0, 52.6],
      year: [2025, 2025.4],
      caption: {t0: 42.8, t1: 54.2, title: 'อุ้มพระดำน้ำ', sub: 'ทุกวันสารทไทย ผู้ว่าฯ อุ้มพระพุทธมหาธรรมราชาดำน้ำป่าสัก ที่วังมะขามแฟบ'},
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
