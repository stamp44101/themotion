// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/pattani.md; the owner delegated the pick to cloud, 20 Nov 2569): hero / cast / haul / port
// / taken / newtown / bridge / grow / fair / today. Held years: 2145 (the Dutch factory at Patani) and the landing on 2569.
// The casting (Raja Hijau or Raja Biru's reign, the founder's dates disputed), Krue Se's age (disputed), the gun's removal
// (2328 or 2329), the move to Chabang Tiga (2388-2399), the Dechanuchit bridge (~2469, one news item) and the Central
// Mosque (2497-2506, travel sites) are named in no sub: the counter does not hold them.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {CANNON_AT, CENTRAL_MOSQUE, CHABANG_TIGA, DECHA_BRIDGE, ISTANA, KRUESE, LANDING, PITS, SHRINE} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the whole tile from the south-south-west, the giant cannon on the plain under the title, the bay behind
const C0: Key = [0, 24, 4, -14, 300, -8, 36, 30];
const C1: Key = [2.8, 25, 4, -13, 268, -3, 35, 30];
// cast: the three moulds in their pits south of Krue Se, from the south-south-east (the mosque behind them)
const CA_IN: Key = [4.6, PITS[0] + 0.2, 0.5, PITS[1] - 2.4, 32, 18, 41, 30];
const CA_END: Key = [8.2, PITS[0] + 0.4, 0.5, PITS[1] - 2.2, 29, 30, 41, 30];
// haul: the big gun dragged north to the palace gate, from the south-east
const HA_IN: Key = [9.4, 41.8, 0.5, -1.0, 26, 60, 42, 30];
const HA_END: Key = [14.2, 41.2, 0.5, -3.6, 25, 80, 42, 30];
// port: the bay off Kru Se, the ships coming in round the spit, from the south
const PO_IN: Key = [15.6, 32.0, 1, -16.0, 66, 8, 40, 30];
const PO_END: Key = [19.8, 36.0, 1, -13.0, 54, 26, 40, 30];
// taken: the gun dragged to the landing and shipped out of the bay, from the south-east, following the ship west
const TA_IN: Key = [21.8, LANDING[0] + 0.4, 0.5, LANDING[1] + 1.4, 27, 95, 42, 30];
const TA_END: Key = [26.2, 31.0, 1, -17.0, 58, 40, 40, 30];
// newtown: up the river into the new town, from the north-north-east swinging round to the south
const NT_IN: Key = [27.8, 1.0, 1, -5.0, 48, 160, 41, 30];
const NT_END: Key = [32.2, 0.8, 1, 3.0, 46, 196, 41, 30];
// bridge: the truss over the river in the town, from the south-east
const BR_IN: Key = [33.6, DECHA_BRIDGE[0], 0.5, DECHA_BRIDGE[1], 22, 150, 40, 30];
const BR_END: Key = [37.4, DECHA_BRIDGE[0], 0.5, DECHA_BRIDGE[1], 19, 118, 40, 30];
// grow: the whole town and the bay from the south, spreading along both banks and out toward Kru Se
const GR_IN: Key = [39.8, 6, 1, -6, 162, -6, 37, 30];
const GR_END: Key = [44.4, 7, 1, -6, 178, 16, 37, 30];
// fair: the procession wading the river below the bridge, from the south-east
const FA_IN: Key = [47.0, 0.4, 0.5, 3.2, 22, 140, 40, 30];
const FA_MID: Key = [49.8, -0.4, 0.5, 3.8, 20, 160, 40, 30];
// the pull-back: the giant cannon stands again on the plain beside the grown town
const FA_END: Key = [52.4, 30, 3, 8, 132, 4, 37, 30];
const FA_HOLD: Key = [54.2, 31, 3, 7, 142, 2, 37, 30];
// the landing: the whole tile again at the cover's distance, now a city; the night comes down on the Central Mosque
const END: Key = [56.4, 24, 4, -13, 300, -3, 36, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1570,
  after: 2026,
  camera: [
    ...between(C1, CA_IN, 4),
    ...between(CA_END, HA_IN, 3),
    ...between(HA_END, PO_IN, 3),
    ...between(PO_END, TA_IN, 3),
    ...between(TA_END, NT_IN, 4, 0.2),
    ...between(NT_END, BR_IN, 3),
    ...between(BR_END, GR_IN, 4, 0.1),
    ...between(GR_END, FA_IN, 4, 0.1),
    ...between(FA_MID, FA_END, 5),
    ...between(FA_END, FA_HOLD, 3),
    ...between(FA_HOLD, END, 3),
    END,
    [60, 24, 4, -13, 310, 3, 36, 30],
  ],
  beats: [
    {
      // the cover: a giant cannon cast on the land, the bronze pouring, the clay mould knocked off. No year under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1577, 1578],
      camera: [C0, C1],
    },
    {
      // three guns cast for the queen (Raja Hijau or Raja Biru: disputed); the founder Lim To Khiam in the legend
      id: 'cast',
      kind: 'build',
      t: [3.0, 8.5],
      year: [1578, 1590],
      caption: {t0: 3.2, title: 'หล่อปืนใหญ่ถวายราชินี', sub: 'ตำนานว่าช่างคือหลิมโต๊ะเคี่ยม ชาวจีน'},
      era: 'ยุคราชินีปัตตานี',
      callouts: [{label: 'มัสยิดกรือเซะ', dx: 130, dy: -170, p: [KRUESE[0], 1.4, KRUESE[1]], t0: 5.6, t1: 8.2}],
      camera: [CA_IN, CA_END],
    },
    {
      // the big gun dragged into the palace on rollers by the townspeople; a salute at the gate
      id: 'haul',
      kind: 'procession',
      t: [8.5, 14.5],
      year: [1590, 1601.4],
      caption: {t0: 8.6, title: 'ลากพญาตานีเข้าวังกรือเซะ', sub: 'ยาว 2.7 เมตร ปืนใหญ่ที่สุดที่เคยหล่อในไทย'},
      callouts: [{label: 'พญาตานี', dx: -130, dy: -160, p: [ISTANA[0] + 0.6, 0.8, ISTANA[1] + 1.6], t0: 12.0, t1: 14.3}],
      camera: [HA_IN, HA_END],
    },
    {
      // 2145: Van Neck's fleet sets up the Dutch factory at Patani; Chinese, Japanese and English ships trade there
      id: 'port',
      kind: 'trade',
      t: [14.5, 20.0],
      year: {hold: 1602},
      caption: {t0: 14.6, title: 'ฮอลันดามาตั้งห้างค้า', sub: 'เรือจีน ญี่ปุ่น อังกฤษ มาค้าขายในอ่าว'},
      callouts: [{label: 'อ่าวปัตตานี', dx: -120, dy: -150, p: [26, 0.6, -26], t0: 16.6, t1: 19.8}],
      camera: [PO_IN, PO_END],
    },
    {
      // 2328 or 2329: the gun is taken to Bangkok; the second gun slips into the sea at the landing (some sources)
      id: 'taken',
      kind: 'procession',
      t: [21.0, 26.5],
      year: [1772, 1790],
      caption: {t0: 21.1, title: 'พญาตานีถูกนำไปบางกอก', sub: 'อีกกระบอกว่ากันว่าจมทะเลตอนขนลงเรือ'},
      era: 'รัตนโกสินทร์',
      camera: [TA_IN, TA_END],
    },
    {
      // the town on the Pattani river: the governor's palace at Chabang Tiga (2388-2399), the Chinese quarter of Anoru
      id: 'newtown',
      kind: 'arrive',
      t: [26.5, 32.5],
      year: [1790, 1900],
      caption: {t0: 26.6, title: 'ย้ายเมืองมาริมแม่น้ำ', sub: 'วังจะบังติกอ กับย่านจีนอาเนาะรู'},
      callouts: [
        {label: 'วังจะบังติกอ', dx: -120, dy: -150, p: [CHABANG_TIGA[0], 1.0, CHABANG_TIGA[1]], t0: 29.6, t1: 31.4},
        {label: 'ศาลเจ้าแม่ลิ้มกอเหนี่ยว', dx: 120, dy: -170, p: [SHRINE[0], 1.0, SHRINE[1]], t0: 31.0, t1: 32.4},
      ],
      camera: [NT_IN, NT_END],
    },
    {
      // the Dechanuchit bridge (~2469 by one news item: no year)
      id: 'bridge',
      kind: 'build',
      t: [32.5, 38.0],
      year: [1900, 1935],
      caption: {t0: 32.6, title: 'สะพานเดชานุชิตข้ามแม่น้ำ', sub: 'เชื่อมเมืองสองฝั่ง ราวร้อยปีก่อน'},
      callouts: [{label: 'สะพานเดชานุชิต', dx: 120, dy: -150, p: [DECHA_BRIDGE[0], 1.0, DECHA_BRIDGE[1]], t0: 35.4, t1: 37.6}],
      camera: [BR_IN, BR_END],
    },
    {
      // the grow shot: the town spreads along both banks; the Central Mosque (2497-2506) rises on the east bank
      id: 'grow',
      kind: 'grow',
      t: [38.0, 45.5],
      year: [1935, 1995],
      caption: {t0: 38.1, title: 'เมืองโตสองฝั่งแม่น้ำ', sub: 'มัสยิดกลางโดมเขียวขึ้นกลางเมือง'},
      era: 'ปัจจุบัน',
      callouts: [{label: 'มัสยิดกลางปัตตานี', dx: 120, dy: -150, p: [CENTRAL_MOSQUE[0], 2.0, CENTRAL_MOSQUE[1]], t0: 42.0, t1: 45.0}],
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: Lim Ko Niao's procession wades across the river below the Dechanuchit bridge
      id: 'fair',
      kind: 'celebrate',
      t: [45.5, 50.2],
      year: [1996, 2018],
      caption: {t0: 45.6, title: 'แห่เจ้าแม่ลุยข้ามแม่น้ำ', sub: 'ลิ้มกอเหนี่ยว น้องสาวช่างหล่อพญาตานี'},
      camera: [FA_IN, FA_MID],
    },
    {
      // the callback: the cover's giant gun stands again on the plain, gilded: the province's seal (since 2482, no year on
      // screen). The real gun stands in front of the Ministry of Defence in Bangkok.
      id: 'seal',
      kind: 'legend',
      t: [50.2, 54.4],
      year: [2018, 2025.5],
      caption: {t0: 50.3, t1: 53.8, title: 'พญาตานีบนตราจังหวัด', sub: 'ปืนจริงตั้งอยู่หน้ากระทรวงกลาโหม กรุงเทพฯ'},
      callouts: [{label: 'ตราประจำจังหวัด', dx: 130, dy: -170, p: [CANNON_AT[0] + 6, 4, CANNON_AT[1]], t0: 52.4, t1: 54.2}],
      camera: [FA_END, FA_HOLD],
    },
    {id: 'today', kind: 'today', t: [54.6, 56.4], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
