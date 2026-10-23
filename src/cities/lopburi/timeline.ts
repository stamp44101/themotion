// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates and wording from docs/briefs/lopburi.md §3
// and the Gemini research, spot-checked (PR #67). The hero is the city's legend made alive:
// Hanuman, given the city by Rama, lands where Lopburi will stand, and his "descendants", the
// macaques of พระปรางค์สามยอด, stay through every age and sit down to their buffet at the end. 60 s.
import {buildStory} from '../../engine/story';
import {between, type CameraKey} from '../../engine/glide';
import {PALACE, PRANG, RIVER, SAN_PHRA_KAN, WAT_NAKHON_KOSA} from './places';

type Key = CameraKey;
const PX = (PALACE.x0 + PALACE.x1) / 2;
const PZ = (PALACE.z0 + PALACE.z1) / 2;
// [t, target x, y, z, distance, azimuth, elevation, fov]
const LEG_END: Key = [7.8, PRANG[0], 2, PRANG[1], 76, 214, 34, 30];
const LAVO_IN: Key = [9.0, -3, 1, -1, 64, 240, 40, 30];
const LAVO_END: Key = [13.6, -2, 1, -1, 62, 256, 40, 30];
const ELE_IN: Key = [15.0, -10, 1, -4, 62, 266, 36, 30];
const ELE_END: Key = [19.0, -13, 1, 1, 62, 278, 36, 30];
const PRANG_IN: Key = [20.4, PRANG[0] + 1, 2, PRANG[1], 48, 288, 36, 30];
const PRANG_END: Key = [24.8, PRANG[0] + 2, 2, PRANG[1], 46, 302, 36, 30];
const NARAI_IN: Key = [26.0, PX, 1.5, PZ, 56, 312, 42, 30];
const NARAI_END: Key = [30.6, PX + 1, 1.5, PZ, 52, 326, 42, 30];
const FR_IN: Key = [31.8, PX - 4, 1, PZ + 4, 62, 336, 38, 30];
const FR_END: Key = [36.2, PX - 2, 1.5, PZ + 1, 58, 350, 40, 30];
const FADE_IN: Key = [37.4, PX + 2, 1, PZ - 2, 76, 360, 42, 30];
const FADE_END: Key = [40.6, PX + 3, 1, PZ - 2, 70, 368, 42, 30];
const RAIL_IN: Key = [41.8, PRANG[0] + 1.5, 1, PRANG[1] - 4, 56, 378, 36, 30];
const RAIL_END: Key = [45.0, PRANG[0] + 1.5, 1, PRANG[1], 50, 390, 36, 30];
const GROW_IN: Key = [46.2, 6, 1, 0, 130, 402, 38, 30];
const GROW_END: Key = [49.4, 10, 1, 0, 160, 420, 36, 30];
const PAY_IN: Key = [51.4, PRANG[0] + 2, 2, PRANG[1] + 1, 62, 436, 34, 30];
const PAY_END: Key = [54.6, PRANG[0] + 3, 2, PRANG[1] + 1, 52, 452, 34, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: -1500,
  after: 2026,
  camera: [
    ...between(LEG_END, LAVO_IN, 4),
    ...between(LAVO_END, ELE_IN, 4),
    ...between(ELE_END, PRANG_IN, 4),
    ...between(PRANG_END, NARAI_IN, 4),
    ...between(NARAI_END, FR_IN, 4),
    ...between(FR_END, FADE_IN, 4),
    ...between(FADE_END, RAIL_IN, 4),
    ...between(RAIL_END, GROW_IN, 4),
    ...between(GROW_END, PAY_IN, 4, 0.3),
    [57.6, 2, 2, 0, 220, 470, 36, 30],
    [60, 2, 2, 0, 300, 482, 36, 30],
  ],
  beats: [
    {
      // the cover: the legend. Hanuman leaps in across the whole tile and lands where the city
      // will stand; a troop of macaques runs round him. In the forest, the first metal-workers'
      // fires smoke by the river (copper was smelted round Lopburi ~3,500 years ago)
      id: 'legend',
      kind: 'legend',
      t: [0, 8.2],
      year: {hold: -1500},
      caption: {t0: 3.3, title: 'ตำนานเมืองลพบุรี', sub: 'ตามตำนาน พระรามยกเมืองนี้ให้หนุมาน'},
      era: 'ก่อนประวัติศาสตร์',
      camera: [
        [0, PRANG[0] + 4, 9, PRANG[1] + 9, 320, 140, 34, 30],
        [3, PRANG[0] + 6, 5, PRANG[1], 170, 150, 31, 30],
        [5.8, PRANG[0] + 4, 3, PRANG[1], 96, 180, 30, 30],
        LEG_END,
      ],
    },
    {
      // Dvaravati ลวปุระ: a moated town by the river, a brick stupa (วัดนครโกษา's base), boats
      id: 'lavo',
      kind: 'build',
      t: [8.6, 14.4],
      // only 40 years: the engine clears the in-city forest over 1.2 years and the city ground
      // over 1.5, so the curve must run slowly here or both snap in one frame (check_render)
      year: [650, 690],
      caption: {t0: 8.4, title: 'ละโว้', sub: 'พุทธศตวรรษที่ 12–14 เมืองทวารวดีริมแม่น้ำลพบุรี เหรียญเงินเรียกชื่อว่า “ลวปุระ”'},
      era: 'ทวารวดี',
      callouts: [{t0: 11.2, t1: 14.2, label: 'วัดนครโกษา', dx: 90, dy: -130, p: [WAT_NAKHON_KOSA[0], 1.2, WAT_NAKHON_KOSA[1]]}],
      camera: [LAVO_IN, LAVO_END],
    },
    {
      // 1155 (Song records): Lavo sends trained elephants to the Chinese emperor; they walk down
      // to a junk on the river, and it sails away downstream
      id: 'elephants',
      kind: 'trade',
      t: [14.8, 19.8],
      year: {hold: 1155},
      caption: {t0: 14.6, title: 'ช้างละโว้ไปเมืองจีน', sub: 'พ.ศ. 1698 ละโว้ส่งช้างที่ฝึกแล้วไปถวายจักรพรรดิราชวงศ์ซ่ง'},
      era: 'ละโว้',
      camera: [ELE_IN, ELE_END],
    },
    {
      // Jayavarman VII's three towers go up in laterite, and the naga-sheltered Buddha is carried in
      id: 'prang',
      kind: 'procession',
      t: [20.2, 25.6],
      year: [1185, 1215],
      caption: {t0: 20.0, title: 'พระปรางค์สามยอด', sub: 'พุทธศตวรรษที่ 18 ศิลปะบายน สมัยพระเจ้าชัยวรมันที่ 7 แห่งกัมพูชา'},
      era: 'เขมร',
      callouts: [{t0: 22.4, t1: 25.4, label: 'พระปรางค์สามยอด', dx: -90, dy: -140, p: [PRANG[0], 3, PRANG[1]]}],
      camera: [PRANG_IN, PRANG_END],
    },
    {
      // 1666: Narai's second capital. The white palace wall with its lamp niches rises on the
      // river, the halls inside; clay pipes bring water from ทะเลชุบศร and the fountains play
      id: 'narai',
      kind: 'build',
      t: [26.0, 31.2],
      year: {hold: 1666},
      caption: {t0: 25.8, title: 'ราชธานีที่สอง', sub: 'พ.ศ. 2209 สมเด็จพระนารายณ์สร้างวังริมแม่น้ำลพบุรี ต่อท่อน้ำดินเผาจากทะเลชุบศร'},
      era: 'อยุธยา',
      callouts: [{t0: 28.0, t1: 31.0, label: 'พระนารายณ์ราชนิเวศน์', dx: 90, dy: -140, p: [PX, 1.5, PZ]}],
      camera: [NARAI_IN, NARAI_END],
    },
    {
      // 1685: the French embassy comes up the river in a fleet of boats; elephants line the bank.
      // On 11 December the king watches a total lunar eclipse with the Jesuits' telescopes
      id: 'french',
      kind: 'arrive',
      t: [31.6, 36.8],
      year: {hold: 1685},
      caption: {t0: 31.4, title: 'ราชทูตฝรั่งเศส', sub: 'พ.ศ. 2228 คณะทูตมาเข้าเฝ้า 11 ธันวาคม ทอดพระเนตรจันทรุปราคากับบาทหลวงเยซูอิต'},
      camera: [FR_IN, FR_END],
    },
    {
      // 1688: Narai dies; the lamps go out, the court goes back to Ayutthaya, the forest climbs
      // the walls and the monkeys move in. 1856-62: Rama IV clears it and builds พิมานมงกุฎ
      id: 'fade',
      kind: 'discover',
      t: [37.2, 41.0],
      year: [1688, 1862],
      caption: {t0: 37.0, title: 'เมืองร้าง', sub: 'พระนารายณ์สวรรคต วังร้างนับร้อยปี จน ร.4 มาบูรณะ'},
      era: 'รัตนโกสินทร์',
      camera: [FADE_IN, FADE_END],
    },
    {
      // 1 เม.ย. 2444: the Northern Line runs between the prang and ศาลพระกาฬ; shophouses rise
      // round the station
      id: 'railway',
      kind: 'arrive',
      t: [41.4, 45.4],
      year: {hold: 1901},
      caption: {t0: 41.0, title: 'รถไฟสายเหนือ', sub: '1 เม.ย. 2444 รถไฟผ่านกลางระหว่างพระปรางค์กับศาลพระกาฬ'},
      callouts: [
        {t0: 41.6, t1: 43.6, label: 'ศาลพระกาฬ', dx: 90, dy: -130, p: [SAN_PHRA_KAN[0], 1.5, SAN_PHRA_KAN[1]]},
      ],
      camera: [RAIL_IN, RAIL_END],
    },
    {
      // 2480 on: the new town east of the line, the army camps, and the city filling the plain
      id: 'growth',
      kind: 'grow',
      t: [45.8, 50.2],
      year: [1937, 2015],
      caption: {t0: 45.6, title: 'เมืองใหม่', sub: 'สมัยจอมพล ป. เมืองขยายไปทางตะวันออก มีค่ายทหารและวงเวียนสระแก้ว'},
      era: 'ปัจจุบัน',
      camera: [GROW_IN, GROW_END],
    },
    {
      // the payoff: the monkey buffet (since 2532) laid out at the prang, and Hanuman comes back
      // and sits down among his troop
      id: 'payoff',
      kind: 'celebrate',
      t: [50.6, 54.6],
      year: [2025, 2025.4],
      caption: {t0: 50.4, t1: 55.8, title: 'โต๊ะจีนลิง', sub: 'ทุกปลายพฤศจิกายน ชาวลพบุรีเลี้ยงลิงหน้าพระปรางค์สามยอด'},
      camera: [PAY_IN, PAY_END],
    },
    {id: 'today', kind: 'today', t: [54.8, 55.8], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train comes down from the north as the railway caption lands; a modern one in the
// growth shot
const [rail0] = STORY.at('railway');
export const SOUND_EVENTS = {
  trains: [{t0: rail0 + 0.1, dur: 4.0, dir: 1, modern: false}] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[],
};
export {RIVER};
