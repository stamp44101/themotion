// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's
// storyline v1 table (docs/briefs/samutprakan.md; the owner delegated the pick to cloud, 20 Nov 2569): hero / build /
// raise / fort / fight / resort / grow / airport / fair / today. Held years: 2436 (the Paknam incident, 13 Jul) and 2549
// (Suvarnabhumi opens, 28 Sep); the counter lands on 2569. The town's founding (2362 or 2365), the chedi's years (2362-2371,
// sources disagree), Rama IV's raising (no firm year), the island joining the bank (no year) and Bang Pu (2480) are named
// in no caption: the counter does not hold them, and Rama II's years run under "ราว".
import {between, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {AIRPORT, BANGPU, BRIDGES, CHEDI, CHULA, HERO_S, PILLAR} from './places';

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the giant chedi on its island over the whole tile, from the south-south-east, the river and the mouth below it
const C0: Key = [0, CHEDI[0] + 3, HERO_S * 0.36, CHEDI[1] + 6, 340, 14, 34, 30];
const C1: Key = [2.8, CHEDI[0] + 2, HERO_S * 0.34, CHEDI[1] + 6, 305, 10, 34, 30];
// build: Pak Nam and the island from the south-east; conscripts carry bricks to the forts on both banks
const BU_IN: Key = [4.4, -2.6, 0.6, -2.2, 40, 34, 41, 30];
const BU_END: Key = [8.6, -3.2, 0.6, -2.8, 36, 52, 41, 30];
// raise: the barges come down to the island's landing; the chedi goes up in its scaffold. From the east over the river
const RA_IN: Key = [9.8, -6.2, 0.8, -6.4, 32, 74, 40, 30];
const RA_END: Key = [14.6, CHEDI[0], 1.0, CHEDI[1], 26, 98, 40, 30];
// fort: Phra Chulachomklao fort at the mouth, from the east over the water
const FO_IN: Key = [16.4, CHULA[0] + 0.6, 0.6, CHULA[1] - 0.6, 36, 112, 40, 30];
const FO_END: Key = [20.2, CHULA[0], 0.6, CHULA[1], 30, 128, 40, 30];
// fight: the French ships come up the channel past the fort; from the south-east over the sea, the fort beyond them
const FI_IN: Key = [21.4, -1.6, 0.6, 44.0, 50, 74, 38, 30];
const FI_END: Key = [26.6, -6.4, 0.6, 37.6, 46, 96, 38, 30];
// resort: Bang Pu's pier from the sea, the resort and the coast road behind it
const RE_IN: Key = [28.6, BANGPU[0] - 1, 0.6, BANGPU[1] + 3.4, 40, 4, 36, 30];
const RE_END: Key = [32.6, BANGPU[0], 0.6, BANGPU[1] + 3.0, 32, 22, 36, 30];
// grow: the whole delta from the south, swinging to the south-east; the island joins the bank
const GR_IN: Key = [34.6, 2, 1, 6, 175, 8, 37, 30];
const GR_END: Key = [40.6, 4, 1, 2, 200, 34, 37, 30];
// airport: the runways from the south-south-west, a jet coming in to land
const AI_IN: Key = [42.4, AIRPORT[0] - 2, 1, AIRPORT[1] + 4, 66, -12, 36, 30];
const AI_END: Key = [47.6, AIRPORT[0] + 1, 1.5, AIRPORT[1] + 2, 46, 10, 34, 30];
// fair: the red cloth on its barge, then up on the chedi; from the east over the river
const FA_IN: Key = [49.4, CHEDI[0] + 1.2, 1.0, CHEDI[1] + 0.4, 32, 70, 38, 30];
const FA_END: Key = [54.0, CHEDI[0], 1.2, CHEDI[1], 26, 88, 37, 30];
// the landing: the whole tile again at the cover's distance, now a city on the river
const END: Key = [56.4, CHEDI[0] + 6, 10, CHEDI[1] + 10, 340, 14, 34, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1818,
  after: 2026,
  camera: [
    ...between(C1, BU_IN, 4, 0.1),
    ...between(BU_END, RA_IN, 3),
    ...between(RA_END, FO_IN, 4, 0.4),
    ...between(FO_END, FI_IN, 3),
    ...between(FI_END, RE_IN, 4, 0.5),
    ...between(RE_END, GR_IN, 4),
    ...between(GR_END, AI_IN, 4, 0.1),
    ...between(AI_END, FA_IN, 4, 0.3),
    ...between(FA_END, END, 4),
    END,
    [60, CHEDI[0] + 6, 10, CHEDI[1] + 10, 350, 20, 34, 30],
  ],
  beats: [
    {
      // the cover: a giant Phra Samut Chedi on its island in the river, half laid in brick at frame 0 with its bamboo
      // scaffold; the courses go up, it is whitewashed and the spire shoots up (Rama IV made it taller). No year on screen.
      id: 'hero',
      kind: 'legend',
      t: [0, 3.0],
      year: [1818, 1818.5],
      camera: [C0, C1],
    },
    {
      // 2362-2365 (sources differ): Rama II builds Mueang Samut Prakan at Pak Nam, forts on both banks, and the chedi on the
      // island; the counter runs under "ราว"
      id: 'build',
      kind: 'build',
      t: [3.0, 9.4],
      year: [1819, 1827],
      caption: {t0: 3.2, title: 'ร.2 สร้างเมืองป้อมปากน้ำ', sub: 'เกณฑ์คนก่อป้อมสองฝั่ง และเจดีย์กลางน้ำ'},
      era: 'รัตนโกสินทร์',
      callouts: [{label: 'ป้อมผีเสื้อสมุทร', dx: -130, dy: -150, p: [-7.8, 0.8, -1.2], t0: 6.6, t1: 9.0}],
      camera: [BU_IN, BU_END],
    },
    {
      // Rama IV has a larger chedi built over the old one, ~38 m (no firm year); relics brought by barge
      id: 'raise',
      kind: 'procession',
      t: [9.4, 15.6],
      year: [1828, 1867],
      caption: {t0: 9.5, title: 'ร.4 เสริมพระเจดีย์ให้สูงขึ้น', sub: 'ก่อครอบองค์เดิม สูงราว 38 เมตร'},
      callouts: [{label: 'พระสมุทรเจดีย์', dx: 120, dy: -170, p: [CHEDI[0], 3.4, CHEDI[1]], t0: 12.6, t1: 15.2}],
      camera: [RA_IN, RA_END],
    },
    {
      // 2427: Rama V begins Phra Chulachomklao fort at Laem Fa Pha; seven Armstrong disappearing guns (2436)
      id: 'fort',
      kind: 'build',
      t: [15.6, 20.8],
      year: [1868, 1892],
      caption: {t0: 15.7, title: 'ร.5 สร้างป้อมพระจุลฯ', sub: 'ป้อมพระจุลจอมเกล้า ปืนเสือหมอบ 7 กระบอก'},
      callouts: [{label: 'ป้อมพระจุลจอมเกล้า', dx: -120, dy: -160, p: [CHULA[0], 1.0, CHULA[1]], t0: 18.2, t1: 20.6}],
      camera: [FO_IN, FO_END],
    },
    {
      // 13 Jul 2436 (ร.ศ. 112): Inconstant and Comète force the river at dusk; the fort and the Siamese gunboats fire
      id: 'fight',
      kind: 'fight',
      t: [20.8, 27.4],
      year: {hold: 1893},
      caption: {t0: 20.9, title: 'ร.ศ. 112 ฝรั่งเศสบุกปากน้ำ', sub: 'เรือรบสองลำฝ่าป้อม 13 ก.ค. 2436'},
      callouts: [],
      camera: [FI_IN, FI_END],
    },
    {
      // 2480: Bang Pu seaside resort (Phibun's idea); its pier runs out to sea (2482 by one snippet: no year on screen)
      id: 'resort',
      kind: 'celebrate',
      t: [27.4, 33.6],
      year: [1925, 1941],
      caption: {t0: 27.5, title: 'สถานตากอากาศบางปู', sub: 'สะพานยื่นลงทะเล ที่เที่ยวชายทะเลของคนกรุง'},
      era: 'ปัจจุบัน',
      callouts: [{label: 'บางปู', dx: -120, dy: -160, p: [BANGPU[0], 0.8, BANGPU[1]], t0: 30.0, t1: 33.2}],
      camera: [RE_IN, RE_END],
    },
    {
      // the grow shot: Pak Nam spreads until it meets Bangkok; the silt joins the chedi's island to the west bank
      id: 'grow',
      kind: 'grow',
      t: [33.6, 41.6],
      year: [1942, 2005],
      caption: {t0: 33.7, title: 'ปากน้ำโตจนชนกรุงเทพฯ', sub: 'ตะกอนทับถม เกาะพระเจดีย์ติดฝั่งไปแล้ว'},
      callouts: [{label: 'ปากน้ำ', dx: 120, dy: -150, p: [PILLAR[0], 1.0, PILLAR[1]], t0: 37.0, t1: 41.0}],
      camera: [GR_IN, GR_END],
    },
    {
      // 28 Sep 2549: Suvarnabhumi opens on the drained Nong Ngu Hao swamp (the Bhumibol bridges opened the same month)
      id: 'airport',
      kind: 'arrive',
      t: [41.6, 48.4],
      year: {hold: 2006},
      caption: {t0: 41.7, title: 'สุวรรณภูมิบนหนองงูเห่า', sub: 'เปิด 28 ก.ย. 2549 ปีเดียวกับสะพานภูมิพล'},
      callouts: [{label: 'สุวรรณภูมิ', dx: -120, dy: -160, p: [AIRPORT[0], 2.0, AIRPORT[1]], t0: 44.6, t1: 48.0}],
      camera: [AI_IN, AI_END],
    },
    {
      // the payoff: the yearly red cloth (แรม 5 ค่ำ เดือน 11) comes by barge and is wrapped round the chedi's bell
      id: 'fair',
      kind: 'celebrate',
      t: [48.4, 54.6],
      year: [2007, 2025.5],
      caption: {t0: 48.5, t1: 53.9, title: 'ห่มผ้าแดงพระสมุทรเจดีย์', sub: 'แห่ผ้าแดงทางเรือ ขึ้นห่มคอระฆังทุกปี'},
      callouts: [{label: 'พระสมุทรเจดีย์', dx: -130, dy: -170, p: [CHEDI[0], 3.6, CHEDI[1]], t0: 51.4, t1: 54.2}],
      camera: [FA_IN, FA_END],
    },
    {
      id: 'today',
      kind: 'today',
      t: [54.6, 56.4],
      year: [2025.6, 2026],
      // the twin bridges of 2549 on the landing's wide shot (the river's entry, north-west)
      callouts: [{label: 'สะพานภูมิพล', dx: -110, dy: -140, p: [BRIDGES[0][0] + 3, 4.0, BRIDGES[0][1] + 2.5], t0: 54.8, t1: 55.95}],
    },
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
