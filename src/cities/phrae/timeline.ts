// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/phrae.md; the owner delegated the pick to cloud, 18 Nov 2569): hero / shan / rail / teak /
// chohae / grow / mohom / fair / today. Held years: 2445 (the Shan take Phrae, 25 Jul; en.wikipedia "Ngiao rebellion") and
// 2455 (the first train at Den Chai, 15 Nov; th.wikipedia สถานีรถไฟเด่นชัย); the counter lands on 2569. The teak companies'
// years (1887 or the 1890s by source), Kruba Sriwichai's restoration of Cho Hae (2467, one unsourced wiki + one snippet) and
// Wongburi's years (2440-2443, unsourced wiki) are named in no caption: the counter does not hold them.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {CHOHAE, DENCHAI, GABLE_AT, GATE_CHAI, LANDING, OLD_TOWN, THUNGHONG, WONGBURI} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the gable on the whole tile, seen from the south-south-east, the old town on the Yom to its left
const C0: Key = [0, GABLE_AT[0] - 4, 8, GABLE_AT[1] + 2, 285, 18, 32, 30];
const C1: Key = [2.8, GABLE_AT[0] - 6, 7, GABLE_AT[1] + 3, 262, 14, 33, 30];
// shan: down to ประตูชัย from the south-south-east, the Shan coming in from the fields and the town behind the gate
const SH_IN: Key = [4.4, GATE_CHAI[0] - 0.4, 0.5, GATE_CHAI[1] + 0.4, 30, 26, 42, 30];
const SH_END: Key = [9.2, GATE_CHAI[0] + 0.2, 0.5, GATE_CHAI[1] + 0.8, 30, 46, 42, 30];
// rail (far place): Den Chai from the south, the train coming in from the west
const RA_IN: Key = [10.8, DENCHAI[0] - 2.0, 1, DENCHAI[1] + 0.6, 32, 8, 40, 30];
const RA_END: Key = [15.2, DENCHAI[0] - 0.6, 1, DENCHAI[1] + 0.8, 27, -12, 40, 30];
// teak: the elephants' landing on the Yom, from the east bank, following the rafts down
const TE_IN: Key = [16.8, LANDING[0] + 1.0, 0.5, LANDING[1] + 0.5, 32, 64, 41, 30];
const TE_END: Key = [21.6, LANDING[0] + 2.8, 0.5, LANDING[1] + 5.0, 31, 88, 42, 30];
// chohae (far place): the hill from the south-west, the stair on its west side
const CH_IN: Key = [23.4, CHOHAE[0] - 0.8, 2.2, CHOHAE[1] - 0.2, 32, -34, 38, 30];
const CH_END: Key = [27.6, CHOHAE[0] - 0.6, 2.4, CHOHAE[1] - 0.2, 26, -54, 38, 30];
// the grow shot: the whole town from the south, spreading east past the main road to the airport, swinging to the south-east
const GR_IN: Key = [29.6, 9, 1, 3, 178, 8, 36, 30];
const GR_END: Key = [36.0, 13, 1, 5, 205, 38, 36, 30];
// mo hom: Ban Thung Hong's drying lines, from the south
const MO_IN: Key = [38.0, THUNGHONG[0], 0.5, THUNGHONG[1], 30, 16, 41, 30];
const MO_END: Key = [44.0, THUNGHONG[0] - 0.4, 0.5, THUNGHONG[1] + 0.2, 25, 40, 41, 30];
// the payoff: Wongburi on ถนนคำลือ in the old town, the walking street in front of it, from the south
const FA_IN: Key = [46.0, WONGBURI[0], 0.6, WONGBURI[1] + 0.4, 26, 18, 40, 30];
const FA_END: Key = [54.0, WONGBURI[0] + 0.2, 0.6, WONGBURI[1] + 0.3, 20, -8, 38, 30];
// the landing: the whole tile again at the cover's distance, now a town on the Yom
const END: Key = [56.4, GABLE_AT[0] - 10, 6, GABLE_AT[1] + 6, 290, 18, 34, 30];
const OT_C: [number, number] = [OLD_TOWN.reduce((s, p) => s + p[0], 0) / OLD_TOWN.length, OLD_TOWN.reduce((s, p) => s + p[1], 0) / OLD_TOWN.length];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1897,
  after: 2026,
  camera: [
    ...between(C1, SH_IN, 4),
    ...between(SH_END, RA_IN, 4, 0.3),
    ...between(RA_END, TE_IN, 4, 0.2),
    ...between(TE_END, CH_IN, 4, 0.2),
    ...between(CH_END, GR_IN, 4, 0.1),
    ...between(GR_END, MO_IN, 4, 0.1),
    ...between(MO_END, FA_IN, 4, 0.2),
    ...between(FA_END, END, 4),
    END,
    [60, GABLE_AT[0] - 10, 6, GABLE_AT[1] + 6, 300, 24, 34, 30],
  ],
  beats: [
    {
      // the cover (A1): a giant teak gable on trestles east of the old town, half fret-sawn into gingerbread lace at frame
      // 0; the saw cuts the rest by 2.1 s and a two-storey teak house grows under it. No counter under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1897, 1898],
      camera: [C0, C1],
    },
    {
      // 25 Jul 2445: some fifty Shan come in at dawn, take the police post and the town; in August the Siamese columns come
      // up the road and the Shan leave by the north gate (armies meeting, never violence)
      id: 'shan',
      kind: 'fight',
      t: [3.0, 9.4],
      year: {hold: 1902},
      caption: {t0: 3.1, title: 'เงี้ยวบุกยึดเมืองแพร่', sub: 'เช้า 25 ก.ค. 2445 ไม่ถึงเดือนทัพสยามก็ยึดคืน'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'ประตูชัย', dx: 120, dy: -150, p: [GATE_CHAI[0], 1.0, GATE_CHAI[1]], t0: 4.8, t1: 7.4}],
      camera: [SH_IN, SH_END],
    },
    {
      // 15 Nov 2455: the northern line opens past Den Chai, Phrae's station 20 km from the town
      id: 'rail',
      kind: 'arrive',
      t: [10.0, 15.6],
      year: {hold: 1912},
      caption: {t0: 10.1, title: 'รถไฟสายเหนือถึงเด่นชัย', sub: 'สถานีของเมืองแพร่ ห่างตัวเมืองราว 20 กม.'},
      callouts: [{label: 'สถานีเด่นชัย', dx: 120, dy: -150, p: [DENCHAI[0], 1.0, DENCHAI[1]], t0: 13.2, t1: 15.4}],
      camera: [RA_IN, RA_END],
    },
    {
      // the teak years: the British companies' elephants drag logs to the Yom; the logs go down the river in rafts
      id: 'teak',
      kind: 'trade',
      t: [15.6, 22.0],
      year: [1913, 1923],
      caption: {t0: 15.7, title: 'ช้างลากซุงสักลงแม่น้ำยม', sub: 'บริษัทค้าไม้ฝรั่งตั้งสำนักงานที่แพร่'},
      callouts: [{label: 'แม่น้ำยม', dx: -120, dy: -150, p: [LANDING[0] + 2.4, 0.4, LANDING[1] + 3.0], t0: 18.6, t1: 21.6}],
      camera: [TE_IN, TE_END],
    },
    {
      // Kruba Sriwichai's restoration: villagers carry bricks up the naga stair; the chedi's base widens and its spire rises
      id: 'chohae',
      kind: 'build',
      t: [22.0, 28.0],
      year: [1924, 1930],
      caption: {t0: 22.1, title: 'บูรณะพระธาตุช่อแฮ', sub: 'ครูบาศรีวิชัยขยายฐาน ต่อยอดให้สูงขึ้น'},
      callouts: [{label: 'พระธาตุช่อแฮ', dx: 120, dy: -160, p: [CHOHAE[0], 4.6, CHOHAE[1]], t0: 24.8, t1: 27.8}],
      camera: [CH_IN, CH_END],
    },
    {
      // the grow shot: the town spreads out of the moat, east past the main road to the airport and the bypass
      id: 'grow',
      kind: 'grow',
      t: [28.0, 36.5],
      year: [1931, 2000],
      caption: {t0: 28.1, title: 'เมืองโตออกนอกคูเมือง', sub: 'ไปทางตะวันออกจนถึงสนามบิน'},
      era: 'ปัจจุบัน',
      callouts: [{label: 'เวียงเก่า', dx: -120, dy: -150, p: [OT_C[0], 0.8, OT_C[1]], t0: 32.6, t1: 36.2}],
      camera: [GR_IN, GR_END],
    },
    {
      // Ban Thung Hong: the mo hom shirts dyed indigo and hung out in rows
      id: 'mohom',
      kind: 'trade',
      t: [36.5, 44.6],
      year: [2001, 2014],
      caption: {t0: 36.6, title: 'เสื้อหม้อห้อมบ้านทุ่งโฮ้ง', sub: 'ย้อมครามแล้วตากเป็นแถวทั้งหมู่บ้าน'},
      callouts: [{label: 'บ้านทุ่งโฮ้ง', dx: 120, dy: -150, p: [THUNGHONG[0], 0.8, THUNGHONG[1]], t0: 40.0, t1: 44.2}],
      camera: [MO_IN, MO_END],
    },
    {
      // the payoff: the old town's walking street in front of Wongburi; its gingerbread gable is the cover's, sawn again
      id: 'fair',
      kind: 'celebrate',
      t: [44.6, 54.4],
      year: [2015, 2025.5],
      caption: {t0: 44.7, t1: 53.8, title: 'เมืองเก่าเรือนไม้สัก', sub: 'คุ้มวงศ์บุรี ลายขนมปังขิงอายุกว่าร้อยปี'},
      callouts: [{label: 'ลายขนมปังขิง', dx: -130, dy: -160, p: [WONGBURI[0] + 1.6, 1.0, WONGBURI[1] + 0.05], t0: 47.6, t1: 53.6}],
      camera: [FA_IN, FA_END],
    },
    {id: 'today', kind: 'today', t: [54.6, 56.4], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
