// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/roiet.md, approved on the owner's behalf 15 Nov 2569): hero / found / plane / dig / grow /
// tower / fair / today. The founding beat runs 2314-2318 while ดงกุ่ม is cleared and lands on 2318 for ~1.2 s (the trees
// fade over two years, so the clearing comes first). Held years: 2318 (Taksin raises Ban Kum Hang to เมืองร้อยเอ็ด), 2469 (the bueng dredged, 2469-70),
// 2563 (หอโหวด ๑๐๑ opens); the counter lands on 2569. มณฑลร้อยเอ็ด (2456), the first airfield (2465, one snippet), Phra
// Sung Yai (2516) and the new airport (2542) are named with no year: the counter does not hold them.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {BUENG_C, CAUSEWAY, STRIP, TOWER, WAT_BUENG, WAT_BURAPHA} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the wot on the paddy SE of the moat, the moat town and the bueng to its left (style frame A2)
const C0: Key = [0, 7, 18, 5, 205, 14, 36, 30];
const C1: Key = [2.8, 7, 19, 5, 214, 22, 38, 30];
// found: down to the moat's south causeway as the procession comes up, then on to the bueng's west bank
const FO_IN: Key = [4.4, CAUSEWAY[0] - 0.4, 1, CAUSEWAY[1] + 1.6, 34, 18, 42, 30];
const FO_END: Key = [8.6, WAT_BUENG[0] + 0.2, 1, WAT_BUENG[1] + 0.6, 30, 34, 42, 30];
// plane: the town filling inside the moat, then north to the strip as the biplane comes in
const PL_IN: Key = [11.6, -3.0, 1, -3.4, 44, -12, 42, 30];
const PL_END: Key = [15.6, STRIP[0][0] - 1.0, 1, -14.0, 40, -30, 38, 30];
// dig: close on the bueng, from the south then the south-east
const DG_IN: Key = [17.0, BUENG_C[0], 0.5, BUENG_C[1] + 0.4, 30, 16, 42, 30];
const DG_END: Key = [22.4, BUENG_C[0] + 0.2, 0.5, BUENG_C[1] + 0.2, 24, 44, 42, 30];
// grow: the whole town from the cover's side, swinging round to the south-east
const GR_IN: Key = [24.4, 3, 2, 3, 165, 8, 38, 30];
const GR_END: Key = [32.6, 4, 2, 2, 200, 38, 38, 30];
// tower: the wot comes back over the town and sets down on the bueng's south bank
const TO_IN: Key = [34.4, 2, 7, 2.5, 70, 24, 32, 30];
const TO_END: Key = [41.6, TOWER[0], 4.5, TOWER[1], 50, 8, 31, 30];
// fair: the procession round the bueng, from the south-west then the south
const FA_IN: Key = [44.0, BUENG_C[0], 0.5, BUENG_C[1] + 1.2, 32, -14, 38, 30];
const FA_END: Key = [52.6, BUENG_C[0], 0.5, BUENG_C[1] + 0.8, 28, 16, 38, 30];
// the landing: the whole tile again at the cover's distance, now a city
const END: Key = [55.2, 7, 18, 5, 205, 14, 36, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1769.6,
  after: 2026,
  camera: [
    ...between(C1, FO_IN, 4),
    ...between(FO_END, PL_IN, 4),
    ...between(PL_END, DG_IN, 4, 0.2),
    ...between(DG_END, GR_IN, 4),
    ...between(GR_END, TO_IN, 4),
    ...between(TO_END, FA_IN, 4),
    ...between(FA_END, END, 4),
    END,
    [60, 7, 19, 5, 214, 22, 37, 30],
  ],
  beats: [
    {
      // the cover (A2): a giant wot standing on the paddy SE of the Dvaravati moat, half its pipes in at frame 0; the rest
      // drop in, the wax seals the foot, it spins. The counter waits under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1770.0, 1770.4],
      camera: [C0, C1],
    },
    {
      // 2318 (Thonburi): Thao Thon's people come up from Suwannaphum and clear ดงกุ่ม on the old moat town; Wat Bueng Phra
      // Lan Chai is cleared from the ruins on the bueng's west bank (th.wiki; ศิลปวัฒนธรรม snippet)
      id: 'found',
      kind: 'procession',
      t: [3.0, 9.0],
      year: [1771.0, 1775.4],
      caption: {t0: 3.2, title: 'ท้าวทนตั้งเมืองร้อยเอ็ด', sub: 'ถางดงกุ่มบนซากเมืองโบราณ สมัยกรุงธนบุรี'},
      era: 'ธนบุรี',
      callouts: [{label: 'วัดบึงพระลานชัย', dx: -130, dy: -160, p: [WAT_BUENG[0], 1.2, WAT_BUENG[1]], t0: 6.8, t1: 8.8}],
      camera: [FO_IN, FO_END],
    },
    {
      // between the founding and this beat (9-11 s) the counter runs on and the town fills the moat; the seat of มณฑล
      // ร้อยเอ็ด (2456, no year); a biplane lands on the strip NNW of the moat (the first airfield, 2465 by one snippet: no
      // year; the beat runs 2462-2465)
      id: 'plane',
      kind: 'arrive',
      t: [11.0, 16.0],
      year: [1919, 1922.4],
      caption: {t0: 11.1, title: 'เครื่องบินลงนอกคูเมือง', sub: 'เมืองหลักของมณฑลร้อยเอ็ด'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'สนามบินแห่งแรก', dx: 120, dy: -150, p: [STRIP[0][0] - 0.6, 0.6, -13.0], t0: 13.6, t1: 15.8}],
      camera: [PL_IN, PL_END],
    },
    {
      // 2469-70: the governor calls people from every district to dredge the silted bueng (two sources for the years; the
      // 40,000 from the wiki only: "คนนับหมื่น")
      id: 'dig',
      kind: 'build',
      t: [16.0, 23.0],
      year: {hold: 1926},
      caption: {t0: 16.2, title: 'ชาวบ้านลอกบึงพลาญชัย', sub: 'คนนับหมื่นจากทุกอำเภอ ขุดทั้งวันทั้งคืน'},
      callouts: [{label: 'บึงพลาญชัย', dx: 130, dy: -160, p: [BUENG_C[0], 0.6, BUENG_C[1]], t0: 19.6, t1: 22.6}],
      camera: [DG_IN, DG_END],
    },
    {
      // the grow shot: the town spills over the moat along the roads; Phra Sung Yai rises at Wat Burapha (2516, no year)
      id: 'grow',
      kind: 'grow',
      t: [23.5, 33.0],
      year: [1930, 2013],
      caption: {t0: 23.6, title: 'เมืองล้นคูออกไปทุกทิศ', sub: 'พระสูงใหญ่ขึ้นที่วัดบูรพาภิราม'},
      era: 'ปัจจุบัน',
      callouts: [{label: 'พระสูงใหญ่', dx: 120, dy: -150, p: [WAT_BURAPHA[0], 2.6, WAT_BURAPHA[1]], t0: 28.8, t1: 32.6}],
      camera: [GR_IN, GR_END],
    },
    {
      // 21 ธ.ค. 2563: หอโหวด ๑๐๑ opens on the bueng's south bank, its shape from the wot (the callback: the cover's wot
      // comes back and becomes it). Its height (101 or 123 m) is disputed: none on screen.
      id: 'tower',
      kind: 'build',
      t: [33.5, 42.0],
      year: {hold: 2020},
      caption: {t0: 33.6, title: 'หอโหวด ๑๐๑ ริมบึง', sub: 'รูปทรงจากโหวด เครื่องดนตรีประจำจังหวัด'},
      callouts: [{label: 'หอโหวด ๑๐๑', dx: 130, dy: -170, p: [TOWER[0], 5.0, TOWER[1]], t0: 38.4, t1: 41.8}],
      camera: [TO_IN, TO_END],
    },
    {
      // the payoff: บุญผะเหวด, the Phawet procession round the bueng with khaen bands (held at the bueng and the park every
      // March: news snippets)
      id: 'fair',
      kind: 'celebrate',
      t: [43.0, 53.0],
      year: [2021, 2025.5],
      caption: {t0: 43.1, t1: 52.6, title: 'แห่บุญผะเหวดรอบบึง', sub: 'ขบวนพระเวสกับวงแคน'},
      callouts: [{label: 'หอโหวด ๑๐๑', dx: 130, dy: -170, p: [TOWER[0], 5.0, TOWER[1]], t0: 47.0, t1: 52.4}],
      camera: [FA_IN, FA_END],
    },
    {id: 'today', kind: 'today', t: [53.4, 55.2], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
