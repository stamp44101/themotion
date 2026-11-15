// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/phayao.md; the owner delegated the cover, storyline and stills gates to cloud's own
// recommendation, 15 Nov 2569): hero / paetpeng / abandon / refound / vihara / lake / province / grow / payoff / today.
// Held years: 2386 (Rama III re-founds Phayao), 2482 (the Fisheries Department gates the Ing; one source says 2484), 2520
// (the province); the counter lands on 2569. The Buddha's years (2034-2067, the temple's own history), the pact of the three
// kings (~1830, legend), the town's abandonment (no year) and Khruba Sriwichai's vihara (2465-2466, one source) are named in
// no caption: the counter does not hold them.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {GATE, MONUMENT, WAT_SI_KHOM_KHAM, WAT_TILOK} from './places';

type Key = CameraKey;
const [BX, BZ] = WAT_SI_KHOM_KHAM;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the legend-scale Buddha on its shore, seen from the east, the marsh where the Kwan will be behind it
const C0: Key = [0, BX, 34, BZ, 250, 100, 30, 30];
const C1: Key = [2.8, BX, 30, BZ, 252, 106, 31, 30];
// paetpeng: down to the Buddha at its real size, from the east, the people circling it
const PP_IN: Key = [4.6, BX, 1.0, BZ, 22, 118, 41, 30];
const PP_END: Key = [7.8, BX, 1.0, BZ, 19, 148, 41, 30];
// abandon: the wiang and the Buddha from the south-east as the people leave down the track
const AB_IN: Key = [10.0, 8.0, 1, 3.0, 36, 52, 42, 30];
const AB_END: Key = [13.6, 11.4, 1, 12.0, 34, 28, 42, 30];
// refound: the carts come up the track from the south into the wiang
const RF_IN: Key = [15.0, 12.0, 1, 9.0, 32, 70, 41, 30];
const RF_END: Key = [20.0, 5.0, 1, 0.8, 30, 98, 41, 30];
// vihara: back at Wat Si Khom Kham, the timber carried up from the shore and the new vihara over the Buddha
const VI_IN: Key = [21.6, -11.6, 1.0, -10.6, 26, 112, 41, 30];
const VI_END: Key = [26.0, BX, 1.0, BZ, 22, 150, 41, 30];
// lake: wide from the south-east over the gate, the lake bed filling behind it, Wat Tilok Aram going under
const LK_IN: Key = [27.8, 9.0, 1, 8.0, 30, 64, 41, 30];
const LK_END: Key = [33.0, -3.0, 1, 7.0, 58, 40, 40, 30];
// province: the parade on the shore road to the monument's park, from the lake side
const PR_IN: Key = [34.8, -1.0, 1, 2.0, 28, -12, 41, 30];
const PR_END: Key = [38.6, -4.4, 1, 0.2, 26, 22, 41, 30];
// the grow shot: the whole town from the east, spreading north and east along the trunk, swinging round to the south-east
const GR_IN: Key = [40.2, -6, 1, -6, 175, 96, 37, 30];
const GR_END: Key = [46.6, -4, 1, -8, 205, 138, 37, 30];
// the payoff: Paet Peng at Wat Si Khom Kham, the Buddha in its open vihara, boats with candles on the lake behind
const PB_IN: Key = [48.0, BX, 1.0, BZ, 26, 150, 40, 30];
const PB_END: Key = [54.0, BX, 1.0, BZ, 22, 118, 40, 30];
// the landing: the whole tile again at the cover's distance, now a town on the Kwan
const END: Key = [56.4, -14, 5, -4, 250, 100, 32, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1488,
  after: 2026,
  camera: [
    ...between(C1, PP_IN, 4),
    ...between(PP_END, AB_IN, 4),
    ...between(AB_END, RF_IN, 3),
    ...between(RF_END, VI_IN, 3),
    ...between(VI_END, LK_IN, 4, 0.2),
    ...between(LK_END, PR_IN, 4, 0.1),
    ...between(PR_END, GR_IN, 4, 0.1),
    ...between(GR_END, PB_IN, 4, 0.1),
    ...between(PB_END, END, 4),
    END,
    [60, -14, 5, -4, 262, 108, 32, 30],
  ],
  beats: [
    {
      // the cover (A1): the giant Buddha of Wat Si Khom Kham half built in brick; the head goes up, the stucco and the gold
      // go on by 3.4 s. The temple's history puts the build at 2034-2067: no year under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1488, 1491],
      camera: [C0, C1],
    },
    {
      // the Buddha finished, celebrated at the full moon of the eighth (Lanna) month: the first Paet Peng (approximate)
      id: 'paetpeng',
      kind: 'celebrate',
      t: [3.0, 8.5],
      year: [1492, 1524],
      caption: {t0: 3.2, title: 'พระเจ้าตนหลวงเสร็จ', sub: 'ก่ออิฐถือปูนราว 33 ปี ฉลองวันเพ็ญเดือนแปด'},
      era: 'ล้านนา',
      camera: [PP_IN, PP_END],
    },
    {
      // the wars with Burma: the town is deserted and the forest takes the wiang back (no year)
      id: 'abandon',
      kind: 'disaster',
      t: [8.5, 14.0],
      year: [1525, 1842],
      caption: {t0: 8.6, title: 'ศึกพม่า เมืองพะเยาร้าง', sub: 'ผู้คนหนีศึก ป่ากลับคลุมเวียงอีกครั้ง'},
      camera: [AB_IN, AB_END],
    },
    {
      // 2386: Rama III re-founds Phayao with Chiang Rai and Ngao as a frontier town against the Burmese in Chiang Saen
      id: 'refound',
      kind: 'arrive',
      t: [14.0, 20.5],
      year: {hold: 1843},
      caption: {t0: 14.1, title: 'ร.3 ตั้งเมืองพะเยาขึ้นใหม่', sub: 'ผู้คนกลับเข้าเวียง เป็นเมืองหน้าด่านกันพม่า'},
      era: 'รัตนโกสินทร์',
      camera: [RF_IN, RF_END],
    },
    {
      // Khruba Sriwichai leads the rebuilding of the vihara over the Buddha (2465-2466, one source: no year)
      id: 'vihara',
      kind: 'build',
      t: [20.5, 26.6],
      year: [1844, 1925],
      caption: {t0: 20.6, title: 'ครูบาศรีวิชัยสร้างวิหารใหม่', sub: 'ชาวบ้านแบกไม้ ยกวิหารครอบพระเจ้าตนหลวง'},
      callouts: [{label: 'พระเจ้าตนหลวง', dx: 130, dy: -160, p: [BX, 2.6, BZ], t0: 23.6, t1: 26.2}],
      camera: [VI_IN, VI_END],
    },
    {
      // 2482: the Fisheries Department gates the Ing at the lake's outlet; the marsh, fields, houses and temples flood into
      // the Kwan; Wat Tilok Aram goes under
      id: 'lake',
      kind: 'disaster',
      t: [26.6, 33.6],
      year: {hold: 1939},
      caption: {t0: 26.7, title: 'กั้นแม่อิง เกิดกว๊านพะเยา', sub: 'กรมประมงทำประตูน้ำ น้ำท่วมทุ่ง วัดติโลกอารามจม'},
      era: 'ปัจจุบัน',
      callouts: [
        {label: 'ประตูน้ำ', dx: 120, dy: -150, p: [GATE[0], 0.8, GATE[1]], t0: 27.4, t1: 29.6},
        {label: 'วัดติโลกอาราม', dx: -130, dy: -160, p: [WAT_TILOK[0], 1.0, WAT_TILOK[1]], t0: 30.4, t1: 33.2},
      ],
      camera: [LK_IN, LK_END],
    },
    {
      // 2520: Phayao made a province, split from Chiang Rai (the 72nd)
      id: 'province',
      kind: 'procession',
      t: [33.6, 39.4],
      year: {hold: 1977},
      caption: {t0: 33.7, title: 'ตั้งจังหวัดพะเยา', sub: 'แยกจากเชียงราย เป็นจังหวัดที่ 72'},
      callouts: [{label: 'อนุสาวรีย์พญางำเมือง', dx: -130, dy: -160, p: [MONUMENT[0], 1.2, MONUMENT[1]], t0: 36.6, t1: 39.0}],
      camera: [PR_IN, PR_END],
    },
    {
      // the grow shot: the town spreads north and east along ถนนพหลโยธิน
      id: 'grow',
      kind: 'grow',
      t: [39.4, 47.2],
      year: [1978, 2018],
      caption: {t0: 39.5, title: 'เมืองโตริมกว๊าน', sub: 'ขยายขึ้นเหนือและตะวันออกตามถนนพหลโยธิน'},
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: Paet Peng at Wat Si Khom Kham; the cover's Buddha in its vihara; boats with candles on the Kwan
      id: 'payoff',
      kind: 'celebrate',
      t: [47.2, 54.4],
      year: [2019, 2025.5],
      caption: {t0: 47.3, t1: 53.8, title: 'ประเพณีแปดเป็ง', sub: 'นมัสการพระเจ้าตนหลวง ทุกปีช่วงวิสาขบูชา'},
      callouts: [{label: 'พระเจ้าตนหลวง', dx: 130, dy: -160, p: [BX, 2.6, BZ], t0: 49.6, t1: 53.6}],
      camera: [PB_IN, PB_END],
    },
    {id: 'today', kind: 'today', t: [54.6, 56.4], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
