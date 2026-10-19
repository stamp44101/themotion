// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates and wording from docs/briefs/phetchaburi.md §3.
// Opens with experiment 2 (docs/experiments.md): the finale over Khao Wang first, then back to
// the Khmer towers, which rise while the camera comes down so something moves from the start.
import {buildStory} from '../../engine/story';
import {BAN_PUEN, BANG_CHAN, KAMPHAENG_LAENG, KLONG_KRACHAENG, PEAK_M, PEAK_W, RAIL_X, STATION} from './places';

export const STORY = buildStory({
  duration: 60,
  before: 1100,
  after: 2026,
  // transitions between beats
  camera: [
    [10.4, -2, 1, -3, 120, 112, 37, 30],
    [21.2, -11, 1, -5, 112, 188, 37, 30],
    [39, -10, 1, 2, 120, 308, 37, 30],
    [56.4, -12, 2, -4, 150, 396, 34, 30],
    [60, -10, 2, -4, 200, 408, 35, 30],
  ],
  beats: [
    {
      // the whole plain: Khao Wang's ridge, the river, sugar palms; the laterite towers of
      // วัดกำแพงแลง rise as the camera comes down to them
      id: 'khmer',
      t: [0, 9.6],
      year: {hold: 1191},
      caption: {
        t0: 3.4,
        title: 'ปรางค์ศิลาแลงยุคเขมร',
        sub: 'วัดกำแพงแลง สันนิษฐานว่าเพชรบุรีคือ "ศรีชยวัชรปุระ" ในจารึกพระเจ้าชัยวรมันที่ 7 พ.ศ. 1734',
      },
      era: 'เขมร',
      callouts: [{t0: 6.4, t1: 9.4, label: 'วัดกำแพงแลง', dx: 90, dy: -120, p: [KAMPHAENG_LAENG[0], 2.2, KAMPHAENG_LAENG[1]]}],
      camera: [
        [0, -8, 1, -3, 300, 62, 36, 30],
        [2.8, -6, 1, -3, 170, 72, 35, 30],
        [6.2, 2, 1, -2.4, 60, 88, 36, 30],
        [9.4, 3, 1, -2.4, 46, 102, 37, 30],
      ],
    },
    {
      // พระยาละแวก's second attack: the fleet comes up the river from the sea, one force
      // storms คลองกระแชง on the west, the other ประตูบางจาน on the east, the หอรบ burn
      id: 'siege',
      t: [11.4, 20.4],
      year: {hold: 1581},
      caption: {t0: 11.2, title: 'พระยาละแวกตีเพชรบุรี', sub: 'พ.ศ. 2124 ทัพเขมรบุกพร้อมกันทั้งคลองกระแชงและประตูบางจาน เผาหอรบ เมืองแตก'},
      era: 'อยุธยา',
      callouts: [
        {t0: 14.2, t1: 16.6, label: 'คลองกระแชง', dx: -90, dy: -120, p: [KLONG_KRACHAENG[0], 0.5, KLONG_KRACHAENG[1]]},
        {t0: 17, t1: 20.2, label: 'ประตูบางจาน', dx: 90, dy: -120, p: [BANG_CHAN[0], 1.4, BANG_CHAN[1]]},
      ],
      camera: [
        // up the river with the fleet, then across the town to the east gate
        [11.6, -1, 1, -32, 62, 122, 37, 30],
        [13.4, -5, 1, -20, 60, 128, 37, 30],
        [15.2, -5.5, 1, -6, 60, 136, 38, 30],
        [17.4, 3, 1, -1, 58, 150, 38, 30],
        [20.2, 2, 1, -1, 66, 166, 38, 30],
      ],
    },
    {
      // Rama IV's summer palace goes up on the three peaks
      id: 'palace',
      t: [22, 30],
      year: [1859, 1862.45],
      caption: {t0: 21.8, title: 'พระนครคีรี', sub: 'พ.ศ. 2402 รัชกาลที่ 4 โปรดให้สร้างพระราชวังบนเขาสมณ เสร็จ พ.ศ. 2405'},
      era: 'รัตนโกสินทร์',
      callouts: [
        {t0: 24, t1: 26.8, label: 'พระธาตุจอมเพชร', dx: 90, dy: -130, p: [PEAK_M[0], 5.0, PEAK_M[1]]},
        {t0: 27.2, t1: 29.8, label: 'พระราชวัง', dx: -90, dy: -130, p: [PEAK_W[0] + 0.5, 4.2, PEAK_W[1] + 0.2]},
      ],
      camera: [
        // low, across the open plain, so the ridge stands against the sky
        // from the south the three crowns stand side by side (from the east they stack up)
        [22.2, -20, 2.5, -6, 60, 186, 25, 30],
        [26, -20, 2.5, -6, 50, 196, 23, 30],
        [29.8, -20.5, 2.5, -6, 54, 208, 25, 30],
      ],
    },
    {
      // the first southern train runs down from Thonburi and pulls in to the terminus
      id: 'railway',
      t: [32, 38],
      year: {hold: 1903},
      caption: {t0: 31.8, title: 'รถไฟถึงเพชรบุรี', sub: 'พ.ศ. 2446 ทางรถไฟสายใต้ช่วงแรก จากธนบุรีมาสิ้นสุดที่เพชรบุรี'},
      callouts: [{t0: 36, t1: 38, label: 'สถานีรถไฟเพชรบุรี', dx: 90, dy: -130, p: [STATION[0], 1.2, STATION[1]]}],
      camera: [
        // tracking the train south down the line, the ridge ahead
        [32.4, RAIL_X, 1, -44, 64, 280, 35, 30],
        [34.2, RAIL_X, 1, -34, 60, 286, 35, 30],
        [35.4, RAIL_X, 1, -26, 58, 292, 35, 30],
        [37.8, -15, 1, -19, 56, 300, 36, 30],
      ],
    },
    {
      // the German-designed palace by the river at บ้านปืน
      id: 'banpuen',
      t: [40, 47],
      year: [1910, 1916.45],
      caption: {t0: 39.8, title: 'พระรามราชนิเวศน์', sub: 'วังบ้านปืน สร้างเสร็จ พ.ศ. 2459 ออกแบบโดยสถาปนิกชาวเยอรมัน'},
      callouts: [{t0: 43, t1: 46.8, label: 'วังบ้านปืน', dx: 90, dy: -120, p: [BAN_PUEN[0], 1.6, BAN_PUEN[1]]}],
      camera: [
        [40.4, BAN_PUEN[0], 1, BAN_PUEN[1], 58, 322, 36, 30],
        [46.6, BAN_PUEN[0], 1, BAN_PUEN[1], 46, 346, 37, 30],
      ],
    },
    {
      // the town today under the ridge: the งานพระนครคีรี fair at its foot
      id: 'unesco',
      t: [49, 54],
      year: {hold: 2021},
      caption: {
        t0: 48.8,
        title: 'เมืองสร้างสรรค์ด้านอาหาร',
        sub: '8 พ.ย. 2564 ยูเนสโกยกย่องเพชรบุรี เมืองขนมหวานและน้ำตาลโตนด',
        note: '★ ปีเดียวกัน ป่าแก่งกระจานเป็นมรดกโลกทางธรรมชาติ',
      },
      camera: [
        [49.2, -8, 1, -2, 140, 370, 37, 30],
        [53.8, -9, 1, -3, 172, 386, 37, 30],
      ],
    },
    {
      // the counter lands on 2569 and holds it before the finale card
      id: 'today',
      t: [54.6, 56.2],
      year: [2025.6, 2026],
    },
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train runs in as the railway caption lands, and parks at the terminus
const [rail0] = STORY.at('railway');
export const SOUND_EVENTS = {
  trains: [{t0: rail0 + 0.2, dur: 4.6, dir: -1, modern: false}] as {t0: number; dur: number; dir: number; modern: boolean}[],
};
