// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); dates and wording from docs/briefs/chiangrai.md
// §3b and chiangrai_field.md §3. Built to the storyline standard (docs/storyline.md): the
// cover's hero (วัดร่องขุ่น at hero scale, owner's pick A), the elephant in the first beat, the
// storm and the procession in the danger zone, one verb per beat, a wide grow shot, and the
// temple back at the tile's south-west edge before the counter lands on today.
import {buildStory} from '../../engine/story';
import {AIRFIELD, CHOM_THONG, CHOM_THONG_H, GOLD_CLOCK, KLANG_WIANG, KOH_LOI, MONUMENT, PHRA_KAEW, RONG_KHUN, THANALAI_Z} from './places';

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1200,
  after: 2026,
  // transitions between beats
  camera: [
    [18.8, -3, 1, 6, 92, 52, 37, 30],
    [27.4, 2, 1, 1.5, 82, 104, 39, 30],
    [36.9, -1, 1, 14, 96, 182, 37, 30],
    [44.9, -16, 1, 26, 120, 268, 36, 30],
    [49.5, -12, 1, 20, 112, 322, 36, 30],
    [60, 2, 2, 0, 230, 380, 36, 30],
  ],
  beats: [
    {
      // the cover: วัดร่องขุ่น at hero scale over the whole tile, the hands rising; it folds into
      // the ground before the caption. Then the runaway elephant leads Mangrai's men to Doi Chom
      // Thong and an earth rampart goes up round the hill
      id: 'founding',
      kind: 'arrive',
      t: [0, 8.5],
      year: {hold: 1262},
      caption: {t0: 3.4, title: 'ตามช้างมาสร้างเวียง', sub: 'ตำนานเล่าว่าช้างของพญามังรายหนีมาถึงดอยจอมทอง จึงสร้างเวียง พ.ศ. 1805'},
      era: 'ล้านนา',
      callouts: [{t0: 6.0, t1: 8.3, label: 'ดอยจอมทอง', dx: -90, dy: -130, p: [CHOM_THONG[0], CHOM_THONG_H + 0.6, CHOM_THONG[1]]}],
      camera: [
        // three-quarter from the south-west on the whole tile (owner's pick), then down to the hill
        [0, 0, 1, 4, 330, -35, 36, 30],
        [3, 0, 1, 5, 290, -30, 35, 30],
        [5.8, -5, 1, -6, 82, -18, 36, 30],
        [8.3, -7, 1.5, -6, 60, -4, 37, 30],
      ],
    },
    {
      // a storm: lightning splits the chedi at วัดป่าเยี้ยะ and the green image shows through
      id: 'emerald',
      kind: 'discover',
      t: [8.8, 11.8],
      year: {hold: 1434},
      caption: {t0: 8.8, title: 'ฟ้าผ่าเจดีย์ เจอพระแก้ว', sub: 'พ.ศ. 1977 ที่วัดป่าเยี้ยะ (ตามตำนาน)'},
      callouts: [{t0: 9.6, t1: 11.7, label: 'วัดพระแก้ว', dx: 90, dy: -130, p: [PHRA_KAEW[0], 1.6, PHRA_KAEW[1]]}],
      camera: [
        [9.0, -4.1, 1, -1.8, 42, 4, 36, 30],
        [11.7, -4.1, 1, -1.8, 34, 22, 36, 30],
      ],
    },
    {
      // Chiang Mai's procession takes the image south-west; the elephant balks at the fork and
      // turns south for Lampang
      id: 'procession',
      kind: 'procession',
      t: [12.0, 18.2],
      year: {hold: 1436},
      caption: {t0: 11.9, title: 'ช้างไม่ยอมไปเชียงใหม่', sub: 'พ.ศ. 1979 ขบวนอัญเชิญพระแก้วมรกตออกจากเมือง ช้างเบนไปทางลำปางถึงสามครั้ง (ตามตำนาน)'},
      camera: [
        [12.4, -5, 1, 1, 50, 20, 36, 30],
        [15.2, -7, 1, 6, 52, 30, 36, 30],
        [18.0, -7.5, 1, 11, 56, 42, 36, 30],
      ],
    },
    {
      // the empty town under forest; about 1,000 families come up from the south with elephants
      // and carts, clear it and raise the brick wall and its moat
      id: 'revival',
      kind: 'arrive',
      t: [19.4, 27.0],
      year: [1838, 1843.45],
      caption: {t0: 19.2, title: 'ฟื้นเมืองที่ร้างไปนาน', sub: 'พ.ศ. 2386 เจ้าหลวงธรรมลังกานำราว 1,000 ครอบครัวมาตั้งเมืองใหม่ ก่อกำแพงอิฐ ขุดคูรอบ'},
      era: 'รัตนโกสินทร์',
      callouts: [{t0: 23.6, t1: 26.8, label: 'วัดกลางเวียง', dx: 90, dy: -120, p: [KLANG_WIANG[0], 1.4, KLANG_WIANG[1]]}],
      camera: [
        [19.6, 2, 1, 8, 78, 62, 38, 30],
        [23.2, 2, 1, 3, 70, 78, 38, 30],
        [26.8, 3, 1, 1, 72, 96, 38, 30],
      ],
    },
    {
      // the first straight street is cut east-west through the walled town; the walls go soon after
      id: 'streets',
      kind: 'build',
      t: [28.0, 32.0],
      year: [1895, 1897],
      caption: {t0: 27.8, title: 'ถนนตรงผ่ากลางเวียง', sub: 'พ.ศ. 2438 ตัดถนนธนาลัยกลางเมือง ไม่นานกำแพงก็ถูกรื้อ'},
      callouts: [{t0: 29.4, t1: 31.8, label: 'ถนนธนาลัย', dx: 90, dy: -120, p: [6, 0.2, THANALAI_Z]}],
      camera: [
        [28.2, 1, 1, 2, 64, 112, 42, 30],
        [31.8, 3, 1, 2, 58, 132, 42, 30],
      ],
    },
    {
      // the town's airfield, 2.6 km south: a biplane comes in over the paddies and lands
      id: 'airfield',
      kind: 'arrive',
      t: [32.4, 36.4],
      year: {hold: 1923},
      caption: {t0: 32.2, title: 'สนามบินแห่งแรกของเมือง', sub: 'พ.ศ. 2466 สร้างสนามบินทางใต้ตัวเมืองราว 2.6 กม.'},
      callouts: [{t0: 34.2, t1: 36.2, label: 'สนามบินเก่า', dx: -90, dy: -120, p: [AIRFIELD[0], 0.3, AIRFIELD[1]]}],
      camera: [
        [32.6, -3.4, 2.5, 33, 50, 156, 32, 30],
        [36.2, -3.4, 1, 27, 40, 170, 33, 30],
      ],
    },
    {
      // the wide shot: the town spreads over both banks of the Kok, เกาะลอย is settled, the
      // Mangrai monument goes up at ห้าแยกพ่อขุน
      id: 'growth',
      kind: 'grow',
      t: [37.4, 44.6],
      year: [1925, 1995],
      caption: {t0: 37.2, title: 'เมืองโตข้ามแม่น้ำกก', sub: 'แม่น้ำกกเปลี่ยนทางจนเกิดเกาะลอย บ้านเรือนขยายเต็มสองฝั่ง อนุสาวรีย์พญามังรายตั้งที่ห้าแยกพ่อขุน'},
      callouts: [
        {t0: 38.6, t1: 41.2, label: 'เกาะลอย', dx: 90, dy: -120, p: [KOH_LOI[0], 0.4, KOH_LOI[1]]},
        {t0: 41.6, t1: 44.4, label: 'อนุสาวรีย์พญามังราย', dx: 90, dy: -130, p: [MONUMENT[0], 1.8, MONUMENT[1]]},
      ],
      camera: [
        [37.6, 2, 1, -1, 124, 200, 38, 30],
        [41.0, 3, 1, -2, 160, 226, 37, 30],
        [44.4, -2, 1, 6, 186, 252, 37, 30],
      ],
    },
    {
      // the payoff: วัดร่องขุ่น rises at the tile's south-west edge, the hands of the cover with it
      id: 'temple',
      kind: 'build',
      t: [45.4, 49.4],
      year: [1997, 1998.4],
      caption: {t0: 45.2, title: 'วัดร่องขุ่น วัดสีขาวทั้งหลัง', sub: 'พ.ศ. 2540 อ.เฉลิมชัย โฆษิตพิพัฒน์ เริ่มสร้างใหม่ ห่างเมืองราว 12 กม.'},
      era: 'ปัจจุบัน',
      callouts: [{t0: 46.6, t1: 49.4, label: 'วัดร่องขุ่น', dx: 90, dy: -130, p: [RONG_KHUN[0], 2.4, RONG_KHUN[1]]}],
      camera: [
        [45.6, RONG_KHUN[0], 1.5, RONG_KHUN[1], 60, 282, 34, 30],
        [49.2, RONG_KHUN[0], 1.5, RONG_KHUN[1], 48, 304, 33, 30],
      ],
    },
    {
      // Chiang Rai, City of Design: the gold clock tower's light show, the crowd round it
      id: 'design',
      kind: 'celebrate',
      t: [49.8, 54.0],
      year: {hold: 2023},
      caption: {t0: 49.6, title: 'เมืองแห่งการออกแบบ', sub: '31 ต.ค. 2566 ยูเนสโกยกย่องเป็นเมืองสร้างสรรค์ด้านการออกแบบ'},
      callouts: [{t0: 50.8, t1: 53.8, label: 'หอนาฬิกาทอง', dx: 90, dy: -130, p: [GOLD_CLOCK[0], 2.6, GOLD_CLOCK[1]]}],
      camera: [
        [50.0, GOLD_CLOCK[0], 1, GOLD_CLOCK[1], 66, 336, 36, 30],
        [54.0, GOLD_CLOCK[0] + 0.4, 1, GOLD_CLOCK[1] - 1, 58, 352, 36, 30],
      ],
    },
    {
      // the counter lands on 2569 and holds it before the finale card
      id: 'today',
      kind: 'today',
      t: [54.4, 56.0],
      year: [2025.6, 2026],
    },
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
export const SOUND_EVENTS = {trains: [] as {t0: number; dur: number; dir: number; modern: boolean}[]};
