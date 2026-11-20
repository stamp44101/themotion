// Pure data (no React/three) so scripts/export_timeline.mjs can import it for the soundtrack.
// Beats own their seconds (src/engine/story.ts); the beats, verbs, held years and what is approximate are the brief's storyline
// v1 table (docs/briefs/trang.md; the owner delegated the decision): hero / junks / ratsada / rubber / train / move / grow / sea
// / breakfast / today. Held years: 2433 (Phraya Ratsada made governor of Trang) and 2456 (the line opens to "สถานีตรัง" at
// Kantang, 1 เม.ย.); the counter lands on 2569. The move to Kantang (2433 or 2436), the first rubber (2442 or 2444) and the
// move to Thap Thiang (1 ม.ค. 2458 old count = 2459) are named in no caption: the counter does not hold them.
import {between, glide, type CameraKey} from '../../engine/glide';
import {buildStory} from '../../engine/story';
import {FIRST_RUBBER, KT_STATION, TR_STATION} from './places';

// the first plot and Ko Libong (drawn closer), shared with actors.ts
const PLOT_C: [number, number] = [FIRST_RUBBER[0] + 3.0, FIRST_RUBBER[1] + 3.5];
const LIBONG: [number, number] = [-33.0, 63.2];
const BREAKFAST: [number, number] = [-6.1, 2.0];

type Key = CameraKey;
// [t, target x, y, z, distance, azimuth, elevation, fov]; azimuth from +z (south) toward +x (east)
// the cover: the rubber tree on the whole tile, seen from the south, the sea and Kantang in front, Thap Thiang at the back
const C0: Key = [0, -11, 18, 28, 290, 2, 36, 30];
const C1: Key = [2.8, -11, 16, 28, 275, 6, 37, 30];
// junks: down to the estuary as they sail in from the sea, from the south-south-east
const JU_IN: Key = [4.6, -29.5, 1, 56, 50, 18, 40, 30];
const JU_END: Key = [8.2, -30, 1, 44, 40, 34, 41, 30];
// ratsada: the boats come down the upper estuary to the landing; the new town on the east bank in front
const RA_IN: Key = [9.6, -28.4, 1, 34.5, 34, 70, 42, 30];
const RA_END: Key = [14.6, -28, 1, 37.6, 28, 96, 42, 30];
// rubber: the first plot east of the town, from the south-east
const RU_IN: Key = [15.8, -17.7, 1, 43, 26, 120, 42, 30];
const RU_END: Key = [20.6, -17.9, 1, 42.8, 23, 148, 42, 30];
// train: the line running in from the north-east to the station by the wharf, seen from behind the train
const TR_IN: Key = [22.0, -20, 1, 37.5, 34, 100, 40, 30];
const TR_END: Key = [26.6, -24, 1, 38.6, 28, 120, 40, 30];
// move: the flood over Kantang, then the camera follows the train up the line to Thap Thiang, where the hall rises
const MO_IN: Key = [27.6, -25.6, 1, 39, 36, 130, 42, 30];
const MO_A: Key = [29.2, -25, 1, 38.6, 40, 140, 42, 30];
const MO_END: Key = [32.8, -1.5, 1, 0.5, 50, 200, 40, 30];
// the grow shot: the whole town from the north-west, swinging round to the west, the land down to Kantang behind it
const GR_IN: Key = [34.6, -1, 1, 2, 150, 205, 46, 30];
const GR_END: Key = [40.6, -1.5, 1, 3, 175, 250, 44, 30];
// sea (far place): long-tails run out of the mouth to Ko Libong; dugongs off its east shore
const SE_IN: Key = [42.4, -29, 1, 62, 44, 300, 40, 30];
const SE_END: Key = [45.2, -29.5, 1, 65.5, 36, 320, 40, 30];
// breakfast: the park by the clock tower, the tree over the tables, from the south
const BR_IN: Key = [47.4, BREAKFAST[0] + 0.6, 2.2, BREAKFAST[1] + 0.6, 38, 345, 40, 30];
const BR_END: Key = [54.0, BREAKFAST[0] + 0.6, 2.6, BREAKFAST[1] + 0.4, 32, 375, 39, 30];
// the landing: the whole tile again at the cover's distance, now a city at the top and rubber all over the land
const END: Key = [56.4, -11, 16, 28, 290, 362, 36, 30];

export const STORY = buildStory({
  duration: 60,
  standard: 1,
  before: 1800,
  after: 2026,
  camera: [
    ...between(C1, JU_IN, 4),
    ...between(JU_END, RA_IN, 3),
    ...between(RA_END, RU_IN, 3),
    ...between(RU_END, TR_IN, 3),
    ...between(TR_END, MO_IN, 2),
    ...between(MO_END, GR_IN, 4, 0.2),
    ...between(GR_END, SE_IN, 4, 0.1),
    ...between(SE_END, BR_IN, 5, 1.2),
    ...between(BR_END, END, 4),
    END,
    [60, -11, 16, 28, 300, 368, 36, 30],
  ],
  beats: [
    {
      // the cover (A1, cloud's pick, delegated): a giant rubber tree half tapped on the land between the river and the sea;
      // the knife runs on round the spiral and the latex fills the cup. No counter and no year under the title.
      id: 'hero',
      kind: 'legend',
      t: [0, 3],
      year: [1800, 1801],
      camera: [C0, C1],
    },
    {
      // James Low (2367): at high tide junks get into the Trang; tin, rice, ivory and birds' nests go out to Penang (no year)
      id: 'junks',
      kind: 'arrive',
      t: [3, 8.5],
      year: [1801, 1889],
      caption: {t0: 3.2, title: 'สำเภาปีนังเข้าปากน้ำตรัง', sub: 'ขนดีบุก ข้าว รังนก ออกทะเลไปปีนัง'},
      era: 'รัตนโกสินทร์',
      camera: [JU_IN, JU_END],
    },
    {
      // 2433: Phraya Ratsadanupradit (Khaw Sim Bee na Ranong) made governor; he moves the town from Khuan Thani down to
      // Kantang to make it a port (the move's year is 2433 or 2436 by source: not named)
      id: 'ratsada',
      kind: 'procession',
      t: [8.5, 15],
      year: {hold: 1890},
      caption: {t0: 8.6, title: 'พระยารัษฎาฯ ครองตรัง', sub: 'ย้ายเมืองจากควนธานีลงไปที่ปากน้ำกันตัง'},
      callouts: [{label: 'กันตัง', dx: 120, dy: -160, p: [-26.5, 1.2, 38.7], t0: 12.6, t1: 14.8}],
      camera: [RA_IN, RA_END],
    },
    {
      // the first rubber in Siam, seedlings from Malaya planted at Kantang (2442 or 2444 by source: no year)
      id: 'rubber',
      kind: 'build',
      t: [15, 21],
      year: [1891, 1906],
      caption: {t0: 15.1, title: 'ยางพาราต้นแรกของสยาม', sub: 'พระยารัษฎาฯ นำกล้ามาปลูกที่กันตัง'},
      callouts: [{label: 'สวนยางแปลงแรก', dx: -120, dy: -160, p: [PLOT_C[0], 0.8, PLOT_C[1]], t0: 18.4, t1: 20.8}],
      camera: [RU_IN, RU_END],
    },
    {
      // 1 เม.ย. 2456: the line opens Kantang-Huai Yot; the terminus by the wharf is called "สถานีตรัง"
      id: 'train',
      kind: 'trade',
      t: [21, 27],
      year: {hold: 1913},
      caption: {t0: 21.1, title: 'รถไฟถึงท่าเรือกันตัง', sub: 'สินค้าจากรถไฟขึ้นเรือไปปีนัง'},
      callouts: [{label: 'สถานีกันตัง', dx: 120, dy: -160, p: [KT_STATION[0] + 0.45, 1.0, KT_STATION[1] + 0.8], t0: 24.4, t1: 26.8}],
      camera: [TR_IN, TR_END],
    },
    {
      // floods, disease and the Emden scare: the town moves up the line to Thap Thiang (1 ม.ค. 2458 old count = 2459: no
      // year); Rama VI gave leave after his visit
      id: 'move',
      kind: 'disaster',
      t: [27, 33],
      year: [1914, 1922],
      caption: {t0: 27.1, title: 'น้ำท่วม ย้ายไปทับเที่ยง', sub: 'ร.6 โปรดให้ย้ายขึ้นที่ดอน ห่างจากทะเล'},
      callouts: [{label: 'ทับเที่ยง', dx: 120, dy: -160, p: [0.05, 1.2, -2.55], t0: 32.0, t1: 33.0}],
      camera: [MO_IN, MO_A, ...glide(MO_A, MO_END, 6, 0.8)],
    },
    {
      // the grow shot: Thap Thiang fills round the station and the clock tower and spreads along the roads; rubber gardens
      // spread over the land between the towns
      id: 'grow',
      kind: 'grow',
      t: [33, 40.6],
      year: [1923, 1995],
      caption: {t0: 33.1, title: 'ทับเที่ยงโตเป็นเมืองตรัง', sub: 'สวนยางเต็มแผ่นดินระหว่างสองเมือง'},
      callouts: [{label: 'สถานีรถไฟตรัง', dx: 120, dy: -160, p: [TR_STATION[0] + 0.9, 1.0, TR_STATION[1] + 0.2], t0: 36.6, t1: 40.2}],
      camera: [GR_IN, GR_END],
    },
    {
      // the far place: long-tails out of the mouth to Ko Libong (drawn closer), the dugongs' home (no numbers, no year)
      id: 'sea',
      kind: 'arrive',
      t: [41, 45.2],
      year: [1996, 2010],
      caption: {t0: 41.1, title: 'ทะเลตรัง บ้านของพะยูน', sub: 'เรือหางยาวพาไปดูที่เกาะลิบง'},
      callouts: [{label: 'เกาะลิบง', dx: -120, dy: -160, p: [LIBONG[0] + 0.5, 1.0, LIBONG[1]], t0: 43.0, t1: 45.2}],
      camera: [SE_IN, SE_END],
    },
    {
      // the payoff: morning roast pork and dim sum in the park by the clock tower; the cover's rubber tree over the tables
      id: 'breakfast',
      kind: 'celebrate',
      t: [46.4, 54.4],
      year: [2011, 2025.5],
      caption: {t0: 46.5, t1: 53.8, title: 'หมูย่าง ติ่มซำ มื้อเช้าตรัง', sub: 'ร้านอาหารเช้าเต็มเมืองทุกวัน'},
      callouts: [{label: 'ต้นยางพารา', dx: -130, dy: -160, p: [BREAKFAST[0] - 0.6, 3.6, BREAKFAST[1] - 1.5], t0: 48.6, t1: 53.6}],
      camera: [BR_IN, BR_END],
    },
    {id: 'today', kind: 'today', t: [54.6, 56.4], year: [2025.6, 2026]},
  ],
});

export const DURATION = STORY.duration;
export const yearAt = STORY.yearAt;
export const CAPTIONS = STORY.captions;
export const ERAS = STORY.eras;
