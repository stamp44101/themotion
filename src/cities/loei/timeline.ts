// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/loei.md; the owner delegated the call, 20 Nov 2569): hero / oath / frontier / loei / wax /
// kradueng / grow / fest / today. On the counter: 2103 -> 2106 (Phra That Si Song Rak, the inscription's จ.ศ. 922-925; each
// year about 1.6 s), 2396 held (Ban Hae raised to เมืองเลย), 2505 held (Phu Kradueng national park); it lands on 2569. The
// pact's c. 1556 (en.wiki only), Mouhot's 2404, Rama IX's climb of 2498 and the 2478 registration are named in no sub.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {BAN_HAE, COVER_AZ, FAIR, HERO_AT, KRADUENG, KRADUENG_H, LOEI, STUPA} from './places';

type Key = CameraKey;
const HC: [number, number] = [HERO_AT[0] - 4, HERO_AT[1] + 4];
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the giant on the whole tile, seen from the south-south-east, the town and the stupa to its left
const C0: Key = [0, HC[0], 20, HC[1], 300, COVER_AZ, 34, 30];
const C1: Key = [2.8, HC[0], 19, HC[1], 285, COVER_AZ + 4, 34, 30];
// oath: the stupa inside the Man's bend, from the south-east; Ayutthaya's column in from the west, Lan Xang's from the north
const OA_IN: Key = [4.4, STUPA[0] - 0.8, 1, STUPA[1] - 0.4, 34, 34, 42, 30];
const OA_END: Key = [9.2, STUPA[0] - 0.4, 1, STUPA[1] - 0.2, 26, 52, 42, 30];
// frontier: down the valley behind the caravans, from the north-north-east, the town and the stupa beyond
const FR_IN: Key = [10.6, -3.6, 1, -13.0, 34, 160, 46, 30];
const FR_END: Key = [15.2, -2.8, 1, -6.0, 32, 176, 46, 30];
// loei (far place): Ban Hae on its stream, from the south-west
const LO_IN: Key = [16.8, BAN_HAE[0] - 0.4, 1, BAN_HAE[1] + 0.4, 36, -24, 40, 30];
const LO_END: Key = [21.2, LOEI[0] - 1.2, 1, LOEI[1] - 1.0, 30, -6, 40, 30];
// wax: the procession from Wat Phon Chai to the stupa, from the south
const WA_IN: Key = [22.8, -3.6, 1, 3.6, 34, 14, 42, 30];
const WA_END: Key = [27.2, -7.4, 1, 5.4, 28, -14, 42, 30];
// kradueng (far place): the west face and the climb, from the west-south-west, then up to the rim
const KR_IN: Key = [28.8, KRADUENG[0] - 6, 2.5, KRADUENG[1], 40, -62, 34, 30];
const KR_END: Key = [33.6, KRADUENG[0] - 4, KRADUENG_H * 0.8, KRADUENG[1], 34, -40, 36, 30];
// the grow shot: the whole valley from the south, swinging round to the south-east
const GR_IN: Key = [35.4, 4, 1, -2, 175, 8, 37, 30];
const GR_END: Key = [43.6, 6, 1, -4, 205, 36, 37, 30];
// fest: the festival ground from the north-west, Phu Kradueng's plateau far behind
const FE_IN: Key = [45.4, FAIR[0] - 1.6, 5.5, FAIR[1] + 2.0, 54, -128, 31, 30];
const FE_END: Key = [53.8, FAIR[0] - 1.0, 5.0, FAIR[1] + 2.0, 48, -104, 31, 30];
// the landing: the whole tile again at the cover's distance, now a town in its valley
const END: Key = [56.6, HC[0], 19, HC[1], 300, -14, 34, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1555,
  after: 2026,
  camera: [
    ...between(C1, OA_IN, 4),
    ...between(OA_END, FR_IN, 3),
    ...between(FR_END, LO_IN, 3, 0.4),
    ...between(LO_END, WA_IN, 3, 0.4),
    ...between(WA_END, KR_IN, 3, 0.4),
    ...between(KR_END, GR_IN, 4, 0.1),
    ...between(GR_END, FE_IN, 4, 0.1),
    ...between(FE_END, END, 5),
    END,
    [60, HC[0], 19, HC[1], 310, -8, 34, 30],
  ],
  beats: [
    {
      // the cover (A1): a giant Phi Ta Khon on the valley floor north-east of town, half made; no counter under the title
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1555, 1556],
      camera: [C0, C1],
    },
    {
      // 2103-2106 (จ.ศ. 922-925): Ayutthaya (Maha Chakkraphat) and Lan Xang (Setthathirat) build Phra That Si Song Rak on
      // the Man as the witness of their friendship
      id: 'oath',
      kind: 'procession',
      t: [3.0, 9.5],
      year: [1560, 1563.45],
      caption: {t0: 3.2, title: 'อยุธยา–ล้านช้างผูกไมตรี', sub: 'ร่วมสร้างพระธาตุศรีสองรัก ริมลำน้ำหมัน'},
      era: 'อยุธยา',
      callouts: [{label: 'พระธาตุศรีสองรัก', dx: 120, dy: -170, p: [STUPA[0], 2.4, STUPA[1]], t0: 6.6, t1: 9.2}],
      camera: [OA_IN, OA_END],
    },
    {
      // Dan Sai between the two kingdoms: caravans of pack oxen through the valley, the town fills in (no year)
      id: 'frontier',
      kind: 'trade',
      t: [9.5, 15.5],
      year: [1564, 1840],
      caption: {t0: 9.6, title: 'ด่านซ้าย ด่านกลางหุบเขา', sub: 'กองวัวต่างเดินทางผ่านลำน้ำหมัน'},
      camera: [FR_IN, FR_END],
    },
    {
      // 2396: Rama IV raises Ban Hae on the Huai Nam Man to เมืองเลย, named after the river
      id: 'loei',
      kind: 'build',
      t: [15.5, 21.5],
      year: {hold: 1853},
      caption: {t0: 15.6, title: 'ร.4 ตั้งเมืองเลย', sub: 'ยกบ้านแฮ่ริมห้วยน้ำหมานเป็นเมือง'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'เมืองเลย', dx: 120, dy: -160, p: [LOEI[0], 1.4, LOEI[1]], t0: 18.4, t1: 21.2}],
      camera: [LO_IN, LO_END],
    },
    {
      // the wax castles (ต้นผึ้ง) carried to the stupa on the 15th waxing of month 6 (a tradition: no year)
      id: 'wax',
      kind: 'procession',
      t: [21.5, 27.5],
      year: [1854, 1954],
      caption: {t0: 21.6, title: 'แห่ต้นผึ้งถวายพระธาตุ', sub: 'ขึ้น 15 ค่ำ เดือน 6 ทุกปี'},
      camera: [WA_IN, WA_END],
    },
    {
      // 23 Nov 2505: Phu Kradueng becomes Thailand's second national park
      id: 'kradueng',
      kind: 'arrive',
      t: [27.5, 34.0],
      year: {hold: 1962},
      caption: {t0: 27.6, title: 'ภูกระดึง อุทยานแห่งชาติ', sub: 'แห่งที่ 2 ของไทย ยอดภูราบราว 60 ตร.กม.'},
      era: 'ปัจจุบัน',
      callouts: [{label: 'ภูกระดึง', dx: 120, dy: -160, p: [KRADUENG[0], KRADUENG_H + 1, KRADUENG[1]], t0: 30.6, t1: 33.6}],
      camera: [KR_IN, KR_END],
    },
    {
      // the grow shot: the town spreads east along ทล.2013 toward Loei and north up the valley
      id: 'grow',
      kind: 'grow',
      t: [34.0, 44.0],
      year: [1963, 2016],
      caption: {t0: 34.1, title: 'ด่านซ้ายโตตามถนน', sub: 'ออกจากหุบน้ำหมาน ไปทางเมืองเลย'},
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: Bun Luang, the streets full of Phi Ta Khon, the cover's giant back on the festival ground
      id: 'fest',
      kind: 'celebrate',
      t: [44.2, 54.2],
      year: [2017, 2025.5],
      caption: {t0: 44.3, t1: 53.6, title: 'ผีตาโขนเต็มเมือง', sub: 'งานบุญหลวง ผีป่าออกมาส่งพระเวสกลับเมือง'},
      callouts: [{label: 'ผีตาโขน', dx: -130, dy: -170, p: [-5.6, 7.4, -5.4], t0: 47.0, t1: 53.4}],
      camera: [FE_IN, FE_END],
    },
    {id: 'today', kind: 'today', t: [54.4, 56.6], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
