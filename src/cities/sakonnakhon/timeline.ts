// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/sakonnakhon.md (Gemini's research and
// [local]'s map, cross-checked on the web by cloud on 4-5 Nov 2026). Hybrid loop (owner, 4 Nov): the owner picked
// the cover, A1 (a giant cloth dyed indigo in the first seconds, white -> green -> blue, the tied pattern left
// white), and passes the 0-6 s stills before the render. The hero comes back as the indigo cloth hung over the
// wax-castle procession.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {CLOCK, HERO_AT, HERO_S, LEGEND_AT, PHU_PHAN} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
const [HX, HZ] = HERO_AT;
const HERO_END: Key = [6.0, HX - 5, 12, HZ - 2, 170, 34, 30, 30];
const SK_IN: Key = [7.6, LEGEND_AT[0], 1, LEGEND_AT[1], 100, 42, 36, 30];
const SK_END: Key = [11.4, LEGEND_AT[0] - 1, 1, LEGEND_AT[1] - 1, 84, 56, 38, 30];
// the Khmer town from over the lake (east), the Khom bridge beyond it
const KH_IN: Key = [12.4, -2, 1, -2, 62, 72, 36, 30];
const KH_END: Key = [16.8, -3, 1, -3, 54, 92, 36, 30];
const LX_IN: Key = [17.8, 0, 2.6, 0, 34, 112, 30, 30];
const LX_END: Key = [21.8, 0, 2.6, 0, 30, 132, 32, 30];
// the town emptied: the column led away south, seen from the north down the road
const LV_IN: Key = [22.8, -1.5, 1, 10, 66, 158, 36, 30];
const LV_END: Key = [26.8, -2.5, 1, 16, 70, 178, 36, 30];
// the Tai Yo coming down the west shore from the north
const AR_IN: Key = [27.8, 3, 1, -24, 72, 198, 34, 30];
const AR_END: Key = [32.8, 2, 1, -10, 64, 218, 36, 30];
// the rafts round the lake's west side to the north shore
const CR_IN: Key = [33.8, 9, 1, -12, 70, 232, 38, 30];
const CR_END: Key = [36.8, 23, 1, -54, 58, 248, 36, 30];
const CR_HOLD: Key = [38.2, 23, 1, -54, 54, 254, 36, 30];
// the Phu Phan hills at night: parachutes
const DR_IN: Key = [40.6, PHU_PHAN[0] + 4, 6, PHU_PHAN[1] - 4, 82, 266, 30, 30];
const DR_END: Key = [43.6, PHU_PHAN[0] + 4, 6, PHU_PHAN[1] - 4, 76, 286, 32, 30];
// the grow shot: the whole tile
const GR_IN: Key = [44.6, 4, 1, -4, 170, 300, 34, 30];
const GR_END: Key = [48.4, 4, 1, -4, 200, 334, 34, 30];
// the procession at the stupa
const PY_IN: Key = [50.4, CLOCK[0] + 3, 1.6, CLOCK[1] - 1, 46, 352, 34, 30];
const PY_END: Key = [53.0, CLOCK[0] + 4, 1.6, CLOCK[1] - 1.5, 38, 366, 32, 30];
// the landing: the whole tile again, the town and the lake
const END: Key = [55.2, 8, 1, -4, 260, 392, 33, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: -520,
  after: 2026,
  camera: [
    ...between(HERO_END, SK_IN, 4, 0.1),
    ...between(SK_END, KH_IN, 4),
    ...between(KH_END, LX_IN, 4),
    ...between(LX_END, LV_IN, 4),
    ...between(LV_END, AR_IN, 4),
    ...between(AR_END, CR_IN, 4),
    CR_HOLD,
    ...between(CR_HOLD, DR_IN, 4),
    ...between(DR_END, GR_IN, 4),
    ...between(GR_END, PY_IN, 4, 0.2),
    ...between(PY_END, END, 4),
    END,
    [60, 8, 1, -4, 280, 400, 33, 30],
  ],
  beats: [
    {
      // the cover (owner's pick A1): a giant undyed cloth with its foot in a giant indigo pot on the plain where the
      // lake will be; the dye climbs it green and turns blue behind, leaving the tied pattern white (Gemini §2, the GI
      // dyers: cloth lifted from the หม้อนิล is yellow-green and blues in the air within seconds)
      id: 'hero',
      kind: 'legend',
      t: [0, 6.4],
      year: [-520, -500],
      caption: {t0: 3.3, title: 'ผ้าครามสกลนคร', sub: 'ยกจากหม้อนิลเป็นสีเขียว โดนลมกลายเป็นคราม'},
      era: 'ตำนาน',
      camera: [
        [0, HX, 2.75 * HERO_S, HZ, 300, 18, 20, 30],
        [3, HX, 2.8 * HERO_S, HZ, 306, 24, 21, 30],
        HERO_END,
      ],
    },
    {
      // ตำนาน (Urangkhathat and the folk tale): the town of หนองหารหลวง sinks and the lake rises; the widow's house
      // stays as ดอนสวรรค์. Named เมืองหนองหารหลวง, never เอกชะทีตา (Udon's Kumphawapi tells the same tale; Gemini §5)
      id: 'sink',
      kind: 'disaster',
      t: [6.8, 11.6],
      year: [-500, -480],
      caption: {t0: 6.6, title: 'ตำนานหนองหารหลวง', sub: 'พญานาคถล่มเมืองจมลงเป็นหนองหาร เหลือเพียงเกาะดอนสวรรค์'},
      camera: [SK_IN, SK_END],
    },
    {
      // the Khmer town (Baphuon-Angkor Wat, พุทธศตวรรษที่ 16-17): the double moat, the laterite prasat at the centre
      // (inscription สน.1 / K.369), the Khom bridge and the baray; a Brahmin procession over the bridge
      id: 'khmer',
      kind: 'build',
      t: [12, 17.2],
      year: [1000, 1100],
      caption: {t0: 11.8, title: 'เมืองขอมริมหนองหาร', sub: 'คูน้ำสองชั้น ปราสาทศิลาแลง และสะพานขอมสิบเอ็ดช่อง'},
      era: 'ขอม',
      camera: [KH_IN, KH_END],
    },
    {
      // Lan Xang: the lotus-bud stupa closes over the prasat (the structure is ยืนยัน; ~2109 is from the chronicle, so
      // no year on screen)
      id: 'lanxang',
      kind: 'arrive',
      t: [17.6, 22.2],
      year: [1560, 1580],
      caption: {t0: 17.4, title: 'พระธาตุเชิงชุม', sub: 'เจดีย์ล้านช้างสร้างครอบปราสาทขอมไว้ข้างใน'},
      era: 'ล้านช้าง',
      camera: [LX_IN, LX_END],
    },
    {
      // after the Anouvong war (2370): the governor of สกลทวาปี failed to fight; most of the people were taken south to
      // Kabin Buri, only the ข้าพระธาตุ stayed. No execution is shown. Sakon Thawapi's own year is disputed: not named
      id: 'leave',
      kind: 'procession',
      t: [22.6, 27.2],
      year: {hold: 1827},
      caption: {t0: 22.4, title: 'หลังศึกเจ้าอนุวงศ์', sub: 'พ.ศ. 2370 ชาวเมืองถูกกวาดต้อนลงใต้ เหลือเพียงข้าพระธาตุ'},
      era: 'รัตนโกสินทร์',
      camera: [LV_IN, LV_END],
    },
    {
      // 17 Aug 2381 (จ.ศ. 1200): Ratchawong (Kham) brings the Tai Yo from Maha Chai Kong Kaeo; made พระยาประจันต-
      // ประเทศธานี, the town renamed เมืองสกลนคร (ipthailand GI document; Dailynews; Gemini §1)
      id: 'arrive',
      kind: 'arrive',
      t: [27.6, 33.2],
      year: {hold: 1838},
      caption: {t0: 27.4, title: 'เมืองสกลนคร', sub: '17 ส.ค. 2381 ราชวงศ์ (คำ) พาชาวไทญ้อมาตั้งเมืองใหม่'},
      camera: [AR_IN, AR_END],
    },
    {
      // 2427 (1884): ~40 Catholic families raft across Nong Han with Fr. Xavier Guego and Khru Than to the north shore:
      // Ban Tha Rae, a grid plan and a church (ThaiJO; Chula thesis; silpa-mag)
      id: 'cross',
      kind: 'procession',
      t: [33.6, 38.2],
      year: {hold: 1884},
      caption: {t0: 33.4, title: 'ล่องแพข้ามหนองหาร', sub: 'พ.ศ. 2427 ชาวคาทอลิกราว 40 ครอบครัวตั้งบ้านท่าแร่ฝั่งเหนือ'},
      camera: [CR_IN, CR_END],
    },
    {
      // 2487-88: Seri Thai under Tiang Sirikhan in the Phu Phan hills; Allied planes drop supplies by parachute. Planes
      // do not land at the cave (Gemini §5)
      id: 'drop',
      kind: 'arrive',
      t: [39.4, 43.8],
      year: {hold: 1944},
      caption: {t0: 39.2, title: 'เสรีไทยบนภูพาน', sub: 'พ.ศ. 2487 เครื่องบินทิ้งร่มอาวุธลงเหนือเทือกเขา'},
      camera: [DR_IN, DR_END],
    },
    {
      // the grow shot: the town spreads west along ถ.นิตโย, the hall (2507, 2541), the airport (2528)
      id: 'grow',
      kind: 'grow',
      t: [44.2, 49.2],
      year: [1950, 2017],
      caption: {t0: 44.0, title: 'เมืองครามริมหนองหาร', sub: 'เมืองขยายตามถนนนิตโย ศูนย์ราชการ และสนามบิน'},
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: Ok Phansa (20-26 Oct 2569): the golden wax castles roll from the clock tower to the stupa, dancers
      // in indigo; the hero cloth hangs again over the route
      id: 'payoff',
      kind: 'celebrate',
      t: [49.6, 53.0],
      year: [2025, 2025.4],
      caption: {t0: 49.4, t1: 54.2, title: 'แห่ปราสาทผึ้ง', sub: 'คืนออกพรรษา ปราสาทผึ้งสีทองแห่สู่พระธาตุเชิงชุม'},
      camera: [PY_IN, PY_END],
    },
    {id: 'today', kind: 'today', t: [53.4, 54.6], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

const [pl0] = STORY.at('drop');
const [gr0, gr1] = STORY.at('grow');
export const SOUND_EVENTS = {
  // the C-47s over Phu Phan, and the airliner landing in the grow shot
  planes: [pl0 + 0.3, pl0 + 1.9],
  airliner: gr0 + (gr1 - gr0) * 0.55,
};
