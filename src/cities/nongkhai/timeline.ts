// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/nongkhai.md, cloud's own pick under the owner's delegation, 18 Nov 2569): hero / settle /
// found / sink / prasai / haw / rail / grow / bridge / race / today. Held years: 2370 (Ban Phai raised to เมืองหนองคาย, the
// province's own count), 2390 (Phra That Lahanong falls into the Mekong), 2429 (ร.ศ. 105, the Prap Ho monument), 2498 (the
// railway reaches Nong Khai), 2537 (the Friendship Bridge); the counter lands on 2569. Phra Sai's cart (2399, one source, a
// legend), Wat Pho Chai (2382) and Sala Kaew Ku (2513/2519/2521, disputed) are named with no year.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {BAN_PHAI, BOAT_AT, BRIDGE, OLD_STATION, PRAPHO, SALA_KAEW_KU, THAT, WAT_PHO_CHAI} from './places';

type Key = CameraKey;
const BC: [number, number] = [BOAT_AT[0], BOAT_AT[1]];
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the boat on the bank, the Mekong and Laos behind it, from the south
const C0: Key = [0, BC[0] + 1, 6, BC[1] - 6, 300, -8, 36, 30];
const C1: Key = [2.8, BC[0] + 1, 5, BC[1] - 6, 262, -4, 35, 30];
// settle: down to the bank at Ban Phai as the carts come up from the south, from the south-east
const SE_IN: Key = [4.6, BAN_PHAI[0] + 1.0, 1, BAN_PHAI[1] + 2.4, 38, 30, 42, 30];
const SE_END: Key = [8.2, BAN_PHAI[0] + 0.4, 1, BAN_PHAI[1] + 1.6, 32, 12, 42, 30];
// found: the governor's boat paddled upstream along the town front, from over the town
const FO_IN: Key = [9.4, 9.4, 1, -8.4, 34, -6, 40, 30];
const FO_END: Key = [14.2, -2.6, 1, -4.8, 30, -22, 40, 30];
// sink: the stupa on its spit, from the east-south-east across it to the river and Laos
const SI_IN: Key = [15.6, THAT[0] + 0.6, 1, THAT[1] + 1.6, 28, 52, 40, 30];
const SI_END: Key = [20.2, THAT[0], 1, THAT[1] + 0.8, 24, 74, 40, 30];
// prasai: Wat Pho Chai seen from over the river (north), the carts setting out west along the bank
const PS_IN: Key = [21.6, WAT_PHO_CHAI[0] - 1.6, 1, WAT_PHO_CHAI[1] + 0.4, 30, 156, 42, 30];
const PS_END: Key = [25.8, WAT_PHO_CHAI[0] - 2.2, 1, WAT_PHO_CHAI[1] + 0.6, 26, 176, 42, 30];
// haw: the army marches from the camp to the bank and crosses, from the south-west
const HA_IN: Key = [27.4, PRAPHO[0] - 1.0, 1, PRAPHO[1] - 0.4, 33, 214, 40, 30];
const HA_END: Key = [31.8, PRAPHO[0] - 1.6, 1, PRAPHO[1] - 4.4, 31, 236, 40, 30];
// rail: the train comes up from the south to the old station by the river, from the east-south-east
const RA_IN: Key = [33.4, OLD_STATION[0] - 2.0, 1, OLD_STATION[1] + 5.0, 40, 250, 40, 30];
const RA_END: Key = [37.2, OLD_STATION[0] - 0.6, 1, OLD_STATION[1] + 2.0, 32, 270, 40, 30];
// the grow shot: the whole town along the river from the south, swinging round to the south-east
const GR_IN: Key = [39.0, 15, 1, -1, 178, 330, 37, 30];
const GR_END: Key = [44.2, 16, 1, -2, 205, 356, 37, 30];
// bridge: the spans across the river, from the south-east (oblique, the river and Laos behind)
const BR_IN: Key = [45.8, (BRIDGE[0][0] + BRIDGE[1][0]) / 2, 1, (BRIDGE[0][1] + BRIDGE[1][1]) / 2, 40, 410, 34, 30];
const BR_END: Key = [49.4, (BRIDGE[0][0] + BRIDGE[1][0]) / 2, 1, (BRIDGE[0][1] + BRIDGE[1][1]) / 2, 34, 428, 34, 30];
// race: the boats off Tha Sadet, from over the crowd on the bank
const RC_IN: Key = [50.6, 2.4, 1, -7.2, 34, 360 + 14, 34, 30];
const RC_END: Key = [54.4, -2.6, 1, -5.6, 30, 360 + 26, 34, 30];
// the landing: the whole tile again at the cover's distance, now a town along the river
const END: Key = [56.4, BC[0] + 1, 5, BC[1] - 6, 300, 360 - 4, 36, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1822,
  after: 2026,
  camera: [
    ...between(C1, SE_IN, 4),
    ...between(SE_END, FO_IN, 3),
    ...between(FO_END, SI_IN, 3),
    ...between(SI_END, PS_IN, 3),
    ...between(PS_END, HA_IN, 3),
    ...between(HA_END, RA_IN, 3),
    ...between(RA_END, GR_IN, 4, 0.1),
    ...between(GR_END, BR_IN, 4, 0.1),
    ...between(BR_END, RC_IN, 3),
    ...between(RC_END, END, 4),
    END,
    [60, BC[0] + 1, 5, BC[1] - 6, 310, 360 + 2, 36, 30],
  ],
  beats: [
    {
      // the cover (cloud's pick A1): a giant long boat dug from one log on the bank, half carved at frame 0; the adze runs
      // to the bow and the naga's head comes out by 2 s. No counter and no year under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1822, 1823],
      camera: [C0, C1],
    },
    {
      // Thao Suwo (Bunma) settles Ban Phai on the Mekong bank (the years before 2370 are not named)
      id: 'settle',
      kind: 'arrive',
      t: [3.0, 8.5],
      year: [1823.2, 1826.4],
      caption: {t0: 3.2, title: 'ตั้งบ้านไผ่ริมแม่น้ำโขง', sub: 'ท้าวสุวอธรรมา (บุญมา) พาไพร่พลมาตั้ง'},
      era: 'รัตนโกสินทร์',
      camera: [SE_IN, SE_END],
    },
    {
      // 2370 by the province's own count: Rama III raises Ban Phai to เมืองหนองคาย; the governor's boat Kham Yat (~40
      // paddlers, dug ~2370-71) is paddled along the town front
      id: 'found',
      kind: 'procession',
      t: [8.5, 14.5],
      year: {hold: 1827},
      caption: {t0: 8.6, title: 'ร.3 ตั้งเมืองหนองคาย', sub: 'เรือคำหยาด 40 ฝีพายของเจ้าเมืองคนแรก'},
      callouts: [{label: 'เรือคำหยาด', dx: 130, dy: -160, p: [4.0, 1.2, -7.4], t0: 11.0, t1: 13.0}],
      camera: [FO_IN, FO_END],
    },
    {
      // 2390 (ประชุมพงศาวดาร ภาค 70): the Mekong eats the bank and Phra That Lahanong falls into the river
      id: 'sink',
      kind: 'disaster',
      t: [14.5, 20.5],
      year: {hold: 1847},
      caption: {t0: 14.6, title: 'พระธาตุพังลงกลางโขง', sub: 'น้ำกัดเซาะตลิ่ง จนพระธาตุหล้าหนองล้มลงน้ำ'},
      callouts: [{label: 'พระธาตุกลางน้ำ', dx: -120, dy: -170, p: [THAT[0], 1.6, THAT[1]], t0: 18.0, t1: 20.2}],
      camera: [SI_IN, SI_END],
    },
    {
      // the legend of Phra Sai's cart (2399 by one source: no year): Phra Serm goes to Bangkok, Phra Sai stays
      id: 'prasai',
      kind: 'legend',
      t: [20.5, 26.0],
      year: [1848, 1856],
      caption: {t0: 20.6, title: 'ตำนานเกวียนพระใสหัก', sub: 'พระเสริมไปกรุงเทพฯ พระใสอยู่วัดโพธิ์ชัย'},
      callouts: [{label: 'วัดโพธิ์ชัย', dx: 120, dy: -150, p: [WAT_PHO_CHAI[0], 1.4, WAT_PHO_CHAI[1]], t0: 23.6, t1: 25.8}],
      camera: [PS_IN, PS_END],
    },
    {
      // ร.ศ. 105 (2429): the southern army against the Haw gathers at Nong Khai and crosses; the monument is ordered
      id: 'haw',
      kind: 'fight',
      t: [26.0, 32.0],
      year: {hold: 1886},
      caption: {t0: 26.1, title: 'ทัพปราบฮ่อรวมพลริมโขง', sub: 'สร้างอนุสาวรีย์ปราบฮ่อ ร.ศ. 105'},
      callouts: [{label: 'อนุสาวรีย์ปราบฮ่อ', dx: 130, dy: -160, p: [PRAPHO[0], 1.6, PRAPHO[1]], t0: 29.8, t1: 31.8}],
      camera: [HA_IN, HA_END],
    },
    {
      // 13 Sep 2498: the north-east line reaches Nong Khai, the station by the river
      id: 'rail',
      kind: 'arrive',
      t: [32.0, 37.5],
      year: {hold: 1955},
      caption: {t0: 32.1, title: 'รถไฟมาถึงริมโขง', sub: 'สถานีหนองคาย 13 ก.ย. 2498'},
      era: 'ปัจจุบัน',
      camera: [RA_IN, RA_END],
    },
    {
      // the grow shot: the town spreads along the bank and inland; Sala Kaew Ku's statues rise in the east (no year)
      id: 'grow',
      kind: 'grow',
      t: [37.5, 44.5],
      year: [1956, 1993],
      caption: {t0: 37.6, title: 'เมืองโตเลียบริมโขง', sub: 'ศาลาแก้วกู่ รูปปั้นยักษ์ฝั่งตะวันออก'},
      callouts: [{label: 'ศาลาแก้วกู่', dx: -120, dy: -150, p: [SALA_KAEW_KU[0], 2.0, SALA_KAEW_KU[1]], t0: 41.4, t1: 44.2}],
      camera: [GR_IN, GR_END],
    },
    {
      // 8 Apr 2537: the Friendship Bridge opens, 1,170 m, the first across the lower Mekong
      id: 'bridge',
      kind: 'build',
      t: [44.5, 50.0],
      year: {hold: 1994},
      caption: {t0: 44.6, title: 'สะพานมิตรภาพข้ามโขง', sub: 'ไทย–ลาว ยาว 1,170 ม. เปิด 8 เม.ย. 2537'},
      callouts: [{label: 'สะพานมิตรภาพไทย–ลาว', dx: 120, dy: -160, p: [-27.0, 1.2, -0.6], t0: 47.6, t1: 49.8}],
      camera: [BR_IN, BR_END],
    },
    {
      // the payoff: the Ok Phansa long-boat race off Tha Sadet; the cover's naga boat leads; the naga fireballs rise
      id: 'race',
      kind: 'celebrate',
      t: [50.0, 54.6],
      year: [1995, 2025.5],
      caption: {t0: 50.1, t1: 54.4, title: 'แข่งเรือยาว วันออกพรรษา', sub: 'คืนนั้นลุ้นบั้งไฟพญานาคกลางโขง'},
      callouts: [{label: 'เรือยาวหัวพญานาค', dx: -130, dy: -160, p: [0.0, 1.2, -6.2], t0: 51.6, t1: 54.2}],
      camera: [RC_IN, RC_END],
    },
    {id: 'today', kind: 'today', t: [54.6, 56.4], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
