// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/kalasin.md, approved by the owner on 14 Nov 2569): hero / settle / found / temples / bank
// / dam / dino / grow / fair / today. Held years: 2336 (Rama I makes Ban Kaeng Samrong เมืองกาฬสินธุ์), 2511 (the Lam Pao dam
// stores water), 2537 (the bones at Phu Kum Khao); the counter lands on 2569. The move to Kaeng Samrong (2323 or ~2325),
// the first pillar (2335), the bank and the pillar's move (2370, one local source), the pong lang (~2505) and the royal
// visit to Ban Phon (2520) are named in no sub: the counter does not hold them.
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {DAM, DIG, FAIR, FIRST_PILLAR, HALL, LOOM_AT, LOOM_S, PILLAR, SHAWL_AT, WAT_KLANG} from './places';

type Key = CameraKey;
const LC: [number, number] = [LOOM_AT[0], LOOM_AT[1] - 0.12 * LOOM_S];
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the loom on the whole tile, seen from the south-south-east, the khlong and the old town to its left
const C0: Key = [0, LC[0] - 4, 6, LC[1] + 2, 300, 18, 36, 30];
const C1: Key = [2.8, LC[0] - 6, 5, LC[1] + 3, 260, 14, 35, 30];
// settle: down to the khlong's east bank as the carts come in from the north
const SE_IN: Key = [4.6, 2.8, 1, -11.0, 36, 160, 42, 30];
const SE_END: Key = [8.2, 1.8, 1, -4.0, 30, 140, 42, 30];
// found: the log carried down to Kut Nam Kin and raised, from the south-east over the oxbow
const FO_IN: Key = [9.4, 0.6, 1, 3.0, 34, 40, 42, 30];
const FO_END: Key = [14.6, FIRST_PILLAR[0], 1, FIRST_PILLAR[1], 26, 24, 42, 30];
// temples: the three sim in a row along the khlong, from the east
const TE_IN: Key = [15.8, WAT_KLANG[0], 1, WAT_KLANG[1], 36, 70, 42, 30];
const TE_END: Key = [20.6, WAT_KLANG[0] - 0.4, 1, WAT_KLANG[1] + 0.4, 32, 96, 42, 30];
// the bank: the neck slumps into the khlong, the pillar is carried up to today's shrine; from the east-south-east
const BA_IN: Key = [21.6, FIRST_PILLAR[0] - 0.4, 0.5, FIRST_PILLAR[1] + 0.2, 24, 118, 42, 30];
const BA_END: Key = [26.0, -0.1, 0.5, 1.2, 24, 136, 42, 30];
// the dam (far place): the crest from the south, the reservoir filling behind it
const DA_IN: Key = [27.8, DAM[0] + 1.0, 1, DAM[1] - 2.0, 50, -14, 40, 30];
const DA_END: Key = [32.0, DAM[0] + 2.0, 1, DAM[1] - 3.0, 44, 6, 40, 30];
// the dinosaur (far place): the dig on Phu Kum Khao's south slope, from the south-east
const DI_IN: Key = [33.6, DIG[0], 1.5, DIG[1], 30, 30, 40, 30];
const DI_END: Key = [38.0, DIG[0], 1.5, DIG[1], 22, 52, 40, 30];
// the grow shot: the whole town from the south, spreading east to the new hall, swinging round to the south-east
const GR_IN: Key = [39.6, 10, 1, -2, 175, 8, 37, 30];
const GR_END: Key = [45.6, 14, 1, -4, 205, 40, 37, 30];
// the fair: in front of the new hall, from the south-west
const FA_IN: Key = [47.0, FAIR[0], 1, FAIR[1] - 1.2, 34, 30, 34, 30];
const FA_END: Key = [54.0, FAIR[0] + 0.4, 1, FAIR[1] - 1.6, 26, 12, 33, 30];
// the landing: the whole tile again at the cover's distance, now a town on the khlong
const END: Key = [56.4, LC[0] - 6, 5, LC[1] + 3, 300, 18, 36, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1777,
  after: 2026,
  camera: [
    ...between(C1, SE_IN, 4),
    ...between(SE_END, FO_IN, 3),
    ...between(FO_END, TE_IN, 3),
    ...between(TE_END, BA_IN, 3),
    ...between(BA_END, DA_IN, 4, 0.3),
    ...between(DA_END, DI_IN, 3, 0.1),
    ...between(DI_END, GR_IN, 4, 0.1),
    ...between(GR_END, FA_IN, 4, 0.1),
    ...between(FA_END, END, 4),
    END,
    [60, LC[0] - 6, 5, LC[1] + 3, 310, 24, 36, 30],
  ],
  beats: [
    {
      // the cover (owner's pick A1): a giant Phu Thai loom on open ground east of the khlong, half a Phrae Wa shawl
      // woven at frame 0; the beater bangs the rest in by 2 s. No counter and no year under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1777, 1778],
      camera: [C0, C1],
    },
    {
      // Thao Somphamit's people leave Vientiane, cross the Phu Phan and come down to Kaeng Samrong on the Pao (2323 or
      // ~2325 by source: no year on screen)
      id: 'settle',
      kind: 'arrive',
      t: [3.0, 8.5],
      year: [1778, 1792],
      caption: {t0: 3.2, title: 'อพยพมาตั้งที่แก่งสำโรง', sub: 'ท้าวโสมพะมิตรพาไพร่พลข้ามภูพานลงมา'},
      era: 'ธนบุรี',
      camera: [SE_IN, SE_END],
    },
    {
      // 2336 (จ.ศ. 1155): Rama I raises Ban Kaeng Samrong to เมืองกาฬสินธุ์ and makes Thao Somphamit พระยาไชยสุนทร; the
      // pillar of pradu wood is raised at Kut Nam Kin
      id: 'found',
      kind: 'procession',
      t: [8.5, 15.0],
      year: {hold: 1793},
      caption: {t0: 8.6, title: 'ร.1 ตั้งเมืองกาฬสินธุ์', sub: 'ท้าวโสมพะมิตรเป็นพระยาไชยสุนทร เจ้าเมืองคนแรก'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'หลักเมือง กุดน้ำกิน', dx: 130, dy: -160, p: [FIRST_PILLAR[0], 1.4, FIRST_PILLAR[1]], t0: 12.4, t1: 14.6}],
      camera: [FO_IN, FO_END],
    },
    {
      // the first governor's three temples in a row on the khlong (Wat Klang's year is disputed: no year)
      id: 'temples',
      kind: 'build',
      t: [15.0, 21.0],
      year: [1794, 1822],
      caption: {t0: 15.1, title: 'สามวัดเรียงริมคลองปาว', sub: 'วัดเหนือ วัดกลาง วัดใต้โพธิ์ค้ำ'},
      callouts: [{label: 'วัดกลาง', dx: -120, dy: -150, p: [WAT_KLANG[0], 1.2, WAT_KLANG[1]], t0: 18.4, t1: 20.6}],
      camera: [TE_IN, TE_END],
    },
    {
      // the bank at Kut Nam Kin gives way; the pillar is carried up to today's shrine (2370 by one local source: no year)
      id: 'bank',
      kind: 'disaster',
      t: [21.0, 26.5],
      year: [1823, 1828],
      caption: {t0: 21.1, title: 'ตลิ่งพัง ต้องย้ายหลักเมือง', sub: 'แบกเสาหลักเมืองขึ้นมาตั้งที่ดอน'},
      callouts: [{label: 'ศาลหลักเมือง', dx: 120, dy: -150, p: [PILLAR[0], 1.0, PILLAR[1]], t0: 25.3, t1: 26.4}],
      camera: [BA_IN, BA_END],
    },
    {
      // 2511: the Lam Pao dam is finished and begins storing water (earth dam, crest 7.8 km)
      id: 'dam',
      kind: 'build',
      t: [26.5, 32.5],
      year: {hold: 1968},
      caption: {t0: 26.6, title: 'เขื่อนลำปาวกั้นแม่น้ำ', sub: 'สันเขื่อนดินยาว 7.8 กม. เริ่มเก็บน้ำ'},
      era: 'ปัจจุบัน',
      callouts: [{label: 'เขื่อนลำปาว', dx: 120, dy: -150, p: [DAM[0], 1.2, DAM[1]], t0: 29.6, t1: 32.2}],
      camera: [DA_IN, DA_END],
    },
    {
      // 2537: the abbot of Wat Sakkawan finds bones on Phu Kum Khao; the Department of Mineral Resources digs
      id: 'dino',
      kind: 'discover',
      t: [32.5, 38.5],
      year: {hold: 1994},
      caption: {t0: 32.6, title: 'พบไดโนเสาร์ที่ภูกุ้มข้าว', sub: 'เจ้าอาวาสวัดสักกะวันพบก่อน แล้วขุดทั้งตัว'},
      callouts: [{label: 'ภูกุ้มข้าว', dx: -120, dy: -150, p: [DIG[0], 1.6, DIG[1]], t0: 35.2, t1: 38.2}],
      camera: [DI_IN, DI_END],
    },
    {
      // the grow shot: the town spreads east from the khlong along the roads to the new provincial hall
      id: 'grow',
      kind: 'grow',
      t: [38.5, 46.0],
      year: [1995, 2019],
      caption: {t0: 38.6, title: 'เมืองโตไปทางตะวันออก', sub: 'ถึงศาลากลางจังหวัดหลังใหม่'},
      callouts: [{label: 'ศาลากลางจังหวัด', dx: 120, dy: -150, p: [HALL[0], 1.2, HALL[1]], t0: 42.6, t1: 45.6}],
      camera: [GR_IN, GR_END],
    },
    {
      // the payoff: the pong lang and Phrae Wa fair in front of the hall; the cover's shawl hangs over the fair ground
      id: 'fair',
      kind: 'celebrate',
      t: [46.0, 54.4],
      year: [2020, 2025.5],
      caption: {t0: 46.1, t1: 53.8, title: 'งานโปงลาง ผ้าไหมแพรวา', sub: 'ผ้าที่ในหลวง ร.9 ทอดพระเนตรที่บ้านโพน'},
      callouts: [{label: 'ผ้าไหมแพรวา', dx: -130, dy: -160, p: [SHAWL_AT[0], 2.6, SHAWL_AT[1]], t0: 48.6, t1: 53.6}],
      camera: [FA_IN, FA_END],
    },
    {id: 'today', kind: 'today', t: [54.6, 56.4], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
