// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates and wording from docs/briefs/ubon.md §3.0
// (pass 2: the Gemini research, re-checked). Built on what Korat and Chiang Mai share (brief §0):
// a living hero at frame 0, one founder, one turn of fortune, the train, a city filling both
// banks, and one tradition -- the candle -- seen three times in the same place. 60 s.
import {buildStory} from '../../engine/story';
import {between, type CameraKey} from '../../engine/glide';
import {CANDLE_AT, DON_MOT_DAENG, munZ, THUNG, WARIN_STATION, WAT_LUANG} from './places';

type Key = CameraKey;
const NAGA_END: Key = [7.8, 17, 1, munZ(17), 54, 185, 36, 30];
const MIG_IN: Key = [9.4, DON_MOT_DAENG[0] + 2, 1, DON_MOT_DAENG[1] - 5, 60, 200, 40, 30];
const MIG_END: Key = [14.0, DON_MOT_DAENG[0], 1, DON_MOT_DAENG[1] - 2, 56, 214, 38, 30];
const FLOOD_IN: Key = [15.2, DON_MOT_DAENG[0] - 5, 1, DON_MOT_DAENG[1] + 2, 58, 220, 40, 30];
const FLOOD_END: Key = [19.4, 9, 1, 7, 58, 232, 40, 30];
const TOWN_IN: Key = [20.8, 1, 1, 3, 62, 240, 44, 30];
const TOWN_END: Key = [26.4, 2, 1, 3, 56, 256, 46, 30];
const FRONT_IN: Key = [27.8, -6, 1, 0, 64, 266, 40, 30];
const FRONT_END: Key = [31.8, -1, 1, 0, 58, 282, 38, 30];
const CANDLE_IN: Key = [33.2, 0, 1, 0, 46, 294, 40, 30];
const CANDLE_END: Key = [37.4, 0, 1, 0, 44, 318, 40, 30];
const RAIL_IN: Key = [38.8, -3, 1, 36, 56, 330, 42, 30];
const RAIL_END: Key = [42.6, 3, 1, 14, 48, 350, 42, 30];
const GROW_IN: Key = [44.0, 0, 1, 8, 120, 362, 40, 30];
const GROW_END: Key = [49.0, 4, 1, 2, 200, 396, 37, 30];
const PAY_IN: Key = [50.2, 0, 3, 2, 66, 410, 36, 30];
const PAY_END: Key = [55.4, 0, 4, 0, 58, 430, 34, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: -1200,
  after: 2026,
  camera: [
    ...between(NAGA_END, MIG_IN, 4),
    ...between(MIG_END, FLOOD_IN, 3),
    ...between(FLOOD_END, TOWN_IN, 4),
    ...between(TOWN_END, FRONT_IN, 4),
    ...between(FRONT_END, CANDLE_IN, 4),
    ...between(CANDLE_END, RAIL_IN, 4, 0.4),
    ...between(RAIL_END, GROW_IN, 4),
    ...between(GROW_END, PAY_IN, 4, 0.3),
    [57.6, 0, 2, 2, 210, 444, 36, 30],
    [60, 0, 2, 2, 280, 452, 36, 30],
  ],
  beats: [
    {
      // the cover: a giant carved candle stands where ทุ่งศรีเมือง will be; the naga wound round
      // it comes alive, slides down into the Mun and swims upstream past the first fishers
      id: 'naga',
      kind: 'legend',
      t: [0, 8.2],
      year: {hold: -1000},
      caption: {t0: 3.3, title: 'ลุ่มน้ำมูล', sub: 'ราว 3,000 ปีก่อน คนริมน้ำหาปลา และวาดภาพปลาไว้บนผาแต้มริมโขง'},
      era: 'ก่อนประวัติศาสตร์',
      camera: [
        [0, CANDLE_AT[0], 7, CANDLE_AT[1], 330, 150, 34, 30],
        [2.4, CANDLE_AT[0] + 2, 6, CANDLE_AT[1] + 2, 110, 156, 33, 30],
        [4.4, 3, 2, 4, 64, 166, 40, 30],
        [6.2, 9, 1, munZ(9), 56, 175, 36, 30],
        NAGA_END,
      ],
    },
    {
      // 2314: after หนองบัวลุ่มภู fell, ท้าวคำผง and his kin bring their people south: carts and
      // elephants down from the north, rafts on the Mun, to the island camp at ดอนมดแดง
      id: 'migration',
      kind: 'procession',
      t: [8.6, 14.4],
      year: {hold: 1771},
      caption: {t0: 8.4, title: 'ล่องลำน้ำมูล', sub: 'พ.ศ. 2314 ท้าวคำผงพาผู้คนจากหนองบัวลุ่มภู มาตั้งค่ายที่ดอนมดแดง'},
      era: 'ธนบุรี',
      callouts: [{t0: 11.4, t1: 14.2, label: 'ดอนมดแดง', dx: 90, dy: -130, p: [DON_MOT_DAENG[0], 0.6, DON_MOT_DAENG[1]]}],
      camera: [MIG_IN, MIG_END],
    },
    {
      // the great flood (its year is disputed, so the caption names none): the Mun rises over
      // the camp and the boats go down to the high north bank, ดงอู่ผึ้ง, the bee forest
      id: 'flood',
      kind: 'disaster',
      t: [14.8, 19.8],
      year: [1776, 1781],
      caption: {t0: 14.6, title: 'น้ำท่วมใหญ่', sub: 'ผู้คนย้ายขึ้นที่สูงริมฝั่งมูล ป่ารังผึ้งที่เรียกว่า “ดงอู่ผึ้ง”'},
      camera: [FLOOD_IN, FLOOD_END],
    },
    {
      // 2335: Rama I raises the settlement to เมืองอุบลราชธานี; the town goes up round the field,
      // วัดหลวง on the bank
      id: 'founding',
      kind: 'build',
      t: [20.4, 26.8],
      year: {hold: 1792},
      caption: {t0: 20.2, title: 'ตั้งเมืองอุบลราชธานี', sub: 'พ.ศ. 2335 ท้าวคำผงเป็นเจ้าเมืองคนแรก ในนามพระประทุมวรราชสุริยวงศ์'},
      era: 'รัตนโกสินทร์',
      callouts: [{t0: 23.6, t1: 26.6, label: 'วัดหลวง', dx: 90, dy: -130, p: [WAT_LUANG[0], 1.4, WAT_LUANG[1]]}],
      camera: [TOWN_IN, TOWN_END],
    },
    {
      // 2436: after ร.ศ. 112 the town is a frontier capital; the commissioner's elephants come
      // in along the road and the new offices go up
      id: 'frontier',
      kind: 'trade',
      t: [27.4, 32.2],
      year: {hold: 1893},
      caption: {t0: 27.2, title: 'หัวเมืองชายแดน', sub: 'พ.ศ. 2436 หลังวิกฤต ร.ศ. 112 อุบลกลายเป็นเมืองหน้าด่าน'},
      camera: [FRONT_IN, FRONT_END],
    },
    {
      // 2444: the first candle procession: bound candles on carts round ทุ่งศรีเมือง
      id: 'firstcandle',
      kind: 'procession',
      t: [32.8, 37.8],
      year: {hold: 1901},
      caption: {t0: 32.6, title: 'แห่เทียนครั้งแรก', sub: 'พ.ศ. 2444 ต้นเทียนบนเกวียนแห่รอบทุ่งศรีเมือง'},
      callouts: [{t0: 35, t1: 37.6, label: 'ทุ่งศรีเมือง', dx: -90, dy: -130, p: [THUNG[0], 0.4, THUNG[1]]}],
      camera: [CANDLE_IN, CANDLE_END],
    },
    {
      // 1 เม.ย. 2473: the line from Si Sa Ket reaches สถานีวารินทร์ on the south bank; people cross
      // into town by boat and ferry
      id: 'railway',
      kind: 'arrive',
      t: [38.4, 43.0],
      year: {hold: 1930},
      caption: {t0: 38.2, title: 'รถไฟถึงวาริน', sub: '1 เมษายน พ.ศ. 2473 คนข้ามแม่น้ำมูลเข้าเมืองด้วยเรือและแพ'},
      callouts: [{t0: 38.8, t1: 40.6, label: 'สถานีวารินทร์', dx: 90, dy: -130, p: [WARIN_STATION[0], 1.2, WARIN_STATION[1]]}],
      camera: [RAIL_IN, [40.4, -1, 1, 36, 54, 338, 42, 30], RAIL_END],
    },
    {
      // 2497 on: the first bridge over the Mun, the air base, and the city across both banks
      id: 'growth',
      kind: 'grow',
      t: [43.6, 49.2],
      year: [1954, 2015],
      caption: {t0: 43.4, title: 'สองฝั่งมูล', sub: 'สะพานแห่งแรกเชื่อมอุบลกับวาริน แล้วเมืองก็ขยายเต็มสองฝั่ง'},
      era: 'ปัจจุบัน',
      camera: [GROW_IN, GROW_END],
    },
    {
      // the payoff: today's procession of giant carved candles round the field, and the naga
      // comes back up out of the Mun to coil round the great candle at its centre
      id: 'payoff',
      kind: 'celebrate',
      t: [49.6, 54.6],
      year: [2025, 2025.4],
      caption: {t0: 49.4, t1: 55.8, title: '125 ปี แห่เทียนอุบล', sub: 'ทุกเข้าพรรษา ต้นเทียนแกะสลักนับสิบต้นแห่รอบทุ่งศรีเมือง'},
      camera: [PAY_IN, PAY_END],
    },
    {id: 'today', kind: 'today', t: [54.8, 55.8], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;

// the first train comes in from the west (Si Sa Ket) to Warin as the railway caption lands
const [rail0] = STORY.at('railway');
export const SOUND_EVENTS = {
  trains: [{t0: rail0 - 0.2, dur: 3.6, dir: 1, modern: false, park: 1.2}] as {t0: number; dur: number; dir: number; modern: boolean; park?: number}[],
};
