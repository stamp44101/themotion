// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates from docs/briefs/kanchanaburi.md (Gemini's research
// cross-checked on the web, 3 Nov 2026). Built to the 0-to-100 spine: the cover is a legend-scale steam
// train on the Kwai bridge (style frame A1, picked for the owner in the autoloop); it settles away as the
// history starts: Lat Ya's camp in the Nine Armies War (2328), Rama III moves the town to Pak Phraek on
// rafts and raises the wall (2374), the bridge is built (2486), broken (2488) and mended, the town spreads
// along the Mae Klong, and the festival night brings the train back over the bridge.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {BRIDGE, DON_RAK, LAT_YA, PIER, STATION} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]
const [BX, BZ] = BRIDGE;
const [LX, LZ] = LAT_YA;

// the cover: the giant bridge across the whole frame, then the camera swings north-west to Lat Ya
const HERO_END: Key = [6.6, LX + 4, 1.5, LZ + 6, 96, 150, 34, 30];
// Lat Ya's camp, the Burmese column and the Siamese elephants
const FI_IN: Key = [7.4, LX + 3, 1.5, LZ + 5, 64, 140, 34, 30];
const FI_END: Key = [11.6, LX + 3, 1.5, LZ + 5, 52, 118, 33, 30];
// the town floats down the Khwae Yai on rafts to the confluence, the wall rises round the new town
const MV_IN: Key = [12.8, -9, 1, -7, 44, 104, 36, 30];
const MV_END: Key = [16.6, -2, 1, 0, 34, 70, 36, 30];
// the bridge site, built pier by pier: tiny figures, timber then steel
const BR_IN: Key = [18.4, BX, 1.5, BZ, 34, 40, 30, 30];
const BR_END: Key = [26.0, BX, 1.5, BZ, 30, 16, 28, 30];
// the middle spans fall
const BK_IN: Key = [27.2, BX, 1.5, BZ, 28, 10, 27, 30];
const BK_END: Key = [29.2, BX, 1.5, BZ, 24, 356, 26, 30];
// Don Rak: a quiet hold on the rows of white markers
const DR_IN: Key = [30.8, DON_RAK[0] + 0.5, 0.8, DON_RAK[1], 16, 330, 28, 30];
const DR_END: Key = [32.2, DON_RAK[0] + 0.5, 0.8, DON_RAK[1], 14, 318, 28, 30];
// the straight spans, the line mended: the train crosses again
const MD_IN: Key = [33.8, BX, 1.5, BZ, 32, 270, 26, 30];
const MD_END: Key = [36.4, BX, 1.5, BZ, 36, 246, 26, 30];
// the long wide shot: the town spreading along the river toward the station and the new hall
const GR_IN: Key = [38.0, -6, 2, -8, 80, 210, 36, 30];
const GR_END: Key = [42.4, -2, 2, -2, 130, 160, 36, 30];
// the festival night at the bridge
const PY_IN: Key = [44.4, BX, 1.5, BZ, 40, 120, 30, 30];
const PY_END: Key = [53.6, BX, 5, BZ, 105, 90, 28, 30];
// the whole tile again
const END: Key = [55.8, -6, 4, -2, 300, 60, 30, 30];

/** the cover bridge's scale (a real bridge is ~3 units long) and how the hero settles away */
export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1700,
  after: 2026,
  camera: [
    ...between(HERO_END, FI_IN, 4, 0.05),
    ...between(FI_END, MV_IN, 4, 0.3),
    ...between(MV_END, BR_IN, 5, 0.3),
    ...between(BR_END, BK_IN, 4),
    ...between(BK_END, DR_IN, 6, 0.4),
    ...between(DR_END, MD_IN, 6, 0.4),
    ...between(MD_END, GR_IN, 5, 0.3),
    ...between(GR_END, PY_IN, 7, 0.5),
    ...between(PY_END, END, 4),
    END,
    [60, -6, 4, -2, 330, 40, 30, 30],
  ],
  beats: [
    {
      // the cover: the steam train on the bridge, already moving at frame 0; no year is named
      id: 'hero',
      kind: 'legend',
      t: [0, 6.6],
      year: {hold: 1700},
      caption: {t0: 3.3, t1: 6.85, title: 'เมืองหน้าด่านแห่งสยาม', sub: 'ด่านพระเจดีย์สามองค์ ทางผ่านของทัพและรถไฟ'},
      era: 'ด่านตะวันตก',
      camera: [
        [0, BX + 1, 9, BZ - 2, 135, 243, 24, 30],
        [3, BX + 1, 8, BZ - 1, 125, 238, 26, 30],
        HERO_END,
      ],
    },
    {
      // the Nine Armies War: Lat Ya, the old seat, is the Siamese camp where Rama I's brother meets the
      // Burmese column (2328; the chronicle; no commander named)
      id: 'fight',
      kind: 'fight',
      t: [7.4, 11.6],
      year: {hold: 1785},
      caption: {t0: 7.4, t1: 11.8, title: 'ศึกเก้าทัพที่ทุ่งลาดหญ้า', sub: 'พ.ศ. 2328 ทัพไทยตั้งค่ายหน้าด่าน ช้างศึกกับปืนใหญ่'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'ลาดหญ้า', dx: -140, dy: -150, p: [LX, 1.0, LZ], t0: 8.0, t1: 11.2}],
      camera: [FI_IN, FI_END],
    },
    {
      // Rama III moves the town from Lat Ya to Pak Phraek on 8 Mar 2374 (the pillar inscription): the houses
      // come down the river on rafts, the wall of six forts and eight gates rises round the new town
      id: 'move',
      kind: 'procession',
      t: [12.8, 16.6],
      year: {hold: 1831},
      caption: {t0: 12.8, t1: 16.8, title: 'ย้ายเมืองมาปากแพรก', sub: 'พ.ศ. 2374 รัชกาลที่ 3 สร้างกำแพงเมืองริมน้ำ ที่แม่น้ำสองสายมาพบกัน'},
      callouts: [{label: 'ปากแพรก', dx: 140, dy: -150, p: [PIER[0] + 1, 1.0, PIER[1]], t0: 14.4, t1: 16.4}],
      camera: [MV_IN, MV_END],
    },
    {
      // the Thai-Burma railway reaches the Mae Klong (Khwae Yai from 2503): the timber bridge in 2486, then
      // the 11-span steel bridge (opened 25 Dec 2486): one year held for both
      id: 'bridge',
      kind: 'build',
      t: [18.4, 26.0],
      year: {hold: 1943},
      caption: {t0: 18.4, t1: 26.2, title: 'สะพานข้ามแม่น้ำแคว', sub: 'พ.ศ. 2486 สะพานไม้แล้วสะพานเหล็ก 11 ช่วง ทางรถไฟสายไทย–พม่า'},
      callouts: [{label: 'สะพานข้ามแม่น้ำแคว', dx: -150, dy: -140, p: [BX, 1.2, BZ], t0: 21.4, t1: 25.6}],
      camera: [BR_IN, BR_END],
    },
    {
      // the raids of Nov 1944 to Jun 1945 drop the middle spans (held on 2488, the year of the heavy raids)
      id: 'break',
      kind: 'disaster',
      t: [27.2, 29.4],
      year: {hold: 1945},
      caption: {t0: 27.2, t1: 29.6, title: 'สะพานถูกระเบิด', sub: 'พ.ศ. 2488 ช่วงกลางพังลงแม่น้ำ'},
      camera: [BK_IN, BK_END],
    },
    {
      // a quiet moment at Don Rak (Chong Kai's rows too): nothing of the prisoners' suffering shown
      id: 'rest',
      kind: 'discover',
      t: [30.8, 32.2],
      year: [1945.6, 1946],
      caption: {t0: 30.8, t1: 32.4, title: 'สุสานดอนรัก', sub: 'ระลึกถึงผู้ที่ไม่ได้กลับบ้าน'},
      camera: [DR_IN, DR_END],
    },
    {
      // the Thai government buys the line and mends the bridge with straight spans; no year is named
      // (2489 / 2491 / 2495 disagree), the counter runs through them
      id: 'mend',
      kind: 'arrive',
      t: [33.8, 36.4],
      year: [1946, 1962],
      caption: {t0: 33.8, t1: 36.6, title: 'ซ่อมสะพานเสร็จ', sub: 'รัฐบาลไทยซ่อมด้วยโครงเหล็กตรง รถไฟข้ามอีกครั้ง'},
      camera: [MD_IN, MD_END],
    },
    {
      // the town leaves its wall along the Mae Klong: the station, the Saeng Chuto road, the new hall at
      // Ban Bo (2498), the municipality from 2.08 km2 (2478) to 9.16 (2517)
      id: 'growth',
      kind: 'grow',
      t: [38.0, 42.4],
      year: [1962, 2016],
      caption: {t0: 38.0, t1: 42.6, title: 'เมืองโตตามลำน้ำ', sub: 'เทศบาล 9 ตร.กม. ถนนแสงชูโต เขื่อนศรีนครินทร์ สกายวอล์คหน้าเมือง'},
      callouts: [{label: 'สถานีกาญจนบุรี', dx: -150, dy: -130, p: [STATION[0], 0.8, STATION[1]], t0: 39.4, t1: 42.2}],
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the bridge week at the end of November (27 Nov-7 Dec 2569): light-and-sound, fireworks, the train
      // crosses again; the bridge swells back to the cover's size (the callback)
      id: 'payoff',
      kind: 'celebrate',
      t: [44.4, 53.6],
      year: {hold: 2025},
      caption: {t0: 44.4, t1: 53.8, title: 'งานสัปดาห์สะพานแคว', sub: 'ปลายพฤศจิกายนของทุกปี แสงสีเสียง พลุ และรถไฟข้ามสะพานเดิม'},
      callouts: [{label: 'สะพานข้ามแม่น้ำแคว', dx: -150, dy: -130, p: [BX, 1.2, BZ], t0: 48.4, t1: 51.6}],
      camera: [PY_IN, PY_END],
    },
    {id: 'today', kind: 'today', t: [54.0, 55.8], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the steam train over the mended bridge as its caption lands, and again in the festival
const [md0] = STORY.at('mend');
const [py0] = STORY.at('payoff');
export const SOUND_EVENTS = {
  crossings: [0.2, md0 + 0.4, py0 + 3.4],
};
