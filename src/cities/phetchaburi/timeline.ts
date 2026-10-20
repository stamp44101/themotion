// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates and wording from docs/briefs/phetchaburi.md §3.
// Built to the storyline standard (docs/storyline.md): the cover's hero (Khao Wang and a giant
// ขนมหม้อแกง), people in the first beat, the siege in the danger zone, one verb per beat, a wide
// grow shot, and the hero coming back at the fair before the counter lands on today.
import {buildStory} from '../../engine/story';
import {BAN_PUEN, BANG_CHAN, FAIR, KAMPHAENG_LAENG, KLONG_KRACHAENG, PEAK_M, PEAK_W, RAIL_X, STATION} from './places';

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1100,
  after: 2026,
  // transitions between beats
  camera: [
    [18.8, -11, 1, -5, 112, 128, 37, 30],
    [27.6, -16, 1, -12, 96, 220, 36, 30],
    [44.7, -12, 1, 1, 130, 360, 36, 30],
    [55.0, -12, 2, -2, 122, 428, 35, 30],
    [60, -10, 2, -4, 200, 440, 35, 30],
  ],
  beats: [
    {
      // the cover: Khao Wang and the tray at hero scale, the served piece lifting; then the
      // laterite towers of วัดกำแพงแลง rise while porters carry stone in behind the carts
      id: 'khmer',
      kind: 'build',
      t: [0, 8.4],
      year: {hold: 1191},
      caption: {t0: 3.4, title: 'ปราสาทขอมในเมืองเพชร', sub: 'สันนิษฐานว่าเพชรบุรีคือ "ศรีชยวัชรปุระ" ในจารึกพระเจ้าชัยวรมันที่ 7 พ.ศ. 1734'},
      era: 'เขมร',
      callouts: [{t0: 5.6, t1: 8.2, label: 'วัดกำแพงแลง', dx: 90, dy: -120, p: [KAMPHAENG_LAENG[0], 2.2, KAMPHAENG_LAENG[1]]}],
      camera: [
        // from the west: Khao Wang in the foreground, the whole tile behind it (the cover)
        [0, -6, 1, -2, 300, -107, 36, 30],
        [2.6, -8, 1, -3, 180, -92, 35, 30],
        [5.6, 1.0, 1, -2.4, 58, -64, 36, 30],
        [8.0, 1.9, 1, -2.4, 44, -46, 37, 30],
      ],
    },
    {
      // พระยาละแวก's second attack: the fleet comes up the river from the sea, one force storms
      // คลองกระแชง on the west, the other ประตูบางจาน on the east, the หอรบ burn
      id: 'siege',
      kind: 'fight',
      t: [9.0, 18.2],
      year: {hold: 1581},
      caption: {t0: 8.8, title: 'พระยาละแวกตีเพชรบุรี', sub: 'พ.ศ. 2124 ทัพเรือเขมรบุกพร้อมกันสองด้าน เผาหอรบ เมืองแตก'},
      era: 'อยุธยา',
      callouts: [
        {t0: 11.8, t1: 14.2, label: 'คลองกระแชง', dx: -90, dy: -120, p: [KLONG_KRACHAENG[0], 0.5, KLONG_KRACHAENG[1]]},
        {t0: 14.6, t1: 18.0, label: 'ประตูบางจาน', dx: 90, dy: -120, p: [BANG_CHAN[0], 1.4, BANG_CHAN[1]]},
      ],
      camera: [
        // up the river with the fleet, then across the town to the east gate
        [9.2, -1, 1, -32, 62, -24, 37, 30],
        [11.0, -5, 1, -20, 60, 0, 37, 30],
        [12.9, -5.5, 1, -6, 60, 30, 38, 30],
        [15.2, 3.6, 1, 1.2, 58, 62, 38, 30],
        [18.0, 2.8, 1, 1.4, 66, 92, 38, 30],
      ],
    },
    {
      // Rama IV's summer palace goes up on the three peaks; his procession climbs to it
      id: 'palace',
      kind: 'build',
      t: [19.4, 27.0],
      year: [1859, 1862.45],
      caption: {t0: 19.2, title: 'วังบนเขาของรัชกาลที่ 4', sub: 'พ.ศ. 2402 สร้างพระนครคีรีบนเขาสมณ เสร็จ พ.ศ. 2405 ชาวบ้านจึงเรียกว่า "เขาวัง"'},
      era: 'รัตนโกสินทร์',
      callouts: [
        {t0: 21.4, t1: 24.0, label: 'พระธาตุจอมเพชร', dx: 90, dy: -130, p: [PEAK_M[0], 5.0, PEAK_M[1]]},
        {t0: 24.4, t1: 26.8, label: 'พระราชวัง', dx: -90, dy: -130, p: [PEAK_W[0] + 0.3, 4.6, PEAK_W[1] + 0.35]},
      ],
      camera: [
        // from the north the three crowns stand side by side (from the east they stack up)
        [19.6, -19.5, 2.5, -5.5, 62, 176, 26, 30],
        [23.2, -19.5, 2.5, -5.5, 52, 190, 24, 30],
        [26.8, -20, 2.5, -5.5, 56, 204, 26, 30],
      ],
    },
    {
      // the first southern train runs down from Thonburi and pulls in to the terminus
      id: 'railway',
      kind: 'arrive',
      t: [28.4, 34.0],
      year: {hold: 1903},
      caption: {t0: 28.2, title: 'รถไฟมาถึงเมืองเพชร', sub: 'พ.ศ. 2446 ปลายทางแรกของทางรถไฟสายใต้ จากธนบุรีราว 150 กม.'},
      callouts: [{t0: 31.8, t1: 33.9, label: 'สถานีรถไฟเพชรบุรี', dx: 90, dy: -130, p: [STATION[0], 1.2, STATION[1]]}],
      camera: [
        // tracking the train south down the line, the ridge ahead
        [28.6, RAIL_X, 1, -44, 64, 236, 35, 30],
        [30.4, RAIL_X, 1, -34, 60, 244, 35, 30],
        [31.6, RAIL_X, 1, -26, 58, 252, 35, 30],
        [33.8, -15, 1, -19, 56, 262, 36, 30],
      ],
    },
    {
      // the wide shot the format promises: the town spreads over the palm plain round the
      // hill, Ban Puen palace rising by the river, roads and cars arriving
      id: 'growth',
      kind: 'grow',
      t: [35.4, 44.0],
      year: [1908, 2012],
      caption: {t0: 35.2, title: 'เมืองโตเต็มทุ่งตาล', sub: 'วังบ้านปืนสร้างเสร็จสมัยรัชกาลที่ 6 แล้วถนน ตึก และรถยนต์ ก็ขยายจนเต็มทุ่ง'},
      callouts: [{t0: 36.8, t1: 40.2, label: 'วังบ้านปืน', dx: 90, dy: -120, p: [BAN_PUEN[0], 1.8, BAN_PUEN[1]]}],
      camera: [
        [35.8, -8, 1, 1, 118, 284, 37, 30],
        [39.8, -8, 1, 1, 160, 310, 36, 30],
        [43.8, -9, 1, 0, 186, 336, 36, 30],
      ],
    },
    {
      // the payoff: the งานพระนครคีรี fair at the foot of the hill, and the cover's ขนมหม้อแกง
      // back among the stalls (the open loop closes)
      id: 'feast',
      kind: 'celebrate',
      t: [45.4, 53.6],
      year: {hold: 2021},
      caption: {
        t0: 45.2,
        title: 'เมืองสร้างสรรค์ด้านอาหาร',
        sub: '8 พ.ย. 2564 ยูเนสโกยกย่องเพชรบุรี เมืองน้ำตาลโตนด ถิ่นขนมหม้อแกง',
        note: '★ ปีเดียวกัน ป่าแก่งกระจานเป็นมรดกโลก',
      },
      era: 'ปัจจุบัน',
      callouts: [{t0: 47.6, t1: 51.4, label: 'ขนมหม้อแกง', dx: 90, dy: -120, p: [FAIR[0], 1.4, FAIR[1]]}],
      camera: [
        // down to the fair from the south-east: the tray in front, the hill behind it
        [45.6, -14, 1.5, 1, 64, 392, 32, 30],
        [49.4, -14.5, 1.5, 1, 48, 406, 31, 30],
        [53.4, -15, 1.5, 0, 56, 418, 32, 30],
      ],
    },
    {
      // the counter lands on 2569 and holds it before the finale card
      id: 'today',
      kind: 'today',
      t: [54.2, 56.0],
      year: [2025.6, 2026],
    },
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train runs in as the railway caption lands (it enters the tile 1 s after t0) and
// parks at the terminus
const [rail0] = STORY.at('railway');
export const SOUND_EVENTS = {
  trains: [{t0: rail0 - 0.8, dur: 4.6, dir: -1, modern: false}] as {t0: number; dur: number; dir: number; modern: boolean}[],
};
