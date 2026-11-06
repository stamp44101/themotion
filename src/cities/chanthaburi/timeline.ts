// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// "Storyline (proposed by cloud, 6 Nov)" table (docs/briefs/chanthaburi.md): cut / build / smash / sail / move / return /
// occupy-leave / raise / grow / trade. Held years: 2310, 2377, 2419, 2436, 2447. The Narai wall has no held year
// ("สมัยพระนารายณ์"), the cathedral is "ราว 2452", the spires' removal and return carry no year, and the 2511 fire story
// and the "100 ships" are dropped. War weight: nobody hurt on screen; the smash is pots and a gate; the French beat is
// flags, buildings and a ship leaving.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {CATHEDRAL, GATE, HERO_AT, MARKET, NOEN_WONG} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
const [HX, HZ] = HERO_AT;
// the cover: the giant lap and the yellow stone on the tile, the whole tile round it (owner's cover rule)
const C0: Key = [0, HX + 6, 29, HZ + 5, 300, 18, 13, 30];
const C1: Key = [2.0, HX + 6, 29.5, HZ + 5, 304, 22, 14, 30];
// the gem comes down onto Khao Ploi Waen at the tile's west edge; the camera, from the south-west, already has the river
// bend where the wall rises beyond it
const HERO_END: Key = [3.9, -19, 4, -2, 92, -54, 26, 30];
// the Ban Lum wall rising, the hill and its stone still in the corner of the frame, then in to the wall and the landing
const BU_IN: Key = [5.2, -16, 2, -3, 82, -46, 30, 30];
const BU_MID: Key = [7.4, -3, 1, -4, 64, -16, 32, 30];
const BU_END: Key = [8.9, -1, 1, -3, 56, 8, 34, 30];
// 2310: the pots and the south gate at night, from the fields to the south
const SM_IN: Key = [10.0, GATE[0] + 0.2, 1, GATE[1] + 2.6, 32, 22, 30, 30];
const SM_END: Key = [15.6, GATE[0] - 0.2, 1, GATE[1] + 0.6, 30, 44, 32, 30];
// the fleet down the lower river to the mouth
const SA_IN: Key = [17.2, -11, 1, 22, 56, 70, 32, 30];
const SA_END: Key = [20.6, -17, 1, 43, 60, 100, 30, 30];
// 2377: the column carries the wall to Noen Wong
const MV_IN: Key = [22.2, -10, 1, 5.5, 50, 128, 34, 30];
const MV_END: Key = [25.6, -16, 1, 10, 42, 112, 38, 30];
// 2419: back to Ban Lum, the waterfront row
const RT_IN: Key = [26.8, -9, 1, 6, 46, 132, 34, 30];
// in close on the landing for a second: the boats and the people walking up to their doors
const RT_MID: Key = [28.4, 5.4, 0.8, 7.6, 27, 156, 32, 30];
const RT_END: Key = [29.6, 5.4, 0.8, 7.4, 26, 162, 32, 30];
// 2436: the French flag over the camp
const OC_IN: Key = [30.6, 0.8, 1, -1.0, 34, 188, 32, 30];
const OC_END: Key = [32.8, 0.8, 1, -0.8, 32, 204, 32, 30];
// 2447: the flag comes down, the ship leaves down the river
// in on the camp's flagpole: the tricolour comes down, the elephant flag goes up; then out after the steamer
const LV_IN: Key = [33.6, 1.2, 2.6, -0.4, 28, 220, 22, 30];
const LV_MID: Key = [35.0, 1.4, 2.6, -0.2, 29, 228, 22, 30];
const LV_END: Key = [35.9, 2.6, 1.6, 1.6, 36, 236, 26, 30];
// ราว 2452: the cathedral across the river from the waterfront
const RS_IN: Key = [37.0, CATHEDRAL[0] + 0.4, 2.0, CATHEDRAL[1], 34, 244, 22, 30];
const RS_END: Key = [40.6, CATHEDRAL[0] + 0.6, 2.2, CATHEDRAL[1], 30, 256, 22, 30];
// the grow shot: the whole tile
const GR_IN: Key = [42.0, -5, 1, 10, 160, 300, 34, 30];
const GR_END: Key = [47.2, -5, 1, 10, 200, 334, 34, 30];
// the gem market on Si Chan road at dusk, the stone back over the street
const PY_IN: Key = [49.2, MARKET[0] - 0.2, 1.4, MARKET[1], 36, 352, 30, 30];
const PY_END: Key = [53.0, MARKET[0] + 0.2, 1.4, MARKET[1], 30, 370, 30, 30];
// the landing: the whole tile again at the cover's distance, now full of town
const END: Key = [55.4, -6, 4, 9, 280, 378, 22, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1650,
  after: 2026,
  camera: [
    ...between(C1, HERO_END, 6),
    HERO_END,
    ...between(HERO_END, BU_IN, 4),
    ...between(BU_END, SM_IN, 4),
    ...between(SM_END, SA_IN, 5, 0.3),
    ...between(SA_END, MV_IN, 5, 0.3),
    ...between(MV_END, RT_IN, 4),
    ...between(RT_END, OC_IN, 4),
    ...between(OC_END, LV_IN, 4),
    ...between(LV_END, RS_IN, 4),
    ...between(RS_END, GR_IN, 5),
    ...between(GR_END, PY_IN, 5, 0.1),
    ...between(PY_END, END, 5),
    END,
    [60, -6, 4, 9, 300, 386, 22, 30],
  ],
  beats: [
    {
      // the cover (owner's pick A2): a rough yellow sapphire (บุษราคัม), held on its ไม้ทวน against a spinning lap; at
      // frame 0 half its brown-black crust is gone; the last chips fly by 2.2 s, the gem lifts, turns, then shrinks and
      // settles on Khao Ploi Waen to the west, where the stone is dug (Gemini §2)
      id: 'hero',
      kind: 'discover',
      // no caption and no counter on the gem: the cut is done under the title (counter fades in at 3 s, on the wall), so no
      // year is paired with the stone (the trade is recorded only from ~2365)
      t: [0, 3.0],
      year: [1650, 1654],
      era: 'อยุธยา',
      camera: [C0, C1],
    },
    {
      // the Ban Lum laterite wall and moat (Narai's reign: no held year; ONEP §5.2.1), junks at the landing
      id: 'build',
      kind: 'build',
      t: [3.2, 9.4],
      year: [1656, 1688],
      caption: {t0: 3.4, title: 'กำแพงศิลาแลงบ้านลุ่ม', sub: 'สมัยพระนารายณ์ ตั้งเมืองฝั่งตะวันตกของแม่น้ำจันท์'},
      camera: [BU_IN, BU_MID, BU_END],
    },
    {
      // 14->15 Jun 2310, night: the pots smashed before the walls (the chronicle's story), the elephant พังคีรีบัญชร
      // breaks the gate, the torches pour in. Nobody is hurt on screen.
      id: 'smash',
      kind: 'fight',
      t: [9.8, 16.0],
      year: {hold: 1767},
      caption: {t0: 9.8, title: 'ทุบหม้อข้าวตีเมืองจันท์', sub: 'พ.ศ. 2310 ตามพงศาวดาร พระยาตากให้ทหารทุบหม้อข้าวก่อนเข้าตีเมือง'},
      era: 'ธนบุรี',
      camera: [SM_IN, SM_END],
    },
    {
      // ~Oct 2310: the fleet sails down the river and out of the mouth (no count of ships, no shipyard named)
      id: 'sail',
      kind: 'procession',
      t: [16.4, 20.8],
      year: [1767.46, 1767.48],
      caption: {t0: 16.4, title: 'ทัพเรือออกจากปากน้ำ', sub: 'ห้าเดือนต่อมา ทัพเรือแล่นออกทะเลไปกู้กรุงศรีอยุธยา'},
      camera: [SA_IN, SA_END],
    },
    {
      // 2377 (Rama III): the forts at the mouth, the camp at Noen Wong (560 x 600 m, laterite); the Ban Lum wall comes
      // down and its stones go up to the new camp; the small church crosses to the east bank
      id: 'move',
      kind: 'build',
      t: [21.2, 25.8],
      year: {hold: 1834},
      caption: {t0: 21.2, title: 'ย้ายเมืองขึ้นเนินวง', sub: 'พ.ศ. 2377 สร้างค่ายศิลาแลงบนเนิน และป้อมที่ปากน้ำ'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'ค่ายเนินวง', dx: -130, dy: -150, p: [NOEN_WONG[0], 2.6, NOEN_WONG[1]], t0: 22.6, t1: 25.6}],
      camera: [MV_IN, MV_END],
    },
    {
      // 2419 (ONEP ผ.2): the town back at Ban Lum; the wooden waterfront row along the west bank
      id: 'return',
      kind: 'arrive',
      t: [26.2, 29.8],
      year: {hold: 1876},
      caption: {t0: 26.2, title: 'กลับมาริมแม่น้ำจันท์', sub: 'พ.ศ. 2419 ย้ายเมืองกลับบ้านลุ่ม เรือนไม้เรียงริมน้ำ'},
      camera: [RT_IN, RT_MID, RT_END],
    },
    {
      // the French hold the town as surety after ร.ศ. 112: their flag over the camp in town (2436)
      id: 'occupy',
      kind: 'procession',
      t: [30.2, 33.0],
      year: {hold: 1893},
      caption: {t0: 30.2, t1: 36.0, title: 'ฝรั่งเศสยึดเมืองจันท์', sub: 'พ.ศ. 2436 ยึดไว้เป็นประกัน ถอนทหารออกไป พ.ศ. 2447'},
      camera: [OC_IN, OC_END],
    },
    {
      // 2447: the French flag down, the Siamese flag (the white elephant on red) up; the ship leaves down the river
      id: 'leave',
      kind: 'arrive',
      t: [33.2, 36.0],
      year: {hold: 1904},
      camera: [LV_IN, LV_MID, LV_END],
    },
    {
      // the present cathedral, Gothic, twin spires, on the east bank (laid 2449, blessed 2452: not confirmed, so "ราว")
      id: 'raise',
      kind: 'celebrate',
      t: [36.4, 40.8],
      year: [1906, 1912],
      caption: {t0: 36.4, title: 'อาสนวิหารริมแม่น้ำจันท์', sub: 'ราว พ.ศ. 2452 ชาวญวนคาทอลิกสร้างโบสถ์ยอดแหลมคู่ฝั่งตะวันออก'},
      callouts: [{label: 'อาสนวิหาร', dx: 120, dy: -170, p: [CATHEDRAL[0] + 0.3, 3.6, CATHEDRAL[1]], t0: 37.6, t1: 40.6}],
      camera: [RS_IN, RS_END],
    },
    {
      // the grow shot: the town spreads west along the new road, orchards fill the hills; the spires come down in the war
      // and go back up (no year on screen)
      id: 'grow',
      kind: 'grow',
      t: [41.2, 48.0],
      year: [1937, 2017],
      caption: {t0: 41.2, title: 'เมืองโตไปตามถนน', sub: 'สวนผลไม้ขึ้นเต็มเนิน ยอดโบสถ์ถูกรื้อช่วงสงคราม แล้วสร้างคืน'},
      era: 'ปัจจุบัน',
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the weekend gem market on Si Chan road, crowds at the tables, the yellow stone back over the street
      id: 'trade',
      kind: 'trade',
      t: [48.4, 54.0],
      year: [2025, 2025.4],
      caption: {t0: 48.4, t1: 54.4, title: 'ตลาดพลอยถนนศรีจันทร์', sub: 'พ่อค้าพลอยจากทั่วโลกมาส่องพลอยกันทุกสุดสัปดาห์'},
      callouts: [{label: 'บุษราคัม', dx: 150, dy: -140, p: [MARKET[0] + 0.2, 4.4, MARKET[1]], t0: 50.0, t1: 53.6}],
      camera: [PY_IN, PY_END],
    },
    {id: 'today', kind: 'today', t: [54.4, 55.6], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
