// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/nan.md and the Gemini
// research, spot-checked (PR #70). The story is a town that moved with its river: down from
// Pua by boat, onto the Chae Haeng rise, across the water behind the white bull, north after
// the flood, back south when the river swung east. The hero is the naga race boat (owner,
// 25 Oct 2026): it brings the settlers down at frame 0 and races under the bridge at the end.
// 75 s: the extra time goes to the siege, the flood and the return (CLAUDE.md, 60/75 rule).
import {buildStory} from '../../engine/story';
import {between, type CameraKey} from '../../engine/glide';
import {AIRFIELD, CHAE_HAENG, PHUMIN} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]
const HERO_END: Key = [7.2, 8.5, 2, -2.5, 100, -20, 32, 30];
const CH_IN: Key = [8.9, CHAE_HAENG[0] - 1, 1, CHAE_HAENG[1] - 1, 70, 42, 42, 30];
const CH_END: Key = [12.0, CHAE_HAENG[0] - 1, 1, CHAE_HAENG[1] - 1, 64, 62, 42, 30];
const BU_IN: Key = [13.6, 20, 1, 16, 92, 76, 40, 30];
const BU_END: Key = [18.3, 3, 1, 1, 86, 110, 42, 30];
const SI_IN: Key = [20.1, -17, 1, -2, 80, 150, 40, 30];
const SI_END: Key = [24.4, -11, 1, -2, 74, 176, 42, 30];
const PH_IN: Key = [26.2, PHUMIN[0], 1, PHUMIN[1], 30, 236, 38, 30];
const PH_END: Key = [30.2, PHUMIN[0], 1, PHUMIN[1], 26, 256, 36, 30];
const RA_IN: Key = [32.0, 7.2, 1, -1, 48, 270, 36, 30];
const RA_END: Key = [36.2, 7.2, 1, 1, 44, 286, 36, 30];
const FL_IN: Key = [38.0, 2, 1, -8, 96, 296, 46, 30];
const FL_END: Key = [42.8, 9, 1, -22, 104, 312, 46, 30];
const RE_IN: Key = [44.6, 8, 1, -12, 104, 322, 46, 30];
const RE_END: Key = [49.4, 3, 1, -1, 82, 338, 46, 30];
const PL_IN: Key = [51.0, AIRFIELD[0], 2, AIRFIELD[1] + 1, 62, 352, 32, 30];
const PL_END: Key = [54.8, AIRFIELD[0], 1, AIRFIELD[1] + 3, 52, 370, 32, 30];
const GR_IN: Key = [56.6, 10, 1, 9, 185, 388, 38, 30];
const GR_END: Key = [61.2, 12, 1, 10, 205, 408, 36, 30];
const PAY_IN: Key = [63.2, 21, 1, -10.5, 58, 430, 30, 30];
const PAY_END: Key = [69.4, 15, 1, -2, 46, 450, 28, 30];

export const STORY = buildStory({
  duration: 75,
  standard: 1,
  before: 1300,
  after: 2026,
  camera: [
    ...between(HERO_END, CH_IN, 4, 0.3),
    ...between(CH_END, BU_IN, 4),
    ...between(BU_END, SI_IN, 4),
    ...between(SI_END, PH_IN, 4),
    ...between(PH_END, RA_IN, 4),
    ...between(RA_END, FL_IN, 4),
    ...between(FL_END, RE_IN, 4),
    ...between(RE_END, PL_IN, 4, 0.2),
    ...between(PL_END, GR_IN, 4, 0.2),
    ...between(GR_END, PAY_IN, 4, 0.2),
    [73.4, 4, 2, 4, 220, 470, 36, 30],
    [75, 4, 2, 4, 300, 482, 36, 30],
  ],
  beats: [
    {
      // the cover: the naga boat leads the settlers' boats down the Nan from Pua, at high water
      id: 'hero',
      kind: 'procession',
      t: [0, 7.4],
      year: {hold: 1359},
      caption: {t0: 3.3, title: 'ล่องน้ำน่านลงจากเมืองปัว', sub: 'ตามพงศาวดาร พญาการเมืองพาผู้คนลงมาตั้งเมืองใหม่'},
      era: 'ราชวงศ์ภูคา',
      camera: [
        [0, 17, 2, -12, 320, -55, 40, 30],
        [3, 20, 2, -12, 160, -45, 35, 30],
        HERO_END,
      ],
    },
    {
      // Wiang Phu Phiang Chae Haeng: a moat round the rise, the chedi on top. Slow years: the
      // villages and paddies come in over this beat, not in the gap
      id: 'chaehaeng',
      kind: 'build',
      t: [7.7, 12.2],
      year: [1359.45, 1367.5],
      caption: {t0: 7.5, title: 'เวียงภูเพียงแช่แห้ง', sub: 'คูน้ำคันดินล้อมเนิน พระธาตุแช่แห้งกลางเวียง ฝั่งตะวันออกของน้ำน่าน'},
      callouts: [{t0: 9.4, t1: 12.0, label: 'พระธาตุแช่แห้ง', dx: 120, dy: -170, p: [CHAE_HAENG[0], 2.2, CHAE_HAENG[1]]}],
      camera: [CH_IN, CH_END],
    },
    {
      // 1911: the rise runs dry; the white bull wades the river and the log wall goes up
      // round the new town behind it
      id: 'bull',
      kind: 'legend',
      t: [12.5, 18.5],
      year: {hold: 1368},
      caption: {t0: 12.3, title: 'ตามรอยโคอุศุภราช', sub: 'ตำนานว่า พ.ศ. 1911 พญาผากองข้ามน้ำมาสร้างเวียงตามรอยโคขาว'},
      camera: [BU_IN, BU_END],
    },
    {
      // 1993: Tilokaraj of Chiang Mai takes Nan for its salt wells
      id: 'siege',
      kind: 'fight',
      t: [18.9, 24.6],
      // not a hold: the town's houses go up as the army comes (the engine grows a house over
      // 6 years); พ.ศ. 1993 stays on the counter for just over a second
      year: [1446.6, 1452.2],
      caption: {t0: 18.7, title: 'ศึกชิงเมืองบ่อเกลือ', sub: 'พ.ศ. 1993 ตามพงศาวดาร พระเจ้าติโลกราชยกทัพจากเชียงใหม่มายึดน่าน'},
      era: 'ล้านนา',
      camera: [SI_IN, SI_END],
    },
    {
      // 2139: Wat Phumin's cruciform hall on its naga pair
      id: 'phumin',
      kind: 'build',
      t: [25.0, 30.4],
      year: {hold: 1596},
      caption: {t0: 24.8, title: 'วัดภูมินทร์บนหลังนาค', sub: 'พ.ศ. 2139 โบสถ์จัตุรมุขบนพญานาคคู่ ภาพปู่ม่านย่าม่านวาดภายหลัง'},
      camera: [PH_IN, PH_END],
    },
    {
      // the ออกพรรษา races along the town front, in the channel under the east wall
      id: 'race',
      kind: 'celebrate',
      t: [30.8, 36.4],
      year: [1800, 1804],
      caption: {t0: 30.6, title: 'แข่งเรือออกพรรษา', sub: 'ราว พ.ศ. 2343 มีบันทึกการแข่งเรือคู่งานตานก๋วยสลาก'},
      era: 'ประเทศราชสยาม',
      camera: [RA_IN, RA_END],
    },
    {
      // 2360: the flood breaks the log wall; the town walks north to Wiang Nuea
      id: 'flood',
      kind: 'disaster',
      t: [36.8, 43.0],
      year: {hold: 1817},
      caption: {t0: 36.6, title: 'น้ำหลากพังกำแพงซุง', sub: 'พ.ศ. 2360 ผู้คนย้ายขึ้นไปตั้งเวียงเหนือบนที่ดอน'},
      camera: [FL_IN, FL_END],
    },
    {
      // 2398: the river has swung east; the town comes back south and the brick wall goes up
      id: 'return',
      kind: 'procession',
      t: [43.4, 49.6],
      // the houses come back over 4 years: the curve runs slowly (พ.ศ. 2398 on the counter ~1 s)
      year: [1854.6, 1860],
      caption: {t0: 43.2, title: 'กลับเวียงใต้ ก่อกำแพงอิฐ', sub: 'พ.ศ. 2398 น้ำน่านเบี่ยงไปตะวันออก เจ้าอนันตวรฤทธิเดชย้ายเมืองกลับ'},
      camera: [RE_IN, RE_END],
    },
    {
      // ~2470: the first aircraft on the field the people of Nan cleared at Wiang Nuea
      id: 'plane',
      kind: 'arrive',
      t: [50.0, 55.0],
      year: {hold: 1927},
      caption: {t0: 49.8, title: 'เครื่องบินลงเมืองน่าน', sub: 'ชาวน่านถางป่าทำสนามบินเอง เปิดใช้ราว พ.ศ. 2470 ก่อนมีถนนเข้าเมือง'},
      era: 'รัตนโกสินทร์',
      camera: [PL_IN, PL_END],
    },
    {
      // the road from Phrae, the bridges, the town over both banks
      id: 'growth',
      kind: 'grow',
      t: [55.4, 61.4],
      year: [1928, 2017],
      caption: {t0: 55.2, title: 'เมืองโตสองฝั่งน้ำ', sub: 'ทางหลวงจากแพร่ สะพานข้ามน้ำน่าน เมืองขยายไปสองฝั่ง'},
      era: 'ปัจจุบัน',
      callouts: [{t0: 58.6, t1: 61.2, label: 'พระธาตุแช่แห้ง', dx: 110, dy: -150, p: [CHAE_HAENG[0], 2.2, CHAE_HAENG[1]]}],
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the naga boats race under the main bridge, the hero boat in the lead
      id: 'payoff',
      kind: 'celebrate',
      t: [61.8, 69.6],
      year: [2025, 2025.4],
      caption: {t0: 61.6, t1: 70.8, title: 'แข่งเรือลือเลื่อง', sub: 'ทุกออกพรรษา เรือหัวพญานาคชิงชัยกลางน้ำน่าน หน้าตัวเมือง'},
      camera: [PAY_IN, PAY_END],
    },
    {id: 'today', kind: 'today', t: [69.8, 70.8], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
export const SOUND_EVENTS = {trains: [] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[]};
